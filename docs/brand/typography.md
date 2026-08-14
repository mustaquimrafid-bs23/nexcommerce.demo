# Typography System — nexCommerce v1.0

## 1. Typeface Roles & Pairing (§7.1, §7.2)

### Display & Hero Typeface: **Outfit**
- **Typeface**: `'Outfit', system-ui, -apple-system, sans-serif`
- **Why Selected**: Shares the exact rounded geometric letterforms of the official `nexCommerce` wordmark, ensuring headlines and brand logos read as one cohesive typographic system.
- **Weights**: `500` (Medium), `600` (SemiBold), `700` (Bold), `800` (ExtraBold).
- **Usage**: Hero statements, major section titles, modal headers, campaign banners.

### UI & Body Typeface: **Work Sans**
- **Typeface**: `'Work Sans', 'Inter', system-ui, -apple-system, sans-serif`
- **Why Selected**: Highly legible grotesque sans-serif with open apertures and clean numerals, optimized for responsive e-commerce interfaces.
- **Weights**: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold).
- **Usage**: Body copy, contextual "Why this fits" explanations, navigation links, buttons, form inputs, prices, and metadata.

### Editorial Accent Typeface: **Cormorant Garamond**
- **Typeface**: `'Cormorant Garamond', Georgia, serif`
- **Usage**: High-fashion editorial lookbook callouts, italics, and luxury curation titles.

---

## 2. Type Hierarchy Scale (§7.3)

| Level | Desktop Size | Line Height | Weight | Letter Spacing | Font Family |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero H1** | `56px – 72px` | `1.04` | `600 / 700` | `-0.02em` | `Outfit` |
| **Section H2** | `36px – 44px` | `1.15` | `600` | `-0.015em` | `Outfit` |
| **Card Title H3** | `20px – 26px` | `1.25` | `600` | `-0.01em` | `Outfit` |
| **Body Large** | `16px – 18px` | `1.6` | `400` | `0` | `Work Sans` |
| **Body Regular** | `14px – 15px` | `1.5` | `400` | `0` | `Work Sans` |
| **Small UI / Meta** | `12px – 13px` | `1.4` | `500` | `0.02em` | `Work Sans` |
| **Eyebrow Label** | `10px – 12px` | `1.2` | `600 / 700` | `0.16em – 0.18em` | `Work Sans` (All-Caps) |
| **Price Token** | `14px – 18px` | `1.2` | `600` | `0.02em` | `Work Sans` (`BDT [amount]`) |
