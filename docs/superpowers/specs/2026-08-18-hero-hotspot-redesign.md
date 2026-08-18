# Design Spec: Luxury Frosted Glass Hero Shoppable Hotspot

**Date:** 2026-08-18  
**Topic:** Hero Shoppable Hotspot Component Redesign (`.hero-3d-hotspot-wrap`)  
**Status:** In Review  

---

## 1. Overview & Objective
Redesign the floating shoppable hero hotspot card (`.hero-3d-hotspot-wrap`, `#heroHotspotCard`, and children) in `index.html`, `css/design-system.css`, and `js/home.js`. The redesigned component delivers an ultra-luxurious, obsidian frosted glass capsule aesthetic (benchmarked against SSENSE, NET-A-PORTER, and Apple) that remains effortlessly legible, elegant, and 100% responsive across all device viewports (desktop, scaled 1080p laptops, tablets, mobile devices, and landscape screens).

---

## 2. Visual Design & Aesthetic Specifications

### 2.1 Luxury Obsidian Frosted Glass Capsule
- **Background & Glassmorphism:** Dark obsidian glass foundation `rgba(7, 13, 26, 0.82)` with high-fidelity `backdrop-filter: blur(20px) saturate(180%)`.
- **Border & Surface Highlights:** 1px perimeter border in `rgba(255, 255, 255, 0.18)` with subtle inner glow `inset 0 1px 0 rgba(255, 255, 255, 0.25)`.
- **Shadows:** Multi-layer ambient drop shadow `0 12px 36px rgba(0, 0, 0, 0.65), 0 2px 8px rgba(0, 0, 0, 0.4)` for floating visual depth.
- **Hover Micro-Interaction:** Smooth scale `scale(1.02)`, subtle `translateY(-2px)`, border illumination `rgba(244, 63, 94, 0.5)`, and soft crimson ambient glow.

### 2.2 Beacon Pulse Indicator (`.hero-hotspot-beacon`)
- **Core Dot:** Crisp 9px circular dot with pure white center `#FFFFFF` and 2px rose border (`#F43F5E`), casting an intentional 10px focal glow.
- **Pulse Halo:** Subtle breathing radial wave (`beaconPulse` keyframe) with `scale(0.8) -> scale(1.9)` and gentle opacity fade over 2.4s.
- **Visual Harmony:** Aligns horizontally with the capsule card with a 8px–10px gap.

### 2.3 Product Card Content & Typography (`.hero-hotspot-card`)
- **Thumbnail Avatar (`.hero-hotspot-thumb`):** 34px circle (desktop) / 28px (mobile) with `border: 1px solid rgba(255, 255, 255, 0.2)` and `object-fit: cover` image.
- **Eyebrow Tag (`.hero-hotspot-label`):** `FEATURED PIECE` or `LOOK 01`, 7.5px–8px, uppercase, letter-spacing `0.12em`, rose accent `#F43F5E`.
- **Product Title (`.hero-hotspot-title`):** 10.5px–11px (desktop) / 9px (mobile), font-weight 600, color `#FFFFFF`, clean truncation (`text-overflow: ellipsis`) with calibrated `max-width` to maximize readable characters.
- **Price (`.hero-hotspot-price`):** 10.5px–11px (desktop) / 9.5px (mobile), font-weight 700, tabular numbers, crisp silver-white `rgba(255, 255, 255, 0.95)`.
- **Quick-Add CTA (`.hero-hotspot-add-btn`):** 28px circle (desktop) / 24px (mobile), high-contrast rose background `#F43F5E`, smooth hover scale, 44px touch area for mobile accessibility, instant bag addition + toast trigger.

---

## 3. Responsive Breakpoint Matrix

| Viewport Category | Screen Width / Height | Position Coordinates | Max Width & Scaling | Behavior & Layout |
| :--- | :--- | :--- | :--- | :--- |
| **Large Desktop / 4K** | `≥ 1440px` | `bottom: 40px; right: 56px;` | `max-width: 300px` | Full fidelity, generous breathing room, 3D translation depth `translateZ(15px)`. |
| **Standard Desktop** | `1025px - 1439px` | `bottom: 32px; right: 40px;` | `max-width: 270px` | Crisp alignment, zero overlap with left editorial hero typography. |
| **Compact Laptop / Scaled 1080p** | `Height ≤ 680px` & `Width ≥ 769px` | `bottom: 22px; right: 28px;` | `max-width: 240px` | Scaled padding and typography to preserve vertical headroom. |
| **Tablet Viewports** | `769px - 1024px` | `bottom: 24px; right: 28px;` | `max-width: 240px` | Anchored bottom-right with 44px touch target on Quick-Add CTA. |
| **Mobile Standard** | `381px - 768px` | `top: 14px; right: 14px;` | `max-width: 210px` | Pinned top-right below navbar with optimized font scale (`8.5px` title, `26px` thumb) to prevent text truncation. |
| **Small Mobile** | `≤ 380px` (e.g. iPhone SE) | `top: 10px; right: 10px;` | `max-width: 185px` | Compact margins, tight padding (`3px 5px`), preventing any horizontal overflow. |
| **Ultra-Short Landscape** | `Height < 520px` | `top: 10px; right: 14px;` | `max-width: 180px` or compact chip | Positioned neatly in top right without obscuring landscape typography. |

---

## 4. Interaction & JavaScript Integration

1. **Quick-Add (`#heroHotspotAddBtn`):**
   - Click event triggers state transformation: morphs `+` icon to checkmark `✓` for 1.4s, emits cart event, updates header bag counter with haptic scale pulse, and shows luxury Sonner/toast.
   - Prevents bubbling to card navigation (`e.stopPropagation()` / `e.target.closest()`).
2. **Card Navigation (`#heroHotspotCard`):**
   - Direct click on thumbnail/text navigates smoothly to `pages/product.html?id=[id]` with page transition curtain.
3. **Carousel State Synchronization (`setStory()` in `js/home.js`):**
   - As hero slides change, thumbnail image (`#heroDockThumbImg`), title (`#heroHotspotTitle`), price (`#heroHotspotPrice`), and `data-id` update synchronously with a gentle opacity fade.
   - Preserves coordinates across responsive resize events without inline coordinate conflicts.

---

## 5. Accessibility (WCAG 2.1 AA)

- **Color Contrast:** All text meets or exceeds 4.5:1 contrast against the obsidian glass backdrop (`#FFFFFF` and `#F43F5E` on dark obsidian).
- **Touch Target:** Minimum 44×44px interactive hit area on both the card and the quick-add button via pseudo-element expansions.
- **ARIA & Semantics:** `aria-label="Quick Add to Bag"` on the button, semantic headings and labels, keyboard navigable with visible focus ring.
