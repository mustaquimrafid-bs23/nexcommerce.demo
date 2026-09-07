'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AboutHeroSplit } from '@/components/about/AboutHeroSplit';
import { MaterialsSection } from '@/components/about/MaterialsSection';
import { HotspotViewer } from '@/components/about/HotspotViewer';
import { DisciplinesGrid } from '@/components/about/DisciplinesGrid';
import { CraftTimeline } from '@/components/about/CraftTimeline';
import { ProvenanceLedger } from '@/components/about/ProvenanceLedger';
import { GuardiansGrid } from '@/components/about/GuardiansGrid';

export default function AboutPage() {
  return (
    <div className="min-h-screen text-white pb-24" style={{ background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)' }}>
      {/* 1. Atelier Heritage & Philosophy Split Hero */}
      <AboutHeroSplit />

      {/* 2. Interactive Noble Materials Swatch Stage */}
      <MaterialsSection />

      {/* 3. Tactile Craftsmanship Hotspot Viewer */}
      <HotspotViewer />

      {/* 4. Four Pillars of Design Disciplines Grid */}
      <DisciplinesGrid />

      {/* 5. Chronology of Purpose Interactive Timeline */}
      <CraftTimeline />

      {/* 6. Standards & Promises Infographic Ledger */}
      <ProvenanceLedger />

      {/* 7. The Master Artisans & Designers */}
      <GuardiansGrid />

      {/* 8. Collection Invitation Banner */}
      <section className="py-20 bg-obsidian-950/80 border-b border-white/10 text-center" aria-label="Atelier Invitation">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs font-semibold text-accent-cyan">
            <Sparkles size={13} />
            <span>Complimentary UK &amp; European Delivery</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl text-white font-normal">
            Experience the <span className="italic font-normal">Collections</span>
          </h2>

          <p className="text-sm text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            All pieces arrive in our signature gift presentation box with reusable organic dust bags, carbon-neutral shipping, and 30-day complimentary returns.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/category"
              className="px-8 py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest transition-all shadow-xl shadow-accent-crimson/25 hover:scale-105"
            >
              Explore Collections
            </Link>
            <Link
              href="/smart-list"
              className="px-8 py-3.5 rounded-2xl bg-surface-card border border-white/15 hover:border-white/30 text-white text-xs font-semibold uppercase tracking-widest transition-all hover:bg-surface-navy"
            >
              Smart Replenishment
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
