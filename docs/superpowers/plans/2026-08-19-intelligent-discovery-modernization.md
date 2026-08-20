# Intelligent Discovery — Modernization & 4 Motion Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit, modernize, and redesign `pages/discovery.html` and its supporting script `js/discovery-ui.js`, animations in `js/animations.js`, and styles in `css/design-system.css` to eliminate outdated animation tracks and effects, replace harsh borders with sleek luxury obsidian surfaces, remove noisy text clutter, and fully integrate all 4 Motion Standards (Micro-interactions with 120fps progress timer & look switcher sync, 3D hover effects with specular glare, GPU cross-dissolve page transitions, and differential scroll parallax) while ensuring 100% responsiveness and zero feature regressions.

**Architecture:**
- `pages/discovery.html`: Modernized markup featuring the Curated Look Switcher & 120fps Animation Track, ultra-clean luxury hero with obsidian glass search bar and 120fps thinking progress line, Understood As context bar, 3-column differential parallax grid, and GPU page transition curtain.
- `js/discovery-ui.js`: Discovery UI controller driving the 120fps Curated Look Switcher progress timer and look tabs, coordinating capsule look queries ("Something warm but not bulky", "Minimal everyday sneakers", "Comfortable for a long flight", "Cool evening in Dhaka"), rendering product cards with 4 Motion Standards, and managing cart additions.
- `js/animations.js`: Global motion orchestrator providing `initDiscoverySearchPageMotion()` and `initDiscoveryCardsMotion()` for 3D spring LERP tilt (`±6.5°`), cursor-tracking specular glare, GPU cross-dissolve curtain transitions (`#pageTransitionOverlay`), and Lenis-linked differential scroll parallax.
- `css/design-system.css`: Clean luxury design tokens with zero hard/bold borders, translucent obsidian glass surfaces, multi-layer depth shadows, and responsive media queries across 1200px, 1024px, 768px, and 480px.

**Tech Stack:** Vanilla HTML5/CSS3 · Motion.dev / Native WAAPI · Lucide Icons · Lenis Smooth Scroll · Cormorant Garamond / Inter / Outfit Typography.

## Global Constraints

- **Luxury Palette**: Obsidian surfaces `rgba(8, 14, 30, 0.96)` and `#020B18`, cyan `#3DE0FF`, pink `#FB7185`, gold/emerald accents, zero saturated/neon borders.
- **Typography**: Display/Headlines = `Cormorant Garamond` (serif, luxury, confident), body = `Inter` / `Work Sans` / `Outfit`.
- **Zero Text Clutter**: Eliminate wordy AI descriptions and robotic spec text from cards; adopt calm, declarative editorial voice with 3-item metadata (House/Category + Title + Price) and on-demand "Why it fits" modal.
- **No Hard/Bold Borders**: Use subtle 1px translucent borders (`rgba(255, 255, 255, 0.07)` or `rgba(255, 255, 255, 0.10)`) paired with multi-layer shadow depth.
- **4 Motion Standards**:
  1. *Micro-interactions*: 120fps GPU progress bar (`transform: scaleX()`), look switcher auto-sync (6.5s cycle) with pause toggle, tactile quick-add ripple, search thinking progress track.
  2. *3D Hover Physics*: Spring LERP tilt (`±6.5°`), dynamic cursor-following specular glare, multi-layer depth shadow.
  3. *Page Transitions*: Hardware-accelerated GPU cross-dissolve curtain (`#pageTransitionOverlay`) on all card and navigation clicks.
  4. *Scroll Parallax*: Differential column depth (`data-parallax-depth="0.6"`, `1.15`, `1.7`, `0.85` or alternating `0.7` / `1.3`) linked to Lenis / rAF scroll loop.
- **Accessibility & Touch**: Min 44×44px touch targets; respect `prefers-reduced-motion: reduce`.
- **Zero Feature Regressions**: Preserve natural language query parsing, Banglish intent extraction, budget parsing, context editing, fallback search mode, URL query sync (`?q=Something%20warm%20but%20not%20bulky`), and mini-cart integration.

---

## File Structure & Responsibilities

