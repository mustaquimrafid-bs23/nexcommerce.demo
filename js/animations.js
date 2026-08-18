import { animate, inView, stagger, spring } from "https://cdn.jsdelivr.net/npm/motion@11.11.13/+esm";

console.error("ANIMATIONS.JS IS LOADED AND EXECUTING!");

/**
 * nexCommerce - Motion.dev Animation Orchestrator
 * Uses premium spring physics for a luxury editorial feel.
 */

document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  initSmoothScroll();
  initHeroAnimations();
  initCuratedDepartmentsMotion();
  // initTextSplits();
  initScrollReveals();
  initHoverEffects();
  initTrackingAnimations();
  initDealsSectionMotion();
  initIntentCardMotion();
  initCuratedGridMotion();
  initMicroMerchClusterMotion();
  initTrustStripMotion();
  initRecentlyViewedMotion();
});


// 0. Smooth Scrolling (Lenis)
function initSmoothScroll() {
  if (typeof Lenis !== 'undefined') {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // standard ease-out
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false, // touch devices usually handle this well natively
      touchMultiplier: 2,
      infinite: false,
      // Prevent Lenis from hijacking scroll inside modals and drawers
      prevent: (node) => {
        return node.closest('#nexMiniCartDrawer') !== null || 
               node.closest('.search-panel') !== null ||
               node.hasAttribute('data-lenis-prevent') ||
               node.closest('[data-lenis-prevent]') !== null;
      },
    });

    // Expose globally so openMiniCart/closeMiniCart can pause/resume
    window._nexLenis = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }
}

// 1. Hero Section Load Animations
function initHeroAnimations() {
  // Select all immediate children of hero-content to stagger them
  const heroContent = document.querySelector('.hero-content');
  const heroVisual = document.querySelector('.hero-visual-frame, #heroVisualFrame, .hero-product-visual');
  const heroDots = document.querySelector('.hero-carousel-dots');
  const heroTitle = document.querySelector('.hero-title');

  if (heroContent) {
    // If SplitType is available, split the title by words
    let splitTitle = null;
    if (typeof SplitType !== 'undefined' && heroTitle) {
      splitTitle = new SplitType(heroTitle, { types: 'words' });
      // We don't want the title itself to animate as a block if we are animating words
      heroTitle.style.opacity = 1; 
    }

    // Get all children EXCEPT the title if we split it
    const elementsToStagger = Array.from(heroContent.children).flatMap(child => {
      if (child === heroTitle && splitTitle) {
        return splitTitle.words; // Animate each word individually
      }
      return child; // Otherwise animate the whole element (eyebrow, subtitle, buttons)
    });

    // Hide initially (will be overridden by animate)
    animate(elementsToStagger, 
      { opacity: [0, 1], y: [20, 0] }, // Reduced travel distance from 30 to 20 for more subtle entry
      { 
        delay: stagger(0.08, { startDelay: 0.1 }),
        duration: 1.0, // Slower, more deliberate duration
        easing: [0.22, 1, 0.36, 1] // Apple-style custom cubic-bezier for a very premium, smooth deceleration (no bounce)
      }
    );
  }

  if (heroVisual) {
    animate(heroVisual,
      { opacity: [0, 1], scale: [0.97, 1] }, // More subtle scale
      { 
        delay: 0.2,
        duration: 1.2,
        easing: [0.22, 1, 0.36, 1]
      }
    );
  }

  if (heroDots) {
    animate(heroDots,
      { opacity: [0, 1] },
      { delay: 0.6, duration: 0.8 }
    );
  }
}

/**
 * 2. Curated Departments Editorial Bento Master Motion
 * - Kinetic Split Headline Entrance
 * - 5-Card Staggered Bento Cascade with Settle Scale
 * - Continuous Bidirectional Scroll Parallax (Lenis-linked differential depth)
 * - Dynamic Cursor-Tracking Obsidian Spotlight Sheen
 */
