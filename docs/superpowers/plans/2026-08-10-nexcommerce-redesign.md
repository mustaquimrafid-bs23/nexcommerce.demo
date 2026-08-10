# nexCommerce Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform nexCommerce into a world-class luxury e-commerce experience featuring a dark obsidian base (`#0b0b0e`), warm stone storytelling breaks (`#f4f2ee`), warm ivory CTAs, resilient search/cart flows, and WCAG 2.1 AA accessibility.

**Architecture:** Modular vanilla JS architecture with decoupled layers: Brand Experience, Discovery, Commerce, and Intelligence. CSS design system with custom properties for color themes, typography, and responsive spacing.

**Tech Stack:** HTML5, CSS3 (Vanilla design system with tokens), JavaScript ES6+ (Vanilla modules), HTML LocalStorage for client cart persistence.

## Global Constraints

- Base obsidian background: `#0b0b0e`
- Primary CTA background: Warm Ivory `#f4f4f6` with `#0b0b0e` text
- Focal Gold accent: Champagne Sand `#c8b295` (reserved for selected states and badges)
- Mandatory font pairing: `Cormorant Garamond` (editorial serif) and `Inter` (UI grotesque)
- Minimum touch target for mobile actions: 48×48px
- Mandatory AI boundary: All core commerce functions must remain operational without AI services
- Accessibility: All normal text combinations must meet WCAG 2.1 AA contrast requirements

---

### Task 1: CSS Foundation & Luxury Design System Tokens

**Files:**
- Create: `css/design-system.css`
- Modify: `index.html:1-30`, `category.html:1-30`, `product.html:1-30`

**Interfaces:**
- Consumes: Google Fonts (`Cormorant Garamond`, `Inter`)
- Produces: CSS Variables (`--bg-base`, `--bg-surface`, `--bg-warm-stone`, `--cta-primary`, `--accent-gold`, `--text-primary`, `--font-serif`, `--font-body`, `--ease-luxury`)

- [ ] **Step 1: Create `css/design-system.css` with exact design tokens**

```css
/* nexCommerce Luxury Design System Tokens */
:root {
  --bg-base:          #0b0b0e;
  --bg-surface:       #141418;
  --bg-card:          #1b1b22;
  --bg-warm-stone:    #f4f2ee;
  
  --text-primary:     #f5f5f7;
  --text-secondary:   #a1a1aa;
  --text-muted:       #71717a;
  --text-dark:        #121212;

  --cta-primary:      #f4f4f6;
  --cta-primary-text: #0b0b0e;
  --accent-gold:      #c8b295;
  --accent-gold-soft: rgba(200, 178, 149, 0.15);

  --border-subtle:    rgba(255, 255, 255, 0.08);
  --border-warm:      rgba(0, 0, 0, 0.12);

  --font-serif:       'Cormorant Garamond', Georgia, serif;
  --font-body:        'Inter', system-ui, -apple-system, sans-serif;

  --ease-luxury:      cubic-bezier(0.25, 1, 0.5, 1);
  --space-section:    110px;
  --touch-target-min: 48px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: var(--bg-base);
  color: var(--text-primary);
  font-family: var(--font-body);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}
.btn-primary {
  min-height: var(--touch-target-min);
  padding: 14px 32px;
  background: var(--cta-primary);
  color: var(--cta-primary-text);
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  border: none;
  cursor: pointer;
  transition: opacity 200ms var(--ease-luxury);
}
.btn-primary:hover { opacity: 0.9; }
```

- [ ] **Step 2: Link `css/design-system.css` in HTML headers**

Verify `<link rel="stylesheet" href="css/design-system.css">` is present in `index.html`, `category.html`, and `product.html`.

- [ ] **Step 3: Test design tokens in browser**

Run local static server or verify stylesheet loading.
Expected: Custom CSS variables active, background `#0b0b0e` applied.

- [ ] **Step 4: Commit design system CSS**

```bash
git add css/design-system.css index.html category.html product.html
git commit -m "style: establish nexCommerce luxury design system tokens"
```

---

