const assert = require('assert');
const fs = require('fs');

const content = fs.readFileSync('components/about/AboutHeroSplit.tsx', 'utf8');

// Assert UK English copy
assert(content.includes('Our Story & Philosophy') || content.includes('Our Story'), 'Must have clean UK English tag');
assert(content.includes('Timeless style, crafted to endure') || content.includes('crafted to endure'), 'Must have clean UK headline');
assert(!content.includes('architecture of quiet elegance'), 'AI buzzword must be replaced');
assert(!content.includes('Maison Manifesto'), 'AI buzzword Maison Manifesto should be replaced');

// Assert quick jump anchors
assert(content.includes('#materials'), 'Must link to #materials');
assert(content.includes('#hotspots'), 'Must link to #hotspots');
assert(content.includes('#disciplines'), 'Must link to #disciplines');
assert(content.includes('#timeline'), 'Must link to #timeline');
assert(content.includes('#provenance'), 'Must link to #provenance');
assert(content.includes('#guardians'), 'Must link to #guardians');

console.log('✅ PASS: test-about-hero.js');