function initCuratedDepartmentsMotion() {
  const section = document.querySelector('.home-category-editorial-section');
  if (!section) return;

  const eyebrow = section.querySelector('.cat-editorial-eyebrow');
  const heading = section.querySelector('.cat-editorial-heading');
  const sub = section.querySelector('.cat-editorial-sub');
  const allLink = section.querySelector('.cat-editorial-all-link');
  const bentoLayout = section.querySelector('.cat-bento-layout');
  const heroCard = section.querySelector('.cat-bento-hero');
  const sideGrid = section.querySelector('.cat-bento-grid-side');
  const sideCards = section.querySelectorAll('.cat-bento-grid-side .cat-bento-card');
  const allCards = section.querySelectorAll('.cat-bento-card');

  // Check reduced motion preference
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    section.style.opacity = '1';
    return;
  }

  // 1. Kinetic Headline Splitting
  let headingWords = [];
  if (heading) {
    if (typeof SplitType !== 'undefined') {
      const split = new SplitType(heading, { types: 'words' });
      heading.style.opacity = '1';
      headingWords = split.words || [];
    }
  }

  // Hide elements initially for buttery GPU entrance
  const elementsToInitialHide = [eyebrow, sub, allLink, heroCard, ...sideCards].filter(Boolean);
  elementsToInitialHide.forEach(el => {
    el.style.opacity = '0';
  });
  if (headingWords.length > 0) {
    headingWords.forEach(w => { w.style.opacity = '0'; });
  } else if (heading) {
    heading.style.opacity = '0';
  }

  // 2. Orchestrated Scroll-Down Entrance with inView
  let isRevealed = false;
  inView(section, () => {
    if (isRevealed) return;
    isRevealed = true;

    // Header eyebrow
    if (eyebrow) {
      animate(eyebrow, { opacity: [0, 1], y: [16, 0] }, {
        duration: 0.7,
        easing: [0.16, 1, 0.3, 1]
      });
    }

    // Heading words (Masked / Staggered slide)
    if (headingWords.length > 0) {
      animate(headingWords, { opacity: [0, 1], y: [24, 0] }, {
        delay: stagger(0.065, { startDelay: 0.08 }),
        duration: 0.85,
        easing: [0.16, 1, 0.3, 1]
      });
    } else if (heading) {
      animate(heading, { opacity: [0, 1], y: [20, 0] }, {
        delay: 0.08,
        duration: 0.85,
        easing: [0.16, 1, 0.3, 1]
      });
    }

    // Subtitle & Explore Link
    if (sub) {
      animate(sub, { opacity: [0, 1], y: [16, 0] }, {
        delay: 0.16,
        duration: 0.8,
        easing: [0.16, 1, 0.3, 1]
      });
    }
    if (allLink) {
      animate(allLink, { opacity: [0, 1], y: [12, 0], scale: [0.94, 1] }, {
        delay: 0.22,
        duration: 0.75,
        easing: [0.16, 1, 0.3, 1]
      });
    }

    // Lead Bento Hero Card (01 Apparel)
    if (heroCard) {
      animate(heroCard, { opacity: [0, 1], y: [36, 0], scale: [0.965, 1] }, {
        delay: 0.12,
        duration: 0.9,
        easing: [0.16, 1, 0.3, 1]
      });
    }

    // Staggered Secondary Cards Grid (02 Footwear, 03 Acoustics, 04 Timepieces, 05 Leather)
    if (sideCards.length > 0) {
      animate(sideCards, { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] }, {
        delay: stagger(0.085, { startDelay: 0.2 }),
        duration: 0.85,
        easing: [0.16, 1, 0.3, 1]
      });
    }

    // Optical image settle inside all bento cards
    const allImages = section.querySelectorAll('.cat-bento-img-wrap img');
    if (allImages.length > 0) {
      animate(allImages, { scale: [1.08, 1.0] }, {
        delay: 0.15,
        duration: 1.2,
        easing: [0.16, 1, 0.3, 1]
      });
    }
  }, { margin: "0px 0px -10% 0px" });

  // 3. Continuous Bidirectional Scroll Parallax (Scroll-Down & Scroll-Up)
  let ticking = false;
  function updateBidirectionalParallax() {
    const rect = section.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Check if section is active in viewport
    if (rect.bottom > 0 && rect.top < windowHeight) {
      const totalScrollSpan = windowHeight + rect.height;
      const currentProgress = (windowHeight - rect.top) / totalScrollSpan;
      const progressClamped = Math.max(0, Math.min(1, currentProgress));
      const centered = progressClamped - 0.5; // -0.5 (top) to +0.5 (bottom)

      // Internal image glide across cards (±24px)
      const imgDrift = centered * 26;
      allCards.forEach(card => {
        const img = card.querySelector('.cat-bento-img-wrap img');
        if (img) {
          img.style.setProperty('--bento-img-y', `${imgDrift.toFixed(2)}px`);
        }
      });
    }
    ticking = false;
  }

  function requestParallaxTick() {
    if (!ticking) {
      requestAnimationFrame(updateBidirectionalParallax);
      ticking = true;
    }
  }

  // Hook into Lenis or native scroll for buttery bidirectional updates
  if (window._nexLenis) {
    window._nexLenis.on('scroll', requestParallaxTick);
  }
  window.addEventListener('scroll', requestParallaxTick, { passive: true });

  // 4. Dynamic Cursor-Tracking Obsidian Spotlight Sheen
  allCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
      card.style.setProperty('--spotlight-opacity', '1');
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--spotlight-opacity', '0');
    });
  });
}

// 3. Scroll Reveal Animations (Trust Strip, Category Grid, etc.)
function initScrollReveals() {
  // Target any section or wrapper with .reveal-on-scroll, excluding curated departments
  inView(".reveal-on-scroll", (info) => {
    if (info.target.classList.contains('home-category-editorial-section')) return;

    // When the element comes into view, animate it
    animate(info.target, 
      { opacity: [0, 1], y: [20, 0] },
      { 
        duration: 0.8,
        easing: [0.22, 1, 0.36, 1]
      }
    );
    
    // Animate children elements inside if they are cards/grids
    const childrenToStagger = info.target.querySelectorAll('.home-cat-pill, .deal-product-card, .curated-product-card, .trust-item-card, .category-tile, .ai-explain-card, .product-card');
    if (childrenToStagger.length > 0) {
      animate(childrenToStagger,
        { opacity: [0, 1], y: [15, 0] },
        { 
          delay: stagger(0.06),
          duration: 0.8,
          easing: [0.22, 1, 0.36, 1]
        }
      );
    }
  }, { margin: "100px 0px" });
}

// 4. Premium Hover Micro-interactions (Motion-powered)
function initHoverEffects() {
  // For generic category tiles and standard cards (excluding 3D-managed cards)
  document.body.addEventListener('mouseenter', (e) => {
    const card = e.target.closest('.home-cat-pill, .category-tile, .product-card:not(.deal-product-card):not(.curated-product-card)');
    if (card) {
      animate(card, { y: -2 }, { duration: 0.4, easing: [0.22, 1, 0.36, 1] });
    }
  }, true);

  document.body.addEventListener('mouseleave', (e) => {
    const card = e.target.closest('.home-cat-pill, .category-tile, .product-card:not(.deal-product-card):not(.curated-product-card)');
    if (card) {
      animate(card, { y: 0 }, { duration: 0.4, easing: [0.22, 1, 0.36, 1] });
    }
  }, true);
}

