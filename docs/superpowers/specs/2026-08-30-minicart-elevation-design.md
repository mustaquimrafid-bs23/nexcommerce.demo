# MiniCart (Shopping Bag) Migration & Storefront-Elevation Design Specification

**Author:** Antigravity (Founding Lead Engineer & Senior UI/UX Designer)  
**Date:** 2026-08-30  
**Status:** Approved (Option A: Pure Storefront-Elevation Atelier Alignment)  
**Target:** Next.js 15+ App Router (`components/cart/MiniCartDrawer.tsx`)

---

## 1. Executive Summary & Objective

Migrate and elevate the **MiniCart (Shopping Bag)** drawer in the Next.js App Router branch (`ubgrade`) to achieve exact visual, functional, and motion parity with the canonical `feature/storefront-elevation` reference branch.

### Key Objectives:
1. **Background Color & Surface Palette Correction:**
   - Eliminate hardcoded pitch-black/charcoal tones (`#060B14`, `#08101E`, `#091222`) that clashed with the site theme.
   - Realign with the brand obsidian deep navy palette:
     - Drawer Main Background: `--bg-obsidian` / `#012148` (Deep Navy Base)
     - Header / Footer Surfaces: `--surface-navy` / `#0A2A54` (Midnight Navy)
     - Product Thumbnail Frames: Studio radial depth (`#08254c` to `#0A2A54`)
     - Borders: Subtle glass borders `rgba(255, 255, 255, 0.08)` / `border-white/10`
2. **Iconic Storefront-Elevation CTA & Button Styling:**
   - Replace the crimson/pink checkout button with the iconic `btn-primary-commerce` specification: crisp solid white button with obsidian dark navy text (`#00142e`), uppercase tracking, bold typography, and smooth hover elevation.
3. **Plain UK English Copywriting & Zero AI Jargon:**
   - Eliminate all synthetic/AI-sounding phrases (e.g. "Personal Discovery", "algorithmic suggestions").
   - Enforce pure British English luxury wording:
     - Header: `"Shopping Bag"`
     - Milestone: `"You have unlocked Complimentary Express Delivery"` / `"Add [amount] more for Complimentary Delivery"`
     - Empty State: `"Your bag is empty"`, `"Discover contemporary pieces styled around how you want to dress."`, `"Explore Collection →"`, `"View Saved Pieces"`
     - Footer: `"Estimated Subtotal"`, `"Complimentary"`, `"VAT & duties included where applicable. Items reserved for 30 minutes."`
     - Action: `"View Bag & Checkout →"`
4. **120fps Motion & Interaction Engineering:**
   - Spring-driven slide-over entry and exit (`damping: 30, stiffness: 300, mass: 0.8`).
   - Smooth `AnimatePresence` layout animations on item removal.
   - Full scroll isolation (`data-lenis-prevent`, `_nexLenis.stop()`, `_nexLenis.start()`, body overflow lock).
   - Keyboard `Escape` key dismissal.

---

## 2. Visual Architecture & Color Hierarchy

| Surface / Token | Color Value | Purpose |
|---|---|---|
| Drawer Base (`--bg-obsidian`) | `#012148` | Primary drawer background |
| Header & Footer (`--surface-navy`) | `#0A2A54` | Elevated top & bottom containers |
| Item Row Container | `#071E3D` / `rgba(10, 42, 84, 0.65)` | Subtle translucent luxury card surface |
| Thumbnail Frame | `linear-gradient(#0c2a52, #071a33)` | Uncropped studio silhouette frame |
| Primary CTA Background | `#FFFFFF` | Crisp white luxury button |
| Primary CTA Text | `#00142e` | High-contrast dark navy text |
| Delivery Milestone Accent | `#3DE0FF` / `#34D399` | Cyan to emerald progress indicator |
| Subtle Borders | `rgba(255, 255, 255, 0.1)` | 1px subtle separation |

---

## 3. Component Breakdown & Functional Specifications

### A. Drawer Header
- **Title:** "Shopping Bag" in Serif font (`Cormorant Garamond`), 24px font-size, tracking normal.
- **Piece Counter:** Capsule badge displaying item count (e.g., `2 pieces` / `1 piece`) with `tabular-nums`.
- **Close Button:** Accessible circular button with `X` icon, hover micro-scaling (`scale-105`), active feedback.

### B. Complimentary Delivery Progress Milestone
- **Milestone Threshold:** €150.00 (`FREE_DELIVERY_THRESHOLD`).
- **Dynamic Calculation:**
  - When Subtotal < €150: Shows remaining amount needed in cyan accent (`#3DE0FF`).
  - When Subtotal >= €150: Unlocks emerald success state (`#34D399`) with Sparkle icon: "You have unlocked Complimentary Express Delivery".
- **Progress Bar:** GPU-accelerated gradient bar tracking subtotal percentage (0% to 100%).

### C. Cart Item List & Row Architecture
- **Silhouette Containment:** 80×100px media frame with `object-contain` drop-shadow styling, guaranteeing 100% full uncropped visibility of product silhouettes (footwear, bags, tailoring, audio).
- **Details:**
  - Category badge (e.g. `APPAREL`, `ACCESSORIES`) in cyan uppercase tracking.
  - Product title linked to PDP (`/product/[id]`).
  - Variant tags (Size / Colour) in subtle frosted pill tags.
- **Micro-Actions & Stepper:**
  - Quantity Stepper: `−` / `+` with disabled state when quantity is 1.
  - Wishlist Heart Button: Instant toggle saving item to wishlist with active crimson feedback.
  - Remove Trash Button: Instant item removal with exit animation.
  - Pricing: Unit price and calculated line total using `tabular-nums`.

### D. Empty State
- **Icon:** Frosted circular container with `ShoppingBag` vector icon.
- **Headline:** `"Your bag is empty"` in serif typography.
- **Subtext:** `"Discover contemporary pieces styled around how you want to dress."`
- **Actions:**
  - Primary: `"Explore Collection →"` linking to `/category?cat=all`.
  - Secondary: `"View Saved Pieces"` linking to `/wishlist`.

### E. Footer Summary & Action
- **Subtotal Row:** "Estimated Subtotal" with bold tabular total.
- **Delivery Row:** "Delivery" indicating "Complimentary" or standard fee.
- **Tax Notice:** "VAT & duties included where applicable. Items reserved for 30 minutes."
- **Primary CTA:** Solid crisp white luxury button: `"VIEW BAG & CHECKOUT →"` navigating to `/cart`.
- **Trust Reassurance Badges:** 256-bit Encrypted Checkout & Complimentary Returns with subtle vector icons.

---

## 4. 7-Dimension SQA Verification Plan

1. **Dimension 1: Content & Copy:** Assert clean UK English, zero AI words across all labels.
2. **Dimension 2: Visual / Layout:** Assert uncropped silhouettes, correct `#012148`/`#0A2A54` backgrounds, white CTA button.
3. **Dimension 3: Motion & Interactions:** Test spring physics, Lenis scroll lock/unlock, Escape key handling.
4. **Dimension 4: Cross-Page Parity:** Verify global mounting in `app/layout.tsx` and header icon synchronization.
5. **Dimension 5: E2E Flows:** Test Add to Bag → MiniCart open → Update Qty → Wishlist → Checkout.
6. **Dimension 6: Edge Cases:** Assert 0-item empty depletion boundary, €149.99 vs €150.00 free delivery threshold.
7. **Dimension 7: Accessibility:** Verify `role="dialog"`, `aria-modal="true"`, explicit ARIA labels on all buttons.
