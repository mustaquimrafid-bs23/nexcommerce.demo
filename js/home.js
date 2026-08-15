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
  initRecentlyViewed();
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
      id: 'p4',
      name: 'ACOUSTICS HEADPHONE GT',
      price: 'BDT 32,000',
      numericPrice: 32000,
      context: 'Active noise cancellation · Studio sound',
      image: 'hero_headphone_landscape.jpg',
      thumb: 'thumb_headphones.jpg',
      alt: 'Acoustics Headphone GT on Model',
      chips: [
        { icon: 'activity', text: 'Deep Bass' },
        { icon: 'battery-charging', text: '40H Battery' },
        { icon: 'sparkles', text: 'Premium Comfort' }
      ]
    },
    {
      id: 'p1',
      name: 'ARCHITECTURAL CASHMERE SWEATER',
      price: 'BDT 18,400',
      numericPrice: 18400,
      context: 'Minimal layering · Evening',
      image: 'hero_sweater_landscape.jpg',
      thumb: 'thumb_sweater.jpg',
      alt: 'Architectural Cashmere Sweater on Model',
      chips: [
        { icon: 'feather', text: '100% Cashmere' },
        { icon: 'shield-check', text: 'Thermal Lock' },
        { icon: 'sparkles', text: 'Italian Yarn' }
      ]
    },
    {
      id: 'p7',
      name: 'CHRONO AUTOMATIC TIMEPIECE',
      price: 'BDT 48,000',
      numericPrice: 48000,
      context: 'Sapphire crystal · Swiss movement',
      image: 'hero_watch_landscape.jpg',
      thumb: 'thumb_watch.jpg',
      alt: 'Chrono Automatic Timepiece on Model',
      chips: [
        { icon: 'shield', text: 'Sapphire Glass' },
        { icon: 'clock', text: 'Swiss Calibre' },
        { icon: 'sparkles', text: '42mm Case' }
      ]
    },
    {
      id: 'p2',
      name: 'STRUCTURED LEATHER TOTE',
      price: 'BDT 24,500',
      numericPrice: 24500,
      context: 'Italian calfskin · Laptop sleeve',
      image: 'hero_tote_landscape.jpg',
      thumb: 'thumb_tote.jpg',
      alt: 'Structured Leather Tote on Model',
      chips: [
        { icon: 'briefcase', text: '15" Laptop' },
        { icon: 'lock', text: 'Magnetic Clasp' },
        { icon: 'sparkles', text: 'Handcrafted' }
      ]
    }
  ];

  const dots = document.querySelectorAll('.hero-dot');
  const layerA = document.getElementById('heroLayerA');
  const layerB = document.getElementById('heroLayerB');
  const hotspotCard = document.getElementById('heroHotspotCard');
  const thumbImg = document.getElementById('heroDockThumbImg');
  const chipsContainer = document.getElementById('heroFeatureChips');
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
    if (s.thumb) {
      const preloadThumb = new Image();
      preloadThumb.src = s.thumb;
    }
  });

  function resetProgress() {
    dots.forEach((dot) => {
      const fill = dot.querySelector('.hero-dot-fill');
      if (fill) {
        fill.style.transition = 'none';
        fill.style.transform = 'scaleX(0)';
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
      fill.style.transition = `transform ${slideDuration}ms linear`;
      fill.style.transform = 'scaleX(1)';
    }
  }

  function renderChips(chips) {
    if (!chipsContainer || !chips) return;
    chipsContainer.innerHTML = chips.map(c => `
      <span class="hero-chip">
        <i data-lucide="${c.icon}" style="width: 10px; height: 10px;"></i>
        <span>${c.text}</span>
      </span>
    `).join('');
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  function setStory(index, animate = true) {
    currentIndex = (index + stories.length) % stories.length;
    isTransitioning = false;

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
        if (thumbImg && story.thumb) thumbImg.src = story.thumb;
        if (titleEl) titleEl.textContent = story.name;
        if (priceEl) priceEl.textContent = story.price;
        if (subEl) subEl.textContent = story.context;
        renderChips(story.chips);
        hotspotCard.setAttribute('data-id', story.id);

        if (hotspotCard) hotspotCard.classList.remove('hero-text-animating');
        setTimeout(() => { isTransitioning = false; }, 350);
      }, 180);

    } else {
      if (activeLayer) {
        activeLayer.src = story.image;
        activeLayer.alt = story.alt;
      }
      if (thumbImg && story.thumb) thumbImg.src = story.thumb;
      if (titleEl) titleEl.textContent = story.name;
      if (priceEl) priceEl.textContent = story.price;
      if (subEl) subEl.textContent = story.context;
      renderChips(story.chips);
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
  const WISHLIST_KEY = 'nex_curated_wishlist_ids';
  let savedWishlist = [];
  try {
    savedWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch (e) {
    savedWishlist = [];
  }

  // Wishlist clicks
  document.querySelectorAll('.deal-wishlist-btn').forEach(btn => {
    const card = btn.closest('.deal-product-card');
    const id = card ? card.getAttribute('data-id') : null;
    if (id && savedWishlist.includes(id)) {
      btn.classList.add('active');
    }
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      btn.classList.toggle('active');
      const isActive = btn.classList.contains('active');
      if (id) {
        try {
          let list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
          if (isActive && !list.includes(id)) {
            list.push(id);
          } else if (!isActive) {
            list = list.filter(item => item !== id);
          }
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
        } catch (e) {}
      }
      if (window.nexUpdateWishlistBadge) window.nexUpdateWishlistBadge();
    });
  });

  // Card click -> PDP
  document.querySelectorAll('.deal-product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.deal-add-btn') || e.target.closest('.deal-wishlist-btn') || e.target.closest('.deal-quick-add-overlay')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const id = card.getAttribute('data-id') || 'p1';
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Add to Bag clicks
  document.querySelectorAll('.deal-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
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
        btn.style.background = '#34D399';
        btn.style.color = '#001838';
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="plus" style="width: 13px; height: 13px;"></i> QUICK ADD';
          btn.style.background = '';
          btn.style.color = '';
          if (window.lucide) window.lucide.createIcons();
        }, 1600);
      }
    });
  });
}

