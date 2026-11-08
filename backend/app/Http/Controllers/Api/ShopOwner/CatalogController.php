<?php

namespace App\Http\Controllers\Api\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Traits\HandlesFileUploads;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CatalogController extends Controller
{
    use HandlesFileUploads;

    protected function getAuthenticatedShop(Request $request): Shop
    {
        $user = $request->user();
        $shop = $user->shop;

        if (!$shop) {
            $baseSlug = Str::slug($user->name . ' Shop');
            $slug = $baseSlug;
            $counter = 1;
            while (Shop::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            $shop = Shop::create([
                'user_id' => $user->id,
                'name' => $user->name . "'s Store",
                'slug' => $slug,
                'status' => 'active',
            ]);
        }

        return $shop;
    }

    public function index(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);
        $user = $request->user();

        $query = Product::with('creator')->where('is_active', true);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('category', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($category = $request->query('category')) {
            $query->where('category', $category);
        }

        // Get IDs of products already added to this shop
        $myShopProductIds = ShopProduct::where('shop_id', $shop->id)
            ->pluck('id', 'product_id')
            ->toArray();

        // Optional filter: only show products not yet added, or already added
        $filter = $request->query('status'); // 'added', 'available'
        if ($filter === 'added') {
            $query->whereIn('id', array_keys($myShopProductIds));
        } elseif ($filter === 'available') {
            $query->whereNotIn('id', array_keys($myShopProductIds));
        }

        $products = $query->latest()->paginate($request->query('per_page', 12));

        // Append shop-specific membership info
        $products->getCollection()->transform(function ($product) use ($myShopProductIds, $user) {
            $isInShop = array_key_exists($product->id, $myShopProductIds);
            $product->is_in_my_shop = $isInShop;
            $product->my_shop_product_id = $isInShop ? $myShopProductIds[$product->id] : null;
            $product->is_created_by_me = ($product->created_by === $user->id);
            return $product;
        });

        return response()->json($products);
    }

    /**
     * Shop owner creates a new product.
     * It is saved into the shared catalog AND automatically added to their own shop.
     */
    public function store(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable',
            // Optional custom values for shop listing immediately
            'custom_price' => 'nullable|numeric|min:0',
            'custom_title' => 'nullable|string|max:255',
            'custom_description' => 'nullable|string',
            'custom_thumbnail' => 'nullable',
            'stock' => 'nullable|integer|min:0',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $thumbnailPath = null;
        if ($request->hasFile('thumbnail') || $request->input('thumbnail')) {
            $thumbnailPath = $this->handleFileUpload($request->file('thumbnail') ?? $request->input('thumbnail'), 'products');
        }

        // 1. Create product in shared catalog
        $product = Product::create([
            'created_by' => $user->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'sku' => $validated['sku'] ?? null,
            'category' => $validated['category'] ?? null,
            'description' => $validated['description'] ?? null,
            'base_price' => $validated['base_price'],
            'thumbnail' => $thumbnailPath,
            'is_active' => true,
        ]);

        // 2. Custom thumbnail for shop if provided separately
        $customThumbnailPath = null;
        if ($request->hasFile('custom_thumbnail') || $request->input('custom_thumbnail')) {
            $customThumbnailPath = $this->handleFileUpload($request->file('custom_thumbnail') ?? $request->input('custom_thumbnail'), 'shop-products');
        }

        // 3. Automatically add to their own shop
        $shopProduct = ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'custom_price' => $validated['custom_price'] ?? null,
            'custom_title' => $validated['custom_title'] ?? null,
            'custom_description' => $validated['custom_description'] ?? null,
            'custom_thumbnail' => $customThumbnailPath,
            'stock' => $validated['stock'] ?? 100,
            'is_active' => true,
        ]);

        $shopProduct->load('product');

        return response()->json([
            'message' => 'Product created and added to shared catalog and your shop',
            'product' => $product,
            'shop_product' => $shopProduct,
        ], 201);
    }

    /**
     * Add an existing shared catalog product to their shop.
     */
    public function addToShop(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);

        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'custom_price' => 'nullable|numeric|min:0',
            'custom_title' => 'nullable|string|max:255',
            'custom_description' => 'nullable|string',
            'custom_thumbnail' => 'nullable',
            'stock' => 'nullable|integer|min:0',
        ]);

        // Check if already in shop
        $existing = ShopProduct::where('shop_id', $shop->id)
            ->where('product_id', $validated['product_id'])
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'This product is already listed in your shop.',
                'shop_product' => $existing->load('product'),
            ], 200);
        }

        $customThumbnailPath = null;
        if ($request->hasFile('custom_thumbnail') || $request->input('custom_thumbnail')) {
            $customThumbnailPath = $this->handleFileUpload($request->file('custom_thumbnail') ?? $request->input('custom_thumbnail'), 'shop-products');
        }

        $shopProduct = ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $validated['product_id'],
            'custom_price' => $validated['custom_price'] ?? null,
            'custom_title' => $validated['custom_title'] ?? null,
            'custom_description' => $validated['custom_description'] ?? null,
            'custom_thumbnail' => $customThumbnailPath,
            'stock' => $validated['stock'] ?? 100,
            'is_active' => true,
        ]);

        $shopProduct->load('product');

        return response()->json([
            'message' => 'Product added to your shop successfully',
            'shop_product' => $shopProduct,
        ], 201);
    }
}
