'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Store,
  Search,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  MapPin,
  Sparkles,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useShopsQuery } from '../hooks/useShops';

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebounce(searchInput, 250);

  const {
    data: shops = [],
    isLoading,
    isError,
  } = useShopsQuery(debouncedSearch);

  return (
    <div className="min-h-screen pb-20 bg-paper">
      {/* Editorial Hero Header */}
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
          <div className="max-w-3xl">
            {/* Architecture pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-700 text-xs font-medium mb-6">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="font-mono text-[11px] tracking-wide uppercase">Multi-Tenant Catalog Architecture</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-900 leading-[1.15]">
              Curated merchant storefronts, powered by one shared product catalog.
            </h1>

            <p className="mt-4 text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
              Each storefront operates independently with custom retail pricing, personalized titles, and unique merchandising — all sourced seamlessly from a unified, centralized inventory catalog.
            </p>

            {/* Live Search Bar */}
            <div className="mt-8 max-w-xl">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-stone-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search merchant stores by name, city, or specialty..."
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all shadow-subtle"
                />
                {searchInput && (
                  <button
                    onClick={() => setSearchInput('')}
                    className="absolute right-3 text-stone-400 hover:text-stone-600 text-xs px-1.5 py-0.5 rounded bg-stone-100"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Architecture Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-subtle flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-100 flex-shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900">Isolated Storefronts</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Shoppers only see products customized and assigned to the selected merchant.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-subtle flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-stone-100 text-stone-800 border border-stone-200 flex-shrink-0">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900">Custom Retail Pricing</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Merchants set custom markup margins or adopt universal wholesale defaults.
              </p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-subtle flex items-start space-x-3">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-100 flex-shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-stone-900">Single-Shop Checkout</h4>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Direct order dispatch to store owners with real-time fulfillment tracking.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Merchant Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-200 mb-6 gap-2">
          <div>
            <h2 className="text-lg font-bold text-stone-900 flex items-center space-x-2">
              <Store className="w-4 h-4 text-emerald-800" />
              <span>Independent Stores</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Explore active merchants and their custom catalog selections
            </p>
          </div>

          <div className="text-xs font-mono text-stone-500 bg-white px-3 py-1.5 rounded-lg border border-stone-200 self-start sm:self-auto">
            {isLoading ? 'Querying...' : `${shops.length} Active ${shops.length === 1 ? 'Store' : 'Stores'}`}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-subtle animate-pulse">
                <div className="h-44 bg-stone-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-2/3" />
                  <div className="h-3 bg-stone-100 rounded w-full" />
                  <div className="h-3 bg-stone-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-stone-200">
            <p className="text-xs text-rose-600 font-semibold">Unable to load merchant stores at this time.</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-stone-200">
            <Store className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-stone-800">No matching stores found</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              We couldn't find any stores matching &ldquo;{debouncedSearch}&rdquo;. Try another search keyword.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Link
                key={shop.id}
                href={`/shop/${shop.slug}`}
                className="group bg-white rounded-2xl border border-stone-200 hover:border-stone-400 transition-all duration-200 shadow-subtle hover:shadow-craft flex flex-col overflow-hidden"
              >
                {/* Banner Header */}
                <div className="relative h-44 bg-stone-100 overflow-hidden">
                  <img
                    src={shop.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-stone-900/10 transition-colors" />

                  {/* Logo overlay badge */}
                  <div className="absolute -bottom-3 left-5">
                    <img
                      src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}
                      alt={shop.name}
                      className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-subtle bg-white"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200';
                      }}
                    />
                  </div>

                  {/* Catalog count badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm border border-stone-200/80 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium text-stone-800 shadow-subtle flex items-center space-x-1.5">
                    <ShoppingBag className="w-3 h-3 text-emerald-700" />
                    <span>{shop.products_count} {shop.products_count === 1 ? 'item' : 'items'}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 pt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-stone-900 group-hover:text-emerald-800 transition-colors">
                        {shop.name}
                      </h3>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200">
                        Verified
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 mt-2 line-clamp-2 leading-relaxed">
                      {shop.description || 'Welcome to our online store. Browse our curated collection of quality products.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-stone-100 flex items-center justify-between text-xs">
                    {shop.address ? (
                      <span className="text-stone-400 flex items-center space-x-1 truncate max-w-[190px]">
                        <MapPin className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{shop.address}</span>
                      </span>
                    ) : (
                      <span className="text-stone-400">Online Storefront</span>
                    )}

                    <span className="font-semibold text-stone-900 group-hover:text-emerald-800 group-hover:translate-x-0.5 transition-all flex items-center space-x-1 text-xs">
                      <span>Enter Shop</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
