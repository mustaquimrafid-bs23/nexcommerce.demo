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
