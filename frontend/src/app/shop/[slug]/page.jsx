'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import MerchantHeader from '../../../components/merchant/MerchantHeader';
import ProductFilterBar from '../../../components/product/ProductFilterBar';
import ProductGrid from '../../../components/product/ProductGrid';
import FeaturesBar from '../../../components/common/FeaturesBar';
import { useShopDetailQuery, useShopProductsQuery, useCategoriesQuery } from '../../../hooks/useShops';
import { useDebounce } from '../../../hooks/useDebounce';
import { Store } from 'lucide-react';

export default function ShopStorefrontPage() {
  const params = useParams();
  const slug = params?.slug;

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [showCount, setShowCount] = useState(16);

  const debouncedSearch = useDebounce(search, 250);

  // Dynamic Categories from database
  const { data: dbCategories = [] } = useCategoriesQuery();
  const categories = ['All', ...dbCategories.map((c) => c.name)];
  const {
    data: shop,
    isLoading: loadingShop,
    isError: shopError,
    refetch: refetchShop,
  } = useShopDetailQuery(slug);

  // Fetch only products assigned to this shop (satisfies requirement)
  const {
    data: products = [],
    isLoading: loadingProducts,
    isError: productsError,
    refetch: refetchProducts,
  } = useShopProductsQuery(slug, {
    search: debouncedSearch,
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    sort: sortBy === 'price-low' ? 'price_asc' : sortBy === 'price-high' ? 'price_desc' : undefined,
  });

  if (loadingShop) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-[#B88E2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (shopError || !shop) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
          <Store className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Merchant Store Not Found</h2>
        <p className="text-slate-500 max-w-md mt-2 text-sm">
          We could not locate this merchant storefront. It may have been relocated or is currently inactive.
        </p>
        <Link
          href="/"
          className="mt-6 px-6 py-3 bg-[#B88E2F] text-white text-xs font-semibold hover:bg-[#967125] transition-colors rounded-none"
        >
          Explore All Stores
        </Link>
      </div>
    );
  }

  return (
    <div className="furniro-merchant-storefront">
      {/* 1. Modular Merchant Header */}
      <MerchantHeader shop={shop} />

      {/* 2. Modular Filter & Controls Bar */}
      <ProductFilterBar
        totalResults={products.length}
        showCount={showCount}
        onShowCountChange={setShowCount}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        activeCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        search={search}
        onSearchChange={setSearch}
      />

      {/* 3. Products Assigned to this Shop */}
      <main className="section-container shop-grid-section">
        <ProductGrid
          products={products.map((p) => ({
            ...p,
            shop_id: shop.id,
            shop_name: shop.name,
            shop_slug: shop.slug,
          }))}
          isLoading={loadingProducts}
          isError={productsError}
          onRetry={refetchProducts}
        />
      </main>

      {/* 4. Features Bar */}
      <FeaturesBar />
    </div>
  );
}
