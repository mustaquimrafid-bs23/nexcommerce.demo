/* ─── nexCommerce: Product Detail Page (PDP) Dynamic Engine ────────────────────────
 * Reads ?id= from URL and renders the correct product.
 * Falls back to p1 (Cashmere Sweater) when no ID is provided.
 * ────────────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ─── Product Catalog ────────────────────────────────────────────────── */
  const PRODUCT_CATALOG = {
    p1: {
      id: 'p1',
      name: 'Cashmere Turtleneck Sweater',
      category: 'APPAREL',
      price: 18500,
      formattedPrice: 'BDT 18,500',
      description: 'Spun from 2-ply Mongolian cashmere with relaxed raglan shoulders and ribbed trims for effortless evening drape.',
      details: '100% Mongolian 2-ply cashmere · 12-gauge knit · Hand-finished ribbed collar, cuffs & hem · Crafted in Ulaanbaatar, Mongolia',
      material: '100% Grade-A Cashmere. Dry clean or gentle hand wash cold with wool detergent. Store folded.',
      sizing: 'Relaxed architectural fit. True to size for effortless layering; choose one size down for a tailored silhouette.',
      shipping: 'Express Next Day delivery available across Dhaka. Free standard delivery on orders over BDT 20,000.',
      images: ['plp_turtleneck.png', 'sweater_texture.png', 'sweater_lifestyle.png'],
      colors: ['Midnight', 'Charcoal', 'Stone'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      sizeChart: { XS: {min: 80, max: 87}, S: {min: 88, max: 94}, M: {min: 95, max: 101}, L: {min: 102, max: 108}, XL: {min: 109, max: 115} },
      breadcrumb: [{ label: 'Apparel', href: 'category.html?cat=apparel' }, { label: 'Knitwear', href: 'category.html?cat=apparel' }]
    },
    p2: {
      id: 'p2',
      name: 'Structured Wool Blazer',
      category: 'OUTERWEAR',
      price: 26400,
      formattedPrice: 'BDT 26,400',
      description: 'Tailored from Italian virgin wool with unlined interior canvassing and horn buttons for comfortable evening wear.',
      details: '100% Italian Virgin Wool · Unlined soft shoulder construction · Real horn buttons · Double back vent · Crafted in Biella, Italy',
      material: '100% Pure Virgin Wool. Cupro sleeve lining. Dry clean only. Hang on wide cedar wooden hanger.',
      sizing: 'Modern European tailored cut. Fits true to size with slight room across the chest for light knitwear.',
      shipping: 'Express Next Day delivery available. Garment bag and protective cedar hanger included.',
      images: ['plp_blazer.png', 'sweater_texture.png', 'plp_turtleneck.png'],
      colors: ['Navy', 'Charcoal', 'Black'],
      sizes: ['46', '48', '50', '52', '54'],
      sizeChart: { '46': {min: 88, max: 94}, '48': {min: 95, max: 101}, '50': {min: 102, max: 108}, '52': {min: 109, max: 115}, '54': {min: 116, max: 122} },
      breadcrumb: [{ label: 'Outerwear', href: 'category.html?cat=outerwear' }, { label: 'Tailoring', href: 'category.html?cat=outerwear' }]
    },
    p3: {
      id: 'p3',
      name: 'Tailored Charcoal Overcoat',
      category: 'OUTERWEAR',
      price: 38000,
      formattedPrice: 'BDT 38,000',
      description: 'Double-faced wool-cashmere blend with sharp notch lapels, mid-calf drape, and cupro sleeve lining.',
      details: '90% Virgin Wool, 10% Cashmere · Hand-stitched lapels · Center back vent · Deep welt pockets · Crafted in Florence, Italy',
      material: 'Wool-Cashmere Blend. Dry clean only. Brush with soft bristle clothes brush after wear.',
      sizing: 'Structured tailored overcoat cut. Designed to layer comfortably over suit jackets and thick knitwear.',
      shipping: 'Complimentary white-glove express delivery and garment preservation bag included.',
      images: ['plp_overcoat.png', 'sweater_texture.png', 'plp_blazer.png'],
      colors: ['Charcoal', 'Camel', 'Midnight'],
      sizes: ['46', '48', '50', '52', '54'],
      sizeChart: { '46': {min: 88, max: 94}, '48': {min: 95, max: 101}, '50': {min: 102, max: 108}, '52': {min: 109, max: 115}, '54': {min: 116, max: 122} },
      breadcrumb: [{ label: 'Outerwear', href: 'category.html?cat=outerwear' }, { label: 'Coats', href: 'category.html?cat=outerwear' }]
    },
    p4: {
      id: 'p4',
      name: 'Sonic Aurora Headphones GT',
      category: 'ACOUSTICS',
      price: 32000,
      formattedPrice: 'BDT 32,000',
      description: 'Precision 40mm titanium drivers with spatial audio tuning and active ambient isolation wrapped in lambskin.',
      details: '40mm Titanium Drivers · Hybrid Active Noise Cancellation · 45-Hour Battery · Full-Grain Lambskin Cushions · USB-C Fast Charge',
      material: 'Brushed anodized aluminum, stainless steel headband, memory foam with Ethiopian lambskin leather.',
      sizing: 'Universal ergonomic fit with 16-step detented extension headband and rotating earcups.',
      shipping: 'Express Next Day delivery available. Hard-shell magnetic travel case and braided 3.5mm cable included.',
      images: ['prod_headphones.png', 'search_earbuds.png'],
      colors: ['Matte Black', 'Brushed Aluminum', 'Warm Amber'],
      sizes: ['Standard Edition'],
      breadcrumb: [{ label: 'Acoustics', href: 'category.html?cat=acoustics' }, { label: 'Headphones', href: 'category.html?cat=acoustics' }]
    },
    p5: {
      id: 'p5',
      name: 'Horizon Wireless Earbuds',
      category: 'ACOUSTICS',
      price: 16500,
      formattedPrice: 'BDT 16,500',
      description: 'Custom balanced armature drivers with low-latency spatial audio, Qi wireless fast charging, and IPX5 resistance.',
      details: 'Custom Balanced Armatures · IPX5 Sweat & Water Resistance · 32-Hour Reserve · Dual Beamforming Mics · Qi Wireless',
      material: 'Matte composite acoustic housing with precision aluminum touch surfaces.',
      sizing: 'Includes 4 medical-grade silicone ear tips (XS, S, M, L) and Comply isolation memory foam pairs.',
      shipping: 'Express Next Day delivery available. Free delivery on orders over BDT 20,000.',
      images: ['search_earbuds.png', 'prod_headphones.png'],
      colors: ['Matte Black', 'Obsidian Slate'],
      sizes: ['Standard Fit'],
      breadcrumb: [{ label: 'Acoustics', href: 'category.html?cat=acoustics' }, { label: 'Earbuds', href: 'category.html?cat=acoustics' }]
    },
    p6: {
      id: 'p6',
      name: 'Minimalist Leather Runner',
      category: 'FOOTWEAR',
      price: 19800,
      formattedPrice: 'BDT 19,800',
      description: 'Handcrafted from Italian calfskin leather with shock-absorbing Vibram rubber cupsole and ergonomic leather footbed.',
      details: 'Full-Grain Italian Calfskin · Stitched Vibram Rubber Cupsole · Padded Leather Collar · Gold-Foil Serial Stamp · Made in Marche, Italy',
      material: '100% Full-grain calfskin upper and lining. Natural rubber cupsole. Wipe with damp cloth.',
      sizing: 'European sizing. Fits true to size; if between sizes, choose the smaller size.',
      shipping: 'Express Next Day delivery available. Includes dual dust bags and spare waxed cotton laces.',
      images: ['prod_runner.png', 'sweater_texture.png'],
      colors: ['Pure White', 'Triple Black', 'Chalk / Gum'],
      sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
      breadcrumb: [{ label: 'Footwear', href: 'category.html?cat=footwear' }, { label: 'Sneakers', href: 'category.html?cat=footwear' }]
    },
    p7: {
      id: 'p7',
      name: 'Quilted Leather Structured Tote',
      category: 'ACCESSORIES',
      price: 28500,
      formattedPrice: 'BDT 28,500',
      description: 'Chevron-quilted full-grain nappa leather with polished antique gold hardware and dual interior compartments.',
      details: 'Italian Nappa Leather · Polished Solid Brass Hardware · Magnetic Top Closure · Suede Interior Lining · 38cm × 28cm × 14cm',
      material: '100% Full-grain nappa leather. Microsuede lining. Solid brass hardware with protective coating.',
      sizing: 'Accommodates up to a 14-inch laptop with dedicated tablet pocket and zipped central divider.',
      shipping: 'Express Next Day delivery available. Includes silk-blend dust bag and leather conditioner sample.',
      images: ['prod_tote.png', 'search_watch.png'],
      colors: ['Noir Black', 'Oxblood Burgundy', 'Caramel Tan'],
      sizes: ['Medium Tote'],
      breadcrumb: [{ label: 'Accessories', href: 'category.html?cat=accessories' }, { label: 'Bags & Totes', href: 'category.html?cat=accessories' }]
    },
    p8: {
      id: 'p8',
      name: 'Chronograph Minimalist Timepiece',
      category: 'ACCESSORIES',
      price: 34200,
      formattedPrice: 'BDT 34,200',
      description: 'Brushed matte titanium case housing a Swiss automatic movement with sapphire crystal and interchangeable calfskin strap.',
      details: 'Grade 5 Titanium Case · 40mm Diameter · Anti-Reflective Sapphire Crystal · 38-Hour Power Reserve · 5 ATM Water Resistance',
      material: 'Grade 5 Titanium, double-domed sapphire crystal with anti-reflective coating, Italian calfskin strap.',
      sizing: 'Universal 40mm case diameter with 20mm quick-release Italian leather strap.',
      shipping: 'Express Next Day insured delivery available. Solid walnut presentation box and 3-year warranty card included.',
      images: ['search_watch.png', 'prod_tote.png'],
      colors: ['Matte Titanium', 'Midnight DLC'],
      sizes: ['40mm Case'],
      breadcrumb: [{ label: 'Accessories', href: 'category.html?cat=accessories' }, { label: 'Timepieces', href: 'category.html?cat=accessories' }]
    }
  };

  let currentProduct = null;
  let selectedSize = '';
  let fitPreference = 'Regular';

  /* ─── Main Init ─────────────────────────────────────────────────────── */
  function initPDPEngine() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || 'p1';
    currentProduct = PRODUCT_CATALOG[productId] || PRODUCT_CATALOG['p1'];

    renderProductPage(currentProduct);
    initSearchContext();
    initGallerySwitcher();
    initVariantSelectors();
    initFitAssistant();
    initAddToBag();
    initAccordions();
    initCompleteLookSection();
    initMobileStickyBar();
  }

  /* ─── Dynamic Product Renderer ────────────────────────────────────────── */
  function renderProductPage(product) {
    document.title = product.name + ' — nexCommerce';

    // Breadcrumb
    const breadcrumbEl = document.querySelector('.pdp-breadcrumb');
    if (breadcrumbEl) {
      const crumbs = product.breadcrumb.map(c => '<a href="' + c.href + '">' + escapeHtml(c.label) + '</a>').join('<span>/</span>');
      breadcrumbEl.innerHTML = '<a href="index.html">Home</a><span>/</span>' + crumbs + '<span>/</span><span class="pdp-breadcrumb-active">' + escapeHtml(product.name) + '</span>';
    }

    // Gallery
    const thumbStrip = document.querySelector('.pdp-thumb-strip');
    const mainImg = document.getElementById('pdpMainImg');
    if (thumbStrip && mainImg) {
      mainImg.src = product.images[0];
      mainImg.alt = product.name;
      thumbStrip.innerHTML = product.images.map(function(src, i) {
        return '<img src="' + src + '" alt="' + escapeHtml(product.name) + ' view ' + (i+1) + '" class="pdp-thumb-img' + (i === 0 ? ' active' : '') + '" style="cursor:pointer;">';
      }).join('');
    }

    // Category eyebrow
    var eyebrow = document.querySelector('.pdp-category-eyebrow');
    if (eyebrow) eyebrow.textContent = product.category;

    // Title
    var titleEl = document.querySelector('.pdp-product-title');
    if (!titleEl) titleEl = document.querySelector('h1');
    if (titleEl) titleEl.textContent = product.name;

    // Price
    var priceEl = document.querySelector('.pdp-price-tag');
    if (priceEl) priceEl.textContent = product.formattedPrice;

    // Short desc
    var descEl = document.querySelector('.pdp-short-desc');
    if (descEl) descEl.textContent = product.description;

    // Color Swatches
    var colorContainer = document.querySelector('.pdp-swatches-row:not(.pdp-sizes-row)');
    var colorLabel = document.querySelector('.pdp-swatch-group strong');
    if (colorContainer && product.colors) {
      if (colorLabel) colorLabel.textContent = product.colors[0];
      colorContainer.innerHTML = product.colors.map(function(col, i) {
        return '<button class="btn-secondary-action pdp-color-btn' + (i === 0 ? ' selected' : '') + '" style="' + (i === 0 ? 'border-color: var(--text-primary); font-weight: 600;' : 'opacity: 0.7;') + '" data-color="' + escapeHtml(col) + '">' + escapeHtml(col) + '</button>';
      }).join('');
    }

    // Size buttons & Fit Assistant Visibility
    var sizesContainer = document.querySelector('.pdp-sizes-row');
    var fitBtn = document.getElementById('btnFitAssistant');
    if (sizesContainer) {
      sizesContainer.innerHTML = product.sizes.map(function(sz, i) {
        return '<button class="pdp-size-btn' + (i === 0 ? ' selected' : '') + '" data-size="' + sz + '">' + escapeHtml(sz) + '</button>';
      }).join('');
      selectedSize = product.sizes[0];
    } else {
      selectedSize = product.sizes[0] || 'M';
    }

    if (fitBtn) {
      if (product.category === 'ACOUSTICS' || product.category === 'ACCESSORIES' || product.sizes.length <= 1) {
        fitBtn.style.display = 'none';
      } else {
        fitBtn.style.display = 'inline-flex';
      }
    }

    // Accordion bodies
    var detailsBody = document.getElementById('accordionDetailsBody');
    if (detailsBody) detailsBody.innerHTML = '<p style="line-height:1.7;color:var(--text-secondary);font-size:14px;">' + escapeHtml(product.details) + '</p>';

    var materialBody = document.getElementById('accordionMaterialBody');
    if (materialBody) materialBody.innerHTML = '<p style="line-height:1.7;color:var(--text-secondary);font-size:14px;">' + escapeHtml(product.material || product.details) + '</p>';

    var sizingBody = document.getElementById('accordionSizingBody');
    if (sizingBody) sizingBody.innerHTML = '<p style="line-height:1.7;color:var(--text-secondary);font-size:14px;">' + escapeHtml(product.sizing || product.details) + '</p>';

    // Sticky Bar labels
    var stickyPrice = document.getElementById('stickyPriceLabel');
    if (stickyPrice) stickyPrice.textContent = product.formattedPrice;
    updateStickyBarText();

    var shippingBody = document.getElementById('accordionShippingBody');
    if (shippingBody) shippingBody.innerHTML = '<p style="line-height:1.7;color:var(--text-secondary);font-size:14px;">' + escapeHtml(product.shipping) + '</p>';

    // Mobile sticky bar
    var stickyName = document.getElementById('stickyProductName');
    if (stickyName) stickyName.textContent = product.name;
  }

  /* â”€â”€ AI Context Retention Bar & Feature 2 Context Match â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initSearchContext() {
    if (!window.NexSessionContext || !window.NexContextEngine) return;

    var savedContext = window.NexSessionContext.load();
    var bar = document.getElementById('pdpContextRetentionBar');
    var textEl = document.getElementById('pdpRetentionText');
    var clearBtn = document.getElementById('pdpRetentionClearBtn');
    
    // Feature 2: PDP Match Box
    var matchBox = document.getElementById('pdpContextMatchBox');
    // Feature 2: Alternative Recommendations
    var recsSection = document.getElementById('pdpAlternativeRecs');
    var recsGrid = document.getElementById('pdpAlternativeRecsGrid');

    if (!savedContext || !savedContext.raw) {
      if (bar) bar.style.display = 'none';
      if (matchBox) matchBox.style.display = 'none';
      if (recsSection) recsSection.style.display = 'none';
      return;
    }

    // 1. Retention Bar (Feature 1/2)
    if (bar && textEl && clearBtn) {
      var parts = [];
      if (savedContext.occasion) parts.push(savedContext.occasion.value.toLowerCase());
      else if (savedContext.climate) parts.push(savedContext.climate.value.toLowerCase());
      else if (savedContext.style) parts.push(savedContext.style.value.toLowerCase());
      
      var intentStr = parts.length > 0 ? parts.join(' and ') : 'your request';
      textEl.textContent = 'Retaining context for ' + intentStr + ' ("' + savedContext.raw + '")';
      bar.style.display = 'flex';

      clearBtn.addEventListener('click', function() {
        window.NexSessionContext.clear();
        bar.style.display = 'none';
        if (matchBox) matchBox.style.display = 'none';
        if (recsSection) recsSection.style.display = 'none';
        if (window.dataLayer) window.dataLayer.push({ event: 'ai_context_cleared_pdp' });
      });
    }

    // 2. Context Match "Why This Fits" (Feature 2 & 3)
    var matchResult = window.NexContextEngine.evaluateMatch(savedContext, currentProduct);
    if (matchResult && matchResult.isMatch && matchBox) {
      var badgeText = matchResult.isProfileMatch ? 'PERSONALIZED FOR YOU' : 'SELECTED FOR YOUR SEARCH';
      matchBox.innerHTML = '<div class="pdp-context-match">'
        + '<div class="pdp-context-eyebrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>' + badgeText + '</div>'
        + '<div class="pdp-context-body">' + escapeHtml(matchResult.explanation) + '</div>'
        + '<a href="discovery.html?q=' + encodeURIComponent(savedContext.raw) + '" class="pdp-context-link">Refine search &rarr;</a>'
        + '</div>';
      matchBox.style.display = 'block';
    } else if (matchBox) {
      matchBox.style.display = 'none';
    }
  }

  /* ─── Curated Complete the Look Module ───────────────────────────────── */
  const COMPLETE_LOOK_MAP = {
    p1: ['p2', 'p6', 'p8'], // Sweater + Blazer + Runner + Timepiece
    p2: ['p1', 'p6', 'p7'], // Blazer + Sweater + Runner + Tote
    p3: ['p1', 'p6', 'p8'], // Overcoat + Sweater + Runner + Timepiece
    p4: ['p1', 'p7', 'p8'], // Headphones + Sweater + Tote + Timepiece
    p5: ['p2', 'p6', 'p7'], // Earbuds + Blazer + Runner + Tote
    p6: ['p1', 'p2', 'p7'], // Runner + Sweater + Blazer + Tote
    p7: ['p1', 'p2', 'p8'], // Tote + Sweater + Blazer + Timepiece
    p8: ['p2', 'p6', 'p7']  // Timepiece + Blazer + Runner + Tote
  };

  function initCompleteLookSection() {
    var grid = document.getElementById('pdpCompleteLookGrid');
    var origPriceEl = document.getElementById('pdpBundleOriginalPrice');
    var finalPriceEl = document.getElementById('pdpBundleFinalPrice');
    var bundleBtn = document.getElementById('btnAddCompleteLookBtn');
    var bundleBtnText = document.getElementById('pdpBundleBtnText');
    if (!grid || !currentProduct) return;

    var pairIds = COMPLETE_LOOK_MAP[currentProduct.id] || ['p2', 'p6', 'p8'];
    var pairedItems = pairIds.map(function(id) { return PRODUCT_CATALOG[id]; }).filter(Boolean);

    // Calculate bundle pricing
    var allLookItems = [currentProduct].concat(pairedItems);
    var originalTotal = allLookItems.reduce(function(acc, item) { return acc + item.price; }, 0);
    var discountedTotal = Math.round(originalTotal * 0.9); // 10% Bundle Savings

    if (origPriceEl) origPriceEl.textContent = 'BDT ' + originalTotal.toLocaleString();
    if (finalPriceEl) finalPriceEl.textContent = 'BDT ' + discountedTotal.toLocaleString();
    if (bundleBtnText) bundleBtnText.textContent = 'ADD ENTIRE LOOK (' + allLookItems.length + ' PIECES)';

    // Render Paired Cards
    grid.innerHTML = pairedItems.map(function(item) {
      return '<div class="plp-card luxury-product-card" data-id="' + item.id + '">'
        + '<div class="plp-card-media">'
        + '<a href="product.html?id=' + item.id + '" class="plp-card-img-anchor">'
        + '<img src="' + item.images[0] + '" alt="' + escapeHtml(item.name) + '" class="plp-card-img" loading="lazy">'
        + '</a>'
        + '<button class="plp-quick-add-btn btn-plp-add-to-bag" data-id="' + item.id + '">'
        + '<i data-lucide="shopping-bag" style="width: 13px; height: 13px; margin-right: 6px;"></i>'
        + '<span>QUICK ADD</span>'
        + '</button>'
        + '</div>'
        + '<div class="plp-card-info">'
        + '<span class="plp-card-category-label">' + item.category + '</span>'
        + '<a href="product.html?id=' + item.id + '" class="plp-card-title-link">'
        + '<h3 class="plp-card-name">' + escapeHtml(item.name) + '</h3>'
        + '</a>'
        + '<p class="plp-card-description">' + escapeHtml(item.description) + '</p>'
        + '<div class="plp-card-price-tag">' + item.formattedPrice + '</div>'
        + '</div>'
        + '</div>';
    }).join('');

    // Quick Add on individual cards
    grid.querySelectorAll('.btn-plp-add-to-bag').forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        var itemId = btn.getAttribute('data-id');
        var item = PRODUCT_CATALOG[itemId];
        if (item && window.nexCart) {
          window.nexCart.addItem({
            id: item.id,
            name: item.name,
            size: item.sizes[0] || 'Standard',
            qty: 1,
            price: item.price,
            image: item.images[0],
            category: item.category
          });
          btn.innerHTML = '<i data-lucide="check" style="width:13px;height:13px;margin-right:6px;"></i><span>ADDED</span>';
          if (window.lucide) window.lucide.createIcons();
          setTimeout(function() {
            btn.innerHTML = '<i data-lucide="shopping-bag" style="width:13px;height:13px;margin-right:6px;"></i><span>QUICK ADD</span>';
            if (window.lucide) window.lucide.createIcons();
          }, 1800);
        }
      });
    });

    // Bundle Checkout CTA
    if (bundleBtn) {
      bundleBtn.onclick = function() {
        if (!window.nexCart) return;
        
        allLookItems.forEach(function(item) {
          window.nexCart.addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.images[0],
            size: item.sizes[0] || 'Standard'
          });
        });

        // Open Mini Cart Drawer
        var drawer = document.getElementById('nexMiniCartDrawer');
        var overlay = document.getElementById('nexMiniCartOverlay');
        if (drawer && overlay) {
          drawer.classList.add('active');
          overlay.classList.add('active');
        }
      };
    }
  }

  /* â”€â”€ Gallery Switcher â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initGallerySwitcher() {
    var thumbStrip = document.querySelector('.pdp-thumb-strip');
    var mainImg = document.getElementById('pdpMainImg');
    if (!thumbStrip || !mainImg) return;
    thumbStrip.addEventListener('click', function(e) {
      var thumb = e.target.closest('.pdp-thumb-img');
      if (!thumb) return;
      thumbStrip.querySelectorAll('.pdp-thumb-img').forEach(function(t) { t.classList.remove('active'); });
      thumb.classList.add('active');
      mainImg.src = thumb.src;
      mainImg.alt = thumb.alt;
    });
  }

  /* â”€â”€ Size Selectors â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initVariantSelectors() {
    var sizesContainer = document.querySelector('.pdp-sizes-row');
    if (!sizesContainer) return;
    sizesContainer.addEventListener('click', function(e) {
      var btn = e.target.closest('.pdp-size-btn');
      if (!btn) return;
      sizesContainer.querySelectorAll('.pdp-size-btn').forEach(function(b) { b.classList.remove('selected'); });
      btn.classList.add('selected');
      selectedSize = btn.getAttribute('data-size') || btn.textContent.trim();
      updateStickyBarText();
    });
  }

  /* ─── Smart Fit Assistant Modal ─────────────────────────────────────── */
  function initFitAssistant() {
    var fitBtn = document.getElementById('btnFitAssistant');
    var modal = document.getElementById('fitModal');
    if (!fitBtn || !modal) return;

    var closeBtn = modal.querySelector('.fit-modal-close');
    var backdrop = modal.querySelector('.fit-modal-backdrop');
    
    var heightInput = document.getElementById('fitHeightInput');
    var weightInput = document.getElementById('fitWeightInput');
    var fitOptions = modal.querySelectorAll('.fit-option-btn');
    
    var recResultBox = document.getElementById('fitRecResult');
    var recSizeText = document.getElementById('fitRecSizeText');
    var recExplanation = document.getElementById('fitRecExplanation');
    var useSizeBtn = document.getElementById('btnUseRecSize');

    function closeFitModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeFitModal);
    if (backdrop) backdrop.addEventListener('click', closeFitModal);

    function computeLiveFit() {
      if (!currentProduct) return;
      var h = parseInt(heightInput ? heightInput.value : 178) || 178;
      var w = parseInt(weightInput ? weightInput.value : 74) || 74;
      
      var availSizes = currentProduct.sizes || ['XS', 'S', 'M', 'L', 'XL'];
      var recSize = 'M';
      var explanation = '';

      // Apparel Alpha Sizes (XS - XL)
      if (availSizes.includes('M') && availSizes.includes('S')) {
        var baseIdx = 2; // Default 'M'
        if (w < 60 || (w < 65 && h < 170)) baseIdx = 0; // XS
        else if (w < 68 || (w < 72 && h < 174)) baseIdx = 1; // S
        else if (w < 82) baseIdx = 2; // M
        else if (w < 94) baseIdx = 3; // L
        else baseIdx = 4; // XL

        if (fitPreference === 'Slim') baseIdx = Math.max(0, baseIdx - 1);
        else if (fitPreference === 'Relaxed') baseIdx = Math.min(availSizes.length - 1, baseIdx + 1);

        recSize = availSizes[Math.min(baseIdx, availSizes.length - 1)];
        explanation = `For ${h}cm / ${w}kg with a ${fitPreference} silhouette, Size ${recSize} provides optimal shoulder seam alignment and comfortable chest drape without pulling.`;
      } 
      // European Tailoring Numeric Sizes (46 - 54)
      else if (availSizes.includes('48') || availSizes.includes('50')) {
        var euIdx = 1; // Default '48'
        if (w < 66) euIdx = 0; // 46
        else if (w < 75) euIdx = 1; // 48
        else if (w < 85) euIdx = 2; // 50
        else if (w < 95) euIdx = 3; // 52
        else euIdx = 4; // 54

        if (fitPreference === 'Slim') euIdx = Math.max(0, euIdx - 1);
        else if (fitPreference === 'Relaxed') euIdx = Math.min(availSizes.length - 1, euIdx + 1);

        recSize = availSizes[Math.min(euIdx, availSizes.length - 1)];
        explanation = `For ${h}cm / ${w}kg with a ${fitPreference} silhouette, EU Size ${recSize} provides clean waist taper and structured Italian shoulder pitch.`;
      } 
      // European Footwear (EU 40 - 45)
      else if (availSizes.some(s => s.startsWith('EU'))) {
        var shoeIdx = 2; // EU 42
        if (h < 170) shoeIdx = 0; // EU 40
        else if (h < 175) shoeIdx = 1; // EU 41
        else if (h < 180) shoeIdx = 2; // EU 42
        else if (h < 185) shoeIdx = 3; // EU 43
        else if (h < 190) shoeIdx = 4; // EU 44
        else shoeIdx = 5; // EU 45

        recSize = availSizes[Math.min(shoeIdx, availSizes.length - 1)];
        explanation = `Based on your height (${h}cm), ${recSize} offers proper toe box depth with snug heel cup containment.`;
      } else {
        recSize = availSizes[0] || 'Standard';
        explanation = `Standard universal fit calibrated for all proportions.`;
      }

      if (recSizeText) recSizeText.textContent = 'Size ' + recSize;
      if (recExplanation) recExplanation.textContent = explanation;
      if (useSizeBtn) {
        useSizeBtn.textContent = 'SELECT SIZE ' + recSize + ' & APPLY';
        useSizeBtn.setAttribute('data-rec-size', recSize);
      }
    }

    fitBtn.addEventListener('click', function() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
      computeLiveFit();
    });

    if (heightInput) heightInput.addEventListener('input', computeLiveFit);
    if (weightInput) weightInput.addEventListener('input', computeLiveFit);

    fitOptions.forEach(function(opt) {
      opt.addEventListener('click', function() {
        fitOptions.forEach(function(o) { o.classList.remove('selected'); });
        this.classList.add('selected');
        fitPreference = this.getAttribute('data-fit') || 'Regular';
        computeLiveFit();
      });
    });

    if (useSizeBtn) {
      useSizeBtn.addEventListener('click', function() {
        var targetSize = this.getAttribute('data-rec-size');
        if (targetSize) {
          selectedSize = targetSize;
          var sizesContainer = document.querySelector('.pdp-sizes-row');
          if (sizesContainer) {
            sizesContainer.querySelectorAll('.pdp-size-btn').forEach(function(b) {
              if (b.getAttribute('data-size') === targetSize || b.textContent.trim() === targetSize) {
                b.classList.add('selected');
              } else {
                b.classList.remove('selected');
              }
            });
          }
          var stickySize = document.getElementById('stickySizeLabel');
          if (stickySize) stickySize.textContent = 'Size ' + selectedSize;
        }
        closeFitModal();
      });
    }
  }

  /* â”€â”€ Add to Bag â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initAddToBag() {
    var addBtns = document.querySelectorAll('.btn-pdp-add-to-bag');
    addBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled || btn.classList.contains('adding')) return;
        btn.classList.add('adding');
        btn.textContent = 'ADDING"¦';

        setTimeout(function() {
          if (window.nexCart && currentProduct) {
            window.nexCart.addItem({
              id: currentProduct.id,
              name: currentProduct.name,
              size: selectedSize,
              qty: 1,
              price: currentProduct.price,
              image: currentProduct.images[0],
              category: currentProduct.category
            });
          }

          btn.innerHTML = '&#10003; ADDED TO BAG';
          btn.style.background = '#58D68D';
          btn.style.color = '#071A3A';

          setTimeout(function() {
            btn.classList.remove('adding');
            btn.textContent = 'ADD TO BAG';
            btn.style.background = '';
            btn.style.color = '';
          }, 2000);
        }, 600);
      });
    });
  }

  /* â”€â”€ Accordions â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initAccordions() {
    document.querySelectorAll('.pdp-accordion-header').forEach(function(hdr) {
      hdr.addEventListener('click', function() {
        var body = this.nextElementSibling;
        var icon = this.querySelector('.accordion-icon');
        if (body) {
          var isOpen = body.style.display === 'block';
          body.style.display = isOpen ? 'none' : 'block';
          if (icon) icon.textContent = isOpen ? '+' : 'âˆ’';
        }
      });
    });
  }

  /* â”€â”€ Mobile Sticky Bar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */
  function initMobileStickyBar() {
    var stickyBar = document.getElementById('mobileStickyBar');
    var mainCTA = document.getElementById('btnMainPdpAdd');
    if (!stickyBar || !mainCTA) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting && entry.boundingClientRect.top < 0 && window.innerWidth <= 768) {
          stickyBar.classList.add('visible');
        } else {
          stickyBar.classList.remove('visible');
        }
      });
    }, { threshold: 0.1 });

    observer.observe(mainCTA);
  }

  function updateStickyBarText() {
    var label = document.getElementById('stickySizeLabel');
    var colorLabel = document.querySelector('.pdp-swatch-group strong');
    var colorName = colorLabel ? colorLabel.textContent.trim() : '';
    if (label) {
      if (selectedSize) {
        label.textContent = 'Size ' + selectedSize + (colorName ? ' · ' + colorName : '');
      } else {
        label.textContent = colorName || 'In Stock';
      }
    }
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPDPEngine);
  } else {
    initPDPEngine();
  }
})();

