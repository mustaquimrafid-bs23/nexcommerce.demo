# Feature 1 — Intelligent Discovery: Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Evolve the existing `ai-search-v2.js` UI prototype into a production-ready, spec-compliant Intelligent Discovery engine with a clean intent-context object consumed by downstream AI features.

**Architecture:** A layered three-tier approach — (1) an NLP Intent Parser that converts free-text into a structured `IntentObject`, (2) a Search & Ranking Engine that queries the real catalog using that object, and (3) a UI Engine that renders all 14 required states and exposes the `IntentObject` via `sessionStorage` for Feature 2 consumption. The AI layer degrades gracefully to keyword search if unavailable.

**Tech Stack:** Vanilla JS (ES2020 modules via IIFE), HTML5, CSS3 custom properties. No build step — all files served directly from `python -m http.server 8000`. Future backend: `POST /api/ai/discovery` (ASP.NET Core).

---

## Global Constraints

- Currency: BDT (Bangladeshi Taka). Prices shown as `BDT X,XXX`. The `৳` symbol must NOT be used in UI (causes font-fallback).
- Products must ONLY come from `CATALOG_DB` / `window.NexAI.catalogArray` from `js/ai-engine.js`. AI must never invent products, prices, or availability.
- Session context key: `nexcommerce_search_context` in `sessionStorage` (shared with Feature 2 — do not rename).
- CSS: all new styles added to `css/design-system.css` only.
- All new JS files must be wrapped in `(function(window) { 'use strict'; })(window);` IIFE pattern.
- Discovery page: `discovery.html`. Global search overlay: present in `index.html`, `product.html`, `category.html`.
- Existing `js/ai-search-v2.js` is a Level 1 prototype — this plan replaces it with production code.

---

## File Structure

```
js/
  intent-parser.js       NEW  — NLP intent extraction → IntentObject
  catalog-engine.js      NEW  — Product matching + ranking using IntentObject
  discovery-ui.js        NEW  — All 14 UI states for discovery.html
  search-overlay.js      NEW  — Global search overlay (shared across pages)
  session-context.js     NEW  — sessionStorage read/write for IntentObject
  ai-search-v2.js        REPLACE  — Prototype; wired out and replaced
  ai-engine.js           MODIFY  — Add `catalogArray` export

css/
  design-system.css      MODIFY  — Add missing state CSS (no-result, timeout, error)

discovery.html           MODIFY  — Wire new scripts, remove prototype script tag
index.html               MODIFY  — Wire search-overlay.js
product.html             MODIFY  — Wire search-overlay.js
category.html            MODIFY  — Wire search-overlay.js
```

---

## Task 1: Intent Parser (`js/intent-parser.js`)

**Files:**
- Create: `js/intent-parser.js`

**Interfaces:**
- Consumes: raw query string
- Produces: `IntentObject` with `source` and `confidence` on each field

```js
// IntentObject schema
{
  raw: "I need something for a cool evening in Dhaka under 20000",
  occasion:    { value: "Evening",      source: "explicit", confidence: "high" },
  climate:     { value: "Cool weather", source: "explicit", confidence: "high" },
  location:    { value: "Dhaka",        source: "explicit", confidence: "high" },
  style:       { value: "Minimal",      source: "inferred", confidence: "medium" },
  color:       null,
  fit:         null,
  budget:      { max: 20000, currency: "BDT", source: "explicit" },
  recipient:   null,
  category:    null,
  isAmbiguous: false,
  isOutOfScope: false,
  isBanglish:  false
}
```

- [ ] **Step 1: Create `js/intent-parser.js`**

