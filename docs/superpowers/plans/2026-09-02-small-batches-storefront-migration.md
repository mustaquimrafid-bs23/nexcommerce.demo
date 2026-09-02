# Small-Batch Next.js Storefront Elevation & Feature Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan batch-by-batch and task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and migrate all missing storefront pages, incomplete features, and global interactive modals into Next.js 15 App Router using **6 small, bite-sized, low-risk batches** with full automated test coverage and 100% UX parity.

**Architecture:** Next.js 15 App Router with React 19, TypeScript, Tailwind CSS with Atelier Obsidian (`#012148`) and Warm Stone (`#F4F2EE`) tokens, Zustand state stores, Framer Motion / Motion, Lucide Icons, and Lenis smooth scrolling.

**Tech Stack:** Next.js 15.x, React 19, TypeScript, Tailwind CSS v4, Zustand 5, Motion (`motion/react`), Lucide React, Vitest / Node Test Runner.

---

## Global Constraints

* **Atelier Color Palette:** Retain full luxury palette (`#00142e` Deep Obsidian, `#012148` Obsidian Navy, `#0A2A54` Surface Navy, `#f4f2ee` Warm Stone, `#E60C45` Crimson, `#F13365` Radiant Pink, `#3DE0FF` Electric Cyan).
* **Typography:** Cormorant Garamond (`var(--font-serif)`) for editorial headlines, Inter (`var(--font-sans)`) for UI chrome/data, Manrope (`var(--font-display)`) for display numbers.
* **Plain & Everyday English:** Strict adherence to everyday English words; zero pseudo-academic jargon or buzzwords in customer copy.
* **Touch Targets & Accessibility:** All interactive elements $\ge 44\text{px}$ touch targets, visible focus indicators, WCAG 2.1 AA contrast ratios ($\ge 4.5:1$).
* **Small-Batch Isolation:** Each batch is self-contained with its own dedicated automated test suite and visual verification gate before moving to the next batch.

---

## Batch Roadmap Overview

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                      6-BATCH MODULAR MIGRATION ROADMAP                                 │
├────────────────────────────────┬───────────────────────────────────────────────────────┤
│ BATCH 1: Core Shell & Fallback │ 404 Recovery Gateway, Cookie Consent, Dual Currency    │
│ BATCH 2: Editorial & Heritage  │ Maison About, Terms & Legal, Anatomical Size Guide    │
│ BATCH 3: Identity & DNA Studio │ Sign-In (Demo SSO), Sign-Up (Strength), Style DNA     │
│ BATCH 4: PDP & PLP Experience  │ Perspective Switch, AI Fit, Bundle Buy, Mini-PDP      │
│ BATCH 5: Checkout & Logistics  │ Cart Hero, MFS (bKash/Nagad), AI Courier, Advisory    │
│ BATCH 6: Global Intelligence   │ Dark Store Hub, Visual Search, Compare, Recovery, SQA │
└────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

## Batch 1: Core Shell, Privacy & Currency Engine

### Task 1.1: 404 Luxury Recovery Gateway (`app/not-found.tsx`)
**Files:**
- Create: `app/not-found.tsx`
- Test: `tests/test-not-found-migration.js`

**Interfaces:**
- Consumes: Next.js standard 404 handler, `useSearchStore`.
- Produces: Luxury recovery UI with search bar, prompt chips, and 4 curated gateway wings.

- [ ] **Step 1: Write automated test for `app/not-found.tsx`**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `app/not-found.tsx` with watermark, recovery search, and curated wings**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit** (`git commit -m "feat(shell): implement luxury 404 recovery gateway"`)

---

### Task 1.2: Cookie Consent & Zero-Knowledge Privacy Banner
**Files:**
- Create: `components/layout/CookieConsentBanner.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/layout/Footer.tsx` (wire Cookie Settings trigger)
- Test: `tests/test-cookie-consent.js`

**Interfaces:**
- Consumes: `localStorage` key `nex_cookie_consent`.
- Produces: Floating privacy banner with "Acknowledge" and "Inspect Vault" buttons, re-openable from footer.

