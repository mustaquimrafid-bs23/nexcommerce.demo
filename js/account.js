/**
 * nexCommerce — Client Atelier Vault & Order Portfolio (js/account.js)
 * Manages VIP Client Status Hero, Order Archive Cards with Live Route Bars,
 * Tactile Address Vault, Style DNA Radar, and Auth/Empty states.
 *
 * TODO: Wire to real Auth & Orders API → GET /api/user/account
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initAccount();
});

/* ─── Utility ─────────────────────────────────────────────────── */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* ─── Header Scroll Observer ─────────────────────────────────── */
function initHeaderScroll() {
  const header = document.getElementById('siteHeader');
  if (!header) return;
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ─── State Store ────────────────────────────────────────────── */
const ACCOUNT_DATA = {
  user: {
    name: 'Julian Voss',
    email: 'julian.voss@atelier-client.de',
    phone: '+49 89 1234 5678'
  },
  orders: [
    {
      ref: 'NX-M4KZ9',
      date: '11 Aug 2026',
      status: 'preparing',
      statusLabel: 'Preparing',
      items: [
        {
          name: 'Architectural Cashmere Sweater',
          category: 'APPAREL',
          variant: 'Midnight / M',
          qty: 1,
          price: 184.00,
          image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=200&q=80'
        }
      ],
      deliveryMethod: 'DHL Express European Custody',
      expectedDate: '19 August 2026',
      paymentMethod: 'Klarna Pay in 30 Days',
      address: 'Maximilianstraße 35, 80539 Munich, Germany',
      subtotal: 184.00,
      deliveryCost: 0,
      total: 184.00
    },
    {
      ref: 'NX-K82P1',
      date: '02 Aug 2026',
      status: 'delivered',
      statusLabel: 'Delivered',
      items: [
        {
          name: 'Merino Layer Top',
          category: 'APPAREL',
          variant: 'Charcoal / L',
          qty: 1,
          price: 89.00,
          image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=200&q=80'
        }
      ],
      deliveryMethod: 'Standard DPD Delivery',
      expectedDate: '04 August 2026',
      paymentMethod: 'Apple Pay',
      address: 'Maximilianstraße 35, 80539 Munich, Germany',
      subtotal: 89.00,
      deliveryCost: 0,
      total: 89.00
    },
    {
      ref: 'NX-J71Q4',
      date: '27 Jul 2026',
      status: 'delivered',
      statusLabel: 'Delivered',
      items: [
        {
          name: 'Structured Leather Tote',
          category: 'ACCESSORIES',
          variant: 'Black / One Size',
          qty: 1,
          price: 142.00,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&q=80'
        }
      ],
      deliveryMethod: 'DHL Express European Custody',
      expectedDate: '29 July 2026',
      paymentMethod: 'iDEAL',
      address: 'Maximilianstraße 35, 80539 Munich, Germany',
      subtotal: 142.00,
      deliveryCost: 0,
      total: 142.00
    }
  ],
  addresses: [
    {
      id: 'addr-1',
      tag: 'PRIMARY RESIDENCE',
      isDefault: true,
      name: 'Julian Voss',
      address: 'Maximilianstraße 35',
      city: 'Munich',
      postcode: '80539',
      country: 'Germany',
      phone: '+49 89 1234 5678'
    },
    {
      id: 'addr-2',
      tag: 'STUDIO',
      isDefault: false,
      name: 'Julian Voss',
      address: 'Boulevard Saint-Germain 120',
      city: 'Paris',
      postcode: '75006',
      country: 'France',
      phone: '+33 1 42 68 55 00'
    }
  ],
  preferences: {
    style: 'Minimal',
    fit: 'Relaxed',
    delivery: 'Express'
  },
  aiSignals: [
    { name: 'Minimal silhouettes', level: 'Strong preference' },
    { name: 'Neutral colors', level: 'Frequent choice' },
    { name: 'Relaxed fit', level: 'Frequent choice' },
    { name: 'Layering', level: 'Occasional choice' }
  ],
  recommendations: [
    {
      id: 'rec-1',
      title: 'Architectural Overshirt',
      price: 128.00,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
      reason: 'Works with the relaxed silhouettes you\'ve chosen recently.'
    },
    {
      id: 'rec-2',
      title: 'Merino Layer',
      price: 96.00,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80',
      reason: 'A lighter option for the evening temperatures you usually shop for.'
    },
    {
      id: 'rec-3',
      title: 'Structured Leather Tote',
      price: 142.00,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
      reason: 'Complements your minimal aesthetic preferences.'
    }
  ]
};

let currentTab = 'overview';
let activeOrderFilter = 'ALL';
let currentAuthState = 'signed_in';

/* ─── Initialization ────────────────────────────────────────── */
function initAccount() {
  try {
    const confirmed = sessionStorage.getItem('nex_confirmed_order');
    if (confirmed) {
      const parsed = JSON.parse(confirmed);
      if (parsed && parsed.ref) {
        const idx = ACCOUNT_DATA.orders.findIndex(o => o.ref === parsed.ref);
        const orderObj = {
          ref: parsed.ref,
          date: 'Today',
          status: 'preparing',
          statusLabel: 'Preparing',
          items: parsed.items || ACCOUNT_DATA.orders[0].items,
          deliveryMethod: parsed.deliveryMethod || 'DHL Express European Custody',
          expectedDate: parsed.expectedDate || '19 August 2026',
          paymentMethod: parsed.paymentMethod || 'Klarna Pay in 30 Days',
          address: parsed.customer?.address || 'Maximilianstraße 35, 80539 Munich, Germany',
          subtotal: parsed.subtotal || 184.00,
          deliveryCost: parsed.deliveryCost || 0,
          total: parsed.total || 184.00
        };
        if (idx >= 0) ACCOUNT_DATA.orders[idx] = orderObj;
        else ACCOUNT_DATA.orders.unshift(orderObj);
      }
    }
  } catch (_) {}

  const hash = window.location.hash.replace('#', '');
  if (['overview', 'orders', 'addresses', 'style-dna'].includes(hash)) {
    currentTab = hash;
  }

  setupEventListeners();
  renderAccountPage();
}

/* ─── Event Listeners ────────────────────────────────────────── */
function setupEventListeners() {
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (['overview', 'orders', 'addresses', 'style-dna'].includes(hash)) {
      switchTab(hash);
    }
  });

  document.addEventListener('click', e => {
    const reorderBtn = e.target.closest('.btn-reorder-piece');
    if (reorderBtn) {
      const ref = reorderBtn.dataset.ref;
      handleReorder(ref);
    }
    const addAddrCard = e.target.closest('#btnAddNewAddress');
    if (addAddrCard) {
      openAddAddressModal();
    }
  });
}

