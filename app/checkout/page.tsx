'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Lock,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  ShoppingBag,
  X,
  Smartphone,
} from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Eleanor Vance',
    email: 'eleanor.vance@atelier-client.com',
    phone: '+880 1711 000000',
    address: 'Gulshan Avenue, Road 45, House 12',
    apartment: 'Penthouse B4',
    city: 'Dhaka',
    postalCode: '1212',
    deliveryNotes: 'Please ring bell twice upon arrival',
    shippingMethod: 'express', // express | standard
    paymentMethod: 'bkash', // bkash | nagad | card | cod
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  const {
    items,
    appliedCoupon,
    discountPercentage,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    clearCart,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuickFillDemo = () => {
    setFormData({
      name: 'Julian Montgomery',
      email: 'julian.montgomery@maison.eu',
      phone: '+880 1819 123456',
      address: 'Banani Block D, Road 11',
      apartment: 'Suite 602',
      city: 'Dhaka',
      postalCode: '1213',
      deliveryNotes: 'Leave with atelier concierge',
      shippingMethod: 'express',
      paymentMethod: 'bkash',
    });
  };

  const handleAuthorizeOrder = () => {
    if (formData.paymentMethod === 'cod') {
      executeOrderCompletion();
    } else {
      setIsPinModalOpen(true);
    }
  };

  const executeOrderCompletion = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const orderId = `NX-ORD-${Math.floor(100000 + Math.random() * 900000)}`;
      const orderData = {
        orderId,
        date: new Date().toISOString(),
        items,
        subtotal,
        discount,
        shipping,
        total,
        client: formData,
      };

      if (typeof window !== 'undefined') {
        sessionStorage.setItem('latest_order', JSON.stringify(orderData));
      }

      clearCart();
      setIsProcessing(false);
      setIsPinModalOpen(false);
      router.push(`/confirmation?orderId=${orderId}`);
    }, 1200);
  };

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 4) {
      setPinError('Please enter a valid 4-digit demo PIN (e.g. 1234)');
      return;
    }
    setPinError('');
    executeOrderCompletion();
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
            <ChevronRight size={12} />
            <Link href="/cart" className="hover:text-white transition-colors">
              Shopping Bag
            </Link>
            <ChevronRight size={12} />
            <span className="text-white">Frictionless Settlement</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-semibold text-emerald-400 mb-2">
                <Lock size={12} />
                <span>256-Bit Encrypted Client Settlement</span>
              </div>
              <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
                Atelier <span className="italic">Settlement</span>
              </h1>
            </div>

            <button
              onClick={handleQuickFillDemo}
              className="text-xs text-accent-pink hover:text-accent-pink/80 flex items-center gap-1 font-medium underline underline-offset-4"
            >
              <Sparkles size={14} />
              <span>1-Click Demo Client Profile</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Checkout Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {items.length === 0 ? (
          <div className="text-center py-20 bg-surface-navy/20 rounded-3xl border border-white/5 max-w-xl mx-auto space-y-4">
            <ShoppingBag size={48} className="mx-auto text-white/20" />
            <h2 className="font-editorial text-xl text-white">Your bag has no items to settle</h2>
            <Link
              href="/category"
              className="inline-block px-6 py-2.5 rounded-full bg-white text-obsidian-950 text-xs font-semibold uppercase tracking-wider"
            >
              Browse Collections
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: 4-Step Progressive Accordion (7 cols) */}
            <div className="lg:col-span-7 space-y-5">
              {/* Step 1: Client Information */}
              <div className="p-6 rounded-2xl bg-surface-navy/35 border border-white/10 space-y-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveStep(activeStep === 1 ? 0 : 1)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-pink text-white text-xs font-bold flex items-center justify-center">
                      1
                    </span>
                    <h2 className="font-editorial text-xl text-white font-medium">
                      Client Contact &amp; Verification
                    </h2>
                  </div>
                  {activeStep === 1 ? (
                    <span className="text-xs text-accent-pink">Active</span>
                  ) : (
                    <span className="text-xs text-white/40">Edit</span>
                  )}
                </div>

                {activeStep === 1 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-white/60">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full bg-obsidian-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-pink"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-white/60">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full bg-obsidian-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-pink"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-white/60">
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full bg-obsidian-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-pink"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveStep(2)}
                        className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-xs font-semibold transition-colors"
                      >
                        Continue to Delivery &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Delivery Address */}
              <div className="p-6 rounded-2xl bg-surface-navy/35 border border-white/10 space-y-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveStep(activeStep === 2 ? 0 : 2)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-pink text-white text-xs font-bold flex items-center justify-center">
                      2
                    </span>
                    <h2 className="font-editorial text-xl text-white font-medium">
                      Atelier Delivery Address
                    </h2>
                  </div>
                  {activeStep === 2 ? (
                    <span className="text-xs text-accent-pink">Active</span>
                  ) : (
                    <span className="text-xs text-white/40">Edit</span>
                  )}
                </div>

                {activeStep === 2 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/10">
                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-white/60">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="w-full bg-obsidian-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-pink"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-white/60">
                        Apartment / Suite / Floor
                      </label>
                      <input
                        type="text"
                        name="apartment"
                        value={formData.apartment}
                        onChange={handleInputChange}
                        className="w-full bg-obsidian-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-pink"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-white/60">
                        City
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full bg-obsidian-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-pink"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="text-[11px] uppercase tracking-wider text-white/60">
                        Delivery Instructions for Courier
                      </label>
                      <input
                        type="text"
                        name="deliveryNotes"
                        value={formData.deliveryNotes}
                        onChange={handleInputChange}
                        className="w-full bg-obsidian-950/80 border border-white/15 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-accent-pink"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveStep(3)}
                        className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-xs font-semibold transition-colors"
                      >
                        Continue to Shipping Preference &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Shipping Method */}
              <div className="p-6 rounded-2xl bg-surface-navy/35 border border-white/10 space-y-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveStep(activeStep === 3 ? 0 : 3)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-pink text-white text-xs font-bold flex items-center justify-center">
                      3
                    </span>
                    <h2 className="font-editorial text-xl text-white font-medium">
                      Delivery Service Schedule
                    </h2>
                  </div>
                  {activeStep === 3 ? (
                    <span className="text-xs text-accent-pink">Active</span>
                  ) : (
                    <span className="text-xs text-white/40">Edit</span>
                  )}
                </div>

                {activeStep === 3 && (
                  <div className="space-y-3 pt-4 border-t border-white/10">
                    <label
                      className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                        formData.shippingMethod === 'express'
                          ? 'border-accent-pink bg-surface-navy/70 ring-1 ring-accent-pink/30'
                          : 'border-white/10 bg-surface-navy/20 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="shippingMethod"
                          value="express"
                          checked={formData.shippingMethod === 'express'}
                          onChange={handleInputChange}
                          className="text-accent-pink focus:ring-0"
                        />
                        <div>
                          <div className="text-xs font-semibold text-white flex items-center gap-2">
                            <span>White-Glove Express Courier</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                              RECOMMENDED
                            </span>
                          </div>
                          <div className="text-[11px] text-white/50 mt-0.5">
                            Delivered in 24–48 hours with live 6-stage timeline tracking.
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">
                        {shipping === 0 ? 'FREE' : formatPrice(shipping)}
                      </span>
                    </label>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveStep(4)}
                        className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white text-white hover:text-obsidian-950 text-xs font-semibold transition-colors"
                      >
                        Continue to Settlement &rarr;
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Payment Method */}
              <div className="p-6 rounded-2xl bg-surface-navy/35 border border-white/10 space-y-4">
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveStep(4)}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-accent-pink text-white text-xs font-bold flex items-center justify-center">
                      4
                    </span>
                    <h2 className="font-editorial text-xl text-white font-medium">
                      Settlement &amp; Authorization
                    </h2>
                  </div>
                  <span className="text-xs text-accent-pink">Active</span>
                </div>

                <div className="space-y-3 pt-4 border-t border-white/10">
                  {/* bKash Radio */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'bkash'
                        ? 'border-accent-pink bg-surface-navy/70 ring-1 ring-accent-pink/30'
                        : 'border-white/10 bg-surface-navy/20 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="bkash"
                        checked={formData.paymentMethod === 'bkash'}
                        onChange={handleInputChange}
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">bKash Mobile Banking</div>
                        <div className="text-[11px] text-white/50">
                          Interactive PIN authorization sheet with instantaneous order confirmation.
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-accent-pink">bKash</span>
                  </label>

                  {/* Nagad Radio */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'nagad'
                        ? 'border-accent-pink bg-surface-navy/70 ring-1 ring-accent-pink/30'
                        : 'border-white/10 bg-surface-navy/20 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="nagad"
                        checked={formData.paymentMethod === 'nagad'}
                        onChange={handleInputChange}
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">Nagad Digital Wallet</div>
                        <div className="text-[11px] text-white/50">
                          Direct mobile PIN authentication.
                        </div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-500">Nagad</span>
                  </label>

                  {/* Card Radio */}
                  <label
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === 'card'
                        ? 'border-accent-pink bg-surface-navy/70 ring-1 ring-accent-pink/30'
                        : 'border-white/10 bg-surface-navy/20 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleInputChange}
                      />
                      <div>
                        <div className="text-xs font-semibold text-white">Visa / Mastercard / Amex</div>
                        <div className="text-[11px] text-white/50">
                          3D-Secure 2.0 international bank settlement.
                        </div>
                      </div>
                    </div>
                    <CreditCard size={18} className="text-accent-cyan" />
                  </label>

                  {/* Authorize CTA */}
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={handleAuthorizeOrder}
                      className="w-full py-4 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-crimson/30 flex items-center justify-center gap-2"
                    >
                      <Lock size={14} />
                      <span>Authorize Order &bull; {formatPrice(total)}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Sticky Valuation & Items Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="p-6 rounded-2xl bg-surface-navy/40 border border-white/10 space-y-6 sticky top-24 shadow-xl">
                <h2 className="font-editorial text-2xl text-white font-normal pb-4 border-b border-white/10">
                  Summary Breakdown
                </h2>

                {/* Mini Item Previews */}
                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {items.map((item, idx) => (
                    <div
                      key={`${item.product.id}-${idx}`}
                      className="flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="relative w-12 h-14 bg-surface-card rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="truncate">
                          <div className="text-white font-medium truncate">
                            {item.product.name}
                          </div>
                          <div className="text-[11px] text-white/50">
                            Qty: {item.quantity} {item.selectedSize ? `• ${item.selectedSize}` : ''}
                          </div>
                        </div>
                      </div>
                      <span className="text-white font-semibold flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity, item.product.currency)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Price Math */}
                <div className="space-y-3 text-xs pt-4 border-t border-white/10">
                  <div className="flex justify-between text-white/70">
                    <span>Subtotal</span>
                    <span className="text-white font-medium">{formatPrice(subtotal)}</span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-medium">
                      <span>Privilege Discount ({appliedCoupon})</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-white/70">
                    <span>Express Dispatch</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-emerald-400 font-semibold">COMPLIMENTARY</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between items-baseline pt-4 border-t border-white/10 text-base">
                    <span className="font-editorial text-xl text-white">Total Settlement</span>
                    <span className="font-bold text-2xl text-white tracking-tight">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slide-Up Mobile PIN Authentication Modal Sheet */}
      {isPinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => !isProcessing && setIsPinModalOpen(false)}
          />

          <div className="relative w-full max-w-md bg-obsidian-950 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl z-10">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2.5">
                <Smartphone size={22} className="text-accent-pink" />
                <div>
                  <h3 className="font-editorial text-xl text-white">
                    {formData.paymentMethod === 'bkash' ? 'bKash Mobile PIN' : 'Nagad PIN Verification'}
                  </h3>
                  <p className="text-[11px] text-white/50">Merchant: nexCommerce Atelier</p>
                </div>
              </div>

              {!isProcessing && (
                <button
                  onClick={() => setIsPinModalOpen(false)}
                  className="p-1.5 text-white/40 hover:text-white rounded-full"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-surface-navy/60 border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/60">Authorization Total:</span>
              <strong className="text-base text-white">{formatPrice(total)}</strong>
            </div>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs text-white/70 block">
                  Enter 4-Digit Wallet PIN (Demo PIN: 1234)
                </label>
                <input
                  type="password"
                  maxLength={5}
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="&bull;&bull;&bull;&bull;"
                  className="w-full bg-obsidian-900 border border-white/20 rounded-xl px-4 py-3 text-center text-2xl tracking-[1em] text-white placeholder-white/20 focus:outline-none focus:border-accent-pink font-mono"
                  autoFocus
                />
                {pinError && <p className="text-xs text-rose-400">{pinError}</p>}
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-accent-pink hover:bg-accent-pink/90 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Confirm Authorization</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
