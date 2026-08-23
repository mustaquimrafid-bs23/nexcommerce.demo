/**
 * nexCommerce — Automated Test Suite: Order Tracking Engine & DOM Verification
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('🧪 Running Order Tracking Engine & DOM Verification Tests...\n');

// 1. Verify pages/tracking.html DOM & Structure
console.log('1. Testing DOM ID and Markup Invariants on pages/tracking.html...');
const html = fs.readFileSync(path.join(__dirname, '../pages/tracking.html'), 'utf8');

const requiredIds = [
  'mainContent',
  'trackingBreadcrumbRef',
  'trackingHeroHeader',
  'trackingEyebrow',
  'trackingStatusBadge',
  'trackingHeroId',
  'trackingHeroSubtitle',
  'trackingHeroStats',
  'trackingStatStatus',
  'trackingStatEta',
  'trackingStatCourier',
  'trackingBackLink',
  'trackingRefreshBtn',
  'trackingCancelBtn',
  'orderSwitcherChips',
  'stageSimulator',
  'trackingETA',
  'routeMapContainer',
  'telemetryBadges',
  'trackingServiceMsg',
  'trackingOrderSummary',
  'orderLookupModal'
];

requiredIds.forEach(id => {
  assert(html.includes(`id="${id}"`), `Missing required DOM ID: #${id} in pages/tracking.html`);
});
console.log('  ✓ All 22 required DOM structural invariants verified in pages/tracking.html\n');

// 2. Test js/tracking.js logic in mock environment
console.log('2. Testing js/tracking.js Resolution & Mapping Logic...');
const jsCode = fs.readFileSync(path.join(__dirname, '../js/tracking.js'), 'utf8');

const windowObj = {
  addEventListener: () => {},
  location: { search: '?order=ORD-9428-NX' },
  DeliveryAssistant: {
    generateGuidance: () => ({ headline: 'Your order is out for delivery', explanation: 'Package with courier', needsAction: false }),
    answerQuestion: (q) => 'Answer for ' + q
  }
};

const sandbox = {
  console,
  document: {
    addEventListener: () => {},
    getElementById: (id) => ({ id, textContent: '', innerHTML: '', style: {}, setAttribute: () => {}, classList: { toggle: () => {} } }),
    querySelectorAll: () => []
  },
  window: windowObj,
  sessionStorage: { getItem: () => null, setItem: () => {} },
  localStorage: { getItem: () => null, setItem: () => {} },
  URLSearchParams: require('url').URLSearchParams
};

vm.createContext(sandbox);
// Append exports helper
vm.runInContext(jsCode + '\n;globalThis._testExports = { resolveOrder, mapToStatusKey, mapToStatusLabel, STATUS_TO_STAGE, STAGES, DEFAULT_ORDERS };', sandbox);

const exportsObj = sandbox._testExports;

// Test resolveOrder with ?order=ORD-9428-NX
const order1 = exportsObj.resolveOrder('ORD-9428-NX');
assert.strictEqual(order1.id, 'ORD-9428-NX', 'Order ID should be ORD-9428-NX');
assert.strictEqual(order1.ref, 'ORD-9428-NX', 'Order ref should be ORD-9428-NX');
assert.strictEqual(order1.total, 285, 'Order total should be 285');
assert.strictEqual(order1.items[0].name, 'Double-Breasted Wool Overcoat', 'Item name mismatch');
assert.strictEqual(exportsObj.mapToStatusKey(order1.status), 'OUT_FOR_DELIVERY', 'Status should map to OUT_FOR_DELIVERY');
assert.strictEqual(exportsObj.STATUS_TO_STAGE['OUT_FOR_DELIVERY'], 4, 'Stage index should be 4');
console.log('  ✓ ORD-9428-NX resolution and status mapping verified.');

// Test resolveOrder with ?ref=NX-M4KZ9
const order2 = exportsObj.resolveOrder('NX-M4KZ9');
assert.strictEqual(order2.id, 'NX-M4KZ9', 'Order ID should be NX-M4KZ9');
assert.strictEqual(order2.items[0].name, 'Architectural Cashmere Sweater', 'Item name mismatch');
assert.strictEqual(exportsObj.mapToStatusKey(order2.status), 'IN_TRANSIT', 'Status should map to IN_TRANSIT');
assert.strictEqual(exportsObj.STATUS_TO_STAGE['IN_TRANSIT'], 3, 'Stage index should be 3');
console.log('  ✓ NX-M4KZ9 resolution and status mapping verified.');

// Test resolveOrder with delivered ORD-8712-NX
const order3 = exportsObj.resolveOrder('ORD-8712-NX');
assert.strictEqual(order3.id, 'ORD-8712-NX', 'Order ID should be ORD-8712-NX');
assert.strictEqual(order3.total, 320, 'Total should be 320');
assert.strictEqual(exportsObj.mapToStatusKey(order3.status), 'DELIVERED', 'Status should map to DELIVERED');
assert.strictEqual(exportsObj.STATUS_TO_STAGE['DELIVERED'], 5, 'Stage index should be 5');
console.log('  ✓ ORD-8712-NX delivered resolution verified.');

// Test custom order ID generation
const customOrder = exportsObj.resolveOrder('ORD-9999-NX');
assert.strictEqual(customOrder.id, 'ORD-9999-NX', 'Custom order ID should match');
assert(customOrder.items.length > 0, 'Custom order should have items');
console.log('  ✓ Custom order ID fallback generator verified.');

// Test empty params resolution
const defaultOrder = exportsObj.resolveOrder('');
assert(defaultOrder && defaultOrder.id, 'Default order should be returned when no param is passed');
console.log('  ✓ Empty URL params fallback resolution verified.');

console.log('\n✨ ALL Tracking Engine and DOM Verification tests PASSED with 100% precision!\n');
