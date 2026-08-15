# Curated Departments (Shop by Category) Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the rigid, repetitive 4x2 grid of "Shop by Category" cards into a world-class luxury editorial department showcase (inspired by SSENSE, Loewe, and NET-A-PORTER) with dynamic visual rhythm, luminous lifestyle imagery, refined typography, and smooth micro-interactions.

**Architecture:** Replace the 8 identical cookie-cutter cards with a high-fashion **Curated Editorial Bento Showcase** featuring a primary tall anchor department ("Ready-to-Wear / Apparel") paired with balanced curated department tiles (Footwear, Acoustics, Horology, Leather Goods, Outerwear), eliminating harsh red badge clutter and heavy muddy gradient scrims in favor of crystal-clear lifestyle visuals, elegant typography, and fluid spring hover physics.

**Tech Stack:** Semantic HTML5, CSS3 (CSS Grid, Flexbox, glassmorphism, GPU-accelerated transforms, CSS custom properties), Vanilla JavaScript (`js/home.js`).

---

## Global Constraints

- **Luxury Lifestyle Design Standard:** In accordance with `.agents/rules/AGENTS.md`, avoid neon/crypto aesthetics, heavy saturated badge clutter, and repetitive card templates. Elevate typography with refined serifs and clean grotesque labels.
- **Luminous Imagery & Contrast:** Eliminate muddy black/cyan overlays. Use high-definition human lifestyle photography with subtle, elegant vignettes that preserve photographic luminosity while maintaining WCAG 2.1 AA text contrast.
- **Clean Information Hierarchy:** Replace loud uppercase red chips (`38 PIECES`) with subtle editorial index markers (`01 / APPAREL`) and understated item counts (`(38 items)`).
- **Responsive Fluidity:** Flawless reflow across mobile ($390\text{px}$ single-column or horizontal snap rail), tablet ($768\text{px}$ 2-column), and desktop ($1280\text{px}$–$1440\text{px}$+ asymmetric bento layout).
- **Step-by-Step Execution Rule:** Build and verify task-by-task with visual verification at each stage before proceeding.

---

## Visual Comparison & Architectural Design

### Before (Current Flaws)
- Rigid 4x2 grid of 8 identical portrait rectangles.
- Heavy dark gradient scrim that dims and muddies photography.
- Aggressive neon-red `"38 PIECES"` badges stacked on every card.
- Clashing cyan/pink gradient on the 8th "View All" card.
- Monotonous `"Explore Collection →"` repeated 8 times.

### After (Luxury Editorial Redesign)
- **Asymmetric Editorial Bento Layout:**
  - **Featured Anchor Department (Spanning full height / 2 rows):** *Ready-to-Wear & Silhouettes (Apparel)* with expansive editorial lifestyle visual, curated sub-department tags (*Cashmere · Knitwear · Tailoring*), and refined CTA.
  - **Curated Matrix (Balanced 4-Card Grid):**
    1. *Footwear & Movement* (`runner_lifestyle.png`)
    2. *Studio Acoustics & Sound* (`headphone_lifestyle.png`)
    3. *Timepieces & Horology* (`search_watch.png`)
    4. *Handcrafted Leather Goods* (`tote_lifestyle.png`)
    5. *Outerwear & Tailored Overcoats* (`plp_overcoat.png`)
- **Refined Department Badging:** Minimalist frosted glass pill tags with editorial numbering (`01 / APPAREL · 38 ITEMS`).
- **Luminous Photography & Polish:** Translucent crystal-clear scrims, smooth `1.045x` image scale on hover, and subtle border luminance shifts.

---

## Proposed Changes

### Component 1: Markup Structure (`index.html`)

#### [MODIFY] [index.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/index.html)
- Replace lines 202–323 (`.home-category-editorial-section`):
  - Refine header with elegant serif title, subtle letterspaced eyebrow, and clean luxury action button (`View Full Catalog →`).
  - Introduce `.cat-bento-grid` structure with `.cat-bento-hero` (featured department) and `.cat-bento-cards` (complementary grid).
  - Add curated sub-department navigation tags on the featured card.
  - Add accessible aria labels, clean image alt descriptions, and semantic department links.

---

### Component 2: CSS Architecture & Styles (`css/design-system.css`)

