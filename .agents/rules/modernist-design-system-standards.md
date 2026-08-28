# Modernist Design System — Mandatory UI/UX Implementation Rules

You are working on a premium/luxury e-commerce website. From this point forward, all new UI and all UI modifications must follow a **Modernist / Swiss-inspired editorial design system**.

The goal is NOT to make the website look like a generic minimalist SaaS product.

The goal is to create a **high-end, editorial, architectural, precise, timeless luxury-commerce experience** using Modernist design principles.

Treat this document as a **design-system implementation specification**, not as optional design inspiration.

---

# 1. PRIMARY DESIGN PHILOSOPHY

The core principle is:

> **Structure creates beauty. Remove unnecessary decoration and let typography, grid, spacing, imagery, hierarchy, and interaction create the visual experience.**

Every design decision should prioritize:

1. Clarity
2. Hierarchy
3. Grid discipline
4. Typography
5. Whitespace
6. Editorial composition
7. Product imagery
8. Functional interaction
9. Restraint
10. Premium visual quality

Do NOT add visual elements merely because they look fashionable.

Every element should have a clear purpose.

Before implementing a UI element, ask:

* What purpose does this element serve?
* Does it improve hierarchy?
* Does it belong to the grid?
* Does it improve the shopping experience?
* Does it support the luxury/editorial brand?
* Is it visually necessary?

If the answer is no, remove it.

---

# 2. IMPORTANT: DO NOT INTERPRET "MODERNIST" AS GENERIC MINIMALISM

Modernist does NOT mean:

* empty white pages
* generic centered layouts
* basic SaaS cards
* excessive rounded corners
* excessive gray backgrounds
* giant pill buttons
* excessive gradients
* glassmorphism
* floating blobs
* random decorative shapes
* excessive shadows
* generic AI-generated UI

Modernist means:

* structured
* intentional
* typographic
* editorial
* architectural
* asymmetric when appropriate
* grid-driven
* highly controlled
* visually restrained
* information-rich but organized
* premium

The interface can be visually dramatic.

However, the drama should come from:

* scale
* composition
* typography
* photography
* proportion
* whitespace
* contrast
* motion
* product presentation

NOT from unnecessary decoration.

---

# 3. USE THE EXISTING BRAND GUIDELINES AS THE HIGHEST PRIORITY

There is an established, iconic brand identity for **nexCommerce**. Modernist principles provide the **architectural structure, typography, and grid discipline**, but the **nexCommerce signature brand identity is the highest priority invariant**.

### Canonical nexCommerce Brand Design Invariants:
1. **The Signature AI Gradient**:
   - `linear-gradient(90deg, #3DE0FF 0%, #38BDF8 50%, #FB7185 100%)` with ambient specular glow `box-shadow: 0 0 12px rgba(61, 224, 255, 0.6)`.
   - Used for continuous story timers, spotlight progress bars, and luminous signature accents.
   - **Anti-Pattern**: NEVER strip the signature brand gradient into plain greyscale/monochrome black-and-white.
2. **Obsidian Brand Canvas Palette**:
   - Deep background: `#010C1E` / Surface card: `#080E1E` (or `rgba(8, 14, 30, 0.80)` with `backdrop-filter: blur(20px)`).
3. **Core Accent Roles**:
   - **Electric Cyan (`#3DE0FF`)**: Live status pulse dots, focus rings, interactive telemetry signals, and AI indicators.
   - **Rose / Coral (`#FB7185`)**: Refined luxury wishlist active state, seasonal editorial badges, and highlight tags.

Priority order:
1. **Existing nexCommerce brand guidelines & signature accents**
2. **Existing approved design system/tokens**
3. **Modernist principles (grid, 8px scale, typographic hierarchy, 3:4 images, strict 3-item footers)**
4. **Your own implementation judgment**

If something conflicts, do not blindly alter the existing brand.

---

# 4. GRID SYSTEM — THE FOUNDATION

Every major page must be based on a consistent grid.

Prefer a desktop **12-column grid** unless the existing application already has a different established grid.

The grid should control:

* page margins
* content width
* navigation
* hero sections
* typography
* images
* product grids
* filters
* product information
* editorial content
* CTAs
* footer
* section alignment

Do NOT position major elements randomly.

For example, avoid:

```
headline somewhere near the center
image somewhere near the right
button floating underneath
```

Instead, establish relationships between elements.

Example:

```
┌─────────────────────────────────────────────────────┐
│ 01                         COLLECTION               │
│                                                     │
│ HEADLINE                         PRODUCT IMAGE      │
│ HEADLINE                         PRODUCT IMAGE      │
│                                                     │
│ Description                                        │
│                                                     │
│ EXPLORE →                                          │
└─────────────────────────────────────────────────────┘
```

The actual layout can vary, but the underlying relationship must be deliberate.

---

# 5. CONTAINER AND ALIGNMENT

Use consistent page margins and content boundaries.

Do not allow every section to have a different arbitrary width.

Maintain strong vertical alignment between:

* navigation
* section headings
* product cards
* editorial content
* CTA areas
* footer content

Create reusable layout primitives where appropriate.

For example:

* PageContainer
* Grid
* GridColumn
* Section
* EditorialSplit
* FullBleedSection

