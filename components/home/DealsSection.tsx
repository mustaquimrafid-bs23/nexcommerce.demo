'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';
import { useReveal } from '@/hooks/useReveal';

interface DealItem {
  id: string;
  name: string;
  category: 'outerwear' | 'tailoring' | 'footwear' | 'accessories';
  brand: string;
  currentPrice: number;
  originalPrice: number;
  discount: string;
  image: string;
  parallaxDepth: number;
}

const FLASH_DEALS: DealItem[] = [
  { id: 'p1', name: 'Merino Knit Sweater',      category: 'outerwear',   brand: 'ARC',     currentPrice: 160, originalPrice: 199, discount: '-20%', image: '/assets/images/products/hero_sweater.png', parallaxDepth: 1 },
  { id: 'p6', name: 'Minimal Runner',           category: 'footwear',    brand: 'FORM',    currentPrice: 185, originalPrice: 245, discount: '-25%', image: '/assets/images/products/prod_runner.png',  parallaxDepth: 2 },
  { id: 'p5', name: 'Classic Leather Watch',    category: 'accessories', brand: 'ATELIER', currentPrice: 285, originalPrice: 340, discount: '-15%', image: '/assets/images/products/search_watch.png', parallaxDepth: 3 },
  { id: 'p2', name: 'Tailored Wool Blazer',     category: 'tailoring',   brand: 'ARC',     currentPrice: 245, originalPrice: 270, discount: '-30%', image: '/assets/images/products/plp_blazer.png',   parallaxDepth: 2 },
  { id: 'p8', name: 'Noise Canceling Earbuds', category: 'accessories', brand: 'FORM',    currentPrice: 145, originalPrice: 185, discount: '-30%', image: '/assets/images/products/search_earbuds.png', parallaxDepth: 1 },
];

const MAX_TILT = 8;
const LERP_IN = 0.12;
const LERP_OUT = 0.18;

