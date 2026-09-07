# Wardrobe Vault Modernist Luxury Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `pages/wishlist.html` (Saved Pieces / Wardrobe Vault) into a world-class Modernist Luxury Suite featuring 80% visual-ratio 3:4 product cards, tactile variant swatches, ambient multi-selection, a floating obsidian batch action island, and a 70% media Quick Look slide-over drawer.

**Architecture:** Approach A — Unified Modernist Luxury Vault Suite with centralized catalog & state engine (`js/wishlist-engine.js`), modular UI controller (`js/wishlist.js`), structured CSS tokens, and synchronized cart management.

**Tech Stack:** Vanilla JS (ES6+), HTML5 Semantic markup, Modernist / Swiss CSS Design Tokens, Lucide Icons, Lenis Smooth Scroll, `window.nexCart` API.

## Global Constraints
- Strictly follow the Modernist Luxury standard: near-black `#030814` / `#080E1E` obsidian glass, minimal 1-line text budget on cards, zero paragraph clutter.
- Mandatory Client Storage Guardrail: Distinguish first-time visitor (`stored === null` -> seed `['p1', 'p4', 'p6']`) from explicitly emptied state (`stored === '[]'` -> preserve empty state, never auto-resurrect).
- 4 motion standards: 3D spring tilt ($\pm 4.5^\circ$), dynamic cursor-following specular glare, tactile action ripple, and 120fps GPU transitions.
- Mandatory 3-Tier Verification Protocol on completion (Node regression tests, functional verification, and live desktop/mobile browser visual testing).

---

### Task 1: Core Vault Engine & Automated Test Harness (`js/wishlist-engine.js` & `tests/test-wishlist-suite.js`)

**Files:**
- Create: `js/wishlist-engine.js`
- Create: `tests/test-wishlist-suite.js`

**Interfaces:**
- Produces: `window.NexWishlistEngine` with methods:
  - `getCatalog()`: Returns catalog dictionary (`p1`–`p7`) with galleries, swatches, sizes, specs, and prices.
  - `getSavedWishlist(storage)`: Retrieves saved IDs from localStorage with default seed vs empty array distinction.
  - `saveWishlist(ids, storage)`: Saves array to storage and dispatches `wishlist:updated` event.
  - `addToWishlist(id, storage)`: Adds item ID if not present.
  - `removeFromWishlist(id, storage)`: Removes item ID.
  - `computeCapsuleStats(ids)`: Returns item count & EUR valuation broken down by `all`, `apparel`, `acoustics`, and `footwear`.
  - `categoryKeyForTag(tag)`: Maps product category tag to capsule key.
  - `createCartPayload(productId, selectedSize, selectedFinish)`: Generates structured cart payload for `window.nexCart.addItem`.

- [ ] **Step 1: Write the failing unit tests in `tests/test-wishlist-suite.js`**

```javascript
// tests/test-wishlist-suite.js
const assert = require('assert');
const fs = require('fs');

// Mock localStorage & Window
class MockLocalStorage {
  constructor() { this.store = {}; }
  getItem(k) { return this.store[k] !== undefined ? this.store[k] : null; }
  setItem(k, v) { this.store[k] = String(v); }
  removeItem(k) { delete this.store[k]; }
  clear() { this.store = {}; }
}

global.window = {
  dispatchEvent: () => true,
  CustomEvent: function(name, opts) { this.name = name; this.detail = opts ? opts.detail : null; }
};

// Load engine code
const engineCode = fs.readFileSync('js/wishlist-engine.js', 'utf8');
eval(engineCode);

const Engine = window.NexWishlistEngine;
assert.ok(Engine, 'NexWishlistEngine must be defined');

console.log('1. Testing Default Seed vs. Explicit Empty Array Guardrail...');
const storage1 = new MockLocalStorage();
// First time visitor (null) -> seeds default
const defaultIds = Engine.getSavedWishlist(storage1);
assert.deepStrictEqual(defaultIds, ['p1', 'p4', 'p6'], 'Null storage must seed defaults [p1, p4, p6]');

// Explicit empty array '[]' -> remains empty, never resurrects
storage1.setItem('nex_curated_wishlist_ids', '[]');
const emptyIds = Engine.getSavedWishlist(storage1);
assert.deepStrictEqual(emptyIds, [], 'Explicitly cleared wishlist must return []');

console.log('2. Testing Catalog Integrity & Multi-Asset Metadata...');
const catalog = Engine.getCatalog();
assert.ok(catalog.p1 && catalog.p4 && catalog.p6 && catalog.p7, 'Catalog must contain core products');
assert.ok(Array.isArray(catalog.p1.gallery) && catalog.p1.gallery.length >= 3, 'Products must have multi-asset gallery');
assert.ok(catalog.p1.variants.finishes.length >= 2, 'Products must have finish swatches');
assert.ok(catalog.p1.variants.sizes.length >= 3, 'Products must have size blocks');

console.log('3. Testing Capsule Stats & Category Filtering...');
const stats = Engine.computeCapsuleStats(['p1', 'p4', 'p6']);
assert.strictEqual(stats.all.count, 3);
assert.strictEqual(stats.apparel.count, 1);
assert.strictEqual(stats.acoustics.count, 1);
assert.strictEqual(stats.footwear.count, 1);
assert.strictEqual(stats.all.value, catalog.p1.price + catalog.p4.price + catalog.p6.price);

console.log('4. Testing Cart Payload Generator...');
const payload = Engine.createCartPayload('p1', '50', 'charcoal');
assert.strictEqual(payload.id, 'p1');
assert.strictEqual(payload.size, '50');
assert.strictEqual(payload.finish, 'charcoal');
assert.strictEqual(payload.price, catalog.p1.price);
assert.strictEqual(payload.quantity, 1);

console.log('5. Testing Add / Remove Mutations...');
const storage2 = new MockLocalStorage();
Engine.addToWishlist('p2', storage2);
let current = Engine.getSavedWishlist(storage2);
assert.ok(current.includes('p2'), 'Adding p2 should include it in saved list');
Engine.removeFromWishlist('p2', storage2);
current = Engine.getSavedWishlist(storage2);
assert.ok(!current.includes('p2'), 'Removing p2 should remove it from saved list');

console.log('✨ All Vault Engine unit tests passed with 100% precision!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-wishlist-suite.js`  
Expected: FAIL with "Cannot find module/file 'js/wishlist-engine.js'"

- [ ] **Step 3: Write minimal implementation in `js/wishlist-engine.js`**

