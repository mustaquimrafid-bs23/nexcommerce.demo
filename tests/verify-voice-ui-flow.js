// tests/verify-voice-ui-flow.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const conciergeJs = fs.readFileSync(path.join(__dirname, '../js/concierge.js'), 'utf-8');
const engineJs = fs.readFileSync(path.join(__dirname, '../js/concierge-engine.js'), 'utf-8');

// 1. Static AST checks for Voice UI components
assert.ok(conciergeJs.includes('conciergeMicBtn'), 'Must inject #conciergeMicBtn into input bar');
assert.ok(conciergeJs.includes('conciergeVoiceToggleBtn'), 'Must inject #conciergeVoiceToggleBtn into header');
assert.ok(conciergeJs.includes('VoiceController') || conciergeJs.includes('SpeechRecognition') || conciergeJs.includes('webkitSpeechRecognition'), 'Must implement SpeechRecognition voice controller');
assert.ok(conciergeJs.includes('speechSynthesis') || conciergeJs.includes('SpeechSynthesisUtterance'), 'Must implement SpeechSynthesis voice output');
assert.ok(conciergeJs.includes('stylist-audio-bar') || conciergeJs.includes('mini-waveform'), 'Must render in-stream audio player for voice responses');

console.log('✔ Voice UI DOM and Injection tests passed!');
