const assert = require('assert');
const fs = require('fs');

const content = fs.readFileSync('components/about/DisciplinesGrid.tsx', 'utf8');

// Assert clean UK titles and 4 disciplines
assert(content.includes('Four Pillars of Design') || content.includes('Our Four Disciplines') || content.includes('Four Disciplines'), 'Must have clean UK section title');
assert(!content.includes("Maison's Craft Spectrum"), 'AI buzzword must be replaced');
assert(content.includes('Outerwear & Tailoring') || content.includes('Tailoring'), 'Must include Tailoring');
assert(content.includes('Footwear') || content.includes('Artisanal Footwear'), 'Must include Footwear');
assert(content.includes('Acoustics') || content.includes('Sound'), 'Must include Acoustics');
assert(content.includes('Leather Goods') || content.includes('Leather'), 'Must include Leather');

console.log('✅ PASS: test-about-disciplines.js');
