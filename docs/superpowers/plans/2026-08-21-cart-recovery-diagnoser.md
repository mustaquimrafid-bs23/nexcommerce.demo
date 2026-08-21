# Cart Recovery & Abandonment Root-Cause Diagnoser (Capability 7) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an intelligent "Cart Recovery & Abandonment Root-Cause Diagnoser" agent capability that detects exit intent when a customer has items in their bag, diagnoses likely abandonment friction points (price sensitivity, shipping barrier, sizing hesitation), formulates a tailored recovery incentive with dynamic reservation timers, provides 1-click instant cart recovery links, and supports conversational cart restoration in the Concierge.

**Architecture:** A deterministic Recovery & Friction Engine (`js/cart-recovery-engine.js`) evaluates cart composition, price points, and exit patterns to diagnose abandonment root causes and generate targeted incentives (`COMEBACK15`, `FREESHIPNOW`, `HOLD15`). An interactive Exit-Intent Recovery Modal Controller (`js/cart-recovery-ui.js`) intercepts mouse exit triggers, renders a luxury split recovery modal with live reservation countdown and 1-click checkout execution.

**Tech Stack:** Vanilla JavaScript (ES6+), Modernist CSS design system with emerald/cyan/amber tokens, Lucide Icons, Node.js deterministic unit test harness.

## Global Constraints

- Must strictly adhere to the Modernist / Swiss-inspired luxury design system defined in `.agents/rules/modernist-design-system-standards.md` and `.agents/rules/european-luxury-typography-standards.md`.
- All interactive touch targets must be $\ge 44\text{px}$.
- Centralized event handling: no inline HTML `onclick` attributes.
- Must execute the mandatory 3-Tier verification protocol (Unit test suite with zero failures, exit-intent triggering, discount coupon auto-injection, and browser verification on Desktop and Mobile).

---

## File Structure

```
nexcomarch/
├── js/
│   ├── cart-recovery-engine.js   # Root-cause diagnoser, incentive generator, and recovery link serializer
│   ├── cart-recovery-ui.js       # Exit-intent listener, recovery modal controller, and reservation timer
│   └── concierge-engine.js       # Conversational cart recovery and restoration intent routing
├── css/
│   └── design-system.css         # Exit-intent recovery modal, reservation timer badge, and recovery card styles
├── pages/
│   ├── cart.html                 # Cart restoration deep link handler
│   └── checkout.html             # Auto-applied recovery coupon support
└── tests/
    └── test-cart-recovery-engine.js # Unit test harness for recovery diagnoser and serializer
```

---

### Task 1: Cart Recovery & Friction Diagnostic Engine

**Files:**
- Create: `tests/test-cart-recovery-engine.js`
- Create: `js/cart-recovery-engine.js`

**Interfaces:**
- Consumes: Cart Items Array, Cart Subtotal, Customer History.
- Produces: `window.NexCartRecoveryEngine` with methods:
  - `diagnoseFriction(cartItems, subtotal)`: identifies primary abandonment reason (`price_threshold`, `shipping_barrier`, `indecision`) and generates the optimal recovery offer.
  - `generateRecoveryPayload(cartItems)`: encodes cart into a compact base64 / URL-safe recovery token for 1-click restoration.
  - `decodeRecoveryPayload(token)`: restores cart items from a recovery token.
  - `parseRecoveryIntent(queryText)`: detects natural language queries for abandoned carts and saved bags.

- [ ] **Step 1: Write the failing test for the Recovery Engine**

