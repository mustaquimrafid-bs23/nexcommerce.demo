'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * LenisProvider — wires Lenis smooth scroll into the Next.js app.
 * Matches baseline: duration 1.2s, ease-out exponential, vertical only.
 * Exposed on window._nexLenis for Lenis-aware components.
 * Automatically resets scroll position to 0 immediately on route changes.
 */
export function LenisProvider() {
  const pathname = usePathname();
  const lenisRef = useRef<any>(null);

  useEffect(() => {
    let rafHandle: number;

    import('lenis').then(({ default: Lenis }) => {
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        // Prevent Lenis hijacking scroll inside modals and drawers
        prevent: (node: Element) => {
          if (!node) return false;
          try {
            return !!(
              node.closest?.('[data-lenis-prevent]') ||
              node.closest?.('#nexMiniCartDrawer') ||
              node.closest?.('.search-panel') ||
              node.closest?.('[role="dialog"]')
            );
          } catch {
            return false;
          }
        },
      });

      lenisRef.current = lenis;
      (window as any)._nexLenis = lenis;

      function raf(time: number) {
        lenis.raf(time);
        rafHandle = requestAnimationFrame(raf);
      }
      rafHandle = requestAnimationFrame(raf);
    });

    return () => {
      if (rafHandle) cancelAnimationFrame(rafHandle);
      if (lenisRef.current) lenisRef.current.destroy();
      lenisRef.current = null;
      delete (window as any)._nexLenis;
    };
  }, []);

  // Reset scroll to top instantly on every route change to prevent stale layout & parallax offsets
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
