// ─── Synchronous Native WAAPI & Motion Orchestrator Engine ───────────────────
const animate = function(targets, keyframes, options = {}) {
  const els = typeof targets === 'string' ? document.querySelectorAll(targets) : (Array.isArray(targets) || targets instanceof NodeList ? Array.from(targets) : [targets]);
  const duration = (options.duration || 0.6) * 1000;
  const delay = (options.delay || 0) * 1000;
  const easing = options.easing ? (Array.isArray(options.easing) ? `cubic-bezier(${options.easing.join(',')})` : options.easing) : 'cubic-bezier(0.16, 1, 0.3, 1)';

  const TRANSFORM_KEYS = ['x', 'y', 'scale', 'scaleX', 'scaleY', 'rotate'];

  els.forEach((el, i) => {
    if (!el || !el.animate) return;
    const elDelay = typeof options.delay === 'function' ? options.delay(i, els.length) * 1000 : delay;
    const waapiFrames = [];
    const keys = Object.keys(keyframes);
    const numSteps = Math.max(...keys.map(k => Array.isArray(keyframes[k]) ? keyframes[k].length : 1));

    // Pre-hide element to the first keyframe state so there's no visible flash
    // during the stagger delay before the animation starts.
    if (elDelay > 0) {
      const firstTransformParts = [];
      keys.forEach(k => {
        const val = Array.isArray(keyframes[k]) ? keyframes[k][0] : keyframes[k];
        if (k === 'y')      firstTransformParts.push(`translateY(${val}px)`);
        else if (k === 'x') firstTransformParts.push(`translateX(${val}px)`);
        else if (k === 'scale')  firstTransformParts.push(`scale(${val})`);
        else if (k === 'scaleX') firstTransformParts.push(`scaleX(${val})`);
        else if (k === 'scaleY') firstTransformParts.push(`scaleY(${val})`);
        else if (k === 'rotate') firstTransformParts.push(`rotate(${val}deg)`);
        else el.style[k] = val;
      });
      if (firstTransformParts.length) el.style.transform = firstTransformParts.join(' ');
    }

    for (let step = 0; step < numSteps; step++) {
      const frame = {};
      const transformParts = [];
      keys.forEach(k => {
        const val = Array.isArray(keyframes[k]) ? keyframes[k][step] : keyframes[k];
        if (k === 'y')           transformParts.push(`translateY(${val}px)`);
        else if (k === 'x')      transformParts.push(`translateX(${val}px)`);
        else if (k === 'scale')  transformParts.push(`scale(${val})`);
        else if (k === 'scaleX') transformParts.push(`scaleX(${val})`);
        else if (k === 'scaleY') transformParts.push(`scaleY(${val})`);
        else if (k === 'rotate') transformParts.push(`rotate(${val}deg)`);
        else frame[k] = val;
      });
      if (transformParts.length) frame.transform = transformParts.join(' ');
      waapiFrames.push(frame);
    }

    const anim = el.animate(waapiFrames, {
      duration: duration,
      delay: elDelay,
      easing: easing,
      fill: 'forwards'
    });

    // Commit final keyframe values to inline style then cancel the WAAPI fill layer.
    // WAAPI fill has higher cascade priority than el.style, so without this, any code
    // that writes to el.style.transform after the animation (e.g. scroll parallax) is
    // silently overridden and appears broken.
    anim.onfinish = () => {
      try { if (anim.commitStyles) anim.commitStyles(); } catch (e) {}
      anim.cancel();
    };
  });
};

const inView = function(target, callback, options = {}) {
  const els = typeof target === 'string' ? document.querySelectorAll(target) : (Array.isArray(target) || target instanceof NodeList ? Array.from(target) : [target]);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        callback({ target: entry.target });
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: (options && options.margin) || '0px' });
  els.forEach(el => {
    if (el) observer.observe(el);
  });
};

const stagger = function(duration = 0.06, options = {}) {
  const startDelay = (options && options.startDelay) || 0;
  return (index) => startDelay + (index * duration);
};

const spring = function() {
  return 'cubic-bezier(0.23, 1, 0.32, 1)';
};

window.animate = animate;
window.inView = inView;
window.stagger = stagger;
window.spring = spring;

/**
 * resetPageTransitionCurtain
 * Every "GPU cross-dissolve" trigger across this file sets #pageTransitionOverlay's
 * opacity/pointer-events via inline style right before navigating away. That inline
 * style is plain DOM state, so if the browser restores this page from the back/forward
 * cache (bfcache) instead of re-parsing it, the curtain can come back fully opaque and
 * still eating clicks. `pageshow` fires on both a normal first load and a bfcache
 * restore, so a single listener here covers both without needing a separate
 * DOMContentLoaded handler.
 */
function resetPageTransitionCurtain() {
  const curtain = document.getElementById('pageTransitionOverlay');
  if (!curtain) return;
  curtain.style.transition = 'opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)';
  curtain.style.opacity = '0';
  curtain.style.pointerEvents = 'none';
}
window.addEventListener('pageshow', resetPageTransitionCurtain);

/**
 * nexCommerce - Motion.dev Animation Orchestrator
 * Uses premium spring physics for a luxury editorial feel.
 */

function initAllMotion() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
  initSmoothScroll();

  // Unified parallax dispatcher — one rAF tick per scroll event shared by all sections.
  // Each section registers its updater via window._nexParallaxUpdaters.push(fn) instead
  // of adding its own scroll listener, eliminating N parallel rAF chains on every scroll.
  window._nexParallaxUpdaters = [];
  let _nexPxTicking = false;
  window._nexRequestParallax = function() {
    if (!_nexPxTicking) {
      _nexPxTicking = true;
      requestAnimationFrame(() => {
        window._nexParallaxUpdaters.forEach(fn => fn());
        _nexPxTicking = false;
      });
    }
  };
  window.addEventListener('scroll', window._nexRequestParallax, { passive: true });
  if (window._nexLenis) window._nexLenis.on('scroll', window._nexRequestParallax);
  initHeroAnimations();
  initCuratedDepartmentsMotion();
  initTextSplits();
  initScrollReveals();
  initHoverEffects();
  initTrackingAnimations();
  initDealsSectionMotion();
  initIntentCardMotion();
  initCuratedGridMotion();
  initMicroMerchClusterMotion();
  initTrustStripMotion();
  initRecentlyViewedMotion();
  initGlobalHeaderMotion();
  initCategoryPageMotion();
  initDiscoverySearchPageMotion();
  initWishlistPageMotion();
  initSmartListPageMotion();
  initSignInPageMotion();
  initSignUpPageMotion();
  initCartPageMotion();
  initContactPageMotion();
  initAboutPageMotion();
}

/**
 * initPagePreloader
 * Centralized Luxury Editorial Brand Preloader controller. Auto-detects #pagePreloader
 * on whichever page includes this script, runs a calibrated ~480ms eased 0% -> 100%
 * progress journey, hydrates Lucide icons before the curtain lifts, and cross-dissolves
 * the preloader via the .is-loaded class. Single source of truth so every route gets an
 * identical, zero-CLS brand arrival instead of a page-local copy of this loop.
 */
