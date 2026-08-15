# Editorial Banner Intent Prompt Suggestions Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the clunky, awkward multi-line "TRY: [Merino Wool Layering] [Waterproof Commute] [Minimalist Timepiece]" prompt chips in the pre-footer editorial banner into an elegant, cohesive single-row luxury suggestion rail positioned harmoniously beneath the search capsule.

**Architecture:** Reposition the prompt suggestions from above the search form to directly below the search input capsule, replacing the heavy outline pills and awkward line wrapping with compact, refined luxury interactive micro-chips (`font-size: 11px`, subtle translucent pill glass, single-row flex alignment, and clean `Try:` prefix).

**Tech Stack:** Semantic HTML5, CSS3 (flexbox, CSS transitions, design tokens), Vanilla JavaScript (`js/home.js`).

---

## Global Constraints

- **Visual Hierarchy & Flow:** Position the primary action (Intent Search Capsule) directly under the description, with the quick inspiration suggestions situated neatly below the input as helpful assistance, avoiding visual clutter before the main call-to-action.
- **Single-Row Harmony:** Ensure prompt chips fit cleanly on one line on desktop without orphan line-wrapping (`flex-wrap: wrap; gap: 6px;`), or gracefully scroll horizontally on small mobile screens.
- **Refined Luxury Aesthetics:** Remove aggressive bold "TRY:" label and oversized star bullets. Use refined muted label (`Try asking:` or `Popular:`) with subtle typography, $11\text{px}$ compact pill buttons (`padding: 4px 12px`), hairline border (`rgba(255, 255, 255, 0.1)`), and smooth $-1\text{px}$ hover physics.
- **Functionality Retention:** Maintain 1-click execution that populates the input and launches the AI Search Overlay / Discovery routing.

---

## Proposed Changes

### Component 1: Markup Structure (`index.html`)

#### [MODIFY] [index.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/index.html)
- In `index.html` (lines 980–1015):
  - Move `.editorial-prompt-chips` from *above* `#editorialIntentForm` to *below* `#editorialIntentForm`.
  - Refine prompt chip labels to clean, concise luxury phrases (*"Merino Wool Layering"*, *"Waterproof Commute"*, *"Minimalist Timepiece"*).
  - Update prefix label to `<span class="editorial-prompt-label">Popular intents:</span>` or `<span class="editorial-prompt-label">Try:</span>`.

---

### Component 2: CSS Styling (`css/design-system.css`)

#### [MODIFY] [css/design-system.css](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css)
- Refactor `.editorial-prompt-chips`, `.editorial-prompt-label`, and `.editorial-prompt-chip` (lines 8387–8420):
  - Adjust margins: `margin-top: 0; margin-bottom: 20px;` (placed neatly between form and footnote).
  - Compact chip sizing: `padding: 5px 12px; font-size: 11px; border-radius: 100px;`
  - Subtle frosted glass styling: `background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); color: var(--text-secondary);`
  - Hover state: `background: rgba(255, 255, 255, 0.10); border-color: rgba(255, 255, 255, 0.25); color: #FFFFFF; transform: translateY(-1px);`
  - Ensure alignment matches the width of the intent search capsule.

---

### Component 3: JavaScript Verification (`js/home.js`)

#### [MODIFY] [js/home.js](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/js/home.js)
- Verify event listeners on `.editorial-prompt-chip` continue to populate the input and trigger the search modal seamlessly.

---

## Tasks

### Task 1: Update Markup Hierarchy in `index.html`

**Files:**
- Modify: `index.html:980-1015`

**Interfaces:**
- Consumes: DOM elements `.editorial-prompt-chips`, `#editorialIntentForm`
- Produces: Clean visual order: Title → Description → Search Capsule → Quick Suggestions → Footnote

- [ ] **Step 1: Reorder HTML elements**

```html
              <!-- Interactive Intent Search Capsule -->
              <form class="editorial-intent-form" id="editorialIntentForm" action="discovery.html" method="GET">
                <div class="editorial-intent-input-wrap">
                  <i data-lucide="search" class="editorial-intent-search-icon" style="width: 16px; height: 16px;"></i>
                  <input
                    type="text"
                    name="q"
                    class="editorial-intent-input"
                    id="editorialIntentInput"
                    placeholder="Describe what you need... e.g. 'Warm relaxed fit sweater for evening'"
                    aria-label="Describe what you are looking for"
                    autocomplete="off"
                  />
                </div>
                <button type="submit" class="editorial-intent-submit-btn" id="editorialDescribeBtn">
                  <span>CURATE CAPSULE</span>
                  <i data-lucide="arrow-right" style="width: 14px; height: 14px;"></i>
                </button>
              </form>

              <!-- Quick Inspiration Prompt Suggestions (Under-Input Rail) -->
              <div class="editorial-prompt-chips" role="group" aria-label="Suggested shopping intents">
                <span class="editorial-prompt-label">Try:</span>
                <button type="button" class="editorial-prompt-chip" data-prompt="Autumn merino wool layering">
                  <span>Merino Wool Layering</span>
                </button>
                <button type="button" class="editorial-prompt-chip" data-prompt="Waterproof commuter footwear">
                  <span>Waterproof Commute</span>
                </button>
                <button type="button" class="editorial-prompt-chip" data-prompt="Minimalist everyday chronograph">
                  <span>Minimalist Timepiece</span>
                </button>
              </div>
```

---

### Task 2: Refine CSS Styling in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:8387-8425`

**Interfaces:**
- Consumes: CSS tokens (`--text-secondary`, `--text-muted`, `--accent-cyan`)
- Produces: CSS rules `.editorial-prompt-chips`, `.editorial-prompt-label`, `.editorial-prompt-chip`

- [ ] **Step 1: Write refined luxury CSS styles**

```css
/* Prompt Suggestions Rail (Under Input) */
.editorial-prompt-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 8px;
  margin-top: -6px;
  margin-bottom: 22px;
  max-width: 520px;
}

.editorial-prompt-label {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.04em;
  color: var(--text-muted, rgba(255, 255, 255, 0.45));
  margin-right: 2px;
}

.editorial-prompt-chip {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  color: var(--text-secondary, rgba(255, 255, 255, 0.75));
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 11px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 160ms cubic-bezier(0.25, 1, 0.5, 1);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.editorial-prompt-chip:hover {
  background: rgba(255, 255, 255, 0.12);
  border-color: rgba(255, 255, 255, 0.25);
  color: #FFFFFF;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
}

.editorial-prompt-chip:active {
  transform: translateY(0);
}
```

---

### Task 3: Visual & Functional Verification

**Files:**
- Test via Chrome DevTools MCP & Browser

- [ ] **Step 1: Verify visual harmony on desktop and mobile**
- [ ] **Step 2: Verify click behavior on chips launches search modal with populated intent**
- [ ] **Step 3: Capture audit screenshot and update walkthrough**
