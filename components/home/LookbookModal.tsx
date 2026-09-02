'use client';

import React from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Sparkles, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { MASTER_PRODUCTS } from '@/data/products';

interface LookbookModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LookbookModal({ isOpen, onClose }: LookbookModalProps) {
  const { addItem } = useCartStore();

  if (!isOpen) return null;

  const runwayPieces = MASTER_PRODUCTS.slice(0, 3);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Autumn / Winter Lookbook Inspection"
    >
      <div className="relative w-full max-w-4xl rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-10 space-y-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Milano Fashion Week Runway Edit</span>
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Autumn / Winter <span className="italic font-normal">Shoppable Lookbook</span>
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Featured Runway Model Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-obsidian-950 border border-white/10 shadow-xl group">
              <img
                src="/assets/images/lifestyle/Gemini_Generated_Image_p8bt04p8bt04p8bt.jpg"
                alt="Autumn Winter Runway Look"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-obsidian-950/80 backdrop-blur-md border border-white/10 text-xs">
                <span className="text-accent-cyan font-semibold block">Look 07 &middot; Milan Debut</span>
                <span className="text-white/60 font-light">Double-faced cashmere overcoat layered with silk trousers</span>
              </div>
            </div>
          </div>

          {/* Shoppable Pieces in this Look */}
          <div className="lg:col-span-6 space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/70">
              Pieces In This Ensemble (3 Items)
            </h3>

            <div className="space-y-3">
              {runwayPieces.map((p) => (
                <div
                  key={p.id}
                  className="p-3.5 rounded-2xl bg-obsidian-950/60 border border-white/10 flex items-center justify-between gap-4 hover:border-white/25 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-surface-navy/40 p-1 shrink-0 flex items-center justify-center">
                      <img src={p.image} alt={p.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-white truncate max-w-[180px] sm:max-w-xs">{p.name}</h4>
                      <span className="font-mono text-xs text-white/80">&euro;{p.price.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => addItem(p, p.sizes ? p.sizes[0] : 'One Size')}
                    className="px-3.5 py-2 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-md"
                  >
                    <ShoppingBag size={12} />
                    <span>Quick Add</span>
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <Link
                href="/category?cat=all"
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/10"
              >
                <span>View All Runway Collections</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