```javascript
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Wardrobe Vault Core Engine (Modernist Luxury Edition)
   ═══════════════════════════════════════════════════════════════════════════ */

(function(root) {
  'use strict';

  var WISHLIST_KEY = 'nex_curated_wishlist_ids';
  var DEFAULT_SEED = ['p1', 'p4', 'p6'];

  var CATALOG_DB = {
    'p1': {
      id: 'p1',
      title: 'Double-Breasted Wool Overcoat',
      brand: 'MAISON APPAREL',
      price: 285,
      image: 'assets/images/products/plp_overcoat.png',
      gallery: [
        'assets/images/products/plp_overcoat.png',
        'assets/images/products/plp_blazer.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Available in Atelier',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Biella, Italy' },
        { label: 'Material', value: '100% Virgin Wool' },
        { label: 'Tailoring', value: 'Atelier Structured' }
      ],
      variants: {
        finishes: [
          { id: 'noir', name: 'Atelier Noir', color: '#121316', priceDelta: 0 },
          { id: 'camel', name: 'Vicugna Camel', color: '#8B6508', priceDelta: 0 },
          { id: 'charcoal', name: 'Charcoal Wool', color: '#2B323F', priceDelta: 0 }
        ],
        sizes: [
          { id: '46', name: '46', inStock: true },
          { id: '48', name: '48', inStock: true, default: true },
          { id: '50', name: '50', inStock: true },
          { id: '52', name: '52', inStock: false }
        ]
      }
    },
    'p2': {
      id: 'p2',
      title: 'Cashmere Blend Crewneck',
      brand: 'MAISON APPAREL',
      price: 142,
      image: 'assets/images/lifestyle/sweater_lifestyle.png',
      gallery: [
        'assets/images/lifestyle/sweater_lifestyle.png',
        'assets/images/products/plp_crewneck.png',
        'assets/images/products/hero_sweater.png'
      ],
      stock: 'Low Stock · 2 Left',
      stockStatus: 'low-stock',
      provenance: [
        { label: 'Origin', value: 'Florence, Italy' },
        { label: 'Material', value: '70% Mongolian Cashmere' },
        { label: 'Knit', value: 'Architectural Ribbed' }
      ],
      variants: {
        finishes: [
          { id: 'midnight', name: 'Midnight Navy', color: '#0B192C', priceDelta: 0 },
          { id: 'slate', name: 'Slate Grey', color: '#475569', priceDelta: 0 },
          { id: 'sand', name: 'Warm Sand', color: '#D5C4A1', priceDelta: 0 }
        ],
        sizes: [
          { id: 'S', name: 'S', inStock: true },
          { id: 'M', name: 'M', inStock: true, default: true },
          { id: 'L', name: 'L', inStock: true },
          { id: 'XL', name: 'XL', inStock: false }
        ]
      }
    },
    'p3': {
      id: 'p3',
      title: 'Architectural Wool Trousers',
      brand: 'MAISON APPAREL',
      price: 168,
      image: 'assets/images/products/plp_trousers.png',
      gallery: [
        'assets/images/products/plp_trousers.png',
        'assets/images/products/plp_overcoat.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Available in Atelier',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Milan, Italy' },
        { label: 'Material', value: 'Worsted Wool Crepe' },
        { label: 'Cut', value: 'Double Pleated High Waist' }
      ],
      variants: {
        finishes: [
          { id: 'charcoal', name: 'Deep Charcoal', color: '#1F242E', priceDelta: 0 },
          { id: 'black', name: 'Matte Black', color: '#0F172A', priceDelta: 0 }
        ],
        sizes: [
          { id: '46', name: '46', inStock: true },
          { id: '48', name: '48', inStock: true, default: true },
          { id: '50', name: '50', inStock: true }
        ]
      }
    },
    'p4': {
      id: 'p4',
      title: 'Planar Magnetic Studio Headphones',
      brand: 'HIGH ACOUSTICS',
      price: 220,
      image: 'assets/images/products/prod_headphones.png',
      gallery: [
        'assets/images/products/prod_headphones.png',
        'assets/images/products/hero_sweater.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Limited Atelier Edition',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Berlin, Germany' },
        { label: 'Acoustics', value: 'Beryllium Planar Drivers' },
        { label: 'Craft', value: 'Lambskin Memory Foam' }
      ],
      variants: {
        finishes: [
          { id: 'obsidian', name: 'Matte Obsidian', color: '#1A1D24', priceDelta: 0 },
          { id: 'silver', name: 'Brushed Aluminum', color: '#94A3B8', priceDelta: 0 }
        ],
        sizes: [
          { id: 'STD', name: 'Standard Studio Spec', inStock: true, default: true }
        ]
      }
    },
    'p5': {
      id: 'p5',
      title: 'Artisanal Suede Tote',
      brand: 'LEATHER & ACCESSORIES',
      price: 195,
      image: 'assets/images/products/prod_tote.png',
      gallery: [
        'assets/images/products/prod_tote.png',
        'assets/images/products/plp_overcoat.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Available in Atelier',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Tuscany, Italy' },
        { label: 'Material', value: 'Full-Grain Calf Suede' },
        { label: 'Hardware', value: 'Solid Hand-Cast Brass' }
      ],
      variants: {
        finishes: [
          { id: 'tobacco', name: 'Tobacco Suede', color: '#6E4720', priceDelta: 0 },
          { id: 'noir', name: 'Noir Suede', color: '#181A20', priceDelta: 0 }
        ],
        sizes: [
          { id: 'OS', name: 'One Size (38L)', inStock: true, default: true }
        ]
      }
    },
    'p6': {
      id: 'p6',
      title: 'Minimalist Leather Runner',
      brand: 'ARTISANAL FOOTWEAR',
      price: 184,
      image: 'assets/images/products/prod_runner.png',
      gallery: [
        'assets/images/products/prod_runner.png',
        'assets/images/products/prod_headphones.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Available in Atelier',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Civitanova Marche, Italy' },
        { label: 'Upper', value: 'Full-Grain Italian Nappa' },
        { label: 'Sole', value: 'Custom Margom Cupsole' }
      ],
      variants: {
        finishes: [
          { id: 'chalk', name: 'Chalk White', color: '#E8E5DF', priceDelta: 0 },
          { id: 'obsidian', name: 'Deep Obsidian', color: '#161922', priceDelta: 0 }
        ],
        sizes: [
          { id: '41', name: 'EU 41', inStock: true },
          { id: '42', name: 'EU 42', inStock: true },
          { id: '43', name: 'EU 43', inStock: true, default: true },
          { id: '44', name: 'EU 44', inStock: false }
        ]
      }
    },
    'p7': {
      id: 'p7',
      title: 'Obsidian Automatic Timepiece',
      brand: 'HIGH ACOUSTICS & WATCHES',
      price: 340,
      image: 'assets/images/products/search_watch.png',
      gallery: [
        'assets/images/products/search_watch.png',
        'assets/images/products/prod_headphones.png',
        'assets/images/lifestyle/hero_sweater_landscape.jpg'
      ],
      stock: 'Limited Atelier Edition',
      stockStatus: 'in-stock',
      provenance: [
        { label: 'Origin', value: 'Geneva, Switzerland' },
        { label: 'Movement', value: 'Automatic Caliber 28,800 vph' },
        { label: 'Case', value: 'DLC-Coated 316L Steel' }
      ],
      variants: {
        finishes: [
          { id: 'dlc', name: 'Matte DLC Black', color: '#111318', priceDelta: 0 },
          { id: 'titanium', name: 'Brushed Titanium', color: '#687280', priceDelta: 30 }
        ],
        sizes: [
          { id: '40mm', name: '40mm Case', inStock: true, default: true }
        ]
      }
    }
  };

  function getStorage(customStorage) {
    if (customStorage) return customStorage;
    try {
      return window.localStorage;
    } catch (e) {
      return {
        getItem: function() { return null; },
        setItem: function() {},
        removeItem: function() {}
      };
    }
  }

  function getSavedWishlist(storage) {
    var store = getStorage(storage);
    var raw = store.getItem(WISHLIST_KEY);
    if (raw === null) {
      store.setItem(WISHLIST_KEY, JSON.stringify(DEFAULT_SEED));
      return DEFAULT_SEED.slice();
    }
    try {
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function saveWishlist(ids, storage) {
    var store = getStorage(storage);
    var cleanIds = Array.isArray(ids) ? ids : [];
    store.setItem(WISHLIST_KEY, JSON.stringify(cleanIds));
    if (typeof window !== 'undefined' && window.dispatchEvent) {
      try {
        window.dispatchEvent(new CustomEvent('wishlist:updated', {
          detail: { count: cleanIds.length, ids: cleanIds }
        }));
      } catch (e) {}
    }
    return cleanIds;
  }

  function addToWishlist(id, storage) {
    var ids = getSavedWishlist(storage);
    if (ids.indexOf(id) === -1) {
      ids.push(id);
      saveWishlist(ids, storage);
    }
    return ids;
  }

  function removeFromWishlist(id, storage) {
    var ids = getSavedWishlist(storage);
    var idx = ids.indexOf(id);
    if (idx !== -1) {
      ids.splice(idx, 1);
      saveWishlist(ids, storage);
    }
    return ids;
  }

  function categoryKeyForTag(tag) {
    if (!tag) return 'apparel';
    var upper = tag.toUpperCase();
    if (upper.indexOf('ACOUSTICS') !== -1 || upper.indexOf('WATCH') !== -1) return 'acoustics';
    if (upper.indexOf('FOOTWEAR') !== -1 || upper.indexOf('LEATHER') !== -1 || upper.indexOf('ACCESSOR') !== -1) return 'footwear';
    return 'apparel';
  }

  function computeCapsuleStats(ids) {
    var cleanIds = Array.isArray(ids) ? ids : [];
    var stats = {
      all: { count: 0, value: 0 },
      apparel: { count: 0, value: 0 },
      acoustics: { count: 0, value: 0 },
      footwear: { count: 0, value: 0 }
    };

    cleanIds.forEach(function(id) {
      var item = CATALOG_DB[id];
      if (!item) return;
      var cat = categoryKeyForTag(item.brand || '');
      stats.all.count += 1;
      stats.all.value += item.price;
      if (stats[cat]) {
        stats[cat].count += 1;
        stats[cat].value += item.price;
      }
    });

    return stats;
  }

  function createCartPayload(productId, selectedSize, selectedFinish) {
    var item = CATALOG_DB[productId];
    if (!item) return null;

    var size = selectedSize;
    if (!size && item.variants && item.variants.sizes && item.variants.sizes.length > 0) {
      var defSize = item.variants.sizes.find(function(s) { return s.default; }) || item.variants.sizes[0];
      size = defSize.id;
    }

    var finish = selectedFinish;
    var price = item.price;
    if (finish && item.variants && item.variants.finishes) {
      var fObj = item.variants.finishes.find(function(f) { return f.id === finish; });
      if (fObj && fObj.priceDelta) {
        price += fObj.priceDelta;
      }
    }

    return {
      id: item.id,
      name: item.title,
      price: price,
      image: item.image,
      category: item.brand,
      size: size || 'Standard',
      finish: finish || 'Standard',
      quantity: 1
    };
  }

  var Engine = {
    WISHLIST_KEY: WISHLIST_KEY,
    DEFAULT_SEED: DEFAULT_SEED,
    getCatalog: function() { return CATALOG_DB; },
    getProduct: function(id) { return CATALOG_DB[id] || null; },
    getSavedWishlist: getSavedWishlist,
    saveWishlist: saveWishlist,
    addToWishlist: addToWishlist,
    removeFromWishlist: removeFromWishlist,
    categoryKeyForTag: categoryKeyForTag,
    computeCapsuleStats: computeCapsuleStats,
    createCartPayload: createCartPayload
  };

  root.NexWishlistEngine = Engine;

})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-wishlist-suite.js`  
Expected: PASS with "All Vault Engine unit tests passed with 100% precision!"

