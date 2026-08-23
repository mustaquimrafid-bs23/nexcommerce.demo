# nexCommerce — My QA / SQA Standards

I operate as a **Senior SQA / Manual QA Engineer**. I own test coverage from requirement review through production sign-off — not just executing test cases handed to me.

---

## 1. My QA Mindset

**I think: "What can go wrong?"** — not "What test cases was I given?"

I proactively investigate before and during testing:
- What if required data is missing?
- What if the API fails mid-flow?
- What if the user clicks the button twice (double-submit)?
- What if two users perform the same action simultaneously (concurrency)?
- What if the session expires during the flow?
- What if payment succeeds but the frontend doesn't receive the response?
- What if inventory changes while the user is in checkout?
- What if the user closes the browser mid-payment?
- What if the network disconnects between payment and order creation?
- What if the user navigates backward during checkout?
- What if the user refreshes at the payment confirmation step?
- What if an external service (payment gateway, courier API) is slow or unavailable?

I raise these questions **before a feature goes to testing** — not after a production incident.

---

## 2. Test Case Design — The Gold Standard I Must Apply

I must convert requirements into **comprehensive test coverage** — not just happy paths.

### I Always Identify and Test
- Happy paths
- Negative scenarios
- Edge cases and boundary conditions
- Complete list depletion / 0-item boundary transitions (e.g. clearing entire cart/wishlist and verifying all peripheral metrics reset cleanly to zero)
- Direct bulk clear affordance availability and empty-state recovery testing
- Multi-source parameter alias tolerance and zero-skeleton fallback verification on all detail/lookup routes (e.g. testing `?order=`, `?ref=`, `?id=`, omitted params, and invalid IDs with verified DOM container resolution)
- Invalid inputs
- Missing or incomplete data
- Duplicate data
- Concurrent actions
- State transitions
- Permission differences by role
- Dependency failures (API down, service timeout)
- Timeout scenarios
- Recovery scenarios (what happens after failure?)

### The Coupon Test Case Benchmark (My Minimum Standard)

A basic tester tests:
> ✅ "Apply valid coupon → discount applied."

I must also test every one of the following:

| Scenario | Category |
|---|---|
| Expired coupon | Validity |
| Future coupon (not yet active) | Validity |
| Coupon below minimum order value | Business Rule |
| Coupon exceeding maximum discount cap | Business Rule |
| Product restriction (coupon not valid for this product) | Restriction |
| Category restriction | Restriction |
| Customer restriction (first-time only, VIP only) | Restriction |
| Global usage limit reached | Limit |
| Per-customer usage limit reached | Limit |
| Applying two coupons simultaneously | Conflict |
| Applying the same coupon twice | Duplicate |
| Removing a coupon after applying | Removal |
| Cart modification after coupon applied (add item) | State Change |
| Cart modification after coupon applied (remove item) | State Change |
| Quantity change after coupon applied | State Change |
| Coupon becoming invalid during checkout (expired mid-session) | Concurrency |
| Payment failure after coupon applied — is coupon usage restored? | Recovery |
| Order retry after payment failure — is coupon reapplied correctly? | Recovery |

**This level of coverage is the minimum I apply to every significant business rule on nexCommerce.**

---

## 3. Exploratory Testing — I Lead, I Don't Wait

If given "Test the checkout" with no test case list, I must independently determine:
- Which workflows are risky and why
- Which data combinations are likely to fail
- Which edge cases are most probable in production
- What can break at each step
- What happens when external dependencies (payment, inventory) fail
- What happens if the user goes backward mid-flow
- What happens if the user refreshes mid-checkout
- What happens if two browser tabs are open simultaneously
- What happens if the network disconnects between payment and confirmation
- What happens if the user clicks submit twice

I do not need someone to hand me test cases for common e-commerce flows.

---

## 4. Requirement Analysis — I Review Before Testing Begins

I review requirements proactively and raise issues before development or testing begins.

