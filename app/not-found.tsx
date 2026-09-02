'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sparkles, ArrowRight, Home, Compass } from 'lucide-react';

export default function NotFound() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/discovery?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-[85vh] bg-transparent text-white flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-16 relative overflow-hidden">
      {/* 404 Large Typographic Watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[160px] sm:text-[240px] lg:text-[320px] font-display font-black text-white/[0.03] select-none pointer-events-none"
        aria-hidden="true"
      >
        404
      </div>

      <div className="max-w-4xl w-full mx-auto text-center space-y-10 relative z-10">
        {/* Eyebrow and Headline */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-pink/15 border border-accent-pink/30 text-xs font-semibold uppercase tracking-widest text-accent-pink">
            <Compass size={13} />
            <span>404 &middot; Architectural Recovery</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08]" aria-label="Destination Unavailable">
            Destination Unavailable
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light max-w-xl mx-auto">
            The coordinates you requested do not reside within the current atelier architecture. Explore our curated wings or engage the Style Concierge below.
          </p>
        </div>

        {/* Natural Search Bar */}
        <div className="max-w-xl mx-auto">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the collection (e.g., 'Cashmere Turtleneck', 'Blazer')..."
              className="w-full pl-5 pr-14 py-3.5 rounded-2xl bg-surface-card border border-white/15 focus:border-accent-cyan/60 text-white placeholder-white/40 text-xs sm:text-sm outline-none transition-all shadow-2xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-accent-cyan/15 hover:bg-accent-cyan/25 text-accent-cyan flex items-center justify-center transition-colors cursor-pointer"
            >
              <Search size={16} />
            </button>
          </form>

          {/* Discovery Query Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4 text-xs">
            <Link
              href="/category?cat=outerwear"
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors"
            >
              &part; Tailored Cashmere
            </Link>
            <Link
              href="/discovery?q=minimalist%20overcoat"
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors"
            >
              &part; Milan Winter Coats
            </Link>
            <Link
              href="/category?cat=acoustics"
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors"
            >
              &part; High Acoustics
            </Link>
            <Link
              href="/smart-list"
              className="px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-white/70 hover:text-accent-cyan hover:border-accent-cyan/40 transition-colors"
            >
              &part; Smart List &amp; Vault
            </Link>
          </div>
        </div>

        {/* 4 Main Curated Gateway Wings */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left pt-2">
          {/* Wing 1 */}
          <Link
            href="/smart-list"
            className="p-5 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-cyan/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group hover:-translate-y-1"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-cyan block">
                Agentic Commerce
              </span>
              <h3 className="font-editorial text-lg text-white font-normal group-hover:text-accent-cyan transition-colors">
                Smart List &amp; Vault
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Smart predictive wardrobe planning, budget caps, and dynamic auto-ordering.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-cyan pt-2">
              <span>Explore Smart List</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 2 */}
          <Link
            href="/category?cat=outerwear"
            className="p-5 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-pink/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group hover:-translate-y-1"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-pink block">
                Ready-to-Wear
              </span>
              <h3 className="font-editorial text-lg text-white font-normal group-hover:text-accent-pink transition-colors">
                Tailored Silhouettes
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Double-breasted overcoats, cashmere crewnecks, and architectural trousers.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-pink pt-2">
              <span>Explore Apparel</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 3 */}
          <Link
            href="/category?cat=acoustics"
            className="p-5 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-cyan/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group hover:-translate-y-1"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-cyan block">
                Acoustic Craft
              </span>
              <h3 className="font-editorial text-lg text-white font-normal group-hover:text-accent-cyan transition-colors">
                High Acoustics &amp; Watches
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Beryllium planar magnetic audio instruments and obsidian automatic timepieces.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-cyan pt-2">
              <span>Explore Acoustics</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Wing 4 */}
          <Link
            href="/concierge"
            className="p-5 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-pink/40 transition-all flex flex-col justify-between space-y-4 shadow-xl group hover:-translate-y-1"
          >
            <div className="space-y-2">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-accent-pink block">
                Private Styling
              </span>
              <h3 className="font-editorial text-lg text-white font-normal group-hover:text-accent-pink transition-colors">
                Style Concierge
              </h3>
              <p className="text-xs text-white/60 font-light leading-relaxed">
                Engage our conversational digital tailor for bespoke outfit assembly and sizing.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-pink pt-2">
              <span>Open Concierge</span>
              <Sparkles size={12} />
            </div>
          </Link>
        </div>

        {/* Bottom Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Link
            href="/"
            className="px-8 py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all shadow-xl shadow-accent-crimson/20 hover:scale-105"
          >
            <Home size={14} />
            <span>Return to Maison Homepage</span>
          </Link>
          <Link
            href="/category"
            className="px-8 py-3.5 rounded-2xl bg-surface-card border border-white/15 hover:border-white/30 text-white text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all hover:bg-surface-navy"
          >
            <span>Explore All Collections</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
