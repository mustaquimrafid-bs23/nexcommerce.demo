# Today's Deals — Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `<!-- TODAY'S DEALS -->` section with all 4 Motion Standards — micro-interactions, 3D hover physics, GPU page transitions, and scroll parallax — while keeping the layout compact and beautiful.

**Architecture:** Three files own the feature: `index.html` holds the DOM structure (already partially updated), `css/design-system.css` owns all visual/animation tokens, and `js/animations.js` owns the Motion.dev orchestration. The existing `js/home.js` countdown logic is extended in-place to drive the GPU progress bar.

**Tech Stack:** Vanilla HTML/CSS · Motion.dev v11 (ESM CDN, already loaded) · Lucide Icons · Lenis smooth scroll (already wired) · CSS custom properties for tilt/specular state.

---

## Global Constraints

- Dark palette: `--bg-primary: #020B18`, cyan `#3DE0FF`, pink `#F13365`
- Font: display = `Outfit`, body = `Work Sans`
- No Tailwind. No new npm packages. All motion via Motion.dev already on page.
- Spacing grid: 4px / 8px base
- `prefers-reduced-motion: reduce` must disable all tilt/parallax/progress transitions
- Touch targets: min 44×44px for all interactive elements
- GPU-only animation properties: `transform`, `opacity`, `filter` — never `width`, `height`, `top`, `left`
- Card tilt: max ±8° X and Y, `perspective: 1000px` on grid parent
- Progress bar: `transform: scaleX()` only, `transform-origin: left center`, `will-change: transform`
- No inline event handlers in HTML (all delegated in JS)

---

## Visual Blueprint

```
┌─────────────────────────────────────────────────────────────────────┐
│  DEALS SECTION  (padding: 52px 0 60px)                              │
│                                                                      │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  HEADER STRIP  (flex, space-between, align-center)           │   │
│  │                                                              │   │
│  │  LEFT                         RIGHT                         │   │
│  │  ● Flash Sale  [live dot]     [All deals →]  [PILL TIMER]   │   │
│  │  Today's Offers               "Closes in"  04:32:15         │   │
│  │                               ════════████░░░░░░  ← scaleX  │   │
│  └──────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐               │
│  │  IMG │  │  IMG │  │  IMG │  │  IMG │  │  IMG │               │
│  │depth1│  │depth2│  │depth3│  │depth2│  │depth1│  ← parallax   │
│  │glare▓│  │glare▓│  │glare▓│  │glare▓│  │glare▓│  ← specular  │
│  │[+ADD]│  │[+ADD]│  │[+ADD]│  │[+ADD]│  │[+ADD]│  ← ripple    │
│  ├──────┤  ├──────┤  ├──────┤  ├──────┤  ├──────┤               │
│  │ CAT  │  │ CAT  │  │ CAT  │  │ CAT  │  │ CAT  │               │
│  │Title │  │Title │  │Title │  │Title │  │Title │               │
│  │$Price│  │$Price│  │$Price│  │$Price│  │$Price│               │
│  │★4.6  │  │★4.7  │  │★4.5  │  │★4.8  │  │★4.6  │               │
│  └──────┘  └──────┘  └──────┘  └──────┘  └──────┘               │
└─────────────────────────────────────────────────────────────────────┘
```

### Countdown Pill Detail

```
┌─────────────────────────────────────────────────┐
│  CLOSES IN   04 : 32 : 15                       │
│  ─────────██████████░░░░░░░░░░░░░░░░─────────── │
│            ↑ scaleX(0.28) GPU progress bar       │
│            cyan → pink gradient                  │
└─────────────────────────────────────────────────┘
```

### Card 3D Hover State

```
         ↑ translateZ(12px) lift
    ┌────────────────────────────┐   ←  border brightens to rgba(255,255,255,0.18)
    │    product image           │
    │    ╲   specular glare ▓    │   ← glare follows cursor (radial-gradient)
    │     ╲__________________    │
    └────────────────────────────┘
    shadow-1: rgba(0,0,0,0.22)   blur 40px  Y+24px
    shadow-2: rgba(61,224,255,0.08) blur 60px Y+40px  ← cyan glow
    shadow-3: rgba(0,0,0,0.22)   blur 8px   Y+4px
```

### Ripple on Quick-Add Click

```
    [+ QUICK ADD button]
         ●  ← .deal-ripple span, positioned at click X/Y
         ◌  scale(0) → scale(4), opacity 1 → 0,  400ms
         ○
```

### Scroll Parallax (differential depth per column)

