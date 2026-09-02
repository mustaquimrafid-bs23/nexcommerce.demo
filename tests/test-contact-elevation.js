/**
 * Automated Verification Suite for Batch 18:
 * Client Services Desk & Atelier Directory Elevation
 */

const fs = require('fs');
const path = require('path');

let passes = 0;
let failures = 0;

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
console.log('🧪 BATCH 18: CLIENT SERVICES & ATELIER DIRECTORY SUITE');
console.log('====================================================\n');

// 1. Verify Component Files Exist
const contactPath = path.join(__dirname, '..', 'app', 'contact', 'page.tsx');
assert(fs.existsSync(contactPath), 'app/contact/page.tsx exists');

const channelsPath = path.join(__dirname, '..', 'components', 'contact', 'ServiceChannelsGrid.tsx');
assert(fs.existsSync(channelsPath), 'components/contact/ServiceChannelsGrid.tsx exists');

const ticketPath = path.join(__dirname, '..', 'components', 'contact', 'TicketDispatcherCard.tsx');
assert(fs.existsSync(ticketPath), 'components/contact/TicketDispatcherCard.tsx exists');

const atelierPath = path.join(__dirname, '..', 'components', 'contact', 'AteliersDirectory.tsx');
assert(fs.existsSync(atelierPath), 'components/contact/AteliersDirectory.tsx exists');

// 2. Service Channels Integrity
if (fs.existsSync(channelsPath)) {
  const content = fs.readFileSync(channelsPath, 'utf8');
  assert(
    content.includes('wa.me') || content.includes('WhatsApp'),
    'ServiceChannelsGrid contains direct WhatsApp link'
  );
  assert(
    content.includes('useConciergeStore') || content.includes('openConcierge') || content.includes('Styling'),
    'ServiceChannelsGrid supports styling concierge interaction'
  );
}

// 3. Ticket Dispatcher Integrity
if (fs.existsSync(ticketPath)) {
  const content = fs.readFileSync(ticketPath, 'utf8');
  assert(
    content.includes('quickDemoInquiryBtn') || content.includes('handleQuickDemo'),
    'TicketDispatcherCard contains 1-click demo inquiry autofill'
  );
  assert(
    content.includes('styling') && content.includes('bespoke') && content.includes('logistics'),
    'TicketDispatcherCard contains domain selection pills'
  );
  assert(
    content.includes('ticketConfirmationBox') || content.includes('copyTicketRefBtn'),
    'TicketDispatcherCard contains ticket reference confirmation box and copy button'
  );
}

// 4. Physical Ateliers Directory Integrity
if (fs.existsSync(atelierPath)) {
  const content = fs.readFileSync(atelierPath, 'utf8');
  assert(
    content.includes('Paris') && content.includes('Milan') && content.includes('London'),
    'AteliersDirectory contains flagship salon locations'
  );
  assert(
    content.includes('tel:') || content.includes('Phone'),
    'AteliersDirectory includes verified telephone links'
  );
  assert(
    content.includes('FAQ') || content.includes('faq') || content.includes('Frequently Asked Questions') || content.includes('accordion'),
    'AteliersDirectory contains interactive FAQ section'
  );
}

// 5. Plain British English Copywriting (Zero AI Jargon)
const allContactFiles = [contactPath, channelsPath, ticketPath, atelierPath];
const forbidden = [
  /\bAI\b/i,
  /\bArtificial Intelligence\b/i,
  /\bneural\b/i,
  /\bautonomous\b/i,
  /\bheuristic\b/i,
  /\bsynthesize\b/i,
  /\bhallucinate\b/i,
];

for (const f of allContactFiles) {
  if (fs.existsSync(f)) {
    const text = fs.readFileSync(f, 'utf8');
    for (const pattern of forbidden) {
      assert(
        !text.match(pattern),
        `${path.basename(f)} is free of forbidden buzzword: ${pattern.toString()}`
      );
    }
  }
}

// 6. Unified Background Token Check
if (fs.existsSync(contactPath)) {
  const pageContent = fs.readFileSync(contactPath, 'utf8');
  assert(
    pageContent.includes('#01132B'),
    'app/contact/page.tsx uses unified Atelier Obsidian Navy base #01132B'
  );
}

console.log('\n====================================================');
console.log(`Audited Passes: ${passes}, Failures: ${failures}`);
console.log('====================================================\n');

if (failures > 0) {
  process.exit(1);
} else {
  console.log('🎉 ALL BATCH 18 CONTACT ELEVATION INVARIANTS PASSED!');
  process.exit(0);
}
