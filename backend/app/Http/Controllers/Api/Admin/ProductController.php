<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Traits\HandlesFileUploads;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use HandlesFileUploads;

    public function index(Request $request)
    {
        $query = Product::with('creator')
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
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable',
            'is_active' => 'nullable|boolean',
        ]);

        $baseSlug = Str::slug($validated['name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Product::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }
        $validated['slug'] = $slug;
        $validated['created_by'] = $request->user()->id;
        $validated['is_active'] = $request->input('is_active', true);

        if ($request->hasFile('thumbnail') || $request->input('thumbnail')) {
            $validated['thumbnail'] = $this->handleFileUpload($request->file('thumbnail') ?? $request->input('thumbnail'), 'products');
        }

        $product = Product::create($validated);
        $product->load('creator');

        return response()->json([
            'message' => 'Product created in catalog successfully',
            'product' => $product,
        ], 201);
    }

    public function show($id)
    {
        $product = Product::with(['creator', 'shops'])
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
            'category' => 'nullable|string|max:100',
            'description' => 'nullable|string',
            'base_price' => 'required|numeric|min:0',
            'thumbnail' => 'nullable',
            'is_active' => 'nullable|boolean',
        ]);

        if ($validated['name'] !== $product->name) {
            $baseSlug = Str::slug($validated['name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Product::where('slug', $slug)->where('id', '!=', $product->id)->exists()) {
                $slug = $baseSlug . '-' . $counter++;
            }
            $validated['slug'] = $slug;
        }

        if ($request->hasFile('thumbnail') || $request->input('thumbnail')) {
            $validated['thumbnail'] = $this->handleFileUpload($request->file('thumbnail') ?? $request->input('thumbnail'), 'products');
        } else {
            unset($validated['thumbnail']);
        }

        $product->update($validated);
        $product->load('creator');

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
