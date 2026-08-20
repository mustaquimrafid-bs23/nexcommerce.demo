# Sign Up Page — Modernization & 4 Motion Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign, rebuild, and modernize `pages/signup.html` and its supporting motion/auth integration to eliminate outdated animation effects and text clutter, implement an attractive, modern, minimal luxury aesthetic without hard/bold borders, and fully integrate all 4 Motion Standards (Micro-interactions, 3D Hover physics with specular glare, GPU cross-dissolve route transitions, and scroll/viewport parallax) while ensuring perfect responsive behavior on all viewports and zero feature regressions.

**Architecture:**
- `pages/signup.html`: A split editorial canvas. The left panel showcases serene full-bleed luxury lifestyle photography with subtle Ken Burns ambient glide (`authKenBurns`), natural lighting, and an editorial Atelier membership quote. The right panel provides a minimal luxury registration interface featuring a 1-click Demo Member quick-fill pill, social SSO options, delicate translucent input focus states, interactive password visibility peek toggles, real-time animated password strength gauge, form error shake feedback, and a seamless cross-dissolve transition to the post-signup Atelier Welcome panel.
- `js/animations.js`: Integration of `initSignUpPageMotion()` and `initSignUpCardMotion()` into the centralized motion orchestrator for staggered form entry cascade, spring LERP 3D mouse tilt physics (`±6.5°`), dynamic cursor-following specular glare (`--gx`, `--gy`), GPU cross-dissolve transition curtain (`#pageTransitionOverlay`), and differential depth layers.
- `js/auth.js`: Seamless integration with `NexAuth.signUp()` session management, demo credential filler, client-side validation, error handling, and redirection with zero regressions.

**Tech Stack:** Vanilla HTML5/CSS3 · Native WAAPI / Motion.dev · Lucide Icons · Cormorant Garamond, Inter, Outfit & Work Sans Typography · Lenis Smooth Scroll.

---

## Global Constraints

- **Luxury Neutral Palette**: Obsidian surfaces `rgba(8, 14, 30, 0.94)` and `#020B18`, cyan accent `#3DE0FF`, pink accent `#FB7185`, emerald highlights, zero saturated/neon borders.
- **Typography Hierarchy**: Display/Headlines = `Cormorant Garamond` (refined serif, luxury editorial confidence), body & labels = `Inter` / `Work Sans` / `Outfit`.
- **Zero Text Clutter**: Concise, high-end editorial copy; remove verbose/repetitive spec lists and AI buzzword dumps.
- **No Hard/Bold Borders**: Use subtle 1px translucent borders (`rgba(255, 255, 255, 0.06)` to `rgba(255, 255, 255, 0.1)`) with soft ambient shadows (`box-shadow: 0 20px 48px -12px rgba(0, 0, 0, 0.6)`).
- **All 4 Motion Standards**:
  1. *Micro-interactions*: Real-time animated password strength meter (5-level smooth width & color morph), dual password peek toggles (`#passwordToggleBtn`, `#confirmToggleBtn`), 1-click Demo Client quick fill with cyan pulse feedback, form submit spring press with loading spinner, validation error shake micro-interaction, and post-signup success view entrance with spring-popping checkmark icon.
  2. *3D Hover Effects*: Multi-layer realistic ambient shadows, spring LERP mouse tilt physics (`±6.5°`), and dynamic cursor-following specular glare (`--gx`, `--gy`).
  3. *Page Transitions*: Hardware-accelerated GPU cross-dissolve curtain (`#pageTransitionOverlay`) on all navigation links, auth switches, and success view CTAs.
  4. *Scroll & Viewport Parallax*: Differential column depth layers and subtle Ken Burns image glide (`scale(1)` → `scale(1.05)` with `translateY(-14px)`).
- **Touch & Accessibility**: Minimum 44×44px touch targets on buttons and toggles; respect `prefers-reduced-motion: reduce`.
- **Zero Feature Regressions**: Preserve `NexAuth.signUp()`, form input names/IDs (`fullName`, `email`, `password`, `confirmPassword`), error banner feedback (`#authError`), and success view flow.

---

## Visual & Interaction Blueprint

