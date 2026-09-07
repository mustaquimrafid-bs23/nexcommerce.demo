'use client';

import React from 'react';
import { RotateCcw, ShieldCheck, Lock, Leaf } from 'lucide-react';

export function OrderConfidenceStrip() {
  const badges = [
    {
      icon: RotateCcw,
      label: 'Free Returns',
      sub: '14-day free returns',
      color: 'text-accent-cyan',
      bg: 'bg-accent-cyan/10 border-accent-cyan/20',
    },
    {
      icon: ShieldCheck,
      label: '100% Authentic',
      sub: 'Direct from makers',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Lock,
      label: 'Secure Checkout',
      sub: 'Bank-grade secure checkout',
      color: 'text-accent-pink',
      bg: 'bg-accent-pink/10 border-accent-pink/20',
    },
    {
      icon: Leaf,
      label: 'Carbon Neutral',
      sub: '100% climate neutral delivery',
      color: 'text-teal-400',
      bg: 'bg-teal-500/10 border-teal-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl bg-surface-navy/30 border border-white/10 my-8 backdrop-blur-md">
      {badges.map((badge, idx) => {
        const Icon = badge.icon;
        return (
          <div key={idx} className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${badge.bg} border flex items-center justify-center flex-shrink-0 ${badge.color}`}>
              <Icon size={18} />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-white tracking-wide uppercase">
                {badge.label}
              </span>
              <span className="text-[11px] text-white/50">{badge.sub}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
