const fs = require('fs');
const path = require('path');

const rootFiles = ['index.html', '404.html'];
const subpageFiles = fs.readdirSync('pages')
  .filter(f => f.endsWith('.html') && f !== 'signin.html' && f !== 'signup.html')
  .map(f => 'pages/' + f);

function makeRootDrawer() {
  return `  <!-- MOBILE NAVIGATION DRAWER -->
  <div class="mobile-nav-drawer" id="mobileNavDrawer" aria-hidden="true" role="dialog" aria-label="Navigation Menu">
    <div class="mobile-drawer-header">
      <a href="index.html" class="nav-logo" aria-label="nexCommerce Home">
        <img src="assets/images/brand/logo_light.png" alt="nexCommerce" style="height: 24px; width: auto;" />
      </a>
      <button id="closeMobileDrawerBtn" class="mobile-drawer-close" aria-label="Close mobile menu">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="mobile-drawer-nav">
      <a href="pages/category.html?cat=all" class="mobile-drawer-link" data-stagger="1">
        <span>Categories</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="pages/smart-list.html" class="mobile-drawer-link" data-stagger="2">
        <span>Smart List <span class="nav-badge-pink" style="margin-left: 6px;">AI</span></span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="pages/wishlist.html" class="mobile-drawer-link" data-stagger="3">
        <span>Saved Pieces <span class="mobile-drawer-badge" id="mobileWishlistCount" style="display: none;">0</span></span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <div class="mobile-drawer-divider" style="margin: 12px 0; border-top: 1px solid rgba(255,255,255,0.08);"></div>
      <a data-auth-account href="pages/account.html" class="mobile-drawer-link" data-stagger="4">
        <span>Account &amp; AI Profile</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="pages/orders.html" class="mobile-drawer-link" data-stagger="5">
        <span>Orders &amp; Tracking</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="pages/contact.html" class="mobile-drawer-link" data-stagger="6">
        <span>Client Services</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
    </div>
  </div>`;
}

function makeSubpageDrawer() {
  return `  <!-- MOBILE NAVIGATION DRAWER -->
  <div class="mobile-nav-drawer" id="mobileNavDrawer" aria-hidden="true" role="dialog" aria-label="Navigation Menu">
    <div class="mobile-drawer-header">
      <a href="../index.html" class="nav-logo" aria-label="nexCommerce Home">
        <img src="../assets/images/brand/logo_light.png" alt="nexCommerce" style="height: 24px; width: auto;" />
      </a>
      <button id="closeMobileDrawerBtn" class="mobile-drawer-close" aria-label="Close mobile menu">
        <i data-lucide="x"></i>
      </button>
    </div>
    <div class="mobile-drawer-nav">
      <a href="category.html?cat=all" class="mobile-drawer-link" data-stagger="1">
        <span>Categories</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="smart-list.html" class="mobile-drawer-link" data-stagger="2">
        <span>Smart List <span class="nav-badge-pink" style="margin-left: 6px;">AI</span></span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="wishlist.html" class="mobile-drawer-link" data-stagger="3">
        <span>Saved Pieces <span class="mobile-drawer-badge" id="mobileWishlistCount" style="display: none;">0</span></span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <div class="mobile-drawer-divider" style="margin: 12px 0; border-top: 1px solid rgba(255,255,255,0.08);"></div>
      <a data-auth-account href="account.html" class="mobile-drawer-link" data-stagger="4">
        <span>Account &amp; AI Profile</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="orders.html" class="mobile-drawer-link" data-stagger="5">
        <span>Orders &amp; Tracking</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
      <a href="contact.html" class="mobile-drawer-link" data-stagger="6">
        <span>Client Services</span>
        <i data-lucide="chevron-right" style="width: 15px; height: 15px; opacity: 0.5;"></i>
      </a>
    </div>
  </div>`;
}

function processFile(filePath, isRoot) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add desktop-only to headerMoreMenu if not present
  content = content.replace(
    /<div class="nav-more-menu"(?!\s+desktop-only)/g,
    '<div class="nav-more-menu desktop-only"'
  );

  // 2. Replace mobileNavDrawer section
  const drawerRegex = /<!-- MOBILE NAVIGATION DRAWER -->[\s\S]*?<\/div>\s*<\/div>/;
  if (drawerRegex.test(content)) {
    const newDrawer = isRoot ? makeRootDrawer() : makeSubpageDrawer();
    content = content.replace(drawerRegex, newDrawer);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}: OK`);
  } else {
    console.warn(`Could not match mobileNavDrawer in ${filePath}`);
  }
}

rootFiles.forEach(f => processFile(f, true));
subpageFiles.forEach(f => processFile(f, false));
console.log('All files processed!');
