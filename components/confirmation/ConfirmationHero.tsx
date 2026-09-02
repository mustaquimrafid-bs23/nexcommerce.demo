'use client';

import React from 'react';

interface ConfirmationHeroProps {
  customerName?: string;
  customerEmail?: string;
}

export function ConfirmationHero({
  customerName = 'Julian Wright',
  customerEmail = 'julian@example.com',
}: ConfirmationHeroProps) {
  return (
    <div className="text-center mb-8 sm:mb-12 relative">
      {/* Glowing Emerald Checkmark Halo */}
      <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-400/40 shadow-[0_0_35px_rgba(52,211,153,0.25)] flex items-center justify-center mx-auto mb-5 relative animate-[haloPulse_3s_ease-in-out_infinite]">
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#34D399"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      {/* Live Status Pill */}
      <div className="inline-flex items-center gap-2 font-sans text-[11px] font-bold tracking-[0.16em] uppercase text-emerald-400 bg-emerald-400/10 border border-emerald-400/25 px-3.5 py-1.5 rounded-full mb-3.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-[liveDotPulse_1.5s_ease-in-out_infinite]" />
        <span>ORDER CONFIRMED</span>
      </div>

      {/* Headline */}
      <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.08] tracking-tight mb-3">
        Your Order is{' '}
        <em className="font-serif italic font-normal text-accent-cyan">Confirmed</em>
      </h1>

      {/* Friendly Customer Greeting & Email Reassurance */}
      <p id="conf-customer-line" className="text-sm sm:text-base text-white/70 max-w-xl mx-auto leading-relaxed">
        Thank you, <strong className="text-white font-semibold">{customerName}</strong>. Your order is confirmed and a full digital receipt has been sent to{' '}
        <span className="text-accent-cyan font-medium underline underline-offset-4 decoration-accent-cyan/30">{customerEmail}</span>.
      </p>
    </div>
  );
}

