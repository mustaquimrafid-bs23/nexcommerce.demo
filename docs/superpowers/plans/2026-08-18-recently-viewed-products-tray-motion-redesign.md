# Recently Viewed Products Tray Luxury Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign and rebuild the Recently Viewed Products Tray (`<!-- RECENTLY VIEWED PRODUCTS TRAY -->`) into a luxury horizontal glide rail with obsidian glassmorphism, synced category pills, and full integration of all 4 Motion Standards.

**Architecture:** 
- **DOM Structure (`index.html`)**: Semantic header with eyebrow badge, Playfair Display headline, category filter tab list with 120fps GPU progress bar, glass navigation buttons, clear history control, and horizontal glide rail container.
- **Styling (`css/design-system.css`)**: Luxury obsidian glass styling (`rgba(10, 18, 32, 0.75)`), 1px border (`rgba(255, 255, 255, 0.08)`), specular glare overlay, quick-add ripple physics, responsive CSS scroll-snap rail, and WCAG AA accessibility.
- **Motion Physics (`js/animations.js`)**: `initRecentlyViewedMotion()` orchestrating 3D spring lerp tilt physics (`±6.0°`), cursor-tracking specular glare, GPU curtain cross-dissolve page transitions (`#pageTransitionOverlay`), and Lenis-synced differential scroll parallax.
- **State & Interactions (`js/home.js`)**: Dynamic data management from `localStorage`, category filter switcher, 5000ms auto-progress timer (with pause-on-hover), quick-add ripple with `window.nexCart.addItem(...)`, and smooth rail glide controls.

**Tech Stack:** Vanilla ES6+ JavaScript, CSS3 Design Tokens & Glassmorphism, Motion.dev / CSS Keyframes, Lenis Smooth Scroll, Lucide Icons.

## Global Constraints
- Luxury Neutral Foundation: Near-black `#0a0a0a` / deep obsidian `#080E1E`, zero harsh or bold borders, no neon glows.
- Strict 3-Item Metadata: Product cards must display House/Category + Title + Tabular Price with zero multi-line description clutter.
- All 4 Motion Standards: Synced Look Switcher with 120fps progress timer, 3D mouse tilt with specular glare, GPU page transitions, and differential scroll parallax.
- Zero Regressions: Must not break existing cart functionality (`window.nexCart`), navigation, or other page sections.

---

### Task 1: Rebuild HTML Structure in `index.html`

**Files:**
- Modify: `index.html:1002-1020`

**Interfaces:**
- Produces: Semantic DOM elements `#homeRecentlyViewedSection`, `#recentTabsNav`, `#recentProductsRail`, `#recentPrevBtn`, `#recentNextBtn`, `#recentClearBtn`.

- [ ] **Step 1: Replace the existing recently viewed section markup in `index.html`**

Update `index.html` to include the luxury header, category tabs with progress indicators, navigation buttons, and the glide rail container:

```html
    <!-- RECENTLY VIEWED PRODUCTS TRAY -->
    <section class="home-recently-viewed-section reveal-on-scroll" id="homeRecentlyViewedSection" aria-label="Recently Viewed Items">
      <div class="container">
        <!-- Section Header Row -->
        <div class="recent-header-row">
          <div class="recent-header-text">
            <div class="recent-eyebrow">
              <i data-lucide="history" style="width: 12px; height: 12px;"></i>
              <span>RESUME BROWSING</span>
            </div>
            <h2 class="recent-headline">Recently Visited Pieces</h2>
            <p class="recent-subcaption">Curated history of garments, timepieces, and acoustics explored in your session.</p>
          </div>

          <!-- Header Right Actions: Clear & Rail Navigation -->
          <div class="recent-header-actions">
            <button type="button" class="recent-clear-btn" id="recentClearBtn" aria-label="Clear recently viewed history">
              <i data-lucide="trash-2" style="width: 12px; height: 12px;"></i>
              <span>Clear History</span>
            </button>
            <div class="recent-glide-nav-wrap" role="group" aria-label="Scroll rail navigation">
              <button type="button" class="recent-glide-nav-btn" id="recentPrevBtn" aria-label="Scroll rail left">
                <i data-lucide="chevron-left" style="width: 15px; height: 15px;"></i>
              </button>
              <button type="button" class="recent-glide-nav-btn" id="recentNextBtn" aria-label="Scroll rail right">
                <i data-lucide="chevron-right" style="width: 15px; height: 15px;"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Synced Look / Category Filter Tabs with 120fps Progress Indicator -->
        <div class="recent-tabs-container">
          <div class="recent-tabs-nav" id="recentTabsNav" role="tablist" aria-label="Filter recently viewed by category">
            <button type="button" class="recent-tab-pill active" role="tab" aria-selected="true" data-category="all" id="tab-recent-all">
              <span class="recent-tab-label">All Pieces</span>
              <span class="recent-tab-progress" aria-hidden="true"></span>
            </button>
            <button type="button" class="recent-tab-pill" role="tab" aria-selected="false" data-category="Apparel" id="tab-recent-apparel">
              <span class="recent-tab-label">Apparel</span>
              <span class="recent-tab-progress" aria-hidden="true"></span>
            </button>
            <button type="button" class="recent-tab-pill" role="tab" aria-selected="false" data-category="Footwear" id="tab-recent-footwear">
              <span class="recent-tab-label">Footwear</span>
              <span class="recent-tab-progress" aria-hidden="true"></span>
            </button>
            <button type="button" class="recent-tab-pill" role="tab" aria-selected="false" data-category="Acoustics" id="tab-recent-acoustics">
              <span class="recent-tab-label">Acoustics</span>
              <span class="recent-tab-progress" aria-hidden="true"></span>
            </button>
            <button type="button" class="recent-tab-pill" role="tab" aria-selected="false" data-category="Objects" id="tab-recent-objects">
              <span class="recent-tab-label">Objects & Accents</span>
              <span class="recent-tab-progress" aria-hidden="true"></span>
            </button>
          </div>
        </div>

        <!-- Horizontal Momentum Glide Rail -->
        <div class="recent-glide-rail-wrap">
          <div class="recent-glide-rail" id="recentProductsRail" role="region" aria-label="Recently viewed products rail" tabindex="0">
            <!-- Dynamically populated by js/home.js -->
          </div>
        </div>

        <!-- Empty / Cleared Feedback State (Hidden by default) -->
        <div class="recent-empty-state" id="recentEmptyState" style="display: none;">
          <div class="recent-empty-icon"><i data-lucide="clock" style="width: 28px; height: 28px;"></i></div>
          <h3 class="recent-empty-title">Your Browsing History is Clear</h3>
          <p class="recent-empty-desc">Discover the season's latest luxury garments, minimalist footwear, and bespoke acoustics.</p>
          <a href="pages/catalog.html" class="recent-empty-cta">Explore Catalog</a>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify HTML syntax and inspect structure**

---

### Task 2: Implement Luxury Glassmorphism & Responsive CSS in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:9744-9864`

**Interfaces:**
- Consumes: CSS tokens (`--font-display`, `--font-body`, `--radius-md`, `--radius-full`, `--accent-cyan`, `--accent-rose`).
- Produces: Complete styles for `.home-recently-viewed-section`, `.recent-glide-rail`, `.recent-glide-card`, `.recent-card-glare`, `.recent-tab-pill`, `.recent-tab-progress`, `.recent-card-quick-add`, `.recent-ripple`.

- [ ] **Step 1: Replace legacy recently viewed CSS with luxury glassmorphism styles**

Update `css/design-system.css` with:
- Section padding and ambient glow backdrop.
- Flex header layout with Playfair headline and responsive stacking.
- Category tab pill track with 120fps GPU progress bar (`linear-gradient(90deg, #38BDF8, #818CF8, #FB7185)` with `transform: scaleX(0) → scaleX(1)`).
- Glass navigation prev/next buttons and minimalist clear history button.
- Horizontal glide rail container (`overflow-x: auto; scroll-snap-type: x mandatory; -webkit-overflow-scrolling: touch; scrollbar-width: none;`).
- 3D perspective wrapper on `.recent-glide-card` with obsidian glass (`background: rgba(10, 18, 32, 0.75)`), 1px border (`rgba(255, 255, 255, 0.08)`), multi-tier shadow, specular glare layer, and smooth hover elevation.
- Media box with studio radial gradient canvas and scale `1.08x` on hover.
- Strict 3-item metadata stack: Category/House, Product Title, Tabular Price.
- Tactile quick-add circle button with dynamic coordinate ripple (`.recent-ripple`) and checkmark morph.
- Responsive breakpoints (`@media (max-width: 1023px)`, `@media (max-width: 767px)`).
- Accessibility and `@media (prefers-reduced-motion: reduce)`.

- [ ] **Step 2: Verify CSS token alignment and check for zero syntax errors**

---

### Task 3: Build Motion Orchestrations in `js/animations.js`

