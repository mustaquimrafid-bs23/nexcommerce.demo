# Premium E-Commerce Storefront — UI/UX Master Development Instruction

## 1. Objective

Build the storefront as a **premium, modern, production-grade e-commerce experience**.

The goal is not simply to make the website "look beautiful." The goal is to create an experience that is:

* Modern
* Premium
* Clean
* Intuitive
* Fast-feeling
* Trustworthy
* Accessible
* Responsive
* Consistent
* Easy to understand
* Easy to navigate
* Easy to purchase from
* Visually polished
* Production-ready

The final result should feel like it was designed by a **senior product designer and implemented by a senior frontend engineer**.

Do not create a collection of generic pages or generic UI components.

Every part of the storefront should feel like it belongs to **one coherent product and design system**.

---

# 2. Core Design Philosophy

Follow this hierarchy:

> **Usability → Clarity → Accessibility → Consistency → Performance → Visual quality → Decoration**

Never sacrifice usability for visual effects.

"Modern" does NOT mean:

* excessive gradients
* excessive glassmorphism
* excessive rounded cards
* unnecessary animations
* huge shadows
* excessive colors
* oversized typography
* decorative elements everywhere
* complicated interactions

Use modern visual techniques only when they improve the experience.

The interface should feel:

> **Simple at first glance, sophisticated when interacted with.**

---

# 3. Human-Centered UX

Design according to established Human-Computer Interaction and UX principles.

The interface should account for:

### Cognitive Load

Reduce unnecessary mental effort.

Users should not need to understand how the system works before they can use it.

### Recognition Over Recall

Prefer showing users available options instead of forcing them to remember information.

### Mental Models

Use familiar patterns.

For example:

* Shopping cart should behave like a shopping cart.
* Search should behave like search.
* Filters should behave like filters.
* Back navigation should behave predictably.
* Buttons should look and behave like buttons.

Do not invent unusual interactions without a strong reason.

### Hick's Law

Avoid presenting unnecessary choices simultaneously.

When there are many options, use:

* categorization
* progressive disclosure
* filtering
* search
* grouping

### Fitts's Law

Important interactive elements must be easy to reach and click.

Pay particular attention to:

* Primary CTAs
* Add to cart
* Quantity controls
* Search
* Navigation
* Checkout actions
* Mobile controls

### Gestalt Principles

Use:

* proximity
* similarity
* alignment
* hierarchy
* grouping
* visual continuity

to make relationships between elements obvious.

### Visual Hierarchy

Every screen must have a clear:

1. Primary focus
2. Secondary focus
3. Supporting information
4. Primary action
5. Secondary actions

The user should understand the purpose of a screen within seconds.

---

# 4. User-First Thinking

Before implementing a screen, determine:

1. Who is using this screen?
2. What is the user trying to accomplish?
3. What information does the user need?
4. What decision does the user need to make?
5. What action should the user take?
6. What could confuse the user?
7. What could prevent the user from completing the task?
8. What happens if something goes wrong?
9. What feedback should the user receive?
10. What is the simplest way to accomplish the task?

Do not design screens in isolation.

Design the **complete user journey**.

---

# 5. E-Commerce User Journey

The storefront should support a clear journey such as:

Home
→ Discover
→ Search/Browse
→ Product Listing
→ Filter/Sort
→ Product Details
→ Add to Cart
→ Mini Cart
→ Cart
→ Checkout
→ Payment
→ Order Confirmation
→ Order Tracking

At every stage, reduce friction.

The user should always understand:

* Where they are
* What they can do
* What they have already done
* What happens next
* What the system is currently doing
* Whether their action succeeded

---

# 6. Research Before Major UI Decisions

Before creating major new UI patterns, research current best practices from leading digital products.

Study modern products such as:

* Amazon
* Shopify
* Apple
* Stripe
* Airbnb
* Linear
* Vercel
* Other high-quality e-commerce products

Research should focus on:

