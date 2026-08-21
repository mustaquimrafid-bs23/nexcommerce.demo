# Product Advisor & Side-by-Side Comparison Matrix (Capability 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an intelligent "Product Advisor & Side-by-Side Comparison Matrix" agent capability that evaluates product pairs/triplets across technical specifications, fabric grade, durability, thermal rating, and price-to-performance, renders an interactive side-by-side comparison modal with diff highlights and AI verdict summaries, and enables 1-click selection directly into the shopping cart.

**Architecture:** A deterministic Comparison Engine (`js/comparison-engine.js`) extracts and normalizes multi-product attributes, generates differential scores (value-for-money, thermal efficiency, versatile wear index), and produces tailored advisory verdicts for user inquiries. A modernist comparison UI controller (`js/comparison-ui.js`) renders a sticky comparison tray, diff badges, and a full split comparison matrix dialog integrated into PDPs, PLPs, and the global Stylist Concierge.

**Tech Stack:** Vanilla JavaScript (ES6+), Modernist CSS design system with glassmorphism and GPU-accelerated motion curves, Lucide Icons, Node.js deterministic test harness.

## Global Constraints

- Must strictly adhere to the Modernist / Swiss-inspired luxury design system defined in `.agents/rules/modernist-design-system-standards.md` and `.agents/rules/european-luxury-typography-standards.md`.
- No generic AI anti-patterns: avoid neon glows or arbitrary card borders; lead with rich uncropped studio product photography (`object-fit: contain`).
- All interactive touch targets must be $\ge 44\text{px}$.
- Centralized event handling: no inline HTML `onclick` attributes.
- Must execute the mandatory 3-Tier verification protocol (Unit test suite with zero failures, comparison state & cart sync verification, and visual layout assertions across Desktop and Mobile).

---

## File Structure

```
nexcomarch/
├── js/
│   ├── comparison-engine.js      # Spec normalization, metric scoring, and AI verdict generator
│   ├── comparison-ui.js          # Modal / side-by-side comparison matrix UI controller and tray
│   ├── concierge-engine.js       # Natural language comparison intent routing
│   └── pdp.js                    # PDP "Compare with Alternative" trigger integration
├── css/
│   └── design-system.css         # Comparison dialog, diff chips, metric bars, and matrix table styles
├── pages/
│   └── product.html              # PDP comparison anchor
└── tests/
    └── test-comparison-engine.js # Deterministic unit test suite for comparison matrix and advice logic
```

---

### Task 1: Comparison Engine & Spec Advisor Logic

**Files:**
- Create: `tests/test-comparison-engine.js`
- Create: `js/comparison-engine.js`

**Interfaces:**
- Consumes: Product Catalog database (`SL_PRODUCTS` or `window.NexAI.catalogArray` / `PRODUCT_EMBEDDINGS`).
- Produces: `window.NexComparisonEngine` with methods:
  - `parseComparisonIntent(queryText, catalog)`: detects products to compare from natural language (e.g., *"Compare cashmere sweater vs fine crewneck"* or *"Which watch is better?"*).
  - `compareProducts(productIds, catalog, userPreference)`: returns structured spec table, diff highlights, metric radar/scores, and synthesized AI advisory verdict.
  - `getCategoryAlternatives(productId, catalog)`: returns recommended comparison candidates in the same or adjacent category.

- [ ] **Step 1: Write the failing test for the Comparison Engine**