**Files:**
- Modify: `js/animations.js`

**Interfaces:**
- Consumes: `.recent-glide-card`, `#pageTransitionOverlay`, `window._nexLenis`.
- Produces: `window.initRecentlyViewedMotion()` function.

- [ ] **Step 1: Implement `initRecentlyViewedMotion()` in `js/animations.js`**

Add the complete 4 Motion Standards implementation:
1. **1️⃣ Micro-interactions**:
   - Scroll entrance animation cascading header, tabs, and rail cards (`opacity: [0, 1], y: [20, 0]`, stagger `0.06s`).
2. **2️⃣ 3D Hover Effects**:
   - High-precision spring lerp mouse tilt on `.recent-glide-card` (`±6.0°`, `perspective: 1000px`, `translateZ(12px)`).
   - Dynamic cursor-following specular glare highlight setting `--recents-glare-x`, `--recents-glare-y`, and `--recents-glare-opacity`.
   - Multi-layer shadow expansion.
3. **3️⃣ GPU Page Transitions**:
   - Event delegation on `.recent-glide-card` clicks (excluding quick-add and clear buttons) triggering `#pageTransitionOverlay` curtain cross-dissolve before navigating to `pages/product.html?id=...` (210ms transition).
4. **4️⃣ Scroll Parallax**:
   - Hooked to `window._nexLenis` and passive scroll listener: updates differential card offsets (`data-parallax-depth="1"`, `1.4`, `1.8`, `1.2`) to create layered scroll depth.

- [ ] **Step 2: Export `window.initRecentlyViewedMotion = initRecentlyViewedMotion` and verify execution hooks**

---

### Task 4: Upgrade Interaction Logic & Tab Synchronization in `js/home.js`

**Files:**
- Modify: `js/home.js:1148-1207`

**Interfaces:**
- Consumes: `localStorage.getItem('nex_recent_products')`, `window.nexCart.addItem(...)`, `window.initRecentlyViewedMotion()`.
- Produces: Fully interactive `initRecentlyViewed()` with category filtering, 120fps auto-progress timer, glide rail navigation, quick-add ripple, and clear history logic.

- [ ] **Step 1: Implement enhanced `initRecentlyViewed()` in `js/home.js`**

Include:
- Robust product hydration: Reads `nex_recent_products` from localStorage. If empty or fewer than 4 items, provides curated fallback editorial products across multiple categories (`p1`, `p6`, `p4`, `p2`, `p5_bag`, `p7`).
- Card template generator generating clean `.recent-glide-card` elements with `data-category`, `data-parallax-depth`, specular glare markup, studio image, strict 3-item metadata, and `.recent-card-quick-add` button.
- Category filtering & active tab state management:
  - Smoothly displays matching category cards or all cards.
  - Updates ARIA attributes (`aria-selected`).
- Synced 120fps GPU auto-progress timer:
  - 5000ms interval cycling through category tabs.
  - Pauses timer on `.home-recently-viewed-section` `mouseenter` / `focusin`.
  - Resumes on `mouseleave` / `focusout`.
  - Resets on manual tab click.
- Glide Rail Prev/Next button handlers with smooth horizontal scrolling (`rail.scrollBy({ left: ±300, behavior: 'smooth' })`).
- Tactile quick-add ripple handler:
  - Creates `.recent-ripple` at exact click coordinates.
  - Morphs icon to checkmark (`#10B981`) for 1400ms.
  - Calls `window.nexCart.addItem(...)` with toast feedback.
  - Stops propagation to prevent accidental page transition navigation.
- Clear History handler with smooth fade out and empty state presentation.
- Re-runs `window.initRecentlyViewedMotion()` and `lucide.createIcons()`.

- [ ] **Step 2: Verify all interactions and edge cases**

---

### Task 5: End-to-End Verification & SQA Testing

**Files:**
- Verify in browser: `http://localhost:3000/`

- [ ] **Step 1: Test 120fps Look Switcher progress timer and manual tab filtering**
- [ ] **Step 2: Test 3D mouse tilt physics and specular glare on desktop**
- [ ] **Step 3: Test tactile quick-add button (ripple, checkmark, cart count update)**
- [ ] **Step 4: Test GPU page transitions on card click**
- [ ] **Step 5: Test scroll parallax during Lenis page scrolling**
- [ ] **Step 6: Test responsive layout on Desktop (1280px), Tablet (768px), and Mobile (375px)**
- [ ] **Step 7: Test Clear History functionality and empty state recovery**

---
