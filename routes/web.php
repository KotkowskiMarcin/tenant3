<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OwnerController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\PropertyImageController;
use App\Http\Controllers\PropertyAttachmentController;
use App\Http\Controllers\PropertyEventController;
use App\Http\Controllers\FeeTypeController;
use App\Http\Controllers\PaymentController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    
    // Trasy zarządzania użytkownikami (tylko dla adminów)
    Route::middleware('admin')->group(function () {
        Route::resource('users', App\Http\Controllers\UserController::class);
    });
    
    // Trasy zarządzania właścicielami
    Route::resource('owners', OwnerController::class);
    
    // Trasy zarządzania nieruchomościami
    Route::resource('properties', PropertyController::class);
    
    // Trasy zarządzania zdjęciami nieruchomości
    Route::post('properties/{property}/images', [PropertyImageController::class, 'store'])->name('properties.images.store');
    Route::patch('properties/{property}/images/{image}/primary', [PropertyImageController::class, 'setPrimary'])->name('properties.images.set-primary');
    Route::delete('properties/{property}/images/{image}', [PropertyImageController::class, 'destroy'])->name('properties.images.destroy');
    
    // Trasy zarządzania załącznikami nieruchomości
    Route::post('properties/{property}/attachments', [PropertyAttachmentController::class, 'store'])->name('properties.attachments.store');
    Route::patch('properties/{property}/attachments/{attachment}', [PropertyAttachmentController::class, 'update'])->name('properties.attachments.update');
    Route::get('properties/{property}/attachments/{attachment}/download', [PropertyAttachmentController::class, 'download'])->name('properties.attachments.download');
    Route::delete('properties/{property}/attachments/{attachment}', [PropertyAttachmentController::class, 'destroy'])->name('properties.attachments.destroy');
    
    // Trasy zarządzania zdarzeniami nieruchomości
    Route::post('properties/{property}/events', [PropertyEventController::class, 'store'])->name('properties.events.store');
    Route::get('properties/{property}/events/{event}/edit', [PropertyEventController::class, 'edit'])->name('properties.events.edit');
    Route::match(['patch', 'post'], 'properties/{property}/events/{event}', [PropertyEventController::class, 'update'])->name('properties.events.update');
    Route::get('properties/{property}/events/{event}/download', [PropertyEventController::class, 'downloadAttachment'])->name('properties.events.download');
    Route::delete('properties/{property}/events/{event}', [PropertyEventController::class, 'destroy'])->name('properties.events.destroy');
    
    // Trasy zarządzania szablonami opłat
    Route::resource('fee-types', FeeTypeController::class);
    Route::get('fee-types/{feeType}/schedule', [FeeTypeController::class, 'schedule'])->name('fee-types.schedule');
    
    // Trasy szablonów opłat powiązanych z nieruchomością
    Route::get('properties/{property}/fee-types', [FeeTypeController::class, 'indexForProperty'])->name('properties.fee-types.index');
    Route::get('properties/{property}/fee-types/create', [FeeTypeController::class, 'createForProperty'])->name('properties.fee-types.create');
    Route::post('properties/{property}/fee-types', [FeeTypeController::class, 'storeForProperty'])->name('properties.fee-types.store');
    
    // Trasy zarządzania płatnościami
    Route::resource('payments', PaymentController::class);
    Route::get('properties/{property}/payments/required', [PaymentController::class, 'required'])->name('properties.payments.required');
    Route::post('properties/{property}/payments/create-required', [PaymentController::class, 'createRequired'])->name('properties.payments.create-required');
    Route::get('properties/{property}/payments/statistics', [PaymentController::class, 'statistics'])->name('properties.payments.statistics');
    
    // Trasy płatności powiązanych z nieruchomością
    Route::get('properties/{property}/payments', [PaymentController::class, 'indexForProperty'])->name('properties.payments.index');
    Route::get('properties/{property}/payments/create', [PaymentController::class, 'createForProperty'])->name('properties.payments.create');
    Route::post('properties/{property}/payments', [PaymentController::class, 'storeForProperty'])->name('properties.payments.store');
});

require __DIR__.'/auth.php';