function useDealCardMotion(parallaxDepth: number) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return; // Skip 3D tilt on touch devices for maximum performance

    let rafId: number | null = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, LERP_IN);
      curTY = lerp(curTY, tgtTY, LERP_IN);
      el!.style.transform = `perspective(900px) rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px)`;
      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        el!.style.transform = `perspective(900px) rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(12px)`;
        rafId = null;
      }
    }

    function springBack() {
      curTX = lerp(curTX, 0, LERP_OUT);
      curTY = lerp(curTY, 0, LERP_OUT);
      el!.style.transform = `perspective(900px) rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px)`;
      if (Math.abs(curTX) > 0.05 || Math.abs(curTY) > 0.05) {
        rafId = requestAnimationFrame(springBack);
      } else {
        el!.style.transform = '';
        rafId = null;
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = el!.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY = dx * MAX_TILT;
      el!.style.setProperty('--deal-glare-x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el!.style.setProperty('--deal-glare-y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      el!.style.setProperty('--deal-glare-opacity', '1');
      el!.style.setProperty('--deal-shadow-lift', '1');
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    };

    const onMouseLeave = () => {
      tgtTX = 0; tgtTY = 0;
      el!.style.setProperty('--deal-glare-opacity', '0');
      el!.style.setProperty('--deal-shadow-lift', '0');
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return ref;
}

function DealCard({ deal, onAdd, onWishlist, wishlisted }: {
  deal: DealItem;
  onAdd: (product: Product) => void;
  onWishlist: (product: Product) => void;
  wishlisted: boolean;
}) {
  const router = useRouter();
  const cardRef = useDealCardMotion(deal.parallaxDepth);
  const [isAdded, setIsAdded] = useState(false);

  const product: Product = {
    id: deal.id,
    name: deal.name,
    category: deal.category,
    price: deal.currentPrice,
    currency: 'EUR',
    description: deal.name,
    image: deal.image,
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlist(product);
  };

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/product/${deal.id}`)}
      className="deal-product-card group relative rounded-xl sm:rounded-2xl bg-[#08254c]/75 border border-white/10 overflow-hidden flex flex-col justify-between will-change-transform shadow-md hover:border-white/25 transition-all flex-shrink-0 w-[185px] sm:w-auto snap-start cursor-pointer"
      data-parallax-depth={deal.parallaxDepth}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Specular Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl z-10 transition-opacity duration-200"
        style={{
          background: 'radial-gradient(circle at var(--deal-glare-x, 50%) var(--deal-glare-y, 50%), rgba(255,255,255,0.10) 0%, transparent 60%)',
          opacity: 'var(--deal-glare-opacity, 0)',
        } as React.CSSProperties}
      />

      {/* Top Controls: Discount & Wishlist */}
      <div className="absolute top-2 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
        <span className="text-[9.5px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full bg-[#E11D48] text-white shadow-md pointer-events-auto">
          {deal.discount}
        </span>
        <button
          onClick={handleWishlistClick}
          className={`p-1.5 rounded-full backdrop-blur-md border transition-all cursor-pointer pointer-events-auto ${
            wishlisted ? 'bg-[#F13365] border-[#F13365] text-white' : 'bg-[#040a14]/80 border-white/15 text-white/70 hover:text-white'
          }`}
          aria-label={`Add ${deal.name} to Wishlist`}
        >
          <Heart size={12} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
      </div>

      {/* Product Image */}
      <div className="relative aspect-square bg-[#0A2A54]/40 overflow-hidden flex items-center justify-center p-3 sm:p-4">
        <img
          src={deal.image}
          alt={deal.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
          loading="lazy"
        />
        {/* Quick Add Overlay: Always visible on mobile, reveals on hover on desktop */}
        <div className="absolute inset-x-2 bottom-2 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-200 pointer-events-auto">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-1.5 sm:py-2 rounded-lg sm:rounded-xl ${
              isAdded ? 'bg-[#10B981] text-white' : 'bg-[#E11D48] hover:bg-[#E11D48]/90 text-white'
            } font-bold text-[9.5px] sm:text-[10px] tracking-wider uppercase transition-all flex items-center justify-center gap-1 shadow-xl cursor-pointer active:scale-95`}
          >
            {isAdded ? (
              <>
                <Check size={11} strokeWidth={3} />
                <span>Added</span>
              </>
            ) : (
              <>
                <Plus size={11} strokeWidth={3} />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-3.5 border-t border-white/5 bg-[#00142e]/85 z-10 relative flex-1 flex flex-col justify-between gap-1">
        <div>
          <span className="text-[9.5px] sm:text-[10px] uppercase tracking-wider text-[#3DE0FF] font-semibold block truncate">
            {deal.brand}
          </span>
          <h3 className="text-[11.5px] sm:text-xs font-editorial text-white font-medium group-hover:text-[#F13365] transition-colors truncate mt-0.5">
            {deal.name}
          </h3>
        </div>

        {/* Dedicated Price Row */}
        <div className="flex items-baseline gap-1.5 tabular-nums pt-1 border-t border-white/[0.04]">
          <span className="text-white font-bold text-xs sm:text-sm">
            {formatPrice(deal.currentPrice)}
          </span>
          <span className="text-white/40 line-through text-[10px] sm:text-[11px]">
            {formatPrice(deal.originalPrice)}
          </span>
        </div>
      </div>
    </div>
  );
}

function FlipDigit({ value, colorClass }: { value: string; colorClass: string }) {
  const [displayVal, setDisplayVal] = useState(value);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    if (value !== displayVal) {
      setAnimating(true);
      const timer = setTimeout(() => {
        setDisplayVal(value);
        setAnimating(false);
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [value, displayVal]);

  return (
    <span
      className={`inline-block min-w-[16px] text-center font-mono font-bold text-xs ${colorClass} transition-all duration-150 will-change-transform ${
        animating ? '-translate-y-1.5 opacity-0 scale-90' : 'translate-y-0 opacity-100 scale-100'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {displayVal}
    </span>
  );
}

export function DealsSection() {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 22, seconds: 52 });

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const sectionRef = useReveal<HTMLElement>({
    y: 24,
    scale: 1,
    childSelector: '.deal-product-card',
    stagger: 0.07,
    duration: 700,
    margin: '-8%',
  });

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDigit = (num: number) => String(num).padStart(2, '0');
  const totalSeconds = 4 * 3600 + 32 * 60 + 15;
  const currentSeconds = timeLeft.hours * 3600 + timeLeft.minutes * 60 + timeLeft.seconds;
  const progressRatio = Math.max(0, Math.min(1, currentSeconds / totalSeconds));

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-14 bg-[#012148] border-b border-white/5"
      id="dealsSectionRoot"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div className="deals-header-left">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-[#F13365] mb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F13365] animate-pulse" />
              <span>Flash Sale</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
              Today&apos;s Offers
            </h2>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 deals-header-right w-full sm:w-auto">
            <Link
              href="/category?sort=sale"
              className="text-xs font-semibold text-white/70 hover:text-white transition-colors"
            >
              All deals
            </Link>

            {/* Live Countdown Pill with Flip Digits & Progress Track */}
            <div
              className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#040a14]/90 border border-[#3DE0FF]/25 text-xs text-white shadow-[0_0_15px_rgba(61,224,255,0.12)] overflow-hidden flex-shrink-0 backdrop-blur-md"
              id="dealCountdownDisplay"
              aria-label="Offer Countdown"
            >
              {/* Pulsing Live Dot */}
              <span className="relative flex h-1.5 w-1.5 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F13365] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#F13365]" />
              </span>
              <span className="text-white/60 text-[10.5px] font-medium tracking-wide">Closes in</span>
              <div className="font-mono font-bold text-xs tracking-wider text-white tabular-nums flex items-center gap-0.5">
                <FlipDigit value={formatDigit(timeLeft.hours)} colorClass="text-[#3DE0FF]" />
                <span className="text-white/40 animate-pulse">:</span>
                <FlipDigit value={formatDigit(timeLeft.minutes)} colorClass="text-[#3DE0FF]" />
                <span className="text-white/40 animate-pulse">:</span>
                <FlipDigit value={formatDigit(timeLeft.seconds)} colorClass="text-[#F13365]" />
              </div>
              {/* GPU scaleX progress bar */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
                <div
                  id="dealProgressBar"
                  className="h-full bg-gradient-to-r from-[#3DE0FF] to-[#F13365] origin-left will-change-transform"
                  style={{ transform: `scaleX(${progressRatio})`, transition: 'transform 950ms linear' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Deals Grid: Smooth swipeable rail on mobile, 5-column grid on desktop */}
        <div
          className="flex overflow-x-auto sm:grid sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-webkit-overflow-scrolling:touch]"
          id="dealsCarouselGrid"
          style={{ perspective: '1200px' }}
        >
          {FLASH_DEALS.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              wishlisted={mounted ? isWishlisted(deal.id) : false}
              onAdd={addItem}
              onWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
