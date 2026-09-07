# Category Page Elevation Design Document

**Date:** 2026-08-28  
**Scope:** `http://localhost:3000/category` (`app/category/page.tsx`, `components/category/*`)  
**Target Parity:** `feature/storefront-elevation` branch (`pages/category.html`, `js/plp.js`, `docs/superpowers/plans/2026-08-20-category-plp-premium-upgrade.md`, Modernist Design System Section 50).

---

## 1. Overview & Objectives

Transform the current minimal Next.js `/category` page into a luxury editorial product listing page (PLP) benchmarked against NET-A-PORTER, SSENSE, and Farfetch. The implementation brings 100% feature, UI, UX, animation, and motion parity with the `feature/storefront-elevation` branch.

### Key Deliverables:
1. **Editorial Masthead & Dynamic Eyebrow**: Dynamic category eyebrow tag (`COLLECTIONS · AW26`, `OUTERWEAR · AW26`, etc.), hierarchical breadcrumb, and bold Manrope typography.
2. **Curated Capsule Spotlight**: 3 curated signature looks (`01 TAILORING`, `02 ACOUSTICS`, `03 FOOTWEAR`), 120fps GPU progress timer, roving tab navigation, and 1-click Quick Add for featured capsule pieces.
3. **Architectural Filter Bar & Sort Toolbar**: 2px-radius architectural pills, live pieces available count, custom styled sort dropdown, and URL query param (`?cat=...`) auto-sync.
4. **4-Column Luxury Product Grid with Tactile Swatches & 3D Tilt**: 3:4 aspect ratio cards, interactive circular color swatches with instant image crossfades, slide-up Quick Add button on hover, and 3D spring tilt physics with real-time specular glare.
5. **Framer Motion Staggered Transitions & Empty State**: Smooth page entrance and category switch animations, and elegant empty state with 1-click reset.

---

## 2. Component Architecture

```
app/category/
  └── page.tsx                         # Main PLP Page, state orchestration, URL params, Framer Motion wrapper

components/category/
  ├── CategoryHero.tsx                 # Full-width lifestyle hero banner, breadcrumbs & dynamic eyebrow masthead
  ├── CuratedCapsuleSpotlight.tsx      # 3-Look switcher, 120fps GPU progress bar, capsule quick-add
  ├── CategoryToolbar.tsx              # Architectural filter pills, piece counter, custom sort select, search
  ├── CategoryProductGrid.tsx          # 4-col responsive grid, Framer Motion stagger, empty state
  └── ProductCardElevated.tsx          # 3:4 card, tactile swatches, 3D tilt, slide-up quick add, wishlist
```

---

## 3. Data & State Management

- **Catalog Data:** Sourced from `MASTER_PRODUCTS` in `@/data/products`.
- **Cart State:** Direct mutation via `useCartStore((state) => state.addItem)`.
- **Wishlist State:** Mutation and persistence via `useWishlistStore()`.
- **Look Switcher State:** Managed with `requestAnimationFrame` for 120fps GPU progress tracking (`scaleX`), with pause on hover/focus and auto-advance at 6000ms.
- **Filter & Sort State:** Synchronized with Next.js router (`useSearchParams`, `useRouter`, `usePathname`).

---

## 4. Verification & Testing Strategy

1. **Unit & Build Validation:** Next.js build (`npm run build`), TypeScript compilation, and Zod schema validations.
2. **Functional Verification:** Verify category switching, swatch click image swaps, Quick Add to Cart, Wishlist toggling, and URL query param synchronization.
3. **Visual & Motion Audit:** Chrome MCP / live browser checks at Desktop (`1440x900`), Tablet (`768x1024`), and Mobile (`375x812`) to verify 3D tilt, 120fps progress bar, responsive 2-column mobile reflow, and touch target accessibility.
