/* nexCommerce Shopping Bag & Cart State Manager */
/* TODO: Wire to real Auth & Orders API */

function escapeHtml(str) {
  return String(str || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function _resolvePage(page) {
  const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
  if (page === 'index.html') return isSubpage ? '../index.html' : 'index.html';
  return isSubpage ? page : 'pages/' + page;
}
window._resolvePage = _resolvePage;

// ─── Cart-page Coupon Engine ────────────────────────────────────────────────
// TODO: Wire to real promotions API
const CART_PROMO_CODES = {
  'NEX10':    { label: 'NEX10 — 10% off',         type: 'percent',  value: 10 },
  'LUXURY20': { label: 'LUXURY20 — 20% off',       type: 'percent',  value: 20 },
  'FREESHIP': { label: 'FREESHIP — Free Shipping',  type: 'shipping', value: 0  }
};
let cartActiveCoupon = null;

function cartApplyCoupon() {
  const input    = document.getElementById('cart-coupon-input');
  const feedback = document.getElementById('cart-coupon-feedback');
  if (!input) return;
  const code = (input.value || '').trim().toUpperCase();
  if (!code) return;
  const promo = CART_PROMO_CODES[code];
  if (!promo) {
    if (feedback) { feedback.textContent = "This code isn't valid or has expired."; feedback.style.display = 'block'; feedback.style.color = '#FF5252'; }
    input.style.borderColor = '#FF5252';
    return;
  }
  cartActiveCoupon = { code, ...promo };
  input.value = '';
  input.style.borderColor = '';
  if (feedback) feedback.style.display = 'none';
  const inputRow  = document.getElementById('cart-coupon-input-row');
  const pillWrap  = document.getElementById('cart-coupon-pill-wrap');
  const pillLabel = document.getElementById('cart-coupon-pill-label');
  if (inputRow)  inputRow.style.display  = 'none';
  if (pillWrap)  pillWrap.style.display  = 'flex';
  if (pillLabel) pillLabel.textContent   = promo.label;
  nexCart.renderPage();
}

function cartRemoveCoupon() {
  cartActiveCoupon = null;
  const inputRow = document.getElementById('cart-coupon-input-row');
  const pillWrap = document.getElementById('cart-coupon-pill-wrap');
  const inp      = document.getElementById('cart-coupon-input');
  if (inputRow) inputRow.style.display = 'flex';
  if (pillWrap) pillWrap.style.display = 'none';
  if (inp)      { inp.value = ''; inp.style.borderColor = ''; }
  nexCart.renderPage();
}

const CartState = {
  items: [],

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.updateBadge();
    this.renderPage();
    this.renderMiniCart();
  },

  loadFromStorage() {
    try {
      const raw = localStorage.getItem('nex_cart');
      this.items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(this.items)) this.items = [];
    } catch (e) {
      console.warn('Invalid cart storage data, resetting cart.', e);
      this.items = [];
    }
  },

  updateBadge() {
    const count = this.getTotalCount();
    const badges = document.querySelectorAll('.bag-count-badge, #headerCartCount, #mobileCartCount, .nav-cart-badge, [data-cart-count]');
    badges.forEach(b => {
      b.textContent = count;
    });
  },

  save() {
    try {
      localStorage.setItem('nex_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
    this.updateBadge();
    this.renderPage();
    this.renderMiniCart();
  },

  addItem(product, quantity = 1, variant = 'Default') {
    const existing = this.items.find(i => i.id === product.id && i.variant === variant);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category || 'PRODUCT',
        variant: variant,
        quantity: quantity
      });
    }
    this.save();
  },

  updateQuantity(id, variant, delta) {
    const item = this.items.find(i => i.id === id && i.variant === variant);
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) {
      this.items = this.items.filter(i => !(i.id === id && i.variant === variant));
    }
    this.save();
  },

  removeItem(id, variant) {
    this.items = this.items.filter(i => !(i.id === id && i.variant === variant));
    this.save();
  },

  getTotal() {
    return this.items.reduce((sum, i) => sum + (Number(i.price) || 0) * (parseInt(i.quantity || i.qty, 10) || 1), 0);
  },

  getTotalCount() {
    return this.items.reduce((sum, i) => sum + (parseInt(i.quantity || i.qty, 10) || 1), 0);
  },

  bindEvents() {
    this.updateBadge();
    
    // Bind open trigger
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cart-trigger, .cart-trigger, #headerCartLink');
      if (trigger) {
        e.preventDefault();
        this.openMiniCart();
      }
    });

    // Bind close triggers
    document.addEventListener('click', (e) => {
      if (e.target.closest('#minicartCloseBtn') || e.target.closest('#nexMiniCartOverlay')) {
        this.closeMiniCart();
      }
    });

    // Stop Lenis from intercepting scroll inside the mini cart drawer.
    // Use capture phase so we get the event BEFORE Lenis does.
    const bindDrawerScroll = () => {
      const drawer = document.getElementById('nexMiniCartDrawer');
      if (drawer) {
        drawer.addEventListener('wheel', (e) => {
          e.stopPropagation();
          // Manually scroll the body element
          const body = document.getElementById('minicartBody');
          if (body) body.scrollTop += e.deltaY;
        }, { capture: true });
      }
    };
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', bindDrawerScroll, { once: true });
    } else {
      bindDrawerScroll();
    }
  },

  openMiniCart() {
    const drawer = document.getElementById('nexMiniCartDrawer');
    const overlay = document.getElementById('nexMiniCartOverlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('visible');
      // Stop Lenis so native scroll works inside the drawer
      if (window._nexLenis) window._nexLenis.stop();
    }
  },

  closeMiniCart() {
    const drawer = document.getElementById('nexMiniCartDrawer');
    const overlay = document.getElementById('nexMiniCartOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('visible');
      // Resume Lenis page scroll
      if (window._nexLenis) window._nexLenis.start();
    }
  },

  updateBadge() {
    const count = this.getTotalCount();
    const badges = document.querySelectorAll('#headerCartCount, #mobileCartCount, .bag-count-badge, #header-bag-count, #bag-count, .bag-badge, .nav-cart-badge');
    badges.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  /* \u2500\u2500\u2500 Full cart page renderer \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  renderPage() {
    this.updateBadge();

    const itemCountEl = document.getElementById('cartItemCount');
    const cartGrid    = document.getElementById('cartGrid');
    const emptyArea   = document.getElementById('cartEmptyArea');
    const itemsList   = document.getElementById('cartItemsList');
    const summaryArea = document.getElementById('cartSummaryArea');

    // Not on cart page
    if (!cartGrid) return;

    const count = this.getTotalCount();
    if (itemCountEl) {
      itemCountEl.textContent = count === 1 ? '1 piece selected' : count + ' pieces selected';
    }

    if (this.items.length === 0) {
      cartGrid.style.display  = 'none';
      emptyArea.style.display = 'flex';
      return;
    }

    cartGrid.style.display  = '';
    emptyArea.style.display = 'none';

    /* Left column: shipping bar + item rows */
    var FREE_SHIPPING_THRESHOLD = 20000;
    var total = this.getTotal();
    var diff  = FREE_SHIPPING_THRESHOLD - total;

    var shippingBar = diff <= 0
      ? '<div class="cart-shipping-bar unlocked">&#10003; Complimentary Express Delivery Unlocked</div>'
      : '<div class="cart-shipping-bar">Add <strong>BDT ' + diff.toLocaleString() + '</strong> more for Complimentary Express Delivery</div>';

    var self = this;
    itemsList.innerHTML = shippingBar + this.items.map(function(item) {
      return '<div class="cart-item-row" data-id="' + item.id + '" data-variant="' + encodeURIComponent(item.variant || 'Standard') + '">'
        + '<div class="cart-item-img-wrap">'
        + '<img src="' + item.image + '" alt="' + escapeHtml(item.name) + '" class="cart-item-img" style="width:100%;height:100%;object-fit:cover;">'
        + '</div>'
        + '<div class="cart-item-info">'
        + '<p class="cart-item-category">' + escapeHtml(item.category || 'PRODUCT') + '</p>'
        + '<h3 class="cart-item-title">' + escapeHtml(item.name) + '</h3>'
        + '<p class="cart-item-variant">' + escapeHtml(item.variant || 'Standard') + '</p>'
        + '<div class="cart-stepper">'
        + '<button class="stepper-btn" data-action="dec" aria-label="Decrease quantity">&minus;</button>'
        + '<span class="stepper-val">' + item.quantity + '</span>'
        + '<button class="stepper-btn" data-action="inc" aria-label="Increase quantity">+</button>'
        + '</div>'
        + '</div>'
        + '<div class="cart-item-right">'
        + '<p class="cart-item-price">BDT ' + (item.price * item.quantity).toLocaleString() + '</p>'
        + '<button class="cart-item-remove" data-action="remove" aria-label="Remove item">&times;</button>'
        + '</div>'
        + '</div>';
    }).join('');

    // Attach row listeners
    itemsList.querySelectorAll('.cart-item-row').forEach(function(row) {
      var id      = row.getAttribute('data-id');
      var variant = decodeURIComponent(row.getAttribute('data-variant'));
      row.querySelector('[data-action="dec"]').addEventListener('click', function() { self.updateQuantity(id, variant, -1); });
      row.querySelector('[data-action="inc"]').addEventListener('click', function() { self.updateQuantity(id, variant, 1); });
      row.querySelector('[data-action="remove"]').addEventListener('click', function() { self.removeItem(id, variant); });
    });

    /* Right column: order summary (coupon-aware) */
    var discountAmt = 0;
    if (cartActiveCoupon && cartActiveCoupon.type === 'percent') {
      discountAmt = Math.round(total * cartActiveCoupon.value / 100);
    }
    var freeShipCoupon  = cartActiveCoupon && cartActiveCoupon.type === 'shipping';
    var deliveryCost    = (total >= FREE_SHIPPING_THRESHOLD || freeShipCoupon) ? 0 : 150;
    var discountedTotal = total - discountAmt;
    var grandTotal      = discountedTotal + deliveryCost;

    var deliveryHtml = deliveryCost === 0
      ? '<span class="cart-free-tag" style="color:#00E676;font-weight:600;">FREE</span>'
      : 'BDT ' + deliveryCost.toLocaleString();

    // Coupon pill state (persist across re-renders)
    var pillDisplay    = cartActiveCoupon ? 'flex'   : 'none';
    var inputDisplay   = cartActiveCoupon ? 'none'   : 'flex';
    var pillLabelText  = cartActiveCoupon ? cartActiveCoupon.label : '';
    var discountRowHtml = discountAmt > 0
      ? '<div class="cart-summary-row" style="color:#00E676;"><span>' + (cartActiveCoupon ? cartActiveCoupon.label : 'Discount') + '</span><span>\u2212BDT ' + discountAmt.toLocaleString() + '</span></div>'
      : '';

    summaryArea.innerHTML = '<div class="cart-summary-card">'
      + '<h2 class="cart-summary-title">Order Summary</h2>'

      // Coupon box
      + '<div class="coupon-box" style="margin-bottom:14px;">'
      + '<div id="cart-coupon-input-row" style="display:' + inputDisplay + '; gap:8px; align-items:stretch;">'
      + '<input type="text" id="cart-coupon-input" class="coupon-input" placeholder="Promo or gift code" maxlength="20" autocomplete="off" onkeydown="if(event.key===\'Enter\') cartApplyCoupon()">'
      + '<button class="coupon-apply-btn" onclick="cartApplyCoupon()">Apply</button>'
      + '</div>'
      + '<div id="cart-coupon-feedback" style="font-size:11px; margin-top:6px; display:none;"></div>'
      + '<div id="cart-coupon-pill-wrap" style="display:' + pillDisplay + '; margin-top:8px; align-items:center; gap:8px;">'
      + '<span class="coupon-pill" id="cart-coupon-pill-label">' + pillLabelText + '</span>'
      + '<button class="coupon-remove-btn" onclick="cartRemoveCoupon()" aria-label="Remove promo code">&times;</button>'
      + '</div>'
      + '</div>'

      // Totals
      + '<div class="cart-summary-row">'
      + '<span>Subtotal (' + count + ' ' + (count === 1 ? 'item' : 'items') + ')</span>'
      + '<span>BDT ' + total.toLocaleString() + '</span>'
      + '</div>'
      + discountRowHtml
      + '<div class="cart-summary-row">'
      + '<span>Estimated Shipping</span>'
      + '<span>' + deliveryHtml + '</span>'
      + '</div>'
      + '<div class="cart-summary-divider"></div>'
      + '<div class="cart-summary-row cart-summary-total">'
      + '<span>Total Due</span>'
      + '<span style="font-weight:700;">BDT ' + grandTotal.toLocaleString() + '</span>'
      + '</div>'
      + '<a href="checkout.html" class="btn-primary-commerce cart-checkout-btn" style="display:flex;align-items:center;justify-content:center;height:48px;margin-top:16px;text-decoration:none;">PROCEED TO CHECKOUT &rarr;</a>'
      + '<div class="cart-summary-meta" style="margin-top:16px;font-size:12px;color:var(--text-secondary);display:flex;flex-direction:column;gap:6px;">'
      + '<p>&#10003; 30-Day Complimentary Returns</p>'
      + '<p>&#10003; Authentic Direct Sourced Luxury</p>'
      + '</div>'
      + '</div>';

    if (window.lucide) window.lucide.createIcons();
  },

  /* ─── Mini Cart Renderer ─────────────────────────────────────────────────── */
  renderMiniCart() {
    const mcBody = document.getElementById('minicartBody');
    const mcSubtotal = document.getElementById('minicartSubtotalValue');
    const mcFooter = document.getElementById('minicartFooter');

    if (!mcBody) return; // Not injected on this page

    const count = this.getTotalCount();
    const total = this.getTotal();

    if (count === 0) {
      mcBody.innerHTML = '<div class="minicart-empty">'
        + '<h3>Your bag is empty.</h3>'
        + '<p>Discover pieces selected around how you want to shop.</p>'
        + '<a href="' + _resolvePage('discovery.html') + '" class="btn-primary-commerce" onclick="nexCart.closeMiniCart()">EXPLORE DISCOVERY &rarr;</a>'
        + '</div>';
      if (mcFooter) mcFooter.style.display = 'none';
      return;
    }

    if (mcFooter) {
      mcFooter.style.display = 'block';
      if (mcSubtotal) mcSubtotal.textContent = 'BDT ' + total.toLocaleString();
    }

    const self = this;
    mcBody.innerHTML = this.items.map(function(item) {
      return '<div class="mc-item-row" data-id="' + item.id + '" data-variant="' + encodeURIComponent(item.variant) + '">'
        + '<img src="' + item.image + '" alt="' + item.name + '" class="mc-item-img">'
        + '<div class="mc-item-details">'
        + '<div class="mc-item-title">' + item.name + '</div>'
        + '<div class="mc-item-variant">' + item.variant + ' &middot; Qty: ' + item.quantity + '</div>'
        + '<div class="mc-item-bottom">'
        + '<div class="mc-item-price">BDT ' + (item.price * item.quantity).toLocaleString() + '</div>'
        + '<button class="mc-remove-btn" data-action="remove">Remove</button>'
        + '</div>'
        + '</div>'
        + '</div>';
    }).join('');

    // Attach listeners
    mcBody.querySelectorAll('.mc-item-row').forEach(function(row) {
      const id = row.getAttribute('data-id');
      const variant = decodeURIComponent(row.getAttribute('data-variant'));
      row.querySelector('[data-action="remove"]').addEventListener('click', function() {
        self.removeItem(id, variant);
      });
    });
  }
};

// Global reference
window.nexCart = CartState;

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', function() { CartState.init(); });
} else {
  CartState.init();
}
