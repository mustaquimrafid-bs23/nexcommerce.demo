# Delivery-Aware Shopping & Hyperlocal Inventory Gate (Capability 6) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a "Delivery-Aware Shopping & Hyperlocal Inventory Gate" agent capability allowing customers to select their postal code / dark store fulfillment hub, filter catalog products by instant same-day express delivery availability, display live delivery cutoff countdown timers, and provide natural language location-aware queries in the Concierge.

**Architecture:** A deterministic Hyperlocal Routing & Delivery Engine (`js/delivery-gate-engine.js`) maps postal codes to dark store hubs, evaluates per-item hyperlocal inventory, calculates express delivery windows and countdown cutoffs. An interactive Location Selector and Delivery Banner UI Controller (`js/delivery-gate-ui.js`) renders a luxury postal selector pill in the header, an express filter chip on catalog pages, and dynamic delivery badges on product cards.

**Tech Stack:** Vanilla JavaScript (ES6+), Modernist CSS design system with amber/cyan indicators, Lucide Icons, Node.js deterministic unit test harness.

## Global Constraints

- Must strictly adhere to the Modernist / Swiss-inspired luxury design system defined in `.agents/rules/modernist-design-system-standards.md` and `.agents/rules/european-luxury-typography-standards.md`.
- All interactive touch targets must be $\ge 44\text{px}$.
- Centralized event handling: no inline HTML `onclick` attributes.
- Must execute the mandatory 3-Tier verification protocol (Unit test suite with zero failures, location persistence and inventory filtering verification, and live browser screenshots across Desktop and Mobile).

---

## File Structure

```
nexcomarch/
├── js/
│   ├── delivery-gate-engine.js   # Dark store hub mapping, postal routing, cutoff countdown, and stock filter
│   ├── delivery-gate-ui.js       # Header location pill, postal selector modal, and PLP express filter chip
│   └── concierge-engine.js       # Natural language hyperlocal delivery intent routing
├── css/
│   └── design-system.css         # Location selector pill, delivery modal, and express stock badges
├── pages/
│   └── discovery.html            # Hyperlocal delivery filter chip and product card badges
└── tests/
    └── test-delivery-gate-engine.js # Unit test harness for postal routing and inventory filtering
```

---

### Task 1: Delivery-Aware & Hyperlocal Inventory Engine

**Files:**
- Create: `tests/test-delivery-gate-engine.js`
- Create: `js/delivery-gate-engine.js`

**Interfaces:**
- Consumes: Postal Code, Catalog Products, Current Timestamp.
- Produces: `window.NexDeliveryEngine` with methods:
  - `getHubForPostal(postalCode)`: resolves dark store hub (Berlin, Paris, London, Amsterdam, Dhaka).
  - `filterExpressAvailable(products, hubId)`: filters products available for 2-hour same-day express delivery from the active hub.
  - `getCutoffCountdown(hubId)`: calculates remaining hours and minutes until same-day delivery dispatch cutoff.
  - `parseDeliveryIntent(queryText)`: detects natural language queries for same-day delivery and postal checks.

- [ ] **Step 1: Write the failing test for the Delivery Gate Engine**

