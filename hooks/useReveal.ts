'use client';

import { useEffect, useRef } from 'react';

type UseRevealOptions = {
  /** Distance to pre-translate before entrance. Default 28 */
  y?: number;
  /** Initial scale. Default 0.97 */
  scale?: number;
  /** rootMargin bottom offset. Default '-8%' */
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
 * Matches baseline initScrollReveals() / inView() + stagger() pattern.
 * Uses native WAAPI (Web Animations API) — same as animations.js baseline.
 *
 * Usage:
 *   const ref = useReveal<HTMLElement>({ childSelector: '.card' });
 *   <section ref={ref}>...</section>
 */
export function useReveal<T extends HTMLElement = HTMLElement>(options: UseRevealOptions = {}) {
  const {
    y = 28,
    scale = 0.97,
    margin = '-8%',
    stagger: staggerDelay = 0.07,
    childSelector,
    duration = 700,
    delay = 0,
  } = options;

  const ref = useRef<T>(null);
  const revealed = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const EASING = 'cubic-bezier(0.16, 1, 0.3, 1)';

    // Pre-hide the section and its children immediately so there's no flash
    el.style.opacity = '0';
    el.style.transform = `translateY(${y}px) scale(${scale})`;

    const children: Element[] = childSelector
      ? Array.from(el.querySelectorAll(childSelector))
      : [];

    children.forEach(child => {
      (child as HTMLElement).style.opacity = '0';
      (child as HTMLElement).style.transform = `translateY(${y * 0.6}px) scale(${scale})`;
    });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || revealed.current) return;
        revealed.current = true;
        observer.unobserve(el);

        // Animate section container
        el.animate(
          [
            { opacity: 0, transform: `translateY(${y}px) scale(${scale})` },
            { opacity: 1, transform: 'translateY(0px) scale(1)' },
          ],
          { duration, delay, easing: EASING, fill: 'forwards' }
        ).onfinish = () => {
          el.style.opacity = '1';
          el.style.transform = '';
        };

        // Stagger children
        children.forEach((child, i) => {
          const childDelay = delay + (i * staggerDelay * 1000) + 80;
          child.animate(
            [
              { opacity: 0, transform: `translateY(${y * 0.6}px) scale(${scale})` },
              { opacity: 1, transform: 'translateY(0px) scale(1)' },
            ],
            { duration: duration - 50, delay: childDelay, easing: EASING, fill: 'forwards' }
          ).onfinish = () => {
            (child as HTMLElement).style.opacity = '1';
            (child as HTMLElement).style.transform = '';
          };
        });
      },
      { rootMargin: `0px 0px ${margin} 0px` }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
