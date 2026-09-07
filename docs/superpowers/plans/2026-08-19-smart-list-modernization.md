# Smart List — Modernization & 4 Motion Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit, redesign, and modernize `pages/smart-list.html` and its supporting script `js/smart-reorder.js` to eliminate outdated animation tracks, remove hard/bold borders and wordy text clutter, and fully integrate all 4 Motion Standards (Micro-interactions with 120fps progress timer & look switcher sync, 3D hover physics with specular glare, GPU cross-dissolve page transitions, and differential scroll parallax) while ensuring perfect responsive design and zero feature regressions.

**Architecture:** 
- `pages/smart-list.html`: Refined DOM markup featuring the luxury Curated Look Switcher & 120fps Animation Track, clean luxury header with zero text clutter, curation valuation toolbar, responsive filter bar, and 4-column differential parallax grid.
- `js/smart-reorder.js`: Core Smart Reorder engine controlling the 120fps look switcher timer, interactive repurchase cadence popover, 5-second undo toast, live curation valuation calculation, cart integration, and reactive filter sync.
- `js/animations.js`: Centralized motion orchestrator adding `initSmartListPageMotion()` and `initSmartListCardsMotion()` to ensure 3D spring LERP tilt (`±6.5°`), cursor-tracking specular glare, GPU cross-dissolve curtain transitions (`#pageTransitionOverlay`), and Lenis-linked differential scroll parallax.

**Tech Stack:** Vanilla HTML5/CSS3 · Motion.dev / Native WAAPI · Lucide Icons · Lenis Smooth Scroll · Cormorant Garamond / Inter / Outfit Typography.

---

## Global Constraints

- **Luxury Palette**: Obsidian surfaces `rgba(8, 14, 30, 0.96)` and `#020B18`, cyan `#3DE0FF`, pink `#FB7185`, gold/emerald accents, zero saturated/neon borders.
- **Typography**: Display/Headlines = `Cormorant Garamond` (serif, luxury, confident), body = `Inter` / `Work Sans` / `Outfit`.
- **Zero Text Clutter**: Eliminate wordy AI descriptions and robotic spec text; adopt calm, declarative editorial voice (e.g. "Curated Replenishments", "Your private archive reorder queue").
- **No Hard/Bold Borders**: Use subtle 1px translucent borders (`rgba(255, 255, 255, 0.07)` or `rgba(255, 255, 255, 0.1)`) paired with multi-layer shadow depth.
- **4 Motion Standards**:
  1. *Micro-interactions*: 120fps GPU progress bar (`transform: scaleX()`), look switcher auto-sync (6.5s cycle) with pause toggle, tactile quick-add ripple, stepper scale pulse.
  2. *3D Hover Physics*: Spring LERP tilt (`±6.5°`), dynamic cursor-following specular glare, multi-layer depth shadow.
  3. *Page Transitions*: Hardware-accelerated GPU cross-dissolve curtain (`#pageTransitionOverlay`) on all card and navigation clicks.
  4. *Scroll Parallax*: Differential column depth (`data-parallax-depth="0.6"`, `1.15`, `1.7`, `0.85`) linked to Lenis / rAF scroll loop.
- **Accessibility & Touch**: Min 44×44px touch targets; respect `prefers-reduced-motion: reduce`.
- **Zero Feature Regressions**: Preserve custom interval adjustments (localStorage), item dismissals (60-day expiry), 5-second undo toast, Move All to Bag progress, CartState & `window.nexCart` compatibility.

---

