# Intent Discovery Card — Motion Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild the `<!-- CONVERSATIONAL INTENT DISCOVERY CARD -->` ("Tell us what you're dressing for") into a modern, minimalist luxury editorial experience fully integrated with all 4 Motion Standards: micro-interactions (typewriter look-switcher + progress sync + tactile ripple), 3D hover physics (mouse tilt + multi-layer realistic shadows + dynamic specular glare), GPU page transitions, and differential scroll parallax.

**Architecture:** 
1. `index.html`: Refined DOM hierarchy with specular sheen layer, ambient beam glow, chip capsule ripple spans, and differential parallax depth attributes (`data-parallax-depth`).
2. `css/design-system.css`: Complete modern CSS rewrite eliminating hard bold borders in favor of soft luxury glassmorphic hairlines (`rgba(255, 255, 255, 0.08)`), multi-tier obsidian shadows, 3D tilt CSS variables, and fluid responsive scaling.
3. `js/home.js`: Enhanced `initIntentSuggestions()` managing the typewriter rotation with synchronized progress bar, chip click ripples, and input focus aura.
4. `js/animations.js`: Dedicated `initIntentCardMotion()` controlling 3D mouse tilt with spring physics, cursor specular tracking, differential layer scroll parallax, and GPU cross-dissolve page transitions to `pages/discovery.html`.

**Tech Stack:** Vanilla HTML5 / CSS3 · Motion.dev v11 (ESM CDN) · Lenis Smooth Scroll · Lucide Icons · CSS Custom Properties for 3D physics.

---

## Global Constraints

- **Palette:** Luxury Obsidian `#020B18` base, accent cyan `#3DE0FF`, accent pink `#F13365`, soft muted text `#94A3B8`, pure white `#FFFFFF`.
- **Border Aesthetics:** Strictly **NO hard, bold borders**. Use soft translucent hairlines (`1px solid rgba(255, 255, 255, 0.08)`), subtle glassmorphic backdrop-filters, and soft ambient radial glows.
- **Typography:** Display headlines in refined modern serif / grotesque (`Playfair Display` or `Outfit`), clean `Work Sans` body.
- **Touch Targets:** Minimum 44×44px for all interactive targets (input submit button, chips, etc.).
- **Responsiveness:** Flawless across Desktop (1280px+), Tablet (768px–1024px), and Mobile (320px–480px).
- **Reduced Motion:** Full graceful fallback under `prefers-reduced-motion: reduce`.
- **Functional Integrity:** Preserves natural language query dispatching, chip search execution, and routing to `pages/discovery.html?q=...`.

---

## Visual Blueprint

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  CONVERSATIONAL INTENT DISCOVERY SECTION  (padding: 44px 0 52px)                        │
│                                                                                         │
│  ┌───────────────────────────────────────────────────────────────────────────────────┐  │
│  │  3D TILT CANVAS  (perspective: 1200px, border-radius: 20px, glassmorphic obsidian)│  │
│  │                                                                                   │  │
│  │  [✦ Natural Language Discovery]  ← Glowing pill badge                              │  │
│  │                                                                                   │  │
│  │  Tell us what you're dressing for.                                                │  │
│  │  Describe an occasion, destination, weather, style, or anything that matters.     │  │
│  │                                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────────────────────────┐  │  │
│  │  │ 🔍  "Minimalist linen outfit for a weekend in Sylhet"              [  →  ] │  │  │
│  │  │     ──────────────────────────────██████░░░░░░░░░░  ← 120fps typing timer  │  │  │
│  │  └─────────────────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                                   │  │
│  │  Popular Inquiries:                                                               │  │
│  │  [ 🍷 Dinner Outfit ]  [ 🧭 Weekend Trip ]  [ 💼 Workwear ]  [ 🎁 Gift ]  [ ☀️ Summer]│
│  │                                                                                   │  │
│  │  3D Specular Sheen Layer: radial-gradient following cursor coordinates (X, Y)     │  │
│  └───────────────────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3D Hover & Specular Interaction (Side / Dynamic View)
```
          ↑ translateZ(16px) lift on mouse hover
     ┌───────────────────────────────────────────────────────┐
     │   Card Surface: rotateX(-3.5deg) rotateY(4.2deg)      │
     │      \   Dynamic Specular Glare (tracks cursor)       │
     │       \  rgba(255, 255, 255, 0.08) at (mouse-x, y)    │
     └───────────────────────────────────────────────────────┘
          Shadow 1: 0 30px 70px rgba(0, 0, 0, 0.55)  (deep ambient)
          Shadow 2: 0 10px 25px rgba(61, 224, 255, 0.06) (cyan glow accent)
          Shadow 3: 0 2px 6px rgba(0, 0, 0, 0.3)     (crisp contact)
```

