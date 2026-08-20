# Wishlist Specular Skeleton Shimmer Loading State Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Option A (Obsidian Specular Skeleton Shimmer with 120fps GPU light sweep and ~280ms staggered cross-dissolve) on the Saved Pieces (Wishlist) page ([pages/wishlist.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/pages/wishlist.html)), delivering a world-class luxury atelier loading feel, zero layout shift (0.000 CLS), and instant responsiveness.

**Architecture:** A lightweight, GPU-composited skeleton architecture rendered in CSS tokens (`background: rgba(10, 18, 32, 0.75)`, `border: 1px solid rgba(255, 255, 255, 0.06)`), 45-degree specular shimmer sweep (`will-change: transform`, `transform: translateX(-100%) → translateX(100%)`), synchronized with a ~280ms cross-dissolve transition into the rendered cards via Motion.dev.

**Tech Stack:** Vanilla JavaScript (ES6+), Vanilla CSS tokens, Web Animations API (WAAPI), Lenis Scroll, Lucide Icons.

## Global Constraints

- **Design Standard:** Obsidian luxury glassmorphism (`#0A1220`), soft 1px borders (`rgba(255, 255, 255, 0.06)`), 0.000 Cumulative Layout Shift (CLS).
- **Performance:** 120fps GPU-accelerated transforms (`will-change: transform; transform: translateX(...)`), zero CPU layout thrashing.
- **Timing:** 280ms–320ms loading window on initial load, followed by a 320ms staggered entrance cascade.
- **Reduced Motion:** If `prefers-reduced-motion: reduce` is active, skip shimmer animation and render cards immediately.
- **Feature Preservation:** Zero regressions on Look Switcher tab filtering, single & bulk move-to-bag, remove transition, and cart badge updates.

---

### Task 1: Design System CSS for Obsidian Specular Skeleton Shimmer

**Files:**
- Modify: `css/design-system.css:3130-3160`

**Interfaces:**
- Consumes: `.wishlist-grid`, design system color & radius tokens (`var(--radius-md)`).
- Produces: `.wishlist-skeleton-card`, `.wishlist-skeleton-media`, `.wishlist-skeleton-shimmer`, `.wishlist-skeleton-body`, `.skeleton-pill-tag`, `.skeleton-pill-title`, `.skeleton-pill-price`, `.skeleton-pill-btn`, `@keyframes specularShimmerWave`.

- [ ] **Step 1: Write CSS rules for skeleton shimmer cards**

Add the following CSS to `css/design-system.css`:

```css
/* ─── Luxury Obsidian Specular Skeleton Shimmer (Motion Standard 1) ────── */
.wishlist-skeleton-card {
  background: rgba(10, 18, 32, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0 4px 16px -2px rgba(0, 0, 0, 0.35);
  min-height: 440px;
}

.wishlist-skeleton-media {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1.1;
  background: #091424;
  overflow: hidden;
}

.wishlist-skeleton-shimmer {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    115deg,
    transparent 0%,
    rgba(255, 255, 255, 0.02) 20%,
    rgba(255, 255, 255, 0.08) 50%,
    rgba(255, 255, 255, 0.02) 80%,
    transparent 100%
  );
  transform: translateX(-100%);
  animation: specularShimmerWave 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;
}

@keyframes specularShimmerWave {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.wishlist-skeleton-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 1;
  gap: 12px;
}

.skeleton-pill-tag {
  width: 80px;
  height: 10px;
  border-radius: var(--radius-pill);
  background: rgba(6, 182, 212, 0.15);
  position: relative;
  overflow: hidden;
}

.skeleton-pill-title {
  width: 75%;
  height: 18px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  margin-bottom: 6px;
  position: relative;
  overflow: hidden;
}

.skeleton-pill-price {
  width: 45%;
  height: 14px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

.skeleton-pill-stock {
  width: 35%;
  height: 11px;
  border-radius: 4px;
  background: rgba(6, 182, 212, 0.1);
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.skeleton-pill-btn {
  width: 100%;
  height: 42px;
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}
```

