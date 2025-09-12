<?php

namespace App\Http\Controllers;

use App\Models\Owner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OwnerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $owners = Owner::withCount('properties')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Owners/Index', [
            'owners' => $owners,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Owners/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:owners',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        Owner::create($validated);

        return redirect()->route('owners.index')
            ->with('success', 'Właściciel został utworzony pomyślnie.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Owner $owner)
    {
        $owner->load('properties');

        return Inertia::render('Owners/Show', [
            'owner' => $owner,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Owner $owner)
    {
        return Inertia::render('Owners/Edit', [
            'owner' => $owner,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Owner $owner)
    {
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:owners,email,' . $owner->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);

        $owner->update($validated);

        return redirect()->route('owners.index')
            ->with('success', 'Właściciel został zaktualizowany pomyślnie.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Owner $owner)
    {
        $owner->delete();

        return redirect()->route('owners.index')
            ->with('success', 'Właściciel został usunięty pomyślnie.');
    }
}