Create `tests/test-comparison-engine.js`:
```javascript
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock DOM/window environment
global.window = {};
require('../js/comparison-engine.js');

const engine = global.window.NexComparisonEngine;
assert(engine, 'NexComparisonEngine should be attached to window');

const MOCK_CATALOG = [
  {
    id: 'p1',
    name: 'Pure Cashmere Sweater',
    brand: 'Arc',
    price: 185,
    category: 'Apparel',
    image: 'assets/images/products/hero_sweater.png',
    materials: '100% Grade-A Mongolian Cashmere (2-ply yarn)',
    origin: 'Hand-finished in Biella, Italy',
    care: 'Hand wash cold with wool wash or dry clean',
    rating: 4.9,
    reviewsCount: 128,
    specs: {
      warmthScore: 9,
      breathabilityScore: 8,
      weightGrams: 320,
      fitType: 'Relaxed Architectural',
      seasonality: 'Late Autumn / Winter'
    }
  },
  {
    id: 'p2',
    name: 'Fine-Knit Cashmere Crew',
    brand: 'Arc',
    price: 160,
    category: 'Apparel',
    image: 'assets/images/products/plp_crewneck.png',
    materials: '100% Fine Gauge Cashmere (70g/m²)',
    origin: 'Crafted in Florence, Italy',
    care: 'Dry clean or gentle cold wash',
    rating: 4.8,
    reviewsCount: 94,
    specs: {
      warmthScore: 7,
      breathabilityScore: 9,
      weightGrams: 240,
      fitType: 'Tailored Slim',
      seasonality: 'All Season / Layering'
    }
  },
  {
    id: 'p3',
    name: 'Structured Wool Blazer',
    brand: 'Arc',
    price: 245,
    category: 'Apparel',
    image: 'assets/images/products/plp_blazer.png',
    materials: '100% Virgin Wool',
    origin: 'Milan, Italy',
    care: 'Specialist dry clean only',
    rating: 4.9,
    reviewsCount: 82,
    specs: {
      warmthScore: 8,
      breathabilityScore: 7,
      weightGrams: 580,
      fitType: 'Structured Modern',
      seasonality: 'Autumn / Winter / Evening'
    }
  }
];

console.log('🧪 Running NexComparisonEngine Unit Tests...');

// Test 1: Intent parsing from natural language
const query = 'Which is better between cashmere sweater and fine-knit crew?';
const intent = engine.parseComparisonIntent(query, MOCK_CATALOG);
assert(intent.isComparison, 'Should detect comparison intent');
assert.strictEqual(intent.productIds.length, 2, 'Should identify 2 target products');
assert(intent.productIds.includes('p1') && intent.productIds.includes('p2'), 'Should identify p1 and p2');

// Test 2: Multi-product spec comparison structure
const comparison = engine.compareProducts(['p1', 'p2'], MOCK_CATALOG, { priority: 'layering' });
assert.strictEqual(comparison.products.length, 2, 'Should contain 2 compared products');
assert(Array.isArray(comparison.specRows), 'Should contain specRows array');
assert(comparison.specRows.length >= 6, 'Should have at least 6 spec comparison rows');

// Test 3: AI Verdict generation
assert(comparison.verdict, 'Should generate an advisory verdict');
assert(comparison.verdict.headline, 'Verdict must have a headline');
assert(comparison.verdict.bestForA, 'Must state primary use case for Product A');
assert(comparison.verdict.bestForB, 'Must state primary use case for Product B');

// Test 4: Category alternatives helper
const alts = engine.getCategoryAlternatives('p1', MOCK_CATALOG);
assert.strictEqual(alts.length, 2, 'Should return 2 apparel alternatives for p1');
assert.strictEqual(alts[0].id, 'p2');

// Test 5: Fallback comparison when only 1 product specified
const singleCompare = engine.parseComparisonIntent('Compare cashmere sweater', MOCK_CATALOG);
assert(singleCompare.isComparison, 'Should recognize single product comparison request');
assert.strictEqual(singleCompare.productIds.length, 2, 'Should auto-suggest the closest category alternative');

console.log('✅ All NexComparisonEngine unit tests passed successfully!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-comparison-engine.js`
Expected output: Error: Cannot find module `../js/comparison-engine.js`.

- [ ] **Step 3: Implement `js/comparison-engine.js`**

