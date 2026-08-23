# Delivery Location & Dark Store Hub UI/UX Redesign Specification

**Date:** 2026-08-21  
**Author:** Founding Full-Stack Engineer / UI-UX Lead  
**Status:** Approved by User (Option 1: Full Luxury Redesign)

---

## 1. Overview & Business Goal

The "Select Delivery Location" component in nexCommerce connects customers to our hyperlocal micro-fulfillment network (Dark Store Ateliers). While the underlying engine (`js/delivery-gate-engine.js`) handles postal routing, stock gating, and cutoff countdowns, the previous UI suffered from:
- Cramped visual wrapping in the header pill (e.g. text breaking into 2 awkward lines vertically).
- Ambiguous countdown labels without context (e.g., `0H 34M` without an explanation of what the timer signifies).
- A static modal without postal search, autocomplete, or GPS auto-detection.
- Lack of a dedicated mobile-optimized bottom sheet.

This specification elevates the Delivery Location feature into a world-class luxury e-commerce interaction with zero wrapping, an explanatory tooltip, real-time postal search & geolocation auto-detect, dynamic hub cards, and mobile bottom sheet adaptation.

---

## 2. Architecture & Component Design

### 2.1 Header Delivery Hub Pill (`.delivery-hub-pill`)
* **Layout Structure**:
  ```html
  <div class="delivery-hub-pill-wrapper">
    <button id="headerDeliveryHubPill" class="delivery-hub-pill" aria-label="Select delivery location and dark store hub" aria-haspopup="dialog">
      <i data-lucide="map-pin" class="delivery-pin-icon"></i>
      <span class="delivery-location-label">Berlin · 10115</span>
      <span class="delivery-express-badge">⚡ 34m left</span>
    </button>
    <div class="delivery-hub-tooltip" role="tooltip">
      <div class="tooltip-title">Same-Day Express Dispatch</div>
      <div class="tooltip-desc">Order within <strong class="tooltip-time-left">34 mins</strong> for guaranteed <strong class="tooltip-eta">45–60 min courier delivery</strong> in Berlin via <span class="tooltip-courier">DHL Express On-Demand</span>.</div>
      <div class="tooltip-footer">Click to change location or dark store atelier</div>
    </div>
  </div>
  ```
* **CSS Typography & Constraints**:
  * Strict `white-space: nowrap` and `display: inline-flex; align-items: center; gap: 8px;`.
  * Touch target height: $\ge 44\text{px}$.
  * Background: Luxury frosted obsidian (`rgba(255, 255, 255, 0.05)` with `border: 1px solid rgba(255, 255, 255, 0.12)`).
  * Hover state: Glowing cyan border (`rgba(61, 224, 255, 0.4)` and box shadow `0 0 16px rgba(61, 224, 255, 0.15)`).
  * Tooltip: Smooth GPU-accelerated fade and slide up with `backdrop-filter: blur(16px)` and pointer event isolation.

### 2.2 Interactive Location Modal & Mobile Bottom Sheet (`#deliveryHubModalOverlay`)
* **Modal Structure**:
  1. **Header Bar**:
     * Title: *"Select Delivery Location"* with a cyan map-pin icon.
     * Close button: Accessible $\ge 44\text{px}$ close icon.
     * Subtitle: *"Choose your nearest Dark Store Atelier for instant 45–60 min courier delivery and local boutique stock availability."*
  2. **Search & GPS Action Row**:
     * **Live Postal / City Search Input**:
       ```html
       <div class="hub-search-box">
         <i data-lucide="search"></i>
         <input type="text" id="hubPostalSearchInput" placeholder="Enter postal code or city (e.g. 10115, Paris, W1K)..." autocomplete="off" />
         <button id="hubClearSearchBtn" class="hub-clear-search-btn" style="display:none;">&times;</button>
       </div>
       ```
     * **"Use My Location" GPS Button**:
       * Prompts HTML5 Geolocation API (`navigator.geolocation.getCurrentPosition`).
       * Reverse-resolves location or selects the nearest dark store hub automatically.
  3. **Hub Selection Grid / List**:
     * Dynamic filtering based on search input.
     * Displays all active hubs:
       * **Berlin Mitte (10115)** — DHL Express On-Demand · 45–60 mins · 6:00 PM cutoff
       * **Paris Le Marais (75003)** — Chronopost Atelier · 60–90 mins · 7:00 PM cutoff
       * **London Mayfair (W1K)** — Quiqup Concierge · 45–60 mins · 6:00 PM cutoff
       * **Amsterdam Centrum (1016)** — PostNL Express · 45–60 mins · 5:00 PM cutoff
       * **Dhaka Gulshan (1212)** — Pathao Dark Store Express · 30–45 mins · 8:00 PM cutoff
       * **European Central Atelier** — Standard Regional Delivery (2–3 business days) fallback
     * Selected state: Cyan border highlight, subtle radiant glow, checkmark icon.
  4. **Responsive Mobile View**:
     * On desktop: Centered glass modal (`max-width: 520px`).
     * On mobile ($\le 768\text{px}$): Bottom sheet sliding up from bottom edge (`max-width: 100%`, border-radius `20px 20px 0 0`), drag handle bar, easily thumb-accessible.

### 2.3 State Sync & Toast Notifications
* `localStorage.setItem('nex_delivery_hub', hub.id)` ensures persistent state across all pages (`index.html`, `pages/discovery.html`, `pages/pdp.html`, `pages/cart.html`).
* Window event dispatch: `window.dispatchEvent(new CustomEvent('nex:hub-changed', { detail: { hub } }))`.
* Toast notification: When changed, fires a luxury toast: `📍 Delivery location updated to [City] ([Postcode]). Local stock updated.`.

---

## 3. Engineering & Testing Plan

1. **Deterministic Unit Tests (`tests/test-delivery-gate-engine.js`)**:
   * Test postal search matching logic (e.g. `10115` -> Berlin, `75003` -> Paris, `W1K` -> London, unknown -> fallback).
   * Test countdown string formatting with human-readable tags (`34m left`, `1h 20m left`, `Tomorrow morning`).
   * Test event dispatching and local storage persistence.
2. **Browser Visual Verification (Desktop & Mobile)**:
   * Verify single-line layout and zero text wrapping in header pill across 1440px desktop.
   * Verify tooltip display on hover.
   * Verify modal open, search filter interaction, hub card selection, and toast confirmation.
   * Verify mobile bottom sheet layout at 375px viewport with touch target compliance ($\ge 44\text{px}$).
