# MiniCart (Shopping Bag) Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate and elevate `components/cart/MiniCartDrawer.tsx` to achieve 100% parity with `feature/storefront-elevation`, correcting background colors to deep navy (`#012148`/`#0A2A54`), updating CTAs to the iconic crisp white button (`btn-primary-commerce`), enforcing clean UK English copywriting, and guaranteeing uncropped silhouette containment and 120fps motion.

**Architecture:** Next.js 15+ App Router Client Component with Zustand state management (`useCartStore`, `useWishlistStore`), `motion/react` spring physics, Lenis scroll lock integration, and WCAG 2.1 AA dialog semantics.

**Tech Stack:** Next.js 15+, React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React, Zustand, Vitest.

## Global Constraints

- Background colors must strictly use obsidian deep navy palette (`#012148` base, `#0A2A54` header/footer surfaces, `#071E3D` card surfaces), with zero pitch-black/charcoal hexes (`#060B14`, `#08101E`).
- Primary checkout button must strictly use the crisp white luxury CTA (`bg-white text-obsidian-950 hover:bg-white/90 font-bold uppercase tracking-widest`).
- Copywriting must strictly use pure UK British English with zero AI or synthetic words.
- Studio product photography must use `object-contain` with radial/gradient studio backgrounds to guarantee uncropped silhouette geometry.
- All scrollable drawer containers must declare `data-lenis-prevent` and manage `_nexLenis.stop()` / `_nexLenis.start()`.

---

### Task 1: Update Test Suites with Strict Color and CTA Assertions

**Files:**
- Modify: `tests/test-minicart-elevation.js`
- Modify: `tests/audit-minicart-7dimensions.js`

- [ ] **Step 1: Update `tests/test-minicart-elevation.js` and `tests/audit-minicart-7dimensions.js` to assert `#012148`, `#0A2A54`, white CTA button, and UK English copy**
- [ ] **Step 2: Run both test files to observe expected failure before component update**

### Task 2: Refactor `MiniCartDrawer.tsx` for Pure Storefront-Elevation Alignment

**Files:**
- Modify: `components/cart/MiniCartDrawer.tsx`

- [ ] **Step 1: Apply deep navy backgrounds (`#012148`, `#0A2A54`, `#071E3D`), white luxury CTA button (`VIEW BAG & CHECKOUT →`), uncropped image containers, and natural UK English empty state**
- [ ] **Step 2: Run unit and 7-dimension audit tests to verify 100% pass rate**

### Task 3: Visual and E2E Verification in Browser

**Files:**
- Test: `tests/test-minicart-elevation.js`
- Test: `tests/audit-minicart-7dimensions.js`

- [ ] **Step 1: Run full test suite and Vitest unit tests**
- [ ] **Step 2: Capture live browser screenshots of both empty state and populated state on `http://localhost:3000`**
- [ ] **Step 3: Verify visual alignment against `feature/storefront-elevation` baseline screenshots**