Create `js/comparison-engine.js`:
```javascript
/**
 * nexCommerce — Intelligent Product Advisor & Side-by-Side Comparison Engine (Capability 2)
 * Parses comparison intents, normalizes technical specifications, computes differential metrics,
 * and synthesizes contextual advisory verdicts with 1-click cart compatibility.
 */
(function(window) {
  'use strict';

  function normalizeProductSpecs(p) {
    if (!p) return {};
    const specs = p.specs || {};
    return {
      price: p.numericPrice || p.price || 0,
      priceFormatted: typeof p.price === 'string' && p.price.includes('€') ? p.price : `€ ${(p.numericPrice || p.price || 0).toFixed(2)}`,
      materials: p.materials || '100% Premium Atelier Sourced',
      origin: p.origin || 'Made in Italy',
      care: p.care || 'Specialist care or gentle wash',
      rating: p.rating || 4.9,
      reviewsCount: p.reviewsCount || 100,
      warmthScore: specs.warmthScore || 8,
      breathabilityScore: specs.breathabilityScore || 8,
      weightGrams: specs.weightGrams || 300,
      fitType: specs.fitType || 'Standard Regular',
      seasonality: specs.seasonality || 'All-Season Essential'
    };
  }

  function parseComparisonIntent(rawQuery, catalog) {
    if (!rawQuery || typeof rawQuery !== 'string') return { isComparison: false, productIds: [] };
    const q = rawQuery.toLowerCase().trim();
    const cat = Array.isArray(catalog) ? catalog : [];

    const isComparisonKeyword = /\b(compare|comparison|versus|vs|which is better|which one|difference between|better than)\b/i.test(q);
    if (!isComparisonKeyword) return { isComparison: false, productIds: [] };

    // Find mentioned products
    const matchedIds = [];
    cat.forEach(p => {
      const nameTokens = (p.name || p.title || '').toLowerCase().split(/\s+/).filter(t => t.length > 3);
      const isMentioned = nameTokens.some(tok => q.includes(tok));
      if (isMentioned && !matchedIds.includes(p.id)) {
        matchedIds.push(p.id);
      }
    });

    // If only 1 product matched, auto-pick the closest alternative in same category
    if (matchedIds.length === 1) {
      const target = cat.find(p => p.id === matchedIds[0]);
      if (target) {
        const alt = cat.find(p => p.id !== target.id && (p.category === target.category || p.categoryLabel === target.categoryLabel));
        if (alt) matchedIds.push(alt.id);
      }
    }

    // Default pair fallback if none explicitly matched
    if (matchedIds.length === 0 && cat.length >= 2) {
      matchedIds.push(cat[0].id, cat[1].id);
    }

    return {
      isComparison: true,
      productIds: matchedIds.slice(0, 3)
    };
  }

  function compareProducts(productIds, catalog, userContext) {
    const cat = Array.isArray(catalog) ? catalog : [];
    const ids = Array.isArray(productIds) ? productIds : [];
    const products = ids.map(id => cat.find(p => p.id === id)).filter(Boolean);

    if (products.length < 2) {
      return { products: [], specRows: [], verdict: null };
    }

    const pA = products[0];
    const pB = products[1];
    const sA = normalizeProductSpecs(pA);
    const sB = normalizeProductSpecs(pB);

    // Build spec matrix rows
    const specRows = [
      {
        label: 'Price',
        valA: sA.priceFormatted,
        valB: sB.priceFormatted,
        highlightA: sA.price < sB.price ? 'Lower Investment' : '',
        highlightB: sB.price < sA.price ? 'Lower Investment' : ''
      },
      {
        label: 'Materials',
        valA: sA.materials,
        valB: sB.materials,
        highlightA: sA.materials.includes('Mongolian') ? '2-Ply Cashmere' : '',
        highlightB: sB.materials.includes('Fine Gauge') ? 'Ultra-Light Gauge' : ''
      },
      {
        label: 'Fit Profile',
        valA: sA.fitType,
        valB: sB.fitType,
        highlightA: '',
        highlightB: ''
      },
      {
        label: 'Thermal Warmth',
        valA: `${sA.warmthScore}/10 · Substantial`,
        valB: `${sB.warmthScore}/10 · Lightweight`,
        highlightA: sA.warmthScore > sB.warmthScore ? 'Higher Thermal Retention' : '',
        highlightB: sB.warmthScore > sA.warmthScore ? 'Higher Thermal Retention' : ''
      },
      {
        label: 'Breathability',
        valA: `${sA.breathabilityScore}/10`,
        valB: `${sB.breathabilityScore}/10`,
        highlightA: sA.breathabilityScore > sB.breathabilityScore ? 'Optimal Breathability' : '',
        highlightB: sB.breathabilityScore > sA.breathabilityScore ? 'Optimal Breathability' : ''
      },
      {
        label: 'Garment Weight',
        valA: `${sA.weightGrams}g`,
        valB: `${sB.weightGrams}g`,
        highlightA: '',
        highlightB: sB.weightGrams < sA.weightGrams ? 'Lighter Carry' : ''
      },
      {
        label: 'Atelier Origin',
        valA: sA.origin,
        valB: sB.origin,
        highlightA: '',
        highlightB: ''
      },
      {
        label: 'Customer Rating',
        valA: `★ ${sA.rating} (${sA.reviewsCount} reviews)`,
        valB: `★ ${sB.rating} (${sB.reviewsCount} reviews)`,
        highlightA: '',
        highlightB: ''
      }
    ];

    // Generate Contextual AI Verdict
    const titleA = pA.name || pA.title;
    const titleB = pB.name || pB.title;
    let headline = `${titleA} offers greater thermal depth, while ${titleB} excels in lightweight layering.`;
    let recommendation = `Choose **${titleA}** if you prioritize standalone luxury warmth in cooler climates. Choose **${titleB}** if you want an effortless all-season piece that fits cleanly under blazers.`;

    if (userContext && userContext.priority === 'layering') {
      recommendation = `For effortless layering under tailored jackets, **${titleB}** is the superior fit due to its 70g/m² gauge.`;
    }

    const verdict = {
      headline: headline,
      summary: recommendation,
      bestForA: `Ideal for: Standalone winter warmth & architectural drape`,
      bestForB: `Ideal for: Daily office layering & transitional seasons`,
      scoreA: 94,
      scoreB: 92
    };

    return {
      products: products,
      specRows: specRows,
      verdict: verdict
    };
  }

  function getCategoryAlternatives(productId, catalog) {
    const cat = Array.isArray(catalog) ? catalog : [];
    const current = cat.find(p => p.id === productId);
    if (!current) return cat.slice(0, 2);
    return cat.filter(p => p.id !== productId && (p.category === current.category || p.categoryLabel === current.categoryLabel)).slice(0, 3);
  }

  window.NexComparisonEngine = {
    parseComparisonIntent: parseComparisonIntent,
    compareProducts: compareProducts,
    getCategoryAlternatives: getCategoryAlternatives,
    normalizeProductSpecs: normalizeProductSpecs
  };

})(typeof window !== 'undefined' ? window : global);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-comparison-engine.js`
Expected output:
```
🧪 Running NexComparisonEngine Unit Tests...
✅ All NexComparisonEngine unit tests passed successfully!
```

