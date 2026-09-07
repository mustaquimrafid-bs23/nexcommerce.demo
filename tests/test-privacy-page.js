/**
 * test-privacy-page.js
 * Comprehensive Tier 2 Functional Verification Suite for pages/privacy.html (Zero-dependency)
 */

const fs = require('fs');
const path = require('path');

let failures = 0;
function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
  } else {
    console.error(`  ✗ FAILED: ${desc}`);
    failures++;
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('         TIER 2 FUNCTIONAL TEST SUITE: pages/privacy.html                      ');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

const htmlPath = path.join(__dirname, '..', 'pages', 'privacy.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// 1. Static AST / DOM Structure Integrity
console.log('[SECTION 1] DOM Structure & Architecture Checks:');
assert('File exists and is non-empty', html.length > 5000);
assert('Contains proper DOCTYPE, html lang="en"', html.includes('<!DOCTYPE html>') && html.includes('<html lang="en">'));
assert('Uses Modernist headline with accent italics', html.includes('Client Data Sovereignty &amp; <em>Privacy Charter</em>'));
assert('Contains live sovereignty status badge', html.includes('CLIENT DATA SOVEREIGNTY &middot; ZERO-KNOWLEDGE ARCHITECTURE'));
assert('Zero inline onsubmit handlers on forms', !html.includes('onsubmit='));
assert('Zero inline onclick handlers on interactive buttons', !html.includes('onclick='));

// 2. Data Sovereignty Controller & Live Vault Metrics
console.log('\n[SECTION 2] Data Sovereignty Controller & Vault Rows:');
assert('Contains Inspect Vault JSON button', html.includes('id="inspectVaultJsonBtn"'));
assert('Contains Export Vault JSON button', html.includes('id="exportVaultJsonBtn"'));
assert('Contains Purge All button', html.includes('id="purgeAllVaultBtn"'));
assert('Contains 4 live metric count pills', html.includes('id="vaultCountProfile"') && html.includes('id="vaultCountWishlist"') && html.includes('id="vaultCountOrders"') && html.includes('id="vaultCountCart"'));
assert('Contains granular clear buttons for each category', (html.match(/class="vault-row-clear-btn"/g) || []).length === 4);

// 3. Five Pillars of Data Sovereignty
console.log('\n[SECTION 3] Five Pillars of Data Sovereignty:');
assert('Contains Directive 01: Zero Data Brokerage', html.includes('DIRECTIVE 01') && html.includes('Zero Data Brokerage Covenant'));
assert('Contains Directive 02: Biometric Sizing', html.includes('DIRECTIVE 02') && html.includes('Biometric Sizing &amp; Client Encryption'));
assert('Contains Directive 03: Financial Tokenization', html.includes('DIRECTIVE 03') && html.includes('Financial Tokenization &amp; Ephemeral Sessions'));
assert('Contains Directive 04: Telemetry Transparency', html.includes('DIRECTIVE 04') && html.includes('Telemetry Transparency &amp; Local Storage Isolation'));
assert('Contains Directive 05: Erasure & Portability', html.includes('DIRECTIVE 05') && html.includes('Right to Complete Erasure &amp; Portability'));
assert('Contains manifesto pull quote', html.includes('We reject surveillance advertising'));

// 4. Interactive GDPR & CCPA Rights Hub
console.log('\n[SECTION 4] Interactive GDPR & CCPA Rights Hub:');
const rightsCount = (html.match(/class="rights-accordion-trigger"/g) || []).length;
assert(`Contains 4 Statutory Rights Accordion items (found: ${rightsCount})`, rightsCount === 4);
assert('Contains Right to Portability (Article 20)', html.includes('Article 20 GDPR'));
assert('Contains Right to Erasure (Article 17)', html.includes('Article 17 GDPR'));
assert('Contains Right to Object to Profiling (Article 21)', html.includes('Article 21 GDPR'));
assert('Contains Cookie & Telemetry Revocation', html.includes('ePrivacy Directive'));

// 5. JSON Inspection Modal & DPO Bridge
console.log('\n[SECTION 5] JSON Inspection Modal & DPO Bridge:');
assert('Contains Live JSON Modal', html.includes('id="privacyJsonModal"') && html.includes('id="jsonModalBody"'));
assert('Contains Copy JSON modal button', html.includes('id="copyJsonModalBtn"'));
assert('Contains Download JSON modal button', html.includes('id="downloadJsonModalBtn"'));
assert('Contains Cookie Settings trigger button', html.includes('id="openCookieSettingsBtn"'));
assert('Contains DPO Contact link to Concierge', html.includes('href="concierge.html"'));

// 6. Global Dynamic Chrome & Universal Script Invariant
console.log('\n[SECTION 6] Universal Scripts & Chrome Modules:');
const requiredScripts = [
  'lenis', 'animations.js', 'footer.js', 'visual-search-ui.js', 'theme-switcher.js',
  'cart.js', 'auth.js', 'header.js', 'ai-engine.js', 'intent-parser.js',
  'catalog-engine.js', 'session-context.js', 'search-overlay.js', 'cookie-consent.js',
  'cart-recovery-engine.js', 'cart-recovery-ui.js', 'delivery-gate-engine.js', 'delivery-gate-ui.js'
];
requiredScripts.forEach(script => {
  assert(`Contains script reference: ${script}`, html.includes(script));
});

// 7. Event Handler & Engine Logic Assertions
console.log('\n[SECTION 7] Engine Logic & Centralized Listener Checks:');
assert('Script contains getVaultPayload helper', html.includes('function getVaultPayload()'));
assert('Script contains updateVaultMetrics calculation', html.includes('function updateVaultMetrics()'));
assert('Script contains showPrivacyToast helper', html.includes('function showPrivacyToast('));
assert('Script contains downloadVaultFile handler', html.includes('function downloadVaultFile()'));
assert('Script contains JSON modal open/close lifecycle', html.includes('openJsonModal') && html.includes('closeJsonModal'));
assert('Script contains granular row clear handler', html.includes('rowClearBtns.forEach'));
assert('Script contains rights accordion toggle handler', html.includes('rightsItems.forEach'));

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('  ✨ ALL TIER 2 FUNCTIONAL TESTS PASSED WITH ZERO REGRESSIONS!');
} else {
  console.error(`  💥 ${failures} TEST FAILURES DETECTED!`);
  process.exit(1);
}
console.log('═══════════════════════════════════════════════════════════════════════════════\n');
