import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, CartItem } from '@/types/catalog';

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
  getSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

const VALID_COUPONS: Record<string, { discount: number; label: string }> = {
  NEX10: { discount: 10, label: '10% Atelier Welcome Privileges' },
  LUXURY20: { discount: 20, label: '20% Seasonal Maison Private Sale' },
  VIP30: { discount: 30, label: '30% Atelier Collector Privilege' },
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
      addItem: (product, size, color, quantity = 1) => {
        const qtyToAdd = Math.max(1, quantity);
        set((state) => {
          const existingIndex = state.items.findIndex(
            (i) =>
              i.product.id === product.id &&
              i.selectedSize === size &&
              i.selectedColor === color
          );

          if (existingIndex > -1) {
            const updated = [...state.items];
            updated[existingIndex].quantity += qtyToAdd;
            return { items: updated, isOpen: true };
          }

          return {
            items: [
              ...state.items,
              { product, quantity: qtyToAdd, selectedSize: size, selectedColor: color },
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
      clearCart: () =>
        set({ items: [], appliedCoupon: null, discountPercentage: 0 }),
      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
      },
      getDiscountAmount: () => {
        const subtotal = get().getSubtotal();
        return (subtotal * get().discountPercentage) / 100;
      },
      getShippingFee: () => {
        const subtotal = get().getSubtotal();
        if (subtotal === 0 || subtotal >= 150) return 0;
        return 12; // standard €12 under threshold
      },
      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscountAmount();
        const shipping = get().getShippingFee();
        return Math.max(0, subtotal - discount + shipping);
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
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
    }
  )
);
