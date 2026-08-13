/* ─── nexCommerce: Product Detail Page (PDP) Dynamic Engine ───────────────────
 * Reads ?id= from URL and renders the correct product.
 * Falls back to p1 (Cashmere Sweater) when no ID is provided.
 * ────────────────────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── Product Catalog ───────────────────────────────────────────────── */
  const PRODUCT_CATALOG = {
    p1: {
      id: 'p1',
      name: 'Architectural Cashmere Sweater',
      category: 'APPAREL',
      price: 18400,
      formattedPrice: 'BDT 18,400',
      description: 'Structured cashmere knit with lightweight warmth and a relaxed architectural silhouette. Crafted for evening refinement.',
      details: 'Mongolian 2-ply cashmere · Dropped shoulder seam · Machine-wash cold · Country of origin: Mongolia',
      sizing: 'True to size. Size down for a tailored look or up for a relaxed drape.',
      shipping: 'Express Next Day available. Free standard delivery on orders over BDT 20,000.',
      images: ['hero_sweater.png', 'sweater_texture.png', 'sweater_lifestyle.png'],
      colors: ['Midnight', 'Ivory', 'Slate'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      breadcrumb: [{ label: 'Apparel', href: 'category.html?cat=apparel' }, { label: 'Sweaters', href: 'category.html?cat=apparel' }]
    },
    p2: {
      id: 'p2',
      name: 'Structured Wool Blazer',
      category: 'APPAREL',
      price: 24500,
      formattedPrice: 'BDT 24,500',
      description: 'Unlined merino weave tailored for sharp evening silhouettes without thermal discomfort. Transitions effortlessly from meeting room to dinner.',
      details: 'Merino wool blend · Unlined construction · Dry clean recommended · Country of origin: Italy',
      sizing: 'European tailored fit. Size up one if you prefer relaxed shoulders or plan to layer underneath.',
      shipping: 'Express Next Day available. Free standard delivery on orders over BDT 20,000.',
      images: ['plp_blazer.png', 'hero_jeans_rack.png'],
      colors: ['Charcoal', 'Navy', 'Sand'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      breadcrumb: [{ label: 'Apparel', href: 'category.html?cat=apparel' }, { label: 'Blazers', href: 'category.html?cat=apparel' }]
    },
    p3: {
      id: 'p3',
      name: 'Fine-Knit Cashmere Crew',
      category: 'APPAREL',
      price: 16200,
      formattedPrice: 'BDT 16,200',
      description: 'Ultra-soft 2-ply cashmere with a classic crew neck designed for easy indoor/outdoor layering in any season.',
      details: '2-ply Mongolian cashmere · Ribbed cuffs and hem · Hand-wash cold · Country of origin: Mongolia',
      sizing: 'Runs slightly slim. Size up for a relaxed fit or true-to-size for a neat silhouette.',
      shipping: 'Express Next Day available. Free standard delivery on orders over BDT 20,000.',
      images: ['plp_crewneck.png', 'hero_sweater.png'],
      colors: ['Oatmeal', 'Black', 'Camel'],
      sizes: ['XS', 'S', 'M', 'L', 'XL'],
      breadcrumb: [{ label: 'Apparel', href: 'category.html?cat=apparel' }, { label: 'Knitwear', href: 'category.html?cat=apparel' }]
    },
    p4: {
      id: 'p4',
      name: 'Studio Acoustics Headphone GT',
      category: 'ACOUSTICS',
      price: 32000,
      formattedPrice: 'BDT 32,000',
      description: 'Active noise cancellation calibrated for focused work or travel. Memory foam ear cushions wrapped in lambskin for extended comfort.',
      details: '40-hour battery · ANC + Transparency mode · USB-C charging · Foldable · Bluetooth 5.3',
      sizing: 'One size fits all. Adjustable stainless steel headband with 15-step extension.',
      shipping: 'Express Next Day available. Free standard delivery on orders over BDT 20,000.',
      images: ['prod_headphones.png', 'p4.png'],
      colors: ['Matte Black', 'Silver'],
      sizes: ['One Size'],
      breadcrumb: [{ label: 'Acoustics', href: 'category.html?cat=acoustics' }, { label: 'Headphones', href: 'category.html?cat=acoustics' }]
    },
    p5: {
      id: 'p5',
      name: 'Chronograph Minimalist Watch',
      category: 'ACCESSORIES',
      price: 28500,
      formattedPrice: 'BDT 28,500',
      description: 'Brushed titanium casing with a scratch-resistant sapphire crystal. Swiss movement with interchangeable leather and mesh straps.',
      details: 'Swiss automatic movement · Sapphire crystal · 100m water resistance · Titanium case · 40mm diameter',
      sizing: 'Standard 20mm lug width. Compatible with any 20mm strap.',
      shipping: 'Express Next Day available. Free standard delivery on orders over BDT 20,000.',
      images: ['search_watch.png', 'p3.png'],
      colors: ['Titanium', 'Black DLC'],
      sizes: ['One Size'],
      breadcrumb: [{ label: 'Accessories', href: 'category.html?cat=accessories' }, { label: 'Watches', href: 'category.html?cat=accessories' }]
    },
    p6: {
      id: 'p6',
      name: 'Minimalist Leather Runner',
      category: 'FOOTWEAR',
      price: 19800,
      formattedPrice: 'BDT 19,800',
      description: 'Full-grain Italian leather upper with cushioned Vibram sole for all-day urban walkability without compromise.',
      details: 'Full-grain Italian leather · Vibram outsole · Calfskin lining · Standard D width',
      sizing: 'Fits true to size. Order your standard European size.',
      shipping: 'Express Next Day available. Free standard delivery on orders over BDT 20,000.',
      images: ['prod_runner.png', 'p2.png'],
      colors: ['White/Gum', 'Black', 'Tan'],
      sizes: ['40', '41', '42', '43', '44', '45'],
      breadcrumb: [{ label: 'Footwear', href: 'category.html?cat=footwear' }, { label: 'Sneakers', href: 'category.html?cat=footwear' }]
    }
  };

  let currentProduct = null;
  let selectedSize = '';
  let fitPreference = 'Regular';

  /* ── Main Init ───────────────────────────────────────────────────── */
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
    initMobileStickyBar();
  }

  /* ── Dynamic Product Renderer ───────────────────────────────────────── */
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

    // Size buttons
    var sizesContainer = document.querySelector('.pdp-sizes-row');
    if (sizesContainer) {
      sizesContainer.innerHTML = product.sizes.map(function(sz, i) {
        return '<button class="pdp-size-btn' + (i === 0 ? ' selected' : '') + '" data-size="' + sz + '">' + escapeHtml(sz) + '</button>';
      }).join('');
      selectedSize = product.sizes[0];
    } else {
      selectedSize = product.sizes[0] || 'M';
    }

    // Accordion bodies (if elements exist)
    var detailsBody = document.getElementById('accordionDetailsBody');
    if (detailsBody) detailsBody.innerHTML = '<p style="line-height:1.7;color:var(--text-secondary);font-size:14px;">' + escapeHtml(product.details) + '</p>';

    var sizingBody = document.getElementById('accordionSizingBody');
    if (sizingBody) sizingBody.innerHTML = '<p style="line-height:1.7;color:var(--text-secondary);font-size:14px;">' + escapeHtml(product.sizing) + '</p>';

    var shippingBody = document.getElementById('accordionShippingBody');
    if (shippingBody) shippingBody.innerHTML = '<p style="line-height:1.7;color:var(--text-secondary);font-size:14px;">' + escapeHtml(product.shipping) + '</p>';

    // Mobile sticky bar
    var stickyName = document.getElementById('stickyProductName');
    if (stickyName) stickyName.textContent = product.name;
  }

  /* ── AI Context Retention Bar & Feature 2 Context Match ─────────────── */
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

    // 2. Context Match "Why This Fits" (Feature 2)
    var matchResult = window.NexContextEngine.evaluateMatch(savedContext, currentProduct);
    if (matchResult && matchResult.isMatch && matchBox) {
      matchBox.innerHTML = '<div class="pdp-context-match">'
        + '<div class="pdp-context-eyebrow"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>SELECTED FOR YOUR SEARCH</div>'
        + '<div class="pdp-context-body">' + escapeHtml(matchResult.explanation) + '</div>'
        + '<a href="discovery.html?q=' + encodeURIComponent(savedContext.raw) + '" class="pdp-context-link">Refine search &rarr;</a>'
        + '</div>';
      matchBox.style.display = 'block';
    } else if (matchBox) {
      matchBox.style.display = 'none';
    }

    // 3. Alternative Recommendations (Feature 2)
    if (recsSection && recsGrid) {
      var alternatives = window.NexContextEngine.getAlternativeRecommendations(savedContext, currentProduct.id);
      if (alternatives.length > 0) {
        recsGrid.innerHTML = alternatives.map(function(p) {
          return '<div class="ai-recommendation-card" style="border:1px solid var(--border-subtle); border-radius:6px; overflow:hidden;">'
            + '<div style="aspect-ratio:4/5; overflow:hidden;"><img src="' + escapeHtml(p.images ? p.images[0] : (p.image || p.img)) + '" alt="' + escapeHtml(p.title || p.name) + '" style="width:100%;height:100%;object-fit:cover;"></div>'
            + '<div style="padding:16px;">'
            + '<span style="font-size:10px; font-weight:600; text-transform:uppercase; color:var(--text-secondary); margin-bottom:4px; display:block;">' + escapeHtml(p.category || '') + '</span>'
            + '<h4 style="font-family:var(--font-serif);font-size:18px;font-weight:500;margin:0 0 8px;">' + escapeHtml(p.title || p.name) + '</h4>'
            + '<div style="font-size:14px; margin-bottom:16px;">' + escapeHtml(p.formattedPrice || 'BDT ' + (p.numericPrice || p.price || '').toLocaleString()) + '</div>'
            + '<button class="btn-primary-commerce" style="width:100%;height:40px;font-size:11px;" onclick="window.location.href=\'product.html?id=' + escapeHtml(p.id) + '\'">VIEW PRODUCT</button>'
            + '</div></div>';
        }).join('');
        recsSection.style.display = 'block';
        
        if (window.dataLayer) window.dataLayer.push({ event: 'ai_recommendation_displayed', result_count: alternatives.length });
      }
    }
  }

  /* ── Gallery Switcher ─────────────────────────────────────────────────── */
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

  /* ── Size Selectors ────────────────────────────────────────────────────── */
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

  /* ── Fit Assistant Modal ─────────────────────────────────────────────── */
  function initFitAssistant() {
    var fitBtn = document.getElementById('btnFitAssistant');
    var modal = document.getElementById('fitModal');
    if (!fitBtn || !modal) return;

    var closeBtn = modal.querySelector('.fit-modal-close');
    var backdrop = modal.querySelector('.fit-modal-backdrop');
    var fitOptions = modal.querySelectorAll('.fit-option-btn');
    var recResult = document.getElementById('fitRecResult');
    var useSizeBtn = document.getElementById('btnUseRecSize');

    fitBtn.addEventListener('click', function() {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    function closeFitModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (closeBtn) closeBtn.addEventListener('click', closeFitModal);
    if (backdrop) backdrop.addEventListener('click', closeFitModal);

    fitOptions.forEach(function(opt) {
      opt.addEventListener('click', function() {
        fitOptions.forEach(function(o) { o.classList.remove('selected'); });
        this.classList.add('selected');
        fitPreference = this.getAttribute('data-fit') || 'Regular';

        var sizes = currentProduct ? currentProduct.sizes : ['S', 'M', 'L'];
        var recommended = sizes[Math.floor(sizes.length / 2)] || 'M';
        var garment = currentProduct ? currentProduct.name.toLowerCase() : 'garment';
        var explanation = 'A regular fit in ' + recommended + ' gives you enough room through the shoulders without making the ' + garment + ' feel oversized.';

        if (fitPreference === 'Slim') {
          recommended = sizes[1] || sizes[0] || 'S';
          explanation = 'A slim fit contours cleanly for a tailored silhouette. Size ' + recommended + ' ensures the ' + garment + ' sits close to the body.';
        } else if (fitPreference === 'Relaxed') {
          recommended = sizes[sizes.length - 2] || sizes[sizes.length - 1] || 'L';
          explanation = 'A relaxed fit offers comfortable layering room and subtle drape. Size ' + recommended + ' will give this ' + garment + ' a modern, oversized aesthetic.';
        }

        if (recResult) {
          recResult.innerHTML = '<div style="padding:14px;background:rgba(0,200,255,0.08);border:1px solid rgba(0,200,255,0.2);border-radius:6px;"><div style="font-size:11px;font-weight:600;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:4px;">Recommended Size</div><div style="font-family:var(--font-serif);font-size:28px;font-weight:600;color:var(--text-primary);margin-bottom:4px;">Size ' + recommended + '</div><p style="font-size:13px;color:var(--text-secondary);line-height:1.4;">' + explanation + '</p></div>';
        }

        if (useSizeBtn) {
          useSizeBtn.style.display = 'block';
          useSizeBtn.textContent = 'USE SIZE ' + recommended;
          useSizeBtn.setAttribute('data-rec-size', recommended);
        }
      });
    });

    if (useSizeBtn) {
      useSizeBtn.addEventListener('click', function() {
        var recSize = this.getAttribute('data-rec-size') || 'M';
        var sizesContainer = document.querySelector('.pdp-sizes-row');
        if (sizesContainer) {
          var targetBtn = Array.from(sizesContainer.querySelectorAll('.pdp-size-btn')).find(function(b) {
            return b.getAttribute('data-size') === recSize || b.textContent.trim() === recSize;
          });
          if (targetBtn) targetBtn.click();
        }
        closeFitModal();
      });
    }
  }

  /* ── Add to Bag ───────────────────────────────────────────────────────── */
  function initAddToBag() {
    var addBtns = document.querySelectorAll('.btn-pdp-add-to-bag');
    addBtns.forEach(function(btn) {
      btn.addEventListener('click', function() {
        if (btn.disabled || btn.classList.contains('adding')) return;
        btn.classList.add('adding');
        btn.textContent = 'ADDING…';

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

          btn.textContent = '✓ ADDED TO BAG';
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

  /* ── Accordions ────────────────────────────────────────────────────────── */
  function initAccordions() {
    document.querySelectorAll('.pdp-accordion-header').forEach(function(hdr) {
      hdr.addEventListener('click', function() {
        var body = this.nextElementSibling;
        var icon = this.querySelector('.accordion-icon');
        if (body) {
          var isOpen = body.style.display === 'block';
          body.style.display = isOpen ? 'none' : 'block';
          if (icon) icon.textContent = isOpen ? '+' : '−';
        }
      });
    });
  }

  /* ── Mobile Sticky Bar ───────────────────────────────────────────────── */
  function initMobileStickyBar() {
    var stickyBar = document.getElementById('mobileStickyBar');
    var mainCTA = document.getElementById('btnMainPdpAdd');
    if (!stickyBar || !mainCTA) return;

    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (!entry.isIntersecting && window.innerWidth <= 768) {
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
    if (label) label.textContent = 'Size ' + selectedSize;
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
