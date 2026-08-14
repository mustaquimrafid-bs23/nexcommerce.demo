# Color System & Palette Standards — nexCommerce v1.0

## 1. Authoritative Color Values (§5.1)
Sampled directly from official brand assets and codified in `css/design-system.css`:

| Role | Token Name | Hex Value | RGB / HSL | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Brand Navy (Primary)** | `--brand-navy` | `#003371` | `rgb(0, 51, 113)` | The official wordmark royal navy |
| **Deep Navy (Base)** | `--bg-main` | `#012148` | `rgb(1, 33, 72)` | Primary page background base |
| **Deepest Navy** | `--bg-deep` | `#001838` | `rgb(0, 24, 56)` | Navigation header and footer base |
| **Surface Navy** | `--bg-surface` | `#0A2A54` | `rgb(10, 42, 84)` | Product cards, drawers, and modal panels |
| **Surface Hover** | `--bg-surface-hover` | `#0E366B` | `rgb(14, 54, 107)` | Interactive surface hover states |
| **Accent Pink** | `--accent-pink` | `#F13365` | `rgb(241, 51, 101)` | Top of signature checkmark gradient |
| **Accent Crimson / Red** | `--accent-crimson` | `#E60C45` | `rgb(230, 12, 69)` | Tip of signature checkmark gradient / Single hero accent |
| **Signature Gradient** | `--accent-gradient` | `linear-gradient(135deg, #F13365, #E60C45)` | — | `AI MATCH` badges, bag counters, active carousel pills |
| **Secondary Cyan** | `--accent-cyan` | `#3DE0FF` | `rgb(61, 224, 255)` | Eyebrow labels, focus indicators, ambient hairlines |
| **Electric Blue** | `--accent-electric`| `#4F8CFF` | `rgb(79, 140, 255)` | Supporting secondary accent |
| **Text Primary** | `--text-primary` | `#F8FAFF` | `rgb(248, 250, 255)` | Primary headlines, titles, and body |
| **Text Secondary** | `--text-secondary` | `#D8DEE9` | `rgb(216, 222, 233)` | Subtitles, contextual explanations, metadata |
| **Text Muted** | `--text-muted` | `#8FA2BE` | `rgb(143, 162, 190)` | Captions, breadcrumbs, search placeholders |

---

## 2. Visual Balance Ratio (§5.2)
To maintain an ultra-premium, restrained aesthetic, every screen must follow this distribution:

```
┌─────────────────────────────────────────────────────────┐
│ Navy / Deep Navy Surface Base               70% – 80%   │
│ White / Soft Off-White Text & Panels        15% – 20%   │
│ Pink / Crimson Signature Accent              5% – 8%    │
│ Semantic / Cyan Highlights                  < 2%        │
└─────────────────────────────────────────────────────────┘
```

> **Key Invariant:** Brand Pink / Crimson is strictly an **accent**. It must never dominate large background fields or overwhelm the commerce experience.

---

## 3. Semantic Colors (§6)
Semantic colors communicate system state without replacing the core brand palette:

- **Success**: `#34D399` (Successful order completion, added to bag confirmation)
- **Warning**: `#FBBF24` (Low stock warning, delivery alert)
- **Error**: `#E60C45` (Validation error, failed payment — uses brand crimson)
- **Info**: `#3DE0FF` (Informational notice, shipping ETA updates)
- **Discount / Sale**: `#F13365` (Member discount pill)
