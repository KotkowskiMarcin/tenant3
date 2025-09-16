<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PropertyImage extends Model
{
    protected $fillable = [
        'property_id',
        'original_name',
        'system_name',
        'file_size',
        'is_primary',
        'file_path',
    ];

    protected $casts = [
        'is_primary' => 'boolean',
        'file_size' => 'integer',
    ];

    protected $appends = [
        'url',
    ];

    /**
     * Relacja do nieruchomości
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Scope dla zdjęć wiodących
     */
    public function scopePrimary($query)
    {
        return $query->where('is_primary', true);
    }

    /**
     * Scope dla zdjęć dodatkowych
     */
    public function scopeAdditional($query)
    {
        return $query->where('is_primary', false);
    }

    /**
     * Get the full URL for the image
     */
    public function getUrlAttribute(): string
    {
        return Storage::url($this->file_path);
    }
}
