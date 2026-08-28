'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ArrowLeft, RefreshCw, FileText, XCircle, Check } from 'lucide-react';
import { TrackingOrder } from './types';

interface TrackingHeroHeaderProps {
  order: TrackingOrder;
  onRefreshTelemetry: () => void;
  onCancelOrder?: () => void;
}

export default function TrackingHeroHeader({
  order,
  onRefreshTelemetry,
  onCancelOrder,
}: TrackingHeroHeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [justSynced, setJustSynced] = useState(false);

  const isCancelled = order.statusKey === 'CANCELLED' || order.status === 'cancelled';
  const isDelivered = order.statusKey === 'DELIVERED' || order.status === 'delivered';

  const handleRefresh = () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    setTimeout(() => {
      onRefreshTelemetry();
      setIsRefreshing(false);
      setJustSynced(true);
      setTimeout(() => setJustSynced(false), 2000);
    }, 600);
  };

  const isCancellable =
    !isCancelled &&
    !isDelivered &&
    order.statusKey !== 'OUT_FOR_DELIVERY' &&
    typeof onCancelOrder === 'function';

  return (
    <div className="space-y-5">
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-white/60">
        <Link href="/" className="hover:text-accent-cyan transition-colors">
          Home
        </Link>
        <ChevronRight size={12} className="text-white/30" />
        <Link href="/orders" className="hover:text-accent-cyan transition-colors">
          Orders &amp; Tracking
        </Link>
        <ChevronRight size={12} className="text-white/30" />
        <span className="text-white font-semibold" id="trackingBreadcrumbRef">
          Order #{order.ref}
        </span>
      </nav>

      {/* Luxury Spotlight Hero Header */}
      <header
        id="trackingHeroHeader"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#08254c]/90 via-[#0a2a54]/80 to-[#012148]/95 border border-white/15 p-6 sm:p-8 backdrop-blur-xl shadow-2xl"
      >
        {/* Ambient Cyan Radial Spotlight */}
        <div
          className="absolute -top-16 -right-16 w-72 h-72 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(61, 224, 255, 0.16) 0%, transparent 70%)',
          }}
        />

        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 pb-6 border-b border-white/10">
          {/* Left: Eyebrow, Title & Subtitle */}
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="w-2 h-2 rounded-full bg-accent-cyan shadow-[0_0_10px_#3de0ff] animate-pulse" />
              <span
                id="trackingEyebrow"
                className="text-[11px] font-bold tracking-[0.14em] uppercase text-accent-cyan"
              >
                LIVE PARCEL TRACKING
              </span>
              <span className="text-white/30">&middot;</span>
              <span
                id="trackingStatusBadge"
                className={`text-[10px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border transition-colors ${
                  isCancelled
                    ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                    : isDelivered
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-accent-cyan/15 border-accent-cyan/30 text-accent-cyan'
                }`}
              >
                {isCancelled
                  ? 'CANCELLED'
                  : isDelivered
                  ? 'DELIVERED'
                  : (order.statusLabel || 'IN TRANSIT').toUpperCase()}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-tight">
              Track Parcel &middot;{' '}
              <em
                id="trackingHeroId"
                className="font-serif italic font-normal text-accent-cyan not-italic"
              >
                #{order.ref}
              </em>
            </h1>

            <p id="trackingHeroSubtitle" className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Real-time courier updates, cold-chain temperature monitor, and delivery help.
            </p>
          </div>

          {/* Right: 3-Stat Metric Cluster */}
          <div
            id="trackingHeroStats"
            className="w-full lg:w-auto flex items-center justify-between sm:justify-start gap-4 sm:gap-6 bg-[#00142e]/60 border border-white/15 rounded-xl px-5 py-3.5 backdrop-blur-md flex-shrink-0"
          >
            {/* Stat 1: Dispatch Status */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/50">
                DISPATCH STATUS
              </span>
              <span
                id="trackingStatStatus"
                className={`text-xs sm:text-sm font-bold ${
                  isCancelled
                    ? 'text-rose-400'
                    : isDelivered
                    ? 'text-emerald-400'
                    : 'text-accent-cyan'
                }`}
              >
                {isCancelled ? 'Cancelled' : order.statusLabel || 'Out for Delivery'}
              </span>
            </div>

            <div className="w-px h-7 bg-white/10" />

            {/* Stat 2: Estimated Arrival */}
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/50">
                ESTIMATED ARRIVAL
              </span>
              <span id="trackingStatEta" className="text-xs sm:text-sm font-bold text-white">
                {isCancelled
                  ? 'Order Cancelled'
                  : isDelivered
                  ? 'Completed'
                  : order.expectedDate || 'Today · By 6:00 PM'}
              </span>
            </div>

            <div className="w-px h-7 bg-white/10 hidden sm:block" />

            {/* Stat 3: Courier Network */}
            <div className="hidden sm:flex flex-col gap-0.5">
              <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/50">
                COURIER NETWORK
              </span>
              <span id="trackingStatCourier" className="text-xs sm:text-sm font-bold text-white">
                {order.courier || 'DHL Express On-Demand'}
              </span>
            </div>
          </div>
        </div>

        {/* Integrated Action Toolbar */}
        <div className="pt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center">
            <Link
              href="/orders"
              id="trackingBackLink"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white/90 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all"
            >
              <ArrowLeft size={13} />
              <span>ALL ORDERS</span>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Refresh Telemetry Button */}
            <button
              type="button"
              id="trackingRefreshBtn"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent-cyan/15 hover:bg-accent-cyan border border-accent-cyan/40 text-accent-cyan hover:text-black text-[11px] font-bold uppercase tracking-wider shadow-sm hover:shadow-[0_0_16px_rgba(61,224,255,0.35)] transition-all"
              title="Refresh live parcel updates"
            >
              {justSynced ? (
                <>
                  <Check size={13} />
                  <span>TELEMETRY SYNCED</span>
                </>
              ) : (
                <>
                  <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
                  <span>{isRefreshing ? 'UPDATING...' : 'REFRESH TELEMETRY'}</span>
                </>
              )}
            </button>

            {/* Print Dispatch Invoice */}
            <button
              type="button"
              onClick={() => {
                if (typeof window !== 'undefined') window.print();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/10 hover:bg-white/15 border border-white/15 text-white/80 hover:text-white text-[11px] font-bold uppercase tracking-wider transition-all"
              title="Print official parcel invoice"
            >
              <FileText size={13} />
              <span>DISPATCH INVOICE</span>
            </button>

            {/* Cancel Order (if eligible) */}
            {isCancellable && (
              <button
                type="button"
                id="trackingCancelBtn"
                onClick={onCancelOrder}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 hover:text-rose-300 text-[11px] font-bold uppercase tracking-wider transition-all"
                title="Cancel this order"
              >
                <XCircle size={13} />
                <span>CANCEL ORDER</span>
              </button>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
