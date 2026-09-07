const fs = require('fs');
const path = require('path');

console.log('🧪 Running Batch 8: AI-08 Concierge Studio Page Speech API Parity Test...\n');

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

const conciergePagePath = path.resolve('app/concierge/page.tsx');
assert('app/concierge/page.tsx exists', fs.existsSync(conciergePagePath));

const content = fs.readFileSync(conciergePagePath, 'utf8');

// 1. Assert SpeechRecognition or webkitSpeechRecognition is checked
assert('Integrates SpeechRecognition / webkitSpeechRecognition', content.includes('SpeechRecognition') || content.includes('webkitSpeechRecognition'));

// 2. Assert removes hardcoded 2400ms mock timer
assert('Does not rely exclusively on hardcoded 2400ms timeout for voice', !content.includes('setTimeout(() => {\n        setVoiceActive(false);\n        sendMessage(\'Show me cashmere knitwear for a winter evening\');\n      }, 2400);'));

// 3. Assert transcription interim or final result listener
assert('Listens to speech transcription results', content.includes('transcript') || content.includes('onresult'));

// 4. Assert microphone error and termination cleanup
assert('Handles speech recognition onerror and onend', content.includes('onerror') && content.includes('onend'));

console.log(`\nBatch 8 Test Results: ${passed} passed, ${failed} failed.`);
process.exit(failed > 0 ? 1 : 0);