Do not duplicate arbitrary spacing values throughout the application if a design token can be used.

---

# 6. ASYMMETRY IS ALLOWED — BUT MUST BE INTENTIONAL

Do not center everything.

Modernist editorial layouts frequently use asymmetric compositions.

For example:

LEFT:

```
COLLECTION
AUTUMN / WINTER
2027
```

RIGHT:

```
Large fashion image
```

Or:

```
01
                     PRODUCT IMAGE

PRODUCT INFORMATION
                     02
```

However, asymmetry must still follow the underlying grid.

Do NOT create asymmetry simply to make the page look unusual.

---

# 7. TYPOGRAPHY

Typography is one of the most important parts of this system.

Treat typography as a structural component.

Use a controlled hierarchy such as:

* Display
* H1
* H2
* H3
* H4
* Body
* Small
* Caption
* Label
* Metadata

Do not randomly choose font sizes.

Create a consistent type scale.

Example conceptual hierarchy:

```
DISPLAY
Very large editorial headline

H1
Large page heading

H2
Section heading

H3
Component heading

BODY
Product/content information

LABEL
Small uppercase metadata
```

The exact sizes must be adapted to the existing brand and viewport.

---

# 8. FONT STYLE

Prefer typography that feels:

* refined
* editorial
* contemporary
* European
* architectural
* highly legible

Avoid:

* childish fonts
* playful fonts
* handwritten fonts
* excessive decorative typefaces
* overly rounded "startup" fonts
* novelty display fonts

If the project already has an approved brand font, use it.

Do not introduce a new font without checking the existing system first.

If a serif display font is appropriate to the existing luxury brand, it may be used selectively for editorial headlines.

Do NOT automatically use serif everywhere.

A good combination can be:

```
Editorial display type
        +
Clean functional sans-serif
```

But the final combination must remain restrained.

---

# 9. LETTER SPACING

Use tracking intentionally.

Examples:

Small metadata:

```
COLLECTION 04
```

can use controlled uppercase tracking.

Large headlines should generally avoid excessive letter spacing.

Do not use:

```
L E T T E R S P A C E D
```

everywhere.

Typography should feel sophisticated, not artificially futuristic.

---

# 10. COLOR SYSTEM

Use the existing brand color system first.

If new tokens are required, prefer a restrained palette.

Conceptually:

```
PRIMARY INK
Dark / near-black

CANVAS
Warm white / off-white where appropriate

SECONDARY
Neutral gray

BORDER
Subtle neutral

ACCENT
Brand-specific accent
```

Avoid introducing multiple unrelated colors.

Do NOT use:

* random gradients
* neon accents
* purple AI gradients
* excessive blue/purple SaaS colors
* glowing effects

unless they already exist in the approved brand system.

---

# 11. BACKGROUNDS

Prefer:

* warm white
* clean white
* near-black
* restrained neutral tones
* approved brand colors

Use background changes to establish sections and hierarchy.

Do not create dozens of different background colors.

---

# 12. BORDERS

Borders are an important Modernist visual tool.

Prefer subtle, precise borders where separation is required.

Examples:

```
─────────────────────────────
```

Use borders for:

* navigation divisions
* product information
* filters
* tables
* editorial sections
* footer divisions
* inputs
* structured cards

Avoid thick decorative borders.

---

# 13. BORDER RADIUS

Do NOT automatically use large rounded corners.

Avoid blindly applying:

```
border-radius: 24px
```

to every component.

Modernist components generally work better with:

* square corners
* very small radius
* restrained radius

unless the existing brand system specifies otherwise.

A radius should have a reason.

---

# 14. SHADOWS

Use shadows very sparingly.

Avoid:

* huge soft shadows
* floating card shadows
* multiple layered shadows
* artificial depth everywhere

Prefer:

* borders
* contrast
* spacing
* background separation
* typography

to create hierarchy.

If a shadow is necessary for usability, keep it subtle.

---

# 15. BUTTON DESIGN

Buttons should be functional and editorial.

Good conceptual example:

```
┌─────────────────────┐
│ SHOP COLLECTION  →  │
└─────────────────────┘
```

Button hierarchy should come from:

* typography
* contrast
* border
* spacing
* placement

Avoid excessive pill-shaped buttons.

Do not add icons to buttons unless the icon improves comprehension.

Do not use decorative emoji.

---

# 16. LINKS

Links should feel editorial and intentional.

Examples:

```
EXPLORE →

VIEW PRODUCT →

DISCOVER COLLECTION →
```

Use subtle hover behavior.

For example:

```
VIEW PRODUCT
────────────→
```

The underline or arrow may animate slightly.

Do not make every link look like a colorful UI control.

---

# 17. ICONOGRAPHY

Use a consistent icon family.

Icons should be:

* simple
* precise
* lightweight
* functional

Avoid:

* colorful icons
* 3D icons
* cartoon icons
* inconsistent icon styles
* excessive icon decoration

Use icons only when they communicate something.

---

# 18. PRODUCT CARDS

Product cards are extremely important for this project.

Do NOT make every product card look like a generic marketplace card.

Avoid:

```
image
rounded white card
huge shadow
badge
product name
giant button
```

Instead, prefer an editorial product presentation.

Conceptually:

```
┌──────────────────────────────┐
│                              │
│                              │
│         PRODUCT IMAGE        │
│                              │
│                              │
└──────────────────────────────┘

PRODUCT NAME
CATEGORY
€ XXX

QUICK VIEW →
```

The image should dominate.

Product metadata should be restrained.

---

# 19. PRODUCT GRID

Use the grid to control product presentation.

Depending on viewport and context, use:

* 2-column
* 3-column
* 4-column
* editorial asymmetric layouts

Do not force every page into the same grid.

For a premium collection page, consider occasional editorial compositions such as:

```
LARGE PRODUCT       PRODUCT
LARGE PRODUCT       PRODUCT
```

or:

```
PRODUCT     PRODUCT     LARGE EDITORIAL IMAGE
```

But always maintain grid consistency.

---

# 20. IMAGERY

Photography is one of the primary visual assets.

Use high-quality imagery with:

* strong composition
* controlled cropping
* editorial styling
* consistent aspect ratios where appropriate
* high visual quality

Do NOT place beautiful imagery inside tiny generic cards if the image is supposed to be a primary storytelling element.

Use:

* full bleed photography
* large editorial imagery
* asymmetric image placement
* product-focused imagery
* lifestyle imagery

when appropriate.

---

# 21. DO NOT DESTROY IMAGE COMPOSITION

Never blindly use:

```
object-fit: cover
```

on every image.

Before implementing image cropping, inspect the image.

Ask:

* Is the model's face being cropped?
* Is the product being cropped?
* Is the composition intentional?
* Is the focal point preserved?
* Does the image require contain instead?
* Should the image be displayed full-height?
* Should the container aspect ratio change?

For luxury fashion photography, image composition is part of the design.

---

# 22. HERO SECTIONS

Hero sections should feel editorial rather than like a generic SaaS landing page.

Avoid:

```
Huge centered heading
paragraph
two colorful buttons
gradient background
```

Prefer:

```
COLLECTION / 01

NEW SEASON
2027

Editorial supporting text

EXPLORE →

                     Large fashion image
```

The exact composition can change depending on the approved design.

---

# 23. LUXURY + MODERNIST

The website should feel:

```
European
Editorial
Architectural
Sophisticated
Premium
Calm
Confident
Timeless
```

It should NOT feel:

```
Cheap
Generic
SaaS
Template-based
Playful
Overdecorated
AI-generated
Dribbble-style for the sake of visual effects
```

The visual language should communicate confidence.

The website should not scream that it is trying to look luxurious.

It should simply look expensive.

---

# 24. MOTION DESIGN

Motion is allowed and encouraged when it improves the experience.

Use motion for:

* page transitions
* image reveals
* hover states
* navigation
* product interactions
* editorial transitions
* scroll-based storytelling
* subtle parallax
* product image transitions

Motion should be:

* smooth
* controlled
* intentional
* premium
* fast enough for usability

Avoid:

* excessive bounce
* elastic animations everywhere
* random floating elements
* unnecessary spinning
* excessive parallax
* animations that slow down shopping

Prefer refined easing and subtle transitions.

---

# 25. MICRO-INTERACTIONS

Every interactive element should have a clear state.

For example:

BUTTON:

```
Default
Hover
Focus
Active
Disabled
```

LINK:

```
Default
Hover
Focus
```

PRODUCT:

```
Default
Hover
Quick-view
Selected
```

INPUT:

```
Default
Focus
Error
Disabled
```

Do not implement only the default state.

---

# 26. ACCESSIBILITY IS PART OF THE DESIGN SYSTEM

Modernist visual design must not sacrifice accessibility.

Ensure:

* sufficient color contrast
* keyboard navigation
* visible focus states
* accessible buttons
* accessible forms
* meaningful labels
* semantic HTML
* alt text for meaningful images
* reduced-motion support where appropriate

Do not remove focus indicators merely because they are visually inconvenient.

Create a refined focus state that fits the visual system.

---

# 27. RESPONSIVE DESIGN

The Modernist grid must adapt rather than simply shrink.

Desktop:

```
12-column editorial grid
```

Tablet:

```
reduced-column grid
```

Mobile:

```
simplified structured grid
```

Do NOT simply make desktop elements smaller.

Mobile layouts should be intentionally redesigned.

For example:

Desktop:

```
TEXT                 IMAGE
TEXT                 IMAGE
CTA                  IMAGE
```

Mobile:

```
IMAGE

TEXT
TEXT

CTA
```

The hierarchy must remain strong.

---

# 28. MOBILE TYPOGRAPHY

Do not allow giant desktop headings to overflow mobile.

Use responsive typography.

Large editorial typography is allowed, but it must remain controlled.

Check:

* line breaks
* orphan words
* headline height
* image relationship
* CTA placement
* navigation behavior

---

# 29. NAVIGATION

Navigation should be extremely clean.

Avoid turning the header into a collection of unrelated UI controls.

Prioritize:

* brand
* primary navigation
* search
* account
* cart

Use spacing and alignment rather than excessive containers.

If the brand uses a more experimental navigation system, maintain the same Modernist principles.

---

# 30. FILTERS AND SEARCH

Filters should feel like part of the editorial system.

Avoid giant rounded filter chips everywhere.

Prefer:

```
FILTER
──────

CATEGORY
COLOR
SIZE
MATERIAL
```

with clear hierarchy.

Search should feel functional and premium.

---

# 31. FORMS

Forms should be simple and precise.

Prefer:

```
EMAIL
─────────────────────────
```

rather than unnecessarily decorative inputs.

Use:

* clear labels
* strong focus state
* clear error state
* restrained borders
* appropriate spacing

---

# 32. CARDS

Not everything needs to be a card.

This is VERY important.

Do not wrap every section in:

```
┌─────────────────────────┐
│                         │
│       CONTENT           │
│                         │
└─────────────────────────┘
```

Modernist layouts often use open compositions.

Use cards only when a card genuinely improves grouping or interaction.

---

# 33. DO NOT OVERUSE UI CONTAINERS

Avoid excessive:

* nested cards
* nested borders
* nested backgrounds
* rounded containers
* floating panels

Instead, use:

* whitespace
* grid
* typography
* alignment
* rules/borders

to establish relationships.

---

# 34. DESIGN TOKENS

Where possible, centralize the visual system.

Create or reuse tokens for:

```
colors
typography
spacing
sizing
borders
radius
transitions
breakpoints
layout widths
```

Do not scatter arbitrary values everywhere.

For example, instead of repeatedly inventing:

```
17px
23px
29px
37px
```

establish a controlled spacing system.

Use the project's existing token architecture if one already exists.

---

# 35. COMPONENT CONSISTENCY

If a component exists already, reuse it.

Before creating a new:

* button
* input
* modal
* card
* product card
* navigation
* dropdown
* tooltip
* filter
* badge

inspect the existing implementation.

Do not create a second component that performs the same function with slightly different styling.

---

# 36. BEFORE CHANGING UI — INSPECT THE PROJECT

Do not immediately start coding.

First inspect:

1. Existing project structure
2. Existing design tokens
3. Existing CSS/SCSS
4. Existing component library
5. Existing typography
6. Existing color variables
7. Existing responsive breakpoints
8. Existing reusable components
9. Existing pages
10. Existing brand guidelines
11. Existing Figma/approved designs if available

Understand the current architecture before modifying it.

---

# 37. USE THE BROWSER PREVIEW

This is mandatory for meaningful UI changes.

Do NOT assume that the implementation looks correct from code alone.

After implementation:

1. Start the application.
2. Open the affected page in browser preview.
3. Inspect the actual rendered UI.
4. Check desktop.
5. Check tablet where applicable.
6. Check mobile.
7. Take screenshots when necessary.
8. Compare the visual result against the Modernist principles.
9. Fix visual inconsistencies.
10. Re-check after fixing.

Do not blindly trust CSS/code.

---

# 38. VISUAL QA PROCESS

For every significant UI implementation, inspect:

### Layout

* Is everything aligned?
* Is the grid consistent?
* Are margins consistent?
* Are columns balanced?
* Is the composition intentional?

### Typography

* Is hierarchy obvious?
* Are font sizes consistent?
* Is line height correct?
* Are line breaks intentional?
* Is letter spacing appropriate?

### Color

* Are colors restrained?
* Are brand colors preserved?
* Is contrast sufficient?

### Components

* Are buttons consistent?
* Are borders consistent?
* Are radius values consistent?
* Are states implemented?

### Imagery

* Is image cropping correct?
* Is the focal point preserved?
* Is the product/model visible correctly?

### Responsive

* Does mobile look intentionally designed?
* Is anything overflowing?
* Are headings breaking badly?
* Are interactions usable?

### Motion

* Is animation smooth?
* Is it helping the experience?
* Is anything excessive?

---

# 39. DO NOT FIX UI BLINDLY

If something looks wrong:

DO NOT immediately change random CSS values.

Investigate the root cause.

For example:

If a hero image appears too small:

Do not immediately increase:

```
width: 120%
```

First determine:

* Is the container too narrow?
* Is the grid incorrect?
* Is the image aspect ratio wrong?
* Is object-fit incorrect?
* Is the parent constraining the image?
* Is the breakpoint wrong?
* Is the original design expecting full bleed?

Then fix the actual cause.

---

# 40. WHEN MODIFYING AN EXISTING PAGE

Do not redesign the entire page unless specifically requested.

First identify:

* what is already correct
* what violates the Modernist system
* what violates the brand
* what has UX problems
* what has responsive problems

Then make the minimum necessary structural changes to bring the page into alignment.

Preserve working functionality.

Do not break:

* routing
* API integration
* forms
* cart functionality
* authentication
* product interactions
* filtering
* search
* checkout
* accessibility

Visual improvement must not introduce functional regression.

---

# 41. DO NOT ADD FEATURES JUST TO MAKE THE PAGE LOOK BETTER

Do not invent:

* unnecessary sections
* fake statistics
* decorative widgets
* random AI features
* unnecessary badges
* random testimonials
* fake reviews
* extra navigation
* unnecessary popups

Only implement functionality supported by the product requirements.

---

# 42. AVOID THESE VISUAL TRENDS

Unless explicitly requested by the existing brand/design:

DO NOT use:

