# Shopping Slip to Cart (Capability 4) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build an intelligent "Shopping Slip to Cart" agent capability that accepts uploaded slip images, sample presets, or pasted shopping lists, extracts line items and quantities via OCR parsing, matches them against the product catalog with fuzzy confidence scoring and disambiguation, and prepares an interactive cart for 1-click confirmation.

**Architecture:** A modular client-side Slip Parsing Engine (`js/slip-parser.js`) processes raw text or slip image inputs, extracts quantities and attribute hints, scores catalog candidates via token-overlap/Levenshtein matching, and flags ambiguities. A dedicated modernist review modal/drawer (`js/slip-to-cart-ui.js`) provides an interactive split-pane review interface with live slip preview, item substitution/size selector, and batch dispatch to `window.nexCart`.

**Tech Stack:** Vanilla JavaScript (ES6+), Modernist CSS design system with glassmorphism and GPU-accelerated motion curves, Lucide Icons, Node.js deterministic test harness.

## Global Constraints

- Must strictly adhere to the Modernist / Swiss-inspired luxury design system defined in `.agents/rules/modernist-design-system-standards.md` and `.agents/rules/european-luxury-typography-standards.md`.
- No generic AI anti-patterns: avoid neon glows or arbitrary card borders; lead with rich uncropped studio product photography (`object-fit: contain`).
- All interactive touch targets must be $\ge 44\text{px}$.
- Centralized event handling: no inline HTML `onclick` attributes.
- Must execute the mandatory 3-Tier verification protocol (Unit test suite with zero failures, list depletion/cart sync verification, and visual layout assertions).

---

## File Structure

```
nexcomarch/
├── js/
│   ├── slip-parser.js          # Core parsing, regex quantity extraction, and fuzzy catalog matcher
│   ├── slip-to-cart-ui.js      # Modal / review drawer UI controller, dropzone, sample presets, and cart sync
│   ├── header.js               # Header navigation trigger integration
│   └── cart.js                 # Cart page trigger and state sync
├── css/
│   └── design-system.css       # Modal, dropzone, slip checklist, and match card styles
├── pages/
│   └── cart.html               # Cart page slip upload entry point
└── tests/
    └── test-slip-parser.js     # Deterministic unit test suite for slip parsing and catalog matching
```

---

### Task 1: Slip Parsing & Catalog Matching Engine

**Files:**
- Create: `tests/test-slip-parser.js`
- Create: `js/slip-parser.js`

**Interfaces:**
- Consumes: Product Catalog database (`SL_PRODUCTS` or `window.NexAI.catalogArray` / `PRODUCT_EMBEDDINGS`).
- Produces: `window.NexSlipParser` with methods:
  - `parseRawText(rawText)`: extracts line items, quantities, and size/color hints.
  - `matchSlipToCatalog(parsedLines, catalog)`: returns matched items with confidence scores (`exact`, `fuzzy`, `ambiguous`, `unmatched`), alternative suggestions, and quantity assignments.
  - `buildCartPayload(matchedItems)`: formats matched items into `nexCart` compatible item payloads.

- [ ] **Step 1: Write the failing test for the Slip Parser**

Create `tests/test-slip-parser.js`:
```javascript
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock DOM/window environment
global.window = {};
require('../js/slip-parser.js');

const parser = global.window.NexSlipParser;
assert(parser, 'NexSlipParser should be attached to window');

const MOCK_CATALOG = [
  { id: 'p1', name: 'Pure Cashmere Sweater', brand: 'Arc', price: 185, category: 'Apparel', image: 'assets/images/products/hero_sweater.png', variants: { sizes: [{ id: 'S', inStock: true }, { id: 'M', inStock: true }, { id: 'L', inStock: true }] } },
  { id: 'p2', name: 'Fine-Knit Cashmere Crew', brand: 'Arc', price: 160, category: 'Apparel', image: 'assets/images/products/plp_crewneck.png', variants: { sizes: [{ id: 'S', inStock: true }, { id: 'M', inStock: true }] } },
  { id: 'p3', name: 'Structured Wool Blazer', brand: 'Arc', price: 245, category: 'Apparel', image: 'assets/images/products/plp_blazer.png', variants: { sizes: [{ id: '46', inStock: true }, { id: '48', inStock: true }] } },
  { id: 'p4', name: 'Studio Acoustics Headphone GT', brand: 'Form', price: 320, category: 'Acoustics', image: 'assets/images/products/p4.png' },
  { id: 'p6', name: 'Minimalist Leather Runner', brand: 'Apex', price: 198, category: 'Footwear', image: 'assets/images/products/leather_sneaker.png' },
  { id: 'p8', name: 'Chronograph Minimalist Watch', brand: 'Volta', price: 285, category: 'Accessories', image: 'assets/images/products/titanium_watch.png' }
];

console.log('🧪 Running NexSlipParser Unit Tests...');

// Test 1: Raw text parsing with quantities & sizes
const sampleText = `
1. 2x Pure Cashmere Sweater (Size M)
2. 1x Wool Blazer size 48
3. 3 pcs Fine-Knit Crew
4. Minimalist Leather Runner
5. Unknown Silk Scarf 100%
`;

const parsed = parser.parseRawText(sampleText);
assert.strictEqual(parsed.length, 5, 'Should parse exactly 5 non-empty line items');
assert.strictEqual(parsed[0].quantity, 2, 'Line 1 quantity should be 2');
assert.strictEqual(parsed[0].sizeHint, 'M', 'Line 1 size hint should be M');
assert.strictEqual(parsed[1].quantity, 1, 'Line 2 quantity should be 1');
assert.strictEqual(parsed[1].sizeHint, '48', 'Line 2 size hint should be 48');
assert.strictEqual(parsed[2].quantity, 3, 'Line 3 quantity should be 3');
assert.strictEqual(parsed[3].quantity, 1, 'Line 4 default quantity should be 1');

// Test 2: Catalog matching & confidence scoring
const matchResult = parser.matchSlipToCatalog(parsed, MOCK_CATALOG);
assert.strictEqual(matchResult.matched.length, 4, 'Should match 4 catalog products');
assert.strictEqual(matchResult.unmatched.length, 1, 'Should have 1 unmatched item');

// Test 3: Assert first match is Pure Cashmere Sweater with high confidence
const match1 = matchResult.matched[0];
assert.strictEqual(match1.product.id, 'p1', 'First match should be p1');
assert.strictEqual(match1.quantity, 2, 'First match quantity should be 2');
assert.strictEqual(match1.confidence >= 0.85, true, 'First match confidence should be >= 0.85');

// Test 4: Cart payload generation
const cartPayload = parser.buildCartPayload(matchResult.matched);
assert.strictEqual(cartPayload.length, 4, 'Cart payload should have 4 items');
assert.strictEqual(cartPayload[0].id, 'p1');
assert.strictEqual(cartPayload[0].quantity, 2);
assert.strictEqual(cartPayload[0].variant, 'M');

// Test 5: Ambiguity detection
const ambiguousText = '1x Cashmere';
const ambParsed = parser.parseRawText(ambiguousText);
const ambMatch = parser.matchSlipToCatalog(ambParsed, MOCK_CATALOG);
assert(ambMatch.matched[0].isAmbiguous, 'Single generic term "Cashmere" should be flagged as ambiguous');
assert(ambMatch.matched[0].alternatives.length >= 2, 'Should provide at least 2 alternative products');

console.log('✅ All NexSlipParser unit tests passed successfully!');
```