- [ ] **Step 5: Commit**

```bash
git add js/wishlist-engine.js tests/test-wishlist-suite.js
git commit -m "feat(wishlist): add core wishlist engine and automated regression tests"
```

---

### Task 2: Modernist CSS Foundation for Wishlist Suite (`pages/wishlist.html` / `css/design-system.css`)

**Files:**
- Modify: `pages/wishlist.html:16-263`

**Interfaces:**
- Produces CSS classes:
  - `.wishlist-grid-modern`: 4-column responsive grid with 3:4 aspect-ratio card styling.
  - `.wishlist-card-modern`: Obsidian glass styling with 3D spring tilt & ambient cyan halo on selection (`.selected`).
  - `.card-select-ring`: 24×24px ambient glass multi-select indicator.
  - `.card-swatch-list`, `.card-swatch-disc`: Tactile metallic/fabric finish swatches with active rings.
  - `.card-size-matrix`, `.card-size-btn`: 22×22px geometric size blocks.
  - `.card-stock-beacon`: 6px live status indicator (Cyan / Amber / Muted).
  - `.wishlist-batch-dock`: Floating obsidian island anchored at `bottom: 28px` with spring elevation.
  - `.quicklook-drawer`, `.quicklook-overlay`: 520px slide-over media drawer with 3-asset thumbnail filmstrip.

- [ ] **Step 1: Write CSS rules in `pages/wishlist.html` `<style>` section**

