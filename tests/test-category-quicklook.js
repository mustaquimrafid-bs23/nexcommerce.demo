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

console.log('🧪 Testing Category PLP Quick-Look Mini-PDP Integration...');

const drawerPath = path.resolve(process.cwd(), 'components/category/QuickLookMiniPDP.tsx');
assert('components/category/QuickLookMiniPDP.tsx exists', fs.existsSync(drawerPath));

const categoryPagePath = path.resolve(process.cwd(), 'app/category/page.tsx');
assert('app/category/page.tsx exists', fs.existsSync(categoryPagePath));

const cardPath = path.resolve(process.cwd(), 'components/category/ProductCardElevated.tsx');
assert('components/category/ProductCardElevated.tsx exists', fs.existsSync(cardPath));

if (fs.existsSync(categoryPagePath)) {
  const content = fs.readFileSync(categoryPagePath, 'utf8');
  assert('app/category/page.tsx mounts QuickLookMiniPDP', content.includes('QuickLookMiniPDP'));
}

if (fs.existsSync(cardPath)) {
  const cardContent = fs.readFileSync(cardPath, 'utf8');
  assert('ProductCardElevated has onQuickLook or quick look action', cardContent.includes('onQuickLook') || cardContent.includes('quickLook'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
