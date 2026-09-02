'use client';

import React, { useState } from 'react';
import { Sparkles, X, Check } from 'lucide-react';

interface AIFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  availableSizes?: string[];
}

export function AIFitModal({ isOpen, onClose, onSelectSize, availableSizes = ['S', 'M', 'L', 'XL'] }: AIFitModalProps) {
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(74);
  const [fitPref, setFitPref] = useState<'Tailored' | 'Regular' | 'Relaxed'>('Regular');

  if (!isOpen) return null;

  // Compute recommended size based on BMI and drape preference
  const bmi = weight / ((height / 100) * (height / 100));
  let recSize = 'M';
  if (bmi < 21) {
    recSize = fitPref === 'Relaxed' ? 'M' : 'S';
  } else if (bmi >= 21 && bmi < 25) {
    if (fitPref === 'Tailored') recSize = 'M';
    else if (fitPref === 'Relaxed') recSize = 'L';
    else recSize = 'M';
  } else if (bmi >= 25 && bmi < 28) {
    recSize = fitPref === 'Tailored' ? 'M' : 'L';
  } else {
    recSize = fitPref === 'Tailored' ? 'L' : 'XL';
  }

  // Ensure size is within available sizes
  if (!availableSizes.includes(recSize) && availableSizes.length > 0) {
    recSize = availableSizes[0];
  }

  const handleApply = () => {
    onSelectSize(recSize);
    onClose();
  };

  return (
    <div
      id="pdpFitModal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label="Smart Fit & Size Consultation"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-surface-card border border-white/15 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-accent-cyan" />
            <h2 className="font-editorial text-2xl text-white font-normal">Find My Size</h2>
          </div>
          <button
            id="btnCloseFitModal"
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-white/60 font-light leading-relaxed">
          We'll recommend your optimal atelier size based on your height, weight, and silhouette ease.
        </p>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
              Height (cm)
            </label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              min="140"
              max="220"
              className="w-full px-4 py-2.5 rounded-2xl bg-obsidian-950/80 border border-white/15 text-white text-sm outline-none focus:border-accent-cyan/60"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
              Weight (kg)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min="40"
              max="150"
              className="w-full px-4 py-2.5 rounded-2xl bg-obsidian-950/80 border border-white/15 text-white text-sm outline-none focus:border-accent-cyan/60"
            />
          </div>
        </div>

        {/* Fit Preference */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/70 block">
            How do you like it to fit?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['Tailored', 'Regular', 'Relaxed'] as const).map((pref) => (
              <button
                key={pref}
                type="button"
                onClick={() => setFitPref(pref)}
                className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                  fitPref === pref
                    ? 'bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-sm'
                    : 'bg-obsidian-950/60 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Recommendation Card */}
        <div className="p-4 rounded-2xl bg-obsidian-950/80 border border-accent-pink/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-pink">
              Recommended Size
            </span>
            <span className="font-mono text-xs text-accent-cyan">98% Anatomical Match</span>
          </div>
          <div className="font-editorial text-4xl text-white font-normal">{recSize}</div>
          <p className="text-xs text-white/60 font-light leading-relaxed">
            Based on {height}cm / {weight}kg with {fitPref} drape preference, size{' '}
            <strong className="text-white font-semibold">{recSize}</strong> provides a balanced shoulder drape.
          </p>
        </div>

        {/* Apply Button */}
        <button
          id="btnUseRecSize"
          type="button"
          onClick={handleApply}
          className="w-full py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-accent-crimson/20"
        >
          Select Size {recSize} &amp; Apply
        </button>
      </div>
    </div>
  );
}
