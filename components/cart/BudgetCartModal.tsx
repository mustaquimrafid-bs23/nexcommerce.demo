'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useCartStore } from '@/store/useCartStore';
import { useBudgetCartStore } from '@/store/useBudgetCartStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { Product } from '@/types/catalog';
import { formatPrice } from '@/lib/utils';

interface BudgetCartModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface BudgetSlotItem {
  id: string;
  name: string;
  shortName: string;
  price: number;
  image: string;
  category: string;
}

interface BudgetSlot {
  slotName: string;
  category: string;
  selectedItem: BudgetSlotItem;
  alternatives: BudgetSlotItem[];
}

// Canonical curated pool matching prototype catalog pieces
const CANONICAL_POOL: Record<string, BudgetSlotItem> = {
  p_blazer: {
    id: 'p2',
    name: 'Structured Wool Blazer',
    shortName: 'Wool Blazer',
    price: 245,
    image: '/assets/images/products/plp_blazer.png',
    category: 'Apparel',
  },
  p_cashmere_arch: {
    id: 'p1',
    name: 'Architectural Cashmere',
    shortName: 'Architectural Cashmere',
    price: 185,
    image: '/assets/images/products/hero_sweater.png',
    category: 'Apparel',
  },
  p_fine_knit: {
    id: 'p3',
    name: 'Fine-Knit Cashmere',
    shortName: 'Fine-Knit Cashmere',
    price: 160,
    image: '/assets/images/products/plp_crewneck.png',
    category: 'Apparel',
  },
  p_runner: {
    id: 'p6',
    name: 'Minimalist Leather Runner',
    shortName: 'Leather Runner',
    price: 195,
    image: '/assets/images/products/prod_runner.png',
    category: 'Footwear',
  },
  p_slipon: {
    id: 'p7',
    name: 'Atelier Suede Slip-On',
    shortName: 'Suede Slip-On',
    price: 175,
    image: '/assets/images/products/prod_runner.png',
    category: 'Footwear',
  },
  p_watch: {
    id: 'p8',
    name: 'Chronograph Minimalist Watch',
    shortName: 'Titanium Watch',
    price: 285,
    image: '/assets/images/products/search_watch.png',
    category: 'Accessories',
  },
  p_headphones: {
    id: 'p4',
    name: 'Studio Acoustics Headphone GT',
    shortName: 'Acoustics GT',
    price: 320,
    image: '/assets/images/products/prod_headphones.png',
    category: 'Acoustics',
  },
};

