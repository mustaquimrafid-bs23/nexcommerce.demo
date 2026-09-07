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

console.log('🧪 Testing Visual Search Modal with Neural Vector Matching...');

const modalPath = path.resolve(process.cwd(), 'components/modals/VisualSearchModal.tsx');
assert('components/modals/VisualSearchModal.tsx exists', fs.existsSync(modalPath));

const storePath = path.resolve(process.cwd(), 'store/useVisualSearchStore.ts');
assert('store/useVisualSearchStore.ts exists', fs.existsSync(storePath));

if (fs.existsSync(modalPath)) {
  const modalContent = fs.readFileSync(modalPath, 'utf8');
  assert('VisualSearchModal has preset looks', modalContent.includes('PRESET_LOOKS') || modalContent.includes('Milan Overcoat'));
  assert('VisualSearchModal has match confidence score', modalContent.includes('MATCH') || modalContent.includes('matchScore'));
  assert('VisualSearchModal has file upload handling', modalContent.includes('FileReader') || modalContent.includes('readAsDataURL'));
  assert('VisualSearchModal has quick-add action', modalContent.includes('addItem') || modalContent.includes('handleQuickAdd'));
}

if (fs.existsSync(storePath)) {
  const storeContent = fs.readFileSync(storePath, 'utf8');
  assert('useVisualSearchStore has open/close methods', storeContent.includes('openVisualSearch') && storeContent.includes('closeVisualSearch'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
