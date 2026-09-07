const fs = require('fs');
const path = require('path');

console.log('🧪 Running Feature 08: Target-Budget Cart Builder Parity Test Suite...\n');

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

// 1. Files existence & component architecture
console.log('1. Verifying Component Architecture & Files...');
const modalPath = path.resolve('components/cart/BudgetCartModal.tsx');
const storePath = path.resolve('store/useBudgetCartStore.ts');
const layoutPath = path.resolve('app/layout.tsx');
const guidePath = path.resolve('app/guide/page.tsx');
const cartPath = path.resolve('app/cart/page.tsx');
const tourPath = path.resolve('components/tour/FeatureTourModal.tsx');
const conciergePath = path.resolve('store/useConciergeStore.ts');

assert('components/cart/BudgetCartModal.tsx exists', fs.existsSync(modalPath));
assert('store/useBudgetCartStore.ts exists', fs.existsSync(storePath));
assert('app/layout.tsx exists', fs.existsSync(layoutPath));
assert('app/guide/page.tsx exists', fs.existsSync(guidePath));
assert('app/cart/page.tsx exists', fs.existsSync(cartPath));
assert('components/tour/FeatureTourModal.tsx exists', fs.existsSync(tourPath));
assert('store/useConciergeStore.ts exists', fs.existsSync(conciergePath));

const modalContent = fs.readFileSync(modalPath, 'utf8');
const storeContent = fs.readFileSync(storePath, 'utf8');
const layoutContent = fs.readFileSync(layoutPath, 'utf8');
const guideContent = fs.readFileSync(guidePath, 'utf8');
const cartContent = fs.readFileSync(cartPath, 'utf8');
const tourContent = fs.readFileSync(tourPath, 'utf8');
const conciergeContent = fs.readFileSync(conciergePath, 'utf8');

// 2. Brand guidelines and background palette
console.log('\n2. Verifying Brand Guidelines & Background Palette...');
assert('Modal container uses deep navy brand gradient (#032552, #020D20)', modalContent.includes('#032552') && (modalContent.includes('#020D20') || modalContent.includes('#010915')));
assert('Modal contains cyan brand eyebrow (#3DE0FF)', modalContent.includes('#3DE0FF'));
assert('Modal contains emerald accent colors (#00F5A0 or #10B981)', modalContent.includes('#00F5A0') || modalContent.includes('#10B981'));
assert('Backdrop uses blur and dark opacity (bg-black/85 backdrop-blur-md)', modalContent.includes('backdrop-blur-md'));

// 3. Canonical DOM Elements & IDs
console.log('\n3. Verifying Canonical DOM Element IDs...');
assert('Backdrop ID: #budgetModalBackdrop', modalContent.includes('id="budgetModalBackdrop"'));
assert('Close button ID: #budgetModalCloseBtn', modalContent.includes('id="budgetModalCloseBtn"'));
assert('Modal body ID: #budgetModalBody', modalContent.includes('id="budgetModalBody"'));
assert('Footer summary ID: #budgetFooterSummary', modalContent.includes('id="budgetFooterSummary"'));
assert('Batch add button ID: #budgetBatchAddBtn', modalContent.includes('id="budgetBatchAddBtn"'));
assert('Cart toolbar trigger: #cartOpenBudgetBtn & data-action="open-budget-cart"', cartContent.includes('id="cartOpenBudgetBtn"') && cartContent.includes('data-action="open-budget-cart"'));
assert('Empty cart trigger: #emptyBudgetBtn & data-action="open-budget-cart"', cartContent.includes('id="emptyBudgetBtn"') && cartContent.includes('data-action="open-budget-cart"'));

// 4. Content & Copy Fidelity (100% match with user screenshot and prototype)
console.log('\n4. Verifying Copy & Content Fidelity...');
assert('Modal Eyebrow contains: SMART · BUDGET BUILDER', modalContent.includes('SMART · BUDGET BUILDER'));
assert('Modal Headline: Build Your Perfect Basket', modalContent.includes('Build Your Perfect Basket'));
assert('Guide Card Title: Target-Budget Cart Builder', guideContent.includes("title: 'Target-Budget Cart Builder'"));
assert('Guide Card What it does matches screenshot', guideContent.includes("whatItDoes: 'Set a spending limit and it builds a matching wardrobe for you.'"));
assert('Guide Card Real Example matches screenshot', guideContent.includes("example: 'Set $500 budget → gets 3 matching pieces for $454.'"));
assert('Guide Card CTA matches screenshot: Build Under Budget', guideContent.includes("actionText: 'Build Under Budget'"));
assert('Footer CTA Button Text: Add Entire Basket to Bag', modalContent.includes('Add Entire Basket to Bag'));

// 5. Presets, Telemetry, and Alternative Swapping
console.log('\n5. Verifying Presets, Telemetry & Slot Alternatives...');
assert('Preset 1: € 300 Essentials', modalContent.includes('€ 300 Essentials'));
assert('Preset 2: € 500 Autumn Wardrobe', modalContent.includes('€ 500 Autumn Wardrobe'));
assert('Preset 3: € 750 Luxury Atelier Trio', modalContent.includes('€ 750 Luxury Atelier Trio'));
assert('Telemetry displays Calculated Basket Total & Headroom Remaining', modalContent.includes('CALCULATED BASKET TOTAL') && modalContent.includes('Headroom Remaining'));
assert('Telemetry displays budget efficiency calculation', modalContent.includes('budget efficiency'));
assert('Slot structure contains CORE STATEMENT PIECE & LAYERING / FOOTWEAR PIECE', modalContent.includes('CORE STATEMENT PIECE') && modalContent.includes('LAYERING / FOOTWEAR PIECE'));
assert('Slot alternative swapping chips exist (OR:)', modalContent.includes('OR:') && modalContent.includes('handleSwapItem'));
assert('Batch add invokes addItem into cart store', modalContent.includes('addItem') && modalContent.includes('useCartStore'));

// 6. Multi-Surface Global Triggering
console.log('\n6. Verifying Multi-Surface Global Triggers...');
assert('useBudgetCartStore exports openBudget & closeBudget', storeContent.includes('openBudget') && storeContent.includes('closeBudget'));
assert('RootLayout mounts BudgetCartModal globally', layoutContent.includes('<BudgetCartModal />') || layoutContent.includes('<BudgetCartModal'));
assert('Guide page triggers budget modal on Feature 08 action', guideContent.includes('openBudget'));
assert('FeatureTourModal triggers budget modal on Feature 08', tourContent.includes('openBudget') && tourContent.includes('08'));
assert('Cart page handles ?open=budget query parameter on mount', cartContent.includes("open === 'budget'"));
assert('Concierge store detects budget intent and offers budget builder', conciergeContent.includes('budget') && conciergeContent.includes('OPEN BUDGET BUILDER'));

console.log(`\n✨ Feature 08 Parity Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