/**
 * 2. Clickable Intent Suggestions, Form Search & Rotating Placeholder
 */
function initIntentSuggestions() {
  const chips = document.querySelectorAll('.intent-chip-pill, .intent-suggestion-chip');
  const input = document.getElementById('homeIntentInput') || document.getElementById('homeDiscoveryInput');
  const form = document.getElementById('homeIntentForm') || document.getElementById('homeDiscoveryForm');

  // Clear any stale value from previous session
  if (input) input.value = '';

  // Chip click handler
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

  // Form submission handler
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

  // Animated Placeholder Rotation
  if (input) {
    const prompts = [
      "Something for a winter evening in Dhaka",
      "Minimalist linen outfit for a weekend in Sylhet",
      "Sharp monochrome look for an executive dinner",
      "Breathable lightweight layers under BDT 15,000",
      "Comfortable silk blend shirt for warm weather"
    ];
    let promptIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let rotationTimeout = null;

    function typeEffect() {
      // Don't rotate if user has focused or typed something
      if (document.activeElement === input || input.value.length > 0) {
        rotationTimeout = setTimeout(typeEffect, 2000);
        return;
      }

      const currentPrompt = prompts[promptIndex];
      if (isDeleting) {
        input.setAttribute('placeholder', currentPrompt.substring(0, charIndex - 1));
        charIndex--;
      } else {
        input.setAttribute('placeholder', currentPrompt.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 30 : 60;

      if (!isDeleting && charIndex === currentPrompt.length) {
        speed = 3000; // Pause at end of phrase
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        promptIndex = (promptIndex + 1) % prompts.length;
        speed = 600; // Pause before typing next
      }

      rotationTimeout = setTimeout(typeEffect, speed);
    }

    // Start rotation
    rotationTimeout = setTimeout(typeEffect, 1500);
  }

  // Refresh Lucide icons for any dynamic icons
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

/**
 * 3. Curated "Pieces Matched to Your Taste" AI Recommendation Interactions
 */
function renderFeaturedCollection() {
  // Sync AI Style Profile context if user has a profile saved
  try {
    if (window.NexStyleProfile && typeof window.NexStyleProfile.getActiveProfile === 'function') {
      const activeProfile = window.NexStyleProfile.getActiveProfile();
      if (activeProfile && activeProfile.stylePreferences && activeProfile.stylePreferences.length > 0) {
        const topPref = activeProfile.stylePreferences.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' & ');
        const eyebrowEl = document.querySelector('.curated-section-eyebrow span');
        if (eyebrowEl) {
          eyebrowEl.textContent = `Matched with Style Profile: ${topPref}`;
        }
      }
    }
  } catch (err) {
    console.warn('Style profile sync error:', err);
  }

  // Wishlist persistence & toggle
  const WISHLIST_KEY = 'nex_curated_wishlist_ids';
  let savedWishlist = [];
  try {
    savedWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch (e) {
    savedWishlist = [];
  }

  document.querySelectorAll('.curated-product-card').forEach(card => {
    const id = card.getAttribute('data-id');
    const wishlistBtn = card.querySelector('.curated-wishlist-btn');

    if (wishlistBtn && savedWishlist.includes(id)) {
      wishlistBtn.classList.add('active');
    }

    if (wishlistBtn) {
      wishlistBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        wishlistBtn.classList.toggle('active');
        const isActive = wishlistBtn.classList.contains('active');

        try {
          let list = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
          if (isActive && !list.includes(id)) {
            list.push(id);
          } else if (!isActive) {
            list = list.filter(item => item !== id);
          }
          localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
        } catch (e) {}

        if (window.nexUpdateWishlistBadge) window.nexUpdateWishlistBadge();
      });
    }

    // Card click -> PDP
    card.addEventListener('click', (e) => {
      if (e.target.closest('.curated-quick-add-btn') || e.target.closest('.curated-add-btn') || e.target.closest('.curated-img-action') || e.target.closest('.curated-wishlist-btn')) return;
      const targetId = id || 'p1';
      window.location.href = `product.html?id=${encodeURIComponent(targetId)}`;
    });
  });

  // Add to Bag clicks (Quick Add)
  document.querySelectorAll('.curated-quick-add-btn, .curated-add-btn').forEach(btn => {
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

        btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i> <span>Added</span>';
        btn.style.background = '#10B981';
        btn.style.color = '#FFFFFF';
        if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i> <span>Quick Add</span>';
          btn.style.background = '';
          btn.style.color = '';
          if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();
        }, 1600);
      }
    });
  });

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}


