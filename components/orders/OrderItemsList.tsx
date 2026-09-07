'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Package, RotateCcw, Check, Star, ExternalLink, X, Sparkles } from 'lucide-react';
import { formatPrice, resolveProductImage } from '@/lib/utils';
import { useCartStore } from '@/store/useCartStore';
import { CartItem, Product } from '@/types/catalog';

interface OrderItemsListProps {
  items: CartItem[];
}

export function OrderItemsList({ items = [] }: OrderItemsListProps) {
  const { addItem } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const [reorderedMap, setReorderedMap] = useState<Record<string, boolean>>({});
  const [reviewItemName, setReviewItemName] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBuyAgain = (item: CartItem) => {
    const p: Product = {
      id: item.product.id || `reorder-${item.product.name.replace(/\s+/g, '-').toLowerCase()}`,
      name: item.product.name,
      brand: item.product.brand || 'nexCommerce Atelier',
      category: item.product.category || 'apparel',
      price: item.product.price,
      image: item.product.image,
      description: item.product.description || '',
    };

    addItem(p, item.selectedSize || 'M', 'Standard', item.quantity || 1);

    const key = item.product.id || item.product.name;
    setReorderedMap((prev) => ({ ...prev, [key]: true }));

    setTimeout(() => {
      setReorderedMap((prev) => ({ ...prev, [key]: false }));
    }, 2500);
  };

  const handleOpenReview = (name: string) => {
    setReviewItemName(name);
    setReviewSubmitted(false);
  };

  const handleCloseReview = () => {
    setReviewItemName(null);
    setReviewSubmitted(false);
  };

  return (
    <div
      id="orderItemsListCard"
      className="rounded-2xl border border-white/10 bg-[#0A2A54]/30 backdrop-blur-md p-6 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.25)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <Package className="w-4 h-4 text-accent-cyan" />
          <h3 className="text-xs font-bold tracking-[0.14em] uppercase text-white">
            ITEMS ORDERED ({items.reduce((acc, curr) => acc + (curr.quantity || 1), 0)})
          </h3>
        </div>

        <Link
          href="/category"
          className="text-xs font-semibold text-accent-cyan hover:underline flex items-center gap-1 transition-colors"
        >
          <span>Explore Catalog</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* Items List */}
      <div className="divide-y divide-white/10">
        {items.map((item, idx) => {
          const p = item.product;
          const imgUrl = resolveProductImage(p.image);
          const itemKey = p.id || p.name;
          const isAdded = !!reorderedMap[itemKey];

          return (
            <div
              key={idx}
              className="py-5 first:pt-4 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              {/* Product Info & Thumb */}
              <div className="flex items-start gap-4 min-w-0">
                <div className="w-16 h-20 rounded-xl overflow-hidden border border-white/10 bg-[#01132B]/60 shrink-0 relative group flex items-center justify-center p-1">
                  <img
                    src={imgUrl}
                    alt={p.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/products/p1.png';
                    }}
                  />
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-white/[0.06] border border-white/12 text-white/60">
                      {p.category || 'Apparel'}
                    </span>
                    <span className="text-[10px] font-semibold text-accent-cyan">
                      {p.brand || 'nexCommerce Atelier'}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white truncate">
                    {p.name}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-white/60 flex-wrap">
                    <span>
                      Size: <strong className="text-white">{item.selectedSize || 'Standard'}</strong>
                    </span>
                    <span>&middot;</span>
                    <span>
                      Qty: <strong className="text-white">{item.quantity || 1}</strong>
                    </span>
                    <span>&middot;</span>
                    <span className="font-mono text-white/90">
                      {formatPrice(p.price)} each
                    </span>
                  </div>
                </div>
              </div>

              {/* Price & Action Cluster */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 shrink-0 pt-2 sm:pt-0">
                <div className="font-mono text-sm font-bold text-white tabular-nums">
                  {formatPrice((p.price || 0) * (item.quantity || 1))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleBuyAgain(item)}
                    className={`h-8 px-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer active:scale-[0.98] ${
                      isAdded
                        ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'bg-accent-cyan text-[#000B1A] hover:bg-accent-cyan/90 font-bold shadow-sm'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-3 h-3" />
                        <span>Buy Again</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOpenReview(p.name)}
                    className="h-8 px-3 rounded-lg bg-white/[0.06] border border-white/12 text-white/80 hover:text-white hover:bg-white/[0.12] text-xs font-medium inline-flex items-center gap-1 transition-all cursor-pointer active:scale-[0.98]"
                  >
                    <Star className="w-3 h-3 text-amber-400" />
                    <span className="hidden sm:inline">Review</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Review Modal Dialog - Portaled directly to body with full viewport coverage */}
      {mounted && reviewItemName && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reviewModalTitle"
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            className="fixed inset-0"
            onClick={handleCloseReview}
          />
          <div className="max-w-md w-full rounded-2xl bg-[#012148] border border-white/20 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-4 relative z-10 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[9.5px] font-bold tracking-[0.14em] uppercase text-accent-cyan flex items-center gap-1 mb-0.5">
                  <Sparkles className="w-3 h-3" />
                  <span>VERIFIED PATRON FEEDBACK</span>
                </span>
                <h3 id="reviewModalTitle" className="text-base font-bold text-white">
                  Review {reviewItemName}
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCloseReview}
                aria-label="Close modal"
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer -mt-1 -mr-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!reviewSubmitted ? (
              <>
                <p className="text-xs text-white/70 leading-relaxed">
                  Share your experience with this atelier piece to assist fellow patrons.
                </p>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setRating(s)}
                      className="p-1 cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          s <= rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-white ml-2">
                    {rating} / 5 Stars
                  </span>
                </div>
                <textarea
                  rows={4}
                  placeholder="How did the fit, fabric, and silhouette feel?"
                  className="w-full bg-[#01132B] border border-white/15 rounded-xl p-3.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-cyan"
                />
                <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleCloseReview}
                    className="px-4 py-2.5 rounded-xl border border-white/15 bg-white/5 text-xs text-white hover:bg-white/10 font-medium cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setReviewSubmitted(true)}
                    className="px-5 py-2.5 rounded-xl bg-accent-cyan text-xs font-bold text-[#000B1A] hover:bg-accent-cyan/90 cursor-pointer shadow-sm transition-all"
                  >
                    Submit Review
                  </button>
                </div>
              </>
            ) : (
              <div className="py-4 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Review Recorded</h4>
                  <p className="text-xs text-emerald-400 font-medium">
                    Thank you! Your verified patron review has been recorded.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCloseReview}
                  className="px-6 py-2.5 rounded-xl bg-white/10 border border-white/15 text-xs text-white font-semibold hover:bg-white/15 cursor-pointer"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
