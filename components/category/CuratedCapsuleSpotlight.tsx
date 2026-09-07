'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles, ShoppingBag, ArrowRight, Check, Compass } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCurrencyStore } from '@/store/useCurrencyStore';
import { motion, AnimatePresence } from 'motion/react';

export interface CuratedLook {
  id: string;
  indexLabel: string;
  tabLabel: string;
  seasonTag: string;
  title: string;
  desc: string;
  targetCategory: string;
  pieceCount: string;
  heroImage: string;
  featuredProductId: string;
  featuredProductTitle: string;
  featuredProductPrice: number;
  featuredProductThumb: string;
  featuredProductTag: string;
}

const CURATED_LOOKS: CuratedLook[] = [
  {
    id: 'look-1',
    indexLabel: '01 OF 03',
    tabLabel: '01 TAILORING',
    seasonTag: 'SEASONAL EDIT · AW26',
    title: 'Winter Tailoring',
    desc: 'Warm wool blazers and soft cashmere layers designed for everyday comfort.',
    targetCategory: 'outerwear',
    pieceCount: '1 Matching Piece',
    heroImage: '/assets/images/lifestyle/category_hero_banner.jpg',
    featuredProductId: 'p2',
    featuredProductTitle: 'STRUCTURED WOOL BLAZER',
    featuredProductPrice: 264,
    featuredProductThumb: '/assets/images/lifestyle/thumb_sweater.jpg',
    featuredProductTag: 'FEATURED ITEM',
  },
  {
    id: 'look-2',
    indexLabel: '02 OF 03',
    tabLabel: '02 AUDIO',
    seasonTag: 'STUDIO SOUND',
    title: 'Headphones & Sound',
    desc: 'Clear studio sound and noise cancellation with soft leather ear pads.',
    targetCategory: 'acoustics',
    pieceCount: '2 Matching Pieces',
    heroImage: '/assets/images/lifestyle/category_hero_banner.jpg',
    featuredProductId: 'p4',
    featuredProductTitle: 'STUDIO ACOUSTICS HEADPHONE GT',
    featuredProductPrice: 320,
    featuredProductThumb: '/assets/images/lifestyle/thumb_headphones.jpg',
    featuredProductTag: 'STUDIO SOUND',
  },
  {
    id: 'look-3',
    indexLabel: '03 OF 03',
    tabLabel: '03 FOOTWEAR',
    seasonTag: 'HANDMADE FOOTWEAR',
    title: 'Everyday Leather Trainers',
    desc: 'Handmade leather trainers with flexible, cushioned soles.',
    targetCategory: 'footwear',
    pieceCount: '2 Matching Pieces',
    heroImage: '/assets/images/lifestyle/category_hero_banner.jpg',
    featuredProductId: 'p6',
    featuredProductTitle: 'MINIMALIST LEATHER RUNNER',
    featuredProductPrice: 198,
    featuredProductThumb: '/assets/images/lifestyle/thumb_runner.jpg',
    featuredProductTag: 'HANDMADE',
  },
];

const LOOK_DURATION = 6000;

interface CuratedCapsuleSpotlightProps {
  onSelectCategory: (category: string) => void;
}

