'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, LogOut } from 'lucide-react';

interface AccountHeroProps {
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  totalOrders: number;
  activeShipments: number;
  totalSpent: number;
  onSignOut: () => void;
}

export function AccountHero({
  user,
  totalOrders,
  activeShipments,
  totalSpent,
  onSignOut,
}: AccountHeroProps) {
  return (
    <section className="mb-9 pb-8 border-b border-white/[0.08]">
      {/* Masthead */}
      <div className="flex flex-wrap items-start justify-between gap-6 mb-7">
        <div className="flex flex-col">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.16em] uppercase text-accent-cyan bg-accent-cyan/[0.08] border border-accent-cyan/20 px-3 py-1 rounded-full mb-3.5 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
            <span>TIER I &middot; VIP MEMBER</span>
          </div>
          <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-[44px] text-white leading-tight mb-1.5">
            {user.name || 'Valued Member'}
          </h1>
          <p className="text-xs sm:text-[13px] text-white/50">
            {user.email} &middot; Member since 2024
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap pt-1">
          <Link
            href="/concierge"
            className="h-10 px-4 sm:px-5 bg-white/[0.04] hover:bg-accent-cyan/10 border border-white/10 hover:border-accent-cyan/30 rounded-lg text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 shadow-sm"
          >
            <Sparkles size={14} className="text-accent-cyan" />
            <span>Personal Stylist</span>
          </Link>

          <button
            type="button"
            onClick={onSignOut}
            className="h-10 px-4 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 hover:border-rose-500/50 rounded-lg text-rose-400 hover:text-white text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2"
            aria-label="Sign out of account"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 3-Stat Summary Strip */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/[0.02] border border-white/[0.06] rounded-xl p-5 sm:px-7 sm:py-5 gap-4 sm:gap-0">
        <div className="flex-1 sm:px-6 first:sm:pl-0">
          <span className="block text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase mb-1">
            TOTAL ORDERS
          </span>
          <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">
            {totalOrders} {totalOrders === 1 ? 'Item' : 'Items'}
          </div>
        </div>

        <div className="hidden sm:block w-px h-9 bg-white/[0.08] flex-shrink-0" />

        <div className="flex-1 sm:px-6">
          <span className="block text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase mb-1">
            ACTIVE IN TRANSIT
          </span>
          <div className="font-display text-xl sm:text-2xl font-bold text-accent-cyan tabular-nums">
            {activeShipments} {activeShipments === 1 ? 'Shipment' : 'Shipments'}
          </div>
        </div>

        <div className="hidden sm:block w-px h-9 bg-white/[0.08] flex-shrink-0" />

        <div className="flex-1 sm:px-6">
          <span className="block text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase mb-1">
            TOTAL SPENT
          </span>
          <div className="font-display text-xl sm:text-2xl font-bold text-white tabular-nums">
            &euro; {totalSpent.toFixed(2)}
          </div>
        </div>
      </div>
    </section>
  );
}
