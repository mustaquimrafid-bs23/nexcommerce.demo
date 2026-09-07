# Plan 007 — Fix Countdown Digit Flip `ease-in` Exit

**Commit at time of audit**: `81596ea`
**Severity**: MEDIUM | **Effort**: Trivial (1 line) | **Impact**: Medium — fires every second on the Today's Deals countdown

---

## Problem

[`js/home.js` L457](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/js/home.js#L457):

```js
function flipUnit(el, newVal) {
  if (!el || el.textContent === newVal) return;
  // ↓ WRONG — ease-in on exit makes the digit slow then rush
  el.style.transition = 'transform 120ms ease-in, opacity 120ms ease-in';
  el.style.transform  = 'translateY(-4px)';
  el.style.opacity    = '0';
  setTimeout(() => {
    el.textContent = newVal;
    // ↓ entry is correct: ease-out / spring
    el.style.transition = 'transform 160ms cubic-bezier(0.23,1,0.32,1), opacity 160ms ease-out';
    el.style.transform  = 'translateY(0)';
    el.style.opacity    = '1';
  }, 130);
}
```

The **exit phase** (`ease-in`) fires every second for three countdown digits simultaneously. `ease-in` starts slow and accelerates, so the digit lingers then rushes out — the opposite of expected. An exiting element should start at full velocity and decelerate out (`cubic-bezier(0.4, 0, 1, 1)` = fast-out).

The **entry phase** (`cubic-bezier(0.23,1,0.32,1)`) is correct and must not change.

---

## Scope Boundary

- Touch **only** `js/home.js` line 457.
- Do NOT touch the `setTimeout` entry phase (line 462).
- Do NOT touch `initDealsCountdown` function structure.

---

## Steps

**File**: `c:\Users\BS1572\OneDrive - Brain Station 23\Documents\nexcomarch\js\home.js`

Locate line 457 (inside `flipUnit`):
```js
  el.style.transition = 'transform 120ms ease-in, opacity 120ms ease-in';
```

Replace with:
```js
  el.style.transition = 'transform 120ms cubic-bezier(0.4, 0, 1, 1), opacity 120ms cubic-bezier(0.4, 0, 1, 1)';
```

`cubic-bezier(0.4, 0, 1, 1)` = Material Design "Fast-out" / standard exit easing. The digit begins moving at full velocity and decelerates to transparent — matches the perceptual expectation that something being replaced "flicks away."

---

## Verification

**Feel-check**:
1. Open `index.html` (homepage). Locate the Today's Deals section with the live countdown.
2. Watch 3 seconds of ticking. 
3. Expected: each digit exits by immediately snapping upward and fading — no slow creep before the motion. The entry (slide-in from below) should feel springy as before.
4. DevTools → Animations panel: inspect the `flipUnit` transition. The exit curve should show a steep start, flat end.
5. For slow-motion inspection: temporarily change `120ms` to `800ms` in the exit line, observe, then revert.
