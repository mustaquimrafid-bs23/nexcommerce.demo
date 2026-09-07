# 20-Batch Next.js Storefront Elevation & Feature Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan batch-by-batch. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and migrate all missing storefront pages, incomplete features, and global interactive modals into Next.js 15 App Router using **20 small, bite-sized, low-risk batches** with full automated test coverage and 100% UX parity.

**Architecture:** Next.js 15 App Router with React 19, TypeScript, Tailwind CSS with Atelier Obsidian (`#012148`) and Warm Stone (`#F4F2EE`) tokens, Zustand state stores, Framer Motion / Motion, Lucide Icons, and Lenis smooth scrolling.

**Tech Stack:** Next.js 15.x, React 19, TypeScript, Tailwind CSS v4, Zustand 5, Motion (`motion/react`), Lucide React, Vitest / Node Test Runner.

---

## Global Constraints

* **Atelier Color Palette:** Deep Obsidian (`#00142e`), Obsidian Navy (`#012148`), Surface Navy (`#0A2A54`), Warm Stone (`#f4f2ee`), Crimson (`#E60C45`), Radiant Pink (`#F13365`), Electric Cyan (`#3DE0FF`).
* **Typography:** Cormorant Garamond (`var(--font-serif)`), Inter (`var(--font-sans)`), Manrope (`var(--font-display)`).
* **Plain & Everyday English:** Strict adherence to everyday English words; zero pseudo-academic jargon or buzzwords in customer copy.
* **Touch Targets & Accessibility:** All interactive elements $\ge 44\text{px}$ touch targets, visible focus indicators, WCAG 2.1 AA contrast ratios ($\ge 4.5:1$).
* **Micro-Batch Isolation:** Each of the 20 batches is self-contained with its own dedicated automated test and verification before proceeding.

---

## 20-Batch Roadmap Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        20-BATCH GRANULAR MIGRATION MATRIX                              │
├─────────┬──────────────────────────────────┬─────────┬─────────────────────────────────┤
│ BATCH 1 │ 404 Luxury Recovery Gateway      │ BATCH 11│ PDP AI Fit & Size Modal         │
│ BATCH 2 │ Zero-Knowledge Cookie Banner     │ BATCH 12│ PDP Complete Look & Sticky Bar  │
│ BATCH 3 │ Dual Currency Switcher (EUR/BDT) │ BATCH 13│ PLP Quick-Look Mini-PDP Drawer  │
│ BATCH 4 │ Maison About & Materials Page    │ BATCH 14│ Cart Hero Stats & Bulk Actions  │
│ BATCH 5 │ Terms of Engagement & Scroll-Spy │ BATCH 15│ Checkout bKash/Nagad MFS Sheet  │
│ BATCH 6 │ Anatomical Size Guide Page       │ BATCH 16│ Checkout Savings Optimizer      │
│ BATCH 7 │ Client Sign-In (1-Click Demo)    │ BATCH 17│ Tracking AI Logistics Concierge │
│ BATCH 8 │ Client Sign-Up (Strength Meter)  │ BATCH 18│ Client Services & Ateliers Page │
│ BATCH 9 │ Client Style DNA Studio Page     │ BATCH 19│ Dark Store Gate & Hub Pill      │
│ BATCH 10│ PDP 3-Perspective & Spec Badges  │ BATCH 20│ Global Modals & 7-Dimension SQA │
└─────────┴──────────────────────────────────┴─────────┴─────────────────────────────────┘
```

---

### Batch 1: 404 Luxury Recovery Gateway (`app/not-found.tsx`)
**Files:**
- Create: `app/not-found.tsx`
- Test: `tests/test-not-found-migration.js`

**Interfaces:**
- Consumes: Next.js standard 404 handler, `useSearchStore`.
- Produces: Luxury recovery UI with watermark, recovery search, and 4 curated gateway wings.

- [ ] **Step 1: Write failing test `tests/test-not-found-migration.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-not-found-migration.js`
- [ ] **Step 3: Implement `app/not-found.tsx`**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-not-found-migration.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-1): implement luxury 404 recovery gateway"`

