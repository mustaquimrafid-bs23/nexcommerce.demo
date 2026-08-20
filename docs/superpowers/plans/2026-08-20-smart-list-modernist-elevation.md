# Smart List Page — Modernist Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate `pages/smart-list.html` and `js/smart-reorder.js` to the Modernist / Swiss-inspired design system standard while preserving the nexCommerce brand signature — Electric Cyan `#3DE0FF`, Sky `#38BDF8`, Rose `#FB7185`, and obsidian canvas — as codified in Section 3 and Section 51.

**Architecture:** Standalone HTML with scoped `<style>` in `<head>`, HTML layout in `<body>`, page logic split between `js/smart-reorder.js` (product catalog, spotlight controller, card builder, filter engine) and an inline `<script>` (capsule profile engine, tilt physics). Global tokens from `css/design-system.css`.

**Tech Stack:** Vanilla HTML5, CSS3 (scoped `<style>` in `smart-list.html`), Vanilla JS ES5-compat inline + ES6 in `smart-reorder.js`, Lucide icons CDN, Lenis smooth scroll.

---

## Global Constraints

- Brand: Obsidian canvas `#010C1E` / `#080E1E`; signature gradient `linear-gradient(90deg, #3DE0FF 0%, #38BDF8 50%, #FB7185 100%)`; Electric Cyan `#3DE0FF`; Rose `#FB7185`.
- Typography: `Manrope` for H1/display (tight tracking `−0.02em`); `Inter` for UI/body; `Instrument Serif` italic ONLY for hero accent word.
- Grid: 12-column, max-width `1240px`, horizontal padding `40px` desktop / `20px` mobile.
- Filter pills and spotlight tabs: `border-radius: 2px` (architectural — NO large oval pills for tabs).
- Product cards: 3:4 aspect ratio (`aspect-ratio: 3/4`), hairline border `rgba(255,255,255,0.09)`, `border-radius: 6px`.
- Spotlight progress bar: Signature AI gradient — never monochrome.
- No multi-line paragraph text on product cards. Strict: reason chip + brand + title + price + stepper.
- No inline `onclick`/`onchange` handlers. Centralized event delegation only.
- Git commit at end of every task.

---

## File Map

| File | Role | Tasks |
|------|------|-------|
| `pages/smart-list.html` | HTML structure, scoped CSS, inline capsule engine | T1, T2, T3, T4, T5 |
| `js/smart-reorder.js` | Product catalog, `buildCardHTML()`, filter, spotlight | T3, T4 |
| `css/design-system.css` | Global tokens reference only | None |

---

## Task 1: Modernist Masthead & Prompt Omnibar Elevation

**Files:**
- Modify: `pages/smart-list.html` (lines ~1070–1293: `.sl-hero-cinema` CSS; lines ~1389–1457: hero HTML)

**Interfaces:**
- Produces: `#slHero` section with Modernist-compliant masthead, architectural preset pills (`border-radius: 2px`), tight Manrope H1, Tonal Harmony bar with crisper geometry.

- [ ] **Step 1: Identify masthead CSS issues**

  Open `pages/smart-list.html`. Check the `<style>` block for these classes. Issues:
  1. `.sl-headline` desktop cap `62px` — change to `64px`.
  2. `.sl-subhead` — add `font-weight: 400;`.
  3. `.preset-pill-btn` has `border-radius: 20px` — change to `border-radius: 2px` and text `uppercase 10.5px`.
  4. `.sl-harmony-canvas` has `border-radius: 12px` — change to `4px`.

