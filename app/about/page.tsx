'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AboutHeroSplit } from '@/components/about/AboutHeroSplit';
import { MaterialsSection } from '@/components/about/MaterialsSection';
import { DisciplinesGrid } from '@/components/about/DisciplinesGrid';
import { CraftTimeline } from '@/components/about/CraftTimeline';
import { GuardiansGrid } from '@/components/about/GuardiansGrid';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent text-white pb-24">
      {/* 1. Atelier Heritage & Manifesto Split Hero */}
      <AboutHeroSplit />

      {/* 2. Interactive Noble Materials Swatch Stage */}
      <MaterialsSection />

      {/* 3. Four Pillars of Craft Disciplines Grid */}
      <DisciplinesGrid />

      {/* 4. Chronology of Purpose Interactive Timeline */}
      <CraftTimeline />

      {/* 5. The Guardians of Craft Master Artisans */}
      <GuardiansGrid />

      {/* 6. Collection Invitation Banner */}
      <section className="py-20 bg-obsidian-950/80 border-b border-white/10 text-center" aria-label="Atelier Invitation">
        <div className="max-w-3xl mx-auto px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-xs font-semibold text-accent-cyan">
            <Sparkles size={13} />
            <span>Continental Atelier Delivery</span>
          </div>

          <h2 className="font-editorial text-4xl sm:text-5xl text-white font-normal">
            Experience the <span className="italic font-normal">Creations</span>
          </h2>

          <p className="text-sm text-white/60 max-w-xl mx-auto font-light leading-relaxed">
            All pieces arrive in our signature gift presentation box with reusable organic dust bags, white-glove carbon custody, and complimentary European returns.
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
