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

console.log('🧪 Testing Dark Store Gate & Delivery Hub Pill...');

const modalPath = path.resolve(process.cwd(), 'components/layout/DeliveryGateModal.tsx');
assert('components/layout/DeliveryGateModal.tsx exists', fs.existsSync(modalPath));

const headerPath = path.resolve(process.cwd(), 'components/layout/Header.tsx');
assert('components/layout/Header.tsx exists', fs.existsSync(headerPath));

if (fs.existsSync(headerPath)) {
  const headerContent = fs.readFileSync(headerPath, 'utf8');
  assert('Header mounts delivery hub pill or gate trigger', headerContent.includes('deliveryHubBtn') || headerContent.includes('DeliveryGateModal') || headerContent.includes('Deliver to'));
}

if (fs.existsSync(modalPath)) {
  const modalContent = fs.readFileSync(modalPath, 'utf8');
  assert('DeliveryGateModal has Dark Store Hubs', modalContent.includes('Berlin Mitte') && modalContent.includes('Paris Le Marais'));
  assert('DeliveryGateModal has search and GPS detection', modalContent.includes('geolocation') && modalContent.includes('search'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
