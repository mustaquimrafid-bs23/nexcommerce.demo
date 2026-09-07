const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

let totalTests = 0;
let passedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ ${message}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
  }
}

console.log('─── Testing Account Page Migration & Elevation ───');

// 1. Component Architecture Check
console.log('\n[Tier 1: Component Architecture & Modularity]');
const requiredFiles = [
  'app/account/page.tsx',
  'components/account/types.ts',
  'components/account/DevStateSwitcher.tsx',
  'components/account/AccountHero.tsx',
  'components/account/AccountTabs.tsx',
  'components/account/OrderCard.tsx',
  'components/account/OverviewPanel.tsx',
  'components/account/OrdersPanel.tsx',
  'components/account/AddressesPanel.tsx',
  'components/account/AddAddressModal.tsx',
  'components/account/StyleProfilePanel.tsx',
  'components/account/OrderCancelModal.tsx',
  'components/account/EmptyAccountView.tsx',
  'components/account/SignedOutView.tsx',
];

for (const relPath of requiredFiles) {
  const fullPath = path.join(ROOT, relPath);
  assert(fs.existsSync(fullPath), `File exists: ${relPath}`);
}

// 2. Plain UK English & Zero "AI Words" Invariant
console.log('\n[Tier 2: Plain UK English Copywriting Invariant]');
const filesToAudit = requiredFiles.filter(f => f.endsWith('.tsx'));
const bannedJargon = [
  /\btelemetry\b/i,
  /\bsovereignty\b/i,
  /atelier order portfolio/i,
  /client portfolio/i,
  /portfolio valuation/i,
  /European custody/i,
  /handover imminent/i,
  /\bneural\b/i,
];

let foundBanned = false;
for (const relPath of filesToAudit) {
  const content = fs.readFileSync(path.join(ROOT, relPath), 'utf8');
  for (const regex of bannedJargon) {
    if (regex.test(content)) {
      console.error(`    Found forbidden term ${regex} in ${relPath}`);
      foundBanned = true;
    }
  }
}
assert(!foundBanned, 'Zero robotic / "AI" jargon in customer account components');

// Verify approved UK English terms
const mainAccountCode = fs.readFileSync(path.join(ROOT, 'app/account/page.tsx'), 'utf8');
const heroCode = fs.readFileSync(path.join(ROOT, 'components/account/AccountHero.tsx'), 'utf8');
const styleCode = fs.readFileSync(path.join(ROOT, 'components/account/StyleProfilePanel.tsx'), 'utf8');
const orderCardCode = fs.readFileSync(path.join(ROOT, 'components/account/OrderCard.tsx'), 'utf8');

assert(heroCode.includes('TOTAL SPENT'), 'AccountHero uses "TOTAL SPENT" instead of "Portfolio Valuation"');
assert(heroCode.includes('Personal Stylist'), 'AccountHero uses "Personal Stylist" instead of "Call Stylist" / "Neural"');
assert(styleCode.includes('COLOUR PALETTE'), 'StyleProfilePanel uses UK English "COLOUR PALETTE"');
assert(styleCode.includes('FAVOURITE DESIGNERS'), 'StyleProfilePanel uses UK English "FAVOURITE DESIGNERS"');
assert(styleCode.includes('YOUR PRIVACY & DATA'), 'StyleProfilePanel uses "YOUR PRIVACY & DATA" instead of "Sovereign Vault"');
assert(orderCardCode.includes('Ready for Dispatch'), 'OrderCard uses "Ready for Dispatch" instead of "Handover Imminent"');
assert(orderCardCode.includes('Track Delivery'), 'OrderCard uses "Track Delivery" instead of "Live Telemetry"');

// 3. Feature Parity & Interactions
console.log('\n[Tier 3: Feature Parity & Interactive State Coverage]');
assert(mainAccountCode.includes('DevStateSwitcher'), 'Page embeds DevStateSwitcher');
assert(mainAccountCode.includes('currentAuthState'), 'Page handles currentAuthState (signed_in, empty_account, signed_out)');
assert(mainAccountCode.includes('SignedOutView'), 'Page renders SignedOutView on signed_out');
assert(mainAccountCode.includes('EmptyAccountView'), 'Page renders EmptyAccountView on empty_account');
assert(mainAccountCode.includes('handleReorder'), 'Page provides Buy Again reorder functionality');
assert(mainAccountCode.includes('handleConfirmCancel'), 'Page provides order cancellation with 100% refund notice');
assert(mainAccountCode.includes('OrderCancelModal'), 'Page mounts OrderCancelModal');
assert(mainAccountCode.includes('addItemToCart'), 'Page integrates with useCartStore for 1-click cart addition');
assert(mainAccountCode.includes('AccountTabs'), 'Page mounts 4-tab system (Overview, Orders, Addresses, Style)');

console.log(`\n────────────────────────────────────────────────────────`);
console.log(`Summary: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
if (passedTests === totalTests) {
  console.log('🎉 ALL AUTOMATED TESTS PASSED!');
  process.exit(0);
} else {
  console.error('❌ SOME TESTS FAILED');
  process.exit(1);
}
