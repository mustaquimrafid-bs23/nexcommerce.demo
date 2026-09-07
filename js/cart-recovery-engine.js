/**
 * nexCommerce — Cart Recovery & Abandonment Root-Cause Diagnoser Engine (Capability 7)
 * Analyzes basket friction, formulates targeted comeback incentives,
 * generates portable cart recovery tokens, and parses recovery queries.
 */
(function(window) {
  'use strict';

  function diagnoseFriction(cartItems, subtotalAmount) {
    const items = Array.isArray(cartItems) ? cartItems : [];
    const subtotal = typeof subtotalAmount === 'number' ? subtotalAmount : 0;

    if (items.length === 0) {
      return {
        hasCart: false,
        frictionReason: 'empty_cart',
        incentiveCode: 'WELCOME10',
        discountPercent: 10,
        reservationMinutes: 15,
        title: 'Your Atelier Bag is Empty',
        description: 'Explore our latest curated drops and discover luxury statement pieces.'
      };
    }

    // High basket value (>= €200) -> Price threshold friction
    if (subtotal >= 200) {
      const discount = Math.round(subtotal * 0.15);
      return {
        hasCart: true,
        frictionReason: 'price_threshold',
        incentiveCode: 'COMEBACK15',
        discountPercent: 15,
        discountAmount: discount,
        reservationMinutes: 15,
        title: 'Your Atelier Selection is Reserved',
        description: `Complete your order now to unlock an exclusive 15% VIP incentive (−€${discount.toFixed(2)}) and hold your reserved pieces for 15 minutes.`
      };
    }

    // Subtotal under €150 free shipping barrier -> Shipping barrier friction
    if (subtotal < 150) {
      return {
        hasCart: true,
        frictionReason: 'shipping_barrier',
        incentiveCode: 'FREESHIPNOW',
        discountPercent: 0,
        discountAmount: 15,
        reservationMinutes: 15,
        title: 'Complimentary Express Shipping Unlocked',
        description: 'We have waived all shipping costs for your bag. Complete checkout now to claim Free Courier Delivery.'
      };
    }

    // Default hesitation friction
    return {
      hasCart: true,
      frictionReason: 'hesitation',
      incentiveCode: 'COMEBACK10',
      discountPercent: 10,
      discountAmount: Math.round(subtotal * 0.10),
      reservationMinutes: 15,
      title: 'Don’t Miss Out on Your Bag',
      description: 'Your selected pieces are in high demand across European boutiques. We have placed a 15-minute hold on your items.'
    };
  }

  function generateRecoveryPayload(cartItems) {
    if (!Array.isArray(cartItems) || cartItems.length === 0) return '';
    const compact = cartItems.map(i => ({
      id: i.id,
      name: i.name,
      price: i.price,
      quantity: i.quantity || i.qty || 1,
      variant: i.variant || i.size || 'Standard',
      image: i.image
    }));

    try {
      const str = JSON.stringify(compact);
      if (typeof btoa === 'function') {
        return btoa(encodeURIComponent(str));
      }
      return Buffer.from(encodeURIComponent(str)).toString('base64');
    } catch(e) {
      return '';
    }
  }

  function decodeRecoveryPayload(token) {
    if (!token || typeof token !== 'string') return [];
    try {
      let decodedStr = '';
      if (typeof atob === 'function') {
        decodedStr = decodeURIComponent(atob(token));
      } else {
        decodedStr = decodeURIComponent(Buffer.from(token, 'base64').toString('utf8'));
      }
      const parsed = JSON.parse(decodedStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch(e) {
      return [];
    }
  }

  function parseRecoveryIntent(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string') return { isRecoveryIntent: false };
    const q = rawQuery.toLowerCase().trim();

    const isRecovery = /\b(recover|restore|abandoned|my bag|my cart|left in (my )?bag|saved bag|resume (my )?order|reorder)\b/i.test(q);
    return {
      isRecoveryIntent: isRecovery,
      query: q
    };
  }

  window.NexCartRecoveryEngine = {
    diagnoseFriction: diagnoseFriction,
    generateRecoveryPayload: generateRecoveryPayload,
    decodeRecoveryPayload: decodeRecoveryPayload,
    parseRecoveryIntent: parseRecoveryIntent
  };

})(typeof window !== 'undefined' ? window : global);
