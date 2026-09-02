# Full Next.js Storefront Elevation & Feature Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate and elevate all missing pages, incomplete features, and global interactive modals from the reference branch `feature/storefront-elevation` to Next.js 15 App Router (`ubgrade`), achieving 100% feature, content, and UX parity with zero regressions.

**Architecture:** Next.js 15 App Router with React 19, TypeScript, Tailwind CSS with Atelier Obsidian (`#012148`) and Warm Stone (`#F4F2EE`) tokens, Zustand state persistence (`localStorage`), Framer Motion / Motion, Lucide Icons, and Lenis smooth scrolling.

**Tech Stack:** Next.js 15.x, React 19, TypeScript, Tailwind CSS v4, Zustand 5, Motion (`motion/react`), Lucide React, Vitest.

---

## Global Constraints

* **Atelier Color Palette:** Retain full luxury palette (`#00142e` Deep Obsidian, `#012148` Obsidian Navy, `#0A2A54` Surface Navy, `#f4f2ee` Warm Stone, `#E60C45` Crimson, `#F13365` Radiant Pink, `#3DE0FF` Electric Cyan).
* **Typography:** Cormorant Garamond (`var(--font-serif)`) for editorial headlines, Inter (`var(--font-sans)`) for UI chrome/data, Manrope (`var(--font-display)`) for display numbers.
* **Plain & Everyday English:** Strict adherence to everyday English words; zero pseudo-academic jargon or buzzwords in customer copy.
* **Touch Targets & Accessibility:** All interactive elements $\ge 44\text{px}$ touch targets, visible focus indicators, WCAG 2.1 AA contrast ratios ($\ge 4.5:1$).
* **100% Parity with `feature/storefront-elevation`:** Every interactive trigger, drawer, calculation, and empty state must match the reference branch.

---

## Migration Breakdown by Subsystem

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     NEXCOMMERCE FULL MIGRATION ROADMAP                          │
├───────────────────┬───────────────────┬───────────────────┬─────────────────────┤
│  1. MISSING PAGES │ 2. PDP ELEVATION  │ 3. GLOBAL MODALS  │ 4. COMMERCE POLISH  │
├───────────────────┼───────────────────┼───────────────────┼─────────────────────┤
│ • /about          │ • 3 Perspectives  │ • Dark Store Gate │ • bKash/Nagad MFS   │
│ • /signin         │ • AI Fit Modal    │ • Visual Search   │ • Savings Optimizer │
│ • /signup         │ • Side Comparison │ • Compare Modal   │ • Logistics Chat    │
│ • /size-guide     │ • Stylist Trigger │ • Cart Recovery   │ • 4-Step Checkout   │
│ • /terms          │ • Complete Look   │ • Cookie Consent  │ • Currency Switch   │
│ • /profile        │ • Mobile Stick CTA│ • Share Wishlist  │ • 0-Item Depletion  │
│ • /not-found (404)│ • Spec Badges     │ • Context Pills   │ • SQA Verification  │
└───────────────────┴───────────────────┴───────────────────┴─────────────────────┘
```

---

### Task 1: Migrate Maison Heritage & Manifesto Page (`app/about/page.tsx`)

**Files:**
- Create: `app/about/page.tsx`
- Create: `components/about/AboutHeroSplit.tsx`
- Create: `components/about/MaterialsSection.tsx`
- Create: `components/about/DisciplinesGrid.tsx`
- Create: `components/about/CraftTimeline.tsx`
- Create: `components/about/GuardiansGrid.tsx`
- Modify: `components/layout/Footer.tsx:93-98` (update "About Us" link to `/about`)
- Test: `tests/test-about-page-migration.js`

**Interfaces:**
- Consumes: Atelier design tokens, Lucide icons, `data/products.ts`.
- Produces: Complete `/about` route with 7 sections matching `pages/about.html`.

- [ ] **Step 1: Write automated test for `/about` route content and landmarks**
Create `tests/test-about-page-migration.js` asserting presence of `#aboutHeroSection`, `#materialsSection`, `#disciplinesSection`, `#timelineSection`, `#guardiansSection`, and valid link in footer.

- [ ] **Step 2: Run test to verify it fails**
Run: `node tests/test-about-page-migration.js`
Expected: FAIL (route / component not found).

- [ ] **Step 3: Implement `AboutHeroSplit.tsx`**
Split layout featuring Cormorant Garamond headline *"Crafted with Architectural Restraint"*, editorial manifesto, navigation rail, and visual photographic card with artisan badge.

