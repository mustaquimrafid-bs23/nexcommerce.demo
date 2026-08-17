# Full-Bleed Editorial Hero Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the nexCommerce homepage hero section from a constrained two-column box into a full-bleed, high-fashion lifestyle model canvas with an editorial copy overlay and a floating shoppable story dock.

**Architecture:** Full-viewport background layer with dual-image GPU crossfade, overlaid with an optical gradient scrim for WCAG AAA contrast, left-aligned editorial typographic hierarchy, and a floating glassmorphic shoppable product pill anchored on the bottom right.

**Tech Stack:** HTML5 Semantic Markup, Vanilla CSS (Design Tokens, Backdrop Blur, CSS Grid/Flexbox, Hardware-accelerated GPU transitions), Vanilla JavaScript ES6+ (`home.js` carousel controller, `hero-curtains.js` WebGL/CSS crossfade, touch/pointer swipe gestures, Lucide SVG icons).

## Global Constraints

- Must unconditionally satisfy the Luxury Lifestyle E-Commerce Design Standard.
- Strict WCAG 2.1 AA contrast compliance across all text overlays on model photos.
- GPU-composited animations only (`transform`, `opacity`, `scaleX`); no layout reflow triggers during carousel timers.
- Minimum 44×44px touch targets for all interactive elements (CTAs, dots, quick-add buttons).
- Zero fake AI labels; authentic editorial storytelling and genuine e-commerce actions.

---

### Task 1: Update HTML Structure for Full-Bleed Hero Canvas

**Files:**
- Modify: `index.html:122-234`

**Interfaces:**
- Consumes: Existing header and global navigation tokens.
- Produces: Semantic `.hero-section.hero-full-bleed` DOM with `.hero-bg-canvas`, `.hero-scrim-overlay`, `.hero-editorial-panel`, `.hero-floating-dock`, and `.hero-carousel-dots`.

- [ ] **Step 1: Inspect and backup current hero section structure**
Ensure `index.html` lines 122–234 have all data hooks preserved (`#heroLayerA`, `#heroLayerB`, `#heroHotspotCard`, `#heroDockThumbImg`, `#heroHotspotTitle`, `#heroHotspotPrice`, `#heroHotspotSub`, `#heroFeatureChips`, `#heroHotspotAddBtn`, `#heroCarouselDots`).