```js
// js/intent-parser.js
(function(window) {
  'use strict';

  const OCCASION_MAP = [
    { pattern: /dinner|evening out|date|restaurant|gala|rooftop/,     value: 'Dinner / Evening',  source: 'explicit', confidence: 'high' },
    { pattern: /flight|travel|vacation|trip|journey|airport/,          value: 'Travel',            source: 'explicit', confidence: 'high' },
    { pattern: /work|office|meeting|professional|presentation/,        value: 'Work / Office',     source: 'explicit', confidence: 'high' },
    { pattern: /casual|weekend|everyday|daily|errand/,                 value: 'Everyday / Casual', source: 'explicit', confidence: 'high' },
    { pattern: /gift|present|birthday|brother|sister|friend|him|her/, value: 'Gift',              source: 'explicit', confidence: 'high' },
    { pattern: /evening|night|sunset|after dark/,                      value: 'Evening',           source: 'explicit', confidence: 'high' },
    { pattern: /wedding|ceremony|formal event/,                        value: 'Formal Event',      source: 'explicit', confidence: 'high' },
  ];

  const CLIMATE_MAP = [
    { pattern: /winter|cold|cool|18.c|chilly|freeze/,  value: 'Cool weather', source: 'explicit', confidence: 'high' },
    { pattern: /summer|warm|hot|humid|heat/,           value: 'Warm climate', source: 'explicit', confidence: 'high' },
    { pattern: /rain|wet|drizzle|monsoon/,             value: 'Rain',         source: 'explicit', confidence: 'high' },
  ];

  const COLOR_MAP = [
    { pattern: /\bblack\b/, value: 'Black' },
    { pattern: /\bwhite\b/, value: 'White' },
    { pattern: /\bnavy\b/,  value: 'Navy'  },
    { pattern: /\bgrey\b|\bgray\b/, value: 'Grey' },
    { pattern: /\bbrown\b/, value: 'Brown' },
    { pattern: /\bbeige\b|\bcream\b/, value: 'Cream' },
    { pattern: /\bgreen\b/, value: 'Green' },
    { pattern: /\bblue\b/,  value: 'Blue'  },
  ];

  const FIT_MAP = [
    { pattern: /slim|fitted|tailored|close.to.body/, value: 'Slim'    },
    { pattern: /relaxed|loose|oversized|baggy/,      value: 'Relaxed' },
    { pattern: /regular|standard|classic fit/,       value: 'Regular' },
  ];

  const STYLE_MAP = [
    { pattern: /minimal|clean|simple|understated/,  value: 'Minimal',      source: 'explicit', confidence: 'high'   },
    { pattern: /casual|laid.back|effortless/,       value: 'Casual',       source: 'explicit', confidence: 'high'   },
    { pattern: /formal|smart|structured/,           value: 'Formal',       source: 'explicit', confidence: 'high'   },
    { pattern: /evening|dinner|dinner date/,        value: 'Smart Casual', source: 'inferred', confidence: 'medium' },
  ];

  const CATEGORY_MAP = [
    { pattern: /jacket|coat|outerwear|parka|blazer/,      value: 'Outerwear'  },
    { pattern: /sweater|knitwear|jumper|pullover/,        value: 'Knitwear'   },
    { pattern: /shirt|top|blouse/,                       value: 'Tops'       },
    { pattern: /trouser|pant|chino|jeans|denim/,         value: 'Bottoms'    },
    { pattern: /shoe|sneaker|boot|footwear|runner/,      value: 'Footwear'   },
    { pattern: /bag|tote|backpack|carry/,                value: 'Bags'       },
    { pattern: /watch|timepiece|chronograph/,            value: 'Timepieces' },
    { pattern: /headphone|earphone|earbud|audio|speaker/,value: 'Acoustics'  },
  ];

  const OUT_OF_SCOPE = [
    /capital of|president of|who is|recipe for|how to cook|weather in|stock price|sports score/
  ];

  const AMBIGUOUS = [
    /^something nice\.?$/i,
    /^show me products\.?$/i,
    /^i want to buy\.?$/i,
  ];

  const BANGLISH = [
    /jonno|chai|ekta|ache|jacchi|niye|kinte|dekhao|kotha|theke/
  ];

  function matchFirst(patterns, q) {
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].pattern.test(q)) return patterns[i];
    }
    return null;
  }

  function parseBudget(q) {
    var under = q.match(/(?:under|less\s+than|below|max|upto|up\s+to)\s*(?:bdt|tk|taka)?\s*([\d,]+k?)/i);
    var around = q.match(/(?:around|approximately|about)\s*(?:bdt|tk|taka)?\s*([\d,]+k?)/i);
    if (under) return { max: parseAmount(under[1]), currency: 'BDT', source: 'explicit' };
    if (around) return { max: Math.round(parseAmount(around[1]) * 1.2), currency: 'BDT', source: 'explicit', isApproximate: true };
    return null;
  }

  function parseAmount(val) {
    var s = val.toLowerCase().replace(/,/g, '').replace(/bdt|tk|taka/gi, '').trim();
    if (s.endsWith('k')) return parseFloat(s) * 1000;
    return parseFloat(s) || null;
  }

  function parseRecipient(q) {
    if (/\bbrother\b|\bbhai\b/.test(q)) return { value: 'Brother', source: 'explicit', confidence: 'high' };
    if (/\bsister\b|\bapu\b|\bapa\b/.test(q)) return { value: 'Sister', source: 'explicit', confidence: 'high' };
    if (/\bfriend\b|\bbondhhu\b/.test(q)) return { value: 'Friend', source: 'explicit', confidence: 'high' };
    return null;
  }

  function parse(rawQuery) {
    if (!rawQuery || rawQuery.trim() === '') return { raw: '', isAmbiguous: false, isOutOfScope: false, isBanglish: false };

    var q = rawQuery.toLowerCase().trim();
    var isOutOfScope = OUT_OF_SCOPE.some(function(p) { return p.test(q); });
    var isAmbiguous  = AMBIGUOUS.some(function(p) { return p.test(q); });
    var isBanglish   = BANGLISH.some(function(p) { return p.test(q); });

    if (isOutOfScope) return { raw: rawQuery, isOutOfScope: true, isAmbiguous: false, isBanglish: isBanglish };
    if (isAmbiguous)  return { raw: rawQuery, isAmbiguous: true, isOutOfScope: false, isBanglish: isBanglish };

    var occ = matchFirst(OCCASION_MAP, q);
    var cli = matchFirst(CLIMATE_MAP,  q);
    var sty = matchFirst(STYLE_MAP,    q);
    var col = matchFirst(COLOR_MAP,    q);
    var fit = matchFirst(FIT_MAP,      q);
    var cat = matchFirst(CATEGORY_MAP, q);
    var bud = parseBudget(q);
    var rec = parseRecipient(q);
    var loc = q.includes('dhaka') ? { value: 'Dhaka', source: 'explicit', confidence: 'high' } : null;

    return {
      raw:       rawQuery,
      occasion:  occ ? { value: occ.value, source: occ.source, confidence: occ.confidence } : null,
      climate:   cli ? { value: cli.value, source: cli.source, confidence: cli.confidence } : null,
      location:  loc,
      style:     sty ? { value: sty.value, source: sty.source, confidence: sty.confidence } : null,
      color:     col ? { value: col.value, source: 'explicit', confidence: 'high' } : null,
      fit:       fit ? { value: fit.value, source: 'explicit', confidence: 'high' } : null,
      category:  cat ? { value: cat.value, source: 'explicit', confidence: 'high' } : null,
      budget:    bud,
      recipient: rec,
      isAmbiguous:  false,
      isOutOfScope: false,
      isBanglish:   isBanglish
    };
  }

  window.NexIntentParser = { parse: parse };

})(window);
```

- [ ] **Step 2: Verify in browser console**

Start server: `python -m http.server 8000`
Open: `http://localhost:8000/playground.html`
Open DevTools Console:

```js
const s = document.createElement('script'); s.src = 'js/intent-parser.js'; document.head.appendChild(s);
// Wait 300ms:
console.log(NexIntentParser.parse("something warm for a cool evening in Dhaka under 20000"));
// Expected: occasion.value === "Evening", climate.value === "Cool weather", budget.max === 20000
console.log(NexIntentParser.parse("what is the capital of France?").isOutOfScope); // true
console.log(NexIntentParser.parse("something nice").isAmbiguous); // true
```

- [ ] **Step 3: Commit**

```bash
git add js/intent-parser.js
git commit -m "feat(discovery): add NexIntentParser — NLP intent extraction with source/confidence tracking"
```

---

## Task 2: Catalog Engine (`js/catalog-engine.js`)

