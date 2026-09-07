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

console.log('🧪 Testing Cookie Consent & Zero-Knowledge Privacy Banner...');

const bannerPath = path.resolve(process.cwd(), 'components/layout/CookieConsentBanner.tsx');
assert('components/layout/CookieConsentBanner.tsx exists', fs.existsSync(bannerPath));

const layoutPath = path.resolve(process.cwd(), 'app/layout.tsx');
assert('app/layout.tsx exists', fs.existsSync(layoutPath));

if (fs.existsSync(bannerPath)) {
  const content = fs.readFileSync(bannerPath, 'utf8');
  assert('CookieConsentBanner checks nex_cookie_consent in localStorage', content.includes('nex_cookie_consent'));
  assert('CookieConsentBanner provides Accept All and Reject / Strictly Necessary', content.includes('Accept All') && (content.includes('Reject') || content.includes('Necessary')));
  assert('CookieConsentBanner includes granular category preferences', content.includes('functional') || content.includes('analytics') || content.includes('Preferences'));
}

if (fs.existsSync(layoutPath)) {
  const layoutContent = fs.readFileSync(layoutPath, 'utf8');
  assert('app/layout.tsx mounts CookieConsentBanner', layoutContent.includes('CookieConsentBanner'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
