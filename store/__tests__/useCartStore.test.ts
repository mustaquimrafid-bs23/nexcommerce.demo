import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from '@/store/useCartStore';
import { Product } from '@/types/catalog';

const sampleProduct: Product = {
  id: 'prod-cashmere-sweater',
  name: 'Architectural Cashmere Sweater',
  price: 680,
  currency: 'EUR',
  category: 'outerwear',
  description: 'Pure Mongolian cashmere knit with sculpted proportions.',
  image: '/assets/products/clothing-1.jpg',
  inStock: true,
};

describe('useCartStore Zustand Unit Tests', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  it('should start with an empty cart', () => {
    const { items, getItemCount, getSubtotal } = useCartStore.getState();
    expect(items).toEqual([]);
    expect(getItemCount()).toBe(0);
    expect(getSubtotal()).toBe(0);
  });

  it('should add an item to the cart and open drawer', () => {
    useCartStore.getState().addItem(sampleProduct, 'M', 'Oatmeal');
    const { items, getItemCount, getSubtotal, isOpen } = useCartStore.getState();

    expect(items.length).toBe(1);
    expect(items[0].product.id).toBe(sampleProduct.id);
    expect(items[0].quantity).toBe(1);
    expect(items[0].selectedSize).toBe('M');
    expect(items[0].selectedColor).toBe('Oatmeal');
    expect(getItemCount()).toBe(1);
    expect(getSubtotal()).toBe(680);
    expect(isOpen).toBe(true);
  });

  it('should increment quantity when adding the same item with identical variant', () => {
    useCartStore.getState().addItem(sampleProduct, 'M', 'Oatmeal');
    useCartStore.getState().addItem(sampleProduct, 'M', 'Oatmeal');
    const { items, getItemCount, getSubtotal } = useCartStore.getState();

    expect(items.length).toBe(1);
    expect(items[0].quantity).toBe(2);
    expect(getItemCount()).toBe(2);
    expect(getSubtotal()).toBe(1360);
  });

  it('should remove item correctly', () => {
    useCartStore.getState().addItem(sampleProduct, 'M', 'Oatmeal');
    expect(useCartStore.getState().getItemCount()).toBe(1);

    useCartStore.getState().removeItem(sampleProduct.id, 'M', 'Oatmeal');
    expect(useCartStore.getState().getItemCount()).toBe(0);
    expect(useCartStore.getState().items).toEqual([]);
  });

  it('should apply valid coupon discount and calculate total', () => {
    useCartStore.getState().addItem(sampleProduct, 'M', 'Oatmeal'); // 680
    const result = useCartStore.getState().applyCoupon('NEX10');

    expect(result.success).toBe(true);
    expect(useCartStore.getState().discountPercentage).toBe(10);
    expect(useCartStore.getState().getDiscountAmount()).toBe(68);
    expect(useCartStore.getState().getTotal()).toBe(612);
  });
});
