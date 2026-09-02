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

console.log('🧪 Testing Contact & Advisory Page Elevation...');

const contactPath = path.resolve(process.cwd(), 'app/contact/page.tsx');
assert('app/contact/page.tsx exists', fs.existsSync(contactPath));

const content = fs.readFileSync(contactPath, 'utf8');
assert('Contact is not merely re-exporting help page', !content.includes("export { default } from '@/app/help/page'"));

const channelsPath = path.resolve(process.cwd(), 'components/contact/ServiceChannelsGrid.tsx');
assert('components/contact/ServiceChannelsGrid.tsx exists', fs.existsSync(channelsPath));

const ticketPath = path.resolve(process.cwd(), 'components/contact/TicketDispatcherCard.tsx');
assert('components/contact/TicketDispatcherCard.tsx exists', fs.existsSync(ticketPath));

const atelierPath = path.resolve(process.cwd(), 'components/contact/AteliersDirectory.tsx');
assert('components/contact/AteliersDirectory.tsx exists', fs.existsSync(atelierPath));

if (fs.existsSync(contactPath)) {
  assert('Contact has ServiceChannelsGrid', content.includes('ServiceChannelsGrid'));
  assert('Contact has TicketDispatcherCard', content.includes('TicketDispatcherCard'));
  assert('Contact has AteliersDirectory', content.includes('AteliersDirectory'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
