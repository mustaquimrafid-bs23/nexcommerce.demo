# Smart List Comprehensive Luxury Replenishment Suite Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a visual-first, text-minimalist, European luxury replenishment experience in `pages/smart-list.html` featuring a centralized reactive state store (`SmartListStore`), ambient in-card bulk selection, tactile inline finish/size micro-pills, a floating obsidian batch dock, and an architectural Quick Look slide-over drawer adhering strictly to the Modernist Design System and European Luxury Typography standards.

**Architecture:** Approach A — Unified Modular Architecture with Centralized State Store. Data model contains full variant definitions (sizes, metallic finishes, price deltas, and stock counters). The state store manages selections, variant mutations, and modal drawer states, broadcasting updates with zero layout shift and 120fps GPU animations.

**Tech Stack:** HTML5, Modernist CSS Tokens (`css/design-system.css`), Vanilla JavaScript (ES6+), Playwright for automated browser verification.

## Global Constraints

- **Master Typography**: Primary Display in `Neue Haas Grotesk`/`Manrope`, UI & Body in `Inter`, limited accent in `Instrument Serif`. Zero AI/sci-fi fonts (`Orbitron`, `Audiowide`, `Exo 2`, etc.). Full Latin Extended European glyph coverage (`subset=latin,latin-ext`).
- **Modernist Discipline**: 75%+ visual ratio for product cards, 2px–6px restrained corner radii, hairline borders (`1px solid rgba(255,255,255,0.09)`), quiet editorial metadata (strict 3-item line: Brand + Name + Price).
- **Usability & Accessibility**: WCAG 2.1 AA compliance (contrast ≥ 4.5:1, keyboard `Space`/`Enter`/`Escape` navigation, focus traps, touch targets ≥ 44×44px).
- **Responsive Standard**: Flawless reflow across Desktop (`1440px`), Laptop/Compact (`1280×585`), Tablet (`768px`), and Mobile (`375px`).

---

### Task 1: Core State Architecture (`SmartListStore`) & Enhanced Product Catalog Data Model

**Files:**
- Modify: `pages/smart-list.html:800-1100`

**Interfaces:**
- Consumes: Existing smart-list product array and global cart/wishlist utilities (`localStorage`).
- Produces: `window.SmartListStore` state store exposing `items`, `selectedIds`, `activeVariants`, `toggleSelect(id)`, `selectAll()`, `deselectAll()`, `setVariant(id, { finishId, sizeId })`, `getAggregateMetrics()`.

- [ ] **Step 1: Define Enhanced Product Catalog with Metallic Finishes and Sizes**
Add variant configurations (metallic finishes with hex colors and price deltas, sizes with stock states) to each product in `smartListItems`:
```javascript
const smartListItems = [
  {
    id: 'sl-aurora-earrings',
    name: 'Aurora Diamond Huggie Earrings',
    brand: 'nexCommerce Atelier',
    category: 'Watches',
    basePrice: 1850,
    stockStatus: 'in_stock',
    stockCount: 4,
    cadenceDays: 45,
    description: 'Handcrafted in 18k recycled gold with VS clarity pavé diamonds.',
    materials: '18k Solid Gold, VS Diamonds (0.42 ctw)',
    origin: 'Handcrafted in Milan',
    image: '../assets/products/aurora_earrings_hero.png',
    gallery: [
      '../assets/products/aurora_earrings_hero.png',
      '../assets/products/aurora_earrings_detail.png',
      '../assets/products/aurora_earrings_lifestyle.png'
    ],
    variants: {
      finishes: [
        { id: 'yg', name: '18k Yellow Gold', color: '#D4AF37', priceDelta: 0 },
        { id: 'wg', name: '18k White Gold', color: '#E5E4E2', priceDelta: 50 },
        { id: 'rg', name: '18k Rose Gold', color: '#B76E79', priceDelta: 0 }
      ],
      sizes: [
        { id: '10mm', name: '10mm', inStock: true },
        { id: '12mm', name: '12mm', inStock: true, default: true },
        { id: '14mm', name: '14mm', inStock: false }
      ]
    },
    selectedFinish: 'yg',
    selectedSize: '12mm',
    quantity: 1
  },
  // ... enhance all 12 items similarly
];
```

