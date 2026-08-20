/* nexCommerce Shopping Bag & Cart State Manager (Modernized with 4 Motion Standards) */

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
    if (feedback) { 
      feedback.textContent = "This code isn't valid or has expired."; 
      feedback.style.display = 'block'; 
      feedback.style.color = '#FB7185'; 
    }
    input.style.borderColor = '#FB7185';
    return;
  }
  cartActiveCoupon = { code, ...promo };
  input.value = '';
  input.style.borderColor = '';
  if (feedback) feedback.style.display = 'none';
  nexCart.renderPage();
}
window.cartApplyCoupon = cartApplyCoupon;

function cartRemoveCoupon() {
  cartActiveCoupon = null;
  nexCart.renderPage();
}
window.cartRemoveCoupon = cartRemoveCoupon;

// ─── Curated Look Switcher 4 Signature Capsules ──────────────────────────────
const CART_CURATED_LOOKS = [
  {
    id: 'look-0',
    index: 0,
    tabLabel: '01 TAILORING',
    eyebrow: 'COMPLIMENTARY PAIRING · 01 OF 04',
    season: 'ATELIER EDIT · AW26',
    title: 'Architectural Cashmere Layer',
    desc: 'Handcrafted 2-ply Mongolian cashmere with seamless dropped shoulder tailoring for effortless warmth and structure.',
    productId: 'p1',
    productName: 'Architectural Cashmere Sweater',
    price: 185,
    priceFormatted: '€ 185.00',
    lifestyleImg: '../assets/images/lifestyle/hero_sweater_landscape.jpg',
    productThumb: '../assets/images/products/hero_sweater.png',
    category: 'Apparel'
  },
  {
    id: 'look-1',
    index: 1,
    tabLabel: '02 LEATHER',
    eyebrow: 'COMPLIMENTARY PAIRING · 02 OF 04',
    season: 'LEATHER GOODS · SS26',
    title: 'Structured Tuscan Weekender',
    desc: 'Full-grain vegetable-tanned Tuscan calfskin paired with hand-stitched palladium hardware and reinforced base corners.',
    productId: 'p6',
    productName: 'Structured Leather Weekender',
    price: 340,
    priceFormatted: '€ 340.00',
    lifestyleImg: '../assets/images/lifestyle/hero_tote_landscape.jpg',
    productThumb: '../assets/images/products/prod_tote.png',
    category: 'Leather Goods'
  },
  {
    id: 'look-2',
    index: 2,
    tabLabel: '03 ACOUSTICS',
    eyebrow: 'COMPLIMENTARY PAIRING · 03 OF 04',
    season: 'HIGH ACOUSTICS · 2026',
    title: 'Studio Acoustics Headphone GT',
    desc: 'Custom 40mm beryllium drivers enclosed in machined aerospace aluminium for studio-grade acoustic depth and isolation.',
    productId: 'p4',
    productName: 'Studio Acoustics Headphone GT',
    price: 320,
    priceFormatted: '€ 320.00',
    lifestyleImg: '../assets/images/lifestyle/hero_headphone_landscape.jpg',
    productThumb: '../assets/images/products/prod_headphones.png',
    category: 'High Acoustics'
  },
  {
    id: 'look-3',
    index: 3,
    tabLabel: '04 HOROLOGY',
    eyebrow: 'COMPLIMENTARY PAIRING · 04 OF 04',
    season: 'HOROLOGY · 2026',
    title: 'Minimal Titanium Automatic',
    desc: 'Grade 5 satin-brushed titanium case housing an ultra-thin 28,800 vph automatic caliber with 70-hour power reserve.',
    productId: 'p5',
    productName: 'Minimal Titanium Automatic',
    price: 285,
    priceFormatted: '€ 285.00',
    lifestyleImg: '../assets/images/lifestyle/hero_watch_landscape.jpg',
    productThumb: '../assets/images/products/search_watch.png',
    category: 'Horology'
  }
];

