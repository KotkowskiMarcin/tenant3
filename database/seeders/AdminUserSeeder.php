<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sprawdź czy użytkownik admin już istnieje
        if (!User::where('email', 'admin@app.pl')->exists()) {
            User::create([
                'name' => 'Administrator',
                'email' => 'admin@app.pl',
                'password' => Hash::make('admin123'),
                'role' => 'admin',
                'email_verified_at' => now(),
            ]);
            
            $this->command->info('Użytkownik admin został utworzony: admin@app.pl / admin123');
        } else {
            $this->command->info('Użytkownik admin już istnieje');
        }
    }
}
