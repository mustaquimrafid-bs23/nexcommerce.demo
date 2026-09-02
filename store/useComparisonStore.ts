import { create } from 'zustand';
import { Product } from '@/types/catalog';

interface ComparisonState {
  isOpen: boolean;
  productA: Product | null;
  productB: Product | null;
  openComparison: (a: Product, b: Product) => void;
  closeComparison: () => void;
}

export const useComparisonStore = create<ComparisonState>((set) => ({
  isOpen: false,
  productA: null,
  productB: null,
  openComparison: (a: Product, b: Product) => set({ isOpen: true, productA: a, productB: b }),
  closeComparison: () => set({ isOpen: false, productA: null, productB: null }),
}));
