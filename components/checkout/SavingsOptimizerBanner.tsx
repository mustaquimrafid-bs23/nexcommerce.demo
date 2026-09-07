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
  const isEligibleForVip50 = subtotal >= 500;
  const isEligibleForVip20 = subtotal >= 100;

  let recommendation = {
    code: 'VIP20',
    discount: '20% OFF',
    desc: 'Save 20% on orders over €100.00',
  };

  if (isEligibleForVip50) {
    recommendation = {
      code: 'VIP50',
      discount: '€50.00 OFF',
      desc: 'Save €50.00 on orders over €500.00',
    };
  }

  const isApplied = appliedCoupon === recommendation.code;

  if (!isEligibleForVip20) {
    return null;
  }

  return (
    <div className="p-4 rounded-2xl bg-gradient-to-br from-[#0A2A54]/90 to-[#01132B]/95 border border-accent-pink/30 space-y-3 shadow-lg backdrop-blur-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={15} className="text-accent-pink" />
          <span className="text-[11px] font-bold uppercase tracking-widest text-accent-pink">
            Promotional Discount
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink text-[10px] font-bold">
          {recommendation.discount}
        </span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-white/5">
        <div className="space-y-0.5">
          <div className="text-xs font-semibold text-white flex items-center gap-1.5 font-mono">
            <Tag size={12} className="text-accent-cyan" />
            <span>Code: {recommendation.code}</span>
          </div>
          <p className="text-[11px] text-white/60 font-normal">{recommendation.desc}</p>
        </div>

        <button
          type="button"
          onClick={() => onApplyCoupon(recommendation.code)}
          disabled={isApplied}
          className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shrink-0 ${
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
            <span>Apply Voucher</span>
          )}
        </button>
      </div>
    </div>
  );
}
