/* ─── nexCommerce Part 3: Category / PLP + Curated Look Switcher Engine ─────── */

(function () {
  'use strict';

  // PLP Full Catalog Database with Studio Photography Paths, Clean 3-Item Metadata & Swatches
  const PLP_CATALOG = [
    {
      id: 'p1',
      name: 'Cashmere Turtleneck Sweater',
      brand: 'Arc',
      category: 'apparel',
      price: 185,
      formattedPrice: '€ 185.00',
      image: '../assets/images/products/p1.png',
      isNew: true,
      colors: [
        { name: 'Obsidian', hex: '#0D131F', img: '../assets/images/products/p1.png' },
        { name: 'Charcoal', hex: '#374151', img: '../assets/images/products/plp_turtleneck.png' },
        { name: 'Oatmeal', hex: '#D6C7B2', img: '../assets/images/products/plp_crewneck.png' }
      ]
    },
    {
      id: 'p2',
      name: 'Structured Wool Blazer',
      brand: 'Arc',
      category: 'apparel',
      price: 264,
      formattedPrice: '€ 264.00',
      image: '../assets/images/products/p2.png',
      isNew: false,
      colors: [
        { name: 'Midnight', hex: '#0A0F1D', img: '../assets/images/products/p2.png' },
        { name: 'Navy', hex: '#1E293B', img: '../assets/images/products/plp_blazer.png' }
      ]
    },
    {
      id: 'p3',
      name: 'Tailored Charcoal Overcoat',
      brand: 'Arc',
      category: 'outerwear',
      price: 380,
      formattedPrice: '€ 380.00',
      image: '../assets/images/products/p3.png',
      isNew: true,
      colors: [
        { name: 'Charcoal', hex: '#262A30', img: '../assets/images/products/p3.png' },
        { name: 'Black', hex: '#0F1115', img: '../assets/images/products/plp_overcoat.png' }
      ]
    },
    {
      id: 'p4',
      name: 'Studio Acoustics Headphone GT',
      brand: 'Form',
      category: 'acoustics',
      price: 320,
      formattedPrice: '€ 320.00',
      image: '../assets/images/products/p4.png',
      isNew: true,
      colors: [
        { name: 'Titanium Silver', hex: '#CBD5E1', img: '../assets/images/products/p4.png' },
        { name: 'Space Black', hex: '#0F172A', img: '../assets/images/products/prod_headphones.png' }
      ]
    },
    {
      id: 'p5',
      name: 'Horizon Wireless Earbuds',
      brand: 'Form',
      category: 'acoustics',
      price: 165,
      formattedPrice: '€ 165.00',
      image: '../assets/images/products/p5.png',
      isNew: false,
      colors: [
        { name: 'Alabaster', hex: '#F8FAFC', img: '../assets/images/products/p5.png' },
        { name: 'Matte Black', hex: '#18181B', img: '../assets/images/products/search_earbuds.png' }
      ]
    },
    {
      id: 'p6',
      name: 'Minimalist Leather Runner',
      brand: 'Apex',
      category: 'footwear',
      price: 198,
      formattedPrice: '€ 198.00',
      image: '../assets/images/products/p6.png',
      isNew: false,
      colors: [
        { name: 'Pure White', hex: '#FFFFFF', img: '../assets/images/products/p6.png' },
        { name: 'Monochrome Black', hex: '#111827', img: '../assets/images/products/prod_runner.png' }
      ]
    },
    {
      id: 'p7',
      name: 'Architectural Canvas Tote',
      brand: 'Forma',
      category: 'accessories',
      price: 285,
      formattedPrice: '€ 285.00',
      image: '../assets/images/products/p7.png',
      isNew: false,
      colors: [
        { name: 'Tuscan Leather', hex: '#78350F', img: '../assets/images/products/p7.png' },
        { name: 'Noir Black', hex: '#09090B', img: '../assets/images/products/prod_tote.png' }
      ]
    },
    {
      id: 'p8',
      name: 'Chronograph Minimalist Watch',
      brand: 'Volta',
      category: 'accessories',
      price: 342,
      formattedPrice: '€ 342.00',
      image: '../assets/images/products/search_watch.png',
      isNew: true,
      colors: [
        { name: 'Sunburst Silver', hex: '#E2E8F0', img: '../assets/images/products/search_watch.png' },
        { name: 'Obsidian DLC', hex: '#0B0F19', img: '../assets/images/products/search_watch.png' }
      ]
    }
  ];

  // 3 Signature Curated Looks for the Look Switcher & Animation Track
  const CURATED_LOOKS = [
    {
      id: 'look-1',
      indexLabel: '01 OF 03',
      tabLabel: '01 TAILORING',
      seasonTag: 'SEASONAL EDIT · AW26',
      title: 'The Winter Tailoring Capsule',
      desc: 'Architectural double-faced wool blazers and structured cashmere layers designed for modern movement.',
      targetCategory: 'outerwear',
      pieceCount: '1 Matching Piece',
      heroImage: '../assets/images/lifestyle/hero_sweater_landscape.jpg',
      featuredProductId: 'p2',
      featuredProductTitle: 'STRUCTURED WOOL BLAZER',
      featuredProductPrice: '€ 264.00',
      featuredProductThumb: '../assets/images/lifestyle/thumb_sweater.jpg',
      featuredProductTag: 'FEATURED LOOK'
    },
    {
      id: 'look-2',
      indexLabel: '02 OF 03',
      tabLabel: '02 ACOUSTICS',
      seasonTag: 'ACOUSTIC ENGINEERING',
      title: 'The Studio Acoustics Edit',
      desc: 'Precision titanium drivers and active acoustic isolation wrapped in Italian lambskin.',
      targetCategory: 'acoustics',
      pieceCount: '2 Matching Pieces',
      heroImage: '../assets/images/lifestyle/hero_headphone_landscape.jpg',
      featuredProductId: 'p4',
      featuredProductTitle: 'STUDIO ACOUSTICS HEADPHONE GT',
      featuredProductPrice: '€ 320.00',
      featuredProductThumb: '../assets/images/lifestyle/thumb_headphones.jpg',
      featuredProductTag: 'STUDIO CRAFT'
    },
    {
      id: 'look-3',
      indexLabel: '03 OF 03',
      tabLabel: '03 FOOTWEAR',
      seasonTag: 'ARTISANAL FOOTWEAR',
      title: 'The Architectural Runner',
      desc: 'Italian calfskin runners engineered with ergonomic Vibram soles and minimalist lines.',
      targetCategory: 'footwear',
      pieceCount: '2 Matching Pieces',
      heroImage: '../assets/images/lifestyle/hero_runner_landscape.jpg',
      featuredProductId: 'p6',
      featuredProductTitle: 'MINIMALIST LEATHER RUNNER',
      featuredProductPrice: '€ 198.00',
      featuredProductThumb: '../assets/images/lifestyle/thumb_runner.jpg',
      featuredProductTag: 'HAND-LASTED'
    }
  ];

  let currentCategory = 'all';
  let currentSort = 'recommended';
  let activeLookIndex = 0;
  let lookTimerRaf = null;
  let lookStartTime = null;
  let lookElapsed = 0;
  const LOOK_DURATION = 6000;

  const lookPauseReasons = { hover: false, focus: false, manual: false };
  function isLookPausedNow() {
    return lookPauseReasons.hover || lookPauseReasons.focus || lookPauseReasons.manual;
  }
  function setLookPauseReason(reason, value) {
    const wasPaused = isLookPausedNow();
    lookPauseReasons[reason] = value;
    if (wasPaused && !isLookPausedNow()) {
      lookStartTime = performance.now() - lookElapsed;
    }
  }

  function syncTabRovingState(tabs, activeIndex) {
    tabs.forEach((tab, i) => {
      tab.setAttribute('tabindex', i === activeIndex ? '0' : '-1');
    });
  }

  function initTablistKeyboardNav(tablist, onActivate) {
    if (!tablist) return;
    tablist.addEventListener('keydown', (e) => {
      const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
      const currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;

      let newIndex = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        newIndex = 0;
      } else if (e.key === 'End') {
        newIndex = tabs.length - 1;
      } else {
        return;
      }

      e.preventDefault();
      const newTab = tabs[newIndex];
      newTab.focus();
      onActivate(newTab, newIndex);
    });
  }

  function initPLPEngine() {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      currentCategory = catParam.toLowerCase();
    }

    initLookSwitcher();
    initFilterPills();
    updateCategoryHeader(currentCategory);
    initSortSelect();
    renderPLPGrid();
    initCardActions();
    init3DSpringTilt();
  }

  // ── 1. Look Switcher & 120fps Animation Track Engine ────────────────────────
  function initLookSwitcher() {
    const spotlightSection = document.getElementById('plpSpotlightSection');
    if (!spotlightSection) return;

    const tabs = document.querySelectorAll('.spotlight-tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        const lookIdx = parseInt(this.getAttribute('data-look'), 10);
        if (!isNaN(lookIdx) && lookIdx !== activeLookIndex) {
          setCuratedLook(lookIdx, true);
        }
      });
    });

    initTablistKeyboardNav(document.getElementById('spotlightTabs'), (newTab) => {
      const lookIdx = parseInt(newTab.getAttribute('data-look'), 10);
      if (!isNaN(lookIdx)) setCuratedLook(lookIdx, true);
    });

    spotlightSection.addEventListener('mouseenter', () => setLookPauseReason('hover', true));
    spotlightSection.addEventListener('mouseleave', () => setLookPauseReason('hover', false));
    spotlightSection.addEventListener('touchstart', () => setLookPauseReason('hover', true), { passive: true });
    spotlightSection.addEventListener('touchend', () => setLookPauseReason('hover', false), { passive: true });
    spotlightSection.addEventListener('focusin', () => setLookPauseReason('focus', true));
    spotlightSection.addEventListener('focusout', () => setLookPauseReason('focus', false));

    const pauseToggleBtn = document.getElementById('spotlightPauseToggleBtn');
    if (pauseToggleBtn) {
      pauseToggleBtn.addEventListener('click', () => {
        const nowPaused = !lookPauseReasons.manual;
        setLookPauseReason('manual', nowPaused);
        pauseToggleBtn.setAttribute('aria-pressed', String(nowPaused));
        pauseToggleBtn.setAttribute('aria-label', nowPaused ? 'Resume automatic capsule rotation' : 'Pause automatic capsule rotation');
        const icon = document.getElementById('spotlightPauseIcon');
        if (icon) {
          icon.setAttribute('data-lucide', nowPaused ? 'play' : 'pause');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    const syncFilterBtn = document.getElementById('spotlightSyncFilterBtn');
    if (syncFilterBtn) {
      syncFilterBtn.addEventListener('click', () => {
        const targetCat = syncFilterBtn.getAttribute('data-target-category') || 'all';
        applyCategoryFilter(targetCat);
        const grid = document.getElementById('plpProductGrid');
        if (grid) {
          const topOffset = grid.getBoundingClientRect().top + window.pageYOffset - 90;
          window.scrollTo({ top: topOffset, behavior: 'smooth' });
        }
      });
    }

    setCuratedLook(0, false);
  }

  function setCuratedLook(index, userInitiated) {
    if (index < 0 || index >= CURATED_LOOKS.length) return;
    activeLookIndex = index;
    const look = CURATED_LOOKS[index];

    const tabs = Array.from(document.querySelectorAll('.spotlight-tab-btn'));
    tabs.forEach((tab, i) => {
      if (i === index) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });
    syncTabRovingState(tabs, index);

    const panel = document.getElementById('spotlightBodyPanel');
    if (panel && tabs[index]) panel.setAttribute('aria-labelledby', tabs[index].id);

    const eyebrowEl = document.getElementById('spotlightLookEyebrow');
    if (eyebrowEl) eyebrowEl.textContent = `CURATED CAPSULE · ${look.indexLabel}`;

    const seasonEl = document.getElementById('spotlightSeasonBadge');
    const titleEl = document.getElementById('spotlightCapsuleTitle');
    const descEl = document.getElementById('spotlightCapsuleDesc');
    const syncBtn = document.getElementById('spotlightSyncFilterBtn');
    const pieceCountEl = document.getElementById('spotlightPieceCount');

    if (seasonEl) seasonEl.textContent = look.seasonTag;
    if (titleEl) titleEl.textContent = look.title;
    if (descEl) descEl.textContent = look.desc;
    if (syncBtn) syncBtn.setAttribute('data-target-category', look.targetCategory);
    if (pieceCountEl) pieceCountEl.textContent = look.pieceCount;

    const featuredImg = document.getElementById('spotlightFeaturedImg');
    if (featuredImg) {
      featuredImg.style.opacity = '0.4';
      featuredImg.style.transform = 'scale(1.04)';
      setTimeout(() => {
        featuredImg.src = look.heroImage;
        featuredImg.alt = look.title;
        featuredImg.style.opacity = '1';
        featuredImg.style.transform = 'scale(1)';
      }, 120);
    }

    const pill = document.getElementById('spotlightShoppablePill');
    const pillThumb = document.getElementById('spotlightPillThumb');
    const pillTag = document.getElementById('spotlightPillTag');
    const pillTitle = document.getElementById('spotlightPillTitle');
    const pillPrice = document.getElementById('spotlightPillPrice');
    const quickAddBtn = document.getElementById('spotlightQuickAddBtn');

    if (pill) pill.setAttribute('data-id', look.featuredProductId);
    if (pillThumb) pillThumb.src = look.featuredProductThumb;
    if (pillTag) pillTag.textContent = look.featuredProductTag;
    if (pillTitle) pillTitle.textContent = look.featuredProductTitle;
    if (pillPrice) pillPrice.textContent = look.featuredProductPrice;
    if (quickAddBtn) quickAddBtn.setAttribute('data-id', look.featuredProductId);

    if (window.lucide) window.lucide.createIcons();
    startLookTimer();
  }

  function updateProgressBar(progress) {
    const bar = document.getElementById('spotlightProgressBar');
    if (bar) {
      bar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress)).toFixed(4)})`;
    }
  }

  function tickLookTimer(now) {
    if (isLookPausedNow()) {
      lookTimerRaf = requestAnimationFrame(tickLookTimer);
      return;
    }
    if (!lookStartTime) lookStartTime = now - lookElapsed;
    lookElapsed = now - lookStartTime;
    const progress = lookElapsed / LOOK_DURATION;

    updateProgressBar(progress);

    if (progress >= 1) {
      updateProgressBar(1);
      lookStartTime = null;
      lookElapsed = 0;
      const nextIndex = (activeLookIndex + 1) % CURATED_LOOKS.length;
      setCuratedLook(nextIndex, false);
      return;
    }

    lookTimerRaf = requestAnimationFrame(tickLookTimer);
  }

  function startLookTimer() {
    if (lookTimerRaf) cancelAnimationFrame(lookTimerRaf);
    lookStartTime = null;
    lookElapsed = 0;
    updateProgressBar(0);
    lookTimerRaf = requestAnimationFrame(tickLookTimer);
  }

  // ── 2. Category Header & Pill Filter Sync ─────────────────────────────────
  function updateCategoryHeader(cat) {
    const titleEl = document.getElementById('plpMainTitle');
    const subtitleEl = document.getElementById('plpMainSubtitle');
    const breadcrumbEl = document.getElementById('plpBreadcrumbCurrent');
    const eyebrowEl = document.getElementById('plpHeroEyebrow');
    
    let titleText = 'All Products';
    let subtitleText = 'Pieces designed around natural comfort, architectural tailoring, and enduring quality.';
    let eyebrowText = 'COLLECTIONS · AW26';
    
    if (cat === 'apparel') {
      titleText = 'Apparel & Knitwear';
      subtitleText = 'Precision cashmere, structured merino wool, and relaxed silhouettes crafted for modern living.';
      eyebrowText = 'APPAREL · AW26';
    } else if (cat === 'outerwear') {
      titleText = 'Outerwear & Tailoring';
      subtitleText = 'Double-faced wool overcoats, tailored blazers, and architectural cold-weather layers.';
      eyebrowText = 'OUTERWEAR · AW26';
    } else if (cat === 'acoustics') {
      titleText = 'Acoustic Engineering';
      subtitleText = 'Studio-grade spatial drivers and active acoustic isolation wrapped in lambskin and titanium.';
      eyebrowText = 'ACOUSTIC ENGINEERING';
    } else if (cat === 'accessories') {
      titleText = 'Fine Accessories & Horology';
      subtitleText = 'Minimalist chronographs, full-grain leather goods, and refined essentials.';
      eyebrowText = 'FINE ACCESSORIES';
    } else if (cat === 'footwear') {
      titleText = 'Footwear & Runners';
      subtitleText = 'Italian calfskin runners and architectural footwear built with ergonomic Vibram cushioning.';
      eyebrowText = 'FOOTWEAR · ARTISANAL';
    } else if (cat === 'new') {
      titleText = 'New Arrivals';
      subtitleText = 'The latest seasonal drops, limited releases, and freshly curated luxury essentials.';
      eyebrowText = 'NEW ARRIVALS · AW26';
    }

    if (eyebrowEl) eyebrowEl.textContent = eyebrowText;
    if (titleEl) titleEl.textContent = titleText;
    if (subtitleEl) subtitleEl.textContent = subtitleText;
    if (breadcrumbEl) breadcrumbEl.textContent = titleText;
  }

  function applyCategoryFilter(newCategory) {
    if (!newCategory) return;
    currentCategory = newCategory.toLowerCase();
    updateCategoryHeader(currentCategory);

    const pills = Array.from(document.querySelectorAll('.plp-filter-pill'));
    let activeIdx = 0;
    pills.forEach((p, i) => {
      if (p.getAttribute('data-category') === currentCategory) {
        p.classList.add('active');
        p.setAttribute('aria-selected', 'true');
        activeIdx = i;
      } else {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      }
    });
    syncTabRovingState(pills, activeIdx);

    if (window.history && window.history.replaceState) {
      const newUrl = `${window.location.pathname}?cat=${currentCategory}`;
      window.history.replaceState({ cat: currentCategory }, '', newUrl);
    }

    triggerGridReload();
  }

  function initFilterPills() {
    const pills = document.querySelectorAll('.plp-filter-pill');
    
    pills.forEach(p => {
      if (p.getAttribute('data-category') === currentCategory) {
        p.classList.add('active');
        p.setAttribute('aria-selected', 'true');
      } else {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      }
    });

    pills.forEach(pill => {
      pill.addEventListener('click', function () {
        const newCat = this.getAttribute('data-category');
        if (newCat === currentCategory) return;
        applyCategoryFilter(newCat);
      });
    });

    initTablistKeyboardNav(document.querySelector('.plp-filter-bar'), (newPill) => {
      const newCat = newPill.getAttribute('data-category');
      if (newCat !== currentCategory) applyCategoryFilter(newCat);
    });
  }

  function initSortSelect() {
    const sortSelect = document.getElementById('plpSortSelect');
    if (!sortSelect) return;
    sortSelect.addEventListener('change', function () {
      currentSort = this.value;
      renderPLPGrid();
    });
  }

  function triggerGridReload() {
    const grid = document.getElementById('plpProductGrid');
    if (!grid) return;

    grid.innerHTML = `
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    `;

    setTimeout(() => {
      renderPLPGrid();
    }, 160);
  }

  // ── 3. Render Clean 3-Item Luxury Cards with Swatches ──────────────────────
  function renderPLPGrid() {
    const grid = document.getElementById('plpProductGrid');
    const countEl = document.getElementById('plpProductCount');
    if (!grid) return;

    let items = PLP_CATALOG.filter(item => {
      if (currentCategory === 'all') return true;
      if (currentCategory === 'new') return item.isNew === true;
      return item.category === currentCategory;
    });

    if (currentSort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    }

    if (countEl) {
      countEl.textContent = `${items.length} ${items.length === 1 ? 'PIECE' : 'PIECES'} CURATED`;
    }

    if (items.length === 0) {
      renderEmptyState(grid);
      return;
    }

    let html = '';
    items.forEach((item, index) => {
      html += renderPLPCard(item, index);
    });

    grid.innerHTML = html;
    if (window.lucide) {
      window.lucide.createIcons();
    }

    initSwatches();
    init3DSpringTilt();
  }

  function isItemInWishlist(id) {
    try {
      const list = JSON.parse(localStorage.getItem('nex_curated_wishlist_ids') || localStorage.getItem('nex_wishlist_items') || '[]');
      return list.includes(id);
    } catch (e) {
      return false;
    }
  }

  function renderPLPCard(item, index) {
    const isWishlisted = isItemInWishlist(item.id);
    const parallaxDepth = (index % 2 === 0) ? '1' : '2';

    // Tactile Circular Color Swatches HTML
    let swatchesHtml = '';
    if (item.colors && item.colors.length > 1) {
      swatchesHtml = `
        <div class="plp-swatches-row" role="radiogroup" aria-label="Available colorways for ${escapeHtml(item.name)}">
          ${item.colors.map((c, ci) => `
            <button type="button" class="plp-swatch-dot ${ci === 0 ? 'active' : ''}" 
              data-img="${c.img}" 
              data-color-name="${escapeHtml(c.name)}" 
              data-card-id="${item.id}"
              style="background-color: ${c.hex};" 
              title="${escapeHtml(c.name)}" 
              aria-label="${escapeHtml(c.name)}"></button>
          `).join('')}
        </div>
      `;
    }

    return `
      <div class="plp-card luxury-product-card" data-id="${item.id}" data-parallax-depth="${parallaxDepth}">
        <div class="plp-card-specular" aria-hidden="true"></div>
        <div class="plp-card-media">
          ${item.isNew ? '<span class="plp-luxury-badge">NEW</span>' : ''}
          <button class="plp-card-wishlist ${isWishlisted ? 'active' : ''}" aria-label="Save to wishlist" data-id="${item.id}" title="${isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}">
            <i data-lucide="heart" style="width: 14px; height: 14px;"></i>
          </button>
          <a href="product.html?id=${item.id}" class="plp-card-img-anchor" tabindex="-1">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="plp-card-img" id="cardImg_${item.id}" loading="lazy">
          </a>
          <button class="plp-quick-add-btn btn-plp-add-to-bag" data-id="${item.id}" aria-label="Quick Add ${escapeHtml(item.name)} to Bag">
            <i data-lucide="shopping-bag" style="width: 13px; height: 13px; margin-right: 6px;"></i>
            <span>QUICK ADD</span>
          </button>
        </div>

        <!-- STRICT 3-ITEM LUXURY FOOTER -->
        <div class="plp-card-info">
          <!-- Item 1: Brand & House -->
          <div class="plp-card-brand-row">
            <span class="plp-card-category-label">${escapeHtml(item.brand)} &middot; ${item.category.toUpperCase()}</span>
          </div>

          <!-- Item 2: Title -->
          <a href="product.html?id=${item.id}" class="plp-card-title-link">
            <h3 class="plp-card-name">${escapeHtml(item.name)}</h3>
          </a>

          <!-- Item 3: Price + Tactile Swatches Row -->
          <div class="plp-card-bottom-row">
            <div class="plp-card-price-tag tabular-nums">${item.formattedPrice}</div>
            ${swatchesHtml}
          </div>
        </div>
      </div>
    `;
  }

  // ── 4. Interactive Swatch Switcher ─────────────────────────────────────────
  function initSwatches() {
    const swatches = document.querySelectorAll('.plp-swatch-dot');
    swatches.forEach(swatch => {
      swatch.addEventListener('mouseenter', function () {
        activateSwatch(this);
      });
      swatch.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        activateSwatch(this);
      });
    });
  }

  function activateSwatch(swatchEl) {
    const cardId = swatchEl.getAttribute('data-card-id');
    const newImg = swatchEl.getAttribute('data-img');
    const row = swatchEl.closest('.plp-swatches-row');
    if (row) {
      row.querySelectorAll('.plp-swatch-dot').forEach(s => s.classList.remove('active'));
    }
    swatchEl.classList.add('active');

    const imgEl = document.getElementById(`cardImg_${cardId}`);
    if (imgEl && newImg && imgEl.src !== newImg) {
      imgEl.style.opacity = '0.7';
      imgEl.src = newImg;
      setTimeout(() => {
        imgEl.style.opacity = '1';
      }, 100);
    }
  }

  // ── 5. 3D Spring Tilt & Specular Reflection ───────────────────────────────
  function init3DSpringTilt() {
    const cards = document.querySelectorAll('.luxury-product-card');
    cards.forEach(card => {
      const specular = card.querySelector('.plp-card-specular');

      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -5.5; // Max 5.5deg
        const rotateY = ((x - centerX) / centerX) * 5.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`;

        if (specular) {
          specular.style.opacity = '1';
          specular.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        if (specular) specular.style.opacity = '0';
      });
    });
  }

  function renderEmptyState(container) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px;">
        <h3 style="font-family: 'Manrope', sans-serif; font-size: 24px; color: #FFFFFF; margin-bottom: 8px;">NO PIECES FOUND</h3>
        <p style="font-size: 14px; color: #94A3B8; margin-bottom: 20px;">We couldn't find pieces matching this filter. Explore our full catalog.</p>
        <button class="btn-primary-commerce" id="btnResetFilters" style="min-width: 200px; margin: 0 auto; height: 44px; font-size: 11px; font-weight: 700; letter-spacing: 0.1em;">VIEW ALL PIECES</button>
      </div>
    `;

    const resetBtn = document.getElementById('btnResetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        applyCategoryFilter('all');
      });
    }
  }

  // ── 6. Global Card Action Listeners ────────────────────────────────────────
  function initCardActions() {
    document.addEventListener('click', function (e) {
      // Wishlist Toggle
      const wishlistBtn = e.target.closest('.plp-card-wishlist');
      if (wishlistBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = wishlistBtn.getAttribute('data-id');
        let list = [];
        try {
          list = JSON.parse(localStorage.getItem('nex_curated_wishlist_ids') || localStorage.getItem('nex_wishlist_items') || '[]');
        } catch (err) {
          list = [];
        }

        const isNowSaved = !list.includes(id);
        if (isNowSaved) {
          list.push(id);
          wishlistBtn.classList.add('active');
          wishlistBtn.setAttribute('title', 'Remove from Wishlist');
        } else {
          list = list.filter(item => item !== id);
          wishlistBtn.classList.remove('active');
          wishlistBtn.setAttribute('title', 'Save to Wishlist');
        }

        try {
          localStorage.setItem('nex_curated_wishlist_ids', JSON.stringify(list));
          localStorage.setItem('nex_wishlist_items', JSON.stringify(list));
        } catch (err) {}

        const headerCount = document.getElementById('headerWishlistCount');
        if (headerCount) {
          headerCount.textContent = list.length;
          headerCount.style.display = list.length > 0 ? 'flex' : 'none';
        }
        return;
      }

      // Spotlight Look Capsule Quick Add
      const spotlightAddBtn = e.target.closest('.btn-spotlight-quick-add');
      if (spotlightAddBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = spotlightAddBtn.getAttribute('data-id');
        const item = PLP_CATALOG.find(p => p.id === id);
        if (item && window.nexCart) {
          window.nexCart.addItem({
            id: item.id,
            name: item.name,
            price: item.price,
            image: item.image,
            category: item.category
          });
        }
        const origText = spotlightAddBtn.innerHTML;
        spotlightAddBtn.innerHTML = `<span>✓ ADDED</span>`;
        spotlightAddBtn.style.background = '#34D399';
        spotlightAddBtn.style.color = '#000000';
        setTimeout(() => {
          spotlightAddBtn.innerHTML = origText;
          spotlightAddBtn.style.background = '';
          spotlightAddBtn.style.color = '';
          if (window.lucide) window.lucide.createIcons();
        }, 1600);
        return;
      }

      // Product Card Add to Bag CTA
      const addBtn = e.target.closest('.btn-plp-add-to-bag');
      if (addBtn) {
        e.preventDefault();
        e.stopPropagation();
        if (addBtn.disabled || addBtn.classList.contains('adding')) return;

        addBtn.classList.add('adding');
        addBtn.innerHTML = `<span>ADDING…</span>`;
        
        const card = addBtn.closest('.plp-card');
        const id = card ? card.getAttribute('data-id') : null;
        const item = PLP_CATALOG.find(p => p.id === id);

        setTimeout(() => {
          if (item && window.nexCart) {
            window.nexCart.addItem({
              id: item.id,
              name: item.name,
              variant: 'M',
              price: item.price,
              quantity: 1,
              image: item.image,
              category: item.category
            });
          }

          addBtn.innerHTML = `<span>&#10003; ADDED TO BAG</span>`;
          addBtn.style.background = '#ffffff';
          addBtn.style.color = '#000000';

          setTimeout(() => {
            addBtn.classList.remove('adding');
            addBtn.innerHTML = `<i data-lucide="shopping-bag" style="width: 13px; height: 13px; margin-right: 6px;"></i><span>QUICK ADD</span>`;
            addBtn.style.background = '';
            addBtn.style.color = '';
            if (window.lucide) window.lucide.createIcons();
          }, 1800);
        }, 280);
      }
    });
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Preloader Logic
  function initPreloader() {
    const preloader = document.getElementById('pagePreloader');
    const bar = document.getElementById('preloaderProgressBar');
    const pct = document.getElementById('preloaderPercent');
    if (!preloader) return;

    let p = 0;
    const iv = setInterval(() => {
      p += 25; if (p > 100) p = 100;
      if (bar) bar.style.width = p + '%';
      if (pct) pct.textContent = p + '%';
      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => {
          preloader.style.opacity = '0';
          preloader.style.pointerEvents = 'none';
          setTimeout(() => preloader.remove(), 280);
        }, 120);
      }
    }, 20);
  }

  document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initPLPEngine();
  });

})();
