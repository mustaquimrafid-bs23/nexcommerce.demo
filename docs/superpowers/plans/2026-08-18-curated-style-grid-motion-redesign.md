# Curated Style Grid — Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `<!-- CURATED FOR YOUR STYLE -->` section into a soft-luxury, minimal editorial showcase with full integration of all 4 Motion Standards: micro-interactions (staggered cascade + tactile quick-add ripple + AI match badge pulse), 3D hover physics (spring lerp mouse tilt + dynamic specular glare + multi-tier obsidian shadows), GPU page transitions, and differential column scroll parallax.

**Architecture:**
1. `index.html`: Update `.curated-grid-4col` card structure to include `.curated-card-specular` glare layers, `.curated-ripple` ripple containers, calibrated `data-parallax-depth` attributes across columns (`1, 2, 3, 2`), and refined editorial metadata.
2. `css/design-system.css`: Complete redesign of curated section styles replacing hard borders with soft translucent glassmorphism (`rgba(255, 255, 255, 0.08)`), multi-tier soft shadows, 3D tilt CSS variables, and fluid responsive layouts.
3. `js/home.js`: Enhanced `renderFeaturedCollection()` supporting tactile quick-add ripples, style profile synchronization, and wishlist persistence.
4. `js/animations.js`: Dedicated `initCuratedGridMotion()` driving mouse tilt spring physics, cursor specular tracking, differential scroll parallax (Lenis-linked), and GPU curtain page transitions.

**Tech Stack:** Vanilla HTML5 / CSS3 · Motion.dev v11 · Lenis Smooth Scroll · Lucide Icons · CSS Custom Properties for 3D physics.

---

## Global Constraints

- **Palette:** Luxury Obsidian `#020B18` base, accent cyan `#3DE0FF`, accent pink `#F13365`, soft muted text `#94A3B8`, pure white `#FFFFFF`.
- **Border Aesthetics:** Strictly **NO hard, bold borders**. Use soft translucent hairlines (`1px solid rgba(255, 255, 255, 0.08)`), subtle glassmorphic backdrop-filters, and soft ambient radial glows.
- **Typography:** Refined display headers (`Outfit` / `Playfair Display`), clean `Work Sans` body.
- **Touch Targets:** Minimum 44×44px for all interactive targets (wishlist buttons, quick-add buttons, card links).
- **Responsiveness:** Flawless across Desktop (1280px+), Tablet (768px–1024px), and Mobile (320px–480px).
- **Reduced Motion:** Full graceful fallback under `prefers-reduced-motion: reduce`.
- **Functional Integrity:** Preserves cart add, wishlist persistence (`nex_curated_wishlist_ids`), and PDP navigation to `pages/product.html?id=...`.

---

## Visual Blueprint

```
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│  CURATED FOR YOUR STYLE (AI RECOMMENDATION & LIFESTYLE EDITORIAL GRID)                       │
│                                                                                              │
│  [✦ Curated for Your Style Profile]                                                          │
│  Pieces matched to your taste.                                              [ View all → ]   │
│  Pieces selected for your evening, travel, and weekend moments — curated by our style team.  │
│                                                                                              │
│  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐                  │
│  │ [✦ Top Pick] │   │ [✦ Favourite]│   │ [✦ Trending] │   │ [✦ Most Loved│                  │
│  │  (♡ Wishlist)│   │  (♡ Wishlist)│   │  (♡ Wishlist)│   │  (♡ Wishlist)│                  │
│  │ ┌──────────┐ │   │ ┌──────────┐ │   │ ┌──────────┐ │   │ ┌──────────┐ │                  │
│  │ │          │ │   │ │          │ │   │ │          │ │   │ │          │ │                  │
│  │ │ Product  │ │   │ │ Product  │ │   │ │ Product  │ │   │ │ Product  │ │                  │
│  │ │ Image    │ │   │ │ Image    │ │   │ │ Image    │ │   │ │ Image    │ │                  │
│  │ │          │ │   │ │          │ │   │ │          │ │   │ │          │ │                  │
│  │ └──────────┘ │   │ └──────────┘ │   │ └──────────┘ │   │ └──────────┘ │                  │
│  │ [Quick Add]  │   │ [Quick Add]  │   │ [Quick Add]  │   │ [Quick Add]  │                  │
│  │ ARC · CASHM. │   │ ARC · MERINO │   │ FORMA · CALF │   │ FORM · AUDIO │                  │
│  │ BDT 18,400   │   │ BDT 24,500   │   │ BDT 28,500   │   │ BDT 32,000   │                  │
│  │ Cashmere Swt │   │ Wool Blazer  │   │ Quilted Tote │   │ Headphone GT │                  │
│  │ Why matches: │   │ Why matches: │   │ Why matches: │   │ Why matches: │                  │
│  │ Pure 2-ply...│   │ Unlined...   │   │ Chevron...   │   │ Titanium...  │                  │
│  │  (depth: 1)  │   │  (depth: 2)  │   │  (depth: 3)  │   │  (depth: 2)  │                  │
│  └──────────────┘   └──────────────┘   └──────────────┘   └──────────────┘                  │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3D Hover & Specular Interaction (Side / Dynamic View)
```
          ↑ translateZ(14px) lift on mouse hover
     ┌───────────────────────────────────────────────────────┐
     │   Card Surface: rotateX(-4deg) rotateY(5deg)          │
     │      \   Dynamic Specular Glare (tracks cursor)       │
     │       \  rgba(255, 255, 255, 0.09) at (mouse-x, y)    │
     └───────────────────────────────────────────────────────┘
          Shadow 1: 0 24px 56px rgba(0, 0, 0, 0.45) (ambient obsidian depth)
          Shadow 2: 0 8px 20px rgba(61, 224, 255, 0.06) (cyan glow accent)
          Shadow 3: 0 2px 6px rgba(0, 0, 0, 0.25)   (crisp contact)
