'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Sparkles, Pause, Play, Plus, ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/utils';

interface CuratedLook {
  id: string;
  tabLabel: string;
  eyebrow: string;
  season: string;
  title: string;
  desc: string;
  productId: string;
  productName: string;
  price: number;
  lifestyleImg: string;
  productThumb: string;
  category: string;
  categoryHref: string;
}

const CURATED_LOOKS: CuratedLook[] = [
  {
    id: 'look-0',
    tabLabel: '01 TAILORING',
    eyebrow: 'FEATURED PAIRING · 01 OF 04',
    season: 'ATELIER EDIT · AW26',
    title: 'Architectural Cashmere Layer',
    desc: 'Handcrafted 2-ply Mongolian cashmere with seamless dropped shoulder tailoring for effortless warmth and structure.',
    productId: 'p1',
    productName: 'Cashmere Turtleneck Sweater',
    price: 185,
    lifestyleImg: '/assets/images/lifestyle/hero_sweater_landscape.jpg',
    productThumb: '/assets/images/products/hero_sweater.png',
    category: 'Apparel',
    categoryHref: '/category?cat=apparel',
  },
  {
    id: 'look-1',
    tabLabel: '02 LEATHER',
    eyebrow: 'FEATURED PAIRING · 02 OF 04',
    season: 'LEATHER GOODS · SS26',
    title: 'Structured Tuscan Weekender',
    desc: 'Full-grain vegetable-tanned Tuscan calfskin paired with hand-stitched palladium hardware and reinforced base corners.',
    productId: 'p6',
    productName: 'Leather Weekender Tote',
    price: 340,
    lifestyleImg: '/assets/images/lifestyle/hero_tote_landscape.jpg',
    productThumb: '/assets/images/products/prod_tote.png',
    category: 'Leather Goods',
    categoryHref: '/category?cat=accessories',
  },
  {
    id: 'look-2',
    tabLabel: '03 ACOUSTICS',
    eyebrow: 'FEATURED PAIRING · 03 OF 04',
    season: 'HIGH ACOUSTICS · 2026',
    title: 'Studio Acoustics Headphone GT',
    desc: 'Custom 40mm beryllium drivers enclosed in machined aerospace aluminium for studio-grade acoustic depth and isolation.',
    productId: 'p4',
    productName: 'Studio Acoustics Headphone GT',
    price: 320,
    lifestyleImg: '/assets/images/lifestyle/hero_headphone_landscape.jpg',
    productThumb: '/assets/images/products/hero_headphone_hd.jpg',
    category: 'High Acoustics',
    categoryHref: '/category?cat=acoustics',
  },
  {
    id: 'look-3',
    tabLabel: '04 HOROLOGY',
    eyebrow: 'FEATURED PAIRING · 04 OF 04',
    season: 'HOROLOGY · 2026',
    title: 'Minimal Titanium Automatic',
    desc: 'Grade 5 satin-brushed titanium case housing an ultra-thin 28,800 vph automatic caliber with 70-hour power reserve.',
    productId: 'p5',
    productName: 'Minimal Titanium Automatic',
    price: 285,
    lifestyleImg: '/assets/images/lifestyle/hero_watch_landscape.jpg',
    productThumb: '/assets/images/products/search_watch.png',
    category: 'Horology',
    categoryHref: '/category?cat=accessories',
  },
];

const CYCLE_DURATION = 6500; // 6.5s per capsule

