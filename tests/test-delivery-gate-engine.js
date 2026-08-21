const assert = require('assert');
const fs = require('fs');

global.window = {};
require('../js/delivery-gate-engine.js');

const engine = global.window.NexDeliveryEngine;
assert(engine, 'NexDeliveryEngine should be attached to window');

console.log('🧪 Running NexDeliveryEngine Unit Tests...');

// Test 1: Postal code to dark store hub resolution
const hub1 = engine.getHubForPostal('10115');
assert.strictEqual(hub1.id, 'berlin-mitte', '10115 should map to Berlin Mitte Hub');
assert.strictEqual(hub1.city, 'Berlin');
assert(hub1.expressSupported, 'Berlin Mitte should support express same-day delivery');

const hub2 = engine.getHubForPostal('75003');
assert.strictEqual(hub2.id, 'paris-marais', '75003 should map to Paris Marais Hub');

const hub3 = engine.getHubForPostal('99999'); // Fallback hub
assert(hub3, 'Should provide standard national fulfillment fallback for unknown postal');

// Test 2: Hyperlocal inventory filtering
const mockCatalog = [
  { id: 'p1', name: 'Cashmere Knit', hubs: { 'berlin-mitte': 5, 'paris-marais': 0 } },
  { id: 'p2', name: 'Wool Blazer', hubs: { 'berlin-mitte': 0, 'paris-marais': 3 } },
  { id: 'p3', name: 'Crewneck', hubs: { 'berlin-mitte': 2, 'paris-marais': 4 } }
];

const berlinExpress = engine.filterExpressAvailable(mockCatalog, 'berlin-mitte');
assert.strictEqual(berlinExpress.length, 2, 'Berlin hub should have 2 items available for express');
assert.strictEqual(berlinExpress[0].id, 'p1');
assert.strictEqual(berlinExpress[1].id, 'p3');

const parisExpress = engine.filterExpressAvailable(mockCatalog, 'paris-marais');
assert.strictEqual(parisExpress.length, 2, 'Paris hub should have 2 items available for express');
assert.strictEqual(parisExpress[0].id, 'p2');
assert.strictEqual(parisExpress[1].id, 'p3');

// Test 3: Cutoff countdown timer
const countdown = engine.getCutoffCountdown('berlin-mitte');
assert(typeof countdown.hoursRemaining === 'number');
assert(typeof countdown.minutesRemaining === 'number');
assert(countdown.formattedCountdown.length > 0);

// Test 4: NLP delivery intent parser
const intent1 = engine.parseDeliveryIntent('Can I get shoes delivered today in Berlin?');
assert(intent1.isDeliveryIntent, 'Should detect same-day delivery inquiry');

const intent2 = engine.parseDeliveryIntent('Do you have express 2-hour shipping to 10115?');
assert(intent2.isDeliveryIntent);
assert.strictEqual(intent2.extractedPostal, '10115');

console.log('✅ All NexDeliveryEngine unit tests passed successfully!');
