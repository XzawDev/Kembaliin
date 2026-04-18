FROM php:8.2-fpm-alpine

# Instal dependensi sistem dan Node.js/NPM
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

# Instal ekstensi PHP
RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

# Ambil Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

# Copy file project
COPY . /var/www

# 1. Instal dependensi PHP
RUN composer install --no-interaction --optimize-autoloader --no-dev

# 2. Instal dependensi JS dan Build Vite
RUN npm install && npm run build

# 3. Hapus node_modules setelah build (Biar Image Ringan)
RUN rm -rf node_modules

# Atur izin folder
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

# Gunakan port 9000 untuk PHP-FPM
EXPOSE 9000

# Jalankan PHP-FPM
CMD ["php-fpm"]