Create `tests/test-delivery-gate-engine.js`:
```javascript
const assert = require('assert');
const fs = require('fs');

global.window = {};
require('../js/delivery-gate-engine.js');

const engine = global.window.NexDeliveryEngine;
assert(engine, 'NexDeliveryEngine should be attached to window');

console.log('🧪 Running NexDeliveryEngine Unit Tests...');

// Test 1: Postal code to dark store hub resolution
const hub1 = engine.getHubForPostal('10115');
assert.strictEqual(hub1.id, 'berlin-mitte', '10115 should map to Berlin Mitte Hub');
assert.strictEqual(hub1.city, 'Berlin');
assert(hub1.expressSupported, 'Berlin Mitte should support express same-day delivery');

const hub2 = engine.getHubForPostal('75003');
assert.strictEqual(hub2.id, 'paris-marais', '75003 should map to Paris Marais Hub');

const hub3 = engine.getHubForPostal('99999'); // Fallback hub
assert(hub3, 'Should provide standard national fulfillment fallback for unknown postal');

// Test 2: Hyperlocal inventory filtering
const mockCatalog = [
  { id: 'p1', name: 'Cashmere Knit', hubs: { 'berlin-mitte': 5, 'paris-marais': 0 } },
  { id: 'p2', name: 'Wool Blazer', hubs: { 'berlin-mitte': 0, 'paris-marais': 3 } },
  { id: 'p3', name: 'Crewneck', hubs: { 'berlin-mitte': 2, 'paris-marais': 4 } }
];

const berlinExpress = engine.filterExpressAvailable(mockCatalog, 'berlin-mitte');
assert.strictEqual(berlinExpress.length, 2, 'Berlin hub should have 2 items available for express');
assert.strictEqual(berlinExpress[0].id, 'p1');
assert.strictEqual(berlinExpress[1].id, 'p3');

const parisExpress = engine.filterExpressAvailable(mockCatalog, 'paris-marais');
assert.strictEqual(parisExpress.length, 2, 'Paris hub should have 2 items available for express');
assert.strictEqual(parisExpress[0].id, 'p2');
assert.strictEqual(parisExpress[1].id, 'p3');

// Test 3: Cutoff countdown timer
const countdown = engine.getCutoffCountdown('berlin-mitte');
assert(typeof countdown.hoursRemaining === 'number');
assert(typeof countdown.minutesRemaining === 'number');
assert(countdown.formattedCountdown.length > 0);

// Test 4: NLP delivery intent parser
const intent1 = engine.parseDeliveryIntent('Can I get shoes delivered today in Berlin?');
assert(intent1.isDeliveryIntent, 'Should detect same-day delivery inquiry');

const intent2 = engine.parseDeliveryIntent('Do you have express 2-hour shipping to 10115?');
assert(intent2.isDeliveryIntent);
assert.strictEqual(intent2.extractedPostal, '10115');

console.log('✅ All NexDeliveryEngine unit tests passed successfully!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-delivery-gate-engine.js`
Expected output: Error: Cannot find module `../js/delivery-gate-engine.js`.

- [ ] **Step 3: Implement `js/delivery-gate-engine.js`**

