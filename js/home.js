/**
 * nexCommerce &mdash; Homepage Engine (js/home.js)
 * Manages  entrance animations, intent prompt suggestions, featured collection rendering,
 * category tile navigation, and add-to-bag integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
  initHeroAnimations();
  initHeroCarousel();
  initDealsCountdown();
  initDealsCards();
  initIntentSuggestions();
  renderFeaturedCollection();
  initMicroMerchandising();
  initEditorialBanner();
  initCategoryTiles();
  initFinalCTA();
  initScrollReveal();
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
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
 * 1b. Interactive Hero Lifestyle Carousel & Hotspot Quick-Add
 */
function initHeroCarousel() {
  const stories = [
    {
      id: 'p1',
      name: 'ARCHITECTURAL CASHMERE SWEATER',
      price: 'BDT 18,400',
      numericPrice: 18400,
      context: 'Minimal layering · Evening',
      image: 'sweater_lifestyle.png',
      alt: 'Architectural Cashmere Sweater on Model',
      category: 'Apparel'
    },
    {
      id: 'p6',
      name: 'MINIMALIST LEATHER RUNNER',
      price: 'BDT 19,800',
      numericPrice: 19800,
      context: 'Cushioned Vibram sole · Urban motion',
      image: 'runner_lifestyle.png',
      alt: 'Minimalist Leather Runner on Model',
      category: 'Footwear'
    },
    {
      id: 'p4',
      name: 'ACOUSTICS HEADPHONE GT',
      price: 'BDT 32,000',
      numericPrice: 32000,
      context: 'Active noise cancellation · Studio sound',
      image: 'headphone_lifestyle.png',
      alt: 'Acoustics Headphone GT on Model',
      category: 'Acoustics'
    },
    {
      id: 'p2',
      name: 'STRUCTURED LEATHER TOTE',
      price: 'BDT 24,500',
      numericPrice: 24500,
      context: 'Italian calfskin · Laptop sleeve',
      image: 'tote_lifestyle.png',
      alt: 'Structured Leather Tote on Model',
      category: 'Accessories'
    }
  ];

  const dots = document.querySelectorAll('.hero-dot');
  const layerA = document.getElementById('heroLayerA');
  const layerB = document.getElementById('heroLayerB');
  const hotspotCard = document.getElementById('heroHotspotCard');
  const textCol = document.getElementById('heroOverlayTextCol');
  const titleEl = document.getElementById('heroHotspotTitle');
  const priceEl = document.getElementById('heroHotspotPrice');
  const subEl = document.getElementById('heroHotspotSub');
  const addBtn = document.getElementById('heroHotspotAddBtn');
  const visualFrame = document.getElementById('heroVisualFrame');
  const modelBox = document.getElementById('heroModelBox');
  const heroSection = document.querySelector('.hero-section');

  if (!hotspotCard || !dots.length) return;

  let currentIndex = 0;
  let timer = null;
  let isTransitioning = false;
  let activeLayer = layerA || document.querySelector('.hero-layer-active');
  let incomingLayer = layerB || document.querySelector('.hero-layer-incoming');
  const slideDuration = 5000;

  // Preload all story images to guarantee 0-latency instant cross-fades
  stories.forEach(s => {
    const preload = new Image();
    preload.src = s.image;
  });

  function resetProgress() {
    dots.forEach((dot) => {
      const fill = dot.querySelector('.hero-dot-fill');
      if (fill) {
        fill.style.transition = 'none';
        fill.style.width = '0%';
      }
    });
  }

  function startActiveProgress() {
    resetProgress();
    const activeDot = dots[currentIndex];
    if (!activeDot) return;
    const fill = activeDot.querySelector('.hero-dot-fill');
    if (fill) {
      void fill.offsetWidth; // Force reflow
      fill.style.transition = `width ${slideDuration}ms linear`;
      fill.style.width = '100%';
    }
  }

  function setStory(index, animate = true) {
    if (isTransitioning && animate) return;
    currentIndex = (index + stories.length) % stories.length;

    dots.forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
      d.setAttribute('aria-selected', i === currentIndex ? 'true' : 'false');
    });

    startActiveProgress();

    const story = stories[currentIndex];

    if (animate && activeLayer && incomingLayer) {
      isTransitioning = true;

      // 1. Prepare incoming layer under the hood
      incomingLayer.src = story.image;
      incomingLayer.alt = story.alt;
      incomingLayer.className = 'hero-layer-img hero-layer-incoming';

      // 2. Start staggered text transition
      if (hotspotCard) hotspotCard.classList.add('hero-text-animating');

      // 3. Double RAF for buttery GPU layer transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (incomingLayer && activeLayer) {
            incomingLayer.className = 'hero-layer-img hero-layer-active';
            activeLayer.className = 'hero-layer-img hero-layer-outgoing';

            // Swap layer references
            const temp = activeLayer;
            activeLayer = incomingLayer;
            incomingLayer = temp;
          }
        });
      });

      // 4. Update text content mid-flight and reveal
      setTimeout(() => {
        if (titleEl) titleEl.textContent = story.name;
        if (priceEl) priceEl.textContent = story.price;
        if (subEl) subEl.textContent = story.context;
        hotspotCard.setAttribute('data-id', story.id);

        if (hotspotCard) hotspotCard.classList.remove('hero-text-animating');
        setTimeout(() => { isTransitioning = false; }, 350);
      }, 180);

    } else {
      if (activeLayer) {
        activeLayer.src = story.image;
        activeLayer.alt = story.alt;
      }
      if (titleEl) titleEl.textContent = story.name;
      if (priceEl) priceEl.textContent = story.price;
      if (subEl) subEl.textContent = story.context;
      hotspotCard.setAttribute('data-id', story.id);
    }
  }

  function startTimer() {
    stopTimer();
    startActiveProgress();
    timer = setInterval(() => {
      setStory(currentIndex + 1, true);
    }, slideDuration);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
  }

  // Dots navigation
  dots.forEach((dot, index) => {
    dot.setAttribute('role', 'button');
    dot.setAttribute('aria-label', `View Story ${index + 1}`);
    dot.addEventListener('click', (e) => {
      e.stopPropagation();
      setStory(index, true);
      startTimer();
    });
  });

  // -------------------------------------------------------------
  // Kinetic Touch Swipe & Mouse Drag Physics (Desktop + Mobile)
  // -------------------------------------------------------------
  let isPointerDown = false;
  let startX = 0;
  let startY = 0;
  let currentDeltaX = 0;
  let isHorizontalDrag = false;
  let rafId = null;

  if (heroSection) {
    heroSection.querySelectorAll('img').forEach((im) => {
      im.setAttribute('draggable', 'false');
      im.ondragstart = (e) => e.preventDefault();
    });

    function onDragStart(clientX, clientY, target) {
      if (target && (target.closest('#heroHotspotAddBtn') || target.closest('.btn-hero-primary') || target.closest('.btn-hero-secondary') || target.closest('.hero-dot'))) {
        return;
      }
      isPointerDown = true;
      startX = clientX;
      startY = clientY;
      currentDeltaX = 0;
      isHorizontalDrag = false;
      stopTimer();
      heroSection.classList.add('is-dragging');
    }

    function onDragMove(clientX, clientY) {
      if (!isPointerDown) return;
      const dx = clientX - startX;
      const dy = clientY - startY;

      if (!isHorizontalDrag) {
        if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
          isHorizontalDrag = true;
        }
      }

      if (isHorizontalDrag) {
        currentDeltaX = dx;
        if (modelBox) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = requestAnimationFrame(() => {
            modelBox.style.transition = 'none';
            modelBox.style.transform = `translateX(${dx * 0.28}px) rotateY(${dx * 0.025}deg) scale(0.99)`;
          });
        }
      }
    }

    function onDragEnd() {
      if (!isPointerDown) return;
      isPointerDown = false;
      heroSection.classList.remove('is-dragging');

      if (modelBox) {
        modelBox.style.transition = 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)';
        modelBox.style.transform = '';
      }

      const threshold = 35;
      if (isHorizontalDrag && Math.abs(currentDeltaX) > threshold) {
        if (currentDeltaX < 0) {
          setStory(currentIndex + 1, true);
        } else {
          setStory(currentIndex - 1, true);
        }
      }

      currentDeltaX = 0;
      isHorizontalDrag = false;
      startTimer();
    }

    // Pointer Events
    heroSection.addEventListener('pointerdown', (e) => {
      onDragStart(e.clientX, e.clientY, e.target);
    });

    window.addEventListener('pointermove', (e) => {
      onDragMove(e.clientX, e.clientY);
    });

    window.addEventListener('pointerup', () => {
      onDragEnd();
    });

    window.addEventListener('pointercancel', () => {
      onDragEnd();
    });

    // Touch Support
    heroSection.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onDragStart(e.touches[0].clientX, e.touches[0].clientY, e.target);
      }
    }, { passive: true });

    heroSection.addEventListener('touchmove', (e) => {
      if (e.touches.length === 1) {
        onDragMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    heroSection.addEventListener('touchend', () => {
      onDragEnd();
    });

    // Keyboard Arrow Navigation
    heroSection.setAttribute('tabindex', '0');
    heroSection.setAttribute('aria-label', 'Featured Stories Carousel. Use left and right arrow keys to browse.');
    heroSection.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setStory(currentIndex - 1, true);
        startTimer();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setStory(currentIndex + 1, true);
        startTimer();
      }
    });

    // Pause on hovering the interactive glass card specifically
    if (hotspotCard) {
      hotspotCard.addEventListener('mouseenter', () => stopTimer());
      hotspotCard.addEventListener('mouseleave', () => startTimer());
    }
  }

  // -------------------------------------------------------------
  // Quick-Add Action with Tactile SVG Checkmark Feedback
  // -------------------------------------------------------------
  if (addBtn && hotspotCard) {
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentStory = stories[currentIndex];
      if (!currentStory) return;

      if (window.nexCart && typeof window.nexCart.addItem === 'function') {
        window.nexCart.addItem({
          id: currentStory.id,
          name: currentStory.name,
          price: currentStory.numericPrice,
          image: currentStory.image,
          category: currentStory.category,
          quantity: 1
        });
      }

      // Visual feedback with Lucide checkmark icon
      addBtn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i>';
      addBtn.style.background = '#10B981';
      addBtn.style.borderColor = '#10B981';
      addBtn.style.transform = 'scale(1.15)';
      if (window.lucide) window.lucide.createIcons();

      if (typeof window.showToast === 'function') {
        window.showToast(`Added ${currentStory.name} to your bag`);
      }

      // Animate bag icon in header
      const bagBadge = document.getElementById('headerCartCount');
      if (bagBadge) {
        bagBadge.style.transform = 'scale(1.35)';
        setTimeout(() => { bagBadge.style.transform = 'scale(1)'; }, 250);
      }

      setTimeout(() => {
        addBtn.innerHTML = '<i data-lucide="plus" style="width: 14px; height: 14px;"></i>';
        addBtn.style.background = '';
        addBtn.style.borderColor = '';
        addBtn.style.transform = '';
        if (window.lucide) window.lucide.createIcons();
      }, 1400);
    });

    // Clicking anywhere on the card navigates to product details
    hotspotCard.addEventListener('click', (e) => {
      if (e.target.closest('#heroHotspotAddBtn')) return;
      const currentStory = stories[currentIndex];
      if (currentStory) {
        window.location.href = `product.html?id=${currentStory.id}`;
      }
    });
  }

  // Initialize first story & auto timer
  setStory(0, false);
  startTimer();
}

