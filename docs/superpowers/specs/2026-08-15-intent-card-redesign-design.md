# Intent Discovery Card Redesign — Editorial Luxury Command Bar

## Executive Summary
Redesign the **"Tell us what you need" Conversational Intent Discovery Card** on the nexCommerce homepage (`index.html`) from a standard two-column widget into a world-class **Editorial Luxury Command Bar**. The new design combines high-end luxury e-commerce aesthetics (inspired by SSENSE, Brunello Cucinelli, and Apple) with dynamic micro-interactions, an animated rotating placeholder prompt engine, and contextual lifestyle discovery chips.

---

## 1. Visual & Spatial Architecture

### Current Friction Points
1. **Asymmetric Box Clutter:** The left-aligned text with a separate right-aligned input field creates awkward empty space and limits input width to 480px.
2. **Generic SaaS Aesthetics:** The hot pink circular icon and submit button feel detached from luxury lifestyle retail.
3. **Static Chips:** The "TRY:" pills are styled with low-contrast borders and lack lifestyle context or iconographic anchors.

### Proposed Architecture & Layout
- **Centered Hero Capsule Card:**
  - Ambient backlight glow (`radial-gradient(ellipse at 50% 0%, rgba(225, 29, 72, 0.08) 0%, rgba(15, 23, 42, 0) 70%)`).
  - Dark luxury glassmorphic card: Deep obsidian background (`rgba(8, 14, 28, 0.75)`), multi-layered backdrop blur (`24px`), subtle border gradient (`linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.03) 100%)`).
  - Generous internal padding (`40px 48px` desktop, `24px 20px` mobile) with smooth 20px corner radius.
- **Typographic Hierarchy & Editorial Header:**
  - **Eyebrow Tag:** Subtle pill badge (`✨ AI INTENT DISCOVERY`) with frosted backdrop and micro-sparkle icon.
  - **Headline:** Refined luxury editorial headline: *"Tell us what you're dressing for."* (Font: Playfair / Cormorant Garamond serif or clean grotesque display, 24px–28px, crisp tracking).
  - **Subtitle:** Clean muted secondary copy: *"Describe an occasion, destination, weather, style, or specific piece."* (Font: Inter / Outfit, 14px, `var(--text-muted)`).
- **Expansive Command Bar (Search Input):**
  - Full-width interactive input capsule (`height: 56px`, `border-radius: 999px`) with frosted glass background (`rgba(255, 255, 255, 0.04)`), ambient glow on focus, and inner sparkle icon.
  - **Animated Placeholder Engine:** Smooth cycling placeholder text that types and fades across realistic luxury prompts:
    - *"Something for a winter evening in Dhaka"*
    - *"Minimalist linen outfit for a weekend in Sylhet"*
    - *"Sharp monochrome look for an executive dinner"*
    - *"Lightweight breathable layers under BDT 15,000"*
  - **Right Action Cluster:**
    - Clear query trigger button (when text is present).
    - Refined gradient submit button with smooth arrow transition and subtle pulse on hover.
- **Curated Lifestyle Intent Pills:**
  - Distinct grouped category pills with lifestyle iconography and clear micro-labels:
    - 🍸 **Dinner & Evening** (`data-query="Dinner outfit for a cool evening in Dhaka"`)
    - ✈️ **Weekend Trip** (`data-query="Lightweight apparel for weekend trip"`)
    - 💼 **Modern Workwear** (`data-query="Minimalist tailored workwear"`)
    - 🎁 **Curated Gifts** (`data-query="Luxury gifts for him and her"`)
    - ☀️ **Summer Linen** (`data-query="Light breathable summer fabrics"`)
  - **Interactive States:** Smooth spring hover lift (`translateY(-2px)`), glow border transition, and active press scale.

---

## 2. Component Structure (HTML)

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

---

## 3. Styling & Interaction Engineering (CSS)

- **CSS Variables & Tokens:** Uses existing design tokens (`--bg-card`, `--text-primary`, `--text-muted`, `--border-color`, `--accent-rose`).
- **Responsive Breakpoints:**
  - Desktop (>992px): Centered header, max-width 780px input, horizontal chip flex-wrap.
  - Tablet (768px–992px): Adapted spacing, full-width input container.
  - Mobile (<768px): Stacked chips with horizontal scroll or auto-wrapping 2-column pills, touch target min 44px.
- **Micro-Animations:**
  - Input focus ring with subtle crimson/rose glow.
  - Chip hover transition (`transform: translateY(-2px)`, `box-shadow: 0 4px 12px rgba(0,0,0,0.3)`).
  - Submit button smooth scale (`1.05`) and background gradient shift.

---

## 4. Behavior & State Management (JavaScript)

1. **Typing / Placeholder Rotation Engine (`js/home.js`):**
   - Automatically cycles through placeholder prompts with a subtle fade/type effect when the user has not interacted with the input.
   - Pauses rotation immediately when the input is focused or has user-entered text.
2. **Search Submission:**
   - Navigates seamlessly to `discovery.html?q=${encodeURIComponent(query)}`.
3. **Chip Interaction:**
   - Populates input with query text, triggers visual active ripple state, and redirects immediately to the discovery engine.
4. **Lucide Icons Auto-Render:**
   - Triggers `lucide.createIcons()` on init so all newly rendered icons display cleanly.

---

## 5. Verification & Acceptance Criteria
- [x] Responsive layout tested across desktop (1440px), tablet (768px), and mobile (375px).
- [x] Touch targets are >= 44x44px for all interactive buttons.
- [x] Placeholder rotator pauses gracefully on focus.
- [x] Clicking any prompt chip executes search with full query context.
- [x] Zero layout shifts (CLS compliant).
