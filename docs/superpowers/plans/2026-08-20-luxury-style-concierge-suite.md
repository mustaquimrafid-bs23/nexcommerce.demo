# Elevated Luxury Style Concierge Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the global persistent Style Concierge into a complete luxury personal shopping assistant featuring real-time page context awareness, 4 rich in-chat interactive mini-widgets (Capsule Look Builder, Fit & Sizing Advisor, Studio Product Grid, and Live Order Tracker), GPU-accelerated spring animations, full Light/Dark theme parity, and centralized event delegation.

**Architecture:** 
- `js/concierge-engine.js`: Deterministic multi-intent natural language shopping engine with page context detection, grounded catalog queries against `NexAI.catalogArray`, and structured widget payload generation.
- `js/concierge.js`: UI controller and event orchestrator managing the persistent side drawer, message stream, rich widget rendering, centralized event delegation (`data-action`), focus trapping, and floating entry pill.
- `css/design-system.css`: Modernist European luxury styles with CSS variables for Light/Dark parity, GPU slide-in transitions (`transform: translateX()`), and mobile responsive full-screen adaptations.

**Tech Stack:** Vanilla JavaScript (ES6+), Modern Vanilla CSS with CSS Custom Properties, Lucide SVG Icons, Node.js test runner for syntax & AST validation, Playwright for visual & browser verification.

## Global Constraints

- European Luxury Standard: Base near-black `#0A0A0A` (Dark) / off-white `#FBF9F5` (Light), strict typography hierarchy (`Neue Haas Grotesk`, `Inter`).
- Zero AI Jargon: No "Curated", "Synthesize", "Atelier Replenishments", "Curation Valuation". Use human retail language: "Recommended Look", "Complete the Look", "Sizing Guide", "Find Recommendations".
- Zero Paragraph Clutter on Product Cards: Product cards must strictly have $\ge 70\%$ image real estate, no "Why it matches" multi-line text, and 3-item metadata (House, Title, Price).
- Zero Inline Event Handlers: No inline `onclick="..."` or `onchange="..."` in generated HTML strings. All events managed via centralized delegation on `#nexConciergeDrawer`.
- GPU Composited Transitions: Use `transform: translateX()` instead of layout `right` property.
- Monolithic Stylesheet Balance: Run `node -e` AST balance script on `css/design-system.css` after every CSS update.

---

### Task 1: Elevate Concierge Deterministic Engine (`js/concierge-engine.js`)

**Files:**
- Modify: `js/concierge-engine.js`
- Create: `tests/test-concierge-engine.js`

**Interfaces:**
- Produces: `window.NexConciergeEngine` with methods:
  - `initialize(context?: { url?: string, productId?: string }): { type: string, text: string, suggestedChips: string[], products?: any[], widgetPayload?: any }`
  - `processMessage(text: string, currentContext?: any): { type: string, text: string, isBundleLook?: boolean, suggestedChips: string[], products?: any[], widgetPayload?: any, actionLink?: any }`
  - `calculateSize(category: string, chestOrShoe: string, fitPref: string): { recommendedSize: string, confidence: number, advice: string }`

- [ ] **Step 1: Write the failing test for ConciergeEngine**

```javascript
// tests/test-concierge-engine.js
const assert = require('assert');
const fs = require('fs');

// Mock browser environment
global.window = {
  location: { search: '?id=NX-APP-001', pathname: '/product.html' },
  NexAI: {
    catalogArray: [
      { id: 'NX-APP-001', title: 'Cashmere Minimalist Knit', category: 'Apparel', numericPrice: 280, price: '€ 280.00', img: 'assets/images/products/hero_sweater.png' },
      { id: 'NX-APP-002', title: 'Relaxed Tailored Trouser', category: 'Apparel', numericPrice: 240, price: '€ 240.00', img: 'assets/images/products/merino_wool_trousers.png' },
      { id: 'NX-FTW-001', title: 'Minimalist Leather Runner', category: 'Footwear', numericPrice: 320, price: '€ 320.00', img: 'assets/images/products/leather_sneaker.png' },
      { id: 'NX-APP-003', title: 'Double-Breasted Wool Overcoat', category: 'Apparel', numericPrice: 480, price: '€ 480.00', img: 'assets/images/products/minimalist_trench.png' }
    ],
    catalog: {}
  }
};
global.window.NexAI.catalogArray.forEach(p => global.window.NexAI.catalog[p.id] = p);
global.sessionStorage = { getItem: () => null, setItem: () => {} };

// Load concierge-engine
const engineCode = fs.readFileSync('js/concierge-engine.js', 'utf8');
eval(engineCode);

console.log('Testing ConciergeEngine initialize with PDP context...');
const initPDP = window.NexConciergeEngine.initialize({ url: 'product.html?id=NX-APP-001', productId: 'NX-APP-001' });
assert.ok(initPDP.text.includes('Cashmere Minimalist Knit'), 'Greeting should reference PDP product');
assert.ok(initPDP.suggestedChips.length >= 3, 'Should provide relevant contextual chips');

console.log('Testing Occasion & Look Bundle Intent...');
const lookResp = window.NexConciergeEngine.processMessage('Complete a look for the office');
assert.strictEqual(lookResp.type, 'bundle_look', 'Response should be a bundle_look');
assert.ok(lookResp.products.length >= 2, 'Bundle should contain at least 2 pieces');

console.log('Testing Sizing Intent...');
const sizeResp = window.NexConciergeEngine.processMessage('What size should I choose?');
assert.strictEqual(sizeResp.type, 'sizing_advisor', 'Response should be sizing_advisor');
assert.ok(sizeResp.widgetPayload, 'Should return widgetPayload for sizing');

console.log('Testing Order Tracking Intent...');
const trackResp = window.NexConciergeEngine.processMessage('Track my order NX-8921-X');
assert.strictEqual(trackResp.type, 'order_tracking', 'Response should be order_tracking');

console.log('All ConciergeEngine unit tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-concierge-engine.js`  
Expected: FAIL (types `bundle_look`, `sizing_advisor`, `order_tracking` not matching or missing widgetPayload)

