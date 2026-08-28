'use client';

import React from 'react';
import Link from 'next/link';
import { Truck, Compass, RotateCcw, XCircle, ShieldAlert } from 'lucide-react';
import { AccountOrder, OrderItem } from './types';

interface OrderCardProps {
  order: AccountOrder;
  onReorder: (orderRef: string, item: OrderItem) => void;
  onCancelOrder?: (orderRef: string) => void;
}

export function OrderCard({ order, onReorder, onCancelOrder }: OrderCardProps) {
  const isPreparing = order.status === 'preparing';
  const isCancelled = order.status === 'cancelled';
  const isDelivered = order.status === 'delivered';

  return (
    <div
      className={`bg-white/[0.02] border rounded-2xl p-5 sm:p-6 mb-4 transition-all duration-200 ${
        isCancelled
          ? 'border-rose-500/20 bg-rose-500/[0.01]'
          : 'border-white/[0.07] hover:border-white/[0.14]'
      }`}
    >
      {/* Top Bar */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm font-bold tracking-wider text-white">
            {order.ref}
          </span>
          <span className="text-xs text-white/40">
            Ordered on {order.date}
          </span>
        </div>

        <div
          className={`inline-flex items-center gap-2 text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full ${
            isCancelled
              ? 'bg-rose-500/10 border border-rose-500/30 text-rose-400'
              : isPreparing
              ? 'bg-accent-cyan/10 border border-accent-cyan/25 text-accent-cyan'
              : 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              isCancelled
                ? 'bg-rose-400'
                : isPreparing
                ? 'bg-accent-cyan animate-pulse'
                : 'bg-emerald-400'
            }`}
          />
          <span>{order.statusLabel || (isCancelled ? 'Cancelled' : isPreparing ? 'Preparing' : 'Delivered')}</span>
        </div>
      </div>

      {/* Live Route Strip (Active Shipments) */}
      {isPreparing && !isCancelled && (
        <div className="bg-accent-cyan/[0.04] border border-accent-cyan/15 rounded-xl p-3.5 sm:p-4 mb-5">
          <div className="h-1.5 w-full bg-white/[0.08] rounded-full overflow-hidden mb-2.5">
            <div
              className="h-full bg-gradient-to-r from-accent-cyan to-emerald-400 rounded-full transition-all duration-700"
              style={{ width: '45%' }}
            />
          </div>
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="flex items-center gap-2 text-white/70">
              <Truck size={13} className="text-accent-cyan" />
              <span>Order Processing &middot; Ready for Dispatch</span>
            </span>
            <span className="font-semibold text-accent-cyan">
              ETA: {order.expectedDate || '19 August 2026'}
            </span>
          </div>
        </div>
      )}

      {/* Cancelled Callout */}
      {isCancelled && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-rose-500/[0.05] border border-rose-500/20 rounded-xl p-3 sm:p-3.5 mb-5 text-xs text-rose-300">
          <div className="flex items-center gap-2">
            <ShieldAlert size={15} className="text-rose-400 flex-shrink-0" />
            <span>
              <strong className="font-semibold">Cancelled</strong> &middot;{' '}
              {order.cancellationReason || 'Client requested cancellation'}
            </span>
          </div>
          <span className="text-accent-cyan font-semibold whitespace-nowrap">
            100% Refund Credited
          </span>
        </div>
      )}

      {/* Items List */}
      <div className="flex flex-col gap-3.5 mb-5 pb-5 border-b border-white/[0.06]">
        {order.items.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3.5">
            <div className="w-14 h-[70px] rounded-lg overflow-hidden bg-white/[0.04] flex-shrink-0 border border-white/[0.06] flex items-center justify-center p-1">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover rounded"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/products/p1.png';
                }}
              />
            </div>
            <div className="flex-1 min-w-0 flex flex-col gap-0.5">
              <span className="text-[9px] font-bold tracking-wider text-accent-cyan uppercase">
                {item.category || 'APPAREL'}
              </span>
              <h3 className="font-display font-semibold text-sm text-white truncate">
                {item.name}
              </h3>
              <span className="text-xs text-white/45">
                {item.variant} &middot; Qty {item.qty}
              </span>
            </div>
            <div className="font-display font-bold text-sm text-white tabular-nums whitespace-nowrap">
              &euro; {(item.price * item.qty).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Actions & Total */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2.5">
          {!isCancelled && (
            <Link
              href={`/tracking?orderId=${encodeURIComponent(order.ref)}`}
              className="h-9 px-3.5 rounded-lg bg-accent-cyan/[0.08] hover:bg-accent-cyan/[0.16] border border-accent-cyan/25 hover:border-accent-cyan/40 text-accent-cyan text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 min-h-[36px]"
            >
              <Compass size={13} />
              <span>Live Route Map</span>
            </Link>
          )}

          <button
            type="button"
            onClick={() => onReorder(order.ref, order.items[0])}
            className="h-9 px-3.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-white/70 hover:text-white text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
          >
            <RotateCcw size={13} />
            <span>Buy Again</span>
          </button>

          {isPreparing && !isCancelled && onCancelOrder && (
            <button
              type="button"
              onClick={() => onCancelOrder(order.ref)}
              className="h-9 px-3 rounded-lg bg-rose-500/[0.06] hover:bg-rose-500/15 border border-rose-500/20 hover:border-rose-500/35 text-rose-400 hover:text-rose-300 text-xs font-semibold tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer min-h-[36px]"
            >
              <XCircle size={13} />
              <span>Cancel Order</span>
            </button>
          )}
        </div>

        <div className="flex flex-col items-end gap-0.5 ml-auto">
          <span className="text-[9px] font-bold tracking-wider uppercase text-white/35">
            {isCancelled ? 'Refund Credited' : 'Total Paid'}
          </span>
          <div
            className={`font-display text-lg sm:text-xl font-bold tabular-nums ${
              isCancelled ? 'text-rose-400 line-through' : 'text-white'
            }`}
          >
            &euro; {order.total.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
}