```

---

## File Map

| File | Action | Scope |
|------|--------|-------|
| `index.html` | **MODIFY** | Rebuild curated section DOM with specular glare, ripple spans, and `data-parallax-depth` (~lines 557–690) |
| `css/design-system.css` | **MODIFY** | Replace curated styles with soft luxury glassmorphism + 3D tilt + responsive CSS (~lines 8844–9129) |
| `js/home.js` | **MODIFY** | Upgrade `renderFeaturedCollection()` with tactile ripples, cart actions, and PDP route navigation |
| `js/animations.js` | **MODIFY** | Add `initCuratedGridMotion()` with 3D spring tilt, specular glare tracking, differential scroll parallax, and curtain transitions |

---

## Task 1: Rebuild HTML Structure for Curated Grid

**Files:**
- Modify: `index.html` lines 557–690

**Interfaces:**
- Produces: `#homeCuratedSection`, `.curated-grid-4col`, `.curated-product-card[data-parallax-depth]`, `.curated-card-specular`, `.curated-ripple`

- [ ] **Step 1.1: Replace section markup in `index.html`**

Update `<!-- CURATED FOR YOUR STYLE -->` block to:

```html
    <!-- CURATED FOR YOUR STYLE (AI RECOMMENDATION & LIFESTYLE EDITORIAL GRID) -->
    <section class="home-curated-section" id="homeCuratedSection" aria-label="Curated for Your Style Profile">
      <div class="container">
        <div class="home-section-header-row">
          <div>
            <div class="curated-section-eyebrow">
              <i data-lucide="sparkles" class="curated-eyebrow-icon"></i>
              <span>Curated for Your Style Profile</span>
            </div>
            <h2 class="home-section-title">Pieces matched to your taste.</h2>
            <div class="home-section-sub">Pieces selected for your evening, travel, and weekend moments — curated by our style team.</div>
          </div>
          <a href="pages/category.html?cat=all" class="home-section-link curated-see-all-link">View all &rarr;</a>
        </div>

        <div class="curated-grid-4col" id="curatedGrid">
          <!-- Curated Item 1: Cashmere Sweater -->
          <div class="curated-product-card" data-id="p1" data-parallax-depth="1" role="article">
            <div class="curated-card-specular" aria-hidden="true"></div>
            <div class="curated-match-badge">
              <i data-lucide="sparkles"></i>
              <span>Top Pick</span>
            </div>
            <button class="curated-wishlist-btn" aria-label="Add Architectural Cashmere Sweater to wishlist" title="Save to Wishlist">
              <i data-lucide="heart"></i>
            </button>
            <div class="curated-img-box">
              <img src="assets/images/products/hero_sweater.png" alt="Architectural Cashmere Sweater" loading="lazy" />
              <div class="curated-img-action">
                <button class="curated-quick-add-btn" data-id="p1" data-name="Architectural Cashmere Sweater" data-price="18400" data-img="assets/images/products/hero_sweater.png" data-cat="Apparel" aria-label="Quick Add Architectural Cashmere Sweater">
                  <span class="curated-ripple" aria-hidden="true"></span>
                  <i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i>
                  <span>Quick Add</span>
                </button>
              </div>
            </div>
            <div class="curated-card-body">
              <div class="curated-card-meta">
                <span class="curated-card-cat">ARC · CASHMERE</span>
                <span class="curated-card-price">BDT 18,400</span>
              </div>
              <h3 class="curated-card-title">Architectural Cashmere Sweater</h3>
              <p class="curated-card-reason"><span class="curated-reason-tag">Why it matches:</span> Pure 2-ply Mongolian cashmere tailored for relaxed evening warmth.</p>
            </div>
          </div>

          <!-- Curated Item 2: Structured Wool Blazer -->
          <div class="curated-product-card" data-id="p2" data-parallax-depth="2" role="article">
            <div class="curated-card-specular" aria-hidden="true"></div>
            <div class="curated-match-badge">
              <i data-lucide="sparkles"></i>
              <span>Staff Favourite</span>
            </div>
            <button class="curated-wishlist-btn" aria-label="Add Structured Wool Blazer to wishlist" title="Save to Wishlist">
              <i data-lucide="heart"></i>
            </button>
            <div class="curated-img-box">
              <img src="assets/images/products/plp_blazer.png" alt="Structured Wool Blazer" loading="lazy" />
              <div class="curated-img-action">
                <button class="curated-quick-add-btn" data-id="p2" data-name="Structured Wool Blazer" data-price="24500" data-img="assets/images/products/plp_blazer.png" data-cat="Apparel" aria-label="Quick Add Structured Wool Blazer">
                  <span class="curated-ripple" aria-hidden="true"></span>
                  <i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i>
                  <span>Quick Add</span>
                </button>
              </div>
            </div>
            <div class="curated-card-body">
              <div class="curated-card-meta">
                <span class="curated-card-cat">ARC · MERINO WOOL</span>
                <span class="curated-card-price">BDT 24,500</span>
              </div>
              <h3 class="curated-card-title">Structured Wool Blazer</h3>
              <p class="curated-card-reason"><span class="curated-reason-tag">Why it matches:</span> Unlined Italian merino weave for sharp indoor-outdoor layering.</p>
            </div>
          </div>

          <!-- Curated Item 3: Structured Quilted Tote -->
          <div class="curated-product-card" data-id="p7" data-parallax-depth="3" role="article">
            <div class="curated-card-specular" aria-hidden="true"></div>
            <div class="curated-match-badge">
              <i data-lucide="sparkles"></i>
              <span>Trending Now</span>
            </div>
            <button class="curated-wishlist-btn" aria-label="Add Quilted Leather Structured Tote to wishlist" title="Save to Wishlist">
              <i data-lucide="heart"></i>
            </button>
            <div class="curated-img-box">
              <img src="assets/images/products/prod_tote.png" alt="Quilted Leather Structured Tote" loading="lazy" />
              <div class="curated-img-action">
                <button class="curated-quick-add-btn" data-id="p7" data-name="Quilted Leather Structured Tote" data-price="28500" data-img="assets/images/products/prod_tote.png" data-cat="Leather Goods" aria-label="Quick Add Quilted Leather Structured Tote">
                  <span class="curated-ripple" aria-hidden="true"></span>
                  <i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i>
                  <span>Quick Add</span>
                </button>
              </div>
            </div>
            <div class="curated-card-body">
              <div class="curated-card-meta">
                <span class="curated-card-cat">FORMA · FULL-GRAIN CALF</span>
                <span class="curated-card-price">BDT 28,500</span>
              </div>
              <h3 class="curated-card-title">Quilted Leather Structured Tote</h3>
              <p class="curated-card-reason"><span class="curated-reason-tag">Why it matches:</span> Chevron-quilted calfskin with dedicated padded laptop compartment.</p>
            </div>
          </div>

          <!-- Curated Item 4: Studio Acoustics Headphone GT -->
          <div class="curated-product-card" data-id="p4" data-parallax-depth="2" role="article">
            <div class="curated-card-specular" aria-hidden="true"></div>
            <div class="curated-match-badge">
              <i data-lucide="sparkles"></i>
              <span>Most Loved</span>
            </div>
            <button class="curated-wishlist-btn" aria-label="Add Studio Acoustics Headphone GT to wishlist" title="Save to Wishlist">
              <i data-lucide="heart"></i>
            </button>
            <div class="curated-img-box">
              <img src="assets/images/lifestyle/thumb_headphones.jpg" alt="Studio Acoustics Headphone GT" loading="lazy" />
              <div class="curated-img-action">
                <button class="curated-quick-add-btn" data-id="p4" data-name="Studio Acoustics Headphone GT" data-price="32000" data-img="assets/images/lifestyle/thumb_headphones.jpg" data-cat="Acoustics" aria-label="Quick Add Studio Acoustics Headphone GT">
                  <span class="curated-ripple" aria-hidden="true"></span>
                  <i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i>
                  <span>Quick Add</span>
                </button>
              </div>
            </div>
            <div class="curated-card-body">
              <div class="curated-card-meta">
                <span class="curated-card-cat">FORM · TITANIUM AUDIO</span>
                <span class="curated-card-price">BDT 32,000</span>
              </div>
              <h3 class="curated-card-title">Studio Acoustics Headphone GT</h3>
              <p class="curated-card-reason"><span class="curated-reason-tag">Why it matches:</span> Precision acoustic tuning with memory foam calfskin ear cushions.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 1.2: Verify DOM structure**

```powershell
Select-String -Path "index.html" -Pattern "curated-card-specular|curated-ripple|homeCuratedSection|curated-see-all-link"
```
Expected: Matches found.

- [ ] **Step 1.3: Commit**

```bash
git add index.html
git commit -m "feat(curated): rebuild curated grid DOM with specular layers, ripple spans, and parallax depths"
```

---

## Task 2: CSS — Modern Soft-Luxury Redesign

**Files:**
- Modify: `css/design-system.css` lines ~8844–9129

**Interfaces:**
- Consumes: `--accent-cyan`, `--accent-pink`, `--font-display`, `--font-body`, `--text-muted`
- Produces: Soft glassmorphic hairlines, multi-tier obsidian shadows, 3D tilt CSS variables (`--curated-tilt-x`, `--curated-tilt-y`, `--curated-glare-x`, `--curated-glare-y`, `--curated-glare-opacity`, `--curated-shadow-lift`), image micro-parallax, and responsive media queries.

- [ ] **Step 2.1: Replace Curated Section CSS block in `css/design-system.css`**

Replace old curated section styles with:

```css
/* ==========================================================================
   "CURATED FOR YOUR STYLE" — SOFT LUXURY MOTION REDESIGN
   ========================================================================== */