// 4. Split Text Initializations (PLP / PDP)
function initTextSplits() {
  try {
    if (typeof SplitType === 'undefined') return;
    
    const plpTitle = document.querySelector('.plp-title');
    if (plpTitle) {
      const split = new SplitType(plpTitle, { types: 'words' });
      plpTitle.style.opacity = 1;
      if (split.words && split.words.length > 0) {
        animate(split.words, 
          { opacity: [0, 1], y: [20, 0] },
          { delay: stagger(0.08, { startDelay: 0.1 }), type: 'spring', stiffness: 100, damping: 20 }
        );
      }
    }

    const pdpTitle = document.querySelector('.pdp-product-title');
    if (pdpTitle) {
      const split = new SplitType(pdpTitle, { types: 'words' });
      pdpTitle.style.opacity = 1;
      if (split.words && split.words.length > 0) {
        animate(split.words, 
          { opacity: [0, 1], y: [20, 0] },
          { delay: stagger(0.08, { startDelay: 0.1 }), type: 'spring', stiffness: 100, damping: 20 }
        );
      }
    }

    const discoveryTitle = document.querySelector('.discovery-hero-title');
    if (discoveryTitle) {
      const split = new SplitType(discoveryTitle, { types: 'words' });
      discoveryTitle.style.opacity = 1;
      if (split.words && split.words.length > 0) {
        animate(split.words, 
          { opacity: [0, 1], y: [20, 0] },
          { delay: stagger(0.08, { startDelay: 0.1 }), type: 'spring', stiffness: 100, damping: 20 }
        );
      }
    }
  } catch (err) {
    console.error("Animation error in initTextSplits:", err);
  }
}

// 5. Tracking Page Animations
function initTrackingAnimations() {
  const trackingTimeline = document.getElementById('trackingTimeline');
  if (trackingTimeline) {
    const staggerItems = trackingTimeline.querySelectorAll('[data-motion="stagger-item"]');
    if (staggerItems.length > 0) {
      animate(staggerItems,
        { opacity: [0, 1], y: [15, 0] },
        {
          delay: stagger(0.12, { startDelay: 0.2 }),
          duration: 0.8,
          easing: [0.22, 1, 0.36, 1]
        }
      );
    }
  }

  // Fade up the AI Delivery Assistant box
  // We use a MutationObserver because it's dynamically rendered by tracking.js
  const observer = new MutationObserver((mutations, obs) => {
    const fadeUpItems = document.querySelectorAll('[data-motion="fade-up"]');
    if (fadeUpItems.length > 0) {
      animate(fadeUpItems,
        { opacity: [0, 1], y: [20, 0] },
        { delay: 0.4, duration: 1.0, easing: [0.22, 1, 0.36, 1] }
      );
      obs.disconnect(); // Only animate once
    }
  });
  
  const trackingMain = document.getElementById('trackingMain');
  if (trackingMain) {
    observer.observe(trackingMain, { childList: true, subtree: true });
  }
}

/**
 * initDealsSectionMotion
 * Implements all 4 Motion Standards for the Today's Deals section:
 * 1. Micro-interactions (scroll-reveal stagger)
 * 2. 3D Hover Physics (mouse tilt + specular glare + multi-layer shadow)
 * 3. GPU Page Transition (cross-dissolve curtain)
 * 4. Scroll Parallax (differential column depth)
 */
function initDealsSectionMotion() {
  const section = document.getElementById('dealsSectionRoot');
  if (!section) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = Array.from(section.querySelectorAll('.deal-product-card'));

  // ── 1. MICRO-INTERACTIONS: Staggered scroll-reveal entrance ──────────
  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

    const headerLeft  = section.querySelector('.deals-header-left');
    const headerRight = section.querySelector('.deals-header-right');
    if (headerLeft) {
      animate(headerLeft,  { opacity: [0, 1], y: [12, 0] },
        { duration: 0.6, easing: [0.16, 1, 0.3, 1] });
    }
    if (headerRight) {
      animate(headerRight, { opacity: [0, 1], y: [12, 0] },
        { duration: 0.6, delay: 0.08, easing: [0.16, 1, 0.3, 1] });
    }
    if (cards.length > 0) {
      animate(cards,
        { opacity: [0, 1], y: [28, 0], scale: [0.96, 1] },
        { delay: stagger(0.07, { startDelay: 0.12 }), duration: 0.7,
          easing: [0.16, 1, 0.3, 1] });
    }
  }, { margin: '0px 0px -8% 0px' });

  // Skip physics on reduced motion
  if (prefersReduced) return;

  // ── 2. 3D HOVER PHYSICS: Mouse tilt + specular glare ─────────────────
  const MAX_TILT = 8; // degrees

  cards.forEach(card => {
    let rafId = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const LERP = 0.12;
    const lerp = (a, b, t) => a + (b - a) * t;

    function getParallaxY() {
      return parseFloat(card.style.getPropertyValue('--deal-card-y') || '0');
    }

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, LERP);
      curTY = lerp(curTY, tgtTY, LERP);
      const py = getParallaxY();
      card.style.setProperty('--deal-shadow-lift', '1');
      card.style.transform =
        `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;

      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        card.style.transform =
          `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;
        rafId = null;
      }
    }

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY =  (dx * MAX_TILT);

      // Specular glare at cursor
      const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      card.style.setProperty('--deal-glare-x', gx);
      card.style.setProperty('--deal-glare-y', gy);
      card.style.setProperty('--deal-glare-opacity', '1');

      if (!rafId) { rafId = requestAnimationFrame(applyTilt); }
    });

    card.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;
      card.style.setProperty('--deal-glare-opacity', '0');
      card.style.setProperty('--deal-shadow-lift', '0');

      function springBack() {
        curTX = lerp(curTX, 0, 0.18);
        curTY = lerp(curTY, 0, 0.18);
        const py = getParallaxY();
        card.style.transform =
          `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px) translateY(${py}px)`;
        if (Math.abs(curTX) > 0.05 || Math.abs(curTY) > 0.05) {
          rafId = requestAnimationFrame(springBack);
        } else {
          const pyFinal = getParallaxY();
          card.style.transform = `translateY(${pyFinal}px)`;
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });

  // ── 3. PAGE TRANSITION: GPU cross-dissolve on card/link clicks ────────
  const curtain = document.getElementById('pageTransitionOverlay');

  function triggerPageTransition(href) {
    if (!curtain || !href) return;
    curtain.style.transition    = 'opacity 200ms ease';
    curtain.style.opacity       = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 210);
  }

  // Cards are <a> tags — intercept click before native navigation
  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.deal-add-btn') || e.target.closest('.deal-wishlist-btn')) return;
      e.preventDefault();
      triggerPageTransition(card.getAttribute('href'));
    });
  });

  const allDealsLink = section.querySelector('.deals-see-all-link');
  if (allDealsLink) {
    allDealsLink.addEventListener('click', e => {
      e.preventDefault();
      triggerPageTransition(allDealsLink.getAttribute('href'));
    });
  }

  // ── 4. SCROLL PARALLAX: Differential column depth ────────────────────
  let pxTicking = false;

  function updateDealsParallax() {
    const rect   = section.getBoundingClientRect();
    const winH   = window.innerHeight;
    if (rect.bottom > 0 && rect.top < winH) {
      const span     = winH + rect.height;
      const prog     = (winH - rect.top) / span;   // 0 → 1
      const centered = (prog - 0.5) * 2;           // -1 → +1

      cards.forEach(card => {
        const depth  = parseInt(card.getAttribute('data-parallax-depth') || '1', 10);
        const travel = depth * 7; // px per depth unit
        const yCard  = (centered * travel).toFixed(2);
        card.style.setProperty('--deal-card-y', yCard + 'px');

        // Only apply card-level parallax when NOT being hovered (JS tilt overrides)
        if (!card.matches(':hover')) {
          card.style.transform = `translateY(${yCard}px)`;
        }

        // Image micro-parallax
        const img = card.querySelector('.deal-img-box img');
        if (img) {
          const yImg = (centered * depth * 5).toFixed(2);
          img.style.setProperty('--deal-img-y', yImg + 'px');
        }
      });
    }
    pxTicking = false;
  }

  function requestParallaxFrame() {
    if (!pxTicking) {
      requestAnimationFrame(updateDealsParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestParallaxFrame); }
  window.addEventListener('scroll', requestParallaxFrame, { passive: true });
}