### Task 2: Minimal Glass Header & Responsive Navigation

**Files:**
- Create: `js/header.js`
- Modify: `index.html`, `category.html`, `product.html`

**Interfaces:**
- Consumes: Cart count from `js/cart.js`
- Produces: Header DOM structure with sticky glass backdrop blur, mobile drawer trigger, scroll-quieting logic.

- [ ] **Step 1: Create `js/header.js` script with scroll quieting and mobile toggle**

```javascript
export function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  const mobileToggle = document.getElementById('mobile-menu-toggle');
  const mobileDrawer = document.getElementById('mobile-nav-drawer');
  
  if (mobileToggle && mobileDrawer) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });
  }
}
```

- [ ] **Step 2: Insert standardized Header markup into `index.html`**

```html
<header id="site-header" class="site-header">
  <div class="container nav-inner">
    <nav class="nav-left desktop-only">
      <a href="index.html" class="nav-link">Shop</a>
      <a href="category.html" class="nav-link">Collections</a>
      <a href="lookbook.html" class="nav-link">Stories</a>
    </nav>
    <a href="index.html" class="nav-logo">nexCommerce</a>
    <div class="nav-right">
      <button id="search-trigger" class="nav-action-btn" aria-label="Open search">Search</button>
      <a href="#" class="nav-action-btn desktop-only">Account</a>
      <button id="bag-trigger" class="nav-action-btn" aria-label="Open shopping bag">
        Bag (<span id="bag-count">0</span>)
      </button>
      <button id="mobile-menu-toggle" class="mobile-only" aria-label="Toggle navigation menu">☰</button>
    </div>
  </div>
</header>
```

- [ ] **Step 3: Verify header scroll behavior**

Verify header gains `.scrolled` class on scroll and logo centers cleanly.

- [ ] **Step 4: Commit header module**

```bash
git add js/header.js index.html
git commit -m "feat: implement minimal glass header and responsive navigation"
```

---

### Task 3: Reusable Component System (`ProductCard` & `TrustSignal`)

**Files:**
- Create: `js/components.js`
- Test: Manual browser check on `index.html` product grid

**Interfaces:**
- Consumes: Product objects `{ id, name, price, category, image, secondaryImage, tag }`
- Produces: `renderProductCard(product)`, `renderTrustSignals()`

- [ ] **Step 1: Write `js/components.js` with `renderProductCard` and `renderTrustSignals`**

```javascript
export function renderProductCard(product) {
  const badgeHtml = product.tag 
    ? `<span class="product-badge">${product.tag}</span>` 
    : '';

  return `
    <article class="product-card" data-id="${product.id}">
      <div class="product-image-container">
        ${badgeHtml}
        <a href="product.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" class="product-img primary" loading="lazy">
          ${product.secondaryImage ? `<img src="${product.secondaryImage}" alt="${product.name}" class="product-img secondary" loading="lazy">` : ''}
        </a>
        <button class="quick-view-btn" data-action="quick-view" data-id="${product.id}">Quick View</button>
      </div>
      <div class="product-info">
        <h3 class="product-title"><a href="product.html?id=${product.id}">${product.name}</a></h3>
        <p class="product-price">৳ ${product.price.toLocaleString()}</p>
      </div>
    </article>
  `;
}

export function renderTrustSignals() {
  return `
    <div class="trust-signals-container">
      <div class="trust-item"><span class="trust-icon">✓</span> 30-Day Complimentary Returns</div>
      <div class="trust-item"><span class="trust-icon">✓</span> Encrypted SSL Checkout</div>
      <div class="trust-item"><span class="trust-icon">✓</span> Guaranteed Authentic</div>
    </div>
  `;
}
```

- [ ] **Step 2: Add CSS rules for `.product-card` and `.trust-signals-container` to `css/design-system.css`**

Ensure 48px touch target for quick-view button, smooth luxury image zoom on hover.

- [ ] **Step 3: Commit component renderer**

```bash
git add js/components.js css/design-system.css
git commit -m "feat: add reusable ProductCard and TrustSignal components"
```