- [ ] **Step 2: Replace hero section markup in `index.html`**
Update `.hero-section` to the full-bleed canvas architecture:
```html
    <!-- HERO SECTION (FULL-BLEED EDITORIAL LUXURY CANVAS) -->
    <section class="hero-section hero-full-bleed" aria-roledescription="carousel" aria-label="Featured Stories">
      <!-- Full-Bleed Background Imagery with Dual Layer Crossfade -->
      <div class="hero-bg-canvas" id="heroImgStack">
        <img src="assets/images/lifestyle/hero_headphone_landscape.jpg" alt="Acoustics Headphone GT" class="hero-layer-img hero-layer-active" id="heroLayerA" draggable="false" />
        <img src="assets/images/lifestyle/hero_sweater_landscape.jpg" alt="Featured Story" class="hero-layer-img hero-layer-incoming" id="heroLayerB" draggable="false" />
      </div>

      <!-- Optical Gradient Scrim for Contrast & Atmosphere -->
      <div class="hero-scrim-overlay"></div>

      <!-- Foreground Content Container -->
      <div class="container hero-foreground">
        <!-- Left Column: Editorial Headline & Curation Hook -->
        <div class="hero-editorial-panel">
          <div class="hero-eyebrow-badge">
            <i data-lucide="sparkles" style="width: 12px; height: 12px; color: #F43F5E;"></i>
            <span>DISCOVER DIFFERENTLY</span>
          </div>

          <h1 class="hero-title">
            Shopping that<br>
            understands<br>
            <span class="hero-cursive-accent">what you mean.</span>
          </h1>

          <p class="hero-subtitle">
            Find pieces based on what you're doing, where you're going, and how you want to feel.
          </p>

          <div class="hero-actions-row">
            <a href="pages/category.html?cat=all" class="btn-hero-primary">
              <span>Explore Collections</span>
              <i data-lucide="arrow-right" style="width: 15px; height: 15px;"></i>
            </a>
            <a href="pages/discovery.html" class="btn-hero-secondary" id="heroDescribeLink">
              <span>Describe Your Style</span>
              <i data-lucide="sparkles" style="width: 14px; height: 14px; color: #F43F5E;"></i>
            </a>
          </div>

          <!-- Editorial Trust Strip -->
          <div class="hero-trust-strip">
            <div class="hero-trust-item">
              <div class="hero-trust-icon-box"><i data-lucide="sparkles" style="width: 13px; height: 13px;"></i></div>
              <div class="hero-trust-text">
                <span class="hero-trust-heading">Intent Discovery</span>
                <span class="hero-trust-caption">Understands context, not just keywords</span>
              </div>
            </div>
            <div class="hero-trust-item">
              <div class="hero-trust-icon-box"><i data-lucide="layers" style="width: 13px; height: 13px;"></i></div>
              <div class="hero-trust-text">
                <span class="hero-trust-heading">4 Curated Ateliers</span>
                <span class="hero-trust-caption">Apparel, Footwear, Acoustics & Leather</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Right / Bottom-Right: Floating Shoppable Story Dock -->
        <div class="hero-dock-wrapper">
          <div class="hero-dock-bar hero-floating-dock" id="heroHotspotCard" data-id="p4">
            <!-- Left Thumbnail Cutout -->
            <div class="hero-dock-thumb">
              <img src="assets/images/lifestyle/thumb_headphones.jpg" alt="Product Thumbnail" id="heroDockThumbImg" />
            </div>

            <!-- Center Metadata & Feature Chips -->
            <div class="hero-dock-center">
              <div class="hero-dock-tag">FEATURED IN LOOK</div>
              <div class="hero-dock-title-row">
                <h3 class="hero-dock-title" id="heroHotspotTitle">ACOUSTICS HEADPHONE GT</h3>
                <div class="hero-dock-price" id="heroHotspotPrice">BDT 32,000</div>
              </div>
              <p class="hero-dock-sub" id="heroHotspotSub">Active noise cancellation · Studio sound</p>
              
              <div class="hero-feature-chips" id="heroFeatureChips">
                <span class="hero-chip"><i data-lucide="activity" style="width: 11px; height: 11px;"></i> Deep Bass</span>
                <span class="hero-chip"><i data-lucide="battery-charging" style="width: 11px; height: 11px;"></i> 40H Battery</span>
                <span class="hero-chip"><i data-lucide="sparkles" style="width: 11px; height: 11px;"></i> Premium Comfort</span>
              </div>
            </div>

            <!-- Right Quick-Add Button -->
            <button class="hero-dock-add-btn" id="heroHotspotAddBtn" aria-label="Quick Add to Bag" title="Quick Add to Bag">
              <i data-lucide="plus" style="width: 18px; height: 18px;"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Glowing Progress Capsule Dots with 120fps GPU Fill -->
      <div class="hero-carousel-dots" id="heroCarouselDots" role="tablist" aria-label="Slide Selector">
        <span class="hero-dot active" data-index="0" role="tab" aria-selected="true" aria-label="Slide 1"><span class="hero-dot-fill"></span></span>
        <span class="hero-dot" data-index="1" role="tab" aria-selected="false" aria-label="Slide 2"><span class="hero-dot-fill"></span></span>
        <span class="hero-dot" data-index="2" role="tab" aria-selected="false" aria-label="Slide 3"><span class="hero-dot-fill"></span></span>
        <span class="hero-dot" data-index="3" role="tab" aria-selected="false" aria-label="Slide 4"><span class="hero-dot-fill"></span></span>
      </div>
    </section>
```

- [ ] **Step 3: Verify Lucide Icons and DOM IDs match**
Verify all IDs (`#heroHotspotCard`, `#heroDockThumbImg`, `#heroHotspotTitle`, `#heroHotspotPrice`, `#heroHotspotSub`, `#heroFeatureChips`, `#heroHotspotAddBtn`, `#heroCarouselDots`) are present.

---

### Task 2: Implement Full-Bleed Hero Styles & Responsive Breakpoints

**Files:**
- Modify: `css/design-system.css:3808-3980`
- Modify: `css/design-system.css:5770-5810` (Media Queries)
- Modify: `css/design-system.css:6320-6360` (Drag & Touch Styles)

**Interfaces:**
- Consumes: CSS Variables (`--font-serif`, `--font-cursive`, `--bg-main`, `--text-primary`, `--accent-coral`, etc.).
- Produces: Modern CSS rules for `.hero-full-bleed`, `.hero-bg-canvas`, `.hero-scrim-overlay`, `.hero-foreground`, `.hero-editorial-panel`, and `.hero-floating-dock`.

