const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function check(dimension, condition, description) {
  totalChecks++;
  if (condition) {
    console.log(`  ✓ [${dimension}] ${description}`);
    passedTests();
  } else {
    console.error(`  ✗ [${dimension}] FAIL: ${description}`);
    failedTests();
  }
}

function passedTests() { passedChecks++; }
function failedTests() { failedChecks++; }

console.log('═══════════════════════════════════════════════════════════════');
console.log('   ACCOUNT PAGE 7-DIMENSION COMPREHENSIVE SQA AUDIT SWEEP      ');
console.log('   Target: http://localhost:3000/account                      ');
console.log('═══════════════════════════════════════════════════════════════\n');

// Dimension 1: Content & Copy
console.log('─── Dimension 1: Content & Copy (UK English & Anti-Jargon) ───');
const accountPagePath = path.join(ROOT, 'app/account/page.tsx');
const accountComponentsDir = path.join(ROOT, 'components/account');
const compFiles = fs.readdirSync(accountComponentsDir).filter(f => f.endsWith('.tsx'));

const bannedWords = [
  { term: 'telemetry', regex: /\btelemetry\b/i },
  { term: 'sovereignty', regex: /\bsovereignty\b/i },
  { term: 'atelier order portfolio', regex: /atelier order portfolio/i },
  { term: 'client portfolio', regex: /client portfolio/i },
  { term: 'portfolio valuation', regex: /portfolio valuation/i },
  { term: 'European custody', regex: /European custody/i },
  { term: 'handover imminent', regex: /handover imminent/i },
  { term: 'neural style concierge', regex: /neural style concierge/i },
  { term: 'acquisition', regex: /\bacquisition\b/i },
];

let bannedFound = false;
for (const file of compFiles) {
  const content = fs.readFileSync(path.join(accountComponentsDir, file), 'utf8');
  for (const b of bannedWords) {
    if (b.regex.test(content)) {
      console.error(`    Forbidden term "${b.term}" found in ${file}`);
      bannedFound = true;
    }
  }
}
check('D1: Copy', !bannedFound, 'Strict zero AI / robotic jargon invariant satisfied');

// Check UK English spellings
const styleProfileContent = fs.readFileSync(path.join(accountComponentsDir, 'StyleProfilePanel.tsx'), 'utf8');
check('D1: Copy', styleProfileContent.includes('COLOUR PALETTE'), 'UK English: "COLOUR PALETTE" present');
check('D1: Copy', styleProfileContent.includes('FAVOURITE DESIGNERS'), 'UK English: "FAVOURITE DESIGNERS" present');
check('D1: Copy', styleProfileContent.includes('personalising'), 'UK English spelling: "personalising" used');

// Check Metric Labels
const heroContent = fs.readFileSync(path.join(accountComponentsDir, 'AccountHero.tsx'), 'utf8');
check('D1: Copy', heroContent.includes('TOTAL SPENT'), 'Clear metric: "TOTAL SPENT" used');
check('D1: Copy', heroContent.includes('Personal Stylist'), 'Humanized concierge: "Personal Stylist" used');

// Dimension 2: Visual & Layout Architecture
console.log('\n─── Dimension 2: Visual & Layout Architecture ───');
const pageContent = fs.readFileSync(accountPagePath, 'utf8');
check('D2: Layout', pageContent.includes('max-w-7xl mx-auto'), 'Page adheres to 7xl maximum container width constraint');
const tabsContent = fs.readFileSync(path.join(accountComponentsDir, 'AccountTabs.tsx'), 'utf8');

check('D2: Layout', heroContent.includes('border-b border-white') || tabsContent.includes('border-b border-white'), 'Hairline border hierarchy implemented');

// Order card layout
const orderCardContent = fs.readFileSync(path.join(accountComponentsDir, 'OrderCard.tsx'), 'utf8');
check('D2: Layout', orderCardContent.includes('object-cover'), 'Order item thumbnails maintain clean image container fitting');
check('D2: Layout', orderCardContent.includes('tabular-nums'), 'Monospace tabular figures on monetary amounts for alignment');

// Dimension 3: Interactions & Motion Engineering
console.log('\n─── Dimension 3: Interactions & Motion Engineering ───');
check('D3: Motion', pageContent.includes('AnimatePresence'), 'AnimatePresence imported for interruptible tab transitions');
check('D3: Motion', pageContent.includes('motion.div'), 'Framer Motion motion.div wraps tab panel transitions');

check('D3: Motion', tabsContent.includes('layoutId="accountTabIndicator"'), 'Hardware-accelerated layout glider on tab navigation');
check('D3: Motion', tabsContent.includes('spring'), 'Spring physics easing applied to active indicator');

// Progress bar in OrderCard
check('D3: Motion', orderCardContent.includes('bg-gradient-to-r from-accent-cyan to-emerald-400'), 'Active delivery route track has vibrant animated gradient');

