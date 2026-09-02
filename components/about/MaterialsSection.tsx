'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Layers } from 'lucide-react';

interface MaterialData {
  id: string;
  name: string;
  subtitle: string;
  desc: string;
  img: string;
  link: string;
  pills: string[];
}

const MATERIALS: MaterialData[] = [
  {
    id: 'cashmere',
    name: 'Mongolian Raw Cashmere',
    subtitle: 'Ultra-Fine 14.2 Micron Thermal Fibers',
    desc: 'Sourced from the high plateaus of the Gobi desert. Only 14-micron fibers are selected for our double-face cardigans and overcoats, preserving natural thermal memory without synthetic blends.',
    img: '/assets/images/lifestyle/hero_sweater_landscape.jpg',
    link: '/category?cat=outerwear',
    pills: ['Weight: 480 GSM', 'Fiber: 14.2 Micron', 'Origin: Inner Mongolia'],
  },
  {
    id: 'leather',
    name: 'Full-Grain Tuscan Calfskin',
    subtitle: 'Chestnut Vegetable-Tanned Leather',
    desc: 'Vegetable-tanned along the Arno river basin using traditional chestnut bark extracts. Naturally ages to develop an individual patina unique to each client’s travels.',
    img: '/assets/images/lifestyle/hero_tote_landscape.jpg',
    link: '/category?cat=accessories',
    pills: ['Tannage: 100% Vegetable', 'Grade: Full Grain A+', 'Origin: Santa Croce, Italy'],
  },
  {
    id: 'titanium',
    name: 'Grade 5 Aerospace Titanium',
    subtitle: 'CNC-Billet Precision Acoustics',
    desc: 'CNC-machined from solid billet blocks. Provides indestructible structural rigidity for headphone chassis and timepiece bezels with zero acoustic resonance coloration.',
    img: '/assets/images/lifestyle/hero_headphone_landscape.jpg',
    link: '/category?cat=acoustics',
    pills: ['Alloy: Ti-6Al-4V', 'Tolerance: ±0.005mm', 'Finish: Micro-Bead Blast'],
  },
  {
    id: 'silk',
    name: 'Como Jacquard Mulberry Silk',
    subtitle: 'Heritage Narrow Shuttle Loom Weave',
    desc: 'Woven on heritage narrow looms near Lake Como. Used exclusively for bespoke suit linings and foulard scarves, offering an ultra-smooth glide over undergarments.',
    img: '/assets/images/lifestyle/runner_lifestyle.png',
    link: '/category?cat=apparel',
    pills: ['Loom: Shuttle Loom', 'Composition: 70/30 Silk-Wool', 'Drape: Fluid Structured'],
  },
];

export function MaterialsSection() {
  const [activeMaterial, setActiveMaterial] = useState<MaterialData>(MATERIALS[0]);

  return (
    <section className="py-16 lg:py-24 bg-surface-navy/15 border-b border-white/10" id="materials" aria-label="Our Materials">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
              <Layers size={13} />
              <span>Materiality &amp; Tactile Provenance</span>
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Noble Raw <span className="italic font-normal">Materials</span>
            </h2>
          </div>
          <p className="text-xs text-white/50 max-w-sm sm:text-right">
            Zero polyester, acrylic, or micro-plastics. Every fiber is biologically pure and renewable.
          </p>
        </div>

        {/* Swatch Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {MATERIALS.map((mat) => {
            const isSelected = activeMaterial.id === mat.id;
            return (
              <button
                key={mat.id}
                onClick={() => setActiveMaterial(mat)}
                className={`p-4 rounded-2xl text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-surface-navy border-accent-pink shadow-lg shadow-accent-pink/15 ring-1 ring-accent-pink/40'
                    : 'bg-surface-card/60 border-white/10 hover:border-white/25 hover:bg-surface-card'
                }`}
              >
                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-accent-pink' : 'text-white/60'}`}>
                  {mat.id}
                </div>
                <div className="text-sm font-semibold text-white truncate">{mat.name}</div>
              </button>
            );
          })}
        </div>

        {/* Active Material Showcase Stage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl bg-surface-card border border-white/10 p-6 sm:p-10 shadow-2xl">
          <div className="lg:col-span-6 space-y-5">
            <div className="space-y-1">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan">
                {activeMaterial.subtitle}
              </span>
              <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal">
                {activeMaterial.name}
              </h3>
            </div>

            <p className="text-sm text-white/70 leading-relaxed">
              {activeMaterial.desc}
            </p>

            {/* Spec Pills */}
            <div className="flex flex-wrap gap-2 pt-2">
              {activeMaterial.pills.map((pill, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-obsidian-950/80 border border-white/10 text-xs font-medium text-white/80"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className="pt-3">
              <Link
                href={activeMaterial.link}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent-crimson hover:bg-accent-crimson/90 text-white text-xs font-semibold uppercase tracking-wider transition-all"
              >
                <span>Browse {activeMaterial.name.split(' ')[0]} Pieces</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-obsidian-950">
              <img
                src={activeMaterial.img}
                alt={activeMaterial.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
