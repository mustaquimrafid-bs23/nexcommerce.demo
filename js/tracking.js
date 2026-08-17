/**
 * nexCommerce &mdash; Order Tracking Engine (js/tracking.js)
 * Reads order data from sessionStorage.nex_confirmed_order or URL ?ref= param.
 * Integrates with js/delivery-assistant.js for AI Delivery Guidance (Feature 5).
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initTracking();
});

/* ─── Header Scroll Blur ─────────────────────────────────────── */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── Core Tracking Initialization ──────────────────────────── */
function initTracking() {
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get('ref');
  
  // URL Params for mocking the 15+ Feature 5 states
  const statusParam = (params.get('status') || 'PREPARING').toUpperCase(); 
  const reasonParam = params.get('reason');
  const scenarioParam = params.get('scenario');
  const isPartial = params.get('partial') === 'true';

  let order = null;
  try {
    const stored = sessionStorage.getItem('nex_confirmed_order');
    if (stored) {
      order = JSON.parse(stored);
      // For local testing of Feature 5, always override status if provided in URL
      order.status = params.get('status') ? statusParam : (order.status || 'PREPARING');
      order.carrierReason = reasonParam;
      order.scenario = scenarioParam;
      order.isPartial = isPartial;
      
      const pDate = order.placedAt ? new Date(order.placedAt) : new Date();
      order.placedDate = pDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
      
      const eDate = new Date(pDate);
      eDate.setDate(eDate.getDate() + (order.deliveryKey === 'express' ? 1 : 3));
      order.expectedDate = eDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
      
      order.deliveryCost = order.shippingCost !== undefined ? order.shippingCost : 0;
      order.customer = order.customer || { 
        name: order.customerName || 'Customer', 
        address: (order.address || '') + (order.city ? ', ' + order.city : '')
      };
      
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(i => {
          i.category = i.category || 'APPAREL';
          i.variant = i.variant || i.size || 'M';
        });
      } else {
        order.items = [];
      }
    }
  } catch (_) {}

  if (!order) {
    if (!refParam) {
      renderNoOrderState();
      return;
    }
    // Use mock data for prototype
    order = getMockOrder(refParam, statusParam, reasonParam, scenarioParam, isPartial);
  }

  // Generate the AI logistics payload that Feature 5 expects
  order.logisticsPayload = {
    status: order.status,
    carrierReason: order.carrierReason,
    scenario: order.scenario,
    isPartial: order.isPartial,
    expectedDate: order.expectedDate,
    lastUpdateTime: '2:15 PM', // Mock
    dataAge: order.scenario === 'stale' ? 'stale' : 'fresh',
    deliveryLocation: 'Reception'
  };

  renderTrackingPage(order);
}

/* ─── Mock Order Data ────────────────────────────────────────── */
function getMockOrder(ref, status, reason, scenario, isPartial) {
  return {
    ref: ref || 'NX-M4KZ9',
    status: status,
    carrierReason: reason,
    scenario: scenario,
    isPartial: isPartial,
    placedDate: 'August 11, 2026',
    paymentMethod: 'bKash',
    expectedDate: 'Wednesday, 19 August',
    expectedRange: 'August 19, 2026',
    customer: { name: 'Shazzad', address: 'Dhaka, Bangladesh' },
    deliveryMethod: 'Express Next Day',
    items: [
      {
        name: 'Architectural Cashmere Sweater',
        category: 'APPAREL',
        variant: 'Midnight / M',
        qty: 1,
        price: 18400,
        image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=200&q=80'
      }
    ],
    subtotal: 18400,
    deliveryCost: 0,
    total: 18400
  };
}

/* ─── Timeline Stage Configuration ──────────────────────────── */
const STAGES = [
  { id: 'confirmed',        label: 'ORDER CONFIRMED',      desc: 'Your order has been confirmed.',                              timestamp: 'August 11 &middot; 10:32 AM' },
  { id: 'payment',          label: 'PAYMENT CONFIRMED',    desc: 'Your payment has been successfully confirmed.',               timestamp: 'August 11 &middot; 10:33 AM' },
  { id: 'preparing',        label: 'PREPARING',            desc: 'Your items are being prepared.',                              timestamp: null },
  { id: 'handed',           label: 'HANDED TO DELIVERY',   desc: 'Your order has been handed to the delivery partner.',         timestamp: null },
  { id: 'out_for_delivery', label: 'OUT FOR DELIVERY',     desc: 'Your order is on its way to you.',                           timestamp: null },
  { id: 'delivered',        label: 'DELIVERED',            desc: 'Your order has arrived.',                                     timestamp: null }
];

