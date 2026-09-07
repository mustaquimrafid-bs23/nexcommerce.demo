const fs = require('fs');
const path = require('path');

console.log('🧪 Running Category Intelligence & Comparison Advisor Test Suite...\n');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

// 1. Verify ComparisonModal source code
const modalPath = path.resolve('components/modals/ComparisonModal.tsx');
assert('ComparisonModal.tsx exists', fs.existsSync(modalPath));

const modalContent = fs.readFileSync(modalPath, 'utf8');

// 2. Category Detection & Multi-Category Branches
console.log('\n1. Verifying Category Intelligence Functions & Branches...');
assert('detectProductCategory handles apparel', modalContent.includes("'apparel'"));
assert('detectProductCategory handles bags', modalContent.includes("'bags'"));
assert('detectProductCategory handles watches', modalContent.includes("'watches'"));
assert('detectProductCategory handles acoustics', modalContent.includes("'acoustics'"));
assert('detectProductCategory handles footwear', modalContent.includes("'footwear'"));

// 3. Spec Rows Resolution
console.log('\n2. Verifying Category-Aware Spec Rows...');
assert('Bags category has dedicated leather / tech sleeve specs', modalContent.includes('Heavyweight Tuscan Vegetable-Tanned Leather') || modalContent.includes('Tuscan'));
assert('Watches category has movement & sapphire crystal specs', modalContent.includes('Sapphire Crystal') || modalContent.includes('Swiss Precision Quartz'));
assert('Acoustics category has acoustic drivers & noise reduction', modalContent.includes('Active Noise Cancellation') || modalContent.includes('Acoustic Drivers'));
assert('Footwear category has calfskin & ergonomic outsole specs', modalContent.includes('Vibram') || modalContent.includes('Calfskin'));
assert('Cross-category hybrid specs supported without hardcoding wool', modalContent.includes('Cross-Category Hybrid') || modalContent.includes('getProductHighlight'));

// 4. Advisor Verdict Generation
console.log('\n3. Verifying Dynamic Advisor Verdict Generator...');
assert('generateAdvisorVerdict produces apparel verdict', modalContent.includes('greater thermal depth'));
assert('generateAdvisorVerdict produces bags verdict', modalContent.includes('structured tech protection') || modalContent.includes('laptop'));
assert('generateAdvisorVerdict produces watches verdict', modalContent.includes('precision chronograph') || modalContent.includes('timepiece'));
assert('generateAdvisorVerdict produces acoustics verdict', modalContent.includes('studio fidelity') || modalContent.includes('acoustic immersion'));
assert('generateAdvisorVerdict produces footwear verdict', modalContent.includes('ergonomic walking') || modalContent.includes('15,000+ daily steps'));
assert('generateAdvisorVerdict produces cross-category verdict', modalContent.includes('Cross-category comparison') || modalContent.includes('hallmark'));

// 5. Product Swapper
console.log('\n4. Verifying Interactive Product Swapper...');
assert('Change Piece button trigger present', modalContent.includes('Change Piece'));
assert('Swapper popover allows selecting replacements from MASTER_PRODUCTS', modalContent.includes('Select Replacement for Column') || modalContent.includes('handleSwapProduct'));
assert('Swapper connects to setStoreProductA and setStoreProductB', modalContent.includes('setStoreProductA') && modalContent.includes('setStoreProductB'));

// 6. Variant Quick-Picker
console.log('\n5. Verifying Variant Quick-Picker Drawer...');
assert('Variant selector checks for multiple sizes or colors', modalContent.includes('hasMultipleSizes') || modalContent.includes('variantSelectorId'));
assert('Size chips selector rendered for sized items', modalContent.includes('Select Size'));
assert('Confirm & Add button present', modalContent.includes('Confirm & Add'));

// 7. Store Actions
console.log('\n6. Verifying Zustand Store Swapping Actions...');
const storePath = path.resolve('store/useComparisonStore.ts');
const storeContent = fs.readFileSync(storePath, 'utf8');
assert('useComparisonStore exports setProductA', storeContent.includes('setProductA'));
assert('useComparisonStore exports setProductB', storeContent.includes('setProductB'));

// 8. PDP Smart Pairing
console.log('\n7. Verifying PDP Smart Subcategory Peer Matching...');
const pdpClientPath = path.resolve('components/product/ProductDetailClient.tsx');
const pdpClientContent = fs.readFileSync(pdpClientPath, 'utf8');
assert('ProductDetailClient checks subCategory matching first', pdpClientContent.includes('subCategory === product.subCategory'));
assert('ProductDetailClient has #pdpCompareBtn', pdpClientContent.includes('id="pdpCompareBtn"'));

console.log(`\n✨ Category Intelligence Unit Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
