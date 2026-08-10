# nexCommerce — Technical Design Specification
**Date:** 2026-08-10  
**Project:** nexCommerce Luxury Lifestyle E-Commerce Redesign  
**Status:** Approved Specification  

---

## 🎯 Central Axiom & Philosophy

> **"AI enhances the shopping experience; it must never become the shopping experience."**  
> **"Premium enough to feel special. Warm enough to feel human. Simple enough to feel trustworthy. Intelligent enough to feel modern."**

---

## 1. Visual & Brand Architecture

### 1.1 Color Palette & Theme Rhythm
* **Obsidian Base (`--bg-base`):** `#0b0b0e` — Deep charcoal obsidian surface for exclusive, high-end visual tone.
* **Elevated Surfaces (`--bg-surface` / `--bg-card`):** `#141418` / `#1b1b22` with 1px subtle glass borders (`rgba(255, 255, 255, 0.08)`).
* **Warm Stone Storytelling Breaks (`--bg-warm-stone`):** `#f4f2ee` with charcoal text (`#121212`) — integrated into discovery flows to break dark-mode fatigue and ground the experience in human warmth.
* **Primary Interactive CTA (`--cta-primary`):** Warm Ivory (`#f4f4f6`) with dark obsidian text (`#0b0b0e`) — visual priority for all main commerce actions (`Add to Bag`, `Proceed to Checkout`).
* **Focal Accents (`--accent-gold`):** Champagne Sand (`#c8b295`) / Soft Gold (`#d8c3a5`) — reserved exclusively for selected states, member badges, and key focal callouts (NEVER for default CTAs).

### 1.2 Typography & Scale
* **Editorial Headlines:** `Cormorant Garamond` serif (0 to -0.025em letter-spacing). Used for emotional storytelling and high-impact hero moments.
* **UI Controls & Commerce Chrome:** `Inter` clean grotesque (0.02em to 0.05em letter-spacing). Used for buttons, specs, prices, navigation, and form fields.
* **Visual Whitespace:** Minimum 100px–120px section padding on desktop; 60px on mobile.

### 1.3 Human Lifestyle Imagery Rule
* **Mandatory Standard:** Every hero banner and editorial block features human models in authentic lifestyle contexts (e.g. runner in morning light, artist with acoustics, model in merino knitwear).
* **Product Photography:** Clean studio shots on neutral backdrops with natural shadows. No floating AI neon renders.

---

## 2. System Architecture & Layering

The application is strictly decoupled into 4 architectural domains:

```text
                                  nexCommerce
                                       │
        ┌──────────────────┬───────────┴───────────┬──────────────────┐
        ↓                  ↓                       ↓                  ↓
  BRAND EXPERIENCE     DISCOVERY                COMMERCE         INTELLIGENCE
        │                  │                       │                  │
 ── EditorialHero    ── CategoryNav          ── ProductGallery  ── SmartSearch
 ── EditorialBlock   ── ProductGrid          ── VariantSelect   ── Personalization
 ── LifestyleStory   ── ProductCard          ── AddToBag        ── AIRecommendation
 ── ProductStory     ── FilterBar            ── CartDrawer      ── FitAdvisor
                     ── ProductQuickView     ── Checkout
                                             ── TrustSignal
```

---

## 3. Page Architecture & User Journey

### 3.1 Homepage Journey: Emotion → Discovery → Story → Personalization → Navigation
1. **Header (Minimal Glass Chrome):**
   * Desktop: `[Shop] [Collections] [Stories]` | `nexCommerce` (Center Anchor) | `Search` `Account` `Bag (N)`
   * Mobile: `☰` | `nexCommerce` | `Bag (N)`
   * Scroll behavior: Becomes visually quieter on scroll down with a subtle backdrop blur.
2. **Hero (Dark Obsidian `#0b0b0e`):** Full-bleed human lifestyle visual, Garamond headline (*"Move Without Limits."*), Warm Ivory primary CTA (*"Explore Collection"*).
3. **Curated Product Grid (Dark Obsidian `#0b0b0e`):** 4-column desktop responsive grid. Single status badge max per card.
4. **Storytelling Break (Warm Stone `#f4f2ee`):** Light stone section (*"Crafted with Precision. Worn for Life."*) featuring dual lifestyle photo storytelling.
5. **Intelligent Assistance Bar (`--bg-surface`):** *"Curated for you"* ambient filter tags (*"Morning Commute"*, *"Minimal Layers"*, *"Acoustic Focus"*).
6. **Footer (Dark Obsidian `#0b0b0e`):** Sitemap, trust badges, currency selector, newsletter.

### 3.2 Product Listing Page (PLP)
* **Header Bar:** Category Title → Product Count → Progressive `Filters` Button → `Sort` Selector.
* **Progressive Filter Panel:** Clicking `Filters` opens a non-disruptive filter panel (Size, Color, Material, Price Range).
* **Adaptive Grid Density:** Desktop discovery (4 cols), Editorial/Feature story (2 cols), Tablet/Mobile (2 cols).