* Navigation
* Search
* Product discovery
* Product cards
* Product details
* Filtering
* Sorting
* Cart interactions
* Checkout
* Forms
* Empty states
* Error states
* Loading states
* Mobile navigation
* Responsive behavior
* Accessibility
* Micro-interactions

Do NOT copy their designs.

Use research to understand:

> **What patterns work, why they work, and when they should be used.**

Prefer established patterns unless there is a strong reason to introduce something different.

---

# 7. Design System First

Do not start by independently designing every page.

First establish a reusable design system.

Create consistent design tokens for:

## Colors

Define semantic colors such as:

* Primary
* Primary hover
* Primary active
* Secondary
* Background
* Surface
* Elevated surface
* Border
* Text primary
* Text secondary
* Text muted
* Success
* Warning
* Error
* Info
* Discount
* Out-of-stock

Do not randomly choose colors on individual pages.

Every color should come from the design system.

---

# 8. Typography System

Create a consistent typography hierarchy.

Define:

* Display
* H1
* H2
* H3
* H4
* Body large
* Body
* Body small
* Caption
* Label
* Button text
* Price
* Discount price
* Product title

Typography must have:

* consistent font family
* consistent weights
* consistent line heights
* consistent letter spacing
* responsive sizing where appropriate

Do not use arbitrary font sizes throughout the application.

---

# 9. Spacing System

Create a consistent spacing scale.

Use the design system spacing tokens rather than arbitrary values.

Maintain consistency for:

* page margins
* section spacing
* card padding
* form spacing
* grid gaps
* navigation spacing
* modal padding
* button spacing

The interface should feel aligned even when users cannot consciously explain why.

---

# 10. Radius, Borders and Elevation

Create a consistent system for:

* border radius
* border thickness
* shadows
* elevation

Do not give every component a different radius.

Do not put unnecessary borders around everything.

Use elevation intentionally to communicate hierarchy.

---

# 11. Iconography

Use one consistent icon family.

Icons must:

* have consistent visual weight
* have consistent sizing
* have predictable meaning
* align correctly with text
* include accessible labels when necessary

Do not mix unrelated icon styles.

Do not use icons merely for decoration.

---

# 12. Component Architecture

Build reusable components instead of page-specific duplicated UI.

At minimum, consider components for:

### Navigation

* Header
* Desktop navigation
* Mobile navigation
* Mega menu where appropriate
* Breadcrumbs
* Search
* Account menu
* Cart indicator

### Buttons

* Primary
* Secondary
* Tertiary
* Destructive
* Icon button
* Loading button

### Forms

* Input
* Search input
* Select
* Combobox
* Checkbox
* Radio
* Quantity selector
* Date selector where required
* Address selector

### Feedback

* Toast
* Alert
* Banner
* Tooltip
* Inline validation
* Confirmation message

### Overlays

* Modal
* Dialog
* Drawer
* Bottom sheet
* Popover
* Dropdown

### E-Commerce

* Product card
* Product image
* Product price
* Discount badge
* Rating
* Review summary
* Stock status
* Add-to-cart button
* Quantity selector
* Mini cart
* Cart item
* Cart summary
* Coupon field
* Order summary

### Content

* Tabs
* Accordion
* Pagination
* Filter panel
* Sort control
* Empty state
* Error state
* Skeleton
* Loading indicator

---

# 13. Every Component Must Have States

Do not design only the default state.

Where applicable, every interactive component must support:

* Default
* Hover
* Focus
* Active
* Selected
* Disabled
* Loading
* Success
* Error
* Empty

For example, a button should support:

```text
Default
Hover
Pressed
Focus
Disabled
Loading
Success
```

A product card should consider:

```text
Available
Discounted
Low stock
Out of stock
Loading
Image loading
Add-to-cart success
Unavailable
Long product name
Different price formats
```

---

# 14. Loading Experience

Never leave users wondering whether something is happening.

Use appropriate:

* Skeleton loaders
* Spinners
* Progress indicators
* Button loading states
* Optimistic feedback where safe

Avoid unnecessary full-page loading.

Prefer localized loading where possible.

Example:

