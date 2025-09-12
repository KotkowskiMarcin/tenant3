<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    protected $fillable = [
        'name',
        'address',
        'area',
        'rooms',
        'description',
        'cooperative_info',
        'status',
        'owner_id',
    ];

    protected $casts = [
        'area' => 'decimal:2',
        'rooms' => 'integer',
    ];

    /**
     * Get the owner that owns the property.
     */
    public function owner(): BelongsTo
    {
        return $this->belongsTo(Owner::class);
    }

    /**
     * Get the images for the property.
     */
    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }

    /**
     * Get the primary image for the property.
     */
    public function primaryImage(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('is_primary', true);
    }

    /**
     * Get additional images for the property.
     */
    public function additionalImages(): HasMany
    {
        return $this->hasMany(PropertyImage::class)->where('is_primary', false);
    }

    /**
     * Get the attachments for the property.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(PropertyAttachment::class);
    }

    /**
     * Get the events for the property.
     */
    public function events(): HasMany
    {
        return $this->hasMany(PropertyEvent::class)->orderBy('event_date', 'desc');
    }

    /**
     * Get the fee types for the property.
     */
    public function feeTypes(): HasMany
    {
        return $this->hasMany(FeeType::class);
    }

    /**
     * Get the active fee types for the property.
     */
    public function activeFeeTypes(): HasMany
    {
        return $this->hasMany(FeeType::class)->where('is_active', true);
    }

    /**
     * Get the payments for the property.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class)->orderBy('payment_date', 'desc');
    }

    /**
     * Get the status options.
     */
    public static function getStatusOptions(): array
    {
        return [
            'available' => 'Wolne',
            'rented' => 'Wynajęte',
            'unavailable' => 'Niedostępne',
        ];
    }

    /**
     * Get the status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return self::getStatusOptions()[$this->status] ?? $this->status;
    }
}