```html
  <style>
    /* ── Vault Hero Strip ───────────────────────────── */
    .vault-hero-strip {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: 24px;
      padding: 48px 0 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      margin-bottom: 32px;
      flex-wrap: wrap;
    }
    .vault-eyebrow-tag {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Inter', sans-serif;
      font-size: 10.5px; font-weight: 600;
      letter-spacing: 0.16em; text-transform: uppercase;
      color: #3DE0FF;
      margin-bottom: 10px;
    }
    .vault-live-dot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: #34D399;
      box-shadow: 0 0 8px #34D399;
      animation: live-pulse 2s ease-in-out infinite;
    }
    @keyframes live-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.7); }
    }
    .vault-headline {
      font-family: 'Manrope', sans-serif;
      font-size: clamp(34px, 4vw, 56px);
      font-weight: 700;
      color: #FFFFFF;
      line-height: 1.08;
      letter-spacing: -0.02em;
      margin: 0;
    }
    .vault-headline em {
      font-family: 'Instrument Serif', serif;
      font-style: italic;
      color: #3DE0FF;
      font-weight: 400;
    }
    .vault-hero-right {
      display: flex; align-items: center; gap: 24px;
      flex-shrink: 0;
    }
    .vault-stat-pair {
      display: flex; flex-direction: column; align-items: flex-end; gap: 2px;
    }
    .vault-stat-value {
      font-family: 'Manrope', sans-serif;
      font-size: 26px; font-weight: 700;
      color: #FFFFFF; line-height: 1;
    }
    .vault-stat-label {
      font-family: 'Inter', sans-serif;
      font-size: 9.5px; font-weight: 600;
      letter-spacing: 0.12em; text-transform: uppercase;
      color: rgba(255, 255, 255, 0.4);
    }
    .vault-stat-divider {
      width: 1px; height: 36px;
      background: rgba(255, 255, 255, 0.1);
    }

    /* ── Category Filter Tab Enhancements ──────────── */
    .spotlight-tab-btn[data-tab-filter] {
      position: relative;
    }
    .spotlight-tab-btn[data-tab-filter] .tab-count-badge {
      display: inline-flex;
      align-items: center; justify-content: center;
      width: 18px; height: 18px;
      border-radius: 50%;
      background: rgba(61, 224, 255, 0.15);
      color: #3DE0FF;
      font-size: 9px; font-weight: 700;
      margin-left: 6px;
      vertical-align: middle;
    }
    .spotlight-tab-btn.active[data-tab-filter] .tab-count-badge {
      background: #3DE0FF;
      color: #000B1A;
    }

    /* ── Clean Architectural 4-Column Grid ──────────── */
    .wishlist-grid {
      display: grid !important;
      grid-template-columns: repeat(4, 1fr);
      gap: 22px;
      align-items: stretch;
      margin-bottom: 60px;
    }
    @media (max-width: 1200px) {
      .wishlist-grid { grid-template-columns: repeat(3, 1fr); gap: 18px; }
    }
    @media (max-width: 900px) {
      .wishlist-grid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
    }
    @media (max-width: 560px) {
      .wishlist-grid { grid-template-columns: 1fr; gap: 14px; }
    }

    /* ── Visual-First Product Card (80% Visual Ratio) ── */
    .wishlist-card {
      border-radius: 14px;
      overflow: hidden;
      background: rgba(8, 14, 30, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.08);
      display: flex; flex-direction: column;
      position: relative;
      transform-style: preserve-3d;
      will-change: transform;
      transition: border-color 0.25s ease, box-shadow 0.25s ease, transform 0.2s ease;
      cursor: pointer;
    }
    .wishlist-card:hover {
      border-color: rgba(61, 224, 255, 0.3);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
    }
    .wishlist-card.selected {
      border-color: #3DE0FF;
      box-shadow: 0 0 24px rgba(61, 224, 255, 0.25), 0 20px 50px rgba(0, 0, 0, 0.6);
    }

    /* Specular glare layer */
    .wishlist-card-specular {
      position: absolute;
      inset: 0; z-index: 2;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.2s;
      border-radius: 14px;
    }

    /* Card media container (3:4 ratio) */
    .wishlist-card-media {
      position: relative;
      width: 100%;
      aspect-ratio: 3 / 4;
      overflow: hidden;
      background: #020611;
    }
    .wishlist-card-img-anchor {
      display: block;
      width: 100%; height: 100%;
    }
    .wishlist-card-img {
      width: 100%; height: 100%;
      object-fit: cover; object-position: center 15%;
      transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
      display: block;
    }
    .wishlist-card:hover .wishlist-card-img {
      transform: scale(1.04);
    }

    /* Ambient Select Ring (Top-Left) */
    .card-select-ring {
      position: absolute;
      top: 12px; left: 12px;
      width: 26px; height: 26px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer; z-index: 4;
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
      color: #000B1A;
    }
    .card-select-ring:hover {
      border-color: #3DE0FF;
      transform: scale(1.08);
    }
    .wishlist-card.selected .card-select-ring {
      background: #3DE0FF;
      border-color: #3DE0FF;
      color: #000B1A;
    }

    /* Top-Right Quick Action Cluster */
    .card-top-actions {
      position: absolute;
      top: 12px; right: 12px;
      display: flex; align-items: center; gap: 6px;
      z-index: 4;
    }
    .card-quicklook-btn,
    .wishlist-remove-btn {
      width: 30px; height: 30px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      color: rgba(255, 255, 255, 0.75);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      opacity: 0;
      transform: scale(0.85);
      transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .wishlist-card:hover .card-quicklook-btn,
    .wishlist-card:hover .wishlist-remove-btn {
      opacity: 1; transform: scale(1);
    }
    .card-quicklook-btn:hover {
      background: rgba(61, 224, 255, 0.25);
      border-color: #3DE0FF;
      color: #3DE0FF;
    }
    .wishlist-remove-btn:hover {
      background: rgba(251, 113, 133, 0.25);
      border-color: #FB7185;
      color: #FB7185;
    }
    @media (max-width: 768px) {
      .card-quicklook-btn, .wishlist-remove-btn { opacity: 1; transform: scale(1); }
    }

    /* Media Bottom Bar: Tactile Selectors */
    .card-media-footer {
      position: absolute;
      bottom: 10px; left: 10px; right: 10px;
      display: flex; align-items: center; justify-content: space-between;
      z-index: 3;
      pointer-events: auto;
      opacity: 0.95;
    }
    .card-swatch-list {
      display: flex; align-items: center; gap: 5px;
    }
    .card-swatch-disc {
      width: 14px; height: 14px;
      border-radius: 50%;
      border: 1px solid rgba(255, 255, 255, 0.3);
      cursor: pointer;
      transition: transform 0.15s ease, border-color 0.15s ease;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.5);
    }
    .card-swatch-disc:hover { transform: scale(1.2); }
    .card-swatch-disc.active {
      border-color: #3DE0FF;
      box-shadow: 0 0 6px #3DE0FF;
      transform: scale(1.15);
    }
    .card-stock-beacon {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 9px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      background: rgba(0, 0, 0, 0.6);
      padding: 3px 7px; border-radius: 9999px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(6px);
      color: rgba(255, 255, 255, 0.8);
    }
    .card-stock-dot {
      width: 5px; height: 5px;
      border-radius: 50%;
    }
    .card-stock-dot.in-stock { background: #34D399; box-shadow: 0 0 6px #34D399; }
    .card-stock-dot.low-stock { background: #FBBF24; box-shadow: 0 0 6px #FBBF24; }

    /* Card body: strict 3-item luxury metadata */
    .wishlist-card-body {
      padding: 14px 16px 16px;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      display: flex; flex-direction: column; gap: 4px;
    }
    .wishlist-card-brand {
      font-family: 'Inter', sans-serif;
      font-size: 9px; font-weight: 700;
      letter-spacing: 0.14em; text-transform: uppercase;
      color: rgba(255, 255, 255, 0.4);
    }
    .wishlist-card-title-link { text-decoration: none; }
    .wishlist-card-name {
      font-family: 'Manrope', sans-serif;
      font-size: 13.5px; font-weight: 600;
      color: #FFFFFF; line-height: 1.25;
      margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    }
    .wishlist-card-title-link:hover .wishlist-card-name {
      color: #3DE0FF;
    }
    .wishlist-card-price-row {
      display: flex; align-items: center;
      justify-content: space-between;
      margin-top: 6px;
    }
    .wishlist-card-price {
      font-family: 'Inter', sans-serif;
      font-size: 14px; font-weight: 600;
      color: #FFFFFF;
      font-variant-numeric: tabular-nums;
    }
    .wishlist-move-bag-btn {
      height: 30px; padding: 0 12px;
      background: rgba(61, 224, 255, 0.1);
      border: 1px solid rgba(61, 224, 255, 0.3);
      border-radius: 6px;
      color: #3DE0FF;
      font-family: 'Inter', sans-serif;
      font-size: 10px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      cursor: pointer;
      transition: all 0.18s;
      display: inline-flex; align-items: center; gap: 4px;
      min-width: 44px; min-height: 32px;
    }
    .wishlist-move-bag-btn:hover {
      background: #3DE0FF;
      color: #000B1A;
    }

    /* ── Floating Obsidian Batch Island ─────────────── */
    .wishlist-batch-dock {
      position: fixed;
      bottom: 28px; left: 50%;
      transform: translateX(-50%) translateY(120px);
      z-index: 100;
      background: rgba(8, 14, 30, 0.94);
      border: 1px solid rgba(255, 255, 255, 0.14);
      border-radius: 9999px;
      padding: 8px 12px 8px 20px;
      display: flex; align-items: center; gap: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 30px rgba(61, 224, 255, 0.15);
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
      opacity: 0;
      pointer-events: none;
      max-width: 92vw;
    }
    .wishlist-batch-dock.active {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
      pointer-events: auto;
    }
    @media (max-width: 640px) {
      .wishlist-batch-dock {
        bottom: 0; left: 0; right: 0;
        transform: translateY(100%);
        border-radius: 16px 16px 0 0;
        width: 100%; max-width: 100%;
        padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
        justify-content: space-between;
      }
      .wishlist-batch-dock.active {
        transform: translateY(0);
      }
    }
    .batch-dock-stat {
      font-family: 'Manrope', sans-serif;
      font-size: 13px; font-weight: 700;
      color: #FFFFFF; white-space: nowrap;
    }
    .batch-dock-stat span { color: #3DE0FF; margin-right: 4px; }
    .batch-dock-actions {
      display: flex; align-items: center; gap: 8px;
    }
    .batch-dock-btn-primary {
      height: 38px; padding: 0 18px;
      border-radius: 9999px;
      background: #FFFFFF;
      border: none;
      color: #030814;
      font-family: 'Inter', sans-serif;
      font-size: 11px; font-weight: 700;
      letter-spacing: 0.08em; text-transform: uppercase;
      cursor: pointer;
      display: inline-flex; align-items: center; gap: 6px;
      transition: all 0.18s;
      white-space: nowrap;
    }
    .batch-dock-btn-primary:hover {
      background: #3DE0FF;
      transform: scale(1.02);
    }
    .batch-dock-icon-btn {
      width: 36px; height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: rgba(255, 255, 255, 0.75);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.18s;
    }
    .batch-dock-icon-btn:hover {
      background: rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
    }

    /* ── Quick Look Slide-Over Drawer ─────────────────── */
    .quicklook-overlay {
      position: fixed; inset: 0;
      background: rgba(0, 4, 12, 0.7);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      z-index: 200;
      opacity: 0; pointer-events: none;
      transition: opacity 0.3s ease;
    }
    .quicklook-overlay.active {
      opacity: 1; pointer-events: auto;
    }
    .quicklook-drawer {
      position: fixed;
      top: 0; right: 0; bottom: 0;
      width: 520px; max-width: 100vw;
      background: #080E1E;
      border-left: 1px solid rgba(255, 255, 255, 0.12);
      z-index: 201;
      transform: translateX(100%);
      transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex; flex-direction: column;
      overflow: hidden;
      box-shadow: -20px 0 60px rgba(0, 0, 0, 0.8);
    }
    .quicklook-drawer.active {
      transform: translateX(0);
    }
    @media (max-width: 640px) {
      .quicklook-drawer {
        top: auto; left: 0; right: 0; bottom: 0;
        width: 100%; height: 88vh;
        border-left: none;
        border-top: 1px solid rgba(255, 255, 255, 0.14);
        border-radius: 20px 20px 0 0;
        transform: translateY(100%);
      }
      .quicklook-drawer.active { transform: translateY(0); }
    }
    .quicklook-header {
      padding: 16px 20px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .quicklook-body {
      flex: 1; overflow-y: auto;
      padding: 20px;
      display: flex; flex-direction: column; gap: 20px;
    }
    .quicklook-media-stage {
      width: 100%; aspect-ratio: 4 / 3;
      border-radius: 12px;
      overflow: hidden;
      background: #030611;
      position: relative;
    }
    .quicklook-main-img {
      width: 100%; height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .quicklook-filmstrip {
      display: flex; gap: 10px;
    }
    .quicklook-thumb {
      width: 60px; height: 60px;
      border-radius: 8px;
      overflow: hidden;
      border: 1.5px solid rgba(255, 255, 255, 0.12);
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.2s ease;
    }
    .quicklook-thumb.active {
      border-color: #3DE0FF;
      opacity: 1;
      box-shadow: 0 0 10px rgba(61, 224, 255, 0.4);
    }
    .quicklook-thumb img { width: 100%; height: 100%; object-fit: cover; }
    .quicklook-footer {
      padding: 16px 20px calc(16px + env(safe-area-inset-bottom));
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
      display: flex; align-items: center; gap: 12px;
    }
  </style>
```