- [ ] **Step 1: Write automated test for Cookie Consent Banner**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `CookieConsentBanner.tsx` and wire in `Footer.tsx` and `RootLayout`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit** (`git commit -m "feat(shell): implement zero-knowledge cookie consent banner"`)

---

### Task 1.3: Real-Time Dual Currency Switcher (`EUR` / `BDT`)
**Files:**
- Create: `store/useCurrencyStore.ts`
- Modify: `components/layout/Header.tsx` (add currency toggle)
- Modify: `components/layout/Footer.tsx` (wire currency dropdown)
- Modify: `lib/utils.ts` (currency price formatter)
- Test: `tests/test-currency-switcher.js`

**Interfaces:**
- Consumes: Currency (`EUR` | `BDT`), rate (1 EUR = 132 BDT).
- Produces: Universal `formatPrice` utility and reactive header/footer toggles.

- [ ] **Step 1: Write automated test for Currency Switcher**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `useCurrencyStore.ts` and update `formatPrice`**
- [ ] **Step 4: Add currency dropdown in `Header.tsx` and `Footer.tsx`**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(shell): implement dual currency switcher with live conversion"`)

---

## Batch 2: Standalone Editorial & Brand Heritage Pages

### Task 2.1: Maison Heritage & Craftsmanship Page (`app/about/page.tsx`)
**Files:**
- Create: `app/about/page.tsx`
- Create: `components/about/AboutHeroSplit.tsx`
- Create: `components/about/MaterialsSection.tsx`
- Create: `components/about/DisciplinesGrid.tsx`
- Create: `components/about/CraftTimeline.tsx`
- Create: `components/about/GuardiansGrid.tsx`
- Modify: `components/layout/Footer.tsx` (link "About Us" to `/about`)
- Test: `tests/test-about-page-migration.js`

- [ ] **Step 1: Write automated test for `/about` structure and sections**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement modular components in `components/about/`**
- [ ] **Step 4: Assemble `app/about/page.tsx` and link in footer**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(editorial): implement maison heritage and materials page"`)

---

### Task 2.2: Terms of Engagement with Sticky Scroll-Spy (`app/terms/page.tsx`)
**Files:**
- Create: `app/terms/page.tsx`
- Create: `components/terms/TermsScrollSpy.tsx`
- Modify: `components/layout/Footer.tsx` (link "Terms of Service" to `/terms`)
- Test: `tests/test-terms-migration.js`

- [ ] **Step 1: Write automated test for `/terms` legal articles and scroll-spy**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `TermsScrollSpy.tsx` and 6 statutory articles (including EU Withdrawal Right)**
- [ ] **Step 4: Assemble `app/terms/page.tsx` and update footer link**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(editorial): implement terms of engagement with scroll-spy"`)

---

### Task 2.3: Anatomical Size Guide & Calibrator (`app/size-guide/page.tsx`)
**Files:**
- Create: `app/size-guide/page.tsx`
- Create: `components/size-guide/AnatomicalVisualizer.tsx`
- Create: `components/size-guide/SizeConversionMatrix.tsx`
- Create: `components/size-guide/MeasurementGuide.tsx`
- Modify: `app/product/[id]/page.tsx` (wire "Size & Fit Guide" link)
- Test: `tests/test-size-guide-migration.js`

- [ ] **Step 1: Write automated test for Size Guide dual unit conversions and visualizer**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `AnatomicalVisualizer.tsx` with CM/IN sliders and drape modes**
- [ ] **Step 4: Implement `SizeConversionMatrix.tsx` and `MeasurementGuide.tsx`**
- [ ] **Step 5: Assemble `app/size-guide/page.tsx` with Concierge styling bridge**
- [ ] **Step 6: Run test to verify it passes**
- [ ] **Step 7: Commit** (`git commit -m "feat(editorial): implement anatomical size guide and visual calibrator"`)

---

## Batch 3: Client Identity & Personalization Studio

### Task 3.1: Client Sign-In with 1-Click Demo Credentials (`app/signin/page.tsx`)
**Files:**
- Create: `app/signin/page.tsx`
- Create: `components/auth/AuthLayout.tsx`
- Test: `tests/test-signin-migration.js`

