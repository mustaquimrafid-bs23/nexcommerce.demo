'use client';

import React from 'react';
import { X, Check } from 'lucide-react';
import { Product } from '@/types/catalog';

interface SearchWhyModalProps {
  product: Product | null;
  onClose: () => void;
}

export function SearchWhyModal({ product, onClose }: SearchWhyModalProps) {
  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-obsidian-900 border border-white/20 rounded-2xl p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-200 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-accent-cyan">
            DESIGN &amp; FIT EVIDENCE
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close evidence dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product Headline */}
        <div className="space-y-1">
          <h3 className="font-editorial text-xl font-normal text-white">
            {product.name}
          </h3>
          <p className="text-xs text-white/70 italic leading-relaxed">
            &ldquo;{product.reasoning || product.description}&rdquo;
          </p>
        </div>

        {/* Evidence List */}
        {product.whyExpanded && product.whyExpanded.length > 0 && (
          <div className="space-y-3 bg-surface-navy/50 p-4 rounded-xl border border-white/10">
            {product.whyExpanded.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs">
                <span className="w-4 h-4 rounded-full bg-accent-cyan/15 text-accent-cyan flex items-center justify-center flex-shrink-0 mt-0.5 border border-accent-cyan/30">
                  <Check size={10} strokeWidth={3} />
                </span>
                <div className="space-y-0.5">
                  <strong className="text-white font-semibold block">
                    {item.label}
                  </strong>
                  <p className="text-white/60 text-[11px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-accent-cyan hover:bg-accent-cyan/90 text-obsidian-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