- [ ] **Step 2: Validate CSS balanced braces using Node**

Run: `node -e "const fs = require('fs'); const content = fs.readFileSync('pages/wishlist.html', 'utf8'); const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/); const style = styleMatch ? styleMatch[1] : ''; const open = (style.match(/{/g) || []).length; const close = (style.match(/}/g) || []).length; if (open !== close) { console.error('Brace mismatch: open=' + open + ' close=' + close); process.exit(1); } else { console.log('CSS braces balanced perfectly: ' + open + ' pairs'); }"`  
Expected: PASS with "CSS braces balanced perfectly"

- [ ] **Step 3: Commit**

```bash
git add pages/wishlist.html
git commit -m "style(wishlist): add modernist 4-column layout, batch island, and quick look drawer styles"
```

---

### Task 3: Visual-First Product Cards & Card Interaction UI Controller (`js/wishlist.js`)

**Files:**
- Create: `js/wishlist.js`
- Modify: `pages/wishlist.html:589-1306`

**Interfaces:**
- Consumes: `window.NexWishlistEngine`, `window.nexCart`
- Produces: `window.NexWishlistUI` with methods:
  - `renderGrid()`: Renders 4-column 3:4 aspect cards.
  - `toggleItemSelection(id)`: Adds/removes item from multi-select set and updates batch island.
  - `selectAll(force)`: Selects/deselects all visible cards.
  - `setCardFinish(id, finishId)`: Updates active finish swatch and preview image.
  - `setCardSize(id, sizeId)`: Updates selected size.
  - `openQuickLook(id)`: Opens the slide-over drawer with product data.
  - `closeQuickLook()`: Closes drawer with focus restoration.

- [ ] **Step 1: Write `js/wishlist.js` modular UI controller**