- [ ] **Step 2: Update masthead CSS in `pages/smart-list.html`**

  In the `<style>` block, locate and replace these rules:

  ```css
  .sl-headline {
    font-family: 'Manrope', sans-serif;
    font-size: clamp(38px, 5vw, 64px);
    font-weight: 700;
    color: #FFFFFF;
    line-height: 1.04;
    letter-spacing: -0.02em;
    margin: 0 0 12px;
  }
  .sl-subhead {
    font-family: 'Inter', sans-serif;
    font-size: 14.5px;
    color: rgba(255, 255, 255, 0.55);
    max-width: 520px;
    margin: 0 0 28px;
    line-height: 1.65;
    font-weight: 400;
  }
  .preset-pill-btn {
    height: 36px;
    padding: 0 16px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    color: rgba(255, 255, 255, 0.65);
    font-family: 'Inter', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
    min-height: 44px;
  }
  .preset-pill-btn:hover {
    border-color: rgba(61, 224, 255, 0.3);
    color: #FFFFFF;
    background: rgba(61, 224, 255, 0.05);
  }
  .preset-pill-btn.active {
    background: rgba(61, 224, 255, 0.10);
    border-color: rgba(61, 224, 255, 0.40);
    color: #3DE0FF;
  }
  .sl-harmony-canvas {
    background: rgba(8, 14, 30, 0.60);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 4px;
    padding: 14px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 4px;
  }
  ```

- [ ] **Step 3: Browser screenshot — verify masthead**

  Navigate to `file:///C:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/pages/smart-list.html`. Screenshot. Confirm preset pills are rectangular, headline is tighter, harmony canvas has 4px radius.

- [ ] **Step 4: Commit**

  ```bash
  git add pages/smart-list.html
  git commit -m "style(smart-list): T1 — Modernist masthead, 2px preset pills, Tonal Harmony bar geometry"
  ```

---

## Task 2: Curated Look Spotlight — Section 50 Modernist Compliance

**Files:**
- Modify: `pages/smart-list.html` (lines ~74–396: spotlight CSS; lines ~1459–1533: spotlight HTML)

**Interfaces:**
- Consumes: `CURATED_REPLENISHMENT_LOOKS` data from `smart-reorder.js` (lines 238–303).
- Produces: 20px glass frame container, 2px architectural tab buttons, 16:9 image frame, Manrope capsule title, mobile `column-reverse` stacking at ≤600px.

- [ ] **Step 1: Identify spotlight CSS issues**

  Issues:
  1. `.spotlight-tab-btn` has `border-radius: var(--radius-pill, 9999px)` → must be `2px`.
  2. `.sl-curation-spotlight` has `border-radius: var(--radius-lg, 16px)` → upgrade to `20px`.
  3. `.spotlight-body-layout` has `align-items: center` → change to `align-items: start`.
  4. `.spotlight-capsule-title` uses `Cormorant Garamond` → change to `Manrope 600`.
  5. `.spotlight-img-frame` has fixed `height: 220px` → change to `aspect-ratio: 16/9; height: auto;`.
  6. Mobile ≤600px: `spotlight-body-layout` must be `flex; flex-direction: column-reverse; gap: 16px;`.

- [ ] **Step 2: Update spotlight CSS in `pages/smart-list.html`**

  ```css
  .spotlight-tab-btn {
    min-height: 36px;
    display: inline-flex;
    align-items: center;
    padding: 5px 13px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 2px;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    transition: all 180ms cubic-bezier(0.23, 1, 0.32, 1);
  }
  .spotlight-tab-btn:hover {
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.20);
    background: rgba(255, 255, 255, 0.06);
  }
  .spotlight-tab-btn.active {
    background: #FFFFFF;
    border-color: #FFFFFF;
    color: #030814;
    box-shadow: 0 2px 10px rgba(255, 255, 255, 0.18);
  }
  .sl-curation-spotlight {
    background: rgba(8, 14, 30, 0.94);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 20px;
    padding: 24px 28px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 20px 50px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.10);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    transition: border-color 220ms ease;
  }
  .spotlight-body-layout {
    display: grid;
    grid-template-columns: 1.1fr 1fr;
    gap: 28px;
    align-items: start;
  }
  .spotlight-capsule-title {
    font-family: 'Manrope', sans-serif;
    font-size: clamp(20px, 2vw, 28px);
    font-weight: 600;
    line-height: 1.15;
    color: #FFFFFF;
    margin: 0;
    letter-spacing: -0.01em;
    transition: opacity 220ms ease;
  }
  .spotlight-img-frame {
    position: relative;
    width: 100%;
    aspect-ratio: 16 / 9;
    height: auto;
    border-radius: 10px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.06);
  }
  @media (max-width: 600px) {
    .spotlight-body-layout {
      display: flex;
      flex-direction: column-reverse;
      gap: 16px;
    }
  }
  @media (max-width: 768px) {
    .sl-curation-spotlight { border-radius: 16px; padding: 18px 20px; }
  }
  @media (max-width: 480px) {
    .sl-curation-spotlight { border-radius: 14px; }
  }
  ```