- [ ] **Step 2: Implement Reactive `SmartListStore` Controller**
Write the centralized store with listener broadcasting:
```javascript
class SmartListStore {
  constructor(initialItems) {
    this.items = new Map(initialItems.map(item => [item.id, { ...item }]));
    this.selectedIds = new Set();
    this.activeFilter = 'all';
    this.quickLookId = null;
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(event) {
    this.listeners.forEach(fn => fn(event, this));
  }

  toggleSelect(id) {
    if (this.selectedIds.has(id)) {
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    this.notify({ type: 'SELECTION_CHANGE' });
  }

  selectAll() {
    const visible = this.getVisibleItems();
    visible.forEach(item => this.selectedIds.add(item.id));
    this.notify({ type: 'SELECTION_CHANGE' });
  }

  deselectAll() {
    this.selectedIds.clear();
    this.notify({ type: 'SELECTION_CHANGE' });
  }

  setVariant(id, { finishId, sizeId }) {
    const item = this.items.get(id);
    if (!item) return;
    if (finishId) item.selectedFinish = finishId;
    if (sizeId) item.selectedSize = sizeId;
    this.notify({ type: 'VARIANT_CHANGE', id, item });
  }

  getItemPrice(id) {
    const item = this.items.get(id);
    if (!item) return 0;
    const finish = item.variants?.finishes?.find(f => f.id === item.selectedFinish);
    const delta = finish ? (finish.priceDelta || 0) : 0;
    return item.basePrice + delta;
  }

  getAggregateMetrics() {
    let totalValue = 0;
    let selectedValue = 0;
    this.items.forEach((item, id) => {
      const price = this.getItemPrice(id);
      totalValue += price * (item.quantity || 1);
      if (this.selectedIds.has(id)) {
        selectedValue += price * (item.quantity || 1);
      }
    });
    return {
      totalCount: this.items.size,
      totalValue,
      selectedCount: this.selectedIds.size,
      selectedValue
    };
  }

  getVisibleItems() {
    return Array.from(this.items.values()).filter(item => {
      if (this.activeFilter === 'all') return true;
      return item.category.toLowerCase().replace(/\s+/g, '-') === this.activeFilter.toLowerCase();
    });
  }
}
window.smartListStore = new SmartListStore(smartListItems);
```

- [ ] **Step 3: Verify State Engine via Playwright or Browser Console**
Execute test checking store initialization and calculations:
```javascript
const store = window.smartListStore;
console.assert(store.items.size === 12, 'Items loaded');
store.selectAll();
console.assert(store.selectedIds.size === 12, 'Select all works');
store.deselectAll();
console.assert(store.selectedIds.size === 0, 'Deselect all works');
```

- [ ] **Step 4: Commit Task 1**
```bash
git add pages/smart-list.html
git commit -m "feat(smart-list): T1 — centralized SmartListStore and enhanced product variant data model"
```

---

### Task 2: In-Card Ambient Selection Rings & Multi-Select Mechanics

**Files:**
- Modify: `pages/smart-list.html:500-800` (CSS) and `pages/smart-list.html:1100-1350` (DOM rendering)

**Interfaces:**
- Consumes: `window.smartListStore.selectedIds`
- Produces: Visual selection rings on cards, card active borders, and toolbar "Select All" button state.

- [ ] **Step 1: Add Ambient Selection Ring CSS & Card Elevation**
```css
/* Ambient Selection Ring */
.sl-card-select-btn {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(5, 12, 26, 0.82);
  border: 1px solid rgba(255, 255, 255, 0.20);
  color: #030814;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 12;
  backdrop-filter: blur(8px);
  transition: all 180ms cubic-bezier(0.16, 1, 0.3, 1);
}
.sl-card-select-btn:hover {
  border-color: var(--accent-cyan, #3DE0FF);
  background: rgba(61, 224, 255, 0.15);
}
.sl-card-select-btn.selected {
  background: var(--accent-cyan, #3DE0FF);
  border-color: var(--accent-cyan, #3DE0FF);
  color: #030814;
  box-shadow: 0 0 12px rgba(61, 224, 255, 0.5);
}
.sl-card.is-selected {
  border-color: rgba(61, 224, 255, 0.45);
  box-shadow: 0 0 0 1px rgba(61, 224, 255, 0.30), 0 16px 40px rgba(0, 0, 0, 0.6);
}
```

- [ ] **Step 2: Render Selection Ring on Every Product Card**
Update `renderProductCard(item)` to include the selection ring button with appropriate `aria-checked` attributes.

- [ ] **Step 3: Connect Card Selection & Toolbar "Select All" Toggle**
Wire up click event listeners on `.sl-card-select-btn` and `#btnSelectAllToggle` in `.sl-toolbar`:
```javascript
btnSelectAllToggle.addEventListener('click', () => {
  if (smartListStore.selectedIds.size === smartListStore.getVisibleItems().length) {
    smartListStore.deselectAll();
  } else {
    smartListStore.selectAll();
  }
});
```

- [ ] **Step 4: Verify Selection Flow in Browser**
Verify clicking card rings toggles selection, highlights cards, and updates toolbar button state.

- [ ] **Step 5: Commit Task 2**
```bash
git add pages/smart-list.html
git commit -m "feat(smart-list): T2 — in-card ambient selection rings and toolbar select-all toggle"
```

---

