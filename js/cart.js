/* nexCommerce Shopping Bag & Cart State Manager */
import { renderTrustSignals } from './components.js';

export const CartState = {
  items: [],

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.updateUI();
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
    this.updateUI();
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
        variant: variant,
        quantity: quantity
      });
    }
    this.save();
    this.openDrawer();
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

  bindEvents() {
    const trigger = document.getElementById('bag-trigger');
    if (trigger) {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDrawer();
      });
    }

    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      const closeBtn = drawer.querySelector('.drawer-close-btn');
      const backdrop = drawer.querySelector('.drawer-backdrop');
      if (closeBtn) closeBtn.addEventListener('click', () => this.closeDrawer());
      if (backdrop) backdrop.addEventListener('click', () => this.closeDrawer());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer && drawer.classList.contains('active')) {
        this.closeDrawer();
      }
    });
  },

  openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      drawer.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  },

  closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    if (drawer) {
      drawer.classList.remove('active');
      document.body.style.overflow = '';
    }
  },

  updateUI() {
    const totalCount = this.items.reduce((sum, i) => sum + i.quantity, 0);
    const countEl = document.getElementById('bag-count');
    if (countEl) countEl.textContent = totalCount;

    const drawerBody = document.getElementById('cart-drawer-body');
    const drawerFooter = document.getElementById('cart-drawer-footer');
    const progressEl = document.getElementById('shipping-progress');

    if (!drawerBody) return;

    if (this.items.length === 0) {
      drawerBody.innerHTML = `
        <div class="cart-empty-state">
          <p class="empty-title">Your bag is waiting.</p>
          <p class="empty-subtext">Discover something you'll love.</p>
          <button class="btn-primary" onclick="window.nexCart.closeDrawer()" style="margin-top:20px;">Continue Shopping</button>
        </div>
      `;
      if (drawerFooter) drawerFooter.style.display = 'none';
      if (progressEl) progressEl.style.display = 'none';
      return;
    }

    if (drawerFooter) drawerFooter.style.display = 'block';
    if (progressEl) {
      progressEl.style.display = 'block';
      const freeShippingThreshold = 10000;
      const currentTotal = this.getTotal();
      const diff = freeShippingThreshold - currentTotal;
      if (diff <= 0) {
        progressEl.innerHTML = `<span class="shipping-unlocked">&#10003; Complimentary Express Delivery Unlocked</span>`;
      } else {
        progressEl.innerHTML = `Add <strong>৳ ${diff.toLocaleString()}</strong> for Complimentary Express Delivery`;
      }
    }

    drawerBody.innerHTML = this.items.map(item => `
      <div class="cart-item-row" data-id="${item.id}" data-variant="${item.variant}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-info">
          <h4 class="cart-item-title">${item.name}</h4>
          <p class="cart-item-variant">Variant: ${item.variant}</p>
          <p class="cart-item-price">৳ ${(item.price * item.quantity).toLocaleString()}</p>
          <div class="cart-stepper">
            <button class="stepper-btn" data-action="dec" aria-label="Decrease quantity">-</button>
            <span class="stepper-val">${item.quantity}</span>
            <button class="stepper-btn" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-action="remove" aria-label="Remove item">&times;</button>
      </div>
    `).join('');

    // Attach row listeners
    drawerBody.querySelectorAll('.cart-item-row').forEach(row => {
      const id = row.getAttribute('data-id');
      const variant = row.getAttribute('data-variant');
      row.querySelector('[data-action="dec"]').addEventListener('click', () => this.updateQuantity(id, variant, -1));
      row.querySelector('[data-action="inc"]').addEventListener('click', () => this.updateQuantity(id, variant, 1));
      row.querySelector('[data-action="remove"]').addEventListener('click', () => this.removeItem(id, variant));
    });

    const totalEl = document.getElementById('cart-subtotal');
    if (totalEl) totalEl.textContent = `৳ ${this.getTotal().toLocaleString()}`;
  }
};

// Global reference for onclick fallbacks
window.nexCart = CartState;

// Initialize on DOM Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => CartState.init());
} else {
  CartState.init();
}