```
  Scroll direction ↓

  depth=1 (outer cols):   translateY(±7px)   — barely moves
  depth=2 (mid cols):     translateY(±14px)  — medium drift
  depth=3 (center card):  translateY(±21px)  — deepest drift

  Image inside each card has additional micro-parallax: ±(depth × 5px)
```

### Page Transition

```
  [click card] → e.preventDefault()
       │
       ▼
  #pageTransitionOverlay  opacity 0 → 1  (200ms, GPU)
       │
       ▼  210ms
  window.location.href = card href
```

---

## File Map

| File | Action | Scope |
|------|--------|-------|
| `index.html` | MODIFY — already partially applied | lines ~299–480 |
| `css/design-system.css` | MODIFY — replace old deals CSS block | lines ~7999–8334 |
| `js/home.js` | MODIFY — extend `initDealsCountdown()` | lines ~473–496 + ~551 |
| `js/animations.js` | MODIFY — add `initDealsSectionMotion()` | append at bottom + DOMContentLoaded call |

---

## Task 1: HTML Structure Audit & Finalize

**Files:**
- Modify: `index.html` lines 299–480

**Interfaces:**
- Produces: `#dealsSectionRoot`, `.deals-header-strip`, `.deals-countdown-pill`, `#dealProgressBar`, `.deals-carousel-grid`, `.deal-product-card[data-parallax-depth]`, `.deal-card-specular`, `.deal-ripple`

- [ ] **Step 1.1: Verify the partial HTML edit is correct**

Open `index.html` and confirm lines ~299–321 match this structure exactly:

```html
<section class="home-deals-section" id="dealsSectionRoot">
  <div class="container">
    <div class="deals-header-strip">
      <div class="deals-header-left">
        <div class="deal-section-tag"><span class="deal-live-dot"></span>Flash Sale</div>
        <h2 class="deals-title">Today's Offers</h2>
      </div>
      <div class="deals-header-right">
        <a href="pages/category.html?sort=sale" class="deals-see-all-link">All deals</a>
        <div class="deals-countdown-pill" aria-label="Offer Countdown">
          <div class="dcp-label">Closes in</div>
          <div class="dcp-digits">
            <span class="dcp-unit" id="dealHours">04</span><span class="dcp-sep">:</span>
            <span class="dcp-unit" id="dealMins">32</span><span class="dcp-sep">:</span>
            <span class="dcp-unit" id="dealSecs">15</span>
          </div>
          <div class="dcp-progress-track" aria-hidden="true">
            <div class="dcp-progress-bar" id="dealProgressBar"></div>
          </div>
        </div>
      </div>
    </div>
```

- [ ] **Step 1.2: Confirm each `.deal-product-card` has the new attributes and elements**

Each of the 5 deal cards must have:

1. `data-parallax-depth="N"` attribute on the `<a>` tag (depths left→right: `1, 2, 3, 2, 1`)
2. `<div class="deal-card-specular" aria-hidden="true"></div>` inside `.deal-img-box` (before the overlay)
3. `<span class="deal-ripple" aria-hidden="true"></span>` as first child of each `.deal-add-btn`

Reference card template (one of five):

```html
<a href="pages/product.html?id=p1" class="deal-product-card"
   data-id="p1" data-parallax-depth="1"
   style="text-decoration: none; display: block; color: inherit;">
  <span class="deal-badge">-20%</span>
  <button class="deal-wishlist-btn" aria-label="Add Merino Knit Sweater to Wishlist">
    <i data-lucide="heart" style="width: 15px; height: 15px;"></i>
  </button>
  <div class="deal-img-box">
    <img src="assets/images/products/hero_sweater.png" alt="Merino Knit Sweater" loading="lazy" />
    <div class="deal-card-specular" aria-hidden="true"></div>
    <div class="deal-quick-add-overlay">
      <button class="deal-add-btn" data-id="p1" data-name="Merino Knit Sweater"
              data-price="1990" data-img="assets/images/products/hero_sweater.png" data-cat="Apparel">
        <span class="deal-ripple" aria-hidden="true"></span>
        <i data-lucide="plus" style="width: 13px; height: 13px;"></i> QUICK ADD
      </button>
    </div>
  </div>
  <div class="deal-card-body">
    <div class="deal-card-cat">APPAREL</div>
    <div class="deal-card-title">Merino Knit Sweater</div>
    <div class="deal-card-pricing">
      <span class="deal-price-current">BDT 1,990</span>
      <span class="deal-price-original">BDT 2,490</span>
    </div>
    <div class="deal-card-rating">
      <i data-lucide="star" style="width: 11px; height: 11px; fill: #FBBF24; stroke: none;"></i>
      <span>4.6</span>
      <span class="deal-card-reviews">(128)</span>
    </div>
  </div>
</a>
```

