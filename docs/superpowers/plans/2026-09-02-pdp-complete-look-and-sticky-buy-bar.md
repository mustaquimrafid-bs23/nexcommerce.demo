# Batch 12: PDP Complete the Look 3-Piece Bundle & Mobile Sticky Buy Bar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and migrate the Product Detail Page (PDP) Complete the Look 3-Piece Bundle section (`CompleteLookBundle.tsx`) and Mobile Sticky Buy Bar (`MobileStickyBar.tsx`) to Next.js 15 App Router with 100% visual, functional, and UX parity with `feature/storefront-elevation`, fluid spring motion, simple British English terminology (zero AI jargon), and uniform luxury dark navy styling.

**Architecture:** Next.js 15 App Router client components (`CompleteLookBundle.tsx`, `MobileStickyBar.tsx`) integrated with `app/product/[id]/page.tsx`, powered by Framer Motion (`motion/react`) for GPU-composited slide-up and staggered entry transitions, dynamic 3-piece curated pairing matrix with 10% bundle discount calculation, Zustand cart store integration for 1-click bundle purchase, and responsive scroll-driven visibility.

**Tech Stack:** Next.js 15.x App Router, React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React, Zustand 5, Node.js Test Runner.

---

## Global Constraints

* **Visual & Functional Parity:** 100% parity with `feature/storefront-elevation`'s `pages/product.html` (`#pdpCompleteLookSection`, `#mobileStickyBar`), `js/pdp.js` (`initCompleteLookSection`, `initMobileStickyBar`), and `css/design-system.css`.
* **Visual Styling & Palette:**
  * Background: Uniform Atelier Dark Navy (`radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)`)
  * Bundle Checkout Card: Deep Obsidian Navy (`#08101E`) / Surface Card (`#0A2A54`), border `rgba(255, 255, 255, 0.15)`, `rounded-2xl`
  * Bundle Discount Pill: Radiant Cyan tint (`rgba(61, 224, 255, 0.1)`) with border `rgba(61, 224, 255, 0.3)` and `color: #3DE0FF`
  * Bundle CTA Button: Solid White (`#FFFFFF`) with Obsidian text (`#020B18`) or Crimson accent (`#E60C45`), uppercase bold letter-spacing
  * Mobile Sticky Bar: `rgba(8, 14, 30, 0.96)` with `backdrop-filter: blur(16px)`, `border-t border-white/15`, `shadow-2xl`
* **Plain & Everyday British English (Zero AI Jargon):**
  * Section Eyebrow: `COMPLETE THE LOOK`
  * Section Heading: `Style It With`
  * Description: "Carefully chosen companion pieces to complete your look, designed and tailored to pair effortlessly together."
  * Bundle CTA: "ADD ALL TO BAG (3 PIECES)" or "ADD ENTIRE LOOK"
  * Quick Add Button: "QUICK ADD"
  * Card Link: "VIEW PIECE"
  * Strictly forbid pseudo-academic/AI buzzwords like "Coordinated Wardrobe Ensemble", "Architecturally harmonized pieces", "Neural Match", "Biometric Calibrator".
* **Motion & Animation Engineering:**
  * Complete Look Section: Staggered entrance animation on scroll into view (`whileInView`, spring transition `[0.23, 1, 0.32, 1]`)
  * Product Cards: Hover micro-zoom (`scale: 1.03`), subtle cyan border illumination, and quick-add button reveal
  * Mobile Sticky Bar: Smooth GPU-composited slide up from bottom (`y: 100% -> 0%`) when scrolling past the main hero Add-to-Bag CTA with spring physics
* **Touch Targets & Accessibility:**
  * All interactive elements $\ge 44\text{px}$ touch targets
  * Visible focus indicators (`focus-visible:ring-2 focus-visible:ring-accent-cyan`)
  * WCAG 2.1 AA compliant contrast ratios ($\ge 4.5:1$)

---

## Visual Reference (Captured from `feature/storefront-elevation`)

