# Batch 18: Client Services Desk & Atelier Directory (`app/contact/page.tsx`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and finalize the Next.js Client Services & Contact page with 100% UX and visual parity to the reference branch `feature/storefront-elevation`, including live Paris/Milan timezone clocks, 3 dedicated service channels (Direct WhatsApp, Bespoke Styling, White-Glove Logistics), interactive 5-domain ticket dispatcher with 1-click demo fill, 4-item FAQ accordion, physical atelier directory with map links, plain British English (UK) copywriting (zero "AI words"), and unified Atelier obsidian navy background styling.

**Architecture:** Next.js 15 App Router with React 19, TypeScript, Tailwind CSS v4, Motion (`motion/react`), Lucide React, and Lenis smooth scrolling.

---

## Global Constraints

* **Atelier Color Palette:** Deep Obsidian (`#00142e`), Obsidian Navy (`#012148`), Surface Navy Card (`#0A2A54`), Electric Cyan (`#3DE0FF`), Emerald Status (`#34D399`), Radiant Rose (`#F13365`), Warm Stone (`#f4f2ee`).
* **Background Unification:** Background must strictly use `#01132B` with radial gradient `radial-gradient(120% 80% at 50% 0%, #032B5E 0%, #01132B 60%, #001838 100%)`. Zero pitch-black `#000B1A` or mismatched gray containers.
* **Plain UK English Copywriting:** Strict prohibition of "AI words", robotic buzzwords, or pseudo-academic jargon (e.g. *“Neural Stylist”*, *“Biometric”*, *“Heuristic”*, *“Autonomous Settlement”*). All copy must read like a premier London atelier (e.g. *“Client Services Desk”*, *“Bespoke Tailoring & Horology”*, *“Direct Atelier WhatsApp”*, *“Authorised”*, *“Personalised”*).
* **Touch Targets & Accessibility:** All interactive elements $\ge 44\text{px}$ touch targets, visible focus rings, WCAG 2.1 AA contrast ratios ($\ge 4.5:1$).
* **Test Verification Protocol:** Automated test pass via `node tests/test-contact-elevation.js` and `npm run build` before declaring completion.

---

## Visual Reference & State Comparison

### 1. Desktop Visual Reference (`feature/storefront-elevation`)
![Desktop Contact Reference](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/contact_storefront_elevation_reference.png)

### 2. Mobile Visual Reference (`375x812`)
![Mobile Contact Reference](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/contact_storefront_elevation_mobile_ref.png)

### 3. Current Next.js Contact Page
![Current Next.js Contact](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/nextjs_contact_current_fullpage.png)

---

## Component Breakdown & Migration Tasks

### Task 1: Live Status Header & Service Channels Grid (`components/contact/ServiceChannelsGrid.tsx`)

**Files:**
- Modify: `components/contact/ServiceChannelsGrid.tsx`
- Modify: `app/contact/page.tsx`
- Create/Modify: `tests/test-contact-elevation.js`

**Interfaces:**
- Consumes: `useConciergeStore` for opening personal styling drawer.
- Produces: 3 dedicated service channels:
  1. Direct Atelier WhatsApp (with pre-encoded text query to `+39 02 8842 1190`).
  2. Bespoke Styling Session (1-click trigger to styling concierge).
  3. White-Glove Order Support (smooth anchor scroll to ticket dispatcher).

- [ ] **Step 1: Write failing test `tests/test-contact-elevation.js`**
Assert that the service channels grid, ticket dispatcher, and atelier directory exist and use plain UK English with zero forbidden AI buzzwords.

- [ ] **Step 2: Run test to verify initial status**
Run: `node tests/test-contact-elevation.js`

- [ ] **Step 3: Elevate `components/contact/ServiceChannelsGrid.tsx`**
- Replace robotic jargon (*“neural stylist”*) with natural British English (*“personal sizing advice and styling guidance”*).
- Provide authentic WhatsApp link: `https://wa.me/390288421190?text=Hello%20nexCommerce%20Atelier%2C%20I%20would%20like%20to%20inquire%20about...`.
- Add live Paris and Milan time indicators.

- [ ] **Step 4: Run test to verify it passes**
Run: `node tests/test-contact-elevation.js`

