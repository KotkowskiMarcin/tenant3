# System Patterns - Laravel 11 z React

## Architektura Aplikacji

### Backend (Laravel 11)
- **MVC Pattern:** Model-View-Controller z Laravel
- **Inertia.js Integration:** Server-side rendering komponentów React
- **Route-based Architecture:** Trasy definiują komponenty React do renderowania

### Frontend (React)
- **Component-based Architecture:** Modularne komponenty React
- **Layout System:** Oddzielne layouty dla gości i zalogowanych użytkowników
- **Page Components:** Komponenty reprezentujące strony aplikacji

## Wzorce Projektowe

### 1. Inertia.js Pattern
```php
// Laravel Controller
return Inertia::render('Dashboard', [
    'data' => $data
]);
```
```jsx
// React Component
export default function Dashboard({ data }) {
    return <div>{data}</div>;
}
```

### 2. Layout Pattern
- **GuestLayout:** Dla stron publicznych (login, register)
- **AuthenticatedLayout:** Dla stron wymagających autoryzacji

### 3. Component Composition
- **Reusable Components:** TextInput, PrimaryButton, InputError
- **Layout Wrappers:** Komponenty opakowujące inne komponenty
- **Page Components:** Główne komponenty stron

## Struktura Komponentów

### Komponenty UI (Components/)
- `TextInput` - Pole tekstowe z walidacją
- `PrimaryButton` - Główny przycisk akcji
- `InputError` - Wyświetlanie błędów walidacji
- `Checkbox` - Pole wyboru
- `Modal` - Okno modalne
- `PropertyImageGallery` - Galeria zdjęć nieruchomości z lightboxem

### Layouty (Layouts/)
- `GuestLayout` - Layout dla gości
- `AuthenticatedLayout` - Layout dla zalogowanych użytkowników

### Strony (Pages/)
- `Auth/` - Strony autentykacji
- `Dashboard` - Główny panel
- `Profile/` - Zarządzanie profilem
- `Users/` - Zarządzanie użytkownikami (tylko admin)
- `Owners/` - Zarządzanie właścicielami
- `Properties/` - Zarządzanie nieruchomościami

## Routing Pattern

### Laravel Routes
```php
// Publiczne trasy
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified']);

// Trasy z ochroną admin
Route::middleware('admin')->group(function () {
    Route::resource('users', UserController::class);
});

// Trasy zarządzania właścicielami i nieruchomościami
Route::resource('owners', OwnerController::class);
Route::resource('properties', PropertyController::class);

// Trasy zarządzania zdjęciami nieruchomości
Route::post('properties/{property}/images', [PropertyImageController::class, 'store']);
Route::patch('properties/{property}/images/{image}/primary', [PropertyImageController::class, 'setPrimary']);
Route::delete('properties/{property}/images/{image}', [PropertyImageController::class, 'destroy']);
```

### React Navigation
```jsx
import { Link } from '@inertiajs/react';

<Link href={route('dashboard')}>Dashboard</Link>
```

## State Management
- **Inertia.js Forms:** Zarządzanie formularzami
- **Laravel Session:** Stan sesji po stronie serwera
- **React State:** Lokalny stan komponentów

## Styling Pattern
- **Tailwind CSS:** Utility-first CSS framework
- **Headless UI:** Dostępne komponenty UI
- **Responsive Design:** Mobile-first approach

## Security Patterns
- **CSRF Protection:** Automatyczna ochrona Laravel
- **Authentication Middleware:** Kontrola dostępu
- **Admin Middleware:** Ochrona tras administratora
- **Role-based Access:** System ról użytkowników
- **Form Validation:** Walidacja po stronie serwera i klienta

## User Management Patterns
- **CRUD Operations:** Pełne operacje Create, Read, Update, Delete
- **Role Management:** Zarządzanie rolami użytkowników
- **Search & Pagination:** Wyszukiwanie i stronicowanie wyników z obsługą NULL URL
- **Self-protection:** Ochrona przed usunięciem własnego konta
- **Pagination Safety:** Sprawdzanie link.url przed renderowaniem Link vs Span

