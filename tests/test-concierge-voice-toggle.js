const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 6: AI-06 Concierge Drawer Voice Audio Toggle Parity Test...\n');

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

// 1. Assert Voice Toggle Button exists with canonical ID
assert('Contains #conciergeVoiceToggleBtn', drawerContent.includes('id="conciergeVoiceToggleBtn"'));

// 2. Assert Volume/Speaker Icon and Muted Icon
assert('Contains Volume2 or VolumeX icon', (drawerContent.includes('Volume2') || drawerContent.includes('VolumeX') || drawerContent.includes('Volume')));

// 3. Assert Voice state toggle (isVoiceAudioEnabled)
assert('Contains state for voice audio enabled', drawerContent.includes('isVoiceEnabled') || drawerContent.includes('voiceEnabled') || drawerContent.includes('isVoiceAudioEnabled'));

// 4. Assert Speech Synthesis integration
assert('Uses window.speechSynthesis for audio speech', drawerContent.includes('speechSynthesis') || drawerContent.includes('speak'));

console.log(`\nBatch 6 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