/**
 * initIntentCardMotion
 * Implements all 4 Motion Standards for Intent Discovery Card:
 * 1. Micro-interactions (scroll reveal entrance)
 * 2. 3D Hover Physics (spring lerp tilt + dynamic specular glare)
 * 3. GPU Page Transition (curtain cross-dissolve)
 * 4. Scroll Parallax (differential layer depth)
 */
function initIntentCardMotion() {
  const section = document.getElementById('homeIntentSectionRoot');
  if (!section) return;

  const card = section.querySelector('.home-intent-card');
  if (!card) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. MICRO-INTERACTIONS: Scroll Reveal Entrance ──────────────────
  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

    animate(card,
      { opacity: [0, 1], y: [32, 0], scale: [0.97, 1] },
      { duration: 0.85, easing: [0.16, 1, 0.3, 1] }
    );

    const chips = section.querySelectorAll('.intent-chip-pill');
    if (chips.length > 0) {
      animate(chips,
        { opacity: [0, 1], y: [14, 0] },
        { delay: stagger(0.06, { startDelay: 0.25 }), duration: 0.6, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }, { margin: '0px 0px -10% 0px' });

  if (prefersReduced) return;

  // ── 2. 3D HOVER PHYSICS: Mouse Tilt & Specular Tracking ────────────
  const MAX_TILT = 5.5; // degrees (subtle, non-distorting)
  let rafId = null;
  let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
  const LERP = 0.10;
  const lerp = (a, b, t) => a + (b - a) * t;

  function getCardParallaxY() {
    return parseFloat(card.style.getPropertyValue('--intent-card-y') || '0');
  }

  function applyCardTilt() {
    curTX = lerp(curTX, tgtTX, LERP);
    curTY = lerp(curTY, tgtTY, LERP);
    const py = getCardParallaxY();
    card.style.setProperty('--intent-shadow-lift', '1');
    card.style.transform =
      `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;

    if (Math.abs(curTX - tgtTX) > 0.04 || Math.abs(curTY - tgtTY) > 0.04) {
      rafId = requestAnimationFrame(applyCardTilt);
    } else {
      card.style.transform =
        `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;
      rafId = null;
    }
  }

  card.addEventListener('mousemove', (e) => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    tgtTX = -(dy * MAX_TILT);
    tgtTY =  (dx * MAX_TILT);

    // Specular glare tracking
    const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
    const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
    card.style.setProperty('--intent-glare-x', gx);
    card.style.setProperty('--intent-glare-y', gy);
    card.style.setProperty('--intent-glare-opacity', '1');

    if (!rafId) { rafId = requestAnimationFrame(applyCardTilt); }
  });

  card.addEventListener('mouseleave', () => {
    tgtTX = 0; tgtTY = 0;
    card.style.setProperty('--intent-glare-opacity', '0');
    card.style.setProperty('--intent-shadow-lift', '0');

    function springBack() {
      curTX = lerp(curTX, 0, 0.16);
      curTY = lerp(curTY, 0, 0.16);
      const py = getCardParallaxY();
      card.style.transform =
        `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px) translateY(${py}px)`;
      if (Math.abs(curTX) > 0.04 || Math.abs(curTY) > 0.04) {
        rafId = requestAnimationFrame(springBack);
      } else {
        card.style.transform = `translateY(${py}px)`;
        rafId = null;
      }
    }
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(springBack);
  });

  // ── 3. SCROLL PARALLAX: Differential Layer Depth ───────────────────
  let pxTicking = false;
  const inputWrap = card.querySelector('.intent-input-wrap');
  const bgMesh    = card.querySelector('.intent-ambient-mesh');
  const chipPills = card.querySelectorAll('.intent-chip-pill');

  function updateIntentParallax() {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span     = winH + rect.height;
      const prog     = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;         // -1 → +1

      // Layer 1: Card Base
      const cardY = (centered * 16).toFixed(2);
      card.style.setProperty('--intent-card-y', cardY + 'px');
      if (!card.matches(':hover')) {
        card.style.transform = `translateY(${cardY}px)`;
      }

      // Layer 0: Background Ambient Mesh (drifts slower)
      if (bgMesh) {
        const bgY = (centered * 10).toFixed(2);
        card.style.setProperty('--intent-bg-y', bgY + 'px');
      }

      // Layer 2: Floating Input Wrap (drifts faster)
      if (inputWrap) {
        const inputY = (centered * 22).toFixed(2);
        card.style.setProperty('--intent-input-y', inputY + 'px');
      }

      // Layer 1.5: Suggestion Chips
      chipPills.forEach(chip => {
        const depth = parseInt(chip.getAttribute('data-chip-depth') || '1', 10);
        const chipY = (centered * depth * 5).toFixed(2);
        chip.style.setProperty('--chip-y', chipY + 'px');
      });
    }
    pxTicking = false;
  }

  function requestParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateIntentParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestParallaxTick); }
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
}