## Property Management Patterns
- **Owner-Property Relationship:** Relacja jeden-do-wielu między właścicielami a nieruchomościami
- **Status Management:** Zarządzanie statusami nieruchomości (wolne, wynajęte, niedostępne)
- **Property Details:** Szczegółowe informacje o nieruchomościach (powierzchnia, liczba pokoi, opis, spółdzielnia)
- **Cooperative Information:** Pole tekstowe dla informacji o spółdzielni/wspólnocie mieszkaniowej
- **Owner Details:** Kompletne dane właścicieli (dane kontaktowe, adres, uwagi)
- **Cross-referencing:** Wzajemne odwołania między właścicielami a nieruchomościami
- **Data Management:** Możliwość czyszczenia tabel (truncate) dla resetowania danych testowych

## Image Gallery Patterns
- **Property-Image Relationship:** Relacja jeden-do-wielu między nieruchomościami a zdjęciami
- **Primary Image Management:** Automatyczne ustawianie pierwszego zdjęcia jako wiodącego
- **File Upload:** Upload wielu plików jednocześnie z walidacją
- **Storage Management:** Organizacja plików w katalogu property-images
- **Lightbox Display:** Pełnoekranowy podgląd zdjęć z nawigacją
- **Image Management:** Ustawianie zdjęcia wiodącego i usuwanie zdjęć
- **Responsive Gallery:** Adaptacyjny layout galerii (1 duże + 3 małe zdjęcia)

## Attachment Management Patterns
- **Property-Attachment Relationship:** Relacja jeden-do-wielu między nieruchomościami a załącznikami
- **File Type Support:** Obsługa wszystkich typów plików z kompaktowymi ikonami dla popularnych formatów
- **File Upload:** Upload wielu plików jednocześnie z opcjonalnymi opisami
- **Storage Management:** Organizacja plików w katalogu property-attachments
- **File Download:** Bezpieczne pobieranie plików z oryginalnymi nazwami przez dedykowane przyciski
- **Attachment Management:** Edycja opisów i usuwanie załączników
- **Modal Interface:** Zarządzanie załącznikami w dedykowanym modalu
- **Table Layout:** Kompaktowa tabela zamiast kafelków dla lepszej organizacji
- **Description Support:** Opcjonalne opisy załączników do 500 znaków wyświetlane pod nazwą pliku
- **UI Optimization:** Usunięcie duplikacji nagłówków, kompaktowe ikony, przyciski akcji

## Attachment UI Optimization Patterns
- **Table Layout:** Zamiana kafelków na tabelę z kolumnami "Plik" i "Akcje"
- **Header Consolidation:** Jeden nagłówek "Załączniki" z liczbą w komponencie PropertyAttachmentCard
- **Compact Icons:** Zmniejszenie ikon typów plików z w-10 h-10 na w-6 h-6
- **Description Placement:** Opis pliku wyświetlany pod nazwą w tej samej komórce
- **Action Buttons:** Przyciski akcji w każdej linii tabeli (pobierz, edytuj, usuń)
- **File Size Display:** Rozmiar pliku wyświetlany pod nazwą w tej samej komórce
- **Add Button:** Przycisk dodawania załączników w nagłówku tabeli
- **Responsive Design:** Tabela z overflow-x-auto dla mniejszych ekranów
- **Button Removal:** Usunięcie przycisków "Zarządzaj" i "Zarządzaj załącznikami"

## Advanced Attachment Management Patterns
- **Inline Actions:** Przyciski akcji bezpośrednio w tabeli załączników (pobierz, edytuj, usuń)
- **Edit Modal:** Dedykowany modal edycji opisu załącznika z walidacją
- **Delete Modal:** Modal potwierdzenia usunięcia z animacją ładowania
- **Add Modal:** Modal dodawania załączników z podglądem plików i opisami
- **State Management:** Zarządzanie stanem wybranego załącznika dla modali
- **Callback Pattern:** Przekazywanie funkcji obsługi akcji jako props do komponentów
- **Modal Lifecycle:** Czyszczenie stanu przy zamykaniu modali
- **File Preview:** Podgląd wybranych plików przed uploadem z ikonami typów
- **Error Handling:** Obsługa błędów walidacji w modalach edycji i dodawania
- **Form Reset:** Resetowanie formularzy po pomyślnym wykonaniu akcji

