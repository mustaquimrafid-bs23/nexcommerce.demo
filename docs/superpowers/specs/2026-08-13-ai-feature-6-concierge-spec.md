# Feature 6 — AI Style Concierge

**Feature ID:** AI-06  
**Feature:** AI Style Concierge — Personal Shopping Chat  
**Priority:** P0  
**Primary Surface:** Global (persistent, accessible from all pages)  
**Secondary Surfaces:** Renders product cards, "Complete the Look" sets, size advice inline  
**Depends on:**
- Feature 1 — `NexAI` / `NexCatalogEngine` (product search & ranking)
- Feature 2 — `NexContextEngine` (session intent retention)
- Feature 3 — `NexStyleProfile` (persistent preferences)
- Feature 4 — `SizeAdvisor` (fit recommendations)
- `js/cart.js` (add to bag)

**Target:** Real production customer feature

---

## 1. Feature Overview

The AI Style Concierge is a **persistent, premium conversational shopping assistant** — the connective tissue that ties all five previous AI features into a single, unified customer experience.

> Rather than navigating pages to discover products, a customer can simply say:
> **"I need something smart-casual for a wedding in Dhaka this weekend, under BDT 25,000."**

The concierge will:
1. Parse the intent (Feature 1)
2. Cross-reference their Style Profile (Feature 3)
3. Return real, grounded product results as **rich inline product cards**
4. Offer to advise on sizing (Feature 4)
5. Allow the customer to add items directly to cart without leaving the chat

This is **Tier 1 — Customer-Facing AI** as defined in the AI Feature Integrity Rule.

---

## 2. The Anti-Pattern We Are Avoiding

- Floating blue SaaS bubble in bottom-right corner
- Generic "Hi, how can I help?" opener
- Plain text list of product names
- Typing raw brand/product codes in responses
- Hallucinating products, stock, prices, or availability

---

## 3. Design Vision — The Personal Concierge Drawer

The concierge is a **full-height side drawer** that slides in from the right edge of the screen. It is not a floating widget — it is a considered, premium UX surface.

**Trigger:** A discreet "Concierge" button in the global navigation header, featuring the Lucide sparkle SVG icon.

**Drawer anatomy:**
```
┌─────────────────────────────────────────┐
│  ✦ Style Concierge              [×]     │  ← Header (sticky)
├─────────────────────────────────────────┤
│  [Conversation stream]                  │  ← Scrollable
│  ┌─ CONCIERGE ─────────────────────┐   │
│  │ Good evening. What are you      │   │
│  │ looking for today?              │   │
│  └─────────────────────────────────┘   │
│  ┌─ YOU ───────────────────────────┐   │
│  │ Smart casual for a wedding      │   │
│  └─────────────────────────────────┘   │
│  ┌─ CONCIERGE ─── [PRODUCT CARDS] ─┐   │
│  │ Based on your request...        │   │
│  │ ┌──────┐ ┌──────┐ ┌──────┐     │   │
│  │ │ img  │ │ img  │ │ img  │     │   │
│  │ └──────┘ └──────┘ └──────┘     │   │
│  │ [Add All to Bag]               │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  [Text input]               [→]         │  ← Input (sticky)
│  "Under 20K" "Jackets" "Complete look"  │  ← Suggestion chips
└─────────────────────────────────────────┘
```

**Visual tone:**
- Background: `rgba(8, 10, 18, 0.98)` with backdrop blur on overlay
- Border: `1px solid rgba(255,255,255,0.08)` on left edge
- Product cards: `#0d1428` background, clean serif title, no neon borders
- User bubbles: `rgba(255,255,255,0.06)` — minimal, elegant
- Concierge messages: flat text with generous line-height, no bubble background
- Typography: Serif for headlines, Inter for body copy

---

## 4. Conversation Intelligence Architecture

The concierge uses the existing AI engine stack deterministically (no runtime LLM in prototype):

```
Customer Message
      ↓
NexIntentParser (Feature 1)
      ↓
NexCatalogEngine.query() (Feature 1 + 3 profile signals)
      ↓
NexContextEngine.evaluateMatch() (Feature 2)
      ↓
ConciergeEngine → Response Composer
      ↓
Rich product cards in conversation stream
```

**Zero hallucination** — every product, price, and feature claim maps to a real catalog entry.

---

## 5. Conversation States

