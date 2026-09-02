const assert = require('assert');
const fs = require('fs');

console.log('--- Testing Size & Fit Guide (/size-guide) Page ---');

// 1. Page exists and has unified background & UK copy
assert(fs.existsSync('app/size-guide/page.tsx'), 'app/size-guide/page.tsx must exist');
const pageContent = fs.readFileSync('app/size-guide/page.tsx', 'utf8');

assert(pageContent.includes('radial-gradient'), 'Must have unified luxury radial gradient background');
assert(pageContent.includes('Size') && pageContent.includes('Fit Guide'), 'Must have clean UK title');
assert(!pageContent.includes('Atelier Fit Architecture'), 'AI buzzword Atelier Fit Architecture must be replaced');

// 2. Anatomical Visualizer component checks
assert(fs.existsSync('components/size-guide/AnatomicalVisualizer.tsx'), 'AnatomicalVisualizer.tsx must exist');
const vizContent = fs.readFileSync('components/size-guide/AnatomicalVisualizer.tsx', 'utf8');

assert(vizContent.includes('svg') || vizContent.includes('SVG'), 'Must have SVG silhouette stage');
assert(vizContent.includes('silhouette') || vizContent.includes('Silhouette') || vizContent.includes('mannequin') || vizContent.includes('Mannequin'), 'Must have visual mannequin');
assert(vizContent.includes('chest') && vizContent.includes('waist') && vizContent.includes('height'), 'Must have measurement sliders');
assert(!vizContent.includes('Biometric Calibrator'), 'AI buzzword Biometric Calibrator must be replaced');

// 3. Conversion Matrix checks
assert(fs.existsSync('components/size-guide/SizeConversionMatrix.tsx'), 'SizeConversionMatrix.tsx must exist');
const matrixContent = fs.readFileSync('components/size-guide/SizeConversionMatrix.tsx', 'utf8');
assert(matrixContent.includes('APPAREL_MATRIX') || matrixContent.includes('EU') || matrixContent.includes('Chest'), 'Must have conversion tables');

// 4. Measurement Guide checks
assert(fs.existsSync('components/size-guide/MeasurementGuide.tsx'), 'MeasurementGuide.tsx must exist');
const guideContent = fs.readFileSync('components/size-guide/MeasurementGuide.tsx', 'utf8');
assert(guideContent.includes('Chest') && guideContent.includes('Waist'), 'Must have measurement steps');

console.log('✅ PASS: test-size-guide-page.js');
