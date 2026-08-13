/**
 * nexCommerce &mdash; Customer Account Engine (js/account.js)
 * Manages Overview, Orders history & filtering, Delivery Addresses,
 * Preferences, AI Style Signals, 3-Product Personalized Discovery, and Auth/Empty states.
 *
 * TODO: Wire to real Auth & Orders API &rarr; GET /api/user/account
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initAccount();
});

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
    name: 'Shazzad',
    email: 'shazzad@example.com',
    phone: '+880 1711 000000'
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
          price: 18400,
          image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=200&q=80'
        }
      ],
      deliveryMethod: 'Express Next Day',
      expectedDate: '19 August 2026',
      paymentMethod: 'bKash',
      address: 'House 12, Road 5, Dhanmondi, Dhaka',
      subtotal: 18400,
      deliveryCost: 0,
      total: 18400
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
          price: 8900,
          image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=200&q=80'
        }
      ],
      deliveryMethod: 'Standard Delivery',
      expectedDate: '04 August 2026',
      paymentMethod: 'Card',
      address: 'House 12, Road 5, Dhanmondi, Dhaka',
      subtotal: 8900,
      deliveryCost: 0,
      total: 8900
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
          price: 14200,
          image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&q=80'
        }
      ],
      deliveryMethod: 'Express Delivery',
      expectedDate: '29 July 2026',
      paymentMethod: 'bKash',
      address: 'House 12, Road 5, Dhanmondi, Dhaka',
      subtotal: 14200,
      deliveryCost: 0,
      total: 14200
    }
  ],
  addresses: [
    {
      id: 'addr-1',
      tag: 'HOME',
      isDefault: true,
      name: 'Shazzad',
      address: 'House 12, Road 5, Dhanmondi',
      city: 'Dhaka',
      postcode: '1205',
      phone: '+880 1711 000000'
    },
    {
      id: 'addr-2',
      tag: 'WORK',
      isDefault: false,
      name: 'Shazzad',
      address: 'Level 8, Brain Station Tower, Gulshan 2',
      city: 'Dhaka',
      postcode: '1212',
      phone: '+880 1711 000000'
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
      price: 12800,
      image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=400&q=80',
      reason: 'Works with the relaxed silhouettes you\'ve chosen recently.'
    },
    {
      id: 'rec-2',
      title: 'Merino Layer',
      price: 9600,
      image: 'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=400&q=80',
      reason: 'A lighter option for the evening temperatures you usually shop for.'
    },
    {
      id: 'rec-3',
      title: 'Structured Leather Tote',
      price: 14200,
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=400&q=80',
      reason: 'Complements your minimal aesthetic preferences.'
    }
  ]
};

let currentTab = 'overview';
let activeOrderFilter = 'ALL';
let currentAuthState = 'signed_in'; // signed_in | signed_out | empty_account

/* ─── Initialization ────────────────────────────────────────── */
function initAccount() {
  // Sync sessionStorage order if present
  try {
    const confirmed = sessionStorage.getItem('nex_confirmed_order');
    if (confirmed) {
      const parsed = JSON.parse(confirmed);
      if (parsed && parsed.ref) {
        // Prepend or update confirmed order in ACCOUNT_DATA
        const idx = ACCOUNT_DATA.orders.findIndex(o => o.ref === parsed.ref);
        const orderObj = {
          ref: parsed.ref,
          date: 'Today',
          status: 'preparing',
          statusLabel: 'Preparing',
          items: parsed.items || ACCOUNT_DATA.orders[0].items,
          deliveryMethod: parsed.deliveryMethod || 'Express Next Day',
          expectedDate: parsed.expectedDate || '19 August 2026',
          paymentMethod: parsed.paymentMethod || 'bKash',
          address: parsed.customer?.address || 'Dhaka, Bangladesh',
          subtotal: parsed.subtotal || 18400,
          deliveryCost: parsed.deliveryCost || 0,
          total: parsed.total || 18400
        };
        if (idx >= 0) ACCOUNT_DATA.orders[idx] = orderObj;
        else ACCOUNT_DATA.orders.unshift(orderObj);
      }
    }
  } catch (_) {}

  // Parse tab from URL hash if provided (#orders, #addresses, #preferences)
  const hash = window.location.hash.replace('#', '');
  if (['overview', 'orders', 'addresses', 'preferences'].includes(hash)) {
    currentTab = hash;
  }

  setupEventListeners();
  renderAccountPage();
}

