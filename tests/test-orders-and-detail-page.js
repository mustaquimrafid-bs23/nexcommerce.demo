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
console.log('🧪 AUDITING NEXT.JS ORDERS HUB & ORDER DETAIL PAGES');
console.log('====================================================\n');

const projectRoot = path.resolve(__dirname, '..');
const ordersPagePath = path.join(projectRoot, 'app', 'orders', 'page.tsx');
const orderDetailPagePath = path.join(projectRoot, 'app', 'orders', '[id]', 'page.tsx');
const ordersComponentsDir = path.join(projectRoot, 'components', 'orders');

// 1. Check file existence
test('app/orders/page.tsx exists', () => {
  assert.ok(fs.existsSync(ordersPagePath), 'app/orders/page.tsx missing');
});

test('app/orders/[id]/page.tsx exists', () => {
  assert.ok(fs.existsSync(orderDetailPagePath), 'app/orders/[id]/page.tsx missing');
});

test('components/orders/OrdersHero.tsx exists', () => {
  assert.ok(fs.existsSync(path.join(ordersComponentsDir, 'OrdersHero.tsx')), 'OrdersHero.tsx missing');
});

test('components/orders/OrderCard.tsx exists', () => {
  assert.ok(fs.existsSync(path.join(ordersComponentsDir, 'OrderCard.tsx')), 'OrderCard.tsx missing');
});

test('components/orders/OrderDetailHeader.tsx exists', () => {
  assert.ok(fs.existsSync(path.join(ordersComponentsDir, 'OrderDetailHeader.tsx')), 'OrderDetailHeader.tsx missing');
});

test('components/orders/OrderTrackingCard.tsx exists', () => {
  assert.ok(fs.existsSync(path.join(ordersComponentsDir, 'OrderTrackingCard.tsx')), 'OrderTrackingCard.tsx missing');
});

test('components/orders/OrderItemsList.tsx exists', () => {
  assert.ok(fs.existsSync(path.join(ordersComponentsDir, 'OrderItemsList.tsx')), 'OrderItemsList.tsx missing');
});

test('components/orders/OrderDeliveryInfo.tsx exists', () => {
  assert.ok(fs.existsSync(path.join(ordersComponentsDir, 'OrderDeliveryInfo.tsx')), 'OrderDeliveryInfo.tsx missing');
});

test('components/orders/OrderPaymentSummary.tsx exists', () => {
  assert.ok(fs.existsSync(path.join(ordersComponentsDir, 'OrderPaymentSummary.tsx')), 'OrderPaymentSummary.tsx missing');
});

test('components/orders/OrderActionHub.tsx exists', () => {
  assert.ok(fs.existsSync(path.join(ordersComponentsDir, 'OrderActionHub.tsx')), 'OrderActionHub.tsx missing');
});

// 2. Read contents
const ordersContent = fs.readFileSync(ordersPagePath, 'utf8');
const orderDetailContent = fs.readFileSync(orderDetailPagePath, 'utf8');
const heroContent = fs.readFileSync(path.join(ordersComponentsDir, 'OrdersHero.tsx'), 'utf8');
const cardContent = fs.readFileSync(path.join(ordersComponentsDir, 'OrderCard.tsx'), 'utf8');
const headerContent = fs.readFileSync(path.join(ordersComponentsDir, 'OrderDetailHeader.tsx'), 'utf8');
const trackingContent = fs.readFileSync(path.join(ordersComponentsDir, 'OrderTrackingCard.tsx'), 'utf8');
const itemsContent = fs.readFileSync(path.join(ordersComponentsDir, 'OrderItemsList.tsx'), 'utf8');
const deliveryContent = fs.readFileSync(path.join(ordersComponentsDir, 'OrderDeliveryInfo.tsx'), 'utf8');
const paymentContent = fs.readFileSync(path.join(ordersComponentsDir, 'OrderPaymentSummary.tsx'), 'utf8');
const actionHubContent = fs.readFileSync(path.join(ordersComponentsDir, 'OrderActionHub.tsx'), 'utf8');

const allOrdersCode = [
  ordersContent,
  orderDetailContent,
  heroContent,
  cardContent,
  headerContent,
  trackingContent,
  itemsContent,
  deliveryContent,
  paymentContent,
  actionHubContent,
].join('\n');

// 3. Zero AI buzzwords
const FORBIDDEN_AI_TERMS = [
  /\bAI\b/i,
  /\bArtificial Intelligence\b/i,
  /\bautonomous\b/i,
  /\bheuristic\b/i,
  /\balgorithm\b/i,
  /\bsynthesize\b/i,
  /\bhallucinate\b/i,
  /\bSmart Savings Advisor\b/i,
  /\bOptimal code\b/i,
];

FORBIDDEN_AI_TERMS.forEach((term) => {
  test(`Orders code is free of forbidden buzzword: ${term}`, () => {
    assert.ok(!term.test(allOrdersCode), `Forbidden term ${term} found in Orders code`);
  });
});

// 4. Background and color token compliance
test('Orders pages use approved design system canvas base (#01132B / #F8F7F4)', () => {
  assert.ok(ordersContent.includes('#01132B') && (orderDetailContent.includes('#F8F7F4') || orderDetailContent.includes('#01132B')), 'Base canvas background missing');
});

