# Comprehensive Luxury Search Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver a unified, ultra-responsive European luxury search engine across the nexCommerce storefront with instant typeahead, recent search management, natural language intent parsing with human-first copywriting, mini-cart direct purchasing, 3D product cards, and full keyboard navigation.

**Architecture:** A unified client-side search engine (`js/search-overlay.js`) combining instant token matching, Levenshtein typo tolerance, and multidimensional intent extraction over a consolidated multi-category catalog database, styled with obsidian glass and 120fps GPU animations in `css/design-system.css`.

**Tech Stack:** Vanilla JavaScript (ES6+), CSS3 Variables / GPU transforms, Lucide Icons, LocalStorage / SessionStorage, and `nexCart` integration.

## Global Constraints
- **Zero AI Jargon Invariant**: Never use words like *"Parsing Intent"*, *"Synthesizing Catalog Intent"*, *"Cadence"*, *"Vector Match"*, *"Curated"*, or *"Atelier Drops"*. Always use clean, human retail language (*"Searching for you..."*, *"Looking across our collection..."*, *"Matching Preferences"*, *"Recommended For You"*).
- **European Luxury Typography**: Headings in `Manrope` / `Inter`, accent styling with `Instrument Serif`, strict tracking, and tabular figures for all pricing.
- **Strict 3-Item Product Metadata**: Product cards display strictly Brand / House + Title + Price.
- **Motion Standards**: 120fps GPU thinking progress line (`transform: scaleX(0) → scaleX(1)`), 3D spring tilt (`±5°`) with specular glare tracking, tactile quick-add ripple, and page transition curtain.
- **Universal Path Resolution**: Dynamic relative path handling (`_resolvePage()`) so search links work identically on `index.html` and `pages/*.html`.

---

### Task 1: Consolidate Unified Product Catalog & Search Data Model

**Files:**
- Modify: `js/search-overlay.js`

**Interfaces:**
- Produces: `NexSearchCatalog` array containing complete product dataset with standard fields (`id`, `name`, `brand`, `category`, `price`, `formattedPrice`, `image`, `tags`, `colors`, `sizes`, `inStock`, `matchBadge`, `reasoning`, `specs`).

- [ ] **Step 1: Write the catalog database and data normalization helpers in `js/search-overlay.js`**
- [ ] **Step 2: Verify catalog covers all store categories (Apparel, Footwear, Audio, Accessories)**
- [ ] **Step 3: Commit catalog updates**

```bash
git add js/search-overlay.js
git commit -m "feat(search): define unified multi-category catalog database"
```

---

### Task 2: Implement Instant Typeahead, Fuzzy Matcher & Human-First Intent Engine

**Files:**
- Modify: `js/search-overlay.js`

**Interfaces:**
- Produces:
  - `NexSearchEngine.typeahead(query)`: Returns `{ matchingCategories: [], matchingProducts: [] }`
  - `NexSearchEngine.parseIntent(query)`: Returns `{ occasion, climate, location, budget, recipient, raw }`
  - `NexSearchEngine.search(intentOrQuery)`: Returns filtered & scored products + match explanations
  - `NexSearchEngine.fuzzySuggest(query)`: Suggests corrected spelling for typos

- [ ] **Step 1: Implement debounced typeahead matcher (150ms debounce) with token scoring**
- [ ] **Step 2: Implement Levenshtein-based fuzzy typo detector (distance <= 2)**
- [ ] **Step 3: Implement multidimensional intent parser with strictly human-first terminology**
- [ ] **Step 4: Commit search engine core**

```bash
git add js/search-overlay.js
git commit -m "feat(search): implement instant typeahead, fuzzy matching, and human-first intent parser"
```

---

### Task 3: Build Modal Lifecycle Controller & Screen State Renderers

**Files:**
- Modify: `js/search-overlay.js`

**Interfaces:**
- Produces:
  - `renderIdleState()`: Recent searches + "Try Asking" editorial prompt pills + Department badges
  - `renderTypeaheadState(results)`: Live matching categories + top product cards
  - `renderProcessingState(intent)`: 120fps GPU progress bar + "Searching for you..." status
  - `renderResultsState(query, intent, results)`: Match parameter badges + reasoning box + 3D cards + Refinement chips
  - `renderNoResultsState(query, suggestion)`: Friendly empty recovery with popular collections
  - `renderWhyMatchesModal(productId)`: Structured evidence popover

