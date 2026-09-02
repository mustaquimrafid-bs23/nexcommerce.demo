# Terms & Conditions (`/terms`) Migration & Elevation Plan

## Overview
Migrate and elevate the **Terms & Conditions (`/terms`)** page to Next.js 15 App Router with 100% feature and visual parity with `feature/storefront-elevation`, natural UK English copy (zero AI buzzwords), uniform luxury obsidian radial background, and sticky ScrollSpy navigation.

---

## Proposed Changes

### Part 1: Automated Test Suite for Terms (`tests/test-terms-page.js`)
- Assert UK English headings (*"Terms & Conditions"*, *"Client Charter · European Standards"*, *"14-Day Right to Cancel & Returns"*).
- Assert all 6 articles and Table of Contents items.
- Assert uniform obsidian background gradient.

### Part 2: Table of Contents & Scroll-Spy (`components/terms/TermsScrollSpy.tsx`)
- Active scroll-spy tracking intersecting viewport positions.
- Smooth jump-scrolling on click.
- Mobile horizontal scrollable pill bar.

### Part 3: Elevated Articles & Model Cancellation Drawer (`app/terms/page.tsx`)
- Article 01: Scope of Agreement & Handcrafted Quality
- Article 02: Ordering, Confirmation & Authenticity
- Article 03: Pricing, VAT Transparency & Delivery
- Article 04: 14-Day Right to Cancel & Returns (EU & UK statutory period)
- Article 05: Intellectual Property & Authenticity Guarantees
- Article 06: Governing Law & Online Dispute Resolution
- Client Services Advisory Desk bridge card triggering `useConciergeStore`.
- Uniform luxury radial gradient background: `radial-gradient(circle at 50% 0%, #031838 0%, #011126 50%, #000B1A 100%)`.

### Part 4: Production Build & 7-Dimension SQA Verification
- Verify `npm run build` with 0 errors across all routes.
- Capture live browser screenshots on Desktop (`1440x900`) and Mobile (`375x812`).
- Validate touch targets $\ge 44\text{px}$ and smooth scrolling.
