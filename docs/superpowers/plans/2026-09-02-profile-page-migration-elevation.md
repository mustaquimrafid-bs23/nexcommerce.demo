# Batch 9: Client Style DNA Studio & Dynamic Recommendations (`/profile`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate and elevate the Client Style DNA Studio & Dynamic Recommendations (`/profile`) page to Next.js 15 App Router with 4-step interactive preferences (Clothing Styles, Preferred Fits, 12-Swatch Colour Palette, and Lifestyle Balance Sliders), real-time product recommendation engine, clean UK English copy (zero AI buzzwords), and unified luxury obsidian styling.

**Architecture:** Full-page interactive studio with centralized client state (`useStyleStore` or local state with `localStorage` persistence) synchronizing 4 configuration steps, dynamic real-time product filtering, and 1-click Quick Add to Cart.

**Tech Stack:** Next.js 15 App Router, React 19, TypeScript, Tailwind CSS v4, Zustand / `useCartStore`, Lucide Icons, `localStorage` persistence.

## Global Constraints
- All copy must be simple, natural everyday UK English (zero AI buzzwords like "Neural Stylist", "Biometric Calibration", "Atelier Matrix").
- Unified luxury radial gradient background: `radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)`.
- 100% test coverage with deterministic assertions in `tests/test-profile-page.js`.

---

### Task 1: Automated Test Suite for Style DNA Studio

**Files:**
- Create: `tests/test-profile-page.js`

- [ ] **Step 1: Write the failing test**

```javascript
const assert = require('assert');
const fs = require('fs');

console.log('--- Testing Style DNA Studio (/profile) Suite ---');

// 1. Check page and components exist
assert(fs.existsSync('app/profile/page.tsx'), 'app/profile/page.tsx must exist');
assert(fs.existsSync('components/profile/StyleDNAStepper.tsx'), 'StyleDNAStepper.tsx must exist');
assert(fs.existsSync('components/profile/ActiveStyleRecommendations.tsx'), 'ActiveStyleRecommendations.tsx must exist');

const pageContent = fs.readFileSync('app/profile/page.tsx', 'utf8');
assert(pageContent.includes('radial-gradient'), 'Page must have uniform luxury radial gradient background');
assert(!pageContent.includes('neural stylist'), 'AI jargon neural stylist must be replaced');
assert(!pageContent.includes('Neural Style'), 'AI jargon Neural Style must be replaced');
assert(pageContent.includes('Style DNA') || pageContent.includes('Style Preferences'), 'Must have clean title');

const stepperContent = fs.readFileSync('components/profile/StyleDNAStepper.tsx', 'utf8');
assert(stepperContent.includes('Minimalist Tailoring'), 'Must contain everyday style cards');
assert(stepperContent.includes('Relaxed Luxury'), 'Must contain Relaxed Luxury style');
assert(stepperContent.includes('Contemporary Techwear'), 'Must contain Contemporary Techwear');
assert(stepperContent.includes('Heritage Leather'), 'Must contain Heritage Leather style');
assert(stepperContent.includes('Fitted (Slim)') || stepperContent.includes('Classic Fit'), 'Must have clean UK fit names');

const recsContent = fs.readFileSync('components/profile/ActiveStyleRecommendations.tsx', 'utf8');
assert(recsContent.includes('Add to Bag'), 'Must have 1-Click Add to Bag button');
assert(recsContent.includes('MASTER_PRODUCTS'), 'Must filter against master products');

console.log('✅ PASS: test-profile-page.js');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test-profile-page.js`
Expected: FAIL on AI buzzwords & updated style names

- [ ] **Step 3: Write minimal implementation in components & page**
- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-profile-page.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/test-profile-page.js
git commit -m "test(profile): add automated assertions for Style DNA studio and dynamic recommendations"
```

---

### Task 2: Elevate 4-Step Style DNA Stepper

**Files:**
- Modify: `components/profile/StyleDNAStepper.tsx`

- [ ] **Step 1: Update StyleDNAStepper with 4 visual clothing style cards, 3 tailored fits, 12 colour discs + 4 presets, and 3 lifestyle occasion balance sliders**
- [ ] **Step 2: Commit**

```bash
git add components/profile/StyleDNAStepper.tsx
git commit -m "feat(profile): elevate Style DNA stepper with visual style cards, presets, and sliders"
```

---

### Task 3: Elevate Dynamic Product Recommendation Engine

**Files:**
- Modify: `components/profile/ActiveStyleRecommendations.tsx`

- [ ] **Step 1: Update ActiveStyleRecommendations with dynamic category/archetype filtering matching selected preferences, 1-Click Add to Bag, and Quick View links**
- [ ] **Step 2: Commit**

```bash
git add components/profile/ActiveStyleRecommendations.tsx
git commit -m "feat(profile): elevate dynamic product recommendations with 1-click cart addition"
```

---

### Task 4: Elevate Profile Page Layout & Persistence

**Files:**
- Modify: `app/profile/page.tsx`

- [ ] **Step 1: Update app/profile/page.tsx with uniform luxury radial background, calibration badge, reset/save actions, and clean UK copy**
- [ ] **Step 2: Run test suite**

Run: `node tests/test-profile-page.js`
Expected: PASS

- [ ] **Step 3: Commit**

```bash
git add app/profile/page.tsx
git commit -m "feat(profile): elevate Style DNA studio page with clean UK copy and uniform background"
```

---

### Task 5: Next.js Production Build & 7-Dimension SQA Verification

- [ ] **Step 1: Execute production build**

Run: `npm run build`
Expected: PASS with 0 errors across all 26 routes.

- [ ] **Step 2: Visual browser testing across Desktop (1440x900) and Mobile (375x812)**

Capture screenshots:
- `profile_page_nextjs_desktop_top_verified.png`
- `profile_page_nextjs_desktop_mid_verified.png`
- `profile_page_nextjs_mobile_top_verified.png`
- `profile_page_nextjs_mobile_mid_verified.png`

- [ ] **Step 3: Commit release & update walkthrough artifact**

```bash
git add docs/ tests/
git commit -m "chore(release): complete Batch 9 style DNA studio elevation"
```
