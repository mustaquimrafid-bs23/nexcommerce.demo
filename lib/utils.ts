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

export function resolveProductImage(src?: string): string {
  if (!src || typeof src !== 'string' || !src.trim()) {
    return '/assets/images/products/p1.png';
  }
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) {
    return src;
  }
  let cleaned = src.replace(/^\.\.\//, '').replace(/^\.\//, '');
  if (!cleaned.startsWith('/')) {
    cleaned = '/' + cleaned;
  }
  return cleaned;
}
