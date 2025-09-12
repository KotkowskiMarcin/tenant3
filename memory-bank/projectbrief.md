# Project Brief - Laravel 11 z React (Breeze)

## Cel Projektu
Nowoczesna aplikacja webowa zbudowana na Laravel 11 i React, wykorzystująca Laravel Breeze do autentykacji.

## Wymagania Techniczne
- **Backend:** Laravel 11.45.3
- **Frontend:** React 18.2.0 (bez TypeScript)
- **Autentykacja:** Laravel Breeze z Inertia.js
- **Styling:** Tailwind CSS 3.2.1
- **Bundler:** Vite 6.0.11
- **Baza danych:** SQLite (domyślnie)

## Architektura
- **SPA-like experience:** Inertia.js zapewnia płynne przejścia bez potrzeby API
- **Server-side rendering:** Laravel renderuje komponenty React po stronie serwera
- **Autentykacja:** Pełny system logowania, rejestracji i zarządzania profilem
- **System ról:** Zarządzanie użytkownikami z rolami (user/admin)
- **Zarządzanie użytkownikami:** Pełny CRUD z interfejsem React
- **Responsywny design:** Tailwind CSS z Headless UI

## Struktura Projektu
```
├── app/                    # Logika aplikacji Laravel
├── resources/
│   ├── js/                # Komponenty React
│   │   ├── Components/    # Komponenty UI
│   │   ├── Layouts/       # Layouty aplikacji
│   │   └── Pages/         # Strony/komponenty stron
│   └── views/             # Blade templates
├── routes/                # Definicje tras
├── database/              # Migracje i seedery
└── public/                # Pliki publiczne
```

## Status
- ✅ Laravel 11 zainstalowany
- ✅ Breeze z React skonfigurowany
- ✅ Podstawowa autentykacja gotowa
- ✅ System ról użytkowników (user/admin)
- ✅ System zarządzania użytkownikami (CRUD)
- ✅ Middleware ochrony tras admin
- ✅ Użytkownik admin (admin@app.pl / admin123)
- ✅ System zarządzania właścicielami i nieruchomościami
- ✅ Naprawa błędów paginacji w Inertia.js
- ✅ Czyszczenie tabel danych testowych
- 🔄 Gotowy do dalszego rozwoju

## Następne Kroki
- Rozwój funkcjonalności biznesowych
- Dodanie dodatkowych komponentów React
- Konfiguracja bazy danych produkcyjnej
- Testy i optymalizacja
- Rozszerzenie systemu ról
