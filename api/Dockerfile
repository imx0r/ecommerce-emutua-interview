FROM php:8.2-fpm
LABEL authors="gabriel.santos"

# set working directory
WORKDIR /var/www/html

# install all required dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-configure gd \
    && docker-php-ext-install gd pdo pdo_mysql

# install redis php extension
RUN pecl install redis && docker-php-ext-enable redis

# install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# copy laravel backend
COPY . /var/www/html

# set laravel folders permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html/storage /var/www/html/bootstrap/cache

# expose port 9000 for php-fpm
EXPOSE 9000

# start php-fpm
CMD ["php-fpm"]