```
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ LUXURY EDITORIAL BRAND PRELOADER (#pagePreloader) — Eased Brand Arrival                     │
└─────────────────────────────────────────────────────────────────────────────────────────────┘

┌───────────────────────────────────────────────┬─────────────────────────────────────────────┐
│ LEFT PANEL: SERENE LIFESTYLE SHOWCASE         │ RIGHT PANEL: MINIMAL LUXURY REGISTRATION    │
│                                               │                                             │
│ ┌───────────────────────────────────────────┐ │  [nexCommerce Brand Logo]                   │
│ │ LIFESTYLE PHOTOGRAPHY CANVAS              │ │                                             │
│ │ (Subtle Ken Burns Zoom & Scrim Depth)     │ │  Create your account.                       │
│ │                                           │ │  Join the Atelier for bespoke style curation│
│ │                                           │ │  and private member privileges.             │
│ │                                           │ │                                             │
│ │                                           │ │  ┌───────────────────────────────────────┐  │
│ │                                           │ │  │ ✦ QUICK DEMO CLIENT (1-Click Fill)    │  │
│ │                                           │ │  └───────────────────────────────────────┘  │
│ │                                           │ │                                             │
│ │                                           │ │  [ Continue with Google ] [ With Apple ]    │
│ │                                           │ │                                             │
│ │                                           │ │  ────── OR REGISTER WITH CREDENTIALS ─────  │
│ │                                           │ │                                             │
│ │                                           │ │  FULL NAME                                  │
│ │                                           │ │  [ Eleanor Vance                          ] │
│ │                                           │ │                                             │
│ │                                           │ │  EMAIL ADDRESS                              │
│ │ "Dress for the life                       │ │  [ eleanor.vance@atelier.nexcommerce.ai   ] │
│ │  you're building."                        │ │                                             │
│ │                                           │ │  PASSWORD                                   │
│ │ — Atelier Membership Archive              │ │  [ ••••••••••••••••                     👁 ] │
│ │                                           │ │  ════════████████████░░░░░ (Strong)         │
│ │                                           │ │                                             │
│ │                                           │ │  CONFIRM PASSWORD                           │
│ │                                           │ │  [ ••••••••••••••••                     👁 ] │
│ │                                           │ │                                             │
│ │                                           │ │  ┌───────────────────────────────────────┐  │
│ │                                           │ │  │ [ CREATE ATELIER ACCOUNT ] (Spring)   │  │
│ │                                           │ │  └───────────────────────────────────────┘  │
│ │                                           │ │                                             │
│ │                                           │ │  Already a member? [Sign in →]              │
│ │                                           │ │                                             │
│ │                                           │ │  🔒 Encrypted 256-bit TLS · Atelier Privacy │
│ └───────────────────────────────────────────┘ └─────────────────────────────────────────────┘
```

---

## File Structure & Responsibilities

| File | Responsibility |
|------|----------------|
| `pages/signup.html` | Redesign complete DOM markup and CSS. Implement the split editorial layout, serene lifestyle canvas with Ken Burns ambient glide, right minimal luxury registration form with 1-click Demo Fill pill, dual password peek toggles, animated password strength gauge, social SSO pills, error shake container, `#pageTransitionOverlay`, `#pagePreloader`, `#successView` panel, and responsive breakpoints. |
| `js/animations.js` | Add `initSignUpPageMotion()` and `initSignUpCardMotion()` to handle staggered form entrance cascade, 3D spring LERP mouse tilt physics (`±6.5°`), dynamic cursor-following specular glare, GPU cross-dissolve page transitions, and differential depth motion on sign-up elements. Register in `initAllMotion()`. |
| `js/auth.js` | Verify compatibility with `NexAuth.signUp()`, session creation, validation error callbacks, and user registration. |

---

## Tasks

### Task 1: Rebuild `pages/signup.html` Structure & Luxury Styles

**Files:**
- Modify: `pages/signup.html`

**Interfaces:**
- Consumes: `../css/design-system.css?v=35`, Google Fonts (`Cormorant Garamond`, `Inter`, `Outfit`, `Work Sans`), Lucide Icons CDN.
- Produces: Modernized semantic markup, `#pagePreloader`, `#pageTransitionOverlay`, `.auth-showcase-panel`, `.auth-form-panel`, `#formView`, `#successView`, and responsive luxury CSS rules.

- [ ] **Step 1: Write modern document head, meta tags, and tokens**
  - Add `<meta name="view-transition" content="same-origin">`.
  - Include Google Fonts: `Outfit`, `Work Sans`, `Cormorant Garamond`, `Inter`.
  - Link `../css/design-system.css?v=35`.
  - Load Lucide Icons CDN `<script src="https://unpkg.com/lucide@latest"></script>`.
  - Add `#pageTransitionOverlay` curtain for GPU cross-dissolve page transitions.
  - Include `#pagePreloader` with brand status whisper.