- [ ] **Step 1: Implement recent searches manager with LocalStorage (add query, delete single item, clear all)**
- [ ] **Step 2: Implement idle state rendering with prompt chips and category filters**
- [ ] **Step 3: Implement live typeahead dropdown rendering**
- [ ] **Step 4: Implement semantic results rendering with 3D spring tilt, reasoning card, and refinement pills**
- [ ] **Step 5: Implement zero-results and typo fallback rendering**
- [ ] **Step 6: Commit state renderers**

```bash
git add js/search-overlay.js
git commit -m "feat(search): implement modal state renderers and recent searches manager"
```

---

### Task 4: Implement Keyboard Traversal, Cart Quick-Add & Navigation Synchronization

**Files:**
- Modify: `js/search-overlay.js`

**Interfaces:**
- Produces:
  - Global `Cmd+K` / `Ctrl+K` listener and `Escape` dismiss
  - `ArrowDown` / `ArrowUp` active element focus traversal
  - "Quick Add" trigger syncing directly with `window.nexCart.addItem()` and opening mini-cart drawer
  - `_resolvePage()` universal path helper

- [ ] **Step 1: Implement arrow key selection (`ArrowDown`/`ArrowUp`/`Enter`) across suggestions and products**
- [ ] **Step 2: Wire up "Quick Add" button to call `nexCart.addItem()` with visual ripple feedback**
- [ ] **Step 3: Save search query context to `sessionStorage` on PDP navigation**
- [ ] **Step 4: Commit keyboard and cart integration**

```bash
git add js/search-overlay.js
git commit -m "feat(search): add keyboard traversal, cart quick-add, and session context retention"
```

---

### Task 5: Elevate Search Styles in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css`

**Interfaces:**
- Produces:
  - Polished obsidian search panel with 24px backdrop blur and sharp border
  - High-contrast search input with glowing cyan focus ring
  - Clean tag rails for recent searches and editorial prompt chips
  - Responsive product card grid with 3D perspective and specular glare
  - Conversational refinement pills and evidence modal styles
  - Responsive adjustments for mobile (`≤768px`) and compact viewport heights

- [ ] **Step 1: Refactor and enhance search overlay styles in `css/design-system.css`**
- [ ] **Step 2: Add styles for recent search delete buttons, typeahead dropdown, and refinement pills**
- [ ] **Step 3: Ensure strict mobile responsive styling at 375px and compact height viewports**
- [ ] **Step 4: Commit CSS updates**

```bash
git add css/design-system.css
git commit -m "style(search): elevate search modal styling with luxury obsidian glass and responsive typography"
```

---

### Task 6: Verify HTML Integration Across Storefront Pages

**Files:**
- Verify/Update: `index.html`, `pages/category.html`, `pages/product.html`, `pages/smart-list.html`, `pages/discovery.html`, `pages/cart.html`

- [ ] **Step 1: Ensure `#aiSearchModal` markup and `js/search-overlay.js` script tags are synchronized across all pages**
- [ ] **Step 2: Verify trigger buttons (`.nav-search-trigger`, `#searchTriggerBtn`, `[data-open-search]`) function consistently**
- [ ] **Step 3: Commit markup synchronization if any changes made**

```bash
git add index.html pages/*.html
git commit -m "fix(search): synchronize search overlay modal and script tags across all pages"
```

---

### Task 7: End-to-End Verification with Browser Subagent

**Files:**
- Test via Playwright / Chrome DevTools

- [ ] **Step 1: Open search modal via `Cmd+K` and header search trigger**
- [ ] **Step 2: Test Idle State: click prompt chips, test recent search removal and "Clear All"**
- [ ] **Step 3: Test Typeahead: type "cashmere" or "runner", verify instant category & product preview**
- [ ] **Step 4: Test Semantic Search: run "Something for a winter evening in Milan", verify intent chips & reasoning**
- [ ] **Step 5: Test Quick Add: add product to bag, verify mini-cart drawer opens with correct subtotal**
- [ ] **Step 6: Test Keyboard Navigation: navigate with Arrow keys, press Enter, press Escape to close**
- [ ] **Step 7: Verify responsive behavior on mobile (375px)**