- [ ] **Step 4: Implement `MaterialsSection.tsx` with Interactive Fabric Swatches**
Mongolian Cashmere, Tuscan Vegetable-Tanned Leather, Beryllium Acoustic Diaphragms, and Australian Merino Wool cards with tactile macro details.

- [ ] **Step 5: Implement `DisciplinesGrid.tsx`, `CraftTimeline.tsx`, and `GuardiansGrid.tsx`**
Port the 4-discipline grid, historical milestone timeline (1998–2026), and master artisan profiles from `pages/about.html`.

- [ ] **Step 6: Assemble `app/about/page.tsx` and update footer link**
Update `components/layout/Footer.tsx` line 94 so `href="/about"` rather than `/discovery`.

- [ ] **Step 7: Run test to verify it passes**
Run: `node tests/test-about-page-migration.js`
Expected: PASS.

- [ ] **Step 8: Commit**
`git commit -m "feat: implement about page with craftsmanship manifesto and material swatches"`

---

### Task 2: Migrate Client Authentication Suite (`app/signin/page.tsx` & `app/signup/page.tsx`)

**Files:**
- Create: `app/signin/page.tsx`
- Create: `app/signup/page.tsx`
- Create: `components/auth/AuthLayout.tsx`
- Create: `components/auth/PasswordStrengthMeter.tsx`
- Modify: `components/account/SignedOutView.tsx`
- Test: `tests/test-auth-migration.js`

**Interfaces:**
- Consumes: Zustand store, session storage `nex_session`.
- Produces: Standalone `/signin` and `/signup` routes with 1-click Demo Account pre-filler (`#quickDemoBtn`), live password validator, and `returnUrl` redirection.

- [ ] **Step 1: Write automated test for `/signin` and `/signup`**
Create `tests/test-auth-migration.js` verifying demo quick-fill, form input bindings, strength meter threshold evaluation (Red/Yellow/Cyan), and URL redirection.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-auth-migration.js`
Expected: FAIL.

- [ ] **Step 3: Implement `components/auth/AuthLayout.tsx`**
Reusable split-screen layout with Ken Burns high-fashion photography on left, literary quotes, and centered auth card on right.

- [ ] **Step 4: Implement `components/auth/PasswordStrengthMeter.tsx`**
3-tier GPU animated strength track evaluating length, casing, numbers, and symbols.

- [ ] **Step 5: Implement `app/signin/page.tsx`**
Email, password with visibility toggle, "Remember Me", Google/Apple SSO triggers, and 1-click Quick Demo Credentials button pre-populating `julian.voss@atelier-client.de`.

- [ ] **Step 6: Implement `app/signup/page.tsx`**
Registration form with live requirements checklist, password strength meter, privilege list, and onboarding confirmation screen.

- [ ] **Step 7: Run test to verify passing**
Run: `node tests/test-auth-migration.js`
Expected: PASS.

- [ ] **Step 8: Commit**
`git commit -m "feat: implement standalone signin and signup pages with password strength validation"`

---

### Task 3: Migrate Anatomical Size Guide & Fit Calibrator (`app/size-guide/page.tsx`)

**Files:**
- Create: `app/size-guide/page.tsx`
- Create: `components/size-guide/AnatomicalVisualizer.tsx`
- Create: `components/size-guide/SizeConversionMatrix.tsx`
- Create: `components/size-guide/MeasurementGuide.tsx`
- Modify: `app/product/[id]/page.tsx` (wire "Size & Fit Guide" link to `/size-guide`)
- Test: `tests/test-size-guide-migration.js`

**Interfaces:**
- Consumes: Measurement state (Height, Chest, Waist, Inseam) and Unit toggle (`cm` vs `in`).
- Produces: Live size calibration, vector silhouette adjustments, and deep-link bridge to Concierge sizing advisor.

- [ ] **Step 1: Write automated test for `/size-guide`**
Create `tests/test-size-guide-migration.js` asserting slider changes update recommended sizes, unit toggle accurately converts inches to centimeters, and conversion table renders all regions.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-size-guide-migration.js`
Expected: FAIL.

- [ ] **Step 3: Implement `AnatomicalVisualizer.tsx`**
Interactive dual sliders with Unit toggle (`CM` / `IN`), Drape radio group (Fitted, Regular, Relaxed), live proportion calculations, and recommended size badge with AI confidence score.

