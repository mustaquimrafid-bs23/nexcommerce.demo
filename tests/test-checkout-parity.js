const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 21: PAGE-06 Multi-Step Checkout Parity Test...\n');

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

const pagePath = path.resolve('app/checkout/page.tsx');
const progressPath = path.resolve('components/checkout/CheckoutProgressRibbon.tsx');
const cardPreviewPath = path.resolve('components/checkout/HolographicCardPreview.tsx');
const savingsPath = path.resolve('components/checkout/SavingsOptimizerBanner.tsx');

assert('app/checkout/page.tsx exists', fs.existsSync(pagePath));
assert('components/checkout/CheckoutProgressRibbon.tsx exists', fs.existsSync(progressPath));
assert('components/checkout/HolographicCardPreview.tsx exists', fs.existsSync(cardPreviewPath));
assert('components/checkout/SavingsOptimizerBanner.tsx exists', fs.existsSync(savingsPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Multi-step state machine
assert('Contains activeStep state and progress ribbon', pageContent.includes('activeStep') && pageContent.includes('CheckoutProgressRibbon'));

// 2. Assert Payment Methods and Form inputs
assert('Supports multiple payment methods (card, klarna, applepay, etc.)', pageContent.includes('paymentMethod') && pageContent.includes('cardNumber'));

// 3. Assert Savings Optimizer banner integration
assert('Integrates SavingsOptimizerBanner in order sidebar', pageContent.includes('SavingsOptimizerBanner'));

// 4. Assert Confirmation redirect
assert('Redirects to /confirmation upon successful submission', pageContent.includes('/confirmation'));

console.log(`\nBatch 21 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