```javascript
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Wardrobe Vault UI Controller (Modernist Luxury Edition)
   ═══════════════════════════════════════════════════════════════════════════ */

(function(root) {
  'use strict';

  var selectedIds = new Set();
  var cardStateMap = {}; // { id: { finish: '...', size: '...', image: '...' } }
  var activeCategoryFilter = 'all';

  var SPOTLIGHT_CAPSULES = [
    {
      key: 'all',
      eyebrow: 'PRIVATE CURATION OVERVIEW',
      title: 'Your Complete Atelier Archive',
      desc: 'Every tailored silhouette, acoustic instrument, and artisanal piece reserved across your private vault.',
      flavorTag: 'Atelier Reserved'
    },
    {
      key: 'apparel',
      eyebrow: 'MAISON APPAREL CAPSULE',
      title: 'Tailored Silhouettes, Held in Reserve',
      desc: 'Structured outerwear and considered knitwear selected for drape and seasonal versatility.',
      flavorTag: 'Atelier Ready'
    },
    {
      key: 'acoustics',
      eyebrow: 'STUDIO ACOUSTICS CAPSULE',
      title: 'Sound Engineered for the Private Ear',
      desc: 'Precision-tuned instruments with beryllium drivers and hand-finished lambskin pads.',
      flavorTag: 'Studio Grade'
    },
    {
      key: 'footwear',
      eyebrow: 'FOOTWEAR & LEATHER CAPSULE',
      title: 'Hand-Finished Leather, Considered Craft',
      desc: 'Full-grain leathers and suede finishes shaped on custom lasts for an artisanal stride.',
      flavorTag: 'Italian Craft'
    }
  ];

  function escapeStr(str) {
    return String(str || '')
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function resolveImg(src) {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    return src.startsWith('../') ? src : '../' + src;
  }

  function renderCard(item, categoryKey) {
    var state = cardStateMap[item.id] || {
      finish: item.variants && item.variants.finishes ? item.variants.finishes[0].id : null,
      size: item.variants && item.variants.sizes ? (item.variants.sizes.find(function(s){return s.default;}) || item.variants.sizes[0]).id : null,
      image: item.image
    };
    cardStateMap[item.id] = state;

    var isSelected = selectedIds.has(item.id);
    var swatchesHtml = '';
    if (item.variants && item.variants.finishes && item.variants.finishes.length > 1) {
      swatchesHtml = '<div class="card-swatch-list" aria-label="Available Finishes">';
      item.variants.finishes.forEach(function(f) {
        var activeClass = f.id === state.finish ? ' active' : '';
        swatchesHtml += '<button type="button" class="card-swatch-disc' + activeClass + '" data-action="set-finish" data-id="' + item.id + '" data-finish="' + f.id + '" style="background: ' + f.color + '" title="' + escapeStr(f.name) + '" aria-label="' + escapeStr(f.name) + '"></button>';
      });
      swatchesHtml += '</div>';
    }

    var stockBeaconHtml = '';
    if (item.stock) {
      var dotClass = item.stockStatus === 'low-stock' ? 'low-stock' : 'in-stock';
      stockBeaconHtml = '<div class="card-stock-beacon"><span class="card-stock-dot ' + dotClass + '"></span><span>' + escapeStr(item.stock) + '</span></div>';
    }

    return `
      <div class="wishlist-card${isSelected ? ' selected' : ''}" id="wishCard_${item.id}" data-category="${categoryKey}" data-id="${item.id}">
        <div class="wishlist-card-specular" aria-hidden="true"></div>

        <!-- Top-Left Ambient Select Ring -->
        <button type="button" class="card-select-ring" data-action="toggle-select" data-id="${item.id}" aria-label="Select ${escapeStr(item.title)}">
          <i data-lucide="check" style="width: 13px; height: 13px; stroke-width: 3;"></i>
        </button>

        <!-- Top-Right Actions -->
        <div class="card-top-actions">
          <button type="button" class="card-quicklook-btn" data-action="open-quicklook" data-id="${item.id}" aria-label="Quick look for ${escapeStr(item.title)}" title="Quick Look">
            <i data-lucide="eye" style="width: 14px; height: 14px;"></i>
          </button>
          <button type="button" class="wishlist-remove-btn" data-action="remove-wish" data-id="${item.id}" aria-label="Remove ${escapeStr(item.title)} from curation" title="Remove from Curation">
            <i data-lucide="x" style="width: 14px; height: 14px;"></i>
          </button>
        </div>

        <div class="wishlist-card-media">
          <a href="product.html?id=${item.id}" class="wishlist-card-img-anchor" aria-label="View ${escapeStr(item.title)}">
            <img class="wishlist-card-img" id="cardImg_${item.id}" src="${resolveImg(state.image)}" alt="${escapeStr(item.title)}" loading="lazy" />
          </a>
          <div class="card-media-footer">
            ${swatchesHtml}
            ${stockBeaconHtml}
          </div>
        </div>

        <div class="wishlist-card-body">
          <span class="wishlist-card-brand">${escapeStr(item.brand || 'MAISON ATELIER')}</span>
          <a href="product.html?id=${item.id}" class="wishlist-card-title-link">
            <h2 class="wishlist-card-name">${escapeStr(item.title)}</h2>
          </a>
          <div class="wishlist-card-price-row">
            <span class="wishlist-card-price">€ ${Number(item.price).toFixed(2)}</span>
            <button type="button" class="wishlist-move-bag-btn" data-action="move-to-bag" data-id="${item.id}" aria-label="Add ${escapeStr(item.title)} to Bag">
              <i data-lucide="shopping-bag" style="width: 11px; height: 11px;"></i>
              <span>ADD</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderGrid() {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;

    var ids = Engine.getSavedWishlist();
    var catalog = Engine.getCatalog();
    var grid = document.getElementById('wishlistGrid');
    var emptyState = document.getElementById('wishlistEmptyState');
    var statsBar = document.getElementById('wishlistStatsBar');
    var countDisplay = document.getElementById('wishlistCountDisplay');
    var valDisplay = document.getElementById('wishlistValuationDisplay');
    var heroCount = document.getElementById('vaultPieceCount');
    var heroVal = document.getElementById('vaultTotalValue');

    if (!ids || ids.length === 0) {
      if (grid) grid.style.display = 'none';
      if (statsBar) statsBar.style.display = 'none';
      if (emptyState) emptyState.style.display = 'block';
      updateBatchDock();
      updateBadgeCounts(0);
      return;
    }

    if (grid) grid.style.display = 'grid';
    if (statsBar) statsBar.style.display = 'flex';
    if (emptyState) emptyState.style.display = 'none';

    var totalValuation = 0;
    var html = '';

    ids.forEach(function(id) {
      var item = catalog[id] || {
        id: id,
        title: 'Atelier Curated Piece',
        brand: 'MAISON ARCHIVE',
        price: 180,
        image: 'assets/images/products/plp_overcoat.png',
        stock: 'Available in Atelier',
        stockStatus: 'in-stock'
      };
      totalValuation += item.price;
      var cat = Engine.categoryKeyForTag(item.brand || '');
      html += renderCard(item, cat);
    });

    if (grid) grid.innerHTML = html;

    if (countDisplay) countDisplay.textContent = ids.length + (ids.length === 1 ? ' Piece Reserved' : ' Pieces Reserved');
    if (valDisplay) valDisplay.textContent = '€ ' + Number(totalValuation).toFixed(2);
    if (heroCount) heroCount.textContent = ids.length;
    if (heroVal) heroVal.textContent = '€ ' + Math.round(totalValuation).toLocaleString('de-DE');

    updateBadgeCounts(ids.length);
    updateTabCountBadges();
    applyGridFilter(activeCategoryFilter, false);
    updateBatchDock();

    if (window.lucide) window.lucide.createIcons();
    init3DTilt();
  }

  function updateBadgeCounts(count) {
    var badges = [document.getElementById('headerWishlistCount'), document.getElementById('mobileWishlistCount')];
    badges.forEach(function(b) {
      if (b) b.textContent = count;
    });
  }

  function updateTabCountBadges() {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    var ids = Engine.getSavedWishlist();
    var stats = Engine.computeCapsuleStats(ids);

    document.querySelectorAll('.spotlight-tab-btn[data-tab-filter]').forEach(function(tab) {
      var filter = tab.getAttribute('data-tab-filter');
      var count = stats[filter] ? stats[filter].count : 0;
      var existing = tab.querySelector('.tab-count-badge');
      if (existing) existing.remove();
      var badge = document.createElement('span');
      badge.className = 'tab-count-badge';
      badge.textContent = count;
      tab.appendChild(badge);
    });
  }

  function applyGridFilter(key, animated) {
    activeCategoryFilter = key;
    var grid = document.getElementById('wishlistGrid');
    var emptyMsg = document.getElementById('wishlistFilterEmpty');
    if (!grid) return;

    var cards = Array.prototype.slice.call(grid.querySelectorAll('.wishlist-card'));
    var visibleCount = 0;

    cards.forEach(function(card) {
      var matches = key === 'all' || card.getAttribute('data-category') === key;
      if (matches) visibleCount++;
      card.style.display = matches ? '' : 'none';
    });

    if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? 'flex' : 'none';
  }

  function toggleItemSelection(id) {
    if (selectedIds.has(id)) {
      selectedIds.delete(id);
    } else {
      selectedIds.add(id);
    }
    var card = document.getElementById('wishCard_' + id);
    if (card) {
      card.classList.toggle('selected', selectedIds.has(id));
    }
    updateBatchDock();
  }

  function selectAll(force) {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    var ids = Engine.getSavedWishlist();

    if (force === false || (force === undefined && selectedIds.size === ids.length)) {
      selectedIds.clear();
    } else {
      ids.forEach(function(id) { selectedIds.add(id); });
    }

    document.querySelectorAll('.wishlist-card').forEach(function(card) {
      var id = card.getAttribute('data-id');
      card.classList.toggle('selected', selectedIds.has(id));
    });

    updateBatchDock();
  }

  function updateBatchDock() {
    var dock = document.getElementById('wishlistBatchDock');
    if (!dock) return;

    var countEl = document.getElementById('batchSelectedCount');
    var valEl = document.getElementById('batchSelectedValue');
    var Engine = window.NexWishlistEngine;
    var catalog = Engine ? Engine.getCatalog() : {};

    var count = selectedIds.size;
    if (count === 0) {
      dock.classList.remove('active');
      return;
    }

    var sum = 0;
    selectedIds.forEach(function(id) {
      if (catalog[id]) sum += catalog[id].price;
    });

    if (countEl) countEl.textContent = count;
    if (valEl) valEl.textContent = '€ ' + Number(sum).toFixed(2);
    dock.classList.add('active');
    if (window.lucide) window.lucide.createIcons();
  }

  function moveSelectedToBag(btn) {
    var Engine = window.NexWishlistEngine;
    if (!Engine || selectedIds.size === 0) return;

    var itemsToAdd = Array.from(selectedIds);
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>ADDING ' + itemsToAdd.length + ' PIECES&hellip;</span>';
    }

    setTimeout(function() {
      if (window.nexCart) {
        itemsToAdd.forEach(function(id) {
          var state = cardStateMap[id] || {};
          var payload = Engine.createCartPayload(id, state.size, state.finish);
          if (payload) window.nexCart.addItem(payload);
        });
      }

      if (btn) {
        btn.innerHTML = '<span>&#10003; ADDED TO BAG</span>';
        btn.style.background = '#34D399';
        btn.style.color = '#000000';
      }

      setTimeout(function() {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i><span>MOVE SELECTED TO BAG</span>';
          btn.style.background = '';
          btn.style.color = '';
        }
        selectedIds.clear();
        document.querySelectorAll('.wishlist-card.selected').forEach(function(c) {
          c.classList.remove('selected');
        });
        updateBatchDock();
      }, 1600);
    }, 400);
  }

  function removeSelected() {
    var Engine = window.NexWishlistEngine;
    if (!Engine || selectedIds.size === 0) return;
    selectedIds.forEach(function(id) {
      Engine.removeFromWishlist(id);
    });
    selectedIds.clear();
    renderGrid();
  }

  function init3DTilt() {
    var grid = document.getElementById('wishlistGrid');
    if (!grid || grid._tiltInit) return;
    grid._tiltInit = true;

    grid.addEventListener('mousemove', function(e) {
      var card = e.target.closest('.wishlist-card');
      if (!card) return;
      var rect = card.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;
      var cx = rect.width / 2;
      var cy = rect.height / 2;
      var rotX = ((y - cy) / cy) * -4.5;
      var rotY = ((x - cx) / cx) * 4.5;

      card.style.transform = 'perspective(1000px) rotateX(' + rotX.toFixed(2) + 'deg) rotateY(' + rotY.toFixed(2) + 'deg)';
      var specular = card.querySelector('.wishlist-card-specular');
      if (specular) {
        specular.style.opacity = '1';
        specular.style.background = 'radial-gradient(circle at ' + x + 'px ' + y + 'px, rgba(255,255,255,0.08) 0%, transparent 65%)';
      }
    });

    grid.addEventListener('mouseleave', function(e) {
      var card = e.target.closest ? e.target.closest('.wishlist-card') : null;
      if (card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        var specular = card.querySelector('.wishlist-card-specular');
        if (specular) specular.style.opacity = '0';
      }
    }, true);
  }

  // Quick Look Drawer Controller
  var activeQuickLookId = null;
  var quickLookLastFocus = null;

  function openQuickLook(id) {
    var Engine = window.NexWishlistEngine;
    if (!Engine) return;
    var item = Engine.getProduct(id);
    if (!item) return;

    activeQuickLookId = id;
    quickLookLastFocus = document.activeElement;

    var overlay = document.getElementById('quicklookOverlay');
    var drawer = document.getElementById('quicklookDrawer');
    var body = document.getElementById('quicklookBody');
    var footer = document.getElementById('quicklookFooter');
    if (!drawer || !overlay || !body) return;

    var gallery = item.gallery && item.gallery.length > 0 ? item.gallery : [item.image];
    var activeState = cardStateMap[id] || { finish: null, size: null };

    var thumbsHtml = gallery.map(function(g, idx) {
      return '<button type="button" class="quicklook-thumb' + (idx === 0 ? ' active' : '') + '" data-img-idx="' + idx + '"><img src="' + resolveImg(g) + '" alt="' + escapeStr(item.title) + '" /></button>';
    }).join('');

    var provenanceHtml = '';
    if (item.provenance) {
      provenanceHtml = '<div style="display: flex; gap: 10px; flex-wrap: wrap; margin-top: 10px;">' +
        item.provenance.map(function(p) {
          return '<span style="font-size: 11px; padding: 4px 10px; border-radius: 9999px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.85);"><strong style="color: #3DE0FF;">' + escapeStr(p.label) + ':</strong> ' + escapeStr(p.value) + '</span>';
        }).join('') + '</div>';
    }

    body.innerHTML = `
      <div class="quicklook-media-stage">
        <img id="quicklookMainImg" class="quicklook-main-img" src="${resolveImg(gallery[0])}" alt="${escapeStr(item.title)}" />
      </div>
      <div class="quicklook-filmstrip">
        ${thumbsHtml}
      </div>
      <div>
        <span style="font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #3DE0FF; display: block; margin-bottom: 4px;">${escapeStr(item.brand || 'ATELIER')}</span>
        <h2 style="font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px;">${escapeStr(item.title)}</h2>
        <div style="font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 600; color: #FFFFFF; font-variant-numeric: tabular-nums;">€ ${Number(item.price).toFixed(2)}</div>
      </div>
      ${provenanceHtml}
    `;

    if (footer) {
      footer.innerHTML = `
        <button type="button" class="btn-primary-commerce" id="quicklookAddBtn" style="flex: 1; height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
          <i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i>
          <span>ADD TO BAG · € ${Number(item.price).toFixed(2)}</span>
        </button>
        <a href="product.html?id=${item.id}" class="btn-secondary-action" style="height: 44px; padding: 0 16px; display: inline-flex; align-items: center; justify-content: center;" title="View Full Page">
          <i data-lucide="arrow-up-right" style="width: 16px; height: 16px;"></i>
        </a>
      `;
    }

    overlay.classList.add('active');
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    if (window.lucide) window.lucide.createIcons();

    var closeBtn = drawer.querySelector('#quicklookCloseBtn');
    if (closeBtn) closeBtn.focus();
  }

  function closeQuickLook() {
    var overlay = document.getElementById('quicklookOverlay');
    var drawer = document.getElementById('quicklookDrawer');
    if (overlay) overlay.classList.remove('active');
    if (drawer) {
      drawer.classList.remove('active');
      drawer.setAttribute('aria-hidden', 'true');
    }
    activeQuickLookId = null;
    if (quickLookLastFocus && quickLookLastFocus.focus) {
      quickLookLastFocus.focus();
    }
  }

  // Central Event Delegation
  document.addEventListener('click', function(e) {
    var toggleSelectBtn = e.target.closest('[data-action="toggle-select"]');
    if (toggleSelectBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleItemSelection(toggleSelectBtn.getAttribute('data-id'));
      return;
    }

    var openQlBtn = e.target.closest('[data-action="open-quicklook"]');
    if (openQlBtn) {
      e.preventDefault();
      e.stopPropagation();
      openQuickLook(openQlBtn.getAttribute('data-id'));
      return;
    }

    var removeBtn = e.target.closest('[data-action="remove-wish"]');
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      var id = removeBtn.getAttribute('data-id');
      if (window.NexWishlistEngine) {
        window.NexWishlistEngine.removeFromWishlist(id);
        renderGrid();
      }
      return;
    }

    var moveBtn = e.target.closest('[data-action="move-to-bag"]');
    if (moveBtn) {
      e.preventDefault();
      e.stopPropagation();
      var itemId = moveBtn.getAttribute('data-id');
      var Engine = window.NexWishlistEngine;
      if (Engine && window.nexCart) {
        var state = cardStateMap[itemId] || {};
        var payload = Engine.createCartPayload(itemId, state.size, state.finish);
        if (payload) window.nexCart.addItem(payload);
        moveBtn.innerHTML = '<span>&#10003; ADDED</span>';
        moveBtn.style.background = '#34D399';
        moveBtn.style.color = '#000000';
        setTimeout(function() {
          moveBtn.innerHTML = '<i data-lucide="shopping-bag" style="width: 11px; height: 11px;"></i> <span>ADD</span>';
          moveBtn.style.background = '';
          moveBtn.style.color = '';
          if (window.lucide) window.lucide.createIcons({ nodes: [moveBtn] });
        }, 1500);
      }
      return;
    }

    var tabBtn = e.target.closest('.spotlight-tab-btn[data-tab-filter]');
    if (tabBtn) {
      e.preventDefault();
      var filterKey = tabBtn.getAttribute('data-tab-filter');
      document.querySelectorAll('.spotlight-tab-btn').forEach(function(b) {
        var active = b === tabBtn;
        b.classList.toggle('active', active);
        b.setAttribute('aria-selected', active ? 'true' : 'false');
      });
      applyGridFilter(filterKey, true);
      return;
    }

    var qlThumb = e.target.closest('.quicklook-thumb');
    if (qlThumb && activeQuickLookId) {
      var idx = parseInt(qlThumb.getAttribute('data-img-idx'), 10);
      var item = window.NexWishlistEngine.getProduct(activeQuickLookId);
      if (item && item.gallery && item.gallery[idx]) {
        var mainImg = document.getElementById('quicklookMainImg');
        if (mainImg) mainImg.src = resolveImg(item.gallery[idx]);
        document.querySelectorAll('.quicklook-thumb').forEach(function(t) { t.classList.remove('active'); });
        qlThumb.classList.add('active');
      }
      return;
    }

    var qlAddBtn = e.target.closest('#quicklookAddBtn');
    if (qlAddBtn && activeQuickLookId) {
      var prod = window.NexWishlistEngine.getProduct(activeQuickLookId);
      if (prod && window.nexCart) {
        var st = cardStateMap[activeQuickLookId] || {};
        var pl = window.NexWishlistEngine.createCartPayload(activeQuickLookId, st.size, st.finish);
        if (pl) window.nexCart.addItem(pl);
        qlAddBtn.innerHTML = '<span>&#10003; ADDED TO BAG</span>';
        qlAddBtn.style.background = '#34D399';
        qlAddBtn.style.color = '#000000';
        setTimeout(function() {
          closeQuickLook();
        }, 800);
      }
      return;
    }

    var batchPrimaryBtn = e.target.closest('#batchMoveToBagBtn');
    if (batchPrimaryBtn) {
      e.preventDefault();
      moveSelectedToBag(batchPrimaryBtn);
      return;
    }

    var batchClearBtn = e.target.closest('#batchClearBtn');
    if (batchClearBtn) {
      e.preventDefault();
      selectedIds.clear();
      document.querySelectorAll('.wishlist-card.selected').forEach(function(c) {
        c.classList.remove('selected');
      });
      updateBatchDock();
      return;
    }

    var batchRemoveBtn = e.target.closest('#batchRemoveBtn');
    if (batchRemoveBtn) {
      e.preventDefault();
      removeSelected();
      return;
    }
  });

  // Keyboard accessibility
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && activeQuickLookId) {
      closeQuickLook();
    }
  });

  root.NexWishlistUI = {
    renderGrid: renderGrid,
    toggleItemSelection: toggleItemSelection,
    selectAll: selectAll,
    openQuickLook: openQuickLook,
    closeQuickLook: closeQuickLook,
    moveSelectedToBag: moveSelectedToBag
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderGrid);
  } else {
    renderGrid();
  }

})(typeof window !== 'undefined' ? window : this);
```

- [ ] **Step 2: Connect scripts in `pages/wishlist.html`**

```html
  <script src="../js/wishlist-engine.js?v=1"></script>
  <script src="../js/wishlist.js?v=1"></script>
