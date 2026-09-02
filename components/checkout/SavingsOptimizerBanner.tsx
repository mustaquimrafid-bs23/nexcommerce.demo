'use client';

import React from 'react';
import { Sparkles, Tag, Check } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface SavingsOptimizerBannerProps {
  subtotal: number;
  appliedCoupon: string | null;
  onApplyCoupon: (code: string) => void;
}

export function SavingsOptimizerBanner({
  subtotal,
  appliedCoupon,
  onApplyCoupon,
}: SavingsOptimizerBannerProps) {
  const isEligibleForAtelier10 = subtotal >= 100;
  const isEligibleForVip50 = subtotal >= 500;

  let recommendation = {
    code: 'ATELIER10',
    discount: '10% OFF',
    desc: 'Available on all atelier orders over €100.00',
  };

  if (isEligibleForVip50) {
    recommendation = {
      code: 'VIP50',
      discount: '€50.00 OFF',
      desc: 'Exclusive high-cart tier savings applied to orders over €500.00',
    };
  }

  const isApplied = appliedCoupon === recommendation.code;

  return (
    <div className="p-4 rounded-2xl bg-surface-card border border-accent-pink/30 space-y-3 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-accent-pink" />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink">
            Smart Savings Advisor
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink text-[10px] font-bold">
          {recommendation.discount}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
            <Tag size={12} className="text-accent-cyan" />
            <span>Code: {recommendation.code}</span>
          </div>
          <p className="text-[11px] text-white/60 font-light">{recommendation.desc}</p>
        </div>

        <button
          type="button"
          onClick={() => onApplyCoupon(recommendation.code)}
          disabled={isApplied}
          className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
            isApplied
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-accent-pink hover:bg-accent-pink/90 text-white shadow-md'
          }`}
        >
          {isApplied ? (
            <span className="flex items-center gap-1">
              <Check size={12} />
              <span>Applied</span>
            </span>
          ) : (
            <span>Apply Coupon</span>
          )}
        </button>
      </div>
    </div>
  );
}
