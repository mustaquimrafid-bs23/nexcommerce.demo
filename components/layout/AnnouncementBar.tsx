'use client';

import React from 'react';
import { RotateCcw, ShieldCheck, Truck } from 'lucide-react';

export function AnnouncementBar() {
  return (
    <div
      className="top-announcement-bar bg-[#040a14]/95 border-b border-white/5 text-[11px] font-medium tracking-[0.035em] text-white/70 h-8 flex items-center justify-center relative z-50 transition-all duration-300"
      id="topAnnouncementBar"
    >
      <div className="container announcement-inner max-w-7xl mx-auto px-4 w-full flex items-center justify-center gap-4 text-center">
        {/* Item 1: Returns */}
        <span className="announcement-item hidden sm:inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors whitespace-nowrap">
          <RotateCcw size={12} className="text-[#F13365]" />
          <span>14-day free returns</span>
        </span>

        {/* Separator Dot */}
        <span className="announcement-dot hidden sm:inline-block w-[3px] h-[3px] rounded-full bg-white/25" aria-hidden="true" />

        {/* Item 2: Authenticity */}
        <span className="announcement-item hidden sm:inline-flex items-center gap-1.5 text-white/70 hover:text-white transition-colors whitespace-nowrap">
          <ShieldCheck size={12} className="text-[#F13365]" />
          <span>100% genuine items</span>
        </span>

        {/* Separator Dot */}
        <span className="announcement-dot hidden sm:inline-block w-[3px] h-[3px] rounded-full bg-white/25" aria-hidden="true" />

        {/* Item 3: Delivery */}
        <span className="announcement-item inline-flex items-center justify-center gap-1.5 text-white/70 hover:text-white transition-colors whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
          <Truck size={12} className="text-[#F13365]" />
          <span>Free express delivery on orders over € 150.00</span>
        </span>
      </div>
    </div>
  );
}
