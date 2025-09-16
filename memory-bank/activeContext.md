# Active Context - Laravel 11 z React

## Aktualny Stan Projektu

### ✅ Zakończone
- **Laravel 11.45.3** zainstalowany i skonfigurowany
- **Laravel Breeze** z React zainstalowany
- **Podstawowa autentykacja** gotowa do użycia
- **Memory Bank** zainicjowany i skonfigurowany
- **System ról użytkowników** dodany (user/admin)
- **Użytkownik admin** utworzony (admin@app.pl / admin123)
- **System zarządzania użytkownikami** z pełnym CRUD
- **Middleware ochrony** tras admin
- **Moduł zarządzania nieruchomościami** w pełni zaimplementowany
- **System zarządzania właścicielami** z pełnym CRUD
- **System zarządzania nieruchomościami** z pełnym CRUD
- **Relacje między modelami** Owner i Property
- **Interfejs React** dla wszystkich funkcjonalności
- **Menu nawigacyjne** zaktualizowane o nowe moduły
- **Naprawa błędów paginacji** - rozwiązano problem z NULL URL w Inertia.js
- **Czyszczenie tabel** - wyczyszczono tabele owners i properties
- **Galeria zdjęć nieruchomości** - Pełna implementacja z uploadem, lightboxem i zarządzaniem
- **Pole spółdzielni/wspólnoty mieszkaniowej** - Dodane do nieruchomości z pełną obsługą CRUD
- **System załączników nieruchomości** - Pełna implementacja z uploadem, zarządzaniem i pobieraniem plików
- **Optymalizacja UI załączników** - Zmiana z kafelków na tabelę, usunięcie duplikacji nagłówków, dodanie przycisków pobierania
- **Zaawansowane zarządzanie załącznikami** - Przyciski akcji w tabeli (pobierz, edytuj, usuń), modale edycji i usuwania, przycisk dodawania
- **System zdarzeń nieruchomości** - Pełna implementacja z timeline, zarządzaniem w modalu, uploadem załączników i edycją
- **Optymalizacja UI zdarzeń** - Timeline widoczny tylko w modalu, karta z ostatnim zdarzeniem, domyślna data, opcjonalne pola
- **Naprawa pobierania plików zdarzeń** - Zmiana z Link na window.open dla prawidłowego pobierania
- **Naprawa walidacji edycji zdarzeń** - Rozwiązanie problemu z FormData i metodą PATCH
- **Przeprojektowanie strony szczegółów nieruchomości** - Nowy design z nagłówkiem, przyciskiem cofania i panelem zakładek
- **Zakładki szczegółów nieruchomości** - Podstawowe, Finansowy, Zdarzenia, Załączniki
- **Modal edycji zdarzeń** - Konwersja z osobnej strony na modal z pełną funkcjonalnością
- **Naprawa problemów walidacji w modalu edycji** - Rozwiązanie problemów z błędami walidacji i ładowaniem danych
- **Moduł opłat cyklicznych** - Pełna implementacja systemu zarządzania opłatami i płatnościami
- **System szablonów opłat** - CRUD z różnymi typami cykliczności (miesięczne, kwartalne, roczne, itp.)
- **System płatności** - CRUD z filtrami, statystykami i masowym tworzeniem płatności
- **Panel finansowy nieruchomości** - Statystyki, wymagane płatności, historia transakcji
- **PaymentScheduler** - Generator wymaganych płatności na podstawie szablonów
- **Serwisy biznesowe** - FeeTypeService, PaymentService z logiką walidacji i generowania płatności
- **Aktualizacja menu nawigacyjnego** - Dodanie linków do nowych modułów finansowych
- **Integracja szablonów opłat z nieruchomościami** - Szablony opłat dostępne z poziomu szczegółów nieruchomości
- **Modal zarządzania szablonami opłat** - Przeniesienie funkcjonalności z osobnej strony do modalu w zakładce płatności
- **Modal dodawania płatności** - Tworzenie płatności w modalu zamiast osobnej strony
- **Modal edycji płatności** - Edycja płatności w modalu zamiast osobnej strony
- **System filtrowania płatności** - Zaawansowane filtry po typie opłaty, zakresie dat, statusie i kwocie
- **DataTable dla płatności** - Tabela z paginacją, wyszukiwaniem, sortowaniem i sumowaniem
- **Powiadomienia o nieopłaconych opłatach** - Alerty o comiesięcznych opłatach z przyciskami "Wykonaj opłatę"
- **Pre-wypełnione formularze** - Automatyczne wypełnianie danych płatności z alertów
- **Naprawa błędów JavaScript** - Rozwiązanie problemów z undefined properties i null href
- **Optymalizacja UX** - Płynne przejścia bez przeładowań strony, zamykanie modali po akcjach
- **Moduł zarządzania najmami** - Pełna implementacja systemu zarządzania najemcami i najmami
- **System najemców** - CRUD z polami: imię, nazwisko, email (opcjonalny), telefon, adres, PESEL, numer dowodu, inny dokument tożsamości, uwagi
- **System najmów** - CRUD z polami: data rozpoczęcia, data zakończenia, kwota czynszu, kwota kaucji, faktura/paragon, dane do faktury, uwagi
- **Relacje między modelami** - Tenant i Rental z relacjami do Property
- **Zakładka Najmy w nieruchomościach** - Dodana do szczegółów nieruchomości z tabelą najmów i przyciskami akcji
- **Modal dodawania najmu** - Dodawanie najmu z panelu nieruchomości odbywa się w modalu z domyślną datą rozpoczęcia na dzisiejszy dzień
- **Pole rozliczania w najmach** - Zaktualizowano pole "faktura/paragon" na radio buttony z opcjami "Faktura" i "Paragon" dla określenia sposobu rozliczania najmu
- **Naprawa błędów JavaScript** - Naprawiono błąd z `rental.isActive()` w komponentach React, dodając funkcję `isRentalActive()` w JavaScript
- **Obsługa błędów ładowania obrazków** - Dodano obsługę błędów ładowania obrazków z placeholderem SVG dla wszystkich komponentów wyświetlających obrazy
- **Menu nawigacyjne** - Zaktualizowane o linki do najemców i najmów
- **Strony React** - Pełne strony CRUD dla najemców i najmów z walidacją i paginacją
- **System załączników najmów** - Pełna implementacja z uploadem, zarządzaniem i pobieraniem plików
- **Zakładka załączników w najmach** - Tabela z pełnym zarządzaniem (dodaj, edytuj, usuń, pobierz)
- **Modal zarządzania załącznikami najmów** - Inteligentny modal z trybem dodawania i edycji
- **Naprawa błędów HTTP** - Rozwiązanie problemu z metodą PATCH vs PUT w edycji załączników
- **System zarządzania licznikami** - Pełna implementacja systemu zarządzania licznikami w nieruchomościach
- **Tabela property_meters** - Nowa tabela z polami: name, serial_number, provider, current_reading, unit, price_per_unit
- **Model PropertyMeter** - Model z relacjami, walidacją, metodami pomocniczymi do formatowania danych i $appends dla accessory
- **Kontroler PropertyMeterController** - Pełny CRUD z walidacją i obsługą błędów
- **Zakładka Liczniki** - Nowa zakładka w szczegółach nieruchomości z tabelą liczników i przyciskami akcji
- **Przycisk "Dodaj licznik"** - Otwiera bezpośrednio modal z formularzem dodawania nowego licznika
- **Tabela liczników** - Wyświetla nazwę, numer seryjny, dostawcę, stan, cenę za jednostkę i przyciski akcji
- **Przyciski akcji w tabeli** - Podgląd (niebieska ikona oka), edycja (żółta ikona ołówka), usuwanie (czerwona ikona kosza)
- **Modal podglądu licznika** - Szczegółowy podgląd danych licznika z formatowaniem i datami
- **Modal edycji licznika** - Formularz z walidacją, obsługą różnych jednostek pomiarowych i trybem tworzenia/edycji
- **Modal usuwania licznika** - Potwierdzenie usunięcia z podglądem danych licznika
- **Naprawa problemów z zapisywaniem** - Dodano property_id do submitData i poprawiono przekazywanie property
- **Usunięcie kosztu całkowitego** - Usunięto wyświetlanie kosztu całkowitego z tabeli i modalu podglądu
- **Moduł rozliczeń miesięcznych** - Pełna implementacja systemu rozliczeń miesięcznych dla najmów
- **Model MonthlySettlement** - Model z polami: rental_id, year, month, total_amount, status, issued_at, paid_at, components (JSON)
- **Tabela monthly_settlements** - Nowa tabela z indeksami unikalności i wydajności
- **Kontroler MonthlySettlementController** - Pełny CRUD z walidacją, generowaniem składników i obliczaniem kwot
- **Zakładka Rozliczenia** - Nowa zakładka w szczegółach najmu z linkiem do zarządzania rozliczeniami
- **Strona listy rozliczeń** - Tabela z rozwijanymi wierszami pokazującymi składniki rozliczenia
- **Strona tworzenia rozliczenia** - Formularz z automatycznym generowaniem składników (czynsz + liczniki)
- **Strona edycji rozliczenia** - Edycja istniejących rozliczeń z możliwością modyfikacji składników
- **Składniki rozliczenia** - JSON z polami: name, amount, type (rent/meter/other), status, description
- **Automatyczne obliczanie** - Zużycie i kwoty dla liczników na podstawie aktualnego i poprzedniego stanu
- **Walidacja unikalności** - Sprawdzanie czy rozliczenie dla danego najmu, roku i miesiąca już istnieje