---

### Batch 2: Zero-Knowledge Cookie Consent Banner (`components/layout/CookieConsentBanner.tsx`)
**Files:**
- Create: `components/layout/CookieConsentBanner.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/layout/Footer.tsx` (wire Cookie Settings trigger)
- Test: `tests/test-cookie-consent.js`

**Interfaces:**
- Consumes: `localStorage` key `nex_cookie_consent`.
- Produces: Floating privacy banner with "Acknowledge" and "Inspect Vault" buttons, re-openable from footer.

- [ ] **Step 1: Write failing test `tests/test-cookie-consent.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-cookie-consent.js`
- [ ] **Step 3: Implement `CookieConsentBanner.tsx` and wire in `Footer.tsx` and `RootLayout`**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-cookie-consent.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-2): implement zero-knowledge cookie consent banner"`

---

### Batch 3: Real-Time Dual Currency Switcher (`EUR` / `BDT`)
**Files:**
- Create: `store/useCurrencyStore.ts`
- Modify: `components/layout/Header.tsx` (add currency toggle)
- Modify: `components/layout/Footer.tsx` (wire currency dropdown)
- Modify: `lib/utils.ts` (currency price formatter)
- Test: `tests/test-currency-switcher.js`

**Interfaces:**
- Consumes: Currency (`EUR` | `BDT`), exchange rate (1 EUR = 132 BDT).
- Produces: Universal `formatPrice` utility and reactive header/footer toggles.

- [ ] **Step 1: Write failing test `tests/test-currency-switcher.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-currency-switcher.js`
- [ ] **Step 3: Implement `useCurrencyStore.ts`, header/footer toggles, and updated `formatPrice`**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-currency-switcher.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-3): implement dual currency switcher with live conversion"`

---

### Batch 4: Maison Heritage Manifesto & Material Swatches (`app/about/page.tsx`)
**Files:**
- Create: `app/about/page.tsx`
- Create: `components/about/AboutHeroSplit.tsx`
- Create: `components/about/MaterialsSection.tsx`
- Create: `components/about/DisciplinesGrid.tsx`
- Create: `components/about/CraftTimeline.tsx`
- Create: `components/about/GuardiansGrid.tsx`
- Modify: `components/layout/Footer.tsx` (link "About Us" to `/about`)
- Test: `tests/test-about-page-migration.js`

- [ ] **Step 1: Write failing test `tests/test-about-page-migration.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-about-page-migration.js`
- [ ] **Step 3: Implement modular components in `components/about/` and assemble `app/about/page.tsx`**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-about-page-migration.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-4): implement maison heritage and material swatches page"`

---

### Batch 5: Terms of Engagement with Sticky Scroll-Spy (`app/terms/page.tsx`)
**Files:**
- Create: `app/terms/page.tsx`
- Create: `components/terms/TermsScrollSpy.tsx`
- Modify: `components/layout/Footer.tsx` (link "Terms of Service" to `/terms`)
- Test: `tests/test-terms-migration.js`

- [ ] **Step 1: Write failing test `tests/test-terms-migration.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-terms-migration.js`
- [ ] **Step 3: Implement `TermsScrollSpy.tsx` and 6 statutory articles (including EU Right of Withdrawal)**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-terms-migration.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-5): implement terms of engagement with sticky scroll-spy"`

---

### Batch 6: Anatomical Size Guide & Visual Fit Calibrator (`app/size-guide/page.tsx`)
**Files:**
- Create: `app/size-guide/page.tsx`
- Create: `components/size-guide/AnatomicalVisualizer.tsx`
- Create: `components/size-guide/SizeConversionMatrix.tsx`
- Create: `components/size-guide/MeasurementGuide.tsx`
- Modify: `app/product/[id]/page.tsx` (wire "Size & Fit Guide" link)
- Test: `tests/test-size-guide-migration.js`

