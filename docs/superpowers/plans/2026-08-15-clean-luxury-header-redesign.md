# Clean Luxury Header & Navigation Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign and rebuild the top announcement bar and global header across the nexCommerce storefront into an ultra-clean, luxury editorial navigation system (inspired by NET-A-PORTER, SSENSE, and Apple), removing the redundant generic "Shop" page link, prioritizing core discovery, and consolidating secondary utilities into an elegant 3-dot (`...`) overflow menu.

**Architecture:** 
1. Refactor the top announcement bar into an ultra-slim, quiet editorial value-proposition strip with BDT currency notation and zero visual clutter.
2. Streamline primary navigation to essential destinations (`Categories`, `New In`, `Discover`), permanently removing the generic "Shop" link.
3. Build an accessible, origin-aware 3-dot (`...` / More) luxury popover menu for secondary utilities (`Wishlist`, `Track Order`, `AI Style Profile`, `Customer Care`) using `ShadcnDropdown` spring physics.
4. Unify header CSS tokens, responsive drawer behavior, and auth state synchronization across all storefront pages.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (custom design system tokens, `backdrop-filter: blur(18px)`, micro-animations, Emil Kowalski easing curves), Lucide SVG Icons, Vanilla JavaScript (`header.js`, `shadcn-emil-ui.js`, `auth.js`).

---

## Global Constraints

- **Luxury Aesthetic Standard:** Base deep navy foundation (`--bg-header: rgba(6, 14, 28, 0.92);`) with high-clarity specular borders (`rgba(255, 255, 255, 0.08)`). No heavy neon glow or crowded badge stacking.
- **No Shop Page / Link:** The redundant "Shop" navigation link pointing to a generic catalog page is completely removed from desktop and mobile navigation in favor of direct category and intent discovery.
- **Iconography Standard:** All icons MUST be clean stroke-based SVG icons (Lucide SVG icons), NEVER system emojis or raw text characters.
- **Currency Standard:** Display clean international currency code `BDT` for all threshold mentions (e.g. `BDT 2,000`), avoiding jagged serif currency symbol fallbacks.
- **Touch & Accessibility Standards:** Minimum 44×44px interactive hit targets, WCAG 2.1 AA compliant contrast ratios (>= 4.5:1), keyboard navigable (`Esc` to close popovers, `Ctrl + K` / `⌘K` for search trigger).

---

## Proposed Changes

### Component 1: CSS Design Tokens & Header Styling (`css/design-system.css` & `css/shadcn-physics.css`)

#### [MODIFY] [css/design-system.css](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css)
- Refactor the top announcement bar styles to a calm, 32px slim editorial banner.
- Clean up legacy duplicate `.site-header` and `.nav-inner` rules.
- Style the refined header layout, brand anchor, search pill, concierge action, and 3-dot overflow trigger button.
- Style the luxury 3-dot dropdown popover with smooth spring transform origin, frosted backdrop, and icon rows.

### Component 2: Header JavaScript & 3-Dot Popover Controller (`js/header.js` & `js/shadcn-emil-ui.js`)

#### [MODIFY] [js/header.js](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/js/header.js)
- Ensure 3-dot dropdown trigger initializes `ShadcnDropdown` on all pages.
- Enhance mobile menu drawer toggle with smooth lock-scroll and keyboard escape handlers.

### Component 3: Homepage & Storefront Markup Updates (`index.html`, `category.html`, `product.html`, `discovery.html`, `cart.html`, `account.html`, `tracking.html`, `profile.html`)

#### [MODIFY] [index.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/index.html)
- Replace legacy announcement bar and header markup with the clean editorial structure.
- Remove "Shop" link from nav and mobile drawer.
- Add the 3-dot (`...`) overflow menu containing Wishlist, Track Order, and AI Profile.

#### [MODIFY] [category.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/category.html)
#### [MODIFY] [product.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/product.html)
#### [MODIFY] [discovery.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/discovery.html)
#### [MODIFY] [cart.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/cart.html)
#### [MODIFY] [account.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/account.html)
#### [MODIFY] [tracking.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/tracking.html)
#### [MODIFY] [profile.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/profile.html)
- Synchronize the clean header and 3-dot overflow menu markup consistently across all pages.

