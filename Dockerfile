FROM php:8.2-fpm-alpine

# Instal dependensi sistem dan Node.js/NPM untuk build Vite
RUN apk add --no-cache \
    git \
    curl \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    oniguruma-dev \
    nodejs \
    npm

# Instal ekstensi PHP yang diperlukan Laravel
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Ambil Composer terbaru
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set folder kerja
WORKDIR /var/www

# Copy file project
COPY . /var/www

# 1. Instal dependensi PHP (Composer)
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 2. Instal dependensi JS dan Build Aset Vite
# Perintah ini akan menghasilkan folder public/build/manifest.json
RUN npm install && npm run build

# Atur izin folder agar bisa diakses oleh web server
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Jalankan server di port 8080 (sesuai rencana sebelumnya)
EXPOSE 8080
CMD php artisan serve --host=0.0.0.0 --port=8080