- [ ] **Step 2: Construct Split Editorial Canvas DOM Structure**
  - Left Panel (`.auth-showcase-panel`):
    - Full-bleed image wrapper with `.showcase-bg-wrap > img.showcase-bg-img` (`../assets/images/lifestyle/auth_lifestyle.jpg`) and `.showcase-gradient-overlay`.
    - Serene editorial quote & Atelier whisper (`"Dress for the life you're building."` — Atelier Membership Archive).
  - Right Panel (`.auth-form-panel`):
    - Brand logo link with GPU cross-dissolve transition handling.
    - `#formView`:
      - Editorial heading (`.auth-heading`, e.g. "Create your account.") and subheading (`.auth-subheading`, e.g. "Join the Atelier for bespoke AI style curation and private benefits.").
      - 1-Click Demo Client Quick Fill pill (`#quickDemoBtn`).
      - Social SSO quick actions (Google, Apple).
      - Delicate divider (`────── or register with credentials ──────`).
      - Form fields:
        - Full Name (`#fullName`)
        - Email Address (`#email`)
        - Password (`#password`) with Password Peek toggle (`#passwordToggleBtn`), animated strength bar (`#pwStrengthFill`), and strength hint (`#pwStrengthLabel`).
        - Confirm Password (`#confirmPassword`) with Password Peek toggle (`#confirmToggleBtn`).
      - Dynamic error banner (`#authError` with icon and message span).
      - Primary submit button (`#signUpBtn`) with loading spinner and label.
      - Terms footnote and sign-in switch link (`Already have an account? Sign in →`).
      - Security guarantee (`🔒 Encrypted 256-bit TLS · Atelier Privacy Guarantee`).
    - `#successView` (hidden initially):
      - Success icon with checkmark.
      - Editorial welcome heading ("Welcome to the Atelier.").
      - Subtitle ("Your private account is active. Complete your AI Style Profile to unlock personalised discovery.").
      - Action buttons: "Set Up AI Style Profile" (`profile.html`) and "Browse the Collection" (`../index.html`).
  - Mini-cart drawer integration (`#nexMiniCartOverlay`, `#nexMiniCartDrawer`).

- [ ] **Step 3: Implement Modern Luxury CSS Styles**
  - Clean out outdated hard borders, bulky benefit blocks, and unstyled form elements.
  - Apply sleek obsidian styling (`rgba(8, 14, 30, 0.94)` background, subtle 1px border `rgba(255, 255, 255, 0.08)`).
  - Add delicate focus states (`border-color: rgba(61, 224, 255, 0.5)` with `box-shadow: 0 0 16px rgba(61, 224, 255, 0.15)`).
  - Implement dynamic password strength fill transition (`transition: width 300ms cubic-bezier(0.16, 1, 0.3, 1), background-color 300ms ease`).
  - Add compact viewport styling for scaled laptops (1080p @ 125%-150%, 550px-650px height).
  - Add responsive media queries for Desktop (`≥1081px`), Tablet (`881px-1080px`), Compact Tablet (`481px-880px`), and Mobile (`≤480px`).

---

### Task 2: Implement Micro-Interactions, Form Validation & Auth Controller

**Files:**
- Modify: `pages/signup.html`

**Interfaces:**
- Consumes: `NexAuth.signUp()`, `window.lucide`, `window.animate`, `window.stagger`.
- Produces: Interactive 1-click Demo Fill, dual password peeks, dynamic password strength meter, validation checks, form error shake, success view cross-dissolve, and GPU page transitions.

- [ ] **Step 1: Implement 1-Click Demo Client Quick Fill**
  - Add click and keydown (Enter/Space) handler on `#quickDemoBtn`.
  - Populate `#fullName` with `"Eleanor Vance"`, `#email` with `"eleanor.vance@atelier.nexcommerce.ai"`, `#password` with `"Atelier2026!"`, and `#confirmPassword` with `"Atelier2026!"`.
  - Trigger cyan pulse feedback on input borders and evaluate password strength automatically.
  - Clear any active error banner.

- [ ] **Step 2: Implement Dual Password Peek Visibility Toggles**
  - Wire `#passwordToggleBtn` to toggle `#password` between `password` and `text` type and flip icon between `eye` and `eye-off`.
  - Wire `#confirmToggleBtn` to toggle `#confirmPassword` between `password` and `text` type and flip icon.
  - Re-hydrate Lucide icons on toggle.

