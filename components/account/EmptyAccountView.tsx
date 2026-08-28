'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { AccountHero } from './AccountHero';

interface EmptyAccountViewProps {
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  onSignOut: () => void;
}

export function EmptyAccountView({ user, onSignOut }: EmptyAccountViewProps) {
  return (
    <div>
      <AccountHero
        user={user}
        totalOrders={0}
        activeShipments={0}
        totalSpent={0}
        onSignOut={onSignOut}
      />

      <div className="min-h-[45vh] flex flex-col items-center justify-center p-8 sm:p-14 text-center bg-white/[0.02] border border-white/[0.08] rounded-2xl mt-6">
        <div className="w-16 h-16 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan mb-5 shadow-inner">
          <ShoppingBag size={26} />
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-semibold text-white mb-3">
          YOUR SHOPPING JOURNEY STARTS HERE
        </h2>

        <p className="text-sm text-white/60 max-w-md leading-relaxed mb-7">
          Your orders and delivery updates will appear here after your first purchase.
        </p>

        <Link
          href="/category?cat=all"
          className="h-12 px-8 rounded-xl bg-accent-pink hover:bg-accent-pink/90 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-lg shadow-accent-pink/20"
        >
          <span>Start Shopping</span>
        </Link>
      </div>
    </div>
  );
}
