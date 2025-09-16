<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Tenant extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'address',
        'pesel',
        'id_number',
        'other_id_document',
        'notes',
    ];

    /**
     * Get the rentals for the tenant (legacy - for backward compatibility).
     */
    public function rentals(): HasMany
    {
        return $this->hasMany(Rental::class);
    }

    /**
     * Get all rentals for the tenant (including as additional tenant).
     */
    public function allRentals(): BelongsToMany
    {
        return $this->belongsToMany(Rental::class, 'rental_tenants')
                    ->withPivot('is_primary')
                    ->withTimestamps();
    }

    /**
     * Get rentals where this tenant is the primary tenant.
     */
    public function primaryRentals(): BelongsToMany
    {
        return $this->allRentals()->wherePivot('is_primary', true);
    }

    /**
     * Get rentals where this tenant is an additional tenant.
     */
    public function additionalRentals(): BelongsToMany
    {
        return $this->allRentals()->wherePivot('is_primary', false);
    }

    /**
     * Get the tenant's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get the tenant's events.
     */
    public function events(): HasMany
    {
        return $this->hasMany(TenantEvent::class);
    }
}
