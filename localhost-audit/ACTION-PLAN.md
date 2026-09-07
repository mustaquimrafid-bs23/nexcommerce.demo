# Prioritized SEO Action Plan: nexCommerce Storefront

**Target:** `http://localhost:3000`  
**Framework:** Next.js 16 App Router  
**Target Health Score Goal:** 95+ / 100  

---

## Priority Matrix Overview

```
CRITICAL (Immediate - Unblocks Indexing)
 ├── 1. Implement app/robots.ts (200 OK + sitemap reference)
 ├── 2. Implement app/sitemap.ts (Dynamic XML sitemap generation)
 ├── 3. Split PDP into Server Page + Client View to enable generateMetadata
 └── 4. Inject Schema.org JSON-LD Product & Offer structured data on PDPs

HIGH (Week 1 - Ranking & Social Traffic Boost)
 ├── 5. Configure metadataBase, OpenGraph, and Twitter Cards in app/layout.tsx
 ├── 6. Add canonical URL alternates to root layout and dynamic product pages
 ├── 7. Publish public/llms.txt for Generative Engine Optimization (GEO)
 └── 8. Inject Organization and WebSite JSON-LD on Homepage

MEDIUM (Weeks 2-3 - Performance & UX Polish)
 ├── 9. Migrate catalog <img> elements to next/image for automatic WebP/AVIF
 ├── 10. Add fetchpriority="high" to hero LCP background image
 ├── 11. Resolve small badge contrast ratios flagged by Lighthouse
 └── 12. Expand product descriptions with fabric, care, and sizing details

LOW (Backlog - Authority & Maintenance)
 ├── 13. Implement automated /seo drift baseline tracking in CI/CD pipeline
 └── 14. Establish Wikidata and Fashion Ontology entity links
```

---

## Detailed Task Breakdown

### Phase 1: Critical Fixes (Immediate / Day 1-2)

#### Task 1: Create `app/robots.ts`
- **Severity:** Critical
- **Effort:** 15 minutes
- **Impact:** Eliminates 404 crawler error; defines crawl guidelines and points crawlers directly to `/sitemap.xml`.
- **Falsifiability Check:** `curl http://localhost:3000/robots.txt` returns HTTP 200 with `User-agent: *` and `Sitemap: .../sitemap.xml`.

#### Task 2: Create `app/sitemap.ts`
- **Severity:** Critical
- **Effort:** 30 minutes
- **Impact:** Allows search engines to index all 8+ catalog products and 10+ core static pages automatically.
- **Falsifiability Check:** `curl http://localhost:3000/sitemap.xml` returns valid XML containing `<url><loc>.../product/p1</loc></url>`.

#### Task 3: Enable Dynamic `generateMetadata` on Product Pages
- **Severity:** Critical
- **Effort:** 1 hour
- **Impact:** Eliminates duplicate fallback titles across all catalog items in SERPs.
- **Implementation:** Create a server-side entry point for `app/product/[id]/page.tsx` that exports `generateMetadata({ params })` and renders `<ProductClientView product={product} />`.
- **Falsifiability Check:** `curl http://localhost:3000/product/p1` returns `<title>Architectural Cashmere Sweater | ARC — nexCommerce</title>`.

#### Task 4: Inject Schema.org JSON-LD on Product Pages
- **Severity:** Critical
- **Effort:** 45 minutes
- **Impact:** Unlocks Google Rich Snippets: price, currency, availability, and star ratings.
- **Falsifiability Check:** Rich Results Test validates `@type: "Product"` with zero errors.

---

### Phase 2: High-Impact Improvements (Week 1)

#### Task 5: Configure `metadataBase` & Social OpenGraph Tags
- **Severity:** High
- **Effort:** 30 minutes
- **Impact:** Rich previews when links are shared on social media and messaging platforms.
- **Falsifiability Check:** View source of homepage shows `<meta property="og:image" ...>` and `<meta name="twitter:card" content="summary_large_image">`.

#### Task 6: Add Canonical Tags
- **Severity:** High
- **Effort:** 20 minutes
- **Impact:** Consolidates page authority and prevents duplicate indexing penalties from query strings.
- **Falsifiability Check:** `<link rel="canonical" href="...">` present in document head.

#### Task 7: Deploy `/llms.txt` for AI Search Engines
- **Severity:** High
- **Effort:** 30 minutes
- **Impact:** Positions the storefront as a trusted source for Perplexity, ChatGPT Search, and Google AI Overviews.
- **Falsifiability Check:** `curl http://localhost:3000/llms.txt` returns clean markdown catalog guide.

---

### Phase 3: Performance, Images & Content Polish (Weeks 2-3)

#### Task 8: Migrate Catalog Images to `next/image`
- **Severity:** Medium
- **Effort:** 2 hours
- **Impact:** Automatic conversion to AVIF/WebP, responsive `srcset`, and reduced bandwidth.
- **Falsifiability Check:** Network tab demonstrates image payloads reduced by >50%.

#### Task 9: Hero Image LCP Optimization
- **Severity:** Medium
- **Effort:** 20 minutes
- **Impact:** Shaves 200-400ms off Largest Contentful Paint (LCP).
- **Falsifiability Check:** Lighthouse LCP metric improves to <1.5s on desktop.

#### Task 10: Enhance Product Copy for E-E-A-T
- **Severity:** Medium
- **Effort:** 2 hours
- **Impact:** Enhances semantic relevance for long-tail search queries ("organic cashmere sweater care", "vegetable tanned leather tote").
- **Falsifiability Check:** Average word count on PDPs reaches 150+ words of informative copy.