---

## Tasks

### Task 1: Refactor CSS for Clean Header, Slim Announcement Bar & 3-Dot Overflow Menu

**Files:**
- Modify: `css/design-system.css:5950-6090`
- Modify: `css/shadcn-physics.css:164-216`

**Interfaces:**
- Consumes: CSS variables (`--bg-surface`, `--text-primary`, `--text-secondary`, `--text-muted`, `--accent-cyan`, `--border-subtle`, `--ease-out`)
- Produces: CSS classes `.top-announcement-bar`, `.site-header`, `.nav-inner`, `.nav-menu-links`, `.nav-more-menu`, `.nav-more-trigger`, `.nav-more-dropdown`

- [ ] **Step 1: Write clean header & 3-dot dropdown styles in `css/design-system.css`**

Add/update the streamlined announcement bar and header classes:

```css
/* ─── Ultra-Clean Top Announcement Bar ─────────────────────────────── */
.top-announcement-bar {
  background: rgba(4, 10, 20, 0.95);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 11px;
  font-family: var(--font-body);
  font-weight: 500;
  letter-spacing: 0.03em;
  color: var(--text-secondary);
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1001;
}

.announcement-inner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
}

.announcement-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
}

.announcement-item i,
.announcement-item svg {
  color: var(--accent-pink, #E11D48);
  width: 12px;
  height: 12px;
}

.announcement-dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

/* ─── Global Clean Header ───────────────────────────────────────────── */
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  height: 72px;
  background: rgba(6, 14, 28, 0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  transition: background-color 200ms ease, box-shadow 200ms ease;
}

.site-header.scrolled {
  background: rgba(4, 10, 22, 0.97);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
}

.nav-inner {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.nav-brand-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.site-logo-img {
  height: 28px;
  width: auto;
  display: block;
}

.nav-menu-links {
  display: flex;
  align-items: center;
  gap: 28px;
}

.nav-item-link {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: color 160ms ease;
  position: relative;
}

.nav-item-link:hover {
  color: var(--text-primary);
}

.nav-badge-pink {
  background: #E11D48;
  color: #FFFFFF;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.06em;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

/* ─── Search Pill ───────────────────────────────────────────────────── */
.nav-search-pill-wrap {
  flex: 1;
  max-width: 340px;
}

.nav-search-pill {
  width: 100%;
  height: 40px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 100px;
  padding: 0 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: all 180ms ease;
}

.nav-search-pill:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.25);
  color: var(--text-primary);
}

.search-pill-icon {
  color: var(--text-muted);
  display: inline-flex;
  align-items: center;
}

.search-pill-placeholder {
  flex: 1;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.search-kbd {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-muted);
}

/* ─── Right Actions & 3-Dot Overflow Menu ───────────────────────────── */
.nav-right-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.concierge-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: rgba(225, 29, 72, 0.1);
  border: 1px solid rgba(225, 29, 72, 0.35);
  border-radius: 100px;
  color: #FFFFFF;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  cursor: pointer;
  transition: all 180ms ease;
}

.concierge-nav-btn:hover {
  background: rgba(225, 29, 72, 0.2);
  border-color: rgba(225, 29, 72, 0.6);
  box-shadow: 0 0 16px rgba(225, 29, 72, 0.25);
}

.nav-more-menu {
  position: relative;
  display: inline-flex;
}

.nav-more-trigger {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 160ms ease;
}

.nav-more-trigger:hover,
.nav-more-trigger[aria-expanded="true"] {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  color: var(--text-primary);
}

.nav-more-dropdown {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 220px;
  background: rgba(6, 18, 38, 0.96);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 12px;
  padding: 6px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5), 0 0 1px rgba(255, 255, 255, 0.2);
  z-index: 1050;
  transform-origin: top right;
  transform: scale(0.95);
  opacity: 0;
  pointer-events: none;
  transition: transform 160ms var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1)),
              opacity 160ms var(--ease-out, cubic-bezier(0.23, 1, 0.32, 1));
}

.nav-more-dropdown[data-state="open"] {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}

.nav-more-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 140ms ease;
}

.nav-more-item:hover {
  background: rgba(61, 224, 255, 0.08);
  color: var(--text-primary);
}

.nav-more-item i,
.nav-more-item svg {
  color: var(--accent-cyan, #3DE0FF);
  width: 15px;
  height: 15px;
}

.nav-more-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 4px 6px;
}
```

