/**
 * nexCommerce — Side-by-Side Product Comparison UI Controller (Capability 2)
 * Orchestrates comparison modal rendering, spec matrix visualization, diff highlighting,
 * and 1-click cart selection.
 */
(function(window) {
  'use strict';

  class ComparisonUI {
    constructor() {
      this.currentComparison = null;
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
        { id: 'p1', name: 'Pure Cashmere Sweater', price: 185, image: 'assets/images/products/hero_sweater.png', category: 'Apparel', materials: '100% Mongolian Cashmere', origin: 'Biella, Italy' },
        { id: 'p2', name: 'Fine-Knit Cashmere Crew', price: 160, image: 'assets/images/products/plp_crewneck.png', category: 'Apparel', materials: '100% Fine Gauge Cashmere', origin: 'Florence, Italy' },
        { id: 'p3', name: 'Structured Wool Blazer', price: 245, image: 'assets/images/products/plp_blazer.png', category: 'Apparel', materials: '100% Virgin Wool', origin: 'Milan, Italy' },
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
      if (document.getElementById('compareModalBackdrop')) return;

      const modalEl = document.createElement('div');
      modalEl.id = 'compareModalBackdrop';
      modalEl.className = 'compare-modal-backdrop';
      modalEl.setAttribute('role', 'dialog');
      modalEl.setAttribute('aria-modal', 'true');
      modalEl.setAttribute('aria-hidden', 'true');

      modalEl.innerHTML = `
        <div class="compare-modal-dialog">
          <div class="compare-modal-header">
            <div>
              <span style="font-size:10px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:#3DE0FF;">✨ Customer Commerce Agent · Smart Capability 2</span>
              <h2 class="compare-modal-title">Product Advisor &amp; Comparison Matrix</h2>
            </div>
            <button id="compareModalCloseBtn" class="slip-modal-close-btn" aria-label="Close comparison">
              <i data-lucide="x" style="width:20px;height:20px;"></i>
            </button>
          </div>

          <div class="compare-modal-body" id="compareModalBody">
            <!-- Dynamic comparison content hydrated by renderComparison() -->
          </div>
        </div>
      `;

      document.body.appendChild(modalEl);
      if (window.lucide) window.lucide.createIcons();
      this.bindModalEvents();
    }

    bindModalEvents() {
      const backdrop = document.getElementById('compareModalBackdrop');
      const closeBtn = document.getElementById('compareModalCloseBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => this.closeComparison());
      if (backdrop) {
        backdrop.addEventListener('click', (e) => {
          if (e.target === backdrop) this.closeComparison();
        });
      }

      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && backdrop && backdrop.classList.contains('is-open')) {
          this.closeComparison();
        }
      });
    }

    bindGlobalTriggers() {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-trigger="compare-modal"], .open-compare-btn, #pdpCompareBtn');
        if (trigger) {
          e.preventDefault();
          const pIds = (trigger.getAttribute('data-compare-ids') || 'p1,p2').split(',');
          this.openComparison(pIds);
        }
      });
    }

    openComparison(productIds, userContext) {
      if (!window.NexComparisonEngine) return;
      const catalog = this._getCatalog();
      const ids = Array.isArray(productIds) && productIds.length >= 2 ? productIds : ['p1', 'p2'];
      this.currentComparison = window.NexComparisonEngine.compareProducts(ids, catalog, userContext);
      this.renderComparison(this.currentComparison);

      const backdrop = document.getElementById('compareModalBackdrop');
      if (backdrop) {
        backdrop.classList.add('is-open');
        backdrop.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      }
    }

    closeComparison() {
      const backdrop = document.getElementById('compareModalBackdrop');
      if (backdrop) {
        backdrop.classList.remove('is-open');
        backdrop.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    }

    renderComparison(comp) {
      const body = document.getElementById('compareModalBody');
      if (!body || !comp || comp.products.length < 2) return;

      const pA = comp.products[0];
      const pB = comp.products[1];
      const imgA = this._resolveImg(pA.image || pA.img);
      const imgB = this._resolveImg(pB.image || pB.img);

      body.innerHTML = `
        <!-- Smart Verdict Summary -->
        <div class="compare-verdict-card">
          <div class="compare-verdict-eyebrow">
            <i data-lucide="sparkles" style="width:14px;height:14px;"></i>
            <span>Smart Advisor Verdict</span>
          </div>
          <div class="compare-verdict-headline">${comp.verdict.headline}</div>
          <div style="font-size:13px;color:rgba(255,255,255,0.75);line-height:1.6;">${comp.verdict.summary}</div>
          <div class="compare-verdict-use-cases">
            <div class="compare-use-case-item">
              <strong style="color:#fff;">${pA.name || pA.title}:</strong> ${comp.verdict.bestForA}
            </div>
            <div class="compare-use-case-item">
              <strong style="color:#fff;">${pB.name || pB.title}:</strong> ${comp.verdict.bestForB}
            </div>
          </div>
        </div>

        <!-- Products Header Row -->
        <div class="compare-products-header-grid">
          <div style="font-size:11px;font-weight:700;letter-spacing:0.14em;color:rgba(255,255,255,0.4);text-transform:uppercase;">
            Spec Diff Matrix
          </div>
          <div class="compare-product-column-head">
            <img class="compare-product-thumb" src="${imgA}" alt="${pA.name || pA.title}" />
            <div class="compare-product-name">${pA.name || pA.title}</div>
            <div class="compare-product-price">€ ${(pA.numericPrice || pA.price || 0).toFixed(2)}</div>
            <button class="compare-choose-btn" data-choose-id="${pA.id}">
              <i data-lucide="shopping-bag" style="width:14px;height:14px;"></i>
              <span>Choose ${pA.name ? pA.name.split(' ')[0] : 'This'}</span>
            </button>
          </div>
          <div class="compare-product-column-head">
            <img class="compare-product-thumb" src="${imgB}" alt="${pB.name || pB.title}" />
            <div class="compare-product-name">${pB.name || pB.title}</div>
            <div class="compare-product-price">€ ${(pB.numericPrice || pB.price || 0).toFixed(2)}</div>
            <button class="compare-choose-btn" data-choose-id="${pB.id}">
              <i data-lucide="shopping-bag" style="width:14px;height:14px;"></i>
              <span>Choose ${pB.name ? pB.name.split(' ')[0] : 'This'}</span>
            </button>
          </div>
        </div>

        <!-- Spec Comparison Rows -->
        <div class="compare-matrix-table">
          ${comp.specRows.map(row => `
            <div class="compare-matrix-row">
              <div class="compare-spec-label">${row.label}</div>
              <div class="compare-spec-val">
                <span>${row.valA}</span>
                ${row.highlightA ? `<span class="compare-diff-tag">${row.highlightA}</span>` : ''}
              </div>
              <div class="compare-spec-val">
                <span>${row.valB}</span>
                ${row.highlightB ? `<span class="compare-diff-tag">${row.highlightB}</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      // Bind Choose Buttons
      body.querySelectorAll('.compare-choose-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const id = btn.getAttribute('data-choose-id');
          this.chooseProduct(id);
        });
      });
    }

    chooseProduct(productId) {
      const catalog = this._getCatalog();
      const prod = catalog.find(p => p.id === productId);
      if (prod && window.nexCart && typeof window.nexCart.addItem === 'function') {
        window.nexCart.addItem({
          id: prod.id,
          name: prod.name || prod.title,
          price: prod.numericPrice || prod.price,
          image: prod.image || prod.img,
          category: prod.category || 'Apparel'
        }, 1, 'Standard');
      }

      this.closeComparison();

      if (typeof window.showToast === 'function') {
        window.showToast(`✨ Added ${prod ? (prod.name || prod.title) : 'item'} to your bag!`);
      } else {
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;bottom:24px;right:24px;background:#0A192F;border:1px solid #3DE0FF;color:#fff;padding:14px 20px;border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,0.6);z-index:10000;font-size:13px;font-weight:600;display:flex;align-items:center;gap:8px;animation:fadeIn 0.3s ease;';
        toast.innerHTML = `<span>✨ Added ${prod ? (prod.name || prod.title) : 'item'} to your bag!</span>`;
        document.body.appendChild(toast);
        setTimeout(() => { toast.remove(); }, 3500);
      }
    }
  }

  window.NexComparisonUI = new ComparisonUI();

})(typeof window !== 'undefined' ? window : global);