- [ ] **Step 1: Write failing test `tests/test-size-guide-migration.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-size-guide-migration.js`
- [ ] **Step 3: Implement visualizer with CM/IN sliders, drape modes, conversion matrix, and Concierge bridge**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-size-guide-migration.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-6): implement anatomical size guide and visual calibrator"`

---

### Batch 7: Client Sign-In Page with 1-Click Demo Login (`app/signin/page.tsx`)
**Files:**
- Create: `app/signin/page.tsx`
- Create: `components/auth/AuthLayout.tsx`
- Test: `tests/test-signin-migration.js`

- [ ] **Step 1: Write failing test `tests/test-signin-migration.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-signin-migration.js`
- [ ] **Step 3: Implement `AuthLayout.tsx` and `app/signin/page.tsx` with 1-click Demo filler (`julian.voss@atelier-client.de`)**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-signin-migration.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-7): implement client signin page with 1-click demo credentials"`

---

### Batch 8: Client Sign-Up Page with Real-Time Password Strength Meter (`app/signup/page.tsx`)
**Files:**
- Create: `app/signup/page.tsx`
- Create: `components/auth/PasswordStrengthMeter.tsx`
- Test: `tests/test-signup-migration.js`

- [ ] **Step 1: Write failing test `tests/test-signup-migration.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-signup-migration.js`
- [ ] **Step 3: Implement `PasswordStrengthMeter.tsx` and registration form with live requirements checklist**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-signup-migration.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-8): implement client signup with real-time password strength meter"`

---

### Batch 9: Client Style DNA Studio & Dynamic Recommendations (`app/profile/page.tsx`)
**Files:**
- Create: `app/profile/page.tsx`
- Create: `components/profile/StyleDNAStepper.tsx`
- Create: `components/profile/ActiveStyleRecommendations.tsx`
- Test: `tests/test-profile-migration.js`

- [ ] **Step 1: Write failing test `tests/test-profile-migration.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-profile-migration.js`
- [ ] **Step 3: Implement 4-dimension preference stepper (Direction, Silhouette, Palette, Lifestyle) and live product rail**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-profile-migration.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-9): implement style dna profile studio with dynamic recommendations"`

---

### Batch 10: PDP 3-Perspective Switcher & Specification Badges (`app/product/[id]/page.tsx`)
**Files:**
- Create: `components/product/PerspectiveSwitcher.tsx`
- Create: `components/product/SpecBadgesGrid.tsx`
- Modify: `app/product/[id]/page.tsx`
- Test: `tests/test-pdp-perspectives.js`

- [ ] **Step 1: Write failing test `tests/test-pdp-perspectives.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-pdp-perspectives.js`
- [ ] **Step 3: Implement `PerspectiveSwitcher.tsx` (Silhouette, Model, Macro) and `SpecBadgesGrid.tsx` in PDP**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-pdp-perspectives.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-10): implement pdp 3-perspective switcher and specification badges"`

---

### Batch 11: PDP AI Fit & Size Consultation Modal (`components/product/AIFitModal.tsx`)
**Files:**
- Create: `components/product/AIFitModal.tsx`
- Modify: `app/product/[id]/page.tsx` (wire "Ask AI Fit Consultant" button)
- Test: `tests/test-pdp-fit-modal.js`

- [ ] **Step 1: Write failing test `tests/test-pdp-fit-modal.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-pdp-fit-modal.js`
- [ ] **Step 3: Implement `AIFitModal.tsx` with recommendation algorithm, fit rationale, and 1-click size apply**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-pdp-fit-modal.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-11): implement pdp smart ai fit and size consultation modal"`

---

### Batch 12: PDP Complete the Look 3-Piece Bundle & Mobile Sticky Buy Bar
**Files:**
- Create: `components/product/CompleteLookBundle.tsx`
- Create: `components/product/MobileStickyBar.tsx`
- Modify: `app/product/[id]/page.tsx`
- Test: `tests/test-pdp-bundle-sticky.js`

