---
name: web-vitals-audit
description: Use when auditing or optimizing web performance, Core Web Vitals (LCP, INP, CLS), asset loading speeds, 3D canvas performance, or bundle size in web applications.
---

# Web Performance & Core Web Vitals (CWV) Audit

## Overview
A fast, silky-smooth website delights shoppers and boosts conversions. Core Web Vitals (CWV) are Google's standardized metrics for measuring real-world user experience: page load speed, visual stability, and interaction responsiveness.

---

## When to Use

### Triggering Conditions
- Auditing or optimizing initial page load speed and asset delivery.
- Diagnosing layout shifts, jumping buttons, or flashing unstyled text (FOUC).
- Investigating slow click responses or stuttering drawer/modal animations.
- Optimizing Three.js 3D canvas scenes, Lenis smooth scrolling, or heavy hero photography.
- Analyzing production bundle sizes and eliminating unused JavaScript.

### When NOT to Use
- Writing internal database queries or server-only logic with no browser footprint.
- Formatting unit test assertion messages.

---

## 1. The 3 Core Web Vitals in Plain English

| Metric | Target | What It Measures | How to Win |
| :--- | :--- | :--- | :--- |
| **LCP** *(Largest Contentful Paint)* | **$\le 2.5\text{s}$** | How fast the biggest above-the-fold piece (hero image or heading) is visible. | Preload hero image with `priority`, compress images to WebP/AVIF, eliminate render-blocking CSS. |
| **INP** *(Interaction to Next Paint)* | **$\le 200\text{ms}$** | How fast the interface responds when a user clicks a button, tab, or menu. | Avoid long JavaScript tasks ($>50\text{ms}$) on the main thread; offload heavy work to microtasks or Web Workers. |
| **CLS** *(Cumulative Layout Shift)* | **$\le 0.1$** | How stable the layout is — prevents content from unexpectedly jumping around while loading. | Always declare explicit `width` and `height` (or CSS `aspect-ratio`) on images, banners, and video containers. |

---

## 2. Image & Media Optimization Standards

Hero and product images are often the heaviest assets on an e-commerce storefront:

### Above-The-Fold Hero Banner
```tsx
import Image from 'next/image';

export function HeroBanner() {
  return (
    <div className="relative aspect-[16/9] w-full overflow-hidden">
      {/* Priority tells Next.js to preload this image immediately for optimal LCP */}
      <Image
        src="/images/hero-atelier-couture.webp"
        alt="Atelier Luxury Autumn Collection"
        fill
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1440px"
        className="object-cover"
      />
    </div>
  );
}
```

### Below-The-Fold Images
- Always use lazy loading for images beneath the initial viewport (`loading="lazy"`).
- Maintain exact aspect ratios using CSS `aspect-ratio: 1 / 1;` to guarantee zero layout shift before the image loads.

---

## 3. Web Typography Performance

Unoptimized web fonts cause layout shifts and annoying text flashes:

1. **Use `next/font`**:
   ```tsx
   // app/layout.tsx
   import { Inter, Cormorant_Garamond } from 'next/font/google';

   const inter = Inter({
     subsets: ['latin'],
     display: 'swap', // Shows system font first, swaps cleanly without layout jumping
     variable: '--font-sans',
   });
   ```
2. **Always Use `font-display: swap`**: Never block text rendering while waiting for remote font downloads.

---

## 4. 3D Canvas & GPU Animation Best Practices

Our storefront uses Three.js 3D viewers and Lenis smooth scrolling. Follow these rules to keep 60–120 FPS frame rates:

1. **Pause Off-Screen Canvas Rendering**:
   Use an `IntersectionObserver` to pause Three.js `requestAnimationFrame` loops when the 3D viewer is scrolled out of view.
2. **GPU Transforms Only**:
   Animate only `transform` and `opacity`. Never animate `top`, `left`, `width`, or `height` during continuous transitions or progress bars.
3. **Declare `will-change` Sparingly**:
   Only set `will-change: transform` on actively animating layers, and remove it once the animation finishes.

---

## 5. Performance Audit Checklist

Before releasing any new storefront feature, verify:

- [ ] **LCP Hero Image**: Uses modern format (WebP/AVIF) with `priority` and explicit aspect-ratio container.
- [ ] **Zero Layout Shift (CLS)**: Every image and video element has defined dimensions or aspect-ratio placeholder.
- [ ] **No Heavy Main Thread Blockers**: Button click handlers and search filters execute in under $50\text{ms}$.
- [ ] **Smooth Drawer Motion**: Mini-cart and mobile nav slide in using GPU `transform: translateX(...)` with backdrop-filter blur.
- [ ] **Clean Production Build**: Run `npm run build` to confirm JavaScript chunk sizes stay under Next.js budget recommendations.
