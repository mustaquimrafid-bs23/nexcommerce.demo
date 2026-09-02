const fs = require('fs');
const path = require('path');

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

console.log('🧪 Testing Terms of Engagement Page Migration...');

const termsPagePath = path.resolve(process.cwd(), 'app/terms/page.tsx');
assert('app/terms/page.tsx exists', fs.existsSync(termsPagePath));

const scrollSpyPath = path.resolve(process.cwd(), 'components/terms/TermsScrollSpy.tsx');
assert('components/terms/TermsScrollSpy.tsx exists', fs.existsSync(scrollSpyPath));

if (fs.existsSync(termsPagePath)) {
  const content = fs.readFileSync(termsPagePath, 'utf8');
  assert('Terms page has Article 01 (Scope)', content.includes('Article 01') || content.includes('art1'));
  assert('Terms page has Article 04 (Widerrufsbelehrung)', content.includes('Widerrufsbelehrung') || content.includes('Right of Withdrawal'));
  assert('Terms page has Article 06 (Dispute Resolution)', content.includes('Article 06') || content.includes('art6'));
  assert('Terms page has Concierge Legal Desk bridge', content.includes('Concierge') || content.includes('LEGAL DESK'));
}

const footerPath = path.resolve(process.cwd(), 'components/layout/Footer.tsx');
const footerContent = fs.readFileSync(footerPath, 'utf8');
assert('Footer links to /terms', footerContent.includes('href="/terms"'));

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
