/**
 * nexCommerce &mdash; Order Tracking Engine (js/tracking.js)
 * Reads order data from sessionStorage.nex_confirmed_order or URL ?ref= param.
 * Renders 6-stage timeline, ETA banner, order summary, and intelligent service messages.
 *
 * TODO: Wire t&times;real API &rarr; GET /api/orders/{orderRef}
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
  const statusParam = params.get('status') || 'preparing'; // preparing | late | delivered

  // Try reading confirmed order from sessionStorage, then fall back t&times;mock
  let order = null;
  try {
    const stored = sessionStorage.getItem('nex_confirmed_order');
    if (stored) {
      order = JSON.parse(stored);
      // Normalize schema from checkout t&times;match tracking engine
      order.status = order.status || statusParam || 'preparing';
      
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
      
      if (order.items) {
        order.items.forEach(i => {
          i.category = i.category || 'APPAREL';
          i.variant = i.variant || i.size || 'M';
        });
      }
    }
  } catch (_) {}

  if (!order) {
    if (!refParam) {
      renderNoOrderState();
      return;
    }
    // Use mock data for prototype
    order = getMockOrder(refParam, statusParam);
  }

  renderTrackingPage(order);
}

/* ─── Mock Order Data (Prototype &mdash; not real backend) ─────────── */
function getMockOrder(ref, status) {
  return {
    ref: ref || 'NX-M4KZ9',
    status: status,
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
  { id: 'handed',           label: 'HANDED TO DELIVERY',   desc: 'Your order has been handed t&times;the delivery partner.',         timestamp: null },
  { id: 'out_for_delivery', label: 'OUT FOR DELIVERY',     desc: 'Your order is on its way t&times;you.',                           timestamp: null },
  { id: 'delivered',        label: 'DELIVERED',            desc: 'Your order has arrived.',                                     timestamp: null }
];

const STATUS_MAP = {
  preparing:   2, // index of current stage (0-based)
  late:        2,
  delivered:   5
};

/* ─── Render Tracking Page ───────────────────────────────────── */
function renderTrackingPage(order) {
  updateMeta(order);
  renderETABanner(order);
  renderCurrentStatus(order);
  renderTimeline(order);
  renderOrderSummary(order);
  renderDeliveryAddress(order);
  renderServiceMessage(order);
}

function updateMeta(order) {
  const eyebrow = document.getElementById('trackingEyebrow');
  const title   = document.getElementById('trackingTitle');
  const meta    = document.getElementById('trackingMeta');
  if (eyebrow) eyebrow.textContent = 'YOUR ORDER';
  if (title)   title.textContent   = `Order #${order.ref}`;
  if (meta)    meta.textContent    = `Placed ${order.placedDate} &middot; ${order.paymentMethod}`;
  document.title = `Order #${order.ref} &mdash; nexCommerce`;
}

function renderETABanner(order) {
  const banner = document.getElementById('trackingETA');
  if (!banner) return;

  const isLate      = order.status === 'late';
  const isDelivered = order.status === 'delivered';

  if (isDelivered) {
    banner.innerHTML = `
      <span class="tracking-status-badge" style="background: rgba(52,211,153,0.1); border-color: rgba(52,211,153,0.3); color: #34D399;">&#10003; DELIVERED</span>
      <div class="tracking-eta-headline" style="margin-top: 8px;">Your order was delivered</div>
      <div class="tracking-meta" style="margin-top: 4px;">August 12 &middot; 1:24 PM</div>
    `;
    return;
  }

  banner.innerHTML = `
    <div>
      <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 6px;">EXPECTED DELIVERY</div>
      <div class="tracking-eta-headline">${isLate ? 'Delayed &mdash; Updated Estimate' : order.expectedDate}</div>
      <div class="tracking-meta" style="margin-top: 6px;">${isLate ? 'Your delivery is taking a little longer than expected. The updated estimated delivery date is Friday, 21 August.' : 'Your order is moving through our delivery network.'}</div>
    </div>
  `;
}

function renderCurrentStatus(order) {
  const el = document.getElementById('trackingCurrentStatus');
  if (!el) return;

  const currentIdx  = STATUS_MAP[order.status] ?? 2;
  const currentStage = STAGES[currentIdx];
  const descriptions = {
    preparing:  'Your items are being prepared for handoff t&times;our delivery partner.',
    late:       'Your order is taking a little longer than expected. We\'ll update you when the status changes.',
    delivered:  'Your order has been successfully delivered.'
  };

  el.innerHTML = `
    <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-cyan); margin-bottom: 8px;">${currentStage.label}</div>
    <div style="font-family: var(--font-body); font-size: 14px; line-height: 1.6; color: var(--text-secondary);">${descriptions[order.status] || descriptions.preparing}</div>
  `;
}

function renderTimeline(order) {
  const list = document.getElementById('trackingTimeline');
  if (!list) return;

  const currentIdx = STATUS_MAP[order.status] ?? 2;

  list.innerHTML = STAGES.map((stage, i) => {
    const isCompleted = i < currentIdx;
    const isActive    = i === currentIdx;
    const isUpcoming  = i > currentIdx;

    let stateClass = '';
    if (isCompleted) stateClass = 'completed';
    if (isActive)    stateClass = 'active';

    const dotContent = isCompleted ? '&#10003;' : (isActive ? '●' : '○');

    return `
      <div class="tracking-stage-item ${stateClass}" role="listitem">
        <div class="tracking-stage-dot" aria-hidden="true">${dotContent}</div>
        <div style="display: flex; flex-direction: column; gap: 4px; flex: 1; min-width: 0;">
          <div class="tracking-stage-title">${stage.label}</div>
          <div style="font-family: var(--font-body); font-size: 13px; line-height: 1.5; color: ${isCompleted || isActive ? 'var(--text-secondary)' : 'rgba(170,182,200,0.5)'};">${stage.desc}</div>
          ${stage.timestamp && (isCompleted || isActive) ? `<div class="tracking-stage-time">${stage.timestamp}</div>` : ''}
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
      <a href="index.html" style="display: block; text-align: center; font-family: var(--font-body); font-size: 13px; color: var(--accent-cyan); text-decoration: none;">CONTINUE SHOPPING &rarr;</a>
    </div>
  `;
}

function renderDeliveryAddress(order) {}  // Included in renderOrderSummary above

function renderServiceMessage(order) {
  const el = document.getElementById('trackingServiceMsg');
  if (!el) return;

  const isLate = order.status === 'late';

  el.innerHTML = `
    <div class="tracking-ai-box">
      <div style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-cyan);">DELIVERY GUIDANCE</div>
      <div style="font-family: var(--font-body); font-size: 14px; line-height: 1.6; color: var(--text-secondary);">
        ${isLate
          ? 'Your delivery is taking a little longer than expected. The updated estimated delivery date is Friday, 21 August. We\'ll update you as soon as the status changes.'
          : `Your order is currently on schedule for ${order.expectedDate}. Because you selected ${order.deliveryMethod} delivery, your items will be prioritised for earliest available handoff.`
        }
      </div>

      <div class="tracking-qa-chips" role="list">
        <button class="tracking-qa-chip" onclick="handleQA(this, 'when')" role="listitem">When should I expect it?</button>
        <button class="tracking-qa-chip" onclick="handleQA(this, 'next')" role="listitem">What happens next?</button>
        <button class="tracking-qa-chip" onclick="handleQA(this, 'address')" role="listitem">Can I change my address?</button>
        <button class="tracking-qa-chip" onclick="handleQA(this, 'late')" role="listitem">What if it's late?</button>
      </div>

      <div id="qaResponse" style="display: none; margin-top: 12px; padding: 14px 16px; background: rgba(255,255,255,0.04); border-radius: var(--radius-sm); font-family: var(--font-body); font-size: 14px; line-height: 1.6; color: var(--text-primary);"></div>
    </div>
  `;
}

/* ─── Q&A Chip Handler ───────────────────────────────────────── */
const QA_ANSWERS = {
  when:    'Based on your selected Express Next Day delivery and your location in Dhaka, your order is expected by Wednesday, 19 August.',
  next:    'Your order is currently being prepared. Once it is handed t&times;the delivery partner, you\'ll see the timeline update here automatically.',
  address: 'Once an order is confirmed, delivery address changes cannot be made. Please contact our support team as soon as possible if you need assistance.',
  late:    'If your order is delayed beyond the expected date, please use the Contact Support option below. We\'ll investigate and update you within one business day.'
};

window.handleQA = function(btn, key) {
  const response = document.getElementById('qaResponse');
  if (!response) return;

  // Reset all chips
  document.querySelectorAll('.tracking-qa-chip').forEach(c => {
    c.style.borderColor = '';
    c.style.background  = '';
  });

  // Highlight selected
  btn.style.borderColor = 'var(--accent-cyan)';
  btn.style.background  = 'rgba(0,200,255,0.08)';

  response.style.display = 'block';
  response.textContent   = QA_ANSWERS[key] || '';
};

/* ─── No-Order State ─────────────────────────────────────────── */
function renderNoOrderState() {
  const main = document.getElementById('trackingMain');
  if (!main) return;

  main.innerHTML = `
    <div style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; text-align: center; padding: 60px 24px;">
      <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-secondary);">YOUR ORDER</span>
      <h1 style="font-family: var(--font-serif); font-size: 48px; font-weight: 500; color: var(--text-primary);">Track your order</h1>
      <p style="font-family: var(--font-body); font-size: 15px; color: var(--text-secondary); max-width: 440px; line-height: 1.6;">Enter your order number t&times;view its latest status.</p>

      <form style="display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 400px; margin-top: 8px;" onsubmit="submitOrderLookup(event)">
        <input type="text" id="orderLookupInput" class="checkout-input" placeholder="NX-XXXXX" aria-label="Order reference number" style="text-align: center; font-size: 16px;" />
        <button type="submit" class="btn-primary-commerce" style="height: 52px;">VIEW ORDER</button>
      </form>

      <a href="index.html" style="font-family: var(--font-body); font-size: 13px; color: var(--accent-cyan); text-decoration: none; margin-top: 4px;">CONTINUE SHOPPING &rarr;</a>
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
      <a href="index.html" style="font-family: var(--font-body); font-size: 13px; color: var(--accent-cyan); text-decoration: none;">CONTINUE SHOPPING &rarr;</a>
    </div>
  `;
}