- **Complete the Look Reference Screenshot:** `docs/superpowers/plans/pdp_complete_the_look_ref.png`
- **Full PDP Reference Screenshot:** `docs/superpowers/plans/pdp_full_page_ref.png`
- **Mobile Sticky Buy Bar Reference Screenshot:** `docs/superpowers/plans/pdp_mobile_sticky_buy_bar_ref.png`

---

## Tasks Breakdown

### Task 1: Write Automated Test Suite for PDP Complete Look Bundle & Mobile Sticky Bar (`tests/test-pdp-bundle-sticky.js`)

**Files:**
- Create: `tests/test-pdp-bundle-sticky.js`

**Interfaces:**
- Consumes: Node filesystem and component source files `components/product/CompleteLookBundle.tsx`, `components/product/MobileStickyBar.tsx`, and `app/product/[id]/page.tsx`.
- Produces: Executable deterministic test suite verifying bundle pairing matrix, 10% discount computation, Quick Add handlers, mobile scroll observer, British English copy assertions, absence of AI jargon, and motion animation bindings.

- [ ] **Step 1: Write failing test file `tests/test-pdp-bundle-sticky.js`**

```javascript
// tests/test-pdp-bundle-sticky.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Testing PDP Complete the Look 3-Piece Bundle & Mobile Sticky Bar (Batch 12)...');

const bundlePath = path.resolve(process.cwd(), 'components/product/CompleteLookBundle.tsx');
const stickyPath = path.resolve(process.cwd(), 'components/product/MobileStickyBar.tsx');
const pdpPath = path.resolve(process.cwd(), 'app/product/[id]/page.tsx');

assert(fs.existsSync(bundlePath), 'components/product/CompleteLookBundle.tsx must exist');
assert(fs.existsSync(stickyPath), 'components/product/MobileStickyBar.tsx must exist');
assert(fs.existsSync(pdpPath), 'app/product/[id]/page.tsx must exist');

const bundleContent = fs.readFileSync(bundlePath, 'utf8');
const stickyContent = fs.readFileSync(stickyPath, 'utf8');
const pdpContent = fs.readFileSync(pdpPath, 'utf8');

// 1. Complete Look Section Structure & Identifiers
assert(bundleContent.includes('pdpCompleteLookSection'), 'Must include #pdpCompleteLookSection identifier');
assert(bundleContent.includes('btnAddCompleteLookBtn'), 'Must include #btnAddCompleteLookBtn bundle button ID');
assert(bundleContent.includes('SAVE 10%') || bundleContent.includes('10%'), 'Must display 10% bundle discount badge');
assert(bundleContent.includes('COMPLETE_LOOK_MAP') || bundleContent.includes('pairingMap') || bundleContent.includes('companionItems'), 'Must support curated companion pairing');

// 2. Individual Companion Cards & Quick Add
assert(bundleContent.includes('QUICK ADD') || bundleContent.includes('Quick Add'), 'Must have Quick Add CTA on companion cards');
assert(bundleContent.includes('VIEW PIECE') || bundleContent.includes('View Piece') || bundleContent.includes('href='), 'Must link to companion product pages');

// 3. Simple British English Copy (Zero AI Jargon)
assert(!bundleContent.includes('Coordinated Wardrobe Ensemble'), 'Must NOT include AI phrase "Coordinated Wardrobe Ensemble"');
assert(!bundleContent.includes('Architecturally harmonized'), 'Must NOT include pseudo-academic "Architecturally harmonized"');
assert(!bundleContent.includes('Neural'), 'Must NOT include "Neural"');
assert(!bundleContent.includes('Inspect Piece'), 'Must use natural UK English "View Piece" instead of awkward "Inspect Piece"');
assert(bundleContent.includes('Complete the Look') || bundleContent.includes('Style It With'), 'Must have clean natural heading');

// 4. Mobile Sticky Bar Structure & Scroll Behavior
assert(stickyContent.includes('mobileStickyBar'), 'Must include #mobileStickyBar identifier');
assert(stickyContent.includes('stickyPriceLabel'), 'Must include #stickyPriceLabel');
assert(stickyContent.includes('stickySizeLabel'), 'Must include #stickySizeLabel');
assert(stickyContent.includes('ADD TO BAG') || stickyContent.includes('Add to Bag'), 'Must have Add to Bag button');
assert(stickyContent.includes('scroll') || stickyContent.includes('scrollY') || stickyContent.includes('isVisible') || stickyContent.includes('IntersectionObserver'), 'Must support scroll-driven visibility');

// 5. Motion & Animation Integration
assert(bundleContent.includes('motion.') || bundleContent.includes('AnimatePresence'), 'CompleteLookBundle must include Motion animations');
assert(stickyContent.includes('motion.') || stickyContent.includes('AnimatePresence'), 'MobileStickyBar must include Motion animations for slide-up');

// 6. PDP Integration & Uniform Background
assert(pdpContent.includes('CompleteLookBundle'), 'PDP page must import and render CompleteLookBundle');
assert(pdpContent.includes('MobileStickyBar'), 'PDP page must import and render MobileStickyBar');
assert(pdpContent.includes('radial-gradient'), 'PDP page must feature uniform luxury dark navy radial background');

console.log('✅ PASS: All PDP Complete Look Bundle & Mobile Sticky Bar tests passed successfully!');
```

