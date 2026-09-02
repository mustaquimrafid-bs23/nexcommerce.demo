# Batch 17: Courier Tracking Logistics Concierge (`app/tracking/page.tsx`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and finalize the Next.js Order Tracking experience with 100% UX and visual parity to the reference branch `feature/storefront-elevation`, including the interactive Live Logistics Concierge assistant, Delivery Reschedule modal, animated 5-stage milestone timeline, route map visualizer, plain British English (UK) copywriting (zero "AI words"), and unified Atelier obsidian navy background styling.

**Architecture:** Next.js 15 App Router with React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React, and Lenis smooth scrolling.

---

## Global Constraints

* **Atelier Color Palette:** Deep Obsidian (`#00142e`), Obsidian Navy (`#012148`), Surface Navy Card (`#0A2A54`), Electric Cyan (`#3DE0FF`), Emerald Delivery Pulse (`#34D399`), Radiant Rose (`#F13365`), Warm Stone (`#f4f2ee`).
* **Background Unification:** Background must strictly use `#01132B` with radial gradient `radial-gradient(120% 80% at 50% 0%, #032B5E 0%, #01132B 60%, #001838 100%)`. Zero pitch-black `#000B1A` or mismatched gray containers.
* **Plain UK English Copywriting:** Strict prohibition of "AI words", robotic buzzwords, or pseudo-academic jargon (e.g. *“Neural Route Optimizer”*, *“Biometric Telemetry”*, *“Heuristic”*, *“Hermetic Vault AI”*). All copy must read like a premier London atelier (e.g. *“Live Delivery Support”*, *“Estimated arrival”*, *“Carbon-neutral courier”*, *“Leave with neighbour”*, *“Signature required on delivery”*).
* **Touch Targets & Accessibility:** All interactive elements $\ge 44\text{px}$ touch targets, visible focus rings, WCAG 2.1 AA contrast ratios ($\ge 4.5:1$).
* **Test Verification Protocol:** Automated test pass via `node tests/test-tracking-elevation.js`, `node tests/test-tracking-page-migration.js`, and `npm run build` before declaring completion.

---

## Visual Reference & State Comparison

### 1. Desktop Visual Reference (`feature/storefront-elevation`)
![Desktop Tracking Reference](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/tracking_storefront_elevation_reference.png)

### 2. Mobile Visual Reference (`375x812`)
![Mobile Tracking Reference](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/tracking_storefront_elevation_mobile_ref.png)

### 3. Current Next.js Tracking Page
![Current Next.js Tracking](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/nextjs_tracking_current_fullpage.png)

---

## Component Breakdown & Migration Tasks

### Task 1: Live Logistics Concierge Assistant (`components/tracking/AILogisticsConcierge.tsx`)

**Files:**
- Modify: `components/tracking/AILogisticsConcierge.tsx`
- Create/Modify: `tests/test-tracking-elevation.js`

**Interfaces:**
- Consumes: `order: TrackingOrder`, `activeStage: number`, `onRescheduleClick: () => void`.
- Produces: Interactive delivery assistance panel with live status explanations, quick query chips, natural UK English conversation, and direct trigger to reschedule modal.

- [ ] **Step 1: Write failing test `tests/test-tracking-elevation.js`**
Assert that the concierge component is mounted, uses plain UK English with zero forbidden AI buzzwords, and includes interactive query chips.

- [ ] **Step 2: Run test to verify initial status**
Run: `node tests/test-tracking-elevation.js`

- [ ] **Step 3: Elevate `components/tracking/AILogisticsConcierge.tsx`**
- Replace robotic AI terms with clean UK English ("Live Delivery Concierge", "Courier Status", "Delivery Updates").
- Provide interactive query chips:
  - *"When will my courier arrive?"*
  - *"Can the driver leave the parcel with a neighbour?"*
  - *"Change delivery date or address"*
  - *"Is a signature required on delivery?"*
- Provide rich responses with contextual advice and 1-click action triggers (e.g. opens Reschedule modal).

- [ ] **Step 4: Run test to verify it passes**
Run: `node tests/test-tracking-elevation.js`

- [ ] **Step 5: Commit**
```bash
git add components/tracking/AILogisticsConcierge.tsx tests/test-tracking-elevation.js
git commit -m "feat(tracking): elevate live delivery concierge with natural uk english and query chips"
```

---

