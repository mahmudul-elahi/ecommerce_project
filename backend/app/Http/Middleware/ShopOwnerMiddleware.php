<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ShopOwnerMiddleware
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if (!$user || (!$user->isShopOwner() && !$user->isAdmin())) {
            return response()->json([
                'message' => 'Unauthorized. Shop owner access required.',
            ], 403);
        }

        return $next($request);
    }
}