* excessive glassmorphism
* gradient mesh backgrounds
* neon gradients
* giant pill UI
* excessive rounded cards
* floating blobs
* excessive drop shadows
* cartoon illustrations
* emoji-based UI
* excessive 3D decoration
* generic AI-generated landing-page patterns
* random Bento grids
* excessive frosted glass
* excessive blur
* colorful SaaS dashboards

Modernist can use contemporary technology and motion, but the underlying visual language must remain disciplined.

---

# 43. MODERNIST DOES NOT MEAN BORING

Do not make the website visually flat or lifeless.

Use visual impact through:

* enormous typography
* dramatic photography
* scale
* negative space
* asymmetry
* editorial layouts
* carefully timed motion
* product-focused interaction
* sophisticated transitions

The objective is:

**restrained but memorable.**

---

# 44. DESIGN DECISION RULE

When choosing between two implementations, prefer the one that is:

* simpler
* more intentional
* more aligned to the grid
* more typographically controlled
* less decorative
* more editorial
* more premium
* easier to understand
* easier to maintain

Do not choose something simply because it is technically impressive.

---

# 45. FINAL VISUAL QUALITY BAR

Before considering a page complete, ask:

> Does this look like a premium European editorial/luxury commerce website?

Not:

> Does this look like a modern website?

Those are different standards.

The final interface should feel closer to:

**fashion editorial + architecture + contemporary art + premium commerce**

than:

**SaaS dashboard + generic startup landing page + template UI.**

---

# 46. IMPLEMENTATION WORKFLOW

For every new page or major UI change, follow this exact workflow:

### STEP 1 — UNDERSTAND

Read the requirement carefully.

Identify:

* required functionality
* existing UX
* existing brand rules
* affected components

### STEP 2 — INSPECT

Inspect the current implementation.

Find:

* relevant components
* styles
* design tokens
* responsive rules
* reusable components

### STEP 3 — PLAN

Determine:

* grid
* hierarchy
* typography
* spacing
* imagery
* component structure
* responsive behavior
* interaction states

### STEP 4 — IMPLEMENT

Implement using existing architecture and reusable components.

Do not duplicate existing components unnecessarily.

### STEP 5 — BROWSER VALIDATION

Open the page in Antigravity browser preview.

Inspect the real rendered result.

### STEP 6 — VISUAL QA

Check:

* desktop
* tablet
* mobile
* spacing
* alignment
* typography
* image composition
* interaction
* accessibility

### STEP 7 — REFINEMENT

Fix visual inconsistencies based on actual browser output.

Do not blindly tweak values.

### STEP 8 — REGRESSION CHECK

Confirm that existing functionality still works.

### STEP 9 — FINAL REVIEW

Before reporting completion, verify that the result follows this Modernist design specification.

---

# 47. MOST IMPORTANT RULE

Never interpret this instruction as:

> "Make everything white, black, square and minimal."

Instead interpret it as:

> **"Build a coherent visual system where typography, grid, spacing, imagery, hierarchy, interaction and motion work together with precision."**

The website should feel **designed**, not merely styled.

The result should feel:

This design system is mandatory for all new UI work unless a specific page has an approved design that intentionally overrides it.

---

# 48. MODERNIST LUXURY FOOTER ARCHITECTURE & COPY INVARIANTS

### A. Anti-Jargon & Human-Understandable Vocabulary
Never use pretentious, obscure, or overly legalistic jargon in navigation headers and links:
* ❌ `THE MAISON` $\rightarrow$ ✅ **`ABOUT`** or **`COMPANY`**
* ❌ `THE ATELIER STORY` $\rightarrow$ ✅ **`About Us`**
* ❌ `DATA PRIVACY (GDPR)` $\rightarrow$ ✅ **`Privacy Policy`**
* ❌ `TERMS & RIGHT OF WITHDRAWAL` $\rightarrow$ ✅ **`Terms of Service`**
* ❌ `THE PRIVATE EDIT` $\rightarrow$ ✅ **`NEWSLETTER`**
* ❌ `CLIENT SERVICES` $\rightarrow$ Remove if redundant with header navigation.

### B. 3-Column Main Grid & Strict 2–3 Link Economy
The main footer grid MUST follow an architectural 3-column distribution:
1. **Column 1 (Brand & Socials)**: Brand logo, 1-line clear declaration, and subtle monochrome social channels (Instagram, TikTok, LinkedIn).
2. **Column 2 (ABOUT)**: Strictly **2 to 3 simple, essential links**:
   * `About Us`
   * `Privacy Policy`
   * `Terms of Service`
3. **Column 3 (NEWSLETTER)**: Clear heading (`NEWSLETTER`), 1-line benefit (*"Get updates on new seasonal drops and exclusive releases."*), clean rectangular form (`2px` radius) with solid pure white `SUBSCRIBE` CTA, and no-spam fine print.

### C. 3-Zone Architectural Bottom Bar
The footer bottom bar MUST follow a balanced 3-zone distribution (`grid-template-columns: 1.2fr auto 1fr;`):
1. **Left Zone (1/3)**: Copyright statement, German/EU statutory VAT notice (`All prices incl. statutory VAT`), and discreet legal text links (`Impressum`, `Privacy`, `Cookie Settings`).
2. **Center Zone (1/3)**: Centered payment trust marks.
3. **Right Zone (1/3)**: Right-aligned market & currency selector (`[🌐 Europe · EUR (€)]`).