When the user clicks "Add to Cart":

Bad:

> Nothing happens for 2 seconds.

Better:

> Button immediately changes state → cart count updates → success feedback appears.

---

# 15. Empty States

Every important empty state should be intentionally designed.

Examples:

* Empty cart
* No search results
* No products
* No orders
* No saved items
* No notifications

An empty state should explain:

1. What happened
2. Why it is empty when useful
3. What the user can do next

Do not simply show:

> "No data."

---

# 16. Error States

Errors must be understandable and actionable.

Do not expose technical messages such as:

> Error 500

unless necessary for technical diagnostics.

Prefer:

> "We couldn't load your cart. Please try again."

Provide an appropriate next action.

Errors should tell users:

* What happened
* Whether their data is safe
* What they can do next

---

# 17. Form UX

Forms should minimize effort.

Use:

* clear labels
* meaningful placeholders only when helpful
* appropriate input types
* inline validation
* clear error messages
* sensible defaults
* correct keyboard behavior on mobile
* logical tab order
* clear required/optional indicators

Do not wait until form submission to reveal every validation error.

But also do not aggressively show errors before the user has had a reasonable opportunity to complete the field.

---

# 18. Search UX

Search is a critical e-commerce feature.

Consider:

* autocomplete
* suggestions
* recent searches
* popular searches
* typo tolerance
* product suggestions
* category suggestions
* clear search states
* no-result suggestions
* loading state
* keyboard navigation

Search should help users find what they mean, not simply what they typed.

---

# 19. Product Listing UX

Product listing pages should make comparison easy.

Important information should be visible without requiring unnecessary clicks.

Consider:

* product image
* product name
* price
* discount
* rating
* availability
* quantity/unit
* quick add
* favorite/wishlist where applicable

Filters should be:

* easy to understand
* easy to apply
* easy to remove
* clearly show selected values
* responsive on mobile

---

# 20. Product Detail UX

The product page should answer the user's major questions:

* What is this?
* How much does it cost?
* Is it available?
* What size/quantity is it?
* What are the important details?
* Why should I buy it?
* When will I receive it?
* Can I trust this product?
* What happens after I purchase?

Primary actions should be visually clear.

Avoid making users search around the page for essential purchase information.

---

# 21. Cart UX

The cart should make it easy to:

* review products
* change quantity
* remove items
* understand pricing
* see discounts
* understand delivery charges
* understand total cost
* continue shopping
* proceed to checkout

Price calculations must be visually clear.

The user should never wonder:

> "Why is the total different?"

---

# 22. Checkout UX

Checkout should minimize friction.

Clearly communicate:

* products
* subtotal
* discounts
* delivery fee
* total
* delivery address
* payment method
* order confirmation

Avoid unnecessary fields.

Use progressive disclosure where appropriate.

Do not surprise users with costs at the end.

---

# 23. Responsive Design

Responsive design must be intentional.

Do NOT simply shrink desktop layouts.

Define behavior for:

### Desktop

* navigation
* multi-column layouts
* sidebars
* grids
* large content areas

### Tablet

* adapted grid
* simplified navigation
* adjusted spacing

### Mobile

* mobile navigation
* touch-friendly controls
* bottom sheets
* compact cards
* simplified layouts
* appropriate sticky actions

Every major component must be evaluated at different viewport sizes.

### 23.1 Dual-Axis Viewport Ergonomics & Above-the-Fold Rules

Above-the-fold calibration requires dual-axis awareness (both viewport height AND viewport width):

1. **The Editorial Hero Viewport Anchor**:
   - Hero sections intended as full opening editorial moments MUST use `min-height: calc(100vh - var(--header-total-height))` / `calc(100dvh - ...)` with `display: flex; flex-direction: column; justify-content: center;`.
   - This prevents subsequent sections (e.g. "Shop by category") from awkwardly peeking into the frame on tall desktop monitors (1080p, 1440p, 4K).
