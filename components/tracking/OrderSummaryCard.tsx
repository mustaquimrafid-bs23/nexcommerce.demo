'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, XCircle, FileText } from 'lucide-react';
import { TrackingOrder } from './types';
import { formatPrice } from '@/lib/utils';

interface OrderSummaryCardProps {
  order: TrackingOrder;
  onCancelOrder?: () => void;
}

export default function OrderSummaryCard({ order, onCancelOrder }: OrderSummaryCardProps) {
  const isCancelled = order.statusKey === 'CANCELLED' || order.status === 'cancelled';
  const isDelivered = order.statusKey === 'DELIVERED' || order.status === 'delivered';
  const isCancellable =
    !isCancelled &&
    !isDelivered &&
    order.statusKey !== 'OUT_FOR_DELIVERY' &&
    typeof onCancelOrder === 'function';

  const subtotal = Number(order.subtotal) || 0;
  const discount = Number(order.discountAmt) || 0;
  const shipping = Number(order.deliveryCost || 0);
  const total = Number(order.total) || subtotal - discount + shipping;

  return (
    <div
      id="trackingOrderSummary"
      className="p-6 sm:p-7 rounded-2xl bg-[#08254c]/85 border border-white/15 backdrop-blur-xl shadow-2xl space-y-6 lg:sticky lg:top-24"
    >
      <div className="text-[9.5px] font-bold tracking-[0.16em] uppercase text-white/60">
        ORDER &amp; PAYMENT BREAKDOWN
      </div>

      {/* Cancelled Alert Callout */}
      {isCancelled && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-xs">
            <XCircle size={14} />
            <span>Order Cancelled &middot; {order.cancellationReason || 'Client request'}</span>
          </div>
          <div className="text-[11px] text-accent-cyan font-medium">
            100% Refund Issued to Original Payment Method
          </div>
        </div>
      )}

      {/* Items List */}
      <div className="space-y-4 divide-y divide-white/10">
        {(order.items || []).map((item, idx) => {
          const qty = item.qty || 1;
          const lineTotal = (Number(item.price) || 0) * qty;

          return (
            <div key={`${item.name}-${idx}`} className="pt-4 first:pt-0 flex gap-3.5 items-start">
              {/* Product Thumbnail with Quantity Badge */}
              <div className="relative flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden bg-[#00142e]/70 border border-white/15">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/assets/images/products/plp_overcoat.png';
                  }}
                />
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-black/80 border border-white/20 text-[9px] font-bold text-white flex items-center justify-center">
                  {qty}
                </span>
              </div>

              {/* Item Info */}
              <div className="flex-1 min-w-0 space-y-0.5">
                <span className="text-[9px] font-bold tracking-[0.12em] uppercase text-white/50 block">
                  {item.category || 'APPAREL'}
                </span>
                <h4 className="font-serif text-sm text-white font-medium truncate">{item.name}</h4>
                <div className="text-[11px] text-white/60">{item.variant || 'Standard'}</div>
                <div className="text-xs font-semibold text-white pt-1 tabular-nums">
                  {formatPrice(lineTotal)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Price Calculations */}
      <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
        <div className="flex justify-between text-white/70">
          <span>Subtotal</span>
          <span className="text-white font-medium tabular-nums">{formatPrice(subtotal)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-400">
            <span>Discount</span>
            <span className="font-medium tabular-nums">−{formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-white/70">
          <span>Express Delivery</span>
          <span
            className={`tabular-nums ${
              shipping === 0 ? 'text-emerald-400 font-semibold' : 'text-white font-medium'
            }`}
          >
            {shipping === 0 ? 'Free Delivery' : formatPrice(shipping)}
          </span>
        </div>

        <div className="pt-3 border-t border-white/10 flex justify-between items-center">
          <span className="text-[11px] font-bold uppercase tracking-wider text-white">
            {isCancelled ? 'REFUND CREDITED' : 'TOTAL (INCL. VAT)'}
          </span>
          <span
            className={`font-serif text-xl font-bold tabular-nums ${
              isCancelled ? 'text-rose-400' : 'text-white'
            }`}
          >
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Delivery Destination */}
      <div className="p-4 rounded-xl bg-[#0a2a54]/60 border border-white/15 space-y-1.5 text-xs">
        <div className="flex items-center gap-1.5 text-[9px] font-bold tracking-[0.16em] uppercase text-accent-cyan">
          <MapPin size={11} />
          <span>DELIVERY DESTINATION</span>
        </div>
        <div className="font-semibold text-white">{order.customer?.name || 'Julian Mercer'}</div>
        <div className="text-white/70 leading-relaxed">
          {order.customer?.address || '42 Kensington High Street, London W8 4PE, UK'}
        </div>
        <div className="text-[11px] text-white/50 pt-1">
          {order.paymentMethod || 'Paid with Klarna'}
        </div>
      </div>

      {/* Action Triggers */}
      <div className="space-y-2.5 pt-1">
        <button
          type="button"
          onClick={() => {
            if (typeof window !== 'undefined') window.print();
          }}
          className="w-full h-11 rounded-xl bg-gradient-to-r from-accent-cyan to-blue-500 hover:from-accent-cyan/90 hover:to-blue-400 text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-accent-cyan/20 flex items-center justify-center gap-2 transition-all"
        >
          <FileText size={14} />
          <span>VIEW OFFICIAL INVOICE</span>
        </button>

        {isCancellable && (
          <button
            type="button"
            onClick={onCancelOrder}
            className="w-full h-10 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-400 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all"
          >
            <XCircle size={14} />
            <span>CANCEL THIS ORDER</span>
          </button>
        )}

        <Link
          href="/category?cat=all"
          className="block text-center text-xs tracking-wider text-accent-cyan hover:text-white transition-colors pt-1"
        >
          CONTINUE SHOPPING &rarr;
        </Link>
      </div>
    </div>
  );
}
