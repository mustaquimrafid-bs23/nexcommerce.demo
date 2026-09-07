# Design Specification: Global Header Luxury Motion & Micro-UI Redesign

- **Date:** 2026-08-18
- **Author:** Founding Full-Stack Engineer / Senior UI-UX Lead
- **Scope:** Global Header (`<header class="site-header" id="siteHeader">`), Top Announcement Bar (`.top-announcement-bar`), Mobile Drawer (`#mobileNavDrawer`), design system styles in `css/design-system.css`, header controller logic in `js/header.js`, and 4 Motion Standards orchestration in `js/animations.js`.

---

## 1. Overview & Objectives

The **Global Header** (`<header class="site-header" id="siteHeader">`) is the primary visual anchor and universal navigation system across all 22 storefront pages of nexCommerce.

The current implementation has outdated basic transitions (generic 160ms–180ms ease curves), lacks interactive physics, 3D depth, and tactile feedback, and does not leverage our established **4 Motion Standards** (Micro-interactions, 3D Hover Effects, Page Transitions, Scroll Parallax).

### Key Goals:
1. **Ultra-Clean Luxury Editorial Aesthetic**: Obsidian glassmorphism (`rgba(6, 14, 28, 0.72)`), subtle 1px translucent borders (`rgba(255, 255, 255, 0.08)`), zero hard/bold borders, refined typography, and optimal white space.
2. **Full Integration of All 4 Motion Standards**:
   - **1️⃣ Micro-interactions**: Magnetic nav link glider indicator, spring-pop badge bounce on count updates, Concierge sparkles micro-rotation, action button tactile ripple, and mobile drawer staggered link cascade.
   - **2️⃣ 3D Hover Effects**: High-precision spring lerp mouse tilt (`±4.5°`, `perspective: 800px`), dynamic cursor-following specular glare (`--header-glare-x`, `--header-glare-y`), and 3D spatial dropdown emergence.
   - **3️⃣ Page Transitions**: Hardware-accelerated GPU curtain cross-dissolve (`#pageTransitionOverlay`) on all navigation links and dropdown/drawer destinations.
   - **4️⃣ Scroll Parallax & Header Intelligence**: Lenis-synced dynamic header height compaction (`72px → 60px` desktop, `64px → 54px` mobile), progressive background opacity lerp, adaptive backdrop blur (`16px → 24px`), and announcement bar smooth slide-up collapse.
3. **Flawless Responsiveness & Zero Regressions**: Fully responsive on desktop (`≥1024px`), tablet (`768px–1023px`), and mobile (`≤767px`) with minimum touch targets `≥44×44px`. Preserves full functionality of Search modal (`Ctrl + K`), Concierge modal, Cart drawer, Auth state, and Wishlist badge counts across the application.

---

## 2. Component Architecture & UI Elements

### 2.1 Top Announcement Bar (`.top-announcement-bar`)
- **Container**: Minimalist banner with soft dark background (`rgba(4, 10, 20, 0.94)`), delicate lower border (`1px solid rgba(255, 255, 255, 0.05)`), font size `11px`, `letter-spacing: 0.04em`.
- **Content**: Rotating/ticker luxury trust guarantees:
  - `<i data-lucide="rotate-ccw"></i> 14-day effortless returns`
  - `<span class="announcement-dot"></span>`
  - `<i data-lucide="shield-check"></i> 100% verified authentic`
  - `<span class="announcement-dot"></span>`
  - `<i data-lucide="truck"></i> Complimentary insured global delivery`
- **Behavior**: Smooth slide-up collapse and opacity fade when scrolling down, restoring smoothly at the top of the page without cumulative layout shift (CLS).

### 2.2 Global Header Canvas (`.site-header`)
- **Base Canvas**: Sticky top navigation bar (`position: sticky; top: 0; z-index: 1000`), height `72px` (compacts to `60px` on scroll), `background: rgba(6, 14, 28, 0.72)`, `backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px)`.
- **Border**: Minimal hairline `border-bottom: 1px solid rgba(255, 255, 255, 0.08)` (no bold/hard borders).
- **Layout Inner (`.nav-inner`)**: Flex container with space-between alignment and 24px gap.

### 2.3 Left: Brand Group & Navigation Links
- **Brand Logo (`.nav-logo`)**: High-resolution vector logo (`assets/images/brand/logo_light.png`) with smooth magnetic micro-hover scaling (`scale(1.02)`).
- **Mobile Menu Trigger (`#mobileMenuBtn`)**: `40×40px` touch button (visible only on mobile/tablet) with micro-animated hamburger-to-close transition.
- **Editorial Navigation Links (`.nav-menu-links`)**:
  - `Categories` (`pages/category.html?cat=all`)
  - `New In` (`pages/category.html?cat=new`)
  - `Discover` (`pages/discovery.html`) with radiant crimson `NEW` pill.
  - **Magnetic Glider Indicator (`.nav-glider-pill`)**: Liquid indicator bar that smoothly glides and morphs width/position beneath active and hovered navigation links.

