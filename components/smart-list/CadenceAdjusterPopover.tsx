'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Clock, X, Check } from 'lucide-react';

export interface CadenceOption {
  days: number;
  label: string;
  sublabel: string;
}

const CADENCE_OPTIONS: CadenceOption[] = [
  { days: 30, label: 'Every 30 Days', sublabel: 'Monthly Baseline Delivery' },
  { days: 60, label: 'Every 60 Days', sublabel: 'Bi-Monthly Rotation' },
  { days: 90, label: 'Every 90 Days', sublabel: 'Quarterly Wardrobe Refresh' },
  { days: 180, label: 'Every 180 Days', sublabel: 'Seasonal Replenishment' },
];

interface CadenceAdjusterPopoverProps {
  productId: string;
  productName: string;
  initialDays?: number;
  onCadenceChange?: (days: number) => void;
}

export function CadenceAdjusterPopover({
  productId,
  productName,
  initialDays = 30,
  onCadenceChange,
}: CadenceAdjusterPopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDays, setSelectedDays] = useState(initialDays);
  const [savedDays, setSavedDays] = useState(initialDays);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem('nex_sl_cadence');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed[productId]) {
          setSelectedDays(parsed[productId]);
          setSavedDays(parsed[productId]);
        }
      }
    } catch (_) {}
  }, [productId]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setSelectedDays(savedDays);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = () => {
    setSavedDays(selectedDays);
    onCadenceChange?.(selectedDays);
    try {
      const stored = localStorage.getItem('nex_sl_cadence');
      const parsed = stored ? JSON.parse(stored) : {};
      parsed[productId] = selectedDays;
      localStorage.setItem('nex_sl_cadence', JSON.stringify(parsed));
    } catch (_) {}
    setIsOpen(false);
  };

  const getBadgeLabel = (days: number) => {
    if (days === 30) return 'Every 30d';
    if (days === 60) return 'Every 60d';
    if (days === 90) return 'Every 90d';
    if (days === 180) return 'Every 180d';
    return `Every ${days}d`;
  };

  return (
    <>
      {/* Trigger Badge */}
      <button
        type="button"
        data-cadence-trigger={productId}
        onClick={handleOpen}
        className="text-[9.5px] font-mono font-semibold px-2 py-0.5 rounded-full bg-accent-cyan/10 hover:bg-accent-cyan/20 border border-accent-cyan/25 hover:border-accent-cyan/50 text-accent-cyan transition-all flex items-center gap-1 cursor-pointer"
        title="Click to adjust smart replenishment schedule"
      >
        <Clock size={10} />
        <span>{getBadgeLabel(savedDays)}</span>
      </button>

      {/* Modal Dialog */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            id="slCadenceModal"
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md animate-in fade-in duration-200"
            onClick={handleClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="slCadenceTitle"
          >
            <div
              className="relative w-full max-w-md bg-obsidian-900 border border-white/20 rounded-2xl p-6 sm:p-7 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-accent-cyan">
                    AUTOMATIC REPLENISHMENT
                  </span>
                  <h3 id="slCadenceTitle" className="font-editorial text-xl font-normal text-white">
                    Repurchase Schedule
                  </h3>
                </div>
                <button
                  type="button"
                  id="slCadenceCloseBtn"
                  onClick={handleClose}
                  className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  aria-label="Close dialog"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Product Subtitle */}
              <p className="text-xs text-white/70 italic leading-relaxed">
                Adjust delivery cadence for <strong>{productName}</strong>.
              </p>

              {/* Interval Options */}
              <div className="space-y-2.5" role="radiogroup" aria-label="Cadence options">
                {CADENCE_OPTIONS.map((opt) => {
                  const isSelected = selectedDays === opt.days;
                  return (
                    <div
                      key={opt.days}
                      onClick={() => setSelectedDays(opt.days)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-accent-cyan/15 border-accent-cyan shadow-[0_0_15px_rgba(61,224,255,0.15)] text-white'
                          : 'bg-surface-navy/40 border-white/10 hover:border-white/25 text-white/80 hover:text-white'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <strong className="text-xs font-semibold block">{opt.label}</strong>
                        <span className="text-[11px] text-white/50 block">{opt.sublabel}</span>
                      </div>
                      <span
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-accent-cyan border-accent-cyan text-obsidian-950'
                            : 'border-white/20 text-transparent'
                        }`}
                      >
                        <Check size={12} strokeWidth={3} />
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  id="slCadenceCancelBtn"
                  onClick={handleClose}
                  className="px-4 py-2.5 rounded-xl text-white/60 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  id="slCadenceSaveBtn"
                  onClick={handleSave}
                  className="px-6 py-2.5 rounded-xl bg-accent-cyan hover:bg-accent-cyan/90 text-obsidian-950 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg active:scale-95"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
