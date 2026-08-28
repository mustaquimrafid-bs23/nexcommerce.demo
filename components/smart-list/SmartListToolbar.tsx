'use client';

import React, { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { motion } from 'motion/react';

export interface SmartListCategoryTab {
  id: string;
  label: string;
  count: number;
}

interface SmartListToolbarProps {
  categories: SmartListCategoryTab[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  totalCount: number;
  inStockCount: number;
  selectedCount: number;
  isAllSelected: boolean;
  onToggleSelectAll: () => void;
  estimatedTotalFormatted: string;
  onAddAllToBag: () => void;
  isAddingAll?: boolean;
}

export function SmartListToolbar({
  categories,
  selectedCategory,
  onSelectCategory,
  totalCount,
  inStockCount,
  selectedCount,
  isAllSelected,
  onToggleSelectAll,
  estimatedTotalFormatted,
  onAddAllToBag,
  isAddingAll = false,
}: SmartListToolbarProps) {
  const [progressWidth, setProgressWidth] = useState(0);

  const handleAddAllClick = () => {
    setProgressWidth(100);
    onAddAllToBag();
    setTimeout(() => {
      setProgressWidth(0);
    }, 1200);
  };

  return (
    <div className="space-y-5 mb-8">
      {/* Upper Stats & Action Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl bg-surface-navy/70 border border-white/10 backdrop-blur-xl shadow-xl">
        {/* Left: Select All & Stats */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Select All Toggle */}
          <button
            type="button"
            onClick={onToggleSelectAll}
            className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer border ${
              isAllSelected
                ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/40 shadow-[0_0_15px_rgba(61,224,255,0.15)]'
                : 'bg-white/[0.04] text-white/70 border-white/15 hover:border-white/35 hover:text-white'
            }`}
            aria-pressed={isAllSelected}
            aria-label={`Select all ${inStockCount} available items`}
          >
            <span className="flex items-center justify-center w-4 h-4 rounded-full border border-current text-[10px]">
              {isAllSelected ? '●' : '○'}
            </span>
            <span>
              SELECT ALL ({inStockCount})
            </span>
          </button>

          <div className="hidden sm:block h-6 w-px bg-white/10" aria-hidden="true" />

          {/* Recommended Items Stat */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/40">
              RECOMMENDED ITEMS
            </span>
            <span className="text-base sm:text-lg font-bold text-white tracking-tight">
              {totalCount} Items
            </span>
          </div>

          <div className="hidden sm:block h-6 w-px bg-white/10" aria-hidden="true" />

          {/* Estimated Total Stat */}
          <div className="flex flex-col">
            <span className="text-[10px] font-semibold tracking-[0.14em] uppercase text-white/40">
              ESTIMATED TOTAL
            </span>
            <span className="text-base sm:text-lg font-bold text-white tabular-nums tracking-tight">
              {estimatedTotalFormatted}
            </span>
          </div>
        </div>

        {/* Right: Add All To Bag CTA with 120fps progress indicator */}
        <div className="relative flex-shrink-0">
          <button
            type="button"
            onClick={handleAddAllClick}
            disabled={isAddingAll || inStockCount === 0}
            className="w-full sm:w-auto relative overflow-hidden inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white text-obsidian-950 hover:bg-neutral-100 font-semibold text-xs tracking-wider uppercase transition-all duration-200 shadow-lg shadow-white/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
          >
            {/* Progress Fill Indicator */}
            {progressWidth > 0 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 bg-accent-cyan/30 origin-left pointer-events-none"
              />
            )}
            <ShoppingBag className="w-4 h-4 text-obsidian-950" />
            <span>ADD ALL TO BAG</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills Bar */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
        role="tablist"
        aria-label="Filter by Category"
      >
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              role="tab"
              aria-selected={isActive}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onSelectCategory(cat.id)}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer whitespace-nowrap flex-shrink-0 border ${
                isActive
                  ? 'bg-accent-cyan/15 text-accent-cyan border-accent-cyan/50 shadow-[0_0_20px_rgba(61,224,255,0.2)]'
                  : 'bg-surface-navy/50 text-white/60 border-white/10 hover:border-white/25 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[11px] ${isActive ? 'text-accent-cyan' : 'text-white/40'}`}>
                ({cat.count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
