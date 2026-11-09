'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageBanner from '../../components/common/PageBanner';
import FeaturesBar from '../../components/common/FeaturesBar';
import ProductFilterBar from '../../components/product/ProductFilterBar';
import ProductGrid from '../../components/product/ProductGrid';
import { useAllProductsQuery, useShopsQuery, useCategoriesQuery } from '../../hooks/useShops';
import { useDebounce } from '../../hooks/useDebounce';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialShop = searchParams.get('shop') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeShop, setActiveShop] = useState(initialShop);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showCount, setShowCount] = useState(16);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Fetch shops for store filter from backend
  const { data: shops = [] } = useShopsQuery();

  // Fetch dynamic categories from Laravel backend
  const { data: rawCategories = [] } = useCategoriesQuery();
  const categoriesList = ['All', ...rawCategories.map((c) => c.name)];
  const {
    data: apiResponse,
    isLoading,
    isError,
    refetch,
  } = useAllProductsQuery({
    search: debouncedSearch,
    category: activeCategory,
    shop_id: activeShop || undefined,
    sort: sortBy,
    page,
    per_page: showCount,
  });

  const displayedProducts = apiResponse?.data || [];
  const totalResults = apiResponse?.total ?? 0;

  return (
    <div className="furniro-shop-page">
      {/* 1. Header Banner */}
      <PageBanner title="Shop" breadcrumb={[{ label: 'Shop' }]} />

      {/* 2. Modular Filter & Controls Bar */}
      <ProductFilterBar
        totalResults={totalResults}
        showCount={showCount}
        onShowCountChange={setShowCount}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat);
          setPage(1);
        }}
        categories={categoriesList}
        search={search}
        onSearchChange={setSearch}
        shops={shops}
        activeShop={activeShop}
        onShopChange={(shopId) => {
          setActiveShop(shopId);
          setPage(1);
        }}
      />

      {/* 3. Products Grid */}
      <main className="section-container shop-grid-section">
        <ProductGrid
          products={displayedProducts}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />

        {/* 4. Pagination */}
        {totalResults > showCount && (
          <div className="furniro-pagination" aria-label="Pagination">
            {[1, 2, 3].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setPage(num)}
                className={`pagination-btn ${page === num ? 'active' : ''}`}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setPage((prev) => Math.min(3, prev + 1))}
              className="pagination-btn pagination-next"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* 5. Features Bar */}
      <FeaturesBar />
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading catalog...</div>}>
      <ShopContent />
    </Suspense>
  );
}