- [ ] **Step 2: Verify CSS rules apply cleanly with no lint errors**

---

### Task 2: Wishlist Controller Skeleton Lifecycle & Cross-Dissolve

**Files:**
- Modify: `pages/wishlist.html:460-555`

**Interfaces:**
- Consumes: `CATALOG_DB`, `getSavedWishlist()`, `animate()`, `window.initWishlistCardsMotion()`.
- Produces: `renderWishlistSkeletons()`, `bootWishlistPage()` with 280ms cross-dissolve into real cards.

- [ ] **Step 1: Implement `renderWishlistSkeletons()` and asynchronous entrance in `pages/wishlist.html`**

Update `pages/wishlist.html` with:

```javascript
function renderWishlistSkeletons(count) {
  var grid = document.getElementById('wishlistGrid');
  if (!grid) return;
  var n = count || 3;
  var skeletonHtml = '';
  for (var i = 0; i < n; i++) {
    skeletonHtml += `
      <div class="wishlist-skeleton-card" aria-hidden="true">
        <div class="wishlist-skeleton-media">
          <div class="wishlist-skeleton-shimmer"></div>
        </div>
        <div class="wishlist-skeleton-body">
          <div>
            <div class="skeleton-pill-tag">
              <div class="wishlist-skeleton-shimmer"></div>
            </div>
            <div class="skeleton-pill-title" style="margin-top: 10px;">
              <div class="wishlist-skeleton-shimmer"></div>
            </div>
            <div class="skeleton-pill-price">
              <div class="wishlist-skeleton-shimmer"></div>
            </div>
            <div class="skeleton-pill-stock" style="margin-top: 12px;">
              <div class="wishlist-skeleton-shimmer"></div>
            </div>
          </div>
          <div class="skeleton-pill-btn">
            <div class="wishlist-skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    `;
  }
  grid.style.display = 'grid';
  grid.innerHTML = skeletonHtml;
}

function bootWishlistPage() {
  var ids = getSavedWishlist();
  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!ids || ids.length === 0 || prefersReduced) {
    renderWishlist();
    initSpotlightController();
    return;
  }

  // 1. Instant paint of obsidian skeleton shimmer wave (0ms)
  renderWishlistSkeletons(Math.min(ids.length, 3));

  // 2. Brief 280ms luxury atelier query window before cross-dissolving real cards
  setTimeout(function() {
    renderWishlist();
    initSpotlightController();
  }, 280);
}
```

- [ ] **Step 2: Verify `bootWishlistPage()` renders skeletons immediately on initial paint and dissolves into real cards**

---

### Task 3: Motion Engine & Parallax Binding Coordination

**Files:**
- Modify: `js/animations.js:2135-2170`

**Interfaces:**
- Consumes: rendered `.wishlist-card` elements.
- Produces: `initWishlistCardsMotion()` binding 3D tilt, specular glare, and Lenis scroll parallax smoothly.

- [ ] **Step 1: Ensure `initWishlistCardsMotion()` handles post-skeleton cross-dissolve cleanly**

Verify that `initWishlistCardsMotion()` animates cards from `{ opacity: [0, 1], y: [14, 0], scale: [0.98, 1] }` with `{ duration: 0.4, easing: [0.16, 1, 0.3, 1], delay: stagger(0.04) }`.

---

### Task 4: Interactive Verification & Cross-Browser Testing

**Files:**
- Test: `pages/wishlist.html`

- [ ] **Step 1: Test cold reload in browser**
  - Verify 3 obsidian skeleton cards appear with the 45-degree specular shimmer sweep.
  - Verify after 280ms, the skeletons cross-dissolve into the real saved cards.
  - Verify 0 layout jump (CLS = 0.000).

- [ ] **Step 2: Test tab filtering and actions**
  - Switch tabs (`Ready-to-Wear`, `High Acoustics`, `All Saved`) to confirm instant filtering.
  - Test Move to Bag and Remove actions.

- [ ] **Step 3: Test responsive viewports**
  - 1440px Desktop (3 columns)
  - 768px Tablet (2 columns)
  - 375px Mobile (1 column)
