# Comprehensive Luxury Search Suite Design Specification

**Date:** 2026-08-20  
**Status:** Approved  
**Scope:** Storefront Search Overlay, Typeahead Autocomplete, Natural Language & Semantic Intent Extraction, Catalog Synchronization, Keyboard Navigation, and Mini-Cart Integration across all pages.

---

## 1. Overview & Business Intent
The nexCommerce storefront requires an ultra-responsive, European luxury editorial search experience. The goal is to provide shoppers with an effortless discovery interface that bridges instant keyword lookup, natural language intent extraction, recent search management, and instant cart purchasing—all conforming to WCAG 2.1 AA accessibility and 120fps motion design standards.

---

## 2. Architecture & Data Model

### 2.1 Unified Catalog Index (`NexSearchCatalog`)
The search engine maintains a single source of truth covering all core departments (Apparel, Footwear, Audio, Accessories, Living):
* **Product Attributes**:
  * `id`: Unique identifier (e.g. `'p1'`, `'p2'`, etc.)
  * `name` / `title`: Editorial product title (e.g. *Architectural Cashmere Sweater*, *Monolith Runner GT*)
  * `brand`: Curated luxury house (e.g. *Studio Arc*, *Apex*, *Monolith*, *Volta*)
  * `category`: Department classification (*Apparel*, *Footwear*, *Audio*, *Accessories*)
  * `price`: Numeric value in EUR
  * `formattedPrice`: Display string (e.g. `€ 184.00`)
  * `image`: High-resolution studio photography asset path
  * `tags`: Array of semantic descriptors (`'evening'`, `'milan'`, `'travel'`, `'minimal'`, `'running'`, `'lightweight'`, `'wool'`)
  * `colors`: Available swatch palettes with hex codes
  * `sizes`: Available sizing options (`'S'`, `'M'`, `'L'`, `'XL'`, etc.)
  * `inStock`: Boolean availability status
  * `matchBadge`: Relevance indicator (*"Best Match"*, *"Climate Fit"*, *"Style Match"*)
  * `reasoning`: Natural language explanation of why the product fits the user's intent

### 2.2 Dual-Engine Search Pipeline
1. **Instant Token Matcher (Typeahead)**:
   * Debounced (150ms) prefix and token matcher across titles, brands, categories, and tags.
   * Fuzzy typo tolerance using Levenshtein distance ≤ 2 (e.g. *"swater"* $\rightarrow$ *"sweater"*).
2. **Semantic Intent Extraction (`NexIntentParser`)**:
   * Multidimensional parameter detection from natural queries:
     * **Occasion**: *Evening out, dinner, travel/flight, workout, office/work, lounge*.
     * **Climate & Temperature**: *Cool/winter (15°C–20°C), warm/summer, rainproof, lightweight thermal*.
     * **Location**: *Milan, Paris, Tokyo, Munich, London, New York*.
     * **Budget Constraints**: *Under €200, around €150, luxury/premium*.
     * **Target / Recipient**: *Self, brother, sister, gift*.

---

## 3. UI States & Component Specifications

### 3.1 Modal Header & Search Capsule
* **Command Bar**: Semi-translucent obsidian glass (`rgba(3, 12, 30, 0.92)`, `backdrop-filter: blur(24px)`).
* **Input**: High-contrast typography (`font-family: 'Manrope', 'Inter'`, `20px–24px`), dynamic placeholder rotation, and glowing cyan focus state.
* **Control Cluster**: Sparkle `✦` AI icon on the left, clear input button (`×`) when query is present, `ESC` keyboard badge, and `44×44px` close button.
* **GPU Progress Line**: 120fps `.nex-thinking-track` and `.nex-thinking-bar` with hardware-accelerated `transform: scaleX(0) → scaleX(1)`.

