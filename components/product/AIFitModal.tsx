'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Sparkles, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  availableSizes?: string[];
}

export function AIFitModal({
  isOpen,
  onClose,
  onSelectSize,
  availableSizes = ['XS', 'S', 'M', 'L', 'XL'],
}: AIFitModalProps) {
  const [mounted, setMounted] = useState(false);
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(74);
  const [fitPref, setFitPref] = useState<'Tailored' | 'Regular' | 'Relaxed'>('Regular');

  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle escape key and body scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
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

  // Compute recommended size based on BMI and drape preference
  const calculateRecommendation = () => {
    const safeH = Math.max(120, Math.min(230, height || 178));
    const safeW = Math.max(35, Math.min(160, weight || 72));
    const bmi = safeW / ((safeH / 100) * (safeH / 100));

    let rec = 'M';
    if (bmi < 20) {
      rec = fitPref === 'Relaxed' ? 'M' : 'S';
      if (bmi < 18.5 && fitPref === 'Tailored') rec = 'XS';
    } else if (bmi >= 20 && bmi < 24) {
      if (fitPref === 'Tailored') rec = 'S';
      else if (fitPref === 'Relaxed') rec = 'L';
      else rec = 'M';
    } else if (bmi >= 24 && bmi < 27) {
      if (fitPref === 'Tailored') rec = 'M';
      else if (fitPref === 'Relaxed') rec = 'XL';
      else rec = 'L';
    } else {
      rec = fitPref === 'Tailored' ? 'L' : 'XL';
    }

    if (availableSizes.length > 0 && !availableSizes.includes(rec)) {
      rec = availableSizes.includes('M') ? 'M' : availableSizes[0];
    }
    return rec;
  };

  const recSize = calculateRecommendation();

  const handleApply = () => {
    onSelectSize(recSize);
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          id="pdpFitModal"
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-label="Find My Size"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#010610]/80 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-md rounded-2xl bg-[#08101E] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl z-10 my-auto"
          >
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
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close size finder"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-white/60 font-light leading-relaxed">
              We will recommend your ideal size based on your height, weight, and preferred fit.
            </p>

            {/* Numeric Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="fitInputHeight"
                  className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block"
                >
                  Height (cm)
                </label>
                <input
                  id="fitInputHeight"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min="140"
                  max="220"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:border-accent-cyan/60 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="fitInputWeight"
                  className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block"
                >
                  Weight (kg)
                </label>
                <input
                  id="fitInputWeight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min="40"
                  max="150"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:border-accent-cyan/60 transition-colors"
                />
              </div>
            </div>

            {/* Fit Preference Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block">
                How do you like it to fit?
              </label>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Fit preference">
                {(['Tailored', 'Regular', 'Relaxed'] as const).map((pref) => {
                  const isSelected = fitPref === pref;
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setFitPref(pref)}
                      role="radio"
                      aria-checked={isSelected}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-white text-[#020B18] border-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recommended Size Card */}
            <motion.div
              layout
              className="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/25 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
                  Recommended Size
                </span>
                <span className="text-[11px] text-white/50 font-mono">Best match</span>
              </div>
              <motion.div
                key={recSize}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                className="font-editorial text-4xl text-white font-normal tabular-nums"
              >
                {recSize}
              </motion.div>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Based on {height}cm / {weight}kg with {fitPref.toLowerCase()} fit, size{' '}
                <strong className="text-white font-semibold">{recSize}</strong> provides a comfortable
                fit across the shoulders and chest.
              </p>
            </motion.div>

            {/* Apply Button */}
            <button
              id="btnUseRecSize"
              type="button"
              onClick={handleApply}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-white/90 text-[#020B18] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.99]"
            >
              Select Size {recSize} &amp; Apply
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
