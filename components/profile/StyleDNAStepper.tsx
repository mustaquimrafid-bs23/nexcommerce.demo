'use client';

import React from 'react';
import { Sparkles, Check, Sliders, Palette, Layers, Compass, Sun, Briefcase, Coffee } from 'lucide-react';

export interface StyleDNAState {
  archetype: string;
  fit: string;
  colors: string[];
  lifestyle: {
    formal: number;
    business: number;
    weekend: number;
  };
}

interface StyleDNAStepperProps {
  dna: StyleDNAState;
  onChange: (updated: Partial<StyleDNAState>) => void;
}

const ARCHETYPES = [
  {
    id: 'minimalist-tailoring',
    title: 'Minimalist Tailoring',
    subtitle: 'Clean Architectural Lines',
    desc: 'Structured wool blazers, raw cashmere overcoats, hidden plackets, and crisp monochromatic textures.',
    img: '/assets/images/lifestyle/hero_sweater_hd.jpg',
  },
  {
    id: 'relaxed-luxury',
    title: 'Relaxed Luxury',
    subtitle: 'Effortless Comfort & Drape',
    desc: 'Oversized loopback cotton hoodies, soft cardigans, fluid trousers, and relaxed seasonal knitwear.',
    img: '/assets/images/lifestyle/auth_lifestyle.jpg',
  },
  {
    id: 'contemporary-techwear',
    title: 'Contemporary Techwear',
    subtitle: 'Modern Waterproof Utility',
    desc: 'Technical weatherproof trench coats, modular shell jackets, titanium hardware, and ergonomic motion cuts.',
    img: '/assets/images/lifestyle/hero_headphone_hd.jpg',
  },
  {
    id: 'heritage-leather',
    title: 'Heritage Leather & Horology',
    subtitle: 'Timeless Artisanal Pieces',
    desc: 'Full-grain vegetable-tanned leather holdalls, handcrafted Italian Chelsea boots, and precision Swiss watches.',
    img: '/assets/images/lifestyle/hero_sweater_landscape.jpg',
  },
];

const FITS = [
  {
    id: 'fitted-slim',
    name: 'Fitted (Slim)',
    desc: 'Close tailored cut with tapered waist and zero excess fabric. Ideal for sleek, formal suiting.',
  },
  {
    id: 'classic-fit',
    name: 'Classic Fit',
    desc: 'Timeless proportional drape with comfortable ease of movement. The versatile everyday baseline.',
  },
  {
    id: 'relaxed-fit',
    name: 'Relaxed Fit',
    desc: 'Generous volume with dropped shoulders and wider sleeves, engineered for modern relaxed layering.',
  },
];

const COLOR_PRESETS = [
  { id: 'monochrome', name: 'Monochrome Obsidian', colors: ['obsidian', 'titanium', 'navy'] },
  { id: 'warm-earth', name: 'Warm Earth & Camel', colors: ['camel', 'chestnut', 'clay', 'cream'] },
  { id: 'nordic-slate', name: 'Nordic Slate & Ice', colors: ['titanium', 'chalk', 'stone', 'white'] },
  { id: 'midnight-navy', name: 'Deep Midnight & Navy', colors: ['navy', 'obsidian', 'forest', 'chalk'] },
];

const COLORS = [
  { id: 'obsidian', name: 'Charcoal Obsidian', hex: '#0A0F1D' },
  { id: 'camel', name: 'Gobi Camel', hex: '#B3824F' },
  { id: 'chestnut', name: 'Tuscan Chestnut', hex: '#6B4423' },
  { id: 'navy', name: 'Midnight Navy', hex: '#0D2240' },
  { id: 'chalk', name: 'Como Chalk', hex: '#EAE5DB' },
  { id: 'titanium', name: 'Slate Titanium', hex: '#4B5563' },
  { id: 'olive', name: 'Olive Moss', hex: '#404C38' },
  { id: 'burgundy', name: 'Burgundy Wine', hex: '#581825' },
  { id: 'forest', name: 'Forest Green', hex: '#1E3A2F' },
  { id: 'cream', name: 'Ivory Cream', hex: '#F5F0EB' },
  { id: 'stone', name: 'Stone Grey', hex: '#8E8E93' },
  { id: 'clay', name: 'Muted Clay', hex: '#A0522D' },
];

