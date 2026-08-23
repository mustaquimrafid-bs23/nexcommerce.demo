/**
 * nexCommerce — Autonomous Budget Cart UI Controller (Capability 3)
 * Handles budget customizer modal, live gauge updates, alternative swaps, and batch cart synchronization.
 */
(function(window) {
  'use strict';

  class BudgetCartUI {
    constructor() {
      this.currentBasket = null;
      this.init();
    }

    init() {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.injectModalHtml();
          this.bindGlobalTriggers();
        });
      } else {
        this.injectModalHtml();
        this.bindGlobalTriggers();
      }
    }

    _getCatalog() {
      if (typeof SL_PRODUCTS !== 'undefined' && Array.isArray(SL_PRODUCTS)) return SL_PRODUCTS;
      if (window.NexAI && Array.isArray(window.NexAI.catalogArray)) return window.NexAI.catalogArray;
      return [
        { id: 'p1', name: 'Pure Cashmere Sweater', price: 185, image: 'assets/images/products/hero_sweater.png', category: 'Apparel' },
        { id: 'p2', name: 'Fine-Knit Cashmere Crew', price: 160, image: 'assets/images/products/plp_crewneck.png', category: 'Apparel' },
        { id: 'p3', name: 'Structured Wool Blazer', price: 245, image: 'assets/images/products/plp_blazer.png', category: 'Apparel' },
        { id: 'p4', name: 'Studio Acoustics Headphone GT', price: 320, image: 'assets/images/products/p4.png', category: 'Acoustics' },
        { id: 'p6', name: 'Minimalist Leather Runner', price: 198, image: 'assets/images/products/leather_sneaker.png', category: 'Footwear' },
        { id: 'p8', name: 'Chronograph Minimalist Watch', price: 285, image: 'assets/images/products/titanium_watch.png', category: 'Accessories' }
      ];
    }

    _resolveImg(imgPath) {
      if (!imgPath) return '';
      if (imgPath.startsWith('http')) return imgPath;
      const isSubpage = window.location.pathname.includes('/pages/') || window.location.pathname.endsWith('/pages');
      if (isSubpage) {
        return imgPath.startsWith('../') ? imgPath : '../' + imgPath;
      }
      return imgPath.startsWith('../') ? imgPath.replace(/^\.\.\//, '') : imgPath;
    }

    injectModalHtml() {
      if (document.getElementById('budgetModalBackdrop')) return;

      const modalEl = document.createElement('div');
      modalEl.id = 'budgetModalBackdrop';
      modalEl.className = 'budget-modal-backdrop';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.setAttribute('aria-hidden', 'true');

      modalEl.innerHTML = `
        <div class="budget-modal-dialog">
          <div class="budget-modal-header">
            <div>
              <span style="font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--accent-cyan,#3DE0FF);">AI · Budget Builder</span>
              <h2 class="budget-modal-title">Build Your Perfect Basket</h2>
            </div>
            <button id="budgetModalCloseBtn" class="slip-modal-close-btn" aria-label="Close budget builder">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>

          <div class="budget-modal-body" id="budgetModalBody" data-lenis-prevent>
            <!-- Populated dynamically by renderBasket() -->
          </div>

          <div class="budget-modal-footer">
            <div id="budgetFooterSummary" style="font-size:13px;color:rgba(255,255,255,0.7);">
              Total: <strong style="color:#00F5A0;">€ 0.00</strong>
            </div>
            <button id="budgetBatchAddBtn" class="budget-confirm-btn">
              <i data-lucide="shopping-bag" style="width:15px;height:15px;"></i>
              <span>Add Entire Basket to Bag</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modalEl);
      if (window.lucide) window.lucide.createIcons();
      this.bindModalEvents();
    }

    bindModalEvents() {
      const backdrop = document.getElementById('budgetModalBackdrop');
      const closeBtn = document.getElementById('budgetModalCloseBtn');
      const addBtn = document.getElementById('budgetBatchAddBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeModal());
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) this.closeModal();
        });
      }
      if (addBtn) addBtn.addEventListener('click', () => this.commitEntireBasket());

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
          this.closeModal();
        }
      });
    }

    bindGlobalTriggers() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-trigger="budget-modal"], #cartOpenBudgetBtn');
        if (trigger) {
          e.preventDefault();
          const target = parseInt(trigger.getAttribute('data-budget') || '500', 10);
          const theme = trigger.getAttribute('data-theme') || 'autumn';
          this.openModal(target, theme);
        }
      });
    }

    openModal(targetBudget = 500, theme = 'autumn') {
      if (!window.NexBudgetCartEngine) {
        if (typeof window.showToast === 'function') {
          window.showToast('Budget Builder is loading — try again in a moment.', 'info');
        }
        return;
      }
      const catalog = this._getCatalog();
      this.currentBasket = window.NexBudgetCartEngine.buildBudgetCart(targetBudget, theme, catalog);
      this.renderBasket(this.currentBasket);

      const backdrop = document.getElementById('budgetModalBackdrop');
      if (backdrop) {
        backdrop.classList.add('is-open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    closeModal() {
      const backdrop = document.getElementById('budgetModalBackdrop');
      if (backdrop) {
        backdrop.classList.remove('is-open');
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    renderBasket(basket) {
      const body = document.getElementById('budgetModalBody');
      const footerSummary = document.getElementById('budgetFooterSummary');
      if (!body || !basket) return;

      body.innerHTML = `
        <!-- Budget Presets Cluster -->
        <div>
          <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.4);display:block;margin-bottom:8px;">Target Budget Preset:</span>
          <div class="budget-presets-cluster">
            <button class="budget-preset-chip ${basket.targetBudget === 300 ? 'active' : ''}" data-budget-preset="300">
              ⚡ € 300 Essentials
            </button>
            <button class="budget-preset-chip ${basket.targetBudget === 500 ? 'active' : ''}" data-budget-preset="500">
              🍂 € 500 Autumn Wardrobe
            </button>
            <button class="budget-preset-chip ${basket.targetBudget === 750 ? 'active' : ''}" data-budget-preset="750">
              💎 € 750 Luxury Atelier Trio
            </button>
          </div>
        </div>

        <!-- Real-Time Telemetry Bar -->
        <div class="budget-telemetry-card">
          <div class="budget-telemetry-header">
            <div>
              <span style="font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:rgba(255,255,255,0.5);">Calculated Basket Total</span>
              <div class="budget-spent-amount">€ ${basket.totalPrice.toFixed(2)}</div>
            </div>
            <div style="text-align:right;">
              <span class="budget-target-cap">Cap: € ${basket.targetBudget.toFixed(2)}</span>
              <div class="budget-headroom-pill" style="margin-top:4px;">+€ ${basket.headroom.toFixed(2)} Headroom Remaining</div>
            </div>
          </div>
          <div class="budget-progress-track">
            <div class="budget-progress-fill" style="width: ${Math.min(100, basket.utilizationPercent)}%;"></div>
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,0.6);">
            🎯 <strong>${basket.utilizationPercent}% of budget used</strong> · ${basket.items.length} curated pieces selected.
          </div>
        </div>

        <!-- Selected Item Slots -->
        <div>
          <span style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.4);display:block;margin-bottom:10px;">Your Selection:</span>
          <div class="budget-slots-grid">
            ${basket.slots.length === 0 ? `
              <div style="grid-column:1/-1;text-align:center;padding:32px 16px;color:rgba(255,255,255,0.45);">
                <p style="font-size:28px;margin:0 0 10px;">🎯</p>
                <p style="font-size:13px;font-weight:600;margin:0 0 6px;color:rgba(255,255,255,0.7);">Budget too tight for a complete look</p>
                <p style="font-size:12px;margin:0;">Try € 300 or above to build a curated basket.</p>
              </div>` : ''}
            ${basket.slots.map((slot, slotIdx) => {
              const item = slot.selectedItem;
              const img = this._resolveImg(item.image || item.img);
              const alts = (slot.alternatives || []).slice(0, 2);
              const altsHtml = alts.length ? `
                <div class="budget-slot-alts">
                  <span style="font-size:9px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-right:6px;">Or:</span>
                  ${alts.map((alt, ai) => `
                    <button class="budget-alt-chip" data-slot-idx="${slotIdx}" data-alt-idx="${ai}"
                      data-alt-name="${alt.name.replace(/"/g,'&quot;')}"
                      data-alt-price="${alt.price}"
                      data-alt-img="${this._resolveImg(alt.image || alt.img || '')}"
                      title="${alt.name.replace(/"/g,'&quot;')}">
                      ${alt.name.split(' ').slice(0, 2).join(' ')}
                    </button>
                  `).join('')}
                </div>` : '';
              return `
                <div class="budget-slot-card" data-slot-idx="${slotIdx}">
                  <div class="budget-slot-header">
                    <span class="budget-slot-name">${slot.slotName}</span>
                    <span style="font-size:10px;color:rgba(255,255,255,0.4);">${item.category}</span>
                  </div>
                  <div class="budget-slot-item-view">
                    <img class="budget-slot-thumb" src="${img}" alt="${item.name}" />
                    <div class="budget-slot-details">
                      <span class="budget-slot-item-title">${item.name}</span>
                      <span class="budget-slot-item-price">€ ${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                  ${altsHtml}
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      if (footerSummary) {
        footerSummary.innerHTML = `Total: <strong style="color:var(--color-success,#34D399);">€ ${basket.totalPrice.toFixed(2)}</strong> (${basket.items.length} pieces)`;
      }

      // Track per-slot active prices for total recalculation on swap
      this._slotPrices = basket.slots.map(s => s.selectedItem.price);

      // Bind slot swap chips
      body.querySelectorAll('.budget-alt-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          const slotIdx = parseInt(chip.getAttribute('data-slot-idx'));
          const newName  = chip.getAttribute('data-alt-name');
          const newPrice = parseFloat(chip.getAttribute('data-alt-price'));
          const newImg   = chip.getAttribute('data-alt-img');

          const slotCard = body.querySelector(`.budget-slot-card[data-slot-idx="${slotIdx}"]`);
          if (slotCard) {
            const titleEl = slotCard.querySelector('.budget-slot-item-title');
            const priceEl = slotCard.querySelector('.budget-slot-item-price');
            const imgEl   = slotCard.querySelector('.budget-slot-thumb');
            if (titleEl) titleEl.textContent = newName;
            if (priceEl) priceEl.textContent = '€ ' + newPrice.toFixed(2);
            if (imgEl && newImg)   imgEl.src = newImg;
          }

          if (this._slotPrices) {
            this._slotPrices[slotIdx] = newPrice;
            const newTotal = this._slotPrices.reduce((s, p) => s + p, 0);
            const fs = document.getElementById('budgetFooterSummary');
            if (fs) fs.innerHTML = `Total: <strong style="color:var(--color-success,#34D399);">€ ${newTotal.toFixed(2)}</strong> (${basket.items.length} pieces)`;
          }
        });
      });

      if (window.lucide) window.lucide.createIcons();

      // Bind Preset Chips
      body.querySelectorAll('.budget-preset-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          const b = parseInt(btn.getAttribute('data-budget-preset'), 10);
          this.openModal(b, b === 300 ? 'essentials' : b === 500 ? 'autumn' : 'office');
        });
      });
    }

    commitEntireBasket() {
      if (!this.currentBasket || !this.currentBasket.items) return;

      if (window.nexCart && typeof window.nexCart.addItem === 'function') {
        this.currentBasket.items.forEach(item => {
          window.nexCart.addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category
          }, 1, 'Standard');
        });
      }

      this.closeModal();

      if (typeof window.showToast === 'function') {
        window.showToast(`✨ Added all ${this.currentBasket.items.length} budget basket pieces to your bag!`);
      } else {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0A192F;border:1px solid #00F5A0;color:#fff;padding:14px 20px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.6);z-index:10000;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;';
        toast.innerHTML = `<span>✨ Added ${this.currentBasket.items.length} items (€${this.currentBasket.totalPrice.toFixed(2)}) to your bag!</span>`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3500);
      }
    }
  }

  window.NexBudgetCartUI = new BudgetCartUI();

})(typeof window !== 'undefined' ? window : global);
