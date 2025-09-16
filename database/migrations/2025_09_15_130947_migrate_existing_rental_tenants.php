<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Migruj istniejące dane z tabeli rentals do rental_tenants
        DB::table('rentals')->whereNotNull('tenant_id')->orderBy('id')->chunk(100, function ($rentals) {
            foreach ($rentals as $rental) {
                DB::table('rental_tenants')->insert([
                    'rental_id' => $rental->id,
                    'tenant_id' => $rental->tenant_id,
                    'is_primary' => true,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Usuń wszystkie rekordy z rental_tenants
        DB::table('rental_tenants')->truncate();
    }
};