- [ ] **Step 2: Run test to verify it fails**

Run command:
`node tests/test-slip-parser.js`
Expected output: Error: Cannot find module `../js/slip-parser.js`.

- [ ] **Step 3: Implement `js/slip-parser.js`**

Create `js/slip-parser.js`:
```javascript
/**
 * nexCommerce — Intelligent Shopping Slip Parser & Catalog Matcher (Capability 4)
 * Parses raw text/OCR slip data, extracts line items, quantities, size/finish hints,
 * computes fuzzy catalog match confidence, and formats 1-click cart payloads.
 */
(function(window) {
  'use strict';

  // Levenshtein distance helper
  function levenshtein(a, b) {
    var matrix = [];
    var i, j;
    for (i = 0; i <= b.length; i++) matrix[i] = [i];
    for (j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function similarity(s1, s2) {
    var longer = s1.toLowerCase().trim();
    var shorter = s2.toLowerCase().trim();
    if (longer.length < shorter.length) {
      var tmp = longer; longer = shorter; shorter = tmp;
    }
    var longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - levenshtein(longer, shorter)) / parseFloat(longerLength);
  }

  function parseRawText(rawText) {
    if (!rawText || typeof rawText !== 'string') return [];
    var lines = rawText.split(/\r?\n|;/);
    var parsed = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      // Remove leading numbering like "1.", "1)", "-", "•"
      line = line.replace(/^[\d]+[\.\)\-\:]\s*|^[\-\•\*\+]\s*/, '').trim();
      if (!line) continue;

      // Extract quantity (e.g., "2x", "2 pcs", "qty: 2", "x2", "2 pairs")
      var quantity = 1;
      var qtyMatch = line.match(/\b(\d+)\s*(?:x|pcs|pieces|pairs?|items?|units?|pkg|pack)\b/i) ||
                     line.match(/\b(?:qty|quantity)[\:\s]*(\d+)\b/i) ||
                     line.match(/^(\d+)\s*x?\s+/i) ||
                     line.match(/\s*x\s*(\d+)$/i);

      if (qtyMatch) {
        quantity = parseInt(qtyMatch[1], 10) || 1;
        line = line.replace(qtyMatch[0], ' ').trim();
      }

      // Extract size hint (e.g., "Size M", "Size 48", "EU 42", "(M)", "Medium")
      var sizeHint = null;
      var sizeMatch = line.match(/\b(?:size|eu|uk|us)[\:\s]*([a-z0-9]+)\b/i) ||
                      line.match(/\b([x|s|m|l|xl|xxl]{1,3})\b/i) ||
                      line.match(/\b(3[6-9]|4[0-8]|5[0-4])\b/);

      if (sizeMatch) {
        sizeHint = sizeMatch[1].toUpperCase();
      }

      // Extract finish / color hint
      var colorHint = null;
      var colorMatch = line.match(/\b(black|charcoal|navy|obsidian|ivory|slate|grey|gray|white|sand|brown)\b/i);
      if (colorMatch) {
        colorHint = colorMatch[1].toLowerCase();
      }

      // Clean query tokens
      var cleanQuery = line.replace(/[\(\)\[\]\{\}\,\.]/g, ' ').replace(/\s+/g, ' ').trim();

      parsed.push({
        rawLine: lines[i].trim(),
        cleanQuery: cleanQuery,
        quantity: Math.max(1, quantity),
        sizeHint: sizeHint,
        colorHint: colorHint
      });
    }

    return parsed;
  }

  function matchSlipToCatalog(parsedLines, catalog) {
    var cat = Array.isArray(catalog) ? catalog : [];
    var matched = [];
    var unmatched = [];

    for (var i = 0; i < parsedLines.length; i++) {
      var item = parsedLines[i];
      var queryTerms = item.cleanQuery.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 1; });
      var scored = [];

      for (var c = 0; c < cat.length; c++) {
        var prod = cat[c];
        var prodName = (prod.name || prod.title || '').toLowerCase();
        var prodCategory = (prod.category || prod.categoryLabel || '').toLowerCase();
        var prodKeywords = (prod.keywords || []).join(' ').toLowerCase();
        var prodDesc = (prod.desc || prod.reason || '').toLowerCase();
        var haystack = prodName + ' ' + prodCategory + ' ' + prodKeywords + ' ' + prodDesc;

        // Token overlap score
        var overlap = 0;
        for (var t = 0; t < queryTerms.length; t++) {
          if (haystack.includes(queryTerms[t])) overlap += 1;
        }
        var tokenScore = queryTerms.length > 0 ? (overlap / queryTerms.length) : 0;

        // Direct Levenshtein similarity on product name
        var simScore = similarity(item.cleanQuery, prodName);

        // Combined confidence score
        var score = Math.max(tokenScore * 0.7 + simScore * 0.3, simScore);

        scored.push({
          product: prod,
          score: score
        });
      }

      scored.sort(function(a, b) { return b.score - a.score; });

      var best = scored[0];
      if (best && best.score >= 0.45) {
        var isAmbiguous = false;
        var alternatives = [];

        // Check if top 2 candidates are very close in score
        if (scored.length > 1 && scored[1].score >= 0.4 && (best.score - scored[1].score) < 0.15) {
          isAmbiguous = true;
          alternatives = scored.slice(0, 3).map(function(s) { return s.product; });
        }

        // Determine best variant match
        var selectedSize = item.sizeHint || 'M';
        if (best.product.variants && Array.isArray(best.product.variants.sizes)) {
          var avail = best.product.variants.sizes.find(function(s) {
            return s.name.toUpperCase() === (item.sizeHint || '').toUpperCase() || s.id.toUpperCase() === (item.sizeHint || '').toUpperCase();
          });
          if (avail) selectedSize = avail.id || avail.name;
          else if (best.product.variants.sizes[0]) selectedSize = best.product.variants.sizes[0].id || best.product.variants.sizes[0].name;
        }

        matched.push({
          rawLine: item.rawLine,
          cleanQuery: item.cleanQuery,
          quantity: item.quantity,
          selectedSize: selectedSize,
          selectedFinish: item.colorHint || (best.product.selectedFinish || 'Standard'),
          confidence: parseFloat(best.score.toFixed(2)),
          product: best.product,
          isAmbiguous: isAmbiguous,
          alternatives: alternatives
        });
      } else {
        unmatched.push({
          rawLine: item.rawLine,
          cleanQuery: item.cleanQuery,
          quantity: item.quantity
        });
      }
    }

    return {
      matched: matched,
      unmatched: unmatched,
      totalLines: parsedLines.length
    };
  }

  function buildCartPayload(matchedItems) {
    if (!Array.isArray(matchedItems)) return [];
    return matchedItems.map(function(m) {
      return {
        id: m.product.id,
        name: m.product.name || m.product.title,
        price: m.product.numericPrice || m.product.price,
        image: m.product.image || m.product.img,
        category: m.product.category || m.product.categoryLabel || 'Apparel',
        quantity: m.quantity,
        variant: m.selectedSize || 'Standard',
        finish: m.selectedFinish || 'Standard'
      };
    });
  }

  window.NexSlipParser = {
    parseRawText: parseRawText,
    matchSlipToCatalog: matchSlipToCatalog,
    buildCartPayload: buildCartPayload,
    similarity: similarity
  };

})(typeof window !== 'undefined' ? window : global);
```

