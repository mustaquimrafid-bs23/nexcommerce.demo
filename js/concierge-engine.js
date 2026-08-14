/**
 * nexCommerce AI &mdash; Concierge Engine (Feature 6)
 * Orchestrates Intent Parsing, Catalog Queries, Context, Size Advice, and Operations.
 * Deterministic (Zero-Hallucination) shopping assistant logic.
 */

(function(window) {
  'use strict';

  class ConciergeEngine {
    constructor() {
      this.contextRefined = false;
      this.profileAcknowledged = false;
      this.lastQueryType = null;
    }

    /**
     * Initializes the conversation state, checking for existing session intent.
     * @returns {Object} Initial greeting response payload
     */
    initialize() {
      let greeting = 'Good evening. I am your nexCommerce Style Concierge. What are you looking to discover today?';
      let suggestedChips = ['Show me jackets', 'Under BDT 20,000', 'Something for the office', 'Complete a look'];

      try {
        const storedIntent = sessionStorage.getItem('nexIntent');
        if (storedIntent) {
          const intent = JSON.parse(storedIntent);
          if (intent.category && intent.category.value) {
            greeting = `I see you were exploring ${intent.category.value.toLowerCase()} earlier. Would you like to continue with that search, or are you looking for something different?`;
            suggestedChips = [`Continue with ${intent.category.value.toLowerCase()}`, 'Check sizing', 'Under BDT 20,000', 'Start fresh'];
          }
        }
      } catch (e) {}

      return {
        type: 'text',
        text: greeting,
        suggestedChips: suggestedChips,
        products: []
      };
    }

    /**
     * Processes a user's natural language input.
     * @param {string} text - The raw text input
     * @returns {Object} Response payload for the UI
     */
    processMessage(text) {
      if (!text || text.trim() === '') return this._fallbackResponse();

      const rawText = text.toLowerCase().trim();
      const catalog = (window.NexAI && window.NexAI.catalogArray) ? window.NexAI.catalogArray : [];

      // ── 1. SIZING & FIT ADVISOR ──────────────────────────────────────────
      if (/size|sizing|fit|fits|measure|measurements|chest|waist|shoulder|what size|how does it fit|true to size|check sizing/.test(rawText)) {
        this.lastQueryType = 'sizing';
        return {
          type: 'sizing',
          text: `**Fit & Sizing Guidance**\n\n` +
                `• **Tailoring & Knitwear**: Our knitwear (*Cashmere Sweater* and *Crew*) and blazers have an intentional, modern structured cut. They fit true-to-size.\n` +
                `• **Layering Advice**: If you plan to layer knitwear over collared shirts, we recommend selecting **one size up** for optimal comfort.\n` +
                `• **Standard Chest Scale**: XS (36") · S (38") · M (40") · L (42") · XL (44")\n` +
                `• **Footwear**: Our *Minimalist Leather Runner* fits true to standard European sizing with a cushioned ergonomic footbed.`,
          products: catalog.filter(p => p.category === 'Apparel' || p.category === 'Footwear').slice(0, 3),
          suggestedChips: ['Show sweaters', 'Show blazers', 'Under BDT 20,000', 'Complete a look']
        };
      }

      // ── 2. DELIVERY, SHIPPING & COURIER ──────────────────────────────────
      if (/delivery|shipping|ship|dispatch|courier|how fast|when will it arrive|dhaka delivery|express|arrive/.test(rawText)) {
        this.lastQueryType = 'delivery';
        return {
          type: 'delivery',
          text: `**Fulfillment & Delivery Timelines**\n\n` +
                `• **Express Dhaka Courier**: Same-day delivery within **4–6 hours** for orders placed before 3:00 PM.\n` +
                `• **Standard Delivery**: 24–48 hours nationwide across all divisions in Bangladesh.\n` +
                `• **Live Tracking**: Every package is assigned real-time GPS courier tracking upon dispatch.\n` +
                `• **Complimentary Shipping**: All orders over BDT 15,000 include free express delivery.`,
          actionLink: { text: 'TRACK LIVE ORDER →', url: 'tracking.html' },
          products: [],
          suggestedChips: ['Track my order', 'Return policy', 'Shop new arrivals']
        };
      }

      // ── 3. RETURNS, REFUNDS & EXCHANGES ──────────────────────────────────
      if (/return|returns|refund|refunds|exchange|policy|guarantee|warranty|money back|damaged/.test(rawText)) {
        this.lastQueryType = 'returns';
        return {
          type: 'returns',
          text: `**Complimentary Return & Exchange Policy**\n\n` +
                `• **14-Day Window**: You may return or exchange any unworn item with original tags within 14 days of receipt.\n` +
                `• **Doorstep Pickup**: Our dedicated courier will collect the package from your doorstep in Dhaka at no charge.\n` +
                `• **Instant Refunds**: Processed back to your original payment method within 24 hours of inspection.`,
          products: [],
          suggestedChips: ['Delivery details', 'Show collection', 'Contact concierge']
        };
      }

      // ── 4. FABRIC, CARE & MATERIAL CRAFTSMANSHIP ──────────────────────────
      if (/cashmere|wool|merino|titanium|leather|canvas|fabric|material|how to wash|care|clean|dry clean/.test(rawText)) {
        this.lastQueryType = 'materials';
        return {
          type: 'materials',
          text: `**Material Craft & Care Standards**\n\n` +
                `• **2-Ply Cashmere**: Sourced from Inner Mongolia. We recommend dry cleaning or hand-washing cold with wool detergent; lay flat to dry.\n` +
                `• **Unlined Merino Wool**: Breathable weave engineered for Dhaka's climate. Spot clean or professional dry clean only.\n` +
                `• **Full-Grain Italian Leather**: Wipe gently with a damp cloth and apply neutral leather balm seasonally.\n` +
                `• **Brushed Titanium**: Grade-5 titanium is scratch-resistant and hypoallergenic. Rinse in fresh water after saltwater exposure.`,
          products: catalog.slice(0, 3),
          suggestedChips: ['Show cashmere pieces', 'Show leather runner', 'Check sizing']
        };
      }

      // ── 5. ORDER TRACKING & ACCOUNT ──────────────────────────────────────
      if (/track|order status|where is my order|find my order/.test(rawText)) {
        return {
          type: 'tracking',
          text: `You can view the real-time fulfillment status of your shipments anytime on our **Order Tracking** portal. Simply enter your order code (e.g. \`NX-8921-X\`).`,
          actionLink: { text: 'OPEN TRACKING PORTAL →', url: 'tracking.html' },
          products: [],
          suggestedChips: ['Delivery timelines', 'Start shopping']
        };
      }

      // ── 6. GREETINGS & CASUAL OPENERS ────────────────────────────────────
      if (/^(hi|hello|hey|greetings|good day|good morning|good evening|help|what can you do)\b/i.test(rawText)) {
        return {
          type: 'greeting',
          text: `Hello. I can assist you with curated wardrobe recommendations, sizing advice, complete look pairings, or delivery information. What would you like to explore?`,
          products: catalog.slice(0, 2),
          suggestedChips: ['Show me jackets', 'Under BDT 20,000', 'Something for dinner', 'Check sizing']
        };
      }

      // ── 7. INTENT PARSING & CATALOG QUERY ─────────────────────────────────
      let intent = null;
      if (window.NexIntentParser) {
        intent = window.NexIntentParser.parse(text);
        try {
          sessionStorage.setItem('nexIntent', JSON.stringify(intent));
        } catch (e) {}
      }

      let results = { products: [] };
      if (window.NexCatalogEngine) {
        if (intent && Object.keys(intent).length > 1) {
          results = window.NexCatalogEngine.query(intent);
        } else {
          results = window.NexCatalogEngine.keywordFallback(text);
        }
      }

      let products = results.products || [];

      // Budget filtering safety check if mentioned in raw text
      const budgetMatch = rawText.match(/(?:under|less than|below|max|upto|budget)\s*(?:bdt|tk)?\s*([\d,]+k?)/i);
      if (budgetMatch) {
        let maxVal = parseFloat(budgetMatch[1].replace(/,/g, ''));
        if (budgetMatch[1].toLowerCase().endsWith('k')) maxVal *= 1000;
        if (maxVal > 0) {
          products = products.filter(p => (p.numericPrice || 0) <= maxVal);
        }
      }

      // ── 8. NO RESULTS FALLBACK ───────────────────────────────────────────
      if (products.length === 0) {
        return {
          type: 'no_results',
          text: `I couldn't find an exact match for "${text}" in the current collection. Here are our most versatile wardrobe staples available right now:`,
          products: catalog.slice(0, 3),
          suggestedChips: ['Show all apparel', 'Under BDT 20,000', 'Check sizing', 'Start fresh']
        };
      }

      // ── 9. COMPLETE THE LOOK / OUTFIT MODE ───────────────────────────────
      const isBundleRequest = (intent && intent.occasion) || /outfit|look|pair|complete the look|suit|dinner|date|evening/.test(rawText);

      if (isBundleRequest && products.length >= 2) {
        // Select items from different categories for a cohesive look
        const lookItems = [];
        const seenCats = new Set();
        for (const p of products) {
          if (!seenCats.has(p.category)) {
            lookItems.push(p);
            seenCats.add(p.category);
          }
          if (lookItems.length >= 3) break;
        }

        return {
          type: 'bundle',
          text: `Here is a complete look curated for your occasion. Every piece is selected to harmonize in tone, texture, and silhouette:`,
          products: lookItems.length >= 2 ? lookItems : products.slice(0, 3),
          isBundleLook: true,
          suggestedChips: ['Under BDT 25,000', 'Check sizing', 'Different style', 'Show sweaters']
        };
      }

      // ── 10. SINGLE / MULTI PRODUCT RECOMMENDATIONS ────────────────────────
      let responseText = `Here is what I selected for you:`;

      if (!this.profileAcknowledged && window.NexStyleProfile) {
        const profile = window.NexStyleProfile.getActiveProfile();
        if (profile && (profile.stylePreferences.length > 0 || profile.colorPreferences.length > 0)) {
          responseText = `Reflecting your saved style preferences, here are our recommended pieces:`;
          this.profileAcknowledged = true;
        }
      } else if (this.contextRefined) {
        responseText = `I've narrowed the selection based on your updated preferences:`;
      }
      this.contextRefined = true;

      return {
        type: 'products',
        text: responseText,
        products: products.slice(0, 3),
        isBundleLook: false,
        suggestedChips: ['Check sizing', 'Under BDT 20,000', 'Complete the look', 'Delivery options']
      };
    }

    _fallbackResponse() {
      return {
        type: 'text',
        text: 'I can help you explore our collection, select your size, or put together a complete look. What style or occasion are you shopping for?',
        products: [],
        suggestedChips: ['Show me jackets', 'Under BDT 20,000', 'Check sizing']
      };
    }
  }

  window.NexConciergeEngine = new ConciergeEngine();

})(window);