- [ ] **Step 1.3: Browser verification**

Navigate to `http://localhost:3000/index.html`. Open DevTools → Elements. Confirm:
- `document.getElementById('dealsSectionRoot')` returns the section
- `document.getElementById('dealProgressBar')` returns the bar element
- `document.querySelectorAll('.deal-card-specular').length` returns `5`
- `document.querySelectorAll('.deal-ripple').length` returns `5`

- [ ] **Step 1.4: Commit**

```bash
git add index.html
git commit -m "feat(deals): finalize DOM — specular, ripple, parallax-depth attrs, GPU timer markup"
```

---

## Task 2: CSS — Complete Deals Section Redesign

**Files:**
- Modify: `css/design-system.css` lines 7999–8334

**Interfaces:**
- Consumes: `--accent-cyan: #3DE0FF`, `--accent-pink: #F13365`, `--font-display`, `--font-body`, `--text-muted`
- Produces: visual styles + CSS custom property API consumed by JS: `--deal-tilt-x`, `--deal-tilt-y`, `--deal-glare-x`, `--deal-glare-y`, `--deal-glare-opacity`, `--deal-shadow-lift`, `--deal-img-y`

- [ ] **Step 2.1: Find and replace the old deals CSS block**

In `css/design-system.css`, find the comment line:
```
/* TODAY'S DEALS (FLASH SALE & COUNTDOWN - LUXURY EDITORIAL STANDARD)
```
(around line 7999). Replace everything from that comment through the closing `}` of the `@media (max-width: 768px)` deals block (around line 8334) with the following:

