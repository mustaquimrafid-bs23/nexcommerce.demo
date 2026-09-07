# About Us Page (The Atelier Story) — Luxury Editorial Design & Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Design, build, and integrate a dedicated luxury **About Us / Maison Atelier Story** page (`pages/about.html`) complete with editorial storytelling, interactive craft pillars (Tailored Ready-to-Wear, Artisanal Leather, High Acoustics), an interactive 120fps Atelier Evolution timeline, sustainability commitments ledger, master artisan showcases, and seamless site-wide navigation/footer integration adhering to the luxury lifestyle e-commerce design and 4 Motion Standards.

**Architecture:**
- `pages/about.html`: A standalone luxury editorial experience featuring a brand preloader, global luxury header, hero manifesto with human lifestyle imagery, 3 interactive craft pillar cards with 3D tilt (`±6.5°`) and specular glare tracking, an interactive 5-node Atelier Evolution milestone stepper, conscious craft metric badges, artisan profile showcase, pre-footer concierge CTA, and 4-column footer.
- `js/animations.js`: Integration of `initAboutPageMotion()` for 3D spring tilt physics, cursor-following specular glare (`--about-glare-x`, `--about-glare-y`), timeline milestone switcher, and GPU page transition curtain (`#pageTransitionOverlay`).
- `js/header.js` & Footer Links: Updating global header and footers across `index.html`, `pages/contact.html`, `pages/lookbook.html`, etc. to link to `pages/about.html`.

**Tech Stack:** Vanilla HTML5/CSS3 · Native WAAPI / Motion.dev · Lucide Icons · Google Fonts (Cormorant Garamond, Inter, Outfit, Work Sans) · Lenis Smooth Scroll · Centralized `window.nexCart` & `NexAuth`.

---

## Global Constraints

- **Luxury Neutral Palette**: Obsidian canvases `rgba(8, 14, 30, 0.96)` and `#020B18`, cyan accent `#3DE0FF`, pink accent `#FB7185`, gold/amber accent `#E5C07B`, emerald `#00E096`. No neon or oversaturated backgrounds.
- **Typography Hierarchy**: Display/Headlines = `Cormorant Garamond` (refined serif), Body/Labels = `Inter` / `Work Sans` / `Outfit`.
- **Editorial Voice**: Aspirational, calm, declarative copy written from a luxury atelier perspective; strictly zero AI buzzword stuffing.
- **All 4 Motion Standards**:
  1. *Micro-interactions*: Interactive 5-stage milestone stepper, smooth tab transitions, tactile button ripples.
  2. *3D Hover Physics*: Multi-layer shadow elevation, spring LERP mouse tilt physics (`±6.5°`), and dynamic cursor-following specular glare.
  3. *Page Transitions*: Hardware-accelerated GPU cross-dissolve curtain (`#pageTransitionOverlay`) on internal links.
  4. *Scroll Parallax*: Differential depth layers (`data-parallax-depth`) and smooth scroll-triggered reveals.
- **Responsive Viewport Scaling**: Flawless reflow across Desktop (1440px), Scaled Laptops (effective 600px height), Tablets (768px), and Mobile (375px).
- **Zero Regressions**: Header navigation, search modal (`Ctrl+K`), mini-cart drawer, and preloader must work seamlessly.

---

