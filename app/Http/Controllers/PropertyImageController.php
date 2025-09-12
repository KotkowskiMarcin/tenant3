<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\PropertyImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class PropertyImageController extends Controller
{
    /**
     * Store a newly created image in storage.
     */
    public function store(Request $request, Property $property)
    {
        try {

            $request->validate([
                'images' => 'required|array|min:1|max:10',
                'images.*' => 'image|mimes:jpeg,png,jpg,gif,webp|max:5120', // max 5MB per image
            ]);

            $uploadedImages = [];

            foreach ($request->file('images') as $image) {
                $originalName = $image->getClientOriginalName();
                $systemName = Str::uuid() . '.' . $image->getClientOriginalExtension();
                $fileSize = round($image->getSize() / 1024); // Convert to KB
                $filePath = $image->storeAs('property-images', $systemName, 'public');

                $propertyImage = PropertyImage::create([
                    'property_id' => $property->id,
                    'original_name' => $originalName,
                    'system_name' => $systemName,
                    'file_size' => $fileSize,
                    'file_path' => $filePath,
                    'is_primary' => false, // Will be set to true if this is the first image
                ]);

                // If this is the first image, make it primary
                if ($property->images()->count() === 1) {
                    $propertyImage->update(['is_primary' => true]);
                }

                $uploadedImages[] = $propertyImage;
            }


            return redirect()->back()->with('success', 'Zdjęcia zostały dodane pomyślnie.');
        } catch (\Exception $e) {
            \Log::error('Error uploading images', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()->with('error', 'Wystąpił błąd podczas dodawania zdjęć: ' . $e->getMessage());
        }
    }

    /**
     * Set an image as primary.
     */
    public function setPrimary(Property $property, PropertyImage $image)
    {
        // Ensure the image belongs to this property
        if ($image->property_id !== $property->id) {
            return redirect()->back()->with('error', 'Nieprawidłowe zdjęcie.');
        }

        // Remove primary status from all images of this property
        $property->images()->update(['is_primary' => false]);

        // Set this image as primary
        $image->update(['is_primary' => true]);

        return redirect()->back()->with('success', 'Zdjęcie zostało ustawione jako wiodące.');
    }

    /**
     * Remove the specified image from storage.
     */
    public function destroy(Property $property, PropertyImage $image)
    {
        // Ensure the image belongs to this property
        if ($image->property_id !== $property->id) {
            return redirect()->back()->with('error', 'Nieprawidłowe zdjęcie.');
        }

        // Delete the file from storage
        Storage::disk('public')->delete($image->file_path);

        // If this was the primary image, set another one as primary
        if ($image->is_primary) {
            $nextImage = $property->images()->where('id', '!=', $image->id)->first();
            if ($nextImage) {
                $nextImage->update(['is_primary' => true]);
            }
        }

        // Delete the database record
        $image->delete();

        return redirect()->back()->with('success', 'Zdjęcie zostało usunięte.');
    }
}
