# Smart List Page Elevation Design Document

**Date:** 2026-08-28  
**Scope:** `http://localhost:3000/smart-list` (`app/smart-list/page.tsx`, `components/smart-list/*`)  
**Target Parity:** `feature/storefront-elevation` branch (`pages/smart-list.html`, `js/smart-reorder.js`, Modernist Design System Section 50).

---

## 1. Overview & Objectives

Migrate and elevate the Next.js `/smart-list` page from its previous temporary placeholder into the luxury, visual-first, text-minimalist **Smart List Replenishment Suite** benchmarked against SSENSE, NET-A-PORTER, and Farfetch. The implementation achieves 100% feature, UI, UX, animation, and motion parity with the `feature/storefront-elevation` branch.

### Key Deliverables:
1. **Cinema Lifestyle Banner**: Full-width high-resolution hero banner (`smart_list_pure_hero_banner.jpg`) with deep obsidian gradient vignettes and subtle scale animation.
2. **Streamlined Modernist Toolbar**:
   - `[ ◯ Select All (10) ]` toggle with dynamic item counting.
   - Recommended Items stat badge (`12 Items`).
   - Estimated Total Valuation metric (`€ 2,285.00` live calculated).
   - 1-Click `[ 🛍️ ADD ALL TO BAG ]` with animated progress indicator.
3. **Architectural Filter Bar**:
   - Category pills with live active piece counts: `ALL ITEMS (12)`, `CLOTHING (7)`, `AUDIO (2)`, `FOOTWEAR (1)`, `WATCHES (1)`, `BAGS & ACCESSORIES (1)`.
   - Smooth URL search parameter synchronization (`?cat=...`).
4. **4-Column Luxury Product Grid with Tactile Swatches & 3D Tilt**:
   - 3:4 aspect ratio cards with ambient glass selection rings (top-left).
   - Dynamic 3D tilt physics with real-time specular glare sheen (`useTilt3D`).
   - Interactive metallic finish swatches with instant image swapping.
   - Hover slide-up "Add to Bag" button and out-of-stock badges.
5. **Floating Obsidian Island Batch Dock**:
   - Anchored at bottom of viewport with deep obsidian glassmorphism (`backdrop-blur-2xl`).
   - Selected count badge, overlapping avatar filmstrip stack, subtotal calculation, "Clear" and "Add Selected to Bag" actions.
6. **Full "Mini-PDP" Quick Look Slide-Over Drawer**:
   - Interactive gallery filmstrip, finish swatches, size selectors, dynamic price delta calculation, specifications grid, quantity stepper, and direct bag insertion.
7. **Tactile Scroll-To-Top & Fluid Motion**:
   - Floating scroll-to-top button with smooth scroll.
   - 120fps GPU-composited spring animations via Motion / Tailwind v4.

---

## 2. Component Architecture

```
app/smart-list/
  └── page.tsx                         # Main Page Orchestrator, Suspense, URL sync, drawer state

components/smart-list/
  ├── SmartListHeroBanner.tsx          # Full-width lifestyle cinema banner with vignette
  ├── SmartListToolbar.tsx             # Select All, valuation stats, Add All to Bag, category pills
  ├── SmartListProductGrid.tsx         # 4-col responsive grid, Framer Motion stagger, empty state
  ├── SmartListProductCard.tsx         # 3:4 card, ambient selection ring, tactile swatches, 3D tilt, slide-up CTA
  ├── SmartListBatchDock.tsx           # Floating obsidian island dock with avatar stack & batch actions
  ├── SmartListQuickLookDrawer.tsx     # Full Mini-PDP slide-over drawer with gallery, swatches, sizes, specs
  └── SmartListScrollTop.tsx           # Floating tactile scroll-to-top button
```

---

## 3. Data & State Management

- **Catalog Data:** Sourced from `SL_PRODUCTS` in `data/smartListProducts.ts` (12 curated luxury products matching `js/smart-reorder.js` 1:1).
- **Selection State:** Managed in-memory / Zustand for batch selection (`selectedIds: Set<string>`).
- **Cart State:** Direct mutation via `useCartStore((state) => state.addItem)`.
- **Wishlist State:** Mutation via `useWishlistStore()`.
- **Quick Look Modal:** Active product state with variant configuration (finish, size, quantity).
- **Filter State:** Synchronized with Next.js router (`useSearchParams`, `useRouter`, `usePathname`).

---

## 4. Verification & Testing Strategy

1. **Unit & Build Validation:** Next.js build (`npm run build`), TypeScript compilation, and Zod schema validations.
2. **Functional Verification:** Verify selection toggling, batch adding to cart, category switching, swatch click image swaps, Quick Look drawer interactions, and Add All to Bag.
3. **Visual & Motion Audit:** Chrome MCP / live browser checks at Desktop (`1440x900`) and Mobile (`375x812`) to verify 3D tilt, floating batch dock, slide-over drawer, and responsive 1-col mobile reflow.
