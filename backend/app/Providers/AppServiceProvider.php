<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Enforce strict Eloquent model checks in non-production environments
        // (prevents lazy-loading/N+1 queries, prevents silently discarding attributes, prevents accessing missing attributes)
        Model::shouldBeStrict(! $this->app->isProduction());
    }
}