### 🔄 W Trakcie
- **Dokumentacja** - Aktualizacja dokumentacji zgodnie z aktualnym stanem funkcjonalności

### 📋 Następne Kroki
- **Testowanie** - Weryfikacja działania wszystkich funkcjonalności
- **Rozwój** - Dodanie nowych funkcjonalności biznesowych
- **Optymalizacja** - Dostrajanie wydajności i UX
- **Rozszerzenie modułu** - Dodanie dodatkowych funkcjonalności dla nieruchomości

## Aktualne Decyzje Techniczne

### Wybór Stacku
- **Laravel 11** - Najnowsza wersja LTS
- **React bez TypeScript** - Zgodnie z wymaganiami użytkownika
- **Inertia.js** - Eliminuje potrzebę budowania API
- **Tailwind CSS** - Nowoczesny, utility-first CSS

### Architektura
- **Server-side rendering** z Inertia.js
- **Component-based** frontend z React
- **Session-based** autentykacja
- **SQLite** jako domyślna baza danych

## Kluczowe Pliki

### Backend
- `routes/web.php` - Główne trasy aplikacji + zarządzanie użytkownikami + galeria zdjęć + opłaty i płatności
- `routes/auth.php` - Trasy autentykacji
- `app/Http/Controllers/UserController.php` - CRUD użytkowników
- `app/Http/Controllers/PropertyController.php` - Zarządzanie nieruchomościami + panel finansowy
- `app/Http/Controllers/PropertyImageController.php` - Zarządzanie zdjęciami nieruchomości
- `app/Http/Controllers/PropertyAttachmentController.php` - Zarządzanie załącznikami nieruchomości
- `app/Http/Controllers/PropertyEventController.php` - Zarządzanie zdarzeniami nieruchomości
- `app/Http/Controllers/FeeTypeController.php` - Zarządzanie szablonami opłat
- `app/Http/Controllers/PaymentController.php` - Zarządzanie płatnościami
- `app/Http/Controllers/TenantController.php` - Zarządzanie najemcami
- `app/Http/Controllers/RentalController.php` - Zarządzanie najmami
- `app/Http/Controllers/RentalAttachmentController.php` - Zarządzanie załącznikami najmów
- `app/Http/Controllers/PropertyMeterController.php` - Zarządzanie licznikami nieruchomości
- `app/Http/Middleware/AdminMiddleware.php` - Ochrona tras admin
- `app/Models/User.php` - Model z systemem ról
- `app/Models/PropertyImage.php` - Model zdjęć nieruchomości
- `app/Models/PropertyAttachment.php` - Model załączników nieruchomości
- `app/Models/PropertyEvent.php` - Model zdarzeń nieruchomości
- `app/Models/FeeType.php` - Model szablonów opłat
- `app/Models/Payment.php` - Model płatności
- `app/Models/Tenant.php` - Model najemców
- `app/Models/Rental.php` - Model najmów
- `app/Models/RentalAttachment.php` - Model załączników najmów
- `app/Models/PropertyMeter.php` - Model liczników nieruchomości
- `app/Services/FeeTypeService.php` - Logika biznesowa szablonów opłat
- `app/Services/PaymentService.php` - Logika biznesowa płatności
- `app/Services/PaymentScheduler.php` - Generator wymaganych płatności