---

### Task 4: Homepage Redesign (Alternating Theme Rhythm)

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `renderProductCard`, `renderTrustSignals` from `js/components.js`
- Produces: Homepage DOM containing Hero, Curated Grid, Warm Stone Storytelling Break, Intelligent Assistance Bar, Footer.

- [ ] **Step 1: Update `index.html` structure with alternating section rhythm**

Structure sections:
1. `#hero` (Dark Obsidian `#0b0b0e`, Human lifestyle visual, Garamond headline *"Move Without Limits."*)
2. `#curated-grid` (Dark Obsidian `#0b0b0e`, 4-column responsive grid)
3. `#story-section` (Warm Stone `#f4f2ee`, Charcoal text, dual lifestyle photos)
4. `#personalized-bar` (Dark Surface `#141418`, *"Curated for you"* ambient chips)
5. `#site-footer` (Dark Obsidian `#0b0b0e`)

- [ ] **Step 2: Verify visual contrast and responsive reflow**

Check contrast ratio for text in Warm Stone break and Obsidian sections.

- [ ] **Step 3: Commit homepage redesign**

```bash
git add index.html
git commit -m "feat: complete homepage redesign with alternating theme rhythm"
```

---

### Task 5: Interactive Shopping Bag Drawer (`SlideOverDrawer`) & Cart State

**Files:**
- Create: `js/cart.js`
- Modify: `index.html`, `category.html`, `product.html`

**Interfaces:**
- Consumes: `localStorage.getItem('nex_cart')`
- Produces: Cart state manager `CartState`, drawer toggle UI, shipping progress bar calculation, SKU merging helper.

- [ ] **Step 1: Create `js/cart.js` state manager**

```javascript
export const CartState = {
  items: JSON.parse(localStorage.getItem('nex_cart') || '[]'),

  save() {
    localStorage.setItem('nex_cart', JSON.stringify(this.items));
    this.updateUI();
  },

  addItem(product, quantity = 1, variant = 'Default') {
    const existing = this.items.find(i => i.id === product.id && i.variant === variant);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({ ...product, quantity, variant });
    }
    this.save();
  },

  updateQuantity(id, variant, delta) {
    const item = this.items.find(i => i.id === id && i.variant === variant);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter(i => !(i.id === id && i.variant === variant));
    }
    this.save();
  },

  getTotal() {
    return this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  },

  updateUI() {
    const countEl = document.getElementById('bag-count');
    if (countEl) {
      const totalCount = this.items.reduce((sum, i) => sum + i.quantity, 0);
      countEl.textContent = totalCount;
    }
    this.renderDrawerContents();
  },

  renderDrawerContents() {
    const listContainer = document.getElementById('cart-drawer-items');
    if (!listContainer) return;
    if (this.items.length === 0) {
      listContainer.innerHTML = `
        <div class="cart-empty-state">
          <p>Your bag is waiting.</p>
          <p class="subtext">Discover something you'll love.</p>
        </div>
      `;
      return;
    }
    listContainer.innerHTML = this.items.map(item => `
      <div class="cart-item-row">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <h4>${item.name}</h4>
          <p class="variant">Size: ${item.variant}</p>
          <p class="price">৳ ${item.price.toLocaleString()}</p>
          <div class="cart-stepper">
            <button onclick="window.nexCart.updateQuantity('${item.id}', '${item.variant}', -1)" aria-label="Decrease quantity">-</button>
            <span>${item.quantity}</span>
            <button onclick="window.nexCart.updateQuantity('${item.id}', '${item.variant}', 1)" aria-label="Increase quantity">+</button>
          </div>
        </div>
      </div>
    `).join('');
  }
};
```

- [ ] **Step 2: Add Cart Drawer HTML modal markup to layout**
- [ ] **Step 3: Verify cart addition and localStorage persistence**
- [ ] **Step 4: Commit cart module**

```bash
git add js/cart.js
git commit -m "feat: add slide-over cart drawer with persistent local state"
```

---

