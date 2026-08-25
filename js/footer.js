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
          '<!-- Column 2: About & Guides -->' +
          '<div class="footer-nav-col">' +
            '<span class="footer-col-heading">ABOUT</span>' +
            '<a href="' + toRoot + 'feature-showcase.html" class="footer-link-item">Feature Guide</a>' +
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
      search:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
      compass:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>',
      camera:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>',
      ruler:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.4 2.4 0 0 1 0-3.4l2.6-2.6a2.4 2.4 0 0 1 3.4 0Z"/><path d="m14.5 12.5 2-2"/><path d="m11.5 9.5 2-2"/><path d="m8.5 6.5 2-2"/><path d="m17.5 15.5 2-2"/></svg>',
      mic:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>',
      layers:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
      wallet:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
      fileText:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>',
      columns:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="12" x2="12" y1="3" y2="21"/></svg>',
      refresh:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
      tag:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><circle cx="7" cy="7" r=".5"/></svg>',
      mapPin:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
      navigation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>',
      shield:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      zap:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/></svg>',
    };

    var phases = [
      { 
        icon: '🔍',
        label: '1. Finding What You Want (Search & Discovery)', 
        features: [
          { 
            num: '01',
            icon: S.search, 
            gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', 
            color: '#3DE0FF', 
            name: 'Smart Conversational Search',
            does: 'Type in normal sentences instead of exact keywords.',
            example: 'Warm jacket for a winter dinner date under $250',
            actionText: 'Try Search',
            demo: 'ai-search'
          },
          { 
            num: '02',
            icon: S.camera, 
            gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', 
            color: '#8b5cf6', 
            name: 'Search by Photo',
            does: 'Upload any picture or screenshot to find matching items.',
            example: 'Upload a photo of white sneakers from Instagram.',
            actionText: 'Try Photo Search',
            demo: 'visual-search',
            path: toPages + 'discovery.html?mode=visual'
          },
          { 
            num: '03',
            icon: S.mic, 
            gradient: 'linear-gradient(135deg, #0284c7, #0369a1)', 
            color: '#0284c7', 
            name: 'Natural Voice Search',
            does: 'Talk naturally into the microphone without robotic commands.',
            example: 'Hey stylist, show me black overcoats under $300.',
            actionText: 'Try Voice Search',
            demo: 'ai-search'
          },
        ]
      },
      { 
        icon: '👔',
        label: '2. Outfits & Perfect Fit (Styling & Sizing)', 
        features: [
          { 
            num: '04',
            icon: S.mic, 
            gradient: 'linear-gradient(135deg, #ec4899, #be185d)', 
            color: '#ec4899', 
            name: '24/7 Personal Stylist Chat',
            does: 'A private chat stylist that knows what product you are viewing.',
            example: 'Viewing a blazer? It suggests matching pants & shoes.',
            actionText: 'Open Chat',
            demo: 'concierge'
          },
          { 
            num: '05',
            icon: S.layers, 
            gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', 
            color: '#f59e0b', 
            name: '1-Click Outfit Bundles',
            does: 'Bundles complete head-to-toe matching looks in 1 click.',
            example: '1 button adds jacket, shirt, pants, and watch together.',
            actionText: 'View Outfits',
            path: toPages + 'discovery.html#drops'
          },
          { 
            num: '06',
            icon: S.ruler, 
            gradient: 'linear-gradient(135deg, #10b981, #047857)', 
            color: '#10b981', 
            name: 'Smart Size & Fit Advisor',
            does: 'Enter chest and waist measurements to find your exact size.',
            example: 'Chest 98cm + Waist 82cm → Size Medium (94% fit).',
            actionText: 'Open Size Guide',
            path: toPages + 'size-guide.html'
          },
          { 
            num: '07',
            icon: S.columns, 
            gradient: 'linear-gradient(135deg, #0284c7, #0369a1)', 
            color: '#0284c7', 
            name: 'Side-by-Side Comparison',
            does: 'Compares two items side-by-side across warmth, fabric, and fit.',
            example: 'Choose Cashmere for winter; Fine-Knit for office.',
            actionText: 'Compare Items',
            demo: 'comparison'
          },
        ]
      },
      { 
        icon: '🛒',
        label: '3. Shopping Bag & Deals (Savings & Budget)', 
        features: [
          { 
            num: '08',
            icon: S.wallet, 
            gradient: 'linear-gradient(135deg, #10b981, #047857)', 
            color: '#10b981', 
            name: 'Target-Budget Cart Builder',
            does: 'Set a spending limit and it builds a matching wardrobe for you.',
            example: 'Set $500 budget → gets 3 matching pieces for $454.',
            actionText: 'Build Under Budget',
            demo: 'budget-cart'
          },
          { 
            num: '09',
            icon: S.fileText, 
            gradient: 'linear-gradient(135deg, #8b5cf6, #6d28d9)', 
            color: '#8b5cf6', 
            name: 'Paste a Shopping List (Slip-to-Cart)',
            does: 'Paste a text note and it adds all items to your bag in 1 click.',
            example: 'Paste: "2x cashmere sweater M, 1x leather runner 42"',
            actionText: 'Try List Scanner',
            demo: 'slip-to-cart'
          },
          { 
            num: '10',
            icon: S.tag, 
            gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', 
            color: '#f59e0b', 
            name: 'Proactive Discount Optimizer',
            does: 'Automatically finds and applies the best coupon codes.',
            example: 'Alert: "Add $15 more to unlock 15% VIP discount!"',
            actionText: 'Check Savings',
            demo: 'savings'
          },
          { 
            num: '11',
            icon: S.refresh, 
            gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)', 
            color: '#06b6d4', 
            name: 'Smart Reorder Reminders',
            does: 'Reminds you when wardrobe essentials are running low.',
            example: '1-click restock popover after 60 days.',
            actionText: 'Open Smart List',
            path: toPages + 'smart-list.html'
          },
        ]
      },
      { 
        icon: '🚚',
        label: '4. Fast Checkout & Delivery (Buying & Tracking)', 
        features: [
          { 
            num: '12',
            icon: S.shield, 
            gradient: 'linear-gradient(135deg, #ec4899, #be185d)', 
            color: '#ec4899', 
            name: 'Order Directly in Chat',
            does: 'Buy items right inside the chat without filling long forms.',
            example: 'Say: "Order my bag" → Confirms address and places order.',
            actionText: 'Try Chat Order',
            demo: 'concierge'
          },
          { 
            num: '13',
            icon: S.navigation, 
            gradient: 'linear-gradient(135deg, #0284c7, #0369a1)', 
            color: '#0284c7', 
            name: 'Live 6-Stage Delivery Tracker',
            does: 'Shows live progress from tailoring to doorstep with clear updates.',
            example: 'Explains: "Driver will arrive today by 3:30 PM."',
            actionText: 'Open Tracker',
            path: toPages + 'tracking.html'
          },
          { 
            num: '14',
            icon: S.mapPin, 
            gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', 
            color: '#f59e0b', 
            name: 'Same-Day Local Delivery Gate',
            does: 'Checks local warehouse stock for 45-minute express delivery.',
            example: 'Order within 1h 45m for express delivery today.',
            actionText: 'Check City Hub',
            demo: 'delivery-hub'
          },
          { 
            num: '15',
            icon: S.zap, 
            gradient: 'linear-gradient(135deg, #10b981, #047857)', 
            color: '#10b981', 
            name: '100% Private On-Device Vault',
            does: 'Your sizes and favorites stay strictly on your phone. Never tracked or sold.',
            example: '1-click button on Privacy page to download or erase data.',
            actionText: 'Open Vault',
            path: toPages + 'privacy.html'
          },
        ]
      },
    ];

    var sectionsHtml = '';
    phases.forEach(function(phase) {
      sectionsHtml += 
        '<div class="ai-tour-section-block">' +
          '<div class="ai-tour-section-header">' +
            '<span>' + phase.icon + '</span>' +
            '<span class="ai-tour-section-title">' + phase.label + '</span>' +
            '<span class="ai-tour-section-badge">' + phase.features.length + ' Features</span>' +
          '</div>' +
          '<div class="ai-tour-cards-grid">';
      
      phase.features.forEach(function(f) {
        var isDemo = !!f.demo;
        var actionElem = isDemo
          ? '<button type="button" class="ai-tour-card-action-btn" data-tour-demo="' + f.demo + '">' + f.actionText + ' &rarr;</button>'
          : '<a href="' + f.path + '" class="ai-tour-card-action-link">' + f.actionText + ' &rarr;</a>';

        sectionsHtml += 
          '<div class="ai-tour-card-box">' +
            '<div>' +
              '<div class="ai-tour-box-top">' +
                '<div class="ai-tour-box-icon" style="background:' + f.gradient + ';">' + f.icon + '</div>' +
                '<div class="ai-tour-box-meta">' +
                  '<span class="ai-tour-box-num">Feature ' + f.num + '</span>' +
                  '<h4 class="ai-tour-box-title">' + f.name + '</h4>' +
                '</div>' +
              '</div>' +
              '<div class="ai-tour-box-content">' +
                '<div class="ai-tour-info-row">' +
                  '<div class="ai-tour-info-label">What it does</div>' +
                  '<p class="ai-tour-info-text">' + f.does + '</p>' +
                '</div>' +
                '<div class="ai-tour-example-box">' +
                  '<div class="ai-tour-example-label">Real Example</div>' +
                  '<div class="ai-tour-example-val">' + f.example + '</div>' +
                '</div>' +
              '</div>' +
            '</div>' +
            '<div class="ai-tour-box-footer">' + actionElem + '</div>' +
          '</div>';
      });

      sectionsHtml += '</div></div>';
    });

    // Floating button
    var btn = document.createElement('button');
    btn.id = 'aiTourFloatingBtn';
    btn.setAttribute('aria-label', 'View Smart Features');
    btn.setAttribute('aria-expanded', 'false');
    btn.innerHTML = '<span class="ai-tour-btn-dot"></span> Smart Features';
    document.body.appendChild(btn);

    // Modal
    var modal = document.createElement('div');
    modal.id = 'aiTourModal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-label', 'Smart Features overview');
    modal.setAttribute('data-lenis-prevent', '');

    modal.innerHTML =
      '<div class="ai-tour-panel" data-lenis-prevent>' +
        '<div class="ai-tour-panel-accent"></div>' +
        '<div class="ai-tour-panel-head">' +
          '<div>' +
            '<div class="ai-tour-panel-tag">✨ Simple & Clear Overview</div>' +
            '<div class="ai-tour-panel-title">Smart Shopping Features</div>' +
            '<div class="ai-tour-panel-sub">15 simple tools to make finding, sizing, and buying clothes easier and faster.</div>' +
          '</div>' +
          '<button class="ai-tour-close" id="aiTourCloseBtn" aria-label="Close">&times;</button>' +
        '</div>' +
        '<div class="ai-tour-feature-list" data-lenis-prevent tabindex="0">' + sectionsHtml + '</div>' +
      '</div>';

    document.body.appendChild(modal);

    // Prevent wheel event propagation outside the modal
    var tourPanel = modal.querySelector('.ai-tour-panel');
    if (tourPanel) {
      tourPanel.addEventListener('wheel', function(e) {
        e.stopPropagation();
      }, { passive: true });
    }
    var featureList = modal.querySelector('.ai-tour-feature-list');
    if (featureList) {
      featureList.addEventListener('wheel', function(e) {
        e.stopPropagation();
      }, { passive: true });
    }

    // Interactive Demo Handlers
    modal.querySelectorAll('[data-tour-demo]').forEach(function(rowBtn) {
      var demoType = rowBtn.getAttribute('data-tour-demo');
      if (demoType === 'cart-recovery') return; // Handled separately below

      rowBtn.addEventListener('click', function() {
        closeTour();
        setTimeout(function() {
          if (demoType === 'ai-search') {
            if (window.NexSearchOverlay && typeof window.NexSearchOverlay.open === 'function') {
              window.NexSearchOverlay.open();
            } else if (typeof window.nexOpenSearch === 'function') {
              window.nexOpenSearch();
            } else {
              document.dispatchEvent(new CustomEvent('nex:open-search'));
            }
          } else if (demoType === 'visual-search') {
            if (window.nexVisualSearch && typeof window.nexVisualSearch.open === 'function') {
              window.nexVisualSearch.open();
            } else {
              window.location.href = toPages + 'discovery.html?mode=visual';
            }
          } else if (demoType === 'concierge') {
            if (window.NexConcierge && typeof window.NexConcierge.open === 'function') {
              window.NexConcierge.open();
            } else {
              window.location.href = toPages + 'concierge.html';
            }
          } else if (demoType === 'budget-cart') {
            if (window.NexBudgetCartUI && typeof window.NexBudgetCartUI.openModal === 'function') {
              window.NexBudgetCartUI.openModal(500, 'autumn');
            } else {
              window.location.href = toPages + 'cart.html?open=budget';
            }
          } else if (demoType === 'slip-to-cart') {
            if (window.NexSlipUI && typeof window.NexSlipUI.openModal === 'function') {
              window.NexSlipUI.openModal('capsule');
            } else {
              window.location.href = toPages + 'cart.html?open=slip';
            }
          } else if (demoType === 'comparison') {
            if (window.NexComparisonUI && typeof window.NexComparisonUI.openComparison === 'function') {
              window.NexComparisonUI.openComparison(['p1', 'p2']);
            } else {
              window.location.href = toPages + 'category.html?open=comparison';
            }
          } else if (demoType === 'delivery-hub') {
            if (window.NexDeliveryUI && typeof window.NexDeliveryUI.openHubModal === 'function') {
              window.NexDeliveryUI.openHubModal();
            } else {
              window.location.href = toPages + 'tracking.html';
            }
          } else if (demoType === 'savings') {
            window.location.href = toPages + 'cart.html';
          }
        }, 180);
      });
    });

    // Anchor Link Handlers for direct page & section navigation
    modal.querySelectorAll('a.ai-tour-card-action-link, .ai-tour-card-box a').forEach(function(anchor) {
      anchor.addEventListener('click', function(e) {
        var href = anchor.getAttribute('href');
        if (!href) return;

        closeTour();

        var hashIdx = href.indexOf('#');
        var hash = hashIdx !== -1 ? href.substring(hashIdx) : '';
        var rawTarget = hashIdx !== -1 ? href.substring(0, hashIdx) : href;
        var targetFile = rawTarget.replace(/^(\.\.\/|pages\/)/, '').replace(/\/$/, '');
        var currentFile = (window.location.pathname.split('/').pop() || 'index.html').split('?')[0];

        var isCurrentPage = (!targetFile || targetFile === currentFile || (currentFile === '' && targetFile === 'index.html'));

        if (isCurrentPage && hash) {
          e.preventDefault();
          var targetEl = document.querySelector(hash);
          if (targetEl) {
            setTimeout(function() {
              if (window._nexLenis && typeof window._nexLenis.scrollTo === 'function') {
                window._nexLenis.scrollTo(targetEl, { offset: -90, duration: 0.8 });
              } else {
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
              targetEl.classList.add('tour-target-highlight');
              setTimeout(function() { targetEl.classList.remove('tour-target-highlight'); }, 2200);
            }, 120);
            if (window.history && window.history.pushState) {
              window.history.pushState(null, '', hash);
            }
          }
        }
      });
    });

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
      document.body.style.overflow = 'hidden';
      if (window._nexLenis && typeof window._nexLenis.stop === 'function') {
        window._nexLenis.stop();
      }
      document.getElementById('aiTourCloseBtn').focus();
    }

    function closeTour() {
      modal.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      if (window._nexLenis && typeof window._nexLenis.start === 'function') {
        window._nexLenis.start();
      }
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
