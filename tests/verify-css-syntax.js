// tests/verify-css-syntax.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '../css/design-system.css'), 'utf-8');

// Assert brace balance
let openCount = 0;
for (let i = 0; i < css.length; i++) {
  if (css[i] === '{') openCount++;
  if (css[i] === '}') openCount--;
  assert.ok(openCount >= 0, `Unmatched closing brace found at character ${i}`);
}
assert.strictEqual(openCount, 0, 'All CSS braces must be perfectly balanced');

// Assert Voice UI classes exist
assert.ok(css.includes('.concierge-mic-btn'), 'Must contain .concierge-mic-btn');
assert.ok(css.includes('.concierge-input-bar.listening'), 'Must contain .concierge-input-bar.listening');
assert.ok(css.includes('.stylist-audio-bar'), 'Must contain .stylist-audio-bar');
assert.ok(css.includes('.mini-waveform'), 'Must contain .mini-waveform');

console.log('✔ CSS syntax and Voice UI rules verified successfully!');