const STATUS_MAP = {
  'ORDER_CONFIRMED': 1,
  'PREPARING': 2,
  'SHIPPED': 3,
  'IN_TRANSIT': 3,
  'NEARING_DESTINATION': 3,
  'DELAYED': 3,
  'EXCEPTION': 3,
  'FAILED_ATTEMPT': 3,
  'ACTION_REQUIRED': 3,
  'OUT_FOR_DELIVERY': 4,
  'DELIVERED': 5,
  'RETURNED': 5,
  'CANCELLED': 1
};

/* ─── Render Tracking Page ───────────────────────────────────── */
function renderTrackingPage(order) {
  updateMeta(order);
  renderETABanner(order);
  renderCurrentStatus(order);
  renderTimeline(order);
  renderOrderSummary(order);
  renderServiceMessage(order); // Feature 5 integration
}

function updateMeta(order) {
  const eyebrow = document.getElementById('trackingEyebrow');
  const title   = document.getElementById('trackingTitle');
  const meta    = document.getElementById('trackingMeta');
  const payMap  = { bkash: 'bKash Direct', nagad: 'Nagad Wallet', card: 'Credit / Debit Card', cod: 'Cash on Delivery' };
  const payLabel = payMap[order.paymentMethod] || order.paymentMethod || 'bKash';
  if (eyebrow) eyebrow.textContent = 'YOUR ORDER';
  if (title)   title.textContent   = `Order #${order.ref}`;
  if (meta)    meta.textContent    = `Placed ${order.placedDate} · ${payLabel}`;
  document.title = `Order #${order.ref} &mdash; nexCommerce`;
}

function renderOrderSummary(order) {
  const el = document.getElementById('trackingOrderSummary');
  if (!el) return;

  const itemsHtml = (order.items || []).map(item => {
    const qty = item.qty || item.quantity || 1;
    const variant = item.variant || item.size || 'Standard';
    const price = Number(item.price) || 0;
    const image = item.image || 'assets/images/products/p1.png';
    return `
      <div style="display: flex; gap: 14px; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 16px;">
        <img src="${image}" alt="${item.name}" onerror="this.src='assets/images/products/p1.png'" style="width: 64px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); background: var(--bg-main); flex-shrink: 0;" />
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <div style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary);">${item.category || 'APPAREL'}</div>
          <div style="font-family: var(--font-serif); font-size: 16px; color: var(--text-primary);">${item.name}</div>
          <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-secondary);">${variant} &middot; Qty ${qty}</div>
          <div style="font-family: var(--font-body); font-size: 14px; color: var(--text-primary);">BDT ${(price * qty).toLocaleString()}</div>
        </div>
      </div>
    `;
  }).join('');

  const subtotal = Number(order.subtotal) || 0;
  const discountAmt = Number(order.discountAmt) || 0;
  const shippingCost = Number(order.deliveryCost ?? order.shippingCost ?? 0);
  const total = Number(order.total) || (subtotal - discountAmt + shippingCost);
  const deliveryLabel = shippingCost === 0 ? 'FREE' : `BDT ${shippingCost.toLocaleString()}`;

  const discountRowHtml = discountAmt > 0 ? `
    <div style="display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 13px; color: #00E676;">
      <span>Discount ${order.discountCode ? `(${order.discountCode})` : ''}</span>
      <span>−BDT ${discountAmt.toLocaleString()}</span>
    </div>
  ` : '';

  el.innerHTML = `
    <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 20px;">ORDER SUMMARY</div>

    ${itemsHtml}

    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 13px; color: var(--text-secondary);">
        <span>Subtotal</span>
        <span>BDT ${subtotal.toLocaleString()}</span>
      </div>
      ${discountRowHtml}
      <div style="display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 13px; color: var(--text-secondary);">
        <span>Delivery</span>
        <span style="${shippingCost === 0 ? 'color:#00E676; font-weight:600;' : ''}">${deliveryLabel}</span>
      </div>
      <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-body); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-primary);">TOTAL</span>
        <span style="font-family: var(--font-serif); font-size: 24px; color: var(--text-primary);">BDT ${total.toLocaleString()}</span>
      </div>
    </div>

    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-subtle);">
      <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 10px;">DELIVERING TO</div>
      <div style="font-family: var(--font-body); font-size: 14px; color: var(--text-primary); line-height: 1.6;">${order.customer?.name || order.customerName || 'Client'}<br>${order.customer?.address || order.address || 'Dhaka, Bangladesh'}</div>
    </div>

    <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
      <button class="btn-primary-commerce" style="width: 100%; height: 52px;" onclick="window.print()">VIEW ORDER DETAILS</button>
      <a href="category.html" style="display: block; text-align: center; font-family: var(--font-body); font-size: 13px; color: var(--accent-cyan); text-decoration: none;">CONTINUE SHOPPING &rarr;</a>
    </div>
  `;
}

