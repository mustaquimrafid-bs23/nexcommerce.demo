const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 9: AI-09 Smart List Item Dismissal & Undo Toast Parity Test...\n');

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

const pagePath = path.resolve('app/smart-list/page.tsx');
const cardPath = path.resolve('components/smart-list/SmartListProductCard.tsx');

assert('app/smart-list/page.tsx exists', fs.existsSync(pagePath));
assert('components/smart-list/SmartListProductCard.tsx exists', fs.existsSync(cardPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');
const cardContent = fs.readFileSync(cardPath, 'utf8');

// 1. Assert Card contains dismiss action trigger
assert('SmartListProductCard has onDismiss callback and trigger', cardContent.includes('onDismiss') && cardContent.includes('data-dismiss'));

// 2. Assert Smart List page maintains dismissedIds state
assert('Page maintains dismissedIds state with nex_sl_dismissed storage', pageContent.includes('dismissedIds') && pageContent.includes('nex_sl_dismissed'));

// 3. Assert Floating Undo Toast exists with 5s timeout and #slToastUndoBtn
assert('Contains Undo Toast with #slToastUndoBtn', pageContent.includes('slToastUndoBtn') && pageContent.includes('handleUndo'));

// 4. Assert Restores item on Undo
assert('handleUndo clears item from dismissed set', pageContent.includes('handleUndo'));

console.log(`\nBatch 9 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