/**
 * initCuratedGridMotion
 * Implements all 4 Motion Standards for Curated Style Grid:
 * 1. Micro-interactions (scroll-reveal stagger)
 * 2. 3D Hover Physics (spring lerp mouse tilt + dynamic specular glare)
 * 3. GPU Page Transition (curtain cross-dissolve)
 * 4. Scroll Parallax (differential column depth)
 */
function initCuratedGridMotion() {
  const section = document.getElementById('homeCuratedSection');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.curated-product-card'));
  if (cards.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. MICRO-INTERACTIONS: Scroll Reveal Stagger ────────────────────
  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

    animate(cards,
      { opacity: [0, 1], y: [28, 0], scale: [0.96, 1] },
      { delay: stagger(0.08, { startDelay: 0.1 }), duration: 0.75, easing: [0.16, 1, 0.3, 1] }
    );
  }, { margin: '0px 0px -8% 0px' });

  // ── 2. PAGE TRANSITION: "View all" Link Curtain Dissolve ───────────
  const seeAllLink = section.querySelector('.curated-see-all-link');
  if (seeAllLink) {
    seeAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      const curtain = document.getElementById('pageTransitionOverlay');
      const targetUrl = seeAllLink.getAttribute('href');
      if (curtain) {
        curtain.style.transition = 'opacity 200ms ease';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = targetUrl; }, 210);
      } else {
        window.location.href = targetUrl;
      }
    });
  }

  if (prefersReduced) return;

  // ── 3. 3D HOVER PHYSICS: Mouse Tilt & Specular Tracking ────────────
  const MAX_TILT = 6.5; // degrees
  cards.forEach(card => {
    let rafId = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const LERP = 0.12;
    const lerp = (a, b, t) => a + (b - a) * t;

    function getCardParallaxY() {
      return parseFloat(card.style.getPropertyValue('--curated-card-y') || '0');
    }

    function applyCardTilt() {
      curTX = lerp(curTX, tgtTX, LERP);
      curTY = lerp(curTY, tgtTY, LERP);
      const py = getCardParallaxY();
      card.style.setProperty('--curated-shadow-lift', '1');
      card.style.transform =
        `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;

      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyCardTilt);
      } else {
        card.style.transform =
          `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;
        rafId = null;
      }
    }

    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY =  (dx * MAX_TILT);

      // Specular glare tracking
      const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      card.style.setProperty('--curated-glare-x', gx);
      card.style.setProperty('--curated-glare-y', gy);
      card.style.setProperty('--curated-glare-opacity', '1');

      if (!rafId) { rafId = requestAnimationFrame(applyCardTilt); }
    });

    card.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;
      card.style.setProperty('--curated-glare-opacity', '0');
      card.style.setProperty('--curated-shadow-lift', '0');

      function springBack() {
        curTX = lerp(curTX, 0, 0.18);
        curTY = lerp(curTY, 0, 0.18);
        const py = getCardParallaxY();
        card.style.transform =
          `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px) translateY(${py}px)`;
        if (Math.abs(curTX) > 0.05 || Math.abs(curTY) > 0.05) {
          rafId = requestAnimationFrame(springBack);
        } else {
          card.style.transform = `translateY(${py}px)`;
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });

  // ── 4. SCROLL PARALLAX: Differential Column Depth ──────────────────
  let pxTicking = false;

  function updateCuratedParallax() {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span     = winH + rect.height;
      const prog     = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;         // -1 → +1

      cards.forEach(card => {
        const depth  = parseInt(card.getAttribute('data-parallax-depth') || '1', 10);
        const travel = depth * 7; // px
        const yCard  = (centered * travel).toFixed(2);
        card.style.setProperty('--curated-card-y', yCard + 'px');

        if (!card.matches(':hover')) {
          card.style.transform = `translateY(${yCard}px)`;
        }

        // Image internal micro-parallax
        const img = card.querySelector('.curated-img-box img');
        if (img) {
          const yImg = (centered * depth * 4.5).toFixed(2);
          img.style.setProperty('--curated-img-y', yImg + 'px');
        }
      });
    }
    pxTicking = false;
  }

  function requestParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateCuratedParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestParallaxTick); }
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
}

/**
 * initMicroMerchClusterMotion
 * Implements all 4 Motion Standards for the Micro-Merchandising Editorial Cluster:
 * 1. Micro-interactions (scroll reveal stagger entrance)
 * 2. 3D Hover Physics (spring lerp mouse tilt + dynamic specular glare)
 * 3. GPU Page Transition (curtain cross-dissolve)
 * 4. Scroll Parallax (differential column depth)
 */