function handleReorder(ref) {
  const order = ACCOUNT_DATA.orders.find(o => o.ref === ref);
  if (!order || !order.items.length) return;
  const item = order.items[0];
  if (window.NexCart) {
    window.NexCart.addItem({
      id: 'item_' + Date.now(),
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1,
      size: item.variant || 'M'
    });
  }
  const toast = document.createElement('div');
  toast.style.cssText = 'position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a2a4a;border:1px solid rgba(61,224,255,0.3);color:#fff;font-family:Inter,sans-serif;font-size:13px;padding:12px 20px;border-radius:8px;z-index:9999;pointer-events:none;';
  toast.textContent = `"${item.name}" added to your bag.`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

/* ─── Main Render Function ───────────────────────────────────── */
function renderAccountPage() {
  const main = document.getElementById('accountMainContent');
  if (!main) return;

  if (currentAuthState === 'signed_out') {
    renderSignedOutState(main);
    return;
  }

  if (currentAuthState === 'empty_account') {
    renderEmptyAccountState(main);
    return;
  }

  main.innerHTML = `
    <div class="dev-state-harness">
      <span>⚙ DEV STATE SWITCHER:</span>
      <select onchange="changeDevAuthState(this.value)">
        <option value="signed_in" ${currentAuthState === 'signed_in' ? 'selected' : ''}>Signed In (With Orders &amp; Profile)</option>
        <option value="empty_account" ${currentAuthState === 'empty_account' ? 'selected' : ''}>Signed In (Empty State &mdash; No Orders)</option>
        <option value="signed_out" ${currentAuthState === 'signed_out' ? 'selected' : ''}>Signed Out (Sign-In Screen)</option>
      </select>
    </div>

    ${renderAccountHeader(ACCOUNT_DATA.user, ACCOUNT_DATA.orders)}
    ${renderNavigationTabs()}

    <div id="tabPanelContainer" class="account-tab-content">
      ${renderTabPanel(currentTab)}
    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

window.changeDevAuthState = function(state) {
  currentAuthState = state;
  renderAccountPage();
};

window.switchTab = function(tab) {
  currentTab = tab;
  window.location.hash = tab;
  renderAccountPage();
};

/* ─── Task 1: VIP Client Status Hero ────────────────────────── */
function renderAccountHeader(user, orders) {
  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const activeCount = orders.filter(o => o.status === 'preparing' || o.status === 'dispatched').length;

  return `
    <section class="account-vip-hero" id="accountVipHero">
      <div class="vip-hero-masthead">
        <div class="vip-client-identity">
          <span class="vip-tier-badge">
            <span class="vip-live-dot"></span>
            TIER I &middot; PRIVATE ATELIER CLIENT
          </span>
          <h1 class="vip-client-name">${escapeHtml(user.name || 'Valued Client')}</h1>
          <p class="vip-client-email">${escapeHtml(user.email)} &middot; Member since 2024</p>
        </div>
        <div class="vip-concierge-quicklink">
          <a href="concierge.html" class="btn-concierge-direct">
            <i data-lucide="sparkles" style="width: 14px; height: 14px; color: #3DE0FF;"></i>
            <span>Direct Concierge Line</span>
          </a>
        </div>
      </div>

      <div class="account-stats-telemetry">
        <div class="account-stat-card">
          <span class="stat-card-label">TOTAL ACQUISITIONS</span>
          <div class="stat-card-val tabular-nums">${orders.length} Pieces</div>
        </div>
        <div class="stat-card-divider"></div>
        <div class="account-stat-card">
          <span class="stat-card-label">ACTIVE IN TRANSIT</span>
          <div class="stat-card-val tabular-nums" style="color: #3DE0FF;">${activeCount} Shipment${activeCount === 1 ? '' : 's'}</div>
        </div>
        <div class="stat-card-divider"></div>
        <div class="account-stat-card">
          <span class="stat-card-label">PORTFOLIO VALUATION</span>
          <div class="stat-card-val tabular-nums">&euro; ${totalSpent.toFixed(2)}</div>
        </div>
      </div>
    </section>
  `;
}

/* ─── Task 1: Navigation Tab Strip ──────────────────────────── */
function renderNavigationTabs() {
  const tabs = [
    { id: 'overview',   label: 'Overview' },
    { id: 'orders',     label: 'Orders' },
    { id: 'addresses',  label: 'Addresses' },
    { id: 'style-dna',  label: 'Style DNA' },
  ];

  const items = tabs.map(t => `
    <button class="account-tab-item ${currentTab === t.id ? 'active' : ''}"
            onclick="switchTab('${t.id}')"
            role="tab"
            aria-selected="${currentTab === t.id}">
      ${t.label}
    </button>
  `).join('');

  const signOutBtn = `
    <button class="account-tab-item account-tab-signout"
            onclick="changeDevAuthState('signed_out')"
            style="margin-left: auto; color: #FB7185;">
      Sign Out
    </button>
  `;

  return `
    <div class="account-tab-strip" id="accountTabStrip" role="tablist">
      ${items}
      ${signOutBtn}
    </div>
  `;
}

/* ─── Render Tab Router ──────────────────────────────────────── */
function renderTabPanel(tab) {
  switch (tab) {
    case 'overview':  return renderOverviewPanel();
    case 'orders':    return renderOrdersPanel();
    case 'addresses': return renderAddressesPanel();
    case 'style-dna': return renderPreferencesPanel();
    default:          return renderOverviewPanel();
  }
}

/* ─── Task 2: Luxury Order Card ─────────────────────────────── */
function renderOrderCard(order) {
  const isPreparing = order.status === 'preparing';
  const isDelivered = order.status === 'delivered';
  const trackUrl = `tracking.html?ref=${encodeURIComponent(order.ref)}`;

  const itemsHtml = order.items.map(item => `
    <div class="account-order-item-row">
      <div class="account-order-thumb">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" onerror="this.src='../assets/images/products/p1.png'">
      </div>
      <div class="account-order-item-details">
        <span class="account-item-brand">${escapeHtml(item.category || 'APPAREL')}</span>
        <h4 class="account-item-name">${escapeHtml(item.name)}</h4>
        <span class="account-item-variant">${escapeHtml(item.variant)} &middot; Qty ${item.qty}</span>
      </div>
      <div class="account-order-item-price tabular-nums">
        &euro; ${(item.price * item.qty).toFixed(2)}
      </div>
    </div>
  `).join('');

  return `
    <div class="account-order-luxury-card" data-ref="${escapeHtml(order.ref)}">
      <div class="order-card-top-bar">
        <div class="order-card-identity">
          <span class="order-ref-code">${escapeHtml(order.ref)}</span>
          <span class="order-date-whisper">Acquired on ${escapeHtml(order.date)}</span>
        </div>
        <div class="order-card-status-badge ${isPreparing ? 'status-active' : 'status-complete'}">
          <span class="status-indicator-dot"></span>
          <span>${escapeHtml(order.statusLabel || 'In Transit')}</span>
        </div>
      </div>

      ${isPreparing ? `
        <div class="order-live-route-strip">
          <div class="route-progress-track">
            <div class="route-progress-fill" style="width: 45%;"></div>
          </div>
          <div class="route-meta-row">
            <span class="route-status-msg">
              <i data-lucide="truck" style="width:12px;height:12px;color:#3DE0FF;"></i>
              Atelier Conditioning &middot; Handover Imminent
            </span>
            <span class="route-eta-msg">ETA: ${escapeHtml(order.expectedDate)}</span>
          </div>
        </div>
      ` : ''}

      <div class="order-card-items-list">
        ${itemsHtml}
      </div>

      <div class="order-card-footer">
        <div class="order-footer-actions">
          <a href="${trackUrl}" class="btn-order-action btn-order-track">
            <i data-lucide="compass" style="width: 13px; height: 13px;"></i>
            <span>Live Route Map</span>
          </a>
          <button type="button" class="btn-order-action btn-reorder-piece" data-ref="${escapeHtml(order.ref)}">
            <i data-lucide="rotate-ccw" style="width: 13px; height: 13px;"></i>
            <span>Acquire Again</span>
          </button>
        </div>
        <div class="order-card-total-group">
          <span class="order-total-label">Total Paid</span>
          <span class="order-total-val tabular-nums">&euro; ${Number(order.total).toFixed(2)}</span>
        </div>
      </div>
    </div>
  `;
}

/* ─── 1. Overview Panel ──────────────────────────────────────── */
function renderOverviewPanel() {
  const activeOrder = ACCOUNT_DATA.orders.find(o => o.status === 'preparing');
  const recentOrders = ACCOUNT_DATA.orders.filter(o => o.status !== 'preparing').slice(0, 2);

  return `
    ${activeOrder ? `
      <div class="account-panel-section-label">ACTIVE SHIPMENT</div>
      ${renderOrderCard(activeOrder)}
    ` : ''}

    ${recentOrders.length > 0 ? `
      <div class="account-panel-section-label" style="margin-top: 32px;">RECENT ACQUISITIONS</div>
      ${recentOrders.map(o => renderOrderCard(o)).join('')}
    ` : ''}

    <div style="margin-top: 40px;">
      ${renderStyleSignalsWidget()}
    </div>
  `;
}

/* ─── 2. Orders Panel ────────────────────────────────────────── */
function renderOrdersPanel() {
  const filteredOrders = ACCOUNT_DATA.orders.filter(order => {
    if (activeOrderFilter === 'ALL') return true;
    if (activeOrderFilter === 'ACTIVE') return order.status === 'preparing';
    if (activeOrderFilter === 'DELIVERED') return order.status === 'delivered';
    if (activeOrderFilter === 'CANCELLED') return order.status === 'cancelled';
    return true;
  });

  const filterChipsHtml = ['ALL', 'ACTIVE', 'DELIVERED', 'CANCELLED'].map(filter => `
    <button class="preference-chip ${activeOrderFilter === filter ? 'active' : ''}" onclick="setOrderFilter('${filter}')">${filter}</button>
  `).join('');

  const cardsHtml = filteredOrders.length > 0
    ? filteredOrders.map(o => renderOrderCard(o)).join('')
    : `<div class="orders-empty-panel">
         <i data-lucide="package-search" style="width:32px;height:32px;color:rgba(255,255,255,0.2);margin-bottom:12px;"></i>
         <p>No ${activeOrderFilter.toLowerCase()} orders found.</p>
       </div>`;

  return `
    <div class="orders-panel-header">
      <div>
        <div class="account-panel-section-label">ORDER PORTFOLIO</div>
        <p style="font-size: 13px; color: var(--text-secondary); margin: 4px 0 0;">All acquisitions and fulfillment records.</p>
      </div>
      <div class="preference-chips">${filterChipsHtml}</div>
    </div>
    ${cardsHtml}
  `;
}

window.setOrderFilter = function(filter) {
  activeOrderFilter = filter;
  renderAccountPage();
};

/* ─── Task 3: Addresses Panel ────────────────────────────────── */
function renderAddressesPanel() {
  const addressCardsHtml = ACCOUNT_DATA.addresses.map(addr => `
    <div class="address-luxury-card ${addr.isDefault ? 'default-card' : ''}">
      <div class="address-card-header">
        <span class="address-type-label">${escapeHtml(addr.tag)}</span>
        ${addr.isDefault ? '<span class="address-default-badge">DEFAULT</span>' : ''}
      </div>
      <div class="address-body-text">
        <strong>${escapeHtml(addr.name)}</strong><br>
        ${escapeHtml(addr.address)}<br>
        ${escapeHtml(addr.postcode)} ${escapeHtml(addr.city)}, ${escapeHtml(addr.country || 'Germany')}<br>
        ${escapeHtml(addr.phone)}
      </div>
      <div class="address-card-actions">
        <button type="button" class="btn-address-micro" onclick="alert('Editing address ${addr.id}')">Edit Details</button>
        ${!addr.isDefault ? `<button type="button" class="btn-address-micro btn-address-remove" onclick="deleteAddress('${addr.id}')">Remove</button>` : ''}
      </div>
    </div>
  `).join('');

  return `
    <div class="account-addresses-grid">
      ${addressCardsHtml}
      <div class="address-luxury-card add-new-card" id="btnAddNewAddress" role="button" tabindex="0">
        <div class="add-address-content">
          <div class="add-icon-ring">
            <i data-lucide="plus" style="width: 18px; height: 18px;"></i>
          </div>
          <span class="add-address-title">Add New Delivery Destination</span>
          <span class="add-address-sub">European residential or atelier delivery</span>
        </div>
      </div>
    </div>
  `;
}

window.deleteAddress = function(id) {
  ACCOUNT_DATA.addresses = ACCOUNT_DATA.addresses.filter(a => a.id !== id);
  renderAccountPage();
};

window.openAddAddressModal = function() {
  const modal = document.createElement('div');
  modal.id = 'addAddressModal';
  modal.style.cssText = 'position: fixed; inset: 0; background: rgba(7, 26, 58, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px;';
  modal.innerHTML = `
    <div class="account-card" style="width: 100%; max-width: 480px; margin: 0; position: relative;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <div class="account-card-title" style="margin: 0;">ADD NEW ADDRESS</div>
        <button onclick="document.getElementById('addAddressModal').remove()" style="background: none; border: none; color: var(--text-secondary); font-size: 20px; cursor: pointer;">&times;</button>
      </div>
      <form onsubmit="submitNewAddress(event)" style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">TAG (E.G. HOME, STUDIO)</label>
          <input type="text" id="newAddrTag" class="checkout-input" placeholder="HOME" required style="width: 100%;" />
        </div>
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">FULL NAME</label>
          <input type="text" id="newAddrName" class="checkout-input" value="${escapeHtml(ACCOUNT_DATA.user.name)}" required style="width: 100%;" />
        </div>
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">STREET ADDRESS</label>
          <input type="text" id="newAddrStreet" class="checkout-input" placeholder="House / Road / Block" required style="width: 100%;" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">CITY</label>
            <input type="text" id="newAddrCity" class="checkout-input" placeholder="Munich" required style="width: 100%;" />
          </div>
          <div>
            <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">POSTCODE</label>
            <input type="text" id="newAddrPostcode" class="checkout-input" placeholder="80539" required style="width: 100%;" />
          </div>
        </div>
        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px;">
          <button type="button" class="preference-chip" onclick="document.getElementById('addAddressModal').remove()">CANCEL</button>
          <button type="submit" class="btn-primary-commerce" style="padding: 10px 24px;">SAVE ADDRESS</button>
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);
  if (window.lucide) window.lucide.createIcons();
};

