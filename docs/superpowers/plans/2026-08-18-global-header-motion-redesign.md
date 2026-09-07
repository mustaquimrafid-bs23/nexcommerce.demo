# Global Header Luxury Motion & Micro-UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign and rebuild the Global Header and Top Announcement Bar into an ultra-clean, luxury editorial navigation system fully integrated with all 4 Motion Standards (Micro-interactions, 3D Hover Effects, Page Transitions, Scroll Parallax) and responsive across all device breakpoints without breaking existing storefront features.

**Architecture:** A lightweight, GPU-composited navigation system using vanilla CSS tokens, obsidian glassmorphism (`rgba(6, 14, 28, 0.72)`), 3D spatial emergence dropdown, spring-lerp tilt physics with dynamic specular glare, magnetic nav gliders, Lenis-synced scroll compaction (`72px → 60px`), and seamless `#pageTransitionOverlay` curtain transitions.

**Tech Stack:** HTML5 Semantic Elements, CSS3 Custom Properties & GPU Transforms, Vanilla JavaScript (ES6+), Motion.dev / GSAP physics primitives, Lucide vector icons.

## Global Constraints
- **Luxury Neutral Foundation**: Base near-black obsidian (`rgba(6, 14, 28, 0.72)`) on dark canvas, delicate 1px hairline borders (`rgba(255, 255, 255, 0.08)`), strictly NO hard or bold borders.
- **Full Integration of All 4 Motion Standards**: Micro-interactions, 3D Hover Effects, Page Transitions, Scroll Parallax.
- **Zero Breakage Guarantee**: Full backward compatibility with Search Modal (`Ctrl + K`), Concierge Modal (`#conciergeNavTrigger`), Cart Drawer, Auth session indicator, and Wishlist badge counts across all 22 storefront pages.
- **Touch & Accessibility Target**: Minimum touch target `≥44×44px` on mobile/tablet, full WCAG 2.1 AA keyboard navigability (`Escape`, `Tab`, `Enter`).

---

### Task 1: Rebuild Global Header & Announcement Bar HTML Markup

**Files:**
- Modify: `index.html:20-120`

**Interfaces:**
- Consumes: Existing Lucide icons, `pages/category.html`, `pages/discovery.html`, `pages/cart.html`, `pages/account.html`.
- Produces: Semantic `.site-header` markup with `.nav-glider-pill` container, `.nav-search-pill-wrap`, `.concierge-nav-btn`, `.nav-icon-btn` with spring badge wrappers, `.nav-more-menu`, and `#mobileNavDrawer`.

- [ ] **Step 1: Inspect and verify existing header markup in index.html**
- [ ] **Step 2: Update HTML markup in `index.html`**
  - Add `.nav-glider-pill` inside `.nav-menu-links`.
  - Refine `#searchTriggerBtn` with `<span class="search-kbd">Ctrl + K</span>`.
  - Ensure `#conciergeNavTrigger`, `#headerWishlistLink`, `a[data-auth-account]`, `#headerCartLink`, and `#headerMoreMenu` have accessible `aria-*` tags and proper badge structure.
  - Refine `#mobileNavDrawer` links with staggered data-stagger attributes.
- [ ] **Step 3: Verify HTML structure in browser or DOM validator**
- [ ] **Step 4: Commit Task 1**

```bash
git add index.html
git commit -m "feat(header): update global header and announcement bar markup"
```

---

### Task 2: Modernize Header Design System & Obsidian Glassmorphism CSS

**Files:**
- Modify: `css/design-system.css` (replace outdated header rules around lines 5926-6345)

**Interfaces:**
- Consumes: Design system color tokens (`--bg-primary`, `--text-primary`, `--accent-pink`, etc.).
- Produces: High-performance CSS classes for `.top-announcement-bar`, `.site-header`, `.site-header.scrolled`, `.nav-glider-pill`, `.nav-search-pill`, `.concierge-nav-btn`, `.nav-icon-btn`, `.bag-count-badge`, `.wishlist-count-badge`, `.nav-more-dropdown`, `.nav-ripple`, and responsive breakpoint overrides.