export function CuratedLookSwitcher() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [addedToast, setAddedToast] = useState(false);
  const [progress, setProgress] = useState(0);

  const addItem = useCartStore((state) => state.addItem);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);
  const isHoveredRef = useRef<boolean>(false);
  const isManuallyPausedRef = useRef<boolean>(false);

  const currentLook = CURATED_LOOKS[activeIndex];

  const handleQuickAdd = () => {
    const product = MASTER_PRODUCTS.find((p) => p.id === currentLook.productId) || {
      id: currentLook.productId,
      name: currentLook.productName,
      price: currentLook.price,
      image: currentLook.productThumb,
      category: currentLook.category,
      currency: 'EUR',
      description: currentLook.desc,
      inStock: true,
    };

    addItem(product, 'Standard', undefined, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2500);
  };

  const handleTogglePause = () => {
    setIsPaused((prev) => {
      const next = !prev;
      isManuallyPausedRef.current = next;
      return next;
    });
  };

  const handleSelectLook = (index: number) => {
    setActiveIndex(index);
    startTimeRef.current = performance.now();
    setProgress(0);
  };

  // GPU Animation Loop
  const loop = useCallback(
    (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now;

      if (!isHoveredRef.current && !isManuallyPausedRef.current) {
        const elapsed = now - startTimeRef.current;
        const currentProgress = Math.min(1, elapsed / CYCLE_DURATION);
        setProgress(currentProgress);

        if (currentProgress >= 1) {
          setActiveIndex((prev) => (prev + 1) % CURATED_LOOKS.length);
          startTimeRef.current = now;
          setProgress(0);
        }
      } else {
        startTimeRef.current = now - progress * CYCLE_DURATION;
      }

      rafRef.current = requestAnimationFrame(loop);
    },
    [progress]
  );

  useEffect(() => {
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loop]);

  return (
    <section
      id="cartLookSwitcherWrap"
      className="rounded-2xl border border-white/10 bg-surface-navy/40 p-6 md:p-8 backdrop-blur-xl relative overflow-hidden shadow-2xl my-8"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      aria-label="Curated Look Pairings"
    >
      {/* Header with tabs and pause button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 text-[10px] uppercase font-bold tracking-widest text-accent-cyan mb-1">
            <Sparkles size={12} />
            <span>Featured Pairings</span>
          </div>
          <h3 className="font-editorial text-2xl text-white font-normal">
            Curated Atelier <span className="italic">Looks</span>
          </h3>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10">
            {CURATED_LOOKS.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => handleSelectLook(idx)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all ${
                  idx === activeIndex
                    ? 'bg-white text-obsidian-950 shadow-md'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                {look.tabLabel}
              </button>
            ))}
          </div>

          <button
            onClick={handleTogglePause}
            className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors"
            title={isPaused ? 'Resume auto-play' : 'Pause auto-play'}
            aria-label={isPaused ? 'Resume' : 'Pause'}
          >
            {isPaused ? <Play size={13} /> : <Pause size={13} />}
          </button>
        </div>
      </div>

      {/* 120fps GPU Progress Bar */}
      <div className="w-full h-1 bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-cyan via-accent-pink to-emerald-400 origin-left will-change-transform"
          style={{
            transform: `scaleX(${progress})`,
          }}
        />
      </div>

      {/* Spotlight Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 items-center">
        {/* Lifestyle image visual frame */}
        <div className="lg:col-span-7 relative rounded-xl overflow-hidden aspect-[16/10] bg-black/30 border border-white/10 group">
          <img
            src={currentLook.lifestyleImg}
            alt={currentLook.title}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent-cyan bg-black/60 px-2 py-0.5 rounded border border-white/10">
                {currentLook.season}
              </span>
              <h4 className="text-lg font-editorial text-white font-medium drop-shadow-md">
                {currentLook.title}
              </h4>
            </div>
            <span className="text-base font-bold text-white tabular-nums drop-shadow-md">
              {formatPrice(currentLook.price)}
            </span>
          </div>
        </div>

        {/* Details & Quick Add column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-accent-cyan">
              {currentLook.eyebrow}
            </span>
            <h4 className="text-xl font-editorial text-white">{currentLook.productName}</h4>
            <p className="text-xs text-white/70 leading-relaxed">{currentLook.desc}</p>
          </div>

          {/* Mini product preview pill */}
          <div className="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <img
                src={currentLook.productThumb}
                alt={currentLook.productName}
                className="w-12 h-12 rounded-lg object-contain bg-white/5 p-1 border border-white/5"
              />
              <div>
                <div className="text-xs font-semibold text-white">{currentLook.productName}</div>
                <div className="text-[11px] text-white/50">{formatPrice(currentLook.price)}</div>
              </div>
            </div>

            <button
              onClick={handleQuickAdd}
              className="px-4 py-2 rounded-lg bg-white text-obsidian-950 font-bold text-xs hover:bg-white/90 active:scale-95 transition-all flex items-center gap-1.5 shadow-md"
            >
              <Plus size={13} />
              <span>Quick Add</span>
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              href={currentLook.categoryHref}
              className="text-xs text-accent-cyan hover:text-white transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Explore {currentLook.category}</span>
              <ArrowRight size={12} />
            </Link>

            {addedToast && (
              <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold animate-fade-in">
                <Check size={13} />
                <span>Added to bag!</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
