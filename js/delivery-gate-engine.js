/**
 * nexCommerce — Delivery-Aware Shopping & Hyperlocal Inventory Gate Engine (Capability 6)
 * Maps postal codes to dark store hubs, evaluates real-time express stock,
 * and calculates same-day dispatch cutoff windows.
 */
(function(window) {
  'use strict';

  const DARK_STORE_HUBS = [
    {
      id: 'berlin-mitte',
      city: 'Berlin',
      region: 'Central & Mitte (10115)',
      postcodes: ['10115', '10117', '10119', '10178', '10435', '10405'],
      expressSupported: true,
      cutoffHour: 18, // 6:00 PM cutoff
      deliveryTimeMin: '45–60 mins',
      courierPartner: 'DHL Express On-Demand'
    },
    {
      id: 'paris-marais',
      city: 'Paris',
      region: 'Le Marais & 1st–4th Arr. (75003)',
      postcodes: ['75001', '75002', '75003', '75004', '75008'],
      expressSupported: true,
      cutoffHour: 19, // 7:00 PM cutoff
      deliveryTimeMin: '60–90 mins',
      courierPartner: 'Chronopost Atelier'
    },
    {
      id: 'london-mayfair',
      city: 'London',
      region: 'Mayfair & West End (W1K)',
      postcodes: ['W1K', 'W1J', 'SW1A', 'EC1A', 'WC2N'],
      expressSupported: true,
      cutoffHour: 18,
      deliveryTimeMin: '45–60 mins',
      courierPartner: 'Quiqup Concierge'
    },
    {
      id: 'amsterdam-center',
      city: 'Amsterdam',
      region: 'Centrum & Grachtengordel (1016)',
      postcodes: ['1012', '1016', '1017', '1071'],
      expressSupported: true,
      cutoffHour: 17,
      deliveryTimeMin: '45–60 mins',
      courierPartner: 'PostNL Express'
    },
    {
      id: 'dhaka-gulshan',
      city: 'Dhaka',
      region: 'Gulshan 2 & Banani (1212)',
      postcodes: ['1212', '1213', '1208'],
      expressSupported: true,
      cutoffHour: 20,
      deliveryTimeMin: '30–45 mins',
      courierPartner: 'Pathao Dark Store Express'
    }
  ];

  const DEFAULT_FALLBACK_HUB = {
    id: 'central-atelier',
    city: 'European Central Atelier',
    region: 'Standard Regional Delivery',
    postcodes: [],
    expressSupported: false,
    cutoffHour: 16,
    deliveryTimeMin: '2–3 business days',
    courierPartner: 'DHL Carbon-Neutral'
  };

  function getHubForPostal(postalCode) {
    if (!postalCode) return DARK_STORE_HUBS[0];
    const cleaned = postalCode.toString().trim().toUpperCase();

    const matched = DARK_STORE_HUBS.find(h => 
      h.postcodes.some(p => cleaned.startsWith(p) || p.startsWith(cleaned))
    );

    return matched || DEFAULT_FALLBACK_HUB;
  }

  function filterExpressAvailable(products, hubId) {
    if (!Array.isArray(products)) return [];
    const activeHub = DARK_STORE_HUBS.find(h => h.id === hubId) || DARK_STORE_HUBS[0];

    return products.filter(item => {
      if (item.hubs && typeof item.hubs[activeHub.id] === 'number') {
        return item.hubs[activeHub.id] > 0;
      }
      // Default fallback stock distribution based on item ID parity
      const idNum = parseInt((item.id || '').replace(/\D/g, ''), 10) || 1;
      if (activeHub.id === 'berlin-mitte') return idNum % 2 !== 0; // Odd IDs in Berlin
      if (activeHub.id === 'paris-marais') return idNum % 2 === 0;  // Even IDs in Paris
      return true;
    });
  }

  function getCutoffCountdown(hubId) {
    const hub = DARK_STORE_HUBS.find(h => h.id === hubId) || DARK_STORE_HUBS[0];
    const now = new Date();
    const cutoff = new Date(now);
    cutoff.setHours(hub.cutoffHour, 0, 0, 0);

    let diffMs = cutoff - now;
    if (diffMs < 0) {
      // Past cutoff for today
      return {
        hoursRemaining: 0,
        minutesRemaining: 0,
        formattedCountdown: 'Tomorrow Morning',
        isCutoffPassed: true
      };
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    return {
      hoursRemaining: hours,
      minutesRemaining: minutes,
      formattedCountdown: `${hours}h ${minutes}m`,
      isCutoffPassed: false
    };
  }

  function parseDeliveryIntent(rawQuery) {
    if (!rawQuery || typeof rawQuery !== 'string') return { isDeliveryIntent: false };
    const q = rawQuery.toLowerCase().trim();

    const isDelivery = /\b(same[- ]day|express|delivery|delivered|shipping|dark store|hub|postal|courier|how fast|when will.*arrive|deliver.*today)\b/i.test(q);
    const postMatch = q.match(/\b(\d{4,5}|[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2})\b/i);

    return {
      isDeliveryIntent: isDelivery,
      extractedPostal: postMatch ? postMatch[1] : null,
      query: q
    };
  }

  window.NexDeliveryEngine = {
    DARK_STORE_HUBS: DARK_STORE_HUBS,
    DEFAULT_FALLBACK_HUB: DEFAULT_FALLBACK_HUB,
    getHubForPostal: getHubForPostal,
    filterExpressAvailable: filterExpressAvailable,
    getCutoffCountdown: getCutoffCountdown,
    parseDeliveryIntent: parseDeliveryIntent
  };

})(typeof window !== 'undefined' ? window : global);
