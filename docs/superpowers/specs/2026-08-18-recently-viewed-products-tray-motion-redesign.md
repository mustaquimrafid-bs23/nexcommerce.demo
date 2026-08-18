# Design Specification: Recently Viewed Products Tray Luxury Motion Redesign

- **Date:** 2026-08-18
- **Author:** Founding Full-Stack Engineer / Senior UI-UX Lead
- **Scope:** `<!-- RECENTLY VIEWED PRODUCTS TRAY -->` section in `index.html`, luxury glassmorphism styles in `css/design-system.css`, motion physics and 4 Motion Standards in `js/animations.js`, and data synchronization/storage logic in `js/home.js`.

---

## 1. Overview & Objectives
The **Recently Viewed Products Tray** (`<section class="home-recently-viewed-section">`) allows customers to resume exploring previously viewed items or editorial recommendations from their session history.

The current implementation uses a basic static CSS grid with generic styling, lacks interactive filtering and motion depth, and does not align with our luxury brand standards.

### Key Goals:
1. **World-Class Luxury Aesthetic**: Obsidian glass cards (`rgba(10, 18, 32, 0.75)`), ultra-refined 1px borders (`rgba(255, 255, 255, 0.08)`), Playfair Display serif headlines, studio product frames with natural lighting, and zero harsh borders or clutter.
2. **Horizontal Luxury Glide Architecture**: A horizontal momentum glide rail with smooth swipe/drag, responsive scroll-snap, category filter pills (`All History`, `Apparel`, `Footwear`, `Acoustics`, `Objects & Accents`), and desktop glass navigation buttons.
3. **Full Integration of All 4 Motion Standards**:
   - **1️⃣ Micro-interactions**: Synced Look/Category Switcher with 120fps GPU progress timer (`transform: scaleX(0) → scaleX(1)` over 5s with pause on hover/focus), tactile quick-add ripple with checkmark morph, and staggered scroll reveal.
   - **2️⃣ 3D Hover Effects**: High-precision spring lerp mouse tilt (`±6.0°`, `perspective: 1000px`, `translateZ(12px)`), cursor-following dynamic specular glare highlight, and multi-tier diffuse shadows.
   - **3️⃣ Page Transitions**: Hardware-accelerated GPU curtain cross-dissolve (`#pageTransitionOverlay`) on card clicks with event isolation for quick actions.
   - **4️⃣ Scroll Parallax**: Differential depth offsets (`data-parallax-depth="1"`, `1.4`, `1.8`, `1.2`) linked to Lenis scroll.
4. **Flawless Responsiveness & Zero Regressions**: Fully responsive on desktop (`≥1024px`), tablet (`768px–1023px`), and mobile (`≤767px`) with minimum touch targets `≥44×44px` and full cart/bag synchronization.

---

## 2. Component Architecture & UI Elements

### 2.1 Section Header & Synced Category Switcher
- **Eyebrow Pill**: `.recent-eyebrow` with soft rose border (`rgba(251, 113, 133, 0.2)`), translucent background (`rgba(251, 113, 133, 0.08)`), and `<i data-lucide="sparkles"></i> RESUME BROWSING`.
- **Editorial Headline**: Playfair Display serif typography (`clamp(24px, 3vw, 34px)`), letter-spacing `-0.02em`: *"Recently Visited Pieces"*.
- **Sub-caption**: *"Curated history of garments, timepieces, and acoustics explored during your session."*
- **Category Filter Tabs (`role="tablist"`)**:
  - Filter pills: `All History`, `Apparel`, `Footwear`, `Acoustics`, `Objects & Accents`.
  - **120fps GPU Progress Bar (`.recent-tab-progress`)**: 2px gradient line (`linear-gradient(90deg, #38BDF8, #818CF8, #FB7185)`) animated via GPU `transform: scaleX(0) → scaleX(1)` with `transform-origin: left center` on the active tab (5-second auto-cycle, pauses on mouseenter/focus, instant sync on click).
- **Header Action Controls**:
  - Clear History button: Minimalist pill (`.recent-clear-btn`) with trash/x icon and soft hover glow.
  - Glide Navigation Controls: Glass prev/next chevron buttons (`.recent-glide-nav-btn`) to smoothly advance the rail.

### 2.2 Horizontal Glide Rail (`.recent-glide-rail`)
- CSS scroll-snap container (`scroll-snap-type: x mandatory`) with hidden scrollbar, generous horizontal padding, and smooth native momentum scrolling on touch devices.
- Seamlessly accommodates dynamic items from `localStorage` (`nex_recent_products`), falling back to a curated set of editorial pieces if storage is empty.

### 2.3 Product Card Architecture (`.recent-glide-card`)
- **Card Base**: `min-width: 260px; max-width: 280px`, `background: rgba(10, 18, 32, 0.75)`, `backdrop-filter: blur(20px)`, `border: 1px solid rgba(255, 255, 255, 0.08)`, `border-radius: 16px`, `scroll-snap-align: start`.
- **Specular Glare Element**: `.recent-card-glare` positioned absolute with dynamic radial gradient mask.
- **Media Frame (`.recent-card-media`)**:
  - Aspect ratio `1:1.08`, `background: radial-gradient(circle at 50% 40%, #16243D 0%, #080F1E 100%)`, `border-radius: 12px`, `overflow: hidden`.
  - Studio product thumbnail with smooth scale `1.08x` on hover.
  - Floating minimal category tag (e.g., `APPAREL`, `FOOTWEAR`, `ACOUSTICS`).
