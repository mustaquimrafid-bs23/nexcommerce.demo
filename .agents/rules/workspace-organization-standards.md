# Workspace Organization & Directory Hierarchy Standards

This rule defines the strict directory structure, file placement, and path resolution invariants for the nexCommerce storefront repository.

---

## 1. Root Directory Minimalism
The project root directory must maintain a minimal, clean footprint:
- **Allowed root files**:
  - `index.html` (Primary storefront entry point)
  - `404.html` (Static web server fallback error page)
  - `package.json` & `package-lock.json`
  - `.env`
  - `README.md`
- **Allowed root directories**:
  - `pages/` (All secondary storefront HTML views)
  - `assets/` (Categorized static media)
  - `css/` (Stylesheets & design tokens)
  - `js/` (JavaScript engines & dynamic modules)
  - `docs/` (Specifications, brand guidelines, reports)
  - `.agents/` (AI instructions, rules, and skills)
- **Strictly Prohibited at Root**:
  - Loose image files (`.png`, `.jpg`, `.jpeg`, `.svg`, `.webp`).
  - Secondary HTML pages (e.g. `product.html`, `cart.html`).
  - Temporary or one-off python / JS scripts (`inject_*.py`, `organize_*.py`, `refactor_*.py`, `fixer.js`).
  - Stray scratch directories (`scratch/`).

---

## 2. Secondary Page Isolation (`pages/`)
All secondary customer-facing, account, auth, and legal HTML views must reside exclusively within the `pages/` directory:
- `pages/account.html`
- `pages/cart.html`
- `pages/category.html`
- `pages/checkout.html`
- `pages/components-preview.html`
- `pages/concierge.html`
- `pages/confirmation.html`
- `pages/contact.html`
- `pages/discovery.html`
- `pages/foundation.html`
- `pages/lookbook.html`
- `pages/orders.html`
- `pages/playground.html`
- `pages/privacy.html`
- `pages/product.html`
- `pages/profile.html`
- `pages/security.html`
- `pages/signin.html`
- `pages/signup.html`
- `pages/size-guide.html`
- `pages/terms.html`
- `pages/tracking.html`
- `pages/wishlist.html`
- `pages/404.html`

---

## 3. Media & Asset Directory Layout (`assets/images/`)
All production media assets must be organized into strict subfolders under `assets/images/`:
- `assets/images/brand/` — Brand logos and payment gateway vector badges (`bkash.svg`, `nagad.svg`, `visa.svg`, `mastercard.svg`, `logo_light.png`, `logo_dark.png`).
- `assets/images/lifestyle/` — Hero banners and editorial lifestyle photography.
- `assets/images/products/` — Product catalog shots, category imagery, and texture swatches.

*Rule: Never save images directly into `assets/` root or the project root.*

---

## 4. Relative Link & Path Invariants

### Within `index.html` (at Root):
- Links to secondary pages: `href="pages/{page}.html"`
- Stylesheets: `href="css/{file}.css"`
- Scripts: `src="js/{file}.js"`
- Image assets: `src="assets/images/{category}/{image}.png"`

### Within `pages/*.html` (Inside `pages/`):
- Stylesheets: `href="../css/{file}.css"`
- Scripts: `src="../js/{file}.js"`
- Image assets: `src="../assets/images/{category}/{image}.png"`
- Home link: `href="../index.html"`
- Sibling page links: `href="{sibling}.html"` (direct sibling relative links)

### Within Shared JavaScript Modules (`js/`):
Shared scripts (e.g. `auth.js`, `cart.js`, `search-overlay.js`, `notifications.js`) that execute across both `index.html` and `pages/*.html` must dynamically resolve paths based on current route location:
```javascript
function _resolvePage(page) {
  const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
  if (page === 'index.html') return isSubpage ? '../index.html' : 'index.html';
  return isSubpage ? page : 'pages/' + page;
}

function _resolveAsset(assetPath) {
  if (!assetPath) return '';
  if (assetPath.startsWith('http') || assetPath.startsWith('data:')) return assetPath;
  const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
  const clean = assetPath.replace(/^(\.\.\/)+/, '').replace(/^\.\//, '');
  return isSubpage ? '../' + clean : clean;
}
```

---

## 5. Temporary Script & Tool Hygiene
- **One-off automation scripts**: Migration, component injection, refactoring, or scratch automation scripts (`.py`, `.js`) should be executed and then deleted immediately after verification.
- **No loose script clutter**: Do not keep stagnant `scripts/` or `scratch/` directories containing expired one-off migration scripts.
- **Link verification**: After any directory or file restructuring, ensure link integrity checks pass with 0 broken links.