- [ ] **Step 4: Implement `SizeConversionMatrix.tsx` and `MeasurementGuide.tsx`**
Department tabs (Apparel, Footwear, Tailoring) with international size mappings (US, UK, EU, JP, IT) and illustrated measurement guidelines.

- [ ] **Step 5: Assemble `app/size-guide/page.tsx` with Concierge Bridge**
Add CTA button "Need a Tailor's Advice? Ask Style Concierge" pre-loading sizing context into `useConciergeStore`.

- [ ] **Step 6: Run test to verify passing**
Run: `node tests/test-size-guide-migration.js`
Expected: PASS.

- [ ] **Step 7: Commit**
`git commit -m "feat: implement anatomical size guide with live slider visualizer and conversion matrix"`

---

### Task 4: Migrate Maison Terms of Engagement (`app/terms/page.tsx`)

**Files:**
- Create: `app/terms/page.tsx`
- Create: `components/terms/TermsScrollSpy.tsx`
- Modify: `components/layout/Footer.tsx:112-117,173-176` (link "Terms of Service" to `/terms`)
- Test: `tests/test-terms-migration.js`

**Interfaces:**
- Consumes: IntersectionObserver for active section highlighting.
- Produces: 6 statutory articles with high-contrast legal callout capsules and European 14-Day Right of Withdrawal (*Widerrufsbelehrung*).

- [ ] **Step 1: Write automated test for `/terms`**
Create `tests/test-terms-migration.js` asserting all 6 legal articles exist, Widerrufsbelehrung statutory copy is present, and footer links resolve to `/terms`.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-terms-migration.js`
Expected: FAIL.

- [ ] **Step 3: Implement `app/terms/page.tsx` and `TermsScrollSpy.tsx`**
Sticky sidebar table of contents tracking active viewport scroll position, rendering all 6 articles with statutory German/European consumer protection clauses and Concierge arbitration bridge.

- [ ] **Step 4: Update `Footer.tsx` links**
Update footer links for "Terms of Service" and bottom bar "Terms" from `/privacy` to `/terms`.

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-terms-migration.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat: implement terms of service with scroll spy navigation and statutory articles"`

---

### Task 5: Migrate Standalone Client Style DNA Studio (`app/profile/page.tsx`)

**Files:**
- Create: `app/profile/page.tsx`
- Create: `components/profile/StyleDNAStepper.tsx`
- Create: `components/profile/ActiveStyleRecommendations.tsx`
- Test: `tests/test-profile-migration.js`

**Interfaces:**
- Consumes: 4 preference dimensions: Direction, Silhouette, Palette, Lifestyle Routine.
- Produces: Real-time product recommendations rail and localStorage persistence in `nex_client_profile`.

- [ ] **Step 1: Write automated test for `/profile`**
Create `tests/test-profile-migration.js` asserting 4 preference sections, calibration completion progress bar, live recommendation filtering, and signal purge.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-profile-migration.js`
Expected: FAIL.

- [ ] **Step 3: Implement `StyleDNAStepper.tsx`**
Interactive cards for:
1. Primary Aesthetic (Minimalist, Contemporary, Classic, Technical)
2. Silhouette Drape (Tailored, Regular, Relaxed)
3. Preferred Palette (Obsidian & Monochromes, Earth & Camel, Navy & Slate, Muted Pastels)
4. Weekly Routine (Office Tailoring, Weekend Leisure, Travel Transit, Evening Gala)
With glowing cyan selection states and calibration meter.

- [ ] **Step 4: Implement `ActiveStyleRecommendations.tsx`**
Dynamic product cards populated based on the active selection state with 1-click Add to Bag.

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-profile-migration.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat: implement standalone style dna profile studio with dynamic recommendations"`

---

### Task 6: Migrate Atelier 404 Recovery Gateway (`app/not-found.tsx`)

**Files:**
- Create: `app/not-found.tsx`
- Test: `tests/test-not-found-migration.js`

**Interfaces:**
- Consumes: Next.js standard 404 handler.
- Produces: Luxury recovery UI with search bar, prompt chips, and 4 gateway wings.

