'use client';

import React from 'react';
import { MoveHorizontal, ArrowLeftRight, Circle, Footprints } from 'lucide-react';

const MEASURE_CARDS = [
  {
    num: '01',
    title: 'Chest Circumference',
    desc: 'Measure horizontally around the fullest part of your chest, keeping the tape comfortable under the arms.',
    icon: MoveHorizontal,
  },
  {
    num: '02',
    title: 'Shoulder Breadth',
    desc: 'Measure across the upper back from shoulder tip to shoulder tip with arms relaxed.',
    icon: ArrowLeftRight,
  },
  {
    num: '03',
    title: 'Natural Waistline',
    desc: 'Measure around the narrowest section of your natural waist, roughly 2 inches above the navel.',
    icon: Circle,
  },
  {
    num: '04',
    title: 'Foot Length',
    desc: 'Place your heel against a flat wall on paper, mark your longest toe, and measure straight along the axis.',
    icon: Footprints,
  },
];

export function MeasurementGuide() {
  return (
    <section aria-labelledby="measureSectionTitle" className="space-y-8">
      <div>
        <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-accent-cyan block mb-2">
          Precision Anatomical Metrics
        </span>
        <h2 id="measureSectionTitle" className="font-editorial text-2xl sm:text-3xl font-semibold text-white tracking-tight">
          How to Measure
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MEASURE_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.num}
              className="p-6 bg-white/[0.02] border border-white/[0.08] rounded-lg flex flex-col gap-3 transition-colors hover:border-white/20"
            >
              <div className="w-10 h-10 rounded-md bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan">
                <Icon size={18} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-accent-cyan tracking-[0.14em]">{card.num}</div>
                <h3 className="text-[13px] font-semibold text-white mt-0.5">{card.title}</h3>
              </div>
              <p className="text-[12px] leading-relaxed text-slate-400 m-0 font-light">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
