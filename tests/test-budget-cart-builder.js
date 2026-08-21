const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock DOM/window environment
global.window = {};
require('../js/budget-cart-builder.js');

const engine = global.window.NexBudgetCartEngine;
assert(engine, 'NexBudgetCartEngine should be attached to window');

const MOCK_CATALOG = [
  { id: 'p1', name: 'Pure Cashmere Sweater', price: 185, category: 'Apparel', rating: 4.9 },
  { id: 'p2', name: 'Fine-Knit Cashmere Crew', price: 160, category: 'Apparel', rating: 4.8 },
  { id: 'p3', name: 'Structured Wool Blazer', price: 245, category: 'Apparel', rating: 4.9 },
  { id: 'p4', name: 'Studio Acoustics Headphone GT', price: 320, category: 'Acoustics', rating: 4.95 },
  { id: 'p6', name: 'Minimalist Leather Runner', price: 198, category: 'Footwear', rating: 4.85 },
  { id: 'p8', name: 'Chronograph Minimalist Watch', price: 285, category: 'Accessories', rating: 4.9 }
];

console.log('🧪 Running NexBudgetCartEngine Unit Tests...');

// Test 1: Intent parsing from natural language queries
const intent1 = engine.parseBudgetIntent('Make my autumn wardrobe cart under €500');
assert(intent1.isBudgetIntent, 'Should detect budget intent');
assert.strictEqual(intent1.targetBudget, 500, 'Should extract 500 budget target');
assert.strictEqual(intent1.occasionTheme, 'autumn', 'Should extract autumn occasion theme');

const intent2 = engine.parseBudgetIntent('Build office cart for 450 euro');
assert(intent2.isBudgetIntent, 'Should detect 450 euro intent');
assert.strictEqual(intent2.targetBudget, 450);

// Test 2: Basket constraint satisfaction (Total <= Budget)
const basket = engine.buildBudgetCart(500, 'autumn', MOCK_CATALOG);
assert(Array.isArray(basket.items), 'Basket items should be an array');
assert(basket.items.length >= 2, 'Should include at least 2 synergistic items');
assert(basket.totalPrice <= 500, `Total price €${basket.totalPrice} must be <= €500`);
assert(basket.utilizationPercent >= 75, 'Should utilize at least 75% of budget');
assert.strictEqual(basket.totalPrice + basket.headroom, 500, 'Total + headroom must equal target budget');

// Test 3: Multi-category distribution
const categories = basket.items.map(i => i.category);
const uniqueCategories = new Set(categories);
assert(uniqueCategories.size >= 2, 'Should span at least 2 distinct categories for a complete look');

// Test 4: Swap alternatives per slot
assert(Array.isArray(basket.slots), 'Should provide structured slot definitions');
basket.slots.forEach(slot => {
  assert(slot.selectedItem, 'Slot must have a selected item');
  assert(Array.isArray(slot.alternatives), 'Slot must have alternatives array');
});

// Test 5: Strict budget bound test (€300 budget)
const tightBasket = engine.buildBudgetCart(300, 'essentials', MOCK_CATALOG);
assert(tightBasket.totalPrice <= 300, `Tight basket €${tightBasket.totalPrice} must be <= €300`);
assert(tightBasket.items.length >= 1, 'Should compose valid basket even on lower budget');

console.log('✅ All NexBudgetCartEngine unit tests passed successfully!');
