'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, ShoppingBag, Check, RefreshCw, ArrowRight } from 'lucide-react';
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

type ProductCategoryType = 'apparel' | 'bags' | 'watches' | 'acoustics' | 'footwear' | 'other';

function detectProductCategory(p: Product): ProductCategoryType {
  const cat = (p.category || '').toLowerCase();
  const sub = (p.subCategory || '').toLowerCase();
  const name = (p.name || '').toLowerCase();

  if (cat === 'apparel' || cat === 'outerwear' || cat === 'tailoring' || sub === 'knitwear' || sub === 'coats' || sub === 'tailoring') {
    return 'apparel';
  }
  if (sub === 'bags' || /bag|tote|backpack|weekender/i.test(name)) {
    return 'bags';
  }
  if (sub === 'watches' || /watch|chronograph|timepiece/i.test(name)) {
    return 'watches';
  }
  if (cat === 'acoustics' || sub === 'headphones' || sub === 'earbuds' || /headphone|earbud|audio/i.test(name)) {
    return 'acoustics';
  }
  if (cat === 'footwear' || sub === 'sneakers' || /runner|sneaker|shoe|boot/i.test(name)) {
    return 'footwear';
  }
  return 'other';
}

interface SpecRow {
  label: string;
  valA: string;
  valB: string;
  highlightA?: string;
  highlightB?: string;
}

