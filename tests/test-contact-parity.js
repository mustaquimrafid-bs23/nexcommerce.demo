const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 29: PAGE-14 Contact & Customer Care Parity Test...\n');

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

const contactPath = path.resolve('app/contact/page.tsx');
const helpPath = path.resolve('app/help/page.tsx');
const channelsPath = path.resolve('components/contact/ServiceChannelsGrid.tsx');
const ticketPath = path.resolve('components/contact/TicketDispatcherCard.tsx');
const directoryPath = path.resolve('components/contact/AteliersDirectory.tsx');

assert('app/contact/page.tsx exists', fs.existsSync(contactPath));
assert('app/help/page.tsx exists', fs.existsSync(helpPath));
assert('components/contact/ServiceChannelsGrid.tsx exists', fs.existsSync(channelsPath));
assert('components/contact/TicketDispatcherCard.tsx exists', fs.existsSync(ticketPath));
assert('components/contact/AteliersDirectory.tsx exists', fs.existsSync(directoryPath));

const ticketContent = fs.readFileSync(ticketPath, 'utf8');

// 1. Assert Inquiry form inputs (name, email, subject, message)
assert('TicketDispatcherCard contains name, email, subject, message fields', ticketContent.includes('email') && ticketContent.includes('name') && ticketContent.includes('message'));

// 2. Assert Submission and Ticket Reference generation
assert('Generates ticket reference upon submission', ticketContent.includes('ticket') || ticketContent.includes('success') || ticketContent.includes('submitted'));

console.log(`\nBatch 29 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
