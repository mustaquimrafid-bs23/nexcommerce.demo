'use client';

import React, { useState } from 'react';

const TIMELINE_MILESTONES = [
  {
    year: '2022',
    title: 'The Paris Atelier Founding',
    desc: 'nexCommerce was born on Rue Saint-Honoré to honor ancestral European garment construction without artificial synthetic fillers.',
    img: '/assets/images/lifestyle/auth_lifestyle.jpg',
  },
  {
    year: '2023',
    title: 'The Tuscan Tannery Alliance',
    desc: 'Formed direct exclusive partnerships with 3rd-generation master vegetable tanners in Santa Croce, Italy for zero-waste leather pieces.',
    img: '/assets/images/lifestyle/tote_lifestyle.png',
  },
  {
    year: '2024',
    title: 'Neural Style Concierge',
    desc: 'Launched on-device generative style intelligence, mapping client lifestyle nuances and climate vectors to bespoke wardrobe capsules.',
    img: '/assets/images/lifestyle/hero_sweater_hd.jpg',
  },
  {
    year: '2025',
    title: 'Circular Craft & Acoustic Lab',
    desc: 'Opened the Berlin acoustic research laboratory and instituted our unconditional Lifetime Atelier Restoration guarantee.',
    img: '/assets/images/lifestyle/hero_headphone_hd.jpg',
  },
  {
    year: '2026',
    title: 'The Modern Digital Maison',
    desc: 'Expanded seamless concierge delivery across all 27 EU member states with zero-knowledge data privacy and 100% Net-0 carbon custody.',
    img: '/assets/images/lifestyle/hero_watch_landscape.jpg',
  },
];

export function CraftTimeline() {
  const [activeIdx, setActiveIdx] = useState(0);
  const milestone = TIMELINE_MILESTONES[activeIdx];

  return (
    <section className="py-16 lg:py-24 bg-surface-navy/15 border-b border-white/10" id="timeline" aria-label="Our Story">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="space-y-2 text-center max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan">
            Chronology of Purpose
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Our <span className="italic font-normal">Journey</span>
          </h2>
          <p className="text-xs text-white/50">
            From an experimental tailoring suite in Paris to a continental atelier of quiet luxury.
          </p>
        </div>

        {/* Milestone Years Selector */}
        <div className="flex items-center justify-between gap-2 max-w-2xl mx-auto overflow-x-auto pb-2 border-b border-white/10">
          {TIMELINE_MILESTONES.map((item, idx) => {
            const isSelected = activeIdx === idx;
            return (
              <button
                key={item.year}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2 rounded-xl text-sm font-bold tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? 'text-accent-pink bg-accent-pink/15 border border-accent-pink/30 shadow-md'
                    : 'text-white/40 hover:text-white/80'
                }`}
              >
                {item.year}
              </button>
            );
          })}
        </div>

        {/* Active Milestone Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-surface-card border border-white/10 p-6 sm:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center shadow-2xl">
          <div className="md:col-span-7 space-y-4">
            <span className="text-3xl font-display font-bold text-accent-cyan">
              {milestone.year}
            </span>
            <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
              {milestone.title}
            </h3>
            <p className="text-sm text-white/70 leading-relaxed font-light">
              {milestone.desc}
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-obsidian-950">
              <img
                src={milestone.img}
                alt={milestone.title}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
