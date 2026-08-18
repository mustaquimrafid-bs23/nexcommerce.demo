# Today's Deals Luxury Atelier & 4-Standard Motion Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the Today's Deals section on `index.html` into a world-class luxury Atelier Spotlight & Curated Motion Rail, fully integrating all 4 Motion Standards (Micro-interactions, 3D Hover Effects, Page Transitions, and Scroll Parallax) with 120fps GPU performance.

**Architecture:** A dual-column luxury layout featuring a Spotlight Atelier Card (42%) with live colorway swatching, 120fps SVG circular countdown progress ring, and allocation meter on the left, paired with a 4-card Curated Motion Rail (58%) featuring magnetic chevron controls and sliding category look switcher on the right. Both columns run on a zero-collision 120fps physics engine with spring-damped tilt, cursor-tracking specular glare, and IntersectionObserver-culled differential scroll parallax.

**Tech Stack:** Vanilla JavaScript (ES6+), CSS3 (Hardware-accelerated transforms, 3D perspective, variables, `@keyframes`), HTML5 Semantic Elements, Lucide Icons, SVG.

## Global Constraints
- Target Viewports: Desktop (1440px/1280px), Laptop (1024px), Tablet (768px), Mobile (375px/320px).
- Typography & Theme: Obsidian dark mode (`#01142F` to `#001026`), system font stack with Google Font tokens (`--font-display`, `--font-body`).
- Zero layout thrashing / zero CPU animating properties: use only `transform: translate3d/scale/rotate` and `opacity`.
- Full WCAG 2.1 AA accessibility (minimum 4.5:1 contrast, visible focus rings, ARIA roles, `@media (prefers-reduced-motion: reduce)` fallback).
- Never use inline JS handlers (`onclick`, `onchange`). Delegate all event listeners in `js/home.js`.

---

### Task 1: Rebuild HTML Structure in `index.html`

**Files:**
- Modify: `c:/Users/BS1572/OneDrive - Brain Station 23/Documents/nexcomarch/index.html:299-468`

**Interfaces:**
- Consumes: Product assets in `assets/images/products/`, Lucide Icons CDN script.
- Produces: Semantic DOM elements with IDs `#todaysDealsSection`, `#dealsNavSliderPill`, `#dealsRingProgress`, `#dealHours`, `#dealMins`, `#dealSecs`, `#dealsSpotlightCard`, `#spotlightMainImg`, `#spotlightTitle`, `#dealsTrackWrap`, `#dealsMotionTrack`, `#dealsPrevBtn`, `#dealsNextBtn`.

- [ ] **Step 1: Replace legacy Today's Deals HTML with the Atelier Spotlight & Motion Rail markup**

