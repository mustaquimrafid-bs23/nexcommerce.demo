# Full Project Organization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Cleanly organize the entire nexCommerce repository by relocating media into `assets/images/`, QA audit screenshots into `docs/audit-artifacts/`, and developer tools into `scripts/`, while updating all source code path references with 100% link integrity.

**Architecture:** Modular directory structure separating production assets, documentation/audits, scripts, stylesheets, and core JavaScript engines. All HTML files remain at root for static hosting compatibility.

**Tech Stack:** HTML5, Vanilla CSS, Vanilla JavaScript (ES6+), Python automation scripts.

## Global Constraints
- Every image path update must be exact and preserve existing HTML layout, alt text, and lazy loading attributes.
- No broken relative paths in any of the 22+ HTML pages, 29 JS engine modules, or CSS files.
- All test screenshots must be moved to `docs/audit-artifacts/` without deleting historical audit proof.

---

### Task 1: Directory Setup & Asset Relocation

**Files:**
- Create: `assets/images/brand/`, `assets/images/products/`, `assets/images/lifestyle/`, `docs/audit-artifacts/`, `scripts/`
- Relocate: All root image files (`*.png`, `*.jpg`, `*.svg`) and scripts (`inject_*.py`, `fixer.js`, `scratch/*`)
- Remove: `nexcommerce-brand (1) (1).skill`, empty `scratch/`

**Interfaces:**
- Consumes: Loose files in repository root
- Produces: Structured directories populated with all corresponding files

- [ ] **Step 1: Create target directory folders**
- [ ] **Step 2: Relocate Brand logos & vectors to `assets/images/brand/`**
- [ ] **Step 3: Relocate Product photography to `assets/images/products/`**
- [ ] **Step 4: Relocate Lifestyle & Hero banners to `assets/images/lifestyle/`**
- [ ] **Step 5: Relocate QA Audit & Verification screenshots (~100+ files) to `docs/audit-artifacts/`**
- [ ] **Step 6: Relocate helper scripts to `scripts/` and clean up stray files**
- [ ] **Step 7: Verify root directory only contains HTML pages, config files, and core subdirectories**

---

### Task 2: Refactor Image Path References in Storefront HTML Files

**Files:**
- Modify: `index.html`, `category.html`, `product.html`, `cart.html`, `checkout.html`, `confirmation.html`, `tracking.html`, `account.html`, `profile.html`, `orders.html`, `wishlist.html`, `signin.html`, `signup.html`, `security.html`, `privacy.html`, `terms.html`, `contact.html`, `concierge.html`, `lookbook.html`, `size-guide.html`, `404.html`, `foundation.html`, `components-preview.html`, `playground.html`

**Interfaces:**
- Consumes: Media at `assets/images/...`
- Produces: Updated `<img src="...">` and `<link>` paths referencing the correct asset folders

- [ ] **Step 1: Build an automated refactoring script to update standard image tags across all HTML files**
- [ ] **Step 2: Apply brand asset path updates (`assets/images/brand/`)**
- [ ] **Step 3: Apply product and category asset path updates (`assets/images/products/`)**
- [ ] **Step 4: Apply lifestyle asset path updates (`assets/images/lifestyle/`)**
- [ ] **Step 5: Review diffs across all modified HTML files to ensure structure and attributes are intact**

---

### Task 3: Refactor Image Path References in JavaScript Modules & CSS

**Files:**
- Modify: `js/tracking.js`, `js/search.js`, `js/plp.js`, `js/pdp.js`, `js/home.js`, `js/discovery-ui.js`, `js/concierge.js`, `js/category.js`, `js/account.js`, `css/design-system.css`

**Interfaces:**
- Consumes: Media at `assets/images/...`
- Produces: Consistent image URIs in JS data models, catalogs, mock states, and CSS rules

- [ ] **Step 1: Update image path references in catalog and search engines (`js/search.js`, `js/category.js`, `js/discovery-ui.js`)**
- [ ] **Step 2: Update image path references in PDP & PLP engines (`js/pdp.js`, `js/plp.js`)**
- [ ] **Step 3: Update image path references in Homepage hero & stories (`js/home.js`)**
- [ ] **Step 4: Update image path references in Concierge and Tracking modules (`js/concierge.js`, `js/tracking.js`, `js/account.js`)**
- [ ] **Step 5: Inspect and update any CSS background images in `css/design-system.css`**

---

### Task 4: Automated Link Validation & Browser Verification

**Files:**
- Create/Run: `scripts/verify_assets.py`
- Test: All 22+ HTML pages, 29 JS files, CSS stylesheets

**Interfaces:**
- Consumes: Entire codebase
- Produces: 100% pass verification report confirming zero missing or broken asset paths

- [ ] **Step 1: Write `scripts/verify_assets.py` to scan all HTML, JS, and CSS files for image paths and verify file existence**
- [ ] **Step 2: Run verification script and resolve any lingering discrepancies**
- [ ] **Step 3: Perform live browser checks across key pages (`index.html`, `product.html`, `checkout.html`, `account.html`)**
- [ ] **Step 4: Update `task.md` and generate final project organization walkthrough report**
