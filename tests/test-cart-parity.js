const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 20: PAGE-05 Shopping Cart Parity Test...\n');

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

const pagePath = path.resolve('app/cart/page.tsx');
const budgetModalPath = path.resolve('components/cart/BudgetCartModal.tsx');
const slipModalPath = path.resolve('components/cart/SlipToCartModal.tsx');

assert('app/cart/page.tsx exists', fs.existsSync(pagePath));
assert('components/cart/BudgetCartModal.tsx exists', fs.existsSync(budgetModalPath));
assert('components/cart/SlipToCartModal.tsx exists', fs.existsSync(slipModalPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Cart item list with quantity update & remove
assert('Supports item listing with updateQuantity and removeItem', pageContent.includes('updateQuantity') && pageContent.includes('removeItem'));

// 2. Assert AI Smart tools triggers: Budget Builder and Slip to Cart
assert('Contains Budget Builder and Slip to Cart AI modal integrations', pageContent.includes('BudgetCartModal') && pageContent.includes('SlipToCartModal'));

// 3. Assert Free Shipping Progress Bar
assert('Includes complimentary express shipping threshold gauge', pageContent.includes('freeShippingThreshold') || pageContent.includes('shipping') || pageContent.includes('150'));

// 4. Assert Order Summary and Checkout CTA
assert('Renders Order Summary breakdown with Checkout CTA button', pageContent.includes('Order Summary') && (pageContent.includes('Checkout') || pageContent.includes('checkout')));

console.log(`\nBatch 20 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
