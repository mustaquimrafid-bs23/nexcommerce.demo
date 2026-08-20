/**
 * nexCommerce &mdash; Homepage Engine (js/home.js)
 * Manages luxury preloader dismissal, intent prompt suggestions, 
 * featured collection rendering, category tile navigation, and add-to-bag integration.
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
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
  initTrustStripInteractions();
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
});

/**
 * 1b. Full-Bleed 3D Interactive Model Hero & Floating Shoppable Hotspot Tags
 */
function initHeroCarousel() {
  const stories = [
    {
      id: 'p2',
      name: 'STRUCTURED LEATHER TOTE',
      lookNum: 'FEATURED PIECE',
      price: '€ 245.00',
      numericPrice: 245,
      category: 'Leather Goods',
      image: 'assets/images/lifestyle/Gemini_Generated_Image_c36exc36exc36exc.jpg',
      imageMobile: 'assets/images/lifestyle/Gemini_Generated_Image_tm4857tm4857tm48.jpg',
      thumb: 'assets/images/lifestyle/thumb_tote.jpg',
      alt: 'Model in tailored suit with structured cognac leather bag in brutalist architecture',
      hotspot: { top: '79%', left: '72%' }
    }
  ];

  const heroSection = document.getElementById('heroFullbleedSection') || document.querySelector('.hero-fullbleed-section');
  const bgCanvas = document.getElementById('heroImgStack');
  const layerA = document.getElementById('heroLayerA');
  const layerB = document.getElementById('heroLayerB');
  const centeredContent = document.getElementById('heroCenteredContent');
  const hotspotWrap = document.getElementById('heroHotspotWrap');
  const hotspotCard = document.getElementById('heroHotspotCard');
  const thumbImg = document.getElementById('heroDockThumbImg');
  const titleEl = document.getElementById('heroHotspotTitle');
  const priceEl = document.getElementById('heroHotspotPrice');
  const addBtn = document.getElementById('heroHotspotAddBtn');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const progressFill = document.getElementById('heroProgressFill');
  const dockPills = document.querySelectorAll('.hero-dock-pill');

  if (!heroSection || !hotspotCard) return;

  let currentIndex = 0;
  let timer = null;
  let isTransitioning = false;
  let activeLayer = layerA || document.querySelector('.hero-fullbleed-layer-active');
  let incomingLayer = layerB || document.querySelector('.hero-fullbleed-layer-incoming');
  const slideDuration = 5500;

  // Preload hero story images for instant zero-latency rendering
  stories.forEach(s => {
    const preload = new Image();
    preload.src = s.image;
    if (s.imageMobile) {
      const preloadMobile = new Image();
      preloadMobile.src = s.imageMobile;
    }
    if (s.thumb) {
      const preloadThumb = new Image();
      preloadThumb.src = s.thumb;
    }
  });

  function resetProgress() {
    if (progressFill) {
      progressFill.style.transition = 'none';
      progressFill.style.transform = 'scaleX(0)';
    }
  }

  function startActiveProgress() {
    resetProgress();
    if (progressFill && stories.length > 1) {
      void progressFill.offsetWidth; // Force reflow
      progressFill.style.transition = `transform ${slideDuration}ms linear`;
      progressFill.style.transform = 'scaleX(1)';
    }
  }

  function setStory(index, animate = true) {
    currentIndex = (index + stories.length) % stories.length;
    isTransitioning = false;

    // Update Look Switcher Pills if present
    if (dockPills && dockPills.length > 0) {
      dockPills.forEach((pill, idx) => {
        pill.classList.toggle('active', idx === currentIndex);
      });
    }

    startActiveProgress();

    const story = stories[currentIndex];

    // Ensure CSS positioning rules govern coordinates across all viewports
    if (hotspotWrap) {
      hotspotWrap.style.top = '';
      hotspotWrap.style.left = '';
      hotspotWrap.style.bottom = '';
      hotspotWrap.style.right = '';
    }

    if (animate && activeLayer && incomingLayer) {
      isTransitioning = true;

      // 1. Prepare incoming layer
      incomingLayer.src = story.image;
      incomingLayer.alt = story.alt;
      incomingLayer.className = 'hero-fullbleed-layer hero-fullbleed-layer-incoming';

      // 2. Double RAF for GPU crossfade
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (incomingLayer && activeLayer) {
            incomingLayer.className = 'hero-fullbleed-layer hero-fullbleed-layer-active';
            activeLayer.className = 'hero-fullbleed-layer hero-fullbleed-layer-outgoing';

            // Swap layer references
            const temp = activeLayer;
            activeLayer = incomingLayer;
            incomingLayer = temp;
          }
        });
      });

      // 3. Update floating hotspot info
      setTimeout(() => {
        if (thumbImg && story.thumb) {
          thumbImg.src = story.thumb;
          thumbImg.alt = story.name;
        }
        if (titleEl) titleEl.textContent = story.name;
        if (priceEl) priceEl.textContent = story.price;
        hotspotCard.setAttribute('data-id', story.id);
        hotspotCard.setAttribute('aria-label', `View Featured Piece: ${story.name}`);
        setTimeout(() => { isTransitioning = false; }, 350);
      }, 150);

    } else {
      if (activeLayer) {
        activeLayer.src = story.image;
        activeLayer.alt = story.alt;
      }
      if (thumbImg && story.thumb) {
        thumbImg.src = story.thumb;
        thumbImg.alt = story.name;
      }
      if (titleEl) titleEl.textContent = story.name;
      if (priceEl) priceEl.textContent = story.price;
      hotspotCard.setAttribute('data-id', story.id);
      hotspotCard.setAttribute('aria-label', `View Featured Piece: ${story.name}`);
    }
  }

  function startTimer() {
    stopTimer();
    if (stories.length <= 1) return;
    startActiveProgress();
    timer = setInterval(() => {
      setStory(currentIndex + 1, true);
    }, slideDuration);
  }

  function stopTimer() {
    if (timer) clearInterval(timer);
  }

  // Initial story setup
  setStory(0, false);

  // Look Switcher Pills Event Listeners (if present)
  dockPills.forEach((pill) => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const targetIdx = parseInt(pill.getAttribute('data-index'), 10);
      if (!isNaN(targetIdx) && targetIdx !== currentIndex) {
        setStory(targetIdx, true);
        startTimer();
      }
    });
  });

  // Prev / Next Arrow Navigation (if present)
  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setStory(currentIndex - 1, true);
      startTimer();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setStory(currentIndex + 1, true);
      startTimer();
    });
  }

  // Pause on hover
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => stopTimer());
    heroSection.addEventListener('mouseleave', () => startTimer());
  }

  // -------------------------------------------------------------
  // 🌟 Unified 120fps Differential Column & Layer Parallax Engine
  // Combines smooth scroll parallax and 3D spatial mouse depth
  // into a single zero-collision physics loop with smooth lerp
  // -------------------------------------------------------------
  let targetScrollY = window.scrollY || 0;
  let currentScrollY = targetScrollY;
  let targetRotX = 0;
  let targetRotY = 0;
  let curRotX = 0;
  let curRotY = 0;
  let isMouseInside = false;

  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Track window scroll with passive performance
  window.addEventListener('scroll', () => {
    targetScrollY = window.scrollY || 0;
  }, { passive: true });

  // Track 3D Spatial Mouse Interaction (Desktop Pointer only)
  if (heroSection && isDesktopPointer && !isReducedMotion) {
    heroSection.addEventListener('mousemove', (e) => {
      isMouseInside = true;
      const rect = heroSection.getBoundingClientRect();
      if (rect.height <= 0 || rect.width <= 0) return;
      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotX = -y * 8; // Max pitch tilt
      targetRotY = x * 10; // Max yaw tilt
    });

    heroSection.addEventListener('mouseleave', () => {
      isMouseInside = false;
      targetRotX = 0;
      targetRotY = 0;
    });
  }

  function updateHeroParallax() {
    if (isReducedMotion) {
      if (centeredContent) {
        centeredContent.style.opacity = Math.max(0, Math.min(1, 1 - targetScrollY / 420)).toFixed(3);
      }
      if (hotspotWrap) {
        hotspotWrap.style.opacity = Math.max(0, Math.min(1, 1 - targetScrollY / 340)).toFixed(3);
      }
      requestAnimationFrame(updateHeroParallax);
      return;
    }

    // Fluid Deceleration Lerp for Scroll (0.12 factor)
    currentScrollY += (targetScrollY - currentScrollY) * 0.12;

    // Fluid Spring Lerp for 3D Mouse Parallax (0.08 factor)
    if (isDesktopPointer) {
      curRotX += (targetRotX - curRotX) * 0.08;
      curRotY += (targetRotY - curRotY) * 0.08;
    }

    const heroHeight = heroSection ? heroSection.offsetHeight : 600;

    // Only compute transforms when the hero is in or near the active viewport
    if (currentScrollY < heroHeight * 1.3) {
      const scrollProgress = Math.max(0, currentScrollY);
      const isMobile = window.innerWidth <= 768;
      const isShortHeight = window.innerHeight <= 540;

      // 1. Full-Bleed Background Imagery Canvas (0.30x differential scroll + counter mouse tilt)
      if (bgCanvas) {
        const bgTranslateY = (scrollProgress * 0.30) - (curRotX * 1.5);
        const bgTranslateX = -curRotY * 1.8;
        bgCanvas.style.transform = `translate3d(${bgTranslateX.toFixed(2)}px, ${bgTranslateY.toFixed(2)}px, 0)`;
      }

      // 2. Editorial Typography Column (Preserves responsive anchoring + 0.12x differential lag + 3D depth)
      if (centeredContent) {
        const contentTranslateY = (scrollProgress * 0.12) + (curRotX * 1.2);
        const contentTranslateX = (curRotY * 1.6);
        const contentOpacity = Math.max(0, Math.min(1, 1 - (scrollProgress / 420)));
        if (isMobile && !isShortHeight) {
          centeredContent.style.transform = `translate3d(0px, ${contentTranslateY.toFixed(2)}px, 15px)`;
        } else {
          centeredContent.style.transform = `translate3d(${contentTranslateX.toFixed(2)}px, calc(-50% + ${contentTranslateY.toFixed(2)}px), 15px)`;
        }
        centeredContent.style.opacity = contentOpacity.toFixed(3);
      }

      // 3. Floating 3D Shoppable Hotspot Tag (0.22x differential scroll + 3D perspective pop)
      if (hotspotWrap) {
        const hotspotTranslateY = (scrollProgress * 0.22) + (curRotX * 1.5);
        const hotspotTranslateX = curRotY * 1.6;
        const hotspotOpacity = Math.max(0, Math.min(1, 1 - (scrollProgress / 340)));
        hotspotWrap.style.transform = `translate3d(${hotspotTranslateX.toFixed(2)}px, ${hotspotTranslateY.toFixed(2)}px, 15px)`;
        hotspotWrap.style.opacity = hotspotOpacity.toFixed(3);
      }
    }

    requestAnimationFrame(updateHeroParallax);
  }

  requestAnimationFrame(updateHeroParallax);

  // -------------------------------------------------------------
  // 3️⃣ Seamless Page Transitions
  // -------------------------------------------------------------
  const transitionCurtain = document.getElementById('pageTransitionOverlay');
  document.querySelectorAll('.page-nav-link, a[href^="pages/"]').forEach(link => {
    // Header links (cart, wishlist, account, etc.) have their own dedicated
    // click behavior (e.g. the mini-cart drawer) and must not be hijacked
    // by this homepage-only curtain transition.
    if (link.closest('#siteHeader')) return;

    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');
      if (!targetHref || targetHref.startsWith('#') || targetHref.startsWith('javascript:')) return;

      e.preventDefault();
      if (transitionCurtain) {
        transitionCurtain.classList.add('is-active');
        setTimeout(() => {
          window.location.href = targetHref;
        }, 220);
      } else {
        window.location.href = targetHref;
      }
    });
  });

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
      addBtn.innerHTML = '<i data-lucide="check" style="width: 13px; height: 13px;"></i>';
      addBtn.style.background = '#10B981';
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
        addBtn.innerHTML = '<i data-lucide="plus" style="width: 13px; height: 13px;"></i>';
        addBtn.style.background = '';
        addBtn.style.transform = '';
        if (window.lucide) window.lucide.createIcons();
      }, 1400);
    });

    // Navigate to product details
    function navigateToProduct() {
      const currentStory = stories[currentIndex];
      if (currentStory) {
        if (transitionCurtain) {
          transitionCurtain.classList.add('is-active');
          setTimeout(() => {
            window.location.href = `pages/product.html?id=${currentStory.id}`;
          }, 220);
        } else {
          window.location.href = `pages/product.html?id=${currentStory.id}`;
        }
      }
    }

    // Clicking on hotspot card navigates to product details
    hotspotCard.addEventListener('click', (e) => {
      if (e.target.closest('#heroHotspotAddBtn')) return;
      navigateToProduct();
    });

    // Keyboard support (Enter / Space) for accessible navigation
    hotspotCard.addEventListener('keydown', (e) => {
      if (e.target.closest('#heroHotspotAddBtn')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navigateToProduct();
      }
    });
  }

  // Initialize first story & auto timer
  setStory(0, false);
  startTimer();
}

