'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  User,
  MapPin,
  Truck,
  ShieldCheck,
  Zap,
  Gift,
  FileText,
  ShoppingBag,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useCartStore, normalizeRawCartItem } from '@/store/useCartStore';
import { formatPrice, resolveProductImage } from '@/lib/utils';
import { CheckoutHeroHeader } from '@/components/checkout/CheckoutHeroHeader';
import { CheckoutProgressRibbon } from '@/components/checkout/CheckoutProgressRibbon';
import { HolographicCardPreview } from '@/components/checkout/HolographicCardPreview';
import { OrderSummarySidebar } from '@/components/checkout/OrderSummarySidebar';
import { PaymentAuthModal } from '@/components/checkout/PaymentAuthModal';

export default function CheckoutPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: 'Tanvir Hossain',
    email: 'tanvir@brainstation-23.com',
    phoneCountry: '+49',
    phone: '152 9876 5432',
    country: 'DE',
    address: 'Friedrichstraße 42',
    city: 'Berlin',
    postcode: '10117',
    deliveryMethod: 'standard', // standard | overnight | whiteglove
    paymentMethod: 'klarna', // klarna | card | ideal | applepay | paypal | bancontact | sepa
    giftMessage: '',
    deliveryNotes: '',
    // Card details
    cardNumber: '',
    cardName: 'TANVIR HOSSAIN',
    cardExpiry: '',
    cardCvv: '',
    // SEPA details
    sepaIban: '',
    sepaBic: '',
    sepaHolder: 'Tanvir Hossain',
    // iDEAL details
    idealBank: 'ing',
  });

  const [activeStep, setActiveStep] = useState<number>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<number>(1);
  const [isGiftWrapActive, setIsGiftWrapActive] = useState<boolean>(false);
  const [isDeliveryNoteActive, setIsDeliveryNoteActive] = useState<boolean>(false);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);

  const [isMobileSummaryOpen, setIsMobileSummaryOpen] = useState<boolean>(false);

  // Modal & submission state
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isOrderConfirmed, setIsOrderConfirmed] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const {
    items,
    appliedCoupon,
    discountPercentage,
    getSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTotal,
    getItemCount,
    applyCoupon,
    removeCoupon,
    clearCart,
    syncFromStorage,
  } = useCartStore();

  useEffect(() => {
    setMounted(true);
    syncFromStorage();
  }, [syncFromStorage]);

  if (!mounted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#01132B]">
        <div className="w-8 h-8 rounded-full border-2 border-accent-cyan border-t-transparent animate-spin" />
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscountAmount();
  let shipping = 0;
  if (formData.deliveryMethod === 'standard') {
    shipping = subtotal >= 150 ? 0 : 12;
  } else if (formData.deliveryMethod === 'overnight') {
    shipping = 18;
  } else if (formData.deliveryMethod === 'whiteglove') {
    shipping = 35;
  }
  const total = Math.max(0, subtotal - discount + shipping);
  const itemCount = getItemCount();

  const goToStep = (step: number) => {
    setActiveStep(step);
    setTimeout(() => {
      const targetId = step === 1 ? 'section-customer' : step === 2 ? 'section-delivery' : 'section-payment';
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSelectAddress = (
    id: number,
    address: string,
    city: string,
    postcode: string,
    country: string
  ) => {
    setSelectedAddressId(id);
    setFormData((prev) => ({
      ...prev,
      address,
      city,
      postcode,
      country,
    }));
  };

  const formatCardNumber = (val: string) => {
    const v = val.replace(/\D/g, '').slice(0, 16);
    return v.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatCardExpiry = (val: string) => {
    let v = val.replace(/\D/g, '').slice(0, 4);
    if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
    return v;
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = 'Please enter a valid email address.';
    if (formData.phone.replace(/\D/g, '').length < 7)
      newErrors.phone = 'Please enter a valid mobile number.';
    if (formData.address.trim().length < 5)
      newErrors.address = 'Please enter your street address.';
    if (formData.city.trim().length < 2)
      newErrors.city = 'Please enter your city.';
    if (formData.postcode.trim().length < 3)
      newErrors.postcode = 'Please enter your postal code.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleContinueToDelivery = () => {
    if (validateStep1()) {
      goToStep(2);
    }
  };

  const handleContinueToPayment = () => {
    goToStep(3);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Please enter your full name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      newErrors.email = 'Please enter a valid email address.';
    if (formData.phone.replace(/\D/g, '').length < 7)
      newErrors.phone = 'Please enter a valid mobile number.';
    if (formData.address.trim().length < 5)
      newErrors.address = 'Please enter your street address and house number.';
    if (formData.city.trim().length < 2)
      newErrors.city = 'Please enter your city.';
    if (formData.postcode.trim().length < 3)
      newErrors.postcode = 'Please enter a valid postal code.';

    if (formData.paymentMethod === 'card') {
      const cleanNum = formData.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cleanNum))
        newErrors.cardNumber = 'Please enter a valid 16-digit card number.';
      if (!/^\d{2}\/\d{2}$/.test(formData.cardExpiry.replace(/\s/g, '')))
        newErrors.cardExpiry = 'Please enter a valid expiry date (MM/YY).';
      if (!/^\d{3,4}$/.test(formData.cardCvv))
        newErrors.cardCvv = 'Please enter a valid CVV.';
      if (formData.cardName.trim().length < 2)
        newErrors.cardName = 'Please enter the cardholder name.';
    }

    if (formData.paymentMethod === 'sepa') {
      if (!/^[A-Z]{2}[0-9A-Z]{13,32}$/i.test(formData.sepaIban.replace(/\s/g, '')))
        newErrors.sepaIban = 'Please enter a valid European IBAN.';
      if (formData.sepaBic.trim().length < 8)
        newErrors.sepaBic = 'Please enter a valid BIC code.';
      if (formData.sepaHolder.trim().length < 2)
        newErrors.sepaHolder = 'Please enter the account holder name.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = () => {
    if (isProcessing) return;
    const isValid = validateForm();
    if (!isValid) {
      return;
    }
    if (items.length === 0) return;

    setIsProcessing(true);

    const orderRef = 'NX-EU-' + Date.now().toString(36).toUpperCase().slice(-5);
    const placedDate = new Date();
    const formattedDate = placedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    
    // Calculate delivery ETA (2-3 business days out)
    const etaDate = new Date(placedDate.getTime() + 3 * 86400000);
    const formattedEta = etaDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const etaString = `In 2–3 Days (${formattedEta}) · DHL Tracked`;

    const confirmedOrder = {
      ref: orderRef,
      orderId: orderRef,
      id: orderRef,
      date: formattedDate,
      orderDate: formattedDate,
      placedAt: placedDate.toISOString(),
      customerName: formData.name || 'Julian Wright',
      customerEmail: formData.email || 'julian@example.com',
      email: formData.email || 'julian@example.com',
      customerPhone: `${formData.phoneCountry} ${formData.phone}`,
      phone: `${formData.phoneCountry} ${formData.phone}`,
      country: formData.country,
      address: formData.address,
      street: formData.address,
      city: formData.city,
      postcode: formData.postcode,
      deliveryMethod: formData.deliveryMethod === 'express' ? 'DHL Express On-Demand' : 'Standard Free Delivery',
      courier: formData.deliveryMethod === 'express' ? 'DHL Express' : 'Standard Delivery',
      estimatedDelivery: etaString,
      eta: etaString,
      trackingNumber: `DHL-${orderRef.replace(/[^A-Z0-9]/gi, '')}-EU`,
      paymentMethod: formData.paymentMethod || 'klarna',
      payment: formData.paymentMethod || 'klarna',
      shippingCost: shipping,
      shipping: shipping,
      subtotal,
      discount: discount,
      discountAmt: discount,
      discountCode: appliedCoupon || '',
      vatAmount: ((total * 0.19) / 1.19).toFixed(2),
      total,
      items: [...items],
      isGiftWrap: isGiftWrapActive,
      giftNote: isGiftWrapActive ? formData.giftMessage : null,
      courierNote: isDeliveryNoteActive ? formData.deliveryNotes : null,
      status: 'Confirmed',
      stage: 2,
      statusLabel: 'Order Confirmed',
    };

    if (typeof window !== 'undefined') {
      // Unified storage keys across confirmation, tracking, and order history
      try {
        sessionStorage.setItem('latest_order', JSON.stringify(confirmedOrder));
        sessionStorage.setItem('nex_confirmed_order', JSON.stringify(confirmedOrder));
      } catch (e) {
        console.error('sessionStorage write error', e);
      }

      try {
        const existingPlaced = JSON.parse(localStorage.getItem('nex_placed_orders') || '[]');
        const placedList = Array.isArray(existingPlaced) ? existingPlaced : [];
        placedList.unshift(confirmedOrder);
        localStorage.setItem('nex_placed_orders', JSON.stringify(placedList));

        const existingOrders = JSON.parse(localStorage.getItem('nex_orders') || '[]');
        const ordersList = Array.isArray(existingOrders) ? existingOrders : [];
        ordersList.unshift(confirmedOrder);
        localStorage.setItem('nex_orders', JSON.stringify(ordersList));
      } catch (e) {
        console.error('localStorage sync error', e);
      }
    }

    // Direct, sleek 500ms authorization feedback with smooth transition to confirmation
    setTimeout(() => {
      clearCart();
      router.push(`/confirmation?ref=${orderRef}`);
    }, 550);
  };

  return (
    <div className="min-h-screen bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] text-[#F8FAFF]">
      <main className="container max-w-7xl mx-auto px-4 sm:px-6 py-8" id="mainContent">
        {/* Breadcrumb */}
        <nav className="inline-flex items-center gap-2 text-[11.5px] font-medium tracking-wider text-white/45 mb-4">
          <Link href="/" className="hover:text-accent-cyan transition-colors">Home</Link>
          <span className="text-white/25">/</span>
          <Link href="/cart" className="hover:text-accent-cyan transition-colors">Shopping Bag</Link>
          <span className="text-white/25">/</span>
          <span className="text-white font-semibold">Secure Checkout</span>
        </nav>

        {/* Hero Spotlight Header */}
        <CheckoutHeroHeader itemCount={itemCount} total={total} />

        {/* 3-Step Progress Ribbon */}
        <CheckoutProgressRibbon activeStep={activeStep} onStepClick={setActiveStep} />

        {/* Empty State Guard: Avoid flashing empty state while processing navigation */}
        {items.length === 0 && !isProcessing ? (
          <div
            id="checkout-empty-state"
            className="text-center rounded-[18px] border border-white/10 bg-[#0A2A54]/30 p-12 max-w-xl mx-auto my-10 backdrop-blur-md"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-accent-cyan/20 bg-accent-cyan/10 text-accent-cyan">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Your shopping bag is empty
            </h2>
            <p className="text-sm text-white/60 mb-6 leading-relaxed">
              Please add pieces to your shopping bag before proceeding to checkout.
            </p>
            <Link
              href="/category?cat=all"
              className="inline-flex rounded-full bg-white px-7 py-3 text-xs font-bold uppercase tracking-wider text-[#003371] transition-all hover:bg-white/90"
            >
              DISCOVER THE COLLECTION
            </Link>
          </div>
        ) : (
          /* Main Checkout Grid */
          <div id="checkout-main-grid" className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-9 items-start">
            {/* LEFT COLUMN: INTERACTIVE FORMS */}
            <div className="flex flex-col gap-6">
              {/* Mobile Expandable Order Summary Bar (<lg viewports) */}
              <div className="lg:hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A2A54]/90 to-[#01132B]/95 p-4 shadow-lg backdrop-blur-md">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm font-semibold text-white">
                      Order Summary &middot; {formatPrice(total)}
                    </div>
                    <div className="text-[11.5px] text-white/50">
                      {itemCount} Piece{itemCount !== 1 ? 's' : ''} &middot; Incl. VAT
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMobileSummaryOpen(!isMobileSummaryOpen)}
                    className="h-9 px-3.5 rounded-lg border border-white/15 bg-white/[0.06] text-xs font-semibold text-white transition-all hover:bg-white/[0.12]"
                  >
                    {isMobileSummaryOpen ? 'Hide details ↑' : 'View details ↓'}
                  </button>
                </div>

                {isMobileSummaryOpen && (
                  <div className="mt-3.5 pt-3.5 border-t border-white/10 flex flex-col gap-3">
                    {items.map((rawItem, idx) => {
                      const item = normalizeRawCartItem(rawItem, idx);
                      const p = item.product;
                      return (
                        <div
                          key={`mobile-${p.id}-${idx}`}
                          className="flex justify-between items-center gap-3 text-xs text-white/80"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="h-10 w-10 rounded-md border border-white/10 bg-white/[0.04] overflow-hidden shrink-0 flex items-center justify-center">
                              <img
                                src={resolveProductImage(p.image)}
                                alt={p.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget;
                                  if (target && !target.src.includes('p1.png')) {
                                    target.src = '/assets/images/products/p1.png';
                                  }
                                }}
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate">{p.name}</div>
                              <div className="text-[10.5px] text-white/50">
                                {item.selectedSize} &middot; Qty {item.quantity}
                              </div>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-white whitespace-nowrap">
                            {formatPrice(p.price * item.quantity)}
                          </span>
                        </div>
                      );
                    })}

                    <div className="flex justify-between items-center pt-2 border-t border-white/8 text-xs font-bold text-white">
                      <span>Subtotal</span>
                      <span className="font-mono">{formatPrice(subtotal)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Express 1-Tap Wallets */}
              <section className="rounded-2xl border border-white/10 bg-[#0A2A54]/30 p-5 sm:p-6 backdrop-blur-md">
                <div className="flex items-center justify-center gap-2 text-[10px] font-bold tracking-widest text-white/45 uppercase text-center mb-3.5">
                  <Zap className="h-3.5 w-3.5 text-accent-cyan" />
                  <span>Express 1-Tap Checkout</span>
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="min-h-[48px] rounded-xl border border-white/20 bg-black text-white font-semibold flex items-center justify-center gap-1.5 transition-all hover:bg-white/10 hover:border-white/30"
                  >
                    <span> Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    className="min-h-[48px] rounded-xl border border-white/15 bg-white/[0.06] text-white font-semibold flex items-center justify-center gap-1 transition-all hover:bg-white/10 hover:border-white/30"
                  >
                    <span>Google Pay</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((p) => ({ ...p, paymentMethod: 'klarna' }));
                      setActiveStep(3);
                    }}
                    className="min-h-[48px] rounded-xl bg-[#FFB3C7] text-black font-extrabold flex items-center justify-center transition-all hover:opacity-90"
                  >
                    Klarna.
                  </button>
                </div>
                <div className="flex items-center gap-3 mt-4">
                  <div className="h-px flex-1 bg-white/10" />
                  <span className="text-[10px] font-bold tracking-widest uppercase text-white/40">
                    Or enter your delivery and payment details
                  </span>
                  <div className="h-px flex-1 bg-white/10" />
                </div>
              </section>

              {/* STEP 1: CONTACT & DELIVERY ADDRESS */}
              {activeStep === 1 ? (
                <div className="flex flex-col gap-5">
                  <section
                    id="section-customer"
                    className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-5 sm:p-6 backdrop-blur-md transition-all"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="flex items-center gap-2 font-display text-base font-semibold text-white">
                        <User className="h-4 w-4 text-accent-cyan" />
                        <span>Customer Information</span>
                      </h2>
                      <span className="rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-2 py-0.5 text-[9.5px] font-bold tracking-wider text-accent-cyan">
                        STEP 01
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-3.5">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11.5px] font-semibold text-white/70">
                          Full Name <span className="text-[#FB7185]">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Tanvir Hossain"
                          className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan ${
                            errors.name ? 'border-[#FB7185]' : 'border-white/12'
                          }`}
                        />
                        {errors.name && (
                          <span className="text-[11px] text-[#FB7185]">{errors.name}</span>
                        )}
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[11.5px] font-semibold text-white/70">
                          <span>Email Address <span className="text-[#FB7185]">*</span></span>
                          <span className="text-[10px] text-white/40 font-normal">Tracking &amp; receipt</span>
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="e.g. tanvir@brainstation-23.com"
                          className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan ${
                            errors.email ? 'border-[#FB7185]' : 'border-white/12'
                          }`}
                        />
                        {errors.email && (
                          <span className="text-[11px] text-[#FB7185]">{errors.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-[130px_1fr] gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11.5px] font-semibold text-white/70">Country</label>
                        <select
                          name="phoneCountry"
                          value={formData.phoneCountry}
                          onChange={handleInputChange}
                          className="h-11 rounded-xl border border-white/12 bg-[#041430]/70 px-3 text-xs text-white focus:outline-none focus:border-accent-cyan"
                        >
                          <option value="+49">🇩🇪 +49 (DE)</option>
                          <option value="+33">🇫🇷 +33 (FR)</option>
                          <option value="+31">🇳🇱 +31 (NL)</option>
                          <option value="+39">🇮🇹 +39 (IT)</option>
                          <option value="+34">🇪🇸 +34 (ES)</option>
                          <option value="+44">🇬🇧 +44 (UK)</option>
                          <option value="+41">🇨🇭 +41 (CH)</option>
                          <option value="+46">🇸🇪 +46 (SE)</option>
                          <option value="+43">🇦🇹 +43 (AT)</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between items-center text-[11.5px] font-semibold text-white/70">
                          <span>Mobile Number <span className="text-[#FB7185]">*</span></span>
                          <span className="text-[10px] text-white/40 font-normal">SMS delivery alerts</span>
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="152 9876 5432"
                          className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan ${
                            errors.phone ? 'border-[#FB7185]' : 'border-white/12'
                          }`}
                        />
                        {errors.phone && (
                          <span className="text-[11px] text-[#FB7185]">{errors.phone}</span>
                        )}
                      </div>
                    </div>
                  </section>

                  {/* DELIVERY ADDRESS */}
                  <section
                    id="section-shipping"
                    className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-5 sm:p-6 backdrop-blur-md transition-all"
                  >
                    <div className="flex justify-between items-center mb-3.5">
                      <h2 className="flex items-center gap-2 font-display text-base font-semibold text-white">
                        <MapPin className="h-4 w-4 text-accent-cyan" />
                        <span>Delivery Address</span>
                      </h2>
                    </div>

                    {/* Saved Address Quick Selector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3.5">
                      <div
                        onClick={() =>
                          handleSelectAddress(
                            1,
                            'Friedrichstraße 42',
                            'Berlin',
                            '10117',
                            'DE'
                          )
                        }
                        className={`rounded-xl border p-3 cursor-pointer flex items-start gap-2.5 transition-all ${
                          selectedAddressId === 1
                            ? 'border-accent-cyan bg-accent-cyan/[0.07] ring-1 ring-accent-cyan/20'
                            : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div
                          className={`h-3.5 w-3.5 rounded-full border mt-0.5 shrink-0 transition-all ${
                            selectedAddressId === 1
                              ? 'border-accent-cyan bg-accent-cyan shadow-[0_0_8px_rgba(61,224,255,0.4)]'
                              : 'border-white/30'
                          }`}
                        />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-semibold text-white">Primary Residence</span>
                            <span className="rounded bg-accent-cyan/15 px-1 py-0.2 text-[8px] font-bold text-accent-cyan">DEFAULT</span>
                          </div>
                          <span className="text-[11px] text-white/55 truncate">Friedrichstraße 42 &middot; 10117 Berlin</span>
                        </div>
                      </div>

                      <div
                        onClick={() =>
                          handleSelectAddress(
                            2,
                            'Potsdamer Platz 1',
                            'Berlin',
                            '10785',
                            'DE'
                          )
                        }
                        className={`rounded-xl border p-3 cursor-pointer flex items-start gap-2.5 transition-all ${
                          selectedAddressId === 2
                            ? 'border-accent-cyan bg-accent-cyan/[0.07] ring-1 ring-accent-cyan/20'
                            : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.05]'
                        }`}
                      >
                        <div
                          className={`h-3.5 w-3.5 rounded-full border mt-0.5 shrink-0 transition-all ${
                            selectedAddressId === 2
                              ? 'border-accent-cyan bg-accent-cyan shadow-[0_0_8px_rgba(61,224,255,0.4)]'
                              : 'border-white/30'
                          }`}
                        />
                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-xs font-semibold text-white">Design Studio</span>
                          <span className="text-[11px] text-white/55 truncate">Potsdamer Platz 1 &middot; 10785 Berlin</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11.5px] font-semibold text-white/70">
                          Destination Country <span className="text-[#FB7185]">*</span>
                        </label>
                        <select
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          className="h-11 rounded-xl border border-white/12 bg-[#041430]/70 px-3.5 text-xs text-white focus:outline-none focus:border-accent-cyan"
                        >
                          <option value="DE">Germany (Deutschland)</option>
                          <option value="FR">France</option>
                          <option value="NL">Netherlands (Nederland)</option>
                          <option value="IT">Italy (Italia)</option>
                          <option value="ES">Spain (España)</option>
                          <option value="BE">Belgium (Belgique / België)</option>
                          <option value="AT">Austria (Österreich)</option>
                          <option value="SE">Sweden (Sverige)</option>
                          <option value="GB">United Kingdom</option>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11.5px] font-semibold text-white/70">
                          Street Address &amp; House Number <span className="text-[#FB7185]">*</span>
                        </label>
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="e.g. Friedrichstraße 42, Apt 4B"
                          className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan ${
                            errors.address ? 'border-[#FB7185]' : 'border-white/12'
                          }`}
                        />
                        {errors.address && (
                          <span className="text-[11px] text-[#FB7185]">{errors.address}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11.5px] font-semibold text-white/70">
                            City <span className="text-[#FB7185]">*</span>
                          </label>
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            placeholder="e.g. Berlin"
                            className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan ${
                              errors.city ? 'border-[#FB7185]' : 'border-white/12'
                            }`}
                          />
                          {errors.city && (
                            <span className="text-[11px] text-[#FB7185]">{errors.city}</span>
                          )}
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[11.5px] font-semibold text-white/70">
                            Postal Code <span className="text-[#FB7185]">*</span>
                          </label>
                          <input
                            type="text"
                            name="postcode"
                            value={formData.postcode}
                            onChange={handleInputChange}
                            placeholder="e.g. 10117"
                            className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan ${
                              errors.postcode ? 'border-[#FB7185]' : 'border-white/12'
                            }`}
                          />
                          {errors.postcode && (
                            <span className="text-[11px] text-[#FB7185]">{errors.postcode}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleContinueToDelivery}
                      className="mt-5 w-full h-11 rounded-xl bg-accent-cyan text-[#01132B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent-cyan/90 transition-all shadow-[0_4px_16px_rgba(61,224,255,0.22)]"
                    >
                      <span>Continue to Delivery Options</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </section>
                </div>
              ) : (
                /* Collapsed Step 1 Summary Card */
                <div
                  id="section-customer"
                  className="rounded-2xl border border-white/10 bg-[#0A2A54]/25 p-4 sm:p-4.5 flex justify-between items-center backdrop-blur-md transition-all hover:border-white/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10.5px] font-bold uppercase tracking-wider text-white/45">01 &middot; Contact &amp; Address</span>
                        <span className="text-xs font-bold text-white truncate">{formData.name}</span>
                      </div>
                      <p id="section-shipping" className="text-xs text-white/60 truncate mt-0.5">
                        {formData.address}, {formData.postcode} {formData.city}, {formData.country === 'DE' ? 'Germany' : formData.country} &middot; {formData.email}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="text-xs font-semibold text-accent-cyan hover:underline px-3 py-1 rounded-lg border border-accent-cyan/20 bg-accent-cyan/5 hover:bg-accent-cyan/10 shrink-0 ml-3"
                  >
                    Edit
                  </button>
                </div>
              )}

              {/* STEP 2: COURIER & DELIVERY SELECTION */}
              {activeStep === 2 ? (
                <section
                  id="section-delivery"
                  className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-5 sm:p-6 backdrop-blur-md transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="flex items-center gap-2 font-display text-base font-semibold text-white">
                      <Truck className="h-4 w-4 text-accent-cyan" />
                      <span>Delivery Options</span>
                    </h2>
                    <span className="rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-2 py-0.5 text-[9.5px] font-bold tracking-wider text-accent-cyan">
                      STEP 02
                    </span>
                  </div>

                  {/* Delivery Guidance Alert */}
                  <div className="rounded-xl border border-accent-cyan/20 bg-accent-cyan/[0.05] p-3 text-xs text-white/70 leading-relaxed mb-3.5">
                    {subtotal >= 150 ? (
                      <span>
                        <strong className="text-white">Complimentary Tracked Delivery Unlocked —</strong> Free Standard Delivery (2–4 business days, carbon neutral).
                      </span>
                    ) : (
                      <span>
                        Add <strong className="text-white">{formatPrice(150 - subtotal)}</strong> more for Free Standard Delivery — or select Express Next-Day Delivery.
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2.5">
                    {/* Standard */}
                    <label
                      className={`rounded-xl border p-3.5 cursor-pointer flex items-center gap-3 transition-all ${
                        formData.deliveryMethod === 'standard'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.05]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="standard"
                        checked={formData.deliveryMethod === 'standard'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div
                        className={`h-4 w-4 rounded-full border shrink-0 transition-all ${
                          formData.deliveryMethod === 'standard'
                            ? 'border-accent-cyan bg-accent-cyan shadow-[0_0_8px_rgba(61,224,255,0.4)]'
                            : 'border-white/30'
                        }`}
                      />
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[13.5px] font-semibold text-white">Standard Free Delivery</span>
                          <span className="text-xs font-bold text-[#34D399] font-mono">
                            {subtotal >= 150 ? 'FREE' : '€ 12.00'}
                          </span>
                        </div>
                        <p className="text-[11.5px] text-white/50 leading-tight">
                          2–4 business days via DHL Express Carbon Neutral tracked delivery.
                        </p>
                      </div>
                    </label>

                    {/* Express */}
                    <label
                      className={`rounded-xl border p-3.5 cursor-pointer flex items-center gap-3 transition-all ${
                        formData.deliveryMethod === 'overnight'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.05]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="overnight"
                        checked={formData.deliveryMethod === 'overnight'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div
                        className={`h-4 w-4 rounded-full border shrink-0 transition-all ${
                          formData.deliveryMethod === 'overnight'
                            ? 'border-accent-cyan bg-accent-cyan shadow-[0_0_8px_rgba(61,224,255,0.4)]'
                            : 'border-white/30'
                        }`}
                      />
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[13.5px] font-semibold text-white">Express Next-Day Delivery</span>
                          <span className="text-xs font-bold text-white font-mono">€ 18.00</span>
                        </div>
                        <p className="text-[11.5px] text-white/50 leading-tight">
                          Guaranteed next-business-day delivery before 12:00 PM.
                        </p>
                      </div>
                    </label>

                    {/* White Glove */}
                    <label
                      className={`rounded-xl border p-3.5 cursor-pointer flex items-center gap-3 transition-all ${
                        formData.deliveryMethod === 'whiteglove'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.025] hover:bg-white/[0.05]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value="whiteglove"
                        checked={formData.deliveryMethod === 'whiteglove'}
                        onChange={handleInputChange}
                        className="hidden"
                      />
                      <div
                        className={`h-4 w-4 rounded-full border shrink-0 transition-all ${
                          formData.deliveryMethod === 'whiteglove'
                            ? 'border-accent-cyan bg-accent-cyan shadow-[0_0_8px_rgba(61,224,255,0.4)]'
                            : 'border-white/30'
                        }`}
                      />
                      <div className="flex-1 flex flex-col gap-0.5">
                        <div className="flex justify-between items-baseline">
                          <span className="text-[13.5px] font-semibold text-white">White Glove Evening Concierge</span>
                          <span className="text-xs font-bold text-white font-mono">€ 35.00</span>
                        </div>
                        <p className="text-[11.5px] text-white/50 leading-tight">
                          Hand-delivered in protective garment bag, scheduled evening arrival.
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Luxury Add-ons */}
                  <div className="flex flex-col gap-2.5 mt-4">
                    <div
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isGiftWrapActive
                          ? 'border-accent-cyan/35 bg-accent-cyan/[0.03]'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <div
                        onClick={() => setIsGiftWrapActive(!isGiftWrapActive)}
                        className="p-3 flex justify-between items-center cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Gift className="h-4 w-4 text-accent-cyan shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white">Complimentary Gift Packaging</div>
                            <div className="text-[10.5px] text-white/45">Signature box, ribbon, and gift card</div>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-wider ${
                            isGiftWrapActive
                              ? 'border border-[#34D399] bg-[#34D399]/15 text-[#34D399]'
                              : 'border border-white/15 bg-white/[0.04] text-white/70'
                          }`}
                        >
                          {isGiftWrapActive ? '✓ INCLUDED' : '+ ADD'}
                        </span>
                      </div>

                      {isGiftWrapActive && (
                        <div className="p-3 pt-0 border-t border-white/10">
                          <textarea
                            name="giftMessage"
                            value={formData.giftMessage}
                            maxLength={180}
                            onChange={handleInputChange}
                            placeholder="Write a personal note for the gift card..."
                            className="w-full min-h-[60px] rounded-lg border border-white/12 bg-[#041430]/70 p-2.5 text-xs text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                      )}
                    </div>

                    <div
                      className={`rounded-xl border transition-all overflow-hidden ${
                        isDeliveryNoteActive
                          ? 'border-accent-cyan/35 bg-accent-cyan/[0.03]'
                          : 'border-white/10 bg-white/[0.02]'
                      }`}
                    >
                      <div
                        onClick={() => setIsDeliveryNoteActive(!isDeliveryNoteActive)}
                        className="p-3 flex justify-between items-center cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <FileText className="h-4 w-4 text-accent-cyan shrink-0" />
                          <div>
                            <div className="text-xs font-semibold text-white">Special Courier Instructions</div>
                            <div className="text-[10.5px] text-white/45">Gate codes or drop-off notes</div>
                          </div>
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[9.5px] font-bold tracking-wider ${
                            isDeliveryNoteActive
                              ? 'border border-[#34D399] bg-[#34D399]/15 text-[#34D399]'
                              : 'border border-white/15 bg-white/[0.04] text-white/70'
                          }`}
                        >
                          {isDeliveryNoteActive ? '✓ INCLUDED' : '+ ADD'}
                        </span>
                      </div>

                      {isDeliveryNoteActive && (
                        <div className="p-3 pt-0 border-t border-white/10">
                          <textarea
                            name="deliveryNotes"
                            value={formData.deliveryNotes}
                            onChange={handleInputChange}
                            placeholder="e.g. Leave with concierge on 4th floor..."
                            className="w-full min-h-[60px] rounded-lg border border-white/12 bg-[#041430]/70 p-2.5 text-xs text-white focus:outline-none focus:border-accent-cyan"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2.5 mt-5">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="h-11 px-4 rounded-xl border border-white/15 bg-white/[0.04] text-xs font-bold text-white hover:bg-white/[0.08] transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleContinueToPayment}
                      className="flex-1 h-11 rounded-xl bg-accent-cyan text-[#01132B] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-accent-cyan/90 transition-all shadow-[0_4px_16px_rgba(61,224,255,0.22)]"
                    >
                      <span>Continue to Payment</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </section>
              ) : activeStep > 2 ? (
                /* Collapsed Step 2 Summary Card */
                <div
                  id="section-delivery"
                  className="rounded-2xl border border-white/10 bg-[#0A2A54]/25 p-4 sm:p-4.5 flex justify-between items-center backdrop-blur-md transition-all hover:border-white/20"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="h-8 w-8 rounded-full bg-[#34D399]/15 border border-[#34D399]/30 flex items-center justify-center text-[#34D399] shrink-0">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10.5px] font-bold uppercase tracking-wider text-white/45 block">02 &middot; Delivery Method</span>
                      <p className="text-xs font-semibold text-white truncate mt-0.5">
                        {formData.deliveryMethod === 'standard' ? 'Standard Free Delivery (2–4 days)' : formData.deliveryMethod === 'overnight' ? 'Express Next-Day Delivery (€18.00)' : 'White Glove Evening Concierge (€35.00)'}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="text-xs font-semibold text-accent-cyan hover:underline px-3 py-1 rounded-lg border border-accent-cyan/20 bg-accent-cyan/5 hover:bg-accent-cyan/10 shrink-0 ml-3"
                  >
                    Edit
                  </button>
                </div>
              ) : (
                /* Inactive Step 2 Header */
                <div
                  id="section-delivery"
                  onClick={() => {
                    if (validateStep1()) goToStep(2);
                  }}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-4.5 flex justify-between items-center opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full border border-white/20 flex items-center justify-center text-white/50 text-[11px] font-bold shrink-0">
                      02
                    </div>
                    <span className="text-xs font-semibold text-white/70">Delivery Options</span>
                  </div>
                </div>
              )}

              {/* STEP 3: PAYMENT METHOD */}
              {activeStep === 3 ? (
                <section
                  id="section-payment"
                  className="rounded-2xl border border-white/10 bg-[#0A2A54]/35 p-5 sm:p-6 backdrop-blur-md transition-all"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="flex items-center gap-2 font-display text-base font-semibold text-white">
                      <ShieldCheck className="h-4 w-4 text-[#34D399]" />
                      <span>Payment Method</span>
                    </h2>
                    <span className="rounded-full border border-accent-cyan/20 bg-accent-cyan/10 px-2 py-0.5 text-[9.5px] font-bold tracking-wider text-accent-cyan">
                      STEP 03 &middot; 3D SECURE
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {/* Klarna */}
                    <div
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'klarna' }))}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${
                        formData.paymentMethod === 'klarna'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="rounded bg-[#FFB3C7] text-black text-[10px] font-bold px-1.5 py-0.5">Klarna.</span>
                        <div
                          className={`h-3.5 w-3.5 rounded-full border ${
                            formData.paymentMethod === 'klarna'
                              ? 'border-accent-cyan bg-accent-cyan'
                              : 'border-white/25'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-semibold text-white">Pay in 30 Days</div>
                      <div className="text-[10px] text-white/45">0% interest</div>
                    </div>

                    {/* Card */}
                    <div
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'card' }))}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${
                        formData.paymentMethod === 'card'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="rounded bg-[#0F2042] text-white text-[9.5px] font-bold px-1.5 py-0.5">CARD</span>
                        <div
                          className={`h-3.5 w-3.5 rounded-full border ${
                            formData.paymentMethod === 'card'
                              ? 'border-accent-cyan bg-accent-cyan'
                              : 'border-white/25'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-semibold text-white">Credit / Debit</div>
                      <div className="text-[10px] text-white/45">Visa, MC, Amex</div>
                    </div>

                    {/* Apple / Google Pay */}
                    <div
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'applepay' }))}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${
                        formData.paymentMethod === 'applepay'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="rounded bg-black border border-white/25 text-white text-[10px] font-bold px-1.5 py-0.5"> Pay</span>
                        <div
                          className={`h-3.5 w-3.5 rounded-full border ${
                            formData.paymentMethod === 'applepay'
                              ? 'border-accent-cyan bg-accent-cyan'
                              : 'border-white/25'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-semibold text-white">Apple / GPay</div>
                      <div className="text-[10px] text-white/45">1-tap checkout</div>
                    </div>

                    {/* PayPal */}
                    <div
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'paypal' }))}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${
                        formData.paymentMethod === 'paypal'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="rounded bg-[#003087] text-white text-[10px] font-bold px-1.5 py-0.5">PayPal</span>
                        <div
                          className={`h-3.5 w-3.5 rounded-full border ${
                            formData.paymentMethod === 'paypal'
                              ? 'border-accent-cyan bg-accent-cyan'
                              : 'border-white/25'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-semibold text-white">PayPal</div>
                      <div className="text-[10px] text-white/45">Buyer protection</div>
                    </div>

                    {/* iDEAL */}
                    <div
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'ideal' }))}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${
                        formData.paymentMethod === 'ideal'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="rounded bg-[#CC0066] text-white text-[10px] font-bold px-1.5 py-0.5">iDEAL</span>
                        <div
                          className={`h-3.5 w-3.5 rounded-full border ${
                            formData.paymentMethod === 'ideal'
                              ? 'border-accent-cyan bg-accent-cyan'
                              : 'border-white/25'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-semibold text-white">iDEAL</div>
                      <div className="text-[10px] text-white/45">Netherlands Bank</div>
                    </div>

                    {/* SEPA */}
                    <div
                      onClick={() => setFormData((p) => ({ ...p, paymentMethod: 'sepa' }))}
                      className={`rounded-xl border p-3 cursor-pointer transition-all ${
                        formData.paymentMethod === 'sepa'
                          ? 'border-accent-cyan bg-accent-cyan/[0.06] ring-1 ring-accent-cyan/20'
                          : 'border-white/10 bg-white/[0.02] hover:bg-white/[0.05]'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="rounded bg-[#003399] text-white text-[10px] font-bold px-1.5 py-0.5">SEPA</span>
                        <div
                          className={`h-3.5 w-3.5 rounded-full border ${
                            formData.paymentMethod === 'sepa'
                              ? 'border-accent-cyan bg-accent-cyan'
                              : 'border-white/25'
                          }`}
                        />
                      </div>
                      <div className="text-xs font-semibold text-white">Bank Transfer</div>
                      <div className="text-[10px] text-white/45">EU IBAN Debit</div>
                    </div>
                  </div>

                  {/* Card Details & 3D Holographic Card Stage */}
                  {formData.paymentMethod === 'card' && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <HolographicCardPreview
                        cardNumber={formData.cardNumber}
                        cardName={formData.cardName}
                        cardExpiry={formData.cardExpiry}
                        cardCvv={formData.cardCvv}
                        isFlipped={isCardFlipped}
                      />

                      <div className="flex flex-col gap-2.5 mt-3.5">
                        <div className="flex flex-col gap-1">
                          <div className="flex justify-between text-[11px] font-semibold text-white/70">
                            <span>Card Number <span className="text-[#FB7185]">*</span></span>
                            <span className="text-[9.5px] text-white/40 font-normal">16 digits &middot; Encrypted</span>
                          </div>
                          <input
                            type="text"
                            name="cardNumber"
                            id="card-number"
                            value={formData.cardNumber}
                            maxLength={19}
                            onChange={(e) =>
                              setFormData((p) => ({
                                ...p,
                                cardNumber: formatCardNumber(e.target.value),
                              }))
                            }
                            placeholder="•••• •••• •••• ••••"
                            className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm font-mono text-white focus:outline-none focus:border-accent-cyan ${
                              errors.cardNumber ? 'border-[#FB7185]' : 'border-white/12'
                            }`}
                          />
                          {errors.cardNumber && (
                            <span className="text-[11px] text-[#FB7185]">{errors.cardNumber}</span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="flex flex-col gap-1">
                            <label className="text-[11px] font-semibold text-white/70">
                              Expiry Date <span className="text-[#FB7185]">*</span>
                            </label>
                            <input
                              type="text"
                              name="cardExpiry"
                              id="card-expiry"
                              value={formData.cardExpiry}
                              maxLength={5}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  cardExpiry: formatCardExpiry(e.target.value),
                                }))
                              }
                              placeholder="MM/YY"
                              className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan ${
                                errors.cardExpiry ? 'border-[#FB7185]' : 'border-white/12'
                              }`}
                            />
                            {errors.cardExpiry && (
                              <span className="text-[11px] text-[#FB7185]">{errors.cardExpiry}</span>
                            )}
                          </div>

                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between text-[11px] font-semibold text-white/70">
                              <span>CVV <span className="text-[#FB7185]">*</span></span>
                              <span className="text-[9.5px] text-white/40 font-normal">3-4 digits</span>
                            </div>
                            <input
                              type="password"
                              name="cardCvv"
                              id="card-cvv"
                              value={formData.cardCvv}
                              maxLength={4}
                              onFocus={() => setIsCardFlipped(true)}
                              onBlur={() => setIsCardFlipped(false)}
                              onChange={(e) =>
                                setFormData((p) => ({
                                  ...p,
                                  cardCvv: e.target.value.replace(/\D/g, ''),
                                }))
                              }
                              placeholder="•••"
                              className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm font-mono text-white focus:outline-none focus:border-accent-cyan ${
                                errors.cardCvv ? 'border-[#FB7185]' : 'border-white/12'
                              }`}
                            />
                            {errors.cardCvv && (
                              <span className="text-[11px] text-[#FB7185]">{errors.cardCvv}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-white/70">
                            Cardholder Name <span className="text-[#FB7185]">*</span>
                          </label>
                          <input
                            type="text"
                            name="cardName"
                            id="card-name"
                            value={formData.cardName}
                            onChange={handleInputChange}
                            placeholder="Name as printed on card"
                            className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-sm text-white focus:outline-none focus:border-accent-cyan ${
                              errors.cardName ? 'border-[#FB7185]' : 'border-white/12'
                            }`}
                          />
                          {errors.cardName && (
                            <span className="text-[11px] text-[#FB7185]">{errors.cardName}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* iDEAL Details Panel */}
                  {formData.paymentMethod === 'ideal' && (
                    <div className="mt-3.5 pt-3.5 border-t border-white/10">
                      <label className="block text-[11px] font-semibold text-white/70 mb-1">
                        Select Your Dutch Bank:
                      </label>
                      <select
                        name="idealBank"
                        value={formData.idealBank}
                        onChange={handleInputChange}
                        className="w-full h-11 rounded-xl border border-white/12 bg-[#041430]/70 px-3.5 text-xs text-white focus:outline-none focus:border-accent-cyan"
                      >
                        <option value="ing">ING Bank</option>
                        <option value="rabobank">Rabobank</option>
                        <option value="abnamro">ABN AMRO</option>
                        <option value="bunq">bunq</option>
                        <option value="sns">SNS Bank</option>
                      </select>
                    </div>
                  )}

                  {/* SEPA Details Panel */}
                  {formData.paymentMethod === 'sepa' && (
                    <div className="mt-3.5 pt-3.5 border-t border-white/10 flex flex-col gap-2.5">
                      <div className="flex flex-col gap-1">
                        <label className="text-[11px] font-semibold text-white/70">
                          European IBAN <span className="text-[#FB7185]">*</span>
                        </label>
                        <input
                          type="text"
                          name="sepaIban"
                          value={formData.sepaIban}
                          onChange={handleInputChange}
                          placeholder="DE89 3704 0044 0532 0130 00"
                          className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-xs uppercase tracking-wider text-white focus:outline-none focus:border-accent-cyan ${
                            errors.sepaIban ? 'border-[#FB7185]' : 'border-white/12'
                          }`}
                        />
                        {errors.sepaIban && (
                          <span className="text-[11px] text-[#FB7185]">{errors.sepaIban}</span>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-2.5">
                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-white/70">
                            BIC / SWIFT <span className="text-[#FB7185]">*</span>
                          </label>
                          <input
                            type="text"
                            name="sepaBic"
                            value={formData.sepaBic}
                            onChange={handleInputChange}
                            placeholder="DEUTDEDDFXXX"
                            className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-xs uppercase text-white focus:outline-none focus:border-accent-cyan ${
                              errors.sepaBic ? 'border-[#FB7185]' : 'border-white/12'
                            }`}
                          />
                          {errors.sepaBic && (
                            <span className="text-[11px] text-[#FB7185]">{errors.sepaBic}</span>
                          )}
                        </div>

                        <div className="flex flex-col gap-1">
                          <label className="text-[11px] font-semibold text-white/70">
                            Account Holder <span className="text-[#FB7185]">*</span>
                          </label>
                          <input
                            type="text"
                            name="sepaHolder"
                            value={formData.sepaHolder}
                            onChange={handleInputChange}
                            placeholder="Full Name"
                            className={`h-11 rounded-xl border bg-[#041430]/70 px-3.5 text-xs text-white focus:outline-none focus:border-accent-cyan ${
                              errors.sepaHolder ? 'border-[#FB7185]' : 'border-white/12'
                            }`}
                          />
                          {errors.sepaHolder && (
                            <span className="text-[11px] text-[#FB7185]">{errors.sepaHolder}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Klarna Installments Breakdown */}
                  {formData.paymentMethod === 'klarna' && (
                    <div className="mt-3.5 rounded-xl border border-[#FFB3C7]/25 bg-[#FFB3C7]/[0.08] p-3 text-xs text-[#FFE4EC]">
                      <strong>Pay Later with Klarna:</strong> Try at home, settle in 30 days. No interest.
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="rounded-lg border border-[#FFB3C7]/20 bg-black/25 p-1.5 text-center">
                          <div className="text-[8.5px] uppercase text-[#FFE4EC]/75">Today</div>
                          <div className="text-xs font-bold text-white font-mono">{formatPrice(total / 3)}</div>
                        </div>
                        <div className="rounded-lg border border-[#FFB3C7]/20 bg-black/25 p-1.5 text-center">
                          <div className="text-[8.5px] uppercase text-[#FFE4EC]/75">30 Days</div>
                          <div className="text-xs font-bold text-white font-mono">{formatPrice(total / 3)}</div>
                        </div>
                        <div className="rounded-lg border border-[#FFB3C7]/20 bg-black/25 p-1.5 text-center">
                          <div className="text-[8.5px] uppercase text-[#FFE4EC]/75">60 Days</div>
                          <div className="text-xs font-bold text-white font-mono">{formatPrice(total / 3)}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </section>
              ) : (
                /* Inactive Step 3 Header */
                <div
                  id="section-payment"
                  onClick={() => {
                    if (validateStep1()) goToStep(3);
                  }}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4 sm:p-4.5 flex justify-between items-center opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full border border-white/20 flex items-center justify-center text-white/50 text-[11px] font-bold shrink-0">
                      03
                    </div>
                    <span className="text-xs font-semibold text-white/70">Payment &amp; Review</span>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: STICKY ORDER SUMMARY */}
            <OrderSummarySidebar
              items={items}
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              itemCount={itemCount}
              appliedCoupon={appliedCoupon}
              onApplyCoupon={applyCoupon}
              onRemoveCoupon={removeCoupon}
              onSubmitOrder={handlePlaceOrder}
              isProcessing={isProcessing}
              isGiftWrap={isGiftWrapActive}
            />
          </div>
        )}
      </main>

      {/* 3D Secure Payment Auth Modal */}
      <PaymentAuthModal
        isOpen={isAuthModalOpen}
        total={total}
        paymentMethod={formData.paymentMethod}
        isConfirmed={isOrderConfirmed}
      />
    </div>
  );
}
