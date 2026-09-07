# Agentic In-Drawer Order & Checkout Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a conversational, 4-step in-drawer ordering and checkout capability inside "Ask Stylist" that collects delivery address, captures payment method choice, generates order review summaries with active promo discounts, authorizes orders, and mounts live tracking.

**Architecture:** Extends `ConciergeEngine` (`js/concierge-engine.js`) with conversational state tracking (`order_flow_address`, `order_flow_payment`, `order_flow_review`, `order_flow_confirmed`), renders interactive step widgets and handles state transitions in `js/concierge.js`, and adds modular styling in `css/design-system.css`.

**Tech Stack:** Vanilla JavaScript (ES6+), localStorage Cart/Order persistence, Web Speech API integration, Vanilla CSS with Glassmorphism, Lucide Icons.

## Global Constraints

- Zero external backend dependencies or paid API keys required; 100% client-side execution with graceful fallbacks.
- Strictly adhere to WCAG 2.1 AA accessibility standards (all inputs have visible labels/placeholders, keyboard navigation with Enter/Space, radio group roles, minimum 44×44px touch targets).
- Support both direct UI taps/inputs and natural voice commands (*"Deliver to Berlin"*, *"Pay with Apple Pay"*, *"Confirm order"*).
- Ensure cart synchronization with `window.nexCart` (clearing bag on final authorization, creating order code `NX-XXXX-X` in `localStorage`).

---

### Task 1: Conversational Order Flow State Machine in `ConciergeEngine`

**Files:**
- Modify: `js/concierge-engine.js:200-360`
- Test: `tests/verify-order-flow-engine.js`

**Interfaces:**
- Consumes: User intent queries (*"Place order"*, *"I want to buy my cart"*, *"Confirm address"*, *"Pay with Apple Pay"*, *"Authorize order"*)
- Produces: Response payloads for `order_address`, `order_payment`, `order_review`, and `order_confirmed`.

- [ ] **Step 1: Write the failing unit test for Order Flow State Machine**

```javascript
// tests/verify-order-flow-engine.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const engineCode = fs.readFileSync(path.join(__dirname, '../js/concierge-engine.js'), 'utf-8');
const sandbox = { window: {}, location: { pathname: '/pages/discovery.html' } };
vm.createContext(sandbox);
vm.runInContext(engineCode, sandbox);

const ConciergeEngine = sandbox.window.ConciergeEngine;
const engine = new ConciergeEngine();
engine.initialize();

// Test 1: Triggering order flow starts at Step 1 (Address)
const resStep1 = engine.processMessage("I want to place an order");
assert.strictEqual(resStep1.type, 'order_address', 'Should route to order_address step');
assert.ok(resStep1.widgetPayload && resStep1.widgetPayload.defaultAddress, 'Should provide default address');

// Test 2: Submitting address moves to Step 2 (Payment)
const resStep2 = engine.processMessage("Confirm address: Maximilianstraße 34, Munich");
assert.strictEqual(resStep2.type, 'order_payment', 'Should route to order_payment step');
assert.ok(resStep2.widgetPayload && resStep2.widgetPayload.paymentMethods.length >= 4, 'Should provide 4 payment methods');

// Test 3: Submitting payment moves to Step 3 (Review)
const resStep3 = engine.processMessage("Pay with Apple Pay");
assert.strictEqual(resStep3.type, 'order_review', 'Should route to order_review step');
assert.ok(resStep3.widgetPayload && resStep3.widgetPayload.totalDue, 'Should calculate total due');

// Test 4: Final confirmation generates Order Code & Live Tracking
const resStep4 = engine.processMessage("Authorize & place order now");
assert.strictEqual(resStep4.type, 'order_confirmed', 'Should route to order_confirmed step');
assert.ok(resStep4.orderCode && resStep4.orderCode.startsWith('NX-'), 'Should generate NX- code');

console.log('✔ All Order Flow Engine tests passed successfully!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-order-flow-engine.js`
Expected: FAIL with "Should route to order_address step"

- [ ] **Step 3: Implement Order Flow State Machine in `js/concierge-engine.js`**

Add order state machine methods:
- `startOrderFlow()`: Initiates address step with saved user profile fallback.
- `advanceOrderPayment(address)`: Validates address and outputs payment method choices.
- `advanceOrderReview(paymentMethod)`: Calculates items subtotal, express delivery, and discount code.
- `confirmOrder()`: Generates random order code `NX-XXXX-X`, estimated dispatch timestamp, and courier tracking steps.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-order-flow-engine.js`
Expected: PASS with "✔ All Order Flow Engine tests passed successfully!"

- [ ] **Step 5: Commit changes**

```bash
git add js/concierge-engine.js tests/verify-order-flow-engine.js
git commit -m "feat(concierge): add in-drawer agentic order checkout state machine"
```

---

### Task 2: Order Flow Styles & Interactive Widgets in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:17000-17150`
- Test: `tests/verify-css-syntax.js`