Create `tests/test-cart-recovery-engine.js`:
```javascript
const assert = require('assert');
const fs = require('fs');

global.window = {};
require('../js/cart-recovery-engine.js');

const engine = global.window.NexCartRecoveryEngine;
assert(engine, 'NexCartRecoveryEngine should be attached to window');

console.log('🧪 Running NexCartRecoveryEngine Unit Tests...');

// Test 1: High cart subtotal (Price threshold diagnosis -> 15% comeback code)
const cart1 = [
  { id: 'p1', name: 'Cashmere Knit', price: 220, quantity: 1 },
  { id: 'p2', name: 'Wool Blazer', price: 264, quantity: 1 }
];
const diag1 = engine.diagnoseFriction(cart1, 484);
assert.strictEqual(diag1.frictionReason, 'price_threshold');
assert.strictEqual(diag1.incentiveCode, 'COMEBACK15');
assert.strictEqual(diag1.discountPercent, 15);
assert.strictEqual(diag1.reservationMinutes, 15);

// Test 2: Low cart subtotal under free shipping threshold (€120 -> Shipping barrier diagnosis)
const cart2 = [
  { id: 'p6', name: 'Leather Runner', price: 120, quantity: 1 }
];
const diag2 = engine.diagnoseFriction(cart2, 120);
assert.strictEqual(diag2.frictionReason, 'shipping_barrier');
assert.strictEqual(diag2.incentiveCode, 'FREESHIPNOW');

// Test 3: Recovery Token Serialization & Deserialization
const token = engine.generateRecoveryPayload(cart1);
assert(typeof token === 'string' && token.length > 0, 'Should generate encoded recovery token');

const restored = engine.decodeRecoveryPayload(token);
assert.strictEqual(restored.length, 2);
assert.strictEqual(restored[0].id, 'p1');
assert.strictEqual(restored[1].id, 'p2');

// Test 4: NLP recovery intent parser
const intent1 = engine.parseRecoveryIntent('Restore my abandoned cart');
assert(intent1.isRecoveryIntent, 'Should detect cart restoration query');

const intent2 = engine.parseRecoveryIntent('What items did I leave in my bag?');
assert(intent2.isRecoveryIntent);

console.log('✅ All NexCartRecoveryEngine unit tests passed successfully!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-cart-recovery-engine.js`
Expected output: Error: Cannot find module `../js/cart-recovery-engine.js`.

- [ ] **Step 3: Implement `js/cart-recovery-engine.js`**

