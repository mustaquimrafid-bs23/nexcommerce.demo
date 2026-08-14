# nexCommerce Brand Guidelines v1.0

**Document Type:** Brand & Digital Product Design Guidelines
**Version:** 1.0
**Status:** Design Source of Truth
**Brand:** nexCommerce
**Tagline:** *next generation e-commerce*
**Primary Brand Principle:** *Premium commerce with intelligence in the background.*

---

## Document Control

| Field            | Value                                                     |
| ---------------- | --------------------------------------------------------- |
| Brand            | nexCommerce                                               |
| Version          | 1.0                                                       |
| Owner            | nexCommerce Product / Design Team                         |
| Applies To       | Website, WebView, Mobile, AI features, customer-facing UI |
| Primary Audience | Designer, Developer, QA, BA, PM                           |
| Status           | Initial Brand Standard                                    |

---

# 1. Brand Foundation

## 1.1 Brand Name

**nexCommerce**

Always use the official spelling and capitalization:

> nexCommerce

Do not use:

* Nexcommerce
* Nex Commerce
* NEXCOMMERCE
* nex-commerce

---

## 1.2 Tagline

> **next generation e-commerce**

The tagline should normally appear beneath the primary logo where sufficient space exists.

---

## 1.3 Brand Statement

> **Shopping that understands what you mean.**

This is the central experience principle of nexCommerce.

The website should make customers feel that the platform understands:

* what they need
* why they need it
* their preferences
* their context
* their shopping history

without making the experience feel technically complicated.

---

# 2. Brand Personality

nexCommerce should consistently communicate five characteristics.

### Premium

The experience should feel carefully designed rather than mass-produced.

### Intelligent

AI should make shopping easier, not simply advertise that AI exists.

### Human

Real people, real situations and understandable language should remain central.

### Modern

The interface should use contemporary layouts, responsive design and purposeful motion.

### Trustworthy

Customers must always understand:

* what they are buying
* how much it costs
* when it will arrive
* how they can return it
* what the system is recommending and why

---

# 3. Brand Design Principles

## Principle 01 — Commerce First

nexCommerce is an **e-commerce platform first**.

AI enhances shopping; it does not replace the shopping experience.

---

## Principle 02 — Intelligence in the Background

AI should feel like an invisible assistant.

Prefer:

> "Picked for your evening"

over:

> "AI Recommendation Engine Result"

---

## Principle 03 — Explain, Don't Impress

AI recommendations should explain their usefulness.

Example:

> **Why this fits**
> Lightweight enough for a cool evening and aligned with your preference for minimal layering.

Avoid technical AI information unless it is genuinely useful.

---

## Principle 04 — Premium but Practical

The interface can be visually sophisticated while remaining easy to shop.

---

## Principle 05 — Motion Has a Purpose

Animation should communicate:

* state
* hierarchy
* continuity
* interaction
* feedback

Never add animation merely because it looks impressive.

---

# 4. Logo Guidelines

## 4.1 Primary Logo

Use the official supplied nexCommerce logo as the primary brand mark.

### Requirements

* Preserve original proportions.
* Preserve the checkmark.
* Preserve the official typography.
* Maintain sufficient clear space.
* Use the approved brand colors.

### Never

* stretch
* compress
* rotate
* distort
* recreate
* add unnecessary effects
* modify the checkmark
* change proportions

---

## 4.2 Logo Variations

Define these official variants:

### Primary

Full logo + tagline.

### Compact

nexCommerce logo without tagline.

### Symbol

Brand checkmark/icon for very small spaces.

### Monochrome

Approved white or dark version where required by the background.

---

## 4.3 Clear Space

Maintain a minimum clear space around the logo.

Recommended baseline:

> Minimum clear space = height of the `n` character.

This should be formalized in the design system when the final logo asset dimensions are available.

---

# 5. Color System

## 5.1 Primary Brand Colors

| Token             | Purpose                  | Approx. Value |
| ----------------- | ------------------------ | ------------- |
| `brand-navy`      | Primary brand/background | `#062A66`     |
| `brand-deep-navy` | Dark surfaces/footer     | `#041B3F`     |
| `brand-pink`      | Primary accent/AI        | `#F22968`     |
| `white`           | Primary light text       | `#FFFFFF`     |
| `soft-white`      | Light surfaces           | `#F5F7FA`     |
| `muted-text`      | Secondary text           | `#A8B6C9`     |

