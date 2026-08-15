# Intent Discovery Card Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage "Tell us what you need" conversational intent discovery card into a high-end luxury Editorial Command Bar with rotating placeholder prompts, expansive 56px command input, and curated lifestyle intent pills.

**Architecture:** Update markup in `index.html`, rewrite component styles in `css/design-system.css`, and augment placeholder rotation & click handling in `js/home.js`.

**Tech Stack:** Semantic HTML5, Vanilla CSS3 (Custom Properties & Glassmorphism), ES6 JavaScript, Lucide Icons.

## Global Constraints
- High-end dark luxury aesthetic aligned with nexCommerce design system.
- Zero external CSS frameworks (strictly Vanilla CSS).
- Interactive touch targets >= 44x44px.
- Fully responsive across desktop (1440px), tablet (768px), and mobile (375px).

---

### Task 1: HTML Architecture Update in `index.html`

**Files:**
- Modify: `index.html:494-528`

**Interfaces:**
- Consumes: Lucide icons (`sparkles`, `search`, `arrow-right`, `wine`, `compass`, `briefcase`, `gift`, `sun`)
- Produces: Updated DOM elements `#homeIntentForm`, `#homeIntentInput`, and `.intent-chip-pill[data-query]`

- [ ] **Step 1: Replace conversational intent discovery section HTML**

```html
    <!-- CONVERSATIONAL INTENT DISCOVERY CARD ("TELL US WHAT YOU NEED") -->
    <section class="home-intent-card-section reveal-on-scroll" aria-label="Intent-based Product Search">
      <div class="container">
        <div class="home-intent-card">
          <div class="intent-card-ambient-glow" aria-hidden="true"></div>
          
          <div class="intent-card-header">
            <div class="intent-badge">
              <i data-lucide="sparkles" class="intent-badge-icon"></i>
              <span>Natural Language Discovery</span>
            </div>
            <h3 class="intent-text-heading">Tell us what you're dressing for.</h3>
            <p class="intent-text-sub">Describe an occasion, destination, weather, style, or anything that matters to you.</p>
          </div>

          <form id="homeIntentForm" class="intent-input-wrap">
            <div class="intent-input-icon-prefix">
              <i data-lucide="search" style="width: 18px; height: 18px;"></i>
            </div>
            <input 
              type="text" 
              id="homeIntentInput" 
              class="intent-input-field" 
              placeholder="Something for a winter evening in Dhaka" 
              autocomplete="off" 
              aria-label="Describe what you are looking for"
            />
            <button type="submit" class="intent-submit-circle-btn" aria-label="Search Catalog">
              <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
            </button>
          </form>

          <div class="intent-card-bottom">
            <span class="intent-try-label">Popular Prompts</span>
            <div class="intent-chips-grid">
              <button type="button" class="intent-chip-pill" data-query="Dinner outfit for a cool evening in Dhaka">
                <i data-lucide="wine" class="intent-chip-icon"></i>
                <span>Dinner Outfit</span>
              </button>
              <button type="button" class="intent-chip-pill" data-query="Lightweight apparel for weekend trip">
                <i data-lucide="compass" class="intent-chip-icon"></i>
                <span>Weekend Trip</span>
              </button>
              <button type="button" class="intent-chip-pill" data-query="Minimalist tailored workwear">
                <i data-lucide="briefcase" class="intent-chip-icon"></i>
                <span>Comfortable for Work</span>
              </button>
              <button type="button" class="intent-chip-pill" data-query="Luxury gifts for him">
                <i data-lucide="gift" class="intent-chip-icon"></i>
                <span>Gift for Him</span>
              </button>
              <button type="button" class="intent-chip-pill" data-query="Light breathable summer fabrics">
                <i data-lucide="sun" class="intent-chip-icon"></i>
                <span>Light for Summer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 2: Verify HTML syntax & elements**

---

### Task 2: CSS Styles in `css/design-system.css`

**Files:**
- Modify: `css/design-system.css:7560-7700`

**Interfaces:**
- Produces: CSS rules for `.home-intent-card-section`, `.home-intent-card`, `.intent-card-ambient-glow`, `.intent-card-header`, `.intent-badge`, `.intent-input-wrap`, `.intent-input-icon-prefix`, `.intent-input-field`, `.intent-submit-circle-btn`, `.intent-card-bottom`, `.intent-chips-grid`, `.intent-chip-pill`

- [ ] **Step 1: Write modern luxury styles in `css/design-system.css`**

```css
/* ==========================================================================
   CONVERSATIONAL INTENT DISCOVERY CARD ("TELL US WHAT YOU NEED") - REDESIGN
   ========================================================================== */
