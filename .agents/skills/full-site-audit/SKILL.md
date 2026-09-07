---
name: full-site-audit
description: Use when conducting a full-site quality audit, pre-release QA sweep, multi-page regression verification, or comprehensive storefront review across all routes and devices.
---

# Full-Site Audit (7-Dimension Cross-Page Sweep)

## Overview
A proper full-site audit is a **multi-dimension, cross-page sweep** across all 7 dimensions simultaneously. Never conduct single-dimension or single-page spot checks — bugs cluster at the intersections of state, device viewport, copy, and layout.

```
+-----------------------------------------------------------------------------+
|                     THE 7-DIMENSION CROSS-PAGE SWEEP                        |
+-----------------------------------------------------------------------------+
| 1. Content & Copy      -> First-time clarity, anti-jargon, empty/error copy  |
| 2. Visual / Layout     -> Multi-viewport (375px/768px/1280px/600px-h), no ovf|
| 3. Interactions        -> Every button, modal, drawer scroll, form submit   |
| 4. Cross-Page Uniform  -> Synced nav/footer/badges, zero broken rel-links   |
| 5. End-to-End Flows    -> Commerce, Auth, Curation, Agentic Concierge       |
| 6. Edge & Depletion    -> 0-item list depletion, 0 search results, promo fail|
| 7. Accessibility (AA)  -> Tab order, focus rings, alt text, ARIA, contrast  |
+-----------------------------------------------------------------------------+
```

---

## When to Use

### Triggering Conditions
- Pre-release sign-off or final QA pass before deploying changes.
- Multi-page redesigns, global CSS updates, or design system token modifications.
- Investigating intermittent cross-page defects or unexplained user drop-offs.
- Verifying complete site consistency after adding new navigation items, drawers, or global components.

### When NOT to Use
- Single-component local bugfix with zero cross-page side-effects (use unit test + targeted browser verification).
- Adding a single unit test or mock helper.
- Standalone documentation updates.

---

## The 7 Dimensions of Coverage

### 1. Content & Copy
- **First-Time User Read**: Read every heading, button verb, input label, and description as a first-time visitor.
- **Anti-Jargon Enforcement**: Flag anything confusing, pseudo-technical (*"synthesize"*, *"telemetry"*, *"cadence"*), or non-standard.
- **State Copy**: Rigorously verify empty states, validation messages, error banners, and success toasts.

### 2. Visual / Layout
- **Multi-Viewport Captures**: Screenshot every page at Desktop (`1280px` / `1440px`), Tablet (`768px`), Mobile (`375px`), and Scaled Laptop height (`1080p @ 125%` / `600px` height).
- **Defect Detection**: Inspect for overlapping elements, text clipping, broken images, misaligned grid items, and horizontal scroll leakage (`overflow-x: hidden` enforcement).
- **Silhouette Geometry**: Enforce `object-fit: contain` on studio product photography with zero cropped soles, dials, or edges.

### 3. Interactions
- **Action Coverage**: Click every button, icon, and link — confirm every single one executes an intentional action or valid navigation.
- **Drawer & Modal Lifecycles**: Open every drawer, modal, and dropdown; verify backdrop blur, keyboard ESC dismissal, click-outside handling, and close button.
- **Modal Overlay Scroll Isolation & Smooth Scroll Invariant**: Every modal, bottom sheet, slide-over drawer, and dropdown with internal scrolling MUST:
  1. Include `data-lenis-prevent` on the overlay wrapper, modal card, and all internal scrollable grids.
  2. Call `window._nexLenis.stop()` when opening and `window._nexLenis.start()` when closing.
  3. Explicitly declare `-webkit-overflow-scrolling: touch; touch-action: pan-y; overscroll-behavior: contain; overflow-y: auto;` in CSS.
  4. Define custom slim scrollbars (`scrollbar-width: thin;` and `::-webkit-scrollbar`) with distinct contrast.
  - QA verification MUST programmatically simulate scroll gestures and assert `scrollTop > 0`.
- **Forms & Inputs**: Fill and submit every form, swatch selector, quantity stepper, and filter capsule.

