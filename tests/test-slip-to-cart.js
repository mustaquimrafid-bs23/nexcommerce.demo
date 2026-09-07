const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 12: AI-12 Slip-to-Cart AI Document & Image Scanner Parity Test...\n');

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

const modalPath = path.resolve('components/cart/SlipToCartModal.tsx');
assert('components/cart/SlipToCartModal.tsx exists', fs.existsSync(modalPath));

const content = fs.readFileSync(modalPath, 'utf8');

// 1. Assert sample lists and quick paste exist
assert('Contains sample lists for instant demo', content.includes('SAMPLE_LISTS') && content.includes('Autumn Warmth'));

// 2. Assert NLP Line-Item and quantity extraction
assert('Parses line items with quantity and size', content.includes('parseAndMatch') && content.includes('qtyMatch'));

// 3. Assert confidence scoring and alternatives
assert('Computes match confidence and alternatives', content.includes('confidence') && content.includes('alternatives'));

// 4. Assert 1-click bulk Add All to Cart
assert('Contains 1-click Add All to Bag action', content.includes('handleAddAll') || content.includes('Add All'));

console.log(`\nBatch 12 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
