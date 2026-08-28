'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface HelpDeskHeroProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onQuickCategorySelect: (cat: string) => void;
  selectedCategory?: string;
}

export function HelpDeskHero({
  searchQuery,
  onSearchChange,
  onQuickCategorySelect,
  selectedCategory = 'all',
}: HelpDeskHeroProps) {
  return (
    <section className="relative pt-8 pb-8 sm:pt-12 sm:pb-10 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] overflow-hidden">
      {/* Ambient background sapphire lighting */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15) 0%, rgba(10, 58, 120, 0.2) 35%, transparent 70%)',
        }}
      />

      <div className="max-w-3xl mx-auto text-center flex flex-col items-center">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-white mb-2 leading-tight">
          Help &amp; <em className="font-serif italic font-normal text-white/95">Customer Support</em>
        </h1>

        {/* Short Subtitle */}
        <p className="text-xs sm:text-sm text-white/70 max-w-lg mx-auto leading-relaxed mb-6 font-normal">
          Find answers to common questions about orders, shipping, and returns, or message our support team.
        </p>

        {/* Quick Search Hub Input */}
        <div className="w-full max-w-xl relative">
          <div className="relative flex items-center">
            <Search
              size={18}
              className="absolute left-4 text-white/50 pointer-events-none"
            />
            <input
              type="text"
              id="helpDeskSearchInput"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search orders, shipping, returns, sizing..."
              aria-label="Search help articles, questions, and guides"
              className="w-full pl-11 pr-24 py-3 rounded-2xl bg-[#08254c]/90 border border-white/20 focus:border-[#3DE0FF] text-sm text-white placeholder-white/45 focus:outline-none focus:ring-2 focus:ring-[#3DE0FF]/25 backdrop-blur-xl transition-all shadow-lg shadow-[#00142e]/50"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 px-2 py-1 rounded-md text-[11px] bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick category filter chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3.5 text-xs text-white/60">
            <span className="text-[11px] uppercase tracking-wider text-white/40">
              Quick filters:
            </span>
            <button
              type="button"
              onClick={() => onQuickCategorySelect('all')}
              className={`px-3 py-1 rounded-xl text-xs transition-colors border ${
                selectedCategory === 'all'
                  ? 'bg-[#3DE0FF] text-[#00142e] font-semibold border-[#3DE0FF]'
                  : 'bg-[#0A2A54]/70 hover:bg-[#0A2A54] text-white/80 border-white/12'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => onQuickCategorySelect('orders')}
              className={`px-3 py-1 rounded-xl text-xs transition-colors border ${
                selectedCategory === 'orders'
                  ? 'bg-[#3DE0FF] text-[#00142e] font-semibold border-[#3DE0FF]'
                  : 'bg-[#0A2A54]/70 hover:bg-[#0A2A54] text-white/80 border-white/12'
              }`}
            >
              Orders
            </button>
            <button
              type="button"
              onClick={() => onQuickCategorySelect('delivery')}
              className={`px-3 py-1 rounded-xl text-xs transition-colors border ${
                selectedCategory === 'delivery'
                  ? 'bg-[#3DE0FF] text-[#00142e] font-semibold border-[#3DE0FF]'
                  : 'bg-[#0A2A54]/70 hover:bg-[#0A2A54] text-white/80 border-white/12'
              }`}
            >
              Delivery
            </button>
            <button
              type="button"
              onClick={() => onQuickCategorySelect('returns')}
              className={`px-3 py-1 rounded-xl text-xs transition-colors border ${
                selectedCategory === 'returns'
                  ? 'bg-[#3DE0FF] text-[#00142e] font-semibold border-[#3DE0FF]'
                  : 'bg-[#0A2A54]/70 hover:bg-[#0A2A54] text-white/80 border-white/12'
              }`}
            >
              Returns
            </button>
            <button
              type="button"
              onClick={() => onQuickCategorySelect('sizing')}
              className={`px-3 py-1 rounded-xl text-xs transition-colors border ${
                selectedCategory === 'sizing'
                  ? 'bg-[#3DE0FF] text-[#00142e] font-semibold border-[#3DE0FF]'
                  : 'bg-[#0A2A54]/70 hover:bg-[#0A2A54] text-white/80 border-white/12'
              }`}
            >
              Sizing
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
