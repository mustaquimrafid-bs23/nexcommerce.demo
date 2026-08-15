# Pre-Footer Editorial Banner Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the pre-footer editorial banner ("Shopping should feel personal") into an elevated, world-class luxury Intent Atelier & Conversational Discovery showcase matching SSENSE, NET-A-PORTER, and Apple editorial standards.

**Architecture:** Replace the legacy 50/50 split box with an architectural luxury card featuring cinematic image-to-canvas gradient blending, refined serif display typography, interactive instant-prompt intent chips, an integrated intent curation input capsule, and spring-physics micro-interactions.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (luxury tokens, `backdrop-filter: blur(24px)`, linear gradients, CSS Grid, media queries), Lucide Icons, Vanilla JavaScript (`js/home.js` integration with `NexSearchOverlay`).

---

## Global Constraints

- **Luxury Neutral Foundation:** Deep obsidian/navy foundation (`rgba(6, 24, 51, 0.85)` to `rgba(2, 12, 28, 0.95)`) with subtle specular inner borders (`inset 0 1px 0 rgba(255, 255, 255, 0.12)`) and organic image vignette fading (`linear-gradient(to right, transparent 55%, rgba(6, 24, 51, 0.95) 100%)`). Zero harsh neon borders or saturated clashing gradient fills.
- **Editorial Typography:** Bespoke typography hierarchy using `var(--font-serif)` for headline display with italicized emphasis, `var(--font-body)` for high-legibility muted body copy, and uppercase tracked micro-label (`10px`, `letter-spacing: 0.2em`).
- **Interactive Utility:** Interactive prompt chips and quick-curate input directly connected to `window.NexSearchOverlay.open(query)` and `discovery.html?q=...`.
- **Accessibility & Touch:** Touch targets $\ge 44 \times 44\text{px}$, visible focus rings, WCAG 2.1 AA compliant contrast ratios ($\ge 4.5:1$), and semantic HTML structure.
- **Motion & Polish:** Emil Kowalski spring easing curve (`cubic-bezier(0.25, 1, 0.5, 1)`) on interactive states and smooth scroll reveals.

---

## Proposed Changes

### Component 1: Markup & Semantic Structure (`index.html`)

#### [MODIFY] [index.html](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/index.html)
- Refactor lines 959–978 (`<!-- PRE-FOOTER EDITORIAL BANNER -->`):
  - Retain `.home-editorial-banner-section.reveal-on-scroll` container.
  - Upgrade `.editorial-banner-card` with an asymmetric layout and organic image blend mask.
  - Upgrade `.editorial-banner-content`:
    - Eyebrow tag: `<span class="editorial-banner-eyebrow"><i data-lucide="sparkles"></i> CONVERSATIONAL DISCOVERY · ATELIER AI</span>`
    - Refined headline: `<h2 class="editorial-banner-title">Shopping should<br>feel <em>personal</em>.</h2>`
    - Subtitle: `<p class="editorial-banner-desc">Skip the catalog maze. Describe a mood, occasion, or wardrobe nuance — our neural concierge curates your bespoke capsule in real time.</p>`
    - Interactive quick-prompt chips:
      - `<button type="button" class="editorial-prompt-chip" data-prompt="Autumn merino layering">✦ Cashmere & Wool Layering</button>`
      - `<button type="button" class="editorial-prompt-chip" data-prompt="Waterproof commuter essentials">✦ Waterproof Commute</button>`
      - `<button type="button" class="editorial-prompt-chip" data-prompt="Minimalist evening tailoring">✦ Minimalist Tailoring</button>`
    - Inline Intent Search Capsule:
      - Form `<form class="editorial-intent-form" id="editorialIntentForm">`
      - Input `<input type="text" class="editorial-intent-input" id="editorialIntentInput" placeholder="Describe what you're looking for..." />`
      - Submit button `<button type="submit" class="editorial-intent-submit-btn"><span>CURATE CAPSULE</span> <i data-lucide="arrow-right"></i></button>`
    - Concierge footnote: `<div class="editorial-banner-footnote"><i data-lucide="shield-check"></i> Instant neural vector matching across 4 luxury ateliers · 100% private session</div>`

---

### Component 2: CSS Architecture & Visual Design (`css/design-system.css`)

