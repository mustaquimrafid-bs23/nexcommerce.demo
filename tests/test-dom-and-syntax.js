// tests/test-dom-and-syntax.js
const fs = require('fs');
const assert = require('assert');

const content = fs.readFileSync('pages/wishlist.html', 'utf8');

// 1. Check CSS braces
const styleMatch = content.match(/<style>([\s\S]*?)<\/style>/);
assert.ok(styleMatch, 'Style tag must exist');
const style = styleMatch[1];
const open = (style.match(/{/g) || []).length;
const close = (style.match(/}/g) || []).length;
assert.strictEqual(open, close, `CSS brace count mismatch: open=${open}, close=${close}`);
console.log(`✓ CSS braces balanced: ${open} pairs`);

// 2. Check essential IDs
const ids = [
  'wishlistGrid',
  'wishlistBatchDock',
  'batchSelectedCount',
  'batchSelectedValue',
  'batchMoveToBagBtn',
  'batchClearBtn',
  'batchRemoveBtn',
  'quicklookDrawer',
  'quicklookOverlay',
  'quicklookBody',
  'quicklookFooter',
  'vaultPieceCount',
  'vaultTotalValue',
  'wishlistSpotlightBar',
  'wishlistStatsBar'
];

ids.forEach(id => {
  assert.ok(content.includes(`id="${id}"`), `Missing required ID in wishlist.html: ${id}`);
});
console.log(`✓ All ${ids.length} essential DOM IDs verified!`);

console.log('✨ All HTML DOM & CSS syntax checks passed!');
