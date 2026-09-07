const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const BATCHES = [
  { id: 'Batch 1', name: '404 Luxury Recovery Gateway', script: 'tests/test-not-found-migration.js' },
  { id: 'Batch 2', name: 'Zero-Knowledge Cookie Consent Banner', script: 'tests/test-cookie-consent.js' },
  { id: 'Batch 3', name: 'Dual Currency Switcher (EUR/BDT)', script: 'tests/test-currency-switcher.js' },
  { id: 'Batch 4', name: 'Maison Heritage Manifesto & Materials', script: 'tests/test-about-page-migration.js' },
  { id: 'Batch 5', name: 'Terms of Engagement with Scroll-Spy', script: 'tests/test-terms-migration.js' },
  { id: 'Batch 6', name: 'Anatomical Size Guide & Calibrator', script: 'tests/test-size-guide-migration.js' },
  { id: 'Batch 7', name: 'Client Sign-In (1-Click Demo SSO)', script: 'tests/test-signin-page.js' },
  { id: 'Batch 8', name: 'Client Sign-Up (Live Strength Meter)', script: 'tests/test-signup-page.js' },
  { id: 'Batch 9', name: 'Client Style DNA Profile Studio', script: 'tests/test-profile-migration.js' },
  { id: 'Batch 10', name: 'PDP 3-Perspective Switcher & Badges', script: 'tests/test-pdp-perspectives.js' },
  { id: 'Batch 11', name: 'PDP AI Fit & Size Consultation Modal', script: 'tests/test-pdp-fit-modal.js' },
  { id: 'Batch 12', name: 'PDP Complete Look Bundle & Sticky Bar', script: 'tests/test-pdp-bundle-sticky.js' },
  { id: 'Batch 13', name: 'PLP Quick-Look Mini-PDP Drawer', script: 'tests/test-category-quicklook.js' },
  { id: 'Batch 14', name: 'Cart Hero Stats & Bulk Depletion', script: 'tests/test-cart-elevation.js' },
  { id: 'Batch 15', name: 'Checkout bKash / Nagad MFS PIN Sheet', script: 'tests/test-checkout-mfs.js' },
  { id: 'Batch 16', name: 'Checkout Savings Optimizer Banner', script: 'tests/test-savings-optimizer.js' },
  { id: 'Batch 17', name: 'Courier Tracking AI Logistics Assistant', script: 'tests/test-tracking-page-migration.js' },
  { id: 'Batch 18', name: 'Client Services Desk & Boutique Directory', script: 'tests/test-contact-elevation.js' },
  { id: 'Batch 19', name: 'Global Dark Store Gate & Delivery Hub Pill', script: 'tests/test-delivery-gate-global.js' },
  { id: 'Batch 20A', name: 'Multimodal Visual Search Modal', script: 'tests/test-visual-search-modal.js' },
  { id: 'Batch 20B', name: 'Product Comparison Spec Matrix Modal', script: 'tests/test-comparison-modal.js' },
  { id: 'Batch 20C', name: 'Cart Recovery 15-Minute Hold Modal', script: 'tests/test-cart-recovery-modal.js' },
  { id: 'Batch 20D', name: 'Subsystem Bridges (Wishlist, Discovery, SmartList, Concierge)', script: 'tests/test-subsystem-features.js' },
];

console.log('═══════════════════════════════════════════════════════════════════════════════');
console.log(' 🚀 20-BATCH NEXT.JS STOREFRONT MASTER MIGRATION & SQA VERIFICATION AUDIT');
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

let passed = 0;
let failed = 0;

for (const batch of BATCHES) {
  const fullPath = path.resolve(process.cwd(), batch.script);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ [${batch.id}] ${batch.name} -> Test file missing: ${batch.script}`);
    failed++;
    continue;
  }

  try {
    const output = execSync(`node "${fullPath}"`, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'] });
    console.log(`✅ [${batch.id}] ${batch.name}`);
    passed++;
  } catch (err) {
    console.error(`❌ [${batch.id}] ${batch.name} FAILED`);
    if (err.stdout) console.error(err.stdout.toString());
    if (err.stderr) console.error(err.stderr.toString());
    failed++;
  }
}

console.log('\n═══════════════════════════════════════════════════════════════════════════════');
console.log(` 📊 SUMMARY: ${passed} / ${BATCHES.length} Batches PASSED (${failed} failures)`);
console.log('═══════════════════════════════════════════════════════════════════════════════\n');

if (failed > 0) {
  process.exit(1);
} else {
  console.log('🎉 100% OF ALL 20 STOREFRONT ELEVATION & FEATURE BATCHES VERIFIED SUCCESSFULLY!\n');
  process.exit(0);
}
