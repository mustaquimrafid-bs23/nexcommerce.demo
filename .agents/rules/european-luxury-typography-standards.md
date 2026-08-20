# European Luxury E-Commerce Typography Standards

This rule defines the **mandatory typography standard** for the nexCommerce storefront and all related applications. The target audience is primarily **European customers**, and the overall product direction is **premium/luxury e-commerce**.

The design goal is: **European editorial luxury + modern digital usability.**
The typography must feel **sophisticated, editorial, modern, trustworthy, and timeless** — never like a generic AI startup, gaming website, or futuristic dashboard.

---

## 1. Overall Typography Direction & Brand Persona

The typography must communicate:
* **European Luxury**: Restraint, confidence, elegance, and balance.
* **Editorial Quality**: Clear hierarchy inspired by high-end European publications and luxury houses (NET-A-PORTER, SSENSE, Loewe, Brunello Cucinelli, Mr Porter, Farfetch).
* **Modern but Timeless Design**: Clean sans-serif and grotesk structures paired with subtle editorial serif accents.
* **Uncompromising Readability**: Flawless legibility across desktop, tablet, and mobile.
* **Strong Attention to Whitespace**: Generous breathing room (minimum 80px section spacing) rather than dense text blocks.
* **Quiet Confidence**: Hierarchy achieved through size, spacing, contrast, and layout — NOT through excessive bold weights or decorative gimmicks.

---

## 2. Standard 3-Tier Font System

| Role | Primary Font Choice | Approved Fallbacks / Alternatives | Usage Scope |
|---|---|---|---|
| **Primary Display & Headings** | **Neue Haas Grotesk** | **Helvetica Now**, **Manrope**, **Plus Jakarta Sans** | Hero headlines, section titles, major promotional messaging, product/category headings |
| **Primary UI & Body** | **Inter** | System Sans (`system-ui`, `-apple-system`, `BlinkMacSystemFont`, `Segoe UI`, `Roboto`) | Navigation, buttons, product info, prices, filters, forms, checkout, account pages, tables, micro-copy |
| **Editorial Accent** | **Instrument Serif** | **Playfair Display**, **Cormorant Garamond** | *Strictly limited*: Hero accent words, luxury fashion/editorial campaigns, curated marketing headlines (*never used everywhere*) |

> [!IMPORTANT]
> If licensing makes Neue Haas Grotesk impractical in a web environment, use **Manrope** or **Helvetica Now** with comprehensive Latin Extended character set support.

---

## 3. Strict Anti-AI Font Guardrail

Never use stereotypical "AI", "gaming", or "sci-fi" fonts, including:
* **Forbidden Fonts**: `Orbitron`, `Audiowide`, `Exo 2`, `Rajdhani`, `Michroma`, `Syncopate`, overly futuristic geometric fonts, or gaming-style fonts.
* **No Excessive Monospace**: Do NOT apply monospace typography (`Courier`, `JetBrains Mono`, `Space Mono`) to normal headers, section labels, or body text.
* **AI Expression Principle**: The fact that nexCommerce has AI features does NOT mean the visual identity needs to look futuristic. AI should be communicated through seamless UX, intelligent workflows, and responsive interactions — NEVER through cliché sci-fi typography, neon gradients, or cyan badges.

---

## 4. Typography Scale & Fluid Metrics

Always use systematic typography tokens rather than choosing arbitrary ad-hoc font sizes:

| Token / Level | Desktop (`≥1024px`) | Tablet (`768px–1023px`) | Mobile (`≤767px`) | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| **Display / Hero** | `64px–88px` | `42px–56px` | `34px–44px` | `1.05–1.15` | `-0.02em` to `-0.01em` |
| **H1 (Page Title)** | `48px–64px` | `36px–44px` | `32px–40px` | `1.15–1.2` | `-0.015em` to `-0.01em` |
| **H2 (Section Title)**| `36px–48px` | `28px–36px` | `26px–32px` | `1.2–1.25` | `-0.01em` |
| **H3 (Card / Subtitle)**| `24px–32px` | `22px–28px` | `20px–24px` | `1.25–1.3` | `-0.005em` |
| **H4 / Subheading** | `18px–22px` | `18px–20px` | `16px–18px` | `1.35–1.4` | `0` |
| **Body Large** | `18px–20px` | `17px–18px` | `16px–17px` | `1.5–1.6` | `0` |
| **Body Standard** | `16px–18px` | `15px–16px` | `15px–16px` | `1.5–1.65` | `0` to `+0.01em` |
| **Small / UI Text** | `13px–15px` | `13px–14px` | `13px–14px` | `1.4–1.5` | `0` to `+0.01em` |
| **Micro / Metadata** | `11px–13px` | `11px–12px` | `11px–12px` | `1.3–1.4` | `+0.02em` to `+0.04em` |
| **Uppercase Label** | `11px–13px` | `11px–12px` | `11px–12px` | `1.2–1.3` | `+0.04em` to `+0.08em` |

