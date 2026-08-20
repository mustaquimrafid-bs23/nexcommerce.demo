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
          '<div class="footer-brand-col">' +
            '<a href="' + toRoot + 'index.html" aria-label="nexCommerce Home" style="display: inline-block; text-decoration: none;">' +
              '<img src="' + toRoot + 'assets/images/brand/logo_light.png" alt="nexCommerce Atelier" class="footer-logo-img" />' +
            '</a>' +
            '<p class="footer-brand-desc">A contemporary digital atelier uniting tailored ready-to-wear, artisanal footwear, and acoustic craft.</p>' +
            '<div style="display: flex; gap: 12px; margin: 16px 0;">' +
              '<a href="#" aria-label="nexCommerce on Instagram" title="Instagram" style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); color: var(--text-secondary); transition: color 0.2s, border-color 0.2s;" onmouseover="this.style.color=\'var(--accent-pink)\';this.style.borderColor=\'var(--accent-pink)\';" onmouseout="this.style.color=\'\';this.style.borderColor=\'\'">' +
                '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>' +
              '</a>' +
              '<a href="#" aria-label="nexCommerce on TikTok" title="TikTok" style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); color: var(--text-secondary); transition: color 0.2s, border-color 0.2s;" onmouseover="this.style.color=\'var(--accent-cyan)\';this.style.borderColor=\'var(--accent-cyan)\';" onmouseout="this.style.color=\'\';this.style.borderColor=\'\'">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.89a8.27 8.27 0 0 0 4.84 1.55V7a4.85 4.85 0 0 1-1.07-.31z"/></svg>' +
              '</a>' +
              '<a href="#" aria-label="nexCommerce on LinkedIn" title="LinkedIn" style="display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.12); color: var(--text-secondary); transition: color 0.2s, border-color 0.2s;" onmouseover="this.style.color=\'#0A66C2\';this.style.borderColor=\'#0A66C2\';" onmouseout="this.style.color=\'\';this.style.borderColor=\'\'">' +
                '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>' +
              '</a>' +
            '</div>' +
            '<div class="footer-newsletter-box">' +
              '<span class="footer-newsletter-label">The Private Edit</span>' +
              '<p class="footer-newsletter-sub">Receive private collection previews, seasonal capsule alerts, and atelier journals.</p>' +
              '<form id="footerNewsletterForm" class="footer-newsletter-form">' +
                '<input type="email" class="footer-newsletter-input" placeholder="Enter your email address" required aria-label="Email address for newsletter" />' +
                '<button type="submit" class="footer-newsletter-btn">Subscribe</button>' +
              '</form>' +
            '</div>' +
          '</div>' +
          '<div class="footer-nav-col">' +
            '<span class="footer-col-heading">CLIENT SERVICES</span>' +
            '<a href="' + toPages + 'orders.html" class="footer-link-item">Order Journey</a>' +
            '<a href="' + toPages + 'tracking.html" class="footer-link-item">Order Concierge</a>' +
            '<a href="' + toPages + 'wishlist.html" class="footer-link-item">Saved Pieces</a>' +
            '<a href="' + toPages + 'size-guide.html" class="footer-link-item">Size &amp; Fit Guide</a>' +
          '</div>' +
          '<div class="footer-nav-col">' +
            '<span class="footer-col-heading">THE MAISON</span>' +
            '<a href="' + toPages + 'about.html" class="footer-link-item">The Atelier Story</a>' +
            '<a href="' + toPages + 'privacy.html" class="footer-link-item">Data Privacy (GDPR)</a>' +
            '<a href="' + toPages + 'terms.html" class="footer-link-item">Terms &amp; Right of Withdrawal</a>' +
            '<a href="' + toPages + 'impressum.html" class="footer-link-item">Legal Notice / Impressum</a>' +
            '<a href="' + toPages + 'security.html" class="footer-link-item">Authenticity &amp; Trust</a>' +
            '<button type="button" class="footer-link-item footer-cookie-trigger" data-open-cookie-settings style="background:none; border:none; padding:0; font:inherit; color:inherit; cursor:pointer; text-align:left;">Cookie Preferences</button>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom-bar">' +
          '<div class="footer-copy-text">&copy; 2026 nexCommerce Atelier Inc. All rights reserved. &middot; All prices incl. statutory VAT &middot; <a href="' + toPages + 'impressum.html" style="color:var(--text-secondary); text-decoration:underline;">Impressum</a> &middot; <button type="button" class="footer-cookie-trigger" data-open-cookie-settings style="background:none; border:none; padding:0; font:inherit; color:var(--text-secondary); text-decoration:underline; cursor:pointer;">Cookie Settings</button></div>' +
          '<div class="footer-locale-selector">' +
            '<i data-lucide="globe" style="width: 14px; height: 14px;"></i>' +
            '<span>EUR (&euro;) &middot; Europe (EN / DE / FR)</span>' +
          '</div>' +
          '<div class="footer-payment-badges" aria-label="Accepted European Payment Methods">' +
            '<div class="payment-brand-badge klarna-badge" title="Klarna">Klarna.</div>' +
            '<div class="payment-brand-badge ideal-badge" title="iDEAL">iDEAL</div>' +
            '<div class="payment-brand-badge applepay-badge" title="Apple Pay"> Pay</div>' +
            '<div class="payment-brand-badge paypal-badge" title="PayPal">PayPal</div>' +
            '<div class="payment-brand-badge bancontact-badge" title="Bancontact">Bancontact</div>' +
            '<div class="payment-brand-badge sepa-badge" title="SEPA">SEPA</div>' +
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