function initMicroMerchClusterMotion() {
  const section = document.getElementById('homeMicroMerchSection') || document.querySelector('.home-micro-merch-section');
  if (!section) return;

  const cols = Array.from(section.querySelectorAll('.micro-merch-col'));
  if (cols.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. MICRO-INTERACTIONS: Scroll Reveal Stagger ────────────────────
  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

    animate(cols,
      { opacity: [0, 1], y: [32, 0], scale: [0.96, 1] },
      { delay: stagger(0.08, { startDelay: 0.1 }), duration: 0.75, easing: [0.16, 1, 0.3, 1] }
    );
  }, { margin: '0px 0px -8% 0px' });

  // ── 2. PAGE TRANSITION: "See all" & Product Links Curtain Dissolve ──
  const curtain = document.getElementById('pageTransitionOverlay');
  function triggerPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms ease';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 210);
  }

  section.querySelectorAll('.micro-col-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      triggerPageTransition(link.getAttribute('href'));
    });
  });

  if (prefersReduced) return;

  // ── 3. 3D HOVER PHYSICS: Mouse Tilt & Specular Tracking ────────────
  const MAX_TILT = 5.5; // degrees
  cols.forEach(col => {
    let rafId = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const LERP = 0.12;
    const lerp = (a, b, t) => a + (b - a) * t;

    function getColParallaxY() {
      return parseFloat(col.style.getPropertyValue('--micro-card-y') || '0');
    }

    function applyColTilt() {
      curTX = lerp(curTX, tgtTX, LERP);
      curTY = lerp(curTY, tgtTY, LERP);
      const py = getColParallaxY();
      col.style.transform =
        `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(10px) translateY(${py}px)`;

      if (Math.abs(curTX - tgtTX) > 0.04 || Math.abs(curTY - tgtTY) > 0.04) {
        rafId = requestAnimationFrame(applyColTilt);
      } else {
        col.style.transform =
          `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(10px) translateY(${py}px)`;
        rafId = null;
      }
    }

    col.addEventListener('mousemove', (e) => {
      const r = col.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY = (dx * MAX_TILT);

      // Specular glare tracking
      const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
      const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
      col.style.setProperty('--micro-glare-x', gx);
      col.style.setProperty('--micro-glare-y', gy);
      col.style.setProperty('--micro-glare-opacity', '1');

      if (!rafId) { rafId = requestAnimationFrame(applyColTilt); }
    });

    col.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;
      col.style.setProperty('--micro-glare-opacity', '0');

      function springBack() {
        curTX = lerp(curTX, 0, 0.18);
        curTY = lerp(curTY, 0, 0.18);
        const py = getColParallaxY();
        col.style.transform =
          `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px) translateY(${py}px)`;
        if (Math.abs(curTX) > 0.04 || Math.abs(curTY) > 0.04) {
          rafId = requestAnimationFrame(springBack);
        } else {
          col.style.transform = `translateY(${py}px)`;
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });

  // ── 4. SCROLL PARALLAX: Differential Column Depth ──────────────────
  let pxTicking = false;

  function updateMicroParallax() {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span = winH + rect.height;
      const prog = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;     // -1 → +1

      cols.forEach(col => {
        const depth = parseFloat(col.getAttribute('data-parallax-depth') || '1');
        const travel = depth * 7.5; // px travel
        const yCol = (centered * travel).toFixed(2);
        col.style.setProperty('--micro-card-y', yCol + 'px');

        if (!col.matches(':hover')) {
          col.style.transform = `translateY(${yCol}px)`;
        }

        // Image internal micro-parallax
        const thumbs = col.querySelectorAll('.micro-item-thumb img');
        thumbs.forEach(img => {
          const yImg = (centered * depth * 4).toFixed(2);
          img.style.setProperty('--micro-img-y', yImg + 'px');
        });
      });
    }
    pxTicking = false;
  }

  function requestParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateMicroParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestParallaxTick); }
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
}

/**
 * initTrustStripMotion
 * Full 4-Motion-Standard implementation for the Trust & Value Proposition Strip:
 * 1. Micro-interactions  - 120fps GPU scaleX progress bar + tab switcher + tactile ripple
 * 2. 3D Hover Physics    - Spring LERP mouse tilt + cursor-tracking specular glare
 * 3. Page Transitions    - GPU cross-dissolve curtain on trust-link clicks
 * 4. Scroll Parallax     - Differential card depth (Lenis + rAF)
 */
