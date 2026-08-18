/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — AI-06 Smart Reorder Engine (10/10 Perfect Atelier Edition)
   Feature: AI-Recommended Shopping List (Atelier Curation & Replenishment)
   New Capabilities:
     1. Interactive Repurchase Cadence Popover (Custom Cycle Adjuster)
     2. Intelligent Seasonal / Climate Signal Context Banner
     3. Persistent Interval Customization (localStorage)
     4. Unified Action Row (Stepper + Move to Bag)
     5. Category Filter Pills with Cross-Fade Stagger
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
    price: 18400,
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
    price: 16200,
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
    price: 24500,
    originalPrice: 27000,
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
    price: 22000,
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
    price: 18400,
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
    price: 12500,
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
    price: 14500,
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
    price: 28500,
    originalPrice: 32000,
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
    price: 34000,
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
    price: 16800,
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
    price: 15800,
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
    price: 19200,
    originalPrice: 21500,
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
  return false;
}

/* ─── Ripple Factory (Motion Standard ①) ─────────────────────────────────── */
function attachRipple(btn) {
  btn.addEventListener('click', function(e) {
    const rect   = btn.getBoundingClientRect();
    const size   = Math.max(rect.width, rect.height) * 2;
    const x      = e.clientX - rect.left - size / 2;
    const y      = e.clientY - rect.top  - size / 2;
    const ripple = document.createElement('span');
    ripple.className = 'sl-ripple';
    ripple.style.cssText = `width:${size}px;height:${size}px;left:${x}px;top:${y}px;`;
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove(), { once: true });
  });
}

/* ─── Qty Stepper Micro-pulse (Motion Standard ①) ────────────────────────── */
function pulseStepper(display) {
  display.style.transform = 'scale(0.82)';
  display.style.transition = 'transform 90ms cubic-bezier(0.34,1.56,0.64,1)';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      display.style.transform = 'scale(1)';
    });
  });
}

