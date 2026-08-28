'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Sparkles, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';
import { useReveal } from '@/hooks/useReveal';

interface CuratedItem {
  id: string;
  badge: string;
  brand: string;
  name: string;
  price: number;
  image: string;
  category: 'outerwear' | 'tailoring' | 'footwear' | 'accessories';
  parallaxDepth: number;
}

const CURATED_PRODUCTS: CuratedItem[] = [
  { id: 'p1', badge: 'Top Pick',        brand: 'ARC',   name: 'Cashmere Knit Jumper',          price: 185, image: '/assets/images/products/hero_sweater.png',        category: 'outerwear',   parallaxDepth: 1 },
  { id: 'p2', badge: 'Staff Favourite', brand: 'ARC',   name: 'Tailored Wool Blazer',          price: 245, image: '/assets/images/products/plp_blazer.png',           category: 'tailoring',   parallaxDepth: 2 },
  { id: 'p7', badge: 'Trending Now',    brand: 'FORMA', name: 'Quilted Leather Tote Bag',      price: 285, image: '/assets/images/products/prod_tote.png',            category: 'accessories', parallaxDepth: 3 },
  { id: 'p4', badge: 'Most Loved',      brand: 'FORM',  name: 'Wireless Over-Ear Headphones',  price: 320, image: '/assets/images/lifestyle/thumb_headphones.jpg',    category: 'accessories', parallaxDepth: 2 },
];

const MAX_TILT = 6.5;
const LERP_IN = 0.12;
const LERP_OUT = 0.18;