/**
 * 1c. Today's Deals Live Countdown Ticker
 */
function initDealsCountdown() {
  let secondsRemaining = (4 * 3600) + (32 * 60) + 15;
  const hoursEl = document.getElementById('dealHours');
  const minsEl = document.getElementById('dealMins');
  const secsEl = document.getElementById('dealSecs');

  function updateTimer() {
    if (secondsRemaining <= 0) {
      secondsRemaining = 24 * 3600; // Reset for demonstration
    }
    const h = Math.floor(secondsRemaining / 3600);
    const m = Math.floor((secondsRemaining % 3600) / 60);
    const s = secondsRemaining % 60;

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');

    secondsRemaining--;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

/**
 * 1d. Deals Cards Add-to-Bag & Wishlist Interactions
 */
function initDealsCards() {
  // Wishlist clicks
  document.querySelectorAll('.deal-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
    });
  });

  // Card click -> PDP
  document.querySelectorAll('.deal-product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.deal-add-btn') || e.target.closest('.deal-wishlist-btn')) return;
      const id = card.getAttribute('data-id') || 'p1';
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Add to Bag clicks
  document.querySelectorAll('.deal-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10) || 0;
      const img = btn.getAttribute('data-img');
      const cat = btn.getAttribute('data-cat') || 'Apparel';

      if (window.nexCart) {
        window.nexCart.addItem({
          id: id,
          name: name,
          size: 'M',
          price: price,
          qty: 1,
          image: img,
          category: cat
        });

        btn.innerHTML = '<i data-lucide="check" style="width: 13px; height: 13px;"></i> ADDED';
        btn.style.background = '#FFFFFF';
        btn.style.color = '#000000';
        btn.style.borderColor = '#FFFFFF';
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="shopping-bag" style="width: 13px; height: 13px;"></i> ADD TO BAG';
          btn.style.background = '';
          btn.style.color = '';
          btn.style.borderColor = '';
          if (window.lucide) window.lucide.createIcons();
        }, 1600);
      }
    });
  });
}

