# Design Specification: Micro-Merchandising Editorial Cluster Redesign

- **Date:** 2026-08-18
- **Author:** Founding Full-Stack Engineer / UI-UX Lead
- **Scope:** `<!-- MICRO-MERCHANDISING EDITORIAL CLUSTER -->` in `index.html`, styling in `css/design-system.css`, motion orchestrations in `js/animations.js`, and interaction handling in `js/home.js`.

---

## 1. Overview & Business Objectives
The **Micro-Merchandising Editorial Cluster** (`<section class="home-micro-merch-section">`) serves as a high-intent discovery engine on the homepage, presenting curated product capsules across distinct themes: *New Arrivals*, *Best Sellers / Trending*, and *Picked for You / Atelier Curated*.

The goal of this redesign is to elevate this section into an editorial showcase matching luxury benchmarks (NET-A-PORTER, SSENSE, Brunello Cucinelli), ensuring:
1. **Modern Soft-Luxury Visuals**: Ultra-subtle borders, deep obsidian glass cards (`rgba(11, 20, 36, 0.75)`), refined Playfair serif typography, zero visual noise or harsh borders.
2. **Full Integration of All 4 Motion Standards**:
   - **Micro-interactions**: Synced Look Switcher with 120fps GPU progress timer (`scaleX(0) → scaleX(1)`), tactile quick-add ripple with checkmark morph, and Motion.dev staggered scroll entrance.
   - **3D Hover Effects**: Spring lerp mouse tilt physics (`±5.5°`, `translateZ(10px)`), dynamic specular glare tracking the cursor, and multi-tier diffuse shadows.
   - **Page Transitions**: Hardware-accelerated GPU cross-dissolve curtain transition (`#pageTransitionOverlay`) on all item clicks and "See all" category links.
   - **Scroll Parallax**: Differential column depth (`1x`, `2x`, `1.5x`) linked to Lenis scroll, plus thumbnail micro-motion.
3. **Flawless Responsiveness & Zero Regressions**: Fully responsive on desktop (`≥1024px`), tablet (`768px–1023px`), and mobile (`≤767px`) with touch targets `≥44×44px` and full cart/bag synchronization.

---

## 2. Architecture & Component Blueprint

### 2.1 Section Header & Synced Look Switcher
- **Eyebrow Badge**: `.micro-merch-eyebrow` with soft pill background (`rgba(251, 113, 133, 0.1)`), rose border (`rgba(251, 113, 133, 0.2)`), and sparkles icon.
- **Headline**: `.micro-merch-headline` with Playfair Display serif font, size `clamp(28px, 3.5vw, 40px)`, letter-spacing `-0.02em`.
- **Subheading**: Refined editorial description explaining the curated themes.
- **Look Switcher Nav (`role="tablist"`)**:
  - Buttons: `All Collections`, `Tailored & Outerwear`, `Minimalist Essentials`, `Objects & Accents`.
  - Active Tab Progress Indicator (`.look-tab-progress`): 2px gradient line (`linear-gradient(90deg, #38BDF8, #818CF8, #FB7185)`) animated via GPU `transform: scaleX(0) → scaleX(1)` with `transform-origin: left center` (5-second auto-cycle, pause on hover/interaction, instant sync on manual click).

### 2.2 3-Column Luxury Cluster Grid (`.micro-merch-grid-3col`)
- **Column 1: New Arrivals** (`data-parallax-depth="1"`):
  - Products: `p3` (Fine-Knit Merino Crew, BDT 2,490), `p2` (Structured Leather Tote, BDT 14,900), `p5_bag` (Canvas Weekender Bag, BDT 4,990), `p7` (Tailored Chino Trousers, BDT 6,800).
- **Column 2: Best Sellers** (`data-parallax-depth="2"`):
  - Products: `p1` (Architectural Cashmere Sweater, BDT 18,400), `p6` (Minimalist Leather Runner, BDT 11,900), `p9` (Tailored Wool Blazer, BDT 8,450), `p5` (Classic Chronograph Watch, BDT 3,380).
- **Column 3: Picked for You** (`data-parallax-depth="1.5"`):
  - Products: `p10` (Ribbed Cashmere Turtleneck, BDT 18,400), `p4` (Sonic Aurora Headphones GT, BDT 27,300), `p11` (Charcoal Wool Overcoat, BDT 24,500), `p12` (Beige Suede Runner, BDT 12,500).

### 2.3 Product Row Item Architecture (`.micro-item-row`)
- **Thumbnail Box (`.micro-item-thumb`)**: `58×58px`, `border-radius: 8px`, `background: #090F1C`, `overflow: hidden`. Image scales to `1.08x` on card hover with smooth cubic-bezier easing.
- **Info Stack (`.micro-item-info`)**:
  - Category Eyebrow: `10px`, uppercase, `letter-spacing: 0.07em`, `color: #64748B`.
  - Product Title: `13.5px`, `font-weight: 500`, `color: #F1F5F9`, zero ellipsis clipping.
  - Price: `12.5px`, `font-weight: 600`, `color: #FFFFFF`, `font-variant-numeric: tabular-nums`.
