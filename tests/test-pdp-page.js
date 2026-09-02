const assert = require('assert');
const fs = require('fs');

console.log('--- Testing Product Detail Page (/product/[id]) Suite ---');

// 1. Check page and components exist
assert(fs.existsSync('app/product/[id]/page.tsx'), 'app/product/[id]/page.tsx must exist');
assert(fs.existsSync('components/product/PerspectiveSwitcher.tsx'), 'PerspectiveSwitcher.tsx must exist');
assert(fs.existsSync('components/product/SpecBadgesGrid.tsx'), 'SpecBadgesGrid.tsx must exist');

const pageContent = fs.readFileSync('app/product/[id]/page.tsx', 'utf8');
assert(pageContent.includes('radial-gradient'), 'Page must have uniform luxury radial gradient background');
assert(!pageContent.includes('Neural Style'), 'AI jargon Neural Style must be replaced');
assert(!pageContent.includes('Biometric Calibrator'), 'AI jargon Biometric Calibrator must be replaced');
assert(pageContent.includes('Add to Bag') || pageContent.includes('Add to Cart'), 'Must have Add to Bag button');
assert(pageContent.includes('galleryImages'), 'Must support multi-angle gallery');

const switcherContent = fs.readFileSync('components/product/PerspectiveSwitcher.tsx', 'utf8');
assert(switcherContent.includes('Studio Silhouette') || switcherContent.includes('Silhouette'), 'Must have studio silhouette option');
assert(switcherContent.includes('Editorial Look') || switcherContent.includes('Model'), 'Must have editorial look option');

console.log('✅ PASS: test-pdp-page.js');
