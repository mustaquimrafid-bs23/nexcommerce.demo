const fs = require('fs');
const path = require('path');
const assert = require('assert');

let passes = 0;
let failures = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ PASS: ${name}`);
    passes++;
  } catch (err) {
    console.error(`❌ FAIL: ${name}`);
    console.error(`   ${err.message}`);
    failures++;
  }
}

console.log('\n====================================================');
console.log('🧪 AUDITING ORDER CONFIRMATION PAGE MIGRATION (HTML vs NEXT.JS)');
console.log('====================================================\n');

const projectRoot = path.resolve(__dirname, '..');
const confirmationHtmlPath = path.join(projectRoot, 'pages', 'confirmation.html');
const confirmationNextPagePath = path.join(projectRoot, 'app', 'confirmation', 'page.tsx');
const componentsDir = path.join(projectRoot, 'components', 'confirmation');

// 1. Check file existence
test('pages/confirmation.html exists', () => {
  assert.ok(fs.existsSync(confirmationHtmlPath), 'pages/confirmation.html missing');
});

test('app/confirmation/page.tsx exists', () => {
  assert.ok(fs.existsSync(confirmationNextPagePath), 'app/confirmation/page.tsx missing');
});

const confirmationComponents = [
  'ConfirmationHero.tsx',
  'DigitalBoardingPass.tsx',
  'DispatchTimeline.tsx',
  'OrderItemsBreakdown.tsx',
  'DeliveryDetailsCard.tsx',
  'PaymentSummaryCard.tsx',
  'ConfirmationNextActions.tsx',
  'ConfirmationRecommendations.tsx',
];

confirmationComponents.forEach((comp) => {
  test(`components/confirmation/${comp} exists`, () => {
    const p = path.join(componentsDir, comp);
    assert.ok(fs.existsSync(p), `Missing component ${comp}`);
  });
});

// 2. Read contents
const htmlContent = fs.readFileSync(confirmationHtmlPath, 'utf8');
const nextContent = fs.readFileSync(confirmationNextPagePath, 'utf8');
let allNextComponentCode = nextContent;
confirmationComponents.forEach((comp) => {
  allNextComponentCode += '\n' + fs.readFileSync(path.join(componentsDir, comp), 'utf8');
});

// 3. AI Buzzword elimination
const FORBIDDEN_AI_TERMS = [
  /\bAI\b/i,
  /\bArtificial Intelligence\b/i,
  /\bautonomous\b/i,
  /\bheuristic\b/i,
  /\balgorithm\b/i,
  /\bsynthesize\b/i,
  /\bhallucinate\b/i,
  /\bAtelier Patronage\b/i,
  /\bItemized Creations\b/i,
];

FORBIDDEN_AI_TERMS.forEach((term) => {
  test(`Next.js confirmation code is free of forbidden buzzword: ${term}`, () => {
    assert.ok(!term.test(allNextComponentCode), `Forbidden term ${term} found in Next.js code`);
  });
});

// 4. Background and palette compliance
test('Next.js confirmation uses unified Atelier Obsidian Deep Navy #01132B base', () => {
  assert.ok(nextContent.includes('#01132B'), 'Base background #01132B missing');
});

test('Next.js confirmation uses Atelier surface token #0A2A54', () => {
  assert.ok(allNextComponentCode.includes('#0A2A54'), 'Surface card #0A2A54 missing');
});

// 5. Check required ID invariants in Next.js Confirmation components
const REQUIRED_IDS = [
  '#conf-customer-line',
  '#digitalAtelierPass',
  '#conf-ref',
  '#btnCopyRef',
  '#conf-pass-eta',
  '#btnCalendarSync',
  '#conf-track-link',
  '#passQrFrame',
  '#passQrSvg',
  '#dispatchTimelineTrack',
  '#conf-items-list',
  '#conf-delivery-method',
  '#conf-delivery-eta',
  '#conf-shipping-cost',
  '#conf-address',
  '#conf-recipient-name',
  '#conf-phone',
  '#conf-email',
  '#conf-subtotal',
  '#conf-discount-row',
  '#conf-discount-label',
  '#conf-discount-amount',
  '#conf-shipping',
  '#conf-total',
  '#conf-payment-chip',
  '#conf-payment-label',
  '#btnConfCancelOrder',
  '#slConfirmWidget',
  '#slConfirmStrip',
  '#slConfirmViewAll',
  '#no-order-state',
  '#confirmation-content',
];

REQUIRED_IDS.forEach((idSelector) => {
  const rawId = idSelector.replace('#', '');
  test(`Next.js confirmation contains required ID ${idSelector}`, () => {
    assert.ok(
      allNextComponentCode.includes(`id="${rawId}"`) ||
      allNextComponentCode.includes(`id='${rawId}'`) ||
      allNextComponentCode.includes(`id={\`${rawId}\`}`),
      `Required element ${idSelector} missing from Next.js Confirmation components`
    );
  });
});

