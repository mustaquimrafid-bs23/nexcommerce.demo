/**
 * nexCommerce — Order Tracking Engine v2
 * Interactive Visual Delivery Journey Map & Real-Time Transit Telemetry Hub
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
  { id: 'confirmed',        label: 'Confirmed',        statusKey: 'ORDER_CONFIRMED',  beaconPos: 0.00, location: 'Milan Atelier',              ts: 'Aug 11 · 10:32 AM' },
  { id: 'preparing',        label: 'Preparing',        statusKey: 'PREPARING',        beaconPos: 0.15, location: 'Milan Atelier',              ts: 'Aug 11 · 11:45 AM' },
  { id: 'handed',           label: 'Handed',           statusKey: 'SHIPPED',          beaconPos: 0.38, location: 'Milan Logistics Center',     ts: 'Aug 12 · 08:20 AM' },
  { id: 'in_transit',       label: 'In Transit',       statusKey: 'IN_TRANSIT',       beaconPos: 0.62, location: 'Central European Hub',       ts: 'Aug 13 · 14:55 PM' },
  { id: 'out_for_delivery', label: 'Out for Delivery', statusKey: 'OUT_FOR_DELIVERY', beaconPos: 0.85, location: 'Munich Distribution Center', ts: 'Aug 14 · 07:30 AM' },
  { id: 'delivered',        label: 'Delivered',        statusKey: 'DELIVERED',        beaconPos: 1.00, location: 'Munich, Germany',            ts: 'Aug 14 · 11:22 AM' },
];

const STATUS_TO_STAGE = {
  'ORDER_CONFIRMED': 0, 'PREPARING': 1,
  'SHIPPED': 2,         'IN_TRANSIT': 3,
  'NEARING_DESTINATION': 3, 'DELAYED': 3,
  'EXCEPTION': 3,       'FAILED_ATTEMPT': 3,
  'ACTION_REQUIRED': 3, 'OUT_FOR_DELIVERY': 4,
  'DELIVERED': 5,       'RETURNED': 5,
  'CANCELLED': 0,
};

const TELEMETRY = [
  { temp: '18°C', tempStatus: 'Optimal',    carbon: '0.0 kg', flight: 'Pending',       flightNo: '—',       weight: '1.2 kg', dims: '42 × 32 × 8 cm' },
  { temp: '18°C', tempStatus: 'Optimal',    carbon: '0.0 kg', flight: 'Pending',       flightNo: '—',       weight: '1.2 kg', dims: '42 × 32 × 8 cm' },
  { temp: '17°C', tempStatus: 'Optimal',    carbon: '0.2 kg', flight: 'Dispatching',   flightNo: 'LH 9427', weight: '1.2 kg', dims: '42 × 32 × 8 cm' },
  { temp: '16°C', tempStatus: 'Controlled', carbon: '0.8 kg', flight: 'In Flight',     flightNo: 'LH 9427', weight: '1.2 kg', dims: '42 × 32 × 8 cm' },
  { temp: '14°C', tempStatus: 'Controlled', carbon: '1.1 kg', flight: 'Landed · MUC', flightNo: 'LH 9427', weight: '1.2 kg', dims: '42 × 32 × 8 cm' },
  { temp: '20°C', tempStatus: 'Ambient',    carbon: '1.1 kg', flight: 'Complete',      flightNo: 'LH 9427', weight: '1.2 kg', dims: '42 × 32 × 8 cm' },
];

/* ─── Core Init ──────────────────────────────────────────────── */
function initTracking() {
  const params        = new URLSearchParams(window.location.search);
  const refParam      = params.get('ref');
  const statusParam   = (params.get('status') || 'PREPARING').toUpperCase();
  const reasonParam   = params.get('reason');
  const scenarioParam = params.get('scenario');
  const isPartial     = params.get('partial') === 'true';

  let order = null;
  try {
    const stored = sessionStorage.getItem('nex_confirmed_order');
    if (stored) {
      order = JSON.parse(stored);
      order.status       = params.get('status') ? statusParam : (order.status || 'PREPARING');
      order.carrierReason = reasonParam;
      order.scenario     = scenarioParam;
      order.isPartial    = isPartial;
      const pDate        = order.placedAt ? new Date(order.placedAt) : new Date();
      order.placedDate   = pDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      const eDate        = new Date(pDate);
      eDate.setDate(eDate.getDate() + (order.deliveryKey === 'express' ? 1 : 3));
      order.expectedDate = eDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      order.deliveryCost = order.shippingCost !== undefined ? order.shippingCost : 0;
      order.customer     = order.customer || { name: order.customerName || 'Customer', address: (order.address || '') + (order.city ? ', ' + order.city : '') };
      if (!Array.isArray(order.items)) order.items = [];
      order.items.forEach(i => { i.category = i.category || 'APPAREL'; i.variant = i.variant || i.size || 'M'; });
    }
  } catch (_) {}

  if (!order) {
    if (!refParam) { renderNoOrderState(); return; }
    order = getMockOrder(refParam, statusParam, reasonParam, scenarioParam, isPartial);
  }

  order.logisticsPayload = {
    status: order.status, carrierReason: order.carrierReason,
    scenario: order.scenario, isPartial: order.isPartial,
    expectedDate: order.expectedDate, lastUpdateTime: '2:15 PM',
    dataAge: order.scenario === 'stale' ? 'stale' : 'fresh',
    deliveryLocation: 'Reception'
  };

  window.__trackingOrder = order;
  renderTrackingPage(order);
}

