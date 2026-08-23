const assert = require('assert');

// Mock browser globals for Node test runner
const localStorageStore = {};
const sessionStorageStore = {};

global.localStorage = {
  getItem: (key) => localStorageStore[key] || null,
  setItem: (key, val) => { localStorageStore[key] = String(val); },
  removeItem: (key) => { delete localStorageStore[key]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};

global.sessionStorage = {
  getItem: (key) => sessionStorageStore[key] || null,
  setItem: (key, val) => { sessionStorageStore[key] = String(val); },
  removeItem: (key) => { delete sessionStorageStore[key]; },
  clear: () => { Object.keys(sessionStorageStore).forEach(k => delete sessionStorageStore[k]); }
};

let dispatchedEvents = [];
global.window = {
  localStorage: global.localStorage,
  sessionStorage: global.sessionStorage,
  dispatchEvent: (event) => {
    dispatchedEvents.push(event);
    return true;
  },
  CustomEvent: class CustomEvent {
    constructor(type, params) {
      this.type = type;
      this.detail = params ? params.detail : null;
    }
  }
};
global.CustomEvent = global.window.CustomEvent;

// Load module
require('../js/order-cancellation.js');

const engine = global.window.NexOrderCancellation;
assert(engine, 'NexOrderCancellation should be attached to window');

console.log('🧪 Running NexOrderCancellation Unit & Functional Tests...');

// ── Test 1: Eligibility check ──────────────────────────────
console.log('  Testing eligibility criteria...');
assert.strictEqual(engine.isEligible({ status: 'preparing' }), true, 'Preparing order should be cancellable');
assert.strictEqual(engine.isEligible({ status: 'PREPARING' }), true, 'PREPARING order should be cancellable');
assert.strictEqual(engine.isEligible({ status: 'transit' }), true, 'Transit order before delivery should be cancellable');
assert.strictEqual(engine.isEligible({ status: 'IN_TRANSIT' }), true, 'IN_TRANSIT order should be cancellable');
assert.strictEqual(engine.isEligible({ status: 'confirmed' }), true, 'Confirmed order should be cancellable');
assert.strictEqual(engine.isEligible({ status: 'delivered' }), false, 'Delivered order must not be cancellable');
assert.strictEqual(engine.isEligible({ status: 'DELIVERED' }), false, 'DELIVERED order must not be cancellable');
assert.strictEqual(engine.isEligible({ status: 'cancelled' }), false, 'Already cancelled order must not be cancellable');
assert.strictEqual(engine.isEligible({ status: 'CANCELLED' }), false, 'Already CANCELLED order must not be cancellable');
assert.strictEqual(engine.isEligible(null), false, 'Null order must not be cancellable');

// ── Test 2: Structured reasons catalogue ───────────────────
console.log('  Testing cancellation reasons catalogue...');
const reasons = engine.getReasonOptions();
assert(Array.isArray(reasons), 'Reasons should be an array');
assert(reasons.length >= 5, 'Should offer at least 5 structured cancellation reasons');
assert(reasons.some(r => r.id === 'mistake'), 'Should have accidental order reason');
assert(reasons.some(r => r.id === 'address'), 'Should have address change reason');
assert(reasons.some(r => r.id === 'delivery_time'), 'Should have delivery ETA reason');

// ── Test 3: Refund computation helper ──────────────────────
console.log('  Testing refund computation...');
const sampleOrder = {
  id: 'ORD-9428-NX',
  total: 285.00,
  payment: 'Klarna Pay Later',
  items: [{ name: 'Wool Coat', price: 285.00, quantity: 1 }]
};
const refund = engine.calculateRefundDetails(sampleOrder);
assert.strictEqual(refund.amount, 285.00);
assert.strictEqual(refund.currency, 'EUR');
assert.strictEqual(refund.formattedAmount, '€ 285.00');
assert.strictEqual(refund.targetMethod, 'Klarna Pay Later');
assert(typeof refund.timelineDays === 'string');

// ── Test 4: Order Cancellation state mutation in localStorage ──
console.log('  Testing state mutation in localStorage and event dispatch...');
const initialOrders = [
  {
    id: 'ORD-9428-NX',
    date: 'August 16, 2026',
    status: 'transit',
    statusLabel: 'Out for Delivery',
    total: 285.00,
    payment: 'Klarna Pay Later'
  },
  {
    id: 'ORD-8712-NX',
    date: 'July 28, 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    total: 320.00,
    payment: 'Apple Pay'
  }
];
global.localStorage.setItem('nex_placed_orders', JSON.stringify(initialOrders));

dispatchedEvents = [];
const cancelResult = engine.cancelOrder('ORD-9428-NX', 'mistake', 'Accidentally ordered double');

assert.strictEqual(cancelResult.success, true, 'Cancellation should succeed');
assert.strictEqual(cancelResult.order.status, 'cancelled');
assert.strictEqual(cancelResult.order.statusLabel, 'Cancelled');
assert.strictEqual(cancelResult.order.cancellationReasonId, 'mistake');
assert(cancelResult.order.cancelledAt, 'Should stamp ISO cancelledAt timestamp');

// Verify stored data
const updatedStored = JSON.parse(global.localStorage.getItem('nex_placed_orders'));
const updatedOrder = updatedStored.find(o => o.id === 'ORD-9428-NX');
assert.strictEqual(updatedOrder.status, 'cancelled');
assert.strictEqual(updatedOrder.statusLabel, 'Cancelled');

// Verify event dispatched
assert.strictEqual(dispatchedEvents.length >= 1, true, 'Should dispatch cancellation event');
const cancelEvent = dispatchedEvents.find(e => e.type === 'nex:order-cancelled');
assert(cancelEvent, 'Event type must be nex:order-cancelled');
assert.strictEqual(cancelEvent.detail.orderId, 'ORD-9428-NX');
assert.strictEqual(cancelEvent.detail.refundAmount, 285.00);

// ── Test 5: Re-cancellation idempotence ────────────────────
console.log('  Testing idempotence & ineligible order rejection...');
const secondCancelResult = engine.cancelOrder('ORD-9428-NX', 'mistake');
assert.strictEqual(secondCancelResult.success, false, 'Already cancelled order cannot be cancelled again');

const deliveredCancelResult = engine.cancelOrder('ORD-8712-NX', 'mistake');
assert.strictEqual(deliveredCancelResult.success, false, 'Delivered order cannot be cancelled');

// ── Test 6: sessionStorage confirmed order sync ────────────
console.log('  Testing sessionStorage confirmed order sync...');
const confirmedOrder = {
  ref: 'NX-CONFIRM-123',
  status: 'PREPARING',
  total: 184.00,
  paymentMethod: 'Apple Pay'
};
global.sessionStorage.setItem('nex_confirmed_order', JSON.stringify(confirmedOrder));

const confirmCancelResult = engine.cancelOrder('NX-CONFIRM-123', 'address');
assert.strictEqual(confirmCancelResult.success, true);
const updatedSessionOrder = JSON.parse(global.sessionStorage.getItem('nex_confirmed_order'));
assert.strictEqual(updatedSessionOrder.status, 'CANCELLED');
assert.strictEqual(updatedSessionOrder.statusLabel, 'Cancelled');

console.log('✅ ALL NexOrderCancellation Unit & Functional Tests Passed Successfully!');
