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
  Minus,
  Plus,
  CheckCircle2,
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
import { ComparisonModal } from '@/components/product/ComparisonModal';

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
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('details');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const { openConcierge, sendMessage } = useConciergeStore();

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

  const handleColorSelect = (colorName: string, colorImg?: string) => {
    setSelectedColor(colorName);
    if (colorImg) {
      setActiveImage(colorImg);
    }
  };

  const handleAddToCart = () => {
    addItem(product, selectedSize || 'One Size', selectedColor || 'Standard', quantity);
    setToastMessage(`Added ${quantity} × ${product.name} to your bag`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAskStylist = () => {
    openConcierge();
    sendMessage(
      `How would you style the ${product.name} (${product.category})? What matching pieces or occasions suit this best?`
    );
  };

  const handleTriggerCompare = () => {
    setIsCompareOpen(true);
  };

  const toggleAccordionSection = (section: string) => {
    setOpenAccordion(openAccordion === section ? '' : section);
  };

  return (
    <div
      className="min-h-screen text-white pb-24 pt-6"
      style={{ background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)' }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-surface-navy border border-accent-cyan/40 text-white text-xs shadow-2xl backdrop-blur-xl flex items-center gap-2">
          <CheckCircle2 size={14} className="text-accent-cyan" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sizing & Fit Modal */}
      <AIFitModal
        isOpen={isFitModalOpen}
        onClose={() => setIsFitModalOpen(false)}
        onSelectSize={(size) => setSelectedSize(size)}
        availableSizes={product.sizes}
      />

      {/* Side-by-Side Comparison Modal */}
      <ComparisonModal
        isOpen={isCompareOpen}
        productA={product}
        productB={MASTER_PRODUCTS.find((p) => p.id !== product.id) || MASTER_PRODUCTS[1]}
        onClose={() => setIsCompareOpen(false)}
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
                    <span className="text-white/40">({(product as any).reviews || 24} reviews)</span>
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
                  All prices incl. 19% statutory VAT &middot; Duties included &middot; Free express UK delivery
                </span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light">
              {product.description ||
                'Meticulously proportioned with architectural restraint. Constructed in small batch production across our European master ateliers.'}
            </p>

            {/* Specification Badges Grid */}
            <SpecBadgesGrid category={product.category} />

            {/* Finish / Swatch Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 pt-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Selected Colour:</span>
                  <span className="font-semibold text-white">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleColorSelect(c.name, c.img)}
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

            {/* Size Selection & Fit Assistant Trigger */}
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

                <div className="flex flex-wrap gap-2.5">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                        selectedSize === s
                          ? 'bg-accent-pink text-white border-accent-pink shadow-lg shadow-accent-pink/20'
                          : 'bg-obsidian-950/70 text-white/80 border-white/10 hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector & Add to Bag CTA */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-white/15 rounded-2xl bg-obsidian-950/70 p-1">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={13} />
                  </button>
                  <span className="w-8 text-center text-xs font-mono font-bold text-white">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white transition-colors cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={13} />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl shadow-accent-crimson/25 hover:scale-[1.02]"
                >
                  <ShoppingBag size={14} />
                  <span>Add to Bag</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleAskStylist}
                  className="py-2.5 px-3 rounded-xl bg-obsidian-950/60 border border-white/10 hover:border-accent-cyan/40 text-xs text-white/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <MessageSquare size={13} className="text-accent-cyan" />
                  <span>Ask Style Advisor</span>
                </button>

                <button
                  type="button"
                  onClick={handleTriggerCompare}
                  className="py-2.5 px-3 rounded-xl bg-obsidian-950/60 border border-white/10 hover:border-accent-pink/40 text-xs text-white/80 flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Scale size={13} className="text-accent-pink" />
                  <span>Compare Piece</span>
                </button>
              </div>
            </div>

            {/* Delivery & Trust Highlights */}
            <div className="p-4 rounded-2xl bg-surface-card/60 border border-white/10 space-y-2.5 text-xs text-white/70">
              <div className="flex items-center gap-2.5">
                <Truck size={14} className="text-accent-cyan shrink-0" />
                <span>Complimentary Express UK &amp; European Delivery</span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={14} className="text-accent-pink shrink-0" />
                <span>14-Day Right to Cancel &amp; Free Returns</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                <span>Bespoke Care &amp; Craftsmanship Guarantee</span>
              </div>
            </div>

            {/* Accordion Panels */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              {/* Accordion 1: Details */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-obsidian-950/40">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('details')}
                  className="w-full p-4 flex items-center justify-between text-xs font-semibold text-white/90 text-left cursor-pointer"
                >
                  <span>Garment Details &amp; Composition</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openAccordion === 'details' ? 'rotate-180 text-accent-cyan' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'details' && (
                  <div className="px-4 pb-4 text-xs text-white/60 space-y-2 font-light leading-relaxed border-t border-white/5 pt-3">
                    <p>
                      Crafted from fine Mongolian cashmere offering natural thermal regulation with an ultra-soft handle. Finished with Italian horn buttons and hand-rolled silk trims.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-white/70">
                      <li>Material: 100% Mongolian Cashmere</li>
                      <li>Fit: Modern relaxed tailored cut</li>
                      <li>Origin: Crafted in Northern Europe</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Accordion 2: Sizing & Fit */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-obsidian-950/40">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('sizing')}
                  className="w-full p-4 flex items-center justify-between text-xs font-semibold text-white/90 text-left cursor-pointer"
                >
                  <span>Sizing, Fit &amp; Tailoring</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openAccordion === 'sizing' ? 'rotate-180 text-accent-pink' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'sizing' && (
                  <div className="px-4 pb-4 text-xs text-white/60 space-y-2 font-light leading-relaxed border-t border-white/5 pt-3">
                    <p>
                      Designed to fit true to European size. For an oversized look, choose one size up. Refer to our interactive size guide for chest and shoulder measurements.
                    </p>
                  </div>
                )}
              </div>

              {/* Accordion 3: Care Instructions */}
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-obsidian-950/40">
                <button
                  type="button"
                  onClick={() => toggleAccordionSection('care')}
                  className="w-full p-4 flex items-center justify-between text-xs font-semibold text-white/90 text-left cursor-pointer"
                >
                  <span>Care Instructions &amp; Provenance</span>
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      openAccordion === 'care' ? 'rotate-180 text-accent-cyan' : ''
                    }`}
                  />
                </button>
                {openAccordion === 'care' && (
                  <div className="px-4 pb-4 text-xs text-white/60 space-y-2 font-light leading-relaxed border-t border-white/5 pt-3">
                    <p>
                      Specialist dry clean only or gentle hand wash in cold water using neutral wool detergent. Dry flat away from direct sunlight.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Complete the Look Bundle */}
        <CompleteLookBundle currentProduct={product} />
      </div>
    </div>
  );
}
