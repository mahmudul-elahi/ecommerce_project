'use client';

import React from 'react';
import Link from 'next/link';
import {
  Store,
  Layers,
  ShoppingBag,
  ShoppingCart,
  DollarSign,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Package,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
} from 'lucide-react';
import { useShopOwnerDashboardQuery, useMyShopQuery } from '../../../hooks/useShopOwner';
import { useAuth } from '../../../context/AuthContext';
import { formatPrice, formatCompactNumber } from '../../../utils/formatters';

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
    <div className="space-y-6 pb-10">
      {/* 1. Header Banner */}
      <div className="bg-white rounded-[20px] p-6 border border-[#E6EFF5]/60 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#343C6A]">
            {shop?.name || 'My Store Dashboard'}
          </h1>
          <p className="text-xs text-[#718EBF] mt-1">
            Welcome back, {user?.name || 'Merchant'}! Here is your current store summary.
          </p>
        </div>

        {shop?.slug && (
          <Link
            href={`/shop/${shop.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF3EA] hover:bg-[#F4E8D3] text-[#B88E2F] text-xs font-semibold transition-colors"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {/* 2. Key Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Active Listings */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFF5D9] flex items-center justify-center flex-shrink-0 text-[#FFBB38]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Active Listings
            </span>
            <div className="text-2xl font-bold text-[#343C6A] mt-0.5">
              {formatCompactNumber(stats.my_products_count ?? 0)}
            </div>
            <div className="text-[11px] text-[#16DBAA] font-medium flex items-center gap-1 mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>Visible to customers</span>
            </div>
          </div>
        </div>

        {/* Card 2: Shared Catalog Items */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#E7EDFF] flex items-center justify-center flex-shrink-0 text-[#396AFF]">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Ready to Add
            </span>
            <div className="text-2xl font-bold text-[#343C6A] mt-0.5">
              {formatCompactNumber(stats.available_catalog_count ?? stats.total_catalog_count ?? 0)}
            </div>
            <div className="text-[11px] text-[#718EBF] mt-0.5">
              {stats.available_catalog_count === 0 ? 'All catalog items added' : 'Available from catalog'}
            </div>
          </div>
        </div>

        {/* Card 3: Total Orders */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#FFE0EB] flex items-center justify-center flex-shrink-0 text-[#FF82AC]">
            <ShoppingCart className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Customer Orders
            </span>
            <div className="text-2xl font-bold text-[#343C6A] mt-0.5">
              {formatCompactNumber(stats.total_orders ?? 0)}
            </div>
            <div className="text-[11px] text-[#718EBF] mt-0.5">
              All-time orders
            </div>
          </div>
        </div>

        {/* Card 4: Total Revenue */}
        <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#DCFAF8] flex items-center justify-center flex-shrink-0 text-[#16DBCC]">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
              Total Revenue
            </span>
            <div className="text-2xl font-bold text-[#343C6A] mt-0.5">
              {formatPrice(stats.total_revenue || 0)}
            </div>
            <div className="text-[11px] text-[#16DBAA] font-medium mt-0.5">
              Settled store sales
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Content: Recent Orders & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Recent Orders Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#343C6A]">Recent Customer Orders</h2>
            <Link
              href="/shop-owner/orders"
              className="text-xs font-semibold text-[#B88E2F] hover:underline flex items-center gap-1"
            >
              <span>View All Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs overflow-hidden">
            {recentOrders.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 rounded-full bg-[#FAF3EA] flex items-center justify-center text-[#B88E2F] mb-3">
                  <Package className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-[#343C6A]">No orders received yet</h3>
                <p className="text-xs text-[#718EBF] max-w-sm mt-1">
                  When customers purchase your listed items from your storefront, they will be listed here.
                </p>
                <Link
                  href="/shop-owner/catalog"
                  className="mt-4 px-4 py-2 rounded-xl bg-[#B88E2F] text-white text-xs font-semibold hover:bg-[#967125] transition-colors"
                >
                  Browse Shared Catalog to Add Products
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-[#343C6A]">
                  <thead>
                    <tr className="border-b border-[#E6EFF5] text-xs font-semibold uppercase tracking-wider text-[#718EBF]">
                      <th className="pb-3">Order Number</th>
                      <th className="pb-3">Customer</th>
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
                        <td className="py-3.5">
                          <div className="font-medium text-xs text-[#343C6A]">
                            {ord.customer_name || 'Customer'}
                          </div>
                          {ord.customer_phone && (
                            <div className="text-[11px] text-[#718EBF]">{ord.customer_phone}</div>
                          )}
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

        {/* Right Column (1 col): Store Summary & Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-[#343C6A]">Store Overview</h2>

          <div className="bg-white rounded-[20px] p-5 border border-[#E6EFF5]/60 shadow-xs space-y-4">
            {/* Store Details */}
            <div className="space-y-2.5 pb-4 border-b border-[#F2F4F7]">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#718EBF] font-semibold">
                  Store Name
                </span>
                <div className="text-base font-bold text-[#343C6A] mt-0.5">
                  {shop?.name || 'My Store'}
                </div>
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider text-[#718EBF] font-semibold">
                  Storefront URL
                </span>
                <div className="text-xs font-mono text-[#B88E2F] mt-0.5 font-semibold">
                  /{shop?.slug || 'store'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-xs text-[#718EBF]">Status</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Storefront
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <span className="text-[11px] uppercase tracking-wider text-[#718EBF] font-semibold block mb-2.5">
                Quick Actions
              </span>
              <div className="space-y-2">
                <Link
                  href="/shop-owner/catalog"
                  className="p-3 rounded-xl bg-[#F5F7FA] hover:bg-[#FAF3EA] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FAF3EA] group-hover:bg-white text-[#B88E2F] flex items-center justify-center">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#343C6A]">Browse Catalog</div>
                      <div className="text-[10px] text-[#718EBF]">Add products with custom price</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#B88E2F]" />
                </Link>

                <Link
                  href="/shop-owner/products"
                  className="p-3 rounded-xl bg-[#F5F7FA] hover:bg-[#FFF5D9] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#FFF5D9] group-hover:bg-white text-[#FFBB38] flex items-center justify-center">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#343C6A]">Manage My Listings</div>
                      <div className="text-[10px] text-[#718EBF]">Edit prices, stock & details</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#FFBB38]" />
                </Link>

                <Link
                  href="/shop-owner/settings"
                  className="p-3 rounded-xl bg-[#F5F7FA] hover:bg-[#E7EDFF] transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#E7EDFF] group-hover:bg-white text-[#396AFF] flex items-center justify-center">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-[#343C6A]">Store Branding</div>
                      <div className="text-[10px] text-[#718EBF]">Configure logo, banner & contacts</div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#718EBF] group-hover:text-[#396AFF]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