- [ ] **Step 1: Write automated test for `app/not-found.tsx`**
Create `tests/test-not-found-migration.js` verifying the recovery page mounts on invalid routes, renders 404 watermark, recovery search bar, and 4 navigation wings.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-not-found-migration.js`
Expected: FAIL.

- [ ] **Step 3: Implement `app/not-found.tsx`**
Typographic watermark "404", headline *"Destination Unavailable"*, natural search bar connecting to search store, prompt chips ("Find cashmere overcoats", "Tailored trousers"), and 4 gateway cards:
1. Smart List & Vault
2. Tailored Silhouettes
3. High Acoustics & Watches
4. Style Concierge

- [ ] **Step 4: Run test to verify passing**
Run: `node tests/test-not-found-migration.js`
Expected: PASS.

- [ ] **Step 5: Commit**
`git commit -m "feat: implement luxury atelier 404 recovery gateway with curated wings"`

---

### Task 7: Elevate Product Detail Page (PDP) to 100% Parity (`app/product/[id]/page.tsx`)

**Files:**
- Modify: `app/product/[id]/page.tsx`
- Create: `components/product/PerspectiveSwitcher.tsx`
- Create: `components/product/AIFitModal.tsx`
- Create: `components/product/CompleteLookBundle.tsx`
- Create: `components/product/MobileStickyBar.tsx`
- Create: `components/product/SpecBadgesGrid.tsx`
- Test: `tests/test-pdp-elevation-8features.js`

**Interfaces:**
- Consumes: `MASTER_PRODUCTS`, `useCartStore`, `useWishlistStore`, `useConciergeStore`.
- Produces: 8 signature features:
  1. 3-Perspective Switcher (Silhouette / Model / Macro)
  2. Smart AI Fit & Sizing Consultation Modal
  3. Side-by-Side Product Comparison action
  4. Dedicated Ask Stylist Trigger with product context
  5. 3-piece Complete the Look bundle with 1-click batch add
  6. Mobile Sticky Purchase Bar
  7. Statutory VAT & duties notice
  8. Artisanal specification badges

- [ ] **Step 1: Write comprehensive 8-feature test for PDP**
Create `tests/test-pdp-elevation-8features.js` testing all 8 features on `/product/p3`.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-pdp-elevation-8features.js`
Expected: FAIL (missing selectors and components).

- [ ] **Step 3: Implement `PerspectiveSwitcher.tsx`**
Tabs: `Perspective: Silhouette`, `Perspective: Model / Styling`, `Perspective: Macro / Texture` switching gallery stage image.

- [ ] **Step 4: Implement `AIFitModal.tsx` (`#pdpFitModal`)**
Height, Weight, Fit Preference inputs calculating recommended size with AI explanation and 1-click Apply Size button.

- [ ] **Step 5: Implement `CompleteLookBundle.tsx` (`#pdpCompleteLookSection`)**
3-item coordinated outfit bundle with "SAVE 10%" badge, bundle pricing math, and single **"Add All to Bag (3 items)"** 1-click action.

- [ ] **Step 6: Implement `MobileStickyBar.tsx` (`#mobileStickyBar`)**
IntersectionObserver-driven floating bottom bar on mobile with price, selected variant label, and ADD TO BAG button.

- [ ] **Step 7: Add Compare Button, Concierge Trigger, VAT Tag, and Spec Badges**
Wire compare action to trigger global comparison modal, wire stylist button to launch `useConciergeStore` with active product context, add VAT notice and spec badges grid.

- [ ] **Step 8: Run test to verify passing**
Run: `node tests/test-pdp-elevation-8features.js`
Expected: PASS (all 8 features verified).

- [ ] **Step 9: Commit**
`git commit -m "feat(pdp): elevate product detail page with 8 signature features including fit modal and bundle checkout"`

---

### Task 8: Elevate Client Services Desk & Advisory Page (`app/contact/page.tsx`)

**Files:**
- Replace: `app/contact/page.tsx`
- Create: `components/contact/ServiceChannelsGrid.tsx`
- Create: `components/contact/BespokeSpotlight.tsx`
- Create: `components/contact/TicketDispatcherCard.tsx`
- Create: `components/contact/AteliersDirectory.tsx`
- Test: `tests/test-contact-elevation.js`

**Interfaces:**
- Consumes: Ticket generation engine, atelier boutique data.
- Produces: Standalone luxury Concierge & Advisory desk matching `pages/contact.html`.

