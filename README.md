# Laravel Application

Aplikasi ini dibuat menggunakan framework Laravel.

## Tentang Laravel

Laravel adalah framework web berbasis PHP dengan sintaks yang elegan dan ekspresif. Laravel mempermudah pengembangan aplikasi web dengan menyediakan fitur-fitur yang umum digunakan seperti routing, authentication, session, dan caching.

Fitur utama Laravel:

- Routing sederhana dan cepat
- Dependency Injection Container
- ORM Database yang powerful (Eloquent)
- Database Migration
- Blade Template Engine
- Sistem Authentication
- Task Scheduling
- Queue Management

## Persyaratan Sistem

Pastikan sistem kamu memiliki:

- PHP >= 8.1
- Composer
- MySQL / MariaDB
- Node.js & NPM (optional, untuk frontend)

## Instalasi

Ikuti langkah berikut untuk menjalankan project:

```bash
# Clone repository
git clone <url-repository>

# Masuk ke folder project
cd nama-project

# Install dependency PHP
composer install

# Copy file environment
cp .env.example .env

# Generate application key
php artisan key:generate

# Setup database di file .env lalu jalankan migration
php artisan migrate

# Jalankan server
php artisan serve
```
