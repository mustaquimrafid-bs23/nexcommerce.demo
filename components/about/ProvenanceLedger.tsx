'use client';

import React from 'react';
import { ShieldCheck, Leaf, Award, Truck } from 'lucide-react';

const STANDARDS = [
  {
    icon: Leaf,
    val: '100%',
    label: 'Traceable Materials',
    subtext: 'Direct partnerships with certified organic mills and heritage tanneries.',
  },
  {
    icon: ShieldCheck,
    val: '0%',
    label: 'Synthetic Plastics',
    subtext: 'Zero polyester, acrylic, or petroleum polymers across all main garments.',
  },
  {
    icon: Award,
    val: '25 YR',
    label: 'Craft Guarantee',
    subtext: 'Complimentary seam, button, and lining care for the lifetime of each piece.',
  },
  {
    icon: Truck,
    val: '100%',
    label: 'Carbon-Neutral Transit',
    subtext: 'Zero-emission European logistics and reusable organic gift presentation boxes.',
  },
];

export function ProvenanceLedger() {
  return (
    <section className="py-16 lg:py-24 border-b border-white/10" id="provenance" aria-label="Our Standards and Promises">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan flex items-center justify-center gap-1.5">
            <ShieldCheck size={13} />
            <span>Integrity &amp; Care</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Our Standards &amp; <span className="italic font-normal">Promises</span>
          </h2>
          <p className="text-xs text-white/60 font-light">
            Every garment is produced responsibly with transparent European provenance.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STANDARDS.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-3xl bg-surface-card border border-white/10 hover:border-accent-cyan/40 transition-all duration-300 flex flex-col justify-between space-y-6 shadow-xl hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center text-accent-cyan group-hover:scale-110 transition-transform">
                  <Icon size={20} />
                </div>

                <div className="space-y-1">
                  <div className="font-display text-4xl sm:text-5xl font-bold text-white tracking-tight">
                    {s.val}
                  </div>
                  <h3 className="font-editorial text-lg text-white font-normal group-hover:text-accent-cyan transition-colors">
                    {s.label}
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed font-light pt-2 border-t border-white/5">
                    {s.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
