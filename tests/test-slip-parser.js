const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock DOM/window environment
global.window = {};
require('../js/slip-parser.js');

const parser = global.window.NexSlipParser;
assert(parser, 'NexSlipParser should be attached to window');

const MOCK_CATALOG = [
  { id: 'p1', name: 'Pure Cashmere Sweater', brand: 'Arc', price: 185, category: 'Apparel', image: 'assets/images/products/hero_sweater.png', variants: { sizes: [{ id: 'S', inStock: true }, { id: 'M', inStock: true }, { id: 'L', inStock: true }] } },
  { id: 'p2', name: 'Fine-Knit Cashmere Crew', brand: 'Arc', price: 160, category: 'Apparel', image: 'assets/images/products/plp_crewneck.png', variants: { sizes: [{ id: 'S', inStock: true }, { id: 'M', inStock: true }] } },
  { id: 'p3', name: 'Structured Wool Blazer', brand: 'Arc', price: 245, category: 'Apparel', image: 'assets/images/products/plp_blazer.png', variants: { sizes: [{ id: '46', inStock: true }, { id: '48', inStock: true }] } },
  { id: 'p4', name: 'Studio Acoustics Headphone GT', brand: 'Form', price: 320, category: 'Acoustics', image: 'assets/images/products/p4.png' },
  { id: 'p6', name: 'Minimalist Leather Runner', brand: 'Apex', price: 198, category: 'Footwear', image: 'assets/images/products/leather_sneaker.png' },
  { id: 'p8', name: 'Chronograph Minimalist Watch', brand: 'Volta', price: 285, category: 'Accessories', image: 'assets/images/products/titanium_watch.png' }
];

console.log('🧪 Running NexSlipParser Unit Tests...');

// Test 1: Raw text parsing with quantities & sizes
const sampleText = `
1. 2x Pure Cashmere Sweater (Size M)
2. 1x Wool Blazer size 48
3. 3 pcs Fine-Knit Crew
4. Minimalist Leather Runner
5. Unknown Silk Scarf 100%
`;

const parsed = parser.parseRawText(sampleText);
assert.strictEqual(parsed.length, 5, 'Should parse exactly 5 non-empty line items');
assert.strictEqual(parsed[0].quantity, 2, 'Line 1 quantity should be 2');
assert.strictEqual(parsed[0].sizeHint, 'M', 'Line 1 size hint should be M');
assert.strictEqual(parsed[1].quantity, 1, 'Line 2 quantity should be 1');
assert.strictEqual(parsed[1].sizeHint, '48', 'Line 2 size hint should be 48');
assert.strictEqual(parsed[2].quantity, 3, 'Line 3 quantity should be 3');
assert.strictEqual(parsed[3].quantity, 1, 'Line 4 default quantity should be 1');

// Test 2: Catalog matching & confidence scoring
const matchResult = parser.matchSlipToCatalog(parsed, MOCK_CATALOG);
assert.strictEqual(matchResult.matched.length, 4, 'Should match 4 catalog products');
assert.strictEqual(matchResult.unmatched.length, 1, 'Should have 1 unmatched item');

// Test 3: Assert first match is Pure Cashmere Sweater with high confidence
const match1 = matchResult.matched[0];
assert.strictEqual(match1.product.id, 'p1', 'First match should be p1');
assert.strictEqual(match1.quantity, 2, 'First match quantity should be 2');
assert.strictEqual(match1.confidence >= 0.7, true, 'First match confidence should be >= 0.7');

// Test 4: Cart payload generation
const cartPayload = parser.buildCartPayload(matchResult.matched);
assert.strictEqual(cartPayload.length, 4, 'Cart payload should have 4 items');
assert.strictEqual(cartPayload[0].id, 'p1');
assert.strictEqual(cartPayload[0].quantity, 2);
assert.strictEqual(cartPayload[0].variant, 'M');

// Test 5: Ambiguity detection
const ambiguousText = '1x Cashmere';
const ambParsed = parser.parseRawText(ambiguousText);
const ambMatch = parser.matchSlipToCatalog(ambParsed, MOCK_CATALOG);
assert(ambMatch.matched[0].isAmbiguous, 'Single generic term "Cashmere" should be flagged as ambiguous');
assert(ambMatch.matched[0].alternatives.length >= 2, 'Should provide at least 2 alternative products');

console.log('✅ All NexSlipParser unit tests passed successfully!');
