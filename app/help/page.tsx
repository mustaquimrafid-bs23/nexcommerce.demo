'use client';

import React, { useState } from 'react';
import { HelpDeskHero } from '@/components/help/HelpDeskHero';
import { DirectDispatchPortal } from '@/components/help/DirectDispatchPortal';
import { HelpFAQAccordion } from '@/components/help/HelpFAQAccordion';

export default function HelpDeskPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#012148] via-[#00193b] to-[#00142e] text-white pb-16">
      {/* 1. Concise Hero & Search Bar */}
      <HelpDeskHero
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onQuickCategorySelect={setSelectedCategory}
        selectedCategory={selectedCategory}
      />

      {/* 2. Streamlined 2-Column Section: FAQs on Left, Direct Contact Desk on Right */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Searchable FAQ Knowledge Base (7 cols) */}
          <div className="lg:col-span-7">
            <HelpFAQAccordion
              searchQuery={searchQuery}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>

          {/* Right Column: Direct Contact & Quick Actions Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <DirectDispatchPortal />
          </div>
        </div>
      </div>
    </div>
  );
}
