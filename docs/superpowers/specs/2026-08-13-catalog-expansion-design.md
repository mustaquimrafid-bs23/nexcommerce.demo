# nexCommerce — Catalog Expansion Design Specification
**Date:** 2026-08-13  
**Project:** 20-Product Catalog Expansion with Human Lifestyle Imagery  
**Status:** Design Proposal for Review  

---

## 1. Overview & Objective

Expand the nexCommerce product catalog from 6 items to **20 distinct, realistic products** (5 products per category) across the 4 core categories:
1. **APPAREL**
2. **ACOUSTICS**
3. **ACCESSORIES**
4. **FOOTWEAR**

Every product will feature:
* **Realistic Editorial Copy:** Luxury copywriter voice (materials, origin, fit, care, Dhaka context).
* **Human Model Lifestyle Photography:** High-resolution lifestyle imagery featuring human models wearing or interacting with products in authentic settings.
* **Unified Centralized Data Module:** A single source of truth (`js/products-data.js`) shared across PLP, PDP, Search, and Recommendations.

---

## 2. Product Catalog Breakdown (20 SKUs)

### 2.1 Category 1: APPAREL (5 SKUs)
1. **`p_apparel_1` — Architectural Cashmere Sweater**
   * **Price:** BDT 18,400
   * **Specs:** 2-ply Mongolian cashmere, dropped shoulder, relaxed fit.
   * **Image:** Model in cozy cashmere sweater in warm indoor studio setting.
2. **`p_apparel_2` — Structured Wool Blazer**
   * **Price:** BDT 24,500
   * **Specs:** Unlined Italian merino wool weave, horn buttons, modern relaxed tailoring.
   * **Image:** Model wearing structured blazer in modern architectural gallery.
3. **`p_apparel_3` — Fine-Knit Merino Crewneck**
   * **Price:** BDT 16,200
   * **Specs:** 100% extra-fine 19.5-micron merino wool, rib-knit cuffs.
   * **Image:** Model wearing minimal crewneck sweater sitting near window.
4. **`p_apparel_4` — Double-Faced Wool Overcoat**
   * **Price:** BDT 34,000
   * **Specs:** Hand-stitched double-faced wool-cashmere blend, notch lapels.
   * **Image:** Model walking in long wool overcoat on urban evening street.
5. **`p_apparel_5` — Relaxed Pleated Trousers**
   * **Price:** BDT 14,800
   * **Specs:** High-waisted wool gabardine, front pleats, tapered ankle.
   * **Image:** Model wearing tailored pleated trousers with leather loafers.

---

### 2.2 Category 2: ACOUSTICS (5 SKUs)
1. **`p_acoustics_1` — Studio Acoustics Headphones GT**
   * **Price:** BDT 32,000
   * **Specs:** Anodized aluminum housing, lambskin memory foam ear cushions, 40mm beryllium drivers.
   * **Image:** Model wearing studio headphones focused at work desk.
2. **`p_acoustics_2` — Wireless Precision Earbuds**
   * **Price:** BDT 14,500
   * **Specs:** Custom balanced armature drivers, IPX5 water resistance, wireless charging case.
   * **Image:** Model wearing sleek wireless earbuds outdoors in daylight.
3. **`p_acoustics_3` — Active Noise-Cancelling Headphones**
   * **Price:** BDT 28,500
   * **Specs:** Hybrid ANC technology, 38-hour battery, tactile volume dial.
   * **Image:** Model wearing ANC headphones on evening commute.
4. **`p_acoustics_4` — Desktop Acoustic Monitor System**
   * **Price:** BDT 42,000
   * **Specs:** Brushed alloy cabinet, dual silk dome tweeters, Bluetooth 5.3 aptX HD.
   * **Image:** Model adjusting desktop acoustic monitor speaker in workspace.
5. **`p_acoustics_5` — Portable Aluminum Audio Speaker**
   * **Price:** BDT 19,500
   * **Specs:** 360-degree omnidirectional acoustic cone, IP67 dust/waterproof.
   * **Image:** Model relaxing on terrace with portable aluminum speaker nearby.

---

### 2.3 Category 3: ACCESSORIES (5 SKUs)
1. **`p_accessories_1` — Minimalist Chronograph Timepiece**
   * **Price:** BDT 28,500
   * **Specs:** Grade-5 brushed titanium case, sapphire crystal, Swiss quartz movement.
   * **Image:** Close-up of model wearing titanium chronograph timepiece on wrist.
