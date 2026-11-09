'use client';

import React from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({
  products = [],
  isLoading = false,
  isError = false,
  viewMode = 'grid',
  onRetry,
}) {
  if (isLoading) {
    return (
      <div className="furniro-products-grid">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="furniro-product-card animate-pulse bg-slate-100">
            <div className="product-card-media bg-slate-200" />
            <div className="p-4 space-y-3">
              <div className="h-5 bg-slate-200 rounded w-3/4" />
              <div className="h-4 bg-slate-200 rounded w-1/2" />
              <div className="h-5 bg-slate-200 rounded w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="shop-no-results text-center py-16">
        <h3 className="text-xl font-semibold text-slate-800">Unable to load products</h3>
        <p className="text-slate-500 mt-2">Please check your connection and try again.</p>
        {onRetry && (
          <button onClick={onRetry} className="furniro-outline-btn mt-6">
            Try again
          </button>
        )}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="shop-no-results text-center py-16">
        <h3 className="text-xl font-semibold text-slate-800">No products found</h3>
        <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
      </div>
    );
  }

  return (
    <div className={`furniro-products-grid ${viewMode === 'list' ? 'view-list' : ''}`}>
      {products.map((prod) => (
        <ProductCard key={prod.shop_product_id || prod.id} product={prod} />
      ))}
    </div>
  );
}
