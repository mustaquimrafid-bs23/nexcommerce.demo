'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingBag, RefreshCw } from 'lucide-react';
import { SmartListProduct } from '@/data/smartListProducts';
import { SmartListProductCard } from './SmartListProductCard';

interface SmartListProductGridProps {
  products: SmartListProduct[];
  selectedIds: Set<string>;
  onToggleSelect: (productId: string) => void;
  onOpenQuickLook: (product: SmartListProduct) => void;
  onResetFilters: () => void;
  onDismiss?: (productId: string) => void;
}

export function SmartListProductGrid({
  products,
  selectedIds,
  onToggleSelect,
  onOpenQuickLook,
  onResetFilters,
  onDismiss,
}: SmartListProductGridProps) {
  if (products.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-4 text-center rounded-2xl bg-surface-navy/30 border border-white/10"
      >
        <div className="w-14 h-14 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center mb-4 text-accent-cyan">
          <ShoppingBag className="w-6 h-6" />
        </div>
        <h2 className="text-xl sm:text-2xl font-normal font-serif text-white mb-2">
          Your shopping list is empty.
        </h2>
        <p className="text-xs sm:text-sm text-white/50 max-w-md mb-6 leading-relaxed">
          Personalized recommendations will appear here based on your previous orders and preferences. Explore our collections to get started.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-obsidian-950 font-semibold text-xs tracking-wider uppercase hover:bg-neutral-200 transition-colors shadow-lg cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Explore All Items</span>
        </button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
      <AnimatePresence mode="popLayout">
        {products.map((product, idx) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              duration: 0.35,
              delay: Math.min(idx * 0.04, 0.4),
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <SmartListProductCard
              product={product}
              isSelected={selectedIds.has(product.id)}
              onToggleSelect={onToggleSelect}
              onOpenQuickLook={onOpenQuickLook}
              onDismiss={onDismiss}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
