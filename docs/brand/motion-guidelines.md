# Motion & Interaction Guidelines — nexCommerce v1.0

## 1. Motion Philosophy (§21)
Motion in nexCommerce is:
> **Smooth · Subtle · Premium · Natural**

Animation must always communicate **state, hierarchy, continuity, or interaction feedback**. Never add animation merely for decorative spectacle.

---

## 2. Motion Rules & Use Cases

### Default: CSS Transitions
Use pure CSS transitions for simple interactive feedback:
- Hover states (`opacity`, `transform: translateY(-1px)`, `box-shadow`)
- Focus rings and outline transitions
- Button color and elevation changes

### Motion Library / GSAP for Complex Sequences
Use Javascript motion engines for:
- Hero lookbook carousel rotation and dot transitions
- Off-canvas drawers (Style Concierge, Mini-Cart, Mobile Navigation)
- Scroll reveal triggers (`inView` progressive entrance)
- Dynamic filter state updates and search modal overlays

---

## 3. Standard Animation Tokens (§22)
```css
/* Duration Tokens */
--motion-fast:   150ms cubic-bezier(0.25, 1, 0.5, 1);
--motion-normal: 250ms cubic-bezier(0.25, 1, 0.5, 1);
--motion-panel:  350ms cubic-bezier(0.16, 1, 0.3, 1);
--motion-hero:   600ms cubic-bezier(0.16, 1, 0.3, 1);
```

---

## 4. Reduced Motion Support (§22, §23)
Always include accessibility overrides:
```css
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```