### Typewriter & 120fps Progress Timer Detail
```
  Input Search Pill:
  ┌────────────────────────────────────────────────────────────────────────┐
  │  (icon)  "Monochrome look for an evening gala|"               [  ➔  ]  │
  └────────────────────────────────────────────────────────────────────────┘
             ▲ Typewriter rotation (char-by-char with blinking caret)
             ▲ Synchronized GPU scaleX(0 → 1) indicator during prompt hold
```

### Differential Scroll Parallax
```
  User scrolls down page:
  - Background ambient mesh:  translateY(centered * 10px)  [layer 0]
  - Card shell:               translateY(centered * 18px)  [layer 1]
  - Search Input Pill:        translateY(centered * 24px)  [layer 2 - floating top]
  - Suggestion Chips:         translateY(centered * 14px)  [layer 1.5]
```

---

## File Map

| File | Action | Scope |
|------|--------|-------|
| `index.html` | **MODIFY** | Rebuild `<!-- CONVERSATIONAL INTENT DISCOVERY CARD -->` markup (~lines 483–546) |
| `css/design-system.css` | **MODIFY** | Replace intent discovery CSS with soft-luxury glassmorphism + 3D tilt + responsive styling (~lines 8438–8687) |
| `js/home.js` | **MODIFY** | Enhance `initIntentSuggestions()` with typewriter loop, progress sync, and ripple triggers |
| `js/animations.js` | **MODIFY** | Add `initIntentCardMotion()` with 3D spring tilt, specular sheen tracking, differential parallax, and curtain transitions |

---

## Task 1: Rebuild HTML Structure for Intent Discovery

**Files:**
- Modify: `index.html` lines 483–546

**Interfaces:**
- Produces: `#homeIntentSectionRoot`, `.home-intent-card[data-intent-card]`, `.intent-specular-glare`, `.intent-ambient-mesh`, `.intent-typewriter-progress`, `.intent-chip-pill[data-parallax-depth]`, `.intent-chip-ripple`

- [ ] **Step 1.1: Replace section markup in `index.html`**

Update the `<!-- CONVERSATIONAL INTENT DISCOVERY CARD -->` block to:

```html
    <!-- CONVERSATIONAL INTENT DISCOVERY CARD ("TELL US WHAT YOU NEED") -->
    <section class="home-intent-card-section" id="homeIntentSectionRoot" aria-label="Intent-based Product Search">
      <div class="container">
        <div class="home-intent-card" data-intent-card data-parallax-depth="2">
          <!-- Multi-layer Specular & Ambient Sheen -->
          <div class="intent-specular-glare" aria-hidden="true"></div>
          <div class="intent-ambient-mesh" aria-hidden="true"></div>
          
          <div class="intent-card-header">
            <div class="intent-badge-glow">
              <i data-lucide="sparkles" class="intent-badge-icon"></i>
              <span>Natural Language Discovery</span>
            </div>
            <h3 class="intent-text-heading">Tell us what you're dressing for.</h3>
            <p class="intent-text-sub">Describe an occasion, destination, weather, style, or anything that matters to you.</p>
          </div>

          <form id="homeIntentForm" class="intent-input-wrap" data-parallax-depth="3">
            <div class="intent-input-icon-prefix">
              <i data-lucide="sparkles" style="width: 18px; height: 18px;"></i>
            </div>
            <div class="intent-input-core">
              <input 
                type="text" 
                id="homeIntentInput" 
                class="intent-input-field" 
                placeholder="Something for a winter evening in Dhaka" 
                autocomplete="off" 
                aria-label="Describe what you are looking for"
              />
              <div class="intent-typewriter-progress" aria-hidden="true">
                <div class="intent-typewriter-bar" id="intentTypewriterBar"></div>
              </div>
            </div>
            <button type="submit" class="intent-submit-circle-btn" id="homeIntentSubmitBtn" aria-label="Search Catalog">
              <span class="intent-btn-ripple" aria-hidden="true"></span>
              <i data-lucide="arrow-right" style="width: 18px; height: 18px;"></i>
            </button>
          </form>

          <div class="intent-card-bottom" data-parallax-depth="1">
            <span class="intent-try-label">Popular Prompts</span>
            <div class="intent-chips-grid">
              <button type="button" class="intent-chip-pill" data-query="Dinner outfit for a cool evening in Dhaka" data-chip-depth="1">
                <span class="intent-chip-ripple" aria-hidden="true"></span>
                <i data-lucide="wine" class="intent-chip-icon"></i>
                <span>Dinner Outfit</span>
              </button>
              <button type="button" class="intent-chip-pill" data-query="Lightweight apparel for weekend trip" data-chip-depth="2">
                <span class="intent-chip-ripple" aria-hidden="true"></span>
                <i data-lucide="compass" class="intent-chip-icon"></i>
                <span>Weekend Trip</span>
              </button>
              <button type="button" class="intent-chip-pill" data-query="Minimalist tailored workwear" data-chip-depth="3">
                <span class="intent-chip-ripple" aria-hidden="true"></span>
                <i data-lucide="briefcase" class="intent-chip-icon"></i>
                <span>Comfortable for Work</span>
              </button>
              <button type="button" class="intent-chip-pill" data-query="Luxury gifts for him" data-chip-depth="2">
                <span class="intent-chip-ripple" aria-hidden="true"></span>
                <i data-lucide="gift" class="intent-chip-icon"></i>
                <span>Gift for Him</span>
              </button>
              <button type="button" class="intent-chip-pill" data-query="Light breathable summer fabrics" data-chip-depth="1">
                <span class="intent-chip-ripple" aria-hidden="true"></span>
                <i data-lucide="sun" class="intent-chip-icon"></i>
                <span>Light for Summer</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
```

