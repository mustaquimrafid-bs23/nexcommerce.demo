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

console.log('🧪 Testing Cart Abandonment Recovery Hold Modal & Hook...');

const modalPath = path.resolve(process.cwd(), 'components/modals/CartRecoveryModal.tsx');
assert('components/modals/CartRecoveryModal.tsx exists', fs.existsSync(modalPath));

const hookPath = path.resolve(process.cwd(), 'hooks/useCartRecovery.ts');
assert('hooks/useCartRecovery.ts exists', fs.existsSync(hookPath));

if (fs.existsSync(modalPath)) {
  const content = fs.readFileSync(modalPath, 'utf8');
  assert('CartRecoveryModal has reservation hold timer', content.includes('Reservation Hold') || content.includes('secondsRemaining'));
  assert('CartRecoveryModal has comeback incentive code', content.includes('COMEBACK10') || content.includes('applyCoupon'));
  assert('CartRecoveryModal displays reserved item thumbnails', content.includes('items.map') && (content.includes('thumbnail') || content.includes('image')));
}

if (fs.existsSync(hookPath)) {
  const hookContent = fs.readFileSync(hookPath, 'utf8');
  assert('useCartRecovery hook handles mouseleave exit-intent', hookContent.includes('mouseleave') || hookContent.includes('clientY'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
