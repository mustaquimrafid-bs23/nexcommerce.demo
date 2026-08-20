/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — AI-06 Smart Reorder Engine (Luxury Atelier Edition)
   Feature: AI-Recommended Shopping List (Atelier Curation & Replenishment)
   Capabilities:
     1. Curated Look Switcher & 120fps Animation Track (Auto-rotation & Pause)
     2. Interactive Repurchase Cadence Popover (Custom Cycle Adjuster)
     3. Persistent Interval Customization (localStorage)
     4. Unified Action Row (Stepper + Move to Bag)
     5. Category Filter Pills with Cross-Fade Stagger & Sync
     6. Live Curation Valuation Metric
     7. 5-Second Interactive Undo Toast on Dismissal
     8. Atelier Concierge Styling Bridge
     9. All 4 Motion Standards Fully Integrated
   ═══════════════════════════════════════════════════════════════════════════ */

'use strict';

/* ─── Storage Keys ─────────────────────────────────────────────────────────── */
const SL_KEYS = {
  enabled:   'nex_sl_enabled',   // admin kill switch — 'false' = disabled
  optout:    'nex_sl_optout',    // buyer opt-out — 'true' = opted out
  dismissed: 'nex_sl_dismissed', // {id: isoExpiresAt} map
  intervals: 'nex_sl_intervals'  // {id: days} custom cycle map
};

/* ─── Active State ────────────────────────────────────────────────────────── */
let activeCategoryFilter = 'all';

