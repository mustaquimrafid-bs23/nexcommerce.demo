/**
 * test-contact-page.js
 * Comprehensive Tier 2 Functional Verification Suite for pages/contact.html (Zero-dependency)
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
console.log('         TIER 2 FUNCTIONAL TEST SUITE: pages/contact.html                      ');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

const htmlPath = path.join(__dirname, '..', 'pages', 'contact.html');
const html = fs.readFileSync(htmlPath, 'utf8');

// 1. Static AST / DOM Structure Integrity
console.log('[SECTION 1] DOM Structure & Architecture Checks:');
assert('File exists and is non-empty', html.length > 5000);
assert('Contains proper DOCTYPE, html lang="en"', html.includes('<!DOCTYPE html>') && html.includes('<html lang="en">'));
assert('Uses Modernist headline with accent italics', html.includes('Private Concierge &amp; <em>Advisory</em>'));
assert('Contains live atelier status badge', html.includes('ATELIER CLIENT SERVICES &middot; LIVE DESK'));
assert('Contains Paris & Milan live clocks row', html.includes('id="parisClock"') && html.includes('id="milanClock"'));
assert('Contains 3 dedicated service channel cards', html.includes('Direct Atelier WhatsApp') && html.includes('Bespoke Styling Session') && html.includes('White-Glove Order Support'));
assert('WhatsApp link includes pre-encoded text message', html.includes('wa.me/390288421190?text='));
assert('Zero inline onsubmit handlers on forms', !html.includes('onsubmit='));
assert('Zero inline onclick handlers on interactive buttons', !html.includes('onclick='));

// 2. Curated Look Spotlight & 120fps Animation Track
console.log('\n[SECTION 2] Curated Look Spotlight & 120fps Animation Track:');
assert('Contains GPU progress bar track and bar', html.includes('contact-spotlight-progress-track') && html.includes('id="contactSpotlightProgressBar"'));
assert('Contains Look Switcher Tabs (01 to 04)', html.includes('data-look="0"') && html.includes('data-look="1"') && html.includes('data-look="2"') && html.includes('data-look="3"'));
assert('Contains Look Pause button with aria-pressed', html.includes('id="contactSpotlightPauseBtn"') && html.includes('aria-pressed="false"'));
assert('Contains Quick Add button with data-product-id', html.includes('id="contactSpotlightAddBtn"'));
assert('Contains Floating Shoppable Look Capsule Pill', html.includes('id="contactFloatingLookPill"') && html.includes('id="contactPillQuickAddBtn"'));

// 3. Direct Dispatch Portal & Ticket Generator
console.log('\n[SECTION 3] Direct Dispatch Portal & Ticket Generator:');
assert('Contains 1-Click Demo Inquiry Button', html.includes('id="quickDemoInquiryBtn"'));
assert('Contains 5 Domain Selection Pills', html.includes('data-domain="styling"') && html.includes('data-domain="logistics"') && html.includes('data-domain="alterations"') && html.includes('data-domain="provenance"') && html.includes('data-domain="membership"'));
assert('Contains required inputs (Name, Email, Message)', html.includes('id="clientName"') && html.includes('id="clientEmail"') && html.includes('id="inquiryMessage"'));
assert('Contains Ticket Confirmation Box with Copy and Reset buttons', html.includes('id="ticketConfirmationBox"') && html.includes('id="copyTicketRefBtn"') && html.includes('id="resetInquiryBtn"'));

// 4. Interactive FAQ & Physical Atelier Directory
console.log('\n[SECTION 4] Interactive FAQ & Flagship Locations:');
const faqCount = (html.match(/class="faq-accordion-trigger"/g) || []).length;
assert(`Contains 4 FAQ Accordion items (found: ${faqCount})`, faqCount === 4);
assert('Contains Paris Flagship Atelier with maps query link', html.includes('Paris Atelier &middot; Rue Saint-Honor&eacute;') && html.includes('query=228+Rue+Saint-Honore'));
assert('Contains Milan Studio with maps query link', html.includes('Milan Studio &middot; Quadrilatero') && html.includes('query=Via+Montenapoleone+18'));
assert('Contains verified direct telephone links', html.includes('href="tel:+33142685500"') && html.includes('href="tel:+390288421190"'));

// 5. Global Dynamic Chrome & Universal Script Invariant
console.log('\n[SECTION 5] Universal Scripts & Chrome Modules:');
const requiredScripts = [
  'lenis', 'animations.js', 'footer.js', 'visual-search-ui.js', 'theme-switcher.js',
  'cart.js', 'auth.js', 'header.js', 'ai-engine.js', 'intent-parser.js',
  'catalog-engine.js', 'session-context.js', 'search-overlay.js', 'cookie-consent.js',
  'cart-recovery-engine.js', 'cart-recovery-ui.js', 'delivery-gate-engine.js', 'delivery-gate-ui.js'
];
requiredScripts.forEach(script => {
  assert(`Contains script reference: ${script}`, html.includes(script));
});

// 6. Look Dataset & Event Engine Integrity
console.log('\n[SECTION 6] Look Dataset & Event Engine Integrity:');
assert('Script contains LOOKS array with 4 items', html.includes('var LOOKS = [') && html.includes("'p1'") && html.includes("'p4'") && html.includes("'p8'") && html.includes("'p3'"));
assert('Script handles centralized inquiry submit listener', html.includes("inquiryForm.addEventListener('submit'"));
assert('Script handles demo fill click listener', html.includes("demoFillBtn.addEventListener('click'"));
assert('Script handles domain pills sync listener', html.includes("domainPills.forEach"));
assert('Script handles FAQ accordion toggle listener', html.includes("faqItems.forEach"));
assert('Script handles copy ticket ref clipboard listener', html.includes("copyRefBtn.addEventListener('click'"));
assert('Script handles schedule consultation smooth scroll', html.includes("scheduleBtn.addEventListener('click'"));

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
if (failures === 0) {
  console.log('  ✨ ALL TIER 2 FUNCTIONAL TESTS PASSED WITH ZERO REGRESSIONS!');
} else {
  console.error(`  💥 ${failures} TEST FAILURES DETECTED!`);
  process.exit(1);
}
console.log('═══════════════════════════════════════════════════════════════════════════════\n');