## Visual & Interaction Blueprint

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  SITE HEADER (Clean Luxury Nav, Search Ctrl+K, Wishlist, Cart, 3-Dot Menu)  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  HERO SECTION                                                               │
│  ✦ AI REPLENISHMENT · ATELIER CURATION                                       │
│  Your Curated Replenishments                                                │
│  Intelligently recommended from your private atelier acquisitions.          │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  CURATED LOOK SWITCHER & 120FPS ANIMATION TRACK                             │
│  ════════════════════████████░░░░░░░░░░░░░░░░  ← 120fps scaleX progress track│
│                                                                             │
│  [● CURATED CAPSULE · 01 OF 04]  [⏸]    [01 KNITWEAR] [02 ACOUSTICS] ...    │
│                                                                             │
│  STORY PANE (Left)                      VISUAL FRAME & 3D PILL (Right)      │
│  SEASONAL REORDER · AW26                ┌────────────────────────────────┐  │
│  The Winter Tailoring Capsule           │ Lifestyle Photography Frame    │  │
│  Double-faced wool and structured       │                                │  │
│  cashmere layers for cold rotation.     │  ┌──────────────────────────┐  │  │
│                                         │  │ [Thumb] WOOL BLAZER      │  │  │
│  [View Replenishments →]  (3 Pieces)    │  │ BDT 24,500   [+ BAG]     │  │  │
│                                         │  └──────────────────────────┘  │  │
│                                         └────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  TOOLBAR:  RECOMMENDED PIECES (12)  │  CURATION VALUE (BDT 214,800)  │ [+ BAG ALL]
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  CATEGORY FILTER PILLS: [All (12)] [Ready-to-Wear (7)] [High Acoustics (2)]...
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│  4-COLUMN DIFFERENTIAL PARALLAX GRID                                        │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐                  │
│  │ Col 1    │   │ Col 2    │   │ Col 3    │   │ Col 4    │                  │
│  │ depth 0.6│   │ depth 1.15│  │ depth 1.7│   │ depth 0.85│                 │
│  │ 3D Tilt  │   │ 3D Tilt  │   │ 3D Tilt  │   │ 3D Tilt  │                  │
│  │ Glare ▓  │   │ Glare ▓  │   │ Glare ▓  │   │ Glare ▓  │                  │
│  │ [Cadence]│   │ [Cadence]│   │ [Cadence]│   │ [Cadence]│                  │
│  │ [- 1 +]  │   │ [- 1 +]  │   │ [- 1 +]  │   │ [- 1 +]  │                  │
│  │ [Move Bag]   │ [Move Bag]   │ [Move Bag]   │ [Move Bag]                  │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘                  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## File Structure & Responsibilities

| File | Changes / Responsibility |
|------|--------------------------|
| `pages/smart-list.html` | Redesign markup: add Curated Look Switcher spotlight section with 120fps progress track, clean luxury hero, curation valuation toolbar, filter pills, `#pageTransitionOverlay`, and update CSS rules (no hard borders, modern luxury tokens). |
| `js/smart-reorder.js` | Update controller to drive the 120fps Look Switcher progress timer and look tabs, coordinate look filter clicks, handle custom cadence modal, 5-second undo toast, stepper pulses, Move All to Bag animation, and cart additions. |
| `js/animations.js` | Add `initSmartListPageMotion()` and `initSmartListCardsMotion()` to central `initAllMotion()` for 3D spring LERP tilt, dynamic specular glare, GPU page transitions, and differential scroll parallax. |

---

## Tasks

### Task 1: Rebuild `pages/smart-list.html` Structure & Styles

**Files:**
- Modify: `pages/smart-list.html`

- [ ] **Step 1: Update `pages/smart-list.html` Header & Head Meta**
  - Ensure viewport, view transitions meta, font links (`Cormorant Garamond`, `Outfit`, `Work Sans`, `Inter`), and `design-system.css?v=35` are properly referenced.
  - Add `#pageTransitionOverlay` curtain.

- [ ] **Step 2: Redesign the Hero & Replace Outdated Seasonal Banner with Curated Look Switcher & 120fps Animation Track**
  - Construct `.sl-hero` with minimal eyebrow and elegant `Cormorant Garamond` headline.
  - Insert `.plp-curation-spotlight` with `.spotlight-progress-track`, `.spotlight-progress-bar`, `.spotlight-header-row` (with live dot, capsule counter, pause toggle, capsule tabs), and `.spotlight-body-layout` (story pane + visual pane with lifestyle image and floating 3D shoppable look capsule).

- [ ] **Step 3: Refine Toolbar, Category Filter Bar, and Product Grid Markup**
  - Toolbar with Recommended Pieces count, Estimated Curation Value, and "Move All to Bag" button with progress track.
  - Filter bar with category tabs.
  - Clean grid container `#slGrid` and `#slEmptyState`.
  - Luxury Concierge Bridge banner.

