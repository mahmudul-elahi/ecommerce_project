'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Search,
  X,
  Store,
  Layers,
  RotateCcw,
} from 'lucide-react';

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'name', label: 'Product Name' },
];

export default function ProductFilterBar({
  totalResults = 0,
  showCount = 16,
  onShowCountChange,
  sortBy = 'default',
  onSortByChange,
  activeCategory = 'All',
  onCategoryChange,
  categories = ['All', 'Dining', 'Living', 'Bedroom'],
  search = '',
  onSearchChange,
  shops = [],
  activeShop = '',
  onShopChange,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  // Close custom sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentSortLabel =
    sortOptions.find((opt) => opt.value === sortBy)?.label || 'Default';

  // Active filters count
  const activeFiltersCount =
    (activeCategory !== 'All' ? 1 : 0) +
    (activeShop ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const handleResetFilters = () => {
    if (onCategoryChange) onCategoryChange('All');
    if (onShopChange) onShopChange('');
    if (onSearchChange) onSearchChange('');
  };

  return (
    <section className="shop-filter-bar" aria-label="Catalog Filters">
      <div className="filter-bar-container">
        {/* Left Side: Filter button & Results count (Grid view only) */}
        <div className="filter-left">
          <button
            type="button"
            onClick={() => setFilterOpen(!filterOpen)}
            className={`filter-toggle-btn group transition-all ${
              filterOpen || activeFiltersCount > 0 ? 'text-[#B88E2F]' : 'text-black'
            }`}
            aria-expanded={filterOpen}
            aria-label="Toggle filters"
          >
            <img
              src="/images/furniro/iconFilter.svg"
              alt=""
              className="w-5 h-5 transition-transform group-hover:scale-110"
            />
            <span className="font-medium text-lg">Filter</span>
            {activeFiltersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#B88E2F] text-white text-[11px] font-bold flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
            <ChevronDown
              className={`w-4 h-4 ml-0.5 text-slate-500 transition-transform duration-200 ${
                filterOpen ? 'rotate-180 text-[#B88E2F]' : ''
              }`}
            />
          </button>

          <div className="filter-divider" />

          <span className="results-count-text">
            Showing 1–{Math.min(showCount, totalResults)} of {totalResults} results
          </span>
        </div>

        {/* Right Side: Show count & Custom Sort Dropdown */}
        <div className="filter-right">
          <div className="filter-field">
            <label htmlFor="catalog-show-count">Show</label>
            <input
              id="catalog-show-count"
              type="number"
              min="1"
              max="100"
              value={showCount}
              onChange={(e) =>
                onShowCountChange(Math.max(1, Number(e.target.value) || 1))
              }
              className="control-number-input"
            />
          </div>

          <div className="filter-field relative" ref={sortRef}>
            <label id="sort-by-label">Short by</label>

            {/* Custom Dropdown Trigger */}
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isSortOpen}
              aria-labelledby="sort-by-label"
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="custom-sort-trigger"
            >
              <span className="truncate">{currentSortLabel}</span>
              <ChevronDown
                className={`w-4 h-4 text-[#9F9F9F] transition-transform duration-200 flex-shrink-0 ${
                  isSortOpen ? 'rotate-180 text-[#B88E2F]' : ''
                }`}
              />
            </button>

            {/* Custom Floating Options Menu */}
            {isSortOpen && (
              <div
                className="custom-sort-menu animate-in fade-in zoom-in-95 duration-150"
                role="listbox"
              >
                {sortOptions.map((opt) => {
                  const isSelected = sortBy === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSortByChange(opt.value);
                        setIsSortOpen(false);
                      }}
                      className={`custom-sort-item ${
                        isSelected ? 'active' : ''
                      }`}
                    >
                      <span>{opt.label}</span>
                      {isSelected && (
                        <Check className="w-4 h-4 text-[#B88E2F] flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Matching Furniro UI Filter Deck */}
      {filterOpen && (
        <div className="filter-deck-panel animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="filter-deck-grid">
            {/* 1. Filter by Store */}
            {shops && shops.length > 0 && onShopChange && (
              <div className="filter-deck-block">
                <div className="filter-block-header">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-[#B88E2F]" />
                    <span className="filter-block-title">Filter by Store</span>
                  </div>
                  {activeShop && (
                    <span className="filter-block-badge">1 store active</span>
                  )}
                </div>

                <div className="filter-chips-row">
                  <button
                    type="button"
                    onClick={() => onShopChange('')}
                    className={`filter-chip ${!activeShop ? 'active' : ''}`}
                  >
                    <span>All Stores</span>
                    <span className="chip-count">({shops.length})</span>
                  </button>

                  {shops.map((s) => {
                    const isSelected = activeShop === String(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => onShopChange(String(s.id))}
                        className={`filter-chip ${isSelected ? 'active' : ''}`}
                      >
                        <span className="truncate max-w-[200px]">{s.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 2. Filter by Category */}
            <div className="filter-deck-block">
              <div className="filter-block-header">
                <div className="flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#B88E2F]" />
                  <span className="filter-block-title">Categories</span>
                </div>
                {activeCategory !== 'All' && (
                  <span className="filter-block-badge">{activeCategory}</span>
                )}
              </div>

              <div className="filter-chips-row">
                {categories.map((cat) => {
                  const isSelected =
                    activeCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => onCategoryChange(cat)}
                      className={`filter-chip ${isSelected ? 'active' : ''}`}
                    >
                      <span>{cat}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 ml-1" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Search Bar & Clear Action */}
            <div className="filter-deck-bottom">
              <div className="filter-search-box">
                <Search className="w-4 h-4 text-[#B88E2F] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products by title, SKU, or keyword..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="filter-search-input"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="filter-search-clear"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="filter-reset-btn"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