- [ ] **Step 1: Write automated test for Sign-In demo fill and redirects**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `AuthLayout.tsx` and `app/signin/page.tsx` with 1-click Demo Account filler**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit** (`git commit -m "feat(auth): implement client signin page with 1-click demo login"`)

---

### Task 3.2: Client Sign-Up with Password Strength Validator (`app/signup/page.tsx`)
**Files:**
- Create: `app/signup/page.tsx`
- Create: `components/auth/PasswordStrengthMeter.tsx`
- Test: `tests/test-signup-migration.js`

- [ ] **Step 1: Write automated test for live strength meter and validation rules**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `PasswordStrengthMeter.tsx` and `app/signup/page.tsx`**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit** (`git commit -m "feat(auth): implement client signup with real-time password strength meter"`)

---

### Task 3.3: Client Style DNA Studio & Live Recommendations (`app/profile/page.tsx`)
**Files:**
- Create: `app/profile/page.tsx`
- Create: `components/profile/StyleDNAStepper.tsx`
- Create: `components/profile/ActiveStyleRecommendations.tsx`
- Test: `tests/test-profile-migration.js`

- [ ] **Step 1: Write automated test for 4 preference dimensions and live product rail**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `StyleDNAStepper.tsx` and `ActiveStyleRecommendations.tsx`**
- [ ] **Step 4: Assemble `app/profile/page.tsx` with reset/purge capabilities**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(profile): implement style dna studio with live recommendations"`)

---

## Batch 4: PDP & PLP Merchandising Elevation

### Task 4.1: PDP 3-Perspective Switcher & Artisanal Specification Badges
**Files:**
- Create: `components/product/PerspectiveSwitcher.tsx`
- Create: `components/product/SpecBadgesGrid.tsx`
- Modify: `app/product/[id]/page.tsx`
- Test: `tests/test-pdp-perspectives.js`

- [ ] **Step 1: Write automated test for Perspective switching (Silhouette, Model, Macro)**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `PerspectiveSwitcher.tsx` and `SpecBadgesGrid.tsx`**
- [ ] **Step 4: Mount components into `app/product/[id]/page.tsx`**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(pdp): implement 3-perspective switcher and spec badges"`)

---

### Task 4.2: PDP AI Fit & Size Consultation Modal
**Files:**
- Create: `components/product/AIFitModal.tsx`
- Modify: `app/product/[id]/page.tsx` (wire "Ask AI Fit Consultant" button)
- Test: `tests/test-pdp-fit-modal.js`

- [ ] **Step 1: Write automated test for Fit Consultation inputs and size recommendation**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `AIFitModal.tsx` with recommendation algorithm and 1-click size apply**
- [ ] **Step 4: Wire trigger into PDP**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(pdp): implement smart ai fit and size consultation modal"`)

---

### Task 4.3: PDP Complete the Look 3-Piece Outfit Bundle & Mobile Sticky Bar
**Files:**
- Create: `components/product/CompleteLookBundle.tsx`
- Create: `components/product/MobileStickyBar.tsx`
- Modify: `app/product/[id]/page.tsx`
- Test: `tests/test-pdp-bundle-sticky.js`

- [ ] **Step 1: Write automated test for 1-click 3-item bundle checkout and sticky buy bar**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `CompleteLookBundle.tsx` with bundle discount calculation**
- [ ] **Step 4: Implement `MobileStickyBar.tsx` with scroll observer**
- [ ] **Step 5: Mount in PDP**
- [ ] **Step 6: Run test to verify it passes**
- [ ] **Step 7: Commit** (`git commit -m "feat(pdp): implement complete look 3-piece bundle and mobile sticky bar"`)

---

### Task 4.4: Category PLP Quick-Look Mini-PDP Slide-Over Drawer
**Files:**
- Create: `components/category/QuickLookMiniPDP.tsx`
- Modify: `components/category/ProductCardElevated.tsx`
- Modify: `app/category/page.tsx`
- Test: `tests/test-category-quicklook.js`

- [ ] **Step 1: Write automated test for Quick Look drawer launch without page reload**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `QuickLookMiniPDP.tsx` with multi-angle gallery, swatches, and size picker**
- [ ] **Step 4: Wire Quick Look button in product cards**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(category): implement quick look mini-pdp slide-over drawer"`)

