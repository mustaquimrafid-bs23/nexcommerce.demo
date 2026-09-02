'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface CheckoutHeroHeaderProps {
  itemCount: number;
  total: number;
}

export function CheckoutHeroHeader({ itemCount, total }: CheckoutHeroHeaderProps) {
  return (
    <section className="mb-7 rounded-[18px] border border-white/10 bg-gradient-to-br from-[#0A2A54]/65 to-[#01132B]/90 p-8 sm:p-9 pb-6 backdrop-blur-xl shadow-[0_16px_48px_-8px_rgba(0,0,0,0.4)] relative overflow-hidden">
      {/* Glow effect */}
      <div className="pointer-events-none absolute -top-16 -right-16 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(61,224,255,0.12)_0%,transparent_70%)]" />

      <div className="flex flex-wrap items-start justify-between gap-8 mb-6">
        <div className="flex-1 min-w-[300px] flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-accent-cyan mb-1">
            <span className="h-[7px] w-[7px] rounded-full bg-[#34D399] shadow-[0_0_8px_#34D399] animate-pulse" />
            <span>Bank-Grade Secure Checkout</span>
            <span className="rounded-full bg-accent-cyan/10 border border-accent-cyan/20 px-2 py-0.5 text-[9.5px] font-bold text-accent-cyan">
              3D Secure Protected
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Complete Your <em className="font-accent italic text-accent-cyan font-normal">Order</em>
          </h1>

          <p className="text-[13.5px] leading-relaxed text-white/65 max-w-[580px] mt-1">
            Review your delivery address, select your payment method, and complete your order with bank-grade encryption.
          </p>
        </div>

        {/* Hero Quick Stats */}
        <div className="flex flex-wrap items-center gap-3.5">
          <div className="flex flex-col gap-0.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 min-w-[120px] backdrop-blur-md">
            <span className="text-[9px] font-bold tracking-[0.12em] text-white/45 uppercase">Reserved Pieces</span>
            <span className="text-[15px] font-bold text-accent-cyan font-mono">
              {itemCount} PIECE{itemCount !== 1 ? 'S' : ''}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 min-w-[120px] backdrop-blur-md">
            <span className="text-[9px] font-bold tracking-[0.12em] text-white/45 uppercase">Estimated Total</span>
            <span className="text-[15px] font-bold text-white font-mono">
              {formatPrice(total)}
            </span>
          </div>

          <div className="flex flex-col gap-0.5 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 min-w-[120px] backdrop-blur-md">
            <span className="text-[9px] font-bold tracking-[0.12em] text-white/45 uppercase">Delivery</span>
            <span className="text-[15px] font-bold text-[#34D399] font-mono">
              CARBON NEUTRAL
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
        <Link
          href="/cart"
          id="btnBackToCart"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-white/[0.09] hover:border-white/20 hover:text-white hover:-translate-y-0.5"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Return to Shopping Bag</span>
        </Link>

        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined' && (window as any).nexConcierge) {
              (window as any).nexConcierge.openDrawer();
            }
          }}
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-semibold text-white/80 transition-all hover:bg-white/[0.09] hover:border-white/20 hover:text-white hover:-translate-y-0.5"
        >
          <Sparkles className="h-3.5 w-3.5 text-accent-cyan" />
          <span>Need Help? Ask Stylist</span>
        </button>
      </div>
    </section>
  );
}