### Task 2: Delivery Reschedule Modal (`components/tracking/DeliveryRescheduleModal.tsx`)

**Files:**
- Modify: `components/tracking/DeliveryRescheduleModal.tsx`
- Modify: `app/tracking/page.tsx`

**Interfaces:**
- Consumes: `isOpen: boolean`, `currentEta: string`, `onClose: () => void`, `onReschedule: (newDate: string, instructions: string) => void`.
- Produces: Modal with date options (Tomorrow Morning, Tomorrow Afternoon, Specific Day), instruction presets, and instant confirmation toast.

- [ ] **Step 1: Refine `DeliveryRescheduleModal.tsx`**
- Clean date slot selection pills with accessible radio groups.
- Common courier instruction presets: *"Leave at concierge"*, *"Leave in secure porch"*, *"Leave with neighbour (No. 42)"*.
- Plain UK English copywriting with bank-grade encryption badge.

- [ ] **Step 2: Connect reschedule state in `app/tracking/page.tsx`**
Ensure rescheduling updates the active order's ETA dynamically and triggers a confirmation banner.

- [ ] **Step 3: Commit**
```bash
git add components/tracking/DeliveryRescheduleModal.tsx app/tracking/page.tsx
git commit -m "feat(tracking): refine delivery reschedule modal with instruction presets"
```

---

### Task 3: Background Unification, Typography & Copywriting Audit

**Files:**
- Modify: `app/tracking/page.tsx`
- Modify: `components/tracking/TrackingHeroHeader.tsx`
- Modify: `components/tracking/TelemetryMatrix.tsx`
- Modify: `components/tracking/DeliveryGuidanceCard.tsx`
- Modify: `tests/test-tracking-page-migration.js`

**Interfaces:**
- Consumes: Tailwind tokens and Atelier typography.
- Produces: 100% unified `#01132B` deep obsidian background and zero robotic AI buzzwords across all 12 tracking components.

- [ ] **Step 1: Check background wrapper in `app/tracking/page.tsx`**
Ensure main page container uses:
```tsx
<div className="min-h-screen bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] text-[#F8FAFF]">
```
- [ ] **Step 2: Streamline `TelemetryMatrix.tsx` and `TrackingHeroHeader.tsx` copy**
Replace "Biometric Security" and "Hermetic Vault AI" with "Climate-Neutral Transport", "Tamper-Evident Security Seal", and "Signature Verification on Delivery".

- [ ] **Step 3: Run comprehensive tracking migration test**
Run: `node tests/test-tracking-page-migration.js`
Expected: `✨ ALL Tracking Page Migration Verification Tests PASSED with 100% precision!`

- [ ] **Step 4: Commit**
```bash
git add app/tracking/ components/tracking/ tests/
git commit -m "refactor(tracking): unify background tokens and eliminate all robotic buzzwords"
```

---

### Task 4: Motion, Interactivity & SQA Verification

**Files:**
- Modify: `components/tracking/RouteMapSVG.tsx`
- Modify: `components/tracking/StageSimulatorBar.tsx`

**Interfaces:**
- Consumes: `activeStage: 0 | 1 | 2 | 3 | 4 | 5`.
- Produces: Smooth SVG pulse animation on route nodes, stage simulation switcher, and responsive desktop/mobile layouts.

- [ ] **Step 1: Verify RouteMapSVG node animations**
- [ ] **Step 2: Verify StageSimulatorBar state transitions**
- [ ] **Step 3: Run production build**
Run: `npm run build`
Expected: 100% clean production build.
- [ ] **Step 4: Visual verification in browser across Desktop (`1440x900`) and Mobile (`375x812`)**
- [ ] **Step 5: Commit**
```bash
git add components/tracking/
git commit -m "style(tracking): polish route map svg pulse and stage simulation transitions"
```

---

## Verification Plan

### Automated Tests
- Run tracking elevation suite: `node tests/test-tracking-elevation.js`
- Run tracking page migration suite: `node tests/test-tracking-page-migration.js`
- Run production build: `npm run build`

### Manual & Visual Verification
- Verify Desktop (`1440x900`) and Mobile (`375x812`) in Chrome DevTools MCP.
- Click query chips in Live Logistics Concierge and assert answers display.
- Open Delivery Reschedule modal, select new date, and assert updated ETA.
- Capture verified screenshots and embed in walkthrough.
