'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, MessageSquare, ArrowLeft, Ruler } from 'lucide-react';
import { AnatomicalVisualizer } from '@/components/size-guide/AnatomicalVisualizer';
import { SizeConversionMatrix } from '@/components/size-guide/SizeConversionMatrix';
import { MeasurementGuide } from '@/components/size-guide/MeasurementGuide';
import { useConciergeStore } from '@/store/useConciergeStore';

export default function SizeGuidePage() {
  const { openConcierge, sendMessage } = useConciergeStore();

  const handleAskStylist = () => {
    openConcierge();
    sendMessage('I need personal sizing guidance for my measurements.');
  };

  return (
    <div
      className="min-h-screen text-white pb-24 pt-8"
      style={{ background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)' }}
    >
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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-cyan/15 border border-accent-cyan/30 text-xs font-semibold uppercase tracking-widest text-accent-cyan">
            <Ruler size={13} />
            <span>Find Your Exact Fit</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.08]">
            Size &amp; <span className="italic font-normal">Fit Guide</span>
          </h1>

          <p className="text-sm sm:text-base text-white/70 leading-relaxed font-light">
            Find your exact size with our interactive measurement calculator and conversion tables &mdash; no guessing, just precision.
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
                <span>Personal Advisory</span>
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                Need Personal Sizing <span className="italic font-normal">Advice?</span>
              </h3>
              <p className="text-xs sm:text-sm text-white/70 font-light leading-relaxed">
                Our client style advisor can recommend the best size, silhouette, and layering combinations based on your preferred fit.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <button
                type="button"
                onClick={handleAskStylist}
                className="px-6 py-3.5 rounded-2xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-widest transition-all cursor-pointer shadow-xl shadow-accent-crimson/20 flex items-center justify-center gap-2 hover:scale-105"
              >
                <span>Ask Style Advisor</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
