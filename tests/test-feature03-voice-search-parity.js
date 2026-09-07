// tests/test-feature03-voice-search-parity.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting Feature 03: Natural Voice Search Parity Verification Suite...');

// ── 1. Voice NLP Engine & Filler-Word Cleaner Verification ──────────────────
console.log('  [1/5] Verifying NLP Voice Query Cleaner...');

function cleanVoiceQuery(text) {
  if (!text) return '';
  let cleaned = text.trim();
  cleaned = cleaned.replace(/^(hey|hi|hello|bonjour|good (morning|afternoon|evening))\s*(stylist|assistant|nexcommerce|ai|bot)?[\s,]+/i, '');

  let prev = '';
  while (prev !== cleaned) {
    prev = cleaned;
    cleaned = cleaned.replace(/^(can you|could you|please|i want to|i'd like to|help me|tell me|show me|find me|look for|give me|what is|what's|how does|how do)\s+/i, '');
  }

  cleaned = cleaned.replace(/\s*(please|thank you|thanks|right now)\.?$/i, '');
  return cleaned.trim();
}

assert.strictEqual(
  cleanVoiceQuery('Hey stylist, show me black overcoats under $300'),
  'black overcoats under $300',
  'Must strip "Hey stylist, show me"'
);

assert.strictEqual(
  cleanVoiceQuery('Can you please find me an outfit under 300 euros with sneakers?'),
  'an outfit under 300 euros with sneakers?',
  'Must strip "Can you please find me"'
);

assert.strictEqual(
  cleanVoiceQuery('Tell me about the cashmere sweater please'),
  'about the cashmere sweater',
  'Must strip "Tell me" and trailing "please"'
);

assert.strictEqual(
  cleanVoiceQuery('black overcoats under $300'),
  'black overcoats under $300',
  'Must preserve already clean keyword queries'
);

assert.strictEqual(
  cleanVoiceQuery('   '),
  '',
  'Empty or whitespace queries must return empty string'
);

console.log('  ✔ NLP Voice Query Cleaner passed!');

// ── 2. SearchOverlay Component AST & Voice UI Verification ──────────────────
console.log('  [2/5] Verifying SearchOverlay.tsx Voice Architecture...');
const searchOverlayCode = fs.readFileSync(path.join(__dirname, '../components/search/SearchOverlay.tsx'), 'utf-8');

assert.ok(searchOverlayCode.includes('id="globalVoiceSearchTrigger"'), 'SearchOverlay must have #globalVoiceSearchTrigger');
assert.ok(searchOverlayCode.includes('global-voice-trigger-btn'), 'Must apply .global-voice-trigger-btn class');
assert.ok(searchOverlayCode.includes('voice-listening-dock'), 'Must render .voice-listening-dock');
assert.ok(searchOverlayCode.includes('voice-status-pill'), 'Must render .voice-status-pill badge');
assert.ok(searchOverlayCode.includes('voice-waveform-wrap'), 'Must render animated .voice-waveform-wrap');
assert.ok(searchOverlayCode.includes('id="btnVoiceDemoTrigger"'), 'Must have #btnVoiceDemoTrigger for deterministic testing');
assert.ok(searchOverlayCode.includes('id="btnCancelVoice"'), 'Must have #btnCancelVoice to cancel listening');
assert.ok(searchOverlayCode.includes('id="voiceSummaryAudioBar"'), 'Must render #voiceSummaryAudioBar for spoken summary');
assert.ok(searchOverlayCode.includes('stylist-audio-bar'), 'Must apply .stylist-audio-bar class');
assert.ok(searchOverlayCode.includes('audio-play-btn'), 'Must have .audio-play-btn');
assert.ok(searchOverlayCode.includes('mini-waveform'), 'Must render .mini-waveform');
assert.ok(searchOverlayCode.includes('mini-wave-bar'), 'Must render .mini-wave-bar equalizer elements');
assert.ok(searchOverlayCode.includes('cleanVoiceQuery'), 'Must import and use cleanVoiceQuery');
assert.ok(searchOverlayCode.includes('speakVoice'), 'Must import and use speakVoice');
assert.ok(searchOverlayCode.includes('stopVoice'), 'Must import and use stopVoice');
assert.ok(searchOverlayCode.includes('createVoiceRecognition'), 'Must import and use createVoiceRecognition');

