<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::with('shop');

        if ($role = $request->query('role')) {
            $query->where('role', $role);
        } else {
            $query->where('role', 'shop_owner');
        }

        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        $users = $query->latest()->paginate($request->query('per_page', 15));

        return response()->json($users);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:50',
            'role' => 'nullable|in:shop_owner,admin',
            'is_active' => 'nullable|boolean',
            'shop_name' => 'nullable|string|max:255',
            'shop_id' => 'nullable|exists:shops,id',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'] ?? 'shop_owner',
            'phone' => $validated['phone'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // If existing shop_id is provided, attach to shop
        if (! empty($validated['shop_id'])) {
            $shop = Shop::find($validated['shop_id']);
            if ($shop) {
                $shop->update(['user_id' => $user->id]);
            }
        } elseif (! empty($validated['shop_name'])) {
            // Create a new shop for this owner
            $baseSlug = Str::slug($validated['shop_name']);
            $slug = $baseSlug;
            $counter = 1;
            while (Shop::where('slug', $slug)->exists()) {
                $slug = $baseSlug.'-'.$counter++;
            }
            Shop::create([
                'user_id' => $user->id,
                'name' => $validated['shop_name'],
                'slug' => $slug,
                'status' => 'active',
            ]);
        }

        $user->load('shop');

        return response()->json([
            'message' => 'Shop owner account created successfully',
            'user' => $user,
        ], 201);
    }

    public function show($id)
    {
        $user = User::with('shop')->findOrFail($id);

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'phone' => 'nullable|string|max:50',
            'role' => 'nullable|in:shop_owner,admin',
            'is_active' => 'nullable|boolean',
            'shop_id' => 'nullable|exists:shops,id',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'is_active' => $request->has('is_active') ? (bool) $request->input('is_active') : $user->is_active,
        ];

        if (! empty($validated['role'])) {
            $updateData['role'] = $validated['role'];
        }

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        // Update shop assignment if shop_id provided
        if (array_key_exists('shop_id', $validated)) {
            // Unassign old shop if any
            if ($user->shop && $user->shop->id !== $validated['shop_id']) {
                $user->shop->update(['user_id' => null]);
            }
            if (! empty($validated['shop_id'])) {
                $newShop = Shop::find($validated['shop_id']);
                if ($newShop) {
                    $newShop->update(['user_id' => $user->id]);
                }
            }
        }

        $user->load('shop');

        return response()->json([
            'message' => 'User updated successfully',
            'user' => $user,
        ]);
    }

    public function destroy($id)
    {
        $user = User::findOrFail($id);
        if ($user->id === auth()->id()) {
            return response()->json(['message' => 'Cannot delete your own account.'], 422);
        }

        // Unlink shop if any
        if ($user->shop) {
            $user->shop->update(['user_id' => null]);
        }

        $user->delete();

        return response()->json([
            'message' => 'User deleted successfully',
        ]);
    }
}