function renderETABanner(order) {
  const banner = document.getElementById('trackingETA');
  if (!banner) return;

  const guidance = window.DeliveryAssistant ? window.DeliveryAssistant.generateGuidance(order.logisticsPayload) : null;
  const isDelivered = order.status === 'DELIVERED';
  const isDelayed = order.status === 'DELAYED' || order.status === 'EXCEPTION';

  if (isDelivered) {
    banner.innerHTML = `
      <span class="tracking-status-badge" style="background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34D399;">&#10003; DELIVERED</span>
      <div class="tracking-eta-headline" style="margin-top: 8px;">Your order was delivered</div>
      <div class="tracking-meta" style="margin-top: 4px;">${order.logisticsPayload.lastUpdateTime}</div>
    `;
    return;
  }
  
  if (order.status === 'CANCELLED') {
    banner.style.display = 'none';
    return;
  }

  banner.innerHTML = `
    <div>
      <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px;">EXPECTED DELIVERY</div>
      <div class="tracking-eta-headline">${isDelayed ? 'Delayed &mdash; ' + order.expectedDate : order.expectedDate}</div>
      <div class="tracking-meta" style="margin-top: 6px;">${guidance && guidance.confidence === 'low' ? 'Timing may change' : (isDelayed ? 'Your delivery is taking a little longer than expected.' : 'Your order is on schedule.')}</div>
    </div>
  `;
}

function renderCurrentStatus(order) {
  const el = document.getElementById('trackingCurrentStatus');
  if (!el) return;

  const currentIdx  = STATUS_MAP[order.status] ?? 2;
  const currentStage = STAGES[currentIdx];

  // Minor description override based on status
  let desc = currentStage.desc;
  if (order.status === 'DELAYED') desc = 'Your order is taking a little longer than expected. We will update you when the status changes.';
  if (order.status === 'CANCELLED') desc = 'Your order has been cancelled.';

  el.innerHTML = `
    <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-cyan); margin-bottom: 8px;">${currentStage.label}</div>
    <div style="font-family: var(--font-body); font-size: 14px; line-height: 1.6; color: var(--text-secondary);">${desc}</div>
  `;
}

