# Technical SEO Specialist Findings: nexCommerce

**Target:** `http://localhost:3000`  
**Category Score:** 55 / 100  
**Status:** Critical Gaps  

---

## 1. Missing `robots.txt`
- **Current State:** Returns `HTTP 404`.
- **Impact:** Web spiders (Googlebot, Bingbot, Yandex) have no directive on rate limits, sensitive sub-routes (`/cart`, `/checkout`, `/account`, `/orders`), or where to find the XML sitemap.
- **Remediation:** Create `app/robots.ts` using Next.js 15+ `MetadataRoute.Robots`.

## 2. Missing `sitemap.xml`
- **Current State:** Returns `HTTP 404`.
- **Impact:** Catalog expansion and newly created products cannot be crawled systematically.
- **Remediation:** Create `app/sitemap.ts` using Next.js `MetadataRoute.Sitemap`, mapping both static routes and `MASTER_PRODUCTS`.

## 3. Undefined `metadataBase`
- **Current State:** `app/layout.tsx` does not define `metadataBase`.
- **Impact:** Next.js throws build/runtime warnings when generating OpenGraph or canonical links with relative paths.
- **Remediation:** Add `metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')` to root layout metadata.

## 4. Canonicalization Gaps
- **Current State:** No `<link rel="canonical">` tag rendered in the document `<head>`.
- **Impact:** Filter states (`/category?cat=accessories`, `/discovery?q=cashmere`) risk being indexed as duplicate instances of the main category/discovery pages.
- **Remediation:** Add `alternates: { canonical: ... }` to layout and page metadata definitions.
