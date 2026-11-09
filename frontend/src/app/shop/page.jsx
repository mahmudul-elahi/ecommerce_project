'use client';

import { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PageBanner from '../../components/common/PageBanner';
import FeaturesBar from '../../components/common/FeaturesBar';
import ProductFilterBar from '../../components/product/ProductFilterBar';
import ProductGrid from '../../components/product/ProductGrid';
import { useAllProductsQuery, useShopsQuery } from '../../hooks/useShops';
import { useDebounce } from '../../hooks/useDebounce';
import { furniroProducts } from '../../data/furniroProducts';

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialShop = searchParams.get('shop') || '';

  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [activeShop, setActiveShop] = useState(initialShop);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [viewMode, setViewMode] = useState('grid');
  const [showCount, setShowCount] = useState(16);
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebounce(search, 300);

  // Fetch shops for store filter
  const { data: shops = [] } = useShopsQuery();

  // Fetch products assigned to shops from backend
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

  // Database products with seamless fallback to seeded Furniro items
  const backendProducts = apiResponse?.data;
  const totalResults = apiResponse?.total ?? (backendProducts ? backendProducts.length : furniroProducts.length);

  const displayedProducts = useMemo(() => {
    if (backendProducts && backendProducts.length > 0) {
      return backendProducts;
    }
    // Client-side fallback if backend API is not yet reachable
    return furniroProducts.filter((p) => {
      const matchCat =
        activeCategory === 'All' ||
        p.category.toLowerCase() === activeCategory.toLowerCase();
      const matchSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.subtitle.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [backendProducts, activeCategory, search]);

  const categoriesList = ['All', 'Dining', 'Living', 'Bedroom', 'Electronics', 'Apparel'];

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
        viewMode={viewMode}
        onViewModeChange={setViewMode}
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
          isLoading={isLoading && !displayedProducts.length}
          isError={isError && !displayedProducts.length}
          viewMode={viewMode}
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
