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

console.log('🧪 Testing Multimodal Visual Search Modal...');

const modalPath = path.resolve(process.cwd(), 'components/layout/VisualSearchModal.tsx');
assert('components/layout/VisualSearchModal.tsx exists', fs.existsSync(modalPath));

const headerPath = path.resolve(process.cwd(), 'components/layout/Header.tsx');
assert('components/layout/Header.tsx exists', fs.existsSync(headerPath));

if (fs.existsSync(modalPath)) {
  const modalContent = fs.readFileSync(modalPath, 'utf8');
  assert('VisualSearchModal has preset looks', modalContent.includes('PRESET_LOOKS') || modalContent.includes('Milan Overcoat'));
  assert('VisualSearchModal has match confidence score', modalContent.includes('MATCH') || modalContent.includes('visualScore'));
  assert('VisualSearchModal has file upload handling', modalContent.includes('FileReader') || modalContent.includes('readAsDataURL'));
}

if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  assert('Header mounts VisualSearchModal or visual search trigger', headerContent.includes('VisualSearchModal') || headerContent.includes('Camera') || headerContent.includes('visualSearch'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
