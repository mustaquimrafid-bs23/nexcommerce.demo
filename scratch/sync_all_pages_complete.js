const fs = require('fs');
const path = require('path');

const root = process.cwd();

// Canonical Announcement HTML
function getAnnouncementHtml(isSubpage) {
  return `  <!-- TOP ANNOUNCEMENT BAR (CLEAN EDITORIAL STRIP) -->
  <div class="top-announcement-bar" id="topAnnouncementBar">
    <div class="container announcement-inner">
      <span class="announcement-item"><i data-lucide="rotate-ccw"></i> 14-day free returns</span>
      <span class="announcement-dot"></span>
      <span class="announcement-item"><i data-lucide="shield-check"></i> 100% verified authentic</span>
      <span class="announcement-dot"></span>
      <span class="announcement-item"><i data-lucide="truck"></i> Complimentary express delivery over € 150.00</span>
    </div>
  </div>`;
}

// Canonical Header HTML
function getHeaderHtml(isSubpage) {
  const homeHref = isSubpage ? '../index.html' : 'index.html';
  const logoSrc = isSubpage ? '../assets/images/brand/logo_light.png' : 'assets/images/brand/logo_light.png';
  const catHref = isSubpage ? 'category.html?cat=all' : 'pages/category.html?cat=all';
  const smartHref = isSubpage ? 'smart-list.html' : 'pages/smart-list.html';
  const lookHref = isSubpage ? 'lookbook.html' : 'pages/lookbook.html';
  const wishHref = isSubpage ? 'wishlist.html' : 'pages/wishlist.html';
  const accHref = isSubpage ? 'account.html' : 'pages/account.html';
  const cartHref = isSubpage ? 'cart.html' : 'pages/cart.html';
  const trackHref = isSubpage ? 'tracking.html' : 'pages/tracking.html';
  const profHref = isSubpage ? 'profile.html' : 'pages/profile.html';
  const ordHref = isSubpage ? 'orders.html' : 'pages/orders.html';
  const contactHref = isSubpage ? 'contact.html' : 'pages/contact.html';

  return `  <!-- GLOBAL HEADER (ULTRA-CLEAN LUXURY NAVIGATION) -->
  <header class="site-header" id="siteHeader">
    <div class="nav-inner container">
      <!-- Left: Brand Logo & Core Nav -->
      <div class="nav-brand-group">
        <button class="mobile-menu-trigger" id="mobileMenuBtn" aria-label="Open mobile menu" aria-expanded="false" aria-controls="mobileNavDrawer">
          <i data-lucide="menu" class="menu-icon-bars"></i>
        </button>
        <a href="${homeHref}" class="nav-logo" aria-label="nexCommerce Home">
          <img src="${logoSrc}" alt="nexCommerce — next generation e-commerce" class="site-logo-img" />
        </a>
      </div>

      <nav class="nav-menu-links desktop-only" id="navMenuLinks" aria-label="Primary Navigation">
        <span class="nav-glider-pill" id="navGliderPill" aria-hidden="true"></span>
        <a href="${catHref}" class="nav-item-link" data-nav="categories">Categories</a>
        <a href="${smartHref}" class="nav-item-link" data-nav="smart-list">Smart List <span class="nav-badge-pink">AI</span></a>
        <a href="${lookHref}" class="nav-item-link" data-nav="lookbook">Lookbook</a>
      </nav>

      <!-- Center: Smart Search Pill -->
      <div class="nav-search-pill-wrap desktop-only">
        <button class="nav-search-pill search-trigger" id="searchTriggerBtn" aria-label="Search Catalog (Ctrl + K)">
          <span class="search-pill-icon"><i data-lucide="search" style="width: 14px; height: 14px;"></i></span>
          <span class="search-pill-placeholder">Search, or describe what you need...</span>
          <span class="search-kbd"><kbd>Ctrl</kbd> + <kbd>K</kbd></span>
        </button>
      </div>

      <!-- Right: Priority Actions & 3-Dot Overflow Menu -->
      <div class="nav-right-actions">
        <button class="nav-icon-btn search-trigger mobile-only-flex" id="mobileSearchTriggerBtn" aria-label="Search Catalog (Ctrl + K)" title="Search">
          <i data-lucide="search"></i>
        </button>

        <a href="${wishHref}" class="nav-icon-btn desktop-only" id="headerWishlistLink" aria-label="Saved Wishlist" title="Saved Wishlist">
          <i data-lucide="heart"></i>
          <span class="wishlist-count-badge" id="headerWishlistCount" style="display: none;">0</span>
        </a>

        <a data-auth-account href="${accHref}" class="nav-icon-btn desktop-only" aria-label="My Account" title="My Account">
          <i data-lucide="user"></i>
          <span data-auth-name style="display: none;">Tanvir</span>
        </a>

        <a href="${cartHref}" class="cart-trigger nav-icon-btn" id="headerCartLink" aria-label="Shopping Bag" title="Shopping Bag">
          <i data-lucide="shopping-bag"></i>
          <span class="bag-count-badge" id="headerCartCount">0</span>
        </a>

        <!-- 3-Dot Overflow Menu for Secondary Utilities -->
        <div class="nav-more-menu" id="headerMoreMenu">
          <button class="nav-more-trigger" data-dropdown-trigger aria-label="More options" aria-haspopup="true" aria-expanded="false">
            <i data-lucide="more-horizontal"></i>
          </button>
          <div class="nav-more-dropdown" data-state="closed" role="menu">
            <a href="${trackHref}" class="nav-more-item" role="menuitem">
              <i data-lucide="truck"></i>
              <span>Track Order</span>
            </a>
            <a href="${profHref}" class="nav-more-item" role="menuitem">
              <i data-lucide="sparkles"></i>
              <span>AI Style Profile</span>
            </a>
            <a href="${ordHref}" class="nav-more-item" role="menuitem">
              <i data-lucide="receipt"></i>
              <span>Order History</span>
            </a>
            <div class="nav-more-divider"></div>
            <a href="${contactHref}" class="nav-more-item" role="menuitem">
              <i data-lucide="headphones"></i>
              <span>Client Services</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>`;
}

