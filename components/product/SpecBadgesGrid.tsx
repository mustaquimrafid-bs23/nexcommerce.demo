'use client';

import React from 'react';

interface SpecBadgesGridProps {
  category?: string;
}

export function SpecBadgesGrid({ category }: SpecBadgesGridProps) {
  const isAcoustic = category === 'Acoustics' || category === 'acoustics' || category === 'objects';
  const isLeather = category === 'Accessories' || category === 'accessories' || category === 'leather-goods' || category === 'Leather Goods';

  const specs = isAcoustic
    ? [
        { label: 'Acoustic Driver', val: '40mm Beryllium Foil' },
        { label: 'Chassis Material', val: 'Grade 5 Titanium' },
        { label: 'Ear Cushion', val: 'Lambskin Memory Foam' },
        { label: 'Sound Profile', val: 'Zero Harmonic Distortion' },
      ]
    : isLeather
    ? [
        { label: 'Leather Origin', val: 'Tuscan Full-Grain' },
        { label: 'Tannage Method', val: 'Vegetable Chestnut' },
        { label: 'Hardware', val: 'Solid Polished Brass' },
        { label: 'Stitching', val: 'Waxed Saddle Thread' },
      ]
    : [
        { label: 'Composition', val: '100% Mongolian Cashmere' },
        { label: 'Buttons', val: 'Natural Italian Horn' },
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
