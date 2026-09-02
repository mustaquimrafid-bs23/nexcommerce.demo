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

console.log('🧪 Testing Tracking AI Logistics Concierge & Reschedule Elevation...');

const conciergePath = path.resolve(process.cwd(), 'components/tracking/AILogisticsConcierge.tsx');
assert('components/tracking/AILogisticsConcierge.tsx exists', fs.existsSync(conciergePath));

const reschedulePath = path.resolve(process.cwd(), 'components/tracking/DeliveryRescheduleModal.tsx');
assert('components/tracking/DeliveryRescheduleModal.tsx exists', fs.existsSync(reschedulePath));

const trackingPagePath = path.resolve(process.cwd(), 'app/tracking/page.tsx');
assert('app/tracking/page.tsx exists', fs.existsSync(trackingPagePath));

if (fs.existsSync(trackingPagePath)) {
  const content = fs.readFileSync(trackingPagePath, 'utf8');
  assert('app/tracking/page.tsx mounts AILogisticsConcierge', content.includes('AILogisticsConcierge'));
  assert('app/tracking/page.tsx mounts DeliveryRescheduleModal', content.includes('DeliveryRescheduleModal'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