/**
 * 2. Clickable Intent Suggestions & Form Search
 */
function initIntentSuggestions() {
  const chips = document.querySelectorAll('.intent-chip-pill, .intent-suggestion-chip');
  const input = document.getElementById('homeIntentInput') || document.getElementById('homeDiscoveryInput');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const text = chip.getAttribute('data-query') || chip.textContent.trim();
      if (input) {
        input.value = text;
        input.focus();
      }
      window.location.href = `discovery.html?q=${encodeURIComponent(text)}`;
    });
  });

  const searchForms = [document.getElementById('homeIntentForm'), document.getElementById('homeDiscoveryForm')];
  searchForms.forEach(form => {
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const activeInput = form.querySelector('input');
        const val = activeInput ? activeInput.value.trim() : '';
        if (val) {
          window.location.href = `discovery.html?q=${encodeURIComponent(val)}`;
        }
      });
    }
  });
}

/**
 * 3. Curated "Pieces Worth Discovering" Interactions
 */
function renderFeaturedCollection() {
  // Wishlist buttons
  document.querySelectorAll('.curated-wishlist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      btn.classList.toggle('active');
    });
  });

  // Card click -> PDP
  document.querySelectorAll('.curated-product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.curated-add-btn') || e.target.closest('.curated-wishlist-btn')) return;
      const id = card.getAttribute('data-id') || 'p1';
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Add to Bag clicks
  document.querySelectorAll('.curated-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10) || 0;
      const img = btn.getAttribute('data-img');
      const cat = btn.getAttribute('data-cat') || 'Apparel';

      if (window.nexCart) {
        window.nexCart.addItem({
          id: id,
          name: name,
          size: 'M',
          price: price,
          qty: 1,
          image: img,
          category: cat
        });

        btn.innerHTML = '<i data-lucide="check" style="width: 13px; height: 13px;"></i> ADDED';
        btn.style.background = '#FFFFFF';
        btn.style.color = '#000000';
        btn.style.borderColor = '#FFFFFF';
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="shopping-bag" style="width: 13px; height: 13px;"></i> ADD TO BAG';
          btn.style.background = '';
          btn.style.color = '';
          btn.style.borderColor = '';
          if (window.lucide) window.lucide.createIcons();
        }, 1600);
      }
    });
  });
}


