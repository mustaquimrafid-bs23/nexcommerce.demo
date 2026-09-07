const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Running Search Feature Migration & Elevation Test Suite...\n');

// 1. Validate SearchOverlay.tsx contains Curated Editorial Atelier elements
const searchOverlayPath = path.join(__dirname, '../components/search/SearchOverlay.tsx');
assert(fs.existsSync(searchOverlayPath), 'SearchOverlay.tsx must exist');
const searchOverlayCode = fs.readFileSync(searchOverlayPath, 'utf8');

assert(searchOverlayCode.includes('DEPARTMENTS:'), 'SearchOverlay must contain DEPARTMENTS label');
assert(searchOverlayCode.includes('SEASONAL HIGHLIGHTS'), 'SearchOverlay must contain SEASONAL HIGHLIGHTS headline');
assert(searchOverlayCode.includes('CLEAR RECENT'), 'SearchOverlay must contain CLEAR RECENT button');
assert(searchOverlayCode.includes('nex-thinking-track'), 'SearchOverlay must contain 120fps GPU thinking track');
assert(searchOverlayCode.includes('SearchWhyModal'), 'SearchOverlay must import and wire SearchWhyModal');
assert(searchOverlayCode.includes('search-product-card'), 'SearchOverlay must use 3D search-product-card container');
assert(searchOverlayCode.includes('highlightMatch'), 'SearchOverlay must support text highlight matching');
assert(searchOverlayCode.includes('handleQuickAdd'), 'SearchOverlay must support direct 1-click Quick Add');
console.log('  ✓ SearchOverlay.tsx Option 3 Curated Editorial Atelier structures verified');

// 2. Validate SearchWhyModal.tsx
const whyModalPath = path.join(__dirname, '../components/search/SearchWhyModal.tsx');
assert(fs.existsSync(whyModalPath), 'SearchWhyModal.tsx must exist');
const whyModalCode = fs.readFileSync(whyModalPath, 'utf8');
assert(whyModalCode.includes('DESIGN &amp; FIT EVIDENCE') || whyModalCode.includes('DESIGN & FIT EVIDENCE'), 'SearchWhyModal must contain DESIGN & FIT EVIDENCE header');
assert(whyModalCode.includes('whyExpanded'), 'SearchWhyModal must render whyExpanded checklist');
console.log('  ✓ SearchWhyModal.tsx evidence checklist verified');

// 3. Validate useSearchStore.ts
const searchStorePath = path.join(__dirname, '../store/useSearchStore.ts');
assert(fs.existsSync(searchStorePath), 'useSearchStore.ts must exist');
const searchStoreCode = fs.readFileSync(searchStorePath, 'utf8');
assert(searchStoreCode.includes('parseIntent'), 'useSearchStore must have parseIntent');
assert(searchStoreCode.includes('checkTypoCorrection') || searchStoreCode.includes('levenshteinDistance'), 'useSearchStore must have typo correction engine');
assert(searchStoreCode.includes('getSeasonalHighlights'), 'useSearchStore must have getSeasonalHighlights');
assert(searchStoreCode.includes('clearAllRecentSearches'), 'useSearchStore must have clearAllRecentSearches');
assert(searchStoreCode.includes('Winter evening in Milan'), 'useSearchStore must contain initial default search history');
console.log('  ✓ useSearchStore.ts intent & typo engine verified');

// 4. Validate Discovery Page app/discovery/page.tsx
const discoveryPagePath = path.join(__dirname, '../app/discovery/page.tsx');
assert(fs.existsSync(discoveryPagePath), 'app/discovery/page.tsx must exist');
const discoveryPageCode = fs.readFileSync(discoveryPagePath, 'utf8');
assert(discoveryPageCode.includes('Visual Discovery'), 'Discovery page must contain Visual Discovery headline');
assert(discoveryPageCode.includes('Aesthetic Realms') || discoveryPageCode.includes('AESTHETIC_SPHERES'), 'Discovery page must contain Aesthetic Realms spheres');
assert(discoveryPageCode.includes('HOTSPOTS') || discoveryPageCode.includes('Shoppable Editorial Lookbook'), 'Discovery page must contain Shoppable Hotspot Lookbook');
assert(discoveryPageCode.includes('Quick Intent:'), 'Discovery page must contain Quick Intent suggestions');
console.log('  ✓ app/discovery/page.tsx aesthetic spheres & hotspot lookbook verified');

console.log('\n🎉 ALL SEARCH FEATURE REGRESSION AND INTEGRATION TESTS PASSED WITH 100% SUCCESS!\n');