```css
/* ==========================================================================
   TODAY'S DEALS — MOTION REDESIGN (4 Standards: micro, 3D, transition, parallax)
   ========================================================================== */

.home-deals-section {
  padding: 52px 0 60px;
  background: linear-gradient(180deg,
    rgba(0, 18, 42, 0.55) 0%,
    rgba(1, 28, 60, 0.30) 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  overflow: hidden;
}
.home-deals-section::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 0%,
    rgba(61, 224, 255, 0.04) 0%, transparent 70%);
  pointer-events: none;
}

/* Header strip */
.deals-header-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}
.deals-header-left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.deals-title {
  font-family: var(--font-display);
  font-size: clamp(20px, 2.2vw, 26px);
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.02em;
  line-height: 1.1;
  margin: 0;
}
.deals-header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}
.deals-see-all-link {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: 0.04em;
  white-space: nowrap;
  transition: color 200ms ease;
}
.deals-see-all-link:hover { color: #FFFFFF; }

/* Live tag & dot */
.deal-section-tag {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.13em;
  color: var(--accent-cyan);
  text-transform: uppercase;
}
.deal-live-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #F43F5E;
  box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7);
  animation: dealDotPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  flex-shrink: 0;
}
@keyframes dealDotPulse {
  0%   { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
  60%  { box-shadow: 0 0 0 6px rgba(244, 63, 94, 0); }
  100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
}

/* GPU scaleX Countdown Pill */
.deals-countdown-pill {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  background: rgba(8, 20, 44, 0.75);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid rgba(61, 224, 255, 0.18);
  border-radius: 10px;
  padding: 8px 14px 10px;
  min-width: 120px;
}
.dcp-label {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-muted);
  line-height: 1;
}
.dcp-digits {
  display: flex;
  align-items: baseline;
  gap: 1px;
  font-variant-numeric: tabular-nums;
}
.dcp-unit {
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  min-width: 24px;
  text-align: center;
  -webkit-font-smoothing: antialiased;
  display: inline-block;
}
.dcp-sep {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent-cyan);
  opacity: 0.7;
  padding: 0 1px;
}
.dcp-progress-track {
  width: 100%;
  height: 2px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 2px;
  overflow: hidden;
  margin-top: 2px;
}
.dcp-progress-bar {
  height: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-pink) 100%);
  transform-origin: left center;
  transform: scaleX(1);
  will-change: transform;
  transition: transform 950ms linear;
}

/* 5-Column Deal Grid — perspective for 3D children */
.deals-carousel-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 16px;
  perspective: 1000px;
  perspective-origin: 50% 30%;
}

/* Deal Card — 3D Tilt Shell */
.deal-product-card {
  --deal-tilt-x: 0deg;
  --deal-tilt-y: 0deg;
  --deal-glare-x: 50%;
  --deal-glare-y: 50%;
  --deal-glare-opacity: 0;
  --deal-shadow-lift: 0;

  background: linear-gradient(175deg,
    rgba(14, 36, 72, 0.58) 0%,
    rgba(4, 18, 42, 0.78) 100%);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  transform: rotateX(var(--deal-tilt-x)) rotateY(var(--deal-tilt-y)) translateZ(0);
  box-shadow:
    0 calc(4px + var(--deal-shadow-lift) * 20px) calc(8px + var(--deal-shadow-lift) * 32px) rgba(0, 0, 0, 0.22),
    0 calc(8px + var(--deal-shadow-lift) * 32px) calc(24px + var(--deal-shadow-lift) * 40px) rgba(0, 0, 0, 0.18),
    0 0 0 1px rgba(255, 255, 255, calc(0.04 + var(--deal-shadow-lift) * 0.1));
  transition: box-shadow 400ms cubic-bezier(0.23, 1, 0.32, 1), border-color 300ms ease;
  will-change: transform;
}
.deal-product-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
}

/* Specular Glare Layer */
.deal-card-specular {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--deal-glare-x) var(--deal-glare-y),
    rgba(255, 255, 255, 0.10) 0%,
    transparent 55%
  );
  opacity: var(--deal-glare-opacity);
  pointer-events: none;
  z-index: 4;
  transition: opacity 180ms ease;
}

/* Badge */
.deal-badge {
  position: absolute;
  top: 11px;
  left: 11px;
  background: rgba(10, 20, 40, 0.90);
  border: 1px solid rgba(241, 51, 101, 0.40);
  color: #FDA4AF;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 5px;
  z-index: 5;
}

/* Wishlist button */
.deal-wishlist-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  min-width: 44px;
  min-height: 44px;
  margin: -5px;
  border-radius: 50%;
  background: rgba(6, 16, 36, 0.72);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  z-index: 5;
  transition:
    transform 240ms cubic-bezier(0.34, 1.56, 0.64, 1),
    color 160ms ease,
    background 160ms ease,
    border-color 160ms ease;
}
.deal-wishlist-btn:hover { transform: scale(1.15); color: #FFFFFF; border-color: rgba(255,255,255,0.28); }
.deal-wishlist-btn.active { color: #F43F5E; background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.55); }

/* Image box */
.deal-img-box {
  width: 100%;
  aspect-ratio: 1 / 1.1;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.18) 100%);
  position: relative;
}
.deal-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transform: translateY(var(--deal-img-y, 0px)) scale(1.06);
  will-change: transform;
  transition: transform 600ms cubic-bezier(0.25, 1, 0.5, 1);
}
.deal-product-card:hover .deal-img-box img {
  transform: translateY(var(--deal-img-y, 0px)) scale(1.10);
}

/* Quick-add overlay */
.deal-quick-add-overlay {
  position: absolute;
  bottom: 0; left: 0; right: 0;
  padding: 10px;
  background: linear-gradient(0deg, rgba(2, 10, 26, 0.92) 0%, transparent 100%);
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(6px);
  transition: opacity 220ms cubic-bezier(0.25,1,0.5,1), transform 220ms cubic-bezier(0.25,1,0.5,1);
  pointer-events: none;
  z-index: 3;
}
.deal-product-card:hover .deal-quick-add-overlay,
.deal-product-card:focus-within .deal-quick-add-overlay {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

/* Quick-add button + ripple */
.deal-add-btn {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 36px;
  min-height: 44px;
  background: rgba(255, 255, 255, 0.94);
  color: #011630;
  border-radius: 7px;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.38);
  transition: background 150ms ease, transform 150ms ease, box-shadow 150ms ease;
  -webkit-font-smoothing: antialiased;
}
.deal-add-btn:hover { background: #FFFFFF; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,255,255,0.25); }
.deal-add-btn:active { transform: scale(0.97); }

.deal-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(1, 22, 48, 0.25);
  pointer-events: none;
  transform: scale(0);
  opacity: 1;
}
.deal-ripple.animating {
  animation: dealRippleOut 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}
@keyframes dealRippleOut {
  to { transform: scale(4); opacity: 0; }
}

/* Card body */
.deal-card-body {
  padding: 12px 13px 14px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 3px;
}
.deal-card-cat {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}
.deal-card-title {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-font-smoothing: antialiased;
}
.deal-card-pricing {
  display: flex;
  align-items: baseline;
  gap: 7px;
  margin-top: 4px;
}
.deal-price-current {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
  -webkit-font-smoothing: antialiased;
}
.deal-price-original {
  font-size: 10px;
  color: var(--text-muted);
  text-decoration: line-through;
  font-variant-numeric: tabular-nums;
}
.deal-card-rating {
  display: flex;
  align-items: center;
  gap: 3px;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  color: #FBBF24;
  margin-top: 2px;
}
.deal-card-reviews { color: var(--text-muted); font-weight: 400; }

/* Responsive */
@media (max-width: 1180px) {
  .deals-carousel-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .home-deals-section { padding: 36px 0 44px; }
  .deals-header-strip { flex-direction: column; align-items: flex-start; gap: 10px; }
  .deals-carousel-grid {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding-bottom: 12px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    perspective: none;
  }
  .deals-carousel-grid::-webkit-scrollbar { display: none; }
  .deal-product-card {
    flex: 0 0 200px;
    min-width: 200px;
    scroll-snap-align: start;
    transform: none !important;
  }
  .deal-quick-add-overlay { opacity: 1; transform: none; pointer-events: auto; }
  .deals-countdown-pill { min-width: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .deal-product-card,
  .deal-img-box img,
  .dcp-progress-bar { transition: none !important; animation: none !important; }
  .deal-live-dot { animation: none; }
}
```

