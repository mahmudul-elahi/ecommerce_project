'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/client';

export default function CartDrawer() {
  const { cartShop, items, totalCount, subtotal, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, clearCart } = useCart();
  const { addToast } = useToast();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    shipping_address: '',
    notes: '',
  });

  if (!isCartOpen) return null;

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!formData.customer_name || !formData.customer_phone || !formData.shipping_address) {
      addToast('Please fill in required fields (Name, Phone, Shipping Address)', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        shop_id: cartShop.id,
        customer_name: formData.customer_name,
        customer_phone: formData.customer_phone,
        customer_email: formData.customer_email || null,
        shipping_address: formData.shipping_address,
        notes: formData.notes || null,
        items: items.map((i) => ({
          shop_product_id: i.shop_product_id,
          quantity: i.quantity,
        })),
      };

      const res = await api.post('/customer/checkout', payload);
      setOrderComplete(res.data.order);
      clearCart();
      setIsCheckingOut(false);
      addToast('Order successfully placed!', 'success');
    } catch (err) {
      console.error(err);
      addToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setIsCheckingOut(false);
    setOrderComplete(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={handleClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Your Cart</h2>
                {cartShop && (
                  <p className="text-xs text-slate-500">
                    Store: <span className="font-semibold text-emerald-700">{cartShop.name}</span>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-5">
            {orderComplete ? (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Order Confirmed!</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Thank you for shopping at <span className="font-semibold text-slate-900">{cartShop?.name || 'our store'}</span>.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left mb-6">
                  <div className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Order Number</div>
                  <div className="text-lg font-mono font-bold text-emerald-600">{orderComplete.order_number}</div>
                  <div className="mt-2 text-sm text-slate-600">
                    Total Amount: <span className="font-bold text-slate-900">${Number(orderComplete.total_amount).toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : isCheckingOut ? (
              <div>
                <button
                  type="button"
                  onClick={() => setIsCheckingOut(false)}
                  className="text-xs font-semibold text-emerald-700 hover:underline mb-4 flex items-center space-x-1"
                >
                  <span>← Back to cart summary</span>
                </button>

                <h3 className="text-base font-bold text-slate-900 mb-4">Customer Details & Delivery</h3>
                <form onSubmit={handleCheckoutSubmit} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_name}
                      onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. David Miller"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.customer_phone}
                      onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. +1 (555) 019-2834"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={formData.customer_email}
                      onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. david@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Shipping Address <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={formData.shipping_address}
                      onChange={(e) => setFormData({ ...formData, shipping_address: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Delivery street, apt, city, postal code"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Order Notes (Optional)</label>
                    <input
                      type="text"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. Leave with building doorman"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex justify-between text-sm font-bold text-slate-900 mb-4">
                      <span>Total Amount:</span>
                      <span className="text-emerald-700">${subtotal.toFixed(2)}</span>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
                    >
                      {submitting ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Place Order Now</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingBag className="w-12 h-12 mx-auto mb-3 stroke-1" />
                <p className="text-sm font-medium text-slate-600">Your cart is empty</p>
                <p className="text-xs text-slate-400 mt-1">Explore our shops and add products to start shopping.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={item.shop_product_id}
                    className="flex space-x-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-slate-200 transition-colors"
                  >
                    <img
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                      alt={item.name}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-100 flex-shrink-0"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200';
                      }}
                    />
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">{item.name}</h4>
                        <button
                          onClick={() => removeFromCart(item.shop_product_id)}
                          className="text-slate-400 hover:text-rose-500 p-0.5 ml-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm font-bold text-emerald-700">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>

                        <div className="flex items-center space-x-2 border border-slate-200 rounded-lg px-2 py-0.5 text-xs">
                          <button
                            onClick={() => updateQuantity(item.shop_product_id, item.quantity - 1)}
                            className="font-bold text-slate-500 hover:text-slate-900"
                          >
                            -
                          </button>
                          <span className="font-semibold text-slate-700 min-w-[12px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.shop_product_id, item.quantity + 1)}
                            className="font-bold text-slate-500 hover:text-slate-900"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer actions */}
          {!isCheckingOut && !orderComplete && items.length > 0 && (
            <div className="p-5 border-t border-slate-100 bg-slate-50/70">
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-slate-500">Subtotal ({totalCount} items):</span>
                <span className="text-base font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-xl transition-colors shadow-sm flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={clearCart}
                className="w-full mt-2 text-xs text-slate-400 hover:text-rose-500 transition-colors py-1 text-center"
              >
                Empty Cart
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
