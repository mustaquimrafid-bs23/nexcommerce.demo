const assert = require('assert');
const fs = require('fs');

assert(fs.existsSync('components/about/HotspotViewer.tsx'), 'HotspotViewer.tsx must exist');
const content = fs.readFileSync('components/about/HotspotViewer.tsx', 'utf8');

// Assert UK English and features
assert(content.includes('Explore Our Craftsmanship') || content.includes('Craftsmanship'), 'Must have clean UK section title');
assert(content.includes('Floating Canvas') || content.includes('Canvas'), 'Must have Floating Canvas hotspot');
assert(content.includes('Hand-Padded Lapels') || content.includes('Lapels'), 'Must have Hand-Padded Lapels hotspot');
assert(content.includes('French Seams') || content.includes('Seams'), 'Must have French Seams hotspot');

// Assert page mounts HotspotViewer
const pageContent = fs.readFileSync('app/about/page.tsx', 'utf8');
assert(pageContent.includes('HotspotViewer'), 'app/about/page.tsx must mount HotspotViewer');

console.log('✅ PASS: test-about-hotspots.js');
