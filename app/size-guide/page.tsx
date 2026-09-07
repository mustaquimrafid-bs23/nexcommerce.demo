'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';
import { AnatomicalVisualizer } from '@/components/size-guide/AnatomicalVisualizer';
import { SizeConversionMatrix } from '@/components/size-guide/SizeConversionMatrix';
import { MeasurementGuide } from '@/components/size-guide/MeasurementGuide';
import { useConciergeStore } from '@/store/useConciergeStore';

export default function SizeGuidePage() {
  const { openConcierge, sendMessage } = useConciergeStore();

  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const [recSize, setRecSize] = useState<number>(48);
  const [recShoeEU, setRecShoeEU] = useState<number>(42);

  const handleAskStylist = () => {
    openConcierge();
    sendMessage('I need personal sizing guidance for my measurements.');
  };

  return (
    <div
      className="min-h-screen text-white overflow-x-hidden"
      style={{ background: 'radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)' }}
    >
      <main className="max-w-[1320px] w-full mx-auto px-6 pt-10 pb-24 sm:pb-32 flex flex-col gap-16 lg:gap-24">
        {/* Page Hero matching feature/storefront-elevation:pages/size-guide.html */}
        <section className="text-center flex flex-col items-center gap-4 pt-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-accent-cyan/10 border border-accent-cyan/25 rounded-full text-[11px] font-semibold tracking-[0.18em] uppercase text-accent-cyan">
            <span>✦ Sartorial Precision</span>
            <span>·</span>
            <span>Atelier Fit Engine</span>
          </div>

          <h1 className="font-editorial text-4xl sm:text-5xl lg:text-[60px] font-semibold text-white tracking-tight leading-[1.1] m-0">
            Your Anatomical Size, Perfected
          </h1>

          {/* Subtitle & SEO text honoring clean UK Size & Fit Guide standards */}
          <p className="text-[15px] sm:text-[17px] leading-relaxed text-slate-400 max-w-[560px] font-light m-0">
            Calibrate your measurements with our interactive 2D silhouette visualizer to discover your precise European atelier sizing.
          </p>
          <span className="sr-only">nexCommerce Luxury Size &amp; Fit Guide</span>
        </section>

        {/* 1. 2D Silhouette Visualizer & Calibrator Controls */}
        <AnatomicalVisualizer
          unit={unit}
          onUnitChange={setUnit}
          onRecommendedSizeChange={(size, shoe) => {
            setRecSize(size);
            setRecShoeEU(shoe);
          }}
        />

        {/* 2. Precision Anatomical Metrics — How to Measure */}
        <MeasurementGuide />

        {/* 3. Global Equivalency — Size Conversion Chart (Interactive Cards) */}
        <SizeConversionMatrix
          recSize={recSize}
          recShoeEU={recShoeEU}
          unit={unit}
        />

        {/* 4. Bespoke Advisor — Concierge Bridge */}
        <section className="text-center p-12 sm:p-16 bg-white/[0.02] border border-white/[0.08] rounded-lg flex flex-col items-center gap-3.5 shadow-2xl relative overflow-hidden">
          <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent-cyan block">
            Bespoke Advisor
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl font-semibold text-white tracking-tight m-0">
            Not sure about your size?
          </h2>
          <p className="text-sm text-slate-400 max-w-[480px] leading-relaxed m-0 font-light mb-2">
            Our digital style concierge provides real-time sizing guidance for specific pieces in the collection.
          </p>

          <button
            type="button"
            onClick={handleAskStylist}
            className="h-[46px] px-8 bg-white hover:bg-slate-100 text-[#020B18] rounded-md text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xl hover:scale-[1.03]"
          >
            <Sparkles size={14} className="text-[#020B18]" />
            <span>Consult Private Concierge</span>
          </button>
        </section>
      </main>
    </div>
  );
}
