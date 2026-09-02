/**
 * Automated Verification Suite for Batch 15:
 * Checkout bKash / Nagad MFS PIN Settlement Sheet Modal & Flow
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
console.log('🧪 BATCH 15: MFS PAYMENT SETTLEMENT & CHECKOUT SUITE');
console.log('====================================================\n');

// 1. Verify component existence
const mfsPath = path.join(__dirname, '..', 'components', 'checkout', 'MfsPaymentSheet.tsx');
assert(fs.existsSync(mfsPath), 'components/checkout/MfsPaymentSheet.tsx exists');

if (fs.existsSync(mfsPath)) {
  const content = fs.readFileSync(mfsPath, 'utf8');

  // 2. Brand Color Tokens
  assert(
    content.includes('#E2136E'),
    'MfsPaymentSheet contains bKash signature color #E2136E'
  );
  assert(
    content.includes('#F7931E'),
    'MfsPaymentSheet contains Nagad signature color #F7931E'
  );

  // 3. Multi-step Progressive Settlement
  assert(
    content.includes("'phone'") && content.includes("'otp'") && content.includes("'pin'"),
    'MfsPaymentSheet implements 3-step settlement flow (phone -> otp -> pin)'
  );
  assert(
    content.includes('maxLength={5}') || content.includes('maxLength={6}'),
    'MfsPaymentSheet enforces 5-digit PIN or 6-digit OTP length boundaries'
  );

  // 4. Currency Conversion (BDT Rate)
  assert(
    content.includes('BDT') && (content.includes('135') || content.includes('132') || content.includes('formatPrice')),
    'MfsPaymentSheet displays approximate BDT currency conversion'
  );

  // 5. Plain British English Copywriting (Zero AI Jargon)
  const forbiddenBuzzwords = [
    /\bAI\b/i,
    /\bArtificial Intelligence\b/i,
    /\bautonomous\b/i,
    /\bheuristic\b/i,
    /\bneural\b/i,
    /\bsynthesize\b/i,
    /\bhallucinate\b/i,
  ];

  for (const pattern of forbiddenBuzzwords) {
    assert(
      !content.match(pattern),
      `MfsPaymentSheet is free of forbidden buzzword ${pattern.toString()}`
    );
  }

  // 6. Security and Trust Signals
  assert(
    content.includes('256-bit') || content.includes('Encrypted') || content.includes('encrypted'),
    'MfsPaymentSheet displays bank-grade encryption trust badge'
  );
}

// 7. Verify Checkout Page Integration
const checkoutPagePath = path.join(__dirname, '..', 'app', 'checkout', 'page.tsx');
assert(fs.existsSync(checkoutPagePath), 'app/checkout/page.tsx exists');

if (fs.existsSync(checkoutPagePath)) {
  const pageContent = fs.readFileSync(checkoutPagePath, 'utf8');
  assert(
    pageContent.includes('MfsPaymentSheet'),
    'app/checkout/page.tsx imports and renders MfsPaymentSheet'
  );
  assert(
    pageContent.includes('bkash') && pageContent.includes('nagad'),
    'app/checkout/page.tsx supports both bkash and nagad payment methods'
  );
}

console.log('\n====================================================');
console.log(`Audited Passes: ${passes}, Failures: ${failures}`);
console.log('====================================================\n');

if (failures > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL BATCH 15 MFS PAYMENT AUDIT INVARIANTS PASSED!');
  process.exit(0);
}
