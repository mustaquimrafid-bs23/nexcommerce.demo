# Delivery Location & Dark Store Hub UI/UX Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the Delivery Location header pill, cutoff countdown tooltip, interactive postal search modal, and mobile bottom sheet for a world-class luxury shopping experience.

**Architecture:** Extend `js/delivery-gate-engine.js` with postal search/filtering and humanized countdown formatting. Upgrade `css/design-system.css` with non-wrapping pill typography, luxury glassmorphism tooltip, and responsive mobile bottom sheet. Overhaul `js/delivery-gate-ui.js` to render the interactive search bar, geolocation auto-detect, dynamic hub filtering, and toast feedback.

**Tech Stack:** Vanilla JavaScript (ES6+), Modernist CSS design system with amber/cyan indicators, Lucide Icons, Node.js deterministic unit test harness.

## Global Constraints

- Must strictly adhere to the Modernist / Swiss-inspired luxury design system defined in `.agents/rules/modernist-design-system-standards.md` and `.agents/rules/european-luxury-typography-standards.md`.
- Zero text wrapping inside the header pill; all interactive touch targets must be $\ge 44\text{px}$.
- Centralized event handling: no inline HTML `onclick` attributes.
- Must execute the mandatory 3-Tier verification protocol (Unit test suite with zero failures, location persistence and inventory filtering verification, and live browser screenshots across Desktop 1440px and Mobile 375px).

---

## File Structure

```
nexcomarch/
├── js/
│   ├── delivery-gate-engine.js   # Dark store hub mapping, postal routing, search matching, countdown formatting
│   └── delivery-gate-ui.js       # Header location pill with tooltip, postal search modal & mobile bottom sheet
├── css/
│   └── design-system.css         # Header pill layout, glassmorphism tooltip, modal & mobile bottom sheet styling
├── tests/
│   └── test-delivery-gate-engine.js # Deterministic unit tests for search, geolocation matching, and countdown formatting
└── docs/superpowers/specs/
    └── 2026-08-21-delivery-location-redesign-design.md # Approved design spec
```

---

### Task 1: Update Delivery Engine Formatting & Postal Search Helpers

**Files:**
- Modify: `js/delivery-gate-engine.js`
- Test: `tests/test-delivery-gate-engine.js`

**Interfaces:**
- Consumes: Query string (city or postal code), Coordinates `(lat, lng)` (optional), Hub ID.
- Produces: `window.NexDeliveryEngine` updated with:
  - `searchHubs(query)`: returns list of matching hubs by city, region, or postal code prefix.
  - `getCutoffCountdown(hubId)`: returns `{ hoursRemaining, minutesRemaining, formattedCountdown, humanText, isCutoffPassed }`.
  - `getNearestHub(lat, lng)`: calculates closest hub by coordinates.

- [ ] **Step 1: Write the failing unit tests for new engine methods**

Update `tests/test-delivery-gate-engine.js`:
```javascript
const assert = require('assert');

global.window = {};
require('../js/delivery-gate-engine.js');

const engine = global.window.NexDeliveryEngine;
assert(engine, 'NexDeliveryEngine should be attached to window');

console.log('🧪 Running NexDeliveryEngine Extended Unit Tests...');

// Test 1: Postal and City Search
const berlinResults = engine.searchHubs('Berlin');
assert(berlinResults.length >= 1, 'Search for "Berlin" should find Berlin Mitte Hub');
assert.strictEqual(berlinResults[0].id, 'berlin-mitte');

const postalResults = engine.searchHubs('75003');
assert(postalResults.length >= 1, 'Search for "75003" should find Paris Marais Hub');
assert.strictEqual(postalResults[0].id, 'paris-marais');

const londonPrefix = engine.searchHubs('W1');
assert(londonPrefix.length >= 1, 'Search for "W1" should find London Mayfair Hub');

// Test 2: Humanized Countdown Format
const countdown = engine.getCutoffCountdown('berlin-mitte');
assert(typeof countdown.hoursRemaining === 'number');
assert(typeof countdown.minutesRemaining === 'number');
assert(countdown.formattedCountdown.includes('left') || countdown.formattedCountdown.includes('Next-day') || countdown.formattedCountdown.includes('Tomorrow'));

// Test 3: Fallback handling
const unknownSearch = engine.searchHubs('Tokyo');
assert.strictEqual(unknownSearch.length, 0, 'Unknown location returns empty list for explicit query');

console.log('✅ All NexDeliveryEngine unit tests passed!');
```

