<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\OfficerController;

// Redirect root to login
Route::get('/', function () {
    return redirect('/login');
});

// Guest routes (no authentication required)
Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');
Route::post('/register', [RegisterController::class, 'storeRegister'])->name('register.store');

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');
Route::post('/login', [LoginController::class, 'storeLogin'])->name('login.store');

// Public route – accessible to everyone
Route::get('/home', [HomeController::class, 'index'])->name('home');

// Public QR code image route – must be accessible without login
Route::get('/qr/{token}', [ItemController::class, 'generateQr'])->name('qr.generate');

// Protected routes (require authentication)
Route::middleware(['auth'])->group(function () {
    // Student dashboard
    Route::get('/Siswa/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Logout
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    // Item creation and QR display (authenticated)
    Route::get('/items/create', [ItemController::class, 'create'])->name('items.create');
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');
    Route::get('/items/{item}/qr', [ItemController::class, 'showQr'])->name('items.qr');

    // Officer routes – require authentication + 'petugas' role
    Route::middleware(['auth', 'role:petugas'])
        ->prefix('officer')
        ->name('officer.')
        ->group(function () {
            Route::get('/dashboard', [OfficerController::class, 'index'])->name('dashboard');
            Route::get('/items', [OfficerController::class, 'items'])->name('items');
            Route::get('/items/{item}', [OfficerController::class, 'showItem'])->name('items.show');
            Route::match(['put', 'patch'], '/items/{item}', [OfficerController::class, 'updateItem'])->name('items.update');

            // Category CRUD
            Route::get('/categories', [OfficerController::class, 'categories'])->name('categories');
            Route::get('/categories/create', [OfficerController::class, 'createCategory'])->name('categories.create');
            Route::post('/categories', [OfficerController::class, 'storeCategory'])->name('categories.store');
            Route::get('/categories/{category}/edit', [OfficerController::class, 'editCategory'])->name('categories.edit');
            Route::put('/categories/{category}', [OfficerController::class, 'updateCategory'])->name('categories.update');
            Route::delete('/categories/{category}', [OfficerController::class, 'destroyCategory'])->name('categories.destroy');

            // History
            Route::get('/history', [OfficerController::class, 'history'])->name('history');

            // QR Verification
            Route::get('/verify', [OfficerController::class, 'verifyQrPage'])->name('verify');
            Route::match(['get', 'post'], '/verify-handover/{token}', [OfficerController::class, 'verifyHandover'])->name('verifyHandover');

            Route::get('/items/by-token/{token}', [OfficerController::class, 'showItemByToken'])->name('items.by-token');
            Route::post('/items/{item}/verify-handover', [OfficerController::class, 'verifyItemHandover'])->name('items.verify-handover');
            
        });
});
