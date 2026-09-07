'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Ruler, MoveHorizontal, Circle, ArrowLeftRight, Grid, Bookmark, Check } from 'lucide-react';

export interface AnatomicalVisualizerProps {
  onSizingChange?: (size: string) => void;
  unit?: 'cm' | 'in';
  onUnitChange?: (unit: 'cm' | 'in') => void;
  onRecommendedSizeChange?: (recSize: number, recShoeEU: number) => void;
}

export const APPAREL_SIZES = [
  { mai: 44, intl: 'XS', uk: 34, chest_cm: '88–92', chest_in: '34.6–36.2', shoulder: 43, sleeve: 63 },
  { mai: 46, intl: 'S',  uk: 36, chest_cm: '92–96', chest_in: '36.2–37.8', shoulder: 44.5, sleeve: 64 },
  { mai: 48, intl: 'M',  uk: 38, chest_cm: '98–102', chest_in: '38.6–40.2', shoulder: 46, sleeve: 65 },
  { mai: 50, intl: 'L',  uk: 40, chest_cm: '104–108', chest_in: '40.9–42.5', shoulder: 47.5, sleeve: 66 },
  { mai: 52, intl: 'XL', uk: 42, chest_cm: '110–114', chest_in: '43.3–44.9', shoulder: 49, sleeve: 67 },
  { mai: 54, intl: 'XXL',uk: 44, chest_cm: '116–120', chest_in: '45.7–47.2', shoulder: 50.5, sleeve: 68 }
];