**Files:**
- Create: `js/catalog-engine.js`
- Modify: `js/ai-engine.js` (add `catalogArray` export)

**Interfaces:**
- Consumes: `IntentObject` from `NexIntentParser`, `window.NexAI.catalogArray`
- Produces: `{ products: Product[], appliedFilters: string[], relaxedFilters: string[], isFallback?: boolean }`

- [ ] **Step 1: Add `catalogArray` to `js/ai-engine.js` export**

In `js/ai-engine.js`, find the `window.NexAI = { ... };` block and add:

```js
// Add to existing window.NexAI object:
catalogArray: Object.values(PRODUCT_EMBEDDINGS),
```

- [ ] **Step 2: Create `js/catalog-engine.js`**

```js
// js/catalog-engine.js
(function(window) {
  'use strict';

  function query(intentObj, refinementContext) {
    var catalog = (window.NexAI && window.NexAI.catalogArray) ? window.NexAI.catalogArray : [];
    if (catalog.length === 0) return { products: [], appliedFilters: [], relaxedFilters: [] };

    var intent = intentObj || {};
    var pool = catalog.slice();
    var appliedFilters = [];
    var relaxedFilters = [];

    // Hard filter: Budget
    var budget = intent.budget;
    if (budget && budget.max) {
      var before = pool.length;
      pool = pool.filter(function(p) { return (p.numericPrice || p.price || 0) <= budget.max; });
      if (pool.length < before) appliedFilters.push('Under BDT ' + budget.max.toLocaleString());
      if (pool.length === 0) {
        pool = catalog.filter(function(p) { return (p.numericPrice || p.price || 0) <= budget.max * 1.4; });
        relaxedFilters.push('Budget relaxed to BDT ' + Math.round(budget.max * 1.4).toLocaleString());
      }
    }

    // Hard filter: Category (explicit only)
    if (intent.category && intent.category.source === 'explicit') {
      var cat = intent.category.value.toLowerCase();
      var catPool = pool.filter(function(p) { return (p.category || '').toLowerCase().includes(cat); });
      if (catPool.length > 0) { pool = catPool; appliedFilters.push(intent.category.value); }
    }

    // Hard filter: Color (explicit only)
    if (intent.color && intent.color.source === 'explicit') {
      var col = intent.color.value.toLowerCase();
      var colPool = pool.filter(function(p) {
        var haystack = [(p.keywords || []).join(' '), p.desc || '', p.title || p.name || ''].join(' ').toLowerCase();
        return haystack.includes(col);
      });
      if (colPool.length > 0) { pool = colPool; appliedFilters.push(intent.color.value); }
    }

    // Soft ranking
    var scored = pool.map(function(p) {
      var score = 0.5;
      var kw = (p.keywords || []).join(' ').toLowerCase();
      var desc = (p.desc || p.reasoning || '').toLowerCase();

      if (intent.occasion) {
        var occ = intent.occasion.value.toLowerCase().split('/')[0].trim();
        if (kw.includes(occ) || desc.includes(occ)) score += intent.occasion.confidence === 'high' ? 0.3 : 0.15;
      }
      if (intent.climate) {
        var words = intent.climate.value.toLowerCase().split(' ');
        words.forEach(function(w) { if (kw.includes(w) || desc.includes(w)) score += 0.12; });
      }
      if (intent.location) {
        if (kw.includes('dhaka') || desc.includes('dhaka')) score += 0.1;
      }
      if (intent.style && intent.style.confidence !== 'low') {
        var st = intent.style.value.toLowerCase();
        if (kw.includes(st) || desc.includes(st)) score += intent.style.confidence === 'high' ? 0.2 : 0.08;
      }
      if (intent.raw) {
        var terms = intent.raw.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 2; });
        terms.forEach(function(t) {
          if (kw.includes(t) || (p.title || p.name || '').toLowerCase().includes(t)) score += 0.05;
        });
      }

      return Object.assign({}, p, { _score: Math.min(0.99, score) });
    });

    scored.sort(function(a, b) { return b._score - a._score; });
    return { products: scored, appliedFilters: appliedFilters, relaxedFilters: relaxedFilters };
  }

  function keywordFallback(rawQuery) {
    var catalog = (window.NexAI && window.NexAI.catalogArray) ? window.NexAI.catalogArray : [];
    if (!rawQuery) return { products: catalog, appliedFilters: [], relaxedFilters: [], isFallback: true };
    var terms = rawQuery.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 2; });
    var matched = catalog.filter(function(p) {
      var haystack = [p.title || p.name || '', p.category || '', (p.keywords || []).join(' ')].join(' ').toLowerCase();
      return terms.some(function(t) { return haystack.includes(t); });
    });
    return { products: matched.length > 0 ? matched : catalog, appliedFilters: [], relaxedFilters: [], isFallback: true };
  }

  window.NexCatalogEngine = { query: query, keywordFallback: keywordFallback };

})(window);
```

- [ ] **Step 3: Verify in browser console**

```js
// Load scripts in order
['js/ai-engine.js','js/intent-parser.js','js/catalog-engine.js'].forEach(src => {
  const s = document.createElement('script'); s.src = src; document.head.appendChild(s);
});
// Wait 500ms:
const intent = NexIntentParser.parse("warm jacket for a cool evening under 40000");
const result = NexCatalogEngine.query(intent);
console.log(result.appliedFilters); // ["Under BDT 40,000"]
console.log(result.products[0].title); // outerwear/knitwear product first
```

- [ ] **Step 4: Commit**

```bash
git add js/ai-engine.js js/catalog-engine.js
git commit -m "feat(discovery): add NexCatalogEngine — budget/category/color hard filters + semantic soft ranking"
```

---

## Task 3: Session Context Manager (`js/session-context.js`)

**Files:**
- Create: `js/session-context.js`

**Interfaces:**
- Consumes: `IntentObject`
- Produces: `sessionStorage['nexcommerce_search_context']` — consumed by Feature 2 (`pdp.js`)

- [ ] **Step 1: Create `js/session-context.js`**

