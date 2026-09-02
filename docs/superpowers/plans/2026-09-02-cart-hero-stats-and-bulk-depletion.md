# Batch 14: Cart Page Full Migration, Hero Stats & Bulk Depletion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fully migrate and elevate the Cart / Shopping Bag page (`app/cart/page.tsx`) to Next.js 15 App Router with 100% visual and functional parity to `feature/storefront-elevation`, uniform luxury radial background (`#031838` → `#011126` → `#000B1A`), plain British UK English (zero AI buzzwords), fluid Motion animations, and 0-item depletion resilience.

**Architecture:** Next.js 15 App Router with React 19, TypeScript, Tailwind CSS with Atelier Obsidian tokens, Zustand state stores (`useCartStore`, `useWishlistStore`), Motion (`motion/react`), Lucide React, and interactive modals (`BudgetCartModal`, `SlipToCartModal`, `CartRecoveryModal`).

**Tech Stack:** Next.js 15.x, React 19, TypeScript, Tailwind CSS v4, Zustand 5, Motion (`motion/react`), Lucide React, Node.js Test Runner.

---

## Global Constraints

* **Uniform Atelier Background:** `radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)` applied directly to container, matching PDP, Category, About, Terms, and Profile pages.
* **Plain British UK English:** Strict adherence to everyday UK English words (e.g. "Colour", "14-day free returns", "Bank-grade secure checkout", "Direct from makers"). Zero AI buzzwords ("telemetry", "autonomous", "heuristic", "agentic", "hallucinate", "synthesise", "LLM", "artificial intelligence").
* **Visual Reference Parity:** 100% match with `cart_storefront_elevation_reference.png` captured from `feature/storefront-elevation`:
  - Hero Header with eyebrow pill, italic serif headline `Shopping <em>Bag</em>`, and 3-stat summary cluster (Total Items, Estimated Value, Express Delivery status).
  - Integrated Action Toolbar (Continue Shopping, Smart Budget Builder, Smart Slip to Cart, Clear Bag).
  - 120fps Delivery Milestone Progress Capsule with glowing gradient track and dynamic threshold indicator.
  - Asymmetric 2-column layout (7 cols left for product items + confidence strip + seasonal promotional banner; 5 cols right for sticky order summary + savings advisor).
  - 375px Mobile Sticky Checkout Bar.
* **Touch Targets & Accessibility:** All interactive elements $\ge 44\text{px}$ touch targets, visible focus indicators, WCAG 2.1 AA contrast ratios ($\ge 4.5:1$).
* **0-Item Depletion Boundary:** When bag is depleted to 0 items (`[]`), all peripheral hero stats cleanly reset to 0 and the minimal luxury empty canvas displays with 5 gateway action buttons.

---

## Visual Reference Comparison

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BATCH 14 VISUAL REFERENCE ARCHITECTURE                          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Top Bar]  14-day free returns · 100% genuine items · Free delivery over €150.00       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Header]   nexCommerce  |  Categories  Smart List [NEW]  |  Search...  |  Wishlist Cart│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Hero]     • YOUR SELECTION · 5 ITEMS SELECTED                                         │
│            Shopping Bag                                  [Total Items: 5 | €1225 | Free]│
│            Review your selected pieces...                                              │
│            [< Continue Shopping]     [✨ Budget Builder] [🧾 Slip to Cart] [🗑 Clear Bag]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│ [Capsule]  ✓ Complimentary Express Delivery Unlocked            [✓ EXPRESS UNLOCKED]   │
│            ═════════════════════════════════════════════════════════════════════════   │
├───────────────────────────────────────────┬────────────────────────────────────────────┤
│ [Left: Product Rows (7 cols)]             │ [Right: Sticky Order Summary (5 cols)]     │
│ • Item 1: Structured Leather Tote (€245)  │  Order Summary                             │
│   Size: M · Colour: Obsidian Black        │  ┌──────────────────────────────────────┐  │
│   [- 1 +]    [♡] [🗑]         €245.00     │  │ ✨ Savings Advisor: VIP20 (-€49.00)   │  │
│                                           │  │ [✓ Apply VIP20 Discount]             │  │
│ • Item 2: Cashmere Turtleneck (€185)      │  └──────────────────────────────────────┘  │
│   Size: S · Colour: Light Silver          │  Promo code: [ VIP20 ] [ Apply ]           │
│   [- 1 +]    [♡] [🗑]         €185.00     │  Subtotal (2 items)                €430.00 │
│                                           │  Privilege Discount (20%)          -€86.00 │
│ ┌───────────────────────────────────────┐ │  Standard EU Delivery                 FREE │
│ │ 14-Day Free Returns · 100% Genuine   │ │  VAT & Duties Included               Included │
│ │ Secure Checkout · 100% Climate Neutral│ │  Total Due                         €344.00 │
│ └───────────────────────────────────────┘ │                                            │
│                                           │  [ PROCEED TO CHECKOUT → ]                 │
│ ┌───────────────────────────────────────┐ │                                            │
│ │ [Image] Season Privilege · Save 20%   │ │  🔒 14-Day Free Returns                    │
│ │ Code: VIP20  [ Apply 20% Discount ]   │ │  🛡 100% Genuine Direct from Makers        │
│ └───────────────────────────────────────┘ │  ✓ 256-bit Encrypted Checkout              │
├───────────────────────────────────────────┴────────────────────────────────────────────┤
│ [375px Mobile Bar] Total Due: €344.00                    [ CHECKOUT → ]                │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure

| Action | Path | Responsibility |
|---|---|---|
| **MODIFY** | `app/cart/page.tsx` | Main Cart page view with uniform luxury background, hero header, live stats, action toolbar, promotional banner, and mobile sticky bar |
| **MODIFY** | `components/cart/CartHeroStats.tsx` | Hero stats cluster component with 0-item depletion handling and clean UK English |
| **MODIFY** | `components/cart/CartPromoBanner.tsx` | Interactive promotional banner with 1-click coupon apply and responsive layout |
| **MODIFY** | `components/cart/OrderConfidenceStrip.tsx` | Confidence badges strip with clean UK English |
| **MODIFY** | `components/cart/SmartSavingsAdvisor.tsx` | Context-aware savings recommendation card with 1-click apply |
| **CREATE** | `tests/test-cart-elevation.js` | Dedicated automated test suite asserting DOM IDs, math, 0-item depletion, and copy |

---

## Task Decomposition

### Task 1: Cart Page Background, Hero Header & Action Toolbar Elevation
**Files:**
- Modify: `app/cart/page.tsx:1-265`
- Test: `tests/test-cart-elevation.js`

**Interfaces:**
- Consumes: `useCartStore`, `useWishlistStore`, `formatPrice`.
- Produces: Uniform luxury radial background (`#031838` → `#011126` → `#000B1A`), elevated editorial hero with 3-stat cluster, breadcrumbs, and 4 action buttons (Continue Shopping, Budget Builder, Slip to Cart, Clear Bag).

- [ ] **Step 1: Write automated test for Cart Hero, Stats, and Toolbar in `tests/test-cart-elevation.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-cart-elevation.js`
- [ ] **Step 3: Update `app/cart/page.tsx` with uniform background and elevated hero structure**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-cart-elevation.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(cart): elevate cart hero header and action toolbar with uniform luxury background"`

---

### Task 2: Express Delivery Milestone Progress Capsule & 0-Item Depletion
**Files:**
- Modify: `app/cart/page.tsx:265-375`
- Test: `tests/test-cart-elevation.js`

**Interfaces:**
- Consumes: `subtotal`, `remainingForFree`, `progressPercent`.
- Produces: 120fps GPU milestone progress capsule with dynamic threshold text and empty bag canvas when items are 0.

- [ ] **Step 1: Add test assertions for delivery progress calculations and 0-item depletion**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-cart-elevation.js`
- [ ] **Step 3: Implement GPU-smooth progress capsule and 5-action empty state canvas**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-cart-elevation.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(cart): implement express delivery milestone capsule and 0-item depletion canvas"`

---

### Task 3: Cart Product Rows, Order Confidence Strip & Promotional Banner
**Files:**
- Modify: `app/cart/page.tsx:376-530`
- Modify: `components/cart/OrderConfidenceStrip.tsx`
- Modify: `components/cart/CartPromoBanner.tsx`
- Test: `tests/test-cart-elevation.js`

**Interfaces:**
- Consumes: `items`, `updateQuantity`, `removeItem`, `toggleWishlist`, `isWishlisted`.
- Produces: 3:4 thumbnail product rows with micro-action buttons, UK English confidence strip, and interactive seasonal promotional banner with 1-click VIP20 discount.

- [ ] **Step 1: Add test assertions for product rows, confidence strip copy, and promo banner**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-cart-elevation.js`
- [ ] **Step 3: Update `OrderConfidenceStrip.tsx` and `CartPromoBanner.tsx` with UK English and mount in left column**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-cart-elevation.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(cart): integrate product rows, confidence strip, and interactive promo banner"`

---

### Task 4: Sticky Order Summary, Smart Savings Advisor & British UK Copy Audit
**Files:**
- Modify: `app/cart/page.tsx:530-700`
- Modify: `components/cart/SmartSavingsAdvisor.tsx`
- Test: `tests/test-cart-elevation.js`

**Interfaces:**
- Consumes: `subtotal`, `discount`, `shipping`, `total`, `applyCoupon`, `removeCoupon`.
- Produces: Sticky order summary with live discount badge, coupon form, breakdown, checkout CTA, trust badges, and zero forbidden AI words.

- [ ] **Step 1: Add test assertions for coupon engine, UK English copy invariants, and sticky summary**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-cart-elevation.js`
- [ ] **Step 3: Implement sticky summary and clean UK English copy across all cart components**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-cart-elevation.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(cart): implement sticky order summary, savings advisor, and clean UK copy"`

---

### Task 5: 3-Tier Verification & Visual SQA Verification Gate
**Files:**
- Test: `tests/test-cart-elevation.js`, `tests/test-cart-page-migration.js`
- Capture: Desktop (`1440x900`) and Mobile (`375x812`) screenshots

- [ ] **Step 1: Run Next.js production build (`npm run build`)**
- [ ] **Step 2: Run all cart automated test suites (`node tests/test-cart-elevation.js`)**
- [ ] **Step 3: Capture full-page visual verification screenshots for Desktop and Mobile**
- [ ] **Step 4: Commit:** `git commit -m "chore(cart): complete batch 14 cart elevation and 3-tier verification"`

---

## Verification Plan

### Automated Tests
* `node tests/test-cart-elevation.js` — validates all DOM IDs, calculations, 0-item depletion, promo application, and British UK English.
* `node tests/test-cart-page-migration.js` — validates cross-cutting cart features.
* `npm run build` — asserts zero TypeScript or build errors across all routes.

### Visual & Manual SQA Verification
* Desktop (`1440x900`): Verify full page visual match against `cart_storefront_elevation_reference.png`.
* Mobile (`375x812`): Verify layout reflow, touch targets $\ge 44\text{px}$, and mobile sticky buy bar.
* 0-Item Depletion: Click "Clear Bag", verify smooth transition to empty canvas with all hero stats cleanly reset to 0.