// Canonical Mobile Drawer HTML
function getMobileDrawerHtml(isSubpage) {
  const homeHref = isSubpage ? '../index.html' : 'index.html';
  const logoSrc = isSubpage ? '../assets/images/brand/logo_light.png' : 'assets/images/brand/logo_light.png';
  const catHref = isSubpage ? 'category.html?cat=all' : 'pages/category.html?cat=all';
  const smartHref = isSubpage ? 'smart-list.html' : 'pages/smart-list.html';
  const lookHref = isSubpage ? 'lookbook.html' : 'pages/lookbook.html';
  const wishHref = isSubpage ? 'wishlist.html' : 'pages/wishlist.html';
  const accHref = isSubpage ? 'account.html' : 'pages/account.html';
  const cartHref = isSubpage ? 'cart.html' : 'pages/cart.html';
  const trackHref = isSubpage ? 'tracking.html' : 'pages/tracking.html';
  const profHref = isSubpage ? 'profile.html' : 'pages/profile.html';
  const ordHref = isSubpage ? 'orders.html' : 'pages/orders.html';

  return `  <!-- MOBILE NAVIGATION DRAWER -->
  <div class="mobile-nav-drawer" id="mobileNavDrawer" aria-hidden="true" role="dialog" aria-label="Navigation Menu">
    <div class="mobile-drawer-header">
      <a href="${homeHref}" class="nav-logo" aria-label="nexCommerce Home">
        <img src="${logoSrc}" alt="nexCommerce" style="height: 24px; width: auto;" />
      </a>
      <button id="closeMobileDrawerBtn" class="mobile-drawer-close" aria-label="Close mobile menu">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="mobile-drawer-nav">
      <a href="${catHref}" class="mobile-drawer-link" data-stagger="1">
        <span>Categories</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="${smartHref}" class="mobile-drawer-link" data-stagger="2">
        <span>Smart List <span class="nav-badge-pink" style="margin-left: 6px;">AI</span></span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="${lookHref}" class="mobile-drawer-link" data-stagger="3">
        <span>Lookbook</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <div class="mobile-drawer-divider" style="margin: 12px 0; border-top: 1px solid rgba(255,255,255,0.08);"></div>
      <a href="${wishHref}" class="mobile-drawer-link" data-stagger="4">
        <span>Saved Pieces (<span id="mobileWishlistCount">0</span>)</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="${ordHref}" class="mobile-drawer-link" data-stagger="5">
        <span>Order Journey</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="${trackHref}" class="mobile-drawer-link" data-stagger="6">
        <span>Track Order</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="${profHref}" class="mobile-drawer-link" data-stagger="7">
        <span>AI Profile</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a data-auth-account href="${accHref}" class="mobile-drawer-link" data-stagger="8">
        <span>Account</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="${cartHref}" class="mobile-drawer-link" data-stagger="9">
        <span>Bag (<span id="mobileCartCount">0</span>)</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
    </div>
  </div>`;
}

