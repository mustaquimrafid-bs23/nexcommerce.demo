# Micro-Merchandising Editorial Cluster Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `<!-- MICRO-MERCHANDISING EDITORIAL CLUSTER -->` into a modern, minimal luxury editorial showcase fully integrated with all 4 Motion Standards: micro-interactions (look switcher sync + 120fps progress timer + tactile quick-add ripple), 3D hover physics (mouse tilt + dynamic specular glare + multi-tier obsidian shadows), GPU page transitions, and differential column scroll parallax.

**Architecture:** 
1. `index.html`: Rebuild section DOM with master editorial header, look switcher pills with progress timers, 3 luxury obsidian column cards with specular glare layers, and compact product rows with tactile quick-add buttons.
2. `css/design-system.css`: Implement soft-luxury obsidian glassmorphism, subtle non-bold borders (`rgba(255, 255, 255, 0.05)`), look switcher progress animations, 3D tilt shell, specular glare CSS variables, tactile ripple keyframes, and full responsive breakpoints.
3. `js/animations.js`: Implement `initMicroMerchClusterMotion()` with Motion.dev staggered reveals, spring LERP mouse tilt physics, cursor specular tracking, differential scroll parallax (Lenis-linked), and GPU curtain page transitions.
4. `js/home.js`: Update `initMicroMerchandising()` with look switcher auto-timer cycling, tactile quick-add ripple execution, and robust cart dispatch.

**Tech Stack:** HTML5, CSS3 Glassmorphism & GPU transforms, Motion.dev (`animate`, `inView`, `stagger`), Lenis Smooth Scroll, Lucide Icons, Playwright MCP for browser verification.

## Global Constraints
- Minimal luxury aesthetic: Zero hard or bold borders. Deep obsidian cards (`rgba(11, 20, 36, 0.75)`).
- All 4 Motion Standards must be fully integrated.
- Zero feature regressions: `window.nexCart.addItem(...)` and PDP navigation must function reliably.
- Responsive across all viewports (Desktop `≥1024px`, Tablet `768px–1023px`, Mobile `≤767px`) with touch targets `≥44×44px`.
- Use Playwright MCP for all visual previews and verification screenshots.

---

### Task 1: DOM Rebuild in `index.html`

**Files:**
- Modify: `index.html:692-910`

**Interfaces:**
- Consumes: Product image assets in `assets/images/products/`
- Produces: `#homeMicroMerchSection`, `.micro-merch-grid-3col`, `.micro-merch-col[data-parallax-depth]`, `.micro-col-specular`, `.micro-look-btn`, `.micro-item-row`, `.micro-item-add-btn`

- [ ] **Step 1: Replace Micro-Merchandising Cluster DOM in `index.html`**

