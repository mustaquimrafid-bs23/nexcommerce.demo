/**
 * nexCommerce — Delivery-Aware Shopping UI Controller (Capability 6)
 * Orchestrates header location pill, dark store hub modal selector,
 * countdown cutoff timers, postal search, geolocation, and PLP express stock filtering.
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
        this.mountMobileDrawerPill();
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
      
      let wrapper = document.getElementById('headerDeliveryHubWrapper');
      if (!wrapper) {
        const targetContainer = document.querySelector('.nav-right-actions') || 
                                document.querySelector('.header-actions') || 
                                document.querySelector('.nav-inner') || 
                                document.querySelector('header');
        if (!targetContainer) return;

        wrapper = document.createElement('div');
        wrapper.id = 'headerDeliveryHubWrapper';
        wrapper.className = 'delivery-hub-pill-wrapper desktop-only';
        
        if (targetContainer.classList.contains('nav-right-actions') || targetContainer.classList.contains('header-actions')) {
          targetContainer.insertBefore(wrapper, targetContainer.firstChild);
        } else {
          targetContainer.appendChild(wrapper);
        }
      }

      const tooltipDesc = countdown.isCutoffPassed
        ? `Cutoff passed for today. Orders placed now will be dispatched tomorrow morning at 10:00 AM via <span class="highlight-courier">${this.activeHub.courierPartner}</span>.`
        : `Order within <strong>${countdown.hoursRemaining > 0 ? countdown.hoursRemaining + 'h ' : ''}${countdown.minutesRemaining}m</strong> for guaranteed <strong>${this.activeHub.deliveryTimeMin} courier delivery</strong> in ${this.activeHub.city} via <span class="highlight-courier">${this.activeHub.courierPartner}</span>.`;

      wrapper.innerHTML = `
        <button id="headerDeliveryHubPill" class="delivery-hub-pill" aria-label="Select delivery location and dark store hub" aria-haspopup="dialog">
          <i data-lucide="map-pin" class="delivery-pin-icon"></i>
          <span class="delivery-location-label">${this.activeHub.city} · ${this.activeHub.postcodes[0] || 'Hub'}</span>
          <span class="delivery-express-badge">⚡ ${countdown.formattedCountdown}</span>
        </button>
        <div class="delivery-hub-tooltip" role="tooltip">
          <div class="tooltip-title">
            <i data-lucide="zap" style="width:12px;height:12px;color:#3DE0FF;"></i>
            <span>Same-Day Express Dispatch</span>
          </div>
          <div class="tooltip-desc">${tooltipDesc}</div>
          <div class="tooltip-footer">Click to change location or dark store atelier</div>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons();

      const pillBtn = wrapper.querySelector('#headerDeliveryHubPill');
      if (pillBtn) {
        pillBtn.onclick = () => this.openHubModal();
      }
    }

    mountMobileDrawerPill() {
      if (!this.activeHub) this.loadSavedHub();
      if (!this.activeHub || !window.NexDeliveryEngine) return;

      const countdown = window.NexDeliveryEngine.getCutoffCountdown(this.activeHub.id);
      const drawer = document.getElementById('mobileNavDrawer');
      if (!drawer) return;

      let card = document.getElementById('mobileDrawerDeliveryPill');
      if (!card) {
        card = document.createElement('div');
        card.id = 'mobileDrawerDeliveryPill';
        card.className = 'mobile-drawer-delivery-card';
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Select delivery location and dark store hub');

        const navContainer = drawer.querySelector('.mobile-drawer-nav') || drawer;
        const firstLink = navContainer.querySelector('.mobile-drawer-link') || navContainer.querySelector('a');
        if (firstLink) {
          navContainer.insertBefore(card, firstLink);
        } else {
          navContainer.appendChild(card);
        }
      }

      card.innerHTML = `
        <div class="m-delivery-left">
          <div class="m-delivery-pin-badge">
            <i data-lucide="map-pin" style="width:14px;height:14px;color:#3DE0FF;"></i>
          </div>
          <div class="m-delivery-meta">
            <div class="m-delivery-heading">DELIVERY LOCATION</div>
            <div class="m-delivery-city">${this.activeHub.city} · ${this.activeHub.postcodes[0] || 'Hub'} <span class="m-delivery-timer">⚡ ${countdown.formattedCountdown}</span></div>
          </div>
        </div>
        <div class="m-delivery-change-btn">
          <span>CHANGE</span>
          <i data-lucide="chevron-right" style="width:12px;height:12px;"></i>
        </div>
      `;

      if (window.lucide) window.lucide.createIcons({ nodes: [card] });

      card.onclick = () => {
        const closeBtn = document.getElementById('closeMobileDrawerBtn');
        if (closeBtn) {
          closeBtn.click();
        } else {
          drawer.classList.remove('open', 'active');
          drawer.setAttribute('aria-hidden', 'true');
        }
        setTimeout(() => this.openHubModal(), 150);
      };

      card.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          card.onclick();
        }
      };
    }

    buildModal() {
      let modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) return;

      modal = document.createElement('div');
      modal.id = 'deliveryHubModalOverlay';
      modal.className = 'delivery-hub-modal-overlay';
      modal.setAttribute('data-lenis-prevent', '');

      modal.innerHTML = `
        <div class="delivery-hub-modal" role="dialog" aria-modal="true" aria-label="Select Delivery Location" data-lenis-prevent>
          <div class="modal-mobile-handle"></div>
          
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <div style="display:flex;align-items:center;gap:8px;">
              <i data-lucide="map-pin" style="width:18px;height:18px;color:#3DE0FF;"></i>
              <h3 style="font-family:var(--font-serif);font-size:20px;color:#fff;margin:0;letter-spacing:-0.02em;">Select Delivery Location</h3>
            </div>
            <button id="closeDeliveryModalBtn" style="background:none;border:none;color:rgba(255,255,255,0.4);font-size:24px;line-height:1;cursor:pointer;padding:4px;" aria-label="Close modal">&times;</button>
          </div>

          <div style="font-size:12px;color:rgba(255,255,255,0.65);line-height:1.45;">
            Choose your nearest Dark Store Atelier for instant 45–60 min courier delivery and local boutique stock availability.
          </div>

          <div class="hub-search-box">
            <i data-lucide="search" style="width:16px;height:16px;color:rgba(255,255,255,0.4);"></i>
            <input type="text" id="hubPostalSearchInput" placeholder="Enter postal code or city (e.g. 10115, Paris, W1K)..." autocomplete="off" aria-label="Enter postal code or city" />
            <button id="hubClearSearchBtn" class="hub-clear-search-btn" style="display:none;" aria-label="Clear search">&times;</button>
          </div>

          <button id="hubGpsDetectBtn" class="hub-gps-btn" type="button">
            <i data-lucide="navigation" style="width:14px;height:14px;"></i>
            <span>Use My Current Location</span>
          </button>

          <div class="hub-selection-grid" id="hubSelectionGrid" data-lenis-prevent></div>

          <div id="hubFallbackBanner" style="display:none;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,0.03);border:1px dashed rgba(255,255,255,0.15);font-size:12px;color:rgba(255,255,255,0.65);">
            <div style="font-weight:600;color:#fff;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
              <span>🚚 European Central Atelier</span>
            </div>
            Deliveries outside express zones arrive in 2–3 business days via DHL Carbon-Neutral.
          </div>
        </div>
      `;

      document.body.appendChild(modal);
      if (window.lucide) window.lucide.createIcons();

      this.renderHubList();

      const closeBtn = modal.querySelector('#closeDeliveryModalBtn');
      if (closeBtn) closeBtn.onclick = () => this.closeHubModal();
      modal.onclick = (e) => { if (e.target === modal) this.closeHubModal(); };

      // Search input handler
      const searchInput = modal.querySelector('#hubPostalSearchInput');
      const clearBtn = modal.querySelector('#hubClearSearchBtn');

      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          const val = e.target.value;
          if (clearBtn) clearBtn.style.display = val ? 'flex' : 'none';
          this.renderHubList(val);
        });
      }

      if (clearBtn && searchInput) {
        clearBtn.onclick = () => {
          searchInput.value = '';
          clearBtn.style.display = 'none';
          this.renderHubList('');
          searchInput.focus();
        };
      }

      // Geolocation detector handler
      const gpsBtn = modal.querySelector('#hubGpsDetectBtn');
      if (gpsBtn) {
        gpsBtn.onclick = () => this.detectUserLocation();
      }
    }

    renderHubList(searchQuery = '') {
      const grid = document.getElementById('hubSelectionGrid');
      const fallbackBanner = document.getElementById('hubFallbackBanner');
      if (!grid || !window.NexDeliveryEngine) return;

      const hubs = window.NexDeliveryEngine.searchHubs(searchQuery);

      if (hubs.length === 0) {
        grid.innerHTML = `
          <div style="text-align:center;padding:24px 12px;color:rgba(255,255,255,0.4);font-size:13px;">
            No express atelier found for "<strong>${searchQuery}</strong>".
          </div>
        `;
        if (fallbackBanner) fallbackBanner.style.display = 'block';
        return;
      }

      if (fallbackBanner) fallbackBanner.style.display = 'none';

      grid.innerHTML = hubs.map(h => {
        const isSelected = this.activeHub && this.activeHub.id === h.id;
        return `
          <div class="hub-card-item ${isSelected ? 'selected' : ''}" data-hub-id="${h.id}" role="button" tabindex="0">
            <div style="display:flex;align-items:center;">
              <div class="hub-radio-check">
                ${isSelected ? '<i data-lucide="check" style="width:11px;height:11px;stroke-width:3;"></i>' : ''}
              </div>
              <div>
                <div style="font-size:13px;font-weight:600;color:#fff;">${h.city} · ${h.region}</div>
                <div style="font-size:11px;color:rgba(255,255,255,0.45);margin-top:2px;">
                  ${h.courierPartner} · ${h.deliveryTimeMin}
                </div>
              </div>
            </div>
            <div class="delivery-express-badge">⚡ Same-Day</div>
          </div>
        `;
      }).join('');

      if (window.lucide) window.lucide.createIcons();

      grid.querySelectorAll('.hub-card-item').forEach(card => {
        card.onclick = () => {
          const hubId = card.getAttribute('data-hub-id');
          this.selectHub(hubId);
        };
        card.onkeydown = (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const hubId = card.getAttribute('data-hub-id');
            this.selectHub(hubId);
          }
        };
      });
    }

    detectUserLocation() {
      const gpsBtn = document.getElementById('hubGpsDetectBtn');
      if (!navigator.geolocation) {
        if (typeof window.showToast === 'function') {
          window.showToast('Geolocation is not supported by your browser.');
        }
        return;
      }

      if (gpsBtn) {
        gpsBtn.innerHTML = `<i data-lucide="loader-2" style="width:14px;height:14px;animation:spin 1s linear infinite;"></i><span>Detecting location...</span>`;
        if (window.lucide) window.lucide.createIcons();
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (gpsBtn) {
            gpsBtn.innerHTML = `<i data-lucide="navigation" style="width:14px;height:14px;"></i><span>Use My Current Location</span>`;
            if (window.lucide) window.lucide.createIcons();
          }

          if (window.NexDeliveryEngine && typeof window.NexDeliveryEngine.getNearestHub === 'function') {
            const nearest = window.NexDeliveryEngine.getNearestHub(pos.coords.latitude, pos.coords.longitude);
            if (nearest) {
              this.selectHub(nearest.id);
            }
          }
        },
        () => {
          if (gpsBtn) {
            gpsBtn.innerHTML = `<i data-lucide="navigation" style="width:14px;height:14px;"></i><span>Use My Current Location</span>`;
            if (window.lucide) window.lucide.createIcons();
          }
          if (typeof window.showToast === 'function') {
            window.showToast('Location access denied. Please select your atelier from the list.');
          }
        },
        { timeout: 8000 }
      );
    }

    openHubModal() {
      const modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        if (window._nexLenis && typeof window._nexLenis.stop === 'function') {
          window._nexLenis.stop();
        }
        
        // Reset search input on open
        const searchInput = modal.querySelector('#hubPostalSearchInput');
        const clearBtn = modal.querySelector('#hubClearSearchBtn');
        if (searchInput) {
          searchInput.value = '';
          if (clearBtn) clearBtn.style.display = 'none';
          this.renderHubList('');
          setTimeout(() => searchInput.focus(), 50);
        }
      }
    }

    closeHubModal() {
      const modal = document.getElementById('deliveryHubModalOverlay');
      if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
        if (window._nexLenis && typeof window._nexLenis.start === 'function') {
          window._nexLenis.start();
        }
      }
    }

    selectHub(hubId) {
      if (!window.NexDeliveryEngine) return;
      const hub = window.NexDeliveryEngine.DARK_STORE_HUBS.find(h => h.id === hubId);
      if (!hub) return;

      this.activeHub = hub;
      localStorage.setItem('nex_delivery_hub', hub.id);

      this.mountHeaderPill();
      this.mountMobileDrawerPill();
      this.closeHubModal();

      // Show luxury confirmation toast
      const toastMsg = `📍 Delivery location set to ${hub.city} (${hub.postcodes[0] || hub.region}). Local stock refreshed.`;
      if (typeof window.showToast === 'function') {
        window.showToast(toastMsg);
      } else {
        console.log(toastMsg);
      }

      window.dispatchEvent(new CustomEvent('hub-changed', { detail: { hub: hub } }));
      window.dispatchEvent(new CustomEvent('nex:hub-changed', { detail: { hub: hub } }));
    }

    startCountdownTimer() {
      setInterval(() => {
        this.mountHeaderPill();
        this.mountMobileDrawerPill();
      }, 60000); // update every minute
    }
  }

  window.NexDeliveryUI = new DeliveryGateUI();

})(typeof window !== 'undefined' ? window : global);