```html
    <!-- TODAY'S DEALS (FLASH SALE & COUNTDOWN - ATELIER REDESIGN) -->
    <section class="home-deals-section reveal-on-scroll" id="todaysDealsSection" aria-label="Today's Curated Offers">
      <div class="deals-ambient-mesh" aria-hidden="true"></div>

      <div class="container deals-container">
        <!-- 1. Header & Scarcity Control Bar -->
        <div class="deals-masthead-row">
          <div class="deals-title-group">
            <div class="deals-status-pill">
              <span class="deals-pulse-beacon"></span>
              <span class="deals-status-text">LIMITED ALLOCATIONS · TIER 1 ARCHIVE</span>
            </div>
            <h2 class="deals-headline">Today's Curated Offers</h2>
            <p class="deals-subtitle">Rare price adjustments on foundational wardrobe and lifestyle pieces.</p>
          </div>

          <div class="deals-controls-dock">
            <!-- Category Look Switcher Dock -->
            <nav class="deals-category-nav" role="tablist" aria-label="Filter Deals by Category">
              <div class="deals-nav-slider-pill" id="dealsNavSliderPill" aria-hidden="true"></div>
              <button class="deals-category-tab is-active" data-category="all" role="tab" aria-selected="true">All Offers</button>
              <button class="deals-category-tab" data-category="apparel" role="tab" aria-selected="false">Apparel</button>
              <button class="deals-category-tab" data-category="footwear" role="tab" aria-selected="false">Footwear</button>
              <button class="deals-category-tab" data-category="accessories" role="tab" aria-selected="false">Timepieces & Tech</button>
            </nav>

            <!-- Live Countdown Widget with SVG Circular Progress Ring -->
            <div class="deals-countdown-badge" aria-label="Offer Closes In" role="timer" aria-live="polite">
              <div class="deals-ring-wrap">
                <svg class="deals-timer-svg" viewBox="0 0 36 36" aria-hidden="true">
                  <circle class="deals-ring-track" cx="18" cy="18" r="15.5"></circle>
                  <circle class="deals-ring-progress" id="dealsRingProgress" cx="18" cy="18" r="15.5"></circle>
                </svg>
                <i data-lucide="clock" class="deals-clock-icon"></i>
              </div>
              <div class="deals-timer-content">
                <span class="deals-timer-label">CLOSES IN</span>
                <div class="deals-timer-digits">
                  <span class="deals-timer-digit" id="dealHours">04</span><span class="deals-timer-sep">h</span>
                  <span class="deals-timer-digit" id="dealMins">32</span><span class="deals-timer-sep">m</span>
                  <span class="deals-timer-digit" id="dealSecs">15</span><span class="deals-timer-sep">s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 2. The Atelier Canvas (Spotlight + Motion Rail) -->
        <div class="deals-canvas-layout">
          <!-- Left Column: The Spotlight Atelier Card (42%) -->
          <div class="deals-spotlight-col">
            <div class="deals-spotlight-card" id="dealsSpotlightCard" data-id="p1" data-cat="apparel">
              <div class="deal-card-glare" aria-hidden="true"></div>
              <div class="deals-spotlight-ambient-glow" aria-hidden="true"></div>

              <!-- Top Spatial Bar: Badge & Wishlist -->
              <div class="deals-spotlight-topbar">
                <span class="deals-allocation-tag">-20% ARCHIVE ALLOCATION</span>
                <button class="deal-wishlist-btn" aria-label="Save Merino Knit Sweater to Wishlist">
                  <i data-lucide="heart"></i>
                </button>
              </div>

              <!-- Hero Image Showcase with Colorway Swatches -->
              <div class="deals-spotlight-visual">
                <img src="assets/images/products/hero_sweater.png" alt="Merino Knit Sweater in Heather Charcoal" class="deals-spotlight-img" id="spotlightMainImg" loading="lazy" />
                
                <!-- Live Material / Colorway Swatches -->
                <div class="deals-swatch-dock" aria-label="Select Colorway">
                  <button class="deals-swatch-btn is-active" data-color="charcoal" data-img="assets/images/products/hero_sweater.png" data-name="Merino Knit Sweater · Charcoal" aria-label="Heather Charcoal" title="Heather Charcoal">
                    <span class="deals-swatch-color" style="background: #374151;"></span>
                  </button>
                  <button class="deals-swatch-btn" data-color="onyx" data-img="assets/images/products/plp_blazer.png" data-name="Merino Knit Sweater · Onyx Black" aria-label="Onyx Black" title="Onyx Black">
                    <span class="deals-swatch-color" style="background: #111827;"></span>
                  </button>
                  <button class="deals-swatch-btn" data-color="camel" data-img="assets/images/products/hero_sweater.png" data-name="Merino Knit Sweater · Camel" aria-label="Camel Cashmere" title="Camel Cashmere">
                    <span class="deals-swatch-color" style="background: #B45309;"></span>
                  </button>
                </div>
              </div>

              <!-- Bottom Editorial & Pricing Meta -->
              <div class="deals-spotlight-info">
                <div class="deals-meta-header">
                  <span class="deals-category-tag">APPAREL · 100% EXTRAFINE MERINO</span>
                  <div class="deals-rating-badge">
                    <i data-lucide="star" class="deals-star-icon"></i>
                    <span>4.9</span>
                    <span class="deals-review-count">(128)</span>
                  </div>
                </div>

                <h3 class="deals-spotlight-title" id="spotlightTitle">Merino Knit Sweater</h3>
                <p class="deals-spotlight-desc">Spun from ultra-fine Italian merino wool with a relaxed silhouette and refined ribbed trim.</p>

                <!-- Allocation Scarcity Urgency Meter -->
                <div class="deals-allocation-meter-wrap">
                  <div class="deals-meter-header">
                    <span class="deals-meter-label">Allocation Status</span>
                    <span class="deals-meter-val">Only 3 pieces remaining</span>
                  </div>
                  <div class="deals-meter-track">
                    <div class="deals-meter-fill" style="transform: scaleX(0.78);"></div>
                  </div>
                </div>

                <!-- Price & Dual Conversion CTAs -->
                <div class="deals-spotlight-actionbar">
                  <div class="deals-price-stack">
                    <span class="deals-price-current">BDT 1,990</span>
                    <span class="deals-price-original">BDT 2,490</span>
                    <span class="deals-savings-pill">Save BDT 500</span>
                  </div>

                  <div class="deals-cta-group">
                    <button class="deals-quick-add-btn" data-id="p1" data-name="Merino Knit Sweater" data-price="1990" data-img="assets/images/products/hero_sweater.png" data-cat="Apparel">
                      <i data-lucide="plus" class="deals-add-icon"></i>
                      <span>Quick Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column: Curated Motion Rail (58%) -->
          <div class="deals-rail-col">
            <div class="deals-rail-header">
              <span class="deals-rail-label">Curated Queue (<span id="railCount">4</span>)</span>
              <div class="deals-nav-arrows">
                <button class="deals-arrow-btn deals-arrow-prev" id="dealsPrevBtn" aria-label="Previous Deal">
                  <i data-lucide="chevron-left"></i>
                </button>
                <button class="deals-arrow-btn deals-arrow-next" id="dealsNextBtn" aria-label="Next Deal">
                  <i data-lucide="chevron-right"></i>
                </button>
              </div>
            </div>

            <div class="deals-motion-track-wrap" id="dealsTrackWrap">
              <div class="deals-motion-track" id="dealsMotionTrack">
                <!-- Card 1: Minimal Runner -->
                <div class="deal-rail-card" data-id="p6" data-cat="footwear">
                  <div class="deal-card-glare" aria-hidden="true"></div>
                  <span class="deal-badge">-25%</span>
                  <button class="deal-wishlist-btn" aria-label="Save Minimal Runner to Wishlist">
                    <i data-lucide="heart"></i>
                  </button>
                  <div class="deal-rail-imgbox">
                    <img src="assets/images/products/prod_runner.png" alt="Minimal Runner" loading="lazy" />
                    <button class="deal-rail-quickadd" data-id="p6" data-name="Minimal Runner" data-price="5990" data-img="assets/images/products/prod_runner.png" data-cat="Footwear">
                      <i data-lucide="plus"></i> <span>Quick Add</span>
                    </button>
                  </div>
                  <div class="deal-rail-body">
                    <span class="deal-rail-cat">FOOTWEAR</span>
                    <h4 class="deal-rail-title">Minimal Runner</h4>
                    <div class="deal-rail-pricing">
                      <span class="deal-rail-current">BDT 5,990</span>
                      <span class="deal-rail-original">BDT 7,990</span>
                    </div>
                  </div>
                </div>

                <!-- Card 2: Classic Leather Watch -->
                <div class="deal-rail-card" data-id="p5" data-cat="accessories">
                  <div class="deal-card-glare" aria-hidden="true"></div>
                  <span class="deal-badge">-15%</span>
                  <button class="deal-wishlist-btn" aria-label="Save Classic Leather Watch to Wishlist">
                    <i data-lucide="heart"></i>
                  </button>
                  <div class="deal-rail-imgbox">
                    <img src="assets/images/products/search_watch.png" alt="Classic Leather Watch" loading="lazy" />
                    <button class="deal-rail-quickadd" data-id="p5" data-name="Classic Leather Watch" data-price="3380" data-img="assets/images/products/search_watch.png" data-cat="Accessories">
                      <i data-lucide="plus"></i> <span>Quick Add</span>
                    </button>
                  </div>
                  <div class="deal-rail-body">
                    <span class="deal-rail-cat">ACCESSORIES</span>
                    <h4 class="deal-rail-title">Classic Leather Watch</h4>
                    <div class="deal-rail-pricing">
                      <span class="deal-rail-current">BDT 3,380</span>
                      <span class="deal-rail-original">BDT 3,980</span>
                    </div>
                  </div>
                </div>

                <!-- Card 3: Tailored Wool Blazer -->
                <div class="deal-rail-card" data-id="p2" data-cat="apparel">
                  <div class="deal-card-glare" aria-hidden="true"></div>
                  <span class="deal-badge">-30%</span>
                  <button class="deal-wishlist-btn" aria-label="Save Tailored Wool Blazer to Wishlist">
                    <i data-lucide="heart"></i>
                  </button>
                  <div class="deal-rail-imgbox">
                    <img src="assets/images/products/plp_blazer.png" alt="Tailored Wool Blazer" loading="lazy" />
                    <button class="deal-rail-quickadd" data-id="p2" data-name="Tailored Wool Blazer" data-price="8450" data-img="assets/images/products/plp_blazer.png" data-cat="Apparel">
                      <i data-lucide="plus"></i> <span>Quick Add</span>
                    </button>
                  </div>
                  <div class="deal-rail-body">
                    <span class="deal-rail-cat">APPAREL</span>
                    <h4 class="deal-rail-title">Tailored Wool Blazer</h4>
                    <div class="deal-rail-pricing">
                      <span class="deal-rail-current">BDT 8,450</span>
                      <span class="deal-rail-original">BDT 12,000</span>
                    </div>
                  </div>
                </div>

                <!-- Card 4: Noise Canceling Earbuds -->
                <div class="deal-rail-card" data-id="p8" data-cat="accessories">
                  <div class="deal-card-glare" aria-hidden="true"></div>
                  <span class="deal-badge">-30%</span>
                  <button class="deal-wishlist-btn" aria-label="Save Noise Canceling Earbuds to Wishlist">
                    <i data-lucide="heart"></i>
                  </button>
                  <div class="deal-rail-imgbox">
                    <img src="assets/images/products/search_earbuds.png" alt="Noise Canceling Earbuds" loading="lazy" />
                    <button class="deal-rail-quickadd" data-id="p8" data-name="Noise Canceling Earbuds" data-price="3390" data-img="assets/images/products/search_earbuds.png" data-cat="Electronics">
                      <i data-lucide="plus"></i> <span>Quick Add</span>
                    </button>
                  </div>
                  <div class="deal-rail-body">
                    <span class="deal-rail-cat">ELECTRONICS</span>
                    <h4 class="deal-rail-title">Noise Canceling Earbuds</h4>
                    <div class="deal-rail-pricing">
                      <span class="deal-rail-current">BDT 3,390</span>
                      <span class="deal-rail-original">BDT 4,890</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Commit markup update**
```bash
git add index.html
git commit -m "feat(deals): integrate Atelier Spotlight & Motion Rail HTML structure"
```

---

### Task 2: Implement Modern CSS Design Tokens & Motion Rules in `css/design-system.css`

**Files:**
- Modify: `c:/Users/BS1572/OneDrive - Brain Station 23/Documents/nexcomarch/css/design-system.css:8001-8335`

**Interfaces:**
- Consumes: Theme CSS variables (`--font-display`, `--font-body`, `--accent-cyan`, `--text-muted`, `--text-secondary`).
- Produces: Scoped styles and keyframes for `.home-deals-section`, `.deals-spotlight-card`, `.deal-rail-card`, `.deals-nav-slider-pill`, `.deals-ring-progress`, `.deal-card-glare`, `.deal-ripple-circle`.

- [ ] **Step 1: Replace legacy deals CSS with the elevated Luxury Atelier styles and keyframes**

```css
/* ==========================================================================
   TODAY'S DEALS (LUXURY ATELIER & MOTION RAIL REDESIGN)
   ========================================================================== */