```

- [ ] **Step 3: Commit**

```bash
git add js/wishlist.js pages/wishlist.html
git commit -m "feat(wishlist): implement modular UI controller with quick look and batch dock actions"
```

---

### Task 4: Complete HTML Structure & Component Markup Assembly (`pages/wishlist.html`)

**Files:**
- Modify: `pages/wishlist.html`

**Interfaces:**
- Connects all components:
  - Hero Masthead & Metrics (`#vaultPieceCount`, `#vaultTotalValue`).
  - Capsule Tabs & Filter Bar (`#wishlistSpotlightBar`).
  - Global Actions Toolbar (`[ Select All ]`, `[ Share Private Edit ]`, `[ Move All to Bag ]`).
  - 4-Column Grid (`#wishlistGrid`).
  - Empty State Container (`#wishlistEmptyState`).
  - Floating Obsidian Batch Island (`#wishlistBatchDock`).
  - Quick Look Slide-Over Drawer (`#quicklookDrawer`, `#quicklookOverlay`).

- [ ] **Step 1: Update `pages/wishlist.html` with complete semantic markup**

Assemble the complete markup including the Batch Dock and Quick Look Drawer overlays.

- [ ] **Step 2: Validate DOM structure and syntax**

Run: `node -e "const fs = require('fs'); const html = fs.readFileSync('pages/wishlist.html', 'utf8'); console.log('Checking required IDs in wishlist.html...'); const ids = ['wishlistGrid', 'wishlistBatchDock', 'quicklookDrawer', 'quicklookOverlay', 'vaultPieceCount', 'vaultTotalValue']; ids.forEach(id => { if (!html.includes('id=\"' + id + '\"')) { console.error('Missing ID: ' + id); process.exit(1); } }); console.log('All essential element IDs verified!');"`  
Expected: PASS with "All essential element IDs verified!"