#### [MODIFY] [css/design-system.css](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css)
- Replace lines 6810–7015 with `.cat-bento-grid` luxury styling:
  - `.cat-bento-grid`: 12-column responsive CSS Grid or asymmetric flex bento layout.
  - `.cat-bento-card`: Smooth border radius (`16px`), subtle hairline border (`rgba(255, 255, 255, 0.08)`), deep luxury shadow, GPU-accelerated hover elevation (`transform: translateY(-4px)`).
  - `.cat-bento-hero`: Featured tall card spanning 5 columns with bespoke editorial copy and sub-tag pills.
  - `.cat-bento-subgrid`: 7-column 2x2 + horizontal flex matrix for the remaining curated departments.
  - Minimalist frosted badges (`.cat-tag-pill`), editorial serif headings, and micro-arrow hover physics.
  - Responsive breakpoints for 1200px, 992px, 768px, and 480px.

---

### Component 3: JavaScript & Micro-interactions (`js/home.js`)

#### [MODIFY] [js/home.js](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/js/home.js)
- Ensure category tile click routing and hover physics integrate smoothly with existing scroll reveals and analytics triggers.

---

## Tasks

### Task 1: Refactor Markup in `index.html`

**Files:**
- Modify: `index.html:202-323`

**Interfaces:**
- Consumes: Existing lifestyle imagery (`cat_apparel.png`, `runner_lifestyle.png`, `headphone_lifestyle.png`, `search_watch.png`, `tote_lifestyle.png`, `plp_overcoat.png`).
- Produces: Semantic `.cat-bento-grid` DOM elements with `.cat-bento-hero` and `.cat-bento-card` links to `category.html?cat=...`.

- [ ] **Step 1: Write updated HTML for the Curated Departments section**

```html
    <!-- CURATED DEPARTMENTS (EDITORIAL LUXURY BENTO) -->
    <section class="home-category-editorial-section reveal-on-scroll" aria-label="Curated Departments">
      <div class="container">
        <div class="cat-editorial-header">
          <div>
            <span class="cat-editorial-eyebrow">CURATED DEPARTMENTS</span>
            <h2 class="cat-editorial-heading">Shop by Department</h2>
            <p class="cat-editorial-sub">Architectural silhouettes, studio acoustics, precision horology, and crafted leather goods.</p>
          </div>
          <a href="category.html?cat=all" class="cat-editorial-all-link" aria-label="View all departments">
            <span>EXPLORE ALL COLLECTIONS</span>
            <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
          </a>
        </div>

        <div class="cat-bento-layout">
          <!-- Lead Featured Department (Hero Anchor) -->
          <a href="category.html?cat=apparel" class="cat-bento-card cat-bento-hero" data-cat="apparel" aria-label="Explore Ready-to-Wear and Apparel">
            <div class="cat-bento-img-wrap">
              <img src="cat_apparel.png" alt="Ready-to-Wear Apparel Department" loading="lazy" />
              <div class="cat-bento-vignette"></div>
            </div>
            <div class="cat-bento-content cat-bento-hero-content">
              <div class="cat-bento-badge-row">
                <span class="cat-bento-index-tag">01 / APPAREL</span>
                <span class="cat-bento-count-tag">38 PIECES</span>
              </div>
              <h3 class="cat-bento-title cat-bento-hero-title">Ready-to-Wear &amp; Silhouettes</h3>
              <p class="cat-bento-desc">Architectural cuts, heavy double-knit wools, and tailored daily essentials.</p>
              <div class="cat-bento-subtags">
                <span class="cat-subtag">Cashmere</span>
                <span class="cat-subtag">Tailoring</span>
                <span class="cat-subtag">Outerwear</span>
              </div>
              <span class="cat-bento-cta">
                <span>Explore Collection</span>
                <i data-lucide="arrow-up-right" style="width: 15px; height: 15px;"></i>
              </span>
            </div>
          </a>

          <!-- Curated Grid of Secondary Departments -->
          <div class="cat-bento-grid-side">
            <!-- 2. Footwear -->
            <a href="category.html?cat=footwear" class="cat-bento-card cat-bento-card-sm" data-cat="footwear" aria-label="Explore Footwear">
              <div class="cat-bento-img-wrap">
                <img src="runner_lifestyle.png" alt="Footwear and Technical Soles" loading="lazy" />
                <div class="cat-bento-vignette"></div>
              </div>
              <div class="cat-bento-content">
                <div class="cat-bento-badge-row">
                  <span class="cat-bento-index-tag">02 / FOOTWEAR</span>
                  <span class="cat-bento-count-tag">19 PIECES</span>
                </div>
                <h3 class="cat-bento-title">Technical &amp; Tailored Soles</h3>
                <span class="cat-bento-cta">
                  <span>Explore</span>
                  <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </span>
              </div>
            </a>

            <!-- 3. Acoustics -->
            <a href="category.html?cat=acoustics" class="cat-bento-card cat-bento-card-sm" data-cat="acoustics" aria-label="Explore Acoustics">
              <div class="cat-bento-img-wrap">
                <img src="headphone_lifestyle.png" alt="Acoustic Studio Sound" loading="lazy" />
                <div class="cat-bento-vignette"></div>
              </div>
              <div class="cat-bento-content">
                <div class="cat-bento-badge-row">
                  <span class="cat-bento-index-tag">03 / ACOUSTICS</span>
                  <span class="cat-bento-count-tag">14 PIECES</span>
                </div>
                <h3 class="cat-bento-title">Studio Acoustics &amp; Audio</h3>
                <span class="cat-bento-cta">
                  <span>Explore</span>
                  <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </span>
              </div>
            </a>

            <!-- 4. Timepieces -->
            <a href="category.html?cat=accessories" class="cat-bento-card cat-bento-card-sm" data-cat="timepieces" aria-label="Explore Timepieces">
              <div class="cat-bento-img-wrap">
                <img src="search_watch.png" alt="Precision Horology and Timepieces" loading="lazy" />
                <div class="cat-bento-vignette"></div>
              </div>
              <div class="cat-bento-content">
                <div class="cat-bento-badge-row">
                  <span class="cat-bento-index-tag">04 / TIMEPIECES</span>
                  <span class="cat-bento-count-tag">12 PIECES</span>
                </div>
                <h3 class="cat-bento-title">Precision Horology</h3>
                <span class="cat-bento-cta">
                  <span>Explore</span>
                  <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </span>
              </div>
            </a>

            <!-- 5. Leather Goods -->
            <a href="category.html?cat=accessories" class="cat-bento-card cat-bento-card-sm" data-cat="leather" aria-label="Explore Leather Goods">
              <div class="cat-bento-img-wrap">
                <img src="tote_lifestyle.png" alt="Handcrafted Leather Goods" loading="lazy" />
                <div class="cat-bento-vignette"></div>
              </div>
              <div class="cat-bento-content">
                <div class="cat-bento-badge-row">
                  <span class="cat-bento-index-tag">05 / LEATHER</span>
                  <span class="cat-bento-count-tag">21 PIECES</span>
                </div>
                <h3 class="cat-bento-title">Handcrafted Leather &amp; Carry</h3>
                <span class="cat-bento-cta">
                  <span>Explore</span>
                  <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify HTML syntax & Lucide icon bindings**

Run verification check to ensure Lucide icons (`arrow-right`, `arrow-up-right`) initialize cleanly.

---

### Task 2: Implement Luxury Bento CSS in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:6810-7015`