### Task 6: Natural Language Search Overlay (`SmartSearch` with Resilient Fallback)

**Files:**
- Create: `js/search.js`
- Modify: `index.html`, `category.html`, `product.html`

**Interfaces:**
- Consumes: Keydown events (`Ctrl/Cmd + K`), search input text
- Produces: `SmartSearch.open()`, `SmartSearch.query(text)`

- [ ] **Step 1: Create `js/search.js` search overlay controller**

```javascript
export const SmartSearch = {
  init() {
    const trigger = document.getElementById('search-trigger');
    if (trigger) {
      trigger.addEventListener('click', () => this.open());
    }
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        this.open();
      }
      if (e.key === 'Escape') {
        this.close();
      }
    });
  },

  open() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) {
      overlay.classList.add('active');
      const input = document.getElementById('search-input');
      if (input) input.focus();
    }
  },

  close() {
    const overlay = document.getElementById('search-overlay');
    if (overlay) overlay.classList.remove('active');
  }
};
```

- [ ] **Step 2: Add resilient search execution logic (AI semantic search with automatic standard keyword fallback)**
- [ ] **Step 3: Commit search module**

```bash
git add js/search.js
git commit -m "feat: implement SmartSearch overlay with keyboard triggers and fallback pipeline"
```

---

### Task 7: Product Listing Page (PLP) & Mobile Bottom-Sheet Filters

**Files:**
- Modify: `category.html`, `js/category.js`

**Interfaces:**
- Consumes: Product catalog dataset
- Produces: Filtered product grid, progressive filter panel, mobile bottom-sheet filter drawer.

- [ ] **Step 1: Refactor `category.html` layout to match frozen spec**

Top header: Category Title → Product Count → Progressive `Filters` Button → `Sort` Selector.

- [ ] **Step 2: Add mobile 2-column grid styling and bottom-sheet filter drawer**

- [ ] **Step 3: Test filter application and scroll preservation**

- [ ] **Step 4: Commit PLP changes**

```bash
git add category.html js/category.js
git commit -m "feat: refactor PLP with progressive filter panel and mobile bottom-sheet"
```

---

### Task 8: Product Detail Page (PDP) & `FitAdvisor` Assistance

**Files:**
- Modify: `product.html`, `js/pdp.js`

**Interfaces:**
- Consumes: `CartState.addItem`
- Produces: 60/40 Split gallery/buy box, size fit popup modal, async `Add to Bag` confirmation, Mobile sticky purchase bar.

- [ ] **Step 1: Update `product.html` layout with visual hierarchy and dominant Warm Ivory `Add to Bag` button**
- [ ] **Step 2: Implement async `Adding...` → `✓ Added to Bag` button guard**
- [ ] **Step 3: Implement `FitAdvisor` 1-question fit assistance modal**
- [ ] **Step 4: Add Mobile PDP Sticky Purchase Bar (`< 768px`) with reserved bottom padding**
- [ ] **Step 5: Commit PDP improvements**

```bash
git add product.html js/pdp.js
git commit -m "feat: complete PDP redesign with FitAdvisor and mobile sticky purchase bar"
```

---

### Task 9: Verification, WCAG Contrast Audit & Cross-Page Testing

**Files:**
- All HTML/CSS/JS files

**Interfaces:**
- Automated & Manual Browser Verification

- [ ] **Step 1: Run contrast verification across dark and light sections**
- [ ] **Step 2: Test keyboard navigation (`Tab`, `Shift+Tab`, `ESC` close on modals)**
- [ ] **Step 3: Test mobile viewport responsiveness at 375px, 768px, and 1440px**
- [ ] **Step 4: Commit final verifications**

```bash
git add .
git commit -m "chore: complete nexCommerce redesign verification and accessibility polish"
```

---

## Execution Choice Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-10-nexcommerce-redesign.md`.

Two execution options:

**1. Subagent-Driven (recommended)** - I dispatch a fresh subagent per task, review between tasks, fast iteration
**2. Inline Execution** - Execute tasks in this session using executing-plans, batch execution with checkpoints

Which approach would you like to use?