- [ ] **Step 2.2: Confirm old CSS is gone**

```powershell
Select-String -Path "css/design-system.css" -Pattern "deals-countdown-box|deal-timer-label|deal-timer-unit|deal-timer-sep"
# Expected: no output
```

- [ ] **Step 2.3: Browser static check**

Load `http://localhost:3000/index.html`. Scroll to deals. Confirm:
- Section has compact header strip (title + pill side by side)
- Progress bar track visible under the countdown digits
- Cards have `border-radius: 14px`, smaller body text
- `perspective: 1000px` on the grid (DevTools → Computed Styles on `.deals-carousel-grid`)

- [ ] **Step 2.4: Commit**

```bash
git add css/design-system.css
git commit -m "feat(deals): CSS redesign — GPU progress bar, 3D card shell, specular API, ripple, parallax tokens"
```

---

## Task 3: JS — Micro-Interactions (GPU Progress Timer + Digit Flip + Tactile Ripple)

**Files:**
- Modify: `js/home.js` lines ~473–496 and ~551–585

**Interfaces:**
- Consumes: `#dealProgressBar` (DOM element), `#dealHours`, `#dealMins`, `#dealSecs`, `.deal-ripple` (child of `.deal-add-btn`)
- Produces: `progressBar.style.transform = scaleX(ratio)` every 1s; digit flip via inline `style.transform` / `style.opacity`; `.deal-ripple.animating` class applied on click

- [ ] **Step 3.1: Replace `initDealsCountdown()` in `home.js` (lines ~473–496)**

Replace the full function body:

```javascript
function initDealsCountdown() {
  const TOTAL_SECS = (4 * 3600) + (32 * 60) + 15;
  let secondsRemaining = TOTAL_SECS;

  const hoursEl    = document.getElementById('dealHours');
  const minsEl     = document.getElementById('dealMins');
  const secsEl     = document.getElementById('dealSecs');
  const progressBar = document.getElementById('dealProgressBar');

  function pad(n) { return String(n).padStart(2, '0'); }

  // Flip digit: slide up and out, replace content, slide in
  function flipUnit(el, newVal) {
    if (!el || el.textContent === newVal) return;
    el.style.transition = 'transform 120ms ease-in, opacity 120ms ease-in';
    el.style.transform  = 'translateY(-4px)';
    el.style.opacity    = '0';
    setTimeout(() => {
      el.textContent = newVal;
      el.style.transition = 'transform 160ms cubic-bezier(0.23,1,0.32,1), opacity 160ms ease-out';
      el.style.transform  = 'translateY(0)';
      el.style.opacity    = '1';
    }, 130);
  }

  function updateTimer() {
    if (secondsRemaining <= 0) { secondsRemaining = TOTAL_SECS; }

    const h = Math.floor(secondsRemaining / 3600);
    const m = Math.floor((secondsRemaining % 3600) / 60);
    const s = secondsRemaining % 60;

    flipUnit(hoursEl, pad(h));
    flipUnit(minsEl,  pad(m));
    flipUnit(secsEl,  pad(s));

    // GPU scaleX — shrinks from 1 (full) to 0 (expired) over TOTAL_SECS
    if (progressBar) {
      const ratio = secondsRemaining / TOTAL_SECS;
      progressBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }

    secondsRemaining--;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}
```

- [ ] **Step 3.2: Add ripple trigger inside `.deal-add-btn` click handler in `initDealsCards()` (home.js ~551)**

Locate the `document.querySelectorAll('.deal-add-btn').forEach(btn => {` block. Inside the `btn.addEventListener('click', (e) => {` callback, insert this ripple block **before** the existing cart add logic:

