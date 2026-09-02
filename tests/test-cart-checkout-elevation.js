const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('🧪 Testing Cart & Checkout Elevation (MFS & Savings)...');

const heroStatsPath = path.resolve(process.cwd(), 'components/cart/CartHeroStats.tsx');
assert('components/cart/CartHeroStats.tsx exists', fs.existsSync(heroStatsPath));

const mfsPath = path.resolve(process.cwd(), 'components/checkout/MfsPaymentSheet.tsx');
assert('components/checkout/MfsPaymentSheet.tsx exists', fs.existsSync(mfsPath));

const savingsPath = path.resolve(process.cwd(), 'components/checkout/SavingsOptimizerBanner.tsx');
assert('components/checkout/SavingsOptimizerBanner.tsx exists', fs.existsSync(savingsPath));

const cartPagePath = path.resolve(process.cwd(), 'app/cart/page.tsx');
if (fs.existsSync(cartPagePath)) {
  const cartContent = fs.readFileSync(cartPagePath, 'utf8');
  assert('app/cart/page.tsx mounts CartHeroStats', cartContent.includes('CartHeroStats'));
}

const checkoutPagePath = path.resolve(process.cwd(), 'app/checkout/page.tsx');
if (fs.existsSync(checkoutPagePath)) {
  const checkoutContent = fs.readFileSync(checkoutPagePath, 'utf8');
  assert('app/checkout/page.tsx mounts SavingsOptimizerBanner', checkoutContent.includes('SavingsOptimizerBanner'));
  assert('app/checkout/page.tsx mounts MfsPaymentSheet or supports MFS', checkoutContent.includes('MfsPaymentSheet') || checkoutContent.includes('bkash'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
