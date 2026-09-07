'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TrackingOrder, STATUS_TO_STAGE } from './types';

interface ETABannerProps {
  order: TrackingOrder;
}

export default function ETABanner({ order }: ETABannerProps) {
  const stageIdx = STATUS_TO_STAGE[order.statusKey || order.status] ?? 4;
  const isDelivered = order.statusKey === 'DELIVERED' || stageIdx >= 5;
  const isDelayed = order.statusKey === 'DELAYED' || order.statusKey === 'EXCEPTION';
  const isCancelled = order.statusKey === 'CANCELLED';

  if (isCancelled) return null;

  if (isDelivered) {
    return (
      <div
        id="trackingETA"
        className="rounded-2xl p-5 bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3.5 shadow-md"
        aria-live="polite"
      >
        <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold flex-shrink-0">
          <CheckCircle2 size={20} />
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-[0.16em] uppercase text-emerald-400 mb-0.5">
            SHIPMENT COMPLETED
          </div>
          <div className="text-sm text-white font-medium">
            Your parcel arrived safely at {order.customer?.address || 'London, UK'}.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      id="trackingETA"
      className="rounded-2xl p-5 sm:p-6 bg-accent-cyan/[0.06] border border-accent-cyan/20 shadow-lg flex flex-wrap items-start justify-between gap-4"
      aria-live="polite"
    >
      <div className="space-y-1">
        <div className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-white/50">
          ESTIMATED ARRIVAL WINDOW
        </div>
        <div className="text-xl sm:text-2xl lg:text-3xl font-serif font-medium text-white">
          {isDelayed ? `Delayed — ${order.expectedDate}` : order.expectedDate}
        </div>
        <div className="text-xs sm:text-sm text-white/60">
          {isDelayed
            ? 'Delivery is taking slightly longer than estimated.'
            : 'Courier is on schedule with cold-chain temperature control.'}
        </div>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan text-xs font-semibold flex-shrink-0">
        <span className="w-1.5 h-1.5 rounded-full bg-accent-cyan animate-ping" />
        <span>GPS SATELLITE SYNC</span>
      </div>
    </div>
  );
}
