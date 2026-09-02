'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

interface CompleteLookBundleProps {
  currentProduct: Product;
}

export function CompleteLookBundle({ currentProduct }: CompleteLookBundleProps) {
  const { addItem } = useCartStore();
  const [isAdded, setIsAdded] = useState(false);

  // Pick 2 companion items from MASTER_PRODUCTS
  const companionItems = MASTER_PRODUCTS.filter((p) => p.id !== currentProduct.id).slice(0, 2);
  const bundleItems = [currentProduct, ...companionItems];

  const originalTotal = bundleItems.reduce((sum, item) => sum + item.price, 0);
  const discountedTotal = Math.round(originalTotal * 0.9);

  const handleAddAll = () => {
    bundleItems.forEach((item) => {
      addItem(item, item.sizes ? item.sizes[0] : 'One Size');
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <section id="pdpCompleteLookSection" className="pt-16 pb-12 border-t border-white/10 space-y-8" aria-label="Complete the Look">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Coordinated Wardrobe Ensemble</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Complete the <span className="italic font-normal">Look</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            Architecturally harmonized pieces styled by the Maison atelier.
          </p>
        </div>

        {/* Bundle Quick Checkout Panel */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-surface-card border border-white/10 shadow-xl">
          <div className="space-y-0.5 font-mono">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/40 line-through">&euro;{originalTotal.toFixed(2)}</span>
              <span className="px-2 py-0.5 rounded bg-accent-pink/20 text-accent-pink text-[10px] font-bold">
                SAVE 10%
              </span>
            </div>
            <div className="text-lg font-bold text-white">&euro;{discountedTotal.toFixed(2)}</div>
          </div>

          <button
            id="btnAddCompleteLookBtn"
            type="button"
            onClick={handleAddAll}
            className="px-6 py-3 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-accent-crimson/20 shrink-0"
          >
            {isAdded ? (
              <>
                <Check size={14} />
                <span>3 Items Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add All to Bag (3 items)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Col Bundle Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {bundleItems.map((item, idx) => (
          <div
            key={item.id}
            className="p-5 rounded-3xl bg-surface-card border border-white/10 hover:border-white/25 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-obsidian-950 p-4 relative flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                {idx === 0 && (
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-accent-cyan/20 border border-accent-cyan/30 text-[10px] font-semibold text-accent-cyan uppercase">
                    Current Piece
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-white/40">{item.category}</span>
                <h3 className="font-editorial text-lg text-white font-normal truncate group-hover:text-accent-cyan transition-colors">
                  {item.name}
                </h3>
                <div className="font-mono text-sm text-white/90">&euro;{item.price}</div>
              </div>
            </div>

            <Link
              href={`/product/${item.id}`}
              className="text-[11px] font-semibold uppercase tracking-wider text-accent-cyan hover:underline flex items-center gap-1"
            >
              <span>Inspect Piece</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
