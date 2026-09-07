# Full Storefront AI & UI Parity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Achieve 100.0% strict visual, interactive, content, and code parity between the Next.js 15 App Router codebase (`ubgrade`) and the reference prototype branch (`feature/storefront-elevation`), auditing every UI page and every AI feature in discrete, single-scope batches.

**Architecture:** A 30-batch execution framework where each batch is strictly isolated to exactly ONE page OR ONE AI feature/component. Verification uses live side-by-side browser preview between the prototype server (`http://localhost:8080`) and the Next.js server (`http://localhost:3000`), supported by automated AST/DOM and state assertions.

**Tech Stack:** Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS v4, Zustand 5, Lucide React, Motion, Playwright MCP, Node.js test runners.

## Global Constraints
- Every batch must focus on strictly ONE page OR ONE feature. Never combine multiple pages or multiple features in a single batch.
- Reference server: `http://localhost:8080` (static HTML/CSS/JS prototype from `feature/storefront-elevation`).
- Next.js server: `http://localhost:3000` (Next.js 15 App Router on branch `ubgrade`).
- Visual test viewports: Desktop `1440x900`, Mobile `375x812`.
- Minimum touch target: 44x44px for all interactive targets.
- Design tone: Atelier Obsidian Navy (`#01132B` / `#012148` / `#F8FAFF`), warm stone, plain UK English.
- No dark patterns or hidden layout shifts (zero CLS).

---

## Part 1: Dedicated AI Feature Batches (Batches 1 to 15)

### Batch 1: AI-01 — Intelligent Natural Language Search & "Why this piece?" Modal
**Files:**
- Modify: `components/search/SearchOverlay.tsx`
- Modify: `store/useSearchStore.ts`
- Reference: `js/ai-engine.js`, `js/search-overlay.js`
- Test: `tests/test-ai-search-parity.js`

**Interfaces:**
- Consumes: `useSearchStore`, `CATALOG_DB`
- Produces: Vector similarity ranker, typo-tolerant search, "Why this piece?" modal with bulleted reasons

- [ ] **Step 1: Write test asserting vector similarity ranking and why-modal triggers**
- [ ] **Step 2: Run test to verify initial status (`node tests/test-ai-search-parity.js`)**
- [ ] **Step 3: Verify search overlay matches 8080 vs 3000 in browser preview (`Ctrl + K`)**
- [ ] **Step 4: Assert GPU thinking track, recent search retention, and typo correction**
- [ ] **Step 5: Run test and verify 100% pass**

---

### Batch 2: AI-02 — Multi-Turn Context Retention & Removable Understood Context Pills
**Files:**
- Modify: `app/discovery/page.tsx`
- Modify: `store/useSearchStore.ts`
- Reference: `js/context-retention.js`, `js/session-context.js`
- Test: `tests/test-ai-context-retention.js`

**Interfaces:**
- Consumes: `useSearchStore.contextPills`, `removeContextPill`
- Produces: Removable context tags (`[Milan Evening ×]`, `[Cashmere ×]`), multi-turn query state

- [ ] **Step 1: Write test asserting context pill removal updates filtered product stream**
- [ ] **Step 2: Browser preview on `http://localhost:3000/discovery` with active search query**
- [ ] **Step 3: Verify pills dismiss individually and clear filters on final removal**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 3: AI-03 — Smart Size Advisor & Fit Assistant
**Files:**
- Modify: `components/product/FitAssistantModal.tsx`
- Modify: `app/product/[id]/page.tsx`
- Reference: `js/size-advisor.js`, `pages/product.html`
- Test: `tests/test-ai-size-advisor.js`

**Interfaces:**
- Consumes: `heightCm`, `weightKg`, `fitPreference` ('slim' | 'regular' | 'relaxed')
- Produces: `recommendedSize` ('S' | 'M' | 'L' | 'XL'), confidence score, 1-click apply

- [ ] **Step 1: Write test asserting slider recalculation and size selection on PDP**
- [ ] **Step 2: Browser preview PDP on 8080 (`/pages/product.html?id=p1`) vs 3000 (`/product/p1`)**
- [ ] **Step 3: Trigger "Fit Guide & Size Advisor" modal, adjust sliders, assert size updates**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 4: AI-04 — AI Style Profile & Preference Center
**Files:**
- Modify: `app/profile/page.tsx`
- Modify: `store/useStyleProfileStore.ts`
- Reference: `js/style-profile.js`, `pages/profile.html`
- Test: `tests/test-ai-style-profile.js`