- [ ] **Step 1: Add magnetic glider indicator and soft obsidian glassmorphism styles**
- [ ] **Step 2: Add 3D spatial emergence dropdown styles with `perspective(800px)`**
- [ ] **Step 3: Add elastic spring pop keyframe animations for count badges**
- [ ] **Step 4: Add dynamic specular glare CSS variables and tactile ripple styles**
- [ ] **Step 5: Add responsive compaction media queries (`max-height: 800px`, `max-width: 1024px`, `max-width: 768px`)**
- [ ] **Step 6: Commit Task 2**

```bash
git add css/design-system.css
git commit -m "style(header): modernize obsidian glassmorphism and 3D spatial dropdown styles"
```

---

### Task 3: Enhance Header Controller & State Management

**Files:**
- Modify: `js/header.js`

**Interfaces:**
- Consumes: `localStorage['nex_curated_wishlist_ids']`, `window.nexCart`, Lucide icons.
- Produces: `window.initHeader()`, `window.nexUpdateWishlistBadge()`, `window.nexUpdateCartBadge()`, magnetic glider tracking, 3-Dot menu toggle with Escape key listener, mobile drawer body lock, and search/concierge event triggers.

- [ ] **Step 1: Implement magnetic nav link glider tracking logic**
- [ ] **Step 2: Implement 3-Dot overflow spatial menu state management with outside click and Escape handlers**
- [ ] **Step 3: Implement elastic badge pop trigger on wishlist and cart count updates**
- [ ] **Step 4: Implement mobile drawer toggle with body scroll lock and staggered item reveal**
- [ ] **Step 5: Commit Task 3**

```bash
git add js/header.js
git commit -m "feat(header): enhance magnetic glider, 3-dot dropdown, and badge sync in js/header.js"
```

---

### Task 4: Integrate All 4 Motion Standards in `js/animations.js`

**Files:**
- Modify: `js/animations.js`

**Interfaces:**
- Consumes: `#siteHeader`, `.top-announcement-bar`, `.concierge-nav-btn`, `.nav-search-pill`, `.nav-icon-btn`, `#pageTransitionOverlay`, `window._nexLenis`.
- Produces: `initGlobalHeaderMotion()` implementing:
  1. Micro-interactions (tactile ripples, sparkles rotation, badge springs).
  2. 3D Hover Effects (spring lerp tilt `±4.5°`, cursor specular sheen tracking).
  3. Page Transitions (GPU cross-dissolve curtain on navigation clicks).
  4. Scroll Parallax & Header Intelligence (dynamic compaction, backdrop blur depth lerp, announcement bar collapse).

- [ ] **Step 1: Add `initGlobalHeaderMotion()` function to `js/animations.js`**
- [ ] **Step 2: Implement Standard 1: Micro-interactions (tactile ripple wave, sparkles micro-motion)**
- [ ] **Step 3: Implement Standard 2: 3D Spring Lerp Tilt & Specular Glare Tracking**
- [ ] **Step 4: Implement Standard 3: Hardware-accelerated GPU Page Transitions (`#pageTransitionOverlay`)**
- [ ] **Step 5: Implement Standard 4: Scroll Parallax & Lenis-synced Header Compaction**
- [ ] **Step 6: Hook `initGlobalHeaderMotion()` into `initAllAnimations()`**
- [ ] **Step 7: Commit Task 4**

```bash
git add js/animations.js
git commit -m "feat(motion): integrate 4 motion standards for global header in js/animations.js"
```

---

### Task 5: Verify Cross-Page Consistency & Browser Testing

**Files:**
- Verify: `index.html`, `pages/*.html`, all breakpoints (Desktop 1440px, Laptop 1280px, Tablet 768px, Mobile 375px).

- [ ] **Step 1: Test header scrolling, compaction, and announcement collapse**
- [ ] **Step 2: Test 3D mouse tilt and specular glare on action buttons, concierge, and search pill**
- [ ] **Step 3: Test 3-Dot overflow dropdown opening, spatial emergence, and keyboard navigation**
- [ ] **Step 4: Test Search trigger (`Ctrl + K`), Concierge trigger, and Cart drawer trigger**
- [ ] **Step 5: Test Mobile Drawer opening, staggered link cascade, and touch navigation**
- [ ] **Step 6: Propagate any unified header improvements across other storefront pages if necessary**
- [ ] **Step 7: Final verification & git commit**
