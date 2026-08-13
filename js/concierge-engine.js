/**
 * nexCommerce AI &mdash; Concierge Engine (Feature 6)
 * Orchestrates Intent Parsing, Catalog Queries, Context, and Profile.
 * Deterministic (Zero-Hallucination) shopping assistant logic.
 */

(function(window) {
  'use strict';

  class ConciergeEngine {
    constructor() {
      this.contextRefined = false;
      this.profileAcknowledged = false;
    }

    /**
     * Initializes the conversation state, checking for existing session intent.
     * @returns {Object} Initial greeting response payload
     */
    initialize() {
      let greeting = 'Good evening. What are you looking for today?';
      let suggestedChips = ['Show me jackets', 'Under BDT 20,000', 'Something for the office', 'Complete a look'];

      // Feature 2: Context Handoff
      try {
        const storedIntent = sessionStorage.getItem('nexIntent');
        if (storedIntent) {
          const intent = JSON.parse(storedIntent);
          if (intent.category && intent.category.value) {
            greeting = `I see you were exploring ${intent.category.value.toLowerCase()} earlier. Would you like to continue with that search, or are you looking for something different?`;
            suggestedChips = [`Continue with ${intent.category.value.toLowerCase()}`, 'Start fresh', 'Show me new arrivals'];
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

      const rawText = text.toLowerCase();

      // Simple hardcoded out-of-scope check
      if (rawText.includes('weather') || rawText.includes('president') || rawText.includes('joke') || rawText.includes('flight')) {
        return {
          type: 'text',
          text: 'I can help you discover products, find your size, or put together a complete look. What would you like to explore?',
          suggestedChips: ['Show me jackets', 'Outfit for dinner'],
          products: []
        };
      }

      // Feature 1: Intent Parsing
      let intent = null;
      if (window.NexIntentParser) {
        intent = window.NexIntentParser.parse(text);
        // Persist intent to session for Feature 2 cross-compatibility
        sessionStorage.setItem('nexIntent', JSON.stringify(intent));
      }

      // Feature 1 + 3: Catalog Query (NexCatalogEngine automatically factors in NexStyleProfile)
      let results = { products: [] };
      if (window.NexCatalogEngine) {
        if (intent && Object.keys(intent).length > 1) { // More than just 'raw'
          results = window.NexCatalogEngine.query(intent);
        } else {
          results = window.NexCatalogEngine.keywordFallback(text);
        }
      }

      const products = results.products || [];

      // State 6: No Results
      if (products.length === 0) {
        // Just return the top 2 overall items as a fallback
        const catalog = (window.NexAI && window.NexAI.catalogArray) ? window.NexAI.catalogArray : [];
        return {
          type: 'no_results',
          text: 'I couldn\'t find an exact match in the current collection. Here are the closest options available.',
          products: catalog.slice(0, 2),
          suggestedChips: ['Try something else']
        };
      }

      // Check if we should render a "Complete the Look" bundle
      // Triggered if intent has an occasion or explicitly asks for an outfit/look
      const isBundleRequest = (intent && intent.occasion) || rawText.includes('outfit') || rawText.includes('look');

      let responseText = 'Here\'s what I found based on your request.';
      
      // Feature 3: Profile Acknowledgement (once per session)
      if (!this.profileAcknowledged && window.NexStyleProfile) {
        const profile = window.NexStyleProfile.getActiveProfile();
        if (profile && (profile.stylePreferences.length > 0 || profile.colorPreferences.length > 0)) {
          responseText = `Keeping your saved style preferences in mind, here is what I found.`;
          this.profileAcknowledged = true;
        }
      }

      // Refinement acknowledgment
      if (this.contextRefined) {
        responseText = 'Of course. I\'ve narrowed the selection based on your updated request.';
      }
      this.contextRefined = true; // Any subsequent message is a refinement

      if (isBundleRequest && products.length >= 2) {
        // State 3: Complete the Look Mode
        return {
          type: 'bundle',
          text: 'Here\'s a complete look curated for the occasion.',
          products: products.slice(0, 4), // Up to 4 items for a look
          isBundleLook: true,
          suggestedChips: ['Under BDT 25,000', 'Different colors']
        };
      } else {
        // State 2: Single Product Recommendation
        return {
          type: 'products',
          text: responseText,
          products: products.slice(0, 3), // Max 3 individual cards
          isBundleLook: false,
          suggestedChips: ['Show more options', 'Check sizing']
        };
      }
    }

    _fallbackResponse() {
      return {
        type: 'text',
        text: 'I\'m not sure I understood. Could you try rephrasing what you\'re looking for?',
        products: [],
        suggestedChips: ['Show me jackets', 'Under BDT 20,000']
      };
    }
  }

  window.NexConciergeEngine = new ConciergeEngine();

})(window);