// ─── Look Switcher 120fps Controller ─────────────────────────────────────────
const CartLookController = {
  activeLookIndex: 0,
  cycleDuration: 6500, // 6.5s per capsule
  startTime: null,
  rafId: null,
  isPaused: false,
  hasInitialized: false,

  init() {
    if (this.hasInitialized) return;
    const wrap = document.getElementById('cartLookSwitcherWrap');
    if (!wrap) return;
    this.hasInitialized = true;

    this.bindEvents();
    this.renderLook(0);
    this.startCycle();
  },

  bindEvents() {
    const wrap = document.getElementById('cartLookSwitcherWrap');
    if (!wrap) return;

    // Pause on hover / touch
    wrap.addEventListener('mouseenter', () => { this.isPaused = true; });
    wrap.addEventListener('mouseleave', () => { 
      const pauseBtn = document.getElementById('cartSpotlightPauseBtn');
      if (pauseBtn && pauseBtn.getAttribute('aria-pressed') === 'true') return;
      this.isPaused = false; 
    });
    wrap.addEventListener('touchstart', () => { this.isPaused = true; }, { passive: true });

    // Pause toggle button
    const pauseBtn = document.getElementById('cartSpotlightPauseBtn');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => {
        const isCurrentlyPressed = pauseBtn.getAttribute('aria-pressed') === 'true';
        pauseBtn.setAttribute('aria-pressed', String(!isCurrentlyPressed));
        this.isPaused = !isCurrentlyPressed;
        const icon = document.getElementById('cartSpotlightPauseIcon');
        if (icon) {
          icon.setAttribute('data-lucide', !isCurrentlyPressed ? 'play' : 'pause');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // Tab buttons
    const tabs = document.querySelectorAll('.cart-spotlight-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        const idx = parseInt(tab.getAttribute('data-look'), 10);
        if (!isNaN(idx)) {
          this.activeLookIndex = idx;
          this.renderLook(idx);
          this.startTime = performance.now();
        }
      });
    });

    // Quick Add from spotlight
    const addBtn = document.getElementById('cartSpotlightAddBtn');
    const pillAddBtn = document.getElementById('cartPillQuickAddBtn');

    const handleQuickAdd = (e) => {
      e.preventDefault();
      const look = CART_CURATED_LOOKS[this.activeLookIndex];
      if (!look) return;

      CartState.addItem({
        id: look.productId,
        name: look.productName,
        price: look.price,
        image: look.productThumb,
        category: look.category
      }, 1, 'Standard');

      // Tactile button animation
      const targetBtn = e.currentTarget;
      targetBtn.style.transform = 'scale(0.92)';
      setTimeout(() => { targetBtn.style.transform = ''; }, 160);
    };

    if (addBtn) addBtn.addEventListener('click', handleQuickAdd);
    if (pillAddBtn) pillAddBtn.addEventListener('click', handleQuickAdd);
  },

  renderLook(index) {
    const look = CART_CURATED_LOOKS[index];
    if (!look) return;

    // Update Eyebrow, Season, Title, Desc
    const eyebrowEl = document.getElementById('cartSpotlightLookEyebrow');
    const seasonEl  = document.getElementById('cartSpotlightSeason');
    const titleEl   = document.getElementById('cartSpotlightTitle');
    const descEl    = document.getElementById('cartSpotlightDesc');
    const btnTextEl = document.getElementById('cartSpotlightBtnText');
    const imgEl     = document.getElementById('cartSpotlightImg');

    const pillThumb = document.getElementById('cartPillThumb');
    const pillTitle = document.getElementById('cartPillTitle');
    const pillPrice = document.getElementById('cartPillPrice');

    if (eyebrowEl) eyebrowEl.textContent = look.eyebrow;
    if (seasonEl)  seasonEl.textContent  = look.season;
    if (titleEl)   titleEl.textContent   = look.title;
    if (descEl)    descEl.textContent    = look.desc;
    if (btnTextEl) btnTextEl.textContent = `Quick Add · ${look.priceFormatted}`;

    if (imgEl && imgEl.src !== look.lifestyleImg) {
      imgEl.style.opacity = '0.4';
      imgEl.style.transform = 'scale(1.04)';
      setTimeout(() => {
        imgEl.src = look.lifestyleImg;
        imgEl.style.opacity = '1';
        imgEl.style.transform = 'scale(1)';
      }, 140);
    }

    if (pillThumb) pillThumb.src = look.productThumb;
    if (pillTitle) pillTitle.textContent = look.productName;
    if (pillPrice) pillPrice.textContent = look.priceFormatted;

    // Update active tab
    const tabs = document.querySelectorAll('.cart-spotlight-tab');
    tabs.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('active', isActive);
      tab.setAttribute('aria-selected', String(isActive));
    });
  },

  startCycle() {
    this.startTime = performance.now();
    const bar = document.getElementById('cartSpotlightProgressBar');

    const step = (now) => {
      if (!this.isPaused) {
        const elapsed = now - this.startTime;
        const progress = Math.min(1, elapsed / this.cycleDuration);

        if (bar) {
          bar.style.transform = `scaleX(${progress.toFixed(4)})`;
        }

        if (progress >= 1) {
          this.activeLookIndex = (this.activeLookIndex + 1) % CART_CURATED_LOOKS.length;
          this.renderLook(this.activeLookIndex);
          this.startTime = now;
        }
      } else {
        this.startTime = now; // hold timestamp while paused
      }
      this.rafId = requestAnimationFrame(step);
    };

    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(step);
  }
};

