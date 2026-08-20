// tests/test-wishlist-suite.js
const assert = require('assert');
const fs = require('fs');

// Mock localStorage & Window
class MockLocalStorage {
  constructor() { this.store = {}; }
  getItem(k) { return this.store[k] !== undefined ? this.store[k] : null; }
  setItem(k, v) { this.store[k] = String(v); }
  removeItem(k) { delete this.store[k]; }
  clear() { this.store = {}; }
}

global.window = {
  dispatchEvent: () => true,
  CustomEvent: function(name, opts) { this.name = name; this.detail = opts ? opts.detail : null; }
};

// Load engine code
const engineCode = fs.readFileSync('js/wishlist-engine.js', 'utf8');
eval(engineCode);

const Engine = window.NexWishlistEngine;
assert.ok(Engine, 'NexWishlistEngine must be defined');

console.log('1. Testing Default Seed vs. Explicit Empty Array Guardrail...');
const storage1 = new MockLocalStorage();
// First time visitor (null) -> seeds default
const defaultIds = Engine.getSavedWishlist(storage1);
assert.deepStrictEqual(defaultIds, ['p1', 'p4', 'p6'], 'Null storage must seed defaults [p1, p4, p6]');

// Explicit empty array '[]' -> remains empty, never resurrects
storage1.setItem('nex_curated_wishlist_ids', '[]');
const emptyIds = Engine.getSavedWishlist(storage1);
assert.deepStrictEqual(emptyIds, [], 'Explicitly cleared wishlist must return []');

console.log('2. Testing Catalog Integrity & Multi-Asset Metadata...');
const catalog = Engine.getCatalog();
assert.ok(catalog.p1 && catalog.p4 && catalog.p6 && catalog.p7, 'Catalog must contain core products');
assert.ok(Array.isArray(catalog.p1.gallery) && catalog.p1.gallery.length >= 3, 'Products must have multi-asset gallery');
assert.ok(catalog.p1.variants.finishes.length >= 2, 'Products must have finish swatches');
assert.ok(catalog.p1.variants.sizes.length >= 3, 'Products must have size blocks');

console.log('3. Testing Capsule Stats & Category Filtering...');
const stats = Engine.computeCapsuleStats(['p1', 'p4', 'p6']);
assert.strictEqual(stats.all.count, 3);
assert.strictEqual(stats.apparel.count, 1);
assert.strictEqual(stats.acoustics.count, 1);
assert.strictEqual(stats.footwear.count, 1);
assert.strictEqual(stats.all.value, catalog.p1.price + catalog.p4.price + catalog.p6.price);

console.log('4. Testing Cart Payload Generator...');
const payload = Engine.createCartPayload('p1', '50', 'charcoal');
assert.strictEqual(payload.id, 'p1');
assert.strictEqual(payload.size, '50');
assert.strictEqual(payload.finish, 'charcoal');
assert.strictEqual(payload.price, catalog.p1.price);
assert.strictEqual(payload.quantity, 1);

console.log('5. Testing Add / Remove Mutations...');
const storage2 = new MockLocalStorage();
Engine.addToWishlist('p2', storage2);
let current = Engine.getSavedWishlist(storage2);
assert.ok(current.includes('p2'), 'Adding p2 should include it in saved list');
Engine.removeFromWishlist('p2', storage2);
current = Engine.getSavedWishlist(storage2);
assert.ok(!current.includes('p2'), 'Removing p2 should remove it from saved list');

console.log('✨ All Vault Engine unit tests passed with 100% precision!');
