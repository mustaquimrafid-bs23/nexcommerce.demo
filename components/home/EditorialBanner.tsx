'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';
import { useReveal } from '@/hooks/useReveal';

const GOWN_PRODUCT: Product = {
  id: 'apparel-1',
  name: 'Crimson Silk-Crepe Couture Gown',
  category: 'outerwear',
  price: 1280,
  currency: 'EUR',
  description: '98% Mulberry Silk · Bias-Draped Italian Couture Silhouette.',
  image: '/assets/images/lifestyle/Gemini_Generated_Image_p8bt04p8bt04p8bt.jpg',
  tag: 'Runway Highlight',
};

export function EditorialBanner() {
  const [isActive, setIsActive] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  const sectionRef = useReveal<HTMLElement>({
    y: 20,
    scale: 1,
    duration: 800,
    margin: '-5%',
  });

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(GOWN_PRODUCT);
    setIsAdded(true);
    setTimeout(() => {
      openCart();
    }, 350);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-16 bg-[#01142e] border-b border-white/5"
      id="homeEditorialBannerSection"
      aria-label="Autumn Winter Editorial Lookbook"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl aspect-[4/3] sm:aspect-[21/9] bg-[#00142e] group"
          id="lookbookBannerContainer"
        >
          {/* Panoramic Editorial Lifestyle Photography */}
          <Link
            href="/category?cat=all"
            className="block w-full h-full relative"
            aria-label="Explore Autumn Winter Couture Collection"
          >
            <picture className="w-full h-full block">
              <source
                media="(min-width: 769px)"
                srcSet="/assets/images/lifestyle/Gemini_Generated_Image_t9kwvit9kwvit9kw.jpg"
              />
              <img
                src="/assets/images/lifestyle/Gemini_Generated_Image_p8bt04p8bt04p8bt.jpg"
                alt="nexCommerce Crimson Silk Couture — Autumn / Winter Editorial Collection"
                className="w-full h-full object-cover object-[center_35%] brightness-[0.88] group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                loading="lazy"
              />
            </picture>

            <div className="absolute inset-0 bg-gradient-to-t from-[#01142e]/70 via-transparent to-transparent pointer-events-none" />
          </Link>

          {/* Interactive Smart Vision Hotspot Pin — Positioned right on the gown */}
          <div
            className="absolute top-[68%] left-[45%] sm:top-[72%] sm:left-[41%] -translate-x-1/2 -translate-y-1/2 z-25 pointer-events-auto"
            data-hotspot-id="dress"
            onMouseEnter={() => {
              if (window.innerWidth > 768) setIsActive(true);
            }}
            onMouseLeave={() => {
              if (window.innerWidth > 768) setIsActive(false);
            }}
          >
            <button
              onClick={() => setIsActive(!isActive)}
              className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-[0_0_20px_rgba(241,51,101,0.5)] cursor-pointer hover:scale-110 active:scale-95 transition-transform"
              aria-label="Toggle Lookbook Details for Crimson Silk Gown"
              aria-expanded={isActive}
              type="button"
            >
              <span className="absolute inset-0 rounded-full bg-[#F13365]/40 animate-ping" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#F13365] shadow-[0_0_8px_#F13365]" />
            </button>

            {/* Shoppable Look Tag Popover — Screen-safe responsive positioning */}
            {isActive && (
              <div
                className="lookbook-tag-card absolute bottom-full sm:bottom-auto sm:left-full mb-3 sm:mb-0 sm:ml-4 left-1/2 -translate-x-1/2 sm:translate-x-0 w-[240px] sm:w-64 p-3 rounded-xl sm:rounded-2xl bg-[#01142e]/95 backdrop-blur-2xl border border-white/20 shadow-2xl space-y-2 z-30 animate-in fade-in zoom-in-95 duration-200"
                role="region"
                aria-label="Featured Runway Look Details"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold tracking-[0.14em] uppercase text-[#F13365] flex items-center gap-1">
                    <Sparkles size={11} className="text-[#F13365]" />
                    <span>Featured Dress</span>
                  </span>
                  <span className="text-[11px] font-bold text-white tabular-nums">
                    &euro; 1,280.00
                  </span>
                </div>

                <div className="space-y-0.5 text-left">
                  <h3 className="text-xs font-semibold text-white tracking-wide">
                    Crimson Silk Evening Dress
                  </h3>
                  <p className="text-[10.5px] text-white/60 leading-tight line-clamp-2">
                    98% Mulberry Silk &middot; Pure silk with an elegant draped finish.
                  </p>
                </div>

                <button
                  onClick={handleQuickAdd}
                  className="w-full py-1.5 rounded-lg bg-[#E11D48] hover:bg-[#E11D48]/90 active:scale-95 text-white font-bold text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1 shadow-lg cursor-pointer"
                >
                  {isAdded ? (
                    <>
                      <Check size={12} strokeWidth={3} className="text-white" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <Plus size={12} strokeWidth={3} />
                      <span>Quick Add &middot; &euro; 1,280</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
