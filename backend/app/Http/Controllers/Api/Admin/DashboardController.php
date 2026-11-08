<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function stats(Request $request)
    {
        $totalShops = Shop::count();
        $activeShops = Shop::where('status', 'active')->count();
        $totalProducts = Product::count();
        $totalShopOwners = User::where('role', 'shop_owner')->count();
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', '!=', 'cancelled')->sum('total_amount');

        $recentShops = Shop::with('owner')->latest()->limit(5)->get();
        $recentProducts = Product::with('creator')->latest()->limit(5)->get();
        $recentOrders = Order::with('shop')->latest()->limit(5)->get();

        return response()->json([
            'stats' => [
                'total_shops' => $totalShops,
                'active_shops' => $activeShops,
                'total_products' => $totalProducts,
                'total_shop_owners' => $totalShopOwners,
                'total_orders' => $totalOrders,
                'total_revenue' => (float) $totalRevenue,
            ],
            'recent_shops' => $recentShops,
            'recent_products' => $recentProducts,
            'recent_orders' => $recentOrders,
        ]);
    }
}