- [ ] **Step 2: Verify CSS compiles and classes are valid**

Check syntax and tokens consistency with `--text-primary`, `--text-secondary`, `--accent-cyan`, `--accent-pink`.

- [ ] **Step 3: Commit**

```bash
git add css/design-system.css css/shadcn-physics.css
git commit -m "style: add clean luxury header, announcement bar and 3-dot popover styles"
```

---

### Task 2: Update Header Controller in `js/header.js` & Dropdown Initializer

**Files:**
- Modify: `js/header.js:1-37`

**Interfaces:**
- Consumes: DOM elements (`#headerMoreMenu`, `[data-dropdown-trigger]`, `#mobileMenuBtn`, `#mobileNavDrawer`)
- Produces: Seamless 3-dot dropdown popover handling and responsive drawer controls.

- [ ] **Step 1: Update `js/header.js` with 3-dot menu and mobile handling**

```javascript
/* nexCommerce Minimal Glass Header & 3-Dot Overflow Controller */
export function initHeader() {
  const header = document.querySelector('.site-header') || document.getElementById('siteHeader');
  if (!header) return;

  // Scroll quieting effect
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 3-Dot Overflow Menu Dropdown
  const moreMenus = document.querySelectorAll('.nav-more-menu');
  moreMenus.forEach(menu => {
    const trigger = menu.querySelector('.nav-more-trigger, [data-dropdown-trigger]');
    const dropdown = menu.querySelector('.nav-more-dropdown, .shadcn-dropdown-content');
    if (!trigger || !dropdown) return;

    const toggleMenu = (e) => {
      e.stopPropagation();
      const isOpen = dropdown.getAttribute('data-state') === 'open';
      if (isOpen) {
        dropdown.setAttribute('data-state', 'closed');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        // Close other open menus
        document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
          d.setAttribute('data-state', 'closed');
        });
        dropdown.setAttribute('data-state', 'open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    };

    trigger.addEventListener('click', toggleMenu);
  });

  // Global click outside listener to close popovers
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-more-menu')) {
      document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
        d.setAttribute('data-state', 'closed');
        const parentTrigger = d.parentElement?.querySelector('[data-dropdown-trigger]');
        if (parentTrigger) parentTrigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Escape key closes open popovers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-more-dropdown[data-state="open"]').forEach(d => {
        d.setAttribute('data-state', 'closed');
        const parentTrigger = d.parentElement?.querySelector('[data-dropdown-trigger]');
        if (parentTrigger) parentTrigger.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Mobile navigation drawer toggle
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const closeMobileBtn = document.getElementById('closeMobileDrawerBtn');
  const mobileDrawer = document.getElementById('mobileNavDrawer');

  if (mobileBtn && mobileDrawer) {
    mobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  }

  if (closeMobileBtn && mobileDrawer) {
    closeMobileBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('active');
      document.body.style.overflow = '';
    });
  }
}

// Auto-initialize when loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeader);
} else {
  initHeader();
}
```

- [ ] **Step 2: Commit**

```bash
git add js/header.js
git commit -m "feat: enhance header controller with 3-dot dropdown popover handling"
```

---

### Task 3: Redesign Homepage Header & Top Bar (`index.html`)

**Files:**
- Modify: `index.html:15-87`

**Interfaces:**
- Removes: Generic "Shop" link (`category.html?cat=all`)
- Adds: Clean announcement bar, `Categories`, `New In`, `Discover [NEW]`, `✦ CONCIERGE`, `Account` (`Tanvir`), `Bag`, and 3-dot (`...`) overflow menu.

