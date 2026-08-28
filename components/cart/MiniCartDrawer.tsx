'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'motion/react';
import { X, Trash2, ShoppingBag, Heart, ArrowRight, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types/catalog';

const FREE_DELIVERY_THRESHOLD = 150;

export function MiniCartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal, getItemCount } =
    useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard Escape Handler & Body Scroll Lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeCart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Lock body scroll & pause Lenis smooth scroll
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    if (typeof window !== 'undefined' && (window as unknown as { _nexLenis?: { stop: () => void; start: () => void } })._nexLenis) {
      (window as unknown as { _nexLenis?: { stop: () => void; start: () => void } })._nexLenis?.stop();
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = prevOverflow;
      if (typeof window !== 'undefined' && (window as unknown as { _nexLenis?: { stop: () => void; start: () => void } })._nexLenis) {
        (window as unknown as { _nexLenis?: { stop: () => void; start: () => void } })._nexLenis?.start();
      }
    };
  }, [isOpen, closeCart]);

  const handleWishlistToggle = useCallback(
    (product: Product, e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      toggleWishlist(product);
    },
    [toggleWishlist]
  );

  if (!mounted) return null;

  const subtotal = getSubtotal();
  const totalCount = getItemCount();
  const amountToFree = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const deliveryProgress = Math.min(100, (subtotal / FREE_DELIVERY_THRESHOLD) * 100);
  const qualifiesForFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9998] flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping Bag">
          {/* Obsidian Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            id="nexMiniCartDrawer"
            initial={{ x: '100%' }}
            animate={{ x: '0%' }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300, mass: 0.8 }}
            className="relative w-full max-w-[460px] bg-[#060B14] border-l border-white/10 h-full flex flex-col z-[9999] shadow-[0_0_60px_rgba(0,0,0,0.85)] will-change-transform"
            data-lenis-prevent
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-[#08101E]/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <h2 className="font-serif text-2xl font-normal tracking-wide text-white">
                  Shopping Bag
                </h2>
                {totalCount > 0 && (
                  <span className="text-[11px] font-sans font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-white/80 border border-white/10 tabular-nums">
                    {totalCount} {totalCount === 1 ? 'piece' : 'pieces'}
                  </span>
                )}
              </div>
              <button
                id="minicartCloseBtn"
                onClick={closeCart}
                className="w-9 h-9 flex items-center justify-center text-white/60 hover:text-white rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
                aria-label="Close Shopping Bag"
                type="button"
              >
                <X size={18} />
              </button>
            </div>

            {/* Dynamic Complimentary Delivery Progress Bar */}
            {items.length > 0 && (
              <div className="px-6 py-3.5 bg-gradient-to-r from-[#0C172C] to-[#08101E] border-b border-white/10">
                <div className="flex items-center justify-between text-xs mb-2">
                  {qualifiesForFreeDelivery ? (
                    <span className="text-[#34D399] font-medium flex items-center gap-1.5">
                      <Sparkles size={13} className="text-[#34D399]" />
                      You have unlocked Complimentary Express Delivery
                    </span>
                  ) : (
                    <span className="text-white/80">
                      Add <strong className="text-white font-semibold tabular-nums">{formatPrice(amountToFree)}</strong> more for <span className="text-[#3DE0FF] font-medium">Complimentary Delivery</span>
                    </span>
                  )}
                  <span className="text-[11px] text-white/50 tabular-nums">
                    {Math.round(deliveryProgress)}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${
                      qualifiesForFreeDelivery
                        ? 'bg-gradient-to-r from-[#3DE0FF] to-[#34D399]'
                        : 'bg-gradient-to-r from-[#F13365] to-[#3DE0FF]'
                    }`}
                    style={{ width: `${deliveryProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Body / Items List */}
            <div
              id="minicartBody"
              className="flex-1 overflow-y-auto px-6 py-5 space-y-4"
              data-lenis-prevent
            >
              {items.length === 0 ? (
                <div className="text-center py-16 px-4 flex flex-col items-center justify-center space-y-5">
                  <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-white/40 shadow-inner">
                    <ShoppingBag size={28} />
                  </div>
                  <div className="space-y-1.5 max-w-[280px]">
                    <h3 className="font-serif text-2xl font-normal text-white">Your bag is empty</h3>
                    <p className="text-white/60 text-xs leading-relaxed">
                      Discover contemporary pieces styled around how you want to dress.
                    </p>
                  </div>
                  <div className="pt-2 flex flex-col w-full max-w-[240px] gap-2.5">
                    <Link
                      href="/category?cat=all"
                      onClick={closeCart}
                      className="w-full py-2.5 px-4 rounded-xl bg-white text-obsidian-950 font-semibold text-xs uppercase tracking-wider text-center hover:bg-white/90 transition-all shadow-md active:scale-98"
                    >
                      Explore New Arrivals
                    </Link>
                    <Link
                      href="/discovery"
                      onClick={closeCart}
                      className="w-full py-2.5 px-4 rounded-xl bg-white/5 border border-white/10 text-white/80 font-medium text-xs text-center hover:bg-white/10 hover:text-white transition-all active:scale-98 flex items-center justify-center gap-1.5"
                    >
                      <span>Personal Discovery</span>
                      <ArrowRight size={13} />
                    </Link>
                    <Link
                      href="/wishlist"
                      onClick={closeCart}
                      className="w-full py-2.5 px-4 rounded-xl bg-transparent text-white/60 text-xs text-center hover:text-white transition-colors"
                    >
                      View Saved Pieces
                    </Link>
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item, idx) => {
                    const wishlisted = isWishlisted(item.product.id);
                    const itemKey = `${item.product.id}-${item.selectedSize || 'std'}-${item.selectedColor || 'std'}-${idx}`;

                    return (
                      <motion.div
                        key={itemKey}
                        layout
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0, overflow: 'hidden' }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="flex gap-4 p-3.5 rounded-xl bg-[#091222]/80 border border-white/10 hover:border-white/20 transition-colors group"
                      >
                        {/* Radial Studio Thumbnail Frame */}
                        <Link
                          href={`/product/${item.product.id}`}
                          onClick={closeCart}
                          className="relative w-20 h-24 rounded-lg bg-gradient-to-b from-[#131f38]/60 to-[#0c1527]/80 border border-white/10 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden"
                          aria-label={`View ${item.product.name}`}
                        >
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src =
                                  '/assets/images/products/p1.png';
                              }}
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/20">
                              <ShoppingBag size={20} />
                            </div>
                          )}
                        </Link>

                        {/* Item Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            {item.product.category && (
                              <span className="text-[10px] font-semibold tracking-widest text-[#3DE0FF]/80 uppercase block mb-0.5">
                                {item.product.category}
                              </span>
                            )}
                            <Link
                              href={`/product/${item.product.id}`}
                              onClick={closeCart}
                              className="text-sm font-medium text-white hover:text-[#3DE0FF] transition-colors line-clamp-1 block"
                            >
                              {item.product.name}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              {item.selectedSize && (
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="inline-block text-[10px] px-2 py-0.5 rounded bg-white/5 border border-white/10 text-white/70">
                                  {item.selectedColor}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stepper + Micro Actions + Price */}
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                            {/* Quantity Stepper */}
                            <div className="flex items-center border border-white/15 rounded-lg bg-black/20 overflow-hidden">
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
                                className="w-7 h-7 flex items-center justify-center text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                                aria-label={`Decrease quantity of ${item.product.name}`}
                                disabled={item.quantity <= 1}
                              >
                                −
                              </button>
                              <span className="w-7 text-center text-xs font-semibold text-white tabular-nums">
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
                                className="w-7 h-7 flex items-center justify-center text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                                aria-label={`Increase quantity of ${item.product.name}`}
                              >
                                +
                              </button>
                            </div>

                            {/* Wishlist & Remove Buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={(e) => handleWishlistToggle(item.product, e)}
                                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                                  wishlisted
                                    ? 'text-[#F13365] bg-[#F13365]/10'
                                    : 'text-white/40 hover:text-white hover:bg-white/5'
                                }`}
                                aria-label="Save piece to wishlist"
                                title={wishlisted ? 'Saved in Wishlist' : 'Save to Wishlist'}
                              >
                                <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  removeItem(item.product.id, item.selectedSize, item.selectedColor)
                                }
                                className="p-1.5 text-white/40 hover:text-[#FB7185] hover:bg-[#FB7185]/10 rounded-lg transition-colors cursor-pointer"
                                aria-label={`Remove ${item.product.name} from bag`}
                                title="Remove piece"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>

                            {/* Line Price */}
                            <div className="text-right">
                              <span className="text-sm font-semibold text-white tabular-nums block">
                                {formatPrice(item.product.price * item.quantity)}
                              </span>
                              {item.quantity > 1 && (
                                <span className="text-[10px] text-white/40 tabular-nums block">
                                  {formatPrice(item.product.price)} ea
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div id="minicartFooter" className="p-6 border-t border-white/10 bg-[#08101E] space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline text-sm">
                    <span className="text-white/70">Estimated Subtotal</span>
                    <span id="minicartSubtotalValue" className="text-white font-semibold text-base tabular-nums">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">Delivery</span>
                    <span className={`tabular-nums font-medium ${qualifiesForFreeDelivery ? 'text-[#34D399]' : 'text-white/70'}`}>
                      {qualifiesForFreeDelivery ? 'Complimentary' : formatPrice(12)}
                    </span>
                  </div>
                  <p className="text-[11px] text-white/40 pt-1">
                    VAT &amp; duties included where applicable. Items reserved for 30 minutes.
                  </p>
                </div>

                <div className="space-y-2.5 pt-1">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="minicart-checkout-btn block w-full py-3.5 px-4 text-center rounded-xl bg-[#E60C45] hover:bg-[#F13365] text-white font-bold text-xs uppercase tracking-widest transition-all duration-200 shadow-lg shadow-[#E60C45]/25 hover:scale-[1.01] active:scale-[0.99]"
                  >
                    Review Bag &amp; Checkout &rarr;
                  </Link>
                </div>

                {/* Trust & Reassurance Badges */}
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-white/45">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck size={13} className="text-[#3DE0FF]/70" />
                    <span>256-bit Encrypted</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <RotateCcw size={13} className="text-[#34D399]/70" />
                    <span>Complimentary Returns</span>
                  </span>
                </div>
              </div>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