/* ─── Event Listeners ────────────────────────────────────────── */
function setupEventListeners() {
  // Hash change
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    if (['overview', 'orders', 'addresses', 'preferences'].includes(hash)) {
      switchTab(hash);
    }
  });
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

  // Signed In View
  main.innerHTML = `
    <!-- DEV HARNESS BAR -->
    <div class="dev-state-harness">
      <span>⚙ DEV STATE SWITCHER:</span>
      <select onchange="changeDevAuthState(this.value)">
        <option value="signed_in" ${currentAuthState === 'signed_in' ? 'selected' : ''}>Signed In (With Orders & Profile)</option>
        <option value="empty_account" ${currentAuthState === 'empty_account' ? 'selected' : ''}>Signed In (Empty State &mdash; No Orders)</option>
        <option value="signed_out" ${currentAuthState === 'signed_out' ? 'selected' : ''}>Signed Out (Sign-In Screen)</option>
      </select>
    </div>

    <!-- ACCOUNT HEADER -->
    <div class="account-header-block">
      <span class="tracking-meta" style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;">ACCOUNT</span>
      <h1 class="account-title">Welcome back, ${ACCOUNT_DATA.user.name}</h1>
      <p class="account-subtitle">Manage your orders, delivery details, and preferences.</p>
    </div>

    <!-- ACCOUNT GRID -->
    <div class="account-layout">

      <!-- SIDEBAR -->
      <nav class="account-sidebar" aria-label="Account Navigation">
        <div class="account-nav-group" role="tablist">
          <button class="account-nav-item ${currentTab === 'overview' ? 'active' : ''}" onclick="switchTab('overview')" role="tab" aria-selected="${currentTab === 'overview'}">Overview</button>
          <button class="account-nav-item ${currentTab === 'orders' ? 'active' : ''}" onclick="switchTab('orders')" role="tab" aria-selected="${currentTab === 'orders'}">Orders</button>
          <button class="account-nav-item ${currentTab === 'addresses' ? 'active' : ''}" onclick="switchTab('addresses')" role="tab" aria-selected="${currentTab === 'addresses'}">Addresses</button>
          <button class="account-nav-item ${currentTab === 'preferences' ? 'active' : ''}" onclick="switchTab('preferences')" role="tab" aria-selected="${currentTab === 'preferences'}">Style & Fit Profile</button>
        </div>
        <div class="account-nav-divider"></div>
        <button class="account-nav-item" onclick="changeDevAuthState('signed_out')" style="color: var(--accent-pink);">Sign Out</button>
      </nav>

      <!-- MAIN TAB CONTENT -->
      <div id="tabPanelContainer">
        ${renderTabPanel(currentTab)}
      </div>

    </div>
  `;
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

/* ─── Render Tab Panel Content ───────────────────────────────── */
function renderTabPanel(tab) {
  switch (tab) {
    case 'overview':    return renderOverviewPanel();
    case 'orders':      return renderOrdersPanel();
    case 'addresses':   return renderAddressesPanel();
    case 'preferences': return renderPreferencesPanel();
    default:            return renderOverviewPanel();
  }
}

