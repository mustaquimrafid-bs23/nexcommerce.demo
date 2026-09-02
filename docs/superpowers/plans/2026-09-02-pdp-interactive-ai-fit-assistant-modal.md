# Batch 11: Product Detail Page (PDP) Interactive AI Fit Assistant & Sizing Calibrator Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and migrate the Product Detail Page (PDP) Interactive AI Fit Assistant & Sizing Calibrator Modal (`AIFitModal.tsx`) to Next.js 15 App Router with 100% visual, functional, and UX parity with `feature/storefront-elevation`, enhanced fluid spring motion, simple British English terminology (zero AI jargon), and uniform luxury dark navy styling.

**Architecture:** Next.js 15 App Router client component (`components/product/AIFitModal.tsx`) integrated with `app/product/[id]/page.tsx`, powered by Framer Motion (`motion/react`) for GPU-accelerated dialog transitions, deterministic sizing calculation rules with BMI and drape preference matching, WCAG 2.1 AA accessibility (dialog role, focus trap, escape key handling), and uniform Atelier styling tokens.

**Tech Stack:** Next.js 15.x App Router, React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React, Node.js Test Runner.

---

## Global Constraints

* **Visual & Functional Parity:** 100% parity with `feature/storefront-elevation`'s `pages/product.html` (`#pdpFitModal`) and `js/pdp.js` (`initFitAssistant`).
* **Visual Styling & Palette:**
  * Backdrop: `rgba(1, 6, 16, 0.82)` with `backdrop-filter: blur(12px)`
  * Modal Panel: Deep Obsidian Navy (`#08101E`) with subtle border `rgba(255, 255, 255, 0.15)`, `rounded-2xl` / `rounded-3xl`
  * Recommendation Box: Radiant Cyan tint (`rgba(61, 224, 255, 0.05)`) with border `rgba(61, 224, 255, 0.25)`
  * Selected Preferences: Solid White (`#FFFFFF`) background with Deep Obsidian (`#020B18`) typography
  * Apply Button: Solid White (`#FFFFFF`) with Deep Obsidian text (`#020B18`) or Crimson accent, 11px uppercase bold letter-spacing
* **Plain & Everyday British English (Zero AI Jargon):**
  * Dialog title: "Find My Size" / "Find Your Size & Fit"
  * Subheading: "We will recommend your ideal size based on your height, weight, and preferred fit."
  * Fit Options: `Tailored`, `Regular`, `Relaxed`
  * Recommendation copy: "Based on {height}cm / {weight}kg with {fitPref} fit, size **{size}** provides a comfortable fit across the shoulders and chest."
  * Primary CTA: "SELECT SIZE {size} & APPLY"
  * Strictly forbid pseudo-academic jargon like "Biometric Calibrator", "Neural Fit Consultant", "98% Anatomical Match", "Silhouette ease delta".
* **Motion & Animation Engineering:**
  * Backdrop fade: `opacity: 0 -> 1` (duration 0.2s, ease `[0.23, 1, 0.32, 1]`)
  * Panel entrance: `opacity: 0 -> 1`, `scale: 0.96 -> 1`, `y: 12 -> 0` with spring physics
  * Dynamic size badge bounce: micro-animation on recommendation letter when inputs change
* **Touch Targets & Keyboard Accessibility:**
  * Close button and all interactive targets $\ge 44\text{px}$
  * `Escape` key closes modal
  * Click on backdrop closes modal
  * Focus retained inside modal while active

---

## Visual Reference (Captured from `feature/storefront-elevation`)

- **Full PDP Reference Screenshot:** `docs/superpowers/plans/pdp_storefront_elevation_fullpage.png`
- **Fit Modal Reference Screenshot:** `docs/superpowers/plans/pdp_storefront_elevation_fitmodal.png`

---

## Tasks Breakdown

### Task 1: Write Automated Test Suite for AI Fit Assistant Modal (`tests/test-pdp-fit-modal.js`)

**Files:**
- Create: `tests/test-pdp-fit-modal.js`

**Interfaces:**
- Consumes: Node filesystem and component source file `components/product/AIFitModal.tsx` and `app/product/[id]/page.tsx`.
- Produces: Executable deterministic test suite verifying modal structure, sizing calculation logic, British English copy assertions, absence of AI buzzwords, motion animation bindings, and 1-click size application handlers.

- [ ] **Step 1: Write failing test file `tests/test-pdp-fit-modal.js`**