---

## 5. Restrained Font Weight Scale

Luxury design relies on typographic restraint. Do not make everything Semibold or Bold.

* **400 (Regular)**: Default body text, long-form copy, descriptions, terms, and policies.
* **500 (Medium)**: Form inputs, table cells, secondary UI labels, subtitle lines, interactive list items.
* **600 (Semibold)**: Primary CTAs, active tab headers, product titles, section headers, navigation anchors.
* **700 (Bold)**: *Used sparingly* — only when major visual contrast or primary numerical pricing emphasis is essential.

---

## 6. Letter Spacing (Tracking) Precision

* **Display Headings (`64px+`)**: Slightly tight tracking (`-0.02em` to `-0.01em`) to maintain editorial cohesion.
* **Uppercase Labels & Tags**: Small positive tracking (`+0.04em` to `+0.08em`) for crisp legibility at small sizes.
* **Standard Body Text**: Natural font metrics (`0` to `+0.01em`). Never apply wide tracking to paragraphs.
* **Strict Prohibition**: Never apply wide tracking (`0.1em`+) across regular body copy to artificially simulate "luxury".

---

## 7. Selective Uppercase Usage

* **Permitted Uppercase**:
  - Primary navigation links (e.g., `NEW ARRIVALS`, `COLLECTIONS`, `EDITORIAL`)
  - Small category eyebrow labels (e.g., `AUTUMN / WINTER 2026`)
  - Product metadata chips (e.g., `CASHMERE BLEND`, `LIMITED DROP`)
  - Concise primary action buttons (e.g., `ADD TO CART`, `CHECKOUT`)
* **Strictly Prohibited Uppercase**:
  - Multi-line paragraphs or descriptions
  - Checkout instructions or address forms
  - Critical error or success notification messages
  - Customer review quotes or long product specifications

---

## 8. European Language Support & Glyph Verification

The storefront primarily serves European customers. The font files, subsets, and CSS `@font-face` definitions **must support the full Latin Extended glyph set** without fallback font jumping or missing glyph boxes.

### Mandatory Glyph Checklist
* **French / Italian / Spanish / Portuguese**: `É`, `È`, `Ê`, `Ë`, `À`, `Â`, `Ç`, `Ñ`, `Ó`, `Ô`, `Õ`, `Ú`, `Û`, `Í`, `Î`, `œ`, `æ`
* **German**: `Ä`, `Ö`, `Ü`, `ä`, `ö`, `ü`, `ß`
* **Scandinavian (Swedish, Danish, Norwegian, Finnish)**: `Å`, `Ø`, `Æ`, `å`, `ø`, `æ`, `ä`, `ö`
* **Central European (Polish, Czech, Slovak, Hungarian, Romanian)**: `Š`, `Ž`, `Č`, `Ć`, `Ł`, `Ń`, `Ő`, `Ű`, `Ă`, `Ş`, `Ţ`, `š`, `ž`, `č`, `ł`
* **Dutch**: `Ĳ`, `ĳ`, `ë`, `ï`

> [!CAUTION]
> Always verify that Google Fonts links include `&subset=latin,latin-ext` or load full Latin character subsets.

---

## 9. Accessibility & Readability (WCAG 2.1 AA)

* **Contrast Ratios**: Minimum 4.5:1 for body text (`--text-primary` on background); 3:1 for large display titles (`≥24px`).
* **Minimum Font Size**: Never render readable UI copy smaller than `12px` (micro metadata allowed at `11px` only for secondary badges).
* **Controlled Measure (Line Length)**: Keep long text paragraphs constrained to `60–75ch` (max-width: `680px`) to prevent eye fatigue.
* **High Contrast for Critical Information**: Product prices, stock alerts, error states, and payment details must maintain clear, unambiguous visual contrast.

---

## 10. Avoid the "AI-Generated Website" Cliché

Avoid the common visual patterns that make modern websites feel AI-generated or template-generated:
* ❌ Futuristic font stacks (`Orbitron`, `Audiowide`, `Rajdhani`)
* ❌ Neon purple-to-cyan gradient floods on body text
* ❌ Excessive glassmorphism applied to every container
* ❌ Oversized generic headings with empty buzzwords ("Unlock your style", "Powered by AI", "Revolutionary experience")
* ❌ Excessive badges and chips stacked on single cards
* ❌ Cluttered floating elements that distract from product photography
* ✅ Clean, editorial typography with intentional art direction, natural daylight photography, and calm luxury copy.

