# Plan 005 — Remove Dead `requestParallaxTick` Functions

**Commit at time of audit**: `81596ea`
**Severity**: HIGH (code hygiene / rAF loop risk) | **Effort**: Trivial | **Impact**: Low (cleanup prevents future regressions)

---

## Problem

`js/animations.js` contains 5 function definitions that are **never called** anywhere in the codebase. Each defines a local `requestAnimationFrame` dispatch loop. If any future developer accidentally calls one, it spawns a parallel rAF chain that competes with the unified `_nexParallaxUpdaters` dispatcher:

```
L497:  function requestParallaxTick()  { … }  — in initCuratedDepartmentsMotion
L826:  function requestParallaxFrame() { … }  — in initDealsSectionMotion
L986:  function requestParallaxTick()  { … }  — in initIntentCardMotion
L1149: function requestParallaxTick()  { … }  — in initCuratedGridMotion
L1312: function requestParallaxTick()  { … }  — in initMicroMerchClusterMotion
```

These are leftovers from before the `_nexParallaxUpdaters` architecture was introduced. The sections already correctly use `window._nexParallaxUpdaters.push(…)` immediately after the dead function definition.

---

## Scope Boundary

- Touch **only** `js/animations.js`.
- Remove **only** these 5 dead function bodies (the `function` keyword through the closing `}`).
- Do NOT remove the `window._nexParallaxUpdaters.push(…)` calls that follow each dead function — those are the correct registration.
- Do NOT touch any `pxTicking` boolean declarations within the same function scope (they may still be referenced by the actual updater function closures).
- Do NOT remove or rename any `update*Parallax()` function.

---

## Exact Removals

**Note**: Use the line numbers below as reference points. Confirm each block by reading the surrounding context before deleting.

### 1. Dead function in `initCuratedDepartmentsMotion` (~L497–502)

```js
// REMOVE THIS ENTIRE BLOCK:
function requestParallaxTick() {
  if (!ticking) {
    requestAnimationFrame(updateBidirectionalParallax);
    ticking = true;
  }
}
```

The line `window._nexParallaxUpdaters.push(updateBidirectionalParallax);` that follows must be **kept**.

---

### 2. Dead function in `initDealsSectionMotion` (~L826–831)

```js
// REMOVE THIS ENTIRE BLOCK:
function requestParallaxFrame() {
  if (!pxTicking) {
    requestAnimationFrame(updateDealsParallax);
    pxTicking = true;
  }
}
```

The line `window._nexParallaxUpdaters.push(updateDealsParallax);` that follows must be **kept**.

---

### 3. Dead function in `initIntentCardMotion` (~L986–991)

```js
// REMOVE THIS ENTIRE BLOCK:
function requestParallaxTick() {
  if (!pxTicking) {
    requestAnimationFrame(updateIntentParallax);
    pxTicking = true;
  }
}
```

The line `window._nexParallaxUpdaters.push(updateIntentParallax);` that follows must be **kept**.

---

### 4. Dead function in `initCuratedGridMotion` (~L1149–1154)

```js
// REMOVE THIS ENTIRE BLOCK:
function requestParallaxTick() {
  if (!pxTicking) {
    requestAnimationFrame(updateCuratedParallax);
    pxTicking = true;
  }
}
```

The line `window._nexParallaxUpdaters.push(updateCuratedParallax);` that follows must be **kept**.

---

### 5. Dead function in `initMicroMerchClusterMotion` (~L1312–1317)

```js
// REMOVE THIS ENTIRE BLOCK:
function requestParallaxTick() {
  if (!pxTicking) {
    requestAnimationFrame(updateMicroParallax);
    pxTicking = true;
  }
}
```

The line `window._nexParallaxUpdaters.push(updateMicroParallax);` that follows must be **kept**.

---

## Verification

**Automated**:
```powershell
# Should return 0 after this plan is complete
Select-String -Path "js\animations.js" -Pattern "function requestParallaxTick|function requestParallaxFrame" | Measure-Object | Select-Object -ExpandProperty Count
```

**Regression check**:
```powershell
# These push() calls must still exist (should return 5)
Select-String -Path "js\animations.js" -Pattern "_nexParallaxUpdaters\.push" | Measure-Object | Select-Object -ExpandProperty Count
```

**Feel-check**: Open `index.html` and scroll through all homepage sections. All parallax effects (bento cards, deals, intent, curated, micro-merch) must still animate correctly. No visual difference expected.