### 4. Cross-Page Consistency & Feature Parity
- **Navigation & Badges**: Nav items, active route indicators, and live badge counters (Cart, Wishlist, Notifications) must remain identical and synchronized across root (`index.html`) and subpages (`pages/*.html`).
- **Global Dynamic Header Features & Universal Script Invariant**: Any feature that mounts a global header or footer element dynamically at runtime (e.g. Delivery Location & Dark Store Hub pill `#headerDeliveryHubPill`, Search Overlay, Concierge bridge, Cookie Consent) MUST have its supporting engine and UI controller scripts loaded unconditionally across **all 29 storefront pages**. Automated audit test suites (`tests/full-7dimension-audit.js`) MUST include explicit script-presence assertions for all global runtime dependencies across all pages, eliminating dynamic injection blind spots.
- **Cross-Viewport Feature Parity & Single Unified Placement**: Any interactive business capability available on Desktop MUST have an intentional, accessible equivalent on Mobile ($\le 768\text{px}$, $375\text{px}$). Hiding an element with `.desktop-only` is strictly forbidden unless a dedicated mobile component is mounted (e.g. inside `#mobileNavDrawer`). Mobile placement must adhere to the **Single Unified Location Rule**: avoid duplicate interactive triggers in both the header bar and the mobile drawer to prevent viewport crowding and dual-location confusion.
- **Footer & Chrome**: Footer structure, copyright, legal notices, currency selectors, and announcement bars must behave identically everywhere.
- **Shared Components**: Ensure shared UI modules (preloader, announcement bar, mini-cart, quick-look drawer) retain identical styling and functional behavior site-wide.
- **Dynamic Path Resolution**: Verify dynamic URL/image helpers (`resolveHref`, `resolveImg`) guarantee zero 404s or broken relative links across directory levels.

### 5. User Flows (End-to-End)
- **Commerce Flow**: Homepage → Category / Discovery → Product Detail (PDP) → Add to Bag → Cart Drawer/Page → Checkout → Order Confirmation.
- **Auth & Account Flow**: Sign Up → Sign In → Account Profile → Order History → Order Tracking.
- **Curation Flow**: Wishlist / Smart List → Quick Look Modal → Variant Delta Selection → Add to Bag.
- **Agentic Concierge Flow**: Concierge Chat → Outfit Bundle / Sizing Advisor Recommendation → Add Entire Look to Bag.

### 6. Edge Cases & Boundary Conditions
- **Cognitive Load & Viewport Budgeting**: Selection modals and picker drawers must limit default displayed options to the **Top 3 premier choices** so that all options fit comfortably above the fold with zero default scroll friction, using live search to access deeper catalog items.
- **List Depletion & 0-Item Boundary**: Empty cart, empty wishlist, empty smart list, and empty order history — verify that peripheral counters, hero badges, and summaries reset cleanly to 0 with zero stale values.
- **Zero Search Results**: Submit 0-match and nonsense queries; verify polite empty states with suggested search chips.
- **Invalid Promo & Input Validation**: Test expired/invalid promo codes, malformed emails, short passwords, and omitted required form fields.

### 7. Accessibility (WCAG 2.1 AA)
- **Keyboard Traversal**: Tab through every interactive element in logical order with visible focus indicators.
- **Alt Text**: Verify all product and editorial images have descriptive, meaningful `alt` attributes.
- **ARIA Semantics**: Ensure buttons have descriptive `aria-label`, modals have `role="dialog"` + `aria-modal="true"`, and dropdowns have `aria-expanded`.
- **Contrast Ratios**: Check contrast ratios ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large headings).

---

## Cross-Page Execution Matrix