```html
    <!-- MICRO-MERCHANDISING EDITORIAL CLUSTER -->
    <section id="homeMicroMerchSection" class="home-micro-merch-section" aria-label="Curated Product Collections">
      <div class="container">
        <!-- Editorial Section Header -->
        <div class="micro-merch-header">
          <div class="micro-merch-eyebrow">
            <i data-lucide="sparkles" style="width: 12px; height: 12px;"></i>
            <span>Curated Discovery</span>
          </div>
          <h2 class="micro-merch-headline">The Considered Edit</h2>
          <p class="micro-merch-subtitle">Refined micro-capsules selected for architectural silhouettes, tactile materials, and seasonal essentials.</p>

          <!-- 1️⃣ Micro-interactions: Synced Look Switcher with 120fps GPU Progress Timer -->
          <div class="micro-look-nav" role="tablist" aria-label="Collection Themes">
            <button type="button" class="micro-look-btn active" role="tab" aria-selected="true" data-theme="all">
              <span>All Curations</span>
              <div class="micro-look-progress" aria-hidden="true"></div>
            </button>
            <button type="button" class="micro-look-btn" role="tab" aria-selected="false" data-theme="tailored">
              <span>Tailored &amp; Outerwear</span>
              <div class="micro-look-progress" aria-hidden="true"></div>
            </button>
            <button type="button" class="micro-look-btn" role="tab" aria-selected="false" data-theme="essentials">
              <span>Minimalist Essentials</span>
              <div class="micro-look-progress" aria-hidden="true"></div>
            </button>
            <button type="button" class="micro-look-btn" role="tab" aria-selected="false" data-theme="objects">
              <span>Objects &amp; Timepieces</span>
              <div class="micro-look-progress" aria-hidden="true"></div>
            </button>
          </div>
        </div>

        <!-- 3-Column Luxury Cluster Grid -->
        <div class="micro-merch-grid-3col">
          <!-- Column 1: New Arrivals (Parallax Depth: 1) -->
          <div class="micro-merch-col" data-parallax-depth="1" data-col="arrivals">
            <div class="micro-col-specular" aria-hidden="true"></div>
            <div class="micro-col-header">
              <div class="micro-col-head-left">
                <span class="micro-col-title">New Arrivals</span>
                <span class="micro-col-badge">Latest</span>
              </div>
              <a href="pages/category.html?sort=newest" class="micro-col-link" aria-label="View all new arrivals">
                <span>See all</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </a>
            </div>
            <div class="micro-item-list" role="list">
              <div class="micro-item-row" data-id="p3" tabindex="0" role="button" aria-label="View Fine-Knit Merino Crew details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/plp_crewneck.png" alt="Fine-Knit Merino Crew" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Apparel</span>
                  <span class="micro-item-title">Fine-Knit Merino Crew</span>
                  <span class="micro-item-price">BDT 2,490</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p3" data-name="Fine-Knit Merino Crew" data-price="2490" data-img="assets/images/products/plp_crewneck.png" data-cat="Apparel" aria-label="Add Fine-Knit Merino Crew to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p2" tabindex="0" role="button" aria-label="View Structured Leather Tote details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/prod_tote.png" alt="Structured Leather Tote" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Leather Goods</span>
                  <span class="micro-item-title">Structured Leather Tote</span>
                  <span class="micro-item-price">BDT 14,900</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p2" data-name="Structured Leather Tote" data-price="14900" data-img="assets/images/products/prod_tote.png" data-cat="Leather Goods" aria-label="Add Structured Leather Tote to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p5_bag" tabindex="0" role="button" aria-label="View Canvas Weekender Bag details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/cat_accessories.jpg" alt="Canvas Weekender Bag" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Accessories</span>
                  <span class="micro-item-title">Canvas Weekender Bag</span>
                  <span class="micro-item-price">BDT 4,990</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p5_bag" data-name="Canvas Weekender Bag" data-price="4990" data-img="assets/images/products/cat_accessories.jpg" data-cat="Accessories" aria-label="Add Canvas Weekender Bag to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p7" tabindex="0" role="button" aria-label="View Tailored Chino Trousers details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/plp_trousers.png" alt="Tailored Chino Trousers" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Apparel</span>
                  <span class="micro-item-title">Tailored Chino Trousers</span>
                  <span class="micro-item-price">BDT 6,800</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p7" data-name="Tailored Chino Trousers" data-price="6800" data-img="assets/images/products/plp_trousers.png" data-cat="Apparel" aria-label="Add Tailored Chino Trousers to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Column 2: Best Sellers (Parallax Depth: 2) -->
          <div class="micro-merch-col" data-parallax-depth="2" data-col="trending">
            <div class="micro-col-specular" aria-hidden="true"></div>
            <div class="micro-col-header">
              <div class="micro-col-head-left">
                <span class="micro-col-title">Best Sellers</span>
                <span class="micro-col-badge">Trending</span>
              </div>
              <a href="pages/category.html?sort=popular" class="micro-col-link" aria-label="View all best sellers">
                <span>See all</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </a>
            </div>
            <div class="micro-item-list" role="list">
              <div class="micro-item-row" data-id="p1" tabindex="0" role="button" aria-label="View Architectural Cashmere Sweater details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/hero_sweater.png" alt="Architectural Cashmere Sweater" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Apparel</span>
                  <span class="micro-item-title">Architectural Cashmere Sweater</span>
                  <span class="micro-item-price">BDT 18,400</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p1" data-name="Architectural Cashmere Sweater" data-price="18400" data-img="assets/images/products/hero_sweater.png" data-cat="Apparel" aria-label="Add Architectural Cashmere Sweater to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p6" tabindex="0" role="button" aria-label="View Minimalist Leather Runner details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/prod_runner.png" alt="Minimalist Leather Runner" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Footwear</span>
                  <span class="micro-item-title">Minimalist Leather Runner</span>
                  <span class="micro-item-price">BDT 11,900</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p6" data-name="Minimalist Leather Runner" data-price="11900" data-img="assets/images/products/prod_runner.png" data-cat="Footwear" aria-label="Add Minimalist Leather Runner to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p9" tabindex="0" role="button" aria-label="View Tailored Wool Blazer details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/plp_blazer.png" alt="Tailored Wool Blazer" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Apparel</span>
                  <span class="micro-item-title">Tailored Wool Blazer</span>
                  <span class="micro-item-price">BDT 8,450</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p9" data-name="Tailored Wool Blazer" data-price="8450" data-img="assets/images/products/plp_blazer.png" data-cat="Apparel" aria-label="Add Tailored Wool Blazer to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p5" tabindex="0" role="button" aria-label="View Classic Chronograph Watch details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/search_watch.png" alt="Classic Chronograph Watch" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Timepieces</span>
                  <span class="micro-item-title">Classic Chronograph Watch</span>
                  <span class="micro-item-price">BDT 3,380</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p5" data-name="Classic Chronograph Watch" data-price="3380" data-img="assets/images/products/search_watch.png" data-cat="Timepieces" aria-label="Add Classic Chronograph Watch to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Column 3: Picked for You (Parallax Depth: 1.5) -->
          <div class="micro-merch-col" data-parallax-depth="1.5" data-col="curated">
            <div class="micro-col-specular" aria-hidden="true"></div>
            <div class="micro-col-header">
              <div class="micro-col-head-left">
                <span class="micro-col-title">Picked for You</span>
                <span class="micro-col-badge">Curated</span>
              </div>
              <a href="pages/discovery.html" class="micro-col-link" aria-label="Explore all curated picks">
                <span>See all</span>
                <i data-lucide="arrow-right" style="width: 12px; height: 12px;"></i>
              </a>
            </div>
            <div class="micro-item-list" role="list">
              <div class="micro-item-row" data-id="p10" tabindex="0" role="button" aria-label="View Ribbed Cashmere Turtleneck details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/plp_turtleneck.png" alt="Ribbed Cashmere Turtleneck" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Apparel</span>
                  <span class="micro-item-title">Ribbed Cashmere Turtleneck</span>
                  <span class="micro-item-price">BDT 18,400</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p10" data-name="Ribbed Cashmere Turtleneck" data-price="18400" data-img="assets/images/products/plp_turtleneck.png" data-cat="Apparel" aria-label="Add Ribbed Cashmere Turtleneck to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p4" tabindex="0" role="button" aria-label="View Sonic Aurora Headphones GT details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/prod_headphones.png" alt="Sonic Aurora Headphones GT" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Electronics</span>
                  <span class="micro-item-title">Sonic Aurora Headphones GT</span>
                  <span class="micro-item-price">BDT 27,300</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p4" data-name="Sonic Aurora Headphones GT" data-price="27300" data-img="assets/images/products/prod_headphones.png" data-cat="Electronics" aria-label="Add Sonic Aurora Headphones GT to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p11" tabindex="0" role="button" aria-label="View Charcoal Wool Overcoat details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/plp_overcoat.png" alt="Charcoal Wool Overcoat" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Outerwear</span>
                  <span class="micro-item-title">Charcoal Wool Overcoat</span>
                  <span class="micro-item-price">BDT 24,500</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p11" data-name="Charcoal Wool Overcoat" data-price="24500" data-img="assets/images/products/plp_overcoat.png" data-cat="Outerwear" aria-label="Add Charcoal Wool Overcoat to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>

              <div class="micro-item-row" data-id="p12" tabindex="0" role="button" aria-label="View Beige Suede Runner details">
                <div class="micro-item-thumb">
                  <img src="assets/images/products/cat_footwear.jpg" alt="Beige Suede Runner" loading="lazy" />
                </div>
                <div class="micro-item-info">
                  <span class="micro-item-cat">Footwear</span>
                  <span class="micro-item-title">Beige Suede Runner</span>
                  <span class="micro-item-price">BDT 12,500</span>
                </div>
                <button type="button" class="micro-item-add-btn" data-id="p12" data-name="Beige Suede Runner" data-price="12500" data-img="assets/images/products/cat_footwear.jpg" data-cat="Footwear" aria-label="Add Beige Suede Runner to Bag" title="Quick Add">
                  <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify HTML structure**

Run: `node -e "const fs = require('fs'); const html = fs.readFileSync('index.html', 'utf8'); console.log('Has Section:', html.includes('homeMicroMerchSection'), 'Has Look Nav:', html.includes('micro-look-nav'), 'Has Specular:', html.includes('micro-col-specular'));"`
Expected: `Has Section: true Has Look Nav: true Has Specular: true`

- [ ] **Step 3: Commit Task 1**

```bash
git add index.html
git commit -m "feat(micro-merch): rebuild editorial cluster DOM with look switcher, specular layers, and parallax attributes"
```

---

### Task 2: Soft Luxury CSS Styling in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:9240-9445`

