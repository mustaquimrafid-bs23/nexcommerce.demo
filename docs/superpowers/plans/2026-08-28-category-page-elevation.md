# Category Page Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade `http://localhost:3000/category` into a world-class luxury editorial PLP with 100% UI, UX, feature, animation, and motion parity with `feature/storefront-elevation`.

**Architecture:** Create dedicated modular components in `components/category/` (`CategoryHero`, `CuratedCapsuleSpotlight`, `CategoryToolbar`, `ProductCardElevated`, `CategoryProductGrid`), orchestrating state and animations in `app/category/page.tsx`.

**Tech Stack:** Next.js 15+ App Router · React 19 · TypeScript · Tailwind CSS v4 · Framer Motion (`motion/react`) · Lucide Icons · Zustand (`useCartStore`, `useWishlistStore`).

## Global Constraints

- Typography: `Manrope` / `Plus Jakarta Sans` for titles, `Inter` for metadata & UI labels.
- Color System: Obsidian `#010C1E` / `#00142e` luxury dark theme with 1px hairline borders (`rgba(255,255,255,0.09)`).
- Card ratio: 3:4 aspect ratio with studio containment for objects.
- 120fps GPU Progress Bar: `scaleX(0) -> scaleX(1)` with `transform-origin: left center` and `will-change: transform`.
- Accessibility: WCAG 2.1 AA compliant touch targets ($\ge 44\text{px}$), roving tab index, ARIA attributes.
- Responsiveness: 4 columns desktop (`1440px`), 3 columns tablet (`1024px`), 2 columns mobile (`375px`).

---

### Task 1: Editorial Category Masthead & Dynamic Breadcrumb Navigation

**Files:**
- Create: `components/category/CategoryHero.tsx`
- Modify: `app/category/page.tsx`

**Interfaces:**
- Produces: `CategoryHero` component accepting `selectedCategory: string` and dynamic eyebrow/title mappings.

- [ ] **Step 1: Create `components/category/CategoryHero.tsx`**
  - Implement full-width lifestyle backdrop with subtle vignette.
  - Implement breadcrumbs (`Maison / Collections / [Category Name]`).
  - Dynamic eyebrow tags:
    - `all`: `COLLECTIONS · AW26`
    - `outerwear`: `OUTERWEAR & KNITWEAR · AW26`
    - `tailoring`: `TAILORING & BLAZERS · AW26`
    - `footwear`: `ARTISANAL FOOTWEAR · AW26`
    - `accessories`: `FINE ACCESSORIES & AUDIO · AW26`
    - `new`: `NEW ARRIVALS · AW26`
  - Bold Manrope H1 heading and editorial subtitle.

- [ ] **Step 2: Connect `CategoryHero` to `app/category/page.tsx`**
  - Render `CategoryHero` at top of page and pass `selectedCategory`.

- [ ] **Step 3: Verify in browser**
  - Inspect `http://localhost:3000/category` to verify breadcrumb, eyebrow tag, and typography.

---

### Task 2: Curated Capsule Spotlight (3-Look Switcher & 120fps GPU Progress Bar)

**Files:**
- Create: `components/category/CuratedCapsuleSpotlight.tsx`
- Modify: `app/category/page.tsx`

**Interfaces:**
- Produces: `CuratedCapsuleSpotlight` component accepting `onSelectCategory: (cat: string) => void`.

- [ ] **Step 1: Create `components/category/CuratedCapsuleSpotlight.tsx`**
  - Define 3 signature looks (`01 TAILORING`, `02 ACOUSTICS`, `03 FOOTWEAR`) with lifestyle photography, copy, and featured piece metadata.
  - Implement 120fps GPU progress bar using `requestAnimationFrame` with smooth `scaleX` transform.
  - Implement pause/resume on mouse hover and keyboard focus.
  - Implement roving tab index and arrow key navigation for look tabs.
  - Implement featured piece capsule card with 1-click Quick Add button directly dispatching to `useCartStore` with visual confirmation.
  - Implement "Explore Capsule" button syncing category filter.

- [ ] **Step 2: Mount `CuratedCapsuleSpotlight` in `app/category/page.tsx`**
  - Render inside container above the filter toolbar.

- [ ] **Step 3: Verify in browser**
  - Test look auto-rotation, pause on hover, tab switching, and 1-click Quick Add.

---

### Task 3: Architectural Filter Bar & Sort/Count Toolbar

**Files:**
- Create: `components/category/CategoryToolbar.tsx`
- Modify: `app/category/page.tsx`

**Interfaces:**
- Produces: `CategoryToolbar` component accepting category, sort, search props, and callbacks.

- [ ] **Step 1: Create `components/category/CategoryToolbar.tsx`**
  - Live piece count badge (`8 PIECES AVAILABLE`).
  - Architectural 2px-radius filter pills with active state indicator and mobile horizontal scroll.
  - Search input with clear button.
  - Custom styled sort select (`Featured / Recommended`, `Price: Low to High`, `Price: High to Low`, `Highest Rated`).

- [ ] **Step 2: Sync URL query params with Next.js router**
  - Use `useSearchParams` and `useRouter` to update `?cat=` query param on pill selection and read on mount.

- [ ] **Step 3: Verify in browser**
  - Check filter switching, URL param persistence, and mobile scrollability.

---

### Task 4: 4-Column Luxury Product Card & Grid (3D Tilt, Swatches, Slide-Up Quick Add)

**Files:**
- Create: `components/category/ProductCardElevated.tsx`
- Create: `components/category/CategoryProductGrid.tsx`
- Modify: `app/category/page.tsx`

**Interfaces:**
- Produces: `ProductCardElevated` and `CategoryProductGrid`.

- [ ] **Step 1: Create `components/category/ProductCardElevated.tsx`**
  - 3:4 aspect ratio media frame with studio radial background.
  - Interactive tactile color swatches: hover/click swaps product image with crossfade.
  - Wishlist toggle button integrated with `useWishlistStore`.
  - Slide-up "QUICK ADD" button on hover with adding/success state (`✓ ADDED TO BAG`) and `useCartStore` dispatch.
  - 3D spring tilt physics and specular glare on mouse move.
  - Metadata layout: Brand/Category label, Product Name, Price (tabular nums), and Color dots.

- [ ] **Step 2: Create `components/category/CategoryProductGrid.tsx`**
  - 4-col $\rightarrow$ 3-col $\rightarrow$ 2-col responsive grid.
  - Framer Motion staggered entrance animations (`motion.div` with layout transitions).
  - Luxury empty state with "Reset Filters" action button.

- [ ] **Step 3: Integrate with `app/category/page.tsx`**

- [ ] **Step 4: Verify in browser**
  - Test swatch switching, Quick Add slide-up, 3D tilt, and responsive reflow.

---

### Task 5: End-to-End Verification & Motion Polish

**Files:**
- Test: `tests/test-nextjs-build.js`
- Test: `tests/test-category-page.js`

- [ ] **Step 1: Run Next.js TypeScript and production build test**
  - `npm run test:next` or `npm run build`.

- [ ] **Step 2: Multi-viewport browser visual testing via Playwright / Chrome DevTools**
  - Desktop `1440x900`, Tablet `768x1024`, and Mobile `375x812`.
  - Capture visual proof screenshots and verify 0 errors in console.
