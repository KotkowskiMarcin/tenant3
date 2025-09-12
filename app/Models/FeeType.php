<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FeeType extends Model
{
    protected $fillable = [
        'property_id',
        'name',
        'description',
        'amount',
        'frequency_type',
        'frequency_value',
        'is_active',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'frequency_value' => 'integer',
        'is_active' => 'boolean',
    ];

    /**
     * Get the property that owns the fee type.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the payments for the fee type.
     */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /**
     * Get the frequency type options.
     */
    public static function getFrequencyTypeOptions(): array
    {
        return [
            'monthly' => 'Co miesiąc',
            'quarterly' => 'Co N miesięcy',
            'biannual' => 'Co pół roku (styczeń i lipiec)',
            'annual' => 'Raz w roku (styczeń)',
            'specific_month' => 'W konkretnym miesiącu',
            'none' => 'Nie dotyczy',
        ];
    }

    /**
     * Get the frequency type label.
     */
    public function getFrequencyTypeLabelAttribute(): string
    {
        return self::getFrequencyTypeOptions()[$this->frequency_type] ?? $this->frequency_type;
    }

    /**
     * Check if the fee type is due in the given month.
     */
    public function isDueInMonth(int $year, int $month): bool
    {
        switch ($this->frequency_type) {
            case 'monthly':
                return true;
            
            case 'quarterly':
                // Punkt bazowy: styczeń 2024
                $baseYear = 2024;
                $baseMonth = 1;
                $monthsFromBase = ($year - $baseYear) * 12 + ($month - $baseMonth);
                return $monthsFromBase % $this->frequency_value === 0;
            
            case 'biannual':
                return in_array($month, [1, 7]); // styczeń i lipiec
            
            case 'annual':
                return $month === 1; // styczeń
            
            case 'specific_month':
                return $month === $this->frequency_value;
            
            case 'none':
                return false; // Nie dotyczy - nigdy nie jest wymagane
            
            default:
                return false;
        }
    }

    /**
     * Scope a query to only include active fee types.
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
