# Next.js + TypeScript Initialization Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Initialize a modern, production-grade Next.js 15 + TypeScript architecture for nexCommerce featuring the Atelier Obsidian & Warm Stone luxury design system, Zustand state management, and reusable core layout components.

**Architecture:** App Router (`src/app`) structure with TypeScript, Tailwind CSS utility layers integrated with custom CSS variable design tokens, Zustand persistent stores (`localStorage`), and client-side motion/Lenis smooth scroll integration.

**Tech Stack:** Next.js 15, React 19, TypeScript, Tailwind CSS, Lucide React, Zustand, Motion (`motion/react`), Lenis.

## Global Constraints

* Node.js v24.x environment with modern npm.
* Retain full Atelier luxury color palette (`#012148` Obsidian Navy, `#0A2A54` Surface Navy, `#f4f2ee` Warm Stone, `#E60C45` Crimson, `#3DE0FF` Electric Cyan).
* Zero "AI" buzzwords in customer-facing UI labels; focus on natural commerce terms.
* Keep existing vanilla HTML/CSS/JS files intact for side-by-side verification and reference.
* All interactive targets must maintain >= 44px touch targets and WCAG 2.1 AA contrast standards.

---

### Task 1: Initialize Next.js 15, TypeScript & Tailwind Configuration

**Files:**
- Create: `tsconfig.json`
- Create: `next.config.mjs`
- Create: `tailwind.config.ts`
- Create: `postcss.config.mjs`
- Modify: `package.json`

**Interfaces:**
- Consumes: Node.js runtime and npm packages.
- Produces: Build scripts (`npm run build`, `npm run dev`), TypeScript compilation paths (`@/*` -> `./src/*`), and Tailwind theme extensions.

- [ ] **Step 1: Install core Next.js, React, TypeScript, and Tailwind dependencies**

```bash
npm install next@latest react@latest react-dom@latest lucide-react zustand lenis clsx tailwind-merge
npm install -D typescript @types/node @types/react @types/react-dom tailwindcss postcss autoprefixer
```

- [ ] **Step 2: Create TypeScript configuration (`tsconfig.json`)**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "pages", "tests", "js"]
}
```

- [ ] **Step 3: Create Next.js configuration (`next.config.mjs`)**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
```

- [ ] **Step 4: Create Tailwind CSS configuration (`tailwind.config.ts`)**

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          950: '#00142e',
          900: '#012148',
          800: '#062d5e',
          700: '#0a3a78',
        },
        surface: {
          navy: '#0A2A54',
          card: '#08254c',
          stone: '#f4f2ee',
        },
        accent: {
          crimson: '#E60C45',
          pink: '#F13365',
          cyan: '#3DE0FF',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'serif'],
        sans: ['var(--font-sans)', 'Inter', 'sans-serif'],
        display: ['var(--font-display)', 'Manrope', 'sans-serif'],
      },
      borderRadius: {
        atelier: '12px',
        pill: '9999px',
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 5: Create PostCSS configuration (`postcss.config.mjs`)**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

- [ ] **Step 6: Update `package.json` scripts**

Update `package.json` scripts to support Next.js development and builds:
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test:legacy": "node tests/run-all-tests.js"
  }
}
```

- [ ] **Step 7: Verify compilation**

Run: `npx tsc --noEmit`
Expected: PASS with 0 errors.

---

### Task 2: Port Atelier Design Tokens & Global CSS

**Files:**
- Create: `src/app/globals.css`
- Create: `src/lib/utils.ts`

**Interfaces:**
- Consumes: Tailwind CSS base layers & Google Fonts.
- Produces: Global CSS variables (`--bg-obsidian`, `--surface-card`, `--accent-crimson`), utility class `cn()`, and typography styles.

- [ ] **Step 1: Write `src/lib/utils.ts` for class merging and currency formatting**

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = 'EUR'): string {
  if (currency === 'BDT') {
    return `৳ ${amount.toLocaleString('en-US')}`;
  }
  return `€ ${amount.toFixed(2)}`;
}
```

- [ ] **Step 2: Create `src/app/globals.css` with Atelier Obsidian tokens**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-obsidian-deep: #00142e;
  --bg-obsidian: #012148;
  --surface-navy: #0A2A54;
  --surface-card: #08254c;
  --surface-stone: #f4f2ee;
  
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.7);
  --text-muted: rgba(255, 255, 255, 0.45);
  
  --accent-crimson: #E60C45;
  --accent-pink: #F13365;
  --accent-cyan: #3DE0FF;
  
  --border-glass: rgba(255, 255, 255, 0.08);
  --border-glass-hover: rgba(255, 255, 255, 0.18);
}

