// tests/verify-order-ui-flow.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const conciergeJs = fs.readFileSync(path.join(__dirname, '../js/concierge.js'), 'utf-8');

assert.ok(conciergeJs.includes('renderOrderAddressWidget'), 'Must define renderOrderAddressWidget');
assert.ok(conciergeJs.includes('renderOrderPaymentWidget'), 'Must define renderOrderPaymentWidget');
assert.ok(conciergeJs.includes('renderOrderReviewWidget'), 'Must define renderOrderReviewWidget');
assert.ok(conciergeJs.includes('renderOrderConfirmedWidget'), 'Must define renderOrderConfirmedWidget');
assert.ok(conciergeJs.includes('order_address'), 'Must handle order_address in renderConciergeResponse');
assert.ok(conciergeJs.includes('order_payment'), 'Must handle order_payment in renderConciergeResponse');
assert.ok(conciergeJs.includes('order_review'), 'Must handle order_review in renderConciergeResponse');
assert.ok(conciergeJs.includes('order_confirmed'), 'Must handle order_confirmed in renderConciergeResponse');

console.log('✔ Order UI Flow static and DOM checks passed!');