- [ ] **Step 1: Write failing test `tests/test-pdp-bundle-sticky.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-pdp-bundle-sticky.js`
- [ ] **Step 3: Implement `CompleteLookBundle.tsx` with 10% bundle discount and `MobileStickyBar.tsx` with scroll observer**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-pdp-bundle-sticky.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-12): implement pdp complete look bundle and mobile sticky buy bar"`

---

### Batch 13: Category PLP Quick-Look Mini-PDP Slide-Over Drawer
**Files:**
- Create: `components/category/QuickLookMiniPDP.tsx`
- Modify: `components/category/ProductCardElevated.tsx`
- Modify: `app/category/page.tsx`
- Test: `tests/test-category-quicklook.js`

- [ ] **Step 1: Write failing test `tests/test-category-quicklook.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-category-quicklook.js`
- [ ] **Step 3: Implement `QuickLookMiniPDP.tsx` with gallery filmstrip, swatches, size picker, and 1-click Add to Bag**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-category-quicklook.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-13): implement plp quick look mini-pdp slide-over drawer"`

---

### Batch 14: Cart Hero Stats Strip & Bulk Depletion Actions (`app/cart/page.tsx`)
**Files:**
- Create: `components/cart/CartHeroStats.tsx`
- Modify: `app/cart/page.tsx`
- Test: `tests/test-cart-elevation.js`

- [ ] **Step 1: Write failing test `tests/test-cart-elevation.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-cart-elevation.js`
- [ ] **Step 3: Implement `CartHeroStats.tsx` with Total Pieces, Courier Cutoff, and 0-item depletion handling**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-cart-elevation.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-14): implement cart hero stats strip and bulk depletion actions"`

---

### Batch 15: Checkout bKash / Nagad MFS PIN Settlement Sheet Modal
**Files:**
- Create: `components/checkout/MfsPaymentSheet.tsx`
- Modify: `app/checkout/page.tsx`
- Test: `tests/test-checkout-mfs.js`

- [ ] **Step 1: Write failing test `tests/test-checkout-mfs.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-checkout-mfs.js`
- [ ] **Step 3: Implement `MfsPaymentSheet.tsx` with masked PIN, BDT rate conversion, and order completion**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-checkout-mfs.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-15): implement bkash and nagad mfs payment settlement sheet"`

---

### Batch 16: Checkout Proactive Savings Optimizer Banner
**Files:**
- Create: `components/checkout/SavingsOptimizerBanner.tsx`
- Modify: `app/checkout/page.tsx`
- Test: `tests/test-savings-optimizer.js`

- [ ] **Step 1: Write failing test `tests/test-savings-optimizer.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-savings-optimizer.js`
- [ ] **Step 3: Implement `SavingsOptimizerBanner.tsx` suggesting small tier upgrades for net higher discounts**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-savings-optimizer.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-16): implement checkout proactive savings optimizer banner"`

---

### Batch 17: Courier Tracking AI Logistics Concierge (`app/tracking/page.tsx`)
**Files:**
- Create: `components/tracking/AILogisticsAssistant.tsx`
- Modify: `app/tracking/page.tsx`
- Test: `tests/test-tracking-logistics-concierge.js`

- [ ] **Step 1: Write failing test `tests/test-tracking-logistics-concierge.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-tracking-logistics-concierge.js`
- [ ] **Step 3: Implement `AILogisticsAssistant.tsx` with interactive query chips and status explanation**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-tracking-logistics-concierge.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-17): implement interactive ai logistics concierge in tracking"`

---

### Batch 18: Client Services Desk & Atelier Directory (`app/contact/page.tsx`)
**Files:**
- Create: `components/contact/ServiceChannelsGrid.tsx`
- Create: `components/contact/BespokeSpotlight.tsx`
- Create: `components/contact/TicketDispatcherCard.tsx`
- Create: `components/contact/AteliersDirectory.tsx`
- Replace: `app/contact/page.tsx`
- Test: `tests/test-contact-elevation.js`