**Interfaces:**
- Consumes: `styleScores` ({ minimalism, classic, technical, avantGarde }), `paletteAffinity`
- Produces: Radar telemetry chart, silhouette preferences, `localStorage` persistence

- [ ] **Step 1: Write test asserting radar score persistence and visual chart updates**
- [ ] **Step 2: Browser preview on 8080 (`/pages/profile.html`) vs 3000 (`/profile`)**
- [ ] **Step 3: Adjust radar telemetry sliders, click "Save Changes", verify persistent state**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 5: AI-05 — Intelligent Delivery Guidance & Logistics Concierge
**Files:**
- Modify: `components/tracking/DeliveryIntelligenceCard.tsx`
- Modify: `components/tracking/AILogisticsConcierge.tsx`
- Reference: `js/delivery-assistant.js`, `pages/tracking.html`
- Test: `tests/test-ai-delivery-guidance.js`

**Interfaces:**
- Consumes: `shipmentStatus`, `carrierReason`, `confidenceScore`
- Produces: Natural language explanation, logistics chat answers, reschedule modal trigger

- [ ] **Step 1: Write test asserting carrier state to plain language translation and chat replies**
- [ ] **Step 2: Browser preview on 8080 (`/pages/tracking.html`) vs 3000 (`/tracking`)**
- [ ] **Step 3: Verify Delivery Intelligence card, ask chat "Where is my package?", test reschedule modal**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 6: AI-06 — Personal Stylist Slide-Out Drawer Voice Audio Toggle
**Files:**
- Modify: `components/concierge/ConciergeDrawer.tsx`
- Reference: `js/concierge.js:103-107`
- Test: `tests/test-concierge-voice-toggle.js`

**Interfaces:**
- Consumes: `isVoiceAudioEnabled`, `toggleVoiceAudio`
- Produces: Speaker icon button in header (`#conciergeVoiceToggleBtn`) wired to `window.speechSynthesis`

- [ ] **Step 1: Write test asserting speaker icon button exists in drawer header with active/muted toggle**
- [ ] **Step 2: Browser preview drawer on 8080 vs 3000**
- [ ] **Step 3: Implement speaker button in header next to Reset and Close buttons**
- [ ] **Step 4: Assert audio speech synthesis activates when toggle is enabled**
- [ ] **Step 5: Run test and assert pass**

---

### Batch 7: AI-07 — Personal Stylist Slide-Out Drawer Microphone & Listening Waveform
**Files:**
- Modify: `components/concierge/ConciergeDrawer.tsx`
- Reference: `js/concierge.js:124-138`
- Test: `tests/test-concierge-drawer-mic.js`

**Interfaces:**
- Consumes: `webkitSpeechRecognition`, audio input stream
- Produces: `#conciergeMicBtn` and animated 6-bar listening waveform (`#conciergeListeningWave`) in input dock

- [ ] **Step 1: Write test asserting mic button and waveform exist in drawer input dock**
- [ ] **Step 2: Implement microphone button and 6-bar animated waveform inside input dock form**
- [ ] **Step 3: Browser preview drawer input dock matching 8080 vs 3000**
- [ ] **Step 4: Test click microphone toggles listening waveform and populates query**
- [ ] **Step 5: Run test and assert pass**

---

### Batch 8: AI-08 — Dedicated Concierge Studio Page Native Web Speech API
**Files:**
- Modify: `app/concierge/page.tsx`
- Reference: `js/concierge.js:210-240`, `pages/concierge.html`
- Test: `tests/test-concierge-speech-api.js`

**Interfaces:**
- Consumes: `window.webkitSpeechRecognition` or `window.SpeechRecognition`
- Produces: Real-time speech transcription into input field with error fallback