**Important:** these are initial design tokens. Final production values should be sampled from the official brand asset/logo and documented as the authoritative values.

---

## 5.2 Color Usage Ratio

Recommended visual balance:

```text
Navy / Deep Navy     70–80%
White / Soft White   15–20%
Pink                  5–8%
Other semantic colors Minimal
```

Pink should remain an **accent**, not dominate the interface.

---

# 6. Semantic Colors

Brand colors and semantic colors should remain separate.

| Semantic | Usage                           |
| -------- | ------------------------------- |
| Success  | Successful order, added to bag  |
| Warning  | Limited stock, delivery warning |
| Error    | Validation/error state          |
| Info     | Informational messages          |
| Discount | Sale/discount communication     |

Semantic colors must not replace the brand palette.

For example, an error should not suddenly turn the entire UI red.

---

# 7. Typography

## 7.1 Display Typeface

Use an elegant serif/display typeface for:

* hero headings
* major section headings
* editorial campaigns
* brand statements

The typography should feel:

> Editorial + Premium + Human

---

## 7.2 UI Typeface

Use a clean sans-serif for:

* navigation
* buttons
* product information
* forms
* prices
* filters
* checkout
* AI controls
* metadata

---

## 7.3 Type Hierarchy

Initial guideline:

| Level    | Desktop |
| -------- | ------: |
| H1       | 48–72px |
| H2       | 32–44px |
| H3       | 20–28px |
| Body     | 14–17px |
| Small UI | 11–13px |
| Label    | 10–12px |

Exact values should be implemented as design tokens rather than hardcoded individually.

---

# 8. Spacing System

Use a consistent spacing scale:

```text
4
8
12
16
24
32
48
64
80
96
120
```

Do not invent arbitrary spacing values for individual components unless there is a documented reason.

---

# 9. Layout System

## 9.1 Desktop

Use:

* generous whitespace
* strong visual hierarchy
* editorial composition
* controlled content width
* clear product grids

---

## 9.2 Tablet

Reduce:

* column count
* section spacing
* image sizes
* navigation complexity

---

## 9.3 Mobile

Do not simply shrink desktop.

Mobile should prioritize:

1. Header
2. Hero
3. Categories
4. Deals
5. AI Discovery
6. Featured products
7. Remaining merchandising
8. Trust/service information

---

# 10. Grid Guidelines

Product grids should normally use:

### Desktop

4 products per row where appropriate.

### Tablet

2–3 products.

### Mobile

2 products for compact commerce grids or 1 large product for editorial presentation.

Maintain consistent image ratios.

---

# 11. Component Guidelines

## 11.1 Buttons

### Primary Button

Brand pink background.

Used for:

* Start Shopping
* Add to Bag
* Apply
* Checkout

### Secondary Button

Dark/transparent surface with border.

### Text CTA

For low-priority actions:

> View All →

---

# 12. Product Card

Standard structure:

```text
┌───────────────────────────┐
│ Badge                 ♡   │
│                           │
│       PRODUCT IMAGE       │
│                           │
├───────────────────────────┤
│ Category                  │
│ Product Name              │
│ Price                     │
│                           │
│ Why it fits               │
│ Contextual explanation    │
│                           │
│ [ ADD TO BAG ]            │
└───────────────────────────┘
```

Required:

* product image
* product name
* price
* category
* CTA

Optional:

* AI badge
* discount
* rating
* recommendation explanation
* wishlist

---

# 13. Card Behavior

Simple interactions should use CSS.

Example:

> Hover → subtle scale + elevation.

Avoid excessive:

* rotation
* bouncing
* glowing
* 3D movement

---

# 14. Navigation

Primary navigation should remain simple.

Recommended structure:

```text
nexCommerce
Shop
Categories
New In
Discover
Search
Account
Bag
```

Navigation should never compete visually with the hero.

---

# 15. Homepage Structure

The homepage should follow this recommended order:

```text
Announcement
      ↓
Header
      ↓
Hero Carousel
      ↓
Category / Shopping Links
      ↓
Today's Deals
      ↓
AI Discovery
      ↓
Featured / Curated Products
      ↓
New Arrivals
      ↓
Campaign Banner
      ↓
Best Sellers
      ↓
Picked For You
      ↓
Recently Viewed
      ↓
Service Benefits
      ↓
Final CTA
      ↓
Footer
```

