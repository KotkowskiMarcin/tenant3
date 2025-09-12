<?php

namespace App\Services;

use App\Models\FeeType;
use App\Models\Property;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class FeeTypeService
{
    /**
     * Create a new fee type.
     */
    public function create(array $data): FeeType
    {
        $this->validateFrequencyData($data);
        
        return FeeType::create($data);
    }

    /**
     * Update an existing fee type.
     */
    public function update(FeeType $feeType, array $data): FeeType
    {
        $this->validateFrequencyData($data);
        
        $feeType->update($data);
        
        return $feeType->fresh();
    }

    /**
     * Deactivate a fee type (soft delete).
     */
    public function deactivate(FeeType $feeType): FeeType
    {
        $feeType->update(['is_active' => false]);
        
        return $feeType->fresh();
    }

    /**
     * Get required payments for a property in a given month.
     */
    public function getRequiredPaymentsForMonth(Property $property, int $year, int $month): array
    {
        $activeFeeTypes = $property->activeFeeTypes()->get();
        $requiredPayments = [];

        foreach ($activeFeeTypes as $feeType) {
            if ($feeType->isDueInMonth($year, $month)) {
                // Check if payment already exists for this month
                $monthStr = str_pad($month, 2, '0', STR_PAD_LEFT);
                $existingPayment = $property->payments()
                    ->where('fee_type_id', $feeType->id)
                    ->whereBetween('payment_date', [
                        $year . '-' . $monthStr . '-01 00:00:00',
                        $year . '-' . $monthStr . '-31 23:59:59'
                    ])
                    ->first();

                if (!$existingPayment) {
                    $requiredPayments[] = [
                        'fee_type_id' => $feeType->id,
                        'name' => $feeType->name,
                        'description' => $feeType->description,
                        'amount' => $feeType->amount,
                        'frequency_type' => $feeType->frequency_type,
                        'frequency_value' => $feeType->frequency_value,
                    ];
                }
            }
        }

        return $requiredPayments;
    }

    /**
     * Generate payment schedule for a property.
     */
    public function generatePaymentSchedule(Property $property, int $year): array
    {
        $schedule = [];
        $activeFeeTypes = $property->activeFeeTypes()->get();

        for ($month = 1; $month <= 12; $month++) {
            $monthPayments = [];
            
            foreach ($activeFeeTypes as $feeType) {
                if ($feeType->isDueInMonth($year, $month)) {
                    $monthPayments[] = [
                        'fee_type_id' => $feeType->id,
                        'name' => $feeType->name,
                        'amount' => $feeType->amount,
                        'frequency_type' => $feeType->frequency_type,
                    ];
                }
            }
            
            if (!empty($monthPayments)) {
                $schedule[] = [
                    'month' => $month,
                    'month_name' => $this->getMonthName($month),
                    'payments' => $monthPayments,
                ];
            }
        }

        return $schedule;
    }

    /**
     * Validate frequency data.
     */
    private function validateFrequencyData(array $data): void
    {
        $frequencyType = $data['frequency_type'] ?? null;
        $frequencyValue = $data['frequency_value'] ?? null;

        switch ($frequencyType) {
            case 'quarterly':
                if (!$frequencyValue || $frequencyValue < 1 || $frequencyValue > 12) {
                    throw ValidationException::withMessages([
                        'frequency_value' => 'Wartość dla cykliczności kwartalnej musi być między 1 a 12.'
                    ]);
                }
                break;
            
            case 'specific_month':
                if (!$frequencyValue || $frequencyValue < 1 || $frequencyValue > 12) {
                    throw ValidationException::withMessages([
                        'frequency_value' => 'Miesiąc musi być między 1 a 12.'
                    ]);
                }
                break;
            
            case 'monthly':
            case 'biannual':
            case 'annual':
                if ($frequencyValue !== null) {
                    throw ValidationException::withMessages([
                        'frequency_value' => 'Wartość nie jest wymagana dla tego typu cykliczności.'
                    ]);
                }
                break;
        }
    }

    /**
     * Get month name in Polish.
     */
    private function getMonthName(int $month): string
    {
        $months = [
            1 => 'Styczeń', 2 => 'Luty', 3 => 'Marzec', 4 => 'Kwiecień',
            5 => 'Maj', 6 => 'Czerwiec', 7 => 'Lipiec', 8 => 'Sierpień',
            9 => 'Wrzesień', 10 => 'Październik', 11 => 'Listopad', 12 => 'Grudzień'
        ];

        return $months[$month] ?? '';
    }
}
