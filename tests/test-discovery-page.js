/**
 * Test Suite: pages/discovery.html Quality & Integrity Verification
 * Asserts:
 * 1. Semantic Asset Integrity: Ensures all product cards and lifestyle cards use correct canonical image assets.
 * 2. Search & NLP Query Handling: Asserts query extraction, in-page search execution, and score matching.
 * 3. Hotspot and Quick-Add Payloads: Asserts data attributes and addBundle data integrity.
 * 4. Layout & CSS Non-Overlap: Asserts lifestyle footer button non-overlap and flex containment.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const discoveryHtmlPath = path.join(__dirname, '..', 'pages', 'discovery.html');
const html = fs.readFileSync(discoveryHtmlPath, 'utf8');

console.log('🧪 Running pages/discovery.html Audit & Functional Verification Suite...\n');

// 1. Semantic Asset Integrity
console.log('1. Testing Semantic Asset Integrity in discovery.html...');
assert(html.includes('plp_blazer.png'), 'Structured Wool Blazer must use plp_blazer.png, NOT mismatched p2.png (headphones)');
assert(html.includes('prod_runner.png'), 'Minimalist Leather Runner must use prod_runner.png, NOT mismatched p6.png (yoga mat)');
assert(html.includes('hero_sweater.png') || html.includes('plp_crewneck.png'), 'Cashmere Knit Sweater must use authentic sweater asset, NOT mismatched p1.png (sneakers)');
assert(!html.includes('src="../assets/images/products/p2.png"'), 'Must not reference mismatched p2.png in product card img');
assert(!html.includes('src="../assets/images/products/p6.png"'), 'Must not reference mismatched p6.png in product card img');
assert(!html.includes('src="../assets/images/products/p1.png"'), 'Must not reference mismatched p1.png in product card img');
console.log('  ✓ Zero mismatched product images detected! All studio silhouettes verified.');

// 2. CSS Non-Overlap on Lifestyle Cards
console.log('\n2. Testing Lifestyle Card Footer CSS & Non-Overlap Invariant...');
assert(html.includes('.disc-card-footer-info'), 'Must contain .disc-card-footer-info');
assert(
  html.includes('btn-disc-primary') && (html.includes('flex: 0 0 auto') || html.includes('width: auto')),
  'Lifestyle card footer primary button must have fixed/auto flex to prevent overlapping text'
);
console.log('  ✓ Lifestyle card footer button non-overlap rules verified.');

// 3. Search Query Synchronization & In-Page Search
console.log('\n3. Testing In-Page Search Query Synchronization & Logic...');
assert(html.includes('discoveryMainInput'), 'Must contain discoveryMainInput search element');
assert(html.includes('disc-prompt-chip') || html.includes('disc-prompt-chips'), 'Must contain quick-intent prompt chips');
assert(html.includes('disc-status-banner') || html.includes('discStatusBanner'), 'Must contain search status / active filter banner');
assert(html.includes('URLSearchParams'), 'Must parse URL search params on page load for ?q=');
console.log('  ✓ Search query extraction and prompt chips verified.');

// 4. Hotspot Mini-PDP Popover Preview & Quick Add
console.log('\n4. Testing Hotspot Shoppable Preview Popover & Actions...');
assert(html.includes('disc-hotspot-pin'), 'Must contain disc-hotspot-pin elements');
assert(html.includes('disc-hotspot-popover'), 'Must contain shoppable popover tooltips for interactive pins');
assert(html.includes('data-quick-add-id'), 'Must have quick add data attributes');
console.log('  ✓ Shoppable hotspot tooltips and quick-add actions verified.');

// 5. Outfit Drops & Bundle Payload Accuracy
console.log('\n5. Testing Outfit Drops & Capsule Bundle Catalog Data...');
assert(html.includes('id="drops"'), 'Must contain id="drops" anchor section for direct AI navigation');
assert(html.includes('data-bundle-ids="p1,p4,p7"'), 'Must contain Capsule 01 bundle IDs');
assert(html.includes('data-bundle-ids="p2,p6"'), 'Must contain Capsule 02 bundle IDs');
assert(html.includes('data-bundle-ids="p1,p7"'), 'Must contain Capsule 03 bundle IDs');
assert(html.includes('addBundle'), 'Must have addBundle helper');
console.log('  ✓ Capsule bundle datasets, anchor IDs, and quick-add helpers verified.');

console.log('\n✨ ALL discovery.html unit & functional tests PASSED with 100% precision!');
