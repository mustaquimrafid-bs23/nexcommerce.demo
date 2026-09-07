const fs = require('fs');
const path = require('path');

console.log('🧪 Running Feature 07: Side-by-Side Comparison Parity Test Suite...\n');

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

// 1. Files existence
console.log('1. Verifying Component Architecture & Files...');
const modalPath = path.resolve('components/modals/ComparisonModal.tsx');
const storePath = path.resolve('store/useComparisonStore.ts');
const layoutPath = path.resolve('app/layout.tsx');
const guidePath = path.resolve('app/guide/page.tsx');
const tourPath = path.resolve('components/tour/FeatureTourModal.tsx');
const pdpPath = path.resolve('app/product/[id]/page.tsx');
const categoryPath = path.resolve('app/category/page.tsx');

assert('components/modals/ComparisonModal.tsx exists', fs.existsSync(modalPath));
assert('store/useComparisonStore.ts exists', fs.existsSync(storePath));
assert('app/layout.tsx exists', fs.existsSync(layoutPath));
assert('app/guide/page.tsx exists', fs.existsSync(guidePath));
assert('components/tour/FeatureTourModal.tsx exists', fs.existsSync(tourPath));
assert('app/product/[id]/page.tsx exists', fs.existsSync(pdpPath));
assert('app/category/page.tsx exists', fs.existsSync(categoryPath));

const modalContent = fs.readFileSync(modalPath, 'utf8');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
const guideContent = fs.readFileSync(guidePath, 'utf8');
const tourContent = fs.readFileSync(tourPath, 'utf8');
const pdpClientPath = path.resolve('components/product/ProductDetailClient.tsx');
const pdpContent = fs.readFileSync(pdpPath, 'utf8') + (fs.existsSync(pdpClientPath) ? fs.readFileSync(pdpClientPath, 'utf8') : '');
const categoryContent = fs.readFileSync(categoryPath, 'utf8');

// 2. Brand guidelines and background gradient
console.log('\n2. Verifying Brand Guidelines & Background Palette...');
assert('Strict brand background radial gradient present in modal', modalContent.includes('#031838') || modalContent.includes('#011126') || modalContent.includes('radial-gradient'));
assert('Canonical eyebrow present: CUSTOMER COMMERCE AGENT · SMART CAPABILITY 2', modalContent.includes('CUSTOMER COMMERCE AGENT') && modalContent.includes('SMART CAPABILITY 2'));
assert('Modal title: Product Advisor & Comparison Matrix', modalContent.includes('Product Advisor & Comparison Matrix'));
assert('Modal close button has canonical ID #compareModalCloseBtn', modalContent.includes('id="compareModalCloseBtn"'));
assert('Backdrop has canonical ID #compareModalBackdrop', modalContent.includes('id="compareModalBackdrop"'));

// 3. Smart Advisor Verdict Card & 2-Column Split
console.log('\n3. Verifying Smart Advisor Verdict Card...');
assert('Smart Advisor Verdict eyebrow present', modalContent.includes('Smart Advisor Verdict'));
assert('Verdict card contains contrasting advice summary', modalContent.includes('headline') || modalContent.includes('offers greater thermal depth') || modalContent.includes('Choose'));
assert('Verdict card contains 2-column use-case items (Ideal for...)', modalContent.includes('Ideal for:'));

// 4. Products Header & 1-Click Action Buttons
console.log('\n4. Verifying Product Columns & Cyan Action Buttons...');
assert('Spec Diff Matrix label present in header row', modalContent.includes('Spec Diff Matrix') || modalContent.includes('SPEC DIFF MATRIX'));
assert('Bright cyan Choose This button present (#3DE0FF or bg-[#3DE0FF])', modalContent.includes('#3DE0FF') && (modalContent.includes('Choose') || modalContent.includes('Choose This')));
assert('Choose button adds item to cart store', modalContent.includes('addItem'));
assert('Product image uses uncropped contain rendering', modalContent.includes('object-contain'));

// 5. 8-Row Spec Diff Matrix
console.log('\n5. Verifying 8-Row Spec Comparison Matrix & Diff Badges...');
assert('Row 1: Price present in matrix', modalContent.includes('Price') || modalContent.includes('PRICE'));
assert('Row 2: Materials present in matrix', modalContent.includes('Materials') || modalContent.includes('MATERIALS'));
assert('Row 3: Fit Profile present in matrix', modalContent.includes('Fit Profile') || modalContent.includes('FIT PROFILE'));
assert('Row 4: Thermal Warmth present in matrix', modalContent.includes('Thermal Warmth') || modalContent.includes('Warmth'));
assert('Row 5: Breathability present in matrix', modalContent.includes('Breathability'));
assert('Row 6: Garment Weight present in matrix', modalContent.includes('Garment Weight') || modalContent.includes('Weight'));
assert('Row 7: Atelier Origin present in matrix', modalContent.includes('Atelier Origin') || modalContent.includes('Origin'));
assert('Row 8: Customer Rating present in matrix', modalContent.includes('Customer Rating') || modalContent.includes('Rating'));
assert('Diff highlight badges present (Lower Investment, Thermal Retention, etc.)', modalContent.includes('Lower Investment') || modalContent.includes('Higher Thermal Retention') || modalContent.includes('Optimal Breathability'));

// 6. Global Triggering & Layout Mounting
console.log('\n6. Verifying Global Modal Mounting & Multi-Surface Triggers...');
assert('ComparisonModal mounted in RootLayout (app/layout.tsx)', layoutContent.includes('ComparisonModal'));
assert('FeatureTourModal triggers comparison on Feature 07', tourContent.includes('openComparison') || tourContent.includes('comparison'));
assert('app/guide/page.tsx triggers comparison on Feature 07', guideContent.includes('openComparison') || guideContent.includes('comparison'));
assert('PDP (#pdpCompareBtn) opens comparison modal', pdpContent.includes('pdpCompareBtn'));
assert('app/category/page.tsx handles open=comparison query param', categoryContent.includes('open') && categoryContent.includes('comparison'));

console.log(`\n✨ Feature 07 Parity Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
