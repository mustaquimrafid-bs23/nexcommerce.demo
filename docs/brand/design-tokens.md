# Design Tokens Specification — nexCommerce v1.0

## 1. Spacing Scale (§8)
Based on an 8px base rhythm. Never use arbitrary pixel margins.

```css
--space-1:   4px;
--space-2:   8px;
--space-3:  12px;
--space-4:  16px;
--space-6:  24px;
--space-8:  32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
--space-20: 80px;
--space-24: 96px;
--space-30: 120px;
```

---

## 2. Border Radius Scale
```css
--radius-sm:    6px;   /* Small controls, badges, chips */
--radius-input: 8px;   /* Form inputs, search fields */
--radius-md:   10px;   /* Standard product cards */
--radius-lg:   16px;   /* Large panels, modals, drawers */
--radius-pill: 9999px; /* Status tags, AI Match pills */
```

---

## 3. Motion & Animation Timing (§22)
```css
--motion-fast:   150ms cubic-bezier(0.25, 1, 0.5, 1); /* Hover, active states */
--motion-normal: 250ms cubic-bezier(0.25, 1, 0.5, 1); /* Dropdowns, fades */
--motion-panel:  350ms cubic-bezier(0.16, 1, 0.3, 1); /* Side drawers, modals */
--motion-hero:   600ms cubic-bezier(0.16, 1, 0.3, 1); /* Hero transitions */
```

---

## 4. Shadow & Elevation System
```css
--shadow-soft:     0 12px 40px rgba(0, 0, 0, 0.25);
--shadow-floating: 0 20px 60px rgba(0, 0, 0, 0.38);
--shadow-crimson:  0 4px 16px rgba(230, 12, 69, 0.45);
--shadow-cyan:     0 0 16px rgba(61, 224, 255, 0.20);
```

---

## 5. Accessibility Minimum
```css
--touch-target-min: 44px; /* Minimum tappable touch target */
```