---

## Batch 5: Commerce Optimization, Logistics & Advisory Services

### Task 5.1: Cart Hero Stats Strip & Bulk Depletion Actions
**Files:**
- Create: `components/cart/CartHeroStats.tsx`
- Modify: `app/cart/page.tsx`
- Test: `tests/test-cart-elevation.js`

- [ ] **Step 1: Write automated test for Cart Hero counters and "Clear All" / "Save All" actions**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `CartHeroStats.tsx` with 0-item depletion handling**
- [ ] **Step 4: Mount in `app/cart/page.tsx`**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(cart): implement cart hero stats strip and bulk actions"`)

---

### Task 5.2: Checkout bKash / Nagad MFS PIN Sheet & Savings Optimizer Banner
**Files:**
- Create: `components/checkout/MfsPaymentSheet.tsx`
- Create: `components/checkout/SavingsOptimizerBanner.tsx`
- Modify: `app/checkout/page.tsx`
- Test: `tests/test-checkout-mfs-optimizer.js`

- [ ] **Step 1: Write automated test for MFS PIN sheet modal and threshold optimizer banner**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `MfsPaymentSheet.tsx` with masked PIN and BDT rate conversion**
- [ ] **Step 4: Implement `SavingsOptimizerBanner.tsx` with discount threshold advice**
- [ ] **Step 5: Mount in `app/checkout/page.tsx`**
- [ ] **Step 6: Run test to verify it passes**
- [ ] **Step 7: Commit** (`git commit -m "feat(checkout): implement bkash/nagad mfs sheet and savings optimizer"`)

---

### Task 5.3: Courier Tracking AI Logistics Concierge (`app/tracking/page.tsx`)
**Files:**
- Create: `components/tracking/AILogisticsAssistant.tsx`
- Modify: `app/tracking/page.tsx`
- Test: `tests/test-tracking-logistics-concierge.js`

- [ ] **Step 1: Write automated test for conversational logistics questions and status explanation**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `AILogisticsAssistant.tsx` with query chips and telemetry feedback**
- [ ] **Step 4: Mount in `app/tracking/page.tsx`**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(tracking): implement interactive ai logistics concierge"`)

---

### Task 5.4: Client Services Desk & Atelier Directory (`app/contact/page.tsx`)
**Files:**
- Create: `components/contact/ServiceChannelsGrid.tsx`
- Create: `components/contact/BespokeSpotlight.tsx`
- Create: `components/contact/TicketDispatcherCard.tsx`
- Create: `components/contact/AteliersDirectory.tsx`
- Replace: `app/contact/page.tsx`
- Test: `tests/test-contact-elevation.js`

- [ ] **Step 1: Write automated test for ticket generation code, channels grid, and physical boutiques**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement service channels, bespoke look spotlight, ticket generator, and directory**
- [ ] **Step 4: Assemble `app/contact/page.tsx`**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(contact): rebuild contact page as client services desk"`)

---

## Batch 6: Global Intelligence Overlays & SQA Verification

### Task 6.1: Global Dark Store Gate Modal & Delivery Hub Header Pill
**Files:**
- Create: `components/modals/DeliveryGateModal.tsx`
- Create: `store/useDeliveryGateStore.ts`
- Modify: `components/layout/Header.tsx` (add `#headerDeliveryHubPill`)
- Modify: `app/layout.tsx`
- Test: `tests/test-delivery-gate-global.js`

- [ ] **Step 1: Write automated test for delivery hub pill and cutoff timer modal**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `useDeliveryGateStore.ts` and `DeliveryGateModal.tsx` for 3 European hubs**
- [ ] **Step 4: Mount pill in Header and modal in RootLayout**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(global): implement dark store gate modal and delivery hub header pill"`)

---

### Task 6.2: Multimodal Visual Search Modal with Neural Vector Matching
**Files:**
- Create: `components/modals/VisualSearchModal.tsx`
- Create: `store/useVisualSearchStore.ts`
- Modify: `components/search/SearchOverlay.tsx` (wire Camera button)
- Modify: `app/discovery/page.tsx` (wire Camera button)
- Modify: `app/layout.tsx`
- Test: `tests/test-visual-search-modal.js`

