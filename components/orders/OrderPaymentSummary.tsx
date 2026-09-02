'use client';

import React from 'react';
import { CreditCard, ShieldCheck } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface OrderPaymentSummaryProps {
  subtotal: number;
  discount?: number;
  discountCode?: string;
  shipping?: number;
  total: number;
  paymentMethod?: string;
}

export function OrderPaymentSummary({
  subtotal = 285,
  discount = 0,
  discountCode = '',
  shipping = 0,
  total = 285,
  paymentMethod = 'klarna',
}: OrderPaymentSummaryProps) {
  const methodLower = (paymentMethod || 'klarna').toLowerCase();

  const getMethodBadge = () => {
    if (methodLower.includes('apple')) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white text-black text-xs font-semibold shadow-xs">
          <span>Apple Pay</span>
        </div>
      );
    }
    if (methodLower.includes('ideal')) {
      return (
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold shadow-xs">
          <span>iDEAL</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FFB3C7]/15 border border-[#FFB3C7]/30 text-[#FFB3C7] text-xs font-semibold shadow-xs">
        <span className="font-bold">Klarna.</span>
        <span>Pay in 30 Days</span>
      </div>
    );
  };

  return (
    <div
      id="orderPaymentSummaryCard"
      className="rounded-2xl border border-white/10 bg-[#0A2A54]/30 backdrop-blur-md p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 pb-5 border-b border-white/10">
        <CreditCard className="w-4 h-4 text-accent-cyan" />
        <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-white">
          PAYMENT &amp; FINANCIAL BREAKDOWN
        </h3>
      </div>

      {/* Numerical Rows */}
      <div className="py-5 space-y-3 text-xs border-b border-white/10">
        <div className="flex justify-between text-white/70">
          <span>Subtotal</span>
          <span className="font-mono text-white font-medium">
            {formatPrice(subtotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-400 font-medium">
            <span>Discount {discountCode ? `(${discountCode})` : ''}</span>
            <span className="font-mono">- {formatPrice(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-white/70">
          <span>Shipping &amp; Logistics</span>
          <span className="font-mono text-white font-medium">
            {shipping === 0 ? (
              <strong className="text-emerald-400 uppercase tracking-wider text-[11px]">
                Complimentary
              </strong>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        <div className="flex justify-between text-white/40 text-[11px] pt-1">
          <span>Estimated Taxes (Included)</span>
          <span className="font-mono text-white/40">19% German VAT</span>
        </div>
      </div>

      {/* Total Row */}
      <div className="py-5 flex items-baseline justify-between border-b border-white/10">
        <div>
          <span className="text-sm font-bold text-white block">
            Total Paid
          </span>
          <span className="text-[10.5px] text-white/50">
            VAT invoice available
          </span>
        </div>
        <div className="font-display text-2xl font-bold text-white font-mono tabular-nums">
          {formatPrice(total)}
        </div>
      </div>

      {/* Payment Method Used */}
      <div className="pt-5 flex items-center justify-between">
        <span className="text-xs text-white/70">Payment Method:</span>
        <div>{getMethodBadge()}</div>
      </div>

      <div className="mt-4 pt-3 flex items-center gap-2 text-[10.5px] text-white/50 border-t border-white/10">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
        <span>End-to-end encrypted 256-bit payment verification</span>
      </div>
    </div>
  );
}
