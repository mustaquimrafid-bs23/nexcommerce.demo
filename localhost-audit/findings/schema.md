# Schema & Structured Data Specialist Findings: nexCommerce

**Target:** `http://localhost:3000`  
**Category Score:** 15 / 100  
**Status:** Critical Missing Layer  

---

## 1. Zero Schema.org JSON-LD Presence
- **Current State:** 0 scripts of type `application/ld+json` detected anywhere across homepage, catalog, or product detail pages.
- **Impact:** Google Search cannot extract rich snippets (star ratings, live prices, in-stock badges, or merchant return policies). In e-commerce SERPs, listings without rich snippet data suffer a 20-35% CTR penalty compared to rich snippet competitors.

## 2. Recommended Schemas by Page Type

### A. Product Detail Pages (`/product/[id]`)
- **Primary Type:** `Product`
- **Mandatory Properties:**
  - `name`: Product title
  - `image`: Absolute URL to primary high-resolution imagery
  - `description`: Detailed product summary
  - `sku`: Product ID (e.g. `p1`, `p2`)
  - `brand`: `@type: "Brand"` with `name`
  - `offers`: `@type: "Offer"` with `price`, `priceCurrency`, `priceValidUntil`, `itemCondition: "https://schema.org/NewCondition"`, and `availability: "https://schema.org/InStock"`
  - `aggregateRating`: If reviews exist, provide `ratingValue` and `reviewCount`.

### B. Homepage (`/`)
- **Primary Types:** `Organization`, `WebSite`, `Store`
- **Properties:**
  - `name`: "nexCommerce"
  - `url`: Site URL
  - `logo`: Storefront logo URL
  - `potentialAction`: `@type: "SearchAction"` enabling Google Sitelinks Searchbox (`target: "/discovery?q={search_term_string}"`).

### C. Category & Breadcrumb Navigation
- **Primary Type:** `BreadcrumbList`
- **Properties:**
  - `itemListElement`: Array of `ListItem` entries indicating position, item name, and URL.