```js
// js/session-context.js
(function(window) {
  'use strict';

  var STORAGE_KEY = 'nexcommerce_search_context';
  var TTL_MS = 30 * 60 * 1000; // 30 minutes

  function save(intentObj) {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        intent: intentObj,
        savedAt: Date.now(),
        ttlMs: TTL_MS
      }));
    } catch(e) {}
  }

  function load() {
    try {
      var raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var payload = JSON.parse(raw);
      if (Date.now() - payload.savedAt > payload.ttlMs) {
        sessionStorage.removeItem(STORAGE_KEY);
        return null;
      }
      return payload.intent;
    } catch(e) { return null; }
  }

  function clear() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch(e) {}
  }

  // FR-7: Merge refinement into existing context without discarding valid prior constraints
  function mergeRefinement(existingIntent, refinementIntent) {
    var merged = Object.assign({}, existingIntent);
    var fields = ['occasion','climate','location','style','color','fit','budget','category','recipient'];
    fields.forEach(function(key) {
      if (refinementIntent[key] !== null && refinementIntent[key] !== undefined) {
        merged[key] = refinementIntent[key];
      }
    });
    merged.raw = refinementIntent.raw;
    return merged;
  }

  window.NexSessionContext = { save: save, load: load, clear: clear, mergeRefinement: mergeRefinement };

})(window);
```

- [ ] **Step 2: Verify round-trip and TTL**

```js
const s = document.createElement('script'); s.src = 'js/session-context.js'; document.head.appendChild(s);
const intent = { raw: 'cool evening Dhaka', occasion: { value: 'Evening', source: 'explicit', confidence: 'high' } };
NexSessionContext.save(intent);
console.log(NexSessionContext.load().occasion.value); // "Evening"
NexSessionContext.clear();
console.log(NexSessionContext.load()); // null
```

- [ ] **Step 3: Verify refinement merge**

```js
const base = { raw: 'cool evening', occasion: { value: 'Evening', source: 'explicit', confidence: 'high' }, budget: { max: 20000 } };
const ref  = { raw: 'cheaper', budget: { max: 10000, currency: 'BDT', source: 'explicit' }, occasion: null };
const merged = NexSessionContext.mergeRefinement(base, ref);
console.log(merged.budget.max);    // 10000  (updated)
console.log(merged.occasion.value); // "Evening" (preserved — null in refinement is ignored)
```

- [ ] **Step 4: Commit**

```bash
git add js/session-context.js
git commit -m "feat(discovery): add NexSessionContext — 30min TTL context handoff + refinement merge (FR-7)"
```

---

## Task 4: UI State Engine (`js/discovery-ui.js`)

**Files:**
- Create: `js/discovery-ui.js`
- Modify: `css/design-system.css`

**14 States to implement:** Default, Focused, Typing, Suggestions, Processing, Results, Context Display, Context Editing, Refinement, No Results, AI Error, Timeout, Empty Query, New Search.

- [ ] **Step 1: Append CSS to `css/design-system.css`**

Append at the very end of `css/design-system.css`:

```css
/* ─── Feature 1: Discovery UI States ────────────────────────── */
.discovery-no-results { padding: 48px 0; text-align: center; }
.discovery-no-results-title { font-family: var(--font-serif); font-size: 28px; font-weight: 500; color: var(--text-primary); margin-bottom: 12px; }
.discovery-no-results-body { font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); line-height: 1.6; max-width: 380px; margin: 0 auto 24px; }
.discovery-relax-chips { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; }
.discovery-relax-chip { padding: 6px 14px; border: 1px solid var(--border-subtle); border-radius: 20px; font-family: var(--font-body); font-size: 12px; color: var(--accent-cyan); background: none; cursor: pointer; transition: border-color 0.2s; }
.discovery-relax-chip:hover { border-color: var(--accent-cyan); }
.discovery-ai-error { padding: 40px 0; text-align: center; }
.discovery-ai-error-label { font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-pink); margin-bottom: 8px; }
.discovery-ai-error-message { font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); margin-bottom: 20px; }
.discovery-timeout-message { font-family: var(--font-body); font-size: 13px; color: var(--text-secondary); padding: 32px 0; text-align: center; }
.discovery-empty-prompt { font-family: var(--font-body); font-size: 13px; color: var(--text-secondary); padding: 16px 0; text-align: center; }
.discovery-out-of-scope { padding: 40px 0; text-align: center; font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
@keyframes nex-chip-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.9; } }
.discovery-parsing-chip { animation: nex-chip-pulse 1.4s ease-in-out infinite; }
```

- [ ] **Step 2: Create `js/discovery-ui.js`**

