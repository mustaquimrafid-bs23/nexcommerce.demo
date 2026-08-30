'use client';

import React, { useState, useMemo } from 'react';
import { X, Sparkles, Sliders, Check, Plus, RefreshCw, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { MASTER_PRODUCTS } from '@/data/products';
import { Product } from '@/types/catalog';
import { formatPrice } from '@/lib/utils';

interface BudgetCartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BudgetSlot {
  slotName: string;
  category: string;
  selectedItem: Product;
  alternatives: Product[];
}

export function BudgetCartModal({ isOpen, onClose }: BudgetCartModalProps) {
  const [targetBudget, setTargetBudget] = useState<number>(500);
  const [selectedTheme, setSelectedTheme] = useState<string>('autumn');
  const [slotOverrides, setSlotOverrides] = useState<Record<number, string>>({});
  const [successToast, setSuccessToast] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  // Compute best basket items based on targetBudget and theme
  const basket = useMemo(() => {
    // Filter candidate products
    const candidates = MASTER_PRODUCTS.filter((p) => p.inStock !== false);

    let slots: BudgetSlot[] = [];

    if (targetBudget < 350) {
      // Essentials (2 pieces)
      const topPiece = candidates.find((p) => p.category === 'apparel' && p.price <= 200) || candidates[0];
      const accPiece = candidates.find((p) => (p.category === 'accessories' || p.category === 'footwear') && p.price <= targetBudget - topPiece.price) || candidates[4];
      
      const topAlts = candidates.filter((p) => p.category === 'apparel' && p.id !== topPiece.id).slice(0, 2);
      const accAlts = candidates.filter((p) => p.category === 'accessories' && p.id !== accPiece.id).slice(0, 2);

      slots = [
        { slotName: 'Core Topwear', category: 'Apparel', selectedItem: topPiece, alternatives: topAlts },
        { slotName: 'Accent Piece', category: 'Accessories', selectedItem: accPiece, alternatives: accAlts },
      ];
    } else if (targetBudget < 650) {
      // Autumn Look (3 pieces)
      const coatPiece = candidates.find((p) => p.name.includes('Overcoat') || p.name.includes('Blazer')) || candidates[1];
      const knitPiece = candidates.find((p) => p.name.includes('Sweater') || p.name.includes('Crew')) || candidates[0];
      const footPiece = candidates.find((p) => p.category === 'footwear' || p.category === 'accessories') || candidates[5];

      const coatAlts = candidates.filter((p) => p.category === 'apparel' && p.id !== coatPiece.id).slice(0, 2);
      const knitAlts = candidates.filter((p) => p.category === 'apparel' && p.id !== knitPiece.id).slice(0, 2);
      const footAlts = candidates.filter((p) => (p.category === 'footwear' || p.category === 'accessories') && p.id !== footPiece.id).slice(0, 2);

      slots = [
        { slotName: 'Outer Layer', category: 'Tailoring', selectedItem: coatPiece, alternatives: coatAlts },
        { slotName: 'Thermal Knit', category: 'Knitwear', selectedItem: knitPiece, alternatives: knitAlts },
        { slotName: 'Footwear & Craft', category: 'Footwear', selectedItem: footPiece, alternatives: footAlts },
      ];
    } else {
      // Luxury Atelier Trio (3-4 pieces)
      const headPiece = candidates.find((p) => p.category === 'acoustics') || candidates[3];
      const watchPiece = candidates.find((p) => p.name.includes('Watch') || p.name.includes('Titanium')) || candidates[4];
      const totePiece = candidates.find((p) => p.name.includes('Tote') || p.name.includes('Weekender')) || candidates[2];

      const headAlts = candidates.filter((p) => p.category === 'acoustics' && p.id !== headPiece.id).slice(0, 2);
      const watchAlts = candidates.filter((p) => p.category === 'accessories' && p.id !== watchPiece.id).slice(0, 2);
      const toteAlts = candidates.filter((p) => p.id !== totePiece.id).slice(0, 2);

      slots = [
        { slotName: 'Acoustic Fidelity', category: 'High Acoustics', selectedItem: headPiece, alternatives: headAlts },
        { slotName: 'Precision Horology', category: 'Horology', selectedItem: watchPiece, alternatives: watchAlts },
        { slotName: 'Leather Craft', category: 'Leather Goods', selectedItem: totePiece, alternatives: toteAlts },
      ];
    }

    // Apply any active user overrides
    const resolvedSlots = slots.map((slot, index) => {
      const overrideId = slotOverrides[index];
      if (overrideId) {
        const found = candidates.find((c) => c.id === overrideId);
        if (found) {
          return {
            ...slot,
            selectedItem: found,
          };
        }
      }
      return slot;
    });

    const totalPrice = resolvedSlots.reduce((sum, s) => sum + s.selectedItem.price, 0);
    const headroom = Math.max(0, targetBudget - totalPrice);
    const utilizationPercent = Math.min(100, Math.round((totalPrice / targetBudget) * 100));

    return {
      slots: resolvedSlots,
      totalPrice,
      headroom,
      utilizationPercent,
    };
  }, [targetBudget, slotOverrides]);

  if (!isOpen) return null;

  const handleSwapItem = (slotIndex: number, newProductId: string) => {
    setSlotOverrides((prev) => ({
      ...prev,
      [slotIndex]: newProductId,
    }));
  };

  const handleAddEntireLook = () => {
    basket.slots.forEach((slot) => {
      addItem(slot.selectedItem, 'Standard', undefined, 1);
    });
    setSuccessToast(true);
    setTimeout(() => {
      setSuccessToast(false);
      onClose();
    }, 1200);
  };

  const handlePresetSelect = (budget: number, theme: string) => {
    setTargetBudget(budget);
    setSelectedTheme(theme);
    setSlotOverrides({});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div
        className="w-full max-w-2xl bg-obsidian-950 border border-accent-cyan/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] text-white"
        role="dialog"
        aria-modal="true"
        aria-label="Smart Budget Builder"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-surface-navy/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan/15 border border-accent-cyan/30 flex items-center justify-center text-accent-cyan">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="text-base font-editorial text-white font-medium">Smart Budget Builder</h3>
              <p className="text-[11px] text-white/50">Plan and assemble a complete look within your chosen spending limit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-colors"
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 overflow-y-auto" data-lenis-prevent>
          {/* Target Budget Slider & Presets */}
          <div className="space-y-3 p-4 rounded-xl bg-surface-navy/30 border border-white/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-white/70 font-semibold uppercase tracking-wider text-[10px]">
                Target Spending Limit
              </span>
              <span className="text-lg font-bold text-accent-cyan tabular-nums font-mono">
                {formatPrice(targetBudget)}
              </span>
            </div>

            <input
              type="range"
              min={250}
              max={1200}
              step={25}
              value={targetBudget}
              onChange={(e) => {
                setTargetBudget(Number(e.target.value));
                setSlotOverrides({});
              }}
              className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => handlePresetSelect(300, 'essentials')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  targetBudget === 300
                    ? 'bg-accent-cyan text-obsidian-950 shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                ⚡ &euro; 300 Essentials
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect(500, 'autumn')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  targetBudget === 500
                    ? 'bg-accent-cyan text-obsidian-950 shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                🍂 &euro; 500 Autumn Look
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect(750, 'luxury')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                  targetBudget === 750
                    ? 'bg-accent-cyan text-obsidian-950 shadow-md'
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
              >
                💎 &euro; 750 Luxury Trio
              </button>
            </div>
          </div>

          {/* Real-time Telemetry Bar */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-surface-navy/60 to-black/40 border border-white/10 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Calculated Total</span>
                <div className="text-lg font-bold text-white tabular-nums font-mono">
                  {formatPrice(basket.totalPrice)}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-white/50 uppercase font-semibold">Remaining Headroom</span>
                <div className="text-xs font-bold text-emerald-400 font-mono">
                  +{formatPrice(basket.headroom)}
                </div>
              </div>
            </div>

            {/* Utilization Progress Bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-cyan to-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${basket.utilizationPercent}%` }}
              />
            </div>

            <div className="text-[11px] text-white/60">
              🎯 <strong>{basket.utilizationPercent}% of budget used</strong> &middot; {basket.slots.length} curated pieces selected.
            </div>
          </div>

          {/* Curated Item Slots */}
          <div className="space-y-3">
            <div className="text-[10px] uppercase font-bold text-white/50 tracking-wider">
              Selected Pieces in Look
            </div>

            <div className="grid grid-cols-1 gap-3">
              {basket.slots.map((slot, sIdx) => {
                const item = slot.selectedItem;
                return (
                  <div
                    key={sIdx}
                    className="p-3.5 rounded-xl bg-surface-navy/35 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-14 h-14 rounded-lg object-contain bg-white/5 p-1 border border-white/10"
                      />
                      <div>
                        <div className="text-[10px] uppercase font-bold text-accent-cyan tracking-wider">
                          {slot.slotName} &middot; {item.category}
                        </div>
                        <div className="text-xs font-semibold text-white">{item.name}</div>
                        <div className="text-xs font-bold text-emerald-400 tabular-nums">
                          {formatPrice(item.price)}
                        </div>
                      </div>
                    </div>

                    {/* Alternatives Swap Chips */}
                    {slot.alternatives.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] text-white/40 font-semibold uppercase">Or:</span>
                        {slot.alternatives.map((alt) => (
                          <button
                            key={alt.id}
                            type="button"
                            onClick={() => handleSwapItem(sIdx, alt.id)}
                            className="px-2 py-1 rounded bg-white/5 hover:bg-white/15 border border-white/10 text-[10px] text-white/80 transition-colors flex items-center gap-1"
                            title={`Switch to ${alt.name} (${formatPrice(alt.price)})`}
                          >
                            <RefreshCw size={10} />
                            <span>{alt.name.split(' ').slice(0, 2).join(' ')}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-surface-navy/60 flex items-center justify-between gap-4">
          <div className="text-xs text-white/70">
            Look Total: <strong className="text-emerald-400 font-bold text-sm">{formatPrice(basket.totalPrice)}</strong>
          </div>

          <button
            type="button"
            onClick={handleAddEntireLook}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-accent-cyan to-emerald-400 hover:from-accent-cyan/90 hover:to-emerald-300 text-obsidian-950 font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-accent-cyan/20 transition-all active:scale-95"
          >
            {successToast ? (
              <>
                <Check size={14} className="text-obsidian-950" />
                <span>Added to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add Entire Look to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
