'use client';

import React from 'react';
import { formatPrice } from '@/lib/utils';

interface OrdersHeroProps {
  totalCount: number;
  inTransitCount: number;
  deliveredCount: number;
  totalSpent: number;
}

export function OrdersHero({
  totalCount = 3,
  inTransitCount = 1,
  deliveredCount = 2,
  totalSpent = 790,
}: OrdersHeroProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#0A2A54]/45 via-[#08254c]/40 to-[#041430]/60 p-6 sm:p-8 backdrop-blur-xl mb-8 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left Headline & Meta */}
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-[10.5px] font-bold tracking-[0.14em] uppercase text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
            <span>ORDER ARCHIVE &amp; LIVE TRACKING</span>
            <span className="text-white/30">&middot;</span>
            <span id="heroBadgeCount" className="text-white/80">
              {totalCount} {totalCount === 1 ? 'ORDER' : 'ORDERS'}
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
            Order <em className="font-serif italic font-normal text-accent-cyan">Journey</em>
          </h1>

          <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
            Real-time courier progress, digital invoices, and complete purchase archives for your atelier acquisitions.
          </p>
        </div>

        {/* Right Statistical Summary Cards */}
        <div
          id="ordersHeroStats"
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#01132B]/60 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-md"
        >
          {/* Total Placed */}
          <div className="text-center sm:text-left px-2">
            <span className="text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase block mb-1">
              TOTAL PLACED
            </span>
            <span id="heroTotalOrders" className="font-display text-xl sm:text-2xl font-bold text-white">
              {totalCount}
            </span>
          </div>

          {/* In Transit */}
          <div className="text-center sm:text-left px-2 border-l border-white/10">
            <span className="text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase block mb-1">
              IN TRANSIT
            </span>
            <span id="heroInTransit" className="font-display text-xl sm:text-2xl font-bold text-accent-cyan">
              {inTransitCount}
            </span>
          </div>

          {/* Delivered */}
          <div className="text-center sm:text-left px-2 border-l border-white/10">
            <span className="text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase block mb-1">
              DELIVERED
            </span>
            <span id="heroDelivered" className="font-display text-xl sm:text-2xl font-bold text-emerald-400">
              {deliveredCount}
            </span>
          </div>

          {/* Total Value */}
          <div className="text-center sm:text-left px-2 border-l border-white/10">
            <span className="text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase block mb-1">
              TOTAL VALUE
            </span>
            <span id="heroTotalSpent" className="font-display text-lg sm:text-xl font-bold text-white font-mono tabular-nums">
              {formatPrice(totalSpent)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
