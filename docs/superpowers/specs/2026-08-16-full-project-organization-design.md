# Full Project Organization Design Specification

**Document Date:** 2026-08-16  
**Status:** Validated & Proposed  
**Project:** nexCommerce (Luxury Digital Atelier & E-Commerce Platform)

---

## 1. Executive Summary & Objective

The nexCommerce codebase has evolved across 22 fully designed storefront pages, 29 client-side JavaScript engine modules, a comprehensive luxury design system, and numerous audit artifacts. As a result of rapid prototyping and iterative SQA verification, the root directory currently contains over 270 files, including ~100+ audit verification screenshots, loose media assets, and utility Python scripts.

The goal of this architectural re-organization is to establish a **Clean Production Asset & Directory Architecture**:
1. Zero clutter in the root directory.
2. Distinct, structured directories for assets (`assets/images/`), audit artifacts (`docs/audit-artifacts/`), helper utilities (`scripts/`), stylesheets (`css/`), scripts (`js/`), and documentation (`docs/`).
3. 100% link integrity across all 22 HTML pages, 29 JS engine modules, and CSS stylesheets, verified with automated link validation.

---

## 2. Target Directory Hierarchy

```text
nexcomarch/
├── index.html                     # Main Storefront Entrypoint
├── category.html                  # Category Listing (PLP)
├── product.html                   # Product Details (PDP)
├── cart.html                      # Dedicated Shopping Bag
├── checkout.html                  # Multi-step Settlement Portal
├── confirmation.html              # Order Confirmation
├── tracking.html                  # Live Courier Dispatch Tracker
├── account.html                   # Client Account Dashboard
├── profile.html                   # Client Persona & Measurements
├── orders.html                    # Order Journey Archive
├── wishlist.html                  # Curated Private Wishlist
├── signin.html                    # Client Authentication
├── signup.html                    # Client Registration
├── concierge.html                 # Bespoke AI Style Concierge
├── discovery.html                 # Intent Discovery Engine
├── lookbook.html                  # Editorial Lookbook Gallery
├── size-guide.html                # Anatomical Size Calibrator
├── security.html                  # Trust & Authenticity Architecture
├── privacy.html                   # Data Sovereignty Portal
├── terms.html                     # Maison Terms of Engagement
├── contact.html                   # Client Services & Atelier Desk
├── 404.html                       # Curated Recovery Monument
├── playground.html                # Design System Testing Sandbox
├── components-preview.html        # Interactive Component Gallery
├── foundation.html                # Design System Foundation Spec
├── README.md                      # Platform Documentation
├── task.md                        # Active Task Tracker
│
├── assets/
│   └── images/
│       ├── brand/                 # Logos & Payment Provider Vectors
│       │   ├── logo_light.png
│       │   ├── logo_dark.png
│       │   ├── bkash.svg
│       │   ├── bkash_logo.png
│       │   ├── nagad.svg
│       │   ├── nagad_logo.png
│       │   ├── visa.svg
│       │   └── mastercard.svg
│       │
│       ├── products/              # Storefront Products & PLP Mockups
│       │   ├── cat_accessories.jpg
│       │   ├── cat_acoustics.jpg
│       │   ├── cat_apparel.png
│       │   ├── cat_footwear.jpg
│       │   ├── hero.png
│       │   ├── hero_sweater.png
│       │   ├── hero_jeans_rack.png
│       │   ├── prod_headphones.png
│       │   ├── prod_runner.png
│       │   ├── prod_tote.png
│       │   ├── p1.png ... p7.png
│       │   ├── plp_blazer.png
│       │   ├── plp_crewneck.png
│       │   ├── plp_overcoat.png
│       │   ├── plp_trousers.png
│       │   ├── plp_turtleneck.png
│       │   ├── search_earbuds.png
│       │   ├── search_watch.png
│       │   ├── sweater_texture.png
│       │   └── img_apparel_1.png
│       │
│       └── lifestyle/             # Editorial Banners & Atmosphere
│           ├── hero_headphone_landscape.jpg
│           ├── hero_runner_landscape.jpg
│           ├── hero_sweater_landscape.jpg
│           ├── hero_tote_landscape.jpg
│           ├── hero_watch_landscape.jpg
│           ├── thumb_headphones.jpg
│           ├── thumb_runner.jpg
│           ├── thumb_sweater.jpg
│           ├── thumb_tote.jpg
│           ├── thumb_watch.jpg
│           ├── auth_lifestyle.jpg
│           ├── headphone_lifestyle.png
│           ├── runner_lifestyle.png
│           ├── sweater_lifestyle.png
│           └── tote_lifestyle.png
│
├── css/
│   ├── design-system.css          # Master Luxury Design System
│   └── shadcn-physics.css         # Spring Physics & Motion Utility
│
├── js/
│   ├── account.js
│   ├── ai-engine.js
│   ├── ai-search-v2.js
│   ├── ai-search.js
│   ├── animations.js
│   ├── auth.js
│   ├── cart.js
│   ├── catalog-engine.js
│   ├── category.js
│   ├── components.js
│   ├── concierge-engine.js
│   ├── concierge.js
│   ├── context-retention.js
│   ├── delivery-assistant.js
│   ├── discovery-ui.js
│   ├── header.js
│   ├── home.js
│   ├── intent-parser.js
│   ├── notifications.js
│   ├── pdp.js
│   ├── plp.js
│   ├── search-overlay.js
│   ├── search.js
│   ├── session-context.js
│   ├── shadcn-emil-ui.js
│   ├── size-advisor.js
│   ├── style-profile.js
│   ├── theme-switcher.js
│   └── tracking.js
│
├── scripts/                       # Developer Tooling & Automation
│   ├── inject_auth.py
│   ├── inject_concierge.py
│   ├── inject_minicart.py
│   ├── fixer.js
│   ├── update_scripts.py
│   └── update_ts_version.py
│
├── docs/
│   ├── audit-artifacts/           # ~100+ SQA & Design Verification Screenshots
│   ├── brand/                     # Brand Guidelines & Positioning
│   ├── reports/                   # SQA & Engineering Audit Reports
│   └── superpowers/               # Specs and Implementation Plans
│
└── .agents/                       # Custom AI Agent Skills & Standards
```