/* ─── Mock Order ─────────────────────────────────────────────── */
function getMockOrder(ref, status, reason, scenario, isPartial) {
  return {
    ref: ref || 'NX-M4KZ9', status, carrierReason: reason, scenario, isPartial,
    placedDate: 'August 11, 2026',
    paymentMethod: 'Klarna Pay in 30 Days',
    expectedDate: 'Wednesday, 19 August',
    expectedRange: 'August 19, 2026',
    customer: { name: 'Julian Mercer', address: 'Kaufingerstraße 24, 80331 Munich, Germany' },
    deliveryMethod: 'DHL Express On-Demand',
    items: [{ name: 'Architectural Cashmere Sweater', category: 'APPAREL', variant: 'Midnight / M', qty: 1, price: 185, image: '../assets/images/products/hero_sweater.png' }],
    subtotal: 185, deliveryCost: 0, total: 185
  };
}

/* ─── Orchestrate ────────────────────────────────────────────── */
function renderTrackingPage(order) {
  updateMeta(order);
  renderStageSimulator(order);
  renderETABanner(order);
  renderRouteMap(order);
  renderTelemetryBadges(order);
  renderOrderSummary(order);
  renderServiceMessage(order);
}

/* ─── Meta ───────────────────────────────────────────────────── */
function updateMeta(order) {
  const payMap = { klarna: 'Klarna Pay in 30 Days', ideal: 'iDEAL', bancontact: 'Bancontact', applepay: 'Apple Pay', paypal: 'PayPal', card: 'Credit Card', sepa: 'SEPA' };
  const payLabel = payMap[(order.paymentMethod || '').toLowerCase()] || order.paymentMethod || 'Klarna';
  const eyebrow = document.getElementById('trackingEyebrow');
  const title   = document.getElementById('trackingTitle');
  const meta    = document.getElementById('trackingMeta');
  if (eyebrow) eyebrow.textContent = 'YOUR ORDER';
  if (title)   title.textContent   = `Order #${order.ref}`;
  if (meta)    meta.textContent    = `Placed ${order.placedDate} · ${payLabel}`;
  document.title = `Order #${order.ref} — nexCommerce`;
}

/* ─── Stage Simulator ────────────────────────────────────────── */
function renderStageSimulator(order) {
  const container = document.getElementById('stageSimulator');
  if (!container) return;
  const currentIdx = STATUS_TO_STAGE[order.status] ?? 1;
  container.innerHTML = `
    <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px;">SIMULATE STAGE</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px;">
      ${STAGES.map((s, i) => `
        <button class="sim-pill${i === currentIdx ? ' sim-pill--active' : ''}" data-stage-idx="${i}" onclick="simulateStage(${i})" aria-pressed="${i === currentIdx}">${s.label}</button>
      `).join('')}
    </div>
  `;
}

window.simulateStage = function(idx) {
  const order = window.__trackingOrder;
  if (!order) return;
  order.status = STAGES[idx].statusKey;
  order.logisticsPayload = { ...order.logisticsPayload, status: order.status };
  document.querySelectorAll('.sim-pill').forEach((pill, i) => {
    pill.classList.toggle('sim-pill--active', i === idx);
    pill.setAttribute('aria-pressed', String(i === idx));
  });
  renderETABanner(order);
  renderRouteMap(order);
  renderTelemetryBadges(order);
  renderServiceMessage(order);
};

