# Category / PLP Page Premium Upgrade — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate `pages/category.html` and `js/plp.js` from functional-but-generic into a world-class Modernist luxury editorial PLP benchmarked against NET-A-PORTER, SSENSE, and Farfetch.

**Architecture:** CSS upgrades go in `css/design-system.css` (scoped `.plp-*` / `.spotlight-*` namespaces). JS changes are surgical edits in `js/plp.js`. HTML changes are minimal in `pages/category.html`.

**Tech Stack:** Vanilla HTML · CSS · JavaScript · Lucide Icons (CDN) · existing `design-system.css` · `plp.js`

## Global Constraints

- Typography: `Manrope` / `Inter` (UI, body, price). `Instrument Serif` for editorial accent only — NOT for H1 heading.
- Base: `#010C1E` obsidian background — no white/grey page canvas.
- Standards: `.agents/rules/modernist-design-system-standards.md` Section 50 throughout.
- Product card metadata: strict 3 items (Brand·Category | Title | Price+Swatches). No descriptions.
- 8px grid: all spacing in multiples of 4 or 8px.
- No neon gradients. No stacked colour badges. No inline event handlers.
- Verify: Chrome desktop 1440×900 · tablet 768×1024 · mobile 375×812.

---

## Current State Audit (What's Wrong)

| Area | Problem |
|---|---|
| H1 Heading | Instrument Serif italic — editorial accent font incorrectly applied to entire heading |
| Spotlight | Neon cyan→pink gradient progress bar. No rounded glass framing per Section 50 |
| Filter pills | Generic border-radius pill shape. Neon pink "NEW IN" badge conflicts with luxury brand |
| Product cards | `rgba(255,255,255,0.03)` border almost invisible. QUICK ADD button always-visible instead of slide-up |
| Sort toolbar | Browser-native `<select>` with no custom styling |
| Mobile | Spotlight story pane collapses below image awkwardly. Filter pills clip horizontally |

---

## Task 1: Editorial Category Hero Masthead

**Files:**
- Modify: `pages/category.html` (lines 193–197 — hero header block)
- Modify: `css/design-system.css` (append after existing `.plp-hero-header` block)
- Modify: `js/plp.js` (`updateCategoryHeader()` function, ~line 406)

**Interfaces:**
- Produces: `.plp-hero-eyebrow` element written to `#plpHeroEyebrow`. Dynamic eyebrow text injected by `updateCategoryHeader(cat)`.

- [ ] **Step 1: Add eyebrow element in `pages/category.html`**

Replace lines 193–197:
```html
    <!-- Main Category Heading -->
    <div class="plp-hero-header">
      <h1 class="plp-title" id="plpMainTitle">All Products</h1>
      <p class="plp-subtitle" id="plpMainSubtitle">Pieces designed around natural comfort, architectural tailoring, and enduring quality.</p>
    </div>
```
With:
```html
    <!-- Editorial Category Masthead -->
    <div class="plp-hero-header">
      <span class="plp-hero-eyebrow" id="plpHeroEyebrow">COLLECTIONS · AW26</span>
      <h1 class="plp-title" id="plpMainTitle">All Products</h1>
      <p class="plp-subtitle" id="plpMainSubtitle">Pieces designed around natural comfort, architectural tailoring, and enduring quality.</p>
    </div>
```

- [ ] **Step 2: Add CSS to `css/design-system.css`**

```css
/* ─── PLP Hero Masthead Typography Overrides ────────────────────────────── */
.plp-hero-eyebrow {
  display: block;
  font-family: 'Inter', sans-serif;
  font-size: 10px; font-weight: 600;
  letter-spacing: 0.18em; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.40);
  margin-bottom: 10px;
}

.plp-hero-header .plp-title {
  font-family: 'Manrope', 'Plus Jakarta Sans', sans-serif;
  font-size: clamp(32px, 4vw, 52px); font-weight: 700;
  letter-spacing: -0.025em; line-height: 1.08;
  color: #FFFFFF; margin: 0 0 10px;
}

.plp-hero-header .plp-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 14px; font-weight: 400;
  color: rgba(255, 255, 255, 0.50);
  max-width: 520px; line-height: 1.65; margin: 0;
}

@media (max-width: 600px) {
  .plp-hero-header .plp-title { font-size: 28px; }
  .plp-hero-header .plp-subtitle { font-size: 13px; }
}
```