- **Tactile Quick Add Button (`.micro-item-add-btn`)**:
  - `32×32px`, `border-radius: 8px`, `background: rgba(255, 255, 255, 0.06)`, `border: 1px solid rgba(255, 255, 255, 0.08)`.
  - Dynamic expanding ripple wave (`.micro-ripple`) on click.
  - Morph to emerald checkmark (`#10B981`) for 1.4s with instant `window.nexCart.addItem(...)` invocation.

---

## 3. Motion Standards Implementation

### 3.1 Standard 1: Micro-Interactions
1. **Look Switcher Auto-Timer & Tab Switching**:
   - Look tab timer runs a 5000ms loop using GPU `transform: scaleX`.
   - Switching tabs smoothly fades and swaps product data attributes or active states.
   - Pauses cleanly on mouseenter/focus, resumes on mouseleave.
2. **Tactile Quick-Add Ripple**:
   - Calculates click coordinates relative to the button center.
   - Injects `.micro-ripple` span with spring expansion and opacity decay.
3. **Scroll Reveal Entrance**:
   - `inView('.home-micro-merch-section', ...)` using Motion.dev triggers a staggered cascade:
     - Header & Tabs: `opacity: [0, 1], y: [16, 0]`, duration `0.6s`.
     - 3 Columns: `opacity: [0, 1], y: [32, 0], scale: [0.96, 1]`, stagger `0.08s`, duration `0.75s`.

### 3.2 Standard 2: 3D Hover Physics
1. **Spring Lerp Mouse Tilt**:
   - `mousemove` listener on `.micro-merch-col`:
     - Calculates normalized `(dx, dy)` from card center.
     - Target angles: `tgtTX = -(dy * 5.5deg)`, `tgtTY = (dx * 5.5deg)`.
     - Smooth LERP step: `curTX = lerp(curTX, tgtTX, 0.12)`.
     - Transform: `rotateX(curTX) rotateY(curTY) translateZ(10px) translateY(parallaxY)`.
2. **Dynamic Specular Glare Tracking**:
   - Sets `--micro-glare-x` and `--micro-glare-y` percentages on the card.
   - Sets `--micro-glare-opacity: 1` on enter, smoothly decays to `0` on leave.
3. **Spring Back on Leave**:
   - LERPs back to `rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(parallaxY)` with no visual jump.

### 3.3 Standard 3: GPU Page Transitions
1. Intercepts clicks on all `.micro-item-row` elements and `.micro-col-link` "See all" anchors.
2. If click is on `.micro-item-add-btn`, stops propagation and does not trigger page transition.
3. For row clicks: activates `#pageTransitionOverlay` (`opacity: 1` in 200ms) and routes to `pages/product.html?id=${id}` after 210ms.
4. For "See all" links: routes to target category URL via curtain dissolve.

### 3.4 Standard 4: Scroll Parallax
1. Connected to `window._nexLenis.on('scroll', ...)` and passive window scroll listener.
2. Calculates section scroll progress `prog` (`0 → 1`) and centered ratio `centered` (`-1 → +1`).
3. For each column card:
   - `depth = parseInt(card.getAttribute('data-parallax-depth'))` (1, 2, 1.5).
   - `travel = depth * 8px`.
   - `yCard = (centered * travel).toFixed(2)`.
   - Updates `--micro-card-y: ${yCard}px`.
4. When not hovered, applies `translateY(${yCard}px)`.

---

## 4. Responsive Breakpoints & Accessibility

| Viewport | Behavior | Parallax & 3D Tilt |
|---|---|---|
| Desktop (`≥1024px`) | 3 columns side-by-side, 24px gap | Full 3D tilt & differential scroll parallax |
| Tablet (`768px–1023px`) | 2-3 fluid columns, 20px gap | Subtle tilt (`±3.5°`), reduced parallax (`0.6x`) |
| Mobile (`≤767px`) | 1 column stacked or horizontal snap | 3D tilt disabled, touch targets `≥44px` |

- **Accessibility**: All cards and buttons have full keyboard navigation (`Enter` / `Space`), explicit `aria-label`, and `role` attributes. Fully respects `@media (prefers-reduced-motion: reduce)`.

---

## 5. Files to Modify & Create
1. **`index.html`**: Rebuild `<!-- MICRO-MERCHANDISING EDITORIAL CLUSTER -->` section DOM with header, look switcher tabs, specular glare elements, and `data-parallax-depth` attributes.
2. **`css/design-system.css`**: Replace dated `.home-micro-merch-section` styles with modern obsidian glassmorphism, specular sheen, ripple effects, and responsive layout rules.
3. **`js/animations.js`**: Add `initMicroMerchClusterMotion()` orchestrating the 4 Motion Standards.
4. **`js/home.js`**: Update `initMicroMerchandising()` to handle Look Switcher tab sync, quick-add ripple, and keyboard/routing safety.
