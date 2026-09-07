'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Check, ShoppingBag } from 'lucide-react';
import { Product } from '@/types/catalog';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

interface SearchWhyModalProps {
  product: Product | null;
  onClose: () => void;
}

export function SearchWhyModal({ product, onClose }: SearchWhyModalProps) {
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);

  if (!product || typeof document === 'undefined') return null;

  const handleAdd = () => {
    addItem(product, product.sizes ? product.sizes[0] : 'One Size');
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-[#02132d]/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-gradient-to-b from-[#0e3266] via-[#0a2652] to-[#071d3f] border border-[#3DE0FF]/40 rounded-2xl p-6 shadow-[0_24px_60px_rgba(2,19,45,0.9)] space-y-5 animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#3DE0FF]">
            DESIGN &amp; FIT EVIDENCE
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close evidence dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product Headline */}
        <div className="space-y-1">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-editorial text-xl font-normal text-white">
              {product.name}
            </h3>
            <span className="text-sm font-mono font-bold text-[#3DE0FF] shrink-0">
              {formatPrice(product.price)}
            </span>
          </div>
          <p className="text-xs text-white/80 italic leading-relaxed">
            &ldquo;{product.reasoning || product.description}&rdquo;
          </p>
        </div>

        {/* Evidence List */}
        {product.whyExpanded && product.whyExpanded.length > 0 && (
          <div className="space-y-3 bg-[#082248]/85 p-4 rounded-xl border border-[#1a4785]">
            {product.whyExpanded.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="w-4 h-4 rounded-full bg-[#3DE0FF]/15 text-[#3DE0FF] flex items-center justify-center flex-shrink-0 mt-0.5 border border-[#3DE0FF]/30">
                  <Check size={10} strokeWidth={3} />
                </span>
                <div className="space-y-0.5">
                  <strong className="text-white font-semibold block">
                    {item.label}
                  </strong>
                  <p className="text-white/70 text-[11px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleAdd}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
              isAdded
                ? 'bg-emerald-500 text-[#02132d]'
                : 'bg-[#143d78] hover:bg-[#1a4e96] text-white border border-white/20'
            }`}
          >
            <ShoppingBag size={13} />
            <span>{isAdded ? 'Added to Bag' : 'Add to Bag'}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#3DE0FF] hover:bg-[#32c5e2] text-[#02132d] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

