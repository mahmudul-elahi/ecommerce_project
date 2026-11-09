<?php

namespace App\Http\Controllers\Api\ShopOwner;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\ShopProduct;
use App\Services\ImageService;
use App\Traits\HandlesFileUploads;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductListingController extends Controller
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

        $query = ShopProduct::with(['product.creator', 'product.categoryRelation'])
            ->where('shop_id', $shop->id);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('custom_title', 'like', "%{$search}%")
                    ->orWhere('custom_description', 'like', "%{$search}%")
                    ->orWhereHas('product', function ($pq) use ($search) {
                        $pq->where('name', 'like', "%{$search}%")
                            ->orWhere('sku', 'like', "%{$search}%")
                            ->orWhere('category', 'like', "%{$search}%");
                    });
            });
        }

        if ($request->has('is_active') && $request->query('is_active') !== '') {
            $query->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $listings = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json($listings);
    }

    public function show(Request $request, $id)
    {
        $shop = $this->getAuthenticatedShop($request);

        $listing = ShopProduct::with(['product.creator', 'product.categoryRelation'])
            ->where('shop_id', $shop->id)
            ->findOrFail($id);

        return response()->json($listing);
    }

    public function update(Request $request, $id)
    {
        $shop = $this->getAuthenticatedShop($request);

        $listing = ShopProduct::where('shop_id', $shop->id)->findOrFail($id);

        // Check if resetting to catalog defaults
        if ($request->boolean('reset_to_catalog')) {
            $listing->update([
                'custom_price' => null,
                'custom_title' => null,
                'custom_description' => null,
                'custom_thumbnail' => null,
                'custom_images' => null,
            ]);
            $listing->load('product');

            return response()->json([
                'message' => 'Reset to shared catalog defaults',
                'listing' => $listing,
            ]);
        }

        $validated = $request->validate([
            'custom_price' => 'nullable|numeric|min:0',
            'custom_title' => 'nullable|string|max:255',
            'custom_description' => 'nullable|string',
            'custom_thumbnail' => 'nullable',
            'custom_images' => 'nullable',
            'clear_custom_thumbnail' => 'nullable|boolean',
            'clear_custom_images' => 'nullable|boolean',
            'stock' => 'nullable|integer|min:0',
            'is_active' => 'nullable|boolean',
        ]);

        $updateData = [];

        if (array_key_exists('custom_price', $validated)) {
            $updateData['custom_price'] = $validated['custom_price'] !== null && $validated['custom_price'] !== ''
                ? $validated['custom_price']
                : null;
        }

        if (array_key_exists('custom_title', $validated)) {
            $updateData['custom_title'] = $validated['custom_title'] ?: null;
        }

        if (array_key_exists('custom_description', $validated)) {
            $updateData['custom_description'] = $validated['custom_description'] ?: null;
        }

        if ($request->boolean('clear_custom_thumbnail')) {
            $updateData['custom_thumbnail'] = null;
        } elseif ($request->hasFile('custom_thumbnail') || $request->input('custom_thumbnail')) {
            $updateData['custom_thumbnail'] = ImageService::optimizeAndStore(
                $request->file('custom_thumbnail') ?? $request->input('custom_thumbnail'),
                'shop-products'
            );
        }

        if ($request->boolean('clear_custom_images')) {
            $updateData['custom_images'] = null;
        } elseif ($request->hasFile('custom_images') || $request->has('custom_images')) {
            $rawCustImages = $request->file('custom_images') ?? $request->input('custom_images');
            $rawCustArray = is_array($rawCustImages) ? $rawCustImages : [$rawCustImages];
            $updateData['custom_images'] = ImageService::processMultiple($rawCustArray, 'shop-products');
        }

        if (array_key_exists('stock', $validated)) {
            $updateData['stock'] = (int) $validated['stock'];
        }

        if ($request->has('is_active')) {
            $updateData['is_active'] = (bool) $request->input('is_active');
        }

        $listing->update($updateData);
        $listing->load('product');

        return response()->json([
            'message' => 'Shop product details updated successfully',
            'listing' => $listing,
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $shop = $this->getAuthenticatedShop($request);

        $listing = ShopProduct::where('shop_id', $shop->id)->findOrFail($id);
        $listing->delete();

        return response()->json([
            'message' => 'Product removed from your shop',
        ]);
    }
}