export function CuratedCapsuleSpotlight({ onSelectCategory }: CuratedCapsuleSpotlightProps) {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const formatPrice = useCurrencyStore((state) => state.formatPrice);

  const activeLook = CURATED_LOOKS[activeLookIndex];

  // Ref tracking for requestAnimationFrame progress bar
  const progressBarRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const rafIdRef = useRef<number | null>(null);
  const isPausedRef = useRef<boolean>(false);
  isPausedRef.current = isPaused;

  const handleNextLook = useCallback(() => {
    setActiveLookIndex((prev) => (prev + 1) % CURATED_LOOKS.length);
    elapsedRef.current = 0;
    startTimeRef.current = performance.now();
  }, []);

  const handleSelectLook = (index: number) => {
    setActiveLookIndex(index);
    elapsedRef.current = 0;
    startTimeRef.current = performance.now();
    if (progressBarRef.current) {
      progressBarRef.current.style.transform = 'scaleX(0)';
    }
  };

  // 120fps GPU Timer Loop
  useEffect(() => {
    startTimeRef.current = performance.now() - elapsedRef.current;

    const animateProgress = (now: number) => {
      if (!isPausedRef.current) {
        if (startTimeRef.current === null) {
          startTimeRef.current = now;
        }
        const currentElapsed = now - startTimeRef.current;
        elapsedRef.current = currentElapsed;

        const progress = Math.min(currentElapsed / LOOK_DURATION, 1);
        if (progressBarRef.current) {
          progressBarRef.current.style.transform = `scaleX(${progress})`;
        }

        if (currentElapsed >= LOOK_DURATION) {
          handleNextLook();
        }
      } else {
        startTimeRef.current = now - elapsedRef.current;
      }
      rafIdRef.current = requestAnimationFrame(animateProgress);
    };

    rafIdRef.current = requestAnimationFrame(animateProgress);

    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, [activeLookIndex, handleNextLook]);

  // Keyboard Navigation
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = (index + 1) % CURATED_LOOKS.length;
      handleSelectLook(nextIdx);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      const prevIdx = (index - 1 + CURATED_LOOKS.length) % CURATED_LOOKS.length;
      handleSelectLook(prevIdx);
    }
  };

  // Quick Add Featured Product
  const handleQuickAddFeatured = () => {
    const product = MASTER_PRODUCTS.find((p) => p.id === activeLook.featuredProductId);
    if (product) {
      addItem(product);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 1600);
    }
  };

  return (
    <section
      className="plp-curation-spotlight my-8 rounded-2xl sm:rounded-3xl border border-white/10 bg-[#080e1e]/80 backdrop-blur-xl shadow-2xl overflow-hidden relative"
      id="plpSpotlightSection"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-label="Featured Looks Spotlight"
    >
      {/* 120fps GPU Progress Track */}
      <div className="spotlight-progress-track absolute top-0 left-0 right-0 h-[2px] bg-white/10 z-30 overflow-hidden">
        <div
          ref={progressBarRef}
          className="spotlight-progress-bar h-full w-full bg-gradient-to-r from-[#3DE0FF] via-white to-[#E60C45] origin-left will-change-transform"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Spotlight Navigation Tabs & Index Indicator */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-[#3DE0FF] flex items-center gap-1.5">
              <Sparkles size={12} />
              <span>Curated Looks</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="text-[10px] font-semibold text-white/50 tracking-widest uppercase">
              {activeLook.indexLabel}
            </span>
          </div>

          {/* Look Selector Tabs */}
          <div
            role="tablist"
            aria-label="Signature Look Selector"
            className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0"
          >
            {CURATED_LOOKS.map((look, idx) => {
              const isActive = activeLookIndex === idx;
              return (
                <button
                  key={look.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleSelectLook(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`spotlight-tab-btn px-3.5 py-1.5 rounded-sm text-[10px] sm:text-[11px] font-bold tracking-[0.12em] uppercase transition-all duration-200 cursor-pointer whitespace-nowrap border ${
                    isActive
                      ? 'active bg-white text-[#01132B] border-white shadow-lg shadow-white/10'
                      : 'bg-transparent text-white/50 border-white/15 hover:border-white/40 hover:text-white'
                  }`}
                >
                  {look.tabLabel}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Split Layout: Visual Lifestyle + Story Pane */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeLook.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center"
          >
            {/* Visual Frame Left Pane */}
            <div className="lg:col-span-7 relative aspect-[16/9] sm:aspect-[21/10] rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-[#080E1E] shadow-inner group">
              <img
                src={activeLook.heroImage}
                alt={activeLook.title}
                className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-700 ease-out brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080E1E] via-[#080E1E]/30 to-transparent" />

              {/* Tag Overlays */}
              <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/15 text-[10px] font-bold uppercase tracking-wider text-white">
                  {activeLook.seasonTag}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 right-3 sm:right-4 flex justify-between items-end">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-[#3DE0FF] font-bold block mb-1">
                    {activeLook.pieceCount}
                  </span>
                  <h3 className="font-editorial text-lg sm:text-2xl text-white font-medium drop-shadow-md">
                    {activeLook.title}
                  </h3>
                </div>
              </div>
            </div>

            {/* Story & Featured Piece Right Pane */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
              <div className="space-y-2">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[#E60C45] font-bold block">
                  Style Notes
                </span>
                <h4 className="font-editorial text-xl sm:text-2xl text-white font-normal leading-snug">
                  {activeLook.title}
                </h4>
                <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                  {activeLook.desc}
                </p>
              </div>

              {/* Featured Piece Card */}
              <div className="rounded-xl border border-white/10 bg-[#080E1E] p-3 sm:p-4 flex items-center justify-between gap-3 shadow-lg">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden border border-white/10 bg-[#01132B] flex-shrink-0">
                    <img
                      src={activeLook.featuredProductThumb}
                      alt={activeLook.featuredProductTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#3DE0FF] block">
                      {activeLook.featuredProductTag}
                    </span>
                    <h5 className="font-editorial text-xs sm:text-sm text-white font-medium truncate">
                      {activeLook.featuredProductTitle}
                    </h5>
                    <span className="text-xs font-bold text-white tabular-nums block font-mono">
                      {formatPrice(activeLook.featuredProductPrice)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleQuickAddFeatured}
                  className={`btn-spotlight-quick-add px-3 sm:px-4 py-2 rounded-lg text-[10px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 flex-shrink-0 cursor-pointer shadow-md active:scale-95 ${
                    addedSuccess
                      ? 'bg-emerald-500 text-white'
                      : 'bg-white text-[#01132B] hover:bg-white/90'
                  }`}
                  aria-label={`Quick Add ${activeLook.featuredProductTitle} to Bag`}
                >
                  {addedSuccess ? (
                    <>
                      <Check size={13} strokeWidth={3} />
                      <span>✓ Added</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={13} />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>
              </div>

              {/* Filter Sync Action */}
              <button
                onClick={() => onSelectCategory(activeLook.targetCategory)}
                className="w-full py-2.5 rounded-lg border border-white/15 hover:border-white/40 bg-white/[0.03] hover:bg-white/[0.08] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Compass size={14} className="text-[#3DE0FF] group-hover:rotate-45 transition-transform" />
                <span>Shop {activeLook.tabLabel.replace(/^\d+\s*/, '')}</span>
                <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
