<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RentalAttachment extends Model
{
    protected $fillable = [
        'rental_id',
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
     * Relacja do najmu
     */
    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class);
    }
}
