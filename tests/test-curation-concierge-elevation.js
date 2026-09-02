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

console.log('🧪 Testing Wishlist, Discovery, Smart List, & Concierge Elevation...');

const wishlistPath = path.resolve(process.cwd(), 'app/wishlist/page.tsx');
assert('app/wishlist/page.tsx exists', fs.existsSync(wishlistPath));
const wishlistContent = fs.readFileSync(wishlistPath, 'utf8');
assert('Wishlist has MOVE ALL TO BAG', wishlistContent.includes('MOVE ALL TO BAG'));
assert('Wishlist has CLEAR ALL', wishlistContent.includes('CLEAR ALL'));
assert('Wishlist has capsule tabs', wishlistContent.includes('CAPSULE_TABS'));

const discoveryPath = path.resolve(process.cwd(), 'app/discovery/page.tsx');
assert('app/discovery/page.tsx exists', fs.existsSync(discoveryPath));
const discoveryContent = fs.readFileSync(discoveryPath, 'utf8');
assert('Discovery has natural language intent queries', discoveryContent.includes('AESTHETIC_SPHERES') || discoveryContent.includes('HOTSPOTS'));

const smartListPath = path.resolve(process.cwd(), 'app/smart-list/page.tsx');
assert('app/smart-list/page.tsx exists', fs.existsSync(smartListPath));
const smartListContent = fs.readFileSync(smartListPath, 'utf8');
assert('Smart List has batch actions and drawers', smartListContent.includes('SmartListBatchDock') && smartListContent.includes('SmartListQuickLookDrawer'));

const conciergePath = path.resolve(process.cwd(), 'components/concierge/ConciergeDrawer.tsx');
assert('components/concierge/ConciergeDrawer.tsx exists', fs.existsSync(conciergePath));
const conciergeContent = fs.readFileSync(conciergePath, 'utf8');
assert('Concierge satisfies First-Frame Invariant with visual cards', conciergeContent.includes('Featured Atelier Capsule') || conciergeContent.includes('MASTER_PRODUCTS'));

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
