/**
 * nexCommerce — Cart Recovery & Exit-Intent UI Controller (Capability 7)
 * Intercepts user exit intent, opens tailored recovery dialogs with reservation holds,
 * auto-applies comeback incentive codes, and handles deep link cart restoration.
 */
(function(window) {
  'use strict';

  class CartRecoveryUI {
    constructor() {
      this.hasTriggered = false;
      this.timerInterval = null;
      this.secondsRemaining = 900; // 15 minutes
      this.currentDiagnosis = null;
      this.init();
    }

    init() {
      this.checkDeepLinkRecovery();

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          this.initExitIntent();
        });
      } else {
        this.initExitIntent();
      }
    }

    _getCartItems() {
      try {
        const raw = localStorage.getItem('nex_cart');
        const cart = raw ? JSON.parse(raw) : [];
        return Array.isArray(cart) ? cart : [];
      } catch(e) {
        return [];
      }
    }

    _resolveImg(path) {
      if (!path) return '';
      if (path.startsWith('http') || path.startsWith('data:')) return path;
      const isSubpage = window.location.pathname.includes('/pages/');
      if (isSubpage && !path.startsWith('../') && !path.startsWith('/')) {
        return '../' + path;
      }
      return path;
    }

    initExitIntent() {
      // Exit intent: mouse cursor moving above top border
      document.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 10 && !this.hasTriggered) {
          const cart = this._getCartItems();
          if (cart.length > 0 && !sessionStorage.getItem('nex_recovery_dismissed')) {
            this.showRecoveryModal();
          }
        }
      });
    }

    showRecoveryModal() {
      const cart = this._getCartItems();
      if (cart.length === 0 || !window.NexCartRecoveryEngine) return;

      this.hasTriggered = true;
      const subtotal = cart.reduce((sum, i) => sum + (Number(i.price) * (parseInt(i.quantity || i.qty, 10) || 1)), 0);
      this.currentDiagnosis = window.NexCartRecoveryEngine.diagnoseFriction(cart, subtotal);

      let modal = document.getElementById('cartRecoveryModalOverlay');
      if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cartRecoveryModalOverlay';
        modal.className = 'recovery-modal-overlay';
        document.body.appendChild(modal);
      }

      const diag = this.currentDiagnosis;

      modal.innerHTML = `
        <div class="recovery-modal-card" role="dialog" aria-modal="true" aria-label="Cart Recovery Incentive">
          <button id="closeRecoveryModalBtn" aria-label="Close" style="position:absolute;top:18px;right:18px;background:none;border:none;color:rgba(255,255,255,0.4);font-size:22px;cursor:pointer;">&times;</button>
          
          <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;">
            <div class="recovery-timer-badge">
              <i data-lucide="clock" style="width:13px;height:13px;"></i>
              <span id="recoveryCountdownTimer">14:59 Reservation Hold</span>
            </div>
            <span style="font-size:11px;color:rgba(255,255,255,0.4);font-weight:600;">${cart.length} PIECES RESERVED</span>
          </div>

          <div>
            <h3 style="font-family:var(--font-serif);font-size:22px;color:#fff;margin:0 0 6px 0;">${diag.title}</h3>
            <p style="font-size:12.5px;color:rgba(255,255,255,0.7);line-height:1.45;margin:0;">${diag.description}</p>
          </div>

          <!-- Product Thumbnails Row -->
          <div class="recovery-items-row">
            ${cart.map(item => `
              <div class="recovery-item-thumb" title="${item.name}">
                <img src="${this._resolveImg(item.image)}" alt="${item.name}">
              </div>
            `).join('')}
          </div>

          <button id="btnClaimRecoveryOffer" class="recovery-action-btn">
            <i data-lucide="sparkles" style="width:16px;height:16px;"></i>
            <span>⚡ Claim ${diag.incentiveCode} & Complete Order</span>
          </button>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      const closeBtn = modal.querySelector('#closeRecoveryModalBtn');
      if (closeBtn) {
        closeBtn.onclick = () => this.dismissModal();
      }

      const claimBtn = modal.querySelector('#btnClaimRecoveryOffer');
      if (claimBtn) {
        claimBtn.onclick = () => this.claimIncentiveAndCheckout(diag.incentiveCode);
      }

      this.startTimer();
    }

    startTimer() {
      if (this.timerInterval) clearInterval(this.timerInterval);
      this.secondsRemaining = 900;

      this.timerInterval = setInterval(() => {
        this.secondsRemaining--;
        if (this.secondsRemaining <= 0) {
          clearInterval(this.timerInterval);
          const timerEl = document.getElementById('recoveryCountdownTimer');
          if (timerEl) timerEl.textContent = 'Offer Expired';
          const claimBtn = document.getElementById('btnClaimRecoveryOffer');
          if (claimBtn) {
            claimBtn.disabled = true;
            claimBtn.style.opacity = '0.45';
            claimBtn.style.cursor = 'not-allowed';
            const label = claimBtn.querySelector('span');
            if (label) label.textContent = 'Offer Expired';
          }
          return;
        }

        const mins = Math.floor(this.secondsRemaining / 60);
        const secs = this.secondsRemaining % 60;
        const timerEl = document.getElementById('recoveryCountdownTimer');
        if (timerEl) {
          timerEl.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')} Reservation Hold`;
        }
      }, 1000);
    }

    dismissModal() {
      const modal = document.getElementById('cartRecoveryModalOverlay');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
      sessionStorage.setItem('nex_recovery_dismissed', 'true');
      if (this.timerInterval) clearInterval(this.timerInterval);
    }

    claimIncentiveAndCheckout(code) {
      this.dismissModal();
      sessionStorage.setItem('applied_recovery_code', code);

      if (typeof window.showToast === 'function') {
        window.showToast(`✨ Applied comeback incentive code ${code}! Redirecting to checkout…`);
      }

      const isSubpage = window.location.pathname.includes('/pages/');
      const checkoutUrl = isSubpage ? 'checkout.html' : 'pages/checkout.html';
      setTimeout(() => {
        window.location.href = checkoutUrl;
      }, 400);
    }

    checkDeepLinkRecovery() {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('recover_cart');
      if (token && window.NexCartRecoveryEngine) {
        const items = window.NexCartRecoveryEngine.decodeRecoveryPayload(token);
        if (items.length > 0 && window.nexCart && typeof window.nexCart.addItem === 'function') {
          items.forEach(i => window.nexCart.addItem(i, i.quantity || 1, i.variant || 'Standard'));
          if (typeof window.showToast === 'function') {
            window.showToast(`✨ Restored ${items.length} pieces from your saved bag!`);
          }
        }
      }
    }
  }

  window.NexCartRecoveryUI = new CartRecoveryUI();

})(typeof window !== 'undefined' ? window : global);
