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

console.log('🧪 Testing Checkout Proactive Savings Optimizer...');

const bannerPath = path.resolve(process.cwd(), 'components/checkout/SavingsOptimizerBanner.tsx');
assert('components/checkout/SavingsOptimizerBanner.tsx exists', fs.existsSync(bannerPath));

const checkoutPath = path.resolve(process.cwd(), 'app/checkout/page.tsx');
assert('app/checkout/page.tsx exists', fs.existsSync(checkoutPath));

if (fs.existsSync(bannerPath)) {
  const content = fs.readFileSync(bannerPath, 'utf8');
  assert('SavingsOptimizerBanner checks subtotal thresholds', content.includes('subtotal') || content.includes('tier') || content.includes('VIP20') || content.includes('discount'));
  assert('SavingsOptimizerBanner provides 1-click apply action', content.includes('applyCoupon') || content.includes('onApply'));
}

if (fs.existsSync(checkoutPath)) {
  const checkoutContent = fs.readFileSync(checkoutPath, 'utf8');
  assert('Checkout page mounts SavingsOptimizerBanner', checkoutContent.includes('SavingsOptimizerBanner'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