.home-curated-section {
  padding: 44px 0 54px;
  position: relative;
  overflow: hidden;
}

.curated-section-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(61, 224, 255, 0.06);
  border: 1px solid rgba(61, 224, 255, 0.22);
  border-radius: 9999px;
  padding: 4px 12px;
  font-family: var(--font-body);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-cyan);
  margin-bottom: 8px;
  box-shadow: 0 2px 10px rgba(61, 224, 255, 0.10);
}

.curated-eyebrow-icon {
  width: 12px;
  height: 12px;
  color: var(--accent-cyan);
}

.curated-see-all-link {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-muted);
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: color 200ms ease;
}
.curated-see-all-link:hover {
  color: #FFFFFF;
}

/* 4-Column Grid with 3D Perspective */
.curated-grid-4col {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-top: 24px;
  perspective: 1200px;
  perspective-origin: 50% 30%;
}

/* 3D Tilt Card Shell */
.curated-product-card {
  --curated-tilt-x: 0deg;
  --curated-tilt-y: 0deg;
  --curated-glare-x: 50%;
  --curated-glare-y: 50%;
  --curated-glare-opacity: 0;
  --curated-shadow-lift: 0;

  background: linear-gradient(175deg,
    rgba(14, 26, 50, 0.65) 0%,
    rgba(5, 14, 30, 0.85) 100%);
  backdrop-filter: blur(20px) saturate(1.3);
  -webkit-backdrop-filter: blur(20px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  cursor: pointer;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;

  /* 3D Transform driven by JS */
  transform:
    rotateX(var(--curated-tilt-x))
    rotateY(var(--curated-tilt-y))
    translateZ(0)
    translateY(var(--curated-card-y, 0px));

  /* Multi-tier realistic soft shadow */
  box-shadow:
    0 calc(8px + var(--curated-shadow-lift) * 24px) calc(22px + var(--curated-shadow-lift) * 36px) rgba(0, 0, 0, 0.38),
    0 calc(2px + var(--curated-shadow-lift) * 8px) calc(10px + var(--curated-shadow-lift) * 16px) rgba(61, 224, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);

  transition:
    box-shadow 400ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 300ms ease;
  will-change: transform;
}

.curated-product-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
}