/* ─── 1. Overview Panel ──────────────────────────────────────── */
function renderOverviewPanel() {
  const currentOrder = ACCOUNT_DATA.orders.find(o => o.status === 'preparing') || ACCOUNT_DATA.orders[0];

  const recentRowsHtml = ACCOUNT_DATA.orders.map(order => `
    <tr>
      <td style="font-weight: 600;">#${order.ref}</td>
      <td style="color: var(--text-secondary);">${order.date}</td>
      <td>
        <span class="status-pill ${order.status}">${order.statusLabel}</span>
      </td>
      <td style="font-family: var(--font-serif); font-size: 16px;">BDT ${order.total.toLocaleString()}</td>
      <td style="text-align: right;">
        <a href="tracking.html?ref=${order.ref}" style="color: var(--accent-cyan); text-decoration: none; font-size: 12px; font-weight: 500;">VIEW ORDER &rarr;</a>
      </td>
    </tr>
  `).join('');

  return `
    <!-- CARD 1: CURRENT ORDER -->
    <div class="account-card">
      <div class="account-card-title">YOUR CURRENT ORDER</div>

      <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid var(--border-subtle); margin-bottom: 20px;">
        <div>
          <div style="font-family: var(--font-serif); font-size: 24px; color: var(--text-primary); font-weight: 500;">Order #${currentOrder.ref}</div>
          <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-secondary); margin-top: 4px;">Expected ${currentOrder.expectedDate}</div>
        </div>
        <span class="status-pill ${currentOrder.status}">${currentOrder.statusLabel}</span>
      </div>

      <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 24px;">
        <img src="${currentOrder.items[0].image}" alt="${currentOrder.items[0].name}" style="width: 64px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); background: var(--bg-main);" />
        <div>
          <div style="font-family: var(--font-serif); font-size: 18px; color: var(--text-primary);">${currentOrder.items[0].name}</div>
          <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-secondary); margin-top: 4px;">${currentOrder.items[0].variant} &middot; Qty ${currentOrder.items[0].qty}</div>
          <div style="font-family: var(--font-body); font-size: 14px; color: var(--text-primary); margin-top: 4px;">BDT ${currentOrder.items[0].price.toLocaleString()}</div>
        </div>
      </div>

      <div style="display: flex; justify-content: flex-end;">
        <a href="tracking.html?ref=${currentOrder.ref}" class="btn-primary-commerce" style="padding: 12px 24px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">TRACK ORDER &rarr;</a>
      </div>
    </div>

    <!-- CARD 2: RECENT ORDERS -->
    <div class="account-card">
      <div class="account-card-title">RECENT ORDERS</div>
      <div class="account-table-wrapper">
        <table class="account-table">
          <thead>
            <tr>
              <th>ORDER</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>TOTAL</th>
              <th style="text-align: right;">ACTION</th>
            </tr>
          </thead>
          <tbody>
            ${recentRowsHtml}
          </tbody>
        </table>
      </div>
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

  const rowsHtml = filteredOrders.length > 0 ? filteredOrders.map(order => `
    <tr>
      <td style="font-weight: 600;">#${order.ref}</td>
      <td style="color: var(--text-secondary);">${order.date}</td>
      <td>
        <span class="status-pill ${order.status}">${order.statusLabel}</span>
      </td>
      <td style="font-family: var(--font-serif); font-size: 16px;">BDT ${order.total.toLocaleString()}</td>
      <td style="text-align: right;">
        <a href="tracking.html?ref=${order.ref}" style="color: var(--accent-cyan); text-decoration: none; font-size: 12px; font-weight: 500;">TRACK &rarr;</a>
      </td>
    </tr>
  `).join('') : `
    <tr>
      <td colspan="5" style="text-align: center; padding: 32px; color: var(--text-secondary);">No ${activeOrderFilter.toLowerCase()} orders found.</td>
    </tr>
  `;

  return `
    <div class="account-card">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div>
          <div class="account-card-title" style="margin-bottom: 4px;">YOUR ORDERS</div>
          <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-secondary);">View your purchases and track their progress.</div>
        </div>

        <div class="preference-chips">
          ${filterChipsHtml}
        </div>
      </div>

      <div class="account-table-wrapper">
        <table class="account-table">
          <thead>
            <tr>
              <th>ORDER</th>
              <th>DATE</th>
              <th>STATUS</th>
              <th>TOTAL</th>
              <th style="text-align: right;">ACTION</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

window.setOrderFilter = function(filter) {
  activeOrderFilter = filter;
  renderAccountPage();
};

