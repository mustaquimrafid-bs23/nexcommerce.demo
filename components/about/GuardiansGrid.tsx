'use client';

import React from 'react';
import { ShieldCheck, Award, Sparkles } from 'lucide-react';

const GUARDIANS = [
  {
    name: 'Gianluca Moretti',
    role: 'Master Tailor & Pattern Architect',
    location: 'Biella, Italy',
    desc: '42 years perfecting the Neapolitan soft shoulder and full-canvas jacket draping.',
    tag: 'Tailoring Direction',
  },
  {
    name: 'Éléonore de Saint-Germain',
    role: 'Head of Leather Metallurgy & Tannery Alliances',
    location: 'Florence, Italy',
    desc: 'Specialist in ancient natural bark infusions and non-toxic vegetable finishes.',
    tag: 'Leather Mastery',
  },
  {
    name: 'Dr. Henrik Lindqvist',
    role: 'Acoustic Engineer & Transducer Designer',
    location: 'Stockholm, Sweden',
    desc: 'Pioneer of low-distortion beryllium foil drivers and passive resonance isolation chambers.',
    tag: 'Acoustic Science',
  },
];

export function GuardiansGrid() {
  return (
    <section className="py-16 lg:py-24 border-b border-white/10" id="guardians" aria-label="The Guardians of Craft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink flex items-center justify-center gap-1.5">
            <Award size={13} />
            <span>Artisans &amp; Engineers</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            The Guardians of <span className="italic font-normal">Craft</span>
          </h2>
          <p className="text-xs text-white/50">
            The master artisans whose hands and standards shape every creation leaving our workshops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {GUARDIANS.map((g, idx) => (
            <div
              key={idx}
              className="p-8 rounded-3xl bg-surface-card border border-white/10 space-y-4 shadow-xl hover:border-white/25 transition-all"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="px-3 py-1 rounded-full bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan font-semibold">
                  {g.tag}
                </span>
                <span className="text-white/40 font-mono">{g.location}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-editorial text-2xl text-white font-normal">
                  {g.name}
                </h3>
                <p className="text-xs text-white/60 font-medium">{g.role}</p>
              </div>

              <p className="text-xs text-white/70 leading-relaxed font-light pt-2 border-t border-white/5">
                {g.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
