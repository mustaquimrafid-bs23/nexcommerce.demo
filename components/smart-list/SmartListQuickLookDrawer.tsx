'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Check,
  ChevronRight,
  Heart,
  Truck,
  ShieldCheck,
  Shirt,
  Globe,
  Sparkles,
  Ruler,
} from 'lucide-react';
import { SmartListProduct } from '@/data/smartListProducts';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { Product } from '@/types/catalog';

interface SmartListQuickLookDrawerProps {
  product: SmartListProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export function SmartListQuickLookDrawer({
  product,
  isOpen,
  onClose,
}: SmartListQuickLookDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [selectedImg, setSelectedImg] = useState('');
  const [selectedFinishId, setSelectedFinishId] = useState('');
  const [selectedSizeName, setSelectedSizeName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (product) {
      setSelectedImg(product.image);
      const defaultFinish = product.variants?.finishes?.[0];
      setSelectedFinishId(defaultFinish?.id || '');
      const defaultSize =
        product.variants?.sizes?.find((s) => s.default && s.inStock)?.name ||
        product.variants?.sizes?.find((s) => s.inStock)?.name ||
        'Standard';
      setSelectedSizeName(defaultSize);
      setQuantity(1);
      setIsAdded(false);
    }
  }, [product]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!mounted) return null;
  if (!product) return null;

  const currentFinish = product.variants?.finishes?.find((f) => f.id === selectedFinishId);
  const effectivePrice = product.price + (currentFinish?.priceDelta || 0);
  const wishlisted = isWishlisted(product.id);

  const discountPercent =
    product.originalPrice && product.originalPrice > effectivePrice
      ? Math.round(((product.originalPrice - effectivePrice) / product.originalPrice) * 100)
      : null;

  const handleFinishSelect = (finish: NonNullable<typeof product.variants.finishes>[0]) => {
    setSelectedFinishId(finish.id);
    if (finish.img) {
      setSelectedImg(finish.img);
    }
  };

  const handleToggleWishlist = () => {
    const catalogProduct: Product = {
      id: product.id,
      name: product.name,
      brand: product.brand,
      category: typeof product.category === 'string' ? product.category.toLowerCase() : 'apparel',
      price: effectivePrice,
      formattedPrice: `€ ${effectivePrice.toFixed(2)}`,
      currency: 'EUR',
      description: product.materials || '',
      image: selectedImg || product.image,
      gallery: product.gallery,
      inStock: product.inStock,
      origin: product.origin,
    };
    toggleWishlist(catalogProduct);
  };