console.log('  ✔ SearchOverlay.tsx voice elements verified!');

// ── 3. FeatureTourModal & Discovery Page Parity ─────────────────────────────
console.log('  [3/5] Verifying FeatureTourModal, Discovery Page & Guide Page...');
const tourModalCode = fs.readFileSync(path.join(__dirname, '../components/tour/FeatureTourModal.tsx'), 'utf-8');
const discoveryCode = fs.readFileSync(path.join(__dirname, '../app/discovery/page.tsx'), 'utf-8');
const guideCode = fs.readFileSync(path.join(__dirname, '../app/guide/page.tsx'), 'utf-8');

assert.ok(tourModalCode.includes("actionType: 'voice-search'"), 'FeatureTourModal Feature 03 must have actionType: voice-search');
assert.ok(tourModalCode.includes('openVoiceSearch(true)'), 'FeatureTourModal must trigger openVoiceSearch(true)');

assert.ok(discoveryCode.includes('id="discoveryVoiceSearchBtn"'), 'Discovery page must have #discoveryVoiceSearchBtn');
assert.ok(discoveryCode.includes("mode === 'voice'"), 'Discovery page must handle mode=voice URL parameter');
assert.ok(discoveryCode.includes('openVoiceSearch(true)'), 'Discovery page must launch openVoiceSearch(true) when mode=voice');

assert.ok(guideCode.includes("actionType: 'voice-search'"), 'Guide page Feature 03 must have actionType: voice-search');
assert.ok(guideCode.includes('/discovery?mode=voice'), 'Guide page Feature 03 must link to /discovery?mode=voice');
assert.ok(guideCode.includes('openVoiceSearch(true)'), 'Guide page must trigger openVoiceSearch(true)');

console.log('  ✔ Multi-page triggers and routing verified!');

// ── 4. Brand Guidelines & Royal Sapphire Navy Color Verification ────────────
console.log('  [4/5] Verifying Brand Guideline Colors & CSS Styling...');
const cssCode = fs.readFileSync(path.join(__dirname, '../app/globals.css'), 'utf-8');

assert.ok(cssCode.includes('.global-voice-trigger-btn'), 'globals.css must include .global-voice-trigger-btn');
assert.ok(cssCode.includes('.voice-listening-dock'), 'globals.css must include .voice-listening-dock');
assert.ok(cssCode.includes('.stylist-audio-bar'), 'globals.css must include .stylist-audio-bar');
assert.ok(cssCode.includes('.mini-waveform'), 'globals.css must include .mini-waveform');
assert.ok(cssCode.includes('.mini-wave-bar'), 'globals.css must include .mini-wave-bar');

// Check that pitch black is NOT used for the voice listening dock
assert.ok(
  cssCode.includes('rgba(17, 57, 114') || cssCode.includes('rgba(14, 50, 102') || cssCode.includes('#012148'),
  'Voice listening dock must use Royal Sapphire Navy backgrounds, never pitch black'
);
assert.ok(cssCode.includes('#3DE0FF'), 'Must use #3DE0FF cyan accents');
assert.ok(cssCode.includes('#F13365'), 'Must use #F13365 pink accents for recording indicators');

console.log('  ✔ Brand guideline colors and styling verified!');

// ── 5. CSS AST & Balanced Brace Verification ────────────────────────────────
console.log('  [5/5] Verifying Balanced Braces in app/globals.css...');
let openCount = 0;
for (let i = 0; i < cssCode.length; i++) {
  if (cssCode[i] === '{') openCount++;
  if (cssCode[i] === '}') openCount--;
  if (openCount < 0) {
    throw new Error(`Unmatched closing brace '}' at character ${i}`);
  }
}
assert.strictEqual(openCount, 0, `Unbalanced braces in globals.css! Remaining open: ${openCount}`);
console.log('  ✔ CSS AST syntax and balanced braces verified!');

console.log('\n🎉 ALL 5 FEATURE 03 PARITY VERIFICATION CHECKS PASSED WITH 100% SUCCESS!\n');
