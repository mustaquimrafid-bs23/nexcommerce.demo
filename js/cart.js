/* nexCommerce Shopping Bag & Cart State Manager */
/* TODO: Wire to real Auth & Orders API */

const CartState = {
  items: [],

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.renderPage();
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

  save() {
    try {
      localStorage.setItem('nex_cart', JSON.stringify(this.items));
    } catch (e) {
      console.error('Failed to save cart to storage', e);
    }
    this.renderPage();
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
    return this.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  },

  getTotalCount() {
    return this.items.reduce((sum, i) => sum + i.quantity, 0);
  },

  bindEvents() {
    this.updateBadge();
  },

  updateBadge() {
    const count = this.getTotalCount();
    const badges = document.querySelectorAll('#header-bag-count, #bag-count, .bag-badge');
    badges.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? '' : 'none';
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
    var FREE_SHIPPING_THRESHOLD = 10000;
    var total = this.getTotal();
    var diff  = FREE_SHIPPING_THRESHOLD - total;

    var shippingBar = diff <= 0
      ? '<div class="cart-shipping-bar unlocked">&#10003; Complimentary Express Delivery Unlocked</div>'
      : '<div class="cart-shipping-bar">Add <strong>BDT ' + diff.toLocaleString() + '</strong> more for Complimentary Express Delivery</div>';

    var self = this;
    itemsList.innerHTML = shippingBar + this.items.map(function(item) {
      return '<div class="cart-item-row" data-id="' + item.id + '" data-variant="' + encodeURIComponent(item.variant) + '">'
        + '<div class="cart-item-img-wrap">'
        + '<img src="' + item.image + '" alt="' + item.name + '" class="cart-item-img">'
        + '</div>'
        + '<div class="cart-item-info">'
        + '<p class="cart-item-category">' + (item.category || 'PRODUCT') + '</p>'
        + '<h3 class="cart-item-title">' + item.name + '</h3>'
        + '<p class="cart-item-variant">' + item.variant + '</p>'
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

    /* Right column: order summary */
    var deliveryCost = total >= FREE_SHIPPING_THRESHOLD ? 0 : 500;
    var grandTotal   = total + deliveryCost;
    var deliveryHtml = deliveryCost === 0
      ? '<span class="cart-free-tag">Free</span>'
      : 'BDT ' + deliveryCost.toLocaleString();

    summaryArea.innerHTML = '<div class="cart-summary-card">'
      + '<h2 class="cart-summary-title">Order Summary</h2>'
      + '<div class="cart-summary-row">'
      + '<span>Subtotal (' + count + ' ' + (count === 1 ? 'item' : 'items') + ')</span>'
      + '<span>BDT ' + total.toLocaleString() + '</span>'
      + '</div>'
      + '<div class="cart-summary-row">'
      + '<span>Delivery</span>'
      + '<span>' + deliveryHtml + '</span>'
      + '</div>'
      + '<div class="cart-summary-divider"></div>'
      + '<div class="cart-summary-row cart-summary-total">'
      + '<span>Total</span>'
      + '<span>BDT ' + grandTotal.toLocaleString() + '</span>'
      + '</div>'
      + '<a href="checkout.html" class="btn-primary-commerce cart-checkout-btn">PROCEED TO CHECKOUT &rarr;</a>'
      + '<div class="cart-summary-meta">'
      + '<p>Free returns within 30 days.</p>'
      + '<p>Secure payment &mdash; SSL encrypted.</p>'
      + '</div>'
      + '</div>';
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
