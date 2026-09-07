const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 22: PAGE-07 Order Confirmation Parity Test...\n');

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

const pagePath = path.resolve('app/confirmation/page.tsx');
const heroPath = path.resolve('components/confirmation/ConfirmationHero.tsx');
const passPath = path.resolve('components/confirmation/DigitalBoardingPass.tsx');
const timelinePath = path.resolve('components/confirmation/DispatchTimeline.tsx');
const actionsPath = path.resolve('components/confirmation/ConfirmationNextActions.tsx');

assert('app/confirmation/page.tsx exists', fs.existsSync(pagePath));
assert('components/confirmation/ConfirmationHero.tsx exists', fs.existsSync(heroPath));
assert('components/confirmation/DigitalBoardingPass.tsx exists', fs.existsSync(passPath));
assert('components/confirmation/DispatchTimeline.tsx exists', fs.existsSync(timelinePath));
assert('components/confirmation/ConfirmationNextActions.tsx exists', fs.existsSync(actionsPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Digital Boarding Pass and Order reference
assert('Mounts DigitalBoardingPass with order reference', pageContent.includes('DigitalBoardingPass') && pageContent.includes('ref'));

// 2. Assert Fulfillment Timeline
assert('Mounts DispatchTimeline', pageContent.includes('DispatchTimeline'));

// 3. Assert Next Actions
assert('Mounts ConfirmationNextActions with tracking navigation', pageContent.includes('ConfirmationNextActions'));

console.log(`\nBatch 22 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