- [ ] **Step 1.2: Verify DOM structure**

Run verification check:
```powershell
Select-String -Path "index.html" -Pattern "homeIntentSectionRoot|intent-specular-glare|intent-typewriter-bar|intent-chip-ripple"
```
Expected: All patterns present.

- [ ] **Step 1.3: Commit**

```bash
git add index.html
git commit -m "feat(intent): rebuild intent discovery card DOM with specular glare and motion hooks"
```

---

## Task 2: CSS — Modern Soft-Luxury Redesign

**Files:**
- Modify: `css/design-system.css` lines ~8438–8687

**Interfaces:**
- Consumes: `--accent-cyan`, `--accent-pink`, `--font-display`, `--font-body`, `--text-muted`
- Produces: Soft translucent hairlines, multi-tier shadow system, 3D tilt custom properties (`--intent-tilt-x`, `--intent-tilt-y`, `--intent-glare-x`, `--intent-glare-y`, `--intent-glare-opacity`), typewriter progress bar, chip hover physics, and responsive media queries.

- [ ] **Step 2.1: Replace Intent Card CSS block in `css/design-system.css`**

Replace old intent section styles with:

```css
/* ==========================================================================
   CONVERSATIONAL INTENT DISCOVERY CARD — SOFT LUXURY MOTION REDESIGN
   ========================================================================== */

.home-intent-card-section {
  padding: 48px 0 56px;
  position: relative;
  perspective: 1200px;
}

.home-intent-card {
  --intent-tilt-x: 0deg;
  --intent-tilt-y: 0deg;
  --intent-glare-x: 50%;
  --intent-glare-y: 50%;
  --intent-glare-opacity: 0;
  --intent-shadow-lift: 0;

  position: relative;
  background: linear-gradient(175deg,
    rgba(12, 28, 56, 0.65) 0%,
    rgba(4, 14, 32, 0.85) 100%);
  backdrop-filter: blur(28px) saturate(1.3);
  -webkit-backdrop-filter: blur(28px) saturate(1.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 46px 48px 42px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: default;

  /* 3D Transform driven by JS */
  transform:
    rotateX(var(--intent-tilt-x))
    rotateY(var(--intent-tilt-y))
    translateZ(0)
    translateY(var(--intent-card-y, 0px));

  /* Multi-tier realistic soft shadow */
  box-shadow:
    0 calc(12px + var(--intent-shadow-lift) * 28px) calc(28px + var(--intent-shadow-lift) * 44px) rgba(0, 0, 0, 0.42),
    0 calc(4px + var(--intent-shadow-lift) * 12px) calc(14px + var(--intent-shadow-lift) * 20px) rgba(61, 224, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);

  transition:
    box-shadow 400ms cubic-bezier(0.23, 1, 0.32, 1),
    border-color 300ms ease;
  will-change: transform;
}

.home-intent-card:hover {
  border-color: rgba(255, 255, 255, 0.16);
}

/* Ambient subtle background glow */
.intent-ambient-mesh {
  position: absolute;
  top: -100px;
  left: 50%;
  transform: translateX(-50%) translateY(var(--intent-bg-y, 0px));
  width: 620px;
  height: 280px;
  background: radial-gradient(ellipse at center,
    rgba(61, 224, 255, 0.10) 0%,
    rgba(241, 51, 101, 0.06) 45%,
    transparent 75%);
  pointer-events: none;
  z-index: 0;
}

/* Specular Glare Tracking Layer */
.intent-specular-glare {
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle 380px at var(--intent-glare-x) var(--intent-glare-y),
    rgba(255, 255, 255, 0.08) 0%,
    transparent 70%
  );
  opacity: var(--intent-glare-opacity);
  pointer-events: none;
  z-index: 3;
  transition: opacity 220ms ease;
}

/* Header typography */
.intent-card-header {
  position: relative;
  z-index: 2;
  max-width: 600px;
  margin-bottom: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intent-badge-glow {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 5px 14px;
  border-radius: 9999px;
  background: rgba(61, 224, 255, 0.07);
  border: 1px solid rgba(61, 224, 255, 0.24);
  font-family: var(--font-body);
  font-size: 10.5px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--accent-cyan);
  margin-bottom: 14px;
  box-shadow: 0 2px 10px rgba(61, 224, 255, 0.12);
}

.intent-badge-icon {
  width: 13px;
  height: 13px;
}

.intent-text-heading {
  font-family: var(--font-display);
  font-size: clamp(22px, 2.4vw, 30px);
  font-weight: 700;
  letter-spacing: -0.02em;
  color: #FFFFFF;
  margin: 0 0 8px;
  line-height: 1.2;
}

.intent-text-sub {
  font-family: var(--font-body);
  font-size: 13.5px;
  color: var(--text-muted);
  line-height: 1.5;
  margin: 0;
  max-width: 520px;
}

/* Input Search Pill Wrapper */
.intent-input-wrap {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 680px;
  display: flex;
  align-items: center;
  background: rgba(3, 10, 24, 0.72);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 9999px;
  padding: 6px 8px 6px 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35), inset 0 2px 4px rgba(0, 0, 0, 0.25);
  transition:
    border-color 220ms ease,
    background 220ms ease,
    box-shadow 220ms ease,
    transform 220ms cubic-bezier(0.23, 1, 0.32, 1);
  margin-bottom: 22px;
  transform: translateY(var(--intent-input-y, 0px));
}

.intent-input-wrap:focus-within {
  border-color: var(--accent-cyan);
  background: rgba(3, 10, 24, 0.92);
  box-shadow:
    0 0 0 3px rgba(61, 224, 255, 0.18),
    0 14px 40px rgba(0, 0, 0, 0.5);
  transform: translateY(calc(var(--intent-input-y, 0px) - 2px));
}

.intent-input-icon-prefix {
  color: var(--accent-cyan);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
  opacity: 0.9;
  transition: transform 200ms ease, opacity 200ms ease;
}
.intent-input-wrap:focus-within .intent-input-icon-prefix {
  transform: scale(1.1);
  opacity: 1;
}

.intent-input-core {
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
}

.intent-input-field {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-family: var(--font-body);
  font-size: 14.5px;
  color: #FFFFFF;
  padding: 10px 4px 6px;
  letter-spacing: 0.01em;
}
.intent-input-field::placeholder {
  color: rgba(148, 163, 184, 0.65);
  transition: opacity 200ms ease;
}

/* 120fps Typewriter Progress Bar */
.intent-typewriter-progress {
  width: 96%;
  height: 2px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 0 4px 4px;
}
.intent-typewriter-bar {
  height: 100%;
  width: 100%;
  border-radius: 2px;
  background: linear-gradient(90deg, var(--accent-cyan) 0%, var(--accent-pink) 100%);
  transform-origin: left center;
  transform: scaleX(0);
  will-change: transform;
  transition: transform 100ms linear;
}

/* Submit Circle Button + Ripple */
.intent-submit-circle-btn {
  position: relative;
  overflow: hidden;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-pink) 0%, #BE123C 100%);
  border: none;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-shrink: 0;
  box-shadow: 0 4px 16px rgba(241, 51, 101, 0.38);
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.intent-submit-circle-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 22px rgba(241, 51, 101, 0.55);
}
.intent-submit-circle-btn:active {
  transform: scale(0.96);
}

.intent-btn-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.35);
  pointer-events: none;
  transform: scale(0);
  opacity: 1;
}
.intent-btn-ripple.animating {
  animation: intentRippleExpand 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

/* Bottom prompt chips */
.intent-card-bottom {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
}

.intent-try-label {
  font-family: var(--font-body);
  font-size: 11px;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.intent-chips-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  flex-wrap: wrap;
}

.intent-chip-pill {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 44px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 9999px;
  padding: 8px 16px;
  font-family: var(--font-body);
  font-size: 12px;
  font-weight: 600;
  color: var(--text-secondary, #E2E8F0);
  cursor: pointer;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition:
    background 200ms ease,
    border-color 200ms ease,
    color 200ms ease,
    transform 220ms cubic-bezier(0.23, 1, 0.32, 1),
    box-shadow 220ms ease;
  transform: translateY(var(--chip-y, 0px));
}

.intent-chip-icon {
  width: 14px;
  height: 14px;
  color: var(--accent-cyan);
  opacity: 0.85;
  transition: opacity 180ms ease, transform 180ms ease;
}

.intent-chip-pill:hover {
  background: rgba(61, 224, 255, 0.08);
  border-color: rgba(61, 224, 255, 0.32);
  color: #FFFFFF;
  transform: translateY(calc(var(--chip-y, 0px) - 3px));
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
}

.intent-chip-pill:hover .intent-chip-icon {
  opacity: 1;
  transform: scale(1.15);
  color: #FFFFFF;
}

.intent-chip-ripple {
  position: absolute;
  border-radius: 50%;
  background: rgba(61, 224, 255, 0.25);
  pointer-events: none;
  transform: scale(0);
  opacity: 1;
}
.intent-chip-ripple.animating {
  animation: intentRippleExpand 400ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes intentRippleExpand {
  to { transform: scale(4); opacity: 0; }
}

/* Responsive Media Queries */
@media (max-width: 768px) {
  .home-intent-card-section { padding: 32px 0 40px; perspective: none; }
  .home-intent-card {
    padding: 32px 18px 28px;
    border-radius: 18px;
    transform: none !important;
  }
  .intent-text-heading { font-size: 22px; }
  .intent-input-wrap {
    padding: 4px 6px 4px 14px;
    margin-bottom: 18px;
    transform: none !important;
  }
  .intent-card-bottom {
    flex-direction: column;
    gap: 8px;
  }
  .intent-chips-grid {
    justify-content: center;
    gap: 8px;
  }
  .intent-chip-pill {
    padding: 6px 13px;
    font-size: 11.5px;
    transform: none !important;
  }
}

@media (prefers-reduced-motion: reduce) {
  .home-intent-card,
  .intent-chip-pill,
  .intent-typewriter-bar,
  .intent-input-wrap {
    transition: none !important;
    animation: none !important;
    transform: none !important;
  }
}
```

