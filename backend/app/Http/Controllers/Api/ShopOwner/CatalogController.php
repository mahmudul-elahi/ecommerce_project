<?php

namespace App\Http\Controllers\Api\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Services\ImageService;
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

        if (! $shop) {
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

    public function index(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);
        $user = $request->user();

        $query = Product::with(['creator', 'categoryRelation'])->where('is_active', true);

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

        if ($categoryId = $request->query('category_id')) {
            $query->where('category_id', $categoryId);
        }

        // Get IDs of products already added to this shop
        $myShopProductIds = ShopProduct::where('shop_id', $shop->id)
            ->pluck('id', 'product_id')
            ->toArray();

        // Optional filter: only show products not yet added, or already added
        // Default to 'available' so products already in the shop do not show as duplicate copies in the catalog
        $filter = $request->query('status', 'available');
        if ($filter === 'added') {
            $query->whereIn('id', array_keys($myShopProductIds));
        } elseif ($filter === 'available') {
            $query->whereNotIn('id', array_keys($myShopProductIds));
        }
        // If filter is 'all', show all items

        $totalActiveCount = Product::where('is_active', true)->count();
        $addedCount = count($myShopProductIds);
        $availableCount = max(0, $totalActiveCount - $addedCount);

        $products = $query->latest()->paginate($request->query('per_page', 24));

        // Append shop-specific membership info
        $products->getCollection()->transform(function ($product) use ($myShopProductIds, $user, $shop) {
            $isInShop = array_key_exists($product->id, $myShopProductIds);
            $product->is_in_my_shop = $isInShop;
            $product->in_shop = $isInShop;
            $product->my_shop_product_id = $isInShop ? $myShopProductIds[$product->id] : null;
            $product->is_created_by_me = ($product->created_by === $user->id);

            if ($isInShop) {
                $product->shop_listing = ShopProduct::where('shop_id', $shop->id)
                    ->where('product_id', $product->id)
                    ->first();
            }

            return $product;
        });

        $responseData = $products->toArray();
        $responseData['counts'] = [
            'available' => $availableCount,
            'added' => $addedCount,
            'total' => $totalActiveCount,
        ];

        return response()->json($responseData);
    }

    /**
     * Shop owner creates a new product.
     * It is saved into the shared catalog AND automatically added to their own shop.
     * All uploaded images are optimized to WebP using Laravel 13 Image facade.
     */
    public function store(Request $request)
    {
        $shop = $this->getAuthenticatedShop($request);
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'category_id' => 'nullable|integer|exists:categories,id',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable',
            'images' => 'nullable',
            // Optional custom values for shop listing immediately
            'custom_price' => 'nullable|numeric|min:0',
            'custom_title' => 'nullable|string|max:255',
            'custom_description' => 'nullable|string',
            'custom_thumbnail' => 'nullable',
            'custom_images' => 'nullable',
            'stock' => 'nullable|integer|min:0',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter++;
        }

        // Link category
        if ($request->filled('category_id')) {
            $cat = Category::find($request->input('category_id'));
            if ($cat) {
                $validated['category'] = $cat->name;
            }
        } elseif ($request->filled('category')) {
            $cat = Category::firstOrCreate(['name' => trim($request->input('category'))]);
            $validated['category_id'] = $cat->id;
            $validated['category'] = $cat->name;
        }

        // Process multiple catalog images with Laravel 13 optimization
        $catalogImages = [];
        if ($request->hasFile('images') || $request->has('images')) {
            $rawImages = $request->file('images') ?? $request->input('images');
            $rawArray = is_array($rawImages) ? $rawImages : [$rawImages];
            $catalogImages = ImageService::processMultiple($rawArray, 'products');
        }

        // Process single catalog thumbnail
        $thumbnailPath = null;
        if ($request->hasFile('thumbnail') || $request->input('thumbnail')) {
            $thumbnailPath = ImageService::optimizeAndStore(
                $request->file('thumbnail') ?? $request->input('thumbnail'),
                'products'
            );
        } elseif (!empty($catalogImages)) {
            $thumbnailPath = $catalogImages[0];
        }

        // 1. Create product in shared catalog
        $product = Product::create([
            'created_by' => $user->id,
            'name' => $validated['name'],
            'slug' => $slug,
            'sku' => $validated['sku'] ?? null,
            'category_id' => $validated['category_id'] ?? null,
            'category' => $validated['category'] ?? null,
            'description' => $validated['description'] ?? null,
            'base_price' => $validated['base_price'],
            'thumbnail' => $thumbnailPath,
            'images' => !empty($catalogImages) ? $catalogImages : ($thumbnailPath ? [$thumbnailPath] : []),
            'is_active' => true,
        ]);

        // Process custom shop images with Laravel 13 optimization
        $customImages = [];
        if ($request->hasFile('custom_images') || $request->has('custom_images')) {
            $rawCustImages = $request->file('custom_images') ?? $request->input('custom_images');
            $rawCustArray = is_array($rawCustImages) ? $rawCustImages : [$rawCustImages];
            $customImages = ImageService::processMultiple($rawCustArray, 'shop-products');
        }

        // Process custom thumbnail
        $customThumbnailPath = null;
        if ($request->hasFile('custom_thumbnail') || $request->input('custom_thumbnail')) {
            $customThumbnailPath = ImageService::optimizeAndStore(
                $request->file('custom_thumbnail') ?? $request->input('custom_thumbnail'),
                'shop-products'
            );
        } elseif (!empty($customImages)) {
            $customThumbnailPath = $customImages[0];
        }

        // 3. Automatically add to their own shop
        $shopProduct = ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $product->id,
            'custom_price' => $validated['custom_price'] ?? null,
            'custom_title' => $validated['custom_title'] ?? null,
            'custom_description' => $validated['custom_description'] ?? null,
            'custom_thumbnail' => $customThumbnailPath,
            'custom_images' => !empty($customImages) ? $customImages : null,
            'stock' => $validated['stock'] ?? 100,
            'is_active' => true,
        ]);

        $shopProduct->load(['product.categoryRelation', 'shop']);

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
            'custom_images' => 'nullable',
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
            ], 422);
        }

        $customImages = [];
        if ($request->hasFile('custom_images') || $request->has('custom_images')) {
            $rawCustImages = $request->file('custom_images') ?? $request->input('custom_images');
            $rawCustArray = is_array($rawCustImages) ? $rawCustImages : [$rawCustImages];
            $customImages = ImageService::processMultiple($rawCustArray, 'shop-products');
        }

        $customThumbnailPath = null;
        if ($request->hasFile('custom_thumbnail') || $request->input('custom_thumbnail')) {
            $customThumbnailPath = ImageService::optimizeAndStore(
                $request->file('custom_thumbnail') ?? $request->input('custom_thumbnail'),
                'shop-products'
            );
        } elseif (!empty($customImages)) {
            $customThumbnailPath = $customImages[0];
        }

        $shopProduct = ShopProduct::create([
            'shop_id' => $shop->id,
            'product_id' => $validated['product_id'],
            'custom_price' => $validated['custom_price'] ?? null,
            'custom_title' => $validated['custom_title'] ?? null,
            'custom_description' => $validated['custom_description'] ?? null,
            'custom_thumbnail' => $customThumbnailPath,
            'custom_images' => !empty($customImages) ? $customImages : null,
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
