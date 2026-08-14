# Component Guidelines — nexCommerce v1.0

## 1. Buttons & CTAs (§11.1)

### Primary Button (`.btn-primary-commerce`, `.btn-brand-accent`)
- **Visuals**: Brand Pink-to-Crimson Gradient (`linear-gradient(135deg, #F13365, #E60C45)`) or Crisp Pure White (`#F8FAFF`) with Royal Navy text.
- **Used For**:
  - `START SHOPPING`
  - `ADD TO BAG`
  - `PROCEED TO CHECKOUT`
  - `PLACE ORDER`
- **Behavior**: Subtle scale `transform: translateY(-1px)`, gentle crimson glow elevation on hover.

### Secondary Button (`.btn-secondary-outline`)
- **Visuals**: Dark/transparent surface with `1px solid rgba(255, 255, 255, 0.14)` border.
- **Used For**: Secondary choices (`Describe what I need`, `Filter`, `Continue Shopping`).

### Text CTA (`.link-text-nav`)
- **Visuals**: Clean text link with `&rarr;` glyph in Cyan (`#3DE0FF`) or Off-White (`#F8FAFF`).
- **Used For**: `View all collections &rarr;`, `Explore &rarr;`.

---

## 2. Standard Product Card Architecture (§12)

Every product card must follow this exact semantic blueprint:

```
┌────────────────────────────────────────────────────────┐
│ [✦ AI MATCH]                                      [ ♡ ]│
│                                                        │
│                     PRODUCT IMAGE                      │
│                  (Aspect-Ratio 1/1)                    │
│                                                        │
├────────────────────────────────────────────────────────┤
│ CATEGORY (Work Sans, 10px, Upper, Muted)               │
│ Product Name (Outfit SemiBold, 16px, Primary White)   │
│ Price: BDT 18,400 (Work Sans, 14px, White)            │
│                                                        │
│ Why it fits:                                           │
│ "Contextual human-readable reason for match."          │
│                                                        │
│ [ 🛍 ADD TO BAG ] (Full-width / Hover-active CTA)      │
└────────────────────────────────────────────────────────┘
```

### Card Requirements:
1. **Studio Photography**: Clean studio background with natural drop shadows.
2. **Wishlist Heart**: SVG stroke-based icon with active crimson fill state (`.product-card-wishlist.active`).
3. **No Badge Stacking**: At most ONE badge per card (`✦ AI MATCH` or `✦ NEW DROP`).
4. **Currency Safety**: Prices strictly formatted as `BDT [amount]` (e.g., `BDT 18,400`).
