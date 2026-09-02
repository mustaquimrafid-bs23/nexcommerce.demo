'use client';

import React, { useState } from 'react';
import { Sparkles, ZoomIn, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Hotspot {
  id: string;
  top: string;
  left: string;
  tag: string;
  title: string;
  desc: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'chest',
    top: '36%',
    left: '42%',
    tag: 'Internal Structure',
    title: 'Floating Canvas Chest Piece',
    desc: 'Crafted from unglued natural horsehair canvas. It gently softens and shapes to the wearer’s body heat over time, creating a natural silhouette without stiff fusible adhesives.',
  },
  {
    id: 'lapel',
    top: '24%',
    left: '58%',
    tag: 'Lapel Architecture',
    title: 'Hand-Padded Lapels',
    desc: 'Over 800 hand-sewn pad stitches create a soft three-dimensional roll that never collapses, pressing gently against the collarbone.',
  },
  {
    id: 'seam',
    top: '68%',
    left: '52%',
    tag: 'Precision Stitching',
    title: 'Enclosed French Seams',
    desc: 'Double-folded interior seams with 18 stitches per inch. Cleanly bound with mulberry silk tape to eliminate raw fraying edges for decades of wear.',
  },
];

export function HotspotViewer() {
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(HOTSPOTS[0]);

  return (
    <section className="py-16 lg:py-24 border-b border-white/10" id="hotspots" aria-label="Explore Our Craftsmanship">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
              <ZoomIn size={13} />
              <span>Tactile Inspection</span>
            </span>
            <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
              Explore Our <span className="italic font-normal">Craftsmanship</span>
            </h2>
          </div>
          <p className="text-xs text-white/60 max-w-sm sm:text-right font-light">
            Select any pulsing point to inspect our hidden structural tailoring techniques.
          </p>
        </div>

        {/* Hotspot Stage */}
        <div className="relative aspect-[16/9] max-h-[580px] w-full rounded-3xl overflow-hidden border border-white/15 bg-obsidian-950 shadow-2xl">
          <img
            src="/assets/images/lifestyle/hero_sweater_hd.jpg"
            alt="nexCommerce Tailoring Anatomy & Fine Craft"
            className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-obsidian-950/20 pointer-events-none" />

          {/* Interactive Pins */}
          {HOTSPOTS.map((spot) => {
            const isActive = activeHotspot?.id === spot.id;
            return (
              <div
                key={spot.id}
                style={{ top: spot.top, left: spot.left }}
                className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              >
                <button
                  onClick={() => setActiveHotspot(isActive ? null : spot)}
                  className={`relative w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                    isActive
                      ? 'bg-accent-cyan text-obsidian-950 scale-110 shadow-lg shadow-accent-cyan/50 ring-2 ring-white'
                      : 'bg-obsidian-950/90 text-white border border-white/60 hover:scale-110 hover:border-accent-cyan'
                  }`}
                  aria-label={`Inspect ${spot.title}`}
                >
                  <span className="absolute inset-0 rounded-full border border-accent-cyan animate-ping opacity-50" />
                  <Info size={14} className="relative z-10" />
                </button>
              </div>
            );
          })}

          {/* Floating Detail Popover */}
          <AnimatePresence>
            {activeHotspot && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-6 left-6 right-6 sm:right-auto sm:max-w-md p-6 rounded-2xl bg-obsidian-950/90 backdrop-blur-xl border border-white/20 shadow-2xl z-20 space-y-2 text-left"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan">
                    {activeHotspot.tag}
                  </span>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-white/40 hover:text-white text-xs px-2 py-0.5 rounded cursor-pointer"
                  >
                    Close &times;
                  </button>
                </div>
                <h3 className="font-editorial text-xl text-white font-normal">
                  {activeHotspot.title}
                </h3>
                <p className="text-xs text-white/70 leading-relaxed font-light">
                  {activeHotspot.desc}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