### Task 3: Inline Metallic Finish Swatches & Geometric Size Micro-Pills

**Files:**
- Modify: `pages/smart-list.html:600-900` (CSS) and `pages/smart-list.html:1200-1400` (Card template & interactions)

**Interfaces:**
- Consumes: `item.variants.finishes`, `item.variants.sizes`
- Produces: In-card swatch & size selector rendering, live price updates, stock beacon updates.

- [ ] **Step 1: Style Tactile Finish Swatches & Size Blocks**
```css
/* Inline Finish Swatches */
.sl-swatches-strip {
  display: flex;
  align-items: center;
  gap: 6px;
  margin: 6px 0 4px;
}
.sl-swatch-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: pointer;
  position: relative;
  transition: transform 150ms ease, box-shadow 150ms ease;
}
.sl-swatch-dot:hover { transform: scale(1.15); }
.sl-swatch-dot.active {
  box-shadow: 0 0 0 2px #080E1E, 0 0 0 3.5px var(--accent-cyan, #3DE0FF);
  transform: scale(1.1);
}

/* Geometric Size Micro-Pills */
.sl-sizes-strip {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 4px;
}
.sl-size-btn {
  min-width: 24px;
  height: 22px;
  padding: 0 5px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 2px;
  color: rgba(255, 255, 255, 0.7);
  font-family: 'Inter', sans-serif;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 150ms ease;
}
.sl-size-btn:hover:not(:disabled) {
  border-color: rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
}
.sl-size-btn.active {
  background: #FFFFFF;
  border-color: #FFFFFF;
  color: #030814;
}
.sl-size-btn:disabled {
  opacity: 0.3;
  text-decoration: line-through;
  cursor: not-allowed;
}

/* Stock Beacon Indicator */
.sl-stock-beacon {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 10.5px;
  font-weight: 500;
  color: var(--text-secondary, #94A3B8);
  margin-top: 2px;
}
.sl-stock-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #34D399; /* Green */
}
.sl-stock-dot.low { background: #FBBF24; } /* Amber */
.sl-stock-dot.sold-out { background: #64748B; } /* Muted */
```

- [ ] **Step 2: Render Swatches & Size Pills inside Card Body & Quick Add Overlay**
Inject dynamic swatch and size buttons into each card template.

- [ ] **Step 3: Wire Event Delegation for Variant Switching**
Handle swatch and size clicks, invoking `smartListStore.setVariant(id, { finishId, sizeId })`, updating displayed price and stock beacon smoothly.

- [ ] **Step 4: Verify Variant Switching Behavior**
Test in browser: clicking a gold/silver swatch or S/M/L size instantly recalculates price without layout shift.

- [ ] **Step 5: Commit Task 3**
```bash
git add pages/smart-list.html
git commit -m "feat(smart-list): T3 — inline metallic finish swatches and geometric size micro-pills"
```

---

### Task 4: Floating Visual Batch Dock (Obsidian Island)

**Files:**
- Modify: `pages/smart-list.html:700-1000` (CSS) and `pages/smart-list.html:1400-1600` (HTML & Logic)

**Interfaces:**
- Consumes: `smartListStore.getAggregateMetrics()`, `smartListStore.selectedIds`
- Produces: Floating obsidian bar at viewport bottom, batch "Add Selected to Bag" and "Move to Wishlist" actions.

- [ ] **Step 1: Style the Floating Batch Dock**
```css
/* Floating Obsidian Batch Dock */
.sl-batch-dock-container {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%) translateY(140%);
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 18px;
  background: rgba(8, 14, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 9999px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease;
  opacity: 0;
  pointer-events: none;
}
.sl-batch-dock-container.visible {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
  pointer-events: auto;
}
.sl-batch-metrics {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Manrope', sans-serif;
  font-size: 13px;
  color: #FFFFFF;
}
.sl-batch-total {
  font-weight: 700;
  color: var(--accent-cyan, #3DE0FF);
}
.sl-btn-batch-add {
  height: 38px;
  padding: 0 18px;
  background: #FFFFFF;
  color: #030814;
  border: none;
  border-radius: 9999px;
  font-family: 'Inter', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  transition: transform 150ms ease, opacity 150ms ease;
  display: flex;
  align-items: center;
  gap: 6px;
}
.sl-btn-batch-add:hover { opacity: 0.92; transform: scale(1.02); }
.sl-btn-batch-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-secondary, #94A3B8);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 150ms ease;
}
.sl-btn-batch-icon:hover { color: #FFFFFF; background: rgba(255, 255, 255, 0.12); }
```

- [ ] **Step 2: Add Batch Dock Markup & Dynamic Listener**
Add `<aside id="slBatchDock" class="sl-batch-dock-container">` to `smart-list.html`. Subscribe to `SmartListStore`: when `selectedIds.size > 0`, calculate total selected value, update count label, and add `.visible`.

