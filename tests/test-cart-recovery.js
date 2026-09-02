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

console.log('🧪 Testing Cart Abandonment Recovery Hold Modal...');

const modalPath = path.resolve(process.cwd(), 'components/cart/CartRecoveryModal.tsx');
assert('components/cart/CartRecoveryModal.tsx exists', fs.existsSync(modalPath));

const cartPath = path.resolve(process.cwd(), 'app/cart/page.tsx');
assert('app/cart/page.tsx exists', fs.existsSync(cartPath));

if (fs.existsSync(modalPath)) {
  const content = fs.readFileSync(modalPath, 'utf8');
  assert('CartRecoveryModal has reservation hold countdown timer', content.includes('Reservation Hold') || content.includes('secondsRemaining') || content.includes('countdown'));
  assert('CartRecoveryModal has comeback incentive offer code', content.includes('COMEBACK10') || content.includes('applyCoupon') || content.includes('incentive'));
  assert('CartRecoveryModal displays reserved items row', content.includes('items') && (content.includes('thumbnail') || content.includes('image')));
}

if (fs.existsSync(cartPath)) {
  const cartContent = fs.readFileSync(cartPath, 'utf8');
  assert('Cart page mounts CartRecoveryModal', cartContent.includes('CartRecoveryModal'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
