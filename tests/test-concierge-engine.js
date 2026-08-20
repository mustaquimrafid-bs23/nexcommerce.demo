// tests/test-concierge-engine.js
const assert = require('assert');
const fs = require('fs');

// Mock browser environment
global.window = {
  location: { search: '?id=p1', pathname: '/product.html' },
  NexAI: {
    catalogArray: [
      { id: 'p1', title: 'Architectural Cashmere Sweater', category: 'Apparel', numericPrice: 185, price: '€ 185.00', img: 'assets/images/products/hero_sweater.png' },
      { id: 'p2', title: 'Structured Wool Blazer', category: 'Apparel', numericPrice: 245, price: '€ 245.00', img: 'assets/images/products/plp_blazer.png' },
      { id: 'p3', title: 'Fine-Knit Cashmere Crew', category: 'Apparel', numericPrice: 160, price: '€ 160.00', img: 'assets/images/products/plp_crewneck.png' },
      { id: 'p6', title: 'Minimalist Leather Runner', category: 'Footwear', numericPrice: 198, price: '€ 198.00', img: 'assets/images/products/leather_sneaker.png' },
      { id: 'p7', title: 'Leather Weekender Tote', category: 'Accessories', numericPrice: 285, price: '€ 285.00', img: 'assets/images/products/leather_tote.png' },
      { id: 'p8', title: 'Chronograph Minimalist Watch', category: 'Accessories', numericPrice: 285, price: '€ 285.00', img: 'assets/images/products/titanium_watch.png' }
    ],
    catalog: {}
  }
};
global.window.NexAI.catalogArray.forEach(p => global.window.NexAI.catalog[p.id] = p);
global.sessionStorage = { getItem: () => null, setItem: () => {} };

// Load concierge-engine
const engineCode = fs.readFileSync('js/concierge-engine.js', 'utf8');
eval(engineCode);

console.log('1. Testing Visual-First initialize() on homepage...');
window.location.pathname = '/index.html';
window.location.search = '';
const initHome = window.NexConciergeEngine.initialize();
assert.strictEqual(initHome.type, 'product_grid', 'Homepage greeting should lead with product_grid');
assert.ok(initHome.products && initHome.products.length >= 3, 'Homepage should return at least 3 visual products');
assert.ok(initHome.text.length < 80, 'Greeting text must be a concise single line');

console.log('2. Testing initialize() on PDP...');
window.location.pathname = '/product.html';
window.location.search = '?id=p1';
const initPDP = window.NexConciergeEngine.initialize({ url: 'product.html?id=p1', productId: 'p1' });
assert.strictEqual(initPDP.type, 'pdp_context', 'PDP greeting should be pdp_context');
assert.ok(initPDP.text.includes('Architectural Cashmere Sweater'), 'Greeting should reference PDP product');
assert.ok(initPDP.products && initPDP.products.length === 1, 'Should include active product');

console.log('3. Testing Outfit & Look Bundle Queries...');
const outfitQueries = [
  'Complete an outfit',
  'Complete an office outfit',
  'Complete a look for the office',
  'Wedding guest outfit',
  'Evening look',
  'Capsule wardrobe'
];
for (const q of outfitQueries) {
  const resp = window.NexConciergeEngine.processMessage(q);
  assert.strictEqual(resp.type, 'bundle_look', `Query "${q}" should return bundle_look, got ${resp.type}`);
  assert.ok(resp.products && resp.products.length >= 2, `Query "${q}" bundle should have at least 2 items`);
}

console.log('4. Testing Sizing Queries & Precision...');
const sizeQueries = [
  'What size should I choose?',
  'Does this sweater fit true to size?',
  'Find my size in shoes',
  'How does it fit?',
  'Size guide'
];
for (const q of sizeQueries) {
  const resp = window.NexConciergeEngine.processMessage(q);
  assert.strictEqual(resp.type, 'sizing_advisor', `Query "${q}" should return sizing_advisor, got ${resp.type}`);
  assert.ok(resp.widgetPayload, 'Should provide widget payload for sizing');
}

console.log('5. Testing Order Tracking Queries...');
const trackQueries = [
  'Track order NX-8921-X',
  'Where is my order?',
  'Where is my package?',
  'NX-1234-AB'
];
for (const q of trackQueries) {
  const resp = window.NexConciergeEngine.processMessage(q);
  assert.strictEqual(resp.type, 'order_tracking', `Query "${q}" should return order_tracking, got ${resp.type}`);
  assert.ok(resp.widgetPayload && resp.widgetPayload.steps, 'Should contain order tracking steps');
}

console.log('6. Testing Delivery, Returns & Material Queries...');
const delivResp = window.NexConciergeEngine.processMessage('How fast is express delivery?');
assert.strictEqual(delivResp.type, 'delivery');

const returnResp = window.NexConciergeEngine.processMessage('What is your return policy?');
assert.strictEqual(returnResp.type, 'returns');

const matResp = window.NexConciergeEngine.processMessage('How do I wash cashmere?');
assert.strictEqual(matResp.type, 'materials');

console.log('7. Testing Category Keyword Searches (Word Boundaries)...');
const jacketResp = window.NexConciergeEngine.processMessage('Show me jackets');
assert.strictEqual(jacketResp.type, 'product_grid');
assert.ok(jacketResp.products.some(p => /blazer|jacket|coat/i.test(p.title)));

const shoeResp = window.NexConciergeEngine.processMessage('Looking for shoes');
assert.strictEqual(shoeResp.type, 'product_grid');
assert.ok(shoeResp.products.some(p => p.category === 'Footwear'));

console.log('8. Testing Size Calculation Logic...');
const calcTop = window.NexConciergeEngine.calculateSize('Tops & Sweaters', 'M (40")', 'True to size');
assert.strictEqual(calcTop.recommendedSize, 'EU 48 / Medium');
assert.ok(calcTop.confidence >= 90);

const calcFoot = window.NexConciergeEngine.calculateSize('Shoes & Sneakers', 'EU 43', 'True to size');
assert.strictEqual(calcFoot.recommendedSize, 'EU 43');

console.log('✨ All 25+ comprehensive regression tests PASSED with 100% precision!');
