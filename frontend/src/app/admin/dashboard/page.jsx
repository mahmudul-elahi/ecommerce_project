'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  Layers,
  Users,
  DollarSign,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Package,
  Plus,
} from 'lucide-react';
import { useAdminDashboardQuery } from '../../../hooks/useAdmin';
import { formatPrice, formatCompactNumber } from '../../../utils/formatters';

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};
  const recentShops = data?.recent_shops || [];
  const recentOrders = data?.recent_orders || [];

  return (
    <div className="space-y-6 pb-10">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E6EFF5]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#343C6A]">Platform Overview</h1>
          <p className="text-xs text-[#718EBF] mt-1">
            Welcome to the Woodora multi-merchant administrative console.
          </p>
        </div>

        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#B88E2F] hover:bg-[#967125] text-white text-xs font-semibold transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Manage Product Catalog</span>
        </Link>
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Stores */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF5D9] flex items-center justify-center flex-shrink-0 text-[#FFBB38]">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Active Stores
            </span>
            <div className="text-2xl font-bold text-[#343C6A] mt-0.5">
              {stats.active_shops ?? 0}
              <span className="text-xs font-normal text-[#718EBF] ml-1">
                / {stats.total_shops ?? 0} total
              </span>
            </div>
            <div className="text-[11px] text-[#16DBAA] font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Operational</span>
            </div>
          </div>
        </div>

        {/* Card 2: Catalog Products */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E7EDFF] flex items-center justify-center flex-shrink-0 text-[#396AFF]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Catalog Items
            </span>
            <div className="text-2xl font-bold text-[#343C6A] mt-0.5">
              {formatCompactNumber(stats.total_products ?? 0)}
            </div>
            <div className="text-[11px] text-[#718EBF] mt-0.5">
              Available across shops
            </div>
          </div>
        </div>

        {/* Card 3: Registered Merchants */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE0EB] flex items-center justify-center flex-shrink-0 text-[#FF82AC]">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Merchant Owners
            </span>
            <div className="text-2xl font-bold text-[#343C6A] mt-0.5">
              {formatCompactNumber(stats.total_shop_owners ?? 0)}
            </div>
            <div className="text-[11px] text-[#718EBF] mt-0.5">
              Registered merchants
            </div>
          </div>
        </div>

        {/* Card 4: Platform Revenue */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#DCFAF8] flex items-center justify-center flex-shrink-0 text-[#16DBCC]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Platform Sales
            </span>
            <div className="text-2xl font-bold text-[#343C6A] mt-0.5">
              {formatPrice(stats.total_revenue || 0)}
            </div>
            <div className="text-[11px] text-[#16DBAA] font-medium mt-0.5">
              {stats.total_orders ?? 0} settled orders
            </div>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Recent Orders & Quick Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Recent Platform Orders */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#343C6A]">Recent Customer Orders</h2>
            <span className="text-xs text-[#718EBF]">Platform-wide activity</span>
          </div>

          <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#FAF3EA] flex items-center justify-center text-[#B88E2F] mb-3">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-[#343C6A]">No customer orders yet</h3>
                <p className="text-xs text-[#718EBF] max-w-sm mt-1">
                  Orders placed across verified merchant stores will appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#343C6A]">
                  <thead>
                    <tr className="border-b border-[#E6EFF5] text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Store</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Total</th>
                      <th className="pb-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F4F6F8]">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-[#F9FAFC] transition-colors">
                        <td className="py-3.5 font-semibold text-[#343C6A]">
                          #{ord.order_number || ord.id}
                        </td>
                        <td className="py-3.5 text-xs text-[#343C6A]">
                          {ord.shop?.name || 'Storefront Order'}
                        </td>
                        <td className="py-3.5 text-xs text-[#718EBF]">
                          {ord.created_at ? new Date(ord.created_at).toLocaleDateString() : 'Recent'}
                        </td>
                        <td className="py-3.5 font-semibold text-xs text-[#343C6A]">
                          {formatPrice(ord.total_amount)}
                        </td>
                        <td className="py-3.5 text-right">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                              ord.status === 'completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : ord.status === 'cancelled'
                                ? 'bg-rose-50 text-rose-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {ord.status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right (1 col): Quick Navigation */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#343C6A]">Platform Management</h2>

          <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs space-y-2.5">
            <Link
              href="/admin/shops"
              className="p-3.5 rounded-xl bg-[#F5F7FA] hover:bg-[#FAF3EA] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FAF3EA] group-hover:bg-white text-[#B88E2F] flex items-center justify-center">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#343C6A]">Merchant Stores</div>
                  <div className="text-[10px] text-[#718EBF]">
                    {stats.active_shops ?? 0} active stores
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#B88E2F]" />
            </Link>

            <Link
              href="/admin/products"
              className="p-3.5 rounded-xl bg-[#F5F7FA] hover:bg-[#E7EDFF] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E7EDFF] group-hover:bg-white text-[#396AFF] flex items-center justify-center">
                  <ShoppingBag className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#343C6A]">Catalog Products</div>
                  <div className="text-[10px] text-[#718EBF]">
                    {stats.total_products ?? 0} shared products
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#396AFF]" />
            </Link>

            <Link
              href="/admin/categories"
              className="p-3.5 rounded-xl bg-[#F5F7FA] hover:bg-[#FFF5D9] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#FFF5D9] group-hover:bg-white text-[#FFBB38] flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#343C6A]">Dynamic Categories</div>
                  <div className="text-[10px] text-[#718EBF]">Browse The Range taxonomy</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#FFBB38]" />
            </Link>

            <Link
              href="/admin/users"
              className="p-3.5 rounded-xl bg-[#F5F7FA] hover:bg-[#DCFAF8] transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#DCFAF8] group-hover:bg-white text-[#16DBCC] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#343C6A]">Users & Merchants</div>
                  <div className="text-[10px] text-[#718EBF]">
                    {stats.total_shop_owners ?? 0} merchant accounts
                  </div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#16DBCC]" />
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Registered Merchant Stores Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[#343C6A]">Registered Merchant Stores</h2>
          <Link
            href="/admin/shops"
            className="text-xs font-semibold text-[#B88E2F] hover:underline flex items-center gap-1"
          >
            <span>Manage All Stores</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs overflow-x-auto">
          <table className="w-full text-left text-sm text-[#343C6A]">
            <thead>
              <tr className="border-b border-[#E6EFF5] text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
                <th className="pb-3">Store Name</th>
                <th className="pb-3">Slug</th>
                <th className="pb-3">Owner</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4F6F8]">
              {recentShops.map((shop) => (
                <tr key={shop.id} className="hover:bg-[#F9FAFC] transition-colors">
                  <td className="py-3.5 font-semibold text-[#343C6A] flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FAF3EA] text-[#B88E2F] flex items-center justify-center font-bold text-xs">
                      {shop.name ? shop.name.charAt(0).toUpperCase() : 'S'}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-[#343C6A]">{shop.name}</div>
                      <div className="text-xs text-[#718EBF]">{shop.email || 'support@woodora.store'}</div>
                    </div>
                  </td>
                  <td className="py-3.5 font-mono text-xs text-[#718EBF]">/{shop.slug}</td>
                  <td className="py-3.5 text-xs text-[#343C6A]">{shop.owner?.name || 'Administrator'}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <Link
                      href={`/shop/${shop.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[#B88E2F] hover:underline"
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