- [ ] **Step 3: Update `updateCategoryHeader()` in `js/plp.js`**

At the top of `updateCategoryHeader(cat)` function body, add:
```javascript
const eyebrowEl = document.getElementById('plpHeroEyebrow');
const eyebrowMap = {
  all: 'COLLECTIONS · AW26',
  apparel: 'APPAREL · AW26',
  outerwear: 'OUTERWEAR · AW26',
  acoustics: 'ACOUSTIC ENGINEERING',
  accessories: 'FINE ACCESSORIES',
  footwear: 'FOOTWEAR · ARTISANAL',
  new: 'NEW ARRIVALS · AW26'
};
if (eyebrowEl) eyebrowEl.textContent = eyebrowMap[cat] || 'COLLECTIONS · AW26';
```

- [ ] **Step 4: Verify in browser (desktop 1440px)**

Confirm: H1 is Manrope bold (no italic serif). Eyebrow label is muted uppercase. Switching filters dynamically updates eyebrow + heading.

- [ ] **Step 5: Commit**
```bash
git add pages/category.html css/design-system.css js/plp.js
git commit -m "feat(plp): editorial masthead — Manrope H1 + dynamic eyebrow tag"
```

---

## Task 2: Curated Capsule Spotlight Redesign

**Files:**
- Modify: `css/design-system.css` (`.plp-curation-spotlight`, `.spotlight-progress-*`, `.spotlight-tab-btn`, `.spotlight-img-frame`)

**Goal:** Section 50 glass framing, monochrome progress bar, clean architectural tabs, fixed mobile stacking.

**Interfaces:**
- No HTML or JS changes. `setCuratedLook()` in `plp.js` writes to same DOM IDs — untouched.

- [ ] **Step 1: Apply Section 50 glass framing to spotlight card**

Find existing `.plp-curation-spotlight { ... }` in `design-system.css` and update:
```css
.plp-curation-spotlight {
  position: relative;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.10);
  background: rgba(8, 14, 30, 0.80);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.10);
  overflow: hidden;
  margin-bottom: 40px;
}
@media (max-width: 900px) { .plp-curation-spotlight { border-radius: 16px; } }
@media (max-width: 600px) { .plp-curation-spotlight { border-radius: 14px; } }
```

- [ ] **Step 2: Replace neon gradient progress bar with monochrome**

Update `.spotlight-progress-track` and `.spotlight-progress-bar`:
```css
.spotlight-progress-track {
  position: absolute; top: 0; left: 0; right: 0;
  height: 2px; background: rgba(255, 255, 255, 0.08);
  z-index: 10; overflow: hidden;
}
.spotlight-progress-bar {
  height: 100%; width: 100%;
  background: rgba(255, 255, 255, 0.55);
  transform: scaleX(0); transform-origin: left center;
  will-change: transform;
}
```

- [ ] **Step 3: Architectural tab pills**

Update `.spotlight-tab-btn`:
```css
.spotlight-tab-btn {
  padding: 6px 16px;
  border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 2px;
  background: transparent; color: rgba(255, 255, 255, 0.45);
  font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; white-space: nowrap;
  transition: all 180ms ease;
}
.spotlight-tab-btn.active, .spotlight-tab-btn:hover {
  border-color: rgba(255, 255, 255, 0.55);
  color: #FFFFFF; background: rgba(255, 255, 255, 0.06);
}
```

- [ ] **Step 4: Section 50 glass on image frame**

Update `.spotlight-img-frame`:
```css
.spotlight-img-frame {
  position: relative; border-radius: 14px;
  overflow: hidden; border: 1px solid rgba(255, 255, 255, 0.09);
}
```

- [ ] **Step 5: Fix mobile stacking (image on top, copy below)**

```css
@media (max-width: 600px) {
  .spotlight-body-layout { flex-direction: column-reverse; gap: 20px; }
  .spotlight-visual-pane { width: 100%; }
  .spotlight-story-pane { padding: 0 4px; }
}
```

- [ ] **Step 6: Verify in browser — desktop + mobile**

Desktop 1440px: Glass card, 20px radius, 2px white progress bar, rectangular tab pills.
Mobile 375px: Image renders top, editorial copy below, no overflow.

- [ ] **Step 7: Commit**
```bash
git add css/design-system.css
git commit -m "feat(plp): Section 50 glass spotlight, monochrome bar, architectural tabs, mobile fix"
```