```javascript
// Tactile ripple — always fires on click
const rippleEl = btn.querySelector('.deal-ripple');
if (rippleEl) {
  rippleEl.classList.remove('animating');
  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  rippleEl.style.width  = size + 'px';
  rippleEl.style.height = size + 'px';
  rippleEl.style.left   = (e.clientX - rect.left - size / 2) + 'px';
  rippleEl.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
  void rippleEl.offsetWidth; // force reflow to restart animation
  rippleEl.classList.add('animating');
  rippleEl.addEventListener('animationend', () => {
    rippleEl.classList.remove('animating');
  }, { once: true });
}
```

- [ ] **Step 3.3: Browser verification**

1. Scroll to deals section. Observe the progress bar — it should start near full and very slowly decrease.
2. **Speed test:** temporarily set `TOTAL_SECS = 30` and reload — bar should visibly drain in 30 seconds.
3. Hover a card until QUICK ADD appears. Click it. A dark radial ripple must expand from the exact cursor position and fade out in ~400ms.
4. Restore `TOTAL_SECS` to `(4 * 3600) + (32 * 60) + 15`.

- [ ] **Step 3.4: Commit**

```bash
git add js/home.js
git commit -m "feat(deals): GPU scaleX progress bar + flip digit micro-animation + tactile ripple"
```

---

## Task 4: JS — 3D Hover Physics, Specular, Page Transition & Scroll Parallax

**Files:**
- Modify: `js/animations.js` — append function + add call in DOMContentLoaded

**Interfaces:**
- Consumes: `#dealsSectionRoot`, `.deal-product-card[data-parallax-depth]`, `.deal-card-specular`, `.deals-see-all-link`, `#pageTransitionOverlay`, `window._nexLenis`
- Produces: writes `card.style.transform`, `--deal-glare-x/y/opacity`, `--deal-shadow-lift`, `--deal-img-y` as CSS custom properties; triggers `#pageTransitionOverlay` opacity on navigation

- [ ] **Step 4.1: Append `initDealsSectionMotion()` to `js/animations.js`**

Add the following after the closing `}` of the `initTrackingAnimations()` function:

