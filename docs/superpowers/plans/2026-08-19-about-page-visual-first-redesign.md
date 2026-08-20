# pages/about.html Visual-First & Low-Text Density Redesign Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform `pages/about.html` from a text-heavy narrative into a world-class, visual-first editorial atelier showcase with interactive material swatches, spatial craftsmanship hotspots, photo-driven milestone cards, and minimal microcopy.

**Architecture:** Maintain zero-dependency vanilla HTML/CSS/JS with GPU-composited transitions, Lucide icons, and Lenis smooth scrolling. Re-architect the layout into 7 distinct visual modules adhering to the 70/30 visual-to-text dominance ratio and European Luxury typography system.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (Custom Properties & Design Tokens), Vanilla JS (ES6+), Lucide Icons, Lenis Smooth Scroll.

## Global Constraints
- Typography: `Neue Haas Grotesk` / `Manrope` display, `Inter` body/UI, `Instrument Serif` editorial accents. Strictly no AI fonts.
- Visual Ratio: $\ge$70% layout area dedicated to photography and interactive visuals; text elements $\le$30%.
- Copy Limits: Headlines max 4–6 words; descriptions max 1–2 sentences ($\le$25 words); zero text walls ($>3$ lines forbidden).
- Viewport Heights: Responsive across desktop (1440px), laptop with 125%–150% scaling (1280×600), tablet (768px), and mobile (375px).
- Navigation & Brand: Maintain global header/footer structure, preloader, mini-cart side drawer, and AI search modal integration.

---

### Task 1: Foundation Styling & Layout Tokens
**Files:**
- Modify: `pages/about.html:19-612` (CSS styles)

**Interfaces:**
- Consumes: `../css/design-system.css?v=37` tokens (`--bg-primary`, `--text-primary`, `--accent-cyan`, `--font-display`, `--font-body`, `--font-accent`)
- Produces: CSS class hierarchy for split hero, interactive material vault, spatial hotspot lens, visual timeline scrubber, and circular metric dials.

- [x] **Step 1: Define CSS rules for Split Visual Hero & Material Vault**
- [x] **Step 2: Define CSS rules for Spatial Hotspot Inspection Lens**
- [x] **Step 3: Define CSS rules for Visual Timeline Scrubber & Infographic Dials**
- [x] **Step 4: Verify responsive media queries across 1280px, 1024px, 768px, and 375px**

---

### Task 2: Structural HTML Redesign (7 Visual Modules)
**Files:**
- Modify: `pages/about.html:712-921` (Main content area)

**Interfaces:**
- Consumes: High-resolution imagery in `../assets/images/lifestyle/`
- Produces: 7 semantic HTML5 visual sections:
  1. `section.about-hero-split` (Split Visual Hero)
  2. `section.about-material-vault` (Interactive Tactile Material Vault)
  3. `section.about-hotspot-lens` (Spatial Craftsmanship Anatomy Hotspots)
  4. `section.about-disciplines-visual` (Visual Pillars with Material Badges)
  5. `section.about-timeline-visual` (Visual Milestone Chronology)
  6. `section.about-circular-ledger` (Infographic Provenance & Care Dials)
  7. `section.about-guardians-visual` (Artisan Atelier Studio Gallery)

- [x] **Step 1: Write Section 1 (Split Visual Hero) and Section 2 (Material Vault)**
- [x] **Step 2: Write Section 3 (Craftsmanship Hotspot Lens) and Section 4 (Visual Disciplines)**
- [x] **Step 3: Write Section 5 (Timeline), Section 6 (Ledger Dials), and Section 7 (Guardians Gallery)**

---

### Task 3: Interactive Visual Controllers & State Machine
**Files:**
- Modify: `pages/about.html:985-1080` (JavaScript controllers)

**Interfaces:**
- Consumes: DOM nodes for swatches, hotspot pins, and timeline milestones.
- Produces: Smooth interactive visual switching, hotspot popover toggling, and Lenis scroll synchronization.

- [x] **Step 1: Implement Material Vault Swatch Switcher**
- [x] **Step 2: Implement Spatial Hotspot Pin Controller**
- [x] **Step 3: Implement Visual Timeline Scrubber**
- [x] **Step 4: Verify preloader, Lucide icons, and GPU curtain transitions remain 100% operational**

---

### Task 4: Multi-Viewport Verification & Visual Audit
**Files:**
- Test: `pages/about.html` live in browser

**Interfaces:**
- Consumes: Localhost dev server at `http://localhost:3000/pages/about.html`
- Produces: Screenshot evidence and DOM verification report.

- [x] **Step 1: Launch/navigate browser subagent to `http://localhost:3000/pages/about.html`**
- [x] **Step 2: Capture screenshot at Desktop (1440×900) and verify 70/30 visual ratio**
- [x] **Step 3: Capture screenshot at Scaled Laptop (1280×600) and verify zero vertical clipping above the fold**
- [x] **Step 4: Capture screenshot at Mobile (375×812) and verify touch targets $\ge$44px and horizontal scroll smoothness**
- [x] **Step 5: Test interactive material swatches, hotspot pins, and timeline milestones**
