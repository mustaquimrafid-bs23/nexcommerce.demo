'use client';

import React from 'react';
import { Sparkles, Check, Sliders, Palette, Layers, Compass } from 'lucide-react';

export interface StyleDNAState {
  archetype: string;
  fit: string;
  colors: string[];
  lifestyle: {
    work: number;
    leisure: number;
    travel: number;
    events: number;
  };
}

interface StyleDNAStepperProps {
  dna: StyleDNAState;
  onChange: (updated: Partial<StyleDNAState>) => void;
}

const ARCHETYPES = [
  {
    id: 'quiet-luxury',
    title: 'Quiet Luxury',
    subtitle: 'Understated Nobility',
    desc: 'Unbranded architectural tailoring, double-face cashmere, neutral earth and navy palettes with flawless drape.',
    img: '/assets/images/lifestyle/hero_sweater_hd.jpg',
  },
  {
    id: 'minimalist',
    title: 'Minimalist Architectural',
    subtitle: 'Monochrome Restraint',
    desc: 'Geometric silhouettes, deep obsidian blacks, raw selvedge textures and clean hidden plackets.',
    img: '/assets/images/lifestyle/auth_lifestyle.jpg',
  },
  {
    id: 'contemporary',
    title: 'Contemporary Tailored',
    subtitle: 'Modern European Proportion',
    desc: 'Soft Neapolitan shoulders, fluid wide-leg trousers, Italian horn accents and modern knit layering.',
    img: '/assets/images/lifestyle/hero_sweater_landscape.jpg',
  },
  {
    id: 'technical',
    title: 'Technical Elegance',
    subtitle: 'Functional Metallurgy',
    desc: 'High-density weatherproof silk-nylon membranes, titanium hardware, and ergonomic motion articulation.',
    img: '/assets/images/lifestyle/hero_headphone_hd.jpg',
  },
];

const FITS = [
  {
    id: 'tailored',
    name: 'Fitted Tailored',
    desc: 'Close to the anatomy with tapered waist and zero excess fabric. Ideal for formal tailoring.',
  },
  {
    id: 'regular',
    name: 'Regular Balanced',
    desc: 'Standard European ease with 4cm breathing room. The signature Maison baseline silhouette.',
  },
  {
    id: 'relaxed',
    name: 'Oversized Relaxed',
    desc: 'Generous volume and dropped shoulders engineered for layering over heavy winter knits.',
  },
];

const COLORS = [
  { id: 'obsidian', name: 'Deep Obsidian', hex: '#0a0f1d' },
  { id: 'navy', name: 'Maison Navy', hex: '#0d2240' },
  { id: 'camel', name: 'Tuscan Camel', hex: '#b3824f' },
  { id: 'charcoal', name: 'Slate Charcoal', hex: '#374151' },
  { id: 'cream', name: 'Raw Cashmere Cream', hex: '#eae5db' },
  { id: 'olive', name: 'Alpine Olive', hex: '#404c38' },
  { id: 'burgundy', name: 'Chianti Burgundy', hex: '#581825' },
  { id: 'white', name: 'Optical Chalk', hex: '#f8fafc' },
];

