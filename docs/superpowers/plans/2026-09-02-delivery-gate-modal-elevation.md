# Batch 19: Global Dark Store Gate Modal & Header Delivery Hub Pill Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and finalize the Global Dark Store Delivery Gate Modal and Header Delivery Hub Pill with 100% UX and visual parity to the reference branch `feature/storefront-elevation`, including the centralized `useDeliveryGateStore`, 5 continental hubs (Berlin, Paris, London, Milan, Amsterdam), live postal code search, GPS location detection, plain British English (UK) copywriting (zero "AI words"), and unified Atelier obsidian navy background styling.

**Architecture:** Next.js 15 App Router with React 19, TypeScript, Zustand 5, Tailwind CSS v4, Motion (`motion/react`), Lucide React, and Lenis smooth scrolling.

---

## Global Constraints

* **Atelier Color Palette:** Deep Obsidian (`#00142e`), Obsidian Navy (`#012148`), Surface Navy Card (`#0A2A54`), Electric Cyan (`#3DE0FF`), Emerald Delivery Pulse (`#34D399`), Radiant Rose (`#F13365`), Warm Stone (`#f4f2ee`).
* **Background Unification:** Background must strictly use `#01132B` with radial gradient `radial-gradient(120% 80% at 50% 0%, #032B5E 0%, #01132B 60%, #001838 100%)`. Zero pitch-black `#000B1A` or mismatched gray containers.
* **Plain UK English Copywriting:** Strict prohibition of "AI words", robotic buzzwords, or pseudo-academic jargon (e.g. *“Neural Route Optimizer”*, *“Biometric Telemetry”*, *“Heuristic”*). All copy must read like a premier London atelier (e.g. *“Deliver to: Berlin Mitte”*, *“Same-Day Express Courier”*, *“Carbon-neutral delivery”*, *“Nearest Atelier”*).
* **Touch Targets & Accessibility:** All interactive elements $\ge 44\text{px}$ touch targets, visible focus rings, WCAG 2.1 AA contrast ratios ($\ge 4.5:1$).
* **Test Verification Protocol:** Automated test pass via `node tests/test-delivery-gate-global.js` and `npm run build` before declaring completion.

---

## Visual Reference & State Comparison

### 1. Desktop Visual Reference (`feature/storefront-elevation`)
![Desktop Delivery Gate Reference](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/delivery_gate_modal_reference.png)

### 2. Mobile Visual Reference (`375x812`)
![Mobile Delivery Gate Reference](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/delivery_gate_modal_mobile_ref.png)

### 3. Current Next.js State
![Current Next.js State](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/nextjs_delivery_gate_current.png)

---

## Component Breakdown & Migration Tasks

### Task 1: Centralized Delivery Gate Store (`store/useDeliveryGateStore.ts`)

**Files:**
- Create: `store/useDeliveryGateStore.ts`
- Create: `tests/test-delivery-gate-global.js`

**Interfaces:**
- Consumes: Zustand 5 state management.
- Produces: State hook providing `activeHub`, `isModalOpen`, `searchQuery`, `setActiveHub`, `openModal`, `closeModal`, and `DARK_STORE_HUBS` list.

- [ ] **Step 1: Write failing test `tests/test-delivery-gate-global.js`**
Assert store existence, hub list with 5 European hubs, modal open/close actions, and zero forbidden AI buzzwords.

- [ ] **Step 2: Run test to verify initial status**
Run: `node tests/test-delivery-gate-global.js`

- [ ] **Step 3: Implement `store/useDeliveryGateStore.ts`**
Provide type-safe Zustand store with local storage persistence (`nex_delivery_hub`).

- [ ] **Step 4: Run test to verify it passes**
Run: `node tests/test-delivery-gate-global.js`

- [ ] **Step 5: Commit**
```bash
git add store/useDeliveryGateStore.ts tests/test-delivery-gate-global.js
git commit -m "feat(delivery-gate): implement centralized useDeliveryGateStore for dark store fulfillment"
```

---

### Task 2: Delivery Gate Modal Elevation (`components/modals/DeliveryGateModal.tsx`)

**Files:**
- Create/Modify: `components/modals/DeliveryGateModal.tsx`
- Modify: `components/layout/DeliveryGateModal.tsx` (re-export / unified)

**Interfaces:**
- Consumes: `useDeliveryGateStore`.
- Produces: Polished luxury modal with postal code search, GPS detection button, 5 dark store hub cards with same-day speed tags, and carbon-neutral delivery notice.

- [ ] **Step 1: Implement `components/modals/DeliveryGateModal.tsx`**
- Search filter for city, region, and postal code.
- GPS button with loading spinner (*“Detecting Nearest Atelier...”*).
- 5 Hub cards with checkmark indicators and cutoff times.
- Background styling with `#0A2A54` and `#01132B` glassmorphism.

- [ ] **Step 2: Run test to verify it passes**
Run: `node tests/test-delivery-gate-global.js`

- [ ] **Step 3: Commit**
```bash
git add components/modals/DeliveryGateModal.tsx components/layout/DeliveryGateModal.tsx
git commit -m "feat(delivery-gate): elevate delivery gate modal with postal code search and gps detection"
```

---

### Task 3: Header Delivery Hub Pill (`components/layout/Header.tsx`)

**Files:**
- Modify: `components/layout/Header.tsx`

**Interfaces:**
- Consumes: `useDeliveryGateStore`.
- Produces: Header Delivery Hub Pill with canonical IDs (`#headerDeliveryHubPill` and `#deliveryHubBtn`), active hub label (*“Deliver to: Berlin Mitte”*), MapPin icon, and 1-click trigger to open the modal.

- [ ] **Step 1: Connect `useDeliveryGateStore` in `components/layout/Header.tsx`**
Ensure Header renders `#headerDeliveryHubPill` with active hub city name and connects to `openModal()`.

- [ ] **Step 2: Ensure modal opens and closes smoothly across Desktop and Mobile**

- [ ] **Step 3: Commit**
```bash
git add components/layout/Header.tsx
git commit -m "feat(delivery-gate): connect header delivery hub pill with canonical ids to delivery gate store"
```

---

### Task 4: SQA Verification & Production Build

**Files:**
- Modify/Verify: `tests/test-delivery-gate-global.js`

**Interfaces:**
- Consumes: Next.js build pipeline and test runner.
- Produces: 100% clean production build and visual evidence across Desktop (`1440x900`) and Mobile (`375x812`).

- [ ] **Step 1: Run automated tests**
Run: `node tests/test-delivery-gate-global.js`
Expected: `All delivery gate tests passed.`

- [ ] **Step 2: Run production build**
Run: `npm run build`
Expected: 100% clean build.

- [ ] **Step 3: Visual verification in browser**
Test in Chrome DevTools MCP across Desktop and Mobile, and capture screenshots.

- [ ] **Step 4: Commit**
```bash
git add tests/
git commit -m "test(delivery-gate): verify full delivery gate elevation and build integrity"
```

---

## Verification Plan

### Automated Tests
- Run delivery gate elevation test suite: `node tests/test-delivery-gate-global.js`
- Run Next.js production build: `npm run build`

### Manual & Visual SQA Verification
- Verify Desktop (`1440x900`) and Mobile (`375x812`) in Chrome DevTools MCP.
- Click Header Delivery Hub Pill and assert modal opens.
- Search postal code `75001` and verify Paris hub is filtered.
- Select Paris hub and assert Header pill updates to *“Deliver to: Paris Le Marais”*.
- Capture verified screenshots and embed in walkthrough.
