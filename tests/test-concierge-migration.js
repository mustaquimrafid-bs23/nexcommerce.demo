const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== [TIER 1 & 2] CONCIERGE PAGE MIGRATION AUDIT ===\n');

// 1. Check file existence
const pagePath = path.resolve(__dirname, '../app/concierge/page.tsx');
const storePath = path.resolve(__dirname, '../store/useConciergeStore.ts');
const globalsPath = path.resolve(__dirname, '../app/globals.css');

assert(fs.existsSync(pagePath), 'app/concierge/page.tsx must exist');
assert(fs.existsSync(storePath), 'store/useConciergeStore.ts must exist');
assert(fs.existsSync(globalsPath), 'app/globals.css must exist');
console.log('✓ All source files present.');

// 2. Scan for forbidden robotic "AI" buzzwords
const pageContent = fs.readFileSync(pagePath, 'utf8');
const storeContent = fs.readFileSync(storePath, 'utf8');

const forbiddenWords = [
  /\bAI\b/g,
  /\bAi\b/g,
  /\bA\.I\.\b/g,
  /\bneural\b/i,
  /\bautonomous\b/i,
  /\bagentic\b/i,
  /\bhallucination\b/i,
  /\bcomputed in-browser\b/i,
  /\bbot\b/i,
];

let buzzwordErrors = 0;
for (const pattern of forbiddenWords) {
  const matchPage = pageContent.match(pattern);
  if (matchPage) {
    console.error(`❌ Forbidden word found in page.tsx: ${matchPage[0]}`);
    buzzwordErrors++;
  }
  const matchStore = storeContent.match(pattern);
  if (matchStore) {
    console.error(`❌ Forbidden word found in store: ${matchStore[0]}`);
    buzzwordErrors++;
  }
}

assert.strictEqual(buzzwordErrors, 0, 'No forbidden AI/robotic buzzwords allowed in UI copy!');
console.log('✓ Strict Zero "AI" / robotic buzzwords policy verified.');

// 3. Verify Key UI Components in page.tsx
const requiredUiPatterns = [
  { name: 'Top Studio Bar Agent Profile', pattern: /Smart Style Concierge/ },
  { name: 'Active Stylist Indicator', pattern: /Active · Personal Stylist/ },
  { name: 'Mobile Viewport Tabs', pattern: /mobileTab === 'chat'/ },
  { name: 'Sizing Advisor Widget', pattern: /sizing_advisor/ },
  { name: 'Live Order Tracker Widget', pattern: /order_tracking/ },
  { name: 'Quick Scenario Prompt Chips', pattern: /SCENARIO_PROMPT_CHIPS/ },
  { name: 'Voice Microphone Toggle', pattern: /handleVoiceToggle/ },
  { name: 'Reactive Look Canvas Header', pattern: /YOUR OUTFIT/ },
  { name: 'Harmony Score Badge', pattern: /harmonyScore/ },
  { name: '1-Click Quick Add', pattern: /handleSingleQuickAdd/ },
  { name: '1-Click Add All to Bag', pattern: /handleAddAllLookToBag/ },
  { name: 'Studio Bundle Bar', pattern: /FULL OUTFIT/ },
];

for (const req of requiredUiPatterns) {
  assert(req.pattern.test(pageContent), `Missing UI element: ${req.name}`);
  console.log(`✓ Verified UI Component: ${req.name}`);
}

// 4. Verify Animations in globals.css
const globalsContent = fs.readFileSync(globalsPath, 'utf8');
assert(globalsContent.includes('@keyframes live-pulse'), 'Must contain @keyframes live-pulse');
assert(globalsContent.includes('@keyframes wave-bar'), 'Must contain @keyframes wave-bar');
assert(globalsContent.includes('@keyframes typing-bounce'), 'Must contain @keyframes typing-bounce');
assert(globalsContent.includes('@keyframes fadeInUp'), 'Must contain @keyframes fadeInUp');
console.log('✓ All concierge studio keyframe animations verified in globals.css.');

console.log('\n✅ ALL CONCIERGE UNIT & ARCHITECTURAL CHECKS PASSED!\n');