- [ ] **Step 4: Update Inline CSS Styles**
  - Remove all hard/bold borders (`border: 1px solid rgba(61, 224, 255, 0.22)` etc.).
  - Implement sleek obsidian glass cards with subtle 1px border `rgba(255, 255, 255, 0.07)`.
  - Include styling for 3D tilt, specular glare, quantity steppers, ripple animations, cadence modal, and undo toast.
  - Add responsive media queries for 1200px, 1024px, 768px, and 480px.

---

### Task 2: Update `js/smart-reorder.js` for Look Switcher & Core Features

**Files:**
- Modify: `js/smart-reorder.js`

- [ ] **Step 1: Define Curated Look Switcher Dataset & State**
  - Define `CURATED_REPLENISHMENT_LOOKS` array with 4 rich looks (Tailored Knitwear, High Acoustics, Artisanal Footwear, Horology & Leather) featuring seasonal edit labels, descriptions, target categories, landscape lifestyle imagery, and featured product info.

- [ ] **Step 2: Implement 120fps GPU Progress Timer & Look Switcher Controller**
  - Implement `startLookTimer()`, `tickLookTimer()`, `updateProgressBar(progress)`, `setCuratedLook(index, userInitiated)`, and pause/resume logic.
  - Ensure progress bar uses GPU `transform: scaleX(progress)` with `transform-origin: left center` for 120fps rendering.
  - Connect tab clicks and pause toggle button.
  - Connect "View Replenishments" action button to trigger category filter.

- [ ] **Step 3: Refactor Card Builder & Grid Rendering**
  - Update `buildCardHTML()` to output luxury obsidian cards with `data-parallax-depth`, specular glare layer, dismiss button, interactive cadence button, brand/category metadata, price, quantity stepper, and "Move to Bag" button.
  - Assign alternating differential parallax depth (`0.6`, `1.15`, `1.7`, `0.85`) across cards.

- [ ] **Step 4: Maintain Cadence Modal, Undo Toast, Steppers, and Cart Actions**
  - Keep custom cadence adjustment popover with clean radio selections.
  - Maintain 5-second interactive undo toast on card removal.
  - Ensure quantity stepper update triggers valuation recalculation and button ripple triggers.
  - Connect "Move All to Bag" button with multi-item batch cart insertion and visual feedback.

---

### Task 3: Integrate 4 Motion Standards in `js/animations.js`

**Files:**
- Modify: `js/animations.js`

- [ ] **Step 1: Create `initSmartListPageMotion()` and `initSmartListCardsMotion()`**
  - `initSmartListPageMotion()`: Sets up Lenis / rAF-driven differential scroll parallax on `#slGrid .sl-card` using `data-parallax-depth` and internal image micro-parallax.
  - `initSmartListCardsMotion()`: Binds spring LERP mouse tilt physics (`MAX_TILT = 6.5`), cursor-tracking specular glare, and GPU cross-dissolve navigation via `#pageTransitionOverlay` on product title and image links.

- [ ] **Step 2: Wire into `initAllMotion()` and DOM Lifecycle**
  - Call `initSmartListPageMotion()` within `initAllMotion()`.
  - Expose `window.initSmartListPageMotion` and `window.initSmartListCardsMotion`.
  - Call `window.initSmartListCardsMotion()` inside `renderSmartListPage()` after cards are rendered or filtered.

---

### Task 4: Responsive Verification & Quality Assurance

**Files:**
- Test: Open `pages/smart-list.html` in browser using DevTools / subagent across viewports.

- [ ] **Step 1: Test Desktop Viewport (1440px / 1280px)**
  - Verify Look Switcher auto-cycles smoothly with 120fps progress bar.
  - Verify 3D mouse tilt and specular glare on product cards.
  - Verify differential scroll parallax as page scrolls.
  - Verify quantity steppers and "Move All to Bag" calculation.

- [ ] **Step 2: Test Tablet Viewport (768px - 1024px)**
  - Check 2-column grid reflow and Look Switcher responsiveness.

- [ ] **Step 3: Test Mobile Viewport (375px - 480px)**
  - Verify touch layout, Look Switcher compact layout, filter bar horizontal scroll, and minimum 44px touch targets.
  - Verify zero horizontal overflow or badge clipping.

- [ ] **Step 4: Test Interactive Features**
  - Test dismissal of an item → verify 5-second undo toast appears and "Undo" restores the card.
  - Test clicking cadence pill → verify modal opens, selection updates cadence, and toast confirms.
  - Test moving item to bag → verify CartState / mini cart receives item.
