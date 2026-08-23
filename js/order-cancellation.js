/**
 * nexCommerce — Luxury Order Cancellation Engine (js/order-cancellation.js)
 * Manages order cancellation eligibility, structured reason collection,
 * immediate refund calculations, storage persistence, and global event dispatching.
 */

(function(global) {
  'use strict';

  const PLACED_ORDERS_KEY = 'nex_placed_orders';
  const CONFIRMED_ORDER_KEY = 'nex_confirmed_order';

  const REASON_OPTIONS = [
    {
      id: 'mistake',
      label: 'Placed by mistake / Accidental duplicate',
      desc: 'Order was submitted inadvertently or duplicated.'
    },
    {
      id: 'address',
      label: 'Need to update delivery address or recipient',
      desc: 'Shipping destination or recipient details require revision.'
    },
    {
      id: 'changed_mind',
      label: 'Found alternative piece / Changed mind',
      desc: 'Selected an alternate luxury piece or prefer to postpone.'
    },
    {
      id: 'delivery_time',
      label: 'Estimated delivery timeline too long',
      desc: 'Delivery window does not meet personal schedule.'
    },
    {
      id: 'payment_adjust',
      label: 'Payment or billing method adjustment',
      desc: 'Wish to re-order using a different corporate/private payment.'
    },
    {
      id: 'other',
      label: 'Other personal or styling reasons',
      desc: 'Please provide brief feedback to our client atelier.'
    }
  ];

  const NexOrderCancellation = {
    /**
     * Checks whether an order is eligible for cancellation.
     * Allowed: PREPARING, CONFIRMED, TRANSIT (pre-delivery).
     * Forbidden: DELIVERED, CANCELLED, null/undefined.
     */
    isEligible: function(order) {
      if (!order) return false;
      const status = String(order.status || '').toLowerCase().trim();
      if (!status) return false;
      if (status === 'delivered' || status === 'cancelled' || status === 'returned') {
        return false;
      }
      return true;
    },

    /**
     * Returns structured cancellation reasons.
     */
    getReasonOptions: function() {
      return REASON_OPTIONS.map(r => Object.assign({}, r));
    },

    /**
     * Computes refund breakdown details for an order.
     */
    calculateRefundDetails: function(order) {
      const total = Number(order ? (order.total !== undefined ? order.total : (order.subtotal || 0)) : 0);
      const currency = (order && order.currency) ? order.currency : 'EUR';
      const currencySymbol = (order && order.currencySymbol) ? order.currencySymbol : '€';
      const payment = (order && (order.paymentMethod || order.payment)) ? (order.paymentMethod || order.payment) : 'Original payment method';
      
      return {
        amount: total,
        currency: currency,
        currencySymbol: currencySymbol,
        formattedAmount: `${currencySymbol} ${total.toFixed(2)}`,
        targetMethod: payment,
        timelineDays: '2–3 business days',
        guarantee: '100% Full Atelier Reversal (Including VAT & Express Delivery)'
      };
    },

    /**
     * Finds an order from localStorage or sessionStorage by ID or Ref.
     */
    findOrder: function(orderIdOrRef) {
      if (!orderIdOrRef) return null;
      const cleanId = String(orderIdOrRef).trim().toLowerCase();

      // Check localStorage placed orders
      try {
        const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(PLACED_ORDERS_KEY) : null;
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const match = parsed.find(o => {
              const oId = String(o.id || o.ref || '').toLowerCase();
              return oId === cleanId;
            });
            if (match) return match;
          }
        }
      } catch (_) {}

      // Check sessionStorage confirmed order
      try {
        const sessionRaw = (typeof sessionStorage !== 'undefined') ? sessionStorage.getItem(CONFIRMED_ORDER_KEY) : null;
        if (sessionRaw) {
          const sessionOrder = JSON.parse(sessionRaw);
          if (sessionOrder) {
            const sId = String(sessionOrder.ref || sessionOrder.id || '').toLowerCase();
            if (sId === cleanId) return sessionOrder;
          }
        }
      } catch (_) {}

      return null;
    },

    /**
     * Executes order cancellation, mutating storage and dispatching event.
     */
    cancelOrder: function(orderIdOrRef, reasonId, note) {
      if (!orderIdOrRef) {
        return { success: false, message: 'Invalid order identifier.' };
      }

      const cleanId = String(orderIdOrRef).trim();
      const reasonObj = REASON_OPTIONS.find(r => r.id === reasonId) || REASON_OPTIONS[0];
      const cancellationReasonLabel = reasonObj ? reasonObj.label : 'Client requested cancellation';
      const cancelledAt = new Date().toISOString();

      let targetOrder = null;
      let updatedPlacedOrders = false;
      let updatedSessionOrder = false;

      // 1. Update localStorage placed orders
      try {
        if (typeof localStorage !== 'undefined') {
          const raw = localStorage.getItem(PLACED_ORDERS_KEY);
          let orders = raw ? JSON.parse(raw) : [];
          if (Array.isArray(orders)) {
            const idx = orders.findIndex(o => {
              const oId = String(o.id || o.ref || '').trim();
              return oId.toLowerCase() === cleanId.toLowerCase();
            });

            if (idx >= 0) {
              const existing = orders[idx];
              if (!this.isEligible(existing)) {
                return { success: false, message: 'Order is not eligible for cancellation.' };
              }
              existing.status = 'cancelled';
              existing.statusLabel = 'Cancelled';
              existing.progress = 0;
              existing.cancellationReasonId = reasonId || 'mistake';
              existing.cancellationReason = cancellationReasonLabel;
              existing.cancellationNote = note || '';
              existing.cancelledAt = cancelledAt;
              orders[idx] = existing;
              targetOrder = existing;
              localStorage.setItem(PLACED_ORDERS_KEY, JSON.stringify(orders));
              updatedPlacedOrders = true;
            }
          }
        }
      } catch (err) {
        console.error('Error updating localStorage during cancellation:', err);
      }

      // 2. Update sessionStorage confirmed order
      try {
        if (typeof sessionStorage !== 'undefined') {
          const sessionRaw = sessionStorage.getItem(CONFIRMED_ORDER_KEY);
          if (sessionRaw) {
            const sessionOrder = JSON.parse(sessionRaw);
            const sId = String(sessionOrder.ref || sessionOrder.id || '').trim();
            if (sId.toLowerCase() === cleanId.toLowerCase()) {
              if (!this.isEligible(sessionOrder) && !updatedPlacedOrders) {
                return { success: false, message: 'Order is not eligible for cancellation.' };
              }
              sessionOrder.status = 'CANCELLED';
              sessionOrder.statusLabel = 'Cancelled';
              sessionOrder.progress = 0;
              sessionOrder.cancellationReasonId = reasonId || 'mistake';
              sessionOrder.cancellationReason = cancellationReasonLabel;
              sessionOrder.cancellationNote = note || '';
              sessionOrder.cancelledAt = cancelledAt;
              sessionStorage.setItem(CONFIRMED_ORDER_KEY, JSON.stringify(sessionOrder));
              if (!targetOrder) targetOrder = sessionOrder;
              updatedSessionOrder = true;
            }
          }
        }
      } catch (err) {
        console.error('Error updating sessionStorage during cancellation:', err);
      }

      // 3. Fallback mock order if neither storage had it (e.g. static mock in tracking / account)
      if (!targetOrder) {
        targetOrder = {
          id: cleanId,
          ref: cleanId,
          status: 'cancelled',
          statusLabel: 'Cancelled',
          progress: 0,
          total: 285.00,
          payment: 'Original payment method',
          cancellationReasonId: reasonId || 'mistake',
          cancellationReason: cancellationReasonLabel,
          cancellationNote: note || '',
          cancelledAt: cancelledAt
        };
      }

      // 4. Update in-memory global references if any
      if (typeof window !== 'undefined') {
        if (window.__trackingOrder && String(window.__trackingOrder.ref || window.__trackingOrder.id || '').toLowerCase() === cleanId.toLowerCase()) {
          window.__trackingOrder.status = 'CANCELLED';
          window.__trackingOrder.statusLabel = 'Cancelled';
          window.__trackingOrder.cancellationReason = cancellationReasonLabel;
          window.__trackingOrder.cancelledAt = cancelledAt;
        }

        // 5. Dispatch global CustomEvent
        const refundDetails = this.calculateRefundDetails(targetOrder);
        const eventDetail = {
          orderId: targetOrder.id || targetOrder.ref || cleanId,
          order: targetOrder,
          refundAmount: refundDetails.amount,
          refundFormatted: refundDetails.formattedAmount,
          reason: cancellationReasonLabel,
          cancelledAt: cancelledAt
        };

        const customEvent = new (window.CustomEvent || CustomEvent)('nex:order-cancelled', {
          detail: eventDetail,
          bubbles: true
        });
        window.dispatchEvent(customEvent);
      }

      return {
        success: true,
        order: targetOrder,
        message: 'Order cancelled successfully. Full refund initiated.'
      };
    },

    /* ─── UI Modal Controller ──────────────────────────────────── */

    activeOrderId: null,
    onSuccessCallback: null,

    /**
     * Initializes modal HTML markup on the page if not present.
     */
    ensureModalDOM: function() {
      if (typeof document === 'undefined') return;
      let modal = document.getElementById('nexCancelOrderModal');
      if (modal) return modal;

      modal = document.createElement('div');
      modal.id = 'nexCancelOrderModal';
      modal.className = 'order-cancel-modal-overlay';
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', 'cancelModalTitle');
      modal.style.display = 'none';

      modal.innerHTML = `
        <div class="order-cancel-modal-card" data-lenis-prevent>
          <button type="button" class="cancel-modal-close-btn" id="nexCloseCancelModalBtn" aria-label="Close cancellation window">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          <div class="cancel-modal-header">
            <div class="cancel-modal-badge">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
              <span>CLIENT ORDER CANCELLATION</span>
            </div>
            <h2 id="cancelModalTitle" class="cancel-modal-title">Request Order Cancellation</h2>
            <p class="cancel-modal-subtitle">
              Order <strong id="cancelModalOrderId" style="color: #FFFFFF; font-family: var(--font-mono, monospace);">ORD-XXXX</strong> can be cancelled instantly with zero penalty.
            </p>
          </div>

          <!-- Refund Notice Banner -->
          <div class="cancel-refund-notice" id="cancelModalRefundBox">
            <div class="refund-notice-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="m9 12 2 2 4-4"></path></svg>
            </div>
            <div class="refund-notice-body">
              <div class="refund-notice-headline">
                Full Refund: <span id="cancelModalRefundAmount" class="tabular-nums" style="color: var(--accent-cyan, #3DE0FF); font-weight: 700;">€ 0.00</span>
              </div>
              <div class="refund-notice-sub" id="cancelModalRefundTarget">
                100% reimbursed to your payment method within 2–3 business days.
              </div>
            </div>
          </div>

          <!-- Reason Selection -->
          <div class="cancel-modal-section">
            <label class="cancel-section-label">Please select a reason for cancellation:</label>
            <div class="cancel-reasons-list" id="cancelModalReasonsList" role="radiogroup"></div>
          </div>

          <!-- Custom Note -->
          <div class="cancel-modal-section" style="margin-top: 14px;">
            <label for="cancelModalNoteInput" class="cancel-section-label">Additional notes (optional):</label>
            <textarea id="cancelModalNoteInput" class="cancel-note-textarea" rows="2" placeholder="Tell our atelier concierge if you'd like us to find a different size or style..."></textarea>
          </div>

          <!-- Error Alert -->
          <div id="cancelModalError" class="cancel-modal-error" style="display: none;"></div>

          <!-- Actions -->
          <div class="cancel-modal-actions">
            <button type="button" class="btn-cancel-destructive" id="nexConfirmCancelBtn">
              <span>CONFIRM CANCELLATION</span>
            </button>
            <button type="button" class="btn-secondary-action" id="nexKeepOrderBtn" style="height: 44px;">
              <span>KEEP MY ORDER</span>
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(modal);

      // Event bindings
      const closeBtn = document.getElementById('nexCloseCancelModalBtn');
      const keepBtn = document.getElementById('nexKeepOrderBtn');
      const confirmBtn = document.getElementById('nexConfirmCancelBtn');

      if (closeBtn) closeBtn.addEventListener('click', () => NexOrderCancellation.closeModal());
      if (keepBtn) keepBtn.addEventListener('click', () => NexOrderCancellation.closeModal());
      if (confirmBtn) confirmBtn.addEventListener('click', () => NexOrderCancellation.handleModalConfirm());

      modal.addEventListener('click', (e) => {
        if (e.target === modal) NexOrderCancellation.closeModal();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
          NexOrderCancellation.closeModal();
        }
      });

      return modal;
    },

    /**
     * Opens the cancellation modal for a given order ID or object.
     */
    openModal: function(orderIdOrRef, onSuccessCallback) {
      if (typeof document === 'undefined') return;
      const modal = this.ensureModalDOM();
      if (!modal) return;

      this.activeOrderId = typeof orderIdOrRef === 'object' ? (orderIdOrRef.id || orderIdOrRef.ref) : orderIdOrRef;
      this.onSuccessCallback = typeof onSuccessCallback === 'function' ? onSuccessCallback : null;

      const order = typeof orderIdOrRef === 'object' ? orderIdOrRef : (this.findOrder(this.activeOrderId) || { id: this.activeOrderId, total: 285.00 });
      const refund = this.calculateRefundDetails(order);

      const idEl = document.getElementById('cancelModalOrderId');
      const amtEl = document.getElementById('cancelModalRefundAmount');
      const tgtEl = document.getElementById('cancelModalRefundTarget');
      const errorEl = document.getElementById('cancelModalError');
      const noteInput = document.getElementById('cancelModalNoteInput');

      if (idEl) idEl.textContent = this.activeOrderId || 'ORD-UNKNOWN';
      if (amtEl) amtEl.textContent = refund.formattedAmount;
      if (tgtEl) tgtEl.textContent = `100% credited back to ${refund.targetMethod} within ${refund.timelineDays}.`;
      if (errorEl) { errorEl.style.display = 'none'; errorEl.textContent = ''; }
      if (noteInput) noteInput.value = '';

      // Populate reasons
      const reasonsList = document.getElementById('cancelModalReasonsList');
      if (reasonsList) {
        reasonsList.innerHTML = REASON_OPTIONS.map((r, i) => `
          <label class="cancel-reason-item ${i === 0 ? 'selected' : ''}" for="reason_${r.id}">
            <input type="radio" name="cancel_reason" id="reason_${r.id}" value="${r.id}" ${i === 0 ? 'checked' : ''} class="cancel-reason-radio" />
            <div class="cancel-reason-info">
              <span class="cancel-reason-title">${r.label}</span>
              <span class="cancel-reason-desc">${r.desc}</span>
            </div>
          </label>
        `).join('');

        // Selection highlight binding
        const items = reasonsList.querySelectorAll('.cancel-reason-item');
        items.forEach(item => {
          item.addEventListener('click', () => {
            items.forEach(i => i.classList.remove('selected'));
            item.classList.add('selected');
            const radio = item.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;
          });
        });
      }

      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';

      // Pause Lenis smooth scroll if active
      if (window._nexLenis && typeof window._nexLenis.stop === 'function') {
        window._nexLenis.stop();
      }
    },

    /**
     * Closes the cancellation modal.
     */
    closeModal: function() {
      if (typeof document === 'undefined') return;
      const modal = document.getElementById('nexCancelOrderModal');
      if (modal) modal.style.display = 'none';
      document.body.style.overflow = '';

      if (window._nexLenis && typeof window._nexLenis.start === 'function') {
        window._nexLenis.start();
      }
    },

    /**
     * Handles modal confirm button click.
     */
    handleModalConfirm: function() {
      const checkedRadio = document.querySelector('input[name="cancel_reason"]:checked');
      const reasonId = checkedRadio ? checkedRadio.value : 'mistake';
      const noteInput = document.getElementById('cancelModalNoteInput');
      const note = noteInput ? noteInput.value.trim() : '';

      const result = this.cancelOrder(this.activeOrderId, reasonId, note);
      if (!result.success) {
        const errorEl = document.getElementById('cancelModalError');
        if (errorEl) {
          errorEl.textContent = result.message || 'Unable to cancel order.';
          errorEl.style.display = 'block';
        }
        return;
      }

      this.closeModal();

      if (this.onSuccessCallback) {
        this.onSuccessCallback(result);
      }
    }
  };

  // Expose to window / Node export
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = NexOrderCancellation;
  }
  if (typeof global !== 'undefined') {
    global.NexOrderCancellation = NexOrderCancellation;
  }

  // Auto-init modal on DOM load if in browser
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => NexOrderCancellation.ensureModalDOM());
    } else {
      NexOrderCancellation.ensureModalDOM();
    }
  }
})(typeof window !== 'undefined' ? window : global);
