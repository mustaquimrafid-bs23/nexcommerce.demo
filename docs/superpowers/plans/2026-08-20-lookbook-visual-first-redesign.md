# pages/lookbook.html Visual-First & Shoppable Runway Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `pages/lookbook.html` from a legacy static page into an interactive, visual-first editorial runway featuring interactive shoppable model hotspot pins, dynamic capsule category filtering, and an instant "Shop the Entire Look" drawer.

**Architecture:** Integrate global canvas gradients, European Luxury typography, centralized site header/footer, Lucide iconography, GPU-composited view transitions, and cart state-machine integration.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (Design Tokens & GPU Transforms), Vanilla JS (ES6+), Lucide Icons, Lenis Smooth Scroll.

## Global Constraints
- Typography: `Neue Haas Grotesk` / `Manrope` display, `Inter` UI/Body, `Instrument Serif` editorial accents.
- Visual Ratio: $\ge$70% layout area dedicated to photography and interactive visuals; copy $\le$30%.
- Copy Limits: Headlines max 4–6 words; descriptions max 1–2 sentences ($\le$25 words); zero text walls.
- Viewport Heights: Responsive across desktop (1440px), scaled laptop (1280×600), tablet (768px), and mobile (375px).
- Navigation & Brand: Maintain global header/footer structure, preloader, mini-cart side drawer, and AI search modal integration.

---

### Task 1: CSS Foundation & Runway Styling
**Files:**
- Modify: `pages/lookbook.html:15-270` (CSS styles)

**Interfaces:**
- Consumes: `../css/design-system.css?v=37` tokens
- Produces: CSS layout classes for `.lookbook-hero`, `.lookbook-filter-rail`, `.look-card-visual`, `.look-hotspot-pin`, `.look-popover-card`, and `#shopLookModal`.

- [x] **Step 1: Define CSS layout for Full-Bleed Runway Hero & Capsule Filter Rail**
- [x] **Step 2: Define CSS rules for Visual Look Cards & Spatial Model Hotspots**
- [x] **Step 3: Define CSS rules for "Shop the Look" Modal & Drawer**
- [x] **Step 4: Responsive media queries for 1280px, 1024px, 768px, and 375px**

---

### Task 2: HTML Markup Restructuring & Asset Integration
**Files:**
- Modify: `pages/lookbook.html:270-435` (Header & Main content)

**Interfaces:**
- Consumes: Verified studio assets in `../assets/images/lifestyle/`
- Produces: 5 structured visual sections with global header/footer:
  1. Global site header with search pill, concierge trigger, and 3-dot menu.
  2. Full-bleed Runway Hero with docked Look 01 pill.
  3. Interactive Category Filter Rail (All Looks, Tailoring, Leather, Acoustics, Horology).
  4. 6 Interactive Shoppable Look Cards with model hotspot pins.
  5. Editorial Pull Quote & Pre-Footer Concierge Invitation.

- [x] **Step 1: Integrate standard site header & preloader**
- [x] **Step 2: Build Runway Hero and Filter Rail markup**
- [x] **Step 3: Build 6 Look Cards with spatial model hotspots and ensemble thumbnail footers**
- [x] **Step 4: Build "Shop the Look" modal markup and standard site footer mount**

---

### Task 3: Interactive JS Controllers & Cart Integration
**Files:**
- Modify: `pages/lookbook.html:435-480` (JavaScript controllers)

**Interfaces:**
- Consumes: `../js/cart.js` state machine (`nexCart.addItem()`, `nexCart.openDrawer()`)
- Produces: Filter rail state filtering, hotspot pin toggling, and "Shop Full Look" bundle addition.

- [x] **Step 1: Implement Capsule Filter Controller**
- [x] **Step 2: Implement Spatial Hotspot Pin Controller**
- [x] **Step 3: Implement "Shop Full Look" Modal Controller**
- [x] **Step 4: Verify preloader, Lucide icons, search modal, and GPU transitions**

---

### Task 4: Multi-Viewport Verification & Visual Audit
**Files:**
- Test: `pages/lookbook.html` live in browser

**Interfaces:**
- Consumes: Localhost dev server at `http://localhost:3000/pages/lookbook.html`
- Produces: Screenshot evidence and verification report.

- [x] **Step 1: Launch browser subagent to `http://localhost:3000/pages/lookbook.html`**
- [x] **Step 2: Verify Runway Hero and filter category tabs**
- [x] **Step 3: Test clicking model hotspot pin and "Quick Add" action**
- [x] **Step 4: Test clicking "Shop Full Look" and verifying modal open/close**
- [x] **Step 5: Verify responsive layout at 1280×600 (scaled laptop) and 375×812 (mobile)**
