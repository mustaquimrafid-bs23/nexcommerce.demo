import { create } from 'zustand';

export type CurrencyCode = 'EUR' | 'BDT';

export interface CurrencyState {
  currency: CurrencyCode;
  exchangeRate: number; // 1 EUR = 130 BDT
  setCurrency: (currency: CurrencyCode) => void;
  toggleCurrency: () => void;
  formatPrice: (amountInEur: number) => string;
}

export const useCurrencyStore = create<CurrencyState>((set, get) => ({
  currency: 'EUR',
  exchangeRate: 130,

  setCurrency: (currency: CurrencyCode) => {
    set({ currency });
    if (typeof window !== 'undefined') {
      localStorage.setItem('nex_currency', currency);
      window.dispatchEvent(new CustomEvent('currency-changed', { detail: { currency } }));
    }
  },

  toggleCurrency: () => {
    const next = get().currency === 'EUR' ? 'BDT' : 'EUR';
    get().setCurrency(next);
  },

  formatPrice: (amountInEur: number) => {
    const { currency, exchangeRate } = get();
    if (currency === 'BDT') {
      const converted = Math.round(amountInEur * exchangeRate);
      return `৳ ${converted.toLocaleString('en-US')}`;
    }
    return `€ ${amountInEur.toFixed(2)}`;
  },
}));

// Hydrate from localStorage on client boot
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('nex_currency') as CurrencyCode | null;
  if (stored && (stored === 'EUR' || stored === 'BDT')) {
    useCurrencyStore.setState({ currency: stored });
  }
}