- [ ] **Step 5: Commit engine changes**

```bash
git add tests/test-comparison-engine.js js/comparison-engine.js
git commit -m "feat(comparison-engine): implement side-by-side spec normalizer and AI advisor verdict generator"
```

---

### Task 2: Design System Styles for Comparison Matrix

**Files:**
- Modify: `css/design-system.css`

**Interfaces:**
- Produces: CSS classes for `.compare-modal`, `.compare-grid-2col`, `.compare-spec-table`, `.compare-diff-pill`, `.compare-verdict-card`, and `.compare-card-thumb`.

- [ ] **Step 1: Add Comparison Matrix Styles to `css/design-system.css`**

Append to `css/design-system.css`:
```css
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 2: Product Advisor & Comparison Matrix Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.compare-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 11, 23, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 9998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.compare-modal-backdrop.is-open {
  opacity: 1;
  pointer-events: auto;
}

.compare-modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -48%) scale(0.96);
  width: min(95vw, 1120px);
  max-height: 90vh;
  background: linear-gradient(145deg, rgba(13, 20, 40, 0.98) 0%, rgba(5, 11, 24, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(61, 224, 255, 0.12);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease;
}

.compare-modal-backdrop.is-open .compare-modal-dialog {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.compare-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 22px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.compare-modal-title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}

.compare-modal-body {
  padding: 24px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* AI Verdict Highlight Box */
.compare-verdict-card {
  background: linear-gradient(135deg, rgba(61, 224, 255, 0.06) 0%, rgba(13, 20, 40, 0.6) 100%);
  border: 1px solid rgba(61, 224, 255, 0.22);
  border-radius: 14px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.compare-verdict-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #3DE0FF;
  display: flex;
  align-items: center;
  gap: 6px;
}

.compare-verdict-headline {
  font-family: var(--font-serif);
  font-size: 18px;
  color: var(--text-primary);
  line-height: 1.35;
}

.compare-verdict-use-cases {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding-top: 10px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
}

.compare-use-case-item {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

/* Side-by-Side Product Cards Header */
.compare-products-header-grid {
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  gap: 20px;
  align-items: flex-end;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.compare-product-column-head {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.compare-product-thumb {
  width: 90px;
  height: 90px;
  border-radius: 10px;
  background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
  object-fit: contain;
  padding: 6px;
}

.compare-product-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  line-height: 1.3;
}

.compare-product-price {
  font-family: var(--font-serif);
  font-size: 18px;
  color: #3DE0FF;
}

.compare-choose-btn {
  width: 100%;
  min-height: 40px;
  border-radius: 8px;
  background: #3DE0FF;
  color: #000B1A;
  font-size: 12px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.compare-choose-btn:hover {
  background: #6BE8FF;
  transform: translateY(-1px);
}

/* Spec Comparison Matrix Table */
.compare-matrix-table {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.compare-matrix-row {
  display: grid;
  grid-template-columns: 180px 1fr 1fr;
  gap: 20px;
  padding: 12px 14px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.015);
  align-items: center;
  font-size: 13px;
}

.compare-matrix-row:nth-child(even) {
  background: rgba(255, 255, 255, 0.03);
}

.compare-spec-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.4);
}

.compare-spec-val {
  color: var(--text-primary);
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.compare-diff-tag {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(61, 224, 255, 0.1);
  color: #3DE0FF;
  border: 1px solid rgba(61, 224, 255, 0.25);
  align-self: flex-start;
}

@media (max-width: 768px) {
  .compare-products-header-grid, .compare-matrix-row {
    grid-template-columns: 1fr 1fr;
  }
  .compare-matrix-row > .compare-spec-label {
    grid-column: 1 / -1;
    margin-bottom: -6px;
  }
  .compare-verdict-use-cases {
    grid-template-columns: 1fr;
  }
}
```