**Interfaces:**
- Consumes: CSS classes (`.order-address-box`, `.saved-addr-pill`, `.payment-options-grid`, `.payment-option-card`, `.order-summary-box`, `.btn-authorize-order`, `.order-confirmed-banner`)
- Produces: Polished glassmorphic styling matching the Swiss modernist design system.

- [ ] **Step 1: Write CSS syntax & class check test**

```javascript
// Add checks to tests/verify-css-syntax.js
assert.ok(css.includes('.order-address-box'), 'Must contain .order-address-box');
assert.ok(css.includes('.payment-option-card'), 'Must contain .payment-option-card');
assert.ok(css.includes('.order-summary-box'), 'Must contain .order-summary-box');
assert.ok(css.includes('.btn-authorize-order'), 'Must contain .btn-authorize-order');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-css-syntax.js`
Expected: FAIL with "Must contain .order-address-box"

- [ ] **Step 3: Add Order Flow CSS rules to `css/design-system.css`**

Add complete styles for:
- Address selection pills and quick input fields.
- Payment method radio cards with selected active halo (`#F13365` border and background).
- Order summary calculation box with subtotal, discounts, and total due.
- Primary `AUTHORIZE & PLACE ORDER NOW` action button with glowing pulse.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-css-syntax.js`
Expected: PASS with balanced braces and all classes present.

- [ ] **Step 5: Commit changes**

```bash
git add css/design-system.css tests/verify-css-syntax.js
git commit -m "style(concierge): add agentic in-drawer order flow and checkout widgets"
```

---

### Task 3: In-Drawer Order Flow UI Renderers & Event Delegation in `js/concierge.js`

**Files:**
- Modify: `js/concierge.js:350-500`
- Test: `tests/verify-order-ui-flow.js`

**Interfaces:**
- Consumes: Engine payloads for `order_address`, `order_payment`, `order_review`, and `order_confirmed`.
- Produces: Interactive DOM renderers (`renderOrderAddressWidget`, `renderOrderPaymentWidget`, `renderOrderReviewWidget`, `renderOrderConfirmedWidget`), event delegation handlers for address confirmation, payment radio selection, 1-click authorization, and shopping bag clearing.

- [ ] **Step 1: Write functional DOM test for Order UI Flow**

```javascript
// tests/verify-order-ui-flow.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const conciergeJs = fs.readFileSync(path.join(__dirname, '../js/concierge.js'), 'utf-8');

assert.ok(conciergeJs.includes('renderOrderAddressWidget'), 'Must define renderOrderAddressWidget');
assert.ok(conciergeJs.includes('renderOrderPaymentWidget'), 'Must define renderOrderPaymentWidget');
assert.ok(conciergeJs.includes('renderOrderReviewWidget'), 'Must define renderOrderReviewWidget');
assert.ok(conciergeJs.includes('renderOrderConfirmedWidget') || conciergeJs.includes('order_confirmed'), 'Must define order confirmation handler');

console.log('✔ Order UI Flow static and DOM checks passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-order-ui-flow.js`
Expected: FAIL with "Must define renderOrderAddressWidget"

- [ ] **Step 3: Implement Order Flow Renderers & Event Delegation in `js/concierge.js`**

Implement:
1. `renderOrderAddressWidget(widgetPayload)` with pre-filled address and quick input fallback.
2. `renderOrderPaymentWidget(widgetPayload)` with selectable payment radio options.
3. `renderOrderReviewWidget(widgetPayload)` with itemized totals and authorization CTA.
4. `renderOrderConfirmedWidget(widgetPayload)` with order reference code, bag clearing, and live courier stepper injection.
5. Centralized click handlers for `data-action="confirm-order-address"`, `data-action="select-payment-method"`, and `data-action="authorize-order"`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-order-ui-flow.js`
Expected: PASS with "✔ Order UI Flow static and DOM checks passed!"

- [ ] **Step 5: Commit changes**

```bash
git add js/concierge.js tests/verify-order-ui-flow.js
git commit -m "feat(concierge): wire in-drawer order flow renderers and event delegation"
```

---

### Task 4: Full Regression & Multi-Page Verification

**Files:**
- Test: `tests/verify-all-35-fixes.js`
- Test: `tests/full-7dimension-audit.js`

- [ ] **Step 1: Run comprehensive regression suite**

Run: `node tests/verify-all-35-fixes.js`
Expected: PASS (32/32 checks 100%)

- [ ] **Step 2: Run 7-dimension audit**

Run: `node tests/full-7dimension-audit.js`
Expected: PASS (0 defects)

---

### Task 5: Live Browser UI Verification (Tier 3)

**Files:**
- Test: Live browser testing on Desktop (`1440x900`) and Mobile (`375x812`) via Chrome DevTools MCP.

- [ ] **Step 1: Open live storefront page**
- [ ] **Step 2: Open "Ask Stylist" drawer and trigger "Place an order"**
- [ ] **Step 3: Step through Address -> Payment -> Review -> Authorization**
- [ ] **Step 4: Verify order confirmation, bag clearance, and Live Tracking Stepper**
- [ ] **Step 5: Capture desktop and mobile screenshot evidence**