- [ ] **Step 1: Write automated test for `/contact`**
Create `tests/test-contact-elevation.js` asserting ticket dispatching, channels grid, bespoke spotlight, and atelier physical directory.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-contact-elevation.js`
Expected: FAIL.

- [ ] **Step 3: Implement `ServiceChannelsGrid.tsx`**
3 channels: Styling (Live 24/7), Logistics (<15m SLA), Legal & Bespoke Commissions.

- [ ] **Step 4: Implement `BespokeSpotlight.tsx`**
Curated bespoke look presentation with progress bar, active look tabs, and floating product pills.

- [ ] **Step 5: Implement `TicketDispatcherCard.tsx`**
Form generating reference code (e.g. `TKT-9956-NX`) with category select, email, inquiry, and cryptographic security token.

- [ ] **Step 6: Implement `AteliersDirectory.tsx`**
Global physical locations: Berlin Mitte, Paris Le Marais, London Mayfair, Milan Quadrilatero, Tokyo Ginza.

- [ ] **Step 7: Assemble `app/contact/page.tsx`**
Remove placeholder re-export and assemble the complete editorial experience.

- [ ] **Step 8: Run test to verify passing**
Run: `node tests/test-contact-elevation.js`
Expected: PASS.

- [ ] **Step 9: Commit**
`git commit -m "feat(contact): rebuild contact page as dedicated luxury concierge and advisory desk"`

---

### Task 9: Homepage Polish & Mount Built Components (`app/page.tsx`)

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/home/EditorialBanner.tsx`
- Create: `components/home/LookbookModal.tsx`
- Test: `tests/test-home-elevation.js`

**Interfaces:**
- Consumes: `CategoryTiles`, `RecentlyViewedRail`, `TrustStrip`, `LookbookModal`.
- Produces: Complete 8-section homepage layout with multi-hotspot lookbook inspection.

- [ ] **Step 1: Write automated test for Homepage structure**
Verify all 8 sections are mounted: Hero, Deals, Intent Search, Curated Grid, Category Tiles, Editorial Banner, Recently Viewed Rail, and Trust Strip.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-home-elevation.js`
Expected: FAIL (missing sections).

- [ ] **Step 3: Mount `CategoryTiles`, `RecentlyViewedRail`, and `TrustStrip` in `app/page.tsx`**
Place `CategoryTiles` after Curated Grid, `RecentlyViewedRail` after Editorial Banner, and `TrustStrip` before footer.

- [ ] **Step 4: Implement `LookbookModal.tsx`**
Interactive full-screen modal inspecting multiple runway look hot spots with 1-click Quick Add.

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-home-elevation.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat(home): mount category tiles, recently viewed rail, trust strip, and lookbook modal"`

---

### Task 10: Category PLP Quick-Look Mini-PDP Drawer Integration (`app/category/page.tsx`)

**Files:**
- Modify: `components/category/ProductCardElevated.tsx`
- Modify: `app/category/page.tsx`
- Create: `components/category/QuickLookMiniPDP.tsx`
- Test: `tests/test-category-quicklook.js`

**Interfaces:**
- Consumes: Product selected for quick look.
- Produces: In-drawer Mini-PDP with thumbnail switching, finish swatches, size picker, and 1-click Add to Bag without page navigation.

- [ ] **Step 1: Write automated test for Quick Look drawer on `/category`**
Assert clicking quick view icon opens `#plpQuickLookDrawer` without navigating away from `/category`.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-category-quicklook.js`
Expected: FAIL.

- [ ] **Step 3: Implement `QuickLookMiniPDP.tsx`**
Slide-over drawer with multi-angle gallery, swatches, size buttons, price computation, and 1-click Add to Bag.

- [ ] **Step 4: Wire eye button in `ProductCardElevated.tsx` to trigger Quick Look drawer**

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-category-quicklook.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat(category): add quick look mini-pdp slide-over drawer to collections grid"`

---

### Task 11: Elevate Cart & Checkout with MFS Settlement and Savings Optimizer

**Files:**
- Modify: `app/cart/page.tsx`
- Modify: `app/checkout/page.tsx`
- Create: `components/cart/CartHeroStats.tsx`
- Create: `components/checkout/MfsPaymentSheet.tsx` (bKash & Nagad PIN sheet modal)
- Create: `components/checkout/SavingsOptimizerBanner.tsx`
- Test: `tests/test-cart-checkout-elevation.js`

**Interfaces:**
- Consumes: `useCartStore`, BDT conversion rate (1 EUR = 132 BDT), bKash/Nagad validation.
- Produces: Cart stats header, bulk actions, MFS payment modal with masked PIN, savings alert banner.

