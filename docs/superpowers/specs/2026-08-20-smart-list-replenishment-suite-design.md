# Design Specification: Smart List Comprehensive Luxury Replenishment Suite

**Date**: 2026-08-20  
**Target File**: `pages/smart-list.html`  
**Architecture**: Approach A (Unified Modular Architecture with Centralized State Store)  
**Status**: Validated & Approved  

---

## 1. Executive Summary & Problem Definition

The **Smart List** (`pages/smart-list.html`) in nexCommerce is the curated replenishment and wardrobe intelligence hub. While the page currently features an elevated Modernist hero, 120fps spotlight bar, and 3:4 aspect-ratio luxury cards, shoppers currently lack:
1. **Multi-Item Selection & Batch Operations**: Shoppers cannot select multiple items for collective actions like adding a tailored batch to bag, saving to wishlist, or batch dismissal.
2. **Inline Variant & Size Customization**: Shoppers must navigate away or rely on defaults to change sizes or metal finishes.
3. **Deep Product Inspection without Page Transition**: Shoppers lack an instantaneous editorial Quick Look drawer to review materials, craftsmanship, lifestyle photography, and replenishment cadence before committing.

This specification details the end-to-end design and implementation of the **Comprehensive Luxury Replenishment Suite** to solve these friction points while maintaining the highest European luxury design standards.

---

## 2. Core Feature Architecture

### 2.1 Centralized `SmartListStore` State Engine
A reactive, decoupled client-side store managing data and state interactions:
- **State Properties**:
  - `items`: Map of all product items with full variant options, pricing, stock levels, and replenishment analytics.
  - `selectedIds`: Set of currently selected item IDs for batch operations.
  - `activeFilter`: Current category filter (`'all'`, `'audio'`, `'footwear'`, `'ready-to-wear'`, `'watches'`).
  - `quickLookId`: Product ID currently opened in the Quick Look Drawer (or `null`).
  - `isBatchDockVisible`: Boolean derived dynamically from `selectedIds.size > 0`.
- **Core Methods**:
  - `toggleSelect(productId)`: Toggles individual item selection.
  - `selectAll()` / `deselectAll()`: Selects or deselects all currently visible filtered items.
  - `setVariant(productId, { finishId, sizeId })`: Updates active variant, recalculates price deltas and stock.
  - `updateQuantity(productId, qty)`: Adjusts item replenishment quantity.
  - `addSelectedToBag()`: Injects all selected items with chosen variants into cart, fires bag pulse animation, and resets selection.
  - `moveSelectedToWishlist()`: Syncs selected items to wishlist state.
  - `dismissSelected()`: Removes selected items with undo toast support.
  - `openQuickLook(productId)` / `closeQuickLook()`: Controls modal drawer visibility.

---

### 2.2 Fluid Ambient Bulk Selection & Floating Batch Dock
- **In-Card Selection Rings**:
  - Located at `top: 10px; left: 10px` on each card.
  - **Rest State**: 26×26px circular glass ring with hairline white border (`rgba(255, 255, 255, 0.20)`).
  - **Hover State**: Border shifts to cyan glow (`rgba(61, 224, 255, 0.5)`).
  - **Selected State**: Solid cyan fill (`#3DE0FF`), dark checkmark glyph (`#030814`), and card border illuminates (`border-color: rgba(61, 224, 255, 0.45); box-shadow: 0 0 0 1px rgba(61, 224, 255, 0.30)`).
- **Toolbar Quick-Action**:
  - `[ ◯ Select All (N) ]` / `[ ✕ Deselect All ]` toggle inside `.sl-toolbar`.
- **Floating Luxury Batch Dock**:
  - Centered horizontally at `bottom: 28px` (desktop) / docked at `bottom: 0` with safe-area padding (mobile).
  - Material: High-density obsidian glass (`rgba(8, 14, 30, 0.94)`), `backdrop-filter: blur(24px)`, hairline border (`rgba(255, 255, 255, 0.14)`), deep shadow (`0 24px 60px rgba(0, 0, 0, 0.75)`).
  - Metrics: Displays `N Items Selected` • `$X,XXX Total` (real-time aggregation).
  - Action Controls:
    - Primary: `[ Add Selected to Bag (N) ]` (Solid `#FFFFFF` button, dark text, tactile cart pulse).
    - Secondary: `[ Move to Wishlist ]` (Ghost pill with heart icon).
    - Danger: `[ Dismiss Selected ]` (Subtle danger ghost pill with trash icon).
    - Dismiss: `[ Clear ✕ ]`.
  - Motion: `transform: translateY(0)` (active) vs `transform: translateY(140%)` (hidden) with `cubic-bezier(0.16, 1, 0.3, 1)`.

