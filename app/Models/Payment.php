<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'property_id',
        'fee_type_id',
        'amount',
        'payment_date',
        'due_date',
        'description',
        'payment_method',
        'status',
        'reference_number',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'payment_date' => 'date',
        'due_date' => 'date',
    ];

    /**
     * Get the property that owns the payment.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the fee type for the payment.
     */
    public function feeType(): BelongsTo
    {
        return $this->belongsTo(FeeType::class);
    }

    /**
     * Get the payment method options.
     */
    public static function getPaymentMethodOptions(): array
    {
        return [
            'bank_transfer' => 'Przelew bankowy',
            'cash' => 'Gotówka',
            'card' => 'Karta płatnicza',
            'other' => 'Inne',
        ];
    }

    /**
     * Get the payment method label.
     */
    public function getPaymentMethodLabelAttribute(): string
    {
        return self::getPaymentMethodOptions()[$this->payment_method] ?? $this->payment_method;
    }

    /**
     * Get the status options.
     */
    public static function getStatusOptions(): array
    {
        return [
            'completed' => 'Zakończone',
            'pending' => 'Oczekujące',
            'failed' => 'Nieudane',
        ];
    }

    /**
     * Get the status label.
     */
    public function getStatusLabelAttribute(): string
    {
        return self::getStatusOptions()[$this->status] ?? $this->status;
    }

    /**
     * Scope a query to only include completed payments.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to only include pending payments.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope a query to filter payments by date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('payment_date', [$startDate, $endDate]);
    }
}
