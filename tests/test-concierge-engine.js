// tests/test-concierge-engine.js
const assert = require('assert');
const fs = require('fs');

// Mock browser environment
global.window = {
  location: { search: '?id=NX-APP-001', pathname: '/product.html' },
  NexAI: {
    catalogArray: [
      { id: 'NX-APP-001', title: 'Cashmere Minimalist Knit', category: 'Apparel', numericPrice: 280, price: '€ 280.00', img: 'assets/images/products/hero_sweater.png' },
      { id: 'NX-APP-002', title: 'Relaxed Tailored Trouser', category: 'Apparel', numericPrice: 240, price: '€ 240.00', img: 'assets/images/products/merino_wool_trousers.png' },
      { id: 'NX-FTW-001', title: 'Minimalist Leather Runner', category: 'Footwear', numericPrice: 320, price: '€ 320.00', img: 'assets/images/products/leather_sneaker.png' },
      { id: 'NX-APP-003', title: 'Double-Breasted Wool Overcoat', category: 'Apparel', numericPrice: 480, price: '€ 480.00', img: 'assets/images/products/minimalist_trench.png' }
    ],
    catalog: {}
  }
};
global.window.NexAI.catalogArray.forEach(p => global.window.NexAI.catalog[p.id] = p);
global.sessionStorage = { getItem: () => null, setItem: () => {} };

// Load concierge-engine
const engineCode = fs.readFileSync('js/concierge-engine.js', 'utf8');
eval(engineCode);

console.log('Testing ConciergeEngine initialize with PDP context...');
const initPDP = window.NexConciergeEngine.initialize({ url: 'product.html?id=NX-APP-001', productId: 'NX-APP-001' });
assert.ok(initPDP.text.includes('Cashmere Minimalist Knit'), 'Greeting should reference PDP product');
assert.ok(initPDP.suggestedChips.length >= 3, 'Should provide relevant contextual chips');

console.log('Testing Occasion & Look Bundle Intent...');
const lookResp = window.NexConciergeEngine.processMessage('Complete a look for the office');
assert.strictEqual(lookResp.type, 'bundle_look', 'Response should be a bundle_look');
assert.ok(lookResp.products.length >= 2, 'Bundle should contain at least 2 pieces');

console.log('Testing Sizing Intent...');
const sizeResp = window.NexConciergeEngine.processMessage('What size should I choose?');
assert.strictEqual(sizeResp.type, 'sizing_advisor', 'Response should be sizing_advisor');
assert.ok(sizeResp.widgetPayload, 'Should return widgetPayload for sizing');

console.log('Testing Order Tracking Intent...');
const trackResp = window.NexConciergeEngine.processMessage('Track my order NX-8921-X');
assert.strictEqual(trackResp.type, 'order_tracking', 'Response should be order_tracking');

console.log('All ConciergeEngine unit tests passed!');
