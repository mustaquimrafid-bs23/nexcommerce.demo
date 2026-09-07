const assert = require('assert');
const fs = require('fs');

const content = fs.readFileSync('components/about/CraftTimeline.tsx', 'utf8');

// Assert clean UK titles
assert(content.includes('Our Journey') || content.includes('Our Story'), 'Must have clean UK section title');
assert(!content.includes('Chronology of Purpose'), 'AI buzzword Chronology of Purpose must be replaced');
assert(!content.includes('Neural Style Concierge'), 'AI buzzword Neural Style Concierge must be replaced');
assert(!content.includes('Net-0 carbon custody'), 'AI buzzword Net-0 carbon custody must be replaced');

// Assert milestones exist
assert(content.includes('2022') && content.includes('2026'), 'Must span milestones');

console.log('✅ PASS: test-about-timeline.js');