/* ─── Image Path Resolver ─────────────────────────────────────────────────── */
function resolveImgPath(imgPath) {
  if (!imgPath) return '';
  if (imgPath.startsWith('http')) return imgPath;
  const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
  if (isSubpage) {
    return imgPath.startsWith('../') ? imgPath : '../' + imgPath;
  } else {
    return imgPath.startsWith('../') ? imgPath.replace(/^\.\.\//, '') : imgPath;
  }
}

/* ─── Real nexCommerce Atelier Catalog DB ──────────────────────────────────── */
const SL_PRODUCTS = [
  {
    id: 'p1',
    name: 'Architectural Cashmere Sweater',
    brand: 'Arc',
    price: 185,
    originalPrice: null,
    image: 'assets/images/products/hero_sweater.png',
    category: 'Apparel',
    categoryLabel: 'Ready-to-Wear',
    boughtCount: 4,
    avgIntervalDays: 60,
    daysSinceLast: 58,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 4× · Seasonal Autumn/Winter rotation due'
  },
  {
    id: 'p2',
    name: 'Fine-Knit Cashmere Crew',
    brand: 'Arc',
    price: 160,
    originalPrice: null,
    image: 'assets/images/products/plp_crewneck.png',
    category: 'Apparel',
    categoryLabel: 'Ready-to-Wear',
    boughtCount: 5,
    avgIntervalDays: 45,
    daysSinceLast: 42,
    suggestedQty: 2,
    inStock: true,
    reason: 'Acquired 5× · Essential layering staple'
  },
  {
    id: 'p3',
    name: 'Structured Wool Blazer',
    brand: 'Arc',
    price: 245,
    originalPrice: 270,
    image: 'assets/images/products/plp_blazer.png',
    category: 'Apparel',
    categoryLabel: 'Ready-to-Wear',
    boughtCount: 3,
    avgIntervalDays: 90,
    daysSinceLast: 86,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 3× · Tailored silhouette update'
  },
  {
    id: 'p4',
    name: 'Planar Magnetic Studio Headphones',
    brand: 'Form',
    price: 220,
    originalPrice: null,
    image: 'assets/images/products/prod_headphones.png',
    category: 'Acoustics',
    categoryLabel: 'High Acoustics',
    boughtCount: 3,
    avgIntervalDays: 120,
    daysSinceLast: 115,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 3× · High-fidelity acoustic upgrade'
  },
  {
    id: 'p5',
    name: 'Minimalist Leather Runner',
    brand: 'Apex',
    price: 185,
    originalPrice: null,
    image: 'assets/images/products/prod_runner.png',
    category: 'Footwear',
    categoryLabel: 'Artisanal Footwear',
    boughtCount: 4,
    avgIntervalDays: 90,
    daysSinceLast: 88,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 4× · Annual urban footwear renewal'
  },
  {
    id: 'p6',
    name: 'Architectural Canvas Tote',
    brand: 'Forma',
    price: 125,
    originalPrice: null,
    image: 'assets/images/products/prod_tote.png',
    category: 'Accessories',
    categoryLabel: 'Leather & Accessories',
    boughtCount: 3,
    avgIntervalDays: 75,
    daysSinceLast: 70,
    suggestedQty: 1,
    inStock: false,
    reason: 'Acquired 3× · Everyday atelier carryall'
  },
  {
    id: 'p7',
    name: 'Noise Canceling Earbuds',
    brand: 'Form',
    price: 145,
    originalPrice: null,
    image: 'assets/images/products/search_earbuds.png',
    category: 'Acoustics',
    categoryLabel: 'High Acoustics',
    boughtCount: 4,
    avgIntervalDays: 60,
    daysSinceLast: 56,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 4× · Daily commute & travel companion'
  },
  {
    id: 'p8',
    name: 'Double-Breasted Wool Overcoat',
    brand: 'Arc',
    price: 285,
    originalPrice: 320,
    image: 'assets/images/products/plp_overcoat.png',
    category: 'Apparel',
    categoryLabel: 'Ready-to-Wear',
    boughtCount: 2,
    avgIntervalDays: 180,
    daysSinceLast: 175,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 2× · Winter capsule cornerstone'
  },
  {
    id: 'p9',
    name: 'Obsidian Automatic Timepiece',
    brand: 'Volta',
    price: 340,
    originalPrice: null,
    image: 'assets/images/products/search_watch.png',
    category: 'Timepieces',
    categoryLabel: 'Timepieces',
    boughtCount: 2,
    avgIntervalDays: 180,
    daysSinceLast: 170,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 2× · Limited atelier caliber series'
  },
  {
    id: 'p10',
    name: 'Architectural Wool Trousers',
    brand: 'Arc',
    price: 170,
    originalPrice: null,
    image: 'assets/images/products/plp_trousers.png',
    category: 'Apparel',
    categoryLabel: 'Ready-to-Wear',
    boughtCount: 4,
    avgIntervalDays: 75,
    daysSinceLast: 72,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 4× · Double-pleat wardrobe staple'
  },
  {
    id: 'p11',
    name: 'Ribbed Silk-Cashmere Turtleneck',
    brand: 'Arc',
    price: 160,
    originalPrice: null,
    image: 'assets/images/products/plp_turtleneck.png',
    category: 'Apparel',
    categoryLabel: 'Ready-to-Wear',
    boughtCount: 3,
    avgIntervalDays: 60,
    daysSinceLast: 57,
    suggestedQty: 1,
    inStock: false,
    reason: 'Acquired 3× · Archive layering knit'
  },
  {
    id: 'p12',
    name: 'Japanese Selvedge Denim Archive',
    brand: 'Arc',
    price: 190,
    originalPrice: 215,
    image: 'assets/images/products/hero_jeans_rack.png',
    category: 'Apparel',
    categoryLabel: 'Ready-to-Wear',
    boughtCount: 3,
    avgIntervalDays: 90,
    daysSinceLast: 84,
    suggestedQty: 1,
    inStock: true,
    reason: 'Acquired 3× · Raw selvedge rotation due'
  }
];

/* ─── Curated Look Switcher Data & State ───────────────────────────────────── */
const CURATED_REPLENISHMENT_LOOKS = [
  {
    index: 0,
    key: 'apparel',
    tabLabel: '01 KNITWEAR',
    eyebrow: 'CURATED CAPSULE · 01 OF 04',
    seasonBadge: 'SEASONAL EDIT · AW26',
    title: 'The Winter Tailoring Capsule',
    desc: 'Double-faced wool overcoats and structured cashmere layers designed for seasonal rotation.',
    targetCategory: 'Apparel',
    image: 'assets/images/lifestyle/hero_sweater_landscape.jpg',
    featuredProductId: 'p1',
    featuredProductThumb: 'assets/images/products/hero_sweater.png',
    featuredProductTag: 'FEATURED REORDER',
    featuredProductTitle: 'Architectural Cashmere Sweater',
    featuredProductPrice: '€ 185.00'
  },
  {
    index: 1,
    key: 'acoustics',
    tabLabel: '02 ACOUSTICS',
    eyebrow: 'STUDIO CRAFT · 02 OF 04',
    seasonBadge: 'HIGH FIDELITY · 2026',
    title: 'Acoustic Precision & Spatial Sound',
    desc: 'Studio-grade planar magnetic drivers and active acoustic isolation for focused listening.',
    targetCategory: 'Acoustics',
    image: 'assets/images/lifestyle/hero_headphone_landscape.jpg',
    featuredProductId: 'p4',
    featuredProductThumb: 'assets/images/products/prod_headphones.png',
    featuredProductTag: 'ACOUSTIC CRAFT',
    featuredProductTitle: 'Planar Magnetic Studio Headphones',
    featuredProductPrice: '€ 220.00'
  },
  {
    index: 2,
    key: 'footwear',
    tabLabel: '03 FOOTWEAR',
    eyebrow: 'ARTISANAL STRIDE · 03 OF 04',
    seasonBadge: 'BESPOKE SOLE · 2026',
    title: 'Hand-Finished Nappa Leather Runners',
    desc: 'Full-grain Italian calfskin handcrafted on ergonomic cup soles for enduring comfort.',
    targetCategory: 'Footwear',
    image: 'assets/images/lifestyle/hero_runner_landscape.jpg',
    featuredProductId: 'p5',
    featuredProductThumb: 'assets/images/products/prod_runner.png',
    featuredProductTag: 'ARTISANAL RUNNER',
    featuredProductTitle: 'Minimalist Leather Runner',
    featuredProductPrice: '€ 185.00'
  },
  {
    index: 3,
    key: 'timepieces',
    tabLabel: '04 HOROLOGY',
    eyebrow: 'CALIBER SERIES · 04 OF 04',
    seasonBadge: 'LIMITED ARCHIVE',
    title: 'Obsidian Automatic Timepieces',
    desc: 'DLC-coated stainless steel timepieces engineered with bespoke mechanical calibers.',
    targetCategory: 'Timepieces',
    image: 'assets/images/lifestyle/hero_watch_landscape.jpg',
    featuredProductId: 'p9',
    featuredProductThumb: 'assets/images/products/search_watch.png',
    featuredProductTag: 'LIMITED HOROLOGY',
    featuredProductTitle: 'Obsidian Automatic Timepiece',
    featuredProductPrice: '€ 340.00'
  }
];

let activeLookIndex = 0;
let isLookPaused = false;
let lookTimerRaf = null;
let lookStartTime = null;
let lookElapsed = 0;
let lookSwitcherInitialized = false;
let lookTransitionToken = 0;
const LOOK_ROTATION_MS = 6500;

/* ─── Custom Intervals Management ─────────────────────────────────────────── */
function getCustomIntervals() {
  try { return JSON.parse(localStorage.getItem(SL_KEYS.intervals) || '{}'); }
  catch { return {}; }
}
function setCustomInterval(id, days) {
  const map = getCustomIntervals();
  map[id] = days;
  try { localStorage.setItem(SL_KEYS.intervals, JSON.stringify(map)); } catch {}
}
function getEffectiveInterval(product) {
  const map = getCustomIntervals();
  return map[product.id] || product.avgIntervalDays;
}
function getCadenceLabel(days) {
  if (days <= 30) return 'Monthly (30 Days)';
  if (days <= 60) return 'Bi-Monthly (60 Days)';
  if (days <= 90) return 'Quarterly (90 Days)';
  if (days <= 120) return 'Tri-Annual (120 Days)';
  return 'Seasonal (180 Days)';
}

/* ─── Scoring Algorithm ───────────────────────────────────────────────────── */
function scoreAndSort(products) {
  return products
    .map(p => {
      const interval = getEffectiveInterval(p);
      const recency = p.daysSinceLast / interval;
      return {
        ...p,
        _interval: interval,
        _recency: recency,
        _rank: (p.boughtCount * 0.4) + (recency * 0.6)
      };
    })
    .sort((a, b) => b._rank - a._rank);
}

/* ─── Dismiss Persistence ─────────────────────────────────────────────────── */
function getDismissed() {
  try { return JSON.parse(localStorage.getItem(SL_KEYS.dismissed) || '{}'); }
  catch { return {}; }
}
function saveDismissed(map) {
  try { localStorage.setItem(SL_KEYS.dismissed, JSON.stringify(map)); } catch {}
}
function dismissItem(id) {
  const map = getDismissed();
  const expires = new Date();
  expires.setDate(expires.getDate() + 60);
  map[id] = expires.toISOString();
  saveDismissed(map);
}
function undismissItem(id) {
  const map = getDismissed();
  delete map[id];
  saveDismissed(map);
}
function isDismissed(id) {
  const map = getDismissed();
  if (!map[id]) return false;
  if (new Date(map[id]) < new Date()) {
    delete map[id]; saveDismissed(map); return false;
  }
  return true;
}

/* ─── Feature Gate ────────────────────────────────────────────────────────── */
function getSmartList({ max = 20, category = 'all' } = {}) {
  const enabled  = localStorage.getItem(SL_KEYS.enabled);
  const optedOut = localStorage.getItem(SL_KEYS.optout);
  if (enabled === 'false' || optedOut === 'true') return null;

  let filtered = SL_PRODUCTS.filter(p => !isDismissed(p.id));
  if (category !== 'all') {
    filtered = filtered.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  const ranked = scoreAndSort(filtered);
  return ranked.slice(0, max);
}

/* ─── Total Valuation Calculator ─────────────────────────────────────────── */
function calculateCurationValuation(products) {
  return products.reduce((sum, p) => {
    if (!p.inStock) return sum;
    const qty = getQty(p.id);
    return sum + (p.price * qty);
  }, 0);
}

/* ─── Cart Integration ────────────────────────────────────────────────────── */
function addToCart(product, qty) {
  if (typeof CartState !== 'undefined') {
    CartState.addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      image: resolveImgPath(product.image), 
      category: product.category 
    }, qty);
    return true;
  }
  if (window.nexCart) {
    window.nexCart.addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: resolveImgPath(product.image),
      quantity: qty
    });
    return true;
  }
  return false;
}

