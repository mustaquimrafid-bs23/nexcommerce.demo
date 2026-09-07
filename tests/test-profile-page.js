const assert = require('assert');
const fs = require('fs');

console.log('--- Testing Style DNA Studio (/profile) Suite ---');

// 1. Check page and components exist
assert(fs.existsSync('app/profile/page.tsx'), 'app/profile/page.tsx must exist');
assert(fs.existsSync('components/profile/StyleDNAStepper.tsx'), 'StyleDNAStepper.tsx must exist');
assert(fs.existsSync('components/profile/ActiveStyleRecommendations.tsx'), 'ActiveStyleRecommendations.tsx must exist');

const pageContent = fs.readFileSync('app/profile/page.tsx', 'utf8');
assert(pageContent.includes('radial-gradient'), 'Page must have uniform luxury radial gradient background');
assert(!pageContent.includes('neural stylist'), 'AI jargon neural stylist must be replaced');
assert(!pageContent.includes('Neural Style'), 'AI jargon Neural Style must be replaced');
assert(pageContent.includes('Style DNA') || pageContent.includes('Style Preferences'), 'Must have clean title');

const stepperContent = fs.readFileSync('components/profile/StyleDNAStepper.tsx', 'utf8');
assert(stepperContent.includes('Minimalist Tailoring'), 'Must contain everyday style cards');
assert(stepperContent.includes('Relaxed Luxury'), 'Must contain Relaxed Luxury style');
assert(stepperContent.includes('Contemporary Techwear'), 'Must contain Contemporary Techwear');
assert(stepperContent.includes('Heritage Leather'), 'Must contain Heritage Leather style');
assert(stepperContent.includes('Fitted (Slim)') || stepperContent.includes('Classic Fit'), 'Must have clean UK fit names');

const recsContent = fs.readFileSync('components/profile/ActiveStyleRecommendations.tsx', 'utf8');
assert(recsContent.includes('Add to Bag'), 'Must have 1-Click Add to Bag button');
assert(recsContent.includes('MASTER_PRODUCTS'), 'Must filter against master products');

console.log('✅ PASS: test-profile-page.js');
