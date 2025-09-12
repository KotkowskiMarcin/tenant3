<?php

namespace App\Services;

use App\Models\Payment;
use App\Models\Property;
use App\Models\FeeType;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PaymentService
{
    /**
     * Create a single payment.
     */
    public function create(array $data): Payment
    {
        return Payment::create($data);
    }

    /**
     * Create multiple payments for required fees.
     */
    public function createMultiplePayments(Property $property, array $requiredPayments, array $paymentData): array
    {
        $createdPayments = [];
        
        DB::transaction(function () use ($property, $requiredPayments, $paymentData, &$createdPayments) {
            foreach ($requiredPayments as $requiredPayment) {
                $paymentData['property_id'] = $property->id;
                $paymentData['fee_type_id'] = $requiredPayment['fee_type_id'];
                $paymentData['amount'] = $requiredPayment['amount'];
                $paymentData['description'] = $requiredPayment['description'] ?? $requiredPayment['name'];
                
                $createdPayments[] = Payment::create($paymentData);
            }
        });

        return $createdPayments;
    }

    /**
     * Get payments with filters.
     */
    public function getPayments(Property $property, array $filters = []): \Illuminate\Pagination\LengthAwarePaginator
    {
        $query = $property->payments()->with('feeType');

        // Apply filters
        if (isset($filters['start_date']) && isset($filters['end_date'])) {
            $query->dateRange($filters['start_date'], $filters['end_date']);
        }

        if (isset($filters['fee_type_id']) && $filters['fee_type_id']) {
            $query->where('fee_type_id', $filters['fee_type_id']);
        }

        if (isset($filters['status']) && $filters['status']) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['min_amount']) && $filters['min_amount']) {
            $query->where('amount', '>=', $filters['min_amount']);
        }

        if (isset($filters['max_amount']) && $filters['max_amount']) {
            $query->where('amount', '<=', $filters['max_amount']);
        }

        return $query->paginate(15);
    }

    /**
     * Get payment statistics for a property.
     */
    public function getPaymentStatistics(Property $property, int $year = null): array
    {
        $year = $year ?? now()->year;
        
        $query = $property->payments()
            ->completed()
            ->whereBetween('payment_date', [
                $year . '-01-01 00:00:00',
                $year . '-12-31 23:59:59'
            ]);

        $totalAmount = $query->sum('amount');
        $totalCount = $query->count();
        $averageAmount = $totalCount > 0 ? $totalAmount / $totalCount : 0;

        // Monthly breakdown - use a safer approach for SQLite
        $monthlyStats = collect();
        for ($month = 1; $month <= 12; $month++) {
            $monthStr = str_pad($month, 2, '0', STR_PAD_LEFT);
            $monthData = $property->payments()
                ->completed()
                ->whereBetween('payment_date', [
                    $year . '-' . $monthStr . '-01 00:00:00',
                    $year . '-' . $monthStr . '-31 23:59:59'
                ])
                ->selectRaw('SUM(amount) as total, COUNT(*) as count')
                ->first();
            
            if ($monthData && $monthData->total > 0) {
                $monthlyStats->put($month, $monthData);
            }
        }

        // Previous year comparison
        $previousYear = $year - 1;
        $previousYearTotal = $property->payments()
            ->completed()
            ->whereBetween('payment_date', [
                $previousYear . '-01-01 00:00:00',
                $previousYear . '-12-31 23:59:59'
            ])
            ->sum('amount');

        $yearOverYearChange = $previousYearTotal > 0 
            ? (($totalAmount - $previousYearTotal) / $previousYearTotal) * 100 
            : 0;

        return [
            'total_amount' => $totalAmount,
            'total_count' => $totalCount,
            'average_amount' => round($averageAmount, 2),
            'monthly_breakdown' => $monthlyStats,
            'previous_year_total' => $previousYearTotal,
            'year_over_year_change' => round($yearOverYearChange, 2),
        ];
    }

    /**
     * Get payments by fee type breakdown.
     */
    public function getPaymentsByFeeType(Property $property, int $year = null): array
    {
        $year = $year ?? now()->year;
        
        return $property->payments()
            ->completed()
            ->whereBetween('payment_date', [
                $year . '-01-01 00:00:00',
                $year . '-12-31 23:59:59'
            ])
            ->with('feeType')
            ->get()
            ->groupBy('fee_type_id')
            ->map(function ($payments) {
                $feeType = $payments->first()->feeType;
                return [
                    'fee_type_name' => $feeType ? $feeType->name : 'Płatność ad-hoc',
                    'total_amount' => $payments->sum('amount'),
                    'count' => $payments->count(),
                ];
            })
            ->values()
            ->toArray();
    }

    /**
     * Update payment status.
     */
    public function updateStatus(Payment $payment, string $status): Payment
    {
        $payment->update(['status' => $status]);
        
        return $payment->fresh();
    }

    /**
     * Delete a payment.
     */
    public function delete(Payment $payment): bool
    {
        return $payment->delete();
    }

    /**
     * Get overdue payments for a property.
     */
    public function getOverduePayments(Property $property): \Illuminate\Database\Eloquent\Collection
    {
        return $property->payments()
            ->where('status', 'pending')
            ->where('due_date', '<', now())
            ->with('feeType')
            ->get();
    }

    /**
     * Get upcoming payments for a property.
     */
    public function getUpcomingPayments(Property $property, int $days = 30): \Illuminate\Database\Eloquent\Collection
    {
        return $property->payments()
            ->where('status', 'pending')
            ->where('due_date', '>=', now())
            ->where('due_date', '<=', now()->addDays($days))
            ->with('feeType')
            ->get();
    }
}
