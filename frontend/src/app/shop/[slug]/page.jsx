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
  Plus,
  Minus,
} from 'lucide-react';
import { useDebounce } from '../../../hooks/useDebounce';
import { useShopDetailQuery, useShopProductsQuery } from '../../../hooks/useShops';
import { useCart } from '../../../context/CartContext';
import Modal from '../../../components/common/Modal';

export default function ShopStorefrontPage() {
  const params = useParams();
  const slug = params?.slug;

  const { addToCart } = useCart();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('');
  const debouncedSearch = useDebounce(search, 250);

  // Selected product modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [addedItemEffect, setAddedItemEffect] = useState(null);

  // Clean custom hooks for data fetching
  const {
    data: shop,
    isLoading: loadingShop,
    isError: shopError,
  } = useShopDetailQuery(slug);

  const {
    data: products = [],
    isLoading: loadingProducts,
  } = useShopProductsQuery(slug, {
    search: debouncedSearch,
    category: selectedCategory,
    sort,
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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center bg-slate-50">
        <Store className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Storefront Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          The requested store does not exist or has been temporarily suspended.
        </p>
        <Link
          href="/"
                  className="inline-flex items-center space-x-2 mt-5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Browse All Stores</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-16 bg-slate-50">
      <section className="bg-white border-b border-slate-200">
        <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-slate-100">
          <img
            src={shop.banner_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400'}
            alt={shop.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400';
            }}
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <img
                src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}
                alt={shop.name}
                className="w-16 h-16 rounded-lg object-cover border border-slate-200 bg-white flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200';
                }}
              />
              <div>
                <p className="text-xs font-semibold text-blue-700 mb-1">Independent store</p>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">{shop.name}</h1>
                <p className="text-sm text-slate-600 mt-1 max-w-2xl line-clamp-2">
                  {shop.description || 'Welcome to our shop! Browse our curated collection of verified products.'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
              {shop.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>{shop.phone}</span>
                </div>
              )}
              {shop.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <span>{shop.email}</span>
                </div>
              )}
              {shop.address && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-400" /><span>{shop.address}</span></div>}
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="flex items-center justify-between mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-slate-200 text-sm font-medium text-slate-700 hover:text-blue-700 hover:bg-slate-50 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Stores</span>
          </Link>

          <div className="text-sm font-medium text-slate-600">
            <span className="font-semibold text-slate-900">{products.length}</span> products
          </div>
        </div>

        {/* Product filters */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between mb-8">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${shop.name}...`}
              className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-slate-900"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
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
              className="px-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
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
              <div key={n} className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 animate-pulse shadow-sm">
                <div className="aspect-[4/3] bg-slate-100 rounded-lg" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-slate-200 shadow-sm">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <h3 className="text-base font-semibold text-slate-900">No products found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
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
                className="group bg-white rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col cursor-pointer overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                tabIndex={0}
                role="button"
                aria-label={`View details for ${item.name}`}
              >
                {/* Product Thumbnail with fixed aspect ratio */}
                <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
                    }}
                  />

                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2.5 py-1 rounded-md text-xs font-medium ${
                        !item.in_stock
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : item.stock <= 5
                          ? 'bg-amber-50 text-amber-800 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {!item.in_stock ? 'Out of Stock' : item.stock <= 5 ? `Only ${item.stock} left` : 'In Stock'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {item.category && (
                      <span className="text-xs font-medium text-blue-700">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-base font-semibold text-slate-900 mt-1 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.description || 'Quality product available exclusively at this shop.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-lg font-bold text-slate-900">
                        ${Number(item.price).toFixed(2)}
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, item, 1)}
                      disabled={!item.in_stock}
                      className={`px-3.5 py-2 rounded-lg text-sm font-semibold flex items-center space-x-1.5 transition-colors ${
                        addedItemEffect === item.shop_product_id
                          ? 'bg-emerald-600 text-white scale-105'
                          : item.in_stock
                          ? 'bg-blue-600 hover:bg-blue-700 text-white active:scale-95 focus-visible:ring-2 focus-visible:ring-blue-500'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      aria-label={item.in_stock ? `Add ${item.name} to cart` : 'Out of stock'}
                    >
                      {addedItemEffect === item.shop_product_id ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Added</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </>
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
            <div className="rounded-xl overflow-hidden bg-slate-100 h-64 sm:h-72 border border-slate-200">
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
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                    {selectedProduct.category || 'General'}
                  </span>
                  {selectedProduct.sku && (
                    <span className="text-[10px] font-mono text-slate-400">SKU: {selectedProduct.sku}</span>
                  )}
                </div>

                <h2 className="text-base font-bold text-slate-900 mb-1.5">{selectedProduct.name}</h2>

                <div className="flex items-baseline space-x-2.5 mb-3">
                  <span className="text-xl font-bold text-blue-700">
                    ${Number(selectedProduct.price).toFixed(2)}
                  </span>
                </div>

                <div className="text-xs text-slate-600 space-y-1 mb-4">
                  <h4 className="font-semibold text-slate-900">Description:</h4>
                  <p className="leading-relaxed text-[11px] text-slate-500">
                    {selectedProduct.description || 'No additional details provided by the shop owner.'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
                  <span>Merchant:</span>
                  <span className="font-bold text-slate-900">{shop.name}</span>
                  <span>•</span>
                  <span>Stock:</span>
                  <span className={selectedProduct.in_stock ? 'text-emerald-700 font-semibold' : 'text-rose-600 font-semibold'}>
                    {selectedProduct.stock} left
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div>
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                  <div className="flex items-center space-x-1 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-xs text-slate-900 w-8 text-center">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(Math.min(selectedProduct.stock || 99, modalQuantity + 1))}
                      className="w-6 h-6 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, selectedProduct, modalQuantity)}
                  disabled={!selectedProduct.in_stock}
                  className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2"
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
