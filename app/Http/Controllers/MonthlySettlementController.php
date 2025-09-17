<?php

namespace App\Http\Controllers;

use App\Models\MonthlySettlement;
use App\Models\Rental;
use App\Models\PropertyMeter;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class MonthlySettlementController extends Controller
{
    /**
     * Display a listing of monthly settlements for a rental.
     */
    public function index(Rental $rental)
    {
        $settlements = $rental->monthlySettlements()
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get();

        return Inertia::render('Rentals/MonthlySettlements/Index', [
            'rental' => $rental->load(['property', 'tenants']),
            'settlements' => $settlements,
        ]);
    }

    /**
     * Show the form for creating a new monthly settlement.
     */
    public function create(Rental $rental)
    {
        $property = $rental->property;
        $meters = $property->meters()->get();
        
        // Pobierz dostępne lata (od daty rozpoczęcia najmu do obecnego roku)
        $startYear = Carbon::parse($rental->start_date)->year;
        $currentYear = now()->year;
        $years = range($startYear, $currentYear);
        
        // Pobierz dostępne miesiące dla wybranego roku
        $months = [];
        $monthNames = [
            1 => 'Styczeń', 2 => 'Luty', 3 => 'Marzec', 4 => 'Kwiecień',
            5 => 'Maj', 6 => 'Czerwiec', 7 => 'Lipiec', 8 => 'Sierpień',
            9 => 'Wrzesień', 10 => 'Październik', 11 => 'Listopad', 12 => 'Grudzień'
        ];
        
        for ($i = 1; $i <= 12; $i++) {
            $months[$i] = $monthNames[$i];
        }

        return Inertia::render('Rentals/MonthlySettlements/Create', [
            'rental' => $rental->load(['property', 'tenants']),
            'meters' => $meters,
            'years' => $years,
            'months' => $months,
        ]);
    }

    /**
     * Store a newly created monthly settlement.
     */
    public function store(Request $request, Rental $rental)
    {
        $validated = $request->validate([
            'year' => 'required|integer|min:2020|max:2030',
            'month' => 'required|integer|min:1|max:12',
            'components' => 'required|array|min:1',
            'components.*.name' => 'required|string|max:255',
            'components.*.amount' => 'required|numeric|min:0',
            'components.*.type' => 'required|string|in:rent,meter,other',
            'components.*.status' => 'required|string|in:active,inactive',
            'components.*.description' => 'nullable|string|max:500',
            'components.*.meter_id' => 'nullable|integer|exists:property_meters,id',
            'components.*.current_reading' => 'nullable|numeric|min:0',
            'components.*.previous_reading' => 'nullable|numeric|min:0',
            'components.*.consumption' => 'nullable|numeric|min:0',
            'components.*.unit_price' => 'nullable|numeric|min:0',
        ]);

        // Sprawdź czy rozliczenie dla tego najmu, roku i miesiąca już istnieje
        $existingSettlement = $rental->monthlySettlements()
            ->where('year', $validated['year'])
            ->where('month', $validated['month'])
            ->first();

        if ($existingSettlement) {
            return back()->withErrors([
                'month' => 'Rozliczenie dla tego najmu, roku i miesiąca już istnieje.'
            ]);
        }

        // Oblicz łączną kwotę
        $totalAmount = 0;
        foreach ($validated['components'] as $component) {
            if ($component['status'] === 'active') {
                $totalAmount += $component['amount'];
            }
        }

        // Utwórz rozliczenie
        $settlement = $rental->monthlySettlements()->create([
            'year' => $validated['year'],
            'month' => $validated['month'],
            'total_amount' => $totalAmount,
            'status' => MonthlySettlement::STATUS_ISSUED,
            'issued_at' => now(),
            'components' => $validated['components'],
        ]);

        return redirect()->route('rentals.show', $rental)->with('tab', 'settlements')
            ->with('success', 'Rozliczenie miesięczne zostało utworzone pomyślnie.');
    }

    /**
     * Display the specified monthly settlement.
     */
    public function show(Rental $rental, MonthlySettlement $monthlySettlement)
    {
        // Sprawdź czy rozliczenie należy do najmu
        if ($monthlySettlement->rental_id !== $rental->id) {
            abort(404);
        }

        return Inertia::render('Rentals/MonthlySettlements/Show', [
            'rental' => $rental->load(['property', 'tenants']),
            'settlement' => $monthlySettlement,
        ]);
    }

    /**
     * Show the form for editing the specified monthly settlement.
     */
    public function edit(Rental $rental, MonthlySettlement $monthlySettlement)
    {
        // Sprawdź czy rozliczenie należy do najmu
        if ($monthlySettlement->rental_id !== $rental->id) {
            abort(404);
        }

        $property = $rental->property;
        $meters = $property->meters()->get();
        
        // Pobierz dostępne lata
        $startYear = Carbon::parse($rental->start_date)->year;
        $currentYear = now()->year;
        $years = range($startYear, $currentYear);
        
        // Pobierz dostępne miesiące
        $months = [];
        $monthNames = [
            1 => 'Styczeń', 2 => 'Luty', 3 => 'Marzec', 4 => 'Kwiecień',
            5 => 'Maj', 6 => 'Czerwiec', 7 => 'Lipiec', 8 => 'Sierpień',
            9 => 'Wrzesień', 10 => 'Październik', 11 => 'Listopad', 12 => 'Grudzień'
        ];
        
        for ($i = 1; $i <= 12; $i++) {
            $months[$i] = $monthNames[$i];
        }

        return Inertia::render('Rentals/MonthlySettlements/Edit', [
            'rental' => $rental->load(['property', 'tenants']),
            'settlement' => $monthlySettlement,
            'meters' => $meters,
            'years' => $years,
            'months' => $months,
        ]);
    }

    /**
     * Update the specified monthly settlement.
     */
    public function update(Request $request, Rental $rental, MonthlySettlement $monthlySettlement)
    {
        // Sprawdź czy rozliczenie należy do najmu
        if ($monthlySettlement->rental_id !== $rental->id) {
            abort(404);
        }

        $validated = $request->validate([
            'year' => 'required|integer|min:2020|max:2030',
            'month' => 'required|integer|min:1|max:12',
            'components' => 'required|array|min:1',
            'components.*.name' => 'required|string|max:255',
            'components.*.amount' => 'required|numeric|min:0',
            'components.*.type' => 'required|string|in:rent,meter,other',
            'components.*.status' => 'required|string|in:active,inactive',
            'components.*.description' => 'nullable|string|max:500',
            'components.*.meter_id' => 'nullable|integer|exists:property_meters,id',
            'components.*.current_reading' => 'nullable|numeric|min:0',
            'components.*.previous_reading' => 'nullable|numeric|min:0',
            'components.*.consumption' => 'nullable|numeric|min:0',
            'components.*.unit_price' => 'nullable|numeric|min:0',
        ]);

        // Sprawdź czy rozliczenie dla tego najmu, roku i miesiąca już istnieje (z wykluczeniem aktualnego)
        $existingSettlement = $rental->monthlySettlements()
            ->where('year', $validated['year'])
            ->where('month', $validated['month'])
            ->where('id', '!=', $monthlySettlement->id)
            ->first();

        if ($existingSettlement) {
            return back()->withErrors([
                'month' => 'Rozliczenie dla tego najmu, roku i miesiąca już istnieje.'
            ]);
        }

        // Oblicz łączną kwotę
        $totalAmount = 0;
        foreach ($validated['components'] as $component) {
            if ($component['status'] === 'active') {
                $totalAmount += $component['amount'];
            }
        }

        // Aktualizuj rozliczenie
        $monthlySettlement->update([
            'year' => $validated['year'],
            'month' => $validated['month'],
            'total_amount' => $totalAmount,
            'components' => $validated['components'],
        ]);

        return redirect()->route('rentals.show', $rental)->with('tab', 'settlements')
            ->with('success', 'Rozliczenie miesięczne zostało zaktualizowane pomyślnie.');
    }

    /**
     * Remove the specified monthly settlement.
     */
    public function destroy(Rental $rental, MonthlySettlement $monthlySettlement)
    {
        // Sprawdź czy rozliczenie należy do najmu
        if ($monthlySettlement->rental_id !== $rental->id) {
            abort(404);
        }

        $monthlySettlement->delete();

        return redirect()->route('rentals.show', $rental)->with('tab', 'settlements')
            ->with('success', 'Rozliczenie miesięczne zostało usunięte pomyślnie.');
    }

    /**
     * Mark settlement as paid.
     */
    public function markAsPaid(Rental $rental, MonthlySettlement $monthlySettlement)
    {
        // Sprawdź czy rozliczenie należy do najmu
        if ($monthlySettlement->rental_id !== $rental->id) {
            abort(404);
        }

        $monthlySettlement->markAsPaid();

        return redirect()->route('rentals.show', $rental)->with('tab', 'settlements')
            ->with('success', 'Rozliczenie zostało oznaczone jako opłacone.');
    }

    /**
     * Get meter data for settlement generation.
     */
    public function getMeterData(Rental $rental, Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer',
        ]);

        $property = $rental->property;
        $meters = $property->meters()->get();
        
        $meterData = [];
        foreach ($meters as $meter) {
            // Pobierz ostatni stan licznika przed wybranym miesiącem
            $previousReading = $meter->current_reading; // To będzie trzeba rozszerzyć o historię
            
            $meterData[] = [
                'id' => $meter->id,
                'name' => $meter->name,
                'serial_number' => $meter->serial_number,
                'unit' => $meter->unit,
                'price_per_unit' => $meter->price_per_unit,
                'previous_reading' => $previousReading,
                'current_reading' => $previousReading, // Domyślnie taki sam jak poprzedni
            ];
        }

        return response()->json($meterData);
    }

    /**
     * Generate default components for settlement.
     */
    public function generateDefaultComponents(Rental $rental, Request $request)
    {
        $validated = $request->validate([
            'year' => 'required|integer',
            'month' => 'required|integer',
        ]);

        $components = [];

        // Dodaj czynsz jako domyślny składnik
        $components[] = [
            'name' => 'Czynsz',
            'amount' => $rental->rent_amount,
            'type' => MonthlySettlement::COMPONENT_TYPE_RENT,
            'status' => MonthlySettlement::COMPONENT_STATUS_ACTIVE,
            'description' => 'Czynsz miesięczny',
        ];

        // Dodaj składniki dla liczników
        $property = $rental->property;
        $meters = $property->meters()->get();
        
        foreach ($meters as $meter) {
            $components[] = [
                'name' => $meter->name,
                'amount' => 0, // Będzie obliczone na podstawie stanu licznika
                'type' => MonthlySettlement::COMPONENT_TYPE_METER,
                'status' => MonthlySettlement::COMPONENT_STATUS_ACTIVE,
                'description' => "Opłata za {$meter->name}",
                'meter_id' => $meter->id,
                'unit' => $meter->unit,
                'price_per_unit' => $meter->price_per_unit,
                'previous_reading' => $meter->current_reading,
                'current_reading' => $meter->current_reading,
                'consumption' => 0,
            ];
        }

        return response()->json($components);
    }
}
