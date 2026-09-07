/**
 * nexCommerce — Checkout Savings UI Controller
 * Orchestrates savings evaluation, card hydration in the checkout order summary,
 * and 1-click promo discount execution.
 */
(function(window) {
  'use strict';

  class CheckoutSavingsUI {
    constructor() {
      this.currentEvaluation = null;
      this.init();
    }

    init() {
      const runMount = () => {
        setTimeout(() => this.mountAdvisor(), 50);
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runMount);
      } else {
        runMount();
      }

      window.addEventListener('cart-updated', runMount);
    }

    _getSubtotal() {
      const subtotalEl = document.getElementById('summary-subtotal') || document.getElementById('ledgerSubtotal') || document.querySelector('[data-ledger-subtotal]');
      if (subtotalEl) {
        const txt = subtotalEl.textContent.replace(/[^0-9.]/g, '');
        const parsed = parseFloat(txt);
        if (!isNaN(parsed) && parsed > 0) return parsed;
      }
      try {
        const raw = localStorage.getItem('nex_cart');
        const cart = raw ? JSON.parse(raw) : [];
        if (Array.isArray(cart) && cart.length > 0) {
          const sum = cart.reduce((total, i) => total + (Number(i.price) * (parseInt(i.quantity || i.qty, 10) || 1)), 0);
          if (sum > 0) return sum;
        }
      } catch(e) {}
      return 245.00; // Default fallback
    }

    mountAdvisor() {
      const container = document.getElementById('checkoutSavingsMount') || document.querySelector('.coupon-box');
      if (!container) return;

      const subtotal = this._getSubtotal();
      if (!window.NexSavingsEngine) return;

      this.currentEvaluation = window.NexSavingsEngine.evaluateSavings(subtotal, 'card');
      this.renderSavingsCard(container, this.currentEvaluation);
    }

    renderSavingsCard(container, evalData) {
      if (!evalData || !evalData.bestCoupon) return;

      let card = document.getElementById('aiSavingsAdvisorCard');
      if (!card) {
        card = document.createElement('div');
        card.id = 'aiSavingsAdvisorCard';
        card.className = 'savings-advisor-card';
        if (container.id === 'checkoutSavingsMount') {
          container.appendChild(card);
        } else {
          container.parentNode.insertBefore(card, container);
        }
      }

      const activeCoupon = (typeof window.cartActiveCoupon !== 'undefined' ? window.cartActiveCoupon : null) || (window.nexActiveCoupon) || null;
      if (activeCoupon && activeCoupon.code) {
        card.innerHTML = `
          <div class="savings-card-top">
            <div class="savings-advisor-badge">
              <i data-lucide="check-circle" style="width:14px;height:14px;color:#34D399;"></i>
              <span>Savings Applied</span>
            </div>
            <div class="savings-applied-pill" style="background:rgba(52,211,153,0.12);color:#34D399;border:1px solid rgba(52,211,153,0.25);font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;">✓ Code ${activeCoupon.code} Active</div>
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.4;margin-top:6px;">
            Best available discount applied. Your order total has been updated.
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
        return;
      }

      const best = evalData.bestCoupon;
      const upgrade = evalData.upgradeOpportunity;

      card.innerHTML = `
        <div class="savings-card-top">
          <div class="savings-advisor-badge">
            <i data-lucide="sparkles" style="width:14px;height:14px;color:#3DE0FF;"></i>
            <span>Promotional Discount</span>
          </div>
          <div class="savings-amount-highlight" style="color:#34D399;font-weight:700;">Save € ${best.discountAmount.toFixed(2)}</div>
        </div>

        <div class="savings-recommendation-text" style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.4;margin:6px 0 10px;">
          Recommended code <strong>\`${best.code}\`</strong> (${best.label}) gives you the highest net savings on your selection.
        </div>

        ${upgrade ? `
          <div class="savings-upgrade-alert" style="margin-bottom:10px;">
            <i data-lucide="zap" style="width:14px;height:14px;color:#3DE0FF;flex-shrink:0;"></i>
            <span>${upgrade.message}</span>
          </div>
        ` : ''}

        <button id="btnAutoApplySavings" class="savings-apply-action-btn" data-apply-code="${best.code}">
          <i data-lucide="check-circle" style="width:14px;height:14px;flex-shrink:0;"></i>
          <span>Apply Promo (${best.code} · Save €${best.discountAmount.toFixed(2)})</span>
        </button>
      `;

      if (window.lucide) window.lucide.createIcons();

      const applyBtn = card.querySelector('#btnAutoApplySavings');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          this.applyBestPromo(best.code, card);
        });
      }
    }

    applyBestPromo(code, cardElement) {
      const couponInput = document.getElementById('coupon-input') || document.getElementById('couponInput') || document.getElementById('cart-coupon-input');
      const applyBtn = document.querySelector('.coupon-apply-btn') || document.getElementById('btnCouponApply') || document.querySelector('.cart-coupon-apply-btn');

      if (couponInput) {
        couponInput.value = code;
      }

      if (typeof window.cartApplyCoupon === 'function' && document.getElementById('cart-coupon-input')) {
        window.cartApplyCoupon(code);
      } else if (typeof window.applyCoupon === 'function') {
        window.applyCoupon(code);
      } else if (applyBtn) {
        applyBtn.click();
      }

      if (cardElement) {
        cardElement.innerHTML = `
          <div class="savings-card-top">
            <div class="savings-advisor-badge">
              <i data-lucide="check-circle" style="width:14px;height:14px;color:#34D399;"></i>
              <span>Savings Applied</span>
            </div>
            <div class="savings-applied-pill" style="background:rgba(52,211,153,0.12);color:#34D399;border:1px solid rgba(52,211,153,0.25);font-size:11px;font-weight:700;padding:3px 8px;border-radius:6px;">✓ Code ${code} Active</div>
          </div>
          <div style="font-size:12px;color:rgba(255,255,255,0.7);line-height:1.4;margin-top:6px;">
            Best available discount applied. Your order total has been updated.
          </div>
        `;
        if (window.lucide) window.lucide.createIcons();
      }

      if (typeof window.showToast === 'function') {
        window.showToast(`Promo code ${code} applied successfully!`);
      }
    }
  }

  window.NexSavingsUI = new CheckoutSavingsUI();

})(typeof window !== 'undefined' ? window : global);
