# 22-Page Storefront Luxury Digital Atelier Elevation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Systematically redesign, rebuild, and conduct full UI/UX, interaction physics, state synchronization, and SQA audits for all remaining 22 storefront pages of nexCommerce, transforming them into a world-class luxury digital atelier.

**Architecture:** Modular vanilla HTML5, CSS3 design system tokens (`css/design-system.css`), and lightweight modular JavaScript (`js/`) using Lucide SVG icons, GPU-accelerated motion (Emil Kowalski physics standards), and synchronized `localStorage` client state engines (`nex_bag_items`, `nex_curated_wishlist_ids`, `nex_recently_viewed`, `nex_auth_user`).

**Tech Stack:** HTML5, CSS3 (CSS Variables, Flexbox, CSS Grid), Vanilla JavaScript (ES2022), Lucide Icons, Google Fonts (Cormorant Garamond, Outfit, Inter).

---

## Global Constraints

- **Design Standard**: World-Class Luxury Digital Atelier (Benchmark: SSENSE, NET-A-PORTER, Loewe).
- **Color Palette**: Dark Luxury Neutral Foundation (`#061226`, `#0B1E3B`, `#020617`), radiant Rose/Crimson accents (`#F43F5E` → `#E11D48`), pure `#FFFFFF` high-contrast typography. No neon cyan/purple/pink gradient blobs.
- **Typography Hierarchy**: Cormorant Garamond for editorial headlines; Outfit / Inter grotesque for clean, high-legibility body and metadata.
- **Iconography**: 100% stroke-based SVG icons (Lucide standard). Strictly NO raw text symbols (`✦`, `💬`, `↗`) or emoji icons.
- **Motion & Physics**: 120fps GPU hardware-composited animations (`transform`, `opacity`). Never animate CPU layout dimensions (`width`, `height`) for progress bars or loaders.
- **Step Discipline**: Execute strictly one part at a time. Never combine or skip verification steps without explicit user review.
- **Responsive & Accessibility**: Mobile-first fluid reflow from 390px (iPhone) to 1920px (Desktop); WCAG 2.1 AA compliant color contrast (min 4.5:1 for body copy).

---

## Master 4-Phase Page Breakdown

```
Phase 1: Core Shopping Funnel (Pages 1–7)
  ├── Task 1: Product Detail Page (product.html) [ACTIVE]
  ├── Task 2: Category & Collections PLP (category.html)
  ├── Task 3: Shopping Bag Review (cart.html)
  ├── Task 4: High-Conversion Checkout (checkout.html)
  ├── Task 5: Order Confirmation & Receipt (confirmation.html)
  ├── Task 6: Real-Time Order Tracking (tracking.html)
  └── Task 7: Dedicated Saved Wishlist (wishlist.html) [NEW BUILD]

Phase 2: Discovery, AI Concierge & Search (Pages 8–11)
  ├── Task 8: AI Style Concierge (concierge.html)
  ├── Task 9: Intelligent Discovery & Visual Search (discovery.html)
  ├── Task 10: Seasonal Lookbook & Editorial (lookbook.html)
  └── Task 11: Dedicated Search Results & Faceted Filter (search.html) [NEW BUILD]

Phase 3: Customer Identity & Preference Engine (Pages 12–15)
  ├── Task 12: Customer Account Dashboard (account.html)
  ├── Task 13: AI Style Profile & Fit DNA (profile.html)
  ├── Task 14: Sign In Portal (signin.html)
  └── Task 15: Sign Up & Onboarding Flow (signup.html)

Phase 4: Client Services, Care, UGC & Operations (Pages 16–22)
  ├── Task 16: Promotions, Member Drops & Coupons (promotions.html) [NEW BUILD]
  ├── Task 17: Customer Reviews & Verified UGC Hub (reviews.html) [NEW BUILD]
  ├── Task 18: Returns & Self-Service Exchange Portal (returns.html) [NEW BUILD]
  ├── Task 19: Help Center & Client FAQ (faq.html) [NEW BUILD]
  ├── Task 20: Privacy Policy, Terms & Maison Standards (privacy.html) [NEW BUILD]
  ├── Task 21: Universal Size & Measurement Guide (size-guide.html) [NEW BUILD]
  └── Task 22: Luxury Branded 404 Error Recovery (404.html) [NEW BUILD]
```

---

## Detailed Plan: Task 1 — Product Detail Page (`product.html`)

**Files:**
- Modify: `product.html` (Complete layout, gallery, fit advisor, and accordions)
- Modify: `css/design-system.css` (PDP luxury styles, sticky mobile bar, swatch selectors)
- Modify: `js/product.js` / `js/header.js` (Dynamic size selector, bag increment, wishlist toggle, recently viewed tracker)
- Test / Visual Proof: `product_step1_desktop.png`, `product_step1_mobile.png`, `product_step1_cart_sync.png`

**Interfaces:**
- Consumes: `localStorage.getItem('nex_curated_wishlist_ids')`, `localStorage.getItem('nex_bag_items')`
- Produces: `window.nexUpdateCartBadge()`, `window.nexUpdateWishlistBadge()`, `window.nexAddRecentlyViewed(productId)`

---