### Frontend
- `resources/js/app.jsx` - Główny plik React
- `resources/js/Pages/Users/` - Strony zarządzania użytkownikami
- `resources/js/Pages/Auth/` - Strony autentykacji
- `resources/js/Pages/Properties/Show.jsx` - Szczegóły nieruchomości z galerią, załącznikami, zdarzeniami i panelem finansowym
- `resources/js/Pages/FeeTypes/` - Strony zarządzania szablonami opłat
- `resources/js/Pages/Payments/` - Strony zarządzania płatnościami
- `resources/js/Components/` - Komponenty UI
- `resources/js/Components/PropertyImageGallery.jsx` - Galeria zdjęć nieruchomości
- `resources/js/Components/PropertyAttachmentManagementModal.jsx` - Modal zarządzania załącznikami
- `resources/js/Components/PropertyAttachmentCard.jsx` - Karta wyświetlania załączników z przyciskami akcji
- `resources/js/Components/PropertyAttachmentEditModal.jsx` - Modal edycji załącznika
- `resources/js/Components/PropertyAttachmentDeleteModal.jsx` - Modal usuwania załącznika
- `resources/js/Components/PropertyAttachmentAddModal.jsx` - Modal dodawania załączników
- `resources/js/Components/PropertyEventTimeline.jsx` - Timeline zdarzeń nieruchomości
- `resources/js/Components/PropertyEventManagementModal.jsx` - Modal zarządzania zdarzeniami
- `resources/js/Components/PropertyEventEditModal.jsx` - Modal edycji zdarzeń z pełną funkcjonalnością
- `resources/js/Components/FeeTypesManagementModal.jsx` - Modal zarządzania szablonami opłat
- `resources/js/Components/PaymentCreateModal.jsx` - Modal dodawania płatności
- `resources/js/Components/PaymentEditModal.jsx` - Modal edycji płatności
- `resources/js/Components/RentalAttachmentManagementModal.jsx` - Modal zarządzania załącznikami najmów
- `resources/js/Components/Meters/MeterManagementModal.jsx` - Modal zarządzania licznikami
- `resources/js/Components/Meters/MeterEditModal.jsx` - Modal edycji/tworzenia licznika
- `resources/js/Components/Meters/MeterViewModal.jsx` - Modal podglądu licznika
- `resources/js/Components/Meters/MeterDeleteModal.jsx` - Modal usuwania licznika
- `resources/js/Layouts/AuthenticatedLayout.jsx` - Layout z menu admin

