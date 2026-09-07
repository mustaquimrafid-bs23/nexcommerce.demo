const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 30: PAGE-15 Atelier Legal, Privacy & Commerce Guides Parity Test...\n');

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

const termsPath = path.resolve('app/terms/page.tsx');
const privacyPath = path.resolve('app/privacy/page.tsx');
const guidePath = path.resolve('app/guide/page.tsx');
const featureGuidePath = path.resolve('app/feature-guide/page.tsx');

assert('app/terms/page.tsx exists', fs.existsSync(termsPath));
assert('app/privacy/page.tsx exists', fs.existsSync(privacyPath));
assert('app/guide/page.tsx exists', fs.existsSync(guidePath));
assert('app/feature-guide/page.tsx exists', fs.existsSync(featureGuidePath));

const termsContent = fs.readFileSync(termsPath, 'utf8');
const guideContent = fs.readFileSync(guidePath, 'utf8');

// 1. Assert Terms of Service contains scrollspy and articles
assert('Terms page mounts TermsScrollSpy with legal articles', termsContent.includes('TermsScrollSpy') && termsContent.includes('TERMS_ARTICLES'));

// 2. Assert Guide covers all 4 stages
assert('Guide page documents Discovery, Styling, Budget, and Delivery stages', guideContent.includes('STAGES') && guideContent.includes('discovery') && guideContent.includes('styling') && guideContent.includes('budget') && guideContent.includes('delivery'));

console.log(`\nBatch 30 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
