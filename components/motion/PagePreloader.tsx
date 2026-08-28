'use client';

import React, { useState, useEffect } from 'react';

/**
 * PagePreloader — Centralized Luxury Editorial Brand Preloader.
 * Matches baseline initPagePreloader() in js/animations.js exactly:
 * - Radial obsidian canvas (#060C18)
 * - Brand logo with cyan glow
 * - Pulsing status dot + "Loading..." whisper
 * - GPU scaleX progress track (linear-gradient cyan to pink shimmer)
 * - 0% -> 100% calibrated progression (~480ms)
 * - Smooth exit dissolve: translateY(-16px), scale(0.99), blur(6px), opacity 0
 */
export function PagePreloader() {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState('Loading...');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isGone, setIsGone] = useState(false);

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsGone(true);
      return;
    }

    const DURATION = 480; // Calibrated luxury arrival duration (ms)
    const startTime = performance.now();
    let rafId: number;
    let isDismissed = false;

    function dismissPreloader() {
      if (isDismissed) return;
      isDismissed = true;
      setIsLoaded(true);
      setTimeout(() => {
        setIsGone(true);
      }, 380);
    }

    function updateProgress(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION);
      const eased = 1 - Math.pow(1 - progress, 2.5);
      const currentPercent = Math.round(eased * 100);

      setPercent(currentPercent);

      if (currentPercent > 70 && currentPercent < 100) {
        setStatusText('Getting ready...');
      }

      if (progress < 1) {
        rafId = requestAnimationFrame(updateProgress);
      } else {
        setPercent(100);
        setStatusText('Welcome');
        // Brief perceptual pause before dissolving the curtain
        setTimeout(dismissPreloader, 90);
      }
    }

    rafId = requestAnimationFrame(updateProgress);

    // Failsafe: never block longer than 1200ms
    const failsafe = setTimeout(dismissPreloader, 1200);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(failsafe);
    };
  }, []);

  // Retain #pagePreloader in DOM matching baseline js/animations.js
  const easedProgress = Math.min(1, percent / 100);

  return (
    <div
      className={`page-preloader fixed inset-0 z-[100000] flex flex-col items-center justify-center bg-[#060C18] pointer-events-all transition-all duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] select-none ${
        isLoaded
          ? 'is-loaded opacity-0 -translate-y-4 scale-[0.99] blur-[6px] pointer-events-none'
          : 'opacity-100'
      }`}
      id="pagePreloader"
      role="status"
      aria-label="Loading nexCommerce"
      style={{
        backgroundColor: '#060C18',
        backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(61, 224, 255, 0.12) 0%, #060C18 70%)',
        display: isGone ? 'none' : 'flex',
      }}
    >
      <div
        className={`preloader-inner flex flex-col items-center text-center p-7 max-w-md transition-all duration-[360ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isLoaded ? '-translate-y-2 opacity-0' : 'opacity-100'
        }`}
      >
        {/* Brand Logo */}
        <div className="preloader-logo-wrap mb-5 relative">
          <img
            src="/assets/images/brand/logo_light.png"
            alt="nexCommerce"
            className="preloader-logo-img h-8 sm:h-9 w-auto object-contain drop-shadow-[0_4px_20px_rgba(61,224,255,0.25)]"
          />
        </div>

        {/* Status Whisper */}
        <div className="preloader-status-whisper text-[11px] font-semibold tracking-[0.22em] uppercase text-white/80 mb-5 flex items-center gap-2 font-sans">
          <span className="preloader-status-dot w-1.5 h-1.5 rounded-full bg-[#3DE0FF] shadow-[0_0_10px_#3DE0FF] animate-pulse" />
          <span id="preloaderStatusText">{statusText}</span>
        </div>

        {/* GPU ScaleX Progress Track */}
        <div
          className="preloader-progress-track w-60 h-[3px] bg-white/[0.08] border border-white/[0.04] rounded-full overflow-hidden relative shadow-inner"
          aria-hidden="true"
        >
          <div
            className="preloader-progress-bar absolute inset-0 rounded-full origin-left will-change-transform transition-transform duration-75 ease-out"
            id="preloaderProgressBar"
            style={{
              background: 'linear-gradient(90deg, #3DE0FF 0%, #F13365 50%, #3DE0FF 100%)',
              backgroundSize: '200% 100%',
              transform: `scaleX(${easedProgress})`,
              boxShadow: percent === 100 ? '0 0 16px rgba(61, 224, 255, 0.9)' : '0 0 10px rgba(61, 224, 255, 0.5)',
            }}
          />
        </div>

        {/* Percentage Counter */}
        <div
          className="preloader-percent text-[11px] font-semibold tracking-[0.12em] mt-3 tabular-nums font-mono transition-colors duration-150"
          id="preloaderPercent"
          style={{ color: percent === 100 ? '#34D399' : '#3DE0FF' }}
        >
          {percent}%
        </div>
      </div>
    </div>
  );
}