#### [MODIFY] [css/design-system.css](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css)
- Replace legacy `.home-editorial-banner-section` styles (lines 8274–8374) with the new luxury design system rules:
  - `.editorial-banner-card`: Multi-layer linear gradient, `backdrop-filter: blur(24px)`, subtle inner specular line, and deep atmospheric shadow.
  - `.editorial-banner-image-wrap`: Relative container with pseudo-element gradient overlay (`linear-gradient(to right, transparent 50%, rgba(6, 24, 51, 0.95) 100%)` for desktop, `linear-gradient(to bottom, transparent 60%, rgba(6, 24, 51, 0.98) 100%)` for mobile) creating seamless visual blending.
  - `.editorial-banner-eyebrow`: Refined champagne/coral accent with micro-sparkle icon.
  - `.editorial-banner-title`: Large editorial serif font with italicized contrast.
  - `.editorial-prompt-chips`: Flex wrap row of frosted pill buttons with subtle border, `-2px` hover lift, and glow highlight.
  - `.editorial-intent-form`: Modern integrated search capsule with frosted glass input and high-contrast luxury button.
  - Responsive breakpoints for `1024px`, `768px`, and `480px`.

---

### Component 3: JavaScript Interaction & Intent Routing (`js/home.js`)

#### [MODIFY] [js/home.js](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/js/home.js)
- Update `initEditorialBanner()`:
  - Wire up quick-prompt buttons (`.editorial-prompt-chip`) to trigger `window.NexSearchOverlay.open(prompt)` or pre-fill input and open search modal.
  - Wire up the inline intent form submission (`#editorialIntentForm`) to open `NexSearchOverlay` with the typed query, or redirect to `discovery.html?q=...`.
  - Re-render Lucide icons for dynamically updated icons (`lucide.createIcons()`).

---

## Tasks

### Task 1: Update HTML Markup in `index.html`

**Files:**
- Modify: `index.html:959-978`

**Interfaces:**
- Consumes: Lucide icons (`sparkles`, `arrow-right`, `shield-check`)
- Produces: DOM elements `#editorialIntentForm`, `#editorialIntentInput`, `.editorial-prompt-chip`

- [ ] **Step 1: Replace legacy editorial banner markup**

Replace lines 959–978 in `index.html`:

```html
    <!-- PRE-FOOTER EDITORIAL BANNER (THE INTENT ATELIER) -->
    <section class="home-editorial-banner-section reveal-on-scroll" aria-label="Personalized Intent Discovery">
      <div class="container">
        <div class="editorial-banner-card">
          <div class="editorial-banner-grid">
            <div class="editorial-banner-image-wrap">
              <img src="img_apparel_1.png" alt="nexCommerce Personalized Lifestyle Atelier" loading="lazy" />
              <div class="editorial-banner-image-fade" aria-hidden="true"></div>
            </div>
            <div class="editorial-banner-content">
              <div class="editorial-banner-eyebrow">
                <i data-lucide="sparkles" style="width: 13px; height: 13px;"></i>
                <span>CONVERSATIONAL DISCOVERY · ATELIER AI</span>
              </div>
              <h2 class="editorial-banner-title">
                Shopping should<br>feel <em>personal</em>.
              </h2>
              <p class="editorial-banner-desc">
                Skip the catalog maze. Describe a mood, occasion, or wardrobe nuance — our neural concierge curates your bespoke capsule in real time.
              </p>

              <!-- Quick Inspiration Prompt Chips -->
              <div class="editorial-prompt-chips" role="group" aria-label="Suggested shopping intents">
                <span class="editorial-prompt-label">Try:</span>
                <button type="button" class="editorial-prompt-chip" data-prompt="Autumn merino wool layering">
                  <span>✦ Merino Wool Layering</span>
                </button>
                <button type="button" class="editorial-prompt-chip" data-prompt="Waterproof commuter footwear">
                  <span>✦ Waterproof Commute</span>
                </button>
                <button type="button" class="editorial-prompt-chip" data-prompt="Minimalist everyday chronograph">
                  <span>✦ Minimalist Timepiece</span>
                </button>
              </div>

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

              <!-- Concierge Trust Footnote -->
              <div class="editorial-banner-footnote">
                <i data-lucide="shield-check" style="width: 13px; height: 13px; color: var(--accent-cyan);"></i>
                <span>Instant neural vector matching across 4 luxury ateliers · 100% private session</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify HTML syntax and element IDs**
Ensure `#editorialDescribeBtn`, `#editorialIntentForm`, and `#editorialIntentInput` exist.

---

### Task 2: Implement Luxury CSS Styles in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:8274-8374`

**Interfaces:**
- Consumes: CSS variables (`--font-serif`, `--font-body`, `--accent-cyan`, `--accent-coral`, `--text-primary`, `--text-muted`, `--radius-md`, `--radius-lg`)
- Produces: CSS rules `.home-editorial-banner-section`, `.editorial-banner-card`, `.editorial-banner-grid`, `.editorial-banner-image-wrap`, `.editorial-banner-image-fade`, `.editorial-banner-content`, `.editorial-banner-eyebrow`, `.editorial-banner-title`, `.editorial-banner-desc`, `.editorial-prompt-chips`, `.editorial-prompt-chip`, `.editorial-intent-form`, `.editorial-intent-input-wrap`, `.editorial-intent-input`, `.editorial-intent-submit-btn`, `.editorial-banner-footnote`

