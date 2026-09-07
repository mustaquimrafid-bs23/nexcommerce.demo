const assert = require('assert');
const fs = require('fs');

assert(fs.existsSync('components/about/ProvenanceLedger.tsx'), 'ProvenanceLedger.tsx must exist');
const content = fs.readFileSync('components/about/ProvenanceLedger.tsx', 'utf8');

// Assert clean UK titles and 4 dials
assert(content.includes('Our Standards & Promises') || content.includes('Our Standards'), 'Must have clean UK title');
assert(content.includes('100%') && content.includes('0%') && content.includes('25 YR'), 'Must include statistic dials');
assert(!content.includes('Infographic Provenance & Care Dials'), 'AI buzzword must be replaced');

// Assert page mounts ProvenanceLedger
const pageContent = fs.readFileSync('app/about/page.tsx', 'utf8');
assert(pageContent.includes('ProvenanceLedger'), 'app/about/page.tsx must mount ProvenanceLedger');

console.log('✅ PASS: test-about-provenance.js');