## Event Management Patterns
- **Property-Event Relationship:** Relacja jeden-do-wielu między nieruchomościami a zdarzeniami
- **Timeline Display:** Wyświetlanie zdarzeń w formie linii czasu z datą i godziną
- **Event Data:** Tytuł, opis, data/godzina, uwagi i opcjonalny załącznik
- **File Upload:** Upload załączników do zdarzeń z maksymalnym rozmiarem 10MB
- **Event Management:** Pełne CRUD operacje w dedykowanym modalu
- **Timeline UI:** Wizualna linia czasu z ikonami i kolorami dla lepszej czytelności
- **Date/Time Handling:** Oddzielne pola dla daty i godziny z walidacją
- **Attachment Support:** Opcjonalne załączniki do zdarzeń z pobieraniem
- **Modal Interface:** Zarządzanie zdarzeniami w dedykowanym modalu z formularzami
- **Event Ordering:** Sortowanie zdarzeń według daty (najnowsze na górze)
- **Download Fix:** Używanie window.open() zamiast Link dla pobierania plików
- **FormData Handling:** Obsługa FormData z _method override dla aktualizacji z plikami
- **Validation Fix:** Naprawa walidacji podczas edycji zdarzeń z załącznikami

## File Download Patterns
- **Download Links:** Używanie window.open() zamiast Inertia Link dla pobierania plików
- **File Storage:** Organizacja plików w katalogach (property-images, property-attachments, property-events)
- **Original Names:** Zachowywanie oryginalnych nazw plików przy pobieraniu
- **Security:** Sprawdzanie istnienia plików przed pobieraniem
- **Error Handling:** Obsługa błędów 404 gdy plik nie istnieje

## FormData and PATCH Patterns
- **FormData with Files:** Używanie FormData gdy są pliki, zwykły obiekt gdy nie ma
- **Method Override:** Dodawanie _method: 'PATCH' do FormData dla aktualizacji
- **Route Flexibility:** Obsługa zarówno POST jak i PATCH w trasach aktualizacji
- **Validation Consistency:** Zapewnienie spójnej walidacji niezależnie od typu danych

## Modal Validation Patterns
- **Error Clearing:** Zawsze czyść błędy (`clearErrors()`) przed ustawieniem nowych danych w modalu
- **Form Reset:** Używaj `reset()` przed `setData()` w useEffect
- **Dynamic FormData:** Używaj `forceFormData` tylko gdy rzeczywiście są pliki
- **Method Selection:** POST z `_method: 'patch'` dla plików, zwykły PATCH dla danych
- **HTML5 Validation:** Używaj `noValidate` na formularzu gdy masz własną walidację
- **Server Validation:** Dynamiczne reguły walidacji na podstawie obecności pól w request
- **Boolean Handling:** Używaj `$request->boolean()` z fallback dla opcjonalnych flag
- **Initialization Order:** clearErrors() → reset() → setData() - zawsze w tej kolejności

## Tabbed UI Pattern
- **Tab State Management:** Używaj `useState` dla aktywnej zakładki
- **Tab Configuration:** Definiuj tabs jako array z id, name i icon
- **Conditional Rendering:** Renderuj zawartość na podstawie activeTab
- **Consistent Styling:** Używaj Tailwind dla spójnego wyglądu zakładek
- **Icon Integration:** Używaj Heroicons dla ikon zakładek

## Financial Management Patterns
- **FeeType-Property Relationship:** Relacja jeden-do-wielu między nieruchomościami a szablonami opłat
- **Payment-FeeType Relationship:** Relacja wiele-do-jednego między płatnościami a szablonami opłat (nullable)
- **Payment-Property Relationship:** Relacja wiele-do-jednego między płatnościami a nieruchomościami
- **Frequency Types:** Enum z różnymi typami cykliczności (monthly, quarterly, biannual, annual, specific_month)
- **Frequency Validation:** Kontekstowa walidacja frequency_value w zależności od frequency_type
- **Payment Status Management:** Enum z statusami płatności (completed, pending, failed)
- **Payment Method Management:** Enum ze sposobami płatności (bank_transfer, cash, card, other)

## Service Layer Patterns
- **FeeTypeService:** Logika biznesowa dla szablonów opłat z walidacją cykliczności
- **PaymentService:** Logika biznesowa dla płatności z filtrami i statystykami
- **PaymentScheduler:** Generator wymaganych płatności na podstawie szablonów
- **Service Injection:** Dependency injection serwisów w kontrolerach
- **Business Logic Separation:** Oddzielenie logiki biznesowej od kontrolerów

