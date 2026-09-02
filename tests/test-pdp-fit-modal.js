// tests/test-pdp-fit-modal.js
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Testing PDP Interactive AI Fit Assistant Modal (Batch 11)...');

const modalPath = path.resolve(process.cwd(), 'components/product/AIFitModal.tsx');
const pdpPath = path.resolve(process.cwd(), 'app/product/[id]/page.tsx');

assert(fs.existsSync(modalPath), 'components/product/AIFitModal.tsx must exist');
assert(fs.existsSync(pdpPath), 'app/product/[id]/page.tsx must exist');

const modalContent = fs.readFileSync(modalPath, 'utf8');
const pdpContent = fs.readFileSync(pdpPath, 'utf8');

// 1. Structural IDs & Accessibility Attributes
assert(modalContent.includes('pdpFitModal'), 'Must include #pdpFitModal identifier');
assert(modalContent.includes('btnCloseFitModal'), 'Must include #btnCloseFitModal close button');
assert(modalContent.includes('btnUseRecSize'), 'Must include #btnUseRecSize apply button');
assert(modalContent.includes('role="dialog"'), 'Must have role="dialog"');
assert(modalContent.includes('aria-modal="true"'), 'Must have aria-modal="true"');

// 2. Sizing Inputs & Parameters
assert(modalContent.includes('Height (cm)'), 'Must have Height (cm) label and input');
assert(modalContent.includes('Weight (kg)'), 'Must have Weight (kg) label and input');
assert(
  modalContent.includes('Tailored') && modalContent.includes('Regular') && modalContent.includes('Relaxed'),
  'Must support Tailored, Regular, and Relaxed fit options'
);

// 3. Simple British English Copy (Zero AI Jargon)
assert(!modalContent.includes('Anatomical Match'), 'Must NOT include pseudo-academic "Anatomical Match"');
assert(!modalContent.includes('Neural'), 'Must NOT include "Neural"');
assert(!modalContent.includes('Calibrator'), 'Must NOT include "Calibrator" in user-facing text');
assert(!modalContent.includes('silhouette ease'), 'Must NOT include awkward "silhouette ease"');
assert(modalContent.includes('Find My Size') || modalContent.includes('Find Your Size'), 'Must use clear plain title');

// 4. Motion & Animation Integration
assert(modalContent.includes('motion') || modalContent.includes('AnimatePresence'), 'Must include Motion animations for fluid transitions');

// 5. PDP Page Integration
assert(pdpContent.includes('AIFitModal'), 'PDP page must import and render AIFitModal');
assert(pdpContent.includes('isFitModalOpen'), 'PDP page must manage isFitModalOpen state');
assert(pdpContent.includes('setIsFitModalOpen(true)'), 'PDP page must wire trigger button to open modal');

console.log('✅ PASS: All PDP AI Fit Assistant tests passed successfully!');
