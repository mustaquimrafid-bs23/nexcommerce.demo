'use client';

import React from 'react';
import { Sparkles, Zap, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export function SmartSavingsAdvisor() {
  const { items, getSubtotal, appliedCoupon, applyCoupon } = useCartStore();
  const subtotal = getSubtotal();

  if (items.length === 0) return null;

  // Determine optimal promo code based on subtotal
  const bestCode = subtotal >= 150 ? 'VIP20' : 'NEX10';
  const discountPercent = bestCode === 'VIP20' ? 20 : 10;
  const potentialSavings = (subtotal * discountPercent) / 100;
  const isApplied = appliedCoupon === bestCode;

  return (
    <div className="p-4 rounded-xl bg-gradient-to-br from-accent-cyan/15 via-[#081838] to-[#040D22] border border-accent-cyan/30 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs font-bold text-accent-cyan tracking-wider uppercase">
          <Sparkles size={14} />
          <span>Savings Advisor</span>
        </div>
        <div className="text-right">
          <span className="text-sm font-bold text-emerald-400 tabular-nums">
            Save {formatPrice(potentialSavings)}
          </span>
        </div>
      </div>

      <p className="text-xs text-white/75 leading-snug">
        Code <strong className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">{bestCode}</strong> ({discountPercent}% off) gives you the best available savings on your selection.
      </p>

      <button
        type="button"
        onClick={() => applyCoupon(bestCode)}
        disabled={isApplied}
        className={`w-full py-2.5 px-4 rounded-lg text-xs font-bold tracking-wide uppercase flex items-center justify-center gap-2 transition-all ${
          isApplied
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default'
            : 'bg-emerald-400 hover:bg-emerald-300 text-obsidian-950 shadow-md shadow-emerald-500/20 active:scale-98'
        }`}
      >
        {isApplied ? (
          <>
            <Check size={14} />
            <span>Optimal Discount Applied</span>
          </>
        ) : (
          <>
            <Zap size={14} />
            <span>Apply Promo ({bestCode} · Save {formatPrice(potentialSavings)})</span>
          </>
        )}
      </button>
    </div>
  );
}
