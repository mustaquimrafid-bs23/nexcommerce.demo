'use client';

import React from 'react';
import { Product } from '@/types/catalog';
import { ProductCardElevated } from './ProductCardElevated';
import { motion, AnimatePresence, Variants } from 'motion/react';
import { Sparkles, RotateCcw } from 'lucide-react';

interface CategoryProductGridProps {
  products: Product[];
  onResetFilters: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

export function CategoryProductGrid({ products, onResetFilters }: CategoryProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-20 px-4 text-center rounded-2xl border border-white/10 bg-surface-card/40 backdrop-blur-md space-y-4 my-8">
        <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 text-white/50 flex items-center justify-center mx-auto">
          <Sparkles size={20} />
        </div>
        <div className="space-y-1.5 max-w-md mx-auto">
          <h3 className="font-editorial text-2xl sm:text-3xl text-white font-medium">
            No Pieces Found
          </h3>
          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            We couldn&apos;t find pieces matching this filter or search term. Explore our full atelier catalog.
          </p>
        </div>
        <div className="pt-2">
          <button
            onClick={onResetFilters}
            className="px-6 py-2.5 rounded-sm bg-white text-obsidian-950 hover:bg-white/90 font-bold text-xs uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-2 cursor-pointer shadow-lg active:scale-95"
          >
            <RotateCcw size={13} />
            <span>View All Pieces</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={products.map((p) => p.id).join('-')}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-6"
        id="plpProductGrid"
      >
        {products.map((product, idx) => (
          <motion.div key={product.id} variants={itemVariants}>
            <ProductCardElevated
              product={product}
              parallaxDepth={idx % 2 === 0 ? 1 : 2}
            />
          </motion.div>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
