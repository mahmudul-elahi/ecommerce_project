'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  Package,
  Layers,
  ShoppingBag,
  DollarSign,
  ArrowRight,
  ExternalLink,
  Settings,
  CreditCard,
  TrendingUp,
  Tag,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const shop = shopData;
  const stats = dashboardData?.stats || {};
  const recentOrders = dashboardData?.recent_orders || [];

  return (
    <div className="space-y-7 pb-10">
      {/* 1. BankDash Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: My Products Listed */}
        <div className="bg-white rounded-[25px] p-6 flex items-center gap-5 border-0 shadow-sm transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#FFF5D9] flex items-center justify-center flex-shrink-0 text-[#FFBB38]">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              My Active Listings
            </span>
            <div className="text-2xl lg:text-[28px] font-bold text-[#343C6A] mt-1 font-inter">
              {stats.my_products_count ?? 0}
            </div>
            <div className="text-xs text-[#16DBAA] font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Visible in storefront</span>
            </div>
          </div>
        </div>

        {/* Card 2: Shared Catalog Items */}
        <div className="bg-white rounded-[25px] p-6 flex items-center gap-5 border-0 shadow-sm transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#E7EDFF] flex items-center justify-center flex-shrink-0 text-[#396AFF]">
            <Layers className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Shared Catalog
            </span>
            <div className="text-2xl lg:text-[28px] font-bold text-[#343C6A] mt-1 font-inter">
              {stats.total_catalog_count ?? 0}
            </div>
            <div className="text-xs text-[#718EBF] mt-0.5">
              Ready to add to store
            </div>
          </div>
        </div>

        {/* Card 3: Orders Count */}
        <div className="bg-white rounded-[25px] p-6 flex items-center gap-5 border-0 shadow-sm transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#FFE0EB] flex items-center justify-center flex-shrink-0 text-[#FF82AC]">
            <CreditCard className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Customer Orders
            </span>
            <div className="text-2xl lg:text-[28px] font-bold text-[#343C6A] mt-1 font-inter">
              {stats.total_orders ?? 0}
            </div>
            <div className="text-xs text-[#16DBAA] font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Paid & processed</span>
            </div>
          </div>
        </div>

        {/* Card 4: Store Revenue */}
        <div className="bg-white rounded-[25px] p-6 flex items-center gap-5 border-0 shadow-sm transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#DCFAF8] flex items-center justify-center flex-shrink-0 text-[#16DBCC]">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Total Revenue
            </span>
            <div className="text-2xl lg:text-[28px] font-bold text-[#343C6A] mt-1 font-inter">
              ${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-[#718EBF] mt-0.5">
              Settled gross earnings
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: BankDash My Cards & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: BankDash Credit Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
              Merchant Balance & Payout
            </h2>
            <Link
              href="/shop-owner/settings"
              className="text-sm font-semibold text-[#B88E2F] hover:underline"
            >
              Payout Settings
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Furniro Luxury Gold Gradient Card */}
            <div className="rounded-[25px] p-6 text-white bg-gradient-to-tr from-[#694F12] via-[#B88E2F] to-[#D4AF37] shadow-lg shadow-amber-900/15 flex flex-col justify-between min-h-[220px]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-white/75 font-medium">Available Balance</span>
                  <div className="text-2xl font-bold font-inter mt-1">
                    ${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="w-9 h-7 rounded-md bg-white/20 border border-white/30 flex items-center justify-center">
                  <div className="w-4 h-3 border border-white/60 rounded-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-3 text-xs text-white/85">
                <div>
                  <span className="block text-[10px] text-white/70 uppercase">Store Name</span>
                  <span className="font-semibold text-sm truncate block">{shop?.name || 'My Store'}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-white/70 uppercase">Valid Thru</span>
                  <span className="font-semibold text-sm">11/29</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/20 flex items-center justify-between text-sm tracking-widest font-mono">
                <span>5412 **** **** 8820</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-white/40" />
                  <div className="w-6 h-6 rounded-full bg-white/25" />
                </div>
              </div>
            </div>

            {/* White BankDash Card */}
            <div className="rounded-[25px] p-6 bg-white border border-[#DFEAF2] flex flex-col justify-between min-h-[220px]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-[#718EBF] font-medium">Next Payout Cycle</span>
                  <div className="text-2xl font-bold text-[#343C6A] font-inter mt-1">
                    ${(Number(stats.total_revenue || 0) * 0.95).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="w-9 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <div className="w-4 h-3 border border-slate-400 rounded-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-3 text-xs">
                <div>
                  <span className="block text-[10px] text-[#718EBF] uppercase">Payout Schedule</span>
                  <span className="font-semibold text-sm text-[#343C6A]">Weekly (Monday)</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#718EBF] uppercase">Method</span>
                  <span className="font-semibold text-sm text-[#343C6A]">Bank Wire</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F2F4F7] flex items-center justify-between text-sm tracking-widest font-mono text-[#343C6A]">
                <span>Routing: *****492</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#B88E2F]/30" />
                  <div className="w-6 h-6 rounded-full bg-[#B88E2F]/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
              Recent Transaction
            </h2>
            <Link
              href="/shop-owner/orders"
              className="text-xs font-semibold text-[#B88E2F] hover:underline"
            >
              See All
            </Link>
          </div>

          <div className="bg-white rounded-[25px] p-6 space-y-5 border-0 shadow-sm min-h-[220px]">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-[#718EBF] text-sm">
                No orders received yet
              </div>
            ) : (
              recentOrders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#FFF5D9] text-[#FFBB38] flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#232323] truncate max-w-[130px]">
                        Order #{ord.order_number || ord.id}
                      </div>
                      <div className="text-xs text-[#718EBF]">
                        {ord.created_at ? ord.created_at.slice(0, 10) : 'Recent'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#41D4A8]">
                      +${Number(ord.total_amount).toFixed(2)}
                    </div>
                    <div className="text-[11px] text-[#718EBF] capitalize">
                      {ord.status}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 3. BankDash Weekly Activity & Quick Catalog Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Dual Bar Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
              Weekly Activity
            </h2>
            <div className="flex items-center gap-6 text-xs text-[#718EBF]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#B88E2F]" />
                <span>Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#E2C889]" />
                <span>Sales ($)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[25px] p-7 border-0 shadow-sm">
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4">
              {[
                { day: 'Sat', ord: 50, vol: 70 },
                { day: 'Sun', ord: 40, vol: 55 },
                { day: 'Mon', ord: 80, vol: 95 },
                { day: 'Tue', ord: 90, vol: 85 },
                { day: 'Wed', ord: 60, vol: 75 },
                { day: 'Thu', ord: 75, vol: 80 },
                { day: 'Fri', ord: 85, vol: 90 },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-3 flex-1">
                  <div className="flex items-end gap-2 h-44">
                    <div
                      style={{ height: `${item.ord}%` }}
                      className="w-3.5 rounded-full bg-[#B88E2F] transition-all hover:opacity-80"
                      title={`Orders: ${item.ord}%`}
                    />
                    <div
                      style={{ height: `${item.vol}%` }}
                      className="w-3.5 rounded-full bg-[#E2C889] transition-all hover:opacity-80"
                      title={`Sales: ${item.vol}%`}
                    />
                  </div>
                  <span className="text-xs text-[#718EBF] font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions Card */}
        <div className="space-y-4">
          <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
            Quick Actions
          </h2>
          <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm flex flex-col justify-between space-y-4 h-[300px]">
            <div className="space-y-3">
              <Link
                href="/shop-owner/catalog"
                className="p-4 rounded-2xl bg-[#F5F7FA] hover:bg-[#FAF3EA] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FAF3EA] group-hover:bg-white text-[#B88E2F] flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#343C6A]">Browse Shared Catalog</div>
                    <div className="text-xs text-[#718EBF]">Add products with custom price</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#B88E2F]" />
              </Link>

              <Link
                href="/shop-owner/products"
                className="p-4 rounded-2xl bg-[#F5F7FA] hover:bg-[#FFF5D9] transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#FFF5D9] group-hover:bg-white text-[#FFBB38] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#343C6A]">Manage My Listings</div>
                    <div className="text-xs text-[#718EBF]">Adjust prices, details & thumbnails</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#FFBB38]" />
              </Link>

              {shop?.slug && (
                <Link
                  href={`/shop/${shop.slug}`}
                  target="_blank"
                  className="p-4 rounded-2xl bg-[#F5F7FA] hover:bg-[#DCFAF8] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#DCFAF8] group-hover:bg-white text-[#16DBCC] flex items-center justify-center">
                      <ExternalLink className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#343C6A]">Open Live Storefront</div>
                      <div className="text-xs text-[#718EBF]">See customer view of your shop</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#16DBCC]" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