## Visual Layout Blueprint

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ LUXURY EDITORIAL PRELOADER (#pagePreloader) — "The Digital Atelier & Heritage Story"        │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ GLOBAL LUXURY HEADER (Logo · Categories · New In · Search Pill [Ctrl+K] · Concierge · Bag)  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ EDITORIAL HERO & BRAND MANIFESTO                                                            │
│ [● THE MAISON STORY · EST. 2022]                                                            │
│ Where Human Craftsmanship Meets Digital Intelligence.                                       │
│ "We believe true luxury is not about excess, but the relentless consideration of detail."   │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ EDITORIAL LIFESTYLE SCENIC CANVAS (Model in bespoke cashmere & studio light)            │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ THE 3 PILLARS OF THE MAISON (Interactive 3D Tilt Cards with Specular Glare)                 │
│ ┌───────────────────────────┬───────────────────────────┬─────────────────────────────────┐ │
│ │ 01. TAILORED READY-TO-WEAR│ 02. ARTISANAL LEATHER     │ 03. BESPOKE ACOUSTICS           │ │
│ │ Mongolian 2-ply cashmere, │ Tuscan vegetable-tanned   │ Machined aircraft-grade         │ │
│ │ Japanese selvedge denim,  │ full-grain calfskin,      │ aluminum, beryllium drivers,    │ │
│ │ Italian Mulberry silk.    │ Goodyear-welted soles.    │ handcrafted solid walnut.       │ │
│ │ [ EXPLORE RTW → ]         │ [ EXPLORE LEATHER → ]     │ [ EXPLORE ACOUSTICS → ]         │ │
│ └───────────────────────────┴───────────────────────────┴─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ ATELIER EVOLUTION & HERITAGE (Interactive 120fps Milestone Stepper)                         │
│ [2022 Concept] ── [2023 Bespoke Launch] ── [2024 AI Concierge] ── [2025 Circular] ── [2026] │
│ ┌───────────────────────────────────────────┬─────────────────────────────────────────────┐ │
│ │ ACTIVE MILESTONE STORY                    │ ARCHIVE PHOTOGRAPHY & SKETCH CANVAS         │ │
│ │ 2024 · The Intelligent Atelier            │ Studio tailoring draughts & acoustic labs   │ │
│ │ Merging generative neural intent discovery│                                             │ │
│ │ with bespoke garment measurement systems. │                                             │ │
│ └───────────────────────────────────────────┴─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ THE CONSCIOUS CRAFT & SUSTAINABILITY LEDGER                                                 │
│ ┌────────────────────┬────────────────────┬────────────────────┬──────────────────────────┐ │
│ │ 100%               │ 0%                 │ NET ZERO           │ LIFETIME                 │ │
│ │ Traceable Natural  │ Microplastics in   │ White-Glove Carbon │ Atelier Repair & Care    │ │
│ │ Certified Fibres   │ Garment Blends     │ Offset Logistics   │ Provenance Guarantee     │ │
│ └────────────────────┴────────────────────┴────────────────────┴──────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ MASTER CRAFTSMEN & CURATORS                                                                 │
│ ┌───────────────────────────┬───────────────────────────┬─────────────────────────────────┐ │
│ │ AURELIA VANCE             │ TARIQ RAHMAN              │ ELENA ROSTOVA                   │ │
│ │ Creative Director         │ Master Bespoke Tailor     │ Head of Acoustic Engineering    │ │
│ │ "Form follows emotion."   │ "Every stitch has a pulse"│ "Acoustics in purest clarity."  │ │
│ └───────────────────────────┴───────────────────────────┴─────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ PRIVATE ATELIER INVITATION (Pre-Footer CTA)                                                 │
│ Ready to experience considered luxury?                                                      │
│ [ EXPLORE CATALOG ]   [ CONSULT STYLE CONCIERGE ]                                           │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ ELEVATED 4-COLUMN FOOTER (Brand · Collections · Client Services · The Maison)               │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Tasks

### Task 1: Create `pages/about.html`

**Files:**
- Create: `pages/about.html`
- Uses: `css/design-system.css`, `assets/images/lifestyle/`, `assets/images/brand/`

**Interfaces:**
- Consumes: Design system variables (`--font-serif`, `--font-body`, `--accent-cyan`, `--accent-pink`, `--bg-main`, `--bg-surface`, `--text-primary`, `--text-secondary`).
- Produces: Semantic luxury About Us page with micro-interactions, responsive grid, 3D tilt card markup, and preloader.

- [ ] **Step 1: Write `pages/about.html`**
  - Implement full luxury editorial markup:
    - Preloader (`#pagePreloader` with animated progress).
    - Standard luxury site header matching `pages/contact.html` and `pages/size-guide.html`.
    - Editorial Hero & Manifesto with rich lifestyle imagery.
    - 3 Maison Pillars cards (`.about-pillar-card`) with specular glare nodes (`.card-specular-glare`), badges, and explore links.
    - Interactive 5-step Milestone Stepper (`.timeline-node-btn`, `.timeline-content-panel`).
    - Conscious Craft metrics ledger (`.ledger-stat-card`).
    - Artisan & Curator profile grid (`.artisan-card`).
    - Pre-footer CTA banner linking to Concierge & Catalog.
    - Standard luxury 4-column footer with active Maison links.
    - Mini Cart Drawer and Search Overlay modals.

- [ ] **Step 2: Verify markup structure**
  - Ensure all semantic tags, ARIA labels, Lucide icons, and responsive classes are cleanly applied without syntax errors.

---

### Task 2: Implement Interactive Motion and Timeline Controller in `js/animations.js` & Page Script

**Files:**
- Modify: `js/animations.js`
- Modify: `pages/about.html` (embedded controller script)

**Interfaces:**
- Consumes: Cursor coordinates for 3D spring tilt and specular glare calculation; click events for milestone stepping.
- Produces: Smooth 120fps reactive hover, specular glares, active timeline transition, and Lenis smooth scrolling.

- [ ] **Step 1: Implement 3D Tilt & Specular Glare Physics for Pillar & Artisan Cards**
  - Add pointer movement tracking with spring LERP calculation (rotation `±6.5deg`, specular position `--about-glare-x`, `--about-glare-y`).
- [ ] **Step 2: Implement Interactive Timeline Stepper**
  - Wire up the 5 milestone buttons to smoothly switch the active milestone story, update the progress track width, and fade-in the corresponding milestone archive photo and narrative.
- [ ] **Step 3: Wire up GPU Page Transition Curtain**
  - Ensure links to `contact.html`, `category.html`, and `discovery.html` trigger `#pageTransitionOverlay` curtain fade.

---

### Task 3: Site-Wide Header & Footer Navigation Integration

**Files:**
- Modify: `index.html` (footer "The Maison" section)
- Modify: `pages/contact.html` (footer "The Maison" section)
- Modify: `pages/size-guide.html` (footer "The Maison" section)
- Modify: `pages/lookbook.html` (footer "The Maison" section)

**Interfaces:**
- Consumes: Target link `pages/about.html` (or `about.html` from within `pages/`).
- Produces: Consistent site-wide access to About Us from "THE MAISON" footer column.

- [ ] **Step 1: Update `index.html` footer**
  - Update "THE MAISON" column to have `<a href="pages/about.html" class="footer-link-item">Atelier Story</a>`.
- [ ] **Step 2: Update subpages' footers**
  - Update `pages/contact.html`, `pages/lookbook.html`, and `pages/size-guide.html` footers to link to `about.html`.

---

### Task 4: Visual & Responsive Verification across Viewports

**Files:**
- Test: `pages/about.html` on Desktop (1440px), Laptop/Scaled (1080p @ 125%-150%), Tablet (768px), Mobile (375px).

- [ ] **Step 1: Launch Dev Server and Navigate to `pages/about.html`**
  - Verify page loads with 0 console errors and clean typography rendering.
- [ ] **Step 2: Test Interactive Timeline Stepper**
  - Click through each milestone (2022, 2023, 2024, 2025, 2026) and verify seamless state transitions.
- [ ] **Step 3: Test 3D Card Hover Physics & Glare**
  - Verify smooth spring tilt on craft pillar cards and artisan profile cards.
- [ ] **Step 4: Verify Mobile & Tablet Responsiveness**
  - Confirm touch targets (min 44px), unobstructed imagery, zero overflow, and fluid typographic breathing space.
- [ ] **Step 5: Take verification screenshots and document in walkthrough**