Create `js/delivery-gate-engine.js`:
```javascript
/**
 * nexCommerce — Delivery-Aware Shopping & Hyperlocal Inventory Gate Engine (Capability 6)
 * Maps postal codes to dark store hubs, evaluates real-time express stock,
 * and calculates same-day dispatch cutoff windows.
 */
(function(window) {
  'use strict';

  const DARK_STORE_HUBS = [
    {
      id: 'berlin-mitte',
      city: 'Berlin',
      region: 'Central & Mitte (10115)',
      postcodes: ['10115', '10117', '10119', '10178', '10435', '10405'],
      expressSupported: true,
      cutoffHour: 18, // 6:00 PM cutoff
      deliveryTimeMin: '45–60 mins',
      courierPartner: 'DHL Express On-Demand'
    },
    {
      id: 'paris-marais',
      city: 'Paris',
      region: 'Le Marais & 1st–4th Arr. (75003)',
      postcodes: ['75001', '75002', '75003', '75004', '75008'],
      expressSupported: true,
      cutoffHour: 19, // 7:00 PM cutoff
      deliveryTimeMin: '60–90 mins',
      courierPartner: 'Chronopost Atelier'
    },
    {
      id: 'london-mayfair',
      city: 'London',
      region: 'Mayfair & West End (W1K)',
      postcodes: ['W1K', 'W1J', 'SW1A', 'EC1A', 'WC2N'],
      expressSupported: true,
      cutoffHour: 18,
      deliveryTimeMin: '45–60 mins',
      courierPartner: 'Quiqup Concierge'
    },
    {
      id: 'amsterdam-center',
      city: 'Amsterdam',
      region: 'Centrum & Grachtengordel (1016)',
      postcodes: ['1012', '1016', '1017', '1071'],
      expressSupported: true,
      cutoffHour: 17,
      deliveryTimeMin: '45–60 mins',
      courierPartner: 'PostNL Express'
    },
    {
      id: 'dhaka-gulshan',
      city: 'Dhaka',
      region: 'Gulshan 2 & Banani (1212)',
      postcodes: ['1212', '1213', '1208'],
      expressSupported: true,
      cutoffHour: 20,
      deliveryTimeMin: '30–45 mins',
      courierPartner: 'Pathao Dark Store Express'
    }
  ];

  const DEFAULT_FALLBACK_HUB = {
    id: 'central-atelier',
    city: 'European Central Atelier',
    region: 'Standard Regional Delivery',
    postcodes: [],
    expressSupported: false,
    cutoffHour: 16,
    deliveryTimeMin: '2–3 business days',
    courierPartner: 'DHL Carbon-Neutral'
  };

  function getHubForPostal(postalCode) {
    if (!postalCode) return DARK_STORE_HUBS[0];
    const cleaned = postalCode.toString().trim().toUpperCase();

    const matched = DARK_STORE_HUBS.find(h => 
      h.postcodes.some(p => cleaned.startsWith(p) || p.startsWith(cleaned))
    );

    return matched || DEFAULT_FALLBACK_HUB;
  }

  function filterExpressAvailable(products, hubId) {
    if (!Array.isArray(products)) return [];
    const activeHub = DARK_STORE_HUBS.find(h => h.id === hubId) || DARK_STORE_HUBS[0];

    return products.filter(item => {
      if (item.hubs && typeof item.hubs[activeHub.id] === 'number') {
        return item.hubs[activeHub.id] > 0;
      }
      // Default fallback stock distribution based on item ID parity
      const idNum = parseInt((item.id || '').replace(/\D/g, ''), 10) || 1;
      if (activeHub.id === 'berlin-mitte') return idNum % 2 !== 0; // Odd IDs in Berlin
      if (activeHub.id === 'paris-marais') return idNum % 2 === 0;  // Even IDs in Paris
      return true;
    });
  }

  function getCutoffCountdown(hubId) {
    const hub = DARK_STORE_HUBS.find(h => h.id === hubId) || DARK_STORE_HUBS[0];
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setHours(hub.cutoffHour, 0, 0, 0);

    let diffMs = cutoff - now;
    if (diffMs < 0) {
      // Past cutoff for today
      return {
        hoursRemaining: 0,
        minutesRemaining: 0,
        formattedCountdown: 'Tomorrow Morning',
        isCutoffPassed: true
      };
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
      hoursRemaining: hours,
      minutesRemaining: minutes,
      formattedCountdown: `${hours}h ${minutes}m`,
      isCutoffPassed: false
    };
  }

  function parseDeliveryIntent(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string') return { isDeliveryIntent: false };
    const q = rawQuery.toLowerCase().trim();

    const isDelivery = /\b(same[- ]day|express|delivery|shipping|dark store|hub|postal|courier|how fast|when will.*arrive|deliver today)\b/i.test(q);
    const postMatch = q.match(/\b(\d{4,5}|[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2})\b/i);

    return {
      isDeliveryIntent: isDelivery,
      extractedPostal: postMatch ? postMatch[1] : null,
      query: q
    };
  }

  window.NexDeliveryEngine = {
    DARK_STORE_HUBS: DARK_STORE_HUBS,
    DEFAULT_FALLBACK_HUB: DEFAULT_FALLBACK_HUB,
    getHubForPostal: getHubForPostal,
    filterExpressAvailable: filterExpressAvailable,
    getCutoffCountdown: getCutoffCountdown,
    parseDeliveryIntent: parseDeliveryIntent
  };

})(typeof window !== 'undefined' ? window : global);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-delivery-gate-engine.js`
Expected output:
```
🧪 Running NexDeliveryEngine Unit Tests...
✅ All NexDeliveryEngine unit tests passed successfully!
```

- [ ] **Step 5: Commit engine changes**

```bash
git add tests/test-delivery-gate-engine.js js/delivery-gate-engine.js
git commit -m "feat(delivery-engine): implement hyperlocal dark store routing and same-day delivery cutoff calculator"
```

---

### Task 2: Design System Styles for Delivery Hub & Postal Selector

**Files:**
- Modify: `css/design-system.css`

