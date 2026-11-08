import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Search, ArrowRight, ShieldCheck, ShoppingBag, MapPin, Sparkles } from 'lucide-react';
import api from '../../api/client';

export default function ShopList() {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchShops = async () => {
    try {
      setLoading(true);
      const res = await api.get('/customer/shops', {
        params: { search: search || undefined },
      });
      setShops(res.data);
    } catch (err) {
      console.error('Failed to load shops', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShops();
    }, 250);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-slate-900 text-white py-16 sm:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-6 border border-emerald-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Shared Product Catalog Multi-Vendor Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-4 max-w-4xl mx-auto">
            Explore Independent Stores Powered by a <span className="text-emerald-400">Shared Catalog</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto mb-8 font-light">
            Every shop curates its own unique pricing, custom details, and product lineup from an expansive global catalog.
          </p>

          {/* Search Bar */}
          <div className="max-w-xl mx-auto relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search stores by name or description..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 text-white placeholder-slate-400 border border-white/20 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:bg-white/20 transition-all text-sm"
            />
          </div>
        </div>
      </section>

      {/* Feature notice card */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-lg border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Isolated Customer Storefronts</h4>
              <p className="text-xs text-slate-500">
                Customers only see products assigned to a selected shop with shop-specific prices and customized details. Unassigned catalog products are strictly hidden.
              </p>
            </div>
          </div>
          <div className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 flex-shrink-0">
            {shops.length} Active {shops.length === 1 ? 'Store' : 'Stores'}
          </div>
        </div>
      </div>

      {/* Shops Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-slate-900 flex items-center space-x-2">
            <Store className="w-5 h-5 text-emerald-600" />
            <span>Featured Stores</span>
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse">
                <div className="h-44 bg-slate-200" />
                <div className="p-6 space-y-3">
                  <div className="h-5 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-100 rounded w-full" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700">No stores found</h3>
            <p className="text-xs text-slate-400 mt-1">Try a different search query or clear your filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map((shop) => (
              <Link
                key={shop.id}
                to={`/shop/${shop.slug}`}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col"
              >
                {/* Banner & Logo */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={shop.banner_url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'}
                    alt={shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                  {/* Logo overlay */}
                  <div className="absolute -bottom-3 left-6">
                    <img
                      src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}
                      alt={shop.name}
                      className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-md bg-white"
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200';
                      }}
                    />
                  </div>

                  {/* Products count pill */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-slate-800 shadow-sm flex items-center space-x-1">
                    <ShoppingBag className="w-3 h-3 text-emerald-600" />
                    <span>{shop.products_count} {shop.products_count === 1 ? 'Product' : 'Products'}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 pt-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                      {shop.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {shop.description || 'Welcome to our online store. Browse our curated collection of quality products.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    {shop.address ? (
                      <span className="text-slate-400 flex items-center space-x-1 truncate max-w-[200px]">
                        <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate">{shop.address}</span>
                      </span>
                    ) : (
                      <span className="text-slate-400">Verified Seller</span>
                    )}

                    <span className="font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform flex items-center space-x-1">
                      <span>Visit Store</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
