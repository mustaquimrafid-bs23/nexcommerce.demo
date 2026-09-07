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

console.log('🧪 Testing Homepage Polish & Mount Elevation...');

const homePath = path.resolve(process.cwd(), 'app/page.tsx');
assert('app/page.tsx exists', fs.existsSync(homePath));

const content = fs.readFileSync(homePath, 'utf8');
assert('Homepage mounts HeroSection', content.includes('HeroSection'));
assert('Homepage mounts DealsSection', content.includes('DealsSection'));
assert('Homepage mounts IntentSearchCard', content.includes('IntentSearchCard'));
assert('Homepage mounts ProductGrid', content.includes('ProductGrid'));
assert('Homepage mounts EditorialBanner', content.includes('EditorialBanner'));
assert('Homepage does not mount extra CategoryTiles', !content.includes('<CategoryTiles'));
assert('Homepage does not mount extra RecentlyViewedRail', !content.includes('<RecentlyViewedRail'));
assert('Homepage does not mount extra TrustStrip', !content.includes('<TrustStrip'));

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);