- [ ] **Step 3: Browser screenshot — verify spotlight**

  Take screenshot. Confirm: 20px rounded glass frame, rectangular 2px tabs, 16:9 image frame.

- [ ] **Step 4: Commit**

  ```bash
  git add pages/smart-list.html
  git commit -m "style(smart-list): T2 — Section 50 spotlight compliance, 2px tabs, 16:9 image, column-reverse mobile"
  ```

---

## Task 3: Modernist Product Cards — 3:4 Aspect Ratio, Hairline Borders, Slide-Up Quick Add

**Files:**
- Modify: `pages/smart-list.html` (lines ~543–798: `.sl-card` CSS)
- Modify: `js/smart-reorder.js` (`buildCardHTML()` function)

**Interfaces:**
- Consumes: `SL_PRODUCTS[]`, `getQty(id)`, `resolveImgPath()`, `attachRipple()` from `smart-reorder.js`.
- Produces: 3:4 portrait luxury cards, hairline `rgba(255,255,255,0.09)` borders, `border-radius: 6px`, slide-up Quick Add overlay, strict 3-item card footer.

- [ ] **Step 1: Update `.sl-card` CSS in `pages/smart-list.html`**

  ```css
  .sl-card {
    position: relative;
    background: rgba(8, 14, 30, 0.70);
    border: 1px solid rgba(255, 255, 255, 0.09);
    border-radius: 6px;
    overflow: visible;
    cursor: default;
    transform-style: preserve-3d;
    transition: border-color 220ms ease, box-shadow 300ms cubic-bezier(0.23, 1, 0.32, 1);
    will-change: transform;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
  }
  .sl-card:hover {
    border-color: rgba(255, 255, 255, 0.22);
    box-shadow: 0 20px 48px -10px rgba(0, 0, 0, 0.65);
  }
  .sl-card-img-wrap {
    position: relative;
    width: 100%;
    aspect-ratio: 3 / 4;
    overflow: hidden;
    border-radius: 6px 6px 0 0;
    background: rgba(255, 255, 255, 0.02);
  }
  .sl-card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 25%;
    display: block;
    transition: transform 500ms cubic-bezier(0.23, 1, 0.32, 1);
    will-change: transform;
  }
  .sl-card:hover .sl-card-img { transform: scale(1.04); }

  /* Slide-up Quick Add overlay */
  .sl-quick-add-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 10px 10px;
    transform: translateY(12px);
    opacity: 0;
    transition: transform 220ms cubic-bezier(0.23, 1, 0.32, 1), opacity 180ms ease;
    z-index: 5;
  }
  .sl-card:hover .sl-quick-add-overlay {
    transform: translateY(0);
    opacity: 1;
  }
  @media (hover: none) {
    .sl-quick-add-overlay { transform: translateY(0); opacity: 1; }
  }
  .sl-btn-quick-add-slide {
    width: 100%;
    height: 36px;
    background: rgba(8, 14, 30, 0.95);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 2px;
    color: #FFFFFF;
    font-family: 'Inter', sans-serif;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background 150ms ease, border-color 150ms ease, color 150ms ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    position: relative;
    overflow: hidden;
  }
  .sl-btn-quick-add-slide:hover {
    background: rgba(61, 224, 255, 0.12);
    border-color: rgba(61, 224, 255, 0.35);
    color: #3DE0FF;
  }
  ```

- [ ] **Step 2: Locate `buildCardHTML` in `js/smart-reorder.js`**

  Search for `function buildCardHTML` or `buildCardHTML =`. Read the full function body to understand current HTML template structure. Note all class names used in card (`.sl-card-img-wrap`, `.sl-card-body`, etc.).

