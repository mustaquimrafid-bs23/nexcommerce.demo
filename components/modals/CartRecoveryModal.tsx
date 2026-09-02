'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Clock, Sparkles, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';

interface CartRecoveryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartRecoveryModal({ isOpen, onClose }: CartRecoveryModalProps) {
  const router = useRouter();
  const { items, applyCoupon } = useCartStore();
  const [secondsRemaining, setSecondsRemaining] = useState(899); // 14:59

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen || items.length === 0) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;

  const handleClaim = () => {
    applyCoupon('COMEBACK10');
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('applied_recovery_code', 'COMEBACK10');
      sessionStorage.setItem('nex_recovery_dismissed', 'true');
    }
    onClose();
    router.push('/checkout');
  };

  const handleDismiss = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('nex_recovery_dismissed', 'true');
    }
    onClose();
  };

  return (
    <div
      id="cartRecoveryModalOverlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Cart Recovery Incentive"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Close recovery modal"
          className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>

        {/* Timer Badge & Items Count */}
        <div className="flex items-center justify-between pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-pink/15 border border-accent-pink/30 text-accent-pink text-xs font-semibold font-mono">
            <Clock size={13} />
            <span>{timeFormatted} Reservation Hold</span>
          </div>
          <span className="text-[11px] font-mono text-white/40 uppercase">
            {items.length} {items.length === 1 ? 'Piece' : 'Pieces'} Reserved
          </span>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <h3 className="font-editorial text-2xl text-white font-normal leading-snug">
            Your Atelier Selection is Held for 15 Minutes
          </h3>
          <p className="text-xs text-white/60 font-light leading-relaxed">
            High-demand tailoring and acoustics sell out rapidly. To help you finalize your commission, we have activated an exclusive 10% comeback incentive.
          </p>
        </div>

        {/* Reserved Product Thumbnails Row */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-2">
          {items.map((item, idx) => (
            <div
              key={item.product?.id || idx}
              className="w-14 h-14 rounded-xl bg-obsidian-950 p-1 border border-white/10 shrink-0 flex items-center justify-center relative"
              title={item.product?.name || 'Item'}
            >
              <img
                src={item.product?.image || '/assets/images/products/p1.png'}
                alt={item.product?.name || 'Item'}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          ))}
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleClaim}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-accent-pink to-accent-crimson hover:opacity-95 text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg shadow-accent-pink/25"
        >
          <Sparkles size={14} />
          <span>Claim COMEBACK10 &amp; Complete Order</span>
        </button>
      </div>
    </div>
  );
}
export default CartRecoveryModal;
