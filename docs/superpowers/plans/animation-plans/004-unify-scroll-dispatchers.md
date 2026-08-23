# Plan 004 — Migrate Page-Level Scroll Listeners into Unified rAF Dispatcher

**Commit at time of audit**: `81596ea`
**Severity**: HIGH | **Effort**: Low (refactor 6 functions) | **Impact**: High — prevents parallel rAF chains on 6 pages

---

## Problem

`js/animations.js` attaches 6 separate `window.addEventListener('scroll', …)` listeners for page-level parallax sections, each maintaining its own `pxTicking` boolean and spawning its own `requestAnimationFrame` chain:

```
L1939: window.addEventListener('scroll', requestHeaderTick, { passive: true });
L2087: window.addEventListener('scroll', requestPLPParallaxTick, { passive: true });
L2285: window.addEventListener('scroll', requestWishlistParallaxTick, { passive: true });
L2465: window.addEventListener('scroll', requestDiscoveryParallaxTick, { passive: true });
L2951: window.addEventListener('scroll', requestCartParallaxTick, { passive: true });
L3171: window.addEventListener('scroll', requestContactParallaxTick, { passive: true });
```

The homepage correctly uses a unified dispatcher (L131–143):
```js
window._nexParallaxUpdaters = [];
window._nexRequestParallax = function() {
  if (!_nexPxTicking) {
    _nexPxTicking = true;
    requestAnimationFrame(() => {
      window._nexParallaxUpdaters.forEach(fn => fn());
      _nexPxTicking = false;
    });
  }
};
window.addEventListener('scroll', window._nexRequestParallax, { passive: true });
```

The 6 page-level functions bypass this, creating up to 7 simultaneous rAF chains on pages where both the homepage sections and page sections exist, or competing listeners when navigating.

---

## Scope Boundary

- Touch **only** `js/animations.js`.
- Migrate the 6 updater functions into `window._nexParallaxUpdaters`.
- Remove the 6 redundant `window.addEventListener('scroll', …)` calls.
- Remove the 6 local `pxTicking` booleans and local `requestXxxTick` wrapper functions.
- The actual parallax calculation functions (e.g., `updateHeaderParallax`, `updatePLPParallax`, etc.) must **not** be renamed — only how they are registered changes.
- Lenis `.on('scroll', …)` registrations that exist alongside the scroll listeners must also be migrated.

---

## Steps

### Pattern (apply to each of the 6 functions below)

**BEFORE** (example — `initCategoryPageMotion`):
```js
// js/animations.js L2077
function requestPLPParallaxTick() {
  if (!pxTicking) {
    requestAnimationFrame(updatePLPParallax);
    pxTicking = true;
  }
}

if (window._nexLenis) {
  window._nexLenis.on('scroll', requestPLPParallaxTick);
}
window.addEventListener('scroll', requestPLPParallaxTick, { passive: true });
```

**AFTER**:
```js
// Delete requestPLPParallaxTick entirely.
// Delete the local `let pxTicking = false;` declaration.
// Replace with:
window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
window._nexParallaxUpdaters.push(updatePLPParallax);
```

> Note: `window._nexParallaxUpdaters` is guaranteed to exist if `initAllMotion()` ran (L131). The `|| []` guard handles pages that include `animations.js` without calling `initAllMotion()` (e.g., standalone page-only loads).

---

### 1. `initGlobalHeaderMotion` (L1915–1939)

**Remove**:
```js
// L1916
let pxTicking = false;
// L1929
function requestHeaderTick() {
  if (!pxTicking) {
    requestAnimationFrame(updateHeaderParallax);
    pxTicking = true;
  }
}
// L1936
if (window._nexLenis) {
  window._nexLenis.on('scroll', requestHeaderTick);
}
window.addEventListener('scroll', requestHeaderTick, { passive: true });
```

**Add after `function updateHeaderParallax() { … }` closing brace**:
```js
window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
window._nexParallaxUpdaters.push(updateHeaderParallax);
```

---

### 2. `initCategoryPageMotion` / `updatePLPParallax` (L2077–2087)

**Remove**:
```js
let pxTicking = false;
function requestPLPParallaxTick() {
  if (!pxTicking) {
    requestAnimationFrame(updatePLPParallax);
    pxTicking = true;
  }
}
if (window._nexLenis) {
  window._nexLenis.on('scroll', requestPLPParallaxTick);
}
window.addEventListener('scroll', requestPLPParallaxTick, { passive: true });
```

**Add**:
```js
window._nexParallaxUpdaters = window._nexParallaxUpdaters || [];
window._nexParallaxUpdaters.push(updatePLPParallax);
```

---

### 3. `initWishlistPageMotion` / `updateWishlistParallax` (L2275–2285)

Same pattern: remove `pxTicking`, `requestWishlistParallaxTick`, and both listener registrations. Add `window._nexParallaxUpdaters.push(updateWishlistParallax)`.

---

### 4. `initDiscoverySearchPageMotion` / `updateDiscoveryParallax` (L2455–2465)

Same pattern: remove `pxTicking`, `requestDiscoveryParallaxTick`, listeners. Add push.

---

### 5. `initCartPageMotion` / `updateCartParallax` (L2941–2951)

Same pattern: remove `pxTicking`, `requestCartParallaxTick`, listeners. Add push.

---

### 6. `initContactPageMotion` / `updateContactParallax` (L3161–3171)

Same pattern: remove `pxTicking`, `requestContactParallaxTick`, listeners. Add push.

---

## Verification

**Automated**:
```powershell
# Should return 1 (only the unified dispatcher at L142)
Select-String -Path "js\animations.js" -Pattern "window\.addEventListener\('scroll'" | Measure-Object | Select-Object -ExpandProperty Count
```

**Feel-check**:
1. Open `pages/wishlist.html`. Scroll the page. Open DevTools Performance → Record 2 seconds of scrolling.
2. In the flame chart, verify only ONE rAF chain fires per scroll event (no parallel `requestAnimationFrame` stacks).
3. Repeat on `pages/cart.html` and `pages/category.html`.
4. Verify parallax movement still works visually on all 6 pages.
