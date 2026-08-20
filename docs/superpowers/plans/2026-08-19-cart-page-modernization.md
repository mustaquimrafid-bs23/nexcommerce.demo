# Cart Page Modernization & 4 Motion Standards Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Audit, modernize, and rebuild `pages/cart.html` and its supporting script `js/cart.js`, motion hooks in `js/animations.js`, and styles in `css/design-system.css` to eliminate outdated animation tracks and harsh borders, remove noisy text clutter, introduce a 120fps Express Delivery Progress Capsule, embed an editorial Curated Look Switcher & 120fps Animation Track, and fully integrate all 4 Motion Standards (Micro-interactions with 120fps progress timers & tactile ripples, 3D hover effects with spring tilt and specular glare, GPU cross-dissolve page transitions, and differential scroll parallax) while ensuring 100% responsiveness and zero feature regressions.

**Architecture:** 
1. **Layout & Visual Foundation:** Luxury neutral obsidian architecture (`rgba(10, 18, 32, 0.85)`), 1px translucent hairline borders (`rgba(255, 255, 255, 0.07)`), and multi-layer ambient drop shadows. Fixed header spacing calibrated to prevent overlapping.
2. **120fps GPU Delivery Milestone Track:** Real-time hardware-accelerated progress bar (`scaleX(0) → scaleX(1)`) calculating the threshold to complimentary express delivery (BDT 20,000) with dynamic milestone unlock animations.
3. **Curated Look Switcher & 120fps Animation Track:** Split editorial look showcase embedded directly in the bag view with auto-cycling (6.5s) progress timer, pause on hover/touch, Look tabs (`01 TAILORING`, `02 LEATHER`, `03 ACOUSTICS`, `04 HOROLOGY`), and 3D quick-add capsule cards.
4. **4 Motion Standards Engine:** Coordinated via `js/animations.js` and `js/cart.js` with spring LERP mouse tilt physics (`perspective(1000px)`), dynamic cursor-following specular glare (`--cart-glare-x`, `--cart-glare-y`), GPU cross-dissolve route transition overlay (`#pageTransitionOverlay`), and Lenis differential scroll parallax.
5. **Interactive Bag State Machine:** Instant quantity stepper with spring bounce, graceful row exit transitions on removal, save-for-later wishlist toggle, coupon engine with morphing pill state, and 375px mobile sticky checkout bar.

**Tech Stack:** Vanilla JavaScript (ES6+), Vanilla CSS Custom Properties / Tokens, Web Animations API (WAAPI), Lenis Smooth Scroll, Lucide Icons.

## Global Constraints

- **Design Standard:** Obsidian luxury atelier surface (`#080E1A` / `rgba(10, 18, 32, 0.85)`), hairline 1px borders (`rgba(255, 255, 255, 0.07)`), zero hard/bold borders, minimal 3-item metadata per card (no multi-line descriptive text clutter).
- **Performance:** 120fps GPU-accelerated transforms (`transform: scaleX(...)`, `transform: translateY(...)`, `will-change: transform`), zero layout thrashing, 0.000 Cumulative Layout Shift (CLS).
- **Motion Standards:**
  - 1️⃣ **Micro-interactions:** 120fps GPU progress timers, tactile quick-add ripple, quantity stepper micro-spring bounce, coupon pill morph, and item remove slide-out.
  - 2️⃣ **3D Hover Effects:** Multi-layer realistic shadows, spring LERP mouse tilt (`±6°`), dynamic cursor specular glare sheen.
  - 3️⃣ **Page Transitions:** GPU cross-dissolve curtain (`#pageTransitionOverlay`, 200ms cubic-bezier).
  - 4️⃣ **Scroll Parallax:** Differential column depth (`data-parallax-depth="0.04"`) between cart list and sticky summary column.
- **Responsiveness:** Flawless reflow across Desktop (1440px+), Laptop (1024px-1200px), Tablet (768px), and Mobile (375px) with mobile sticky checkout drawer.
- **Feature Preservation:** Full state persistence in `localStorage ('nex_cart')`, live subtotal/total calculations, discount promo codes (`NEX10`, `LUXURY20`, `FREESHIP`), empty state recovery, mini-cart sync, and auth badge updates.

---

### Task 1: Rebuild `pages/cart.html` Markup & Structural Hierarchy

**Files:**
- Modify: `pages/cart.html`

**Interfaces:**
- Consumes: `../css/design-system.css`, `../js/cart.js`, `../js/animations.js`, Lucide icons.
- Produces: Clean semantic markup with `#pageTransitionOverlay`, calibrated top header clearance, live milestone delivery capsule (`#cartDeliveryCapsule`), 2-column asymmetric grid (`#cartGrid`), Curated Look Switcher capsule (`#cartLookSwitcherWrap`), sticky order summary (`#cartSummaryArea`), empty bag fallback (`#cartEmptyArea`), and 375px mobile sticky checkout bar (`#mobileCartStickyBar`).

- [ ] **Step 1: Update `pages/cart.html` markup**

Replace the contents of `pages/cart.html` with the modernized, semantic, and motion-ready structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Shopping Bag &mdash; nexCommerce</title>
  <meta name="description" content="Review your selected items, complimentary delivery terms, and complete your purchase with quiet confidence at nexCommerce.">
  <meta name="view-transition" content="same-origin" />

  <!-- Google Fonts: Cormorant Garamond & Inter -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Work+Sans:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/design-system.css?v=6">
