'use client';

import React from 'react';
import MerchantCard from './MerchantCard';
import { Store, Search } from 'lucide-react';

export default function MerchantGrid({
  shops = [],
  isLoading = false,
  isError = false,
  search = '',
  onSearchChange,
  category = 'all',
  onCategoryChange,
  categories = [
    { id: 'all', label: 'All stores' },
    { id: 'furniture', label: 'Furniture & Living' },
    { id: 'tech', label: 'Audio & Tech' },
    { id: 'apparel', label: 'Apparel & Style' },
  ],
  onRetry,
}) {
  return (
    <section id="stores" className="shops-section section-container" aria-labelledby="merchant-stores-title">
      <h2 id="merchant-stores-title">Our Merchant Stores</h2>
      <p className="section-subtitle">
        Independent boutiques and specialized creators. Shop directly from dedicated merchants.
      </p>

      {/* Controls */}
      <div className="shop-controls">
        <div className="shop-search">
          <Search size={20} aria-hidden="true" />
          <input
            id="store-search-input"
            aria-label="Search stores"
            placeholder="Search stores by name, specialty, or location"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button type="button" onClick={() => onSearchChange('')}>
              Clear
            </button>
          )}
        </div>

        <div className="shop-filters" aria-label="Store categories">
          {categories.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={category === item.id}
              onClick={() => onCategoryChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <p className="shop-result-count" aria-live="polite">
        {isLoading
          ? 'Loading partner merchant stores…'
          : isError
          ? 'Stores are currently unavailable'
          : `${shops.length} ${shops.length === 1 ? 'store' : 'stores'} to explore`}
      </p>

      {/* Grid Content */}
      {isLoading ? (
        <div className="shop-grid">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="shop-skeleton animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <div className="shop-empty">
          <Store size={36} />
          <h3>We couldn’t load the merchant stores.</h3>
          <p>Please try again in a moment.</p>
          {onRetry && (
            <button className="outline-button" onClick={onRetry}>
              Try again
            </button>
          )}
        </div>
      ) : shops.length === 0 ? (
        <div className="shop-empty">
          <Store size={36} />
          <h3>No matching merchant stores</h3>
          <p>Try a different keyword or reset categories to view all stores.</p>
          <button
            className="outline-button"
            onClick={() => {
              onSearchChange('');
              onCategoryChange('all');
            }}
          >
            Reset filters
          </button>
        </div>
      ) : (
        <div className="shop-grid">
          {shops.map((shop) => (
            <MerchantCard key={shop.id} shop={shop} />
          ))}
        </div>
      )}
    </section>
  );
}
