const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 7: AI-07 Concierge Drawer Mic & Listening Waveform Parity Test...\n');

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

const drawerPath = path.resolve('components/concierge/ConciergeDrawer.tsx');
assert('components/concierge/ConciergeDrawer.tsx exists', fs.existsSync(drawerPath));

const drawerContent = fs.readFileSync(drawerPath, 'utf8');

// 1. Assert Microphone Button exists with canonical ID #conciergeMicBtn
assert('Contains #conciergeMicBtn', drawerContent.includes('id="conciergeMicBtn"'));

// 2. Assert Mic Icon from lucide-react
assert('Contains Mic or MicOff icon', drawerContent.includes('Mic'));

// 3. Assert Animated 6-bar Listening Waveform exists
assert('Contains #conciergeListeningWave element', drawerContent.includes('id="conciergeListeningWave"'));
assert('Contains 6 animated voice bars', (drawerContent.match(/voice-bar-anim/g) || []).length >= 6 || (drawerContent.match(/rounded-full.*animate/g) || []).length >= 6);

// 4. Assert Voice Speech Recognition or listening state
assert('Contains listening state management', drawerContent.includes('isListening') || drawerContent.includes('setIsListening'));

console.log(`\nBatch 7 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
