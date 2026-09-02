'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, ArrowRight, CheckCircle2 } from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { Product } from '@/types/catalog';
import { useCartStore } from '@/store/useCartStore';

interface ActiveStyleRecommendationsProps {
  archetype: string;
  fit: string;
}

export function ActiveStyleRecommendations({ archetype, fit }: ActiveStyleRecommendationsProps) {
  const { addItem } = useCartStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  // Dynamic matching logic
  const getFilteredProducts = (): Product[] => {
    let filtered: Product[] = [];
    if (archetype === 'minimalist-tailoring') {
      filtered = MASTER_PRODUCTS.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat === 'outerwear' || cat === 'apparel' || cat === 'footwear';
      });
    } else if (archetype === 'contemporary-techwear') {
      filtered = MASTER_PRODUCTS.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat === 'outerwear' || cat === 'accessories' || cat === 'objects';
      });
    } else if (archetype === 'heritage-leather') {
      filtered = MASTER_PRODUCTS.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat === 'leather-goods' || cat === 'leather goods' || cat === 'horology' || cat === 'footwear';
      });
    } else {
      filtered = MASTER_PRODUCTS.filter((p) => {
        const cat = (p.category || '').toLowerCase();
        return cat === 'apparel' || cat === 'accessories' || cat === 'outerwear';
      });
    }

    if (filtered.length < 4) {
      filtered = MASTER_PRODUCTS;
    }
    return filtered.slice(0, 4);
  };

  const matchedProducts = getFilteredProducts();

  const handleAdd = (p: Product) => {
    addItem(p, p.sizes ? p.sizes[0] : 'One Size');
    setAddedId(p.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  const formatArchetype = (str: string) => {
    return str.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <section className="space-y-6 pt-4">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Personalised Recommendations</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Pieces Matched to Your <span className="italic font-normal">Style Preferences</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            These garments are dynamically tailored to match your {formatArchetype(archetype)} taste and {formatArchetype(fit)} silhouette.
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
        {matchedProducts.map((p) => {
          const isAdded = addedId === p.id;
          return (
            <div
              key={p.id}
              className="p-4 rounded-3xl bg-surface-card/70 border border-white/10 hover:border-accent-cyan/30 transition-all duration-300 flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                <Link
                  href={`/product/${p.id}`}
                  className="aspect-[4/5] rounded-2xl overflow-hidden bg-obsidian-950/80 p-3 relative flex items-center justify-center block cursor-pointer"
                >
                  <img
                    src={p.image}
                    alt={p.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-obsidian-950/80 border border-white/10 text-[10px] font-mono text-accent-cyan">
                    {formatArchetype(archetype)}
                  </span>
                </Link>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-white/40 uppercase">{p.category}</div>
                  <Link
                    href={`/product/${p.id}`}
                    className="font-editorial text-lg text-white font-normal truncate group-hover:text-accent-cyan transition-colors block"
                  >
                    {p.name}
                  </Link>
                  <div className="font-mono text-sm text-white/90">&euro;{p.price}</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleAdd(p)}
                className={`w-full py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer border ${
                  isAdded
                    ? 'bg-accent-cyan text-obsidian-950 border-accent-cyan'
                    : 'bg-white/[0.06] hover:bg-accent-crimson text-white hover:border-accent-crimson border-white/10'
                }`}
              >
                {isAdded ? (
                  <>
                    <CheckCircle2 size={13} />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={13} />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
