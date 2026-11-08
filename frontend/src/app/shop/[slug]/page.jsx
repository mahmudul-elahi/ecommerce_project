'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
} from 'lucide-react';
import api from '../../../api/client';
import { useCart } from '../../../context/CartContext';
import { useToast } from '../../../context/ToastContext';
import Modal from '../../../components/common/Modal';

export default function ShopStorefrontPage() {
  const params = useParams();
  const slug = params?.slug;

  const { addToCart } = useCart();
  const { addToast } = useToast();

  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loadingShop, setLoadingShop] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('');

  // Selected product modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [addedItemEffect, setAddedItemEffect] = useState(null);

  // Fetch shop details
  useEffect(() => {
    if (!slug) return;
    const fetchShop = async () => {
      try {
        setLoadingShop(true);
        const res = await api.get(`/customer/shops/${slug}`);
        setShop(res.data);
      } catch (err) {
        console.error('Failed to load shop', err);
        addToast('Shop not found or inactive', 'error');
      } finally {
        setLoadingShop(false);
      }
    };
    fetchShop();
  }, [slug]);

  // Fetch products assigned to this shop
  const fetchProducts = async () => {
    if (!slug) return;
    try {
      setLoadingProducts(true);
      const res = await api.get(`/customer/shops/${slug}/products`, {
        params: {
          search: search || undefined,
          category: selectedCategory || undefined,
          sort: sort || undefined,
        },
      });
      setProducts(res.data.data || []);
    } catch (err) {
      console.error('Failed to load shop products', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    if (!slug) return;
    const timer = setTimeout(() => {
      fetchProducts();
    }, 250);
    return () => clearTimeout(timer);
  }, [slug, search, selectedCategory, sort]);

  const handleAddToCart = (e, product, qty = 1) => {
    e.stopPropagation();
    if (!product.in_stock) {
      addToast('Sorry, this product is currently out of stock', 'error');
      return;
    }
    const success = addToCart(shop, product, qty);
    if (success) {
      setAddedItemEffect(product.shop_product_id);
      setTimeout(() => setAddedItemEffect(null), 1200);
      addToast(`Added "${product.name}" to cart`, 'success');
      if (selectedProduct) setSelectedProduct(null);
    }
  };

  const categories = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));

  if (loadingShop) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Store className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-slate-800">Shop Not Found</h2>
        <p className="text-sm text-slate-500 mt-2">The shop you are looking for does not exist or is inactive.</p>
        <Link
          href="/"
          className="inline-flex items-center space-x-2 mt-6 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse All Shops</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Shop Banner Header */}
      <div className="relative bg-slate-900 text-white">
        <div className="relative h-60 sm:h-72 w-full overflow-hidden">
          <img
            src={shop.banner_url || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400'}
            alt={shop.name}
            className="w-full h-full object-cover opacity-60"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>

        {/* Shop Info Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-20 pb-8">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <img
                src={shop.logo_url || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200'}
                alt={shop.name}
                className="w-24 h-24 sm:w-28 sm:resize-y rounded-2xl object-cover border-4 border-white shadow-xl bg-white flex-shrink-0"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=200';
                }}
              />
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold backdrop-blur-md mb-2 border border-emerald-500/30">
                  <Store className="w-3 h-3" />
                  <span>Independent Verified Store</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{shop.name}</h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl line-clamp-2">
                  {shop.description || 'Welcome to our shop! Browse our assigned product listings below.'}
                </p>
              </div>
            </div>

            {/* Shop Contact Badges */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              {shop.phone && (
                <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{shop.phone}</span>
                </div>
              )}
              {shop.email && (
                <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{shop.email}</span>
                </div>
              )}
              {shop.address && (
                <div className="flex items-center space-x-1.5 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{shop.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Stores</span>
          </Link>

          <div className="text-xs text-slate-400">
            Showing <span className="font-bold text-slate-700">{products.length}</span> shop-assigned items
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between mb-8">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products in this store..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="flex items-center space-x-3 w-full md:w-auto">
            {categories.length > 0 && (
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
              className="px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-xl" />
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No products available in this store</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              This store hasn't assigned any matching products yet. As per platform rules, unassigned catalog products are not shown to customers.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((item) => (
              <div
                key={item.shop_product_id}
                onClick={() => {
                  setSelectedProduct(item);
                  setModalQuantity(1);
                }}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col cursor-pointer"
              >
                {/* Product Thumbnail */}
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  <img
                    src={item.thumbnail || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500'}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500';
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {item.has_custom_price && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-sm flex items-center space-x-1">
                        <Sparkles className="w-2.5 h-2.5" />
                        <span>Store Special Price</span>
                      </span>
                    )}
                    {item.is_customized && !item.has_custom_price && (
                      <span className="px-2 py-0.5 rounded-full bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-medium shadow-sm">
                        Shop Exclusive
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm ${
                        item.in_stock
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {item.in_stock ? `${item.stock} in stock` : 'Out of Stock'}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    {item.category && (
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                        {item.category}
                      </span>
                    )}
                    <h3 className="text-sm font-bold text-slate-900 mt-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {item.description || 'Quality product available exclusively at this shop.'}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-base font-extrabold text-slate-900">
                        ${Number(item.price).toFixed(2)}
                      </div>
                      {item.has_custom_price && item.original_base_price !== Number(item.price) && (
                        <div className="text-[11px] text-slate-400 line-through">
                          Catalog: ${item.original_base_price.toFixed(2)}
                        </div>
                      )}
                    </div>

                    <button
                      onClick={(e) => handleAddToCart(e, item, 1)}
                      disabled={!item.in_stock}
                      className={`p-2 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                        addedItemEffect === item.shop_product_id
                          ? 'bg-emerald-700 text-white scale-110'
                          : item.in_stock
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                      title={item.in_stock ? 'Add to cart' : 'Out of stock'}
                    >
                      {addedItemEffect === item.shop_product_id ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <ShoppingBag className="w-4 h-4" />
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
        maxWidth="max-w-3xl"
      >
        {selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl overflow-hidden bg-slate-100 h-72 sm:h-80">
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
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                    {selectedProduct.category || 'General'}
                  </span>
                  {selectedProduct.sku && (
                    <span className="text-xs font-mono text-slate-400">SKU: {selectedProduct.sku}</span>
                  )}
                </div>

                <h2 className="text-xl font-bold text-slate-900 mb-2">{selectedProduct.name}</h2>

                <div className="flex items-baseline space-x-3 mb-4">
                  <span className="text-2xl font-extrabold text-emerald-700">
                    ${Number(selectedProduct.price).toFixed(2)}
                  </span>
                  {selectedProduct.has_custom_price && (
                    <span className="text-xs text-slate-400 line-through">
                      Catalog: ${selectedProduct.original_base_price.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="text-xs text-slate-600 space-y-2 mb-6">
                  <h4 className="font-semibold text-slate-800">Product Description:</h4>
                  <p className="leading-relaxed">
                    {selectedProduct.description || 'No additional details provided by the shop owner.'}
                  </p>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-500 mb-4">
                  <span>Store:</span>
                  <span className="font-bold text-slate-900">{shop.name}</span>
                  <span>•</span>
                  <span>Stock:</span>
                  <span className={selectedProduct.in_stock ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                    {selectedProduct.stock} units
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="text-xs font-semibold text-slate-700">Quantity:</div>
                  <div className="flex items-center space-x-2 border border-slate-200 rounded-lg px-3 py-1 text-sm">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="font-bold text-slate-500 hover:text-slate-900"
                    >
                      -
                    </button>
                    <span className="font-semibold text-slate-900 w-8 text-center">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(Math.min(selectedProduct.stock || 99, modalQuantity + 1))}
                      className="font-bold text-slate-500 hover:text-slate-900"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={(e) => handleAddToCart(e, selectedProduct, modalQuantity)}
                  disabled={!selectedProduct.in_stock}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm transition-colors flex items-center justify-center space-x-2 shadow-sm"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add {modalQuantity} to Cart • ${(Number(selectedProduct.price) * modalQuantity).toFixed(2)}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
