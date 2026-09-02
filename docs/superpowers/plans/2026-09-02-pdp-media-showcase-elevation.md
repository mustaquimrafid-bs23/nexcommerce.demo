# Batch 10: Product Detail Page (PDP) Media Showcase & Multi-Angle Gallery (`/product/[id]`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate and elevate the Product Detail Page (PDP) Media Showcase & Multi-Angle Gallery (`/product/[id]`) to Next.js 15 App Router with interactive perspective switcher, filmstrip gallery, color-synchronized viewports, clean UK English copy (zero AI buzzwords), and unified luxury obsidian styling.

**Architecture:** 2-column sticky PDP layout with interactive media stage, filmstrip thumbnails, 3-mode perspective switcher (Studio Silhouette, Editorial Look, Material & Macro), real-time swatch sync, and shopping cart / wishlist integration.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Zustand (`useCartStore`, `useWishlistStore`, `useConciergeStore`), Lucide Icons.

## Global Constraints
- All copy must be simple, natural everyday UK English (zero AI buzzwords).
- Unified luxury radial gradient background: `radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)`.
- 100% test coverage with deterministic assertions in `tests/test-pdp-page.js`.

---

### Task 1: Automated Test Suite for PDP Media Showcase

**Files:**
- Create: `tests/test-pdp-page.js`

- [ ] **Step 1: Write the failing test**

```javascript
const assert = require('assert');
const fs = require('fs');

console.log('--- Testing Product Detail Page (/product/[id]) Suite ---');

// 1. Check page and components exist
assert(fs.existsSync('app/product/[id]/page.tsx'), 'app/product/[id]/page.tsx must exist');
assert(fs.existsSync('components/product/PerspectiveSwitcher.tsx'), 'PerspectiveSwitcher.tsx must exist');
assert(fs.existsSync('components/product/SpecBadgesGrid.tsx'), 'SpecBadgesGrid.tsx must exist');

const pageContent = fs.readFileSync('app/product/[id]/page.tsx', 'utf8');
assert(pageContent.includes('radial-gradient'), 'Page must have uniform luxury radial gradient background');
assert(!pageContent.includes('Neural Style'), 'AI jargon Neural Style must be replaced');
assert(!pageContent.includes('Biometric Calibrator'), 'AI jargon Biometric Calibrator must be replaced');
assert(pageContent.includes('Add to Bag') || pageContent.includes('Add to Cart'), 'Must have Add to Bag button');
assert(pageContent.includes('galleryImages'), 'Must support multi-angle gallery');

const switcherContent = fs.readFileSync('components/product/PerspectiveSwitcher.tsx', 'utf8');
assert(switcherContent.includes('Studio Silhouette') || switcherContent.includes('Silhouette'), 'Must have studio silhouette option');
assert(switcherContent.includes('Editorial Look') || switcherContent.includes('Model'), 'Must have editorial look option');

console.log('✅ PASS: test-pdp-page.js');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-pdp-page.js`
Expected: FAIL on radial-gradient or copy

- [ ] **Step 3: Write minimal implementation in components & page**
- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-pdp-page.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/test-pdp-page.js
git commit -m "test(pdp): add automated assertions for PDP media showcase and gallery"
```

---

### Task 2: Elevate Perspective Switcher & Spec Badges

**Files:**
- Modify: `components/product/PerspectiveSwitcher.tsx`
- Modify: `components/product/SpecBadgesGrid.tsx`

- [ ] **Step 1: Update PerspectiveSwitcher with clean UK labels (Studio Silhouette, Editorial Look, Material & Macro)**
- [ ] **Step 2: Update SpecBadgesGrid with clear artisanal standards**
- [ ] **Step 3: Commit**

```bash
git add components/product/PerspectiveSwitcher.tsx components/product/SpecBadgesGrid.tsx
git commit -m "feat(pdp): elevate perspective switcher and specification badges"
```

---

### Task 3: Elevate Product Page Layout & Multi-Angle Gallery

**Files:**
- Modify: `app/product/[id]/page.tsx`

- [ ] **Step 1: Update app/product/[id]/page.tsx with uniform luxury radial background, multi-angle gallery, color-syncing swatches, and clean UK copy**
- [ ] **Step 2: Run test suite**

Run: `node tests/test-pdp-page.js`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/product/[id]/page.tsx
git commit -m "feat(pdp): elevate PDP page with multi-angle gallery, swatch sync, and clean UK copy"
```

---

### Task 4: Next.js Production Build & 7-Dimension SQA Verification

- [ ] **Step 1: Execute production build**

Run: `npm run build`
Expected: PASS with 0 errors across all 26 routes.

- [ ] **Step 2: Visual browser testing across Desktop (1440x900) and Mobile (375x812)**

Capture screenshots:
- `pdp_page_nextjs_desktop_top_verified.png`
- `pdp_page_nextjs_desktop_mid_verified.png`
- `pdp_page_nextjs_mobile_top_verified.png`
- `pdp_page_nextjs_mobile_mid_verified.png`

- [ ] **Step 3: Commit release & update walkthrough artifact**

```bash
git add docs/ tests/
git commit -m "chore(release): complete Batch 10 PDP media showcase elevation"
```
