---
name: nextjs-app-router
description: Use when building or updating pages, components, server actions, route handlers, or data fetching in Next.js 15+ App Router with React 19.
---

# Next.js 15 & React 19 App Router Standards

## Overview
Next.js 15 and React 19 prioritize server-first rendering, streaming UI, and async request handling. Pages and layouts are React Server Components (RSC) by default, keeping JavaScript bundle sizes small and initial page loads lightning fast.

---

## When to Use

### Triggering Conditions
- Creating or editing pages in the `app/` directory (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- Writing Server Actions for form submissions, cart operations, or newsletter sign-ups.
- Implementing Route Handlers (`app/api/.../route.ts`).
- Accessing dynamic route parameters, query parameters, cookies, or headers.
- Managing client-side interactive state with Zustand in an SSR environment.

### When NOT to Use
- Editing legacy static HTML/JS pages in `pages/*.html`.
- Standalone CSS-only token adjustments that do not touch React components.

---

## 1. Next.js 15 Breaking Changes: Async Request APIs

In Next.js 15, runtime request data (`params`, `searchParams`, `cookies()`, and `headers()`) is **asynchronous** and must always be awaited:

### Dynamic Route Pages
```tsx
// app/product/[id]/page.tsx
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductPage({ params, searchParams }: PageProps) {
  // MUST await params and searchParams in Next.js 15
  const { id } = await params;
  const query = await searchParams;

  const product = await getProductById(id);
  if (!product) return notFound();

  return <ProductView product={product} />;
}
```

### Async Cookies and Headers
```tsx
import { cookies, headers } from 'next/headers';

export async function checkUserSession() {
  // MUST await cookies() and headers() in Next.js 15
  const cookieStore = await cookies();
  const headerStore = await headers();
  
  const token = cookieStore.get('auth_token')?.value;
  return token;
}
```

---

## 2. Server Components vs. Client Components

Default to **Server Components**. Only opt into Client Components (`'use client'`) at the leaf level where interactive browser behavior is needed.

| Choose Server Component (Default) | Choose Client Component (`'use client'`) |
| :--- | :--- |
| Fetching data directly from databases, microservices, or APIs | User interactions: `onClick`, `onChange`, `onSubmit` |
| Reading environment variables with secret keys | Browser APIs: `localStorage`, `window`, `navigator` |
| Rendering static editorial content and SEO metadata | React hooks: `useState`, `useEffect`, `useRef`, `useReducer` |
| Reducing the client-side JavaScript bundle | Custom interactive widgets: Drawers, Modals, 3D Canvases |

```tsx
// Good architecture: Server Page wraps Client Interactive Component
// app/category/page.tsx (Server Component)
import { getCategoryProducts } from '@/lib/catalog';
import { InteractiveProductGrid } from '@/components/catalog/InteractiveProductGrid';

export default async function CategoryPage() {
  const products = await getCategoryProducts(); // Runs on server, zero client bundle cost
  return <InteractiveProductGrid initialProducts={products} />;
}
```

---

## 3. Server Actions with Zod Validation

Never trust raw client input. Always validate Server Action arguments using a strict Zod schema:

```tsx
// lib/actions/cart.ts
'use server';

import { AddToCartSchema } from '@/lib/validations';
import { revalidatePath } from 'next/cache';

export async function addToCartAction(rawData: unknown) {
  // 1. Validate payload
  const result = AddToCartSchema.safeParse(rawData);
  if (!result.success) {
    return { success: false, error: 'Invalid product details provided' };
  }

  const { productId, quantity, selectedSize } = result.data;

  // 2. Perform business logic
  try {
    await updateCartDatabase(productId, quantity, selectedSize);
    
    // 3. Purge cached route data if needed
    revalidatePath('/cart');
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to update shopping bag' };
  }
}
```

---

## 4. Zustand State in Next.js SSR (Preventing State Leaks)

In server-side rendering, module-level singleton stores can leak one user's state to another user across concurrent server requests.

- **For Client-Only UI State (Drawers, Modals, Theme)**: Standard `create()` singleton is safe if wrapped in `'use client'` with a `mounted` check to prevent hydration mismatch.
- **For User Data & Cart State**: Use the **Store Provider Pattern** with `useRef()` inside a React Context Provider:

```tsx
// store/CartStoreProvider.tsx
'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { createCartStore, type CartStore } from '@/store/cart-store';

const CartStoreContext = createContext<CartStore | null>(null);

export function CartStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<CartStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = createCartStore();
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  );
}

export function useCart<T>(selector: (state: any) => T): T {
  const store = useContext(CartStoreContext);
  if (!store) throw new Error('useCart must be used within CartStoreProvider');
  return store(selector);
}
```

---

## 5. Streaming UI with Suspense

Keep pages responsive by wrapping slow data components in `<Suspense>` with a visual skeleton:

```tsx
import { Suspense } from 'react';
import { ProductCarousel } from '@/components/product/ProductCarousel';
import { CarouselSkeleton } from '@/components/ui/skeletons';

export default function HomePage() {
  return (
    <main>
      <HeroBanner />
      <Suspense fallback={<CarouselSkeleton />}>
        <ProductCarousel />
      </Suspense>
    </main>
  );
}
```

---

## 6. Common Mistakes to Avoid

1. **Forgetting `await` on `params` or `searchParams`**: In Next.js 15, reading `params.id` without `await params` throws a warning/error.
2. **Placing `'use client'` at the page level**: Only mark interactive leaf components with `'use client'`, not entire route pages.
3. **Importing Server-Only Code in Client Components**: Never import database clients or server environment secrets into `'use client'` files.
4. **Hydration Mismatches with `localStorage`**: Always wait until the component mounts (`const [isMounted, setIsMounted] = useState(false)`) before reading client storage.