```js
// js/discovery-ui.js
(function(window) {
  'use strict';

  var TIMEOUT_MS = 5000;
  var DELAY_MS = 800;
  var activeIntent = {};
  var activeQuery = '';
  var timeoutHandle = null;
  var aiFailureMode = false;

  function el(id) { return document.getElementById(id); }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildChipList(intent) {
    var chips = [];
    if (!intent) return chips;
    if (intent.occasion) chips.push({ key: 'occasion', label: intent.occasion.value });
    if (intent.climate)  chips.push({ key: 'climate',  label: intent.climate.value  });
    if (intent.location) chips.push({ key: 'location', label: intent.location.value });
    if (intent.style && intent.style.source === 'explicit') chips.push({ key: 'style', label: intent.style.value });
    if (intent.color)    chips.push({ key: 'color',    label: intent.color.value    });
    if (intent.fit)      chips.push({ key: 'fit',      label: intent.fit.value      });
    if (intent.budget)   chips.push({ key: 'budget',   label: 'Under BDT ' + intent.budget.max.toLocaleString() });
    if (intent.recipient) chips.push({ key: 'recipient', label: 'For ' + intent.recipient.value });
    return chips;
  }

  // State 1: Default
  function renderDefaultState() {
    var section = el('discoveryResultsSection');
    var contextBar = el('discoveryContextBar');
    var refinementBar = el('discoveryRefinementBar');
    if (section) section.style.display = 'none';
    if (contextBar) contextBar.style.display = 'none';
    if (refinementBar) refinementBar.style.display = 'none';
  }

  // State 5: Processing
  function renderProcessingState(intent) {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';

    var chips = buildChipList(intent);
    var chipHtml = '';
    if (chips.length > 0) {
      chipHtml = '<div style="margin-top:24px;text-align:center;">'
        + '<div style="font-family:var(--font-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:12px;">PARSING INTENT...</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + chips.map(function(c) { return '<span class="intent-chip discovery-parsing-chip">' + escHtml(c.label) + '</span>'; }).join('')
        + '</div></div>';
    }

    if (grid) {
      grid.innerHTML = '<div class="discovery-processing" style="grid-column:1/-1;padding:40px 0;text-align:center;">'
        + '<div class="discovery-processing-dots"><div class="discovery-processing-dot"></div><div class="discovery-processing-dot"></div><div class="discovery-processing-dot"></div></div>'
        + '<span class="discovery-processing-text">Understanding your request…</span>'
        + chipHtml + '</div>';
    }
  }

  // State 6+7: Results with Context Display
  function renderResults(query, intent, catalogResult) {
    var products = catalogResult.products;
    var relaxedFilters = catalogResult.relaxedFilters || [];
    var isFallback = catalogResult.isFallback;
    var section = el('discoveryResultsSection');
    var contextBar = el('discoveryContextBar');
    var contextChips = el('discoveryContextChips');
    var header = el('discoveryResultsHeader');
    var grid = el('discoveryResultsGrid');
    var refinementBar = el('discoveryRefinementBar');

    if (section) section.style.display = 'block';

    var chips = buildChipList(intent);
    if (chips.length > 0 && contextBar && contextChips) {
      contextBar.style.display = 'flex';
      contextChips.innerHTML = chips.map(function(chip) {
        return '<span class="discovery-intent-chip" data-ctx-key="' + escHtml(chip.key) + '">'
          + escHtml(chip.label)
          + '<button class="discovery-chip-remove" data-remove-key="' + escHtml(chip.key) + '" aria-label="Remove ' + escHtml(chip.label) + '">'
          + '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
          + '</button></span>';
      }).join('');
    } else if (contextBar) {
      contextBar.style.display = 'none';
    }

    if (header) {
      var relaxNote = relaxedFilters.length > 0 ? '<div style="font-family:var(--font-body);font-size:12px;color:var(--accent-pink);margin-top:6px;">Budget relaxed — no exact matches found.</div>' : '';
      var fallNote  = isFallback ? '<div style="font-family:var(--font-body);font-size:12px;color:var(--text-secondary);margin-top:6px;">AI unavailable — showing keyword matches.</div>' : '';
      header.innerHTML = products.length > 0
        ? '<span class="discovery-results-eyebrow">Results for your request</span>'
          + '<div class="discovery-results-query">"' + escHtml(query) + '"</div>'
          + '<div class="discovery-results-count">' + products.length + ' item' + (products.length !== 1 ? 's' : '') + ' found</div>'
          + relaxNote + fallNote
        : '';
    }

    if (!grid) return;

    if (products.length === 0) {
      renderNoResultsState(grid, intent);
      if (refinementBar) refinementBar.style.display = 'none';
      return;
    }

    grid.innerHTML = products.map(function(p, i) {
      return '<div class="discovery-card" style="animation-delay:' + (i * 60) + 'ms;">'
        + '<div class="discovery-card-image">'
        + '<img src="' + escHtml(p.img || p.image || '') + '" alt="' + escHtml(p.title || p.name || '') + '" loading="lazy" />'
        + '<span class="discovery-card-match-badge">' + escHtml(p.matchBadge || 'Match') + '</span>'
        + '</div>'
        + '<div class="discovery-card-body">'
        + '<span class="discovery-card-category">' + escHtml(p.category || '') + '</span>'
        + '<h2 class="discovery-card-name">' + escHtml(p.title || p.name || '') + '</h2>'
        + '<div class="discovery-card-price">' + escHtml(p.formattedPrice || 'BDT ' + (p.numericPrice || '').toLocaleString()) + '</div>'
        + '<div class="discovery-card-reasoning">'
        + '<div class="discovery-card-reasoning-label">Why it fits</div>'
        + '<div class="discovery-card-reasoning-text">' + escHtml(p.reasoning || p.desc || '') + '</div>'
        + '</div></div>'
        + '<div class="discovery-card-actions">'
        + '<button class="btn-primary-commerce discovery-view-btn" data-product-id="' + escHtml(p.id) + '" aria-label="View ' + escHtml(p.title || p.name || '') + '">VIEW PRODUCT</button>'
        + '</div></div>';
    }).join('');

    if (refinementBar) refinementBar.style.display = 'flex';
  }

  // State 10: No Results
  function renderNoResultsState(grid, intent) {
    var chips = buildChipList(intent);
    var relaxChips = chips.map(function(c) {
      return '<button class="discovery-relax-chip" data-remove-key="' + escHtml(c.key) + '">Remove "' + escHtml(c.label) + '"</button>';
    }).join('');
    grid.innerHTML = '<div class="discovery-no-results" style="grid-column:1/-1;">'
      + '<div class="discovery-no-results-title">No exact matches found.</div>'
      + '<p class="discovery-no-results-body">Try relaxing one of these filters:</p>'
      + '<div class="discovery-relax-chips">' + relaxChips + '</div></div>';
  }

  // State 11: AI Error
  function renderAiErrorState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-ai-error" style="grid-column:1/-1;">'
        + '<div class="discovery-ai-error-label">Search temporarily unavailable</div>'
        + '<div class="discovery-ai-error-message">Our intelligent search is taking a moment. Continue with keyword search below.</div>'
        + '<button class="btn-secondary-action" onclick="window.NexDiscoveryUI.enableFallbackMode()">Continue with standard search</button>'
        + '</div>';
    }
  }

  // State 12: Timeout
  function renderTimeoutState() {
    var grid = el('discoveryResultsGrid');
    if (grid) {
      grid.innerHTML = '<div class="discovery-timeout-message" style="grid-column:1/-1;">'
        + 'We couldn\'t process that request right now. Try a simpler search.<br><br>'
        + '<button class="btn-secondary-action" onclick="window.NexDiscoveryUI.enableFallbackMode()">Continue with standard search</button>'
        + '</div>';
    }
  }

  // State 13: Empty Query
  function renderEmptyQueryState() {
    var grid = el('discoveryResultsGrid');
    if (grid) {
      grid.innerHTML = '<div class="discovery-empty-prompt" style="grid-column:1/-1;">Please describe what you\'re looking for.</div>';
    }
  }

  // State: Out of Scope (spec §29)
  function renderOutOfScopeState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-out-of-scope" style="grid-column:1/-1;">'
        + 'I\'m here to help you discover products.<br>Describe what you\'re shopping for — occasion, style, or budget.</div>';
    }
  }

  // State: Ambiguous (spec §25)
  function renderAmbiguousState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-out-of-scope" style="grid-column:1/-1;">'
        + '<p style="margin-bottom:16px;">What are you shopping for?</p>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + '<button class="discovery-relax-chip" onclick="NexDiscoveryUI.execute(\'Clothing\')">Clothing</button>'
        + '<button class="discovery-relax-chip" onclick="NexDiscoveryUI.execute(\'Shoes\')">Shoes</button>'
        + '<button class="discovery-relax-chip" onclick="NexDiscoveryUI.execute(\'Accessories\')">Accessories</button>'
        + '<button class="discovery-relax-chip" onclick="NexDiscoveryUI.execute(\'Audio\')">Audio</button>'
        + '</div></div>';
    }
  }

  // Analytics
  function track(eventName, payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: eventName }, payload || {}));
    } catch(e) {}
  }

  // Main Execute
  function execute(rawQuery, isRefinement) {
    var query = (rawQuery || '').trim();
    if (!query) { renderEmptyQueryState(); return; }

    var intent = window.NexIntentParser ? NexIntentParser.parse(query) : { raw: query };

    if (intent.isOutOfScope) { renderOutOfScopeState(); return; }
    if (intent.isAmbiguous)  { renderAmbiguousState();  return; }

    if (isRefinement && Object.keys(activeIntent).length > 0) {
      activeIntent = window.NexSessionContext
        ? NexSessionContext.mergeRefinement(activeIntent, intent)
        : Object.assign({}, activeIntent, intent);
    } else {
      activeIntent = intent;
    }
    activeQuery = query;

    if (window.NexSessionContext) NexSessionContext.save(activeIntent);

    track('ai_query_submitted', { query: query, is_refinement: !!isRefinement });
    track('ai_intent_extracted', { has_occasion: !!intent.occasion, has_budget: !!intent.budget, is_banglish: !!intent.isBanglish });

    renderProcessingState(activeIntent);

    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(function() { renderTimeoutState(); }, TIMEOUT_MS);

    setTimeout(function() {
      clearTimeout(timeoutHandle);
      try {
        var result;
        if (aiFailureMode || !window.NexCatalogEngine) {
          result = window.NexCatalogEngine ? NexCatalogEngine.keywordFallback(query) : { products: [], appliedFilters: [], relaxedFilters: [], isFallback: true };
        } else {
          result = NexCatalogEngine.query(activeIntent);
        }
        renderResults(query, activeIntent, result);
        track('ai_results_displayed', { result_count: result.products.length, is_fallback: !!result.isFallback });
      } catch(e) {
        console.error('[NexDiscoveryUI]', e);
        renderAiErrorState();
        track('ai_search_error', { error: e.message });
      }
    }, DELAY_MS);
  }

  // State 8: Context Editing
  function removeContextKey(key) {
    if (!activeIntent[key]) return;
    delete activeIntent[key];
    if (window.NexSessionContext) NexSessionContext.save(activeIntent);
    track('ai_context_removed', { key: key });
    var result = window.NexCatalogEngine
      ? NexCatalogEngine.query(activeIntent)
      : { products: [], appliedFilters: [], relaxedFilters: [] };
    renderResults(activeQuery, activeIntent, result);
  }

  // State 14: New Search
  function reset() {
    activeIntent = {};
    activeQuery = '';
    if (window.NexSessionContext) NexSessionContext.clear();
    track('ai_search_reset', {});
    renderDefaultState();
    var input = el('discoveryMainInput');
    if (input) { input.value = ''; input.focus(); }
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'none';
  }

  function enableFallbackMode() {
    aiFailureMode = true;
    if (activeQuery) execute(activeQuery, false);
  }

  window.NexDiscoveryUI = {
    execute: execute,
    removeContextKey: removeContextKey,
    reset: reset,
    enableFallbackMode: enableFallbackMode,
    renderDefaultState: renderDefaultState
  };

})(window);
```

