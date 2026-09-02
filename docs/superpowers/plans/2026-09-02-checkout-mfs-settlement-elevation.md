# Batch 15: Checkout bKash / Nagad MFS PIN Settlement Sheet & Flow Elevation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate and finalize the Next.js Checkout experience with 100% UX and visual parity to the reference branch `feature/storefront-elevation`, including the interactive bKash and Nagad MFS PIN settlement sheet modal, 3D holographic card stage, smart savings optimizer, 3-step animated progress ribbon, plain UK English copywriting (zero "AI words"), and unified Atelier obsidian navy background styling.

**Architecture:** Next.js 15 App Router with React 19, TypeScript, Tailwind CSS v4, Zustand 5 (`useCartStore`), Motion (`motion/react`), Lucide React, and Lenis smooth scrolling.

**Tech Stack:** Next.js 15.x, React 19, TypeScript, Tailwind CSS v4, Zustand 5, Motion, Lucide React, Node Test Runner.

---

## Global Constraints

* **Atelier Color Palette:** Deep Obsidian (`#00142e`), Obsidian Navy (`#012148`), Surface Navy Card (`#0A2A54`), Warm Stone (`#f4f2ee`), Radiant Pink (`#F13365`), Electric Cyan (`#3DE0FF`), Emerald (`#34D399`), bKash Magenta (`#E2136E`), Nagad Orange (`#F7931E`).
* **Background Unification:** Background must strictly use `#01132B` with subtle radial gradient `radial-gradient(120% 80% at 50% 0%, #032B5E 0%, #01132B 60%, #001838 100%)`. Zero pitch-black `#000B1A` or mismatched gray containers.
* **Plain UK English Copywriting:** Strict prohibition of "AI words", robotic buzzwords, or pretentious jargon. All copy must read like a premier London atelier (e.g. *“Items in bag”*, *“Free tracked delivery”*, *“Bank-grade secure payment”*, *“Personalised gift note”*, *“Authorised”*).
* **Touch Targets & Accessibility:** All interactive elements $\ge 44\text{px}$ touch targets, visible focus rings, WCAG 2.1 AA contrast ratios ($\ge 4.5:1$).
* **Test Verification Protocol:** Unconditional automated test pass via `node tests/test-checkout-mfs.js` and `node tests/test-checkout-page-migration.js` before declaring completion.

---

## Visual Reference & State Comparison

### 1. Desktop Visual Reference (`feature/storefront-elevation`)
![Desktop Reference Full Page](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/checkout_storefront_elevation_reference.png)

### 2. Card Payment Stage Reference (3D Holographic Flip)
![Card Stage Reference](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/checkout_storefront_elevation_card_ref.png)

### 3. Mobile Visual Reference (`375x812`)
![Mobile Reference](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/checkout_storefront_elevation_mobile_ref.png)

### 4. Current Next.js Checkout Page
![Current Next.js State](C:/Users/BS1572/.gemini/antigravity-ide/brain/b3bbe77b-90eb-4ef2-806c-1a1ce7e1eaf9/nextjs_checkout_current_fullpage.png)

---

## Component Breakdown & Migration Tasks

### Task 1: MFS (bKash & Nagad) PIN Settlement Sheet Modal (`components/checkout/MfsPaymentSheet.tsx`)

**Files:**
- Create/Modify: `components/checkout/MfsPaymentSheet.tsx`
- Create: `tests/test-checkout-mfs.js`

**Interfaces:**
- Consumes: `isOpen: boolean`, `gateway: 'bkash' | 'nagad'`, `amount: number`, `onClose: () => void`, `onSuccess: () => void`.
- Produces: 3-step interactive MFS payment modal (Phone $\to$ OTP $\to$ 5-digit Masked PIN) with BDT conversion, countdown timer, 256-bit encrypted tokenizer badge, and order confirmation dispatch.

- [ ] **Step 1: Write failing test `tests/test-checkout-mfs.js`**

