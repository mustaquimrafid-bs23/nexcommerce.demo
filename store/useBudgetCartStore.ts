import { create } from 'zustand';

interface BudgetCartState {
  isOpen: boolean;
  targetBudget: number;
  occasionTheme: string;
  openBudget: (targetBudget?: number, occasionTheme?: string) => void;
  closeBudget: () => void;
}

export const useBudgetCartStore = create<BudgetCartState>((set) => ({
  isOpen: false,
  targetBudget: 500,
  occasionTheme: 'autumn',
  openBudget: (targetBudget = 500, occasionTheme = 'autumn') =>
    set({
      isOpen: true,
      targetBudget,
      occasionTheme,
    }),
  closeBudget: () => set({ isOpen: false }),
}));
