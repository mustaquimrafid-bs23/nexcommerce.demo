# Technical Design Specification: Today's Deals Luxury Atelier & Motion Engine

**Date:** 2026-08-18  
**Status:** Approved / Ready for Execution  
**Target:** `index.html`, `css/design-system.css`, `js/home.js`  
**Reference Standards:** Apple HIG, Emil Kowalski Motion Engineering, SSENSE Luxury Digital Standard, WCAG 2.1 AA  

---

## 1. Overview & Business Objectives
Redesign the **Today's Deals (Flash Sale & Countdown)** section from a legacy 5-card static grid into an ultra-luxury **Spotlight Atelier & Curated Motion Rail**. The redesign delivers high-converting scarcity merchandising, real-time interactive colorway previewing, and a flawless 120fps motion experience across all viewports.

---

## 2. Component Architecture & DOM Structure (`index.html`)

```html
<!-- TODAY'S DEALS (FLASH SALE & COUNTDOWN - ATELIER REDESIGN) -->
<section class="home-deals-section reveal-on-scroll" id="todaysDealsSection" aria-label="Today's Curated Offers">
  <!-- Subtle Atmospheric Ambient Glow -->
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

---

## 3. Motion Engineering & Interactive Specifications (`js/home.js`)

### Standard 1: Micro-interactions
- **120fps GPU SVG Circular Ring**: Computes `targetOffset = circumference * (1 - secondsRemaining / totalDuration)`. Updates `stroke-dashoffset` in a requestAnimationFrame loop without layout reflows.
- **Category Nav Spring Indicator**: Reads `tab.offsetLeft` and `tab.offsetWidth`, updates `.deals-nav-slider-pill` with `transform: translate3d(...)` using `cubic-bezier(0.23, 1, 0.32, 1)`.
- **Spotlight Swatch Live Cross-Fade**: On swatch button click, switches image with a 200ms opacity cross-fade, updates title and aria labels.
- **Tactile Quick-Add Ripple**: Spawns an expanding `.deal-ripple-circle` on `(offsetX, offsetY)` coordinates of the button, dispatches `window.nexCart.addItem(...)`, transforms icon into Lucide `check`, and pulses `#headerCartCount`.

### Standard 2: 3D Hover & Velocity Physics
- **Multi-Plane Spatial Depth (`preserve-3d`)**: Children elements sit on `translateZ(15px)` to `translateZ(50px)`.
- **Spring Lerp & Velocity Recoil**: Tracks pointer velocity `vx = (x - lastX) / dt`. Interpolates rotation `curRotX += (targetRotX - curRotX) * 0.10`, `curRotY += (targetRotY - curRotY) * 0.10`.
- **Dynamic Specular Glare Sheen**: Updates CSS variables `--glare-x` and `--glare-y` on pointermove; calculates distance to center for dynamic reflection intensity.

### Standard 3: GPU Cross-Dissolve Page Transitions
- Clicks on deal cards trigger `#pageTransitionOverlay` (`is-active`), applying an instant hardware-accelerated cross-dissolve before redirecting to `pages/product.html?id=...`.
- Ignores navigation when clicking interactive action buttons (Wishlist, Quick-Add, Swatches).

### Standard 4: Zero-Overhead Scroll Parallax
- **Differential Physics**: Left spotlight translates at `0.18x` lag, while rail cards stagger at `0.08x` (even) and `0.14x` (odd).
- **IntersectionObserver Culling**: Physics loop pauses when section is out of viewport (0% CPU/GPU idle cost).

---

## 4. Accessibility & Performance Guardrails
- **WCAG 2.1 AA**: Minimum 4.5:1 contrast, visible focus rings, ARIA live region on timer, screen-reader friendly buttons.
- **Prefers-Reduced-Motion**: Respects user's system preferences by bypassing 3D tilt and continuous parallax transforms.
- **GPU Compositing**: Uses only `transform` and `opacity` properties for animations to guarantee steady 120fps execution.
