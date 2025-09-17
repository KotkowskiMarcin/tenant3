# Tech Context - Laravel 11 z React

## Stack Technologiczny

### Backend
- **Laravel 11.45.3** - Framework PHP
- **PHP 8.2+** - Wymagana wersja PHP
- **SQLite** - Baza danych (domyślnie)
- **Laravel Sanctum** - Autentykacja API
- **Inertia.js Laravel** - Server-side rendering

### Frontend
- **React 18.2.0** - Biblioteka UI (bez TypeScript)
- **Inertia.js React** - Adapter React dla Inertia
- **Tailwind CSS 3.2.1** - Framework CSS
- **Headless UI 2.0.0** - Komponenty UI
- **Vite 6.0.11** - Bundler i dev server

### Narzędzia Deweloperskie
- **Laravel Breeze 2.3.8** - Starter kit autentykacji
- **Laravel Pint** - Code formatter
- **Laravel Pail** - Log viewer
- **Laravel Tinker** - REPL dla Laravel

## Konfiguracja Środowiska

### Wymagania Systemowe
- PHP 8.2 lub nowszy
- Composer
- Node.js 18+ (dla Vite)
- NPM lub Yarn

### Pliki Konfiguracyjne
- `composer.json` - Zależności PHP
- `package.json` - Zależności Node.js
- `vite.config.js` - Konfiguracja Vite
- `tailwind.config.js` - Konfiguracja Tailwind
- `.env` - Zmienne środowiskowe

## Struktura Katalogów

### Backend (Laravel)
```
app/
├── Http/Controllers/     # Kontrolery
│   ├── Auth/            # Kontrolery autentykacji
│   ├── UserController.php # Zarządzanie użytkownikami
│   ├── RentalController.php # Zarządzanie najmami + endpoint filtrów
│   └── MonthlySettlementController.php # Rozliczenia miesięczne
├── Http/Middleware/     # Middleware
│   └── AdminMiddleware.php # Ochrona tras admin
├── Models/              # Modele Eloquent
│   ├── User.php         # Model użytkownika z rolami
│   ├── Rental.php       # Model najmów
│   └── MonthlySettlement.php # Model rozliczeń miesięcznych
└── Providers/           # Service Providers

routes/
├── web.php             # Trasy web + zarządzanie użytkownikami + endpoint filtrów finansowych
└── auth.php            # Trasy autentykacji

database/
├── migrations/         # Migracje bazy danych
│   ├── add_role_to_users_table.php
│   └── create_monthly_settlements_table.php
├── seeders/           # Seedery
│   └── AdminUserSeeder.php
└── database.sqlite    # Baza SQLite
```

### Frontend (React)
```
resources/js/
├── Components/         # Komponenty UI
│   ├── FinancialTab.jsx # Zakładka finansowa z filtrami
│   └── Settlements/    # Komponenty rozliczeń
├── Layouts/           # Layouty aplikacji
├── Pages/             # Komponenty stron
│   ├── Auth/          # Strony autentykacji
│   ├── Users/         # Zarządzanie użytkownikami
│   │   ├── Index.jsx  # Lista użytkowników
│   │   ├── Create.jsx # Tworzenie użytkownika
│   │   ├── Edit.jsx   # Edycja użytkownika
│   │   └── Show.jsx   # Szczegóły użytkownika
│   └── Dashboard.jsx  # Panel główny
├── app.jsx           # Główny plik aplikacji
└── bootstrap.js      # Konfiguracja Axios
```

## Skrypty NPM

### Development
```bash
npm run dev          # Uruchomienie Vite dev server
npm run build        # Build produkcyjny
```

### Laravel
```bash
php artisan serve    # Serwer deweloperski
php artisan migrate  # Uruchomienie migracji
php artisan key:generate  # Generowanie klucza aplikacji
```

## Konfiguracja Bazy Danych

### SQLite (domyślnie)
- Plik: `database/database.sqlite`
- Automatycznie tworzony przy instalacji
- Migracje już wykonane
- **Status danych:** Tabele owners i properties wyczyszczone (0 rekordów)

### Zmiana na MySQL/PostgreSQL
1. Edytuj `.env`
2. Zainstaluj odpowiedni driver
3. Uruchom `php artisan migrate`

## Bezpieczeństwo

### CSRF Protection
- Automatyczna ochrona Laravel
- Tokeny w formularzach Inertia

### Autentykacja
- Laravel Sanctum dla API
- Session-based dla web
- Middleware `auth` i `verified`
- Middleware `admin` dla tras administratora

### System Ról
- Pole `role` w tabeli `users`
- Role: `user` (domyślna), `admin`
- Metody pomocnicze: `isAdmin()`, `hasRole()`
- Ochrona tras na podstawie ról

## Performance

### Vite
- Szybki hot reload
- Tree shaking
- Code splitting
- Optimized builds

### Laravel
- Route caching
- Config caching
- View caching
- Query optimization
