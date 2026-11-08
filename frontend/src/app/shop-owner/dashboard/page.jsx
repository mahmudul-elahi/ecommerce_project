'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Store,
  Package,
  Layers,
  ShoppingBag,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Settings,
  Clock,
  Sparkles,
  TrendingUp,
  Tag,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import api from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';

export default function ShopOwnerDashboardPage() {
  const { user } = useAuth();

  const {
    data: dashboardData,
    isLoading: loadingDashboard,
  } = useQuery({
    queryKey: ['shop-owner-dashboard'],
    queryFn: async () => {
      const res = await api.get('/shop-owner/dashboard');
      return res.data;
    },
  });

  const {
    data: shopData,
    isLoading: loadingShop,
  } = useQuery({
    queryKey: ['shop-owner-my-shop'],
    queryFn: async () => {
      const res = await api.get('/shop-owner/my-shop');
      return res.data?.shop || null;
    },
  });

  const loading = loadingDashboard || loadingShop;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const shop = shopData;
  const stats = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recent_orders || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Light-Mode Editorial Merchant Profile Banner */}
      {shop && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 border border-stone-200 shadow-sm relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-5">
              <img
                src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150'}
                alt={shop.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-stone-200 bg-stone-50 shadow-xs flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150';
                }}
              />
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200 mb-2">
                  <Store className="w-3 h-3 text-stone-600" />
                  <span className="font-mono uppercase tracking-wider">Merchant Portal</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
                  {shop.name}
                </h1>
                <p className="text-xs text-stone-500 mt-1 max-w-xl line-clamp-1">
                  {shop.description || 'Manage your custom prices, listing thumbnails, and browse the shared catalog.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`/shop/${shop.slug}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-50 text-xs font-semibold transition-colors shadow-xs flex items-center space-x-2"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/shop-owner/settings"
                className="p-2.5 rounded-xl bg-white hover:bg-stone-50 text-stone-700 transition-colors border border-stone-200 shadow-xs"
                title="Store Settings"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {/* Active Listings in This Shop */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Active Listings
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1.5">
              {stats.active_listings || 0}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              In your storefront
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center">
            <Package className="w-5 h-5 text-stone-700" />
          </div>
        </div>

        {/* Global Catalog Items Available */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Shared Catalog
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1.5">
              {stats.total_catalog_products || 0}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Available to add
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center">
            <Layers className="w-5 h-5 text-stone-700" />
          </div>
        </div>

        {/* Customer Orders */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Total Orders
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1.5">
              {stats.total_orders || 0}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Store orders placed
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-amber-700" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Total Revenue
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1.5">
              ${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Gross sales
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-stone-700" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shared Catalog Onboarding & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
            <div className="flex items-center space-x-2 text-stone-900 font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Catalog Architecture Guide</span>
            </div>
            <p className="text-xs text-stone-600 leading-relaxed">
              In OmniShop, products originate in a universal shared catalog. You can curate any shared product into your shop, customize retail pricing, and upload shop-specific photos.
            </p>

            <div className="mt-5 space-y-2.5">
              <Link
                href="/shop-owner/catalog"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Layers className="w-4 h-4 text-stone-700" />
                  <span>Browse Shared Catalog</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <Link
                href="/shop-owner/products"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <Tag className="w-4 h-4 text-stone-700" />
                  <span>Adjust Custom Prices & Details</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <Link
                href="/shop-owner/orders"
                className="w-full flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-800 transition-colors"
              >
                <div className="flex items-center space-x-2.5">
                  <ShoppingBag className="w-4 h-4 text-stone-700" />
                  <span>Manage Customer Orders</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Store Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Recent Customer Orders</h3>
                <p className="text-xs text-stone-500">Orders placed directly through your storefront</p>
              </div>
              <Link
                href="/shop-owner/orders"
                className="text-xs font-semibold text-stone-900 hover:text-stone-700 flex items-center space-x-1"
              >
                <span>View All Orders</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="text-center py-14 px-4">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2.5" />
                <h4 className="text-xs font-semibold text-stone-800">No orders placed yet</h4>
                <p className="text-[11px] text-stone-400 mt-1 max-w-sm mx-auto">
                  When customers visit your storefront and check out, orders will immediately populate here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-stone-100">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-4 sm:p-5 flex items-center justify-between hover:bg-stone-50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold text-xs text-stone-900">
                          #{order.order_number}
                        </span>
                        <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded border ${
                          order.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : order.status === 'processing'
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : 'bg-stone-100 text-stone-700 border-stone-200'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600">
                        {order.customer_name} · {order.customer_phone}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-bold text-stone-900 text-sm">
                        ${Number(order.total_amount).toFixed(2)}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {order.items_count || order.items?.length || 1} items
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