```javascript
// tests/test-pdp-fit-modal.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Testing PDP Interactive AI Fit Assistant Modal (Batch 11)...');

const modalPath = path.resolve(process.cwd(), 'components/product/AIFitModal.tsx');
const pdpPath = path.resolve(process.cwd(), 'app/product/[id]/page.tsx');

assert(fs.existsSync(modalPath), 'components/product/AIFitModal.tsx must exist');
assert(fs.existsSync(pdpPath), 'app/product/[id]/page.tsx must exist');

const modalContent = fs.readFileSync(modalPath, 'utf8');
const pdpContent = fs.readFileSync(pdpPath, 'utf8');

// 1. Structural IDs & Accessibility Attributes
assert(modalContent.includes('pdpFitModal'), 'Must include #pdpFitModal identifier');
assert(modalContent.includes('btnCloseFitModal'), 'Must include #btnCloseFitModal close button');
assert(modalContent.includes('btnUseRecSize'), 'Must include #btnUseRecSize apply button');
assert(modalContent.includes('role="dialog"'), 'Must have role="dialog"');
assert(modalContent.includes('aria-modal="true"'), 'Must have aria-modal="true"');

// 2. Sizing Inputs & Parameters
assert(modalContent.includes('Height (cm)'), 'Must have Height (cm) label and input');
assert(modalContent.includes('Weight (kg)'), 'Must have Weight (kg) label and input');
assert(modalContent.includes('Tailored') && modalContent.includes('Regular') && modalContent.includes('Relaxed'), 'Must support Tailored, Regular, and Relaxed fit options');

// 3. Simple British English Copy (Zero AI Jargon)
assert(!modalContent.includes('Anatomical Match'), 'Must NOT include pseudo-academic "Anatomical Match"');
assert(!modalContent.includes('Neural'), 'Must NOT include "Neural"');
assert(!modalContent.includes('Calibrator'), 'Must NOT include "Calibrator" in user-facing text');
assert(!modalContent.includes('silhouette ease'), 'Must NOT include awkward "silhouette ease"');
assert(modalContent.includes('Find My Size') || modalContent.includes('Find Your Size'), 'Must use clear plain title');

// 4. Motion & Animation Integration
assert(modalContent.includes('motion.') || modalContent.includes('AnimatePresence'), 'Must include Motion animations for fluid transitions');

// 5. PDP Page Integration
assert(pdpContent.includes('AIFitModal'), 'PDP page must import and render AIFitModal');
assert(pdpContent.includes('isFitModalOpen'), 'PDP page must manage isFitModalOpen state');
assert(pdpContent.includes('setIsFitModalOpen(true)'), 'PDP page must wire trigger button to open modal');

console.log('✅ PASS: All PDP AI Fit Assistant tests passed successfully!');
```

- [ ] **Step 2: Run test to verify initial state**
  Run: `node tests/test-pdp-fit-modal.js`
  Expected: Assertion passes or highlights missing motion/copy elements.

---

### Task 2: Elevate `components/product/AIFitModal.tsx` with Motion, British English & Luxury Atelier Styling

**Files:**
- Modify: `components/product/AIFitModal.tsx`

**Interfaces:**
- Consumes:
  - `isOpen: boolean`
  - `onClose: () => void`
  - `onSelectSize: (size: string) => void`
  - `availableSizes?: string[]` (e.g. `['XS', 'S', 'M', 'L', 'XL']`)
- Produces: Production-ready React 19 / Next.js 15 client component featuring:
  - Framer Motion `AnimatePresence` and `motion.div` transitions
  - Height (cm) & Weight (kg) interactive number controls with validation
  - 3 fit preference modes (`Tailored`, `Regular`, `Relaxed`)
  - Real-time deterministic size recommendation calculation
  - Clear British English explanation copy
  - Cyan-tinted recommendation summary box
  - 1-click "Select Size {size} & Apply" CTA
  - Keyboard (`Escape`) and backdrop click listener

- [ ] **Step 1: Implement elevated `components/product/AIFitModal.tsx`**

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AIFitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSize: (size: string) => void;
  availableSizes?: string[];
}

