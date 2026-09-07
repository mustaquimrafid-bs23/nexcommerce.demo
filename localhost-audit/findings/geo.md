# Generative Engine Optimization (GEO) & AI Search Readiness

**Target:** `http://localhost:3000`  
**Category Score:** 35 / 100  
**Status:** Emerging Standard Unimplemented  

---

## 1. Missing `/llms.txt` Standard
- **Current State:** Requesting `http://localhost:3000/llms.txt` returns `HTTP 404`.
- **Purpose:** `/llms.txt` is the markdown file standard consumed by AI agents (ChatGPT Search, Perplexity, Claude, Gemini) to quickly index brand background, product hierarchies, APIs, and key pages without parsing complex JavaScript SPAs.
- **Remediation:** Publish `public/llms.txt` containing:
  - Brand overview & mission
  - Key product categories (Tailoring, Outerwear, Footwear, Accessories)
  - Return policy & shipping highlights
  - Primary navigation URLs

## 2. AI Crawler Directives in `robots.txt`
- **Target Bots:** `GPTBot`, `ChatGPT-User`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`.
- **Recommendation:** Explicitly allow access to catalog routes (`/`, `/product/`, `/category/`, `/about`, `/llms.txt`) while disallowing user session paths (`/cart`, `/checkout`, `/account`).

## 3. Brand Citability & Semantic Entity Anchors
- **Current State:** Brand mentions are self-contained without external identity anchoring.
- **Recommendation:** Include `sameAs` links in `Organization` schema to official corporate registries or social profiles to solidify entity graph authority in Google AI Overviews.