### D. Strictly Top 3–4 Payment Marks
* **Quantity Cap**: Never display 6+ payment badges. Strictly limit footer trust marks to the **Top 3 or 4 essential European methods**:
  1. `Apple Pay` (`Pay`)
  2. `Visa` (`VISA`)
  3. `Mastercard` (`Mastercard`)
  4. `Klarna` (`Klarna.`)
* **Monochrome & Frosted Aesthetic**:
  - `background: rgba(255, 255, 255, 0.04)`
  - `border: 1px solid rgba(255, 255, 255, 0.1)`
  - `color: rgba(255, 255, 255, 0.65)` (hover: `#FFFFFF`, `border-color: rgba(255, 255, 255, 0.22)`)
  - `height: 24px; padding: 0 10px; border-radius: 2px;`
  - **Strictly Forbidden**: Saturated rainbow background blocks (hot pink Klarna, magenta iDEAL, blue PayPal).

### E. Zero Developer Widgets in Consumer UI
Never inject theme switchers, debug badges, or tech widgets into the public consumer footer.

---

# 49. HERO HEADLINE & EDITORIAL CTA INVARIANTS

1. **Headline Typography**: Single-line or naturally balanced 2-line headline in `Neue Haas Grotesk`/`Manrope` with `-0.025em` tight tracking. Never mix italic serif with sans-serif in awkward multi-line stacks (`Form in / Motion, / Designed for / Living.`).
2. **Understated Eyebrow**: Clean uppercase label (`AUTUMN / WINTER 2026`) with `+0.16em` tracking without arbitrary glowing colored accent bars.
3. **European Luxury Editorial Button**: Solid pure white `#FFFFFF` canvas, deep obsidian `#060E1A` typography, `2px` architectural border-radius, clean hairline border, and zero neon glowing drop shadows.

---

# 50. INTERACTIVE LOOKBOOK & EDITORIAL PHOTO BANNER STANDARDS

1. **Modernist Rounded Glass Container Framing**:
   - Use `border-radius: 20px` (desktop), `16px` (tablet), and `14px` (mobile).
   - Subtle hairline glass edge: `border: 1px solid rgba(255, 255, 255, 0.12)`.
   - Dual depth shadow: `box-shadow: 0 24px 60px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.12)`.
   - On hover: `border-color: rgba(255, 255, 255, 0.2); box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255, 255, 255, 0.16);`.

2. **Environmental Zoomed-Out Lifestyle Prompting**:
   - For dark luxury brand themes, always prompt for **extreme wide environmental long shots** (`24mm`–`35mm`).
   - Feature full-body models in dynamic motion (flowing couture silk trains, walking mid-stride).
   - Set against European blue-hour twilight palazzos matching the deep obsidian palette (`#010C1E`/`#02142E`) and warm architectural ambient lantern glow.

3. **Single-Piece Focal Restraint**:
   - Limit interactive pins on editorial photography to **strictly 1 primary statement piece** (e.g. the featured couture gown/overcoat).
   - Strictly forbid stacking multiple reticle beacon dots down the model's centerline (head, torso, feet), which creates an intrusive target look.
   - Avoid floating bottom-corner button pills over full-bleed photography when direct on-image telemetry suffices.

4. **Trailing Fabric / Negative Space Hotspot Anchor**:
   - Position hotspot pins on the **fluid, trailing fabric wave or lower hem drape** (`top: 72%; left: 41%` desktop / `top: 78%; left: 44%` mobile) rather than the model's chest, waist, or face.
   - Ensure the frosted telemetry popover card (`98% Mulberry Silk · Bias Draped · € 1,280.00`) opens cleanly into open negative space without occluding the model's face or body silhouette.

---

# 51. MODERNIST CATEGORY (PLP) ARCHITECTURE & PRODUCT GRID STANDARDS

### A. Editorial Category Masthead Typography
1. **Primary Display Heading (`.plp-title`)**:
   - Must use structured geometric `Manrope` / `Plus Jakarta Sans` bold font (`font-weight: 700; letter-spacing: -0.025em; line-height: 1.08;`).
   - **Anti-Pattern**: Never format full category display headings in decorative italic serif (`Instrument Serif` / `Cormorant Garamond`). Editorial serif is strictly reserved for high-editorial single-word accents.
2. **Dynamic Collection Eyebrow Tag (`.plp-hero-eyebrow`)**:
   - Must sit above the H1 in crisp uppercase metadata typography (`font-size: 10px; font-weight: 600; letter-spacing: 0.18em; text-transform: uppercase; color: rgba(255, 255, 255, 0.40);`).
   - Must dynamically synchronize with category filters (`COLLECTIONS · AW26`, `APPAREL · AW26`, `OUTERWEAR · AW26`, `ACOUSTIC ENGINEERING`, `FOOTWEAR · ARTISANAL`, `NEW ARRIVALS · AW26`).

### B. Section 50 Curated Capsule Spotlight Banner
1. **Container Framing**:
   - Must use Section 50 rounded glass framing (`border-radius: 20px` desktop / `16px` tablet / `14px` mobile, `background: rgba(8, 14, 30, 0.80); border: 1px solid rgba(255, 255, 255, 0.10); box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.10);`).
