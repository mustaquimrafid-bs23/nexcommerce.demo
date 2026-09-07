'use client';

import React, { useState, useMemo } from 'react';
import { ChevronDown, Sparkles, ThumbsUp, Check, HelpCircle, MessageSquare } from 'lucide-react';
import { FAQ_ITEMS } from './data';
import { FAQItem } from './types';

interface HelpFAQAccordionProps {
  searchQuery: string;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Questions' },
  { id: 'orders', label: 'Orders & Tracking' },
  { id: 'delivery', label: 'Shipping & Delivery' },
  { id: 'returns', label: 'Returns & Refunds' },
  { id: 'sizing', label: 'Sizing & Tailoring' },
  { id: 'payments', label: 'Payments & Security' },
];

export function HelpFAQAccordion({
  searchQuery,
  selectedCategory,
  onCategoryChange,
}: HelpFAQAccordionProps) {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true, // First item open by default
  });
  const [helpfulIds, setHelpfulIds] = useState<Record<string, boolean>>({});

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const markHelpful = (id: string) => {
    setHelpfulIds((prev) => ({
      ...prev,
      [id]: true,
    }));
  };

  // Filter FAQs by Category and Search Query
  const filteredFAQs = useMemo(() => {
    return FAQ_ITEMS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <section id="faqSection" className="w-full">
      <div className="flex flex-col gap-1.5 mb-6">
        <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-[#3DE0FF] flex items-center gap-2">
          <span className="w-4 h-[1px] bg-[#3DE0FF]" />
          Help &amp; Answers
        </span>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-white">
            Frequently Asked Questions
          </h2>
          <span className="text-xs text-white/50">
            {filteredFAQs.length} {filteredFAQs.length === 1 ? 'question' : 'questions'}
          </span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div
        className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none"
        role="tablist"
        aria-label="FAQ Category Filters"
      >
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            role="tab"
            aria-selected={selectedCategory === cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium tracking-wide whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#3DE0FF] text-[#01142e] font-bold shadow-md shadow-[#3DE0FF]/25 border border-[#3DE0FF]'
                : 'bg-[#0A2A54]/80 hover:bg-[#0A2A54] text-white/80 hover:text-white border border-white/10'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      {filteredFAQs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#08254c]/50 border border-white/10 text-white/70">
          <HelpCircle size={32} className="mx-auto mb-3 text-white/40" />
          <h3 className="text-base font-semibold text-white mb-1">
            No questions found
          </h3>
          <p className="text-xs text-white/60 max-w-sm mx-auto mb-4">
            Try searching with different words or send our support team a message.
          </p>
          <button
            type="button"
            onClick={() => {
              onCategoryChange('all');
              const input = document.getElementById('helpDeskSearchInput') as HTMLInputElement;
              if (input) input.value = '';
            }}
            className="px-4 py-2 rounded-xl bg-[#0A2A54] hover:bg-[#0A2A54]/80 text-xs font-medium text-white transition-colors cursor-pointer"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFAQs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            const isHelpful = !!helpfulIds[faq.id];

            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#0A2A54]/90 border-white/25 shadow-xl shadow-[#00142e]/60'
                    : 'bg-[#08254c]/65 border-white/12 hover:border-white/25'
                }`}
              >
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="faq-accordion-trigger w-full px-6 py-4.5 flex items-center justify-between gap-4 text-left cursor-pointer select-none"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/[0.06] text-[#3DE0FF] border border-white/10 hidden sm:inline-block flex-shrink-0">
                      {faq.categoryLabel}
                    </span>
                    <span className="text-sm sm:text-[15px] font-medium text-white/95">
                      {faq.question}
                    </span>
                  </div>

                  <ChevronDown
                    size={18}
                    className={`text-white/50 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-[#3DE0FF]' : ''
                    }`}
                  />
                </button>

                {/* Accordion Expandable Content */}
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 border-t border-white/[0.06] animate-in fade-in slide-in-from-top-1 duration-150">
                    <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-normal mb-4">
                      {faq.answer}
                    </p>

                    <div className="flex items-center justify-between text-xs text-white/40 pt-2 border-t border-white/[0.04]">
                      <span>Was this helpful?</span>
                      <button
                        type="button"
                        onClick={() => markHelpful(faq.id)}
                        disabled={isHelpful}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] transition-colors ${
                          isHelpful
                            ? 'text-[#00E096] bg-[#00E096]/10'
                            : 'text-white/60 hover:text-white hover:bg-white/[0.06] cursor-pointer'
                        }`}
                      >
                        {isHelpful ? <Check size={12} /> : <ThumbsUp size={12} />}
                        <span>
                          {isHelpful
                            ? 'Marked as Helpful'
                            : `Helpful (${(faq.helpfulCount || 0) + (isHelpful ? 1 : 0)})`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
