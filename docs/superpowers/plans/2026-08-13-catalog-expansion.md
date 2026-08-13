# 20-Product Catalog Expansion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the nexCommerce catalog to 20 realistic products across 4 categories with human lifestyle photography and central data integration.

**Architecture:** A central data store (`js/products-data.js`) maintains all 20 product SKUs with realistic specs, prices, and human lifestyle image paths. PLP, PDP, Search, and AI Recommendation modules consume this central data store.

**Tech Stack:** HTML5, CSS3 (Vanilla design-system.css), ES6 JavaScript, `generate_image` tool.

## Global Constraints

- **4 Categories:** `apparel`, `acoustics`, `accessories`, `footwear` (5 SKUs each).
- **Human Model Lifestyle Photography:** Every product image must depict human models using or wearing the product in authentic contexts. No neon borders or floating renders.
- **Copy Voice:** Luxury editorial tone with BDT pricing and Dhaka ambient context.
- **Step-by-Step Execution:** Follow single-step execution and check results.

---

### Task 1: Generate 20 Human Lifestyle Images

**Files:**
- Create: `img_apparel_1.png` through `img_footwear_5.png` in workspace root.

**Interfaces:**
- Produces: 20 image file paths referenced in `products-data.js`.

- [ ] **Step 1: Generate Apparel images (5 items)**
  Generate 5 human model lifestyle photos for Apparel SKUs using `generate_image`.

- [ ] **Step 2: Generate Acoustics images (5 items)**
  Generate 5 human model lifestyle photos for Acoustics SKUs using `generate_image`.

- [ ] **Step 3: Generate Accessories images (5 items)**
  Generate 5 human model lifestyle photos for Accessories SKUs using `generate_image`.

- [ ] **Step 4: Generate Footwear images (5 items)**
  Generate 5 human model lifestyle photos for Footwear SKUs using `generate_image`.

- [ ] **Step 5: Verify image existence**
  Check that all 20 `.png` image files exist in workspace root and have valid file sizes.

---

### Task 2: Create Centralized Product Data Module (`js/products-data.js`)

**Files:**
- Create: `c:/Users/BS1572/OneDrive - Brain Station 23/Documents/nexcomarch/js/products-data.js`

**Interfaces:**
- Produces: `PRODUCTS_DATA` array, `getProductById(id)`, `getProductsByCategory(cat)`, `searchProducts(query)`.

- [ ] **Step 1: Create `js/products-data.js` with full 20 SKUs**
  Define `window.PRODUCTS_DATA` containing 20 objects:
  - 5 Apparel: `p_apparel_1` to `p_apparel_5`
  - 5 Acoustics: `p_acoustics_1` to `p_acoustics_5`
  - 5 Accessories: `p_accessories_1` to `p_accessories_5`
  - 5 Footwear: `p_footwear_1` to `p_footwear_5`
  Include properties: `id`, `name`, `category`, `price`, `formattedPrice`, `image`, `reasoning`, `whyExpanded`, `description`, `details`, `colors`, `sizes`.

- [ ] **Step 2: Add utility helper functions**
  Implement `window.getProductById(id)`, `window.getProductsByCategory(cat)`, `window.searchProducts(query)`.

- [ ] **Step 3: Include `<script src="js/products-data.js"></script>` in HTML files**
  Include `products-data.js` in `index.html`, `category.html`, `product.html`, `search.html`, `checkout.html`, `confirmation.html`, `account.html`.

---

### Task 3: Refactor PLP (`js/plp.js`) for 20-Product Catalog

**Files:**
- Modify: `c:/Users/BS1572/OneDrive - Brain Station 23/Documents/nexcomarch/js/plp.js`

**Interfaces:**
- Consumes: `window.PRODUCTS_DATA`, `window.getProductsByCategory(cat)`.

- [ ] **Step 1: Replace local catalog array in `js/plp.js` with `window.PRODUCTS_DATA`**
  Update `renderGrid` to filter `window.PRODUCTS_DATA` based on active filter pill (`all`, `apparel`, `acoustics`, `accessories`, `footwear`).

- [ ] **Step 2: Update product count badges and AI banner logic**
  Ensure total count displays correctly (e.g. "Showing 20 items" for ALL, "Showing 5 items" for categories).

- [ ] **Step 3: Test category filter pills on `category.html`**
  Verify clicking each filter pill updates the grid with 5 matching products.

---

### Task 4: Refactor PDP (`js/pdp.js`) for Dynamic SKU Loading

**Files:**
- Modify: `c:/Users/BS1572/OneDrive - Brain Station 23/Documents/nexcomarch/js/pdp.js`

**Interfaces:**
- Consumes: `window.getProductById(id)`.

- [ ] **Step 1: Update PDP parameter reader to resolve any SKU ID**
  Read `?id=` query string, call `window.getProductById(id)` with fallback to `p_apparel_1`.

- [ ] **Step 2: Update DOM binding for product gallery, title, price, specs, and details**
  Bind `product.name`, `product.formattedPrice`, `product.image`, `product.description`, `product.details` array into PDP HTML elements.

- [ ] **Step 3: Test PDP loading across different product IDs**
  Verify loading `product.html?id=p_acoustics_1`, `product.html?id=p_accessories_2`, etc.

---

### Task 5: Refactor Search (`js/search.js` & `js/ai-search.js`)

**Files:**
- Modify: `c:/Users/BS1572/OneDrive - Brain Station 23/Documents/nexcomarch/js/search.js`
- Modify: `c:/Users/BS1572/OneDrive - Brain Station 23/Documents/nexcomarch/js/ai-search.js`

**Interfaces:**
- Consumes: `window.PRODUCTS_DATA`.

- [ ] **Step 1: Wire header search modal in `js/search.js` to `window.PRODUCTS_DATA`**
  Update search indexing to query all 20 products.

- [ ] **Step 2: Wire natural language search in `js/ai-search.js` to `window.PRODUCTS_DATA`**
  Update matching algorithm to search across titles, descriptions, categories, and tags of all 20 products.

- [ ] **Step 3: Test search autocomplete and query results**
  Query terms like "cashmere", "watch", "earbuds", "sneaker" and verify results render properly.

---

### Task 6: Final Verification & Quality Check

- [ ] **Step 1: Verify all 20 products render on `category.html`**
- [ ] **Step 2: Verify category filters (5 products each)**
- [ ] **Step 3: Verify human lifestyle photography rendered on PDP and PLP**