function CuratedCard({ product, onAdd, onWishlist, wishlisted }: {
  product: CuratedItem;
  onAdd: (p: Product) => void;
  onWishlist: (p: Product) => void;
  wishlisted: boolean;
}) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    let rafId: number | null = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, LERP_IN);
      curTY = lerp(curTY, tgtTY, LERP_IN);
      el!.style.transform = `perspective(900px) rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px)`;
      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyTilt);
      } else { rafId = null; }
    }

    function springBack() {
      curTX = lerp(curTX, 0, LERP_OUT);
      curTY = lerp(curTY, 0, LERP_OUT);
      el!.style.transform = `perspective(900px) rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg)`;
      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(springBack);
      } else { el!.style.transform = ''; rafId = null; }
    }

    const onMove = (e: MouseEvent) => {
      const r = el!.getBoundingClientRect();
      tgtTX = -((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * MAX_TILT;
      tgtTY = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * MAX_TILT;
      el!.style.setProperty('--curated-glare-x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      el!.style.setProperty('--curated-glare-y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      el!.style.setProperty('--curated-glare-opacity', '1');
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    };

    const onLeave = () => {
      tgtTX = 0; tgtTY = 0;
      el!.style.setProperty('--curated-glare-opacity', '0');
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const productForStore: Product = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: product.price,
    currency: 'EUR',
    description: product.name,
    image: product.image,
    tag: product.badge,
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAdd(productForStore);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1400);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWishlist(productForStore);
  };

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/product/${product.id}`)}
      className="curated-product-card group relative rounded-xl sm:rounded-2xl bg-gradient-to-b from-[#0e1a32]/70 to-[#050e1e]/90 border border-white/10 overflow-hidden flex flex-col justify-between will-change-transform shadow-md hover:border-white/25 transition-all flex-shrink-0 w-[220px] sm:w-auto snap-start cursor-pointer"
      data-parallax-depth={product.parallaxDepth}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Specular Glare */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl z-10"
        style={{
          background: 'radial-gradient(circle at var(--curated-glare-x, 50%) var(--curated-glare-y, 30%), rgba(255,255,255,0.09) 0%, transparent 55%)',
          opacity: 'var(--curated-glare-opacity, 0)',
          transition: 'opacity 200ms',
        } as React.CSSProperties}
      />

      {/* Match Badge */}
      <div className="curated-match-badge match-badge absolute top-2 left-2 sm:top-3 sm:left-3 z-20 inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-[#040c1c]/85 backdrop-blur-md border border-[#3DE0FF]/30 text-[9px] sm:text-[10.5px] font-bold text-white shadow-md">
        <Sparkles size={10} className="text-[#3DE0FF] sm:w-[11px] sm:h-[11px]" />
        <span>{product.badge}</span>
      </div>

      {/* Wishlist Button */}
      <button
        onClick={handleWishlistClick}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-20 p-1.5 sm:p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
          wishlisted
            ? 'bg-[#F13365] border-[#F13365] text-white'
            : 'bg-[#040c1c]/80 border-white/15 text-white/60 hover:text-white hover:border-white/30'
        }`}
        aria-label={`Save ${product.name} to wishlist`}
      >
        <Heart size={12} className="sm:w-[14px] sm:h-[14px]" fill={wishlisted ? 'currentColor' : 'none'} />
      </button>

      {/* Product Visual Container */}
      <div className="relative aspect-square sm:aspect-[1/1.12] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,rgba(0,0,0,0.25)_100%)] overflow-hidden flex items-center justify-center p-3 sm:p-5">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
          loading="lazy"
        />
        {/* Bottom Vignette */}
        <div className="absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-t from-[#050e1e]/90 to-transparent pointer-events-none" />

        {/* Quick Add Overlay: Visible on mobile, hover on desktop */}
        <div className="absolute inset-x-2 bottom-2 sm:inset-x-3 sm:bottom-3 z-20 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-2 sm:group-hover:translate-y-0 transition-all duration-200 pointer-events-auto">
          <button
            onClick={handleQuickAdd}
            className={`curated-quick-add-btn w-full py-1.5 sm:py-2.5 rounded-lg ${
              isAdded ? 'bg-[#10B981] text-white' : 'bg-white/95 hover:bg-white text-[#011630]'
            } font-bold text-[9.5px] sm:text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-xl cursor-pointer active:scale-95`}
          >
            {isAdded ? (
              <>
                <Check size={12} className="sm:w-[13px] sm:h-[13px]" strokeWidth={3} />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={12} className="sm:w-[13px] sm:h-[13px]" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-2.5 sm:p-4 border-t border-white/5 bg-[#00142e]/80 flex-1 flex flex-col justify-between gap-1 z-10">
        <div>
          <span className="text-[9.5px] sm:text-[10.5px] uppercase tracking-wider text-[#3DE0FF] font-semibold block truncate">
            {product.brand}
          </span>
          <h3 className="font-editorial text-[12px] sm:text-sm text-white font-medium group-hover:text-[#F13365] transition-colors truncate mt-0.5">
            {product.name}
          </h3>
        </div>

        <div className="pt-1 border-t border-white/[0.04]">
          <span className="text-white font-bold text-xs sm:text-sm tabular-nums block">
            {formatPrice(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function ProductGrid() {
  const [mounted, setMounted] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  const sectionRef = useReveal<HTMLElement>({
    y: 28,
    scale: 0.96,
    childSelector: '.curated-product-card',
    stagger: 0.08,
    duration: 750,
    margin: '-8%',
  });

  useEffect(() => { setMounted(true); }, []);

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-16 bg-[#012148] border-b border-white/5"
      id="homeCuratedSection"
      aria-label="Recommended for You"
      style={{ perspective: '1200px' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5 sm:space-y-6">
        {/* Section Header */}
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.14em] uppercase text-[#3DE0FF] mb-0.5">
              <span>Picked for You</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl lg:text-4xl text-white font-normal">
              Our Favourite Styles.
            </h2>
          </div>
          <Link
            href="/category?cat=all"
            className="curated-see-all-link text-xs font-semibold text-white/70 hover:text-white transition-colors whitespace-nowrap flex-shrink-0"
          >
            View all items &rarr;
          </Link>
        </div>

        {/* Horizontal Swipe Rail on Mobile, 4 Columns on Desktop — Storefront Elevation Parity */}
        <div className="flex overflow-x-auto sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5 pb-3 sm:pb-0 snap-x snap-mandatory scrollbar-none [scrollbar-width:none] [-webkit-overflow-scrolling:touch]" id="curatedGrid">
          {CURATED_PRODUCTS.map((product) => (
            <CuratedCard
              key={product.id}
              product={product}
              wishlisted={mounted ? isWishlisted(product.id) : false}
              onAdd={addItem}
              onWishlist={toggleWishlist}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
