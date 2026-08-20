# UI Animation Architecture (nexCommerce)

## 1. The Core Principle
Think of animation as UX communication, not decoration. Ask: "What is this communicating?" (e.g., state change, feedback, context). If the answer is just "it looks cool," do not add it. Never delay the shopping process (Find → Evaluate → Buy) with unnecessary animations.

## 2. Three-Layer Architecture
Do not use Motion (Framer Motion) for everything. Separate responsibilities:
- **CSS:** Simple interactions (hover, focus, color, basic transforms).
- **Motion:** Complex UI (state transitions, layout changes, gestures, coordinated animations).
- **React:** Business logic and state (cart, auth, API data).

## 3. When to use CSS (The Default)
Use standard CSS transitions for simple, self-contained effects ("When X happens, smoothly change Y").
- **Examples:** Product card hover (scale/translateY), button hover/color changes, simple underlines, simple focus states, image hover scale, simple section fade-ins, loading skeletons.
- **Why:** Better performance, easier to maintain, doesn't require importing an animation library.

## 4. When to use Motion
Introduce Motion only when interactions require coordinated state transitions, gestures, layout animation, or complex sequencing. Target ~10-15 meaningful Motion interactions on the homepage rather than animating every component.
- **State Changes:** Enter/exit animations, hero carousels/slides, AI Discovery state transitions.
- **Interactive Components:** Mobile menu drawers, cart drawers, filter panels, modals, product quick-views.
- **Layout Changes:** Filtering/sorting a product grid where items need to smoothly reorder (`layout` and `layoutId`).
- **Gestures:** Mobile swiping (carousels, image galleries), draggable drawers.
- **Coordinated Feedback:** "Add to Bag" where multiple UI elements (image, icon, cart count) react simultaneously in a sequence.
- **Scroll Storytelling:** Selected elements entering the viewport, but avoid animating *every* single text node or badge.

## 5. Performance Constraints
- Prioritize animating hardware-accelerated properties: `opacity`, `transform` (scale, translate, rotate).
- Avoid continuously animating layout-affecting properties: `width`, `height`, `top`, `left`, `margin`, `padding`.

## 6. Accessibility (MANDATORY)
- Respect `prefers-reduced-motion`. This is not optional.
- Use `MotionConfig reducedMotion="user"` or `useReducedMotion()`.
- **Fallback Behavior:** For reduced-motion users, replace large transform movements with simple fades or instant transitions, and completely disable parallax effects.

## 7. Anti-Patterns (NEVER DO THESE)
- Fading in every single section or rotating every card.
- Constant, restless movement (e.g., floating particles, vibrating images).
- Character-by-character text animation on hero headers.
- Hiding critical information (price, discount, availability, Add to Bag) behind a long or complex animation.

## 8. Luxury Micro-Interactions & Motion Engineering Standards

### 8.1 Subtle Micro-Interactions
- **Entrance & Fade-Ins:** Use gentle opacity and subtle translation (`translateY(4px to 8px)`) with custom luxury easing (`cubic-bezier(0.16, 1, 0.3, 1)` or `cubic-bezier(0.23, 1, 0.32, 1)`).
- **Sequencing & Staggering:** Stagger multi-item reveals by 40–80ms to create natural rhythm without feeling sluggish. Total sequence duration should not exceed 600ms.

### 8.2 Tactile Multi-Layer Hover Effects
- **Realistic Depth:** Avoid single-layer flat shadows. Use multi-layered ambient + direct shadows (e.g., `box-shadow: 0 4px 12px rgba(0,0,0,0.12), 0 12px 28px rgba(0,0,0,0.24)`) with subtle highlight bevels (`inset 0 1px 0 rgba(255,255,255,0.15)`).
- **Physical Lift:** Pair shadow expansion with micro-lift (`translateY(-2px to -4px)`) and slight spring recovery.

### 8.3 Scroll Animations & Parallax Depth
- **Depth Adjustment:** Modulate scroll velocity for background imagery or floating editorial elements (e.g., 0.85x or 1.15x scroll factor) to create physical depth.
- **Restraint:** Parallax must be subtle and contextual — never applied globally to text or core transactional buttons.

### 8.4 Seamless Page Transitions
- Maintain visual continuity and persistent layout anchors during route changes.
- Avoid abrupt white flashes or jarring layout jumps; use GPU-composited cross-fades or shared element morphing where justified.

### 8.5 Pro-Tips: Consistency & Performance
- **Cross-Breakpoint Validation:** Always verify motion across mobile (390px), laptop (1280px), and wide desktop (1440px+). Disable heavy parallax on mobile viewports to prevent scroll stutter.
- **Visual Budget:** Combine effects selectively. A luxury aesthetic requires restraint: if a hero section has dynamic background crossfade, surrounding UI chrome must remain calm and grounded.