body {
  background-color: var(--bg-obsidian);
  color: var(--text-primary);
  font-family: var(--font-sans), 'Inter', sans-serif;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
}

/* Luxury Glassmorphism Utilities */
.glass-panel {
  background: rgba(10, 42, 84, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--border-glass);
}

.glass-panel-hover:hover {
  border-color: var(--border-glass-hover);
  background: rgba(10, 42, 84, 0.85);
}

/* Editorial Headline Typography */
.font-editorial {
  font-family: var(--font-serif), 'Cormorant Garamond', serif;
}
```

- [ ] **Step 3: Verify CSS build**

Run: `npx tailwindcss -i ./src/app/globals.css -o ./src/app/globals-test.css --minify`
Expected: Output generated successfully with 0 errors. Remove test output.

---

### Task 3: Typed Catalog Data & Zustand State Store

**Files:**
- Create: `src/types/catalog.ts`
- Create: `src/data/products.ts`
- Create: `src/store/useCartStore.ts`
- Create: `src/store/useWishlistStore.ts`

**Interfaces:**
- Produces: `Product`, `CartItem`, `CartStore`, `WishlistStore` interfaces, and master product dataset.

- [ ] **Step 1: Create `src/types/catalog.ts`**

```typescript
export interface Product {
  id: string;
  name: string;
  category: 'footwear' | 'outerwear' | 'accessories' | 'tailoring';
  price: number;
  currency: 'EUR' | 'BDT';
  description: string;
  image: string;
  gallery?: string[];
  materials?: string[];
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  tag?: string;
  rating?: number;
  inStock?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}
```

- [ ] **Step 2: Port catalog dataset into `src/data/products.ts`**

```typescript
import { Product } from '@/types/catalog';

export const MASTER_PRODUCTS: Product[] = [
  {
    id: 'nx-boot-01',
    name: 'Atelier Lugged Leather Chelsea',
    category: 'footwear',
    price: 490,
    currency: 'EUR',
    description: 'Full-grain calfskin leather boots crafted in Tuscany with Goodyear-welted rubber lug soles.',
    image: '/assets/images/products/chelsea-boot.png',
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Obsidian Black', hex: '#111111' },
      { name: 'Warm Espresso', hex: '#3B2F2F' }
    ],
    tag: 'Bespoke Craft',
    rating: 4.9,
    inStock: true
  },
  {
    id: 'nx-coat-02',
    name: 'Cashmere Double-Breasted Overcoat',
    category: 'outerwear',
    price: 1250,
    currency: 'EUR',
    description: '100% pure Mongolian cashmere structured coat with horn buttons and cupro silk lining.',
    image: '/assets/images/products/cashmere-coat.png',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Midnight Navy', hex: '#012148' },
      { name: 'Warm Camel', hex: '#C19A6B' }
    ],
    tag: 'Maison Icon',
    rating: 5.0,
    inStock: true
  },
  {
    id: 'nx-bag-03',
    name: 'Sculptural Leather Duffle',
    category: 'accessories',
    price: 880,
    currency: 'EUR',
    description: 'Minimalist travel duffle crafted from vegetable-tanned Italian leather with palladium hardware.',
    image: '/assets/images/products/leather-duffle.png',
    colors: [
      { name: 'Obsidian', hex: '#012148' },
      { name: 'Saddle Tan', hex: '#8B4513' }
    ],
    tag: 'Limited Edition',
    rating: 4.8,
    inStock: true
  }
];
```

- [ ] **Step 3: Create `src/store/useCartStore.ts` with Zustand & LocalStorage persistence**

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types/catalog';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size?: string, color?: string) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      addItem: (product, size, color) => {
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.product.id === product.id &&
              i.selectedSize === size &&
              i.selectedColor === color
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += 1;
            return { items: updated, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              { product, quantity: 1, selectedSize: size, selectedColor: color },
            ],
            isOpen: true,
          };
        });
      },
      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (i) =>
              !(
                i.product.id === productId &&
                i.selectedSize === size &&
                i.selectedColor === color
              )
          ),
        }));
      },
      updateQuantity: (productId, quantity, size, color) => {
        if (quantity <= 0) {
          get().removeItem(productId, size, color);
          return;
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.product.id === productId &&
            i.selectedSize === size &&
            i.selectedColor === color
              ? { ...i, quantity }
              : i
          ),
        }));
      },
      clearCart: () => set({ items: [] }),
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'nex_cart_nextjs',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

- [ ] **Step 4: Create `src/store/useWishlistStore.ts`**

```typescript
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/catalog';

