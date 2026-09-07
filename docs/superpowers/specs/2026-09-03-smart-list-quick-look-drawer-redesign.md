# Quick Look Slide-over Drawer Redesign (Mini-PDP)

**Date:** 2026-09-03  
**Component:** `components/smart-list/SmartListQuickLookDrawer.tsx`  
**Page Route:** `/smart-list` (`app/smart-list/page.tsx`)  
**Design Direction:** Option 1: Modern Luxury Editorial (Mr Porter & SSENSE Benchmark)

---

## 1. Problem Statement & UX Deficiencies

The existing Quick Look slide-over drawer in `/smart-list` suffers from several visual and interaction flaws:
1. **Awkward Media Stage Proportions**: The photo container is locked to a tall `3:4` aspect ratio while studio product photos (e.g. blazers, jackets, shoes) are wider or squarer, leaving empty dark gaps above and below.
2. **Cramped Gallery Filmstrip**: The thumbnail strip has tiny thumbnails clustered on the left, leaving awkward dead space on the right.
3. **Clunky "Developer Box" for Product Details**: The "PRODUCT DETAILS" section is enclosed in a heavy, dark-navy container box (`bg-surface-navy/40 border border-white/10`) with raw text dumped inside, resembling a debug alert box rather than a luxury editorial layout.
4. **Harsh Finish & Size Pickers**: Swatches use neon cyan rings that clash with the understated editorial aesthetic; size buttons use low-contrast navy fills.
5. **Cramped Sticky Action Footer**: The quantity stepper is housed in an awkward box next to the CTA button, and "View Full Product Details" is a loose text link.
6. **Missing Luxury Commerce Essentials**: Missing wishlist quick-toggle, missing discount percentage badge (`-34%`), and missing trust/reassurance indicators (Free Express Delivery, 100% Genuine, 14-Day Free Returns).
7. **Stacking Context Risk**: Missing `createPortal` mounting to `document.body`, risking clipping on viewports with backdrop filters or transforms.

---

## 2. Redesign Objectives & Deliverables

### A. Portal Architecture & Stacking Context
- Render the drawer via `createPortal(drawerJSX, document.body)` with an SSR `mounted` state guard (`if (!mounted) return null;`) and high z-index (`z-[9999]`).
- Lock background body scroll (`overflow: hidden`) while open, with clean cleanup on unmount or close.
- Support `Escape` key close and backdrop click dismiss.

### B. Proportions & Backdrop
- Expand drawer width on desktop from `max-w-md` (448px) to `sm:max-w-[490px] w-full`, giving editorial content natural breathing room.
- Luxury obsidian glassmorphism: `bg-[#070B14]/98 backdrop-blur-2xl border-l border-white/12 shadow-[-20px_0_60px_rgba(0,0,0,0.85)]`.

### C. Studio Media Stage
- **Hero Silhouette Stage**: Fixed balanced height container (`h-[270px] sm:h-[295px]`) with smooth radial vignette (`radial-gradient(ellipse at center, rgba(30, 41, 59, 0.45) 0%, rgba(7, 11, 20, 0.95) 100%)`) and rounded-2xl border (`border border-white/10`).
- **Silhouette Anti-Cropping**: `object-contain` with drop shadow (`drop-shadow-[0_16px_32px_rgba(0,0,0,0.65)]`) and subtle hover zoom.
- **Floating Wishlist Button**: Glassmorphic heart button at top-right wired to `useWishlistStore()`.
- **Thumbnail Filmstrip**: Cleanly centered or evenly spaced thumbnail cards with active cyan outline and smooth transitions.

### D. Refined Typography & Pricing
- Sub-badge: `ARC · CLOTHING` in `text-[11px] font-bold tracking-[0.18em] uppercase text-accent-cyan`.
- Product Title: `font-medium text-xl text-white tracking-tight leading-snug`.
- Pricing Row: Effective price `€ 245.00` (incorporating finish price delta), struck-through original price `€ 370.00`, dynamic discount pill badge (e.g. `-34%`), and `In Stock` badge.
- Reassurance Row: `Free express delivery` (Truck icon) & `100% Genuine` (ShieldCheck icon) in sleek `text-[11px] text-white/60`.

### E. Finish & Size Selection
- Color swatches with smooth micro-borders, offset active rings, checkmark for the active color, and label displaying current selection.
- Size selector with clean grid, distinct active/hover states, and a subtle "Size Guide" link.

### F. Architectural Spec Rows (Replaces Clunky Box)
- Eliminate the dark blue box entirely.
- Replace with a refined architectural specification list using subtle icons (Shirt/Layers for Material, Globe/Compass for Origin, Shield/Sparkles for Care).
- Clean vertical micro-rows with muted labels (`text-[10px] uppercase font-semibold text-white/40 tracking-wider`) and high-contrast value text (`text-xs text-white/90 font-medium`).

### G. Unified Sticky Action Dock
- Ergonomic quantity stepper in a sleek glass pill `[- 1 +]`.
- Primary "Add to Bag • € [Total]" CTA button with spring scale interaction and instant "Added to Bag ✓" state feedback.
- Styled secondary action / "View Full Product Details" link with animated chevron.

---

## 3. Component File & State Mapping

- **Target File:** `components/smart-list/SmartListQuickLookDrawer.tsx`
- **Props Interface:**
  ```typescript
  interface SmartListQuickLookDrawerProps {
    product: SmartListProduct | null;
    isOpen: boolean;
    onClose: () => void;
  }
  ```
- **Store Integrations:**
  - `useCartStore((state) => state.addItem)`
  - `useWishlistStore()`: `toggleWishlist`, `isWishlisted`

---

## 4. Verification Plan

1. **Syntax & TypeScript Compilation:** Ensure zero TypeScript or React errors (`npm run build` or `npx tsc --noEmit`).
2. **Deterministic Functional Verification:**
   - Thumbnail switching changes the hero image.
   - Finish swatch click updates selected color and recalculates effective price delta.
   - Size button click updates active size.
   - Quantity stepper increments and decrements (clamped $\ge 1$).
   - Add to bag dispatches correct item payload to `useCartStore`.
   - Wishlist button toggles item in `useWishlistStore`.
3. **UI / Visual Test:**
   - Chrome DevTools / Playwright test at Desktop (`1440x900`) and Mobile (`375x812`).
   - Screenshot visual capture to verify balanced photo stage, clean spec rows, and zero layout overflow.