test('Orders pages use surface tokens #0A2A54 / #012148', () => {
  assert.ok(allOrdersCode.includes('#0A2A54') || allOrdersCode.includes('#012148'), 'Surface tokens missing');
});

// 5. Required IDs on Orders Hub
const REQUIRED_HUB_IDS = [
  '#heroBadgeCount',
  '#heroTotalOrders',
  '#heroInTransit',
  '#heroDelivered',
  '#heroTotalSpent',
  '#countAll',
  '#countTransit',
  '#countDelivered',
  '#countCancelled',
  '#ordersSearchInput',
  '#ordersList',
];

REQUIRED_HUB_IDS.forEach((idSelector) => {
  const rawId = idSelector.replace('#', '');
  test(`Orders Hub contains required ID ${idSelector}`, () => {
    assert.ok(
      allOrdersCode.includes(`id="${rawId}"`) ||
      allOrdersCode.includes(`id='${rawId}'`) ||
      allOrdersCode.includes(`id={\`${rawId}\`}`),
      `Required element ${idSelector} missing from Orders Hub`
    );
  });
});

// 6. Required IDs on Dedicated Order Detail Page
const REQUIRED_DETAIL_IDS = [
  '#orderDetailHeader',
  '#orderStatusBadge',
  '#btnCopyOrderRef',
  '#orderTrackingCard',
  '#btnToggleCheckpoints',
  '#orderItemsListCard',
  '#orderDeliveryInfoCard',
  '#orderPaymentSummaryCard',
  '#orderActionHub',
  '#btnDownloadInvoice',
  '#btnPrintReceipt',
  '#btnReturnExchange',
  '#btnCustomerCare',
];

REQUIRED_DETAIL_IDS.forEach((idSelector) => {
  const rawId = idSelector.replace('#', '');
  test(`Order Detail Page contains required ID ${idSelector}`, () => {
    assert.ok(
      allOrdersCode.includes(`id="${rawId}"`) ||
      allOrdersCode.includes(`id='${rawId}'`) ||
      allOrdersCode.includes(`id={\`${rawId}\`}`),
      `Required element ${idSelector} missing from Order Detail Page`
    );
  });
});

test('OrderTrackingCard contains Live Radar Telemetry beacon and Checkpoint History logs', () => {
  assert.ok(trackingContent.includes('animate-ping') || trackingContent.includes('LIVE CARRIER TELEMETRY'), 'Missing live radar telemetry beacon in OrderTrackingCard');
  assert.ok(trackingContent.includes('detailedCheckpoints') || trackingContent.includes('trackingDetailedLogs'), 'Missing detailed checkpoint log in OrderTrackingCard');
});

test('OrderActionHub contains Contactless QR Return Generator and WhatsApp Concierge', () => {
  assert.ok(actionHubContent.includes('Generate Drop-off QR') || actionHubContent.includes('Contactless QR Generated'), 'Missing contactless QR return generator in OrderActionHub');
  assert.ok(actionHubContent.includes('wa.me') || actionHubContent.includes('WhatsApp'), 'Missing direct WhatsApp concierge channel in OrderActionHub');
});

// 7. Dedicated Order Detail Architecture Verification
test('OrderDetailPage renders dedicated Order Suite (Header, Tracking, ItemsList, DeliveryInfo, PaymentSummary, ActionHub)', () => {
  assert.ok(orderDetailContent.includes('OrderDetailHeader'), 'Missing OrderDetailHeader in OrderDetailPage');
  assert.ok(orderDetailContent.includes('OrderTrackingCard'), 'Missing OrderTrackingCard in OrderDetailPage');
  assert.ok(orderDetailContent.includes('OrderItemsList'), 'Missing OrderItemsList in OrderDetailPage');
  assert.ok(orderDetailContent.includes('OrderDeliveryInfo'), 'Missing OrderDeliveryInfo in OrderDetailPage');
  assert.ok(orderDetailContent.includes('OrderPaymentSummary'), 'Missing OrderPaymentSummary in OrderDetailPage');
  assert.ok(orderDetailContent.includes('OrderActionHub'), 'Missing OrderActionHub in OrderDetailPage');
});

test('OrderDetailPage does NOT import post-checkout Confirmation components', () => {
  assert.ok(!orderDetailContent.includes('ConfirmationHero'), 'ConfirmationHero must not be in OrderDetailPage');
  assert.ok(!orderDetailContent.includes('DigitalBoardingPass'), 'DigitalBoardingPass must not be in OrderDetailPage');
  assert.ok(!orderDetailContent.includes('ConfirmationNextActions'), 'ConfirmationNextActions must not be in OrderDetailPage');
  assert.ok(!orderDetailContent.includes('ConfirmationRecommendations'), 'ConfirmationRecommendations must not be in OrderDetailPage');
});

// Summary
console.log('\n====================================================');
console.log(`Audited Passes: ${passes}, Failures: ${failures}`);
console.log('====================================================\n');

if (failures > 0) {
  console.error(`💥 ${failures} ORDERS PAGE INVARIANTS FAILED.`);
  process.exit(1);
} else {
  console.log('🎉 ALL ORDERS & ORDER DETAIL PAGE AUDIT INVARIANTS PASSED!\n');
}