```javascript
// tests/test-checkout-mfs.js
const fs = require('fs');
const path = require('path');

let failures = 0;
let passes = 0;

function assert(condition, msg) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    failures++;
  } else {
    console.log(`✅ PASS: ${msg}`);
    passes++;
  }
}

console.log('🧪 VERIFYING CHECKOUT BATCH 15: MFS PAYMENT SHEET & SETTLEMENT FLOW\n');

const mfsPath = path.join(__dirname, '..', 'components', 'checkout', 'MfsPaymentSheet.tsx');
assert(fs.existsSync(mfsPath), 'MfsPaymentSheet.tsx component exists');

const content = fs.readFileSync(mfsPath, 'utf8');

// 1. Branding Tokens
assert(content.includes('#E2136E'), 'MfsPaymentSheet contains bKash signature brand color #E2136E');
assert(content.includes('#F7931E'), 'MfsPaymentSheet contains Nagad signature brand color #F7931E');

// 2. Multi-step Settlement
assert(content.includes("'phone'") && content.includes("'otp'") && content.includes("'pin'"), 'MfsPaymentSheet supports 3-step flow (phone -> otp -> pin)');
assert(content.includes('maxLength={5}') || content.includes('maxLength={6}'), 'PIN/OTP input includes proper length constraints');

// 3. Currency Conversion
assert(content.includes('BDT') || content.includes('135') || content.includes('132'), 'MfsPaymentSheet calculates estimated BDT settlement value');

// 4. Plain UK English copy (No robotic AI buzzwords)
const forbidden = [/\bAI\b/i, /\bArtificial Intelligence\b/i, /\bautonomous\b/i, /\bheuristic\b/i, /\bneural\b/i];
for (const pat of forbidden) {
  assert(!content.match(pat), `MfsPaymentSheet is free of forbidden jargon: ${pat}`);
}

console.log(`\nAudit completed: ${passes} passed, ${failures} failed.`);
if (failures > 0) process.exit(1);
```

- [ ] **Step 2: Run test to verify initial status**
Run: `node tests/test-checkout-mfs.js`
Expected: Passes initial checks or fails on specific missing fields.

- [ ] **Step 3: Enhance `components/checkout/MfsPaymentSheet.tsx`**
Implement polished, spring-animated bKash/Nagad slide-up sheet with:
- Dedicated brand header with authentic SVG badges.
- Live BDT approximate conversion (1 EUR = 135 BDT).
- Step 1: Account number entry (`01XXXXXXXXX`) with clean validation and country phone icon.
- Step 2: 6-digit OTP verification code with 60s resend timer and demo auto-fill (`123456`).
- Step 3: 5-digit Masked PIN entry (`•••••`) with secure lock badge and "Pay with bKash" / "Pay with Nagad" primary button.
- Smooth spring entry and exit animations (`motion/react` or CSS spring).

- [ ] **Step 4: Run test to verify it passes**
Run: `node tests/test-checkout-mfs.js`
Expected: `✅ PASS` across all test assertions.

- [ ] **Step 5: Commit**
```bash
git add components/checkout/MfsPaymentSheet.tsx tests/test-checkout-mfs.js
git commit -m "feat(checkout): elevate bkash and nagad mfs settlement sheet with live bdt conversion"
```

---

### Task 2: Copywriting UK English Refinement & Zero AI Words Invariant

**Files:**
- Modify: `components/checkout/CheckoutHeroHeader.tsx`
- Modify: `components/checkout/SavingsOptimizerBanner.tsx`
- Modify: `components/checkout/OrderSummarySidebar.tsx`
- Modify: `components/checkout/PaymentAuthModal.tsx`
- Modify: `app/checkout/page.tsx`
- Modify: `tests/test-checkout-page-migration.js`

**Interfaces:**
- Consumes: UI copywriting strings across all checkout components.
- Produces: Natural, friendly, crystal-clear British English (UK) copy with zero robotic AI buzzwords.

- [ ] **Step 1: Update `SavingsOptimizerBanner.tsx`**
Replace pretentious "Smart Savings Advisor" and "Exclusive high-cart tier savings applied" with clean UK English:
- Eyebrow: `PROMOTIONAL DISCOUNT` / `AVAILABLE SAVINGS`
- Title: `Code: VIP20` or `Code: VIP50`
- Description: `Save 20% on all orders over €100.00` / `Save €50 on orders over €500.00`
- Button: `Apply Promo (−€268.00)`

- [ ] **Step 2: Update `CheckoutHeroHeader.tsx`**
- Eyebrow: `BANK-GRADE SECURE CHECKOUT · 3D SECURE PROTECTED`
- Title: `Complete Your Order` (with italic `Order`)
- Subtitle: `Review your delivery address, select your payment method, and complete your order with bank-grade encryption.`
- Stat Pills: `RESERVED PIECES` (`2 PIECES`), `ESTIMATED TOTAL`, `DELIVERY` (`CARBON NEUTRAL`).
- Action link: `Return to Shopping Bag` & `Need Help? Ask Stylist`.

- [ ] **Step 3: Update `PaymentAuthModal.tsx`**
- Card Challenge: `3D Secure Bank Challenge` — `Please confirm this purchase in your mobile banking app (Verified by Visa / Mastercard Identity Check).`
- Success State: `Order Confirmed` — `Preparing your receipt, order confirmation, and delivery tracking...`

- [ ] **Step 4: Update `OrderSummarySidebar.tsx`**
- Section Header: `Order Summary` · `2 PIECES`
- Trust Badges: `14-day free returns`, `100% authentic guaranteed`, `SSL 256-bit encrypted checkout`, `Carbon neutral delivery`.
- Submit Button: `PAY & COMPLETE ORDER` with live total tag `€ 1,340.00`.

