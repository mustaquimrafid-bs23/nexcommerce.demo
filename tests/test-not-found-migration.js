const fs = require('fs');
const path = require('path');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${desc}`);
    failed++;
  }
}

console.log('🧪 Testing 404 Recovery Gateway Migration...');

const notFoundPath = path.resolve(process.cwd(), 'app/not-found.tsx');
assert('app/not-found.tsx exists', fs.existsSync(notFoundPath));

if (fs.existsSync(notFoundPath)) {
  const content = fs.readFileSync(notFoundPath, 'utf8');
  assert('404 has Destination Unavailable headline', content.includes('Destination Unavailable'));
  assert('404 has recovery search bar', content.includes('Search') || content.includes('input'));
  assert('404 has prompt chips', content.includes('Cashmere') || content.includes('prompt-chip'));
  assert('404 has 4 curated gateway wings', content.includes('Smart List & Vault') || content.includes('Tailored Silhouettes'));
}

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
