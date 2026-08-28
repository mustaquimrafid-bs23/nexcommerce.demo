'use client';

import React from 'react';

export interface CategoryOption {
  id: string;
  label: string;
  isNew?: boolean;
}

export const CATEGORIES: CategoryOption[] = [
  { id: 'all', label: 'ALL' },
  { id: 'new', label: 'NEW IN', isNew: true },
  { id: 'apparel', label: 'APPAREL' },
  { id: 'outerwear', label: 'OUTERWEAR' },
  { id: 'acoustics', label: 'ACOUSTICS' },
  { id: 'footwear', label: 'FOOTWEAR' },
  { id: 'accessories', label: 'ACCESSORIES' },
];

interface CategoryToolbarProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  sortBy: string;
  onSortChange: (sortValue: string) => void;
  totalCount: number;
}

export function CategoryToolbar({
  selectedCategory,
  onSelectCategory,
  sortBy,
  onSortChange,
  totalCount,
}: CategoryToolbarProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Product Count & Sort Toolbar */}
      <div className="plp-toolbar-row flex items-center justify-between pb-3.5 border-b border-white/10">
        <span className="plp-product-count text-[10px] font-semibold tracking-[0.16em] uppercase text-white/40" id="plpProductCount">
          {totalCount} {totalCount === 1 ? 'PIECE' : 'PIECES'} AVAILABLE
        </span>
        <div className="plp-sort-wrapper flex items-center gap-2">
          <label htmlFor="plpSortSelect" className="plp-sort-label text-[10px] font-semibold uppercase tracking-[0.14em] text-white/35 cursor-pointer">
            SORT BY
          </label>
          <select
            id="plpSortSelect"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="plp-sort-select h-8 px-2.5 pr-7 bg-white/[0.04] border border-white/15 rounded-sm text-xs font-medium text-white/80 focus:outline-none cursor-pointer"
            aria-label="Sort products"
          >
            <option value="recommended" className="bg-obsidian-950 text-white">
              Recommended
            </option>
            <option value="price-low" className="bg-obsidian-950 text-white">
              Price: Low to High
            </option>
            <option value="price-high" className="bg-obsidian-950 text-white">
              Price: High to Low
            </option>
          </select>
        </div>
      </div>

      {/* Category Filter Bar (Pills) */}
      <div
        className="plp-filter-bar flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
        role="tablist"
        aria-label="Filter by Category"
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectCategory(cat.id)}
              className={`plp-filter-pill ${cat.isNew ? 'plp-filter-pill--new' : ''} ${
                isActive ? 'active' : ''
              } inline-flex items-center px-3.5 py-1.5 rounded-sm text-[10px] sm:text-[11px] font-semibold tracking-[0.12em] uppercase transition-all duration-180 cursor-pointer whitespace-nowrap flex-shrink-0 border ${
                isActive
                  ? 'bg-white text-obsidian-950 border-white shadow-md'
                  : 'bg-transparent text-white/50 border-white/15 hover:border-white/35 hover:text-white'
              }`}
              data-category={cat.id}
            >
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