function initPagePreloader() {
  const preloader = document.getElementById('pagePreloader');
  if (!preloader) return;

  const bar = document.getElementById('preloaderProgressBar') || preloader.querySelector('.preloader-progress-bar');
  const percentEl = document.getElementById('preloaderPercent');

  const DURATION = 480; // calibrated progression
  const startTime = performance.now();
  let isDismissed = false;

  function dismissPreloader() {
    if (isDismissed) return;
    isDismissed = true;
    requestAnimationFrame(() => {
      preloader.classList.add('is-loaded');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 380);
    });
  }

  function updateProgress(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / DURATION);
    const eased = 1 - Math.pow(1 - progress, 2.5);
    const currentPercent = Math.round(eased * 100);

    if (bar) bar.style.transform = `scaleX(${eased.toFixed(4)})`;
    if (percentEl) percentEl.textContent = `${currentPercent}%`;

    if (progress < 1) {
      requestAnimationFrame(updateProgress);
    } else {
      if (bar) {
        bar.style.transform = 'scaleX(1)';
        bar.style.boxShadow = '0 0 16px rgba(61, 224, 255, 0.9)';
      }
      if (percentEl) {
        percentEl.textContent = '100%';
        percentEl.style.color = '#34D399';
      }
      // Ensure Lucide icons are fully rendered before curtain lifts
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
      // Pause 90ms on 100% completion for perceptual satisfaction, then dissolve
      setTimeout(dismissPreloader, 90);
    }
  }

  requestAnimationFrame(updateProgress);

  // Failsafe: never let the preloader outlive 1200ms even if rAF stalls
  setTimeout(dismissPreloader, 1200);

  // BFCache restore: a Back/Forward navigation fires 'pageshow' with persisted=true
  // instead of re-running this script, so without this the preloader's DOM state
  // (opacity: 1, display: block from before navigation-away) would still be live and
  // block the restored page. Force it instantly transparent in that case.
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      preloader.style.transition = 'none';
      preloader.classList.add('is-loaded');
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      preloader.style.display = 'none';
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener("DOMContentLoaded", () => {
    resetPageTransitionCurtain();
    initPagePreloader();
    initAllMotion();
  });
} else {
  resetPageTransitionCurtain();
  initPagePreloader();
  initAllMotion();
}


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
      // Prevent Lenis from hijacking scroll inside modals, drawers, and internal lists
      prevent: (node) => {
        if (!node) return false;
        try {
          return (
            (typeof node.hasAttribute === 'function' && node.hasAttribute('data-lenis-prevent')) ||
            (typeof node.closest === 'function' && (
              node.closest('[data-lenis-prevent]') !== null ||
              node.closest('.summary-items-list') !== null ||
              node.closest('#nexMiniCartDrawer') !== null ||
              node.closest('.search-panel') !== null ||
              node.closest('.modal-overlay') !== null ||
              node.closest('#aiTourModal') !== null ||
              node.closest('.ai-tour-panel') !== null
            ))
          );
        } catch (e) {
          return false;
        }
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

  window._nexParallaxUpdaters.push(updateBidirectionalParallax);

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
  const CHILD_SELECTOR = '.home-cat-pill, .deal-product-card, .curated-product-card, .trust-item-card, .category-tile, .ai-explain-card, .product-card';

  // Pre-hide all reveal targets and their animated children before the observer
  // starts, so elements start invisible and there is no "visible → flash hidden → animate in" jump.
  document.querySelectorAll('.reveal-on-scroll').forEach(section => {
    if (section.classList.contains('home-category-editorial-section')) return;
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.querySelectorAll(CHILD_SELECTOR).forEach(child => {
      child.style.opacity = '0';
      child.style.transform = 'translateY(15px)';
    });
  });

  inView('.reveal-on-scroll', (info) => {
    if (info.target.classList.contains('home-category-editorial-section')) return;

    animate(info.target,
      { opacity: [0, 1], y: [20, 0] },
      { duration: 0.7, easing: [0.22, 1, 0.36, 1] }
    );

    const childrenToStagger = info.target.querySelectorAll(CHILD_SELECTOR);
    if (childrenToStagger.length > 0) {
      animate(childrenToStagger,
        { opacity: [0, 1], y: [15, 0] },
        { delay: stagger(0.055, { startDelay: 0.05 }), duration: 0.65, easing: [0.22, 1, 0.36, 1] }
      );
    }
  }, { margin: '0px 0px -5% 0px' });
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

// Split Text Initializations — word-by-word staggered entrance on key page titles
function initTextSplits() {
  try {
    if (typeof SplitType === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const SPLIT_TARGETS = [
      { selector: '.plp-title',           delay: 0.1 },
      { selector: '.pdp-product-title',   delay: 0.05 },
      { selector: '.discovery-hero-title',delay: 0.1 },
      { selector: '.cart-page-title',     delay: 0.05 },
      { selector: '.wishlist-page-title', delay: 0.05 },
    ];

    SPLIT_TARGETS.forEach(({ selector, delay }) => {
      const el = document.querySelector(selector);
      if (!el) return;

      // Hide before split so SplitType doesn't flash unstyled text
      el.style.opacity = '0';
      const split = new SplitType(el, { types: 'words' });
      el.style.opacity = '1'; // parent visible; words handle their own opacity

      if (split.words && split.words.length > 0) {
        split.words.forEach(w => { w.style.opacity = '0'; w.style.transform = 'translateY(18px)'; });
        animate(split.words,
          { opacity: [0, 1], y: [18, 0] },
          { delay: stagger(0.07, { startDelay: delay }), duration: 0.75, easing: [0.22, 1, 0.36, 1] }
        );
      }
    });
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
  // Pre-hide so there's no flash before the stagger animation starts.
  const headerLeft  = section.querySelector('.deals-header-left');
  const headerRight = section.querySelector('.deals-header-right');
  if (headerLeft)  { headerLeft.style.opacity  = '0'; headerLeft.style.transform  = 'translateY(12px)'; }
  if (headerRight) { headerRight.style.opacity = '0'; headerRight.style.transform = 'translateY(12px)'; }
  cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(28px) scale(0.96)'; });

  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

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
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
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

  window._nexParallaxUpdaters.push(updateDealsParallax);
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

  window._nexParallaxUpdaters.push(updateIntentParallax);
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
  cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(28px) scale(0.96)'; });

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
        curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
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

  window._nexParallaxUpdaters.push(updateCuratedParallax);
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
  cols.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(32px) scale(0.96)'; });

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
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
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

  window._nexParallaxUpdaters.push(updateMicroParallax);
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
    const header = section.querySelector('.trust-strip-header');
    const progressArea = section.querySelector('.trust-progress-container');
    if (header)       { header.style.opacity = '0';       header.style.transform = 'translateY(20px)'; }
    if (progressArea) { progressArea.style.opacity = '0'; progressArea.style.transform = 'translateY(12px)'; }
    cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(28px) scale(0.97)'; });

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
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
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

  window._nexParallaxUpdaters.push(updateTrustParallax);
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
        // Pre-hide before observer attaches to prevent flash-then-hide jank
        if (header) { header.style.opacity = '0'; header.style.transform = 'translateY(16px)'; }
        if (tabs)   { tabs.style.opacity   = '0'; tabs.style.transform   = 'translateY(16px)'; }
        cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateY(20px) scale(0.97)'; });

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
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
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

  window._nexParallaxUpdaters.push(updateRecentsParallax);
}

window.initRecentlyViewedMotion = initRecentlyViewedMotion;

/**
 * 13. GLOBAL HEADER - 4 MOTION STANDARDS
 * 1. Micro-interactions: Tactile click ripples on action buttons & search pill, sparkles micro-rotation,
 *    and elastic badge pops on live counter changes.
 * 2. 3D Hover Effects: 3D spring tilt physics (±4.5°) with dynamic cursor-following specular glare
 *    (--header-glare-x, --header-glare-y) across search pill, concierge button, and action icons.
 * 3. Page Transitions: Hardware-accelerated GPU curtain cross-dissolve (#pageTransitionOverlay) on header nav links.
 * 4. Scroll Parallax & Header Intelligence: Lenis-synced dynamic compaction (72px → 60px) and announcement bar collapse.
 */
function initGlobalHeaderMotion() {
  const header = document.querySelector('.site-header') || document.getElementById('siteHeader');
  if (!header) return;

  const announcementBar = document.querySelector('.top-announcement-bar') || document.getElementById('topAnnouncementBar');
  const interactivePills = header.querySelectorAll('.concierge-nav-btn, .nav-icon-btn, .nav-search-pill, .nav-more-trigger');
  const curtain = document.getElementById('pageTransitionOverlay');

  // 1. MICRO-INTERACTIONS: Tactile Ripple Wave Generator
  interactivePills.forEach(pill => {
    if (pill._hasHeaderRipple) return;
    pill._hasHeaderRipple = true;

    pill.addEventListener('pointerdown', (e) => {
      const rect = pill.getBoundingClientRect();
      const ripple = document.createElement('span');
      ripple.className = 'nav-ripple';
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      pill.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 450);
    });
  });

  // 2. 3D HOVER EFFECTS: Spring Lerp Tilt Physics & Specular Glare Tracking
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  if (!isReduced && !isTouch) {
    const MAX_TILT = 4.5;
    const lerp = (a, b, t) => a + (b - a) * t;

    interactivePills.forEach(pill => {
      if (pill._hasHeaderMotion) return;
      pill._hasHeaderMotion = true;

      let curTX = 0, curTY = 0;
      let tgtTX = 0, tgtTY = 0;
      let rafId = null;

      function applyTilt() {
        curTX = lerp(curTX, tgtTX, 0.15);
        curTY = lerp(curTY, tgtTY, 0.15);
        pill.style.transform = `perspective(800px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(6px)`;
        if (Math.abs(curTX - tgtTX) > 0.01 || Math.abs(curTY - tgtTY) > 0.01) {
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = null;
        }
      }

      pill.addEventListener('mouseenter', () => {
        pill.style.setProperty('--header-glare-opacity', '1');
      });

      pill.addEventListener('mousemove', (e) => {
        const r = pill.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tgtTX = -(dy * MAX_TILT);
        tgtTY = (dx * MAX_TILT);

        const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        pill.style.setProperty('--header-glare-x', gx);
        pill.style.setProperty('--header-glare-y', gy);

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      pill.addEventListener('mouseleave', () => {
        tgtTX = 0; tgtTY = 0;
        pill.style.setProperty('--header-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.18);
          curTY = lerp(curTY, 0, 0.18);
          pill.style.transform = `perspective(800px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(0px)`;
          if (Math.abs(curTX) > 0.01 || Math.abs(curTY) > 0.01) {
            requestAnimationFrame(springBack);
          } else {
            pill.style.transform = '';
          }
        }
        springBack();
      });
    });
  }

  // 3. GPU PAGE TRANSITIONS: Smooth Curtain Cross-Dissolve on Header Links
  const headerLinks = document.querySelectorAll(
    '.site-header .nav-item-link, .site-header .nav-logo, .nav-more-dropdown .nav-more-item, .mobile-nav-drawer .mobile-drawer-link'
  );

  headerLinks.forEach(link => {
    if (link._hasTransitionBound) return;
    link._hasTransitionBound = true;

    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

      // Ensure target is internal and not opening modals
      if (link.hasAttribute('target') && link.getAttribute('target') === '_blank') return;
      if (link.closest('#headerMoreMenu') && link.classList.contains('nav-more-trigger')) return;

      e.preventDefault();

      if (curtain) {
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => {
          window.location.href = href;
        }, 190);
      } else {
        window.location.href = href;
      }
    });
  });

  // 4. SCROLL PARALLAX & INTELLIGENT HEADER COMPACTION
  function updateHeaderParallax() {
    const scrollY = window.scrollY;
    if (scrollY > 20) {
      header.classList.add('scrolled');
      if (announcementBar) announcementBar.classList.add('collapsed');
    } else {
      header.classList.remove('scrolled');
      if (announcementBar) announcementBar.classList.remove('collapsed');
    }
  }

  window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
  window._nexParallaxUpdaters.push(updateHeaderParallax);
}

window.initGlobalHeaderMotion = initGlobalHeaderMotion;

/**
 * 14. CATEGORY & COLLECTIONS PLP - 4 MOTION STANDARDS
 * 1. Micro-interactions: Kinetic SplitType headline entrance, Look Switcher 120fps progress sync,
 *    filter pill ripples, and Quick-Add tactile ripple state machine.
 * 2. 3D Hover Effects: 3D spring tilt physics (±6.5°), dynamic cursor-following specular glare,
 *    and multi-tier diffuse shadow elevation.
 * 3. Page Transitions: Hardware-accelerated GPU curtain cross-dissolve (#pageTransitionOverlay) on card clicks.
 * 4. Scroll Parallax: Differential column depth on scroll (Lenis-linked alternating column travel)
 *    and sub-pixel internal image glide.
 */
function initCategoryPageMotion() {
  const main = document.querySelector('main.plp-header-section');
  if (!main) return;

  const title = document.getElementById('plpMainTitle');
  const subtitle = document.getElementById('plpMainSubtitle');
  const breadcrumb = document.querySelector('.plp-breadcrumb');
  const toolbar = document.querySelector('.plp-toolbar-row');
  const filterBar = document.querySelector('.plp-filter-bar');
  const spotlight = document.getElementById('plpSpotlightSection');
  const curtain = document.getElementById('pageTransitionOverlay');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. MICRO-INTERACTIONS: Kinetic Split-Text & Staggered Header Entrance
  if (!prefersReduced) {
    // Split heading words with SplitType if available
    let headingWords = [];
    if (title && typeof SplitType !== 'undefined') {
      const split = new SplitType(title, { types: 'words' });
      title.style.opacity = '1';
      headingWords = split.words || [];
    }

    if (headingWords.length > 0) {
      headingWords.forEach(w => { w.style.opacity = '0'; });
      animate(headingWords,
        { opacity: [0, 1], y: [24, 0] },
        { delay: stagger(0.06, { startDelay: 0.05 }), duration: 0.8, easing: [0.16, 1, 0.3, 1] }
      );
    } else if (title) {
      animate(title,
        { opacity: [0, 1], y: [20, 0] },
        { duration: 0.75, easing: [0.16, 1, 0.3, 1] }
      );
    }

    if (breadcrumb) {
      animate(breadcrumb,
        { opacity: [0, 1], y: [10, 0] },
        { duration: 0.5, easing: [0.16, 1, 0.3, 1] }
      );
    }

    if (subtitle) {
      animate(subtitle,
        { opacity: [0, 1], y: [16, 0] },
        { delay: 0.12, duration: 0.75, easing: [0.16, 1, 0.3, 1] }
      );
    }

    if (spotlight) {
      animate(spotlight,
        { opacity: [0, 1], y: [24, 0], scale: [0.985, 1] },
        { delay: 0.20, duration: 0.85, easing: [0.16, 1, 0.3, 1] }
      );
    }

    if (toolbar) {
      animate(toolbar,
        { opacity: [0, 1], y: [12, 0] },
        { delay: 0.28, duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    }

    if (filterBar) {
      animate(filterBar,
        { opacity: [0, 1], y: [12, 0] },
        { delay: 0.34, duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }

  // Initialize Motion across cards
  initCategoryCardsMotion();

  // 4. SCROLL PARALLAX: Differential Column Depth (Lenis + rAF)
  let pxTicking = false;

  function updatePLPParallax() {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) {
      pxTicking = false;
      return;
    }

    const grid = document.getElementById('plpProductGrid');
    if (!grid) {
      pxTicking = false;
      return;
    }

    const rect = grid.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span = winH + rect.height;
      const prog = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;     // -1 → +1

      const cards = grid.querySelectorAll('.plp-card.luxury-product-card');
      cards.forEach(card => {
        const depth = parseFloat(card.getAttribute('data-parallax-depth') || '1');
        const travel = depth * 7.5; // px differential travel
        const yCard = parseFloat((centered * travel).toFixed(2));
        card._parallaxY = yCard;
        card.style.setProperty('--plp-card-y', `${yCard}px`);

        if (!card._isHovered) {
          card.style.transform = `translateY(${yCard}px)`;
        }

        // Sub-pixel image internal float glide
        const img = card.querySelector('.plp-card-img');
        if (img) {
          const yImg = (centered * depth * 3.5).toFixed(2);
          card.style.setProperty('--plp-img-y', `${yImg}px`);
        }
      });
    }
    pxTicking = false;
  }

  window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
  window._nexParallaxUpdaters.push(updatePLPParallax);
}

/**
 * initCategoryCardsMotion
 * Binds 3D Hover physics, Specular Glare, GPU Page Transitions, and Staggered Cascade to rendered product cards
 */
function initCategoryCardsMotion() {
  const grid = document.getElementById('plpProductGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.plp-card.luxury-product-card'));
  if (cards.length === 0) return;

  const curtain = document.getElementById('pageTransitionOverlay');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 1. Staggered Cascade Entrance on Rendered Cards
  if (!prefersReduced && !grid._hasAnimatedThisRender) {
    grid._hasAnimatedThisRender = true;
    animate(cards,
      { opacity: [0, 1], y: [22, 0], scale: [0.97, 1] },
      { delay: stagger(0.06, { startDelay: 0.1 }), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
    );
  }

  // 2. 3D HOVER PHYSICS: Spring LERP Tilt & Dynamic Cursor Specular Glare
  if (!prefersReduced && !isTouch) {
    const MAX_TILT = 6.5; // degrees
    const lerp = (a, b, t) => a + (b - a) * t;

    cards.forEach(card => {
      if (card._hasMotionBound) return;
      card._hasMotionBound = true;

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
        card.style.setProperty('--plp-glare-x', gx);
        card.style.setProperty('--plp-glare-y', gy);
        card.style.setProperty('--plp-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        card._isHovered = false;
        tgtTX = 0; tgtTY = 0;
        card.style.setProperty('--plp-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.16);
          curTY = lerp(curTY, 0, 0.16);
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

  // 3. GPU PAGE TRANSITIONS: Smooth Curtain Cross-Dissolve on Card Navigation
  function triggerPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => {
      window.location.href = href;
    }, 210);
  }

  cards.forEach(card => {
    if (card._hasNavBound) return;
    card._hasNavBound = true;

    const titleLink = card.querySelector('.plp-card-title-link');
    const imgAnchor = card.querySelector('.plp-card-img-anchor');

    [titleLink, imgAnchor].filter(Boolean).forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          e.preventDefault();
          triggerPageTransition(href);
        }
      });
    });
  });
}

window.initCategoryPageMotion = initCategoryPageMotion;
window.initCategoryCardsMotion = initCategoryCardsMotion;

/**
 * initWishlistPageMotion
 * Motion Standards for the Saved Pieces (wishlist) page:
 * 1. Micro-interactions: Staggered header entrance cascade (badge → headline → subhead → stats bar).
 * 2. 3D Hover Effects:   Spring LERP mouse tilt physics + dynamic cursor-following specular glare (delegated to initWishlistCardsMotion).
 * 3. Page Transitions:   GPU cross-dissolve curtain (#pageTransitionOverlay) on card navigation (delegated to initWishlistCardsMotion).
 * 4. Scroll Parallax:    Differential column depth on the saved-pieces grid (Lenis + rAF).
 *
 * Card-level motion (entrance, tilt, glare, nav) is (re)bound via initWishlistCardsMotion()
 * on every renderWishlist() pass, since pieces can be added/removed at runtime.
 */
function initWishlistPageMotion() {
  const wrap = document.querySelector('.wishlist-page-wrap');
  if (!wrap) return;

  // Bind card-level motion (3D tilt, specular glare, page transitions)
  initWishlistCardsMotion();

  // 4. SCROLL PARALLAX: Differential Column Depth (Lenis + rAF)
  let pxTicking = false;

  function updateWishlistParallax() {
    const grid = document.getElementById('wishlistGrid');
    if (!grid) { pxTicking = false; return; }

    const rect = grid.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span = winH + rect.height;
      const prog = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;     // -1 → +1

      const cards = grid.querySelectorAll('.wishlist-card');
      cards.forEach(card => {
        const depth = parseFloat(card.getAttribute('data-parallax-depth') || '1');
        const travel = depth * 7.5; // px differential travel
        const yCard = parseFloat((centered * travel).toFixed(2));
        card._parallaxY = yCard;

        if (!card._isHovered) {
          card.style.transform = `translateY(${yCard}px)`;
        }

        // Sub-pixel image internal float glide
        const img = card.querySelector('.wishlist-card-img');
        if (img) {
          const yImg = (centered * depth * 3.5).toFixed(2);
          card.style.setProperty('--wishlist-img-y', `${yImg}px`);
        }
      });
    }
    pxTicking = false;
  }

  window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
  window._nexParallaxUpdaters.push(updateWishlistParallax);
}

/**
 * initWishlistCardsMotion
 * Binds 3D Hover physics, Specular Glare, and GPU Page Transitions to rendered wishlist cards.
 * Re-invoked on every renderWishlist() pass since cards can be added/removed/filtered.
 */
function initWishlistCardsMotion() {
  const grid = document.getElementById('wishlistGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.wishlist-card'));
  if (cards.length === 0) return;

  const curtain = document.getElementById('pageTransitionOverlay');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 2. 3D HOVER PHYSICS: Spring LERP Tilt & Dynamic Cursor Specular Glare
  if (!prefersReduced && !isTouch) {
    const MAX_TILT = 6.5; // degrees
    const lerp = (a, b, t) => a + (b - a) * t;

    cards.forEach(card => {
      if (card._hasMotionBound) return;
      card._hasMotionBound = true;

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
        card.style.setProperty('--wishlist-glare-x', gx);
        card.style.setProperty('--wishlist-glare-y', gy);
        card.style.setProperty('--wishlist-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        card._isHovered = false;
        tgtTX = 0; tgtTY = 0;
        card.style.setProperty('--wishlist-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.16);
          curTY = lerp(curTY, 0, 0.16);
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

  // 3. GPU PAGE TRANSITIONS: Smooth Curtain Cross-Dissolve on Card Navigation
  function triggerPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => {
      window.location.href = href;
    }, 210);
  }

  cards.forEach(card => {
    if (card._hasNavBound) return;
    card._hasNavBound = true;

    const titleLink = card.querySelector('.wishlist-card-title-link');
    const imgAnchor = card.querySelector('.wishlist-card-img-anchor');

    [titleLink, imgAnchor].filter(Boolean).forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          e.preventDefault();
          triggerPageTransition(href);
        }
      });
    });
  });
}

