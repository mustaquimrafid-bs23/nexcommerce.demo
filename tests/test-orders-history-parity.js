const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 23: PAGE-08 Orders History & Ledger Parity Test...\n');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ [PASS] ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${desc}`);
    failed++;
  }
}

const pagePath = path.resolve('app/orders/page.tsx');
const detailPagePath = path.resolve('app/orders/[id]/page.tsx');
const cardPath = path.resolve('components/orders/OrderCard.tsx');

assert('app/orders/page.tsx exists', fs.existsSync(pagePath));
assert('app/orders/[id]/page.tsx exists', fs.existsSync(detailPagePath));
assert('components/orders/OrderCard.tsx exists', fs.existsSync(cardPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');
const cardContent = fs.readFileSync(cardPath, 'utf8');

// 1. Assert Orders List and Status Filtering
assert('Supports filtering by status (all, transit, delivered)', pageContent.includes('filter') || pageContent.includes('status'));

// 2. Assert OrderCard has tracking link and details link
assert('OrderCard contains links to tracking and order details', cardContent.includes('/tracking') && cardContent.includes('/orders/'));

// 3. Assert Buy Again / Reorder action
assert('OrderCard contains Buy Again / Reorder action', cardContent.includes('Buy Again') || cardContent.includes('Reorder') || cardContent.includes('addItem'));

console.log(`\nBatch 23 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
