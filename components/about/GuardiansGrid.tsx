'use client';

import React from 'react';
import { Award, UserCheck } from 'lucide-react';

const CRAFTSMEN = [
  {
    name: 'Gianluca Moretti',
    role: 'Head of Tailoring & Pattern Cutting',
    location: 'Biella, Northern Italy',
    desc: 'Over 40 years perfecting soft unstructured shoulder draping and full-canvas tailoring.',
    tag: 'Tailoring Direction',
    img: '/assets/images/lifestyle/auth_lifestyle.jpg',
  },
  {
    name: 'Éléonore de Saint-Germain',
    role: 'Master Leather Artisan',
    location: 'Florence, Central Italy',
    desc: 'Specialist in traditional natural bark vegetable tanning, saddle stitching, and hand-burnished leather edges.',
    tag: 'Leather Mastery',
    img: '/assets/images/lifestyle/tote_lifestyle.png',
  },
  {
    name: 'Dr. Henrik Lindqvist',
    role: 'Acoustic Design Lead',
    location: 'Stockholm, Sweden',
    desc: 'Pioneer of low-distortion beryllium drivers and balanced acoustic isolation chambers.',
    tag: 'Acoustic Engineering',
    img: '/assets/images/lifestyle/hero_headphone_hd.jpg',
  },
];

export function GuardiansGrid() {
  return (
    <section className="py-16 lg:py-24 border-b border-white/10" id="guardians" aria-label="Our Master Craftsmen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink flex items-center justify-center gap-1.5">
            <Award size={13} />
            <span>Master Craftsmen &amp; Designers</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Our Master <span className="italic font-normal">Craftsmen</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            The skilled artisans whose standards and attention to detail shape every piece leaving our workshops.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CRAFTSMEN.map((g, idx) => (
            <div
              key={idx}
              className="rounded-3xl bg-surface-card border border-white/10 overflow-hidden shadow-xl hover:border-accent-cyan/40 transition-all duration-300 hover:-translate-y-1 group flex flex-col justify-between"
            >
              <div className="aspect-[4/3] overflow-hidden bg-obsidian-950 relative">
                <img
                  src={g.img}
                  alt={g.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 contrast-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-obsidian-950/85 backdrop-blur-md border border-white/20 text-accent-cyan text-[11px] font-semibold uppercase tracking-wider">
                    {g.tag}
                  </span>
                </div>
              </div>

              <div className="p-6 sm:p-8 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-white/50">
                    <span>{g.location}</span>
                  </div>
                  <h3 className="font-editorial text-2xl text-white font-normal group-hover:text-accent-cyan transition-colors">
                    {g.name}
                  </h3>
                  <p className="text-xs text-accent-pink font-medium">{g.role}</p>
                </div>

                <p className="text-xs text-white/70 leading-relaxed font-light pt-3 border-t border-white/5">
                  {g.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