- [ ] **Step 1: Write luxury CSS styles**

Replace lines 8274–8374 in `css/design-system.css`:

```css
/* ==========================================================================
   PRE-FOOTER EDITORIAL BANNER ("THE INTENT ATELIER")
   ========================================================================== */
.home-editorial-banner-section {
  padding: clamp(48px, 6vw, 72px) 0 clamp(64px, 8vw, 96px);
  position: relative;
}

.editorial-banner-card {
  position: relative;
  background: linear-gradient(135deg, rgba(8, 28, 60, 0.9) 0%, rgba(2, 14, 34, 0.96) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12);
  transition: border-color 300ms ease, box-shadow 300ms ease;
}

.editorial-banner-card:hover {
  border-color: rgba(255, 255, 255, 0.18);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.16);
}

.editorial-banner-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  align-items: stretch;
  min-height: 460px;
}

.editorial-banner-image-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 380px;
  overflow: hidden;
  background: #020A17;
}

.editorial-banner-image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
  display: block;
  transition: transform 600ms cubic-bezier(0.25, 1, 0.5, 1);
}

.editorial-banner-card:hover .editorial-banner-image-wrap img {
  transform: scale(1.03);
}

.editorial-banner-image-fade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to right, transparent 55%, rgba(6, 24, 51, 0.92) 98%),
              linear-gradient(to top, rgba(2, 14, 34, 0.5) 0%, transparent 40%);
}

.editorial-banner-content {
  padding: clamp(36px, 4.5vw, 56px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  z-index: 2;
}

.editorial-banner-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-family: var(--font-body);
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--accent-coral, #F43F5E);
  margin-bottom: 14px;
  background: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.2);
  padding: 5px 12px;
  border-radius: 100px;
}

.editorial-banner-title {
  font-family: var(--font-serif);
  font-size: clamp(28px, 3.2vw, 42px);
  font-weight: 400;
  line-height: 1.15;
  color: #FFFFFF;
  letter-spacing: -0.01em;
  margin-bottom: 14px;
}

.editorial-banner-title em {
  font-style: italic;
  font-family: var(--font-serif);
  color: #FFFFFF;
  opacity: 0.95;
}

.editorial-banner-desc {
  font-size: 13.5px;
  color: var(--text-secondary, rgba(255, 255, 255, 0.7));
  line-height: 1.65;
  max-width: 460px;
  margin-bottom: 22px;
}

/* Prompt Chips */
.editorial-prompt-chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-bottom: 22px;
}

.editorial-prompt-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--text-muted, rgba(255, 255, 255, 0.45));
  margin-right: 2px;
}

.editorial-prompt-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.85);
  font-family: var(--font-body);
  font-size: 11.5px;
  font-weight: 500;
  padding: 6px 14px;
  border-radius: 100px;
  cursor: pointer;
  transition: all 180ms cubic-bezier(0.25, 1, 0.5, 1);
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.editorial-prompt-chip:hover {
  background: rgba(255, 255, 255, 0.14);
  border-color: rgba(255, 255, 255, 0.3);
  color: #FFFFFF;
  transform: translateY(-1.5px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
}

.editorial-prompt-chip:active {
  transform: translateY(0);
}

/* Integrated Intent Form */
.editorial-intent-form {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 520px;
  background: rgba(2, 14, 34, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 100px;
  padding: 5px 5px 5px 18px;
  gap: 10px;
  margin-bottom: 18px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3), 0 4px 16px rgba(0, 0, 0, 0.2);
  transition: border-color 200ms ease, box-shadow 200ms ease;
}

.editorial-intent-form:focus-within {
  border-color: var(--accent-cyan, #3DE0FF);
  box-shadow: 0 0 0 3px rgba(61, 224, 255, 0.15), inset 0 2px 4px rgba(0, 0, 0, 0.3);
}

.editorial-intent-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.editorial-intent-search-icon {
  color: var(--text-muted, rgba(255, 255, 255, 0.45));
  flex-shrink: 0;
}

.editorial-intent-input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 13px;
  color: #FFFFFF;
}

.editorial-intent-input::placeholder {
  color: var(--text-muted, rgba(255, 255, 255, 0.4));
  font-size: 12.5px;
}

.editorial-intent-submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #FFFFFF;
  color: #0A0F1D;
  border: 1px solid #FFFFFF;
  border-radius: 100px;
  padding: 10px 22px;
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 180ms cubic-bezier(0.25, 1, 0.5, 1);
}

.editorial-intent-submit-btn:hover {
  background: var(--accent-cyan, #3DE0FF);
  border-color: var(--accent-cyan, #3DE0FF);
  color: #01142F;
  transform: scale(1.02);
  box-shadow: 0 4px 14px rgba(61, 224, 255, 0.35);
}

.editorial-intent-submit-btn:active {
  transform: scale(0.97);
}

/* Footnote */
.editorial-banner-footnote {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 11px;
  color: var(--text-muted, rgba(255, 255, 255, 0.45));
  letter-spacing: 0.01em;
}

/* Responsive Media Queries */
@media (max-width: 1024px) {
  .editorial-banner-grid {
    grid-template-columns: 1fr 1.1fr;
  }
  .editorial-banner-content {
    padding: 36px 30px;
  }
}

@media (max-width: 860px) {
  .editorial-banner-grid {
    grid-template-columns: 1fr;
  }
  .editorial-banner-image-wrap {
    min-height: 280px;
    height: 280px;
  }
  .editorial-banner-image-fade {
    background: linear-gradient(to bottom, transparent 40%, rgba(6, 24, 51, 0.98) 100%);
  }
  .editorial-banner-content {
    padding: 32px 24px 36px;
  }
  .editorial-intent-form {
    flex-direction: column;
    border-radius: 14px;
    padding: 12px;
    gap: 12px;
  }
  .editorial-intent-input-wrap {
    width: 100%;
  }
  .editorial-intent-submit-btn {
    width: 100%;
    justify-content: center;
    padding: 12px;
  }
}

@media (max-width: 480px) {
  .editorial-banner-title {
    font-size: 26px;
  }
  .editorial-prompt-chips {
    gap: 6px;
  }
  .editorial-prompt-chip {
    font-size: 11px;
    padding: 5px 11px;
  }
}
```

