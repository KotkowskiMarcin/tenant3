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
        $rental->load(['property', 'tenants', 'attachments', 'tenants.events' => function($query) {
            $query->with('createdBy')->orderBy('created_at', 'desc')->limit(10);
        }]);
        
        // Dodaj pole is_active do obiektu rental
        $rental->is_active = $rental->isActive();

        // Pobierz wszystkich najemców do dodawania
        $allTenants = Tenant::orderBy('last_name')->orderBy('first_name')->get();

        return Inertia::render('Rentals/Show', [
            'rental' => $rental,
            'allTenants' => $allTenants,
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
}