- [ ] **Step 3: Implement Dynamic Password Strength Evaluator**
  - Listen to `input` event on `#password`.
  - Score based on length (>=8, >=12), uppercase, numbers, and special characters.
  - Update `#pwStrengthFill` width (`0%` to `100%`) and background color (`#EF4444` → `#F59E0B` → `#10B981` → `#3DE0FF`).
  - Update `#pwStrengthLabel` text ("At least 8 characters", "Fair", "Good", "Strong", "Atelier Grade").

- [ ] **Step 4: Implement Social SSO Mock Actions**
  - Wire `#googleSsoBtn` and `#appleSsoBtn` to populate mock user data and trigger quick fill.

- [ ] **Step 5: Implement Form Validation, Error Shake & NexAuth Submission**
  - Validate required fields, email format regex, password minimum length (>=8), and password confirmation match.
  - If validation fails, display message in `#authError`, highlight erroneous inputs with `.error`, and trigger smooth horizontal shake micro-interaction on `.auth-form-container`.
  - If valid, set button loading state (`#signUpBtn.loading`), invoke `NexAuth.signUp({ name, email, password })`.
  - On success, fade out `#formView` and transition in `#successView` with staggered entrance animation for icon, heading, text, and action buttons.

- [ ] **Step 6: Implement GPU Cross-Dissolve Route Transitions**
  - Add click interceptor on outbound `<a>` links and success action buttons to trigger `#pageTransitionOverlay` curtain fade before navigation.

---

### Task 3: Integrate 4 Motion Standards in `js/animations.js`

**Files:**
- Modify: `js/animations.js`

**Interfaces:**
- Consumes: `window.animate`, `window.stagger`, `window.spring`.
- Produces: `initSignUpPageMotion()`, `initSignUpCardMotion()`, exported on `window` and registered in `initAllMotion()`.

- [ ] **Step 1: Implement `initSignUpPageMotion()`**
  - Detect `.auth-form-panel` and `.auth-showcase-panel` on `signup.html`.
  - Trigger staggered form entry cascade:
    ```javascript
    const formItems = [
      '.auth-brand-logo',
      '.auth-heading',
      '.auth-subheading',
      '.auth-demo-pill',
      '.auth-social-row',
      '.auth-divider',
      '.auth-form .form-group',
      '#signUpBtn',
      '.auth-terms',
      '.auth-footer-zone'
    ];
    ```
  - Animate elements from `opacity: 0, y: 16px` to `opacity: 1, y: 0px` with `stagger(0.05)`.

- [ ] **Step 2: Implement `initSignUpCardMotion()`**
  - Apply spring LERP mouse tilt physics (`±6.5°`) and dynamic cursor-tracking specular glare (`--gx`, `--gy`) to `.auth-demo-pill` and interactive card elements on desktop viewports.
  - Respect `prefers-reduced-motion: reduce` and mobile touch detection.

- [ ] **Step 3: Register in `initAllMotion()` and Export Globally**
  - Call `initSignUpPageMotion()` inside `initAllMotion()`.
  - Expose `window.initSignUpPageMotion = initSignUpPageMotion;` and `window.initSignUpCardMotion = initSignUpCardMotion;`.

---

### Task 4: Responsive Verification & QA Across Viewports

**Files:**
- Test: Open `http://localhost:8843/pages/signup.html` via browser tools / subagent.

- [ ] **Step 1: Test Desktop Viewport (1440px / 1280px)**
  - Verify 2-column split editorial layout.
  - Verify Ken Burns ambient image glide and editorial quote.
  - Verify 1-click Demo Fill populates credentials and updates password strength meter to "Atelier Grade".
  - Verify dual password peek toggles work cleanly.
  - Verify form validation shake and error banner when submitting invalid inputs.
  - Verify successful account creation transitions smoothly to `#successView`.

- [ ] **Step 2: Test Scaled Laptop Viewport (1080p @ 125%–150%, 600px height)**
  - Verify zero-scroll visibility for primary headline, input fields, and submit button above the fold.
  - Verify compact spacing and no layout overlap.

- [ ] **Step 3: Test Tablet Viewport (768px–1024px)**
  - Verify responsive split layout with 44px min touch targets.

- [ ] **Step 4: Test Mobile Viewport (375px–480px)**
  - Verify single-column stacked layout: top serene visual banner with quote, followed by the minimal luxury registration card.
  - Verify zero horizontal overflow, no clipped borders/badges, and smooth touch interactions.