### 8.6 3D Perspective Projection & Spatial Depth Constraints
- **Perspective Projection Safety:** In containers with `perspective: 1000px–1200px`, positive `translateZ` moves elements closer to the camera, optically expanding them outwards toward viewport corners by ~5%–6%.
- **Z-Axis Budget:** Cap corner-anchored elements (e.g. shoppable tags, badges) at `translateZ(10px–15px)`. Reserve `translateZ(30px–60px)` exclusively for centered focal elements.
- **Scroll & Mouse Physics Synchronization:** Pair mouse parallax lerps with viewport-aware transform bounds so differential translation never pushes UI cards into scrollbars or clipped regions.

### 8.7 Scroll Reveal Invariants & Dedicated Section Isolation
- **No Blanket Visibility on Mount:** Never pre-apply `.is-visible` synchronously on DOM load across `.reveal-on-scroll` elements. Always allow `IntersectionObserver` or Motion.dev `inView` to trigger entrance timing naturally at viewport thresholds (e.g. `rootMargin: '100px 0px'`, `threshold: 0.05`).
- **Dedicated Section Isolation:** Complex custom sections with bespoke motion orchestration (e.g., Curated Departments Bento Showcase) must be explicitly excluded from generic batch scroll loops (`if (info.target.classList.contains('custom-section')) return;`) to eliminate double-animations.

### 8.8 Luxury Bento Showcase Motion Standard (SSENSE / Apple Benchmark)
- **Lead-Anchor Staggered Entrance:** For multi-card bento layouts, the primary hero card must lead the entrance (`translateY(36px) → 0`, `scale(0.965 → 1.0)`, duration: 850–900ms), followed by secondary cards cascading in rhythmic 75–90ms intervals.
- **Optical Image Settle:** Internal photography should ease from `scale(1.08) → 1.00` within overflow-hidden frames upon viewport entry.
- **Bidirectional Scroll Parallax:** Connect section scroll progress to Lenis smooth scroll loop to apply continuous GPU-accelerated vertical drift (`translateY(±24px to ±28px)`) to background photography when scrolling both down and up.
- **Dynamic Cursor Spotlight Sheen:** Use hardware-accelerated CSS custom variables (`--mouse-x`, `--mouse-y`, `--spotlight-opacity`) driven by card-level `mousemove` events to cast a radial spotlight sheen across dark obsidian surfaces and borders without causing layout reflows.

### 8.9 Continuous Product Feeds & 120fps LERP Physics Guardrails
- **Strict Prohibition on Auto-Filtering Intervals**: NEVER use automatic tab-switching intervals or auto-filtering timers in product trays, recently viewed feeds, or catalogue rows. Auto-switching hides items unexpectedly while users are inspecting them, causing severe cognitive friction and visual stutter. Feeds must be calm, predictable, and user-paced.
- **Continuous Fluid Carousel Pattern**: Multi-item history and recommendation feeds must be built as an uninterrupted, single-track horizontal carousel with native momentum drag, wheel glide, step chevrons, and real-time position badges (`01 / 07`).
- **Zero DOM Thrashing on Feeds**: Feed cards must be rendered once into the DOM. Never wipe `innerHTML` or recreate nodes during interaction or pagination.
- **LERP vs. CSS Transition Conflict Prevention**: Elements actively manipulated by JavaScript `requestAnimationFrame` LERP loops (such as 3D mouse tilt) MUST NOT have CSS `transition: transform` enabled during hover, as the browser's CSS transition engine will fight continuous RAF updates, causing visual stuttering.
- **GPU-Accelerated Progress Animation**: Progress and timer bars must use GPU `transform: scaleX(0) → scaleX(1)` with CSS keyframes and `animation-play-state: paused` on hover, rather than JavaScript DOM intervals.

### 8.10 Category Look Switcher & 120fps Animation Track Master Standard
- **120fps Hardware-Accelerated Progress Track**: Progress bars on look switchers, story capsules, and editorial showcases MUST use GPU `transform: scaleX(progress)` with `transform-origin: left center` and `will-change: transform`, driven by `requestAnimationFrame` + `performance.now()` with calibrated cycling (e.g. 6.0s).
- **User-Control Pause/Resume**: Automatically pause the timer on `mouseenter` and `touchstart`; smoothly resume from the current elapsed timestamp on `mouseleave` and `touchend` without resetting progress.
- **Dual Shoppable & Filter Sync**: Every look showcase must support both direct quick-addition of the featured item (tactile ripple + cart state machine) and catalog category filter synchronization (`applyCategoryFilter()` + `history.replaceState()` + smooth scroll).
- **In-Place Media Transitions**: Transition imagery using subtle opacity/scale eases (`scale(1.04 → 1.0)`, `opacity: 0.4 → 1.0` over 120–300ms) while keeping DOM node references persistent (zero DOM thrashing).
- **Horizontal Filter Pill Invariant**: All horizontal scrolling pill filters (`.plp-filter-bar`, tab strips) MUST have `flex-shrink: 0; white-space: nowrap;` to guarantee 100% text legibility across all mobile viewports (320px–480px).
- **Hairline Luxury Border Invariant**: All dark luxury cards and capsules must strictly use translucent hairline borders (`1px solid rgba(255, 255, 255, 0.08)`) with multi-layer diffuse ambient shadows, strictly avoiding hard or thick solid outlines.

