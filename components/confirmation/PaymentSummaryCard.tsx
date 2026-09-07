'use client';

import React from 'react';
import { Receipt, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface PaymentSummaryCardProps {
  subtotal: number;
  discount?: number;
  discountCode?: string;
  shipping: number;
  total: number;
  paymentMethod?: string;
}

export function PaymentSummaryCard({
  subtotal = 449,
  discount = 89.8,
  discountCode = 'VIP20',
  shipping = 0,
  total = 359.2,
  paymentMethod = 'klarna',
}: PaymentSummaryCardProps) {
  const getPaymentLabel = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'klarna':
        return { badge: 'Klarna.', text: 'Klarna Pay in 30 Days', badgeBg: 'bg-[#FFB3C7] text-black' };
      case 'card':
        return { badge: 'CARD', text: 'Credit / Debit Card (•••• 4242)', badgeBg: 'bg-[#0F2042] text-white' };
      case 'applepay':
        return { badge: ' Pay', text: 'Apple Pay / Google Pay', badgeBg: 'bg-white text-black' };
      case 'paypal':
        return { badge: 'PayPal', text: 'PayPal Express', badgeBg: 'bg-[#003087] text-white' };
      case 'ideal':
        return { badge: 'iDEAL', text: 'iDEAL Online Banking', badgeBg: 'bg-[#CC0066] text-white' };
      case 'sepa':
        return { badge: 'SEPA', text: 'SEPA Bank Transfer', badgeBg: 'bg-[#005B94] text-white' };
      default:
        return { badge: 'AUTHORISED', text: 'Secure Payment', badgeBg: 'bg-emerald-500/20 text-emerald-400' };
    }
  };

  const paymentMeta = getPaymentLabel(paymentMethod);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-6 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[11px] font-bold tracking-[0.14em] uppercase text-white/50 mb-5">
        <Receipt className="w-4 h-4 text-accent-cyan" />
        <span>Payment Summary</span>
      </div>

      <div className="space-y-3 text-xs">
        {/* Subtotal */}
        <div className="flex justify-between text-white/70">
          <span>Subtotal</span>
          <span id="conf-subtotal" className="font-mono tabular-nums text-white">
            {formatPrice(subtotal)}
          </span>
        </div>

        {/* Discount */}
        {discount > 0 && (
          <div id="conf-discount-row" className="flex justify-between text-emerald-400">
            <span id="conf-discount-label">Discount ({discountCode})</span>
            <span id="conf-discount-amount" className="font-mono tabular-nums">
              &minus;{formatPrice(discount)}
            </span>
          </div>
        )}

        {/* Shipping */}
        <div className="flex justify-between text-white/70">
          <span>Shipping</span>
          <span id="conf-shipping" className="font-semibold text-emerald-400">
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>

        {/* Total Paid */}
        <div className="pt-3 mt-2 border-t border-white/10 flex justify-between items-baseline">
          <span className="text-sm font-semibold text-white">
            Total Paid (incl. 19% VAT)
          </span>
          <span
            id="conf-total"
            className="font-serif text-2xl font-bold text-white font-mono tabular-nums"
          >
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Payment Method Chip */}
      <div className="mt-5 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
        <span>Payment Method:</span>
        <div
          id="conf-payment-chip"
          className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-white/[0.04] border border-white/10"
        >
          <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded ${paymentMeta.badgeBg}`}>
            {paymentMeta.badge}
          </span>
          <span id="conf-payment-label" className="text-[11.5px] font-medium text-white/90">
            {paymentMeta.text}
          </span>
        </div>
      </div>
    </div>
  );
}
