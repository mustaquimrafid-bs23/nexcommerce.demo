'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Wine,
  Compass,
  Briefcase,
  Gift,
  Sun,
} from 'lucide-react';
import { useReveal } from '@/hooks/useReveal';

const TYPEWRITER_PLACEHOLDERS = [
  'Something for a winter evening in Milan',
  'Lightweight apparel for weekend trip',
  'Minimalist tailored workwear',
  'Luxury gifts for him',
  'Light breathable summer fabrics',
];

const POPULAR_PROMPTS = [
  {
    icon: Wine,
    label: 'Dinner outfit',
    query: 'Dinner outfit for a cool evening in Milan',
  },
  {
    icon: Compass,
    label: 'Weekend trip',
    query: 'Lightweight apparel for weekend trip',
  },
  {
    icon: Briefcase,
    label: 'Work essentials',
    query: 'Minimalist tailored workwear',
  },
  {
    icon: Gift,
    label: 'Gift for him',
    query: 'Luxury gifts for him',
  },
  {
    icon: Sun,
    label: 'Summer styles',
    query: 'Light breathable summer fabrics',
  },
];

export function IntentSearchCard() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);

  const sectionRef = useReveal<HTMLElement>({
    y: 32,
    scale: 0.97,
    duration: 850,
    margin: '-10%',
  });

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.innerWidth < 768) return;

    const MAX_TILT = 5.5;
    const LERP_IN = 0.10;
    const LERP_OUT = 0.16;
    let rafId: number | null = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, LERP_IN);
      curTY = lerp(curTY, tgtTY, LERP_IN);
      (card as HTMLDivElement).style.transform = `perspective(1100px) rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px)`;
      if (Math.abs(curTX - tgtTX) > 0.04 || Math.abs(curTY - tgtTY) > 0.04) {
        rafId = requestAnimationFrame(applyTilt);
      } else { rafId = null; }
    }

    function springBack() {
      curTX = lerp(curTX, 0, LERP_OUT);
      curTY = lerp(curTY, 0, LERP_OUT);
      (card as HTMLDivElement).style.transform = `perspective(1100px) rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg)`;
      if (Math.abs(curTX) > 0.04 || Math.abs(curTY) > 0.04) {
        rafId = requestAnimationFrame(springBack);
      } else { (card as HTMLDivElement).style.transform = ''; rafId = null; }
    }

    const onMove = (e: MouseEvent) => {
      const r = card.getBoundingClientRect();
      tgtTX = -((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * MAX_TILT;
      tgtTY = ((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * MAX_TILT;
      card.style.setProperty('--intent-glare-x', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      card.style.setProperty('--intent-glare-y', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
      card.style.setProperty('--intent-glare-opacity', '1');
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    };

    const onLeave = () => {
      tgtTX = 0; tgtTY = 0;
      card.style.setProperty('--intent-glare-opacity', '0');
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    };

    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);
    return () => {
      card.removeEventListener('mousemove', onMove);
      card.removeEventListener('mouseleave', onLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const [query, setQuery] = useState('');
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fullText = TYPEWRITER_PLACEHOLDERS[placeholderIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (currentText.length < fullText.length) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length + 1));
          setProgress((currentText.length + 1) / fullText.length);
        }, 55);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(fullText.substring(0, currentText.length - 1));
          setProgress((currentText.length - 1) / fullText.length);
        }, 25);
      } else {
        setIsDeleting(false);
        setPlaceholderIndex((prev) => (prev + 1) % TYPEWRITER_PLACEHOLDERS.length);
        setProgress(0);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, placeholderIndex]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalQuery = query.trim() || currentText;
    if (!finalQuery) return;
    router.push(`/category?q=${encodeURIComponent(finalQuery)}`);
  };

  const handleChipClick = (q: string) => {
    router.push(`/category?q=${encodeURIComponent(q)}`);
  };

  return (
    <section
      ref={sectionRef}
      className="py-10 sm:py-16 bg-[#011836] border-b border-white/5 relative"
      id="homeIntentSectionRoot"
      aria-label="Intent-based Product Search"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={cardRef}
          className="relative rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#0c1c38]/70 to-[#040e20]/90 backdrop-blur-2xl border border-white/10 p-5 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col items-center text-center space-y-5 sm:space-y-7 hover:border-white/20 transition-[border-color] duration-500 will-change-transform"
          id="homeIntentCard"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Specular Glare */}
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl sm:rounded-3xl z-20"
            style={{
              background: 'radial-gradient(circle at var(--intent-glare-x, 50%) var(--intent-glare-y, 50%), rgba(255,255,255,0.09) 0%, transparent 55%)',
              opacity: 'var(--intent-glare-opacity, 0)',
              transition: 'opacity 200ms',
            } as React.CSSProperties}
          />
          {/* Ambient Mesh Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[620px] h-[280px] bg-[radial-gradient(ellipse_at_center,rgba(61,224,255,0.12)_0%,rgba(241,51,101,0.06)_45%,transparent_75%)] pointer-events-none z-0" />

          {/* Header Typography */}
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center space-y-2 sm:space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3DE0FF]/10 border border-[#3DE0FF]/25 text-[10px] sm:text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#3DE0FF] shadow-[0_2px_10px_rgba(61,224,255,0.12)]">
              <Sparkles size={12} className="text-[#3DE0FF]" />
              <span>Smart Search</span>
            </div>

            <h2 className="font-editorial text-2xl sm:text-4xl text-white font-normal leading-tight tracking-[-0.02em]">
              Tell us what you&apos;re dressing for.
            </h2>
          </div>

          {/* Search Pill Input Wrapper */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-2xl flex items-center bg-[#030a18]/75 hover:bg-[#030a18]/90 focus-within:bg-[#030a18]/95 border border-white/15 focus-within:border-[#3DE0FF] rounded-full p-1 pl-3.5 sm:p-1.5 sm:pl-6 shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_2px_4px_rgba(0,0,0,0.25)] focus-within:shadow-[0_0_0_3px_rgba(61,224,255,0.18),0_14px_40px_rgba(0,0,0,0.5)] transition-all duration-200"
            id="homeIntentForm"
          >
            <div className="text-[#3DE0FF] pr-2 sm:pr-3 flex-shrink-0">
              <Sparkles size={16} className="sm:w-[18px] sm:h-[18px]" />
            </div>

            <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
              <input
                type="text"
                id="homeIntentInput"
                placeholder={currentText || 'Something for a winter evening in Milan'}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent text-xs sm:text-[15px] text-white placeholder-white/45 focus:outline-none py-1 sm:py-1.5 tracking-wide"
                autoComplete="off"
                aria-label="Describe what you are looking for"
              />

              {/* Typewriter Progress Line */}
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mt-0.5">
                <div
                  className="h-full bg-gradient-to-r from-[#3DE0FF] to-[#F13365] origin-left transition-transform duration-75 ease-linear"
                  style={{ transform: `scaleX(${query ? 1 : progress})` }}
                />
              </div>
            </div>

            {/* Submit Circle Button */}
            <button
              type="submit"
              className="w-9 h-9 sm:w-11 sm:h-11 min-w-[36px] sm:min-w-[44px] rounded-full bg-gradient-to-br from-[#F13365] to-[#BE123C] hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-transform shadow-[0_4px_16px_rgba(241,51,101,0.38)] flex-shrink-0 cursor-pointer"
              aria-label="Search Catalog"
              id="homeIntentSubmitBtn"
            >
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
            </button>
          </form>

          {/* Bottom Popular Idea Chips: Swipeable Horizontal Strip on Mobile, Wrap on Desktop */}
          <div className="relative z-10 w-full flex flex-col items-center space-y-2 sm:space-y-3 pt-0.5">
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.08em] text-white/45">
              Popular Prompts
            </span>

            <div className="w-full overflow-x-auto no-scrollbar py-1 px-1 flex items-center gap-2 sm:flex-wrap sm:justify-center">
              {POPULAR_PROMPTS.map((prompt, i) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={prompt.label}
                    type="button"
                    onClick={() => handleChipClick(prompt.query)}
                    className="intent-chip-pill flex-shrink-0 inline-flex items-center gap-1.5 sm:gap-2.5 h-8 sm:h-11 px-3 sm:px-5 rounded-full bg-white/[0.05] hover:bg-white/[0.08] active:scale-95 border border-white/10 hover:border-white/25 text-[#E2E8F0] hover:text-white text-[11px] sm:text-[13.5px] font-semibold transition-all shadow-sm backdrop-blur-md cursor-pointer whitespace-nowrap"
                    data-chip-depth={i + 1}
                  >
                    <Icon size={12} className="text-[#3DE0FF] sm:w-[15px] sm:h-[15px] flex-shrink-0" />
                    <span>{prompt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
