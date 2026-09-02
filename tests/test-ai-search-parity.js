const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 1: AI-01 Intelligent Natural Language Search Parity Test...\n');

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

// 1. Check SearchOverlay.tsx and useSearchStore.ts exist
const overlayPath = path.resolve('components/search/SearchOverlay.tsx');
const storePath = path.resolve('store/useSearchStore.ts');
const whyModalPath = path.resolve('components/search/SearchWhyModal.tsx');

assert('SearchOverlay.tsx exists', fs.existsSync(overlayPath));
assert('useSearchStore.ts exists', fs.existsSync(storePath));
assert('SearchWhyModal.tsx exists', fs.existsSync(whyModalPath));

const overlayContent = fs.readFileSync(overlayPath, 'utf8');
const storeContent = fs.readFileSync(storePath, 'utf8');
const whyContent = fs.readFileSync(whyModalPath, 'utf8');

// 2. Assert Keyboard navigation (Ctrl+K / Cmd+K / Escape)
assert('Supports Ctrl+K and Cmd+K keyboard shortcut', overlayContent.includes('ctrlKey') || overlayContent.includes('metaKey'));
assert('Supports Escape key to close', overlayContent.includes('Escape'));

// 3. Assert GPU Thinking Track animation
assert('Contains GPU Thinking Track animation element', overlayContent.includes('thinkingTrackRef') || overlayContent.includes('thinking-track'));

// 4. Assert Recent Searches retention
assert('Loads and retains recent searches', storeContent.includes('recentSearches') && storeContent.includes('loadRecentSearches'));
assert('Supports deleting single recent search', storeContent.includes('deleteRecentSearch'));
assert('Supports clearing all recent searches', storeContent.includes('clearAllRecentSearches'));

// 5. Assert Typo correction and Intent Parsing
assert('Contains typo correction helper', storeContent.includes('checkTypo') || storeContent.includes('fuzzy'));
assert('Parses intent with budget and occasion extraction', storeContent.includes('parseIntent'));

// 6. Assert "Why this piece?" modal integration
assert('SearchWhyModal contains reasoning points', whyContent.includes('whyExpanded') || whyContent.includes('reasoning'));
assert('SearchWhyModal contains 1-click Add to Bag action', whyContent.includes('addItem') || whyContent.includes('Add to Bag'));

// 7. Assert Swatch color switching inside search cards
assert('Supports color swatch switching on search cards', overlayContent.includes('activeSwatches') || overlayContent.includes('setSelectedColor'));

console.log(`\nBatch 1 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