- [ ] **Step 1: Write failing test `tests/test-contact-elevation.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-contact-elevation.js`
- [ ] **Step 3: Implement service channels (Styling/Logistics/Legal), bespoke spotlight, ticket dispatcher, and boutique directory**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-contact-elevation.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-18): rebuild contact page as client services desk and atelier directory"`

---

### Batch 19: Global Dark Store Gate Modal & Header Delivery Hub Pill
**Files:**
- Create: `components/modals/DeliveryGateModal.tsx`
- Create: `store/useDeliveryGateStore.ts`
- Modify: `components/layout/Header.tsx` (add `#headerDeliveryHubPill`)
- Modify: `app/layout.tsx`
- Test: `tests/test-delivery-gate-global.js`

- [ ] **Step 1: Write failing test `tests/test-delivery-gate-global.js`**
- [ ] **Step 2: Run test to verify it fails:** `node tests/test-delivery-gate-global.js`
- [ ] **Step 3: Implement `useDeliveryGateStore.ts` and `DeliveryGateModal.tsx` supporting 3 European hubs**
- [ ] **Step 4: Run test to verify it passes:** `node tests/test-delivery-gate-global.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(batch-19): implement dark store gate modal and header delivery hub pill"`

---

### Batch 20: Global Intelligence Overlays, Subsystem Bridges & 7-Dimension SQA Verification
**Files:**
- Create: `components/modals/VisualSearchModal.tsx`
- Create: `components/modals/ComparisonModal.tsx`
- Create: `components/modals/CartRecoveryModal.tsx`
- Modify: `app/wishlist/page.tsx`, `app/discovery/page.tsx`, `app/smart-list/page.tsx`, `components/concierge/ConciergeDrawer.tsx`
- Create: `tests/run-full-migration-audit.js`
- Test: Complete test suite

- [ ] **Step 1: Implement Visual Search, Product Comparison, and Cart Abandonment Recovery modals**
- [ ] **Step 2: Wire Subsystem bridges (Wishlist Share, Discovery Pills, Smart List Cadence, Concierge in-chat checkout)**
- [ ] **Step 3: Execute clean Next.js production build (`npm run build`)**
- [ ] **Step 4: Execute all 20 automated test suites (`node tests/run-full-migration-audit.js`)**
- [ ] **Step 5: Capture visual verification screenshots for Desktop (`1440x900`) and Mobile (`375x812`)**
- [ ] **Step 6: Commit:** `git commit -m "chore(release): complete 20-batch nextjs storefront elevation and feature parity migration"`

---

## Verification Plan

### Automated Tests
* `npm run build` — 100% clean production build with 0 TypeScript/lint errors across 26 App Router routes.
* `npm test` — all deterministic tests pass.
* Individual batch test runner across all 20 batches:
  - `node tests/test-not-found-migration.js`
  - `node tests/test-cookie-consent.js`
  - `node tests/test-currency-switcher.js`
  - `node tests/test-about-page-migration.js`
  - `node tests/test-terms-migration.js`
  - `node tests/test-size-guide-migration.js`
  - `node tests/test-signin-migration.js`
  - `node tests/test-signup-migration.js`
  - `node tests/test-profile-migration.js`
  - `node tests/test-pdp-perspectives.js`
  - `node tests/test-pdp-fit-modal.js`
  - `node tests/test-pdp-bundle-sticky.js`
  - `node tests/test-category-quicklook.js`
  - `node tests/test-cart-elevation.js`
  - `node tests/test-checkout-mfs.js`
  - `node tests/test-savings-optimizer.js`
  - `node tests/test-tracking-logistics-concierge.js`
  - `node tests/test-contact-elevation.js`
  - `node tests/test-delivery-gate-global.js`
  - `node tests/run-full-migration-audit.js`

### Manual & Visual SQA Verification
* Verify across Desktop (`1440x900`) and Mobile (`375x812`).
* Assert 0-item depletion on list views (Cart, Wishlist, Smart List) with peripheral metrics reset.
* Assert 100% full-screen unclipped modal geometry on scaled laptop viewports (`1080p @ 125%`).