2. **Vertical Fluid Scaling (`clamp` & `vh`)**:
   - NEVER use large fixed pixel heights (e.g. `height: 520px`) for hero media frames, models, or banners.
   - Use fluid vertical scaling: `height: clamp(300px, 48vh, 480px)` and fluid vertical padding `clamp(16px, 3vh, 40px)`.
3. **Height-Based Compact Laptop Media Queries**:
   - Common laptops (1366×768, 1440×900, 1280×800) have limited usable browser viewport height (~600–720px).
   - Always include `@media (max-height: 820px) and (min-width: 901px)` to scale down headline font sizes, paragraph margins, and button heights so that **100% of the Hero (Title, CTAs, Media Frame, Hotspots, and Carousel Controls) fits cleanly above the fold without requiring any scrolling**.

---

# 24. Mobile-First Interaction Quality

Mobile users interact primarily through touch.

Ensure:

* sufficiently large touch targets
* adequate spacing
* no accidental taps
* readable text
* easy-to-reach primary actions
* proper keyboard behavior
* no horizontal overflow
* sticky controls only when useful

Do not simply create a smaller desktop UI.

Create a good mobile experience.

---

# 25. Accessibility

Accessibility is mandatory.

Consider:

* semantic HTML
* keyboard navigation
* visible focus states
* sufficient contrast
* accessible labels
* alt text
* proper form labels
* ARIA only when necessary
* screen-reader compatibility
* touch target sizes
* reduced motion
* error accessibility

The interface should remain usable for people with different abilities.

---

# 26. Animation and Motion

Use motion to communicate:

* state changes
* hierarchy
* continuity
* feedback
* cause and effect

Good examples:

* subtle hover transitions
* drawer opening
* cart updates
* button feedback
* modal transitions
* skeleton animation
* toast appearance

Avoid:

* unnecessary page animations
* long transitions
* distracting effects
* animation on everything

Animations should feel:

> **Fast, subtle, purposeful and premium.**

Respect reduced-motion preferences.

---

# 27. Micro-interactions

Use small interactions to improve perceived quality.

Examples:

* Add-to-cart feedback
* Quantity change feedback
* Wishlist interaction
* Button loading
* Search suggestion appearance
* Filter selection
* Toast confirmation
* Image transitions
* Copy-to-clipboard feedback

Micro-interactions should reinforce user actions rather than distract from them.

---

# 28. Performance Is Part of UX

A visually beautiful website that feels slow is not a premium experience.

Optimize:

* image loading
* image sizes
* lazy loading
* component rendering
* JavaScript
* animations
* network requests
* unnecessary re-renders

Use skeletons and progressive loading where appropriate.

The interface should feel responsive even when the network is slow.

---

# 29. Content Design

UI quality also depends on wording.

Use:

* short labels
* clear CTA text
* predictable terminology
* human-readable error messages
* consistent terminology

Prefer:

> "Add to cart"

over:

> "Execute"

Prefer:

> "Try again"

over:

> "Retry operation"

Use language users understand.

---

# 30. Trust and E-Commerce Psychology

The storefront must create confidence without manipulating users.

Use legitimate trust signals such as:

* clear pricing
* delivery information
* return information
* product reviews
* ratings
* stock information
* secure payment messaging
* transparent fees
* clear order status

Avoid deceptive dark patterns.

Never intentionally hide:

* costs
* important conditions
* cancellation options
* unavailable products
* subscription conditions

The user should feel:

> "I understand what I am buying and what will happen."

---

# 31. Visual Hierarchy Rules

For every page ask:

### What should the user see first?

### What should they understand second?

### What should they do next?

If everything is visually emphasized, nothing is emphasized.

Use:

* size
* weight
* contrast
* spacing
* positioning
* grouping

to establish hierarchy.

---

# 32. Avoid Generic AI-Generated UI

Do NOT create UI that looks like generic AI-generated templates.

Avoid repetitive patterns such as:

* every section inside a rounded card
* excessive glassmorphism
* random gradients
* excessive shadows
* identical card layouts everywhere
* unnecessary badges
* excessive pill-shaped elements
* giant headings everywhere
* random animations
* meaningless decorative icons

