const assert = require('assert');
const fs = require('fs');

const content = fs.readFileSync('components/about/GuardiansGrid.tsx', 'utf8');

// Assert clean UK titles
assert(content.includes('Our Master Craftsmen') || content.includes('Master Craftsmen') || content.includes('Master Artisans'), 'Must have clean UK title');
assert(!content.includes('The Guardians of Craft'), 'AI buzzword The Guardians of Craft must be replaced');
assert(!content.includes('Pattern Architect'), 'AI title Pattern Architect should be simplified');
assert(!content.includes('Leather Metallurgy'), 'AI buzzword Leather Metallurgy should be simplified');

// Assert artisan names and locations
assert(content.includes('Gianluca Moretti'), 'Must include Gianluca');
assert(content.includes('Éléonore') || content.includes('Eleonore'), 'Must include Eleonore');
assert(content.includes('Lindqvist'), 'Must include Lindqvist');

console.log('✅ PASS: test-about-guardians.js');
