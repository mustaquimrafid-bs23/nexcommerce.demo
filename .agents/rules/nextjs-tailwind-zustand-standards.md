# Next.js 15+ + Tailwind CSS v4 + Zustand + TypeScript Engineering Standards

This rule defines the mandatory architectural and coding standards for all Next.js App Router, Tailwind CSS v4, and Zustand development in this workspace.

---

## 1. Next.js 15+ & React 19 Core Standards

### React Server Components (RSC) by Default
- Default to Server Components for data fetching, layouts, and page shells.
- Add `'use client'` strictly at the lowest possible leaf components that require interactivity, state, or browser APIs.
- Keep server-rendered pages fast and SEO-friendly.

### Next.js 15+ Async Request APIs (CRITICAL)
In Next.js 15+, dynamic route parameters, search params, cookies, and headers are **Promises**. AI models often hallucinate Next 13/14 synchronous access. **Always `await` them:**
```typescript
// Page or Layout props
export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { id } = await params;
  const query = await searchParams;
  // ...
}

// Server cookies & headers
import { cookies, headers } from 'next/headers';

export async function checkSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token');
  const headersList = await headers();
}
```

### React 19 Forms & Actions
- **Forms**: Use `useActionState` (React 19 standard). **DO NOT use deprecated `useFormState`**.
- **Pending Status**: Use `useFormStatus` inside form child components.
- **Optimistic Updates**: Use `useOptimistic` for instant UI feedback.
- **Server Actions**: Define with `'use server'`, validate inputs with Zod/typed schemas, and return typed responses: `{ success: boolean; data?: T; error?: string }`.

### Navigation
- Always import navigation hooks from `next/navigation` (`useRouter`, `usePathname`, `useSearchParams`).
- **NEVER** import from `next/router` (which is legacy Pages Router and will fail).

---

## 2. Tailwind CSS v4 Standards

### CSS-First Configuration (Zero `tailwind.config.js`)
- **STRICTLY FORBIDDEN:** Creating or editing `tailwind.config.js` or `tailwind.config.ts`. Tailwind CSS v4 is purely CSS-first.
- All theme extensions, custom tokens, and fonts are defined directly inside `app/globals.css` using the `@theme` directive:
```css
@import "tailwindcss";

@theme {
  --color-obsidian-950: #00142e;
  --color-obsidian-900: #012148;
  --color-surface-navy: #0A2A54;
  --color-surface-card: #08254c;
  --color-accent-crimson: #E60C45;
  --color-accent-pink: #F13365;
  --color-accent-cyan: #3DE0FF;
  
  --font-serif: var(--font-serif), 'Cormorant Garamond', serif;
  --font-sans: var(--font-sans), 'Inter', sans-serif;
  --font-display: var(--font-display), 'Manrope', sans-serif;
  --radius-atelier: 12px;
}
```
- **Class Merging**: Always use the `cn()` utility (`clsx` + `tailwind-merge`) from `@/lib/utils` for conditional or overridden class names:
```typescript
import { cn } from '@/lib/utils';

<button className={cn('px-4 py-2 rounded-atelier bg-surface-navy', isPrimary && 'bg-accent-crimson')} />
```

---

## 3. Zustand State Management (SSR Safe)

### Store Architecture
- All Zustand stores must be located in `store/` (e.g., `store/useCartStore.ts`, `store/useWishlistStore.ts`).
- Stores must define clear TypeScript interfaces for both state and actions.

### SSR Hydration Guard (Mandatory for Persisted Stores)
Any store using `persist` middleware (reading from `localStorage`) will trigger React hydration mismatch errors if evaluated during server pre-rendering. You **must** guard against this in client components:

```typescript
'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export function CartDrawer() {
  const [mounted, setMounted] = useState(false);
  const { items, isOpen } = useCartStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Return null or placeholder during SSR pass
  if (!mounted || !isOpen) return null;

  return (
    <div>{items.map(...)}</div>
  );
}
```

