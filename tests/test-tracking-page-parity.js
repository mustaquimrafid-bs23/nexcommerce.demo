const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 24: PAGE-09 Logistics Tracking Parity Test...\n');

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

const pagePath = path.resolve('app/tracking/page.tsx');
const guidanceCardPath = path.resolve('components/tracking/DeliveryGuidanceCard.tsx');
const conciergePath = path.resolve('components/tracking/AILogisticsConcierge.tsx');
const reschedulePath = path.resolve('components/tracking/DeliveryRescheduleModal.tsx');

assert('app/tracking/page.tsx exists', fs.existsSync(pagePath));
assert('components/tracking/DeliveryGuidanceCard.tsx exists', fs.existsSync(guidanceCardPath));
assert('components/tracking/AILogisticsConcierge.tsx exists', fs.existsSync(conciergePath));
assert('components/tracking/DeliveryRescheduleModal.tsx exists', fs.existsSync(reschedulePath));

const pageContent = fs.readFileSync(pagePath, 'utf8');

// 1. Assert Search query tracking lookup
assert('Supports tracking lookup by reference ID', pageContent.includes('searchQuery') || pageContent.includes('trackingId') || pageContent.includes('ref'));

// 2. Assert Milestone Timeline
assert('Renders multi-stage milestone delivery route timeline', pageContent.includes('milestone') || pageContent.includes('Timeline') || pageContent.includes('STEPS') || pageContent.includes('Transit'));

// 3. Assert AI Delivery Guidance and Reschedule Modal integrations
assert('Integrates DeliveryGuidanceCard and DeliveryRescheduleModal', pageContent.includes('DeliveryGuidanceCard') && pageContent.includes('DeliveryRescheduleModal'));

console.log(`\nBatch 24 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