/* ─── ETA Banner ─────────────────────────────────────────────── */
function renderETABanner(order) {
  const banner = document.getElementById('trackingETA');
  if (!banner) return;
  const isDelivered = order.status === 'DELIVERED';
  const isDelayed   = order.status === 'DELAYED' || order.status === 'EXCEPTION';

  if (order.status === 'CANCELLED') { banner.style.display = 'none'; return; }
  banner.style.display = '';

  if (isDelivered) {
    banner.style.cssText += ';border-color:rgba(52,211,153,0.25);background:rgba(52,211,153,0.05)';
    banner.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;">
        <span style="display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:rgba(52,211,153,0.15);color:#34D399;font-size:15px;flex-shrink:0;">✓</span>
        <div>
          <div style="font-family:var(--font-body);font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#34D399;margin-bottom:3px;">DELIVERED</div>
          <div style="font-family:var(--font-body);font-size:14px;color:var(--text-secondary);">Your order arrived at ${order.logisticsPayload.lastUpdateTime}</div>
        </div>
      </div>`;
    return;
  }

  banner.style.borderColor = '';
  banner.style.background = '';
  banner.innerHTML = `
    <div style="display:flex;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;gap:12px;">
      <div>
        <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:5px;">EXPECTED DELIVERY</div>
        <div style="font-family:var(--font-serif);font-size:clamp(20px,3vw,28px);color:var(--text-primary);line-height:1.1;">${isDelayed ? 'Delayed — ' + order.expectedDate : order.expectedDate}</div>
        <div style="font-family:var(--font-body);font-size:12px;color:var(--text-muted);margin-top:5px;">${isDelayed ? 'Delivery is taking longer than expected.' : 'Your order is on schedule.'}</div>
      </div>
      <div style="display:flex;align-items:center;gap:6px;font-family:var(--font-body);font-size:11px;color:var(--accent-cyan);padding:6px 12px;border:1px solid rgba(61,224,255,0.2);border-radius:var(--radius-pill);background:rgba(61,224,255,0.05);flex-shrink:0;">
        <span style="width:6px;height:6px;border-radius:50%;background:var(--accent-cyan);display:inline-block;animation:pulse-dot 1.8s ease-in-out infinite;"></span>
        LIVE TRACKING
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

  const stageIdx   = STATUS_TO_STAGE[order.status] ?? 1;
  const stage      = STAGES[stageIdx];
  const bp         = bezierPoint(stage.beaconPos);
  const pct        = stage.beaconPos * 100;
  const isDelivered = stageIdx >= 5;

  const pathD = 'M 90 115 C 215 25 205 25 360 55 S 500 25 630 115';
  const WP = [
    { x: 90,  y: 115, label: 'MILAN ATELIER',        sub: 'Origin',           done: stageIdx >= 2 },
    { x: 360, y: 55,  label: 'CENTRAL EU HUB',        sub: 'Frankfurt Gateway', done: stageIdx >= 3 },
    { x: 630, y: 115, label: 'MUNICH',                sub: 'Destination',      done: stageIdx >= 5 },
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
    <rect width="720" height="180" fill="rgba(0,24,56,0.5)" rx="14"/>
    <line x1="0" y1="90" x2="720" y2="90" stroke="rgba(255,255,255,0.035)" stroke-width="1"/>
    <path d="${pathD}" fill="none" stroke="rgba(255,255,255,0.07)" stroke-width="2.5" stroke-dasharray="5 5"/>
    <path d="${pathD}" fill="none" stroke="url(#rg)" stroke-width="3" stroke-linecap="round"/>
    ${WP.map((wp, i) => {
      const clr = wp.done ? (i === 2 ? '#34D399' : '#3DE0FF') : 'rgba(255,255,255,0.22)';
      const glowId = i === 2 ? 'dGlow' : 'bGlow';
      return `${wp.done ? `<circle cx="${wp.x}" cy="${wp.y}" r="22" fill="url(#${glowId})"/>` : ''}
        <circle cx="${wp.x}" cy="${wp.y}" r="9" fill="rgba(0,18,48,0.95)" stroke="${clr}" stroke-width="2"/>
        <circle cx="${wp.x}" cy="${wp.y}" r="4" fill="${clr}" ${wp.done ? 'filter="url(#gf)"' : ''}/>
        <text x="${wp.x}" y="${wp.y + 22}" text-anchor="middle" font-family="Inter,sans-serif" font-size="8.5" font-weight="700" letter-spacing="0.09em" fill="${wp.done ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.3)'}">${wp.label}</text>
        <text x="${wp.x}" y="${wp.y + 33}" text-anchor="middle" font-family="Inter,sans-serif" font-size="7.5" fill="rgba(255,255,255,0.35)">${wp.sub}</text>`;
    }).join('')}
    ${!isDelivered && stage.beaconPos > 0 && stage.beaconPos < 1 ? `
      <circle cx="${bp.x}" cy="${bp.y}" r="22" fill="url(#bGlow)" class="beacon-glow-ring"/>
      <circle cx="${bp.x}" cy="${bp.y}" r="11" fill="rgba(0,18,48,0.92)" stroke="rgba(61,224,255,0.35)" stroke-width="1.5"/>
      <circle cx="${bp.x}" cy="${bp.y}" r="5.5" fill="#3DE0FF" filter="url(#gf)" class="beacon-pulse"/>
      <text x="${bp.x}" y="${bp.y + 4}" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif" font-size="9" fill="#fff">▸</text>
    ` : ''}
    ${isDelivered ? `<circle cx="${WP[2].x}" cy="${WP[2].y}" r="22" fill="url(#dGlow)" class="beacon-glow-ring"/><text x="${WP[2].x}" y="${WP[2].y + 5}" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif" font-size="13" fill="#34D399">✓</text>` : ''}
    <text x="706" y="20" text-anchor="end" font-family="Inter,sans-serif" font-size="9" font-weight="700" letter-spacing="0.1em" fill="rgba(61,224,255,0.75)">${stage.label.toUpperCase()}</text>
    <text x="706" y="32" text-anchor="end" font-family="Inter,sans-serif" font-size="8" fill="rgba(255,255,255,0.38)">${stage.location}</text>
    <text x="14" y="20" text-anchor="start" font-family="Inter,sans-serif" font-size="8" fill="rgba(255,255,255,0.3)">DHL EXPRESS · ${stage.ts}</text>
  </svg>`;
}

/* ─── Telemetry Badges ───────────────────────────────────────── */
function renderTelemetryBadges(order) {
  const container = document.getElementById('telemetryBadges');
  if (!container) return;
  const t = TELEMETRY[STATUS_TO_STAGE[order.status] ?? 1];

  const badges = [
    { icon: '📐', label: 'PACKAGE SPEC',       rows: [{ k: 'Weight', v: t.weight }, { k: 'Dimensions', v: t.dims }, { k: 'Class', v: 'Priority Parcel' }] },
    { icon: '🌡', label: 'CLIMATE CONTROL',    rows: [{ k: 'Temperature', v: t.temp }, { k: 'Status', v: t.tempStatus }, { k: 'Protocol', v: 'Cold Chain' }] },
    { icon: '🌿', label: 'CARBON OFFSET',      rows: [{ k: 'CO₂ Offset', v: t.carbon }, { k: 'Carrier', v: 'DHL GoGreen' }, { k: 'Standard', v: 'PAS 2060' }] },
    { icon: '✈', label: 'DISPATCH TELEMETRY', rows: [{ k: 'Flight', v: t.flightNo }, { k: 'Status', v: t.flight }, { k: 'Route', v: 'MXP → FRA → MUC' }] },
  ];

  container.innerHTML = `
    <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:12px;">PARCEL TELEMETRY</div>
    <div class="telemetry-grid">
      ${badges.map(b => `
        <div class="telemetry-badge">
          <div class="telemetry-badge-icon">${b.icon}</div>
          <div style="font-family:var(--font-body);font-size:8.5px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:10px;">${b.label}</div>
          ${b.rows.map(r => `
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;">
              <span style="font-family:var(--font-body);font-size:11px;color:var(--text-muted);">${r.k}</span>
              <span style="font-family:var(--font-mono);font-size:11px;font-weight:500;color:var(--text-secondary);">${r.v}</span>
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
    const qty    = item.qty || item.quantity || 1;
    const price  = Number(item.price) || 0;
    const variant = item.variant || item.size || 'Standard';
    const image  = item.image || '../assets/images/products/hero_sweater.png';
    return `
      <div style="display:flex;gap:14px;align-items:flex-start;padding-bottom:16px;border-bottom:1px solid var(--border-subtle);margin-bottom:16px;">
        <div style="position:relative;flex-shrink:0;">
          <img src="${image}" alt="${item.name}" onerror="this.src='../assets/images/products/hero_sweater.png'" style="width:72px;height:90px;object-fit:cover;border-radius:var(--radius-sm);background:var(--bg-surface);" />
          <span style="position:absolute;top:-4px;right:-4px;background:var(--bg-deep);border:1px solid var(--border-default);border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-family:var(--font-body);font-size:9px;font-weight:700;color:var(--text-secondary);">${qty}</span>
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;flex:1;min-width:0;">
          <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);">${item.category || 'APPAREL'}</div>
          <div style="font-family:var(--font-serif);font-size:15px;color:var(--text-primary);line-height:1.25;">${item.name}</div>
          <div style="font-family:var(--font-body);font-size:12px;color:var(--text-muted);">${variant}</div>
          <div style="font-family:var(--font-body);font-size:14px;color:var(--text-primary);" class="tabular-nums">€ ${(price * qty).toFixed(2)}</div>
        </div>
      </div>`;
  }).join('');

  const subtotal  = Number(order.subtotal) || 0;
  const discount  = Number(order.discountAmt) || 0;
  const shipping  = Number(order.deliveryCost ?? order.shippingCost ?? 0);
  const total     = Number(order.total) || (subtotal - discount + shipping);
  const shipLabel = shipping === 0 ? 'FREE' : `€ ${shipping.toFixed(2)}`;
  const discRow   = discount > 0 ? `<div style="display:flex;justify-content:space-between;font-size:13px;color:#00E676;"><span>Discount</span><span class="tabular-nums">−€ ${discount.toFixed(2)}</span></div>` : '';

  el.innerHTML = `
    <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-muted);margin-bottom:16px;">ORDER SUMMARY</div>
    ${itemsHtml}
    <div style="display:flex;flex-direction:column;gap:8px;font-family:var(--font-body);">
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);"><span>Subtotal</span><span class="tabular-nums">€ ${subtotal.toFixed(2)}</span></div>
      ${discRow}
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--text-secondary);"><span>Delivery</span><span class="tabular-nums" style="${shipping===0?'color:#00E676;font-weight:600;':''}">${shipLabel}</span></div>
      <div style="border-top:1px solid var(--border-subtle);padding-top:12px;margin-top:4px;display:flex;justify-content:space-between;align-items:center;">
        <span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-primary);">TOTAL (INCL. VAT)</span>
        <span style="font-family:var(--font-serif);font-size:22px;color:var(--text-primary);" class="tabular-nums">€ ${total.toFixed(2)}</span>
      </div>
    </div>
    <div style="margin-top:18px;padding:15px;background:rgba(61,224,255,0.05);border:1px solid rgba(61,224,255,0.15);border-radius:var(--radius-md);">
      <div style="display:flex;align-items:flex-start;gap:10px;">
        <span style="font-size:15px;line-height:1;margin-top:1px;flex-shrink:0;">📍</span>
        <div>
          <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:5px;">DELIVERING TO</div>
          <div style="font-family:var(--font-body);font-size:13px;color:var(--text-primary);line-height:1.5;">${order.customer?.name || 'Julian Mercer'}</div>
          <div style="font-family:var(--font-body);font-size:12px;color:var(--text-secondary);line-height:1.5;margin-top:2px;">${order.customer?.address || 'Kaufingerstraße 24, 80331 Munich, Germany'}</div>
        </div>
      </div>
    </div>
    <div style="margin-top:18px;display:flex;flex-direction:column;gap:10px;">
      <button class="btn-primary-commerce" style="width:100%;height:50px;" onclick="window.print()">VIEW INVOICE</button>
      <a href="category.html" style="display:block;text-align:center;font-family:var(--font-body);font-size:12px;letter-spacing:0.08em;color:var(--accent-cyan);text-decoration:none;">CONTINUE SHOPPING →</a>
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
    <div style="margin-top:32px;border:1px solid var(--border-strong);background:var(--bg-surface);border-radius:var(--radius-lg);padding:28px;" data-motion="fade-up">
      <div style="display:flex;align-items:center;gap:8px;font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-primary);margin-bottom:16px;">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        DELIVERY ASSISTANT
      </div>
      <div style="font-family:var(--font-serif);font-size:clamp(20px,2.5vw,26px);font-weight:500;color:var(--text-primary);line-height:1.2;margin-bottom:10px;">${guidance.headline}</div>
      <div style="font-family:var(--font-body);font-size:14px;line-height:1.65;color:var(--text-secondary);margin-bottom:20px;max-width:88%;">${guidance.explanation}</div>
      ${guidance.needsAction ? `<button class="btn-primary-commerce" style="height:44px;padding:0 24px;margin-bottom:20px;">CONFIRM DETAILS</button>` : ''}
      <div style="margin-top:20px;">
        <div style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--text-muted);margin-bottom:10px;">ASK ABOUT YOUR DELIVERY</div>
        <div style="display:flex;flex-wrap:wrap;gap:7px;">
          <button class="tracking-qa-chip" data-question="When should I expect it?">When will it arrive?</button>
          <button class="tracking-qa-chip" data-question="Where is my order?">Where is it?</button>
          <button class="tracking-qa-chip" data-question="Why is there a delay?">Why the delay?</button>
          <button class="tracking-qa-chip" data-question="Can I change my address?">Change address?</button>
        </div>
      </div>
      <div id="qaResponse" style="display:none;margin-top:18px;padding:20px;background:rgba(255,255,255,0.03);border-radius:var(--radius-md);font-family:var(--font-body);font-size:14px;line-height:1.65;color:var(--text-primary);"></div>
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
  chip.style.borderColor = 'var(--text-primary)';
  chip.style.background  = 'rgba(255,255,255,0.08)';
  chip.style.color       = 'var(--text-primary)';

  const answer = window.DeliveryAssistant.answerQuestion(question, window.__activeOrderLogistics);
  const res = document.getElementById('qaResponse');
  if (res) {
    res.style.display = 'block';
    res.innerHTML = `<div style="font-weight:600;margin-bottom:6px;color:var(--accent-cyan);">Q: ${question}</div><div style="color:rgba(255,255,255,0.85);">${answer}</div>`;
  }
});

/* ─── No Order State ─────────────────────────────────────────── */
function renderNoOrderState() {
  const main = document.getElementById('trackingMain');
  if (!main) return;
  main.innerHTML = `
    <div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:20px;text-align:center;padding:60px 24px;">
      <span style="font-family:var(--font-body);font-size:9px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:var(--text-muted);">YOUR ORDER</span>
      <h1 style="font-family:var(--font-serif);font-size:clamp(2rem,5vw,3.5rem);font-weight:500;color:var(--text-primary);">Track your order</h1>
      <p style="font-family:var(--font-body);font-size:15px;color:var(--text-secondary);max-width:440px;line-height:1.65;">Enter your order number to view its real-time location and delivery telemetry.</p>
      <form style="display:flex;flex-direction:column;gap:12px;width:100%;max-width:400px;margin-top:8px;" onsubmit="submitOrderLookup(event)">
        <input type="text" id="orderLookupInput" class="checkout-input" placeholder="NX-XXXXX" aria-label="Order reference number" style="text-align:center;font-size:16px;"/>
        <button type="submit" class="btn-primary-commerce" style="height:52px;">VIEW ORDER</button>
      </form>
      <a href="../index.html" style="font-family:var(--font-body);font-size:13px;color:var(--accent-cyan);text-decoration:none;">CONTINUE SHOPPING →</a>
    </div>`;
}

window.submitOrderLookup = function(e) {
  e.preventDefault();
  const val = document.getElementById('orderLookupInput')?.value?.trim();
  if (!val) return;
  if (/^NX-[A-Z0-9]{4,8}$/i.test(val)) {
    window.location.href = `tracking.html?ref=${encodeURIComponent(val.toUpperCase())}`;
  } else {
    const main = document.getElementById('trackingMain');
    if (main) main.innerHTML = `<div style="min-height:60vh;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center;padding:60px 24px;"><h1 style="font-family:var(--font-serif);font-size:2.5rem;color:var(--text-primary);">Order Not Found</h1><p style="font-family:var(--font-body);font-size:15px;color:var(--text-secondary);">Check the order number and try again.</p><button class="btn-primary-commerce" style="height:52px;margin-top:8px;" onclick="renderNoOrderState()">TRY AGAIN</button></div>`;
  }
};