export function BudgetCartModal({ isOpen: propIsOpen, onClose: propOnClose }: BudgetCartModalProps) {
  const pathname = usePathname();
  const storeIsOpen = useBudgetCartStore((state) => state.isOpen);
  const storeTargetBudget = useBudgetCartStore((state) => state.targetBudget);
  const storeOccasionTheme = useBudgetCartStore((state) => state.occasionTheme);
  const closeBudget = useBudgetCartStore((state) => state.closeBudget);

  const isOpen = propIsOpen !== undefined ? propIsOpen : storeIsOpen;
  const handleClose = propOnClose || closeBudget;

  const [mounted, setMounted] = useState(false);
  const [targetBudget, setTargetBudget] = useState<number>(500);
  const [selectedTheme, setSelectedTheme] = useState<string>('autumn');
  const [slotOverrides, setSlotOverrides] = useState<Record<number, BudgetSlotItem>>({});
  const [successToast, setSuccessToast] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync state when store updates
  useEffect(() => {
    if (storeTargetBudget) {
      setTargetBudget(storeTargetBudget);
      setSelectedTheme(storeOccasionTheme || 'autumn');
      setSlotOverrides({});
    }
  }, [storeTargetBudget, storeOccasionTheme]);

  const addItem = useCartStore((state) => state.addItem);

  // Pre-configured preset compositions strictly matching prototype
  const presetConfig = useMemo(() => {
    if (targetBudget === 300) {
      return {
        target: 300,
        slots: [
          {
            slotName: 'CORE STATEMENT PIECE',
            category: 'Apparel',
            selectedItem: CANONICAL_POOL.p_fine_knit,
            alternatives: [CANONICAL_POOL.p_cashmere_arch],
          },
          {
            slotName: 'LAYERING / FOOTWEAR PIECE',
            category: 'Footwear',
            selectedItem: { ...CANONICAL_POOL.p_slipon, price: 135 },
            alternatives: [CANONICAL_POOL.p_runner],
          },
        ],
      };
    } else if (targetBudget === 750) {
      return {
        target: 750,
        slots: [
          {
            slotName: 'CORE STATEMENT PIECE',
            category: 'Apparel',
            selectedItem: CANONICAL_POOL.p_blazer,
            alternatives: [CANONICAL_POOL.p_cashmere_arch],
          },
          {
            slotName: 'LAYERING / FOOTWEAR PIECE',
            category: 'Footwear',
            selectedItem: CANONICAL_POOL.p_runner,
            alternatives: [CANONICAL_POOL.p_slipon],
          },
          {
            slotName: 'FINISHING ESSENTIAL',
            category: 'Accessories',
            selectedItem: CANONICAL_POOL.p_watch,
            alternatives: [CANONICAL_POOL.p_headphones],
          },
        ],
      };
    }

    // Default: € 500 Autumn Wardrobe (Exact prototype composition: Blazer € 245 + Runner € 195 = € 440)
    return {
      target: 500,
      slots: [
        {
          slotName: 'CORE STATEMENT PIECE',
          category: 'Apparel',
          selectedItem: CANONICAL_POOL.p_blazer,
          alternatives: [CANONICAL_POOL.p_cashmere_arch, CANONICAL_POOL.p_fine_knit],
        },
        {
          slotName: 'LAYERING / FOOTWEAR PIECE',
          category: 'Footwear',
          selectedItem: CANONICAL_POOL.p_runner,
          alternatives: [],
        },
      ],
    };
  }, [targetBudget]);

  // Compute active slots with any live item swaps applied
  const resolvedSlots = useMemo(() => {
    return presetConfig.slots.map((slot, idx) => {
      if (slotOverrides[idx]) {
        return {
          ...slot,
          selectedItem: slotOverrides[idx],
        };
      }
      return slot;
    });
  }, [presetConfig, slotOverrides]);

  const totalPrice = useMemo(() => {
    return resolvedSlots.reduce((sum, s) => sum + s.selectedItem.price, 0);
  }, [resolvedSlots]);

  const headroom = Math.max(0, presetConfig.target - totalPrice);
  const utilizationPercent = Math.min(100, Math.round((totalPrice / presetConfig.target) * 100));

  // Keyboard Escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen || !mounted || (propIsOpen === undefined && pathname === '/cart')) return null;

  const handleSelectPreset = (amount: number, theme: string) => {
    setTargetBudget(amount);
    setSelectedTheme(theme);
    setSlotOverrides({});
  };

  const handleSwapItem = (slotIndex: number, alternative: BudgetSlotItem) => {
    setSlotOverrides((prev) => ({
      ...prev,
      [slotIndex]: alternative,
    }));
  };

  const handleAddEntireBasket = () => {
    resolvedSlots.forEach((slot) => {
      // Find matching catalog product or build product object
      const catalogItem = MASTER_PRODUCTS.find((p) => p.id === slot.selectedItem.id) || {
        id: slot.selectedItem.id,
        name: slot.selectedItem.name,
        brand: 'Arc',
        category: slot.selectedItem.category.toLowerCase(),
        subCategory: slot.slotName,
        price: slot.selectedItem.price,
        formattedPrice: `€ ${slot.selectedItem.price.toFixed(2)}`,
        currency: 'EUR',
        description: slot.selectedItem.name,
        image: slot.selectedItem.image,
        isNew: false,
        gallery: [slot.selectedItem.image],
        sizes: ['M'],
        colors: [{ name: 'Default', hex: '#1E293B', img: slot.selectedItem.image }],
        rating: 4.9,
        inStock: true,
        origin: 'Milan, Italy',
        reasoning: 'Curated for optimal wardrobe synergy and spending limit efficiency.',
        tags: [slot.selectedItem.category.toLowerCase()],
      };

      addItem(catalogItem as Product, 'Standard', undefined, 1);
    });

    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      handleClose();
    }, 1200);
  };

  return createPortal(
    <div
      id="budgetModalBackdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Target-Budget Cart Builder"
    >
      <div
        className="w-full max-w-4xl bg-[#020D20] bg-[radial-gradient(120%_90%_at_50%_0%,#032552_0%,#020D20_50%,#010915_100%)] border border-white/10 rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(3,37,82,0.35)] overflow-hidden flex flex-col max-h-[92vh] text-[#F8FAFF] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Brand Glow */}
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-[#3DE0FF]/5 rounded-full blur-3xl pointer-events-none" />

        {/* ─── Modal Header ─── */}
        <div className="flex items-start justify-between px-6 sm:px-8 pt-6 sm:pt-7 pb-4 border-b border-white/[0.08] relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.16em] uppercase text-[#3DE0FF]">
                ✨ SMART · BUDGET BUILDER
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-serif text-white tracking-tight font-normal">
              Build Your Perfect Basket
            </h2>
          </div>

          <button
            id="budgetModalCloseBtn"
            type="button"
            onClick={handleClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer shrink-0 ml-4"
            aria-label="Close budget builder"
          >
            <X size={18} />
          </button>
        </div>

        {/* ─── Modal Body ─── */}
        <div
          id="budgetModalBody"
          className="p-6 sm:p-8 space-y-6 overflow-y-auto relative z-10"
          data-lenis-prevent
        >
          {/* Target Budget Presets Cluster */}
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2.5">
              TARGET BUDGET PRESET:
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleSelectPreset(300, 'essentials')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  targetBudget === 300
                    ? 'border border-[#10B981] bg-[#021f1d] text-[#10B981] font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>⚡ € 300 Essentials</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(500, 'autumn')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  targetBudget === 500
                    ? 'border border-[#10B981] bg-[#021f1d] text-[#10B981] font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>🍂 € 500 Autumn Wardrobe</span>
              </button>

              <button
                type="button"
                onClick={() => handleSelectPreset(750, 'luxury')}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all cursor-pointer flex items-center gap-1.5 ${
                  targetBudget === 750
                    ? 'border border-[#10B981] bg-[#021f1d] text-[#10B981] font-bold shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                    : 'border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span>💎 € 750 Luxury Atelier Trio</span>
              </button>
            </div>
          </div>

          {/* Real-Time Telemetry Bar Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-[#031326]/90 border border-white/10 space-y-3.5 shadow-inner">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-white/40 block">
                  CALCULATED BASKET TOTAL
                </span>
                <div className="text-2xl sm:text-3xl font-bold text-[#00F5A0] tabular-nums mt-0.5 tracking-tight font-mono">
                  € {totalPrice.toFixed(2)}
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-white/50 font-medium block">
                  Cap: € {presetConfig.target.toFixed(2)}
                </span>
                <div className="inline-block mt-1 px-3 py-1 rounded-lg bg-[#02221b] border border-[#10B981]/40 text-[#10B981] text-xs font-bold font-mono shadow-[0_0_12px_rgba(16,185,129,0.15)]">
                  +€ {headroom.toFixed(2)} Headroom Remaining
                </div>
              </div>
            </div>

            {/* Telemetry Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#00F5A0] via-[#3DE0FF] to-[#00F5A0] transition-all duration-300 rounded-full shadow-[0_0_14px_rgba(0,245,160,0.4)]"
                style={{ width: `${utilizationPercent}%` }}
              />
            </div>

            {/* Telemetry Footnote */}
            <div className="text-xs text-white/70 flex items-center gap-1.5 pt-0.5">
              <span>🎯</span>
              <span>
                <strong className="text-white font-semibold">{utilizationPercent}% budget efficiency</strong> · {resolvedSlots.length} curated pieces selected.
              </span>
            </div>
          </div>

          {/* Curated Slot Composition Grid */}
          <div>
            <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-white/40 mb-3">
              YOUR SELECTION:
            </div>

            <div className={`grid grid-cols-1 ${resolvedSlots.length > 2 ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
              {resolvedSlots.map((slot, sIdx) => {
                const item = slot.selectedItem;
                return (
                  <div
                    key={sIdx}
                    className="p-4 rounded-xl bg-[#04162e]/70 border border-white/10 flex flex-col justify-between gap-3.5 transition-all hover:border-white/20 shadow-md"
                  >
                    {/* Slot Header */}
                    <div className="flex items-center justify-between border-b border-white/[0.06] pb-2 text-[10px]">
                      <span className="font-bold tracking-wider text-white/50 uppercase">
                        {slot.slotName}
                      </span>
                      <span className="text-white/40 font-medium">
                        {slot.category}
                      </span>
                    </div>

                    {/* Slot Item Main Info */}
                    <div className="flex items-center gap-3.5 py-1">
                      <div className="w-14 h-14 rounded-lg bg-[#020b17] border border-white/10 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-inner">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-semibold text-white truncate leading-snug">
                          {item.name}
                        </h4>
                        <div className="text-sm font-bold text-[#00F5A0] tabular-nums font-mono mt-0.5">
                          € {item.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    {/* Live Alternatives Swapper */}
                    {slot.alternatives && slot.alternatives.length > 0 ? (
                      <div className="pt-2 border-t border-white/[0.06] flex items-center gap-1.5 flex-wrap">
                        <span className="text-[9px] uppercase font-bold text-white/35 mr-1">
                          OR:
                        </span>
                        {slot.alternatives.map((alt) => (
                          <button
                            key={alt.id}
                            type="button"
                            onClick={() => handleSwapItem(sIdx, alt)}
                            className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-white/80 hover:text-white transition-colors cursor-pointer"
                            title={`Swap for ${alt.name} (€ ${alt.price.toFixed(2)})`}
                          >
                            <span>{alt.shortName}</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="h-4" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── Modal Footer ─── */}
        <div className="px-6 sm:px-8 py-4 sm:py-5 border-t border-white/[0.08] bg-[#020d22]/90 flex items-center justify-between gap-4 relative z-10">
          <div id="budgetFooterSummary" className="text-xs sm:text-sm text-white/70">
            Total: <strong className="text-[#00F5A0] font-bold font-mono">€ {totalPrice.toFixed(2)}</strong> ({resolvedSlots.length} pieces)
          </div>

          <button
            type="button"
            id="budgetBatchAddBtn"
            onClick={handleAddEntireBasket}
            className="px-6 py-3 rounded-xl bg-[#00F5A0] hover:bg-[#00DF90] text-[#020B16] font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-[#00F5A0]/25 transition-all active:scale-95 cursor-pointer"
          >
            {successToast ? (
              <>
                <Check size={15} className="text-[#020B16] stroke-[2.5]" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} className="text-[#020B16]" />
                <span>Add Entire Basket to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
