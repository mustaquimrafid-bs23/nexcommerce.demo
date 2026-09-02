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

console.log('🧪 Testing Side-by-Side Comparison Engine & Modal...');

const modalPath = path.resolve(process.cwd(), 'components/product/ComparisonModal.tsx');
assert('components/product/ComparisonModal.tsx exists', fs.existsSync(modalPath));

const pdpPath = path.resolve(process.cwd(), 'app/product/[id]/page.tsx');
assert('app/product/[id]/page.tsx exists', fs.existsSync(pdpPath));

if (fs.existsSync(modalPath)) {
  const content = fs.readFileSync(modalPath, 'utf8');
  assert('ComparisonModal has Smart Advisor Verdict', content.includes('Verdict') || content.includes('verdict'));
  assert('ComparisonModal has spec comparison matrix', content.includes('Spec') || content.includes('specRows'));
  assert('ComparisonModal has 1-click choose action', content.includes('Choose') || content.includes('addItem'));
}

if (fs.existsSync(pdpPath)) {
  const pdpContent = fs.readFileSync(pdpPath, 'utf8');
  assert('PDP page connects ComparisonModal', pdpContent.includes('ComparisonModal'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
