# Plan 009 — Standardize Page Transition Curtain Easing

**Commit at time of audit**: `81596ea`
**Severity**: MEDIUM | **Effort**: Low (global search-and-replace) | **Impact**: Medium — every inter-page navigation

---

## Problem

The page transition curtain (`#pageTransitionOverlay`) is triggered from multiple call-sites across `js/animations.js`. Three different easing strings are used for the same `opacity` transition:

```
L770:   curtain.style.transition = 'opacity 200ms ease';
L1035:  curtain.style.transition = 'opacity 200ms ease';
L1197:  curtain.style.transition = 'opacity 200ms ease';
L1540:  curtain.style.transition = 'opacity 200ms ease';
L1718:  curtain.style.transition = 'opacity 200ms ease';
L2190:  curtain.style.transition = 'opacity 200ms ease';

L2565:  curtain.style.transition = 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)';  ← luxury-out
L3053:  curtain.style.transition = 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)';  ← luxury-out
L3259:  curtain.style.transition = 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)';  ← luxury-out
```

And in `js/animations.js` the reset on bfcache:
```
L111:   curtain.style.transition = 'opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)'; ← different again
```

A page transition curtain is an **exit event** (content fades to black before navigation). The correct easing for exits is fast-out: `cubic-bezier(0.4, 0, 1, 1)`. This starts at full velocity and decelerates — it blacks out fast, reducing the perceived wait time before the browser navigates.

The 180ms bfcache reset is a special case — it's resetting the curtain to transparent on page restore, so it should use a gentle ease-out, not fast-out.

---

## Scope Boundary

- Touch **only** `js/animations.js`.
- Apply the canonical curtain easing to **all** `triggerPageTransition` call-sites.
- The bfcache reset at L111 (`resetPageTransitionCurtain`) must use `'opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)'` (unchanged — this is a reveal, not a block).

---

## Canonical Values

| Event | Easing | Duration |
|---|---|---|
| Navigate away (curtain closes/blocks) | `cubic-bezier(0.4, 0, 1, 1)` | `200ms` |
| Page restore / bfcache reset (curtain reveals) | `cubic-bezier(0.23, 1, 0.32, 1)` | `180ms` |

---

## Steps

**File**: `c:\Users\BS1572\OneDrive - Brain Station 23\Documents\nexcomarch\js\animations.js`

**Step 1** — Global replace all outgoing curtain transitions.

Find every occurrence of:
```js
curtain.style.transition = 'opacity 200ms ease';
curtain.style.transition = 'opacity 200ms cubic-bezier(0.16, 1, 0.3, 1)';
curtain.style.transition = 'opacity 200ms cubic-bezier(0.23, 1, 0.32, 1)';
```

Replace ALL with:
```js
curtain.style.transition = 'opacity 200ms cubic-bezier(0.4, 0, 1, 1)';
```

**Affected lines (verify by content, not just line number):**
L770, L1035, L1197, L1540, L1718, L2190, L2565, L3053, L3259

**Step 2** — Protect the bfcache reset (do NOT change this):
```js
// js/animations.js L111 — KEEP AS-IS
curtain.style.transition = 'opacity 180ms cubic-bezier(0.23, 1, 0.32, 1)';
```

---

## Verification

**Automated**:
```powershell
# Should return 0 (no more mixed curtain easings)
Select-String -Path "js\animations.js" -Pattern "curtain.*transition.*opacity.*ease[^-]|curtain.*transition.*0\.16.*1.*0\.3" | Measure-Object | Select-Object -ExpandProperty Count

# Should return 9 (all outgoing curtain calls unified)
Select-String -Path "js\animations.js" -Pattern "curtain.*transition.*0\.4.*0.*1.*1" | Measure-Object | Select-Object -ExpandProperty Count

# bfcache reset must still exist (should return 1)
Select-String -Path "js\animations.js" -Pattern "0\.23.*1.*0\.32" | Measure-Object | Select-Object -ExpandProperty Count
```

**Feel-check**:
1. Open `index.html`. Click a product card that triggers `triggerPageTransition`.
2. Expected: screen darkens to black immediately (no slow fade-in of the black), then navigates.
3. Use browser back button. Expected: curtain clears with a smooth reveal (the bfcache reset easing).
4. Test across at least 3 different sections: deals card → PDP, curated card → PDP, trust link → category.