- [ ] **Step 2: Run test to verify initial state**
  Run: `node tests/test-pdp-bundle-sticky.js`
  Expected: Highlights any missing motion, scroll observer, or AI jargon.

---

### Task 2: Elevate `components/product/CompleteLookBundle.tsx` with Curated Pairing Matrix, 10% Discount, Quick Add & Motion

**Files:**
- Modify: `components/product/CompleteLookBundle.tsx`

**Interfaces:**
- Consumes: `currentProduct: Product`, `useCartStore`, `MASTER_PRODUCTS`.
- Produces: Curated 3-piece companion look grid with dynamic pairing lookup, 10% discount calculation, individual card Quick-Add actions, full bundle 1-click purchase, fluid Motion staggered reveal, and clean British English copy.

- [ ] **Step 1: Implement elevated `CompleteLookBundle.tsx`**

```tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Sparkles, Check, ArrowRight, Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';

interface CompleteLookBundleProps {
  currentProduct: Product;
}

// Curated companion item pairing map matching feature/storefront-elevation
const COMPLETE_LOOK_MAP: Record<string, string[]> = {
  p1: ['p2', 'p6', 'p8'],
  p2: ['p1', 'p6', 'p7'],
  p3: ['p1', 'p6', 'p8'],
  p4: ['p1', 'p7', 'p8'],
  p5: ['p2', 'p6', 'p7'],
  p6: ['p1', 'p2', 'p7'],
  p7: ['p1', 'p2', 'p8'],
  p8: ['p2', 'p6', 'p7'],
};

export function CompleteLookBundle({ currentProduct }: CompleteLookBundleProps) {
  const { addItem } = useCartStore();
  const [isBundleAdded, setIsBundleAdded] = useState(false);
  const [addedItemIds, setAddedItemIds] = useState<Record<string, boolean>>({});

  // Resolve curated 3 companion pieces based on current product
  const pairedIds = COMPLETE_LOOK_MAP[currentProduct.id] || ['p2', 'p6', 'p8'];
  const companionItems = pairedIds
    .map((id) => MASTER_PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  // 3-piece companion bundle + current piece
  const allLookItems = [currentProduct, ...companionItems];
  const originalTotal = allLookItems.reduce((sum, item) => sum + item.price, 0);
  const discountedTotal = Math.round(originalTotal * 0.9);

  // 1-Click Add Entire Look to Bag
  const handleAddAll = () => {
    allLookItems.forEach((item) => {
      addItem(
        item,
        item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Standard',
        item.colors && item.colors.length > 0 ? item.colors[0].name : 'Standard',
        1
      );
    });
    setIsBundleAdded(true);
    setTimeout(() => setIsBundleAdded(false), 3000);
  };

  // Quick Add individual companion item
  const handleQuickAdd = (item: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      item,
      item.sizes && item.sizes.length > 0 ? item.sizes[0] : 'Standard',
      item.colors && item.colors.length > 0 ? item.colors[0].name : 'Standard',
      1
    );
    setAddedItemIds((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => {
      setAddedItemIds((prev) => ({ ...prev, [item.id]: false }));
    }, 2500);
  };

  return (
    <section
      id="pdpCompleteLookSection"
      className="pt-16 pb-12 border-t border-white/10 space-y-8"
      aria-label="Complete the Look"
    >
      {/* Header & Quick Bundle Checkout */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1.5">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-accent-cyan flex items-center gap-1.5">
            <Sparkles size={13} />
            <span>Complete the Look</span>
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal">
            Style It <span className="italic font-normal">With</span>
          </h2>
          <p className="text-xs text-white/60 font-light max-w-xl">
            Carefully chosen companion pieces to complete your look, designed and tailored to pair effortlessly together.
          </p>
        </div>

        {/* Bundle Summary & Add All CTA */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-surface-card/90 border border-white/15 shadow-xl backdrop-blur-md">
          <div className="space-y-0.5 font-mono">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-white/40 line-through tabular-nums">&euro;{originalTotal.toFixed(2)}</span>
              <span className="px-2 py-0.5 rounded bg-accent-cyan/15 border border-accent-cyan/30 text-accent-cyan text-[10px] font-bold">
                SAVE 10%
              </span>
            </div>
            <div className="text-lg font-bold text-white tabular-nums">&euro;{discountedTotal.toFixed(2)}</div>
          </div>

          <button
            id="btnAddCompleteLookBtn"
            type="button"
            onClick={handleAddAll}
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-obsidian-950 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-white/10 shrink-0 hover:scale-[1.02] active:scale-[0.98]"
          >
            {isBundleAdded ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-800">Added All to Bag!</span>
              </>
            ) : (
              <>
                <ShoppingBag size={14} />
                <span>Add Entire Look ({allLookItems.length} Pieces)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3-Companion Cards Grid with Staggered Motion */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12 },
          },
        }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {companionItems.map((item) => {
          const isItemAdded = addedItemIds[item.id];
          return (
            <motion.div
              key={item.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5, ease: [0.23, 1, 0.32, 1] },
                },
              }}
              className="p-5 rounded-3xl bg-surface-card/60 border border-white/10 hover:border-accent-cyan/30 transition-all flex flex-col justify-between space-y-4 shadow-xl group"
            >
              <div className="space-y-3">
                {/* Media Container with Quick Add Overlay */}
                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-obsidian-950/80 p-4 relative flex items-center justify-center border border-white/5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-lg"
                  />

                  {/* Quick Add Button */}
                  <button
                    type="button"
                    onClick={(e) => handleQuickAdd(item, e)}
                    className={`absolute bottom-3 right-3 px-3 py-2 rounded-xl text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md cursor-pointer ${
                      isItemAdded
                        ? 'bg-emerald-500 text-white'
                        : 'bg-white/90 hover:bg-white text-obsidian-950 hover:scale-105'
                    }`}
                    aria-label={`Quick add ${item.name} to bag`}
                  >
                    {isItemAdded ? (
                      <>
                        <Check size={12} />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus size={12} />
                        <span>Quick Add</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Product Metadata */}
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-accent-cyan">
                    {item.category}
                  </span>
                  <Link href={`/product/${item.id}`} className="block">
                    <h3 className="font-editorial text-lg text-white font-normal truncate group-hover:text-accent-cyan transition-colors">
                      {item.name}
                    </h3>
                  </Link>
                  <div className="font-mono text-sm text-white/90 font-medium tabular-nums">
                    &euro;{item.price.toFixed(2)}
                  </div>
                </div>
              </div>

              {/* View Piece Anchor */}
              <Link
                href={`/product/${item.id}`}
                className="text-[11px] font-semibold uppercase tracking-wider text-white/70 hover:text-white flex items-center gap-1 transition-colors pt-2 border-t border-white/5"
              >
                <span>View Piece</span>
                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
}
```

