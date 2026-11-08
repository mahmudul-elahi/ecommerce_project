<?php

use App\Http\Controllers\Api\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Api\Admin\ProductController as AdminProductController;
use App\Http\Controllers\Api\Admin\ShopController as AdminShopController;
use App\Http\Controllers\Api\Admin\UserController as AdminUserController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\Customer\StorefrontController;
use App\Http\Controllers\Api\ShopOwner\CatalogController as ShopOwnerCatalogController;
use App\Http\Controllers\Api\ShopOwner\ProductListingController as ShopOwnerProductListingController;
use App\Http\Controllers\Api\ShopOwner\ShopController as ShopOwnerShopController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Public Authentication Routes
|--------------------------------------------------------------------------
*/
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']);
    });
});

/*
|--------------------------------------------------------------------------
| Public Customer Storefront Routes
|--------------------------------------------------------------------------
| Customers only see products assigned to a shop.
| Displays shop-specific prices, details, and thumbnails.
| Products not assigned to any shop are never visible.
*/
Route::prefix('customer')->group(function () {
    Route::get('/shops', [StorefrontController::class, 'shops']);
    Route::get('/shops/{slugOrId}', [StorefrontController::class, 'shopDetail']);
    Route::get('/shops/{slugOrId}/products', [StorefrontController::class, 'shopProducts']);
    Route::get('/shops/{slugOrId}/products/{shopProductId}', [StorefrontController::class, 'shopProductDetail']);
    Route::post('/checkout', [StorefrontController::class, 'checkout']);
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'stats']);

    // Shop Management (CRUD)
    Route::apiResource('shops', AdminShopController::class);

    // Product Catalog Management (CRUD)
    Route::apiResource('products', AdminProductController::class);

    // Shop Owner Accounts Management (CRUD)
    Route::apiResource('users', AdminUserController::class);
});

/*
|--------------------------------------------------------------------------
| Shop Owner Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth:sanctum', 'shop_owner'])->prefix('shop-owner')->group(function () {
    // Shop Profile & Stats
    Route::get('/my-shop', [ShopOwnerShopController::class, 'myShop']);
    Route::match(['put', 'post'], '/my-shop', [ShopOwnerShopController::class, 'updateMyShop']);
    Route::get('/dashboard', [ShopOwnerShopController::class, 'stats']);
    Route::get('/orders', [ShopOwnerShopController::class, 'orders']);
    Route::put('/orders/{id}/status', [ShopOwnerShopController::class, 'updateOrderStatus']);

    // Shared Catalog Browsing & Adding
    Route::get('/catalog', [ShopOwnerCatalogController::class, 'index']);
    Route::post('/catalog/create', [ShopOwnerCatalogController::class, 'store']);
    Route::post('/catalog/add-to-shop', [ShopOwnerCatalogController::class, 'addToShop']);

    // Shop's Product Listings Management (Custom Prices, Details, Thumbnails)
    Route::get('/products', [ShopOwnerProductListingController::class, 'index']);
    Route::get('/products/{id}', [ShopOwnerProductListingController::class, 'show']);
    Route::match(['put', 'post'], '/products/{id}', [ShopOwnerProductListingController::class, 'update']);
    Route::delete('/products/{id}', [ShopOwnerProductListingController::class, 'destroy']);
});
