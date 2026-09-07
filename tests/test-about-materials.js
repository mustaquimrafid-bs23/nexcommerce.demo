const assert = require('assert');
const fs = require('fs');

const content = fs.readFileSync('components/about/MaterialsSection.tsx', 'utf8');

// Assert clean UK copy
assert(content.includes('Our Materials & Origins') || content.includes('Our Materials'), 'Must have clean UK title');
assert(content.includes('Zero synthetic fabrics') || content.includes('100% natural and renewable'), 'Must have clean UK natural guarantee');
assert(!content.includes('biologically pure'), 'AI jargon biologically pure must be replaced');
assert(!content.includes('Tactile Provenance'), 'AI buzzword Tactile Provenance must be replaced');

// Assert all 4 noble materials
assert(content.includes('Mongolian Raw Cashmere'), 'Must include Cashmere');
assert(content.includes('Full-Grain Tuscan Calfskin') || content.includes('Tuscan'), 'Must include Tuscan Leather');
assert(content.includes('Aerospace Titanium') || content.includes('Titanium'), 'Must include Titanium');
assert(content.includes('Mulberry Silk') || content.includes('Silk'), 'Must include Silk');

console.log('✅ PASS: test-about-materials.js');
