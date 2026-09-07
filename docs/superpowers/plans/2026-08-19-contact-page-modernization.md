# Contact Page — Modernization & 4 Motion Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign, rebuild, and modernize `pages/contact.html` and its supporting animation and interaction logic to eliminate outdated animation tracks, remove hard/bold borders and text clutter, and fully integrate all 4 Motion Standards (Micro-interactions with 120fps progress timer & look switcher sync, 3D hover physics with specular glare, GPU cross-dissolve page transitions, and differential scroll parallax) while ensuring perfect responsive design across all viewports and zero feature regressions.

**Architecture:**
- `pages/contact.html`: A contemporary luxury client services canvas. Features an ultra-clean hero with live concierge whisper, 3 dedicated service channel cards with 3D hover physics and live SLA indicators, a Curated Look Switcher showcasing private atelier bespoke commissions with a 120fps GPU progress track and floating 3D shoppable look capsule with tactile quick-add ripple, an interactive Direct Dispatch Portal with domain selection pills and 1-click demo filler, and physical atelier directory cards.
- `js/animations.js`: Integration of `initContactPageMotion()` and `initContactCardsMotion()` into the centralized motion orchestrator for spring LERP 3D tilt (`±6.5°`), dynamic cursor-following specular glare, GPU cross-dissolve curtain (`#pageTransitionOverlay`), and differential depth layers.
- Centralized UI systems: Seamless integration with `window.nexCart`, `NexAuth`, Mini Cart side drawer, and AI Search Modal (`Ctrl+K`).

**Tech Stack:** Vanilla HTML5/CSS3 · Native WAAPI / Motion.dev · Lucide Icons · Cormorant Garamond, Inter, Outfit & Work Sans Typography · Lenis Smooth Scroll.

---

## Global Constraints

- **Luxury Neutral Palette**: Obsidian surfaces `rgba(8, 14, 30, 0.94)` and `#020B18`, cyan accent `#3DE0FF`, pink accent `#FB7185`, emerald SLA indicator `#00E096`, zero saturated/neon borders.
- **Typography Hierarchy**: Display/Headlines = `Cormorant Garamond` (refined serif, luxury editorial confidence), body & labels = `Inter` / `Work Sans` / `Outfit`.
- **Zero Text Clutter**: Concise, high-end editorial copy; no repetitive AI jargon or paragraph dumps.
- **No Hard/Bold Borders**: Use subtle 1px translucent borders (`rgba(255, 255, 255, 0.06)` to `rgba(255, 255, 255, 0.1)`) with soft ambient shadows (`box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.6)`).
- **All 4 Motion Standards**:
  1. *Micro-interactions*: 120fps GPU progress bar (`transform: scaleX(progress)` with `transform-origin: left center`), Curated Look Switcher 6.5s auto-sync with pause toggle, tactile `+ BAG` quick-add ripple, 1-click Demo Client Inquiry quick-fill ripple, domain quick-selector pills, and instant ticket dispatch generation.
  2. *3D Hover Effects*: Multi-layer realistic shadows, spring LERP mouse tilt physics (`±6.5°`), and dynamic cursor-following specular glare (`--contact-glare-x`, `--contact-glare-y`).
  3. *Page Transitions*: Hardware-accelerated GPU cross-dissolve curtain (`#pageTransitionOverlay`) on all navigation and channel redirect links.
  4. *Scroll & Viewport Parallax*: Differential depth layers (`data-parallax-depth="0.04"`, `0.08`, `0.12`) and subtle Ken Burns image glide.
- **Touch & Accessibility**: Min 44×44px touch targets on buttons and toggles; respect `prefers-reduced-motion: reduce`.
- **Zero Feature Regressions**: Preserve ticket dispatch generation, form validation, direct concierge routing, mini cart drawer, and search modal.

---

