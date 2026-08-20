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
              '<input type="email" class="footer-newsletter-input" placeholder="Enter your email" required aria-label="Email for newsletter" />' +
              '<button type="submit" class="footer-newsletter-btn">Subscribe</button>' +
            '</form>' +
            '<span class="footer-newsletter-fineprint">No spam. Unsubscribe at any time.</span>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom-bar">' +
          '<div class="footer-copy-col">' +
            '<div class="footer-copy-text">&copy; 2026 nexCommerce Atelier Inc. All rights reserved.</div>' +
            '<div class="footer-legal-sub">All prices incl. statutory VAT &middot; <a href="' + toPages + 'impressum.html" class="footer-legal-link">Impressum</a> &middot; <a href="' + toPages + 'privacy.html" class="footer-legal-link">Privacy</a> &middot; <button type="button" class="footer-cookie-trigger footer-legal-link" data-open-cookie-settings>Cookie Settings</button></div>' +
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
})();