function initTrustStripMotion() {
  const section = document.getElementById('trustStripSection');
  if (!section) return;

  const cards   = Array.from(section.querySelectorAll('.trust-item-card'));
  const bar     = document.getElementById('trustProgressBar');
  const tabs    = Array.from(section.querySelectorAll('.trust-prog-label'));
  const curtain = document.getElementById('pageTransitionOverlay');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1a. SCROLL REVEAL: Staggered Motion.dev entrance
  if (!prefersReduced) {
    let revealed = false;
    inView(section, () => {
      if (revealed) return;
      revealed = true;

      const header = section.querySelector('.trust-strip-header');
      if (header) {
        animate(header,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.65, easing: [0.16, 1, 0.3, 1] }
        );
      }

      const progressArea = section.querySelector('.trust-progress-container');
      if (progressArea) {
        animate(progressArea,
          { opacity: [0, 1], y: [12, 0] },
          { delay: 0.1, duration: 0.5, easing: [0.16, 1, 0.3, 1] }
        );
      }

      animate(cards,
        { opacity: [0, 1], y: [28, 0], scale: [0.97, 1] },
        { delay: stagger(0.07, { startDelay: 0.15 }), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
      );
    }, { margin: '0px 0px -6% 0px' });
  }

  // 1b. 120fps GPU PROGRESS BAR + PILLAR TAB SWITCHER
  const TOTAL_TABS = tabs.length || 4;
  let activeTab  = 0;
  let progRaf    = null;
  let progStart  = null;
  const DWELL_MS = 3200;

  function setActiveTab(idx, withAnim) {
    tabs.forEach((t, i) => t.classList.toggle('active', i === idx));
    cards.forEach((c, i) => {
      c.style.borderColor = (i === idx) ? 'rgba(255, 255, 255, 0.14)' : '';
    });
    const targetScale = (idx + 1) / TOTAL_TABS;
    if (bar) {
      bar.style.transition = 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.transform  = 'scaleX(' + targetScale + ')';
    }
    activeTab = idx;
    if (withAnim) startProgressDwell();
  }

  function startProgressDwell() {
    if (prefersReduced) return;
    if (progRaf) cancelAnimationFrame(progRaf);
    if (bar) bar.style.transition = 'none';
    progStart = null;

    const fromScale = activeTab / TOTAL_TABS;
    const toScale   = (activeTab + 1) / TOTAL_TABS;

    function tick(ts) {
      if (!progStart) progStart = ts;
      const elapsed = ts - progStart;
      const t       = Math.min(elapsed / DWELL_MS, 1);
      const scale   = fromScale + (toScale - fromScale) * t;
      if (bar) bar.style.transform = 'scaleX(' + scale + ')';

      if (t < 1) {
        progRaf = requestAnimationFrame(tick);
      } else {
        const next = (activeTab + 1) % TOTAL_TABS;
        setActiveTab(next, true);
      }
    }
    progRaf = requestAnimationFrame(tick);
  }

  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      if (progRaf) cancelAnimationFrame(progRaf);
      setActiveTab(i, true);
    });
  });

  section.addEventListener('mouseenter', () => {
    if (progRaf) cancelAnimationFrame(progRaf);
  });
  section.addEventListener('mouseleave', () => {
    if (!prefersReduced) startProgressDwell();
  });

  setActiveTab(0, !prefersReduced);

  // 1c. TACTILE RIPPLE on card click / keyboard
  function fireRipple(card, x, y) {
    const ripple = card.querySelector('.trust-ripple');
    if (!ripple) return;
    ripple.classList.remove('trust-ripple-active');
    void ripple.offsetWidth;
    ripple.style.left = x + 'px';
    ripple.style.top  = y + 'px';
    ripple.classList.add('trust-ripple-active');
    setTimeout(function() { ripple.classList.remove('trust-ripple-active'); }, 530);
  }

  cards.forEach(function(card) {
    card.addEventListener('click', function(e) {
      if (e.target.closest('.trust-link')) return;
      const r = card.getBoundingClientRect();
      fireRipple(card, e.clientX - r.left, e.clientY - r.top);
    });
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        const r = card.getBoundingClientRect();
        fireRipple(card, r.width / 2, r.height / 2);
      }
    });
  });

  if (prefersReduced) return;

  // 2. 3D HOVER PHYSICS: Spring LERP Tilt + Specular Glare
  const MAX_TILT = 6.5;

  cards.forEach(function(card) {
    let rafId = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const LERP = 0.11;
    const lerp = function(a, b, t) { return a + (b - a) * t; };

    function getCardY() {
      return parseFloat(card.style.getPropertyValue('--trust-card-y') || '0');
    }

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, LERP);
      curTY = lerp(curTY, tgtTY, LERP);
      const py = getCardY();
      card.style.transform =
        'perspective(1000px) rotateX(' + curTX.toFixed(3) + 'deg) rotateY(' + curTY.toFixed(3) + 'deg) translateZ(10px) translateY(' + py + 'px)';

      if (Math.abs(curTX - tgtTX) > 0.04 || Math.abs(curTY - tgtTY) > 0.04) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        card.style.transform =
          'perspective(1000px) rotateX(' + tgtTX.toFixed(3) + 'deg) rotateY(' + tgtTY.toFixed(3) + 'deg) translateZ(10px) translateY(' + py + 'px)';
        rafId = null;
      }
    }

    card.addEventListener('mousemove', function(e) {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY =  (dx * MAX_TILT);

      const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      card.style.setProperty('--trust-glare-x', gx);
      card.style.setProperty('--trust-glare-y', gy);
      card.style.setProperty('--trust-glare-opacity', '1');

      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });

    card.addEventListener('mouseleave', function() {
      tgtTX = 0; tgtTY = 0;
      card.style.setProperty('--trust-glare-opacity', '0');

      function springBack() {
        curTX = lerp(curTX, 0, 0.16);
        curTY = lerp(curTY, 0, 0.16);
        const py = getCardY();
        card.style.transform =
          'perspective(1000px) rotateX(' + curTX.toFixed(3) + 'deg) rotateY(' + curTY.toFixed(3) + 'deg) translateZ(0px) translateY(' + py + 'px)';
        if (Math.abs(curTX) > 0.04 || Math.abs(curTY) > 0.04) {
          rafId = requestAnimationFrame(springBack);
        } else {
          card.style.transform = 'translateY(' + py + 'px)';
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });

  // 3. GPU PAGE TRANSITIONS on trust explore links
  function triggerPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition    = 'opacity 200ms ease';
    curtain.style.opacity       = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(function() { window.location.href = href; }, 210);
  }

  section.querySelectorAll('.trust-link').forEach(function(link) {
    link.addEventListener('click', function(e) {
      const href = link.getAttribute('href');
      if (href && !href.startsWith('#')) {
        e.preventDefault();
        triggerPageTransition(href);
      }
    });
  });

  // 4. SCROLL PARALLAX: Differential card depth
  let pxTicking = false;

  function updateTrustParallax() {
    const rect    = section.getBoundingClientRect();
    const winH    = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span     = winH + rect.height;
      const prog     = (winH - rect.top) / span;
      const centered = (prog - 0.5) * 2;

      cards.forEach(function(card) {
        const depth  = parseFloat(card.getAttribute('data-parallax-depth') || '1');
        const travel = depth * 6;
        const yCard  = (centered * travel).toFixed(2);
        card.style.setProperty('--trust-card-y', yCard + 'px');

        if (!card.matches(':hover')) {
          card.style.transform = 'translateY(' + yCard + 'px)';
        }
      });
    }
    pxTicking = false;
  }

  function requestTrustParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateTrustParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestTrustParallaxTick); }
  window.addEventListener('scroll', requestTrustParallaxTick, { passive: true });
}

