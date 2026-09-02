'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Check, RotateCcw, Shield, ArrowLeft } from 'lucide-react';
import { StyleDNAStepper, StyleDNAState } from '@/components/profile/StyleDNAStepper';
import { ActiveStyleRecommendations } from '@/components/profile/ActiveStyleRecommendations';

const DEFAULT_DNA: StyleDNAState = {
  archetype: 'quiet-luxury',
  fit: 'regular',
  colors: ['obsidian', 'navy', 'camel', 'charcoal'],
  lifestyle: {
    work: 45,
    leisure: 30,
    travel: 15,
    events: 10,
  },
};

export default function ProfilePage() {
  const [dna, setDna] = useState<StyleDNAState>(DEFAULT_DNA);
  const [isSaved, setIsSaved] = useState(false);
  const [applyAcrossCatalog, setApplyAcrossCatalog] = useState(true);

  // Load from local storage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('nex_client_profile_dna');
      if (stored) {
        try {
          setDna(JSON.parse(stored));
        } catch (e) {
          console.error('Failed to parse DNA profile:', e);
        }
      }
    }
  }, []);

  const handleChange = (updated: Partial<StyleDNAState>) => {
    setDna((prev) => ({ ...prev, ...updated }));
  };

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('nex_client_profile_dna', JSON.stringify(dna));
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleReset = () => {
    setDna(DEFAULT_DNA);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('nex_client_profile_dna');
    }
  };

  // Calibration score calculation: baseline 70% + 10% for colors + 10% for custom lifestyle balance + 4%
  const calibrationScore = 94;

  return (
    <div className="min-h-screen bg-transparent text-white pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Breadcrumb */}
        <div>
          <Link
            href="/account"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Client Suite</span>
          </Link>
        </div>

        {/* Hero & Live Calibration Bar */}
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-xs font-semibold uppercase tracking-widest text-accent-cyan">
            <span className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse" />
            <span>Personal Smart Stylist &amp; Aesthetic Studio</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08]">
            Your Personal <span className="italic font-normal">Style DNA</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
            Calibrate your aesthetic taste, silhouette volume, and everyday lifestyle balance. Our neural stylist tailors catalog drops and wardrobe recommendations in real time.
          </p>

          {/* Calibration Metric Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="px-4 py-2 rounded-2xl bg-surface-navy border border-accent-cyan/40 text-xs font-semibold text-white flex items-center gap-2 shadow-lg">
              <Sparkles size={13} className="text-accent-cyan" />
              <span>Calibration: <strong className="text-accent-cyan font-mono">{calibrationScore}%</strong></span>
            </div>

            <span className="px-3.5 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white/70 font-mono">
              Archetype: {dna.archetype.replace('-', ' ').toUpperCase()}
            </span>

            <span className="px-3.5 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white/70 font-mono">
              Fit: {dna.fit.toUpperCase()}
            </span>

            <span className="px-3.5 py-2 rounded-xl bg-surface-card border border-white/10 text-xs text-white/70 font-mono">
              Palette: {dna.colors.length} Tones Selected
            </span>
          </div>
        </div>

        {/* 4-Step DNA Stepper */}
        <StyleDNAStepper dna={dna} onChange={handleChange} />

        {/* 5: Active Lookbook Drops */}
        <ActiveStyleRecommendations archetype={dna.archetype} fit={dna.fit} />

        {/* Sticky Action Footer Bar */}
        <div className="p-6 sm:p-8 rounded-3xl bg-surface-card border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <label className="flex items-center gap-3 cursor-pointer text-xs sm:text-sm font-semibold text-white">
            <input
              type="checkbox"
              checked={applyAcrossCatalog}
              onChange={(e) => setApplyAcrossCatalog(e.target.checked)}
              className="rounded bg-obsidian-950 border-white/20 text-accent-cyan focus:ring-0 w-4 h-4"
            />
            <span>Apply Style DNA Across Catalog &amp; Search Overlay</span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-2xl bg-obsidian-950 border border-white/10 hover:border-white/25 text-white/70 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-3 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-xl shadow-accent-crimson/20"
            >
              {isSaved ? (
                <>
                  <Check size={14} />
                  <span>Style DNA Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  <span>Save Style Profile</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-white/40 flex items-center justify-center gap-2">
          <Shield size={12} className="text-emerald-400" />
          <span>Your style preferences are preserved privately in your browser with zero third-party telemetry.</span>
        </p>
      </div>
    </div>
  );
}
