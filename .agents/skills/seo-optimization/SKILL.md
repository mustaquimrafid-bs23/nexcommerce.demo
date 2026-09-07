---
name: seo-optimization
description: Master guide and operational standard for Next.js 15+ App Router, e-commerce, and modern web SEO optimization. Covers dynamic metadata generation, JSON-LD Schema.org structured data, Core Web Vitals (LCP, CLS, INP), sitemaps, robots.txt, canonicalization, OpenGraph/Twitter cards, image SEO, and Generative Engine Optimization (GEO) for AI search engines.
argument-hint: "[page, route, or SEO task]"
---

# SEO Optimization Master Guide

Operational standards for on-page SEO, technical search architecture, Schema.org structured data, and Generative Engine Optimization (GEO) in Next.js 15+ App Router and e-commerce web applications.

---

## 1. Next.js 15+ App Router Metadata Architecture

Next.js App Router provides built-in, type-safe metadata management through `Metadata` and `generateMetadata`.

### Static Metadata (`layout.tsx` / static `page.tsx`)
Always define `metadataBase` in the root layout to avoid relative URL resolution bugs:
```typescript
// app/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: {
    default: "nexCommerce | Modern Shopping & Personal Style",
    template: "%s | nexCommerce",
  },
  description: "Curated luxury apparel, minimalist essentials, and personal style intelligence.",
  keywords: ["luxury fashion", "modern wardrobe", "minimalist apparel", "personal styling"],
  authors: [{ name: "nexCommerce" }],
  creator: "nexCommerce",
  publisher: "nexCommerce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "nexCommerce | Modern Shopping & Personal Style",
    description: "Curated luxury apparel and intelligent styling.",
    url: "https://example.com",
    siteName: "nexCommerce",
    images: [
      {
        url: "/og-default.jpg",
        width: 1200,
        height: 630,
        alt: "nexCommerce Luxury Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "nexCommerce",
    description: "Curated luxury apparel and personal style intelligence.",
    images: ["/og-default.jpg"],
    creator: "@nexcommerce",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};
```

### Dynamic Metadata (`generateMetadata` for PDP / PLP)
For dynamic product detail and category pages:
```typescript
// app/product/[id]/page.tsx
import type { Metadata, ResolvingMetadata } from "next";
import { getProductById } from "@/data/products";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested item is unavailable.",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: product.name,
    description: product.description || `Buy ${product.name} at nexCommerce. Premium quality craftsmanship.`,
    alternates: {
      canonical: `/product/${id}`,
    },
    openGraph: {
      title: `${product.name} | nexCommerce`,
      description: product.description,
      url: `/product/${id}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 1000,
          alt: product.name,
        },
        ...previousImages,
      ],
      type: "article",
    },
  };
}
```

---

## 2. E-Commerce Structured Data (JSON-LD)

Structured data is critical for rich search snippets (star ratings, prices, in-stock badges). Always inject schema using a standard `<script type="application/ld+json">` tag.

### Product Schema (PDP)
```tsx
// components/seo/ProductSchema.tsx
export function ProductSchema({ product }: { product: Product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: product.brand || "nexCommerce",
    },
    offers: {
      "@type": "Offer",
      url: `https://example.com/product/${product.id}`,
      priceCurrency: "USD",
      price: product.price,
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    aggregateRating: product.ratingCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.ratingCount,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### Breadcrumbs Schema
```tsx
// components/seo/BreadcrumbSchema.tsx
export function BreadcrumbSchema({ items }: { items: { name: string; url: string }[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 3. Dynamic XML Sitemaps & Robots.txt

In Next.js App Router, manage these with native TypeScript files:

### Dynamic Sitemap (`app/sitemap.ts`)
```typescript
// app/sitemap.ts
import { MetadataRoute } from "next";
import { products } from "@/data/products";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    "",
    "/category",
    "/size-guide",
    "/concierge",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
```

### Robots Configuration (`app/robots.ts`)
```typescript
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/cart/", "/checkout/", "/account/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
```

---

## 4. Semantic Hierarchy & Image SEO

1. **Single `<h1>` Invariant**: Every indexable page must feature exactly one `<h1>` containing the primary target keywords.
2. **Semantic Landmarks**: Structure pages with `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, and `<footer>`.
3. **Image Attributes**:
   - `alt`: Descriptive, natural keyword phrases (e.g. `alt="Cashmere Trench Coat in Camel"` instead of `alt="product"`).
   - `width` & `height`: Prevent Cumulative Layout Shift (CLS).
   - `priority`: Use on above-the-fold hero banners to optimize Largest Contentful Paint (LCP).
   - Format: WebP or AVIF modern compression.

---

## 5. Generative Engine Optimization (GEO / AI Search)

AI engines (Perplexity, ChatGPT Search, Gemini, Google AI Overviews) index and summarize pages differently than traditional web spiders.

- **Direct Answer Invariant**: Start key sections and product descriptions with concise 1-2 sentence definitive statements before delving into details.
- **Entity Consistency**: Maintain unambiguous brand and entity names across headings, metadata, and JSON-LD schema.
- **Structured Specifications**: Format dimensions, materials, care instructions, and sizing tables in semantic HTML tables (`<table>`) or definition lists (`<dl>`), which LLMs parse with the highest accuracy.
- **E-E-A-T Signals**: Include clear brand origins, transparent return/warranty policies, verified customer reviews, and expert styling advice.

---

## 6. Pre-Launch SEO Audit Checklist

- [ ] Every page has a unique, descriptive `<title>` ($\le 60$ chars) and `<meta name="description">` ($140\text{–}160$ chars).
- [ ] Canonical URLs are set and verified with no circular redirects.
- [ ] OpenGraph image and card tags are present and validated.
- [ ] Product JSON-LD schema validates with Google's Rich Results Test.
- [ ] XML sitemap is served at `/sitemap.xml` with HTTP 200.
- [ ] `robots.txt` disallows internal search, cart, and checkout paths.
- [ ] Zero unoptimized images; all `<img>` tags have explicit dimensions and descriptive `alt` text.
- [ ] Core Web Vitals (LCP $< 2.5\text{s}$, CLS $< 0.1$, INP $< 200\text{ms}$) verified in production build.
