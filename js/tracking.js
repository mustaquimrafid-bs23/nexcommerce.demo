/**
 * nexCommerce — Order Tracking & Real-Time Logistics Engine v3
 * Interactive Visual Delivery Journey Map, Real-Time Transit Telemetry,
 * Multi-Source Order Resolution & AI Delivery Guidance.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initTracking();
});

function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── Stage & Telemetry Configuration ───────────────────────── */
const STAGES = [
  { id: 'confirmed',        label: 'Confirmed',        statusKey: 'ORDER_CONFIRMED',  beaconPos: 0.00, location: 'Milan Atelier',              ts: 'Aug 16 · 10:32 AM' },
  { id: 'preparing',        label: 'Preparing',        statusKey: 'PREPARING',        beaconPos: 0.18, location: 'Milan Atelier',              ts: 'Aug 16 · 11:45 AM' },
  { id: 'handed',           label: 'Handed to Carrier',statusKey: 'SHIPPED',          beaconPos: 0.38, location: 'Milan Logistics Center',     ts: 'Aug 16 · 13:20 PM' },
  { id: 'in_transit',       label: 'In Transit',       statusKey: 'IN_TRANSIT',       beaconPos: 0.62, location: 'Central European Hub',       ts: 'Aug 16 · 15:10 PM' },
  { id: 'out_for_delivery', label: 'Out for Delivery', statusKey: 'OUT_FOR_DELIVERY', beaconPos: 0.85, location: 'Munich Distribution Center', ts: 'Aug 16 · 16:45 PM' },
  { id: 'delivered',        label: 'Delivered',        statusKey: 'DELIVERED',        beaconPos: 1.00, location: 'Munich, Germany',            ts: 'Aug 16 · 17:30 PM' },
];

const STATUS_TO_STAGE = {
  'ORDER_CONFIRMED': 0, 'CONFIRMED': 0, 'confirmed': 0,
  'PREPARING': 1,       'preparing': 1,
  'SHIPPED': 2,         'HANDED': 2,         'handed': 2, 'shipped': 2,
  'IN_TRANSIT': 3,      'in_transit': 3,
  'NEARING_DESTINATION': 3, 'DELAYED': 3, 'delayed': 3,
  'EXCEPTION': 3,       'FAILED_ATTEMPT': 3,
  'ACTION_REQUIRED': 3,
  'OUT_FOR_DELIVERY': 4, 'out_for_delivery': 4, 'TRANSIT': 4, 'transit': 4,
  'DELIVERED': 5,       'delivered': 5,      'RETURNED': 5, 'returned': 5,
  'CANCELLED': 0,       'cancelled': 0,
};

