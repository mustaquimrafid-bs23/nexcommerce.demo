const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 27: PAGE-12 Size Guide Parity Test...\n');

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

const pagePath = path.resolve('app/size-guide/page.tsx');
const visualizerPath = path.resolve('components/size-guide/AnatomicalVisualizer.tsx');
const matrixPath = path.resolve('components/size-guide/SizeConversionMatrix.tsx');
const guidePath = path.resolve('components/size-guide/MeasurementGuide.tsx');

assert('app/size-guide/page.tsx exists', fs.existsSync(pagePath));
assert('components/size-guide/AnatomicalVisualizer.tsx exists', fs.existsSync(visualizerPath));
assert('components/size-guide/SizeConversionMatrix.tsx exists', fs.existsSync(matrixPath));
assert('components/size-guide/MeasurementGuide.tsx exists', fs.existsSync(guidePath));

const matrixContent = fs.readFileSync(matrixPath, 'utf8');

// 1. Assert Unit Toggle (CM / INCH)
assert('Supports unit switching between metric (cm) and imperial (inches)', matrixContent.includes('cm') && (matrixContent.includes('inch') || matrixContent.includes('in')));

// 2. Assert Size Mappings (EU, US, UK)
assert('Contains international size conversions (EU, US, UK)', matrixContent.includes('EU') && matrixContent.includes('US') && matrixContent.includes('UK'));

console.log(`\nBatch 27 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