/**
 * 4. Micro-Merchandising Interactions & View History
 */
function initMicroMerchandising() {
  // Row click -> PDP
  document.querySelectorAll('.micro-item-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.micro-item-add-btn')) return;
      const id = row.getAttribute('data-id') || 'p1';
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Micro Add to Bag clicks
  document.querySelectorAll('.micro-item-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      const price = parseInt(btn.getAttribute('data-price'), 10) || 0;
      const img = btn.getAttribute('data-img');
      const cat = btn.getAttribute('data-cat') || 'Apparel';

      if (window.nexCart) {
        window.nexCart.addItem({
          id: id,
          name: name,
          size: 'M',
          price: price,
          qty: 1,
          image: img,
          category: cat
        });

        btn.innerHTML = '<i data-lucide="check" style="width: 13px; height: 13px; color: #10B981;"></i>';
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="plus" style="width: 13px; height: 13px;"></i>';
          if (window.lucide) window.lucide.createIcons();
        }, 1500);
      }
    });
  });

  // Clear history handler
  const clearBtn = document.getElementById('clearHistoryBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      localStorage.removeItem('nex_view_history');
      const list = document.getElementById('continueShoppingList');
      if (list) {
        list.innerHTML = '<div style="font-size: 11px; color: var(--text-muted); padding: 12px 0;">Browsing history cleared.</div>';
      }
    });
  }
}

/**
 * 5. Pre-Footer Editorial Banner Handler
 */
function initEditorialBanner() {
  const btn = document.getElementById('editorialDescribeBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      if (window.openAiSearch) {
        window.openAiSearch();
      } else {
        window.location.href = 'discovery.html';
      }
    });
  }
}

/**
 * 6. Category Visual Tile Triggers
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
  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    el.classList.add('is-visible');
  });

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '200px 0px',
    threshold: 0.05
  });

  document.querySelectorAll('.reveal-on-scroll').forEach(el => {
    observer.observe(el);
  });
}
