<?php

namespace App\Http\Controllers\Api\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Shop;
use App\Models\ShopProduct;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class StorefrontController extends Controller
{
    /**
     * List all active shops for customers to browse.
     */
    public function shops(Request $request)
    {
        $query = Shop::where('status', 'active')
            ->withCount(['shopProducts as products_count' => function ($q) {
                $q->where('is_active', true)
                    ->whereHas('product', function ($pq) {
                        $pq->where('is_active', true);
                    });
            }]);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $shops = $query->latest()->get();

        return response()->json($shops);
    }

    /**
     * List distinct categories from dynamic categories table.
     */
    public function categories()
    {
        $categories = Category::where('is_active', true)
            ->withCount(['products' => function ($pq) {
                $pq->where('is_active', true)
                    ->whereHas('shopProducts', function ($sq) {
                        $sq->where('is_active', true)
                            ->whereHas('shop', function ($s) {
                                $s->where('status', 'active');
                            });
                    });
            }])
            ->orderBy('id', 'asc')
            ->get()
            ->map(function ($cat) {
                return [
                    'id' => $cat->id,
                    'name' => $cat->name,
                    'slug' => $cat->slug,
                    'description' => $cat->description,
                    'image' => $cat->image_url,
                    'products_count' => $cat->products_count,
                ];
            });

        // If categories table is populated, return it directly
        if ($categories->isNotEmpty()) {
            return response()->json($categories);
        }

        // Fallback if no categories table entries yet: derive from shop products
        $categoryProducts = ShopProduct::where('is_active', true)
            ->whereHas('shop', function ($sq) {
                $sq->where('status', 'active');
            })
            ->whereHas('product', function ($pq) {
                $pq->where('is_active', true)->whereNotNull('category');
            })
            ->with('product')
            ->get();

        $fallbackCategories = $categoryProducts
            ->groupBy(function ($item) {
                return trim($item->product->category);
            })
            ->filter(function ($items, $categoryName) {
                return !empty($categoryName);
            })
            ->map(function ($items, $categoryName) {
                $first = $items->first();
                $image = $first ? $first->effective_thumbnail_url : null;

                return [
                    'id' => null,
                    'name' => $categoryName,
                    'slug' => Str::slug($categoryName),
                    'description' => null,
                    'products_count' => $items->count(),
                    'image' => $image,
                ];
            })
            ->values();

        return response()->json($fallbackCategories);
    }

    /**
     * List all customer-visible products across all active shops.
     * Only products assigned to active shops are returned.
     * Products not assigned to any shop are NEVER returned.
     */
    public function allAssignedProducts(Request $request)
    {
        $query = ShopProduct::with(['product.categoryRelation', 'shop'])
            ->where('is_active', true)
            ->whereHas('shop', function ($sq) {
                $sq->where('status', 'active');
            })
            ->whereHas('product', function ($pq) {
                $pq->where('is_active', true);
            });

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('custom_title', 'like', "%{$search}%")
                    ->orWhere('custom_description', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%")
                            ->orWhere('category', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%")
                            ->orWhereHas('categoryRelation', function ($cr) use ($search) {
                                $cr->where('name', 'like', "%{$search}%");
                            });
                    })
                    ->orWhereHas('shop', function ($sq) use ($search) {
                        $sq->where('name', 'like', "%{$search}%");
                    });
            });
        }

        if ($category = $request->query('category')) {
            if ($category !== 'All' && $category !== 'all') {
                $query->whereHas('product', function ($pq) use ($category) {
                    $pq->where(function ($q) use ($category) {
                        $q->where('category', $category)
                            ->orWhereHas('categoryRelation', function ($cr) use ($category) {
                                $cr->where('name', $category)->orWhere('slug', $category);
                            });
                    });
                });
            }
        }

        if ($categoryId = $request->query('category_id')) {
            $query->whereHas('product', function ($pq) use ($categoryId) {
                $pq->where('category_id', $categoryId);
            });
        }

        if ($shopId = $request->query('shop_id')) {
            $query->where('shop_id', $shopId);
        }

        if ($sort = $request->query('sort')) {
            if ($sort === 'price_asc' || $sort === 'price-low') {
                $query->orderBy(DB::raw('COALESCE(custom_price, (SELECT base_price FROM products WHERE products.id = shop_products.product_id))'), 'asc');
            } elseif ($sort === 'price_desc' || $sort === 'price-high') {
                $query->orderBy(DB::raw('COALESCE(custom_price, (SELECT base_price FROM products WHERE products.id = shop_products.product_id))'), 'desc');
            } elseif ($sort === 'name') {
                $query->orderBy(DB::raw('COALESCE(custom_title, (SELECT name FROM products WHERE products.id = shop_products.product_id))'), 'asc');
            } else {
                $query->latest();
            }
        } else {
            $query->latest();
        }

        $perPage = min((int) $request->query('per_page', 16), 100);
        $shopProducts = $query->paginate($perPage);

        $shopProducts->getCollection()->transform(function ($item) {
            $basePrice = (float) $item->product->base_price;
            $effPrice = (float) $item->effective_price;
            $discountPct = ($basePrice > $effPrice && $basePrice > 0)
                ? '-'.round((1 - ($effPrice / $basePrice)) * 100).'%'
                : null;

            return [
                'id' => $item->id,
                'shop_product_id' => $item->id,
                'shop_id' => $item->shop_id,
                'shop_name' => $item->shop->name,
                'shop_slug' => $item->shop->slug,
                'product_id' => $item->product_id,
                'name' => $item->effective_title,
                'subtitle' => $item->product->name !== $item->effective_title ? $item->product->name : ($item->product->category ?? 'Furniture & Living'),
                'description' => $item->effective_description,
                'price' => $effPrice,
                'original_base_price' => $basePrice,
                'has_custom_price' => ($item->custom_price !== null),
                'discount' => $discountPct,
                'badge' => $discountPct ?: ($item->created_at->diffInDays(now()) < 14 ? 'New' : null),
                'badgeType' => $discountPct ? 'discount' : 'new',
                'thumbnail' => $item->effective_thumbnail_url,
                'images' => $item->effective_images_urls,
                'category_id' => $item->product->category_id,
                'category' => $item->product->categoryRelation ? $item->product->categoryRelation->name : $item->product->category,
                'sku' => $item->product->sku,
                'stock' => $item->stock,
                'in_stock' => $item->stock > 0,
                'is_customized' => $item->is_customized,
            ];
        });

        return response()->json($shopProducts);
    }

    /**
     * Get single product detail by shop_product_id across any active shop.
     */
    public function singleProductDetail($shopProductId)
    {
        $item = ShopProduct::with(['product.categoryRelation', 'shop'])
            ->where('id', $shopProductId)
            ->where('is_active', true)
            ->whereHas('shop', function ($sq) {
                $sq->where('status', 'active');
            })
            ->whereHas('product', function ($pq) {
                $pq->where('is_active', true);
            })
            ->firstOrFail();

        $basePrice = (float) $item->product->base_price;
        $effPrice = (float) $item->effective_price;
        $discountPct = ($basePrice > $effPrice && $basePrice > 0)
            ? '-'.round((1 - ($effPrice / $basePrice)) * 100).'%'
            : null;

        return response()->json([
            'id' => $item->id,
            'shop_product_id' => $item->id,
            'shop' => [
                'id' => $item->shop->id,
                'name' => $item->shop->name,
                'slug' => $item->shop->slug,
                'logo_url' => $item->shop->logo_url,
                'banner_url' => $item->shop->banner_url,
                'phone' => $item->shop->phone,
                'email' => $item->shop->email,
                'address' => $item->shop->address,
            ],
            'product_id' => $item->product_id,
            'name' => $item->effective_title,
            'subtitle' => $item->product->name,
            'description' => $item->effective_description,
            'price' => $effPrice,
            'original_base_price' => $basePrice,
            'has_custom_price' => ($item->custom_price !== null),
            'discount' => $discountPct,
            'badge' => $discountPct ?: 'New',
            'badgeType' => $discountPct ? 'discount' : 'new',
            'thumbnail' => $item->effective_thumbnail_url,
            'images' => $item->effective_images_urls,
            'category_id' => $item->product->category_id,
            'category' => $item->product->categoryRelation ? $item->product->categoryRelation->name : $item->product->category,
            'sku' => $item->product->sku,
            'stock' => $item->stock,
            'in_stock' => $item->stock > 0,
            'is_customized' => $item->is_customized,
        ]);
    }

    /**
     * Get a specific shop profile.
     */
    public function shopDetail($slugOrId)
    {
        $shop = Shop::where('status', 'active')
            ->where(function ($q) use ($slugOrId) {
                $q->where('id', $slugOrId)
                    ->orWhere('slug', $slugOrId);
                if ($slugOrId === 'furniro') {
                    $q->orWhere('slug', 'woodora');
                }
            })
            ->withCount(['shopProducts as products_count' => function ($q) {
                $q->where('is_active', true)
                    ->whereHas('product', function ($pq) {
                        $pq->where('is_active', true);
                    });
            }])
            ->firstOrFail();

        return response()->json($shop);
    }

    /**
     * List only products assigned to a specific shop.
     * Displays shop-specific prices, details, and thumbnails.
     * Products not assigned to this shop are NEVER shown.
     */
    public function shopProducts(Request $request, $slugOrId)
    {
        $shop = Shop::where('status', 'active')
            ->where(function ($q) use ($slugOrId) {
                $q->where('id', $slugOrId)
                    ->orWhere('slug', $slugOrId);
                if ($slugOrId === 'furniro') {
                    $q->orWhere('slug', 'woodora');
                }
            })
            ->firstOrFail();

        $query = ShopProduct::with(['product.categoryRelation', 'shop'])
            ->where('shop_id', $shop->id)
            ->where('is_active', true)
            ->whereHas('product', function ($pq) {
                $pq->where('is_active', true);
            });

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('custom_title', 'like', "%{$search}%")
                    ->orWhere('custom_description', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%")
                            ->orWhere('category', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%")
                            ->orWhereHas('categoryRelation', function ($cr) use ($search) {
                                $cr->where('name', 'like', "%{$search}%");
                            });
                    });
            });
        }

        if ($category = $request->query('category')) {
            $query->whereHas('product', function ($pq) use ($category) {
                $pq->where(function ($q) use ($category) {
                    $q->where('category', $category)
                        ->orWhereHas('categoryRelation', function ($cr) use ($category) {
                            $cr->where('name', $category)->orWhere('slug', $category);
                        });
                });
            });
        }

        if ($categoryId = $request->query('category_id')) {
            $query->whereHas('product', function ($pq) use ($categoryId) {
                $pq->where('category_id', $categoryId);
            });
        }

        if ($sort = $request->query('sort')) {
            if ($sort === 'price_asc') {
                $query->orderBy(DB::raw('COALESCE(custom_price, (SELECT base_price FROM products WHERE products.id = shop_products.product_id))'), 'asc');
            } elseif ($sort === 'price_desc') {
                $query->orderBy(DB::raw('COALESCE(custom_price, (SELECT base_price FROM products WHERE products.id = shop_products.product_id))'), 'desc');
            } elseif ($sort === 'name') {
                $query->orderBy(DB::raw('COALESCE(custom_title, (SELECT name FROM products WHERE products.id = shop_products.product_id))'), 'asc');
            } else {
                $query->latest();
            }
        } else {
            $query->latest();
        }

        $shopProducts = $query->paginate($request->query('per_page', 12));

        // Format nicely for customer storefront
        $shopProducts->getCollection()->transform(function ($item) use ($shop) {
            return [
                'shop_product_id' => $item->id,
                'shop_id' => $shop->id,
                'shop_name' => $shop->name,
                'product_id' => $item->product_id,
                'name' => $item->effective_title,
                'description' => $item->effective_description,
                'price' => $item->effective_price,
                'original_base_price' => (float) $item->product->base_price,
                'has_custom_price' => ($item->custom_price !== null),
                'thumbnail' => $item->effective_thumbnail_url,
                'images' => $item->effective_images_urls,
                'category_id' => $item->product->category_id,
                'category' => $item->product->categoryRelation ? $item->product->categoryRelation->name : $item->product->category,
                'sku' => $item->product->sku,
                'stock' => $item->stock,
                'in_stock' => $item->stock > 0,
                'is_customized' => $item->is_customized,
            ];
        });

        return response()->json($shopProducts);
    }

    /**
     * Get single product detail in shop.
     */
    public function shopProductDetail($slugOrId, $shopProductId)
    {
        $shop = Shop::where('status', 'active')
            ->where(function ($q) use ($slugOrId) {
                $q->where('id', $slugOrId)
                    ->orWhere('slug', $slugOrId);
                if ($slugOrId === 'furniro') {
                    $q->orWhere('slug', 'woodora');
                }
            })
            ->firstOrFail();

        $item = ShopProduct::with(['product.categoryRelation', 'shop'])
            ->where('shop_id', $shop->id)
            ->where('id', $shopProductId)
            ->where('is_active', true)
            ->whereHas('product', function ($pq) {
                $pq->where('is_active', true);
            })
            ->firstOrFail();

        return response()->json([
            'shop_product_id' => $item->id,
            'shop' => [
                'id' => $shop->id,
                'name' => $shop->name,
                'slug' => $shop->slug,
                'logo_url' => $shop->logo_url,
                'phone' => $shop->phone,
                'email' => $shop->email,
            ],
            'product_id' => $item->product_id,
            'name' => $item->effective_title,
            'description' => $item->effective_description,
            'price' => $item->effective_price,
            'original_base_price' => (float) $item->product->base_price,
            'has_custom_price' => ($item->custom_price !== null),
            'thumbnail' => $item->effective_thumbnail_url,
            'images' => $item->effective_images_urls,
            'category_id' => $item->product->category_id,
            'category' => $item->product->categoryRelation ? $item->product->categoryRelation->name : $item->product->category,
            'sku' => $item->product->sku,
            'stock' => $item->stock,
            'in_stock' => $item->stock > 0,
            'is_customized' => $item->is_customized,
        ]);
    }

    /**
     * Customer Checkout for a specific shop.
     */
    public function checkout(Request $request)
    {
        $validated = $request->validate([
            'shop_id' => 'required|exists:shops,id',
            'customer_name' => 'required|string|max:255',
            'customer_email' => 'nullable|email|max:255',
            'customer_phone' => 'required|string|max:50',
            'shipping_address' => 'required|string',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.shop_product_id' => 'required|exists:shop_products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        $shop = Shop::where('status', 'active')->findOrFail($validated['shop_id']);

        return DB::transaction(function () use ($validated, $shop) {
            $totalAmount = 0;
            $itemsData = [];

            foreach ($validated['items'] as $rawItem) {
                $shopProduct = ShopProduct::with('product')
                    ->where('shop_id', $shop->id)
                    ->where('id', $rawItem['shop_product_id'])
                    ->where('is_active', true)
                    ->firstOrFail();

                $price = $shopProduct->effective_price;
                $quantity = (int) $rawItem['quantity'];
                $subtotal = $price * $quantity;
                $totalAmount += $subtotal;

                $itemsData[] = [
                    'shop_product' => $shopProduct,
                    'quantity' => $quantity,
                    'price' => $price,
                    'subtotal' => $subtotal,
                ];
            }

            $order = Order::create([
                'shop_id' => $shop->id,
                'order_number' => 'ORD-'.strtoupper(Str::random(10)),
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'] ?? null,
                'customer_phone' => $validated['customer_phone'],
                'shipping_address' => $validated['shipping_address'],
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($itemsData as $row) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'shop_product_id' => $row['shop_product']->id,
                    'product_name' => $row['shop_product']->effective_title,
                    'product_price' => $row['price'],
                    'quantity' => $row['quantity'],
                    'subtotal' => $row['subtotal'],
                ]);

                $row['shop_product']->decrement('stock', $row['quantity']);
            }

            return response()->json([
                'message' => 'Order created successfully!',
                'order' => $order->load('items'),
            ], 201);
        });
    }
}