window.submitNewAddress = function(e) {
  e.preventDefault();
  const tag = document.getElementById('newAddrTag')?.value || 'HOME';
  const name = document.getElementById('newAddrName')?.value || ACCOUNT_DATA.user.name;
  const street = document.getElementById('newAddrStreet')?.value;
  const city = document.getElementById('newAddrCity')?.value || 'Munich';
  const postcode = document.getElementById('newAddrPostcode')?.value || '80539';

  ACCOUNT_DATA.addresses.push({
    id: `addr-${Date.now()}`,
    tag: tag.toUpperCase(),
    isDefault: false,
    name,
    address: street,
    city,
    postcode,
    country: 'Germany',
    phone: ACCOUNT_DATA.user.phone
  });

  document.getElementById('addAddressModal')?.remove();
  renderAccountPage();
};

/* ─── Task 3: Style DNA Radar Widget ────────────────────────── */
function renderStyleSignalsWidget() {
  return `
    <div class="account-style-dna-card">
      <div class="dna-card-info">
        <span class="dna-eyebrow">ACTIVE STYLE PROFILE</span>
        <h3 class="dna-title">Quiet Luxury &amp; Nordic Minimal</h3>
        <p class="dna-desc">Your 6-axis aesthetic radar is actively personalising catalog recommendations across tailoring, knitwear, and high acoustics.</p>
        <a href="profile.html" class="btn-primary-commerce btn-dna-adjust">
          <i data-lucide="sliders" style="width: 13px; height: 13px;"></i>
          <span>CALIBRATE STYLE RADAR</span>
        </a>
      </div>
      <div class="dna-card-visual">
        <div class="mini-radar-avatar">
          <svg width="90" height="90" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <polygon points="50,15 80,35 75,75 50,90 25,75 20,35" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
            <polygon points="50,22 74,40 70,70 50,82 30,70 28,40" fill="rgba(61,224,255,0.15)" stroke="#3DE0FF" stroke-width="1.5"/>
          </svg>
        </div>
      </div>
    </div>
  `;
}

