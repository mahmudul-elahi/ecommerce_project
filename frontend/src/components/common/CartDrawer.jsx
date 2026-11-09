'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CartDrawer() {
  const {
    items,
    totalCount,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
  } = useCart();
  const router = useRouter();

  if (!isCartOpen) return null;

  const formatPrice = (val) => {
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside className="w-screen max-w-[417px] bg-white shadow-2xl flex flex-col font-sans">
          {/* Header */}
          <div className="p-7 pb-6 flex items-center justify-between border-b border-[#D9D9D9]">
            <h2 className="text-2xl font-semibold text-black tracking-tight">Shopping Cart</h2>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-full text-[#9F9F9F] hover:text-black hover:bg-slate-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-6">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 text-[#9F9F9F]">
                <div className="w-16 h-16 rounded-full bg-[#FAF3EA] flex items-center justify-center mb-4 text-[#B88E2F]">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="text-base font-medium text-slate-800">Your cart is empty</p>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                  Explore our collection and add some thoughtful pieces.
                </p>
                <Link
                  href="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-6 inline-flex px-6 py-2.5 rounded-full border border-[#B88E2F] text-[#B88E2F] text-xs font-semibold hover:bg-[#B88E2F] hover:text-white transition-colors"
                >
                  Explore Shop
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.shop_product_id}
                  className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#F9F9F9] hover:bg-[#F5F7FA] transition-colors border border-[#F0F0F0] hover:border-[#E6EFF5] group"
                >
                  <div className="w-[88px] h-[88px] rounded-[10px] bg-[#FAF3EA] overflow-hidden flex-shrink-0 flex items-center justify-center shadow-xs">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-8 h-8 text-[#B88E2F]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pr-1">
                    <h3 className="text-sm font-semibold text-slate-800 truncate mb-1" title={item.name}>
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-medium text-slate-600">{item.quantity}</span>
                      <span className="text-[11px] text-slate-400">×</span>
                      <span className="font-semibold text-[#B88E2F]">{formatPrice(item.price)}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2.5">
                      <button
                        onClick={() => updateQuantity(item.shop_product_id, item.quantity - 1)}
                        className="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
                        title="Decrease quantity"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold px-2 min-w-[20px] text-center text-slate-700">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.shop_product_id, item.quantity + 1)}
                        className="w-6 h-6 rounded-md bg-white border border-slate-200 text-xs text-slate-600 flex items-center justify-center hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer"
                        title="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.shop_product_id)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0 self-center cursor-pointer"
                    title="Remove item"
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Subtotal & Footer Actions */}
          {items.length > 0 && (
            <div className="p-7 pt-4 border-t border-[#D9D9D9] bg-white">
              <div className="flex items-center justify-between py-4">
                <span className="text-base font-normal text-black">Subtotal</span>
                <span className="text-base font-semibold text-[#B88E2F]">{formatPrice(subtotal)}</span>
              </div>

              <div className="h-[1px] bg-[#D9D9D9] my-4" />

              <div className="flex items-center justify-between gap-3 pt-2">
                <Link
                  href="/cart"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 text-center py-2.5 px-4 rounded-[50px] border border-black text-xs font-medium text-black hover:bg-black hover:text-white transition-colors"
                >
                  View Cart
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="flex-1 text-center py-2.5 px-4 rounded-[50px] bg-[#B88E2F] text-white border border-[#B88E2F] text-xs font-medium hover:bg-[#967125] transition-colors"
                >
                  Checkout
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
