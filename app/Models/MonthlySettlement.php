<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class MonthlySettlement extends Model
{
    use HasFactory;

    protected $fillable = [
        'rental_id',
        'year',
        'month',
        'total_amount',
        'status',
        'issued_at',
        'paid_at',
        'components',
    ];

    protected $casts = [
        'components' => 'array',
        'issued_at' => 'datetime',
        'paid_at' => 'datetime',
    ];

    protected $appends = [
        'formatted_date',
        'formatted_amount',
        'status_label',
    ];

    // Statusy rozliczenia
    const STATUS_ISSUED = 'issued';
    const STATUS_PAID = 'paid';
    const STATUS_UNPAID = 'unpaid';

    // Typy składników rozliczenia
    const COMPONENT_TYPE_RENT = 'rent';
    const COMPONENT_TYPE_METER = 'meter';
    const COMPONENT_TYPE_OTHER = 'other';

    // Statusy składników
    const COMPONENT_STATUS_ACTIVE = 'active';
    const COMPONENT_STATUS_INACTIVE = 'inactive';

    /**
     * Relacja z najmem
     */
    public function rental(): BelongsTo
    {
        return $this->belongsTo(Rental::class);
    }

    /**
     * Sprawdza czy rozliczenie jest opłacone
     */
    public function isPaid(): bool
    {
        return $this->status === self::STATUS_PAID;
    }

    /**
     * Sprawdza czy rozliczenie jest wystawione
     */
    public function isIssued(): bool
    {
        return $this->status === self::STATUS_ISSUED;
    }

    /**
     * Sprawdza czy rozliczenie jest nieopłacone
     */
    public function isUnpaid(): bool
    {
        return $this->status === self::STATUS_UNPAID;
    }

    /**
     * Oznacza rozliczenie jako opłacone
     */
    public function markAsPaid(): void
    {
        $this->update([
            'status' => self::STATUS_PAID,
            'paid_at' => now(),
        ]);
    }

    /**
     * Oznacza rozliczenie jako wystawione
     */
    public function markAsIssued(): void
    {
        $this->update([
            'status' => self::STATUS_ISSUED,
            'issued_at' => now(),
        ]);
    }

    /**
     * Pobiera sformatowaną datę rozliczenia
     */
    public function getFormattedDateAttribute(): string
    {
        $monthNames = [
            1 => 'Styczeń', 2 => 'Luty', 3 => 'Marzec', 4 => 'Kwiecień',
            5 => 'Maj', 6 => 'Czerwiec', 7 => 'Lipiec', 8 => 'Sierpień',
            9 => 'Wrzesień', 10 => 'Październik', 11 => 'Listopad', 12 => 'Grudzień'
        ];
        
        return $monthNames[$this->month] . ' ' . $this->year;
    }

    /**
     * Pobiera sformatowaną kwotę
     */
    public function getFormattedAmountAttribute(): string
    {
        return number_format($this->total_amount, 2, ',', ' ') . ' zł';
    }

    /**
     * Pobiera status w języku polskim
     */
    public function getStatusLabelAttribute(): string
    {
        return match($this->status) {
            self::STATUS_ISSUED => 'Wystawiony',
            self::STATUS_PAID => 'Zapłacony',
            self::STATUS_UNPAID => 'Niezapłacony',
            default => 'Nieznany'
        };
    }

    /**
     * Pobiera typ składnika w języku polskim
     */
    public static function getComponentTypeLabel(string $type): string
    {
        return match($type) {
            self::COMPONENT_TYPE_RENT => 'Czynsz',
            self::COMPONENT_TYPE_METER => 'Opłata licznikowa',
            self::COMPONENT_TYPE_OTHER => 'Inna opłata',
            default => 'Nieznany'
        };
    }

    /**
     * Pobiera status składnika w języku polskim
     */
    public static function getComponentStatusLabel(string $status): string
    {
        return match($status) {
            self::COMPONENT_STATUS_ACTIVE => 'Aktywny',
            self::COMPONENT_STATUS_INACTIVE => 'Nieaktywny',
            default => 'Nieznany'
        };
    }

    /**
     * Oblicza łączną kwotę na podstawie składników
     */
    public function calculateTotalAmount(): float
    {
        $total = 0;
        
        if (is_array($this->components)) {
            foreach ($this->components as $component) {
                if (isset($component['amount']) && isset($component['status']) && $component['status'] === self::COMPONENT_STATUS_ACTIVE) {
                    $total += (float) $component['amount'];
                }
            }
        }
        
        return $total;
    }

    /**
     * Aktualizuje łączną kwotę na podstawie składników
     */
    public function updateTotalAmount(): void
    {
        $this->update([
            'total_amount' => $this->calculateTotalAmount()
        ]);
    }

    /**
     * Dodaje składnik do rozliczenia
     */
    public function addComponent(array $component): void
    {
        $components = $this->components ?? [];
        $components[] = $component;
        
        $this->update([
            'components' => $components
        ]);
        
        $this->updateTotalAmount();
    }

    /**
     * Usuwa składnik z rozliczenia
     */
    public function removeComponent(int $index): void
    {
        $components = $this->components ?? [];
        
        if (isset($components[$index])) {
            unset($components[$index]);
            $components = array_values($components); // Reindex array
            
            $this->update([
                'components' => $components
            ]);
            
            $this->updateTotalAmount();
        }
    }

    /**
     * Aktualizuje składnik w rozliczeniu
     */
    public function updateComponent(int $index, array $component): void
    {
        $components = $this->components ?? [];
        
        if (isset($components[$index])) {
            $components[$index] = $component;
            
            $this->update([
                'components' => $components
            ]);
            
            $this->updateTotalAmount();
        }
    }
}