- [ ] **Step 3: Update `buildCardHTML()` card template**

  Inside the `buildCardHTML` function, update the returned HTML string:
  1. Change `aspect-ratio: 1 / 1.1` on `.sl-card-img-wrap` — handled via CSS update in Step 1, ensure no inline style overrides it.
  2. Add `.sl-quick-add-overlay` div inside `.sl-card-img-wrap` (before closing `</div>`):
  ```javascript
  // Inside buildCardHTML, within the .sl-card-img-wrap block, add:
  const quickAddOverlayHTML = p.inStock
    ? `<div class="sl-quick-add-overlay">
        <button class="sl-btn-quick-add-slide" data-action="quick-add" data-id="${p.id}" aria-label="Add ${p.name} to bag">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          ADD TO BAG
        </button>
      </div>`
    : '';
  ```
  3. Remove any multi-line description `<p>` inside `.sl-card-body`.
  4. Ensure reason chip uses `white-space: nowrap; overflow: hidden; text-overflow: ellipsis;` so it never wraps to 2 lines.

- [ ] **Step 4: Wire `quick-add` action in event delegation in `smart-reorder.js`**

  Find the click delegation on `#slGrid`. Add handler branch:
  ```javascript
  if (action === 'quick-add') {
    const product = SL_PRODUCTS.find(p => p.id === itemId);
    if (product && product.inStock) {
      const btn = e.target.closest('[data-action="quick-add"]');
      if (btn) attachRipple(btn);
      addToCart(product, getQty(product.id));
      showToast(`${product.name} added to bag`, 'success');
    }
  }
  ```

- [ ] **Step 5: Browser QA for cards at 1440px**

  Take screenshot. Confirm 3:4 portrait cards, hairline borders, slide-up Quick Add on hover.

- [ ] **Step 6: Commit**

  ```bash
  git add pages/smart-list.html js/smart-reorder.js
  git commit -m "feat(smart-list): T3 — 3:4 luxury cards, hairline borders, slide-up Quick Add overlay"
  ```

---

## Task 4: Architectural Filter Bar, Toolbar & Responsive Grid

**Files:**
- Modify: `pages/smart-list.html` (lines ~397–540: toolbar + filter CSS)

**Interfaces:**
- Consumes: All prior task outputs.
- Produces: 2px architectural filter pills, Manrope stats, white architectural "Add All" CTA, 4→3→2→1 responsive grid.

- [ ] **Step 1: Update filter pills to architectural 2px radius**

  ```css
  .sl-filter-pill {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 2px;
    padding: 6px 14px;
    font-family: 'Inter', sans-serif;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.55);
    cursor: pointer;
    white-space: nowrap;
    transition: all 180ms ease;
    min-height: 38px;
    display: inline-flex;
    align-items: center;
  }
  .sl-filter-pill:hover {
    background: rgba(255, 255, 255, 0.06);
    color: #FFFFFF;
    border-color: rgba(255, 255, 255, 0.16);
  }
  .sl-filter-pill.active {
    background: rgba(61, 224, 255, 0.08);
    border-color: rgba(61, 224, 255, 0.35);
    color: #3DE0FF;
  }
  ```

- [ ] **Step 2: Update toolbar stats to Manrope display**

  ```css
  .sl-stat-val {
    font-family: 'Manrope', sans-serif;
    font-size: 20px;
    color: #FFFFFF;
    font-weight: 700;
    letter-spacing: -0.01em;
  }
  .sl-stat-label {
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--accent-cyan, #3DE0FF);
    display: block;
    margin-bottom: 3px;
  }
  ```

- [ ] **Step 3: Update Add All CTA to architectural standard**

  ```css
  .sl-btn-add-all {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 20px;
    background: #FFFFFF;
    color: #030814;
    font-family: 'Inter', sans-serif;
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.10em;
    text-transform: uppercase;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: opacity 180ms ease, transform 180ms ease;
    position: relative;
    overflow: hidden;
  }
  .sl-btn-add-all:hover { opacity: 0.92; transform: translateY(-1px); }
  .sl-btn-add-all:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
  ```