/* ─── 4. Style & Fit Profile Panel ──────────────────────────── */
function renderPreferencesPanel() {
  const styles = ['Minimal', 'Classic', 'Relaxed', 'Statement'];
  const fits = ['Slim', 'Regular', 'Relaxed'];
  const colors = ['Monochrome', 'Earth Tones', 'Jewel Tones', 'Brights'];
  const brands = ['Loro Piana', 'Brunello Cucinelli', 'Acne Studios', 'Jil Sander'];

  const styleChipsHtml = styles.map(s => `
    <button class="preference-chip ${ACCOUNT_DATA.preferences.style === s ? 'active' : ''}" onclick="setPreference('style', '${s}')">${s}</button>
  `).join('');
  const fitChipsHtml = fits.map(f => `
    <button class="preference-chip ${ACCOUNT_DATA.preferences.fit === f ? 'active' : ''}" onclick="setPreference('fit', '${f}')">${f}</button>
  `).join('');
  const colorChipsHtml = colors.map(c => `
    <button class="preference-chip ${ACCOUNT_DATA.preferences.color === c ? 'active' : ''}" onclick="setPreference('color', '${c}')">${c}</button>
  `).join('');
  const brandChipsHtml = brands.map(b => `
    <button class="preference-chip ${ACCOUNT_DATA.preferences.brand === b ? 'active' : ''}" onclick="setPreference('brand', '${b}')">${b}</button>
  `).join('');

  const signalsHtml = ACCOUNT_DATA.aiSignals.length > 0 ? ACCOUNT_DATA.aiSignals.map(sig => `
    <div class="style-signal-item">
      <span class="style-signal-name">${escapeHtml(sig.name)}</span>
      <span class="style-signal-badge">${escapeHtml(sig.level)}</span>
    </div>
  `).join('') : '<div style="color: var(--text-secondary); font-size: 13px;">No signals collected yet.</div>';

  return `
    ${renderStyleSignalsWidget()}

    <div class="account-card" style="margin-top: 24px;">
      <div class="account-card-title">YOUR STYLE &amp; FIT PROFILE</div>
      <div style="font-size: 13px; color: var(--text-secondary); margin-bottom: 24px;">Explicit preferences guide our AI recommendations. You are always in control.</div>

      <div class="preference-group">
        <span class="preference-label">STYLE AESTHETIC</span>
        <div class="preference-chips">${styleChipsHtml}</div>
      </div>
      <div class="preference-group">
        <span class="preference-label">FIT PREFERENCE</span>
        <div class="preference-chips">${fitChipsHtml}</div>
      </div>
      <div class="preference-group">
        <span class="preference-label">COLOR PALETTE</span>
        <div class="preference-chips">${colorChipsHtml}</div>
      </div>
      <div class="preference-group" style="margin-bottom: 0;">
        <span class="preference-label">FAVOURITE DESIGNERS</span>
        <div class="preference-chips">${brandChipsHtml}</div>
      </div>
    </div>

    <div class="account-card" style="background: rgba(0, 200, 255, 0.03); border-color: rgba(0, 200, 255, 0.16); margin-top: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="account-card-title" style="color: var(--accent-cyan); margin: 0;">AI INFERRED PROFILE</div>
        <span style="font-size: 11px; color: var(--text-secondary);">IMPLICIT SIGNALS</span>
      </div>
      <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px;">
        Based on your previous browsing and search queries (e.g., "warm for a cool evening in Milan"), we've learned that you often prefer minimal silhouettes and relaxed fits for city evening wear.
      </p>
      <div class="style-signal-list">${signalsHtml}</div>
    </div>

    <div class="account-card" style="background: rgba(255, 0, 85, 0.03); border-color: rgba(255, 0, 85, 0.16); margin-top: 16px;">
      <div class="account-card-title" style="color: var(--accent-pink);">DATA TRANSPARENCY</div>
      <p style="font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px;">
        nexCommerce uses your explicit preferences and implicit search signals to tailor product recommendations and discovery results.
        We do not sell this data. You can clear your AI profile at any time.
      </p>
      <button class="btn-secondary-action" style="color: var(--accent-pink); border-color: rgba(255, 0, 85, 0.4);" onclick="clearAiProfile()">CLEAR AI PROFILE DATA</button>
    </div>
  `;
}

