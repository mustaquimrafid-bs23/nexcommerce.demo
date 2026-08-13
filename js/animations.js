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
      // Prevent Lenis from hijacking scroll inside the mini cart drawer
      prevent: (node) => {
        return node.closest('#nexMiniCartDrawer') !== null;
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
  const heroVisual = document.querySelector('.hero-product-visual');
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

// 2. Scroll Reveal Animations (Trust Strip, Category Grid, etc.)
function initScrollReveals() {
  console.log("initScrollReveals called!");
  // Target any section or wrapper with .reveal-on-scroll
  inView(".reveal-on-scroll", (info) => {
    console.log("inView triggered for", info.target);
    // When the element comes into view, animate it
    animate(info.target, 
      { opacity: [0, 1], y: [20, 0] },
      { 
        duration: 1.0,
        easing: [0.22, 1, 0.36, 1]
      }
    );
    
    // Animate children elements inside if they are cards/grids
    const childrenToStagger = info.target.querySelectorAll('.trust-item-card, .category-tile, .ai-explain-card, .product-card');
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
  }, { margin: "-80px 0px" }); // Trigger slightly before it hits the bottom
}

// 3. Premium Hover Micro-interactions (Motion-powered)
function initHoverEffects() {
  // For product cards and category tiles
  // Notice we delegate this so dynamically added products get the effect
  document.body.addEventListener('mouseenter', (e) => {
    const card = e.target.closest('.category-tile, .product-card');
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
