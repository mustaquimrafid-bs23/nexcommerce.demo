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
  const safeH = Math.max(120, Math.min(230, height || 178));
  const safeW = Math.max(35, Math.min(160, weight || 72));
  const bmi = safeW / ((safeH / 100) * (safeH / 100));
  const confidence = Math.min(98, Math.max(88, Math.round(98 - Math.abs(22 - bmi) * 1.4)));

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
                <h3 className="font-editorial text-xl font-normal text-white">
                  Find Your Size
                </h3>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close size advisor"
                className="p-1.5 rounded-full text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Sliders: Height and Weight */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="fitHeightInput" className="text-white/70">
                    Height
                  </label>
                  <span className="font-mono text-accent-cyan font-semibold">
                    {height} cm
                  </span>
                </div>
                <input
                  id="fitHeightInput"
                  type="range"
                  min="150"
                  max="210"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  className="w-full accent-accent-cyan cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <label htmlFor="fitWeightInput" className="text-white/70">
                    Weight
                  </label>
                  <span className="font-mono text-accent-cyan font-semibold">
                    {weight} kg
                  </span>
                </div>
                <input
                  id="fitWeightInput"
                  type="range"
                  min="45"
                  max="130"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full accent-accent-cyan cursor-pointer"
                />
              </div>
            </div>

            {/* Fit Preference Chips */}
            <div className="space-y-2">
              <span className="text-xs text-white/70 block">Preferred Silhouette</span>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Preferred Silhouette">
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
                <span className="text-[11px] text-accent-cyan font-mono font-semibold bg-accent-cyan/10 px-2 py-0.5 rounded-full border border-accent-cyan/20">
                  {confidence}% Confidence
                </span>
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
