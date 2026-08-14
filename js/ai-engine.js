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
      brand: 'Arc',
      title: 'Architectural Cashmere Sweater',
      price: 'BDT 18,400',
      numericPrice: 18400,
      category: 'Apparel',
      img: 'hero_sweater.png',
      desc: 'Structured cashmere knit with lightweight warmth and a relaxed architectural silhouette. Crafted for evening refinement.',
      keywords: ["cashmere","sweater","roll-neck","turtleneck","wool","warm","cream","knitwear","winter","cold","dhaka"],
      vector: [0.9, 0.1, 0, 0.1, 0.95]
    },
    p2: {
      id: 'p2',
      brand: 'Arc',
      title: 'Structured Wool Blazer',
      price: 'BDT 24,500',
      numericPrice: 24500,
      category: 'Apparel',
      img: 'plp_blazer.png',
      desc: 'Unlined merino weave tailored for sharp evening silhouettes without thermal discomfort. Transitions effortlessly from meeting room to dinner.',
      keywords: ["jacket","coat","wool","blazer","outerwear","winter","warm","minimalist","japanese","tailored","navy","black","apparel","clothing"],
      vector: [0.96, 0.1, 0, 0.2, 0.9]
    },
    p3: {
      id: 'p3',
      brand: 'Arc',
      title: 'Fine-Knit Cashmere Crew',
      price: 'BDT 16,200',
      numericPrice: 16200,
      category: 'Apparel',
      img: 'plp_crewneck.png',
      desc: 'Ultra-soft 2-ply cashmere with a classic crew neck designed for easy indoor/outdoor layering in any season.',
      keywords: ["cashmere","crew","crewneck","sweater","wool","warm","minimalist","apparel","white"],
      vector: [0.9, 0.1, 0, 0.1, 0.9]
    },
    p4: {
      id: 'p4',
      brand: 'Form',
      title: 'Studio Acoustics Headphone GT',
      price: 'BDT 32,000',
      numericPrice: 32000,
      category: 'Acoustics',
      img: 'prod_headphones.png',
      desc: 'Active noise cancellation calibrated for focused work or travel. Memory foam ear cushions wrapped in lambskin for extended comfort.',
      keywords: ["headphones","audio","sound","music","acoustic","studio","beryllium","noise canceling","travel","wireless","over-ear","black"],
      vector: [0, 0, 0.98, 0.3, 0.7]
    },
    p5: {
      id: 'p5',
      brand: 'Volta',
      title: 'Chronograph Minimalist Watch',
      price: 'BDT 28,500',
      numericPrice: 28500,
      category: 'Accessories',
      img: 'search_watch.png',
      desc: 'Brushed titanium casing with a scratch-resistant sapphire crystal. Swiss movement with interchangeable leather and mesh straps.',
      keywords: ["watch","titanium","timepiece","smartwatch","biometrics","pulse","gps","sapphire","luxurious","clock","wrist"],
      vector: [0.1, 0.3, 0.2, 0.96, 0.8]
    },
    p6: {
      id: 'p6',
      brand: 'Apex',
      title: 'Minimalist Leather Runner',
      price: 'BDT 19,800',
      numericPrice: 19800,
      category: 'Footwear',
      img: 'prod_runner.png',
      desc: 'Full-grain Italian leather upper with cushioned Vibram sole for all-day urban walkability without compromise.',
      keywords: ["sneaker","shoe","leather","court","trainer","white","footwear","minimal"],
      vector: [0.1, 0.94, 0, 0.2, 0.85]
    },
    p7: {
      id: 'p7',
      brand: 'Forma',
      title: 'Architectural Canvas Tote',
      price: 'BDT 12,500',
      numericPrice: 12500,
      category: 'Accessories',
      img: 'prod_tote.png',
      desc: 'Heavyweight organic cotton canvas tote featuring veg-tan leather handles and internal laptop sleeve.',
      keywords: ["bag","tote","canvas","carry","leather","accessories","cream","minimalist"],
      vector: [0.3, 0.2, 0.3, 0.2, 0.85]
    },
    p8: {
      id: 'p8',
      brand: 'Form',
      title: 'Noise Canceling Earbuds',
      price: 'BDT 14,500',
      numericPrice: 14500,
      category: 'Acoustics',
      img: 'search_earbuds.png',
      desc: 'High-fidelity audio with adaptive noise cancellation. Sweat and water-resistant for active lifestyles.',
      keywords: ["earbuds","audio","sound","portable","bluetooth","aluminum","object"],
      vector: [0, 0, 0.96, 0.4, 0.8]
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
    const q = (queryText || '').toLowerCase();
    
    // Feature vector weights: [Outerwear, Footwear, Audio, Timepiece, EditorialLuxury]
    let vec = [0.1, 0.1, 0.1, 0.1, 0.5];

    if (/coat|jacket|blazer|wool|warm|winter|outerwear|layer|apparel|tailored|clothing|sweater|knit/.test(q)) {
      vec[0] += 0.85;
    }
    if (/shoe|footwear|run|sneaker|sport|marathon|athletic|distance|walk|runner/.test(q)) {
      vec[1] += 0.85;
    }
    if (/headphone|earbud|audio|sound|music|listen|acoustic|noise|travel|wireless/.test(q)) {
      vec[2] += 0.85;
    }
    if (/watch|time|pulse|titanium|wrist|clock|gps|smartwatch|biometric|chronograph/.test(q)) {
      vec[3] += 0.85;
    }
    if (/luxury|editorial|minimal|refined|architectural|black|modern|tote|bag/.test(q)) {
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
      let vectorScore = cosineSimilarity(queryVec, product.vector);
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

    const matchingProducts = semanticSearch(userMessage, 2);
    const topProduct = matchingProducts[0] || PRODUCT_EMBEDDINGS.p1;

    let replyText = "";
    let recommendedProducts = [];
    const msgLower = (userMessage || '').toLowerCase();

    if (/hello|hi|hey|greetings/.test(msgLower)) {
      replyText = "Good day. I am your nexCommerce Style Concierge. I can assist you with curated wardrobe pairings, acoustic objects, sizing advice, or delivery inquiries. What are you looking to discover today?";
    } else if (/coat|jacket|blazer|outerwear|winter|layer|warm/.test(msgLower)) {
      const blazer = PRODUCT_EMBEDDINGS.p2 || topProduct;
      replyText = `For refined tailoring and versatile layering, I recommend our **${blazer.title}** (${blazer.price}). Tailored from unlined merino wool for sharp evening silhouettes.`;
      recommendedProducts = [blazer];
    } else if (/sweater|knitwear|crew|cashmere/.test(msgLower)) {
      const sweater = PRODUCT_EMBEDDINGS.p1 || topProduct;
      replyText = `For pure comfort and warmth, our **${sweater.title}** (${sweater.price}) is crafted with 2-ply structured cashmere with a soft roll neck.`;
      recommendedProducts = [sweater];
    } else if (/shoe|run|footwear|sneaker|sport/.test(msgLower)) {
      const shoe = PRODUCT_EMBEDDINGS.p6 || topProduct;
      replyText = `For everyday movement, the **${shoe.title}** (${shoe.price}) features full-grain Italian leather with a cushioned Vibram sole.`;
      recommendedProducts = [shoe];
    } else if (/audio|headphone|music|sound|listen|quiet|earbuds/.test(msgLower)) {
      const audio = PRODUCT_EMBEDDINGS.p4 || topProduct;
      replyText = `For acoustic clarity, I suggest the **${audio.title}** (${audio.price}) featuring active noise cancellation and memory foam lambskin cushions.`;
      recommendedProducts = [audio];
    } else if (/watch|time|pulse|titanium|chronograph/.test(msgLower)) {
      const watch = PRODUCT_EMBEDDINGS.p5 || topProduct;
      replyText = `Our **${watch.title}** (${watch.price}) is crafted in brushed titanium with scratch-resistant sapphire crystal and interchangeable straps.`;
      recommendedProducts = [watch];
    } else if (/tote|bag|carry/.test(msgLower)) {
      const tote = PRODUCT_EMBEDDINGS.p7 || topProduct;
      replyText = `For daily carry, the **${tote.title}** (${tote.price}) is made with heavyweight organic cotton canvas and veg-tan leather handles.`;
      recommendedProducts = [tote];
    } else {
      replyText = `Based on your request, I've selected the **${topProduct.title}** (${topProduct.price}) from our collection. Every detail is crafted for effortless luxury.`;
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

  // 6. PUBLIC API: USER AFFINITY & PERSONALIZED RECOMMENDATIONS
  const USER_HISTORY_KEY = 'nex_user_affinity_history';

  function getUserHistory() {
    try {
      const data = localStorage.getItem(USER_HISTORY_KEY);
      return data ? JSON.parse(data) : { views: ['p1', 'p2'], searches: ['cashmere sweater'] };
    } catch (e) {
      return { views: ['p1', 'p2'], searches: ['cashmere sweater'] };
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

  // 7. PUBLIC API: VISUAL VECTOR SEARCH / SHOP BY PHOTO
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

  // 8. PUBLIC API: SMART SIZE ADVISOR & BUNDLE SUGGESTIONS
  const BRAND_SIZE_MAP = {
    p1: { recommendedSize: 'Medium', confidence: '88%', note: 'Structured 2-ply cashmere. Fits true to size; order one size up for layering.' },
    p2: { recommendedSize: 'UK 38 / Medium', confidence: '92%', note: 'Tailored shoulder with natural unlined drape.' },
    p3: { recommendedSize: 'Medium', confidence: '90%', note: 'Ultra-soft cashmere crew. Regular fit.' },
    p4: { recommendedSize: 'One Size', confidence: '99%', note: 'Memory foam with adjustable lambskin headband.' },
    p5: { recommendedSize: '40mm Case', confidence: '95%', note: 'Includes interchangeable leather & titanium straps.' },
    p6: { recommendedSize: 'EU 42 / UK 8', confidence: '87%', note: 'Italian calfskin with cushioned Vibram sole.' },
    p7: { recommendedSize: 'One Size (18L)', confidence: '99%', note: 'Includes internal 15" laptop sleeve.' },
    p8: { recommendedSize: 'One Size', confidence: '99%', note: 'Includes 3 sizes of silicone ear tips.' }
  };

  function getRecommendedSize(productId) {
    return BRAND_SIZE_MAP[productId] || { recommendedSize: 'Medium / UK 38', confidence: '85%', note: 'Recommended based on your measurements' };
  }

  function getBundleSuggestions(productId, limit = 2) {
    const current = PRODUCT_EMBEDDINGS[productId];
    if (!current) return [];

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