</head>
<body class="cart-page-body">

  <!-- GPU CROSS-DISSOLVE ROUTE TRANSITION CURTAIN (Motion Standard 3) -->
  <div id="pageTransitionOverlay" class="page-transition-curtain" aria-hidden="true"></div>

  <!-- LUXURY EDITORIAL BRAND PRELOADER -->
  <div class="page-preloader" id="pagePreloader" aria-label="Loading nexCommerce" role="status">
    <div class="preloader-inner">
      <div class="preloader-logo-wrap">
        <img src="../assets/images/brand/logo_light.png" alt="nexCommerce" class="preloader-logo-img" />
      </div>
      <div class="preloader-status-whisper">
        <span class="preloader-status-dot"></span>
        <span id="preloaderStatusText">Reviewing Your Reserved Atelier Selections</span>
      </div>
      <div class="preloader-progress-track" aria-hidden="true">
        <div class="preloader-progress-bar" id="preloaderProgressBar"></div>
      </div>
      <div class="preloader-percent" id="preloaderPercent">0%</div>
    </div>
  </div>

  <!-- TOP ANNOUNCEMENT BAR (CLEAN EDITORIAL STRIP) -->
  <div class="top-announcement-bar" id="topAnnouncementBar">
    <div class="container announcement-inner">
      <span class="announcement-item"><i data-lucide="rotate-ccw"></i> 14-day effortless returns</span>
      <span class="announcement-dot"></span>
      <span class="announcement-item"><i data-lucide="shield-check"></i> 100% verified authentic</span>
      <span class="announcement-dot"></span>
      <span class="announcement-item"><i data-lucide="truck"></i> Complimentary express delivery over BDT 20,000</span>
    </div>
  </div>

  <!-- GLOBAL HEADER (ULTRA-CLEAN LUXURY NAVIGATION) -->
  <header class="site-header" id="siteHeader">
    <div class="nav-inner container">
      <!-- Left: Brand Logo & Core Nav -->
      <div class="nav-brand-group">
        <button class="mobile-menu-trigger" id="mobileMenuBtn" aria-label="Open mobile menu">
          <i data-lucide="menu" style="width: 22px; height: 22px;"></i>
        </button>
        <a href="../index.html" class="nav-logo" aria-label="nexCommerce Home">
          <img src="../assets/images/brand/logo_light.png" alt="nexCommerce — next generation e-commerce" class="site-logo-img" />
        </a>
      </div>

      <nav class="nav-menu-links desktop-only" aria-label="Primary Navigation">
        <a href="category.html?cat=all" class="nav-item-link">Categories</a>
        <a href="category.html?cat=new" class="nav-item-link">New In</a>
        <a href="smart-list.html" class="nav-item-link">Smart List <span class="nav-badge-pink">AI</span></a>
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

        <a href="wishlist.html" class="nav-icon-btn desktop-only" id="headerWishlistLink" aria-label="Saved Wishlist" title="Saved Wishlist">
          <i data-lucide="heart" style="width: 18px; height: 18px;"></i>
          <span class="wishlist-count-badge" id="headerWishlistCount" style="display: none;">0</span>
        </a>

        <a data-auth-account href="account.html" class="nav-icon-btn desktop-only" aria-label="My Account" title="My Account">
          <i data-lucide="user" style="width: 18px; height: 18px;"></i>
          <span data-auth-name style="display: none;">Account</span>
        </a>

        <a href="cart.html" class="cart-trigger nav-icon-btn active" id="headerCartLink" aria-label="Shopping Bag" title="Shopping Bag">
          <i data-lucide="shopping-bag" style="width: 18px; height: 18px;"></i>
          <span class="bag-count-badge" id="headerCartCount">0</span>
        </a>

        <!-- 3-Dot Overflow Menu for Secondary Utilities -->
        <div class="nav-more-menu" id="headerMoreMenu">
          <button class="nav-more-trigger" data-dropdown-trigger aria-label="More options" aria-haspopup="true" aria-expanded="false">
            <i data-lucide="more-horizontal" style="width: 18px; height: 18px;"></i>
          </button>
          <div class="nav-more-dropdown" data-state="closed" role="menu">
            <a href="tracking.html" class="nav-more-item" role="menuitem">
              <i data-lucide="truck"></i>
              <span>Track Order</span>
            </a>
            <a href="profile.html" class="nav-more-item" role="menuitem">
              <i data-lucide="sparkles"></i>
              <span>AI Style Profile</span>
            </a>
            <a href="account.html#orders" class="nav-more-item" role="menuitem">
              <i data-lucide="receipt"></i>
              <span>Order History</span>
            </a>
            <div class="nav-more-divider"></div>
            <a href="contact.html" class="nav-more-item" role="menuitem">
              <i data-lucide="headphones"></i>
              <span>Client Services</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- MOBILE NAVIGATION DRAWER -->
  <div class="mobile-nav-drawer" id="mobileNavDrawer">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <a href="../index.html" class="nav-logo" aria-label="nexCommerce Home"><img src="../assets/images/brand/logo_light.png" alt="nexCommerce" style="height: 24px; width: auto;" /></a>
      <button id="closeMobileDrawerBtn" style="background: none; border: none; color: var(--text-primary); cursor: pointer; display: flex; align-items: center; justify-content: center;" aria-label="Close mobile menu"><i data-lucide="x" style="width: 22px; height: 22px;"></i></button>
    </div>
    <a href="category.html?cat=all" class="mobile-drawer-link">Categories</a>
    <a href="category.html?cat=new" class="mobile-drawer-link">New In</a>
    <a href="smart-list.html" class="mobile-drawer-link">Smart List <span class="nav-badge-pink" style="margin-left: 6px;">AI</span></a>
    <a href="wishlist.html" class="mobile-drawer-link">Saved Pieces</a>
    <a href="tracking.html" class="mobile-drawer-link">Track Order</a>
    <a href="profile.html" class="mobile-drawer-link">AI Profile</a>
    <a data-auth-account href="account.html" class="mobile-drawer-link">Account</a>
    <a href="cart.html" class="mobile-drawer-link">Bag (<span id="mobileCartCount">0</span>)</a>
  </div>

  <!-- MAIN CART CANVAS -->
  <main class="container cart-main-container">
    <!-- Header Title & Eyebrow -->
    <div class="cart-header-block">
      <span class="cart-eyebrow">YOUR RESERVED ATELIER SELECTION</span>
      <h1 class="cart-title">Your Shopping Bag</h1>
      <div class="cart-header-meta">
        <span class="cart-item-count" id="cartItemCount">0 pieces selected</span>
        <span class="cart-meta-divider">&middot;</span>
        <span class="cart-meta-whisper"><i data-lucide="shield-check" style="width: 13px; height: 13px;"></i> Authentic Direct Atelier Sourced</span>
      </div>
    </div>

    <!-- 120FPS EXPRESS DELIVERY MILESTONE CAPSULE (Motion Standard 1) -->
    <div class="cart-delivery-capsule" id="cartDeliveryCapsule" aria-label="Complimentary Express Delivery Progress">
      <div class="delivery-capsule-header">
        <div class="delivery-capsule-info">
          <span class="delivery-status-indicator" id="deliveryStatusDot"></span>
          <span class="delivery-status-text" id="deliveryStatusText">Calculating express delivery eligibility...</span>
        </div>
        <span class="delivery-threshold-badge" id="deliveryThresholdBadge">BDT 20,000 GOAL</span>
      </div>
      <div class="delivery-progress-track" aria-hidden="true">
        <div class="delivery-progress-bar" id="cartDeliveryProgressBar"></div>
      </div>
    </div>

    <!-- ACTIVE CART ASYMMETRIC GRID (2 Columns with Scroll Parallax) -->
    <div class="cart-grid" id="cartGrid">
      <!-- Left Column: Product Rows + Curated Look Switcher -->
      <div class="cart-items-column" data-parallax-depth="0.04">
        <!-- Rendered Cart Items (Hydrated by js/cart.js) -->
        <div id="cartItemsList" class="cart-items-list" role="region" aria-label="Cart Items">
          <!-- Dynamic cart items rendered here -->
        </div>

        <!-- CURATED LOOK SWITCHER & 120FPS ANIMATION TRACK (Complimentary Pairings) -->
        <div class="cart-look-spotlight-wrap" id="cartLookSwitcherWrap">
          <section class="cart-curation-spotlight" id="cartSpotlightSection" aria-label="Curated Capsule Pairings">
            <!-- 120fps GPU Progress Bar Track -->
            <div class="cart-spotlight-progress-track" aria-hidden="true">
              <div class="cart-spotlight-progress-bar" id="cartSpotlightProgressBar"></div>
            </div>

            <!-- Spotlight Header: Live Whisper + Look Switcher Tabs -->
            <div class="cart-spotlight-header-row">
              <div class="cart-spotlight-eyebrow-tag">
                <span class="cart-spotlight-status-dot"></span>
                <span id="cartSpotlightLookEyebrow">COMPLIMENTARY PAIRING &middot; 01 OF 04</span>
                <button type="button" class="cart-spotlight-pause-btn" id="cartSpotlightPauseBtn" aria-pressed="false" aria-label="Pause automatic capsule rotation">
                  <i data-lucide="pause" id="cartSpotlightPauseIcon" style="width: 11px; height: 11px;"></i>
                </button>
              </div>
              <div class="cart-spotlight-tabs" id="cartSpotlightTabs" role="tablist" aria-label="Complimentary Look Selection">
                <button class="cart-spotlight-tab active" data-look="0" role="tab" aria-selected="true" id="cartTab0">
                  <span>01 TAILORING</span>
                </button>
                <button class="cart-spotlight-tab" data-look="1" role="tab" aria-selected="false" id="cartTab1">
                  <span>02 LEATHER</span>
                </button>
                <button class="cart-spotlight-tab" data-look="2" role="tab" aria-selected="false" id="cartTab2">
                  <span>03 ACOUSTICS</span>
                </button>
                <button class="cart-spotlight-tab" data-look="3" role="tab" aria-selected="false" id="cartTab3">
                  <span>04 HOROLOGY</span>
                </button>
              </div>
            </div>

            <!-- Spotlight Body Layout (Split Editorial Canvas) -->
            <div class="cart-spotlight-body" id="cartSpotlightBody">
              <!-- Left: Capsule Story & Details -->
              <div class="cart-spotlight-story">
                <span class="cart-spotlight-season" id="cartSpotlightSeason">ATELIER EDIT &middot; AW26</span>
                <h3 class="cart-spotlight-title" id="cartSpotlightTitle">Architectural Cashmere Layer</h3>
                <p class="cart-spotlight-desc" id="cartSpotlightDesc">Handcrafted 2-ply Mongolian cashmere with seamless dropped shoulder tailoring for effortless warmth.</p>
                <div class="cart-spotlight-actions">
                  <button class="btn-primary-commerce cart-spotlight-add-btn" id="cartSpotlightAddBtn" data-product-id="p1">
                    <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                    <span id="cartSpotlightBtnText">Quick Add &middot; BDT 18,400</span>
                  </button>
                  <a href="category.html?cat=all" class="cart-spotlight-explore-link">
                    <span>Explore Capsule</span>
                    <i data-lucide="arrow-up-right" style="width: 12px; height: 12px;"></i>
                  </a>
                </div>
              </div>

              <!-- Right: Editorial Image Frame & Floating 3D Shoppable Pill -->
              <div class="cart-spotlight-media-pane">
                <div class="cart-spotlight-frame" id="cartSpotlightFrame">
                  <img src="../assets/images/lifestyle/hero_sweater_landscape.jpg" alt="Curated Look" class="cart-spotlight-img" id="cartSpotlightImg" />
                  <div class="cart-spotlight-vignette"></div>
                </div>

                <!-- Floating 3D Shoppable Look Pill -->
                <div class="cart-floating-look-pill" id="cartFloatingLookPill">
                  <div class="pill-thumb-wrap">
                    <img src="../assets/images/products/hero_sweater.png" alt="Piece" id="cartPillThumb" />
                  </div>
                  <div class="pill-meta-wrap">
                    <span class="pill-label" id="cartPillLabel">FEATURED PIECE</span>
                    <h4 class="pill-title" id="cartPillTitle">Cashmere Sweater</h4>
                    <span class="pill-price" id="cartPillPrice">BDT 18,400</span>
                  </div>
                  <button class="pill-quick-add-btn" id="cartPillQuickAddBtn" aria-label="Add featured look piece to bag">
                    <i data-lucide="plus" style="width: 14px; height: 14px;"></i>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- Right Column: Sticky Obsidian Order Summary -->
      <aside class="cart-summary-column" id="cartSummaryArea">
        <!-- Rendered dynamically by js/cart.js -->
      </aside>
    </div>

    <!-- EMPTY BAG FALLBACK STATE (Minimal Luxury Aesthetics) -->
    <div id="cartEmptyArea" class="cart-empty-canvas" style="display: none;">
      <div class="cart-empty-icon-wrap">
        <i data-lucide="shopping-bag" style="width: 32px; height: 32px;"></i>
      </div>
      <span class="cart-eyebrow">YOUR RESERVED ATELIER SELECTION</span>
      <h2 class="cart-empty-headline">Your shopping bag is empty</h2>
      <p class="cart-empty-sub">Explore our contemporary collections, new arrivals, and intelligent personalized edits.</p>
      
      <div class="cart-empty-actions">
        <a href="category.html?cat=all" class="btn-primary-commerce empty-cta-btn">
          <span>EXPLORE NEW ARRIVALS</span>
          <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
        </a>
        <a href="discovery.html" class="btn-ghost-commerce empty-cta-btn">
          <i data-lucide="sparkles" style="width: 14px; height: 14px;"></i>
          <span>INTELLIGENT DISCOVERY</span>
        </a>
        <a href="wishlist.html" class="btn-ghost-commerce empty-cta-btn">
          <i data-lucide="heart" style="width: 14px; height: 14px;"></i>
          <span>SAVED PIECES</span>
        </a>
      </div>
    </div>
  </main>

  <!-- 375px MOBILE STICKY CHECKOUT BAR -->
  <div id="mobileCartStickyBar" class="mobile-cart-sticky-bar" aria-label="Mobile Checkout">
    <div class="mobile-sticky-inner">
      <div class="mobile-sticky-meta">
        <span class="mobile-sticky-label">Total Due</span>
        <span class="mobile-sticky-total" id="mobileStickyTotal">BDT 0</span>
      </div>
      <a href="checkout.html" class="btn-primary-commerce mobile-sticky-checkout-btn" id="mobileStickyCheckoutBtn">
        <span>CHECKOUT</span>
        <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
      </a>
    </div>
  </div>

  <!-- SEARCH OVERLAY (global CMD+K) -->
  <div id="aiSearchModal" class="search-overlay-container" role="dialog" aria-modal="true" aria-label="Intelligent Search Overlay">
    <div class="search-backdrop"></div>
    <div class="search-panel">
      <div class="search-header-bar">
        <div class="search-input-wrapper">
          <div class="search-ai-icon">
            <i data-lucide="sparkles" style="width: 18px; height: 18px;"></i>
          </div>
          <input type="text" class="search-ai-input" placeholder="Something for a winter evening in Dhaka" autocomplete="off" spellcheck="false" aria-label="Search query" />
        </div>
        <button class="search-close-btn" aria-label="Close search">
          <i data-lucide="x" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
      <div id="aiSearchResultsModal" class="search-body"></div>
    </div>
  </div>

  <!-- ELEVATED LUXURY 4-COLUMN FOOTER -->
  <footer class="site-footer" role="contentinfo">
    <div class="container">
      <div class="footer-main-grid">
        <!-- Col 1: Brand & Private Edit -->
        <div class="footer-brand-col">
          <a href="../index.html" aria-label="nexCommerce Home" style="display: inline-block; text-decoration: none;">
            <img src="../assets/images/brand/logo_light.png" alt="nexCommerce Atelier" class="footer-logo-img" />
          </a>
          <p class="footer-brand-desc">
            A contemporary digital atelier uniting tailored ready-to-wear, artisanal footwear, and acoustic craft.
          </p>
          <div class="footer-newsletter-box">
            <span class="footer-newsletter-label">The Private Edit</span>
            <p class="footer-newsletter-sub">Receive private collection previews, seasonal capsule alerts, and atelier journals.</p>
            <form id="footerNewsletterForm" class="footer-newsletter-form" onsubmit="event.preventDefault(); alert('Thank you for subscribing to The Private Edit.');">
              <input type="email" class="footer-newsletter-input" placeholder="Enter your email address" required aria-label="Email address for newsletter" />
              <button type="submit" class="footer-newsletter-btn">Subscribe</button>
            </form>
          </div>
        </div>

        <!-- Col 2: Collections -->
        <div class="footer-nav-col">
          <span class="footer-col-heading">COLLECTIONS</span>
          <a href="category.html?sort=newest" class="footer-link-item">New Arrivals</a>
          <a href="category.html?cat=apparel" class="footer-link-item">Ready-to-Wear</a>
          <a href="category.html?cat=footwear" class="footer-link-item">Footwear & Leather</a>
          <a href="category.html?cat=acoustics" class="footer-link-item">High Acoustics</a>
          <a href="lookbook.html" class="footer-link-item">The Lookbook</a>
        </div>

        <!-- Col 3: Client Services -->
        <div class="footer-nav-col">
          <span class="footer-col-heading">CLIENT SERVICES</span>
          <a href="tracking.html" class="footer-link-item">Order Concierge</a>
          <a href="checkout.html" class="footer-link-item">Complimentary Returns</a>
          <a href="concierge.html" class="footer-link-item">Private Styling</a>
          <a href="product.html?id=p1" class="footer-link-item">Size & Fit Guide</a>
        </div>

        <!-- Col 4: The Maison -->
        <div class="footer-nav-col">
          <span class="footer-col-heading">THE MAISON</span>
          <a href="foundation.html" class="footer-link-item">Atelier Foundation</a>
          <a href="account.html" class="footer-link-item">Client Account</a>
          <a href="foundation.html#privacy" class="footer-link-item">Privacy & Terms</a>
          <a href="foundation.html#security" class="footer-link-item">Authenticity & Trust</a>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="footer-bottom-bar">
        <div class="footer-copy-text">&copy; 2026 nexCommerce Atelier Inc. All rights reserved.</div>
        <div class="footer-locale-selector">
          <i data-lucide="globe" style="width: 14px; height: 14px;"></i>
          <span>BDT &middot; Dhaka (EN)</span>
        </div>
        <div class="footer-payment-badges" aria-label="Accepted Payment Methods">
          <div class="payment-logo-badge" title="bKash">
            <img src="../assets/images/brand/bkash.svg" alt="bKash" class="payment-logo-img" />
          </div>
          <div class="payment-logo-badge" title="Nagad">
            <img src="../assets/images/brand/nagad.svg" alt="Nagad" class="payment-logo-img" />
          </div>
          <div class="payment-logo-badge" title="Visa">
            <img src="../assets/images/brand/visa.svg" alt="Visa" class="payment-logo-img" />
          </div>
          <div class="payment-logo-badge" title="Mastercard">
            <img src="../assets/images/brand/mastercard.svg" alt="Mastercard" class="payment-logo-img" />
          </div>
        </div>
      </div>
    </div>
  </footer>

  <!-- CDNs -->
  <script src="https://unpkg.com/lucide@latest"></script>
  <script src="https://unpkg.com/split-type"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js"></script>

  <!-- Scripts -->
  <script src="../js/cart.js"></script>
  <script src="../js/ai-engine.js"></script>
  <script src="../js/intent-parser.js"></script>
  <script src="../js/catalog-engine.js"></script>
  <script src="../js/session-context.js"></script>
  <script src="../js/style-profile.js"></script>
  <script src="../js/context-retention.js"></script>
  <script src="../js/search-overlay.js?v=4"></script>
  <script src="../js/theme-switcher.js"></script>
  <script src="../js/animations.js"></script>
  <script src="../js/concierge-engine.js"></script>
  <script src="../js/concierge.js"></script>
  <script src="../js/auth.js"></script>
  <script src="../js/header.js"></script>

  <!-- MINI CART (SIDE DRAWER) -->
  <div id="nexMiniCartOverlay" class="minicart-overlay" aria-hidden="true"></div>
  <aside id="nexMiniCartDrawer" class="minicart-drawer" aria-hidden="true" role="dialog" aria-label="Shopping Bag">
    <div class="minicart-header">
      <div class="minicart-title">Shopping Bag</div>
      <button id="minicartCloseBtn" class="minicart-close" aria-label="Close Bag">&times;</button>
    </div>
    <div id="minicartBody" class="minicart-body">
      <!-- Populated by cart.js -->
    </div>
    <div id="minicartFooter" class="minicart-footer" style="display: none;">
      <div class="minicart-subtotal">
        <span>Subtotal</span>
        <span id="minicartSubtotalValue">BDT 0</span>
      </div>
      <a href="cart.html" class="btn-primary-commerce minicart-checkout-btn">VIEW BAG &amp; CHECKOUT</a>
    </div>
  </aside>