/* ─── 3D Tilt + Specular Glare (Motion Standard ②) ───────────────────────── */
function attach3DTilt(card, maxTilt = 6.5) {
  const glare = card.querySelector('.sl-glare');
  let raf = null;

  card.addEventListener('mousemove', e => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) / (rect.width  / 2);
      const dy   = (e.clientY - cy) / (rect.height / 2);
      const rx   = -dy * maxTilt;
      const ry   =  dx * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(4px)`;
      card.style.boxShadow = `
        0 ${8 + dy * 8}px ${24 + Math.abs(dy) * 24}px rgba(0,0,0,0.30),
        0 ${16 + dy * 12}px ${48 + Math.abs(dx) * 24}px rgba(0,0,0,0.20)
      `;
      if (glare) {
        const gx = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
        const gy = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
        glare.style.setProperty('--gx', `${gx}%`);
        glare.style.setProperty('--gy', `${gy}%`);
        glare.style.opacity = '1';
      }
    });
  });

  card.addEventListener('mouseleave', () => {
    if (raf) cancelAnimationFrame(raf);
    card.style.transform  = '';
    card.style.boxShadow  = '';
    card.style.transition = 'transform 400ms cubic-bezier(0.23,1,0.32,1), box-shadow 400ms cubic-bezier(0.23,1,0.32,1)';
    if (glare) glare.style.opacity = '0';
    setTimeout(() => { card.style.transition = ''; }, 420);
  });
}

/* ─── Scroll Parallax Controller (Motion Standard ④) ─────────────────────── */
function initScrollParallax(container, depth = 0.026) {
  const cards = Array.from(container.querySelectorAll('.sl-card'));
  if (!cards.length) return;

  let ticking = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      cards.forEach((card, i) => {
        const dir    = i % 2 === 0 ? -1 : 1;
        const offset = scrollY * depth * dir;
        card.style.transform = `translateY(${offset}px)`;
        card.style.willChange = 'transform';
      });
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ─── GPU Page Transition (Motion Standard ③) ─────────────────────────────── */
function navigateWithTransition(url) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      window.location.href = url;
    });
  } else {
    window.location.href = url;
  }
}

/* ─── Add-All Progress Bar (Motion Standard ①) ────────────────────────────── */
function animateAddAllProgress(barEl, durationMs, onComplete) {
  barEl.style.transition = 'none';
  barEl.style.transform  = 'scaleX(0)';
  barEl.style.willChange = 'transform';
  barEl.style.transformOrigin = 'left center';

  requestAnimationFrame(() => {
    barEl.style.transition = `transform ${durationMs}ms cubic-bezier(0.4,0,0.2,1)`;
    requestAnimationFrame(() => {
      barEl.style.transform = 'scaleX(1)';
      setTimeout(() => {
        barEl.style.transition = 'opacity 200ms ease';
        barEl.style.opacity = '0';
        setTimeout(onComplete, 220);
      }, durationMs + 60);
    });
  });
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
          <h3 id="slCadenceTitle" style="font-family: 'Cormorant Garamond', serif; font-size: 22px; margin: 0; color: #FFFFFF;">
            Adjust Replenishment Cycle
          </h3>
          <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">${product.name}</div>
        </div>
        <button class="sl-cadence-close" id="slCadenceCloseBtn" aria-label="Close dialog">&times;</button>
      </div>

      <div class="sl-cadence-body">
        <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.5; margin: 0 0 16px;">
          Choose your preferred replenishment interval. The AI recommendation engine will prioritize this piece based on your selected cycle:
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

  // Option selection visual state
  modal.querySelectorAll('.sl-cadence-option').forEach(opt => {
    opt.addEventListener('click', () => {
      modal.querySelectorAll('.sl-cadence-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
    });
  });

  // Close handlers
  const closeModal = () => {
    modal.classList.remove('active');
    setTimeout(() => modal.remove(), 250);
  };

  modal.querySelector('#slCadenceCloseBtn').addEventListener('click', closeModal);
  modal.querySelector('#slCadenceCancelBtn').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

  // Save handler
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
      <i data-lucide="trash-2" class="sl-toast-icon" style="color: var(--accent-pink);"></i>
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
  cardEl.style.transition = 'transform 320ms cubic-bezier(0.4,0,0.6,1), opacity 280ms ease, max-height 320ms ease, margin 300ms ease, padding 300ms ease';
  cardEl.style.transformOrigin = 'top center';
  cardEl.style.overflow = 'hidden';
  cardEl.style.maxHeight = cardEl.offsetHeight + 'px';
  requestAnimationFrame(() => {
    cardEl.style.transform  = 'scaleY(0)';
    cardEl.style.opacity    = '0';
    cardEl.style.maxHeight  = '0';
    cardEl.style.marginTop  = '0';
    cardEl.style.marginBottom = '0';
    cardEl.style.paddingTop = '0';
    cardEl.style.paddingBottom = '0';
    setTimeout(onDone, 340);
  });
}

/* ─── Card HTML Builder (Interactive Reason Chip for Cadence) ─────────────── */
function buildCardHTML(product, isCompact = false) {
  const oos = !product.inStock;
  const hasSale = product.originalPrice && product.originalPrice > product.price;
  const priceStr = `BDT ${product.price.toLocaleString()}`;
  const origStr  = hasSale ? `BDT ${product.originalPrice.toLocaleString()}` : '';
  const resolvedImg = resolveImgPath(product.image);
  const effectiveInterval = getEffectiveInterval(product);
  const cadenceBadge = getCadenceLabel(effectiveInterval);

  if (isCompact) {
    return `
      <article class="sl-card sl-card--compact${oos ? ' sl-card--oos' : ''}" data-id="${product.id}" aria-label="${product.name}">
        <div class="sl-glare" aria-hidden="true"></div>
        <div class="sl-card-img-wrap">
          <img src="${resolvedImg}" alt="${product.name}" class="sl-card-img" loading="lazy" />
          ${oos ? '<div class="sl-oos-badge">Unavailable</div>' : ''}
        </div>
        <div class="sl-card-body">
          <span class="sl-reason-chip">${product.reason}</span>
          <div class="sl-card-brand">${product.brand}</div>
          <div class="sl-card-name">${product.name}</div>
          <div class="sl-card-price">
            ${priceStr}
            ${hasSale ? `<span class="sl-orig-price">${origStr}</span>` : ''}
          </div>
          <button class="sl-btn-add${oos ? ' sl-btn-add--disabled' : ''}" data-id="${product.id}" ${oos ? 'disabled aria-disabled="true"' : ''}>
            <span class="sl-btn-add-inner">${oos ? 'Atelier Reserved' : 'Add to Bag'}</span>
          </button>
        </div>
      </article>
    `;
  }

  // Full luxury atelier card with interactive cadence trigger
  return `
    <article class="sl-card${oos ? ' sl-card--oos' : ''}" data-id="${product.id}" data-category="${product.category}" aria-label="${product.name}">
      <div class="sl-glare" aria-hidden="true"></div>
      <button class="sl-dismiss-btn" data-dismiss="${product.id}" aria-label="Remove ${product.name} from curation">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="sl-card-img-wrap">
        <img src="${resolvedImg}" alt="${product.name}" class="sl-card-img" loading="lazy" />
        ${oos ? '<div class="sl-oos-badge">Atelier Reserved</div>' : ''}
        ${hasSale ? '<div class="sl-sale-badge">Private Archive</div>' : ''}
      </div>
      <div class="sl-card-body">
        
        <!-- Interactive Cadence / Reason Pill -->
        <button class="sl-reason-chip sl-reason-chip--interactive" data-cadence-trigger="${product.id}" title="Click to adjust replenishment cycle">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
          <span>${product.reason}</span>
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="margin-left: 2px; opacity: 0.6;"><path d="m6 9 6 6 6-6"/></svg>
        </button>

        <div class="sl-card-brand">${product.brand} &middot; ${product.categoryLabel || product.category}</div>
        <div class="sl-card-name">${product.name}</div>
        <div class="sl-card-price">
          ${priceStr}
          ${hasSale ? `<span class="sl-orig-price">${origStr}</span>` : ''}
        </div>

        <!-- Unified Horizontal Action Row -->
        <div class="sl-action-row">
          <div class="sl-stepper" role="group" aria-label="Quantity for ${product.name}">
            <button class="sl-stepper-btn sl-stepper-dec" data-id="${product.id}" aria-label="Decrease quantity">−</button>
            <span class="sl-stepper-val" data-qty="${product.id}" aria-live="polite">${product.suggestedQty}</span>
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
  container.addEventListener('click', e => {
    const cadenceBtn = e.target.closest('[data-cadence-trigger]');
    const dismissBtn = e.target.closest('[data-dismiss]');
    const addBtn     = e.target.closest('.sl-btn-add:not(.sl-btn-add--disabled)');
    const decBtn     = e.target.closest('.sl-stepper-dec');
    const incBtn     = e.target.closest('.sl-stepper-inc');

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

  const visibleList = getSmartList({ max: 20, category: activeCategoryFilter });

  if (!visibleList || visibleList.length === 0) {
    if (grid) grid.style.display = 'none';
    if (empty) empty.style.display = 'flex';
  } else {
    if (grid) grid.style.display = 'grid';
    if (empty) empty.style.display = 'none';
  }

  const allAvailable = getSmartList({ max: 20, category: 'all' }) || [];
  if (countEl) countEl.textContent = allAvailable.length;

  if (valEl) {
    const total = calculateCurationValuation(allAvailable);
    valEl.textContent = `BDT ${total.toLocaleString()}`;
  }

  // Update category pill counts
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

/* ─── Filter Bar Controller ───────────────────────────────────────────────── */
function initFilterBar() {
  const filterBar = document.getElementById('slFilterBar');
  if (!filterBar) return;

  filterBar.addEventListener('click', e => {
    const pill = e.target.closest('.sl-filter-pill');
    if (!pill) return;

    filterBar.querySelectorAll('.sl-filter-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    activeCategoryFilter = pill.dataset.category || 'all';

    // Cross-fade grid re-render
    const grid = document.getElementById('slGrid');
    if (grid) {
      grid.style.transition = 'opacity 180ms ease, transform 180ms ease';
      grid.style.opacity = '0';
      grid.style.transform = 'translateY(8px)';

      setTimeout(() => {
        const filteredList = getSmartList({ max: 20, category: activeCategoryFilter }) || [];
        grid.innerHTML = filteredList.map(p => buildCardHTML(p, false)).join('');
        grid.querySelectorAll('.sl-card').forEach(card => attach3DTilt(card));

        grid.style.opacity = '1';
        grid.style.transform = 'translateY(0)';
        updateListStats();

        if (typeof lucide !== 'undefined') lucide.createIcons();
      }, 190);
    }
  });
}

/* ══════════════════════════════════════════════════════════════════════════
   SURFACE RENDERER 1: Smart List Full Page (smart-list.html)
   ══════════════════════════════════════════════════════════════════════════ */
function renderSmartListPage() {
  const grid    = document.getElementById('slGrid');
  const toolbar = document.getElementById('slToolbar');
  const empty   = document.getElementById('slEmptyState');
  const hero    = document.getElementById('slHero');
  const bridge  = document.getElementById('slConciergeBridge');
  if (!grid) return;

  const list = getSmartList({ max: 20, category: activeCategoryFilter });

  if (!list || list.length < 3) {
    if (grid)    grid.style.display    = 'none';
    if (toolbar) toolbar.style.display = 'none';
    if (empty)   empty.style.display   = 'flex';
    if (hero)    hero.style.display    = 'none';
    if (bridge)  bridge.style.display  = 'none';
    return;
  }

  // Render cards
  grid.innerHTML = list.map(p => buildCardHTML(p, false)).join('');

  // Attach 3D tilt + specular to each card
  grid.querySelectorAll('.sl-card').forEach(card => attach3DTilt(card));

  // Bind interaction events
  bindCardEvents(grid);

  // Initialize filter bar
  initFilterBar();

  // Update live statistics and valuation
  updateListStats();

  // Scroll parallax — even/odd depth
  initScrollParallax(grid, 0.026);

  // Scroll reveal stagger (Motion.dev via inView if available)
  const cards = Array.from(grid.querySelectorAll('.sl-card'));
  if (typeof inView !== 'undefined' && typeof animate !== 'undefined') {
    cards.forEach(el => { el.style.opacity = '0'; el.style.transform += ' translateY(22px)'; });
    inView(grid, () => {
      animate(cards,
        { opacity: [0, 1], y: [22, 0] },
        { delay: stagger(0.06, { startDelay: 0.05 }), duration: 0.75, easing: [0.16, 1, 0.3, 1] }
      );
    }, { margin: '0px 0px -8% 0px' });
  }

  // "Move all to bag" button
  const addAllBtn = document.getElementById('slAddAll');
  const progressWrap = document.getElementById('slProgressWrap');
  const progressBar  = document.getElementById('slProgressBar');
  if (addAllBtn) {
    addAllBtn.addEventListener('click', () => {
      const allAvailable = getSmartList({ max: 20, category: 'all' }) || [];
      const inStockItems = allAvailable.filter(p => p.inStock && !isDismissed(p.id));
      const oosItems     = allAvailable.filter(p => !p.inStock && !isDismissed(p.id));

      if (!inStockItems.length) {
        showToast('No available atelier pieces to add', 'warn');
        return;
      }

      addAllBtn.disabled = true;
      addAllBtn.querySelector('span').textContent = 'Moving to Bag…';
      if (progressWrap) progressWrap.style.display = 'block';

      animateAddAllProgress(progressBar, 900, () => {
        inStockItems.forEach(p => addToCart(p, getQty(p.id)));

        let msg = `${inStockItems.length} pieces added to your shopping bag`;
        if (oosItems.length) msg += ` · ${oosItems.length} reserved (atelier consultation required)`;
        showToast(msg, oosItems.length ? 'warn' : 'success');

        addAllBtn.disabled = false;
        addAllBtn.querySelector('span').textContent = 'Move All to Bag';
        if (progressWrap) progressWrap.style.display = 'none';
        if (progressBar) { progressBar.style.opacity = '1'; progressBar.style.transform = 'scaleX(0)'; }
      });
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

  strip.innerHTML = list.slice(0, 5).map(p => buildCardHTML(p, true)).join('');

  strip.querySelectorAll('.sl-card').forEach(card => attach3DTilt(card, 4));
  bindCardEvents(strip);

  // Stagger-in from right after 500ms async delay
  const cards = strip.querySelectorAll('.sl-card');
  cards.forEach(c => { c.style.opacity = '0'; c.style.transform = 'translateX(18px)'; });
  setTimeout(() => {
    if (typeof animate !== 'undefined' && typeof stagger !== 'undefined') {
      animate(Array.from(cards),
        { opacity: [0, 1], x: [18, 0] },
        { delay: stagger(0.07, { startDelay: 0.05 }), duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    } else {
      cards.forEach((c, i) => {
        setTimeout(() => {
          c.style.transition = 'opacity 500ms ease, transform 500ms cubic-bezier(0.16,1,0.3,1)';
          c.style.opacity    = '1';
          c.style.transform  = 'translateX(0)';
        }, i * 80);
      });
    }
  }, 500);

  // View transition on "View full list" link
  const viewLink = document.getElementById('slConfirmViewAll');
  if (viewLink) {
    viewLink.addEventListener('click', e => {
      e.preventDefault();
      navigateWithTransition(viewLink.href);
    });
  }

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

  // Reveal the section when eligible
  if (section) section.style.display = 'block';

  strip.innerHTML = list.slice(0, 6).map(p => buildCardHTML(p, true)).join('');

  strip.querySelectorAll('.sl-card').forEach(card => attach3DTilt(card, 5));
  bindCardEvents(strip);

  // Scroll reveal on section entry
  if (section && typeof inView !== 'undefined' && typeof animate !== 'undefined') {
    const cards = Array.from(strip.querySelectorAll('.sl-card'));
    cards.forEach(c => { c.style.opacity = '0'; });
    inView(section, () => {
      animate(cards,
        { opacity: [0, 1], y: [20, 0] },
        { delay: stagger(0.08, { startDelay: 0.1 }), duration: 0.7, easing: [0.16, 1, 0.3, 1] }
      );
    }, { margin: '0px 0px -10% 0px' });
  }

  // Parallax depth on strip
  initScrollParallax(strip, 0.015);

  // View transition on CTA link
  const viewLink = document.getElementById('slHomeViewAll');
  if (viewLink) {
    viewLink.addEventListener('click', e => {
      e.preventDefault();
      navigateWithTransition(viewLink.href);
    });
  }

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

/* ─── Auto-init on DOMContentLoaded ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = document.body.dataset.slPage;
  if (page === 'smart-list')       renderSmartListPage();
  else if (page === 'confirmation') renderConfirmationWidget();
  else if (page === 'home')         renderHomepageSection();
});