- [ ] **Step 3: Implement Batch Cart Addition & Wishlist Actions**
Wire up `Add Selected to Bag`:
1. Loop through all `selectedIds`.
2. Push each item with its active variant into `localStorage.getItem('cart')`.
3. Dispatch global `cartUpdated` event to trigger header bag badge bounce.
4. Show confirmation toast: *"N Atelier items added to your bag."*
5. Deselect all items and slide dock away.

- [ ] **Step 4: Verify Batch Dock Functionality in Browser**
Select 3 items, verify dock slides up smoothly with correct combined price, click "Add Selected to Bag", verify cart is updated.

- [ ] **Step 5: Commit Task 4**
```bash
git add pages/smart-list.html
git commit -m "feat(smart-list): T4 — floating obsidian batch dock with instant aggregate cart injection"
```

---

### Task 5: Modernist Quick Look Slide-Over Drawer

**Files:**
- Modify: `pages/smart-list.html:900-1200` (CSS) and `pages/smart-list.html:1600-1850` (Drawer template & logic)

**Interfaces:**
- Consumes: `smartListStore.openQuickLook(id)`
- Produces: Modal slide-over drawer (`520px` desktop / bottom sheet mobile), 3-asset gallery switcher, spec accordion, direct bag add.

- [ ] **Step 1: Style the Modernist Slide-Over Drawer**
```css
/* Quick Look Backdrop & Drawer */
.sl-drawer-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 8, 20, 0.78);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 200;
  opacity: 0;
  pointer-events: none;
  transition: opacity 280ms ease;
}
.sl-drawer-backdrop.open {
  opacity: 1;
  pointer-events: auto;
}
.sl-drawer-panel {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 520px;
  max-width: 100vw;
  background: #080E1E;
  border-left: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.8);
  z-index: 201;
  transform: translateX(100%);
  transition: transform 340ms cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.sl-drawer-backdrop.open .sl-drawer-panel {
  transform: translateX(0);
}
@media (max-width: 768px) {
  .sl-drawer-panel {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    max-height: 88vh;
    border-left: none;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
    border-radius: 20px 20px 0 0;
    transform: translateY(100%);
  }
  .sl-drawer-backdrop.open .sl-drawer-panel {
    transform: translateY(0);
  }
}
```

- [ ] **Step 2: Build Drawer Content Template**
Render:
1. Header: Eyebrow + `[ ✕ ]` close button.
2. 4:3 High-Res Media Viewer with thumbnail filmstrip.
3. Headline & dynamic price.
4. Usage cadence badge (`✦ Recommended replenishment cadence: every 45 days`).
5. Finish & Size swatches synchronized with the product card.
6. Origin, materials, and care guide pills.
7. Sticky footer: Quantity stepper + `[ Add to Bag — $X,XXX ]`.

- [ ] **Step 3: Wire Quick Look Triggers, Focus Trap & Escape Key**
Enable clicking product image, product title, or Quick Look button on hover to open drawer. Add `keydown` handler for `Escape` to close drawer.

- [ ] **Step 4: Verify Quick Look Drawer in Browser**
Test opening drawer, switching thumbnails, selecting sizes, adding to bag, and closing via `Escape` / close button.

- [ ] **Step 5: Commit Task 5**
```bash
git add pages/smart-list.html
git commit -m "feat(smart-list): T5 — modernist quick look slide-over drawer with visual gallery and variant sync"
```

---

### Task 6: Multi-Breakpoint Responsive QA & Accessibility Verification

**Files:**
- Modify: `pages/smart-list.html:1000-1300`

**Interfaces:**
- Consumes: Rendered Smart List DOM
- Produces: Verified responsive layout across Desktop (1440px), Laptop/Compact (1280x585), Tablet (768px), and Mobile (375px) with WCAG 2.1 AA compliance.

- [ ] **Step 1: Audit Viewport Layouts & Compact Laptop Scaling**
Ensure hero, toolbar, grid, floating dock, and drawer scale seamlessly on compact 1280x585 viewports and mobile bottom sheets.

- [ ] **Step 2: Verify WCAG 2.1 AA Keyboard Accessibility & Contrast**
1. Test full `Tab` navigation through cards, selection rings, swatches, and batch actions.
2. Confirm contrast ratios ≥ 4.5:1.
3. Verify ARIA announcements for batch selection and cart additions.

- [ ] **Step 3: Capture Multi-Breakpoint Screenshots via Browser Subagent / Playwright**
Run visual verification on all 4 viewports to guarantee 0 regressions.

- [ ] **Step 4: Commit Task 6**
```bash
git add pages/smart-list.html
git commit -m "style(smart-list): T6 — multi-breakpoint responsive QA and WCAG 2.1 AA accessibility audit"
```
