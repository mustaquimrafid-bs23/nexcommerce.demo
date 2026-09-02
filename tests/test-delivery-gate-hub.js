const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 15: AI-15 Delivery Gate & Dark Store Hub Parity Test...\n');

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

const headerPath = path.resolve('components/layout/Header.tsx');
const modalPath = path.resolve('components/modals/DeliveryGateModal.tsx');
const storePath = path.resolve('store/useDeliveryGateStore.ts');

assert('components/layout/Header.tsx exists', fs.existsSync(headerPath));
assert('components/modals/DeliveryGateModal.tsx exists', fs.existsSync(modalPath));
assert('store/useDeliveryGateStore.ts exists', fs.existsSync(storePath));

const headerContent = fs.readFileSync(headerPath, 'utf8');
const modalContent = fs.readFileSync(modalPath, 'utf8');
const storeContent = fs.readFileSync(storePath, 'utf8');

// 1. Assert Header Location Pill exists with canonical ID
assert('Header contains #headerDeliveryHubPill', headerContent.includes('id="headerDeliveryHubPill"'));

// 2. Assert DeliveryGateModal and Store contain Dark Store cities (Berlin, Paris, London, Milan)
assert('Contains dark store hubs (Berlin, Paris, London, Milan)', storeContent.includes('Berlin') && storeContent.includes('Paris') && storeContent.includes('London') && storeContent.includes('Milan'));

// 3. Assert localStorage persistence and event dispatching
assert('Persists to nex_delivery_hub and dispatches hub-changed event', headerContent.includes('nex_delivery_hub') && headerContent.includes('hub-changed'));

console.log(`\nBatch 15 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