### 3.2 State 1: Idle Screen
* **Recent Searches Rail**:
  * Read from `localStorage` (`nex_recent_searches`).
  * Chip format with clock icon and individual delete (`×`) icon.
  * Right-aligned *"Clear History"* button.
* **Editorial Prompt Suggestions ("Try Asking")**:
  * Quick-tap intent pills with clean Lucide icons:
    * *"Something for a winter evening in Milan"*
    * *"Something comfortable for a long flight"*
    * *"A luxury gift under €200"*
    * *"Minimal everyday sneakers"*
* **Popular Departments**:
  * Quick-jump category pills (*Apparel*, *Footwear*, *Audio*, *Accessories*).

### 3.3 State 2: Live Typeahead & Autocomplete
* Appears dynamically as the user types (after 2 characters).
* Displays a 2-column or structured preview:
  * Left: **Matching Categories & Suggestions** (e.g., `Apparel > Knitwear`).
  * Right: **Top Product Matches** (thumbnail, brand, product title, tabular price).
* Keyboard navigable (`ArrowDown` / `ArrowUp` to highlight, `Enter` to select).

### 3.4 State 3: Semantic Intent Results
* **"Understood As" Parameter Badges**: Cyan pill badges displaying parsed parameters (*Occasion: Evening Out*, *Climate: Cool 18°C*, *Budget: Under €200*).
* **AI Reasoning Narrative**: Clean, concise copy explaining the recommendation rationale.
* **Product Card Grid**:
  * Strict 3-Item Metadata (Brand + Title + Price).
  * 3D spring tilt (`±5°`) + specular glare tracking on hover.
  * Studio photography in 1:1.1 aspect ratio.
  * Primary CTAs: **"Quick Add to Bag"** (tactile ripple + mini-cart drawer trigger) and **"View Product"** (PDP link).
  * **"See Why" Modal Trigger**: Opens structured evidence dialog (warmth rating, fit, material provenance).
* **Conversational Refinements Bar**:
  * One-tap refinement pills (*"Less expensive"*, *"Warmer"*, *"More casual"*, *"Show in my size"*).

### 3.5 State 4: Zero-Results & Typo Recovery
* Friendly, helpful empty state: *"We couldn't find an exact match for '{query}'"*.
* If typo detected: *"Showing results for '{corrected}'"*.
* Quick action pills to explore popular collections.

---

## 4. Keyboard Navigation & Accessibility (WCAG 2.1 AA)
* `Cmd+K` / `Ctrl+K`: Global toggle from any page.
* `ArrowDown` / `ArrowUp`: Seamless item navigation across suggestions and product cards.
* `Enter`: Execute search or open selected product.
* `Esc`: Close search overlay and restore page scroll.
* Semantic ARIA markup: `role="dialog"`, `aria-modal="true"`, `aria-label="Search and Discovery"`.

---

## 5. Integration & Cart Synchronization
* **Mini-Cart Sync**: Clicking "Quick Add" on any search result invokes `nexCart.addItem(...)`, updates the bag count badge, and reveals the mini-cart drawer without page refresh.
* **Path Resolution**: Universal `_resolvePage()` utility to ensure assets and page navigation work seamlessly across both root (`index.html`) and subpages (`pages/*.html`).

---

## 6. Verification Plan
1. **Shortcut & Launch**: Test `Cmd+K`, header search button, and mobile search button across all pages.
2. **Idle State**: Verify recent searches persistence, single item removal, and prompt clicking.
3. **Typeahead**: Test live query typing ("run", "ear", "coat") and verify instant matching suggestions.
4. **Intent Parsing**: Test natural language queries ("winter evening in Milan", "under 200") and verify intent chips + reasoning.
5. **Cart Quick-Add**: Add item from search modal and verify mini-cart drawer opens with correct subtotal.
6. **Keyboard Traversal**: Verify `↑` / `↓` / `Enter` / `Esc` flows.
7. **Mobile & Viewport Scaling**: Verify clean rendering at 375px mobile and 1280px desktop.
