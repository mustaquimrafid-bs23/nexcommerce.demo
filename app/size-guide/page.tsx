'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, MessageSquare, ArrowLeft } from 'lucide-react';
import { AnatomicalVisualizer } from '@/components/size-guide/AnatomicalVisualizer';
import { SizeConversionMatrix } from '@/components/size-guide/SizeConversionMatrix';
import { MeasurementGuide } from '@/components/size-guide/MeasurementGuide';
import { useConciergeStore } from '@/store/useConciergeStore';

export default function SizeGuidePage() {
  const { openConcierge } = useConciergeStore();

  const handleAskStylist = () => {
    openConcierge('I need personal sizing guidance for my measurements.');
  };

  return (
    <div className="min-h-screen bg-transparent text-white pb-24 pt-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div>
          <Link
            href="/category"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 hover:text-accent-cyan transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Return to Collections</span>
          </Link>
        </div>

        {/* Hero Section */}
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-pink/15 border border-accent-pink/30 text-xs font-semibold uppercase tracking-widest text-accent-pink">
            <Sparkles size={13} />
            <span>Atelier Fit Architecture</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08]">
            Anatomical Size &amp; <span className="italic font-normal">Fit Calibrator</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
            Every garment from the Maison is cut with architectural precision. Adjust your biometric measurements below to calculate your exact European size, drape ease, and proportional fit.
          </p>
        </div>

        {/* 1. Interactive Anatomical Calibrator */}
        <AnatomicalVisualizer />

        {/* 2. Size Conversion Matrix */}
        <SizeConversionMatrix />

        {/* 3. Illustrated Measurement Guide */}
        <MeasurementGuide />

        {/* 4. Style Concierge Sizing Bridge */}
        <section className="rounded-3xl bg-surface-card border border-accent-cyan/30 p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-8 space-y-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
                <MessageSquare size={13} />
                <span>Private Consultation</span>
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Still Uncertain About Your <span className="italic font-normal">Proportions?</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Our master pattern tailors and neural Style Concierge can evaluate your garment selection against your personal wardrobe choices.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                type="button"
                onClick={handleAskStylist}
                className="px-6 py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-accent-crimson/20 flex items-center justify-center gap-2"
              >
                <span>Consult Style Concierge</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
