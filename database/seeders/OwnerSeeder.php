<?php

namespace Database\Seeders;

use App\Models\Owner;
use Illuminate\Database\Seeder;

class OwnerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = [
            [
                'first_name' => 'Jan',
                'last_name' => 'Kowalski',
                'email' => 'jan.kowalski@example.com',
                'phone' => '+48 123 456 789',
                'address' => 'ul. Główna 1\n00-001 Warszawa',
                'notes' => 'Właściciel z długoletnim doświadczeniem w zarządzaniu nieruchomościami.',
            ],
            [
                'first_name' => 'Anna',
                'last_name' => 'Nowak',
                'email' => 'anna.nowak@example.com',
                'phone' => '+48 987 654 321',
                'address' => 'ul. Słoneczna 15\n30-001 Kraków',
                'notes' => 'Specjalizuje się w nieruchomościach komercyjnych.',
            ],
            [
                'first_name' => 'Piotr',
                'last_name' => 'Wiśniewski',
                'email' => 'piotr.wisniewski@example.com',
                'phone' => '+48 555 123 456',
                'address' => 'ul. Parkowa 8\n80-001 Gdańsk',
                'notes' => 'Nowy właściciel, pierwsze nieruchomości.',
            ],
            [
                'first_name' => 'Maria',
                'last_name' => 'Zielińska',
                'email' => 'maria.zielinska@example.com',
                'phone' => '+48 444 777 888',
                'address' => 'ul. Kwiatowa 22\n50-001 Wrocław',
                'notes' => 'Zarządza kilkoma apartamentami w centrum miasta.',
            ],
            [
                'first_name' => 'Tomasz',
                'last_name' => 'Kowalczyk',
                'email' => 'tomasz.kowalczyk@example.com',
                'phone' => '+48 666 999 111',
                'address' => 'ul. Leśna 5\n20-001 Lublin',
                'notes' => 'Właściciel domów jednorodzinnych na przedmieściach.',
            ],
        ];

        foreach ($owners as $ownerData) {
            Owner::create($ownerData);
        }
    }
}