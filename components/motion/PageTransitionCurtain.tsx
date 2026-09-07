'use client';

import React, { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * PageTransitionCurtain — Hardware-Accelerated GPU Route Transition Curtain.
 * Matches baseline #pageTransitionOverlay in js/animations.js:
 * - Subtle 260ms obsidian cross-dissolve on route change
 * - Zero flash, seamless brand continuity
 * - Skips on initial mount so PagePreloader takes priority
 * - Automatically respects prefers-reduced-motion
 */
export function PageTransitionCurtain() {
  const pathname = usePathname();
  const curtainRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Skip on initial load; handled by PagePreloader
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const curtain = curtainRef.current;
    if (!curtain) return;

    curtain.style.pointerEvents = 'all';
    const anim = curtain.animate(
      [
        { opacity: 0 },
        { opacity: 1, offset: 0.35 },
        { opacity: 1, offset: 0.50 },
        { opacity: 0 },
      ],
      {
        duration: 340,
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      curtain.style.pointerEvents = 'none';
      curtain.style.opacity = '0';
      anim.cancel();
    };
  }, [pathname]);

  return (
    <div
      ref={curtainRef}
      className="page-transition-curtain fixed inset-0 z-[99999] bg-[#060E1E] opacity-0 pointer-events-none will-change-transform"
      id="pageTransitionOverlay"
      aria-hidden="true"
    />
  );
}
