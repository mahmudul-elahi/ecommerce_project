<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Fallback web route: if the frontend production build exists in public/dist,
| serve index.html. Otherwise, show a friendly status page with API links.
|
*/

Route::get('/{any?}', function () {
    $spaIndex = public_path('dist/index.html');
    if (file_exists($spaIndex)) {
        return response()->file($spaIndex);
    }

    return response()->json([
        'system' => 'OmniShop E-commerce Management API',
        'status' => 'operational',
        'backend' => 'Laravel 12 / PHP ' . PHP_VERSION,
        'frontend_dev_url' => 'http://localhost:5173',
        'quick_links' => [
            'browse_shops_api' => url('/api/customer/shops'),
            'admin_dashboard_api' => url('/api/admin/dashboard'),
            'documentation' => 'See README.md in project root',
        ],
        'note' => 'To run the frontend, execute "npm run dev" inside /frontend (or "./run.sh" from project root).',
    ]);
})->where('any', '^(?!api|sanctum|storage).*$');
