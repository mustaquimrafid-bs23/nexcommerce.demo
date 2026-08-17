/* ─── nexCommerce Part 3: Category / PLP + AI Recommendations Engine ─────── */

(function () {
  'use strict';

  // PLP Full Catalog Database
  const PLP_CATALOG = [
    {
      id: 'p1',
      name: 'Cashmere Turtleneck Sweater',
      category: 'apparel',
      price: 18500,
      formattedPrice: 'BDT 18,500',
      image: 'assets/images/products/plp_turtleneck.png',
      isNew: true,
      reasoning: 'Spun from 2-ply Mongolian cashmere with relaxed raglan shoulders for effortless evening drape.',
      whyExpanded: 'Ultra-soft rib-knit collar and cuffs provide refined warmth without bulk.'
    },
    {
      id: 'p2',
      name: 'Structured Wool Blazer',
      category: 'apparel',
      price: 26400,
      formattedPrice: 'BDT 26,400',
      image: 'assets/images/products/plp_blazer.png',
      reasoning: 'Tailored from Italian virgin wool with unlined interior and custom horn buttons.',
      whyExpanded: 'Architectural shoulders and soft interior canvassing allow easy thermal regulation indoors.'
    },
    {
      id: 'p3',
      name: 'Tailored Charcoal Overcoat',
      category: 'outerwear',
      price: 38000,
      formattedPrice: 'BDT 38,000',
      image: 'assets/images/products/plp_overcoat.png',
      isNew: true,
      reasoning: 'Double-faced wool-cashmere blend with sharp notch lapels and structured drape.',
      whyExpanded: 'Mid-calf silhouette engineered for cold morning commutes and formal evening layers.'
    },
    {
      id: 'p4',
      name: 'Sonic Aurora Headphones GT',
      category: 'acoustics',
      price: 32000,
      formattedPrice: 'BDT 32,000',
      image: 'assets/images/products/prod_headphones.png',
      isNew: true,
      reasoning: 'Precision 40mm titanium drivers with spatial tuning and active ambient isolation.',
      whyExpanded: 'Memory foam ear cushions wrapped in full-grain lambskin leather for all-day listening.'
    },
    {
      id: 'p5',
      name: 'Horizon Wireless Earbuds',
      category: 'acoustics',
      price: 16500,
      formattedPrice: 'BDT 16,500',
      image: 'assets/images/products/search_earbuds.png',
      reasoning: 'Custom balanced armature drivers with low-latency spatial audio and Qi charging.',
      whyExpanded: 'Compact matte finish charging case with 32-hour battery reserve and IPX5 resistance.'
    },
    {
      id: 'p6',
      name: 'Minimalist Leather Runner',
      category: 'footwear',
      price: 19800,
      formattedPrice: 'BDT 19,800',
      image: 'assets/images/products/prod_runner.png',
      reasoning: 'Handcrafted from Italian calfskin leather with shock-absorbing rubber cupsole.',
      whyExpanded: 'Ergonomic footbed with padded heel counter and gold-foil serial branding.'
    },
    {
      id: 'p7',
      name: 'Quilted Leather Structured Tote',
      category: 'accessories',
      price: 28500,
      formattedPrice: 'BDT 28,500',
      image: 'assets/images/products/prod_tote.png',
      reasoning: 'Chevron-quilted full-grain nappa leather with polished antique gold hardware.',
      whyExpanded: 'Spacious dual-compartment interior lined with microsuede and reinforced shoulder strap.'
    },
    {
      id: 'p8',
      name: 'Chronograph Minimalist Timepiece',
      category: 'accessories',
      price: 34200,
      formattedPrice: 'BDT 34,200',
      image: 'assets/images/products/search_watch.png',
      isNew: true,
      reasoning: 'Brushed matte titanium case housing a Swiss automatic movement with sapphire crystal.',
      whyExpanded: '5 ATM water resistance with interchangeable Italian leather strap.'
    }
  ];

  let currentCategory = 'all';
  let currentSort = 'recommended';
  let isAiEnabled = true;

  function initPLPEngine() {
    // Parse URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    if (catParam) {
      currentCategory = catParam.toLowerCase();
    }

    initFilterPills();
    updateCategoryHeader(currentCategory);
    initSortSelect();
    renderPLPGrid();
    initCardActions();
  }

  function updateCategoryHeader(cat) {
    const titleEl = document.getElementById('plpMainTitle');
    const subtitleEl = document.getElementById('plpMainSubtitle');
    const breadcrumbEl = document.getElementById('plpBreadcrumbCurrent');
    
    let titleText = 'All Products';
    let subtitleText = 'Pieces designed around natural comfort, architectural tailoring, and enduring quality.';
    
    if (cat === 'apparel') {
      titleText = 'Apparel & Knitwear';
      subtitleText = 'Precision cashmere, structured merino wool, and relaxed silhouettes crafted for modern living.';
    } else if (cat === 'outerwear') {
      titleText = 'Outerwear & Tailoring';
      subtitleText = 'Double-faced wool overcoats, tailored blazers, and architectural cold-weather layers.';
    } else if (cat === 'acoustics') {
      titleText = 'Acoustic Engineering';
      subtitleText = 'Studio-grade spatial drivers and active acoustic isolation wrapped in lambskin and titanium.';
    } else if (cat === 'accessories') {
      titleText = 'Fine Accessories & Horology';
      subtitleText = 'Minimalist chronographs, full-grain leather goods, and refined essentials.';
    } else if (cat === 'footwear') {
      titleText = 'Footwear & Runners';
      subtitleText = 'Italian calfskin runners and architectural footwear built with ergonomic Vibram cushioning.';
    } else if (cat === 'new') {
      titleText = 'New Arrivals';
      subtitleText = 'The latest seasonal drops, limited releases, and freshly curated luxury essentials.';
    }

    if (titleEl) titleEl.textContent = titleText;
    if (subtitleEl) subtitleEl.textContent = subtitleText;
    if (breadcrumbEl) breadcrumbEl.textContent = titleText;
  }

  // 1. Filter Pills Handler
  function initFilterPills() {
    const pills = document.querySelectorAll('.plp-filter-pill');
    
    // Set initial active state based on currentCategory
    pills.forEach(p => {
      if (p.getAttribute('data-category') === currentCategory) {
        p.classList.add('active');
      } else {
        p.classList.remove('active');
      }
    });

    pills.forEach(pill => {
      pill.addEventListener('click', function () {
        const newCategory = this.getAttribute('data-category');
        if (newCategory === currentCategory) return;
        
        currentCategory = newCategory;
        updateCategoryHeader(currentCategory);
        
        pills.forEach(p => p.classList.remove('active'));
        this.classList.add('active');
        currentCategory = (this.getAttribute('data-category') || 'all').toLowerCase();
        triggerGridReload();
      });
    });
  }

  // 2. Sort Select Handler
  function initSortSelect() {
    const sortSelect = document.getElementById('plpSortSelect');
    if (!sortSelect) return;
    sortSelect.addEventListener('change', function () {
      currentSort = this.value;
      renderPLPGrid();
    });
  }

  // 3. Grid Reload with Skeleton Loading State
  function triggerGridReload() {
    const grid = document.getElementById('plpProductGrid');
    if (!grid) return;

    // Render 4 Skeleton Loading Cards
    grid.innerHTML = `
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
      <div class="skeleton-card"></div>
    `;

    setTimeout(() => {
      renderPLPGrid();
    }, 200);
  }

  // 4. Render Grid Logic
  function renderPLPGrid() {
    const grid = document.getElementById('plpProductGrid');
    const countEl = document.getElementById('plpProductCount');
    if (!grid) return;

    // Filter items
    let items = PLP_CATALOG.filter(item => {
      if (currentCategory === 'all') return true;
      if (currentCategory === 'new') return item.isNew === true;
      if (currentCategory === 'outerwear') return item.category === 'outerwear' || item.id === 'p2';
      return item.category === currentCategory;
    });

    // Sort items
    if (currentSort === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (currentSort === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    }

    // Update count label
    if (countEl) {
      countEl.textContent = `${items.length} ${items.length === 1 ? 'PRODUCT' : 'PRODUCTS'}`;
    }

    if (items.length === 0) {
      renderEmptyState(grid);
      return;
    }

    let html = '';
    items.forEach(item => {
      html += renderPLPCard(item);
    });

    grid.innerHTML = html;
    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  function renderPLPCard(item) {
    return `
      <div class="plp-card luxury-product-card" data-id="${item.id}">
        <div class="plp-card-media">
          ${item.isNew ? '<span class="plp-luxury-badge">NEW</span>' : ''}
          <button class="plp-card-wishlist" aria-label="Save to wishlist" data-id="${item.id}" title="Save to Wishlist">
            <i data-lucide="heart" style="width: 14px; height: 14px;"></i>
          </button>
          <a href="product.html?id=${item.id}" class="plp-card-img-anchor" tabindex="-1">
            <img src="${item.image}" alt="${escapeHtml(item.name)}" class="plp-card-img" loading="lazy">
          </a>
          <button class="plp-quick-add-btn btn-plp-add-to-bag" data-id="${item.id}">
            <i data-lucide="shopping-bag" style="width: 13px; height: 13px; margin-right: 6px;"></i>
            <span>QUICK ADD</span>
          </button>
        </div>

        <div class="plp-card-info">
          <span class="plp-card-category-label">${item.category.toUpperCase()}</span>
          <a href="product.html?id=${item.id}" class="plp-card-title-link">
            <h3 class="plp-card-name">${escapeHtml(item.name)}</h3>
          </a>
          <p class="plp-card-description">${escapeHtml(item.reasoning)}</p>
          <div class="plp-card-price-tag">${item.formattedPrice}</div>
        </div>
      </div>
    `;
  }

  function renderEmptyState(container) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; padding: 60px 20px; text-align: center; background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-md);">
        <h3 class="type-her&#10003; style="font-size: 28px; margin-bottom: 8px;">NOTHING FOUND</h3>
        <p class="type-body-sm" style="color: var(--text-secondary); margin-bottom: 20px;">We couldn't find products matching those filters. Try selecting another category.</p>
        <button class="btn-primary-commerce" id="btnResetFilters" style="min-width: 220px;">VIEW ALL PRODUCTS</button>
      </div>
    `;

    const resetBtn = document.getElementById('btnResetFilters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const allPill = document.querySelector('.plp-filter-pill[data-category="all"]');
        if (allPill) allPill.click();
      });
    }
  }

  // 5. Global Card Action Listeners
  function initCardActions() {
    document.addEventListener('click', function (e) {
      // Toggle "See why &rarr;"
      const seeWhyBtn = e.target.closest('.plp-see-why-btn');
      if (seeWhyBtn) {
        e.preventDefault();
        const reasoningCard = seeWhyBtn.closest('.plp-card-reasoning');
        const drawer = reasoningCard ? reasoningCard.querySelector('.plp-why-drawer') : null;
        if (drawer) {
          const isOpen = drawer.style.display === 'block';
          drawer.style.display = isOpen ? 'none' : 'block';
          seeWhyBtn.textContent = isOpen ? 'See why &rarr;' : 'Hide details ↑';
        }
      }

      // Add  Bag CTA State Machine
      const addBtn = e.target.closest('.btn-plp-add-to-bag');
      if (addBtn) {
        if (addBtn.disabled || addBtn.classList.contains('adding')) return;

        addBtn.classList.add('adding');
        addBtn.textContent = 'ADDING…';
        
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
          } else {
            const countEls = document.querySelectorAll('.bag-count, .bag-badge');
            countEls.forEach(el => {
              const current = parseInt(el.textContent.replace(/\D/g, '') || '0', 10);
              el.textContent = `(${current + 1})`;
            });
          }

          addBtn.innerHTML = '&#10003; ADDED TO BAG';
          addBtn.style.background = '#ffffff';
          addBtn.style.color = '#000000';
          addBtn.style.borderColor = '#ffffff';

          setTimeout(() => {
            addBtn.classList.remove('adding');
            addBtn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> ADD TO BAG';
            addBtn.style.background = '';
            addBtn.style.color = '';
            addBtn.style.borderColor = '';
          }, 2000);
        }, 400);
      }
    });
  }

  function escapeHtml(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPLPEngine);
  } else {
    initPLPEngine();
  }
})();