- [ ] **Step 3: Implement enhanced `js/concierge-engine.js`**

Implement complete deterministic multi-intent engine in `js/concierge-engine.js`:
- Context detection (identifying `product.html?id=...`, `cart.html`, etc.)
- Multi-intent classifier (occasions, jackets/knitwear/footwear under € X, size advisor, material care, courier/delivery, live order tracker, fallback)
- Grounded `bundle_look` builder (pairing coordinated apparel + footwear pieces)
- Grounded `sizing_advisor` calculator
- Grounded `order_tracking` simulator for `NX-8921-X`

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-concierge-engine.js`  
Expected: `All ConciergeEngine unit tests passed!`

- [ ] **Step 5: Commit**

```bash
git add js/concierge-engine.js tests/test-concierge-engine.js
git commit -m "feat(concierge): enhance deterministic engine with context awareness and rich widget payloads"
```

---

### Task 2: Elevate Concierge UI Controller & Centralized Event Delegation (`js/concierge.js`)

**Files:**
- Modify: `js/concierge.js`

**Interfaces:**
- Consumes: `window.NexConciergeEngine`, `window.NexCart`, `window.NexAI`
- Produces: Global DOM injection (`#nexConciergeDrawer`, `#nexConciergeOverlay`, `#nexConciergeFloatingPill`) and window methods:
  - `window.openConcierge(context?: object)`
  - `window.closeConcierge()`

- [ ] **Step 1: Implement Rich In-Chat Widget Renderers in `js/concierge.js`**

Add modular rendering functions:
- `renderBundleCard(products)`: renders visual capsule with item thumbnails, titles, tabular prices, item checkboxes (`data-action="toggle-bundle-item"`), dynamic live subtotal display, and primary CTA button (`data-action="add-look-bundle"`).
- `renderSizingAdvisor(widgetPayload)`: renders interactive category pills, measurement selectors (`data-action="select-size-chest"` / `data-action="select-size-shoe"`), fit preference toggle (`data-action="select-size-fit"`), and instant calculated size badge.
- `renderProductCards(products)`: renders studio photography ($\ge 70\%$), 3-item metadata, and direct Add to Bag button (`data-action="add-to-bag"`).
- `renderOrderTracker(orderCode)`: renders code input (`data-action="track-order-submit"`) and 4-stage visual milestone stepper.

- [ ] **Step 2: Implement Centralized Event Delegation (No Inline Handlers)**

Replace all inline `onclick` functions with a centralized listener on `#nexConciergeDrawer`:
```javascript
drawer.addEventListener('click', (e) => {
  const target = e.target.closest('[data-action]');
  if (!target) return;
  const action = target.getAttribute('data-action');
  
  if (action === 'send-chip') {
    handleUserMessage(target.getAttribute('data-chip-text'));
  } else if (action === 'add-to-bag') {
    handleAddToCart(target);
  } else if (action === 'add-look-bundle') {
    handleAddBundleToCart(target);
  } else if (action === 'toggle-bundle-item') {
    updateBundleSubtotal(target.closest('.concierge-look-bundle'));
  } else if (action === 'select-size-pill') {
    handleSizeSelection(target);
  } else if (action === 'track-order-submit') {
    handleTrackOrderSubmit(target);
  }
});
```

- [ ] **Step 3: Implement Floating Luxury Pill & Contextual Launchers**

- Inject `#nexConciergeFloatingPill` into DOM.
- Add window scroll listener: show pill when `window.scrollY > 200`, hide at top.
- Wire up `[data-concierge-trigger]` across document to call `openConcierge()` with current page context.

- [ ] **Step 4: Verify syntax & error-free execution with node**

Run: `node -e "const fs = require('fs'); eval(fs.readFileSync('js/concierge.js', 'utf8')); console.log('concierge.js syntax OK');"`  
Expected: `concierge.js syntax OK`

- [ ] **Step 5: Commit**

```bash
git add js/concierge.js
git commit -m "feat(concierge): implement rich widget renderers, floating pill, and centralized event delegation"
```

---