- [ ] **Step 4: Update grid breakpoints**

  ```css
  #slGrid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; align-items: start; }
  @media (max-width: 1024px) { #slGrid { grid-template-columns: repeat(3, 1fr); gap: 16px; } }
  @media (max-width: 768px)  { #slGrid { grid-template-columns: repeat(2, 1fr); gap: 14px; } }
  @media (max-width: 480px)  { #slGrid { grid-template-columns: 1fr; } }
  ```

- [ ] **Step 5: Browser QA — 3 breakpoints (1440, 768, 375)**

  Take screenshots at 3 widths. Confirm architectural filter pills, Manrope stats, correct grid columns.

- [ ] **Step 6: Commit**

  ```bash
  git add pages/smart-list.html
  git commit -m "style(smart-list): T4 — 2px architectural filter pills, Manrope toolbar stats, responsive grid"
  ```

---

## Task 5: Concierge Bridge, Final Responsive QA & Walkthrough

**Files:**
- Modify: `pages/smart-list.html` (Concierge Bridge styles + headings)

**Interfaces:**
- Consumes: All prior task outputs.
- Produces: Fully verified Smart List page at 1440px, 1024px, 768px, 375px, updated walkthrough.md.

- [ ] **Step 1: Update Concierge Bridge to Modernist standard**

  ```css
  .sl-concierge-bridge {
    max-width: 1240px;
    margin: 0 auto 80px;
    padding: 32px 36px;
    background: rgba(8, 14, 30, 0.60);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 6px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
  }
  ```

  Update Concierge Bridge headline inline style in HTML to use `Manrope`:
  ```html
  <!-- Find this in smart-list.html around line 1594: -->
  <div style="font-family: 'Manrope', sans-serif; font-size: 20px; font-weight: 600; letter-spacing: -0.01em; color: #FFFFFF; margin-bottom: 6px;">Assemble Your Complete Ensemble</div>
  ```

- [ ] **Step 2: Final browser QA — 1440px, 1024px, 768px, 375px**

  Take screenshots at all 4 widths. Verify:
  - 1440px: 4-col grid, hero visible above fold, spotlight signature gradient progress bar.
  - 1024px: 3-col grid, spotlight stacked.
  - 768px: 2-col grid, filter pills scroll horizontally.
  - 375px: 1-col grid, hero headline fits, preset pills wrap cleanly.

- [ ] **Step 3: Empty state QA**

  In browser DevTools Console:
  ```javascript
  localStorage.setItem('nex_sl_dismissed', JSON.stringify({p1:'2099-01-01',p2:'2099-01-01',p3:'2099-01-01',p4:'2099-01-01',p5:'2099-01-01',p6:'2099-01-01',p7:'2099-01-01',p8:'2099-01-01',p9:'2099-01-01',p10:'2099-01-01',p11:'2099-01-01',p12:'2099-01-01'}));
  location.reload();
  ```
  Confirm empty state renders correctly.
  Restore: `localStorage.removeItem('nex_sl_dismissed'); location.reload();`

- [ ] **Step 4: Final commit**

  ```bash
  git add pages/smart-list.html
  git commit -m "style(smart-list): T5 — Concierge Bridge Modernist, final responsive QA"
  ```

---

## Verification Plan

### Manual Verification
1. All tabs/filter pills have `border-radius: 2px` (no oval pills).
2. Product cards show 3:4 portrait aspect ratio.
3. Hover reveals slide-up "ADD TO BAG" bar smoothly.
4. Signature cyan→pink gradient progress bar visible on spotlight.
5. No multi-line paragraph text on product cards.
6. Preset pills (Alpine, Monochrome, Transit, Gala) filter grid correctly.
7. "View Replenishments" spotlight button syncs filter.
8. "Move All to Bag" dispatches all in-stock items.
9. Dismiss item → undo toast appears with 5s countdown.
10. Responsive grid: 4→3→2→1 columns at correct breakpoints.
