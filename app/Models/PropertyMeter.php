<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyMeter extends Model
{
    protected $fillable = [
        'property_id',
        'name',
        'serial_number',
        'provider',
        'current_reading',
        'unit',
        'price_per_unit',
    ];

    protected $casts = [
        'current_reading' => 'decimal:2',
        'price_per_unit' => 'decimal:4',
    ];

    protected $appends = [
        'formatted_reading',
        'formatted_price_per_unit',
        'formatted_total_cost',
        'total_cost'
    ];

    /**
     * Get the property that owns the meter.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the total cost based on current reading and price per unit.
     */
    public function getTotalCostAttribute(): float
    {
        return $this->current_reading * $this->price_per_unit;
    }

    /**
     * Get formatted current reading with unit.
     */
    public function getFormattedReadingAttribute(): string
    {
        return number_format((float) $this->current_reading, 2) . ' ' . $this->unit;
    }

    /**
     * Get formatted price per unit.
     */
    public function getFormattedPricePerUnitAttribute(): string
    {
        return number_format((float) $this->price_per_unit, 4) . ' zł/' . $this->unit;
    }

    /**
     * Get formatted total cost.
     */
    public function getFormattedTotalCostAttribute(): string
    {
        return number_format($this->total_cost, 2) . ' zł';
    }
}