- [ ] **Step 2.2: Verify CSS structure**

Run verification check:
```powershell
Select-String -Path "css\design-system.css" -Pattern "intent-specular-glare|intent-typewriter-bar|intent-badge-glow|intent-chip-ripple"
```
Expected: Matches found.

- [ ] **Step 2.3: Commit**

```bash
git add css/design-system.css
git commit -m "feat(intent): modern soft luxury CSS redesign with 3D tilt and specular API"
```

---

## Task 3: JS — Micro-Interactions (Typewriter Engine + 120fps Timer + Ripple)

**Files:**
- Modify: `js/home.js` lines ~630–690

**Interfaces:**
- Consumes: `#homeIntentInput`, `#homeIntentForm`, `#intentTypewriterBar`, `.intent-chip-pill`, `.intent-submit-circle-btn`
- Produces: Typewriter character-by-character rotation with GPU progress bar sync, tactile ripple coordinate triggers on click, and search submission dispatch.

- [ ] **Step 3.1: Upgrade `initIntentSuggestions()` in `js/home.js`**

Replace `initIntentSuggestions()` with:

```javascript
/**
 * 2. Clickable Intent Suggestions, Form Search & 120fps Typewriter Loop
 */
function initIntentSuggestions() {
  const chips = document.querySelectorAll('.intent-chip-pill, .intent-suggestion-chip');
  const input = document.getElementById('homeIntentInput') || document.getElementById('homeDiscoveryInput');
  const form  = document.getElementById('homeIntentForm') || document.getElementById('homeDiscoveryForm');
  const submitBtn = document.getElementById('homeIntentSubmitBtn');
  const progressBar = document.getElementById('intentTypewriterBar');

  // Generic ripple trigger helper
  function triggerRipple(btn, rippleSelector, e) {
    const rippleEl = btn.querySelector(rippleSelector);
    if (!rippleEl) return;
    rippleEl.classList.remove('animating');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    rippleEl.style.width  = size + 'px';
    rippleEl.style.height = size + 'px';
    rippleEl.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    rippleEl.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
    void rippleEl.offsetWidth;
    rippleEl.classList.add('animating');
    rippleEl.addEventListener('animationend', () => {
      rippleEl.classList.remove('animating');
    }, { once: true });
  }

  // Clear stale value
  if (input) input.value = '';

  // Chip click handler with tactile ripple
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      triggerRipple(chip, '.intent-chip-ripple', e);
      const text = chip.getAttribute('data-query') || chip.textContent.trim();
      if (input) {
        input.value = text;
        input.focus();
      }
      // Delegate to page transition curtain if available
      const curtain = document.getElementById('pageTransitionOverlay');
      const targetUrl = `pages/discovery.html?q=${encodeURIComponent(text)}`;
      if (curtain) {
        curtain.style.transition = 'opacity 200ms ease';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = targetUrl; }, 210);
      } else {
        window.location.href = targetUrl;
      }
    });
  });

  // Form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitBtn) triggerRipple(submitBtn, '.intent-btn-ripple', e);
      const activeInput = form.querySelector('input');
      const val = activeInput ? activeInput.value.trim() : '';
      if (val) {
        const curtain = document.getElementById('pageTransitionOverlay');
        const targetUrl = `pages/discovery.html?q=${encodeURIComponent(val)}`;
        if (curtain) {
          curtain.style.transition = 'opacity 200ms ease';
          curtain.style.opacity = '1';
          curtain.style.pointerEvents = 'all';
          setTimeout(() => { window.location.href = targetUrl; }, 210);
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  }

  // 120fps Typewriter Rotation with Progress Sync
  if (input) {
    const prompts = [
      "Something for a winter evening in Dhaka",
      "Minimalist linen outfit for a weekend in Sylhet",
      "Sharp monochrome look for an executive dinner",
      "Breathable performance wear for morning runs",
      "Tailored outerwear for European autumn travel",
      "Understated luxury accessories for gifting"
    ];

    let promptIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let isPaused = false;
    let holdStartTime = 0;
    const HOLD_DURATION = 3500; // ms to pause on full prompt

    // Pause typewriter if user interacts with input
    input.addEventListener('focus', () => { isPaused = true; });
    input.addEventListener('blur',  () => {
      if (!input.value.trim()) { isPaused = false; }
    });
    input.addEventListener('input', () => {
      isPaused = !!input.value.trim();
    });

    function typeLoop(timestamp) {
      if (isPaused) {
        requestAnimationFrame(typeLoop);
        return;
      }

      const currentFullText = prompts[promptIdx];

      if (!isDeleting) {
        // Typing forward
        input.placeholder = currentFullText.substring(0, charIdx + 1);
        charIdx++;

        if (charIdx === currentFullText.length) {
          isDeleting = true;
          holdStartTime = performance.now();
        }
        setTimeout(() => requestAnimationFrame(typeLoop), 45);
      } else {
        // Holding full text with progress bar sync
        const elapsed = performance.now() - holdStartTime;
        if (elapsed < HOLD_DURATION) {
          if (progressBar) {
            const ratio = Math.min(1, elapsed / HOLD_DURATION);
            progressBar.style.transform = `scaleX(${ratio.toFixed(3)})`;
          }
          requestAnimationFrame(typeLoop);
        } else {
          // Reset progress bar & delete text
          if (progressBar) progressBar.style.transform = 'scaleX(0)';
          input.placeholder = currentFullText.substring(0, charIdx - 1);
          charIdx--;

          if (charIdx === 0) {
            isDeleting = false;
            promptIdx = (promptIdx + 1) % prompts.length;
          }
          setTimeout(() => requestAnimationFrame(typeLoop), 25);
        }
      }
    }

    requestAnimationFrame(typeLoop);
  }
}
```

