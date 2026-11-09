'use client';

import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  ShoppingBag,
  Clock,
  Package,
  MapPin,
  Phone,
  Mail,
  CheckCircle2,
  AlertCircle,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useShopOrdersQuery, useUpdateOrderStatusMutation } from '../../../hooks/useShopOwner';

export default function ShopOrdersPage() {
  const {
    data: orders = [],
    isLoading,
    isError,
  } = useShopOrdersQuery();

  const updateStatusMutation = useUpdateOrderStatusMutation({
    onSuccess: (_, variables) => {
      toast.success('Order Status Updated', {
        description: `Order #${variables.orderId} is now marked as "${variables.status}".`,
      });
    },
    onError: (err) => {
      toast.error('Failed to update order status', {
        description: err.response?.data?.message || 'Could not update status.',
      });
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateStatusMutation.mutate({ orderId, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* BankDash Orders List Container */}
      <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-16 text-center text-slate-400">
            <div className="w-7 h-7 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <span className="text-xs font-mono">Loading orders...</span>
          </div>
        ) : isError ? (
          <div className="p-16 text-center text-rose-600">
            <AlertCircle className="w-8 h-8 mx-auto mb-2" />
            <h3 className="text-sm font-semibold">Unable to fetch customer orders</h3>
            <p className="text-xs text-slate-400 mt-1">Please refresh the page to retry.</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-800">No customer orders yet</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              When shoppers browse your storefront and complete checkout, customer records and items will be displayed here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2.5">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        #{order.order_number}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500 flex items-center space-x-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{order.created_at ? order.created_at.slice(0, 16).replace('T', ' ') : 'Recent'}</span>
                      </span>
                    </div>

                    <div className="text-xs text-slate-700">
                      Customer: <span className="font-semibold text-slate-900">{order.customer_name}</span> (
                      {order.customer_phone}
                      {order.customer_email && ` • ${order.customer_email}`})
                    </div>

                    <div className="text-xs text-slate-500 flex items-center space-x-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{order.shipping_address}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <span className="text-[10px] uppercase font-mono text-slate-400 block">
                        Order Total
                      </span>
                      <span className="text-base font-bold text-slate-900">
                        ${Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>

                    {/* Status Select Control */}
                    <div>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        disabled={updateStatusMutation.isPending}
                        className={`text-xs font-mono uppercase px-3 py-1.5 rounded-xl border-0 outline-none cursor-pointer transition-all ${
                          order.status === 'completed'
                            ? 'bg-[#FAF3EA] text-[#B88E2F]'
                            : order.status === 'processing'
                            ? 'bg-amber-50 text-amber-800'
                            : order.status === 'cancelled'
                            ? 'bg-rose-50 text-rose-800'
                            : 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Purchased items table */}
                <div className="bg-slate-50/70 rounded-xl border border-slate-200 p-3 mt-3">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Ordered Line Items
                  </div>
                  <div className="space-y-2">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          <Package className="w-3.5 h-3.5 text-slate-400" />
                          <span className="font-medium text-slate-800">
                            {item.product_name}
                          </span>
                          <span className="text-slate-400 font-mono">
                            × {item.quantity}
                          </span>
                        </div>
                        <div className="font-mono text-slate-700">
                          ${Number(item.price).toFixed(2)} each ={' '}
                          <span className="font-bold text-slate-900">
                            ${(Number(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {order.notes && (
                    <div className="mt-3 pt-2 border-t border-slate-200 text-xs text-slate-500">
                      <span className="font-semibold text-slate-700">Customer Note:</span> {order.notes}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