- [ ] **Step 1: Write automated test for Cart & Checkout elevation**
Assert Cart Hero stats render, bKash payment method renders interactive PIN sheet, and savings optimizer alerts on spend thresholds.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-cart-checkout-elevation.js`
Expected: FAIL.

- [ ] **Step 3: Implement `CartHeroStats.tsx` and bulk actions on `/cart`**
Total Pieces counter, Estimated Delivery badge, White-Glove status, "Save All to Wishlist", and "Clear All" actions.

- [ ] **Step 4: Implement `MfsPaymentSheet.tsx` on `/checkout`**
Slide-up mobile PIN sheet modal with bKash / Nagad branding, masked 4-digit PIN input, terms checkbox, and order generation.

- [ ] **Step 5: Implement `SavingsOptimizerBanner.tsx` on `/checkout`**
Proactive notification notifying users when adding a small item qualifies for a higher discount code (*"Add €15 more to unlock VIP20 and save €30+ net"*).

- [ ] **Step 6: Run test to verify passing**
Run: `node tests/test-cart-checkout-elevation.js`
Expected: PASS.

- [ ] **Step 7: Commit**
`git commit -m "feat(commerce): add cart hero stats, bkash/nagad mfs settlement modal, and savings optimizer"`

---

### Task 12: Integrate AI Logistics Concierge in Courier Tracking (`app/tracking/page.tsx`)

**Files:**
- Modify: `app/tracking/page.tsx`
- Create: `components/tracking/AILogisticsAssistant.tsx`
- Test: `tests/test-tracking-logistics-concierge.js`

**Interfaces:**
- Consumes: Current tracking order telemetry, NLP logistics question answers.
- Produces: Embedded conversational logistics drawer/card on `/tracking`.

- [ ] **Step 1: Write automated test for AI Logistics Concierge**
Assert question chips (*"Can driver leave at reception?"*, *"Why was there a delay?"*) trigger empathetic logistics answers.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-tracking-logistics-concierge.js`
Expected: FAIL.

- [ ] **Step 3: Implement `AILogisticsAssistant.tsx`**
Interactive chat widget with quick query chips, natural language explanation of courier transit codes, and delivery preference adjustments.

- [ ] **Step 4: Mount assistant on `app/tracking/page.tsx`**

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-tracking-logistics-concierge.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat(tracking): integrate interactive ai logistics concierge into courier journey"`

---

### Task 13: Feature Elevation on Wishlist, Discovery, Smart List, and Concierge

**Files:**
- Modify: `app/wishlist/page.tsx`
- Modify: `app/discovery/page.tsx`
- Modify: `app/smart-list/page.tsx`
- Modify: `components/concierge/ConciergeDrawer.tsx` & `app/concierge/page.tsx`
- Create: `components/smart-list/CadenceAdjusterPopover.tsx`
- Test: `tests/test-subsystem-features.js`

**Interfaces:**
- Consumes: State stores, speech synthesis, DLP regexes.
- Produces:
  * Wishlist share link copy & Stylist bridge
  * Discovery removable Understood Context pills
  * Smart List replenishment cadence popovers
  * Concierge 4-step in-assistant checkout & DLP card number guard

- [ ] **Step 1: Write automated tests for the 4 subsystem enhancements**
Verify share link clipboard copy, filter tag removal in discovery, cadence adjustment in smart list, and in-chat checkout flow.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-subsystem-features.js`
Expected: FAIL.

- [ ] **Step 3: Add Share Wishlist link and Consult Stylist bridge in `app/wishlist/page.tsx`**

- [ ] **Step 4: Implement Understood Context Pill Manager in `app/discovery/page.tsx`**
Removable chips (`Occasion: Evening ×`, `Climate: Winter ×`) that dynamically re-filter catalog on pill deletion.

- [ ] **Step 5: Implement `CadenceAdjusterPopover.tsx` in `app/smart-list/page.tsx`**
Popover to adjust replenishment interval (30/60/90 days) per item.

- [ ] **Step 6: Implement 4-step In-Assistant Checkout & DLP Card Guard in `useConciergeStore`**
Handle *"Place order for my bag"* in chat and intercept raw credit card numbers with security warnings.

- [ ] **Step 7: Run test to verify passing**
Run: `node tests/test-subsystem-features.js`
Expected: PASS.

- [ ] **Step 8: Commit**
`git commit -m "feat(subsystems): add wishlist share, discovery context pills, smart replenishment cadence, and in-chat checkout"`

---

### Task 14: Implement Global Dark Store Gate & Delivery Hub Pill

**Files:**
- Modify: `components/layout/Header.tsx`
- Create: `components/modals/DeliveryGateModal.tsx`
- Create: `store/useDeliveryGateStore.ts`
- Modify: `app/layout.tsx`
- Test: `tests/test-delivery-gate-global.js`

**Interfaces:**
- Consumes: City hubs (`Berlin Mitte 10115`, `Paris Le Marais 75003`, `London Soho W1D 3QU`).
- Produces: Header pill `#headerDeliveryHubPill`, countdown timers, same-day delivery status.

