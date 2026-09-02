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

---

## 7. Modal & Dialog Portaling Invariant (Stacking Context Safety)

### Mandatory `createPortal` for All Dialogs and Modals
Under W3C CSS specifications, applying `backdrop-filter` (e.g. `backdrop-blur-md`, `backdrop-blur-xl`), `transform`, `filter`, or `perspective` on any ancestor card creates a new CSS containing block and stacking context for all `position: fixed` descendants.
Rendering a modal/dialog inline inside a glassmorphism card traps `position: fixed; inset: 0;` inside the card's bounding box rather than covering the whole viewport, causing modals to appear clipped and cutting off buttons.

**Strict Rule**: All modals, dialogs, slide-over panels, and full-screen overlays in Next.js / React client components MUST unconditionally be portaled directly to `document.body` via React's `createPortal(modalElement, document.body)` with an SSR-safe `mounted` state guard and high z-index (`z-[9999]`):

```typescript
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

export function ComponentWithModal() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="rounded-2xl border border-white/10 bg-[#0A2A54]/30 p-6 backdrop-blur-md">
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 rounded-xl bg-accent-cyan text-[#01132B] text-xs font-bold"
      >
        Open Dialog
      </button>

      {/* Portaled Modal - Never clipped by parent backdrop-blur or overflow */}
      {mounted && isOpen && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
        >
          {/* Backdrop Click Dismiss */}
          <div className="fixed inset-0" onClick={() => setIsOpen(false)} />

          {/* Dialog Container */}
          <div className="max-w-md w-full rounded-2xl bg-[#012148] border border-white/20 p-6 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.85)] relative z-10 animate-[fadeIn_0.2s_ease-out] space-y-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-bold text-white">Dialog Title</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-white/70">Dialog content goes here...</p>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-xs text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-5 py-2 rounded-xl bg-accent-cyan text-xs font-bold text-[#01132B]"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
```


