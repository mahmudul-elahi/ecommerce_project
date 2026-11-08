'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  Store,
  Search,
  ShoppingBag,
  ArrowLeft,
  Check,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  Layers,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Plus,
  Minus,
} from 'lucide-react';
import api from '../../../api/client';
import { queryKeys } from '../../../api/queryKeys';
import { useCart } from '../../../context/CartContext';
import Modal from '../../../components/common/Modal';

export default function ShopStorefrontPage() {
  const params = useParams();
  const slug = params?.slug;

  const { addToCart } = useCart();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('');

  // Selected product modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [addedItemEffect, setAddedItemEffect] = useState(null);

  // Shop Query via TanStack React Query
  const {
    data: shop,
    isLoading: loadingShop,
    isError: shopError,
  } = useQuery({
    queryKey: queryKeys.shops.detail(slug),
    queryFn: async () => {
      const res = await api.get(`/customer/shops/${slug}`);
      return res.data;
    },
    enabled: !!slug,
  });

  // Shop Products Query via TanStack React Query
  const {
    data: products = [],
    isLoading: loadingProducts,
  } = useQuery({
    queryKey: queryKeys.shops.products(slug, { search, selectedCategory, sort }),
    queryFn: async () => {
      const res = await api.get(`/customer/shops/${slug}/products`, {
        params: {
          search: search || undefined,
          category: selectedCategory || undefined,
          sort: sort || undefined,
        },
      });
      return res.data.data || [];
    },
    enabled: !!slug,
  });

  const handleAddToCart = (e, product, qty = 1) => {
    e.stopPropagation();
    if (!product.in_stock) {
      toast.error('Out of Stock', { description: 'Sorry, this product is currently unavailable.' });
      return;
    }
    const success = addToCart(shop, product, qty);
    if (success) {
      setAddedItemEffect(product.shop_product_id);
      setTimeout(() => setAddedItemEffect(null), 1200);
      toast.success('Added to Cart', {
        description: `${qty}× "${product.name}" added to your ${shop.name} order.`,
      });
      if (selectedProduct) setSelectedProduct(null);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  if (loadingShop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-8 h-8 border-2 border-stone-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-paper">
        <Store className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-stone-900">Storefront Not Found</h2>
        <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
          The requested store does not exist or has been temporarily suspended.
        </p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 mt-5 px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-subtle"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse All Stores</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 bg-paper">
      {/* Light Merchant Header Banner */}
      <section className="bg-white border-b border-stone-200">
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-stone-100">
          <img
            src={shop.banner_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400'}
            alt={shop.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400';
            }}
          />
          <div className="absolute inset-0 bg-stone-900/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-12 pb-6">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <img
                src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}
                alt={shop.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-4 border-white shadow-craft bg-white flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200';
                }}
              />
              <div>
                <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200 text-stone-700 text-[10px] font-mono uppercase tracking-wide mb-1.5">
                  <ShieldCheck className="w-3 h-3 text-emerald-700" />
                  <span>Independent Merchant Storefront</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">{shop.name}</h1>
                <p className="text-xs text-stone-500 mt-1 max-w-xl line-clamp-2">
                  {shop.description || 'Welcome to our shop! Browse our assigned product listings below.'}
                </p>
              </div>
            </div>

            {/* Merchant Contact Tags */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600">
              {shop.phone && (
                <div className="flex items-center space-x-1.5 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                  <Phone className="w-3.5 h-3.5 text-stone-500" />
                  <span className="font-mono text-[11px]">{shop.phone}</span>
                </div>
              )}
              {shop.email && (
                <div className="flex items-center space-x-1.5 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                  <Mail className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-[11px]">{shop.email}</span>
                </div>
              )}
              {shop.address && (
                <div className="flex items-center space-x-1.5 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                  <MapPin className="w-3.5 h-3.5 text-stone-500" />
                  <span className="text-[11px] truncate max-w-[200px]">{shop.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog View */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Stores</span>
          </Link>

          <div className="text-xs font-mono text-stone-500">
            <span className="font-bold text-stone-900">{products.length}</span> curated items available
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-subtle flex flex-col md:flex-row gap-2.5 items-center justify-between mb-6">
          <div className="relative w-full md:w-80">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search store inventory..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white text-stone-900"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-700"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            )}

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 text-stone-700"
            >
              <option value="">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {/* Products Grid */}
        {loadingProducts ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-xl border border-stone-200 p-4 space-y-3 animate-pulse">
                <div className="h-44 bg-stone-100 rounded-lg" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-stone-200">
            <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto mb-2" />
            <h3 className="text-sm font-semibold text-stone-800">No items currently displayed</h3>
            <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
              This store hasn't assigned matching catalog products or they are temporarily out of stock.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {products.map((item) => (
              <div
                key={item.shop_product_id}
                onClick={() => {
                  setSelectedProduct(item);
                  setModalQuantity(1);
                }}
                className="group bg-white rounded-xl border border-stone-200 hover:border-stone-400 transition-all duration-200 shadow-subtle hover:shadow-craft flex flex-col cursor-pointer overflow-hidden"
              >
                {/* Product Thumbnail */}
                <div className="relative h-48 bg-stone-50 overflow-hidden border-b border-stone-100">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1">
                    {item.has_custom_price && (
                      <span className="px-2 py-0.5 rounded bg-emerald-800 text-white text-[10px] font-mono font-medium shadow-subtle flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Store Price</span>
                      </span>
                    )}
                    {item.is_customized && !item.has_custom_price && (
                      <span className="px-2 py-0.5 rounded bg-stone-900 text-white text-[10px] font-mono font-medium shadow-subtle">
                        Store Custom
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-semibold ${
                        item.in_stock
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {item.in_stock ? `${item.stock} left` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {item.category && (
                      <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-xs font-bold text-stone-900 mt-1 line-clamp-2 group-hover:text-emerald-800 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description || 'Quality product available exclusively at this shop.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold font-mono text-stone-900">
                        ${Number(item.price).toFixed(2)}
                      </div>
                      {item.has_custom_price && item.original_base_price !== Number(item.price) && (
                        <div className="text-[10px] font-mono text-stone-400 line-through">
                          Wholesale: ${item.original_base_price.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, item, 1)}
                      disabled={!item.in_stock}
                      className={`p-2 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                        addedItemEffect === item.shop_product_id
                          ? 'bg-emerald-800 text-white scale-105'
                          : item.in_stock
                          ? 'bg-stone-900 hover:bg-stone-800 text-white shadow-subtle active:scale-95'
                          : 'bg-stone-100 text-stone-400 cursor-not-allowed'
                      }`}
                      title={item.in_stock ? 'Add to cart' : 'Out of stock'}
                    >
                      {addedItemEffect === item.shop_product_id ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : (
                        <ShoppingBag className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.name || 'Product Details'}
        maxWidth="max-w-2xl"
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden bg-stone-100 h-64 sm:h-72 border border-stone-200">
              <img
                src={selectedProduct.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600'}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600';
                }}
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-stone-100 text-stone-700 border border-stone-200">
                    {selectedProduct.category || 'General'}
                  </span>
                  {selectedProduct.sku && (
                    <span className="text-[10px] font-mono text-stone-400">SKU: {selectedProduct.sku}</span>
                  )}
                </div>

                <h2 className="text-base font-bold text-stone-900 mb-1.5">{selectedProduct.name}</h2>

                <div className="flex items-baseline space-x-2.5 mb-3">
                  <span className="text-xl font-bold font-mono text-emerald-800">
                    ${Number(selectedProduct.price).toFixed(2)}
                  </span>
                  {selectedProduct.has_custom_price && (
                    <span className="text-xs font-mono text-stone-400 line-through">
                      Wholesale: ${selectedProduct.original_base_price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-stone-600 space-y-1 mb-4">
                  <h4 className="font-semibold text-stone-900">Description:</h4>
                  <p className="leading-relaxed text-[11px] text-stone-500">
                    {selectedProduct.description || 'No additional details provided by the shop owner.'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-stone-500 mb-4 pb-3 border-b border-stone-100">
                  <span>Merchant:</span>
                  <span className="font-bold text-stone-900">{shop.name}</span>
                  <span>•</span>
                  <span>Stock:</span>
                  <span className={selectedProduct.in_stock ? 'text-emerald-700 font-bold font-mono' : 'text-rose-600 font-bold font-mono'}>
                    {selectedProduct.stock} left
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xs font-semibold text-stone-700">Quantity:</span>
                  <div className="flex items-center space-x-1 border border-stone-200 rounded-lg p-0.5 bg-stone-50">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="w-6 h-6 rounded bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-xs text-stone-900 w-8 text-center">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(Math.min(selectedProduct.stock || 99, modalQuantity + 1))}
                      className="w-6 h-6 rounded bg-white border border-stone-200 flex items-center justify-center text-stone-700 hover:bg-stone-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, selectedProduct, modalQuantity)}
                  disabled={!selectedProduct.in_stock}
                  className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:opacity-50 text-white font-medium text-xs transition-colors flex items-center justify-center space-x-2 shadow-subtle active:scale-[0.99]"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>
                    Add to Cart • ${(Number(selectedProduct.price) * modalQuantity).toFixed(2)}
                  </span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
