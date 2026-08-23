# Voice AI Stylist (Approach A) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate a zero-dependency, ultra-fast client-side Voice AI capability into the global "Ask Stylist" concierge, enabling real-time speech dictation, pulsing audio waveform UI, conversational intent parsing, and natural speech synthesis feedback.

**Architecture:** Leverages standard Web Speech API (`webkitSpeechRecognition` / `SpeechRecognition` and `window.speechSynthesis`) encapsulated in a dedicated `VoiceController` within `js/concierge.js`, connects to `js/concierge-engine.js` with conversational intent pre-processing and voice-optimized summary generation, and styles active listening/speaking states in `css/design-system.css`.

**Tech Stack:** Vanilla JavaScript (ES6+), Web Speech Recognition API, Web Speech Synthesis API, Vanilla CSS with GPU-accelerated keyframe waveforms, Lucide Icons.

## Global Constraints

- Zero external backend dependencies or paid API keys required; 100% client-side execution with graceful fallbacks.
- Strictly adhere to WCAG 2.1 AA accessibility standards (all mic and audio toggles have `aria-label`, visible focus indicators, minimum 44×44px touch targets).
- Support all 29 storefront pages seamlessly via existing centralized event delegation (`js/concierge.js`).
- Preserve balanced CSS AST structures in `css/design-system.css` and validate with `node -e "..."` after edits.

---

### Task 1: NLP Intent Pre-Processing & Voice Response Payload in `ConciergeEngine`

**Files:**
- Modify: `js/concierge-engine.js:15-180`
- Test: `tests/verify-voice-engine.js`

**Interfaces:**
- Consumes: User raw speech transcript string (e.g., *"Find me a casual evening outfit under €300 with sneakers"* or *"Hey stylist, how does the cashmere sweater fit?"*)
- Produces: Normalized query without conversational filler prefixes, mapped query payload containing `spokenSummary` text property formatted specifically for concise synthetic speech playback.

- [ ] **Step 1: Write the failing unit test for voice query parsing and spoken summary generation**

```javascript
// tests/verify-voice-engine.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const engineCode = fs.readFileSync(path.join(__dirname, '../js/concierge-engine.js'), 'utf-8');
const vm = require('vm');
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(engineCode, sandbox);

const ConciergeEngine = sandbox.window.ConciergeEngine;
assert.ok(ConciergeEngine, 'ConciergeEngine must be defined on window');

const engine = new ConciergeEngine();
engine.initialize();

// Test 1: Strip conversational filler words from voice input
const parsedOutfit = engine.parseQuery("Hey stylist, can you please find me an outfit under 300 euros with sneakers?");
assert.ok(parsedOutfit, 'Should return a valid response object');
assert.ok(parsedOutfit.products && parsedOutfit.products.length > 0, 'Should return matching products');
assert.ok(parsedOutfit.spokenSummary && typeof parsedOutfit.spokenSummary === 'string', 'Should return spokenSummary text');
assert.ok(parsedOutfit.spokenSummary.length > 0, 'spokenSummary should not be empty');

// Test 2: Voice sizing inquiry
const parsedSizing = engine.parseQuery("Tell me how the cashmere sweater fits");
assert.strictEqual(parsedSizing.type, 'sizing_advisor', 'Should route to sizing_advisor');
assert.ok(parsedSizing.spokenSummary.includes('fit') || parsedSizing.spokenSummary.includes('cashmere') || parsedSizing.spokenSummary.includes('size'), 'spokenSummary should contain sizing guidance');

console.log('✔ All Voice Engine tests passed successfully!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-voice-engine.js`
Expected: FAIL with "spokenSummary must be defined"

- [ ] **Step 3: Implement conversational intent cleaner and `spokenSummary` in `js/concierge-engine.js`**

Add `_cleanVoiceQuery(query)` helper to strip conversational fluff (`"can you find me"`, `"tell me about"`, `"hey stylist"`, etc.) and ensure every response payload returned by `parseQuery()` attaches a concise, natural 1-2 sentence `spokenSummary` string.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-voice-engine.js`
Expected: PASS with "✔ All Voice Engine tests passed successfully!"

- [ ] **Step 5: Commit changes**

```bash
git add js/concierge-engine.js tests/verify-voice-engine.js
git commit -m "feat(concierge): add voice query preprocessing and spokenSummary generator"
```

---

### Task 2: Voice AI Styles & Animated Waveforms in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:16930-17010`
- Test: `tests/verify-css-syntax.js`

**Interfaces:**
- Consumes: CSS class triggers (`.listening`, `.voice-active`, `.stylist-audio-bar`, `.msg-user.spoken-query`, `.concierge-voice-toggle`)
- Produces: Polished luxury visual styling, pulsing magenta listening bar with glowing borders, 6-bar audio equalizer keyframe animations, and inline audio progress indicators.

- [ ] **Step 1: Write CSS syntax verification test**

```javascript
// tests/verify-css-syntax.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, '../css/design-system.css'), 'utf-8');

// Assert brace balance
let openCount = 0;
for (let i = 0; i < css.length; i++) {
  if (css[i] === '{') openCount++;
  if (css[i] === '}') openCount--;
  assert.ok(openCount >= 0, `Unmatched closing brace found at character ${i}`);
}
assert.strictEqual(openCount, 0, 'All CSS braces must be perfectly balanced');

// Assert Voice UI classes exist
assert.ok(css.includes('.concierge-mic-btn'), 'Must contain .concierge-mic-btn');
assert.ok(css.includes('.concierge-input-bar.listening'), 'Must contain .concierge-input-bar.listening');
assert.ok(css.includes('.stylist-audio-bar'), 'Must contain .stylist-audio-bar');
assert.ok(css.includes('.mini-waveform'), 'Must contain .mini-waveform');

console.log('✔ CSS syntax and Voice UI rules verified successfully!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-css-syntax.js`
Expected: FAIL with "Must contain .concierge-mic-btn"