window.clearAiProfile = function() {
  if (confirm('Are you sure you want to clear your AI Profile? This will reset your recommendations.')) {
    ACCOUNT_DATA.preferences.style = '';
    ACCOUNT_DATA.preferences.fit = '';
    ACCOUNT_DATA.preferences.color = '';
    ACCOUNT_DATA.preferences.brand = '';
    ACCOUNT_DATA.aiSignals = [];
    renderAccountPage();
  }
};

window.setPreference = function(key, val) {
  ACCOUNT_DATA.preferences[key] = val;
  renderAccountPage();
};

/* ─── Signed Out State ───────────────────────────────────────── */
function renderSignedOutState(container) {
  container.innerHTML = `
    <div class="dev-state-harness">
      <span>⚙ DEV STATE SWITCHER:</span>
      <select onchange="changeDevAuthState(this.value)">
        <option value="signed_out" selected>Signed Out (Sign-In Screen)</option>
        <option value="signed_in">Signed In (With Orders &amp; Profile)</option>
        <option value="empty_account">Signed In (Empty State &mdash; No Orders)</option>
      </select>
    </div>

    <div style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center;">
      <span style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase; color: var(--text-secondary);">ACCOUNT</span>
      <h1 class="account-title" style="margin-top: 8px; margin-bottom: 12px;">WELCOME BACK</h1>
      <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">Sign in to view your orders, saved details, and preferences.</p>

      <form onsubmit="handleSignInSubmit(event)" style="width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; text-align: left; margin-bottom: 6px;">EMAIL ADDRESS</label>
          <input type="email" class="checkout-input" placeholder="julian@atelier-client.de" required style="width: 100%; text-align: left;" />
        </div>
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; text-align: left; margin-bottom: 6px;">PASSWORD</label>
          <input type="password" class="checkout-input" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" required style="width: 100%; text-align: left;" />
        </div>
        <button type="submit" class="btn-primary-commerce" style="height: 52px; margin-top: 8px;">SIGN IN</button>
      </form>

      <a href="../index.html" style="font-size: 13px; color: var(--accent-cyan); text-decoration: none; margin-top: 24px;">CONTINUE AS GUEST &rarr;</a>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}

window.handleSignInSubmit = function(e) {
  e.preventDefault();
  changeDevAuthState('signed_in');
};

/* ─── Empty Account State ────────────────────────────────────── */
function renderEmptyAccountState(container) {
  container.innerHTML = `
    <div class="dev-state-harness">
      <span>⚙ DEV STATE SWITCHER:</span>
      <select onchange="changeDevAuthState(this.value)">
        <option value="empty_account" selected>Signed In (Empty State &mdash; No Orders)</option>
        <option value="signed_in">Signed In (With Orders &amp; Profile)</option>
        <option value="signed_out">Signed Out (Sign-In Screen)</option>
      </select>
    </div>

    ${renderAccountHeader(ACCOUNT_DATA.user, [])}

    <div style="min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; background: #0B2147; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px; margin-top: 32px;">
      <h2 style="font-family: var(--font-serif); font-size: 32px; font-weight: 500; color: var(--text-primary); margin-bottom: 12px;">YOUR SHOPPING JOURNEY STARTS HERE</h2>
      <p style="font-size: 14px; color: var(--text-secondary); max-width: 420px; line-height: 1.6; margin-bottom: 28px;">
        Your orders and delivery updates will appear here after your first acquisition.
      </p>
      <a href="category.html" class="btn-primary-commerce" style="padding: 14px 32px; text-decoration: none;">START SHOPPING</a>
    </div>
  `;
  if (window.lucide) window.lucide.createIcons();
}