  const handleAddToCart = () => {
    if (!product.inStock) return;
    setIsAdding(true);

    addItem(
      {
        id: product.id,
        name: product.name,
        brand: product.brand,
        category: product.category,
        price: effectivePrice,
        formattedPrice: `€ ${effectivePrice.toFixed(2)}`,
        currency: 'EUR',
        description: product.materials,
        image: selectedImg || product.image,
        inStock: product.inStock,
      },
      selectedSizeName,
      currentFinish?.name,
      quantity
    );

    setTimeout(() => {
      setIsAdding(false);
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1800);
    }, 350);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          id="smartListQuickLookPortal"
          className="fixed inset-0 z-[9999] overflow-hidden"
          role="dialog"
          aria-modal="true"
          aria-label={`Quick look at ${product.name}`}
        >
          {/* Backdrop (Sapphire Deep Blur) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#02132d]/75 backdrop-blur-md transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-over Panel (nexCommerce Signature Rich Royal Sapphire Navy) */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen sm:max-w-[490px] max-w-full bg-gradient-to-b from-[#0e3266]/98 via-[#0a2652]/98 to-[#071d3f]/98 border-l border-[#3DE0FF]/30 backdrop-blur-2xl shadow-[-24px_0_70px_rgba(2,19,45,0.85)] flex flex-col justify-between h-full relative text-white"
              data-lenis-prevent
            >
              {/* 1. Header Bar */}
              <div className="px-6 py-4.5 border-b border-white/15 flex items-center justify-between bg-[#0c2f60]/90 backdrop-blur-md shrink-0">
                <div>
                  <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-accent-cyan block">
                    {product.brand} · {product.categoryLabel || product.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-medium text-white tracking-tight leading-snug mt-0.5">
                    {product.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-full bg-[#143d78] hover:bg-[#1a4f9a] border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-sm"
                  aria-label="Close product quick look"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* 2. Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 scrollbar-thin scrollbar-thumb-[#3DE0FF]/25">
                {/* Product Gallery Stage */}
                <div className="space-y-3">
                  <div className="relative w-full h-[270px] sm:h-[295px] rounded-2xl overflow-hidden bg-gradient-to-b from-[#113972]/85 via-[#0c2d5c]/95 to-[#071f44] border border-[#3DE0FF]/25 flex items-center justify-center p-6 shadow-[inset_0_2px_12px_rgba(0,0,0,0.35)] group">
                    <img
                      src={selectedImg || product.image}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow-[0_16px_32px_rgba(0,14,38,0.9)] transition-transform duration-300 group-hover:scale-105"
                    />

                    {/* Wishlist Heart Button */}
                    <button
                      type="button"
                      onClick={handleToggleWishlist}
                      className={`absolute top-3.5 right-3.5 p-2.5 rounded-full border backdrop-blur-md transition-all cursor-pointer z-10 ${
                        wishlisted
                          ? 'bg-[#E60C45] border-[#E60C45] text-white shadow-lg shadow-[#E60C45]/40 scale-105'
                          : 'bg-[#0a2854]/90 border-white/25 text-white hover:text-white hover:border-[#3DE0FF]/50 hover:bg-[#123b78]'
                      }`}
                      aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                      title={wishlisted ? 'In Wishlist' : 'Add to Wishlist'}
                    >
                      <Heart
                        className="w-4 h-4 transition-transform"
                        fill={wishlisted ? 'currentColor' : 'none'}
                      />
                    </button>

                    {/* Curated Reason Badge */}
                    {product.reason && (
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-[#082248]/90 backdrop-blur-md border border-[#3DE0FF]/30 text-[10px] text-white font-medium flex items-center gap-1.5 shadow-sm">
                        <Sparkles className="w-3 h-3 text-accent-cyan" />
                        <span>{product.reason}</span>
                      </div>
                    )}
                  </div>

                  {/* Thumbnail Filmstrip */}
                  {product.gallery && product.gallery.length > 1 && (
                    <div className="flex items-center gap-2.5 pt-1 overflow-x-auto pb-1 scrollbar-none">
                      {product.gallery.map((imgUrl, idx) => {
                        const isSelected = selectedImg === imgUrl || (!selectedImg && idx === 0);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedImg(imgUrl)}
                            className={`relative w-14 h-14 rounded-xl overflow-hidden border p-1 bg-[#0a2854]/80 shrink-0 cursor-pointer transition-all ${
                              isSelected
                                ? 'border-accent-cyan ring-2 ring-accent-cyan/50 scale-105 shadow-[0_0_12px_rgba(61,224,255,0.4)] bg-[#123b78]'
                                : 'border-white/20 opacity-75 hover:opacity-100 hover:border-white/40 hover:bg-[#123b78]/70'
                            }`}
                            aria-label={`View photo angle ${idx + 1}`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Angle ${idx + 1}`}
                              className="w-full h-full object-contain"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price Row & Stock Status */}
                <div className="space-y-2.5 pb-4 border-b border-white/15">
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-2.5">
                      <span className="text-2xl font-bold text-white tabular-nums tracking-tight">
                        € {effectivePrice.toFixed(2)}
                      </span>
                      {product.originalPrice && product.originalPrice > effectivePrice && (
                        <span className="text-sm text-white/50 line-through tabular-nums">
                          € {product.originalPrice.toFixed(2)}
                        </span>
                      )}
                      {discountPercent !== null && discountPercent > 0 && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent-cyan/20 border border-accent-cyan/40 text-accent-cyan tracking-wider">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>

                    {product.inStock ? (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase flex items-center gap-1.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        In Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-rose-500/20 border border-rose-500/40 text-rose-300">
                        Out of Stock
                      </span>
                    )}
                  </div>

                  {/* Reassurance Trust Row */}
                  <div className="flex items-center gap-3 py-2 px-3 rounded-xl bg-[#0c2f60]/70 border border-[#3DE0FF]/20 text-[11px] text-white/90 shadow-sm">
                    <span className="flex items-center gap-1.5 text-emerald-300 font-medium">
                      <Truck className="w-3.5 h-3.5" />
                      <span>Free express delivery</span>
                    </span>
                    <span className="text-white/30">|</span>
                    <span className="flex items-center gap-1.5 text-white/80">
                      <ShieldCheck className="w-3.5 h-3.5 text-accent-cyan" />
                      <span>100% genuine guarantee</span>
                    </span>
                  </div>
                </div>

                {/* Finishes Swatches */}
                {product.variants?.finishes && product.variants.finishes.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold tracking-wider uppercase text-white/70 text-[11px]">
                        Finish / Color
                      </span>
                      <span className="text-white font-medium text-xs">
                        {currentFinish?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      {product.variants.finishes.map((finish) => {
                        const isSelected = finish.id === selectedFinishId;
                        return (
                          <button
                            key={finish.id}
                            type="button"
                            onClick={() => handleFinishSelect(finish)}
                            className={`w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-[#0a2652] scale-110 shadow-[0_0_12px_rgba(61,224,255,0.5)]'
                                : 'opacity-75 hover:opacity-100 hover:scale-105'
                            }`}
                            style={{
                              backgroundColor: finish.color,
                              border: '1.5px solid rgba(255,255,255,0.3)',
                            }}
                            title={finish.name}
                            aria-label={finish.name}
                          >
                            {isSelected && (
                              <Check
                                className={`w-3 h-3 ${
                                  finish.color === '#F8F6F0' || finish.color === '#F1F5F9'
                                    ? 'text-black'
                                    : 'text-white'
                                }`}
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selector */}
                {product.variants?.sizes && product.variants.sizes.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold tracking-wider uppercase text-white/70 text-[11px]">
                        Size
                      </span>
                      <div className="flex items-center gap-3">
                        <span className="text-white font-medium text-xs">
                          {selectedSizeName}
                        </span>
                        <span className="text-[11px] text-accent-cyan hover:text-white cursor-pointer flex items-center gap-1 transition-colors">
                          <Ruler className="w-3 h-3" />
                          <span>Size Guide</span>
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                      {product.variants.sizes.map((size) => {
                        const isSelected = size.name === selectedSizeName;
                        return (
                          <button
                            key={size.id}
                            type="button"
                            disabled={!size.inStock}
                            onClick={() => setSelectedSizeName(size.name)}
                            className={`py-2 rounded-xl text-xs font-semibold tracking-wider uppercase transition-all cursor-pointer border ${
                              isSelected
                                ? 'bg-white text-[#071d3f] border-white shadow-md font-bold'
                                : size.inStock
                                ? 'bg-[#0d346b]/80 text-white border border-white/20 hover:border-accent-cyan/50 hover:bg-[#15468e]'
                                : 'bg-transparent text-white/25 border-white/10 cursor-not-allowed line-through'
                            }`}
                          >
                            {size.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Specifications & Craft (Signature Navy Editorial Card) */}
                <div className="space-y-2.5 pt-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-white/70 block">
                    Specifications &amp; Craft
                  </span>
                  <div className="rounded-xl bg-[#082248]/85 border border-[#1a4785] divide-y divide-[#173e75]/60 overflow-hidden shadow-sm">
                    {product.materials && (
                      <div className="p-3 sm:p-3.5 flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-[#133d78] text-accent-cyan shrink-0 mt-0.5 border border-[#3DE0FF]/30">
                          <Shirt className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60 block">
                            Material &amp; Craft
                          </span>
                          <span className="text-xs text-white font-medium leading-relaxed block">
                            {product.materials}
                          </span>
                        </div>
                      </div>
                    )}
                    {product.origin && (
                      <div className="p-3 sm:p-3.5 flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-[#133d78] text-accent-cyan shrink-0 mt-0.5 border border-[#3DE0FF]/30">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60 block">
                            Tailored Origin
                          </span>
                          <span className="text-xs text-white font-medium leading-relaxed block">
                            {product.origin}
                          </span>
                        </div>
                      </div>
                    )}
                    {product.care && (
                      <div className="p-3 sm:p-3.5 flex items-start gap-3">
                        <div className="p-1.5 rounded-lg bg-[#133d78] text-accent-cyan shrink-0 mt-0.5 border border-[#3DE0FF]/30">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div className="space-y-0.5">
                          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/60 block">
                            Care Instructions
                          </span>
                          <span className="text-xs text-white font-medium leading-relaxed block">
                            {product.care}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 3. Footer Sticky Action Dock */}
              <div className="px-6 py-4 border-t border-[#1a4785] bg-[#071d3f]/98 backdrop-blur-xl space-y-2.5 shrink-0 shadow-lg">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-xl bg-[#0c2f60] border border-white/20 px-2 py-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/[0.1] rounded-lg transition-colors cursor-pointer text-sm font-semibold"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-7 text-center text-xs font-bold text-white tabular-nums">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/[0.1] rounded-lg transition-colors cursor-pointer text-sm font-semibold"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Bag CTA */}
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    disabled={!product.inStock || isAdding}
                    className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer active:scale-[0.98] ${
                      isAdded
                        ? 'bg-emerald-500 text-[#071d3f] font-bold shadow-emerald-500/25'
                        : product.inStock
                        ? 'bg-white hover:bg-neutral-100 text-[#071d3f] shadow-white/15'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Bag ✓</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • € {(effectivePrice * quantity).toFixed(2)}</span>
                      </>
                    )}
                  </button>
                </div>

                {/* View Full Product Details Link */}
                <Link
                  href={`/product/${product.id}`}
                  onClick={onClose}
                  className="w-full py-2 rounded-lg bg-[#0c2f60]/70 hover:bg-[#123e7a] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/20 group shadow-sm"
                >
                  <span>View Full Product Details</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform text-accent-cyan" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