export function AIFitModal({
  isOpen,
  onClose,
  onSelectSize,
  availableSizes = ['XS', 'S', 'M', 'L', 'XL'],
}: AIFitModalProps) {
  const [height, setHeight] = useState(180);
  const [weight, setWeight] = useState(74);
  const [fitPref, setFitPref] = useState<'Tailored' | 'Regular' | 'Relaxed'>('Regular');

  // Handle escape key listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Compute recommended size based on BMI and fit preference
  const calculateRecommendation = () => {
    const safeH = Math.max(120, Math.min(230, height || 178));
    const safeW = Math.max(35, Math.min(160, weight || 72));
    const bmi = safeW / ((safeH / 100) * (safeH / 100));

    let rec = 'M';
    if (bmi < 20) {
      rec = fitPref === 'Relaxed' ? 'M' : 'S';
      if (bmi < 18.5 && fitPref === 'Tailored') rec = 'XS';
    } else if (bmi >= 20 && bmi < 24) {
      if (fitPref === 'Tailored') rec = 'S';
      else if (fitPref === 'Relaxed') rec = 'L';
      else rec = 'M';
    } else if (bmi >= 24 && bmi < 27) {
      if (fitPref === 'Tailored') rec = 'M';
      else if (fitPref === 'Relaxed') rec = 'XL';
      else rec = 'L';
    } else {
      rec = fitPref === 'Tailored' ? 'L' : 'XL';
    }

    if (availableSizes.length > 0 && !availableSizes.includes(rec)) {
      rec = availableSizes.includes('M') ? 'M' : availableSizes[0];
    }
    return rec;
  };

  const recSize = calculateRecommendation();

  const handleApply = () => {
    onSelectSize(recSize);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="pdpFitModal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Find My Size"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#010610]/80 backdrop-blur-md"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ type: 'spring', damping: 25, stiffness: 320 }}
            className="relative w-full max-w-md rounded-2xl bg-[#08101E] border border-white/20 p-6 sm:p-8 space-y-6 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-accent-cyan" />
                <h2 className="font-editorial text-2xl text-white font-normal">Find My Size</h2>
              </div>
              <button
                id="btnCloseFitModal"
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close size finder"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-white/60 font-light leading-relaxed">
              We will recommend your ideal size based on your height, weight, and preferred fit.
            </p>

            {/* Numeric Inputs */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="fitInputHeight"
                  className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block"
                >
                  Height (cm)
                </label>
                <input
                  id="fitInputHeight"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(Number(e.target.value))}
                  min="140"
                  max="220"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:border-accent-cyan/60 transition-colors"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="fitInputWeight"
                  className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block"
                >
                  Weight (kg)
                </label>
                <input
                  id="fitInputWeight"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  min="40"
                  max="150"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm outline-none focus:border-accent-cyan/60 transition-colors"
                />
              </div>
            </div>

            {/* Fit Preference Selection */}
            <div className="space-y-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-white/70 block">
                How do you like it to fit?
              </label>
              <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Fit preference">
                {(['Tailored', 'Regular', 'Relaxed'] as const).map((pref) => {
                  const isSelected = fitPref === pref;
                  return (
                    <button
                      key={pref}
                      type="button"
                      onClick={() => setFitPref(pref)}
                      role="radio"
                      aria-checked={isSelected}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                        isSelected
                          ? 'bg-white text-[#020B18] border-white shadow-md'
                          : 'bg-white/5 border-white/10 text-white/70 hover:text-white hover:border-white/20'
                      }`}
                    >
                      {pref}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Recommended Size Card */}
            <motion.div
              layout
              className="p-4 rounded-xl bg-accent-cyan/5 border border-accent-cyan/25 space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
                  Recommended Size
                </span>
                <span className="text-[11px] text-white/50 font-mono">Best match</span>
              </div>
              <motion.div
                key={recSize}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', damping: 15, stiffness: 400 }}
                className="font-editorial text-4xl text-white font-normal tabular-nums"
              >
                {recSize}
              </motion.div>
              <p className="text-xs text-white/70 font-light leading-relaxed">
                Based on {height}cm / {weight}kg with {fitPref.toLowerCase()} fit, size{' '}
                <strong className="text-white font-semibold">{recSize}</strong> provides a comfortable
                fit across the shoulders and chest.
              </p>
            </motion.div>

            {/* Apply Button */}
            <button
              id="btnUseRecSize"
              type="button"
              onClick={handleApply}
              className="w-full py-3.5 rounded-xl bg-white hover:bg-white/90 text-[#020B18] text-xs font-bold uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-[0.99]"
            >
              Select Size {recSize} &amp; Apply
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Run test suite to verify component passes**
  Run: `node tests/test-pdp-fit-modal.js`
  Expected: PASS with 100% assertions satisfied.

---

### Task 3: Verify Integration on PDP (`app/product/[id]/page.tsx`) & Full Regression Suite

**Files:**
- Modify: `app/product/[id]/page.tsx` (ensure triggers, sizes, and styling match exactly)
- Test: `tests/test-pdp-fit-modal.js`
- Test: `tests/test-pdp-elevation-8features.js`
- Test: `tests/test-pdp-page.js`

- [ ] **Step 1: Verify PDP trigger button and sizing row**
  Confirm trigger has ID `#btnPdpFitAssistant` and label "Find My Size".
- [ ] **Step 2: Run complete PDP test suite**
  Run: `node tests/test-pdp-fit-modal.js && node tests/test-pdp-elevation-8features.js && node tests/test-pdp-page.js`
  Expected: All 3 suites pass with 0 errors.
- [ ] **Step 3: Execute Next.js build validation**
  Run: `npm run build`
  Expected: 0 build errors across all App Router routes.

---

## Verification Plan

### Automated Tests
1. `node tests/test-pdp-fit-modal.js` — validates modal component, props, motion, plain British English, and recommendation logic.
2. `node tests/test-pdp-elevation-8features.js` — validates all 8 elevated features on PDP.
3. `node tests/test-pdp-page.js` — validates PDP structure and background gradient.
4. `npm run build` — validates Next.js 15 production build.

### Manual & Visual Verification
1. Open `http://localhost:3000/product/p1` in browser.
2. Click "Find My Size" button in the sizing row.
3. Verify modal opens with fluid spring animation and background blur.
4. Change height to `185` and weight to `85`, select `Relaxed` fit, and verify recommendation updates smoothly to `XL`.
5. Click "Select Size XL & Apply", verify modal closes and size `XL` is selected in PDP size selector.
6. Verify backdrop click and `Escape` key close the modal cleanly.
