<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TenantEvent extends Model
{
    protected $fillable = [
        'tenant_id',
        'rental_id',
        'property_id',
        'event_type',
        'description',
        'metadata',
        'created_by',
    ];

    protected $casts = [
        'metadata' => 'array',
    ];

    /**
     * Get the tenant that owns the event.
     */
    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    /**
     * Get the rental that owns the event.
     */
    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class);
    }

    /**
     * Get the property that owns the event.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the user who created the event.
     */
    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get event type options.
     */
    public static function getEventTypeOptions(): array
    {
        return [
            'added' => 'Dodano do najmu',
            'removed' => 'Usunięto z najmu',
            'set_primary' => 'Ustawiono jako głównego',
            'unset_primary' => 'Odebrano status głównego',
        ];
    }

    /**
     * Get event type label.
     */
    public function getEventTypeLabelAttribute(): string
    {
        $options = self::getEventTypeOptions();
        return $options[$this->event_type] ?? $this->event_type;
    }
}