/* ─── 3. Addresses Panel ─────────────────────────────────────── */
function renderAddressesPanel() {
  const addressCardsHtml = ACCOUNT_DATA.addresses.map(addr => `
    <div class="address-card ${addr.isDefault ? 'default' : ''}">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary);">${addr.tag}</span>
        ${addr.isDefault ? '<span class="status-pill preparing" style="font-size: 10px; padding: 2px 8px;">DEFAULT</span>' : ''}
      </div>

      <div style="font-family: var(--font-body); font-size: 14px; color: var(--text-primary); line-height: 1.6;">
        <strong style="color: #F5F7FA;">${addr.name}</strong><br>
        ${addr.address}<br>
        ${addr.city} ${addr.postcode}<br>
        <span style="color: var(--text-secondary); font-size: 13px;">${addr.phone}</span>
      </div>

      <div style="display: flex; gap: 16px; margin-top: 8px; border-top: 1px solid var(--border-subtle); padding-top: 12px;">
        <button style="background: none; border: none; color: var(--accent-cyan); font-family: var(--font-body); font-size: 12px; cursor: pointer; padding: 0;" onclick="alert('Editing address ${addr.id}')">EDIT</button>
        ${!addr.isDefault ? `<button style="background: none; border: none; color: var(--accent-pink); font-family: var(--font-body); font-size: 12px; cursor: pointer; padding: 0;" onclick="deleteAddress('${addr.id}')">REMOVE</button>` : ''}
      </div>
    </div>
  `).join('');

  return `
    <div class="account-card">
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div>
          <div class="account-card-title" style="margin-bottom: 4px;">DELIVERY ADDRESSES</div>
          <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-secondary);">Manage your saved shipping addresses.</div>
        </div>

        <button class="btn-primary-commerce" style="padding: 10px 20px; font-size: 12px;" onclick="openAddAddressModal()">+ ADD NEW ADDRESS</button>
      </div>

      <div class="addresses-grid">
        ${addressCardsHtml}
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
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">TAG (E.G. HOME, WORK)</label>
          <input type="text" id="newAddrTag" class="checkout-input" placeholder="HOME" required style="width: 100%;" />
        </div>
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">FULL NAME</label>
          <input type="text" id="newAddrName" class="checkout-input" value="${ACCOUNT_DATA.user.name}" required style="width: 100%;" />
        </div>
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">STREET ADDRESS</label>
          <input type="text" id="newAddrStreet" class="checkout-input" placeholder="House / Road / Block" required style="width: 100%;" />
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
          <div>
            <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">CITY</label>
            <input type="text" id="newAddrCity" class="checkout-input" value="Dhaka" required style="width: 100%;" />
          </div>
          <div>
            <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; margin-bottom: 4px;">POSTCODE</label>
            <input type="text" id="newAddrPostcode" class="checkout-input" placeholder="1212" required style="width: 100%;" />
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
};

window.submitNewAddress = function(e) {
  e.preventDefault();
  const tag = document.getElementById('newAddrTag')?.value || 'HOME';
  const name = document.getElementById('newAddrName')?.value || ACCOUNT_DATA.user.name;
  const street = document.getElementById('newAddrStreet')?.value;
  const city = document.getElementById('newAddrCity')?.value || 'Dhaka';
  const postcode = document.getElementById('newAddrPostcode')?.value || '1205';

  ACCOUNT_DATA.addresses.push({
    id: `addr-${Date.now()}`,
    tag: tag.toUpperCase(),
    isDefault: false,
    name,
    address: street,
    city,
    postcode,
    phone: ACCOUNT_DATA.user.phone
  });

  document.getElementById('addAddressModal')?.remove();
  renderAccountPage();
};

/* ─── 4. Style & Fit Profile Panel ──────────────────────── */
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
      <span class="style-signal-name">${sig.name}</span>
      <span class="style-signal-badge">${sig.level}</span>
    </div>
  `).join('') : '<div style="color: var(--text-secondary); font-size: 13px;">No signals collected yet.</div>';

  return `
    <!-- CARD 1: EXPLICIT PREFERENCES -->
    <div class="account-card">
      <div class="account-card-title">YOUR STYLE & FIT PROFILE</div>
      <div style="font-family: var(--font-body); font-size: 13px; color: var(--text-secondary); margin-bottom: 24px;">Explicit preferences guide our AI recommendations. You are always in control.</div>

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
        <span class="preference-label">FAVORITE DESIGNERS</span>
        <div class="preference-chips">${brandChipsHtml}</div>
      </div>
    </div>

    <!-- CARD 2: AI STYLE PROFILE & SIGNALS (Implicit) -->
    <div class="account-card" style="background: rgba(0, 200, 255, 0.03); border-color: rgba(0, 200, 255, 0.16);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <div class="account-card-title" style="color: var(--accent-cyan); margin: 0;">AI INFERRED PROFILE</div>
        <span style="font-family: var(--font-body); font-size: 11px; color: var(--text-secondary);">IMPLICIT SIGNALS</span>
      </div>

      <p style="font-family: var(--font-body); font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px;">
        Based on your previous browsing and search queries (e.g., "warm for a cool evening in Dhaka"), we've learned that you often prefer minimal silhouettes and relaxed fits for city evening wear.
      </p>

      <div class="style-signal-list">
        ${signalsHtml}
      </div>
    </div>

    <!-- CARD 3: DATA TRANSPARENCY & CONTROLS -->
    <div class="account-card" style="background: rgba(255, 0, 85, 0.03); border-color: rgba(255, 0, 85, 0.16);">
      <div class="account-card-title" style="color: var(--accent-pink);">DATA TRANSPARENCY</div>
      <p style="font-family: var(--font-body); font-size: 14px; line-height: 1.6; color: var(--text-secondary); margin-bottom: 20px;">
        nexCommerce uses your explicit preferences and implicit search signals to tailor product recommendations and discovery results. 
        We do not sell this data. You can clear your AI profile at any time, which will reset your discovery experience to the default catalog.
      </p>
      
      <button class="btn-secondary-action" style="color: var(--accent-pink); border-color: rgba(255, 0, 85, 0.4);" onclick="clearAiProfile()">CLEAR AI PROFILE DATA</button>
    </div>
  `;
}

