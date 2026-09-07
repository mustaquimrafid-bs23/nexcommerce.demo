const assert = require('assert');
const fs = require('fs');

global.window = {};
require('../js/cart-recovery-engine.js');

const engine = global.window.NexCartRecoveryEngine;
assert(engine, 'NexCartRecoveryEngine should be attached to window');

console.log('🧪 Running NexCartRecoveryEngine Unit Tests...');

// Test 1: High cart subtotal (Price threshold diagnosis -> 15% comeback code)
const cart1 = [
  { id: 'p1', name: 'Cashmere Knit', price: 220, quantity: 1 },
  { id: 'p2', name: 'Wool Blazer', price: 264, quantity: 1 }
];
const diag1 = engine.diagnoseFriction(cart1, 484);
assert.strictEqual(diag1.frictionReason, 'price_threshold');
assert.strictEqual(diag1.incentiveCode, 'COMEBACK15');
assert.strictEqual(diag1.discountPercent, 15);
assert.strictEqual(diag1.reservationMinutes, 15);

// Test 2: Low cart subtotal under free shipping threshold (€120 -> Shipping barrier diagnosis)
const cart2 = [
  { id: 'p6', name: 'Leather Runner', price: 120, quantity: 1 }
];
const diag2 = engine.diagnoseFriction(cart2, 120);
assert.strictEqual(diag2.frictionReason, 'shipping_barrier');
assert.strictEqual(diag2.incentiveCode, 'FREESHIPNOW');

// Test 3: Recovery Token Serialization & Deserialization
const token = engine.generateRecoveryPayload(cart1);
assert(typeof token === 'string' && token.length > 0, 'Should generate encoded recovery token');

const restored = engine.decodeRecoveryPayload(token);
assert.strictEqual(restored.length, 2);
assert.strictEqual(restored[0].id, 'p1');
assert.strictEqual(restored[1].id, 'p2');

// Test 4: NLP recovery intent parser
const intent1 = engine.parseRecoveryIntent('Restore my abandoned cart');
assert(intent1.isRecoveryIntent, 'Should detect cart restoration query');

const intent2 = engine.parseRecoveryIntent('What items did I leave in my bag?');
assert(intent2.isRecoveryIntent);

console.log('✅ All NexCartRecoveryEngine unit tests passed successfully!');
