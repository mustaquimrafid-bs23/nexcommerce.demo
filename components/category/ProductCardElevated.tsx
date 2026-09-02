'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Product } from '@/types/catalog';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

interface ProductCardElevatedProps {
  product: Product;
  parallaxDepth?: number;
  onQuickLook?: (product: Product) => void;
}

const MAX_TILT = 5.5;
const LERP_IN = 0.12;
const LERP_OUT = 0.18;

export function ProductCardElevated({ product, parallaxDepth = 1, onQuickLook }: ProductCardElevatedProps) {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeColor, setActiveColor] = useState<string>(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setActiveImage(product.image);
    if (product.colors && product.colors.length > 0) {
      setActiveColor(product.colors[0].name);
    }
  }, [product]);

  // 3D Spring Tilt Physics & Specular Reflection
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 1024) return;

    let rafId: number | null = null;
    let curTX = 0;
    let curTY = 0;
    let tgtTX = 0;
    let tgtTY = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, LERP_IN);
      curTY = lerp(curTY, tgtTY, LERP_IN);
      el!.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateY(-4px)`;
      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        rafId = null;
      }
    }

    function springBack() {
      curTX = lerp(curTX, 0, LERP_OUT);
      curTY = lerp(curTY, 0, LERP_OUT);
      el!.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateY(0)`;
      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(springBack);
      } else {
        el!.style.transform = '';
        rafId = null;
      }
    }

    const onMove = (e: MouseEvent) => {
      const r = el!.getBoundingClientRect();
      const centerX = r.width / 2;
      const centerY = r.height / 2;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      tgtTX = ((y - centerY) / centerY) * -MAX_TILT;
      tgtTY = ((x - centerX) / centerX) * MAX_TILT;

      el!.style.setProperty('--plp-glare-x', `${x}px`);
      el!.style.setProperty('--plp-glare-y', `${y}px`);
      el!.style.setProperty('--plp-glare-opacity', '1');
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    };

    const onLeave = () => {
      tgtTX = 0;
      tgtTY = 0;
      el!.style.setProperty('--plp-glare-opacity', '0');
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

  const handleSwatchSelect = (e: React.MouseEvent, colorName: string, colorImg?: string) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveColor(colorName);
    if (colorImg) {
      setActiveImage(colorImg);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding || isAdded) return;

    setIsAdding(true);
    setTimeout(() => {
      addItem(
        product,
        product.sizes ? product.sizes[0] : undefined,
        activeColor || (product.colors ? product.colors[0].name : undefined)
      );
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }, 280);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const wishlisted = mounted ? isWishlisted(product.id) : false;
  const brandName = product.brand || 'Arc';

  return (
    <div
      ref={cardRef}
      onClick={() => router.push(`/product/${product.id}`)}
      className="plp-card luxury-product-card group relative rounded-[6px] bg-white/[0.04] border border-white/[0.09] hover:border-white/20 overflow-hidden flex flex-col justify-between shadow-xl transition-all duration-300 cursor-pointer will-change-transform"
      style={{ transformStyle: 'preserve-3d' }}
      data-id={product.id}
      data-parallax-depth={parallaxDepth}
    >
      {/* Specular Glare Overlay */}
      <div
        className="plp-card-specular pointer-events-none absolute inset-0 z-10 rounded-[6px]"
        style={
          {
            background:
              'radial-gradient(circle at var(--plp-glare-x, 50%) var(--plp-glare-y, 30%), rgba(255,255,255,0.12) 0%, transparent 60%)',
            opacity: 'var(--plp-glare-opacity, 0)',
            transition: 'opacity 200ms',
          } as React.CSSProperties
        }
        aria-hidden="true"
      />

      {/* 3:4 Media Frame */}
      <div className="plp-card-media relative aspect-[3/4] overflow-hidden bg-white/[0.03]">
        {/* Luxury Badge: NEW */}
        {product.isNew && (
          <span className="plp-luxury-badge absolute top-3 left-3 z-20 px-2 py-0.5 rounded-[2px] bg-obsidian-950/85 backdrop-blur-md border border-white/15 text-[9px] font-bold uppercase tracking-[0.14em] text-white">
            NEW
          </span>
        )}

        {/* Action Cluster: Wishlist & Quick Look */}
        <div className="card-top-actions absolute top-3 right-3 z-20 flex items-center gap-1.5">
          {onQuickLook && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickLook(product);
              }}
              className="p-2 rounded-full backdrop-blur-md border border-white/15 bg-obsidian-950/70 text-white/60 hover:text-white hover:border-white/40 transition-all cursor-pointer"
              aria-label={`Quick look at ${product.name}`}
              title="Quick Look Mini-PDP"
            >
              <Eye size={14} />
            </button>
          )}

          <button
            onClick={handleWishlist}
            className={`plp-card-wishlist ${
              wishlisted ? 'active' : ''
            } p-2 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
              wishlisted
                ? 'bg-accent-pink border-accent-pink text-white shadow-lg'
                : 'bg-obsidian-950/70 border-white/15 text-white/60 hover:text-white hover:border-white/40'
            }`}
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            data-id={product.id}
            title={wishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
          >
            <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Product Image */}
        <div className="w-full h-full flex items-center justify-center p-3">
          <img
            src={activeImage}
            alt={product.name}
            id={`cardImg_${product.id}`}
            className="plp-card-img w-full h-full object-contain group-hover:scale-[1.04] transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] drop-shadow-md"
            loading="lazy"
          />
        </div>

        {/* Slide-Up Quick Add Button */}
        <button
          onClick={handleQuickAdd}
          className={`plp-quick-add-btn btn-plp-add-to-bag absolute bottom-0 left-0 right-0 py-3 text-[10px] font-bold uppercase tracking-[0.14em] transition-transform duration-240 ease-[cubic-bezier(0.16,1,0.3,1)] transform translate-y-full group-hover:translate-y-0 flex items-center justify-center gap-1.5 cursor-pointer z-20 border-t border-white/12 ${
            isAdded
              ? 'bg-white text-obsidian-950 font-bold'
              : isAdding
              ? 'bg-white/90 text-obsidian-950'
              : 'bg-[#080e1e]/95 text-white hover:bg-white hover:text-obsidian-950'
          }`}
          data-id={product.id}
          aria-label={`Quick Add ${product.name} to Bag`}
        >
          {isAdded ? (
            <span>&#10003; ADDED TO BAG</span>
          ) : isAdding ? (
            <span>ADDING…</span>
          ) : (
            <>
              <ShoppingBag size={13} style={{ marginRight: '6px' }} />
              <span>QUICK ADD</span>
            </>
          )}
        </button>
      </div>

      {/* Strict 3-Item Luxury Metadata Section */}
      <div className="plp-card-info p-3 sm:p-3.5 flex-1 flex flex-col justify-between gap-1.5 z-10">
        <div>
          {/* Item 1: Brand & Category */}
          <div className="plp-card-brand-row">
            <span className="plp-card-category-label text-[9px] font-semibold uppercase tracking-[0.14em] text-white/35 block truncate">
              {brandName.toUpperCase()} · {product.category.toUpperCase()}
            </span>
          </div>

          {/* Item 2: Title */}
          <Link href={`/product/${product.id}`} className="plp-card-title-link block mt-0.5">
            <h3 className="plp-card-name font-editorial text-[13px] text-white font-semibold tracking-tight hover:text-accent-pink transition-colors truncate">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Item 3: Price + Tactile Color Swatches Row */}
        <div className="plp-card-bottom-row pt-2 flex items-center justify-between gap-2 border-t border-white/[0.04]">
          <div className="plp-card-price-tag text-[13px] font-medium text-white/80 tabular-nums">
            {product.formattedPrice || formatPrice(product.price, product.currency)}
          </div>

          {/* Tactile Circular Color Swatches */}
          {product.colors && product.colors.length > 1 && (
            <div
              className="plp-swatches-row flex items-center gap-1.5"
              role="radiogroup"
              aria-label={`Available colorways for ${product.name}`}
            >
              {product.colors.map((c) => {
                const isSelected = activeColor === c.name;
                return (
                  <button
                    key={c.name}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={(e) => handleSwatchSelect(e, c.name, c.img)}
                    className={`plp-swatch-dot w-3.5 h-3.5 rounded-full transition-all duration-150 cursor-pointer ${
                      isSelected
                        ? 'active ring-2 ring-[#3DE0FF] scale-110 shadow-sm'
                        : 'hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                    aria-label={c.name}
                    data-color-name={c.name}
                    data-card-id={product.id}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
