'use client';

import React, { useState } from 'react';
import { Sliders, Sparkles, Check, Bookmark, Ruler, UserCheck, ShieldCheck } from 'lucide-react';

interface AnatomicalVisualizerProps {
  onSizingChange?: (size: string) => void;
}

const APPAREL_SIZES = [
  { eu: 44, ukUs: 34, intl: 'XS', chestMin: 86, chestMax: 90, waistMin: 72, waistMax: 76 },
  { eu: 46, ukUs: 36, intl: 'S', chestMin: 91, chestMax: 94, waistMin: 77, waistMax: 80 },
  { eu: 48, ukUs: 38, intl: 'M', chestMin: 95, chestMax: 98, waistMin: 81, waistMax: 84 },
  { eu: 50, ukUs: 40, intl: 'L', chestMin: 99, chestMax: 104, waistMin: 85, waistMax: 90 },
  { eu: 52, ukUs: 42, intl: 'XL', chestMin: 105, chestMax: 110, waistMin: 91, waistMax: 96 },
  { eu: 54, ukUs: 44, intl: 'XXL', chestMin: 111, chestMax: 118, waistMin: 97, waistMax: 104 },
];

export function AnatomicalVisualizer({ onSizingChange }: AnatomicalVisualizerProps) {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [height, setHeight] = useState(180);
  const [chest, setChest] = useState(102);
  const [waist, setWaist] = useState(84);
  const [shoulder, setShoulder] = useState(46.0);
  const [inseam, setInseam] = useState(82);
  const [drape, setDrape] = useState<'fitted' | 'regular' | 'relaxed'>('regular');
  const [isSaved, setIsSaved] = useState(false);

  // Compute recommended size based on chest and drape preference
  let effectiveChest = chest;
  if (drape === 'fitted') effectiveChest -= 3;
  if (drape === 'relaxed') effectiveChest += 3;

  const matchedSize =
    APPAREL_SIZES.find((s) => effectiveChest >= s.chestMin && effectiveChest <= s.chestMax) ||
    (effectiveChest < 90 ? APPAREL_SIZES[0] : APPAREL_SIZES[APPAREL_SIZES.length - 1]);

  const recommendedTrouserEU = matchedSize.eu;
  const recommendedShoeEU = Math.round(39 + ((height - 160) / 45) * 6);
  const recommendedShoeUK = (recommendedShoeEU - 33.5).toFixed(1);

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
          inseam,
          unit,
          drape,
          recommendedSize: `EU ${matchedSize.eu} (${matchedSize.intl})`,
          savedAt: new Date().toISOString(),
        })
      );
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  // Dynamic SVG measurement positions
  const chestTapeWidth = Math.min(180, Math.max(90, (chest / 100) * 110));
  const waistTapeWidth = Math.min(170, Math.max(80, (waist / 85) * 95));
  const shoulderTapeWidth = Math.min(190, Math.max(100, (shoulder / 46) * 124));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Left Column: Interactive Silhouette Stage & Live Recommendation */}
      <div className="lg:col-span-5 space-y-6">
        {/* SVG Anatomical Mannequin Stage */}
        <div className="rounded-3xl bg-surface-card border border-white/10 p-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl">
          <div className="w-full flex items-center justify-between text-xs text-white/50 border-b border-white/10 pb-3 mb-4">
            <span className="font-semibold uppercase tracking-wider text-accent-cyan flex items-center gap-1.5">
              <Ruler size={13} />
              <span>2D Fit Silhouette</span>
            </span>
            <span className="font-mono text-[11px]">Real-Time Model</span>
          </div>

          <div className="relative w-full max-w-[260px] aspect-[240/360] flex items-center justify-center">
            <svg viewBox="0 0 240 380" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="sgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="240" height="380" fill="url(#sgGrid)" rx="16" />

              {/* Head & Neck */}
              <path d="M120 42 C128 42 134 48 134 56 C134 64 128 70 120 70 C112 70 106 64 106 56 C106 48 112 42 120 42 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
              <path d="M114 70 L114 82 L126 82 L126 70 Z" fill="rgba(255,255,255,0.12)" />

              {/* Torso & Limbs */}
              <path d="M114 82 C100 86 66 94 62 108 C58 122 56 160 52 196 C50 210 56 216 64 214 C70 212 74 186 78 160 L84 210 L82 330 C82 340 88 344 94 344 C100 344 104 338 106 320 L116 230 L124 230 L134 320 C136 338 140 344 146 344 C152 344 158 340 158 330 L156 210 L162 160 C166 186 170 212 176 214 C184 216 190 210 188 196 C184 160 182 122 178 108 C174 94 140 86 126 82 Z" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />

              {/* Height Guide Line */}
              <g stroke="rgba(255,255,255,0.15)" strokeWidth="1">
                <line x1="28" y1="40" x2="28" y2="344" strokeDasharray="2 2" />
                <line x1="22" y1="40" x2="34" y2="40" />
                <line x1="22" y1="344" x2="34" y2="344" />
                <text x="18" y="195" fill="#94A3B8" fontSize="9" fontFamily="sans-serif" textAnchor="middle" transform="rotate(-90 18 195)">{formatValue(height)}</text>
              </g>

              {/* Shoulder Tape */}
              <g>
                <line x1={120 - shoulderTapeWidth / 2} y1="98" x2={120 + shoulderTapeWidth / 2} y2="98" stroke="#A78BFA" strokeWidth="1.5" />
                <circle cx={120 - shoulderTapeWidth / 2} cy="98" r="2.5" fill="#A78BFA" />
                <circle cx={120 + shoulderTapeWidth / 2} cy="98" r="2.5" fill="#A78BFA" />
                <rect x="74" y="86" width="92" height="18" rx="4" fill="#0B1528" stroke="#A78BFA" strokeWidth="1" />
                <text x="120" y="99" fill="#A78BFA" fontSize="8.5" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">SHOULDER {formatValue(shoulder, 1)}</text>
              </g>

              {/* Chest Tape */}
              <g>
                <line x1={120 - chestTapeWidth / 2} y1="136" x2={120 + chestTapeWidth / 2} y2="136" stroke="#3DE0FF" strokeWidth="1.5" />
                <circle cx={120 - chestTapeWidth / 2} cy="136" r="2.5" fill="#3DE0FF" />
                <circle cx={120 + chestTapeWidth / 2} cy="136" r="2.5" fill="#3DE0FF" />
                <rect x="78" y="124" width="84" height="18" rx="4" fill="#0B1528" stroke="#3DE0FF" strokeWidth="1" />
                <text x="120" y="137" fill="#3DE0FF" fontSize="8.5" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">CHEST {formatValue(chest)}</text>
              </g>

              {/* Waist Tape */}
              <g>
                <line x1={120 - waistTapeWidth / 2} y1="172" x2={120 + waistTapeWidth / 2} y2="172" stroke="#34D399" strokeWidth="1.5" />
                <circle cx={120 - waistTapeWidth / 2} cy="172" r="2.5" fill="#34D399" />
                <circle cx={120 + waistTapeWidth / 2} cy="172" r="2.5" fill="#34D399" />
                <rect x="78" y="160" width="84" height="18" rx="4" fill="#0B1528" stroke="#34D399" strokeWidth="1" />
                <text x="120" y="173" fill="#34D399" fontSize="8.5" fontWeight="600" fontFamily="sans-serif" textAnchor="middle">WAIST {formatValue(waist)}</text>
              </g>
            </svg>
          </div>
        </div>

        {/* Recommended Size Verdict Card */}
        <div className="rounded-3xl bg-surface-card border border-accent-pink/40 p-6 sm:p-8 space-y-5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-36 h-36 bg-accent-pink/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
              <Sparkles size={13} />
              <span>Your Recommended Size</span>
            </span>
            <div className="flex items-baseline gap-3">
              <span className="font-editorial text-4xl sm:text-5xl text-white font-normal">
                EU {matchedSize.eu}
              </span>
              <span className="font-mono text-lg text-accent-cyan font-bold">
                ({matchedSize.intl})
              </span>
            </div>
            <p className="text-xs text-white/60 font-light">
              {drape === 'fitted' && 'Fitted cut. Clean, slim silhouette with minimal excess drape.'}
              {drape === 'regular' && 'Classic tailored fit. Natural drape with comfortable movement.'}
              {drape === 'relaxed' && 'Relaxed fit. Generous cut suited for comfortable layering.'}
            </p>
          </div>

          {/* Multi-Category Recommendations */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 text-center">
            <div className="p-3 rounded-xl bg-obsidian-950/70 border border-white/5">
              <div className="text-[10px] text-white/50 uppercase font-bold">Tops &amp; Coats</div>
              <div className="text-sm font-bold text-white mt-0.5">EU {matchedSize.eu}</div>
              <div className="text-[10px] text-accent-cyan">{matchedSize.intl} / UK {matchedSize.ukUs}</div>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950/70 border border-white/5">
              <div className="text-[10px] text-white/50 uppercase font-bold">Trousers</div>
              <div className="text-sm font-bold text-white mt-0.5">EU {recommendedTrouserEU}</div>
              <div className="text-[10px] text-accent-pink">Waist {formatValue(waist)}</div>
            </div>

            <div className="p-3 rounded-xl bg-obsidian-950/70 border border-white/5">
              <div className="text-[10px] text-white/50 uppercase font-bold">Footwear</div>
              <div className="text-sm font-bold text-white mt-0.5">EU {recommendedShoeEU}</div>
              <div className="text-[10px] text-white/60">UK {recommendedShoeUK}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Interactive Measurement Sliders & Fit Preferences */}
      <div className="lg:col-span-7 space-y-6 rounded-3xl bg-surface-card border border-white/10 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
              <Sliders size={13} />
              <span>Interactive Calculator</span>
            </span>
            <h2 className="font-editorial text-2xl text-white font-normal">
              Adjust Your Measurements
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
              <span className="text-white/80 font-medium">Height (Standing)</span>
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
              <span className="text-white/80 font-medium">Chest Measurement (Fullest Point)</span>
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
              <span className="text-white/80 font-medium">Natural Waist</span>
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
              <span className="text-white/80 font-medium">Shoulder Width (Tip to Tip)</span>
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

          {/* Inseam Length */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-white/80 font-medium">Inside Leg / Inseam Length</span>
              <span className="font-mono text-accent-cyan font-semibold">
                {formatValue(inseam)}
              </span>
            </div>
            <input
              type="range"
              min="70"
              max="95"
              value={inseam}
              onChange={(e) => setInseam(Number(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
          </div>
        </div>

        {/* Drape / Fit Preference Selection */}
        <div className="pt-2 border-t border-white/10 space-y-2.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-white/60 block">
            Preferred Fit &amp; Silhouette
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
                {mode === 'fitted' && 'Fitted (Slim)'}
                {mode === 'regular' && 'Classic Fit'}
                {mode === 'relaxed' && 'Relaxed Fit'}
              </button>
            ))}
          </div>
        </div>

        {/* Save to Profile Action */}
        <div className="pt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-surface-navy border border-white/15 hover:border-accent-cyan text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-105"
          >
            {isSaved ? (
              <>
                <Check size={14} className="text-accent-cyan" />
                <span>Saved to Your Profile</span>
              </>
            ) : (
              <>
                <Bookmark size={14} />
                <span>Save My Measurements</span>
              </>
            )}
          </button>
          <span className="text-[11px] text-white/40">Saved locally on your device</span>
        </div>
      </div>
    </div>
  );
}
