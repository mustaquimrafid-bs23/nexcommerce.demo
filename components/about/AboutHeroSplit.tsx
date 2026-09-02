'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShieldCheck, Sparkles, Feather } from 'lucide-react';

export function AboutHeroSplit() {
  return (
    <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-white/10" id="aboutHeroSection" aria-label="Atelier Heritage & Manifesto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Editorial Headline, Manifesto & Section Navigation */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-pink/10 border border-accent-pink/25 text-xs font-semibold uppercase tracking-widest text-accent-pink">
              <Sparkles size={13} />
              <span>Maison Manifesto &middot; Founded 2022</span>
            </div>

            <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.08] text-white">
              The architecture of <span className="italic font-normal">quiet elegance.</span>
            </h1>

            <p className="text-sm sm:text-base text-white/70 leading-relaxed max-w-2xl font-light">
              We reject seasonal disposability in favor of timeless tailoring, noble raw materials, and unhurried craftsmanship. Every garment is constructed to endure across decades, aging with distinction alongside its wearer.
            </p>

            {/* Quick Section Navigation Rail */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium text-white/60">
              <a href="#materials" className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors">
                Noble Materials
              </a>
              <a href="#hotspots" className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors">
                Tactile Inspection
              </a>
              <a href="#disciplines" className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors">
                Craft Disciplines
              </a>
              <a href="#timeline" className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors">
                Our Story
              </a>
              <a href="#guardians" className="px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/10 hover:border-accent-cyan/40 hover:text-accent-cyan transition-colors">
                Master Artisans
              </a>
            </div>
          </div>

          {/* Right Column: Visual Photographic Showcase Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-surface-card p-2 shadow-2xl group">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden">
                <img
                  src="/assets/images/lifestyle/auth_lifestyle.jpg"
                  alt="nexCommerce Tailoring Workshop & Heritage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-obsidian-950/80 backdrop-blur-xl border border-white/10 space-y-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wider text-accent-cyan uppercase">
                    <Feather size={12} />
                    <span>European Provenance</span>
                  </div>
                  <div className="font-editorial text-base text-white">Northern Italy &amp; Paris Atelier Workshops</div>
                  <p className="text-[11px] text-white/50">Hand-finished seams &middot; 100% Traceable supply chain</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
