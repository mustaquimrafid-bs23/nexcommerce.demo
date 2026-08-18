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
  // For product cards and category tiles
  // Notice we delegate this so dynamically added products get the effect
  document.body.addEventListener('mouseenter', (e) => {
    const card = e.target.closest('.home-cat-pill, .deal-product-card, .curated-product-card, .category-tile, .product-card');
    if (card) {
      animate(card, { y: -2 }, { duration: 0.4, easing: [0.22, 1, 0.36, 1] });
    }
  }, true);

  document.body.addEventListener('mouseleave', (e) => {
    const card = e.target.closest('.category-tile, .product-card');
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