</body>
</html>
```

- [ ] **Step 2: Verify markup renders cleanly with no missing closing tags**

---

### Task 2: Implement Modernized Luxury Cart Styles in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:3548-3908`

**Interfaces:**
- Consumes: Design system tokens (`--bg-primary`, `--font-serif`, `--font-body`, `--radius-md`, `--radius-pill`).
- Produces: CSS rules for `.cart-page-body`, `.cart-main-container`, `.cart-delivery-capsule`, `.cart-item-card`, `.cart-look-spotlight-wrap`, `.cart-summary-card`, `.cart-skeleton-card`, and responsive breakpoints (1440px, 1024px, 768px, 375px).

- [ ] **Step 1: Write modern Cart CSS rules in `css/design-system.css`**

Update the cart section in `css/design-system.css` (lines 3548-3908) with the following comprehensive styles:

```css
/* ─── Part 6: Luxury Shopping Bag / Cart Experience (Modernized) ────────── */
.cart-page-body {
  background: var(--bg-primary, #080E1A);
  min-height: 100vh;
}

.cart-main-container {
  padding-top: calc(var(--nav-height, 72px) + 36px);
  padding-bottom: 120px;
  position: relative;
}

.cart-header-block {
  margin-bottom: 28px;
}

.cart-eyebrow {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent-cyan, #06b6d4);
  margin-bottom: 8px;
  display: block;
}

.cart-title {
  font-family: var(--font-serif);
  font-size: clamp(34px, 4vw, 48px);
  font-weight: 500;
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  margin-bottom: 8px;
}

.cart-header-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
}

.cart-meta-divider {
  color: rgba(255, 255, 255, 0.25);
}

.cart-meta-whisper {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: rgba(255, 255, 255, 0.45);
}

/* ─── 120fps Express Delivery Progress Capsule (Motion Standard 1) ─────── */
.cart-delivery-capsule {
  background: rgba(10, 18, 32, 0.8);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md, 12px);
  padding: 16px 20px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.35);
  transition: border-color 280ms ease, box-shadow 280ms ease;
}

.cart-delivery-capsule.unlocked {
  border-color: rgba(16, 185, 129, 0.3);
  box-shadow: 0 4px 24px -2px rgba(16, 185, 129, 0.12);
}

.delivery-capsule-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  gap: 12px;
}

.delivery-capsule-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.delivery-status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #06b6d4;
  box-shadow: 0 0 10px rgba(6, 182, 212, 0.6);
  flex-shrink: 0;
  transition: background-color 280ms ease, box-shadow 280ms ease;
}

.cart-delivery-capsule.unlocked .delivery-status-indicator {
  background: #10B981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.7);
}

.delivery-status-text {
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 500;
  color: #FFFFFF;
}

.delivery-threshold-badge {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-cyan, #06b6d4);
  background: rgba(6, 182, 212, 0.1);
  padding: 4px 10px;
  border-radius: var(--radius-pill, 999px);
  border: 1px solid rgba(6, 182, 212, 0.2);
  white-space: nowrap;
}

.cart-delivery-capsule.unlocked .delivery-threshold-badge {
  color: #10B981;
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.25);
}

.delivery-progress-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
  position: relative;
}

.delivery-progress-bar {
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #06b6d4, #3b82f6);
  border-radius: 999px;
  transform-origin: left center;
  transform: scaleX(0);
  transition: transform 380ms cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.cart-delivery-capsule.unlocked .delivery-progress-bar {
  background: linear-gradient(90deg, #10b981, #06b6d4);
}

/* ─── Asymmetric 2-Column Grid Layout ──────────────────────────────────── */
.cart-grid {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(340px, 0.85fr);
  gap: 40px;
  align-items: start;
}

.cart-items-column {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.cart-items-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* ─── Luxury Obsidian Cart Item Card (Motion Standards 1 & 2) ──────────── */
.cart-item-card {
  background: rgba(10, 18, 32, 0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--radius-md, 12px);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 22px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.4), 0 12px 32px -4px rgba(0, 0, 0, 0.5);
  transition: border-color 240ms ease, box-shadow 240ms ease;
  will-change: transform;
}

.cart-item-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
  box-shadow: 0 8px 30px -4px rgba(0, 0, 0, 0.5), 0 20px 48px -6px rgba(0, 0, 0, 0.6);
}

.cart-item-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--cart-glare-x, 50%) var(--cart-glare-y, 50%), rgba(255, 255, 255, 0.08) 0%, transparent 60%);
  opacity: var(--cart-glare-opacity, 0);
  pointer-events: none;
  transition: opacity 180ms ease;
  border-radius: inherit;
}

.cart-item-card.is-removing {
  opacity: 0;
  transform: scale(0.96) translateX(-24px);
  transition: opacity 280ms cubic-bezier(0.16, 1, 0.3, 1), transform 280ms cubic-bezier(0.16, 1, 0.3, 1), height 280ms cubic-bezier(0.16, 1, 0.3, 1), margin 280ms cubic-bezier(0.16, 1, 0.3, 1), padding 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Image Wrap */
.cart-item-media {
  width: 110px;
  height: 135px;
  aspect-ratio: 4 / 5;
  background: #091424;
  border-radius: var(--radius-sm, 8px);
  overflow: hidden;
  flex-shrink: 0;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.cart-item-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
}

.cart-item-card:hover .cart-item-media img {
  transform: scale(1.05);
}

/* Item Body */
.cart-item-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}

.cart-item-category-tag {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent-cyan, #06b6d4);
}

.cart-item-name {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1.25;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cart-item-variant {
  font-family: var(--font-body);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* Stepper & Unit Price Row */
.cart-item-controls {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 6px;
}

.cart-stepper {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-pill, 999px);
  padding: 2px;
}

.stepper-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: transparent;
  border: none;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 160ms ease, color 160ms ease, transform 120ms ease;
}

.stepper-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: var(--accent-cyan, #06b6d4);
}

.stepper-btn:active {
  transform: scale(0.9);
}

.stepper-val {
  min-width: 28px;
  text-align: center;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
}

.stepper-val.is-updating {
  animation: stepperValuePulse 220ms cubic-bezier(0.23, 1, 0.32, 1);
}

@keyframes stepperValuePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); color: var(--accent-cyan, #06b6d4); }
  100% { transform: scale(1); }
}

/* Right Side: Total Price & Quick Action Icons */
.cart-item-end {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
  align-self: stretch;
  padding-left: 8px;
  flex-shrink: 0;
}

.cart-item-price {
  font-family: var(--font-body);
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  margin: 0;
  letter-spacing: -0.01em;
}

.cart-item-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cart-action-icon-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: color 180ms ease, background-color 180ms ease, transform 140ms ease;
}

.cart-action-icon-btn:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.08);
}

.cart-action-icon-btn.remove-btn:hover {
  color: #FB7185;
}

.cart-action-icon-btn.wishlist-btn:hover {
  color: #F43F5E;
}

.cart-action-icon-btn:active {
  transform: scale(0.92);
}

/* ─── Skeleton Loading Cards (Motion Standard 1) ───────────────────────── */
.cart-skeleton-card {
  background: rgba(10, 18, 32, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md, 12px);
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 22px;
  position: relative;
  overflow: hidden;
  height: 171px;
}

.skeleton-shimmer-sweep {
  position: absolute;
  inset: 0;
  background: linear-gradient(115deg, transparent 0%, rgba(255, 255, 255, 0.02) 20%, rgba(255, 255, 255, 0.08) 50%, rgba(255, 255, 255, 0.02) 80%, transparent 100%);
  transform: translateX(-100%);
  animation: cartSpecularSweep 1.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  will-change: transform;
}

@keyframes cartSpecularSweep {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* ─── Curated Look Switcher & 120fps Animation Track (Spotlight) ────────── */
.cart-look-spotlight-wrap {
  margin-top: 12px;
}

.cart-curation-spotlight {
  background: rgba(10, 18, 32, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
  position: relative;
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.45);
}

.cart-spotlight-progress-track {
  width: 100%;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  position: relative;
  overflow: hidden;
}

.cart-spotlight-progress-bar {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, #06b6d4, #ec4899);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
}

.cart-spotlight-header-row {
  padding: 16px 20px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  flex-wrap: wrap;
}

.cart-spotlight-eyebrow-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-cyan, #06b6d4);
}

.cart-spotlight-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #06b6d4;
  box-shadow: 0 0 8px rgba(6, 182, 212, 0.7);
}

.cart-spotlight-pause-btn {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: 4px;
  transition: color 160ms ease;
}

.cart-spotlight-pause-btn:hover {
  color: #FFFFFF;
}

.cart-spotlight-tabs {
  display: flex;
  align-items: center;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
}

.cart-spotlight-tabs::-webkit-scrollbar {
  display: none;
}

.cart-spotlight-tab {
  background: transparent;
  border: 1px solid transparent;
  color: rgba(255, 255, 255, 0.5);
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 6px 12px;
  border-radius: var(--radius-pill, 999px);
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 180ms ease;
}

.cart-spotlight-tab:hover {
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.05);
}

.cart-spotlight-tab.active {
  color: #FFFFFF;
  background: rgba(6, 182, 212, 0.12);
  border-color: rgba(6, 182, 212, 0.3);
}

/* Spotlight Body */
.cart-spotlight-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 20px;
  gap: 24px;
  align-items: center;
}

.cart-spotlight-story {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cart-spotlight-season {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.45);
}

.cart-spotlight-title {
  font-family: var(--font-serif);
  font-size: 22px;
  font-weight: 500;
  color: #FFFFFF;
  margin: 0;
  line-height: 1.2;
}

.cart-spotlight-desc {
  font-family: var(--font-body);
  font-size: 13px;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.65);
  margin: 0 0 8px 0;
}

.cart-spotlight-actions {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 4px;
  flex-wrap: wrap;
}

.cart-spotlight-add-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.06em;
  border-radius: var(--radius-pill, 999px);
  cursor: pointer;
}

.cart-spotlight-explore-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  transition: color 180ms ease;
}

.cart-spotlight-explore-link:hover {
  color: var(--accent-cyan, #06b6d4);
}

/* Spotlight Media Frame & Floating Pill */
.cart-spotlight-media-pane {
  position: relative;
  border-radius: var(--radius-sm, 8px);
  overflow: hidden;
}

.cart-spotlight-frame {
  width: 100%;
  height: 190px;
  background: #091424;
  position: relative;
  overflow: hidden;
}

.cart-spotlight-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 600ms cubic-bezier(0.16, 1, 0.3, 1);
}

.cart-curation-spotlight:hover .cart-spotlight-img {
  transform: scale(1.04);
}

.cart-spotlight-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(8, 14, 26, 0.8) 100%);
}

.cart-floating-look-pill {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  background: rgba(8, 14, 30, 0.95);
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-pill, 999px);
  padding: 6px 14px 6px 8px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 24px -2px rgba(0, 0, 0, 0.6);
}

.pill-thumb-wrap {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  background: #091424;
  border: 1.5px solid rgba(255, 255, 255, 0.4);
  flex-shrink: 0;
}

.pill-thumb-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pill-meta-wrap {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.pill-label {
  font-family: var(--font-body);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent-cyan, #06b6d4);
}

.pill-title {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pill-price {
  font-family: var(--font-body);
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.pill-quick-add-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--accent-cyan, #06b6d4);
  border: none;
  color: #080E1A;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  transition: transform 160ms ease, background-color 160ms ease;
}

.pill-quick-add-btn:hover {
  background: #FFFFFF;
  transform: scale(1.08);
}

.pill-quick-add-btn:active {
  transform: scale(0.92);
}

/* ─── Sticky Obsidian Order Summary (Motion Standards 2 & 4) ───────────── */
.cart-summary-column {
  position: sticky;
  top: calc(var(--nav-height, 72px) + 24px);
}

.cart-summary-card {
  background: rgba(10, 18, 32, 0.85);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md, 12px);
  padding: 28px;
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.5), 0 24px 64px -8px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 18px;
  position: relative;
  overflow: hidden;
}

.cart-summary-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at var(--cart-glare-x, 50%) var(--cart-glare-y, 50%), rgba(255, 255, 255, 0.06) 0%, transparent 60%);
  opacity: var(--cart-glare-opacity, 0);
  pointer-events: none;
  transition: opacity 180ms ease;
}

.cart-summary-title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 500;
  color: #FFFFFF;
  margin: 0;
}

/* Coupon Box */
.cart-coupon-box {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.coupon-input-group {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.cart-coupon-input {
  flex: 1;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-pill, 999px);
  padding: 10px 16px;
  font-family: var(--font-body);
  font-size: 12px;
  color: #FFFFFF;
  outline: none;
  transition: border-color 180ms ease, background-color 180ms ease;
}

.cart-coupon-input:focus {
  border-color: var(--accent-cyan, #06b6d4);
  background: rgba(255, 255, 255, 0.06);
}

.cart-coupon-apply-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-pill, 999px);
  padding: 0 16px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
  cursor: pointer;
  transition: all 180ms ease;
}

.cart-coupon-apply-btn:hover {
  background: var(--accent-cyan, #06b6d4);
  border-color: var(--accent-cyan, #06b6d4);
  color: #080E1A;
}

.cart-coupon-feedback {
  font-family: var(--font-body);
  font-size: 11px;
  display: none;
}

.cart-coupon-pill-wrap {
  display: none;
  align-items: center;
  justify-content: space-between;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: var(--radius-pill, 999px);
  padding: 6px 14px;
}

.coupon-pill-label {
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: #10B981;
}

.coupon-remove-btn {
  background: transparent;
  border: none;
  color: rgba(16, 185, 129, 0.8);
  cursor: pointer;
  font-size: 16px;
  padding: 0;
  display: flex;
  align-items: center;
}

.coupon-remove-btn:hover {
  color: #FFFFFF;
}

/* Rows */
.cart-summary-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-family: var(--font-body);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.65);
}

.cart-summary-row.discount-row {
  color: #10B981;
  font-weight: 600;
}

.cart-summary-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.08);
  margin: 4px 0;
}

.cart-summary-row.cart-summary-total {
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.01em;
}

.cart-checkout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  height: 50px;
  border-radius: var(--radius-pill, 999px);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-decoration: none;
  background: #FFFFFF;
  color: #080E1A;
  position: relative;
  overflow: hidden;
  transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease;
  box-shadow: 0 4px 16px rgba(255, 255, 255, 0.15);
}

.cart-checkout-btn:hover {
  background: var(--accent-cyan, #06b6d4);
  color: #080E1A;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(6, 182, 212, 0.35);
}

.cart-checkout-btn:active {
  transform: translateY(0);
}

.cart-summary-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 6px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 14px;
}

.cart-meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.cart-meta-item i {
  color: var(--accent-cyan, #06b6d4);
  flex-shrink: 0;
}

/* ─── Empty Bag Fallback ────────────────────────────────────────────────── */
.cart-empty-canvas {
  background: rgba(10, 18, 32, 0.7);
  backdrop-filter: blur(14px);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--radius-md, 12px);
  padding: 80px 24px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  max-width: 640px;
  margin: 0 auto;
  box-shadow: 0 8px 32px -4px rgba(0, 0, 0, 0.4);
}

.cart-empty-icon-wrap {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-cyan, #06b6d4);
  margin-bottom: 4px;
}

.cart-empty-headline {
  font-family: var(--font-serif);
  font-size: 32px;
  font-weight: 500;
  color: #FFFFFF;
  margin: 0;
}

.cart-empty-sub {
  font-family: var(--font-body);
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  max-width: 440px;
  margin: 0 0 12px 0;
  line-height: 1.5;
}

.cart-empty-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.empty-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 22px;
  font-size: 12px;
  border-radius: var(--radius-pill, 999px);
  text-decoration: none;
}

/* ─── Mobile Sticky Bar (375px) ────────────────────────────────────────── */
.mobile-cart-sticky-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(8, 14, 26, 0.96);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 12px 20px calc(12px + env(safe-area-inset-bottom, 0px));
  z-index: 990;
  transform: translateY(100%);
  transition: transform 280ms cubic-bezier(0.16, 1, 0.3, 1);
}

.mobile-cart-sticky-bar.visible {
  transform: translateY(0);
}

.mobile-sticky-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 500px;
  margin: 0 auto;
}

.mobile-sticky-meta {
  display: flex;
  flex-direction: column;
}

.mobile-sticky-label {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
}

.mobile-sticky-total {
  font-family: var(--font-body);
  font-size: 18px;
  font-weight: 700;
  color: #FFFFFF;
}

.mobile-sticky-checkout-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  border-radius: var(--radius-pill, 999px);
  text-decoration: none;
  background: #FFFFFF;
  color: #080E1A;
}

/* ─── Responsive Breakpoints ───────────────────────────────────────────── */
@media (max-width: 1024px) {
  .cart-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
  .cart-summary-column {
    position: static;
  }
}

@media (max-width: 768px) {
  .cart-spotlight-body {
    grid-template-columns: 1fr;
  }
  .cart-spotlight-header-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .cart-spotlight-tabs {
    width: 100%;
  }
  .cart-item-card {
    padding: 14px;
    gap: 16px;
  }
  .cart-item-media {
    width: 90px;
    height: 112px;
  }
  .cart-main-container {
    padding-bottom: 140px;
  }
}

@media (max-width: 480px) {
  .cart-item-card {
    flex-wrap: wrap;
  }
  .cart-item-end {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding-left: 0;
    margin-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    padding-top: 10px;
  }
}
```