.home-deals-section {
  padding: 88px 0 96px;
  background: radial-gradient(circle at 50% 0%, rgba(3, 27, 62, 0.4) 0%, rgba(0, 14, 34, 0.95) 100%), #010E24;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  position: relative;
  overflow: hidden;
}

.deals-ambient-mesh {
  position: absolute;
  top: -20%;
  left: 20%;
  width: 60%;
  height: 140%;
  background: radial-gradient(ellipse at center, rgba(0, 200, 255, 0.04) 0%, rgba(168, 85, 247, 0.02) 50%, transparent 70%);
  pointer-events: none;
  filter: blur(60px);
  z-index: 0;
  will-change: transform;
}

.deals-container {
  position: relative;
  z-index: 1;
}

/* 1. Masthead & Controls Bar */
.deals-masthead-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 28px;
  margin-bottom: 40px;
  flex-wrap: wrap;
}

.deals-title-group {
  max-width: 520px;
}

.deals-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(0, 200, 255, 0.06);
  border: 1px solid rgba(0, 200, 255, 0.22);
  border-radius: 9999px;
  padding: 4px 12px;
  margin-bottom: 10px;
}

.deals-pulse-beacon {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #F43F5E;
  box-shadow: 0 0 10px rgba(244, 63, 94, 0.9);
  animation: beaconPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes beaconPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.4); opacity: 0.5; }
}

