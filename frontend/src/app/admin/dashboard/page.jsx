'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  Layers,
  Users,
  DollarSign,
  Plus,
  ArrowRight,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  Package,
} from 'lucide-react';
import { useAdminDashboardQuery } from '../../../hooks/useAdmin';

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#2D60FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentShops = data?.recent_shops || [];
  const recentProducts = data?.recent_products || [];
  const recentOrders = data?.recent_orders || [];

  return (
    <div className="space-y-7 pb-10">
      {/* 1. BankDash Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Active Stores */}
        <div className="bg-white rounded-[25px] p-6 flex items-center gap-5 border-0 shadow-sm transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#FFF5D9] flex items-center justify-center flex-shrink-0 text-[#FFBB38]">
            <Store className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Active Stores
            </span>
            <div className="text-2xl lg:text-[28px] font-bold text-[#343C6A] mt-1 font-inter">
              {stats.active_shops ?? 0}
            </div>
            <div className="text-xs text-[#16DBAA] font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>100% Operational</span>
            </div>
          </div>
        </div>

        {/* Card 2: Shared Catalog Products */}
        <div className="bg-white rounded-[25px] p-6 flex items-center gap-5 border-0 shadow-sm transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#E7EDFF] flex items-center justify-center flex-shrink-0 text-[#396AFF]">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Catalog Items
            </span>
            <div className="text-2xl lg:text-[28px] font-bold text-[#343C6A] mt-1 font-inter">
              {stats.total_products ?? 0}
            </div>
            <div className="text-xs text-[#718EBF] mt-0.5">
              Available across shops
            </div>
          </div>
        </div>

        {/* Card 3: Registered Merchants */}
        <div className="bg-white rounded-[25px] p-6 flex items-center gap-5 border-0 shadow-sm transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#FFE0EB] flex items-center justify-center flex-shrink-0 text-[#FF82AC]">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Merchant Owners
            </span>
            <div className="text-2xl lg:text-[28px] font-bold text-[#343C6A] mt-1 font-inter">
              {stats.total_shop_owners ?? 0}
            </div>
            <div className="text-xs text-[#16DBAA] font-semibold mt-0.5 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+2 new this month</span>
            </div>
          </div>
        </div>

        {/* Card 4: Platform Settled Revenue */}
        <div className="bg-white rounded-[25px] p-6 flex items-center gap-5 border-0 shadow-sm transition-all hover:shadow-md">
          <div className="w-16 h-16 rounded-full bg-[#DCFAF8] flex items-center justify-center flex-shrink-0 text-[#16DBCC]">
            <DollarSign className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Platform Sales
            </span>
            <div className="text-2xl lg:text-[28px] font-bold text-[#343C6A] mt-1 font-inter">
              ${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-[#718EBF] mt-0.5">
              {stats.total_orders ?? 0} orders settled
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: BankDash My Cards & Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: BankDash Signature Credit Cards */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
              My Cards
            </h2>
            <Link
              href="/admin/shops"
              className="text-sm font-semibold text-[#343C6A] hover:text-[#2D60FF] transition-colors"
            >
              See All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blue Gradient BankDash Card */}
            <div className="rounded-[25px] p-6 text-white bg-gradient-to-tr from-[#0A06F4] via-[#2D60FF] to-[#4C49ED] shadow-lg shadow-blue-500/10 flex flex-col justify-between min-h-[220px]">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs text-white/70 font-medium">Balance</span>
                  <div className="text-2xl font-bold font-inter mt-1">
                    ${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>
                </div>
                {/* Chip Icon */}
                <div className="w-9 h-7 rounded-md bg-white/20 border border-white/30 flex items-center justify-center">
                  <div className="w-4 h-3 border border-white/60 rounded-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-3 text-xs text-white/80">
                <div>
                  <span className="block text-[10px] text-white/60 uppercase">Card Holder</span>
                  <span className="font-semibold text-sm">Furniro Admin</span>
                </div>
                <div>
                  <span className="block text-[10px] text-white/60 uppercase">Valid Thru</span>
                  <span className="font-semibold text-sm">12/28</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/15 flex items-center justify-between text-sm tracking-widest font-mono">
                <span>3778 **** **** 1234</span>
                {/* Bank Mastercard Circles */}
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
                  <span className="text-xs text-[#718EBF] font-medium">Escrow Settlement</span>
                  <div className="text-2xl font-bold text-[#343C6A] font-inter mt-1">
                    $14,250.00
                  </div>
                </div>
                <div className="w-9 h-7 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center">
                  <div className="w-4 h-3 border border-slate-400 rounded-xs" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 my-3 text-xs">
                <div>
                  <span className="block text-[10px] text-[#718EBF] uppercase">Card Holder</span>
                  <span className="font-semibold text-sm text-[#343C6A]">Merchant Pool</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[#718EBF] uppercase">Valid Thru</span>
                  <span className="font-semibold text-sm text-[#343C6A]">09/27</span>
                </div>
              </div>

              <div className="pt-3 border-t border-[#F2F4F7] flex items-center justify-between text-sm tracking-widest font-mono text-[#343C6A]">
                <span>4528 **** **** 9821</span>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#2D60FF]/30" />
                  <div className="w-6 h-6 rounded-full bg-[#2D60FF]/20" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Recent Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
              Recent Transaction
            </h2>
            <span className="text-xs text-[#718EBF]">Latest checkouts</span>
          </div>

          <div className="bg-white rounded-[25px] p-6 space-y-5 border-0 shadow-sm min-h-[220px]">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8 text-[#718EBF] text-sm">
                No orders processed yet
              </div>
            ) : (
              recentOrders.slice(0, 3).map((ord) => (
                <div key={ord.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-full bg-[#FFF5D9] text-[#FFBB38] flex items-center justify-center flex-shrink-0">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#232323] truncate max-w-[140px]">
                        Order #{ord.order_number || ord.id}
                      </div>
                      <div className="text-xs text-[#718EBF]">
                        {ord.shop?.name || 'Storefront Order'}
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

      {/* 3. BankDash Weekly Activity & Category Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Dual Bar Chart */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
              Weekly Activity
            </h2>
            <div className="flex items-center gap-6 text-xs text-[#718EBF]">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#1814F3]" />
                <span>Orders</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#16DBCC]" />
                <span>Volume ($)</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[25px] p-7 border-0 shadow-sm">
            {/* Bars container */}
            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4">
              {[
                { day: 'Sat', ord: 60, vol: 80 },
                { day: 'Sun', ord: 45, vol: 60 },
                { day: 'Mon', ord: 75, vol: 90 },
                { day: 'Tue', ord: 85, vol: 70 },
                { day: 'Wed', ord: 55, vol: 95 },
                { day: 'Thu', ord: 90, vol: 65 },
                { day: 'Fri', ord: 70, vol: 85 },
              ].map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-3 flex-1">
                  <div className="flex items-end gap-2 h-44">
                    {/* Orders bar */}
                    <div
                      style={{ height: `${item.ord}%` }}
                      className="w-3.5 rounded-full bg-[#1814F3] transition-all hover:opacity-80"
                      title={`Orders: ${item.ord}%`}
                    />
                    {/* Volume bar */}
                    <div
                      style={{ height: `${item.vol}%` }}
                      className="w-3.5 rounded-full bg-[#16DBCC] transition-all hover:opacity-80"
                      title={`Volume: ${item.vol}%`}
                    />
                  </div>
                  <span className="text-xs text-[#718EBF] font-medium">{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Expense / Category Statistics */}
        <div className="space-y-4">
          <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
            Category Breakdown
          </h2>
          <div className="bg-white rounded-[25px] p-7 border-0 shadow-sm flex flex-col justify-between h-[300px]">
            <div className="space-y-3 my-auto">
              {[
                { name: 'Dining Room', share: 38, color: '#343C6A' },
                { name: 'Living Room', share: 32, color: '#FC7900' },
                { name: 'Bedroom Suites', share: 20, color: '#1814F3' },
                { name: 'Accents & Lighting', share: 10, color: '#FA00FF' },
              ].map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#343C6A]">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span>{c.name}</span>
                    </div>
                    <span>{c.share}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${c.share}%`, backgroundColor: c.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. Recent Merchant Stores Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[22px] font-bold text-[#343C6A] font-inter">
            Registered Merchant Stores
          </h2>
          <Link
            href="/admin/shops"
            className="text-sm font-semibold text-[#2D60FF] hover:underline flex items-center gap-1"
          >
            <span>Manage All Stores</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="bg-white rounded-[25px] p-6 border-0 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-sm text-[#343C6A]">
            <thead>
              <tr className="border-b border-[#E6EFF5] text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
                <th className="pb-4 font-inter">Store Name</th>
                <th className="pb-4 font-inter">Slug</th>
                <th className="pb-4 font-inter">Owner</th>
                <th className="pb-4 font-inter">Status</th>
                <th className="pb-4 font-inter text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F8]">
              {recentShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-[#F9FAFC] transition-colors">
                  <td className="py-4 font-semibold text-[#343C6A] flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E7EDFF] text-[#2D60FF] flex items-center justify-center font-bold text-sm">
                      {shop.name ? shop.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div>{shop.name}</div>
                      <div className="text-xs text-[#718EBF]">{shop.email || 'support@furniro.store'}</div>
                    </div>
                  </td>
                  <td className="py-4 font-mono text-xs text-[#718EBF]">/{shop.slug}</td>
                  <td className="py-4">{shop.owner?.name || 'Administrator'}</td>
                  <td className="py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFAF8] text-[#16DBCC]">
                      ● Active
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <Link
                      href={`/shop/${shop.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#2D60FF] hover:underline"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