function resolveSpecMatrix(productA: Product, productB: Product): SpecRow[] {
  const catA = detectProductCategory(productA);
  const catB = detectProductCategory(productB);
  const isSameCategory = catA === catB;

  const isAKnit = /sweater|knit|cashmere|cardigan/i.test(productA.name + ' ' + (productA.description || ''));
  const isBKnit = /sweater|knit|cashmere|cardigan/i.test(productB.name + ' ' + (productB.description || ''));

  // Base Row 1: Price
  const priceRow: SpecRow = {
    label: 'Price',
    valA: formatPrice(productA.price),
    valB: formatPrice(productB.price),
    highlightA: productA.price < productB.price ? 'Lower Investment' : undefined,
    highlightB: productB.price < productA.price ? 'Lower Investment' : undefined,
  };

  // Base Row 7 & 8: Origin and Rating
  const originRow: SpecRow = {
    label: 'Atelier Origin',
    valA: productA.origin || 'Biella, Northern Italy',
    valB: productB.origin || 'Como Silk Mills, Italy',
  };

  const ratingRow: SpecRow = {
    label: 'Customer Rating',
    valA: `★ ${productA.rating || 4.9} (${Math.round((productA.rating || 4.9) * 24)} reviews)`,
    valB: `★ ${productB.rating || 4.8} (${Math.round((productB.rating || 4.8) * 20)} reviews)`,
  };

  if (isSameCategory && catA === 'apparel') {
    return [
      priceRow,
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
      originRow,
      ratingRow,
    ];
  }

  if (isSameCategory && catA === 'bags') {
    return [
      priceRow,
      {
        label: 'Materials',
        valA: 'Heavyweight Tuscan Vegetable-Tanned Leather',
        valB: 'Water-Resistant Cotton Canvas & Bridle Leather',
        highlightA: 'Artisanal Weave',
      },
      {
        label: 'Fit Profile',
        valA: 'Structured Architectural Silhouette',
        valB: 'Flexible Soft-Structured Duffel Profile',
      },
      {
        label: 'Tech & Capacity',
        valA: 'Padded 16" Dedicated Microfiber Laptop Sleeve',
        valB: 'Reinforced Padded Base with Tech Sleeve',
        highlightA: 'Higher Thermal Retention',
      },
      {
        label: 'Carry & Straps',
        valA: 'Dual Architectural Solid Brass Top Handles',
        valB: 'Detachable Webbing Strap & Bridle Grips',
        highlightB: 'Optimal Breathability',
      },
      {
        label: 'Bag Weight',
        valA: '1,120g · Solid Structural Feel',
        valB: '780g · Featherweight Commuter',
        highlightB: 'Lighter Carry',
      },
      originRow,
      ratingRow,
    ];
  }

  if (isSameCategory && catA === 'watches') {
    return [
      priceRow,
      {
        label: 'Materials',
        valA: '316L Brushed Surgical Stainless Steel',
        valB: 'Ultra-Light Grade 5 Titanium Casing',
        highlightB: 'Ultra-Light Gauge',
      },
      {
        label: 'Fit Profile',
        valA: '40mm Contemporary Architectural Casing',
        valB: '38mm Ultra-Slim Profile Case',
      },
      {
        label: 'Movement Caliber',
        valA: 'Swiss Precision Quartz Chronograph Caliber',
        valB: 'Automated Mechanical 3-Hand Movement',
      },
      {
        label: 'Crystal & Lens',
        valA: 'Anti-Reflective Sapphire Crystal (9 Mohs)',
        valB: 'Double-Domed Sapphire Lens with AR Coating',
        highlightB: 'Optimal Breathability',
      },
      {
        label: 'Casing Weight',
        valA: '92g (with American Horween Leather Strap)',
        valB: '68g (with Italian Milanese Mesh)',
        highlightB: 'Lighter Carry',
      },
      originRow,
      ratingRow,
    ];
  }

  if (isSameCategory && catA === 'acoustics') {
    return [
      priceRow,
      {
        label: 'Materials',
        valA: 'Custom 40mm Titanium Acoustic Drivers',
        valB: 'High-Excursion 10mm Graphene Transducers',
        highlightA: 'Artisanal Weave',
      },
      {
        label: 'Fit Profile',
        valA: 'Over-Ear Italian Lambskin & Memory Foam',
        valB: 'In-Ear Ergonomic Silicone Contoured Tips',
      },
      {
        label: 'Noise Cancellation',
        valA: 'Hybrid Active Noise Cancellation (4 Mics)',
        valB: 'Feedforward Adaptive ANC + Spatial Audio',
        highlightA: 'Higher Thermal Retention',
      },
      {
        label: 'Battery Endurance',
        valA: '40 Hours Playback (Fast USB-C Charge)',
        valB: '28 Hours Playback (Wireless Charging Case)',
        highlightB: 'Optimal Breathability',
      },
      {
        label: 'Device Weight',
        valA: '265g · Studio Over-Ear Balance',
        valB: '48g · Pocket Carry Charging Capsule',
        highlightB: 'Lighter Carry',
      },
      originRow,
      ratingRow,
    ];
  }

  if (isSameCategory && catA === 'footwear') {
    return [
      priceRow,
      {
        label: 'Materials',
        valA: 'Hand-Lasted Italian Full-Grain Calfskin',
        valB: 'Supple Nappa Leather & Perforated Suede',
        highlightA: 'Artisanal Weave',
      },
      {
        label: 'Fit Profile',
        valA: 'Ergonomic Low-Profile Court Silhouette',
        valB: 'Classic European Running Shoe Profile',
      },
      {
        label: 'Midsole Cushioning',
        valA: 'Shock-Absorbing Dual-Density EVA Midsole',
        valB: 'Cushioned OrthoLite Memory Footbed',
      },
      {
        label: 'Outsole Traction',
        valA: 'Ergonomic Vibram High-Traction Rubber',
        valB: 'Natural Gum Rubber Flexible Outsole',
        highlightB: 'Optimal Breathability',
      },
      {
        label: 'Pair Weight',
        valA: '360g per shoe (Built for 15,000+ steps)',
        valB: '310g per shoe (Featherweight city carry)',
        highlightB: 'Lighter Carry',
      },
      originRow,
      ratingRow,
    ];
  }

  // Cross-Category Hybrid Comparison
  const getProductHighlight = (p: Product) => {
    if (p.whyExpanded && p.whyExpanded.length > 0) {
      return `${p.whyExpanded[0].label}: ${p.whyExpanded[0].desc}`;
    }
    return p.reasoning || p.description;
  };

  return [
    priceRow,
    {
      label: 'Materials',
      valA: productA.materials?.[0] || productA.whyExpanded?.[0]?.desc || '100% Atelier Sourced Craft',
      valB: productB.materials?.[0] || productB.whyExpanded?.[0]?.desc || '100% Atelier Sourced Craft',
      highlightA: 'Artisanal Weave',
      highlightB: 'Ultra-Light Gauge',
    },
    {
      label: 'Fit Profile',
      valA: `${(productA.subCategory || productA.category).toUpperCase()} · Architectural Profile`,
      valB: `${(productB.subCategory || productB.category).toUpperCase()} · Precision Engineering`,
    },
    {
      label: 'Key Innovation',
      valA: getProductHighlight(productA),
      valB: getProductHighlight(productB),
      highlightA: 'Higher Thermal Retention',
    },
    {
      label: 'Craft Distinction',
      valA: productA.tag || 'Hand-Finished Essential',
      valB: productB.tag || 'Precision Essential',
      highlightB: 'Optimal Breathability',
    },
    {
      label: 'Profile & Weight',
      valA: productA.category === 'accessories' && /tote|bag/i.test(productA.name) ? '1,120g Daily Carry' : '380g Structured Silhouette',
      valB: productB.category === 'accessories' && /watch/i.test(productB.name) ? '92g Precision Wristpiece' : '260g Low Profile',
      highlightB: 'Lighter Carry',
    },
    originRow,
    ratingRow,
  ];
}