**Interfaces:**
- Consumes: Global CSS variables (`--font-serif`, `--font-body`, `--radius-md`, `--radius-lg`, `--text-primary`, `--text-secondary`).
- Produces: Polished responsive Bento grid styling with fluid typography, luminous vignettes, and physics-driven spring hover states.

- [ ] **Step 1: Replace legacy category CSS with modern luxury styles**

```css
/* ==========================================================================
   CURATED DEPARTMENTS (EDITORIAL LUXURY BENTO SHOWCASE)
   ========================================================================== */

.home-category-editorial-section {
  padding: clamp(60px, 8vw, 100px) 0;
  background: var(--bg-surface-elevated, #070d18);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
  scroll-margin-top: 80px;
}

.cat-editorial-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: clamp(28px, 4vw, 44px);
  flex-wrap: wrap;
}

.cat-editorial-eyebrow {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-rose, #F43F5E);
  display: block;
  margin-bottom: 8px;
}

.cat-editorial-heading {
  font-family: var(--font-serif);
  font-size: clamp(26px, 3vw, 40px);
  font-weight: 400;
  color: #FFFFFF;
  letter-spacing: -0.015em;
  margin: 0;
  line-height: 1.15;
}

.cat-editorial-sub {
  font-size: clamp(13.5px, 1vw, 15px);
  color: rgba(255, 255, 255, 0.65);
  margin-top: 8px;
  max-width: 540px;
  line-height: 1.5;
}

.cat-editorial-all-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  padding: 10px 16px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(8px);
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;
}

.cat-editorial-all-link:hover {
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.28);
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

/* Bento Grid Layout */
.cat-bento-layout {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: clamp(16px, 2vw, 24px);
  align-items: stretch;
}

.cat-bento-grid-side {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(16px, 2vw, 24px);
}

/* Base Bento Card */
.cat-bento-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  text-decoration: none;
  background: #0B1426;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  box-sizing: border-box;
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1),
              border-color 300ms ease,
              box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.cat-bento-card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.6), 0 0 20px rgba(244, 63, 94, 0.12);
}

/* Hero / Featured Card */
.cat-bento-hero {
  min-height: 520px;
}

.cat-bento-card-sm {
  aspect-ratio: 4 / 3.4;
  min-height: 245px;
}

/* Image Wrapping & Luminosity */
.cat-bento-img-wrap {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.cat-bento-img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 800ms cubic-bezier(0.16, 1, 0.3, 1);
}

.cat-bento-card:hover .cat-bento-img-wrap img {
  transform: scale(1.045);
}

/* Crystal Vignette */
.cat-bento-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, 
    rgba(5, 11, 20, 0.94) 0%, 
    rgba(5, 11, 20, 0.45) 45%, 
    rgba(5, 11, 20, 0.08) 80%, 
    transparent 100%
  );
  pointer-events: none;
  transition: opacity 300ms ease;
}

.cat-bento-card:hover .cat-bento-vignette {
  opacity: 0.95;
}

/* Content Anchoring */
.cat-bento-content {
  position: relative;
  z-index: 2;
  padding: clamp(16px, 2vw, 24px);
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;
}

.cat-bento-hero-content {
  padding: clamp(24px, 3vw, 36px);
  gap: 10px;
}

/* Badge Row */
.cat-bento-badge-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 2px;
}

.cat-bento-index-tag {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-rose, #F43F5E);
  line-height: 1;
}

.cat-bento-count-tag {
  font-family: var(--font-body);
  font-size: 9.5px;
  font-weight: 500;
  letter-spacing: 0.08em;
  color: rgba(255, 255, 255, 0.55);
  background: rgba(255, 255, 255, 0.06);
  padding: 3px 7px;
  border-radius: 4px;
  line-height: 1;
}

/* Titles */
.cat-bento-title {
  font-family: var(--font-body);
  font-size: clamp(16px, 1.3vw, 19px);
  font-weight: 700;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.25;
}

.cat-bento-hero-title {
  font-family: var(--font-serif);
  font-size: clamp(24px, 2.4vw, 32px);
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.2;
}

.cat-bento-desc {
  font-size: 13.5px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  line-height: 1.45;
  max-width: 420px;
}

/* Sub-Department Tags */
.cat-bento-subtags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}

.cat-subtag {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 3px 10px;
  border-radius: 100px;
  backdrop-filter: blur(4px);
}

/* Action CTA */
.cat-bento-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 11.5px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 6px;
  transition: color 250ms ease, transform 250ms cubic-bezier(0.16, 1, 0.3, 1);
}

.cat-bento-card:hover .cat-bento-cta {
  color: #FFFFFF;
  transform: translateX(4px);
}

/* Responsive Reflows */
@media (max-width: 1024px) {
  .cat-bento-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .cat-bento-hero {
    min-height: 380px;
  }
}

@media (max-width: 640px) {
  .cat-bento-grid-side {
    grid-template-columns: 1fr;
    gap: 16px;
  }
  .cat-bento-card-sm {
    aspect-ratio: 16 / 10;
    min-height: 200px;
  }
  .cat-editorial-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .cat-editorial-all-link {
    width: 100%;
    justify-content: center;
  }
}
```

- [ ] **Step 2: Validate CSS syntax & layout rendering**

Verify responsive rendering on desktop (1440px), laptop (1080px), tablet (768px), and mobile (390px).

---

### Task 3: Interactive Verification & Visual Audit

**Files:**
- Test/Audit: Browser verification on `index.html`

- [ ] **Step 1: Capture desktop & mobile screenshots of the redesigned section**
- [ ] **Step 2: Verify hover states, micro-interactions, link routing to `category.html?cat=...`, and Lucide icon rendering**

---

## Verification Plan

### Automated / Browser Verification
- Open `index.html` in browser at 1440px, 1024px, 768px, and 390px viewports.
- Capture screenshots of `.home-category-editorial-section` to confirm luxury aesthetics, generous white space, and crystal-clear photography.
- Verify that clicking each card navigates correctly to the corresponding filtered category in `category.html`.

### Manual Verification
- Review against the **MANDATORY: Luxury Lifestyle E-Commerce Design Standard** checklist:
  1. Does it look at home on SSENSE / Loewe / NET-A-PORTER?
  2. Is there generous white space and luminous photography?
  3. Are neon/saturated badges completely eliminated?