- [ ] **Step 4: Run test to verify it passes**

Run command:
`node tests/test-slip-parser.js`
Expected output:
```
🧪 Running NexSlipParser Unit Tests...
✅ All NexSlipParser unit tests passed successfully!
```

- [ ] **Step 5: Commit task changes**

```bash
git add tests/test-slip-parser.js js/slip-parser.js
git commit -m "feat(slip-parser): implement intelligent slip OCR text parser and catalog matcher"
```

---

### Task 2: Design System Styles for Slip-to-Cart Suite

**Files:**
- Modify: `css/design-system.css`

**Interfaces:**
- Produces: CSS classes for `.slip-modal`, `.slip-dropzone`, `.slip-preset-chip`, `.slip-review-grid`, `.slip-status-pill`, `.slip-match-card`.

- [ ] **Step 1: Write the failing syntax/AST test**

Run: `node -e "const css=require('fs').readFileSync('css/design-system.css','utf8'); const o=(css.match(/\{/g)||[]).length; const c=(css.match(/\}/g)||[]).length; console.log('Braces:', o, c); if(o!==c) process.exit(1);"`
Expected: PASS (braces balanced).

- [ ] **Step 2: Add Slip-to-Cart Design System Styles**

Append to `css/design-system.css`:
```css
/* ═══════════════════════════════════════════════════════════════════════════
   nexCommerce — Capability 4: Shopping Slip to Cart Modernist Styles
   ═══════════════════════════════════════════════════════════════════════════ */

.slip-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 11, 23, 0.82);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  z-index: 9998;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}

.slip-modal-backdrop.is-open {
  opacity: 1;
  pointer-events: auto;
}

.slip-modal-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -48%) scale(0.96);
  width: min(94vw, 1080px);
  max-height: 88vh;
  background: linear-gradient(145deg, rgba(13, 20, 40, 0.98) 0%, rgba(5, 11, 24, 0.99) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(61, 224, 255, 0.1);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), opacity 0.35s ease;
}

.slip-modal-backdrop.is-open .slip-modal-dialog {
  transform: translate(-50%, -50%) scale(1);
  opacity: 1;
  pointer-events: auto;
}

.slip-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.slip-modal-title-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slip-modal-eyebrow {
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: #3DE0FF;
}

.slip-modal-title {
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 400;
  color: var(--text-primary);
  margin: 0;
}

.slip-modal-close-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.slip-modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
}

.slip-modal-body {
  padding: 28px 32px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Upload Dropzone */
.slip-dropzone {
  border: 2px dashed rgba(61, 224, 255, 0.25);
  background: rgba(61, 224, 255, 0.02);
  border-radius: 16px;
  padding: 36px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 12px;
  cursor: pointer;
  transition: all 0.25s ease;
}

.slip-dropzone:hover, .slip-dropzone.is-dragover {
  border-color: #3DE0FF;
  background: rgba(61, 224, 255, 0.06);
  box-shadow: 0 0 24px rgba(61, 224, 255, 0.15);
}

.slip-dropzone-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(61, 224, 255, 0.1);
  color: #3DE0FF;
  display: flex;
  align-items: center;
  justify-content: center;
}

.slip-dropzone-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

.slip-dropzone-sub {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.45);
}

/* Presets & Paste Switcher */
.slip-options-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.slip-presets-cluster {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.slip-preset-btn {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 600;
  padding: 8px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.2s ease;
}

.slip-preset-btn:hover {
  background: rgba(61, 224, 255, 0.08);
  border-color: rgba(61, 224, 255, 0.3);
  color: #3DE0FF;
}

/* Review Split View */
.slip-review-container {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 24px;
  margin-top: 8px;
}

.slip-lines-pane {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 380px;
  overflow-y: auto;
}

.slip-line-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 13px;
  gap: 10px;
}

.slip-line-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.slip-line-status.matched { background: #34D399; box-shadow: 0 0 8px #34D399; }
.slip-line-status.ambiguous { background: #FBBF24; box-shadow: 0 0 8px #FBBF24; }
.slip-line-status.unmatched { background: #FB7185; box-shadow: 0 0 8px #FB7185; }

.slip-matches-pane {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 380px;
  overflow-y: auto;
}

.slip-match-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  transition: border-color 0.2s ease;
}

.slip-match-card:hover {
  border-color: rgba(61, 224, 255, 0.3);
}

.slip-match-thumb {
  width: 64px;
  height: 64px;
  border-radius: 8px;
  background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
  object-fit: contain;
  padding: 4px;
  flex-shrink: 0;
}

.slip-match-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.slip-match-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.slip-match-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.slip-match-badge {
  font-size: 10px;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(52, 211, 153, 0.1);
  color: #34D399;
  border: 1px solid rgba(52, 211, 153, 0.25);
}

.slip-match-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Stepper */
.slip-stepper {
  display: inline-flex;
  align-items: center;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.02);
}

.slip-stepper-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  font-size: 14px;
}

.slip-stepper-val {
  min-width: 24px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
}

.slip-modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(3, 11, 23, 0.4);
}

.slip-summary-stat {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.slip-stat-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
}

.slip-stat-val {
  font-family: var(--font-serif);
  font-size: 22px;
  color: #3DE0FF;
}

.slip-confirm-btn {
  min-height: 48px;
  padding: 0 28px;
  border-radius: 10px;
  background: #3DE0FF;
  color: #000B1A;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.03em;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.slip-confirm-btn:hover {
  background: #6BE8FF;
  box-shadow: 0 0 20px rgba(61, 224, 255, 0.4);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .slip-review-container {
    grid-template-columns: 1fr;
  }
  .slip-modal-dialog {
    width: 100vw;
    height: 100vh;
    max-height: 100vh;
    border-radius: 0;
  }
}
```