- [ ] **Step 2: Verify CSS builds and passes syntax validation**

---

### Task 3: Enhance Cart Controller & Curated Look Engine in `js/cart.js`

**Files:**
- Modify: `js/cart.js`

**Interfaces:**
- Consumes: `localStorage.getItem('nex_cart')`, `CATALOG_DB` (from `ai-engine.js`), `window.initCartCardsMotion()`.
- Produces: `CartState.renderPage()` with luxury obsidian cards, 120fps express delivery milestone calculation, 280ms specular skeleton entrance, Look Switcher auto-cycle engine (6.5s) with pause/resume, quantity stepper bounce, remove animation, and mobile sticky checkout sync.

- [ ] **Step 1: Update `js/cart.js` implementation**

Replace the contents of `js/cart.js` with the comprehensive, motion-integrated state machine and look switcher engine:

```javascript
/* nexCommerce Shopping Bag & Cart State Manager (Modernized with 4 Motion Standards) */

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _resolvePage(page) {
  const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
  if (page === 'index.html') return isSubpage ? '../index.html' : 'index.html';
  return isSubpage ? page : 'pages/' + page;
}
window._resolvePage = _resolvePage;

// ─── Cart-page Coupon Engine ────────────────────────────────────────────────
const CART_PROMO_CODES = {
  'NEX10':    { label: 'NEX10 — 10% off',         type: 'percent',  value: 10 },
  'LUXURY20': { label: 'LUXURY20 — 20% off',       type: 'percent',  value: 20 },
  'FREESHIP': { label: 'FREESHIP — Free Shipping',  type: 'shipping', value: 0  }
};
let cartActiveCoupon = null;

function cartApplyCoupon() {
  const input    = document.getElementById('cart-coupon-input');
  const feedback = document.getElementById('cart-coupon-feedback');
  if (!input) return;
  const code = (input.value || '').trim().toUpperCase();
  if (!code) return;
  const promo = CART_PROMO_CODES[code];
  if (!promo) {
    if (feedback) { 
      feedback.textContent = "This code isn't valid or has expired."; 
      feedback.style.display = 'block'; 
      feedback.style.color = '#FB7185'; 
    }
    input.style.borderColor = '#FB7185';
    return;
  }
  cartActiveCoupon = { code, ...promo };
  input.value = '';
  input.style.borderColor = '';
  if (feedback) feedback.style.display = 'none';
  nexCart.renderPage();
}
window.cartApplyCoupon = cartApplyCoupon;

function cartRemoveCoupon() {
  cartActiveCoupon = null;
  nexCart.renderPage();
}
window.cartRemoveCoupon = cartRemoveCoupon;

// ─── Curated Look Switcher 4 Signature Capsules ──────────────────────────────
const CART_CURATED_LOOKS = [
  {
    id: 'look-0',
    index: 0,
    tabLabel: '01 TAILORING',
    eyebrow: 'COMPLIMENTARY PAIRING · 01 OF 04',
    season: 'ATELIER EDIT · AW26',
    title: 'Architectural Cashmere Layer',
    desc: 'Handcrafted 2-ply Mongolian cashmere with seamless dropped shoulder tailoring for effortless warmth and structure.',
    productId: 'p1',
    productName: 'Architectural Cashmere Sweater',
    price: 18400,
    priceFormatted: 'BDT 18,400',
    lifestyleImg: '../assets/images/lifestyle/hero_sweater_landscape.jpg',
    productThumb: '../assets/images/products/hero_sweater.png',
    category: 'Apparel'
  },
  {
    id: 'look-1',
    index: 1,
    tabLabel: '02 LEATHER',
    eyebrow: 'COMPLIMENTARY PAIRING · 02 OF 04',
    season: 'LEATHER GOODS · SS26',
    title: 'Structured Tuscan Weekender',
    desc: 'Full-grain vegetable-tanned Tuscan calfskin paired with hand-stitched palladium hardware and reinforced base corners.',
    productId: 'p6',
    productName: 'Structured Leather Weekender',
    price: 42000,
    priceFormatted: 'BDT 42,000',
    lifestyleImg: '../assets/images/lifestyle/tote_lifestyle.jpg',
    productThumb: '../assets/images/products/leather_bag.png',
    category: 'Leather Goods'
  },
  {
    id: 'look-2',
    index: 2,
    tabLabel: '03 ACOUSTICS',
    eyebrow: 'COMPLIMENTARY PAIRING · 03 OF 04',
    season: 'HIGH ACOUSTICS · 2026',
    title: 'Studio Acoustics Headphone GT',
    desc: 'Custom 40mm beryllium drivers enclosed in machined aerospace aluminium for studio-grade acoustic depth and isolation.',
    productId: 'p4',
    productName: 'Studio Acoustics Headphone GT',
    price: 32000,
    priceFormatted: 'BDT 32,000',
    lifestyleImg: '../assets/images/lifestyle/lifestyle_headphones.jpg',
    productThumb: '../assets/images/products/headphones_anc.png',
    category: 'High Acoustics'
  },
  {
    id: 'look-3',
    index: 3,
    tabLabel: '04 HOROLOGY',
    eyebrow: 'COMPLIMENTARY PAIRING · 04 OF 04',
    season: 'HOROLOGY · 2026',
    title: 'Minimal Titanium Automatic',
    desc: 'Grade 5 satin-brushed titanium case housing an ultra-thin 28,800 vph automatic caliber with 70-hour power reserve.',
    productId: 'p5',
    productName: 'Minimal Titanium Automatic',
    price: 68000,
    priceFormatted: 'BDT 68,000',
    lifestyleImg: '../assets/images/lifestyle/hero_watch_landscape.jpg',
    productThumb: '../assets/images/products/minimalist_watch.png',
    category: 'Horology'
  }
];

// ─── Look Switcher 120fps Controller ─────────────────────────────────────────
const CartLookController = {
  activeLookIndex: 0,
  cycleDuration: 6500, // 6.5s per capsule
  startTime: null,
  rafId: null,
  isPaused: false,
  hasInitialized: false,

  init() {
    if (this.hasInitialized) return;
    const wrap = document.getElementById('cartLookSwitcherWrap');
    if (!wrap) return;
    this.hasInitialized = true;

    this.bindEvents();
    this.renderLook(0);
    this.startCycle();
  },

  bindEvents() {
    const wrap = document.getElementById('cartLookSwitcherWrap');
    if (!wrap) return;

    // Pause on hover / touch
    wrap.addEventListener('mouseenter', () => { this.isPaused = true; });
    wrap.addEventListener('mouseleave', () => { 
      const pauseBtn = document.getElementById('cartSpotlightPauseBtn');
      if (pauseBtn && pauseBtn.getAttribute('aria-pressed') === 'true') return;
      this.isPaused = false; 
    });
    wrap.addEventListener('touchstart', () => { this.isPaused = true; }, { passive: true });

    // Pause toggle button
    const pauseBtn = document.getElementById('cartSpotlightPauseBtn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        const isCurrentlyPressed = pauseBtn.getAttribute('aria-pressed') === 'true';
        pauseBtn.setAttribute('aria-pressed', String(!isCurrentlyPressed));
        this.isPaused = !isCurrentlyPressed;
        const icon = document.getElementById('cartSpotlightPauseIcon');
        if (icon) {
          icon.setAttribute('data-lucide', !isCurrentlyPressed ? 'play' : 'pause');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // Tab buttons
    const tabs = document.querySelectorAll('.cart-spotlight-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const idx = parseInt(tab.getAttribute('data-look'), 10);
        if (!isNaN(idx)) {
          this.activeLookIndex = idx;
          this.renderLook(idx);
          this.startTime = performance.now();
        }
      });
    });

    // Quick Add from spotlight
    const addBtn = document.getElementById('cartSpotlightAddBtn');
    const pillAddBtn = document.getElementById('cartPillQuickAddBtn');

    const handleQuickAdd = (e) => {
      e.preventDefault();
      const look = CART_CURATED_LOOKS[this.activeLookIndex];
      if (!look) return;

      CartState.addItem({
        id: look.productId,
        name: look.productName,
        price: look.price,
        image: look.productThumb,
        category: look.category
      }, 1, 'Standard');

      // Tactile button animation
      const targetBtn = e.currentTarget;
      targetBtn.style.transform = 'scale(0.92)';
      setTimeout(() => { targetBtn.style.transform = ''; }, 160);
    };

    if (addBtn) addBtn.addEventListener('click', handleQuickAdd);
    if (pillAddBtn) pillAddBtn.addEventListener('click', handleQuickAdd);
  },

  renderLook(index) {
    const look = CART_CURATED_LOOKS[index];
    if (!look) return;

    // Update Eyebrow, Season, Title, Desc
    const eyebrowEl = document.getElementById('cartSpotlightLookEyebrow');
    const seasonEl  = document.getElementById('cartSpotlightSeason');
    const titleEl   = document.getElementById('cartSpotlightTitle');
    const descEl    = document.getElementById('cartSpotlightDesc');
    const btnTextEl = document.getElementById('cartSpotlightBtnText');
    const imgEl     = document.getElementById('cartSpotlightImg');

    const pillThumb = document.getElementById('cartPillThumb');
    const pillTitle = document.getElementById('cartPillTitle');
    const pillPrice = document.getElementById('cartPillPrice');

    if (eyebrowEl) eyebrowEl.textContent = look.eyebrow;
    if (seasonEl)  seasonEl.textContent  = look.season;
    if (titleEl)   titleEl.textContent   = look.title;
    if (descEl)    descEl.textContent    = look.desc;
    if (btnTextEl) btnTextEl.textContent = `Quick Add · ${look.priceFormatted}`;

    if (imgEl && imgEl.src !== look.lifestyleImg) {
      imgEl.style.opacity = '0.4';
      imgEl.style.transform = 'scale(1.04)';
      setTimeout(() => {
        imgEl.src = look.lifestyleImg;
        imgEl.style.opacity = '1';
        imgEl.style.transform = 'scale(1)';
      }, 140);
    }

    if (pillThumb) pillThumb.src = look.productThumb;
    if (pillTitle) pillTitle.textContent = look.productName;
    if (pillPrice) pillPrice.textContent = look.priceFormatted;

    // Update active tab
    const tabs = document.querySelectorAll('.cart-spotlight-tab');
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  },

  startCycle() {
    this.startTime = performance.now();
    const bar = document.getElementById('cartSpotlightProgressBar');

    const step = (now) => {
      if (!this.isPaused) {
        const elapsed = now - this.startTime;
        const progress = Math.min(1, elapsed / this.cycleDuration);

        if (bar) {
          bar.style.transform = `scaleX(${progress.toFixed(4)})`;
        }

        if (progress >= 1) {
          this.activeLookIndex = (this.activeLookIndex + 1) % CART_CURATED_LOOKS.length;
          this.renderLook(this.activeLookIndex);
          this.startTime = now;
        }
      } else {
        this.startTime = now; // hold timestamp while paused
      }
      this.rafId = requestAnimationFrame(step);
    };

    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(step);
  }
};

// ─── Main Cart State Machine ────────────────────────────────────────────────
const CartState = {
  items: [],
  hasRenderedSkeletons: false,

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.updateBadge();
    
    // Check if on cart page
    if (document.getElementById('cartGrid')) {
      this.bootCartPage();
    } else {
      this.renderMiniCart();
    }
  },

  loadFromStorage() {
    try {
      const raw = localStorage.getItem('nex_cart');
      this.items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(this.items)) this.items = [];
    } catch (e) {
      console.warn('Invalid cart storage data, resetting cart.', e);
      this.items = [];
    }
  },

  updateBadge() {
    const count = this.getTotalCount();
    const badges = document.querySelectorAll('#headerCartCount, #mobileCartCount, .bag-count-badge, #header-bag-count, #bag-count, .bag-badge, .nav-cart-badge');
    badges.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  getCount() {
    return this.getTotalCount();
  },

  save() {
    try {
      localStorage.setItem('nex_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
    this.updateBadge();
    this.renderPage();
    this.renderMiniCart();
  },

  addItem(product, quantity = 1, variant = 'Standard') {
    const existing = this.items.find(i => i.id === product.id && i.variant === variant);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name || product.title,
        price: Number(product.price) || (typeof product.price === 'string' ? parseInt(product.price.replace(/[^\d]/g, ''), 10) : 0),
        image: product.image || product.img,
        category: product.category || 'Apparel',
        variant: variant,
        quantity: quantity
      });
    }
    this.save();
  },

  updateQuantity(id, variant, delta) {
    const item = this.items.find(i => i.id === id && i.variant === variant);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.removeItem(id, variant);
    } else {
      this.save();
    }
  },

  removeItem(id, variant) {
    const row = document.querySelector(`.cart-item-card[data-id="${id}"][data-variant="${encodeURIComponent(variant)}"]`);
    if (row) {
      row.classList.add('is-removing');
      setTimeout(() => {
        this.items = this.items.filter(i => !(i.id === id && i.variant === variant));
        this.save();
      }, 240);
    } else {
      this.items = this.items.filter(i => !(i.id === id && i.variant === variant));
      this.save();
    }
  },

  saveToWishlist(id) {
    try {
      const raw = localStorage.getItem('nex_wishlist');
      let list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem('nex_wishlist', JSON.stringify(list));
      }
      const wishBadge = document.getElementById('headerWishlistCount');
      if (wishBadge) {
        wishBadge.textContent = list.length;
        wishBadge.style.display = list.length > 0 ? 'inline-flex' : 'none';
      }
    } catch (e) {
      console.warn('Wishlist storage update failed', e);
    }
  },

  getTotal() {
    return this.items.reduce((sum, i) => sum + (Number(i.price) || 0) * (parseInt(i.quantity || i.qty, 10) || 1), 0);
  },

  getTotalCount() {
    return this.items.reduce((sum, i) => sum + (parseInt(i.quantity || i.qty, 10) || 1), 0);
  },

  bindEvents() {
    // Mini cart triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cart-trigger, .cart-trigger, #headerCartLink');
      if (trigger && !window.location.pathname.includes('cart.html')) {
        e.preventDefault();
        this.openMiniCart();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('#minicartCloseBtn') || e.target.closest('#nexMiniCartOverlay')) {
        this.closeMiniCart();
      }
    });
  },

  openMiniCart() {
    const drawer = document.getElementById('nexMiniCartDrawer');
    const overlay = document.getElementById('nexMiniCartOverlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('visible');
      if (window._nexLenis) window._nexLenis.stop();
    }
  },

  closeMiniCart() {
    const drawer = document.getElementById('nexMiniCartDrawer');
    const overlay = document.getElementById('nexMiniCartOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('visible');
      if (window._nexLenis) window._nexLenis.start();
    }
  },

  /* ─── Cart Page Boot with 280ms Specular Skeletons ──────────────────────── */
  bootCartPage() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const itemsList = document.getElementById('cartItemsList');

    if (this.items.length === 0 || prefersReduced || this.hasRenderedSkeletons) {
      this.renderPage();
      CartLookController.init();
      return;
    }

    this.hasRenderedSkeletons = true;
    if (itemsList) {
      itemsList.innerHTML = Array(Math.min(this.items.length, 3)).fill(0).map(() => `
        <div class="cart-skeleton-card" aria-hidden="true">
          <div class="skeleton-shimmer-sweep"></div>
        </div>
      `).join('');
    }

    setTimeout(() => {
      this.renderPage();
      CartLookController.init();
    }, 280);
  },

  /* ─── Full Cart Page Renderer ───────────────────────────────────────────── */
  renderPage() {
    this.updateBadge();

    const itemCountEl = document.getElementById('cartItemCount');
    const cartGrid    = document.getElementById('cartGrid');
    const emptyArea   = document.getElementById('cartEmptyArea');
    const itemsList   = document.getElementById('cartItemsList');
    const summaryArea = document.getElementById('cartSummaryArea');
    const capsuleEl   = document.getElementById('cartDeliveryCapsule');

    if (!cartGrid) return;

    const count = this.getTotalCount();
    const total = this.getTotal();

    if (itemCountEl) {
      itemCountEl.textContent = count === 1 ? '1 piece selected' : `${count} pieces selected`;
    }

    // If empty
    if (this.items.length === 0) {
      cartGrid.style.display  = 'none';
      if (capsuleEl) capsuleEl.style.display = 'none';
      if (emptyArea) emptyArea.style.display = 'flex';
      
      const stickyBar = document.getElementById('mobileCartStickyBar');
      if (stickyBar) stickyBar.classList.remove('visible');
      return;
    }

    cartGrid.style.display  = 'grid';
    if (capsuleEl) capsuleEl.style.display = 'block';
    if (emptyArea) emptyArea.style.display = 'none';

    // 1. Update 120fps Delivery Progress Milestone
    const FREE_SHIPPING_THRESHOLD = 20000;
    const diff = FREE_SHIPPING_THRESHOLD - total;
    const progress = Math.min(1, total / FREE_SHIPPING_THRESHOLD);

    const progressBar = document.getElementById('cartDeliveryProgressBar');
    const statusText  = document.getElementById('deliveryStatusText');
    const capsuleBox  = document.getElementById('cartDeliveryCapsule');
    const statusDot   = document.getElementById('deliveryStatusDot');

    if (progressBar) progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;

    if (diff <= 0) {
      if (statusText) statusText.innerHTML = '<span style="color:#10B981;font-weight:600;">✓ Complimentary Express Delivery Unlocked</span>';
      if (capsuleBox) capsuleBox.classList.add('unlocked');
    } else {
      if (statusText) statusText.innerHTML = `Add <strong style="color:#06b6d4;">BDT ${diff.toLocaleString()}</strong> more for Complimentary Express Delivery`;
      if (capsuleBox) capsuleBox.classList.remove('unlocked');
    }

    // 2. Render Cart Item Rows
    const isInPages = window.location.pathname.includes('/pages/');
    const self = this;

    itemsList.innerHTML = this.items.map(item => {
      let imgSrc = item.image || '';
      if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('../') && !imgSrc.startsWith('/')) {
        imgSrc = imgSrc.replace(/^assets\//, '');
        if (!imgSrc.includes('/')) {
          const lifestyleNames = ['runner_lifestyle', 'tote_lifestyle', 'hero_watch_landscape', 'lifestyle'];
          const isLifestyle = lifestyleNames.some(n => imgSrc.includes(n));
          imgSrc = (isLifestyle ? 'images/lifestyle/' : 'images/products/') + imgSrc;
        }
        imgSrc = (isInPages ? '../' : '') + 'assets/' + imgSrc;
      }

      return `
        <div class="cart-item-card" data-id="${item.id}" data-variant="${encodeURIComponent(item.variant || 'Standard')}" data-parallax-depth="0.04">
          <div class="cart-item-media">
            <img src="${imgSrc}" alt="${escapeHtml(item.name)}" loading="lazy" />
          </div>
          <div class="cart-item-body">
            <span class="cart-item-category-tag">${escapeHtml(item.category || 'Atelier Selection')}</span>
            <h3 class="cart-item-name">${escapeHtml(item.name)}</h3>
            <p class="cart-item-variant">${escapeHtml(item.variant || 'Standard')}</p>
            <div class="cart-item-controls">
              <div class="cart-stepper">
                <button class="stepper-btn" data-action="dec" aria-label="Decrease quantity">&minus;</button>
                <span class="stepper-val">${item.quantity}</span>
                <button class="stepper-btn" data-action="inc" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
          <div class="cart-item-end">
            <span class="cart-item-price">BDT ${(item.price * item.quantity).toLocaleString()}</span>
            <div class="cart-item-actions">
              <button class="cart-action-icon-btn wishlist-btn" data-action="wishlist" title="Save for Later" aria-label="Save for Later">
                <i data-lucide="heart" style="width: 15px; height: 15px;"></i>
              </button>
              <button class="cart-action-icon-btn remove-btn" data-action="remove" title="Remove item" aria-label="Remove item">
                <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Row Listeners
    itemsList.querySelectorAll('.cart-item-card').forEach(row => {
      const id = row.getAttribute('data-id');
      const variant = decodeURIComponent(row.getAttribute('data-variant'));

      row.querySelector('[data-action="dec"]').addEventListener('click', () => { self.updateQuantity(id, variant, -1); });
      row.querySelector('[data-action="inc"]').addEventListener('click', () => { self.updateQuantity(id, variant, 1); });
      row.querySelector('[data-action="remove"]').addEventListener('click', () => { self.removeItem(id, variant); });
      
      const wishBtn = row.querySelector('[data-action="wishlist"]');
      if (wishBtn) {
        wishBtn.addEventListener('click', () => {
          self.saveToWishlist(id);
          wishBtn.style.color = '#F43F5E';
          wishBtn.style.transform = 'scale(1.2)';
          setTimeout(() => { wishBtn.style.transform = ''; }, 200);
        });
      }
    });

    // 3. Render Order Summary
    let discountAmt = 0;
    if (cartActiveCoupon && cartActiveCoupon.type === 'percent') {
      discountAmt = Math.round(total * cartActiveCoupon.value / 100);
    }
    const freeShipCoupon  = cartActiveCoupon && cartActiveCoupon.type === 'shipping';
    const deliveryCost    = (total >= FREE_SHIPPING_THRESHOLD || freeShipCoupon) ? 0 : 150;
    const discountedTotal = total - discountAmt;
    const grandTotal      = discountedTotal + deliveryCost;

    const deliveryHtml = deliveryCost === 0
      ? '<span style="color:#10B981;font-weight:700;">FREE</span>'
      : `BDT ${deliveryCost.toLocaleString()}`;

    const pillDisplay    = cartActiveCoupon ? 'flex' : 'none';
    const inputDisplay   = cartActiveCoupon ? 'none' : 'flex';
    const pillLabelText  = cartActiveCoupon ? cartActiveCoupon.label : '';
    
    const discountRowHtml = discountAmt > 0
      ? `<div class="cart-summary-row discount-row"><span>${cartActiveCoupon ? cartActiveCoupon.label : 'Discount'}</span><span>&minus;BDT ${discountAmt.toLocaleString()}</span></div>`
      : '';

    summaryArea.innerHTML = `
      <div class="cart-summary-card">
        <h2 class="cart-summary-title">Order Summary</h2>

        <div class="cart-coupon-box">
          <div class="coupon-input-group" id="cart-coupon-input-row" style="display: ${inputDisplay};">
            <input type="text" id="cart-coupon-input" class="cart-coupon-input" placeholder="Promo or gift code" maxlength="20" autocomplete="off" onkeydown="if(event.key==='Enter') cartApplyCoupon()">
            <button class="cart-coupon-apply-btn" onclick="cartApplyCoupon()">Apply</button>
          </div>
          <div id="cart-coupon-feedback" class="cart-coupon-feedback"></div>
          <div id="cart-coupon-pill-wrap" class="cart-coupon-pill-wrap" style="display: ${pillDisplay};">
            <span class="coupon-pill-label" id="cart-coupon-pill-label">${pillLabelText}</span>
            <button class="coupon-remove-btn" onclick="cartRemoveCoupon()" aria-label="Remove promo code">&times;</button>
          </div>
        </div>

        <div class="cart-summary-row">
          <span>Subtotal (${count} ${count === 1 ? 'item' : 'items'})</span>
          <span style="color:#FFFFFF;font-weight:600;">BDT ${total.toLocaleString()}</span>
        </div>

        ${discountRowHtml}

        <div class="cart-summary-row">
          <span>Estimated Express Delivery</span>
          <span>${deliveryHtml}</span>
        </div>

        <div class="cart-summary-divider"></div>

        <div class="cart-summary-row cart-summary-total">
          <span>Total Due</span>
          <span style="color:#FFFFFF;">BDT ${grandTotal.toLocaleString()}</span>
        </div>

        <a href="checkout.html" class="cart-checkout-btn" id="cartCheckoutBtn">
          <span>PROCEED TO CHECKOUT</span>
          <i data-lucide="arrow-right" style="width: 15px; height: 15px;"></i>
        </a>

        <div class="cart-summary-meta">
          <div class="cart-meta-item">
            <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i>
            <span>30-Day Complimentary Returns & Exchanges</span>
          </div>
          <div class="cart-meta-item">
            <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i>
            <span>100% Certified Authentic Maison Sourcing</span>
          </div>
          <div class="cart-meta-item">
            <i data-lucide="lock" style="width: 14px; height: 14px;"></i>
            <span>Encrypted 256-bit Secure Checkout</span>
          </div>
        </div>
      </div>
    `;

    // 4. Update Mobile Sticky Bar
    const mobileStickyBar = document.getElementById('mobileCartStickyBar');
    const mobileStickyTotal = document.getElementById('mobileStickyTotal');
    if (mobileStickyBar) {
      mobileStickyBar.classList.add('visible');
      if (mobileStickyTotal) mobileStickyTotal.textContent = `BDT ${grandTotal.toLocaleString()}`;
    }

    if (window.lucide) window.lucide.createIcons();

    // 5. Trigger Motion Hooks
    if (typeof window.initCartCardsMotion === 'function') {
      window.initCartCardsMotion();
    }
  },

  /* ─── Mini Cart Drawer Renderer ─────────────────────────────────────────── */
  renderMiniCart() {
    const mcBody = document.getElementById('minicartBody');
    const mcSubtotal = document.getElementById('minicartSubtotalValue');
    const mcFooter = document.getElementById('minicartFooter');

    if (!mcBody) return;

    const count = this.getTotalCount();
    const total = this.getTotal();

    if (count === 0) {
      mcBody.innerHTML = `
        <div class="minicart-empty" style="text-align: center; padding: 48px 16px;">
          <h3 style="font-family: var(--font-serif); font-size: 20px; color: #fff; margin-bottom: 8px;">Your bag is empty</h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 16px;">Discover pieces curated around how you want to dress.</p>
          <a href="${_resolvePage('discovery.html')}" class="btn-primary-commerce" onclick="nexCart.closeMiniCart()" style="display:inline-block; padding: 10px 20px; font-size: 12px;">EXPLORE DISCOVERY &rarr;</a>
        </div>
      `;
      if (mcFooter) mcFooter.style.display = 'none';
      return;
    }

    if (mcFooter) {
      mcFooter.style.display = 'block';
      if (mcSubtotal) mcSubtotal.textContent = `BDT ${total.toLocaleString()}`;
    }

    const isInPages = window.location.pathname.includes('/pages/');
    const self = this;

    mcBody.innerHTML = this.items.map(item => {
      let imgSrc = item.image || '';
      if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('../') && !imgSrc.startsWith('/')) {
        imgSrc = imgSrc.replace(/^assets\//, '');
        if (!imgSrc.includes('/')) {
          const lifestyleNames = ['runner_lifestyle', 'tote_lifestyle', 'hero_watch_landscape', 'lifestyle'];
          const isLifestyle = lifestyleNames.some(n => imgSrc.includes(n));
          imgSrc = (isLifestyle ? 'images/lifestyle/' : 'images/products/') + imgSrc;
        }
        imgSrc = (isInPages ? '../' : '') + 'assets/' + imgSrc;
      }

      return `
        <div class="mc-item-row" data-id="${item.id}" data-variant="${encodeURIComponent(item.variant || 'Standard')}">
          <img src="${imgSrc}" alt="${escapeHtml(item.name)}" class="mc-item-img">
          <div class="mc-item-details">
            <div class="mc-item-title">${escapeHtml(item.name)}</div>
            <div class="mc-item-variant">${escapeHtml(item.variant || 'Standard')} &middot; Qty: ${item.quantity}</div>
            <div class="mc-item-bottom">
              <div class="mc-item-price">BDT ${(item.price * item.quantity).toLocaleString()}</div>
              <button class="mc-remove-btn" data-action="remove">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    mcBody.querySelectorAll('.mc-item-row').forEach(row => {
      const id = row.getAttribute('data-id');
      const variant = decodeURIComponent(row.getAttribute('data-variant'));
      row.querySelector('[data-action="remove"]').addEventListener('click', () => {
        self.removeItem(id, variant);
      });
    });
  }
};

window.nexCart = CartState;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { CartState.init(); });
} else {
  CartState.init();
}
```

- [ ] **Step 2: Verify `CartState` methods and look switcher events run cleanly**

---

### Task 4: Implement Cart Motion Hooks & Parallax in `js/animations.js`

**Files:**
- Modify: `js/animations.js`

**Interfaces:**
- Consumes: Rendered cart item cards, Look Switcher frame, summary card.
- Produces: `initCartPageMotion()` and `initCartCardsMotion()`, wiring 3D mouse tilt physics, specular glare tracking, differential scroll parallax, and GPU cross-dissolve route transitions.

- [ ] **Step 1: Add `initCartPageMotion()` and `initCartCardsMotion()` to `js/animations.js`**

Add the cart motion controller functions and export them in `js/animations.js`:

```javascript
/**
 * initCartPageMotion
 * Motion Standards for the Shopping Bag (Cart) page:
 * 1. Micro-interactions: 120fps GPU Express Delivery Progress Bar & Curated Look Switcher sync.
 * 2. 3D Hover Effects:   Spring LERP mouse tilt physics + dynamic specular glare.
 * 3. Page Transitions:   GPU cross-dissolve curtain (#pageTransitionOverlay) on checkout navigation.
 * 4. Scroll Parallax:    Differential column depth on scroll between cart items and order summary.
 */
function initCartPageMotion() {
  const cartGrid = document.getElementById('cartGrid');
  if (!cartGrid) return;

  initCartCardsMotion();

  if (cartGrid._cartParallaxBound) return;
  cartGrid._cartParallaxBound = true;

  // 4. SCROLL PARALLAX: Differential Column Depth (Lenis + rAF)
  let pxTicking = false;

  function updateCartParallax() {
    if (!cartGrid) { pxTicking = false; return; }

    const rect = cartGrid.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span = winH + rect.height;
      const prog = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;     // -1 → +1

      const cards = cartGrid.querySelectorAll('.cart-item-card');
      cards.forEach(card => {
        const depth = parseFloat(card.getAttribute('data-parallax-depth') || '0.04');
        const travel = depth * 120; // px differential travel
        const yCard = parseFloat((centered * travel).toFixed(2));
        card._parallaxY = yCard;

        if (!card._isHovered) {
          card.style.transform = `translateY(${yCard}px)`;
        }
      });
    }
    pxTicking = false;
  }

  function requestCartParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateCartParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) {
    window._nexLenis.on('scroll', requestCartParallaxTick);
  }
  window.addEventListener('scroll', requestCartParallaxTick, { passive: true });
}

/**
 * initCartCardsMotion
 * Binds 3D Hover physics, Specular Glare, and GPU Page Transitions to cart item cards and summary.
 */
function initCartCardsMotion() {
  const cartGrid = document.getElementById('cartGrid');
  if (!cartGrid) return;

  const cards = Array.from(cartGrid.querySelectorAll('.cart-item-card, .cart-summary-card, .cart-curation-spotlight'));
  if (cards.length === 0) return;

  const curtain = document.getElementById('pageTransitionOverlay');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  // 1. MICRO-INTERACTIONS: Staggered entrance
  if (!prefersReduced && window.animate && window.stagger) {
    const unrevealed = cards.filter(c => !c._hasEntranceRun);
    if (unrevealed.length > 0) {
      unrevealed.forEach(c => { c._hasEntranceRun = true; });
      animate(unrevealed,
        { opacity: [0, 1], y: [16, 0], scale: [0.98, 1] },
        { delay: stagger(0.05, { startDelay: 0.04 }), duration: 0.65, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }

  // 2. 3D HOVER PHYSICS: Spring LERP Tilt & Dynamic Cursor Specular Glare
  if (!prefersReduced && !isTouch) {
    const MAX_TILT = 5.0; // degrees
    const lerp = (a, b, t) => a + (b - a) * t;

    cards.forEach(card => {
      if (card._hasMotionBound) return;
      card._hasMotionBound = true;

      let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0, rafId = null;
      card._isHovered = false;
      card._parallaxY = 0;

      function applyTilt() {
        curTX = lerp(curTX, tgtTX, 0.12);
        curTY = lerp(curTY, tgtTY, 0.12);
        const py = card._parallaxY || 0;
        card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(8px) translateY(${py}px)`;
        if (Math.abs(curTX - tgtTX) > 0.01 || Math.abs(curTY - tgtTY) > 0.01) {
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = null;
        }
      }

      card.addEventListener('mouseenter', () => { card._isHovered = true; });

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tgtTX = -(dy * MAX_TILT);
        tgtTY = (dx * MAX_TILT);

        const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        card.style.setProperty('--cart-glare-x', gx);
        card.style.setProperty('--cart-glare-y', gy);
        card.style.setProperty('--cart-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        card._isHovered = false;
        tgtTX = 0; tgtTY = 0;
        card.style.setProperty('--cart-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.16);
          curTY = lerp(curTY, 0, 0.16);
          const py = card._parallaxY || 0;
          card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(0px) translateY(${py}px)`;
          if (Math.abs(curTX) > 0.02 || Math.abs(curTY) > 0.02) {
            rafId = requestAnimationFrame(springBack);
          } else {
            card.style.transform = `translateY(${py}px)`;
            rafId = null;
          }
        }
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(springBack);
      });
    });
  }

  // 3. GPU PAGE TRANSITIONS: Smooth Cross-Dissolve Curtain on Checkout & Links
  function triggerCartPageTransition(href) {
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(() => {
      window.location.href = href;
    }, 210);
  }

  const checkoutBtns = document.querySelectorAll('#cartCheckoutBtn, #mobileStickyCheckoutBtn');
  checkoutBtns.forEach(btn => {
    if (btn._hasNavBound) return;
    btn._hasNavBound = true;
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
        e.preventDefault();
        triggerCartPageTransition(href);
      }
    });
  });
}

window.initCartPageMotion = initCartPageMotion;
window.initCartCardsMotion = initCartCardsMotion;
```

- [ ] **Step 2: Connect `initCartPageMotion()` into `initAllMotion()` inside `js/animations.js`**

Ensure `initCartPageMotion()` is called inside `initAllMotion()`.

---

### Task 5: End-to-End Verification & Browser SQA Testing

**Files:**
- Test: `http://localhost:8843/pages/cart.html`

- [ ] **Step 1: Verify 1440px Desktop View**
  - Navigate to `http://localhost:8843/pages/cart.html`.
  - Confirm header clearance: no overlapping of cart title or delivery milestone capsule.
  - Verify 120fps Express Delivery Progress Bar reflects subtotal and dynamically unlocks at BDT 20,000+.
  - Verify Curated Look Switcher 120fps progress track smoothly advances every 6.5s and pauses on hover/touch.
  - Test clicking Look Switcher tabs (`01 TAILORING`, `02 LEATHER`, `03 ACOUSTICS`, `04 HOROLOGY`) to confirm instant content update.
  - Test 3D mouse tilt and specular glare on cart cards and order summary.

- [ ] **Step 2: Verify Cart Interactivity & Calculations**
  - Test Quantity Stepper (`-` and `+`): check value pulse animation and instant subtotal recalculation.
  - Test Promo Code: Enter `NEX10` (10% off), `LUXURY20` (20% off), or `FREESHIP`. Confirm pill morph and discount row rendering.
  - Test Remove Item: Confirm graceful slide-out animation before removal from state.
  - Test Quick-Add from Curated Look Switcher: Confirm new item appears in bag with live recalculation.

- [ ] **Step 3: Verify Responsive Breakpoints**
  - 1024px Tablet Landscape: Confirm 1-column stack with sticky summary becoming natural block.
  - 768px Tablet Portrait: Confirm horizontal scrollable look tabs and touch target sizes.
  - 375px Mobile: Confirm split editorial look switcher, floating bottom checkout bar (`mobile-cart-sticky-bar`), and zero horizontal scroll.

- [ ] **Step 4: Verify Console Logs & Performance**
  - Inspect Chrome DevTools console: verify 0 errors, 0 warnings.