---

## Task 3: Product Card Refinement

**Files:**
- Modify: `css/design-system.css` (`.plp-card`, `.plp-card-media`, `.plp-card-img`, `.plp-quick-add-btn`, `.plp-card-info`, `.plp-card-name`, `.plp-card-price-tag`, `.plp-empty-state`)
- Modify: `js/plp.js` (`renderEmptyState()` function, ~line 694)

**Goal:** Sharper card borders, 3:4 image aspect ratio, slide-up Quick Add animation, clean styled empty state.

**Interfaces:**
- No HTML changes in `category.html`. `renderPLPCard()` in `plp.js` is unchanged.
- `renderEmptyState()` updated to emit `.plp-empty-state` class instead of inline styles.

- [ ] **Step 1: Sharpen `.plp-card` container**

```css
.plp-card {
  position: relative;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 6px; overflow: hidden;
  transition: border-color 220ms ease, box-shadow 220ms ease;
}
.plp-card:hover {
  border-color: rgba(255, 255, 255, 0.20);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
}
```

- [ ] **Step 2: 3:4 image frame + slide-up Quick Add**

```css
.plp-card-media {
  position: relative; aspect-ratio: 3 / 4; overflow: hidden;
  background: rgba(255, 255, 255, 0.03);
}
.plp-card-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center top;
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
}
.plp-card:hover .plp-card-img { transform: scale(1.04); }

.plp-quick-add-btn {
  position: absolute; bottom: 0; left: 0; right: 0;
  transform: translateY(100%);
  transition: transform 240ms cubic-bezier(0.16, 1, 0.3, 1);
  background: rgba(8, 14, 30, 0.95);
  border: none; border-top: 1px solid rgba(255, 255, 255, 0.12);
  color: #FFFFFF; font-family: 'Inter', sans-serif;
  font-size: 10px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase;
  padding: 12px 0; cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 6px; width: 100%;
}
.plp-card:hover .plp-quick-add-btn { transform: translateY(0); }
```

- [ ] **Step 3: Refine card info typography**

```css
.plp-card-info { padding: 12px 14px 14px; }
.plp-card-category-label {
  font-family: 'Inter', sans-serif; font-size: 9px; font-weight: 600;
  letter-spacing: 0.14em; text-transform: uppercase;
  color: rgba(255, 255, 255, 0.36); margin-bottom: 4px; display: block;
}
.plp-card-name {
  font-family: 'Manrope', sans-serif; font-size: 13px; font-weight: 600;
  color: #FFFFFF; letter-spacing: -0.01em; line-height: 1.3; margin: 0 0 8px;
}
.plp-card-price-tag {
  font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 500;
  color: rgba(255, 255, 255, 0.80); font-variant-numeric: tabular-nums;
}
```

- [ ] **Step 4: Update `renderEmptyState()` in `js/plp.js`**

```javascript
function renderEmptyState(container) {
  container.innerHTML = `
    <div class="plp-empty-state">
      <h3 class="plp-empty-title">No Pieces Found</h3>
      <p class="plp-empty-desc">We couldn't find pieces matching this filter. Explore our full catalog.</p>
      <button class="btn-primary-commerce" id="btnResetFilters">View All Pieces</button>
    </div>
  `;
  const resetBtn = document.getElementById('btnResetFilters');
  if (resetBtn) resetBtn.addEventListener('click', () => applyCategoryFilter('all'));
}
```

Add to `design-system.css`:
```css
.plp-empty-state {
  grid-column: 1 / -1; padding: 72px 20px; text-align: center;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07); border-radius: 8px;
}
.plp-empty-title {
  font-family: 'Manrope', sans-serif; font-size: 22px; font-weight: 700;
  color: #FFFFFF; margin: 0 0 8px;
}
.plp-empty-desc { font-size: 14px; color: rgba(255, 255, 255, 0.46); margin: 0 0 24px; }
```

- [ ] **Step 5: Verify in browser**

Confirm: hover triggers image scale + Quick Add slide-up simultaneously. Card borders are crisp 1px hairline. Empty state is clean (no inline styles).

- [ ] **Step 6: Commit**
```bash
git add css/design-system.css js/plp.js
git commit -m "feat(plp): 3:4 cards, slide-up Quick Add, sharp hairline borders, styled empty state"
```

---

## Task 4: Filter Bar & Sort Toolbar Upgrade

