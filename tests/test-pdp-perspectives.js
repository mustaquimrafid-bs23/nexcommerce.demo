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

console.log('🧪 Testing PDP 3-Perspective Switcher & Spec Badges...');

const perspectivePath = path.resolve(process.cwd(), 'components/product/PerspectiveSwitcher.tsx');
assert('components/product/PerspectiveSwitcher.tsx exists', fs.existsSync(perspectivePath));

const specBadgesPath = path.resolve(process.cwd(), 'components/product/SpecBadgesGrid.tsx');
assert('components/product/SpecBadgesGrid.tsx exists', fs.existsSync(specBadgesPath));

const pdpPath = path.resolve(process.cwd(), 'app/product/[id]/page.tsx');
assert('app/product/[id]/page.tsx exists', fs.existsSync(pdpPath));

if (fs.existsSync(perspectivePath)) {
  const content = fs.readFileSync(perspectivePath, 'utf8');
  assert('PerspectiveSwitcher has Silhouette mode', content.includes('silhouette') || content.includes('Silhouette'));
  assert('PerspectiveSwitcher has Model mode', content.includes('model') || content.includes('Model'));
  assert('PerspectiveSwitcher has Macro mode', content.includes('macro') || content.includes('Macro') || content.includes('Detail'));
}

if (fs.existsSync(specBadgesPath)) {
  const content = fs.readFileSync(specBadgesPath, 'utf8');
  assert('SpecBadgesGrid displays artisanal specs', content.includes('spec') || content.includes('Material') || content.includes('Origin'));
}

if (fs.existsSync(pdpPath)) {
  const pdpContent = fs.readFileSync(pdpPath, 'utf8');
  assert('PDP mounts PerspectiveSwitcher or SpecBadgesGrid', pdpContent.includes('PerspectiveSwitcher') || pdpContent.includes('SpecBadgesGrid'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