2. **Signature AI Gradient Progress Bar**:
   - Must use the signature nexCommerce linear gradient (`background: linear-gradient(90deg, #3DE0FF 0%, #38BDF8 50%, #FB7185 100%); box-shadow: 0 0 12px rgba(61, 224, 255, 0.6); height: 2px;`) to visually convey dynamic AI curation.
3. **Architectural Tab Selectors**:
   - Switcher tabs must use `2px` border-radius rectangular geometry (`font-size: 10px; font-weight: 600; letter-spacing: 0.12em;`). Avoid large oval pill buttons.
4. **Mobile Editorial Stacking (`≤600px`)**:
   - Layout must stack image on top and capsule narrative below (`flex-direction: column-reverse; gap: 16px;`) so visual photography leads the editorial story.

### C. Product Cards & Tactile Slide-Up Quick Add
1. **Aspect Ratio & Imagery**:
   - Card media must use European luxury **3:4 aspect ratio** (`aspect-ratio: 3 / 4; overflow: hidden;`) with `object-fit: cover; object-position: center 25%;`.
   - Studio product photography must accurately match item title and category metadata.
2. **Hairline Obsidian Framing**:
   - Card container must use `border: 1px solid rgba(255, 255, 255, 0.09); border-radius: 6px; background: rgba(8, 14, 30, 0.70);`.
   - Hover transition must feature subtle elevation (`border-color: rgba(255, 255, 255, 0.22); box-shadow: 0 20px 48px -10px rgba(0, 0, 0, 0.65);`).
3. **Slide-Up Quick Add CTA**:
   - Quick Add button must stay hidden below card edge (`transform: translateY(12px) translateZ(14px); opacity: 0;`) and slide up smoothly on hover (`transform: translateY(0); opacity: 1;`).
   - Must use solid obsidian styling with 1px border (`background: rgba(8, 14, 30, 0.95); border: 1px solid rgba(255, 255, 255, 0.18); border-radius: 2px; color: #FFFFFF; font-size: 10px; font-weight: 700; letter-spacing: 0.12em;`).
4. **Strict 3-Item Clean Footer**:
   - Strictly Item 1 (Brand · Category) + Item 2 (Product Title in Manrope) + Item 3 (Price in tabular-nums + tactile circular swatches). Zero descriptive paragraph text.

### D. Restrained Luxury Wishlist State
- Floating wishlist heart button must use an obsidian glass circle (`rgba(14, 22, 42, 0.95)`) with an elegant filled rose (`#FB7185`) heart icon.
- **Anti-Pattern**: Never use solid high-saturation hot-magenta circles (`#E2126E`) in consumer product cards.

### E. Architectural Filter Bar & Sort Controls
1. **Filter Tags**: Minimalist `2px` border-radius architectural tags with smooth horizontal swipe on mobile devices (`scrollbar-width: none; -webkit-overflow-scrolling: touch;`).
2. **Sort Dropdown**: Custom-styled `<select>` with 2px radius and subtle hairline division line.
3. **Header Nav Glider Synchronization**: Navigation glider in `header.js` must parse query strings (`?cat=...`) so active category filters are accurately highlighted in top navigation.

---

# 52. MANDATORY HUMAN-FRIENDLY LUXURY COPYWRITING & ANTI-JARGON STANDARD

All copy across every screen, component, badge, modal, tooltip, empty state, and action button MUST use natural, empathetic, and instantly understandable human language. The UI must sound like a prestigious European luxury retail concierge — NEVER an internal machine learning specification or backend engineering console.

### 1. Blacklisted Jargon & Mandatory Replacements

| Blacklisted Jargon / Robotic Phrasing | Mandatory Human-Friendly Replacement |
| :--- | :--- |
| ❌ `Synthesize` / `Synthesize Capsule` | ✅ `Curate` / `Search` / `Explore` / `Build Look` |
| ❌ `Cadence Configuration` / `Replenishment Cycle` | ✅ `Reorder Schedule` / `Adjust Reorder Frequency` |
| ❌ `Replenishment Pieces` / `Replenishments` | ✅ `Recommended Items` / `Wardrobe Essentials` / `Products` |
| ❌ `Extracted Tonal DNA` / `Aesthetic DNA` | ✅ `Color Palette` / `Palette` |
| ❌ `Curation Valuation` / `Telemetry Valuation` | ✅ `Estimated Total` / `Total Value` |
| ❌ `Move All to Bag` | ✅ `Add All to Bag` |
| ❌ `Archive Acquisitions` / `Private Archive` | ✅ `Previous Orders` / `Special Offer` / `Sale` |
| ❌ `Atelier Reserved` | ✅ `Out of Stock` / `Reserved` |
| ❌ `Horology` / `Caliber Series` | ✅ `Watches` / `Automatic Series` |
| ❌ `High Acoustics` | ✅ `Audio` / `Headphones & Speakers` |
| ❌ `Artisanal Footwear` | ✅ `Footwear` / `Shoes` |
| ❌ `Analyzing silhouette constraints...` | ✅ `Finding matching items for your style...` |
| ❌ `Your atelier curation is forming...` | ✅ `Your shopping list is empty.` |
| ❌ `Bespoke Atelier Pairing` / `Assemble Your Complete Ensemble` | ✅ `Personal Styling` / `Complete Your Look` |
| ❌ `Style My Replenishments` | ✅ `Chat with Stylist` / `Get Style Advice` |

