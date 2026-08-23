/**
 * nexCommerce Shared Site Footer
 * Single source of truth for the global footer markup, rendered into
 * <footer class="site-footer" role="contentinfo" data-footer-mount></footer>
 * so every page stays in sync instead of drifting via copy-pasted HTML.
 *
 * Must load BEFORE theme-switcher.js (it looks for the footer container
 * on execution) and AFTER lucide.js (it calls lucide.createIcons()).
 */
(function () {
  'use strict';

  function renderFooter() {
    var mount = document.querySelector('.site-footer[data-footer-mount]');
    if (!mount) return;

    var inPages = /\/pages\//.test(window.location.pathname);
    var toRoot = inPages ? '../' : '';
    var toPages = inPages ? '' : 'pages/';

    mount.innerHTML =
      '<div class="container">' +
        '<div class="footer-main-grid">' +
          '<!-- Column 1: Brand Manifesto & Social Channels -->' +
          '<div class="footer-brand-col">' +
            '<a href="' + toRoot + 'index.html" aria-label="nexCommerce Home" style="display: inline-block; text-decoration: none;">' +
              '<img src="' + toRoot + 'assets/images/brand/logo_light.png" alt="nexCommerce" class="footer-logo-img" />' +
            '</a>' +
            '<p class="footer-brand-desc">Intelligent modern commerce. Curated ready-to-wear, footwear, and acoustic craft.</p>' +
            '<div class="footer-social-row">' +
              '<a href="#" aria-label="nexCommerce on Instagram" title="Instagram" class="footer-social-link">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>' +
              '</a>' +
              '<a href="#" aria-label="nexCommerce on TikTok" title="TikTok" class="footer-social-link">' +
                '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.27 8.27 0 0 0 4.84 1.55V7a4.85 4.85 0 0 1-1.07-.31z"/></svg>' +
              '</a>' +
              '<a href="#" aria-label="nexCommerce on LinkedIn" title="LinkedIn" class="footer-social-link">' +
                '<svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>' +
              '</a>' +
            '</div>' +
          '</div>' +
          '<!-- Column 2: About (Strictly 3 Simple Links) -->' +
          '<div class="footer-nav-col">' +
            '<span class="footer-col-heading">ABOUT</span>' +
            '<a href="' + toPages + 'about.html" class="footer-link-item">About Us</a>' +
            '<a href="' + toPages + 'privacy.html" class="footer-link-item">Privacy Policy</a>' +
            '<a href="' + toPages + 'terms.html" class="footer-link-item">Terms of Service</a>' +
          '</div>' +
          '<!-- Column 3: Newsletter (Clear & Human) -->' +
          '<div class="footer-newsletter-col">' +
            '<span class="footer-col-heading">NEWSLETTER</span>' +
            '<p class="footer-newsletter-sub">Get updates on new seasonal drops and exclusive releases.</p>' +
            '<form id="footerNewsletterForm" class="footer-newsletter-form">' +
              '<input type="email" id="footerNewsletterEmail" name="newsletter_email" class="footer-newsletter-input" placeholder="Enter your email" required aria-label="Email for newsletter" autocomplete="email" />' +
              '<button type="submit" class="footer-newsletter-btn">Subscribe</button>' +
            '</form>' +
            '<span class="footer-newsletter-fineprint">No spam. Unsubscribe at any time.</span>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom-bar">' +
          '<div class="footer-copy-col">' +
            '<div class="footer-copy-text">&copy; 2026 nexCommerce Atelier Inc. All rights reserved.</div>' +
            '<div class="footer-legal-sub">All prices incl. statutory VAT &middot; <a href="' + toPages + 'privacy.html" class="footer-legal-link">Privacy</a> &middot; <a href="' + toPages + 'terms.html" class="footer-legal-link">Terms</a> &middot; <button type="button" class="footer-cookie-trigger footer-legal-link" data-open-cookie-settings>Cookie Settings</button></div>' +
          '</div>' +
          '<div class="footer-payment-badges" aria-label="Accepted European Payment Methods">' +
            '<div class="payment-brand-badge" title="Apple Pay"><span>Pay</span></div>' +
            '<div class="payment-brand-badge" title="Visa">VISA</div>' +
            '<div class="payment-brand-badge" title="Mastercard">Mastercard</div>' +
            '<div class="payment-brand-badge" title="Klarna">Klarna.</div>' +
          '</div>' +
          '<div class="footer-locale-col">' +
            '<div class="footer-locale-selector">' +
              '<i data-lucide="globe" style="width: 13px; height: 13px;"></i>' +
              '<span>Europe &middot; EUR (&euro;)</span>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';

    var form = document.getElementById('footerNewsletterForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Thank you for subscribing to The Private Edit.');
      });
    }

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    document.dispatchEvent(new CustomEvent('nex:footer-rendered'));
  }

  renderFooter();

  function renderTourButton() {
    var inPages = /\/pages\//.test(window.location.pathname);
    var toRoot  = inPages ? '../' : '';
    var toPages = inPages ? '' : 'pages/';

    var S = {
      search:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
      compass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
      ruler:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
      mic:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>',
      wallet:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
      refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
      zap:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
    };

    var phases = [
      { label: 'Discover', features: [
        { icon: S.search,  bg: 'rgba(61,224,255,0.1)',  color: '#3DE0FF', name: 'AI Search',            tagline: 'Type anything natural — the AI reads your intent',        demo: 'ai-search' },
        { icon: S.compass, bg: 'rgba(61,224,255,0.1)',  color: '#3DE0FF', name: 'Intelligent Discovery', tagline: 'Style-prompt filtering with preset lenses',              path: toPages + 'discovery.html' },
      ]},
      { label: 'Fit & Style', features: [
        { icon: S.ruler,   bg: 'rgba(241,51,101,0.1)', color: '#F13365', name: 'Size Advisor',          tagline: 'Save your measurements, get your size on every product', path: toPages + 'size-guide.html' },
        { icon: S.mic,     bg: 'rgba(241,51,101,0.1)', color: '#F13365', name: 'AI Concierge + Voice',  tagline: 'Chat assistant for styling, orders, and sizing',         path: toPages + 'concierge.html' },
      ]},
      { label: 'Shop Smart', features: [
        { icon: S.wallet,  bg: 'rgba(52,211,153,0.1)', color: '#34D399', name: 'Budget Cart Builder',   tagline: 'AI builds a complete outfit within your cap',            path: toPages + 'cart.html' },
        { icon: S.refresh, bg: 'rgba(52,211,153,0.1)', color: '#34D399', name: 'Smart Reorder',         tagline: 'Capsule wardrobe builder from a style prompt',           path: toPages + 'smart-list.html' },
      ]},
      { label: 'Recovery', features: [
        { icon: S.zap,     bg: 'rgba(61,224,255,0.1)', color: '#3DE0FF', name: 'Cart Recovery',         tagline: 'Exit-intent offer — move cursor up after adding to cart', demo: 'cart-recovery' },
      ]},
    ];

    var rowsHtml = '';
    phases.forEach(function(phase) {
      rowsHtml += '<div class="ai-tour-phase-label">' + phase.label + '</div>';
      phase.features.forEach(function(f) {
        if (f.demo) {
          rowsHtml += '<button type="button" class="ai-tour-feature-row" data-tour-demo="' + f.demo + '" style="--row-accent:' + f.color + '">' +
            '<div class="ai-tour-feat-icon" style="background:' + f.bg + ';color:' + f.color + '">' + f.icon + '</div>' +
            '<div class="ai-tour-feat-body">' +
              '<div class="ai-tour-feat-name">' + f.name + '</div>' +
              '<div class="ai-tour-feat-tagline">' + f.tagline + '</div>' +
            '</div>' +
            '<div class="ai-tour-feat-arrow">→</div>' +
          '</button>';
        } else {
          rowsHtml += '<a href="' + f.path + '" class="ai-tour-feature-row" style="--row-accent:' + f.color + '">' +
            '<div class="ai-tour-feat-icon" style="background:' + f.bg + ';color:' + f.color + '">' + f.icon + '</div>' +
            '<div class="ai-tour-feat-body">' +
              '<div class="ai-tour-feat-name">' + f.name + '</div>' +
              '<div class="ai-tour-feat-tagline">' + f.tagline + '</div>' +
            '</div>' +
            '<div class="ai-tour-feat-arrow">→</div>' +
          '</a>';
        }
      });
    });

    // Floating button
    var btn = document.createElement('button');
    btn.id = 'aiTourFloatingBtn';
    btn.setAttribute('aria-label', 'View AI Features');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="ai-tour-btn-dot"></span> AI Features';
    document.body.appendChild(btn);

    // Modal
    var modal = document.createElement('div');
    modal.id = 'aiTourModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'AI Features overview');

    modal.innerHTML =
      '<div class="ai-tour-panel">' +
        '<div class="ai-tour-panel-accent"></div>' +
        '<div class="ai-tour-panel-head">' +
          '<div>' +
            '<div class="ai-tour-panel-title">AI Capabilities</div>' +
            '<div class="ai-tour-panel-sub">7 features built into this experience — click any to try it.</div>' +
          '</div>' +
          '<button class="ai-tour-close" id="aiTourCloseBtn" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="ai-tour-feature-list">' + rowsHtml + '</div>' +
      '</div>';

    document.body.appendChild(modal);

    // Cart Recovery demo button — disable visually when cart is empty, sync on open
    var recoveryDemoBtn = modal.querySelector('[data-tour-demo="cart-recovery"]');
    var syncRecoveryBtnState = null;
    if (recoveryDemoBtn) {
      syncRecoveryBtnState = function() {
        var empty = !window.nexCart || (window.nexCart.items || []).length === 0;
        recoveryDemoBtn.setAttribute('aria-disabled', empty ? 'true' : 'false');
        recoveryDemoBtn.style.opacity = empty ? '0.45' : '';
        recoveryDemoBtn.style.cursor  = empty ? 'default' : '';
      };
      // Sync when tour opens and whenever cart changes
      document.addEventListener('nex:cart-updated', syncRecoveryBtnState);
      syncRecoveryBtnState();

      recoveryDemoBtn.addEventListener('click', function() {
        var cartItems = window.nexCart ? (window.nexCart.items || []) : [];
        if (cartItems.length === 0) {
          // Show empty-bag info popup without closing the tour
          var infoOverlay = document.createElement('div');
          infoOverlay.id = 'cartRecoveryInfoOverlay';
          infoOverlay.style.cssText = 'position:fixed;inset:0;z-index:100002;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,0.6);backdrop-filter:blur(4px);';
          infoOverlay.innerHTML =
            '<div style="background:var(--bg-surface,#0A2A54);border:1px solid rgba(61,224,255,0.15);border-radius:18px;padding:32px 28px;width:min(380px,calc(100vw-48px));text-align:center;box-shadow:0 24px 60px rgba(0,0,0,0.7);">' +
              '<div style="font-size:32px;margin-bottom:12px;">🛍️</div>' +
              '<div style="font-family:var(--font-display,Manrope,sans-serif);font-size:16px;font-weight:800;color:#fff;margin-bottom:8px;">Your bag is empty</div>' +
              '<div style="font-size:12.5px;color:rgba(255,255,255,0.5);line-height:1.6;margin-bottom:22px;">Add items to your bag first. Cart Recovery triggers automatically when you try to leave with reserved pieces.</div>' +
              '<button id="cartRecoveryInfoClose" style="background:rgba(61,224,255,0.1);border:1px solid rgba(61,224,255,0.25);color:#3DE0FF;font-family:var(--font-display,Manrope,sans-serif);font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;padding:10px 24px;border-radius:999px;cursor:pointer;">Got it</button>' +
            '</div>';
          document.body.appendChild(infoOverlay);
          function removeInfo() { if (infoOverlay.parentNode) infoOverlay.parentNode.removeChild(infoOverlay); }
          document.getElementById('cartRecoveryInfoClose').addEventListener('click', removeInfo);
          infoOverlay.addEventListener('click', function(e) { if (e.target === infoOverlay) removeInfo(); });
          return;
        }
        closeTour();
        sessionStorage.removeItem('nex_recovery_dismissed');
        setTimeout(function() {
          var ui = window.NexCartRecoveryUI;
          if (ui && typeof ui.showRecoveryModal === 'function') {
            var origDismiss = ui.dismissModal.bind(ui);
            ui.dismissModal = function() {
              var overlay = document.getElementById('cartRecoveryModalOverlay');
              if (overlay) overlay.style.display = 'none';
              document.body.style.overflow = '';
              if (ui.timerInterval) clearInterval(ui.timerInterval);
              ui.dismissModal = origDismiss;
            };
            ui.showRecoveryModal();
            ui.hasTriggered = false;
          }
        }, 200);
      });
    }

    // AI Search demo button — opens the search overlay directly on any page
    var searchDemoBtn = modal.querySelector('[data-tour-demo="ai-search"]');
    if (searchDemoBtn) {
      searchDemoBtn.addEventListener('click', function() {
        closeTour();
        setTimeout(function() {
          if (window.NexSearchOverlay && typeof window.NexSearchOverlay.open === 'function') {
            window.NexSearchOverlay.open();
          } else if (typeof window.nexOpenSearch === 'function') {
            window.nexOpenSearch();
          } else {
            document.dispatchEvent(new CustomEvent('nex:open-search'));
          }
        }, 150);
      });
    }

    function openTour() {
      if (typeof syncRecoveryBtnState === 'function') syncRecoveryBtnState();
      modal.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
      document.getElementById('aiTourCloseBtn').focus();
    }

    function closeTour() {
      modal.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      btn.focus();
    }

    btn.addEventListener('click', function() {
      modal.classList.contains('open') ? closeTour() : openTour();
    });

    document.getElementById('aiTourCloseBtn').addEventListener('click', closeTour);

    modal.addEventListener('click', function(e) {
      if (e.target === modal) closeTour();
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeTour();
    });
  }

  renderTourButton();
})();
