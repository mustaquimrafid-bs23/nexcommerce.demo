/**
 * nexCommerce AI &mdash; Elevated Stylist Engine (Feature 6)
 * Orchestrates Intent Parsing, Real-Time Page Context, Multi-Piece Look Building,
 * Interactive Sizing, Order Tracking, and Fabric Care.
 * Visual-First, Zero-Hallucination shopping assistant with minimal text and rich studio photography.
 */

(function(window) {
  'use strict';

  class ConciergeEngine {
    constructor() {
      this.contextRefined = false;
      this.profileAcknowledged = false;
      this.lastQueryType = null;
      this.currentContext = null;
    }

    /**
     * Fallback catalog when window.NexAI is not initialized yet.
     */
    _getCatalog() {
      if (window.NexAI && Array.isArray(window.NexAI.catalogArray) && window.NexAI.catalogArray.length > 0) {
        return window.NexAI.catalogArray;
      }
      return [
        { id: 'p1', title: 'Architectural Cashmere Sweater', category: 'Apparel', numericPrice: 185, price: '€ 185.00', img: 'assets/images/products/hero_sweater.png', desc: 'Crafted from ultra-soft 2-ply Mongolian cashmere with a relaxed, modern silhouette.' },
        { id: 'p2', title: 'Structured Wool Blazer', category: 'Apparel', numericPrice: 245, price: '€ 245.00', img: 'assets/images/products/plp_blazer.png', desc: '100% fine Italian merino wool tailored for comfortable day-to-evening wear.' },
        { id: 'p3', title: 'Fine-Knit Cashmere Crew', category: 'Apparel', numericPrice: 160, price: '€ 160.00', img: 'assets/images/products/plp_crewneck.png', desc: 'Ultra-soft cashmere crewneck designed for easy layering across seasons.' },
        { id: 'p6', title: 'Minimalist Leather Runner', category: 'Footwear', numericPrice: 198, price: '€ 198.00', img: 'assets/images/products/leather_sneaker.png', desc: 'Handcrafted Italian calfskin with an ergonomic cushioned sole.' },
        { id: 'p7', title: 'Leather Weekender Tote', category: 'Accessories', numericPrice: 285, price: '€ 285.00', img: 'assets/images/products/leather_tote.png', desc: 'Full-grain Tuscan leather with roomy interior and secure magnetic closure.' },
        { id: 'p4', title: 'Studio Spatial Headphones', category: 'Accessories', numericPrice: 320, price: '€ 320.00', img: 'assets/images/products/p4.png', desc: 'Precision acoustic engineering with ultra-soft memory foam ear cushions.' },
        { id: 'p8', title: 'Chronograph Minimalist Watch', category: 'Accessories', numericPrice: 285, price: '€ 285.00', img: 'assets/images/products/titanium_watch.png', desc: 'Grade-5 aerospace titanium casing with Swiss automatic movement.' }
      ];
    }

    /**
     * Initializes the conversation state, checking for page & session context.
     * Visual-first: Returns rich product cards on launch with minimal 1-line prompt.
     * @param {Object} [context] Optional explicit context (e.g. { url, productId })
     * @returns {Object} Initial visual response payload
     */
    initialize(context) {
      this.currentContext = context || {};
      const catalog = this._getCatalog();

      // 1. Detect Product Detail Page (PDP) Context
      const pathname = (window.location && window.location.pathname) || '';
      let targetProductId = this.currentContext.productId;
      if (!targetProductId && window.location && window.location.search) {
        const match = window.location.search.match(/[?&]id=([^&#]+)/);
        if (match) targetProductId = decodeURIComponent(match[1]);
      }

      if (pathname.includes('product.html') || targetProductId) {
        let found = null;
        if (targetProductId) {
          const idAliasMap = {
            'nx-app-001': 'p1',
            'nx-app-002': 'p2',
            'nx-app-003': 'p3',
            'nx-ftw-001': 'p6',
            'nx-acc-001': 'p7',
            'nx-acc-002': 'p8'
          };
          const normalizedId = (idAliasMap[targetProductId.toLowerCase()] || targetProductId).toLowerCase();
          found = catalog.find(p => 
            p.id.toLowerCase() === normalizedId || 
            p.id.toLowerCase() === targetProductId.toLowerCase() ||
            (p.title && p.title.toLowerCase().includes(targetProductId.toLowerCase()))
          );
        }
        if (!found && typeof document !== 'undefined') {
          const titleEl = document.querySelector('.pdp-product-title') || document.querySelector('h1');
          const titleText = titleEl ? titleEl.innerText.trim().toLowerCase() : '';
          found = catalog.find(p => titleText && p.title.toLowerCase().includes(titleText)) || catalog[0];
        }

        if (found) {
          return {
            type: 'pdp_context',
            text: `Currently viewing: **${found.title}**`,
            suggestedChips: [
              `Find my size`,
              `Complete the outfit`,
              `Fabric & care`,
              `Shipping times`
            ],
            products: [found],
            contextProduct: found
          };
        }
      }

      // 2. Detect Cart Page Context
      if (pathname.includes('cart.html') || (context && context.url && context.url.includes('cart.html'))) {
        return {
          type: 'product_grid',
          text: `Selected accessories to pair with your bag:`,
          suggestedChips: [
            'Matching accessories',
            'Shipping times',
            '14-Day returns',
            'Complete an outfit'
          ],
          products: catalog.slice(0, 3)
        };
      }

      // 3. Detect Stored Search/Category Session Intent
      try {
        const storedIntent = sessionStorage.getItem('nexIntent');
        if (storedIntent) {
          const intent = JSON.parse(storedIntent);
          if (intent.category && intent.category.value) {
            const catName = intent.category.value.toLowerCase();
            return {
              type: 'product_grid',
              text: `Recommended in **${catName}**:`,
              suggestedChips: [
                `Show all ${catName}`,
                'Complete an outfit',
                'Find my size',
                'Under € 250'
              ],
              products: catalog.filter(p => (p.category || '').toLowerCase().includes(catName)).slice(0, 3)
            };
          }
        }
      } catch (e) {}

      // 4. Default Visual-First Welcome (Photo cards lead, 1-line text)
      return {
        type: 'product_grid',
        text: `Featured wardrobe pieces & styling ideas:`,
        suggestedChips: [
          'Place an order (Voice Demo)',
          'Place an order (Text Demo)',
          'Build cart by budget',
          'Compare top pieces',
          'Upload shopping slip'
        ],
        products: catalog.slice(0, 3)
      };
    }

    /**
     * Cleans conversational voice filler phrases for accurate intent matching.
     * @param {string} text 
     * @returns {string} Cleaned query
     */
    _cleanVoiceQuery(text) {
      if (!text) return '';
      let cleaned = text.trim();
      cleaned = cleaned.replace(/^(hey|hi|hello|bonjour|good (morning|afternoon|evening))\s*(stylist|assistant|nexcommerce|ai|bot)?[\s,]+/i, '');
      cleaned = cleaned.replace(/^(can you|could you|please|i want to|i'd like to|help me|tell me|show me|find me|look for|give me|what is|what's|how does|how do)\s+/i, '');
      cleaned = cleaned.replace(/\s*(please|thank you|thanks|right now)\.?$/i, '');
      return cleaned.trim();
    }

    /**
     * Generates a concise spoken summary string for text-to-speech audio feedback.
     * @param {Object} payload 
     * @returns {string}
     */
    _generateSpokenSummary(payload) {
      if (!payload) return 'I have updated your recommendations.';
      if (payload.spokenSummary) return payload.spokenSummary;

      if (payload.type === 'order_address') {
        return 'Where should we deliver your order? You can use your saved address or enter a new one.';
      }
      if (payload.type === 'order_payment') {
        return 'Address confirmed! Please choose how you would like to pay.';
      }
      if (payload.type === 'order_review') {
        const total = (payload.widgetPayload && payload.widgetPayload.totalDue) ? payload.widgetPayload.totalDue : 279;
        return `Here is your order summary totaling € ${total}. Tap authorize to confirm your order.`;
      }
      if (payload.type === 'order_confirmed') {
        return `Order ${payload.orderCode || 'NX-4829-M'} placed successfully! Your pieces are being prepared for express dispatch.`;
      }
      if (payload.type === 'bundle_look' || payload.isBundleLook) {
        const total = (payload.products || []).reduce((acc, p) => acc + (p.numericPrice || 0), 0);
        return `I have styled a complete outfit for you totaling € ${total}. All pieces are ready to add to your bag.`;
      }
      if (payload.type === 'sizing_advisor') {
        return 'Here is your sizing guidance. Our apparel pieces fit true to standard European sizing with relaxed tailored cuts.';
      }
      if (payload.type === 'budget_cart') {
        return 'I have launched the Budget Cart Optimizer matching your target budget.';
      }
      if (payload.type === 'comparison_advisor') {
        return 'I have opened the side-by-side comparison matrix for our top pieces.';
      }
      if (payload.type === 'delivery') {
        return 'We offer express and same-day delivery from our local dark store fulfillment hubs.';
      }
      if (payload.type === 'savings_advisor') {
        return 'Here are our active promotional codes. The highest discount will auto-apply at checkout.';
      }
      if (payload.type === 'order_tracking') {
        return `Order ${payload.orderCode || ''} is in transit with estimated delivery tomorrow.`;
      }
      if (payload.products && payload.products.length > 0) {
        const names = payload.products.slice(0, 2).map(p => p.title).join(' and ');
        return `Here are top recommendations including ${names}.`;
      }
      const plainText = (payload.text || '').replace(/\*\*/g, '').replace(/__/g, '').replace(/#/g, '').replace(/✨/g, '').split('\n')[0].trim();
      return plainText || 'Here are the styling details you requested.';
    }

    /**
     * Processes natural language queries deterministically.
     * @param {string} text - The raw customer input
     * @param {Object} [ctx] - Optional contextual overrides
     * @returns {Object} Structured UI response payload
     */
    processMessage(text, ctx) {
      if (!text || text.trim() === '') {
        const fallback = this._fallbackResponse();
        fallback.spokenSummary = this._generateSpokenSummary(fallback);
        return fallback;
      }

      let rawText = text.toLowerCase().trim();
      const cleaned = this._cleanVoiceQuery(text).toLowerCase();
      // Match against cleaned query if cleaner stripped meaningful prefix
      if (cleaned.length > 3 && !/\b(slip|compare|budget|promo|track|size|care|order|checkout|pay|address|authorize)\b/.test(rawText) && /\b(slip|compare|budget|promo|track|size|care|outfit|look|jacket|blazer|shoe|sweater|watch|fit|order|checkout|pay|address|authorize)\b/.test(cleaned)) {
        rawText = cleaned;
      }
      const catalog = this._getCatalog();
      const res = this._evaluateQuery(rawText, text, catalog, ctx);
      if (res && !res.spokenSummary) {
        res.spokenSummary = this._generateSpokenSummary(res);
      }
      return res;
    }

    /**
     * Alias for processMessage.
     */
    parseQuery(text, ctx) {
      return this.processMessage(text, ctx);
    }

    /**
     * Internal query evaluator.
     */
    _evaluateQuery(rawText, text, catalog, ctx) {

      // ── DLP & SENSITIVE FINANCIAL CREDENTIALS GUARD ─────────────────────
      const isSensitiveCreditCard = /\b(?:\d[ -]*?){13,19}\b/.test(rawText) || /\b(cvv|cvc|card number|pin code|security code)\b/i.test(rawText);
      if (isSensitiveCreditCard) {
        return {
          type: 'security_alert',
          text: `**🔒 Security Guardrail: Never Share Card Details in Chat**\n\nFor your financial protection, our Smart Assistant **never** requests or collects credit card numbers, CVVs, or bank PINs.\n\nAll assistant orders automatically default to **Cash on Delivery (Pay on Arrival)** with zero financial risk. You can also securely settle via Apple Pay or Card on the **Order Details** page anytime before dispatch.`,
          spokenSummary: 'For your security, please do not enter card numbers in chat. Orders default to Pay on Delivery, or you can pay securely online from your order details page.',
          products: catalog.slice(0, 2),
          suggestedChips: ['I want to place an order', 'Track my order', 'Delivery times']
        };
      }

      // ── 0A. AGENTIC IN-DRAWER ORDER & CHECKOUT FLOW ──────────────────────
      const isUserLoggedIn = (typeof window !== 'undefined' && window.NexAuth && typeof window.NexAuth.isLoggedIn === 'function')
        ? window.NexAuth.isLoggedIn()
        : (typeof localStorage !== 'undefined' && !!localStorage.getItem('nex_session'));

      // Check if user is attempting any order flow step
      const isOrderFlowQuery = /\b(place (an? )?order|order (my )?(bag|cart|items|now)|buy (this )?(outfit|look|now|cart|bag)|checkout( with voice| my bag)?|start order|ready to (pay|order|buy)|i want to (place an order|order|buy)|order flow|voice order demo|text order demo|authorize|confirm order|place order now|authorize & place order|pay now|finalize order|complete purchase|buy now|finish order|confirm and pay|confirm purchase|confirm and place order|place the order)\b/i.test(rawText);

      // Gatekeeper: If unauthenticated guest attempts to order, enforce member sign-in
      if (isOrderFlowQuery && !isUserLoggedIn) {
        this.lastQueryType = 'order_auth_required';
        return {
          type: 'order_auth_required',
          text: `**Authentication Required for Order Placement**\n\nTo secure your transaction, apply private member privileges, and enable real-time courier dispatch tracking, please sign in to your atelier account:`,
          widgetPayload: {
            reason: 'Guest ordering is restricted. Sign in with your account or use the 1-Click Demo Client to complete your purchase.'
          },
          actionLink: { text: 'SIGN IN TO COMPLETE ORDER →', url: 'signin.html?next=checkout.html' },
          products: catalog.slice(0, 2),
          suggestedChips: ['Sign in with Demo Client', 'Build cart by budget', 'Compare top pieces', 'Upload shopping slip']
        };
      }

      // Step 4: Final Order Authorization (Authenticated only)
      if (/\b(authorize|confirm order|place order now|authorize & place order|pay now|finalize order|complete purchase|buy now|finish order|confirm and pay|confirm purchase|confirm and place order|place the order)\b/i.test(rawText)) {
        this.lastQueryType = 'order_confirmed';
        const orderNum = Math.floor(1000 + Math.random() * 9000);
        const orderCode = `NX-${orderNum}-M`;
        const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

        const cartItems = (typeof window !== 'undefined' && window.nexCart && window.nexCart.items && window.nexCart.items.length > 0)
          ? window.nexCart.items
          : [
              { title: 'Architectural Cashmere Sweater', size: 'M', numericPrice: 185 },
              { title: 'Minimalist Leather Runner', size: '42', numericPrice: 125 }
            ];

        const subtotal = cartItems.reduce((acc, item) => acc + (item.numericPrice || item.price || 0), 0);
        const discount = Math.round(subtotal * 0.1);
        const totalDue = subtotal - discount;

        return {
          type: 'order_confirmed',
          text: `**Order Confirmed & Placed!** · Code **\`${orderCode}\`**\n\nPlaced with **Cash on Delivery (Pay on Arrival)**. You can pay the courier upon delivery, or switch to Apple Pay / Card online anytime from your Order Details page before dispatch.`,
          orderCode: orderCode,
          spokenSummary: `Order ${orderCode} placed as Cash on Delivery! You can pay cash on arrival, or switch to Apple Pay or Card online anytime from your Order Details page.`,
          widgetPayload: {
            orderCode: orderCode,
            date: dateStr,
            destination: 'Maximilianstraße 34, 80539 Munich, Germany',
            carrier: 'DHL Express Priority Courier',
            paymentMethod: 'Cash on Delivery (Pay on Arrival)',
            paymentStatus: 'pending_cod',
            subtotal: subtotal,
            discount: discount,
            totalDue: totalDue,
            items: cartItems,
            trackingSteps: [
              { label: 'Order Received & Encrypted (COD)', time: 'Just now · Verified', done: true },
              { label: 'Quality Inspection in Munich Hub', time: 'In Progress · Expected 23:00', active: true },
              { label: 'Out for Express Courier Dispatch', time: 'Tomorrow, 09:30', pending: true }
            ]
          },
          actionLink: { text: 'PAY ONLINE NOW (Order Details →)', url: `tracking.html?order=${encodeURIComponent(orderCode)}&pay=online` },
          products: [],
          suggestedChips: ['Track my order', 'Delivery times', '14-Day return policy']
        };
      }

      // Step 3: Payment Method Selected -> Order Review
      if (/\b(pay with (card|apple pay|google pay|klarna|cash)|pay by (card|apple pay|google pay|klarna|cash)|select payment|use (card|apple pay|klarna|cash on delivery)|card •••• 4242|proceed( with apple pay| with card| with klarna| to review)?|apple pay|google pay|klarna|credit card|debit card|cash on delivery)\b/i.test(rawText)) {
        this.lastQueryType = 'order_review';
        let method = 'Cash on Delivery (Pay on Arrival)';
        if (/apple pay/i.test(rawText)) method = 'Apple Pay (1-Touch Biometric)';
        else if (/google pay/i.test(rawText)) method = 'Google Pay';
        else if (/klarna/i.test(rawText)) method = 'Klarna Pay Later (30 Days)';
        else if (/card/i.test(rawText)) method = 'Card •••• 4242 (Visa)';

        const cartItems = (typeof window !== 'undefined' && window.nexCart && window.nexCart.items && window.nexCart.items.length > 0)
          ? window.nexCart.items
          : [
              { title: 'Architectural Cashmere Sweater', size: 'M', numericPrice: 185 },
              { title: 'Minimalist Leather Runner', size: '42', numericPrice: 125 }
            ];

        const subtotal = cartItems.reduce((acc, item) => acc + (item.numericPrice || item.price || 0), 0);
        const discount = Math.round(subtotal * 0.1);
        const totalDue = subtotal - discount;

        return {
          type: 'order_review',
          text: `**Order Summary & Final Authorization**\n\nReview your order details below. Everything is verified and ready for instant authorization with **${method}**.`,
          widgetPayload: {
            items: cartItems,
            paymentMethod: method,
            address: 'Maximilianstraße 34, 80539 Munich, Germany',
            subtotal: subtotal,
            discountCode: 'WELCOME10 (-10%)',
            discountAmount: discount,
            shipping: 'FREE (DHL Express Courier)',
            totalDue: totalDue
          },
          actionLink: { text: 'VIEW FULL CHECKOUT PAGE →', url: 'checkout.html' },
          products: [],
          suggestedChips: ['Authorize & place order now', 'Change address', 'Change payment method']
        };
      }

      // Step 2: Address Confirmed -> Payment Method Selection (Defaults to COD / Pay on Arrival)
      if (/\b(confirm( my)? address|deliver to|use saved address|address:|ship to|delivery address|confirm munich address|confirm custom address|maximilianstra(ß|ss)e)\b/i.test(rawText)) {
        this.lastQueryType = 'order_payment';
        const address = 'Maximilianstraße 34, 80539 Munich, Germany';

        return {
          type: 'order_payment',
          text: `**Payment Method Selection (Default: Cash on Delivery)**\n\nDelivery address confirmed as **${address}**.\n\nAI Orders default to **Cash on Delivery (Pay on Arrival)** with zero financial risk. You can also settle digitally online anytime before courier dispatch:`,
          spokenSummary: 'Address confirmed! Smart orders default to Cash on Delivery with option to settle online before courier dispatch.',
          widgetPayload: {
            address: address,
            paymentMethods: [
              { id: 'cod', name: 'Cash on Delivery (Default)', details: 'Pay upon courier arrival / Settle online', badge: 'Recommended', selected: true },
              { id: 'card', name: 'Credit / Debit Card', details: '•••• 4242 (Visa / MC)', badge: 'Instant', selected: false },
              { id: 'apple_pay', name: 'Apple Pay / Google Pay', details: '1-Touch Biometric', badge: 'Instant', selected: false },
              { id: 'klarna', name: 'Klarna Pay Later', details: 'Pay in 30 Days', badge: '0% APR', selected: false }
            ]
          },
          actionLink: { text: 'PROCEED TO CHECKOUT PAGE →', url: 'checkout.html' },
          products: [],
          suggestedChips: ['Pay with Cash on Delivery', 'Pay with Apple Pay', 'Pay with Card •••• 4242', 'Authorize & place order now']
        };
      }

      // Step 1: Start Order Flow / Delivery Address Collection (Authenticated only)
      if (/\b(place (an? )?order|order (my )?(bag|cart|items|now)|buy (this )?(outfit|look|now|cart|bag)|checkout( with voice| my bag)?|start order|ready to (pay|order|buy)|i want to (place an order|order|buy)|order flow|voice order demo|text order demo)\b/i.test(rawText)) {
        this.lastQueryType = 'order_address';
        return {
          type: 'order_address',
          text: `**Delivery Address & Fulfillment**\n\nWhere should we deliver your order today? You can use your saved default address or enter a new destination:`,
          widgetPayload: {
            defaultAddress: {
              name: 'Julian Wright',
              street: 'Maximilianstraße 34',
              city: 'Munich',
              postcode: '80539',
              country: 'Germany',
              formatted: 'Maximilianstraße 34, 80539 Munich, Germany'
            }
          },
          actionLink: { text: 'GO TO FULL CHECKOUT →', url: 'checkout.html' },
          products: [],
          suggestedChips: ['Confirm address: Maximilianstraße 34, Munich', 'Enter new address', 'View bag']
        };
      }

      // ── 0. SLIP TO CART / SHOPPING LIST AGENT WIDGET (Capability 4) ─────
      if (/\b(upload.*slip|shopping slip|slip to cart|scan.*list|grocery list|shopping list|paste.*list|upload.*list|grocery slip)\b/i.test(rawText)) {
        this.lastQueryType = 'slip_to_cart';
        if (typeof window !== 'undefined' && window.NexSlipUI && typeof window.NexSlipUI.openModal === 'function') {
          setTimeout(function() { window.NexSlipUI.openModal('capsule'); }, 300);
        }
        return wrapResponse({
          type: 'slip_to_cart',
          text: `**Shopping Slip to Cart Agent**\n\nI've opened the Slip Scanner for you. Drag & drop your receipt, choose a sample capsule, or paste your list to prepare your cart instantly.`,
          actionLink: { text: 'OPEN SLIP SCANNER →', url: '#' },
          products: catalog.slice(0, 3),
          suggestedChips: ['Under € 300', 'Complete an outfit', 'Track my order']
        });
      }

      // ── 0B. COMPARISON / PRODUCT ADVISOR WIDGET (Capability 2) ──────────
      if (/\b(compare|comparison|which (is )?better|which one|difference between|versus|\bvs\b)\b/i.test(rawText)) {
        this.lastQueryType = 'comparison';
        if (typeof window !== 'undefined' && window.NexComparisonUI && typeof window.NexComparisonUI.openComparison === 'function') {
          setTimeout(function() { window.NexComparisonUI.openComparison(['p1', 'p2']); }, 300);
        }
        return {
          type: 'comparison_advisor',
          text: `**Product Advisor & Side-by-Side Comparison**\n\nI've launched the comparison matrix comparing our top pieces across fabric grade, warmth, breathability, and use case.`,
          actionLink: { text: 'OPEN COMPARISON MATRIX →', url: '#' },
          products: catalog.slice(0, 2),
          suggestedChips: ['Find my size', 'Upload shopping slip', 'Under € 300']
        };
      }

      // ── 0C. AUTONOMOUS TARGET-BUDGET CART BUILDER (Capability 3) ─────────
      if (/\b(budget.*cart|make.*cart|build.*cart|cart.*under|wardrobe.*under|pack.*under)\b/i.test(rawText) || (/\d{2,4}\s*(euro|€|eur|tk)/i.test(rawText) && /cart|wardrobe|basket/i.test(rawText))) {
        this.lastQueryType = 'budget_cart';
        const numMatch = rawText.match(/(\d{2,4})/);
        const targetBudget = numMatch ? parseInt(numMatch[1], 10) : 500;
        if (typeof window !== 'undefined' && window.NexBudgetCartUI && typeof window.NexBudgetCartUI.openModal === 'function') {
          setTimeout(function() { window.NexBudgetCartUI.openModal(targetBudget, 'autumn'); }, 300);
        }
        return {
          type: 'budget_cart',
          text: `**Autonomous Target-Budget Cart Builder**\n\nI've launched the Budget Cart Optimizer set to **€ ${targetBudget}**. It has selected matching pieces maximizing budget efficiency while preserving headroom.`,
          actionLink: { text: 'OPEN BUDGET BUILDER →', url: '#' },
          products: catalog.slice(0, 3),
          suggestedChips: ['€ 300 Essentials', '€ 500 Autumn Wardrobe', 'Upload shopping slip']
        };
      }

      // ── 0D. PROACTIVE CHECKOUT SAVINGS & PROMO ADVISOR (Capability 5) ───
      if (/\b(promo|promos|coupons?|discounts?|save money|savings|best deal|vouchers?|promo code)\b/i.test(rawText)) {
        this.lastQueryType = 'savings';
        const promos = [
          '✨ **VIP20** · 20% off orders over €400',
          '✨ **ATELIER15** · 15% off orders over €200',
          '✨ **WELCOME10** · 10% off any order',
          '✨ **FREESHIP** · Complimentary Express Courier'
        ].join('\n');

        return {
          type: 'savings_advisor',
          text: `**Smart Checkout Savings & Promo Advisor**\n\nHere are our active atelier promotional codes:\n\n${promos}\n\nOur system will also auto-apply the highest-saving code for you at checkout!`,
          actionLink: { text: 'GO TO CHECKOUT →', url: 'checkout.html' },
          products: catalog.slice(0, 2),
          suggestedChips: ['Build cart by budget', 'Compare top pieces', 'Upload shopping slip']
        };
      }

      // ── 0E. DELIVERY-AWARE SHOPPING & HYPERLOCAL GATE (Capability 6) ────
      if (/\b(same[- ]day|express delivery|deliver today|how fast|shipping time|courier|dark store|hub)\b/i.test(rawText)) {
        this.lastQueryType = 'delivery';
        const hub = (typeof window !== 'undefined' && window.NexDeliveryEngine) ? window.NexDeliveryEngine.DARK_STORE_HUBS[0] : { city: 'Berlin', region: 'Central Mitte' };
        if (typeof window !== 'undefined' && window.NexDeliveryUI && typeof window.NexDeliveryUI.openHubModal === 'function') {
          setTimeout(function() { window.NexDeliveryUI.openHubModal(); }, 300);
        }
        return {
          type: 'delivery',
          text: `**Hyperlocal Dark Store & Express Delivery**\n\nWe offer instant **45–60 min Same-Day Delivery** from our **${hub.city} (${hub.region})** fulfillment dark store! Order within the next hours to receive your pieces today.`,
          actionLink: { text: 'CHANGE LOCATION HUB →', url: '#' },
          products: catalog.slice(0, 2),
          suggestedChips: ['Build cart by budget', 'Compare top pieces', 'Upload shopping slip']
        };
      }

      // ── 0F. CART RECOVERY & ABANDONMENT ASSISTANT (Capability 7) ────────
      if (/\b(recover.*cart|restore.*cart|abandoned.*cart|my bag|items.*in.*bag|resume.*order|saved.*cart)\b/i.test(rawText)) {
        this.lastQueryType = 'cart_recovery';
        const cart = (typeof window !== 'undefined' && window.nexCart) ? (window.nexCart.items || []) : [];
        if (cart.length > 0) {
          if (typeof window !== 'undefined' && window.NexCartRecoveryUI && typeof window.NexCartRecoveryUI.showRecoveryModal === 'function') {
            setTimeout(function() { window.NexCartRecoveryUI.showRecoveryModal(); }, 300);
          }
          return {
            type: 'cart_recovery',
            text: `**Cart Recovery & Reservation Assistant**\n\nYou currently have **${cart.length} pieces reserved** in your bag. I've unlocked your exclusive recovery incentive modal so you can claim your pieces before the hold expires!`,
            actionLink: { text: 'VIEW SHOPPING BAG →', url: 'cart.html' },
            products: cart.slice(0, 2),
            suggestedChips: ['Build cart by budget', 'Compare top pieces', 'Upload shopping slip']
          };
        } else {
          return {
            type: 'cart_recovery',
            text: `**Cart Recovery Assistant**\n\nYour bag is currently clear. Browse our latest arrivals or use our **Budget Cart Builder** to assemble a fresh custom collection!`,
            actionLink: { text: 'BUILD CART BY BUDGET →', url: '#' },
            products: catalog.slice(0, 3),
            suggestedChips: ['Build cart by budget', 'Compare top pieces', 'Upload shopping slip']
          };
        }
      }

      // ── 1. OCCASIONS & COMPLETE THE LOOK / OUTFIT BUNDLE WIDGET ─────────
      const isSearchOnly = /^(looking for|search for|find me|show me|where are)/i.test(rawText) && !/outfit|complete|capsule/i.test(rawText);
      if (!isSearchOnly && (/\b(outfits?|complete (outfit|look)|(office|wedding|business|casual|dinner|gala|summer|weekend|evening) (look|outfit)|capsules?|pairings?|put together (an outfit|a look)|full outfit|complete the look)\b/i.test(rawText) || /complete.*(look|outfit)/i.test(rawText) || /\b(the look|this look|curated look|look bundle|wedding look|office look|evening look|wedding|gala|casual outfit)\b/i.test(rawText))) {
        this.lastQueryType = 'bundle';
        
        let bundleItems = [];
        let occasionName = 'Modern Everyday Outfit';

        if (/office|business|work/i.test(rawText)) {
          occasionName = 'Office & Business Outfit';
          bundleItems = [
            catalog.find(p => p.id === 'p1') || catalog[0], // Cashmere Knit
            catalog.find(p => p.id === 'p2') || catalog[1], // Wool Blazer
            catalog.find(p => p.id === 'p3') || catalog[2], // Cashmere Crew
            catalog.find(p => p.id === 'p6') || catalog[3]  // Leather Runner
          ].filter(Boolean);
        } else if (/wedding|gala|formal|evening|dinner/i.test(rawText)) {
          occasionName = 'Evening & Formal Outfit';
          bundleItems = [
            catalog.find(p => p.id === 'p2') || catalog[1], // Wool Blazer
            catalog.find(p => p.id === 'p1') || catalog[0], // Cashmere Knit
            catalog.find(p => p.id === 'p8') || catalog[6], // Titanium Watch
            catalog.find(p => p.id === 'p6') || catalog[3]  // Leather Runner
          ].filter(Boolean);
        } else {
          // Default versatile look
          const seenCats = new Set();
          for (const p of catalog) {
            if (!seenCats.has(p.category)) {
              bundleItems.push(p);
              seenCats.add(p.category);
            }
            if (bundleItems.length >= 3) break;
          }
        }

        return {
          type: 'bundle_look',
          isBundleLook: true,
          text: `**${occasionName}** · Complete Outfit`,
          products: bundleItems,
          suggestedChips: ['Under € 500', 'Find my size', 'Show other jackets', 'Delivery times']
        };
      }

      // ── 2. SIZING & FIT ADVISOR WIDGET ───────────────────────────────────
      if (/\b(size|sizing|fits?|measure|measurements?|chest|waist|true to size|what size|how does it fit|size guide|fit guide|shoe size)\b/i.test(rawText)) {
        this.lastQueryType = 'sizing';
        return {
          type: 'sizing_advisor',
          text: `**Interactive Size & Fit Guide**`,
          widgetPayload: {
            categories: ['Tops & Sweaters', 'Jackets & Coats', 'Shoes & Sneakers'],
            defaultCategory: 'Tops & Sweaters',
            availableSizes: ['XS (36")', 'S (38")', 'M (40")', 'L (42")', 'XL (44")'],
            footwearSizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
            fits: ['True to size (Regular fit)', 'Size up (Relaxed fit for layering)']
          },
          products: catalog.filter(p => p.category === 'Apparel' || p.category === 'Footwear').slice(0, 2),
          suggestedChips: ['Show sweaters', 'Under € 300', 'Complete an outfit', 'Fabric care guide']
        };
      }

      // ── 3. ORDER TRACKING & LIVE COURIER STATUS WIDGET ───────────────────
      if (/\b(track|tracking|order status|find my order|where is my order|where is my package|my package|package status|shipment status|courier status|delivery status)\b/i.test(rawText) || /where.*(order|package|parcel|shipment)/i.test(rawText) || /nx-\d+/i.test(rawText)) {
        this.lastQueryType = 'tracking';
        const codeMatch = text.match(/NX-\d{4}-[A-Z0-9]+/i);
        const orderCode = codeMatch ? codeMatch[0].toUpperCase() : 'NX-8921-X';

        return {
          type: 'order_tracking',
          text: `**Live Order Tracking** · Order **\`${orderCode}\`**`,
          orderCode: orderCode,
          widgetPayload: {
            orderCode: orderCode,
            destination: 'Berlin, Germany',
            estimatedDelivery: 'Tomorrow, by 18:00 CET',
            carrier: 'DHL Express Priority',
            currentStep: 3, // 1: Order Confirmed, 2: Inspected, 3: In Transit, 4: Out for Delivery
            steps: [
              { label: 'Order Placed', date: 'Yesterday, 14:20' },
              { label: 'Quality Checked', date: 'Today, 08:30' },
              { label: 'Dispatched with DHL Express', date: 'Today, 11:45 (In Transit)' },
              { label: 'Out for Delivery', date: 'Expected Tomorrow' }
            ]
          },
          actionLink: { text: 'OPEN FULL TRACKING PAGE →', url: 'tracking.html' },
          products: [],
          suggestedChips: ['Delivery times', '14-Day return policy', 'Put together an outfit']
        };
      }

      // ── 4. DELIVERY, SHIPPING & LOGISTICS ────────────────────────────────
      if (/delivery|shipping|ship|dispatch|courier|how fast|when will it arrive|express|arrive|dhl|dpd/i.test(rawText)) {
        this.lastQueryType = 'delivery';
        return {
          type: 'delivery',
          text: `**Delivery & Shipping Times**\n\n` +
                `• **DHL Express**: 24–48 hours across EU.\n` +
                `• **Free Shipping**: Orders over **€ 150.00**.\n` +
                `• **Standard Delivery**: 2–4 business days.\n` +
                `• **Live GPS Tracking**: Direct to your email.`,
          actionLink: { text: 'TRACK LIVE ORDER →', url: 'tracking.html' },
          products: [],
          suggestedChips: ['Track my order', '14-Day return policy', 'Show collection']
        };
      }

      // ── 5. STATUTORY RETURNS, REFUNDS & GUARANTEE ────────────────────────
      if (/return|returns|refund|refunds|exchange|policy|guarantee|warranty|money back|damaged|withdrawal/i.test(rawText)) {
        this.lastQueryType = 'returns';
        return {
          type: 'returns',
          text: `**14-Day Free Returns & Refunds**\n\n` +
                `• **14-Day Window**: Return any unworn item.\n` +
                `• **Free Return Label**: Included via DHL.\n` +
                `• **Fast Refund**: Within 24 hours of inspection.`,
          products: [],
          suggestedChips: ['Delivery details', 'Show new arrivals', 'Find my size']
        };
      }

      // ── 6. MATERIALS, CRAFT & FABRIC CARE ────────────────────────────────
      if (/cashmere|wool|merino|titanium|leather|canvas|fabric|material|how to wash|care|clean|dry clean/i.test(rawText)) {
        this.lastQueryType = 'materials';
        return {
          type: 'materials',
          text: `**Fabric & Care Instructions**\n\n` +
                `• **Cashmere**: Cold hand-wash or dry clean.\n` +
                `• **Merino Wool**: Breathable; steam or dry clean.\n` +
                `• **Italian Leather**: Soft damp cloth & leather balm.\n` +
                `• **Titanium**: Water & scratch-resistant.`,
          products: catalog.slice(0, 3),
          suggestedChips: ['Show cashmere sweaters', 'Show leather runner', 'Find my size']
        };
      }

      // ── 7. INTENT PARSER & CATALOG SEARCH QUERY ──────────────────────────
      let filteredProducts = catalog;

      // Extract Category Intent
      if (/\b(jackets?|coats?|trench(es)?|outerwear|blazers?)\b/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /coat|jacket|trench|blazer/i.test(p.title) || p.category === 'Apparel');
      } else if (/\b(sweaters?|knits?|knitwear|cashmere|crewneck|crews?|pullovers?)\b/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /knit|sweater|cashmere|crew/i.test(p.title) || p.category === 'Apparel');
      } else if (/\b(trousers?|pants?)\b/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /trouser|pant/i.test(p.title) || p.category === 'Apparel');
      } else if (/\b(shoes?|sneakers?|runners?|footwear|boots?)\b/i.test(rawText)) {
        filteredProducts = catalog.filter(p => p.category === 'Footwear' || /runner|sneaker|shoe/i.test(p.title));
      } else if (/\b(bags?|totes?|accessory|accessories|watch(es)?|headphones?)\b/i.test(rawText)) {
        filteredProducts = catalog.filter(p => p.category === 'Accessories' || /tote|watch|bag|headphone/i.test(p.title));
      }

      // Extract Budget Constraint
      const budgetMatch = rawText.match(/(?:under|less than|below|max|upto|budget)\s*(?:€|eur|bdt|tk)?\s*([\d,]+k?)/i);
      if (budgetMatch) {
        let maxVal = parseFloat(budgetMatch[1].replace(/,/g, ''));
        if (budgetMatch[1].toLowerCase().endsWith('k')) maxVal *= 1000;
        if (maxVal > 0) {
          filteredProducts = filteredProducts.filter(p => (p.numericPrice || 0) <= maxVal);
        }
      }

      if (filteredProducts.length > 0) {
        return {
          type: 'product_grid',
          text: `Matching pieces:`,
          products: filteredProducts.slice(0, 4),
          suggestedChips: ['Complete an outfit', 'Find my size', 'Under € 250', 'Delivery times']
        };
      }

      // ── 8. NO RESULTS FALLBACK ───────────────────────────────────────────
      return {
        type: 'product_grid',
        text: `Popular seasonal highlights:`,
        products: catalog.slice(0, 3),
        suggestedChips: ['Show all jackets', 'Show sweaters', 'Find my size', 'Under € 300']
      };
    }

    /**
     * Sizing calculation helper.
     */
    calculateSize(category, sizeOrMeasurement, fitPref) {
      if (category.includes('Shoes') || category.includes('Footwear') || category.includes('Sneakers')) {
        return {
          recommendedSize: sizeOrMeasurement || 'EU 42',
          confidence: 96,
          advice: 'Our Minimalist Leather Runner fits true to standard European shoe sizes with a comfortable cushioned insole.'
        };
      }

      const isLayering = fitPref && fitPref.includes('Size up');
      let baseSize = 'EU 48 / Medium';
      if (sizeOrMeasurement.includes('XS') || sizeOrMeasurement.includes('36')) baseSize = 'EU 44 / XS';
      else if (sizeOrMeasurement.includes('S') || sizeOrMeasurement.includes('38')) baseSize = 'EU 46 / Small';
      else if (sizeOrMeasurement.includes('M') || sizeOrMeasurement.includes('40')) baseSize = isLayering ? 'EU 50 / Large' : 'EU 48 / Medium';
      else if (sizeOrMeasurement.includes('L') || sizeOrMeasurement.includes('42')) baseSize = isLayering ? 'EU 52 / XL' : 'EU 50 / Large';
      else if (sizeOrMeasurement.includes('XL') || sizeOrMeasurement.includes('44')) baseSize = 'EU 52 / XL';

      return {
        recommendedSize: baseSize,
        confidence: 94,
        advice: isLayering 
          ? 'Size up if you plan to wear shirts or layers underneath.'
          : 'Fits true to standard European size with a clean, comfortable fit.'
      };
    }

    _fallbackResponse() {
      return {
        type: 'product_grid',
        text: 'Featured pieces:',
        products: this._getCatalog().slice(0, 3),
        suggestedChips: ['Complete an office outfit', 'Under € 300', 'Find my size', 'Show jackets & coats']
      };
    }
  }

  window.ConciergeEngine = ConciergeEngine;
  window.NexConciergeEngine = new ConciergeEngine();

})(typeof window !== 'undefined' ? window : global);
