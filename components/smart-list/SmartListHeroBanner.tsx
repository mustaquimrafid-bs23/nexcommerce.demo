'use client';

import React from 'react';
import { motion } from 'motion/react';

export function SmartListHeroBanner() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full overflow-hidden rounded-2xl mb-8 border border-white/10 shadow-2xl bg-obsidian-950"
      aria-label="Smart List Selection Collection"
    >
      <div className="relative aspect-[16/6.5] max-h-[460px] w-full overflow-hidden bg-obsidian-900">
        <img
          src="/assets/images/lifestyle/smart_list_pure_hero_banner.jpg?v=5"
          alt="nexCommerce Smart List Replenishment Collection"
          className="w-full h-full object-cover object-[center_62%] transition-transform duration-1000 ease-out hover:scale-[1.015]"
          loading="eager"
        />
        {/* Subtle Luxury Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian-950/80 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(3,8,20,0.55)_100%)] pointer-events-none" />
      </div>
    </motion.section>
  );
}
