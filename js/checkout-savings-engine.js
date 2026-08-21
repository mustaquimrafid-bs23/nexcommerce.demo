/**
 * nexCommerce — Proactive AI Checkout Savings & Promo Optimizer Engine (Capability 5)
 * Analyzes subtotal thresholds, calculates maximum coupon discounts, evaluates
 * payment gateway promotions, and identifies proactive savings opportunities.
 */
(function(window) {
  'use strict';

  const PROMO_CATALOG = [
    {
      code: 'VIP20',
      label: 'Atelier VIP Prestige',
      type: 'percent',
      value: 20,
      minSubtotal: 400,
      description: '20% off high-tier atelier orders over €400'
    },
    {
      code: 'ATELIER15',
      label: 'Curated Season 15%',
      type: 'percent',
      value: 15,
      minSubtotal: 200,
      description: '15% off orders over €200'
    },
    {
      code: 'WELCOME10',
      label: 'First Atelier Order',
      type: 'percent',
      value: 10,
      minSubtotal: 0,
      description: '10% off any order'
    },
    {
      code: 'FREESHIP',
      label: 'Complimentary Express',
      type: 'shipping',
      value: 15,
      minSubtotal: 100,
      description: 'Free express DHL courier delivery'
    }
  ];

  function evaluateSavings(subtotalAmount, paymentMethod) {
    const subtotal = typeof subtotalAmount === 'number' ? Math.max(0, subtotalAmount) : 0;
    
    // Evaluate all eligible coupons
    let bestCoupon = null;
    let maxDiscount = 0;

    PROMO_CATALOG.forEach(promo => {
      if (promo.type === 'percent') {
        if (subtotal >= promo.minSubtotal) {
          const discount = Math.round((subtotal * (promo.value / 100)) * 100) / 100;
          if (discount > maxDiscount) {
            maxDiscount = discount;
            bestCoupon = {
              code: promo.code,
              label: promo.label,
              discountAmount: discount,
              description: promo.description
            };
          }
        }
      }
    });

    // Check for proactive threshold upgrade (e.g. within €50 of next tier)
    let upgradeOpportunity = null;
    if (subtotal >= 350 && subtotal < 400) {
      const needed = 400 - subtotal;
      const potentialDiscount = 400 * 0.20;
      upgradeOpportunity = {
        targetCode: 'VIP20',
        neededAmount: needed,
        targetTier: 400,
        potentialSavings: potentialDiscount,
        message: `Add €${needed.toFixed(2)} more to unlock VIP20 (20% off, saving €${potentialDiscount.toFixed(2)}+)!`
      };
    } else if (subtotal >= 160 && subtotal < 200) {
      const needed = 200 - subtotal;
      const potentialDiscount = 200 * 0.15;
      upgradeOpportunity = {
        targetCode: 'ATELIER15',
        neededAmount: needed,
        targetTier: 200,
        potentialSavings: potentialDiscount,
        message: `Add €${needed.toFixed(2)} more to unlock ATELIER15 (15% off, saving €${potentialDiscount.toFixed(2)}+)!`
      };
    }

    const totalSavings = maxDiscount;
    const finalAmount = Math.max(0, subtotal - totalSavings);

    return {
      subtotal: subtotal,
      bestCoupon: bestCoupon,
      totalSavings: totalSavings,
      finalAmount: finalAmount,
      upgradeOpportunity: upgradeOpportunity,
      allPromos: PROMO_CATALOG
    };
  }

  function parseSavingsIntent(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string') return { isSavingsIntent: false };
    const q = rawQuery.toLowerCase().trim();

    const isSavings = /\b(promo|promos|coupon|coupons|discount|discounts|save money|savings|best deal|voucher|promo code|cheaper|rebate)\b/i.test(q);
    return {
      isSavingsIntent: isSavings,
      query: q
    };
  }

  function getAllAvailablePromos() {
    return PROMO_CATALOG.slice();
  }

  window.NexSavingsEngine = {
    evaluateSavings: evaluateSavings,
    parseSavingsIntent: parseSavingsIntent,
    getAllAvailablePromos: getAllAvailablePromos,
    PROMO_CATALOG: PROMO_CATALOG
  };

})(typeof window !== 'undefined' ? window : global);
