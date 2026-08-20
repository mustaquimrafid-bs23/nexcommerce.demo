# Interactive AI Lookbook Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the homepage editorial lifestyle banner into an interactive, high-fashion **AI Vision Lookbook** featuring intelligent shoppable hotspots, fabric/material telemetry tags, and an understated Look Breakdown drawer.

**Architecture:** A lightweight, non-intrusive interactive layer overlaid on `.editorial-lifestyle-banner` inside `index.html`. Uses dedicated vanilla JS (`js/lookbook.js`) and CSS (`css/design-system.css`) with GPU-accelerated spring animations, interactive beacon pins, and accessible keyboard/focus navigation.

**Tech Stack:** HTML5 Semantic Picture, CSS3 Custom Properties & Glassmorphism, Vanilla ES6 JavaScript, Lucide Icons.

## Global Constraints

- **Zero Clutter Over Model**: Hotspots and Look Breakdown pills must be positioned discreetly without obscuring the model's face, posture, or the grand palazzo architecture.
- **Modernist Luxury Aesthetics**: Obsidian frosted glass (`rgba(8, 14, 30, 0.94)` with `1px solid rgba(255, 255, 255, 0.22)`), razor-sharp typography, and no saturated neon AI blobs.
- **Mobile Responsive & Touch Friendly**: Hotspots feature minimum 44×44px touch targets; Look Breakdown pill docks at the bottom thumb zone on mobile (`≤768px`).
- **Full Catalog Consistency**: Pieces link to real product IDs in `js/products-data.js` and support quick-add to bag.

---

### Task 1: Design Interactive Hotspots & Look Breakdown UI Markup

**Files:**
- Modify: `index.html:734-752`
- Modify: `css/design-system.css`

**Interfaces:**
- Consumes: `assets/images/lifestyle/Gemini_Generated_Image_t9kwvit9kwvit9kw.jpg` (desktop) and `assets/images/lifestyle/Gemini_Generated_Image_p8bt04p8bt04p8bt.jpg` (mobile)
- Produces: `.lookbook-hotspot`, `.lookbook-tag-card`, `.lookbook-capsule-pill`, `.lookbook-drawer`

- [ ] **Step 1: Write HTML markup for Hotspots and Look Breakdown Capsule**
Overlay 3 intelligent vision hotspots (The Crimson Gown, The Strappy Silk Sandals, The Gold Drop Earrings) and a corner-anchored AI Look Breakdown button on the banner container in `index.html`.

- [ ] **Step 2: Add CSS styles in `css/design-system.css`**
Style the pulsating beacon rings, frosted obsidian hotspot tags with specular inner highlights, and the Look Breakdown capsule pill.

---

### Task 2: Implement Interactive Hotspot & Quick-Inspect Logic

**Files:**
- Create: `js/lookbook.js`
- Modify: `index.html` (script tag inclusion)

**Interfaces:**
- Consumes: Hotspot DOM nodes (`[data-lookbook-hotspot]`), `js/products-data.js`
- Produces: `initLookbook()`, dynamic look tag positioning, quick-inspect popover toggle, click outside dismiss

- [ ] **Step 1: Write `js/lookbook.js` logic**
Handle desktop hover and mobile tap events for hotspot beacons, smooth spring expansion of the piece spec card, and cart integration.

- [ ] **Step 2: Wire up Quick-Add to Cart from Lookbook tags**
Allow direct addition to the cart drawer with tactile toast confirmation.

---

### Task 3: Visual & Interactive Verification across Desktop and Mobile

**Files:**
- Test with: `chrome-devtools-mcp` browser subagent
- Verify: 1440×900 desktop, 1280×600 laptop, 375×812 mobile

- [ ] **Step 1: Verify on Desktop Viewport**
Check hotspot alignment against the model, hover tooltips, and non-intrusive appearance.

- [ ] **Step 2: Verify on Mobile Viewport**
Check touch target accessibility, bottom-docked capsule look pill, and smooth tap behavior.
