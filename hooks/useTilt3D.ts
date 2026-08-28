'use client';

import { useEffect, useRef, RefObject } from 'react';

/**
 * useTilt3D — Spring-physics 3D mouse tilt + specular glare tracking.
 * Matches baseline initDealsSectionMotion/initCuratedGridMotion 3D hover physics exactly.
 *
 * Writes these CSS custom properties on the element:
 *   --tilt-x, --tilt-y         (rotateX/Y degrees for CSS @property or direct JS use)
 *   --glare-x, --glare-y       (cursor position % for radial-gradient)
 *   --glare-opacity            (0 → 1 on hover)
 *   --shadow-lift              (0 → 1 on hover, for multi-tier shadow scale)
 *
 * @param maxTilt    Max rotation degrees. Default 7
 * @param lerpFactor Spring lerp factor. Default 0.12
 */
export function useTilt3D(
  maxTilt = 7,
  lerpFactor = 0.12
): RefObject<HTMLElement | null> {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId: number | null = null;
    let curTX = 0, curTY = 0;
    let tgtTX = 0, tgtTY = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, lerpFactor);
      curTY = lerp(curTY, tgtTY, lerpFactor);

      el!.style.transform = `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px)`;

      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        el!.style.transform = `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(12px)`;
        rafId = null;
      }
    }

    function springBack() {
      curTX = lerp(curTX, 0, 0.18);
      curTY = lerp(curTY, 0, 0.18);
      el!.style.transform = `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px)`;

      if (Math.abs(curTX) > 0.05 || Math.abs(curTY) > 0.05) {
        rafId = requestAnimationFrame(springBack);
      } else {
        el!.style.transform = '';
        rafId = null;
      }
    }

    const onMouseMove = (e: MouseEvent) => {
      const r = el!.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * maxTilt);
      tgtTY = dx * maxTilt;

      // Specular glare position
      const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
      const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
      el!.style.setProperty('--glare-x', gx);
      el!.style.setProperty('--glare-y', gy);
      el!.style.setProperty('--glare-opacity', '1');
      el!.style.setProperty('--shadow-lift', '1');

      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    };

    const onMouseLeave = () => {
      tgtTX = 0;
      tgtTY = 0;
      el!.style.setProperty('--glare-opacity', '0');
      el!.style.setProperty('--shadow-lift', '0');
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    };

    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [maxTilt, lerpFactor]);

  return ref;
}
