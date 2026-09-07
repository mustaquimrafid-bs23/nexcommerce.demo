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

console.log('🧪 Testing Subsystem Features (Wishlist Share, Discovery Pills, Smart List Cadence, Concierge DLP & Checkout)...');

// 1. Wishlist Share & Stylist Bridge
const wishlistPath = path.resolve(process.cwd(), 'app/wishlist/page.tsx');
assert('app/wishlist/page.tsx exists', fs.existsSync(wishlistPath));
if (fs.existsSync(wishlistPath)) {
  const content = fs.readFileSync(wishlistPath, 'utf8');
  assert('Wishlist has Share link action', content.includes('handleShare') || content.includes('SHARE LIST'));
  assert('Wishlist has Concierge Stylist bridge', content.includes('/concierge') && content.includes('OUTFIT IDEAS'));
}

// 2. Discovery Removable Understood Context Pills & Camera
const discoveryPath = path.resolve(process.cwd(), 'app/discovery/page.tsx');
assert('app/discovery/page.tsx exists', fs.existsSync(discoveryPath));
if (fs.existsSync(discoveryPath)) {
  const content = fs.readFileSync(discoveryPath, 'utf8');
  assert('Discovery has Removable Understood Context pills', content.includes('contextPills') || content.includes('Understood Context'));
  assert('Discovery has Camera visual search trigger', content.includes('Camera') || content.includes('openVisualSearch'));
}

// 3. Smart List Replenishment Cadence
const smartListCardPath = path.resolve(process.cwd(), 'components/smart-list/SmartListProductCard.tsx');
assert('components/smart-list/SmartListProductCard.tsx exists', fs.existsSync(smartListCardPath));
if (fs.existsSync(smartListCardPath)) {
  const content = fs.readFileSync(smartListCardPath, 'utf8');
  assert('SmartList product card has replenishment cadence indicator', content.includes('Cadence') || content.includes('Refill') || content.includes('Monthly'));
}

// 4. Concierge DLP Card Guard & In-Chat Checkout
const conciergePath = path.resolve(process.cwd(), 'components/concierge/ConciergeDrawer.tsx');
assert('components/concierge/ConciergeDrawer.tsx exists', fs.existsSync(conciergePath));
if (fs.existsSync(conciergePath)) {
  const content = fs.readFileSync(conciergePath, 'utf8');
  assert('ConciergeDrawer has DLP sensitive card masking', content.includes('sanitizeDLP') || content.includes('REDACTED'));
  assert('ConciergeDrawer has in-chat direct checkout action', content.includes('href="/checkout"') || content.includes('handleAddBundleToBag'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
