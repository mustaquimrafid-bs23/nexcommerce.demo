const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 10: AI-10 Smart List Cadence Adjuster Parity Test...\n');

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

const popoverPath = path.resolve('components/smart-list/CadenceAdjusterPopover.tsx');
const cardPath = path.resolve('components/smart-list/SmartListProductCard.tsx');

assert('components/smart-list/CadenceAdjusterPopover.tsx exists', fs.existsSync(popoverPath));
assert('components/smart-list/SmartListProductCard.tsx exists', fs.existsSync(cardPath));

const popoverContent = fs.existsSync(popoverPath) ? fs.readFileSync(popoverPath, 'utf8') : '';
const cardContent = fs.readFileSync(cardPath, 'utf8');

// 1. Assert Cadence popover has 30, 60, 90, 180 days options
assert('Contains 30, 60, 90, 180 day replenishment interval options', popoverContent.includes('30') && popoverContent.includes('60') && popoverContent.includes('90') && popoverContent.includes('180'));

// 2. Assert Canonical IDs and Buttons in Modal
assert('Contains #slCadenceModal and #slCadenceSaveBtn', popoverContent.includes('slCadenceModal') && popoverContent.includes('slCadenceSaveBtn'));

// 3. Assert Cadence Trigger attribute on card
assert('Card contains interactive data-cadence-trigger element', cardContent.includes('data-cadence-trigger') || cardContent.includes('CadenceAdjusterPopover'));

console.log(`\nBatch 10 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
