# Web Performance & Code Simplification Standards (Addy Osmani Engineering Model)

This rule establishes strict engineering standards for **Core Web Vitals (LCP, CLS, INP)**, **Next.js Asset Optimization**, and **Clean Code Simplification** across all Next.js storefront components.

---

## 1. Core Web Vitals & Next.js Performance (`/webperf`)

### LCP (Largest Contentful Paint) Standard
- **Hero Image Priority**: Any image that appears above the fold (e.g. in `HeroSection.tsx`, top editorial banner, or primary PDP gallery image) **MUST** declare `priority={true}` or `loading="eager"`.
- **Mandatory `sizes` Attribute**: Never use `next/image` with `fill` without providing a specific `sizes` attribute. Omitting `sizes` forces the browser to download full desktop-resolution images on mobile devices.
  ```tsx
  //  CORRECT
  <Image
    src={heroImage}
    alt="Autumn Lookbook"
    fill
    priority
    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    className="object-cover object-center"
  />

  //  WRONG (Downloads 4K image on mobile, tanking LCP)
  <Image src={heroImage} alt="Hero" fill />
  ```
- **Font Optimization**: Always load Google/local fonts via `next/font` with `display: 'swap'` and preload subsets (`latin`).
- **Server Component Data Fetching**: Fetch primary page data on the server in React Server Components so HTML streams to the browser with content already populated.

### CLS (Cumulative Layout Shift) Standard
- **Aspect Ratio Reservation**: Every image, video, and lazy component **MUST** reserve its layout space before the asset loads to guarantee **zero layout shift (CLS = 0)**.
  - For standard cards: use Tailwind `aspect-[3/4]` or `aspect-[16/9]` with `relative overflow-hidden`.
  - For text skeletons: use explicit height utilities (e.g. `h-6 w-3/4 rounded bg-white/5 animate-pulse`).
- **No In-Flow Dynamic Injections**: Dynamic promotional bars, alert banners, and cart notifications must either reserve dedicated layout height or be rendered in fixed/absolute overlays out of normal page flow.
- **Scroll Containment**: Drawers and modals must declare `overscroll-behavior: contain;` to prevent background scroll jank.

### INP (Interaction to Next Paint) Standard
- **Lightweight Event Handlers**: Keep click and input handlers fast. Offload non-UI computations.
- **Dynamic Imports for Heavy Leaf Drawers**: Lazy load heavy interactive widgets that are not needed on initial paint using `next/dynamic`:
  ```tsx
  import dynamic from 'next/dynamic';

  const VisualSearchModal = dynamic(
    () => import('@/components/search/VisualSearchModal').then(mod => mod.VisualSearchModal),
    { ssr: false }
  );
  ```
- **No Layout Thrashing**: Never read DOM geometry (`offsetHeight`, `getBoundingClientRect`) immediately after writing styles in user interaction loops.

---

## 2. Code Simplification & Anti-Bloat (`/code-simplify`)

### Zero Redundant `useEffect` Invariant
AI models frequently use `useEffect` to synchronize props into state or compute values. This causes double-renders, synchronization bugs, and memory leaks.
- **Compute Derived State During Render**:
  ```tsx
  //  CORRECT: Derived directly during render
  const filteredProducts = useMemo(() => {
    return products.filter(p => selectedCategory === 'all' || p.category === selectedCategory);
  }, [products, selectedCategory]);

  //  WRONG: Redundant state + effect causes flash of stale content
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    setFiltered(products.filter(p => ...));
  }, [products, selectedCategory]);
  ```
- Use `useEffect` **only** for external system synchronization (browser listeners, Web APIs, timers, third-party libraries).

### Minimal DOM Depth & Zero "Div Soup"
- Eliminate unnecessary wrapper `<div>` elements.
- Apply layout, flexbox, and grid utilities directly to semantic elements (`<main>`, `<section>`, `<article>`, `<header>`, `<footer>`, `<aside>`).
- Use React `<>` fragments when returning sibling nodes without adding an extra DOM container.

### Component Size & Single Responsibility
- **Max Component Length**: Keep individual UI components under ~150–200 lines.
- **Extract Leaf Primitives**: When a component handles multiple distinct UI responsibilities (e.g., swatch pickers, price tags, review badges), extract them into clean subcomponents under `components/{feature}/`.

### Safe Conditional Rendering
- Avoid JavaScript falsy pitfalls where `0` or `NaN` gets rendered in the DOM:
  ```tsx
  //  CORRECT
  {items.length > 0 && <CartBadge count={items.length} />}
  {items.length ? <CartBadge count={items.length} /> : null}

  //  WRONG (renders "0" on screen when empty)
  {items.length && <CartBadge count={items.length} />}
  ```
