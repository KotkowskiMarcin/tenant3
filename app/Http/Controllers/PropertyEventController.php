<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PropertyEventController extends Controller
{
    /**
     * Store a newly created event in storage.
     */
    public function store(Request $request, Property $property)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'event_time' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string',
            'attachment' => 'nullable|file|max:10240', // 10MB max
        ]);

        // Combine date and time (if time is provided)
        $eventDateTime = $validated['event_date'];
        if (!empty($validated['event_time'])) {
            $eventDateTime .= ' ' . $validated['event_time'];
        } else {
            // If no time provided, set to 12:00
            $eventDateTime .= ' 12:00';
        }
        $validated['event_date'] = $eventDateTime;
        unset($validated['event_time']);

        // Handle file upload
        if ($request->hasFile('attachment')) {
            $file = $request->file('attachment');
            $path = $file->store('property-events', 'public');
            $validated['attachment_path'] = $path;
            $validated['attachment_original_name'] = $file->getClientOriginalName();
        }

        $validated['property_id'] = $property->id;
        PropertyEvent::create($validated);

        return redirect()->back()
            ->with('success', 'Zdarzenie zostało dodane pomyślnie.');
    }

    /**
     * Show the form for editing the specified event.
     */
    public function edit(Property $property, PropertyEvent $event)
    {
        return Inertia::render('Properties/Events/Edit', [
            'property' => $property,
            'event' => $event,
        ]);
    }

    /**
     * Update the specified event in storage.
     */
    public function update(Request $request, Property $property, PropertyEvent $event)
    {
        // Prepare validation rules
        $rules = [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'event_date' => 'required|date',
            'event_time' => 'nullable|date_format:H:i',
            'notes' => 'nullable|string',
        ];
        
        // Add file validation only if file is present or being removed
        if ($request->hasFile('attachment')) {
            $rules['attachment'] = 'nullable|file|max:10240';
        }
        
        if ($request->has('remove_attachment')) {
            $rules['remove_attachment'] = 'nullable|boolean';
        }
        
        $validated = $request->validate($rules);

        // Combine date and time (if time is provided)
        $eventDateTime = $validated['event_date'];
        if (!empty($validated['event_time'])) {
            $eventDateTime .= ' ' . $validated['event_time'];
        } else {
            // If no time provided, set to 12:00
            $eventDateTime .= ' 12:00';
        }
        $validated['event_date'] = $eventDateTime;
        unset($validated['event_time']);

        // Handle attachment removal
        if ($request->boolean('remove_attachment', false)) {
            if ($event->attachment_path) {
                Storage::disk('public')->delete($event->attachment_path);
            }
            $validated['attachment_path'] = null;
            $validated['attachment_original_name'] = null;
        }
        // Handle new file upload
        elseif ($request->hasFile('attachment')) {
            // Delete old attachment if exists
            if ($event->attachment_path) {
                Storage::disk('public')->delete($event->attachment_path);
            }
            
            $file = $request->file('attachment');
            $path = $file->store('property-events', 'public');
            $validated['attachment_path'] = $path;
            $validated['attachment_original_name'] = $file->getClientOriginalName();
        }
        
        // Remove validation fields that shouldn't be saved to database
        if (isset($validated['remove_attachment'])) {
            unset($validated['remove_attachment']);
        }

        $event->update($validated);

        return redirect()->back()
            ->with('success', 'Zdarzenie zostało zaktualizowane pomyślnie.');
    }

    /**
     * Remove the specified event from storage.
     */
    public function destroy(Property $property, PropertyEvent $event)
    {
        // Delete attachment file if exists
        if ($event->attachment_path) {
            Storage::disk('public')->delete($event->attachment_path);
        }

        $event->delete();

        return redirect()->back()
            ->with('success', 'Zdarzenie zostało usunięte pomyślnie.');
    }

    /**
     * Download event attachment.
     */
    public function downloadAttachment(Property $property, PropertyEvent $event)
    {
        if (!$event->attachment_path || !Storage::disk('public')->exists($event->attachment_path)) {
            abort(404, 'Załącznik nie został znaleziony.');
        }

        return response()->download(
            Storage::disk('public')->path($event->attachment_path),
            $event->attachment_original_name
        );
    }
}
