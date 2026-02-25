<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;

// PERBAIKAN: Ubah route '/' agar langsung melempar (redirect) ke halaman login
Route::get('/', function () {
    return redirect('/login');
});

// Route Register
Route::get('/register', function () {
    return Inertia::render('Register'); // Pastikan file di resources/js/Pages/ bernama Register.jsx
})->name('register');

Route::post('/register', [RegisterController::class, 'storeRegister'])->name('register.store');

// Route Login
Route::get('/login', function () {
    return Inertia::render('Login'); // Pastikan file di resources/js/Pages/ bernama Login.jsx
})->name('login');

Route::post('/login', [LoginController::class, 'storeLogin'])->name('login.store');