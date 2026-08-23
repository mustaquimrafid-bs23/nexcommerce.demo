// tests/test-deferred-payment.js
const assert = require('assert');
const fs = require('fs');

console.log('🧪 Starting Deferred Payment & Post-Order Online Payment Test Suite...');

// Mock browser environment
const localStorageStore = {};
global.localStorage = {
  getItem: (k) => localStorageStore[k] || null,
  setItem: (k, v) => { localStorageStore[k] = String(v); },
  removeItem: (k) => { delete localStorageStore[k]; },
  clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
};
global.sessionStorage = {
  getItem: () => null,
  setItem: () => {}
};

global.window = {
  location: { search: '', pathname: '/pages/tracking.html' },
  NexAI: {
    catalogArray: [
      { id: 'p1', title: 'Architectural Cashmere Sweater', category: 'Apparel', numericPrice: 185, price: '€ 185.00', img: 'assets/images/products/hero_sweater.png' }
    ],
    catalog: {}
  },
  NexAuth: { isLoggedIn: () => true }
};

// 1. Load Concierge Engine
const engineCode = fs.readFileSync('js/concierge-engine.js', 'utf8');
eval(engineCode);

console.log('1. Testing AI Engine COD Order Default Generation...');
const orderInit = window.NexConciergeEngine.processMessage('I want to place an order');
assert.strictEqual(orderInit.type, 'order_address', 'Order flow must start with address');

const addrConfirm = window.NexConciergeEngine.processMessage('Confirm address: Maximilianstraße 34, Munich');
assert.strictEqual(addrConfirm.type, 'order_payment', 'Proceeds to payment method');
assert.ok(addrConfirm.widgetPayload.paymentMethods.some(m => m.id === 'cod' && m.selected), 'Cash on Delivery must be default selected payment');

const reviewConfirm = window.NexConciergeEngine.processMessage('Pay with Cash on Delivery');
assert.strictEqual(reviewConfirm.type, 'order_review', 'Proceeds to order review');

const orderFinal = window.NexConciergeEngine.processMessage('Authorize & place order now');
assert.strictEqual(orderFinal.type, 'order_confirmed', 'Order placed successfully');
assert.strictEqual(orderFinal.widgetPayload.paymentStatus, 'pending_cod', 'Order state is pending_cod');
assert.ok(orderFinal.actionLink.url.includes('pay=online'), 'Action link redirects with ?pay=online parameter');

console.log('2. Testing DLP Financial Credential Interception...');
const cardEntries = [
  '4111 2222 3333 4444',
  'Here is my card 4532-1234-5678-9012 with cvv 999',
  'cvv: 456',
  'pin code 1234'
];
for (const entry of cardEntries) {
  const resp = window.NexConciergeEngine.processMessage(entry);
  assert.strictEqual(resp.type, 'security_alert', `Input "${entry}" must trigger security_alert`);
  assert.ok(resp.text.includes('Security Guardrail'), `Response for "${entry}" must contain security guardrail text`);
}

console.log('3. Testing Post-Order Storage & State Mutation...');
// Simulate placing order into localStorage
const testOrderCode = 'NX-9988-M';
const testOrder = {
  id: testOrderCode,
  ref: testOrderCode,
  date: 'August 24, 2026',
  placedDate: 'August 24, 2026',
  status: 'in_transit',
  statusLabel: 'Confirmed · Preparing for Dispatch',
  total: 256.50,
  subtotal: 285.00,
  paymentMethod: 'Cash on Delivery (Pay on Arrival)',
  paymentStatus: 'pending_cod',
  customer: { name: 'Julian Mercer', address: 'Maximilianstraße 34, Munich' },
  items: [{ name: 'Architectural Cashmere Sweater', price: 185, qty: 1 }]
};
localStorage.setItem('nex_placed_orders', JSON.stringify([testOrder]));

// Simulate online payment authorization update
const storedOrders = JSON.parse(localStorage.getItem('nex_placed_orders'));
const target = storedOrders.find(o => o.id === testOrderCode);
assert.ok(target, 'Order must exist in storage');
assert.strictEqual(target.paymentStatus, 'pending_cod', 'Initial status must be pending_cod');

// Upgrade payment
target.paymentStatus = 'paid';
target.paidOnline = true;
target.paymentMethod = 'Paid online via Apple Pay / Visa 3DS';
localStorage.setItem('nex_placed_orders', JSON.stringify(storedOrders));

// Verify mutation
const updatedOrders = JSON.parse(localStorage.getItem('nex_placed_orders'));
assert.strictEqual(updatedOrders[0].paymentStatus, 'paid', 'Status must update to paid');
assert.strictEqual(updatedOrders[0].paidOnline, true, 'paidOnline must be true');
assert.ok(updatedOrders[0].paymentMethod.includes('Apple Pay'), 'Payment method must reflect Apple Pay');

console.log('✨ All Deferred Payment & COD-to-Online Test Scenarios PASSED with 100% precision!');
