import { create } from 'zustand';

export interface VisualSearchState {
  isOpen: boolean;
  activePreset: string | null;
  activeImage: string | null;
  activeLabel: string | null;
  openVisualSearch: (presetOrImage?: string, label?: string) => void;
  closeVisualSearch: () => void;
  resetToDropzone: () => void;
  setActiveLook: (image: string, label: string, presetKey?: string) => void;
}

export const useVisualSearchStore = create<VisualSearchState>((set) => ({
  isOpen: false,
  activePreset: null,
  activeImage: null,
  activeLabel: null,
  openVisualSearch: (presetOrImage?: string, label?: string) => {
    if (presetOrImage) {
      const isPreset = ['knitwear', 'footwear', 'outerwear', 'audio', 'accessories'].includes(presetOrImage);
      set({
        isOpen: true,
        activePreset: isPreset ? presetOrImage : null,
        activeImage: isPreset ? null : presetOrImage,
        activeLabel: label || (isPreset ? presetOrImage : 'Uploaded Photo'),
      });
    } else {
      set({ isOpen: true });
    }
  },
  closeVisualSearch: () => set({ isOpen: false }),
  resetToDropzone: () => set({ activePreset: null, activeImage: null, activeLabel: null }),
  setActiveLook: (image: string, label: string, presetKey?: string) =>
    set({
      activeImage: image,
      activeLabel: label,
      activePreset: presetKey || null,
    }),
}));