/**
 * 12. RECENTLY VIEWED PRODUCTS TRAY - 4 MOTION STANDARDS
 * 1. Micro-interactions: 120fps progress timer & Motion.dev entrance cascade.
 * 2. 3D Hover Effects: 3D spring tilt physics (±6.0°), specular glare tracking, multi-tier diffuse shadow.
 * 3. Page Transitions: GPU cross-dissolve curtain (#pageTransitionOverlay) on card click.
 * 4. Scroll Parallax: Differential card depth on scroll.
 */
function initRecentlyViewedMotion() {
  const section = document.getElementById('homeRecentlyViewedSection');
  if (!section) return;

  const header = section.querySelector('.recent-header-row');
  const tabs = section.querySelector('.recent-tabs-container');
  const cards = section.querySelectorAll('.recent-glide-card');
  const curtain = document.getElementById('pageTransitionOverlay');

  // 1. MICRO-INTERACTIONS: Motion.dev Entrance Cascade (Run once)
  if (!section._hasEntranceAnimated) {
    section._hasEntranceAnimated = true;
    try {
      if (typeof inView !== 'undefined' && typeof animate !== 'undefined') {
        inView(section, () => {
          if (header) {
            animate(header, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, easing: [0.22, 1, 0.36, 1] });
          }
          if (tabs) {
            animate(tabs, { opacity: [0, 1], y: [16, 0] }, { duration: 0.6, delay: 0.08, easing: [0.22, 1, 0.36, 1] });
          }
          if (cards.length > 0) {
            animate(cards, { opacity: [0, 1], y: [20, 0], scale: [0.97, 1] }, {
              delay: stagger(0.05, { startDelay: 0.1 }),
              duration: 0.65,
              easing: [0.22, 1, 0.36, 1]
            });
          }
        }, { amount: 0.1 });
      }
    } catch (e) {
      console.warn('Recently viewed inView entrance fallback:', e);
    }
  }

  // 2. 3D HOVER EFFECTS: Spring Lerp Tilt & Specular Sheen
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  if (!isReduced && !isTouch) {
    const MAX_TILT = 5.5;
    const lerp = (a, b, t) => a + (b - a) * t;

    cards.forEach(card => {
      if (card._hasMotionListeners) return;
      card._hasMotionListeners = true;

      let curTX = 0, curTY = 0;
      let tgtTX = 0, tgtTY = 0;
      let rafId = null;
      card._isHovered = false;
      card._parallaxY = 0;

      function applyTilt() {
        curTX = lerp(curTX, tgtTX, 0.12);
        curTY = lerp(curTY, tgtTY, 0.12);
        const py = card._parallaxY || 0;
        card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(10px) translateY(${py}px)`;
        if (Math.abs(curTX - tgtTX) > 0.01 || Math.abs(curTY - tgtTY) > 0.01) {
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = null;
        }
      }

      card.addEventListener('mouseenter', () => {
        card._isHovered = true;
      });

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tgtTX = -(dy * MAX_TILT);
        tgtTY = (dx * MAX_TILT);

        const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        card.style.setProperty('--recents-glare-x', gx);
        card.style.setProperty('--recents-glare-y', gy);
        card.style.setProperty('--recents-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        card._isHovered = false;
        tgtTX = 0; tgtTY = 0;
        card.style.setProperty('--recents-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.15);
          curTY = lerp(curTY, 0, 0.15);
          const py = card._parallaxY || 0;
          card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(0px) translateY(${py}px)`;
          if (Math.abs(curTX) > 0.02 || Math.abs(curTY) > 0.02) {
            rafId = requestAnimationFrame(springBack);
          } else {
            card.style.transform = `translateY(${py}px)`;
            rafId = null;
          }
        }
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(springBack);
      });
    });
  }

  // 3. GPU PAGE TRANSITIONS on recent card clicks
  function triggerPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms ease';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 210);
  }

  cards.forEach(card => {
    if (card._hasNavListener) return;
    card._hasNavListener = true;

    card.addEventListener('click', (e) => {
      // Don't navigate if click was on the quick-add button or ripple
      if (e.target.closest('.recent-card-quick-add') || e.target.closest('.recent-ripple')) {
        return;
      }
      const href = card.getAttribute('href');
      if (href && !href.startsWith('#')) {
        e.preventDefault();
        triggerPageTransition(href);
      }
    });
  });

  // 4. SCROLL PARALLAX: Differential card depth
  let pxTicking = false;

  function updateRecentsParallax() {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span = winH + rect.height;
      const prog = (winH - rect.top) / span;
      const centered = (prog - 0.5) * 2;

      cards.forEach(card => {
        const depth = parseFloat(card.getAttribute('data-parallax-depth') || '1');
        const travel = depth * 5;
        const yCard = parseFloat((centered * travel).toFixed(2));
        card._parallaxY = yCard;
        card.style.setProperty('--recent-card-y', `${yCard}px`);

        if (!card._isHovered) {
          card.style.transform = `translateY(${yCard}px)`;
        }
      });
    }
    pxTicking = false;
  }

  function requestRecentsParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateRecentsParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) {
    window._nexLenis.on('scroll', requestRecentsParallaxTick);
  }
  window.addEventListener('scroll', requestRecentsParallaxTick, { passive: true });
}

window.initRecentlyViewedMotion = initRecentlyViewedMotion;

