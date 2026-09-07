# Sign In Page — Modernization & 4 Motion Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign, rebuild, and modernize `pages/signin.html` and its supporting animation and auth logic to eliminate outdated animation tracks, remove hard/bold borders and text clutter, and fully integrate all 4 Motion Standards (Micro-interactions with 120fps progress timer & look switcher sync, 3D hover physics with specular glare, GPU cross-dissolve page transitions, and differential scroll parallax) while ensuring perfect responsive design on all viewports and zero feature regressions.

**Architecture:**
- `pages/signin.html`: A split editorial canvas. The left panel showcases a luxury Curated Look Switcher with a 120fps GPU progress track, lifestyle photography, seasonal capsule storytelling, and a floating 3D shoppable look capsule with tactile quick-add ripple. The right panel provides a minimalist luxury authentication interface featuring one-click demo login, password visibility peek, social SSO options, and refined focus states without hard borders.
- `js/animations.js`: Integration of `initSignInPageMotion()` and `initSignInCardMotion()` into the centralized motion orchestrator for spring LERP 3D tilt (`±6.5°`), dynamic cursor-following specular glare, GPU cross-dissolve curtain (`#pageTransitionOverlay`), and differential depth layers.
- `js/auth.js`: Seamless integration with `NexAuth` session management, demo account filler, redirect handling, and interactive validation with zero regressions.

**Tech Stack:** Vanilla HTML5/CSS3 · Native WAAPI / Motion.dev · Lucide Icons · Cormorant Garamond, Inter, Outfit & Work Sans Typography · Lenis Smooth Scroll.

---

## Global Constraints

- **Luxury Neutral Palette**: Obsidian surfaces `rgba(8, 14, 30, 0.96)` and `#020B18`, cyan accent `#3DE0FF`, pink accent `#FB7185`, gold/emerald highlights, zero saturated/neon borders.
- **Typography Hierarchy**: Display/Headlines = `Cormorant Garamond` (refined serif, luxury editorial confidence), body & labels = `Inter` / `Work Sans` / `Outfit`.
- **Zero Text Clutter**: Concise, high-end editorial copy; no repetitive AI jargon or spec dump.
- **No Hard/Bold Borders**: Use subtle 1px translucent borders (`rgba(255, 255, 255, 0.06)` to `rgba(255, 255, 255, 0.1)`) with soft ambient shadows (`box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.6)`).
- **All 4 Motion Standards**:
  1. *Micro-interactions*: 120fps GPU progress bar (`transform: scaleX(progress)` with `transform-origin: left center`), Curated Look Switcher 6.5s auto-sync with pause toggle, tactile `+ BAG` ripple, demo 1-click fill ripple, password peek toggle, and error shake.
  2. *3D Hover Effects*: Multi-layer realistic shadows, spring LERP mouse tilt physics (`±6.5°`), and dynamic cursor-following specular glare (`--gx`, `--gy`).
  3. *Page Transitions*: Hardware-accelerated GPU cross-dissolve curtain (`#pageTransitionOverlay`) on all navigation and auth redirect links.
  4. *Scroll & Viewport Parallax*: Differential depth layers (`data-parallax-depth="0.75"`, `1.2`, `1.5`) and subtle Ken Burns image glide.
- **Touch & Accessibility**: Min 44×44px touch targets on buttons and toggles; respect `prefers-reduced-motion: reduce`.
- **Zero Feature Regressions**: Preserve `NexAuth.signIn()`, demo user credentials (`demo@nexcommerce.ai` / `password123`), error banner feedback, and redirect query parameter (`?next=...`).

---

