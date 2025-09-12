<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyAttachment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PropertyAttachmentController extends Controller
{
    /**
     * Store a newly created attachment in storage.
     */
    public function store(Request $request, Property $property)
    {
        try {
            // Debug: sprawdź co przychodzi w request
            \Log::info('Attachment upload request:', [
                'files' => $request->allFiles(),
                'descriptions' => $request->input('descriptions'),
                'property_id' => $property->id
            ]);

            $request->validate([
                'attachments' => 'required|array|min:1|max:10',
                'attachments.*' => 'file|max:10240', // max 10MB per file
                'descriptions' => 'array',
                'descriptions.*' => 'nullable|string|max:500',
            ]);

            $uploadedAttachments = [];

            foreach ($request->file('attachments') as $index => $attachment) {
                $originalName = $attachment->getClientOriginalName();
                $systemName = Str::uuid() . '.' . $attachment->getClientOriginalExtension();
                $fileSize = round($attachment->getSize() / 1024); // Convert to KB
                $filePath = $attachment->storeAs('property-attachments', $systemName, 'public');
                $description = $request->input("descriptions.{$index}");

                $propertyAttachment = PropertyAttachment::create([
                    'property_id' => $property->id,
                    'original_name' => $originalName,
                    'system_name' => $systemName,
                    'file_size' => $fileSize,
                    'description' => $description,
                    'file_path' => $filePath,
                ]);

                $uploadedAttachments[] = $propertyAttachment;
            }

            \Log::info('Attachments created successfully:', $uploadedAttachments);

            return redirect()->back()->with('success', 'Załączniki zostały dodane pomyślnie.');
        } catch (\Exception $e) {
            \Log::error('Attachment upload error:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return redirect()->back()->with('error', 'Wystąpił błąd podczas dodawania załączników: ' . $e->getMessage());
        }
    }

    /**
     * Update the specified attachment.
     */
    public function update(Request $request, Property $property, PropertyAttachment $attachment)
    {
        // Ensure the attachment belongs to this property
        if ($attachment->property_id !== $property->id) {
            return redirect()->back()->with('error', 'Nieprawidłowy załącznik.');
        }

        $request->validate([
            'description' => 'nullable|string|max:500',
        ]);

        $attachment->update([
            'description' => $request->input('description'),
        ]);

        return redirect()->back()->with('success', 'Załącznik został zaktualizowany.');
    }

    /**
     * Download the specified attachment.
     */
    public function download(Property $property, PropertyAttachment $attachment)
    {
        // Ensure the attachment belongs to this property
        if ($attachment->property_id !== $property->id) {
            abort(404, 'Nieprawidłowy załącznik.');
        }

        if (!Storage::disk('public')->exists($attachment->file_path)) {
            abort(404, 'Plik nie został znaleziony.');
        }

        return Storage::disk('public')->download($attachment->file_path, $attachment->original_name);
    }

    /**
     * Remove the specified attachment from storage.
     */
    public function destroy(Property $property, PropertyAttachment $attachment)
    {
        // Ensure the attachment belongs to this property
        if ($attachment->property_id !== $property->id) {
            return redirect()->back()->with('error', 'Nieprawidłowy załącznik.');
        }

        // Delete the file from storage
        Storage::disk('public')->delete($attachment->file_path);

        // Delete the database record
        $attachment->delete();

        return redirect()->back()->with('success', 'Załącznik został usunięty.');
    }
}
