<?php

namespace App\Http\Controllers\Api\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\Shop;
use App\Traits\HandlesFileUploads;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShopController extends Controller
{
    use HandlesFileUploads;

    protected function getAuthenticatedShop(Request $request): Shop
    {
        $user = $request->user();
        $shop = $user->shop;

        if (! $shop) {
            // If shop owner doesn't have a shop yet, create a default one for them
            $baseSlug = Str::slug($user->name.' Shop');
            $slug = $baseSlug;
            $counter = 1;
            while (Shop::where('slug', $slug)->exists()) {
                $slug = $baseSlug.'-'.$counter++;
            }
            $shop = Shop::create([
                'user_id' => $user->id,
                'name' => $user->name."'s Store",
                'slug' => $slug,
                'status' => 'active',
            ]);
        }

        return $shop;
    }

    public function myShop(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);
        $shop->loadCount(['shopProducts as products_count', 'orders as orders_count']);

        return response()->json([
            'shop' => $shop,
        ]);
    }

    public function updateMyShop(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'phone' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'address' => 'nullable|string|max:255',
            'logo' => 'nullable',
            'banner' => 'nullable',
        ]);

        if ($validated['name'] !== $shop->name) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Shop::where('slug', $slug)->where('id', '!=', $shop->id)->exists()) {
                $slug = $baseSlug.'-'.$counter++;
            }
            $validated['slug'] = $slug;
        }

        if ($request->hasFile('logo') || $request->input('logo')) {
            $validated['logo'] = $this->handleFileUpload($request->file('logo') ?? $request->input('logo'), 'shops/logos');
        } else {
            unset($validated['logo']);
        }

        if ($request->hasFile('banner') || $request->input('banner')) {
            $validated['banner'] = $this->handleFileUpload($request->file('banner') ?? $request->input('banner'), 'shops/banners');
        } else {
            unset($validated['banner']);
        }

        $shop->update($validated);

        return response()->json([
            'message' => 'Shop information updated successfully',
            'shop' => $shop,
        ]);
    }

    public function stats(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);

        $myProductsCount = $shop->shopProducts()->count();
        $totalCatalogCount = Product::where('is_active', true)->count();
        $totalOrders = Order::where('shop_id', $shop->id)->count();
        $totalRevenue = Order::where('shop_id', $shop->id)
            ->where('status', '!=', 'cancelled')
            ->sum('total_amount');

        $recentOrders = Order::where('shop_id', $shop->id)
            ->latest()
            ->limit(5)
            ->get();

        return response()->json([
            'stats' => [
                'my_products_count' => $myProductsCount,
                'total_catalog_count' => $totalCatalogCount,
                'total_orders' => $totalOrders,
                'total_revenue' => (float) $totalRevenue,
            ],
            'recent_orders' => $recentOrders,
        ]);
    }

    public function orders(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);

        $orders = Order::where('shop_id', $shop->id)
            ->with('items')
            ->latest()
            ->paginate($request->query('per_page', 15));

        return response()->json($orders);
    }

    public function updateOrderStatus(Request $request, $orderId)
    {
        $shop = $this->getAuthenticatedShop($request);
        $order = Order::where('shop_id', $shop->id)->findOrFail($orderId);

        $validated = $request->validate([
            'status' => 'required|in:pending,processing,completed,cancelled',
        ]);

        $order->update(['status' => $validated['status']]);

        return response()->json([
            'message' => 'Order status updated',
            'order' => $order,
        ]);
    }
}
