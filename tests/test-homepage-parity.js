const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 16: PAGE-01 Homepage Parity Test...\n');

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

const pagePath = path.resolve('app/page.tsx');
const heroPath = path.resolve('components/home/HeroSection.tsx');
const dealsPath = path.resolve('components/home/DealsSection.tsx');
const intentPath = path.resolve('components/home/IntentSearchCard.tsx');
const gridPath = path.resolve('components/home/ProductGrid.tsx');
const bannerPath = path.resolve('components/home/EditorialBanner.tsx');

assert('app/page.tsx exists', fs.existsSync(pagePath));
assert('components/home/HeroSection.tsx exists', fs.existsSync(heroPath));
assert('components/home/DealsSection.tsx exists', fs.existsSync(dealsPath));
assert('components/home/IntentSearchCard.tsx exists', fs.existsSync(intentPath));
assert('components/home/ProductGrid.tsx exists', fs.existsSync(gridPath));
assert('components/home/EditorialBanner.tsx exists', fs.existsSync(bannerPath));

const pageContent = fs.readFileSync(pagePath, 'utf8');
const dealsContent = fs.readFileSync(dealsPath, 'utf8');
const intentContent = fs.readFileSync(intentPath, 'utf8');
const bannerContent = fs.readFileSync(bannerPath, 'utf8');

// 1. Page mounts all core home sections
assert('Mounts HeroSection, DealsSection, IntentSearchCard, ProductGrid, EditorialBanner', 
  pageContent.includes('HeroSection') &&
  pageContent.includes('DealsSection') &&
  pageContent.includes('IntentSearchCard') &&
  pageContent.includes('ProductGrid') &&
  pageContent.includes('EditorialBanner')
);

// 2. DealsSection includes flash countdown and quick add
assert('DealsSection contains countdown timer and quick add', 
  (dealsContent.includes('dealHours') || dealsContent.includes('hours') || dealsContent.includes('Countdown')) &&
  dealsContent.includes('Quick Add') || dealsContent.includes('quick-add') || dealsContent.includes('addItem')
);

// 3. IntentSearchCard has search prompt chips
assert('IntentSearchCard contains prompt chips', 
  intentContent.includes('Dinner outfit') || intentContent.includes('Weekend trip') || intentContent.includes('Popular Prompts')
);

// 4. Editorial Banner contains smart vision hotspot pin
assert('EditorialBanner contains interactive hotspot pin', 
  bannerContent.includes('hotspot') || bannerContent.includes('Hotspot') || bannerContent.includes('pin')
);

console.log(`\nBatch 16 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
