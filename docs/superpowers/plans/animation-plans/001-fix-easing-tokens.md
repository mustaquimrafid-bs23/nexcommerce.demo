# Plan 001 — Fix Easing Tokens (`--transition-fast` / `--transition-panel`)

**Commit at time of audit**: `81596ea`
**Severity**: HIGH | **Effort**: Trivial (2 lines) | **Impact**: High — fixes 83+ transitions site-wide

---

## Problem

[`css/design-system.css` L114–115](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/css/design-system.css#L114):

```css
/* CURRENT — WRONG */
--transition-fast:  180ms ease;
--transition-panel: 300ms ease;
```

`ease` = `cubic-bezier(0.25, 0.1, 0.25, 1)` — symmetric S-curve. On high-frequency UI (buttons, tabs, badges, icon hovers) this reads sluggish: the acceleration phase pushes motion to mid-timeline instead of snapping immediately to the new state. Every other motion token in the codebase uses luxury-out cubic-beziers. These two tokens are the outliers affecting ~83 `transition: all 180ms ease` rules.

---

## Scope Boundary

- **ONLY** touch `css/design-system.css` lines 114–115.
- Do NOT touch any selector, keyframe, or animation rule.
- Do NOT touch `--ease-luxury` or any `--motion-*` token (those are already correct).

---

## Steps

**File**: `c:\Users\BS1572\OneDrive - Brain Station 23\Documents\nexcomarch\css\design-system.css`

Locate lines 114–115 (current code context):
```
112: /* Standard Transitions & Motion Tokens (§22, §30) */
113: --ease-luxury:      cubic-bezier(0.25, 1, 0.5, 1);
114: --transition-fast:  180ms ease;
115: --transition-panel: 300ms ease;
116: --motion-fast:      150ms cubic-bezier(0.25, 1, 0.5, 1);
```

Replace lines 114–115 with:
```css
--transition-fast:  180ms cubic-bezier(0.25, 1, 0.5, 1);
--transition-panel: 300ms cubic-bezier(0.16, 1, 0.3, 1);
```

**Rationale**:
- `--transition-fast` → `cubic-bezier(0.25, 1, 0.5, 1)` matches `--ease-luxury` and `--motion-fast`. Snappy onset, luxury deceleration for micro-interactions.
- `--transition-panel` → `cubic-bezier(0.16, 1, 0.3, 1)` matches `--motion-panel`. Aggressive ease-out for drawers/panels.

---

## Verification

**Feel-check** (open `index.html` in Chrome):
1. Hover rapidly over nav buttons, category pills, product card quick-add buttons, and form inputs.
2. Expected: hover-in/out feels instantly snappy, no sluggish "warming up" in the first 60ms.
3. DevTools → Animations panel → slow to 10% — the curve should decelerate hard after the first quarter, not uniformly.
4. Enable OS reduced-motion → all transitions must stay inert (global blanket at design-system.css L666).