- [ ] **Step 1: Write automated test for drag-and-drop image upload and sample looks**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `VisualSearchModal.tsx` with vector matching against catalog**
- [ ] **Step 4: Mount modal in RootLayout and wire search triggers**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(global): implement visual search modal with neural vector matching"`)

---

### Task 6.3: Side-by-Side Product Comparison Spec Matrix Modal
**Files:**
- Create: `components/modals/ComparisonModal.tsx`
- Create: `store/useComparisonStore.ts`
- Modify: `app/layout.tsx`
- Test: `tests/test-comparison-modal.js`

- [ ] **Step 1: Write automated test for differential comparison matrix and advisor verdict**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `useComparisonStore.ts` and `ComparisonModal.tsx`**
- [ ] **Step 4: Mount in RootLayout and connect PDP/PLP compare triggers**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(global): implement side-by-side product comparison modal"`)

---

### Task 6.4: Cart Abandonment Recovery 15-Minute Hold Modal
**Files:**
- Create: `components/modals/CartRecoveryModal.tsx`
- Create: `hooks/useCartRecovery.ts`
- Modify: `app/layout.tsx`
- Test: `tests/test-cart-recovery-modal.js`

- [ ] **Step 1: Write automated test for mouseleave exit-intent trigger and countdown timer**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `useCartRecovery.ts` and `CartRecoveryModal.tsx`**
- [ ] **Step 4: Mount in RootLayout**
- [ ] **Step 5: Run test to verify it passes**
- [ ] **Step 6: Commit** (`git commit -m "feat(global): implement cart abandonment recovery modal"`)

---

### Task 6.5: Subsystem Integrations & AI Concierge Safeguards
**Files:**
- Modify: `app/wishlist/page.tsx` (Share link & Stylist bridge)
- Modify: `app/discovery/page.tsx` (Removable Understood Context pills)
- Modify: `app/smart-list/page.tsx` (Replenishment cadence popover)
- Modify: `components/concierge/ConciergeDrawer.tsx` (In-chat checkout & DLP card guard)
- Test: `tests/test-subsystem-features.js`

- [ ] **Step 1: Write automated test for all 4 subsystem bridges**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement subsystem enhancements**
- [ ] **Step 4: Run test to verify it passes**
- [ ] **Step 5: Commit** (`git commit -m "feat(subsystems): implement wishlist share, discovery pills, and in-chat checkout"`)

---

### Task 6.6: End-to-End Production Build & 7-Dimension SQA Verification
**Files:**
- Create: `tests/run-full-migration-audit.js`
- Test: Complete test suite

- [ ] **Step 1: Execute clean production build**
  Run: `npm run build`
  Expected: 0 errors across all 26 App Router routes.
- [ ] **Step 2: Run all automated unit and functional tests**
  Run: `npm test` & `node tests/run-full-migration-audit.js`
  Expected: 100% passing tests.
- [ ] **Step 3: Capture visual verification evidence for Desktop (`1440x900`) and Mobile (`375x812`)**
- [ ] **Step 4: Final commit** (`git commit -m "chore(release): complete 6-batch nextjs storefront elevation migration"`)

---

## Verification Plan

### Automated Tests
* Run `npm run build` to assert zero TypeScript and route configuration errors.
* Run `npm test` to execute all unit tests.
* Execute individual batch test scripts:
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
  - `node tests/test-checkout-mfs-optimizer.js`
  - `node tests/test-tracking-logistics-concierge.js`
  - `node tests/test-contact-elevation.js`
  - `node tests/test-delivery-gate-global.js`
  - `node tests/test-visual-search-modal.js`
  - `node tests/test-comparison-modal.js`
  - `node tests/test-cart-recovery-modal.js`
  - `node tests/test-subsystem-features.js`

### Manual & Visual Verification
* Browser review across Desktop (`1440x900`) and Mobile (`375x812`) viewports using Playwright.
* Verify 0-item list depletion across Cart, Wishlist, and Smart List.
* Verify modal z-indexes and 100% unclipped geometries on scaled laptop displays (`1080p @ 125%`).