export function StyleDNAStepper({ dna, onChange }: StyleDNAStepperProps) {
  const toggleColor = (colorId: string) => {
    const next = dna.colors.includes(colorId)
      ? dna.colors.filter((c) => c !== colorId)
      : [...dna.colors, colorId];
    onChange({ colors: next.length === 0 ? [colorId] : next });
  };

  const setPresetColors = (presetColors: string[]) => {
    onChange({ colors: presetColors });
  };

  return (
    <div className="space-y-12">
      {/* 01: Everyday Clothing Styles */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface-card/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Layers size={13} />
            <span>Step 1 / 4 · Everyday Clothing Styles</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Select Your Primary <span className="italic font-normal">Style Aesthetic</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            Choose the core design philosophy that best describes your everyday clothing preferences.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ARCHETYPES.map((arch) => {
            const isActive = dna.archetype === arch.id;
            return (
              <div
                key={arch.id}
                onClick={() => onChange({ archetype: arch.id })}
                className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col justify-between space-y-3 relative overflow-hidden group ${
                  isActive
                    ? 'bg-accent-cyan/10 border-accent-cyan shadow-xl shadow-accent-cyan/10'
                    : 'bg-obsidian-950/60 border-white/10 hover:border-white/25 hover:bg-obsidian-950/80'
                }`}
              >
                <div className="aspect-[4/3] rounded-xl overflow-hidden bg-obsidian-950 relative flex items-center justify-center">
                  <img
                    src={arch.img}
                    alt={arch.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                  />
                  {isActive && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-accent-cyan text-obsidian-950 flex items-center justify-center shadow-md">
                      <Check size={14} strokeWidth={3} />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="text-[10px] font-mono text-accent-cyan uppercase tracking-wider">{arch.subtitle}</div>
                  <h3 className="font-editorial text-lg text-white font-normal leading-snug">{arch.title}</h3>
                  <p className="text-[11px] text-white/60 leading-relaxed font-light">{arch.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 02: Preferred Fit & Silhouette */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface-card/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
            <Compass size={13} />
            <span>Step 2 / 4 · Preferred Fit &amp; Silhouette</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Silhouette <span className="italic font-normal">Cut &amp; Volume</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            Select your preferred garment ease across shirts, blazers, and trousers.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FITS.map((fit) => {
            const isActive = dna.fit === fit.id;
            return (
              <div
                key={fit.id}
                onClick={() => onChange({ fit: fit.id })}
                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer space-y-2 flex flex-col justify-between ${
                  isActive
                    ? 'bg-accent-pink/10 border-accent-pink shadow-xl shadow-accent-pink/10'
                    : 'bg-obsidian-950/60 border-white/10 hover:border-white/25 hover:bg-obsidian-950/80'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl text-white font-normal">{fit.name}</h3>
                  {isActive && (
                    <div className="w-5 h-5 rounded-full bg-accent-pink text-white flex items-center justify-center">
                      <Check size={12} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <p className="text-xs text-white/60 leading-relaxed font-light">{fit.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 03: Colour Palette */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface-card/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Palette size={13} />
            <span>Step 3 / 4 · Colour Palette</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Wardrobe <span className="italic font-normal">Colour Palette</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            Select your favourite shades or choose a curated palette preset.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex flex-wrap gap-2 pt-1">
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPresetColors(p.colors)}
              className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-accent-cyan/40 hover:bg-accent-cyan/10 text-xs text-white/80 transition-all cursor-pointer font-medium"
            >
              {p.name}
            </button>
          ))}
        </div>

        {/* 12 Colour Swatches */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {COLORS.map((col) => {
            const isSelected = dna.colors.includes(col.id);
            return (
              <div
                key={col.id}
                onClick={() => toggleColor(col.id)}
                className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex items-center gap-3 ${
                  isSelected
                    ? 'bg-white/10 border-accent-cyan shadow-md'
                    : 'bg-obsidian-950/60 border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full shrink-0 border border-white/20 relative flex items-center justify-center shadow-inner"
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && (
                    <span className="text-[10px] font-bold text-white drop-shadow-md">✓</span>
                  )}
                </div>
                <span className="text-xs text-white/80 font-medium truncate">{col.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 04: Lifestyle Occasion Balance Sliders */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface-card/60 border border-white/10 backdrop-blur-xl shadow-2xl space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
            <Sliders size={13} />
            <span>Step 4 / 4 · Lifestyle &amp; Occasion Balance</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Everyday <span className="italic font-normal">Occasion Weighting</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            Adjust the slider balance to guide recommendations based on how you spend your week.
          </p>
        </div>

        <div className="space-y-5">
          {/* Formal Slider */}
          <div className="p-4 rounded-2xl bg-obsidian-950/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5 md:w-1/3">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Sun size={13} className="text-accent-pink" />
                <span>Formal &amp; Evening Occasions</span>
              </div>
              <div className="text-[11px] text-white/50 font-light">Bespoke black-tie, dinner parties, galas</div>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={dna.lifestyle.formal}
                onChange={(e) =>
                  onChange({
                    lifestyle: { ...dna.lifestyle, formal: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full accent-accent-pink cursor-pointer"
              />
              <span className="w-12 text-right font-mono text-xs font-bold text-accent-pink">
                {dna.lifestyle.formal}%
              </span>
            </div>
          </div>

          {/* Business Slider */}
          <div className="p-4 rounded-2xl bg-obsidian-950/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5 md:w-1/3">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Briefcase size={13} className="text-accent-cyan" />
                <span>Everyday Executive &amp; Business</span>
              </div>
              <div className="text-[11px] text-white/50 font-light">Boardroom meetings, creative studio, daily office</div>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={dna.lifestyle.business}
                onChange={(e) =>
                  onChange({
                    lifestyle: { ...dna.lifestyle, business: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full accent-accent-cyan cursor-pointer"
              />
              <span className="w-12 text-right font-mono text-xs font-bold text-accent-cyan">
                {dna.lifestyle.business}%
              </span>
            </div>
          </div>

          {/* Weekend Slider */}
          <div className="p-4 rounded-2xl bg-obsidian-950/60 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-0.5 md:w-1/3">
              <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                <Coffee size={13} className="text-accent-pink" />
                <span>Weekend &amp; Travel Comfort</span>
              </div>
              <div className="text-[11px] text-white/50 font-light">Airport transit, resort leisure, relaxed downtime</div>
            </div>
            <div className="flex-1 flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={dna.lifestyle.weekend}
                onChange={(e) =>
                  onChange({
                    lifestyle: { ...dna.lifestyle, weekend: parseInt(e.target.value) || 0 },
                  })
                }
                className="w-full accent-accent-pink cursor-pointer"
              />
              <span className="w-12 text-right font-mono text-xs font-bold text-accent-pink">
                {dna.lifestyle.weekend}%
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
