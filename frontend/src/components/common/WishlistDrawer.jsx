'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';
import { toast } from 'sonner';

export default function WishlistDrawer() {
  const {
    favorites,
    totalWishlistCount,
    isWishlistOpen,
    setIsWishlistOpen,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist();
  const { addToCart, setIsCartOpen } = useCart();
  const router = useRouter();

  if (!isWishlistOpen) return null;

  const formatPrice = (val) => {
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  const handleAddToCart = (item) => {
    const shop = item.shop || {
      id: 1,
      name: 'Furniro Flagship',
      slug: 'furniro',
    };
    const cartProduct = {
      shop_product_id: item.shop_product_id || item.id,
      product_id: item.product_id || item.id,
      name: item.name,
      price: item.price,
      thumbnail: item.thumbnail,
      stock: item.stock ?? 10,
    };

    addToCart(shop, cartProduct, 1);
    toast.success(`Added "${item.name}" to cart!`);
  };

  const handleMoveAllToCart = () => {
    if (favorites.length === 0) return;
    favorites.forEach((item) => {
      const shop = item.shop || {
        id: 1,
        name: 'Furniro Flagship',
        slug: 'furniro',
      };
      const cartProduct = {
        shop_product_id: item.shop_product_id || item.id,
        product_id: item.product_id || item.id,
        name: item.name,
        price: item.price,
        thumbnail: item.thumbnail,
        stock: item.stock ?? 10,
      };
      addToCart(shop, cartProduct, 1);
    });
    setIsWishlistOpen(false);
    setIsCartOpen(true);
    toast.success(`Added ${favorites.length} favorite item(s) to cart!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-[420px] bg-white shadow-2xl flex flex-col font-sans">
          {/* Header */}
          <div className="p-7 pb-6 flex items-center justify-between border-b border-[#D9D9D9]">
            <div className="flex items-center gap-2.5">
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
              <h2 className="text-2xl font-semibold text-black tracking-tight">Wishlist</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-600">
                {totalWishlistCount}
              </span>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="p-1.5 rounded-full text-[#9F9F9F] hover:text-black hover:bg-slate-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-5">
            {favorites.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#9F9F9F]">
                <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-rose-500">
                  <Heart className="w-8 h-8" />
                </div>
                <p className="text-base font-medium text-slate-800">Your wishlist is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[220px]">
                  Tap the Like button on any product to save items you adore for later.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-6 inline-flex px-6 py-2.5 rounded-full border border-[#B88E2F] text-[#B88E2F] text-xs font-semibold hover:bg-[#B88E2F] hover:text-white transition-colors"
                >
                  Explore Collection
                </Link>
              </div>
            ) : (
              favorites.map((item) => {
                const targetUrl = `/product/${item.shop_product_id || item.id}`;
                return (
                  <div
                    key={item.shop_product_id || item.id}
                    className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#F9F9F9] hover:bg-[#F5F7FA] transition-colors border border-transparent hover:border-[#E6EFF5] group"
                  >
                    <div
                      onClick={() => {
                        setIsWishlistOpen(false);
                        router.push(targetUrl);
                      }}
                      className="w-[85px] h-[85px] rounded-[10px] bg-white overflow-hidden flex-shrink-0 flex items-center justify-center cursor-pointer shadow-xs"
                    >
                      {item.thumbnail ? (
                        <img
                          src={item.thumbnail}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ShoppingBag className="w-7 h-7 text-[#B88E2F]" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        onClick={() => {
                          setIsWishlistOpen(false);
                          router.push(targetUrl);
                        }}
                        className="text-sm font-medium text-black truncate hover:text-[#B88E2F] cursor-pointer"
                        title={item.name}
                      >
                        {item.name}
                      </h3>
                      {item.shop?.name && (
                        <p className="text-[11px] text-[#718EBF] truncate mt-0.5">
                          from {item.shop.name}
                        </p>
                      )}
                      <p className="text-xs font-semibold text-[#B88E2F] mt-1">
                        {formatPrice(item.price)}
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleAddToCart(item)}
                          className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#B88E2F] text-white hover:bg-[#967125] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Cart</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            removeFromWishlist(item);
                            toast.info(`Removed "${item.name}" from wishlist.`);
                          }}
                          className="p-1 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          aria-label="Remove item"
                          title="Remove from favorites"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="p-7 border-t border-[#D9D9D9] bg-white">
              <div className="flex items-center justify-between text-xs text-[#718EBF] mb-3">
                <span>{favorites.length} item(s) saved</span>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Clear all items from your wishlist?')) {
                      clearWishlist();
                      toast.info('Wishlist cleared');
                    }
                  }}
                  className="text-rose-500 hover:text-rose-700 underline text-xs cursor-pointer"
                >
                  Clear all
                </button>
              </div>

              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleMoveAllToCart}
                  className="flex-1 py-2.5 px-4 rounded-[50px] bg-[#B88E2F] text-white text-xs font-semibold hover:bg-[#967125] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move All to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsWishlistOpen(false)}
                  className="py-2.5 px-5 rounded-[50px] border border-black text-xs font-medium text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
