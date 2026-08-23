# Cart Authentication Guard & Protected Route Specification

## 1. Overview & Business Goal
Ensure that the Shopping Bag / Cart page (`pages/cart.html`) is a protected route within the nexCommerce storefront. Unauthenticated guest visitors attempting to access the cart page (either by direct navigation, URL entry, or clicking cart triggers) must be redirected to the sign-in portal (`pages/signin.html?next=cart.html`), and upon successful authentication, returned immediately to their shopping bag with all items preserved.

## 2. User Experience Flow
1. **Unauthenticated Visit Attempt**:
   - A guest user navigates to `cart.html`.
   - The page immediately checks the client session state (`nex_session` via `NexAuth.isLoggedIn()`).
   - If not authenticated, the user is immediately redirected to `signin.html?next=cart.html`.
2. **Contextual Sign-In Portal**:
   - `signin.html` detects the `next=cart.html` parameter and presents a subtle editorial prompt ("Sign in to access your shopping bag").
   - User signs in via email/password, 1-Click Quick Demo Client, or Social SSO.
3. **Seamless Return**:
   - After authentication, the user is redirected back to `cart.html`.
   - All cart items in `localStorage.getItem('nex_cart')` remain intact and render instantly.

## 3. Architecture & Key Changes
- **`pages/cart.html`**:
  - Add early head guard to prevent UI flash before asset loading.
  - Add standard `NexAuth.requireAuth();` script tag before `</body>` to match protected pages (`profile.html`, `account.html`).
- **`pages/signin.html`**:
  - Add contextual feedback banner/toast when `next=cart.html` or `next` is present.
  - Verify redirect resolution correctly handles relative paths for subpages.
- **`tests/test-cart-auth-guard.js`**:
  - Automated test verifying static guard presence, redirect URL generation, and session validation.

## 4. Verification & QA Plan
- Automated unit and functional test run via Node.js.
- Browser test validating:
  1. Guest access to `pages/cart.html` redirects to `pages/signin.html?next=cart.html`.
  2. Signing in with Quick Demo Client logs in and navigates to `pages/cart.html`.
  3. Logged-in session allows normal cart viewing, item modifications, and checkout progression.