// 6. Interactive features verification
test('DigitalBoardingPass contains dynamic SVG QR generation logic', () => {
  const boardingPassCode = fs.readFileSync(path.join(componentsDir, 'DigitalBoardingPass.tsx'), 'utf8');
  assert.ok(boardingPassCode.includes('generateQrDots') || boardingPassCode.includes('passQrSvg'), 'QR code generator missing');
});

test('DigitalBoardingPass contains 1-click Calendar .ics sync logic', () => {
  const boardingPassCode = fs.readFileSync(path.join(componentsDir, 'DigitalBoardingPass.tsx'), 'utf8');
  assert.ok(boardingPassCode.includes('BEGIN:VCALENDAR') && boardingPassCode.includes('.ics'), 'Calendar sync .ics logic missing');
});

test('ConfirmationNextActions contains print receipt action (window.print)', () => {
  const nextActionsCode = fs.readFileSync(path.join(componentsDir, 'ConfirmationNextActions.tsx'), 'utf8');
  assert.ok(nextActionsCode.includes('window.print()'), 'window.print() missing from next actions');
});

test('ConfirmationRecommendations integrates with useCartStore for 1-click Add to Bag', () => {
  const recsCode = fs.readFileSync(path.join(componentsDir, 'ConfirmationRecommendations.tsx'), 'utf8');
  assert.ok(recsCode.includes('useCartStore') && recsCode.includes('addItem'), 'useCartStore addItem missing from recommendations');
});

test('DigitalBoardingPass Track Delivery link strictly points to /tracking route with order parameter', () => {
  const boardingPassCode = fs.readFileSync(path.join(componentsDir, 'DigitalBoardingPass.tsx'), 'utf8');
  assert.ok(
    boardingPassCode.includes('/tracking?order=') || boardingPassCode.includes('/tracking?ref='),
    'Track Delivery link (#conf-track-link) must point to /tracking route'
  );
});

test('DigitalBoardingPass passQrFrame link strictly points to /tracking route with order parameter', () => {
  const boardingPassCode = fs.readFileSync(path.join(componentsDir, 'DigitalBoardingPass.tsx'), 'utf8');
  assert.ok(
    boardingPassCode.includes('id="passQrFrame"') && boardingPassCode.includes('/tracking?order='),
    'passQrFrame must point to /tracking route'
  );
});

test('ConfirmationPage main CTA strictly points to /orders/ Order Detail route', () => {
  const pageCode = fs.readFileSync(confirmationNextPagePath, 'utf8');
  assert.ok(
    pageCode.includes('/orders/${encodeURIComponent(order.ref)}') || pageCode.includes('/orders/'),
    'Main CTA must point to /orders/ route'
  );
});

// Summary
console.log('\n====================================================');
console.log(`Audited Passes: ${passes}, Failures: ${failures}`);
console.log('====================================================\n');

if (failures > 0) {
  console.error(`💥 ${failures} CONFIRMATION PAGE INVARIANTS FAILED.`);
  process.exit(1);
} else {
  console.log('🎉 ALL CONFIRMATION PAGE MIGRATION AUDIT INVARIANTS PASSED!\n');
}
