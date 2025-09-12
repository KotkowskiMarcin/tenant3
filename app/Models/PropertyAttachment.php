<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PropertyAttachment extends Model
{
    protected $fillable = [
        'property_id',
        'original_name',
        'system_name',
        'file_size',
        'description',
        'file_path',
    ];

    protected $casts = [
        'file_size' => 'integer',
    ];

    /**
     * Relacja do nieruchomości
     */
    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class);
    }
}
