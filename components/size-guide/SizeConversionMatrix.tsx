'use client';

import React, { useState } from 'react';

export interface SizeConversionMatrixProps {
  recSize?: number;
  recShoeEU?: number;
  unit?: 'cm' | 'in';
}

export const APPAREL_MATRIX = [
  { mai: 44, eu: 44, intl: 'XS', uk: 34, us: 34, chest_cm: '88–92', chest_in: '34.6–36.2', shoulder: 43, sleeve: 63 },
  { mai: 46, eu: 46, intl: 'S',  uk: 36, us: 36, chest_cm: '92–96', chest_in: '36.2–37.8', shoulder: 44.5, sleeve: 64 },
  { mai: 48, eu: 48, intl: 'M',  uk: 38, us: 38, chest_cm: '98–102', chest_in: '38.6–40.2', shoulder: 46, sleeve: 65 },
  { mai: 50, eu: 50, intl: 'L',  uk: 40, us: 40, chest_cm: '104–108', chest_in: '40.9–42.5', shoulder: 47.5, sleeve: 66 },
  { mai: 52, eu: 52, intl: 'XL', uk: 42, us: 42, chest_cm: '110–114', chest_in: '43.3–44.9', shoulder: 49, sleeve: 67 },
  { mai: 54, eu: 54, intl: 'XXL',uk: 44, us: 44, chest_cm: '116–120', chest_in: '45.7–47.2', shoulder: 50.5, sleeve: 68 }
];

export const TROUSERS_SIZES = [
  { mai: 44, eu: 44, usUk: 28, waist_cm: '74–77', waist_in: '29.1–30.3', hip_cm: '92–95', inseam: 82 },
  { mai: 46, eu: 46, usUk: 30, waist_cm: '78–81', waist_in: '30.7–31.9', hip_cm: '96–99', inseam: 83 },
  { mai: 48, eu: 48, usUk: 32, waist_cm: '82–85', waist_in: '32.3–33.5', hip_cm: '100–103', inseam: 84 },
  { mai: 50, eu: 50, usUk: 34, waist_cm: '86–89', waist_in: '33.9–35.0', hip_cm: '104–107', inseam: 85 },
  { mai: 52, eu: 52, usUk: 36, waist_cm: '90–93', waist_in: '35.4–36.6', hip_cm: '108–111', inseam: 86 }
];

export const FOOTWEAR_SIZES = [
  { eu: 40, uk: '6.5', us: '7.5', cm: '25.5', inches: '10.0' },
  { eu: 41, uk: '7.5', us: '8.5', cm: '26.2', inches: '10.3' },
  { eu: 42, uk: '8.5', us: '9.5', cm: '27.0', inches: '10.6' },
  { eu: 43, uk: '9.5', us: '10.5', cm: '27.8', inches: '10.9' },
  { eu: 44, uk: '10.5', us: '11.5', cm: '28.5', inches: '11.2' },
  { eu: 45, uk: '11.5', us: '12.5', cm: '29.2', inches: '11.5' }
];