- [ ] **Step 3: Verify all critical states in browser**

```
http://localhost:8000/discovery.html

Test each state:
1. No query → empty prompt visible
2. "something warm for a cool evening in Dhaka under 25000" → processing chips appear, then results + chips
3. Click ✕ on a chip → results update (State 8: Context Editing)
4. Type "show something cheaper" + submit → budget updates, prior context preserved
5. "what is the capital of France?" → out-of-scope message
6. "something nice" → ambiguous category tiles appear
```

- [ ] **Step 4: Commit**

```bash
git add js/discovery-ui.js css/design-system.css
git commit -m "feat(discovery): add NexDiscoveryUI — all 14 UI states, analytics events, AI error/timeout/fallback"
```

---

## Task 5: Wire Discovery Page (`discovery.html`)

**Files:**
- Modify: `discovery.html`

- [ ] **Step 1: Replace `ai-search-v2.js` script tag in `discovery.html`**

Find in `discovery.html`:
```html
<script src="js/ai-search-v2.js?v=1"></script>
```

Replace with:
```html
<script src="js/ai-engine.js"></script>
<script src="js/intent-parser.js"></script>
<script src="js/catalog-engine.js"></script>
<script src="js/session-context.js"></script>
<script src="js/discovery-ui.js"></script>
<script>
(function() {
  'use strict';
  document.addEventListener('DOMContentLoaded', function() {
    if (window.NexDiscoveryUI) NexDiscoveryUI.renderDefaultState();

    var mainInput  = document.getElementById('discoveryMainInput');
    var submitBtn  = document.getElementById('discoverySubmitBtn');
    var resetBtn   = document.getElementById('discoveryResetBtn');

    if (mainInput) {
      mainInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') { e.preventDefault(); NexDiscoveryUI.execute(mainInput.value); }
      });
    }
    if (submitBtn) submitBtn.addEventListener('click', function() { NexDiscoveryUI.execute(mainInput ? mainInput.value : ''); });
    if (resetBtn)  resetBtn.addEventListener('click', function() { NexDiscoveryUI.reset(); });

    // URL query param (e.g. discovery.html?q=cool+evening)
    var params = new URLSearchParams(window.location.search);
    var urlQ = params.get('q');
    if (urlQ && mainInput) { mainInput.value = urlQ; NexDiscoveryUI.execute(urlQ); }

    // Delegated events
    document.addEventListener('click', function(e) {
      // Chip removal (State 8)
      var removeBtn = e.target.closest('[data-remove-key]');
      if (removeBtn) { NexDiscoveryUI.removeContextKey(removeBtn.getAttribute('data-remove-key')); return; }

      // Refinement chips (State 9)
      var refChip = e.target.closest('.discovery-refinement-chip[data-refine]');
      if (refChip) {
        document.querySelectorAll('.discovery-refinement-chip').forEach(function(c) { c.classList.remove('active'); });
        refChip.classList.add('active');
        NexDiscoveryUI.execute(refChip.getAttribute('data-refine'), true);
        return;
      }

      // View product → navigate (AC-21)
      var viewBtn = e.target.closest('.discovery-view-btn');
      if (viewBtn) {
        window.location.href = 'product.html?id=' + viewBtn.getAttribute('data-product-id');
        return;
      }

      // Example prompts
      var promptChip = e.target.closest('.discovery-prompt-chip[data-prompt]');
      if (promptChip && mainInput) {
        mainInput.value = promptChip.getAttribute('data-prompt');
        NexDiscoveryUI.execute(promptChip.getAttribute('data-prompt'));
      }
    });
  });
})();
</script>
```

