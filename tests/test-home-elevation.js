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
assert('Homepage mounts CategoryTiles', content.includes('CategoryTiles'));
assert('Homepage mounts RecentlyViewedRail', content.includes('RecentlyViewedRail'));
assert('Homepage mounts TrustStrip', content.includes('TrustStrip'));

const lookbookModalPath = path.resolve(process.cwd(), 'components/home/LookbookModal.tsx');
assert('components/home/LookbookModal.tsx exists', fs.existsSync(lookbookModalPath));

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
