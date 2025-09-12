<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Property;
use App\Models\FeeType;
use App\Services\PaymentService;
use App\Services\FeeTypeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    protected $paymentService;
    protected $feeTypeService;

    public function __construct(PaymentService $paymentService, FeeTypeService $feeTypeService)
    {
        $this->paymentService = $paymentService;
        $this->feeTypeService = $feeTypeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->only(['start_date', 'end_date', 'fee_type_id', 'status', 'min_amount', 'max_amount']);
        
        $payments = Payment::with(['property.owner', 'feeType'])
            ->when(isset($filters['start_date']) && isset($filters['end_date']) && $filters['start_date'] && $filters['end_date'], function ($query) use ($filters) {
                return $query->dateRange($filters['start_date'], $filters['end_date']);
            })
            ->when(isset($filters['fee_type_id']) && $filters['fee_type_id'], function ($query, $feeTypeId) {
                return $query->where('fee_type_id', $feeTypeId);
            })
            ->when(isset($filters['status']) && $filters['status'], function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when(isset($filters['min_amount']) && $filters['min_amount'], function ($query, $minAmount) {
                return $query->where('amount', '>=', $minAmount);
            })
            ->when(isset($filters['max_amount']) && $filters['max_amount'], function ($query, $maxAmount) {
                return $query->where('amount', '<=', $maxAmount);
            })
            ->orderBy('payment_date', 'desc')
            ->paginate(15);

        $feeTypes = FeeType::with('property')->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'feeTypes' => $feeTypes,
            'filters' => $filters,
            'paymentMethodOptions' => Payment::getPaymentMethodOptions(),
            'statusOptions' => Payment::getStatusOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $propertyId = $request->get('property_id');
        $properties = Property::with('owner')->orderBy('name')->get();
        $feeTypes = FeeType::active()->with('property')->get();

        return Inertia::render('Payments/Create', [
            'properties' => $properties,
            'feeTypes' => $feeTypes,
            'selectedPropertyId' => $propertyId,
            'paymentMethodOptions' => Payment::getPaymentMethodOptions(),
            'statusOptions' => Payment::getStatusOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'fee_type_id' => 'nullable|exists:fee_types,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
            'payment_method' => 'required|in:bank_transfer,cash,card,other',
            'status' => 'required|in:completed,pending,failed',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Konwertuj pusty string na null dla fee_type_id
        if (isset($validated['fee_type_id']) && $validated['fee_type_id'] === '') {
            $validated['fee_type_id'] = null;
        }

        $this->paymentService->create($validated);

        return redirect()->route('payments.index')
            ->with('success', 'Płatność została utworzona pomyślnie.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Payment $payment)
    {
        $payment->load(['property.owner', 'feeType']);

        return Inertia::render('Payments/Show', [
            'payment' => $payment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Payment $payment)
    {
        $properties = Property::with('owner')->orderBy('name')->get();
        $feeTypes = FeeType::active()->with('property')->get();

        return Inertia::render('Payments/Edit', [
            'payment' => $payment,
            'properties' => $properties,
            'feeTypes' => $feeTypes,
            'paymentMethodOptions' => Payment::getPaymentMethodOptions(),
            'statusOptions' => Payment::getStatusOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Payment $payment)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'fee_type_id' => 'nullable|exists:fee_types,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
            'payment_method' => 'required|in:bank_transfer,cash,card,other',
            'status' => 'required|in:completed,pending,failed',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $payment->update($validated);

        // Sprawdź czy to żądanie Inertia.js
        if (request()->header('X-Inertia')) {
            return back()->with('success', 'Płatność została zaktualizowana pomyślnie.');
        }

        return redirect()->route('payments.index')
            ->with('success', 'Płatność została zaktualizowana pomyślnie.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Payment $payment)
    {
        $this->paymentService->delete($payment);

        // Sprawdź czy to żądanie Inertia.js
        if (request()->header('X-Inertia')) {
            return back()->with('success', 'Płatność została usunięta pomyślnie.');
        }

        return redirect()->route('payments.index')
            ->with('success', 'Płatność została usunięta pomyślnie.');
    }

    /**
     * Get required payments for a property.
     */
    public function required(Property $property, Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);
        
        $requiredPayments = $this->feeTypeService->getRequiredPaymentsForMonth($property, $year, $month);

        return Inertia::render('Payments/Required', [
            'property' => $property,
            'requiredPayments' => $requiredPayments,
            'year' => $year,
            'month' => $month,
        ]);
    }

    /**
     * Create payments for required fees.
     */
    public function createRequired(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'required_payments' => 'required|array',
            'required_payments.*.fee_type_id' => 'required|exists:fee_types,id',
            'payment_date' => 'required|date',
            'payment_method' => 'required|in:bank_transfer,cash,card,other',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        $property = Property::findOrFail($validated['property_id']);
        
        $paymentData = [
            'payment_date' => $validated['payment_date'],
            'payment_method' => $validated['payment_method'],
            'reference_number' => $validated['reference_number'],
            'notes' => $validated['notes'],
            'status' => 'completed',
        ];

        $createdPayments = $this->paymentService->createMultiplePayments(
            $property, 
            $validated['required_payments'], 
            $paymentData
        );

        return redirect()->route('properties.show', $property)
            ->with('success', 'Utworzono ' . count($createdPayments) . ' płatności pomyślnie.');
    }

    /**
     * Get payment statistics for a property.
     */
    public function statistics(Property $property, Request $request)
    {
        $year = $request->get('year', now()->year);
        
        $statistics = $this->paymentService->getPaymentStatistics($property, $year);
        $paymentsByFeeType = $this->paymentService->getPaymentsByFeeType($property, $year);

        return Inertia::render('Payments/Statistics', [
            'property' => $property,
            'statistics' => $statistics,
            'paymentsByFeeType' => $paymentsByFeeType,
            'year' => $year,
        ]);
    }

    /**
     * Display a listing of payments for a specific property.
     */
    public function indexForProperty(Property $property, Request $request)
    {
        $filters = $request->only(['start_date', 'end_date', 'fee_type_id', 'status', 'min_amount', 'max_amount']);
        
        $payments = Payment::where('property_id', $property->id)
            ->with(['property.owner', 'feeType'])
            ->when(isset($filters['start_date']) && isset($filters['end_date']) && $filters['start_date'] && $filters['end_date'], function ($query) use ($filters) {
                return $query->dateRange($filters['start_date'], $filters['end_date']);
            })
            ->when(isset($filters['fee_type_id']) && $filters['fee_type_id'], function ($query, $feeTypeId) {
                return $query->where('fee_type_id', $feeTypeId);
            })
            ->when(isset($filters['status']) && $filters['status'], function ($query, $status) {
                return $query->where('status', $status);
            })
            ->when(isset($filters['min_amount']) && $filters['min_amount'], function ($query, $minAmount) {
                return $query->where('amount', '>=', $minAmount);
            })
            ->when(isset($filters['max_amount']) && $filters['max_amount'], function ($query, $maxAmount) {
                return $query->where('amount', '<=', $maxAmount);
            })
            ->orderBy('payment_date', 'desc')
            ->paginate(15);

        $feeTypes = FeeType::where('property_id', $property->id)->with('property')->get();

        return Inertia::render('Payments/Index', [
            'payments' => $payments,
            'feeTypes' => $feeTypes,
            'filters' => $filters,
            'paymentMethodOptions' => Payment::getPaymentMethodOptions(),
            'statusOptions' => Payment::getStatusOptions(),
            'property' => $property,
            'isPropertySpecific' => true,
        ]);
    }

    /**
     * Show the form for creating a new payment for a specific property.
     */
    public function createForProperty(Property $property)
    {
        $feeTypes = FeeType::where('property_id', $property->id)->active()->with('property')->get();

        return Inertia::render('Payments/Create', [
            'properties' => collect([$property]),
            'feeTypes' => $feeTypes,
            'selectedPropertyId' => $property->id,
            'paymentMethodOptions' => Payment::getPaymentMethodOptions(),
            'statusOptions' => Payment::getStatusOptions(),
            'property' => $property,
            'isPropertySpecific' => true,
        ]);
    }

    /**
     * Store a newly created payment for a specific property.
     */
    public function storeForProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'fee_type_id' => 'nullable|exists:fee_types,id',
            'amount' => 'required|numeric|min:0',
            'payment_date' => 'required|date',
            'due_date' => 'nullable|date',
            'description' => 'nullable|string',
            'payment_method' => 'required|in:bank_transfer,cash,card,other',
            'status' => 'required|in:completed,pending,failed',
            'reference_number' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
        ]);

        // Konwertuj pusty string na null dla fee_type_id
        if (isset($validated['fee_type_id']) && $validated['fee_type_id'] === '') {
            $validated['fee_type_id'] = null;
        }

        $validated['property_id'] = $property->id;
        $this->paymentService->create($validated);

        return back()->with('success', 'Płatność została utworzona pomyślnie.');
    }
}
