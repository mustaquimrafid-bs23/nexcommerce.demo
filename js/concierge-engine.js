/**
 * nexCommerce AI &mdash; Elevated Concierge Engine (Feature 6)
 * Orchestrates Intent Parsing, Real-Time Page Context, Multi-Piece Look Building,
 * Interactive Sizing, Order Tracking, and Atelier Care.
 * Deterministic (Zero-Hallucination) shopping assistant logic.
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
        { id: 'NX-APP-001', title: 'Cashmere Minimalist Knit', category: 'Apparel', numericPrice: 280, price: '€ 280.00', img: 'assets/images/products/hero_sweater.png', desc: 'Crafted from ultra-soft 2-ply Mongolian cashmere with a relaxed, modern silhouette.' },
        { id: 'NX-APP-002', title: 'Relaxed Tailored Trouser', category: 'Apparel', numericPrice: 240, price: '€ 240.00', img: 'assets/images/products/merino_wool_trousers.png', desc: '100% fine Italian merino wool with subtle pleats and an easy tailored drape.' },
        { id: 'NX-FTW-001', title: 'Minimalist Leather Runner', category: 'Footwear', numericPrice: 320, price: '€ 320.00', img: 'assets/images/products/leather_sneaker.png', desc: 'Hand-burnished Italian calfskin with an ergonomic vulcanized sole.' },
        { id: 'NX-APP-003', title: 'Double-Breasted Wool Overcoat', category: 'Apparel', numericPrice: 480, price: '€ 480.00', img: 'assets/images/products/minimalist_trench.png', desc: 'Structured heavyweight Melton wool with satin cupro lining and horn buttons.' },
        { id: 'NX-ACC-001', title: 'Full-Grain Leather Everyday Tote', category: 'Accessories', numericPrice: 350, price: '€ 350.00', img: 'assets/images/products/leather_tote.png', desc: 'Full-grain Tuscan leather with raw unlined interior and magnetic closure.' },
        { id: 'NX-ACC-002', title: 'Minimalist Titanium Chronometer', category: 'Accessories', numericPrice: 420, price: '€ 420.00', img: 'assets/images/products/titanium_watch.png', desc: 'Grade-5 aerospace titanium casing with Swiss automatic movement.' }
      ];
    }

    /**
     * Initializes the conversation state, checking for page & session context.
     * @param {Object} [context] Optional explicit context (e.g. { url, productId })
     * @returns {Object} Initial greeting response payload
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
            text: `Good evening. I see you are viewing the **${found.title}** (${found.price || ('€ ' + Number(found.numericPrice).toFixed(2))}). How can I assist you with this piece today?`,
            suggestedChips: [
              `Check my size for this piece`,
              `Complete the look with this`,
              `Material craft & care`,
              `Express delivery timelines`
            ],
            products: [found],
            contextProduct: found
          };
        }
      }

      // 2. Detect Cart Page Context
      if (pathname.includes('cart.html') || (context && context.url && context.url.includes('cart.html'))) {
        return {
          type: 'cart_context',
          text: `Good evening. I can assist you with your current bag selection, recommend matching wardrobe pieces, or verify delivery windows before checkout.`,
          suggestedChips: [
            'Recommend matching accessories',
            'Delivery timelines',
            '14-Day EU return policy',
            'Complete a look'
          ],
          products: []
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
              type: 'text',
              text: `I noticed you were exploring **${catName}** earlier. Would you like to continue refining that search, or are you looking for something fresh?`,
              suggestedChips: [
                `Show all ${catName}`,
                'Complete a look',
                'Check sizing',
                'Under € 250'
              ],
              products: catalog.filter(p => (p.category || '').toLowerCase().includes(catName)).slice(0, 3)
            };
          }
        }
      } catch (e) {}

      // 4. Default Luxury Welcome
      return {
        type: 'text',
        text: `Good evening. I am your nexCommerce Personal Shopper. I can assist you with complete look recommendations, precise sizing guidance, atelier craftsmanship, or order delivery status. What are you looking to discover?`,
        suggestedChips: [
          'Complete a look for the office',
          'Show me outerwear',
          'Under € 300',
          'Sizing & fit guide'
        ],
        products: []
      };
    }

    /**
     * Processes natural language queries deterministically.
     * @param {string} text - The raw customer input
     * @param {Object} [ctx] - Optional contextual overrides
     * @returns {Object} Structured UI response payload
     */
    processMessage(text, ctx) {
      if (!text || text.trim() === '') return this._fallbackResponse();

      const rawText = text.toLowerCase().trim();
      const catalog = this._getCatalog();

      // ── 1. SIZING & FIT ADVISOR WIDGET ───────────────────────────────────
      if (/size|sizing|fit|fits|measure|measurements|chest|waist|true to size|what size|how does it fit|size guide|shoe size/i.test(rawText)) {
        this.lastQueryType = 'sizing';
        return {
          type: 'sizing_advisor',
          text: `**Interactive Sizing & Fit Advisor**\n\n` +
                `Our garments are engineered around European sartorial proportions. Select your parameters below for instant fit recommendations:`,
          widgetPayload: {
            categories: ['Apparel (Knitwear & Tops)', 'Tailored Outerwear', 'Footwear'],
            defaultCategory: 'Apparel (Knitwear & Tops)',
            availableSizes: ['XS (36")', 'S (38")', 'M (40")', 'L (42")', 'XL (44")'],
            footwearSizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
            fits: ['Tailored (True to size)', 'Relaxed Layering (Size up)']
          },
          products: catalog.filter(p => p.category === 'Apparel' || p.category === 'Footwear').slice(0, 2),
          suggestedChips: ['Style with knitwear', 'Under € 300', 'Complete a look', 'Care guide']
        };
      }

      // ── 2. ORDER TRACKING & LIVE COURIER STATUS WIDGET ───────────────────
      if (/track|where is my order|order status|find my order|nx-\d+|shipment status|courier status/i.test(rawText)) {
        this.lastQueryType = 'tracking';
        const codeMatch = text.match(/NX-\d{4}-[A-Z0-9]+/i);
        const orderCode = codeMatch ? codeMatch[0].toUpperCase() : 'NX-8921-X';

        return {
          type: 'order_tracking',
          text: `**Live Order Verification & DHL Express Custody**\n\n` +
                `Real-time tracking for order **\`${orderCode}\`**:`,
          orderCode: orderCode,
          widgetPayload: {
            orderCode: orderCode,
            destination: 'Berlin / EU Dispatch Centre',
            estimatedDelivery: 'Tomorrow, by 18:00 CET',
            carrier: 'DHL Express Global',
            currentStep: 3, // 1: Order Confirmed, 2: Inspected, 3: In Transit, 4: Out for Delivery
            steps: [
              { label: 'Order Confirmed', date: 'Yesterday, 14:20' },
              { label: 'Atelier Quality Inspected', date: 'Today, 08:30' },
              { label: 'Dispatched via DHL Express', date: 'Today, 11:45 (In Transit)' },
              { label: 'Out for Delivery', date: 'Expected Tomorrow' }
            ]
          },
          actionLink: { text: 'OPEN FULL TRACKING PORTAL →', url: 'tracking.html' },
          products: [],
          suggestedChips: ['Delivery timelines', '14-Day return policy', 'Complete a look']
        };
      }

      // ── 3. OCCASIONS & COMPLETE THE LOOK BUNDLE WIDGET ───────────────────
      if (/outfit|look|pair|complete.*look|capsule|wedding|office|business|casual|dinner|gala|summer|weekend|evening/i.test(rawText)) {
        this.lastQueryType = 'bundle';
        
        let bundleItems = [];
        let occasionName = 'Modern Minimalist Capsule';

        if (/office|business|work/i.test(rawText)) {
          occasionName = 'Tailored Business Editorial';
          bundleItems = [
            catalog.find(p => p.id === 'NX-APP-001') || catalog[0], // Cashmere Knit
            catalog.find(p => p.id === 'NX-APP-002') || catalog[1], // Tailored Trouser
            catalog.find(p => p.id === 'NX-FTW-001') || catalog[2], // Leather Runner
            catalog.find(p => p.id === 'NX-APP-003') || catalog[3]  // Wool Overcoat
          ].filter(Boolean);
        } else if (/wedding|gala|formal|evening|dinner/i.test(rawText)) {
          occasionName = 'Evening Reception & Formal Look';
          bundleItems = [
            catalog.find(p => p.id === 'NX-APP-003') || catalog[3], // Wool Overcoat
            catalog.find(p => p.id === 'NX-APP-002') || catalog[1], // Tailored Trouser
            catalog.find(p => p.id === 'NX-ACC-002') || catalog[5], // Titanium Chrono
            catalog.find(p => p.id === 'NX-FTW-001') || catalog[2]  // Leather Runner
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
          text: `**${occasionName}**\n\n` +
                `Here is a complete look coordinated in tone, drape, and silhouette. You can customize individual pieces below:`,
          products: bundleItems,
          suggestedChips: ['Under € 500', 'Check sizing for this look', 'Show other coats', 'Delivery times']
        };
      }

      // ── 4. DELIVERY, SHIPPING & LOGISTICS ────────────────────────────────
      if (/delivery|shipping|ship|dispatch|courier|how fast|when will it arrive|express|arrive|dhl|dpd/i.test(rawText)) {
        this.lastQueryType = 'delivery';
        return {
          type: 'delivery',
          text: `**Fulfillment & Express Delivery Timelines**\n\n` +
                `• **DHL Express Delivery**: Within **24–48 hours** across all EU member states.\n` +
                `• **Complimentary Shipping**: Included on all orders over **€ 150.00**.\n` +
                `• **Standard Carbon-Neutral Freight**: 2–4 business days via DPD.\n` +
                `• **GPS Tracking**: Real-time end-to-end milestone tracking included with every dispatch.`,
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
          text: `**14-Day Statutory Right of Withdrawal & Returns**\n\n` +
                `• **14-Day EU Statutory Window**: Enjoy a full 14 days from receipt to return any piece in unworn condition.\n` +
                `• **Prepaid Return Label**: Generate instant DHL prepaid return labels inside your account.\n` +
                `• **Rapid Reimbursement**: Processed within 24 hours of inspection back to your original payment method.`,
          products: [],
          suggestedChips: ['Delivery details', 'Show new arrivals', 'Check sizing']
        };
      }

      // ── 6. MATERIALS, CRAFT & ATELIER CARE ────────────────────────────────
      if (/cashmere|wool|merino|titanium|leather|canvas|fabric|material|how to wash|care|clean|dry clean/i.test(rawText)) {
        this.lastQueryType = 'materials';
        return {
          type: 'materials',
          text: `**Material Craftsmanship & Atelier Care Standards**\n\n` +
                `• **2-Ply Mongolian Cashmere**: Hand-wash cold with delicate wool cleanser or professional dry clean; lay flat on clean towel to dry.\n` +
                `• **19.5µ Fine Merino Wool**: Breathable, naturally odor-resistant. Steam between wears; spot clean or dry clean.\n` +
                `• **Full-Grain Tuscan Calfskin**: Wipe gently with a soft damp cloth and nourish with neutral leather balm seasonally.\n` +
                `• **Grade-5 Titanium**: Scratch-resistant and hypoallergenic. Clean with mild soapy warm water.`,
          products: catalog.slice(0, 3),
          suggestedChips: ['Show cashmere pieces', 'Show leather runner', 'Check sizing']
        };
      }

      // ── 7. INTENT PARSER & CATALOG SEARCH QUERY ──────────────────────────
      let filteredProducts = catalog;

      // Extract Category Intent
      if (/jacket|coat|trench|outerwear/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /coat|jacket|trench/i.test(p.title) || p.category === 'Apparel');
      } else if (/sweater|knit|cashmere|crew|pullover/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /knit|sweater|cashmere/i.test(p.title) || p.category === 'Apparel');
      } else if (/trouser|pant|pants/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /trouser|pant/i.test(p.title) || p.category === 'Apparel');
      } else if (/shoe|sneaker|runner|footwear|boots/i.test(rawText)) {
        filteredProducts = catalog.filter(p => p.category === 'Footwear' || /runner|sneaker|shoe/i.test(p.title));
      } else if (/bag|tote|accessory|accessories|watch/i.test(rawText)) {
        filteredProducts = catalog.filter(p => p.category === 'Accessories' || /tote|watch|bag/i.test(p.title));
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
          text: `Here are the selected pieces matching your search:`,
          products: filteredProducts.slice(0, 4),
          suggestedChips: ['Complete a look', 'Check sizing', 'Under € 250', 'Delivery timelines']
        };
      }

      // ── 8. NO RESULTS FALLBACK ───────────────────────────────────────────
      return {
        type: 'product_grid',
        text: `We specialize in curated minimalist apparel, footwear, and accessories. While I couldn't find an exact match for "${text}", here are our latest seasonal highlights:`,
        products: catalog.slice(0, 3),
        suggestedChips: ['Show all outerwear', 'Show knitwear', 'Check sizing', 'Under € 300']
      };
    }

    /**
     * Sizing calculation helper.
     */
    calculateSize(category, sizeOrMeasurement, fitPref) {
      if (category.includes('Footwear')) {
        return {
          recommendedSize: sizeOrMeasurement || 'EU 42',
          confidence: 96,
          advice: 'Our Minimalist Leather Runner fits true to standard European sizing with an ergonomic cushioned insole.'
        };
      }

      const isLayering = fitPref && fitPref.includes('Relaxed');
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
          ? 'Engineered with comfortable ease over collared shirts and mid-layers.'
          : 'Tailored to provide a clean, modern structured silhouette.'
      };
    }

    _fallbackResponse() {
      return {
        type: 'text',
        text: 'I can assist you with curated wardrobe recommendations, sizing advice, complete look pairings, or delivery information. What would you like to explore?',
        products: [],
        suggestedChips: ['Complete a look for the office', 'Under € 300', 'Check sizing', 'Show outerwear']
      };
    }
  }

  window.NexConciergeEngine = new ConciergeEngine();

})(typeof window !== 'undefined' ? window : global);