Not every section needs to appear simultaneously on every campaign version.

---

# 16. Hero Guidelines

The hero should communicate the brand immediately.

### Left side

* eyebrow
* strong editorial heading
* supporting text
* primary CTA
* AI discovery CTA

### Right side

* lifestyle/human model
* featured product
* contextual product information
* AI Match badge where relevant

The human model should remain one of the strongest visual elements.

---

# 17. Photography Guidelines

Photography should feel:

**Real + Premium + Lifestyle-oriented**

Preferred:

* human models
* realistic environments
* editorial lighting
* high-quality product photography
* consistent composition

Avoid:

* obviously generic stock photography
* inconsistent product backgrounds
* low-resolution imagery
* overly artificial AI imagery

---

# 18. AI Design System

AI is a first-class feature category but uses the existing brand language.

## AI Accent

Use:

> **Brand Pink**

not a separate purple AI palette.

---

## AI Badges

Examples:

> ✦ AI PICK

> ✦ AI MATCH

> ✦ SELECTED FOR YOU

> ✦ WHY THIS FITS

---

## AI Context

Preferred:

> **Understood as**

> Evening · Cool · Dhaka · Minimal · Layering

This makes the AI reasoning understandable without exposing technical implementation details.

---

# 19. AI Discovery

Customer-facing language:

> **Tell us what you need.**

Example:

> Something for a winter evening in Dhaka.

The system can interpret:

* occasion
* weather
* location
* style
* budget
* preference

and return relevant products.

---

# 20. AI Recommendation Guidelines

Recommendations should answer:

> **Why was this recommended?**

Example:

> Lightweight enough for your evening plans and matches your preference for minimal layering.

Avoid:

> AI score: 94.7%

unless the score has a genuine customer-facing purpose.

---

# 21. Motion Guidelines

## Default

Use **CSS** for simple interactions.

Examples:

* hover
* focus
* color transition
* simple scale
* simple opacity

---

## Use Motion for

* hero carousel
* swipe interactions
* drawers
* modals
* cart transitions
* AI state transitions
* layout changes
* complex product filtering
* coordinated animations

---

## Motion Personality

Motion should feel:

> Smooth · Subtle · Premium · Natural

Not:

> Flashy · Aggressive · Game-like

---

# 22. Animation Timing

Initial tokens:

```text
--motion-fast:    150ms
--motion-normal:  250ms
--motion-panel:   350ms
--motion-hero:    600ms
```

Use easing consistently.

Respect:

> `prefers-reduced-motion`

---

# 23. Accessibility

All UI must support:

* keyboard navigation
* visible focus states
* semantic HTML
* accessible labels
* sufficient contrast
* reduced motion
* screen-reader compatibility
* usable touch targets

Brand design must never override accessibility requirements.

---

# 24. Icon Guidelines

Use one consistent icon family.

Icons should be:

* simple
* modern
* consistent stroke weight
* visually quiet

Required common icons:

* Search
* Account
* Bag
* Wishlist
* Menu
* Filter
* Arrow
* AI
* Delivery
* Return

---

# 25. Voice & Tone

## Voice

**Intelligent + Human + Confident + Helpful**

### Preferred

> Tell us what you need.

> Find pieces worth discovering.

> Picked for you.

> Why this fits.

> Something else in mind?

### Avoid

> AI ENGINE ACTIVATED

> MACHINE LEARNING RESULT

> NEURAL MATCH: 94%

> INTENT EXTRACTION COMPLETE

The customer should experience the **benefit**, not the technical implementation.

---

# 26. E-Commerce Content Rules

Every product-related experience must clearly communicate:

* product
* price
* discount
* availability
* delivery
* return information
* CTA

AI must never obscure critical commerce information.

---

# 27. Trust & Transparency

AI recommendations should never imply certainty when the system is uncertain.

Use:

> "You might like..."

instead of:

> "This is definitely the best product for you."

AI should assist customer decisions rather than manipulate them.

---

# 28. Responsive Interaction Rules

### Desktop

Use:

* hover
* cursor interactions
* large editorial layouts

### Mobile

Use:

* tap
* swipe
* bottom sheets
* horizontal carousels
* touch-friendly controls