- [ ] **Step 1: Write automated test for Delivery Hub pill and modal**
Assert `#headerDeliveryHubPill` renders in header, clicking opens modal, selecting postal code updates city and cutoff time.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-delivery-gate-global.js`
Expected: FAIL.

- [ ] **Step 3: Create `store/useDeliveryGateStore.ts`**
Manages selected postal code, dark store location, cutoff countdown, and modal visibility.

- [ ] **Step 4: Implement `DeliveryGateModal.tsx`**
3 European hubs with live countdowns, address input, and inventory status.

- [ ] **Step 5: Add `#headerDeliveryHubPill` to `Header.tsx` and mount modal in `RootLayout`**

- [ ] **Step 6: Run test to verify passing**
Run: `node tests/test-delivery-gate-global.js`
Expected: PASS.

- [ ] **Step 7: Commit**
`git commit -m "feat(global): implement hyperlocal dark store gate modal and header delivery hub pill"`

---

### Task 15: Implement Multimodal Visual Search Modal

**Files:**
- Create: `components/modals/VisualSearchModal.tsx`
- Create: `store/useVisualSearchStore.ts`
- Modify: `components/search/SearchOverlay.tsx` (wire Camera button)
- Modify: `app/discovery/page.tsx` (wire Camera button)
- Modify: `app/layout.tsx`
- Test: `tests/test-visual-search-modal.js`

**Interfaces:**
- Consumes: Image file drop, curated preset looks (Runway, Minimalist, Tailored).
- Produces: Vector similarity matches from `MASTER_PRODUCTS`.

- [ ] **Step 1: Write automated test for Visual Search modal**
Assert clicking camera in search opens visual search modal, drag-and-drop or sample look selection calculates matching products.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-visual-search-modal.js`
Expected: FAIL.

- [ ] **Step 3: Implement `VisualSearchModal.tsx`**
Drag-and-drop area, camera capture trigger, 3 preset sample look cards, and visual vector match results grid with 1-click Add to Bag.

- [ ] **Step 4: Wire Camera buttons in `SearchOverlay.tsx` and `app/discovery/page.tsx` to open the modal**

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-visual-search-modal.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat(global): implement multimodal visual search modal with drag-and-drop and vector matching"`

---

### Task 16: Implement Product Comparison Engine & Side-by-Side Modal

**Files:**
- Create: `components/modals/ComparisonModal.tsx`
- Create: `store/useComparisonStore.ts`
- Modify: `app/layout.tsx`
- Test: `tests/test-comparison-modal.js`

**Interfaces:**
- Consumes: 2–3 Product IDs to compare.
- Produces: Side-by-side differential spec matrix (Warmth, Breathability, Drape, Fabric, Care) and AI verdict.

- [ ] **Step 1: Write automated test for Comparison modal**
Assert opening modal with two items calculates spec differences and renders editorial verdict.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-comparison-modal.js`
Expected: FAIL.

- [ ] **Step 3: Create `store/useComparisonStore.ts` and `ComparisonModal.tsx`**
Matrix rendering normalized specs, differential score highlights, editorial verdict, and slot swapper.

- [ ] **Step 4: Mount modal in `app/layout.tsx` and wire triggers in PDP and PLP**

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-comparison-modal.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat(global): implement side-by-side product comparison engine and spec matrix modal"`

---

### Task 17: Implement Cart Abandonment Recovery Hold Modal

**Files:**
- Create: `components/modals/CartRecoveryModal.tsx`
- Create: `hooks/useCartRecovery.ts`
- Modify: `app/layout.tsx`
- Test: `tests/test-cart-recovery-modal.js`