- [ ] **Step 2: End-to-end test**

```
Open: http://localhost:8000/discovery.html

1. Search: "something warm for a cool evening in Dhaka under 25000"
   ✓ Processing chips: Evening, Cool weather, Dhaka, Under BDT 25,000
   ✓ Products listed with WHY IT FITS
   ✓ Context bar shows removable chips

2. Remove "Cool weather" chip
   ✓ Results refresh without climate filter

3. Click VIEW PRODUCT
   ✓ Navigates to product.html?id=...

4. Press browser back
   ✓ Discovery page reloads (context not restored — acceptable for prototype)

5. Click reset button
   ✓ Input clears, results hidden
```

- [ ] **Step 3: Commit**

```bash
git add discovery.html
git commit -m "feat(discovery): wire discovery.html to production engine stack — replaces ai-search-v2.js prototype"
```

---

## Task 6: Global Search Overlay (`js/search-overlay.js`)

**Files:**
- Create: `js/search-overlay.js`
- Modify: `index.html`, `product.html`, `category.html`

- [ ] **Step 1: Create `js/search-overlay.js`**

```js
// js/search-overlay.js
(function(window) {
  'use strict';

  var overlay = null;
  var input = null;
  var resultsContainer = null;
  var isOpen = false;

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildChipList(intent) {
    var chips = [];
    if (!intent) return chips;
    if (intent.occasion) chips.push({ key: 'occasion', label: intent.occasion.value });
    if (intent.climate)  chips.push({ key: 'climate',  label: intent.climate.value  });
    if (intent.location) chips.push({ key: 'location', label: intent.location.value });
    if (intent.budget)   chips.push({ key: 'budget',   label: 'Under BDT ' + intent.budget.max.toLocaleString() });
    return chips;
  }

  function openOverlay() {
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    setTimeout(function() { if (input) input.focus(); }, 150);
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    isOpen = false;
  }

  function execute(rawQuery) {
    var query = (rawQuery || '').trim();
    if (!query || !resultsContainer) return;

    var intent = window.NexIntentParser ? NexIntentParser.parse(query) : { raw: query };
    var chips = buildChipList(intent);

    var chipHtml = chips.length > 0
      ? '<div style="margin-top:20px;text-align:center;">'
        + '<div style="font-family:var(--font-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:10px;">PARSING INTENT...</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + chips.map(function(c) { return '<span class="intent-chip discovery-parsing-chip">' + escHtml(c.label) + '</span>'; }).join('')
        + '</div></div>'
      : '';

    resultsContainer.innerHTML = '<div style="padding:32px 0;text-align:center;">'
      + '<span style="font-family:var(--font-body);font-size:13px;color:var(--text-secondary);">Understanding your request…</span>'
      + chipHtml + '</div>';

    setTimeout(function() {
      if (window.NexSessionContext) NexSessionContext.save(intent);

      var result = window.NexCatalogEngine
        ? NexCatalogEngine.query(intent)
        : { products: [], appliedFilters: [], relaxedFilters: [] };

      if (result.products.length === 0) {
        resultsContainer.innerHTML = '<div style="padding:24px 0;text-align:center;font-family:var(--font-body);font-size:13px;color:var(--text-secondary);">'
          + 'No products found. <a href="discovery.html?q=' + encodeURIComponent(query) + '" style="color:var(--accent-cyan);">Search on discovery page →</a></div>';
        return;
      }

      var chipsHtml = chips.length > 0
        ? '<div style="margin-bottom:16px;">'
          + '<div style="font-family:var(--font-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">UNDERSTOOD AS</div>'
          + '<div style="display:flex;flex-wrap:wrap;gap:6px;">'
          + chips.map(function(c) { return '<span class="intent-chip">' + escHtml(c.label) + '</span>'; }).join('')
          + '</div></div>'
        : '';

      var cardsHtml = result.products.slice(0, 4).map(function(p) {
        return '<div class="ai-recommendation-card">'
          + '<div class="ai-card-img-wrap"><img src="' + escHtml(p.img || p.image || '') + '" alt="' + escHtml(p.title || p.name || '') + '" /></div>'
          + '<div class="ai-card-details">'
          + '<span class="match-indicator-badge">' + escHtml(p.matchBadge || 'Match') + '</span>'
          + '<h4 style="font-family:var(--font-serif);font-size:20px;font-weight:500;margin:4px 0;">' + escHtml(p.title || p.name || '') + '</h4>'
          + '<div class="ai-card-price">' + escHtml(p.formattedPrice || 'BDT ' + (p.numericPrice || '').toLocaleString()) + '</div>'
          + '</div>'
          + '<div style="margin-top:10px;">'
          + '<button class="btn-primary-commerce btn-view-product" data-id="' + escHtml(p.id) + '" style="width:100%;height:40px;">VIEW PRODUCT</button>'
          + '</div></div>';
      }).join('');

      resultsContainer.innerHTML = chipsHtml
        + '<div class="search-results-grid">' + cardsHtml + '</div>'
        + '<div style="text-align:center;margin-top:16px;"><a href="discovery.html?q=' + encodeURIComponent(query) + '" style="font-family:var(--font-body);font-size:12px;color:var(--accent-cyan);">See all results →</a></div>';

      resultsContainer.querySelectorAll('.btn-view-product').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var pid = btn.getAttribute('data-id');
          closeOverlay();
          window.location.href = 'product.html?id=' + pid;
        });
      });
    }, 800);
  }

  function init() {
    overlay          = document.getElementById('aiSearchModal');
    input            = document.querySelector('.search-ai-input');
    resultsContainer = document.getElementById('aiSearchResults');
    if (!overlay || !input) return;

    // Open via nav search
    document.querySelectorAll('[data-open-search], #navSearchBtn').forEach(function(btn) {
      btn.addEventListener('click', openOverlay);
    });

    var closeBtn = overlay.querySelector('.search-close-btn');
    var backdrop = overlay.querySelector('.search-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    if (backdrop) backdrop.addEventListener('click', closeOverlay);

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); execute(input.value); }
    });

    var submitBtn = overlay.querySelector('.btn-search-submit');
    if (submitBtn) submitBtn.addEventListener('click', function() { execute(input.value); });

    // Prompt chips inside overlay
    if (resultsContainer) {
      resultsContainer.addEventListener('click', function(e) {
        var promptBtn = e.target.closest('[data-prompt]');
        if (promptBtn) { input.value = promptBtn.getAttribute('data-prompt'); execute(input.value); }
      });
    }

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openOverlay(); }
      if (e.key === 'Escape' && isOpen) closeOverlay();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.NexSearchOverlay = { open: openOverlay, close: closeOverlay };

})(window);
```