### 2.4 Center: Smart Search Pill (`.nav-search-pill-wrap`)
- **Pill Element (`#searchTriggerBtn`)**:
  - `height: 40px`, `background: rgba(255, 255, 255, 0.035)`, `border: 1px solid rgba(255, 255, 255, 0.1)`, `border-radius: 100px`.
  - Magnifying glass icon with soft cyan glow on hover.
  - Placeholder text: *"Search collections, garments, acoustics..."*.
  - Keyboard shortcut badge: `<span class="search-kbd">Ctrl + K</span>` with tactile keycap styling.
  - Specular sheen highlight that tracks mouse coordinates across the pill surface.

### 2.5 Right: Priority Actions & 3-Dot Overflow Menu (`.nav-right-actions`)
- **Style Concierge Trigger (`#conciergeNavTrigger`)**:
  - Pill button with subtle rose/crimson gradient (`rgba(225, 29, 72, 0.12)`), `border: 1px solid rgba(225, 29, 72, 0.35)`.
  - Sparkles icon with subtle continuous ambient shimmer and micro-rotation on hover.
- **Wishlist Action (`#headerWishlistLink`)**:
  - 38px circular glass button with heart icon and dynamic count badge (`#headerWishlistCount`) that performs an elastic spring bounce when items are added or removed.
- **Account Action (`a[data-auth-account]`)**:
  - Circular glass button with user icon and dynamic user name tooltip/label synced with session state.
- **Shopping Bag Action (`#headerCartLink`)**:
  - Circular glass button with shopping-bag icon and live count badge (`#headerCartCount`) featuring crimson gradient and spring pop animation.
- **3-Dot Overflow Menu (`#headerMoreMenu`)**:
  - Trigger button (`.nav-more-trigger`) with 3 horizontal dots.
  - **3D Spatial Dropdown (`.nav-more-dropdown`)**: Frosted obsidian panel (`background: rgba(6, 18, 38, 0.96); backdrop-filter: blur(24px)`) containing:
    - *Saved Wishlist* (Heart icon)
    - *Track Order* (Truck icon)
    - *AI Style Profile* (Sparkles icon)
    - *Order History* (Receipt icon)
  - Features 3D spatial emergence, smooth stagger entrance, and click-outside/Escape dismissal.

### 2.6 Mobile Navigation Drawer (`#mobileNavDrawer`)
- Full-height off-canvas drawer (`transform: translateX(-100%) → translateX(0)`) with obsidian glassmorphism (`rgba(6, 14, 28, 0.98)`).
- Staggered cascade animation for menu links upon drawer opening.
- Syncs live counts for Wishlist and Bag.

---

## 3. Motion Standards Implementation

### 3.1 Standard 1: Micro-interactions
1. **Magnetic Nav Link Glider**:
   - Gliding liquid pill element positioned under navigation links that animates `translateX`, `width`, and `opacity` to follow the mouse on hover, returning smoothly to the active page link on leave.
2. **Elastic Badge Pop on Count Change**:
   - When cart count or wishlist count changes, the badge triggers a CSS spring keyframe animation (`scale(0.6) → scale(1.3) → scale(0.9) → scale(1.0)` over 400ms).
3. **Concierge Sparkles Micro-Motion**:
   - Sparkles icon rotates `15deg` on hover with a radiant glow pulsation (`box-shadow: 0 0 16px rgba(225, 29, 72, 0.4)`).
4. **Tactile Action Ripples**:
   - Clicking on action icon buttons or the search pill generates a coordinates-based expanding light ripple (`.nav-ripple`).
5. **Mobile Drawer Staggered Cascade**:
   - When mobile drawer opens, navigation items slide in sequentially with `stagger(0.04s)` and `opacity: [0, 1], x: [-16, 0]`.

### 3.2 Standard 2: 3D Hover Effects
1. **Spring Lerp Mouse Tilt on Action Controls & Concierge**:
   - Interactive elements (`.concierge-nav-btn`, `.nav-icon-btn`, `.nav-search-pill`) listen for `mousemove`:
     - Calculates normalized `(dx, dy)` from button center.
     - Target angles: `tgtTX = -(dy * 4.5deg)`, `tgtTY = (dx * 4.5deg)`.
     - Smooth LERP interpolation: `curTX = lerp(curTX, tgtTX, 0.15)`.
     - Transform: `perspective(800px) rotateX(curTX) rotateY(curTY) translateZ(8px)`.
2. **Dynamic Cursor Specular Glare Tracking**:
   - Injects custom properties `--header-glare-x` and `--header-glare-y` matching cursor position percentages.
   - Dynamic radial gradient specular highlight moves across the button surface with smooth opacity fade.
