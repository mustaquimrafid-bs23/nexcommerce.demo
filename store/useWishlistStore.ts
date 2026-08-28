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
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
