'use client';

import React, { useEffect, useRef } from 'react';

/**
 * RouteTemplate — Per-route entrance animation wrapper.
 * In Next.js App Router, template.tsx creates a fresh instance on every navigation,
 * providing a clean, jitter-free page entrance animation.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.opacity = '1';
      return;
    }

    const anim = el.animate(
      [
        { opacity: 0, transform: 'translateY(6px)' },
        { opacity: 1, transform: 'translateY(0px)' },
      ],
      {
        duration: 260,
        easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        fill: 'forwards',
      }
    );

    anim.onfinish = () => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      anim.cancel();
    };

    return () => {
      anim.cancel();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="route-template-wrapper w-full flex-1 will-change-transform"
      style={{ opacity: 0 }}
    >
      {children}
    </div>
  );
}
