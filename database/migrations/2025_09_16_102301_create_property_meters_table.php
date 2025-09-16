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
        Schema::create('property_meters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('name'); // nazwa licznika (np. "Licznik prądu", "Licznik gazu")
            $table->string('serial_number'); // numer seryjny licznika
            $table->text('provider')->nullable(); // właściciel/dostawca usług (textarea)
            $table->decimal('current_reading', 10, 2); // aktualny stan licznika
            $table->string('unit'); // jednostka pomiarowa (kWh, m³, itp.)
            $table->decimal('price_per_unit', 8, 4); // cena za jednostkę
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('property_meters');
    }
};