window.initWishlistPageMotion = initWishlistPageMotion;
window.initWishlistCardsMotion = initWishlistCardsMotion;

/**
 * initDiscoverySearchPageMotion
 * Page-level setup for the Intelligent Discovery search results page — sets up the
 * differential scroll parallax loop once (Motion Standard 4). Card-level motion
 * (entrance, 3D tilt, specular glare — Standards 1 & 2) is (re)bound on every
 * result render via initDiscoveryCardsMotion(), since results change per query.
 */
function initDiscoverySearchPageMotion() {
  const resultsSection = document.getElementById('discoveryResultsSection');
  if (!resultsSection) return;

  let pxTicking = false;

  function updateDiscoveryParallax() {
    const grid = document.getElementById('discoveryResultsGrid');
    if (!grid) { pxTicking = false; return; }

    const rect = grid.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span = winH + rect.height;
      const prog = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;     // -1 → +1

      const cards = grid.querySelectorAll('.discovery-card');
      cards.forEach(card => {
        const depth = parseFloat(card.getAttribute('data-parallax-depth') || '1');
        const travel = depth * 7.5;
        const yCard = parseFloat((centered * travel).toFixed(2));
        card._parallaxY = yCard;
        card.style.setProperty('--disc-card-y', `${yCard}px`);

        if (!card._isHovered) {
          card.style.transform = `translateY(${yCard}px)`;
        }

        const img = card.querySelector('.discovery-card-image img');
        if (img) {
          const yImg = (centered * depth * 3.5).toFixed(2);
          card.style.setProperty('--disc-img-y', `${yImg}px`);
        }
      });
    }
    pxTicking = false;
  }

  window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
  window._nexParallaxUpdaters.push(updateDiscoveryParallax);
}