**Interfaces:**
- Produces: CSS classes for `.delivery-hub-pill`, `.delivery-modal-backdrop`, `.delivery-hub-card`, and `.delivery-express-tag`.

- [ ] **Step 1: Create helper script `scratch/append-delivery-css.js`**

Create `scratch/append-delivery-css.js`:
```javascript
const fs = require('fs');

const cssBlock = `
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 6: Delivery-Aware & Hyperlocal Gate Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.delivery-hub-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}

.delivery-hub-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(61, 224, 255, 0.4);
  box-shadow: 0 0 16px rgba(61, 224, 255, 0.15);
}

.delivery-express-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 7px;
  border-radius: 100px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.3);
  color: #F59E0B;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.delivery-hub-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(3, 11, 23, 0.85);
  backdrop-filter: blur(12px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.delivery-hub-modal {
  width: 100%;
  max-width: 480px;
  background: linear-gradient(155deg, rgba(13, 20, 40, 0.98) 0%, rgba(5, 10, 24, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.7);
}

.hub-selection-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 280px;
  overflow-y: auto;
}

.hub-card-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  border: 1.5px solid rgba(255, 255, 255, 0.07);
  cursor: pointer;
  transition: all 0.2s ease;
}

.hub-card-item:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(61, 224, 255, 0.3);
}

.hub-card-item.selected {
  background: rgba(61, 224, 255, 0.08);
  border-color: #3DE0FF;
}
`;

fs.appendFileSync('css/design-system.css', '\n' + cssBlock.trim() + '\n');
console.log('Appended delivery CSS successfully!');
```

- [ ] **Step 2: Run `scratch/append-delivery-css.js` and verify AST syntax**

Run: `node scratch/append-delivery-css.js`
Verify: `node -e "const css=require('fs').readFileSync('css/design-system.css','utf8'); const o=(css.match(/\{/g)||[]).length; const c=(css.match(/\}/g)||[]).length; console.log('Braces:', o, c); if(o!==c) process.exit(1); console.log('✅ CSS AST Braces Valid');"`

- [ ] **Step 3: Commit CSS styles**

```bash
git add css/design-system.css
git commit -m "style(delivery-gate): add delivery hub pill, postal selector modal, and express badge styles"
```

---

### Task 3: Interactive Location Selector & Delivery UI Controller

**Files:**
- Create: `js/delivery-gate-ui.js`

**Interfaces:**
- Consumes: `window.NexDeliveryEngine`, `localStorage.getItem('nex_delivery_hub')`.
- Produces: `window.NexDeliveryUI` with:
  - `mountHeaderPill()`: renders delivery location button into site header.
  - `openHubModal()`: opens postal selector dialog.
  - `selectHub(hubId)`: persists active hub, updates header countdown, dispatches `hub-changed` event.

- [ ] **Step 1: Implement `js/delivery-gate-ui.js`**

