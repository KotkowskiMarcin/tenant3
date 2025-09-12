<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class PropertyEvent extends Model
{
    protected $fillable = [
        'property_id',
        'title',
        'description',
        'event_date',
        'notes',
        'attachment_path',
        'attachment_original_name',
    ];

    protected $casts = [
        'event_date' => 'datetime',
    ];

    protected $appends = [
        'has_attachment',
        'attachment_display_name',
        'formatted_event_date',
        'timeline_date',
        'timeline_time',
    ];

    /**
     * Get the property that owns the event.
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }

    /**
     * Get the formatted event date.
     */
    public function getFormattedEventDateAttribute(): string
    {
        return $this->event_date->format('d.m.Y H:i');
    }

    /**
     * Get the event date for display in timeline.
     */
    public function getTimelineDateAttribute(): string
    {
        return $this->event_date->format('d.m.Y');
    }

    /**
     * Get the event time for display in timeline.
     */
    public function getTimelineTimeAttribute(): string
    {
        $time = $this->event_date->format('H:i');
        // Return empty string if time is 12:00 (default time when no time specified)
        return $time === '12:00' ? '' : $time;
    }

    /**
     * Check if event has attachment.
     */
    public function hasAttachment(): bool
    {
        return !empty($this->attachment_path);
    }

    /**
     * Get the attachment file name for display.
     */
    public function getAttachmentDisplayNameAttribute(): string
    {
        return $this->attachment_original_name ?: basename($this->attachment_path);
    }

    /**
     * Get the has attachment attribute for JSON serialization.
     */
    public function getHasAttachmentAttribute(): bool
    {
        return $this->hasAttachment();
    }
}