Create `js/cart-recovery-engine.js`:
```javascript
/**
 * nexCommerce — Cart Recovery & Abandonment Root-Cause Diagnoser Engine (Capability 7)
 * Analyzes basket friction, formulates targeted comeback incentives,
 * generates portable cart recovery tokens, and parses recovery queries.
 */
(function(window) {
  'use strict';

  function diagnoseFriction(cartItems, subtotalAmount) {
    const items = Array.isArray(cartItems) ? cartItems : [];
    const subtotal = typeof subtotalAmount === 'number' ? subtotalAmount : 0;

    if (items.length === 0) {
      return {
        hasCart: false,
        frictionReason: 'empty_cart',
        incentiveCode: 'WELCOME10',
        discountPercent: 10,
        reservationMinutes: 15,
        title: 'Your Atelier Bag is Empty',
        description: 'Explore our latest curated drops and discover luxury statement pieces.'
      };
    }

    // High basket value (>= €200) -> Price threshold friction
    if (subtotal >= 200) {
      const discount = Math.round(subtotal * 0.15);
      return {
        hasCart: true,
        frictionReason: 'price_threshold',
        incentiveCode: 'COMEBACK15',
        discountPercent: 15,
        discountAmount: discount,
        reservationMinutes: 15,
        title: 'Your Atelier Selection is Reserved',
        description: `Complete your order now to unlock an exclusive 15% VIP incentive (−€${discount.toFixed(2)}) and hold your reserved pieces for 15 minutes.`
      };
    }

    // Subtotal under €150 free shipping barrier -> Shipping barrier friction
    if (subtotal < 150) {
      return {
        hasCart: true,
        frictionReason: 'shipping_barrier',
        incentiveCode: 'FREESHIPNOW',
        discountPercent: 0,
        discountAmount: 15,
        reservationMinutes: 15,
        title: 'Complimentary Express Shipping Unlocked',
        description: 'We have waived all shipping costs for your bag. Complete checkout now to claim Free Courier Delivery.'
      };
    }

    // Default hesitation friction
    return {
      hasCart: true,
      frictionReason: 'hesitation',
      incentiveCode: 'COMEBACK10',
      discountPercent: 10,
      discountAmount: Math.round(subtotal * 0.10),
      reservationMinutes: 15,
      title: 'Don’t Miss Out on Your Bag',
      description: 'Your selected pieces are in high demand across European boutiques. We have placed a 15-minute hold on your items.'
    };
  }

  function generateRecoveryPayload(cartItems) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return '';
    const compact = cartItems.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity || i.qty || 1,
      variant: i.variant || i.size || 'Standard',
      image: i.image
    }));

    try {
      const str = JSON.stringify(compact);
      if (typeof btoa === 'function') {
        return btoa(encodeURIComponent(str));
      }
      return Buffer.from(encodeURIComponent(str)).toString('base64');
    } catch(e) {
      return '';
    }
  }

  function decodeRecoveryPayload(token) {
    if (!token || typeof token !== 'string') return [];
    try {
      let decodedStr = '';
      if (typeof atob === 'function') {
        decodedStr = decodeURIComponent(atob(token));
      } else {
        decodedStr = decodeURIComponent(Buffer.from(token, 'base64').toString('utf8'));
      }
      const parsed = JSON.parse(decodedStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) {
      return [];
    }
  }

  function parseRecoveryIntent(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string') return { isRecoveryIntent: false };
    const q = rawQuery.toLowerCase().trim();

    const isRecovery = /\b(recover|restore|abandoned|my bag|my cart|left in (my )?bag|saved bag|resume (my )?order|reorder)\b/i.test(q);
    return {
      isRecoveryIntent: isRecovery,
      query: q
    };
  }

  window.NexCartRecoveryEngine = {
    diagnoseFriction: diagnoseFriction,
    generateRecoveryPayload: generateRecoveryPayload,
    decodeRecoveryPayload: decodeRecoveryPayload,
    parseRecoveryIntent: parseRecoveryIntent
  };

})(typeof window !== 'undefined' ? window : global);
```

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-cart-recovery-engine.js`
Expected output:
```
🧪 Running NexCartRecoveryEngine Unit Tests...
✅ All NexCartRecoveryEngine unit tests passed successfully!
```

- [ ] **Step 5: Commit engine changes**

```bash
git add tests/test-cart-recovery-engine.js js/cart-recovery-engine.js
git commit -m "feat(cart-recovery): implement abandonment friction diagnoser and portable cart recovery serializer"
```

---

### Task 2: Design System Styles for Exit-Intent Recovery Modal

**Files:**
- Modify: `css/design-system.css`

**Interfaces:**
- Produces: CSS classes for `.recovery-modal-overlay`, `.recovery-modal-card`, `.recovery-timer-pill`, and `.recovery-item-thumbnail`.

- [ ] **Step 1: Create helper script `scratch/append-recovery-css.js`**

Create `scratch/append-recovery-css.js`:
```javascript
const fs = require('fs');

const cssBlock = `
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 7: Cart Recovery & Exit-Intent Modal Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.recovery-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(3, 11, 23, 0.88);
  backdrop-filter: blur(14px);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  animation: fadeIn 0.25s ease-out forwards;
}

.recovery-modal-card {
  width: 100%;
  max-width: 520px;
  background: linear-gradient(155deg, rgba(13, 20, 40, 0.99) 0%, rgba(5, 10, 24, 0.99) 100%);
  border: 1px solid rgba(0, 245, 160, 0.35);
  border-radius: 20px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  box-shadow: 0 30px 80px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 245, 160, 0.12);
  position: relative;
}

.recovery-timer-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 100px;
  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);
  color: #F59E0B;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.recovery-items-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 8px 0;
}

.recovery-item-thumb {
  width: 64px;
  height: 80px;
  border-radius: 8px;
  background: radial-gradient(circle at center, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.01) 70%);
  border: 1px solid rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  flex-shrink: 0;
}

.recovery-item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.recovery-action-btn {
  width: 100%;
  padding: 14px 20px;
  border-radius: 10px;
  background: #00F5A0;
  color: #000B1A;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s cubic-bezier(0.23, 1, 0.32, 1);
  box-shadow: 0 8px 24px rgba(0, 245, 160, 0.25);
}

.recovery-action-btn:hover {
  background: #4EFEB3;
  transform: translateY(-1px);
  box-shadow: 0 12px 32px rgba(0, 245, 160, 0.35);
}
`;