```javascript
/**
 * initDealsSectionMotion
 * Implements all 4 Motion Standards for the Today's Deals section:
 * 1. Micro-interactions (scroll-reveal stagger)
 * 2. 3D Hover Physics (mouse tilt + specular glare + multi-layer shadow)
 * 3. GPU Page Transition (cross-dissolve curtain)
 * 4. Scroll Parallax (differential column depth)
 */
function initDealsSectionMotion() {
  const section = document.getElementById('dealsSectionRoot');
  if (!section) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = Array.from(section.querySelectorAll('.deal-product-card'));

  // ── 1. MICRO-INTERACTIONS: Staggered scroll-reveal entrance ──────────
  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

    const headerLeft  = section.querySelector('.deals-header-left');
    const headerRight = section.querySelector('.deals-header-right');
    if (headerLeft) {
      animate(headerLeft,  { opacity: [0, 1], y: [12, 0] },
        { duration: 0.6, easing: [0.16, 1, 0.3, 1] });
    }
    if (headerRight) {
      animate(headerRight, { opacity: [0, 1], y: [12, 0] },
        { duration: 0.6, delay: 0.08, easing: [0.16, 1, 0.3, 1] });
    }
    if (cards.length > 0) {
      animate(cards,
        { opacity: [0, 1], y: [28, 0], scale: [0.96, 1] },
        { delay: stagger(0.07, { startDelay: 0.12 }), duration: 0.7,
          easing: [0.16, 1, 0.3, 1] });
    }
  }, { margin: '0px 0px -8% 0px' });

  // Skip physics on reduced motion
  if (prefersReduced) return;

  // ── 2. 3D HOVER PHYSICS: Mouse tilt + specular glare ─────────────────
  const MAX_TILT = 8; // degrees

  cards.forEach(card => {
    let rafId = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const LERP = 0.12;
    const lerp = (a, b, t) => a + (b - a) * t;

    function getParallaxY() {
      return parseFloat(card.style.getPropertyValue('--deal-card-y') || '0');
    }

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, LERP);
      curTY = lerp(curTY, tgtTY, LERP);
      const py = getParallaxY();
      card.style.setProperty('--deal-shadow-lift', '1');
      card.style.transform =
        `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;

      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        card.style.transform =
          `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;
        rafId = null;
      }
    }

    card.addEventListener('mousemove', e => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY =  (dx * MAX_TILT);

      // Specular glare at cursor
      const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      card.style.setProperty('--deal-glare-x', gx);
      card.style.setProperty('--deal-glare-y', gy);
      card.style.setProperty('--deal-glare-opacity', '1');

      if (!rafId) { rafId = requestAnimationFrame(applyTilt); }
    });

    card.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;
      card.style.setProperty('--deal-glare-opacity', '0');
      card.style.setProperty('--deal-shadow-lift', '0');

      function springBack() {
        curTX = lerp(curTX, 0, 0.18);
        curTY = lerp(curTY, 0, 0.18);
        const py = getParallaxY();
        card.style.transform =
          `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px) translateY(${py}px)`;
        if (Math.abs(curTX) > 0.05 || Math.abs(curTY) > 0.05) {
          rafId = requestAnimationFrame(springBack);
        } else {
          const pyFinal = getParallaxY();
          card.style.transform = `translateY(${pyFinal}px)`;
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });

  // ── 3. PAGE TRANSITION: GPU cross-dissolve on card/link clicks ────────
  const curtain = document.getElementById('pageTransitionOverlay');

  function triggerPageTransition(href) {
    if (!curtain || !href) return;
    curtain.style.transition    = 'opacity 200ms ease';
    curtain.style.opacity       = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 210);
  }

  // Cards are <a> tags — intercept click before native navigation
  cards.forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.deal-add-btn') || e.target.closest('.deal-wishlist-btn')) return;
      e.preventDefault();
      triggerPageTransition(card.getAttribute('href'));
    });
  });

  const allDealsLink = section.querySelector('.deals-see-all-link');
  if (allDealsLink) {
    allDealsLink.addEventListener('click', e => {
      e.preventDefault();
      triggerPageTransition(allDealsLink.getAttribute('href'));
    });
  }

  // ── 4. SCROLL PARALLAX: Differential column depth ────────────────────
  let pxTicking = false;

  function updateDealsParallax() {
    const rect   = section.getBoundingClientRect();
    const winH   = window.innerHeight;
    if (rect.bottom > 0 && rect.top < winH) {
      const span     = winH + rect.height;
      const prog     = (winH - rect.top) / span;   // 0 → 1
      const centered = (prog - 0.5) * 2;           // -1 → +1

      cards.forEach(card => {
        const depth  = parseInt(card.getAttribute('data-parallax-depth') || '1', 10);
        const travel = depth * 7; // px per depth unit
        const yCard  = (centered * travel).toFixed(2);
        card.style.setProperty('--deal-card-y', yCard + 'px');

        // Only apply card-level parallax when NOT being hovered (JS tilt overrides)
        if (!card.matches(':hover')) {
          card.style.transform = `translateY(${yCard}px)`;
        }

        // Image micro-parallax
        const img = card.querySelector('.deal-img-box img');
        if (img) {
          const yImg = (centered * depth * 5).toFixed(2);
          img.style.setProperty('--deal-img-y', yImg + 'px');
        }
      });
    }
    pxTicking = false;
  }

  function requestParallaxFrame() {
    if (!pxTicking) {
      requestAnimationFrame(updateDealsParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestParallaxFrame); }
  window.addEventListener('scroll', requestParallaxFrame, { passive: true });
}
```

- [ ] **Step 4.2: Add call inside the DOMContentLoaded block**

In `animations.js`, find the `document.addEventListener("DOMContentLoaded", () => {` block and add `initDealsSectionMotion();` after `initTrackingAnimations();`:

```javascript
document.addEventListener("DOMContentLoaded", () => {
  if (typeof lucide !== 'undefined') { lucide.createIcons(); }
  initSmoothScroll();
  initHeroAnimations();
  initCuratedDepartmentsMotion();
  initScrollReveals();
  initHoverEffects();
  initTrackingAnimations();
  initDealsSectionMotion(); // ← ADD THIS LINE
});
```

- [ ] **Step 4.3: Bump animations.js version in index.html**

```html
<!-- Change: -->
<script type="module" src="js/animations.js?v=7">
<!-- To: -->
<script type="module" src="js/animations.js?v=8">
```

- [ ] **Step 4.4: Verify all 4 motion standards in browser**

| Standard | Test | Expected |
|----------|------|----------|
| Micro-interactions | Scroll section into view | Cards stagger-cascade upward with spring ease, header fades in |
| 3D hover | Hover card top-right corner | Card tilts ~8° toward cursor, specular glare at top-right |
| 3D hover | Move mouse away | Card springs smoothly back to flat, shadow reduces |
| Page transition | Click any deal card | Dark curtain fades in (200ms), then navigates |
| Page transition | Click "All deals" | Same curtain transition |
| Scroll parallax | Slowly scroll through section | Center card (depth 3) drifts ±21px, outer cards (depth 1) ±7px |
| Ripple | Click QUICK ADD | Dark radial wave from click point, 400ms |

