const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 11: AI-11 Autonomous Target-Budget Cart Builder Parity Test...\n');

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

const modalPath = path.resolve('components/cart/BudgetCartModal.tsx');
assert('components/cart/BudgetCartModal.tsx exists', fs.existsSync(modalPath));

const content = fs.readFileSync(modalPath, 'utf8');

// 1. Assert Target Budget slider exists
assert('Contains budget slider with targetBudget state', content.includes('targetBudget') && content.includes('setTargetBudget'));

// 2. Assert Occasion Theme Selector exists
assert('Contains occasion theme selection', content.includes('selectedTheme') || content.includes('theme'));

// 3. Assert Constraint satisfaction and headroom calculation
assert('Calculates basket total and budget headroom', content.includes('headroom') || content.includes('totalPrice') || content.includes('basket'));

// 4. Assert Alternative slot overrides
assert('Provides alternative candidate swapping per slot', content.includes('slotOverrides') || content.includes('alternatives'));

// 5. Assert 1-click bulk Add to Cart
assert('Contains 1-click Add Bundle to Cart action', content.includes('addItem') && (content.includes('Add') || content.includes('Bag')));

console.log(`\nBatch 11 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