**Interfaces:**
- Consumes: CSS variables `--bg-main`, `--font-serif`, `--font-body`, `--text-primary`
- Produces: CSS rules for `.home-micro-merch-section`, `.micro-merch-header`, `.micro-look-btn`, `.micro-merch-col`, `.micro-col-specular`, `.micro-item-row`, `.micro-ripple`

- [ ] **Step 1: Write modern soft-luxury CSS rules for Micro-Merchandising Cluster**

Replace lines 9240–9445 in `css/design-system.css` with:
```css
/* ==========================================================================
   MICRO-MERCHANDISING EDITORIAL CLUSTER (LUXURY DISCOVERY)
   ========================================================================== */
.home-micro-merch-section {
  padding: clamp(48px, 6vw, 80px) 0;
  position: relative;
  overflow: hidden;
}

/* Editorial Header */
.micro-merch-header {
  text-align: center;
  margin-bottom: clamp(32px, 4vw, 48px);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.micro-merch-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  background: rgba(251, 113, 133, 0.08);
  border: 1px solid rgba(251, 113, 133, 0.18);
  color: #FDA4AF;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.micro-merch-headline {
  font-family: var(--font-serif, 'Playfair Display', Georgia, serif);
  font-size: clamp(28px, 3.5vw, 40px);
  font-weight: 500;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  line-height: 1.15;
  margin-bottom: 10px;
}

.micro-merch-subtitle {
  font-size: clamp(13px, 1.5vw, 14.5px);
  color: var(--text-muted, #94A3B8);
  max-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 1️⃣ Look Switcher Tabs & 120fps GPU Progress Bar */
.micro-look-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 24px;
  flex-wrap: wrap;
}

.micro-look-btn {
  position: relative;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  color: var(--text-muted, #94A3B8);
  padding: 8px 18px;
  border-radius: 100px;
  font-size: 12.5px;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition: background-color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              border-color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              color 0.25s cubic-bezier(0.16, 1, 0.3, 1),
              transform 0.2s ease;
}

.micro-look-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.14);
}

.micro-look-btn.active {
  background: rgba(255, 255, 255, 0.08);
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.22);
}

.micro-look-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  width: 100%;
  background: linear-gradient(90deg, #38BDF8, #818CF8, #FB7185);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
}

.micro-look-btn.active .micro-look-progress {
  animation: microTabProgress 5s linear infinite;
}

.micro-look-nav:hover .micro-look-btn.active .micro-look-progress {
  animation-play-state: paused;
}

@keyframes microTabProgress {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

/* 3-Column Luxury Cluster Grid */
.micro-merch-grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  perspective: 1200px;
}

@media (max-width: 1024px) {
  .micro-merch-grid-3col {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
}

@media (max-width: 640px) {
  .micro-merch-grid-3col {
    grid-template-columns: 1fr;
    gap: 18px;
  }
}

/* Luxury Obsidian Column Card */
.micro-merch-col {
  position: relative;
  background: rgba(11, 20, 36, 0.72);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 18px;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  transform-style: preserve-3d;
  will-change: transform;
  overflow: hidden;
}

.micro-merch-col:hover {
  border-color: rgba(255, 255, 255, 0.12);
  box-shadow: 0 24px 52px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

/* Specular Glare Tracking Layer */
.micro-col-specular {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(circle 260px at var(--micro-glare-x, 50%) var(--micro-glare-y, 50%), rgba(255, 255, 255, 0.06), transparent 70%);
  opacity: var(--micro-glare-opacity, 0);
  transition: opacity 0.3s ease;
  z-index: 1;
}

/* Column Header */
.micro-col-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: relative;
  z-index: 2;
}

.micro-col-head-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.micro-col-title {
  font-family: var(--font-body);
  font-size: 15px;
  font-weight: 600;
  color: #FFFFFF;
  letter-spacing: -0.01em;
}

.micro-col-badge {
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 8px;
  border-radius: 100px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted, #94A3B8);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.micro-col-link {
  font-size: 12px;
  font-weight: 500;
  color: var(--text-muted, #94A3B8);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color 0.2s ease, transform 0.2s ease;
  cursor: pointer;
  background: transparent;
  border: none;
  padding: 0;
}

.micro-col-link:hover {
  color: #FFFFFF;
  transform: translateX(2px);
}

/* Product Item List */
.micro-item-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  position: relative;
  z-index: 2;
}

.micro-item-row {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 12px;
  border-radius: 12px;
  text-decoration: none;
  background: rgba(255, 255, 255, 0.015);
  border: 1px solid rgba(255, 255, 255, 0.02);
  transition: background-color 0.22s ease, border-color 0.22s ease, transform 0.22s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.micro-item-row:hover {
  background: rgba(255, 255, 255, 0.045);
  border-color: rgba(255, 255, 255, 0.07);
  transform: translateX(3px);
}

.micro-item-row:focus-visible {
  outline: 2px solid var(--accent, #00d2ff);
  outline-offset: 2px;
}

.micro-item-thumb {
  width: 58px;
  height: 58px;
  border-radius: 8px;
  overflow: hidden;
  background: #090F1C;
  border: 1px solid rgba(255, 255, 255, 0.06);
  flex-shrink: 0;
  position: relative;
}

.micro-item-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
  transform: translateY(var(--micro-img-y, 0px));
}

.micro-item-row:hover .micro-item-thumb img {
  transform: scale(1.08) translateY(var(--micro-img-y, 0px));
}

.micro-item-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.micro-item-cat {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  font-weight: 500;
  color: var(--text-dim, #64748B);
}

.micro-item-title {
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 500;
  color: #F1F5F9;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.micro-item-row:hover .micro-item-title {
  color: #FFFFFF;
}

.micro-item-price {
  font-size: 12.5px;
  font-weight: 600;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
  margin-top: 1px;
}

/* Tactile Quick Add Button with Ripple */
.micro-item-add-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-muted, #94A3B8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  overflow: hidden;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.micro-item-row:hover .micro-item-add-btn {
  background: #FFFFFF;
  color: #070D18;
  border-color: #FFFFFF;
  transform: scale(1.06);
}

.micro-item-add-btn:active {
  transform: scale(0.92);
}

.micro-item-add-btn.added {
  background: #10B981 !important;
  color: #FFFFFF !important;
  border-color: #10B981 !important;
}

.micro-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.4);
  transform: scale(0);
  animation: microRippleWave 0.5s linear;
  pointer-events: none;
}

@keyframes microRippleWave {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
```

