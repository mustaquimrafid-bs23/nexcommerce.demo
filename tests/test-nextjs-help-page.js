/**
 * test-nextjs-help-page.js
 * Comprehensive Multi-Tier Verification Suite for Help & Customer Care Page in Next.js 15
 */

const fs = require('fs');
const path = require('path');
const http = require('http');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(desc, condition) {
  totalTests++;
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passedTests++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failedTests++;
  }
}

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log('   TIER 1 & 2 VERIFICATION SUITE: Help & Customer Care Page (Next.js 15)       ');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

const rootDir = path.join(__dirname, '..');

// 1. Component Architecture & File Integrity
console.log('[SECTION 1] Architecture & Modularity Checks:');
const requiredFiles = [
  'app/help/page.tsx',
  'app/contact/page.tsx',
  'components/help/types.ts',
  'components/help/data.ts',
  'components/help/HelpDeskHero.tsx',
  'components/help/ServiceChannelsGrid.tsx',
  'components/help/CuratedBespokeSpotlight.tsx',
  'components/help/DirectDispatchPortal.tsx',
  'components/help/HelpFAQAccordion.tsx',
  'components/help/AtelierDirectory.tsx',
];

requiredFiles.forEach((file) => {
  const filePath = path.join(rootDir, file);
  assert(`File exists: ${file}`, fs.existsSync(filePath));
});

// 2. Strict Plain UK English & Zero "AI" Jargon Invariant
console.log('\n[SECTION 2] Plain UK English & Zero "AI" Jargon Audits:');
const forbiddenPatterns = [
  /\bAI\b/i,
  /\bAi\b/,
  /\bA\.I\.\b/,
  /Conversational/i,
  /Neural/i,
  /Calibrator/i,
  /Autonomous/i,
];

const helpFilesToCheck = [
  'app/help/page.tsx',
  'app/contact/page.tsx',
  'components/help/data.ts',
  'components/help/HelpDeskHero.tsx',
  'components/help/ServiceChannelsGrid.tsx',
  'components/help/CuratedBespokeSpotlight.tsx',
  'components/help/DirectDispatchPortal.tsx',
  'components/help/HelpFAQAccordion.tsx',
  'components/help/AtelierDirectory.tsx',
];

let jargonFound = false;
helpFilesToCheck.forEach((file) => {
  const content = fs.readFileSync(path.join(rootDir, file), 'utf8');
  forbiddenPatterns.forEach((pat) => {
    if (pat.test(content)) {
      console.error(`    Found forbidden term ${pat} in ${file}`);
      jargonFound = true;
    }
  });
});
assert('Zero robotic / "AI" jargon across all Help & Customer Care files', !jargonFound);

// 3. Navigation & Header / Footer Parity
console.log('\n[SECTION 3] Navigation & Global Chrome Linkage:');
const headerContent = fs.readFileSync(path.join(rootDir, 'components/layout/Header.tsx'), 'utf8');
const footerContent = fs.readFileSync(path.join(rootDir, 'components/layout/Footer.tsx'), 'utf8');

assert('Header 3-dot dropdown links "Help & Customer Care" to /help', headerContent.includes('href="/help"') && headerContent.includes('Help &amp; Customer Care'));
assert('Header mobile nav drawer includes "Help & Customer Care" link to /help', headerContent.includes('mobileNavDrawer') && headerContent.includes('href="/help"'));
assert('Footer includes "Help & Customer Care" link to /help', footerContent.includes('href="/help"') && footerContent.includes('Help &amp; Customer Care'));

// 4. Feature Invariants in Help Components
console.log('\n[SECTION 4] Feature & Interactive State Coverage:');
const heroContent = fs.readFileSync(path.join(rootDir, 'components/help/HelpDeskHero.tsx'), 'utf8');
const channelsContent = fs.readFileSync(path.join(rootDir, 'components/help/ServiceChannelsGrid.tsx'), 'utf8');
const spotlightContent = fs.readFileSync(path.join(rootDir, 'components/help/CuratedBespokeSpotlight.tsx'), 'utf8');
const portalContent = fs.readFileSync(path.join(rootDir, 'components/help/DirectDispatchPortal.tsx'), 'utf8');
const faqContent = fs.readFileSync(path.join(rootDir, 'components/help/HelpFAQAccordion.tsx'), 'utf8');
const directoryContent = fs.readFileSync(path.join(rootDir, 'components/help/AtelierDirectory.tsx'), 'utf8');

assert('Hero contains title "Help & Customer Support"', heroContent.includes('Customer Support'));
assert('Hero contains quick filter chips (Orders, Delivery, Returns, Sizing)', heroContent.includes('Orders') && heroContent.includes('Delivery') && heroContent.includes('Returns') && heroContent.includes('Sizing'));
assert('Hero contains search hub input with id="helpDeskSearchInput"', heroContent.includes('id="helpDeskSearchInput"'));

const dataContent = fs.readFileSync(path.join(rootDir, 'components/help/data.ts'), 'utf8');

assert('DirectDispatchPortal contains quick action links (Stylist Chat & Tracking)', portalContent.includes('/concierge') && portalContent.includes('/tracking'));
assert('DirectDispatchPortal contains 1-click demo inquiry filler', portalContent.includes('id="quickDemoInquiryBtn"'));
assert('DirectDispatchPortal contains required client fields (Name, Email, Message)', portalContent.includes('id="clientName"') && portalContent.includes('id="clientEmail"') && portalContent.includes('id="inquiryMessage"'));
assert('DirectDispatchPortal generates confirmation ticket with copy and reset triggers', portalContent.includes('id="ticketConfirmationBox"') && portalContent.includes('id="copyTicketRefBtn"') && portalContent.includes('id="resetInquiryBtn"'));

assert('HelpFAQAccordion contains category filters and search filtering', faqContent.includes('selectedCategory') && faqContent.includes('searchQuery'));
assert('HelpFAQAccordion contains accordion triggers (.faq-accordion-trigger)', faqContent.includes('faq-accordion-trigger'));
assert('Help page route renders streamlined FAQ & Contact layout', fs.readFileSync(path.join(rootDir, 'app/help/page.tsx'), 'utf8').includes('DirectDispatchPortal') && fs.readFileSync(path.join(rootDir, 'app/help/page.tsx'), 'utf8').includes('HelpFAQAccordion'));

// 5. Live Next.js Server Route Resolution (HTTP 200)
console.log('\n[SECTION 5] Live Route HTTP 200 Verification:');

function checkRoute(urlPath) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:3000${urlPath}`, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body });
      });
    });
    req.on('error', (err) => {
      resolve({ statusCode: 0, error: err.message });
    });
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ statusCode: 0, error: 'Timeout' });
    });
  });
}

(async () => {
  const helpRoute = await checkRoute('/help');
  assert(`GET /help returns HTTP 200 (Got: ${helpRoute.statusCode})`, helpRoute.statusCode === 200);

  const contactRoute = await checkRoute('/contact');
  assert(`GET /contact returns HTTP 200 (Got: ${contactRoute.statusCode})`, contactRoute.statusCode === 200);

  console.log('\n═══════════════════════════════════════════════════════════════════════════════');
  console.log(`Results: ${passedTests} / ${totalTests} assertions passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  if (failedTests === 0) {
    console.log('✨ ALL HELP & CUSTOMER CARE PAGE TESTS PASSED WITH 100% PRECISION!');
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');
    process.exit(0);
  } else {
    console.error(`💥 ${failedTests} TEST FAILURES DETECTED!`);
    console.log('═══════════════════════════════════════════════════════════════════════════════\n');
    process.exit(1);
  }
})();
