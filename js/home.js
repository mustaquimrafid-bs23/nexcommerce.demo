/**
 * nexCommerce &mdash; Homepage Engine (js/home.js)
 * Manages  entrance animations, intent prompt suggestions, featured collection rendering,
 * category tile navigation, and add-to-bag integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroAnimations();
  initIntentSuggestions();
  renderFeaturedCollection();
  initCategoryTiles();
  initFinalCTA();
  initScrollReveal();
});


/**
 * 1.  Entrance Animations (500ms content / 700ms image)
 */
function initHeroAnimations() {
  const content = document.querySelector('.hero-content');
  const visual = document.querySelector('.hero-product-visual');

  if (content) {
    content.style.opacity = '0';
    content.style.transform = 'translateY(16px)';
    content.style.transition = 'opacity 500ms ease, transform 500ms ease';

    requestAnimationFrame(() => {
      setTimeout(() => {
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 50);
    });
  }

  if (visual) {
    visual.style.opacity = '0';
    visual.style.transform = 'scale(0.97)';
    visual.style.transition = 'opacity 700ms ease, transform 700ms ease';

    requestAnimationFrame(() => {
      setTimeout(() => {
        visual.style.opacity = '1';
        visual.style.transform = 'scale(1)';
      }, 150);
    });
  }
}

/**
 * 2. Clickable Intent Suggestions
 */
function initIntentSuggestions() {
  const chips = document.querySelectorAll('.intent-suggestion-chip');
  const input = document.getElementById('homeDiscoveryInput');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-query') || chip.textContent.trim();
      if (input) {
        input.value = text;
        input.focus();
      }
      // Navigate  discovery or open search overlay
      window.location.href = `discovery.html?q=${encodeURIComponent(text)}`;
    });
  });

  const searchForm = document.getElementById('homeDiscoveryForm');
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input ? input.value.trim() : '';
      if (val) {
        window.location.href = `discovery.html?q=${encodeURIComponent(val)}`;
      }
    });
  }
}

/**
 * 3. Render Featured Collection Grid with Reasoning & Add  Bag (H6)
 */
function renderFeaturedCollection() {
  const grid = document.getElementById('featuredCollectionGrid');
  if (!grid) return;

  const featuredItems = [
    {
      id: 'p1',
      name: 'Architectural Cashmere Sweater',
      category: 'APPAREL',
      price: 18400,
      image: 'hero_sweater.png',
      reason: 'Warm enough after sunset without feeling heavy.'
    },
    {
      id: 'p6',
      name: 'Minimalist Leather Runner',
      category: 'FOOTWEAR',
      price: 19800,
      image: 'prod_runner.png',
      reason: 'Cushioned Vibram sole for all-day urban walkability.'
    },
    {
      id: 'p3',
      name: 'Fine-Knit Cashmere Crew',
      category: 'APPAREL',
      price: 16200,
      image: 'plp_crewneck.png',
      reason: 'Ultra-soft 2-ply cashmere for easy indoor/outdoor layering.'
    },
    {
      id: 'p4',
      name: ' Acoustics Headphone GT',
      category: 'ACOUSTICS',
      price: 32000,
      image: 'prod_headphones.png',
      reason: 'Active noise cancellation for focused working or travel.'
    }
  ];

  grid.innerHTML = featuredItems.map(item => `
    <div class="product-card" data-id="${item.id}">
      <div class="product-card-image-box">
        <span class="product-card-ai-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg> AI MATCH</span>
        <button class="product-card-wishlist" aria-label="Wishlist">♡</button>
        <img src="${item.image}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${item.category}</div>
        <h3 class="product-card-title">${item.name}</h3>
        <div class="product-card-price">BDT ${item.price.toLocaleString()}</div>
        <div class="product-card-reason">
          <span class="product-card-reason-title" style="color: var(--accent-cyan); font-weight: 600;">Why it fits:</span>
          <span class="product-card-reason-body" style="color: rgba(255,255,255,0.7);">${item.reason}</span>
        </div>
        <button class="add-to-bag-btn" data-id="${item.id}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          ADD TO BAG
        </button>
      </div>
    </div>
  `).join('');

  grid.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.add-to-bag-btn') || e.target.closest('.product-card-wishlist')) return;
      const id = card.getAttribute('data-id');
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });
  });

  grid.querySelectorAll('.product-card-wishlist').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
      btn.textContent = btn.classList.contains('active') ? '♥' : '♡';
    });
  });

  grid.querySelectorAll('.add-to-bag-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const item = featuredItems.find(p => p.id === id);
      if (item && window.nexCart) {
        window.nexCart.addItem({
          id: item.id,
          name: item.name,
          size: 'M',
          price: item.price,
          qty: 1,
          image: item.image,
          category: item.category
        });
        btn.innerHTML = '&#10003; ADDED TO BAG';
        btn.style.background = '#ffffff';
        btn.style.color = '#000000';
        btn.style.borderColor = '#ffffff';
        setTimeout(() => {
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 8px;"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> ADD TO BAG';
          btn.style.background = '';
          btn.style.color = '';
          btn.style.borderColor = '';
        }, 1500);
      }
    });
  });
}


/**
 * 4. Category Visual Tile Triggers
 */
function initCategoryTiles() {
  const tiles = document.querySelectorAll('.category-tile');
  tiles.forEach(tile => {
    tile.addEventListener('click', () => {
      const cat = tile.getAttribute('data-cat') || 'all';
      window.location.href = `category.html?cat=${encodeURIComponent(cat)}`;
    });
  });
}

/**
 * 5. Final CTA Button Handler
 */
function initFinalCTA() {
  const ctaBtn = document.getElementById('finalDescribeBtn');
  if (ctaBtn) {
    ctaBtn.addEventListener('click', () => {
      if (window.openAiSearch) {
        window.openAiSearch();
      } else {
        window.location.href = 'discovery.html';
      }
    });
  }
}

/**
 * 6. Scroll Reveal Observer (H13)
 */
function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.reveal-on-scroll').forEach(el => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}
