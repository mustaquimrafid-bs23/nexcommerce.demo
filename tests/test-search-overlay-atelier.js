const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Running Search Overlay Option 3 (Curated Editorial Atelier) Tests...\n');

// 1. Validate search-overlay.js contains Option 3 structures
const searchJs = fs.readFileSync(path.join(__dirname, '../js/search-overlay.js'), 'utf8');

assert(searchJs.includes('atelier-dept-nav'), 'search-overlay.js must include .atelier-dept-nav');
assert(searchJs.includes('atelier-products-grid'), 'search-overlay.js must include .atelier-products-grid');
assert(searchJs.includes('atelier-curation-section'), 'search-overlay.js must include .atelier-curation-section');
assert(searchJs.includes('SEASONAL HIGHLIGHTS'), 'search-overlay.js must include SEASONAL HIGHLIGHTS headline');
assert(searchJs.includes('atelier-recent-footer') || searchJs.includes('atelier-recent-list'), 'search-overlay.js must include compact recent searches');

console.log('  ✓ search-overlay.js Option 3 structures verified');

// 2. Validate design-system.css contains Option 3 rules
const css = fs.readFileSync(path.join(__dirname, '../css/design-system.css'), 'utf8');

assert(css.includes('.atelier-dept-nav'), 'design-system.css must include .atelier-dept-nav');
assert(css.includes('.atelier-products-grid'), 'design-system.css must include .atelier-products-grid');
assert(css.includes('.atelier-product-item'), 'design-system.css must include .atelier-product-item');
assert(css.includes('.atelier-thumb'), 'design-system.css must include .atelier-thumb');
assert(css.includes('.atelier-brand'), 'design-system.css must include .atelier-brand');
assert(css.includes('.atelier-name'), 'design-system.css must include .atelier-name');
assert(css.includes('.atelier-price'), 'design-system.css must include .atelier-price');

console.log('  ✓ design-system.css Option 3 styles verified');

// 3. Validate balanced CSS braces
let depth = 0;
for (let i = 0; i < css.length; i++) {
  if (css[i] === '{') depth++;
  else if (css[i] === '}') depth--;
  if (depth < 0) throw new Error('Unbalanced closed brace at index ' + i);
}
assert.strictEqual(depth, 0, 'CSS must have exactly 0 unclosed braces');
console.log('  ✓ CSS AST brace balance verified (depth = 0)');

console.log('\n✨ ALL Search Overlay Option 3 tests passed with 100% precision!\n');