interface WishlistState {
  savedItems: Product[];
  toggleWishlist: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      savedItems: [],
      toggleWishlist: (product) => {
        const exists = get().savedItems.some((item) => item.id === product.id);
        if (exists) {
          set({
            savedItems: get().savedItems.filter((item) => item.id !== product.id),
          });
        } else {
          set({ savedItems: [...get().savedItems, product] });
        }
      },
      isWishlisted: (productId) => {
        return get().savedItems.some((item) => item.id === productId);
      },
      clearWishlist: () => set({ savedItems: [] }),
    }),
    {
      name: 'nex_wishlist_nextjs',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

- [ ] **Step 5: Verify Store Logic with TypeScript Compiler**

Run: `npx tsc --noEmit`
Expected: 0 type errors.

---

### Task 4: Global Luxury Layout & Navigation Components

**Files:**
- Create: `src/app/layout.tsx`
- Create: `src/components/layout/Header.tsx`
- Create: `src/components/layout/Footer.tsx`
- Create: `src/components/cart/MiniCartDrawer.tsx`

**Interfaces:**
- Produces: Root Layout wrapping all pages with Google Fonts, Header, MiniCart drawer, and Footer.

- [ ] **Step 1: Create `src/components/layout/Header.tsx`**

```tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, Search, Menu, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const openCart = useCartStore((state) => state.openCart);
  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.savedItems.length);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-obsidian-900/90 backdrop-blur-md border-b border-white/10 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Mobile Menu Button & Brand */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-white/80 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          
          <Link href="/" className="flex items-center gap-2">
            <span className="font-editorial text-2xl font-bold tracking-tight text-white">
              nex<span className="text-accent-pink">Commerce</span>
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="/category?cat=all" className="text-sm text-white/80 hover:text-white transition-colors">
            Collections
          </Link>
          <Link href="/smart-list" className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1.5">
            Smart List <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-accent-pink/20 text-accent-pink font-semibold">NEW</span>
          </Link>
          <Link href="/discovery" className="text-sm text-white/80 hover:text-white transition-colors">
            Discovery
          </Link>
          <Link href="/concierge" className="text-sm text-white/80 hover:text-white transition-colors">
            Stylist
          </Link>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link href="/discovery" className="p-2 text-white/80 hover:text-white transition-colors" aria-label="Search">
            <Search size={20} />
          </Link>
          
          <Link href="/wishlist" className="relative p-2 text-white/80 hover:text-white transition-colors" aria-label="Wishlist">
            <Heart size={20} />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-pink text-[10px] flex items-center justify-center font-bold text-white">
                {wishlistCount}
              </span>
            )}
          </Link>

          <button
            onClick={openCart}
            className="relative p-2 text-white/80 hover:text-white transition-colors"
            aria-label="Shopping Bag"
          >
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-accent-crimson text-[10px] flex items-center justify-center font-bold text-white">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Create `src/components/cart/MiniCartDrawer.tsx`**

```tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { formatPrice } from '@/lib/utils';

export function MiniCartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getSubtotal } =
    useCartStore();
  const subtotal = getSubtotal();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-md bg-obsidian-950 border-l border-white/10 h-full flex flex-col z-10 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} className="text-accent-pink" />
            <h2 className="text-lg font-semibold tracking-wide text-white">Shopping Bag</h2>
          </div>
          <button
            onClick={closeCart}
            className="p-2 text-white/60 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            aria-label="Close bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {items.length === 0 ? (
            <div className="text-center py-16 space-y-4">
              <ShoppingBag size={48} className="mx-auto text-white/20" />
              <p className="text-white/60 text-sm">Your shopping bag is currently empty.</p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 rounded-full border border-white/20 text-white text-xs font-semibold uppercase tracking-wider hover:bg-white/5 transition-colors"
              >
                Explore Collections
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedSize}-${idx}`}
                className="flex gap-4 p-3 rounded-xl bg-surface-navy/40 border border-white/5"
              >
                <div className="relative w-20 h-20 bg-surface-card rounded-lg overflow-hidden flex-shrink-0">
                  {item.product.image ? (
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/20">
                      <ShoppingBag size={24} />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-white truncate">{item.product.name}</h3>
                  <p className="text-xs text-white/50 mt-0.5">{formatPrice(item.product.price)}</p>
                  {item.selectedSize && (
                    <span className="inline-block mt-1 text-[11px] px-2 py-0.5 rounded bg-white/5 text-white/70">
                      Size: {item.selectedSize}
                    </span>
                  )}

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-white/10 rounded-md">
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="px-2 py-0.5 text-xs text-white/60 hover:text-white"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-medium text-white">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedSize,
                            item.selectedColor
                          )
                        }
                        className="px-2 py-0.5 text-xs text-white/60 hover:text-white"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() =>
                        removeItem(item.product.id, item.selectedSize, item.selectedColor)
                      }
                      className="text-white/40 hover:text-accent-crimson transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-obsidian-900/80 space-y-4">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/60">Estimated Subtotal</span>
              <span className="text-white font-semibold">{formatPrice(subtotal)}</span>
            </div>
            <Link
              href="/cart"
              onClick={closeCart}
              className="block w-full py-3.5 text-center rounded-xl bg-accent-crimson text-white font-semibold text-xs uppercase tracking-widest hover:bg-accent-crimson/90 transition-colors shadow-lg shadow-accent-crimson/20"
            >
              Review Bag &amp; Checkout
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
```

- [ ] **Step 3: Create `src/components/layout/Footer.tsx`**

```tsx
import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-obsidian-950 border-t border-white/10 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          <div className="space-y-4">
            <span className="font-editorial text-2xl font-bold tracking-tight text-white">
              nex<span className="text-accent-pink">Commerce</span>
            </span>
            <p className="text-xs text-white/60 leading-relaxed">
              Intelligent luxury lifestyle and agentic commerce platform crafted with precision, human curation, and privacy sovereignty.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-white mb-4">Collections</h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li><Link href="/category?cat=footwear" className="hover:text-white transition-colors">Artisanal Footwear</Link></li>
              <li><Link href="/category?cat=outerwear" className="hover:text-white transition-colors">Structured Outerwear</Link></li>
              <li><Link href="/category?cat=accessories" className="hover:text-white transition-colors">Leather Accessories</Link></li>
              <li><Link href="/category?cat=tailoring" className="hover:text-white transition-colors">Bespoke Tailoring</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-white mb-4">Client Atelier</h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li><Link href="/concierge" className="hover:text-white transition-colors">Private Stylist</Link></li>
              <li><Link href="/tracking" className="hover:text-white transition-colors">Courier Journey</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Zero-Knowledge Vault</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Client Services</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase font-semibold tracking-wider text-white mb-4">Maison Newsletter</h4>
            <p className="text-xs text-white/60 mb-3">Receive private invitations to seasonal private collection releases.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="bg-surface-navy/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-accent-pink flex-1"
              />
              <button className="px-4 py-2 bg-white text-obsidian-900 rounded-lg text-xs font-semibold hover:bg-white/90 transition-colors">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <p>© {new Date().getFullYear()} nexCommerce by Brain Station 23 / nopStation. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white/70 transition-colors">Terms of Engagement</Link>
            <Link href="/privacy" className="hover:text-white/70 transition-colors">Privacy Charter</Link>
            <Link href="/security" className="hover:text-white/70 transition-colors">Authenticity Ledger</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Create `src/app/layout.tsx`**

```tsx
import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { MiniCartDrawer } from '@/components/cart/MiniCartDrawer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'nexCommerce — Intelligent Shopping & Intent Discovery',
  description: 'A premium luxury lifestyle shopping experience that understands intent and crafts tailored collections.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} ${manrope.variable}`}>
      <body className="min-h-screen flex flex-col bg-obsidian-900 text-white antialiased">
        <Header />
        <main className="flex-1 pt-20">{children}</main>
        <Footer />
        <MiniCartDrawer />
      </body>
    </html>
  );
}
```

---

### Task 5: Initial Elevated Homepage Scaffold

**Files:**
- Create: `src/app/page.tsx`
- Create: `src/components/home/HeroSection.tsx`
- Create: `src/components/home/ProductGrid.tsx`

**Interfaces:**
- Produces: Homepage route (`/`) showcasing hero storytelling banner, curated collection grid, and 1-click Add to Bag.

- [ ] **Step 1: Create `src/components/home/HeroSection.tsx`**

```tsx
import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-24">
      {/* Background Radial Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-pink/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] bg-accent-cyan/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/80">
          <Sparkles size={14} className="text-accent-pink" />
          <span>Atelier Winter Collection 2026</span>
        </div>

        <h1 className="font-editorial text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-white leading-tight">
          Where Thoughtful Luxury <br />
          <span className="italic font-normal">Meets Natural Discovery</span>
        </h1>

        <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto font-light leading-relaxed">
          Crafted with human artisanal precision and intuitive intent search, curated for effortless personal style.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/category?cat=all"
            className="px-8 py-3.5 rounded-full bg-white text-obsidian-950 font-semibold text-xs uppercase tracking-widest hover:bg-white/90 transition-all flex items-center gap-2 group shadow-xl shadow-white/5"
          >
            Explore Collection
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/discovery"
            className="px-8 py-3.5 rounded-full bg-surface-navy/60 border border-white/15 text-white font-semibold text-xs uppercase tracking-widest hover:bg-surface-navy transition-all"
          >
            Intent Search
          </Link>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create `src/components/home/ProductGrid.tsx`**

```tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { ShoppingBag, Heart } from 'lucide-react';
import { MASTER_PRODUCTS } from '@/data/products';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { formatPrice } from '@/lib/utils';

export function ProductGrid() {
  const addItem = useCartStore((state) => state.addItem);
  const { toggleWishlist, isWishlisted } = useWishlistStore();

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="flex items-end justify-between mb-10">
        <div>
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-pink">
            Curated Selection
          </span>
          <h2 className="font-editorial text-3xl sm:text-4xl text-white font-normal mt-1">
            Featured Atelier Pieces
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {MASTER_PRODUCTS.map((product) => {
          const wishlisted = isWishlisted(product.id);

          return (
            <div
              key={product.id}
              className="group rounded-2xl bg-surface-navy/40 border border-white/10 hover:border-white/20 transition-all duration-300 flex flex-col overflow-hidden"
            >
              {/* Product Visual Container */}
              <div className="relative aspect-[4/5] bg-surface-card overflow-hidden">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/20">
                    <ShoppingBag size={40} />
                  </div>
                )}

                {product.tag && (
                  <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-obsidian-950/80 backdrop-blur-md text-white border border-white/10">
                    {product.tag}
                  </span>
                )}

                {/* Wishlist Floating Button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md transition-all ${
                    wishlisted
                      ? 'bg-accent-pink text-white'
                      : 'bg-obsidian-950/60 text-white/70 hover:text-white hover:bg-obsidian-950'
                  }`}
                  aria-label="Save to wishlist"
                >
                  <Heart size={16} fill={wishlisted ? 'currentColor' : 'none'} />
                </button>
              </div>

              {/* Product Details */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-editorial text-xl text-white font-medium">{product.name}</h3>
                  <p className="text-xs text-white/60 line-clamp-2 mt-1">{product.description}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                  <span className="text-sm font-semibold text-white">
                    {formatPrice(product.price, product.currency)}
                  </span>

                  <button
                    onClick={() => addItem(product)}
                    className="px-4 py-2 rounded-full bg-white/10 hover:bg-accent-crimson text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <ShoppingBag size={14} />
                    <span>Quick Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Create `src/app/page.tsx`**

```tsx
import { HeroSection } from '@/components/home/HeroSection';
import { ProductGrid } from '@/components/home/ProductGrid';

export default function HomePage() {
  return (
    <div className="space-y-12">
      <HeroSection />
      <ProductGrid />
    </div>
  );
}
```

- [ ] **Step 4: Build and Smoke Test Next.js App**

Run: `npm run build`
Expected: Next.js generates static routes and dynamic bundles with 0 compilation errors.

---

### Task 6: Migration Verification & Dual-Mode Coexistence

**Files:**
- Create: `tests/test-nextjs-build.js`
- Modify: `package.json`

**Interfaces:**
- Produces: Automated verification script ensuring Next.js builds clean and legacy demo remains fully operational.

- [ ] **Step 1: Create verification script `tests/test-nextjs-build.js`**

```javascript
const { execSync } = require('child_process');
const assert = require('assert');
const fs = require('fs');

console.log('Testing Next.js TypeScript Compilation and Build...');

try {
  const result = execSync('npx next build', { encoding: 'utf8' });
  console.log(result);
  assert(fs.existsSync('.next'), '.next build folder should exist');
  console.log('PASS: Next.js 15 build succeeded without errors.');
} catch (err) {
  console.error('FAIL: Next.js build failed:');
  if (err.stdout) console.error(err.stdout.toString());
  if (err.stderr) console.error(err.stderr.toString());
  process.exit(1);
}
```

- [ ] **Step 2: Run verification script**

Run: `node tests/test-nextjs-build.js`
Expected: PASS: Next.js 15 build succeeded without errors.