export function SizeConversionMatrix({
  recSize = 48,
  recShoeEU = 42,
  unit = 'cm',
}: SizeConversionMatrixProps) {
  const [tab, setTab] = useState<'apparel' | 'trousers' | 'footwear'>('apparel');
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  return (
    <section aria-labelledby="matrixSectionTitle" className="space-y-7">
      <div>
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent-cyan block mb-2">
          Global Equivalency
        </span>
        <h2 id="matrixSectionTitle" className="font-editorial text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          Size Conversion Chart
        </h2>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
        <button
          type="button"
          onClick={() => setTab('apparel')}
          className={`px-5 py-2 rounded-full text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
            tab === 'apparel'
              ? 'bg-white text-[#020B18] border-white shadow-sm'
              : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
          }`}
          role="tab"
          aria-selected={tab === 'apparel'}
        >
          Coats &amp; Ready-to-Wear
        </button>
        <button
          type="button"
          onClick={() => setTab('trousers')}
          className={`px-5 py-2 rounded-full text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
            tab === 'trousers'
              ? 'bg-white text-[#020B18] border-white shadow-sm'
              : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
          }`}
          role="tab"
          aria-selected={tab === 'trousers'}
        >
          Tailored Trousers
        </button>
        <button
          type="button"
          onClick={() => setTab('footwear')}
          className={`px-5 py-2 rounded-full text-[11px] font-semibold tracking-wider uppercase whitespace-nowrap transition-all cursor-pointer border ${
            tab === 'footwear'
              ? 'bg-white text-[#020B18] border-white shadow-sm'
              : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-white hover:border-white/20'
          }`}
          role="tab"
          aria-selected={tab === 'footwear'}
        >
          Artisanal Footwear
        </button>
      </div>

      {/* Apparel Panel */}
      {tab === 'apparel' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {APPAREL_MATRIX.map((s) => {
            const isRec = s.mai === recSize;
            const isSelected = selectedCardId === `apparel-${s.mai}`;
            const chestLabel = unit === 'cm' ? `${s.chest_cm} cm` : `${s.chest_in} in`;

            return (
              <div
                key={s.mai}
                onClick={() => setSelectedCardId(`apparel-${s.mai}`)}
                className={`p-4 rounded-md flex flex-col items-center gap-2 transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_16px_rgba(61,224,255,0.2)]'
                    : isRec
                    ? 'bg-accent-cyan/[0.06] border-accent-cyan/35'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/25 hover:bg-white/[0.04]'
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Size ${s.mai} ${s.intl}`}
              >
                <span className={`font-display text-2xl font-bold tracking-tight tabular-nums ${isRec ? 'text-accent-cyan' : 'text-white'}`}>
                  {s.mai}
                </span>
                <span className="text-[12px] font-semibold text-slate-300">
                  {s.intl} · UK/US {s.uk}
                </span>
                <span className="text-[11px] text-slate-400 text-center leading-tight">
                  Chest {chestLabel}
                </span>
                {isRec && (
                  <span className="text-[9px] font-bold tracking-wider uppercase text-accent-cyan px-2 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full mt-0.5">
                    ✦ Your Size
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Trousers Panel */}
      {tab === 'trousers' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TROUSERS_SIZES.map((s) => {
            const isRec = s.mai === recSize;
            const isSelected = selectedCardId === `trousers-${s.mai}`;
            const waistLabel = unit === 'cm' ? `${s.waist_cm} cm` : `${s.waist_in} in`;

            return (
              <div
                key={s.mai}
                onClick={() => setSelectedCardId(`trousers-${s.mai}`)}
                className={`p-4 rounded-md flex flex-col items-center gap-2 transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_16px_rgba(61,224,255,0.2)]'
                    : isRec
                    ? 'bg-accent-cyan/[0.06] border-accent-cyan/35'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/25 hover:bg-white/[0.04]'
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Waist size ${s.mai}`}
              >
                <span className={`font-display text-2xl font-bold tracking-tight tabular-nums ${isRec ? 'text-accent-cyan' : 'text-white'}`}>
                  {s.mai}
                </span>
                <span className="text-[12px] font-semibold text-slate-300">
                  Waist {waistLabel}
                </span>
                <span className="text-[11px] text-slate-400 text-center leading-tight">
                  Inseam {s.inseam} cm
                </span>
                {isRec && (
                  <span className="text-[9px] font-bold tracking-wider uppercase text-accent-cyan px-2 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full mt-0.5">
                    ✦ Your Size
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Footwear Panel */}
      {tab === 'footwear' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {FOOTWEAR_SIZES.map((s) => {
            const isRec = s.eu === recShoeEU;
            const isSelected = selectedCardId === `footwear-${s.eu}`;
            const footLabel = unit === 'cm' ? `${s.cm} cm` : `${s.inches} in`;

            return (
              <div
                key={s.eu}
                onClick={() => setSelectedCardId(`footwear-${s.eu}`)}
                className={`p-4 rounded-md flex flex-col items-center gap-2 transition-all cursor-pointer border ${
                  isSelected
                    ? 'border-accent-cyan bg-accent-cyan/10 shadow-[0_0_16px_rgba(61,224,255,0.2)]'
                    : isRec
                    ? 'bg-accent-cyan/[0.06] border-accent-cyan/35'
                    : 'bg-white/[0.02] border-white/[0.08] hover:border-white/25 hover:bg-white/[0.04]'
                }`}
                role="button"
                tabIndex={0}
                aria-label={`Shoe size EU ${s.eu}`}
              >
                <span className={`font-display text-xl font-bold tracking-tight tabular-nums ${isRec ? 'text-accent-cyan' : 'text-white'}`}>
                  EU {s.eu}
                </span>
                <span className="text-[11px] font-semibold text-slate-300 text-center leading-tight">
                  UK {s.uk} · US {s.us}
                </span>
                <span className="text-[11px] text-slate-400">
                  Length {footLabel}
                </span>
                {isRec && (
                  <span className="text-[9px] font-bold tracking-wider uppercase text-accent-cyan px-2 py-0.5 bg-accent-cyan/10 border border-accent-cyan/30 rounded-full mt-0.5">
                    ✦ Your Size
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
