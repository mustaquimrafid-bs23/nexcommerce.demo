/**
 * nexCommerce AI &mdash; Elevated Concierge Engine (Feature 6)
 * Orchestrates Intent Parsing, Real-Time Page Context, Multi-Piece Look Building,
 * Interactive Sizing, Order Tracking, and Fabric Care.
 * Deterministic (Zero-Hallucination) shopping assistant logic in clear, human language.
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
            text: `Good evening. I see you are viewing the **${found.title}** (${found.price || ('€ ' + Number(found.numericPrice).toFixed(2))}). Would you like help with sizing, outfit ideas, or delivery details?`,
            suggestedChips: [
              `Find my size for this item`,
              `Complete this outfit`,
              `Fabric & care guide`,
              `Delivery & shipping time`
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
          text: `Good evening. I can help you review your shopping bag, suggest matching pieces, or check delivery times before you checkout.`,
          suggestedChips: [
            'Suggest matching accessories',
            'Delivery & shipping times',
            '14-Day return policy',
            'Put together an outfit'
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
              text: `I noticed you were looking at **${catName}** earlier. Would you like to keep browsing, or look for something else?`,
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

      // 4. Default Luxury Welcome
      return {
        type: 'text',
        text: `Good evening. I am your nexCommerce Personal Shopper. I can help you put together complete outfits, find your exact size, or check your delivery status. What are you shopping for today?`,
        suggestedChips: [
          'Complete an office outfit',
          'Show me jackets & coats',
          'Under € 300',
          'Size & fit guide'
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
          text: `**Interactive Size & Fit Guide**\n\n` +
                `Our pieces follow standard European sizing. Select your details below to find your recommended size:`,
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

      // ── 2. ORDER TRACKING & LIVE COURIER STATUS WIDGET ───────────────────
      if (/track|where is my order|order status|find my order|nx-\d+|shipment status|courier status/i.test(rawText)) {
        this.lastQueryType = 'tracking';
        const codeMatch = text.match(/NX-\d{4}-[A-Z0-9]+/i);
        const orderCode = codeMatch ? codeMatch[0].toUpperCase() : 'NX-8921-X';

        return {
          type: 'order_tracking',
          text: `**Live Order Tracking (DHL Express)**\n\n` +
                `Real-time delivery status for order **\`${orderCode}\`**:`,
          orderCode: orderCode,
          widgetPayload: {
            orderCode: orderCode,
            destination: 'Berlin, Germany',
            estimatedDelivery: 'Tomorrow, by 18:00 CET',
            carrier: 'DHL Express Priority',
            currentStep: 3, // 1: Order Confirmed, 2: Inspected, 3: In Transit, 4: Out for Delivery
            steps: [
              { label: 'Order Confirmed', date: 'Yesterday, 14:20' },
              { label: 'Quality Checked', date: 'Today, 08:30' },
              { label: 'Dispatched with DHL Express', date: 'Today, 11:45 (In Transit)' },
              { label: 'Out for Delivery', date: 'Expected Tomorrow' }
            ]
          },
          actionLink: { text: 'OPEN FULL TRACKING PAGE →', url: 'tracking.html' },
          products: [],
          suggestedChips: ['Delivery & shipping times', '14-Day return policy', 'Put together an outfit']
        };
      }

      // ── 3. OCCASIONS & COMPLETE THE LOOK BUNDLE WIDGET ───────────────────
      if (/outfit|look|pair|complete.*look|complete.*outfit|capsule|wedding|office|business|casual|dinner|gala|summer|weekend|evening/i.test(rawText)) {
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
          text: `**${occasionName}**\n\n` +
                `Here is a complete outfit put together for you. You can check or uncheck individual pieces below:`,
          products: bundleItems,
          suggestedChips: ['Under € 500', 'Find my size for this outfit', 'Show other jackets', 'Delivery times']
        };
      }

      // ── 4. DELIVERY, SHIPPING & LOGISTICS ────────────────────────────────
      if (/delivery|shipping|ship|dispatch|courier|how fast|when will it arrive|express|arrive|dhl|dpd/i.test(rawText)) {
        this.lastQueryType = 'delivery';
        return {
          type: 'delivery',
          text: `**Delivery & Shipping Times**\n\n` +
                `• **DHL Express Delivery**: 24–48 hours across all EU countries.\n` +
                `• **Free Shipping**: Included on all orders over **€ 150.00**.\n` +
                `• **Standard Delivery**: 2–4 business days via DPD.\n` +
                `• **Live Tracking**: End-to-end GPS updates sent directly to your email.`,
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
          text: `**14-Day Free Returns & Money-Back Policy**\n\n` +
                `• **14-Day Return Window**: You can return any unworn item within 14 days of delivery.\n` +
                `• **Prepaid Return Label**: Download a free DHL prepaid return label directly from your account.\n` +
                `• **Fast Refund**: Your money is refunded within 24 hours after we inspect the return.`,
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
                `• **100% Mongolian Cashmere**: Hand wash in cold water with wool soap, or dry clean. Lay flat on a clean towel to dry.\n` +
                `• **Fine Merino Wool**: Naturally breathable and odor-resistant. Steam between wears or dry clean.\n` +
                `• **Italian Leather**: Wipe gently with a soft damp cloth. Condition with neutral leather balm once a year.\n` +
                `• **Titanium**: Scratch-resistant and waterproof. Rinse with mild soapy warm water.`,
          products: catalog.slice(0, 3),
          suggestedChips: ['Show cashmere sweaters', 'Show leather runner', 'Find my size']
        };
      }

      // ── 7. INTENT PARSER & CATALOG SEARCH QUERY ──────────────────────────
      let filteredProducts = catalog;

      // Extract Category Intent
      if (/jacket|coat|trench|outerwear|blazer/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /coat|jacket|trench|blazer/i.test(p.title) || p.category === 'Apparel');
      } else if (/sweater|knit|cashmere|crew|pullover/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /knit|sweater|cashmere|crew/i.test(p.title) || p.category === 'Apparel');
      } else if (/trouser|pant|pants/i.test(rawText)) {
        filteredProducts = catalog.filter(p => /trouser|pant/i.test(p.title) || p.category === 'Apparel');
      } else if (/shoe|sneaker|runner|footwear|boots/i.test(rawText)) {
        filteredProducts = catalog.filter(p => p.category === 'Footwear' || /runner|sneaker|shoe/i.test(p.title));
      } else if (/bag|tote|accessory|accessories|watch|headphone/i.test(rawText)) {
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
          text: `Here are the pieces matching your search:`,
          products: filteredProducts.slice(0, 4),
          suggestedChips: ['Complete an outfit', 'Find my size', 'Under € 250', 'Delivery times']
        };
      }

      // ── 8. NO RESULTS FALLBACK ───────────────────────────────────────────
      return {
        type: 'product_grid',
        text: `We couldn't find an exact match for "${text}", but here are our most popular pieces right now:`,
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
        type: 'text',
        text: 'I can help you browse our collection, find your size, put together an outfit, or check delivery details. What would you like to explore?',
        products: [],
        suggestedChips: ['Complete an office outfit', 'Under € 300', 'Find my size', 'Show jackets & coats']
      };
    }
  }

  window.NexConciergeEngine = new ConciergeEngine();

})(typeof window !== 'undefined' ? window : global);