.home-intent-card-section {
  padding: 36px 0 28px;
  position: relative;
}
.home-intent-card {
  position: relative;
  background: linear-gradient(180deg, rgba(14, 22, 42, 0.82) 0%, rgba(7, 12, 24, 0.94) 100%);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 24px;
  padding: 44px 48px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.48), inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.intent-card-ambient-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  height: 240px;
  background: radial-gradient(ellipse at center, rgba(225, 29, 72, 0.15) 0%, rgba(99, 102, 241, 0.08) 50%, transparent 80%);
  pointer-events: none;
  z-index: 0;
}
.intent-card-header {
  position: relative;
  z-index: 1;
  max-width: 620px;
  margin-bottom: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.intent-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 100px;
  background: rgba(225, 29, 72, 0.10);
  border: 1px solid rgba(225, 29, 72, 0.28);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #F43F5E;
  margin-bottom: 14px;
}
.intent-badge-icon {
  width: 13px;
  height: 13px;
}
.intent-text-heading {
  font-family: var(--font-heading, "Playfair Display", serif);
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: #FFFFFF;
  margin-bottom: 8px;
  line-height: 1.25;
}
.intent-text-sub {
  font-family: var(--font-body);
  font-size: 13.5px;
  color: var(--text-muted, #94A3B8);
  line-height: 1.55;
  max-width: 520px;
}

.intent-input-wrap {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 680px;
  display: flex;
  align-items: center;
  background: rgba(4, 9, 20, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 100px;
  padding: 6px 8px 6px 20px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(0, 0, 0, 0.2);
  transition: all 220ms ease;
  margin-bottom: 24px;
}
.intent-input-wrap:focus-within {
  border-color: #E11D48;
  background: rgba(4, 9, 20, 0.85);
  box-shadow: 0 0 0 3px rgba(225, 29, 72, 0.18), 0 12px 32px rgba(0, 0, 0, 0.45);
}
.intent-input-icon-prefix {
  color: var(--text-muted, #94A3B8);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  transition: color 200ms ease;
}
.intent-input-wrap:focus-within .intent-input-icon-prefix {
  color: #F43F5E;
}
.intent-input-field {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 14.5px;
  color: #FFFFFF;
  padding: 10px 4px;
  letter-spacing: 0.01em;
}
.intent-input-field::placeholder {
  color: rgba(148, 163, 184, 0.7);
  transition: opacity 200ms ease;
}
.intent-submit-circle-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, #E11D48 0%, #BE123C 100%);
  border: none;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 4px 14px rgba(225, 29, 72, 0.38);
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}
.intent-submit-circle-btn:hover {
  transform: scale(1.06);
  background: linear-gradient(135deg, #F43F5E 0%, #E11D48 100%);
  box-shadow: 0 6px 20px rgba(225, 29, 72, 0.55);
}
.intent-submit-circle-btn:active {
  transform: scale(0.96);
}

.intent-card-bottom {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  flex-wrap: wrap;
}
.intent-try-label {
  font-size: 11.5px;
  font-weight: 600;
  color: var(--text-muted, #94A3B8);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.intent-chips-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}
.intent-chip-pill {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.10);
  border-radius: 100px;
  padding: 8px 16px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 500;
  color: var(--text-secondary, #E2E8F0);
  cursor: pointer;
  backdrop-filter: blur(8px);
  transition: all 180ms cubic-bezier(0.2, 0.8, 0.2, 1);
}
.intent-chip-icon {
  width: 14px;
  height: 14px;
  color: #F43F5E;
  opacity: 0.85;
  transition: opacity 180ms ease, transform 180ms ease;
}
.intent-chip-pill:hover {
  background: rgba(255, 255, 255, 0.09);
  border-color: rgba(255, 255, 255, 0.28);
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
}
.intent-chip-pill:hover .intent-chip-icon {
  opacity: 1;
  transform: scale(1.1);
}
.intent-chip-pill:active {
  transform: translateY(0);
}

@media (max-width: 768px) {
  .home-intent-card {
    padding: 32px 20px;
    border-radius: 20px;
  }
  .intent-text-heading {
    font-size: 22px;
  }
  .intent-input-wrap {
    padding: 4px 6px 4px 14px;
  }
  .intent-card-bottom {
    flex-direction: column;
    gap: 10px;
  }
  .intent-chips-grid {
    justify-content: center;
  }
}
```

---

### Task 3: JavaScript Animations & Logic in `js/home.js`

**Files:**
- Modify: `js/home.js:565-598`

**Interfaces:**
- Consumes: `#homeIntentInput`, `#homeIntentForm`, `.intent-chip-pill`
- Produces: Rotating placeholder animation loop and Lucide icons refresh

- [ ] **Step 1: Implement animated placeholder rotation & intent listener**

```javascript
/**
 * 2. Clickable Intent Suggestions, Form Search & Rotating Placeholder
 */
function initIntentSuggestions() {
  const chips = document.querySelectorAll('.intent-chip-pill, .intent-suggestion-chip');
  const input = document.getElementById('homeIntentInput') || document.getElementById('homeDiscoveryInput');
  const form = document.getElementById('homeIntentForm') || document.getElementById('homeDiscoveryForm');

  // Chip click handler
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-query') || chip.textContent.trim();
      if (input) {
        input.value = text;
        input.focus();
      }
      window.location.href = `discovery.html?q=${encodeURIComponent(text)}`;
    });
  });

  // Form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const activeInput = form.querySelector('input');
      const val = activeInput ? activeInput.value.trim() : '';
      if (val) {
        window.location.href = `discovery.html?q=${encodeURIComponent(val)}`;
      }
    });
  }

  // Animated Placeholder Rotation
  if (input) {
    const prompts = [
      "Something for a winter evening in Dhaka",
      "Minimalist linen outfit for a weekend in Sylhet",
      "Sharp monochrome look for an executive dinner",
      "Breathable lightweight layers under BDT 15,000",
      "Comfortable silk blend shirt for warm weather"
    ];
    let promptIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let rotationTimeout = null;

    function typeEffect() {
      // Don't rotate if user has focused or typed something
      if (document.activeElement === input || input.value.length > 0) {
        rotationTimeout = setTimeout(typeEffect, 2000);
        return;
      }

      const currentPrompt = prompts[promptIndex];
      if (isDeleting) {
        input.setAttribute('placeholder', currentPrompt.substring(0, charIndex - 1));
        charIndex--;
      } else {
        input.setAttribute('placeholder', currentPrompt.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 30 : 60;

      if (!isDeleting && charIndex === currentPrompt.length) {
        speed = 3000; // Pause at end of phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        promptIndex = (promptIndex + 1) % prompts.length;
        speed = 600; // Pause before typing next
      }

      rotationTimeout = setTimeout(typeEffect, speed);
    }

    // Start rotation
    rotationTimeout = setTimeout(typeEffect, 1500);
  }

  // Refresh Lucide icons for any dynamic icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}
```

---

### Task 4: Visual & Interactive Verification

- [ ] **Step 1: Check browser rendering with `browser_take_screenshot`**
- [ ] **Step 2: Verify responsive states at 1280px and 480px**
- [ ] **Step 3: Test chip clicks & submission redirect to `discovery.html`**