The design should feel **intentional and product-specific**.

---

# 33. Consistency Rules

Once a pattern has been established, reuse it.

For example:

If the primary CTA uses:

* specific height
* radius
* typography
* icon spacing
* loading behavior

then every primary CTA should follow the same system.

Do not create:

```text
Page A → 44px button
Page B → 48px button
Page C → 52px button
```

unless there is a legitimate design reason.

Consistency creates perceived quality.

---

# 34. Component Reusability

Before creating a new component, ask:

> "Does a similar component already exist?"

If yes:

* reuse it
* extend it
* create a variant

Do not duplicate components unnecessarily.

Build components so future pages can use the same system.

---

# 35. Page Design Process

For every new page follow this process:

### Step 1 — Understand the purpose

Identify the user's goal.

### Step 2 — Understand the data

Determine:

* content
* states
* actions
* edge cases

### Step 3 — Define hierarchy

Determine:

* primary content
* secondary content
* primary CTA

### Step 4 — Define user flow

Understand:

> Where did the user come from?

and:

> Where should they go next?

### Step 5 — Design structure

Create the layout.

### Step 6 — Apply design system

Use existing:

* typography
* colors
* spacing
* components
* patterns

### Step 7 — Add interaction states

Implement:

* loading
* error
* empty
* success
* hover
* focus
* disabled

### Step 8 — Responsive design

Check:

* desktop
* tablet
* mobile

### Step 9 — Accessibility

Verify keyboard, contrast, semantics and interaction.

### Step 10 — Visual QA

Compare the result against the design system and quality bar.

---

# 36. Before Implementing Any New Component

Ask:

1. Does this component already exist?
2. Can an existing component be reused?
3. Is this interaction familiar to users?
4. Does this reduce or increase cognitive load?
5. Is it accessible?
6. Does it work on mobile?
7. What are its loading/error/empty states?
8. Does it need animation?
9. Is the animation useful?
10. Does it follow the design system?

---

# 37. Visual QA

After implementation, inspect every screen carefully.

Check:

### Layout

* alignment
* spacing
* proportions
* overflow
* container widths
* grid consistency

### Typography

* hierarchy
* font sizes
* line height
* truncation
* wrapping

### Colors

* consistency
* contrast
* semantic meaning

### Components

* consistency
* states
* alignment
* interaction

### Responsive

* desktop
* tablet
* mobile

### Interaction

* hover
* focus
* active
* loading
* error
* success

### Accessibility

* keyboard
* focus
* contrast
* labels
* semantic structure

### Performance

* loading
* images
* animations
* responsiveness

---

# 38. Browser Testing

Test the implemented UI across the **Mandatory 4-Tier Viewport Verification Matrix**:

1. **Compact Laptop (`1366 × 768`)**:
   - Verify that 100% of hero elements (headline, CTAs, product image, hotspot, carousel dots) are visible above the fold without scrolling.
2. **Standard Laptop / MacBook (`1440 × 900`)**:
   - Verify vertical symmetry, breathing room, and responsive fluid type scaling.
3. **Full HD Desktop (`1920 × 1080` and `1440p`)**:
   - Verify that hero sections anchored to the viewport do not allow subsequent sections to awkwardly peek into the first screen.
4. **Mobile Device (`390 × 844` / `375 × 667`)**:
   - Verify single-column grid reflow, 44×44px minimum touch targets, zero horizontal overflow, and static card placement.

Also check:

* different content lengths
* slow loading
* empty data
* error responses
* long product names
* large product images
* missing images
* unavailable products
* unusual prices
* different quantities

The UI must remain stable when real-world data is not perfect. Always inspect computed geometry in DevTools (`getBoundingClientRect()`, `window.getComputedStyle()`) rather than relying solely on visual assumptions.

---

# 39. Design for Real Data, Not Perfect Data

Do not design only for ideal content.

Consider:

```text
Short product name
Very long product name
Missing image
Large image
No rating
Many ratings
No discount
Large discount
Out of stock
Low stock
Long price
Different currency formatting
Very long address
Long error message
Empty result
Hundreds of products
One product
```

The interface should gracefully handle all of these.

---

# 40. Do Not Hide Problems

If something is technically difficult, do not silently create a poor UX solution.

Instead:

1. Identify the limitation.
2. Explain its UX impact.
3. Propose alternatives.
4. Choose the solution that best preserves user experience.

---

# 41. Do Not Overengineer

Premium UX does not require complicated technology.

Prefer:

> Simple + reliable + intuitive

over:

> Complex + impressive + fragile

Every feature should justify its complexity.

---

# 42. Definition of "Modern"

For this project, "modern" means:

* strong visual hierarchy
* clean typography
* intentional whitespace
* refined spacing
* subtle depth
* consistent components
* excellent responsive behavior
* smooth but restrained motion
* clear interaction feedback
* accessible controls
* thoughtful empty/error/loading states
* fast perceived performance
* intuitive navigation
* high-quality micro-interactions

It does NOT mean using every current design trend.

---

# 43. Definition of "Premium"

The storefront should communicate quality through:

* consistency
* precision
* restraint
* typography
* spacing
* image quality
* interaction quality
* performance
* trust
* attention to detail

Premium design comes from **hundreds of small decisions being correct**, not from adding visual effects.

---

# 44. AI Development Rule

If an AI coding agent is being used:

Before modifying UI:

1. Inspect the existing project.
2. Identify the existing design system.
3. Identify reusable components.
4. Identify existing patterns.
5. Identify existing routes/pages.
6. Understand the current architecture.
7. Reuse existing components where appropriate.
8. Do not create duplicate systems.
9. Do not blindly replace existing working UI.
10. Make changes consistent with the existing architecture.

Before creating a new component, search the codebase for an existing equivalent.

---

# 45. Do Not Break Existing Functionality

UI improvements must not accidentally break:

* navigation
* search
* authentication
* cart
* quantity updates
* product selection
* filters
* sorting
* checkout
* forms
* API integration
* existing business logic

Visual improvements must preserve functionality.

---

# 46. No "Looks Good" Without Verification

Do not consider a UI finished simply because it looks good in one screenshot.

A component/page is finished only when:

* it works
* it is responsive
* it is accessible
* its states work
* its edge cases work
* it follows the design system
* it does not break existing functionality
* it performs well
* it has been visually reviewed

---

# 47. Final Quality Bar

Before declaring the storefront complete, ask:

### UX

* Can a new user understand the interface quickly?
* Is the main action obvious?
* Are common tasks easy?
* Are errors recoverable?
* Is unnecessary cognitive load minimized?

### UI

* Is spacing consistent?
* Is typography polished?
* Is hierarchy obvious?
* Are components consistent?
* Does the interface feel premium?

### Responsive

* Does it work on desktop?
* Does it work on tablet?
* Does it work on mobile?
* Are mobile interactions intentionally designed?

### Accessibility

* Can keyboard users operate it?
* Are focus states visible?
* Is contrast sufficient?
* Are controls properly labeled?

### States

* Loading?
* Empty?
* Error?
* Success?
* Disabled?
* Hover?
* Focus?
* Active?

### Performance

* Does it feel fast?
* Are images optimized?
* Are animations restrained?
* Are unnecessary renders avoided?

### Consistency

* Are design tokens being followed?
* Are existing components reused?
* Are patterns consistent across pages?

---

# 48. Final Principle

The most important rule is:

> **Do not design for the developer. Design for the user.**

And:

> **Do not optimize for screenshots. Optimize for the complete experience.**

And:

> **Do not add complexity to make the product look modern. Use simplicity, clarity, consistency, psychology, accessibility, interaction quality and attention to detail to make it feel modern.**

The final storefront should make users feel:

> **"I immediately understand this."**

Then:

> **"This is easy to use."**

Then:

> **"I trust this."**

And finally:

> **"I can complete my purchase without friction."**

That is the standard the implementation should target.