/* Specular Glare Tracking Layer */
.curated-card-specular {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--curated-glare-x) var(--curated-glare-y),
    rgba(255, 255, 255, 0.09) 0%,
    transparent 60%
  );
  opacity: var(--curated-glare-opacity);
  pointer-events: none;
  z-index: 6;
  transition: opacity 180ms ease;
}

/* AI Match Badge */
.curated-match-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 7;
  background: rgba(4, 12, 28, 0.82);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(61, 224, 255, 0.25);
  border-radius: 9999px;
  padding: 4px 10px;
  font-family: var(--font-body);
  font-size: 10.5px;
  font-weight: 700;
  color: #FFFFFF;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  letter-spacing: 0.04em;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
  transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
}
.curated-match-badge svg {
  width: 12px;
  height: 12px;
  color: var(--accent-cyan);
}
.curated-product-card:hover .curated-match-badge {
  border-color: rgba(61, 224, 255, 0.45);
  background: rgba(4, 12, 28, 0.95);
  transform: translateY(-1px);
}

/* Wishlist Button */
.curated-wishlist-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 34px;
  height: 34px;
  min-width: 44px;
  min-height: 44px;
  margin: -5px;
  border-radius: 50%;
  background: rgba(4, 12, 28, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  z-index: 7;
  transition:
    transform 220ms cubic-bezier(0.34, 1.56, 0.64, 1),
    color 180ms ease,
    background 180ms ease,
    border-color 180ms ease;
}
.curated-wishlist-btn svg {
  width: 14px;
  height: 14px;
}
.curated-wishlist-btn:hover {
  transform: scale(1.14);
  color: #FFFFFF;
  border-color: rgba(255, 255, 255, 0.28);
}
.curated-wishlist-btn.active {
  color: #F43F5E;
  background: rgba(244, 63, 94, 0.16);
  border-color: rgba(244, 63, 94, 0.55);
}
.curated-wishlist-btn.active svg {
  fill: #F43F5E;
}

