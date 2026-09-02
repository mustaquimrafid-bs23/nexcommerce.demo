'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileStickyBarProps {
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  onAddToCart: () => void;
}

export function MobileStickyBar({
  price,
  selectedSize,
  selectedColor,
  onAddToCart,
}: MobileStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      // Reveal sticky bar when scrolled past 400px (hero CTA area)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const content = (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="mobileStickyBar"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 z-50 lg:hidden p-3.5 sm:p-4 bg-obsidian-950/95 backdrop-blur-xl border-t border-white/15 shadow-2xl flex items-center justify-between gap-4"
        >
          <div className="space-y-0.5">
            <div id="stickyPriceLabel" className="font-mono text-base font-bold text-white tabular-nums">
              &euro;{price.toFixed(2)}
            </div>
            <div id="stickySizeLabel" className="text-[11px] text-white/60 font-light truncate max-w-[170px]">
              {selectedSize ? `Size ${selectedSize}` : 'Standard'}{' '}
              {selectedColor ? `\u00B7 ${selectedColor}` : ''}
            </div>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            className="min-h-[44px] px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-obsidian-950 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-white/10 active:scale-95 shrink-0"
          >
            <ShoppingBag size={14} />
            <span>Add to Bag</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(content, document.body);
}