| File | Changes / Responsibility |
|------|--------------------------|
| `pages/discovery.html` | Redesign markup: add Curated Look Switcher spotlight section with 120fps progress track, clean luxury hero, sleek obsidian search bar with 120fps GPU thinking line, prompt chips, Understood As context bar, differential parallax grid, and `#pageTransitionOverlay`. |
| `js/discovery-ui.js` | Update controller to drive the 120fps Look Switcher progress timer and look tabs, coordinate look intent exploration clicks, build luxury cards with 4 Motion Standards, handle "Why it fits" modal, quick-add ripple, and mini-cart additions. |
| `js/animations.js` | Enhance `initDiscoverySearchPageMotion()` and `initDiscoveryCardsMotion()` to ensure 3D spring LERP tilt (`±6.5°`), dynamic specular glare, GPU cross-dissolve curtain transitions, and differential scroll parallax. |
| `css/design-system.css` | Update discovery styles: remove all hard/bold borders, add smooth animations, polish look switcher, search bar, chips, cards, modals, and responsive breakpoints. |

---

## Tasks

### Task 1: Rebuild `pages/discovery.html` Markup & Hero Structure

**Files:**
- Modify: `pages/discovery.html`

**Interfaces:**
- Consumes: `css/design-system.css`, Google Fonts, Lucide icons.
- Produces: Modernized DOM with `#spotlightProgressBar`, `#spotlightTabs`, `#spotlightBodyPanel`, `#discoveryThinkingTrack`, `#discoveryResultsGrid`, `#whyMatchesModal`, `#pageTransitionOverlay`.

- [ ] **Step 1: Update `pages/discovery.html` Header, Head Meta & Preloader**
  - Ensure fonts (`Cormorant Garamond`, `Outfit`, `Work Sans`, `Inter`) and `design-system.css?v=6` are properly linked.
  - Ensure `#pageTransitionOverlay` hardware-accelerated curtain is present at bottom of body.

- [ ] **Step 2: Redesign Hero Section & Obsidian Glass Search Bar**
  - Refine `.discovery-hero-section` with elegant typography:
    ```html
    <div class="discovery-hero-content">
      <div class="discovery-eyebrow">
        <i data-lucide="sparkles" style="width: 13px; height: 13px; margin-right: 4px;"></i>
        Intelligent Semantic Catalog Discovery
      </div>
      <h1 class="discovery-hero-title">
        Describe what<br><em>you need.</em>
      </h1>
      <p class="discovery-hero-subtitle">
        Occasion, climate, atmosphere, or feeling &mdash; our catalog engine discovers your tailored aesthetic match.
      </p>
      ...
    ```
  - Modernize `.discovery-search-bar`:
    - Clean obsidian glass container `.discovery-search-input-wrap`.
    - 120fps GPU thinking progress line `#discoveryThinkingTrack` with `#discoveryThinkingBar`.
    - Sleek prompt chips `#discoveryPrompts` with luxury hover glow.