fs.appendFileSync('css/design-system.css', '\n' + cssBlock.trim() + '\n');
console.log('Appended recovery CSS successfully!');
```

- [ ] **Step 2: Run `scratch/append-recovery-css.js` and verify AST syntax**

Run: `node scratch/append-recovery-css.js`
Verify: `node -e "const css=require('fs').readFileSync('css/design-system.css','utf8'); const o=(css.match(/\{/g)||[]).length; const c=(css.match(/\}/g)||[]).length; console.log('Braces:', o, c); if(o!==c) process.exit(1); console.log('✅ CSS AST Braces Valid');"`

- [ ] **Step 3: Commit CSS styles**

```bash
git add css/design-system.css
git commit -m "style(cart-recovery): add exit-intent recovery modal, timer badge, and action button styles"
```

---

### Task 3: Interactive Exit-Intent & Recovery UI Controller

**Files:**
- Create: `js/cart-recovery-ui.js`

**Interfaces:**
- Consumes: `window.NexCartRecoveryEngine`, `window.nexCart` / `localStorage.getItem('nex_cart')`.
- Produces: `window.NexCartRecoveryUI` with:
  - `initExitIntent()`: tracks mouse leaving top boundary `clientY <= 10`.
  - `showRecoveryModal()`: opens tailored modal with reservation countdown.
  - `claimIncentiveAndCheckout()`: auto-applies discount code and routes to checkout.
  - `checkDeepLinkRecovery()`: checks for `?recover_cart=...` in URL and restores cart.

- [ ] **Step 1: Implement `js/cart-recovery-ui.js`**

Create `js/cart-recovery-ui.js`:
```javascript
/**
 * nexCommerce — Cart Recovery & Exit-Intent UI Controller (Capability 7)
 * Intercepts user exit intent, opens tailored recovery dialogs with reservation holds,
 * auto-applies comeback incentive codes, and handles deep link cart restoration.
 */