- [ ] **Step 1: Replace header and announcement bar markup in `index.html`**

```html
  <!-- TOP ANNOUNCEMENT BAR (CLEAN EDITORIAL STRIP) -->
  <div class="top-announcement-bar">
    <div class="container announcement-inner">
      <span class="announcement-item"><i data-lucide="truck"></i> Complimentary express delivery over BDT 2,000</span>
      <span class="announcement-dot"></span>
      <span class="announcement-item"><i data-lucide="rotate-ccw"></i> 14-day effortless returns</span>
      <span class="announcement-dot"></span>
      <span class="announcement-item"><i data-lucide="shield-check"></i> 100% verified authentic</span>
    </div>
  </div>

  <!-- GLOBAL HEADER (ULTRA-CLEAN LUXURY NAVIGATION) -->
  <header class="site-header" id="siteHeader">
    <div class="nav-inner container">
      <!-- Left: Logo & Core Nav -->
      <div class="nav-brand-group">
        <button class="mobile-menu-trigger" id="mobileMenuBtn" aria-label="Open mobile menu">
          <i data-lucide="menu" style="width: 22px; height: 22px;"></i>
        </button>
        <a href="index.html" class="nav-logo" aria-label="nexCommerce Home">
          <img src="logo_light.png" alt="nexCommerce — next generation e-commerce" class="site-logo-img" />
        </a>
      </div>

      <nav class="nav-menu-links desktop-only" aria-label="Primary Navigation">
        <a href="category.html?cat=all" class="nav-item-link">Categories</a>
        <a href="category.html?cat=new" class="nav-item-link">New In</a>
        <a href="discovery.html" class="nav-item-link">Discover <span class="nav-badge-pink">NEW</span></a>
      </nav>

      <!-- Center: Smart Search Pill -->
      <div class="nav-search-pill-wrap desktop-only">
        <button class="nav-search-pill search-trigger" id="searchTriggerBtn" aria-label="Search Catalog (Ctrl + K)">
          <span class="search-pill-icon"><i data-lucide="search" style="width: 14px; height: 14px;"></i></span>
          <span class="search-pill-placeholder">What are you looking for?</span>
          <span class="search-kbd">Ctrl + K</span>
        </button>
      </div>

      <!-- Right: Priority Actions & 3-Dot Overflow Menu -->
      <div class="nav-right-actions">
        <button id="conciergeNavTrigger" class="concierge-nav-btn desktop-only" aria-label="Open Style Concierge">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
          <span>CONCIERGE</span>
        </button>

        <a data-auth-account href="account.html" class="nav-item-link desktop-only" aria-label="My Account">
          <i data-lucide="user" style="width: 15px; height: 15px;"></i>
          <span data-auth-name>Tanvir</span>
        </a>

        <a href="cart.html" class="cart-trigger nav-item-link" id="headerCartLink" aria-label="Shopping Bag">
          <i data-lucide="shopping-bag" style="width: 15px; height: 15px;"></i>
          <span>Bag</span>
          <span class="bag-count-badge" id="headerCartCount">3</span>
        </a>

        <!-- 3-Dot Overflow Menu for Secondary Utilities -->
        <div class="nav-more-menu" id="headerMoreMenu">
          <button class="nav-more-trigger" data-dropdown-trigger aria-label="More options" aria-haspopup="true" aria-expanded="false">
            <i data-lucide="more-horizontal" style="width: 18px; height: 18px;"></i>
          </button>
          <div class="nav-more-dropdown" data-state="closed" role="menu">
            <a href="discovery.html" class="nav-more-item" role="menuitem">
              <i data-lucide="heart"></i>
              <span>Saved Wishlist</span>
            </a>
            <a href="tracking.html" class="nav-more-item" role="menuitem">
              <i data-lucide="truck"></i>
              <span>Track Order</span>
            </a>
            <a href="profile.html" class="nav-more-item" role="menuitem">
              <i data-lucide="sparkles"></i>
              <span>AI Style Profile</span>
            </a>
            <div class="nav-more-divider"></div>
            <a href="account.html#orders" class="nav-more-item" role="menuitem">
              <i data-lucide="receipt"></i>
              <span>Order History</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- MOBILE NAVIGATION DRAWER -->
  <div class="mobile-nav-drawer" id="mobileNavDrawer">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <a href="index.html" class="nav-logo" aria-label="nexCommerce Home"><img src="logo_light.png" alt="nexCommerce" style="height: 24px; width: auto;" /></a>
      <button id="closeMobileDrawerBtn" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center;" aria-label="Close mobile menu"><i data-lucide="x" style="width: 22px; height: 22px;"></i></button>
    </div>
    <a href="category.html?cat=all" class="mobile-drawer-link">Categories</a>
    <a href="category.html?cat=new" class="mobile-drawer-link">New In</a>
    <a href="discovery.html" class="mobile-drawer-link">Discover <span class="nav-badge-pink" style="margin-left: 6px;">NEW</span></a>
    <a href="tracking.html" class="mobile-drawer-link">Track Order</a>
    <a href="profile.html" class="mobile-drawer-link">AI Profile</a>
    <a data-auth-account href="account.html" class="mobile-drawer-link">Account</a>
    <a href="cart.html" class="mobile-drawer-link">Bag (<span id="mobileCartCount">3</span>)</a>
  </div>
```

