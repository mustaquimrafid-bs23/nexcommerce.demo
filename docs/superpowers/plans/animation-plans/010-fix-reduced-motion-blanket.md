# Plan 010 — Fix Reduced-Motion Blanket `transform: none !important`

**Commit at time of audit**: `81596ea`
**Severity**: MEDIUM | **Effort**: Trivial (1 line removed) | **Impact**: Accessibility — affects all reduced-motion users

---

## Problem

[`css/design-system.css` L666–673](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css#L666):

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
    transform: none !important;    /* ← DANGEROUS */
  }
}
```

The `transform: none !important` rule zeroes **every transform** on the page — including:
- JS-written inline `style.transform = 'translateY(Xpx)'` final-state positions that `animations.js` commits via `commitStyles()` as static position offsets.
- CSS-positioned elements that use `transform` for centering or layout (e.g., `translateX(-50%)` centering patterns).
- 3D perspective containers that rely on `translateZ(0)` for stacking context.

For reduced-motion users, this can cause elements to stack at their CSS-origin positions (top-left by default) rather than their intended positions, breaking layout.

The other rules (`animation-duration: 0.01ms`, `transition-duration: 0.01ms`) are correct and sufficient to disable motion without breaking layout. Individual component `@media (prefers-reduced-motion: reduce)` blocks in the CSS (L4933, L11546, L12207, L12607, L13008, L13760, L16035) handle specific cases correctly.

---

## Scope Boundary

- Touch **only** `css/design-system.css` lines 666–673.
- Remove **only** the `transform: none !important;` line (line 672).
- Do NOT touch any other line in this `@media` block.
- Do NOT touch any of the 7 component-level `@media (prefers-reduced-motion: reduce)` blocks elsewhere in the file.

---

## Steps

**File**: `c:\Users\BS1572\OneDrive - Brain Station 23\Documents\nexcomarch\css\design-system.css`

Locate lines 666–673:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
    transform: none !important;
  }
}
```

Remove line 672 (`transform: none !important;`). Result:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## Verification

**Automated**:
```powershell
# Should return 0 after this plan
Select-String -Path "css\design-system.css" -Pattern "transform: none !important" | Measure-Object | Select-Object -ExpandProperty Count
```

**Accessibility feel-check** (requires OS setting):
1. Enable "Reduce Motion" in OS (Windows: Settings → Accessibility → Visual Effects → Animation Effects OFF).
2. Open `index.html`. Scroll through all sections.
3. Expected: All elements appear in their correct positions. No elements stacked in the top-left corner or mispositioned.
4. Open `pages/cart.html`, `pages/wishlist.html`, `pages/about.html`. Verify layout is intact.
5. Verify no animations or transitions fire (they should all resolve in 0.01ms).
6. Disable OS reduced-motion → animations should resume normally.
