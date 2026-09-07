'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
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

const PROMPTS = [
  'Something for a winter evening in Milan',
  'Minimalist linen look for a weekend in Amalfi',
  'Sharp monochrome look for an executive dinner in Zurich',
  'Breathable performance wear for morning runs in Tiergarten',
  'Tailored outerwear for European autumn travel',
  'Understated luxury accessories for gifting',
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

function triggerRipple(target: HTMLElement, e: React.MouseEvent, color = 'rgba(61, 224, 255, 0.3)') {
  const ripple = document.createElement('span');
  const rect = target.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = color;
  ripple.style.pointerEvents = 'none';
  ripple.style.width = `${size}px`;
  ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
  ripple.style.transform = 'scale(0)';
  ripple.style.transition = 'transform 420ms cubic-bezier(0.4, 0, 0.2, 1), opacity 420ms ease';
  ripple.style.opacity = '1';
  ripple.setAttribute('aria-hidden', 'true');
  target.appendChild(ripple);

  requestAnimationFrame(() => {
    ripple.style.transform = 'scale(3.5)';
    ripple.style.opacity = '0';
  });

  setTimeout(() => {
    ripple.remove();
  }, 450);
}

export function IntentSearchCard() {
  const router = useRouter();
  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const sectionRef = useReveal<HTMLElement>({
    y: 32,
    scale: 0.97,
    duration: 850,
    margin: '-10%',
  });

  // 3D Tilt and Specular Physics
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

  // Typewriter & Progress Sync State
  const [query, setQuery] = useState('');
  const [placeholderText, setPlaceholderText] = useState(PROMPTS[0]);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const promptIdxRef = useRef(0);
  const charIdxRef = useRef(0);
  const isDeletingRef = useRef(false);
  const isPausedRef = useRef(false);
  const holdStartTimeRef = useRef(0);
  const HOLD_DURATION = 3500; // ms to pause on full prompt

  // Synchronize isPaused ref
  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  // 120fps Typewriter Loop matching feature/storefront-elevation
  useEffect(() => {
    let animFrameId: number;
    let timeoutId: NodeJS.Timeout;

    function typeLoop() {
      if (isPausedRef.current) {
        animFrameId = requestAnimationFrame(typeLoop);
        return;
      }

      const currentFullText = PROMPTS[promptIdxRef.current];

      if (!isDeletingRef.current) {
        // Typing forward
        setPlaceholderText(currentFullText.substring(0, charIdxRef.current + 1));
        charIdxRef.current++;
        setProgress(0);

        if (charIdxRef.current === currentFullText.length) {
          isDeletingRef.current = true;
          holdStartTimeRef.current = performance.now();
        }
        timeoutId = setTimeout(() => {
          animFrameId = requestAnimationFrame(typeLoop);
        }, 45);
      } else {
        // Holding full text with progress bar sync
        const elapsed = performance.now() - holdStartTimeRef.current;
        if (elapsed < HOLD_DURATION) {
          const ratio = Math.min(1, elapsed / HOLD_DURATION);
          setProgress(ratio);
          animFrameId = requestAnimationFrame(typeLoop);
        } else {
          // Reset progress bar & delete text
          setProgress(0);
          setPlaceholderText(currentFullText.substring(0, charIdxRef.current - 1));
          charIdxRef.current--;

          if (charIdxRef.current <= 0) {
            isDeletingRef.current = false;
            charIdxRef.current = 0;
            promptIdxRef.current = (promptIdxRef.current + 1) % PROMPTS.length;
          }
          timeoutId = setTimeout(() => {
            animFrameId = requestAnimationFrame(typeLoop);
          }, 25);
        }
      }
    }

    animFrameId = requestAnimationFrame(typeLoop);

    return () => {
      cancelAnimationFrame(animFrameId);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const btn = document.getElementById('homeIntentSubmitBtn');
    if (btn) {
      triggerRipple(btn, e as unknown as React.MouseEvent, 'rgba(255, 255, 255, 0.45)');
    }
    const finalQuery = query.trim() || placeholderText;
    if (!finalQuery) return;
    router.push(`/discovery?q=${encodeURIComponent(finalQuery)}`);
  };

  const handleChipClick = (targetQuery: string, e: React.MouseEvent<HTMLButtonElement>) => {
    triggerRipple(e.currentTarget, e, 'rgba(61, 224, 255, 0.35)');
    setQuery(targetQuery);
    setIsPaused(true);
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setTimeout(() => {
      router.push(`/discovery?q=${encodeURIComponent(targetQuery)}`);
    }, 180);
  };

  const handleInputFocus = () => {
    setIsPaused(true);
  };

  const handleInputBlur = () => {
    if (!query.trim()) {
      setIsPaused(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setIsPaused(true);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="py-12 sm:py-16 relative perspective-[1200px]"
      id="homeIntentSectionRoot"
      aria-label="Intent-based Product Search"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          ref={cardRef}
          className="relative rounded-3xl bg-gradient-to-b from-[#0c1c38]/65 to-[#040e20]/85 backdrop-blur-[28px] border border-white/10 p-6 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.45)] overflow-hidden flex flex-col items-center text-center space-y-6 sm:space-y-7 hover:border-white/20 transition-[border-color,box-shadow] duration-500 will-change-transform"
          id="homeIntentCard"
          style={{ transformStyle: 'preserve-3d' }}
        >
          {/* Specular Glare Tracking Layer */}
          <div
            className="pointer-events-none absolute inset-0 rounded-3xl z-20"
            style={{
              background: 'radial-gradient(circle 380px at var(--intent-glare-x, 50%) var(--intent-glare-y, 50%), rgba(255,255,255,0.08) 0%, transparent 70%)',
              opacity: 'var(--intent-glare-opacity, 0)',
              transition: 'opacity 220ms ease',
            } as React.CSSProperties}
            aria-hidden="true"
          />

          {/* Ambient Subtle Background Mesh Glow */}
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[620px] h-[280px] bg-[radial-gradient(ellipse_at_center,rgba(61,224,255,0.10)_0%,rgba(241,51,101,0.06)_45%,transparent_75%)] pointer-events-none z-0"
            aria-hidden="true"
          />

          {/* Header Typography */}
          <div className="relative z-10 max-w-xl mx-auto flex flex-col items-center space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#3DE0FF]/[0.08] border border-[#3DE0FF]/25 text-[10.5px] font-bold uppercase tracking-[0.12em] text-[#3DE0FF] shadow-[0_2px_10px_rgba(61,224,255,0.12)]">
              <Sparkles size={13} className="text-[#3DE0FF]" />
              <span>Smart Search</span>
            </div>

            <h2 className="font-display text-2xl sm:text-4xl text-white font-bold leading-tight tracking-[-0.02em]">
              Tell us what you&apos;re dressing for.
            </h2>
          </div>

          {/* Search Pill Input Wrapper */}
          <form
            onSubmit={handleSubmit}
            className="relative z-10 w-full max-w-2xl flex items-center bg-[#030a18]/75 hover:bg-[#030a18]/90 focus-within:bg-[#030a18]/95 border border-white/15 focus-within:border-[#3DE0FF] rounded-full p-1 pl-4 sm:p-1.5 sm:pl-6 shadow-[0_10px_30px_rgba(0,0,0,0.35),inset_0_2px_4px_rgba(0,0,0,0.25)] focus-within:shadow-[0_0_0_3px_rgba(61,224,255,0.18),0_14px_40px_rgba(0,0,0,0.5)] transition-all duration-200"
            id="homeIntentForm"
          >
            <div className="text-[#3DE0FF] pr-2.5 sm:pr-3 flex-shrink-0">
              <Sparkles size={18} />
            </div>

            <div className="flex-1 flex flex-col justify-center min-w-0 pr-2">
              <input
                ref={inputRef}
                type="text"
                id="homeIntentInput"
                placeholder={placeholderText}
                value={query}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                className="w-full bg-transparent text-sm sm:text-[15px] text-white placeholder-white/45 focus:outline-none py-1 sm:py-1.5 tracking-wide"
                autoComplete="off"
                aria-label="Describe what you are looking for"
              />

              {/* 120fps Typewriter Progress Line with GPU scaleX */}
              <div className="w-full h-[2px] bg-white/10 rounded-full overflow-hidden mt-0.5">
                <div
                  id="intentTypewriterBar"
                  className="h-full bg-gradient-to-r from-[#3DE0FF] to-[#F13365] origin-left will-change-transform"
                  style={{
                    transform: `scaleX(${query ? 1 : progress})`,
                    transition: isPaused ? 'transform 120ms ease' : 'none',
                  }}
                />
              </div>
            </div>

            {/* Submit Circle Button */}
            <button
              type="submit"
              className="w-10 h-10 sm:w-11 sm:h-11 min-w-[40px] sm:min-w-[44px] rounded-full bg-gradient-to-br from-[#F13365] to-[#BE123C] hover:scale-105 active:scale-95 text-white flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(241,51,101,0.38)] hover:shadow-[0_6px_22px_rgba(241,51,101,0.55)] flex-shrink-0 cursor-pointer relative overflow-hidden"
              aria-label="Search Catalog"
              id="homeIntentSubmitBtn"
            >
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Bottom Popular Idea Chips: Swipeable Horizontal Strip on Mobile, Centered on Desktop */}
          <div className="relative z-10 w-full flex flex-col items-center space-y-2.5 sm:space-y-3 pt-0.5">
            <span className="text-[10px] sm:text-[11px] uppercase font-bold tracking-[0.08em] text-white/45">
              Popular Prompts
            </span>

            <div className="w-full overflow-x-auto no-scrollbar py-1 px-1 flex items-center gap-2.5 sm:flex-wrap sm:justify-center">
              {POPULAR_PROMPTS.map((prompt, i) => {
                const Icon = prompt.icon;
                return (
                  <button
                    key={prompt.label}
                    type="button"
                    onClick={(e) => handleChipClick(prompt.query, e)}
                    className="intent-chip-pill flex-shrink-0 inline-flex items-center gap-2 sm:gap-2.5 h-10 sm:h-12 px-4 sm:px-5 rounded-full bg-white/[0.04] hover:bg-[#3DE0FF]/[0.08] active:scale-95 border border-white/10 hover:border-[#3DE0FF]/30 text-[#D8DEE9] hover:text-white text-xs sm:text-[13.5px] font-semibold transition-all duration-200 shadow-sm hover:shadow-[0_6px_18px_rgba(0,0,0,0.3)] hover:-translate-y-0.5 backdrop-blur-md cursor-pointer whitespace-nowrap relative overflow-hidden group"
                    data-chip-depth={i + 1}
                  >
                    <Icon size={15} className="text-[#3DE0FF] group-hover:scale-110 group-hover:text-white transition-all flex-shrink-0" />
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
