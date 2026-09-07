'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, Check, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { SmartListProduct } from '@/data/smartListProducts';
import { useCartStore } from '@/store/useCartStore';
import { CadenceAdjusterPopover } from './CadenceAdjusterPopover';

interface SmartListProductCardProps {
  product: SmartListProduct;
  isSelected: boolean;
  onToggleSelect: (productId: string) => void;
  onOpenQuickLook: (product: SmartListProduct) => void;
  onDismiss?: (productId: string) => void;
}

const MAX_TILT = 5.5;
const LERP_IN = 0.12;
const LERP_OUT = 0.18;

export function SmartListProductCard({
  product,
  isSelected,
  onToggleSelect,
  onOpenQuickLook,
  onDismiss,
}: SmartListProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [activeImage, setActiveImage] = useState(product.image);
  const [activeFinishId, setActiveFinishId] = useState(
    product.variants?.finishes?.[0]?.id || ''
  );
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    setActiveImage(product.image);
    if (product.variants?.finishes?.[0]?.id) {
      setActiveFinishId(product.variants.finishes[0].id);
    }
  }, [product]);

  // 3D Spring Tilt Physics & Specular Glare
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (typeof window !== 'undefined' && window.innerWidth < 1024) return;

    let rafId: number | null = null;
    let curTX = 0;
    let curTY = 0;
    let tgtTX = 0;
    let tgtTY = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, LERP_IN);
      curTY = lerp(curTY, tgtTY, LERP_IN);
      if (el) {
        el.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateY(-4px)`;
      }
      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        rafId = null;
      }
    }

    function springBack() {
      curTX = lerp(curTX, 0, LERP_OUT);
      curTY = lerp(curTY, 0, LERP_OUT);
      if (el) {
        el.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateY(0)`;
      }
      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(springBack);
      } else {
        if (el) el.style.transform = '';
        rafId = null;
      }
    }

    const onMove = (e: MouseEvent) => {
      if (!el) return;
      const r = el.getBoundingClientRect();
      const centerX = r.width / 2;
      const centerY = r.height / 2;
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;

      tgtTX = ((y - centerY) / centerY) * -MAX_TILT;
      tgtTY = ((x - centerX) / centerX) * MAX_TILT;

      el.style.setProperty('--sl-glare-x', `${x}px`);
      el.style.setProperty('--sl-glare-y', `${y}px`);
      el.style.setProperty('--sl-glare-opacity', '1');
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    };

    const onLeave = () => {
      tgtTX = 0;
      tgtTY = 0;
      if (el) {
        el.style.setProperty('--sl-glare-opacity', '0');
      }
      if (!rafId) rafId = requestAnimationFrame(springBack);
    };

    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);

    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleFinishClick = (finish: typeof product.variants.finishes[0], e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveFinishId(finish.id);
    if (finish.img) {
      setActiveImage(finish.img);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.inStock) return;
    setIsAdding(true);

    const selectedFinish = product.variants?.finishes?.find((f) => f.id === activeFinishId);
    const selectedSize = product.variants?.sizes?.find((s) => s.default)?.name || product.variants?.sizes?.[0]?.name;

    addItem(
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: product.price + (selectedFinish?.priceDelta || 0),
        formattedPrice: `€ ${(product.price + (selectedFinish?.priceDelta || 0)).toFixed(2)}`,
        currency: 'EUR',
        description: product.materials,
        image: activeImage,
        inStock: product.inStock,
      },
      selectedSize,
      selectedFinish?.name
    );

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 1800);
    }, 300);
  };

  const isSpecialOffer = !!(product.originalPrice && product.originalPrice > product.price);

  return (
    <div
      ref={cardRef}
      onClick={() => onOpenQuickLook(product)}
      className={`group relative flex flex-col rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer bg-surface-navy/60 border ${
        isSelected
          ? 'border-accent-cyan shadow-[0_0_30px_rgba(61,224,255,0.22)] ring-1 ring-accent-cyan/60'
          : 'border-white/10 hover:border-white/25 hover:shadow-2xl'
      }`}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Dynamic Specular Glare Layer */}
      <div
        className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-300 rounded-2xl"
        style={{
          opacity: 'var(--sl-glare-opacity, 0)',
          background:
            'radial-gradient(circle 280px at var(--sl-glare-x, 50%) var(--sl-glare-y, 50%), rgba(255,255,255,0.12) 0%, rgba(61,224,255,0.06) 40%, transparent 80%)',
        }}
      />

      {/* Top Bar Actions & Badges */}
      <div className="absolute top-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
        {/* Ambient Selection Ring */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(product.id);
          }}
          className={`pointer-events-auto flex items-center justify-center w-7 h-7 rounded-full backdrop-blur-md transition-all duration-200 cursor-pointer border ${
            isSelected
              ? 'bg-accent-cyan text-obsidian-950 border-accent-cyan shadow-[0_0_12px_rgba(61,224,255,0.6)] scale-105'
              : 'bg-obsidian-950/70 text-transparent border-white/25 hover:border-accent-cyan/70 hover:scale-105'
          }`}
          aria-label={isSelected ? `Deselect ${product.name}` : `Select ${product.name}`}
          aria-pressed={isSelected}
        >
          <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'text-obsidian-950' : 'opacity-0'}`} />
        </button>

        {/* Special Offer or Out of Stock Badge & Dismiss button */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          {isSpecialOffer && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.14em] uppercase bg-accent-pink/20 border border-accent-pink/40 text-accent-pink shadow-sm">
              SPECIAL OFFER
            </span>
          )}
          {!product.inStock && (
            <span className="px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-[0.14em] uppercase bg-obsidian-900/90 border border-white/20 text-white/60">
              OUT OF STOCK
            </span>
          )}
          {onDismiss && (
            <button
              type="button"
              data-dismiss
              onClick={(e) => {
                e.stopPropagation();
                onDismiss(product.id);
              }}
              className="w-7 h-7 rounded-full bg-obsidian-950/70 hover:bg-accent-pink/25 border border-white/20 hover:border-accent-pink/50 text-white/50 hover:text-accent-pink flex items-center justify-center transition-all cursor-pointer"
              title="Remove from Smart List"
              aria-label={`Remove ${product.name} from Smart List`}
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Product Silhouette Image Stage */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)] flex items-center justify-center p-4">
        <img
          src={activeImage}
          alt={product.name}
          className={`w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-105 ${
            !product.inStock ? 'grayscale-[0.3] opacity-75' : ''
          }`}
          loading="lazy"
        />

        {/* Bottom Swatch Strip inside image area */}
        {product.variants?.finishes && product.variants.finishes.length > 0 && (
          <div
            className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 p-1 rounded-full bg-obsidian-950/80 border border-white/10 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            {product.variants.finishes.map((finish) => {
              const isActive = finish.id === activeFinishId;
              return (
                <button
                  key={finish.id}
                  type="button"
                  onClick={(e) => handleFinishClick(finish, e)}
                  title={finish.name}
                  aria-label={finish.name}
                  className={`w-3.5 h-3.5 rounded-full transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'ring-2 ring-accent-cyan scale-110 shadow-[0_0_8px_rgba(61,224,255,0.6)]'
                      : 'opacity-70 hover:opacity-100 hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: finish.color,
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Card Information Body */}
      <div className="flex flex-col p-4 sm:p-5 flex-grow justify-between border-t border-white/10 bg-obsidian-950/60">
        <div className="space-y-1 mb-3">
          <div className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-accent-cyan/80">
            {product.brand} · {product.categoryLabel}
          </div>
          <h3 className="text-sm sm:text-[15px] font-semibold text-white tracking-tight line-clamp-1 group-hover:text-accent-cyan transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline justify-between gap-2 pt-0.5">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-bold text-white tabular-nums tracking-tight">
                € {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-white/40 line-through tabular-nums">
                  € {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* Replenishment Cadence Indicator */}
            <CadenceAdjusterPopover
              productId={product.id}
              productName={product.name}
              initialDays={product.avgIntervalDays || 30}
            />
          </div>
        </div>

        {/* Action Button: Add to Bag or Out of Stock */}
        <div>
          {product.inStock ? (
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isAdding}
              className={`w-full py-2.5 px-3 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                isAdded
                  ? 'bg-emerald-500 text-obsidian-950 font-bold'
                  : 'bg-white/[0.08] hover:bg-white text-white hover:text-obsidian-950 border border-white/15 hover:border-white shadow-md active:scale-[0.98]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Bag</span>
                </>
              )}
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full py-2.5 px-3 rounded-xl font-semibold text-xs tracking-wider uppercase bg-white/[0.03] text-white/30 border border-white/5 cursor-not-allowed text-center"
            >
              Out of Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