interface AdvisorVerdict {
  headline: string;
  summary: string;
  bestForA: string;
  bestForB: string;
}

function generateAdvisorVerdict(productA: Product, productB: Product): AdvisorVerdict {
  const catA = detectProductCategory(productA);
  const catB = detectProductCategory(productB);

  if (catA === 'apparel' && catB === 'apparel') {
    return {
      headline: `${productA.name} offers greater thermal depth, while ${productB.name} excels in lightweight layering.`,
      summary: `Choose ${productA.name} if you prioritize standalone luxury warmth in cooler climates. Choose ${productB.name} if you want an effortless all-season piece that fits cleanly under blazers.`,
      bestForA: 'Ideal for: Standalone winter warmth & architectural drape',
      bestForB: 'Ideal for: Daily office layering & transitional seasons',
    };
  }

  if (catA === 'bags' && catB === 'bags') {
    return {
      headline: `${productA.name} provides structured tech protection, while ${productB.name} offers flexible travel capacity.`,
      summary: `Choose ${productA.name} for daily executive commutes, meetings, and 16" laptop safety. Choose ${productB.name} for spontaneous weekends and generous packing.`,
      bestForA: 'Ideal for: Professional commute & dedicated laptop storage',
      bestForB: 'Ideal for: Weekend getaways & flexible travel carry',
    };
  }

  if (catA === 'watches' && catB === 'watches') {
    return {
      headline: `${productA.name} delivers precision chronograph complexity, while ${productB.name} champions minimalist dress poise.`,
      summary: `Choose ${productA.name} for technical multi-dial timing and Horween leather presence. Choose ${productB.name} for an understated, ultra-slim profile.`,
      bestForA: 'Ideal for: Technical timing, formal events & luxury statement',
      bestForB: 'Ideal for: Daily desk wear & understated modern tailoring',
    };
  }

  if (catA === 'acoustics' && catB === 'acoustics') {
    return {
      headline: `${productA.name} offers over-ear studio fidelity, while ${productB.name} provides pocket-ready wireless freedom.`,
      summary: `Choose ${productA.name} for deep acoustic immersion, flights, and lambskin comfort. Choose ${productB.name} for workouts, fast transit, and pocket convenience.`,
      bestForA: 'Ideal for: Deep focus work, flights & 40h endurance',
      bestForB: 'Ideal for: Workouts, active commuting & compact carry',
    };
  }

  if (catA === 'footwear' && catB === 'footwear') {
    return {
      headline: `${productA.name} excels in all-day ergonomic walking, while ${productB.name} offers formal sartorial polish.`,
      summary: `Choose ${productA.name} for 15,000+ daily steps, cushioned transit, and city strolls. Choose ${productB.name} for sharp dinner tailoring and formal events.`,
      bestForA: 'Ideal for: 15,000+ daily steps & ergonomic city walking',
      bestForB: 'Ideal for: Polished formal evenings & tailored styling',
    };
  }

  // Cross-category comparison
  const subA = productA.subCategory || productA.category;
  const subB = productB.subCategory || productB.category;
  return {
    headline: `${productA.name} delivers structured ${subA} craftsmanship, while ${productB.name} provides timeless ${subB} refinement.`,
    summary: `Choose ${productA.name} if you are looking for an elevated ${subA} investment designed for daily utility. Choose ${productB.name} if you want a signature ${subB} to complete your wardrobe.`,
    bestForA: `Ideal for: Daily ${subA} utility & craft preservation (${productA.origin || 'Italy'})`,
    bestForB: `Ideal for: Hallmark ${subB} luxury & personal styling (${productB.origin || 'Switzerland'})`,
  };
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
  const setStoreProductA = useComparisonStore((s) => s.setProductA);
  const setStoreProductB = useComparisonStore((s) => s.setProductB);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const onClose = propOnClose || storeClose;

  // Resolved products with stable fallbacks
  const productA = propProductA || storeProductA || MASTER_PRODUCTS[0];
  const productB = propProductB || storeProductB || (MASTER_PRODUCTS.find((p) => p.id !== productA.id) || MASTER_PRODUCTS[1]);

  const { addItem } = useCartStore();
  const [chosenId, setChosenId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [toastText, setToastText] = useState<string | null>(null);

  // Swapper state: which column ('A' | 'B' | null) has the swap popover open
  const [swappingCol, setSwappingCol] = useState<'A' | 'B' | null>(null);

  // Variant selector drawer state: product ID currently selecting variant
  const [variantSelectorId, setVariantSelectorId] = useState<string | null>(null);
  const [selectedSizeMap, setSelectedSizeMap] = useState<Record<string, string>>({});
  const [selectedColorMap, setSelectedColorMap] = useState<Record<string, string>>({});

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (swappingCol) {
          setSwappingCol(null);
        } else if (variantSelectorId) {
          setVariantSelectorId(null);
        } else if (isOpen) {
          onClose();
        }
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setSwappingCol(null);
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, swappingCol, variantSelectorId]);

  if (!isOpen || !mounted) return null;

  const handleChooseClick = (product: Product) => {
    const hasMultipleSizes = product.sizes && product.sizes.length > 1;
    const hasMultipleColors = product.colors && product.colors.length > 1;

    // If product has multiple sizes or colors, open the inline variant selector
    if ((hasMultipleSizes || hasMultipleColors) && variantSelectorId !== product.id) {
      setVariantSelectorId(product.id);
      if (!selectedSizeMap[product.id] && product.sizes?.[0]) {
        setSelectedSizeMap((prev) => ({ ...prev, [product.id]: product.sizes![0] }));
      }
      if (!selectedColorMap[product.id] && product.colors?.[0]) {
        setSelectedColorMap((prev) => ({ ...prev, [product.id]: product.colors![0].name }));
      }
      return;
    }

    // Direct add (single size or already selected)
    executeAdd(product);
  };

  const executeAdd = (product: Product) => {
    const chosenSize = selectedSizeMap[product.id] || (product.sizes ? product.sizes[0] : 'One Size');
    const chosenColor = selectedColorMap[product.id] || (product.colors?.[0]?.name || 'Standard');

    addItem(product, chosenSize, chosenColor);
    setChosenId(product.id);
    setVariantSelectorId(null);
    setToastText(`✨ Added ${product.name} (${chosenSize}) to your bag!`);

    setTimeout(() => {
      setChosenId(null);
      setToastText(null);
      onClose();
    }, 1100);
  };

  const handleSwapProduct = (targetProduct: Product) => {
    if (swappingCol === 'A') {
      if (targetProduct.id === productB.id) {
        // Swap both
        setStoreProductA(productB);
        setStoreProductB(productA);
      } else {
        setStoreProductA(targetProduct);
      }
    } else if (swappingCol === 'B') {
      if (targetProduct.id === productA.id) {
        setStoreProductB(productA);
        setStoreProductA(productB);
      } else {
        setStoreProductB(targetProduct);
      }
    }
    setSwappingCol(null);
    setVariantSelectorId(null);
  };

  const specRows = resolveSpecMatrix(productA, productB);
  const verdict = generateAdvisorVerdict(productA, productB);

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
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000] px-5 py-3 rounded-xl bg-[#01142E] border border-[#3DE0FF] text-white text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check size={14} className="text-[#3DE0FF]" />
          <span>{toastText}</span>
        </div>
      )}

      <div
        className="relative w-full max-w-[1140px] max-h-[92vh] rounded-2xl sm:rounded-3xl border border-white/15 p-3.5 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden text-white"
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
              {verdict.headline}
            </h3>
            <p className="text-xs sm:text-[13px] text-white/75 leading-relaxed font-light">
              {verdict.summary}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 pt-2.5 sm:pt-3 border-t border-white/10 text-xs text-white/70">
              <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/5">
                <strong className="text-white block mb-0.5">{productA.name}:</strong>
                <span>{verdict.bestForA}</span>
              </div>
              <div className="bg-white/[0.02] p-2.5 sm:p-3 rounded-xl border border-white/5">
                <strong className="text-white block mb-0.5">{productB.name}:</strong>
                <span>{verdict.bestForB}</span>
              </div>
            </div>
          </div>

          {/* Products Header Row with Swappers */}
          <div className="compare-products-header-grid relative">
            <div className="text-[11px] font-bold tracking-[0.14em] uppercase text-white/40 mb-2 sm:mb-0">
              SPEC DIFF MATRIX
            </div>

            {/* Product Column A */}
            <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-2.5 sm:p-4 flex flex-col items-center text-center gap-2 sm:gap-2.5 shadow-sm min-w-0">
              {/* Change Piece Swapper Trigger */}
              <button
                type="button"
                onClick={() => setSwappingCol(swappingCol === 'A' ? null : 'A')}
                className="self-end text-[10px] sm:text-[11px] text-[#3DE0FF] hover:text-white flex items-center gap-1 py-1 px-2.5 rounded-full bg-[#3DE0FF]/10 hover:bg-[#3DE0FF]/25 border border-[#3DE0FF]/30 transition-all cursor-pointer"
                title="Swap this product for another piece"
              >
                <RefreshCw size={10} className="transition-transform duration-300" />
                <span>Change Piece</span>
              </button>

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

              {/* Variant Selector Drawer for Product A */}
              {variantSelectorId === productA.id ? (
                <div className="w-full bg-[#01142E] border border-[#3DE0FF]/40 rounded-xl p-2.5 text-left space-y-2 animate-fade-in shadow-xl">
                  {productA.sizes && productA.sizes.length > 1 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Select Size</div>
                      <div className="flex flex-wrap gap-1.5">
                        {productA.sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSizeMap((prev) => ({ ...prev, [productA.id]: s }))}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                              (selectedSizeMap[productA.id] || productA.sizes![0]) === s
                                ? 'bg-[#3DE0FF] text-[#000B1A] font-bold'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {productA.colors && productA.colors.length > 1 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Select Color</div>
                      <div className="flex flex-wrap gap-1.5">
                        {productA.colors.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setSelectedColorMap((prev) => ({ ...prev, [productA.id]: c.name }))}
                            className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1.5 transition-all cursor-pointer ${
                              (selectedColorMap[productA.id] || productA.colors![0].name) === c.name
                                ? 'bg-white/20 text-[#3DE0FF] border border-[#3DE0FF]/50'
                                : 'bg-white/5 text-white/70 hover:bg-white/15 border border-white/5'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: c.hex }} />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => executeAdd(productA)}
                      className="flex-1 py-1.5 rounded-lg bg-[#3DE0FF] hover:bg-[#6BE8FF] text-[#000B1A] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Check size={12} />
                      <span>Confirm & Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVariantSelectorId(null)}
                      className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleChooseClick(productA)}
                  className="w-full min-h-[38px] sm:min-h-[40px] py-2 px-1.5 sm:px-3 rounded-xl bg-[#3DE0FF] hover:bg-[#6BE8FF] text-[#000B1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-md whitespace-nowrap"
                >
                  {chosenId === productA.id ? <Check size={13} /> : <ShoppingBag size={13} />}
                  <span>{chosenId === productA.id ? 'Added!' : 'Choose This'}</span>
                </button>
              )}
            </div>

            {/* Product Column B */}
            <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-2.5 sm:p-4 flex flex-col items-center text-center gap-2 sm:gap-2.5 shadow-sm min-w-0">
              {/* Change Piece Swapper Trigger */}
              <button
                type="button"
                onClick={() => setSwappingCol(swappingCol === 'B' ? null : 'B')}
                className="self-end text-[10px] sm:text-[11px] text-[#3DE0FF] hover:text-white flex items-center gap-1 py-1 px-2.5 rounded-full bg-[#3DE0FF]/10 hover:bg-[#3DE0FF]/25 border border-[#3DE0FF]/30 transition-all cursor-pointer"
                title="Swap this product for another piece"
              >
                <RefreshCw size={10} className="transition-transform duration-300" />
                <span>Change Piece</span>
              </button>

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

              {/* Variant Selector Drawer for Product B */}
              {variantSelectorId === productB.id ? (
                <div className="w-full bg-[#01142E] border border-[#3DE0FF]/40 rounded-xl p-2.5 text-left space-y-2 animate-fade-in shadow-xl">
                  {productB.sizes && productB.sizes.length > 1 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Select Size</div>
                      <div className="flex flex-wrap gap-1.5">
                        {productB.sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSizeMap((prev) => ({ ...prev, [productB.id]: s }))}
                            className={`px-2 py-1 rounded text-[11px] font-semibold transition-all cursor-pointer ${
                              (selectedSizeMap[productB.id] || productB.sizes![0]) === s
                                ? 'bg-[#3DE0FF] text-[#000B1A] font-bold'
                                : 'bg-white/10 text-white/80 hover:bg-white/20'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {productB.colors && productB.colors.length > 1 && (
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1">Select Color</div>
                      <div className="flex flex-wrap gap-1.5">
                        {productB.colors.map((c) => (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => setSelectedColorMap((prev) => ({ ...prev, [productB.id]: c.name }))}
                            className={`px-2 py-0.5 rounded text-[10px] flex items-center gap-1.5 transition-all cursor-pointer ${
                              (selectedColorMap[productB.id] || productB.colors![0].name) === c.name
                                ? 'bg-white/20 text-[#3DE0FF] border border-[#3DE0FF]/50'
                                : 'bg-white/5 text-white/70 hover:bg-white/15 border border-white/5'
                            }`}
                          >
                            <span className="w-2.5 h-2.5 rounded-full border border-white/30" style={{ backgroundColor: c.hex }} />
                            <span>{c.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => executeAdd(productB)}
                      className="flex-1 py-1.5 rounded-lg bg-[#3DE0FF] hover:bg-[#6BE8FF] text-[#000B1A] text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all"
                    >
                      <Check size={12} />
                      <span>Confirm & Add</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setVariantSelectorId(null)}
                      className="py-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold cursor-pointer transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleChooseClick(productB)}
                  className="w-full min-h-[38px] sm:min-h-[40px] py-2 px-1.5 sm:px-3 rounded-xl bg-[#3DE0FF] hover:bg-[#6BE8FF] text-[#000B1A] text-[11px] sm:text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 sm:gap-2 transition-all transform hover:-translate-y-0.5 cursor-pointer shadow-md whitespace-nowrap"
                >
                  {chosenId === productB.id ? <Check size={13} /> : <ShoppingBag size={13} />}
                  <span>{chosenId === productB.id ? 'Added!' : 'Choose This'}</span>
                </button>
              )}
            </div>

            {/* Interactive Swapper Popover Overlay */}
            {swappingCol && (
              <div
                ref={popoverRef}
                className="absolute top-12 z-50 w-full max-w-sm rounded-2xl bg-[#01142E] border border-[#3DE0FF]/50 shadow-[0_20px_50px_rgba(0,0,0,0.9)] p-3 text-white space-y-2 animate-fade-in"
                style={{
                  left: swappingCol === 'A' ? '25%' : 'auto',
                  right: swappingCol === 'B' ? '0' : 'auto',
                }}
              >
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#3DE0FF]">
                    Select Replacement for Column {swappingCol}
                  </span>
                  <button
                    type="button"
                    onClick={() => setSwappingCol(null)}
                    className="text-white/60 hover:text-white cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="max-h-60 overflow-y-auto space-y-1.5 pr-1">
                  {MASTER_PRODUCTS.map((prod) => {
                    const isCurrentlySelected =
                      (swappingCol === 'A' && prod.id === productA.id) ||
                      (swappingCol === 'B' && prod.id === productB.id);

                    return (
                      <button
                        key={prod.id}
                        type="button"
                        onClick={() => handleSwapProduct(prod)}
                        disabled={isCurrentlySelected}
                        className={`w-full p-2 rounded-xl flex items-center gap-2.5 text-left transition-all cursor-pointer ${
                          isCurrentlySelected
                            ? 'opacity-40 bg-white/5 cursor-not-allowed'
                            : 'hover:bg-[#3DE0FF]/15 bg-white/[0.03] border border-white/5 hover:border-[#3DE0FF]/30'
                        }`}
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="w-10 h-10 object-contain rounded-lg bg-black/40 p-1 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white truncate">{prod.name}</div>
                          <div className="text-[10px] text-white/60 flex items-center gap-1.5">
                            <span>{prod.subCategory || prod.category}</span>
                            <span>•</span>
                            <span className="text-[#3DE0FF] font-semibold">{formatPrice(prod.price)}</span>
                          </div>
                        </div>
                        <ArrowRight size={12} className="text-white/40 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