### 2. Customer Benefit over Algorithmic Logic
- Product recommendation reasons must highlight tangible customer value and seasonal context (e.g. *"Purchased 4× · Recommended for winter"*, *"Everyday essential"*), never raw algorithm math (*"Interval 60 days delta 2"*).
- Omnibus prior price disclosures must be conversational and compliant (e.g. *"Lowest price in last 30 days: € 215.00"*).

---

# 53. VISUAL-FIRST STYLE STUDIO & CURATED CARD ARCHITECTURE

1. **Visual Style Card Grid**:
   - 4-column responsive grid on desktop (`grid-template-columns: repeat(4, 1fr)`), 2-column on tablet (`repeat(2, 1fr)`), and 1-column on mobile (`1fr`).
   - Each card must feature:
     - Dedicated radial studio photograph container (`background: radial-gradient(...)`) with `object-fit: contain`.
     - Active state checkmark badge in top-right corner (`background: #3DE0FF; color: #020B18`).
     - Plain-English bold title + 1–2 line functional wardrobe description.
     - Hover elevate animation (`transform: translateY(-3px)`) and active cyan glow (`box-shadow: 0 0 20px rgba(61, 224, 255, 0.2)`).

2. **Strict Elimination of Fantasy RPG / Polygon Jargon**:
   - Never use sci-fi tropes or radar polygons with mixed axes (e.g. "Nocturne Archetype", "Alpine Thermal Calibration", spider polygons).
   - Use clear everyday styles: `Minimalist & Clean`, `Smart & Tailored`, `Relaxed & Everyday`, `Outdoor & Outerwear`.

---

# 54. SEARCH MODAL & OVERLAY ARCHITECTURE (CURATED EDITORIAL ATELIER)

1. **Idle State Information Architecture**:
   - Modal container width capped at `780px` on desktop with dark midnight glassmorphic backdrop.
   - High-focus top search input with search icon, subtle shortcut badge (`ESC`), and clear trigger.
   - Text-only department navigation (`.atelier-dept-nav`) styled with `13px` Inter, `var(--text-soft)`, hover `var(--accent-cyan)` with zero photo banner backgrounds.
   - Capped 3-card seasonal highlights grid using `.atelier-products-grid` (`grid-template-columns: repeat(3, 1fr)` on desktop, `1fr` on mobile).
   - `.atelier-thumb` using `width: 48px; height: 48px; object-fit: contain !important;` with radial studio backdrop.
   - Clean recent searches footer row with one-click individual deletion and "Clear Recent" button.

# 55. FULL-BLEED EDITORIAL HERO & ROOT LAYOUT GUARDRAILS

1. **Root Main Padding & Full-Bleed Alignment**:
   - Never apply hardcoded global top padding (e.g. `<main className="pt-20">`) to root layout wrappers when pages feature full-bleed hero banners. Subpages without hero banners must manage their own top spacing or use contextual page containers.

2. **Left-Anchored Editorial Composition & Model Framing**:
   - For high-end editorial heroes with photographic human models or structured product silhouettes on the right, hero typography (eyebrow, serif headline, single confident CTA) MUST be left-anchored (`left: clamp(24px, 6vw, 96px); top: 50%; transform: translateY(-50%)`) with a horizontal gradient vignette (`linear-gradient(90deg, rgba(3,8,20,0.85), transparent)`). Never center text blocks directly on top of model photography.

3. **Full-Bleed `<picture>` Display Specification**:
   - In full-bleed and parallax image canvas layers, `<picture>` elements MUST explicitly declare `position: absolute; inset: 0; width: 100%; height: 100%; display: block;` to prevent inline element height collapse.

---

# 56. CUSTOMER CARE, HELP & UTILITY PAGE ARCHITECTURE

1. **Radical Simplicity & Speed of Resolution**:
   - Customer support and help desk pages must prioritize instant answers and quick assistance over promotional merchandising density.
   - Core Layout:
     1. **Hero Search Header**: Clean search input + quick-filter chips (`All`, `Orders`, `Delivery`, `Returns`, `Sizing`).
     2. **Frequently Asked Questions (Left 7-Col)**: 5–8 essential questions with instant real-time search filtering.
     3. **Direct Contact Card (Right 5-Col)**: 2 quick-action buttons (*Live Stylist Chat*, *Track an Order*) + simple 3-field message form (*Your Name*, *Email Address*, *Message*) with instant confirmation ticket generator (`TKT-xxxx-NX`).
   - Strictly avoid adding heavy rotating look carousels, clocks, or multi-screen boutique directories to help pages.

2. **Royal Obsidian Navy Palette Adherence**:
   - All support and utility page backgrounds must strictly adhere to the signature Royal Navy palette (`bg-gradient-to-b from-[#012148] via-[#00193b] to-[#00142e]`) with active sapphire ambient lighting cones (`radial-gradient(circle at 50% 0%, rgba(14, 165, 233, 0.15) 0%, rgba(10, 58, 120, 0.2) 35%, transparent 70%)`). Never render pitch-black backgrounds (`#000814`).
