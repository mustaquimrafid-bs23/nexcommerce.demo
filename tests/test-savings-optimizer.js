const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 13: AI-13 Checkout Savings Optimizer Parity Test...\n');

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

const bannerPath = path.resolve('components/checkout/SavingsOptimizerBanner.tsx');
const checkoutPath = path.resolve('app/checkout/page.tsx');

assert('components/checkout/SavingsOptimizerBanner.tsx exists', fs.existsSync(bannerPath));
assert('app/checkout/page.tsx exists', fs.existsSync(checkoutPath));

const bannerContent = fs.readFileSync(bannerPath, 'utf8');
const checkoutContent = fs.readFileSync(checkoutPath, 'utf8');

// 1. Assert SavingsOptimizerBanner mounted in checkout
assert('Checkout page mounts SavingsOptimizerBanner', checkoutContent.includes('SavingsOptimizerBanner'));

// 2. Assert Proactive tier evaluation
assert('Evaluates eligibility based on subtotal thresholds', bannerContent.includes('subtotal >= 100') || bannerContent.includes('isEligible'));

// 3. Assert 1-click apply coupon action
assert('Contains 1-click apply coupon action', bannerContent.includes('onApplyCoupon'));

console.log(`\nBatch 13 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