(function(window) {
  'use strict';

  class CartRecoveryUI {
    constructor() {
      this.hasTriggered = false;
      this.timerInterval = null;
      this.secondsRemaining = 900; // 15 minutes
      this.currentDiagnosis = null;
      this.init();
    }

    init() {
      this.checkDeepLinkRecovery();

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.initExitIntent();
        });
      } else {
        this.initExitIntent();
      }
    }

    _getCartItems() {
      try {
        const raw = localStorage.getItem('nex_cart');
        const cart = raw ? JSON.parse(raw) : [];
        return Array.isArray(cart) ? cart : [];
      } catch(e) {
        return [];
      }
    }

    _resolveImg(path) {
      if (!path) return '';
      if (path.startsWith('http') || path.startsWith('data:')) return path;
      const isSubpage = window.location.pathname.includes('/pages/');
      if (isSubpage && !path.startsWith('../') && !path.startsWith('/')) {
        return '../' + path;
      }
      return path;
    }

    initExitIntent() {
      // Exit intent: mouse cursor moving above top border
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 10 && !this.hasTriggered) {
          const cart = this._getCartItems();
          if (cart.length > 0 && !sessionStorage.getItem('nex_recovery_dismissed')) {
            this.showRecoveryModal();
          }
        }
      });
    }

    showRecoveryModal() {
      const cart = this._getCartItems();
      if (cart.length === 0 || !window.NexCartRecoveryEngine) return;

      this.hasTriggered = true;
      const subtotal = cart.reduce((sum, i) => sum + (Number(i.price) * (parseInt(i.quantity || i.qty, 10) || 1)), 0);
      this.currentDiagnosis = window.NexCartRecoveryEngine.diagnoseFriction(cart, subtotal);

      let modal = document.getElementById('cartRecoveryModalOverlay');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cartRecoveryModalOverlay';
        modal.className = 'recovery-modal-overlay';
        document.body.appendChild(modal);
      }

      const diag = this.currentDiagnosis;

      modal.innerHTML = `
        <div class="recovery-modal-card" role="dialog" aria-modal="true" aria-label="Cart Recovery Incentive">
          <button id="closeRecoveryModalBtn" style="position:absolute;top:18px;right:18px;background:none;border:none;color:rgba(255,255,255,0.4);font-size:22px;cursor:pointer;">&times;</button>
          
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div class="recovery-timer-badge">
              <i data-lucide="clock" style="width:13px;height:13px;"></i>
              <span id="recoveryCountdownTimer">14:59 Reservation Hold</span>
            </div>
            <span style="font-size:11px;color:rgba(255,255,255,0.4);font-weight:600;">${cart.length} PIECES RESERVED</span>
          </div>

          <div>
            <h3 style="font-family:var(--font-serif);font-size:22px;color:#fff;margin:0 0 6px 0;">${diag.title}</h3>
            <p style="font-size:12.5px;color:rgba(255,255,255,0.7);line-height:1.45;margin:0;">${diag.description}</p>
          </div>

          <!-- Product Thumbnails Row -->
          <div class="recovery-items-row">
            ${cart.map(item => `
              <div class="recovery-item-thumb" title="${item.name}">
                <img src="${this._resolveImg(item.image)}" alt="${item.name}">
              </div>
            `).join('')}
          </div>

          <button id="btnClaimRecoveryOffer" class="recovery-action-btn">
            <i data-lucide="sparkles" style="width:16px;height:16px;"></i>
            <span>⚡ Claim ${diag.incentiveCode} & Complete Order</span>
          </button>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      const closeBtn = modal.querySelector('#closeRecoveryModalBtn');
      if (closeBtn) {
        closeBtn.onclick = () => this.dismissModal();
      }

      const claimBtn = modal.querySelector('#btnClaimRecoveryOffer');
      if (claimBtn) {
        claimBtn.onclick = () => this.claimIncentiveAndCheckout(diag.incentiveCode);
      }

      this.startTimer();
    }

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.secondsRemaining = 900;

      this.timerInterval = setInterval(() => {
        this.secondsRemaining--;
        if (this.secondsRemaining <= 0) {
          clearInterval(this.timerInterval);
          return;
        }

        const mins = Math.floor(this.secondsRemaining / 60);
        const secs = this.secondsRemaining % 60;
        const timerEl = document.getElementById('recoveryCountdownTimer');
        if (timerEl) {
          timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} Reservation Hold`;
        }
      }, 1000);
    }

    dismissModal() {
      const modal = document.getElementById('cartRecoveryModalOverlay');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
      sessionStorage.setItem('nex_recovery_dismissed', 'true');
      if (this.timerInterval) clearInterval(this.timerInterval);
    }

    claimIncentiveAndCheckout(code) {
      this.dismissModal();
      sessionStorage.setItem('applied_recovery_code', code);

      if (typeof window.showToast === 'function') {
        window.showToast(`✨ Applied comeback incentive code ${code}! Redirecting to checkout…`);
      }

      const isSubpage = window.location.pathname.includes('/pages/');
      const checkoutUrl = isSubpage ? 'checkout.html' : 'pages/checkout.html';
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 400);
    }

    checkDeepLinkRecovery() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('recover_cart');
      if (token && window.NexCartRecoveryEngine) {
        const items = window.NexCartRecoveryEngine.decodeRecoveryPayload(token);
        if (items.length > 0 && window.nexCart && typeof window.nexCart.addItem === 'function') {
          items.forEach(i => window.nexCart.addItem(i, i.quantity || 1, i.variant || 'Standard'));
          if (typeof window.showToast === 'function') {
            window.showToast(`✨ Restored ${items.length} pieces from your saved bag!`);
          }
        }
      }
    }
  }

  window.NexCartRecoveryUI = new CartRecoveryUI();

})(typeof window !== 'undefined' ? window : global);
```

- [ ] **Step 2: Commit UI Controller**

```bash
git add js/cart-recovery-ui.js
git commit -m "feat(cart-recovery-ui): implement exit-intent listener, split recovery dialog, and deep-link cart restorer"
```

---

### Task 4: Global Triggers & Concierge Integration

**Files:**
- Modify: `js/concierge-engine.js`
- Modify: `index.html`
- Modify: `pages/cart.html`
- Modify: `pages/checkout.html`

**Interfaces:**
- Consumes: `window.NexCartRecoveryEngine`, `window.NexCartRecoveryUI`.
- Produces:
  - Natural language intent for cart restoration in Stylist Concierge (*"Restore my abandoned cart"*, *"What did I leave in my bag?"*).
  - Script inclusions across all storefront templates.

- [ ] **Step 1: Add cart recovery intent to `js/concierge-engine.js`**

Handle cart recovery queries:
```javascript
      // ── 0F. CART RECOVERY & ABANDONMENT ASSISTANT (Capability 7) ────────
      if (/\b(recover.*cart|restore.*cart|abandoned.*cart|my bag|items.*in.*bag|resume.*order|saved.*cart)\b/i.test(rawText)) {
        this.lastQueryType = 'cart_recovery';
        const cart = (typeof window !== 'undefined' && window.nexCart) ? (window.nexCart.items || []) : [];
        if (cart.length > 0) {
          if (typeof window !== 'undefined' && window.NexCartRecoveryUI && typeof window.NexCartRecoveryUI.showRecoveryModal === 'function') {
            setTimeout(function() { window.NexCartRecoveryUI.showRecoveryModal(); }, 300);
          }
          return {
            type: 'cart_recovery',
            text: `**Cart Recovery & Reservation Assistant**\n\nYou currently have **${cart.length} pieces reserved** in your bag. I've unlocked your exclusive recovery incentive modal so you can claim your pieces before the hold expires!`,
            actionLink: { text: 'VIEW SHOPPING BAG →', url: 'cart.html' },
            products: cart.slice(0, 2),
            suggestedChips: ['Build cart by budget', 'Compare top pieces', 'Upload shopping slip']
          };
        } else {
          return {
            type: 'cart_recovery',
            text: `**Cart Recovery Assistant**\n\nYour bag is currently clear. Browse our latest arrivals or use our **Budget Cart Builder** to assemble a fresh curated capsule!`,
            actionLink: { text: 'BUILD CART BY BUDGET →', url: '#' },
            products: catalog.slice(0, 3),
            suggestedChips: ['Build cart by budget', 'Compare top pieces', 'Upload shopping slip']
          };
        }
      }