2. **`p_accessories_2` — Architectural Calfskin Tote**
   * **Price:** BDT 22,000
   * **Specs:** Full-grain Italian calfskin, suede lining, magnetic top closure.
   * **Image:** Model carrying leather tote bag on shoulder walking in city.
3. **`p_accessories_3` — Slim Bifold Leather Cardholder**
   * **Price:** BDT 8,500
   * **Specs:** Vegetable-tanned leather, hand-waxed edges, 6 card slots.
   * **Image:** Model holding slim leather cardholder in hand.
4. **`p_accessories_4` — Polarized Titanium Sunglasses**
   * **Price:** BDT 16,500
   * **Specs:** Handcrafted Japanese titanium frames, Category 3 polarized lenses.
   * **Image:** Model wearing dark titanium sunglasses in sunlight.
5. **`p_accessories_5` — Woven Silk & Cashmere Scarf**
   * **Price:** BDT 11,200
   * **Specs:** 70% cashmere, 30% silk hand-loomed weave, subtle eyelash fringe.
   * **Image:** Model wearing silk-cashmere scarf wrapped gently around collar.

---

### 2.4 Category 4: FOOTWEAR (5 SKUs)
1. **`p_footwear_1` — Minimalist Leather Runner**
   * **Price:** BDT 19,800
   * **Specs:** Full-grain Italian leather upper, Vibram rubber sole, calfskin lining.
   * **Image:** Model stepping forward wearing white leather minimalist runners.
2. **`p_footwear_2` — Performance Knit Sneaker**
   * **Price:** BDT 16,500
   * **Specs:** Seamless 3D engineered knit upper, EVA midsole, high-traction outsole.
   * **Image:** Athlete model tying performance knit sneaker laces outdoors.
3. **`p_footwear_3` — Heritage Calfskin Loafer**
   * **Price:** BDT 26,000
   * **Specs:** Hand-stitched Goodyear welt, calfskin upper, leather outsole with rubber insert.
   * **Image:** Model wearing heritage calfskin loafers seated on wooden bench.
4. **`p_footwear_4` — All-Weather Suede Chelsea Boot**
   * **Price:** BDT 29,500
   * **Specs:** Water-repellent Italian suede, elastic side gores, stacked heel.
   * **Image:** Model standing wearing suede Chelsea boots in autumn setting.
5. **`p_footwear_5` — Low-Top Nappa Court Sneaker**
   * **Price:** BDT 17,200
   * **Specs:** Butter-soft Nappa leather, padded ankle collar, tonal stitching.
   * **Image:** Model wearing low-top court sneakers seated relaxed.

---

## 3. Data Architecture & Integration Strategy

1. **Central Data Module (`js/products-data.js`):**
   * Export global `PRODUCTS_DATA` array containing all 20 standardized SKU objects.
   * Include helper functions: `getProductById(id)`, `getProductsByCategory(cat)`, `getSearchMatches(query)`.
2. **Refactoring Existing Modules:**
   * `js/plp.js`: Replace local 6-item `PLP_CATALOG` with `PRODUCTS_DATA`.
   * `js/pdp.js`: Map dynamic URL query params (`?id=p_apparel_1` or `?id=p1`) to `PRODUCTS_DATA`.
   * `js/search.js` & `js/ai-search.js`: Search across all 20 products.
   * `js/cart.js` & `js/tracking.js`: Maintain cart compatibility.

---

## 4. Image Generation Workflow

* Use `generate_image` to generate 20 lifestyle photographs featuring human models.
* Prompt template:
  `"[Product description] lifestyle photograph, human model [wearing/using] the item, editorial lighting, neutral backdrop/modern urban setting, high fashion magazine quality"`
* Save filenames: `img_apparel_1.png` to `img_footwear_5.png`.

---

## 5. Verification & Acceptance Criteria

1. **Catalog Completeness:** 20 total products (5 per category) rendered on `category.html`.
2. **Category Filtering:** Clicking `ALL`, `APPAREL`, `ACOUSTICS`, `ACCESSORIES`, `FOOTWEAR` filters correctly to 5 items each (or 20 for ALL).
3. **Product Detail Pages:** Clicking any product navigates to `product.html?id=<id>` with matching title, price, human model image, description, and specs.
4. **Search Consistency:** Searching in `ai-search.js` or header search returns matches across all 20 products.
5. **Image Quality:** Every product displays a realistic human model photo without neon background artifacts.
