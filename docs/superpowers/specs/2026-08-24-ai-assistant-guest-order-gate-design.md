# AI Assistant Guest Order Guard & Member Gatekeeper Specification

## 1. Business Objective
Restrict order placement and checkout execution via the AI Assistant (Style Concierge & Voice Assistant) to authenticated users only. Unauthenticated guest visitors attempting to place an order or initiate assistant-driven checkout will receive a dedicated in-drawer Member Gatekeeper Card with a direct sign-in CTA and demo login option, preventing guest order authorization while keeping discovery features accessible.

## 2. User Journey & Experience
1. **Guest User Initiates Order**:
   - Guest says *"place an order"*, *"order my bag"*, *"buy this look"*, *"checkout with voice"*, or clicks an order demo chip.
   - The AI Concierge Engine checks `NexAuth.isLoggedIn()`.
   - If not signed in, the engine blocks the order flow from progressing to address/payment/confirmation, and returns an `order_auth_required` response.
2. **In-Drawer Member Gatekeeper Card**:
   - The assistant renders a luxury glassmorphic card explaining that order placement requires authentication for security, private member pricing, and tracking.
   - Provides a 1-click **"SIGN IN TO COMPLETE ORDER"** CTA button linking to `signin.html?next=checkout.html`.
   - Provides a **"Sign in with Demo Client"** interactive chip for seamless instant demo access.
3. **Authenticated User**:
   - Authenticated members proceed through the full 4-step conversational order workflow seamlessly.

## 3. Architecture & Key Changes
- **`js/concierge-engine.js`**:
   - Add authentication guard checks to the order flow triggers and authorization handlers.
   - Return `order_auth_required` response when unauthenticated.
- **`js/concierge.js`**:
   - Add `renderOrderAuthRequiredWidget(payload)`.
   - Handle `'Sign in with Demo Client'` chip action to authenticate via `NexAuth.signIn()` and immediately resume order flow.
- **`tests/test-concierge-engine.js`**:
   - Add regression tests asserting guest order blocking and authenticated order pass-through.
- **`tests/test-cart-auth-guard.js`**:
   - Add tests validating AI assistant guest order protection.

## 4. Verification Plan
- Unit tests with simulated guest vs authenticated sessions in `tests/test-concierge-engine.js`.
- Automated test run with `node tests/run-all-tests.js`.
- Live browser test in Playwright testing:
  1. Guest asking to place an order in the concierge drawer $\rightarrow$ Member Gatekeeper card rendered.
  2. Signing in with Demo Client $\rightarrow$ Ordering unlocked and operational.
