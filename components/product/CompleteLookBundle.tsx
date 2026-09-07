'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Check, ArrowRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

interface CompleteLookBundleProps {
  currentProduct: Product;
}

// Curated companion item pairing map matching feature/storefront-elevation
const COMPLETE_LOOK_MAP: Record<string, string[]> = {
  p1: ['p2', 'p6', 'p8'],
  p2: ['p1', 'p6', 'p7'],
  p3: ['p1', 'p6', 'p8'],
  p4: ['p1', 'p7', 'p8'],
  p5: ['p2', 'p6', 'p7'],
  p6: ['p1', 'p2', 'p7'],
  p7: ['p1', 'p2', 'p8'],
  p8: ['p2', 'p6', 'p7'],
};

export function CompleteLookBundle({ currentProduct }: CompleteLookBundleProps) {
  const { addItem } = useCartStore();
  const [isBundleAdded, setIsBundleAdded] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Resolve curated 3 companion pieces based on current product
  const pairedIds = COMPLETE_LOOK_MAP[currentProduct.id] || ['p2', 'p6', 'p8'];
  const companionItems = pairedIds
    .map((id) => MASTER_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  // 3-piece companion bundle + current piece
  const allLookItems = [currentProduct, ...companionItems];
  const originalTotal = allLookItems.reduce((sum, item) => sum + item.price, 0);
  const discountedTotal = Math.round(originalTotal * 0.9);

  // 1-Click Add Entire Look to Bag
  const handleAddAll = () => {
    allLookItems.forEach((item) => {
      addItem(
        item,
        item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Standard',
        item.colors && item.colors.length > 0 ? item.colors[0].name : 'Standard',
        1
      );
    });
    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 3000);
  };

  // Quick Add individual companion item
  const handleQuickAdd = (item: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      item,
      item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Standard',
      item.colors && item.colors.length > 0 ? item.colors[0].name : 'Standard',
      1
    );
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  return (
    <section
      id="pdpCompleteLookSection"
      className="pt-16 pb-12 border-t border-white/10 space-y-8"
      aria-label="Complete the Look"
    >
      {/* Header & Quick Bundle Checkout */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Complete the Look</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Style It <span className="italic font-normal">With</span>
          </h2>
          <p className="text-xs text-white/60 font-light max-w-xl">
            Carefully chosen companion pieces to complete your look, designed and tailored to pair effortlessly together.
          </p>
        </div>

        {/* Bundle Summary & Add All CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-surface-card/90 border border-white/15 shadow-xl backdrop-blur-md">
          <div className="space-y-0.5 font-mono">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/40 line-through tabular-nums">&euro;{originalTotal.toFixed(2)}</span>
              <span className="px-2 py-0.5 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan text-[10px] font-bold">
                SAVE 10%
              </span>
            </div>
            <div className="text-lg font-bold text-white tabular-nums">&euro;{discountedTotal.toFixed(2)}</div>
          </div>

          <button
            id="btnAddCompleteLookBtn"
            type="button"
            onClick={handleAddAll}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-obsidian-950 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-white/10 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isBundleAdded ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-800">Added All to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add Entire Look ({allLookItems.length} Pieces)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Companion Cards Grid with Staggered Motion */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {companionItems.map((item) => {
          const isItemAdded = addedItemIds[item.id];
          return (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
                },
              }}
              className="p-5 rounded-3xl bg-surface-card/60 border border-white/10 hover:border-accent-cyan/30 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                {/* Media Container with Quick Add Overlay */}
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-obsidian-950/80 p-4 relative flex items-center justify-center border border-white/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                  />

                  {/* Quick Add Button */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(item, e)}
                    className={`absolute bottom-3 right-3 px-3 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md cursor-pointer ${
                      isItemAdded
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/90 hover:bg-white text-obsidian-950 hover:scale-105'
                    }`}
                    aria-label={`Quick add ${item.name} to bag`}
                  >
                    {isItemAdded ? (
                      <>
                        <Check size={12} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        <span>Quick Add</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Product Metadata */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
                    {item.category}
                  </span>
                  <Link href={`/product/${item.id}`} className="block">
                    <h3 className="font-editorial text-lg text-white font-normal truncate group-hover:text-accent-cyan transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="font-mono text-sm text-white/90 font-medium tabular-nums">
                    &euro;{item.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* View Piece Anchor */}
              <Link
                href={`/product/${item.id}`}
                className="text-[11px] font-semibold uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-1 transition-colors pt-2 border-t border-white/5"
              >
                <span>View Piece</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