- [ ] **Step 3: Insert Curated Look Switcher & 120fps Animation Track**
  - Insert `.plp-curation-spotlight` directly below hero:
    ```html
    <!-- CURATED INTENT SPOTLIGHT & 120FPS ANIMATION TRACK -->
    <section class="plp-curation-spotlight discovery-curation-spotlight" id="discoverySpotlightSection" aria-label="Curated Look Spotlight">
      <!-- 120fps GPU Progress Bar Track -->
      <div class="spotlight-progress-track" aria-hidden="true">
        <div class="spotlight-progress-bar" id="spotlightProgressBar"></div>
      </div>

      <!-- Spotlight Header: Live Whisper + Look Switcher Tabs -->
      <div class="spotlight-header-row">
        <div class="spotlight-eyebrow-tag">
          <span class="spotlight-status-dot"></span>
          <span id="spotlightLookEyebrow">CURATED INTENT &middot; 01 OF 04</span>
          <button type="button" class="spotlight-pause-toggle-btn" id="spotlightPauseToggleBtn" aria-pressed="false" aria-label="Pause automatic capsule rotation">
            <i data-lucide="pause" id="spotlightPauseIcon" style="width: 12px; height: 12px;"></i>
          </button>
        </div>
        <div class="spotlight-capsule-tabs" id="spotlightTabs" role="tablist" aria-label="Curated Capsule Selection">
          <button class="spotlight-tab-btn active" data-look="0" role="tab" aria-selected="true" id="spotlightTab0">
            <span>01 THERMAL LAYERING</span>
          </button>
          <button class="spotlight-tab-btn" data-look="1" role="tab" aria-selected="false" id="spotlightTab1">
            <span>02 MINIMAL SNEAKERS</span>
          </button>
          <button class="spotlight-tab-btn" data-look="2" role="tab" aria-selected="false" id="spotlightTab2">
            <span>03 LONG FLIGHT</span>
          </button>
          <button class="spotlight-tab-btn" data-look="3" role="tab" aria-selected="false" id="spotlightTab3">
            <span>04 DHAKA EVENING</span>
          </button>
        </div>
      </div>

      <!-- Spotlight Body Canvas (Split Layout) -->
      <div class="spotlight-body-layout" id="spotlightBodyPanel" role="tabpanel">
        <!-- Left: Capsule Story & Filter Sync -->
        <div class="spotlight-story-pane">
          <span class="spotlight-season-badge" id="spotlightSeasonBadge">SEASONAL INTENT &middot; AW26</span>
          <h2 class="spotlight-capsule-title" id="spotlightCapsuleTitle">The Thermal Layering Edit</h2>
          <p class="spotlight-capsule-desc" id="spotlightCapsuleDesc">Precision double-faced wool and structured cashmere layers engineered for warmth without excess volume.</p>
          <div class="spotlight-actions-group">
            <button class="spotlight-sync-filter-btn btn-ripple" id="spotlightSyncFilterBtn" data-query="Something warm but not bulky">
              <span>Explore Capsule Intent</span>
              <i data-lucide="arrow-right" style="width: 13px; height: 13px;"></i>
            </button>
            <span class="spotlight-piece-counter" id="spotlightPieceCount">8 Matching Pieces</span>
          </div>
        </div>

        <!-- Right: Visual Frame & 3D Shoppable Piece Pill -->
        <div class="spotlight-visual-pane">
          <div class="spotlight-img-frame" id="spotlightImgFrame">
            <img src="../assets/images/lifestyle/hero_sweater_landscape.jpg" alt="Thermal Layering Edit" class="spotlight-featured-img" id="spotlightFeaturedImg" />
            <div class="spotlight-vignette-overlay" aria-hidden="true"></div>
          </div>

          <!-- Floating 3D Shoppable Look Pill -->
          <div class="spotlight-shoppable-pill" id="spotlightShoppablePill" data-id="p2" role="region" aria-label="Featured Look Piece">
            <div class="spotlight-pill-thumb">
              <img src="../assets/images/lifestyle/thumb_sweater.jpg" alt="Structured Wool Blazer" id="spotlightPillThumb" />
            </div>
            <div class="spotlight-pill-details">
              <span class="spotlight-pill-tag" id="spotlightPillTag">FEATURED LOOK</span>
              <h3 class="spotlight-pill-title" id="spotlightPillTitle">STRUCTURED WOOL BLAZER</h3>
              <span class="spotlight-pill-price" id="spotlightPillPrice">BDT 26,400</span>
            </div>
            <button class="spotlight-quick-add-btn btn-spotlight-quick-add btn-ripple" id="spotlightQuickAddBtn" data-id="p2" aria-label="Quick Add Structured Wool Blazer to Bag">
              <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
              <span>BAG</span>
            </button>
          </div>
        </div>
      </div>
    </section>
    ```

- [ ] **Step 4: Refine Results Section, Understood As Bar, Grid, and Modals**
  - Refine `#discoveryContextBar` with subtle 1px translucent border and cyan accents.
  - Refine `#discoveryResultsGrid` with clean 3-column layout.
  - Refine `#discoveryRefinementBar` with interactive refinement pills.
  - Refine `#whyMatchesModal` with sleek obsidian backdrop and smooth spring scaling.

---

### Task 2: Implement Look Switcher Engine & Enhanced UI in `js/discovery-ui.js`

**Files:**
- Modify: `js/discovery-ui.js`

**Interfaces:**
- Consumes: `NexIntentParser`, `NexCatalogEngine`, `NexSessionContext`, `CartState` / `window.nexCart`.
- Produces: `window.NexDiscoveryUI`, 120fps progress animation, interactive look switching, results rendering with 4 Motion Standards.

