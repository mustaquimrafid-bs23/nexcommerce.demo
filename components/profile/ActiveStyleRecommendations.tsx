'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

interface ActiveStyleRecommendationsProps {
  archetype: string;
  fit: string;
}

export function ActiveStyleRecommendations({ archetype, fit }: ActiveStyleRecommendationsProps) {
  const { addItem } = useCartStore();

  // Filter or prioritize products based on archetype
  const matchedProducts = MASTER_PRODUCTS.slice(0, 4);

  return (
    <section className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>05 / LIVE ATELIER CURATION</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Selected For Your Active <span className="italic font-normal">Style DNA</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            These pieces are dynamically matched to your selected aesthetic and silhouette volume.
          </p>
        </div>

        <Link
          href="/category"
          className="text-xs font-semibold uppercase tracking-wider text-accent-cyan hover:underline flex items-center gap-1"
        >
          <span>Explore Entire Catalog</span>
          <ArrowRight size={13} />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {matchedProducts.map((p) => (
          <div
            key={p.id}
            className="p-4 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-cyan/30 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group"
          >
            <div className="space-y-3">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-obsidian-950/80 p-3 relative flex items-center justify-center">
                <img
                  src={p.image}
                  alt={p.name}
                  className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-obsidian-950/80 border border-white/10 text-[10px] font-mono text-accent-cyan">
                  {archetype.replace('-', ' ').toUpperCase()}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-mono text-white/40 uppercase">{p.category}</div>
                <h3 className="font-editorial text-lg text-white font-normal truncate group-hover:text-accent-cyan transition-colors">
                  {p.name}
                </h3>
                <div className="font-mono text-sm text-white/90">&euro;{p.price}</div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => addItem(p, p.sizes ? p.sizes[0] : 'One Size')}
              className="w-full py-2.5 rounded-xl bg-white/[0.06] hover:bg-accent-crimson text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border border-white/10 hover:border-accent-crimson"
            >
              <ShoppingBag size={13} />
              <span>Add to Bag</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