window.clearAiProfile = function() {
  if(confirm("Are you sure you want to clear your AI Profile? This will reset your recommendations.")) {
    ACCOUNT_DATA.preferences.style = '';
    ACCOUNT_DATA.preferences.fit = '';
    ACCOUNT_DATA.preferences.color = '';
    ACCOUNT_DATA.preferences.brand = '';
    ACCOUNT_DATA.aiSignals = [];
    renderAccountPage();
    alert("AI Profile data cleared successfully.");
  }
};

window.setPreference = function(key, val) {
  ACCOUNT_DATA.preferences[key] = val;
  renderAccountPage();
};

/* ─── Signed Out State ───────────────────────────────────────── */
function renderSignedOutState(container) {
  container.innerHTML = `
    <!-- DEV HARNESS BAR -->
    <div class="dev-state-harness">
      <span>⚙ DEV STATE SWITCHER:</span>
      <select onchange="changeDevAuthState(this.value)">
        <option value="signed_out" selected>Signed Out (Sign-In Screen)</option>
        <option value="signed_in">Signed In (With Orders & Profile)</option>
        <option value="empty_account">Signed In (Empty State &mdash; No Orders)</option>
      </select>
    </div>

    <div style="min-height: 60vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center;">
      <span class="tracking-meta" style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;">ACCOUNT</span>
      <h1 class="account-title" style="margin-top: 8px; margin-bottom: 12px;">WELCOME BACK</h1>
      <p style="color: var(--text-secondary); margin-bottom: 24px; font-size: 14px;">Sign in to view your orders, saved details, and preferences.</p>

      <form onsubmit="handleSignInSubmit(event)" style="width: 100%; max-width: 360px; display: flex; flex-direction: column; gap: 16px;">
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; text-align: left; margin-bottom: 6px;">PHONE NUMBER</label>
          <input type="tel" class="checkout-input" placeholder="+880 1700 000000" required style="width: 100%; text-align: left;" />
        </div>
        <div>
          <label style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--text-secondary); display: block; text-align: left; margin-bottom: 6px;">PASSWORD</label>
          <input type="password" class="checkout-input" placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;" required style="width: 100%; text-align: left;" />
        </div>

        <button type="submit" class="btn-primary-commerce" style="height: 52px; margin-top: 8px;">SIGN IN</button>
      </form>

      <a href="index.html" style="font-family: var(--font-body); font-size: 13px; color: var(--accent-cyan); text-decoration: none; margin-top: 24px;">CONTINUE AS GUEST &rarr;</a>
    </div>
  `;
}

window.handleSignInSubmit = function(e) {
  e.preventDefault();
  changeDevAuthState('signed_in');
};

/* ─── Empty Account State ────────────────────────────────────── */
function renderEmptyAccountState(container) {
  container.innerHTML = `
    <!-- DEV HARNESS BAR -->
    <div class="dev-state-harness">
      <span>⚙ DEV STATE SWITCHER:</span>
      <select onchange="changeDevAuthState(this.value)">
        <option value="empty_account" selected>Signed In (Empty State &mdash; No Orders)</option>
        <option value="signed_in">Signed In (With Orders & Profile)</option>
        <option value="signed_out">Signed Out (Sign-In Screen)</option>
      </select>
    </div>

    <!-- ACCOUNT HEADER -->
    <div class="account-header-block">
      <span class="tracking-meta" style="font-size: 11px; font-weight: 600; letter-spacing: 0.16em; text-transform: uppercase;">ACCOUNT</span>
      <h1 class="account-title">Welcome back, ${ACCOUNT_DATA.user.name}</h1>
      <p class="account-subtitle">Manage your orders, delivery details, and preferences.</p>
    </div>

    <div style="min-height: 50vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; text-align: center; background: #0B2147; border: 1px solid rgba(255,255,255,0.08); border-radius: 14px;">
      <h2 style="font-family: var(--font-serif); font-size: 32px; font-weight: 500; color: var(--text-primary); margin-bottom: 12px;">YOUR SHOPPING JOURNEY STARTS HERE</h2>
      <p style="font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); max-width: 420px; line-height: 1.6; margin-bottom: 28px;">
        Your orders and delivery updates will appear here after your first purchase.
      </p>

      <a href="category.html" class="btn-primary-commerce" style="padding: 14px 32px; text-decoration: none;">START SHOPPING</a>
    </div>
  `;
}