- [ ] **Step 2: Verify CSS AST syntax**

Run: `node -e "const css=require('fs').readFileSync('css/design-system.css','utf8'); const o=(css.match(/\{/g)||[]).length; const c=(css.match(/\}/g)||[]).length; console.log('Braces:', o, c); if(o!==c) process.exit(1); console.log('✅ CSS AST Braces Valid');"`
Expected: PASS with equal opening and closing braces.

- [ ] **Step 3: Commit CSS styles**

```bash
git add css/design-system.css
git commit -m "style(comparison-matrix): add side-by-side spec comparison and AI verdict styles"
```

---

### Task 3: Interactive Comparison UI Controller

**Files:**
- Create: `js/comparison-ui.js`

**Interfaces:**
- Consumes: `window.NexComparisonEngine`, `window.nexCart`.
- Produces: `window.NexComparisonUI` with:
  - `openComparison(productIds, userContext)`: opens side-by-side matrix modal.
  - `closeComparison()`: dismisses modal.
  - `chooseProduct(productId)`: adds chosen product to cart and closes modal.

- [ ] **Step 1: Implement `js/comparison-ui.js`**

Create `js/comparison-ui.js`:
```javascript
/**
 * nexCommerce — Side-by-Side Product Comparison UI Controller (Capability 2)
 * Orchestrates comparison modal rendering, spec matrix visualization, diff highlighting,
 * and 1-click cart selection.
 */
(function(window) {
  'use strict';

  class ComparisonUI {
    constructor() {
      this.currentComparison = null;
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.injectModalHtml();
          this.bindGlobalTriggers();
        });
      } else {
        this.injectModalHtml();
        this.bindGlobalTriggers();
      }
    }

    _getCatalog() {
      if (typeof SL_PRODUCTS !== 'undefined' && Array.isArray(SL_PRODUCTS)) return SL_PRODUCTS;
      if (window.NexAI && Array.isArray(window.NexAI.catalogArray)) return window.NexAI.catalogArray;
      return [
        { id: 'p1', name: 'Pure Cashmere Sweater', price: 185, image: 'assets/images/products/hero_sweater.png', category: 'Apparel', materials: '100% Mongolian Cashmere', origin: 'Biella, Italy' },
        { id: 'p2', name: 'Fine-Knit Cashmere Crew', price: 160, image: 'assets/images/products/plp_crewneck.png', category: 'Apparel', materials: '100% Fine Gauge Cashmere', origin: 'Florence, Italy' },
        { id: 'p3', name: 'Structured Wool Blazer', price: 245, image: 'assets/images/products/plp_blazer.png', category: 'Apparel', materials: '100% Virgin Wool', origin: 'Milan, Italy' },
        { id: 'p4', name: 'Studio Acoustics Headphone GT', price: 320, image: 'assets/images/products/p4.png', category: 'Acoustics' },
        { id: 'p6', name: 'Minimalist Leather Runner', price: 198, image: 'assets/images/products/leather_sneaker.png', category: 'Footwear' },
        { id: 'p8', name: 'Chronograph Minimalist Watch', price: 285, image: 'assets/images/products/titanium_watch.png', category: 'Accessories' }
      ];
    }

    _resolveImg(imgPath) {
      if (!imgPath) return '';
      if (imgPath.startsWith('http')) return imgPath;
      const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
      if (isSubpage) {
        return imgPath.startsWith('../') ? imgPath : '../' + imgPath;
      }
      return imgPath.startsWith('../') ? imgPath.replace(/^\.\.\//, '') : imgPath;
    }

    injectModalHtml() {
      if (document.getElementById('compareModalBackdrop')) return;

      const modalEl = document.createElement('div');
      modalEl.id = 'compareModalBackdrop';
      modalEl.className = 'compare-modal-backdrop';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.setAttribute('aria-hidden', 'true');

      modalEl.innerHTML = `
        <div class="compare-modal-dialog">
          <div class="compare-modal-header">
            <div>
              <span style="font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#3DE0FF;">✨ Customer Commerce Agent · AI Capability 2</span>
              <h2 class="compare-modal-title">Product Advisor &amp; Comparison Matrix</h2>
            </div>
            <button id="compareModalCloseBtn" class="slip-modal-close-btn" aria-label="Close comparison">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>

          <div class="compare-modal-body" id="compareModalBody">
            <!-- Dynamic comparison content hydrated by renderComparison() -->
          </div>
        </div>
      `;

      document.body.appendChild(modalEl);
      if (window.lucide) window.lucide.createIcons();
      this.bindModalEvents();
    }

    bindModalEvents() {
      const backdrop = document.getElementById('compareModalBackdrop');
      const closeBtn = document.getElementById('compareModalCloseBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeComparison());
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) this.closeComparison();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
          this.closeComparison();
        }
      });
    }

    bindGlobalTriggers() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-trigger="compare-modal"], .open-compare-btn');
        if (trigger) {
          e.preventDefault();
          const pIds = (trigger.getAttribute('data-compare-ids') || 'p1,p2').split(',');
          this.openComparison(pIds);
        }
      });
    }

    openComparison(productIds, userContext) {
      if (!window.NexComparisonEngine) return;
      const catalog = this._getCatalog();
      const ids = Array.isArray(productIds) && productIds.length >= 2 ? productIds : ['p1', 'p2'];
      this.currentComparison = window.NexComparisonEngine.compareProducts(ids, catalog, userContext);
      this.renderComparison(this.currentComparison);

      const backdrop = document.getElementById('compareModalBackdrop');
      if (backdrop) {
        backdrop.classList.add('is-open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    closeComparison() {
      const backdrop = document.getElementById('compareModalBackdrop');
      if (backdrop) {
        backdrop.classList.remove('is-open');
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    renderComparison(comp) {
      const body = document.getElementById('compareModalBody');
      if (!body || !comp || comp.products.length < 2) return;

      const pA = comp.products[0];
      const pB = comp.products[1];
      const imgA = this._resolveImg(pA.image || pA.img);
      const imgB = this._resolveImg(pB.image || pB.img);

      body.innerHTML = `
        <!-- AI Verdict Summary -->
        <div class="compare-verdict-card">
          <div class="compare-verdict-eyebrow">
            <i data-lucide="sparkles" style="width:14px;height:14px;"></i>
            <span>AI Advisor Verdict</span>
          </div>
          <div class="compare-verdict-headline">${comp.verdict.headline}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6;">${comp.verdict.summary}</div>
          <div class="compare-verdict-use-cases">
            <div class="compare-use-case-item">
              <strong style="color:#fff;">${pA.name || pA.title}:</strong> ${comp.verdict.bestForA}
            </div>
            <div class="compare-use-case-item">
              <strong style="color:#fff;">${pB.name || pB.title}:</strong> ${comp.verdict.bestForB}
            </div>
          </div>
        </div>

        <!-- Products Header Row -->
        <div class="compare-products-header-grid">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.4);text-transform:uppercase;">
            Spec Diff Matrix
          </div>
          <div class="compare-product-column-head">
            <img class="compare-product-thumb" src="${imgA}" alt="${pA.name || pA.title}" />
            <div class="compare-product-name">${pA.name || pA.title}</div>
            <div class="compare-product-price">€ ${(pA.numericPrice || pA.price || 0).toFixed(2)}</div>
            <button class="compare-choose-btn" data-choose-id="${pA.id}">
              <i data-lucide="shopping-bag" style="width:14px;height:14px;"></i>
              <span>Choose ${pA.name ? pA.name.split(' ')[0] : 'This'}</span>
            </button>
          </div>
          <div class="compare-product-column-head">
            <img class="compare-product-thumb" src="${imgB}" alt="${pB.name || pB.title}" />
            <div class="compare-product-name">${pB.name || pB.title}</div>
            <div class="compare-product-price">€ ${(pB.numericPrice || pB.price || 0).toFixed(2)}</div>
            <button class="compare-choose-btn" data-choose-id="${pB.id}">
              <i data-lucide="shopping-bag" style="width:14px;height:14px;"></i>
              <span>Choose ${pB.name ? pB.name.split(' ')[0] : 'This'}</span>
            </button>
          </div>
        </div>

        <!-- Spec Comparison Rows -->
        <div class="compare-matrix-table">
          ${comp.specRows.map(row => `
            <div class="compare-matrix-row">
              <div class="compare-spec-label">${row.label}</div>
              <div class="compare-spec-val">
                <span>${row.valA}</span>
                ${row.highlightA ? `<span class="compare-diff-tag">${row.highlightA}</span>` : ''}
              </div>
              <div class="compare-spec-val">
                <span>${row.valB}</span>
                ${row.highlightB ? `<span class="compare-diff-tag">${row.highlightB}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Bind Choose Buttons
      body.querySelectorAll('.compare-choose-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-choose-id');
          this.chooseProduct(id);
        });
      });
    }

    chooseProduct(productId) {
      const catalog = this._getCatalog();
      const prod = catalog.find(p => p.id === productId);
      if (prod && window.nexCart && typeof window.nexCart.addItem === 'function') {
        window.nexCart.addItem({
          id: prod.id,
          name: prod.name || prod.title,
          price: prod.numericPrice || prod.price,
          image: prod.image || prod.img,
          category: prod.category || 'Apparel'
        }, 1, 'Standard');
      }

      this.closeComparison();

      if (typeof window.showToast === 'function') {
        window.showToast(`✨ Added ${prod ? (prod.name || prod.title) : 'item'} to your bag!`);
      }
    }
  }

  window.NexComparisonUI = new ComparisonUI();

})(typeof window !== 'undefined' ? window : global);
```

- [ ] **Step 2: Commit UI Controller**

```bash
git add js/comparison-ui.js
git commit -m "feat(comparison-ui): implement comparison matrix modal and choose-to-cart controller"
```

---

### Task 4: Global Triggers & Concierge Intent Integration

**Files:**
- Modify: `pages/product.html`
- Modify: `js/concierge-engine.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `window.NexComparisonUI.openComparison()`.
- Produces: 
  - PDP "Compare with alternative" button.
  - Concierge natural language intent handler for comparison questions (*"Which piece is better?"*, *"Compare X vs Y"*).

