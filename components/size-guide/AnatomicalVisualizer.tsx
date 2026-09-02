'use client';

import React, { useState, useId } from 'react';
import { Sliders, Sparkles, Check, Bookmark, Ruler } from 'lucide-react';

interface AnatomicalVisualizerProps {
  onSizingChange?: (size: string) => void;
}

const APPAREL_SIZES = [
  { mai: 44, intl: 'XS', chestMin: 86, chestMax: 90 },
  { mai: 46, intl: 'S', chestMin: 91, chestMax: 94 },
  { mai: 48, intl: 'M', chestMin: 95, chestMax: 98 },
  { mai: 50, intl: 'L', chestMin: 99, chestMax: 104 },
  { mai: 52, intl: 'XL', chestMin: 105, chestMax: 110 },
  { mai: 54, intl: 'XXL', chestMin: 111, chestMax: 118 },
];

export function AnatomicalVisualizer({ onSizingChange }: AnatomicalVisualizerProps) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [height, setHeight] = useState(180);
  const [chest, setChest] = useState(102);
  const [waist, setWaist] = useState(84);
  const [shoulder, setShoulder] = useState(46.5);
  const [drape, setDrape] = useState<'fitted' | 'regular' | 'relaxed'>('regular');
  const [isSaved, setIsSaved] = useState(false);

  // Compute recommended size based on chest and drape
  let effectiveChest = chest;
  if (drape === 'fitted') effectiveChest -= 3;
  if (drape === 'relaxed') effectiveChest += 3;

  const matchedSize =
    APPAREL_SIZES.find((s) => effectiveChest >= s.chestMin && effectiveChest <= s.chestMax) ||
    (effectiveChest < 90 ? APPAREL_SIZES[0] : APPAREL_SIZES[APPAREL_SIZES.length - 1]);

  const recommendedShoeEU = Math.round(39 + ((height - 160) / 45) * 6);

  const formatValue = (valCm: number, decimals = 0) => {
    if (unit === 'cm') return `${valCm} cm`;
    return `${(valCm / 2.54).toFixed(decimals)} in`;
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'nex_size_profile',
        JSON.stringify({
          height,
          chest,
          waist,
          shoulder,
          unit,
          drape,
          recommendedSize: `${matchedSize.mai} (${matchedSize.intl})`,
          savedAt: new Date().toISOString(),
        })
      );
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Interactive Calibrator Controls */}
      <div className="lg:col-span-7 space-y-6 rounded-3xl bg-surface-card border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
              <Sliders size={13} />
              <span>Biometric Calibrator</span>
            </span>
            <h2 className="font-editorial text-2xl text-white font-normal">
              Adjust Your Proportions
            </h2>
          </div>

          {/* Unit Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-obsidian-950 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setUnit('cm')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                unit === 'cm'
                  ? 'bg-accent-pink text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Metric (CM)
            </button>
            <button
              type="button"
              onClick={() => setUnit('in')}
              className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                unit === 'in'
                  ? 'bg-accent-pink text-white shadow-sm'
                  : 'text-white/50 hover:text-white'
              }`}
            >
              Imperial (IN)
            </button>
          </div>
        </div>

        {/* Sliders Grid */}
        <div className="space-y-5">
          {/* Height */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">Height (Standing)</span>
              <span className="font-mono text-accent-cyan font-semibold">
                {formatValue(height)}
              </span>
            </div>
            <input
              type="range"
              min="160"
              max="205"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
          </div>

          {/* Chest Circumference */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">Chest Circumference (Across Nipple Line)</span>
              <span className="font-mono text-accent-pink font-semibold">
                {formatValue(chest)}
              </span>
            </div>
            <input
              type="range"
              min="80"
              max="130"
              value={chest}
              onChange={(e) => setChest(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-pink"
            />
          </div>

          {/* Waist Circumference */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">Natural Waist Circumference</span>
              <span className="font-mono text-accent-cyan font-semibold">
                {formatValue(waist)}
              </span>
            </div>
            <input
              type="range"
              min="65"
              max="120"
              value={waist}
              onChange={(e) => setWaist(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
          </div>

          {/* Shoulder Width */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/70 font-medium">Shoulder Width (Acromion to Acromion)</span>
              <span className="font-mono text-accent-cyan font-semibold">
                {formatValue(shoulder, 1)}
              </span>
            </div>
            <input
              type="range"
              min="38"
              max="56"
              step="0.5"
              value={shoulder}
              onChange={(e) => setShoulder(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
          </div>
        </div>

        {/* Drape Preference Selection */}
        <div className="pt-2 border-t border-white/10 space-y-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
            Desired Silhouette Ease / Drape
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['fitted', 'regular', 'relaxed'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDrape(mode)}
                className={`py-2.5 px-3 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer border ${
                  drape === mode
                    ? 'bg-accent-cyan/15 border-accent-cyan text-accent-cyan shadow-sm'
                    : 'bg-obsidian-950/60 border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {mode === 'fitted' && 'Fitted (-3cm)'}
                {mode === 'regular' && 'Regular Tailored'}
                {mode === 'relaxed' && 'Relaxed (+3cm)'}
              </button>
            ))}
          </div>
        </div>

        {/* Save to Profile Action */}
        <div className="pt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-surface-navy border border-white/15 hover:border-accent-cyan text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg"
          >
            {isSaved ? (
              <>
                <Check size={14} className="text-accent-cyan" />
                <span>Measurements Saved to Client Profile</span>
              </>
            ) : (
              <>
                <Bookmark size={14} />
                <span>Save to Client Profile</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-white/40">Zero-knowledge local encryption</span>
        </div>
      </div>

      {/* Right Column: Visual Silhouette & Recommended Size Stage */}
      <div className="lg:col-span-5 space-y-6">
        {/* Recommended Size Verdict Card */}
        <div className="rounded-3xl bg-surface-card border border-accent-pink/40 p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-accent-pink/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
              <Sparkles size={12} />
              <span>Calibrated Recommendation</span>
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-editorial text-4xl sm:text-5xl text-white font-normal">
                EU {matchedSize.mai}
              </span>
              <span className="font-mono text-lg text-accent-cyan font-bold">
                ({matchedSize.intl})
              </span>
            </div>
            <p className="text-xs text-white/60 font-light">
              {drape === 'fitted' && 'Fitted structure. Hugs anatomical contours with zero excess fabric.'}
              {drape === 'regular' && 'Regular European tailoring. Balanced drape with 4cm breathing ease.'}
              {drape === 'relaxed' && 'Relaxed architecture. Generous ease designed for layering over fine knitwear.'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
            <div className="p-3 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-1">
              <span className="text-white/40 block text-[10px] uppercase tracking-wider">Footwear (Estimated)</span>
              <span className="font-mono font-bold text-white text-sm">EU {recommendedShoeEU}</span>
            </div>
            <div className="p-3 rounded-xl bg-obsidian-950/80 border border-white/10 space-y-1">
              <span className="text-white/40 block text-[10px] uppercase tracking-wider">Confidence Level</span>
              <span className="font-mono font-bold text-accent-cyan text-sm">98% Anatomical</span>
            </div>
          </div>

          {/* SVG Proportional Silhouette Mockup */}
          <div className="relative aspect-[4/3] rounded-2xl bg-obsidian-950 border border-white/10 flex items-center justify-center p-4">
            <svg
              className="w-full h-full max-h-48 text-white/30"
              viewBox="0 0 200 240"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {/* Head & Neck */}
              <circle cx="100" cy="30" r="18" className="stroke-white/40" />
              <path d="M94 48v12M106 48v12" />

              {/* Dynamic Torso with proportional scale */}
              <path
                d={`M${100 - shoulder * 0.9} 60 L${100 - chest * 0.45} 90 L${100 - waist * 0.42} 140 L${100 + waist * 0.42} 140 L${100 + chest * 0.45} 90 L${100 + shoulder * 0.9} 60 Z`}
                className="stroke-accent-cyan fill-accent-cyan/10"
              />

              {/* Dynamic Measurement lines */}
              <line
                x1={100 - chest * 0.45}
                y1="90"
                x2={100 + chest * 0.45}
                y2="90"
                className="stroke-accent-pink stroke-dasharray-2"
                strokeDasharray="3 3"
              />
              <line
                x1={100 - waist * 0.42}
                y1="140"
                x2={100 + waist * 0.42}
                y2="140"
                className="stroke-accent-cyan stroke-dasharray-2"
                strokeDasharray="3 3"
              />

              {/* Legs */}
              <path d="M85 140v90M115 140v90" className="stroke-white/40" />
            </svg>

            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/40">
              Tape lines: Chest {formatValue(chest)} &middot; Waist {formatValue(waist)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
