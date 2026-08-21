const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock DOM/window environment
global.window = {};
require('../js/comparison-engine.js');

const engine = global.window.NexComparisonEngine;
assert(engine, 'NexComparisonEngine should be attached to window');

const MOCK_CATALOG = [
  {
    id: 'p1',
    name: 'Pure Cashmere Sweater',
    brand: 'Arc',
    price: 185,
    category: 'Apparel',
    image: 'assets/images/products/hero_sweater.png',
    materials: '100% Grade-A Mongolian Cashmere (2-ply yarn)',
    origin: 'Hand-finished in Biella, Italy',
    care: 'Hand wash cold with wool wash or dry clean',
    rating: 4.9,
    reviewsCount: 128,
    specs: {
      warmthScore: 9,
      breathabilityScore: 8,
      weightGrams: 320,
      fitType: 'Relaxed Architectural',
      seasonality: 'Late Autumn / Winter'
    }
  },
  {
    id: 'p2',
    name: 'Fine-Knit Cashmere Crew',
    brand: 'Arc',
    price: 160,
    category: 'Apparel',
    image: 'assets/images/products/plp_crewneck.png',
    materials: '100% Fine Gauge Cashmere (70g/m²)',
    origin: 'Crafted in Florence, Italy',
    care: 'Dry clean or gentle cold wash',
    rating: 4.8,
    reviewsCount: 94,
    specs: {
      warmthScore: 7,
      breathabilityScore: 9,
      weightGrams: 240,
      fitType: 'Tailored Slim',
      seasonality: 'All Season / Layering'
    }
  },
  {
    id: 'p3',
    name: 'Structured Wool Blazer',
    brand: 'Arc',
    price: 245,
    category: 'Apparel',
    image: 'assets/images/products/plp_blazer.png',
    materials: '100% Virgin Wool',
    origin: 'Milan, Italy',
    care: 'Specialist dry clean only',
    rating: 4.9,
    reviewsCount: 82,
    specs: {
      warmthScore: 8,
      breathabilityScore: 7,
      weightGrams: 580,
      fitType: 'Structured Modern',
      seasonality: 'Autumn / Winter / Evening'
    }
  }
];

console.log('🧪 Running NexComparisonEngine Unit Tests...');

// Test 1: Intent parsing from natural language
const query = 'Which is better between cashmere sweater and fine-knit crew?';
const intent = engine.parseComparisonIntent(query, MOCK_CATALOG);
assert(intent.isComparison, 'Should detect comparison intent');
assert.strictEqual(intent.productIds.length, 2, 'Should identify 2 target products');
assert(intent.productIds.includes('p1') && intent.productIds.includes('p2'), 'Should identify p1 and p2');

// Test 2: Multi-product spec comparison structure
const comparison = engine.compareProducts(['p1', 'p2'], MOCK_CATALOG, { priority: 'layering' });
assert.strictEqual(comparison.products.length, 2, 'Should contain 2 compared products');
assert(Array.isArray(comparison.specRows), 'Should contain specRows array');
assert(comparison.specRows.length >= 6, 'Should have at least 6 spec comparison rows');

// Test 3: AI Verdict generation
assert(comparison.verdict, 'Should generate an advisory verdict');
assert(comparison.verdict.headline, 'Verdict must have a headline');
assert(comparison.verdict.bestForA, 'Must state primary use case for Product A');
assert(comparison.verdict.bestForB, 'Must state primary use case for Product B');

// Test 4: Category alternatives helper
const alts = engine.getCategoryAlternatives('p1', MOCK_CATALOG);
assert.strictEqual(alts.length, 2, 'Should return 2 apparel alternatives for p1');
assert.strictEqual(alts[0].id, 'p2');

// Test 5: Fallback comparison when only 1 product specified
const singleCompare = engine.parseComparisonIntent('Compare cashmere sweater', MOCK_CATALOG);
assert(singleCompare.isComparison, 'Should recognize single product comparison request');
assert.strictEqual(singleCompare.productIds.length, 2, 'Should auto-suggest the closest category alternative');

console.log('✅ All NexComparisonEngine unit tests passed successfully!');
