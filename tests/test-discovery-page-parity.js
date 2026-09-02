const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 18: PAGE-03 Discovery Page & Drops Parity Test...\n');

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

const pagePath = path.resolve('app/discovery/page.tsx');
assert('app/discovery/page.tsx exists', fs.existsSync(pagePath));

const content = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Aesthetic Spheres exists
assert('Contains Aesthetic Spheres filter tabs', content.includes('AESTHETIC_SPHERES') && content.includes('Quiet Luxury'));

// 2. Assert Quick Intents pills exist
assert('Contains quick intent pills', content.includes('QUICK_INTENTS') && content.includes('Cashmere knitwear'));

// 3. Assert Lookbook Hotspots
assert('Contains interactive Lookbook Hotspots layer', content.includes('HOTSPOTS') && content.includes('hotspot-1'));

// 4. Assert Visual Search integration
assert('Integrates with Visual Search trigger', content.includes('useVisualSearchStore') || content.includes('Camera'));

console.log(`\nBatch 18 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
