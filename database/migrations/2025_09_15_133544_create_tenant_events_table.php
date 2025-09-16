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
        Schema::create('tenant_events', function (Blueprint $table) {
            $table->id();
            $table->foreignId('tenant_id')->constrained()->onDelete('cascade');
            $table->foreignId('rental_id')->constrained()->onDelete('cascade');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('event_type'); // 'added', 'removed', 'set_primary', 'unset_primary'
            $table->text('description')->nullable();
            $table->json('metadata')->nullable(); // Dodatkowe dane o zdarzeniu
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            // Indeksy dla lepszej wydajności
            $table->index(['tenant_id', 'created_at']);
            $table->index(['rental_id', 'created_at']);
            $table->index(['property_id', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tenant_events');
    }
};
