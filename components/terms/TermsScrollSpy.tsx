'use client';

import React, { useEffect, useState } from 'react';

interface ArticleItem {
  id: string;
  num: string;
  title: string;
}

const ARTICLES: ArticleItem[] = [
  { id: 'art1', num: '01', title: 'Scope of Agreement & Artisanal Standard' },
  { id: 'art2', num: '02', title: 'Ordering, Contract Formation & Authenticity' },
  { id: 'art3', num: '03', title: 'Pricing, VAT Transparency & European Duties' },
  { id: 'art4', num: '04', title: '14-Day Right of Withdrawal (Widerrufsbelehrung)' },
  { id: 'art5', num: '05', title: 'Intellectual Property & Digital Passport' },
  { id: 'art6', num: '06', title: 'Applicable European Law & Dispute Resolution' },
];

export function TermsScrollSpy() {
  const [activeId, setActiveId] = useState('art1');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 160;
      for (const item of ARTICLES) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <aside className="sticky top-28 p-6 rounded-3xl bg-surface-card border border-white/10 shadow-xl space-y-4">
      <div className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan pb-2 border-b border-white/10">
        Charter Navigation
      </div>
      <nav className="space-y-1">
        {ARTICLES.map((art) => {
          const isActive = activeId === art.id;
          return (
            <a
              key={art.id}
              href={`#${art.id}`}
              className={`block py-2 px-3 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-accent-pink/15 text-accent-pink font-semibold border border-accent-pink/30'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.03]'
              }`}
            >
              <span className="font-mono text-[10px] text-white/40 mr-2">{art.num}</span>
              <span>{art.title}</span>
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
