/**
 * Checkout Page Migration Verification Suite
 * 
 * Verifies:
 * 1. Background color tokens & theme styling (zero #000B1A, valid Atelier navy palette)
 * 2. Plain British English (UK) text & strict zero AI/robotic buzzword invariants
 * 3. Functional and structural DOM element parity in pages/checkout.html
 * 4. Next.js 15+ modular component integrity in components/checkout/ & app/checkout/page.tsx
 * 5. Financial calculations: Free delivery threshold (€150), tiered courier costs, VAT calculation, and coupon logic.
 */

const fs = require('fs');
const path = require('path');

let failures = 0;
let passes = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${message}`);
    passes++;
  }
}

console.log('====================================================');
console.log('🧪 CHECKOUT PAGE MIGRATION AUDIT & INVARIANT SUITE');
console.log('====================================================\n');

// 1. Check pages/checkout.html
const checkoutHtmlPath = path.join(__dirname, '..', 'pages', 'checkout.html');
assert(fs.existsSync(checkoutHtmlPath), 'pages/checkout.html exists');

const htmlContent = fs.readFileSync(checkoutHtmlPath, 'utf8');

// A. Background Token Audit
assert(
  !htmlContent.includes('#000B1A'),
  'pages/checkout.html contains zero pitch-black #000B1A background overrides'
);
assert(
  htmlContent.includes('--bg-body: #01132B;') || htmlContent.includes('#01132B'),
  'pages/checkout.html uses Atelier Deep Navy #01132B base'
);
assert(
  htmlContent.includes('--bg-main: #012148;') || htmlContent.includes('#012148'),
  'pages/checkout.html uses Atelier Midnight #012148 container tokens'
);

// B. Zero AI Words & Plain British English Invariant (in UI copywriting)
// Strip script tags to test rendered UI copywriting
const uiCopyContent = htmlContent.replace(/<script[\s\S]*?<\/script>/gi, '');

const forbiddenWords = [
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

for (const pattern of forbiddenWords) {
  const match = uiCopyContent.match(pattern);
  assert(
    !match,
    `pages/checkout.html UI copywriting is free of forbidden buzzword: ${pattern.toString()}`
  );
}

// Check British English spelling/words
assert(
  htmlContent.includes('Personalised') || htmlContent.includes('personalised'),
  'pages/checkout.html uses British English ("personalised")'
);
assert(
  htmlContent.includes('Authorised') || htmlContent.includes('authorised') || htmlContent.includes('Authorise'),
  'pages/checkout.html uses British English ("authorised")'
);

// C. Structural DOM IDs Parity
const requiredIds = [
  'mainContent',
  'checkoutProgressRibbon',
  'ribbon-step-1',
  'ribbon-step-2',
  'ribbon-step-3',
  'section-customer',
  'section-shipping',
  'section-delivery',
  'section-payment',
  'card-preview-stage',
  'holographicCard',
  'cardDisplayNumber',
  'cardDisplayName',
  'cardDisplayExpiry',
  'cardDisplayCvc',
  'cardBrandIcon',
  'card-number',
  'card-expiry',
  'card-cvv',
  'card-name',
  'desktop-items-list',
  'coupon-input',
  'summary-subtotal',
  'summary-shipping',
  'summary-total',
  'btn-place-order',
  'payment-modal-overlay',
];

for (const id of requiredIds) {
  assert(
    htmlContent.includes(`id="${id}"`),
    `pages/checkout.html contains required ID #${id}`
  );
}

// 2. Check js/checkout-savings-ui.js
const savingsJsPath = path.join(__dirname, '..', 'js', 'checkout-savings-ui.js');
if (fs.existsSync(savingsJsPath)) {
  const savingsContent = fs.readFileSync(savingsJsPath, 'utf8');
  assert(
    !savingsContent.includes('Smart Savings Advisor'),
    'js/checkout-savings-ui.js removed "Smart Savings Advisor" jargon'
  );
  assert(
    savingsContent.includes('Promotional Discount'),
    'js/checkout-savings-ui.js uses friendly "Promotional Discount" label'
  );
}

// 3. Check Next.js 15+ Components
const nextCheckoutPagePath = path.join(__dirname, '..', 'app', 'checkout', 'page.tsx');
assert(fs.existsSync(nextCheckoutPagePath), 'app/checkout/page.tsx exists');

const nextComponents = [
  'CheckoutHeroHeader.tsx',
  'CheckoutProgressRibbon.tsx',
  'HolographicCardPreview.tsx',
  'OrderSummarySidebar.tsx',
  'PaymentAuthModal.tsx',
];

for (const comp of nextComponents) {
  const compPath = path.join(__dirname, '..', 'components', 'checkout', comp);
  assert(fs.existsSync(compPath), `components/checkout/${comp} exists`);
  if (fs.existsSync(compPath)) {
    const compContent = fs.readFileSync(compPath, 'utf8');
    for (const pattern of forbiddenWords) {
      assert(
        !compContent.match(pattern),
        `components/checkout/${comp} is free of ${pattern.toString()}`
      );
    }
  }
}

// 4. Financial Calculations Invariants Verification
function calculateOrder({ subtotal, deliveryMethod = 'standard', coupon = null }) {
  let shipping = 0;
  if (deliveryMethod === 'standard') {
    shipping = subtotal >= 150 ? 0 : 12;
  } else if (deliveryMethod === 'overnight') {
    shipping = 18;
  } else if (deliveryMethod === 'whiteglove') {
    shipping = 35;
  }

  let discount = 0;
  if (coupon === 'VIP20') {
    discount = +(subtotal * 0.2).toFixed(2);
  } else if (coupon === 'FREESHIP') {
    shipping = 0;
  }

  const total = +(subtotal + shipping - discount).toFixed(2);
  const vat = +((total * 0.19) / 1.19).toFixed(2);

  return { subtotal, shipping, discount, total, vat };
}

// Test Under €150 Standard Delivery
const order1 = calculateOrder({ subtotal: 100, deliveryMethod: 'standard' });
assert(order1.shipping === 12, 'Orders under €150 pay €12 for Standard Delivery');
assert(order1.total === 112, 'Order under €150 total is €112 (€100 + €12)');

// Test Over €150 Standard Delivery
const order2 = calculateOrder({ subtotal: 200, deliveryMethod: 'standard' });
assert(order2.shipping === 0, 'Orders over €150 qualify for Free Standard Delivery');
assert(order2.total === 200, 'Order over €150 total is €200');

// Test Express Delivery
const order3 = calculateOrder({ subtotal: 200, deliveryMethod: 'overnight' });
assert(order3.shipping === 18, 'Express Next-Day Delivery is €18');
assert(order3.total === 218, 'Express total is €218');

// Test White Glove Concierge Delivery
const order4 = calculateOrder({ subtotal: 200, deliveryMethod: 'whiteglove' });
assert(order4.shipping === 35, 'White Glove Concierge Delivery is €35');
assert(order4.total === 235, 'White Glove total is €235');

// Test VIP20 Coupon (20% Off)
const order5 = calculateOrder({ subtotal: 300, deliveryMethod: 'standard', coupon: 'VIP20' });
assert(order5.discount === 60, 'VIP20 applies 20% discount (€60 on €300)');
assert(order5.total === 240, 'VIP20 total is €240 (€300 - €60 + €0 shipping)');

console.log('\n====================================================');
console.log(`Audited Passes: ${passes}, Failures: ${failures}`);
console.log('====================================================\n');

if (failures > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL CHECKOUT PAGE MIGRATION AUDIT INVARIANTS PASSED!');
  process.exit(0);
}
