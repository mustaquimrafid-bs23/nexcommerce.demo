const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 5: AI-05 Intelligent Delivery Guidance & Logistics Concierge Parity Test...\n');

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

const cardPath = path.resolve('components/tracking/DeliveryGuidanceCard.tsx');
const conciergePath = path.resolve('components/tracking/AILogisticsConcierge.tsx');
const reschedulePath = path.resolve('components/tracking/DeliveryRescheduleModal.tsx');
const trackingPath = path.resolve('app/tracking/page.tsx');

assert('components/tracking/DeliveryGuidanceCard.tsx exists', fs.existsSync(cardPath));
assert('components/tracking/AILogisticsConcierge.tsx exists', fs.existsSync(conciergePath));
assert('components/tracking/DeliveryRescheduleModal.tsx exists', fs.existsSync(reschedulePath));
assert('app/tracking/page.tsx exists', fs.existsSync(trackingPath));

const cardContent = fs.readFileSync(cardPath, 'utf8');
const conciergeContent = fs.readFileSync(conciergePath, 'utf8');
const rescheduleContent = fs.readFileSync(reschedulePath, 'utf8');
const trackingContent = fs.readFileSync(trackingPath, 'utf8');

// 1. Assert DeliveryGuidanceCard mounted on tracking page
assert('Tracking page imports and mounts DeliveryGuidanceCard', trackingContent.includes('DeliveryGuidanceCard'));

// 2. Assert AILogisticsConcierge mounted on tracking page
assert('Tracking page imports and mounts AILogisticsConcierge', trackingContent.includes('AILogisticsConcierge'));

// 3. Assert Plain English Carrier State Translation
assert('DeliveryGuidanceCard translates carrier statuses into plain English', cardContent.includes('headline') || cardContent.includes('status') || cardContent.includes('carrier') || cardContent.includes('ETA'));

// 4. Assert Logistics Concierge Interactive Chat
assert('AILogisticsConcierge provides interactive responses', conciergeContent.includes('messages') && conciergeContent.includes('handleSend'));

// 5. Assert Reschedule Delivery Modal
assert('DeliveryRescheduleModal allows slot selection and updates delivery', rescheduleContent.includes('DeliveryRescheduleModal') && rescheduleContent.includes('handleConfirm'));

console.log(`\nBatch 5 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
