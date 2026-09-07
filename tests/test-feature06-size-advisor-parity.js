const fs = require('fs');
const path = require('path');

console.log('🧪 Running Feature 06: Smart Size & Fit Advisor Parity Test Suite...\n');

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

// 1. Files existence
console.log('1. Verifying Component Architecture & Files...');
const pagePath = path.resolve('app/size-guide/page.tsx');
const visualizerPath = path.resolve('components/size-guide/AnatomicalVisualizer.tsx');
const matrixPath = path.resolve('components/size-guide/SizeConversionMatrix.tsx');
const guidePath = path.resolve('components/size-guide/MeasurementGuide.tsx');
const featureGuidePath = path.resolve('app/guide/page.tsx');

assert('app/size-guide/page.tsx exists', fs.existsSync(pagePath));
assert('components/size-guide/AnatomicalVisualizer.tsx exists', fs.existsSync(visualizerPath));
assert('components/size-guide/SizeConversionMatrix.tsx exists', fs.existsSync(matrixPath));
assert('components/size-guide/MeasurementGuide.tsx exists', fs.existsSync(guidePath));
assert('app/guide/page.tsx exists', fs.existsSync(featureGuidePath));

const pageContent = fs.readFileSync(pagePath, 'utf8');
const vizContent = fs.readFileSync(visualizerPath, 'utf8');
const matrixContent = fs.readFileSync(matrixPath, 'utf8');
const guideContent = fs.readFileSync(guidePath, 'utf8');
const featureGuideContent = fs.readFileSync(featureGuidePath, 'utf8');

// 2. Brand guidelines and background gradient
console.log('\n2. Verifying Brand Guidelines & Background Palette...');
assert('Strict brand background radial gradient present', pageContent.includes('radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)'));
assert('Hero has Sartorial Precision / Atelier Fit Engine tag', pageContent.includes('Sartorial Precision') && pageContent.includes('Atelier Fit Engine'));
assert('Hero has clean title "Your Anatomical Size, Perfected"', pageContent.includes('Your Anatomical Size, Perfected'));

// 3. Anatomical Visualizer & 2D Silhouette Stage
console.log('\n3. Verifying 2D Silhouette Stage & Tape Animations...');
assert('SVG Silhouette Stage present with #sgGrid pattern', vizContent.includes('id="sgGrid"') || vizContent.includes('sgGrid'));
assert('Animated marching tape line styles defined', vizContent.includes('tape-march') && vizContent.includes('meas-tape-line'));
assert('Height ruler guide with label present', vizContent.includes('line x1="28"') || vizContent.includes('height'));
assert('Shoulder measurement tape and chip (#A78BFA) present', vizContent.includes('#A78BFA') && vizContent.includes('SHOULDER'));
assert('Chest measurement tape and chip (#3DE0FF) present', vizContent.includes('#3DE0FF') && vizContent.includes('CHEST'));
assert('Waist measurement tape and chip (#34D399) present', vizContent.includes('#34D399') && vizContent.includes('WAIST'));
assert('Recommended Atelier Size card present', vizContent.includes('Recommended Atelier Size'));

// 4. Interactive Calibrator Controls & 4 Sliders
console.log('\n4. Verifying Interactive Calibrator Sliders & Drape Modes...');
assert('Interactive Calibrator heading present', vizContent.includes('Interactive Calibrator') && vizContent.includes('Adjust Your Measurements'));
assert('Unit toggle supporting CM and IN present', vizContent.includes('CM') && vizContent.includes('IN'));
assert('Height slider (150-205) with icon and description present', vizContent.includes('min={150}') && vizContent.includes('max={205}') && vizContent.includes('Standing barefoot, vertical'));
assert('Chest slider (80-130) with icon and description present', vizContent.includes('min={80}') && vizContent.includes('max={130}') && vizContent.includes('Around fullest chest point'));
assert('Waist slider (65-120) with icon and description present', vizContent.includes('min={65}') && vizContent.includes('max={120}') && vizContent.includes('Narrowest point at natural waistline'));
assert('Shoulder slider (36-58, step 0.5) present', vizContent.includes('min={36}') && vizContent.includes('max={58}') && vizContent.includes('step={0.5}'));
assert('Drape Silhouette modes (Fitted, Regular, Relaxed) present', vizContent.includes('Fitted Structure') && vizContent.includes('Regular Tailored') && vizContent.includes('Relaxed Architecture'));
assert('Shop Apparel CTA link to /category?cat=apparel present', vizContent.includes('href="/category?cat=apparel"'));
assert('Save to Profile CTA with localStorage feedback present', vizContent.includes('Save to Profile') && vizContent.includes('localStorage.setItem'));

// 5. How to Measure (4 Precision Anatomical Metrics cards)
console.log('\n5. Verifying How to Measure Anatomical Metrics...');
assert('Section heading "How to Measure" present', guideContent.includes('How to Measure') && guideContent.includes('Precision Anatomical Metrics'));
assert('Card 01 Chest Circumference present', guideContent.includes('Chest Circumference') && guideContent.includes('01'));
assert('Card 02 Shoulder Breadth present', guideContent.includes('Shoulder Breadth') && guideContent.includes('02'));
assert('Card 03 Natural Waistline present', guideContent.includes('Natural Waistline') && guideContent.includes('03'));
assert('Card 04 Foot Length present', guideContent.includes('Foot Length') && guideContent.includes('04'));

// 6. Size Conversion Chart (Interactive Visual Size Cards Grid)
console.log('\n6. Verifying Visual Size Cards Grid & "Your Size" Badges...');
assert('Section heading "Size Conversion Chart" present', matrixContent.includes('Size Conversion Chart') && matrixContent.includes('Global Equivalency'));
assert('Tabs for Coats, Trousers, and Footwear present', matrixContent.includes('Coats &') && matrixContent.includes('Tailored Trousers') && matrixContent.includes('Artisanal Footwear'));
assert('Apparel card grid with EU sizes and measurements present', matrixContent.includes('APPAREL_MATRIX') && matrixContent.includes('44') && matrixContent.includes('54'));
assert('Trousers grid with Waist and Inseam present', matrixContent.includes('TROUSERS_SIZES') && matrixContent.includes('Inseam'));
assert('Footwear grid with EU, UK, US, and foot length present', matrixContent.includes('FOOTWEAR_SIZES') && matrixContent.includes('eu: 40'));
assert('Dynamic "✦ Your Size" recommendation badge rendered', matrixContent.includes('✦ Your Size'));

// 7. Bespoke Advisor (Concierge Bridge)
console.log('\n7. Verifying Bespoke Advisor Concierge Bridge...');
assert('Bespoke Advisor heading present', pageContent.includes('Bespoke Advisor') && pageContent.includes('Not sure about your size?'));
assert('Consult Private Concierge button present', pageContent.includes('Consult Private Concierge'));

// 8. Cross-Page Feature Guide Linkage
console.log('\n8. Verifying Feature Guide Page Parity...');
assert('Feature 06 in app/guide/page.tsx has title "Smart Size & Fit Advisor"', featureGuideContent.includes("title: 'Smart Size & Fit Advisor'"));
assert('Feature 06 in app/guide/page.tsx links to /size-guide', featureGuideContent.includes("href: '/size-guide'"));
assert('Feature 06 has verified real example', featureGuideContent.includes('Chest 98cm + Waist 82cm'));

console.log(`\n✨ Parity Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