## Visual & Interaction Blueprint

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ LUXURY EDITORIAL PRELOADER (#pagePreloader) — Eased Brand Arrival                          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ GLOBAL LUXURY HEADER (Logo · Categories · New In · Search Pill [Ctrl+K] · Concierge · Bag)  │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ HERO / CLIENT DESK HEADER                                                                   │
│ [● DIRECT ATELIER LINK · 24/7 CONCIERGE]                                                    │
│ Private Concierge & Client Desk                                                             │
│ Direct access to our master tailors, white-glove logistics dispatchers, and digital advisors│
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────┬───────────────────────────────┬─────────────────────────────┐
│ SERVICE CHANNEL 1             │ SERVICE CHANNEL 2             │ SERVICE CHANNEL 3           │
│ [✦ Bespoke Styling] [LIVE 24/7│ [🚚 White-Glove Logistics]    │ [🛡️ Trust & Legal]          │
│ Virtual styling, proportions, │ Residential gate coordination │ Cryptographic provenance,   │
│ made-to-measure tailoring.    │ & courier live tracking.      │ VAT refund, alterations.    │
│ [ LAUNCH STYLING CHAT → ]     │ [ TRACK COURIER LIVE → ]      │ [ INSPECT PROVENANCE → ]    │
│ (3D Tilt ±6.5° · Specular)    │ (3D Tilt ±6.5° · Specular)    │ (3D Tilt ±6.5° · Specular)  │
└───────────────────────────────┴───────────────────────────────┴─────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ CURATED LOOK SWITCHER & 120FPS ANIMATION TRACK (Private Atelier Bespoke Commissions)       │
│                                                                                             │
│ ════════════════════████████░░░░░░░░░░░░░░░░ ← 120fps GPU scaleX Progress Track             │
│                                                                                             │
│ [● ATELIER COMMISSIONS · 01/04] [⏸]  [01 TAILORING] [02 ACOUSTICS] [03 LEATHER] [04 SILK]   │
│                                                                                             │
│ ┌───────────────────────────────────────────┬─────────────────────────────────────────────┐ │
│ │ LEFT: BESPOKE CAPSULE STORY               │ RIGHT: EDITORIAL LIFESTYLE CANVAS           │ │
│ │ ATELIER EDIT · AW26                       │ (Subtle Ken Burns Zoom & Depth Layer)       │ │
│ │ Hand-Finished Double-Faced Cashmere       │                                             │ │
│ │ Crafted from 2-ply Mongolian cashmere     │ ┌─────────────────────────────────────────┐ │ │
│ │ with bespoke dropped shoulder silhouette. │ │ 3D SHOPPABLE LOOK CAPSULE (±6.5° Tilt)  │ │ │
│ │                                           │ │ Specular Glare ▓                        │ │ │
│ │ [ + QUICK ADD · BDT 24,500 ] [Explore →]  │ │ [Thumb] Double-Faced Cashmere Overcoat  │ │ │
│ │ (Tactile Ripple Feedback)                 │ │ BDT 24,500                 [+ BAG RIPPLE│ │ │
│ └───────────────────────────────────────────┴─────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ DIRECT DISPATCH INQUIRY PORTAL                                                              │
│ [✦ QUICK DEMO CLIENT INQUIRY (1-Click Fill)]                                                │
│ Domain Pills: [● Bespoke Styling] [White-Glove Logistics] [Alterations] [Provenance] [VIP] │
│ [ Full Client Name ]  [ Client Email Address ]                                              │
│ [ Inquiry Domain   ]  [ Order Reference (Opt) ]                                             │
│ [ Inquiry Specifications & Details Textarea ]                                               │
│ [🔒 256-Bit Client Encryption]                       [ DISPATCH INQUIRY TO ATELIER → ]      │
│                                                                                             │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ TICKET DISPATCH CONFIRMATION (Emerges smoothly upon dispatch with Ref: TKT-8842-NX)     │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────┬─────────────────────────────────────────────┐
│ FLAGSHIP ATELIER · DHAKA                      │ MASTER FINISHING STUDIO · MILAN             │
│ Level 8, Concord Tower, Gulshan 2, Dhaka      │ Via Montenapoleone 18, 20121 Milano, Italy  │
│ Direct Concierge: +880 1700 889900            │ Studio Desk: +39 02 8842 1190               │
│ [ CALL CONCIERGE ] [ GET DIRECTIONS ]         │ [ CALL STUDIO ] [ GET DIRECTIONS ]          │
└───────────────────────────────────────────────┴─────────────────────────────────────────────┘
```

---

## File Structure & Responsibilities

| File | Responsibility |
|------|----------------|
| `pages/contact.html` | Redesign complete DOM markup and CSS. Implement the Curated Look Switcher & 120fps Animation Track, 3 dedicated service channel cards with 3D tilt, Direct Dispatch Portal with domain selection pills, 1-Click Demo Filler, ticket confirmation box, physical atelier cards, `#pageTransitionOverlay`, `#pagePreloader`, and full responsive styles. |
| `js/animations.js` | Add `initContactPageMotion()` and `initContactCardsMotion()` to handle the 3D spring LERP tilt (`±6.5°`), dynamic cursor-following specular glare, GPU cross-dissolve page transitions, and differential depth motion on contact page elements. |

---

## Tasks

### Task 1: Rebuild `pages/contact.html` Structure, Luxury Layout & Obsidian Glass Styling

**Files:**
- Modify: `pages/contact.html`

**Interfaces:**
- Consumes: `../css/design-system.css?v=35`, `https://unpkg.com/lucide@latest`, `https://cdn.jsdelivr.net/npm/lenis@1.3.26/dist/lenis.min.js`.
- Produces: Complete semantic markup and CSS for hero, service cards, look spotlight, dispatch portal, atelier directory, and footer.

- [x] **Step 1: Write modern document head, meta tags, and tokens**
- [x] **Step 2: Construct Global Luxury Header & Mobile Drawer**
- [x] **Step 3: Build Hero Section & 3 Dedicated Service Channel Cards**
- [x] **Step 4: Build Curated Look Switcher & 120fps Animation Track Section**
- [x] **Step 5: Build Interactive Direct Dispatch Portal & Physical Atelier Cards**
- [x] **Step 6: Implement Modern Luxury CSS Styles & Responsive Breakpoints**

---

### Task 2: Implement Curated Look Switcher Engine & Dispatch Portal Controller in `pages/contact.html`

**Files:**
- Modify: `pages/contact.html`

**Interfaces:**
- Consumes: `window.nexCart` (for quick-add to bag), `window.lucide`.
- Produces: Client-side look switcher state machine, 120fps progress timer, demo quick-fill, domain pill synchronization, and inquiry ticket generator.

- [x] **Step 1: Define Curated Look Switcher Dataset**
- [x] **Step 2: Implement 120fps GPU Progress Timer & Look Switcher Controller**
- [x] **Step 3: Wire Quick-Add to Bag Ripple on Shoppable Look Capsule**
- [x] **Step 4: Wire Fast Domain Selection Pills & 1-Click Demo Client Quick Fill**
- [x] **Step 5: Wire Form Submission, Validation, Ticket Confirmation & GPU Transitions**

---

### Task 3: Integrate Contact Page 4 Motion Standards in `js/animations.js`

**Files:**
- Modify: `js/animations.js`

**Interfaces:**
- Consumes: WAAPI `animate()`, `inView()`, `stagger()`, `Lenis`.
- Produces: `window.initContactPageMotion` and `window.initContactCardsMotion`.

- [x] **Step 1: Create `initContactPageMotion()`**
- [x] **Step 2: Create `initContactCardsMotion()`**
- [x] **Step 3: Register in `initAllMotion()` and Export Globally**

---

### Task 4: Responsive Verification & Multi-Viewport QA

**Files:**
- Test: Open `http://localhost:8843/pages/contact.html` in browser using DevTools.

- [x] **Step 1: Test Desktop Viewport (1440px / 1280px)**
- [x] **Step 2: Test Scaled Laptop Viewport (1080p @ 125%–150%, 600px height)**
- [x] **Step 3: Test Tablet Viewport (768px–1024px)**
- [x] **Step 4: Test Mobile Viewport (375px–480px)**

---