**Files:**
- Modify: `css/design-system.css` (`.plp-filter-pill`, `.plp-filter-bar`, `.plp-toolbar-row`, `.plp-sort-*`)

**Goal:** Architectural `2px` radius pills, horizontal scroll on mobile, custom sort `<select>`, toolbar hairline divider.

**Interfaces:**
- CSS-only. No JS or HTML changes.

- [ ] **Step 1: Architectural filter pills**

```css
.plp-filter-pill {
  display: inline-flex; align-items: center;
  padding: 6px 14px; border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 2px; background: transparent;
  color: rgba(255, 255, 255, 0.46);
  font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
  letter-spacing: 0.12em; text-transform: uppercase;
  cursor: pointer; white-space: nowrap; flex-shrink: 0;
  transition: all 180ms ease;
}
.plp-filter-pill:hover { border-color: rgba(255,255,255,0.40); color: #FFFFFF; }
.plp-filter-pill.active { border-color: #FFFFFF; color: #FFFFFF; background: rgba(255,255,255,0.06); }
/* Remove neon pink — clean neutral for NEW IN */
.plp-filter-pill--new { border-color: rgba(255,255,255,0.14); color: rgba(255,255,255,0.46); }
.plp-filter-pill--new.active { border-color: #FFFFFF; color: #FFFFFF; }
```

- [ ] **Step 2: Horizontal scroll on mobile**

```css
.plp-filter-bar {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 24px;
  overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none; -ms-overflow-style: none;
  padding-bottom: 2px;
}
.plp-filter-bar::-webkit-scrollbar { display: none; }
```

- [ ] **Step 3: Styled sort toolbar with hairline divider**

```css
.plp-toolbar-row {
  display: flex; align-items: center; justify-content: space-between;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  margin-bottom: 20px;
}
.plp-product-count {
  font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
  letter-spacing: 0.14em; color: rgba(255,255,255,0.36); text-transform: uppercase;
}
.plp-sort-wrapper { display: flex; align-items: center; gap: 8px; }
.plp-sort-label {
  font-family: 'Inter', sans-serif; font-size: 10px; font-weight: 600;
  letter-spacing: 0.12em; color: rgba(255,255,255,0.30); text-transform: uppercase;
}
.plp-sort-select {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.14);
  border-radius: 2px; color: rgba(255,255,255,0.72);
  font-family: 'Inter', sans-serif; font-size: 11px; font-weight: 500;
  padding: 6px 10px; cursor: pointer; appearance: none; -webkit-appearance: none;
  outline: none; transition: border-color 180ms ease;
}
.plp-sort-select:hover, .plp-sort-select:focus { border-color: rgba(255,255,255,0.35); }
```

- [ ] **Step 4: Verify in browser**

Desktop: Pills are 2px border-radius architectural rectangles, no neon pink. Toolbar has subtle hairline and styled `<select>`.
Mobile: Pills scroll horizontally with no visible scrollbar.

- [ ] **Step 5: Commit**
```bash
git add css/design-system.css
git commit -m "feat(plp): architectural filter pills, mobile scroll, styled sort toolbar"
```

---

## Task 5: Full Responsive Grid Polish

**Files:**
- Modify: `css/design-system.css` (responsive `.plp-grid-4col` breakpoints)

**Goal:** Perfect 4-col → 3-col → 2-col grid reflow at 1440/1024/768/375px.

**Interfaces:**
- CSS-only. No other changes.

- [ ] **Step 1: Grid responsive breakpoints**

```css
@media (max-width: 1200px) {
  .plp-grid-4col { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 900px) {
  .plp-grid-4col { grid-template-columns: repeat(2, 1fr); gap: 14px; }
}
@media (max-width: 600px) {
  .plp-grid-4col { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .plp-card-name { font-size: 12px; }
  .plp-card-price-tag { font-size: 12px; }
  .plp-swatch-dot { width: 12px; height: 12px; }
}
```

- [ ] **Step 2: Three-breakpoint visual audit in browser**

Check:
- 375×812 → 2-col grid, pills scroll, heading 28px, spotlight stacks.
- 768×1024 → 2-col grid, spotlight clean.
- 1440×900 → 4-col grid, spotlight split-layout, single-row toolbar.

- [ ] **Step 3: Commit**
```bash
git add css/design-system.css
git commit -m "feat(plp): responsive 2/3/4-col grid breakpoints, mobile card type scale"
```
