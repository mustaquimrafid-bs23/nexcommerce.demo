'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Play, Pause, ShoppingBag, Check, ArrowRight, Sparkles } from 'lucide-react';
import { CURATED_LOOKS } from './data';
import { useCartStore } from '@/store/useCartStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { Product } from '@/types/catalog';

const ROTATION_INTERVAL_MS = 6500;

export function CuratedBespokeSpotlight() {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [addedLookup, setAddedLookup] = useState<Record<string, boolean>>({});

  const { addItem } = useCartStore();
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  const activeLook = CURATED_LOOKS[activeLookIndex] || CURATED_LOOKS[0];

  const handleNextLook = useCallback(() => {
    setActiveLookIndex((prev) => (prev + 1) % CURATED_LOOKS.length);
    setProgress(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  }, []);

  // 120fps GPU Progress Bar animation loop via requestAnimationFrame
  useEffect(() => {
    if (isPaused) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    const animateProgress = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp - pausedTimeRef.current;
      }

      const elapsed = timestamp - startTimeRef.current;
      const currentProgress = Math.min(elapsed / ROTATION_INTERVAL_MS, 1);
      setProgress(currentProgress);

      if (currentProgress >= 1) {
        handleNextLook();
      } else {
        animFrameRef.current = requestAnimationFrame(animateProgress);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [activeLookIndex, isPaused, handleNextLook]);

  const selectLook = (index: number) => {
    setActiveLookIndex(index);
    setProgress(0);
    startTimeRef.current = null;
    pausedTimeRef.current = 0;
  };

  const togglePause = () => {
    setIsPaused((prev) => {
      if (!prev) {
        // Pausing: save elapsed time
        pausedTimeRef.current = progress * ROTATION_INTERVAL_MS;
      } else {
        // Resuming
        startTimeRef.current = null;
      }
      return !prev;
    });
  };

  const handleQuickAdd = (look: (typeof CURATED_LOOKS)[number]) => {
    const foundProduct = MASTER_PRODUCTS.find((p) => p.id === look.productId);
    const targetProduct: Product = foundProduct || {
      id: look.productId,
      name: look.pieceName,
      brand: 'nexCommerce Atelier',
      category: 'apparel',
      price: look.price,
      formattedPrice: look.formattedPrice,
      currency: look.currency,
      description: look.description,
      image: look.image,
      sizes: ['S', 'M', 'L', 'XL'],
      colors: [{ name: look.variant, hex: '#000000', img: look.image }],
      tag: 'BESPOKE',
      matchBadge: 'CURATED',
      rating: 5.0,
      inStock: true,
      reasoning: look.description,
      origin: 'Bespoke Atelier Commission',
      tags: [look.category.toLowerCase()],
    };

    addItem(targetProduct, 'M', look.variant, 1);

    setAddedLookup((prev) => ({ ...prev, [look.productId]: true }));
    setTimeout(() => {
      setAddedLookup((prev) => ({ ...prev, [look.productId]: false }));
    }, 2500);
  };

  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2 mb-6">
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#3DE0FF] flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#3DE0FF]" />
          Atelier Commissions &middot; Look Switcher
        </span>
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
          Curated Signature Pieces
        </h2>
      </div>

      {/* Main Spotlight Container */}
      <div
        className="relative rounded-3xl bg-[#08254c]/75 border border-white/15 backdrop-blur-2xl overflow-hidden shadow-2xl shadow-[#00142e]/80"
        onMouseEnter={() => !isPaused && setIsPaused(true)}
        onMouseLeave={() => isPaused && setIsPaused(false)}
      >
        {/* 120fps GPU scaleX Progress Bar */}
        <div
          className="contact-spotlight-progress-track w-full h-1 bg-white/[0.08] relative overflow-hidden"
          role="progressbar"
          aria-valuenow={Math.round(progress * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Look rotation progress"
        >
          <div
            id="contactSpotlightProgressBar"
            className="h-full bg-gradient-to-r from-[#3DE0FF] to-[#00E096] origin-left will-change-transform"
            style={{
              transform: `scaleX(${progress})`,
              transition: isPaused ? 'none' : 'transform 16ms linear',
            }}
          />
        </div>

        {/* Look Switcher Header Strip */}
        <div className="px-6 py-4 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 bg-[#0A2A54]/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#3DE0FF] flex items-center gap-1.5">
              <Sparkles size={13} />
              Bespoke Selection &middot; {activeLook.num}/04
            </span>
            <button
              type="button"
              id="contactSpotlightPauseBtn"
              onClick={togglePause}
              aria-pressed={isPaused}
              aria-label={isPaused ? 'Resume auto rotation' : 'Pause auto rotation'}
              className="w-7 h-7 rounded-full bg-white/[0.06] hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors text-xs"
            >
              {isPaused ? <Play size={12} className="ml-0.5" /> : <Pause size={12} />}
            </button>
          </div>

          {/* Look Tabs (01 to 04) */}
          <div
            className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none"
            role="tablist"
            aria-label="Curated Look Tabs"
          >
            {CURATED_LOOKS.map((look, idx) => (
              <button
                key={look.id}
                type="button"
                role="tab"
                data-look={idx}
                aria-selected={activeLookIndex === idx}
                onClick={() => selectLook(idx)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium tracking-wide uppercase whitespace-nowrap transition-all ${
                  activeLookIndex === idx
                    ? 'bg-[#3DE0FF] text-[#00142e] font-bold shadow-md shadow-[#3DE0FF]/25 border border-[#3DE0FF]'
                    : 'text-white/70 hover:text-white hover:bg-white/10 border border-transparent'
                }`}
              >
                {look.tabLabel}
              </button>
            ))}
          </div>
        </div>

        {/* Spotlight Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
          {/* Left Column: Story & Metadata (5 cols) */}
          <div className="lg:col-span-5 p-6 sm:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-[#08254c]/40">
            <div>
              <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-[#3DE0FF] block mb-2">
                ATELIER EDIT &middot; AW26
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold text-white mb-4 leading-tight">
                {activeLook.title}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal mb-8">
                {activeLook.description}
              </p>

              {/* Specification Pills */}
              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 rounded-full text-[11px] bg-[#0A2A54]/80 border border-white/12 text-white/80">
                  {activeLook.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] bg-[#0A2A54]/80 border border-white/12 text-white/80">
                  {activeLook.variant}
                </span>
                <span className="px-3 py-1 rounded-full text-[11px] bg-[#00E096]/15 border border-[#00E096]/30 text-[#00E096]">
                  In Stock &middot; Ready for Dispatch
                </span>
              </div>
            </div>

            {/* Quick Actions Row */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                id="contactSpotlightAddBtn"
                data-product-id={activeLook.productId}
                onClick={() => handleQuickAdd(activeLook)}
                className="px-5 py-2.5 rounded-xl bg-[#3DE0FF] hover:bg-[#3DE0FF]/90 active:scale-98 text-[#01142e] font-bold text-xs tracking-wider uppercase flex items-center gap-2 transition-all shadow-lg shadow-[#3DE0FF]/25 cursor-pointer"
              >
                {addedLookup[activeLook.productId] ? (
                  <>
                    <Check size={14} className="text-[#01142e]" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={14} />
                    <span>+ Quick Add &middot; {activeLook.formattedPrice}</span>
                  </>
                )}
              </button>

              <Link
                href="/category"
                className="px-4 py-2.5 rounded-xl bg-[#0A2A54]/80 hover:bg-[#0A2A54] border border-white/12 text-white/90 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <span>Explore Catalog</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>

          {/* Right Column: Editorial Lifestyle Canvas & 3D Shoppable Look Pill (7 cols) */}
          <div className="lg:col-span-7 relative overflow-hidden flex items-center justify-center p-6 sm:p-10 bg-gradient-to-br from-[#0A2A54] to-[#021838]">
            {/* Lifestyle Background Photo */}
            <img
              src={activeLook.lifestyleImage}
              alt={activeLook.title}
              className="absolute inset-0 w-full h-full object-cover opacity-50 mix-blend-luminosity scale-105 transition-all duration-700 hover:scale-100"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#041d40] via-transparent to-[#041d40]/70 pointer-events-none" />

            {/* Floating 3D Shoppable Look Capsule Pill */}
            <div
              id="contactFloatingLookPill"
              className="relative z-10 max-w-md w-full p-4 sm:p-5 rounded-2xl bg-[#00142e]/95 border border-white/20 backdrop-blur-2xl shadow-2xl shadow-[#00142e]/90 flex items-center justify-between gap-4 transition-all duration-300 hover:border-[#3DE0FF]/50 hover:-translate-y-1"
            >
              {/* Product Thumbnail with Studio Silhouette radial background */}
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-radial from-white/15 to-transparent border border-white/12 flex-shrink-0 flex items-center justify-center p-1.5 overflow-hidden">
                <img
                  src={activeLook.image}
                  alt={activeLook.pieceName}
                  className="w-full h-full object-contain filter drop-shadow-md"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold tracking-wider uppercase text-[#3DE0FF] block truncate">
                  {activeLook.category} &middot; {activeLook.variant}
                </span>
                <h4 className="text-sm font-semibold text-white truncate mb-1">
                  {activeLook.pieceName}
                </h4>
                <div className="text-xs font-mono font-semibold text-white/90">
                  {activeLook.formattedPrice}
                </div>
              </div>

              {/* 1-Click Quick Add Button on Floating Pill */}
              <button
                type="button"
                id="contactPillQuickAddBtn"
                onClick={() => handleQuickAdd(activeLook)}
                aria-label={`Add ${activeLook.pieceName} to bag`}
                className="w-10 h-10 rounded-xl bg-[#0A2A54] hover:bg-[#3DE0FF] border border-white/15 text-white hover:text-[#01142e] flex items-center justify-center transition-all flex-shrink-0 active:scale-95 shadow-md cursor-pointer"
              >
                {addedLookup[activeLook.productId] ? (
                  <Check size={18} className="text-[#00E096]" />
                ) : (
                  <ShoppingBag size={18} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
