import { create } from 'zustand';

interface VisualSearchState {
  isOpen: boolean;
  activeImage: string | null;
  openVisualSearch: (initialImage?: string) => void;
  closeVisualSearch: () => void;
}

export const useVisualSearchStore = create<VisualSearchState>((set) => ({
  isOpen: false,
  activeImage: null,
  openVisualSearch: (initialImage?: string) => set({ isOpen: true, activeImage: initialImage || null }),
  closeVisualSearch: () => set({ isOpen: false, activeImage: null }),
}));
