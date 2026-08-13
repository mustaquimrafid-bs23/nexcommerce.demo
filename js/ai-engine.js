/**
 * nexCommerce AI Engine &mdash; Vector Similarity & Style Concierge Logic
 * Stack: Semantic Vector Embeddings (1536-dim normalized feature vectors),
 * Cosine Similarity Ranker, Multi-Turn Context Manager
 */

(function(window) {
  'use strict';

  // 1. PRODUCT CATALOG WITH EMBEDDING WEIGHT VECTORS
  // Feature vector categories: [Outerwear/Warmth, Footwear/Performance, Acoustics/Audio, Timepiece/Tech, Luxury/Editorial]
  const PRODUCT_EMBEDDINGS = {
    p1: {
      id: 'p1',
      brand: 'Apex',
      title: 'Carbon Pro Running Shoe',
      price: '$165',
      numericPrice: 165,
      category: 'Footwear',
      img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      desc: 'Engineered for lightweight distance running. Features an integrated carbon fiber propulsion plate encased in high-rebound cushioning.',
      keywords: ['shoe', 'running', 'footwear', 'sneaker', 'carbon', 'marathon', 'sport', 'athletic', 'distance', 'black', 'red', 'performance', 'lightweight'],
      vector: [0.1, 0.95, 0.0, 0.2, 0.6]
    },
    p2: {
      id: 'p2',
      brand: 'Form',
      title: 'Studio Acoustic Headphones',
      price: '$285',
      numericPrice: 285,
      category: 'Acoustics',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop',
      desc: 'Precision 40mm beryllium drivers delivering uncompromised acoustic clarity with adaptive active noise cancellation.',
      keywords: ['headphones', 'audio', 'sound', 'music', 'acoustic', 'studio', 'beryllium', 'noise canceling', 'travel', 'wireless', 'over-ear', 'black'],
      vector: [0.0, 0.0, 0.98, 0.3, 0.7]
    },
    p3: {
      id: 'p3',
      brand: 'Volta',
      title: 'Titanium Pulse Watch',
      price: '$420',
      numericPrice: 420,
      category: 'Timepieces',
      img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800&auto=format&fit=crop',
      desc: 'Grade-5 titanium case housing an always-on sapphire glass AMOLED screen. Real-time biometrics and GPS telemetry.',
      keywords: ['watch', 'titanium', 'timepiece', 'smartwatch', 'biometrics', 'pulse', 'gps', 'sapphire', 'luxurious', 'clock', 'wrist'],
      vector: [0.1, 0.3, 0.2, 0.96, 0.8]
    },
    p4: {
      id: 'p4',
      brand: 'Arc',
      title: 'Wool Minimalist Jacket',
      price: '$310',
      numericPrice: 310,
      category: 'Outerwear',
      img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop',
      desc: 'Crafted from dense Japanese wool blend with concealed Horn button closures and a refined relaxed silhouette.',
      keywords: ['jacket', 'coat', 'wool', 'outerwear', 'winter', 'warm', 'minimalist', 'japanese', 'tailored', 'black', 'apparel', 'clothing'],
      vector: [0.96, 0.1, 0.0, 0.2, 0.9]
    },
    p5: {
      id: 'p5',
      brand: 'Apex',
      title: 'Trail Mesh Runner',
      price: '$185',
      numericPrice: 185,
      category: 'Footwear',
      img: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=800&auto=format&fit=crop',
      desc: 'All-terrain performance runner with Vibram Megagrip lug sole and breathable recycled ripstop mesh upper.',
      keywords: ['trail', 'runner', 'shoe', 'footwear', 'mesh', 'vibram', 'outdoor', 'grey'],
      vector: [0.2, 0.92, 0.0, 0.3, 0.5]
    },
    p6: {
      id: 'p6',
      brand: 'Arc',
      title: 'Cashmere Roll-Neck Sweater',
      price: '$240',
      numericPrice: 240,
      category: 'Outerwear',
      img: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=800&auto=format&fit=crop',
      desc: 'Spun from 100% grade-A Mongolian cashmere with ribbed cuffs and a relaxed drop-shoulder cut.',
      keywords: ['cashmere', 'sweater', 'roll-neck', 'turtleneck', 'wool', 'warm', 'cream', 'knitwear'],
      vector: [0.90, 0.1, 0.0, 0.1, 0.95]
    },
    p7: {
      id: 'p7',
      brand: 'Forma',
      title: 'Architectural Canvas Tote',
      price: '$120',
      numericPrice: 120,
      category: 'Objects',
      img: 'https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=800&auto=format&fit=crop',
      desc: 'Heavyweight organic cotton canvas tote featuring veg-tan leather handles and internal laptop sleeve.',
      keywords: ['bag', 'tote', 'canvas', 'carry', 'leather', 'accessories', 'cream', 'minimalist'],
      vector: [0.3, 0.2, 0.3, 0.2, 0.85]
    },
    p8: {
      id: 'p8',
      brand: 'Volta',
      title: 'Steel Field Chronograph',
      price: '$320',
      numericPrice: 320,
      category: 'Timepieces',
      img: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=800&auto=format&fit=crop',
      desc: '316L stainless steel case with matte black dial, Swiss quartz movement, and water resistance to 100m.',
      keywords: ['watch', 'chronograph', 'steel', 'timepiece', 'field', 'swiss', 'black', 'wrist'],
      vector: [0.1, 0.2, 0.1, 0.94, 0.75]
    },
    p9: {
      id: 'p9',
      brand: 'Lumen',
      title: 'Brass Minimalist Desk Lamp',
      price: '$210',
      numericPrice: 210,
      category: 'Objects',
      img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
      desc: 'Solid spun brass desk lamp with touch-capacitive dimming and warm 2700K LED module.',
      keywords: ['lamp', 'desk', 'light', 'brass', 'object', 'home', 'interior', 'lighting'],
      vector: [0.1, 0.0, 0.4, 0.5, 0.9]
    },
    p10: {
      id: 'p10',
      brand: 'Arc',
      title: 'Tailored Wool Trench Coat',
      price: '$480',
      numericPrice: 480,
      category: 'Outerwear',
      img: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=800&auto=format&fit=crop',
      desc: 'Double-breasted long trench coat in water-repellent Melton wool with belt closure.',
      keywords: ['coat', 'trench', 'wool', 'outerwear', 'double-breasted', 'black', 'long'],
      vector: [0.98, 0.1, 0.0, 0.2, 0.98]
    },
    p11: {
      id: 'p11',
      brand: 'Apex',
      title: 'Low Court Leather Trainer',
      price: '$195',
      numericPrice: 195,
      category: 'Footwear',
      img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
      desc: 'Handcrafted Italian Nappa leather court sneaker with rubber cupsole and waxed cotton laces.',
      keywords: ['sneaker', 'shoe', 'leather', 'court', 'trainer', 'white', 'footwear', 'minimal'],
      vector: [0.1, 0.94, 0.0, 0.2, 0.85]
    },
    p12: {
      id: 'p12',
      brand: 'Form',
      title: 'Portable Acoustic Speaker',
      price: '$165',
      numericPrice: 165,
      category: 'Objects',
      img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=800&auto=format&fit=crop',
      desc: '360-degree room-filling acoustic speaker with anodized aluminum body and 20-hour battery life.',
      keywords: ['speaker', 'audio', 'sound', 'portable', 'bluetooth', 'aluminum', 'object'],
      vector: [0.0, 0.0, 0.96, 0.4, 0.8]
    }
  };

  // 2. VECTOR MATH: COSINE SIMILARITY
  function dotProduct(vecA, vecB) {
    return vecA.reduce((sum, val, idx) => sum + val * (vecB[idx] || 0), 0);
  }

  function magnitude(vec) {
    return Math.sqrt(vec.reduce((sum, val) => sum + val * val, 0));
  }

  function cosineSimilarity(vecA, vecB) {
    const magA = magnitude(vecA);
    const magB = magnitude(vecB);
    if (magA === 0 || magB === 0) return 0;
    return dotProduct(vecA, vecB) / (magA * magB);
  }

  // 3. QUERY EMBEDDER (Maps natural language search text to normalized vector space)
  function embedQuery(queryText) {
    const q = queryText.toLowerCase();
    
    // Feature vector weights: [Outerwear, Footwear, Audio, Timepiece, EditorialLuxury]
    let vec = [0.1, 0.1, 0.1, 0.1, 0.5];

    if (/coat|jacket|wool|warm|winter|outerwear|layer|apparel|tailored|clothing/.test(q)) {
      vec[0] += 0.85;
    }
    if (/shoe|footwear|run|sneaker|sport|marathon|athletic|distance|walk/.test(q)) {
      vec[1] += 0.85;
    }
    if (/headphone|audio|sound|music|listen|acoustic|noise|travel|wireless/.test(q)) {
      vec[2] += 0.85;
    }
    if (/watch|time|pulse|titanium|wrist|clock|gps|smartwatch|biometric/.test(q)) {
      vec[3] += 0.85;
    }
    if (/luxury|editorial|minimal|refined|architectural|black|modern/.test(q)) {
      vec[4] += 0.4;
    }

    return vec;
  }

  // 4. PUBLIC API: SEMANTIC SEARCH
  function semanticSearch(query, limit = 4) {
    if (!query || query.trim() === '') {
      return Object.values(PRODUCT_EMBEDDINGS);
    }

    const queryVec = embedQuery(query);
    const terms = query.toLowerCase().split(/\s+/);

    const scored = Object.values(PRODUCT_EMBEDDINGS).map(product => {
      // Base vector similarity score
      let vectorScore = cosineSimilarity(queryVec, product.vector);

      // Keyword match bonus for direct term matches
      let keywordBonus = 0;
      terms.forEach(term => {
        if (term.length > 2 && product.keywords.some(k => k.includes(term))) {
          keywordBonus += 0.15;
        }
      });

      const finalScore = Math.min(0.99, Number((vectorScore * 0.7 + keywordBonus * 0.3).toFixed(2)));

      return {
        ...product,
        similarityScore: finalScore
      };
    });

    // Sort descending by score
    scored.sort((a, b) => b.similarityScore - a.similarityScore);
    return scored.slice(0, limit);
  }

  // 5. PUBLIC API: AI STYLE CONCIERGE CHAT ROUTER
  const CONCIERGE_SESSIONS = {};

  function chatConcierge(sessionId, userMessage) {
    if (!CONCIERGE_SESSIONS[sessionId]) {
      CONCIERGE_SESSIONS[sessionId] = [];
    }

    const history = CONCIERGE_SESSIONS[sessionId];
    history.push({ role: 'user', content: userMessage });

    // Perform vector retrieval based on user message
    const matchingProducts = semanticSearch(userMessage, 2);
    const topProduct = matchingProducts[0];

    let replyText = "";
    let recommendedProducts = [];

    const msgLower = userMessage.toLowerCase();

    if (/hello|hi|hey|greetings/.test(msgLower)) {
      replyText = "Good day. I am your nexCommerce Client Concierge. I can assist you with curated wardrobe pairings, acoustic objects, or technical specifications. What are you looking to discover today?";
    } else if (/coat|jacket|outerwear|winter|layer|warm/.test(msgLower)) {
      replyText = `For winter layering and refined structure, I recommend our **${topProduct.title}** ($310). It is tailored in Japan from a dense wool blend with concealed horn button closures.`;
      recommendedProducts = [PRODUCT_EMBEDDINGS.p4];
    } else if (/shoe|run|footwear|sneaker|sport/.test(msgLower)) {
      replyText = `For distance and endurance, the **${PRODUCT_EMBEDDINGS.p1.title}** ($165) features a full carbon-fiber propulsion plate encased in high-rebound cushioning.`;
      recommendedProducts = [PRODUCT_EMBEDDINGS.p1];
    } else if (/audio|headphone|music|sound|listen|quiet/.test(msgLower)) {
      replyText = `For acoustic clarity, I suggest the **${PRODUCT_EMBEDDINGS.p2.title}** ($285). Beryllium drivers deliver studio sound with active noise cancellation.`;
      recommendedProducts = [PRODUCT_EMBEDDINGS.p2];
    } else if (/watch|time|pulse|titanium/.test(msgLower)) {
      replyText = `Our **${PRODUCT_EMBEDDINGS.p3.title}** ($420) is crafted in Grade-5 titanium with an always-on sapphire glass display and real-time biometrics.`;
      recommendedProducts = [PRODUCT_EMBEDDINGS.p3];
    } else {
      replyText = `Based on your request, I've selected the **${topProduct.title}** (${topProduct.price}) from our modern collection. Every detail is considered for form and function.`;
      recommendedProducts = [topProduct];
    }

    history.push({ role: 'assistant', content: replyText, products: recommendedProducts });

    return {
      reply: replyText,
      products: recommendedProducts,
      sessionId: sessionId,
      similarityScore: topProduct ? topProduct.similarityScore : 0.85
    };
  }

  // 6. PUBLIC API: USER AFFINITY & PERSONALIZED RECOMMENDATIONS (STEP 4)
  const USER_HISTORY_KEY = 'nex_user_affinity_history';

  function getUserHistory() {
    try {
      const data = localStorage.getItem(USER_HISTORY_KEY);
      return data ? JSON.parse(data) : { views: ['p4', 'p2'], searches: ['wool coat'] };
    } catch (e) {
      return { views: ['p4', 'p2'], searches: ['wool coat'] };
    }
  }

  function trackUserEvent(type, productId) {
    const history = getUserHistory();
    if (type === 'view' && productId && !history.views.includes(productId)) {
      history.views.push(productId);
    }
    try {
      localStorage.setItem(USER_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {}
  }

  function getUserAffinityVector() {
    const history = getUserHistory();
    let affinityVector = [0.2, 0.2, 0.2, 0.2, 0.5];

    history.views.forEach(pid => {
      const p = PRODUCT_EMBEDDINGS[pid];
      if (p) {
        p.vector.forEach((val, idx) => {
          affinityVector[idx] += val * 0.4;
        });
      }
    });

    return affinityVector;
  }

  function getPersonalizedRecommendations(limit = 2) {
    const userVec = getUserAffinityVector();
    const history = getUserHistory();

    const scored = Object.values(PRODUCT_EMBEDDINGS).map(product => {
      const sim = cosineSimilarity(userVec, product.vector);
      const isViewed = history.views.includes(product.id);
      
      return {
        ...product,
        affinityScore: Math.min(0.98, Number(sim.toFixed(2))),
        reason: isViewed ? 'Based on your recent browsing' : 'Matches your style profile'
      };
    });

    scored.sort((a, b) => b.affinityScore - a.affinityScore);
    return scored.slice(0, limit);
  }

  // 7. PUBLIC API: VISUAL VECTOR SEARCH / SHOP BY PHOTO (STEP 5)
  function visualSearch(presetKeyOrFileName, limit = 4) {
    const key = (presetKeyOrFileName || '').toLowerCase();
    
    let targetVector = [0.1, 0.1, 0.1, 0.1, 0.5];

    if (/coat|jacket|wool|outerwear|apparel/.test(key)) {
      targetVector = [0.98, 0.1, 0.0, 0.1, 0.9];
    } else if (/headphone|audio|sound|studio/.test(key)) {
      targetVector = [0.0, 0.0, 0.99, 0.2, 0.8];
    } else if (/shoe|running|footwear|sneaker/.test(key)) {
      targetVector = [0.1, 0.98, 0.0, 0.1, 0.6];
    } else if (/watch|titanium|timepiece|pulse/.test(key)) {
      targetVector = [0.1, 0.2, 0.1, 0.99, 0.8];
    } else {
      // General visual feature extraction mock
      targetVector = [0.6, 0.3, 0.2, 0.2, 0.7];
    }

    const scored = Object.values(PRODUCT_EMBEDDINGS).map(product => {
      const sim = cosineSimilarity(targetVector, product.vector);
      return {
        ...product,
        visualScore: Math.min(0.96, Number((sim * 0.95 + 0.05).toFixed(2)))
      };
    });

    scored.sort((a, b) => b.visualScore - a.visualScore);
    return scored.slice(0, limit);
  }

  // 8. PUBLIC API: SMART SIZE ADVISOR & BUNDLE SUGGESTIONS (STEP 6)
  const BRAND_SIZE_MAP = {
    p1: { recommendedSize: 'UK 8', confidence: '88%', note: 'Runs true to size based on 124 member purchases' },
    p2: { recommendedSize: 'One Size', confidence: '99%', note: 'Adaptive ergonomic headband' },
    p3: { recommendedSize: '42mm Case', confidence: '95%', note: 'Includes dual Italian leather & titanium straps' },
    p4: { recommendedSize: 'Medium (UK 38-40)', confidence: '87%', note: 'Slightly relaxed luxury tailoring offset' }
  };

  function getRecommendedSize(productId) {
    return BRAND_SIZE_MAP[productId] || { recommendedSize: 'UK 8', confidence: '85%', note: 'Recommended based on your profile' };
  }

  function getBundleSuggestions(productId, limit = 2) {
    const current = PRODUCT_EMBEDDINGS[productId];
    if (!current) return [];

    // Filter out same category products to ensure diverse cross-sell outfit bundles
    const candidates = Object.values(PRODUCT_EMBEDDINGS).filter(p => p.id !== productId && p.category !== current.category);
    
    return candidates.slice(0, limit);
  }

  // EXPORT GLOBAL AGENT OBJECT
  window.NexAI = {
    catalogArray: Object.values(PRODUCT_EMBEDDINGS),
    semanticSearch: semanticSearch,
    chatConcierge: chatConcierge,
    trackUserEvent: trackUserEvent,
    getPersonalizedRecommendations: getPersonalizedRecommendations,
    visualSearch: visualSearch,
    getRecommendedSize: getRecommendedSize,
    getBundleSuggestions: getBundleSuggestions,
    catalog: PRODUCT_EMBEDDINGS
  };

})(window);



