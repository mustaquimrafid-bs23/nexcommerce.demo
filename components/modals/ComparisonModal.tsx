'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, ShoppingBag, Check } from 'lucide-react';
import { Product } from '@/types/catalog';
import { useCartStore } from '@/store/useCartStore';
import { useComparisonStore } from '@/store/useComparisonStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { formatPrice } from '@/lib/utils';

interface ComparisonModalProps {
  isOpen?: boolean;
  productA?: Product;
  productB?: Product;
  onClose?: () => void;
}

export function ComparisonModal({
  isOpen: propIsOpen,
  productA: propProductA,
  productB: propProductB,
  onClose: propOnClose,
}: ComparisonModalProps = {}) {
  const storeIsOpen = useComparisonStore((s) => s.isOpen);
  const storeProductA = useComparisonStore((s) => s.productA);
  const storeProductB = useComparisonStore((s) => s.productB);
  const storeClose = useComparisonStore((s) => s.closeComparison);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const onClose = propOnClose || storeClose;

  // Resolved products with stable fallbacks
  const productA = propProductA || storeProductA || MASTER_PRODUCTS[0];
  const productB = propProductB || storeProductB || (MASTER_PRODUCTS.find((p) => p.id !== productA.id) || MASTER_PRODUCTS[1]);

  const { addItem, openCart } = useCartStore();
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !mounted) return null;

  const handleChoose = (product: Product) => {
    addItem(product, product.sizes ? product.sizes[0] : 'One Size');
    setChosenId(product.id);
    setToastText(`✨ Added ${product.name} to your bag!`);

    setTimeout(() => {
      setChosenId(null);
      setToastText(null);
      onClose();
    }, 1100);
  };

  // Compute dynamic spec diff values based on products
  const isAKnit = /sweater|knit|cashmere|cardigan/i.test(productA.name + ' ' + (productA.description || ''));
  const isBKnit = /sweater|knit|cashmere|cardigan/i.test(productB.name + ' ' + (productB.description || ''));

  const specRows = [
    {
      label: 'Price',
      valA: formatPrice(productA.price),
      valB: formatPrice(productB.price),
      highlightA: productA.price < productB.price ? 'Lower Investment' : undefined,
      highlightB: productB.price < productA.price ? 'Lower Investment' : undefined,
    },
    {
      label: 'Materials',
      valA: isAKnit ? '100% Grade-A Mongolian Cashmere (2-ply yarn)' : '100% Premium Atelier Sourced Wool',
      valB: isBKnit ? '100% Fine Gauge Cashmere (70g/m²)' : 'Virgin Italian Wool Crepe & Silk Lining',
      highlightA: isAKnit ? '2-Ply Cashmere' : undefined,
      highlightB: !isBKnit ? 'Artisanal Weave' : 'Ultra-Light Gauge',
    },
    {
      label: 'Fit Profile',
      valA: isAKnit ? 'Relaxed Architectural Silhouette' : 'Tailored Slim Structure',
      valB: isBKnit ? 'Classic Regular Fit' : 'Structured European Tailoring',
    },
    {
      label: 'Thermal Warmth',
      valA: isAKnit ? '9/10 · Substantial Cold Retention' : '7/10 · Mid-Weight Insulation',
      valB: isBKnit ? '8/10 · Balanced Warmth' : '6/10 · Lightweight Breathable',
      highlightA: isAKnit ? 'Higher Thermal Retention' : undefined,
      highlightB: !isAKnit && isBKnit ? 'Higher Thermal Retention' : undefined,
    },
    {
      label: 'Breathability',
      valA: '8/10 · Micro-Climate Balance',
      valB: '9/10 · All-Day Climate Comfort',
      highlightB: 'Optimal Breathability',
    },
    {
      label: 'Garment Weight',
      valA: isAKnit ? '320g · Substantial Handfeel' : '480g · Tailored Drape',
      valB: isBKnit ? '240g · Featherweight Layer' : '390g · Structured Feel',
      highlightB: 'Lighter Carry',
    },
    {
      label: 'Atelier Origin',
      valA: 'Biella, Northern Italy',
      valB: 'Como Silk Mills, Italy',
    },
    {
      label: 'Customer Rating',
      valA: `★ ${productA.rating || 4.9} (128 reviews)`,
      valB: `★ ${productB.rating || 4.8} (94 reviews)`,
    },
  ];

  return createPortal(
    <div
      id="compareModalBackdrop"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-[#000B1A]/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label="Product Advisor & Comparison Matrix"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Toast */}
      {toastText && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000] px-5 py-3 rounded-xl bg-[#01142E] border border-[#3DE0FF] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check size={14} className="text-[#3DE0FF]" />
          <span>{toastText}</span>
        </div>
      )}

      <div
        className="relative w-full max-w-[1120px] max-h-[92vh] rounded-2xl sm:rounded-3xl border border-white/15 p-3.5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-white"
        style={{
          background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-5 border-b border-white/10 shrink-0">
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-[#3DE0FF] flex items-center gap-1.5 mb-1">
              <span>✨</span>
              <span>CUSTOMER COMMERCE AGENT · SMART CAPABILITY 2</span>
            </div>
            <h2 className="font-serif text-xl sm:text-3xl text-white font-normal tracking-tight">
              Product Advisor &amp; Comparison Matrix
            </h2>
          </div>
          <button
            type="button"
            id="compareModalCloseBtn"
            onClick={onClose}
            aria-label="Close comparison"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10 shrink-0"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="compare-modal-body overflow-y-auto py-4 sm:py-6 space-y-5 sm:space-y-6 pr-1">
          {/* Smart Advisor Verdict Card */}
          <div
            className="rounded-2xl p-4 sm:p-6 border border-[#3DE0FF]/25 shadow-lg space-y-2.5 sm:space-y-3"
            style={{
              background: 'linear-gradient(135deg, rgba(61, 224, 255, 0.07) 0%, rgba(13, 20, 40, 0.65) 100%)',
            }}
          >
            <div className="flex items-center gap-1.5 text-[#3DE0FF] text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em]">
              <Sparkles size={13} className="text-[#3DE0FF]" />
              <span>Smart Advisor Verdict</span>
            </div>
            <h3 className="font-serif text-base sm:text-xl text-white leading-snug">
              {productA.name} offers greater thermal depth, while {productB.name} excels in lightweight layering.
            </h3>
            <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed font-light">
              Choose <strong className="text-white font-semibold">{productA.name}</strong> if you prioritize standalone luxury warmth in cooler climates. Choose <strong className="text-white font-semibold">{productB.name}</strong> if you want an effortless all-season piece that fits cleanly under blazers.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-white/10 text-xs text-white/70">
              <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/5">
                <strong className="text-white block mb-0.5">{productA.name}:</strong>
                <span>Ideal for: Standalone winter warmth &amp; architectural drape</span>
              </div>
              <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/5">
                <strong className="text-white block mb-0.5">{productB.name}:</strong>
                <span>Ideal for: Daily office layering &amp; transitional seasons</span>
              </div>
            </div>
          </div>

          {/* Products Header Row */}
          <div className="compare-products-header-grid">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/40 mb-2 sm:mb-0">
              SPEC DIFF MATRIX
            </div>

            {/* Product A */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-2.5 sm:p-4 flex flex-col items-center text-center gap-2 sm:gap-2.5 shadow-sm min-w-0 overflow-hidden">
              <div
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl p-1.5 sm:p-2 flex items-center justify-center shrink-0"
                style={{
                  background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
                }}
              >
                <img
                  src={productA.image}
                  alt={productA.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white truncate max-w-full px-0.5">
                {productA.name}
              </div>
              <div className="font-serif text-sm sm:text-lg text-[#3DE0FF]">
                {formatPrice(productA.price)}
              </div>
              <button
                type="button"
                onClick={() => handleChoose(productA)}
                className="w-full min-h-[38px] sm:min-h-[40px] py-2 px-1.5 sm:px-3 rounded-xl bg-[#3DE0FF] hover:bg-[#6BE8FF] text-[#000B1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-md whitespace-nowrap"
              >
                {chosenId === productA.id ? <Check size={13} /> : <ShoppingBag size={13} />}
                <span>{chosenId === productA.id ? 'Added!' : 'Choose This'}</span>
              </button>
            </div>

            {/* Product B */}
            <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-2.5 sm:p-4 flex flex-col items-center text-center gap-2 sm:gap-2.5 shadow-sm min-w-0 overflow-hidden">
              <div
                className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl p-1.5 sm:p-2 flex items-center justify-center shrink-0"
                style={{
                  background: 'radial-gradient(circle at center, #1E293B 0%, #0F172A 100%)',
                }}
              >
                <img
                  src={productB.image}
                  alt={productB.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-white truncate max-w-full px-0.5">
                {productB.name}
              </div>
              <div className="font-serif text-sm sm:text-lg text-[#3DE0FF]">
                {formatPrice(productB.price)}
              </div>
              <button
                type="button"
                onClick={() => handleChoose(productB)}
                className="w-full min-h-[38px] sm:min-h-[40px] py-2 px-1.5 sm:px-3 rounded-xl bg-[#3DE0FF] hover:bg-[#6BE8FF] text-[#000B1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-md whitespace-nowrap"
              >
                {chosenId === productB.id ? <Check size={13} /> : <ShoppingBag size={13} />}
                <span>{chosenId === productB.id ? 'Added!' : 'Choose This'}</span>
              </button>
            </div>
          </div>

          {/* 8-Row Spec Comparison Matrix */}
          <div className="compare-matrix-table pt-1">
            {specRows.map((row) => (
              <div
                key={row.label}
                className="compare-matrix-row"
              >
                <div className="compare-spec-label text-[11px] font-bold uppercase tracking-wider text-white/50">
                  {row.label}
                </div>
                <div className="text-white flex flex-col gap-1 items-start">
                  <span>{row.valA}</span>
                  {row.highlightA && (
                    <span className="compare-diff-tag">
                      {row.highlightA}
                    </span>
                  )}
                </div>
                <div className="text-white flex flex-col gap-1 items-start">
                  <span>{row.valB}</span>
                  {row.highlightB && (
                    <span className="compare-diff-tag">
                      {row.highlightB}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