/**
 * 4. Micro-Merchandising Interactions & View History
 */
function initMicroMerchandising() {
  // Row click & keyboard navigation -> PDP
  document.querySelectorAll('.micro-item-row').forEach(row => {
    row.addEventListener('click', (e) => {
      if (e.target.closest('.micro-item-add-btn')) return;
      const id = row.getAttribute('data-id') || 'p1';
      window.location.href = `product.html?id=${encodeURIComponent(id)}`;
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.micro-item-add-btn')) return;
        e.preventDefault();
        const id = row.getAttribute('data-id') || 'p1';
        window.location.href = `product.html?id=${encodeURIComponent(id)}`;
      }
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

        btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px; color: #10B981;"></i>';
        btn.setAttribute('aria-label', `Added ${name} to Bag`);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<i data-lucide="plus" style="width: 14px; height: 14px;"></i>';
          btn.setAttribute('aria-label', `Add ${name} to Bag`);
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
 * 5. Pre-Footer Editorial Banner (The Intent Atelier) Handler
 */
function initEditorialBanner() {
  const form = document.getElementById('editorialIntentForm');
  const input = document.getElementById('editorialIntentInput');
  const chips = document.querySelectorAll('.editorial-prompt-chip');

  // Helper to trigger AI search or fallback to Discovery
  function triggerSearch(queryText) {
    if (window.NexSearchOverlay && typeof window.NexSearchOverlay.open === 'function') {
      window.NexSearchOverlay.open();
      const modalInput = document.querySelector('.search-ai-input');
      if (modalInput && queryText) {
        modalInput.value = queryText;
        modalInput.dispatchEvent(new Event('input', { bubbles: true }));
        const submitBtn = document.querySelector('.btn-search-submit');
        if (submitBtn) submitBtn.click();
      }
    } else if (typeof window.openAiSearch === 'function') {
      window.openAiSearch();
    } else {
      const qParam = queryText ? `?q=${encodeURIComponent(queryText)}` : '';
      window.location.href = `discovery.html${qParam}`;
    }
  }

  // Handle Intent Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = input ? input.value.trim() : '';
      triggerSearch(query);
    });
  }

  // Handle Quick Prompt Chips
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
      if (input) input.value = prompt;
      triggerSearch(prompt);
    });
  });
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