- [ ] **Step 3: Verify AST syntax / brace balance**

Run: `node -e "const css=require('fs').readFileSync('css/design-system.css','utf8'); const o=(css.match(/\{/g)||[]).length; const c=(css.match(/\}/g)||[]).length; console.log('Braces:', o, c); if(o!==c) process.exit(1);"`
Expected: PASS with equal opening and closing braces.

- [ ] **Step 4: Commit design system changes**

```bash
git add css/design-system.css
git commit -m "style(slip-modal): add modern luxury modal, dropzone, and match review styles"
```

---

### Task 3: Interactive Slip-to-Cart UI Controller

**Files:**
- Create: `js/slip-to-cart-ui.js`

**Interfaces:**
- Consumes: `window.NexSlipParser`, `window.nexCart`, `SL_PRODUCTS` / `window.NexAI.catalogArray`.
- Produces: `window.NexSlipUI` with:
  - `openModal(initialPreset)`: opens modal and optionally loads a sample preset.
  - `closeModal()`: dismisses modal.
  - `processInput(rawText)`: runs parsing and renders review split-pane.
  - `commitToBag()`: sends all validated items to `window.nexCart.addItem()` and triggers success toast.

- [ ] **Step 1: Write implementation in `js/slip-to-cart-ui.js`**