// Canonical Search Modal HTML
function getSearchModalHtml() {
  return `  <!-- SEARCH OVERLAY (global CMD+K) -->
  <div id="aiSearchModal" class="search-overlay-container" role="dialog" aria-modal="true" aria-label="Intelligent Search Overlay">
    <div class="search-backdrop"></div>
    <div class="search-panel">
      <div class="search-header-bar">
        <div class="search-input-wrapper">
          <div class="search-ai-icon">
            <i data-lucide="sparkles" style="width: 18px; height: 18px;"></i>
          </div>
          <input type="text" id="aiSearchModalInput" name="q" class="search-ai-input" placeholder="Something for a winter evening in Milan" autocomplete="off" spellcheck="false" aria-label="Search query" />
        </div>
        <button class="search-close-btn" aria-label="Close search">
          <i data-lucide="x" style="width: 16px; height: 16px;"></i>
        </button>
      </div>
      <div id="aiSearchResultsModal" class="search-body"></div>
    </div>
  </div>`;
}

const targetFiles = [
  'index.html',
  '404.html',
  'pages/404.html',
  'pages/about.html',
  'pages/account.html',
  'pages/cart.html',
  'pages/category.html',
  'pages/checkout.html',
  'pages/components-preview.html',
  'pages/concierge.html',
  'pages/confirmation.html',
  'pages/contact.html',
  'pages/discovery.html',
  'pages/foundation.html',
  'pages/impressum.html',
  'pages/lookbook.html',
  'pages/orders.html',
  'pages/playground.html',
  'pages/privacy.html',
  'pages/product.html',
  'pages/profile.html',
  'pages/security.html',
  'pages/size-guide.html',
  'pages/smart-list.html',
  'pages/terms.html',
  'pages/tracking.html',
  'pages/wishlist.html'
];

targetFiles.forEach(rel => {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) return;
  let html = fs.readFileSync(full, 'utf8');
  const isSubpage = rel.startsWith('pages/');

  const annBlock = getAnnouncementHtml(isSubpage);
  const headBlock = getHeaderHtml(isSubpage);
  const drawerBlock = getMobileDrawerHtml(isSubpage);
  const combinedHeader = `${annBlock}\n\n${headBlock}\n\n${drawerBlock}\n\n`;

  // 1. Replace existing header stack if matched
  const regexHeaderStack = /(?:<!-- TOP ANNOUNCEMENT BAR[^\>]*-->[\s\S]*?)?(?:<div class="top-announcement-bar"[\s\S]*?<\/div>\s*<\/div>\s*)?(?:<!-- GLOBAL HEADER[^\>]*-->[\s\S]*?)?<header class="site-header"[\s\S]*?<\/header>\s*(?:<!-- MOBILE NAV(?:IGATION)? DRAWER[^\>]*-->[\s\S]*?)?<div class="mobile-nav-drawer"[\s\S]*?<\/div>\s*<\/div>/;

  if (regexHeaderStack.test(html)) {
    html = html.replace(regexHeaderStack, combinedHeader.trim());
  } else if (rel === 'pages/smart-list.html') {
    // Special match for smart-list.html
    const slRegex = /<div class="top-announcement-bar"[\s\S]*?<!-- MOBILE DRAWER -->[\s\S]*?<div class="mobile-nav-drawer"[\s\S]*?<\/div>\s*<\/div>|<header class="site-header"[\s\S]*?<!-- MOBILE DRAWER -->[\s\S]*?<div class="mobile-nav-drawer"[\s\S]*?<\/div>\s*<\/div>/;
    html = html.replace(slRegex, combinedHeader.trim());
  } else if (rel === 'pages/components-preview.html') {
    // Insert after <body>
    html = html.replace(/<body[^>]*>/, '$&\n\n' + combinedHeader.trim());
  }

  // 2. Ensure Search Modal Overlay is present
  if (!html.includes('id="aiSearchModal"') && !html.includes("id='aiSearchModal'")) {
    const footerMountMatch = html.match(/<footer[^>]*>[\s\S]*?<\/footer>/);
    if (footerMountMatch) {
      html = html.replace(footerMountMatch[0], footerMountMatch[0] + '\n\n' + getSearchModalHtml());
    } else {
      const bodyClose = html.indexOf('</body>');
      if (bodyClose !== -1) {
        html = html.slice(0, bodyClose) + '\n\n' + getSearchModalHtml() + '\n' + html.slice(bodyClose);
      }
    }
  }

  // 3. Ensure header.js and search-overlay.js scripts are loaded
  const scriptPrefix = isSubpage ? '../js/' : 'js/';
  if (!html.includes('search-overlay.js')) {
    html = html.replace('</body>', `  <script src="${scriptPrefix}search-overlay.js"></script>\n</body>`);
  }
  if (!html.includes('header.js')) {
    html = html.replace('</body>', `  <script src="${scriptPrefix}header.js"></script>\n</body>`);
  }
  if (!html.includes('auth.js')) {
    html = html.replace('</body>', `  <script src="${scriptPrefix}auth.js"></script>\n</body>`);
  }

  fs.writeFileSync(full, html, 'utf8');
  console.log(`✅ [${rel}] Synchronized header, announcement bar, drawer, search modal & scripts.`);
});