.deals-status-text {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent-cyan);
  text-transform: uppercase;
}

.deals-headline {
  font-family: var(--font-display);
  font-size: clamp(26px, 3.2vw, 36px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  line-height: 1.15;
  margin: 0 0 8px;
}

.deals-subtitle {
  font-family: var(--font-body);
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.deals-controls-dock {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

/* Category Look Switcher Dock */
.deals-category-nav {
  position: relative;
  display: inline-flex;
  align-items: center;
  background: rgba(10, 28, 58, 0.65);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 4px;
  border-radius: 9999px;
}

.deals-nav-slider-pill {
  position: absolute;
  top: 4px;
  left: 0;
  height: calc(100% - 8px);
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
  pointer-events: none;
  transition: transform 380ms cubic-bezier(0.23, 1, 0.32, 1), width 380ms cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform, width;
}

.deals-category-tab {
  position: relative;
  z-index: 1;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.04em;
  padding: 6px 14px;
  border-radius: 9999px;
  cursor: pointer;
  transition: color 200ms ease;
  white-space: nowrap;
}

.deals-category-tab.is-active {
  color: #FFFFFF;
  font-weight: 700;
}

.deals-category-tab:hover {
  color: #FFFFFF;
}

/* Live Countdown Ring Widget */
.deals-countdown-badge {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  background: rgba(8, 24, 52, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  padding: 6px 16px 6px 10px;
  border-radius: 9999px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.deals-ring-wrap {
  position: relative;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.deals-timer-svg {
  width: 32px;
  height: 32px;
  transform: rotate(-90deg);
}

.deals-ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 2.8;
}

.deals-ring-progress {
  fill: none;
  stroke: var(--accent-cyan);
  stroke-width: 2.8;
  stroke-linecap: round;
  stroke-dasharray: 97.4;
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 1s linear;
}

.deals-clock-icon {
  position: absolute;
  width: 12px;
  height: 12px;
  color: var(--accent-cyan);
}

.deals-timer-content {
  display: flex;
  flex-direction: column;
}

.deals-timer-label {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.deals-timer-digits {
  display: inline-flex;
  align-items: baseline;
  gap: 2px;
}

.deals-timer-digit {
  font-family: var(--font-display);
  font-size: 13px;
  font-weight: 700;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
  min-width: 16px;
  text-align: center;
}

.deals-timer-sep {
  font-size: 10px;
  font-weight: 600;
  color: var(--accent-cyan);
  margin-right: 2px;
}

/* 2. The Atelier Canvas Grid */
.deals-canvas-layout {
  display: grid;
  grid-template-columns: 42% calc(58% - 24px);
  gap: 24px;
  align-items: stretch;
}

/* Specular Glare Layer (Used on all 3D cards) */
.deal-card-glare {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle 300px at var(--glare-x, 50%) var(--glare-y, 50%), rgba(255, 255, 255, var(--glare-opacity, 0)) 0%, transparent 80%);
  pointer-events: none;
  z-index: 4;
  mix-blend-mode: overlay;
  border-radius: inherit;
  transition: opacity 300ms ease;
}

/* Left Column: Spotlight Atelier Card */
.deals-spotlight-col {
  perspective: 1200px;
  will-change: transform;
}

.deals-spotlight-card {
  position: relative;
  background: linear-gradient(180deg, rgba(12, 34, 68, 0.7) 0%, rgba(4, 18, 42, 0.85) 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.05);
  transform-style: preserve-3d;
  transition: border-color 300ms ease, box-shadow 300ms ease;
  cursor: pointer;
}

.deals-spotlight-card:hover {
  border-color: rgba(255, 255, 255, 0.28);
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.55), 0 0 30px rgba(0, 200, 255, 0.08);
}

.deals-spotlight-ambient-glow {
  position: absolute;
  top: 10%;
  left: 10%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle at center, rgba(0, 200, 255, 0.08) 0%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  z-index: 0;
  transition: opacity 400ms ease;
}

.deals-spotlight-topbar {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  transform: translateZ(40px);
}

.deals-allocation-tag {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.4);
  color: #FDA4AF;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
  padding: 4px 10px;
  border-radius: 6px;
}

.deal-wishlist-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(8, 24, 52, 0.8);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-secondary);
  cursor: pointer;
  transition: transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1), color 180ms ease, background 180ms ease, border-color 180ms ease;
}

.deal-wishlist-btn i {
  width: 16px;
  height: 16px;
}

.deal-wishlist-btn:hover {
  transform: scale(1.15);
  color: #FFFFFF;
  background: rgba(12, 36, 76, 0.95);
  border-color: rgba(255, 255, 255, 0.35);
}