- [ ] **Step 2: Commit**

```bash
git add index.html
git commit -m "feat: rebuild homepage header with clean navigation and 3-dot overflow menu"
```

---

### Task 4: Propagate Clean Header & 3-Dot Menu Across All Storefront Pages

**Files:**
- Modify: `category.html:15-70`
- Modify: `product.html:15-60`
- Modify: `discovery.html:15-60`
- Modify: `cart.html:15-60`
- Modify: `account.html:30-80`
- Modify: `tracking.html:60-110`
- Modify: `profile.html:15-60`

**Interfaces:**
- Replaces legacy headers with unified clean header across all pages.

- [ ] **Step 1: Update `category.html`, `product.html`, `discovery.html`, `cart.html`, `account.html`, `tracking.html`, `profile.html`**

Ensure all pages have the identical, ultra-clean header structure with:
- No "Shop" link
- `Categories`, `New In`, `Discover`
- Search pill (or compact trigger)
- `✦ CONCIERGE`
- User auth name
- Bag link + badge
- 3-dot (`...`) overflow menu

- [ ] **Step 2: Verify Lucide Icons re-render correctly across all pages**

Run browser verification check to ensure icons (`lucide.createIcons()`) load and render as clean SVGs with zero missing icons or text placeholders.

- [ ] **Step 3: Commit**

```bash
git add category.html product.html discovery.html cart.html account.html tracking.html profile.html
git commit -m "feat: synchronize clean luxury header and 3-dot menu across all storefront pages"
```

---

### Task 5: End-to-End Verification & Visual Testing

**Files:**
- Test via browser preview on desktop (1440px), laptop (1024px), and mobile (390px).

- [ ] **Step 1: Test 3-Dot Overflow Menu Interaction**
  - Click 3-dot menu button -> popover opens with smooth spring scale transition.
  - Click outside or press `Esc` -> popover closes cleanly.
  - Links inside popover (Wishlist, Track Order, AI Profile) navigate properly.

- [ ] **Step 2: Verify Absence of "Shop" Page Link**
  - Verify "Shop" link is removed from all header navs and mobile drawers.
  - Verify direct category links work as intended.

- [ ] **Step 3: Test Auth Name Injection**
  - Verify `Tanvir` / user name renders cleanly in the header without jagged font fallbacks.

- [ ] **Step 4: Take visual screenshots for desktop & mobile**
  - Capture clean visual proof of the redesigned header, announcement bar, and opened 3-dot menu.

---

## Plan Complete

Plan complete and saved to `docs/superpowers/plans/2026-08-15-clean-luxury-header-redesign.md`.
