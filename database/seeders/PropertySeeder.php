<?php

namespace Database\Seeders;

use App\Models\Property;
use App\Models\Owner;
use Illuminate\Database\Seeder;

class PropertySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $owners = Owner::all();

        if ($owners->isEmpty()) {
            $this->command->warn('Brak właścicieli w bazie danych. Uruchom najpierw OwnerSeeder.');
            return;
        }

        $properties = [
            [
                'name' => 'Apartament w centrum Warszawy',
                'address' => 'ul. Marszałkowska 100\n00-001 Warszawa',
                'area' => 65.5,
                'rooms' => 3,
                'description' => 'Nowoczesny apartament w centrum miasta z widokiem na park. W pełni umeblowany, gotowy do zamieszkania.',
                'status' => 'available',
                'owner_id' => $owners->first()->id,
            ],
            [
                'name' => 'Dom jednorodzinny na przedmieściach',
                'address' => 'ul. Słoneczna 15\n30-001 Kraków',
                'area' => 120.0,
                'rooms' => 4,
                'description' => 'Przestronny dom z ogrodem, idealny dla rodziny. Blisko szkoły i sklepów.',
                'status' => 'rented',
                'owner_id' => $owners->skip(1)->first()->id,
            ],
            [
                'name' => 'Mieszkanie 2-pokojowe',
                'address' => 'ul. Parkowa 8\n80-001 Gdańsk',
                'area' => 45.0,
                'rooms' => 2,
                'description' => 'Kompaktowe mieszkanie w nowym budownictwie. Wysokie standardy wykończenia.',
                'status' => 'available',
                'owner_id' => $owners->skip(2)->first()->id,
            ],
            [
                'name' => 'Apartament z tarasem',
                'address' => 'ul. Kwiatowa 22\n50-001 Wrocław',
                'area' => 85.0,
                'rooms' => 3,
                'description' => 'Elegancki apartament z dużym tarasem i widokiem na rzekę. Idealny dla pary.',
                'status' => 'unavailable',
                'owner_id' => $owners->skip(3)->first()->id,
            ],
            [
                'name' => 'Dom z garażem',
                'address' => 'ul. Leśna 5\n20-001 Lublin',
                'area' => 150.0,
                'rooms' => 5,
                'description' => 'Duży dom jednorodzinny z garażem na 2 samochody. Duży ogród z altaną.',
                'status' => 'available',
                'owner_id' => $owners->skip(4)->first()->id,
            ],
            [
                'name' => 'Studio w centrum',
                'address' => 'ul. Główna 1\n00-001 Warszawa',
                'area' => 30.0,
                'rooms' => 1,
                'description' => 'Kompaktowe studio idealne dla studenta lub młodej osoby. Wszystko w jednym pomieszczeniu.',
                'status' => 'rented',
                'owner_id' => $owners->first()->id,
            ],
            [
                'name' => 'Mieszkanie 4-pokojowe',
                'address' => 'ul. Słoneczna 15\n30-001 Kraków',
                'area' => 95.0,
                'rooms' => 4,
                'description' => 'Przestronne mieszkanie w starym budownictwie z wysokimi sufitami. Dużo charakteru.',
                'status' => 'available',
                'owner_id' => $owners->skip(1)->first()->id,
            ],
            [
                'name' => 'Apartament z balkonem',
                'address' => 'ul. Parkowa 8\n80-001 Gdańsk',
                'area' => 55.0,
                'rooms' => 2,
                'description' => 'Nowoczesny apartament z balkonem i widokiem na morze. Blisko plaży.',
                'status' => 'rented',
                'owner_id' => $owners->skip(2)->first()->id,
            ],
        ];

        foreach ($properties as $propertyData) {
            Property::create($propertyData);
        }
    }
}