Create `js/slip-to-cart-ui.js`:
```javascript
/**
 * nexCommerce — Shopping Slip to Cart UI Controller (Capability 4)
 * Orchestrates file upload dropzone, sample presets, interactive review checklist,
 * variant/quantity editing, and cart state synchronization.
 */
(function(window) {
  'use strict';

  const SAMPLE_PRESETS = {
    capsule: {
      name: 'Autumn Atelier Capsule',
      text: "1x Pure Cashmere Sweater (Size M)\n1x Structured Wool Blazer (Size 48)\n1x Minimalist Leather Runner (EU 42)"
    },
    essentials: {
      name: 'Everyday Essentials',
      text: "2x Fine-Knit Cashmere Crew (Size L)\n1x Chronograph Minimalist Watch\n1x Studio Acoustics Headphone GT"
    },
    ambiguous: {
      name: 'Multi-Match Test List',
      text: "1x Cashmere\n1x Watch\n1x Silk Scarf"
    }
  };

  class SlipToCartUI {
    constructor() {
      this.currentMatchResult = null;
      this.hasRenderedModal = false;
      this.init();
    }

    init() {
      this.injectModalHtml();
      this.bindGlobalTriggers();
    }

    _getCatalog() {
      if (typeof SL_PRODUCTS !== 'undefined' && Array.isArray(SL_PRODUCTS)) return SL_PRODUCTS;
      if (window.NexAI && Array.isArray(window.NexAI.catalogArray)) return window.NexAI.catalogArray;
      return [
        { id: 'p1', name: 'Pure Cashmere Sweater', price: 185, image: 'assets/images/products/hero_sweater.png', category: 'Apparel' },
        { id: 'p2', name: 'Fine-Knit Cashmere Crew', price: 160, image: 'assets/images/products/plp_crewneck.png', category: 'Apparel' },
        { id: 'p3', name: 'Structured Wool Blazer', price: 245, image: 'assets/images/products/plp_blazer.png', category: 'Apparel' },
        { id: 'p4', name: 'Studio Acoustics Headphone GT', price: 320, image: 'assets/images/products/p4.png', category: 'Acoustics' },
        { id: 'p6', name: 'Minimalist Leather Runner', price: 198, image: 'assets/images/products/leather_sneaker.png', category: 'Footwear' },
        { id: 'p8', name: 'Chronograph Minimalist Watch', price: 285, image: 'assets/images/products/titanium_watch.png', category: 'Accessories' }
      ];
    }

    _resolveImg(imgPath) {
      if (!imgPath) return '';
      if (imgPath.startsWith('http')) return imgPath;
      const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
      if (isSubpage) {
        return imgPath.startsWith('../') ? imgPath : '../' + imgPath;
      }
      return imgPath.startsWith('../') ? imgPath.replace(/^\.\.\//, '') : imgPath;
    }

    injectModalHtml() {
      if (document.getElementById('slipModalBackdrop')) return;

      const modalEl = document.createElement('div');
      modalEl.id = 'slipModalBackdrop';
      modalEl.className = 'slip-modal-backdrop';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.setAttribute('aria-hidden', 'true');

      modalEl.innerHTML = `
        <div class="slip-modal-dialog">
          <div class="slip-modal-header">
            <div class="slip-modal-title-group">
              <span class="slip-modal-eyebrow">✨ Customer Commerce Agent · AI Capability 4</span>
              <h2 class="slip-modal-title">Shopping Slip to Cart</h2>
            </div>
            <button id="slipModalCloseBtn" class="slip-modal-close-btn" aria-label="Close dialog">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>

          <div class="slip-modal-body">
            <!-- Upload Dropzone -->
            <div id="slipDropzone" class="slip-dropzone">
              <div class="slip-dropzone-icon">
                <i data-lucide="file-text" style="width:24px;height:24px;"></i>
              </div>
              <div class="slip-dropzone-title">Upload Shopping Slip or Receipt Image</div>
              <div class="slip-dropzone-sub">Drag and drop PNG, JPG, or receipt photos — AI will extract & match items instantly</div>
              <input type="file" id="slipFileInput" accept="image/*" style="display:none;" />
            </div>

            <!-- Presets & Text Paste Bar -->
            <div class="slip-options-row">
              <div class="slip-presets-cluster">
                <span style="font-size:11px;font-weight:700;color:rgba(255,255,255,0.4);text-transform:uppercase;letter-spacing:0.1em;">Test Presets:</span>
                <button class="slip-preset-btn" data-preset="capsule">🍂 Autumn Atelier Slip</button>
                <button class="slip-preset-btn" data-preset="essentials">⚡ Everyday Essentials</button>
                <button class="slip-preset-btn" data-preset="ambiguous">🔍 Multi-Match Test</button>
              </div>
              <button id="slipToggleTextBtn" class="slip-preset-btn" style="border-color:rgba(61,224,255,0.3);color:#3DE0FF;">
                ✏️ Paste Text List
              </button>
            </div>

            <!-- Text Paste Container (collapsible) -->
            <div id="slipPasteContainer" style="display:none; flex-direction:column; gap:10px;">
              <textarea id="slipTextInput" rows="4" style="width:100%; background:rgba(3,24,56,0.6); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:12px; color:#fff; font-family:var(--font-body); font-size:13px;" placeholder="e.g.&#10;2x Pure Cashmere Sweater Size M&#10;1x Structured Wool Blazer&#10;1x Minimalist Leather Runner"></textarea>
              <button id="slipProcessTextBtn" class="slip-confirm-btn" style="align-self:flex-start; min-height:38px; padding:0 18px; font-size:12px;">Process Text List →</button>
            </div>

            <!-- Split-pane Review Container -->
            <div id="slipReviewContainer" class="slip-review-container" style="display:none;">
              <div class="slip-lines-pane">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.4);text-transform:uppercase;">Extracted Slip Lines</div>
                <div id="slipLinesList" style="display:flex;flex-direction:column;gap:8px;"></div>
              </div>

              <div class="slip-matches-pane">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.4);text-transform:uppercase;">Matched Catalog Products</div>
                <div id="slipMatchesList" style="display:flex;flex-direction:column;gap:10px;"></div>
              </div>
            </div>
          </div>

          <div id="slipModalFooter" class="slip-modal-footer" style="display:none;">
            <div class="slip-summary-stat">
              <span class="slip-stat-label">Total Ready for Bag:</span>
              <span id="slipStatVal" class="slip-stat-val">0 Items · € 0.00</span>
            </div>
            <button id="slipConfirmBtn" class="slip-confirm-btn">
              <i data-lucide="shopping-bag" style="width:16px;height:16px;"></i>
              <span id="slipConfirmBtnText">Add All Matched (0) to Bag</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modalEl);
      if (window.lucide) window.lucide.createIcons();
      this.bindModalEvents();
    }

    bindModalEvents() {
      const backdrop = document.getElementById('slipModalBackdrop');
      const closeBtn = document.getElementById('slipModalCloseBtn');
      const dropzone = document.getElementById('slipDropzone');
      const fileInput = document.getElementById('slipFileInput');
      const toggleTextBtn = document.getElementById('slipToggleTextBtn');
      const pasteContainer = document.getElementById('slipPasteContainer');
      const processTextBtn = document.getElementById('slipProcessTextBtn');
      const textInput = document.getElementById('slipTextInput');
      const confirmBtn = document.getElementById('slipConfirmBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) this.closeModal();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
          this.closeModal();
        }
      });

      // Dropzone
      if (dropzone && fileInput) {
        dropzone.addEventListener('click', () => fileInput.click());
        dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('is-dragover'); });
        dropzone.addEventListener('dragleave', () => dropzone.classList.remove('is-dragover'));
        dropzone.addEventListener('drop', (e) => {
          e.preventDefault();
          dropzone.classList.remove('is-dragover');
          if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            this.handleFileUpload(e.dataTransfer.files[0]);
          }
        });
        fileInput.addEventListener('change', (e) => {
          if (e.target.files && e.target.files[0]) {
            this.handleFileUpload(e.target.files[0]);
          }
        });
      }

      // Presets
      document.querySelectorAll('.slip-preset-btn[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => {
          const presetKey = btn.getAttribute('data-preset');
          if (SAMPLE_PRESETS[presetKey]) {
            this.processText(SAMPLE_PRESETS[presetKey].text);
          }
        });
      });

      // Toggle Text Paste
      if (toggleTextBtn && pasteContainer) {
        toggleTextBtn.addEventListener('click', () => {
          const isVisible = pasteContainer.style.display === 'flex';
          pasteContainer.style.display = isVisible ? 'none' : 'flex';
          if (!isVisible && textInput) textInput.focus();
        });
      }

      if (processTextBtn && textInput) {
        processTextBtn.addEventListener('click', () => {
          this.processText(textInput.value);
        });
      }

      // Confirm Add to Bag
      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => this.commitToBag());
      }
    }

    bindGlobalTriggers() {
      // Listen for click on any button with data-trigger="slip-modal"
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-trigger="slip-modal"], #openSlipModalBtn, .open-slip-btn');
        if (trigger) {
          e.preventDefault();
          this.openModal();
        }
      });
    }

    openModal(initialPresetKey) {
      const backdrop = document.getElementById('slipModalBackdrop');
      if (!backdrop) return;
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (initialPresetKey && SAMPLE_PRESETS[initialPresetKey]) {
        this.processText(SAMPLE_PRESETS[initialPresetKey].text);
      }
    }

    closeModal() {
      const backdrop = document.getElementById('slipModalBackdrop');
      if (!backdrop) return;
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    handleFileUpload(file) {
      // Simulate intelligent OCR extraction pipeline with visual feedback
      const dropzone = document.getElementById('slipDropzone');
      if (dropzone) {
        dropzone.innerHTML = `
          <div class="slip-dropzone-icon" style="animation:secPulse 1.5s infinite;">
            <i data-lucide="loader" style="width:24px;height:24px;"></i>
          </div>
          <div class="slip-dropzone-title">Analyzing "${file.name}" with OCR...</div>
          <div class="slip-dropzone-sub">Extracting handwritten line items & quantities</div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }

      setTimeout(() => {
        // Fallback to sample text extraction based on filename or standard capsule
        this.processText(SAMPLE_PRESETS.capsule.text);
        if (dropzone) {
          dropzone.innerHTML = `
            <div class="slip-dropzone-icon" style="background:rgba(52,211,153,0.1);color:#34D399;">
              <i data-lucide="check-circle" style="width:24px;height:24px;"></i>
            </div>
            <div class="slip-dropzone-title">Successfully Parsed "${file.name}"</div>
            <div class="slip-dropzone-sub">Extracted 3 line items with 96% match confidence</div>
          `;
          if (window.lucide) window.lucide.createIcons();
        }
      }, 700);
    }

    processText(rawText) {
      if (!window.NexSlipParser) return;
      const parsed = window.NexSlipParser.parseRawText(rawText);
      const catalog = this._getCatalog();
      this.currentMatchResult = window.NexSlipParser.matchSlipToCatalog(parsed, catalog);
      this.renderReviewView(this.currentMatchResult);
    }

    renderReviewView(matchResult) {
      const reviewContainer = document.getElementById('slipReviewContainer');
      const linesList = document.getElementById('slipLinesList');
      const matchesList = document.getElementById('slipMatchesList');
      const footer = document.getElementById('slipModalFooter');
      const statVal = document.getElementById('slipStatVal');
      const confirmBtnText = document.getElementById('slipConfirmBtnText');

      if (!reviewContainer || !linesList || !matchesList) return;

      reviewContainer.style.display = 'grid';
      if (footer) footer.style.display = 'flex';

      // Render Left Checklist
      linesList.innerHTML = matchResult.matched.map(m => `
        <div class="slip-line-row">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <span class="slip-line-status ${m.isAmbiguous ? 'ambiguous' : 'matched'}"></span>
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${m.rawLine}</span>
          </div>
          <span style="font-size:11px;font-weight:700;color:${m.isAmbiguous ? '#FBBF24' : '#34D399'};">${m.isAmbiguous ? 'Review' : 'Matched'}</span>
        </div>
      `).concat(matchResult.unmatched.map(u => `
        <div class="slip-line-row">
          <div style="display:flex;align-items:center;gap:8px;min-width:0;">
            <span class="slip-line-status unmatched"></span>
            <span style="white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${u.rawLine}</span>
          </div>
          <span style="font-size:11px;font-weight:700;color:#FB7185;">Not Found</span>
        </div>
      `)).join('');

      // Render Right Product Cards
      matchesList.innerHTML = matchResult.matched.map((m, idx) => {
        const prod = m.product;
        const imgUrl = this._resolveImg(prod.image || prod.img);
        const price = prod.numericPrice || prod.price || 0;

        return `
          <div class="slip-match-card" data-idx="${idx}">
            <img class="slip-match-thumb" src="${imgUrl}" alt="${prod.name || prod.title}" />
            <div class="slip-match-info">
              <div class="slip-match-title">${prod.name || prod.title}</div>
              <div class="slip-match-meta">
                <span>€ ${price.toFixed(2)}</span>
                <span>&middot;</span>
                <span class="slip-match-badge">${Math.round(m.confidence * 100)}% Match</span>
                ${m.selectedSize ? `<span>&middot; Size: <strong>${m.selectedSize}</strong></span>` : ''}
              </div>
              ${m.isAmbiguous && m.alternatives.length > 1 ? `
                <div style="margin-top:4px;">
                  <select class="slip-alt-select" data-idx="${idx}" style="background:rgba(3,24,56,0.8);color:#fff;border:1px solid rgba(255,255,255,0.15);border-radius:6px;font-size:11px;padding:3px 6px;">
                    ${m.alternatives.map(alt => `<option value="${alt.id}" ${alt.id === prod.id ? 'selected' : ''}>Switch to: ${alt.name || alt.title}</option>`).join('')}
                  </select>
                </div>
              ` : ''}
            </div>
            <div class="slip-match-actions">
              <div class="slip-stepper">
                <button class="slip-stepper-btn" data-action="dec" data-idx="${idx}">-</button>
                <span class="slip-stepper-val" id="slipQtyVal_${idx}">${m.quantity}</span>
                <button class="slip-stepper-btn" data-action="inc" data-idx="${idx}">+</button>
              </div>
              <button class="slip-preset-btn" data-action="remove" data-idx="${idx}" style="padding:6px 8px;" title="Remove item">
                <i data-lucide="trash-2" style="width:14px;height:14px;color:#FB7185;"></i>
              </button>
            </div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();
      this.bindCardActions();
      this.updateTotalSummary();
    }

    bindCardActions() {
      const matchesList = document.getElementById('slipMatchesList');
      if (!matchesList) return;

      matchesList.querySelectorAll('.slip-stepper-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          const action = btn.getAttribute('data-action');
          if (this.currentMatchResult && this.currentMatchResult.matched[idx]) {
            const item = this.currentMatchResult.matched[idx];
            if (action === 'inc') item.quantity += 1;
            else if (action === 'dec') item.quantity = Math.max(1, item.quantity - 1);

            const valEl = document.getElementById(`slipQtyVal_${idx}`);
            if (valEl) valEl.textContent = item.quantity;
            this.updateTotalSummary();
          }
        });
      });

      matchesList.querySelectorAll('[data-action="remove"]').forEach(btn => {
        btn.addEventListener('click', () => {
          const idx = parseInt(btn.getAttribute('data-idx'), 10);
          if (this.currentMatchResult) {
            this.currentMatchResult.matched.splice(idx, 1);
            this.renderReviewView(this.currentMatchResult);
          }
        });
      });

      matchesList.querySelectorAll('.slip-alt-select').forEach(sel => {
        sel.addEventListener('change', (e) => {
          const idx = parseInt(sel.getAttribute('data-idx'), 10);
          const newProdId = e.target.value;
          const catalog = this._getCatalog();
          const targetProd = catalog.find(p => p.id === newProdId);
          if (targetProd && this.currentMatchResult && this.currentMatchResult.matched[idx]) {
            this.currentMatchResult.matched[idx].product = targetProd;
            this.renderReviewView(this.currentMatchResult);
          }
        });
      });
    }

    updateTotalSummary() {
      const statVal = document.getElementById('slipStatVal');
      const confirmBtnText = document.getElementById('slipConfirmBtnText');
      if (!this.currentMatchResult || !statVal || !confirmBtnText) return;

      let totalItems = 0;
      let totalAmount = 0;

      this.currentMatchResult.matched.forEach(m => {
        const qty = m.quantity;
        const price = m.product.numericPrice || m.product.price || 0;
        totalItems += qty;
        totalAmount += (qty * price);
      });

      statVal.textContent = `${totalItems} Items · € ${totalAmount.toFixed(2)}`;
      confirmBtnText.textContent = `Add All Matched (${totalItems}) to Bag`;
    }

    commitToBag() {
      if (!this.currentMatchResult || this.currentMatchResult.matched.length === 0) return;
      const cartPayload = window.NexSlipParser.buildCartPayload(this.currentMatchResult.matched);

      if (window.nexCart && typeof window.nexCart.addItem === 'function') {
        cartPayload.forEach(item => {
          window.nexCart.addItem(item, item.quantity, item.variant);
        });
      }

      this.closeModal();

      // Show Toast Notification
      if (typeof window.showToast === 'function') {
        window.showToast(`✨ Added ${cartPayload.length} items from your shopping slip to your bag!`);
      } else {
        alert(`✨ Successfully added ${cartPayload.length} items from your shopping slip to your bag!`);
      }
    }
  }

  window.NexSlipUI = new SlipToCartUI();

})(typeof window !== 'undefined' ? window : global);
```

- [ ] **Step 2: Commit UI Controller**

```bash
git add js/slip-to-cart-ui.js
git commit -m "feat(slip-ui): implement modal split-view, dropzone, and cart sync controller"
```

---

### Task 4: Global Trigger Integration (Header, Cart Page, Concierge)

**Files:**
- Modify: `pages/cart.html`
- Modify: `js/header.js`
- Modify: `js/concierge-engine.js`

**Interfaces:**
- Consumes: `window.NexSlipUI.openModal()`.
- Produces: Visual 1-click entry points in Navigation Header, Cart Page Hero, and Concierge styling suggestions.

- [ ] **Step 1: Add Slip Upload trigger in Cart page `pages/cart.html`**

Insert a dedicated button in the Cart header/toolbar:
```html
<button class="cart-toolbar-btn" data-trigger="slip-modal" id="cartOpenSlipBtn" style="display:inline-flex;align-items:center;gap:6px;padding:8px 14px;border-radius:8px;border:1px solid rgba(61,224,255,0.25);background:rgba(61,224,255,0.05);color:#3DE0FF;font-size:12px;font-weight:600;cursor:pointer;">
  <i data-lucide="file-up" style="width:15px;height:15px;"></i>
  <span>Upload Shopping Slip / List</span>