---

## 3. Detailed Component Plan & Path Refactoring Rules

### 3.1 Brand Asset Mappings
- `logo_light.png` -> `assets/images/brand/logo_light.png`
- `logo_dark.png` -> `assets/images/brand/logo_dark.png`
- `bkash.svg` -> `assets/images/brand/bkash.svg`
- `bkash_logo.png` -> `assets/images/brand/bkash_logo.png`
- `nagad.svg` -> `assets/images/brand/nagad.svg`
- `nagad_logo.png` -> `assets/images/brand/nagad_logo.png`
- `visa.svg` -> `assets/images/brand/visa.svg`
- `mastercard.svg` -> `assets/images/brand/mastercard.svg`

### 3.2 Product Imagery Mappings
- `cat_*.jpg|png` -> `assets/images/products/cat_*`
- `prod_*.png` -> `assets/images/products/prod_*`
- `p1.png ... p7.png` -> `assets/images/products/p*.png`
- `plp_*.png` -> `assets/images/products/plp_*`
- `search_*.png` -> `assets/images/products/search_*`
- `hero.png`, `hero_sweater.png`, `hero_jeans_rack.png`, `sweater_texture.png`, `img_apparel_1.png` -> `assets/images/products/`

### 3.3 Lifestyle Imagery Mappings
- `hero_*_landscape.jpg` -> `assets/images/lifestyle/hero_*_landscape.jpg`
- `thumb_*.jpg` -> `assets/images/lifestyle/thumb_*.jpg`
- `auth_lifestyle.jpg` -> `assets/images/lifestyle/auth_lifestyle.jpg`
- `*_lifestyle.png` -> `assets/images/lifestyle/*_lifestyle.png`

### 3.4 Audit & QA Screenshot Mappings
- `audit_*.png`, `sqa_*.png`, `playground_*.png`, `checkout_step*.png`, `category_step*.png`, `confirmation_step*.png`, `index_step*.png`, `product_step*.png`, `tracking_step*.png`, `qag_step*.png`, `browser_preview_*.png`, `homepage_*.png`, `header_*.png`, `badge_*.png`, `hero_*_verified.png`, `hero_*_pill*.png`, `hero_*_capsule*.png`, `hero_dots_*.png`
  -> `docs/audit-artifacts/`

### 3.5 Scripts & Clean-up
- Move root Python & JS automation scripts into `scripts/`.
- Remove redundant/duplicate `nexcommerce-brand (1) (1).skill` from root.
- Remove obsolete empty `scratch/` folder once files are moved.

---

## 4. Verification Plan

1. **Automated Link & Asset Integrity Checker Script:**
   - Scan all `*.html`, `js/*.js`, and `css/*.css` files.
   - Extract every image path (`src="..."`, `url(...)`, JS string references).
   - Assert that 100% of referenced files exist on the filesystem at their new relative locations.
2. **Interactive Visual Spot-Check:**
   - Open key storefront pages (`index.html`, `product.html`, `checkout.html`, `account.html`) in headless browser to confirm all logos, hero banners, product thumbnails, and payment icons render flawlessly without broken image icons.
