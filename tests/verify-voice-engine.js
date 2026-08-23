// tests/verify-voice-engine.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const engineCode = fs.readFileSync(path.join(__dirname, '../js/concierge-engine.js'), 'utf-8');
const sandbox = { 
  window: {},
  location: { pathname: '/pages/discovery.html', search: '' }
};
vm.createContext(sandbox);
vm.runInContext(engineCode, sandbox);

const ConciergeEngine = sandbox.window.ConciergeEngine;
assert.ok(ConciergeEngine, 'ConciergeEngine must be defined on window');

const engine = new ConciergeEngine();
engine.initialize();

// Test 1: Strip conversational filler words from voice input & return spokenSummary
const parsedOutfit = engine.parseQuery("Hey stylist, can you please find me an outfit under 300 euros with sneakers?");
assert.ok(parsedOutfit, 'Should return a valid response object');
assert.ok(parsedOutfit.products && parsedOutfit.products.length > 0, 'Should return matching products');
assert.ok(parsedOutfit.spokenSummary && typeof parsedOutfit.spokenSummary === 'string', 'Should return spokenSummary text');
assert.ok(parsedOutfit.spokenSummary.length > 0, 'spokenSummary should not be empty');

// Test 2: Voice sizing inquiry
const parsedSizing = engine.parseQuery("Tell me how the cashmere sweater fits");
assert.strictEqual(parsedSizing.type, 'sizing_advisor', 'Should route to sizing_advisor');
assert.ok(parsedSizing.spokenSummary && (parsedSizing.spokenSummary.toLowerCase().includes('fit') || parsedSizing.spokenSummary.toLowerCase().includes('cashmere') || parsedSizing.spokenSummary.toLowerCase().includes('size')), 'spokenSummary should contain sizing guidance');

// Test 3: Standard queries also have spokenSummary
const parsedCatalog = engine.parseQuery("Show titanium watch");
assert.ok(parsedCatalog.spokenSummary, 'Catalog queries must have spokenSummary');

console.log('✔ All Voice Engine tests passed successfully!');