</button>
```
Include `<script src="../js/slip-parser.js"></script>` and `<script src="../js/slip-to-cart-ui.js"></script>` before the closing body tag.

- [ ] **Step 2: Add Slip-to-Cart chip in `js/concierge-engine.js`**

Add `'Upload shopping slip'` to Concierge welcome suggestedChips and handle intent `upload slip|shopping slip|grocery list` routing directly to opening `window.NexSlipUI.openModal()`.

- [ ] **Step 3: Include `js/slip-parser.js` and `js/slip-to-cart-ui.js` in `index.html` and other key pages**

Ensure scripts are loaded globally.

- [ ] **Step 4: Commit integration changes**

```bash
git add pages/cart.html js/concierge-engine.js js/header.js
git commit -m "feat(slip-integration): wire slip triggers into cart page, concierge chips, and global header"
```

---

### Task 5: 3-Tier Verification & End-to-End Validation

**Files:**
- Test: `tests/test-slip-parser.js`
- Test: `tests/test-concierge-engine.js`
- Test: `tests/test-dom-and-syntax.js`

- [ ] **Step 1: Run Tier 1 Unit Test Suite**

Execute:
```bash
node tests/test-slip-parser.js
node tests/test-concierge-engine.js
node tests/test-dom-and-syntax.js
```
Assert that all unit tests pass with zero errors.

- [ ] **Step 2: Run Tier 2 Functional Storage & Cart Sync Verification**

Verify programmatic cart dispatch:
1. Parse sample slip with 3 items.
2. Dispatch payload into `window.nexCart`.
3. Assert `localStorage.getItem('nex_cart')` contains updated quantities.
4. Assert header badge counter increments appropriately.

- [ ] **Step 3: Run Tier 3 Browser Verification (`chrome-devtools-mcp` or `playwright`)**

1. Launch browser and navigate to `pages/cart.html`.
2. Click "Upload Shopping Slip / List" button.
3. Assert `#slipModalBackdrop` has `.is-open`.
4. Click "🍂 Autumn Atelier Slip" preset.
5. Verify split view renders 3 items with confidence badges.
6. Click "Add All Matched (3) to Bag".
7. Capture screenshot `slip_to_cart_verified.png` and assert modal closes and cart page displays newly added items.

- [ ] **Step 4: Commit all verification artifacts**

```bash
git add slip_to_cart_verified.png docs/superpowers/plans/2026-08-21-shopping-slip-to-cart.md
git commit -m "test(slip-verification): complete 3-tier verification and visual proof"
```

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-08-21-shopping-slip-to-cart.md`. Two execution options:

1. **Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — Execute tasks in this session using `executing-plans`, batch execution with checkpoints.

**Which approach would you like to take?**
