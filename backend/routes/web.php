<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Fallback web route: friendly API landing page with links to endpoints.
|
*/

Route::get('/{any?}', function () {
    return response()->json([
        'system' => 'OmniShop E-commerce Management API',
        'status' => 'operational',
        'backend' => 'Laravel 12 / PHP ' . PHP_VERSION,
        'frontend_dev_url' => 'http://localhost:3000',
        'quick_links' => [
            'browse_shops_api' => url('/api/customer/shops'),
            'admin_dashboard_api' => url('/api/admin/dashboard'),
            'documentation' => 'See README.md in project root',
        ],
        'note' => 'To run the frontend, execute "npm run dev" inside /frontend (or "./run.sh" from project root).',
    ]);
})->where('any', '^(?!api|sanctum|storage).*$');