## Financial UI Patterns
- **Financial Dashboard:** Panel finansowy w szczegółach nieruchomości z statystykami
- **Required Payments Display:** Wyświetlanie wymaganych płatności na bieżący miesiąc
- **Payment Statistics:** Karty ze statystykami finansowymi (suma, liczba, średnia, zmiana YoY)
- **Payment History:** Lista ostatnich płatności z linkami do szczegółów
- **Filter Interface:** Zaawansowane filtry dla płatności (data, kwota, status, typ opłaty)
- **Bulk Payment Creation:** Masowe tworzenie płatności dla wymaganych opłat
- **Payment Schedule:** Harmonogram płatności dla szablonów opłat

## Data Validation Patterns
- **Frequency Type Validation:** Walidacja kombinacji frequency_type + frequency_value
- **Amount Validation:** Walidacja kwot (≥ 0, decimal precision)
- **Date Validation:** Walidacja dat płatności i terminów
- **Reference Number Validation:** Walidacja numerów referencyjnych (nullable, max 255)
- **Cross-Reference Validation:** Sprawdzanie istnienia powiązanych rekordów (property_id, fee_type_id)

## Financial Calculation Patterns
- **Monthly Payment Generation:** Algorytm generowania wymaganych płatności na miesiąc
- **Frequency Calculation:** Logika sprawdzania czy opłata przypada w danym miesiącu
- **Statistics Calculation:** Obliczanie statystyk finansowych (suma, średnia, zmiana YoY)
- **Payment Aggregation:** Grupowanie płatności według różnych kryteriów
- **Year-over-Year Comparison:** Porównanie danych między latami

## Modal Management Patterns
- **Modal State Management:** Używanie `useState` dla kontroli widoczności modali
- **Modal Lifecycle:** Czyszczenie stanu przy zamykaniu modali
- **Form Reset:** Resetowanie formularzy po pomyślnym wykonaniu akcji
- **Error Clearing:** Zawsze czyść błędy przed ustawieniem nowych danych
- **Callback Pattern:** Przekazywanie funkcji obsługi akcji jako props do modali
- **Pre-filled Data:** Obsługa pre-wypełnionych danych w formularzach modali

## DataTable Patterns
- **Client-side Filtering:** Filtrowanie danych po stronie klienta
- **Client-side Sorting:** Sortowanie kolumn w tabeli
- **Client-side Pagination:** Paginacja wyników w tabeli
- **Search Functionality:** Wyszukiwanie w wynikach tabeli
- **Action Buttons:** Przyciski akcji w każdej linii tabeli
- **Total Calculation:** Sumowanie wyświetlanych danych
- **Responsive Design:** Tabela z overflow-x-auto dla mniejszych ekranów

## Notification Patterns
- **Overdue Payment Alerts:** Powiadomienia o nieopłaconych comiesięcznych opłatach
- **Alert Styling:** Żółte alerty z ikonami ostrzeżenia
- **Quick Action Buttons:** Przyciski "Wykonaj opłatę" w alertach
- **Pre-filled Forms:** Automatyczne wypełnianie formularzy z danych alertów
- **Conditional Display:** Wyświetlanie alertów tylko dla aktualnego miesiąca

## Error Handling Patterns
- **Undefined Property Safety:** Używanie optional chaining (`?.`) i nullish coalescing (`||`)
- **Null URL Handling:** Sprawdzanie `link.url` przed renderowaniem InertiaLink
- **Flash Message Safety:** Bezpieczny dostęp do flash messages z `usePage()`
- **Form Validation:** Obsługa błędów walidacji w modalach
- **Server Error Handling:** Obsługa błędów serwera w kontrolerach

## UX Optimization Patterns
- **Smooth Transitions:** Płynne przejścia bez przeładowań strony
- **Modal Auto-close:** Automatyczne zamykanie modali po akcjach
- **Data Refresh:** Odświeżanie danych bez pełnego przeładowania strony
- **Loading States:** Stany ładowania podczas operacji
- **Success Feedback:** Komunikaty o pomyślnym wykonaniu akcji