### Task 3: Modernist Luxury Styling & GPU Motion in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css`

**Interfaces:**
- Styles for `.concierge-drawer`, `.concierge-overlay`, `.concierge-floating-pill`, `.concierge-look-bundle`, `.concierge-size-advisor`, `.concierge-product-card`, and `.concierge-tracker-stepper`.

- [ ] **Step 1: Implement GPU Motion & Drawer Transitions in `css/design-system.css`**

```css
.concierge-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 460px;
  height: 100vh;
  background: var(--bg-primary, rgba(10, 10, 10, 0.98));
  border-left: 1px solid var(--border-subtle, rgba(255, 255, 255, 0.08));
  z-index: 9999;
  display: flex;
  flex-direction: column;
  transform: translateX(100%);
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: -12px 0 48px rgba(0, 0, 0, 0.4);
  will-change: transform;
}
.concierge-drawer.open {
  transform: translateX(0);
}
```

- [ ] **Step 2: Add Styles for Floating Pill, Look Builder, Size Advisor, and Order Stepper**

Add CSS definitions using design system tokens:
- `.concierge-floating-pill`: Glassmorphic luxury pill with smooth fade-in/out and spring hover.
- `.concierge-look-bundle`: Capsule container with checkbox styling, item grid, and live total bar.
- `.concierge-size-advisor`: Modernist size pill selector, active states, and result confidence banner.
- `.concierge-tracker-stepper`: 4-point milestone line with animated active node.
- Mobile breakpoints (`@media (max-width: 767px)`): `width: 100vw; height: 100vh;`.

- [ ] **Step 3: Validate CSS AST Balance & Braces**

Run: `node -e "const fs = require('fs'); const css = fs.readFileSync('css/design-system.css', 'utf8'); const o = (css.match(/\{/g)||[]).length; const c = (css.match(/\}/g)||[]).length; console.log('Open:', o, 'Close:', c); if (o !== c) process.exit(1);"`  
Expected: `Open: N Close: N` (balanced counts, exit code 0).

- [ ] **Step 4: Commit**

```bash
git add css/design-system.css
git commit -m "style(concierge): add GPU transitions, Light/Dark styles, and widget styling in design system"
```

---

### Task 4: Add Contextual Triggers & Cache Busting Across Storefront Pages

**Files:**
- Modify: `pages/product.html` (add contextual "Consult Stylist on Sizing & Pairing" button)
- Modify: `index.html` (bump cache buster `?v=...` on concierge scripts)
- Modify: `pages/discovery.html` (bump cache busters)
- Modify: `pages/cart.html` (bump cache busters)

- [ ] **Step 1: Add PDP Contextual Button to `pages/product.html`**

Add secondary action button in the PDP buy box:
```html
<button type="button" class="btn-secondary-commerce concierge-pdp-trigger" data-concierge-trigger data-pdp-context="true">
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
  <span>Consult Stylist on Fit &amp; Pairing</span>
</button>
```

- [ ] **Step 2: Update Script & Stylesheet Cache Busters Across Pages**

Update script tags:
`js/concierge-engine.js?v=3`  
`js/concierge.js?v=3`  
`css/design-system.css?v=20`

- [ ] **Step 3: Commit**

```bash
git add pages/product.html index.html pages/discovery.html pages/cart.html
git commit -m "feat(storefront): wire PDP concierge trigger and update script cache busters"
```

---

### Task 5: End-to-End Visual & Functional Verification

**Files:**
- Modify: `walkthrough.md` (record walkthrough with screenshots)

- [ ] **Step 1: Automated Verification with Node Test Suite**

Run: `node tests/test-concierge-engine.js`  
Expected: `All ConciergeEngine unit tests passed!`

- [ ] **Step 2: Browser Verification with Playwright/Browser Subagent**

Verify the following flows in the live browser:
1. **Global Header Launch**: Click `✦ Style Concierge` in the top navigation -> Drawer slides in with 60fps GPU spring.
2. **PDP Context Launch**: Navigate to `pages/product.html?id=NX-APP-001` and click *"Consult Stylist on Fit & Pairing"* -> Drawer opens with personalized greeting for *Cashmere Minimalist Knit*.
3. **Capsule Look Builder**: Click chip *"Complete a look"* -> Checkboxes toggle items, live subtotal updates, click *"Add Selected to Bag"* -> Cart badge updates in header.
4. **Interactive Size Advisor**: Click chip *"Check my size"* -> Tap size pills -> Calculated recommendation appears instantly.
5. **In-Drawer Order Tracking**: Type *"Track my order"* -> Type `NX-8921-X` -> Visual 4-stage stepper appears.
6. **Theme Parity**: Toggle between Dark and Light themes -> Drawer and widgets adapt with high contrast and luxury polish.
7. **Mobile Responsiveness**: Test at 375px viewport -> Full-screen drawer with touch targets $\ge 44\text{px}$.

- [ ] **Step 3: Capture Screenshots and Commit Final Verification**

```bash
git add walkthrough.md
git commit -m "docs(concierge): document elevated luxury style concierge suite walkthrough and verification"
```