- [ ] **Step 1: Write test asserting microphone invokes speech recognition without hardcoded mock timeout**
- [ ] **Step 2: Replace 2.4s timer hardcoded string simulation with native Web Speech API**
- [ ] **Step 3: Browser preview `/concierge` on 8080 vs 3000**
- [ ] **Step 4: Verify speech permission request, live transcription, and speech fallback**
- [ ] **Step 5: Run test and assert pass**

---

### Batch 9: AI-09 — Smart Reorder: Item Dismissal with 5s Interactive Undo Toast
**Files:**
- Modify: `app/smart-list/page.tsx`
- Modify: `components/smart-list/SmartListProductCard.tsx`
- Reference: `js/smart-reorder.js:1198-1235`, `pages/smart-list.html`
- Test: `tests/test-smart-list-dismiss-undo.js`

**Interfaces:**
- Consumes: `dismissItem(id)`, `undismissItem(id)`, `localStorage` ('nex_sl_dismissed')
- Produces: Card dismiss button, 5-second floating Undo Toast with progress bar

- [ ] **Step 1: Write test asserting item dismissal hides card, shows undo toast, and restores on undo**
- [ ] **Step 2: Implement dismiss button on `SmartListProductCard` and floating Undo Toast in `app/smart-list/page.tsx`**
- [ ] **Step 3: Browser preview dismissing item, clicking Undo, and reloading page to verify persistence**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 10: AI-10 — Smart Reorder: Interactive Replenishment Cadence Popover
**Files:**
- Create: `components/smart-list/CadenceAdjusterPopover.tsx`
- Modify: `components/smart-list/SmartListProductCard.tsx`
- Reference: `js/smart-reorder.js:23,980`
- Test: `tests/test-smart-list-cadence.js`

**Interfaces:**
- Consumes: `intervalDays` (30 | 60 | 90), `isPaused`
- Produces: Popover trigger badge, radio/chip interval selector, interval change callback

- [ ] **Step 1: Write test asserting popover opens on cadence click and updates interval**
- [ ] **Step 2: Build `CadenceAdjusterPopover.tsx` with 30-day, 60-day, 90-day, and pause options**
- [ ] **Step 3: Replace static text badge in `SmartListProductCard.tsx` with popover component**
- [ ] **Step 4: Browser preview on 8080 vs 3000 adjusting replenishment cadence**
- [ ] **Step 5: Run test and assert pass**

---

### Batch 11: AI-11 — Autonomous Target-Budget Cart Builder
**Files:**
- Modify: `components/cart/BudgetCartModal.tsx`
- Reference: `js/budget-cart-builder.js`, `js/budget-cart-ui.js`
- Test: `tests/test-budget-cart-builder.js`

**Interfaces:**
- Consumes: `targetBudget` (numeric), `occasionTheme` ('autumn' | 'evening' | 'essentials')
- Produces: Multi-slot basket, headroom telemetry, candidate overrides, 1-click cart add

- [ ] **Step 1: Write test asserting constraint satisfaction and headroom calculation under price ceiling**
- [ ] **Step 2: Browser preview on 8080 (`/pages/cart.html`) vs 3000 (`/cart`)**
- [ ] **Step 3: Open Budget Cart Builder modal, adjust slider to €450, test candidate override, add to bag**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 12: AI-12 — Slip-to-Cart AI Document & Image Scanner
**Files:**
- Modify: `components/cart/SlipToCartModal.tsx`
- Reference: `js/slip-parser.js`, `js/slip-to-cart-ui.js`
- Test: `tests/test-slip-to-cart.js`

**Interfaces:**
- Consumes: Raw text / image file drop
- Produces: Extracted line-items with confidence scores, catalog product mapping, bulk add to cart

- [ ] **Step 1: Write test asserting text/file slip parsing and product mapping**
- [ ] **Step 2: Browser preview Slip-to-Cart modal on 8080 vs 3000**
- [ ] **Step 3: Test demo slip sample loading, verify confidence score badges, click "Add All to Cart"**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 13: AI-13 — Checkout Savings Optimizer & Promotion Engine
**Files:**
- Modify: `components/checkout/SavingsOptimizerBanner.tsx`
- Reference: `js/checkout-savings-engine.js`, `js/checkout-savings-ui.js`
- Test: `tests/test-savings-optimizer.js`