.deal-wishlist-btn.active {
  color: #F43F5E;
  background: rgba(244, 63, 94, 0.18);
  border-color: #F43F5E;
}

.deal-wishlist-btn.active i {
  fill: #F43F5E;
}

/* Visual Canvas & Swatch Dock */
.deals-spotlight-visual {
  position: relative;
  z-index: 2;
  width: 100%;
  aspect-ratio: 4 / 3.2;
  border-radius: 12px;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.25) 100%);
  margin-bottom: 20px;
  transform: translateZ(25px);
}

.deals-spotlight-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 600ms cubic-bezier(0.23, 1, 0.32, 1), opacity 220ms ease;
  will-change: transform, opacity;
}

.deals-spotlight-card:hover .deals-spotlight-img {
  transform: scale(1.05);
}

.deals-swatch-dock {
  position: absolute;
  bottom: 12px;
  left: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(6, 18, 38, 0.75);
  backdrop-filter: blur(10px);
  padding: 4px 8px;
  border-radius: 9999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  z-index: 3;
}

.deals-swatch-btn {
  background: transparent;
  border: none;
  padding: 2px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 180ms ease;
}

.deals-swatch-btn:hover {
  transform: scale(1.15);
}

.deals-swatch-btn.is-active .deals-swatch-color {
  box-shadow: 0 0 0 2px #FFFFFF;
}

.deals-swatch-color {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: block;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: box-shadow 180ms ease;
}

/* Spotlight Info Body */
.deals-spotlight-info {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  flex: 1;
  transform: translateZ(30px);
}

.deals-meta-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.deals-category-tag {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.deals-rating-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: #FBBF24;
}

.deals-star-icon {
  width: 12px;
  height: 12px;
  fill: #FBBF24;
  stroke: none;
}

.deals-review-count {
  color: var(--text-muted);
  font-weight: 400;
}

.deals-spotlight-title {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0 0 6px;
  line-height: 1.25;
}

.deals-spotlight-desc {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--text-secondary);
  line-height: 1.45;
  margin: 0 0 16px;
}

/* Allocation Urgency Bar */
.deals-allocation-meter-wrap {
  margin-bottom: 18px;
  background: rgba(4, 18, 42, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 8px;
  padding: 10px 12px;
}

.deals-meter-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 6px;
}

.deals-meter-label {
  color: var(--text-muted);
  font-weight: 600;
}

.deals-meter-val {
  color: #FDA4AF;
  font-weight: 700;
}

.deals-meter-track {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 9999px;
  overflow: hidden;
}

.deals-meter-fill {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #F43F5E 0%, #FB7185 100%);
  border-radius: 9999px;
  transform-origin: left center;
  will-change: transform;
}

/* Spotlight Price & CTA */
.deals-spotlight-actionbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-top: auto;
  padding-top: 14px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.deals-price-stack {
  display: flex;
  align-items: baseline;
  gap: 8px;
  flex-wrap: wrap;
}

.deals-price-current {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 700;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
}

.deals-price-original {
  font-size: 13px;
  color: var(--text-muted);
  text-decoration: line-through;
  font-variant-numeric: tabular-nums;
}

.deals-savings-pill {
  background: rgba(16, 185, 129, 0.15);
  color: #34D399;
  border: 1px solid rgba(16, 185, 129, 0.35);
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.deals-quick-add-btn {
  position: relative;
  overflow: hidden;
  height: 42px;
  padding: 0 20px;
  background: #FFFFFF;
  color: #011C3D;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  transition: transform 180ms ease, background 180ms ease, box-shadow 180ms ease;
  white-space: nowrap;
}

.deals-quick-add-btn:hover {
  background: #F8FAFC;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(255, 255, 255, 0.3);
}

.deals-quick-add-btn:active {
  transform: scale(0.96);
}

/* Tactile Ripple Element */
.deal-ripple-circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(0, 200, 255, 0.35);
  transform: scale(0);
  animation: dealRipple 600ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
  pointer-events: none;
}

@keyframes dealRipple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}

/* Right Column: Curated Motion Rail */
.deals-rail-col {
  display: flex;
  flex-direction: column;
  min-width: 0;
  perspective: 1200px;
}

.deals-rail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.deals-rail-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  color: var(--text-muted);
  text-transform: uppercase;
}

.deals-nav-arrows {
  display: flex;
  align-items: center;
  gap: 8px;
}

.deals-arrow-btn {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(10, 28, 58, 0.65);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #FFFFFF;
  cursor: pointer;
  transition: transform 180ms ease, background 180ms ease, border-color 180ms ease;
}

.deals-arrow-btn i {
  width: 16px;
  height: 16px;
}

.deals-arrow-btn:hover {
  transform: scale(1.1);
  background: rgba(14, 40, 80, 0.9);
  border-color: rgba(255, 255, 255, 0.35);
}

.deals-motion-track-wrap {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  border-radius: 16px;
  padding: 4px 2px 16px;
}

.deals-motion-track-wrap::-webkit-scrollbar {
  display: none;
}

.deals-motion-track {
  display: grid;
  grid-template-columns: repeat(4, 260px);
  gap: 16px;
  will-change: transform;
}

/* Individual Rail Card */
.deal-rail-card {
  position: relative;
  background: linear-gradient(180deg, rgba(12, 34, 68, 0.5) 0%, rgba(4, 18, 42, 0.7) 100%);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  transform-style: preserve-3d;
  transition: transform 320ms cubic-bezier(0.23, 1, 0.32, 1), border-color 300ms ease, box-shadow 300ms ease, opacity 250ms ease;
  cursor: pointer;
  will-change: transform;
}