/**
 * initDiscoveryCardsMotion
 * Binds staggered entrance, 3D spring tilt, and dynamic specular glare to the
 * currently-rendered discovery result cards. Called by discovery-ui.js after
 * every renderResults() — results change per query, so entrance always replays.
 */
function initDiscoveryCardsMotion() {
  const grid = document.getElementById('discoveryResultsGrid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.discovery-card'));
  if (cards.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 1. MICRO-INTERACTIONS: Staggered Cascade Entrance
  if (!prefersReduced && window.animate && window.stagger) {
    animate(cards,
      { opacity: [0, 1], y: [20, 0], scale: [0.97, 1] },
      { delay: stagger(0.06, { startDelay: 0.05 }), duration: 0.65, easing: [0.16, 1, 0.3, 1] }
    );
  }

  // 2. 3D HOVER PHYSICS: Spring LERP Tilt & Dynamic Cursor Specular Glare
  if (!prefersReduced && !isTouch) {
    const MAX_TILT = 6.5;
    const lerp = (a, b, t) => a + (b - a) * t;

    cards.forEach(card => {
      if (card._hasMotionBound) return;
      card._hasMotionBound = true;

      let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0, rafId = null;
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

      card.addEventListener('mouseenter', () => { card._isHovered = true; });

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tgtTX = -(dy * MAX_TILT);
        tgtTY = (dx * MAX_TILT);

        const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        card.style.setProperty('--disc-glare-x', gx);
        card.style.setProperty('--disc-glare-y', gy);
        card.style.setProperty('--disc-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        card._isHovered = false;
        tgtTX = 0; tgtTY = 0;
        card.style.setProperty('--disc-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.16);
          curTY = lerp(curTY, 0, 0.16);
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

  // 3. GPU PAGE TRANSITIONS: Smooth Curtain Cross-Dissolve on Discovery Card Navigation
  const curtain = document.getElementById('pageTransitionOverlay');
  function triggerDiscoveryPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => {
      window.location.href = href;
    }, 210);
  }

  cards.forEach(card => {
    if (card._hasNavBound) return;
    card._hasNavBound = true;

    const titleLink = card.querySelector('.discovery-card-name a');
    const imgLink = card.querySelector('.discovery-card-image a');
    const viewBtn = card.querySelector('.discovery-view-btn');

    [titleLink, imgLink].filter(Boolean).forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          e.preventDefault();
          triggerDiscoveryPageTransition(href);
        }
      });
    });

    if (viewBtn) {
      viewBtn.addEventListener('click', (e) => {
        const pId = viewBtn.getAttribute('data-product-id');
        if (pId) {
          e.preventDefault();
          triggerDiscoveryPageTransition(`product.html?id=${pId}`);
        }
      });
    }
  });
}

