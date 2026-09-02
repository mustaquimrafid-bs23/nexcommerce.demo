'use client';

import React, { useState } from 'react';

const APPAREL_MATRIX = [
  { eu: 44, usUk: 34, intl: 'XS', chestCm: '86 - 90', chestIn: '33.8 - 35.4', waistCm: '72 - 76', waistIn: '28.3 - 29.9' },
  { eu: 46, usUk: 36, intl: 'S', chestCm: '91 - 94', chestIn: '35.8 - 37.0', waistCm: '77 - 80', waistIn: '30.3 - 31.5' },
  { eu: 48, usUk: 38, intl: 'M', chestCm: '95 - 98', chestIn: '37.4 - 38.6', waistCm: '81 - 84', waistIn: '31.9 - 33.1' },
  { eu: 50, usUk: 40, intl: 'L', chestCm: '99 - 104', chestIn: '39.0 - 40.9', waistCm: '85 - 90', waistIn: '33.5 - 35.4' },
  { eu: 52, usUk: 42, intl: 'XL', chestCm: '105 - 110', chestIn: '41.3 - 43.3', waistCm: '91 - 96', waistIn: '35.8 - 37.8' },
  { eu: 54, usUk: 44, intl: 'XXL', chestCm: '111 - 118', chestIn: '43.7 - 46.5', waistCm: '97 - 104', waistIn: '38.2 - 40.9' },
];

const FOOTWEAR_MATRIX = [
  { eu: 40, us: 7.0, uk: 6.5, jp: 25.0, insoleCm: 26.0 },
  { eu: 41, us: 8.0, uk: 7.5, jp: 26.0, insoleCm: 26.7 },
  { eu: 42, us: 9.0, uk: 8.5, jp: 26.5, insoleCm: 27.3 },
  { eu: 43, us: 10.0, uk: 9.5, jp: 27.5, insoleCm: 28.0 },
  { eu: 44, us: 10.5, uk: 10.0, jp: 28.0, insoleCm: 28.7 },
  { eu: 45, us: 11.5, uk: 11.0, jp: 29.0, insoleCm: 29.3 },
  { eu: 46, us: 12.0, uk: 11.5, jp: 29.5, insoleCm: 30.0 },
];

export function SizeConversionMatrix() {
  const [tab, setTab] = useState<'apparel' | 'footwear'>('apparel');

  return (
    <div className="space-y-6 rounded-3xl bg-surface-card border border-white/10 p-6 sm:p-8 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
            International Standards
          </span>
          <h3 className="font-editorial text-2xl text-white font-normal">
            Size Conversion Matrix
          </h3>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center p-1 rounded-xl bg-obsidian-950 border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setTab('apparel')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              tab === 'apparel'
                ? 'bg-accent-crimson text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Tailoring &amp; Outerwear
          </button>
          <button
            type="button"
            onClick={() => setTab('footwear')}
            className={`px-4 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              tab === 'footwear'
                ? 'bg-accent-crimson text-white shadow-sm'
                : 'text-white/50 hover:text-white'
            }`}
          >
            Footwear &amp; Boots
          </button>
        </div>
      </div>

      {/* Table Display */}
      <div className="overflow-x-auto">
        {tab === 'apparel' ? (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Maison EU</th>
                <th className="py-3 px-4">US / UK</th>
                <th className="py-3 px-4">International</th>
                <th className="py-3 px-4">Chest (CM)</th>
                <th className="py-3 px-4">Chest (IN)</th>
                <th className="py-3 px-4">Waist (CM)</th>
                <th className="py-3 px-4">Waist (IN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {APPAREL_MATRIX.map((row) => (
                <tr key={row.eu} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-accent-cyan">EU {row.eu}</td>
                  <td className="py-3 px-4 text-white/90">{row.usUk}</td>
                  <td className="py-3 px-4 font-sans font-semibold text-accent-pink">{row.intl}</td>
                  <td className="py-3 px-4 text-white/70">{row.chestCm}</td>
                  <td className="py-3 px-4 text-white/70">{row.chestIn}</td>
                  <td className="py-3 px-4 text-white/70">{row.waistCm}</td>
                  <td className="py-3 px-4 text-white/70">{row.waistIn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 text-white/50 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">European (EU)</th>
                <th className="py-3 px-4">United States (US)</th>
                <th className="py-3 px-4">United Kingdom (UK)</th>
                <th className="py-3 px-4">Japan (JP CM)</th>
                <th className="py-3 px-4">Insole Length (CM)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono">
              {FOOTWEAR_MATRIX.map((row) => (
                <tr key={row.eu} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4 font-bold text-accent-cyan">EU {row.eu}</td>
                  <td className="py-3 px-4 text-white/90">{row.us}</td>
                  <td className="py-3 px-4 text-white/90">{row.uk}</td>
                  <td className="py-3 px-4 text-white/70">{row.jp} cm</td>
                  <td className="py-3 px-4 text-accent-pink font-semibold">{row.insoleCm} cm</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
