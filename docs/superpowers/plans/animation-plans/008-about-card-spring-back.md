# Plan 008 — Add Spring-Back to About Page Card Tilt

**Commit at time of audit**: `81596ea`
**Severity**: MEDIUM | **Effort**: Low (add LERP loop) | **Impact**: Medium — all pillar/artisan/ledger cards on about.html

---

## Problem

[`js/animations.js` L3327–3348](file:///c:/Users/BS1572/OneDrive%20-%20Brain%20Station%2023/Documents/nexcomarch/js/animations.js#L3327):

```js
// CURRENT — ABOUT PAGE (initAboutPageMotion)
card.addEventListener('mousemove', (e) => {
  const rotateX = ((y - centerY) / centerY) * -5.5;
  const rotateY = ((x - centerX) / centerX) * 5.5;
  card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
  card.style.setProperty('--about-glare-x', `${x}px`);
  card.style.setProperty('--about-glare-y', `${y}px`);
});

card.addEventListener('mouseleave', () => {
  // ← WRONG: instant snap to zero, no inertia
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
});
```

On `mouseleave` the card snaps rigidly to zero — no spring-back inertia. Every other card in the codebase (deals, curated grid, trust strip, recently-viewed, PLP, wishlist, discovery, contact, cart, sign-in) uses the standard LERP spring-back `requestAnimationFrame` loop with `lerp factor 0.16`. The about page breaks that consistent tactile language.

---

## Scope Boundary

- Touch **only** `js/animations.js` within the `initAboutPageMotion` function body (approx L3292–3349).
- Replace the `cards.forEach(card => { … })` block entirely.
- Do NOT change any `animate()` stagger entrance calls above (L3299–3322).
- Do NOT touch any other function.

---

## Steps

**File**: `c:\Users\BS1572\OneDrive - Brain Station 23\Documents\nexcomarch\js\animations.js`

Locate the cards tilt block (approx L3326–3348):

```js
  // CURRENT — to be replaced entirely:
  const cards = document.querySelectorAll('.about-pillar-card, .artisan-card, .ledger-stat-card');
  cards.forEach(card => {
    if (card._hasTiltBound) return;
    card._hasTiltBound = true;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5.5;
      const rotateY = ((x - centerX) / centerX) * 5.5;

      card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;
      card.style.setProperty('--about-glare-x', `${x}px`);
      card.style.setProperty('--about-glare-y', `${y}px`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
    });
  });
```

Replace with:

```js
  // REPLACEMENT — LERP spring-back loop (matches standard codebase pattern)
  const MAX_TILT = 5.5;
  const lerp = (a, b, t) => a + (b - a) * t;

  const cards = document.querySelectorAll('.about-pillar-card, .artisan-card, .ledger-stat-card');
  cards.forEach(card => {
    if (card._hasTiltBound) return;
    card._hasTiltBound = true;

    let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0, rafId = null;

    function applyTilt() {
      curTX = lerp(curTX, tgtTX, 0.12);
      curTY = lerp(curTY, tgtTY, 0.12);
      card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(8px)`;
      if (Math.abs(curTX - tgtTX) > 0.01 || Math.abs(curTY - tgtTY) > 0.01) {
        rafId = requestAnimationFrame(applyTilt);
      } else {
        rafId = null;
      }
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = (x - rect.width  / 2) / (rect.width  / 2);
      const dy = (y - rect.height / 2) / (rect.height / 2);
      tgtTX = -(dy * MAX_TILT);
      tgtTY =  (dx * MAX_TILT);
      card.style.setProperty('--about-glare-x', `${x}px`);
      card.style.setProperty('--about-glare-y', `${y}px`);
      if (!rafId) rafId = requestAnimationFrame(applyTilt);
    });

    card.addEventListener('mouseleave', () => {
      tgtTX = 0; tgtTY = 0;

      function springBack() {
        curTX = lerp(curTX, 0, 0.16);
        curTY = lerp(curTY, 0, 0.16);
        card.style.transform = `perspective(1000px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(0px)`;
        if (Math.abs(curTX) > 0.02 || Math.abs(curTY) > 0.02) {
          rafId = requestAnimationFrame(springBack);
        } else {
          card.style.transform = '';
          rafId = null;
        }
      }
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(springBack);
    });
  });
```

**Key differences from current code**:
- `translateY(-4px)` hardcoded lift removed → replaced with `translateZ(8px)` for compositor-only depth lift (avoids layout).
- `mouseleave` now runs the standard spring-back LERP loop (LERP factor `0.16`, threshold `0.02`) matching all other card types.
- `tgtTX`/`tgtTY` normalized via `(pos / half-dimension)` for consistent ±5.5° range regardless of card size.

---

## Verification

**Feel-check**:
1. Open `pages/about.html`.
2. Hover over a pillar card, move mouse to far corner. Move mouse away rapidly.
3. Expected: card settles back with fluid inertia — tilts back toward zero and gently comes to rest. No snap.
4. Compare feel with a curated product card on `index.html` (same LERP factor) — should feel identical.
5. Enable OS reduced-motion → tilt must not activate (the `prefersReduced` guard at L3296 already covers this — verify it runs before the cards block).