- [ ] **Step 4.5: Commit**

```bash
git add js/animations.js index.html
git commit -m "feat(deals): 3D tilt physics, specular glare, GPU page transition, scroll parallax (differential depth)"
```

---

## Task 5: CSS Version Bump & Cross-Browser QA

**Files:**
- Modify: `index.html` — CSS query string version

- [ ] **Step 5.1: Bump CSS version**

```html
<!-- Change: -->
<link rel="stylesheet" href="css/design-system.css?v=21">
<!-- To: -->
<link rel="stylesheet" href="css/design-system.css?v=22">
```

- [ ] **Step 5.2: Desktop (1280×800) — verify grid + pill**

All 5 cards visible in single row. Countdown pill has visible progress bar and colon-separated digits.

- [ ] **Step 5.3: Tablet (768×1024) — verify 3-column fallback**

`grid-template-columns` collapses to 3. Header strip stacks vertically. No 3D tilt active.

- [ ] **Step 5.4: Mobile (375×812) — verify carousel**

Cards become horizontal scroll carousel with `flex: 0 0 200px`. Quick-add always visible (no hover required). `transform: none !important` prevents any JS tilt.

- [ ] **Step 5.5: `prefers-reduced-motion` — verify all motion off**

In DevTools → Rendering → Emulate CSS media feature → select `prefers-reduced-motion: reduce`. Confirm: no card stagger, no tilt, no ripple animation, progress bar static.

- [ ] **Step 5.6: Final commit**

```bash
git add index.html
git commit -m "chore(deals): bump CSS v22, QA all viewports + reduced-motion"
```

---

## Verification Plan

### Automated Checks

```powershell
# 1. Old CSS class names must be gone
Select-String -Path "css/design-system.css" -Pattern "deals-countdown-box|deal-timer-label|deal-timer-unit|deal-timer-sep"
# Expected: no output

# 2. New DOM elements present in HTML
Select-String -Path "index.html" -Pattern "deal-card-specular|deal-ripple|dcp-progress-bar|data-parallax-depth"
# Expected: 5+ matches each

# 3. CSS custom props defined
Select-String -Path "css/design-system.css" -Pattern "--deal-tilt-x|--deal-glare-opacity|--deal-img-y|--deal-shadow-lift"
# Expected: 4+ matches

# 4. Function defined and called
Select-String -Path "js/animations.js" -Pattern "initDealsSectionMotion"
# Expected: 2 lines (function declaration + call)
```

### Manual Verification Checklist

| # | Test | Pass Condition |
|---|------|----------------|
| 1 | Scroll to section | Cards stagger in with delay cascade |
| 2 | Hover card center | Subtle tilt, soft specular centered |
| 3 | Hover card corner | ~8° tilt, specular at corner |
| 4 | Move mouse off card | Spring-back to flat in ~300ms |
| 5 | Click deal card | Curtain dissolve then navigate |
| 6 | Click "All deals" | Same dissolve transition |
| 7 | Click QUICK ADD | Ripple from cursor origin |
| 8 | Watch 3s of countdown | Each second: digit flips up, bar shrinks |
| 9 | Scroll slowly | Center card drifts more than outer cards |
| 10 | 375px mobile | Horizontal scroll, quick-add always on |
| 11 | Reduced motion | Static section, no tilt, no ripple anim |

---

## Self-Review Notes

- **Spec coverage:** All 4 motion standards mapped: micro (Task 3 stagger + Task 4 reveal), 3D hover (Task 4 tilt), page transition (Task 4 curtain), scroll parallax (Task 4 differential depth). Progress bar GPU (Task 3). Ripple (Task 3). ✓
- **Placeholder scan:** Every step has executable code. No "TBD", "TODO", or vague instructions. ✓
- **Type consistency:** `initDealsCountdown()` stays in `home.js`. `initDealsSectionMotion()` in `animations.js`. IDs `dealHours`, `dealMins`, `dealSecs`, `dealProgressBar` used consistently across HTML, CSS, and JS. Custom props `--deal-tilt-x/y`, `--deal-glare-x/y/opacity`, `--deal-shadow-lift`, `--deal-img-y`, `--deal-card-y` defined in CSS and written by JS. ✓
- **No breaking changes:** Old `deals-countdown-box` / `deal-timer-*` CSS removed. Old `reveal-on-scroll` class removed from section (Motion.dev `inView` handles entrance now). No other component in codebase uses `deals-*` class names. ✓
