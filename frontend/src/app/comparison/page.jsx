'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import PageBanner from '../../components/common/PageBanner';
import FeaturesBar from '../../components/common/FeaturesBar';
import { Star, ChevronDown, Store } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAllProductsQuery } from '../../hooks/useShops';
import { toast } from 'sonner';

export default function ComparisonPage() {
  const { addToCart } = useCart();

  // Fetch real products across active shops from Laravel backend API
  const { data: apiResponse, isLoading, isError, refetch } = useAllProductsQuery({ per_page: 50 });
  const products = apiResponse?.data || [];

  const [product1, setProduct1] = useState(null);
  const [product2, setProduct2] = useState(null);

  useEffect(() => {
    if (products.length >= 2 && !product1 && !product2) {
      setProduct1(products[0]);
      setProduct2(products[1]);
    } else if (products.length === 1 && !product1) {
      setProduct1(products[0]);
    }
  }, [products, product1, product2]);

  const formatPrice = (val) => {
    return `Rp ${Number(val).toLocaleString('id-ID')}`;
  };

  const handleAdd = (prod) => {
    if (!prod) return;
    const shop = {
      id: prod.shop_id || 1,
      name: prod.shop_name || 'Furniro Flagship',
      slug: prod.shop_slug || 'furniro',
    };
    const cartItem = {
      shop_product_id: prod.shop_product_id,
      product_id: prod.product_id,
      name: prod.name,
      price: prod.price,
      thumbnail: prod.thumbnail,
      stock: prod.stock ?? 10,
    };
    addToCart(shop, cartItem, 1);
    toast.success(`Added ${prod.name} to cart!`);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isError || products.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Products Available for Comparison</h2>
        <p className="text-slate-500 max-w-md mt-2 text-sm">
          Please ensure products are listed in active merchant stores.
        </p>
        <Link
          href="/shop"
          className="mt-6 px-6 py-2.5 rounded-full bg-[#B88E2F] text-white text-xs font-semibold hover:bg-[#967125] transition-colors"
        >
          Explore Shop
        </Link>
      </div>
    );
  }

  const p1 = product1 || products[0];
  const p2 = product2 || products[1] || products[0];

  return (
    <div className="furniro-comparison-page bg-white">
      <PageBanner
        title="Product Comparison"
        breadcrumb={[{ label: 'Comparison' }]}
      />

      <main className="section-container comparison-main-section py-16">
        {/* Top Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start pb-12 border-b border-[#D9D9D9]">
          <div className="pr-4">
            <h2 className="text-2xl sm:text-3xl font-medium text-black leading-tight">
              Go to Product page for more Products
            </h2>
            <Link
              href="/shop"
              className="mt-6 inline-block text-base font-medium text-[#727272] border-b border-[#727272] pb-1 hover:text-[#B88E2F] hover:border-[#B88E2F] transition-colors"
            >
              View More
            </Link>
          </div>

          {/* Product 1 */}
          <div className="comparison-card">
            <div className="h-44 rounded-xl bg-[#FAF3EA] overflow-hidden p-3 flex items-center justify-center mb-4">
              <img
                src={p1.thumbnail}
                alt={p1.name}
                className="max-h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-medium text-black">{p1.name}</h3>
            <p className="text-xs text-[#B88E2F] font-semibold mt-0.5">{p1.shop_name}</p>
            <p className="text-lg font-medium text-black mt-1">
              {formatPrice(p1.price)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-semibold">4.7</span>
              <div className="flex text-[#FFC700]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="#FFC700" color="#FFC700" />
                ))}
              </div>
              <span className="text-xs text-[#9F9F9F] border-l border-[#9F9F9F] pl-2">
                204 Reviews
              </span>
            </div>
          </div>

          {/* Product 2 */}
          <div className="comparison-card">
            <div className="h-44 rounded-xl bg-[#FAF3EA] overflow-hidden p-3 flex items-center justify-center mb-4">
              <img
                src={p2.thumbnail}
                alt={p2.name}
                className="max-h-full object-contain"
              />
            </div>
            <h3 className="text-xl font-medium text-black">{p2.name}</h3>
            <p className="text-xs text-[#B88E2F] font-semibold mt-0.5">{p2.shop_name}</p>
            <p className="text-lg font-medium text-black mt-1">
              {formatPrice(p2.price)}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm font-semibold">4.5</span>
              <div className="flex text-[#FFC700]">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} size={14} fill="#FFC700" color="#FFC700" />
                ))}
              </div>
              <span className="text-xs text-[#9F9F9F] border-l border-[#9F9F9F] pl-2">
                145 Reviews
              </span>
            </div>
          </div>

          {/* Add a Product selector */}
          <div className="p-4 bg-[#FAF3EA]/50 rounded-2xl border border-dashed border-[#B88E2F]/40 flex flex-col justify-center h-full">
            <h3 className="text-xl font-semibold text-black mb-3">Add A Product</h3>
            <label htmlFor="compare-prod-select" className="sr-only">Choose a product</label>
            <div className="relative">
              <select
                id="compare-prod-select"
                onChange={(e) => {
                  const found = products.find((p) => String(p.shop_product_id) === e.target.value);
                  if (found) setProduct2(found);
                }}
                className="w-full bg-[#B88E2F] text-white px-4 py-3 rounded-lg font-semibold text-sm appearance-none outline-none cursor-pointer"
                value={p2?.shop_product_id || ''}
              >
                {products.map((p) => (
                  <option key={p.shop_product_id} value={p.shop_product_id}>
                    {p.name} ({formatPrice(p.price)})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-white absolute right-3 top-3.5 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Detailed Attributes Spec Table */}
        <div className="comparison-table-wrapper mt-10 space-y-10 text-sm">
          {/* General Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-black">General</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-slate-100">
              <span className="text-[#9F9F9F]">Merchant Store</span>
              <span className="text-black font-medium">{p1.shop_name}</span>
              <span className="text-black font-medium">{p2.shop_name}</span>
              <span />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-slate-100">
              <span className="text-[#9F9F9F]">Category</span>
              <span className="text-black">{p1.category || 'Interior Design'}</span>
              <span className="text-black">{p2.category || 'Interior Design'}</span>
              <span />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-slate-100">
              <span className="text-[#9F9F9F]">SKU</span>
              <span className="text-black">{p1.sku || 'N/A'}</span>
              <span className="text-black">{p2.sku || 'N/A'}</span>
              <span />
            </div>
          </div>

          {/* Product Section */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-black">Specifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-slate-100">
              <span className="text-[#9F9F9F]">Description</span>
              <span className="text-black">{p1.description || 'Premium craftsmanship'}</span>
              <span className="text-black">{p2.description || 'Premium craftsmanship'}</span>
              <span />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-2 border-b border-slate-100">
              <span className="text-[#9F9F9F]">In Stock</span>
              <span className="text-black">{p1.in_stock ? `Yes (${p1.stock} available)` : 'Out of stock'}</span>
              <span className="text-black">{p2.in_stock ? `Yes (${p2.stock} available)` : 'Out of stock'}</span>
              <span />
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-6 items-center">
              <span />
              <div>
                <button
                  type="button"
                  onClick={() => handleAdd(p1)}
                  className="px-8 py-3 bg-[#B88E2F] text-white font-medium rounded-lg hover:bg-[#967125] transition-colors"
                >
                  Add To Cart
                </button>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => handleAdd(p2)}
                  className="px-8 py-3 bg-[#B88E2F] text-white font-medium rounded-lg hover:bg-[#967125] transition-colors"
                >
                  Add To Cart
                </button>
              </div>
              <span />
            </div>
          </div>
        </div>
      </main>

      <FeaturesBar />
    </div>
  );
}