export function AnatomicalVisualizer({
  onSizingChange,
  unit: externalUnit,
  onUnitChange,
  onRecommendedSizeChange,
}: AnatomicalVisualizerProps) {
  const [internalUnit, setInternalUnit] = useState<'cm' | 'in'>('cm');
  const unit = externalUnit ?? internalUnit;

  const handleUnitToggle = (newUnit: 'cm' | 'in') => {
    setInternalUnit(newUnit);
    if (onUnitChange) onUnitChange(newUnit);
  };

  const [height, setHeight] = useState<number>(180);
  const [chest, setChest] = useState<number>(102);
  const [waist, setWaist] = useState<number>(84);
  const [shoulder, setShoulder] = useState<number>(46.0);
  const [drape, setDrape] = useState<'fitted' | 'regular' | 'relaxed'>('regular');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Size calculation matching feature/storefront-elevation:pages/size-guide.html
  const calcSize = (c: number, d: 'fitted' | 'regular' | 'relaxed') => {
    const offset = d === 'fitted' ? -1 : d === 'relaxed' ? 1 : 0;
    let base = 48;
    if (c <= 92) base = 44;
    else if (c <= 96) base = 46;
    else if (c <= 102) base = 48;
    else if (c <= 108) base = 50;
    else if (c <= 114) base = 52;
    else base = 54;
    return Math.min(54, Math.max(44, base + offset * 2));
  };

  const calcShoeSize = (h: number) => {
    if (h <= 164) return 40;
    if (h <= 170) return 41;
    if (h <= 176) return 42;
    if (h <= 182) return 43;
    if (h <= 188) return 44;
    return 45;
  };

  const recSize = calcSize(chest, drape);
  const recShoeEU = calcShoeSize(height);
  const sizeObj = APPAREL_SIZES.find((x) => x.mai === recSize) || APPAREL_SIZES[2];

  useEffect(() => {
    if (onRecommendedSizeChange) {
      onRecommendedSizeChange(recSize, recShoeEU);
    }
    if (onSizingChange) {
      onSizingChange(`EU ${recSize} · ${sizeObj.intl}`);
    }
  }, [recSize, recShoeEU, sizeObj.intl, onRecommendedSizeChange, onSizingChange]);

  const fmt = (v: number, decimals = 0) => {
    if (unit === 'cm') return `${v} cm`;
    return `${(v / 2.54).toFixed(decimals || 1)} in`;
  };

  const drapeLabel =
    drape === 'fitted'
      ? 'Fitted Structure · Close-to-Body'
      : drape === 'relaxed'
      ? 'Relaxed Architecture · Generous Ease'
      : 'Regular Tailored · Balanced Drape';

  const confidence = chest >= 88 && chest <= 120 ? '98%' : '91%';

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      const profile = {
        height,
        chest,
        waist,
        shoulder,
        unit,
        fit: drape,
        recommendedSize: `EU ${recSize} (${sizeObj.intl})`,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem('nex_size_profile', JSON.stringify(profile));
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2200);
  };

  return (
    <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 lg:gap-14 items-start" aria-labelledby="vizSectionTitle">
      <style jsx global>{`
        @keyframes tape-march {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 20; }
        }
        .meas-tape-line {
          stroke-dasharray: 6 4;
          stroke-dashoffset: 0;
          animation: tape-march 1.2s linear infinite;
        }
      `}</style>

      {/* Left Column: 2D Silhouette Stage */}
      <div className="lg:sticky lg:top-24 flex flex-col items-center gap-6 w-full">
        <div className="w-full max-w-[380px] bg-white/[0.02] border border-white/[0.08] rounded-lg p-8 flex justify-center items-center shadow-xl">
          <svg
            id="silhouetteSVG"
            viewBox="0 0 240 380"
            className="w-full max-w-[220px] h-auto"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="sgGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="240" height="380" fill="url(#sgGrid)" />

            {/* Stylized Human Tailoring Silhouette */}
            <path
              d="M120 42 C128 42 134 48 134 56 C134 64 128 70 120 70 C112 70 106 64 106 56 C106 48 112 42 120 42 Z"
              fill="rgba(255,255,255,0.12)"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1.2"
            />
            <path d="M114 70 L114 82 L126 82 L126 70 Z" fill="rgba(255,255,255,0.12)" />
            <path
              d="M114 82 C100 86 66 94 62 108 C58 122 56 160 52 196 C50 210 56 216 64 214 C70 212 74 186 78 160 L84 210 L82 330 C82 340 88 344 94 344 C100 344 104 338 106 320 L116 230 L124 230 L134 320 C136 338 140 344 146 344 C152 344 158 340 158 330 L156 210 L162 160 C166 186 170 212 176 214 C184 216 190 210 188 196 C184 160 182 122 178 108 C174 94 140 86 126 82 Z"
              fill="rgba(255,255,255,0.06)"
              stroke="rgba(255,255,255,0.25)"
              strokeWidth="1.2"
            />

            {/* Height Ruler Guide */}
            <g stroke="rgba(255,255,255,0.15)" strokeWidth="1">
              <line x1="28" y1="40" x2="28" y2="344" strokeDasharray="2 2" />
              <line x1="22" y1="40" x2="34" y2="40" />
              <line x1="22" y1="344" x2="34" y2="344" />
              <text
                x="18"
                y="195"
                fill="#94A3B8"
                fontSize="9"
                fontFamily="'Inter', sans-serif"
                textAnchor="middle"
                transform="rotate(-90 18 195)"
              >
                {fmt(height, 0)}
              </text>
            </g>

            {/* Shoulder Measurement Tape */}
            <g className="meas-tape-line">
              <line x1="58" y1="98" x2="182" y2="98" stroke="#A78BFA" strokeWidth="1.5" />
              <circle cx="58" cy="98" r="2.5" fill="#A78BFA" />
              <circle cx="182" cy="98" r="2.5" fill="#A78BFA" />
            </g>
            <g>
              <rect x="74" y="86" width="92" height="18" rx="4" fill="#0B1528" stroke="#A78BFA" strokeWidth="1" />
              <text
                x="120"
                y="99"
                fill="#A78BFA"
                fontSize="8.5"
                fontWeight="600"
                fontFamily="'Inter', sans-serif"
                textAnchor="middle"
              >
                SHOULDER {fmt(shoulder, 1).toUpperCase()}
              </text>
            </g>

            {/* Chest Measurement Tape */}
            <g className="meas-tape-line">
              <line x1="68" y1="136" x2="172" y2="136" stroke="#3DE0FF" strokeWidth="1.5" />
              <circle cx="68" cy="136" r="2.5" fill="#3DE0FF" />
              <circle cx="172" cy="136" r="2.5" fill="#3DE0FF" />
            </g>
            <g>
              <rect x="78" y="124" width="84" height="18" rx="4" fill="#0B1528" stroke="#3DE0FF" strokeWidth="1" />
              <text
                x="120"
                y="137"
                fill="#3DE0FF"
                fontSize="8.5"
                fontWeight="600"
                fontFamily="'Inter', sans-serif"
                textAnchor="middle"
              >
                CHEST {fmt(chest, 0).toUpperCase()}
              </text>
            </g>

            {/* Waist Measurement Tape */}
            <g className="meas-tape-line">
              <line x1="76" y1="172" x2="164" y2="172" stroke="#34D399" strokeWidth="1.5" />
              <circle cx="76" cy="172" r="2.5" fill="#34D399" />
              <circle cx="164" cy="172" r="2.5" fill="#34D399" />
            </g>
            <g>
              <rect x="80" y="160" width="80" height="18" rx="4" fill="#0B1528" stroke="#34D399" strokeWidth="1" />
              <text
                x="120"
                y="173"
                fill="#34D399"
                fontSize="8.5"
                fontWeight="600"
                fontFamily="'Inter', sans-serif"
                textAnchor="middle"
              >
                WAIST {fmt(waist, 0).toUpperCase()}
              </text>
            </g>
          </svg>
        </div>

        {/* Result Card */}
        <div className="w-full max-w-[380px] bg-white/[0.02] border border-white/[0.08] rounded-lg p-6 flex flex-col items-center text-center gap-1.5 shadow-xl">
          <span className="text-[11px] font-semibold tracking-[0.16em] uppercase text-accent-cyan">
            Recommended Atelier Size
          </span>
          <span className="font-display text-3xl sm:text-[38px] font-bold tracking-tight text-white leading-tight tabular-nums">
            {recSize} · {sizeObj.intl}
          </span>
          <span className="text-[13px] text-slate-400">
            {drapeLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent-cyan/10 border border-accent-cyan/25 rounded-full text-[11px] font-semibold text-accent-cyan mt-1">
            {confidence} Anatomical Match
          </span>
        </div>
      </div>

      {/* Right Column: Control Sliders Panel */}
      <div className="flex flex-col gap-6 w-full">
        <div>
          <span id="vizSectionTitle" className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent-cyan block mb-2">
            Interactive Calibrator
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            Adjust Your Measurements
          </h2>
        </div>

        {/* Unit Toggle */}
        <div className="inline-flex p-[3px] bg-white/[0.04] border border-white/[0.08] rounded-full w-fit">
          <button
            type="button"
            onClick={() => handleUnitToggle('cm')}
            className={`px-4 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              unit === 'cm'
                ? 'bg-white text-[#020B18] shadow-sm'
                : 'text-slate-400 hover:text-white bg-transparent'
            }`}
            aria-pressed={unit === 'cm'}
          >
            CM
          </button>
          <button
            type="button"
            onClick={() => handleUnitToggle('in')}
            className={`px-4 py-1 rounded-full text-[11px] font-bold tracking-wider transition-all cursor-pointer ${
              unit === 'in'
                ? 'bg-white text-[#020B18] shadow-sm'
                : 'text-slate-400 hover:text-white bg-transparent'
            }`}
            aria-pressed={unit === 'in'}
          >
            IN
          </button>
        </div>

        {/* HEIGHT Slider Card */}
        <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg flex flex-col gap-3 transition-colors hover:border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-white/[0.04] border border-white/10 flex items-center justify-center text-slate-400">
                <Ruler size={14} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">Height</div>
                <div className="text-[11px] text-slate-500">Standing barefoot, vertical</div>
              </div>
            </div>
            <span className="font-display text-base font-bold text-white tabular-nums">
              {fmt(height, 0)}
            </span>
          </div>
          <input
            type="range"
            min={150}
            max={205}
            step={1}
            value={height}
            onChange={(e) => setHeight(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
            aria-label="Height slider"
          />
        </div>

        {/* CHEST Slider Card */}
        <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg flex flex-col gap-3 transition-colors hover:border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                <MoveHorizontal size={14} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">Chest Circumference</div>
                <div className="text-[11px] text-slate-500">Around fullest chest point</div>
              </div>
            </div>
            <span className="font-display text-base font-bold text-accent-cyan tabular-nums">
              {fmt(chest, 0)}
            </span>
          </div>
          <input
            type="range"
            min={80}
            max={130}
            step={1}
            value={chest}
            onChange={(e) => setChest(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            aria-label="Chest circumference slider"
          />
        </div>

        {/* WAIST Slider Card */}
        <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg flex flex-col gap-3 transition-colors hover:border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Circle size={14} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">Natural Waist</div>
                <div className="text-[11px] text-slate-500">Narrowest point at natural waistline</div>
              </div>
            </div>
            <span className="font-display text-base font-bold text-emerald-400 tabular-nums">
              {fmt(waist, 0)}
            </span>
          </div>
          <input
            type="range"
            min={65}
            max={120}
            step={1}
            value={waist}
            onChange={(e) => setWaist(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-400"
            aria-label="Waist circumference slider"
          />
        </div>

        {/* SHOULDER Slider Card */}
        <div className="p-4 bg-white/[0.02] border border-white/[0.08] rounded-lg flex flex-col gap-3 transition-colors hover:border-white/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400">
                <ArrowLeftRight size={14} />
              </div>
              <div>
                <div className="text-[13px] font-semibold text-white">Shoulder Breadth</div>
                <div className="text-[11px] text-slate-500">Shoulder tip to shoulder tip, upper back</div>
              </div>
            </div>
            <span className="font-display text-base font-bold text-violet-400 tabular-nums">
              {fmt(shoulder, 1)}
            </span>
          </div>
          <input
            type="range"
            min={36}
            max={58}
            step={0.5}
            value={shoulder}
            onChange={(e) => setShoulder(Number(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-violet-400"
            aria-label="Shoulder breadth slider"
          />
        </div>

        {/* DRAPE SILHOUETTE */}
        <div>
          <div className="text-[13px] font-semibold text-white mb-3">Drape Silhouette</div>
          <div className="flex gap-2">
            {(['fitted', 'regular', 'relaxed'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setDrape(mode)}
                className={`flex-1 py-2.5 px-2 rounded-md text-[11px] font-semibold text-center transition-all cursor-pointer border ${
                  drape === mode
                    ? 'bg-white text-[#020B18] border-white shadow-sm'
                    : 'bg-white/[0.02] border-white/[0.08] text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                {mode === 'fitted' && 'Fitted Structure'}
                {mode === 'regular' && 'Regular Tailored'}
                {mode === 'relaxed' && 'Relaxed Architecture'}
              </button>
            ))}
          </div>
        </div>

        {/* SHOP & SAVE CTAs */}
        <div className="flex gap-3 pt-2">
          <Link
            href="/category?cat=apparel"
            className="flex-1 h-[46px] bg-white hover:bg-slate-100 text-[#020B18] rounded-md text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg hover:scale-[1.02]"
          >
            <Grid size={13} />
            <span>Shop Apparel</span>
          </Link>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 h-[46px] bg-transparent hover:bg-white/[0.04] border border-white/15 hover:border-white/30 text-white rounded-md text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check size={13} className="text-accent-cyan" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Bookmark size={13} />
                <span>Save to Profile</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
