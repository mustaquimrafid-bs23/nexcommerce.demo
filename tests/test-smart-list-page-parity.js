const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 25: PAGE-10 Smart List Hub Parity Test...\n');

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

const pagePath = path.resolve('app/smart-list/page.tsx');
const heroPath = path.resolve('components/smart-list/SmartListHeroBanner.tsx');
const toolbarPath = path.resolve('components/smart-list/SmartListToolbar.tsx');
const gridPath = path.resolve('components/smart-list/SmartListProductGrid.tsx');
const dockPath = path.resolve('components/smart-list/SmartListBatchDock.tsx');
const drawerPath = path.resolve('components/smart-list/SmartListQuickLookDrawer.tsx');

assert('app/smart-list/page.tsx exists', fs.existsSync(pagePath));
assert('components/smart-list/SmartListHeroBanner.tsx exists', fs.existsSync(heroPath));
assert('components/smart-list/SmartListToolbar.tsx exists', fs.existsSync(toolbarPath));
assert('components/smart-list/SmartListProductGrid.tsx exists', fs.existsSync(gridPath));
assert('components/smart-list/SmartListBatchDock.tsx exists', fs.existsSync(dockPath));
assert('components/smart-list/SmartListQuickLookDrawer.tsx exists', fs.existsSync(drawerPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Batch Dock and Quick Look Drawer mounted
assert('Mounts SmartListBatchDock and SmartListQuickLookDrawer', pageContent.includes('SmartListBatchDock') && pageContent.includes('SmartListQuickLookDrawer'));

// 2. Assert Dismissal and Undo Toast integrated
assert('Integrates item dismissal and Undo Toast (#slToastUndoBtn)', pageContent.includes('handleDismiss') && pageContent.includes('slToastUndoBtn'));

// 3. Assert Multi-select and Add All to Bag
assert('Supports multi-select toggle and Add All to Bag', pageContent.includes('handleToggleSelectAll') && pageContent.includes('handleAddAllToBag'));

console.log(`\nBatch 25 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