```

- [ ] **Step 2: Include `js/cart-recovery-engine.js` and `js/cart-recovery-ui.js` in `index.html`, `pages/cart.html`, and `pages/checkout.html`**

- [ ] **Step 3: Commit integration changes**

```bash
git add js/concierge-engine.js index.html pages/cart.html pages/checkout.html
git commit -m "feat(recovery-integration): wire cart recovery into concierge intents and storefront templates"
```

---

### Task 5: 3-Tier Verification & End-to-End Validation

**Files:**
- Test: `tests/test-cart-recovery-engine.js`
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
node tests/test-cart-recovery-engine.js
node tests/test-delivery-gate-engine.js
node tests/test-checkout-savings-engine.js
node tests/test-budget-cart-builder.js
node tests/test-comparison-engine.js
node tests/test-slip-parser.js
node tests/test-concierge-engine.js
node tests/test-dom-and-syntax.js
```
Assert that all unit tests pass with zero errors.

- [ ] **Step 2: Run Tier 2 Functional Storage & Recovery Flow**

Verify that calling `NexCartRecoveryUI.showRecoveryModal()` renders reserved pieces and countdown timer, and clicking claim triggers checkout transition.

- [ ] **Step 3: Run Tier 3 Browser Verification (`browser_subagent` / Playwright)**

1. Navigate to `http://localhost:8080/index.html` (Desktop 1440x900).
2. Seed cart with 2 items.
3. Trigger exit intent / `NexCartRecoveryUI.showRecoveryModal()`.
4. Verify the modal opens with countdown timer (`14:59 Reservation Hold`), uncropped product thumbnails, and 1-click **⚡ Claim COMEBACK15 & Complete Order** CTA.
5. Capture screenshot `cart_recovery_verified.png`.
6. Resize to Mobile (375x812), verify layout and capture `cart_recovery_mobile_verified.png`.

- [ ] **Step 4: Commit all verification artifacts**

```bash
git add cart_recovery_verified.png cart_recovery_mobile_verified.png docs/superpowers/plans/2026-08-21-cart-recovery-diagnoser.md
git commit -m "test(recovery-verification): complete 3-tier verification and visual proof"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-21-cart-recovery-diagnoser.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

**Which approach would you like to take?**
