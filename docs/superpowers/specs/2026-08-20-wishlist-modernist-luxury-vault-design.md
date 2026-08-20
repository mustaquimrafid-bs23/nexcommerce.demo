# Design Specification: Wardrobe Vault Comprehensive Luxury Modernist Suite

**Date**: 2026-08-20  
**Target File**: `pages/wishlist.html`  
**Aesthetic Standard**: Modernist / Swiss Luxury — Visual-First (80% Visual Ratio), Text-Restrained, High-Res Editorial  
**Architecture**: Approach A (Unified Modernist Luxury Vault Suite with Centralized State, Multi-Select Island, and Quick Look Slide-Over Drawer)  
**Status**: Approved by User

---

## 1. Executive Summary & Design Direction

`pages/wishlist.html` (Saved Pieces / Wardrobe Vault) is being upgraded to the **nexCommerce Modernist Luxury Standard** (benchmarking SSENSE, NET-A-PORTER, Loewe, and Brunello Cucinelli):
- **Visual Dominance (75–80% visual ratio)**: Structured 4-column responsive grid with consistent 3:4 aspect-ratio product imagery, 3D spring tilt physics, and cursor-following specular glare.
- **Aggressive Text Reduction**: Eliminates paragraph clutter and wordy explanations from product cards. Cards feature strictly 3 lines of refined typography: Brand Eyebrow, Single-Line Title, and Price with direct action.
- **Tactile Visual Selectors**: Interactive color/finish swatches, architectural size blocks (`[S]`, `[M]`, `[L]`, `[XL]`), and minimal 6px stock status beacons.
- **Floating Obsidian Batch Island**: Bottom-anchored glassmorphism dock (`backdrop-filter: blur(24px)`) that slides into view upon selecting items, enabling 1-click batch cart addition, sharing, and removal.
- **Quick Look Slide-Over Drawer**: 520px high-res media drawer (70% media area) with 3-asset thumbnail filmstrip, interactive variant switching, luxury provenance tags, and sticky cart CTA.
- **State Integrity & Storage Guardrail Compliance**: Robust handling distinguishing between first-time default seeds (`stored === null`) and explicitly cleared states (`stored === '[]'`).

---

## 2. Visual-First Component Architecture

### 2.1 Hero Masthead, Capsule Tabs & Global Toolbar
- **Minimalist Editorial Masthead**:
  - Eyebrow: `PRIVATE CLIENT CURATION · ATELIER ARCHIVE` with a pulsing emerald status beacon (`#34D399`).
  - Typographic Headline: *"Your Wardrobe Vault"* (Manrope 700 + italic Instrument Serif accent).
  - Live Vault Counters: Number of saved pieces + cumulative estimated value (EUR) formatted with tabular numerals.
- **Curated Look Capsule Tabs**:
  - Modernist 2px border pill tabs (`01 All Saved`, `02 Ready-to-Wear`, `03 High Acoustics`, `04 Footwear & Leather`).
  - Embedded count badges (`tab-count-badge`) reflecting live piece counts per capsule.
  - Curated sub-header editorial overview with smooth cross-fade description transitions.
- **Global Toolbar**:
  - `[ Select All ]` toggle for quick multi-item selection.
  - `[ Share Private Edit ]` with clipboard copy micro-animation.
  - `[ Move All to Bag ]` batch action with tactile spring feedback.

---

### 2.2 Visual-First Product Cards (80% Visual Ratio)
- **Grid Layout**: 4 columns on desktop ($\ge 1200\text{px}$), 3 columns on tablet ($\ge 900\text{px}$), 2 columns on mobile ($\ge 560\text{px}$), 1–2 on small mobile.
- **Card Overlays**:
  - Top-Left: 24×24px ambient multi-select glass ring. Selecting turns it solid cyan with a checkmark and highlights the card with an ambient cyan border halo.
  - Top-Right: Quick Look trigger button (`[ 👁 Quick Look ]`) + Remove button (`[ × ]`) with smooth scale/fade exit animations.
- **Tactile In-Card Selectors**:
  - **Finish Swatches**: 14×14px tactile circular discs (e.g., Noir, Camel, Sterling, Obsidian) with active ring indicators.
  - **Size Selector Blocks**: 22×22px geometric square buttons (`[S]`, `[M]`, `[L]`, `[XL]`).
  - **Stock Status Dot**: 6px status beacon (Cyan: In Stock, Amber: Low Stock · 2 Left, Diagonal/Muted: Atelier Reserved).
- **Strict 3-Item Luxury Typography**:
  1. **Brand Eyebrow**: `MAISON APPAREL` (9px uppercase, 0.14em tracking).
  2. **Product Title**: Clean single-line title in `Manrope` (hover subtle underline/glow).
  3. **Price & Cart Row**: Bold EUR price + compact `[ + ADD ]` button with tactile click-ripple and checkmark confirmation.

---

