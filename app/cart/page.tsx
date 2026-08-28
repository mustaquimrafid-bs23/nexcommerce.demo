'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  CheckCircle2,
  X,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const {
    items,
    appliedCoupon,
    discountPercentage,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    getItemCount,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-accent-pink border-t-transparent animate-spin" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();
  const itemCount = getItemCount();

  const FREE_SHIPPING_THRESHOLD = 300;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Header Banner */}
      <section className="bg-obsidian-950 border-b border-white/10 pt-10 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex items-center gap-2 text-xs text-white/50">
            <Link href="/" className="hover:text-white transition-colors">
              Maison
            </Link>
            <span>/</span>
            <span className="text-white">Shopping Bag</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Your Atelier <span className="italic">Shopping Bag</span>
            </h1>
            <span className="text-xs text-white/60">
              {itemCount} {itemCount === 1 ? 'creation' : 'creations'} selected
            </span>
          </div>
        </div>
      </section>

      {/* Free Shipping Dynamic Progress Strip */}
      {items.length > 0 && (
        <div className="bg-surface-navy/60 border-b border-white/10 py-3.5 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80 flex items-center gap-1.5">
                <Truck size={14} className="text-accent-cyan" />
                {remainingForFree === 0 ? (
                  <strong className="text-emerald-400 font-semibold">
                    You have unlocked Complimentary Express Delivery!
                  </strong>
                ) : (
                  <span>
                    Add <strong>{formatPrice(remainingForFree)}</strong> more for Complimentary Express Delivery
                  </span>
                )}
              </span>
              <span className="text-white/50 text-[11px]">{Math.round(progressPercent)}%</span>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-pink to-accent-cyan transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Bag Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {items.length === 0 ? (
          <div className="text-center py-24 space-y-6 bg-surface-navy/20 rounded-3xl border border-white/5 max-w-2xl mx-auto">
            <ShoppingBag size={56} className="mx-auto text-white/20" />
            <div className="space-y-2">
              <h2 className="text-xl font-editorial text-white">Your bag is currently empty</h2>
              <p className="text-xs text-white/50 max-w-sm mx-auto">
                Explore our curated collection of footwear, structured outerwear, and tailoring.
              </p>
            </div>
            <Link
              href="/category"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-obsidian-950 text-xs font-semibold uppercase tracking-widest hover:bg-white/90 transition-colors shadow-lg shadow-white/5"
            >
              <span>Explore Collections</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Itemized List (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs text-white/50">
                <span>Creations in Bag</span>
                <button
                  onClick={clearCart}
                  className="hover:text-accent-crimson transition-colors flex items-center gap-1"
                >
                  <Trash2 size={12} />
                  <span>Clear Bag</span>
                </button>
              </div>

              {items.map((item, idx) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}-${idx}`}
                  className="p-5 rounded-2xl bg-surface-navy/35 border border-white/10 flex flex-col sm:flex-row gap-5 transition-all hover:border-white/20"
                >
                  {/* Thumbnail */}
                  <div className="relative w-24 h-28 bg-surface-navy/60 p-2 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/20">
                        <ShoppingBag size={24} />
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between space-y-3">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="text-[10px] uppercase tracking-wider text-accent-cyan font-medium">
                          {item.product.category}
                        </div>
                        <Link href={`/product/${item.product.id}`}>
                          <h3 className="text-base font-editorial text-white font-medium hover:text-accent-pink transition-colors">
                            {item.product.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1 text-xs text-white/60">
                          {item.selectedSize && (
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          {item.selectedColor && (
                            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10">
                              {item.selectedColor}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-sm font-semibold text-white">
                          {formatPrice(item.product.price * item.quantity, item.product.currency)}
                        </div>
                        <div className="text-[11px] text-white/40">
                          {formatPrice(item.product.price, item.product.currency)} each
                        </div>
                      </div>
                    </div>

                    {/* Steppers & Remove */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                      <div className="flex items-center border border-white/15 rounded-lg bg-surface-navy/60">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity - 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="px-2.5 py-1 text-xs text-white/60 hover:text-white"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-3 text-xs font-semibold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.quantity + 1,
                              item.selectedSize,
                              item.selectedColor
                            )
                          }
                          className="px-2.5 py-1 text-xs text-white/60 hover:text-white"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() =>
                          removeItem(
                            item.product.id,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="text-xs text-white/40 hover:text-accent-crimson transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={13} />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              <div className="pt-4">
                <Link
                  href="/category"
                  className="text-xs font-medium text-white/70 hover:text-white transition-colors inline-flex items-center gap-1.5"
                >
                  &larr; Continue Exploring Collections
                </Link>
              </div>
            </div>

            {/* Right Column: Valuation & Checkout Suite (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-surface-navy/40 border border-white/10 space-y-6 sticky top-24 shadow-xl">
                <h2 className="font-editorial text-2xl text-white font-normal pb-4 border-b border-white/10">
                  Order Valuation
                </h2>

                {/* Promo Code Form */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <Tag size={14} className="text-accent-pink" />
                    <span>Maison Privilege Code</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-accent-pink/10 border border-accent-pink/30 text-xs">
                      <div className="flex items-center gap-2 text-accent-pink font-semibold">
                        <CheckCircle2 size={16} />
                        <span>{appliedCoupon} ({discountPercentage}% OFF)</span>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="text-white/60 hover:text-white"
                        aria-label="Remove coupon"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try: NEX10 or LUXURY20"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-obsidian-950/80 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/40 uppercase tracking-wider focus:outline-none focus:border-accent-pink"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-obsidian-950 font-semibold text-xs transition-colors"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponMessage && (
                    <p
                      className={`text-xs ${
                        couponMessage.isError ? 'text-rose-400' : 'text-emerald-400'
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="space-y-3 text-xs pt-4 border-t border-white/10">
                  <div className="flex justify-between text-white/70">
                    <span>Bag Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Privilege Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>White-Glove Express Delivery</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-semibold">COMPLIMENTARY</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-white/50 text-[11px]">
                    <span>Estimated VAT &amp; Customs Duties</span>
                    <span>Included</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-white/10 text-base">
                    <span className="font-editorial text-xl text-white">Estimated Total</span>
                    <span className="font-bold text-2xl text-white tracking-tight">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="block w-full py-4 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white font-semibold text-xs uppercase tracking-widest text-center transition-all shadow-lg shadow-accent-crimson/25 hover:shadow-accent-crimson/40"
                >
                  Proceed to Atelier Checkout
                </Link>

                {/* Security Trust Micro-strip */}
                <div className="grid grid-cols-3 gap-2 pt-2 text-[10px] text-white/50 text-center">
                  <div className="space-y-1">
                    <ShieldCheck size={16} className="mx-auto text-emerald-400" />
                    <span>256-Bit Encrypted</span>
                  </div>
                  <div className="space-y-1">
                    <Truck size={16} className="mx-auto text-accent-pink" />
                    <span>Courier Tracking</span>
                  </div>
                  <div className="space-y-1">
                    <RotateCcw size={16} className="mx-auto text-accent-cyan" />
                    <span>14-Day Returns</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
