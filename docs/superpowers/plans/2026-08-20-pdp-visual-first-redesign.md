# pages/product.html (PDP) Visual-First & Interactive Macro-Lens Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `pages/product.html` into a visual-first product detail page (PDP) featuring interactive model perspective toggles, visual material macro zoom, iconographic specification badges, and streamlined microcopy.

**Architecture:** Maintain dynamic URL parameter handling (`?id=p1...p8`), connect with `js/pdp.js`, integrate with `nexCart` state machine, and apply European Luxury typography with GPU transitions.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (Design Tokens & GPU Transforms), Vanilla JS (ES6+), Lucide Icons, Lenis Smooth Scroll.

## Global Constraints
- Typography: `Neue Haas Grotesk` / `Manrope` display, `Inter` UI/Body, `Instrument Serif` editorial accents.
- Visual Ratio: $\ge$70% layout area dedicated to photography and interactive visuals; copy $\le$30%.
- Copy Limits: Headlines max 4–6 words; descriptions max 1–2 sentences ($\le$25 words); zero text walls.
- Dynamic Catalog: Support all 8 products (`p1`–`p8`) seamlessly.
- Viewport Heights: Responsive across desktop (1440px), scaled laptop (1280×600), tablet (768px), and mobile (375px).

---

### Task 1: CSS Styling for Visual-First PDP Components
**Files:**
- Modify: `pages/product.html:15-160` (CSS styles or embedded styles)

**Interfaces:**
- Consumes: `../css/design-system.css?v=37` tokens
- Produces: CSS classes for `.pdp-perspective-bar`, `.pdp-spec-badges-grid`, `.pdp-color-swatch-circle`, and `.pdp-zoom-lens`.

- [x] **Step 1: Define CSS rules for Perspective Selector & Macro Zoom Stage**
- [x] **Step 2: Define CSS rules for Visual Specification Badges & Color Swatches**
- [x] **Step 3: Responsive media queries for 1280px, 1024px, 768px, and 375px**

---

### Task 2: HTML Markup Restructuring for PDP Main & Modals
**Files:**
- Modify: `pages/product.html:130-360` (Main PDP markup)

**Interfaces:**
- Consumes: High-resolution product and lifestyle assets in `../assets/images/`
- Produces: Visual gallery, buy-box with visual specs, interactive fit assistant modal, and curated look bundle.

- [x] **Step 1: Integrate perspective selector bar and macro zoom container in gallery**
- [x] **Step 2: Build visual spec badge grid and tactile color swatches in buy-box**
- [x] **Step 3: Preserve AI Fit Advisor modal, Complete the Look bundle section, and mobile sticky bar**

---

### Task 3: JavaScript Controller Enhancements in `js/pdp.js`
**Files:**
- Modify: `js/pdp.js`

**Interfaces:**
- Consumes: `PRODUCT_CATALOG` object and URL params
- Produces: Perspective view switching, dynamic spec badges population, and live macro texture updates.

- [x] **Step 1: Add Perspective & Macro Weave image mapping to catalog entries**
- [x] **Step 2: Wire perspective button listeners to smoothly swap gallery images**
- [x] **Step 3: Populate visual spec badges dynamically per product category**
- [x] **Step 4: Verify cart addition, size selection, and complete-the-look bundle sync**

---

### Task 4: Multi-Viewport Verification & Visual Audit
**Files:**
- Test: `pages/product.html?id=p1` live in browser

**Interfaces:**
- Consumes: Localhost dev server at `http://localhost:3000/pages/product.html?id=p1`
- Produces: Screenshot evidence and verification report.

- [x] **Step 1: Launch browser subagent to `http://localhost:3000/pages/product.html?id=p1`**
- [x] **Step 2: Test clicking perspective toggle buttons (Studio Flat · On Model · Macro Weave)**
- [x] **Step 3: Test color swatches and size selection**
- [x] **Step 4: Test AI Fit Assistant modal and applying recommended size**
- [x] **Step 5: Verify layout at 1280×600 (scaled laptop) and 375×812 (mobile)**