### Task 1.1: Header & Luxury Editorial Hero Gallery
- [x] **Step 1.1.1: Align Global Header**: Ensure `product.html` header uses the new icon-only luxury standard, radiant crimson badge counters, and working `Ctrl + K` search overlay trigger.
- [x] **Step 1.1.2: Build Multi-Angle Lifestyle Gallery**: Implement a 4-image grid/carousel showcasing the item from multiple angles including human model lifestyle photography (`sweater_lifestyle.png`, `sweater_texture.png`).
- [x] **Step 1.1.3: Visual Verification**: Capture desktop (1440px) and mobile (390px) screenshots of the gallery and header.

---

### Task 1.2: Editorial Typography, Price & Swatch Selectors
- [x] **Step 1.2.1: Editorial Product Header**: Headline in Cormorant Garamond (`Architectural Cashmere Sweater`), collection tag (`ATELIER READY-TO-WEAR · CAPSULE 04`), price display in local currency symbol (`৳ 24,500` / `$ 220`).
- [x] **Step 1.2.2: Color Swatch Picker**: Interactive circular swatches (Charcoal Melange, Alabaster Oatmeal, Deep Midnight) with active state borders.
- [x] **Step 1.2.3: Dynamic Size Selector**: Responsive size pills (XS, S, M, L, XL) with stock level indicator ("Only 2 left in Size M") and live size selection state.
- [x] **Step 1.2.4: Size & Fit Advisor Modal**: Trigger button opening the interactive fit recommendation modal with body measurement calculations.

---

### Task 1.3: Conversion Actions & Sticky Mobile CTA Bar
- [x] **Step 1.3.1: Primary "Add to Bag" Action**: Luxury button with spring physics, price summary, loading state, and emerald checkmark feedback.
- [x] **Step 1.3.2: Secondary "Save to Wishlist" Toggle**: Stroke-based SVG heart button synced with `localStorage['nex_curated_wishlist_ids']` and real-time header counter update.
- [x] **Step 1.3.3: Sticky Mobile CTA Bar**: Fixed bottom bar on mobile (<768px) displaying product title, price, and instant "Add to Bag" button.

---

### Task 1.4: Atelier Details Accordion & Cross-Sell Styling
- [x] **Step 1.4.1: Product Story & Specifications Accordion**: Smooth collapsible sections for "Craft & Materials" (100% Grade-A Mongolian Cashmere), "Care Instructions", and "Complimentary Shipping & Returns".
- [x] **Step 1.4.2: "Complete the Look" Pairing Grid**: 3 complementary items (Tailored Wool Trousers, Minimal Leather Runner, Cashmere Scarf) with quick-add triggers.
- [x] **Step 1.4.3: Recently Viewed Tray**: Dynamic horizontal carousel populated from `localStorage['nex_recently_viewed']`.

---

### Task 1.5: Full SQA Functional & UX Audit for Page 1
- [x] **Step 1.5.1: Functional Test**: Test Size selection, Add to Bag, Wishlist toggle, Modal opening, and Accordion expand/collapse.
- [x] **Step 1.5.2: State Persistence**: Verify item appears in Shopping Bag (`cart.html`), mini-cart drawer, and header counters.
- [x] **Step 1.5.3: Responsive & Accessibility Audit**: Test 390px, 768px, 1280px, 1440px viewports; verify WCAG 2.1 AA keyboard focus and screen reader labels.
- [x] **Step 1.5.4: Generate SQA Report**: Document findings in `docs/reports/2026-08-15-pdp-sqa-audit-report.md` with visual proof.

---

## Roadmap for Tasks 2 through 22

- **Task 2: `category.html`** (Filter drawer, sorting matrix, sticky category subnav, responsive 4-column luxury grid)
- **Task 3: `cart.html`** (Line item editing, subtotal calculation, free shipping progress bar, promo code engine)
- **Task 4: `checkout.html`** (Single-page luxury checkout, bKash/Nagad/Cards integration, address validation)
- **Task 5: `confirmation.html`** (Post-purchase receipt, delivery milestone timeline, calendar reminder)
- **Task 6: `tracking.html`** (Live tracking stepper, courier visual map, delivery updates)
- **Task 7: `wishlist.html`** (Dedicated saved items management, batch add to bag, empty state discovery)
- **Task 8: `concierge.html`** (Conversational AI stylist interface, bundle suggestions, style presets)
- **Task 9: `discovery.html`** (Visual search, semantic intent query processor, moodboard explorer)
- **Task 10: `lookbook.html`** (Full-bleed editorial lifestyle photography, interactive shoppable hotspots)
- **Task 11: `search.html`** (Faceted search results page, keyword highlight, zero-result recommendations)
- **Task 12: `account.html`** (Client account dashboard, order history table, saved payment cards)
- **Task 13: `profile.html`** (AI style DNA preferences, fit calibrations, brand affinity signals)
- **Task 14: `signin.html`** (Secure login portal, OTP authentication, social SSO)
- **Task 15: `signup.html`** (Onboarding flow, style questionnaire, new member welcome perk)
- **Task 16: `promotions.html`** (VIP member promotions, seasonal capsule drops, coupon codes)
- **Task 17: `reviews.html`** (Verified buyer ratings, photo reviews gallery, fit sentiment breakdown)
- **Task 18: `returns.html`** (Self-service return & exchange initiation, reason selector, shipping label generator)
- **Task 19: `faq.html`** (Categorized client care FAQs, search filter, contact concierge shortcut)
- **Task 20: `privacy.html`** (Maison privacy policy, GDPR compliance, cookie consent, terms of service)
- **Task 21: `size-guide.html`** (Comprehensive measurement tables, international conversion charts)
- **Task 22: `404.html`** (Luxury branded 404 recovery page, trending product recommendations)
