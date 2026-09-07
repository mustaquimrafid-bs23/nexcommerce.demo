'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, X, Check } from 'lucide-react';
import { SmartListProduct } from '@/data/smartListProducts';

interface SmartListBatchDockProps {
  selectedProducts: SmartListProduct[];
  onClearSelection: () => void;
  onAddSelectedToBag: () => void;
}

export function SmartListBatchDock({
  selectedProducts,
  onClearSelection,
  onAddSelectedToBag,
}: SmartListBatchDockProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const selectedCount = selectedProducts.length;
  if (selectedCount === 0) return null;

  const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddClick = () => {
    setIsAdding(true);
    onAddSelectedToBag();
    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1500);
    }, 400);
  };

  return (
    <AnimatePresence>
      <motion.aside
        initial={{ y: 80, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 80, opacity: 0, scale: 0.95 }}
        transition={{ type: 'spring', damping: 24, stiffness: 260 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100%-32px)] max-w-2xl px-4 sm:px-6 py-3.5 rounded-2xl bg-obsidian-950/95 border border-white/20 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center justify-between gap-4"
        role="region"
        aria-label="Batch Actions Dock"
        aria-live="polite"
      >
        {/* Left: Count & Overlapping Product Avatars */}
        <div className="flex items-center gap-3 min-w-0">
          <span className="px-2.5 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan text-xs font-bold whitespace-nowrap">
            {selectedCount} selected
          </span>

          {/* Avatar Filmstrip Stack */}
          <div className="hidden sm:flex items-center -space-x-2 overflow-hidden py-0.5" aria-hidden="true">
            {selectedProducts.slice(0, 4).map((product) => (
              <div
                key={product.id}
                className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-obsidian-950 bg-obsidian-900 flex-shrink-0 shadow-md"
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
            ))}
            {selectedCount > 4 && (
              <div className="relative w-8 h-8 rounded-full border-2 border-obsidian-950 bg-surface-navy flex items-center justify-center text-[10px] font-bold text-white/80 shadow-md">
                +{selectedCount - 4}
              </div>
            )}
          </div>
        </div>

        {/* Center: Subtotal Valuation */}
        <div className="flex flex-col items-center sm:items-start flex-shrink-0">
          <span className="text-[9px] uppercase tracking-[0.14em] text-white/40 font-semibold">
            Subtotal
          </span>
          <span className="text-sm sm:text-base font-bold text-white tabular-nums tracking-tight">
            € {subtotal.toFixed(2)}
          </span>
        </div>

        {/* Right: Clear & Add All Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            type="button"
            onClick={onClearSelection}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
            aria-label="Clear selection"
            title="Clear selection"
          >
            <X className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleAddClick}
            disabled={isAdding}
            className={`inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all duration-200 shadow-lg cursor-pointer active:scale-[0.98] ${
              isAdded
                ? 'bg-emerald-500 text-obsidian-950 font-bold'
                : 'bg-white text-obsidian-950 hover:bg-neutral-100 shadow-white/10'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span className="hidden sm:inline">Added to Bag</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>
                  Add <span className="hidden sm:inline">Selected</span> ({selectedCount})
                </span>
              </>
            )}
          </button>
        </div>
      </motion.aside>
    </AnimatePresence>
  );
}
