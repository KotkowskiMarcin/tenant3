<?php

namespace App\Http\Controllers;

use App\Models\Rental;
use App\Models\Property;
use App\Models\Tenant;
use App\Models\TenantEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RentalController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rentals = Rental::with(['property', 'tenants'])
            ->orderBy('start_date', 'desc')
            ->paginate(15);

        return Inertia::render('Rentals/Index', [
            'rentals' => $rentals,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $properties = Property::orderBy('name')->get();
        $tenants = Tenant::orderBy('last_name')->orderBy('first_name')->get();
        
        $billingTypeOptionsRaw = Rental::getBillingTypeOptions();
        $billingTypeOptions = array_map(function($value, $key) {
            return ['value' => $key, 'label' => $value];
        }, $billingTypeOptionsRaw, array_keys($billingTypeOptionsRaw));

        return Inertia::render('Rentals/Create', [
            'properties' => $properties,
            'tenants' => $tenants,
            'billingTypeOptions' => $billingTypeOptions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'primary_tenant_id' => 'required|exists:tenants,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'rent_amount' => 'required|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'billing_type' => 'nullable|in:invoice,receipt',
            'invoice_data' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Utwórz najem
        $rental = Rental::create([
            'property_id' => $validated['property_id'],
            'tenant_id' => $validated['primary_tenant_id'], // Zachowaj dla kompatybilności wstecznej
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'rent_amount' => $validated['rent_amount'],
            'deposit_amount' => $validated['deposit_amount'],
            'billing_type' => $validated['billing_type'],
            'invoice_data' => $validated['invoice_data'],
            'notes' => $validated['notes'],
        ]);

        // Dodaj najemcę głównego do tabeli pivot
        $rental->tenants()->attach($validated['primary_tenant_id'], ['is_primary' => true]);

        return redirect()->route('rentals.index')
            ->with('success', 'Najem został utworzony pomyślnie.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Rental $rental)
    {
        $rental->load(['property.meters', 'tenants', 'attachments', 'tenants.events' => function($query) {
            $query->with('createdBy')->orderBy('created_at', 'desc')->limit(10);
        }]);
        
        // Dodaj pole is_active do obiektu rental
        $rental->is_active = $rental->isActive();

        // Pobierz wszystkich najemców do dodawania
        $allTenants = Tenant::orderBy('last_name')->orderBy('first_name')->get();

        // Pobierz rozliczenia miesięczne dla najmu
        $settlements = $rental->monthlySettlements()
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        // Pobierz dane finansowe
        try {
            $financialData = $this->getFinancialDataInternal($rental);
        } catch (\Exception $e) {
            \Log::error('Error generating financial data: ' . $e->getMessage());
            $financialData = [
                'summary' => ['total_revenue' => 0, 'paid_revenue' => 0, 'unpaid_revenue' => 0, 'settlements_count' => 0],
                'expense_breakdown' => ['rent' => 0, 'meters' => [], 'other' => 0],
                'chart_data' => [],
                'monthly_stats' => [],
                'filters' => ['start_date' => $rental->start_date->format('Y-m-d'), 'end_date' => now()->format('Y-m-d')]
            ];
        }

        return Inertia::render('Rentals/Show', [
            'rental' => $rental,
            'allTenants' => $allTenants,
            'settlements' => $settlements,
            'financialData' => $financialData,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Rental $rental)
    {
        $rental->load(['tenants']);
        
        $properties = Property::orderBy('name')->get();
        $tenants = Tenant::orderBy('last_name')->orderBy('first_name')->get();
        
        $billingTypeOptionsRaw = Rental::getBillingTypeOptions();
        $billingTypeOptions = array_map(function($value, $key) {
            return ['value' => $key, 'label' => $value];
        }, $billingTypeOptionsRaw, array_keys($billingTypeOptionsRaw));

        return Inertia::render('Rentals/Edit', [
            'rental' => $rental,
            'properties' => $properties,
            'tenants' => $tenants,
            'billingTypeOptions' => $billingTypeOptions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Rental $rental)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'tenant_id' => 'required|exists:tenants,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'rent_amount' => 'required|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'billing_type' => 'nullable|in:invoice,receipt',
            'invoice_data' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $rental->update($validated);

        // Zaktualizuj najemcę głównego w tabeli pivot
        $rental->tenants()->updateExistingPivot($validated['tenant_id'], ['is_primary' => true]);

        return redirect()->route('rentals.index')
            ->with('success', 'Najem został zaktualizowany pomyślnie.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Rental $rental)
    {
        // Usuń wszystkie powiązania z najemcami
        $rental->tenants()->detach();
        
        $rental->delete();

        return redirect()->route('rentals.index')
            ->with('success', 'Najem został usunięty pomyślnie.');
    }

    /**
     * Display rentals for a specific property.
     */
    public function indexForProperty(Property $property)
    {
        $rentals = $property->rentals()
            ->with('tenants')
            ->orderBy('start_date', 'desc')
            ->paginate(15);

        return Inertia::render('Properties/Rentals/Index', [
            'property' => $property,
            'rentals' => $rentals,
        ]);
    }

    /**
     * Show the form for creating a new rental for a specific property.
     */
    public function createForProperty(Property $property)
    {
        $tenants = Tenant::orderBy('last_name')->orderBy('first_name')->get();

        return Inertia::render('Properties/Rentals/Create', [
            'property' => $property,
            'tenants' => $tenants,
        ]);
    }

    /**
     * Store a newly created rental for a specific property.
     */
    public function storeForProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'primary_tenant_id' => 'required|exists:tenants,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after:start_date',
            'rent_amount' => 'required|numeric|min:0',
            'deposit_amount' => 'nullable|numeric|min:0',
            'billing_type' => 'nullable|in:invoice,receipt',
            'invoice_data' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        // Utwórz najem
        $rental = Rental::create([
            'property_id' => $property->id,
            'tenant_id' => $validated['primary_tenant_id'], // Zachowaj dla kompatybilności wstecznej
            'start_date' => $validated['start_date'],
            'end_date' => $validated['end_date'],
            'rent_amount' => $validated['rent_amount'],
            'deposit_amount' => $validated['deposit_amount'],
            'billing_type' => $validated['billing_type'],
            'invoice_data' => $validated['invoice_data'],
            'notes' => $validated['notes'],
        ]);

        // Dodaj najemcę głównego do tabeli pivot
        $rental->tenants()->attach($validated['primary_tenant_id'], ['is_primary' => true]);

        return redirect()->route('properties.show', $property)
            ->with('success', 'Najem został utworzony pomyślnie.');
    }

    /**
     * Add additional tenant to rental.
     */
    public function addTenant(Request $request, Rental $rental)
    {
        $validated = $request->validate([
            'tenant_id' => 'required|exists:tenants,id',
        ]);

        // Sprawdź czy najemca już nie jest przypisany do tego najmu
        if ($rental->tenants()->where('tenant_id', $validated['tenant_id'])->exists()) {
            return back()->withErrors(['tenant_id' => 'Ten najemca jest już przypisany do tego najmu.']);
        }

        // Dodaj najemcę jako dodatkowego
        $rental->tenants()->attach($validated['tenant_id'], ['is_primary' => false]);

        // Loguj zdarzenie
        $this->logTenantEvent(
            $validated['tenant_id'],
            $rental->id,
            $rental->property_id,
            'added',
            "Dodano najemcę do najmu",
            ['is_primary' => false]
        );

        return back()->with('success', 'Najemca został dodany pomyślnie.');
    }

    /**
     * Remove tenant from rental.
     */
    public function removeTenant(Rental $rental, Tenant $tenant)
    {
        // Sprawdź czy to nie jest najemca główny
        $pivot = $rental->tenants()->where('tenant_id', $tenant->id)->first();
        if ($pivot && $pivot->pivot->is_primary) {
            return back()->withErrors(['tenant' => 'Nie można usunąć najemcy głównego.']);
        }

        $rental->tenants()->detach($tenant->id);

        // Loguj zdarzenie
        $this->logTenantEvent(
            $tenant->id,
            $rental->id,
            $rental->property_id,
            'removed',
            "Usunięto najemcę z najmu"
        );

        return back()->with('success', 'Najemca został usunięty pomyślnie.');
    }

    /**
     * Set primary tenant for rental.
     */
    public function setPrimaryTenant(Rental $rental, Tenant $tenant)
    {
        // Sprawdź czy najemca jest przypisany do tego najmu
        if (!$rental->tenants()->where('tenant_id', $tenant->id)->exists()) {
            return back()->withErrors(['tenant' => 'Ten najemca nie jest przypisany do tego najmu.']);
        }

        // Sprawdź czy najemca już nie jest główny
        $currentPrimary = $rental->tenants()->wherePivot('is_primary', true)->first();
        if ($currentPrimary && $currentPrimary->id === $tenant->id) {
            return back()->withErrors(['tenant' => 'Ten najemca już jest najemcą głównym.']);
        }

        // Znajdź poprzedniego najemcę głównego
        $previousPrimary = $rental->tenants()->wherePivot('is_primary', true)->first();

        // Użyj transakcji aby zapewnić atomowość operacji
        DB::transaction(function () use ($rental, $tenant, $previousPrimary) {
            // Najpierw usuń status głównego z poprzedniego najemcy (jeśli istnieje)
            if ($previousPrimary) {
                $rental->tenants()->updateExistingPivot($previousPrimary->id, ['is_primary' => false]);
            }

            // Następnie ustaw nowego najemcę głównego
            $rental->tenants()->updateExistingPivot($tenant->id, ['is_primary' => true]);

            // Zaktualizuj pole tenant_id dla kompatybilności wstecznej
            $rental->update(['tenant_id' => $tenant->id]);
        });

        // Loguj zdarzenia
        if ($previousPrimary && $previousPrimary->id !== $tenant->id) {
            $this->logTenantEvent(
                $previousPrimary->id,
                $rental->id,
                $rental->property_id,
                'unset_primary',
                "Odebrano status najemcy głównego"
            );
        }

        $this->logTenantEvent(
            $tenant->id,
            $rental->id,
            $rental->property_id,
            'set_primary',
            "Ustawiono jako najemcę głównego"
        );

        return back()->with('success', 'Najemca główny został zmieniony pomyślnie.');
    }

    /**
     * Log tenant event.
     */
    private function logTenantEvent($tenantId, $rentalId, $propertyId, $eventType, $description = null, $metadata = null)
    {
        TenantEvent::create([
            'tenant_id' => $tenantId,
            'rental_id' => $rentalId,
            'property_id' => $propertyId,
            'event_type' => $eventType,
            'description' => $description,
            'metadata' => $metadata,
            'created_by' => Auth::id(),
        ]);
    }

    /**
     * Get financial data for rental with filters.
     */
    public function getFinancialData(Request $request, Rental $rental)
    {
        try {
            $financialData = $this->getFinancialDataInternal($rental, $request->input('start_date'), $request->input('end_date'));
            
            // Pobierz dane potrzebne do komponentu Show
            $rental->load(['property.meters', 'tenants', 'attachments', 'tenants.events' => function($query) {
                $query->with('createdBy')->orderBy('created_at', 'desc')->limit(10);
            }]);
            
            // Dodaj pole is_active do obiektu rental
            $rental->is_active = $rental->isActive();

            // Pobierz wszystkich najemców do dodawania
            $allTenants = Tenant::orderBy('last_name')->orderBy('first_name')->get();

            // Pobierz rozliczenia miesięczne dla najmu
            $settlements = $rental->monthlySettlements()
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get();
            
            return Inertia::render('Rentals/Show', [
                'rental' => $rental,
                'allTenants' => $allTenants,
                'settlements' => $settlements,
                'financialData' => $financialData,
                'tab' => $request->input('tab', 'financial'), // Użyj parametru tab z żądania lub domyślnie 'financial'
                'only' => ['financialData'] // Tylko dane finansowe będą przekazane do frontendu
            ]);
        } catch (\Exception $e) {
            \Log::error('Error generating financial data: ' . $e->getMessage());
            
            $errorFinancialData = [
                'summary' => ['total_revenue' => 0, 'paid_revenue' => 0, 'unpaid_revenue' => 0, 'settlements_count' => 0],
                'expense_breakdown' => ['rent' => 0, 'meters' => [], 'other' => 0],
                'chart_data' => [],
                'monthly_stats' => [],
                'filters' => ['start_date' => $rental->start_date->format('Y-m-d'), 'end_date' => now()->format('Y-m-d')]
            ];
            
            // Pobierz dane potrzebne do komponentu Show nawet w przypadku błędu
            $rental->load(['property.meters', 'tenants', 'attachments', 'tenants.events' => function($query) {
                $query->with('createdBy')->orderBy('created_at', 'desc')->limit(10);
            }]);
            
            $rental->is_active = $rental->isActive();
            $allTenants = Tenant::orderBy('last_name')->orderBy('first_name')->get();
            $settlements = $rental->monthlySettlements()
                ->orderBy('year', 'desc')
                ->orderBy('month', 'desc')
                ->get();
            
            return Inertia::render('Rentals/Show', [
                'rental' => $rental,
                'allTenants' => $allTenants,
                'settlements' => $settlements,
                'financialData' => $errorFinancialData,
                'tab' => $request->input('tab', 'financial'), // Użyj parametru tab z żądania lub domyślnie 'financial'
                'only' => ['financialData']
            ]);
        }
    }


    /**
     * Internal method to get financial data for rental.
     */
    private function getFinancialDataInternal($rental, $startDate = null, $endDate = null)
    {
        // Zabezpieczenia dla dat
        if ($startDate) {
            $startDate = \Carbon\Carbon::parse($startDate);
        } else {
            $startDate = $rental->start_date ? \Carbon\Carbon::parse($rental->start_date) : \Carbon\Carbon::now()->subYear();
        }
        
        if ($endDate) {
            $endDate = \Carbon\Carbon::parse($endDate);
        } else {
            $endDate = $rental->end_date ? \Carbon\Carbon::parse($rental->end_date) : \Carbon\Carbon::now();
        }
        
        error_log('FinancialData DEBUG: Rental ID: ' . $rental->id);
        
        // Pobierz rozliczenia z filtrowaniem według dat
        $settlements = $rental->monthlySettlements()
            ->where(function($query) use ($startDate, $endDate) {
                $query->where(function($q) use ($startDate, $endDate) {
                    $q->where('year', '>', $startDate->year)
                      ->orWhere(function($q2) use ($startDate) {
                          $q2->where('year', '=', $startDate->year)
                             ->where('month', '>=', $startDate->month);
                      });
                })
                ->where(function($q) use ($startDate, $endDate) {
                    $q->where('year', '<', $endDate->year)
                      ->orWhere(function($q2) use ($endDate) {
                          $q2->where('year', '=', $endDate->year)
                             ->where('month', '<=', $endDate->month);
                      });
                });
            })
            ->orderBy('year', 'asc')
            ->orderBy('month', 'asc')
            ->get();
            
        // Debug - sprawdź czy rozliczenia są pobierane
        \Log::info('FinancialData: Found ' . $settlements->count() . ' settlements for rental ' . $rental->id);

        // Oblicz przychody (tylko opłacone rozliczenia)
        $paidSettlements = $settlements->where('status', 'paid');
        $totalRevenue = $paidSettlements->sum('total_amount');
        $paidRevenue = $paidSettlements->sum('total_amount');
        $unpaidRevenue = $settlements->where('status', 'unpaid')->sum('total_amount');

        // Analiza składników opłat
        $expenseBreakdown = [
            'rent' => 0,
            'meters' => [],
            'other' => 0
        ];

        // Analiza składników opłat tylko dla opłaconych rozliczeń
        foreach ($paidSettlements as $settlement) {
            if (is_array($settlement->components)) {
                foreach ($settlement->components as $component) {
                    if ($component['type'] === 'rent') {
                        $expenseBreakdown['rent'] += $component['amount'];
                    } elseif ($component['type'] === 'meter') {
                        $meterName = $component['name'];
                        if (!isset($expenseBreakdown['meters'][$meterName])) {
                            $expenseBreakdown['meters'][$meterName] = 0;
                        }
                        $expenseBreakdown['meters'][$meterName] += $component['amount'];
                    } else {
                        $expenseBreakdown['other'] += $component['amount'];
                    }
                }
            }
        }

        // Przygotuj dane do wykresu (tylko opłacone rozliczenia)
        $chartData = $paidSettlements->map(function($settlement) {
            return [
                'period' => $settlement->year . '-' . str_pad($settlement->month, 2, '0', STR_PAD_LEFT),
                'amount' => $settlement->total_amount,
                'status' => $settlement->status,
                'year' => $settlement->year,
                'month' => $settlement->month
            ];
        })->values();

        // Statystyki miesięczne - tylko opłacone rozliczenia
        $monthlyStats = [];
        
        foreach ($paidSettlements as $settlement) {
            $monthlyStats[] = [
                'period' => $settlement->year . '-' . str_pad($settlement->month, 2, '0', STR_PAD_LEFT),
                'year' => $settlement->year,
                'month' => $settlement->month,
                'month_name' => \Carbon\Carbon::create($settlement->year, $settlement->month, 1)->format('F'),
                'total_amount' => $settlement->total_amount,
                'settlements_count' => 1,
                'paid_amount' => $settlement->total_amount,
                'unpaid_amount' => 0,
            ];
        }
        
        \Log::info('FinancialData: Generated ' . count($monthlyStats) . ' monthly stats');

        $result = [
            'summary' => [
                'total_revenue' => $totalRevenue,
                'paid_revenue' => $paidRevenue,
                'unpaid_revenue' => $unpaidRevenue,
                'settlements_count' => $paidSettlements->count(),
                'period_start' => $startDate->format('Y-m-d'),
                'period_end' => $endDate->format('Y-m-d'),
            ],
            'expense_breakdown' => $expenseBreakdown,
            'chart_data' => $chartData,
            'monthly_stats' => $monthlyStats,
            'filters' => [
                'start_date' => $startDate->format('Y-m-d'),
                'end_date' => $endDate->format('Y-m-d'),
            ]
        ];
        
        // Debug - sprawdź wynik
        \Log::info('FinancialData: Final result - total_revenue: ' . $totalRevenue . ', settlements_count: ' . $settlements->count() . ', monthly_stats_count: ' . count($monthlyStats) . ', chart_data_count: ' . count($chartData));
        
        return $result;
    }
}
