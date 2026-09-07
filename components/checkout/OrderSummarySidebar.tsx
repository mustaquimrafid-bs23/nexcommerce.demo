'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  RotateCcw,
  ShieldCheck,
  Lock,
  Leaf,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { CartItem } from '@/types/catalog';
import { formatPrice, resolveProductImage } from '@/lib/utils';
import { normalizeRawCartItem } from '@/store/useCartStore';

interface OrderSummarySidebarProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  itemCount: number;
  appliedCoupon: string | null;
  onApplyCoupon: (
    code: string
  ) =>
    | boolean
    | { success: boolean; message?: string }
    | Promise<boolean | { success: boolean; message?: string }>;
  onRemoveCoupon: () => void;
  onSubmitOrder: () => void;
  isProcessing: boolean;
  isGiftWrap: boolean;
}

export function OrderSummarySidebar({
  items,
  subtotal,
  discount,
  shipping,
  total,
  itemCount,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onSubmitOrder,
  isProcessing,
  isGiftWrap,
}: OrderSummarySidebarProps) {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCustomCouponOpen, setIsCustomCouponOpen] = useState(false);
  const [showAllItems, setShowAllItems] = useState(false);

  const handleApply = async (codeToUse?: string) => {
    const code = (codeToUse || couponCodeInput).trim().toUpperCase();
    if (!code) return;
    const res = await onApplyCoupon(code);
    const success = typeof res === 'boolean' ? res : res?.success;
    if (!success) {
      setCouponError('This promo code is invalid or has expired.');
    } else {
      setCouponError(null);
      setCouponCodeInput('');
      setIsCustomCouponOpen(false);
    }
  };

  const vatAmount = (total * 0.19) / 1.19;
  const displayedItems = showAllItems ? items : items.slice(0, 2);

  return (
    <aside
      className="sticky top-24 max-h-[calc(100vh-96px)] overflow-y-auto rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A2A54]/95 to-[#01132B]/98 p-5 shadow-[0_16px_48px_-8px_rgba(0,0,0,0.5)] flex flex-col gap-3.5 backdrop-blur-xl transition-all"
      aria-label="Order Summary Sidebar"
    >
      <div className="flex justify-between items-baseline pb-2.5 border-b border-white/10">
        <h2 className="font-display text-base font-bold text-white">Order Summary</h2>
        <span
          id="checkoutPiecesCount"
          className="text-[10px] font-bold tracking-widest text-white/45 uppercase"
        >
          {itemCount} PIECE{itemCount !== 1 ? 'S' : ''}
        </span>
      </div>

      {/* Visual Product Mini-List */}
      <div
        id="desktop-items-list"
        className="flex flex-col gap-2 shrink-0 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin"
        role="region"
        aria-label="Reserved pieces in order"
      >
        {displayedItems.map((rawItem, idx) => {
          const item = normalizeRawCartItem(rawItem, idx);
          const p = item.product;
          const lineTotal = p.price * item.quantity;
          const variantText = item.selectedSize || item.selectedColor
            ? `${item.selectedSize || ''}${item.selectedColor && item.selectedSize ? ' · ' : ''}${item.selectedColor !== 'Standard' ? item.selectedColor || '' : ''}`.trim()
            : 'Standard';

          return (
            <div
              key={`${p.id}-${item.selectedSize}-${item.selectedColor}-${idx}`}
              className="grid grid-cols-[48px_1fr_auto] gap-3 items-center py-1.5 border-b border-white/[0.05] last:border-0"
            >
              <div className="relative h-14 w-12 rounded-md border border-white/10 bg-white/[0.03] overflow-hidden shrink-0 flex items-center justify-center">
                <img
                  src={resolveProductImage(p.image)}
                  alt={p.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target && !target.src.includes('p1.png')) {
                      target.src = '/assets/images/products/p1.png';
                    }
                  }}
                />
              </div>
              <div className="flex flex-col min-w-0 pr-1">
                <span className="text-[12.5px] font-semibold text-white leading-tight line-clamp-1">
                  {p.name}
                </span>
                <span className="text-[11px] text-white/50 truncate mt-0.5">
                  {variantText || 'Standard'} &middot; Qty {item.quantity}
                </span>
              </div>
              <div className="text-[12.5px] font-bold text-white font-mono whitespace-nowrap text-right">
                {formatPrice(lineTotal)}
              </div>
            </div>
          );
        })}
      </div>

      {items.length > 2 && (
        <button
          type="button"
          onClick={() => setShowAllItems(!showAllItems)}
          className="text-[11px] font-semibold text-accent-cyan hover:underline flex items-center justify-center gap-1 py-1"
        >
          {showAllItems ? (
            <>Show fewer pieces <ChevronUp className="h-3 w-3" /></>
          ) : (
            <>+{items.length - 2} more piece{items.length - 2 > 1 ? 's' : ''} <ChevronDown className="h-3 w-3" /></>
          )}
        </button>
      )}

      {/* 1-Line Streamlined Promotional Discount */}
      {!appliedCoupon && subtotal >= 100 ? (
        <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/[0.06] p-2.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0 text-xs">
            <Sparkles className="h-3.5 w-3.5 text-accent-cyan shrink-0" />
            <span className="text-white/80 text-[11.5px] truncate">
              <strong>VIP20</strong> offers 20% off
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleApply('VIP20')}
            className="shrink-0 rounded-lg bg-[#34D399] px-2.5 py-1 text-[11px] font-bold text-[#01132B] hover:bg-[#34D399]/90 transition-all"
          >
            Apply −{formatPrice(subtotal * 0.2)}
          </button>
        </div>
      ) : appliedCoupon ? (
        <div id="coupon-pill-wrap" className="rounded-xl border border-[#34D399]/30 bg-[#34D399]/10 p-2.5 flex items-center justify-between">
          <span id="coupon-pill-label" className="text-xs font-semibold text-[#34D399] flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Code {appliedCoupon} Active (−{formatPrice(discount)})
          </span>
          <button
            type="button"
            onClick={onRemoveCoupon}
            className="text-white/45 text-base hover:text-[#FB7185] transition-colors leading-none"
            aria-label="Remove promo code"
          >
            &times;
          </button>
        </div>
      ) : null}

      {/* Custom Promo Code Toggle */}
      {!appliedCoupon && (
        <div>
          {!isCustomCouponOpen ? (
            <button
              type="button"
              onClick={() => setIsCustomCouponOpen(true)}
              className="text-[11px] text-white/50 hover:text-accent-cyan transition-colors"
            >
              + Have another promo code?
            </button>
          ) : (
            <div id="coupon-input-row" className="flex gap-2 mt-1">
              <input
                type="text"
                id="coupon-input"
                value={couponCodeInput}
                onChange={(e) => {
                  setCouponCodeInput(e.target.value);
                  setCouponError(null);
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleApply()}
                placeholder="Enter promo code"
                className={`flex-1 h-9 rounded-lg border bg-[#041430]/70 px-3 text-xs text-white focus:outline-none focus:border-accent-cyan ${
                  couponError ? 'border-[#FB7185]' : 'border-white/12'
                }`}
              />
              <button
                type="button"
                onClick={() => handleApply()}
                className="h-9 rounded-lg border border-white/15 bg-white/[0.06] px-3 text-[11px] font-bold tracking-wider text-white hover:bg-white/[0.12]"
              >
                APPLY
              </button>
            </div>
          )}
          {couponError && (
            <span id="coupon-feedback" className="text-[11px] text-[#FB7185] block mt-1">
              {couponError}
            </span>
          )}
        </div>
      )}

      {/* Financial Ledger */}
      <div className="flex flex-col gap-2 py-3 border-y border-white/10 text-xs">
        <div className="flex justify-between text-white/60">
          <span>Subtotal</span>
          <span id="summary-subtotal" className="font-mono text-white text-[12.5px]">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-white/60">
          <span id="summary-shipping-label">Standard Delivery</span>
          <span
            id="summary-shipping"
            className={`font-mono text-[12.5px] ${shipping === 0 ? 'text-[#34D399]' : 'text-white'}`}
          >
            {shipping === 0 ? 'FREE' : formatPrice(shipping)}
          </span>
        </div>

        {discount > 0 && (
          <div id="summary-discount-row" className="flex justify-between text-[#34D399]">
            <span id="summary-discount-label">Discount Applied</span>
            <span id="summary-discount-amount" className="font-mono text-[12.5px]">
              −{formatPrice(discount)}
            </span>
          </div>
        )}

        {isGiftWrap && (
          <div id="summary-gift-row" className="flex justify-between text-accent-cyan">
            <span>Complimentary Gift Packaging</span>
            <span className="font-mono text-[12.5px]">FREE</span>
          </div>
        )}

        <div className="flex justify-between text-[11px] text-white/40">
          <span>Estimated VAT (19% Included)</span>
          <span id="summary-vat" className="font-mono">
            {formatPrice(vatAmount)}
          </span>
        </div>

        <div className="flex justify-between items-center pt-2.5 border-t border-white/10 font-bold text-white text-sm">
          <span>Total (Incl. VAT)</span>
          <span id="summary-total" className="font-mono text-base text-white">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      {/* Compact Trust Strip */}
      <div className="grid grid-cols-2 gap-1.5 text-[10.5px] text-white/50">
        <div className="flex items-center gap-1.5 truncate">
          <RotateCcw className="h-3 w-3 text-accent-cyan shrink-0" />
          <span className="truncate">14-day free returns</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <ShieldCheck className="h-3 w-3 text-[#34D399] shrink-0" />
          <span className="truncate">100% authentic</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Lock className="h-3 w-3 text-accent-cyan shrink-0" />
          <span className="truncate">SSL 256-bit encrypted</span>
        </div>
        <div className="flex items-center gap-1.5 truncate">
          <Leaf className="h-3 w-3 text-[#34D399] shrink-0" />
          <span className="truncate">Carbon neutral delivery</span>
        </div>
      </div>

      {/* Primary Submit CTA Button */}
      <button
        type="button"
        id="btn-place-order"
        onClick={onSubmitOrder}
        disabled={isProcessing || items.length === 0}
        className="w-full min-h-[48px] rounded-xl bg-gradient-to-r from-accent-cyan to-[#00C4E0] p-2.5 px-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#01132B] shadow-[0_8px_24px_rgba(61,224,255,0.22)] transition-all hover:opacity-95 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <div className="flex items-center gap-2">
          {isProcessing ? (
            <div className="w-3.5 h-3.5 rounded-full border-2 border-[#01132B] border-t-transparent animate-spin shrink-0" />
          ) : (
            <Lock className="h-3.5 w-3.5 shrink-0" />
          )}
          <span id="btn-order-primary-text">
            {isProcessing ? 'AUTHORIZING PAYMENT…' : 'PAY & COMPLETE ORDER'}
          </span>
        </div>
        <span
          id="submit-total-display"
          className="rounded-full bg-black/20 px-2.5 py-0.5 text-xs font-mono font-bold"
        >
          {formatPrice(total)}
        </span>
      </button>

      <p className="text-center text-[10.5px] text-white/40 leading-tight">
        By placing your order, you agree to our{' '}
        <Link href="/terms" className="text-white/60 underline">
          Terms
        </Link>{' '}
        &amp;{' '}
        <Link href="/privacy" className="text-white/60 underline">
          Privacy Policy
        </Link>
        .
      </p>
    </aside>
  );
}

