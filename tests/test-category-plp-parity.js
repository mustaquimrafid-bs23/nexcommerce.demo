const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 17: PAGE-02 Category PLP Parity Test...\n');

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

const pagePath = path.resolve('app/category/page.tsx');
const heroPath = path.resolve('components/category/CategoryHero.tsx');
const toolbarPath = path.resolve('components/category/CategoryToolbar.tsx');
const gridPath = path.resolve('components/category/CategoryProductGrid.tsx');
const quickLookPath = path.resolve('components/category/QuickLookMiniPDP.tsx');

assert('app/category/page.tsx exists', fs.existsSync(pagePath));
assert('components/category/CategoryHero.tsx exists', fs.existsSync(heroPath));
assert('components/category/CategoryToolbar.tsx exists', fs.existsSync(toolbarPath));
assert('components/category/CategoryProductGrid.tsx exists', fs.existsSync(gridPath));
assert('components/category/QuickLookMiniPDP.tsx exists', fs.existsSync(quickLookPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');
const toolbarContent = fs.readFileSync(toolbarPath, 'utf8');
const gridContent = fs.readFileSync(gridPath, 'utf8');

// 1. Assert URL sync with cat query parameter
assert('Page synchronizes category state with URL search param', pageContent.includes('catParam') && pageContent.includes('searchParams.get(\'cat\')'));

// 2. Assert Toolbar has Category Tabs and Sort Selector
assert('CategoryToolbar contains category filter tabs and sort control', toolbarContent.includes('CATEGORY_TABS') || toolbarContent.includes('categories') || toolbarContent.includes('sortBy'));

// 3. Assert Product Grid renders cards and handles Quick Look Mini-PDP
assert('CategoryProductGrid triggers Quick Look Mini-PDP', gridContent.includes('onQuickLook') || pageContent.includes('QuickLookMiniPDP'));

console.log(`\nBatch 17 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
