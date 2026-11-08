'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  CreditCard,
  Building2,
  PackageCheck,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useCheckoutMutation } from '../../hooks/useShops';

const checkoutSchema = z.object({
  customer_name: z.string().min(2, 'Your name is required'),
  customer_phone: z.string().min(5, 'Valid contact phone number is required'),
  customer_email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  shipping_address: z.string().min(5, 'Complete delivery address is required'),
  notes: z.string().optional(),
});

export default function CartDrawer() {
  const {
    cartShop,
    items,
    totalCount,
    subtotal,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderComplete, setOrderComplete] = useState(null);

  const checkoutMutation = useCheckoutMutation({
    onSuccess: (data) => {
      setOrderComplete(data.order);
      clearCart();
      reset();
      setIsCheckingOut(false);
      toast.success('Order Placed Successfully!', {
        description: `Order #${data.order.order_number} confirmed with ${cartShop?.name}.`,
      });
    },
    onError: (err) => {
      console.error(err);
      toast.error('Checkout Failed', {
        description: err.response?.data?.message || 'Unable to place order. Please review your details.',
      });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      shipping_address: '',
      notes: '',
    },
  });

  if (!isCartOpen) return null;

  const onCheckoutSubmit = (data) => {
    if (!cartShop) {
      toast.error('Cart Error', { description: 'No active shop associated with this cart.' });
      return;
    }

    const payload = {
      shop_id: cartShop.id,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || null,
      shipping_address: data.shipping_address,
      notes: data.notes || null,
      items: items.map((i) => ({
        shop_product_id: i.shop_product_id,
        quantity: i.quantity,
      })),
    };

    checkoutMutation.mutate(payload);
  };

  const handleClose = () => {
    setIsCartOpen(false);
    setIsCheckingOut(false);
    setOrderComplete(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] transition-opacity"
        onClick={handleClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-elevated flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-slate-800 flex items-center justify-center shadow-subtle">
                <ShoppingBag className="w-4 h-4 text-blue-700" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900">Your Shopping Cart</h2>
                {cartShop ? (
                  <p className="text-[11px] text-slate-500">
                    Store: <span className="font-semibold text-blue-700">{cartShop.name}</span>
                  </p>
                ) : (
                  <p className="text-[11px] text-slate-400">Empty cart</p>
                )}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5">
            {orderComplete ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 bg-blue-50 border border-blue-100 text-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Order Confirmed!</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                  Thank you! Your order has been dispatched directly to the merchant for processing.
                </p>

                <div className="mt-6 bg-slate-50 rounded-xl p-4 border border-slate-200 text-left space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Order Number:</span>
                    <span className="font-mono font-bold text-slate-900">{orderComplete.order_number}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Total Amount:</span>
                    <span className="font-mono font-bold text-blue-700">
                      ${Number(orderComplete.total_amount).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Recipient:</span>
                    <span className="font-semibold text-slate-800">{orderComplete.customer_name}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500">Delivery Address:</span>
                    <span className="text-slate-700 text-right max-w-[180px] truncate">{orderComplete.shipping_address}</span>
                  </div>
                </div>

                <button
                  onClick={handleClose}
                  className="mt-6 w-full py-2.5 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Continue Shopping
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto text-slate-400 mb-3">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-slate-800">Your cart is empty</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                  Browse a store's collection and add products to start an order.
                </p>
              </div>
            ) : isCheckingOut ? (
              /* Checkout Form via react-hook-form + zod */
              <form onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <CreditCard className="w-3.5 h-3.5 text-slate-600" />
                    <span>Customer Details</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="text-xs text-slate-500 hover:text-slate-900 underline"
                  >
                    Back to Items
                  </button>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('customer_name')}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border ${
                      errors.customer_name ? 'border-rose-400' : 'border-slate-200'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900`}
                    placeholder="e.g. John Doe"
                  />
                  {errors.customer_name && (
                    <span className="text-[11px] text-rose-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.customer_name.message}</span>
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    {...register('customer_phone')}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border ${
                      errors.customer_phone ? 'border-rose-400' : 'border-slate-200'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900`}
                    placeholder="+1 (555) 000-0000"
                  />
                  {errors.customer_phone && (
                    <span className="text-[11px] text-rose-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.customer_phone.message}</span>
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="email"
                    {...register('customer_email')}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border ${
                      errors.customer_email ? 'border-rose-400' : 'border-slate-200'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900`}
                    placeholder="john@example.com"
                  />
                  {errors.customer_email && (
                    <span className="text-[11px] text-rose-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.customer_email.message}</span>
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shipping Address <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    {...register('shipping_address')}
                    className={`w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border ${
                      errors.shipping_address ? 'border-rose-400' : 'border-slate-200'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900`}
                    placeholder="Street, suite, city, state, zip"
                  />
                  {errors.shipping_address && (
                    <span className="text-[11px] text-rose-600 flex items-center space-x-1 mt-1">
                      <AlertCircle className="w-3 h-3" />
                      <span>{errors.shipping_address.message}</span>
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Order Notes <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    {...register('notes')}
                    className="w-full px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white text-slate-900"
                    placeholder="Special delivery instructions..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={checkoutMutation.isPending || isSubmitting}
                    className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
                  >
                    {checkoutMutation.isPending || isSubmitting ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Confirm & Place Order (${subtotal.toFixed(2)})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            ) : (
              /* Items List */
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.shop_product_id}
                    className="p-3 bg-slate-50/70 border border-slate-200 rounded-xl flex items-center space-x-3"
                  >
                    <img
                      src={item.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200'}
                      alt={item.name}
                      className="w-14 h-14 object-cover rounded-lg bg-white border border-slate-200 flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                      <div className="text-sm font-semibold text-blue-700 mt-0.5">
                        ${item.price.toFixed(2)}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.shop_product_id, item.quantity - 1)}
                          className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-sm font-semibold text-slate-800 w-5 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.shop_product_id, item.quantity + 1)}
                          className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-col items-end justify-between h-14">
                      <button
                        onClick={() => removeFromCart(item.shop_product_id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="text-sm font-semibold text-slate-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Subtotal & Action */}
          {!orderComplete && items.length > 0 && !isCheckingOut && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/70 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Items ({totalCount})</span>
                <span className="text-slate-700">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Estimated Delivery</span>
                <span className="font-mono text-emerald-700 font-semibold">Free</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">Total</span>
                <span className="text-lg font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
