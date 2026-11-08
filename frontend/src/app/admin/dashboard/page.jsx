'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Store,
  Layers,
  Users,
  ShoppingBag,
  DollarSign,
  Plus,
  ArrowRight,
} from 'lucide-react';
import api from '../../../api/client';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
              Admin Control Center
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">Platform Administration</h1>
          <p className="text-xs text-slate-500">
            Oversee all registered shops, manage the shared product catalog, and supervise shop owners.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center space-x-2">
          <Link
            href="/admin/shops"
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>New Shop</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Catalog Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {/* Total Shops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Stores</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.active_shops || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Total created: {stats.total_shops || 0}</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>

        {/* Shared Catalog Products */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Catalog Products</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total_products || 0}</div>
            <div className="text-[11px] text-emerald-600 font-medium mt-1">Shared globally</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Shop Owners */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Shop Owners</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{stats.total_shop_owners || 0}</div>
            <div className="text-[11px] text-slate-500 mt-1">Managed accounts</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Platform Orders & Sales */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">
              ${Number(stats.total_revenue || 0).toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">{stats.total_orders || 0} total orders</div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two-Column Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Stores */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Registered Stores</span>
            </h3>
            <Link href="/admin/shops" className="text-xs font-semibold text-emerald-600 hover:underline flex items-center space-x-1">
              <span>View all</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.recent_shops?.length === 0 ? (
              <p className="p-6 text-xs text-slate-400 text-center">No shops created yet.</p>
            ) : (
              data?.recent_shops?.map((shop) => (
                <div key={shop.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=100'}
                      alt={shop.name}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{shop.name}</div>
                      <div className="text-[11px] text-slate-400">
                        Owner: {shop.owner ? shop.owner.name : 'Unassigned'}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      shop.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {shop.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Shared Catalog Products */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-sky-600" />
              <span>Catalog Products</span>
            </h3>
            <Link href="/admin/products" className="text-xs font-semibold text-sky-600 hover:underline flex items-center space-x-1">
              <span>Manage catalog</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.recent_products?.length === 0 ? (
              <p className="p-6 text-xs text-slate-400 text-center">No catalog products found.</p>
            ) : (
              data?.recent_products?.map((prod) => (
                <div key={prod.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <img
                      src={prod.thumbnail_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
                      alt={prod.name}
                      className="w-10 h-10 rounded-xl object-cover bg-slate-100 border border-slate-200 flex-shrink-0"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900 line-clamp-1">{prod.name}</div>
                      <div className="text-[11px] text-slate-400 flex items-center space-x-1.5">
                        <span>Base: ${Number(prod.base_price).toFixed(2)}</span>
                        <span>•</span>
                        <span className="text-emerald-700 font-medium">
                          Created by: {prod.creator?.name || 'System'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-semibold text-slate-500">{prod.sku || 'No SKU'}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