- [ ] **Step 2: Run test to verify failure**

Run: `node tests/test-delivery-gate-engine.js`
Expected: FAIL with `engine.searchHubs is not a function`.

- [ ] **Step 3: Implement `searchHubs` and updated `getCutoffCountdown` in `js/delivery-gate-engine.js`**

Implement search matching and humanized countdown formatting.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test-delivery-gate-engine.js`
Expected: PASS with `✅ All NexDeliveryEngine unit tests passed!`.

---

### Task 2: Refactor Delivery Location CSS in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css`

**Interfaces:**
- Produces: CSS classes `.delivery-hub-pill-wrapper`, `.delivery-hub-pill`, `.delivery-pin-icon`, `.delivery-location-label`, `.delivery-express-badge`, `.delivery-hub-tooltip`, `.delivery-hub-modal-overlay`, `.delivery-hub-modal`, `.hub-search-box`, `.hub-gps-btn`, `.hub-card-item`.

- [ ] **Step 1: Add robust non-wrapping pill styles and luxury glassmorphism tooltip**

Ensure `.delivery-hub-pill` has `white-space: nowrap;`, `flex-shrink: 0;`, proper vertical alignment, min-height $44\text{px}$, and seamless hover states.
Add `.delivery-hub-tooltip` with `opacity: 0; transform: translateY(6px); pointer-events: none;` transitioning to `opacity: 1; transform: translateY(0);` on `:hover` and `:focus-visible`.

- [ ] **Step 2: Add responsive search box, GPS button, hub card grid, and mobile bottom sheet styles**

Add media queries for `@media (max-width: 768px)` so that `.delivery-hub-modal` anchors to the bottom of the screen with rounded top corners, full-width swipe handle, and touch-optimized padding.

- [ ] **Step 3: Validate CSS syntax**

Run: `node -e "const fs = require('fs'); const css = fs.readFileSync('css/design-system.css', 'utf8'); console.log('Braces check:', (css.match(/{/g)||[]).length === (css.match(/}/g)||[]).length);"`
Expected: `Braces check: true`.

---

### Task 3: Overhaul Delivery Gate UI Controller in `js/delivery-gate-ui.js`

**Files:**
- Modify: `js/delivery-gate-ui.js`

**Interfaces:**
- Produces: `window.NexDeliveryGateUI` instance with:
  - `mountHeaderPill()`: renders wrapper, non-wrapping pill, dynamic live countdown, and context tooltip.
  - `buildModal()`: renders modal with search input, clear button, GPS detect button, and dynamic hub card grid.
  - `filterHubs(query)`: filters hub card items in real-time as user types.
  - `useGeolocation()`: requests GPS coords and routes to closest hub.
  - `selectHub(hubId)`: saves hub, updates pill, dispatches `nex:hub-changed`, displays toast, and closes modal.

- [ ] **Step 1: Implement single-line pill, countdown ticker, and tooltip rendering**

Update `mountHeaderPill()` to render clean single-line structure and calculate dynamic tooltip content showing courier name and cutoff time.

- [ ] **Step 2: Implement search filtering and GPS auto-detection in `buildModal()`**

Wire up input event listeners on `#hubPostalSearchInput`, clear button, and GPS button.

- [ ] **Step 3: Wire up custom event dispatching and notification toast**

Ensure `selectHub(hubId)` triggers `window.dispatchEvent(new CustomEvent('nex:hub-changed', ...))` and displays notification.

---

### Task 4: Mandatory 3-Tier Verification & Visual Proof

**Files:**
- Test: `tests/test-delivery-gate-engine.js`
- Test: `tests/audit-all-pages.js` (regression check)

- [ ] **Step 1: Tier 1 - Automated Unit & Regression Tests**

Run: `node tests/test-delivery-gate-engine.js`
Run: `node tests/audit-all-pages.js`
Assert zero failures.

- [ ] **Step 2: Tier 2 - Functional Flow Verification**

Verify hub switching persists in `localStorage` and updates header pill across pages.

- [ ] **Step 3: Tier 3 - Visual Browser Inspection & Screenshot Capture**

Inspect Desktop (`1440x900`) and Mobile (`375x812`) in browser. Confirm:
- Pill text is single-line with zero vertical breaking or awkward line wraps.
- Tooltip displays correctly on hover.
- Modal opens with functional postal search and hub selection.
- Mobile bottom sheet renders cleanly.