- [ ] **Step 3.2: Verify `home.js` execution**

Run verification check:
```powershell
Select-String -Path "js\home.js" -Pattern "intentTypewriterBar|triggerRipple|HOLD_DURATION"
```
Expected: Matches found.

- [ ] **Step 3.3: Commit**

```bash
git add js/home.js
git commit -m "feat(intent): typewriter prompt switcher with 120fps progress sync and tactile ripples"
```

---

## Task 4: JS — 3D Hover Physics, Specular Sheen, Parallax & Page Transitions

**Files:**
- Modify: `js/animations.js` — add `initIntentCardMotion()` & call in `DOMContentLoaded`
- Modify: `index.html` — bump version strings

**Interfaces:**
- Consumes: `#homeIntentSectionRoot`, `.home-intent-card`, `.intent-specular-glare`, `window._nexLenis`
- Produces: 3D spring tilt physics (`--intent-tilt-x/y`), specular cursor spotlight (`--intent-glare-x/y/opacity`), differential scroll parallax (`--intent-card-y`, `--intent-input-y`, `--intent-bg-y`, `--chip-y`).

- [ ] **Step 4.1: Add `initIntentCardMotion()` to `js/animations.js`**

Append after `initDealsSectionMotion()`:

```javascript
/**
 * initIntentCardMotion
 * Implements all 4 Motion Standards for Intent Discovery Card:
 * 1. Micro-interactions (scroll reveal entrance)
 * 2. 3D Hover Physics (spring lerp tilt + dynamic specular glare)
 * 3. GPU Page Transition (curtain cross-dissolve)
 * 4. Scroll Parallax (differential layer depth)
 */
function initIntentCardMotion() {
  const section = document.getElementById('homeIntentSectionRoot');
  if (!section) return;

  const card = section.querySelector('.home-intent-card');
  if (!card) return;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. MICRO-INTERACTIONS: Scroll Reveal Entrance ──────────────────
  let revealed = false;
  inView(section, () => {
    if (revealed) return;
    revealed = true;

    animate(card,
      { opacity: [0, 1], y: [32, 0], scale: [0.97, 1] },
      { duration: 0.85, easing: [0.16, 1, 0.3, 1] }
    );

    const chips = section.querySelectorAll('.intent-chip-pill');
    if (chips.length > 0) {
      animate(chips,
        { opacity: [0, 1], y: [14, 0] },
        { delay: stagger(0.06, { startDelay: 0.25 }), duration: 0.6, easing: [0.16, 1, 0.3, 1] }
      );
    }
  }, { margin: '0px 0px -10% 0px' });

  if (prefersReduced) return;

  // ── 2. 3D HOVER PHYSICS: Mouse Tilt & Specular Tracking ────────────
  const MAX_TILT = 5.5; // degrees (subtle, non-distorting)
  let rafId = null;
  let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0;
  const LERP = 0.10;
  const lerp = (a, b, t) => a + (b - a) * t;

  function getCardParallaxY() {
    return parseFloat(card.style.getPropertyValue('--intent-card-y') || '0');
  }

  function applyCardTilt() {
    curTX = lerp(curTX, tgtTX, LERP);
    curTY = lerp(curTY, tgtTY, LERP);
    const py = getCardParallaxY();
    card.style.setProperty('--intent-shadow-lift', '1');
    card.style.transform =
      `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;

    if (Math.abs(curTX - tgtTX) > 0.04 || Math.abs(curTY - tgtTY) > 0.04) {
      rafId = requestAnimationFrame(applyCardTilt);
    } else {
      card.style.transform =
        `rotateX(${tgtTX.toFixed(3)}deg) rotateY(${tgtTY.toFixed(3)}deg) translateZ(12px) translateY(${py}px)`;
      rafId = null;
    }
  }

  card.addEventListener('mousemove', (e) => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    tgtTX = -(dy * MAX_TILT);
    tgtTY =  (dx * MAX_TILT);

    // Specular glare tracking
    const gx = ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%';
    const gy = ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%';
    card.style.setProperty('--intent-glare-x', gx);
    card.style.setProperty('--intent-glare-y', gy);
    card.style.setProperty('--intent-glare-opacity', '1');

    if (!rafId) { rafId = requestAnimationFrame(applyCardTilt); }
  });

  card.addEventListener('mouseleave', () => {
    tgtTX = 0; tgtTY = 0;
    card.style.setProperty('--intent-glare-opacity', '0');
    card.style.setProperty('--intent-shadow-lift', '0');

    function springBack() {
      curTX = lerp(curTX, 0, 0.16);
      curTY = lerp(curTY, 0, 0.16);
      const py = getCardParallaxY();
      card.style.transform =
        `rotateX(${curTX.toFixed(3)}deg) rotateY(${curTY.toFixed(3)}deg) translateZ(0px) translateY(${py}px)`;
      if (Math.abs(curTX) > 0.04 || Math.abs(curTY) > 0.04) {
        rafId = requestAnimationFrame(springBack);
      } else {
        card.style.transform = `translateY(${py}px)`;
        rafId = null;
      }
    }
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(springBack);
  });

  // ── 3. SCROLL PARALLAX: Differential Layer Depth ───────────────────
  let pxTicking = false;
  const inputWrap = card.querySelector('.intent-input-wrap');
  const bgMesh    = card.querySelector('.intent-ambient-mesh');
  const chipPills = card.querySelectorAll('.intent-chip-pill');

  function updateIntentParallax() {
    const rect = section.getBoundingClientRect();
    const winH = window.innerHeight;

    if (rect.bottom > 0 && rect.top < winH) {
      const span     = winH + rect.height;
      const prog     = (winH - rect.top) / span; // 0 → 1
      const centered = (prog - 0.5) * 2;         // -1 → +1

      // Layer 1: Card Base
      const cardY = (centered * 16).toFixed(2);
      card.style.setProperty('--intent-card-y', cardY + 'px');
      if (!card.matches(':hover')) {
        card.style.transform = `translateY(${cardY}px)`;
      }

      // Layer 0: Background Ambient Mesh (drifts slower)
      if (bgMesh) {
        const bgY = (centered * 10).toFixed(2);
        card.style.setProperty('--intent-bg-y', bgY + 'px');
      }

      // Layer 2: Floating Input Wrap (drifts faster)
      if (inputWrap) {
        const inputY = (centered * 22).toFixed(2);
        card.style.setProperty('--intent-input-y', inputY + 'px');
      }

      // Layer 1.5: Suggestion Chips
      chipPills.forEach(chip => {
        const depth = parseInt(chip.getAttribute('data-chip-depth') || '1', 10);
        const chipY = (centered * depth * 5).toFixed(2);
        chip.style.setProperty('--chip-y', chipY + 'px');
      });
    }
    pxTicking = false;
  }

  function requestParallaxTick() {
    if (!pxTicking) {
      requestAnimationFrame(updateIntentParallax);
      pxTicking = true;
    }
  }

  if (window._nexLenis) { window._nexLenis.on('scroll', requestParallaxTick); }
  window.addEventListener('scroll', requestParallaxTick, { passive: true });
}
```

- [ ] **Step 4.2: Call `initIntentCardMotion()` in `DOMContentLoaded`**

In `animations.js`, update DOMContentLoaded handler to include:
```javascript
initIntentCardMotion();
```

- [ ] **Step 4.3: Version bump in `index.html`**

Update `animations.js?v=8` → `animations.js?v=9` and `home.js?v=23` → `home.js?v=24`.

- [ ] **Step 4.4: Commit**

```bash
git add js/animations.js index.html
git commit -m "feat(intent): 3D spring tilt, specular cursor sheen, differential scroll parallax, and page transitions"
```

---

## Task 5: Responsive & Cross-Browser QA

**Files:**
- Modify: `index.html` — bump `design-system.css?v=23`

- [ ] **Step 5.1: Desktop 1280px testing**
  - Verify card 3D tilt on hover with specular glare.
  - Verify typewriter placeholder rotation with progress bar.
  - Verify chip ripple on click and navigation.

- [ ] **Step 5.2: Tablet 768px testing**
  - Verify smooth responsive layout, no overflowing pills.

- [ ] **Step 5.3: Mobile 375px testing**
  - Verify 3D tilt is safely disabled (`transform: none !important`), touch targets are comfortable, input is responsive.

- [ ] **Step 5.4: Reduced-motion verification**
  - Emulate `prefers-reduced-motion: reduce` — ensure static, peaceful presentation.

- [ ] **Step 5.5: Final commit**

```bash
git add index.html
git commit -m "chore(intent): CSS v23 bump and full cross-device QA"
```

---

## Verification Plan

### Automated Checks
```powershell
# 1. Check all essential DOM IDs and classes
Select-String -Path "index.html" -Pattern "homeIntentSectionRoot|homeIntentForm|homeIntentInput|intent-specular-glare|intent-typewriter-bar"
# 2. Check CSS custom properties
Select-String -Path "css\design-system.css" -Pattern "--intent-tilt-x|--intent-glare-opacity|--intent-card-y|--intent-input-y"
# 3. Check JS handlers
Select-String -Path "js\animations.js" -Pattern "initIntentCardMotion"
Select-String -Path "js\home.js" -Pattern "initIntentSuggestions"
```

### Manual Verification Checklist
| # | Test | Expected Result |
|---|------|-----------------|
| 1 | Scroll to Intent Card | Smooth entrance cascade with cubic-bezier easing |
| 2 | Hover over Intent Card | 3D card tilt towards mouse with specular spotlight sheen |
| 3 | Move mouse off card | Card smoothly spring-settles back to 0° |
| 4 | Watch input placeholder | Character-by-character typewriter loop with 120fps progress indicator |
| 5 | Focus input field | Typewriter pauses, glowing cyan focus ring appears |
| 6 | Click popular prompt pill | Tactile ripple expands, GPU curtain dissolve transitions to `pages/discovery.html?q=...` |
| 7 | Submit custom query | Ripple triggers on arrow button, navigates to discovery page with query |
| 8 | Scroll page slowly | Differential depth drift: ambient mesh, card base, and input pill glide at layered speeds |
| 9 | Mobile 375px | Clean touch layout, no overflow, 3D tilt disabled |