## Konfiguracja Środowiska

### Zmienne Środowiskowe (.env)
- `APP_URL` - URL aplikacji
- `DB_CONNECTION=sqlite` - Baza danych
- `VITE_APP_NAME` - Nazwa aplikacji dla frontendu

### Skrypty
- `php artisan serve` - Serwer Laravel
- `npm run dev` - Vite dev server
- `npm run build` - Build produkcyjny

## Status Funkcjonalności

### Autentykacja
- ✅ Rejestracja użytkowników
- ✅ Logowanie
- ✅ Resetowanie hasła
- ✅ Weryfikacja email
- ✅ Zarządzanie profilem
- ✅ Wylogowanie
- ✅ System ról (user/admin)
- ✅ Zarządzanie użytkownikami (CRUD)
- ✅ Ochrona tras admin

### UI/UX
- ✅ Responsywny design
- ✅ Nowoczesne komponenty
- ✅ Płynne przejścia
- ✅ Walidacja formularzy
- ✅ Galeria zdjęć z lightboxem
- ✅ Upload wielu zdjęć jednocześnie
- ✅ Zarządzanie zdjęciami (ustawianie wiodącego, usuwanie)
- ✅ Pole spółdzielni/wspólnoty mieszkaniowej w nieruchomościach
- ✅ System załączników z uploadem, zarządzaniem i pobieraniem
- ✅ Modal zarządzania załącznikami z edycją opisów
- ✅ Karta wyświetlania załączników z tabelą i przyciskami pobierania
- ✅ Optymalizacja UI załączników - tabela zamiast kafelków, kompaktowy layout
- ✅ Zaawansowane zarządzanie załącznikami - przyciski akcji w tabeli (pobierz, edytuj, usuń)
- ✅ Modal edycji załącznika z możliwością zmiany opisu
- ✅ Modal usuwania załącznika z potwierdzeniem
- ✅ Modal dodawania załączników z podglądem plików
- ✅ Usunięcie duplikujących się nagłówków i przycisków zarządzania
- ✅ System zdarzeń z timeline, zarządzaniem w modalu i uploadem załączników
- ✅ Timeline zdarzeń z datą, godziną, opisem i załącznikami
- ✅ Modal zarządzania zdarzeniami z edycją, usuwaniem i dodawaniem
- ✅ Optymalizacja UI zdarzeń - timeline tylko w modalu, karta z ostatnim zdarzeniem
- ✅ Domyślna aktualna data w formularzu zdarzeń
- ✅ Opcjonalne pola opisu i czasu w zdarzeniach
- ✅ System szablonów opłat z różnymi typami cykliczności (miesięczne, kwartalne, roczne, nie dotyczy)
- ✅ System płatności z filtrami, statystykami i masowym tworzeniem
- ✅ Panel finansowy nieruchomości z statystykami i wymaganymi płatnościami
- ✅ Modal zarządzania szablonami opłat w zakładce płatności
- ✅ Modal dodawania i edycji płatności
- ✅ DataTable dla płatności z paginacją, wyszukiwaniem i sortowaniem
- ✅ Powiadomienia o nieopłaconych comiesięcznych opłatach
- ✅ Pre-wypełnione formularze płatności z alertów
- ✅ Naprawa błędów JavaScript (undefined properties, null href)
- ✅ Optymalizacja UX (płynne przejścia, zamykanie modali)
- ✅ System załączników najmów - Pełna implementacja z uploadem, zarządzaniem i pobieraniem plików
- ✅ Zakładka załączników w najmach - Tabela z pełnym zarządzaniem (dodaj, edytuj, usuń, pobierz)
- ✅ Modal zarządzania załącznikami najmów - Inteligentny modal z trybem dodawania i edycji
- ✅ Naprawa błędów HTTP - Rozwiązanie problemu z metodą PATCH vs PUT w edycji załączników
- ✅ System liczników nieruchomości - Pełna implementacja z CRUD, tabelą i modalami
- ✅ Zakładka Liczniki - Nowa zakładka w szczegółach nieruchomości z tabelą i przyciskami akcji
- ✅ Przycisk "Dodaj licznik" - Otwiera bezpośrednio modal z formularzem dodawania
- ✅ Tabela liczników - Wyświetla dane z przyciskami podglądu, edycji i usuwania
- ✅ Modal podglądu licznika - Szczegółowy podgląd z formatowaniem danych
- ✅ Modal edycji licznika - Formularz z walidacją i obsługą różnych jednostek
- ✅ Modal usuwania licznika - Potwierdzenie z podglądem danych
- ✅ Naprawa problemów z zapisywaniem - Dodano property_id i poprawiono przekazywanie danych
- ✅ Usunięcie kosztu całkowitego - Usunięto z tabeli i modalu podglądu

## Znane Problemy
- Brak znanych problemów w aktualnej wersji
- Tabele owners i properties zostały wyczyszczone (brak danych testowych)

## Priorytety Rozwoju
1. **Testowanie** - Weryfikacja wszystkich funkcjonalności
2. **Dokumentacja** - Kompletna dokumentacja API i komponentów
3. **Rozwój** - Dodanie nowych funkcjonalności biznesowych
4. **Optymalizacja** - Poprawa wydajności i UX
