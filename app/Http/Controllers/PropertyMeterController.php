<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyMeter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PropertyMeterController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $property = Property::findOrFail($request->property_id);
        
        return Inertia::render('Properties/Meters/Index', [
            'property' => $property,
            'meters' => $property->meters,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $property = Property::findOrFail($request->property_id);
        
        return Inertia::render('Properties/Meters/Create', [
            'property' => $property,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'property_id' => 'required|exists:properties,id',
            'name' => 'required|string|max:255',
            'serial_number' => 'required|string|max:255',
            'provider' => 'nullable|string',
            'current_reading' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'price_per_unit' => 'required|numeric|min:0',
        ]);

        PropertyMeter::create($request->all());

        return redirect()->back()->with('success', 'Licznik został dodany pomyślnie.');
    }

    /**
     * Display the specified resource.
     */
    public function show(PropertyMeter $propertyMeter)
    {
        return Inertia::render('Properties/Meters/Show', [
            'meter' => $propertyMeter->load('property'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PropertyMeter $propertyMeter)
    {
        return Inertia::render('Properties/Meters/Edit', [
            'meter' => $propertyMeter->load('property'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, PropertyMeter $propertyMeter)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'serial_number' => 'required|string|max:255',
            'provider' => 'nullable|string',
            'current_reading' => 'required|numeric|min:0',
            'unit' => 'required|string|max:50',
            'price_per_unit' => 'required|numeric|min:0',
        ]);

        $propertyMeter->update($request->all());

        return redirect()->back()->with('success', 'Licznik został zaktualizowany pomyślnie.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(PropertyMeter $propertyMeter)
    {
        $propertyMeter->delete();

        return redirect()->back()->with('success', 'Licznik został usunięty pomyślnie.');
    }
}
