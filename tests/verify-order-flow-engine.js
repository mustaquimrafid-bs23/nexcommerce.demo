const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const engineCode = fs.readFileSync(path.join(__dirname, '../js/concierge-engine.js'), 'utf-8');
const sandbox = { window: {}, location: { pathname: '/pages/discovery.html' } };
vm.createContext(sandbox);
vm.runInContext(engineCode, sandbox);

const ConciergeEngine = sandbox.window.ConciergeEngine || sandbox.window.NexConciergeEngine;
assert.ok(ConciergeEngine, 'ConciergeEngine must be exported');
const engine = new ConciergeEngine();
engine.initialize();

// Test 1: Triggering order flow starts at Step 1 (Address)
const resStep1 = engine.processMessage("I want to place an order");
assert.strictEqual(resStep1.type, 'order_address', 'Should route to order_address step');
assert.ok(resStep1.widgetPayload && resStep1.widgetPayload.defaultAddress, 'Should provide default address');
assert.ok(resStep1.spokenSummary, 'Should provide spoken audio summary for Step 1');

// Test 2: Submitting address moves to Step 2 (Payment)
const resStep2 = engine.processMessage("Confirm address: Maximilianstraße 34, Munich");
assert.strictEqual(resStep2.type, 'order_payment', 'Should route to order_payment step');
assert.ok(resStep2.widgetPayload && resStep2.widgetPayload.paymentMethods.length >= 4, 'Should provide 4 payment methods');
assert.ok(resStep2.spokenSummary, 'Should provide spoken audio summary for Step 2');

// Test 3: Submitting payment moves to Step 3 (Review)
const resStep3 = engine.processMessage("Pay with Apple Pay");
assert.strictEqual(resStep3.type, 'order_review', 'Should route to order_review step');
assert.ok(resStep3.widgetPayload && resStep3.widgetPayload.totalDue, 'Should calculate total due');
assert.ok(resStep3.spokenSummary, 'Should provide spoken audio summary for Step 3');

// Test 4: Final confirmation generates Order Code & Live Tracking
const resStep4 = engine.processMessage("Authorize & place order now");
assert.strictEqual(resStep4.type, 'order_confirmed', 'Should route to order_confirmed step');
assert.ok(resStep4.orderCode && resStep4.orderCode.startsWith('NX-'), 'Should generate NX- code');
assert.ok(resStep4.widgetPayload && resStep4.widgetPayload.trackingSteps, 'Should provide tracking steps');
assert.ok(resStep4.spokenSummary, 'Should provide spoken audio summary for Step 4');

console.log('✔ All Order Flow Engine tests passed successfully!');