/* Image Container */
.curated-img-box {
  width: 100%;
  aspect-ratio: 1 / 1.12;
  overflow: hidden;
  background: radial-gradient(circle at center,
    rgba(255, 255, 255, 0.03) 0%,
    rgba(0, 0, 0, 0.25) 100%);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.curated-img-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transform: translateY(var(--curated-img-y, 0px)) scale(1.05);
  will-change: transform;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}
.curated-product-card:hover .curated-img-box img {
  transform: translateY(var(--curated-img-y, 0px)) scale(1.09);
}

.curated-img-box::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 48px;
  background: linear-gradient(180deg, transparent 0%, rgba(5, 14, 30, 0.85) 100%);
  pointer-events: none;
}

/* Quick Add Overlay */
.curated-img-action {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  z-index: 8;
  display: flex;
  justify-content: center;
  opacity: 0;
  transform: translateY(6px);
  transition:
    opacity 220ms cubic-bezier(0.25, 1, 0.5, 1),
    transform 220ms cubic-bezier(0.25, 1, 0.5, 1);
  pointer-events: none;
}
.curated-product-card:hover .curated-img-action,
.curated-product-card:focus-within .curated-img-action {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.curated-quick-add-btn {
  position: relative;
  overflow: hidden;
  width: 100%;
  height: 36px;
  min-height: 44px;
  background: rgba(255, 255, 255, 0.94);
  color: #011630;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border: none;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.38);
  transition:
    background 160ms ease,
    transform 160ms ease,
    box-shadow 160ms ease;
  -webkit-font-smoothing: antialiased;
}
.curated-quick-add-btn:hover {
  background: #FFFFFF;
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(255, 255, 255, 0.25);
}
.curated-quick-add-btn:active {
  transform: scale(0.97);
}

.curated-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(1, 22, 48, 0.25);
  pointer-events: none;
  transform: scale(0);
  opacity: 1;
}
.curated-ripple.animating {
  animation: curatedRippleOut 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes curatedRippleOut {
  to { transform: scale(4); opacity: 0; }
}

/* Card Body & Typography */
.curated-card-body {
  padding: 16px 16px 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: 4px;
  position: relative;
  z-index: 2;
}

.curated-card-meta {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 8px;
}

.curated-card-cat {
  font-family: var(--font-body);
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.curated-card-price {
  font-family: var(--font-display);
  font-size: 14px;
  font-weight: 700;
  color: #FFFFFF;
  font-variant-numeric: tabular-nums;
}

.curated-card-title {
  margin: 2px 0 0;
  font-family: var(--font-body);
  font-size: 13.5px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.35;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.curated-card-reason {
  margin: 4px 0 0;
  font-size: 11.5px;
  color: var(--text-muted);
  line-height: 1.45;
  flex: 1;
}

.curated-reason-tag {
  color: var(--accent-cyan);
  font-weight: 600;
}

/* Responsive Media Queries */
@media (max-width: 1080px) {
  .curated-grid-4col {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
}

@media (max-width: 640px) {
  .home-curated-section { padding: 32px 0 40px; }
  .curated-grid-4col {
    display: flex;
    overflow-x: auto;
    gap: 14px;
    padding-bottom: 12px;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
    perspective: none;
  }
  .curated-grid-4col::-webkit-scrollbar { display: none; }
  .curated-product-card {
    flex: 0 0 240px;
    min-width: 240px;
    scroll-snap-align: start;
    transform: none !important;
  }
  .curated-img-action {
    opacity: 1;
    transform: none;
    pointer-events: auto;
  }
}

@media (prefers-reduced-motion: reduce) {
  .curated-product-card,
  .curated-img-box img,
  .curated-quick-add-btn {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2.2: Verify CSS replacement**

```powershell
Select-String -Path "css\design-system.css" -Pattern "curated-card-specular|curated-ripple|curated-see-all-link"
```
Expected: Matches found.

- [ ] **Step 2.3: Commit**

```bash
git add css/design-system.css
git commit -m "feat(curated): modern soft luxury CSS redesign with 3D tilt shell and specular API"
```

---

## Task 3: JS — Micro-Interactions (Tactile Quick-Add Ripple & Profile Sync)

**Files:**
- Modify: `js/home.js` lines ~785–885

**Interfaces:**
- Consumes: `.curated-product-card`, `.curated-quick-add-btn`, `.curated-wishlist-btn`, `.curated-see-all-link`, `window.nexCart`, `window.NexStyleProfile`
- Produces: Expanding tactile ripple on `.curated-quick-add-btn`, cart addition, PDP curtain routing, wishlist toggling.

- [ ] **Step 3.1: Upgrade `renderFeaturedCollection()` in `js/home.js`**

Replace `renderFeaturedCollection()` with:

```javascript
/**
 * 3. Curated "Pieces Matched to Your Taste" AI Recommendation Interactions
 */
function renderFeaturedCollection() {
  // Sync AI Style Profile context if user has a profile saved
  try {
    if (window.NexStyleProfile && typeof window.NexStyleProfile.getActiveProfile === 'function') {
      const activeProfile = window.NexStyleProfile.getActiveProfile();
      if (activeProfile && activeProfile.stylePreferences && activeProfile.stylePreferences.length > 0) {
        const topPref = activeProfile.stylePreferences.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ');
        const eyebrowEl = document.querySelector('.curated-section-eyebrow span');
        if (eyebrowEl) {
          eyebrowEl.textContent = `Matched with Style Profile: ${topPref}`;
        }
      }
    }
  } catch (err) {
    console.warn('Style profile sync error:', err);
  }

  // Wishlist persistence & toggle
  const WISHLIST_KEY = 'nex_curated_wishlist_ids';
  let savedWishlist = [];
  try {
    savedWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch (e) {
    savedWishlist = [];
  }

  document.querySelectorAll('.curated-product-card').forEach(card => {
    const id = card.getAttribute('data-id');
    const wishlistBtn = card.querySelector('.curated-wishlist-btn');

    if (wishlistBtn && savedWishlist.includes(id)) {
      wishlistBtn.classList.add('active');
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wishlistBtn.classList.toggle('active');
        const isActive = wishlistBtn.classList.contains('active');

        try {
          let list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
          if (isActive && !list.includes(id)) {
            list.push(id);
          } else if (!isActive) {
            list = list.filter(item => item !== id);
          }
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
        } catch (e) {}

        if (window.nexUpdateWishlistBadge) window.nexUpdateWishlistBadge();
      });
    }

    // Card click -> PDP with GPU curtain transition
    card.addEventListener('click', (e) => {
      if (e.target.closest('.curated-quick-add-btn') || e.target.closest('.curated-wishlist-btn')) return;
      const targetId = id || 'p1';
      const targetUrl = `pages/product.html?id=${encodeURIComponent(targetId)}`;
      const curtain = document.getElementById('pageTransitionOverlay');
      if (curtain) {
        curtain.style.transition = 'opacity 200ms ease';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = targetUrl; }, 210);
      } else {
        window.location.href = targetUrl;
      }
    });
  });

  // Add to Bag clicks with tactile ripple
  document.querySelectorAll('.curated-quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Tactile ripple trigger
      const rippleEl = btn.querySelector('.curated-ripple');
      if (rippleEl) {
        rippleEl.classList.remove('animating');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        rippleEl.style.width  = size + 'px';
        rippleEl.style.height = size + 'px';
        rippleEl.style.left   = (e.clientX - rect.left - size / 2) + 'px';
        rippleEl.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
        void rippleEl.offsetWidth;
        rippleEl.classList.add('animating');
        rippleEl.addEventListener('animationend', () => {
          rippleEl.classList.remove('animating');
        }, { once: true });
      }

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

        btn.innerHTML = '<span class="curated-ripple" aria-hidden="true"></span><i data-lucide="check" style="width: 14px; height: 14px;"></i> <span>Added</span>';
        btn.style.background = '#10B981';
        btn.style.color = '#FFFFFF';
        if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<span class="curated-ripple" aria-hidden="true"></span><i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i> <span>Quick Add</span>';
          btn.style.background = '';
          btn.style.color = '';
          if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
        }, 1600);
      }
    });
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
```

- [ ] **Step 3.2: Verify `home.js`**

```powershell
Select-String -Path "js\home.js" -Pattern "curated-ripple|curated-wishlist-btn|renderFeaturedCollection"
```
Expected: Matches found.

- [ ] **Step 3.3: Commit**

```bash
git add js/home.js
git commit -m "feat(curated): tactile quick-add ripple, wishlist persistence, and curtain routing"
```

---

## Task 4: JS — 3D Hover Physics, Specular Sheen, Parallax & Page Transitions

**Files:**
- Modify: `js/animations.js` — add `initCuratedGridMotion()` and invoke it in `DOMContentLoaded`
- Modify: `index.html` — bump versions

**Interfaces:**
- Consumes: `#homeCuratedSection`, `.curated-product-card`, `.curated-card-specular`, `window._nexLenis`
- Produces: 3D spring-lerp tilt (`--curated-tilt-x/y`), specular tracking (`--curated-glare-x/y/opacity`), differential scroll parallax (`--curated-card-y`, `--curated-img-y`), and curtain transition on "View all" link.

- [ ] **Step 4.1: Add `initCuratedGridMotion()` in `js/animations.js`**

Add after `initIntentCardMotion()`:

```javascript
/**
 * initCuratedGridMotion
 * Implements all 4 Motion Standards for Curated Style Grid:
 * 1. Micro-interactions (scroll-reveal stagger)
 * 2. 3D Hover Physics (spring lerp mouse tilt + dynamic specular glare)
 * 3. GPU Page Transition (curtain cross-dissolve)
 * 4. Scroll Parallax (differential column depth)
 */
function initCuratedGridMotion() {
  const section = document.getElementById('homeCuratedSection');
  if (!section) return;

  const cards = Array.from(section.querySelectorAll('.curated-product-card'));
  if (cards.length === 0) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. MICRO-INTERACTIONS: Scroll Reveal Stagger ────────────────────
  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

    animate(cards,
      { opacity: [0, 1], y: [28, 0], scale: [0.96, 1] },
      { delay: stagger(0.08, { startDelay: 0.1 }), duration: 0.75, easing: [0.16, 1, 0.3, 1] }
    );
  }, { margin: '0px 0px -8% 0px' });

  // ── 2. PAGE TRANSITION: "View all" Link Curtain Dissolve ───────────
  const seeAllLink = section.querySelector('.curated-see-all-link');
  if (seeAllLink) {
    seeAllLink.addEventListener('click', (e) => {
      e.preventDefault();
      const curtain = document.getElementById('pageTransitionOverlay');
      const targetUrl = seeAllLink.getAttribute('href');
      if (curtain) {
        curtain.style.transition = 'opacity 200ms ease';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = targetUrl; }, 210);
      } else {
        window.location.href = targetUrl;
      }
    });
  }

  if (prefersReduced) return;

  // ── 3. 3D HOVER PHYSICS: Mouse Tilt & Specular Tracking ────────────
  const MAX_TILT = 6.5; // degrees
  cards.forEach(card => {
    let rafId = null;
    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
    const LERP = 0.12;
    const lerp = (a, b, t) => a + (b - a) * t;

    function getCardParallaxY() {
      return parseFloat(card.style.getPropertyValue('--curated-card-y') || '0');
    }

    function applyCardTilt() {
      curTX = lerp(curTX, tgtTX, LERP);
      curTY = lerp(curTY, tgtTY, LERP);
      const py = getCardParallaxY();
      card.style.setProperty('--curated-shadow-lift', '1');
      card.style.transform =
        `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;

      if (Math.abs(curTX - tgtTX) > 0.05 || Math.abs(curTY - tgtTY) > 0.05) {
        rafId = requestAnimationFrame(applyCardTilt);
      } else {
        card.style.transform =
          `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;
        rafId = null;
      }
    }

    card.addEventListener('mousemove', (e) => {
      const r  = card.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY =  (dx * MAX_TILT);

      // Specular glare tracking
      const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
      const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
      card.style.setProperty('--curated-glare-x', gx);
      card.style.setProperty('--curated-glare-y', gy);
      card.style.setProperty('--curated-glare-opacity', '1');

      if (!rafId) { rafId = requestAnimationFrame(applyCardTilt); }
    });

    card.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;
      card.style.setProperty('--curated-glare-opacity', '0');
      card.style.setProperty('--curated-shadow-lift', '0');

      function springBack() {
        curTX = lerp(curTX, 0, 0.18);
        curTY = lerp(curTY, 0, 0.18);
        const py = getCardParallaxY();
        card.style.transform =
          `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px) translateY(${py}px)`;
        if (Math.abs(curTX) > 0.05 || Math.abs(curTY) > 0.05) {
          rafId = requestAnimationFrame(springBack);
        } else {
          card.style.transform = `translateY(${py}px)`;
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });

  // ── 4. SCROLL PARALLAX: Differential Column Depth ──────────────────
  let pxTicking = false;

  function updateCuratedParallax() {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span     = winH + rect.height;
      const prog     = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;         // -1 → +1

      cards.forEach(card => {
        const depth  = parseInt(card.getAttribute('data-parallax-depth') || '1', 10);
        const travel = depth * 7; // px
        const yCard  = (centered * travel).toFixed(2);
        card.style.setProperty('--curated-card-y', yCard + 'px');

        if (!card.matches(':hover')) {
          card.style.transform = `translateY(${yCard}px)`;
        }

        // Image internal micro-parallax
        const img = card.querySelector('.curated-img-box img');
        if (img) {
          const yImg = (centered * depth * 4.5).toFixed(2);
          img.style.setProperty('--curated-img-y', yImg + 'px');
        }
      });
    }
    pxTicking = false;
  }

  function requestParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateCuratedParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestParallaxTick); }
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
}
```

- [ ] **Step 4.2: Update `DOMContentLoaded` and `initHoverEffects`**

In `js/animations.js`:
- Exclude `.curated-product-card` from generic `initHoverEffects()` to prevent transform collision.
- Invoke `initCuratedGridMotion()` inside `DOMContentLoaded`.

- [ ] **Step 4.3: Version bump in `index.html`**

Update `animations.js?v=9` → `animations.js?v=10` and `home.js?v=24` → `home.js?v=25`.

- [ ] **Step 4.4: Commit**

```bash
git add js/animations.js index.html
git commit -m "feat(curated): 3D mouse tilt physics, specular sheen, differential scroll parallax, and page transitions"
```

---

## Task 5: Responsive & Cross-Browser QA

**Files:**
- Modify: `index.html` — bump `design-system.css?v=24`

- [ ] **Step 5.1: Desktop (1280px+) verification**
  - 4-column balanced grid with soft translucent hairlines and ambient badges.
  - Smooth 3D tilt and specular highlight on mouse move.
  - Quick-add ripple and cart addition.
  - Card and "View all" link GPU curtain dissolve.

- [ ] **Step 5.2: Tablet (1024px) verification**
  - 2-column balanced layout with comfortable touch targets.

- [ ] **Step 5.3: Mobile (≤640px) verification**
  - Smooth horizontal scroll carousel, `transform: none !important` applied, quick-add buttons accessible.

- [ ] **Step 5.4: Reduced motion verification**
  - Emulate `prefers-reduced-motion: reduce` — ensure completely static, graceful presentation.

- [ ] **Step 5.5: Final commit**

```bash
git add index.html
git commit -m "chore(curated): bump CSS v24 and complete responsive QA"
```

---

## Verification Plan

### Automated Checks
```powershell
# 1. Check all essential DOM IDs and classes
Select-String -Path "index.html" -Pattern "homeCuratedSection|curated-card-specular|curated-ripple|curated-wishlist-btn"
# 2. Check CSS custom properties
Select-String -Path "css\design-system.css" -Pattern "--curated-tilt-x|--curated-glare-opacity|--curated-card-y|--curated-img-y"
# 3. Check JS functions
Select-String -Path "js\animations.js" -Pattern "initCuratedGridMotion"
Select-String -Path "js\home.js" -Pattern "renderFeaturedCollection"
```

### Manual Verification Checklist
| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Scroll to Curated section | Cascade entrance animation for all 4 cards |
| 2 | Hover over any card | Card tilts in 3D with cursor-following specular glare |
| 3 | Move mouse off card | Smooth spring lerp back to 0° |
| 4 | Click Quick Add | Tactile ripple expands, badge updates to "Added", cart count increments |
| 5 | Click Wishlist Heart | Heart animates active, persists to localStorage |
| 6 | Click card surface | GPU curtain cross-dissolve to PDP |
| 7 | Click "View all" | GPU curtain cross-dissolve to category page |
| 8 | Scroll page slowly | Differential depth drift across 4 columns |
| 9 | Mobile 375px | Horizontal swipeable carousel with quick add visible |