- [ ] **Step 1: Define `DISCOVERY_CURATED_LOOKS` Dataset**
  - Add 4 curated looks with queries, titles, descriptions, images, and featured products:
    ```javascript
    var DISCOVERY_CURATED_LOOKS = [
      {
        id: 'look-thermal',
        tabLabel: '01 THERMAL LAYERS',
        seasonBadge: 'SEASONAL INTENT · AW26',
        title: 'The Thermal Layering Edit',
        desc: 'Precision double-faced wool and structured cashmere layers engineered for warmth without excess volume.',
        query: 'Something warm but not bulky',
        pieceCount: '8 Matching Pieces',
        imgLandscape: '../assets/images/lifestyle/hero_sweater_landscape.jpg',
        featuredProductId: 'p2',
        featuredProductThumb: '../assets/images/lifestyle/thumb_sweater.jpg',
        featuredProductTag: 'FEATURED LOOK',
        featuredProductTitle: 'STRUCTURED WOOL BLAZER',
        featuredProductPrice: 'BDT 26,400'
      },
      {
        id: 'look-sneakers',
        tabLabel: '02 MINIMAL SNEAKERS',
        seasonBadge: 'ARCHITECTURAL FOOTWEAR · SS26',
        title: 'Minimalist Monochrome Runners',
        desc: 'Italian calfskin low-tops engineered with contoured Vibram soles for quiet everyday motion.',
        query: 'Minimal everyday sneakers',
        pieceCount: '4 Matching Pieces',
        imgLandscape: '../assets/images/lifestyle/hero_sneaker_landscape.jpg',
        featuredProductId: 'p4',
        featuredProductThumb: '../assets/images/products/plp_sneaker.png',
        featuredProductTag: 'FEATURED SILHOUETTE',
        featuredProductTitle: 'MINIMALIST LEATHER RUNNER',
        featuredProductPrice: 'BDT 18,900'
      },
      {
        id: 'look-travel',
        tabLabel: '03 LONG FLIGHT',
        seasonBadge: 'TRANSIT ESSENTIALS · SS26',
        title: 'Long-Haul Transit Comfort',
        desc: 'Relaxed pure Mongolian cashmere sweaters and breathable trousers tailored for effortless flight hours.',
        query: 'Comfortable for a long flight',
        pieceCount: '6 Matching Pieces',
        imgLandscape: '../assets/images/lifestyle/hero_knitwear_lifestyle.jpg',
        featuredProductId: 'p3',
        featuredProductThumb: '../assets/images/products/plp_sweater.png',
        featuredProductTag: 'CABIN COMFORT',
        featuredProductTitle: 'RELAXED CASHMERE CREWNECK',
        featuredProductPrice: 'BDT 16,800'
      },
      {
        id: 'look-evening',
        tabLabel: '04 DHAKA EVENING',
        seasonBadge: 'URBAN ROTATION · AW26',
        title: 'Dhaka Cool Evening Edit',
        desc: 'Breathable merino layers and active acoustic isolation for relaxed dinner and rooftop evenings.',
        query: 'Something warm for a cool evening in Dhaka',
        pieceCount: '8 Matching Pieces',
        imgLandscape: '../assets/images/lifestyle/hero_run_landscape.jpg',
        featuredProductId: 'p5',
        featuredProductThumb: '../assets/images/products/plp_headphones.png',
        featuredProductTag: 'ACOUSTIC ATELIER',
        featuredProductTitle: 'STUDIO SPATIAL HEADPHONES',
        featuredProductPrice: 'BDT 42,000'
      }
    ];
    ```

- [ ] **Step 2: Implement 120fps GPU Progress Bar Timer & Look Switcher Controller**
  - Implement:
    - `startLookTimer()`: reset elapsed time, cancel RAF, start loop.
    - `tickLookTimer(now)`: calculate progress `Math.min(elapsed / 6500, 1)`, call `updateProgressBar(progress)`.
    - `updateProgressBar(progress)`: `bar.style.transform = 'scaleX(' + progress.toFixed(4) + ')'`.
    - `setCuratedLook(index, userInitiated)`: update active tab, title, description, image, pill thumb, title, price, and sync button query.
    - `togglePause()` and hover pause handlers.
  - Wire capsule tab clicks and "Explore Capsule Intent" button click:
    - Clicking capsule tab switches look immediately.
    - Clicking "Explore Capsule Intent" populates search input `#discoveryMainInput`, scrolls smoothly to results, and executes search!

- [ ] **Step 3: Enhance Result Cards Builder for 4 Motion Standards**
  - Assign differential parallax depth (`i % 3 === 0 ? '0.7' : i % 3 === 1 ? '1.3' : '0.9'`).
  - Output card markup with specular glare div, match badge, "Why it fits" modal trigger, clean 3-item metadata (House/Category + Title + Price), and View Product + Quick Add to Bag buttons with ripple.
  - Add click handlers for Quick Add button to add item to `window.nexCart` / `CartState` with tactile ripple and header bag badge update.

- [ ] **Step 4: Connect URL Query Sync & Initial Render**
  - On page load, if query param `?q=Something%20warm%20but%20not%20bulky` is present, execute search and sync Look Switcher to Look 0 (`The Thermal Layering Edit`).