Create `js/delivery-gate-ui.js`:
```javascript
/**
 * nexCommerce — Delivery-Aware Shopping UI Controller (Capability 6)
 * Orchestrates header location pill, dark store hub modal selector,
 * countdown cutoff timers, and PLP express stock filtering.
 */
(function(window) {
  'use strict';

  class DeliveryGateUI {
    constructor() {
      this.activeHub = null;
      this.init();
    }

    init() {
      this.loadSavedHub();

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.mountHeaderPill();
          this.buildModal();
          this.startCountdownTimer();
        });
      } else {
        this.mountHeaderPill();
        this.buildModal();
        this.startCountdownTimer();
      }
    }

    loadSavedHub() {
      if (!window.NexDeliveryEngine) return;
      const savedId = localStorage.getItem('nex_delivery_hub') || 'berlin-mitte';
      const hub = window.NexDeliveryEngine.DARK_STORE_HUBS.find(h => h.id === savedId);
      this.activeHub = hub || window.NexDeliveryEngine.DARK_STORE_HUBS[0];
    }

    mountHeaderPill() {
      if (!this.activeHub) this.loadSavedHub();
      if (!this.activeHub) return;

      const countdown = window.NexDeliveryEngine.getCutoffCountdown(this.activeHub.id);
      
      let pill = document.getElementById('headerDeliveryHubPill');
      if (!pill) {
        const targetContainer = document.querySelector('.header-actions') || document.querySelector('.site-nav');
        if (!targetContainer) return;

        pill = document.createElement('button');
        pill.id = 'headerDeliveryHubPill';
        pill.className = 'delivery-hub-pill';
        pill.setAttribute('aria-label', 'Change delivery location and dark store hub');
        targetContainer.parentNode.insertBefore(pill, targetContainer);
      }

      pill.innerHTML = `
        <i data-lucide="map-pin" style="width:13px;height:13px;color:#3DE0FF;"></i>
        <span>${this.activeHub.city} (${this.activeHub.postcodes[0] || 'Hub'})</span>
        <span class="delivery-express-badge">⚡ ${countdown.formattedCountdown}</span>
      `;

      if (window.lucide) window.lucide.createIcons();

      pill.onclick = () => this.openHubModal();
    }

    buildModal() {
      let modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) return;

      modal = document.createElement('div');
      modal.id = 'deliveryHubModalOverlay';
      modal.className = 'delivery-hub-modal-overlay';

      const hubs = window.NexDeliveryEngine ? window.NexDeliveryEngine.DARK_STORE_HUBS : [];

      modal.innerHTML = `
        <div class="delivery-hub-modal" role="dialog" aria-modal="true" aria-label="Select Delivery Location">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;">
              <i data-lucide="map-pin" style="width:18px;height:18px;color:#3DE0FF;"></i>
              <h3 style="font-family:var(--font-serif);font-size:20px;color:#fff;margin:0;">Select Delivery Location</h3>
            </div>
            <button id="closeDeliveryModalBtn" style="background:none;border:none;color:rgba(255,255,255,0.4);font-size:20px;cursor:pointer;">&times;</button>
          </div>

          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.4;">
            Choose your nearest Dark Store Atelier for instant 45–60 min courier delivery and local boutique stock availability.
          </div>

          <div class="hub-selection-grid" id="hubSelectionGrid">
            ${hubs.map(h => `
              <div class="hub-card-item ${this.activeHub && this.activeHub.id === h.id ? 'selected' : ''}" data-hub-id="${h.id}">
                <div>
                  <div style="font-size:13px;font-weight:600;color:#fff;">${h.city} &middot; ${h.region}</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.4);">${h.courierPartner} &middot; ${h.deliveryTimeMin}</div>
                </div>
                <div class="delivery-express-badge">⚡ Same-Day</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      if (window.lucide) window.lucide.createIcons();

      modal.querySelector('#closeDeliveryModalBtn').onclick = () => this.closeHubModal();
      modal.onclick = (e) => { if (e.target === modal) this.closeHubModal(); };

      modal.querySelectorAll('.hub-card-item').forEach(card => {
        card.onclick = () => {
          const hubId = card.getAttribute('data-hub-id');
          this.selectHub(hubId);
        };
      });
    }

    openHubModal() {
      const modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    closeHubModal() {
      const modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    selectHub(hubId) {
      if (!window.NexDeliveryEngine) return;
      const hub = window.NexDeliveryEngine.DARK_STORE_HUBS.find(h => h.id === hubId);
      if (!hub) return;

      this.activeHub = hub;
      localStorage.setItem('nex_delivery_hub', hub.id);

      this.mountHeaderPill();
      this.closeHubModal();

      if (typeof window.showToast === 'function') {
        window.showToast(`📍 Switched fulfillment to ${hub.city} (${hub.region})`);
      }

      window.dispatchEvent(new CustomEvent('hub-changed', { detail: { hub: hub } }));
    }

    startCountdownTimer() {
      setInterval(() => {
        this.mountHeaderPill();
      }, 60000); // update every minute
    }
  }

  window.NexDeliveryUI = new DeliveryGateUI();

})(typeof window !== 'undefined' ? window : global);
```

- [ ] **Step 2: Commit UI Controller**

```bash
git add js/delivery-gate-ui.js
git commit -m "feat(delivery-ui): implement header location pill, dark store hub selector modal, and live countdown ticker"
```

---

### Task 4: Global Triggers & Concierge Integration

**Files:**
- Modify: `js/concierge-engine.js`
- Modify: `index.html`
- Modify: `pages/discovery.html`
- Modify: `pages/checkout.html`

**Interfaces:**
- Consumes: `window.NexDeliveryEngine`, `window.NexDeliveryUI`.
- Produces:
  - Header location pill and modal across all pages.
  - Concierge natural language delivery inquiries (*"Can I get same day delivery in Berlin?"*).

- [ ] **Step 1: Add delivery intent to `js/concierge-engine.js`**

Handle same-day delivery questions:
```javascript
      // ── 0E. DELIVERY-AWARE SHOPPING & HYPERLOCAL GATE (Capability 6) ────
      if (/\b(same[- ]day|express delivery|deliver today|how fast|shipping time|courier|dark store|hub)\b/i.test(rawText)) {
        this.lastQueryType = 'delivery';
        const hub = window.NexDeliveryEngine ? window.NexDeliveryEngine.DARK_STORE_HUBS[0] : { city: 'Berlin', region: 'Central Mitte' };
        return {
          type: 'delivery_advisor',
          text: `**Hyperlocal Dark Store & Express Delivery**\n\nWe offer instant **45–60 min Same-Day Delivery** from our **${hub.city} (${hub.region})** fulfillment dark store! Order within the next hours to receive your pieces today.`,
          actionLink: { text: 'CHANGE LOCATION HUB →', url: '#' },
          products: catalog.slice(0, 2),
          suggestedChips: ['Build cart by budget', 'Compare top pieces', 'Upload shopping slip']
        };
      }
```

- [ ] **Step 2: Include `js/delivery-gate-engine.js` and `js/delivery-gate-ui.js` in `index.html`, `pages/discovery.html`, `pages/product.html`, and `pages/checkout.html`**

- [ ] **Step 3: Commit integration changes**

```bash
git add js/concierge-engine.js index.html pages/discovery.html pages/product.html pages/checkout.html
git commit -m "feat(delivery-integration): wire delivery gate into header, catalog, and concierge assistant"
```

---

### Task 5: 3-Tier Verification & End-to-End Validation

**Files:**
- Test: `tests/test-delivery-gate-engine.js`
- Test: `tests/test-checkout-savings-engine.js`
- Test: `tests/test-budget-cart-builder.js`
- Test: `tests/test-comparison-engine.js`
- Test: `tests/test-slip-parser.js`
- Test: `tests/test-concierge-engine.js`
- Test: `tests/test-dom-and-syntax.js`

- [ ] **Step 1: Run Tier 1 Unit Test Suite**

Execute:
```bash
node tests/test-delivery-gate-engine.js
node tests/test-checkout-savings-engine.js
node tests/test-budget-cart-builder.js
node tests/test-comparison-engine.js
node tests/test-slip-parser.js
node tests/test-concierge-engine.js
node tests/test-dom-and-syntax.js
```
Assert that all unit tests pass with zero regressions.

- [ ] **Step 2: Run Tier 2 Functional Storage & Hub Switching**

Verify that clicking a hub card switches `localStorage.getItem('nex_delivery_hub')` to `paris-marais`, updates the header pill badge, and updates the countdown ticker.

- [ ] **Step 3: Run Tier 3 Browser Verification (`browser_subagent` / Playwright)**

1. Navigate to `http://localhost:8080/index.html` (Desktop 1440x900).
2. Verify `#headerDeliveryHubPill` renders with location and live cutoff countdown badge.
3. Click `#headerDeliveryHubPill` to open the Dark Store Hub modal.
4. Select `Paris · Le Marais & 1st–4th Arr. (75003)`.
5. Verify header pill updates to `Paris (75001)` with confirmation toast.
6. Capture screenshot `delivery_hub_verified.png`.
7. Resize to Mobile (375x812), verify layout and capture `delivery_hub_mobile_verified.png`.

- [ ] **Step 4: Commit all verification artifacts**

```bash
git add delivery_hub_verified.png delivery_hub_mobile_verified.png docs/superpowers/plans/2026-08-21-delivery-aware-shopping.md
git commit -m "test(delivery-verification): complete 3-tier verification and visual proof"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-21-delivery-aware-shopping.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

**Which approach would you like to take?**
