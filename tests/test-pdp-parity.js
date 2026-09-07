const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 19: PAGE-04 Product Details PDP Parity Test...\n');

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

const pagePath = path.resolve('app/product/[id]/page.tsx');
const fitModalPath = path.resolve('components/product/AIFitModal.tsx');
const compModalPath = path.resolve('components/product/ComparisonModal.tsx');
const stickyBarPath = path.resolve('components/product/MobileStickyBar.tsx');

assert('app/product/[id]/page.tsx exists', fs.existsSync(pagePath));
assert('components/product/AIFitModal.tsx exists', fs.existsSync(fitModalPath));
assert('components/product/ComparisonModal.tsx exists', fs.existsSync(compModalPath));
assert('components/product/MobileStickyBar.tsx exists', fs.existsSync(stickyBarPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Size and Color variant selection
assert('Supports color swatch and size selection', pageContent.includes('selectedColor') && pageContent.includes('selectedSize'));

// 2. Assert Fit Advisor and Comparison triggers
assert('Contains Smart Fit Advisor and Compare Piece triggers', pageContent.includes('AIFitModal') && pageContent.includes('ComparisonModal'));

// 3. Assert Add to Bag with quantity
assert('Contains Add to Bag action and quantity state', pageContent.includes('addItem') && pageContent.includes('quantity'));

// 4. Assert Mobile Sticky Action Bar
assert('Includes MobileStickyBar for small viewports', pageContent.includes('MobileStickyBar'));

console.log(`\nBatch 19 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
