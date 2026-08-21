/**
 * nexCommerce — Delivery-Aware Shopping UI Controller (Capability 6)
 * Orchestrates header location pill, dark store hub modal selector,
 * countdown cutoff timers, and PLP express stock filtering.
 */
(function(window) {
  'use strict';

  class DeliveryGateUI {
    constructor() {
      this.activeHub = null;
      this.init();
    }

    init() {
      this.loadSavedHub();

      const runMount = () => {
        this.mountHeaderPill();
        this.buildModal();
        this.startCountdownTimer();
      };

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', runMount);
      } else {
        runMount();
      }
    }

    loadSavedHub() {
      if (!window.NexDeliveryEngine) return;
      const savedId = localStorage.getItem('nex_delivery_hub') || 'berlin-mitte';
      const hub = window.NexDeliveryEngine.DARK_STORE_HUBS.find(h => h.id === savedId);
      this.activeHub = hub || window.NexDeliveryEngine.DARK_STORE_HUBS[0];
    }

    mountHeaderPill() {
      if (!this.activeHub) this.loadSavedHub();
      if (!this.activeHub || !window.NexDeliveryEngine) return;

      const countdown = window.NexDeliveryEngine.getCutoffCountdown(this.activeHub.id);
      
      let pill = document.getElementById('headerDeliveryHubPill');
      if (!pill) {
        const targetContainer = document.querySelector('.header-actions') || document.querySelector('.site-nav') || document.querySelector('header');
        if (!targetContainer) return;

        pill = document.createElement('button');
        pill.id = 'headerDeliveryHubPill';
        pill.className = 'delivery-hub-pill';
        pill.setAttribute('aria-label', 'Change delivery location and dark store hub');
        
        if (targetContainer.classList.contains('header-actions')) {
          targetContainer.insertBefore(pill, targetContainer.firstChild);
        } else {
          targetContainer.appendChild(pill);
        }
      }

      pill.innerHTML = `
        <i data-lucide="map-pin" style="width:13px;height:13px;color:#3DE0FF;"></i>
        <span>${this.activeHub.city} (${this.activeHub.postcodes[0] || 'Hub'})</span>
        <span class="delivery-express-badge">⚡ ${countdown.formattedCountdown}</span>
      `;

      if (window.lucide) window.lucide.createIcons();

      pill.onclick = () => this.openHubModal();
    }

    buildModal() {
      let modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) return;

      modal = document.createElement('div');
      modal.id = 'deliveryHubModalOverlay';
      modal.className = 'delivery-hub-modal-overlay';

      const hubs = window.NexDeliveryEngine ? window.NexDeliveryEngine.DARK_STORE_HUBS : [];

      modal.innerHTML = `
        <div class="delivery-hub-modal" role="dialog" aria-modal="true" aria-label="Select Delivery Location">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;">
              <i data-lucide="map-pin" style="width:18px;height:18px;color:#3DE0FF;"></i>
              <h3 style="font-family:var(--font-serif);font-size:20px;color:#fff;margin:0;">Select Delivery Location</h3>
            </div>
            <button id="closeDeliveryModalBtn" style="background:none;border:none;color:rgba(255,255,255,0.4);font-size:20px;cursor:pointer;">&times;</button>
          </div>

          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.4;">
            Choose your nearest Dark Store Atelier for instant 45–60 min courier delivery and local boutique stock availability.
          </div>

          <div class="hub-selection-grid" id="hubSelectionGrid">
            ${hubs.map(h => `
              <div class="hub-card-item ${this.activeHub && this.activeHub.id === h.id ? 'selected' : ''}" data-hub-id="${h.id}">
                <div>
                  <div style="font-size:13px;font-weight:600;color:#fff;">${h.city} &middot; ${h.region}</div>
                  <div style="font-size:11px;color:rgba(255,255,255,0.4);">${h.courierPartner} &middot; ${h.deliveryTimeMin}</div>
                </div>
                <div class="delivery-express-badge">⚡ Same-Day</div>
              </div>
            `).join('')}
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      if (window.lucide) window.lucide.createIcons();

      const closeBtn = modal.querySelector('#closeDeliveryModalBtn');
      if (closeBtn) closeBtn.onclick = () => this.closeHubModal();
      modal.onclick = (e) => { if (e.target === modal) this.closeHubModal(); };

      modal.querySelectorAll('.hub-card-item').forEach(card => {
        card.onclick = () => {
          const hubId = card.getAttribute('data-hub-id');
          this.selectHub(hubId);
        };
      });
    }

    openHubModal() {
      const modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
      }
    }

    closeHubModal() {
      const modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
    }

    selectHub(hubId) {
      if (!window.NexDeliveryEngine) return;
      const hub = window.NexDeliveryEngine.DARK_STORE_HUBS.find(h => h.id === hubId);
      if (!hub) return;

      this.activeHub = hub;
      localStorage.setItem('nex_delivery_hub', hub.id);

      this.mountHeaderPill();
      this.closeHubModal();

      // Update active selection state in modal cards
      const modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) {
        modal.querySelectorAll('.hub-card-item').forEach(card => {
          card.classList.toggle('selected', card.getAttribute('data-hub-id') === hub.id);
        });
      }

      if (typeof window.showToast === 'function') {
        window.showToast(`📍 Switched fulfillment to ${hub.city} (${hub.region})`);
      }

      window.dispatchEvent(new CustomEvent('hub-changed', { detail: { hub: hub } }));
    }

    startCountdownTimer() {
      setInterval(() => {
        this.mountHeaderPill();
      }, 60000); // update every minute
    }
  }

  window.NexDeliveryUI = new DeliveryGateUI();

})(typeof window !== 'undefined' ? window : global);
