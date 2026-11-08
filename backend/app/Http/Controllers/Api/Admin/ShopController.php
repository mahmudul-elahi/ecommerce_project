<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Traits\HandlesFileUploads;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShopController extends Controller
{
    use HandlesFileUploads;

    public function index(Request $request)
    {
        $query = Shop::with('owner')
            ->withCount(['shopProducts as products_count', 'orders as orders_count']);

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%")
                    ->orWhereHas('owner', function ($uq) use ($search) {
                        $uq->where('name', 'like', "%{$search}%")
                            ->orWhere('email', 'like', "%{$search}%");
                    });
            });
        }

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }

        $shops = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json($shops);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
            'logo' => 'nullable',
            'banner' => 'nullable',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Shop::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter++;
        }
        $validated['slug'] = $slug;

        if ($request->hasFile('logo') || $request->input('logo')) {
            $validated['logo'] = $this->handleFileUpload($request->file('logo') ?? $request->input('logo'), 'shops/logos');
        }

        if ($request->hasFile('banner') || $request->input('banner')) {
            $validated['banner'] = $this->handleFileUpload($request->file('banner') ?? $request->input('banner'), 'shops/banners');
        }

        $shop = Shop::create($validated);
        $shop->load('owner');

        return response()->json([
            'message' => 'Shop created successfully',
            'shop' => $shop,
        ], 201);
    }

    public function show($id)
    {
        $shop = Shop::with(['owner', 'shopProducts.product'])
            ->withCount(['shopProducts as products_count', 'orders as orders_count'])
            ->findOrFail($id);

        return response()->json($shop);
    }

    public function update(Request $request, $id)
    {
        $shop = Shop::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'nullable|exists:users,id',
            'description' => 'nullable|string',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'address' => 'nullable|string|max:255',
            'status' => 'required|in:active,inactive',
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
        $shop->load('owner');

        return response()->json([
            'message' => 'Shop updated successfully',
            'shop' => $shop,
        ]);
    }

    public function destroy($id)
    {
        $shop = Shop::findOrFail($id);
        $shop->delete();

        return response()->json([
            'message' => 'Shop deleted successfully',
        ]);
    }
}
