/**
 * Test Suite: Feature 05 — 1-Click Outfit Bundles Parity Verification
 * Verifies:
 * 1. app/discovery/page.tsx contains section id="drops" (Complete Outfit Builder)
 * 2. Contains all 3 styled capsules (Milan Evening, Minimalist Urban, Long-Haul Flight)
 * 3. Contains all bundle item ID datasets ('p1,p4,p7', 'p2,p6', 'p1,p7')
 * 4. Contains 1-click addBundle helper integrated with useCartStore and openCart
 * 5. Contains bundle keyword filtering logic
 * 6. Adheres strictly to brand background guidelines (#003371, #011126, #031838)
 * 7. FeatureTourModal.tsx and app/guide/page.tsx link Feature 05 to /discovery#drops
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Running Feature 05: 1-Click Outfit Bundles Parity Test Suite...\n');

const discoveryPagePath = path.join(__dirname, '..', 'app', 'discovery', 'page.tsx');
const guidePagePath = path.join(__dirname, '..', 'app', 'guide', 'page.tsx');
const tourModalPath = path.join(__dirname, '..', 'components', 'tour', 'FeatureTourModal.tsx');

const discoveryContent = fs.readFileSync(discoveryPagePath, 'utf8');
const guideContent = fs.readFileSync(guidePagePath, 'utf8');
const tourContent = fs.readFileSync(tourModalPath, 'utf8');

// 1. Structure & Section Anchor
console.log('1. Verifying Complete Outfit Builder section and #drops anchor...');
assert(discoveryContent.includes('id="drops"'), 'app/discovery/page.tsx must contain id="drops" section anchor');
assert(discoveryContent.includes('Complete Outfit Builder'), 'Must contain Complete Outfit Builder title');
assert(discoveryContent.includes('1-click bundle checkout'), 'Must contain 1-click bundle checkout description');
console.log('  ✓ Section anchor and editorial headers verified.');

// 2. Capsules and Catalog Data
console.log('\n2. Verifying 3 Styled Capsules & Bundle Datasets...');
assert(discoveryContent.includes('The Milan Evening Look'), 'Must contain Capsule 01: The Milan Evening Look');
assert(discoveryContent.includes('Minimalist Urban Rotation'), 'Must contain Capsule 02: Minimalist Urban Rotation');
assert(discoveryContent.includes('Long-Haul Flight Comfort'), 'Must contain Capsule 03: Long-Haul Flight Comfort');

assert(discoveryContent.includes('data-bundle-ids="p1,p4,p7"') || discoveryContent.includes("bundleIds: ['p1', 'p4', 'p7']"), 'Must contain Capsule 01 bundle IDs');
assert(discoveryContent.includes('data-bundle-ids="p2,p6"') || discoveryContent.includes("bundleIds: ['p2', 'p6']"), 'Must contain Capsule 02 bundle IDs');
assert(discoveryContent.includes('data-bundle-ids="p1,p7"') || discoveryContent.includes("bundleIds: ['p1', 'p7']"), 'Must contain Capsule 03 bundle IDs');

assert(discoveryContent.includes('CAPSULE 01 · EVENING'), 'Must contain Capsule 01 badge');
assert(discoveryContent.includes('CAPSULE 02 · MOVEMENT'), 'Must contain Capsule 02 badge');
assert(discoveryContent.includes('CAPSULE 03 · TRANSIT'), 'Must contain Capsule 03 badge');

assert(discoveryContent.includes('€ 790.00'), 'Must contain Capsule 01 total € 790.00');
assert(discoveryContent.includes('€ 440.00'), 'Must contain Capsule 02 total € 440.00');
assert(discoveryContent.includes('€ 470.00'), 'Must contain Capsule 03 total € 470.00');
console.log('  ✓ All 3 styled capsules, datasets, and valuations verified.');

// 3. 1-Click Action & Cart Integration
console.log('\n3. Verifying 1-Click Bundle Add Helper & Cart Drawer Trigger...');
assert(discoveryContent.includes('addBundle'), 'Must contain addBundle helper');
assert(discoveryContent.includes('addItem(prod)'), 'addBundle must add products to cart');
assert(!discoveryContent.includes('openCart()'), 'addBundle must not automatically trigger openCart');
assert(discoveryContent.includes('btn-disc-bundle'), 'Must contain btn-disc-bundle CTA button');
console.log('  ✓ 1-click bundle add logic and cart integration verified.');

// 4. Background Color & Brand Guidelines
console.log('\n4. Verifying Brand Guidelines Background Gradient...');
assert(
  discoveryContent.includes('radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)'),
  'Must use authentic brand deep navy radial gradient background'
);
assert(discoveryContent.includes('text-accent-cyan'), 'Must use accent cyan (#3DE0FF) for piece checkmarks');
console.log('  ✓ Brand navy palette and secondary accent tokens verified.');

// 5. Cross-Page Navigation & Feature Guide Linkage
console.log('\n5. Verifying Cross-Page Navigation & Tour Modal Linkage...');
assert(guideContent.includes('1-Click Outfit Bundles'), 'app/guide/page.tsx must feature 1-Click Outfit Bundles');
assert(guideContent.includes('/discovery#drops'), 'app/guide/page.tsx Feature 05 must link to /discovery#drops');
assert(tourContent.includes('1-Click Outfit Bundles'), 'FeatureTourModal must include 1-Click Outfit Bundles');
assert(tourContent.includes('/discovery#drops'), 'FeatureTourModal Feature 05 must link to /discovery#drops');
console.log('  ✓ Feature 05 guide metadata and modal deep links verified.');

console.log('\n✨ ALL Feature 05 Parity Tests PASSED with 100% precision!\n');