/**
 * 1c. Today's Deals Live Countdown Ticker & GPU scaleX Progress Bar
 */
function initDealsCountdown() {
  const TOTAL_SECS = (4 * 3600) + (32 * 60) + 15;
  let secondsRemaining = TOTAL_SECS;

  const hoursEl    = document.getElementById('dealHours');
  const minsEl     = document.getElementById('dealMins');
  const secsEl     = document.getElementById('dealSecs');
  const progressBar = document.getElementById('dealProgressBar');

  function pad(n) { return String(n).padStart(2, '0'); }

  // Flip digit: slide up and out, replace content, slide in
  function flipUnit(el, newVal) {
    if (!el || el.textContent === newVal) return;
    el.style.transition = 'transform 120ms ease-in, opacity 120ms ease-in';
    el.style.transform  = 'translateY(-4px)';
    el.style.opacity    = '0';
    setTimeout(() => {
      el.textContent = newVal;
      el.style.transition = 'transform 160ms cubic-bezier(0.23,1,0.32,1), opacity 160ms ease-out';
      el.style.transform  = 'translateY(0)';
      el.style.opacity    = '1';
    }, 130);
  }

  function updateTimer() {
    if (secondsRemaining <= 0) { secondsRemaining = TOTAL_SECS; }

    const h = Math.floor(secondsRemaining / 3600);
    const m = Math.floor((secondsRemaining % 3600) / 60);
    const s = secondsRemaining % 60;

    flipUnit(hoursEl, pad(h));
    flipUnit(minsEl,  pad(m));
    flipUnit(secsEl,  pad(s));

    // GPU scaleX — shrinks from 1 (full) to 0 (expired) over TOTAL_SECS
    if (progressBar) {
      const ratio = secondsRemaining / TOTAL_SECS;
      progressBar.style.transform = `scaleX(${ratio.toFixed(4)})`;
    }

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

  // Card click -> PDP (non-button parts)
  document.querySelectorAll('.deal-product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.deal-add-btn') || e.target.closest('.deal-wishlist-btn') || e.target.closest('.deal-quick-add-overlay')) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      const id = card.getAttribute('data-id') || 'p1';
      window.location.href = `pages/product.html?id=${encodeURIComponent(id)}`;
    });
  });

  // Add to Bag clicks with tactile ripple
  document.querySelectorAll('.deal-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Tactile ripple effect
      const rippleEl = btn.querySelector('.deal-ripple');
      if (rippleEl) {
        rippleEl.classList.remove('animating');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        rippleEl.style.width  = size + 'px';
        rippleEl.style.height = size + 'px';
        rippleEl.style.left   = (e.clientX - rect.left - size / 2) + 'px';
        rippleEl.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
        void rippleEl.offsetWidth; // force reflow to restart animation
        rippleEl.classList.add('animating');
        rippleEl.addEventListener('animationend', () => {
          rippleEl.classList.remove('animating');
        }, { once: true });
      }

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

        btn.innerHTML = '<span class="deal-ripple" aria-hidden="true"></span><i data-lucide="check" style="width: 13px; height: 13px;"></i> ADDED';
        btn.style.background = '#34D399';
        btn.style.color = '#001838';
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<span class="deal-ripple" aria-hidden="true"></span><i data-lucide="plus" style="width: 13px; height: 13px;"></i> QUICK ADD';
          btn.style.background = '';
          btn.style.color = '';
          if (window.lucide) window.lucide.createIcons();
        }, 1600);
      }
    });
  });
}

