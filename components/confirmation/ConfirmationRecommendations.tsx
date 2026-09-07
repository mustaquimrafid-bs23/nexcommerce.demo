'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Check, ShoppingBag, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice, resolveProductImage } from '@/lib/utils';
import { Product } from '@/types/catalog';

interface RecommendedProduct {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  image: string;
  reason: string;
}

const DEFAULT_RECOMMENDATIONS: RecommendedProduct[] = [
  {
    id: 'p-cashmere-crew',
    name: 'Fine-Knit Cashmere Crew',
    brand: 'Arc',
    category: 'apparel',
    price: 160,
    image: '/assets/images/products/p1.png',
    reason: 'Purchased 5x · Everyday essential',
  },
  {
    id: 'p-leather-runner',
    name: 'Minimalist Leather Runner',
    brand: 'Apex',
    category: 'footwear',
    price: 185,
    image: '/assets/images/products/p2.png',
    reason: 'Purchased 4x · Daily footwear essential',
  },
  {
    id: 'p-cashmere-sweater',
    name: 'Pure Cashmere Sweater',
    brand: 'Arc',
    category: 'apparel',
    price: 185,
    image: '/assets/images/products/p3.png',
    reason: 'Purchased 4x · Recommended for winter',
  },
  {
    id: 'p-wool-trousers',
    name: 'Tailored Wool Trousers',
    brand: 'Arc',
    category: 'tailoring',
    price: 170,
    image: '/assets/images/products/p4.png',
    reason: 'Purchased 4x · Wardrobe staple trousers',
  },
  {
    id: 'p-earbuds',
    name: 'Noise Canceling Earbuds',
    brand: 'Form',
    category: 'acoustics',
    price: 145,
    image: '/assets/images/products/p5.png',
    reason: 'Purchased 4x · Travel & commute favorite',
  },
];

export function ConfirmationRecommendations() {
  const { addItem } = useCartStore();
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddToCart = (product: RecommendedProduct) => {
    const p: Product = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: product.category,
      price: product.price,
      image: product.image,
      description: product.reason,
    };

    addItem(p, 'M', 'Standard', 1);

    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setToastMessage(`Added "${product.name}" to your shopping bag.`);

    setTimeout(() => {
      setToastMessage(null);
    }, 3000);

    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2500);
  };

  return (
    <section id="slConfirmWidget" className="max-w-[1100px] mx-auto mt-16 px-4 sm:px-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/25 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Reorder &middot; Smart-06</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white">
            You Might Also Like
          </h2>
        </div>

        <Link
          id="slConfirmViewAll"
          href="/smart-list"
          className="text-xs font-semibold text-accent-cyan hover:underline flex items-center gap-1.5 tracking-wider"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Recommended Items Carousel Strip */}
      <div
        id="slConfirmStrip"
        className="flex gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none snap-x"
        role="list"
        aria-label="Recommended items to reorder"
      >
        {DEFAULT_RECOMMENDATIONS.map((item) => {
          const isAdded = addedIds[item.id];
          const imgUrl = resolveProductImage(item.image);

          return (
            <div
              key={item.id}
              className="w-[185px] sm:w-[195px] shrink-0 rounded-2xl bg-[#0A2A54]/30 border border-white/10 overflow-hidden backdrop-blur-md flex flex-col justify-between group hover:border-white/20 transition-all snap-start"
            >
              {/* Product Image */}
              <div className="w-full aspect-square bg-[#071A3A] relative overflow-hidden">
                <img
                  src={imgUrl}
                  alt={item.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/products/p1.png';
                  }}
                />
                <span className="absolute top-2 left-2 text-[8.5px] font-bold px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white/80 uppercase tracking-wider">
                  {item.brand}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-3.5 flex flex-col flex-1 justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-semibold text-accent-cyan line-clamp-1 block">
                    {item.reason}
                  </span>
                  <h4 className="text-xs font-semibold text-white line-clamp-1 group-hover:text-accent-cyan transition-colors">
                    {item.name}
                  </h4>
                  <div className="text-xs font-bold text-white font-mono tabular-nums">
                    {formatPrice(item.price)}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddToCart(item)}
                  className={`w-full h-8 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isAdded
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-white/[0.06] border border-white/12 text-white hover:bg-accent-cyan hover:text-[#000B1A] hover:border-accent-cyan'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#0A2A54]/95 border border-white/15 text-xs text-white shadow-2xl backdrop-blur-md animate-[slideUpFade_0.3s_ease-out]">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </section>
  );
}