### State Scope & SSR Leak Prevention (Store Provider Pattern)
- **Client-Only UI State**: A standard global singleton `create<T>()(...)` is approved **only** for client-only UI state (drawers, modals, search toggles, theme).
- **User-Specific & Server-Initialized State**: When state contains user-specific data or is initialized with server data, a global module-level singleton leaks state across concurrent requests during SSR. You **MUST** use the **Zustand Store Provider Pattern**:
```tsx
'use client';

import { type ReactNode, createContext, useRef, useContext } from 'react';
import { useStore } from 'zustand';
import { type CartStore, createCartStore } from '@/store/cart-store';

export type CartStoreApi = ReturnType<typeof createCartStore>;
export const CartStoreContext = createContext<CartStoreApi | undefined>(undefined);

export function CartStoreProvider({ children }: { children: ReactNode }) {
  const storeRef = useRef<CartStoreApi>(null);
  if (!storeRef.current) {
    storeRef.current = createCartStore();
  }
  return <CartStoreContext.Provider value={storeRef.current}>{children}</CartStoreContext.Provider>;
}

export function useCartStore<T>(selector: (store: CartStore) => T): T {
  const context = useContext(CartStoreContext);
  if (!context) throw new Error('useCartStore must be used within CartStoreProvider');
  return useStore(context, selector);
}
```

---

## 4. Zod Schema Validation Standard

All Server Actions, form inputs, and external API responses **must** be validated using `zod`:
- **Server Actions**:
  ```typescript
  import { z } from 'zod';

  export const AddToCartSchema = z.object({
    productId: z.string().min(1, 'Product ID is required'),
    quantity: z.number().int().positive().max(99),
    selectedSize: z.string().optional(),
    selectedColor: z.string().optional(),
  });

  export type AddToCartInput = z.infer<typeof AddToCartSchema>;

  export async function addToCartAction(input: unknown) {
    'use server';
    const result = AddToCartSchema.safeParse(input);
    if (!result.success) {
      return { success: false, errors: result.error.flatten().fieldErrors };
    }
    // Proceed with validated result.data
    return { success: true };
  }
  ```

---

## 5. TypeScript & Import Strictness

- **Path Aliases**: Always use `@/*` for root imports (`@/components/...`, `@/store/...`, `@/lib/...`, `@/types/...`).
- **No `any`**: Strict TypeScript is enforced. Use explicit interfaces, generics, or `unknown` with type narrowing.
- **Explicit Types**: Always declare explicit types for Server Action return values, component props, and API handlers.

---

## 6. Curation Batch Dock & Mini-PDP Quick Look Standards

### Curation Batch Actions (Floating Obsidian Island)
- **Floating Island**: In collection, curation, and replenishment views (Smart List, Wishlist, Bag), provide a floating Obsidian Island dock anchored at the viewport bottom when items are selected (`selectedIds.size > 0`).
- **Components**: The dock must include an active selection count badge, an overlapping avatar filmstrip stack of selected item images, live subtotal valuation, a clear selection button (`X`), and a batch "Add Selected to Bag" action with spring animations (`type: 'spring', damping: 24, stiffness: 260`).
- **0-Item Depletion Invariant**: When `selectedIds.size === 0`, the dock unmounts gracefully with spring physics (`y: 80, opacity: 0`), and any 0-item depletion cleans all ambient metrics down to 0.

### Cart Multi-Quantity Store Parameter
- **Optional Quantity**: Ensure `useCartStore.addItem(product, size, color, quantity = 1)` accepts an optional `quantity` parameter with default `1`. This enables Quick Look quantity steppers and multi-item batch adds in a single clean state mutation without argument count mismatches (`TS2554`).

### Full "Mini-PDP" Quick Look Slide-Over Standard
- **Interactive Mini-PDP**: Quick Look drawers must never be static shallow cards. They must deliver:
  1. Multi-angle uncropped gallery filmstrip with active thumbnail switching.
  2. Tactile metallic finish swatches with real-time price delta recalculation.
  3. Responsive architectural size selector blocks with inventory stock validation.
  4. Technical specifications grid (Materials, Origin, Care).
  5. Quantity stepper (`- 1 +`) and 1-click Add to Bag with the exact configured variant payload.
  6. Direct navigation link to the full product PDP.

