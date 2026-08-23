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
      courierPartner: 'DHL Express On-Demand',
      lat: 52.5200,
      lng: 13.4050
    },
    {
      id: 'paris-marais',
      city: 'Paris',
      region: 'Le Marais & 1st–4th Arr. (75003)',
      postcodes: ['75001', '75002', '75003', '75004', '75008'],
      expressSupported: true,
      cutoffHour: 19, // 7:00 PM cutoff
      deliveryTimeMin: '60–90 mins',
      courierPartner: 'Chronopost Atelier',
      lat: 48.8566,
      lng: 2.3522
    },
    {
      id: 'london-mayfair',
      city: 'London',
      region: 'Mayfair & West End (W1K)',
      postcodes: ['W1K', 'W1J', 'SW1A', 'EC1A', 'WC2N', 'W1'],
      expressSupported: true,
      cutoffHour: 18,
      deliveryTimeMin: '45–60 mins',
      courierPartner: 'Quiqup Concierge',
      lat: 51.5074,
      lng: -0.1278
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
    courierPartner: 'DHL Carbon-Neutral',
    lat: 50.1109,
    lng: 8.6821
  };

  function getHubForPostal(postalCode) {
    if (!postalCode) return DARK_STORE_HUBS[0];
    const cleaned = postalCode.toString().trim().toUpperCase();

    const matched = DARK_STORE_HUBS.find(h => 
      h.postcodes.some(p => cleaned.startsWith(p) || p.startsWith(cleaned))
    );

    return matched || DEFAULT_FALLBACK_HUB;
  }

  function searchHubs(query) {
    if (!query || !query.trim()) return DARK_STORE_HUBS;
    const q = query.trim().toUpperCase();

    return DARK_STORE_HUBS.filter(h => {
      const matchCity = h.city.toUpperCase().includes(q);
      const matchRegion = h.region.toUpperCase().includes(q);
      const matchPostcode = h.postcodes.some(p => p.toUpperCase().startsWith(q) || q.startsWith(p.toUpperCase()));
      return matchCity || matchRegion || matchPostcode;
    });
  }

  function getNearestHub(lat, lng) {
    if (typeof lat !== 'number' || typeof lng !== 'number') return DARK_STORE_HUBS[0];
    
    let closestHub = DARK_STORE_HUBS[0];
    let minDistance = Infinity;

    DARK_STORE_HUBS.forEach(hub => {
      const dLat = (hub.lat - lat) * (Math.PI / 180);
      const dLng = (hub.lng - lng) * (Math.PI / 180);
      const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                Math.cos(lat * (Math.PI / 180)) * Math.cos(hub.lat * (Math.PI / 180)) *
                Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c; // Earth radius in km

      if (distance < minDistance) {
        minDistance = distance;
        closestHub = hub;
      }
    });

    return closestHub;
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
    if (diffMs <= 0) {
      // Past cutoff for today
      return {
        hoursRemaining: 0,
        minutesRemaining: 0,
        formattedCountdown: 'Next-day 10 AM',
        humanUrgency: `Cutoff passed for today. Order now for dispatch tomorrow at 10:00 AM.`,
        isCutoffPassed: true
      };
    }

    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    let formatted = '';
    if (hours > 0) {
      formatted = `${hours}h ${minutes}m left`;
    } else {
      formatted = `${minutes}m left`;
    }

    const humanUrgency = hours > 0
      ? `Order within ${hours}h ${minutes}m for guaranteed same-day delivery by ${hub.cutoffHour}:00`
      : `Order within ${minutes}m for guaranteed same-day delivery by ${hub.cutoffHour}:00`;

    return {
      hoursRemaining: hours,
      minutesRemaining: minutes,
      formattedCountdown: formatted,
      humanUrgency: humanUrgency,
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
    searchHubs: searchHubs,
    getNearestHub: getNearestHub,
    filterExpressAvailable: filterExpressAvailable,
    getCutoffCountdown: getCutoffCountdown,
    parseDeliveryIntent: parseDeliveryIntent
  };

})(typeof window !== 'undefined' ? window : global);