**Interfaces:**
- Consumes: Mouse exit viewport, tab visibility change, non-empty cart.
- Produces: 15-minute reservation hold modal with 1-click token copy.

- [ ] **Step 1: Write automated test for Cart Recovery modal**
Verify mouse-leave trigger opens recovery modal with countdown timer when cart has items.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-cart-recovery-modal.js`
Expected: FAIL.

- [ ] **Step 3: Implement `hooks/useCartRecovery.ts` and `CartRecoveryModal.tsx`**
Tracks mouseleave at top edge and tab switch. Renders luxury hold card: *"Your Selection is Held at the Atelier · Items reserved for 15 minutes before restocking"*.

- [ ] **Step 4: Mount in `app/layout.tsx`**

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-cart-recovery-modal.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat(global): implement cart abandonment recovery modal with reservation hold timer"`

---

### Task 18: Implement Cookie Consent & Zero-Knowledge Privacy Banner

**Files:**
- Create: `components/layout/CookieConsentBanner.tsx`
- Modify: `app/layout.tsx`
- Modify: `components/layout/Footer.tsx:177-183` (wire Cookie Settings trigger)
- Test: `tests/test-cookie-consent.js`

**Interfaces:**
- Consumes: Consent state in `localStorage`.
- Produces: Floating privacy banner with "Acknowledge" and "Inspect Vault" buttons.

- [ ] **Step 1: Write automated test for Cookie Consent banner**
Assert banner appears on first visit, clicking Acknowledge hides and stores state, and clicking Cookie Settings in footer re-opens it.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-cookie-consent.js`
Expected: FAIL.

- [ ] **Step 3: Implement `CookieConsentBanner.tsx` and wire in `Footer.tsx` and `RootLayout`**

- [ ] **Step 4: Run test to verify passing**
Run: `node tests/test-cookie-consent.js`
Expected: PASS.

- [ ] **Step 5: Commit**
`git commit -m "feat(global): implement cookie consent banner and footer trigger"`

---

### Task 19: Implement Dual Currency Switcher (`EUR` / `BDT`)

**Files:**
- Create: `store/useCurrencyStore.ts`
- Modify: `components/layout/Header.tsx`
- Modify: `components/layout/Footer.tsx`
- Modify: `lib/utils.ts`
- Test: `tests/test-currency-switcher.js`

**Interfaces:**
- Consumes: Currency (`EUR` | `BDT`), exchange rate ($1\text{ EUR} = 132\text{ BDT}$).
- Produces: Real-time price formatting across all components and threshold updates.

- [ ] **Step 1: Write automated test for Currency Switcher**
Verify switching to BDT recalculates prices (e.g. €185 ➔ ৳24,420), updates header & footer selectors, and updates delivery threshold.

- [ ] **Step 2: Run test to verify failure**
Run: `node tests/test-currency-switcher.js`
Expected: FAIL.

- [ ] **Step 3: Create `store/useCurrencyStore.ts` and update `formatPrice`**

- [ ] **Step 4: Add currency dropdown selector in `Header.tsx` and wire locale selector in `Footer.tsx`**

- [ ] **Step 5: Run test to verify passing**
Run: `node tests/test-currency-switcher.js`
Expected: PASS.

- [ ] **Step 6: Commit**
`git commit -m "feat(global): implement real-time eur and bdt dual currency switcher across storefront"`

---

### Task 20: Full Storefront Build, Regression Suite & 7-Dimension SQA Audit

**Files:**
- Create: `tests/run-full-migration-audit.js`
- Test: All suites

**Interfaces:**
- Consumes: Next.js build (`next build`), Playwright / Chrome DevTools.
- Produces: 100% passing test verification across all 22 storefront pages and 15 engines.

- [ ] **Step 1: Execute TypeScript compilation and Next.js production build**
Run: `npm run build`
Expected: Build successfully completes with 0 TypeScript and 0 lint errors.

- [ ] **Step 2: Run Tier 1 unit test suites**
Run: `npm test`
Expected: All deterministic calculations, parsers, and stores PASS.

- [ ] **Step 3: Run comprehensive 7-dimension cross-page verification**
Run: `node tests/run-full-migration-audit.js`
Expected: 100% routes return 200 OK, all global modals mount, zero console errors.

- [ ] **Step 4: Final commit and completion declaration**
`git commit -m "chore(release): complete full nextjs storefront elevation and feature parity migration"`

---
