'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  Store,
  Layers,
  Users,
  ShoppingBag,
  DollarSign,
  Plus,
  ArrowRight,
  ShieldCheck,
  Package,
  TrendingUp,
  Activity,
  CheckCircle2,
} from 'lucide-react';
import api from '../../../api/client';

export default function AdminDashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: async () => {
      const res = await api.get('/admin/dashboard');
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-stone-200 mb-8">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200 mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
            <span className="font-mono uppercase tracking-wider">Super Administrator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Platform Administration
          </h1>
          <p className="text-xs text-stone-500 mt-1 max-w-xl font-normal">
            Supervise all independent storefronts, govern the shared universal product catalog, and manage merchant accounts.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center space-x-2.5">
          <Link
            href="/admin/shops"
            className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-stone-600" />
            <span>New Shop</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-xs font-semibold text-stone-50 transition-colors shadow-xs flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Catalog Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {/* Total Active Shops */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Active Shops
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1.5">
              {stats.active_shops || 0}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Total created: {stats.total_shops || 0}
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center">
            <Store className="w-5 h-5 text-stone-700" />
          </div>
        </div>

        {/* Shared Catalog Products */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Shared Catalog
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1.5">
              {stats.total_products || 0}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Global catalog items
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center">
            <Layers className="w-5 h-5 text-stone-700" />
          </div>
        </div>

        {/* Shop Owners */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Shop Owners
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1.5">
              {stats.total_owners || 0}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Registered merchants
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 flex items-center justify-center">
            <Users className="w-5 h-5 text-stone-700" />
          </div>
        </div>

        {/* Total Platform Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-500">
              Platform Sales
            </span>
            <div className="text-2xl font-bold text-stone-900 mt-1.5">
              ${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Across all storefronts
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-amber-700" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Management & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Management Links */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
            <h3 className="text-sm font-bold text-stone-900 mb-1">Architecture & Operational Modules</h3>
            <p className="text-xs text-stone-500 mb-5">
              Direct access to platform CRUD operations and entity controls.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/admin/shops"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-white transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-800 mb-3 shadow-2xs group-hover:bg-stone-900 group-hover:text-stone-50 transition-colors">
                  <Store className="w-4.5 h-4.5" />
                </div>
                <div className="font-bold text-stone-900 text-xs">Shops Management</div>
                <div className="text-[11px] text-stone-500 mt-1 leading-snug">
                  Create, edit, suspend or assign owners to stores.
                </div>
              </Link>

              <Link
                href="/admin/products"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-white transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-800 mb-3 shadow-2xs group-hover:bg-stone-900 group-hover:text-stone-50 transition-colors">
                  <Layers className="w-4.5 h-4.5" />
                </div>
                <div className="font-bold text-stone-900 text-xs">Shared Catalog</div>
                <div className="text-[11px] text-stone-500 mt-1 leading-snug">
                  Universal products available to all shop owners.
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="p-4 rounded-xl border border-stone-200 hover:border-stone-400 bg-stone-50/50 hover:bg-white transition-all group"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-stone-200 flex items-center justify-center text-stone-800 mb-3 shadow-2xs group-hover:bg-stone-900 group-hover:text-stone-50 transition-colors">
                  <Users className="w-4.5 h-4.5" />
                </div>
                <div className="font-bold text-stone-900 text-xs">Shop Owners</div>
                <div className="text-[11px] text-stone-500 mt-1 leading-snug">
                  Provision new merchant user credentials.
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* System Architecture Specifications */}
        <div>
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
            <h3 className="text-sm font-bold text-stone-900">Platform Specifications</h3>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-500">Backend Framework</span>
                <span className="font-mono font-semibold text-stone-900">Laravel 12 (PHP 8.2+)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-500">Frontend Framework</span>
                <span className="font-mono font-semibold text-stone-900">Next.js 16 (React 19)</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-500">State & Cache</span>
                <span className="font-mono font-semibold text-stone-900">TanStack React Query v5</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                <span className="text-stone-500">Validation Layer</span>
                <span className="font-mono font-semibold text-stone-900">React Hook Form + Zod</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-stone-500">Authentication</span>
                <span className="font-mono font-semibold text-stone-900">Laravel Sanctum Tokens</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
