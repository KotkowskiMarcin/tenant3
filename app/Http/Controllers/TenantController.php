<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TenantController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $tenants = Tenant::orderBy('last_name')
            ->orderBy('first_name')
            ->paginate(15);

        return Inertia::render('Tenants/Index', [
            'tenants' => $tenants,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Tenants/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:tenants,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'pesel' => 'nullable|string|size:11|unique:tenants,pesel',
            'id_number' => 'nullable|string|max:50',
            'other_id_document' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        Tenant::create($validated);

        return redirect()->route('tenants.index')
            ->with('success', 'Najemca został utworzony pomyślnie.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Tenant $tenant)
    {
        // Pobierz najmy ręcznie z pivot data
        $allRentals = $tenant->allRentals()->with('property')->get();

        return Inertia::render('Tenants/Show', [
            'tenant' => $tenant,
            'rentals' => $allRentals->toArray(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Tenant $tenant)
    {
        return Inertia::render('Tenants/Edit', [
            'tenant' => $tenant,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Tenant $tenant)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:tenants,email,' . $tenant->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'pesel' => 'nullable|string|size:11|unique:tenants,pesel,' . $tenant->id,
            'id_number' => 'nullable|string|max:50',
            'other_id_document' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $tenant->update($validated);

        return redirect()->route('tenants.index')
            ->with('success', 'Najemca został zaktualizowany pomyślnie.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Tenant $tenant)
    {
        $tenant->delete();

        return redirect()->route('tenants.index')
            ->with('success', 'Najemca został usunięty pomyślnie.');
    }
}
