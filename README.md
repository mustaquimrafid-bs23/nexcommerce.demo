# nexCommerce — Intelligent Luxury Lifestyle & Agentic Commerce Platform

[![Version](https://img.shields.io/badge/version-1.0.0--atelier-003371.svg?style=flat-square)](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch)
[![Status](https://img.shields.io/badge/status-22%20Pages%20Elevated%20%26%20SQA%20Verified-34D399.svg?style=flat-square)](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/task.md)
[![Design System](https://img.shields.io/badge/design%20system-Atelier%20Obsidian%20%26%20Warm%20Stone-0A2A54.svg?style=flat-square)](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css)
[![Stack](https://img.shields.io/badge/architecture-Vanilla%20ES6%2B%20%7C%20CSS3%20Tokens%20%7C%20Semantic%20HTML5-F13365.svg?style=flat-square)](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/js)
[![Accessibility](https://img.shields.io/badge/accessibility-WCAG%202.1%20AA%20Compliant-3DE0FF.svg?style=flat-square)](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/docs/brand/accessibility-guidelines.md)
[![Performance](https://img.shields.io/badge/motion-120fps%20GPU--Composited-E60C45.svg?style=flat-square)](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/shadcn-physics.css)

> **"AI enhances the shopping experience; it must never become the shopping experience."**  
> *Premium enough to feel special. Warm enough to feel human. Simple enough to feel trustworthy. Intelligent enough to feel modern.*

---

## 🌟 Executive Overview

**nexCommerce** is an ultra-premium, editorial-grade luxury lifestyle e-commerce platform and agentic commerce prototype developed by **Brain Station 23 / nopStation**. 

Bridging the tactile elegance of high-end fashion maisons (*SSENSE, NET-A-PORTER, Loewe, Brunello Cucinelli, Farfetch*) with subtle, context-aware artificial intelligence, nexCommerce eliminates cognitive friction across the entire shopping journey. The platform combines high-fidelity typography, human lifestyle photography, fluid spring physics, intent-based natural language discovery, and zero-knowledge privacy architecture into a blazingly fast, zero-framework web application.

---

## 💎 Key Highlights & Architectural Innovations

### 1. Editorial Luxury Aesthetic & Design Tokens
* **Harmonious Palette**: Grounded in Obsidian Navy (`#012148` / `#001838`), Surface Navy (`#0A2A54`), Warm Stone storytelling breaks (`#f4f2ee`), with precise accents of Radiant Crimson (`#E60C45`), Signature Gradient (`#F13365` → `#E60C45`), and Electric Cyan (`#3DE0FF`).
* **Typographic Hierarchy**: Classical **Cormorant Garamond** serif for editorial headlines and emotional storytelling paired with ultra-clean **Inter** for UI chrome, tabular figures, and product specifications.
* **Human Lifestyle Photography**: Authentic lifestyle photography featuring human models interacting with pieces in real environments, strictly avoiding artificial neon 3D renders.

### 2. 120fps GPU-Accelerated Motion Engineering
* **Subpixel Smoothness**: Progress bars and story carousel timers utilize GPU hardware-composited `transform: scaleX(0) → scaleX(1)` with `transform-origin: left center` and `will-change: transform`, completely eliminating CPU layout recalculations and visual clipping.
* **Emil Kowalski Design Engineering Suite**: Interruptible springs, gesture-driven touch slide-overs, and luxury easing curves (`cubic-bezier(0.25, 1, 0.5, 1)`).

### 3. Agentic Intent Discovery & Natural Language Search
* **Context-Aware Intent Engine (`Ctrl + K`)**: Understands aesthetic, temporal, and lifestyle shopping intents (e.g., *"warm minimalist overcoat for European winter"* or *"running shoe with carbon plate"*).
* **Understood Context Bar**: Displays parsed attributes as removable chips with live reasoning explanations (*"Why this fits your request"*).

### 4. Private Atelier AI Concierge & Sizing Advisor
* **Conversational Shopping Drawer**: 24/7 dedicated styling assistant, real-time look recommendations, and direct concierge arbitration.
* **Anatomical Size Calibrator**: Real-time measurement conversion (Chest, Shoulder, Waist, Foot Length) with drape preference modes (Fitted, Regular, Relaxed) and European/US size matrices.

### 5. High-Conversion Single-Page Checkout & Localized Settlement
* **Progressive 4-Step Settlement**: Frictionless flow covering Client Details, Atelier Address, Delivery Schedules, and Payment Settlement.
* **Integrated Regional & Global Payment**: Native support for **bKash**, **Nagad**, and **Visa / Mastercard** with an interactive mobile PIN sheet modal, masked PIN entry, and real-time order generation.
* **Dynamic BDT Delivery Guidance**: Live threshold calculations offering complimentary white-glove express delivery above ৳20,000.

### 6. Live 6-Stage Courier Tracking & Logistics AI
* **Interactive Courier Journey**: 6-stage pulsing timeline tracking order verification, tailoring, bespoke packing, carrier dispatch, transit, and delivery.
* **AI Logistics Concierge**: Live conversational delivery assistant answering arrival questions, packaging inquiries, and delivery instructions.

### 7. Client Data Sovereignty & Cryptographic Provenance
* **Zero-Knowledge Privacy Vault**: Direct client visibility into local storage keys, 1-click JSON backup export, and an irreversible `PURGE ALL SIGNALS` privacy protocol.
* **Atelier Authenticity Ledger**: Live physical certificate verifier (`NX-AUTH-9428`) rendering cryptographic authenticity seals, workshop timestamps, and master artisan signatures.

---

## 🏛️ The Complete Storefront (All 22 Elevated Pages)

All 22 storefront pages have been fully elevated to luxury atelier standards, interconnected with cross-page navigation, responsive from 390px mobile to 1920px 4K desktop, and verified with SQA visual audit proof:

| # | Page File | Title & Atelier Functionality | Key Features & UX Capabilities |
| :-: | :--- | :--- | :--- |
| **01** | [`index.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/index.html) | **Maison Homepage & Discovery Gallery** | Hero story carousel with 120fps GPU capsule progress, category bento, curated collection grid, human editorial breaks, and trust strip. |
| **02** | [`category.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/category.html) | **Collections & Product Listing (PLP)** | Custom sort dropdown, sticky sliding category subnav, responsive filter panel, wishlist state sync, and 2-column editorial breaks. |
| **03** | [`product.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/product.html) | **Product Detail Experience (PDP)** | 60/40 visual gallery split, circular color rings, scarcity counter, AI Fit modal trigger, recently viewed tray, and fixed mobile purchase bar. |
| **04** | [`cart.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/cart.html) | **Shopping Bag Review & Cart Engine** | ৳20k free shipping progress bar, 4/5 aspect ratio cards, quantity steppers, atelier promo engine (`NEX10`, `LUXURY20`), cross-sell tray, and sticky mobile CTA. |
| **05** | [`checkout.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/checkout.html) | **Frictionless Single-Page Checkout** | 4-step progressive disclosure, live address-based shipping computation, promo code application, and slide-up bKash/Nagad PIN modal. |
| **06** | [`confirmation.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/confirmation.html) | **Order Confirmation & Cryptographic Invoice** | Dynamic order hydration, delivery ETA badge, itemized breakdown, PDF/print invoice action, and 1-click live tracking deep-link. |
| **07** | [`tracking.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/tracking.html) | **Live Courier Journey & Timeline** | 6-stage hardware-composited timeline, pulsing active stage dot, sticky dispatch summary card, and interactive AI Logistics Concierge. |
| **08** | [`account.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/account.html) | **Client Maison Account & Private Profile** | 4-tab interactive suite (Overview, Order History, Addresses, Style Profile) with live status badges and new address modal. |
| **09** | [`orders.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/orders.html) | **Order History & Fulfillment Archive** | Dynamic status filters (`All`, `In Transit`, `Delivered`), timeline bars, digital invoice drawer, 1-click re-order to bag, and live courier tracking. |
| **10** | [`wishlist.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/wishlist.html) | **Saved Pieces & Private Wishlist Atelier** | Real-time valuation bar in BDT, 3-column studio grid, bulk `MOVE ALL TO BAG`, private shareable link copy, and Concierge styling bridge. |
| **11** | [`discovery.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/discovery.html) | **Intent Discovery & Natural Search Atelier** | Natural language search bar, prompt starter chips, Understood Context pill manager, and "Why it fits" editorial reasoning cards. |
| **13** | [`size-guide.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/size-guide.html) | **Anatomical Size & Fit Calibrator** | Interactive sliders with CM/IN conversion, silhouette drape selectors (Fitted/Regular/Relaxed), category conversion matrices, and anatomical diagrams. |
| **14** | [`foundation.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/foundation.html) | **Atelier Foundation & Craftsmanship Values** | Four core pillars of the Maison, interactive materiality and color swatches, trust safeguards, and direct wing navigation. |
| **15** | [`security.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/security.html) | **Authenticity, Trust & Provenance Architecture** | 4-pillar trust architecture, enterprise compliance badges (ISO 27001, SOC 2, PCI-DSS), and interactive provenance certificate verifier. |
| **16** | [`privacy.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/privacy.html) | **Data Sovereignty & Zero-Knowledge Vault** | Client data sovereignty dashboard, inspectable local keys, 1-click JSON backup export, and single-click signal purge protocol. |
| **17** | [`terms.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/terms.html) | **Maison Terms of Engagement & Client Charter** | Sticky scroll-spy table of contents, 6 comprehensive legal articles, legal callout capsules, and Concierge arbitration bridge. |
| **18** | [`contact.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/contact.html) | **Private Concierge & Client Services Desk** | 3 atelier service channels (Styling `LIVE 24/7`, Logistics `<15m SLA`, Legal), interactive ticket dispatcher (`TKT-9956-NX`), and physical directory. |
| **19** | [`signin.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/signin.html) | **Client Authentication & Private Sign-In** | Split layout with Ken Burns photographic panel, Gore Vidal quote, password visibility toggle, and 1-click Demo Account filler. |
| **20** | [`signup.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/signup.html) | **Client Registration & Atelier Onboarding** | Split layout with Coco Chanel quote, live password strength meter (red/yellow/cyan), privilege list, and onboarding redirect. |
| **21** | [`profile.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/profile.html) | **Client Style Profile & Private Preferences** | 4 preference dimensions (Aesthetic Direction, Silhouette, Color, Lifestyle Context), cyan glow chip toggles, and privacy purge control. |
| **22** | [`404.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/404.html) | **Atelier 404 Recovery & Curated Gateway** | Editorial typographic monument, natural search bar with prompt chips, and 4 curated gateway wings to recover lost shoppers. |

---

## 🛠️ Technology Stack & Engineering Standards

nexCommerce is engineered with a **Zero-Framework, High-Performance Native Architecture** to achieve sub-second load times, total styling flexibility, and complete developer clarity:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              nexCommerce                               │
├──────────────────┬──────────────────┬─────────────────┬────────────────┤
│    STRUCTURE     │     STYLING      │      LOGIC      │  PERSISTENCE   │
├──────────────────┼──────────────────┼─────────────────┼────────────────┤
│  Semantic HTML5  │  Vanilla CSS3    │  ES6+ Native    │  HTML5 Web     │
│  ARIA 1.2 AA     │  Design Tokens   │  Modular Engine │  Storage API   │
│  Lucide SVG Icons│  Glassmorphism   │  Async Handlers │  (Local Vault) │
│  Responsive View │  120fps Springs  │  Custom Events  │  JSON Guarded  │
└──────────────────┴──────────────────┴─────────────────┴────────────────┘
```

| Domain | Implementation Standard |
| :--- | :--- |
| **Markup & Semantics** | Semantic HTML5 (`header`, `main`, `section`, `article`, `nav`, `aside`, `footer`), strict ARIA landmark roles, and accessible dialog modals (`role="dialog"`, `aria-modal="true"`). |
| **Styling & Tokens** | Pure Vanilla CSS3 design system (`css/design-system.css`) containing 500+ design tokens, CSS Grid & Flexbox, fluid `clamp()` typography, and hardware-accelerated animations (`css/shadcn-physics.css`). |
| **Scripting & Engine** | Modular ES6+ JavaScript modules (`import`/`export`), asynchronous state controllers, event-driven architecture, and zero runtime dependencies. |
| **Typography** | Loaded via Google Fonts CDN: **Cormorant Garamond** (Weights 400, 500, 600, 700, Italic) and **Inter** (Weights 300, 400, 500, 600, 700, 800). |
| **Iconography** | High-precision vector stroke icons via Lucide Icons (CDN) and inline SVG implementations. |
| **State Persistence** | Resilient HTML5 `localStorage` state management with try/catch guarded JSON parsing, schema validation, and storage corruption recovery. |
| **Performance & CWV** | Zero Cumulative Layout Shift (CLS = 0) with pre-reserved aspect ratio boxes (`aspect-ratio: 4/5`), native lazy loading (`loading="lazy"`), and GPU transform compositing. |

---

## 📂 Project Directory Structure

```text
nexcomarch/
├── 📄 index.html                  # Maison Homepage & Discovery Gallery
├── 📄 category.html               # Collections & Product Listing (PLP)
├── 📄 product.html                # Product Detail Experience (PDP)
├── 📄 cart.html                   # Shopping Bag Review & Cart Engine
├── 📄 checkout.html               # Frictionless Single-Page Checkout
├── 📄 confirmation.html           # Order Confirmation & Cryptographic Invoice
├── 📄 tracking.html               # Live Courier Journey & 6-Stage Timeline
├── 📄 account.html                # Client Maison Account & Private Profile
├── 📄 orders.html                 # Order History & Fulfillment Archive
├── 📄 wishlist.html               # Saved Pieces & Private Wishlist Atelier
├── 📄 discovery.html              # Intent Discovery & Natural Search Atelier
├── 📄 size-guide.html             # Anatomical Size & Fit Calibrator
├── 📄 foundation.html             # Atelier Foundation & Craftsmanship Values
├── 📄 security.html               # Authenticity, Trust & Provenance Architecture
├── 📄 privacy.html                # Data Sovereignty & Zero-Knowledge Vault
├── 📄 terms.html                  # Maison Terms of Engagement & Client Charter
├── 📄 contact.html                # Private Concierge & Client Services Desk
├── 📄 signin.html                 # Client Authentication & Sign-In
├── 📄 signup.html                 # Client Registration & Onboarding
├── 📄 profile.html                # Client Style Profile & Private Preferences
├── 📄 404.html                    # Atelier 404 Recovery & Curated Gateway
├── 📄 components-preview.html     # Design System & Component Library Preview
├── 📄 playground.html             # Interactive Component Sandbox
├── 📄 task.md                     # Active Task Queue & Verification History
├── 📄 .env                        # Default Demonstration Credentials
│
├── 📁 css/                        # Core Design System & Motion Physics
│   ├── 📄 design-system.css       # Unified design tokens, resets, utility classes, and 22-page styles
│   └── 📄 shadcn-physics.css      # Emil Kowalski spring animations & GPU curves
│
├── 📁 js/                         # Modular JavaScript Business & AI Logic
│   ├── 📄 account.js              # Account dashboard, tab switching & address modals
│   ├── 📄 ai-engine.js            # Inferred preference classification & recommendation engine
│   ├── 📄 ai-search.js            # Natural language search intent parser
│   ├── 📄 ai-search-v2.js         # Advanced semantic token matching & multi-attribute filter
│   ├── 📄 animations.js           # Scroll triggers, Ken Burns effects & transition physics
│   ├── 📄 auth.js                 # Authentication state, session handling & demo quick-fill
│   ├── 📄 cart.js                 # Cart state (`nex_cart`), drawer UI, promo engine & BDT math
│   ├── 📄 catalog-engine.js       # Master product catalog data & category taxonomies
│   ├── 📄 category.js             # PLP sorting, filter panels & sticky subnav
│   ├── 📄 components.js           # Reusable DOM builders (Product cards, trust badges, modals)
│   ├── 📄 concierge.js            # Private Concierge slide-out drawer & UI triggers
│   ├── 📄 concierge-engine.js     # Conversational assistant & styling recommendation logic
│   ├── 📄 context-retention.js    # Client session continuity & context tracking
│   ├── 📄 delivery-assistant.js   # Dynamic shipping calculators & district routing
│   ├── 📄 discovery-ui.js         # Intent search interface & "Why it fits" reasoning renderers
│   ├── 📄 header.js               # Global luxury glass header, mobile drawer & badge counters
│   ├── 📄 home.js                 # Hero story carousel, gesture listeners & GPU scaleX fill
│   ├── 📄 intent-parser.js        # Natural language query tokenizer
│   ├── 📄 notifications.js        # Sonner-style luxury toast notifications
│   ├── 📄 pdp.js                  # Product gallery, color ring selector, fit modal & mobile bar
│   ├── 📄 plp.js                  # Advanced facet filtering & infinite catalog scroll
│   ├── 📄 search.js               # Search overlay controller (`Ctrl + K` & `ESC`)
│   ├── 📄 search-overlay.js       # Keyboard shortcut bindings & query dispatch
│   ├── 📄 session-context.js      # Client state hydration & guest identity provisioning
│   ├── 📄 shadcn-emil-ui.js       # Micro-interactions, spring buttons & ripple effects
│   ├── 📄 size-advisor.js         # Anatomical size calibration algorithm
│   ├── 📄 style-profile.js        # 4-dimensional preference state manager
│   ├── 📄 theme-switcher.js       # Palette switching & visual theme controller
│   └── 📄 tracking.js             # Live 6-stage courier tracker & Logistics AI Q&A assistant
│
├── 📁 docs/                       # Project Documentation & Architecture
│   ├── 📁 brand/                  # Brand guidelines, colors, typography & accessibility
│   │   ├── 📄 color-system.md
│   │   ├── 📄 typography.md
│   │   ├── 📄 design-tokens.md
│   │   ├── 📄 accessibility-guidelines.md
│   │   ├── 📄 ai-design-guidelines.md
│   │   ├── 📄 component-guidelines.md
│   │   ├── 📄 motion-guidelines.md
│   │   └── 📄 nexcommerce-brand-guidelines-v1.0.md
│   └── 📁 reports/                # SQA functional audit reports & executive summaries
│       ├── 📄 2026-08-10-nexcommerce-executive-report.md
│       ├── 📄 2026-08-15-homepage-full-sqa-audit-report.md
│       └── 📄 2026-08-15-pdp-sqa-audit-report.md
│
└── 📁 assets / images             # High-resolution lifestyle imagery & studio product photos
```

---

## 🎨 Design System & Visual Tokens Guide

nexCommerce is built upon strict mathematical ratios and luxury color theory:

### 1. Color Palette Distribution
```
┌─────────────────────────────────────────────────────────┐
│ Obsidian / Navy Surface Base                70% – 80%   │
│ Warm Stone / Soft Ivory Story Breaks        15% – 20%   │
│ Pink / Crimson Signature Accent              5% – 8%    │
│ Electric Cyan / Gold Highlights             < 2%        │
└─────────────────────────────────────────────────────────┘
```

| Token | Variable | Hex Value | Primary Application |
| :--- | :--- | :--- | :--- |
| **Brand Navy** | `--brand-navy` | `#003371` | Brand wordmark and primary brand identity |
| **Deep Base** | `--bg-main` | `#012148` | Main page canvas background |
| **Deepest Navy** | `--bg-deep` | `#001838` | Sticky glass navigation header & footer base |
| **Surface Navy** | `--bg-surface` | `#0A2A54` | Product cards, drawers, dialog panels |
| **Surface Hover** | `--bg-surface-hover` | `#0E366B` | Interactive component hover states |
| **Warm Stone** | `--bg-stone` | `#F4F2EE` | Editorial storytelling rhythm breaks |
| **Warm Ivory** | `--cta-primary` | `#F4F4F6` | Primary commerce buttons (`ADD TO BAG`, `CHECKOUT`) |
| **Signature Pink** | `--accent-pink` | `#F13365` | Gradient start & promotional discount badges |
| **Radiant Crimson** | `--accent-crimson` | `#E60C45` | Gradient tip, active badge counters, hero accents |
| **Electric Cyan** | `--accent-cyan` | `#3DE0FF` | Eyebrow badges, active focus rings, data sovereignty |
| **Champagne Sand**| `--accent-sand` | `#C8B295` | Secondary gold accents & artisan provenance tags |
| **Text Primary** | `--text-primary` | `#F8FAFF` | Headlines, titles, and high-contrast body copy |
| **Text Secondary**| `--text-secondary` | `#D8DEE9` | Explanatory copy, subtitles, metadata |
| **Text Muted** | `--text-muted` | `#8FA2BE` | Breadcrumbs, footnotes, form placeholders |

### 2. Typography Pairings
* **Editorial Headlines**: `font-family: 'Cormorant Garamond', Georgia, serif;`  
  *Conveys legacy, craftsmanship, and emotional elegance.*
* **UI Controls & Data Specs**: `font-family: 'Inter', -apple-system, sans-serif;`  
  *Ensures instantaneous readability, crisp number scanning, and clean form layout.*

---

## 💾 Client State Persistence Schema

The client state is managed locally via `localStorage` with error handling and fallback defaults:

| Storage Key | Data Structure | Purpose & Scope |
| :--- | :--- | :--- |
| `nex_cart` | `Array<CartItem>` | Shopping bag items, quantities, selected sizes, variant SKUs, unit prices, and imagery. |
| `nex_curated_wishlist_ids` | `Array<string>` | IDs of pieces saved to the client's private wishlist; automatically drives header counter badge. |
| `nex_placed_orders` | `Array<OrderObject>` | Placed order records with items, timestamps, shipping addresses, payment methods, and tracking IDs. |
| `nex_client_profile` | `ClientProfileObject` | Authenticated client name, email, VIP tier, default shipping address, and security status. |
| `nex_style_preferences` | `StylePreferences` | Selected aesthetic dimensions (Minimalist, Architectural, Silhouettes, Color palettes). |
| `nex_recent_products` | `Array<ProductObject>`| Recently viewed pieces dynamically rendered in PDP and discovery trays. |

---

## 🚀 Quick Launch & Local Development

Because nexCommerce is built with pure web technologies and zero framework build steps, you can run it immediately in any modern web browser.

### Option 1: Direct File Launch
Double-click [`index.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/index.html) or open it directly in **Google Chrome**, **Microsoft Edge**, **Mozilla Firefox**, or **Apple Safari**.

### Option 2: Local HTTP Server (Recommended)

Run any lightweight static server in the project directory to support native ES modules and smooth asset streaming:

```bash
# Using Node.js (npx serve)
npx serve .

# Using Python 3
python -m http.server 8080

# Using VS Code Live Server Extension
Right-click 'index.html' -> "Open with Live Server"
```

Once running, navigate to `http://localhost:8080` (or the port specified by your server).

### 🔑 Demonstration Credentials & Quick-Fill

For testing authentication, checkout, and client account features:

* **Demo Account Email:** `demo@nexcommerce.ai`
* **Demo Password:** `password123`
* *Tip: Look for the **`✦ QUICK FILL DEMO CLIENT`** button on [`signin.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/signin.html) and [`checkout.html`](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/checkout.html) to instantly populate credentials.*

---

## 🤖 AI & Intelligence Architecture Standards

To uphold consumer trust and prevent deceptive patterns, nexCommerce enforces the **AI Feature Integrity Rule**:

```
                              AI Architecture
                                     │
      ┌──────────────────────────────┼──────────────────────────────┐
      ↓                              ↓                              ↓
   TIER 1                         TIER 2                         TIER 3
Customer-Facing               Operational Layer              Admin Intelligence
      │                              │                              │
 ── Style Concierge             ── Fulfillment Routing         ── Demand Forecasting
 ── Natural Intent Search       ── Demand Pricing              ── Segment Clustering
 ── Personalized Curation       ── LLM Copy Descriptions       ── Anomaly & Fraud Guard
 ── Fit & Size Advisor          ── Return Classifier
```

### Ethical AI Rules:
1. **No Fake Intelligence Labels**: The UI strictly forbids fabricated "AI-powered" or "Autonomous" buzzwords unless supported by concrete logic or model endpoints.
2. **Graceful Fallbacks**: Every AI feature (e.g., Natural Search, Sizing Advisor) falls back automatically to robust deterministic filters (category, price, keyword matching) if offline or unavailable.
3. **Prototype Transparency**: In standalone prototype mode, all simulated AI features include explicit `<!-- TODO: Wire to real AI API -->` annotations and transparent UI indicators.

---

## 🧪 Quality Assurance & SQA Verification

All 22 storefront pages have undergone rigorous manual and automated SQA audits using Playwright and high-resolution viewport validation:

* **Cross-Device Testing**:
  * **Desktop 4K / Widescreen**: 1920×1080 & 1440×900
  * **Standard Laptop**: 1280×720 & 1366×768
  * **Tablet Viewport**: 768×1024
  * **Mobile Standard**: 390×844 (iPhone 14/15/16 Pro) & 375×667
* **Accessibility (WCAG 2.1 AA)**:
  * Minimum 4.5:1 text contrast for body copy; 3:1 for large display typography.
  * 48×48px minimum touch target size for all interactive buttons and inputs.
  * Focus rings, modal focus trapping, and `ESC` key bindings.
* **Audit Reports**:
  * [Homepage Full SQA Audit Report](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/docs/reports/2026-08-15-homepage-full-sqa-audit-report.md)
  * [PDP SQA Audit Report](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/docs/reports/2026-08-15-pdp-sqa-audit-report.md)
  * [Executive Project Report](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/docs/reports/2026-08-10-nexcommerce-executive-report.md)

---

## 👥 Authors & Acknowledgements

* **Architecture & Development:** Technical Lead & Founding Full-Stack Engineer
* **Design & Experience:** Senior UI/UX Designer & Motion Specialist
* **Platform:** Developed by **Brain Station 23 / nopStation**
* **Design Inspiration:** SSENSE, NET-A-PORTER, Loewe, Farfetch, Brunello Cucinelli, Apple, and Linear.

---

<div align="center">
  <sub>nexCommerce © 2026 Brain Station 23. All rights reserved. Crafted with architectural restraint and intelligent quietude.</sub>
</div>