// ─── Main Cart State Machine ────────────────────────────────────────────────
const CartState = {
  items: [],
  hasRenderedSkeletons: false,

  init() {
    this.loadFromStorage();
    this.bindEvents();
    this.updateBadge();
    
    // Check if on cart page
    if (document.getElementById('cartGrid')) {
      this.bootCartPage();
    } else {
      this.renderMiniCart();
    }
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
    const badges = document.querySelectorAll('#headerCartCount, #mobileCartCount, .bag-count-badge, #header-bag-count, #bag-count, .bag-badge, .nav-cart-badge');
    badges.forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  getCount() {
    return this.getTotalCount();
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

  addItem(product, quantity = 1, variant = 'Standard') {
    const existing = this.items.find(i => i.id === product.id && i.variant === variant);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        name: product.name || product.title,
        price: Number(product.price) || (typeof product.price === 'string' ? parseInt(product.price.replace(/[^\d]/g, ''), 10) : 0),
        image: product.image || product.img,
        category: product.category || 'Apparel',
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
      this.removeItem(id, variant);
    } else {
      this.save();
    }
  },

  removeItem(id, variant) {
    const row = document.querySelector(`.cart-item-card[data-id="${id}"][data-variant="${encodeURIComponent(variant)}"]`);
    if (row) {
      row.classList.add('is-removing');
      setTimeout(() => {
        this.items = this.items.filter(i => !(i.id === id && i.variant === variant));
        this.save();
      }, 240);
    } else {
      this.items = this.items.filter(i => !(i.id === id && i.variant === variant));
      this.save();
    }
  },

  saveToWishlist(id) {
    try {
      const raw = localStorage.getItem('nex_wishlist');
      let list = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(list)) list = [];
      if (!list.includes(id)) {
        list.push(id);
        localStorage.setItem('nex_wishlist', JSON.stringify(list));
      }
      const wishBadge = document.getElementById('headerWishlistCount');
      if (wishBadge) {
        wishBadge.textContent = list.length;
        wishBadge.style.display = list.length > 0 ? 'inline-flex' : 'none';
      }
    } catch (e) {
      console.warn('Wishlist storage update failed', e);
    }
  },

  getTotal() {
    return this.items.reduce((sum, i) => sum + (Number(i.price) || 0) * (parseInt(i.quantity || i.qty, 10) || 1), 0);
  },

  getTotalCount() {
    return this.items.reduce((sum, i) => sum + (parseInt(i.quantity || i.qty, 10) || 1), 0);
  },

  bindEvents() {
    // Mini cart triggers
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('#cart-trigger, .cart-trigger, #headerCartLink');
      if (trigger && !window.location.pathname.includes('cart.html')) {
        e.preventDefault();
        this.openMiniCart();
      }
    });

    document.addEventListener('click', (e) => {
      if (e.target.closest('#minicartCloseBtn') || e.target.closest('#nexMiniCartOverlay')) {
        this.closeMiniCart();
      }
    });
  },

  openMiniCart() {
    const drawer = document.getElementById('nexMiniCartDrawer');
    const overlay = document.getElementById('nexMiniCartOverlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('visible');
      if (window._nexLenis) window._nexLenis.stop();
    }
  },

  closeMiniCart() {
    const drawer = document.getElementById('nexMiniCartDrawer');
    const overlay = document.getElementById('nexMiniCartOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('visible');
      if (window._nexLenis) window._nexLenis.start();
    }
  },

  /* ─── Cart Page Boot with 280ms Specular Skeletons ──────────────────────── */
  bootCartPage() {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const itemsList = document.getElementById('cartItemsList');

    if (this.items.length === 0 || prefersReduced || this.hasRenderedSkeletons) {
      this.renderPage();
      CartLookController.init();
      return;
    }

    this.hasRenderedSkeletons = true;
    if (itemsList) {
      itemsList.innerHTML = Array(Math.min(this.items.length, 3)).fill(0).map(() => `
        <div class="cart-skeleton-card" aria-hidden="true">
          <div class="skeleton-shimmer-sweep"></div>
        </div>
      `).join('');
    }

    setTimeout(() => {
      this.renderPage();
      CartLookController.init();
    }, 280);
  },

  /* ─── Full Cart Page Renderer ───────────────────────────────────────────── */
  renderPage() {
    this.updateBadge();

    const itemCountEl = document.getElementById('cartItemCount');
    const cartGrid    = document.getElementById('cartGrid');
    const emptyArea   = document.getElementById('cartEmptyArea');
    const itemsList   = document.getElementById('cartItemsList');
    const summaryArea = document.getElementById('cartSummaryArea');
    const capsuleEl   = document.getElementById('cartDeliveryCapsule');

    if (!cartGrid) return;

    const count = this.getTotalCount();
    const total = this.getTotal();

    if (itemCountEl) {
      itemCountEl.textContent = count === 1 ? '1 piece selected' : `${count} pieces selected`;
    }

    // If empty
    if (this.items.length === 0) {
      cartGrid.style.display  = 'none';
      if (capsuleEl) capsuleEl.style.display = 'none';
      if (emptyArea) emptyArea.style.display = 'flex';
      
      const stickyBar = document.getElementById('mobileCartStickyBar');
      if (stickyBar) stickyBar.classList.remove('visible');
      return;
    }

    cartGrid.style.display  = 'grid';
    if (capsuleEl) capsuleEl.style.display = 'block';
    if (emptyArea) emptyArea.style.display = 'none';

    // 1. Update 120fps Delivery Progress Milestone
    const FREE_SHIPPING_THRESHOLD = 150;
    const diff = Math.max(0, FREE_SHIPPING_THRESHOLD - total);
    const progress = Math.min(1, total / FREE_SHIPPING_THRESHOLD);

    const progressBar = document.getElementById('cartDeliveryProgressBar');
    const statusText  = document.getElementById('deliveryStatusText');
    const capsuleBox  = document.getElementById('cartDeliveryCapsule');

    if (progressBar) progressBar.style.transform = `scaleX(${progress.toFixed(4)})`;

    if (diff <= 0) {
      if (statusText) statusText.innerHTML = '<span style="color:var(--accent-pink, #F13365);font-weight:600;letter-spacing:0.02em;">✓ Complimentary Express Delivery Unlocked</span>';
      if (capsuleBox) capsuleBox.classList.add('unlocked');
    } else {
      if (statusText) statusText.innerHTML = `Add <strong style="color:var(--accent-pink, #F13365);">€ ${diff.toFixed(2)}</strong> more for Complimentary Express Delivery`;
      if (capsuleBox) capsuleBox.classList.remove('unlocked');
    }

    // 2. Render Cart Item Rows
    const isInPages = window.location.pathname.includes('/pages/');
    const self = this;

    itemsList.innerHTML = this.items.map(item => {
      let imgSrc = item.image || '';
      if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('../') && !imgSrc.startsWith('/')) {
        imgSrc = imgSrc.replace(/^assets\//, '');
        if (!imgSrc.includes('/')) {
          const lifestyleNames = ['runner_lifestyle', 'tote_lifestyle', 'hero_watch_landscape', 'lifestyle'];
          const isLifestyle = lifestyleNames.some(n => imgSrc.includes(n));
          imgSrc = (isLifestyle ? 'images/lifestyle/' : 'images/products/') + imgSrc;
        }
        imgSrc = (isInPages ? '../' : '') + 'assets/' + imgSrc;
      }

      return `
        <div class="cart-item-card" data-id="${item.id}" data-variant="${encodeURIComponent(item.variant || 'Standard')}" data-parallax-depth="0.04">
          <div class="cart-item-media">
            <img src="${imgSrc}" alt="${escapeHtml(item.name)}" loading="lazy" />
          </div>
          <div class="cart-item-body">
            <span class="cart-item-category-tag">${escapeHtml(item.category || 'Atelier Selection')}</span>
            <h3 class="cart-item-name">${escapeHtml(item.name)}</h3>
            <p class="cart-item-variant">${escapeHtml(item.variant || 'Standard')}</p>
            <div class="cart-item-controls">
              <div class="cart-stepper">
                <button class="stepper-btn" data-action="dec" aria-label="Decrease quantity">&minus;</button>
                <span class="stepper-val">${item.quantity}</span>
                <button class="stepper-btn" data-action="inc" aria-label="Increase quantity">+</button>
              </div>
            </div>
          </div>
          <div class="cart-item-end">
            <span class="cart-item-price tabular-nums">€ ${(item.price * item.quantity).toFixed(2)}</span>
            <div class="cart-item-actions">
              <button class="cart-action-icon-btn wishlist-btn" data-action="wishlist" title="Save for Later" aria-label="Save for Later">
                <i data-lucide="heart" style="width: 15px; height: 15px;"></i>
              </button>
              <button class="cart-action-icon-btn remove-btn" data-action="remove" title="Remove item" aria-label="Remove item">
                <i data-lucide="trash-2" style="width: 15px; height: 15px;"></i>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Attach Row Listeners
    itemsList.querySelectorAll('.cart-item-card').forEach(row => {
      const id = row.getAttribute('data-id');
      const variant = decodeURIComponent(row.getAttribute('data-variant'));

      row.querySelector('[data-action="dec"]').addEventListener('click', () => { self.updateQuantity(id, variant, -1); });
      row.querySelector('[data-action="inc"]').addEventListener('click', () => { self.updateQuantity(id, variant, 1); });
      row.querySelector('[data-action="remove"]').addEventListener('click', () => { self.removeItem(id, variant); });
      
      const wishBtn = row.querySelector('[data-action="wishlist"]');
      if (wishBtn) {
        wishBtn.addEventListener('click', () => {
          self.saveToWishlist(id);
          wishBtn.style.color = '#F43F5E';
          wishBtn.style.transform = 'scale(1.2)';
          setTimeout(() => { wishBtn.style.transform = ''; }, 200);
        });
      }
    });

    // 3. Render Order Summary
    let discountAmt = 0;
    if (cartActiveCoupon && cartActiveCoupon.type === 'percent') {
      discountAmt = Math.round(total * cartActiveCoupon.value / 100);
    }
    const freeShipCoupon  = cartActiveCoupon && cartActiveCoupon.type === 'shipping';
    const deliveryCost    = (total >= FREE_SHIPPING_THRESHOLD || freeShipCoupon) ? 0 : 12;
    const discountedTotal = Math.max(0, total - discountAmt);
    const grandTotal      = discountedTotal + deliveryCost;

    const deliveryHtml = deliveryCost === 0
      ? '<span style="color:var(--accent-pink, #F13365);font-weight:700;">FREE</span>'
      : `€ ${deliveryCost.toFixed(2)}`;

    const pillDisplay    = cartActiveCoupon ? 'flex' : 'none';
    const inputDisplay   = cartActiveCoupon ? 'none' : 'flex';
    const pillLabelText  = cartActiveCoupon ? cartActiveCoupon.label : '';
    
    const discountRowHtml = discountAmt > 0
      ? `<div class="cart-summary-row discount-row"><span>${cartActiveCoupon ? cartActiveCoupon.label : 'Discount'}</span><span class="tabular-nums">&minus;€ ${discountAmt.toFixed(2)}</span></div>`
      : '';

    summaryArea.innerHTML = `
      <div class="cart-summary-card">
        <h2 class="cart-summary-title">Order Summary</h2>

        <div class="cart-coupon-box">
          <div class="coupon-input-group" id="cart-coupon-input-row" style="display: ${inputDisplay};">
            <input type="text" id="cart-coupon-input" class="cart-coupon-input" placeholder="Promo or gift code" maxlength="20" autocomplete="off" onkeydown="if(event.key==='Enter') cartApplyCoupon()">
            <button class="cart-coupon-apply-btn" onclick="cartApplyCoupon()">Apply</button>
          </div>
          <div id="cart-coupon-feedback" class="cart-coupon-feedback"></div>
          <div id="cart-coupon-pill-wrap" class="cart-coupon-pill-wrap" style="display: ${pillDisplay};">
            <span class="coupon-pill-label" id="cart-coupon-pill-label">${pillLabelText}</span>
            <button class="coupon-remove-btn" onclick="cartRemoveCoupon()" aria-label="Remove promo code">&times;</button>
          </div>
        </div>

        <div class="cart-summary-row">
          <span>Subtotal (${count} ${count === 1 ? 'item' : 'items'})</span>
          <span style="color:#FFFFFF;font-weight:600;" class="tabular-nums">€ ${total.toFixed(2)}</span>
        </div>

        ${discountRowHtml}

        <div class="cart-summary-row">
          <span>Standard EU Tracked Delivery</span>
          <span class="tabular-nums">${deliveryHtml}</span>
        </div>

        <div class="cart-summary-divider"></div>

        <div class="cart-summary-row cart-summary-total">
          <span>Total Due</span>
          <span style="color:#FFFFFF;" class="tabular-nums">€ ${grandTotal.toFixed(2)}</span>
        </div>

        <div class="eu-vat-tag" style="margin-top: -8px; margin-bottom: 16px; font-size: 11px; color: rgba(255,255,255,0.5);">
          <span>Includes statutory 19% European VAT. Shipping calculated at checkout.</span>
        </div>

        <a href="checkout.html" class="cart-checkout-btn" id="cartCheckoutBtn">
          <span>PROCEED TO CHECKOUT</span>
          <i data-lucide="arrow-right" style="width: 15px; height: 15px;"></i>
        </a>

        <div class="cart-summary-meta">
          <div class="cart-meta-item">
            <i data-lucide="rotate-ccw" style="width: 14px; height: 14px;"></i>
            <span>14-Day Statutory Right of Withdrawal</span>
          </div>
          <div class="cart-meta-item">
            <i data-lucide="shield-check" style="width: 14px; height: 14px;"></i>
            <span>100% Certified Authentic Maison Sourcing</span>
          </div>
          <div class="cart-meta-item">
            <i data-lucide="lock" style="width: 14px; height: 14px;"></i>
            <span>PSD2 Compliant 256-bit Encrypted Checkout</span>
          </div>
        </div>
      </div>
    `;

    // 4. Update Mobile Sticky Bar
    const mobileStickyBar = document.getElementById('mobileCartStickyBar');
    const mobileStickyTotal = document.getElementById('mobileStickyTotal');
    if (mobileStickyBar) {
      mobileStickyBar.classList.add('visible');
      if (mobileStickyTotal) mobileStickyTotal.textContent = `€ ${grandTotal.toFixed(2)}`;
    }

    if (window.lucide) window.lucide.createIcons();

    // 5. Trigger Motion Hooks
    if (typeof window.initCartCardsMotion === 'function') {
      window.initCartCardsMotion();
    }
  },

  /* ─── Mini Cart Drawer Renderer ─────────────────────────────────────────── */
  renderMiniCart() {
    const mcBody = document.getElementById('minicartBody');
    const mcSubtotal = document.getElementById('minicartSubtotalValue');
    const mcFooter = document.getElementById('minicartFooter');

    if (!mcBody) return;

    const count = this.getTotalCount();
    const total = this.getTotal();

    if (count === 0) {
      mcBody.innerHTML = `
        <div class="minicart-empty" style="text-align: center; padding: 48px 16px;">
          <h3 style="font-family: var(--font-serif); font-size: 20px; color: #fff; margin-bottom: 8px;">Your bag is empty</h3>
          <p style="font-size: 13px; color: rgba(255,255,255,0.6); margin-bottom: 16px;">Discover pieces curated around how you want to dress.</p>
          <a href="${_resolvePage('discovery.html')}" class="btn-primary-commerce" onclick="nexCart.closeMiniCart()" style="display:inline-block; padding: 10px 20px; font-size: 12px;">EXPLORE DISCOVERY &rarr;</a>
        </div>
      `;
      if (mcFooter) mcFooter.style.display = 'none';
      return;
    }

    if (mcFooter) {
      mcFooter.style.display = 'block';
      if (mcSubtotal) mcSubtotal.textContent = `€ ${total.toFixed(2)}`;
    }

    const isInPages = window.location.pathname.includes('/pages/');
    const self = this;

    mcBody.innerHTML = this.items.map(item => {
      let imgSrc = item.image || '';
      if (imgSrc && !imgSrc.startsWith('http') && !imgSrc.startsWith('../') && !imgSrc.startsWith('/')) {
        imgSrc = imgSrc.replace(/^assets\//, '');
        if (!imgSrc.includes('/')) {
          const lifestyleNames = ['runner_lifestyle', 'tote_lifestyle', 'hero_watch_landscape', 'lifestyle'];
          const isLifestyle = lifestyleNames.some(n => imgSrc.includes(n));
          imgSrc = (isLifestyle ? 'images/lifestyle/' : 'images/products/') + imgSrc;
        }
        imgSrc = (isInPages ? '../' : '') + 'assets/' + imgSrc;
      }

      return `
        <div class="mc-item-row" data-id="${item.id}" data-variant="${encodeURIComponent(item.variant || 'Standard')}">
          <img src="${imgSrc}" alt="${escapeHtml(item.name)}" class="mc-item-img">
          <div class="mc-item-details">
            <div class="mc-item-title">${escapeHtml(item.name)}</div>
            <div class="mc-item-variant">${escapeHtml(item.variant || 'Standard')} &middot; Qty: ${item.quantity}</div>
            <div class="mc-item-bottom">
              <div class="mc-item-price tabular-nums">€ ${(item.price * item.quantity).toFixed(2)}</div>
              <button class="mc-remove-btn" data-action="remove">Remove</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    mcBody.querySelectorAll('.mc-item-row').forEach(row => {
      const id = row.getAttribute('data-id');
      const variant = decodeURIComponent(row.getAttribute('data-variant'));
      row.querySelector('[data-action="remove"]').addEventListener('click', () => {
        self.removeItem(id, variant);
      });
    });
  }
};

window.nexCart = CartState;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { CartState.init(); });
} else {
  CartState.init();
}
