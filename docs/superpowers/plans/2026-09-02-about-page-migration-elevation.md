# Part-by-Part Next.js Migration Plan: About Us / Maison Manifesto (`/about`)

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan part-by-part. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Migrate and elevate the About Us page (`/about`) from the reference branch `feature/storefront-elevation` (`pages/about.html`) into Next.js 15 App Router (`app/about/page.tsx`), achieving 100% UI, UX, and interactive feature parity while replacing all AI jargon with clean, simple UK English words and ensuring uniform background colors.

**Reference Comparison:**
- Reference Static Page: `http://localhost:8080/pages/about.html` (captured in `about_page_reference_feature_storefront_elevation.png`)
- Target Next.js Route: `http://localhost:3000/about` (previewed in `about_page_nextjs_current.png`)

---

## User Review Required

> [!IMPORTANT]
> **Plain UK English Copy Adjustments:**
> All AI buzzwords have been replaced with clear, natural UK English:
> - *"Maison Manifesto"* ➔ *"Our Story & Philosophy"*
> - *"The architecture of quiet elegance"* ➔ *"Timeless style, crafted to endure."*
> - *"Tactile Provenance & Materiality"* ➔ *"Our Premium Materials & Origins"*
> - *"Spatial Craftsmanship Anatomy Hotspots"* ➔ *"Explore Our Craftsmanship"*
> - *"Chronology of Purpose"* ➔ *"Our Journey (1998–2026)"*
> - *"Infographic Provenance & Care Dials"* ➔ *"Our Standards & Promises"*
> - *"The Guardians of Craft"* ➔ *"Our Master Craftsmen"*
> - *"Neural Style Concierge"* ➔ *"Personal Style Advisor"*
> - *"Zero polyester... biologically pure"* ➔ *"Zero synthetic fabrics or plastic blends. 100% natural and renewable."*
>
> **Background Color & Aesthetic Consistency:**
> Unified luxury obsidian gradient (`background: radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)`) with `#012148` Obsidian Navy cards and `#f4f2ee` Warm Stone accents matching the homepage and catalog.

---

## Part-by-Part Implementation Breakdown

### Part 1: Visual Hero & Quick-Jump Navigation (`AboutHeroSplit.tsx`)
**Files:**
- Modify: `components/about/AboutHeroSplit.tsx`
- Test: `tests/test-about-hero.js`

**Interfaces:**
- Consumes: Atelier typography tokens, Lucide icons (`Sparkles`, `Feather`, `ArrowRight`).
- Produces: Split hero section with clean UK headline, introductory philosophy paragraph, 5 quick-jump anchor pills (`#materials`, `#hotspots`, `#disciplines`, `#timeline`, `#guardians`), and photographic workshop showcase card with Paris/Italy provenance badge.

- [ ] **Step 1: Write automated test `tests/test-about-hero.js`**
- [ ] **Step 2: Run test to verify failure:** `node tests/test-about-hero.js`
- [ ] **Step 3: Update `AboutHeroSplit.tsx` with clean UK copy, quick-jump pills, and workshop badge**
- [ ] **Step 4: Run test to verify passing:** `node tests/test-about-hero.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(about): elevate about hero split with clean UK English copy"`

---

### Part 2: Interactive Material Swatch Vault (`MaterialsSection.tsx`)
**Files:**
- Modify: `components/about/MaterialsSection.tsx`
- Test: `tests/test-about-materials.js`

**Interfaces:**
- Consumes: Material data list (Mongolian Raw Cashmere, Full-Grain Tuscan Leather, Aerospace Grade Titanium, Como Jacquard Silk).
- Produces: Interactive tabbed swatch selector, macro photography preview, weight/origin spec badges, and direct category catalog link.

- [ ] **Step 1: Write automated test `tests/test-about-materials.js`**
- [ ] **Step 2: Run test to verify failure:** `node tests/test-about-materials.js`
- [ ] **Step 3: Update `MaterialsSection.tsx` with smooth active tab transitions, clear UK copy, and spec pills**
- [ ] **Step 4: Run test to verify passing:** `node tests/test-about-materials.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(about): elevate material swatches with interactive transitions"`

---

### Part 3: Interactive Craftsmanship Hotspot Viewer (`HotspotViewer.tsx`)
**Files:**
- Create: `components/about/HotspotViewer.tsx`
- Modify: `app/about/page.tsx`
- Test: `tests/test-about-hotspots.js`

