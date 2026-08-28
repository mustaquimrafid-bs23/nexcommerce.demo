'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Plus, Check } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';

const FEATURED_PIECE: Product = {
  id: 'p7',
  name: 'Leather Tote Bag',
  category: 'accessories',
  price: 245,
  currency: 'EUR',
  description: 'Heavyweight organic cotton canvas tote featuring veg-tan leather handles and internal laptop sleeve.',
  image: '/assets/images/lifestyle/thumb_tote.jpg',
  tag: 'Featured Piece',
};

const EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

export function HeroSection() {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const [isAdded, setIsAdded] = useState(false);
  const eyebrowRef = useRef<HTMLSpanElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const capsuleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const EASING_OBJ = { easing: EASING, fill: 'forwards' as FillMode };

    const commit = (anim: Animation, el: HTMLElement) => {
      anim.onfinish = () => {
        el.style.opacity = '1';
        el.style.transform = '';
        anim.cancel();
      };
    };

    const elements = [
      { el: eyebrowRef.current, delay: 100, y: 16 },
      { el: titleRef.current, delay: 200, y: 22 },
      { el: ctaRef.current, delay: 360, y: 16 },
      { el: capsuleRef.current, delay: 480, y: 12 },
    ];

    elements.forEach(({ el, delay, y }) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = `translateY(${y}px)`;
      const anim = el.animate(
        [{ opacity: 0, transform: `translateY(${y}px)` }, { opacity: 1, transform: 'translateY(0px)' }],
        { duration: 1000, delay, ...EASING_OBJ }
      );
      commit(anim, el);
    });

    if (imageRef.current) {
      const img = imageRef.current;
      img.style.opacity = '0';
      img.style.transform = 'scale(0.97)';
      const anim = img.animate(
        [{ opacity: 0, transform: 'scale(0.97)' }, { opacity: 1, transform: 'scale(1)' }],
        { duration: 1200, delay: 0, easing: EASING, fill: 'forwards' }
      );
      commit(anim, img);
    }

    // ─── Unified 120fps Differential Layer & 3D Mouse Parallax Engine ───
    let rafId: number | null = null;
    let targetScrollY = window.scrollY || 0;
    let currentScrollY = targetScrollY;
    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;

    const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const heroEl = document.getElementById('heroFullbleedSection');
    const bgCanvas = imageRef.current;
    const hotspotWrap = capsuleRef.current;
    const contentWrap = document.getElementById('heroCenteredContent');

    const onScroll = () => {
      targetScrollY = window.scrollY || 0;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const onMouseMove = (e: MouseEvent) => {
      if (!heroEl) return;
      const rect = heroEl.getBoundingClientRect();
      if (rect.height <= 0 || rect.width <= 0) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotX = -y * 8; // Max pitch tilt
      targetRotY = x * 10; // Max yaw tilt
    };

    const onMouseLeave = () => {
      targetRotX = 0;
      targetRotY = 0;
    };

    if (heroEl && isDesktopPointer) {
      heroEl.addEventListener('mousemove', onMouseMove);
      heroEl.addEventListener('mouseleave', onMouseLeave);
    }

    function updateParallax() {
      currentScrollY += (targetScrollY - currentScrollY) * 0.12;

      if (isDesktopPointer) {
        curRotX += (targetRotX - curRotX) * 0.08;
        curRotY += (targetRotY - curRotY) * 0.08;
      }

      const heroHeight = heroEl ? heroEl.offsetHeight : 600;
      if (currentScrollY < heroHeight * 1.3) {
        const scrollProgress = Math.max(0, currentScrollY);
        const isMobile = window.innerWidth <= 768;

        // 1. Background image canvas parallax
        if (bgCanvas) {
          const bgTranslateY = (scrollProgress * 0.28) - (curRotX * 1.5);
          const bgTranslateX = -curRotY * 1.8;
          bgCanvas.style.transform = `translate3d(${bgTranslateX.toFixed(2)}px, ${bgTranslateY.toFixed(2)}px, 0)`;
        }

        // 2. Editorial column parallax & fade
        if (contentWrap) {
          const contentTranslateY = (scrollProgress * 0.10) + (curRotX * 1.2);
          const contentTranslateX = isMobile ? 0 : (curRotY * 1.5);
          const contentOpacity = Math.max(0, Math.min(1, 1 - (scrollProgress / 460)));
          contentWrap.style.transform = `translate3d(${contentTranslateX.toFixed(2)}px, ${contentTranslateY.toFixed(2)}px, 15px)`;
          contentWrap.style.opacity = contentOpacity.toFixed(3);
        }

        // 3. Floating 3D Shoppable Look Capsule
        if (hotspotWrap) {
          const hotspotTranslateY = (scrollProgress * 0.18) + (curRotX * 1.4);
          const hotspotTranslateX = isMobile ? 0 : (curRotY * 1.6);
          const hotspotOpacity = Math.max(0, Math.min(1, 1 - (scrollProgress / 380)));
          if (isMobile) {
            hotspotWrap.style.transform = `translateX(-50%) translate3d(0, ${hotspotTranslateY.toFixed(2)}px, 20px)`;
          } else {
            hotspotWrap.style.transform = `translate3d(${hotspotTranslateX.toFixed(2)}px, ${hotspotTranslateY.toFixed(2)}px, 20px)`;
          }
          hotspotWrap.style.opacity = hotspotOpacity.toFixed(3);
        }
      }

      rafId = requestAnimationFrame(updateParallax);
    }

    rafId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener('scroll', onScroll);
      if (heroEl && isDesktopPointer) {
        heroEl.removeEventListener('mousemove', onMouseMove);
        heroEl.removeEventListener('mouseleave', onMouseLeave);
      }
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(FEATURED_PIECE);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1500);
  };

  const handleCardClick = () => {
    router.push('/product/p7');
  };

  return (
    <section
      className="relative w-full h-[calc(100vh-104px)] min-h-[580px] sm:min-h-[440px] max-h-[880px] flex items-start sm:items-center overflow-hidden bg-[#012148] select-none"
      id="heroFullbleedSection"
      aria-label="Featured Collection"
    >
      {/* 3D Parallax Full-Bleed Imagery Canvas */}
      <div
        className="absolute -top-[5%] -left-[5%] w-[110%] h-[112%] z-[1] pointer-events-none"
        id="heroImgStack"
        ref={imageRef}
      >
        <picture className="absolute inset-0 w-full h-full block">
          <source
            media="(max-width: 768px)"
            srcSet="/assets/images/lifestyle/Gemini_Generated_Image_tm4857tm4857tm48.jpg"
          />
          <source
            media="(min-width: 769px)"
            srcSet="/assets/images/lifestyle/Gemini_Generated_Image_c36exc36exc36exc.jpg"
          />
          <img
            src="/assets/images/lifestyle/Gemini_Generated_Image_c36exc36exc36exc.jpg"
            alt="Autumn / Winter 2026 Collection — Tailored Silhouette & Leather Tote Bag"
            className="absolute inset-0 w-full h-full object-cover object-[center_35%] sm:object-[70%_center] pointer-events-none"
            draggable="false"
          />
        </picture>
      </div>

      {/* Modernist Editorial Gradient Vignette: Clear center on mobile so model & bag are 100% visible */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(3,8,20,0.80)_0%,rgba(3,8,20,0.32)_22%,rgba(3,8,20,0.04)_50%,rgba(3,8,20,0.48)_78%,rgba(3,8,20,0.92)_100%)] sm:bg-none sm:bg-gradient-to-r sm:from-[#030814]/90 sm:via-[#030814]/50 sm:to-transparent z-[2]" />

      {/* Responsive Typography & Actions Container */}
      <div
        className="absolute top-5 sm:top-auto sm:relative z-10 w-full max-w-lg px-4 sm:px-0 sm:pl-12 lg:pl-20 text-center sm:text-left flex flex-col items-center sm:items-start space-y-2 sm:space-y-4"
        id="heroCenteredContent"
      >
        {/* Eyebrow */}
        <div className="hero-whisper-eyebrow">
          <span
            ref={eyebrowRef}
            className="text-[9.5px] sm:text-[11px] font-semibold tracking-[0.18em] uppercase text-white/85 block"
          >
            AUTUMN / WINTER 2026
          </span>
        </div>

        {/* Serif Headline Title */}
        <h1
          ref={titleRef}
          className="font-editorial text-3xl sm:text-6xl lg:text-7xl font-normal text-white tracking-[-0.025em] leading-[1.06] drop-shadow-[0_4px_24px_rgba(0,0,0,0.85)]"
        >
          Form in <span className="italic font-normal">Motion</span>
        </h1>

        {/* Single Confident Luxury Editorial Action */}
        <div ref={ctaRef} className="pt-0.5 sm:pt-1 w-auto flex flex-row items-center justify-center sm:justify-start gap-3">
          <Link
            href="/category?cat=all"
            className="inline-flex items-center justify-center gap-2 h-10 sm:h-[46px] px-6 sm:px-7 rounded-full bg-[#E11D48] hover:bg-[#E11D48]/90 text-white text-[10.5px] sm:text-[11.5px] font-bold tracking-[0.12em] uppercase transition-all shadow-[0_10px_28px_-4px_rgba(225,29,72,0.45),0_2px_8px_rgba(0,0,0,0.4)] hover:scale-105 border border-white/20 active:scale-95"
            id="heroExploreBtn"
          >
            <span>Explore Collection</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Floating 3D Shoppable Look Capsule (Mobile & Desktop) */}
      <div
        ref={capsuleRef}
        className="absolute bottom-20 sm:bottom-10 left-1/2 -translate-x-1/2 sm:left-auto sm:right-24 sm:translate-x-0 md:right-28 z-20 block w-max max-w-[calc(100vw-32px)]"
        id="heroHotspotWrap"
        role="region"
        aria-label="Featured Item"
      >
        <div
          onClick={handleCardClick}
          className="flex items-center gap-2.5 sm:gap-3 p-2 sm:p-2.5 pr-3 sm:pr-4 rounded-full sm:rounded-[18px] bg-[#040a14]/90 backdrop-blur-xl border border-white/25 sm:border-white/15 shadow-[0_16px_40px_rgba(0,0,0,0.75)] hover:border-white/35 transition-all hover:scale-105 duration-300 group cursor-pointer"
          id="heroHotspotCard"
        >
          {/* Thumb */}
          <div className="relative w-9 h-9 sm:w-12 sm:h-14 rounded-full sm:rounded-xl overflow-hidden bg-[#08254c] border border-white/20 sm:border-white/10 flex-shrink-0">
            <img
              src="/assets/images/lifestyle/thumb_tote.jpg"
              alt="Leather Tote Bag"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              id="heroDockThumbImg"
            />
          </div>

          {/* Info */}
          <div className="pr-1 text-left">
            <span
              className="text-[8px] sm:text-[9px] font-bold tracking-[0.14em] text-[#FB7185] uppercase block leading-tight"
              id="heroLookNum"
            >
              FEATURED ITEM
            </span>
            <h3
              className="text-[10px] sm:text-[11.5px] font-semibold text-white tracking-[0.04em] uppercase truncate max-w-[130px] sm:max-w-[160px] leading-snug mt-0.5"
              id="heroHotspotTitle"
            >
              LEATHER TOTE BAG
            </h3>
            <span
              className="text-[10px] sm:text-xs font-bold text-white/90 tabular-nums block mt-0.5"
              id="heroHotspotPrice"
            >
              € 245.00
            </span>
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full ${
              isAdded ? 'bg-[#10B981] text-white' : 'bg-[#F13365] sm:bg-white text-white sm:text-[#012148] hover:bg-[#F13365] hover:text-white'
            } transition-all flex items-center justify-center flex-shrink-0 shadow-md cursor-pointer ml-1 active:scale-95`}
            aria-label="Quick Add to Bag"
            title="Quick Add to Bag"
            type="button"
            id="heroHotspotAddBtn"
          >
            {isAdded ? <Check size={13} strokeWidth={3} /> : <Plus size={14} strokeWidth={2.5} />}
          </button>
        </div>
      </div>
    </section>
  );
}
