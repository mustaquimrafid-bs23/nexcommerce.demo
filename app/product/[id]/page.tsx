'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ShoppingBag,
  Heart,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Star,
  Check,
} from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { ProductCard } from '@/components/product/ProductCard';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { id } = use(params);
  const product = MASTER_PRODUCTS.find((p) => p.id === id);

  if (!product) {
    notFound();
  }

  const [selectedSize, setSelectedSize] = useState<string>(
    product.sizes ? product.sizes[0] : ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors ? product.colors[0].name : ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product.image);
  const [openAccordion, setOpenAccordion] = useState<string>('details');
  const [mounted, setMounted] = useState<boolean>(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
    setActiveImage(product.image);
    if (product.sizes && product.sizes.length > 0) setSelectedSize(product.sizes[0]);
    if (product.colors && product.colors.length > 0) setSelectedColor(product.colors[0].name);
  }, [product]);

  const wishlisted = mounted ? isWishlisted(product.id) : false;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize, selectedColor);
    }
  };

  const relatedProducts = MASTER_PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category
  ).slice(0, 3);

  const galleryImages = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  return (
    <div className="min-h-screen pb-24 bg-obsidian-900">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center gap-2 text-xs text-white/50">
          <Link href="/" className="hover:text-white transition-colors">
            Maison
          </Link>
          <ChevronRight size={12} />
          <Link href="/category" className="hover:text-white transition-colors">
            Collections
          </Link>
          <ChevronRight size={12} />
          <span className="capitalize">{product.category}</span>
          <ChevronRight size={12} />
          <span className="text-white truncate">{product.name}</span>
        </div>
      </div>

      {/* Main PDP Grid (60/40 Visual Split) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Visual Gallery (60% ~ 7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Hero Main Image Stage */}
            <div className="relative aspect-[4/5] bg-surface-navy/40 rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-6 sm:p-10 flex items-center justify-center">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain drop-shadow-2xl transition-all duration-300"
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
                className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur-md border transition-all ${
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
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border p-1 bg-surface-navy/50 transition-all flex-shrink-0 ${
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
                    <Star size={14} fill="currentColor" />
                    <span>{product.rating.toFixed(1)}</span>
                    <span className="text-white/40">(Verified Client Reviews)</span>
                  </div>
                )}
              </div>

              <h1 className="font-editorial text-3xl sm:text-4xl text-white font-normal leading-tight">
                {product.name}
              </h1>

              <div className="text-2xl font-semibold text-white mt-3">
                {formatPrice(product.price, product.currency)}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              {product.description}
            </p>

            {/* Finish / Color Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Finish / Palette:</span>
                  <span className="text-white font-medium">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-3">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === c.name
                          ? 'border-accent-pink ring-2 ring-accent-pink/40 scale-110'
                          : 'border-white/20 hover:border-white/50'
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

            {/* Anatomical Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/60">Select Size:</span>
                  <span className="text-accent-pink cursor-pointer hover:underline">
                    Size &amp; Fit Guide
                  </span>
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all border ${
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
            <div className="space-y-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl bg-surface-navy/70 border border-white/15 p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="w-9 text-center text-sm font-semibold text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 px-6 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white font-semibold text-xs uppercase tracking-widest transition-all shadow-xl shadow-accent-crimson/30 hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={16} />
                  <span>Add to Shopping Bag</span>
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
                  className="w-full py-3 flex items-center justify-between text-white font-medium text-left"
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
                  <div className="pb-4 text-white/70 space-y-2 leading-relaxed">
                    <p>
                      Meticulously crafted from selected sustainably sourced fibers. Hand-finished
                      in northern Italy following generations of tailoring tradition.
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-white/60">
                      <li>100% Premium Grade Selection</li>
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
                  className="w-full py-3 flex items-center justify-between text-white font-medium text-left"
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
                  <div className="pb-4 text-white/70 space-y-2 leading-relaxed">
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

        {/* Related Creations */}
        {relatedProducts.length > 0 && (
          <div className="mt-24 pt-12 border-t border-white/10 space-y-8">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
                Coordinated Styling
              </span>
              <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Complete the Look
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
