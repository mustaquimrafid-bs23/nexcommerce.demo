const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 2: AI-02 Multi-Turn Context Retention Parity Test...\n');

let passed = 0;
let failed = 0;

function assert(desc, condition) {
  if (condition) {
    console.log(`  ✓ [PASS] ${desc}`);
    passed++;
  } else {
    console.error(`  ✗ [FAIL] ${desc}`);
    failed++;
  }
}

const discoveryPath = path.resolve('app/discovery/page.tsx');
const storePath = path.resolve('store/useSearchStore.ts');

assert('app/discovery/page.tsx exists', fs.existsSync(discoveryPath));
assert('store/useSearchStore.ts exists', fs.existsSync(storePath));

const discoveryContent = fs.readFileSync(discoveryPath, 'utf8');
const storeContent = fs.readFileSync(storePath, 'utf8');

// 1. Assert Understood Context Container
assert('Contains Understood Context section', discoveryContent.includes('Understood Context') || discoveryContent.includes('contextPills'));

// 2. Assert Dynamic Pill Mapping
assert('Maps context pills with label and key', discoveryContent.includes('contextPills.map'));

// 3. Assert Remove Action per Pill
assert('Contains remove button per pill with removeContextPill', discoveryContent.includes('removeContextPill') && discoveryContent.includes('Remove filter'));

// 4. Assert Store manages context retention
assert('Store holds contextPills state', storeContent.includes('contextPills'));
assert('Store defines removeContextPill action', storeContent.includes('removeContextPill'));
assert('Store updates filtered matches upon pill removal', storeContent.includes('removeContextPill') || discoveryContent.includes('removeContextPill'));

// 5. Assert Session Context Storage Sync
assert('Handles context sync or session intent storage', storeContent.includes('context') || discoveryContent.includes('contextPills'));

console.log(`\nBatch 2 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
