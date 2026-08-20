/**
 * ==========================================================================
 * nexCommerce — GDPR Interactive Cookie & Data Sovereignty Consent Suite
 * Conforms strictly to EU GDPR, ePrivacy Directive, and CJEU Planet49 (C-673/17).
 * ==========================================================================
 */

(function (window, document) {
  'use strict';

  const STORAGE_KEY = 'nex_cookie_consent';
  const CONSENT_VERSION = '1.0';
  const VALIDITY_DAYS = 180; // Standard 6-month European re-consent window

  const DEFAULT_CATEGORIES = {
    necessary: {
      name: 'Strictly Necessary',
      icon: 'shield-check',
      alwaysActive: true,
      description: 'Essential technical cookies required for core site security, user authentication, shopping bag persistence, and encrypted PCI-DSS settlement.',
      cookies: [
        { name: 'nex_cart', provider: 'nexCommerce Atelier', purpose: 'Shopping bag & checkout item state', expiry: '30 Days' },
        { name: 'nex_session_id', provider: 'nexCommerce Atelier', purpose: 'Encrypted ephemeral session token', expiry: 'Session' },
        { name: 'nex_cookie_consent', provider: 'nexCommerce Atelier', purpose: 'Stores proof and categories of data sovereignty consent', expiry: '180 Days' },
        { name: 'nex_3ds_nonce', provider: 'PSD2 Banking Enclave', purpose: 'Strong Customer Authentication (3DS2) transaction token', expiry: '15 Minutes' }
      ]
    },
    functional: {
      name: 'Preferences & Site Memory',
      icon: 'sliders',
      alwaysActive: false,
      description: 'Enables enhanced functionality such as currency preference retention (EUR €), theme switching (Light/Obsidian), and localized European address pre-filling.',
      cookies: [
        { name: 'nex_theme', provider: 'nexCommerce UI', purpose: 'Obsidian dark / Atelier light mode preference', expiry: '1 Year' },
        { name: 'nex_locale_pref', provider: 'nexCommerce UI', purpose: 'Selected EU country and language dialect', expiry: '1 Year' },
        { name: 'nex_recently_viewed', provider: 'nexCommerce Discovery', purpose: 'Stores recently viewed garments for fast navigation', expiry: '60 Days' }
      ]
    },
    analytics: {
      name: 'Performance & Telemetry',
      icon: 'bar-chart-2',
      alwaysActive: false,
      description: 'Measures Core Web Vitals (LCP, INP, CLS) and anonymous load speed telemetry without recording personally identifiable information (PII).',
      cookies: [
        { name: 'nex_vitals_telemetry', provider: 'nexCommerce Performance', purpose: 'Aggregated client render performance metrics', expiry: '90 Days' },
        { name: 'nex_error_beacon', provider: 'nexCommerce Sentry', purpose: 'Anonymous JavaScript runtime crash diagnostics', expiry: 'Session' }
      ]
    },
    marketing: {
      name: 'Personalized Style Concierge',
      icon: 'sparkles',
      alwaysActive: false,
      description: 'Powers adaptive editorial curation and allows the Neural Style Concierge to retain conversational sartorial preferences across visits.',
      cookies: [
        { name: 'nex_style_profile', provider: 'nexCommerce AI Lab', purpose: 'Sartorial silhouette, palette, and intent preferences', expiry: '180 Days' },
        { name: 'nex_concierge_history', provider: 'nexCommerce AI Lab', purpose: 'Retains active styling conversation context', expiry: '30 Days' }
      ]
    }
  };

  /**
   * Reads and validates stored consent object
   * @returns {Object|null}
   */
  function readConsent() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (!parsed || parsed.version !== CONSENT_VERSION) return null;

      // Check 180-day validity
      const timestamp = new Date(parsed.timestamp).getTime();
      const now = Date.now();
      const ageDays = (now - timestamp) / (1000 * 60 * 60 * 24);
      if (ageDays > VALIDITY_DAYS) {
        localStorage.removeItem(STORAGE_KEY);
        return null;
      }

      return parsed;
    } catch (e) {
      return null;
    }
  }

  /**
   * Writes consent object and dispatches event
   */
  function writeConsent(categories) {
    const payload = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      categories: {
        necessary: true, // Always true
        functional: Boolean(categories.functional),
        analytics: Boolean(categories.analytics),
        marketing: Boolean(categories.marketing)
      }
    };

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Unable to persist consent to localStorage:', e);
    }

    // Set fallback document cookie for SSR/hybrid compatibility
    const maxAge = VALIDITY_DAYS * 24 * 60 * 60;
    const cookieVal = encodeURIComponent(JSON.stringify(payload.categories));
    document.cookie = `nex_consent=${cookieVal}; path=/; max-age=${maxAge}; SameSite=Lax; Secure`;

    // Dispatch global custom event
    window.dispatchEvent(new CustomEvent('nex:cookie-consent-updated', {
      detail: { consent: payload.categories }
    }));

    return payload;
  }

  /**
   * Builds the DOM elements for Banner and Preferences Modal
   */
  function buildDOM() {
    if (document.getElementById('nexCookieBannerWrap')) return;

    // Detect path depth for links
    const inPages = /\/pages\//.test(window.location.pathname);
    const toPages = inPages ? '' : 'pages/';

    // 1. BANNER ELEMENT
    const banner = document.createElement('aside');
    banner.id = 'nexCookieBannerWrap';
    banner.className = 'nex-cookie-banner-wrap';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie and Data Sovereignty Consent');
    banner.innerHTML = `
      <div class="nex-cookie-banner-card">
        <div class="cookie-banner-main">
          <div class="cookie-banner-header">
            <span class="cookie-banner-badge">
              <i data-lucide="shield-check" style="width: 13px; height: 13px;"></i>
              <span>DATA SOVEREIGNTY</span>
            </span>
            <h3 class="cookie-banner-title">Your Privacy &amp; Cookie Choices</h3>
          </div>
          <p class="cookie-banner-desc">
            We use cookies and telemetry to secure transactions, remember preferences, and power our Neural Style Concierge. 
            Under European GDPR standards, you hold complete sovereignty over your data.
            Read our <a href="${toPages}privacy.html">Privacy Charter</a>.
          </p>
        </div>
        <div class="cookie-banner-actions">
          <button type="button" class="cookie-btn-accept" id="cookieAcceptAllBtn">
            <span>ACCEPT ALL</span>
          </button>
          <button type="button" class="cookie-btn-reject" id="cookieRejectAllBtn">
            <span>REJECT NON-ESSENTIAL</span>
          </button>
          <button type="button" class="cookie-btn-prefs" id="cookieOpenPrefsBtn">
            <i data-lucide="sliders" style="width: 14px; height: 14px;"></i>
            <span>PREFERENCES</span>
          </button>
        </div>
      </div>
    `;

    // 2. PREFERENCES MODAL ELEMENT
    const modal = document.createElement('div');
    modal.id = 'nexCookieModalOverlay';
    modal.className = 'nex-cookie-modal-overlay';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'cookieModalTitle');
    modal.innerHTML = `
      <div class="nex-cookie-modal-card">
        <div class="cookie-modal-header">
          <div class="cookie-modal-title-group">
            <span class="cookie-banner-badge" style="margin-bottom: 4px;">
              <i data-lucide="lock" style="width: 12px; height: 12px;"></i>
              <span>EU REGULATION &amp; TRANSPARENCY</span>
            </span>
            <h2 class="cookie-modal-title" id="cookieModalTitle">Privacy &amp; Cookie Preferences</h2>
            <p class="cookie-modal-subtitle">Customize granular data retention and telemetry permissions below.</p>
          </div>
          <button type="button" class="cookie-modal-close-btn" id="cookieModalCloseBtn" aria-label="Close preferences modal">
            <i data-lucide="x" style="width: 16px; height: 16px;"></i>
          </button>
        </div>

        <div class="cookie-modal-body" id="cookieModalCategories">
          <!-- Populated dynamically -->
        </div>

        <div class="cookie-modal-footer">
          <div class="cookie-footer-left">
            <button type="button" class="cookie-btn-reject" id="cookieModalRejectAllBtn" style="padding: 10px 18px; font-size: 11.5px;">
              REJECT NON-ESSENTIAL
            </button>
          </div>
          <div class="cookie-footer-right">
            <button type="button" class="cookie-btn-accept" id="cookieModalAcceptAllBtn" style="padding: 10px 20px; font-size: 11.5px; background: rgba(255,255,255,0.1); color: #FFF; border-color: rgba(255,255,255,0.2);">
              ACCEPT ALL
            </button>
            <button type="button" class="cookie-btn-accept" id="cookieModalSaveBtn" style="padding: 10px 24px; font-size: 11.5px;">
              SAVE PREFERENCES
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    document.body.appendChild(modal);

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    bindEvents();
  }

  /**
   * Renders the category cards inside the preferences modal
   */
  function renderCategories(currentConsent) {
    const container = document.getElementById('cookieModalCategories');
    if (!container) return;

    const consent = currentConsent || {
      necessary: true,
      functional: false,
      analytics: false,
      marketing: false
    };

    let html = '';
    Object.keys(DEFAULT_CATEGORIES).forEach(key => {
      const cat = DEFAULT_CATEGORIES[key];
      const isChecked = cat.alwaysActive || Boolean(consent[key]);
      const isDisabled = cat.alwaysActive ? 'disabled' : '';

      const tableRows = cat.cookies.map(c => `
        <tr>
          <td><code>${c.name}</code></td>
          <td>${c.provider}</td>
          <td>${c.purpose}</td>
          <td><span style="color: #94A3B8;">${c.expiry}</span></td>
        </tr>
      `).join('');

      html += `
        <div class="cookie-category-card" data-category="${key}">
          <div class="cookie-cat-header">
            <div class="cookie-cat-title-wrap">
              <i data-lucide="${cat.icon}" class="cookie-cat-icon"></i>
              <h4 class="cookie-cat-name">${cat.name}</h4>
            </div>
            <div>
              ${cat.alwaysActive ? `
                <span class="cookie-cat-always-badge">&#10003; ALWAYS ACTIVE</span>
              ` : `
                <label class="cookie-switch-label">
                  <input type="checkbox" class="cookie-switch-input" id="cookieToggle_${key}" ${isChecked ? 'checked' : ''} ${isDisabled} />
                  <span class="cookie-switch-slider"></span>
                </label>
              `}
            </div>
          </div>
          <p class="cookie-cat-desc">${cat.description}</p>
          <button type="button" class="cookie-cat-toggle-details" data-toggle-target="details_${key}">
            <span>View Technical Details (${cat.cookies.length} items)</span>
            <i data-lucide="chevron-down" style="width: 12px; height: 12px;"></i>
          </button>
          <div class="cookie-cat-table-wrap" id="details_${key}">
            <table class="cookie-table">
              <thead>
                <tr>
                  <th>Storage Key</th>
                  <th>Domain / Issuer</th>
                  <th>Purpose</th>
                  <th>Retention</th>
                </tr>
              </thead>
              <tbody>
                ${tableRows}
              </tbody>
            </table>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Bind accordion toggles
    container.querySelectorAll('.cookie-cat-toggle-details').forEach(btn => {
      btn.addEventListener('click', function () {
        const targetId = this.getAttribute('data-toggle-target');
        const target = document.getElementById(targetId);
        if (target) {
          const isOpen = target.classList.toggle('is-open');
          const chevron = this.querySelector('[data-lucide="chevron-down"], [data-lucide="chevron-up"]');
          if (chevron) {
            chevron.setAttribute('data-lucide', isOpen ? 'chevron-up' : 'chevron-down');
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
              window.lucide.createIcons();
            }
          }
        }
      });
    });

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  /**
   * Binds UI interactions for Banner and Modal
   */
  function bindEvents() {
    // Banner Actions
    const acceptBtn = document.getElementById('cookieAcceptAllBtn');
    const rejectBtn = document.getElementById('cookieRejectAllBtn');
    const prefsBtn  = document.getElementById('cookieOpenPrefsBtn');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => window.NexCookieConsent.acceptAll());
    }
    if (rejectBtn) {
      rejectBtn.addEventListener('click', () => window.NexCookieConsent.rejectAll());
    }
    if (prefsBtn) {
      prefsBtn.addEventListener('click', () => window.NexCookieConsent.openPreferences());
    }

    // Modal Actions
    const modalCloseBtn = document.getElementById('cookieModalCloseBtn');
    const modalAcceptBtn = document.getElementById('cookieModalAcceptAllBtn');
    const modalRejectBtn = document.getElementById('cookieModalRejectAllBtn');
    const modalSaveBtn   = document.getElementById('cookieModalSaveBtn');
    const modalOverlay   = document.getElementById('nexCookieModalOverlay');

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => window.NexCookieConsent.closePreferences());
    }
    if (modalAcceptBtn) {
      modalAcceptBtn.addEventListener('click', () => window.NexCookieConsent.acceptAll());
    }
    if (modalRejectBtn) {
      modalRejectBtn.addEventListener('click', () => window.NexCookieConsent.rejectAll());
    }
    if (modalSaveBtn) {
      modalSaveBtn.addEventListener('click', () => {
        const functional = document.getElementById('cookieToggle_functional')?.checked || false;
        const analytics  = document.getElementById('cookieToggle_analytics')?.checked || false;
        const marketing  = document.getElementById('cookieToggle_marketing')?.checked || false;

        window.NexCookieConsent.savePreferences({
          necessary: true,
          functional,
          analytics,
          marketing
        });
      });
    }

    // Click outside modal card to close
    if (modalOverlay) {
      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          window.NexCookieConsent.closePreferences();
        }
      });
    }

    // Global click delegation for [data-open-cookie-settings] or .footer-cookie-trigger
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-open-cookie-settings], [data-action="cookie-settings"], .footer-cookie-trigger');
      if (trigger) {
        e.preventDefault();
        window.NexCookieConsent.openPreferences();
      }
    });

    // Keyboard ESC listener
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('nexCookieModalOverlay');
        if (modal && modal.classList.contains('is-active')) {
          window.NexCookieConsent.closePreferences();
        }
      }
    });
  }

  /**
   * Public API Controller
   */
  window.NexCookieConsent = {
    init: function () {
      buildDOM();
      const existing = readConsent();
      if (!existing) {
        // Small graceful delay for initial appearance
        setTimeout(() => {
          const banner = document.getElementById('nexCookieBannerWrap');
          if (banner) banner.classList.add('is-visible');
        }, 500);
      }
    },

    getConsent: function () {
      const c = readConsent();
      return c ? c.categories : {
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      };
    },

    hasConsent: function (category) {
      if (category === 'necessary') return true;
      const consent = this.getConsent();
      return Boolean(consent[category]);
    },

    acceptAll: function () {
      const payload = writeConsent({
        necessary: true,
        functional: true,
        analytics: true,
        marketing: true
      });
      this.hideBanner();
      this.closePreferences();
      return payload;
    },

    rejectAll: function () {
      const payload = writeConsent({
        necessary: true,
        functional: false,
        analytics: false,
        marketing: false
      });
      this.hideBanner();
      this.closePreferences();
      return payload;
    },

    savePreferences: function (prefs) {
      const payload = writeConsent(prefs);
      this.hideBanner();
      this.closePreferences();
      return payload;
    },

    openPreferences: function () {
      buildDOM();
      const current = this.getConsent();
      renderCategories(current);
      const modal = document.getElementById('nexCookieModalOverlay');
      if (modal) modal.classList.add('is-active');
    },

    closePreferences: function () {
      const modal = document.getElementById('nexCookieModalOverlay');
      if (modal) modal.classList.remove('is-active');
    },

    hideBanner: function () {
      const banner = document.getElementById('nexCookieBannerWrap');
      if (banner) banner.classList.remove('is-visible');
    }
  };

  // Auto-init on DOMContentLoaded or immediate if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.NexCookieConsent.init());
  } else {
    window.NexCookieConsent.init();
  }

})(window, document);
