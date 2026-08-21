/**
 * nexCommerce — Autonomous Target-Budget Cart Builder Engine (Capability 3)
 * Solves multi-category constraint satisfaction problems to construct an optimized
 * product basket under a user-defined price ceiling with headroom telemetry.
 */
(function(window) {
  'use strict';

  function parseBudgetIntent(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string') return { isBudgetIntent: false, targetBudget: 0, occasionTheme: 'general' };
    const q = rawQuery.toLowerCase().trim();

    // Check for budget keywords and currency amounts
    const budgetMatch = q.match(/(?:under|below|for|budget of|max(?:imum)? of|around)?\s*(?:€|eur|tk|৳|\$)?\s*(\d{2,5})\s*(?:€|eur|euro|tk|taka|bdt|\$|dollars?)?/i);
    const hasIntentKeyword = /\b(make.*cart|build.*cart|create.*cart|grocery.*cart|monthly.*cart|budget cart|wardrobe.*cart|bundle.*under|cart.*under|pack.*under)\b/i.test(q) || (budgetMatch && /\b(cart|wardrobe|basket|bundle|essentials)\b/i.test(q));

    if (!hasIntentKeyword || !budgetMatch) {
      return { isBudgetIntent: false, targetBudget: 0, occasionTheme: 'general' };
    }

    const amount = parseInt(budgetMatch[1], 10);
    let theme = 'general';
    if (/autumn|fall|winter|cozy/i.test(q)) theme = 'autumn';
    else if (/office|work|business|formal/i.test(q)) theme = 'office';
    else if (/summer|beach|vacation/i.test(q)) theme = 'summer';
    else if (/essential|starter|basic/i.test(q)) theme = 'essentials';

    return {
      isBudgetIntent: true,
      targetBudget: amount,
      occasionTheme: theme
    };
  }

  function buildBudgetCart(targetBudget, occasionTheme, catalog) {
    const budget = typeof targetBudget === 'number' && targetBudget > 0 ? targetBudget : 500;
    const cat = Array.isArray(catalog) ? catalog.slice() : [];
    const theme = (occasionTheme || 'general').toLowerCase();

    // Normalize prices
    const pool = cat.map(p => ({
      id: p.id,
      name: p.name || p.title,
      price: p.numericPrice || p.price || 0,
      image: p.image || p.img,
      category: p.category || 'Apparel',
      rating: p.rating || 4.8
    })).filter(p => p.price > 0 && p.price <= budget);

    // Group by category to enforce balanced look composition
    const apparel = pool.filter(p => p.category === 'Apparel');
    const footwear = pool.filter(p => p.category === 'Footwear');
    const accessories = pool.filter(p => p.category === 'Accessories' || p.category === 'Acoustics');

    // Strategy based on occasion & budget
    let selectedItems = [];
    let remainingBudget = budget;

    // Pick Core Hero Piece (Blazer or Sweater)
    const corePiece = apparel.sort((a, b) => {
      if (theme === 'office' && a.id === 'p3') return -1;
      if (theme === 'autumn' && a.id === 'p1') return -1;
      return b.price - a.price;
    }).find(p => p.price <= remainingBudget);

    if (corePiece) {
      selectedItems.push(corePiece);
      remainingBudget -= corePiece.price;
    }

    // Pick Secondary Piece (Different item in Apparel or Footwear)
    const secondaryPiece = pool.filter(p => !selectedItems.some(s => s.id === p.id) && p.price <= remainingBudget)
      .sort((a, b) => (b.category !== selectedItems[0]?.category ? 1 : 0) - (a.category !== selectedItems[0]?.category ? 1 : 0) || (b.rating - a.rating))[0];

    if (secondaryPiece) {
      selectedItems.push(secondaryPiece);
      remainingBudget -= secondaryPiece.price;
    }

    // Pick Complementary Accessory / Item if budget permits
    const tertiaryPiece = pool.filter(p => !selectedItems.some(s => s.id === p.id) && p.price <= remainingBudget)
      .sort((a, b) => b.price - a.price)[0];

    if (tertiaryPiece) {
      selectedItems.push(tertiaryPiece);
      remainingBudget -= tertiaryPiece.price;
    }

    // Fallback if empty
    if (selectedItems.length === 0 && pool.length > 0) {
      selectedItems.push(pool[0]);
      remainingBudget = Math.max(0, budget - pool[0].price);
    }

    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);
    const headroom = budget - totalPrice;
    const utilization = Math.round((totalPrice / budget) * 100);

    // Build interactive slot model with valid alternative swaps
    const slots = selectedItems.map((item, index) => {
      const alternatives = pool.filter(p => p.id !== item.id && p.category === item.category);
      return {
        slotIndex: index,
        slotName: index === 0 ? 'Core Statement Piece' : index === 1 ? 'Layering / Footwear Piece' : 'Finishing Essential',
        selectedItem: item,
        alternatives: alternatives
      };
    });

    return {
      targetBudget: budget,
      occasionTheme: theme,
      items: selectedItems,
      slots: slots,
      totalPrice: totalPrice,
      headroom: headroom,
      utilizationPercent: utilization
    };
  }

  window.NexBudgetCartEngine = {
    parseBudgetIntent: parseBudgetIntent,
    buildBudgetCart: buildBudgetCart
  };

})(typeof window !== 'undefined' ? window : global);