| State | Trigger | Response |
|-------|---------|----------|
| **Greeting** | Drawer opened | Time-aware greeting + suggestion chips |
| **Single Product** | 1–3 products match | Product cards with "Add to Bag" |
| **Complete the Look** | Occasion intent detected | 2–4 curated items + "Add All to Bag" |
| **Refinement** | Follow-up message | Re-runs query with merged intent |
| **Size Advice** | User selects product or asks about size | Inline compact Size Advisor form |
| **No Results** | Zero catalog matches | Honest fallback + 2 closest items |
| **Cart Confirmation** | User adds item | Confirmation message + bag count update |
| **Profile Aware** | Profile exists (once per session) | Personalization acknowledgment |
| **Out-of-Scope** | Unrecognized input | Graceful redirect to product discovery |

---

## 6. Product Card Format (In-Chat)

```
┌─────────────────────────┐
│ [Image 1:1 crop]        │
│ CATEGORY                │  ← 10px uppercase
│ Product Name            │  ← Serif, 15px
│ BDT 18,400              │  ← 14px
│ [ADD TO BAG]            │  ← CTA
└─────────────────────────┘
```

- Max 3 cards per row — horizontal scroll on mobile
- Card: 160px wide × 240px tall
- No neon borders or glows
- Image: `object-fit: cover`, 1:1 aspect ratio

---

## 7. "Complete the Look" Bundle

When occasion intent is detected (dinner, wedding, office):

```
┌─────────────────────────────────────────┐
│  ✦ COMPLETE THE LOOK                   │
│  [img] [img] [img] [img]               │
│  Jacket Trousers Shirt Shoes           │
│  310    280    220   165 (BDT)         │
│                                         │
│  Total: BDT 975                        │
│  [Add All 4 to Bag]                    │
└─────────────────────────────────────────┘
```

---

## 8. Grounding Rules (Anti-Hallucination)

| Action | Allowed |
|--------|---------|
| Recommend products from `PRODUCT_EMBEDDINGS` catalog | ✅ |
| State product price from catalog | ✅ |
| Describe product using catalog `desc` / `keywords` | ✅ |
| Acknowledge Style Profile preferences | ✅ |
| Reference session intent | ✅ |
| Invent a product not in catalog | ❌ |
| Claim product is "in stock" | ❌ |
| Promise specific delivery timelines | ❌ |
| Claim product "suits your body type" without size data | ❌ |
| Respond about another customer's data | ❌ |

---

## 9. Session Context Integration

The concierge reads `sessionStorage` key `nexIntent` on open. If an active intent exists from Feature 2:

```
I see you were exploring footwear earlier.
Would you like to continue with that, or start fresh?
```

Only shown if intent was set in the current browser session.

---

## 10. Style Profile Soft Personalization

If `NexStyleProfile.getActiveProfile()` returns a valid profile:
- Catalog scoring boosts products matching profile preferences (existing `NexCatalogEngine` logic)
- Concierge states **once per session**: `"Your style preferences have been factored into my recommendations."`
- Tracked via `sessionStorage` to prevent repetition

---

## 11. Accessibility Requirements

- Full keyboard navigation (Tab, Esc to close, Enter to send)
- `aria-live="polite"` on conversation stream
- Focus trapped within drawer when open
- All interactive elements have `aria-label`
- Visible focus ring on trigger button

---

## 12. Mobile Behaviour

| Viewport | Drawer Width | Product Cards |
|----------|-------------|---------------|
| Desktop (≥ 768px) | 440px side panel | 3-column grid |
| Mobile (< 768px) | 100vw × 100vh full-screen | Horizontal scroll |

---

## 13. Analytics Events

```javascript
nex_concierge_opened
nex_concierge_closed
nex_concierge_message_sent
nex_concierge_response_rendered     // { state: 'product'|'look'|'no_results'|'out_of_scope' }
nex_concierge_product_clicked       // { product_id }
nex_concierge_add_to_bag            // { product_id }
nex_concierge_add_look_to_bag       // { product_ids[] }
nex_concierge_size_advisor_triggered
nex_concierge_no_results
nex_concierge_out_of_scope
```

---

## 14. Acceptance Criteria

**AC-01 — Catalog Grounding**  
Every product shown must exist in the active catalog. No invented products.

**AC-02 — Style Profile Integration**  
If `personalizationEnabled = true`, catalog scoring must apply profile soft signals.

**AC-03 — Session Context Handoff**  
If active session intent exists, the concierge must incorporate it in its first response logic.

**AC-04 — Add to Bag**  
"Add to Bag" must call `js/cart.js` and update the header bag count.

**AC-05 — Hallucination Prevention**  
If no catalog product matches, the concierge must not invent one.

**AC-06 — Out-of-Scope**  
Unrecognized inputs must redirect gracefully without unverifiable claims.

**AC-07 — Drawer UX**  
Drawer must: slide-animate in, be Esc-closeable, trap focus, and not interfere with page scroll.

**AC-08 — Mobile**  
On viewports < 768px, drawer must be full-screen.