## Visual & Interaction Blueprint

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ LUXURY EDITORIAL PRELOADER (#pagePreloader) — Eased Brand Arrival                          │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────┬─────────────────────────────────────────────┐
│ LEFT PANEL: CURATED LOOK SHOWCASE             │ RIGHT PANEL: MINIMAL LUXURY AUTH PORTAL     │
│                                               │                                             │
│ ════════════════════████████░░░░░░░░░░░░░░░░  │  [nexCommerce Brand Logo]                   │
│ ← 120fps GPU scaleX Progress Track            │                                             │
│                                               │  Welcome to the Atelier                     │
│ [● ATELIER CAPSULE · 01/04] [⏸]               │  Sign in to access your private orders      │
│ [01 TAILORING] [02 ACOUSTICS] [03 LEATHER]    │  and AI style intelligence.                 │
│                                               │                                             │
│ ┌───────────────────────────────────────────┐ │  ┌───────────────────────────────────────┐  │
│ │ LIFESTYLE PHOTOGRAPHY CANVAS              │ │  │ ✦ QUICK DEMO CLIENT (1-Click Sign In) │  │
│ │ (Subtle Ken Burns Zoom & Depth Layer)     │ │  └───────────────────────────────────────┘  │
│ │                                           │ │                                             │
│ │ "Elegance is not about being noticed,     │ │  [ Continue with Google ] [ With Apple ]    │
│ │  it is about being remembered."           │ │                                             │
│ │  — Atelier Editorial Archive              │ │  ────── OR SIGN IN WITH CREDENTIALS ──────  │
│ │                                           │ │                                             │
│ │  ┌──────────────────────────────────────┐ │ │  EMAIL ADDRESS                              │
│ │  │ 3D SHOPPABLE LOOK CAPSULE (±6.5° Tilt│ │ │  [ you@example.com                        ] │
│ │  │ Specular Glare ▓                      │ │ │                                             │
│ │  │ [Thumb] Double-Faced Wool Blazer     │ │ │  PASSWORD                      [Forgot?]    │
│ │  │ BDT 24,500             [+ BAG RIPPLE]│ │ │  [ ••••••••••••••••                 👁 ] │
│ │  └──────────────────────────────────────┘ │ │                                             │
│ └───────────────────────────────────────────┘ │  [✓] Keep me signed in on this device       │
│                                               │                                             │
│                                               │  ┌───────────────────────────────────────┐  │
│                                               │  │ [ SIGN IN TO ATELIER ] (Spring Press) │  │
│                                               │  └───────────────────────────────────────┘  │
│                                               │                                             │
│                                               │  New to nexCommerce? [Create an account →]  │
│                                               │                                             │
│                                               │  🔒 Encrypted 256-bit TLS · Atelier Privacy │
└───────────────────────────────────────────────┴─────────────────────────────────────────────┘
```

---

## File Structure & Responsibilities

| File | Responsibility |
|------|----------------|
| `pages/signin.html` | Redesign complete DOM markup and CSS. Implement the Curated Look Switcher & 120fps Animation Track on the left panel, floating 3D shoppable look capsule with tactile quick-add ripple, minimal luxury right form panel with 1-click Demo Pill, password peek toggle, social SSO pills, `#pageTransitionOverlay`, and responsive breakpoints. |
| `js/animations.js` | Add `initSignInPageMotion()` and `initSignInCardMotion()` to handle the 3D spring LERP tilt (`±6.5°`), dynamic cursor-following specular glare, GPU cross-dissolve page transitions, and differential depth motion on sign-in elements. |
| `js/auth.js` | Ensure full compatibility with session management, demo account pre-fill, login redirect handling, and validation error callbacks. |

---

## Tasks

### Task 1: Rebuild `pages/signin.html` Structure & Luxury Styles

**Files:**
- Modify: `pages/signin.html`

- [ ] **Step 1: Write modern document head, meta tags, and tokens**
  - Add `<meta name="view-transition" content="same-origin">`.
  - Ensure fonts include `Cormorant Garamond`, `Inter`, `Outfit`, `Work Sans` and link `../css/design-system.css?v=35`.
  - Add `#pageTransitionOverlay` curtain for GPU cross-dissolve page transitions.
  - Include `#pagePreloader` with brand status whisper.

- [ ] **Step 2: Construct Split Editorial Canvas Markup**
  - Left Panel (`.auth-showcase-panel`):
    - 120fps progress track (`.spotlight-progress-track > .spotlight-progress-bar`).
    - Look Switcher header with live pulsating dot, counter, pause/play toggle button, and capsule tabs (`01 TAILORED AW26`, `02 HIGH ACOUSTICS`, `03 ARTISANAL LEATHER`, `04 SILK EVENING`).
    - Lifestyle imagery canvas with dynamic image container, editorial quote, and collection whisper.
    - Floating 3D Shoppable Look Capsule (`.auth-shoppable-capsule`) with studio thumbnail avatar, product title, price tag, and `+ BAG` tactile ripple button.
  - Right Panel (`.auth-form-panel`):
    - Brand logo link with GPU page transition handling.
    - Confident editorial greeting (`.auth-heading`, `.auth-subheading`).
    - Demo Account Quick Fill pill (`#quickDemoBtn`) for instant 1-click credential population.
    - Social SSO quick actions (Google, Apple).
    - Elegant divider ("OR WITH CREDENTIALS").
    - Clean form fields with luxury inputs (no hard borders): Email, Password with password peek toggle (`#passwordToggleBtn`), Forgot Password link, Remember Me checkbox.
    - Dynamic `#authError` container with error shake support.
    - Primary Submit Button (`#signInBtn`) with spinner and label.
    - Link to `signup.html` and security footnote.

- [ ] **Step 3: Implement Modern Luxury CSS Styles**
  - Remove all hard borders and outdated CSS.
  - Apply sleek obsidian glass styling (`rgba(8, 14, 30, 0.94)` background, subtle 1px border `rgba(255, 255, 255, 0.07)`).
  - Implement 120fps progress bar styles using `transform: scaleX(0)` with `transform-origin: left center` and `will-change: transform`.
  - Add 3D card tilt, specular glare (`--gx`, `--gy`), and button ripple animations.
  - Add full responsive media queries for Desktop (`≥1025px`), Scaled Laptop (`1080p @ 125%-150%`), Tablet (`769px-1024px`), and Mobile (`≤768px`).

---

### Task 2: Implement Look Switcher Engine & Auth Controller in `pages/signin.html`

**Files:**
- Modify: `pages/signin.html`

- [ ] **Step 1: Define Curated Look Switcher Data & State**
  - Implement dataset with 4 curated looks:
    1. *Tailored Knitwear & Outerwear* (`Double-Faced Wool Blazer`, `BDT 24,500`, `../assets/images/lifestyle/auth_lifestyle.jpg`, `../assets/images/products/suit1.jpg`).
    2. *High Acoustics & Audio* (`Acoustic Over-Ear Master`, `BDT 38,900`, `../assets/images/lifestyle/hero_lifestyle.jpg`, `../assets/images/products/headphone1.jpg`).
    3. *Artisanal Leathercraft* (`Structured Leather Weekender`, `BDT 42,000`, `../assets/images/lifestyle/shoe_lifestyle.jpg`, `../assets/images/products/bag1.jpg`).
    4. *Silk & Evening Silhouette* (`Minimal Silk Slip Dress`, `BDT 18,700`, `../assets/images/lifestyle/watch_lifestyle.jpg`, `../assets/images/products/dress1.jpg`).

- [ ] **Step 2: Implement 120fps GPU Progress Timer & Look Switcher Controller**
  - Create `startLookTimer()`, `tickLookTimer()`, `updateProgressBar(progress)`, `setCuratedLook(index, userInitiated)`, and pause/resume handlers.
  - Ensure progress bar uses `requestAnimationFrame` and GPU `transform: scaleX(progress)` with `transform-origin: left center`.
  - Wire capsule tab buttons, pause toggle button, and smooth fade transitions on image and caption elements.

- [ ] **Step 3: Wire Quick-Add to Bag Ripple on Shoppable Look Capsule**
  - Connect the `+ BAG` button on the floating 3D capsule to add the active look's product to `window.nexCart` / `localStorage` cart state.
  - Provide instant tactile ripple micro-animation and state morph (`+ BAG` → `✓ ADDED TO BAG`).

- [ ] **Step 4: Wire 1-Click Demo Client Quick Fill & Password Peek Toggle**
  - Wire `#quickDemoBtn` to populate email `demo@nexcommerce.ai` and password `password123`, trigger a cyan highlight pulse on the input fields, and clear any existing error state.
  - Wire `#passwordToggleBtn` to toggle password input between `password` and `text` type and flip the Lucide eye icon.

- [ ] **Step 5: Wire Form Submission, Validation, Shake Animation, and Redirect**
  - On submit, validate inputs. If invalid, trigger smooth shake animation and display error message in `#authError`.
  - Call `NexAuth.signIn({ email, password })`. On success, trigger GPU curtain cross-dissolve exit transition and redirect to `next` URL or `../index.html`.

---

### Task 3: Integrate 4 Motion Standards in `js/animations.js`

**Files:**
- Modify: `js/animations.js`

- [ ] **Step 1: Create `initSignInPageMotion()` and `initSignInCardMotion()`**
  - `initSignInPageMotion()`: Handles differential depth parallax on `.auth-showcase-panel` and staggered entry cascade for form elements.
  - `initSignInCardMotion()`: Binds spring LERP mouse tilt physics (`MAX_TILT = 6.5`), cursor-tracking specular glare (`--gx`, `--gy`), and GPU page transitions via `#pageTransitionOverlay` on links and cards.

- [ ] **Step 2: Register in `initAllMotion()` and Export Globally**
  - Add `initSignInPageMotion()` to `initAllMotion()`.
  - Expose `window.initSignInPageMotion` and `window.initSignInCardMotion`.

---

### Task 4: Responsive Verification & QA Across Viewports

**Files:**
- Test: Open `http://localhost:8843/pages/signin.html` in browser using DevTools / subagent.

- [ ] **Step 1: Test Desktop Viewport (1440px / 1280px)**
  - Verify 2-column split editorial layout.
  - Verify Look Switcher auto-advances smoothly with 120fps GPU progress bar.
  - Verify 3D mouse tilt and specular glare on the floating shoppable look capsule and auth container.
  - Verify 1-click Demo Fill populates credentials and clears error.
  - Verify password peek toggle works seamlessly.
  - Verify sign-in authentication succeeds and triggers GPU cross-dissolve redirect.

- [ ] **Step 2: Test Scaled Laptop Viewport (1080p @ 125%–150%, 600px height)**
  - Verify zero-scroll visibility for primary headline, input fields, and Sign In CTA above the fold.

- [ ] **Step 3: Test Tablet Viewport (768px–1024px)**
  - Verify balanced 2-column split canvas and 44px touch targets.

- [ ] **Step 4: Test Mobile Viewport (375px–480px)**
  - Verify single-column stacked layout: top look showcase with after-model shoppable look capsule, followed by the minimal luxury auth card.
  - Verify zero horizontal overflow, no clipped badges, and smooth touch interactions.

---
