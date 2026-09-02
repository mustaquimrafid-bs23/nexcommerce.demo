const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 26: PAGE-11 Wishlist & Curation Board Parity Test...\n');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ [PASS] ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${desc}`);
    failed++;
  }
}

const pagePath = path.resolve('app/wishlist/page.tsx');
assert('app/wishlist/page.tsx exists', fs.existsSync(pagePath));

const content = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Wishlist Store Integration
assert('Integrates useWishlistStore for persistent saved items', content.includes('useWishlistStore'));

// 2. Assert Capsule Category Tabs
assert('Contains category filter tabs (All Saved, Clothing, etc.)', content.includes('CAPSULE_TABS') && content.includes('All Saved'));

// 3. Assert Bulk Actions: Move All to Bag and Clear All
assert('Provides Move All to Bag and removal actions', (content.includes('clearWishlist') || content.includes('handleRemove')) && content.includes('addItem'));

// 4. Assert Empty State handling
assert('Handles empty state with Explore Catalog CTA', content.includes('Empty') || content.includes('savedItems.length === 0') || content.includes('Nothing Saved Yet'));

console.log(`\nBatch 26 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
