'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ShoppingBag, Trash2, Sparkles, Plus, Check } from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';

export function RecentlyViewedRail() {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const railRef = useRef<HTMLDivElement>(null);

  const addItem = useCartStore((state) => state.addItem);
  const recentProducts = MASTER_PRODUCTS;

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = () => {
    if (!railRef.current) return;
    const scrollLeft = railRef.current.scrollLeft;
    const cardWidth = 280;
    const newIdx = Math.min(
      recentProducts.length,
      Math.max(1, Math.round(scrollLeft / cardWidth) + 1)
    );
    setCurrentIndex(newIdx);
  };

  const scrollBy = (offset: number) => {
    if (!railRef.current) return;
    railRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  const handleQuickAdd = (product: Product) => {
    addItem(product);
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  if (!mounted) return null;

  return (
    <section className="py-16 bg-surface-navy/20 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink block mb-1">
              Your History
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
              Recently Viewed Items
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Counter Badge */}
            <span className="text-xs font-mono text-white/50 px-3 py-1 rounded-full bg-obsidian-950/80 border border-white/10">
              {String(currentIndex).padStart(2, '0')} / {String(recentProducts.length).padStart(2, '0')}
            </span>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => scrollBy(-320)}
                className="w-9 h-9 rounded-full bg-surface-navy hover:bg-surface-card border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Previous items"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => scrollBy(320)}
                className="w-9 h-9 rounded-full bg-surface-navy hover:bg-surface-card border border-white/10 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Next items"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Glide Rail Carousel */}
        <div
          ref={railRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
        >
          {recentProducts.map((product) => {
            const isAdded = addedIds.includes(product.id);

            return (
              <div
                key={product.id}
                className="w-[260px] sm:w-[280px] flex-shrink-0 snap-start rounded-3xl bg-surface-card border border-white/10 overflow-hidden flex flex-col justify-between hover:border-white/25 transition-all shadow-lg group"
              >
                {/* Visual Area */}
                <div className="relative aspect-[4/5] bg-surface-navy/40 p-4 flex items-center justify-center overflow-hidden">
                  <Link href={`/product/${product.id}`} className="block w-full h-full flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  <span className="absolute top-3 left-3 text-[9px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded-full bg-obsidian-950/80 text-accent-cyan border border-white/10">
                    {product.category}
                  </span>

                  <button
                    onClick={() => handleQuickAdd(product)}
                    className={`absolute bottom-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500 text-white scale-110'
                        : 'bg-white text-obsidian-950 hover:bg-accent-pink hover:text-white'
                    }`}
                    title="Quick Add to Bag"
                  >
                    {isAdded ? <Check size={14} /> : <Plus size={15} strokeWidth={2.5} />}
                  </button>
                </div>

                {/* Meta */}
                <div className="p-4 bg-obsidian-950/70 border-t border-white/5 space-y-1">
                  <div className="text-[9px] uppercase tracking-widest text-white/40 font-mono">
                    MAISON SELECTION
                  </div>
                  <Link href={`/product/${product.id}`} className="block">
                    <h4 className="text-xs font-editorial text-white font-medium hover:text-accent-pink transition-colors truncate">
                      {product.name}
                    </h4>
                  </Link>
                  <div className="text-xs font-semibold text-white pt-1">
                    {formatPrice(product.price, product.currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