**Interfaces:**
- Consumes: 3 interactive hotspot pins:
  1. *Floating Canvas Chest Piece* (Natural horsehair canvas that molds to the wearer's silhouette over time)
  2. *Hand-Padded Lapels* (Hand-sewn roll stitches creating natural sculptural drape)
  3. *Reinforced French Seam Finishes* (Double-folded, enclosed edges for decades of wear)
- Produces: Pulsing GPU-animated pins (`#hotspots`) with glassmorphic hover/click popovers and macro detail highlights.

- [ ] **Step 1: Write automated test `tests/test-about-hotspots.js`**
- [ ] **Step 2: Run test to verify failure:** `node tests/test-about-hotspots.js`
- [ ] **Step 3: Implement `HotspotViewer.tsx` with animated pulse pins and floating detail popovers**
- [ ] **Step 4: Mount into `app/about/page.tsx`**
- [ ] **Step 5: Run test to verify passing:** `node tests/test-about-hotspots.js`
- [ ] **Step 6: Commit:** `git commit -m "feat(about): implement interactive craftsmanship hotspot viewer"`

---

### Part 4: Four Pillars of Design & Disciplines Grid (`DisciplinesGrid.tsx`)
**Files:**
- Modify: `components/about/DisciplinesGrid.tsx`
- Test: `tests/test-about-disciplines.js`

**Interfaces:**
- Consumes: 4 discipline definitions (Tailoring & Outerwear, Leather Goods, Precision Acoustics, Fine Timepieces).
- Produces: 4 interactive cards with image hover zoom, discipline numbering (`01`–`04`), workshop descriptions in UK English, and direct collection links.

- [ ] **Step 1: Write automated test `tests/test-about-disciplines.js`**
- [ ] **Step 2: Run test to verify failure:** `node tests/test-about-disciplines.js`
- [ ] **Step 3: Update `DisciplinesGrid.tsx` with clean UK copy and smooth card hover animations**
- [ ] **Step 4: Run test to verify passing:** `node tests/test-about-disciplines.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(about): elevate disciplines grid with collection links"`

---

### Part 5: Our Journey Interactive Timeline (`CraftTimeline.tsx`)
**Files:**
- Modify: `components/about/CraftTimeline.tsx`
- Test: `tests/test-about-timeline.js`

**Interfaces:**
- Consumes: 5 milestones (1998 Inception, 2008 Tuscan Workshop, 2017 Acoustic Lab, 2024 Digital Atelier, 2026 Sustainable Horizons).
- Produces: Horizontal pill selector with active year highlighting and smooth animated transition of milestone photograph and description.

- [ ] **Step 1: Write automated test `tests/test-about-timeline.js`**
- [ ] **Step 2: Run test to verify failure:** `node tests/test-about-timeline.js`
- [ ] **Step 3: Update `CraftTimeline.tsx` with clean UK narrative and smooth milestone switcher**
- [ ] **Step 4: Run test to verify passing:** `node tests/test-about-timeline.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(about): elevate our journey timeline with smooth milestone switcher"`

---

### Part 6: Standards & Promises Infographic Ledger (`ProvenanceLedger.tsx`)
**Files:**
- Create: `components/about/ProvenanceLedger.tsx`
- Modify: `app/about/page.tsx`
- Test: `tests/test-about-provenance.js`

**Interfaces:**
- Consumes: 4 core standards:
  1. *100% Traceable Materials* (Direct partnership with certified sustainable farms and tanneries)
  2. *0% Synthetic Plastics* (Pure organic wool, silk, linen, and vegetable-tanned leathers)
  3. *25-Year Stitching Guarantee* (Complimentary restoration and lifetime seam care)
  4. *100% Carbon-Neutral Custody* (Clean delivery and reusable presentation boxes)
- Produces: 4 glowing circular icon dials (`#provenance`) with gradient metric numerals.

- [ ] **Step 1: Write automated test `tests/test-about-provenance.js`**
- [ ] **Step 2: Run test to verify failure:** `node tests/test-about-provenance.js`
- [ ] **Step 3: Implement `ProvenanceLedger.tsx` and mount into `app/about/page.tsx`**
- [ ] **Step 4: Run test to verify passing:** `node tests/test-about-provenance.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(about): implement standards and promises infographic ledger"`

---

### Part 7: Master Craftsmen Profiles & Invitation Banner (`GuardiansGrid.tsx` & `page.tsx`)
**Files:**
- Modify: `components/about/GuardiansGrid.tsx`
- Modify: `app/about/page.tsx`
- Test: `tests/test-about-guardians.js`

**Interfaces:**
- Consumes: Artisan profiles (Gianluca M., Éléonore de S., Dr Henrik L.).
- Produces: 3 craftsman portrait cards with role and workshop location, followed by the collection invitation banner with UK delivery details and primary CTAs.

- [ ] **Step 1: Write automated test `tests/test-about-guardians.js`**
- [ ] **Step 2: Run test to verify failure:** `node tests/test-about-guardians.js`
- [ ] **Step 3: Update `GuardiansGrid.tsx` and `app/about/page.tsx` with clean UK copy and invitation banner**
- [ ] **Step 4: Run test to verify passing:** `node tests/test-about-guardians.js`
- [ ] **Step 5: Commit:** `git commit -m "feat(about): finalize master craftsmen profiles and collection banner"`

---

### Part 8: End-to-End Build & 7-Dimension SQA Verification
**Files:**
- Create: `tests/test-about-page-complete.js`
- Test: Build & Visuals

- [ ] **Step 1: Run complete automated test suite**
  Run: `node tests/test-about-page-complete.js`
  Expected: PASS on all 7 sections, all UK English copy assertions, and anchor links.
- [ ] **Step 2: Execute Next.js build verification**
  Run: `npm run build`
  Expected: Clean build with 0 TypeScript errors.
- [ ] **Step 3: Capture full-page visual proof for Desktop (`1440x900`) and Mobile (`375x812`)**
  Save to: `about_page_nextjs_desktop_verified.png` and `about_page_nextjs_mobile_verified.png`.
- [ ] **Step 4: Compare side-by-side with `about_page_reference_feature_storefront_elevation.png`**

---

## Verification Plan

### Automated Tests
* `node tests/test-about-hero.js`
* `node tests/test-about-materials.js`
* `node tests/test-about-hotspots.js`
* `node tests/test-about-disciplines.js`
* `node tests/test-about-timeline.js`
* `node tests/test-about-provenance.js`
* `node tests/test-about-guardians.js`
* `node tests/test-about-page-complete.js`
* `npm run build`

### Manual & SQA Verification
* Live browser inspection at `http://localhost:3000/about` on Desktop (`1440x900`) and Mobile (`375x812`).
* Test all quick-jump anchor links (`#materials`, `#hotspots`, `#disciplines`, `#timeline`, `#guardians`).
* Click and hover every interactive hotspot pin and material swatch.
* Assert 0 console errors and clean contrast ratios ($\ge 4.5:1$).
