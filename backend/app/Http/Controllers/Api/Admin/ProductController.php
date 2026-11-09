<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Services\ImageService;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['creator', 'categoryRelation'])
            ->withCount('shopProducts as shops_count');

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

        if ($request->has('is_active') && $request->query('is_active') !== '') {
            $query->where('is_active', filter_var($request->query('is_active'), FILTER_VALIDATE_BOOLEAN));
        }

        $products = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json($products);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'category_id' => 'nullable|integer|exists:categories,id',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable',
            'images' => 'nullable',
            'is_active' => 'nullable|boolean',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug.'-'.$counter++;
        }
        $validated['slug'] = $slug;
        $validated['created_by'] = $request->user()->id;
        $validated['is_active'] = $request->input('is_active', true);

        // Handle category linking
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

        // Handle multiple images with Laravel 13 optimization
        if ($request->hasFile('images') || $request->has('images')) {
            $rawImages = $request->file('images') ?? $request->input('images');
            $rawArray = is_array($rawImages) ? $rawImages : [$rawImages];
            $validated['images'] = ImageService::processMultiple($rawArray, 'products');
            if (empty($validated['thumbnail']) && !empty($validated['images'])) {
                $validated['thumbnail'] = $validated['images'][0];
            }
        }

        // Handle single thumbnail with Laravel 13 optimization
        if ($request->hasFile('thumbnail') || $request->input('thumbnail')) {
            $validated['thumbnail'] = ImageService::optimizeAndStore($request->file('thumbnail') ?? $request->input('thumbnail'), 'products');
        }

        $product = Product::create($validated);
        $product->load(['creator', 'categoryRelation']);

        return response()->json([
            'message' => 'Product created in catalog successfully',
            'product' => $product,
        ], 201);
    }

    public function show($id)
    {
        $product = Product::with(['creator', 'shops', 'categoryRelation'])
            ->withCount('shopProducts as shops_count')
            ->findOrFail($id);

        return response()->json($product);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'sku' => 'nullable|string|max:100',
            'category_id' => 'nullable|integer|exists:categories,id',
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable',
            'images' => 'nullable',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validated['name'] !== $product->name) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $baseSlug.'-'.$counter++;
            }
            $validated['slug'] = $slug;
        }

        // Handle category linking
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

        // Handle multiple images with Laravel 13 optimization
        if ($request->hasFile('images') || $request->has('images')) {
            $rawImages = $request->file('images') ?? $request->input('images');
            $rawArray = is_array($rawImages) ? $rawImages : [$rawImages];
            $validated['images'] = ImageService::processMultiple($rawArray, 'products');
            if (empty($validated['thumbnail']) && !empty($validated['images'])) {
                $validated['thumbnail'] = $validated['images'][0];
            }
        }

        // Handle single thumbnail with Laravel 13 optimization
        if ($request->hasFile('thumbnail') || $request->input('thumbnail')) {
            $validated['thumbnail'] = ImageService::optimizeAndStore($request->file('thumbnail') ?? $request->input('thumbnail'), 'products');
        } else {
            unset($validated['thumbnail']);
        }

        $product->update($validated);
        $product->load(['creator', 'categoryRelation']);

        return response()->json([
            'message' => 'Product updated successfully',
            'product' => $product,
        ]);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product removed from catalog successfully',
        ]);
    }
}
