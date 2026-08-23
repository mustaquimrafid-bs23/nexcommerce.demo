# Plan 006 — Fix `will-change: bottom, right` on Hero Hotspot

**Commit at time of audit**: `81596ea`
**Severity**: MEDIUM | **Effort**: Trivial (1 line) | **Impact**: Low — removes a wasted compositor layer

---

## Problem

[`css/design-system.css` L9859](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css#L9859):

```css
.hero-3d-hotspot-wrap {
  will-change: transform, opacity, bottom, right;   /* ← WRONG */
  transition: bottom 400ms cubic-bezier(0.16, 1, 0.3, 1),
              right 400ms cubic-bezier(0.16, 1, 0.3, 1),
              opacity 300ms ease;
}
```

`bottom` and `right` are **layout properties** — they trigger `Layout` + `Paint` + `Composite` in the browser rendering pipeline. Listing them in `will-change` does NOT make them GPU-compositable; the browser cannot promote layout properties to compositor layers. The hint is silently ignored for those two values, while still consuming a compositor layer slot (limited system resource).

The `transition: bottom/right` on L9860 is also suboptimal but acceptable for the hotspot which moves infrequently on resize. The `will-change` fix is the surgical change here.

---

## Scope Boundary

- **ONLY** touch `css/design-system.css` line 9859.
- Do NOT touch the `transition:` declaration on L9860 (leave `bottom`/`right` transitions as-is — they are fine for infrequent repositioning).
- Do NOT touch any other `.hero-3d-hotspot-wrap` property.

---

## Steps

**File**: `c:\Users\BS1572\OneDrive - Brain Station 23\Documents\nexcomarch\css\design-system.css`

Locate line 9859:
```css
  will-change: transform, opacity, bottom, right;
```

Replace with:
```css
  will-change: transform, opacity;
```

---

## Verification

**Automated**:
```powershell
Select-String -Path "css\design-system.css" -Pattern "will-change:.*bottom" | Measure-Object | Select-Object -ExpandProperty Count
# Expected: 0
```

**Feel-check**: Open `index.html`. The floating shoppable look capsule in the hero must still appear, position correctly, and fade in/out as before. No visual change expected.
