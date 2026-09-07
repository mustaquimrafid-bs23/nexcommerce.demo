/**
 * Automated Verification Suite for Batch 19:
 * Global Dark Store Gate Modal & Header Delivery Hub Pill
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
console.log('🧪 BATCH 19: GLOBAL DARK STORE GATE & HEADER HUB PILL');
console.log('====================================================\n');

// 1. Verify Store Existence
const storePath = path.join(__dirname, '..', 'store', 'useDeliveryGateStore.ts');
assert(fs.existsSync(storePath), 'store/useDeliveryGateStore.ts exists');

if (fs.existsSync(storePath)) {
  const storeContent = fs.readFileSync(storePath, 'utf8');
  assert(
    storeContent.includes('DARK_STORE_HUBS') && storeContent.includes('Berlin Mitte') && storeContent.includes('Paris Le Marais'),
    'useDeliveryGateStore defines European dark store hubs'
  );
  assert(
    storeContent.includes('isModalOpen') && storeContent.includes('openModal') && storeContent.includes('closeModal'),
    'useDeliveryGateStore manages modal open and close actions'
  );
  assert(
    storeContent.includes('setActiveHub'),
    'useDeliveryGateStore provides setActiveHub mutation'
  );
}

// 2. Verify Delivery Gate Modal
const modalLayoutPath = path.join(__dirname, '..', 'components', 'layout', 'DeliveryGateModal.tsx');
const modalModalsPath = path.join(__dirname, '..', 'components', 'modals', 'DeliveryGateModal.tsx');
assert(fs.existsSync(modalLayoutPath) || fs.existsSync(modalModalsPath), 'DeliveryGateModal component exists');

const targetModalPath = fs.existsSync(modalModalsPath) ? modalModalsPath : modalLayoutPath;
if (fs.existsSync(targetModalPath)) {
  const modalContent = fs.readFileSync(targetModalPath, 'utf8');
  assert(
    modalContent.includes('deliveryHubModalOverlay') || modalContent.includes('aria-label="Select Delivery Location"'),
    'DeliveryGateModal has accessible modal dialog attributes'
  );
  assert(
    modalContent.includes('geolocation') || modalContent.includes('handleGpsDetect') || modalContent.includes('Use My Current Location'),
    'DeliveryGateModal supports GPS location detection'
  );
  assert(
    modalContent.includes('search') || modalContent.includes('Search postal code'),
    'DeliveryGateModal supports postal code / city search filtering'
  );
}

// 3. Verify Header Delivery Hub Pill
const headerPath = path.join(__dirname, '..', 'components', 'layout', 'Header.tsx');
assert(fs.existsSync(headerPath), 'components/layout/Header.tsx exists');

if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  assert(
    headerContent.includes('headerDeliveryHubPill') || headerContent.includes('deliveryHubBtn'),
    'Header contains canonical Delivery Hub Pill ID (#headerDeliveryHubPill / #deliveryHubBtn)'
  );
  assert(
    headerContent.includes('Deliver to:') || headerContent.includes('Deliver to'),
    'Header renders "Deliver to:" location string'
  );
}

// 4. Plain British English Copywriting (Zero AI Jargon)
const filesToAudit = [storePath, targetModalPath, headerPath];
const forbidden = [
  /\bAI\b/i,
  /\bArtificial Intelligence\b/i,
  /\bneural\b/i,
  /\bautonomous\b/i,
  /\bheuristic\b/i,
  /\bsynthesize\b/i,
  /\bhallucinate\b/i,
];

for (const f of filesToAudit) {
  if (fs.existsSync(f)) {
    const text = fs.readFileSync(f, 'utf8');
    for (const pattern of forbidden) {
      assert(
        !text.match(pattern),
        `${path.basename(f)} is free of forbidden buzzword: ${pattern.toString()}`
      );
    }
  }
}

console.log('\n====================================================');
console.log(`Audited Passes: ${passes}, Failures: ${failures}`);
console.log('====================================================\n');

if (failures > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL BATCH 19 DELIVERY GATE INVARIANTS PASSED!');
  process.exit(0);
}