---

### Task 3: Enhance Motion Physics in `js/animations.js`

**Files:**
- Modify: `js/animations.js`

**Interfaces:**
- Consumes: Lenis smooth scroll instance, Lucide, Motion.dev / native rAF.
- Produces: `window.initDiscoverySearchPageMotion()`, `window.initDiscoveryCardsMotion()`.

- [ ] **Step 1: Enhance `initDiscoverySearchPageMotion()` for Differential Scroll Parallax**
  - Connect scroll loop to Lenis / native rAF to translate cards by `depth * 8px` on scroll, creating realistic multi-depth parallax.

- [ ] **Step 2: Enhance `initDiscoveryCardsMotion()` for 3D Tilt, Specular Glare & GPU Page Transitions**
  - Bind staggered cascade entrance (`opacity [0, 1], y [20, 0], scale [0.97, 1]`).
  - Implement spring LERP mouse tilt physics (`MAX_TILT = 6.5deg`, `perspective(1000px)`).
  - Implement dynamic cursor-following specular glare radial gradient (`--disc-glare-x`, `--disc-glare-y`, `--disc-glare-opacity`).
  - Bind GPU cross-dissolve curtain `#pageTransitionOverlay` on `.discovery-view-btn` and card image links.
  - Bind tactile button ripple on `.btn-ripple` buttons.

---

### Task 4: Upgrade CSS Styles in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css`

**Interfaces:**
- Consumes: Design tokens (colors, typography, radii, shadows).
- Produces: Responsive styling for Look Switcher, obsidian search bar, 120fps progress tracks, cards, and modals with zero hard/bold borders.

- [ ] **Step 1: Style Discovery Curated Look Switcher (`.discovery-curation-spotlight`)**
  - 120fps GPU progress track with smooth cyan gradient bar.
  - Header row with live dot, pause toggle button, and responsive capsule tabs.
  - Split body layout (story pane + visual pane with 3D shoppable look pill).
  - Soft 1px translucent borders `rgba(255, 255, 255, 0.08)` and multi-layer shadows.

- [ ] **Step 2: Style Search Bar, Thinking Line & Prompt Chips**
  - Obsidian glass container with backdrop filter and subtle cyan focus ring.
  - 120fps GPU thinking progress track with gradient pulse.
  - Clean luxury prompt chips with smooth hover elevation.

- [ ] **Step 3: Style Product Cards, Specular Glare & "Why It Fits" Modal**
  - Luxury obsidian card styling with 1px translucent border `rgba(255, 255, 255, 0.07)`.
  - Specular glare radial gradient layer.
  - "Why it fits" sparkles trigger and modal dialog.
  - Tactile ripple animation `.btn-ripple::after`.

- [ ] **Step 4: Add Responsive Media Queries**
  - 1200px / 1024px: 2-column grid, compact look switcher.
  - 768px / 480px: 1-column grid, mobile split layout for look switcher, horizontal scroll for tabs, touch targets >= 44px, zero horizontal overflow.

---

### Task 5: End-to-End Browser Testing & Quality Assurance

**Files:**
- Test: Open `pages/discovery.html?q=Something%20warm%20but%20not%20bulky` in browser.

- [ ] **Step 1: Test Desktop Viewport (1440px / 1280px)**
  - Verify Look Switcher auto-cycles smoothly with 120fps progress bar.
  - Verify pause toggle and tab clicks.
  - Verify search query "Something warm but not bulky" executes and renders 8 matching products.
  - Verify 3D mouse tilt physics and specular glare on cards.
  - Verify differential scroll parallax as page scrolls.
  - Verify "Why it fits" modal opens and closes cleanly.
  - Verify Quick Add to Bag updates mini-cart.
  - Verify View Product triggers GPU cross-dissolve page transition curtain.

- [ ] **Step 2: Test Tablet Viewport (1024px / 768px)**
  - Verify 2-column grid reflow and Look Switcher responsiveness.

- [ ] **Step 3: Test Mobile Viewport (375px - 480px)**
  - Verify 1-column grid, Look Switcher mobile layout, touch targets, and zero horizontal overflow.

- [ ] **Step 4: Test Edge Cases & Feature Regressions**
  - Test prompt chip clicks ("Cool evening in Dhaka", "Long flight comfort", etc.).
  - Test "Understood As" chip removal.
  - Test refinement chip clicks.
  - Test AI error fallback simulation button.
