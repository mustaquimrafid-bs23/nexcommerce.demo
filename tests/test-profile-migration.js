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

console.log('🧪 Testing Style DNA Profile Page Migration...');

const profilePagePath = path.resolve(process.cwd(), 'app/profile/page.tsx');
assert('app/profile/page.tsx exists', fs.existsSync(profilePagePath));

const stepperPath = path.resolve(process.cwd(), 'components/profile/StyleDNAStepper.tsx');
assert('components/profile/StyleDNAStepper.tsx exists', fs.existsSync(stepperPath));

const recsPath = path.resolve(process.cwd(), 'components/profile/ActiveStyleRecommendations.tsx');
assert('components/profile/ActiveStyleRecommendations.tsx exists', fs.existsSync(recsPath));

if (fs.existsSync(profilePagePath)) {
  const content = fs.readFileSync(profilePagePath, 'utf8');
  assert('Profile has StyleDNAStepper', content.includes('StyleDNAStepper'));
  assert('Profile has ActiveStyleRecommendations', content.includes('ActiveStyleRecommendations'));
  assert('Profile has Calibration score display', content.includes('Calibration') || content.includes('calibrationScore'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