.deal-rail-card.is-hidden {
  display: none;
}

.deal-rail-card:hover {
  border-color: rgba(255, 255, 255, 0.24);
  box-shadow: 0 20px 44px rgba(0, 0, 0, 0.45), 0 0 24px rgba(0, 200, 255, 0.08);
}

.deal-rail-imgbox {
  width: 100%;
  aspect-ratio: 4 / 4.2;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 0%, rgba(0, 0, 0, 0.2) 100%);
  transform: translateZ(20px);
}

.deal-rail-imgbox img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  transition: transform 500ms cubic-bezier(0.23, 1, 0.32, 1);
}

.deal-rail-card:hover .deal-rail-imgbox img {
  transform: scale(1.06);
}

.deal-rail-quickadd {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  height: 36px;
  background: rgba(255, 255, 255, 0.95);
  color: #011C3D;
  border-radius: 6px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 220ms ease, transform 220ms cubic-bezier(0.23, 1, 0.32, 1), background 180ms ease;
  z-index: 3;
}

.deal-rail-quickadd i {
  width: 13px;
  height: 13px;
}

.deal-rail-card:hover .deal-rail-quickadd,
.deal-rail-card:focus-within .deal-rail-quickadd {
  opacity: 1;
  transform: translateY(0);
}

.deal-rail-quickadd:hover {
  background: #FFFFFF;
}

.deal-rail-body {
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  flex: 1;
  transform: translateZ(25px);
}

.deal-rail-cat {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 4px;
}

.deal-rail-title {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0 0 8px;
}

.deal-rail-pricing {
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-top: auto;
}

.deal-rail-current {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: 700;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
}

.deal-rail-original {
  font-size: 11px;
  color: var(--text-muted);
  text-decoration: line-through;
  font-variant-numeric: tabular-nums;
}

/* ==========================================================================
   RESPONSIVE BREAKPOINTS FOR DEALS ATELIER
   ========================================================================== */
@media (max-width: 1150px) {
  .deals-canvas-layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .deals-spotlight-visual {
    aspect-ratio: 16 / 9;
  }
  .deals-motion-track {
    grid-template-columns: repeat(4, 240px);
  }
}

@media (max-width: 768px) {
  .home-deals-section {
    padding: 60px 0 68px;
  }
  .deals-masthead-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
  }
  .deals-controls-dock {
    width: 100%;
    justify-content: space-between;
  }
  .deals-category-nav {
    overflow-x: auto;
    max-width: 100%;
  }
  .deals-spotlight-visual {
    aspect-ratio: 4 / 3;
  }
  .deals-rail-quickadd {
    opacity: 1;
    transform: none;
  }
  .deals-motion-track {
    grid-template-columns: repeat(4, 220px);
    gap: 12px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .deals-spotlight-card,
  .deal-rail-card,
  .deals-spotlight-col,
  .deals-rail-col {
    transform: none !important;
    transition: none !important;
  }
  .deals-pulse-beacon {
    animation: none;
  }
}
```

- [ ] **Step 2: Commit CSS design system update**
```bash
git add css/design-system.css
git commit -m "style(deals): add luxury tokens, 3D perspective, and motion keyframes"
```

---

### Task 3: Implement All 4 Motion Standards in `js/home.js`

**Files:**
- Modify: `c:/Users/BS1572/OneDrive - Brain Station 23/Documents/nexcomarch/js/home.js:470-586`

**Interfaces:**
- Consumes: `#dealsRingProgress`, `#dealHours`, `#dealMins`, `#dealSecs`, `.deals-category-tab`, `.deals-swatch-btn`, `.deal-wishlist-btn`, `.deals-quick-add-btn`, `.deal-rail-quickadd`, `#dealsSpotlightCard`, `.deal-rail-card`, `#dealsTrackWrap`, `#dealsPrevBtn`, `#dealsNextBtn`, `window.nexCart`, `window.showToast`.
- Produces: Integrated 120fps physics loop, 3D tilt engine with velocity recoil, category indicator slider, and differential scroll parallax.

- [ ] **Step 1: Replace legacy deals JS with the Master 4-Standard Motion Engine**

