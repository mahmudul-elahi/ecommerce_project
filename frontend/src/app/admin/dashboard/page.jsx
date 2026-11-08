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
  ShieldCheck,
} from 'lucide-react';
import { useAdminDashboardQuery } from '../../../hooks/useAdmin';

export default function AdminDashboardPage() {
  const {
    data,
    isLoading,
    isError,
  } = useAdminDashboardQuery();

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stats = data?.stats || {};

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Marketplace header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 mb-8">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold border border-blue-100 mb-2 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span className="font-mono uppercase tracking-wider">Marketplace desk</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-sans">
            Your marketplace
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl font-normal">
            The shops, people and products that make OmniShop what it is.
          </p>
        </div>

        {/* Quick action shortcuts */}
        <div className="flex items-center space-x-2.5">
          <Link
            href="/admin/shops"
            className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition-colors flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-slate-600" />
            <span>New Shop</span>
          </Link>
          <Link
            href="/admin/products"
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add a product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {/* Total Active Shops */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Open shops
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">
              {stats.active_shops || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span className="text-blue-700 font-semibold font-mono text-[10px] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">100% Online</span>
              <span>of {stats.total_shops || 0} stores</span>
            </div>
          </div>
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center shadow-2xs">
            <Store className="w-5 h-5 text-slate-900" />
          </div>
        </div>

        {/* Product count */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Products
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">
              {stats.total_products || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span className="text-slate-700 font-semibold font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Available</span>
              <span>to shops</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center shadow-2xs">
            <Layers className="w-5 h-5 text-slate-900" />
          </div>
        </div>

        {/* Shop Owners */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Shop owners
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">
              {stats.total_owners || 0}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span className="text-slate-700 font-semibold font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Tenants</span>
              <span>registered</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-900 border border-slate-200 flex items-center justify-center shadow-2xs">
            <Users className="w-5 h-5 text-slate-900" />
          </div>
        </div>

        {/* Total Platform Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
              Sales to date
            </span>
            <div className="text-3xl font-extrabold text-slate-900 mt-1 font-mono tracking-tight">
              ${Number(stats.total_revenue || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
              <span className="text-blue-700 font-semibold font-mono text-[10px] bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">Settled</span>
              <span>across all checkout flows</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center shadow-2xs">
            <DollarSign className="w-5 h-5 text-blue-700" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Quick Management & System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Management Links */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">Keep things running</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  The everyday work behind a healthy marketplace.
                </p>
              </div>
              <span className="text-[10px] font-mono uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-bold">
                Shortcuts
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Link
                href="/admin/shops"
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-white hover:-translate-y-0.5 transition-all duration-200 group shadow-2xs"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 mb-3.5 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Store className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-900 text-xs">Shops</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Add a shop, update its details, and connect its owner.
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center text-[11px] font-semibold text-slate-900 group-hover:text-slate-600">
                  <span>Manage Shops</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/admin/products"
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-white hover:-translate-y-0.5 transition-all duration-200 group shadow-2xs"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 mb-3.5 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Layers className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-900 text-xs">Products</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Add and edit the products shops can offer.
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center text-[11px] font-semibold text-slate-900 group-hover:text-slate-600">
                  <span>Browse Catalog</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>

              <Link
                href="/admin/users"
                className="p-5 rounded-2xl border border-slate-200 hover:border-slate-400 bg-slate-50/50 hover:bg-white hover:-translate-y-0.5 transition-all duration-200 group shadow-2xs"
              >
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-900 mb-3.5 shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <Users className="w-5 h-5" />
                </div>
                <div className="font-bold text-slate-900 text-xs">People</div>
                <div className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Create shop owner accounts and link them to a shop.
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center text-[11px] font-semibold text-slate-900 group-hover:text-slate-600">
                  <span>Manage Accounts</span>
                  <ArrowRight className="w-3 h-3 ml-1 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div>
          <div className="h-full min-h-[260px] bg-blue-700 text-white p-7 flex flex-col justify-between rounded-xl">
            <div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-white/70">OmniShop · Marketplace desk</div>
              <h3 className="mt-8 text-3xl leading-tight font-medium text-white">Good shops<br />make good things<br />easier to find.</h3>
            </div>
            <div className="pt-5 border-t border-white/30 flex justify-between text-xs">
              <span>{stats.total_shops || 0} shops</span>
              <span>{stats.total_products || 0} products</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