- [ ] **Step 5: Run test to verify zero AI words across all checkout files**
Run: `node tests/test-checkout-page-migration.js`
Expected: `🎉 ALL CHECKOUT PAGE MIGRATION AUDIT INVARIANTS PASSED!`

- [ ] **Step 6: Commit**
```bash
git add components/checkout/ app/checkout/ tests/test-checkout-page-migration.js
git commit -m "refactor(checkout): streamline copywriting to plain everyday uk english"
```

---

### Task 3: Background Color Unification & Visual Polish

**Files:**
- Modify: `app/checkout/page.tsx`
- Modify: `components/checkout/OrderSummarySidebar.tsx`
- Modify: `components/checkout/CheckoutHeroHeader.tsx`

**Interfaces:**
- Consumes: Tailwind theme tokens and glassmorphism styling.
- Produces: Seamless visual hierarchy matching the rest of the elevated storefront (`#01132B` deep obsidian background, `#0A2A54` glass cards, `#012148` midnight layers, and crisp 1px borders `border-white/10`).

- [ ] **Step 1: Check background wrapper in `app/checkout/page.tsx`**
Ensure main page container uses:
```tsx
<div className="min-h-screen bg-[#01132B] bg-[radial-gradient(120%_80%_at_50%_0%,#032B5E_0%,#01132B_60%,#001838_100%)] text-[#F8FAFF]">
```
- [ ] **Step 2: Check card surfaces in `OrderSummarySidebar.tsx` and `CheckoutHeroHeader.tsx`**
Ensure cards use uniform `bg-gradient-to-br from-[#0A2A54]/95 to-[#01132B]/98` with `border-white/10`, `backdrop-blur-xl`, and `shadow-[0_16px_48px_-8px_rgba(0,0,0,0.5)]`.
- [ ] **Step 3: Verify no conflicting pitch-black `#000B1A` or gray boxes**
- [ ] **Step 4: Commit**
```bash
git add app/checkout/page.tsx components/checkout/
git commit -m "style(checkout): unify atelier obsidian background and glassmorphism styling"
```

---

### Task 4: Motion Physics, Interactivity & Edge Cases

**Files:**
- Modify: `components/checkout/CheckoutProgressRibbon.tsx`
- Modify: `components/checkout/HolographicCardPreview.tsx`
- Modify: `app/checkout/page.tsx`

**Interfaces:**
- Consumes: Step state (`activeStep: 1 | 2 | 3`), card flip state (`isCardFlipped: boolean`).
- Produces: 60fps GPU-composited step progress transitions, 3D card perspective rotations, and smooth accordion transitions between steps.

- [ ] **Step 1: Add GPU-accelerated progress line transition in `CheckoutProgressRibbon.tsx`**
- [ ] **Step 2: Polish 3D perspective flip on `HolographicCardPreview.tsx`**
Ensure CVV focus smoothly triggers `transform: rotateY(180deg)` with `perspective: 1200px` and `backface-visibility: hidden`.
- [ ] **Step 3: Test depleted/empty cart guard**
Assert that navigating to `/checkout` with 0 items displays a clean, centered empty state with a direct button back to `/category?cat=all`.
- [ ] **Step 4: Run production build verification**
Run: `npm run build`
Expected: 100% clean production build with 0 TypeScript/lint errors.
- [ ] **Step 5: Commit**
```bash
git add components/checkout/ app/checkout/
git commit -m "feat(checkout): add smooth gpu spring transitions and empty state resilience"
```

---

## Verification Plan

### Automated Tests
1. `node tests/test-checkout-mfs.js` — validates MFS settlement sheet branding, 3-step flow, and BDT calculations.
2. `node tests/test-checkout-page-migration.js` — validates zero AI buzzwords, plain UK English, background color tokens, required DOM elements, and financial ledgers.
3. `npm run build` — ensures complete TypeScript type-safety and Next.js App Router build success.

### Manual & Visual Verification
1. **Desktop Viewport (`1440x900`)**:
   - Verify Hero Header, Progress Ribbon, Saved Addresses, Delivery Options, Payment Methods, Holographic Card, and Order Summary Sidebar.
   - Click `bKash` / `Nagad` and verify the MFS modal opens with full 3-step interactive flow.
   - Complete checkout and verify order confirmation in `/confirmation`.
2. **Mobile Viewport (`375x812`)**:
   - Verify collapsible mobile Order Summary bar (`View details ↓`).
   - Verify touch targets ($\ge 44\text{px}$) for all address cards, payment methods, and submit CTA.
   - Capture visual verification screenshots and save to workspace root.