export function StyleDNAStepper({ dna, onChange }: StyleDNAStepperProps) {
  const toggleColor = (colorId: string) => {
    const next = dna.colors.includes(colorId)
      ? dna.colors.filter((c) => c !== colorId)
      : [...dna.colors, colorId];
    onChange({ colors: next.length === 0 ? [colorId] : next });
  };

  const setPreset = (preset: 'neutral' | 'obsidian' | 'all') => {
    if (preset === 'neutral') onChange({ colors: ['cream', 'camel', 'charcoal'] });
    if (preset === 'obsidian') onChange({ colors: ['obsidian', 'navy', 'charcoal'] });
    if (preset === 'all') onChange({ colors: COLORS.map((c) => c.id) });
  };

  return (
    <div className="space-y-12">
      {/* 01: Visual Style Archetype */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
            <Compass size={13} />
            <span>01 / CLOTHING ARCHETYPE</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            What Style Do You Wear Most?
          </h2>
          <p className="text-xs text-white/60 font-light">
            Select the aesthetic that best matches how you dress. Our neural stylist tailors drops to this look.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ARCHETYPES.map((arch) => {
            const isSelected = dna.archetype === arch.id;
            return (
              <button
                key={arch.id}
                type="button"
                onClick={() => onChange({ archetype: arch.id })}
                className={`p-4 rounded-3xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-4 shadow-xl ${
                  isSelected
                    ? 'bg-surface-navy border-accent-pink ring-1 ring-accent-pink/40 shadow-accent-pink/15'
                    : 'bg-surface-card border-white/10 hover:border-white/25'
                }`}
              >
                <div className="space-y-3">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-obsidian-950 relative">
                    <img
                      src={arch.img}
                      alt={arch.title}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-accent-pink flex items-center justify-center text-white shadow-md">
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-cyan block">
                      {arch.subtitle}
                    </span>
                    <h3 className="font-editorial text-lg text-white font-normal">{arch.title}</h3>
                  </div>
                  <p className="text-xs text-white/60 font-light leading-relaxed">{arch.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 02: Fit & Silhouette Preference */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Layers size={13} />
            <span>02 / SILHOUETTE EASE &amp; FIT</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            How Do You Prefer Your Pieces to Sit?
          </h2>
          <p className="text-xs text-white/60 font-light">
            Our assistant uses this preference to recommend optimal sizes and volume cuts across knitwear and coats.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {FITS.map((fit) => {
            const isSelected = dna.fit === fit.id;
            return (
              <button
                key={fit.id}
                type="button"
                onClick={() => onChange({ fit: fit.id })}
                className={`p-6 rounded-3xl text-left border transition-all cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-surface-navy border-accent-cyan ring-1 ring-accent-cyan/40 shadow-lg'
                    : 'bg-surface-card border-white/10 hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl text-white font-normal">{fit.name}</h3>
                  {isSelected && <Check size={16} className="text-accent-cyan" />}
                </div>
                <p className="text-xs text-white/60 font-light leading-relaxed">{fit.desc}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* 03: Signature Color Palette */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-pink flex items-center gap-1.5">
              <Palette size={13} />
              <span>03 / SIGNATURE COLOR PALETTE</span>
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
              Select Your Preferred Tones
            </h2>
            <p className="text-xs text-white/60 font-light">
              Tap the shades you naturally gravitate toward. You can select multiple tones.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-semibold text-white/40">Presets:</span>
            <button
              type="button"
              onClick={() => setPreset('neutral')}
              className="px-2.5 py-1 rounded-lg bg-surface-card border border-white/10 text-[11px] text-white/70 hover:text-white cursor-pointer"
            >
              Neutrals
            </button>
            <button
              type="button"
              onClick={() => setPreset('obsidian')}
              className="px-2.5 py-1 rounded-lg bg-surface-card border border-white/10 text-[11px] text-white/70 hover:text-white cursor-pointer"
            >
              Obsidian
            </button>
            <button
              type="button"
              onClick={() => setPreset('all')}
              className="px-2.5 py-1 rounded-lg bg-surface-card border border-white/10 text-[11px] text-white/70 hover:text-white cursor-pointer"
            >
              All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {COLORS.map((col) => {
            const isSelected = dna.colors.includes(col.id);
            return (
              <button
                key={col.id}
                type="button"
                onClick={() => toggleColor(col.id)}
                className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-surface-navy border-accent-pink shadow-md'
                    : 'bg-surface-card border-white/10 hover:border-white/20'
                }`}
              >
                <div
                  className="w-6 h-6 rounded-full border border-white/20 shrink-0 shadow-inner flex items-center justify-center"
                  style={{ backgroundColor: col.hex }}
                >
                  {isSelected && (
                    <Check
                      size={12}
                      className={col.id === 'white' || col.id === 'cream' ? 'text-black' : 'text-white'}
                    />
                  )}
                </div>
                <span className="text-xs font-medium text-white truncate">{col.name}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 04: Lifestyle & Occasion Balance */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Sliders size={13} />
            <span>04 / LIFESTYLE &amp; OCCASION BALANCE</span>
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
            Calibrate Your Weekly Routine
          </h2>
          <p className="text-xs text-white/60 font-light">
            Adjust the sliders to reflect how your wardrobe is divided across tailoring, leisure, and travel.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-3xl bg-surface-card border border-white/10 shadow-xl">
          {/* Work */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80 font-medium">Office &amp; Formal Tailoring</span>
              <span className="font-mono text-accent-pink font-semibold">{dna.lifestyle.work}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={dna.lifestyle.work}
              onChange={(e) =>
                onChange({
                  lifestyle: { ...dna.lifestyle, work: Number(e.target.value) },
                })
              }
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-pink"
            />
          </div>

          {/* Leisure */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80 font-medium">Weekend &amp; Off-Duty Leisure</span>
              <span className="font-mono text-accent-cyan font-semibold">{dna.lifestyle.leisure}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={dna.lifestyle.leisure}
              onChange={(e) =>
                onChange({
                  lifestyle: { ...dna.lifestyle, leisure: Number(e.target.value) },
                })
              }
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
          </div>

          {/* Travel */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80 font-medium">International Transit &amp; Travel</span>
              <span className="font-mono text-accent-cyan font-semibold">{dna.lifestyle.travel}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={dna.lifestyle.travel}
              onChange={(e) =>
                onChange({
                  lifestyle: { ...dna.lifestyle, travel: Number(e.target.value) },
                })
              }
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-cyan"
            />
          </div>

          {/* Events */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-white/80 font-medium">Evening &amp; Black-Tie Gala</span>
              <span className="font-mono text-accent-pink font-semibold">{dna.lifestyle.events}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={dna.lifestyle.events}
              onChange={(e) =>
                onChange({
                  lifestyle: { ...dna.lifestyle, events: Number(e.target.value) },
                })
              }
              className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent-pink"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
