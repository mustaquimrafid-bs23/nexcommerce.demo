/* ─── nexCommerce Part 3: Category / PLP + AI Recommendations Engine ─────── */

(function () {
  'use strict';

  // PLP Full Catalog Database
  const PLP_CATALOG = [
    {
      id: 'p1',
      name: 'Architectural Cashmere Sweater',
      category: 'apparel',
      price: 18400,
      formattedPrice: 'BDT 18,400',
      image: 'hero_sweater.png',
      isNew: true,
      reasoning: 'Light enough for an 18°C evening, warm enough after sunset.',
      whyExpanded: 'Crafted from 2-ply Mongolian cashmere with dropped shoulder seams for relaxed Dhaka evening layering.'
    },
    {
      id: 'p2',
      name: 'Structured Wool Blazer',
      category: 'apparel',
      price: 24500,
      formattedPrice: 'BDT 24,500',
      image: 'plp_blazer.png',
      reasoning: 'Unlined merino weave allows natural airflow for evening dinners.',
      whyExpanded: 'Unlined tailored construction keeps a sharp silhouette without causing thermal discomfort indoors.'
    },
    {
      id: 'p3',
      name: 'Fine-Knit Cashmere Crew',
      category: 'apparel',
      price: 16200,
      formattedPrice: 'BDT 16,200',
      image: 'plp_crewneck.png',
      reasoning: 'Ultra-soft 2-ply cashmere for easy indoor/outdoor layering.',
      whyExpanded: 'Minimal crew neck design that layers effortlessly under overshirts or over light tees.'
    },
    {
      id: 'p4',
      name: ' Acoustics Headphone GT',
      category: 'acoustics',
      price: 32000,
      formattedPrice: 'BDT 32,000',
      image: 'prod_headphones.png',
      isNew: true,
      reasoning: 'Active noise cancellation calibrated for focused work or travel.',
      whyExpanded: 'Memory foam ear cushions wrapped in lambskin for extended listening comfort.'
    },
    {
      id: 'p5',
      name: 'Chronograph Minimalist Watch',
      category: 'accessories',
      price: 28500,
      formattedPrice: 'BDT 28,500',
      image: 'p3.png',
      reasoning: 'Brushed titanium casing with a scratch-resistant sapphire crystal.',
      whyExpanded: 'Water-resistant Swiss movement with interchangeable leather and mesh straps.'
    },
    {
      id: 'p6',
      name: 'Minimalist Leather Runner',
      category: 'footwear',
      price: 19800,
      formattedPrice: 'BDT 19,800',
      image: 'prod_runner.png',
      reasoning: 'Cushioned Vibram sole for all-day urban walkability.',
      whyExpanded: 'Full-grain Italian leather upper with breathable calfskin lining.'
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
    const breadcrumbEl = document.getElementById('plpBreadcrumbCurrent');
    
    let titleText = 'ALL PRODUCTS';
    if (cat === 'apparel') titleText = 'APPAREL';
    if (cat === 'acoustics') titleText = 'ACOUSTICS';
    if (cat === 'accessories') titleText = 'ACCESSORIES';
    if (cat === 'footwear') titleText = 'FOOTWEAR';
    if (cat === 'new') titleText = 'NEW IN';

    if (titleEl) titleEl.textContent = titleText;
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
  }

  function renderPLPCard(item) {
    const reasoningBlock = isAiEnabled ? `
      <div class="plp-card-reasoning">
        <div class="plp-reasoning-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>Why this fits</div>
        <div class="plp-reasoning-body">${escapeHtml(item.reasoning)}</div>
        <button class="link-text-nav plp-see-why-btn" data-id="${item.id}" style="font-size: 11px; margin-top: 4px; align-self: flex-start;">See why &rarr;</button>
        <div class="plp-why-drawer" style="display: none; font-size: 11px; color: var(--text-secondary); padding-top: 6px; border-top: 1px solid var(--border-subtle); margin-top: 4px;">
          ${escapeHtml(item.whyExpanded)}
        </div>
      </div>
    ` : '';

    return `
      <div class="plp-card" data-id="${item.id}">
        <a href="product.html?id=${item.id}" class="plp-card-img-wrap">
          ${item.isNew ? '<div class="plp-badge-new">NEW</div>' : ''}
          <img src="${item.image}" alt="${escapeHtml(item.name)}">
        </a>
        <div style="display: flex; flex-direction: column; gap: 4px;">
          <a href="product.html?id=${item.id}" class="plp-card-title">${escapeHtml(item.name)}</a>
          <div class="plp-card-price">${item.formattedPrice}</div>
        </div>

        ${reasoningBlock}

        <button class="add-to-bag-btn btn-plp-add-to-bag" style="width: 100%; height: 44px; margin-top: auto;">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          ADD TO BAG
        </button>
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