---

### 2.3 Inline Size & Finish Switcher Micro-Pills
- **Card Body & Quick Add Overlay Integration**:
  - Micro-swatches for material finishes (e.g., 18k Yellow Gold `#D4AF37`, White Gold `#E5E4E2`, Obsidian `#1A1A1A`, Slate Titanium `#708090`).
  - Micro-pills for sizing (`[S]`, `[M]`, `[L]`, `[XL]`, or shoe sizes `[40]`, `[41]`, `[42]`, `[43]`).
  - Active pill: Solid white fill (`#FFFFFF`) with dark text (`#030814`).
  - Out of stock pill: Diagonal slash styling (`opacity: 0.35; text-decoration: line-through; pointer-events: none;`).
- **Reactive Updates**:
  - Live recalculation of price, stock availability alerts, and total Smart List valuation.
  - Zero layout shift (CLS < 0.01) with fixed-height container bounds.

---

### 2.4 Modernist Quick Look Slide-Over Drawer
- **Dimensions & Backdrop**:
  - Desktop: 520px right-hand slide-over panel.
  - Mobile: Full-width bottom-sheet (`max-height: 88vh; border-radius: 20px 20px 0 0`).
  - Backdrop: Obsidian veil (`rgba(3, 8, 20, 0.80)`) with `backdrop-filter: blur(16px)`.
- **Content Hierarchy**:
  1. **Masthead**: Atelier spec eyebrow + close trigger `[ ✕ ]` (keyboard `Escape` supported).
  2. **Gallery**: 4:3 high-res media display with interactive 3-asset thumbnail filmstrip.
  3. **Editorial Title & Pricing**: Headline in `Manrope` + live price synchronized with active variant.
  4. **Usage Cadence Insight**: Dynamic replenishment indicator (e.g., *"Recommended every 45 days based on your atelier usage"*).
  5. **Variant Matrix**: Full interactive finish swatches and size grid.
  6. **Craft & Care Tabs**: Handcrafted origin, materials breakdown, sustainability notes, and care guide.
  7. **Sticky Action Footer**: Quantity stepper `[ - 1 + ]` + `[ Add to Bag — $X,XXX ]` CTA + link to standalone `product.html`.

---

## 3. Responsive Breakpoints & Ergonomics

| Breakpoint | Product Grid | Quick Look Drawer | Floating Batch Dock |
| :--- | :--- | :--- | :--- |
| **Desktop (≥1280px)** | 4 Columns | 520px Right Slide-over | Centered Floating Pill (`max-w: 640px; bottom: 28px`) |
| **Tablet (768px–1279px)**| 2–3 Columns | 440px Right Slide-over | Floating Bar (`max-w: 90%; bottom: 20px`) |
| **Mobile (≤767px)** | 1–2 Columns | Full-width Bottom-Sheet | Docked Bottom Bar (`bottom: 0; safe-area-inset`) |

---

## 4. Accessibility & Quality Standards (WCAG 2.1 AA)

- **Keyboard Navigation**: Full `Tab`, `Space`, and `Enter` support for selection rings, size pills, and batch actions.
- **Focus Management**: Focus trap inside Quick Look Drawer when active, returning focus to trigger element on close.
- **ARIA Attributes**: `role="checkbox"`, `aria-checked="true|false"`, `role="dialog"`, `aria-modal="true"`, `aria-live="polite"` for batch totals.
- **Contrast**: Minimum 4.5:1 text-to-background contrast ratio across all states.
- **Reduced Motion**: Graceful fallback to instantaneous state changes under `@media (prefers-reduced-motion: reduce)`.

---

## 5. Verification & Test Plan

1. **Unit & Functional Verification**:
   - Verify selecting individual items updates `SmartListStore.selectedIds` and animates Floating Batch Dock.
   - Verify "Select All" selects all filtered cards and accurately aggregates prices.
   - Verify switching sizes/finishes updates card price, stock badge, and Batch Dock subtotal without page jump.
   - Verify Quick Look Drawer opens on image/title/button click, syncs variants, and adds item to bag.
   - Verify Batch "Add Selected to Bag" injects all selected items into `cart` and updates global header badge.
2. **Responsive & Visual Testing**:
   - Audit across 1440px Desktop, 768px Tablet, and 375px Mobile viewports.
3. **Accessibility Audit**:
   - Keyboard-only navigation run-through and focus containment verification.
