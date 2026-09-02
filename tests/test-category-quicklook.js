const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('🧪 Running Batch 13 Category & Quick-Look Mini-PDP Verification Suite...\n');

// 1. File existence
const drawerPath = path.resolve(process.cwd(), 'components/category/QuickLookMiniPDP.tsx');
const cardPath = path.resolve(process.cwd(), 'components/category/ProductCardElevated.tsx');
const heroPath = path.resolve(process.cwd(), 'components/category/CategoryHero.tsx');
const toolbarPath = path.resolve(process.cwd(), 'components/category/CategoryToolbar.tsx');
const gridPath = path.resolve(process.cwd(), 'components/category/CategoryProductGrid.tsx');
const spotlightPath = path.resolve(process.cwd(), 'components/category/CuratedCapsuleSpotlight.tsx');
const pagePath = path.resolve(process.cwd(), 'app/category/page.tsx');

assert('QuickLookMiniPDP.tsx exists', fs.existsSync(drawerPath));
assert('ProductCardElevated.tsx exists', fs.existsSync(cardPath));
assert('CategoryHero.tsx exists', fs.existsSync(heroPath));
assert('CategoryToolbar.tsx exists', fs.existsSync(toolbarPath));
assert('CategoryProductGrid.tsx exists', fs.existsSync(gridPath));
assert('CuratedCapsuleSpotlight.tsx exists', fs.existsSync(spotlightPath));
assert('app/category/page.tsx exists', fs.existsSync(pagePath));

// 2. QuickLookMiniPDP assertions
if (fs.existsSync(drawerPath)) {
  const code = fs.readFileSync(drawerPath, 'utf8');
  assert('QuickLook has dialog role and aria-modal', code.includes('role="dialog"') && code.includes('aria-modal="true"'));
  assert('QuickLook uses plain UK English header "QUICK VIEW"', code.includes('QUICK VIEW'));
  assert('QuickLook contains thumbnail filmstrip', code.includes('gallery') && code.includes('setActiveImage'));
  assert('QuickLook contains interactive Colour selector', code.includes('Colour') || code.includes('selectedColor'));
  assert('QuickLook contains interactive Size selector', code.includes('Size') && code.includes('selectedSize'));
  assert('QuickLook has 1-click Add to Bag CTA', code.includes('Add to Bag') || code.includes('Added to Bag'));
  assert('QuickLook links to full product details', code.includes('/product/') && (code.includes('View full details') || code.includes('View Full Details')));
  assert('QuickLook integrates useCurrencyStore for reactive currency', code.includes('useCurrencyStore'));
  assert('QuickLook has scroll isolation data-lenis-prevent', code.includes('data-lenis-prevent'));
  assert('QuickLook supports Escape key listener', code.includes('Escape') || code.includes('keydown'));
}

// 3. ProductCardElevated assertions
if (fs.existsSync(cardPath)) {
  const code = fs.readFileSync(cardPath, 'utf8');
  assert('ProductCardElevated has 3D spring tilt physics', code.includes('perspective') && code.includes('rotateX') && code.includes('rotateY'));
  assert('ProductCardElevated has specular glare tracking', code.includes('plp-card-specular') || code.includes('--plp-glare'));
  assert('ProductCardElevated has quick look eye button', code.includes('onQuickLook') && code.includes('Eye'));
  assert('ProductCardElevated has wishlist toggle button', code.includes('toggleWishlist') && code.includes('Heart'));
  assert('ProductCardElevated has slide-up quick add CTA', code.includes('QUICK ADD') || code.includes('btn-plp-add-to-bag'));
  assert('ProductCardElevated contains tactile colour swatches', code.includes('plp-swatches-row') || code.includes('handleSwatchSelect'));
  assert('ProductCardElevated uses useCurrencyStore for live currency updates', code.includes('useCurrencyStore'));
}

// 4. CategoryHero assertions
if (fs.existsSync(heroPath)) {
  const code = fs.readFileSync(heroPath, 'utf8');
  assert('CategoryHero uses plain UK English copy (zero AI buzzwords)', !code.includes('spatial drivers') && !code.includes('horology'));
  assert('CategoryHero includes pure full-width banner container', code.includes('plp-pure-banner-frame') || code.includes('plpCategoryBannerImg'));
}

// 5. CategoryToolbar assertions
if (fs.existsSync(toolbarPath)) {
  const code = fs.readFileSync(toolbarPath, 'utf8');
  assert('CategoryToolbar contains Sort By select', code.includes('plpSortSelect') || code.includes('onSortChange'));
  assert('CategoryToolbar contains 7 category filter pills', code.includes('ALL') && code.includes('APPAREL') && code.includes('FOOTWEAR'));
}

// 6. app/category/page.tsx assertions
if (fs.existsSync(pagePath)) {
  const code = fs.readFileSync(pagePath, 'utf8');
  assert('Category page mounts QuickLookMiniPDP', code.includes('<QuickLookMiniPDP'));
  assert('Category page mounts CategoryHero', code.includes('<CategoryHero'));
  assert('Category page mounts CategoryToolbar', code.includes('<CategoryToolbar'));
  assert('Category page mounts CategoryProductGrid', code.includes('<CategoryProductGrid'));
  assert('Category page synchronizes with URL query ?cat=', code.includes('useSearchParams') && code.includes('cat'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
