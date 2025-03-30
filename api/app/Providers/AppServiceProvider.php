<?php

namespace App\Providers;

use App\Entities\Product;
use App\Repositories\ProductRepository;
use Doctrine\Persistence\ObjectRepository;
use Illuminate\Support\ServiceProvider;
use LaravelDoctrine\ORM\Facades\EntityManager;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app
            ->when(ProductRepository::class)
            ->needs(ObjectRepository::class)
            ->give(function () {
                return EntityManager::getRepository(Product::class);
            });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        //
    }
}
