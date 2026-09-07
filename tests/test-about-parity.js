const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 28: PAGE-13 About & Brand Heritage Parity Test...\n');

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

const pagePath = path.resolve('app/about/page.tsx');
const heroPath = path.resolve('components/about/AboutHeroSplit.tsx');
const materialsPath = path.resolve('components/about/MaterialsSection.tsx');
const timelinePath = path.resolve('components/about/CraftTimeline.tsx');

assert('app/about/page.tsx exists', fs.existsSync(pagePath));
assert('components/about/AboutHeroSplit.tsx exists', fs.existsSync(heroPath));
assert('components/about/MaterialsSection.tsx exists', fs.existsSync(materialsPath));
assert('components/about/CraftTimeline.tsx exists', fs.existsSync(timelinePath));

const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Heritage Split Hero and Materials Section
assert('Mounts AboutHeroSplit and MaterialsSection', pageContent.includes('AboutHeroSplit') && pageContent.includes('MaterialsSection'));

// 2. Assert Craftsmanship Timeline and Artisans Grid
assert('Mounts CraftTimeline and GuardiansGrid', pageContent.includes('CraftTimeline') && pageContent.includes('GuardiansGrid'));

// 3. Assert Catalog exploration call to action
assert('Contains Explore Collections action linking to /category', pageContent.includes('/category') && pageContent.includes('Explore Collections'));

console.log(`\nBatch 28 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
