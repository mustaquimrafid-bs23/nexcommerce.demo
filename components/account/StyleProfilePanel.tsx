'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Shield, Trash2 } from 'lucide-react';
import { StylePreferences, ActivitySignal } from './types';

interface StyleProfilePanelProps {
  preferences: StylePreferences;
  onUpdatePreference: (key: keyof StylePreferences, value: string) => void;
  signals: ActivitySignal[];
  onClearProfile: () => void;
}

export function StyleProfilePanel({
  preferences,
  onUpdatePreference,
  signals,
  onClearProfile,
}: StyleProfilePanelProps) {
  const styles = ['Minimal', 'Classic', 'Relaxed', 'Statement'];
  const fits = ['Slim', 'Regular', 'Relaxed'];
  const colors = ['Monochrome', 'Earth Tones', 'Jewel Tones', 'Brights'];
  const brands = ['Loro Piana', 'Brunello Cucinelli', 'Acne Studios', 'Jil Sander'];

  return (
    <div className="space-y-6">
      {/* Top Banner Widget */}
      <div className="bg-gradient-to-br from-accent-cyan/[0.06] to-accent-pink/[0.04] border border-accent-cyan/15 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[9px] font-bold tracking-[0.14em] text-accent-cyan uppercase block">
              ACTIVE STYLE PROFILE
            </span>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Quiet Luxury &amp; Nordic Minimal
            </h2>
            <p className="text-xs sm:text-[13px] text-white/60 leading-relaxed">
              Your style preferences are actively personalising catalogue recommendations across tailoring, knitwear, and everyday essentials.
            </p>
          </div>

          <Link
            href="/concierge"
            className="h-10 px-5 rounded-lg bg-accent-cyan text-obsidian-950 hover:bg-accent-cyan/90 font-semibold text-xs tracking-wider uppercase transition-all flex items-center gap-2 flex-shrink-0 shadow-md shadow-accent-cyan/20 min-h-[40px]"
          >
            <Sparkles size={13} />
            <span>Consult Stylist</span>
          </Link>
        </div>
      </div>

      {/* Explicit Style & Fit Profile Card */}
      <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-6 sm:p-7 space-y-6">
        <div>
          <h3 className="text-sm font-bold tracking-wider text-white uppercase mb-1">
            YOUR STYLE &amp; FIT PROFILE
          </h3>
          <p className="text-xs text-white/50">
            Explicit preferences guide our recommendations. You are always in control.
          </p>
        </div>

        {/* Style Aesthetic */}
        <div className="space-y-2.5">
          <span className="block text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase">
            STYLE AESTHETIC
          </span>
          <div className="flex flex-wrap gap-2">
            {styles.map((s) => {
              const isSelected = preferences.style === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onUpdatePreference('style', s)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[36px] ${
                    isSelected
                      ? 'bg-accent-cyan text-obsidian-950 shadow-sm shadow-accent-cyan/20'
                      : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/10'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Fit Preference */}
        <div className="space-y-2.5">
          <span className="block text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase">
            FIT PREFERENCE
          </span>
          <div className="flex flex-wrap gap-2">
            {fits.map((f) => {
              const isSelected = preferences.fit === f;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => onUpdatePreference('fit', f)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[36px] ${
                    isSelected
                      ? 'bg-accent-cyan text-obsidian-950 shadow-sm shadow-accent-cyan/20'
                      : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/10'
                  }`}
                >
                  {f}
                </button>
              );
            })}
          </div>
        </div>

        {/* Colour Palette (UK English) */}
        <div className="space-y-2.5">
          <span className="block text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase">
            COLOUR PALETTE
          </span>
          <div className="flex flex-wrap gap-2">
            {colors.map((c) => {
              const isSelected = preferences.color === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => onUpdatePreference('color', c)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[36px] ${
                    isSelected
                      ? 'bg-accent-cyan text-obsidian-950 shadow-sm shadow-accent-cyan/20'
                      : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/10'
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favourite Designers (UK English) */}
        <div className="space-y-2.5">
          <span className="block text-[9px] font-bold tracking-[0.12em] text-white/40 uppercase">
            FAVOURITE DESIGNERS
          </span>
          <div className="flex flex-wrap gap-2">
            {brands.map((b) => {
              const isSelected = preferences.brand === b;
              return (
                <button
                  key={b}
                  type="button"
                  onClick={() => onUpdatePreference('brand', b)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer min-h-[36px] ${
                    isSelected
                      ? 'bg-accent-cyan text-obsidian-950 shadow-sm shadow-accent-cyan/20'
                      : 'bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/10'
                  }`}
                >
                  {b}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Activity Preferences Card */}
      <div className="bg-accent-cyan/[0.03] border border-accent-cyan/15 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold tracking-wider text-accent-cyan uppercase">
            ACTIVITY PREFERENCES
          </h3>
          <span className="text-[10px] font-semibold text-white/40 uppercase tracking-wider">
            IMPLICIT SIGNALS
          </span>
        </div>

        <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed">
          Based on your previous browsing and search history (such as &ldquo;warm for a cool evening in Milan&rdquo;), we have learned that you often prefer minimal silhouettes and relaxed fits for city evening wear.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {signals.map((sig, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-obsidian-950/70 border border-white/10 text-xs"
            >
              <span className="text-white font-medium">{sig.name}</span>
              <span className="text-[10px] font-semibold text-accent-cyan bg-accent-cyan/10 px-2.5 py-0.5 rounded-full border border-accent-cyan/20">
                {sig.level}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Privacy & Reset Card */}
      <div className="bg-accent-pink/[0.03] border border-accent-pink/15 rounded-2xl p-6 sm:p-7 space-y-4">
        <div className="flex items-center gap-2">
          <Shield size={16} className="text-accent-pink" />
          <h3 className="text-sm font-bold tracking-wider text-accent-pink uppercase">
            DATA TRANSPARENCY &amp; PRIVACY
          </h3>
        </div>

        <p className="text-xs sm:text-[13px] text-white/70 leading-relaxed">
          nexCommerce uses your choices and search activity to tailor product recommendations and discovery results. We do not sell this data. You can clear your personal style profile at any time.
        </p>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClearProfile}
            className="h-10 px-5 rounded-lg border border-accent-pink/40 hover:border-accent-pink hover:bg-accent-pink/10 text-accent-pink text-xs font-semibold tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer min-h-[40px]"
          >
            <Trash2 size={13} />
            <span>Clear Style Profile Data</span>
          </button>
        </div>
      </div>
    </div>
  );
}
