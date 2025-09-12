<?php

namespace App\Http\Controllers;

use App\Models\FeeType;
use App\Models\Property;
use App\Services\FeeTypeService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FeeTypeController extends Controller
{
    protected $feeTypeService;

    public function __construct(FeeTypeService $feeTypeService)
    {
        $this->feeTypeService = $feeTypeService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $feeTypes = FeeType::with(['property.owner'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('FeeTypes/Index', [
            'feeTypes' => $feeTypes,
            'frequencyTypeOptions' => FeeType::getFrequencyTypeOptions(),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $properties = Property::with('owner')->orderBy('name')->get();

        return Inertia::render('FeeTypes/Create', [
            'properties' => $properties,
            'frequencyTypeOptions' => FeeType::getFrequencyTypeOptions(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'frequency_type' => 'required|in:monthly,quarterly,biannual,annual,specific_month,none',
            'frequency_value' => 'nullable|integer|min:1|max:12',
            'is_active' => 'boolean',
        ]);

        $this->feeTypeService->create($validated);

        return redirect()->route('fee-types.index')
            ->with('success', 'Szablon opłaty został utworzony pomyślnie.');
    }

    /**
     * Display the specified resource.
     */
    public function show(FeeType $feeType)
    {
        $feeType->load(['property.owner', 'payments']);

        return Inertia::render('FeeTypes/Show', [
            'feeType' => $feeType,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(FeeType $feeType)
    {
        $properties = Property::with('owner')->orderBy('name')->get();

        return Inertia::render('FeeTypes/Edit', [
            'feeType' => $feeType,
            'properties' => $properties,
            'frequencyTypeOptions' => FeeType::getFrequencyTypeOptions(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, FeeType $feeType)
    {
        $validated = $request->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'frequency_type' => 'required|in:monthly,quarterly,biannual,annual,specific_month,none',
            'frequency_value' => 'nullable|integer|min:1|max:12',
            'is_active' => 'boolean',
        ]);

        $this->feeTypeService->update($feeType, $validated);

        // Sprawdź czy to żądanie AJAX/Inertia
        if (request()->header('X-Inertia')) {
            return back()->with('success', 'Szablon opłaty został zaktualizowany pomyślnie.');
        }

        return redirect()->route('fee-types.index')
            ->with('success', 'Szablon opłaty został zaktualizowany pomyślnie.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(FeeType $feeType)
    {
        $this->feeTypeService->deactivate($feeType);

        return redirect()->route('fee-types.index')
            ->with('success', 'Szablon opłaty został dezaktywowany pomyślnie.');
    }

    /**
     * Get payment schedule for a fee type.
     */
    public function schedule(FeeType $feeType, Request $request)
    {
        $year = $request->get('year', now()->year);
        $schedule = $this->feeTypeService->generatePaymentSchedule($feeType->property, $year);

        return Inertia::render('FeeTypes/Schedule', [
            'feeType' => $feeType,
            'schedule' => $schedule,
            'year' => $year,
        ]);
    }

    /**
     * Display a listing of fee types for a specific property.
     */
    public function indexForProperty(Property $property)
    {
        $feeTypes = FeeType::where('property_id', $property->id)
            ->with(['property.owner'])
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return Inertia::render('FeeTypes/Index', [
            'feeTypes' => $feeTypes,
            'frequencyTypeOptions' => FeeType::getFrequencyTypeOptions(),
            'property' => $property,
            'isPropertySpecific' => true,
        ]);
    }

    /**
     * Show the form for creating a new fee type for a specific property.
     */
    public function createForProperty(Property $property)
    {
        return Inertia::render('FeeTypes/Create', [
            'properties' => collect([$property]),
            'frequencyTypeOptions' => FeeType::getFrequencyTypeOptions(),
            'selectedPropertyId' => $property->id,
            'property' => $property,
            'isPropertySpecific' => true,
        ]);
    }

    /**
     * Store a newly created fee type for a specific property.
     */
    public function storeForProperty(Request $request, Property $property)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'frequency_type' => 'required|in:monthly,quarterly,biannual,annual,specific_month,none',
            'frequency_value' => 'nullable|integer|min:1|max:12',
            'is_active' => 'boolean',
        ]);

        $validated['property_id'] = $property->id;
        $this->feeTypeService->create($validated);

        return redirect()->route('properties.fee-types.index', $property)
            ->with('success', 'Szablon opłaty został utworzony pomyślnie.');
    }
}