| Page Route | Content & Copy | Visual / Layout | Interactions | Cross-Page Uniform | E2E User Flows | Edge Cases / Depletion | Accessibility (AA) |
|---|---|---|---|---|---|---|---|
| `index.html` | Hero copy, curation cards | Contain silhouettes, no `overflow-x` | Search bar, drawer triggers, quick add | Header/footer sync, relative paths | Discovery entry point, bundle entry | 0 search results from hero bar | Focus rings, image `alt`, ARIA labels |
| `pages/discovery.html` | Filter labels, product counts | Grid reflow (1-col mobile, 3-col desktop) | Capsule filters, price slider, quick view | Header counts sync with cart/wishlist | PLP → Quick Look → PDP → Bag | Zero search / filter matches fallback | Keyboard filter navigation, screen-reader counts |
| `pages/category.html` | Taxonomy, breadcrumbs | Clean banner typography, no clip | Subcategory pills, facet checkboxes | Global nav active state matches category | Breadcrumb traversal → PDP flow | Empty subcategory state | Landmark roles, color contrast |
| `pages/product.html` | Specs, size labels, delivery info | Silhouette containment, filmstrip | Swatch selector, size picker, accordion | Mini-cart drawer matches global state | Add to Bag → Slip-to-Cart drawer | Out-of-stock variant selection | Swatch `aria-pressed`, image carousel ARIA |
| `pages/cart.html` | Item breakdown, shipping fee tiers | Sticky summary sidebar, coupon layout | Quantity steppers (`+`/`-`), remove modal | Global cart badge updates live | Cart → Checkout transition | **Complete list depletion to 0 items** | Stepper `aria-label`, alert on item removal |
| `pages/checkout.html` | Error messages, step indicators | 1-col mobile stack, sticky order summary | Address auto-complete, payment tabs | Cart items & pricing match cart exactly | Place Order → Confirmation redirect | Invalid coupon, invalid card, missing fields | Form `<label>` tags, inline error alerts |
| `pages/confirmation.html` | Order ID, delivery timeline, summary | Clean receipt card, no print clipping | "Track Order" link, "Continue Shopping" | Header cart counter cleanly resets to 0 | Confirmation → Tracking / Account | Page refresh without re-submitting order | Heading hierarchy, receipt landmarks |
| `pages/wishlist.html` | Item status, "Move to Bag" labels | Action clusters non-overlapping | Quick Look modal, Move to Bag, Remove | Sync with header wishlist badge | Wishlist → Quick Look → Cart | **Bulk "Clear All" down to 0 items** | Action button ARIA labels, focus restoration |
| `pages/smart-list.html` | Natural language prompts, intent chips | Input box wrap, capsule pills layout | NL search parser, 1-click bundle add | Sync with global wishlist/cart counts | Parse Intent → Add Multiple to Cart | Unparseable / nonsense queries | Search input labeling, live region results |
| `pages/concierge.html` | Concierge responses, outfit copy | Visual-first cards, photo preview chips | Chat input, quick prompt chips, bundle CTA | Theme consistency, persistent drawer | Chat → Recommended Outfit → Bag | Rapid multi-message, API fallback state | Scroll containment, message stream ARIA |
| `pages/account.html` | Order statuses, addresses, profile | Tab layout, responsive table/card switch | Order cancellation, reorder button | Nav profile indicator matches auth state | Order History → Reorder Flow | 0 past orders empty state | Table accessibility, profile field labels |
| `pages/signin.html` | Password requirements, validation errors | Split-screen desktop, stacked mobile | Show/hide password, form submit | Return-to-URL redirection consistency | Sign Up → Sign In → Account redirect | Duplicate email, weak password, blank form | Form validation errors linked via `aria-describedby` |
| `pages/about.html` | Brand story, contact hours, policy copy | Hero scale, responsive timeline/grid | Contact form submission, FAQ toggles | Global header/footer/legal link sync | Contact Submit → Confirmation toast | Invalid email/message submission | Semantic structure, contrast on muted text |

---

## Anti-Patterns & Rationalization Table

| Excuse | Reality |
|---|---|
| *"I tested mobile scroll on the homepage, so subpages are fine."* | Layouts and drawer component hierarchies differ per route. Every route must be verified at `375px`. |
| *"I verified the desktop header on discovery.html, so navigation is good."* | Subpages often have relative path differences (`../`), broken asset links, or missing badge listeners. |
| *"The cart has items in it, so the summary calculation is verified."* | The most severe state-synchronization bugs occur during **0-item list depletion**. You must test complete clearing. |
| *"The happy-path checkout completed, so checkout is ready."* | Production outages happen on negative paths: invalid coupons, expired cards, and duplicate submissions. |
| *"Visual inspection passed on 1440px desktop."* | Scaled laptop viewports (`1080p @ 125%` = `600px` height) frequently push CTAs below the fold and break drawers. |
| *"I clicked the link and the modal opened."* | Opening is only 25% of the lifecycle. You must test closing, backdrop dismissal, ESC key, and internal scrolling. |

---

## Red Flags — STOP and Restart Sweep

- **Single-Dimension Spot Checking**: Checking mobile layout on one page and nav on another without sweeping all 7 dimensions across both.
- **Skipping Mobile or Scaled Viewports**: Verifying only at default desktop resolution (`1440x900`).
- **Ignoring 0-Item Boundary**: Not clearing lists down to `[]` to test empty states and ambient counter resets.
- **Untested Drawer Scrolling**: Verifying that a drawer opens without scrolling to the bottom of its content.
- **Broken Relative Links**: Not testing navigation from deeply nested subpages back to root routes.

**All of these mean: Stop, reset test environment, and execute the full 7-dimension cross-page sweep.**