/* ─── Ripple Factory (Motion Standard ①) ─────────────────────────────────── */
function attachRipple(btn) {
  if (!btn) return;
  const rect   = btn.getBoundingClientRect();
  const size   = Math.max(rect.width, rect.height) * 2;
  const x      = (rect.width / 2) - size / 2;
  const y      = (rect.height / 2) - size / 2;
  const ripple = document.createElement('span');
  ripple.className = 'sl-ripple';
  ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
  btn.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
}

/* ─── Qty Stepper Micro-pulse (Motion Standard ①) ────────────────────────── */
function pulseStepper(display) {
  if (!display) return;
  display.style.transform = 'scale(0.82)';
  display.style.transition = 'transform 90ms cubic-bezier(0.34, 1.56, 0.64, 1)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      display.style.transform = 'scale(1)';
    });
  });
}

/* ─── 120fps Look Switcher & Animation Track Controller ───────────────────── */
function updateProgressBar(progress) {
  const bar = document.getElementById('slSpotlightProgressBar');
  if (bar) {
    bar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress)).toFixed(4)})`;
  }
}

function tickLookTimer(now) {
  if (!lookStartTime) lookStartTime = now - lookElapsed;
  lookElapsed = now - lookStartTime;
  const progress = lookElapsed / LOOK_ROTATION_MS;

  updateProgressBar(progress);

  if (progress >= 1) {
    updateProgressBar(1);
    lookStartTime = null;
    lookElapsed = 0;
    const nextIndex = (activeLookIndex + 1) % CURATED_REPLENISHMENT_LOOKS.length;
    setCuratedLook(nextIndex, false);
    return;
  }

  lookTimerRaf = requestAnimationFrame(tickLookTimer);
}

// Starts a fresh rotation cycle (elapsed = 0). Does not run the rAF loop
// while paused — pauseLookTimer()/resumeLookTimer() own that transition so
// the elapsed clock never counts wall-clock time spent paused.
function startLookTimer() {
  if (lookTimerRaf) cancelAnimationFrame(lookTimerRaf);
  lookTimerRaf = null;
  lookStartTime = null;
  lookElapsed = 0;
  updateProgressBar(0);
  if (!isLookPaused) {
    lookStartTime = performance.now();
    lookTimerRaf = requestAnimationFrame(tickLookTimer);
  }
}

// Stops the rAF loop entirely so no time accrues while paused.
function pauseLookTimer() {
  if (isLookPaused) return;
  isLookPaused = true;
  if (lookTimerRaf) { cancelAnimationFrame(lookTimerRaf); lookTimerRaf = null; }
}

// Re-anchors lookStartTime against the current clock before resuming, so the
// paused duration is never counted as rotation progress.
function resumeLookTimer() {
  if (!isLookPaused) return;
  isLookPaused = false;
  lookStartTime = performance.now() - lookElapsed;
  lookTimerRaf = requestAnimationFrame(tickLookTimer);
}

function setCuratedLook(index, userInitiated = true) {
  activeLookIndex = index;
  const look = CURATED_REPLENISHMENT_LOOKS[index];
  if (!look) return;

  // Update tabs active state
  const tabs = document.querySelectorAll('#slSpotlightTabs .spotlight-tab-btn');
  tabs.forEach((tab, i) => {
    const isActive = i === index;
    tab.classList.toggle('active', isActive);
    tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
    tab.tabIndex = isActive ? 0 : -1;
  });

  // Update Look Content
  const eyebrowEl   = document.getElementById('slSpotlightLookEyebrow');
  const badgeEl     = document.getElementById('slSpotlightSeasonBadge');
  const titleEl     = document.getElementById('slSpotlightCapsuleTitle');
  const descEl      = document.getElementById('slSpotlightCapsuleDesc');
  const counterEl   = document.getElementById('slSpotlightPieceCount');
  const filterSync  = document.getElementById('slSpotlightSyncFilterBtn');

  if (eyebrowEl) eyebrowEl.textContent = look.eyebrow;
  if (badgeEl)   badgeEl.textContent   = look.seasonBadge;
  if (titleEl)   titleEl.textContent   = look.title;
  if (descEl)    descEl.textContent    = look.desc;

  if (filterSync) {
    filterSync.setAttribute('data-target-category', look.targetCategory);
  }

  // Count matching replenishment pieces
  const allAvailable = getSmartList({ max: 20, category: 'all' }) || [];
  const matchCount = allAvailable.filter(p => p.category.toLowerCase() === look.targetCategory.toLowerCase()).length;
  if (counterEl) {
    counterEl.textContent = `${matchCount} Matching Piece${matchCount === 1 ? '' : 's'}`;
  }

  // Update Visual Image Frame with smooth cross-dissolve. Guarded with a
  // transition token: if setCuratedLook() is called again (e.g. rapid tab
  // clicks, or an auto-rotation tick landing inside another look's 120ms
  // swap window) before this timeout fires, its callback is now stale and
  // must no-op instead of overwriting the newer look's text with this
  // look's image.
  const featuredImg = document.getElementById('slSpotlightFeaturedImg');
  if (featuredImg) {
    const transitionToken = ++lookTransitionToken;
    featuredImg.style.opacity = '0';
    featuredImg.style.transform = 'scale(1.02)';
    setTimeout(() => {
      if (transitionToken !== lookTransitionToken) return;
      featuredImg.src = resolveImgPath(look.image);
      featuredImg.alt = look.title;
      featuredImg.style.opacity = '1';
      featuredImg.style.transform = 'scale(1)';
    }, 120);
  }

  // Update Shoppable Look Capsule
  const pill       = document.getElementById('slSpotlightShoppablePill');
  const pillThumb  = document.getElementById('slSpotlightPillThumb');
  const pillTag    = document.getElementById('slSpotlightPillTag');
  const pillTitle  = document.getElementById('slSpotlightPillTitle');
  const pillPrice  = document.getElementById('slSpotlightPillPrice');
  const quickAddBtn = document.getElementById('slSpotlightQuickAddBtn');

  if (pill)        pill.setAttribute('data-id', look.featuredProductId);
  if (pillThumb)   pillThumb.src = resolveImgPath(look.featuredProductThumb);
  if (pillTag)     pillTag.textContent = look.featuredProductTag;
  if (pillTitle)   pillTitle.textContent = look.featuredProductTitle;
  if (pillPrice)   pillPrice.textContent = look.featuredProductPrice;
  if (quickAddBtn) quickAddBtn.setAttribute('data-id', look.featuredProductId);

  if (window.lucide) window.lucide.createIcons();

  // Reset 120fps progress timer
  startLookTimer();
}

function initLookSwitcher() {
  const spotlightSection = document.getElementById('slSpotlightSection');
  if (!spotlightSection) return;

  // renderSmartListPage() re-runs this on every dismiss/undo/cadence-save,
  // but the spotlight DOM is static — guard so listeners bind exactly once
  // (otherwise every re-render stacks another click handler on the same
  // buttons, causing quick-add/filter-sync/tab clicks to fire N times).
  if (lookSwitcherInitialized) return;
  lookSwitcherInitialized = true;

  const tabsContainer = document.getElementById('slSpotlightTabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('click', e => {
      const tab = e.target.closest('.spotlight-tab-btn');
      if (!tab) return;
      const lookIdx = parseInt(tab.getAttribute('data-look'), 10);
      if (!isNaN(lookIdx)) {
        setCuratedLook(lookIdx, true);
      }
    });

    // ARIA Tabs keyboard pattern: Arrow/Home/End move focus AND activate,
    // since inactive tabs carry tabIndex=-1 and are otherwise unreachable.
    tabsContainer.addEventListener('keydown', e => {
      const tabs = Array.from(tabsContainer.querySelectorAll('.spotlight-tab-btn'));
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let newIndex = null;
      if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % tabs.length;
      else if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') newIndex = 0;
      else if (e.key === 'End') newIndex = tabs.length - 1;
      else return;

      e.preventDefault();
      setCuratedLook(newIndex, true);
      tabs[newIndex].focus();
    });
  }

  // Pause toggle button
  const pauseBtn = document.getElementById('slSpotlightPauseToggleBtn');
  const pauseIcon = document.getElementById('slSpotlightPauseIcon');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (isLookPaused) resumeLookTimer(); else pauseLookTimer();
      pauseBtn.setAttribute('aria-pressed', isLookPaused ? 'true' : 'false');
      pauseBtn.setAttribute('aria-label', isLookPaused ? 'Resume automatic rotation' : 'Pause automatic rotation');
      if (pauseIcon) {
        pauseIcon.setAttribute('data-lucide', isLookPaused ? 'play' : 'pause');
        if (window.lucide) window.lucide.createIcons();
      }
    });
  }

  // Hover pause on visual frame or story pane
  spotlightSection.addEventListener('mouseenter', () => { pauseLookTimer(); });
  spotlightSection.addEventListener('mouseleave', () => {
    const isExplicitlyPaused = pauseBtn && pauseBtn.getAttribute('aria-pressed') === 'true';
    if (!isExplicitlyPaused) resumeLookTimer();
  });

  // Stop burning rAF/layout work while the spotlight is scrolled off-screen;
  // resume on return unless the user explicitly paused it.
  if ('IntersectionObserver' in window) {
    const spotlightVisibilityObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const isExplicitlyPaused = pauseBtn && pauseBtn.getAttribute('aria-pressed') === 'true';
          if (!isExplicitlyPaused) resumeLookTimer();
        } else {
          pauseLookTimer();
        }
      });
    }, { threshold: 0.1 });
    spotlightVisibilityObserver.observe(spotlightSection);
  }

  // Filter Sync Button Click
  const filterSyncBtn = document.getElementById('slSpotlightSyncFilterBtn');
  if (filterSyncBtn) {
    filterSyncBtn.addEventListener('click', () => {
      const targetCat = filterSyncBtn.getAttribute('data-target-category');
      if (targetCat) {
        applyCategoryFilter(targetCat);
      }
    });
  }

  // Shoppable Pill Quick Add
  const quickAddBtn = document.getElementById('slSpotlightQuickAddBtn');
  if (quickAddBtn) {
    quickAddBtn.addEventListener('click', () => {
      attachRipple(quickAddBtn);
      const prodId = quickAddBtn.getAttribute('data-id');
      const product = SL_PRODUCTS.find(p => p.id === prodId);
      if (product) {
        addToCart(product, 1);
        showToast(`${product.name} added to shopping bag`, 'success');
      }
    });
  }

  // Boot initial look
  setCuratedLook(0, false);
}

/* ─── Repurchase Cadence Customizer Modal ─────────────────────────────────── */
function openCadenceModal(productId) {
  const product = SL_PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const currentInterval = getEffectiveInterval(product);

  const existing = document.getElementById('slCadenceModal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'slCadenceModal';
  modal.className = 'sl-cadence-overlay';
  modal.innerHTML = `
    <div class="sl-cadence-dialog" role="dialog" aria-modal="true" aria-labelledby="slCadenceTitle">
      <div class="sl-cadence-header">
        <div>
          <span class="sl-ai-chip" style="margin-bottom: 6px; font-size: 9px;">CADENCE CONFIGURATION</span>
          <h3 id="slCadenceTitle" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 22px; margin: 0; color: #FFFFFF; font-weight: 400;">
            Adjust Replenishment Cycle
          </h3>
          <div style="font-size: 12px; color: var(--text-secondary, #94A3B8); margin-top: 4px;">${product.name}</div>
        </div>
        <button class="sl-cadence-close" id="slCadenceCloseBtn" aria-label="Close dialog">&times;</button>
      </div>

      <div class="sl-cadence-body">
        <p style="font-size: 12.5px; color: var(--text-secondary, #94A3B8); line-height: 1.5; margin: 0 0 16px;">
          Choose your preferred replenishment interval. The AI recommendation engine prioritizes this piece based on your selected cycle:
        </p>

        <div class="sl-cadence-options">
          <label class="sl-cadence-option ${currentInterval === 30 ? 'selected' : ''}">
            <input type="radio" name="slInterval" value="30" ${currentInterval === 30 ? 'checked' : ''} />
            <div class="sl-cadence-opt-text">
              <strong>Monthly</strong>
              <span>Every 30 days &middot; High rotation</span>
            </div>
            <i data-lucide="check" class="sl-cadence-check"></i>
          </label>

          <label class="sl-cadence-option ${currentInterval === 60 ? 'selected' : ''}">
            <input type="radio" name="slInterval" value="60" ${currentInterval === 60 ? 'checked' : ''} />
            <div class="sl-cadence-opt-text">
              <strong>Bi-Monthly</strong>
              <span>Every 60 days &middot; Recommended</span>
            </div>
            <i data-lucide="check" class="sl-cadence-check"></i>
          </label>

          <label class="sl-cadence-option ${currentInterval === 90 ? 'selected' : ''}">
            <input type="radio" name="slInterval" value="90" ${currentInterval === 90 ? 'checked' : ''} />
            <div class="sl-cadence-opt-text">
              <strong>Quarterly</strong>
              <span>Every 90 days &middot; Seasonal staple</span>
            </div>
            <i data-lucide="check" class="sl-cadence-check"></i>
          </label>

          <label class="sl-cadence-option ${currentInterval === 180 ? 'selected' : ''}">
            <input type="radio" name="slInterval" value="180" ${currentInterval === 180 ? 'checked' : ''} />
            <div class="sl-cadence-opt-text">
              <strong>Biannual / Seasonal</strong>
              <span>Every 180 days &middot; Archival refresh</span>
            </div>
            <i data-lucide="check" class="sl-cadence-check"></i>
          </label>
        </div>
      </div>

      <div class="sl-cadence-footer">
        <button class="sl-btn-cadence-cancel" id="slCadenceCancelBtn">Cancel</button>
        <button class="sl-btn-cadence-save" id="slCadenceSaveBtn">Save Cadence</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [modal] });

  modal.querySelectorAll('.sl-cadence-option').forEach(opt => {
    opt.addEventListener('click', () => {
      modal.querySelectorAll('.sl-cadence-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 250);
  };

  modal.querySelector('#slCadenceCloseBtn').addEventListener('click', closeModal);
  modal.querySelector('#slCadenceCancelBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  modal.querySelector('#slCadenceSaveBtn').addEventListener('click', () => {
    const selected = modal.querySelector('input[name="slInterval"]:checked');
    if (selected) {
      const days = parseInt(selected.value, 10);
      setCustomInterval(product.id, days);
      closeModal();
      renderSmartListPage();
      showToast(`Cadence for ${product.name} updated to every ${days} days`, 'success');
    }
  });

  requestAnimationFrame(() => modal.classList.add('active'));
}

/* ─── Interactive Undo Toast ──────────────────────────────────────────────── */
function showUndoToast(productName, onUndo) {
  const existing = document.querySelector('.sl-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'sl-toast sl-toast--undo';
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <i data-lucide="trash-2" class="sl-toast-icon" style="color: var(--accent-pink, #FB7185);"></i>
      <span><strong>${productName}</strong> removed from curation</span>
    </div>
    <button class="sl-toast-undo-btn" id="slToastUndoBtn">Undo</button>
  `;
  document.body.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [toast] });

  const undoBtn = toast.querySelector('#slToastUndoBtn');
  let isHandled = false;

  undoBtn.addEventListener('click', () => {
    if (isHandled) return;
    isHandled = true;
    onUndo();
    toast.classList.remove('sl-toast--visible');
    setTimeout(() => toast.remove(), 250);
  });

  requestAnimationFrame(() => {
    toast.classList.add('sl-toast--visible');
  });

  setTimeout(() => {
    if (!isHandled) {
      toast.classList.remove('sl-toast--visible');
      setTimeout(() => toast.remove(), 350);
    }
  }, 5000);
}

/* ─── Standard Notification Toast ─────────────────────────────────────────── */
function showToast(msg, type = 'info') {
  const existing = document.querySelector('.sl-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `sl-toast sl-toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-live', 'polite');
  toast.innerHTML = `
    <i data-lucide="${type === 'success' ? 'check-circle' : type === 'warn' ? 'alert-circle' : 'info'}" class="sl-toast-icon"></i>
    <span>${msg}</span>
  `;
  document.body.appendChild(toast);
  if (typeof lucide !== 'undefined') lucide.createIcons({ nodes: [toast] });

  requestAnimationFrame(() => {
    toast.classList.add('sl-toast--visible');
  });

  setTimeout(() => {
    toast.classList.remove('sl-toast--visible');
    setTimeout(() => toast.remove(), 350);
  }, 4000);
}

/* ─── Dismiss Animation ───────────────────────────────────────────────────── */
function animateDismiss(cardEl, onDone) {
  cardEl.style.transition = 'transform 320ms cubic-bezier(0.4, 0, 0.6, 1), opacity 280ms ease, max-height 320ms ease, margin 300ms ease, padding 300ms ease';
  cardEl.style.transformOrigin = 'top center';
  cardEl.style.overflow = 'hidden';
  cardEl.style.maxHeight = cardEl.offsetHeight + 'px';
  requestAnimationFrame(() => {
    cardEl.style.transform    = 'scaleY(0)';
    cardEl.style.opacity      = '0';
    cardEl.style.maxHeight    = '0';
    cardEl.style.marginTop    = '0';
    cardEl.style.marginBottom = '0';
    cardEl.style.paddingTop   = '0';
    cardEl.style.paddingBottom = '0';
    setTimeout(onDone, 340);
  });
}

/* ─── Card HTML Builder (Differential Parallax Depth + Clean Copy) ────────── */
function buildCardHTML(product, index = 0, isCompact = false) {
  const oos = !product.inStock;
  const hasSale = product.originalPrice && product.originalPrice > product.price;
  const priceStr = `€ ${Number(product.price).toFixed(2)}`;
  const origStr  = hasSale ? `€ ${Number(product.originalPrice).toFixed(2)}` : '';
  const resolvedImg = resolveImgPath(product.image);

  // Differential parallax depth: alternates across 4 columns (Motion Standard ④)
  const depthValues = [0.6, 1.15, 1.7, 0.85];
  const depth = depthValues[index % 4];

  if (isCompact) {
    return `
      <article class="sl-card sl-card--compact${oos ? ' sl-card--oos' : ''}" data-id="${product.id}" data-parallax-depth="${depth}" aria-label="${product.name}">
        <div class="sl-glare" aria-hidden="true"></div>
        <div class="sl-card-img-wrap">
          <img src="${resolvedImg}" alt="${product.name}" class="sl-card-img" loading="lazy" />
          ${oos ? '<div class="sl-oos-badge">Unavailable</div>' : ''}
        </div>
        <div class="sl-card-body">
          <span class="sl-reason-chip">${product.reason}</span>
          <div class="sl-card-brand">${product.brand}</div>
          <div class="sl-card-name">${product.name}</div>
          <div class="sl-card-price tabular-nums">
            ${priceStr}
            ${hasSale ? `<span class="sl-orig-price">${origStr}</span>` : ''}
          </div>
          ${hasSale ? `<div class="sl-omnibus-prior-price" style="font-size: 9.5px; color: var(--text-secondary); margin-top: 1px;">Lowest in 30d: ${origStr}</div>` : ''}
          <button class="sl-btn-add${oos ? ' sl-btn-add--disabled' : ''}" data-id="${product.id}" ${oos ? 'disabled aria-disabled="true"' : ''}>
            <span class="sl-btn-add-inner">${oos ? 'Atelier Reserved' : 'Add to Bag'}</span>
          </button>
        </div>
      </article>
    `;
  }

  // Full luxury atelier card with interactive cadence trigger & zero paragraph clutter
  const quickAddOverlayHTML = !oos
    ? `<div class="sl-quick-add-overlay">
        <button class="sl-btn-quick-add-slide" data-action="quick-add" data-id="${product.id}" aria-label="Add ${product.name} to bag">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD TO BAG
        </button>
      </div>`
    : '';

  return `
    <article class="sl-card${oos ? ' sl-card--oos' : ''}" data-id="${product.id}" data-category="${product.category}" data-parallax-depth="${depth}" role="listitem" aria-label="${product.name}">
      <div class="sl-glare" aria-hidden="true"></div>
      <button class="sl-dismiss-btn" data-dismiss="${product.id}" aria-label="Remove ${product.name} from curation" title="Remove from curation">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="sl-card-img-wrap">
        <a href="product.html?id=${product.id}" class="sl-card-img-link" aria-label="View ${product.name}">
          <img src="${resolvedImg}" alt="${product.name}" class="sl-card-img" loading="lazy" />
        </a>
        ${oos ? '<div class="sl-oos-badge">Atelier Reserved</div>' : ''}
        ${hasSale ? '<div class="sl-sale-badge">Private Archive</div>' : ''}
        ${quickAddOverlayHTML}
      </div>
      <div class="sl-card-body">
        
        <!-- Interactive Cadence / Reason Pill -->
        <button class="sl-reason-chip sl-reason-chip--interactive" data-cadence-trigger="${product.id}" title="Click to adjust replenishment cycle">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: inline-block; max-width: 200px;">${product.reason}</span>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 2px; opacity: 0.6;"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        <div class="sl-card-brand">${product.brand} &middot; ${product.categoryLabel || product.category}</div>
        <a href="product.html?id=${product.id}" class="sl-card-title-link" style="text-decoration: none; color: inherit;">
          <div class="sl-card-name">${product.name}</div>
        </a>
        <div class="sl-card-price tabular-nums">
          ${priceStr}
          ${hasSale ? `<span class="sl-orig-price">${origStr}</span>` : ''}
        </div>
        ${hasSale ? `<div class="sl-omnibus-prior-price" style="font-size: 9.5px; color: var(--text-secondary); margin-top: 1px; letter-spacing: 0.02em;">Lowest price in 30 days prior: ${origStr}</div>` : ''}

        <!-- Unified Horizontal Action Row -->
        <div class="sl-action-row">
          <div class="sl-stepper" role="group" aria-label="Quantity for ${product.name}">
            <button class="sl-stepper-btn sl-stepper-dec" data-id="${product.id}" aria-label="Decrease quantity">−</button>
            <span class="sl-stepper-val" data-qty="${product.id}" aria-live="polite">${getQty(product.id)}</span>
            <button class="sl-stepper-btn sl-stepper-inc" data-id="${product.id}" aria-label="Increase quantity">+</button>
          </div>
          <button class="sl-btn-add${oos ? ' sl-btn-add--disabled' : ''}" data-id="${product.id}" ${oos ? 'disabled aria-disabled="true"' : ''}>
            <span class="sl-btn-add-inner">${oos ? 'Reserved' : 'Move to Bag'}</span>
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ─── Qty State Map ───────────────────────────────────────────────────────── */
const qtyMap = {};

function getQty(id) {
  return qtyMap[id] ?? (SL_PRODUCTS.find(p => p.id === id)?.suggestedQty ?? 1);
}
function setQty(id, val) {
  qtyMap[id] = Math.max(1, Math.min(10, val));
}

/* ─── Card Event Delegation ───────────────────────────────────────────────── */
function bindCardEvents(container) {
  // Delegated listener lives on the container, which persists across
  // renderSmartListPage() re-renders (only grid.innerHTML changes) — guard
  // so re-renders don't stack duplicate delegated listeners on it.
  if (container._slEventsBound) return;
  container._slEventsBound = true;

  container.addEventListener('click', e => {
    const quickAddBtn = e.target.closest('[data-action="quick-add"]');
    const cadenceBtn  = e.target.closest('[data-cadence-trigger]');
    const dismissBtn  = e.target.closest('[data-dismiss]');
    const addBtn      = e.target.closest('.sl-btn-add:not(.sl-btn-add--disabled)');
    const decBtn      = e.target.closest('.sl-stepper-dec');
    const incBtn      = e.target.closest('.sl-stepper-inc');

    if (quickAddBtn) {
      attachRipple(quickAddBtn);
      const id = quickAddBtn.dataset.id;
      const product = SL_PRODUCTS.find(p => p.id === id);
      if (product && product.inStock) {
        addToCart(product, getQty(id));
        showToast(`${product.name} added to bag`, 'success');
      }
      return;
    }

    if (cadenceBtn) {
      const id = cadenceBtn.dataset.cadenceTrigger;
      openCadenceModal(id);
      return;
    }

    if (dismissBtn) {
      const id      = dismissBtn.dataset.dismiss;
      const card    = container.querySelector(`.sl-card[data-id="${id}"]`);
      const product = SL_PRODUCTS.find(p => p.id === id);
      if (!card || !product) return;

      dismissItem(id);
      animateDismiss(card, () => {
        card.remove();
        updateListStats();

        // 5-Second Undo Toast
        showUndoToast(product.name, () => {
          undismissItem(id);
          renderSmartListPage();
          showToast(`${product.name} restored to curation`, 'info');
        });
      });
      return;
    }

    if (addBtn) {
      attachRipple(addBtn);
      const id      = addBtn.dataset.id;
      const product = SL_PRODUCTS.find(p => p.id === id);
      if (!product) return;
      const qty = getQty(id);
      const added = addToCart(product, qty);
      if (added) {
        showToast(`${product.name} added to bag`, 'success');
        addBtn.querySelector('.sl-btn-add-inner').textContent = 'Added ✓';
        addBtn.classList.add('sl-btn-add--done');
        setTimeout(() => {
          if (addBtn.isConnected) {
            addBtn.querySelector('.sl-btn-add-inner').textContent = 'Move to Bag';
            addBtn.classList.remove('sl-btn-add--done');
          }
        }, 2200);
      }
      return;
    }

    if (decBtn || incBtn) {
      const id      = (decBtn || incBtn).dataset.id;
      const display = container.querySelector(`.sl-stepper-val[data-qty="${id}"]`);
      if (!display) return;
      const cur = getQty(id);
      setQty(id, cur + (decBtn ? -1 : 1));
      display.textContent = getQty(id);
      pulseStepper(display);
      updateListStats();
    }
  });
}

/* ─── List Stats Update ───────────────────────────────────────────────────── */
function updateListStats() {
  const countEl = document.getElementById('slItemCount');
  const valEl   = document.getElementById('slValuationDisplay');
  const empty   = document.getElementById('slEmptyState');
  const grid    = document.getElementById('slGrid');
  const addAllBtn = document.getElementById('slAddAll');

  const visibleList = getSmartList({ max: 20, category: activeCategoryFilter }) || [];

  if (visibleList.length === 0) {
    if (grid) grid.style.display = 'none';
    if (empty) empty.style.display = 'flex';
  } else {
    if (grid) grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';
  }

  // Stats and the "Move All to Bag" action are scoped to the active filter
  // so the toolbar always reflects what's actually visible/actionable.
  if (countEl) countEl.textContent = visibleList.length;

  if (valEl) {
    const total = calculateCurationValuation(visibleList);
    valEl.textContent = `€ ${Number(total).toFixed(2)}`;
  }

  if (addAllBtn && !addAllBtn.disabled) {
    const span = addAllBtn.querySelector('span');
    if (span) span.textContent = activeCategoryFilter === 'all' ? 'Move All to Bag' : 'Move Filtered to Bag';
  }

  // Update category pill counts (always reflect full totals per category,
  // independent of the active filter — these are the filter's own labels).
  const allAvailable = getSmartList({ max: 20, category: 'all' }) || [];
  document.querySelectorAll('.sl-filter-pill').forEach(pill => {
    const cat = pill.dataset.category;
    let count = 0;
    if (cat === 'all') {
      count = allAvailable.length;
      pill.textContent = `All Pieces (${count})`;
    } else {
      count = allAvailable.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
      const baseLabel = pill.dataset.label || cat;
      pill.textContent = `${baseLabel} (${count})`;
    }
  });
}

/* ─── Apply Category Filter (Direct & Synchronized) ───────────────────────── */
function applyCategoryFilter(cat) {
  if (!cat) return;
  activeCategoryFilter = cat;

  const filterBar = document.getElementById('slFilterBar');
  if (filterBar) {
    filterBar.querySelectorAll('.sl-filter-pill').forEach(p => {
      const matches = (p.dataset.category || '').toLowerCase() === cat.toLowerCase();
      p.classList.toggle('active', matches);
      p.setAttribute('aria-selected', matches ? 'true' : 'false');
    });
  }

  const grid = document.getElementById('slGrid');
  if (grid) {
    grid.style.transition = 'opacity 180ms ease, transform 180ms ease';
    grid.style.opacity = '0';
    grid.style.transform = 'translateY(6px)';

    setTimeout(() => {
      const filteredList = getSmartList({ max: 20, category: activeCategoryFilter }) || [];
      grid.innerHTML = filteredList.map((p, idx) => buildCardHTML(p, idx, false)).join('');

      if (window.initSmartListCardsMotion) {
        window.initSmartListCardsMotion();
      }

      grid.style.opacity = '1';
      grid.style.transform = 'translateY(0)';
      updateListStats();

      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 190);
  }
}

/* ─── Filter Bar Controller ───────────────────────────────────────────────── */
function initFilterBar() {
  const filterBar = document.getElementById('slFilterBar');
  if (!filterBar) return;
  if (filterBar._slEventsBound) return;
  filterBar._slEventsBound = true;

  filterBar.addEventListener('click', e => {
    const pill = e.target.closest('.sl-filter-pill');
    if (!pill) return;
    const cat = pill.dataset.category || 'all';
    applyCategoryFilter(cat);
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   SURFACE RENDERER 1: Smart List Full Page (smart-list.html)
   ══════════════════════════════════════════════════════════════════════════ */
function renderSmartListPage() {
  const grid          = document.getElementById('slGrid');
  const toolbar       = document.getElementById('slToolbar');
  const empty         = document.getElementById('slEmptyState');
  const hero          = document.getElementById('slHero');
  const spotlightWrap = document.getElementById('slSpotlightWrap');
  const bridge        = document.getElementById('slConciergeBridge');
  if (!grid) return;

  const list = getSmartList({ max: 20, category: activeCategoryFilter });

  if (!list || list.length === 0) {
    if (grid)          grid.style.display          = 'none';
    if (toolbar)       toolbar.style.display       = 'none';
    if (empty)         empty.style.display         = 'flex';
    if (hero)          hero.style.display          = 'block';
    if (spotlightWrap) spotlightWrap.style.display = 'none';
    if (bridge)        bridge.style.display        = 'none';
    return;
  }

  if (spotlightWrap) spotlightWrap.style.display = 'block';
  if (toolbar)       toolbar.style.display       = 'flex';

  // Render product cards with differential parallax depth index
  grid.innerHTML = list.map((p, idx) => buildCardHTML(p, idx, false)).join('');

  // Bind interaction events
  bindCardEvents(grid);

  // Initialize Curated Look Switcher & 120fps Animation Track
  initLookSwitcher();

  // Initialize filter bar
  initFilterBar();

  // Update live statistics and valuation
  updateListStats();

  // Initialize / Rebind Central Motion Standards (3D tilt, specular glare, parallax)
  if (window.initSmartListCardsMotion) {
    window.initSmartListCardsMotion();
  }
  if (window.initSmartListPageMotion) {
    window.initSmartListPageMotion();
  }

  // "Move all to bag" button
  const addAllBtn = document.getElementById('slAddAll');
  const progressWrap = document.getElementById('slProgressWrap');
  const progressBar  = document.getElementById('slProgressBar');
  if (addAllBtn && !addAllBtn._hasBound) {
    addAllBtn._hasBound = true;
    addAllBtn.addEventListener('click', () => {
      attachRipple(addAllBtn);
      // Scoped to the active filter so the action matches what's on screen —
      // previously this always added every category regardless of filter.
      const scopedList  = getSmartList({ max: 20, category: activeCategoryFilter }) || [];
      const inStockItems = scopedList.filter(p => p.inStock);
      const oosItems     = scopedList.filter(p => !p.inStock);

      if (!inStockItems.length) {
        showToast('No available atelier pieces to add', 'warn');
        return;
      }

      addAllBtn.disabled = true;
      const originalText = addAllBtn.querySelector('span').textContent;
      addAllBtn.querySelector('span').textContent = 'Moving to Bag…';
      if (progressWrap) progressWrap.style.display = 'block';

      if (progressBar) {
        progressBar.style.transition = 'transform 850ms cubic-bezier(0.4, 0, 0.2, 1)';
        progressBar.style.transform = 'scaleX(1)';
      }

      setTimeout(() => {
        inStockItems.forEach(p => addToCart(p, getQty(p.id)));

        let msg = `${inStockItems.length} ${inStockItems.length === 1 ? 'piece' : 'pieces'} added to your shopping bag`;
        if (oosItems.length) msg += ` · ${oosItems.length} reserved`;
        showToast(msg, oosItems.length ? 'warn' : 'success');

        addAllBtn.disabled = false;
        addAllBtn.querySelector('span').textContent = '✓ Added All';
        if (progressWrap) progressWrap.style.display = 'none';
        if (progressBar) { progressBar.style.transform = 'scaleX(0)'; }

        setTimeout(() => {
          if (addAllBtn.isConnected) {
            addAllBtn.querySelector('span').textContent = originalText;
          }
        }, 2000);
      }, 900);
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ══════════════════════════════════════════════════════════════════════════
   SURFACE RENDERER 2: Confirmation Page Widget
   ══════════════════════════════════════════════════════════════════════════ */
function renderConfirmationWidget() {
  const strip = document.getElementById('slConfirmStrip');
  if (!strip) return;

  const list = getSmartList({ max: 5 });
  if (!list || list.length < 3) {
    const widget = document.getElementById('slConfirmWidget');
    if (widget) widget.style.display = 'none';
    return;
  }

  strip.innerHTML = list.slice(0, 5).map((p, idx) => buildCardHTML(p, idx, true)).join('');
  bindCardEvents(strip);

  if (window.initSmartListCardsMotion) window.initSmartListCardsMotion();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ══════════════════════════════════════════════════════════════════════════
   SURFACE RENDERER 3: Homepage Section
   ══════════════════════════════════════════════════════════════════════════ */
function renderHomepageSection() {
  const strip = document.getElementById('slHomeStrip');
  const section = document.getElementById('homeSmartListSection');
  if (!strip) return;

  const list = getSmartList({ max: 6 });
  if (!list || list.length < 3) {
    if (section) section.style.display = 'none';
    return;
  }

  if (section) section.style.display = 'block';
  strip.innerHTML = list.slice(0, 6).map((p, idx) => buildCardHTML(p, idx, true)).join('');
  bindCardEvents(strip);

  if (window.initSmartListCardsMotion) window.initSmartListCardsMotion();
  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ─── Auto-init on Boot ──────────────────────────────────────────────────── */
function bootSmartReorder() {
  const page = document.body.dataset.slPage;
  if (page === 'smart-list')        renderSmartListPage();
  else if (page === 'confirmation') renderConfirmationWidget();
  else if (page === 'home')          renderHomepageSection();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootSmartReorder);
} else {
  bootSmartReorder();
}
