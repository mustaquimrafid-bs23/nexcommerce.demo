# Redesign Micro-Merchandising 3-Column Section Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the 3-column merchandising cluster ("New Arrivals", "Best Sellers", "Picked for you") on the homepage into an elevated, luxury editorial discovery component adhering to world-class e-commerce design standards (SSENSE / NET-A-PORTER / Loewe).

**Architecture:** Replace the cramped 52px widget-like cards with spacious luxury glass modules featuring larger 72px studio imagery, refined typography hierarchy (editorial eyebrow, high-contrast title, tabular currency pricing), smooth hover states with optical zoom, and interactive Quick Add actions with instant state feedback.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (custom properties, backdrop-filter, flex/grid, micro-animations), Vanilla JavaScript (Lucide icons, nexCart integration, custom toast/haptic feedback).

---

## Global Constraints

- **Color Foundation:** Neutral luxury dark slate (`#0B111E` / `rgba(15, 23, 42, 0.6)`) with subtle hairline borders (`rgba(255, 255, 255, 0.08)`). No neon glow borders or saturated gradients.
- **Typography:** Editorial typography scaling; category in uppercase tracked mono-sans (`11px`, `letter-spacing: 0.06em`), product titles in crisp semi-bold (`14px`), and prices in tabular numerals (`13px`).
- **Touch & Accessibility:** Minimum 44×44px interactive tap area, WCAG 2.1 AA contrast ratio (>= 4.5:1), visible `:focus-visible` rings, and explicit `aria-label` on all action buttons.
- **Zero Framework Bloat:** Pure Vanilla JS/CSS compatible with existing `nexCart` and Lucide icons.

---

## Proposed Changes

### Component 1: Markup & Semantic Structure (`index.html`)

#### [MODIFY] [index.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/index.html)
- Upgrade the `.home-micro-merch-section` container with an editorial section header (`CURATED EDITIONS · QUICK DISCOVERY`).
- Refactor the 3 columns ("New Arrivals", "Best Sellers", "Picked for You") to include:
  - Editorial column headers with subtle badge counters and refined "View collection →" links.
  - Enhanced item rows with 72×72px high-res thumbnails, product tags, clean titles, category metadata, and price.
  - Accessible Quick Add trigger with hover pill tooltip and state transition.

### Component 2: CSS Architecture & Visual Design (`css/design-system.css`)

#### [MODIFY] [css/design-system.css](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css)
- Refactor lines 8077–8233 (`4-COLUMN MICRO-MERCHANDISING CLUSTER`).
- Implement sleek frosted glass surfaces with `backdrop-filter: blur(20px)`, subtle inner border highlight `inset 0 1px 0 rgba(255, 255, 255, 0.08)`, and smooth card drop shadows.
- Add row hover states: subtle light background tint (`rgba(255, 255, 255, 0.035)`), smooth thumbnail zoom (`scale(1.05)` with `cubic-bezier(0.16, 1, 0.3, 1)`), and dynamic action reveal.
- Responsive breakpoints: 3 columns on desktop, 2 columns on tablet (960px), 1 column with smooth padding on mobile (<= 600px).

### Component 3: Interaction & Cart Integration (`js/home.js`)

#### [MODIFY] [js/home.js](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/js/home.js)
- Enhance `initMicroMerchandising()`:
  - Row click navigates to PDP (`product.html?id=...`).
  - Quick Add button triggers `window.nexCart.addItem(...)` with size default and smooth success feedback (icon checkmark transition + toast notification).
  - Add keyboard navigation support (`Enter` / `Space` on row).

---

## Tasks

### Task 1: CSS Foundation & Luxury Styling for Micro-Merchandising

**Files:**
- Modify: `css/design-system.css:8077-8233`

**Interfaces:**
- Consumes: CSS variables `--bg-card`, `--border-subtle`, `--font-body`, `--text-secondary`, `--accent`
- Produces: Class rules `.home-micro-merch-section`, `.micro-merch-header`, `.micro-merch-grid-3col`, `.micro-merch-col`, `.micro-col-header`, `.micro-col-title`, `.micro-col-count`, `.micro-item-list`, `.micro-item-row`, `.micro-item-thumb`, `.micro-item-info`, `.micro-item-add-btn`

- [ ] **Step 1: Write luxury design CSS styles**
Replace legacy styles in `css/design-system.css` with refined luxury card styles, 72px thumbnail boxes, polished typography, hover transitions, and responsive grid layouts.

- [ ] **Step 2: Verify CSS lint and rules**
Ensure syntax validity and absence of style conflicts or unexpected layout shifts.

---

### Task 2: Update HTML Structure in `index.html`

**Files:**
- Modify: `index.html:686-887`

**Interfaces:**
- Consumes: CSS classes defined in Task 1, Lucide icons (`plus`, `arrow-right`, `check`, `sparkles`)
- Produces: Updated DOM elements with proper semantic tags and `data-*` attributes for cart integration.

- [ ] **Step 1: Update section markup**
Refactor the 3-column micro-merchandising cluster in `index.html` with clean editorial column headers, 72px image paths, brand/category tags, and formatted BDT pricing.

- [ ] **Step 2: Verify Lucide icons & data attributes**
Confirm all 12 product rows have valid `data-id`, `data-name`, `data-price`, `data-img`, `data-cat`, and correct PDP links.

---

### Task 3: Enhance Interactions in `js/home.js` & Verification

**Files:**
- Modify: `js/home.js:758-802`

**Interfaces:**
- Consumes: DOM `.micro-item-row`, `.micro-item-add-btn`, `window.nexCart`, `window.lucide`
- Produces: Smooth Add-to-Bag interaction, PDP redirect, checkmark animation feedback, and keyboard event handling.

- [ ] **Step 1: Update interaction logic in `js/home.js`**
Enhance `initMicroMerchandising()` with animated icon states, cart badge update, and accessible click targets.

- [ ] **Step 2: Visual & functional verification via browser inspection**
Test desktop, tablet, and mobile views, verifying hover effects, button click handling, cart item addition, and visual polish.

---

## Verification Plan

### Automated / Syntax Check
- Verify HTML validity and JS syntax by loading `index.html` in the browser environment.
- Confirm console logs are free of JS errors or unresolved assets.

### Manual / Visual Verification
1. **Desktop View (1280px / 1440px):**
   - Check alignment and spacing across the 3 columns ("New Arrivals", "Best Sellers", "Picked for You").
   - Hover over each row: verify smooth thumbnail zoom, subtle background highlight, and Quick Add button state.
2. **Add to Bag Flow:**
   - Click the `+` Quick Add button on any item.
   - Verify cart quantity increases, icon morphs into a green checkmark, and drawer/toast notifies the user.
3. **Navigation Flow:**
   - Click on any product row (outside the button) to confirm seamless redirection to `product.html?id=...`.
4. **Mobile & Tablet View (390px, 768px):**
   - Verify 2-column layout on tablet and responsive single-column layout on mobile with touch-friendly spacing.
