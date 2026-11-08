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
import { useShopOwnerDashboardQuery, useMyShopQuery } from '../../../hooks/useShopOwner';
import { useAuth } from '../../../context/AuthContext';

export default function ShopOwnerDashboardPage() {
  const { user } = useAuth();

  const {
    data: dashboardData,
    isLoading: loadingDashboard,
  } = useShopOwnerDashboardQuery();

  const {
    data: shopData,
    isLoading: loadingShop,
  } = useMyShopQuery();

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
      {/* Shop overview */}
      {shop && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 mb-8 border border-neutral-200/90 shadow-2xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-center space-x-5">
              <img
                src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150'}
                alt={shop.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-white bg-neutral-50 shadow-md flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=150';
                }}
              />
              <div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100 mb-2 shadow-2xs">
                  <Store className="w-3.5 h-3.5 text-blue-700" />
                  <span className="font-mono uppercase tracking-wider">Merchant Portal</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-black tracking-tight font-sans">
                  {shop.name}
                </h1>
                <p className="text-xs text-neutral-500 mt-1 max-w-xl line-clamp-1">
                  {shop.description || 'Manage your custom prices, listing thumbnails, and browse the shared catalog.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <Link
                href={`/shop/${shop.slug}`}
                target="_blank"
                className="px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all shadow-2xs active:scale-95 flex items-center space-x-2"
              >
                <span>View Public Storefront</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/shop-owner/settings"
                className="p-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-700 transition-colors border border-neutral-300 shadow-2xs"
                title="Store Settings"
                aria-label="Store Settings"
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
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Active Listings
            </span>
            <div className="text-3xl font-extrabold text-black mt-1 font-mono tracking-tight">
              {stats.active_listings || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Live in your storefront
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-black border border-neutral-200 flex items-center justify-center shadow-2xs">
            <Package className="w-5 h-5 text-black" />
          </div>
        </div>

        {/* Global Catalog Items Available */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Shared Catalog
            </span>
            <div className="text-3xl font-extrabold text-black mt-1 font-mono tracking-tight">
              {stats.total_catalog_products || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Available to add
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-black border border-neutral-200 flex items-center justify-center shadow-2xs">
            <Layers className="w-5 h-5 text-black" />
          </div>
        </div>

        {/* Customer Orders */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Total Orders
            </span>
            <div className="text-3xl font-extrabold text-black mt-1 font-mono tracking-tight">
              {stats.total_orders || 0}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Store orders placed
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shadow-2xs">
            <ShoppingBag className="w-5 h-5 text-blue-700" />
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200/90 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 font-bold">
              Total Revenue
            </span>
            <div className="text-3xl font-extrabold text-black mt-1 font-mono tracking-tight">
              ${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-neutral-500 mt-1">
              Gross storefront sales
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-neutral-100 text-black border border-neutral-200 flex items-center justify-center shadow-2xs">
            <DollarSign className="w-5 h-5 text-black" />
          </div>
        </div>
      </div>

      {/* Two Column Section: Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Shared Catalog Onboarding & Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200/90 shadow-2xs">
            <div className="flex items-center space-x-2 text-black font-bold text-sm mb-3">
              <Sparkles className="w-4 h-4 text-blue-700" />
              <span>How products get to your shop</span>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Choose products from the catalog, then set your own prices, names and photos before they appear in your shop.
            </p>

            <div className="mt-5 space-y-2.5">
              <Link
                href="/shop-owner/catalog"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100/90 border border-neutral-200 text-xs font-semibold text-neutral-800 transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-black shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Layers className="w-3.5 h-3.5" />
                  </div>
                  <span>Browse Shared Catalog</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/shop-owner/products"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100/90 border border-neutral-200 text-xs font-semibold text-neutral-800 transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-black shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <span>Adjust Custom Prices & Details</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              <Link
                href="/shop-owner/orders"
                className="w-full flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100/90 border border-neutral-200 text-xs font-semibold text-neutral-800 transition-all group"
              >
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-black shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </div>
                  <span>Manage Customer Orders</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Recent Store Orders */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-2xs overflow-hidden">
            <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-black">Recent Customer Orders</h3>
                <p className="text-xs text-neutral-500">Orders placed directly through your storefront</p>
              </div>
              <Link
                href="/shop-owner/orders"
                className="px-4 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200/80 text-black text-xs font-semibold transition-colors flex items-center space-x-1"
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
                            ? 'bg-blue-50 text-blue-700 border-blue-100'
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
