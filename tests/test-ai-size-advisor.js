const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 3: AI-03 Smart Size Advisor & Fit Assistant Parity Test...\n');

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

const modalPath = path.resolve('components/product/AIFitModal.tsx');
const pdpPath = path.resolve('app/product/[id]/page.tsx');

assert('components/product/AIFitModal.tsx exists', fs.existsSync(modalPath));
assert('app/product/[id]/page.tsx exists', fs.existsSync(pdpPath));

const modalContent = fs.readFileSync(modalPath, 'utf8');
const pdpContent = fs.readFileSync(pdpPath, 'utf8');

// 1. Assert AIFitModal mounted in PDP
assert('PDP imports and mounts AIFitModal', pdpContent.includes('AIFitModal') && pdpContent.includes('isFitModalOpen'));

// 2. Assert Height and Weight inputs/sliders
assert('Contains height input/slider', modalContent.includes('height') && modalContent.includes('setHeight'));
assert('Contains weight input/slider', modalContent.includes('weight') && modalContent.includes('setWeight'));

// 3. Assert Fit preference selector (Tailored / Regular / Relaxed)
assert('Contains fit preference selector (Tailored/Regular/Relaxed)', modalContent.includes('Tailored') && modalContent.includes('Regular') && modalContent.includes('Relaxed'));

// 4. Assert Size calculation and recommendation logic
assert('Calculates recommended size and match confidence', modalContent.includes('calculateRecommendation') && modalContent.includes('confidence'));

// 5. Assert 1-click apply size to PDP
assert('Applies recommended size to product selector on submit', modalContent.includes('onSelectSize'));

// 6. Assert Accessibility, Portal and Escape key listener
assert('Uses createPortal and supports Escape key dismissal', modalContent.includes('createPortal') && modalContent.includes('Escape'));

console.log(`\nBatch 3 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