/**
 * 2. Clickable Intent Suggestions, Form Search & 120fps Typewriter Loop
 */
function initIntentSuggestions() {
  const chips = document.querySelectorAll('.intent-chip-pill, .intent-suggestion-chip');
  const input = document.getElementById('homeIntentInput') || document.getElementById('homeDiscoveryInput');
  const form  = document.getElementById('homeIntentForm') || document.getElementById('homeDiscoveryForm');
  const submitBtn = document.getElementById('homeIntentSubmitBtn');
  const progressBar = document.getElementById('intentTypewriterBar');

  // Generic ripple trigger helper
  function triggerRipple(btn, rippleSelector, e) {
    const rippleEl = btn.querySelector(rippleSelector);
    if (!rippleEl) return;
    rippleEl.classList.remove('animating');
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    rippleEl.style.width  = size + 'px';
    rippleEl.style.height = size + 'px';
    rippleEl.style.left   = (e.clientX - rect.left - size / 2) + 'px';
    rippleEl.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
    void rippleEl.offsetWidth;
    rippleEl.classList.add('animating');
    rippleEl.addEventListener('animationend', () => {
      rippleEl.classList.remove('animating');
    }, { once: true });
  }

  // Clear stale value
  if (input) input.value = '';

  // Chip click handler with tactile ripple
  chips.forEach(chip => {
    chip.addEventListener('click', (e) => {
      triggerRipple(chip, '.intent-chip-ripple', e);
      const text = chip.getAttribute('data-query') || chip.textContent.trim();
      if (input) {
        input.value = text;
        input.focus();
      }
      // Delegate to page transition curtain if available
      const curtain = document.getElementById('pageTransitionOverlay');
      const targetUrl = `pages/discovery.html?q=${encodeURIComponent(text)}`;
      if (curtain) {
        curtain.style.transition = 'opacity 200ms ease';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = targetUrl; }, 210);
      } else {
        window.location.href = targetUrl;
      }
    });
  });

  // Form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (submitBtn) triggerRipple(submitBtn, '.intent-btn-ripple', e);
      const activeInput = form.querySelector('input');
      const val = activeInput ? activeInput.value.trim() : '';
      if (val) {
        const curtain = document.getElementById('pageTransitionOverlay');
        const targetUrl = `pages/discovery.html?q=${encodeURIComponent(val)}`;
        if (curtain) {
          curtain.style.transition = 'opacity 200ms ease';
          curtain.style.opacity = '1';
          curtain.style.pointerEvents = 'all';
          setTimeout(() => { window.location.href = targetUrl; }, 210);
        } else {
          window.location.href = targetUrl;
        }
      }
    });
  }

  // 120fps Typewriter Rotation with Progress Sync
  if (input) {
    const prompts = [
      "Something for a winter evening in Milan",
      "Minimalist linen look for a weekend in Amalfi",
      "Sharp monochrome look for an executive dinner in Zurich",
      "Breathable performance wear for morning runs in Tiergarten",
      "Tailored outerwear for European autumn travel",
      "Understated luxury accessories for gifting"
    ];

    let promptIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let isPaused = false;
    let holdStartTime = 0;
    const HOLD_DURATION = 3500; // ms to pause on full prompt

    // Pause typewriter if user interacts with input
    input.addEventListener('focus', () => { isPaused = true; });
    input.addEventListener('blur',  () => {
      if (!input.value.trim()) { isPaused = false; }
    });
    input.addEventListener('input', () => {
      isPaused = !!input.value.trim();
    });

    function typeLoop(timestamp) {
      if (isPaused) {
        requestAnimationFrame(typeLoop);
        return;
      }

      const currentFullText = prompts[promptIdx];

      if (!isDeleting) {
        // Typing forward
        input.placeholder = currentFullText.substring(0, charIdx + 1);
        charIdx++;

        if (charIdx === currentFullText.length) {
          isDeleting = true;
          holdStartTime = performance.now();
        }
        setTimeout(() => requestAnimationFrame(typeLoop), 45);
      } else {
        // Holding full text with progress bar sync
        const elapsed = performance.now() - holdStartTime;
        if (elapsed < HOLD_DURATION) {
          if (progressBar) {
            const ratio = Math.min(1, elapsed / HOLD_DURATION);
            progressBar.style.transform = `scaleX(${ratio.toFixed(3)})`;
          }
          requestAnimationFrame(typeLoop);
        } else {
          // Reset progress bar & delete text
          if (progressBar) progressBar.style.transform = 'scaleX(0)';
          input.placeholder = currentFullText.substring(0, charIdx - 1);
          charIdx--;

          if (charIdx === 0) {
            isDeleting = false;
            promptIdx = (promptIdx + 1) % prompts.length;
          }
          setTimeout(() => requestAnimationFrame(typeLoop), 25);
        }
      }
    }

    requestAnimationFrame(typeLoop);
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

    // Card click -> PDP with GPU curtain transition
    card.addEventListener('click', (e) => {
      if (e.target.closest('.curated-quick-add-btn') || e.target.closest('.curated-wishlist-btn')) return;
      const targetId = id || 'p1';
      const targetUrl = `pages/product.html?id=${encodeURIComponent(targetId)}`;
      const curtain = document.getElementById('pageTransitionOverlay');
      if (curtain) {
        curtain.style.transition = 'opacity 200ms ease';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = targetUrl; }, 210);
      } else {
        window.location.href = targetUrl;
      }
    });
  });

  // Add to Bag clicks with tactile ripple
  document.querySelectorAll('.curated-quick-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Tactile ripple trigger
      const rippleEl = btn.querySelector('.curated-ripple');
      if (rippleEl) {
        rippleEl.classList.remove('animating');
        const rect = btn.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        rippleEl.style.width  = size + 'px';
        rippleEl.style.height = size + 'px';
        rippleEl.style.left   = (e.clientX - rect.left - size / 2) + 'px';
        rippleEl.style.top    = (e.clientY - rect.top  - size / 2) + 'px';
        void rippleEl.offsetWidth;
        rippleEl.classList.add('animating');
        rippleEl.addEventListener('animationend', () => {
          rippleEl.classList.remove('animating');
        }, { once: true });
      }

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

        btn.innerHTML = '<span class="curated-ripple" aria-hidden="true"></span><i data-lucide="check" style="width: 14px; height: 14px;"></i> <span>Added</span>';
        btn.style.background = '#10B981';
        btn.style.color = '#FFFFFF';
        if (window.lucide && typeof window.lucide.createIcons === 'function') window.lucide.createIcons();

        setTimeout(() => {
          btn.innerHTML = '<span class="curated-ripple" aria-hidden="true"></span><i data-lucide="shopping-bag" style="width: 14px; height: 14px;"></i> <span>Quick Add</span>';
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
  // ── Row click & keyboard navigation -> PDP with GPU Transition ────────
  document.querySelectorAll('.micro-item-row').forEach(row => {
    function navigateToProduct() {
      const id = row.getAttribute('data-id') || 'p1';
      const targetUrl = `pages/product.html?id=${encodeURIComponent(id)}`;
      const curtain = document.getElementById('pageTransitionOverlay');
      if (curtain) {
        curtain.style.transition = 'opacity 200ms ease';
        curtain.style.opacity = '1';
        curtain.style.pointerEvents = 'all';
        setTimeout(() => { window.location.href = targetUrl; }, 210);
      } else {
        window.location.href = targetUrl;
      }
    }

    row.addEventListener('click', (e) => {
      if (e.target.closest('.micro-item-add-btn')) return;
      navigateToProduct();
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.micro-item-add-btn')) return;
        e.preventDefault();
        navigateToProduct();
      }
    });
  });

  // ── Micro Add to Bag with Tactile Ripple & Checkmark Morph ──────────
  document.querySelectorAll('.micro-item-add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      // Ripple physics
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('micro-ripple');
      const existingRipple = btn.querySelector('.micro-ripple');
      if (existingRipple) existingRipple.remove();
      btn.appendChild(circle);

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

        btn.classList.add('added');
        btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px; color: #FFFFFF;"></i>';
        btn.setAttribute('aria-label', `Added ${name} to Bag`);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = '<i data-lucide="plus" style="width: 14px; height: 14px;"></i>';
          btn.setAttribute('aria-label', `Add ${name} to Bag`);
          if (window.lucide) window.lucide.createIcons();
        }, 1400);
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
      window.location.href = `pages/discovery.html${qParam}`;
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
      window.location.href = `pages/category.html?cat=${encodeURIComponent(cat)}`;
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
        window.location.href = 'pages/discovery.html';
      }
    });
  }
}

