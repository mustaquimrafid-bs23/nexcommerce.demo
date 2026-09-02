import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types/catalog';
import { resolveProductImage } from '@/lib/utils';

export function normalizeRawCartItem(raw: any, idx: number = 0): CartItem {
  if (!raw) {
    return {
      product: {
        id: `item-${idx}`,
        name: 'Luxury Piece',
        brand: 'nexCommerce Atelier',
        category: 'apparel',
        subCategory: 'Collection',
        price: 0,
        formattedPrice: '€ 0.00',
        currency: 'EUR',
        description: '',
        image: '/assets/images/products/p1.png',
        gallery: ['/assets/images/products/p1.png'],
        sizes: ['S', 'M', 'L'],
        colors: [],
        rating: 4.9,
        inStock: true,
        tags: [],
      },
      quantity: 1,
      selectedSize: 'M',
      selectedColor: 'Standard',
    };
  }

  const p = raw.product || raw;
  const id = p.id || raw.id || `p-${idx}`;
  const name = p.name || raw.name || raw.title || 'Luxury Piece';
  const price = Number(p.price ?? raw.price ?? 0);
  const brand = p.brand || raw.brand || raw.house || 'nexCommerce Atelier';
  const rawImg = p.image || raw.image || raw.img || p.img || '/assets/images/products/p1.png';
  const image = resolveProductImage(rawImg);
  const quantity = Math.max(1, parseInt(raw.quantity || raw.qty || p.quantity || p.qty, 10) || 1);
  const selectedSize = raw.selectedSize || raw.size || p.size || 'M';
  const selectedColor = raw.selectedColor || raw.color || p.color || 'Standard';

  return {
    product: {
      id,
      name,
      brand,
      category: p.category || raw.category || 'apparel',
      subCategory: p.subCategory || raw.subCategory || 'Collection',
      price,
      formattedPrice: p.formattedPrice || raw.formattedPrice || `€ ${price.toFixed(2)}`,
      currency: p.currency || raw.currency || 'EUR',
      description: p.description || raw.description || '',
      image,
      gallery: Array.isArray(p.gallery) ? p.gallery.map(resolveProductImage) : [image],
      sizes: Array.isArray(p.sizes) ? p.sizes : ['S', 'M', 'L'],
      colors: Array.isArray(p.colors) ? p.colors : [],
      rating: Number(p.rating || 4.9),
      inStock: p.inStock !== false,
      tags: Array.isArray(p.tags) ? p.tags : [],
    },
    quantity,
    selectedSize,
    selectedColor,
  };
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  appliedCoupon: string | null;
  discountPercentage: number;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, size?: string, color?: string, quantity?: number) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
  syncFromStorage: () => void;
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const VALID_COUPONS: Record<string, { discount: number; label: string; freeShipping?: boolean }> = {
  NEX10: { discount: 10, label: '10% Welcome Privilege' },
  LUXURY20: { discount: 20, label: '20% Seasonal Maison Private Sale' },
  VIP20: { discount: 20, label: '20% Season Privilege' },
  ATELIER15: { discount: 15, label: '15% Atelier Member Privilege' },
  WELCOME10: { discount: 10, label: '10% Welcome Courtesy' },
  VIP30: { discount: 30, label: '30% Atelier Collector Privilege' },
  FREESHIP: { discount: 0, label: 'Complimentary Express Delivery', freeShipping: true },
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      appliedCoupon: null,
      discountPercentage: 0,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      syncFromStorage: () => {
        if (typeof window === 'undefined') return;
        try {
          // Check if nex_cart exists with items
          const legacyCart = localStorage.getItem('nex_cart');
          if (legacyCart) {
            const parsed = JSON.parse(legacyCart);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const normalized = parsed.map((item, idx) => normalizeRawCartItem(item, idx));
              set({ items: normalized });
              return;
            }
          }
        } catch (e) {}
      },
      addItem: (product, size = 'M', color = 'Standard', quantity = 1) => {
        const qtyToAdd = Math.max(1, quantity);
        set((state) => {
          const currentItems = state.items.map((i, idx) => normalizeRawCartItem(i, idx));
          const existingIndex = currentItems.findIndex(
            (i) =>
              i.product.id === product.id &&
              i.selectedSize === size &&
              i.selectedColor === color
          );

          if (existingIndex > -1) {
            const updated = [...currentItems];
            updated[existingIndex].quantity += qtyToAdd;
            return { items: updated, isOpen: true };
          }

          const newItem: CartItem = {
            product: {
              ...product,
              image: resolveProductImage(product.image),
            },
            quantity: qtyToAdd,
            selectedSize: size,
            selectedColor: color,
          };

          return {
            items: [...currentItems, newItem],
            isOpen: true,
          };
        });
      },
      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items
            .map((i, idx) => normalizeRawCartItem(i, idx))
            .filter(
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
          items: state.items
            .map((i, idx) => normalizeRawCartItem(i, idx))
            .map((i) =>
              i.product.id === productId &&
              i.selectedSize === size &&
              i.selectedColor === color
                ? { ...i, quantity }
                : i
            ),
        }));
      },
      applyCoupon: (code) => {
        const clean = code.trim().toUpperCase();
        if (VALID_COUPONS[clean]) {
          const coupon = VALID_COUPONS[clean];
          set({ appliedCoupon: clean, discountPercentage: coupon.discount });
          return { success: true, message: `Applied: ${coupon.label}` };
        }
        return {
          success: false,
          message: 'Invalid promo code. Try NEX10 or LUXURY20.',
        };
      },
      removeCoupon: () => set({ appliedCoupon: null, discountPercentage: 0 }),
      clearCart: () => {
        set({ items: [], appliedCoupon: null, discountPercentage: 0 });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('nex_cart');
        }
      },
      getSubtotal: () => {
        const items = get().items;
        return items.reduce((sum, item, idx) => {
          const norm = normalizeRawCartItem(item, idx);
          return sum + norm.product.price * norm.quantity;
        }, 0);
      },
      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        return (subtotal * get().discountPercentage) / 100;
      },
      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 150) return 0;
        const coupon = get().appliedCoupon ? VALID_COUPONS[get().appliedCoupon!] : null;
        if (coupon?.freeShipping) return 0;
        return 12; // standard €12 under threshold
      },
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },
      getItemCount: () => {
        const items = get().items;
        return items.reduce((count, item, idx) => {
          const norm = normalizeRawCartItem(item, idx);
          return count + norm.quantity;
        }, 0);
      },
    }),
    {
      name: 'nex_cart_nextjs',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Normalize items on rehydrate
          if (Array.isArray(state.items)) {
            state.items = state.items.map((i, idx) => normalizeRawCartItem(i, idx));
          }
          // If items is empty, try to sync from legacy nex_cart
          if ((!state.items || state.items.length === 0) && typeof window !== 'undefined') {
            try {
              const legacyCart = localStorage.getItem('nex_cart');
              if (legacyCart) {
                const parsed = JSON.parse(legacyCart);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  state.items = parsed.map((i, idx) => normalizeRawCartItem(i, idx));
                }
              }
            } catch (e) {}
          }
        }
      },
    }
  )
);
