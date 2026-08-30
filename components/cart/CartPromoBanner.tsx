'use client';

import React, { useState } from 'react';
import { Sparkles, Clock, Copy, Check, Zap } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

export function CartPromoBanner() {
  const [copied, setCopied] = useState(false);
  const [appliedNotice, setAppliedNotice] = useState(false);
  const { applyCoupon, appliedCoupon } = useCartStore();

  const handleCopy = () => {
    navigator.clipboard.writeText('VIP20');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApply = () => {
    const res = applyCoupon('VIP20');
    if (res.success) {
      setAppliedNotice(true);
      setTimeout(() => setAppliedNotice(false), 3000);
    }
  };

  const isApplied = appliedCoupon === 'VIP20';

  return (
    <section
      id="cartPromoBanner"
      className="relative rounded-2xl overflow-hidden border border-accent-cyan/25 bg-gradient-to-br from-surface-navy/70 via-obsidian-900/85 to-obsidian-950/95 shadow-2xl my-8 transition-all hover:border-accent-cyan/40"
      aria-label="Exclusive Seasonal Promotion"
    >
      {/* Ambient glow */}
      <div className="absolute -top-10 -right-10 w-52 h-52 bg-accent-cyan/15 rounded-full blur-3xl pointer-events-none" />

      <div className="grid grid-cols-1 md:grid-cols-12 relative z-10">
        {/* Visual Banner Media */}
        <div className="md:col-span-4 relative min-h-[170px] overflow-hidden bg-black/40">
          <img
            src="/assets/images/lifestyle/category_hero_banner.jpg"
            alt="Special Seasonal Promotion"
            className="w-full h-full object-cover object-center transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-obsidian-950/40 to-obsidian-950/95 md:block hidden" />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/95 via-transparent to-transparent md:hidden block" />
          
          <div className="absolute top-3.5 left-3.5 bg-gradient-to-br from-accent-cyan to-emerald-400 text-obsidian-950 px-3 py-1.5 rounded-lg flex flex-col items-center leading-none font-bold shadow-lg shadow-accent-cyan/30">
            <span className="text-base tracking-tight font-extrabold">20%</span>
            <span className="text-[9px] uppercase tracking-wider font-bold">OFF</span>
          </div>
        </div>

        {/* Promo Content */}
        <div className="md:col-span-8 p-6 md:p-7 flex flex-col justify-center gap-3">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-wider uppercase text-accent-cyan bg-accent-cyan/10 border border-accent-cyan/25 px-2.5 py-1 rounded">
              <Sparkles size={12} />
              <span>Exclusive Offer</span>
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-white/60">
              <Clock size={12} />
              <span>Limited Time</span>
            </span>
          </div>

          <h3 className="text-xl font-editorial text-white font-medium">
            Season Privilege &middot; Save 20%
          </h3>

          <p className="text-xs text-white/75 leading-relaxed max-w-xl">
            Apply code <strong className="text-accent-cyan font-semibold">VIP20</strong> at checkout to unlock 20% savings on your entire order over &euro;150.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            {/* Code Copy Box */}
            <div
              onClick={handleCopy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-dashed border-accent-cyan/40 hover:border-accent-cyan hover:bg-accent-cyan/10 transition-all cursor-pointer text-xs"
              title="Click to copy code"
            >
              <span className="text-[10px] font-bold text-white/50 tracking-wider">CODE:</span>
              <span className="font-mono font-bold text-white tracking-wide">VIP20</span>
              <button
                type="button"
                className="text-accent-cyan hover:text-white transition-colors"
                aria-label="Copy code"
              >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              </button>
            </div>

            {/* 1-Click Apply Button */}
            <button
              type="button"
              onClick={handleApply}
              disabled={isApplied}
              className={`h-9 px-5 rounded-lg text-xs font-bold tracking-wider uppercase inline-flex items-center gap-2 transition-all shadow-md ${
                isApplied
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                  : 'bg-gradient-to-r from-accent-cyan to-emerald-400 hover:from-accent-cyan/90 hover:to-emerald-300 text-obsidian-950 shadow-accent-cyan/20 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              <Zap size={14} />
              <span>{isApplied ? 'Discount Applied' : 'Apply 20% Discount'}</span>
            </button>

            {appliedNotice && (
              <span className="text-xs text-emerald-400 font-medium animate-fade-in">
                ✓ Promo code applied!
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
