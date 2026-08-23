# Plan 003 — Replace `transition: all` with Specific Properties

**Commit at time of audit**: `81596ea`
**Severity**: HIGH | **Effort**: Large (systematic, ~131 instances) | **Impact**: High — eliminates layout thrash on every hover state

---

## Problem

`transition: all` in `css/design-system.css` (83 instances) and page HTML `<style>` blocks (~48 instances) transitions **every CSS property** including layout-triggering ones (`width`, `height`, `padding`, `font-size`, `border-width`). On high-frequency hover events this causes:
- Invisible layout repaints even when only `transform` or `color` changes
- Compositor-layer pollution (non-compositable properties get promoted accidentally)
- Hard-to-debug performance regressions as the site grows

The easing on these is also wrong (`ease`) — but Plan 001 fixes the token values. This plan fixes the `all` property scope.

---

## Scope Boundary

- Touch **only** `transition: all` declarations in `css/design-system.css` and the page HTML files listed below.
- Do NOT touch `transition` declarations that already specify explicit properties (e.g., `transition: transform 200ms ease, opacity 200ms ease`).
- Do NOT touch `animation:` declarations or `@keyframes`.
- Do NOT touch inline JS `el.style.transition = …` (separate concern).

**Files in scope**:
1. `css/design-system.css` — 83 instances
2. `pages/wishlist.html` — inline `<style>` block
3. `pages/smart-list.html` — inline `<style>` block
4. `pages/signin.html` — inline `<style>` block
5. `pages/signup.html` — inline `<style>` block
6. `pages/tracking.html` — inline `<style>` block
7. `pages/size-guide.html` — inline `<style>` block

---

## Replacement Rulebook

For each `transition: all Xms Y` occurrence, determine what properties actually change on hover/focus/active, then list only those. Use this decision table:

| Selector type | Typically-changing properties | Replacement pattern |
|---|---|---|
| Button / CTA | background-color, border-color, transform, box-shadow | `transition: background-color Xms Y, border-color Xms Y, transform Xms Y, box-shadow Xms Y` |
| Nav link / text link | color, opacity | `transition: color Xms Y, opacity Xms Y` |
| Icon button | transform, background-color | `transition: transform Xms Y, background-color Xms Y` |
| Form input / textarea | border-color, box-shadow, background-color | `transition: border-color Xms Y, box-shadow Xms Y, background-color Xms Y` |
| Card / panel | transform, box-shadow, border-color | `transition: transform Xms Y, box-shadow Xms Y, border-color Xms Y` |
| Badge / tag | background-color, color, border-color | `transition: background-color Xms Y, color Xms Y, border-color Xms Y` |
| Overlay / backdrop | opacity | `transition: opacity Xms Y` |
| Progress bar | transform (scaleX) | `transition: transform Xms Y` |

**After Plan 001 is applied**, the duration/easing values `180ms ease` and `300ms ease` become correct cubic-beziers via the token. If Plan 001 is not yet applied, keep the original duration values but replace easing with the appropriate cubic-bezier inline.

---

## Steps — design-system.css

Work through the file top-to-bottom. For each `transition: all` occurrence:

1. Read the selector name to determine the element type.
2. Consult the decision table above.
3. Replace `transition: all Xms Y` with the specific property list.

**High-priority occurrences to fix first** (highest-frequency UI):

```
L995:   .nav-link, .nav-item-link (or similar) — transition: all 180ms ease
L1016:  nav button/icon — transition: all 180ms ease
L1112:  form input — transition: all 180ms ease
L1165:  CTA button — transition: all 220ms ease
L1245:  card/panel — transition: all 200ms ease
L1349:  badge/tag — transition: all 180ms ease
L1377:  dropdown item — transition: all 180ms ease
L1451:  overlay — transition: all 180ms ease
L1481:  icon btn — transition: all 180ms ease
L1547:  filter pill — transition: all 180ms ease
L1830:  product card — transition: all 180ms ease
L1855:  product card action — transition: all 180ms ease
```

---

## Steps — Page HTML Files

Each page HTML file has inline `<style>` blocks. Search for `transition: all` within each file and apply the same decision table.

Example from `pages/wishlist.html` L201:
```css
/* BEFORE */
transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

/* AFTER (if this is a card action button) */
transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1),
            background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1),
            opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1);
```

---

## Verification

**Automated** (run after changes):
```powershell
# Should return 0 after this plan is complete
Select-String -Path "css\design-system.css","pages\wishlist.html","pages\smart-list.html","pages\signin.html","pages\signup.html","pages\tracking.html","pages\size-guide.html" -Pattern "transition: all" | Measure-Object | Select-Object -ExpandProperty Count
```

**Feel-check**:
1. Open `index.html`. Enable DevTools → Performance → Record. Hover rapidly over 10 nav items and 5 product cards.
2. In the flame chart, verify no `Layout` or `Style Recalc` spikes appear on hover events — only `Paint` or `Composite Layers` (or nothing).
3. Repeat for `pages/cart.html` and `pages/wishlist.html`.