- [ ] **Step 2: Verify CSS cascade and no syntax errors**
Ensure the class names match `index.html` exactly.

---

### Task 3: JavaScript Integration in `js/home.js`

**Files:**
- Modify: `js/home.js:826-841`

**Interfaces:**
- Consumes: DOM `#editorialIntentForm`, `#editorialIntentInput`, `.editorial-prompt-chip`, `window.NexSearchOverlay`
- Produces: Seamless search overlay invocation and query pre-fill

- [ ] **Step 1: Update `initEditorialBanner()` implementation**

Replace lines 826–841 in `js/home.js`:

```javascript
/**
 * 5. Pre-Footer Editorial Banner (The Intent Atelier) Handler
 */
function initEditorialBanner() {
  const form = document.getElementById('editorialIntentForm');
  const input = document.getElementById('editorialIntentInput');
  const chips = document.querySelectorAll('.editorial-prompt-chip');

  // Trigger search overlay helper
  function triggerSearch(queryText) {
    if (window.NexSearchOverlay && typeof window.NexSearchOverlay.open === 'function') {
      window.NexSearchOverlay.open();
      const modalInput = document.querySelector('.search-ai-input');
      if (modalInput && queryText) {
        modalInput.value = queryText;
        modalInput.dispatchEvent(new Event('input', { bubbles: true }));
        // Also trigger keydown Enter simulation or search execution if supported
        const submitBtn = document.querySelector('.btn-search-submit');
        if (submitBtn) submitBtn.click();
      }
    } else if (typeof window.openAiSearch === 'function') {
      window.openAiSearch();
    } else {
      const qParam = queryText ? `?q=${encodeURIComponent(queryText)}` : '';
      window.location.href = `discovery.html${qParam}`;
    }
  }

  // Handle Intent Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input ? input.value.trim() : '';
      triggerSearch(query);
    });
  }

  // Handle Quick Prompt Chips
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
      if (input) input.value = prompt;
      triggerSearch(prompt);
    });
  });
}
```

- [ ] **Step 2: Verify Lucide Icons initialization**
Ensure `if (window.lucide) { lucide.createIcons(); }` runs upon DOM ready so the new sparkles, search, and shield-check icons render crisp SVGs.

---

## Verification Plan

### Automated / Syntax Verification
- Run code inspection / linters to ensure valid HTML, CSS, and JS syntax.

### Visual & Functional Browser Verification
- Load `index.html` in browser.
- Verify pre-footer banner renders with:
  1. Deep obsidian luxury card with specular highlight border.
  2. Seamless organic gradient fade between model lifestyle photo and content zone.
  3. Crisp serif typography with italicized accent.
  4. 3 interactive prompt chips that highlight on hover and open search when clicked.
  5. Sleek inline intent search capsule with focus ring and responsive submit button.
  6. Footnote with shield icon.
- Test responsive viewports at Desktop (1280px / 1440px), Tablet (768px), and Mobile (390px).
- Verify clicking prompt chips and submitting form seamlessly triggers AI search or routes to `discovery.html`.
