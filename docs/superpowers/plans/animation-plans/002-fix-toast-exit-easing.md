# Plan 002 — Fix Toast Exit Easing (`ease-in` → Fast-Out)

**Commit at time of audit**: `81596ea`
**Severity**: HIGH | **Effort**: Trivial (1 line) | **Impact**: Medium — every toast dismissal

---

## Problem

[`css/design-system.css` L8518](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css#L8518):

```css
/* CURRENT — WRONG */
.toast-card.leaving {
  animation: toastExit 180ms ease-in forwards;
}
```

`ease-in` = `cubic-bezier(0.42, 0, 1, 1)` — starts slow, ends fast. This is the **only** `ease-in` instance in the entire CSS codebase. When a toast is dismissed, it starts slow then rushes out, feeling janky and startling compared to the premium feel of every other exit. Exit animations should use a fast-out curve: start immediately at full velocity, then decelerate to nothing. `cubic-bezier(0.4, 0, 1, 1)` (Material fast-out) is the canonical exit easing.

Context (L8514–8529):
```css
.toast-card {
  animation: toastEntrance 250ms ease-out forwards;   /* entry is fine */
}
.toast-card.leaving {
  animation: toastExit 180ms ease-in forwards;         /* ← wrong */
}
@keyframes toastExit {
  from { opacity: 1; transform: translateY(0); }
  to   { opacity: 0; transform: translateY(8px); }
}
```

---

## Scope Boundary

- **ONLY** touch `css/design-system.css` line 8518.
- Do NOT touch the `@keyframes toastExit` definition (L8526–8529) — the keyframe values are correct.
- Do NOT touch `.toast-card` entrance animation (L8514) — `ease-out` on entrance is correct.

---

## Steps

**File**: `c:\Users\BS1572\OneDrive - Brain Station 23\Documents\nexcomarch\css\design-system.css`

Locate line 8518:
```css
  animation: toastExit 180ms ease-in forwards;
```

Replace with:
```css
  animation: toastExit 180ms cubic-bezier(0.4, 0, 1, 1) forwards;
```

`cubic-bezier(0.4, 0, 1, 1)` = Material Design "fast-out" / standard exit curve. Starts at full velocity, decelerates to transparent. This matches the perceptual expectation that a dismissed element "flicks away" rather than "creeps then rushes."

---

## Verification

**Feel-check**:
1. Open any page that shows toasts (e.g., add a product to cart on `index.html` or `pages/product.html`).
2. Wait for the toast to auto-dismiss OR click its close button.
3. Expected: toast begins moving immediately and fades out smoothly — no slow start, no rush at the end.
4. DevTools → Animations panel → inspect the `leaving` animation curve. Should show a curve that starts steep (fast) and flattens at the end.
5. Compare entrance (250ms ease-out) vs exit (180ms fast-out) — exit should feel crisper and faster.
