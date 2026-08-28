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
