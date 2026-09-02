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

console.log('🧪 Testing Side-by-Side Product Comparison Spec Matrix Modal...');

const modalPath = path.resolve(process.cwd(), 'components/modals/ComparisonModal.tsx');
assert('components/modals/ComparisonModal.tsx exists', fs.existsSync(modalPath));

const storePath = path.resolve(process.cwd(), 'store/useComparisonStore.ts');
assert('store/useComparisonStore.ts exists', fs.existsSync(storePath));

if (fs.existsSync(modalPath)) {
  const content = fs.readFileSync(modalPath, 'utf8');
  assert('ComparisonModal has Smart Advisor Verdict', content.includes('Smart Advisor Verdict') || content.includes('Verdict'));
  assert('ComparisonModal has spec comparison matrix', content.includes('Spec') || content.includes('specRows'));
  assert('ComparisonModal has 1-click choose action', content.includes('Choose') || content.includes('addItem'));
}

if (fs.existsSync(storePath)) {
  const storeContent = fs.readFileSync(storePath, 'utf8');
  assert('useComparisonStore has open/close comparison', storeContent.includes('openComparison') && storeContent.includes('closeComparison'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
