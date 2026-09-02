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

console.log('🧪 Testing Size Guide & Fit Calibrator Migration...');

const sizeGuidePath = path.resolve(process.cwd(), 'app/size-guide/page.tsx');
assert('app/size-guide/page.tsx exists', fs.existsSync(sizeGuidePath));

const visualizerPath = path.resolve(process.cwd(), 'components/size-guide/AnatomicalVisualizer.tsx');
assert('components/size-guide/AnatomicalVisualizer.tsx exists', fs.existsSync(visualizerPath));

const matrixPath = path.resolve(process.cwd(), 'components/size-guide/SizeConversionMatrix.tsx');
assert('components/size-guide/SizeConversionMatrix.tsx exists', fs.existsSync(matrixPath));

const guidePath = path.resolve(process.cwd(), 'components/size-guide/MeasurementGuide.tsx');
assert('components/size-guide/MeasurementGuide.tsx exists', fs.existsSync(guidePath));

if (fs.existsSync(sizeGuidePath)) {
  const content = fs.readFileSync(sizeGuidePath, 'utf8');
  assert('SizeGuide has AnatomicalVisualizer', content.includes('AnatomicalVisualizer'));
  assert('SizeGuide has SizeConversionMatrix', content.includes('SizeConversionMatrix'));
  assert('SizeGuide has MeasurementGuide', content.includes('MeasurementGuide'));
}

const pdpPath = path.resolve(process.cwd(), 'app/product/[id]/page.tsx');
if (fs.existsSync(pdpPath)) {
  const pdpContent = fs.readFileSync(pdpPath, 'utf8');
  assert('PDP links to /size-guide', pdpContent.includes('href="/size-guide"'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