/**
 * Newsletter submit handler — replaces native alert() with a premium toast
 */
window._nexNewsletterSubmit = function(form) {
  // Use existing NotificationEngine if available
  if (window.showToast && typeof window.showToast === 'function') {
    window.showToast({
      type: 'success',
      title: 'Welcome to The Private Edit',
      message: 'Private collection previews and atelier journals will arrive soon.'
    });
    form.reset();
    return;
  }

  // Graceful fallback: inline confirmation message below the form
  const existingMsg = form.parentElement.querySelector('.newsletter-confirm-msg');
  if (existingMsg) existingMsg.remove();

  const confirmMsg = document.createElement('p');
  confirmMsg.className = 'newsletter-confirm-msg';
  confirmMsg.style.cssText = 'margin-top: 10px; font-size: 13px; color: #10B981; font-family: var(--font-sans); letter-spacing: 0.02em;';
  confirmMsg.textContent = "You're on the list. Welcome to The Private Edit.";
  form.parentElement.appendChild(confirmMsg);
  form.reset();

  setTimeout(() => {
    if (confirmMsg.parentElement) {
      confirmMsg.style.transition = 'opacity 0.4s ease';
      confirmMsg.style.opacity = '0';
      setTimeout(() => confirmMsg.remove(), 420);
    }
  }, 4000);
};

/**
 * 8. Recently Viewed Products Tray
 */
function initRecentlyViewed() {
  const section = document.getElementById('homeRecentlyViewedSection');
  const rail = document.getElementById('recentProductsRail');
  const clearBtn = document.getElementById('recentClearBtn');
  if (!section || !rail) return;

  const RECENTS_KEY = 'nex_recent_products';
  let recents = [];
  try {
    recents = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
  } catch (e) {
    recents = [];
  }

  // If no items in storage yet, seed with 3 high-affinity editorial pieces for immediate showcase
  if (!Array.isArray(recents) || recents.length === 0) {
    recents = [
      { id: 'p1', name: 'Cashmere Turtleneck Sweater', category: 'Apparel', price: 18500, formattedPrice: 'BDT 18,500', image: 'hero_sweater.png' },
      { id: 'p6', name: 'Minimalist Leather Runner', category: 'Footwear', price: 11900, formattedPrice: 'BDT 11,900', image: 'prod_runner.png' },
      { id: 'p4', name: 'Studio Acoustics Headphone GT', category: 'Acoustics', price: 32000, formattedPrice: 'BDT 32,000', image: 'thumb_headphones.jpg' }
    ];
  }

  rail.innerHTML = recents.map(item => `
    <a href="product.html?id=${encodeURIComponent(item.id)}" class="recent-card" data-id="${item.id}">
      <div class="recent-card-thumb">
        <img src="${item.image || 'hero_sweater.png'}" alt="${item.name}" loading="lazy" />
      </div>
      <div class="recent-card-info">
        <span class="recent-card-cat">${item.category || 'Product'}</span>
        <h4 class="recent-card-title">${item.name}</h4>
        <span class="recent-card-price">${item.formattedPrice || ('BDT ' + (item.price || 0).toLocaleString())}</span>
      </div>
    </a>
  `).join('');

  section.style.display = 'block';

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem(RECENTS_KEY);
      } catch (e) {}
      section.style.opacity = '0';
      section.style.transition = 'opacity 300ms ease';
      setTimeout(() => {
        section.style.display = 'none';
        section.style.opacity = '1';
      }, 300);
    });
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
}

