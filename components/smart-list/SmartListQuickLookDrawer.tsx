'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, ShoppingBag, Check, ChevronRight } from 'lucide-react';
import { SmartListProduct } from '@/data/smartListProducts';
import { useCartStore } from '@/store/useCartStore';

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
  const [selectedImg, setSelectedImg] = useState('');
  const [selectedFinishId, setSelectedFinishId] = useState('');
  const [selectedSizeName, setSelectedSizeName] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

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

  if (!product) return null;

  const currentFinish = product.variants?.finishes?.find((f) => f.id === selectedFinishId);
  const effectivePrice = product.price + (currentFinish?.priceDelta || 0);

  const handleFinishSelect = (finish: typeof product.variants.finishes[0]) => {
    setSelectedFinishId(finish.id);
    if (finish.img) {
      setSelectedImg(finish.img);
    }
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

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            aria-hidden="true"
          />

          {/* Slide-over Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-obsidian-950/98 border-l border-white/15 backdrop-blur-2xl shadow-2xl flex flex-col justify-between"
              data-lenis-prevent
            >
              {/* Header */}
              <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-[0.16em] uppercase text-accent-cyan block">
                    {product.brand} · {product.categoryLabel}
                  </span>
                  <h2 className="text-lg font-semibold text-white tracking-tight">
                    {product.name}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-full text-white/50 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                  aria-label="Close product quick look"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin scrollbar-thumb-white/15">
                {/* Product Gallery Stage */}
                <div className="space-y-3">
                  <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.06)_0%,transparent_75%)] border border-white/10 flex items-center justify-center p-6">
                    <img
                      src={selectedImg || product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-all duration-300"
                    />
                  </div>

                  {/* Thumbnail Filmstrip */}
                  {product.gallery && product.gallery.length > 1 && (
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {product.gallery.map((imgUrl, idx) => {
                        const isSelected = selectedImg === imgUrl || (!selectedImg && idx === 0);
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSelectedImg(imgUrl)}
                            className={`relative w-14 h-16 rounded-lg overflow-hidden border transition-all flex-shrink-0 cursor-pointer ${
                              isSelected
                                ? 'border-accent-cyan ring-1 ring-accent-cyan shadow-[0_0_10px_rgba(61,224,255,0.4)]'
                                : 'border-white/15 opacity-60 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={imgUrl}
                              alt={`Angle ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Price Row */}
                <div className="flex items-baseline gap-3 pb-4 border-b border-white/10">
                  <span className="text-2xl font-bold text-white tabular-nums tracking-tight">
                    € {effectivePrice.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-sm text-white/40 line-through tabular-nums">
                      € {product.originalPrice.toFixed(2)}
                    </span>
                  )}
                  {product.inStock ? (
                    <span className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      In Stock
                    </span>
                  ) : (
                    <span className="ml-auto px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-rose-500/15 border border-rose-500/30 text-rose-400">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Finishes Swatches */}
                {product.variants?.finishes && product.variants.finishes.length > 0 && (
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold tracking-wider uppercase text-white/50">
                        Finish / Color
                      </span>
                      <span className="text-white font-medium">
                        {currentFinish?.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {product.variants.finishes.map((finish) => {
                        const isSelected = finish.id === selectedFinishId;
                        return (
                          <button
                            key={finish.id}
                            type="button"
                            onClick={() => handleFinishSelect(finish)}
                            className={`w-7 h-7 rounded-full transition-all flex items-center justify-center cursor-pointer ${
                              isSelected
                                ? 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-obsidian-950 scale-110 shadow-[0_0_12px_rgba(61,224,255,0.6)]'
                                : 'opacity-70 hover:opacity-100 hover:scale-105'
                            }`}
                            style={{
                              backgroundColor: finish.color,
                              border: '1px solid rgba(255,255,255,0.2)',
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
                      <span className="font-semibold tracking-wider uppercase text-white/50">
                        Size
                      </span>
                      <span className="text-white font-medium">
                        {selectedSizeName}
                      </span>
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
                                ? 'bg-white text-obsidian-950 border-white shadow-md font-bold'
                                : size.inStock
                                ? 'bg-surface-navy/60 text-white/80 border-white/10 hover:border-white/30 hover:text-white'
                                : 'bg-transparent text-white/20 border-white/5 cursor-not-allowed line-through'
                            }`}
                          >
                            {size.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Technical Specifications Grid */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold tracking-wider uppercase text-white/50 block">
                    Product Details
                  </span>
                  <div className="p-4 rounded-xl bg-surface-navy/40 border border-white/10 space-y-2 text-xs">
                    {product.materials && (
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                          Material &amp; Craft
                        </span>
                        <span className="text-white/90">{product.materials}</span>
                      </div>
                    )}
                    {product.origin && (
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                          Origin
                        </span>
                        <span className="text-white/90">{product.origin}</span>
                      </div>
                    )}
                    {product.care && (
                      <div>
                        <span className="text-white/40 block text-[10px] uppercase tracking-wider">
                          Care Instructions
                        </span>
                        <span className="text-white/90">{product.care}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer CTA & Stepper */}
              <div className="p-5 sm:p-6 border-t border-white/10 bg-obsidian-950 space-y-3">
                <div className="flex items-center gap-3">
                  {/* Quantity Stepper */}
                  <div className="flex items-center rounded-xl bg-surface-navy/80 border border-white/15 px-2 py-1 flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer text-sm"
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
                      className="w-7 h-7 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer text-sm"
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
                    className={`flex-1 py-3 px-4 rounded-xl font-semibold text-xs tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 shadow-lg cursor-pointer ${
                      isAdded
                        ? 'bg-emerald-500 text-obsidian-950 font-bold'
                        : product.inStock
                        ? 'bg-white hover:bg-neutral-100 text-obsidian-950 shadow-white/10 active:scale-[0.98]'
                        : 'bg-white/10 text-white/30 cursor-not-allowed'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-4 h-4 stroke-[3]" />
                        <span>Added to Bag</span>
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
                  className="flex items-center justify-center gap-1.5 text-xs text-white/50 hover:text-accent-cyan transition-colors py-1 block text-center"
                >
                  <span>View Full Product Details</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