window.initDiscoverySearchPageMotion = initDiscoverySearchPageMotion;
window.initDiscoveryCardsMotion = initDiscoveryCardsMotion;

/**
 * initSmartListPageMotion
 * Motion Standards for the Smart Reorder (Smart List) page:
 * 1. 3D Hover Physics:   Spring LERP mouse tilt physics + dynamic cursor-following specular glare.
 * 2. Page Transitions:   GPU cross-dissolve curtain (#pageTransitionOverlay) on card navigation.
 */
function initSmartListPageMotion() {
  const gridWrap = document.querySelector('.sl-grid-wrap');
  if (!gridWrap) return;
  initSmartListCardsMotion();
}

/**
 * initSmartListCardsMotion
 * Binds Specular Glare sheen and GPU Page Transitions to rendered smart list cards.
 */
function initSmartListCardsMotion() {
  const grid = document.getElementById('slGrid') || document.getElementById('slHomeStrip') || document.getElementById('slConfirmStrip');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.sl-card'));
  if (cards.length === 0) return;

  const curtain = document.getElementById('pageTransitionOverlay');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 1. SPECULAR GLARE LIGHTING (Static Card, Zero Displacement)
  if (!prefersReduced && !isTouch) {
    cards.forEach(card => {
      if (card._hasMotionBound) return;
      card._hasMotionBound = true;

      // Ensure card transform is strictly clean and static
      card.style.transform = '';

      const glare = card.querySelector('.sl-glare');

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1);
        const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1);
        if (glare) {
          glare.style.setProperty('--gx', `${gx}%`);
          glare.style.setProperty('--gy', `${gy}%`);
          glare.style.opacity = '1';
        }
      });

      card.addEventListener('mouseleave', () => {
        if (glare) glare.style.opacity = '0';
      });
    });
  }

  // 2. GPU PAGE TRANSITIONS: Smooth Curtain Cross-Dissolve on Card Navigation
  function triggerPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => {
      window.location.href = href;
    }, 210);
  }

  cards.forEach(card => {
    if (card._hasNavBound) return;
    card._hasNavBound = true;

    const titleLink = card.querySelector('.sl-card-title-link');
    const imgLink = card.querySelector('.sl-card-img-link');

    [titleLink, imgLink].filter(Boolean).forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
          e.preventDefault();
          triggerPageTransition(href);
        }
      });
    });
  });
}