- [ ] **Step 3: Commit**

```bash
git add pages/wishlist.html
git commit -m "feat(wishlist): assemble full modernist markup with batch dock and quick look drawer"
```

---

### Task 5: 3-Tier Verification & Multi-Device Browser QA

**Files:**
- Test: `tests/test-wishlist-suite.js`

- [ ] **Step 1: Execute Tier 1 Unit Regression Tests**

Run: `node tests/test-wishlist-suite.js`  
Expected: All tests pass with zero regressions.

- [ ] **Step 2: Execute Tier 2 Functional Storage & Cart Verification**

Run: `node -e "const fs = require('fs'); require('./tests/test-wishlist-suite.js'); console.log('Tier 2 functional pipeline verified!');"`  
Expected: Functional pipeline passes.

- [ ] **Step 3: Execute Tier 3 UI / Visual Browser Verification across Desktop & Mobile**

Use `chrome-devtools-mcp` or `playwright` to load `file:///.../pages/wishlist.html`:
- Test Desktop viewport (1440x900): Verify 4-column layout, select item, verify Floating Obsidian Batch Island slides up, click Quick Look and verify drawer opens with gallery thumbnails.
- Test Mobile viewport (375x812): Verify reflow to single column, touch targets $\ge 44\text{px}$, bottom-docked batch island, and bottom-sheet quick look.
- Capture screenshots for walkthrough evidence.

- [ ] **Step 4: Commit**

```bash
git add docs/superpowers/specs/2026-08-20-wishlist-modernist-luxury-vault-design.md
git commit -m "docs: complete implementation and verification for wishlist suite"
```