function renderTimeline(order) {
  const list = document.getElementById('trackingTimeline');
  if (!list) return;

  const currentIdx = STATUS_MAP[order.status] ?? 2;

  list.innerHTML = STAGES.map((stage, i) => {
    const isCompleted = i < currentIdx;
    const isActive    = i === currentIdx;

    let stateClass = '';
    if (isCompleted) stateClass = 'completed';
    if (isActive)    stateClass = 'active';

    const dotContent = isCompleted ? '&#10003;' : (isActive ? '●' : '○');

    return `
      <div class="tracking-stage-item ${stateClass}" role="listitem" data-motion="stagger-item">
        <div class="tracking-stage-dot-wrap">
          <div class="tracking-stage-line"></div>
          <div class="tracking-stage-dot" aria-hidden="true">${dotContent}</div>
        </div>
        <div style="display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0; padding-bottom: 24px; padding-top: 2px;">
          <div class="tracking-stage-title" style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: ${isActive ? 'var(--text-primary)' : (isCompleted ? 'var(--text-secondary)' : 'rgba(255,255,255,0.2)')};">${stage.label}</div>
          <div style="font-family: var(--font-body); font-size: 13px; line-height: 1.5; color: ${isCompleted || isActive ? 'var(--text-secondary)' : 'rgba(255,255,255,0.3)'};">${stage.desc}</div>
          ${stage.timestamp && (isCompleted || isActive) ? `<div class="tracking-stage-time" style="font-size: 11px; color: var(--text-secondary); opacity: 0.8; margin-top: 4px;">${stage.timestamp}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');
}


function renderOrderSummary(order) {
  const el = document.getElementById('trackingOrderSummary');
  if (!el) return;

  const itemsHtml = order.items.map(item => `
    <div style="display: flex; gap: 14px; align-items: flex-start; padding-bottom: 16px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 16px;">
      <img src="${item.image}" alt="${item.name}" style="width: 64px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); background: var(--bg-main); flex-shrink: 0;" />
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary);">${item.category}</div>
        <div style="font-family: var(--font-serif); font-size: 16px; color: var(--text-primary);">${item.name}</div>
        <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-secondary);">${item.variant} &middot; Qty ${item.qty}</div>
        <div style="font-family: var(--font-body); font-size: 14px; color: var(--text-primary);">BDT ${item.price.toLocaleString()}</div>
      </div>
    </div>
  `).join('');

  const deliveryLabel = order.deliveryCost === 0 ? 'FREE' : `BDT ${order.deliveryCost.toLocaleString()}`;

  el.innerHTML = `
    <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 20px;">ORDER SUMMARY</div>

    ${itemsHtml}

    <div style="display: flex; flex-direction: column; gap: 10px;">
      <div style="display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 13px; color: var(--text-secondary);">
        <span>Subtotal</span>
        <span>BDT ${order.subtotal.toLocaleString()}</span>
      </div>
      <div style="display: flex; justify-content: space-between; font-family: var(--font-body); font-size: 13px; color: var(--text-secondary);">
        <span>Express Delivery</span>
        <span>${deliveryLabel}</span>
      </div>
      <div style="border-top: 1px solid var(--border-subtle); padding-top: 12px; margin-top: 4px; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-body); font-size: 13px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-primary);">TOTAL</span>
        <span style="font-family: var(--font-serif); font-size: 24px; color: var(--text-primary);">BDT ${order.total.toLocaleString()}</span>
      </div>
    </div>

    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid var(--border-subtle);">
      <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 10px;">DELIVERING TO</div>
      <div style="font-family: var(--font-body); font-size: 14px; color: var(--text-primary); line-height: 1.6;">${order.customer.name}<br>${order.customer.address}</div>
    </div>

    <div style="margin-top: 24px; display: flex; flex-direction: column; gap: 12px;">
      <button class="btn-primary-commerce" style="width: 100%; height: 52px;" onclick="window.print()">VIEW ORDER DETAILS</button>
      <a href="../index.html" style="display: block; text-align: center; font-family: var(--font-body); font-size: 13px; color: var(--accent-cyan); text-decoration: none;">CONTINUE SHOPPING &rarr;</a>
    </div>
  `;
}


/* ─── Feature 5: AI Delivery Guidance Layer ──────────────────── */
function renderServiceMessage(order) {
  const el = document.getElementById('trackingServiceMsg');
  if (!el) return;

  if (!window.DeliveryAssistant) {
    el.innerHTML = '<div style="color: var(--text-secondary);">Delivery Assistant unavailable.</div>';
    return;
  }

  // Generate Guidance via AI Engine
  const guidance = window.DeliveryAssistant.generateGuidance(order.logisticsPayload);

  // Store globally for Q&A chip clicks
  window.__activeOrderLogistics = order.logisticsPayload;

  // Build the rich UI matching the luxury wireframe (removed neon glow)
  el.innerHTML = `
    <div class="tracking-ai-box" style="margin-top: 40px; border: 1px solid var(--border-strong); background: var(--bg-surface); border-radius: var(--radius-lg); padding: 32px;" data-motion="fade-up">
      
      <div style="display: flex; align-items: center; gap: 8px; font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-primary); margin-bottom: 20px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
        DELIVERY ASSISTANT
      </div>
      
      <div style="font-family: var(--font-serif); font-size: 28px; font-weight: 500; color: var(--text-primary); line-height: 1.15; margin-bottom: 12px;">
        ${guidance.headline}
      </div>
      
      <div style="font-family: var(--font-body); font-size: 15px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 24px; max-width: 90%;">
        ${guidance.explanation}
      </div>
      
      ${guidance.needsAction ? `
        <button class="btn-primary-commerce" style="height: 48px; padding: 0 28px; margin-bottom: 24px;">CONFIRM DETAILS</button>
      ` : ''}

      <!-- Q&A Chips -->
      <div style="margin-top: 32px;">
        <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 16px;">ASK ABOUT YOUR DELIVERY</div>
        <div class="tracking-qa-chips" role="list" style="display: flex; flex-wrap: wrap; gap: 8px;">
          <button class="tracking-qa-chip" onclick="handleQA(this, 'When should I expect it?')" role="listitem">When will it arrive?</button>
          <button class="tracking-qa-chip" onclick="handleQA(this, 'Where is my order?')" role="listitem">Where is it?</button>
          <button class="tracking-qa-chip" onclick="handleQA(this, 'Why is there a delay?')" role="listitem">Why the delay?</button>
          <button class="tracking-qa-chip" onclick="handleQA(this, 'Can I change my address?')" role="listitem">Change address?</button>
        </div>
      </div>

      <div id="qaResponse" style="display: none; margin-top: 24px; padding: 24px; background: rgba(255, 255, 255, 0.03); border-radius: var(--radius-md); font-family: var(--font-body); font-size: 14px; line-height: 1.6; color: var(--text-primary);"></div>
    </div>
  `;
}

/* ─── Q&A Chip Handler (Wired to DeliveryAssistant AI) ───────── */
window.handleQA = function(btn, questionString) {
  const responseEl = document.getElementById('qaResponse');
  if (!responseEl || !window.DeliveryAssistant || !window.__activeOrderLogistics) return;

  // Reset all chips styling
  document.querySelectorAll('.tracking-qa-chip').forEach(c => {
    c.style.borderColor = 'rgba(255,255,255,0.1)';
    c.style.background  = 'transparent';
    c.style.color = 'var(--text-secondary)';
  });

  // Highlight selected
  btn.style.borderColor = 'var(--text-primary)';
  btn.style.background  = 'rgba(255,255,255,0.08)';
  btn.style.color = 'var(--text-primary)';

  // Ask AI
  const answer = window.DeliveryAssistant.answerQuestion(questionString, window.__activeOrderLogistics);

  responseEl.style.display = 'block';
  responseEl.innerHTML = `
    <div style="font-weight: 500; margin-bottom: 6px; color: var(--accent-cyan);">Q: ${questionString}</div>
    <div style="color: rgba(255,255,255,0.8);">${answer}</div>
  `;
};

/* ─── No-Order State ─────────────────────────────────────────── */
function renderNoOrderState() {
  const main = document.getElementById('trackingMain');
  if (!main) return;

  main.innerHTML = `
    <div style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; text-align: center; padding: 60px 24px;">
      <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-secondary);">YOUR ORDER</span>
      <h1 style="font-family: var(--font-serif); font-size: 48px; font-weight: 500; color: var(--text-primary);">Track your order</h1>
      <p style="font-family: var(--font-body); font-size: 15px; color: var(--text-secondary); max-width: 440px; line-height: 1.6;">Enter your order number to view its latest status.</p>

      <form style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 400px; margin-top: 8px;" onsubmit="submitOrderLookup(event)">
        <input type="text" id="orderLookupInput" class="checkout-input" placeholder="NX-XXXXX" aria-label="Order reference number" style="text-align: center; font-size: 16px;" />
        <button type="submit" class="btn-primary-commerce" style="height: 52px;">VIEW ORDER</button>
      </form>

      <a href="../index.html" style="font-family: var(--font-body); font-size: 13px; color: var(--accent-cyan); text-decoration: none; margin-top: 4px;">CONTINUE SHOPPING &rarr;</a>
    </div>
  `;
}

window.submitOrderLookup = function(e) {
  e.preventDefault();
  const val = document.getElementById('orderLookupInput')?.value?.trim();
  if (!val) return;
  // Validate format
  if (/^NX-[A-Z0-9]{4,8}$/i.test(val)) {
    window.location.href = `tracking.html?ref=${encodeURIComponent(val.toUpperCase())}`;
  } else {
    renderInvalidOrderState();
  }
};

function renderInvalidOrderState() {
  const main = document.getElementById('trackingMain');
  if (!main) return;
  main.innerHTML = `
    <div style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 16px; text-align: center; padding: 60px 24px;">
      <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-secondary);">YOUR ORDER</span>
      <h1 style="font-family: var(--font-serif); font-size: 40px; font-weight: 500; color: var(--text-primary);">ORDER NOT FOUND</h1>
      <p style="font-family: var(--font-body); font-size: 15px; color: var(--text-secondary); max-width: 440px; line-height: 1.6;">We couldn't find an order with that number. Check the order number and try again.</p>
      <button class="btn-primary-commerce" style="height: 52px; margin-top: 8px;" onclick="renderNoOrderState()">TRY AGAIN</button>
      <a href="../index.html" style="font-family: var(--font-body); font-size: 13px; color: var(--accent-cyan); text-decoration: none;">CONTINUE SHOPPING &rarr;</a>
    </div>
  `;
}
