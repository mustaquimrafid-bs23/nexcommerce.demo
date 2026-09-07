import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product } from '@/types/catalog';
import { MASTER_PRODUCTS } from '@/data/products';

export interface SmartListItem {
  id: string;
  product: Product;
  cadence: '30_days' | '60_days' | '90_days' | 'manual';
  depletionPercentage: number; // 0 to 100 (% remaining)
  daysRemaining: number;
  lastOrdered: string;
  nextDispatch: string;
  isPaused: boolean;
}

interface SmartListState {
  items: SmartListItem[];
  updateCadence: (id: string, cadence: SmartListItem['cadence']) => void;
  togglePause: (id: string) => void;
  removeItem: (id: string) => void;
  addItem: (product: Product, cadence?: SmartListItem['cadence']) => void;
  getDueItems: () => SmartListItem[];
}

const INITIAL_SMART_ITEMS: SmartListItem[] = [
  {
    id: 'smart-1',
    product: {
      id: 'p-care-1',
      name: 'Organic Cashmere Cedar Balm & Comb',
      price: 45,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      description: 'Handcrafted cedar care kit for maintaining pure cashmere fibers and shape.',
      tag: 'Care Essential',
      currency: 'EUR',
    },
    cadence: '30_days',
    depletionPercentage: 18,
    daysRemaining: 4,
    lastOrdered: 'Sep 27, 2026',
    nextDispatch: 'Oct 31, 2026',
    isPaused: false,
  },
  {
    id: 'smart-2',
    product: {
      id: 'p-care-2',
      name: 'Artisanal Italian Leather Conditioner',
      price: 55,
      category: 'accessories',
      image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
      description: 'Pure beeswax and natural oils formulation for maintaining footwear suppleness.',
      tag: 'Leather Care',
      currency: 'EUR',
    },
    cadence: '60_days',
    depletionPercentage: 25,
    daysRemaining: 7,
    lastOrdered: 'Aug 30, 2026',
    nextDispatch: 'Nov 03, 2026',
    isPaused: false,
  },
  {
    id: 'smart-3',
    product: MASTER_PRODUCTS[0], // Cashmere Sweater
    cadence: '90_days',
    depletionPercentage: 70,
    daysRemaining: 42,
    lastOrdered: 'Jul 15, 2026',
    nextDispatch: 'Dec 12, 2026',
    isPaused: false,
  },
  {
    id: 'smart-4',
    product: MASTER_PRODUCTS[5], // Leather Runner
    cadence: '90_days',
    depletionPercentage: 85,
    daysRemaining: 68,
    lastOrdered: 'Oct 01, 2026',
    nextDispatch: 'Jan 10, 2027',
    isPaused: false,
  },
];

export const useSmartListStore = create<SmartListState>()(
  persist(
    (set, get) => ({
      items: INITIAL_SMART_ITEMS,
      updateCadence: (id, cadence) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, cadence } : item
          ),
        }));
      },
      togglePause: (id) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, isPaused: !item.isPaused } : item
          ),
        }));
      },
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      addItem: (product, cadence = '60_days') => {
        const newItem: SmartListItem = {
          id: `smart-${Date.now()}`,
          product,
          cadence,
          depletionPercentage: 100,
          daysRemaining: 60,
          lastOrdered: 'Today',
          nextDispatch: 'In 60 days',
          isPaused: false,
        };
        set((state) => ({ items: [newItem, ...state.items] }));
      },
      getDueItems: () => {
        return get().items.filter(
          (item) => !item.isPaused && item.daysRemaining <= 10
        );
      },
    }),
    {
      name: 'nex_smart_list_nextjs',
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
