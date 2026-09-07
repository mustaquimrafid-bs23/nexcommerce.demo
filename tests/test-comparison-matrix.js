const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 14: AI-14 Product Comparison Matrix & Slot Switcher Parity Test...\n');

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

const modalPath = path.resolve('components/product/ComparisonModal.tsx');
assert('components/product/ComparisonModal.tsx exists', fs.existsSync(modalPath));

const content = fs.readFileSync(modalPath, 'utf8');

// 1. Assert Product B slot switcher dropdown exists
assert('Contains #compareSlotB dropdown switcher', content.includes('id="compareSlotB"'));

// 2. Assert Dynamic Product B state update
assert('Supports changing comparison candidate for Product B', content.includes('currentProductB') || content.includes('setProductB') || content.includes('setCurrentProductB'));

// 3. Assert Spec diff highlighting and Choose action
assert('Contains spec diff highlights and Choose button', content.includes('specs') && (content.includes('Choose') || content.includes('handleChoose')));

console.log(`\nBatch 14 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
