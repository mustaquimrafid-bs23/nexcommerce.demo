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

console.log('🧪 Testing PDP 8-Feature Elevation...');

const pdpPath = path.resolve(process.cwd(), 'app/product/[id]/page.tsx');
assert('app/product/[id]/page.tsx exists', fs.existsSync(pdpPath));

const content = fs.readFileSync(pdpPath, 'utf8');

// 1. Perspective Switcher
assert('PDP has Perspective Switcher', content.includes('PerspectiveSwitcher') || content.includes('Perspective: Silhouette'));

// 2. AI Fit Modal
assert('PDP has AI Fit Modal (#pdpFitModal)', content.includes('AIFitModal') || content.includes('pdpFitModal'));

// 3. Side-by-Side Comparison Action
assert('PDP has Compare With Another Piece trigger', content.includes('pdpCompareBtn') || content.includes('Compare'));

// 4. Dedicated Ask Stylist Trigger
assert('PDP has Ask Stylist trigger', content.includes('Ask Stylist') || content.includes('openConcierge'));

// 5. Complete the Look Bundle Checkout
assert('PDP has Complete the Look 3-piece bundle checkout', content.includes('CompleteLookBundle') || content.includes('pdpCompleteLookSection'));

// 6. Mobile Sticky Purchase Bar
assert('PDP has Mobile Sticky Purchase Bar (#mobileStickyBar)', content.includes('MobileStickyBar') || content.includes('mobileStickyBar'));

// 7. Statutory VAT notice
assert('PDP has statutory VAT & duties transparency notice', content.includes('statutory VAT') || content.includes('Duties included'));

// 8. Spec Badges Grid
assert('PDP has Artisanal Specification Badges Grid', content.includes('SpecBadgesGrid') || content.includes('pdpSpecBadgesGrid'));

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
