<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Rental extends Model
{
    protected $fillable = [
        'property_id',
        'tenant_id',
        'start_date',
        'end_date',
        'rent_amount',
        'deposit_amount',
        'billing_type',
        'invoice_data',
        'notes',
    ];

    protected $casts = [
        'start_date' => 'date',
        'end_date' => 'date',
        'rent_amount' => 'decimal:2',
        'deposit_amount' => 'decimal:2',
    ];

    /**
     * Get the property that owns the rental.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the tenant for the rental (legacy - for backward compatibility).
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Get all tenants for the rental.
     */
    public function tenants(): BelongsToMany
    {
        return $this->belongsToMany(Tenant::class, 'rental_tenants')
                    ->withPivot('is_primary')
                    ->withTimestamps();
    }

    /**
     * Get the primary tenant for the rental.
     */
    public function primaryTenant(): BelongsToMany
    {
        return $this->tenants()->wherePivot('is_primary', true);
    }

    /**
     * Get additional tenants (non-primary) for the rental.
     */
    public function additionalTenants(): BelongsToMany
    {
        return $this->tenants()->wherePivot('is_primary', false);
    }

    /**
     * Get the attachments for the rental.
     */
    public function attachments(): HasMany
    {
        return $this->hasMany(RentalAttachment::class);
    }

    /**
     * Get the monthly settlements for the rental.
     */
    public function monthlySettlements(): HasMany
    {
        return $this->hasMany(MonthlySettlement::class);
    }

    /**
     * Check if the rental is active (no end date or end date in future).
     */
    public function isActive(): bool
    {
        return is_null($this->end_date) || $this->end_date->isFuture();
    }

    /**
     * Scope a query to only include active rentals.
     */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('end_date')
              ->orWhere('end_date', '>', now());
        });
    }

    /**
     * Scope a query to only include inactive rentals.
     */
    public function scopeInactive($query)
    {
        return $query->whereNotNull('end_date')
                    ->where('end_date', '<=', now());
    }

    /**
     * Get billing type options.
     */
    public static function getBillingTypeOptions(): array
    {
        return [
            'invoice' => 'Faktura',
            'receipt' => 'Paragon',
        ];
    }
}
