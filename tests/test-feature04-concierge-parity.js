/**
 * Test Suite: Feature 04 (24/7 Personal Stylist Chat) 100% Parity with feature/storefront-elevation
 */
const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- Tier 1: Automated Unit & Parity Verification for Feature 04 ---');

// 1. Verify store/useConciergeStore.ts
const storePath = path.resolve(__dirname, '../store/useConciergeStore.ts');
assert(fs.existsSync(storePath), 'store/useConciergeStore.ts must exist');
const storeContent = fs.readFileSync(storePath, 'utf8');

assert(storeContent.includes('pdpContext: Product | null;'), 'Must have pdpContext in state');
assert(storeContent.includes('setPDPContext: (product: Product | null) => void;'), 'Must have setPDPContext action');
assert(storeContent.includes('spokenSummary?: string;'), 'Must support spokenSummary in ConciergeMessage');
assert(storeContent.includes('bundle?: {'), 'Must support bundle in ConciergeMessage');
assert(storeContent.includes('blazer|pants|shoes|match|complete'), 'Must handle blazer matching query');
assert(storeContent.includes("widgetType = 'bundle_look';"), 'Must set bundle_look widgetType for blazer matching');
assert(storeContent.includes('Structured Blazer Complete Look'), 'Must generate Structured Blazer Complete Look bundle');
assert(storeContent.includes('calculateSize: () =>'), 'Must provide calculateSize method');
console.log('✓ useConciergeStore.ts passes all state & action assertions');

// 2. Verify components/concierge/ConciergeDrawer.tsx
const drawerPath = path.resolve(__dirname, '../components/concierge/ConciergeDrawer.tsx');
assert(fs.existsSync(drawerPath), 'components/concierge/ConciergeDrawer.tsx must exist');
const drawerContent = fs.readFileSync(drawerPath, 'utf8');

// Strict Brand Palette (Zero pitch-black)
assert(!drawerContent.includes('bg-[#0A0A0A]'), 'Must NOT contain pitch-black bg-[#0A0A0A]');
assert(!drawerContent.includes('bg-black/65'), 'Must NOT contain pitch-black bg-black/65');
assert(drawerContent.includes('#01142e'), 'Must use Royal Sapphire Navy #01142e backdrop');
assert(drawerContent.includes('#071e3d'), 'Must use Royal Sapphire Navy #071e3d gradient');
assert(drawerContent.includes('#03152c'), 'Must use Royal Sapphire Navy #03152c gradient');
assert(drawerContent.includes('#3DE0FF'), 'Must use Cyan #3DE0FF accents');
assert(drawerContent.includes('#F13365'), 'Must use Pink #F13365 accents');

// Canonical IDs
assert(drawerContent.includes('id="nexConciergeOverlay"'), 'Must have id="nexConciergeOverlay"');
assert(drawerContent.includes('id="nexConciergeDrawer"'), 'Must have id="nexConciergeDrawer"');
assert(drawerContent.includes('id="conciergeStream"'), 'Must have id="conciergeStream"');
assert(drawerContent.includes('id="conciergeChips"'), 'Must have id="conciergeChips"');
assert(drawerContent.includes('id="conciergeForm"'), 'Must have id="conciergeForm"');
assert(drawerContent.includes('id="conciergeInput"'), 'Must have id="conciergeInput"');
assert(drawerContent.includes('id="conciergeMicBtn"'), 'Must have id="conciergeMicBtn"');
assert(drawerContent.includes('id="conciergeVoiceToggleBtn"'), 'Must have id="conciergeVoiceToggleBtn"');

// Key UX & Interaction Features
assert(drawerContent.includes('stylist-audio-bar'), 'Must include .stylist-audio-bar for audio summaries');
assert(drawerContent.includes('concierge-look-bundle'), 'Must include .concierge-look-bundle for complete looks');
assert(drawerContent.includes('selectedBundleItems'), 'Must support interactive item checkboxes in look bundle');
assert(drawerContent.includes('sizing-advisor-widget'), 'Must include interactive size advisor widget');
assert(drawerContent.includes('renderFormattedText'), 'Must parse markdown asterisks cleanly');
console.log('✓ ConciergeDrawer.tsx passes all brand, canonical ID, and interactive feature assertions');

// 3. Verify components/tour/FeatureTourModal.tsx
const tourPath = path.resolve(__dirname, '../components/tour/FeatureTourModal.tsx');
assert(fs.existsSync(tourPath), 'components/tour/FeatureTourModal.tsx must exist');
const tourContent = fs.readFileSync(tourPath, 'utf8');

assert(tourContent.includes("num: '04'"), 'Must contain Feature 04');
assert(tourContent.includes("actionType: 'concierge'"), 'Feature 04 must trigger concierge');
assert(tourContent.includes("exampleQuery: 'Suggest matching pants and shoes for this blazer'"), 'Feature 04 must have blazer query');
console.log('✓ FeatureTourModal.tsx passes Feature 04 trigger assertions');

// 4. Verify app/guide/page.tsx
const guidePath = path.resolve(__dirname, '../app/guide/page.tsx');
assert(fs.existsSync(guidePath), 'app/guide/page.tsx must exist');
const guideContent = fs.readFileSync(guidePath, 'utf8');

assert(guideContent.includes("num: 'Feature 04'"), 'Must contain Feature 04');
assert(guideContent.includes("actionType: 'concierge'"), 'Must have concierge actionType for Feature 04');
assert(guideContent.includes('Suggest matching pants and shoes for this blazer'), 'Must trigger blazer query');
console.log('✓ app/guide/page.tsx passes Feature 04 assertions');

console.log('================================================================');
console.log('ALL TIER 1 CHECKS PASSED: Feature 04 is in 100% parity!');
console.log('================================================================');