- [ ] **Step 2: Verify CSS integrity**

Run: `node -e "const fs = require('fs'); const css = fs.readFileSync('css/design-system.css', 'utf8'); console.log('Has Micro Nav:', css.includes('.micro-look-nav'), 'Has Progress:', css.includes('microTabProgress'), 'Has Specular:', css.includes('.micro-col-specular'));"`
Expected: `Has Micro Nav: true Has Progress: true Has Specular: true`

- [ ] **Step 3: Commit Task 2**

```bash
git add css/design-system.css
git commit -m "feat(micro-merch): modern soft-luxury CSS redesign with obsidian glass, specular sheen, and ripple keyframes"
```

---

### Task 3: Motion Engine Orchestration in `js/animations.js`

**Files:**
- Modify: `js/animations.js:20-25`, `js/animations.js:920-940`

**Interfaces:**
- Consumes: `#homeMicroMerchSection`, `.micro-merch-col`, `.micro-col-specular`, `window._nexLenis`
- Produces: `initMicroMerchClusterMotion()`, 3D tilt transform (`--micro-card-y`), dynamic specular coordinates (`--micro-glare-x/y/opacity`), differential scroll parallax

- [ ] **Step 1: Implement `initMicroMerchClusterMotion` in `js/animations.js`**

Add `initMicroMerchClusterMotion()` to `js/animations.js` and register it in `DOMContentLoaded`:
```javascript
/**
 * initMicroMerchClusterMotion
 * Implements all 4 Motion Standards for the Micro-Merchandising Editorial Cluster:
 * 1. Micro-interactions (scroll reveal stagger entrance + Look switcher sync)
 * 2. 3D Hover Physics (spring lerp mouse tilt + dynamic specular glare)
 * 3. GPU Page Transition (curtain cross-dissolve)
 * 4. Scroll Parallax (differential column depth)
 */
function initMicroMerchClusterMotion() {
  const section = document.getElementById('homeMicroMerchSection') || document.querySelector('.home-micro-merch-section');
  if (!section) return;

  const cols = Array.from(section.querySelectorAll('.micro-merch-col'));
  if (cols.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. MICRO-INTERACTIONS: Scroll Reveal Stagger ────────────────────
  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

    const header = section.querySelector('.micro-merch-header');
    if (header) {
      animate(header,
        { opacity: [0, 1], y: [16, 0] },
        { duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    }

    animate(cols,
      { opacity: [0, 1], y: [32, 0], scale: [0.96, 1] },
      { delay: stagger(0.08, { startDelay: 0.12 }), duration: 0.75, easing: [0.16, 1, 0.3, 1] }
    );
  }, { margin: '0px 0px -8% 0px' });

  // ── 2. PAGE TRANSITION: "See all" & Product Links Curtain Dissolve ──
  const curtain = document.getElementById('pageTransitionOverlay');
  function triggerPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms ease';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => { window.location.href = href; }, 210);
  }

  section.querySelectorAll('.micro-col-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      triggerPageTransition(link.getAttribute('href'));
    });
  });

  if (prefersReduced) return;

  // ── 3. 3D HOVER PHYSICS: Mouse Tilt & Specular Tracking ────────────
  const MAX_TILT = 5.5; // degrees (luxury, non-distorting)
  cols.forEach(col => {
    let rafId = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const LERP = 0.12;
    const lerp = (a, b, t) => a + (b - a) * t;

    function getColParallaxY() {
      return parseFloat(col.style.getPropertyValue('--micro-card-y') || '0');
    }

    function applyColTilt() {
      curTX = lerp(curTX, tgtTX, LERP);
      curTY = lerp(curTY, tgtTY, LERP);
      const py = getColParallaxY();
      col.style.transform =
        `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(10px) translateY(${py}px)`;

      if (Math.abs(curTX - tgtTX) > 0.04 || Math.abs(curTY - tgtTY) > 0.04) {
        rafId = requestAnimationFrame(applyColTilt);
      } else {
        col.style.transform =
          `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(10px) translateY(${py}px)`;
        rafId = null;
      }
    }

    col.addEventListener('mousemove', (e) => {
      const r = col.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY = (dx * MAX_TILT);

      // Specular glare tracking
      const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
      const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
      col.style.setProperty('--micro-glare-x', gx);
      col.style.setProperty('--micro-glare-y', gy);
      col.style.setProperty('--micro-glare-opacity', '1');

      if (!rafId) { rafId = requestAnimationFrame(applyColTilt); }
    });

    col.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;
      col.style.setProperty('--micro-glare-opacity', '0');

      function springBack() {
        curTX = lerp(curTX, 0, 0.18);
        curTY = lerp(curTY, 0, 0.18);
        const py = getColParallaxY();
        col.style.transform =
          `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px) translateY(${py}px)`;
        if (Math.abs(curTX) > 0.04 || Math.abs(curTY) > 0.04) {
          rafId = requestAnimationFrame(springBack);
        } else {
          col.style.transform = `translateY(${py}px)`;
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });

  // ── 4. SCROLL PARALLAX: Differential Column Depth ──────────────────
  let pxTicking = false;

  function updateMicroParallax() {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span = winH + rect.height;
      const prog = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;     // -1 → +1

      cols.forEach(col => {
        const depth = parseFloat(col.getAttribute('data-parallax-depth') || '1');
        const travel = depth * 7.5; // px travel
        const yCol = (centered * travel).toFixed(2);
        col.style.setProperty('--micro-card-y', yCol + 'px');

        if (!col.matches(':hover')) {
          col.style.transform = `translateY(${yCol}px)`;
        }

        // Image internal micro-parallax
        const thumbs = col.querySelectorAll('.micro-item-thumb img');
        thumbs.forEach(img => {
          const yImg = (centered * depth * 4).toFixed(2);
          img.style.setProperty('--micro-img-y', yImg + 'px');
        });
      });
    }
    pxTicking = false;
  }

  function requestParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateMicroParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestParallaxTick); }
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
}
```