**Interfaces:**
- Consumes: `cartItems`, `cartSubtotal`
- Produces: Proactive discount badge (`SAVE15`, `ATELIER10`), 1-click coupon application

- [ ] **Step 1: Write test asserting cart subtotal evaluation and 1-click promo code application**
- [ ] **Step 2: Browser preview checkout order summary on 8080 vs 3000**
- [ ] **Step 3: Click "Apply Savings" banner in summary, assert instant total discount calculation**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 14: AI-14 — Side-by-Side Product Comparison Matrix & Slot Switcher
**Files:**
- Modify: `components/product/ComparisonModal.tsx`
- Reference: `js/comparison-engine.js`, `js/comparison-ui.js:180-210`
- Test: `tests/test-comparison-matrix.js`

**Interfaces:**
- Consumes: `productA`, `productB`
- Produces: Spec diff highlighting, winner verdict recommendation, Product B dropdown switcher (`#compareSlotB`)

- [ ] **Step 1: Write test asserting dropdown switcher updates Product B and recomputes spec matrix**
- [ ] **Step 2: Add catalog `<select>` dropdown inside comparison modal for Product B**
- [ ] **Step 3: Browser preview comparison modal on PDP on 8080 vs 3000**
- [ ] **Step 4: Switch Product B in dropdown, verify dynamic verdict and spec update**
- [ ] **Step 5: Run test and assert pass**

---

### Batch 15: AI-15 — Delivery-Aware Shopping Gate & Dark Store Hub Router
**Files:**
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/DeliveryGateModal.tsx`
- Reference: `js/delivery-gate-engine.js`, `js/delivery-gate-ui.js`
- Test: `tests/test-delivery-gate-hub.js`

**Interfaces:**
- Consumes: `activeHub` (Berlin, Paris, London, Milan), `cutoffTimer`
- Produces: Header location pill (`#headerDeliveryHubPill`), countdown badge (`⚡ 3h 45m`), dark store modal

- [ ] **Step 1: Write test asserting hub selection updates city label and express countdown**
- [ ] **Step 2: Browser preview header pill and dark store selection modal on 8080 vs 3000**
- [ ] **Step 3: Select Paris dark store in modal, assert header updates and triggers hub-changed event**
- [ ] **Step 4: Run test and assert pass**

---

## Part 2: Dedicated Storefront Page Batches (Batches 16 to 30)

### Batch 16: Homepage — Runway Lookbook Inspection Modal Integration
**Files:**
- Modify: `app/page.tsx`
- Modify: `components/home/EditorialBanner.tsx`
- Component: `components/home/LookbookModal.tsx`
- Reference: `index.html`, `js/lookbook.js`
- Test: `tests/test-lookbook-modal.js`

**Interfaces:**
- Consumes: `isLookbookOpen`, `openLookbook`, `closeLookbook`
- Produces: Full-screen runway lookbook modal with shoppable product pins and 1-click Quick Add

- [ ] **Step 1: Write test asserting banner click opens LookbookModal without route navigation**
- [ ] **Step 2: Import and mount `LookbookModal` in `app/page.tsx` and wire banner button click**
- [ ] **Step 3: Browser preview Homepage on 8080 vs 3000**
- [ ] **Step 4: Click runway banner, assert full-screen modal opens with look pins**
- [ ] **Step 5: Run test and assert pass**

---

### Batch 17: Category Collections / PLP — Visual & Interaction Parity Sweep
**Files:**
- Modify: `app/category/page.tsx`
- Modify: `components/category/CategoryProductGrid.tsx`
- Reference: `pages/category.html`, `js/plp.js`
- Test: `tests/test-category-plp-parity.js`

- [ ] **Step 1: Write test asserting filter pills, swatch switching, and quick-look drawer triggers**
- [ ] **Step 2: Browser preview `/pages/category.html` on 8080 vs `/category` on 3000**
- [ ] **Step 3: Verify swatch image change on hover/click and quick add feedback**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 18: Discovery Page — Complete Outfit Builder & Editorial Drops Section (`#drops`)
**Files:**
- Modify: `app/discovery/page.tsx`
- Reference: `pages/discovery.html:1548-1620`
- Test: `tests/test-discovery-drops-section.js`