- **Strict 3-Item Luxury Metadata (`.recent-card-meta`)**:
  - Brand/House: `10px`, uppercase, `letter-spacing: 0.08em`, `color: #64748B`.
  - Title: `14px`, `font-weight: 500`, `color: #F1F5F9`.
  - Price: `13px`, `font-weight: 600`, `color: #FFFFFF`, tabular numbers (`font-variant-numeric: tabular-nums`).
- **Tactile Quick Add Action (`.recent-card-quick-add`)**:
  - `34×34px` glass circle button (`background: rgba(255, 255, 255, 0.08)`).
  - Generates coordinate-based expanding ripple wave (`.recent-ripple`).
  - Morphs into emerald checkmark (`#10B981`) for 1.4s with live `window.nexCart.addItem(...)` invocation.
  - Event propagation is isolated so it never triggers accidental page navigation.

---

## 3. Motion Standards Implementation

### 3.1 Standard 1: Micro-interactions
1. **Look/Category Switcher Sync & 120fps Timer**:
   - Tab auto-timer runs a 5000ms loop using GPU `transform: scaleX`.
   - Switching tabs smoothly filters the visible cards in the rail using opacity and scale transforms.
   - Pauses cleanly on mouseenter/focus, resumes on mouseleave.
2. **Tactile Quick-Add Ripple**:
   - Calculates click coordinates relative to the button center.
   - Injects `.recent-ripple` span with spring expansion and opacity decay.
3. **Scroll Reveal Entrance**:
   - `inView('.home-recently-viewed-section', ...)` using Motion.dev triggers a staggered cascade:
     - Header & Tabs: `opacity: [0, 1], y: [16, 0]`, duration `0.6s`.
     - Rail Cards: `opacity: [0, 1], y: [24, 0], scale: [0.96, 1]`, stagger `0.06s`, duration `0.7s`.

### 3.2 Standard 2: 3D Hover Effects
1. **Spring Lerp Mouse Tilt**:
   - `mousemove` listener on `.recent-glide-card`:
     - Calculates normalized `(dx, dy)` from card center.
     - Target angles: `tgtTX = -(dy * 6.0deg)`, `tgtTY = (dx * 6.0deg)`.
     - Smooth LERP step: `curTX = lerp(curTX, tgtTX, 0.12)`.
     - Transform: `rotateX(curTX) rotateY(curTY) translateZ(12px) translateY(parallaxY)`.
2. **Dynamic Specular Glare Tracking**:
   - Sets `--recents-glare-x` and `--recents-glare-y` percentages on the card.
   - Sets `--recents-glare-opacity: 1` on enter, smoothly decays to `0` on leave.
3. **Spring Back on Leave**:
   - LERPs back to `rotateX(0deg) rotateY(0deg) translateZ(0px) translateY(parallaxY)` with no visual jump.

### 3.3 Standard 3: GPU Page Transitions
1. Intercepts clicks on all `.recent-glide-card` elements (excluding `.recent-card-quick-add` and `.recent-clear-btn`).
2. Activates `#pageTransitionOverlay` (`opacity: 1` in 200ms) and routes to `pages/product.html?id=${id}` after 210ms.

### 3.4 Standard 4: Scroll Parallax
1. Connected to `window._nexLenis.on('scroll', ...)` and passive window scroll listener.
2. Calculates section scroll progress `prog` (`0 → 1`) and centered ratio `centered` (`-1 → +1`).
3. For each card:
   - `depth = parseFloat(card.getAttribute('data-parallax-depth'))` (1, 1.4, 1.8, 1.2).
   - `travel = depth * 6px`.
   - `yCard = (centered * travel).toFixed(2)`.
   - Updates `--recent-card-y: ${yCard}px`.
4. When not hovered, applies `translateY(${yCard}px)`.

---

## 4. Responsive Breakpoints & Accessibility

| Viewport | Layout & Behavior | 3D Tilt & Parallax |
|---|---|---|
| Desktop (`≥1024px`) | Horizontal glide rail with desktop nav buttons, 4-5 cards visible | Full 3D spring tilt (`±6.0°`), specular sheen, scroll parallax |
| Tablet (`768px–1023px`) | Momentum snap rail, 2.5-3 cards visible | Subtle tilt (`±3.0°`), reduced parallax (`0.6x`) |
| Mobile (`≤767px`) | Native horizontal swipe snap rail, touch targets `≥44px` | 3D tilt disabled for battery/touch safety |

- **Accessibility (WCAG 2.1 AA)**:
  - Accessible tab roles (`role="tablist"`, `role="tab"`, `aria-selected`).
  - Clear history with confirmation/undo and screen reader live notification.
  - Keyboard navigation (`Enter` / `Space`) on all cards and buttons.
  - Fully respects `@media (prefers-reduced-motion: reduce)`.

---

## 5. Files to Modify
1. **`index.html`**: Rebuild `<!-- RECENTLY VIEWED PRODUCTS TRAY -->` DOM with header, category filter tabs with 120fps progress line, glide rail, and nav buttons.
2. **`css/design-system.css`**: Replace outdated `.home-recently-viewed-section` styles with modern obsidian glassmorphism, glide rail styles, specular glare, quick-add ripples, and responsive rules.
3. **`js/animations.js`**: Add `initRecentlyViewedMotion()` orchestrating the 4 Motion Standards.
4. **`js/home.js`**: Update `initRecentlyViewed()` to support category tab filtering, 120fps auto-progress timer, glide rail navigation, quick-add ripple, and page transition safety.