- [ ] **Step 2: Verify JS compilation and registration**

Run: `node -e "const fs = require('fs'); const js = fs.readFileSync('js/animations.js', 'utf8'); console.log('Has init function:', js.includes('initMicroMerchClusterMotion'), 'Registered:', js.includes('initMicroMerchClusterMotion();'));"`
Expected: `Has init function: true Registered: true`

- [ ] **Step 3: Commit Task 3**

```bash
git add js/animations.js
git commit -m "feat(micro-merch): 3D mouse tilt physics, specular glare, differential scroll parallax, and page transitions"
```

---

### Task 4: Interactive Logic & Look Switcher Sync in `js/home.js`

**Files:**
- Modify: `js/home.js:920-975`

**Interfaces:**
- Consumes: `.micro-look-btn`, `.micro-item-row`, `.micro-item-add-btn`, `window.nexCart`
- Produces: Look switcher cycling timer, tactile quick-add ripple execution, optimistic bag counter sync

- [ ] **Step 1: Update `initMicroMerchandising` in `js/home.js`**

Update `initMicroMerchandising` in `js/home.js` to support Look Switcher cycling, tab switching, and tactile quick-add ripples:
```javascript
/**
 * 4. Micro-Merchandising Interactions, Look Switcher & View History
 */
function initMicroMerchandising() {
  // ── Look Switcher Tab Auto-Cycling & Interaction ─────────────────────
  const lookBtns = Array.from(document.querySelectorAll('.micro-look-btn'));
  let activeIndex = 0;
  let lookTimer = null;
  const INTERVAL_MS = 5000;

  function switchTab(index) {
    if (lookBtns.length === 0) return;
    lookBtns.forEach((btn, i) => {
      const isActive = i === index;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      const progress = btn.querySelector('.micro-look-progress');
      if (progress) {
        progress.style.animation = 'none';
        progress.offsetHeight; // trigger reflow
        if (isActive) progress.style.animation = 'microTabProgress 5s linear infinite';
      }
    });
    activeIndex = index;
  }

  function startAutoCycle() {
    stopAutoCycle();
    lookTimer = setInterval(() => {
      const nextIndex = (activeIndex + 1) % lookBtns.length;
      switchTab(nextIndex);
    }, INTERVAL_MS);
  }

  function stopAutoCycle() {
    if (lookTimer) {
      clearInterval(lookTimer);
      lookTimer = null;
    }
  }

  lookBtns.forEach((btn, idx) => {
    btn.addEventListener('click', () => {
      switchTab(idx);
      startAutoCycle(); // reset cycle on user click
    });
    btn.addEventListener('mouseenter', stopAutoCycle);
    btn.addEventListener('mouseleave', startAutoCycle);
    btn.addEventListener('focus', stopAutoCycle);
    btn.addEventListener('blur', startAutoCycle);
  });

  if (lookBtns.length > 0) {
    startAutoCycle();
  }

  // ── Row click & keyboard navigation -> PDP with GPU Transition ────────
  document.querySelectorAll('.micro-item-row').forEach(row => {
    function navigateToProduct() {
      const id = row.getAttribute('data-id') || 'p1';
      const targetUrl = `pages/product.html?id=${encodeURIComponent(id)}`;
      const curtain = document.getElementById('pageTransitionOverlay');
      if (curtain) {
        curtain.style.transition = 'opacity 200ms ease';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = targetUrl; }, 210);
      } else {
        window.location.href = targetUrl;
      }
    }

    row.addEventListener('click', (e) => {
      if (e.target.closest('.micro-item-add-btn')) return;
      navigateToProduct();
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.micro-item-add-btn')) return;
        e.preventDefault();
        navigateToProduct();
      }
    });
  });

  // ── Micro Add to Bag with Tactile Ripple & Checkmark Morph ──────────
  document.querySelectorAll('.micro-item-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Ripple physics
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('micro-ripple');
      const existingRipple = btn.querySelector('.micro-ripple');
      if (existingRipple) existingRipple.remove();
      btn.appendChild(circle);

      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10) || 0;
      const img = btn.getAttribute('data-img');
      const cat = btn.getAttribute('data-cat') || 'Apparel';

      if (window.nexCart) {
        window.nexCart.addItem({
          id: id,
          name: name,
          size: 'M',
          price: price,
          qty: 1,
          image: img,
          category: cat
        });

        btn.classList.add('added');
        btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px; color: #FFFFFF;"></i>';
        btn.setAttribute('aria-label', `Added ${name} to Bag`);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = '<i data-lucide="plus" style="width: 14px; height: 14px;"></i>';
          btn.setAttribute('aria-label', `Add ${name} to Bag`);
          if (window.lucide) window.lucide.createIcons();
        }, 1400);
      }
    });
  });

  // Clear history handler
  const clearBtn = document.getElementById('clearHistoryBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('nex_view_history');
      const list = document.getElementById('continueShoppingList');
      if (list) {
        list.innerHTML = '<div style="font-size: 11px; color: var(--text-muted); padding: 12px 0;">Browsing history cleared.</div>';
      }
    });
  }
}
```

- [ ] **Step 2: Verify `js/home.js` syntax**

Run: `node -e "const fs = require('fs'); const js = fs.readFileSync('js/home.js', 'utf8'); console.log('Has switcher loop:', js.includes('microTabProgress'), 'Has ripple:', js.includes('micro-ripple'));"`
Expected: `Has switcher loop: true Has ripple: true`

- [ ] **Step 3: Commit Task 4**

```bash
git add js/home.js
git commit -m "feat(micro-merch): look switcher auto-cycling, tactile quick-add ripple, and GPU transitions in home.js"
```

---

### Task 5: End-to-End Verification via Playwright MCP

**Files:**
- Test against live site: `http://localhost:3000/index.html`

- [ ] **Step 1: Navigate to `http://localhost:3000/index.html` via Playwright MCP**
- [ ] **Step 2: Verify DOM elements and Look Switcher responsiveness**
- [ ] **Step 3: Capture full-page & section verification screenshots**
- [ ] **Step 4: Verify zero console errors and full feature integrity**
- [ ] **Step 5: Clean up scratch/preview files and final git commit**
