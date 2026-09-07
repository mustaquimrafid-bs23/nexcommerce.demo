const assert = require('assert');
const { z } = require('zod');

console.log('🧪 Running Zod Schema Validation Tests...');

// 1. AddToCartSchema test
const AddToCartSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().min(1).max(99),
  selectedSize: z.string().optional(),
  selectedColor: z.string().optional(),
});

const validCartPayload = {
  productId: 'prod-cashmere-sweater',
  quantity: 2,
  selectedSize: 'M',
  selectedColor: 'Oatmeal',
};

const validResult = AddToCartSchema.safeParse(validCartPayload);
assert.strictEqual(validResult.success, true, 'Valid cart payload should pass schema');
console.log('  ✓ AddToCartSchema valid payload verified');

const invalidCartPayload = {
  productId: '',
  quantity: -1,
};
const invalidResult = AddToCartSchema.safeParse(invalidCartPayload);
assert.strictEqual(invalidResult.success, false, 'Invalid cart payload should fail schema');
assert(invalidResult.error.flatten().fieldErrors.productId, 'Should flag productId error');
assert(invalidResult.error.flatten().fieldErrors.quantity, 'Should flag quantity error');
console.log('  ✓ AddToCartSchema invalid boundaries rejected cleanly');

// 2. NewsletterSchema test
const NewsletterSchema = z.object({
  email: z.string().trim().email(),
});

assert.strictEqual(NewsletterSchema.safeParse({ email: 'collector@atelier.com' }).success, true);
assert.strictEqual(NewsletterSchema.safeParse({ email: 'invalid-email' }).success, false);
console.log('  ✓ NewsletterSchema email validation verified');

// 3. CheckoutFormSchema test
const CheckoutFormSchema = z.object({
  email: z.string().trim().email(),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  paymentMethod: z.enum(['apple_pay', 'card', 'klarna']),
});

assert.strictEqual(
  CheckoutFormSchema.safeParse({
    email: 'user@example.com',
    firstName: 'Elena',
    lastName: 'Vance',
    paymentMethod: 'apple_pay',
  }).success,
  true
);

assert.strictEqual(
  CheckoutFormSchema.safeParse({
    email: 'user@example.com',
    firstName: 'Elena',
    lastName: 'Vance',
    paymentMethod: 'unsupported_wire',
  }).success,
  false
);
console.log('  ✓ CheckoutFormSchema payment method enum verified');

console.log('✨ All Zod validation schema tests passed with 100% precision!');