- [ ] **Step 3: Add Voice AI CSS rules to `css/design-system.css`**

Add rules for:
- `.concierge-mic-btn` (32×32px circular luxury mic button with hover glow)
- `.concierge-input-bar.listening` (pulsing magenta border `#F13365`, listening animation)
- `.listening-waveform` and `.voice-bar-anim` (animated equalizer bars)
- `.stylist-audio-bar` (glassmorphic audio player bar with cyan wave visualizer and play/pause controls)
- `.concierge-voice-toggle` (header speaker button for voice mute/unmute state)

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-css-syntax.js`
Expected: PASS with "✔ CSS syntax and Voice UI rules verified successfully!"

- [ ] **Step 5: Commit changes**

```bash
git add css/design-system.css tests/verify-css-syntax.js
git commit -m "style(concierge): add Voice AI listening bars, waveform animations, and audio player styles"
```

---

### Task 3: Voice Controller & Speech Synthesis Integration in `js/concierge.js`

**Files:**
- Modify: `js/concierge.js:60-350`
- Test: `tests/verify-voice-ui-flow.js`

**Interfaces:**
- Consumes: `ConciergeEngine.parseQuery()`, browser `SpeechRecognition` or `webkitSpeechRecognition`, and `window.speechSynthesis`.
- Produces: Interactive microphone trigger, dynamic listening bar states, live interim speech transcription, auto-submit upon user speech completion, and spoken audio synthesis response with on/off header toggle.

- [ ] **Step 1: Write functional test for Voice Controller DOM and State Transitions**

```javascript
// tests/verify-voice-ui-flow.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const conciergeJs = fs.readFileSync(path.join(__dirname, '../js/concierge.js'), 'utf-8');
const engineJs = fs.readFileSync(path.join(__dirname, '../js/concierge-engine.js'), 'utf-8');

const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="testRoot"></div></body></html>`, {
  runScripts: "dangerously",
  resources: "usable",
  url: "https://example.com/"
});

dom.window.eval(engineJs);
dom.window.eval(conciergeJs);

const document = dom.window.document;
// Trigger DOMContentLoaded
const event = document.createEvent('Event');
event.initEvent('DOMContentLoaded', true, true);
document.dispatchEvent(event);

// Assert Voice Elements are Injected
const micBtn = document.getElementById('conciergeMicBtn');
assert.ok(micBtn, '#conciergeMicBtn must be injected into the concierge input bar');

const voiceToggleBtn = document.getElementById('conciergeVoiceToggleBtn');
assert.ok(voiceToggleBtn, '#conciergeVoiceToggleBtn must be injected into the drawer header');

console.log('✔ Voice UI DOM and Injection tests passed!');
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/verify-voice-ui-flow.js`
Expected: FAIL with "#conciergeMicBtn must be injected"

- [ ] **Step 3: Implement `VoiceController` and `VoiceSynthesizer` in `js/concierge.js`**

1. Inject `#conciergeMicBtn` into `#conciergeForm` and `#conciergeVoiceToggleBtn` into `.concierge-header`.
2. Implement `VoiceController` class handling:
   - Microphone permission and `SpeechRecognition` lifecycle (`onstart`, `onresult`, `onerror`, `onend`).
   - Toggling `.listening` class on `.concierge-input-bar`.
   - Streaming interim results into the input bar.
   - Auto-submitting the query when `event.results[0].isFinal` triggers.
   - Handling graceful error states (e.g. microphone denied notification).
3. Implement `VoiceSynthesizer` class handling:
   - Natural voice pitch and rate selection.
   - Speaking `responsePayload.spokenSummary`.
   - Rendering mini interactive waveform player with play/pause in the stream.
   - Respecting voice mute preference stored in `localStorage`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/verify-voice-ui-flow.js`
Expected: PASS with "✔ Voice UI DOM and Injection tests passed!"

- [ ] **Step 5: Commit changes**

```bash
git add js/concierge.js tests/verify-voice-ui-flow.js
git commit -m "feat(concierge): wire Web Speech recognition and synthesis into Ask Stylist drawer"
```

---

### Task 4: Full-Site Regression & Multi-Page Verification

**Files:**
- Test: `tests/full-7dimension-audit.js`
- Test: `tests/verify-all-35-fixes.js`

**Interfaces:**
- Consumes: All 29 HTML pages (`index.html`, `pages/*.html`, `404.html`)
- Produces: 100% green test suite across all 7 quality dimensions with zero regressions.

- [ ] **Step 1: Run comprehensive regression test suite**

Run: `node tests/verify-all-35-fixes.js`
Expected: PASS with 0 failures across all 35 verified bugs/features.

- [ ] **Step 2: Run 7-dimension full audit**

Run: `node tests/full-7dimension-audit.js`
Expected: PASS with 0 broken links, 0 unclosed tags, and 100% script parity.

- [ ] **Step 3: Commit verification test baseline**

```bash
git commit --allow-empty -m "test(concierge): full-suite verification for voice AI stylist"
```

---

### Task 5: Live Browser UI Verification (Tier 3)

**Files:**
- Test: Live browser testing on Desktop (`1440x900`) and Mobile (`375x812`) via Chrome DevTools MCP.

- [ ] **Step 1: Open live storefront page in browser at 1440x900**
- [ ] **Step 2: Open "Ask Stylist" drawer and click Microphone button**
- [ ] **Step 3: Verify listening animation, glowing border, and waveform behavior**
- [ ] **Step 4: Capture desktop and mobile screenshot evidence**
- [ ] **Step 5: Verify zero console errors and clean layout reflow**
