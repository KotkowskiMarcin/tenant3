<?php

namespace App\Services;

use App\Models\Property;
use App\Models\FeeType;
use App\Models\Payment;
use Carbon\Carbon;

class PaymentScheduler
{
    /**
     * Generate all required payments for a property in a given month.
     */
    public function generateRequiredPayments(Property $property, int $year, int $month): array
    {
        $feeTypeService = new FeeTypeService();
        return $feeTypeService->getRequiredPaymentsForMonth($property, $year, $month);
    }

    /**
     * Generate payments for all properties for current month.
     */
    public function generateCurrentMonthPayments(): array
    {
        $currentDate = now();
        $year = $currentDate->year;
        $month = $currentDate->month;
        
        $properties = Property::with('activeFeeTypes')->get();
        $generatedPayments = [];

        foreach ($properties as $property) {
            $requiredPayments = $this->generateRequiredPayments($property, $year, $month);
            
            if (!empty($requiredPayments)) {
                $generatedPayments[] = [
                    'property' => $property,
                    'required_payments' => $requiredPayments,
                ];
            }
        }

        return $generatedPayments;
    }

    /**
     * Generate payments for a specific date range.
     */
    public function generatePaymentsForDateRange(Carbon $startDate, Carbon $endDate): array
    {
        $properties = Property::with('activeFeeTypes')->get();
        $generatedPayments = [];

        $currentDate = $startDate->copy();
        
        while ($currentDate->lte($endDate)) {
            $year = $currentDate->year;
            $month = $currentDate->month;
            
            foreach ($properties as $property) {
                $requiredPayments = $this->generateRequiredPayments($property, $year, $month);
                
                if (!empty($requiredPayments)) {
                    $generatedPayments[] = [
                        'property' => $property,
                        'year' => $year,
                        'month' => $month,
                        'month_name' => $this->getMonthName($month),
                        'required_payments' => $requiredPayments,
                    ];
                }
            }
            
            $currentDate->addMonth();
        }

        return $generatedPayments;
    }

    /**
     * Check if a payment already exists for a fee type in a given month.
     */
    public function paymentExists(Property $property, int $feeTypeId, int $year, int $month): bool
    {
        $monthStr = str_pad($month, 2, '0', STR_PAD_LEFT);
        return $property->payments()
            ->where('fee_type_id', $feeTypeId)
            ->whereBetween('payment_date', [
                $year . '-' . $monthStr . '-01 00:00:00',
                $year . '-' . $monthStr . '-31 23:59:59'
            ])
            ->exists();
    }

    /**
     * Get payment schedule for a property for the next 12 months.
     */
    public function getPaymentSchedule(Property $property, int $year = null): array
    {
        $year = $year ?? now()->year;
        $feeTypeService = new FeeTypeService();
        
        return $feeTypeService->generatePaymentSchedule($property, $year);
    }

    /**
     * Get all upcoming payments for all properties.
     */
    public function getAllUpcomingPayments(int $months = 3): array
    {
        $properties = Property::with('activeFeeTypes')->get();
        $upcomingPayments = [];
        
        $currentDate = now();
        $endDate = $currentDate->copy()->addMonths($months);
        
        while ($currentDate->lte($endDate)) {
            $year = $currentDate->year;
            $month = $currentDate->month;
            
            foreach ($properties as $property) {
                $requiredPayments = $this->generateRequiredPayments($property, $year, $month);
                
                if (!empty($requiredPayments)) {
                    $upcomingPayments[] = [
                        'property' => $property,
                        'year' => $year,
                        'month' => $month,
                        'month_name' => $this->getMonthName($month),
                        'required_payments' => $requiredPayments,
                    ];
                }
            }
            
            $currentDate->addMonth();
        }

        return $upcomingPayments;
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
