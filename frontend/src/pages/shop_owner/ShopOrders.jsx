import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Clock, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import api from '../../api/client';
import { useToast } from '../../context/ToastContext';

export default function ShopOrders() {
  const { addToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.get('/shop-owner/orders', { params: { per_page: 50 } });
      setOrders(res.data.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load store orders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(`/shop-owner/orders/${orderId}/status`, { status: newStatus });
      addToast(`Order marked as ${newStatus}`, 'success');
      fetchOrders();
    } catch (err) {
      console.error(err);
      addToast('Failed to update status', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center space-x-2">
          <ShoppingBag className="w-6 h-6 text-purple-600" />
          <span>Customer Orders</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review customer purchases and update order fulfillment statuses.
        </p>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <span>Loading orders...</span>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-slate-400">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No customer orders yet</h3>
            <p className="text-xs text-slate-400 mt-1">
              When customers check out from your storefront, their orders will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-slate-50/40 transition-colors">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-slate-900">{order.order_number}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500 flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{new Date(order.created_at).toLocaleString()}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Customer: <span className="font-semibold text-slate-900">{order.customer_name}</span> (
                      {order.customer_phone}
                      {order.customer_email && ` • ${order.customer_email}`})
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      Shipping to: <span className="font-medium text-slate-700">{order.shipping_address}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Total Amount:</span>
                      <span className="text-base font-extrabold text-emerald-700">
                        ${Number(order.total_amount).toFixed(2)}
                      </span>
                    </div>

                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer ${
                        order.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : order.status === 'processing'
                          ? 'bg-sky-50 text-sky-800 border-sky-200'
                          : order.status === 'cancelled'
                          ? 'bg-rose-50 text-rose-800 border-rose-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-200/70 text-xs">
                  <div className="font-semibold text-slate-700 mb-2">Order Items:</div>
                  <div className="space-y-1.5">
                    {order.items?.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-slate-600">
                        <span>
                          <span className="font-bold text-slate-900">{item.quantity}x</span> {item.product_name}
                        </span>
                        <span className="font-mono font-semibold text-slate-800">
                          ${Number(item.subtotal).toFixed(2)} (${Number(item.product_price).toFixed(2)} ea)
                        </span>
                      </div>
                    ))}
                  </div>
                  {order.notes && (
                    <div className="mt-2 pt-2 border-t border-slate-200 text-slate-500 italic">
                      Note from customer: "{order.notes}"
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