- [ ] **Step 1: Write the full-bleed CSS styling**
In `css/design-system.css`, update `.hero-section` to:
```css
/* ─── Part 11: Homepage / Full-Bleed Editorial Hero Experience ─── */
.hero-section.hero-full-bleed {
  position: relative;
  min-height: 82vh;
  min-height: clamp(620px, 82vh, 880px);
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 80px 0 60px 0;
  background: #09090b;
}

.hero-bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.hero-bg-canvas .hero-layer-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 28%;
  transition: opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1200ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}

.hero-layer-active {
  opacity: 1;
  transform: scale(1);
  z-index: 2;
}

.hero-layer-incoming {
  opacity: 0;
  transform: scale(1.04);
  z-index: 1;
}

.hero-layer-outgoing {
  opacity: 0;
  transform: scale(0.98);
  z-index: 1;
}

/* Optical Scrim Overlay for WCAG AAA Editorial Contrast */
.hero-scrim-overlay {
  position: absolute;
  inset: 0;
  z-index: 2;
  pointer-events: none;
  background: 
    linear-gradient(90deg, rgba(8, 8, 10, 0.88) 0%, rgba(8, 8, 10, 0.65) 42%, rgba(8, 8, 10, 0.25) 75%, rgba(8, 8, 10, 0.45) 100%),
    linear-gradient(180deg, rgba(8, 8, 10, 0.4) 0%, transparent 20%, transparent 80%, rgba(8, 8, 10, 0.85) 100%);
}

.hero-foreground {
  position: relative;
  z-index: 3;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 48px;
}

.hero-editorial-panel {
  max-width: 620px;
}

.hero-floating-dock {
  background: rgba(14, 14, 18, 0.78);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 18px;
  padding: 16px 20px;
  box-shadow: 0 24px 50px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset;
  display: flex;
  align-items: center;
  gap: 18px;
  max-width: 480px;
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 300ms ease, border-color 300ms ease;
}

.hero-floating-dock:hover {
  transform: translateY(-3px);
  border-color: rgba(255, 255, 255, 0.22);
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.6), 0 0 25px rgba(244, 63, 94, 0.15);
}

.hero-dock-tag {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--accent-coral, #F43F5E);
  margin-bottom: 4px;
}
```

- [ ] **Step 2: Add responsive media queries**
```css
@media (max-width: 1024px) {
  .hero-foreground {
    flex-direction: column;
    align-items: flex-start;
    gap: 36px;
  }
  .hero-floating-dock {
    max-width: 100%;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .hero-section.hero-full-bleed {
    min-height: 580px;
    padding: 60px 0 50px 0;
  }
  .hero-bg-canvas .hero-layer-img {
    object-position: center 20%;
  }
  .hero-scrim-overlay {
    background: 
      linear-gradient(180deg, rgba(8, 8, 10, 0.6) 0%, rgba(8, 8, 10, 0.75) 50%, rgba(8, 8, 10, 0.95) 100%);
  }
  .hero-title {
    font-size: clamp(34px, 8vw, 44px);
  }
  .hero-floating-dock {
    padding: 12px 14px;
  }
}
```

---

### Task 3: Verify JS Carousel Controller & Transition Smoothness

**Files:**
- Modify: `js/home.js:65-280`

**Interfaces:**
- Consumes: `#heroImgStack`, `#heroLayerA`, `#heroLayerB`, `#heroHotspotCard`, dots and quick-add events.
- Produces: Smooth 120fps progress timers, seamless image crossfade, slide metadata updates, and pointer drag/swipe navigation.

- [ ] **Step 1: Verify slide dataset in `js/home.js`**
Ensure `hero_headphone_landscape.jpg`, `hero_sweater_landscape.jpg`, `hero_watch_landscape.jpg`, and `hero_tote_landscape.jpg` are loaded smoothly with accurate metadata.

- [ ] **Step 2: Test quick-add cart button and toast notifications**
Ensure clicking `#heroHotspotAddBtn` seamlessly dispatches `ADD_TO_CART` action and triggers toast notification without interfering with carousel timer.

---

### Task 4: Browser Testing & Visual Verification

**Files:**
- Test with browser devtools / Playwright.

- [ ] **Step 1: Check live rendered homepage at `http://localhost:8080/index.html`**
- [ ] **Step 2: Verify desktop viewport (1440px / 1280px)**
- [ ] **Step 3: Verify tablet viewport (768px)**
- [ ] **Step 4: Verify mobile viewport (375px)**
- [ ] **Step 5: Verify keyboard navigation (Left/Right Arrow keys, Tab focus)**
- [ ] **Step 6: Capture screenshot and record walkthrough**