```javascript
/**
 * 1c. Today's Deals Master Motion Engine (All 4 Motion Standards)
 */
function initDealsMasterEngine() {
  const dealsSection = document.getElementById('todaysDealsSection');
  if (!dealsSection) return;

  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -----------------------------------------------------------------
  // 1️⃣ Micro-interaction: 120fps SVG Circular Progress Ring & Tabular Countdown
  // -----------------------------------------------------------------
  const TOTAL_DEAL_SECONDS = 24 * 3600; // 24-hour cycle
  let secondsRemaining = (4 * 3600) + (32 * 60) + 15;
  const CIRCUMFERENCE = 2 * Math.PI * 15.5; // ~97.389

  const ringProgress = document.getElementById('dealsRingProgress');
  const hoursEl = document.getElementById('dealHours');
  const minsEl = document.getElementById('dealMins');
  const secsEl = document.getElementById('dealSecs');

  function updateDealsTimer() {
    if (secondsRemaining <= 0) {
      secondsRemaining = TOTAL_DEAL_SECONDS;
    }

    const h = Math.floor(secondsRemaining / 3600);
    const m = Math.floor((secondsRemaining % 3600) / 60);
    const s = secondsRemaining % 60;

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');

    if (ringProgress) {
      const fraction = secondsRemaining / TOTAL_DEAL_SECONDS;
      const offset = CIRCUMFERENCE * (1 - fraction);
      ringProgress.style.strokeDashoffset = offset.toFixed(2);
    }

    secondsRemaining--;
  }

  updateDealsTimer();
  setInterval(updateDealsTimer, 1000);

  // -----------------------------------------------------------------
  // 1️⃣ Micro-interaction: Category Look Switcher with Sliding GPU Pill
  // -----------------------------------------------------------------
  const categoryTabs = dealsSection.querySelectorAll('.deals-category-tab');
  const sliderPill = document.getElementById('dealsNavSliderPill');
  const railCards = dealsSection.querySelectorAll('.deal-rail-card');
  const railCountEl = document.getElementById('railCount');

  function updateSliderPill(activeTab) {
    if (!sliderPill || !activeTab) return;
    sliderPill.style.width = `${activeTab.offsetWidth}px`;
    sliderPill.style.transform = `translate3d(${activeTab.offsetLeft}px, 0, 0)`;
  }

  const initialActiveTab = dealsSection.querySelector('.deals-category-tab.is-active');
  if (initialActiveTab) {
    setTimeout(() => updateSliderPill(initialActiveTab), 50);
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      categoryTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      updateSliderPill(tab);

      const cat = tab.getAttribute('data-category');
      let visibleCount = 0;

      railCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.classList.remove('is-hidden');
          card.style.opacity = '1';
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
          card.style.opacity = '0';
        }
      });

      if (railCountEl) railCountEl.textContent = String(visibleCount);
    });
  });

  // -----------------------------------------------------------------
  // 1️⃣ Micro-interaction: Spotlight Colorway Swatches Live Cross-Fade
  // -----------------------------------------------------------------
  const swatchBtns = dealsSection.querySelectorAll('.deals-swatch-btn');
  const spotlightImg = document.getElementById('spotlightMainImg');
  const spotlightTitle = document.getElementById('spotlightTitle');

  swatchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      swatchBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const newImg = btn.getAttribute('data-img');
      const newName = btn.getAttribute('data-name');

      if (spotlightImg && newImg) {
        spotlightImg.style.opacity = '0.4';
        setTimeout(() => {
          spotlightImg.src = newImg;
          spotlightImg.style.opacity = '1';
        }, 120);
      }
      if (spotlightTitle && newName) {
        spotlightTitle.textContent = newName;
      }
    });
  });

  // -----------------------------------------------------------------
  // 1️⃣ Micro-interaction: Tactile Quick-Add Ripple & Header Cart Pulse
  // -----------------------------------------------------------------
  function triggerQuickAdd(btn, e) {
    e.preventDefault();
    e.stopPropagation();

    // Spawn localized ripple
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'deal-ripple-circle';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);

    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    const price = parseInt(btn.getAttribute('data-price'), 10) || 0;
    const img = btn.getAttribute('data-img');
    const cat = btn.getAttribute('data-cat') || 'Apparel';

    if (window.nexCart && typeof window.nexCart.addItem === 'function') {
      window.nexCart.addItem({
        id: id,
        name: name,
        size: 'M',
        price: price,
        qty: 1,
        image: img,
        category: cat
      });
    }

    if (typeof window.showToast === 'function') {
      window.showToast(`Added ${name} to your bag`);
    }

    // Button feedback state
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i> <span>Added</span>';
    btn.style.background = '#10B981';
    btn.style.color = '#FFFFFF';
    btn.style.transform = 'scale(1.05)';
    if (window.lucide) window.lucide.createIcons();

    // Pulse header bag badge
    const bagBadge = document.getElementById('headerCartCount');
    if (bagBadge) {
      bagBadge.style.transform = 'scale(1.35)';
      setTimeout(() => { bagBadge.style.transform = 'scale(1)'; }, 250);
    }

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.transform = '';
      if (window.lucide) window.lucide.createIcons();
    }, 1400);
  }

  dealsSection.querySelectorAll('.deals-quick-add-btn, .deal-rail-quickadd').forEach(btn => {
    btn.addEventListener('click', (e) => triggerQuickAdd(btn, e));
  });

  // -----------------------------------------------------------------
  // 2️⃣ 3D Spatial Tilt Physics & Dynamic Specular Glare
  // -----------------------------------------------------------------
  const interactiveCards = dealsSection.querySelectorAll('.deals-spotlight-card, .deal-rail-card');

  interactiveCards.forEach(card => {
    if (!isDesktopPointer || isReducedMotion) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let isHovered = false;
    let rafId = null;

    function renderTilt() {
      curRotX += (targetRotX - curRotX) * 0.12;
      curRotY += (targetRotY - curRotY) * 0.12;

      card.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) translateZ(0)`;

      if (isHovered || Math.abs(curRotX) > 0.05 || Math.abs(curRotY) > 0.05) {
        rafId = requestAnimationFrame(renderTilt);
      } else {
        card.style.transform = '';
      }
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotX = -y * 10; // Max 10 deg pitch
      targetRotY = x * 12;  // Max 12 deg yaw

      // Update specular glare coordinates
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
      card.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);
      card.style.setProperty('--glare-opacity', '0.22');

      if (!isHovered) {
        isHovered = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(renderTilt);
      }
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRotX = 0;
      targetRotY = 0;
      card.style.setProperty('--glare-opacity', '0');
    });
  });

  // -----------------------------------------------------------------
  // 3️⃣ Seamless GPU Cross-Dissolve Page Transitions
  // -----------------------------------------------------------------
  const transitionCurtain = document.getElementById('pageTransitionOverlay');

  function navigateToPdp(id) {
    const targetUrl = `pages/product.html?id=${encodeURIComponent(id || 'p1')}`;
    if (transitionCurtain) {
      transitionCurtain.classList.add('is-active');
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 220);
    } else {
      window.location.href = targetUrl;
    }
  }

  interactiveCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.deals-quick-add-btn') || 
          e.target.closest('.deal-rail-quickadd') || 
          e.target.closest('.deal-wishlist-btn') || 
          e.target.closest('.deals-swatch-btn')) {
        return;
      }
      const id = card.getAttribute('data-id') || 'p1';
      navigateToPdp(id);
    });

    // Keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.deals-quick-add-btn') || 
            e.target.closest('.deal-rail-quickadd') || 
            e.target.closest('.deal-wishlist-btn') || 
            e.target.closest('.deals-swatch-btn')) {
          return;
        }
        e.preventDefault();
        const id = card.getAttribute('data-id') || 'p1';
        navigateToPdp(id);
      }
    });
  });

  // Wishlist clicks
  const WISHLIST_KEY = 'nex_curated_wishlist_ids';
  let savedWishlist = [];
  try {
    savedWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch (e) {
    savedWishlist = [];
  }

  dealsSection.querySelectorAll('.deal-wishlist-btn').forEach(btn => {
    const card = btn.closest('[data-id]');
    const id = card ? card.getAttribute('data-id') : null;
    if (id && savedWishlist.includes(id)) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      if (id) {
        try {
          let list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
          if (isActive && !list.includes(id)) {
            list.push(id);
          } else if (!isActive) {
            list = list.filter(item => item !== id);
          }
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
        } catch (e) {}
      }
      if (window.nexUpdateWishlistBadge) window.nexUpdateWishlistBadge();
    });
  });

  // -----------------------------------------------------------------
  // 4️⃣ Scroll Parallax with Differential Column Depth
  // -----------------------------------------------------------------
  const spotlightCol = dealsSection.querySelector('.deals-spotlight-col');
  const ambientMesh = dealsSection.querySelector('.deals-ambient-mesh');
  let targetScroll = window.scrollY || 0;
  let currentScroll = targetScroll;
  let isSectionInView = true;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isSectionInView = entry.isIntersecting;
    });
  }, { rootMargin: '150px 0px' });

  sectionObserver.observe(dealsSection);

  window.addEventListener('scroll', () => {
    targetScroll = window.scrollY || 0;
  }, { passive: true });

  function updateDealsParallax() {
    if (!isReducedMotion && isSectionInView && spotlightCol) {
      currentScroll += (targetScroll - currentScroll) * 0.10;
      const rect = dealsSection.getBoundingClientRect();
      const relativeY = -rect.top;

      // Spotlight Column differential 0.14x lag
      const spotOffset = relativeY * 0.08;
      spotlightCol.style.transform = `translate3d(0, ${spotOffset.toFixed(1)}px, 0)`;

      // Rail Cards differential lag (staggered odd vs even)
      railCards.forEach((rc, i) => {
        const factor = (i % 2 === 0) ? 0.04 : 0.09;
        const rcOffset = relativeY * factor;
        rc.style.transform = `translate3d(0, ${rcOffset.toFixed(1)}px, 0)`;
      });

      // Ambient Mesh differential drift
      if (ambientMesh) {
        const meshOffset = relativeY * 0.18;
        ambientMesh.style.transform = `translate3d(0, ${meshOffset.toFixed(1)}px, 0)`;
      }
    }
    requestAnimationFrame(updateDealsParallax);
  }

  requestAnimationFrame(updateDealsParallax);

  // -----------------------------------------------------------------
  // Rail Carousel Navigation (Prev / Next Buttons & Drag)
  // -----------------------------------------------------------------
  const trackWrap = document.getElementById('dealsTrackWrap');
  const prevBtn = document.getElementById('dealsPrevBtn');
  const nextBtn = document.getElementById('dealsNextBtn');

  if (trackWrap && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      trackWrap.scrollBy({ left: -280, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      trackWrap.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
```

- [ ] **Step 2: Connect `initDealsMasterEngine()` in DOMContentLoaded**

Replace legacy `initDealsCountdown()` and `initDealsCards()` calls inside `document.addEventListener('DOMContentLoaded', ...)` with `initDealsMasterEngine()`.

- [ ] **Step 3: Commit JavaScript engine update**
```bash
git add js/home.js
git commit -m "feat(deals): implement 4-standard master motion engine in home.js"
```

---

### Task 4: Visual & Interactive Verification in Browser

**Files:**
- Test in Live Browser: `http://localhost:3000/index.html`

- [ ] **Step 1: Check browser console for errors**
Run: Inspect browser console on `http://localhost:3000/index.html`
Expected: 0 errors, clean Lucide icon creation.

- [ ] **Step 2: Verify all 4 Motion Standards interactively**
1. Test 120fps circular countdown ring offset & timer decrement.
2. Hover pointer over Spotlight & Rail cards to test 3D tilt & dynamic specular glare sheen.
3. Click Category look switcher tabs to verify GPU sliding pill and rail card filtering.
4. Click Spotlight colorway swatches to test image cross-fade.
5. Click Quick-Add buttons on spotlight & rail cards to test radial ripple, emerald checkmark, and header bag pulse.
6. Scroll page up and down to observe differential column depth parallax.
7. Click deal cards to verify GPU cross-dissolve to PDP.

- [ ] **Step 3: Capture verification screenshot and commit complete feature**
```bash
git commit -m "test(deals): verify complete Today's Deals motion engine redesign"
```
