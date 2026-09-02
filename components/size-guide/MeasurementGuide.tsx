'use client';

import React from 'react';
import { Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

const MEASURE_TIPS = [
  {
    step: '01',
    area: 'Chest Measurement',
    desc: 'Pass a flexible tailor tape under your armpits and across the fullest part of your chest. Keep the tape straight and level—do not pull tight or inhale deeply.',
  },
  {
    step: '02',
    area: 'Natural Waist',
    desc: 'Measure around your natural waistline, located approximately 2 inches above your navel at the narrowest point of your torso. Maintain your normal posture.',
  },
  {
    step: '03',
    area: 'Shoulder Width',
    desc: 'Measure straight across the upper back from the outer point of the left shoulder to the outer point of the right shoulder.',
  },
  {
    step: '04',
    area: 'Inside Leg / Inseam',
    desc: 'Stand upright with legs slightly apart. Measure from the top of your inner thigh straight down to the ankle bone.',
  },
];

export function MeasurementGuide() {
  return (
    <div className="space-y-6 rounded-3xl bg-surface-card border border-white/10 p-6 sm:p-8 shadow-2xl">
      <div className="space-y-1 border-b border-white/10 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
          <Ruler size={13} />
          <span>Tailoring Guidelines</span>
        </span>
        <h3 className="font-editorial text-2xl text-white font-normal">
          How to Measure Accurately
        </h3>
        <p className="text-xs text-white/60 font-light">
          For the most accurate fit, wear lightweight clothing and use a soft, flexible measuring tape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MEASURE_TIPS.map((tip) => (
          <div
            key={tip.step}
            className="p-5 rounded-2xl bg-obsidian-950/60 border border-white/5 space-y-3 shadow-md hover:border-accent-cyan/30 transition-all group"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-accent-pink font-bold">{tip.step}</span>
              <CheckCircle2 size={14} className="text-white/20 group-hover:text-accent-cyan transition-colors" />
            </div>
            <h4 className="font-editorial text-lg text-white font-normal group-hover:text-accent-cyan transition-colors">
              {tip.area}
            </h4>
            <p className="text-xs text-white/60 leading-relaxed font-light">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
