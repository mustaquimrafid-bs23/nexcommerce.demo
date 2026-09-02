'use client';

import React from 'react';
import { Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

const MEASURE_TIPS = [
  {
    step: '01',
    area: 'Chest / Bust',
    desc: 'Pass a flexible tailor tape under your armpits and across the fullest part of your shoulder blades and chest. Keep the tape horizontal and relaxed—do not inhale deeply.',
  },
  {
    step: '02',
    area: 'Natural Waist',
    desc: 'Measure around your natural waistline, located approximately 2 fingers above your navel at the narrowest point of your torso. Maintain your normal posture.',
  },
  {
    step: '03',
    area: 'Shoulder Breadth',
    desc: 'Measure horizontally from the outer edge of your left acromion bone to your right acromion bone across the natural curve of your upper back.',
  },
  {
    step: '04',
    area: 'Sleeve Length',
    desc: 'With your arm slightly bent at the elbow, measure from the center back of your neck across your shoulder point and down to the wrist bone.',
  },
];

export function MeasurementGuide() {
  return (
    <div className="space-y-6 rounded-3xl bg-surface-card border border-white/10 p-6 sm:p-8 shadow-2xl">
      <div className="space-y-1 border-b border-white/10 pb-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
          <Ruler size={13} />
          <span>Tailoring Protocol</span>
        </span>
        <h3 className="font-editorial text-2xl text-white font-normal">
          How to Measure Accurately
        </h3>
        <p className="text-xs text-white/50">
          For true bespoke precision, wear only fine base layers and use a soft cloth measuring tape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {MEASURE_TIPS.map((tip) => (
          <div
            key={tip.step}
            className="p-5 rounded-2xl bg-obsidian-950/60 border border-white/5 space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono text-accent-pink font-bold">{tip.step}</span>
              <CheckCircle2 size={14} className="text-white/20" />
            </div>
            <h4 className="font-editorial text-lg text-white font-normal">{tip.area}</h4>
            <p className="text-xs text-white/60 leading-relaxed font-light">{tip.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