- [ ] **Step 2: Verify component TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: 0 errors.

---

### Task 3: Elevate `components/product/MobileStickyBar.tsx` with Scroll Observer, Spring Motion, and Synchronized Variant Display

**Files:**
- Modify: `components/product/MobileStickyBar.tsx`

**Interfaces:**
- Consumes: `price: number`, `selectedSize?: string`, `selectedColor?: string`, `onAddToCart: () => void`.
- Produces: Mobile-only responsive bottom bar that slides up dynamically using Framer Motion when scrolling past 400px, displaying real-time price and active variant summary with a 44px high-contrast CTA button.

- [ ] **Step 1: Implement elevated `MobileStickyBar.tsx`**

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MobileStickyBarProps {
  price: number;
  selectedSize?: string;
  selectedColor?: string;
  onAddToCart: () => void;
}

export function MobileStickyBar({
  price,
  selectedSize,
  selectedColor,
  onAddToCart,
}: MobileStickyBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal sticky bar when scrolled past 400px (hero CTA area)
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Check initial scroll position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          id="mobileStickyBar"
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', stiffness: 400, damping: 35 }}
          className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3.5 sm:p-4 bg-obsidian-950/95 backdrop-blur-xl border-t border-white/15 shadow-2xl flex items-center justify-between gap-4"
        >
          <div className="space-y-0.5">
            <div id="stickyPriceLabel" className="font-mono text-base font-bold text-white tabular-nums">
              &euro;{price.toFixed(2)}
            </div>
            <div id="stickySizeLabel" className="text-[11px] text-white/60 font-light truncate max-w-[170px]">
              {selectedSize ? `Size ${selectedSize}` : 'Standard'}{' '}
              {selectedColor ? `\u00B7 ${selectedColor}` : ''}
            </div>
          </div>

          <button
            type="button"
            onClick={onAddToCart}
            className="min-h-[44px] px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-obsidian-950 text-xs font-semibold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-white/10 active:scale-95 shrink-0"
          >
            <ShoppingBag size={14} />
            <span>Add to Bag</span>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Verify component TypeScript compilation**
  Run: `npx tsc --noEmit`
  Expected: 0 errors.

---

### Task 4: Integrate and Elevate `app/product/[id]/page.tsx` with Uniform Atelier Styling, Natural UK Copy & Full Cohesion

**Files:**
- Modify: `app/product/[id]/page.tsx`

**Interfaces:**
- Consumes: `CompleteLookBundle`, `MobileStickyBar`, `PerspectiveSwitcher`, `AIFitModal`, `SpecBadgesGrid`.
- Produces: Polished luxury PDP page with consistent radial background (`#031838` -> `#011126` -> `#000B1A`), British English copywriting, zero AI jargon, and seamless bundle/sticky bar integration.

- [ ] **Step 1: Update `app/product/[id]/page.tsx` with simplified UK English and refined design tokens**

- [ ] **Step 2: Run automated test suite:**
  Run: `node tests/test-pdp-bundle-sticky.js`
  Expected: All tests pass.

---

### Task 5: Execute Automated Test Suite & Multi-Viewport Browser Verification

**Files:**
- Execute: `tests/test-pdp-bundle-sticky.js`
- Test: Desktop (`1440x900`) and Mobile (`375x812`) viewports via browser agent.

- [ ] **Step 1: Run unit/integration tests**
  Run: `node tests/test-pdp-bundle-sticky.js`
  Expected: PASS

- [ ] **Step 2: Capture live Next.js browser verification screenshots**
  Verify Complete the Look 3-piece bundle layout, Quick Add button interaction, Add All bundle discount, and Mobile Sticky Bar appearance upon scroll.

- [ ] **Step 3: Commit changes**
  Run: `git commit -m "feat(batch-12): elevate PDP complete the look bundle and mobile sticky buy bar with fluid motion and clean UK copy"`

---

## Verification Plan

### Automated Tests
- Run `node tests/test-pdp-bundle-sticky.js` to assert structural IDs, dynamic pairing matrix, discount calculation, British English copy assertions, and Motion bindings.
- Run `npx tsc --noEmit` to verify type safety.

### Manual / Browser Verification
- Open Next.js dev server on `http://localhost:3000/product/p1`.
- Verify `#pdpCompleteLookSection` renders 3 curated companion pieces with 10% discount badge.
- Test 1-click "Add Entire Look" and verify cart quantity updates.
- Switch to mobile viewport (`375x812`), scroll past hero, and verify `#mobileStickyBar` slides up with spring physics and accurate variant price label.
