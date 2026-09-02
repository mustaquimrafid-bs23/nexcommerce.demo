'use client';

import React from 'react';
import { ShoppingBag } from 'lucide-react';

interface MobileStickyBarProps {
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  onAddToCart: () => void;
}

export function MobileStickyBar({
  price,
  selectedSize,
  selectedColor,
  onAddToCart,
}: MobileStickyBarProps) {
  return (
    <div
      id="mobileStickyBar"
      className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-4 bg-obsidian-950/90 backdrop-blur-xl border-t border-white/10 shadow-2xl flex items-center justify-between gap-4"
    >
      <div className="space-y-0.5">
        <div id="stickyPriceLabel" className="font-mono text-base font-bold text-white">
          &euro;{price.toFixed(2)}
        </div>
        <div id="stickySizeLabel" className="text-[11px] text-white/60 font-light truncate max-w-[160px]">
          {selectedSize ? `Size ${selectedSize}` : 'One Size'} {selectedColor ? `· ${selectedColor}` : ''}
        </div>
      </div>

      <button
        type="button"
        onClick={onAddToCart}
        className="px-6 py-3 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-accent-crimson/25"
      >
        <ShoppingBag size={14} />
        <span>ADD TO BAG</span>
      </button>
    </div>
  );
}
