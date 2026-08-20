# Visual Order & Transit Telemetry (`pages/tracking.html`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the text-heavy order tracking page into an interactive, visual-first Transit Telemetry & Delivery Journey Map with an interactive SVG route visualizer, parcel spec matrix, live milestone radar, and simulation controls.

**Architecture:** Rebuild `pages/tracking.html` and `js/tracking.js` with a 70/30 visual dominance structure. An SVG route canvas renders animated transit nodes (Milan Atelier → European Logistics Hub → Final Destination) with real-time waypoint glowing beacons, accompanied by a 4-badge parcel spec matrix and an interactive timeline switcher that allows testing all 6 order stages dynamically.

**Tech Stack:** Vanilla JavaScript (ES6+), SVG Vector Graphics with CSS Keyframe Dash & Glow Animations, Lucide Icons, CSS Design Tokens, HTML5 Semantic Elements.

## Global Constraints
- Strictly adhere to the 70/30 visual-to-text dominance standard (headlines ≤ 6 words, micro-copy ≤ 25 words).
- Luxury dark canvas gradient background (`#031838` to `#000B1A`).
- Strict typography scale: `Instrument Serif` (editorial accents), `Manrope` (headlines & data numbers), `Inter` (UI and telemetry).
- Zero inline JavaScript event handlers (centralized event delegation only).
- Minimum 44×44px touch targets on mobile (375px) viewports with zero horizontal overflow.

---

### Task 1: Rebuild `pages/tracking.html` Visual Canvas Structure

**Files:**
- Modify: `pages/tracking.html`
- Styles: Embedded `<style>` + `css/design-system.css`

**Interfaces:**
- Consumes: `js/cart.js`, `js/header.js`, `js/footer.js`, `js/auth.js`
- Produces: Visual layout containers: `#trackingRouteMap`, `#trackingSpecMatrix`, `#trackingTimelineVisual`, `#trackingManifestCard`, `#trackingServiceAssistant`

- [ ] **Step 1: Write HTML markup for the visual tracking canvas**
  - Hero Header with Order Reference Badge & Live Dispatch Whisper.
  - Interactive SVG Transit Route Canvas (`#trackingRouteMap`) with animated vector paths, cargo pulse node, and waypoint cities (Milan Atelier → Munich Hub → Delivery Address).
  - 4-Badge Parcel Telemetry Matrix (`#trackingSpecMatrix`): Weight/Volume, Climate Control, Carbon Offset, Courier Dispatch.
  - Orbital Milestone Progress Bar (`#trackingTimelineVisual`).
  - Interactive Simulation Switcher allowing 1-click preview of all 6 delivery states.
  - Visual Order Manifest with product thumbnails and address badge.
  - Integrated AI Delivery Assistant Q&A panel.

- [ ] **Step 2: Add luxury styling for SVG route lines, glow filters, and telemetry badges**
  - Define animated dashed stroke keyframes (`@keyframes route-march`).
  - Style the 4-column parcel spec matrix with frosted dark obsidian cards.
  - Add responsive grid styles for tablet (1024px) and mobile (375px).

---

### Task 2: Implement Real-Time Telemetry & Route Animation in `js/tracking.js`

**Files:**
- Modify: `js/tracking.js`

**Interfaces:**
- Consumes: `sessionStorage.nex_confirmed_order` or URL `?ref=NX-XXXXX&status=IN_TRANSIT`
- Produces: `window.initTrackingTelemetry()`, `window.simulateTrackingStage(stageId)`

- [ ] **Step 1: Write stage data structures with geographic waypoint coordinates and telemetry stats**
  - Define 6 lifecycle stages: `CONFIRMED`, `PREPARING`, `HANDED`, `IN_TRANSIT`, `OUT_FOR_DELIVERY`, `DELIVERED`.
  - Attach telemetry data: `beaconPercent`, `carrierFlight`, `carbonGrams`, `temperature`, `hubLocation`.

- [ ] **Step 2: Implement SVG waypoint beacon updater**
  - Dynamically animate the cargo beacon circle along the SVG route path (`stroke-dashoffset` / coordinate translation).
  - Activate passed waypoints with emerald checkmarks (`#34D399`) and current waypoint with pulsing cyan glow (`#3DE0FF`).

- [ ] **Step 3: Implement 1-click stage simulation controls**
  - Add interactive buttons for testing all 6 order stages in real time without page reload.
  - Smoothly transition the telemetry numbers and ETA banner.

---

### Task 3: Multi-Viewport Browser Verification & Polish

**Files:**
- Verify: `http://localhost:8085/pages/tracking.html`

- [ ] **Step 1: Test default In-Transit state on Desktop (1280×800)**
  - Verify SVG route map renders with animated cyan dashed line and pulsing cargo beacon.
  - Verify 4 parcel spec badges render with icons and tabular numbers.
  - Verify Order Manifest displays item thumbnail, name, variant, and total.

- [ ] **Step 2: Test Interactive Simulation Switcher**
  - Click "Out for Delivery" and verify beacon moves to destination node.
  - Click "Delivered" and verify status badge turns emerald with arrival timestamp.

- [ ] **Step 3: Test Mobile Viewport (375×812)**
  - Verify route map scales responsively without clipped text.
  - Verify 2×2 grid reflow for parcel spec badges.
  - Verify zero horizontal scrolling.
