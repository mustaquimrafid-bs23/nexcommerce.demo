const assert = require('assert');
const fs = require('fs');

console.log('--- Testing Terms & Conditions (/terms) Page ---');

// 1. Page file exists and has unified background
assert(fs.existsSync('app/terms/page.tsx'), 'app/terms/page.tsx must exist');
const pageContent = fs.readFileSync('app/terms/page.tsx', 'utf8');

assert(pageContent.includes('radial-gradient'), 'Must have unified luxury radial gradient background');
assert(pageContent.includes('Terms') && pageContent.includes('Conditions'), 'Must have clean UK page title');
assert(!pageContent.includes('Maison Terms of Engagement'), 'AI buzzword Maison Terms of Engagement must be replaced');
assert(!pageContent.includes('COMMERCIAL PROTOCOLS'), 'AI buzzword COMMERCIAL PROTOCOLS must be replaced');
assert(pageContent.includes('14-Day Right to Cancel') || pageContent.includes('14-Day Right of Withdrawal'), 'Must have clean 14-day returns title');

// 2. ScrollSpy Component exists and has all 6 articles
assert(fs.existsSync('components/terms/TermsScrollSpy.tsx'), 'TermsScrollSpy.tsx must exist');
const spyContent = fs.readFileSync('components/terms/TermsScrollSpy.tsx', 'utf8');

assert(spyContent.includes('art1') && spyContent.includes('art6'), 'ScrollSpy must contain all article IDs');
assert(spyContent.includes('Table of Contents') || spyContent.includes('Charter Navigation') || spyContent.includes('Navigation'), 'ScrollSpy must have clear title');

console.log('✅ PASS: test-terms-page.js');