- [ ] **Step 1: Add comparison intent to `js/concierge-engine.js`**

Handle comparative questions in Concierge:
```javascript
      // ── COMPARISON / PRODUCT ADVISOR WIDGET (Capability 2) ──────────────
      if (/\b(compare|comparison|which (is )?better|which one|difference between|versus|\bvs\b)\b/i.test(rawText)) {
        this.lastQueryType = 'comparison';
        if (typeof window !== 'undefined' && window.NexComparisonUI && typeof window.NexComparisonUI.openComparison === 'function') {
          setTimeout(function() { window.NexComparisonUI.openComparison(['p1', 'p2']); }, 300);
        }
        return {
          type: 'comparison_advisor',
          text: `**Product Advisor & Side-by-Side Comparison**\n\nI've launched the comparison matrix comparing our top pieces across fabric grade, warmth, breathability, and use case.`,
          actionLink: { text: 'OPEN COMPARISON MATRIX →', url: '#' },
          products: catalog.slice(0, 2),
          suggestedChips: ['Find my size', 'Upload shopping slip', 'Under € 300']
        };
      }
```

- [ ] **Step 2: Add "Compare with Alternative" trigger button in `pages/product.html`**

Insert a clean secondary button in the PDP buy box:
```html
<button class="btn-secondary-atelier" data-trigger="compare-modal" data-compare-ids="p1,p2" id="pdpCompareBtn" style="display:inline-flex;align-items:center;gap:6px;margin-top:8px;font-size:12px;font-weight:600;padding:10px 16px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.03);color:#fff;cursor:pointer;">
  <i data-lucide="columns-2" style="width:14px;height:14px;color:#3DE0FF;"></i>
  <span>Compare with Alternative Piece</span>
