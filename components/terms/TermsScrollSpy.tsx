'use client';

import React, { useEffect, useState } from 'react';
import { Bookmark, ListTree } from 'lucide-react';

interface ArticleItem {
  id: string;
  num: string;
  title: string;
}

export const TERMS_ARTICLES: ArticleItem[] = [
  { id: 'art1', num: '01', title: 'Scope of Agreement & Quality' },
  { id: 'art2', num: '02', title: 'Ordering, Contracts & Verification' },
  { id: 'art3', num: '03', title: 'Pricing, VAT Transparency & Delivery' },
  { id: 'art4', num: '04', title: '14-Day Right to Cancel & Returns' },
  { id: 'art5', num: '05', title: 'Authenticity & Intellectual Property' },
  { id: 'art6', num: '06', title: 'Applicable Law & Dispute Resolution' },
];

export function TermsScrollSpy() {
  const [activeId, setActiveId] = useState('art1');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 180;
      for (const item of TERMS_ARTICLES) {
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

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const topOffset = target.getBoundingClientRect().top + window.scrollY - 120;
      window.scrollTo({ top: topOffset, behavior: 'smooth' });
      setActiveId(id);
    }
  };

  return (
    <aside className="sticky top-28 p-6 rounded-3xl bg-surface-card border border-white/10 shadow-xl space-y-4" aria-label="Table of Contents">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-cyan pb-2 border-b border-white/10">
        <ListTree size={14} />
        <span>Table of Contents</span>
      </div>
      <nav className="space-y-1">
        {TERMS_ARTICLES.map((art) => {
          const isActive = activeId === art.id;
          return (
            <a
              key={art.id}
              href={`#${art.id}`}
              onClick={(e) => handleSmoothScroll(e, art.id)}
              className={`block py-2 px-3 rounded-xl text-xs transition-all ${
                isActive
                  ? 'bg-accent-pink/15 text-accent-pink font-semibold border border-accent-pink/30 shadow-md'
                  : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
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
