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
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->foreignId('fee_type_id')->nullable()->constrained()->onDelete('set null');
            $table->decimal('amount', 10, 2);
            $table->date('payment_date');
            $table->date('due_date')->nullable();
            $table->text('description')->nullable();
            $table->enum('payment_method', ['bank_transfer', 'cash', 'card', 'other']);
            $table->enum('status', ['completed', 'pending', 'failed'])->default('completed');
            $table->string('reference_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
            
            // Indeksy dla optymalizacji zapytań
            $table->index(['property_id', 'payment_date']);
            $table->index('fee_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