---

## 11. Luxury with Uncompromising Usability

Luxury does NOT mean poor usability:
* **No Tiny Unreadable Text**: Do not shrink body copy below `15px` to simulate minimalism.
* **No Ultra-Thin Low-Contrast Fonts**: Never use font-weight 100/200 or faint grey text on white backgrounds.
* **No Hidden CTAs**: Add to Cart, Wishlist, Checkout, and navigation must be instantly recognizable and accessible.

---

## 12. Typography + Editorial Layout

Typography must work in harmony with the layout:
* **Generous Whitespace**: Minimum `80px–120px` padding between major sections on desktop.
* **Strong Alignment**: Strict adherence to a 12-column grid on desktop and 4-column grid on mobile.
* **Product Imagery Priority**: Product photography takes 65%–75% of visual prominence; typography supports without overpowering.

---

## 13. Product Page (PDP) Typographic Hierarchy

On Product Detail Pages, information hierarchy must strictly follow:
1. **Brand / House Name**: Small uppercase label (`12px–13px`, tracking `+0.06em`, font-weight `500`, muted secondary tone).
2. **Product Title**: Display / H1 in clean grotesk (`28px–38px`, font-weight `600`, line-height `1.2`).
3. **Price & VAT Note**: High-contrast, bold numeral (`22px–28px`, font-weight `600`) + clear VAT note (`12px`, muted).
4. **Editorial Short Description**: Lifestyle-first summary (`16px`, line-height `1.6`, 1–2 sentences).
5. **Product Options (Size/Color)**: Clear labels (`13px`, font-weight `500`) with legible option pills.
6. **Primary CTA (Add to Cart)**: Prominent button (`15px`, font-weight `600`, touch target `48px+`).
7. **Delivery & Availability**: Clear bullet points (`13px–14px`, high readability).
8. **Detailed Specifications & Craftsmanship**: Accordion / tab structure (`14px–15px`).

---

## 14. Unified AI Feature Typography

AI-powered features (Smart Fit recommendations, AI Vector Match, Personalized Edits, Concierge Chat) must **share the identical luxury typography system**:
* Never create a separate "tech-looking" font for AI widgets.
* AI recommendation chips must use standard UI typography tokens (`Inter`, `12px–13px`, font-weight `500`).
* AI conversational messages must use standard body typography (`Inter`, `15px–16px`, line-height `1.55`).

---

## 15. CSS Design Tokens Architecture

Every stylesheet across the codebase must reference the standardized typography CSS custom properties:

```css
:root {
  /* Font Families */
  --font-display: 'Neue Haas Grotesk', 'Helvetica Now', 'Manrope', system-ui, -apple-system, sans-serif;
  --font-body:    'Inter', system-ui, -apple-system, sans-serif;
  --font-accent:  'Instrument Serif', Georgia, serif;
  --font-mono:    ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Font Sizes */
  --text-hero:    clamp(2.125rem, 5vw + 1rem, 5.5rem);   /* 34px - 88px */
  --text-h1:      clamp(2rem, 3.5vw + 0.5rem, 4rem);      /* 32px - 64px */
  --text-h2:      clamp(1.625rem, 2.5vw + 0.5rem, 3rem);  /* 26px - 48px */
  --text-h3:      clamp(1.25rem, 1.5vw + 0.5rem, 2rem);   /* 20px - 32px */
  --text-h4:      clamp(1.125rem, 1vw + 0.25rem, 1.375rem);/* 18px - 22px */
  --text-body-lg: 1.125rem;                               /* 18px */
  --text-body:    1rem;                                   /* 16px */
  --text-sm:      0.875rem;                               /* 14px */
  --text-xs:      0.75rem;                                /* 12px */
  --text-micro:   0.6875rem;                              /* 11px */

  /* Font Weights */
  --fw-regular:   400;
  --fw-medium:    500;
  --fw-semibold:  600;
  --fw-bold:      700;

  /* Line Heights */
  --lh-tight:     1.1;
  --lh-snug:      1.25;
  --lh-normal:    1.5;
  --lh-relaxed:   1.65;

  /* Letter Spacing (Tracking) */
  --tracking-tight: -0.02em;
  --tracking-snug:  -0.01em;
  --tracking-normal: 0em;
  --tracking-label:  0.05em;
  --tracking-wide:   0.08em;
}
```
