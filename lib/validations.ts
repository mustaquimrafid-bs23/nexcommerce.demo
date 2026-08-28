import { z } from 'zod';

/**
 * Add to Cart Server Action Validation Schema
 */
export const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(99, 'Max quantity is 99'),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
});

export type AddToCartInput = z.infer<typeof AddToCartSchema>;

/**
 * Coupon Code Validation Schema
 */
export const ApplyCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3, 'Coupon code must be at least 3 characters')
    .max(20, 'Coupon code is too long')
    .toUpperCase(),
});

export type ApplyCouponInput = z.infer<typeof ApplyCouponSchema>;

/**
 * Newsletter Subscription Validation Schema
 */
export const NewsletterSchema = z.object({
  email: z.string().trim().email('Please enter a valid email address'),
});

export type NewsletterInput = z.infer<typeof NewsletterSchema>;

/**
 * Checkout Customer & Shipping Validation Schema
 */
export const CheckoutFormSchema = z.object({
  email: z.string().trim().email('Valid email is required'),
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  address: z.string().trim().min(5, 'Street address is required'),
  city: z.string().trim().min(2, 'City is required'),
  postalCode: z.string().trim().min(3, 'Postal code is required'),
  country: z.string().trim().min(2, 'Country is required'),
  paymentMethod: z.enum(['apple_pay', 'card', 'klarna']),
});

export type CheckoutFormInput = z.infer<typeof CheckoutFormSchema>;