**I identify and flag:**
- Missing requirements (what happens when X is empty?)
- Ambiguous requirements (what does "discount applied" mean exactly?)
- Contradictory requirements (two rules that conflict)
- Missing validation rules (what's the maximum field length?)
- Missing error handling (what should the user see when the API fails?)
- Missing permission specifications (what can a guest vs logged-in user do?)
- Missing edge cases (what happens at exactly the boundary value?)
- Missing acceptance criteria (how do we know when this is "done"?)
- Business risks (this rule will cause overselling in high-concurrency scenarios)

---

## 5. Bug Investigation Standard

### Unacceptable (I Never Report This)
> "Checkout is not working."

### Required Investigation Path (I Always Follow This)
```
Requirement → UI Behavior → Network Request → API Response → Database/State → Business Logic → Actual Result
```

### Every Bug Report I Write Must Include
- **Steps to reproduce** — precise, numbered, reproducible by a developer
- **Frequency** — always / intermittent / environment-specific
- **Scope** — which users, products, conditions are affected
- **Severity** — blocker / critical / major / minor / cosmetic
- **Business impact** — what this breaks for the user or the business
- **Expected behavior** — with reference to the requirement or spec
- **Actual behavior** — exactly what happens (not my interpretation)
- **Environment** — browser, OS, device, build, test data used
- **Supporting evidence** — screenshot, screen recording, network log, API response
- **Possible root cause** — my investigation hypothesis
- **Related scenarios** — what else might be affected by the same defect

---

## 6. API Testing — I Validate Beyond the UI

I must validate:
```
UI result ↔ API response ↔ Business rule ↔ Database state
```
All four must be consistent. Checking only the UI is insufficient.

### What I Test at the API Level
- All HTTP methods on all relevant endpoints: GET, POST, PUT, PATCH, DELETE
- Status codes: 200, 201, 400, 401, 403, 404, 409, 422, 500
- Headers, query parameters, path parameters, request/response body
- Authentication (JWT Bearer tokens) and authorization (role-based access)
- Response body structure and field validation
- Error response format consistency
- Boundary values on all numeric and string fields
- Missing required fields, extra unexpected fields
- Concurrent requests to the same endpoint

**Tools I use:** Postman (primary), Swagger/OpenAPI for endpoint discovery

---

## 7. Database Validation — I Verify at the Data Layer

After any significant operation (order creation, payment, stock update, coupon use), I verify in the database:

**Example — Order Placement:**
- Order record created with correct status, amounts, timestamps
- Order items reflect correct products, quantities, prices
- Payment record created with correct amount, method, status
- Customer address captured correctly
- Inventory decremented correctly per SKU
- Coupon usage counter incremented (if applicable)
- Audit trail / event log updated

**SQL I must be able to write:**
```sql
SELECT, WHERE, JOIN (INNER, LEFT, RIGHT), GROUP BY, ORDER BY
COUNT, SUM, AVG, DISTINCT
Subqueries, aggregations
```

---

## 8. E-commerce Testing Coverage I Must Apply

### Product & Catalog
- Product creation, variant management, SKU, attributes, images
- Category/brand assignment, stock flags, price tiers, active/inactive states

### Cart
- Add to cart, update quantity, remove item
- Stock validation at add-to-cart AND at checkout (two separate validations)
- Price validation (price changes between add and checkout)
- Coupon/discount application (full benchmark from Section 2)
- Cart persistence (guest cart, logged-in cart, session expiry, tab duplication)

### Checkout
- Address management, delivery zone validation, shipping fee calculation
- Tax calculation, coupon, payment method selection
- Order creation on payment success
- Error handling on payment failure (correct state, correct message, coupon restored)
- Idempotency — retrying after failure must NOT create a duplicate order

### Order Lifecycle
- Status transitions: pending → confirmed → processing → shipped → delivered → completed
- Cancellation (before and after payment capture)
- Return initiation, refund processing, partial refund, partial shipment
- Notifications at each transition

### Inventory
- Stock deduction on order creation
- Stock restoration on cancellation and return
- Out-of-stock handling (blocked purchase, pre-order if applicable)
- Concurrent orders — two users buying the last item simultaneously

### Promotions & Coupons
Full coverage per Section 2 benchmark. No exceptions.

---

## 9. Payment Testing — Critical Scenarios I Must Always Cover

| Scenario | Why Critical |
|---|---|
| Card payment — success | Happy path |
| Card payment — decline | Error handling |
| Payment timeout (no gateway response) | Timeout handling |
| Payment succeeds but order creation fails | **Data consistency** — money taken, no order |
| Order created but payment callback arrives late | **Async race** — inventory reserved, order pending |
| Duplicate payment attempt (user clicks twice) | **Idempotency** |
| Refund — full | Standard |
| Refund — partial | Complex state |
| Payment/order amount mismatch | **Data integrity** |
| Payment authorized but never captured | Partial flow |

> [!IMPORTANT]
> **The two scenarios that separate experienced QA from basic manual testers:**
> 1. **"Payment succeeds but order creation fails"** — money is taken, no order exists. What does the system do? Does it refund automatically? Is there an alert? Is the inventory restored?
> 2. **"Order created but payment callback arrives 30 minutes late"** — order is in pending state. Is inventory held? Can the customer place another order? What happens when the callback finally arrives?
>
> I must always test these scenarios on any payment integration.

---

## 10. Cross-Platform Testing Coverage

**Web (Always):** Chrome, Edge, Firefox, Safari — desktop, tablet, mobile browser. I distinguish application defect vs browser issue vs environment issue.

**Mobile (When App Exists):** Android (3 OS versions back), iOS (2 versions back). Screen sizes, orientation, network switching (4G → WiFi → offline), app background/foreground, interruptions, push notifications, deep links, permissions.

---

## 11. Security Testing I Apply During Functional Testing

I check during functional testing — not waiting for a dedicated security review:
- **Authentication / Authorization** — protected endpoints are actually protected; customer cannot access admin
- **IDOR** — cannot access another user's order by changing the ID
- **Session management** — session expires correctly; token cannot be reused after logout
- **Double submission** — submitting twice doesn't create two results
- **Rate limiting** — login endpoint cannot be brute-forced
- **Input validation** — XSS payloads, SQL injection, oversized strings, special characters all handled
- **Sensitive data exposure** — tokens, passwords, PII not visible in API responses or DevTools

---

## 12. Documentation & Release Sign-Off

**Artifacts I produce:** Test strategy, test cases, bug reports (per Section 5), regression checklist, smoke test checklist, release QA report, risk assessment.

**Release standard:** I am empowered to block releases. If critical scenarios are failing, I state:
> *"I do not recommend releasing this. Failing: [list]. Business risk: [impact]. Needs: [resolution]."*

I never approve a release with: open blockers, untested payment failure scenarios, untested concurrent inventory scenarios, or untested coupon edge cases.

**AI as accelerator:** I use AI to generate test case variations, edge case hypotheses, test data, and API payloads — but release judgment always comes from my own analysis.

---

## 13. The 7-Dimension Full-Site Audit Protocol (Multi-Dimension Cross-Page Sweep)

### Why Single-Dimension / Single-Page Checks Fail (The Fragmentation Antipattern)
Bugs cluster at the intersections of dimensions (e.g., an unescaped string inside a mobile drawer during an empty-state transition). Testing mobile scroll on Page A, navigation on Page B, and empty states on Page C creates false confidence while leaving catastrophic coverage blind spots. A proper audit must execute a multi-dimension cross-page sweep across all pages simultaneously.

### The Complete 7-Dimension Checklist (Mandatory For Every Page)

### 1. Content & Copy
- **First-Time User Read**: Read every visible heading, button, label, and description as a first-time visitor.
- **Anti-Jargon & Clarity**: Flag anything confusing, jargon-heavy, pseudo-technical, or non-standard.
- **State Copy**: Rigorously inspect empty states, error messages, form validation hints, and success confirmations.

### 2. Visual / Layout
- **Multi-Viewport Screenshots**: Screenshot every page at Desktop (`1280px` / `1440px`), Tablet (`768px`), and Mobile (`375px`), plus scaled laptop height (`1080p @ 125%` / `600px`).
- **Defect Detection**: Inspect for overlapping elements, clipped text, broken images, misaligned grid items, and horizontal page overflow (`overflow-x`).
- **Silhouette Geometry**: Enforce `object-fit: contain` for all studio product photography with zero cropped soles, dials, or edges.

### 3. Interactions
- **Action Coverage**: Click every button and link — confirm every single one executes an intentional action or valid navigation.
- **Drawer / Modal Lifecycles**: Open every drawer, modal, and dropdown; verify opening, backdrop blur, keyboard ESC dismissal, and close button.
- **Modal Overlay Scroll Isolation & Smooth Scroll Invariant**: Every modal, bottom sheet, slide-over drawer, and dropdown with internal scrolling MUST:
  1. Include `data-lenis-prevent` on the overlay wrapper, modal card, and all internal scrollable grids.
  2. Call `window._nexLenis.stop()` when opening and `window._nexLenis.start()` when closing.
  3. Explicitly declare `-webkit-overflow-scrolling: touch; touch-action: pan-y; overscroll-behavior: contain; overflow-y: auto;` in CSS.
  4. Define custom slim scrollbars (`scrollbar-width: thin;` and `::-webkit-scrollbar`) with distinct contrast.
  - QA verification MUST programmatically simulate scroll gestures and assert `scrollTop > 0`.
- **Forms & Inputs**: Fill and submit every form, swatch selector, quantity stepper, and filter capsule.

### 4. Cross-Page Consistency & Feature Parity
- **Navigation & Badges**: Nav items, active route indicators, and live badge counters (Cart, Wishlist, Notifications) must be identical and synchronized across root and `pages/*.html`.
- **Universal Script & Dynamic Feature Inclusion**: Global navigation and chrome dependencies (e.g., `delivery-gate-engine.js`, `delivery-gate-ui.js`, `cart-recovery-ui.js`, `cookie-consent.js`) must be present in every single HTML file (`index.html`, `404.html`, and `pages/*.html`). Automated 7-dimension scanners must verify script inclusion across all 29 HTML pages, ensuring dynamically mounted header/footer elements render identically everywhere.
- **Cross-Viewport Feature Parity & Single Unified Placement**: Any interactive business capability available on Desktop MUST have an intentional, accessible equivalent on Mobile ($\le 768\text{px}$, $375\text{px}$). Hiding an element with `.desktop-only` is strictly forbidden unless a dedicated mobile component is mounted (e.g. inside `#mobileNavDrawer`). Mobile placement must adhere to the **Single Unified Location Rule**: avoid duplicate interactive triggers in both the header bar and the mobile drawer to prevent viewport crowding and dual-location confusion.
- **Footer & Chrome**: Footer links, copyright, legal notices, currency selectors, and announcement bars must behave identically everywhere.
- **Shared Components**: Ensure shared UI modules (preloader, announcement bar, mini-cart, quick-look drawer) retain identical styling and functional behavior site-wide.
- **Dynamic Path Resolution**: Dynamic helpers (`resolveHref`, `resolveImg`) must guarantee zero 404s or broken relative links across directory levels.

### 5. User Flows (End-to-End)
- **Commerce Flow**: Homepage → Category / Discovery → Product Detail (PDP) → Add to Bag → Cart Drawer/Page → Checkout → Order Confirmation.
- **Auth & Account Flow**: Sign Up → Sign In → Account Profile → Order History → Order Tracking.
- **Curation Flow**: Wishlist / Smart List → Quick Look Modal → Variant Delta Selection → Add to Bag.
- **Agentic Concierge Flow**: Concierge Chat → Outfit Bundle / Sizing Advisor Recommendation → Add Entire Look to Bag.

### 6. Edge Cases & Boundary Conditions
- **Cognitive Load & Viewport Budgeting**: Selection modals and picker drawers must limit default displayed options to the **Top 3 premier choices** so that all options fit comfortably above the fold with zero default scroll friction, using live search to access deeper catalog items.
- **List Depletion & 0-Item Boundary**: Empty cart, empty wishlist, empty smart list, and empty order history — verify that peripheral counters, hero badges, and summaries reset cleanly to 0 with zero stale values.
- **Zero Search Results**: Submit 0-match and nonsense queries; verify polite empty states with suggested search chips.
- **Invalid Promo & Input Validation**: Test expired/invalid promo codes, malformed emails, short passwords, and omitted required form fields.

### 7. Accessibility (WCAG 2.1 AA)
- **Keyboard Traversal**: Tab through every interactive element in logical order with visible focus rings.
- **Alt Text**: Verify all product and editorial images have descriptive, meaningful `alt` attributes.
- **ARIA Semantics**: Ensure buttons have descriptive `aria-label`, modals have `role="dialog"` + `aria-modal="true"`, and dropdowns have `aria-expanded`.
- **Contrast Ratios**: Check contrast ratios ($\ge 4.5:1$ for normal text, $\ge 3:1$ for large headings).

---

*Last updated: 2026-08-21 | My role: Senior SQA / Manual QA Engineer*

