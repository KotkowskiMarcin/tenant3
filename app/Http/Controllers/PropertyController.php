<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Owner;
use App\Models\Payment;
use App\Services\FeeTypeService;
use App\Services\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PropertyController extends Controller
{
    protected $feeTypeService;
    protected $paymentService;

    public function __construct(FeeTypeService $feeTypeService, PaymentService $paymentService)
    {
        $this->feeTypeService = $feeTypeService;
        $this->paymentService = $paymentService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $properties = Property::with(['owner', 'images', 'attachments'])
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Properties/Index', [
            'properties' => $properties,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $owners = Owner::orderBy('first_name')->get();

        return Inertia::render('Properties/Create', [
            'owners' => $owners,
            'statusOptions' => Property::getStatusOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'area' => 'nullable|numeric|min:0',
            'rooms' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'cooperative_info' => 'nullable|string',
            'status' => 'required|in:available,rented,unavailable',
            'owner_id' => 'required|exists:owners,id',
        ]);

        Property::create($validated);

        return redirect()->route('properties.index')
            ->with('success', 'Nieruchomość została utworzona pomyślnie.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Property $property)
    {
        $property->load(['owner', 'images', 'attachments', 'events', 'feeTypes', 'payments', 'rentals.tenant', 'meters']);
        
        // Get financial data
        $currentYear = now()->year;
        $currentMonth = now()->month;
        
        $requiredPayments = $this->feeTypeService->getRequiredPaymentsForMonth($property, $currentYear, $currentMonth);
        $paymentStatistics = $this->paymentService->getPaymentStatistics($property, $currentYear);
        $recentPayments = $property->payments()->with('feeType')->limit(50)->get();
        
        // Generuj powiadomienia o nieopłaconych comiesięcznych opłatach
        $monthlyOverdueNotifications = $this->getMonthlyOverdueNotifications($property, $currentYear, $currentMonth);

        $frequencyOptions = \App\Models\FeeType::getFrequencyTypeOptions();
        $frequencyTypeOptions = array_map(function($value, $key) {
            return ['value' => $key, 'label' => $value];
        }, $frequencyOptions, array_keys($frequencyOptions));


        // Pobierz feeTypes dla nieruchomości
        $feeTypesCollection = \App\Models\FeeType::where('property_id', $property->id)->get();

        // Sprawdź czy to żądanie partial reload
        if (request()->header('X-Inertia-Partial-Data')) {
            $partialData = explode(',', request()->header('X-Inertia-Partial-Data'));
            $responseData = [];
            
            if (in_array('feeTypes', $partialData)) {
                $responseData['feeTypes'] = $feeTypesCollection;
            }
            
            if (in_array('recentPayments', $partialData)) {
                $responseData['recentPayments'] = $recentPayments;
            }
            
            if (in_array('monthlyOverdueNotifications', $partialData)) {
                $responseData['monthlyOverdueNotifications'] = $monthlyOverdueNotifications;
            }
            
            if (!empty($responseData)) {
                return Inertia::render('Properties/Show', $responseData);
            }
        }

        // Konwertuj opcje płatności na format {value, label}
        $paymentMethodOptionsRaw = Payment::getPaymentMethodOptions();
        $paymentMethodOptions = array_map(function($value, $key) {
            return ['value' => $key, 'label' => $value];
        }, $paymentMethodOptionsRaw, array_keys($paymentMethodOptionsRaw));

        $statusOptionsRaw = Payment::getStatusOptions();
        $statusOptions = array_map(function($value, $key) {
            return ['value' => $key, 'label' => $value];
        }, $statusOptionsRaw, array_keys($statusOptionsRaw));

        // Pobierz wszystkich najemców dla modalu
        $allTenants = \App\Models\Tenant::orderBy('last_name')->orderBy('first_name')->get();
        
        // Opcje rozliczania dla najmów
        $billingTypeOptionsRaw = \App\Models\Rental::getBillingTypeOptions();
        $billingTypeOptions = array_map(function($value, $key) {
            return ['value' => $key, 'label' => $value];
        }, $billingTypeOptionsRaw, array_keys($billingTypeOptionsRaw));

            return Inertia::render('Properties/Show', [
            'property' => $property,
            'feeTypes' => $feeTypesCollection,
            'requiredPayments' => $requiredPayments,
            'paymentStatistics' => $paymentStatistics,
            'recentPayments' => $recentPayments,
            'monthlyOverdueNotifications' => $monthlyOverdueNotifications,
            'currentYear' => $currentYear,
            'currentMonth' => $currentMonth,
            'frequencyTypeOptions' => $frequencyTypeOptions,
            'paymentMethodOptions' => $paymentMethodOptions,
            'statusOptions' => $statusOptions,
            'allTenants' => $allTenants,
            'billingTypeOptions' => $billingTypeOptions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Property $property)
    {
        $owners = Owner::orderBy('first_name')->get();

        return Inertia::render('Properties/Edit', [
            'property' => $property,
            'owners' => $owners,
            'statusOptions' => Property::getStatusOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Property $property)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'required|string',
            'area' => 'nullable|numeric|min:0',
            'rooms' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'cooperative_info' => 'nullable|string',
            'status' => 'required|in:available,rented,unavailable',
            'owner_id' => 'required|exists:owners,id',
        ]);

        $property->update($validated);

        return redirect()->route('properties.index')
            ->with('success', 'Nieruchomość została zaktualizowana pomyślnie.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Property $property)
    {
        $property->delete();

        return redirect()->route('properties.index')
            ->with('success', 'Nieruchomość została usunięta pomyślnie.');
    }

    /**
     * Get monthly overdue notifications for the current month.
     */
    private function getMonthlyOverdueNotifications(Property $property, int $year, int $month): array
    {
        $notifications = [];
        
        // Pobierz tylko comiesięczne szablony opłat
        $monthlyFeeTypes = $property->activeFeeTypes()
            ->where('frequency_type', 'monthly')
            ->get();

        foreach ($monthlyFeeTypes as $feeType) {
            // Sprawdź czy płatność została uiszczona w tym miesiącu
            $monthStr = str_pad($month, 2, '0', STR_PAD_LEFT);
            $existingPayment = $property->payments()
                ->where('fee_type_id', $feeType->id)
                ->whereBetween('payment_date', [
                    $year . '-' . $monthStr . '-01 00:00:00',
                    $year . '-' . $monthStr . '-31 23:59:59'
                ])
                ->where('status', 'completed')
                ->first();

            if (!$existingPayment) {
                $notifications[] = [
                    'fee_type_id' => $feeType->id,
                    'name' => $feeType->name,
                    'amount' => $feeType->amount,
                    'description' => $feeType->description,
                    'month' => $month,
                    'year' => $year,
                ];
            }
        }

        return $notifications;
    }
}
