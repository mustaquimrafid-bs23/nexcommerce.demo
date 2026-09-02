'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  RotateCcw,
  Tag,
  CheckCircle2,
  X,
  Heart,
  Sparkles,
  Receipt,
  Lock,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { OrderConfidenceStrip } from '@/components/cart/OrderConfidenceStrip';
import { CartPromoBanner } from '@/components/cart/CartPromoBanner';
import { SmartSavingsAdvisor } from '@/components/cart/SmartSavingsAdvisor';
import { BudgetCartModal } from '@/components/cart/BudgetCartModal';
import { SlipToCartModal } from '@/components/cart/SlipToCartModal';
import { CartRecoveryModal } from '@/components/cart/CartRecoveryModal';

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  // Modals state
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
  const [isRecoveryModalOpen, setIsRecoveryModalOpen] = useState(false);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

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
    closeCart,
  } = useCartStore();

  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
    // Ensure minicart drawer is closed when viewing full cart page
    closeCart();

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && items.length > 0) {
        if (typeof window !== 'undefined' && !sessionStorage.getItem('nex_recovery_dismissed')) {
          setIsRecoveryModalOpen(true);
        }
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [closeCart, items.length]);

  if (!mounted) {
    return (
      <div
        className="min-h-[70vh] flex items-center justify-center text-white"
        style={{ background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)' }}
      >
        <div className="w-8 h-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  const shipping = getShippingFee();
  const total = getTotal();
  const itemCount = getItemCount();

  const FREE_SHIPPING_THRESHOLD = 150;
  const progressPercent = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFree = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    setCouponMessage({ text: res.message, isError: !res.success });
    if (res.success) setCouponInput('');
  };

  const handleRemoveWithAnimation = (
    productId: string,
    size?: string,
    color?: string
  ) => {
    const key = `${productId}-${size || ''}-${color || ''}`;
    setRemovingItemId(key);
    setTimeout(() => {
      removeItem(productId, size, color);
      setRemovingItemId(null);
    }, 240);
  };

  return (
    <div
      className="min-h-screen text-white pb-28 relative overflow-hidden"
      style={{ background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)' }}
    >
      {/* Background Subtle Ambient Highlights */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-accent-cyan/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-accent-pink/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 relative z-10">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-white/50" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-accent-cyan transition-colors flex items-center gap-1">
            Home
          </Link>
          <span className="text-white/30">/</span>
          <span className="text-white font-medium">Shopping Bag</span>
        </nav>

        {/* Editorial Luxury Hero & Action Toolbar */}
        <header
          id="cartPageHeader"
          className="rounded-2xl border border-white/10 bg-gradient-to-br from-surface-navy/70 via-obsidian-900/85 to-obsidian-950/90 p-6 md:p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start justify-between">
            {/* Left: Eyebrow, Title, Subtitle */}
            <div className="lg:col-span-7 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
                <span className="text-[10px] font-bold tracking-widest uppercase text-accent-cyan">
                  Your Selection
                </span>
                <span className="text-white/30">&middot;</span>
                <span
                  id="cartItemCount"
                  className="px-2.5 py-0.5 rounded-full bg-white/10 border border-white/10 text-[10px] font-bold tracking-wider text-white"
                >
                  {itemCount} {itemCount === 1 ? 'Item Selected' : 'Items Selected'}
                </span>
              </div>

              <h1 className="font-sans font-bold text-3xl sm:text-4xl text-white tracking-tight">
                Shopping <em className="font-serif italic font-normal text-accent-cyan">Bag</em>
              </h1>

              <p className="text-xs text-white/70 max-w-xl leading-relaxed">
                Review your selected pieces, complimentary express delivery terms, and complete your purchase with quiet confidence.
              </p>
            </div>

            {/* Right: Stats Summary Cluster */}
            <div
              id="cartHeroStats"
              className="lg:col-span-5 bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-around text-center shadow-inner"
            >
              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider block">
                  TOTAL ITEMS
                </span>
                <span id="heroPieceCount" className="text-base font-bold text-white tabular-nums block font-sans">
                  {itemCount}
                </span>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider block">
                  ESTIMATED VALUE
                </span>
                <span id="heroSubtotalVal" className="text-base font-bold text-white tabular-nums block font-sans">
                  {formatPrice(subtotal)}
                </span>
              </div>

              <div className="w-px h-8 bg-white/10" />

              <div className="space-y-1">
                <span className="text-[9px] uppercase font-bold text-white/50 tracking-wider block">
                  EXPRESS DELIVERY
                </span>
                <span
                  id="heroShippingStatus"
                  className={`text-base font-bold block font-sans ${
                    remainingForFree === 0 ? 'text-emerald-400' : 'text-accent-cyan'
                  }`}
                >
                  {remainingForFree === 0 ? 'Complimentary' : 'Standard EU'}
                </span>
              </div>
            </div>
          </div>

          {/* Integrated Action Toolbar */}
          <div
            id="cartHeaderActions"
            className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-3"
          >
            <div>
              <Link
                href="/category?cat=all"
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-all flex items-center gap-2"
              >
                <ArrowLeft size={13} />
                <span>Continue Shopping</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                data-action="open-budget-cart"
                onClick={() => setIsBudgetModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/30 text-accent-cyan hover:text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Sparkles size={13} />
                <span>Budget Builder</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-accent-cyan/20 text-accent-cyan ml-1">
                  Smart
                </span>
              </button>

              <button
                type="button"
                data-action="open-slip-to-cart"
                onClick={() => setIsSlipModalOpen(true)}
                className="px-3.5 py-2.5 rounded-xl bg-accent-pink/10 hover:bg-accent-pink/20 border border-accent-pink/30 text-accent-pink hover:text-white text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 shadow-sm"
              >
                <Receipt size={13} />
                <span>Slip to Cart</span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-accent-pink/20 text-accent-pink ml-1">
                  Smart
                </span>
              </button>

              {items.length > 0 && (
                <button
                  type="button"
                  data-action="clear-cart"
                  onClick={clearCart}
                  className="px-3.5 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/25 text-rose-300 hover:text-rose-200 text-xs font-bold tracking-wider uppercase transition-all flex items-center gap-1.5"
                >
                  <Trash2 size={13} />
                  <span>Clear Bag</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* 120FPS Express Delivery Milestone Progress Capsule */}
        {items.length > 0 && (
          <div
            id="cartDeliveryCapsule"
            className="p-4 rounded-xl bg-gradient-to-r from-surface-navy/60 via-obsidian-900/70 to-surface-navy/60 border border-white/10 space-y-2 shadow-lg"
            aria-label="Complimentary Express Delivery Progress"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-1.5">
              <div className="flex items-center gap-2 text-white/90">
                <span
                  className={`w-2 h-2 rounded-full ${
                    remainingForFree === 0 ? 'bg-emerald-400' : 'bg-accent-cyan'
                  }`}
                />
                <span className="font-medium">
                  {remainingForFree === 0 ? (
                    <strong className="text-emerald-400 font-semibold">
                      ✓ Complimentary Express Delivery Unlocked
                    </strong>
                  ) : (
                    <span>
                      Add <strong className="text-white">{formatPrice(remainingForFree)}</strong> more for Complimentary Express Delivery
                    </span>
                  )}
                </span>
              </div>

              <span
                id="deliveryThresholdBadge"
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  remainingForFree === 0
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                    : 'bg-white/5 border-white/10 text-white/60'
                }`}
              >
                {remainingForFree === 0 ? '✓ Express Delivery Unlocked' : 'Spend €150 for free delivery'}
              </span>
            </div>

            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                id="cartDeliveryProgressBar"
                className="h-full bg-gradient-to-r from-accent-cyan to-emerald-400 transition-all duration-500 rounded-full shadow-[0_0_12px_rgba(0,245,160,0.4)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Cart Main Canvas: Empty Fallback or 2-Column Grid */}
        {items.length === 0 ? (
          <div
            id="cartEmptyArea"
            className="text-center py-20 px-6 space-y-6 bg-surface-navy/20 rounded-3xl border border-white/5 max-w-2xl mx-auto shadow-2xl"
          >
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-white/30">
              <ShoppingBag size={32} />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-accent-cyan">
                Your Shopping Bag
              </span>
              <h2 className="text-2xl font-editorial text-white">Your shopping bag is empty</h2>
              <p className="text-xs text-white/50 max-w-md mx-auto leading-relaxed">
                Explore our contemporary collections, new arrivals, and handpicked edits.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/category?cat=all"
                className="px-6 py-3 rounded-xl bg-white text-obsidian-950 text-xs font-bold uppercase tracking-wider hover:bg-white/90 transition-all flex items-center gap-2 shadow-lg"
              >
                <span>Explore New Arrivals</span>
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/discovery"
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5"
              >
                <Sparkles size={13} className="text-accent-cyan" />
                <span>Discover Products</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsBudgetModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5"
              >
                <Sparkles size={13} className="text-accent-cyan" />
                <span>Smart Budget Builder</span>
              </button>
              <button
                type="button"
                onClick={() => setIsSlipModalOpen(true)}
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5"
              >
                <Receipt size={13} className="text-accent-pink" />
                <span>Smart Slip to Cart</span>
              </button>
              <Link
                href="/wishlist"
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-white transition-all flex items-center gap-1.5"
              >
                <Heart size={13} className="text-accent-pink" />
                <span>Wishlist</span>
              </Link>
            </div>
          </div>
        ) : (
          <div id="cartGrid" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Cart Rows, Confidence Badges & Promotional Banner (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Product Rows List */}
              <div id="cartItemsList" className="space-y-4" role="region" aria-label="Cart Items">
                {items.map((item, idx) => {
                  const itemKey = `${item.product.id}-${item.selectedSize || ''}-${item.selectedColor || ''}`;
                  const isRemoving = removingItemId === itemKey;
                  const isSaved = isWishlisted(item.product.id);

                  return (
                    <div
                      key={`${itemKey}-${idx}`}
                      className={`p-5 rounded-2xl bg-surface-navy/35 border border-white/10 flex flex-col sm:flex-row gap-5 transition-all duration-300 hover:border-white/20 ${
                        isRemoving ? 'opacity-0 translate-x-4 pointer-events-none' : 'opacity-100'
                      }`}
                    >
                      {/* Thumbnail frame (3:4 ratio) */}
                      <Link
                        href={`/product/${item.product.id}`}
                        className="relative w-28 sm:w-24 aspect-[3/4] bg-surface-navy/60 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10 group"
                      >
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="text-white/20">
                            <ShoppingBag size={24} />
                          </div>
                        )}
                      </Link>

                      {/* Item Details */}
                      <div className="flex-1 flex flex-col justify-between space-y-3">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <div className="text-[10px] uppercase tracking-wider text-accent-cyan font-bold">
                              {item.product.category}
                            </div>
                            <Link href={`/product/${item.product.id}`}>
                              <h3 className="text-base font-editorial text-white font-medium hover:text-accent-pink transition-colors">
                                {item.product.name}
                              </h3>
                            </Link>

                            {/* Variant tags */}
                            <div className="flex items-center gap-2 mt-1.5 text-xs text-white/60">
                              {item.selectedSize && (
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px]">
                                  Colour: {item.selectedColor}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Line item pricing */}
                          <div className="text-right">
                            <div className="text-sm font-semibold text-white font-mono tabular-nums">
                              {formatPrice(item.product.price * item.quantity)}
                            </div>
                            <div className="text-[11px] text-white/40 tabular-nums font-mono">
                              {formatPrice(item.product.price)} each
                            </div>
                          </div>
                        </div>

                        {/* Steppers & Micro Action Buttons */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          {/* Quantity Stepper */}
                          <div className="flex items-center border border-white/15 rounded-lg bg-surface-navy/60 overflow-hidden">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity - 1,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                              className="w-8 h-8 text-xs text-white/60 hover:text-white flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <span className="px-3 text-xs font-semibold text-white tabular-nums font-mono">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.product.id,
                                  item.quantity + 1,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                              className="w-8 h-8 text-xs text-white/60 hover:text-white flex items-center justify-center transition-colors min-w-[44px] min-h-[44px]"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          {/* Micro Actions: Wishlist + Remove */}
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => toggleWishlist(item.product)}
                              className={`w-10 h-10 min-w-[44px] min-h-[44px] rounded-lg border flex items-center justify-center transition-colors ${
                                isSaved
                                  ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                                  : 'bg-white/5 border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-500/30'
                              }`}
                              title={isSaved ? 'Saved in Wishlist' : 'Save to Wishlist'}
                              aria-label="Wishlist"
                            >
                              <Heart size={14} fill={isSaved ? 'currentColor' : 'none'} />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveWithAnimation(
                                  item.product.id,
                                  item.selectedSize,
                                  item.selectedColor
                                )
                              }
                              className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-rose-400 hover:border-rose-500/30 flex items-center justify-center transition-colors"
                              title="Remove item from bag"
                              aria-label="Remove item"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Order Confidence Badge Strip */}
              <OrderConfidenceStrip />

              {/* Promotional Exclusive Banner */}
              <CartPromoBanner />
            </div>

            {/* Right Column: Sticky Order Summary (5 cols) */}
            <aside id="cartSummaryArea" className="lg:col-span-5 space-y-6">
              <div className="p-6 md:p-7 rounded-2xl bg-surface-navy/40 border border-white/10 space-y-6 sticky top-24 shadow-2xl backdrop-blur-xl">
                <h2 className="font-editorial text-2xl text-white font-normal pb-4 border-b border-white/10">
                  Order Summary
                </h2>

                {/* Smart Savings Advisor */}
                <SmartSavingsAdvisor />

                {/* Promo Code Input Form */}
                <div className="space-y-3">
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <Tag size={13} className="text-accent-cyan" />
                    <span>Promo or Gift Code</span>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-accent-cyan/10 border border-accent-cyan/30 text-xs">
                      <div className="flex items-center gap-2 text-accent-cyan font-semibold">
                        <CheckCircle2 size={16} />
                        <span>{appliedCoupon} ({discountPercentage}% OFF)</span>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        className="text-white/60 hover:text-white transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Remove coupon"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Try: VIP20, NEX10, or FREESHIP"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3 py-2.5 text-xs text-white placeholder-white/40 uppercase tracking-wider focus:outline-none focus:border-accent-cyan font-mono"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-colors min-h-[44px]"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {couponMessage && (
                    <p
                      className={`text-xs font-medium ${
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
                    <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
                    <span className="text-white font-mono tabular-nums">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Privilege Discount ({discountPercentage}%)</span>
                      <span className="font-mono tabular-nums">-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Standard EU Tracked Delivery</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-bold uppercase tracking-wide">FREE</span>
                      ) : (
                        <span className="font-mono tabular-nums">{formatPrice(shipping)}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-white/50 text-[11px] pt-1">
                    <span>Statutory European VAT &amp; Duties</span>
                    <span>Included</span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-white/10 text-base">
                    <span className="font-editorial text-xl text-white">Total Due</span>
                    <span className="font-bold text-2xl text-white tracking-tight font-mono tabular-nums">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Checkout Primary CTA */}
                <Link
                  href="/checkout"
                  className="block w-full py-4 rounded-xl bg-white text-obsidian-950 hover:bg-white/90 font-bold text-xs uppercase tracking-widest text-center transition-all shadow-xl hover:scale-[1.01] active:scale-[0.99] min-h-[44px] flex items-center justify-center"
                >
                  Proceed to Checkout &rarr;
                </Link>

                {/* Security Trust Badges Strip */}
                <div className="space-y-2 pt-3 border-t border-white/10 text-[11px] text-white/60">
                  <div className="flex items-center gap-2">
                    <RotateCcw size={14} className="text-accent-cyan flex-shrink-0" />
                    <span>14-Day Free Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-400 flex-shrink-0" />
                    <span>100% Certified Authentic Direct from Makers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Lock size={14} className="text-accent-pink flex-shrink-0" />
                    <span>256-bit Encrypted Secure Checkout</span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      {/* 375px Mobile Sticky Checkout Bar */}
      {items.length > 0 && (
        <div
          id="mobileCartStickyBar"
          className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-obsidian-950/95 border-t border-white/15 backdrop-blur-xl z-40 flex items-center justify-between gap-4 shadow-2xl"
          aria-label="Mobile Checkout"
        >
          <div>
            <span className="text-[10px] uppercase font-bold text-white/50 block">Total Due</span>
            <span id="mobileStickyTotal" className="text-base font-bold text-white font-mono tabular-nums">
              {formatPrice(total)}
            </span>
          </div>

          <Link
            href="/checkout"
            className="px-6 py-3 rounded-xl bg-white text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg active:scale-95 transition-all min-h-[44px]"
          >
            <span>Checkout</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Interactive Modals */}
      <BudgetCartModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
      />

      <SlipToCartModal
        isOpen={isSlipModalOpen}
        onClose={() => setIsSlipModalOpen(false)}
      />

      <CartRecoveryModal
        isOpen={isRecoveryModalOpen}
        onClose={() => setIsRecoveryModalOpen(false)}
      />
    </div>
  );
}
