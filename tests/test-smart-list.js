const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const tsCode = fs.readFileSync(path.join(__dirname, '../data/smartListProducts.ts'), 'utf8');
const declIndex = tsCode.indexOf('SMART_LIST_PRODUCTS');
const arrayStartIndex = tsCode.indexOf('[', declIndex);
const arrayEndIndex = tsCode.lastIndexOf(']');
const jsonLike = tsCode.slice(arrayStartIndex, arrayEndIndex + 1);
const SMART_LIST_PRODUCTS = new Function(`return ${jsonLike}`)();

console.log('--- Tier 1: Automated Smart List Logic & Catalog Integrity Tests ---');

// 1. Catalog Item Count & Schema
assert.strictEqual(SMART_LIST_PRODUCTS.length, 12, 'SMART_LIST_PRODUCTS must have exactly 12 items');

// 2. Category Distributions
const apparelCount = SMART_LIST_PRODUCTS.filter(p => p.category === 'Apparel').length;
const acousticsCount = SMART_LIST_PRODUCTS.filter(p => p.category === 'Acoustics').length;
const footwearCount = SMART_LIST_PRODUCTS.filter(p => p.category === 'Footwear').length;
const timepiecesCount = SMART_LIST_PRODUCTS.filter(p => p.category === 'Timepieces').length;
const accessoriesCount = SMART_LIST_PRODUCTS.filter(p => p.category === 'Accessories').length;

assert.strictEqual(apparelCount, 7, 'Apparel must have 7 products');
assert.strictEqual(acousticsCount, 2, 'Acoustics must have 2 products');
assert.strictEqual(footwearCount, 1, 'Footwear must have 1 product');
assert.strictEqual(timepiecesCount, 1, 'Timepieces must have 1 product');
assert.strictEqual(accessoriesCount, 1, 'Accessories must have 1 product');
console.log('✓ Category distribution test passed');

// 3. Stock Invariant
const inStockCount = SMART_LIST_PRODUCTS.filter(p => p.inStock).length;
const outOfStockCount = SMART_LIST_PRODUCTS.filter(p => !p.inStock).length;
assert.strictEqual(inStockCount, 10, 'Must have exactly 10 in-stock products');
assert.strictEqual(outOfStockCount, 2, 'Must have exactly 2 out-of-stock products (p6 & p11)');
console.log('✓ Stock status invariant passed (10 in-stock, 2 out-of-stock)');

// 4. In-Stock Total Valuation
const totalValuation = SMART_LIST_PRODUCTS.filter(p => p.inStock).reduce((sum, p) => sum + p.price, 0);
assert.strictEqual(totalValuation, 2125, 'Total in-stock base valuation must equal 2125');
console.log('✓ In-stock total valuation calculation passed (€ ' + totalValuation.toFixed(2) + ')');

// 5. Variants and Swatches Integrity
SMART_LIST_PRODUCTS.forEach(product => {
  assert(product.id, 'Product must have an id');
  assert(product.name, 'Product must have a name');
  assert(product.price > 0, 'Product must have a positive price');
  assert(product.image.startsWith('/assets/'), `Product image must start with /assets/ for ${product.name}`);
  assert(product.variants, `Product must have variants for ${product.name}`);
  assert(Array.isArray(product.variants.finishes), `Finishes must be an array for ${product.name}`);
  assert(Array.isArray(product.variants.sizes), `Sizes must be an array for ${product.name}`);
});
console.log('✓ All 12 products passed schema & asset path integrity tests');

// 6. Selection & Batch Math Simulator
let selectedIds = new Set();
// Toggle single
selectedIds.add('p1');
assert.strictEqual(selectedIds.size, 1);
assert.strictEqual(selectedIds.has('p1'), true);

// Select all in-stock
const inStockIds = SMART_LIST_PRODUCTS.filter(p => p.inStock).map(p => p.id);
inStockIds.forEach(id => selectedIds.add(id));
assert.strictEqual(selectedIds.size, 10);

// Subtotal calculation
const batchSubtotal = SMART_LIST_PRODUCTS.filter(p => selectedIds.has(p.id)).reduce((sum, p) => sum + p.price, 0);
assert.strictEqual(batchSubtotal, 2125);

// Clear selection
selectedIds.clear();
assert.strictEqual(selectedIds.size, 0);
console.log('✓ Batch selection & subtotal calculation tests passed');

console.log('\nAll Smart List Unit & Catalog Integrity Tests PASSED! (6/6)');