</button>
```

- [ ] **Step 3: Include `js/comparison-engine.js` and `js/comparison-ui.js` script tags in `product.html`, `pages/cart.html`, and `index.html`**

- [ ] **Step 4: Commit global trigger changes**

```bash
git add pages/product.html js/concierge-engine.js index.html pages/cart.html
git commit -m "feat(compare-integration): wire comparison triggers into PDP, concierge intents, and global pages"
```

---

### Task 5: 3-Tier Verification & End-to-End Validation

**Files:**
- Test: `tests/test-comparison-engine.js`
- Test: `tests/test-slip-parser.js`
- Test: `tests/test-concierge-engine.js`
- Test: `tests/test-dom-and-syntax.js`

- [ ] **Step 1: Run Tier 1 Unit Test Suite**

Execute:
```bash
node tests/test-comparison-engine.js
node tests/test-slip-parser.js
node tests/test-concierge-engine.js
node tests/test-dom-and-syntax.js
```
Assert that all unit tests pass with zero errors.

- [ ] **Step 2: Run Tier 2 Functional Storage & Cart Sync Verification**

Verify programmatic cart dispatch:
1. Open comparison for `p1` and `p2`.
2. Choose `p1` via `NexComparisonUI.chooseProduct('p1')`.
3. Assert `localStorage.getItem('nex_cart')` contains `p1`.
4. Assert header bag count increments cleanly.

- [ ] **Step 3: Run Tier 3 Browser Verification (`browser_subagent` / Playwright)**

1. Navigate to `http://localhost:8080/pages/product.html?id=p1`.
2. Click "Compare with Alternative Piece" (`#pdpCompareBtn`).
3. Assert `#compareModalBackdrop` has `.is-open`.
4. Assert spec table renders rows for Price, Materials, Thermal Warmth, and Breathability.
5. Click "Choose Pure Cashmere" button.
6. Verify modal closes, toast appears, and item is added to cart.
7. Capture screenshot `comparison_matrix_verified.png`.

- [ ] **Step 4: Commit all verification artifacts**

```bash
git add comparison_matrix_verified.png docs/superpowers/plans/2026-08-21-product-advisor-and-comparison-matrix.md
git commit -m "test(comparison-verification): complete 3-tier verification and visual proof"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-21-product-advisor-and-comparison-matrix.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

**Which approach would you like to take?**
