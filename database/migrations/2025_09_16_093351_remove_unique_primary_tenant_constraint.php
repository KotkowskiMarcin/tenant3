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
        Schema::table('rental_tenants', function (Blueprint $table) {
            // Usuń ograniczenie UNIQUE na (rental_id, is_primary)
            $table->dropUnique('unique_primary_tenant');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('rental_tenants', function (Blueprint $table) {
            // Przywróć ograniczenie UNIQUE na (rental_id, is_primary)
            $table->unique(['rental_id', 'is_primary'], 'unique_primary_tenant');
        });
    }
};