/**
 * 6. Scroll Reveal Observer (H13)
 */
function initScrollReveal() {
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '100px 0px',
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
 * 8. Recently Viewed Products Tray (Luxury Horizontal Glide Rail)
 */
/**
 * 8. Recently Viewed Products Tray (Luxury Horizontal Glide Rail)
 */
/**
 * 8. Recently Viewed Products Tray (Continuous Fluid Carousel)
 */
function initRecentlyViewed() {
  const section = document.getElementById('homeRecentlyViewedSection');
  const rail = document.getElementById('recentProductsRail');
  const clearBtn = document.getElementById('recentClearBtn');
  const prevBtn = document.getElementById('recentPrevBtn');
  const nextBtn = document.getElementById('recentNextBtn');
  const counterBadge = document.getElementById('recentCounterBadge');
  const emptyState = document.getElementById('recentEmptyState');

  if (!section || !rail) return;

  const RECENTS_KEY = 'nex_recent_products';
  let recents = [];
  try {
    recents = JSON.parse(localStorage.getItem(RECENTS_KEY) || '[]');
  } catch (e) {
    recents = [];
  }

  // Editorial curated pieces across luxury categories
  const SEED_PRODUCTS = [
    { id: 'p1', name: 'Cashmere Turtleneck Sweater', category: 'Apparel', house: 'ATELIER NO. 01', price: 185, formattedPrice: '€ 185.00', image: 'assets/images/products/hero_sweater.png' },
    { id: 'p6', name: 'Minimalist Leather Runner', category: 'Footwear', house: 'STUDIO FOOTWEAR', price: 185, formattedPrice: '€ 185.00', image: 'assets/images/products/prod_runner.png' },
    { id: 'p4', name: 'Studio Acoustics Headphone GT', category: 'Acoustics', house: 'ACOUSTIC LAB', price: 320, formattedPrice: '€ 320.00', image: 'assets/images/products/prod_headphones.png' },
    { id: 'p2', name: 'Structured Leather Tote', category: 'Objects', house: 'ATELIER ACCENTS', price: 245, formattedPrice: '€ 245.00', image: 'assets/images/products/prod_tote.png' },
    { id: 'p3', name: 'Fine-Knit Merino Crew', category: 'Apparel', house: 'ATELIER ESSENTIALS', price: 160, formattedPrice: '€ 160.00', image: 'assets/images/products/plp_crewneck.png' },
    { id: 'p5', name: 'Classic Chronograph Watch', category: 'Objects', house: 'TIMEPIECE ATELIER', price: 340, formattedPrice: '€ 340.00', image: 'assets/images/products/search_watch.png' },
    { id: 'p7', name: 'Tailored Chino Trousers', category: 'Apparel', house: 'ATELIER ESSENTIALS', price: 170, formattedPrice: '€ 170.00', image: 'assets/images/products/plp_trousers.png' }
  ];

  if (!Array.isArray(recents) || recents.length === 0) {
    recents = SEED_PRODUCTS;
  } else if (recents.length < 4) {
    const existingIds = new Set(recents.map(r => r.id));
    SEED_PRODUCTS.forEach(seed => {
      if (!existingIds.has(seed.id)) {
        recents.push(seed);
        existingIds.add(seed.id);
      }
    });
  }

  const PARALLAX_DEPTHS = [1, 1.4, 1.8, 1.2];

  // Render all cards into the continuous rail
  rail.innerHTML = recents.map((item, index) => {
    const depth = PARALLAX_DEPTHS[index % PARALLAX_DEPTHS.length];
    const category = item.category || 'Product';
    const house = item.house || (category.toUpperCase() + ' ATELIER');
    const priceStr = item.formattedPrice || ('€ ' + Number(item.price || 0).toFixed(2));
    const imageSrc = item.image || 'assets/images/products/hero_sweater.png';

    return `
      <a href="pages/product.html?id=${encodeURIComponent(item.id)}" 
         class="recent-glide-card" 
         data-id="${item.id}" 
         data-category="${category}" 
         data-parallax-depth="${depth}"
         aria-label="${item.name}, ${priceStr}">
        <div class="recent-card-glare" aria-hidden="true"></div>
        <div class="recent-card-media">
          <img src="${imageSrc}" alt="${item.name}" loading="lazy" />
          <span class="recent-card-tag">${category}</span>
          <button type="button" class="recent-card-quick-add" data-id="${item.id}" aria-label="Quick add ${item.name} to shopping bag">
            <i data-lucide="plus" style="width: 15px; height: 15px;"></i>
          </button>
        </div>
        <div class="recent-card-meta">
          <span class="recent-card-brand">${house}</span>
          <h4 class="recent-card-title">${item.name}</h4>
          <span class="recent-card-price">${priceStr}</span>
        </div>
      </a>
    `;
  }).join('');

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Real-time counter and nav button updates
  const cards = Array.from(rail.querySelectorAll('.recent-glide-card'));
  const totalCount = cards.length;

  function updateRailState() {
    if (!rail) return;
    const scrollLeft = rail.scrollLeft;
    const maxScroll = rail.scrollWidth - rail.clientWidth;

    if (prevBtn) prevBtn.disabled = scrollLeft <= 6;
    if (nextBtn) nextBtn.disabled = scrollLeft >= maxScroll - 6;

    // Calculate current item index in view
    const cardWidth = cards[0] ? cards[0].offsetWidth + 18 : 288;
    const currentIndex = Math.min(totalCount, Math.max(1, Math.round(scrollLeft / cardWidth) + 1));
    const padIndex = String(currentIndex).padStart(2, '0');
    const padTotal = String(totalCount).padStart(2, '0');

    if (counterBadge) {
      counterBadge.textContent = `${padIndex} / ${padTotal}`;
    }
  }

  // Navigation button controls
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      const scrollStep = (cards[0] ? cards[0].offsetWidth + 18 : 288) * 1.5;
      rail.scrollBy({ left: -scrollStep, behavior: 'smooth' });
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const scrollStep = (cards[0] ? cards[0].offsetWidth + 18 : 288) * 1.5;
      rail.scrollBy({ left: scrollStep, behavior: 'smooth' });
    });
  }

  rail.addEventListener('scroll', updateRailState, { passive: true });

  // Mouse Drag-to-Scroll Momentum
  let isDown = false;
  let startX = 0;
  let scrollStart = 0;
  let hasDragged = false;

  rail.addEventListener('mousedown', (e) => {
    isDown = true;
    hasDragged = false;
    startX = e.pageX - rail.offsetLeft;
    scrollStart = rail.scrollLeft;
  });

  window.addEventListener('mouseup', () => {
    isDown = false;
  });

  rail.addEventListener('mousemove', (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - rail.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > 5) hasDragged = true;
    rail.scrollLeft = scrollStart - walk;
  });

  // Wheel horizontal scroll support
  rail.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      rail.scrollLeft += e.deltaY;
    }
  }, { passive: false });

  // Quick Add Ripple and Action Handling
  rail.addEventListener('click', (e) => {
    if (hasDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    const addBtn = e.target.closest('.recent-card-quick-add');
    if (!addBtn) return;
    
    e.preventDefault();
    e.stopPropagation();

    const productId = addBtn.getAttribute('data-id');
    const product = recents.find(p => String(p.id) === String(productId));

    // Create tactile ripple
    const rect = addBtn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'recent-ripple';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    addBtn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);

    // Morph icon to checkmark
    addBtn.classList.add('added');
    addBtn.innerHTML = '<i data-lucide="check" style="width: 15px; height: 15px;"></i>';
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }

    setTimeout(() => {
      addBtn.classList.remove('added');
      addBtn.innerHTML = '<i data-lucide="plus" style="width: 15px; height: 15px;"></i>';
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }
    }, 1400);

    if (window.nexCart && product) {
      window.nexCart.addItem({
        id: product.id,
        name: product.name,
        category: product.category,
        price: product.price || 0,
        formattedPrice: product.formattedPrice,
        image: product.image || 'assets/images/products/hero_sweater.png'
      });
    }
  });

  // Clear History Action
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      try {
        localStorage.removeItem(RECENTS_KEY);
      } catch (e) {}
      
      rail.style.opacity = '0';
      rail.style.transition = 'opacity 300ms ease';
      if (prevBtn) prevBtn.style.display = 'none';
      if (nextBtn) nextBtn.style.display = 'none';
      if (counterBadge) counterBadge.style.display = 'none';
      clearBtn.style.display = 'none';

      setTimeout(() => {
        rail.style.display = 'none';
        if (emptyState) {
          emptyState.style.display = 'block';
          emptyState.style.opacity = '0';
          emptyState.style.transition = 'opacity 300ms ease';
          requestAnimationFrame(() => { emptyState.style.opacity = '1'; });
        }
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
          window.lucide.createIcons();
        }
      }, 300);
    });
  }

  // Initial state setup
  section.style.display = 'block';
  updateRailState();

  if (typeof window.initRecentlyViewedMotion === 'function') {
    window.initRecentlyViewedMotion();
  }
}


/**
 * initTrustStripInteractions
 * Handles keyboard accessibility (Enter/Space) for trust cards,
 * navigating to the trust-link href inside each card.
 */
function initTrustStripInteractions() {
  const section = document.getElementById('trustStripSection');
  if (!section) return;

  const cards = section.querySelectorAll('.trust-item-card');
  cards.forEach(function(card) {
    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const link = card.querySelector('.trust-link');
        if (link) link.click();
      }
    });
  });

  // Ensure Lucide icons are rendered inside the trust strip
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons({ context: section });
  }
}