const TELEMETRY = [
  { temp: '19°C', tempStatus: 'Optimal',    carbon: '0.0 kg', flight: 'Pending Dispatch', flightNo: '—',       weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '18°C', tempStatus: 'Optimal',    carbon: '0.1 kg', flight: 'Packaging',        flightNo: '—',       weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '17°C', tempStatus: 'Optimal',    carbon: '0.3 kg', flight: 'Dispatching',      flightNo: 'LH 9428', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '16°C', tempStatus: 'Controlled', carbon: '0.8 kg', flight: 'In Transit · Air',flightNo: 'LH 9428', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '17°C', tempStatus: 'Optimal',    carbon: '1.1 kg', flight: 'Courier Van · MUC',flightNo: 'LH 9428', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
  { temp: '20°C', tempStatus: 'Ambient',    carbon: '1.1 kg', flight: 'Completed',        flightNo: 'LH 9428', weight: '1.4 kg', dims: '48 × 36 × 10 cm' },
];

/* ─── Default Mock Catalogue ─────────────────────────────────── */
const DEFAULT_ORDERS = [
  {
    id: 'ORD-9428-NX',
    ref: 'ORD-9428-NX',
    date: 'August 16, 2026',
    placedDate: 'August 16, 2026',
    status: 'transit',
    statusLabel: 'Out for Delivery',
    expectedDate: 'Today · By 6:00 PM',
    expectedRange: 'August 16, 2026',
    progress: 75,
    total: 285,
    subtotal: 285,
    deliveryCost: 0,
    paymentMethod: 'Paid with Klarna Pay Later',
    courier: 'DHL Express On-Demand Delivery',
    deliveryMethod: 'DHL Express On-Demand Delivery',
    customer: {
      name: 'Julian Mercer',
      address: 'Leopoldstraße 42, 80802 Munich, Germany'
    },
    items: [
      {
        name: 'Double-Breasted Wool Overcoat',
        category: 'APPAREL',
        tag: 'Apparel · Charcoal · Size 48',
        variant: 'Charcoal / 48',
        size: '48',
        price: 285,
        image: '../assets/images/products/plp_overcoat.png',
        qty: 1,
        quantity: 1
      }
    ]
  },
  {
    id: 'ORD-8712-NX',
    ref: 'ORD-8712-NX',
    date: 'July 28, 2026',
    placedDate: 'July 28, 2026',
    status: 'delivered',
    statusLabel: 'Delivered',
    expectedDate: 'Delivered on July 29, 2026',
    expectedRange: 'July 29, 2026',
    progress: 100,
    total: 320,
    subtotal: 320,
    deliveryCost: 0,
    paymentMethod: 'Settled via Apple Pay / Visa 3DS',
    courier: 'DHL Express Carbon-Neutral',
    deliveryMethod: 'DHL Express Carbon-Neutral',
    customer: {
      name: 'Camille Laurent',
      address: 'Avenue Montaigne 18, 75008 Paris, France'
    },
    items: [
      {
        name: 'Studio Acoustics Headphone GT',
        category: 'ACOUSTICS',
        tag: 'High Acoustics · Lambskin & Beryllium',
        variant: 'Obsidian Black',
        size: 'One Size',
        price: 320,
        image: '../assets/images/products/prod_headphones.png',
        qty: 1,
        quantity: 1
      }
    ]
  },
  {
    id: 'ORD-7601-NX',
    ref: 'ORD-7601-NX',
    date: 'June 14, 2026',
    placedDate: 'June 14, 2026',
    status: 'delivered',
    statusLabel: 'Delivered · Completed Delivery',
    expectedDate: 'Delivered on June 15, 2026',
    expectedRange: 'June 15, 2026',
    progress: 100,
    total: 185,
    subtotal: 185,
    deliveryCost: 0,
    paymentMethod: 'Settled via iDEAL (ABN AMRO)',
    courier: 'DPD European Priority',
    deliveryMethod: 'DPD European Priority',
    customer: {
      name: 'Sander van Dijk',
      address: 'Herengracht 244, 1016 BT Amsterdam, Netherlands'
    },
    items: [
      {
        name: 'Minimalist Leather Runner',
        category: 'FOOTWEAR',
        tag: 'Artisanal Footwear · Chalk White · Size 42',
        variant: 'Chalk White / 42',
        size: '42',
        price: 185,
        image: '../assets/images/products/prod_runner.png',
        qty: 1,
        quantity: 1
      }
    ]
  },
  {
    id: 'NX-M4KZ9',
    ref: 'NX-M4KZ9',
    date: 'August 11, 2026',
    placedDate: 'August 11, 2026',
    status: 'in_transit',
    statusLabel: 'In Transit',
    expectedDate: 'Wednesday, 19 August',
    expectedRange: 'August 19, 2026',
    progress: 50,
    total: 185,
    subtotal: 185,
    deliveryCost: 0,
    paymentMethod: 'Klarna Pay in 30 Days',
    courier: 'DHL Express Priority',
    deliveryMethod: 'DHL Express Priority',
    customer: {
      name: 'Julian Mercer',
      address: 'Kaufingerstraße 24, 80331 Munich, Germany'
    },
    items: [
      {
        name: 'Architectural Cashmere Sweater',
        category: 'APPAREL',
        tag: 'Apparel · Midnight · Size M',
        variant: 'Midnight / M',
        size: 'M',
        price: 185,
        image: '../assets/images/products/hero_sweater.png',
        qty: 1,
        quantity: 1
      }
    ]
  }
];

/* ─── Core Init & Order Resolution ───────────────────────────── */
function initTracking() {
  const params        = new URLSearchParams(window.location.search);
  const rawIdParam    = params.get('order') || params.get('ref') || params.get('id') || params.get('orderId') || params.get('order_id');
  const statusParam   = params.get('status');
  const reasonParam   = params.get('reason');
  const scenarioParam = params.get('scenario');
  const isPartial     = params.get('partial') === 'true';

  const order = resolveOrder(rawIdParam, statusParam, reasonParam, scenarioParam, isPartial);

  if (!order) {
    renderNoOrderState();
    return;
  }

  // Ensure logistics payload exists for AI Delivery Assistant
  order.logisticsPayload = {
    status: order.statusKey || mapToStatusKey(order.status),
    carrierReason: order.carrierReason || null,
    scenario: order.scenario || (order.status === 'delayed' ? 'delayed' : 'fresh'),
    isPartial: Boolean(order.isPartial),
    expectedDate: order.expectedDate || order.eta || 'Today · By 6:00 PM',
    lastUpdateTime: order.lastUpdateTime || '4:45 PM',
    dataAge: order.scenario === 'stale' ? 'stale' : 'fresh',
    deliveryLocation: order.customer?.address || 'Reception / Main Entrance'
  };

  window.__trackingOrder = order;
  renderTrackingPage(order);
}

/**
 * Resolves an order across all system stores, parameters, and defaults.
 */
function resolveOrder(rawIdParam, statusParam, reasonParam, scenarioParam, isPartial) {
  const cleanId = rawIdParam ? String(rawIdParam).trim() : '';

  // 1. If explicit ID provided, search in localStorage placed orders
  if (cleanId) {
    try {
      const placedRaw = localStorage.getItem('nex_placed_orders');
      if (placedRaw) {
        const placed = JSON.parse(placedRaw);
        if (Array.isArray(placed)) {
          const match = placed.find(o => {
            const oId = String(o.id || o.ref || '').toUpperCase();
            return oId === cleanId.toUpperCase();
          });
          if (match) return normalizeOrder(match, statusParam, reasonParam, scenarioParam, isPartial);
        }
      }
    } catch (_) {}

    // 2. Search in sessionStorage confirmed order
    try {
      const confRaw = sessionStorage.getItem('nex_confirmed_order');
      if (confRaw) {
        const conf = JSON.parse(confRaw);
        if (conf) {
          const cId = String(conf.ref || conf.id || '').toUpperCase();
          if (cId === cleanId.toUpperCase()) {
            return normalizeOrder(conf, statusParam, reasonParam, scenarioParam, isPartial);
          }
        }
      }
    } catch (_) {}

    // 3. Search in DEFAULT_ORDERS catalogue
    const defaultMatch = DEFAULT_ORDERS.find(o => {
      return String(o.id).toUpperCase() === cleanId.toUpperCase() || String(o.ref).toUpperCase() === cleanId.toUpperCase();
    });
    if (defaultMatch) {
      return normalizeOrder(defaultMatch, statusParam, reasonParam, scenarioParam, isPartial);
    }

    // 4. Construct dynamic mock order for valid order ID patterns
    return generateCustomMockOrder(cleanId, statusParam, reasonParam, scenarioParam, isPartial);
  }

  // If no ID param provided in URL:
  // First check sessionStorage for recently placed order
  try {
    const confRaw = sessionStorage.getItem('nex_confirmed_order');
    if (confRaw) {
      const conf = JSON.parse(confRaw);
      if (conf && (conf.ref || conf.id)) {
        return normalizeOrder(conf, statusParam, reasonParam, scenarioParam, isPartial);
      }
    }
  } catch (_) {}

  // Next check localStorage placed orders
  try {
    const placedRaw = localStorage.getItem('nex_placed_orders');
    if (placedRaw) {
      const placed = JSON.parse(placedRaw);
      if (Array.isArray(placed) && placed.length > 0) {
        return normalizeOrder(placed[0], statusParam, reasonParam, scenarioParam, isPartial);
      }
    }
  } catch (_) {}

  // Default to standard demo order ORD-9428-NX
  return normalizeOrder(DEFAULT_ORDERS[0], statusParam, reasonParam, scenarioParam, isPartial);
}

/**
 * Normalizes order properties across formats and syncs date/items.
 */
function normalizeOrder(raw, statusParam, reasonParam, scenarioParam, isPartial) {
  const order = JSON.parse(JSON.stringify(raw));
  order.ref = order.ref || order.id || 'ORD-9428-NX';
  order.id = order.id || order.ref;

  if (statusParam) {
    order.status = statusParam;
  }
  order.carrierReason = reasonParam || order.cancellationReason || order.carrierReason;
  order.scenario = scenarioParam || order.scenario;
  order.isPartial = isPartial !== undefined ? isPartial : Boolean(order.isPartial);

  order.statusKey = mapToStatusKey(order.status);
  order.statusLabel = order.statusLabel || mapToStatusLabel(order.statusKey);

  // Dates
  if (!order.placedDate) {
    if (order.placedAt || order.date) {
      const d = new Date(order.placedAt || order.date);
      order.placedDate = isNaN(d.getTime()) ? (order.date || 'August 16, 2026') : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } else {
      order.placedDate = 'August 16, 2026';
    }
  }

  if (!order.expectedDate) {
    order.expectedDate = order.eta || (order.statusKey === 'OUT_FOR_DELIVERY' ? 'Today · By 6:00 PM' : 'In 2–3 Business Days');
  }

  // Customer & Shipping
  order.courier = order.courier || order.deliveryMethod || 'DHL Express On-Demand Delivery';
  order.paymentMethod = order.payment || order.paymentMethod || 'Klarna Pay Later';

  if (!order.customer) {
    order.customer = {
      name: order.customerName || 'Julian Mercer',
      address: [order.address, order.city, order.country].filter(Boolean).join(', ') || 'Leopoldstraße 42, 80802 Munich, Germany'
    };
  }

  // Items
  if (!Array.isArray(order.items) || order.items.length === 0) {
    order.items = [
      {
        name: 'Double-Breasted Wool Overcoat',
        category: 'APPAREL',
        variant: 'Charcoal / 48',
        qty: 1,
        price: 285,
        image: '../assets/images/products/plp_overcoat.png'
      }
    ];
  } else {
    order.items.forEach(i => {
      i.qty = i.qty || i.quantity || 1;
      i.price = Number(i.price) || 0;
      i.category = i.category || 'APPAREL';
      i.variant = i.variant || i.tag || i.size || 'Standard';
      i.image = i.image || '../assets/images/products/plp_overcoat.png';
    });
  }

  // Financials
  order.subtotal = order.subtotal !== undefined ? Number(order.subtotal) : order.items.reduce((sum, i) => sum + (i.price * i.qty), 0);
  order.deliveryCost = order.deliveryCost !== undefined ? Number(order.deliveryCost) : (order.shippingCost !== undefined ? Number(order.shippingCost) : 0);
  order.discountAmt = order.discountAmt !== undefined ? Number(order.discountAmt) : 0;
  order.total = order.total !== undefined ? Number(order.total) : (order.subtotal - order.discountAmt + order.deliveryCost);

  return order;
}

function mapToStatusKey(status) {
  if (!status) return 'OUT_FOR_DELIVERY';
  const s = String(status).toUpperCase();
  if (s.includes('CANCEL')) return 'CANCELLED';
  if (s.includes('DELIVERED')) return 'DELIVERED';
  if (s.includes('OUT') || s === 'TRANSIT') return 'OUT_FOR_DELIVERY';
  if (s.includes('TRANSIT')) return 'IN_TRANSIT';
  if (s.includes('SHIP') || s.includes('HAND')) return 'SHIPPED';
  if (s.includes('PREP')) return 'PREPARING';
  if (s.includes('CONFIRM')) return 'ORDER_CONFIRMED';
  if (s.includes('DELAY')) return 'DELAYED';
  return s;
}

function mapToStatusLabel(statusKey) {
  switch (statusKey) {
    case 'ORDER_CONFIRMED': return 'Order Confirmed';
    case 'PREPARING': return 'Preparing Shipment';
    case 'SHIPPED': return 'Handed to Courier';
    case 'IN_TRANSIT': return 'In Transit';
    case 'OUT_FOR_DELIVERY': return 'Out for Delivery';
    case 'DELIVERED': return 'Delivered';
    case 'DELAYED': return 'Delayed in Transit';
    case 'CANCELLED': return 'Order Cancelled';
    default: return 'In Transit';
  }
}

function generateCustomMockOrder(refId, statusParam, reasonParam, scenarioParam, isPartial) {
  return {
    id: refId,
    ref: refId,
    date: 'August 16, 2026',
    placedDate: 'August 16, 2026',
    status: statusParam || 'transit',
    statusLabel: statusParam ? mapToStatusLabel(mapToStatusKey(statusParam)) : 'Out for Delivery',
    statusKey: mapToStatusKey(statusParam || 'transit'),
    expectedDate: 'Today · By 6:00 PM',
    expectedRange: 'August 16, 2026',
    progress: 75,
    total: 285,
    subtotal: 285,
    deliveryCost: 0,
    paymentMethod: 'Paid with Klarna Pay Later',
    courier: 'DHL Express On-Demand Delivery',
    customer: {
      name: 'Julian Mercer',
      address: 'Leopoldstraße 42, 80802 Munich, Germany'
    },
    items: [
      {
        name: 'Double-Breasted Wool Overcoat',
        category: 'APPAREL',
        variant: 'Charcoal / 48',
        qty: 1,
        price: 285,
        image: '../assets/images/products/plp_overcoat.png'
      }
    ],
    carrierReason: reasonParam,
    scenario: scenarioParam,
    isPartial: Boolean(isPartial)
  };
}

/* ─── Page Orchestrator ──────────────────────────────────────── */
function renderTrackingPage(order) {
  updateMeta(order);
  renderOrderSwitcher(order);
  renderStageSimulator(order);
  renderETABanner(order);
  renderRouteMap(order);
  renderTelemetryBadges(order);
  renderOrderSummary(order);
  renderServiceMessage(order);

  // Initialize Lucide icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/* ─── Hero & Meta Updates (Rule 15) ──────────────────────────── */
function updateMeta(order) {
  const isCancelled = order.statusKey === 'CANCELLED' || order.status === 'cancelled';
  const isDelivered = order.statusKey === 'DELIVERED' || order.status === 'delivered';

  // 1. Breadcrumb
  const breadcrumbRef = document.getElementById('trackingBreadcrumbRef');
  if (breadcrumbRef) breadcrumbRef.textContent = `Order #${order.ref}`;

  // 2. Hero Header Elements
  const heroId = document.getElementById('trackingHeroId');
  if (heroId) heroId.textContent = `#${order.ref}`;

  const statusBadge = document.getElementById('trackingStatusBadge');
  if (statusBadge) {
    statusBadge.textContent = isCancelled ? 'CANCELLED' : (isDelivered ? 'DELIVERED' : (order.statusLabel || 'IN TRANSIT').toUpperCase());
    if (isCancelled) {
      statusBadge.style.color = '#FB7185';
      statusBadge.style.borderColor = 'rgba(251,113,133,0.3)';
      statusBadge.style.background = 'rgba(251,113,133,0.1)';
    } else if (isDelivered) {
      statusBadge.style.color = '#34D399';
      statusBadge.style.borderColor = 'rgba(52,211,153,0.3)';
      statusBadge.style.background = 'rgba(52,211,153,0.1)';
    } else {
      statusBadge.style.color = 'var(--accent-cyan)';
      statusBadge.style.borderColor = 'rgba(61,224,255,0.28)';
      statusBadge.style.background = 'rgba(61,224,255,0.12)';
    }
  }

  // 3. 3-Stat Metric Cluster
  const statStatus = document.getElementById('trackingStatStatus');
  if (statStatus) {
    statStatus.textContent = isCancelled ? 'Cancelled' : (order.statusLabel || 'Out for Delivery');
    statStatus.className = 'tracking-stat-val ' + (isCancelled ? 'status-rose' : (isDelivered ? 'status-green' : 'status-cyan'));
  }

  const statEta = document.getElementById('trackingStatEta');
  if (statEta) {
    statEta.textContent = isCancelled ? 'Order Voided' : (isDelivered ? 'Completed' : (order.expectedDate || 'Today · By 6:00 PM'));
  }

  const statCourier = document.getElementById('trackingStatCourier');
  if (statCourier) {
    statCourier.textContent = order.courier || 'DHL Express On-Demand';
  }

  // 4. Cancel Order Button in Toolbar
  const cancelBtn = document.getElementById('trackingCancelBtn');
  if (cancelBtn) {
    const isEligible = window.NexOrderCancellation && window.NexOrderCancellation.isEligible(order);
    cancelBtn.style.display = isEligible ? 'inline-flex' : 'none';
  }

  document.title = `Track Order #${order.ref} — nexCommerce`;
}

/* ─── Order Quick Switcher ───────────────────────────────────── */
function renderOrderSwitcher(currentOrder) {
  const container = document.getElementById('orderSwitcherChips');
  if (!container) return;

  // Gather known orders from storage and default presets
  const ordersList = [];
  const seenIds = new Set();

  try {
    const placedRaw = localStorage.getItem('nex_placed_orders');
    if (placedRaw) {
      const placed = JSON.parse(placedRaw);
      if (Array.isArray(placed)) {
        placed.forEach(o => {
          const id = o.id || o.ref;
          if (id && !seenIds.has(id.toUpperCase())) {
            seenIds.add(id.toUpperCase());
            ordersList.push(o);
          }
        });
      }
    }
  } catch (_) {}

  DEFAULT_ORDERS.forEach(o => {
    if (!seenIds.has(o.id.toUpperCase())) {
      seenIds.add(o.id.toUpperCase());
      ordersList.push(o);
    }
  });

  const currentCleanId = String(currentOrder.id || currentOrder.ref).toUpperCase();

  container.innerHTML = ordersList.map(o => {
    const oId = String(o.id || o.ref).toUpperCase();
    const isActive = oId === currentCleanId;
    const label = o.id || o.ref;
    const statusNote = o.statusLabel || (o.status === 'delivered' ? 'Delivered' : 'In Transit');
    return `
      <a href="tracking.html?order=${encodeURIComponent(label)}" class="order-chip${isActive ? ' order-chip--active' : ''}" title="${label} (${statusNote})">
        <span>#${label}</span>
        <span style="opacity:0.6;font-size:9.5px;">(${statusNote})</span>
      </a>
    `;
  }).join('');
}

/* ─── Stage Simulator ────────────────────────────────────────── */
function renderStageSimulator(order) {
  const container = document.getElementById('stageSimulator');
  if (!container) return;
  const currentIdx = STATUS_TO_STAGE[order.statusKey || order.status] ?? 4;

  container.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:10px;flex-wrap:wrap;">
      <div style="font-family:var(--font-body);font-size:9.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-muted);display:flex;align-items:center;gap:6px;">
        <span style="width:5px;height:5px;border-radius:50%;background:var(--accent-cyan);display:inline-block;"></span>
        SIMULATE SHIPMENT STAGE
      </div>
      <span style="font-family:var(--font-body);font-size:11px;color:rgba(255,255,255,0.4);">Click any stage to inspect real-time GPS &amp; sensor updates</span>
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:8px;">
      ${STAGES.map((s, i) => `
        <button type="button" class="sim-pill${i === currentIdx ? ' sim-pill--active' : ''}" data-stage-idx="${i}" onclick="simulateStage(${i})" aria-pressed="${i === currentIdx}">
          ${s.label}
        </button>
      `).join('')}
    </div>
  `;
}

window.simulateStage = function(idx) {
  const order = window.__trackingOrder;
  if (!order) return;
  order.statusKey = STAGES[idx].statusKey;
  order.status = STAGES[idx].statusKey.toLowerCase();
  order.statusLabel = STAGES[idx].label;
  order.logisticsPayload = { ...order.logisticsPayload, status: order.statusKey };

  document.querySelectorAll('.sim-pill').forEach((pill, i) => {
    pill.classList.toggle('sim-pill--active', i === idx);
    pill.setAttribute('aria-pressed', String(i === idx));
  });

  updateMeta(order);
  renderETABanner(order);
  renderRouteMap(order);
  renderTelemetryBadges(order);
  renderServiceMessage(order);
};

/* ─── ETA Banner ─────────────────────────────────────────────── */
function renderETABanner(order) {
  const banner = document.getElementById('trackingETA');
  if (!banner) return;
  const isDelivered = (order.statusKey === 'DELIVERED') || (STATUS_TO_STAGE[order.statusKey] >= 5);
  const isDelayed   = order.statusKey === 'DELAYED' || order.statusKey === 'EXCEPTION';
  const isCancelled = order.statusKey === 'CANCELLED';

  if (isCancelled) {
    banner.style.display = 'none';
    return;
  }
  banner.style.display = '';

  if (isDelivered) {
    banner.style.borderColor = 'rgba(52,211,153,0.3)';
    banner.style.background = 'rgba(52,211,153,0.06)';
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:14px;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:rgba(52,211,153,0.18);color:#34D399;font-size:16px;flex-shrink:0;font-weight:700;">✓</span>
        <div>
          <div style="font-family:var(--font-body);font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#34D399;margin-bottom:2px;">SHIPMENT COMPLETED</div>
          <div style="font-family:var(--font-body);font-size:14px;color:var(--text-primary);font-weight:500;">Your luxury piece arrived safely at ${order.logisticsPayload.lastUpdateTime || 'Munich, Germany'}.</div>
        </div>
      </div>`;
    return;
  }

  banner.style.borderColor = '';
  banner.style.background = '';
  banner.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-family:var(--font-body);font-size:9.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-muted);margin-bottom:4px;">ESTIMATED ARRIVAL WINDOW</div>
        <div style="font-family:var(--font-serif);font-size:clamp(22px,3vw,28px);color:var(--text-primary);line-height:1.15;font-weight:500;">${isDelayed ? 'Delayed — ' + order.expectedDate : order.expectedDate}</div>
        <div style="font-family:var(--font-body);font-size:12.5px;color:var(--text-secondary);margin-top:4px;">${isDelayed ? 'Delivery is taking slightly longer than estimated.' : 'Courier is strictly on schedule with cold-chain protocols.'}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;font-family:var(--font-body);font-size:11px;font-weight:600;color:var(--accent-cyan);padding:6px 14px;border:1px solid rgba(61,224,255,0.25);border-radius:var(--radius-pill);background:rgba(61,224,255,0.06);flex-shrink:0;">
        <span style="width:6px;height:6px;border-radius:50%;background:var(--accent-cyan);display:inline-block;animation:pulse-dot 1.8s ease-in-out infinite;"></span>
        GPS SATELLITE SYNC
      </div>
    </div>`;
}

/* ─── SVG Route Map ──────────────────────────────────────────── */
function bezierPoint(t) {
  const W = [
    { x: 90,  y: 115 },
    { x: 360, y: 55  },
    { x: 630, y: 115 },
  ];
  const cp = [
    { x: 215, y: 25 }, { x: 205, y: 25 },
    { x: 500, y: 25 }, { x: 505, y: 25 },
  ];

  if (t <= 0.5) {
    const tt = t * 2, mt = 1 - tt;
    return {
      x: mt*mt*mt*W[0].x + 3*mt*mt*tt*cp[0].x + 3*mt*tt*tt*cp[1].x + tt*tt*tt*W[1].x,
      y: mt*mt*mt*W[0].y + 3*mt*mt*tt*cp[0].y + 3*mt*tt*tt*cp[1].y + tt*tt*tt*W[1].y,
    };
  } else {
    const tt = (t - 0.5) * 2, mt = 1 - tt;
    return {
      x: mt*mt*mt*W[1].x + 3*mt*mt*tt*cp[2].x + 3*mt*tt*tt*cp[3].x + tt*tt*tt*W[2].x,
      y: mt*mt*mt*W[1].y + 3*mt*mt*tt*cp[2].y + 3*mt*tt*tt*cp[3].y + tt*tt*tt*W[2].y,
    };
  }
}

function renderRouteMap(order) {
  const container = document.getElementById('routeMapContainer');
  if (!container) return;

  const stageIdx   = STATUS_TO_STAGE[order.statusKey || order.status] ?? 4;
  const stage      = STAGES[stageIdx] || STAGES[4];
  const bp         = bezierPoint(stage.beaconPos);
  const pct        = Math.min(100, Math.max(0, stage.beaconPos * 100));
  const isDelivered = stageIdx >= 5;

  const pathD = 'M 90 115 C 215 25 205 25 360 55 S 500 25 630 115';
  const WP = [
    { x: 90,  y: 115, label: 'MILAN ATELIER',        sub: 'Origin Hub',       done: stageIdx >= 2 },
    { x: 360, y: 55,  label: 'CENTRAL EU GATEWAY',    sub: 'Frankfurt Hub',    done: stageIdx >= 3 },
    { x: 630, y: 115, label: 'MUNICH HUB',           sub: 'Final Destination',done: stageIdx >= 5 },
  ];

  container.innerHTML = `<svg viewBox="0 0 720 180" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto;display:block;" aria-label="Delivery route map">
    <defs>
      <radialGradient id="bGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#3DE0FF" stop-opacity="0.55"/><stop offset="100%" stop-color="#3DE0FF" stop-opacity="0"/></radialGradient>
      <radialGradient id="dGlow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#34D399" stop-opacity="0.5"/><stop offset="100%" stop-color="#34D399" stop-opacity="0"/></radialGradient>
      <filter id="gf" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="3.5" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#3DE0FF" stop-opacity="0.9"/>
        <stop offset="${pct}%" stop-color="#3DE0FF" stop-opacity="0.9"/>
        <stop offset="${Math.min(pct + 0.01, 100)}%" stop-color="rgba(255,255,255,0.12)" stop-opacity="1"/>
        <stop offset="100%" stop-color="rgba(255,255,255,0.08)" stop-opacity="1"/>
      </linearGradient>
    </defs>
    <rect width="720" height="180" fill="rgba(0,24,56,0.6)" rx="14"/>
    <line x1="0" y1="90" x2="720" y2="90" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    <path d="${pathD}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2.5" stroke-dasharray="5 5"/>
    <path d="${pathD}" fill="none" stroke="url(#rg)" stroke-width="3.5" stroke-linecap="round"/>
    ${WP.map((wp, i) => {
      const clr = wp.done ? (i === 2 ? '#34D399' : '#3DE0FF') : 'rgba(255,255,255,0.22)';
      const glowId = i === 2 ? 'dGlow' : 'bGlow';
      return `${wp.done ? `<circle cx="${wp.x}" cy="${wp.y}" r="22" fill="url(#${glowId})"/>` : ''}
        <circle cx="${wp.x}" cy="${wp.y}" r="9" fill="rgba(0,18,48,0.95)" stroke="${clr}" stroke-width="2"/>
        <circle cx="${wp.x}" cy="${wp.y}" r="4" fill="${clr}" ${wp.done ? 'filter="url(#gf)"' : ''}/>
        <text x="${wp.x}" y="${wp.y + 22}" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" font-weight="700" letter-spacing="0.09em" fill="${wp.done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.35)'}">${wp.label}</text>
        <text x="${wp.x}" y="${wp.y + 33}" text-anchor="middle" font-family="Inter,sans-serif" font-size="7.5" fill="rgba(255,255,255,0.4)">${wp.sub}</text>`;
    }).join('')}
    ${!isDelivered && stage.beaconPos > 0 && stage.beaconPos < 1 ? `
      <circle cx="${bp.x}" cy="${bp.y}" r="24" fill="url(#bGlow)" class="beacon-glow-ring"/>
      <circle cx="${bp.x}" cy="${bp.y}" r="11" fill="rgba(0,18,48,0.92)" stroke="rgba(61,224,255,0.4)" stroke-width="1.5"/>
      <circle cx="${bp.x}" cy="${bp.y}" r="5.5" fill="#3DE0FF" filter="url(#gf)" class="beacon-pulse"/>
      <text x="${bp.x}" y="${bp.y + 4}" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif" font-size="9" fill="#fff">▸</text>
    ` : ''}
    ${isDelivered ? `<circle cx="${WP[2].x}" cy="${WP[2].y}" r="22" fill="url(#dGlow)" class="beacon-glow-ring"/><text x="${WP[2].x}" y="${WP[2].y + 5}" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif" font-size="13" fill="#34D399">✓</text>` : ''}
    <text x="706" y="22" text-anchor="end" font-family="Inter,sans-serif" font-size="9.5" font-weight="700" letter-spacing="0.1em" fill="rgba(61,224,255,0.85)">${stage.label.toUpperCase()}</text>
    <text x="706" y="34" text-anchor="end" font-family="Inter,sans-serif" font-size="8" fill="rgba(255,255,255,0.4)">${stage.location}</text>
    <text x="14" y="22" text-anchor="start" font-family="Inter,sans-serif" font-size="8.5" fill="rgba(255,255,255,0.4)">DHL EXPRESS LOGISTICS · ${stage.ts}</text>
  </svg>`;
}

/* ─── Telemetry Badges ───────────────────────────────────────── */
function renderTelemetryBadges(order) {
  const container = document.getElementById('telemetryBadges');
  if (!container) return;
  const stageIdx = STATUS_TO_STAGE[order.statusKey || order.status] ?? 4;
  const t = TELEMETRY[stageIdx] || TELEMETRY[4];

  const badges = [
    { icon: '📐', label: 'PACKAGE SPEC',       rows: [{ k: 'Weight', v: t.weight }, { k: 'Dimensions', v: t.dims }, { k: 'Handling', v: 'White Glove Priority' }] },
    { icon: '🌡', label: 'CLIMATE CONTROL',    rows: [{ k: 'Temperature', v: t.temp }, { k: 'Sensor Status', v: t.tempStatus }, { k: 'Chamber', v: 'Hermetic Vault' }] },
    { icon: '🌿', label: 'CARBON OFFSET',      rows: [{ k: 'CO₂ Neutral', v: t.carbon }, { k: 'Fleet Program', v: 'DHL GoGreen Plus' }, { k: 'Standard', v: 'ISO 14064' }] },
    { icon: '✈', label: 'DISPATCH TELEMETRY', rows: [{ k: 'Carrier Waybill', v: t.flightNo }, { k: 'Transit State', v: t.flight }, { k: 'Routing', v: 'MXP → FRA → MUC' }] },
  ];

  container.innerHTML = `
    <div style="font-family:var(--font-body);font-size:9.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px;display:flex;align-items:center;gap:6px;">
      <span style="width:5px;height:5px;border-radius:50%;background:var(--accent-cyan);display:inline-block;"></span>
      REAL-TIME PARCEL SENSOR TELEMETRY
    </div>
    <div class="telemetry-grid">
      ${badges.map(b => `
        <div class="telemetry-badge">
          <div class="telemetry-badge-icon">${b.icon}</div>
          <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:10px;">${b.label}</div>
          ${b.rows.map(r => `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
              <span style="font-family:var(--font-body);font-size:11.5px;color:var(--text-muted);">${r.k}</span>
              <span style="font-family:var(--font-mono, monospace);font-size:11.5px;font-weight:600;color:var(--text-secondary);">${r.v}</span>
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

/* ─── Order Summary ──────────────────────────────────────────── */
function renderOrderSummary(order) {
  const el = document.getElementById('trackingOrderSummary');
  if (!el) return;

  const itemsHtml = (order.items || []).map(item => {
    const qty     = item.qty || item.quantity || 1;
    const price   = Number(item.price) || 0;
    const variant = item.variant || item.size || 'Standard';
    const image   = item.image || '../assets/images/products/plp_overcoat.png';
    return `
      <div style="display:flex;gap:14px;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid var(--border-subtle);margin-bottom:16px;">
        <div style="position:relative;flex-shrink:0;">
          <img src="${image}" alt="${item.name}" onerror="this.src='../assets/images/products/plp_overcoat.png'" style="width:72px;height:90px;object-fit:cover;border-radius:var(--radius-sm);background:var(--bg-surface);" />
          <span style="position:absolute;top:-4px;right:-4px;background:var(--bg-deep);border:1px solid var(--border-default);border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-family:var(--font-body);font-size:9px;font-weight:700;color:var(--text-secondary);">${qty}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;">
          <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);">${item.category || 'APPAREL'}</div>
          <div style="font-family:var(--font-serif);font-size:15px;color:var(--text-primary);line-height:1.25;">${item.name}</div>
          <div style="font-family:var(--font-body);font-size:12px;color:var(--text-muted);">${variant}</div>
          <div style="font-family:var(--font-body);font-size:14px;color:var(--text-primary);font-weight:600;" class="tabular-nums">€ ${(price * qty).toFixed(2)}</div>
        </div>
      </div>`;
  }).join('');

  const subtotal  = Number(order.subtotal) || 0;
  const discount  = Number(order.discountAmt) || 0;
  const shipping  = Number(order.deliveryCost ?? order.shippingCost ?? 0);
  const total     = Number(order.total) || (subtotal - discount + shipping);
  const shipLabel = shipping === 0 ? 'COMPLIMENTARY' : `€ ${shipping.toFixed(2)}`;
  const discRow   = discount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#00E676;"><span>Discount</span><span class="tabular-nums">−€ ${discount.toFixed(2)}</span></div>` : '';

  const isCancellable = window.NexOrderCancellation && window.NexOrderCancellation.isEligible(order);
  const isCancelled = order.status === 'CANCELLED' || order.status === 'cancelled' || order.statusKey === 'CANCELLED';

  el.innerHTML = `
    <div style="font-family:var(--font-body);font-size:9.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-muted);margin-bottom:16px;">ORDER &amp; PAYMENT BREAKDOWN</div>
    ${isCancelled ? `
      <div class="order-cancelled-callout" style="margin-bottom:16px;background:rgba(251,113,133,0.1);border:1px solid rgba(251,113,133,0.3);border-radius:var(--radius-md);padding:14px;">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
          <span style="color:#FB7185;font-weight:700;">✕</span>
          <span style="font-size:13px;color:#FFFFFF;"><strong>Order Cancelled</strong> &middot; ${order.cancellationReason || 'Client request'}</span>
        </div>
        <span style="color:var(--accent-cyan);font-weight:600;font-size:12px;">100% Refund Issued to Original Method</span>
      </div>
    ` : ''}
    ${itemsHtml}
    <div style="display:flex;flex-direction:column;gap:8px;font-family:var(--font-body);">
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);"><span>Subtotal</span><span class="tabular-nums">€ ${subtotal.toFixed(2)}</span></div>
      ${discRow}
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);"><span>Express Shipping</span><span class="tabular-nums" style="${shipping===0?'color:#00E676;font-weight:600;':''}">${shipLabel}</span></div>
      <div style="border-top:1px solid var(--border-subtle);padding-top:12px;margin-top:4px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-primary);">${isCancelled ? 'REFUND CREDITED' : 'TOTAL (INCL. VAT)'}</span>
        <span style="font-family:var(--font-serif);font-size:22px;color:${isCancelled ? '#FB7185' : 'var(--text-primary)'};" class="tabular-nums">€ ${total.toFixed(2)}</span>
      </div>
    </div>
    <div style="margin-top:18px;padding:15px;background:rgba(61,224,255,0.05);border:1px solid rgba(61,224,255,0.18);border-radius:var(--radius-md);">
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <span style="font-size:15px;line-height:1;margin-top:1px;flex-shrink:0;">📍</span>
        <div>
          <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:4px;">DELIVERY DESTINATION</div>
          <div style="font-family:var(--font-body);font-size:13px;color:var(--text-primary);font-weight:600;line-height:1.4;">${order.customer?.name || 'Julian Mercer'}</div>
          <div style="font-family:var(--font-body);font-size:12px;color:var(--text-secondary);line-height:1.4;margin-top:2px;">${order.customer?.address || 'Leopoldstraße 42, 80802 Munich, Germany'}</div>
          <div style="font-family:var(--font-body);font-size:11px;color:var(--text-muted);margin-top:4px;">${order.paymentMethod || 'Paid with Klarna'}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;flex-direction:column;gap:10px;">
      <button class="btn-primary-commerce" style="width:100%;height:48px;" onclick="window.print()">VIEW OFFICIAL INVOICE</button>
      ${isCancellable ? `
        <button type="button" class="btn-order-cancel-trigger" style="width:100%;height:44px;justify-content:center;" onclick="handleTrackingOrderCancel()">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right:6px;"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          <span>CANCEL THIS ORDER</span>
        </button>
      ` : ''}
      <a href="category.html" style="display:block;text-align:center;font-family:var(--font-body);font-size:12px;letter-spacing:0.08em;color:var(--accent-cyan);text-decoration:none;margin-top:4px;">CONTINUE SHOPPING →</a>
    </div>`;
}

/* ─── AI Delivery Assistant ──────────────────────────────────── */
function renderServiceMessage(order) {
  const el = document.getElementById('trackingServiceMsg');
  if (!el) return;

  if (!window.DeliveryAssistant) {
    el.innerHTML = `<div style="color:var(--text-muted);font-size:13px;font-family:var(--font-body);padding:24px 0;">Delivery Assistant unavailable.</div>`;
    return;
  }

  const guidance = window.DeliveryAssistant.generateGuidance(order.logisticsPayload);
  window.__activeOrderLogistics = order.logisticsPayload;

  el.innerHTML = `
    <div style="border:1px solid var(--border-strong, rgba(61,224,255,0.25));background:var(--bg-surface, #0A1C38);border-radius:var(--radius-lg);padding:26px;" data-motion="fade-up">
      <div style="display:flex;align-items:center;gap:8px;font-family:var(--font-body);font-size:9.5px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:14px;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        AI LOGISTICS INTELLIGENCE
      </div>
      <div style="font-family:var(--font-serif);font-size:clamp(18px,2.2vw,24px);font-weight:500;color:var(--text-primary);line-height:1.25;margin-bottom:8px;">${guidance.headline}</div>
      <div style="font-family:var(--font-body);font-size:13.5px;line-height:1.6;color:var(--text-secondary);margin-bottom:18px;max-width:92%;">${guidance.explanation}</div>
      ${guidance.needsAction ? `<button class="btn-primary-commerce" style="height:42px;padding:0 22px;margin-bottom:18px;font-size:11px;">CONFIRM DELIVERY DETAILS</button>` : ''}
      <div style="margin-top:16px;border-top:1px solid rgba(255,255,255,0.07);padding-top:16px;">
        <div style="font-family:var(--font-body);font-size:9.5px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px;">INSTANT INQUIRIES</div>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          <button type="button" class="tracking-qa-chip" data-question="When should I expect it?">When will it arrive?</button>
          <button type="button" class="tracking-qa-chip" data-question="Where is my order?">Where is it right now?</button>
          <button type="button" class="tracking-qa-chip" data-question="Why is there a delay?">Why the delay?</button>
          <button type="button" class="tracking-qa-chip" data-question="Can I change my address?">Can I change address?</button>
        </div>
      </div>
      <div id="qaResponse" style="display:none;margin-top:16px;padding:16px;background:rgba(61,224,255,0.05);border:1px solid rgba(61,224,255,0.2);border-radius:var(--radius-md);font-family:var(--font-body);font-size:13.5px;line-height:1.6;color:var(--text-primary);"></div>
    </div>`;
}

/* ─── Q&A Event Delegation ───────────────────────────────────── */
document.addEventListener('click', function(e) {
  const chip = e.target.closest('.tracking-qa-chip');
  if (!chip) return;
  const question = chip.dataset.question;
  if (!question || !window.DeliveryAssistant || !window.__activeOrderLogistics) return;

  document.querySelectorAll('.tracking-qa-chip').forEach(c => {
    c.style.borderColor = ''; c.style.background = ''; c.style.color = '';
  });
  chip.style.borderColor = 'var(--accent-cyan)';
  chip.style.background  = 'rgba(61,224,255,0.15)';
  chip.style.color       = '#FFFFFF';

  const answer = window.DeliveryAssistant.answerQuestion(question, window.__activeOrderLogistics);
  const res = document.getElementById('qaResponse');
  if (res) {
    res.style.display = 'block';
    res.innerHTML = `<div style="font-weight:700;margin-bottom:4px;color:var(--accent-cyan);font-size:12px;text-transform:uppercase;letter-spacing:0.06em;">AI Answer:</div><div>${answer}</div>`;
  }
});

/* ─── Telemetry Refresh Handler ──────────────────────────────── */
window.handleRefreshTelemetry = function() {
  const btn = document.getElementById('trackingRefreshBtn');
  if (btn) {
    btn.style.transform = 'scale(0.95)';
    btn.innerHTML = `<svg class="spin-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite;"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>UPDATING SENSORS...</span>`;
    setTimeout(() => {
      btn.style.transform = '';
      btn.innerHTML = `<i data-lucide="check" style="width:14px;height:14px;"></i><span>TELEMETRY SYNCED</span>`;
      const order = window.__trackingOrder;
      if (order) {
        order.lastUpdateTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        if (order.logisticsPayload) order.logisticsPayload.lastUpdateTime = order.lastUpdateTime;
        renderTelemetryBadges(order);
        renderETABanner(order);
      }
      if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
      setTimeout(() => {
        btn.innerHTML = `<i data-lucide="refresh-cw" style="width:14px;height:14px;"></i><span>REFRESH TELEMETRY</span>`;
        if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
      }, 2000);
    }, 600);
  }
};

/* ─── Modal & Order Lookup ───────────────────────────────────── */
window.toggleOrderLookupModal = function() {
  const modal = document.getElementById('orderLookupModal');
  if (!modal) return;
  const isHidden = modal.style.display === 'none';
  modal.style.display = isHidden ? 'flex' : 'none';
  if (isHidden) {
    const input = document.getElementById('orderLookupModalInput');
    if (input) { input.value = ''; setTimeout(() => input.focus(), 100); }
  }
};

window.submitOrderLookup = function(e) {
  if (e && typeof e.preventDefault === 'function') e.preventDefault();
  const input = document.getElementById('orderLookupModalInput') || document.getElementById('orderLookupInput');
  const val = input?.value?.trim();
  if (!val) return;

  const clean = val.toUpperCase();
  window.location.href = `tracking.html?order=${encodeURIComponent(clean)}`;
};

/* ─── Order Cancellation Integration ─────────────────────────── */
window.handleTrackingOrderCancel = function() {
  const order = window.__trackingOrder;
  if (!order || !window.NexOrderCancellation) return;
  const ref = order.ref || order.id;
  window.NexOrderCancellation.openModal(ref, function(res) {
    order.status = 'CANCELLED';
    order.statusKey = 'CANCELLED';
    order.statusLabel = 'Order Cancelled';
    order.logisticsPayload = { ...order.logisticsPayload, status: 'CANCELLED' };
    if (res && res.order) {
      order.cancellationReason = res.order.cancellationReason;
      order.cancelledAt = res.order.cancelledAt;
    }
    renderTrackingPage(order);
  });
};

window.addEventListener('nex:order-cancelled', function(e) {
  const order = window.__trackingOrder;
  if (order && e.detail && (e.detail.orderId === order.ref || e.detail.orderId === order.id)) {
    order.status = 'CANCELLED';
    order.statusKey = 'CANCELLED';
    order.statusLabel = 'Order Cancelled';
    order.logisticsPayload = { ...order.logisticsPayload, status: 'CANCELLED' };
    order.cancellationReason = e.detail.reason;
    order.cancelledAt = e.detail.cancelledAt;
    renderTrackingPage(order);
  }
});

/* ─── No Order Fallback ───────────────────────────────────────── */
function renderNoOrderState() {
  const main = document.getElementById('mainContent');
  if (!main) return;
  main.innerHTML = `
    <div style="min-height:65vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;text-align:center;padding:60px 24px;">
      <span style="font-family:var(--font-body);font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--accent-cyan);">REAL-TIME COURIER TELEMETRY</span>
      <h1 style="font-family:var(--font-serif);font-size:clamp(2rem,5vw,3.5rem);font-weight:500;color:var(--text-primary);margin:0;">Track Your Shipment</h1>
      <p style="font-family:var(--font-body);font-size:15px;color:var(--text-secondary);max-width:460px;line-height:1.6;">Enter your order number or reference code to view live satellite positioning and cold-chain sensor status.</p>
      <form style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:420px;margin-top:12px;" onsubmit="submitOrderLookup(event)">
        <input type="text" id="orderLookupInput" class="checkout-input" placeholder="e.g. ORD-9428-NX or NX-M4KZ9" aria-label="Order reference number" style="text-align:center;font-size:16px;text-transform:uppercase;"/>
        <button type="submit" class="btn-primary-commerce" style="height:52px;">LOCATE SHIPMENT</button>
      </form>
      <div style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center;">
        <a href="tracking.html?order=ORD-9428-NX" class="order-chip">Sample: #ORD-9428-NX (Out for Delivery)</a>
        <a href="tracking.html?order=ORD-8712-NX" class="order-chip">Sample: #ORD-8712-NX (Delivered)</a>
      </div>
      <a href="../index.html" style="font-family:var(--font-body);font-size:13px;color:var(--accent-cyan);text-decoration:none;margin-top:12px;">← RETURN TO ATELIER</a>
    </div>`;
}
