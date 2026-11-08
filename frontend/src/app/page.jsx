'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Store,
  Search,
  ArrowRight,
  MapPin,
} from 'lucide-react';
import { useDebounce } from '../hooks/useDebounce';
import { useShopsQuery } from '../hooks/useShops';

const CATEGORY_FILTERS = [
  { id: 'all', label: 'All shops' },
  { id: 'tech', label: 'Audio & Tech' },
  { id: 'home', label: 'Artisan & Home' },
  { id: 'apparel', label: 'Apparel & Style' },
];

export default function HomePage() {
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const debouncedSearch = useDebounce(searchInput, 250);

  const {
    data: rawShops = [],
    isLoading,
    isError,
  } = useShopsQuery(debouncedSearch);

  // Filter storefronts by category keyword
  const shops = useMemo(() => {
    if (activeCategory === 'all') return rawShops;
    return rawShops.filter((shop) => {
      const text = `${shop.name} ${shop.description || ''}`.toLowerCase();
      if (activeCategory === 'tech') return text.includes('tech') || text.includes('audio') || text.includes('electronics') || text.includes('gadget');
      if (activeCategory === 'home') return text.includes('home') || text.includes('studio') || text.includes('living') || text.includes('artisan');
      if (activeCategory === 'apparel') return text.includes('apparel') || text.includes('cloth') || text.includes('fashion') || text.includes('style');
      return true;
    });
  }, [rawShops, activeCategory]);

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <section className="bg-blue-50 border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-14 items-center">
            <div>
              <p className="text-sm font-semibold text-blue-700 mb-3">Welcome to OmniShop</p>
              <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                Find your next <span className="text-blue-700">favorite thing.</span>
              </h1>
              <p className="mt-4 text-slate-600 text-base leading-relaxed max-w-xl">
                Browse products from independent shops and discover something new.
              </p>
              <div className="mt-7 max-w-2xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search shops by name or specialty"
                  className="w-full pl-12 pr-28 py-3 rounded-lg bg-white border border-slate-300 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all shadow-sm"
                />
                <div className="absolute right-3.5 flex items-center space-x-1.5">
                  {searchInput ? (
                    <button
                      onClick={() => setSearchInput('')}
                      className="text-slate-600 hover:text-slate-900 text-xs font-medium px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 transition-colors"
                    >
                      Clear
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-block text-[11px] font-mono bg-slate-100 px-2.5 py-1 rounded text-slate-500 border border-slate-200">
                      /
                    </kbd>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1 text-xs">
                {CATEGORY_FILTERS.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                      activeCategory === cat.id
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white text-slate-700 hover:text-blue-700 hover:bg-blue-50 border border-slate-300'
                    }`}
                  >
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>
            </div>
            </div>
            <div className="relative min-h-[280px] sm:min-h-[360px]">
              <img
                src={rawShops[0]?.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=85'}
                alt={rawShops[0] ? `${rawShops[0].name} shop` : 'A welcoming independent shop'}
                className="absolute inset-0 h-full w-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5 sm:p-7 text-white">
                <p className="text-xs uppercase tracking-wide text-white/80">Featured shop</p>
                <p className="mt-1 text-xl sm:text-2xl font-semibold">{rawShops[0]?.name || 'Discover independent stores'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="stores" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200 mb-6 gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center space-x-2.5">
              <Store className="w-5 h-5 text-blue-600" />
              <span>Browse shops</span>
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Find a store and explore its collection
            </p>
          </div>

          <div className="text-sm font-medium text-slate-600 bg-white px-3 py-2 rounded-lg border border-slate-200 self-start sm:self-auto flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span>{isLoading ? 'Loading shops…' : `${shops.length} ${shops.length === 1 ? 'shop' : 'shops'}`}</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs animate-pulse">
                <div className="aspect-[16/9] bg-neutral-100" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-neutral-200 rounded w-2/3" />
                  <div className="h-3 bg-neutral-100 rounded w-full" />
                  <div className="h-3 bg-neutral-100 rounded w-4/5" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
            <p className="text-xs text-rose-600 font-semibold">Unable to load merchant stores at this time.</p>
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-neutral-200 shadow-2xs">
            <Store className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-neutral-900">No matching stores found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              We couldn't find any stores matching your query. Try another keyword or filter chip.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <div
                key={shop.id}
                className="group flex flex-col bg-white rounded-xl border border-slate-200 hover:border-blue-300 shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                {/* Banner Header with fixed aspect ratio */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={shop.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-blue-600/0 transition-colors" />

                  {/* Logo overlay badge */}
                  <div className="absolute bottom-4 left-4">
                    <img
                      src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}
                      alt={shop.name}
                      className="w-14 h-14 rounded-lg object-cover border-2 border-white shadow-md bg-white"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200';
                      }}
                    />
                  </div>

                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {shop.name}
                      </h3>
                      <span className="text-xs text-slate-500 whitespace-nowrap">{shop.products_count} items</span>
                    </div>

                    <p className="text-sm text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {shop.description || 'Welcome to our online store. Browse our curated collection of quality products.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                    {shop.address ? (
                      <span className="text-slate-500 flex items-center space-x-1.5 truncate max-w-[170px]">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-slate-400" />
                        <span className="truncate">{shop.address}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs">Online store</span>
                    )}

                    <Link
                      href={`/shop/${shop.slug}`}
                      className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-semibold text-sm flex items-center space-x-1.5"
                    >
                      <span>Shop now</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