- [ ] **Step 5: Commit**
```bash
git add components/contact/ServiceChannelsGrid.tsx tests/test-contact-elevation.js
git commit -m "feat(contact): elevate service channels grid with direct whatsapp link and live clocks"
```

---

### Task 2: Interactive Ticket Dispatcher & 1-Click Demo Fill (`components/contact/TicketDispatcherCard.tsx`)

**Files:**
- Modify: `components/contact/TicketDispatcherCard.tsx`

**Interfaces:**
- Consumes: User inputs for domain, client name, email, order reference, and inquiry details.
- Produces: Dispatched ticket state with unique reference token (`TKT-XXXX-NX`), copy to clipboard button with feedback, reset button, and 1-click demo autofill (`#quickDemoInquiryBtn`).

- [ ] **Step 1: Elevate `TicketDispatcherCard.tsx`**
- 5 domain selection pills: `styling` (Styling & Wardrobe), `logistics` (Order Logistics), `alterations` (Bespoke Tailoring), `provenance` (Materials & Provenance), `membership` (Private Client).
- 1-Click Demo Inquiry autofill button.
- Form validation for required fields.
- Polished ticket confirmation box with copy reference button (`Copy Ref` $\to$ `Copied!`) and reset button.

- [ ] **Step 2: Run test to verify it passes**
Run: `node tests/test-contact-elevation.js`

- [ ] **Step 3: Commit**
```bash
git add components/contact/TicketDispatcherCard.tsx
git commit -m "feat(contact): elevate ticket dispatcher card with 5 domain pills and clipboard copy"
```

---

### Task 3: Interactive FAQ Accordion & Physical Ateliers Directory (`components/contact/AteliersDirectory.tsx`)

**Files:**
- Modify: `components/contact/AteliersDirectory.tsx`
- Modify: `app/contact/page.tsx`

**Interfaces:**
- Consumes: Atelier flagship locations and FAQ data.
- Produces: 4-question interactive FAQ accordion (Bespoke Alterations, International Delivery & Tax, Private Styling Appointments, Returns & Exchanges) + Flagship Atelier Cards (Paris, Milan, London, Berlin, Tokyo) with verified phone links and Google Maps query links.

- [ ] **Step 1: Add FAQ Accordion and refine `AteliersDirectory.tsx`**
- Interactive accordion items with smooth expansion.
- Flagship locations with direct phone links (`tel:+33142685500`, `tel:+390288421190`, etc.) and map queries.
- Plain UK English copywriting.

- [ ] **Step 2: Unify background in `app/contact/page.tsx`**
Ensure main container uses:
```tsx
<div className="min-h-screen bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] text-[#F8FAFF] pb-24 pt-8">
```

- [ ] **Step 3: Commit**
```bash
git add components/contact/AteliersDirectory.tsx app/contact/page.tsx
git commit -m "feat(contact): add interactive faq accordion and flagship atelier maps links"
```

---

### Task 4: SQA Verification & Production Build

**Files:**
- Modify/Verify: `tests/test-contact-elevation.js`

**Interfaces:**
- Consumes: Next.js build pipeline and test runner.
- Produces: 100% clean production build and visual evidence across Desktop (`1440x900`) and Mobile (`375x812`).

- [ ] **Step 1: Run automated tests**
Run: `node tests/test-contact-elevation.js`
Expected: `All contact elevation tests passed.`

- [ ] **Step 2: Run production build**
Run: `npm run build`
Expected: 100% clean build.

- [ ] **Step 3: Visual verification in browser**
Test in Chrome DevTools MCP across Desktop and Mobile, and capture screenshots.

- [ ] **Step 4: Commit**
```bash
git add tests/
git commit -m "test(contact): verify full contact elevation and build integrity"
```

---

## Verification Plan

### Automated Tests
- Run contact elevation test suite: `node tests/test-contact-elevation.js`
- Run Next.js production build: `npm run build`

### Manual & Visual SQA Verification
- Verify Desktop (`1440x900`) and Mobile (`375x812`) in Chrome DevTools MCP.
- Click "1-Click Demo Inquiry" and submit ticket. Assert ticket reference token appears with working copy button.
- Click WhatsApp channel and verify proper link structure.
- Expand FAQ accordions and assert smooth opening.
- Capture verified screenshots and embed in walkthrough.
