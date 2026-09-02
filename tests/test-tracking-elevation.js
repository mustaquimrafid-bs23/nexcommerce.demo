/**
 * Automated Verification Suite for Batch 17:
 * Courier Tracking Logistics Concierge & Reschedule Elevation
 */

const fs = require('fs');
const path = require('path');

let passes = 0;
let failures = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
    passes++;
  }
}

console.log('====================================================');
console.log('🧪 BATCH 17: TRACKING LOGISTICS CONCIERGE & RESCHEDULE SUITE');
console.log('====================================================\n');

// 1. Verify Component Files Existence
const conciergePath = path.join(__dirname, '..', 'components', 'tracking', 'AILogisticsConcierge.tsx');
assert(fs.existsSync(conciergePath), 'components/tracking/AILogisticsConcierge.tsx exists');

const reschedulePath = path.join(__dirname, '..', 'components', 'tracking', 'DeliveryRescheduleModal.tsx');
assert(fs.existsSync(reschedulePath), 'components/tracking/DeliveryRescheduleModal.tsx exists');

const trackingPagePath = path.join(__dirname, '..', 'app', 'tracking', 'page.tsx');
assert(fs.existsSync(trackingPagePath), 'app/tracking/page.tsx exists');

if (fs.existsSync(conciergePath)) {
  const conciergeContent = fs.readFileSync(conciergePath, 'utf8');

  // 2. Interactive Query Chips
  assert(
    conciergeContent.includes('When will my courier arrive') || conciergeContent.includes('courier arrive'),
    'AILogisticsConcierge contains courier arrival query chip'
  );
  assert(
    conciergeContent.includes('neighbour') || conciergeContent.includes('neighbor') || conciergeContent.includes('leave with'),
    'AILogisticsConcierge contains parcel drop / neighbour query chip'
  );
  assert(
    conciergeContent.includes('reschedule') || conciergeContent.includes('Change delivery') || conciergeContent.includes('onRescheduleClick'),
    'AILogisticsConcierge connects to reschedule action'
  );

  // 3. Plain UK English (Zero AI Buzzwords)
  const forbidden = [
    /\bAI\b/i,
    /\bArtificial Intelligence\b/i,
    /\bautonomous\b/i,
    /\bheuristic\b/i,
    /\bneural\b/i,
    /\bsynthesize\b/i,
    /\bhallucinate\b/i,
    /\btelemetry matrix\b/i,
  ];

  for (const pattern of forbidden) {
    assert(
      !conciergeContent.match(pattern),
      `AILogisticsConcierge is free of forbidden buzzword: ${pattern.toString()}`
    );
  }
}

if (fs.existsSync(reschedulePath)) {
  const rescheduleContent = fs.readFileSync(reschedulePath, 'utf8');
  assert(
    rescheduleContent.includes('Tomorrow') || rescheduleContent.includes('Morning') || rescheduleContent.includes('Afternoon'),
    'DeliveryRescheduleModal provides specific delivery time slots'
  );
  assert(
    rescheduleContent.includes('instructions') || rescheduleContent.includes('Concierge') || rescheduleContent.includes('Porch'),
    'DeliveryRescheduleModal provides special courier instruction presets'
  );
}

if (fs.existsSync(trackingPagePath)) {
  const pageContent = fs.readFileSync(trackingPagePath, 'utf8');
  assert(
    pageContent.includes('#01132B'),
    'app/tracking/page.tsx uses unified Atelier Obsidian Navy base #01132B'
  );
  assert(
    pageContent.includes('AILogisticsConcierge') || pageContent.includes('LogisticsConcierge'),
    'app/tracking/page.tsx mounts the logistics concierge assistant'
  );
  assert(
    pageContent.includes('DeliveryRescheduleModal'),
    'app/tracking/page.tsx mounts DeliveryRescheduleModal'
  );
}

console.log('\n====================================================');
console.log(`Audited Passes: ${passes}, Failures: ${failures}`);
console.log('====================================================\n');

if (failures > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL BATCH 17 TRACKING ELEVATION INVARIANTS PASSED!');
  process.exit(0);
}
