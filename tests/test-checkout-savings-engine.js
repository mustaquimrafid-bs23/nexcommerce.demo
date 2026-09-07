const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock DOM/window environment
global.window = {};
require('../js/checkout-savings-engine.js');

const engine = global.window.NexSavingsEngine;
assert(engine, 'NexSavingsEngine should be attached to window');

console.log('🧪 Running NexSavingsEngine Unit Tests...');

// Test 1: Optimal coupon selection based on subtotal thresholds
// Subtotal = €450 (VIP20 is 20% > €400 = €90 off; ATELIER15 is 15% > €200 = €67.50 off)
const opt1 = engine.evaluateSavings(450, 'card');
assert.strictEqual(opt1.bestCoupon.code, 'VIP20', 'Should select VIP20 for subtotal > €400');
assert.strictEqual(opt1.bestCoupon.discountAmount, 90.00, 'VIP20 discount on €450 should be €90');
assert.strictEqual(opt1.totalSavings, 90.00, 'Total savings should match coupon discount');

// Test 2: Subtotal = €250 (ATELIER15 is 15% > €200 = €37.50 off; WELCOME10 is 10% = €25 off)
const opt2 = engine.evaluateSavings(250, 'card');
assert.strictEqual(opt2.bestCoupon.code, 'ATELIER15', 'Should select ATELIER15 for subtotal between €200 and €400');
assert.strictEqual(opt2.bestCoupon.discountAmount, 37.50);

// Test 3: Subtotal = €120 (WELCOME10 is 10% = €12 off; other tiered coupons ineligible)
const opt3 = engine.evaluateSavings(120, 'card');
assert.strictEqual(opt3.bestCoupon.code, 'WELCOME10', 'Should select WELCOME10 for lower subtotal');
assert.strictEqual(opt3.bestCoupon.discountAmount, 12.00);

// Test 4: Threshold Headroom / Proactive Upsell Tip
// Subtotal = €380 (Only €20 away from VIP20 unlocking €80+ savings)
const opt4 = engine.evaluateSavings(380, 'card');
assert(opt4.upgradeOpportunity, 'Should flag upgrade opportunity when close to VIP20 threshold');
assert.strictEqual(opt4.upgradeOpportunity.neededAmount, 20.00, 'Should accurately compute €20 needed for VIP20');

// Test 5: Intent parsing for conversational assistant
const intent1 = engine.parseSavingsIntent('Can you give me the best promo code or discount?');
assert(intent1.isSavingsIntent, 'Should detect savings query intent');

const intent2 = engine.parseSavingsIntent('How can I save money on checkout?');
assert(intent2.isSavingsIntent, 'Should detect checkout optimization query');

console.log('✅ All NexSavingsEngine unit tests passed successfully!');
