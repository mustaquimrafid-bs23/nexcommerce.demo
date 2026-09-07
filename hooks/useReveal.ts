'use client';

import { useEffect, useRef } from 'react';

type UseRevealOptions = {
  /** Distance to pre-translate before entrance. Default 24 */
  y?: number;
  /** Initial scale. Default 0.98 */
  scale?: number;
  /** rootMargin bottom offset. Default '50px 0px 50px 0px' */
  margin?: string;
  /** Stagger delay between children in seconds. Default 0.07 */
  stagger?: number;
  /** Child CSS selector to stagger. Optional */
  childSelector?: string;
  /** Animation duration in ms. Default 700 */
  duration?: number;
  /** Start delay in ms. Default 0 */
  delay?: number;
};

/**
 * useReveal — IntersectionObserver-based scroll-reveal hook.
 * Uses native WAAPI (Web Animations API) to smoothly animate elements on entry
 * while guaranteeing 100% content visibility for SSR, SEO, and full-page captures.
 */
export function useReveal<T extends HTMLElement = HTMLElement>(options: UseRevealOptions = {}) {
  const {
    y = 24,
    scale = 0.98,
    stagger: staggerDelay = 0.07,
    childSelector,
    duration = 700,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

    const children: HTMLElement[] = childSelector
      ? Array.from(el.querySelectorAll<HTMLElement>(childSelector))
      : [];

    const playEntrance = () => {
      if (hasAnimated.current) return;
      hasAnimated.current = true;

      el.animate(
        [
          { opacity: 0.15, transform: `translateY(${y}px) scale(${scale})` },
          { opacity: 1, transform: 'translateY(0px) scale(1)' },
        ],
        { duration, delay, easing: EASING, fill: 'forwards' }
      );

      children.forEach((child, i) => {
        const childDelay = delay + (i * staggerDelay * 1000) + 60;
        child.animate(
          [
            { opacity: 0.1, transform: `translateY(${y * 0.5}px) scale(${scale})` },
            { opacity: 1, transform: 'translateY(0px) scale(1)' },
          ],
          { duration: duration - 50, delay: childDelay, easing: EASING, fill: 'forwards' }
        );
      });
    };

    let observer: IntersectionObserver | null = null;
    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry && entry.isIntersecting) {
            playEntrance();
            if (observer) observer.unobserve(el);
          }
        },
        { rootMargin: '80px 0px 80px 0px', threshold: 0.05 }
      );
      observer.observe(el);
    } catch {
      playEntrance();
    }

    return () => {
      if (observer) observer.disconnect();
    };
  }, [childSelector, delay, duration, scale, staggerDelay, y]);

  return ref;
}
