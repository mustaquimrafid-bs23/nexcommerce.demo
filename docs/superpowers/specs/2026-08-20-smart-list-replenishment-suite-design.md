# Design Specification: Smart List Comprehensive Luxury Replenishment Suite

**Date**: 2026-08-20  
**Target File**: `pages/smart-list.html`  
**Aesthetic Standard**: Modernist / Swiss Luxury — Visual-First, Text-Minimalist, High-Res Editorial  
**Architecture**: Approach A (Unified Modular Architecture with Centralized State Store)  
**Status**: Revised per UI/UX Feedback (Less Text, Maximum Visualization, Ultra-Modern Luxury)

---

## 1. Executive Summary & Design Direction

Following executive UI/UX feedback, `pages/smart-list.html` is being refined to be **Visual-First, Text-Restrained, and Ultra-Modern Luxury** (benchmarking SSENSE, NET-A-PORTER, and Loewe):
- **Visual Dominance (70–80% visual ratio)**: Large 3:4 aspect-ratio imagery, dynamic high-res gallery drawer, metallic finish swatches, and clean geometric size boxes.
- **Aggressive Text Reduction**: Eliminate descriptive clutter, long cadence paragraphs, and wordy AI labels from cards. Let the product photography and tactile micro-visuals speak.
- **Ultra-Modern Polish**: Deep obsidian glassmorphism, GPU-accelerated spring physics (`120fps`), hairline borders, and generous breathing room.

---

## 2. Visual-First Component Design

### 2.1 Visual-First Product Cards (80% Visual Ratio)
- **Zero Paragraph Clutter**: Cards strictly contain 3 clean lines of text:
  1. **Brand Eyebrow**: `NEXCOMMERCE ATELIER` (9.5px, 0.12em uppercase letter-spacing).
  2. **Product Name**: Single-line title in `Inter` / `Manrope` (clean, un-truncated).
  3. **Price**: Bold, confident typography with live variant adjustments.
- **Tactile Visual Selectors**:
  - **Finish Swatches**: 16×16px circular metallic discs with authentic surface luster (18k Yellow Gold, Platinum White, Matte Obsidian, Slate).
  - **Size Selector**: Crisp 24×24px architectural square blocks (`[S]`, `[M]`, `[L]`, `[XL]`).
  - **Visual Inventory Dot**: Minimal 6px status beacon (Cyan: In Stock, Amber: 2 Left, Diagonal Hairline: Sold Out) instead of verbose text.
- **Ambient Selection Ring**:
  - Floating 24×24px glass ring at top-left. Turns solid cyan with crisp checkmark on select; illuminates card with a tailored ambient halo.

---

### 2.2 Modernist Hero & Toolbar (Quiet Editorial Luxury)
- **Minimalist Masthead**:
  - Headline: Confident 3-word title (*"The Replenishment Edit"* / *"Curated For You"*).
  - Subtitle: Exactly one quiet sentence.
- **Streamlined Toolbar**:
  - Clear visual metrics: `[ ◯ Select All ]` toggle • `12 Items` • `$14,850 Total Value`.
  - Category filter pills: Architectural 2px pills with active glowing border indicators.

---

### 2.3 Floating Visual Batch Dock (Obsidian Island)
- **Ergonomics & Polish**:
  - Floating island anchored at `bottom: 28px` (desktop) / docked at `bottom: 0` (mobile).
  - Deep obsidian glass (`rgba(8, 14, 30, 0.94)`), `backdrop-filter: blur(24px)`, hairline border (`rgba(255, 255, 255, 0.14)`).
- **Streamlined Contents**:
  - `3 Selected • $3,420` (Bold Manrope typography).
  - `[ Add Selected to Bag ]` (Crisp solid white button with cart injection micro-animation).
  - `[ ♡ ]` (Wishlist icon button).
  - `[ ✕ ]` (Clear selection).

---

### 2.4 Visual-Dominant Quick Look Slide-Over Drawer
- **Visual Dominance (70% Media Area)**:
  - Large 4:3 high-res main viewer with fluid hover-zoom and 3-asset thumbnail filmstrip (Studio, Angle Detail, On-Model Lifestyle).
- **Text-Restrained Luxury Specs**:
  - Large headline & dynamic price.
  - Visual swatch & size matrix.
  - 3 concise icon specs: `[ Origin: Milan ]` • `[ Material: 18k Solid Gold ]` • `[ 45-Day Cadence ]`.
  - Sticky bottom action: `[ Add to Bag — $X,XXX ]` + direct link to standalone page.

---

## 3. Responsive Layout Grid

| Viewport | Product Grid | Quick Look Drawer | Floating Batch Dock |
| :--- | :--- | :--- | :--- |
| **Desktop (≥1280px)** | 4 Columns (3:4 ratio) | 520px Right Slide-over | Centered Floating Island (`bottom: 28px`) |
| **Tablet (768px–1279px)**| 2–3 Columns | 440px Right Slide-over | Floating Bar (`max-width: 90%`) |
| **Mobile (≤767px)** | 1–2 Columns | Full-width Bottom-Sheet | Docked Bottom Bar (`bottom: 0; safe-area`) |

---

## 4. Accessibility & Quality Standards (WCAG 2.1 AA)

- Full keyboard navigation for selection rings (`Space`/`Enter`) and size boxes.
- Focus trap inside Quick Look Drawer with `Escape` dismiss.
- High contrast (≥ 4.5:1), visible focus rings, and ARIA live regions for cart and batch updates.

---

## 5. Verification & Test Plan

1. **Visual & Aesthetic Audit**: Verify card visual ratio > 75%, text is clean, no paragraph clutter, swatches look metallic and tactile.
2. **Interactive Selection & Batch Dock**: Verify selecting items smoothly animates the Floating Batch Dock with live price calculation and instant cart addition.
3. **Variant Switching**: Verify clicking size/finish swatches updates card pricing, image, and stock without page jump.
4. **Quick Look Drawer**: Verify smooth 120fps opening, image gallery switching, and variant sync.
5. **Multi-Device Responsive QA**: Audit at 1440px, 768px, and 375px viewports.
