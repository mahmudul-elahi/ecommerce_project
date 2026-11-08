<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials do not match our records.'],
            ]);
        }

        if (!$user->is_active) {
            return response()->json([
                'message' => 'Your account is deactivated. Please contact support.',
            ], 403);
        }

        $user->load('shop');
        $token = $user->createToken('auth-token')->plainTextToken;

        return response()->json([
            'message' => 'Login successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'shop' => $user->shop,
            ],
        ]);
    }

    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:50',
            'shop_name' => 'required|string|max:255',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'shop_owner',
            'phone' => $validated['phone'] ?? null,
            'is_active' => true,
        ]);

        // Automatically create their shop
        $baseSlug = Str::slug($validated['shop_name']);
        $slug = $baseSlug;
        $counter = 1;
        while (Shop::where('slug', $slug)->exists()) {
            $slug = $baseSlug . '-' . $counter++;
        }

        $shop = Shop::create([
            'user_id' => $user->id,
            'name' => $validated['shop_name'],
            'slug' => $slug,
            'status' => 'active',
        ]);

        $token = $user->createToken('auth-token')->plainTextToken;
        $user->load('shop');

        return response()->json([
            'message' => 'Registration successful',
            'token' => $token,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'shop' => $user->shop,
            ],
        ], 201);
    }

    public function me(Request $request)
    {
        $user = $request->user()->load('shop');
        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'phone' => $user->phone,
                'shop' => $user->shop,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}