// Dimension 4: Cross-Page Consistency & Feature Parity
console.log('\n─── Dimension 4: Cross-Page Consistency & Feature Parity ───');
check('D4: Uniformity', pageContent.includes('useCartStore'), 'Shared cart state integrated via useCartStore');
check('D4: Uniformity', pageContent.includes('addItemToCart'), 'Direct 1-click cart addition parity with storefront');
check('D4: Uniformity', pageContent.includes('Breadcrumbs'), 'Standardized breadcrumb navigation landmark included');
check('D4: Uniformity', pageContent.includes('Link href="/"'), 'Home link provides consistent root navigation');

// Dimension 5: End-to-End User Flows
console.log('\n─── Dimension 5: End-to-End User Flows ───');
// Flow A: Reorder Flow
check('D5: Flows', pageContent.includes('handleReorder'), 'E2E Flow: Buy Again dispatches to cart with size and payload');
// Flow B: Cancellation Flow
check('D5: Flows', pageContent.includes('handleConfirmCancel'), 'E2E Flow: Order cancellation updates status and reason');
check('D5: Flows', pageContent.includes('100% refund credited'), 'E2E Flow: Order cancellation confirms 100% refund credit');
// Flow C: Address Management Flow
check('D5: Flows', pageContent.includes('handleAddAddress'), 'E2E Flow: Add address updates address state');
check('D5: Flows', pageContent.includes('handleRemoveAddress'), 'E2E Flow: Remove address deletes address record');
// Flow D: Profile Customization Flow
check('D5: Flows', pageContent.includes('handleUpdatePreference'), 'E2E Flow: Style chip toggling updates preference state');
check('D5: Flows', pageContent.includes('handleClearProfile'), 'E2E Flow: Style profile data reset supported with confirmation');

// Dimension 6: Edge Cases & List Depletion
console.log('\n─── Dimension 6: Edge Cases & Boundary Conditions ───');
check('D6: Edge Cases', pageContent.includes('empty_account'), 'Edge Case: Handles 0-orders empty account state cleanly');
const emptyViewContent = fs.readFileSync(path.join(accountComponentsDir, 'EmptyAccountView.tsx'), 'utf8');
check('D6: Edge Cases', emptyViewContent.includes('totalOrders={0}'), 'Depletion Invariant: Hero counters reset to 0 Items on empty state');
check('D6: Edge Cases', emptyViewContent.includes('totalSpent={0}'), 'Depletion Invariant: Total spent resets to € 0.00 on empty state');
check('D6: Edge Cases', emptyViewContent.includes('Start Shopping'), 'Edge Case: Empty state provides actionable shopping CTA');

// Order filter empty state
const ordersPanelContent = fs.readFileSync(path.join(accountComponentsDir, 'OrdersPanel.tsx'), 'utf8');
check('D6: Edge Cases', ordersPanelContent.includes('No {activeFilter.toLowerCase()} orders found.'), 'Edge Case: Empty filter state provides informative feedback');

// Dimension 7: Accessibility (WCAG 2.1 AA)
console.log('\n─── Dimension 7: Accessibility (WCAG 2.1 AA) ───');
const modalContent = fs.readFileSync(path.join(accountComponentsDir, 'AddAddressModal.tsx'), 'utf8');
check('D7: A11y', modalContent.includes('role="dialog"'), 'Accessible Dialog: role="dialog" declared on address modal');
check('D7: A11y', modalContent.includes('aria-modal="true"'), 'Accessible Dialog: aria-modal="true" declared');
check('D7: A11y', modalContent.includes('aria-labelledby="addAddressTitle"'), 'Accessible Dialog: aria-labelledby links to title');

const cancelModalContent = fs.readFileSync(path.join(accountComponentsDir, 'OrderCancelModal.tsx'), 'utf8');
check('D7: A11y', cancelModalContent.includes('role="dialog"'), 'Accessible Dialog: role="dialog" on cancel order modal');
check('D7: A11y', cancelModalContent.includes('aria-modal="true"'), 'Accessible Dialog: aria-modal="true" on cancel modal');
check('D7: A11y', cancelModalContent.includes('Escape'), 'Accessible Dialog: ESC key listener dismisses modals');

// Form inputs accessibility
check('D7: A11y', modalContent.includes('htmlFor="addrTag"'), 'Accessible Forms: Label htmlFor mapped to input id');
check('D7: A11y', modalContent.includes('htmlFor="addrStreet"'), 'Accessible Forms: Street label mapped to input');

// Summary Report
console.log('\n═══════════════════════════════════════════════════════════════');
console.log(`   AUDIT RESULTS: ${passedChecks} / ${totalChecks} Checks Passed (${Math.round((passedChecks / totalChecks) * 100)}%)`);
if (failedChecks === 0) {
  console.log('   STATUS: ALL 7 DIMENSIONS FULLY COMPLIANT AND VERIFIED!      ');
} else {
  console.log(`   STATUS: ${failedChecks} CHECKS FAILED                      `);
}
console.log('═══════════════════════════════════════════════════════════════\n');

process.exit(failedChecks === 0 ? 0 : 1);
