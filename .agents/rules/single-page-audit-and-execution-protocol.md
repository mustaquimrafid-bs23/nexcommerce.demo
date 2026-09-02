# Single-Page Incremental Execution & Approval Protocol

## Invariant Core Workflow
When tasked with auditing, polishing, debugging, or fixing the storefront, you MUST execute on strictly ONE page per cycle across the 28 storefront pages using this non-negotiable 6-step lifecycle:

```
[ Step 1: Automatic 7-Dimension UI/UX Audit ] 
      │ (Capture Desktop 1440px & Mobile 375px screenshots; audit Content, Visual, Interactions, Parity, Flows, Edges, a11y)
      ▼
[ Step 2: Findings & Implementation Plan ] 
      │ (Create implementation_plan.md for THIS SINGLE PAGE ONLY with 3 design options)
      ▼
[ Step 3: STOP & Request User Approval ] 
      │ (Present findings, link plan, DO NOT modify code automatically)
      ▼
[ Step 4: User Approval Received ] 
      │ (Execute fixes strictly for the approved single page)
      ▼
[ Step 5: 3-Tier Verification ] 
      │ (Unit test + Functional assert + Live Playwright screenshots)
      ▼
[ Step 6: Present Results & STOP ] 
      │ (Provide evidence, update walkthrough, wait for user signal before next page)
```

## 28-Page Master Sequence
1. `index.html` (Homepage)
2. `pages/discovery.html` (Visual Discovery & Search)
3. `pages/category.html` (Category PLP)
4. `pages/product.html` (Product PDP)
5. `pages/cart.html` (Shopping Cart)
6. `pages/checkout.html` (Checkout)
7. `pages/confirmation.html` (Order Confirmation)
8. `pages/wishlist.html` (Wardrobe Vault / Wishlist)
9. `pages/smart-list.html` (Smart List AI Curation)
10. `pages/concierge.html` (Style Concierge Suite)
11. `pages/lookbook.html` (Lookbook)
12. `pages/account.html` (Customer Account Dashboard)
13. `pages/profile.html` (Style Profile)
14. `pages/orders.html` (Order History)
15. `pages/tracking.html` (Live Order Tracking)
16. `pages/signin.html` (Sign In)
17. `pages/signup.html` (Sign Up)
18. `pages/about.html` (About & Heritage)
19. `pages/contact.html` (Client Services Desk)
20. `pages/size-guide.html` (Size & Fit Atelier)
21. `pages/privacy.html` (Privacy Charter)
22. `pages/terms.html` (Terms of Service)
23. `pages/security.html` (Security Charter)
24. `pages/impressum.html` (Impressum)
25. `pages/404.html` (Error 404)
26. `pages/foundation.html` (Design Tokens / Foundation)
27. `pages/components-preview.html` (Components Preview)
28. `pages/playground.html` (Motion Playground)

## Prohibited Behaviors (Strictly Forbidden)
1. **Never batch multiple pages**: Never audit or modify 2+ pages in the same session turn.
2. **Never fix automatically without a plan and approval**: Never jump straight from finding a bug to editing code without an approved `implementation_plan.md`.
3. **Never roll over to the next page automatically**: Once a page is verified, you must stop and wait for user confirmation.