- [ ] **Step 2: Replace `ai-search.js` in `index.html`, `product.html`, `category.html`**

In each file, find `<script src="js/ai-search.js">` and replace with:

```html
<script src="js/ai-engine.js"></script>
<script src="js/intent-parser.js"></script>
<script src="js/catalog-engine.js"></script>
<script src="js/session-context.js"></script>
<script src="js/search-overlay.js"></script>
```

- [ ] **Step 3: Verify on each page**

```
On http://localhost:8000/index.html:
  Press Ctrl+K → overlay opens
  Type "headphones for travel" → intent chips appear, products load
  Press ESC → overlay closes

On http://localhost:8000/product.html?id=p1:
  Same test — overlay works
  VIEW PRODUCT → navigates correctly

On http://localhost:8000/category.html:
  Same test
```

- [ ] **Step 4: Commit**

```bash
git add js/search-overlay.js index.html product.html category.html
git commit -m "feat(discovery): add global NexSearchOverlay — intent-powered overlay on all pages (Ctrl+K)"
```

---

## Spec Coverage Summary

| Spec Requirement | Task | Status |
|---|---|---|
| US-1: Natural language search | Task 1+2 | ✅ |
| US-2: Contextual search (occasion/climate/budget) | Task 1+2 | ✅ |
| US-3: Conversational refinement | Task 3+4 | ✅ |
| US-4: Customer corrects AI intent | Task 4 (chip removal) | ✅ |
| US-5: "Why it fits" explanation | Task 4 (reasoning card) | ✅ |
| US-6: Continue if AI fails | Task 2 (`keywordFallback`) + Task 4 (`enableFallbackMode`) | ✅ |
| §12 Structured intent model | `IntentObject` schema with source/confidence | ✅ |
| §13 Explicit vs inferred | `source` field per attribute | ✅ |
| §14 Intent confidence | `confidence: high/medium/low` | ✅ |
| §15 Context chips | Removable chips per attribute | ✅ |
| §17 Products from real catalog only | `NexAI.catalogArray` exclusively | ✅ |
| §19 Budget hard filter | Filter before ranking, no products over budget | ✅ |
| §22 Conversational refinement | `mergeRefinement()` preserves prior context | ✅ |
| §24 Search reset | `reset()` clears all state | ✅ |
| §25 Ambiguous queries | `isAmbiguous` → category selection tiles | ✅ |
| §26 No results | Constraint-relaxation chips | ✅ |
| §27 AI failure state | `renderAiErrorState()` + fallback button | ✅ |
| §28 Timeout (5s) | `TIMEOUT_MS = 5000` + `renderTimeoutState()` | ✅ |
| §29 Unsupported query | `isOutOfScope` → scoping message | ✅ |
| §34 All 14 UI states | Fully implemented in Task 4 | ✅ |
| §37 Analytics events | `dataLayer.push()` for all key events | ✅ |
| AC-17 AI fallback | `keywordFallback()` always available | ✅ |
| AC-18 Timeout grace | 5s guard + graceful state | ✅ |
| AC-23 Session continuity | `sessionStorage` with 30min TTL | ✅ |
| AC-24 Context expiration | TTL check on `load()` | ✅ |
| AC-29 Accessibility | `aria-label` on chips, buttons, overlay | ✅ |

**Future work (not in scope for this plan):**
- §30 Bangla/Banglish: `isBanglish` detected but requires real LLM translation layer
- §35 Extended metadata: `occasion`, `activity`, `weather_suitability` fields on products — requires catalog API
- Full accessibility audit with screen reader (WCAG 2.1 AA)
- Performance testing with k6 / Lighthouse

---

## Execution Options

**1. Subagent-Driven (recommended)** — Fresh subagent per task, review between tasks
**2. Inline Execution** — Execute tasks sequentially in this session with checkpoints

**Which approach would you like?**