3. **3D Spatial Dropdown Emergence**:
   - 3-Dot overflow dropdown opens with 3D spatial perspective:
     - Closed: `transform: perspective(800px) rotateX(-8deg) scale(0.95) translateZ(-10px); opacity: 0; pointer-events: none;`
     - Open: `transform: perspective(800px) rotateX(0deg) scale(1) translateZ(0); opacity: 1; pointer-events: auto;`
     - Transition curve: `cubic-bezier(0.23, 1, 0.32, 1) 220ms`.

### 3.3 Standard 3: Page Transitions
1. Navigation clicks on all header links (`.nav-item-link`, `.mobile-drawer-link`, `.nav-more-item`, `.nav-logo`, `#headerWishlistLink`, `#headerCartLink`) are intercepted.
2. If navigating to a different page within the site, activates hardware-accelerated GPU curtain cross-dissolve (`#pageTransitionOverlay` opacity `0 → 1` over 180ms) and navigates cleanly after 200ms.
3. Does not intercept in-page triggers (Search modal, Concierge modal, Cart drawer trigger, 3-Dot menu toggle).

### 3.4 Standard 4: Scroll Parallax & Header Intelligence
1. **Lenis-Synced Dynamic Header Tracking**:
   - Connected to `window._nexLenis` scroll emitter and passive window scroll listener.
   - Calculates scroll distance:
     - `scrollY > 20px`: Header enters `.scrolled` state.
     - Height compacts smoothly from `72px` to `60px` via GPU-accelerated transition.
     - Background opacity transitions from `0.72` to `0.96` with `backdrop-filter: blur(24px)`.
     - Delicate bottom shadow expands (`box-shadow: 0 8px 32px rgba(0, 0, 0, 0.45)`).
2. **Top Announcement Bar Parallax Collapse**:
   - As user scrolls down past `10px`, announcement bar slides up (`transform: translateY(-100%)`) with opacity decay, freeing viewport space without layout shifts.

---

## 4. Responsive Breakpoints & Accessibility

| Viewport | Layout & Adaptations | Motion & Interactions |
| :--- | :--- | :--- |
| **Desktop (`≥1024px`)** | Full layout: Logo, Nav Links, Search Pill (`Ctrl + K`), Concierge Pill, Action Icons, 3-Dot Overflow Menu. Height: `72px → 60px`. | Full 3D spring tilt (`±4.5°`), specular glare tracking, magnetic link glider, scroll parallax. |
| **Tablet (`768px–1023px`)** | Logo, Search Pill (compact), Concierge Pill, Cart Bag, 3-Dot Menu, Mobile Menu Trigger. Nav links collapse into Drawer. Height: `64px → 56px`. | Moderate 3D tilt (`±2.5°`), specular highlight, spatial dropdown. |
| **Mobile (`≤767px`)** | Clean minimal bar: Mobile Menu Trigger, Centered Logo, Search Icon, Cart Bag with live badge. Height: `60px → 52px`. Drawer takes full navigation. | Touch-optimized instant feedback, 3D tilt bypassed for battery/touch safety, staggered drawer reveal. |

- **Accessibility (WCAG 2.1 AA)**:
  - Minimum touch targets `≥44×44px` across all interactive triggers.
  - Proper ARIA attributes: `aria-expanded`, `aria-haspopup="true"`, `aria-label`, `role="menu"`, `role="menuitem"`.
  - Keyboard navigation: `Escape` closes dropdown/drawer, `Enter`/`Space` activates triggers, `Tab` focus ring styling (`outline: 2px solid rgba(225, 29, 72, 0.6); outline-offset: 2px`).
  - Strict compliance with `@media (prefers-reduced-motion: reduce)` (instant transitions, 3D tilt/glare disabled).

---

## 5. Files to Modify

1. **`index.html`**: Update `<!-- GLOBAL HEADER (ULTRA-CLEAN LUXURY NAVIGATION) -->` and `.top-announcement-bar` markup to include magnetic glider container, refined search pill, and luxury action group.
2. **`css/design-system.css`**: Replace outdated header and announcement bar styles with modern obsidian glassmorphism, 3D spatial dropdown, magnetic glider, badge spring bounce, tactile ripples, and responsive compaction rules.
3. **`js/header.js`**: Update header controller to handle magnetic glider tracking, 3-Dot overflow spatial states, mobile drawer toggle with body lock, badge sync, and search/concierge event bridging.
4. **`js/animations.js`**: Add `initGlobalHeaderMotion()` implementing all 4 Motion Standards (Micro-interactions, 3D Tilt & Specular Glare, GPU Page Transitions, Lenis Scroll Parallax).
5. **Cross-Page Consistency**: Ensure identical header markup and scripts are maintained across all storefront pages.
