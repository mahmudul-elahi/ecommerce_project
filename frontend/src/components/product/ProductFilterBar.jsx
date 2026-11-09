'use client';

import React, { useState } from 'react';

export default function ProductFilterBar({
  totalResults = 0,
  showCount = 16,
  onShowCountChange,
  sortBy = 'default',
  onSortByChange,
  viewMode = 'grid',
  onViewModeChange,
  activeCategory = 'All',
  onCategoryChange,
  categories = ['All', 'Dining', 'Living', 'Bedroom', 'Electronics', 'Apparel'],
  search = '',
  onSearchChange,
  shops = [],
  activeShop = '',
  onShopChange,
}) {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  return (
    <section className="shop-filter-bar" aria-label="Catalog Filters">
      <div className="filter-bar-container">
        {/* Left Side: Filter button, View modes, Results count */}
        <div className="filter-left">
          <button
            type="button"
            onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
            className="filter-toggle-btn"
            aria-expanded={filterDrawerOpen}
            aria-label="Toggle filter drawer"
          >
            <img
              src="/images/furniro/iconFilter.svg"
              alt=""
              className="w-5 h-5"
            />
            <span className="font-medium text-black">Filter</span>
          </button>

          <div className="view-mode-buttons">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              aria-label="Grid layout"
            >
              <img
                src="/images/furniro/iconGrid.svg"
                alt=""
                className="w-5 h-5"
              />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
              aria-label="List layout"
            >
              <img
                src="/images/furniro/iconList.svg"
                alt=""
                className="w-5 h-5"
              />
            </button>
          </div>

          <div className="filter-divider" />

          <span className="results-count-text">
            Showing 1–{Math.min(showCount, totalResults)} of {totalResults} results
          </span>
        </div>

        {/* Right Side: Show count & Sort by */}
        <div className="filter-right">
          <div className="filter-field">
            <label htmlFor="catalog-show-count">Show</label>
            <input
              id="catalog-show-count"
              type="number"
              min="1"
              max="100"
              value={showCount}
              onChange={(e) => onShowCountChange(Math.max(1, Number(e.target.value) || 1))}
              className="control-number-input"
            />
          </div>

          <div className="filter-field">
            <label htmlFor="catalog-sort-select">Short by</label>
            <select
              id="catalog-sort-select"
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value)}
              className="control-select-input"
            >
              <option value="default">Default</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* Expandable Filter Drawer */}
      {filterDrawerOpen && (
        <div className="filter-category-tray animate-in fade-in duration-200">
          <div className="tray-inner">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full">
              <span className="tray-label">Categories:</span>
              <div className="tray-buttons">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => onCategoryChange(cat)}
                    className={`cat-pill ${
                      activeCategory.toLowerCase() === cat.toLowerCase()
                        ? 'active'
                        : ''
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {shops.length > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full mt-2">
                <span className="tray-label">Filter by Store:</span>
                <div className="tray-buttons">
                  <button
                    type="button"
                    onClick={() => onShopChange('')}
                    className={`cat-pill ${!activeShop ? 'active' : ''}`}
                  >
                    All Stores
                  </button>
                  {shops.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => onShopChange(String(s.id))}
                      className={`cat-pill ${activeShop === String(s.id) ? 'active' : ''}`}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="tray-search mt-2 w-full flex items-center justify-between">
              <input
                type="text"
                placeholder="Search products by title, sku, or description..."
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
                className="tray-search-input flex-1 max-w-md"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="tray-clear-btn ml-3"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