- [ ] **Step 1: Write test asserting Section 3 `#drops` exists with 3 curated capsules and bundle add**
- [ ] **Step 2: Port Section 3 (Milan Evening €790, Minimalist Motion €440, Thermal Ensemble) into `app/discovery/page.tsx`**
- [ ] **Step 3: Browser preview `/pages/discovery.html` on 8080 vs `/discovery` on 3000**
- [ ] **Step 4: Click "Add Capsule", assert all bundle items are added to cart**
- [ ] **Step 5: Run test and assert pass**

---

### Batch 19: Product Detail Page (PDP) — 8 Signature Capabilities Verification
**Files:**
- Modify: `app/product/[id]/page.tsx`
- Reference: `pages/product.html`, `js/pdp.js`
- Test: `tests/test-pdp-full-suite.js`

- [ ] **Step 1: Write test asserting all 8 PDP capabilities (Perspective, Fit, Bundle, Specs, Accordion, Sticky, Compare)**
- [ ] **Step 2: Browser preview PDP on 8080 vs 3000 across Desktop and Mobile**
- [ ] **Step 3: Test perspective switching (Studio/Lifestyle/Detail) and mobile sticky bar**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 20: Shopping Bag / Cart Page — Visual & Micro-Interaction Parity
**Files:**
- Modify: `app/cart/page.tsx`
- Reference: `pages/cart.html`, `js/cart.js`
- Test: `tests/test-cart-page-parity.js`

- [ ] **Step 1: Write test asserting cart row layout, quantity stepper pulse, and threshold progress bar**
- [ ] **Step 2: Browser preview `/pages/cart.html` on 8080 vs `/cart` on 3000**
- [ ] **Step 3: Verify free shipping progress bar dynamically calculates remaining amount**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 21: Cart Abandonment Recovery — Global Exit-Intent Integration
**Files:**
- Modify: `app/layout.tsx`
- Component: `components/cart/CartRecoveryModal.tsx`
- Reference: `js/cart-recovery-ui.js:35-65`
- Test: `tests/test-cart-recovery-global.js`

- [ ] **Step 1: Write test asserting top-window `mouseleave` triggers recovery modal when cart has items**
- [ ] **Step 2: Mount `CartRecoveryModal` in `app/layout.tsx` with cart store dependency**
- [ ] **Step 3: Browser preview on `/discovery` with cart populated; simulate exit intent**
- [ ] **Step 4: Assert 15-minute reservation hold modal opens cleanly**
- [ ] **Step 5: Run test and assert pass**

---

### Batch 22: Multi-Step Checkout — 4-Step Accordion & MFS Payment Verification
**Files:**
- Modify: `app/checkout/page.tsx`
- Component: `components/checkout/MfsPaymentSheet.tsx`
- Reference: `pages/checkout.html`
- Test: `tests/test-checkout-mfs-suite.js`

- [ ] **Step 1: Write test asserting 4-step accordion transitions, address autocomplete, and MFS PIN sheet**
- [ ] **Step 2: Browser preview `/pages/checkout.html` on 8080 vs `/checkout` on 3000**
- [ ] **Step 3: Complete steps 1-3, choose bKash, test interactive PIN modal**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 23: Order Confirmation — Digital Boarding Pass Passcard
**Files:**
- Modify: `app/confirmation/page.tsx`
- Reference: `pages/confirmation.html`
- Test: `tests/test-confirmation-passcard.js`

- [ ] **Step 1: Write test asserting boarding pass layout, order ref tag, and print trigger**
- [ ] **Step 2: Browser preview on 8080 vs 3000**
- [ ] **Step 3: Click "Print Receipt" and verify print dialogue trigger**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 24: Order History & Details — Action Hub & Packstation Return QR Modal
**Files:**
- Modify: `app/orders/page.tsx`
- Modify: `app/orders/[id]/page.tsx`
- Component: `components/orders/OrderActionHub.tsx`
- Reference: `pages/orders.html`, `js/order-cancellation.js`
- Test: `tests/test-orders-hub.js`

