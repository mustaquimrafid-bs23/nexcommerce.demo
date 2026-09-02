'use client';

import React from 'react';
import { Shield, Sparkles, Feather, Clock } from 'lucide-react';

interface SpecBadgesGridProps {
  category?: string;
}

export function SpecBadgesGrid({ category }: SpecBadgesGridProps) {
  const isAcoustic = category === 'Acoustics';
  const isLeather = category === 'Accessories';

  const specs = isAcoustic
    ? [
        { label: 'Acoustic Driver', val: '40mm Beryllium Foil' },
        { label: 'Chassis Metallurgy', val: 'Grade 5 Titanium' },
        { label: 'Ear Cushion', val: 'Lambskin Memory Foam' },
        { label: 'Acoustic Tuning', val: 'Zero Harmonic Distortion' },
      ]
    : isLeather
    ? [
        { label: 'Leather Origin', val: 'Tuscan Full-Grain' },
        { label: 'Tannage Method', val: '100% Vegetable Chestnut' },
        { label: 'Hardware', val: 'Solid Polished Brass' },
        { label: 'Stitching', val: 'Waxed Saddle Thread' },
      ]
    : [
        { label: 'Materiality', val: '100% Mongolian Cashmere' },
        { label: 'Button Architecture', val: 'Italian Horn Buttons' },
        { label: 'Construction', val: 'Full Floating Canvas' },
        { label: 'Finishing', val: 'Hand-Rolled Silk Edges' },
      ];

  return (
    <div
      id="pdpSpecBadgesGrid"
      className="grid grid-cols-2 gap-2.5 p-4 rounded-2xl bg-surface-card/60 border border-white/10 text-xs"
    >
      {specs.map((s, idx) => (
        <div key={idx} className="space-y-0.5">
          <span className="text-[10px] font-mono text-white/40 uppercase block">{s.label}</span>
          <span className="font-medium text-white/90">{s.val}</span>
        </div>
      ))}
    </div>
  );
}
