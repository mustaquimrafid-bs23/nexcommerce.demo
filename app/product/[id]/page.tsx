'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  ChevronDown,
  ArrowLeft,
  Check,
  Sparkles,
  Scale,
  MessageSquare,
} from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useConciergeStore } from '@/store/useConciergeStore';
import { PerspectiveSwitcher, PerspectiveMode } from '@/components/product/PerspectiveSwitcher';
import { AIFitModal } from '@/components/product/AIFitModal';
import { CompleteLookBundle } from '@/components/product/CompleteLookBundle';
import { MobileStickyBar } from '@/components/product/MobileStickyBar';
import { SpecBadgesGrid } from '@/components/product/SpecBadgesGrid';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const product = MASTER_PRODUCTS.find((p) => p.id === productId) || MASTER_PRODUCTS[0];

  const [selectedColor, setSelectedColor] = useState(
    product.colors && product.colors.length > 0 ? product.colors[0].name : ''
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes && product.sizes.length > 0 ? product.sizes[0] : ''
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(product.image);
  const [perspectiveMode, setPerspectiveMode] = useState<PerspectiveMode>('silhouette');
  const [isFitModalOpen, setIsFitModalOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('details');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { openConcierge } = useConciergeStore();

  const wishlisted = isWishlisted(product.id);

  // Gallery angles
  const galleryImages = [
    product.image,
    ...(product.gallery || []),
  ].filter(Boolean);

  const handlePerspectiveChange = (mode: PerspectiveMode) => {
    setPerspectiveMode(mode);
    if (mode === 'model' && galleryImages.length > 1) {
      setActiveImage(galleryImages[1]);
    } else if (mode === 'macro' && galleryImages.length > 2) {
      setActiveImage(galleryImages[2]);
    } else {
      setActiveImage(product.image);
    }
  };

  const handleAddToCart = () => {
    addItem(product, selectedSize || 'One Size', quantity);
    setToastMessage(`Added ${quantity} × ${product.name} to your bag`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAskStylist = () => {
    openConcierge(
      `How would you style the ${product.name} (${product.category})? What matching pieces or occasions suit this best?`
    );
  };

  const handleTriggerCompare = () => {
    setToastMessage(`Product comparison with ${product.name} staged.`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-24 pt-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-surface-navy border border-accent-cyan/40 text-white text-xs shadow-2xl backdrop-blur-xl">
          {toastMessage}
        </div>
      )}

      {/* Sizing & Fit Smart Assistant Modal */}
      <AIFitModal
        isOpen={isFitModalOpen}
        onClose={() => setIsFitModalOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
        availableSizes={product.sizes}
      />

      {/* Mobile Sticky Purchase Bar */}
      <MobileStickyBar
        price={product.price}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
        onAddToCart={handleAddToCart}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/category"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Collections</span>
          </Link>
          <div className="text-xs text-white/40 font-mono">
            {product.category} &middot; SKU: {product.id}
          </div>
        </div>

        {/* 60/40 Visual vs Purchase Hero Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          {/* Left Column: Visual Gallery & 3-Perspective Switcher (60% ~ 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Perspective Switcher Controls */}
            <div className="flex justify-center sm:justify-start">
              <PerspectiveSwitcher
                activeMode={perspectiveMode}
                onChange={handlePerspectiveChange}
              />
            </div>

            {/* Main Stage Image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-obsidian-950/80 border border-white/10 p-8 flex items-center justify-center shadow-2xl">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-2xl transition-all duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                  <ShoppingBag size={64} />
                </div>
              )}

              {product.tag && (
                <span className="absolute top-6 left-6 text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full bg-obsidian-950/85 backdrop-blur-md text-accent-pink border border-white/10 shadow-lg">
                  {product.tag}
                </span>
              )}

              <button
                onClick={() => toggleWishlist(product)}
                className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md border transition-all cursor-pointer ${
                  wishlisted
                    ? 'bg-accent-pink border-accent-pink text-white'
                    : 'bg-obsidian-950/70 border-white/10 text-white/70 hover:text-white'
                }`}
                aria-label="Save to wishlist"
              >
                <Heart size={18} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Gallery Filmstrip Dock */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border p-1 bg-surface-navy/50 transition-all flex-shrink-0 cursor-pointer ${
                      activeImage === img
                        ? 'border-accent-pink ring-2 ring-accent-pink/30'
                        : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`Angle ${idx + 1}`}
                      className="w-full h-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Sticky Purchase Details (40% ~ 5 cols) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24 self-start">
            <div>
              <div className="flex items-center justify-between gap-4 mb-2">
                <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan">
                  {product.category}
                </span>
                {product.rating && (
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                    <Star size={13} fill="currentColor" />
                    <span>{product.rating}</span>
                    <span className="text-white/40">({product.reviews || 24})</span>
                  </div>
                )}
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal leading-tight">
                {product.name}
              </h1>

              {/* Price & Statutory VAT Notice */}
              <div className="flex items-baseline gap-3 mt-2">
                <span className="font-mono text-2xl sm:text-3xl font-bold text-white">
                  &euro;{product.price.toFixed(2)}
                </span>
                <span className="text-xs text-white/50 font-light">
                  All prices incl. 19% statutory VAT &middot; Duties included
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              {product.description ||
                'Meticulously proportioned with architectural restraint. Constructed in small batch production across our Northern European master ateliers.'}
            </p>

            {/* Artisanal Specification Badges Grid */}
            <SpecBadgesGrid category={product.category} />

            {/* Finish / Swatch Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Selected Finish:</span>
                  <span className="font-semibold text-white">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-8 h-8 rounded-full border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-accent-pink ring-2 ring-accent-pink/40 scale-110'
                          : 'border-white/20 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {selectedColor === c.name && (
                        <Check
                          size={12}
                          className="absolute inset-0 m-auto text-white drop-shadow"
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Anatomical Size Selection & Fit Assistant Trigger */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Select Size:</span>
                  <div className="flex items-center gap-3">
                    <button
                      id="btnPdpFitAssistant"
                      type="button"
                      onClick={() => setIsFitModalOpen(true)}
                      className="text-accent-cyan hover:underline flex items-center gap-1 cursor-pointer font-medium"
                    >
                      <Sparkles size={11} />
                      <span>Find My Size</span>
                    </button>
                    <Link href="/size-guide" className="text-accent-pink hover:underline font-medium">
                      Size &amp; Fit Guide
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border cursor-pointer ${
                        selectedSize === s
                          ? 'bg-white text-obsidian-950 border-white shadow-md'
                          : 'bg-surface-navy/50 text-white/80 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity and Primary Add to Bag Action */}
            <div className="space-y-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl bg-surface-navy/70 border border-white/15 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-crimson/30 hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Shopping Bag</span>
                </button>
              </div>

              {/* Side-by-Side Compare & Ask Stylist Actions */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <button
                  id="pdpCompareBtn"
                  type="button"
                  onClick={handleTriggerCompare}
                  className="py-2.5 px-3 rounded-xl bg-surface-card border border-white/10 hover:border-accent-cyan text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Scale size={13} className="text-accent-cyan" />
                  <span>Compare Piece</span>
                </button>

                <button
                  id="btnPdpAskStylist"
                  type="button"
                  onClick={handleAskStylist}
                  className="btn-pdp-concierge-trigger py-2.5 px-3 rounded-xl bg-surface-card border border-white/10 hover:border-accent-pink text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare size={13} className="text-accent-pink" />
                  <span>Ask Stylist</span>
                </button>
              </div>
            </div>

            {/* White Glove Guarantees */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 text-center text-[11px] text-white/60">
              <div className="p-3 rounded-xl bg-surface-navy/30 border border-white/5 space-y-1">
                <Truck size={16} className="mx-auto text-accent-cyan" />
                <span className="block font-medium text-white/90">Express Delivery</span>
                <span className="text-[10px]">Complimentary &gt; €150</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-navy/30 border border-white/5 space-y-1">
                <RotateCcw size={16} className="mx-auto text-accent-pink" />
                <span className="block font-medium text-white/90">14-Day Returns</span>
                <span className="text-[10px]">Pre-paid label</span>
              </div>
              <div className="p-3 rounded-xl bg-surface-navy/30 border border-white/5 space-y-1">
                <ShieldCheck size={16} className="mx-auto text-emerald-400" />
                <span className="block font-medium text-white/90">Authentic</span>
                <span className="text-[10px]">100% Certified</span>
              </div>
            </div>

            {/* Accordion Specifications */}
            <div className="border-t border-white/10 pt-4 divide-y divide-white/10 text-xs">
              <div>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'details' ? '' : 'details')
                  }
                  className="w-full py-3 flex items-center justify-between text-white font-medium text-left cursor-pointer"
                >
                  <span>Composition &amp; Artisanal Craft</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      openAccordion === 'details' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="pb-4 text-white/70 space-y-2 leading-relaxed font-light">
                    <p>
                      Meticulously crafted from selected sustainably sourced fibers. Hand-finished
                      in northern Italy following generations of tailoring tradition.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-white/60">
                      <li>100% Premium Noble Selection</li>
                      <li>Double-reinforced structural seams</li>
                      <li>Dry clean only / Specialist care</li>
                    </ul>
                  </div>
                )}
              </div>

              <div>
                <button
                  onClick={() =>
                    setOpenAccordion(openAccordion === 'shipping' ? '' : 'shipping')
                  }
                  className="w-full py-3 flex items-center justify-between text-white font-medium text-left cursor-pointer"
                >
                  <span>White-Glove Shipping &amp; Returns</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      openAccordion === 'shipping' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <div className="pb-4 text-white/70 space-y-2 leading-relaxed font-light">
                    <p>
                      All creations arrive in our signature gift presentation box with reusable
                      dust bags and bespoke hanger.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look 3-Piece Bundle Checkout */}
        <CompleteLookBundle currentProduct={product} />
      </div>
    </div>
  );
}
