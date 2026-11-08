import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Package,
  Layers,
  ShoppingBag,
  DollarSign,
  Plus,
  ArrowRight,
  ExternalLink,
  Settings,
  Clock,
  Sparkles,
} from 'lucide-react';
import api from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function ShopDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const [statsRes, shopRes] = await Promise.all([
          api.get('/shop-owner/dashboard'),
          api.get('/shop-owner/my-shop'),
        ]);
        setData(statsRes.data);
        setShop(shopRes.data.shop);
      } catch (err) {
        console.error('Failed to load shop dashboard', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentOrders = data?.recent_orders || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Shop Profile Banner Card */}
      {shop && (
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-slate-700/50">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-4">
              <img
                src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150'}
                alt={shop.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/20 bg-white shadow-lg flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150';
                }}
              />
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold backdrop-blur-md mb-1.5 border border-emerald-500/30">
                  <Store className="w-3 h-3" />
                  <span>Shop Owner Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{shop.name}</h1>
                <p className="text-xs text-slate-300 mt-1 max-w-xl line-clamp-1">
                  {shop.description || 'Manage your custom prices, listing thumbnails, and browse the shared catalog.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Link
                to={`/shop/${shop.slug}`}
                target="_blank"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-colors border border-white/10 flex items-center space-x-1.5"
              >
                <span>View Customer Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/shop-owner/settings"
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
                title="Store Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Products in My Shop */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">My Shop Listings</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.my_products_count || 0}</div>
            <Link to="/shop-owner/products" className="text-[11px] text-emerald-600 font-semibold hover:underline mt-1 block">
              Manage custom prices →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
        </div>

        {/* Available Shared Catalog Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shared Catalog</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total_catalog_count || 0}</div>
            <Link to="/shop-owner/catalog" className="text-[11px] text-sky-600 font-semibold hover:underline mt-1 block">
              Browse & add products →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Customer Orders */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Store Orders</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total_orders || 0}</div>
            <Link to="/shop-owner/orders" className="text-[11px] text-purple-600 font-semibold hover:underline mt-1 block">
              View customer orders →
            </Link>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Total Shop Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Revenue</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              ${Number(stats.total_revenue || 0).toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">From completed orders</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-md shadow-emerald-600/20">
              <Layers className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Explore Shared Catalog</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Browse products uploaded by admins and other shop owners. Select any item to list it in your store with your own custom price and thumbnail!
            </p>
          </div>
          <Link
            to="/shop-owner/catalog"
            className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
          >
            <span>Browse Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-gradient-to-br from-sky-50 to-indigo-50 border border-sky-200/80 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center mb-3 shadow-md shadow-sky-600/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Create & Share New Products</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Upload your own products! They will immediately be added to your shop and also become available in the shared catalog for other shop owners to discover.
            </p>
          </div>
          <Link
            to="/shop-owner/catalog"
            className="mt-4 inline-flex items-center space-x-1.5 text-xs font-bold text-sky-700 hover:text-sky-800"
          >
            <span>Create a Product Now</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
            <span>Recent Customer Orders</span>
          </h3>
          <Link to="/shop-owner/orders" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center space-x-1">
            <span>View all orders</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {recentOrders.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No orders placed for this store yet. When customers buy from your store, their orders will appear here.
            </div>
          ) : (
            recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-slate-900 text-xs">{order.order_number}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        order.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : order.status === 'processing'
                          ? 'bg-sky-50 text-sky-700 border border-sky-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Customer: {order.customer_name} • {order.customer_phone}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-extrabold text-slate-900">${Number(order.total_amount).toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1 justify-end">
                    <Clock className="w-3 h-3" />
                    <span>{new Date(order.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