### 3.3 Product Detail Page (PDP)
* **Visual Hierarchy (60/40 Split):**
  * **Left (60%):** Vertical gallery of 4–5 lifestyle & studio angles with zoom.
  * **Right (40% Sticky):** 
    1. Brand Name
    2. Garamond Title + Short Descriptor
    3. Price (`৳ 4,990`)
    4. Star Rating + Reviews count
    5. Color Swatches (`○ ○ ○ ○`)
    6. Size Swatches (`S M L XL`) + *"Find my size →"* link
    7. **Warm Ivory `[ Add to Bag ]` CTA (Always Visually Dominant)**
    8. `TrustSignal` summary (Free shipping, 30-day returns)
    9. Accordion (Materials & Care, Shipping & Returns, Reviews)

---

## 4. Interactive Components & States

### 4.1 `SlideOverDrawer` (Cart / Shopping Bag)
* **Guest → Account → Server Synchronization:**
  ```text
  Guest (localStorage) ──(on login)──> Merge with Account Cart ──> Server Sync API
  ```
* **Empty State:** Warm empty state graphic (*"Your bag is waiting. Discover something you'll love."*) with `[ Continue Shopping ]` CTA.
* **Active State:** Progress bar for Free Express Shipping, item list with stepper (`− 1 +`), Subtotal, `TrustSignal` badges, and prominent Warm Ivory `Proceed to Checkout` button. Quantity steppers are temporarily disabled during API network updates.

### 4.2 `SmartSearch` (Intelligent Overlay with Fallback)
* **Trigger:** Click `Search` or keyboard shortcut `Ctrl/Cmd + K`.
* **Resilient Query Pipeline:**
  ```text
  User Input ──> Intent Matching ──> AI Available? 
                                        ├─ Yes ──> Semantic Results ──┐
                                        └─ No  ──> Standard Search ──┴─> Render Overlay Results
  ```

### 4.3 `AddToBag` Async State Control
* **Async Flow:** Clicking `Add to Bag` sets state to `Adding...` and disables input. Only transitions to `✓ Added to Bag` and opens the Cart Drawer AFTER the server API confirms success. If the request fails, displays an inline error and keeps the user on the PDP.

### 4.4 `FitAdvisor` (Low-Friction Assistance)
* **Initial Question:** *"What's your usual fit?"* (`Slim`, `Regular`, `Relaxed`).
* **Optional Follow-up:** Height / weight sliders + direct link to *"View standard size guide"*.

### 4.5 `TrustSignal` Component
* Reusable badge displaying: `✓ 30-Day Complimentary Returns`, `✓ Encrypted SSL Checkout`, `✓ Guaranteed Authentic`. Prevents dark luxury UI from creating psychological distance.

### 4.6 `ProductQuickView`
* Optional modal on PLP allowing quick inspection of images, variants, and `Add to Bag` without leaving the listing page.

---

## 5. Mobile, Performance & Error Taxonomy

### 5.1 Mobile PDP Sticky Purchase Bar
* Pinned bottom bar on mobile (`< 768px`) containing `[ ৳ 4,990 ]` and `[ Add to Bag ]`. Page layout reserves bottom padding equal to the bar height to avoid covering footer content.

### 5.2 Touch Target Standard
* All primary mobile touch targets (`Add to Bag`, `Checkout`, `Close buttons`, `Quantity controls`, `Nav links`) are strictly **48×48px minimum**.

### 5.3 Skeleton Loaders & Layout Stability
* Image containers pre-reserve explicit aspect ratios before media load, eliminating layout shifts (CLS = 0).

### 5.4 Unified Error & Notification Taxonomy
* **Toast Notifications (Temporary):** Success confirmations (*"Item added to wishlist"*).
* **Inline Errors (Persistent until fixed):** Invalid size, out-of-stock selection, address validation errors.
* **Section-Level Errors:** API down, checkout unavailable, network lost (*"You're offline — Retrying..."* with connection restoration hook).

---

## 6. Accessibility (WCAG 2.1 AA Compliance)

* **Color Contrast:** Minimum 4.5:1 ratio for body text against dark `#0b0b0e` and warm `#f4f2ee` backgrounds.
* **Keyboard & Focus:** All drawers, overlays, and modals feature focus trapping, visible focus rings, and close on `ESC` press.
* **Screen Reader Support:** Full ARIA labels for swatches, quantity steppers, cart triggers, and semantic HTML structure (`h1` per page).
* **Motion Sensitivity:** Respects `@media (prefers-reduced-motion: reduce)` by disabling non-essential transitions.

---

## 7. Spec Self-Review Checklist

- [x] **Placeholder Scan:** Zero `TODO`, `TBD`, or vague implementation notes found.
- [x] **Internal Consistency:** Colors, typography, component names, and flow definitions match perfectly across all sections.
- [x] **Scope Check:** Well-bounded e-commerce scope separated into Brand, Discovery, Commerce, and Intelligence layers.
- [x] **Ambiguity Check:** All async states, fallback pipelines, and error taxonomies explicitly defined.