- [ ] **Step 1: Write test asserting order lifecycle stages, return QR modal, and cancellation flow**
- [ ] **Step 2: Browser preview `/pages/orders.html` on 8080 vs `/orders` and `/orders/[id]` on 3000**
- [ ] **Step 3: Trigger "Start Return" modal to verify Packstation QR code renders**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 25: Courier Tracking Page — Real-Time Milestone Timeline
**Files:**
- Modify: `app/tracking/page.tsx`
- Reference: `pages/tracking.html`, `js/tracking.js`
- Test: `tests/test-tracking-timeline.js`

- [ ] **Step 1: Write test asserting milestone tracking stages and DHL Express courier metadata**
- [ ] **Step 2: Browser preview `/pages/tracking.html` on 8080 vs `/tracking` on 3000**
- [ ] **Step 3: Verify milestone active pulse and address details card**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 26: Saved Wishlist Page — Curation Depletion & Stylist Bridge
**Files:**
- Modify: `app/wishlist/page.tsx`
- Reference: `pages/wishlist.html`, `js/wishlist.js`
- Test: `tests/test-wishlist-depletion.js`

- [ ] **Step 1: Write test asserting complete depletion to 0 items resets hero count and shows empty state**
- [ ] **Step 2: Browser preview `/pages/wishlist.html` on 8080 vs `/wishlist` on 3000**
- [ ] **Step 3: Test "Share Wishlist" link copy toast and "Consult Stylist" navigation bridge**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 27: Size & Fit Guide — Measurement Calculator & Unit Switcher
**Files:**
- Modify: `app/size-guide/page.tsx`
- Reference: `pages/size-guide.html`
- Test: `tests/test-size-guide-parity.js`

- [ ] **Step 1: Write test asserting cm/inch unit toggle updates table measurements**
- [ ] **Step 2: Browser preview `/pages/size-guide.html` on 8080 vs `/size-guide` on 3000**
- [ ] **Step 3: Toggle measurement units and test interactive fit calculator**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 28: Maison Heritage / About — Provenance & Workshop Grid
**Files:**
- Modify: `app/about/page.tsx`
- Reference: `pages/about.html`
- Test: `tests/test-about-parity.js`

- [ ] **Step 1: Write test asserting atelier narrative, craftsmanship philosophy, and provenance grid**
- [ ] **Step 2: Browser preview `/pages/about.html` on 8080 vs `/about` on 3000**
- [ ] **Step 3: Verify image grid layout and editorial quote typography**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 29: Client Services & Help — Direct Dispatch Portal & FAQ Accordion
**Files:**
- Modify: `app/contact/page.tsx`
- Modify: `app/help/page.tsx`
- Reference: `pages/contact.html`
- Test: `tests/test-contact-help-parity.js`

- [ ] **Step 1: Write test asserting inquiry form validation, 1-click demo filler, and FAQ accordion**
- [ ] **Step 2: Browser preview `/pages/contact.html` on 8080 vs `/contact` and `/help` on 3000**
- [ ] **Step 3: Test 1-click demo inquiry filler and FAQ accordion expand/collapse**
- [ ] **Step 4: Run test and assert pass**

---

### Batch 30: Legal Directives & Feature Guide — Terms, Privacy & Shopping Guide
**Files:**
- Modify: `app/terms/page.tsx`
- Modify: `app/privacy/page.tsx`
- Modify: `app/guide/page.tsx`
- Reference: `pages/terms.html`, `pages/privacy.html`, `pages/feature-guide.html`
- Test: `tests/test-legal-guide-parity.js`

- [ ] **Step 1: Write test asserting 6 statutory articles, sticky scroll-spy, and 15-feature shopping guide**
- [ ] **Step 2: Browser preview `/pages/terms.html` and `/pages/feature-guide.html` on 8080 vs 3000**
- [ ] **Step 3: Test scroll-spy active indicator and 1-tap example clipboard copier on `/guide`**
- [ ] **Step 4: Run test and assert pass**

---

## Execution Handoff
Plan complete and saved to `docs/superpowers/plans/2026-09-02-full-storefront-ai-and-ui-parity-batches.md`. Two execution options:

1. **Subagent-Driven (recommended)** - I dispatch a fresh subagent per batch, review between batches, fast iteration
2. **Inline Execution** - Execute batches in this session using executing-plans, batch execution with checkpoints

**Which approach?**