Never make an important feature dependent on hover.

---

# 29. Performance Guidelines

Prioritize:

```text
transform
opacity
```

for animations.

Optimize:

* hero images
* product images
* fonts
* lazy loading
* carousel rendering
* mobile performance

Avoid unnecessary continuous animation.

---

# 30. Design Tokens

The developer implementation should eventually contain centralized tokens such as:

```css
:root {
  --color-brand-navy: #062A66;
  --color-brand-deep-navy: #041B3F;
  --color-brand-pink: #F22968;

  --color-white: #FFFFFF;
  --color-surface: #F5F7FA;
  --color-text-muted: #A8B6C9;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;

  --motion-fast: 150ms;
  --motion-normal: 250ms;
  --motion-panel: 350ms;
  --motion-hero: 600ms;
}
```

These values are **initial tokens**, not final production values until the official logo/brand assets are sampled and the visual system is formally validated.

---

# 31. Developer Implementation Rules

Developers should **not independently invent**:

* colors
* button styles
* card styles
* AI badge styles
* typography
* spacing
* animation behavior

If a new component is required:

```text
Existing component?
       │
      YES
       ↓
Reuse it
       │
      NO
       ↓
Does it follow Brand Guidelines?
       │
      YES
       ↓
Create component
       │
      NO
       ↓
Review design decision
```

---

# 32. QA Brand Compliance Checklist

QA should verify:

### Branding

* [ ] Correct nexCommerce logo
* [ ] Correct logo proportions
* [ ] Correct brand colors
* [ ] Correct typography
* [ ] Correct tagline usage

### UI

* [ ] Buttons follow design system
* [ ] Cards follow design system
* [ ] Spacing is consistent
* [ ] Icons are consistent
* [ ] Responsive behavior is correct

### AI

* [ ] AI uses brand accent
* [ ] AI doesn't visually overpower commerce
* [ ] Recommendations explain value
* [ ] AI states are understandable
* [ ] Technical AI terminology isn't unnecessarily exposed

### Motion

* [ ] Animation has a purpose
* [ ] No excessive animation
* [ ] No layout jumping
* [ ] Mobile gestures work
* [ ] Reduced-motion behavior works

### Accessibility

* [ ] Keyboard navigation
* [ ] Focus states
* [ ] Contrast
* [ ] Touch targets
* [ ] Screen reader labels
* [ ] Reduced motion

---

# 33. Design Review Checklist

Before approving a new page, PM/BA/Design should ask:

### Brand

> Does this look unmistakably like nexCommerce?

### Commerce

> Can a customer easily understand what to buy and how to buy it?

### AI

> Does AI actually make the experience better?

### Visual

> Is the page premium without becoming unnecessarily complicated?

### Interaction

> Does every animation serve a purpose?

### Trust

> Does the customer have enough information to make a decision?

### Accessibility

> Can different users comfortably use the experience?

---

# 34. What nexCommerce Should Feel Like

The final experience should feel like:

> **A premium e-commerce store that quietly understands the customer.**

Not:

> **An AI application that happens to sell products.**

That distinction should guide every future feature.

---

# 35. Versioning

Future updates should follow:

```text
v1.0
Initial brand foundation

v1.1
Minor visual/token updates

v2.0
Major brand/design-system changes
```

Changes to the following should require explicit design-system review:

* logo
* primary colors
* typography
* core component styles
* AI visual language
* motion principles

---

## 36. Source-of-Truth Hierarchy

When there is a conflict, use this priority:

```text
1. Official nexCommerce logo / brand assets
                  ↓
2. Brand Guidelines
                  ↓
3. Design System / Tokens
                  ↓
4. Page-specific design
                  ↓
5. Developer implementation
```

A page-specific design should **never override the core brand without a documented reason**.

---

# 37. Final Brand Definition

### nexCommerce

**next generation e-commerce**

**Brand promise:**

> **Shopping that understands what you mean.**

**Visual identity:**

> **Deep navy + white + brand pink**

**Design personality:**

> **Premium + Intelligent + Human + Modern + Trustworthy**

**UX philosophy:**

> **Commerce first. Intelligence in the background.**

**Motion philosophy:**

> **Purposeful, subtle, premium.**

**AI philosophy:**

> **Useful, contextual, explainable, human.**
