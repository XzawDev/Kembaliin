<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Home\HomeController;
use App\Http\Controllers\Home\SearchController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Siswa\DashboardController;
use App\Http\Controllers\Item\ItemController;
use App\Http\Controllers\Item\ClaimController;
use App\Http\Controllers\Item\QrController;

// Admin (officer) controllers
use App\Http\Controllers\Admin\DashboardController as OfficerDashboardController;
use App\Http\Controllers\Admin\ItemController as OfficerItemController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\HistoryController;
use App\Http\Controllers\Admin\QrVerificationController;

// Redirect root to login
Route::get('/', fn() => redirect('/home'));

// Guest routes
Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
Route::post('/register', [RegisterController::class, 'storeRegister'])->name('register.store');

Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::post('/login', [LoginController::class, 'storeLogin'])->name('login.store');

// Public routes (no login required)
Route::get('/home', [HomeController::class, 'index'])->name('home');
Route::get('/qr/{token}', [QrController::class, 'generateQr'])->name('qr.generate');
Route::get('/search', [SearchController::class, 'index'])->name('search');

// Authenticated routes
Route::middleware(['auth'])->group(function () {
    // Siswa (student) routes
    Route::get('/Siswa/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');
    Route::get('/Siswa/laporan', [DashboardController::class, 'allReports'])->name('siswa.laporan');

    // Item CRUD (student)
    Route::get('/items/create', [ItemController::class, 'create'])->name('items.create');
    Route::post('/items', [ItemController::class, 'store'])->name('items.store');
    Route::get('/items/{item}/qr', [QrController::class, 'showQr'])->name('items.qr');
    Route::get('/items/{item}/edit', [ItemController::class, 'edit'])->name('items.edit');
    Route::match(['put', 'patch'], '/items/{item}', [ItemController::class, 'update'])->name('items.update');
    Route::delete('/items/{item}', [ItemController::class, 'destroy'])->name('items.destroy');

    // Owner detail item (with edit/delete controls)
    Route::get('/siswa/items/{item}', [ItemController::class, 'showForOwner'])->name('siswa.items.show');

    // Claim verification
    Route::get('/items/{item}/questions', [ClaimController::class, 'getQuestions'])->name('items.questions');
    Route::post('/items/{item}/verify-claim', [ClaimController::class, 'store'])->name('items.verify-claim');

    // Officer routes (role petugas)
    Route::middleware(['auth', 'role:petugas'])
        ->prefix('officer')
        ->name('officer.')
        ->group(function () {
            // Dashboard
            Route::get('/dashboard', [OfficerDashboardController::class, 'index'])->name('dashboard');

            // Item management
            Route::get('/items', [OfficerItemController::class, 'items'])->name('items');
            Route::get('/items/{item}', [OfficerItemController::class, 'showItem'])->name('items.show');
            Route::match(['put', 'patch'], '/items/{item}', [OfficerItemController::class, 'updateItem'])->name('items.update');
            Route::get('/items/by-token/{token}', [OfficerItemController::class, 'showItemByToken'])->name('items.by-token');

            // Category management
            Route::get('/categories', [CategoryController::class, 'categories'])->name('categories');
            Route::get('/categories/create', [CategoryController::class, 'createCategory'])->name('categories.create');
            Route::post('/categories', [CategoryController::class, 'storeCategory'])->name('categories.store');
            Route::get('/categories/{category}/edit', [CategoryController::class, 'editCategory'])->name('categories.edit');
            Route::put('/categories/{category}', [CategoryController::class, 'updateCategory'])->name('categories.update');
            Route::delete('/categories/{category}', [CategoryController::class, 'destroyCategory'])->name('categories.destroy');

            // History
            Route::get('/history', [HistoryController::class, 'history'])->name('history');

            // QR verification (handover)
            Route::get('/verify', [QrVerificationController::class, 'verifyQrPage'])->name('verify');
            Route::post('/items/{item}/verify-handover', [QrVerificationController::class, 'verifyItemHandover'])->name('items.verify-handover');
        });
});

// Public item detail – MUST be last to avoid conflicts with specific routes above
Route::get('/items/{item}', [ItemController::class, 'show'])->name('items.show');