### 2.3 Floating Obsidian Batch Island
- **Docking & Elevation**:
  - Desktop: Centered floating island anchored at `bottom: 28px`.
  - Mobile: Docked bottom bar at `bottom: 0` with safe-area padding.
  - Background: Deep obsidian glass (`rgba(8, 14, 30, 0.94)`), `backdrop-filter: blur(24px)`, hairline border (`rgba(255, 255, 255, 0.14)`), ambient shadow.
- **Controls**:
  - Live Summary: `N Selected • € Total` (real-time calculation).
  - Primary CTA: `[ Move Selected to Bag ]` (solid white button injecting items into `window.nexCart` with header bag badge bounce).
  - Secondary Actions: `[ Share Selection ]`, `[ Remove Selected ]`, and `[ ✕ Clear Selection ]`.

---

### 2.4 Visual-Dominant Quick Look Slide-Over Drawer
- **Drawer Geometry**: Smooth 520px right-hand slide-over drawer (bottom-sheet on mobile) with focus trapping and `Escape`/backdrop click dismiss.
- **70% Media Dominance**:
  - Large 4:3 high-res main image viewer with cursor-zoom.
  - 3-asset thumbnail filmstrip (Studio Shot, Material Detail, Lifestyle Context) with instant preview switching.
- **Tactile Specification Area**:
  - Interactive finish and size selectors with dynamic price updates.
  - 3 concise luxury provenance tags: `[ ✦ Origin: Milan/Florence ]`, `[ ✦ Material Integrity ]`, `[ ✦ Atelier Grade ]`.
  - Sticky bottom CTA: `[ Add to Bag — € XXX.00 ]` + direct link to the dedicated product page.

---

## 3. Data Architecture, Storage & State Synchronization

### 3.1 LocalStorage Engine
- Key: `WISHLIST_KEY = 'nex_curated_wishlist_ids'`.
- First-time visitor default: Seeds `['p1', 'p4', 'p6']` if `localStorage.getItem(WISHLIST_KEY) === null`.
- Cleared state: When user removes all items, stores `JSON.stringify([])`. Never auto-resurrects seed items once explicitly emptied.
- Cross-tab / Multi-page Sync: Dispatches `window.dispatchEvent(new CustomEvent('wishlist:updated', { detail: { count, ids } }))` and listens to `window.addEventListener('storage', ...)`.

### 3.2 Catalog Engine Integration
- Extended catalog model supporting rich metadata for all products (`p1` through `p7`):
  - Multi-asset image galleries (studio, angle, lifestyle).
  - Colorway swatches (hex values and names).
  - Size variants (`S`, `M`, `L`, `XL`, `48`, `50`, `52`).
  - Luxury provenance tags (Origin, Material, Craftsmanship).
  - Dynamic stock availability.

### 3.3 Cart Integration
- Seamless integration with `window.nexCart.addItem(...)`.
- Passes item ID, selected size, selected colorway, title, price, and thumbnail.
- Triggers tactile success states and increments global header cart badges.

---

## 4. Responsive Layout Grid

| Viewport | Product Grid | Quick Look Drawer | Floating Batch Dock |
| :--- | :--- | :--- | :--- |
| **Desktop (≥1200px)** | 4 Columns (3:4 ratio) | 520px Right Slide-over | Centered Floating Island (`bottom: 28px`) |
| **Tablet (900px–1199px)** | 3 Columns (3:4 ratio) | 480px Right Slide-over | Floating Island (`max-width: 90%`) |
| **Phablet (560px–899px)** | 2 Columns (3:4 ratio) | 420px Right Slide-over | Docked Bottom Bar |
| **Mobile (≤559px)** | 1–2 Columns | Full-width Bottom-Sheet | Docked Bottom Bar (`bottom: 0; safe-area`) |

---

## 5. Accessibility & Quality Standards (WCAG 2.1 AA)

- **Keyboard Navigation**: Accessible focus states, `Enter`/`Space` activation for selection rings, swatches, and size blocks; `Escape` key dismisses Quick Look drawer.
- **Focus Management**: Focus trapped inside Quick Look drawer while open; restores focus to trigger button upon close.
- **Contrast & Hierarchy**: Minimum 4.5:1 text contrast on dark obsidian backgrounds; distinct tabular numerals for prices.
- **Motion Restraint**: Respects `prefers-reduced-motion: reduce` by bypassing 3D tilt, spring animations, and multi-select sliding transitions.

---

## 6. Verification & Test Plan

1. **Automated Unit & State Regression**:
   - Verify `getSavedWishlist()`, `computeCapsuleStats()`, multi-selection state machine, and `localStorage` empty-state compliance with zero regressions.
2. **Functional Cart & Batch Pipeline**:
   - Verify single "ADD", multi-item "Move Selected to Bag", and "Move All to Bag" correctly inject items into `window.nexCart` and update header badges.
3. **UI / Visual Test (Browser Interaction)**:
   - Test at Desktop (1440×900) and Mobile (375×812) viewports.
   - Verify 4-column responsive grid reflow, 3D spring tilt + specular glare, Quick Look slide-over drawer opening with 3-asset thumbnail switching, and Floating Obsidian Batch Island appearance upon selection.
