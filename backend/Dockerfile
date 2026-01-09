FROM php:8.4-cli-alpine

RUN apk add --no-cache \
    bash git curl zip unzip \
    libzip-dev oniguruma-dev icu-dev mysql-client

RUN docker-php-ext-install pdo pdo_mysql mbstring zip intl

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www