window.initSmartListPageMotion = initSmartListPageMotion;
window.initSmartListCardsMotion = initSmartListCardsMotion;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SIGN IN & AUTHENTICATION MOTION CONTROLLER (4 Motion Standards)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Micro-interactions: Staggered form entrance cascade & 120fps progress sync.
 * 2. 3D Hover Effects:   Spring LERP mouse tilt physics + dynamic cursor-following specular glare.
 * 3. Page Transitions:   GPU cross-dissolve curtain (#pageTransitionOverlay) on auth navigation.
 * 4. Scroll Parallax:    Differential depth on showcase and floating shoppable capsules.
 */
function initSignInPageMotion() {
  const showcasePanel = document.querySelector('.auth-showcase-panel');
  const formPanel = document.querySelector('.auth-form-panel');
  if (!showcasePanel && !formPanel) return;

  initSignInCardMotion();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. MICRO-INTERACTIONS: Staggered form entrance
  if (!prefersReduced && window.animate && window.stagger && formPanel) {
    const formItems = [
      '.auth-brand-logo',
      '.auth-heading',
      '.auth-subheading',
      '.auth-demo-pill',
      '.auth-social-row',
      '.auth-divider',
      '.auth-form .form-group',
      '.form-checkbox-row',
      '.auth-submit-btn',
      '.auth-footer-zone'
    ];

    const elements = formItems.map(selector => formPanel.querySelector(selector)).filter(Boolean);
    if (elements.length > 0) {
      animate(elements,
        { opacity: [0, 1], y: [16, 0] },
        { delay: stagger(0.05, { startDelay: 0.1 }), duration: 0.6, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }
}

/**
 * initSignInCardMotion
 * Binds 3D Hover physics, Specular Glare, and GPU Page Transitions to sign-in page elements.
 */
function initSignInCardMotion() {
  const capsule = document.getElementById('authShoppableCapsule');
  const demoPill = document.getElementById('quickDemoBtn');
  const curtain = document.getElementById('pageTransitionOverlay');

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 2. 3D HOVER PHYSICS: Spring LERP Tilt & Dynamic Cursor Specular Glare
  if (!prefersReduced && !isTouch && capsule) {
    const MAX_TILT = 6.5; // degrees
    const lerp = (a, b, t) => a + (b - a) * t;
    const glare = capsule.querySelector('.auth-capsule-glare') || document.getElementById('capsuleGlare');

    let curTX = 0, curTY = 0;
    let tgtTX = 0, tgtTY = 0;
    let rafId = null;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, 0.12);
      curTY = lerp(curTY, tgtTY, 0.12);
      capsule.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(10px)`;
      if (Math.abs(curTX - tgtTX) > 0.01 || Math.abs(curTY - tgtTY) > 0.01) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        rafId = null;
      }
    }

    capsule.addEventListener('mouseenter', () => {
      if (glare) glare.style.opacity = '1';
    });

    capsule.addEventListener('mousemove', (e) => {
      const r = capsule.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY = (dx * MAX_TILT);

      const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1);
      const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1);
      if (glare) {
        glare.style.setProperty('--gx', `${gx}%`);
        glare.style.setProperty('--gy', `${gy}%`);
      }

      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });

    capsule.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;
      if (glare) glare.style.opacity = '0';

      function springBack() {
        curTX = lerp(curTX, 0, 0.16);
        curTY = lerp(curTY, 0, 0.16);
        capsule.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(0px)`;
        if (Math.abs(curTX) > 0.02 || Math.abs(curTY) > 0.02) {
          rafId = requestAnimationFrame(springBack);
        } else {
          capsule.style.transform = '';
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  }
}

window.initSignInPageMotion = initSignInPageMotion;
window.initSignInCardMotion = initSignInCardMotion;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * SIGN UP & REGISTRATION MOTION CONTROLLER (4 Motion Standards)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Micro-interactions: Staggered form entrance cascade & password strength transitions.
 * 2. 3D Hover Effects:   Spring LERP mouse tilt physics + dynamic cursor-following specular glare.
 * 3. Page Transitions:   GPU cross-dissolve curtain (#pageTransitionOverlay) on auth navigation.
 * 4. Scroll Parallax:    Differential depth on showcase and registration form containers.
 */
function initSignUpPageMotion() {
  const showcasePanel = document.querySelector('.auth-showcase-panel');
  const formPanel = document.querySelector('.auth-form-panel');
  if (!showcasePanel && !formPanel) return;

  initSignUpCardMotion();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. MICRO-INTERACTIONS: Staggered form entrance
  if (!prefersReduced && window.animate && window.stagger && formPanel) {
    const formItems = [
      '.auth-brand-logo',
      '.auth-heading',
      '.auth-subheading',
      '.auth-demo-pill',
      '.auth-social-row',
      '.auth-divider',
      '.auth-form .form-group',
      '.auth-submit-btn',
      '.auth-terms',
      '.auth-footer-zone'
    ];

    const elements = formItems.map(selector => formPanel.querySelector(selector)).filter(Boolean);
    if (elements.length > 0) {
      animate(elements,
        { opacity: [0, 1], y: [16, 0] },
        { delay: stagger(0.04, { startDelay: 0.08 }), duration: 0.55, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }
}

/**
 * initSignUpCardMotion
 * Binds 3D Hover physics, Specular Glare, and GPU Page Transitions to sign-up page elements.
 */
function initSignUpCardMotion() {
  const demoPill = document.getElementById('quickDemoBtn');
  const socialBtns = document.querySelectorAll('.auth-social-btn');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  if (!prefersReduced && !isTouch) {
    const interactiveCards = [demoPill, ...Array.from(socialBtns)].filter(Boolean);
    interactiveCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 180ms cubic-bezier(0.23, 1, 0.32, 1), box-shadow 180ms ease';
      });
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        const tiltX = -(dy * 4.5).toFixed(2);
        const tiltY = (dx * 4.5).toFixed(2);
        card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }
}

window.initSignUpPageMotion = initSignUpPageMotion;
window.initSignUpCardMotion = initSignUpCardMotion;

/**
 * initCartPageMotion
 * Motion Standards for the Shopping Bag (Cart) page:
 * 1. Micro-interactions: 120fps GPU Express Delivery Progress Bar & Curated Look Switcher sync.
 * 2. 3D Hover Effects:   Spring LERP mouse tilt physics + dynamic specular glare.
 * 3. Page Transitions:   GPU cross-dissolve curtain (#pageTransitionOverlay) on checkout navigation.
 * 4. Scroll Parallax:    Differential column depth on scroll between cart items and order summary.
 */
function initCartPageMotion() {
  const cartGrid = document.getElementById('cartGrid');
  if (!cartGrid) return;

  initCartCardsMotion();

  if (cartGrid._cartParallaxBound) return;
  cartGrid._cartParallaxBound = true;

  // 4. SCROLL PARALLAX: Differential Column Depth (Lenis + rAF)
  let pxTicking = false;

  function updateCartParallax() {
    if (!cartGrid) { pxTicking = false; return; }

    const rect = cartGrid.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span = winH + rect.height;
      const prog = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;     // -1 → +1

      const cards = cartGrid.querySelectorAll('.cart-item-card');
      cards.forEach(card => {
        const depth = parseFloat(card.getAttribute('data-parallax-depth') || '0.04');
        const travel = depth * 120; // px differential travel
        const yCard = parseFloat((centered * travel).toFixed(2));
        card._parallaxY = yCard;

        if (!card._isHovered) {
          card.style.transform = `translateY(${yCard}px)`;
        }
      });
    }
    pxTicking = false;
  }

  window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
  window._nexParallaxUpdaters.push(updateCartParallax);
}

/**
 * initCartCardsMotion
 * Binds 3D Hover physics, Specular Glare, and GPU Page Transitions to cart item cards and summary.
 */
function initCartCardsMotion() {
  const cartGrid = document.getElementById('cartGrid');
  if (!cartGrid) return;

  const cards = Array.from(cartGrid.querySelectorAll('.cart-item-card, .cart-summary-card, .cart-curation-spotlight'));
  if (cards.length === 0) return;

  const curtain = document.getElementById('pageTransitionOverlay');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 1. MICRO-INTERACTIONS: Staggered entrance
  if (!prefersReduced && window.animate && window.stagger) {
    const unrevealed = cards.filter(c => !c._hasEntranceRun);
    if (unrevealed.length > 0) {
      unrevealed.forEach(c => { c._hasEntranceRun = true; });
      animate(unrevealed,
        { opacity: [0, 1], y: [16, 0], scale: [0.98, 1] },
        { delay: stagger(0.05, { startDelay: 0.04 }), duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }

  // 2. 3D HOVER PHYSICS: Spring LERP Tilt & Dynamic Cursor Specular Glare
  if (!prefersReduced && !isTouch) {
    const MAX_TILT = 5.0; // degrees
    const lerp = (a, b, t) => a + (b - a) * t;

    cards.forEach(card => {
      if (card._hasMotionBound) return;
      card._hasMotionBound = true;

      let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0, rafId = null;
      card._isHovered = false;
      card._parallaxY = 0;

      function applyTilt() {
        curTX = lerp(curTX, tgtTX, 0.12);
        curTY = lerp(curTY, tgtTY, 0.12);
        const py = card._parallaxY || 0;
        card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(8px) translateY(${py}px)`;
        if (Math.abs(curTX - tgtTX) > 0.01 || Math.abs(curTY - tgtTY) > 0.01) {
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = null;
        }
      }

      card.addEventListener('mouseenter', () => { card._isHovered = true; });

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tgtTX = -(dy * MAX_TILT);
        tgtTY = (dx * MAX_TILT);

        const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        card.style.setProperty('--cart-glare-x', gx);
        card.style.setProperty('--cart-glare-y', gy);
        card.style.setProperty('--cart-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        card._isHovered = false;
        tgtTX = 0; tgtTY = 0;
        card.style.setProperty('--cart-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.16);
          curTY = lerp(curTY, 0, 0.16);
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

  // 3. GPU PAGE TRANSITIONS: Smooth Cross-Dissolve Curtain on Checkout & Links
  function triggerCartPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => {
      window.location.href = href;
    }, 210);
  }

  const checkoutBtns = document.querySelectorAll('#cartCheckoutBtn, #mobileStickyCheckoutBtn');
  checkoutBtns.forEach(btn => {
    if (btn._hasNavBound) return;
    btn._hasNavBound = true;
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        e.preventDefault();
        triggerCartPageTransition(href);
      }
    });
  });
}

window.initCartPageMotion = initCartPageMotion;
window.initCartCardsMotion = initCartCardsMotion;

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * CONTACT / CLIENT SERVICES MOTION CONTROLLER (4 Motion Standards)
 * ─────────────────────────────────────────────────────────────────────────────
 * 1. Micro-interactions: Staggered entry cascade, Look switcher 120fps progress timer, tactile quick-add ripple.
 * 2. 3D Hover Effects:   Spring LERP mouse tilt physics + dynamic cursor-following specular glare.
 * 3. Page Transitions:   GPU cross-dissolve curtain (#pageTransitionOverlay) on all channel & atelier links.
 * 4. Scroll Parallax:    Differential column depth on scroll layers (data-parallax-depth).
 */
function initContactPageMotion() {
  const contactWrap = document.querySelector('.contact-page-wrap');
  if (!contactWrap) return;

  initContactCardsMotion();

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 1. MICRO-INTERACTIONS: Staggered Entrance Animations
  if (!prefersReduced && window.animate && window.stagger) {
    const heroElements = document.querySelectorAll('.contact-status-whisper, .contact-headline, .contact-subhead');
    if (heroElements.length > 0) {
      animate(heroElements,
        { opacity: [0, 1], y: [16, 0] },
        { delay: stagger(0.06, { startDelay: 0.05 }), duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    }

    const channelCards = document.querySelectorAll('.contact-channel-card');
    if (channelCards.length > 0) {
      animate(channelCards,
        { opacity: [0, 1], y: [20, 0], scale: [0.98, 1] },
        { delay: stagger(0.07, { startDelay: 0.15 }), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
      );
    }

    const spotlightSection = document.querySelector('.contact-curation-spotlight');
    if (spotlightSection) {
      animate(spotlightSection,
        { opacity: [0, 1], y: [24, 0] },
        { delay: 0.28, duration: 0.75, easing: [0.16, 1, 0.3, 1] }
      );
    }

    const formCard = document.getElementById('contactFormCard');
    if (formCard) {
      animate(formCard,
        { opacity: [0, 1], y: [24, 0] },
        { delay: 0.35, duration: 0.75, easing: [0.16, 1, 0.3, 1] }
      );
    }

    const atelierCards = document.querySelectorAll('.contact-atelier-card');
    if (atelierCards.length > 0) {
      animate(atelierCards,
        { opacity: [0, 1], y: [20, 0] },
        { delay: stagger(0.08, { startDelay: 0.42 }), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }

  // 4. SCROLL PARALLAX: Differential Column & Container Depth
  if (!prefersReduced) {
    const parallaxLayers = contactWrap.querySelectorAll('[data-parallax-depth]');
    let pxTicking = false;

    function updateContactParallax() {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      parallaxLayers.forEach(layer => {
        const depth = parseFloat(layer.getAttribute('data-parallax-depth')) || 0.04;
        const offset = -(scrollY * depth);
        if (layer.classList.contains('contact-channel-card') || layer.classList.contains('contact-atelier-card')) {
          layer._parallaxY = offset;
          if (!layer._isHovered) {
            layer.style.transform = `translateY(${offset.toFixed(1)}px)`;
          }
        } else {
          layer.style.transform = `translateY(${offset.toFixed(1)}px)`;
        }
      });
      pxTicking = false;
    }

    window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
    window._nexParallaxUpdaters.push(updateContactParallax);
  }
}

/**
 * initContactCardsMotion
 * Binds 3D Hover physics, Specular Glare, and GPU Page Transitions to contact page elements.
 */
function initContactCardsMotion() {
  const cards = Array.from(document.querySelectorAll('.contact-channel-card, .contact-curation-spotlight, .contact-form-card, .contact-atelier-card, .contact-floating-look-pill'));
  if (cards.length === 0) return;

  const curtain = document.getElementById('pageTransitionOverlay');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 2. 3D HOVER PHYSICS: Spring LERP Tilt & Dynamic Cursor Specular Glare
  if (!prefersReduced && !isTouch) {
    const MAX_TILT = 5.5; // degrees
    const lerp = (a, b, t) => a + (b - a) * t;

    cards.forEach(card => {
      if (card._hasContactMotionBound) return;
      card._hasContactMotionBound = true;

      let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0, rafId = null;
      card._isHovered = false;
      card._parallaxY = 0;

      function applyTilt() {
        curTX = lerp(curTX, tgtTX, 0.12);
        curTY = lerp(curTY, tgtTY, 0.12);
        const py = card._parallaxY || 0;
        card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(8px) translateY(${py}px)`;
        if (Math.abs(curTX - tgtTX) > 0.01 || Math.abs(curTY - tgtTY) > 0.01) {
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = null;
        }
      }

      card.addEventListener('mouseenter', () => { card._isHovered = true; });

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tgtTX = -(dy * MAX_TILT);
        tgtTY = (dx * MAX_TILT);

        const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        card.style.setProperty('--contact-glare-x', gx);
        card.style.setProperty('--contact-glare-y', gy);
        card.style.setProperty('--contact-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        card._isHovered = false;
        tgtTX = 0; tgtTY = 0;
        card.style.setProperty('--contact-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.16);
          curTY = lerp(curTY, 0, 0.16);
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

  // 3. GPU PAGE TRANSITIONS: Smooth Cross-Dissolve Curtain on Links
  function triggerContactPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => {
      window.location.href = href;
    }, 210);
  }

  const channelBtns = document.querySelectorAll('.contact-channel-btn, .atelier-action-link, .nav-more-item');
  channelBtns.forEach(btn => {
    if (btn._hasNavBound) return;
    btn._hasNavBound = true;
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      const target = btn.getAttribute('target');
      if (target === '_blank') return;
      if (href && !href.startsWith('#') && !href.startsWith('javascript:') && !href.startsWith('tel:')) {
        e.preventDefault();
        triggerContactPageTransition(href);
      }
    });
  });
}

window.initContactPageMotion = initContactPageMotion;
window.initContactCardsMotion = initContactCardsMotion;

/**
 * initAboutPageMotion
 * Dedicated Motion Orchestrator for the Atelier About Us page.
 * Features 3D spring tilt physics, specular glare tracking, staggered entrance,
 * and GPU page transition curtain.
 */
function initAboutPageMotion() {
  const isAboutPage = document.body.classList.contains('about-page-bg') || document.querySelector('.about-hero-wrap');
  if (!isAboutPage) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Staggered entrance animations
  if (!prefersReduced && window.animate && window.stagger) {
    const heroItems = document.querySelectorAll('.about-status-whisper, .about-headline, .about-subhead');
    if (heroItems.length > 0) {
      animate(heroItems,
        { opacity: [0, 1], y: [16, 0] },
        { delay: stagger(0.06, { startDelay: 0.05 }), duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    }

    const cinematicCard = document.querySelector('.about-cinematic-card');
    if (cinematicCard) {
      animate(cinematicCard,
        { opacity: [0, 1], y: [20, 0], scale: [0.99, 1] },
        { delay: 0.2, duration: 0.75, easing: [0.16, 1, 0.3, 1] }
      );
    }

    const pillarCards = document.querySelectorAll('.about-pillar-card');
    if (pillarCards.length > 0) {
      animate(pillarCards,
        { opacity: [0, 1], y: [20, 0], scale: [0.98, 1] },
        { delay: stagger(0.08, { startDelay: 0.28 }), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }

  // 3D Spring tilt & specular glare tracking on pillar, artisan, and ledger cards
  const MAX_TILT = 5.5;
  const lerp = (a, b, t) => a + (b - a) * t;

  const cards = document.querySelectorAll('.about-pillar-card, .artisan-card, .ledger-stat-card');
  cards.forEach(card => {
    if (card._hasTiltBound) return;
    card._hasTiltBound = true;

    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0, rafId = null;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, 0.12);
      curTY = lerp(curTY, tgtTY, 0.12);
      card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(8px)`;
      if (Math.abs(curTX - tgtTX) > 0.01 || Math.abs(curTY - tgtTY) > 0.01) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        rafId = null;
      }
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = (x - rect.width  / 2) / (rect.width  / 2);
      const dy = (y - rect.height / 2) / (rect.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY =  (dx * MAX_TILT);
      card.style.setProperty('--about-glare-x', `${x}px`);
      card.style.setProperty('--about-glare-y', `${y}px`);
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });

    card.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;

      function springBack() {
        curTX = lerp(curTX, 0, 0.16);
        curTY = lerp(curTY, 0, 0.16);
        card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(0px)`;
        if (Math.abs(curTX) > 0.02 || Math.abs(curTY) > 0.02) {
          rafId = requestAnimationFrame(springBack);
        } else {
          card.style.transform = '';
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });
}

window.initAboutPageMotion = initAboutPageMotion;

