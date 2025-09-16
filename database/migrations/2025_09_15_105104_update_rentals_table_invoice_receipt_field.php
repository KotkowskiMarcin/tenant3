<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            // Zmień pole invoice_receipt na enum z opcjami faktura/paragon
            $table->dropColumn('invoice_receipt');
        });
        
        Schema::table('rentals', function (Blueprint $table) {
            $table->enum('billing_type', ['invoice', 'receipt'])->nullable()->after('deposit_amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rentals', function (Blueprint $table) {
            $table->dropColumn('billing_type');
        });
        
        Schema::table('rentals', function (Blueprint $table) {
            $table->string('invoice_receipt')->nullable()->after('deposit_amount');
        });
    }
};