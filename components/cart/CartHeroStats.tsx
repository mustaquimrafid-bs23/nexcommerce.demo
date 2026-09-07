'use client';

import React from 'react';
import { ShoppingBag, Sparkles, Leaf, Shield } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CartHeroStatsProps {
  itemCount: number;
  subtotal: number;
  discountAmount: number;
}

export function CartHeroStats({ itemCount, subtotal, discountAmount }: CartHeroStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-3xl bg-surface-card border border-white/10 shadow-xl">
      <div className="space-y-0.5">
        <span className="text-[10px] font-mono uppercase text-white/40 block">Bag Volume</span>
        <div className="text-xl font-bold font-mono text-white flex items-center gap-1.5">
          <ShoppingBag size={16} className="text-accent-cyan" />
          <span>{itemCount} {itemCount === 1 ? 'Piece' : 'Pieces'}</span>
        </div>
      </div>

      <div className="space-y-0.5">
        <span className="text-[10px] font-mono uppercase text-white/40 block">Total Value</span>
        <div className="text-xl font-bold font-mono text-white">
          {formatPrice(subtotal)}
        </div>
      </div>

      <div className="space-y-0.5">
        <span className="text-[10px] font-mono uppercase text-white/40 block">Client Savings</span>
        <div className="text-xl font-bold font-mono text-accent-pink flex items-center gap-1.5">
          <Sparkles size={16} />
          <span>{discountAmount > 0 ? `-${formatPrice(discountAmount)}` : '€0.00'}</span>
        </div>
      </div>

      <div className="space-y-0.5">
        <span className="text-[10px] font-mono uppercase text-white/40 block">Carbon Offset</span>
        <div className="text-sm font-semibold text-emerald-400 flex items-center gap-1.5 pt-0.5">
          <Leaf size={15} />
          <span>100% Climate Neutral</span>
        </div>
      </div>
    </div>
  );
}
