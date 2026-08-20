/* ─── nexCommerce: Product Detail Page (PDP) Dynamic Engine ────────────────────────
 * Reads ?id= from URL and renders the correct product.
 * Falls back to p1 (Cashmere Sweater) when no ID is provided.
 * ────────────────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ─── Product Catalog with Visual Specs & Perspectives ────────────────── */
  const PRODUCT_CATALOG = {
    p1: {
      id: 'p1',
      name: 'Cashmere Turtleneck Sweater',
      category: 'APPAREL',
      price: 185,
      formattedPrice: '€ 185.00',
      description: 'Spun from 2-ply Mongolian cashmere with relaxed raglan shoulders and ribbed trims for effortless evening drape.',
      details: '100% Mongolian 2-ply cashmere · 12-gauge knit · Hand-finished ribbed collar, cuffs & hem · Crafted in Ulaanbaatar, Mongolia',
      material: '100% Grade-A Cashmere. Dry clean or gentle hand wash cold with wool detergent. Store folded.',
      sizing: 'Relaxed architectural fit. True to size for effortless layering; choose one size down for a tailored silhouette.',
      shipping: 'Express DHL / DPD Tracked delivery available across Europe. Free delivery on orders over € 150.00.',
      images: [
        '../assets/images/products/hero_sweater.png',
        '../assets/images/lifestyle/sweater_lifestyle.png',
        '../assets/images/products/sweater_texture.png'
      ],
      perspectives: {
        flat: '../assets/images/products/hero_sweater.png',
        model: '../assets/images/lifestyle/sweater_lifestyle.png',
        macro: '../assets/images/products/sweater_texture.png'
      },
      specBadges: [
        { icon: 'map-pin', label: 'Origin', value: 'Ulaanbaatar, Mongolia' },
        { icon: 'layers', label: 'Fiber', value: '100% Grade-A Cashmere' },
        { icon: 'scale', label: 'Density', value: '420 GSM · 2-Ply Winter' },
        { icon: 'scissors', label: 'Craft', value: 'Hand-Linked Ribbing' }
      ],
      colors: [
        { name: 'Midnight', hex: '#0B1426' },
        { name: 'Charcoal', hex: '#2C2E35' },
        { name: 'Stone', hex: '#D6D3CC' }
      ],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      sizeChart: { XS: {min: 80, max: 87}, S: {min: 88, max: 94}, M: {min: 95, max: 101}, L: {min: 102, max: 108}, XL: {min: 109, max: 115} },
      breadcrumb: [{ label: 'Apparel', href: 'category.html?cat=apparel' }, { label: 'Knitwear', href: 'category.html?cat=apparel' }]
    },
    p2: {
      id: 'p2',
      name: 'Structured Wool Blazer',
      category: 'OUTERWEAR',
      price: 264,
      formattedPrice: '€ 264.00',
      description: 'Tailored from Italian virgin wool with unlined interior canvassing and horn buttons for comfortable evening wear.',
      details: '100% Italian Virgin Wool · Unlined soft shoulder construction · Real horn buttons · Double back vent · Crafted in Biella, Italy',
      material: '100% Pure Virgin Wool. Cupro sleeve lining. Dry clean only. Hang on wide cedar wooden hanger.',
      sizing: 'Modern European tailored cut. Fits true to size with slight room across the chest for light knitwear.',
      shipping: 'Express DHL Tracked delivery available. Garment bag and protective cedar hanger included.',
      images: [
        '../assets/images/products/plp_blazer.png',
        '../assets/images/lifestyle/hero_sweater_hd.jpg',
        '../assets/images/products/sweater_texture.png'
      ],
      perspectives: {
        flat: '../assets/images/products/plp_blazer.png',
        model: '../assets/images/lifestyle/hero_sweater_hd.jpg',
        macro: '../assets/images/products/sweater_texture.png'
      },
      specBadges: [
        { icon: 'map-pin', label: 'Origin', value: 'Biella, Italy' },
        { icon: 'layers', label: 'Weave', value: '100% Italian Virgin Wool' },
        { icon: 'shield-check', label: 'Structure', value: 'Unlined Soft Shoulder' },
        { icon: 'scissors', label: 'Hardware', value: 'Genuine Horn Buttons' }
      ],
      colors: [
        { name: 'Navy', hex: '#0B1B36' },
        { name: 'Charcoal', hex: '#26282E' },
        { name: 'Black', hex: '#0A0A0C' }
      ],
      sizes: ['46', '48', '50', '52', '54'],
      sizeChart: { '46': {min: 88, max: 94}, '48': {min: 95, max: 101}, '50': {min: 102, max: 108}, '52': {min: 109, max: 115}, '54': {min: 116, max: 122} },
      breadcrumb: [{ label: 'Outerwear', href: 'category.html?cat=outerwear' }, { label: 'Tailoring', href: 'category.html?cat=outerwear' }]
    },
    p3: {
      id: 'p3',
      name: 'Tailored Charcoal Overcoat',
      category: 'OUTERWEAR',
      price: 380,
      formattedPrice: '€ 380.00',
      description: 'Double-faced wool-cashmere blend with sharp notch lapels, mid-calf drape, and cupro sleeve lining.',
      details: '90% Virgin Wool, 10% Cashmere · Hand-stitched lapels · Center back vent · Deep welt pockets · Crafted in Florence, Italy',
      material: 'Wool-Cashmere Blend. Dry clean only. Brush with soft bristle clothes brush after wear.',
      sizing: 'Structured tailored overcoat cut. Designed to layer comfortably over suit jackets and thick knitwear.',
      shipping: 'Complimentary DHL Express Tracked delivery and garment preservation bag included.',
      images: [
        '../assets/images/products/plp_overcoat.png',
        '../assets/images/lifestyle/hero_sweater_landscape.jpg',
        '../assets/images/products/sweater_texture.png'
      ],
      perspectives: {
        flat: '../assets/images/products/plp_overcoat.png',
        model: '../assets/images/lifestyle/hero_sweater_landscape.jpg',
        macro: '../assets/images/products/sweater_texture.png'
      },
      specBadges: [
        { icon: 'map-pin', label: 'Origin', value: 'Florence, Italy' },
        { icon: 'layers', label: 'Composition', value: '90% Wool, 10% Cashmere' },
        { icon: 'scale', label: 'Weight', value: '560 GSM Heavy Melton' },
        { icon: 'scissors', label: 'Finishing', value: 'Hand-Canvassed Lapels' }
      ],
      colors: [
        { name: 'Charcoal', hex: '#2C2E35' },
        { name: 'Camel', hex: '#A88B6E' },
        { name: 'Midnight', hex: '#0B1426' }
      ],
      sizes: ['46', '48', '50', '52', '54'],
      sizeChart: { '46': {min: 88, max: 94}, '48': {min: 95, max: 101}, '50': {min: 102, max: 108}, '52': {min: 109, max: 115}, '54': {min: 116, max: 122} },
      breadcrumb: [{ label: 'Outerwear', href: 'category.html?cat=outerwear' }, { label: 'Coats', href: 'category.html?cat=outerwear' }]
    },
    p4: {
      id: 'p4',
      name: 'Sonic Aurora Headphones GT',
      category: 'ACOUSTICS',
      price: 320,
      formattedPrice: '€ 320.00',
      description: 'Precision 40mm titanium drivers with spatial audio tuning and active ambient isolation wrapped in lambskin.',
      details: '40mm Titanium Drivers · Hybrid Active Noise Cancellation · 45-Hour Battery · Full-Grain Lambskin Cushions · USB-C Fast Charge',
      material: 'Brushed anodized aluminum, stainless steel headband, memory foam with Ethiopian lambskin leather.',
      sizing: 'Universal ergonomic fit with 16-step detented extension headband and rotating earcups.',
      shipping: 'Express DHL Next Day delivery available. Hard-shell magnetic travel case and braided 3.5mm cable included.',
      images: [
        '../assets/images/products/prod_headphones.png',
        '../assets/images/lifestyle/headphone_lifestyle.png',
        '../assets/images/lifestyle/hero_headphone_hd.jpg'
      ],
      perspectives: {
        flat: '../assets/images/products/prod_headphones.png',
        model: '../assets/images/lifestyle/headphone_lifestyle.png',
        macro: '../assets/images/lifestyle/hero_headphone_hd.jpg'
      },
      specBadges: [
        { icon: 'volume-2', label: 'Drivers', value: '50mm Pure Beryllium' },
        { icon: 'shield-check', label: 'Chamber', value: '7075-T6 Alloy & Walnut' },
        { icon: 'battery-charging', label: 'Battery', value: '45-Hour Lossless Play' },
        { icon: 'zap', label: 'Latency', value: 'Ultra-Low 24-Bit Studio' }
      ],
      colors: [
        { name: 'Matte Black', hex: '#111215' },
        { name: 'Brushed Silver', hex: '#C2C5CC' },
        { name: 'Warm Amber', hex: '#8C5D38' }
      ],
      sizes: ['Standard Edition'],
      breadcrumb: [{ label: 'Acoustics', href: 'category.html?cat=acoustics' }, { label: 'Headphones', href: 'category.html?cat=acoustics' }]
    },
    p5: {
      id: 'p5',
      name: 'Horizon Wireless Earbuds',
      category: 'ACOUSTICS',
      price: 165,
      formattedPrice: '€ 165.00',
      description: 'Custom balanced armature drivers with low-latency spatial audio, Qi wireless fast charging, and IPX5 resistance.',
      details: 'Custom Balanced Armatures · IPX5 Sweat & Water Resistance · 32-Hour Reserve · Dual Beamforming Mics · Qi Wireless',
      material: 'Matte composite acoustic housing with precision aluminum touch surfaces.',
      sizing: 'Includes 4 medical-grade silicone ear tips (XS, S, M, L) and Comply isolation memory foam pairs.',
      shipping: 'Express DHL / DPD delivery available. Free delivery on orders over € 150.00.',
      images: [
        '../assets/images/products/search_earbuds.png',
        '../assets/images/products/prod_headphones.png',
        '../assets/images/lifestyle/headphone_lifestyle.png'
      ],
      perspectives: {
        flat: '../assets/images/products/search_earbuds.png',
        model: '../assets/images/lifestyle/headphone_lifestyle.png',
        macro: '../assets/images/products/prod_headphones.png'
      },
      specBadges: [
        { icon: 'volume-2', label: 'Audio', value: 'Dual Armature Drivers' },
        { icon: 'droplet', label: 'Protection', value: 'IPX5 Water Resistant' },
        { icon: 'battery', label: 'Reserve', value: '32h Total Battery' },
        { icon: 'wifi', label: 'Codec', value: 'aptX HD Lossless' }
      ],
      colors: [
        { name: 'Matte Black', hex: '#111215' },
        { name: 'Obsidian Slate', hex: '#2A303C' }
      ],
      sizes: ['Standard Fit'],
      breadcrumb: [{ label: 'Acoustics', href: 'category.html?cat=acoustics' }, { label: 'Earbuds', href: 'category.html?cat=acoustics' }]
    },
    p6: {
      id: 'p6',
      name: 'Minimalist Leather Runner',
      category: 'FOOTWEAR',
      price: 198,
      formattedPrice: '€ 198.00',
      description: 'Handcrafted from Italian calfskin leather with shock-absorbing Vibram rubber cupsole and ergonomic leather footbed.',
      details: 'Full-Grain Italian Calfskin · Stitched Vibram Rubber Cupsole · Padded Leather Collar · Gold-Foil Serial Stamp · Made in Marche, Italy',
      material: '100% Full-grain calfskin upper and lining. Natural rubber cupsole. Wipe with damp cloth.',
      sizing: 'European sizing. Fits true to size; if between sizes, choose the smaller size.',
      shipping: 'Express DHL / DPD delivery available. Includes dual dust bags and spare waxed cotton laces.',
      images: [
        '../assets/images/products/prod_runner.png',
        '../assets/images/lifestyle/runner_lifestyle.png',
        '../assets/images/lifestyle/sweater_lifestyle.png'
      ],
      perspectives: {
        flat: '../assets/images/products/prod_runner.png',
        model: '../assets/images/lifestyle/runner_lifestyle.png',
        macro: '../assets/images/lifestyle/tote_lifestyle.png'
      },
      specBadges: [
        { icon: 'map-pin', label: 'Origin', value: 'Marche, Italy' },
        { icon: 'layers', label: 'Upper', value: 'Full-Grain Italian Calfskin' },
        { icon: 'activity', label: 'Sole', value: 'Stitched Vibram Cupsole' },
        { icon: 'award', label: 'Longevity', value: 'Goodyear Reinforced' }
      ],
      colors: [
        { name: 'Pure White', hex: '#F0EFEA' },
        { name: 'Triple Black', hex: '#0D0E11' },
        { name: 'Chalk Gum', hex: '#D8D4C8' }
      ],
      sizes: ['EU 40', 'EU 41', 'EU 42', 'EU 43', 'EU 44', 'EU 45'],
      breadcrumb: [{ label: 'Footwear', href: 'category.html?cat=footwear' }, { label: 'Sneakers', href: 'category.html?cat=footwear' }]
    },
    p7: {
      id: 'p7',
      name: 'Quilted Leather Structured Tote',
      category: 'ACCESSORIES',
      price: 285,
      formattedPrice: '€ 285.00',
      description: 'Chevron-quilted full-grain nappa leather with polished antique gold hardware and dual interior compartments.',
      details: 'Italian Nappa Leather · Polished Solid Brass Hardware · Magnetic Top Closure · Suede Interior Lining · 38cm × 28cm × 14cm',
      material: '100% Full-grain nappa leather. Microsuede lining. Solid brass hardware with protective coating.',
      sizing: 'Accommodates up to a 14-inch laptop with dedicated tablet pocket and zipped central divider.',
      shipping: 'Express DHL / DPD delivery available. Includes silk-blend dust bag and leather conditioner sample.',
      images: [
        '../assets/images/products/prod_tote.png',
        '../assets/images/lifestyle/tote_lifestyle.png',
        '../assets/images/lifestyle/hero_tote_hd.jpg'
      ],
      perspectives: {
        flat: '../assets/images/products/prod_tote.png',
        model: '../assets/images/lifestyle/tote_lifestyle.png',
        macro: '../assets/images/lifestyle/hero_tote_hd.jpg'
      },
      specBadges: [
        { icon: 'map-pin', label: 'Tannery', value: 'Santa Croce, Tuscany' },
        { icon: 'layers', label: 'Leather', value: 'Full-Grain Italian Nappa' },
        { icon: 'shield', label: 'Hardware', value: 'Solid Polished Brass' },
        { icon: 'briefcase', label: 'Capacity', value: 'Holds 14" Laptop' }
      ],
      colors: [
        { name: 'Noir Black', hex: '#0A0A0C' },
        { name: 'Oxblood', hex: '#4A151B' },
        { name: 'Caramel Tan', hex: '#9E6A38' }
      ],
      sizes: ['Medium Tote'],
      breadcrumb: [{ label: 'Accessories', href: 'category.html?cat=accessories' }, { label: 'Bags & Totes', href: 'category.html?cat=accessories' }]
    },
    p8: {
      id: 'p8',
      name: 'Chronograph Minimalist Timepiece',
      category: 'ACCESSORIES',
      price: 342,
      formattedPrice: '€ 342.00',
      description: 'Brushed matte titanium case housing a Swiss automatic movement with sapphire crystal and interchangeable calfskin strap.',
      details: 'Grade 5 Titanium Case · 40mm Diameter · Anti-Reflective Sapphire Crystal · 38-Hour Power Reserve · 5 ATM Water Resistance',
      material: 'Grade 5 Titanium, double-domed sapphire crystal with anti-reflective coating, Italian calfskin strap.',
      sizing: 'Universal 40mm case diameter with 20mm quick-release Italian leather strap.',
      shipping: 'Express DHL insured delivery available. Solid walnut presentation box and 3-year warranty card included.',
      images: [
        '../assets/images/products/search_watch.png',
        '../assets/images/lifestyle/hero_watch_hd.jpg',
        '../assets/images/lifestyle/thumb_watch.jpg'
      ],
      perspectives: {
        flat: '../assets/images/products/search_watch.png',
        model: '../assets/images/lifestyle/hero_watch_hd.jpg',
        macro: '../assets/images/lifestyle/thumb_watch.jpg'
      },
      specBadges: [
        { icon: 'shield', label: 'Case', value: 'Grade 5 Brushed Titanium' },
        { icon: 'sun', label: 'Glass', value: 'AR Sapphire Crystal' },
        { icon: 'clock', label: 'Caliber', value: 'Swiss Automatic 4Hz' },
        { icon: 'droplet', label: 'Depth', value: '5 ATM (50m Waterproof)' }
      ],
      colors: [
        { name: 'Matte Titanium', hex: '#7A808C' },
        { name: 'Midnight DLC', hex: '#14161A' }
      ],
      sizes: ['40mm Case'],
      breadcrumb: [{ label: 'Accessories', href: 'category.html?cat=accessories' }, { label: 'Timepieces', href: 'category.html?cat=accessories' }]
    }
  };

  let currentProduct = null;
  let selectedSize = '';
  let selectedColor = '';
  let activePerspective = 'flat';

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/[&<>"']/g, function(m) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m];
    });
  }

  /* ─── Main Init ─────────────────────────────────────────────────────── */
  function initPDPEngine() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id') || 'p1';
    currentProduct = PRODUCT_CATALOG[productId] || PRODUCT_CATALOG['p1'];

    renderProductPage(currentProduct);
    initPerspectiveSelector();
    initSearchContext();
    initGallerySwitcher();
    initVariantSelectors();
    initFitAssistant();
    initAddToBag();
    initAccordions();
    initCompleteLookSection();
    initMobileStickyBar();

    if (window.lucide) window.lucide.createIcons();
  }

  /* ─── Dynamic Product Renderer ────────────────────────────────────────── */
  function renderProductPage(product) {
    document.title = product.name + ' — nexCommerce';

    // Breadcrumb
    const breadcrumbEl = document.querySelector('.pdp-breadcrumb');
    if (breadcrumbEl) {
      const crumbs = product.breadcrumb.map(c => '<a href="' + c.href + '">' + escapeHtml(c.label) + '</a>').join('<span>/</span>');
      breadcrumbEl.innerHTML = '<a href="../index.html">Home</a><span>/</span>' + crumbs + '<span>/</span><span class="pdp-breadcrumb-active">' + escapeHtml(product.name) + '</span>';
    }

    // Main Image & Thumbnails
    const thumbStrip = document.querySelector('.pdp-thumb-strip');
    const mainImg = document.getElementById('pdpMainImg');
    if (thumbStrip && mainImg) {
      mainImg.src = product.images[0];
      mainImg.alt = product.name;
      thumbStrip.innerHTML = product.images.map(function(src, i) {
        return '<img src="' + src + '" alt="' + escapeHtml(product.name) + ' view ' + (i+1) + '" class="pdp-thumb-img' + (i === 0 ? ' active' : '') + '" style="cursor:pointer;">';
      }).join('');
    }

    // Category Eyebrow
    const eyebrow = document.querySelector('.pdp-category-eyebrow');
    if (eyebrow) eyebrow.textContent = product.category + ' · ATELIER EDITION';

    // Title
    let titleEl = document.querySelector('.pdp-product-title');
    if (!titleEl) titleEl = document.querySelector('h1');
    if (titleEl) titleEl.textContent = product.name;

    // Price
    const priceEl = document.querySelector('.pdp-price-tag');
    if (priceEl) priceEl.textContent = product.formattedPrice;

    // Short Description
    const descEl = document.querySelector('.pdp-short-desc');
    if (descEl) descEl.textContent = product.description;

    // Visual Specification Badges Grid (Replacing Prose)
    const specGrid = document.getElementById('pdpSpecBadgesGrid');
    if (specGrid && product.specBadges) {
      specGrid.innerHTML = product.specBadges.map(function(spec) {
        return '<div class="pdp-spec-badge-card">'
          + '<div class="pdp-spec-icon-pedestal"><i data-lucide="' + spec.icon + '" style="width:14px;height:14px;"></i></div>'
          + '<div class="pdp-spec-badge-info">'
          + '<span class="pdp-spec-badge-label">' + escapeHtml(spec.label) + '</span>'
          + '<span class="pdp-spec-badge-val">' + escapeHtml(spec.value) + '</span>'
          + '</div>'
          + '</div>';
      }).join('');
    }

    // Tactile Circular Color Swatches
    const colorContainer = document.getElementById('pdpColorSwatchesRow');
    const colorLabel = document.getElementById('selectedColorLabel');
    if (colorContainer && product.colors) {
      selectedColor = typeof product.colors[0] === 'object' ? product.colors[0].name : product.colors[0];
      if (colorLabel) colorLabel.textContent = selectedColor;

      colorContainer.innerHTML = product.colors.map(function(col, i) {
        const colName = typeof col === 'object' ? col.name : col;
        const colHex = typeof col === 'object' ? col.hex : '#2C2E35';
        return '<button class="pdp-color-swatch-circle' + (i === 0 ? ' selected' : '') + '" data-color="' + escapeHtml(colName) + '" style="--swatch-hex: ' + colHex + ';" title="' + escapeHtml(colName) + '" aria-label="Color ' + escapeHtml(colName) + '">'
          + '<span class="swatch-color-fill"></span>'
          + '</button>';
      }).join('');
    }

    // Size Selector
    const sizesContainer = document.querySelector('.pdp-sizes-row');
    const fitBtn = document.getElementById('btnFitAssistant');
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

    // Accordions
    const detailsBody = document.getElementById('accordionDetailsBody');
    if (detailsBody) detailsBody.innerHTML = '<p>' + escapeHtml(product.details) + '</p>';

    const materialBody = document.getElementById('accordionMaterialBody');
    if (materialBody) materialBody.innerHTML = '<p>' + escapeHtml(product.material || product.details) + '</p>';

    const sizingBody = document.getElementById('accordionSizingBody');
    if (sizingBody) sizingBody.innerHTML = '<p>' + escapeHtml(product.sizing || product.details) + '</p>';

    // Mobile Sticky Bar
    const stickyPrice = document.getElementById('stickyPriceLabel');
    if (stickyPrice) stickyPrice.textContent = product.formattedPrice;
    updateStickyBarText();
  }

  /* ─── Perspective Selector (Flat / Model / Macro) ──────────────────────── */
  function initPerspectiveSelector() {
    const perspectiveBtns = document.querySelectorAll('.pdp-perspective-btn');
    const mainImg = document.getElementById('pdpMainImg');
    const thumbStrip = document.querySelector('.pdp-thumb-strip');
    if (!perspectiveBtns.length || !mainImg) return;

    perspectiveBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const perspective = btn.dataset.perspective;
        if (!currentProduct || !currentProduct.perspectives || !currentProduct.perspectives[perspective]) return;

        perspectiveBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activePerspective = perspective;

        const newSrc = currentProduct.perspectives[perspective];
        mainImg.style.opacity = '0.3';
        mainImg.style.transition = 'opacity 0.2s ease, transform 0.3s ease';

        setTimeout(() => {
          mainImg.src = newSrc;
          mainImg.style.opacity = '1';

          // Sync active thumbnail
          if (thumbStrip) {
            thumbStrip.querySelectorAll('.pdp-thumb-img').forEach(t => {
              if (t.src.includes(newSrc.replace('../', '')) || newSrc.includes(t.getAttribute('src'))) {
                t.classList.add('active');
              } else {
                t.classList.remove('active');
              }
            });
          }
        }, 150);
      });
    });
  }

  /* ─── Gallery Switcher ────────────────────────────────────────────────── */
  function initGallerySwitcher() {
    const thumbStrip = document.querySelector('.pdp-thumb-strip');
    const mainImg = document.getElementById('pdpMainImg');
    if (!thumbStrip || !mainImg) return;

    thumbStrip.addEventListener('click', function(e) {
      const thumb = e.target.closest('.pdp-thumb-img');
      if (!thumb) return;
      thumbStrip.querySelectorAll('.pdp-thumb-img').forEach(function(t) { t.classList.remove('active'); });
      thumb.classList.add('active');

      mainImg.style.opacity = '0.3';
      setTimeout(() => {
        mainImg.src = thumb.src;
        mainImg.style.opacity = '1';
      }, 120);
    });
  }

  /* ─── Variant Selectors (Color & Size) ────────────────────────────────── */
  function initVariantSelectors() {
    // Color Swatches
    const colorContainer = document.getElementById('pdpColorSwatchesRow');
    const colorLabel = document.getElementById('selectedColorLabel');
    if (colorContainer) {
      colorContainer.addEventListener('click', function(e) {
        const btn = e.target.closest('.pdp-color-swatch-circle');
        if (!btn) return;
        colorContainer.querySelectorAll('.pdp-color-swatch-circle').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedColor = btn.dataset.color;
        if (colorLabel) colorLabel.textContent = selectedColor;
        updateStickyBarText();
      });
    }

    // Size Buttons
    const sizesContainer = document.querySelector('.pdp-sizes-row');
    if (sizesContainer) {
      sizesContainer.addEventListener('click', function(e) {
        const btn = e.target.closest('.pdp-size-btn');
        if (!btn) return;
        sizesContainer.querySelectorAll('.pdp-size-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedSize = btn.dataset.size;
        updateStickyBarText();
      });
    }
  }

  function updateStickyBarText() {
    const stickyMeta = document.getElementById('stickySizeLabel');
    if (stickyMeta && currentProduct) {
      stickyMeta.textContent = 'Size ' + (selectedSize || 'M') + ' · ' + (selectedColor || 'Midnight');
    }
  }

  /* ─── AI Fit Assistant ───────────────────────────────────────────────── */
  function initFitAssistant() {
    const fitBtn = document.getElementById('btnFitAssistant');
    const modal = document.getElementById('pdpFitModal');
    const closeBtn = document.getElementById('btnCloseFitModal');
    const applyBtn = document.getElementById('btnUseRecSize');
    const heightInput = document.getElementById('fitInputHeight');
    const weightInput = document.getElementById('fitInputWeight');
    const prefRow = document.getElementById('fitPrefRow');
    const recDisplay = document.getElementById('fitRecSizeDisplay');
    const recReasoning = document.getElementById('fitRecReasoning');

    if (!fitBtn || !modal) return;

    fitBtn.addEventListener('click', () => {
      modal.classList.add('active');
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });

    function calculateSize() {
      const h = parseInt(heightInput.value) || 178;
      const w = parseInt(weightInput.value) || 72;
      let rec = 'M';

      if (w < 65) rec = 'S';
      else if (w >= 65 && w < 80) rec = 'M';
      else if (w >= 80 && w < 92) rec = 'L';
      else rec = 'XL';

      if (recDisplay) recDisplay.textContent = rec;
      if (applyBtn) {
        applyBtn.textContent = 'SELECT SIZE ' + rec + ' & APPLY';
        applyBtn.dataset.recSize = rec;
      }
      if (recReasoning) {
        recReasoning.innerHTML = 'Based on ' + h + 'cm / ' + w + 'kg with ' + fitPreference + ' drape, size <strong>' + rec + '</strong> delivers balanced shoulder drape with comfortable ease.';
      }
    }

    if (heightInput) heightInput.addEventListener('input', calculateSize);
    if (weightInput) weightInput.addEventListener('input', calculateSize);

    if (prefRow) {
      prefRow.addEventListener('click', (e) => {
        const btn = e.target.closest('.fit-pref-btn');
        if (!btn) return;
        prefRow.querySelectorAll('.fit-pref-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        fitPreference = btn.dataset.fit;
        calculateSize();
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        const rec = applyBtn.dataset.recSize || 'M';
        const targetBtn = document.querySelector('.pdp-size-btn[data-size="' + rec + '"]');
        if (targetBtn) targetBtn.click();
        modal.classList.remove('active');
      });
    }
  }

  /* ─── Add to Bag Commerce Handler ─────────────────────────────────────── */
  function initAddToBag() {
    const addBtn = document.getElementById('btnMainPdpAdd');
    const stickyAddBtn = document.querySelector('.mobile-sticky-bar-cta');

    function performAdd() {
      if (!currentProduct) return;
      if (window.nexCart && typeof window.nexCart.addItem === 'function') {
        window.nexCart.addItem({
          id: currentProduct.id,
          name: currentProduct.name,
          price: currentProduct.price,
          image: currentProduct.images[0],
          size: selectedSize || 'M',
          color: selectedColor || 'Standard',
          qty: 1
        });
        if (typeof window.nexCart.openDrawer === 'function') {
          window.nexCart.openDrawer();
        }
      }
    }

    if (addBtn) addBtn.addEventListener('click', performAdd);
    if (stickyAddBtn) stickyAddBtn.addEventListener('click', performAdd);
  }

  /* ─── Accordions ─────────────────────────────────────────────────────── */
  function initAccordions() {
    document.querySelectorAll('.pdp-accordion-header').forEach(header => {
      header.addEventListener('click', () => {
        const item = header.closest('.pdp-accordion-item');
        if (!item) return;
        const isOpen = item.classList.contains('open');
        document.querySelectorAll('.pdp-accordion-item').forEach(i => i.classList.remove('open'));
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  /* ─── Complete the Look Bundle ────────────────────────────────────────── */
  const COMPLETE_LOOK_MAP = {
    p1: ['p2', 'p6', 'p8'],
    p2: ['p1', 'p6', 'p7'],
    p3: ['p1', 'p6', 'p8'],
    p4: ['p1', 'p7', 'p8'],
    p5: ['p2', 'p6', 'p7'],
    p6: ['p1', 'p2', 'p7'],
    p7: ['p1', 'p2', 'p8'],
    p8: ['p2', 'p6', 'p7']
  };

  function initCompleteLookSection() {
    const grid = document.getElementById('pdpCompleteLookGrid');
    const origPriceEl = document.getElementById('pdpBundleOriginalPrice');
    const finalPriceEl = document.getElementById('pdpBundleFinalPrice');
    const bundleBtn = document.getElementById('btnAddCompleteLookBtn');
    const bundleBtnText = document.getElementById('pdpBundleBtnText');
    if (!grid || !currentProduct) return;

    const pairIds = COMPLETE_LOOK_MAP[currentProduct.id] || ['p2', 'p6', 'p8'];
    const pairedItems = pairIds.map(id => PRODUCT_CATALOG[id]).filter(Boolean);

    const allLookItems = [currentProduct].concat(pairedItems);
    const originalTotal = allLookItems.reduce((acc, item) => acc + item.price, 0);
    const discountedTotal = Math.round(originalTotal * 0.9);

    if (origPriceEl) origPriceEl.textContent = '€ ' + Number(originalTotal).toFixed(2);
    if (finalPriceEl) finalPriceEl.textContent = '€ ' + Number(discountedTotal).toFixed(2);
    if (bundleBtnText) bundleBtnText.textContent = 'ADD ENTIRE LOOK (' + allLookItems.length + ' PIECES)';

    grid.innerHTML = pairedItems.map(item => `
      <div class="plp-card luxury-product-card" data-id="${item.id}">
        <div class="plp-card-media">
          <a href="product.html?id=${item.id}" class="plp-card-img-anchor">
            <img src="${item.images[0]}" alt="${escapeHtml(item.name)}" class="plp-card-img" loading="lazy">
          </a>
          <button class="plp-quick-add-btn btn-plp-add-to-bag" data-id="${item.id}">
            <i data-lucide="shopping-bag" style="width: 13px; height: 13px; margin-right: 6px;"></i>
            <span>QUICK ADD</span>
          </button>
        </div>
        <div class="plp-card-info">
          <span class="plp-card-category-label">${item.category}</span>
          <a href="product.html?id=${item.id}" class="plp-card-title-link">
            <h3 class="plp-card-name">${escapeHtml(item.name)}</h3>
          </a>
          <div class="plp-card-price-tag">${item.formattedPrice}</div>
        </div>
      </div>
    `).join('');

    if (bundleBtn) {
      bundleBtn.onclick = function() {
        if (!window.nexCart) return;
        allLookItems.forEach(item => {
          window.nexCart.addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.images[0],
            size: item.sizes[0] || 'Standard'
          });
        });
        if (typeof window.nexCart.openDrawer === 'function') {
          window.nexCart.openDrawer();
        }
      };
    }
  }

  function initMobileStickyBar() {
    const bar = document.getElementById('mobileStickyBar');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      if (window.scrollY > 450) {
        bar.classList.add('visible');
      } else {
        bar.classList.remove('visible');
      }
    });
  }

  function initSearchContext() {}

  document.addEventListener('DOMContentLoaded', initPDPEngine);
})();
