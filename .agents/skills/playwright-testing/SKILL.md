---
name: playwright-testing
description: Use when writing, running, or debugging end-to-end (E2E) browser tests, asserting user journeys, validating mobile responsiveness, or testing e-commerce checkout flows with Playwright.
---

# Playwright End-to-End (E2E) Testing Standards

## Overview
Playwright tests verify real user journeys inside actual browsers (Chromium, Firefox, WebKit, and mobile viewports). Well-written tests are **resilient, fast, and deterministic** — they never rely on arbitrary sleep timers and use user-visible accessible locators.

---

## When to Use

### Triggering Conditions
- Writing or maintaining end-to-end user journey tests (Cart, Checkout, Search, Wishlist, Order Tracking).
- Validating mobile responsiveness, touch target sizes ($\ge 44\text{px}$), and layout reflow.
- Running browser regression suites before code merges or production deployments.
- Capturing visual screenshot proofs across desktop (`1440x900`) and mobile (`375x812`) viewports.
- Debugging unexpected UI layout shifts or broken interaction flows.

### When NOT to Use
- Pure unit tests of deterministic mathematical or regex parsing functions (use `vitest` or `node tests/...` instead).
- Testing internal TypeScript type definitions without any runtime browser interaction.

---

## 1. Resilient Locator Strategy

Always locate elements using **user-visible roles and accessible names**. Never use fragile CSS class names or DOM hierarchies (`div > div:nth-child(2)`).

| Priority | Locator Type | Playwright Syntax | Why It Is Better |
| :--- | :--- | :--- | :--- |
| **1st** | User Role & Accessible Name | `page.getByRole('button', { name: /add to bag/i })` | Mirrors how real users and screen readers see the button. |
| **2nd** | Label Text | `page.getByLabel('Delivery Postal Code')` | Ensures forms have proper accessible labels. |
| **3rd** | Visible Text | `page.getByText('Order Confirmed')` | Matches plain text the user scans for. |
| **4th** | Dedicated Test ID | `page.getByTestId('cart-subtotal-value')` | Immune to styling or CSS refactors. |
| ❌ *Avoid* | Fragile CSS Path | `page.locator('.drawer-root > div:first-child')` | Breaks easily whenever markup changes. |

---

## 2. Auto-Waiting Over Arbitrary Sleeps

Playwright automatically waits for elements to be visible, enabled, and stable before clicking or filling.

```typescript
// ❌ WRONG: Flaky arbitrary sleep
await page.click('#checkout-btn');
await page.waitForTimeout(3000); // Brittle and slow!
expect(await page.locator('.summary').textContent()).toContain('$120');

// ✅ CORRECT: Auto-waiting with web-first assertions
await page.getByRole('button', { name: /proceed to checkout/i }).click();
await expect(page.getByTestId('order-summary-total')).toHaveText('$120.00');
```

---

## 3. Essential E-Commerce Test Patterns

### Pattern A: Shopping Cart Flow & List Depletion
Always test the full cycle, including removing every item down to 0 items:

```typescript
test('user can add item to bag, view drawer, and clear to empty state', async ({ page }) => {
  await page.goto('/product/atelier-cashmere-sweater');

  // 1. Select size and add to bag
  await page.getByRole('button', { name: 'M' }).click();
  await page.getByRole('button', { name: /add to bag/i }).click();

  // 2. Verify drawer slides open with item
  const cartDrawer = page.getByRole('dialog', { name: /shopping bag/i });
  await expect(cartDrawer).toBeVisible();
  await expect(cartDrawer.getByText('Architectural Cashmere Sweater')).toBeVisible();

  // 3. Mandatory 0-item depletion test
  await cartDrawer.getByRole('button', { name: /remove/i }).click();
  
  // Verify empty state is displayed and counter resets to 0
  await expect(cartDrawer.getByText(/your bag is empty/i)).toBeVisible();
  await expect(page.getByTestId('cart-counter-badge')).toHaveText('0');
});
```

### Pattern B: Mobile Viewport & Touch Target Validation
Verify that buttons do not overlap and meet minimum touch target standards:

```typescript
test('mobile nav drawer opens cleanly with accessible touch targets', async ({ page }) => {
  // Emulate mobile screen (iPhone 12/13/14 size)
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');

  const menuButton = page.getByRole('button', { name: /open navigation/i });
  const box = await menuButton.boundingBox();

  // Verify Apple HIG / Material minimum 44x44px target
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);

  await menuButton.click();
  await expect(page.getByRole('navigation', { name: /mobile menu/i })).toBeVisible();
});
```

---

## 4. Visual Screenshot Capture

Save visual evidence after critical interactions for regression tracking:

```typescript
// Capture full page screenshot on desktop
await page.screenshot({ path: 'artifacts/desktop-checkout.png', fullPage: true });

// Capture specific component
await page.getByTestId('mini-cart-drawer').screenshot({ path: 'artifacts/mini-cart-drawer.png' });
```

---

## 5. Common Testing Mistakes to Avoid

1. **Using `page.waitForTimeout(ms)`**: Never use hardcoded sleeps. Use `expect(...).toBeVisible()`, `expect(...).toHaveText()`, or `page.waitForResponse(...)`.
2. **Missing Empty State Tests**: Always test what happens when a list or search result is emptied (`0 items`).
3. **Hardcoding Variable Backend Data**: Do not assert exact prices if they change dynamically by region or discount; assert numeric format (e.g. `/^\$\d+(\.\d{2})?$/`).
4. **Ignoring Desktop vs. Mobile Differences**: Elements with `.desktop-only` are hidden on mobile. Always test both viewports.
