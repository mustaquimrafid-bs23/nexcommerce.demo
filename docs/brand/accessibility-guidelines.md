# Accessibility Guidelines (WCAG 2.1 AA) — nexCommerce v1.0

## 1. Core Principles (§23)
Brand aesthetics must never override accessibility standards. Every customer, regardless of device, assistive technology, or visual ability, must experience seamless shopping.

---

## 2. Accessibility Checklist & Requirements

### 1. Color Contrast Ratios
- **Body Text**: Minimum **4.5:1** contrast ratio against dark backgrounds (`#F8FAFF` / `#D8DEE9` on `#012148`).
- **Large Headlines / Badges**: Minimum **3:1** contrast ratio (`#FFFFFF` on `#E60C45`).

### 2. Keyboard Navigation & Visible Focus
- All buttons, links, inputs, and search modals must be fully reachable via `Tab` and triggerable via `Enter` / `Space`.
- Explicit focus indicator:
  ```css
  :focus-visible {
    outline: 2px solid var(--accent-cyan);
    outline-offset: 2px;
  }
  ```

### 3. Touch Target Minimum
- All interactive controls on mobile and desktop touchscreens must meet Apple HIG / Material standards:
  ```css
  min-height: 44px;
  min-width: 44px;
  ```

### 4. Semantic HTML & ARIA Attributes
- Correct heading hierarchy (`h1` -> `h2` -> `h3`).
- Descriptive `aria-label` attributes on all icon buttons (`#searchTriggerBtn`, `#conciergeNavTrigger`, `#headerCartLink`, wishlist buttons, close drawers).
- Meaningful `alt` text on all product photography and editorial lifestyle images.

### 5. Native Select Element Contrast Guard
- When utilizing native `<select>` dropdowns in dark theme interfaces, ensure child `<option>` tags explicitly define `color: #000000;` to avoid invisible white text against Windows OS white native select dropdown backgrounds.
