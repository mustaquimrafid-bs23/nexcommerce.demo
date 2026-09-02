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

console.log('🧪 Testing About Page Migration...');

const aboutPagePath = path.resolve(process.cwd(), 'app/about/page.tsx');
assert('app/about/page.tsx exists', fs.existsSync(aboutPagePath));

if (fs.existsSync(aboutPagePath)) {
  const content = fs.readFileSync(aboutPagePath, 'utf8');
  assert('AboutHeroSplit component imported', content.includes('AboutHeroSplit'));
  assert('MaterialsSection component imported', content.includes('MaterialsSection'));
  assert('DisciplinesGrid component imported', content.includes('DisciplinesGrid'));
  assert('CraftTimeline component imported', content.includes('CraftTimeline'));
  assert('GuardiansGrid component imported', content.includes('GuardiansGrid'));
}

const footerPath = path.resolve(process.cwd(), 'components/layout/Footer.tsx');
const footerContent = fs.readFileSync(footerPath, 'utf8');
assert('Footer links to /about', footerContent.includes('href="/about"'));

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
