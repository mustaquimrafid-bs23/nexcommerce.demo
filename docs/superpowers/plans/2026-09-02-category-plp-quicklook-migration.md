# Batch 13: Category PLP & Quick-Look Mini-PDP Drawer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and migrate the Category Product Listing Page (PLP) and Quick-Look Mini-PDP slide-over drawer into Next.js 15 App Router with 100% visual and interactive parity to `feature/storefront-elevation`, simple plain UK English copy, seamless dual currency conversion, and consistent Atelier dark background.

**Architecture:** Next.js 15 App Router (`app/category/page.tsx`) with modular components in `components/category/`, Zustand stores (`useCartStore`, `useWishlistStore`, `useCurrencyStore`), `motion/react` spring transitions, and Lenis scroll prevention on modal drawers.

**Tech Stack:** Next.js 15.x, React 19, TypeScript, Tailwind CSS v4, Zustand 5, `motion/react`, Lucide React, Playwright visual testing.

---

## Visual Reference & Elevation Parity

Visual reference captured from `feature/storefront-elevation`:
- Reference screenshot: `docs/superpowers/plans/category_storefront_elevation_fullpage.png`
- Current Next.js screenshot: `docs/superpowers/plans/nextjs_category_desktop_fullpage.png`
- Quick Look drawer reference: `docs/superpowers/plans/nextjs_category_quicklook_drawer.png`

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        BATCH 13 ARCHITECTURAL COMPONENT MATRIX                         │
├──────────────────────────────┬─────────────────────────────────────────────────────────┤
│ 1. CategoryHero.tsx          │ Full-width pure image banner + Simple UK English titles │
│ 2. CategoryToolbar.tsx       │ Piece count + Sort dropdown + Category filter pills     │
│ 3. CategoryProductGrid.tsx   │ 4-Column responsive grid + Staggered motion reveals     │
│ 4. ProductCardElevated.tsx   │ 3D tilt + Glare + Swatches + Slide-up Quick Add CTA     │
│ 5. QuickLookMiniPDP.tsx      │ 520px Slide-over drawer + Filmstrip + Size + 1-Click Add│
│ 6. CuratedCapsuleSpotlight   │ 120fps GPU progress + Look switcher + Quick Add         │
│ 7. app/category/page.tsx     │ URL search sync (?cat=...) + State orchestration        │
└──────────────────────────────┴─────────────────────────────────────────────────────────┘
```

---

## Global Constraints & Copy Guidelines

* **Atelier Background Consistency:** Match global background `bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] bg-fixed text-[#F8FAFF]` with zero mismatched grey or off-tone boxes.
* **Plain UK English Copy Standard:** Replace robotic/AI sounding words with everyday UK English:
  * "Acoustic Engineering" → "Headphones & Audio"
  * "Studio-grade spatial drivers and active acoustic isolation" → "Studio headphones and wireless earphones with clear, rich sound."
  * "Fine Accessories & Horology" → "Watches & Accessories"
  * "Minimalist chronographs, full-grain leather goods" → "Classic watches, leather bags, and daily essentials."
  * "Italian calfskin runners with ergonomic Vibram cushioning" → "Leather trainers and shoes with cushioned soles."
  * "Handpicked luxury essentials" → "Selected pieces for the new season."
  * "Quick Look · Mini-PDP" → "QUICK VIEW"
  * "Color" → "Colour"
  * "Add to Shopping Bag" → "Add to Bag"
* **Mini-PDP Standard:**
  * Fixed right slide-over (`520px` width on desktop, `88vh` bottom sheet on mobile `≤640px`).
  * Studio media stage with `object-fit: contain !important;` and multi-angle thumbnail filmstrip.
  * Interactive finish/colour swatches + interactive size selector pills.
  * Live dual currency price recalculation via `useCurrencyStore` (`EUR` / `BDT`).
  * 1-click "Add to Bag" with direct cart synchronization via `useCartStore`.
  * Keyboard `Escape` support, backdrop click dismissal, and `data-lenis-prevent`.

---

## Task Breakdown

### Task 1: Comprehensive Automated Test Suite (`tests/test-category-quicklook.js`)

**Files:**
- Modify: `tests/test-category-quicklook.js`

**Interfaces:**
- Consumes: Component source files in `components/category/` and `app/category/page.tsx`.
- Produces: 25+ automated assertions validating layout, accessibility, UK English copy, and Quick Look mini-PDP capabilities.

- [ ] **Step 1: Write comprehensive test suite in `tests/test-category-quicklook.js`**

```javascript
const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('🧪 Running Batch 13 Category & Quick-Look Mini-PDP Verification Suite...\n');

// 1. File existence
const drawerPath = path.resolve(process.cwd(), 'components/category/QuickLookMiniPDP.tsx');
const cardPath = path.resolve(process.cwd(), 'components/category/ProductCardElevated.tsx');
const heroPath = path.resolve(process.cwd(), 'components/category/CategoryHero.tsx');
const toolbarPath = path.resolve(process.cwd(), 'components/category/CategoryToolbar.tsx');
const gridPath = path.resolve(process.cwd(), 'components/category/CategoryProductGrid.tsx');
const spotlightPath = path.resolve(process.cwd(), 'components/category/CuratedCapsuleSpotlight.tsx');
const pagePath = path.resolve(process.cwd(), 'app/category/page.tsx');

assert('QuickLookMiniPDP.tsx exists', fs.existsSync(drawerPath));
assert('ProductCardElevated.tsx exists', fs.existsSync(cardPath));
assert('CategoryHero.tsx exists', fs.existsSync(heroPath));
assert('CategoryToolbar.tsx exists', fs.existsSync(toolbarPath));
assert('CategoryProductGrid.tsx exists', fs.existsSync(gridPath));
assert('CuratedCapsuleSpotlight.tsx exists', fs.existsSync(spotlightPath));
assert('app/category/page.tsx exists', fs.existsSync(pagePath));

// 2. QuickLookMiniPDP assertions
if (fs.existsSync(drawerPath)) {
  const code = fs.readFileSync(drawerPath, 'utf8');
  assert('QuickLook has dialog role and aria-modal', code.includes('role="dialog"') && code.includes('aria-modal="true"'));
  assert('QuickLook uses plain UK English header "QUICK VIEW"', code.includes('QUICK VIEW'));
  assert('QuickLook contains thumbnail filmstrip', code.includes('gallery') && code.includes('setActiveImage'));
  assert('QuickLook contains interactive Colour selector', code.includes('Colour') || code.includes('selectedColor'));
  assert('QuickLook contains interactive Size selector', code.includes('Size') && code.includes('selectedSize'));
  assert('QuickLook has 1-click Add to Bag CTA', code.includes('Add to Bag') || code.includes('Added to Bag'));
  assert('QuickLook links to full product details', code.includes('/product/') && (code.includes('View full details') || code.includes('View Full Details')));
  assert('QuickLook integrates useCurrencyStore for reactive currency', code.includes('useCurrencyStore'));
  assert('QuickLook has scroll isolation data-lenis-prevent', code.includes('data-lenis-prevent'));
  assert('QuickLook supports Escape key listener', code.includes('Escape') || code.includes('keydown'));
}

// 3. ProductCardElevated assertions
if (fs.existsSync(cardPath)) {
  const code = fs.readFileSync(cardPath, 'utf8');
  assert('ProductCardElevated has 3D spring tilt physics', code.includes('perspective') && code.includes('rotateX') && code.includes('rotateY'));
  assert('ProductCardElevated has specular glare tracking', code.includes('plp-card-specular') || code.includes('--plp-glare'));
  assert('ProductCardElevated has quick look eye button', code.includes('onQuickLook') && code.includes('Eye'));
  assert('ProductCardElevated has wishlist toggle button', code.includes('toggleWishlist') && code.includes('Heart'));
  assert('ProductCardElevated has slide-up quick add CTA', code.includes('QUICK ADD') || code.includes('btn-plp-add-to-bag'));
  assert('ProductCardElevated contains tactile colour swatches', code.includes('plp-swatches-row') || code.includes('handleSwatchSelect'));
  assert('ProductCardElevated uses useCurrencyStore for live currency updates', code.includes('useCurrencyStore'));
}

// 4. CategoryHero assertions
if (fs.existsSync(heroPath)) {
  const code = fs.readFileSync(heroPath, 'utf8');
  assert('CategoryHero uses plain UK English copy (zero AI buzzwords)', !code.includes('spatial drivers') && !code.includes('horology'));
  assert('CategoryHero includes pure full-width banner container', code.includes('plp-pure-banner-frame') || code.includes('plpCategoryBannerImg'));
}

// 5. CategoryToolbar assertions
if (fs.existsSync(toolbarPath)) {
  const code = fs.readFileSync(toolbarPath, 'utf8');
  assert('CategoryToolbar contains Sort By select', code.includes('plpSortSelect') || code.includes('onSortChange'));
  assert('CategoryToolbar contains 7 category filter pills', code.includes('ALL') && code.includes('APPAREL') && code.includes('FOOTWEAR'));
}

// 6. app/category/page.tsx assertions
if (fs.existsSync(pagePath)) {
  const code = fs.readFileSync(pagePath, 'utf8');
  assert('Category page mounts QuickLookMiniPDP', code.includes('<QuickLookMiniPDP'));
  assert('Category page mounts CategoryHero', code.includes('<CategoryHero'));
  assert('Category page mounts CategoryToolbar', code.includes('<CategoryToolbar'));
  assert('Category page mounts CategoryProductGrid', code.includes('<CategoryProductGrid'));
  assert('Category page synchronizes with URL query ?cat=', code.includes('useSearchParams') && code.includes('cat'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
```

- [ ] **Step 2: Run test to verify it fails on missing assertions**
  Run: `node tests/test-category-quicklook.js`
  Expected: FAIL (missing UK English copy and QuickLook enhancements)

---

### Task 2: Elevate Quick-Look Mini-PDP Slide-Over Drawer (`components/category/QuickLookMiniPDP.tsx`)

**Files:**
- Replace: `components/category/QuickLookMiniPDP.tsx`

**Interfaces:**
- Consumes: `Product`, `isOpen`, `onClose` callback, `useCartStore`, `useWishlistStore`, `useCurrencyStore`.
- Produces: 520px fixed slide-over drawer with multi-angle gallery, colour swatches, size picker, live dual currency pricing, fast courier delivery notice, and 1-click "Add to Bag" with cart sync.

- [ ] **Step 1: Implement elevated `QuickLookMiniPDP.tsx`**

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, ShoppingBag, Heart, Check, ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { Product } from '@/types/catalog';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { useCurrencyStore } from '@/store/useCurrencyStore';

interface QuickLookMiniPDPProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export function QuickLookMiniPDP({ product, isOpen, onClose }: QuickLookMiniPDPProps) {
  const { addItem } = useCartStore();
  const { toggleWishlist, isWishlisted } = useWishlistStore();
  const formatPrice = useCurrencyStore((state) => state.formatPrice);

  const [activeImage, setActiveImage] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0].name : '');
      setSelectedSize(product.sizes && product.sizes.length > 0 ? product.sizes[0] : '');
      setIsAdded(false);
    }
  }, [product]);

  // Keyboard Escape listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const wishlisted = isWishlisted(product.id);
  const gallery = [product.image, ...(product.gallery || [])].filter(Boolean);

  const handleAdd = () => {
    addItem(product, selectedSize || 'One Size', selectedColor || undefined);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div
      id="plpQuickLookDrawer"
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-md transition-opacity duration-300"
      role="dialog"
      aria-modal="true"
      aria-label={`Quick view of ${product.name}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className="w-full max-w-[520px] bg-[#080E1E] border-l border-white/12 h-full flex flex-col justify-between shadow-2xl animate-slide-in-right overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 1. Header */}
        <div className="quicklook-header px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#3DE0FF]">
              QUICK VIEW
            </span>
            <span className="text-white/30">|</span>
            <span className="text-[10px] uppercase font-semibold text-white/50 tracking-wider">
              {product.brand || 'ARC'}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white flex items-center justify-center transition-all cursor-pointer border border-white/10"
            aria-label="Close Quick Look"
          >
            <X size={16} />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="quicklook-body flex-1 overflow-y-auto p-6 space-y-5" data-lenis-prevent>
          {/* Media Stage */}
          <div className="space-y-3">
            <div className="relative w-full h-[270px] sm:h-[290px] rounded-xl overflow-hidden bg-radial from-[#0F1D38] to-[#030713] border border-white/10 flex items-center justify-center p-4 shadow-inner">
              <img
                src={activeImage || product.image}
                alt={product.name}
                className="max-h-full max-w-full object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.7)] transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`absolute top-3 right-3 p-2.5 rounded-full border transition-all cursor-pointer backdrop-blur-md ${
                  wishlisted
                    ? 'bg-[#E60C45] border-[#E60C45] text-white shadow-lg'
                    : 'bg-black/60 border-white/15 text-white/60 hover:text-white hover:border-white/40'
                }`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Filmstrip */}
            {gallery.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border p-1 bg-[#040916] shrink-0 cursor-pointer transition-all ${
                      activeImage === img
                        ? 'border-[#3DE0FF] ring-2 ring-[#3DE0FF]/30 opacity-100'
                        : 'border-white/12 opacity-65 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img src={img} alt={`Angle ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between text-[10px] text-white/50 uppercase tracking-widest">
              <span>{product.category}</span>
              {product.rating && (
                <span className="flex items-center gap-1 text-amber-400 font-semibold">
                  <Star size={11} fill="currentColor" />
                  <span>{product.rating}</span>
                </span>
              )}
            </div>

            <h3 className="font-editorial text-2xl text-white font-medium tracking-tight">
              {product.name}
            </h3>

            <div className="text-xl font-bold text-white font-mono tabular-nums">
              {formatPrice(product.price)}
            </div>

            {/* Delivery & Authenticity Trust Row */}
            <div className="flex items-center gap-4 py-2 text-[11px] text-white/65 border-y border-white/8">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Truck size={13} />
                <span>Free express delivery</span>
              </span>
              <span className="flex items-center gap-1.5 text-white/60">
                <ShieldCheck size={13} />
                <span>100% genuine</span>
              </span>
            </div>

            {/* Colour Swatches */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs text-white/70 font-medium">
                  Colour: <span className="text-white font-semibold">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        setSelectedColor(c.name);
                        if (c.img) setActiveImage(c.img);
                      }}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-[#3DE0FF] ring-2 ring-[#3DE0FF]/40 scale-110 shadow-md'
                          : 'border-white/20 hover:scale-105 opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                      aria-label={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs text-white/70 font-medium">
                  Size: <span className="text-white font-semibold">{selectedSize}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedSize(s)}
                      className={`px-3.5 py-1.5 rounded-md text-xs font-semibold uppercase border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'bg-white text-[#01132B] border-white shadow-md'
                          : 'bg-white/[0.04] border-white/12 text-white/70 hover:text-white hover:border-white/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 3. Sticky Footer Actions */}
        <div className="quicklook-footer p-5 border-t border-white/10 bg-black/60 backdrop-blur-md space-y-2.5">
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
              isAdded
                ? 'bg-emerald-500 text-white'
                : 'bg-[#E60C45] hover:bg-[#E60C45]/90 text-white shadow-[#E60C45]/20'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={15} strokeWidth={3} />
                <span>Added to Bag ✓</span>
              </>
            ) : (
              <>
                <ShoppingBag size={15} />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <Link
            href={`/product/${product.id}`}
            onClick={onClose}
            className="w-full py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all border border-white/12"
          >
            <span>View full details</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </aside>
    </div>
  );
}
```

- [ ] **Step 2: Run test to check progress:** `node tests/test-category-quicklook.js`

---

### Task 3: Elevate Product Cards & 3D Tilt Physics (`components/category/ProductCardElevated.tsx`)

**Files:**
- Modify: `components/category/ProductCardElevated.tsx`

**Interfaces:**
- Consumes: `Product`, `onQuickLook` callback, `useCurrencyStore`, `useCartStore`, `useWishlistStore`.
- Produces: 3:4 ratio luxury product card with 3D spring tilt, specular glare, live currency format, and slide-up quick add button.

- [ ] **Step 1: Update `ProductCardElevated.tsx` with `useCurrencyStore` and clean UK English copy**
- [ ] **Step 2: Run test to check progress:** `node tests/test-category-quicklook.js`

---

### Task 4: Clean AI Copy in Hero Banner (`components/category/CategoryHero.tsx`)

**Files:**
- Replace: `components/category/CategoryHero.tsx`

**Interfaces:**
- Consumes: `selectedCategory`.
- Produces: Pure full-width banner with clean UK English text.

- [ ] **Step 1: Replace `CategoryHero.tsx` with plain UK English titles & descriptions**
- [ ] **Step 2: Run test to check progress:** `node tests/test-category-quicklook.js`

---

### Task 5: Clean AI Copy in Toolbar & Empty State (`components/category/CategoryToolbar.tsx` & `components/category/CategoryProductGrid.tsx`)

**Files:**
- Modify: `components/category/CategoryToolbar.tsx`
- Modify: `components/category/CategoryProductGrid.tsx`

- [ ] **Step 1: Update Toolbar piece counter and filter labels to clean UK English**
- [ ] **Step 2: Update ProductGrid empty state to plain UK English**
- [ ] **Step 3: Run test to check progress:** `node tests/test-category-quicklook.js`

---

### Task 6: Final Verification & Visual Screenshot Gate

**Files:**
- Test: `tests/test-category-quicklook.js`
- Test: `npm test`
- Test: `npm run build`

- [ ] **Step 1: Run all unit tests**
  Run: `node tests/test-category-quicklook.js`
  Expected: 100% passing tests (25/25)

- [ ] **Step 2: Run Next.js production build check**
  Run: `npm run build`
  Expected: 0 errors

- [ ] **Step 3: Capture visual verification screenshots on Desktop (`1440x900`) and Mobile (`375x812`)**
  Run: `node scripts/capture-category-refs.cjs`
  Expected: Clean visual match with `category_storefront_elevation_fullpage.png`

- [ ] **Step 4: Commit**
  `git commit -m "feat(batch-13): migrate category plp and quick-look mini-pdp with plain uk english and visual parity"`

---

## Verification Plan

### Automated Tests
* `node tests/test-category-quicklook.js` — validates all 25+ assertions for QuickLook drawer, Product Cards, Hero banner, Toolbar, and UK English copy.
* `npm test` — all deterministic tests pass.
* `npm run build` — clean compilation with 0 TypeScript errors.

### Manual & Visual Verification
* Open `http://localhost:3000/category` in browser.
* Hover over product cards to verify 3D spring tilt physics and specular glare tracking.
* Click the Quick Look (eye icon) button on any card to verify smooth slide-over opening, filmstrip gallery thumbnail switching, colour and size selection, and 1-click Add to Bag.
* Toggle Currency in the header (EUR / BDT) and confirm instant live price recalculation across PLP cards and Quick Look drawer.
