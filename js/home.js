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
  initDealsMasterEngine();
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
 * 1b. Full-Bleed 3D Interactive Model Hero & Floating Shoppable Hotspot Tags
 */
function initHeroCarousel() {
  const stories = [
    {
      id: 'p2',
      name: 'STRUCTURED LEATHER TOTE',
      lookNum: 'FEATURED PIECE',
      price: 'BDT 24,500',
      numericPrice: 24500,
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
 * 1c. Today's Deals Master Motion Engine (All 4 Motion Standards)
 */
function initDealsMasterEngine() {
  const dealsSection = document.getElementById('todaysDealsSection');
  if (!dealsSection) return;

  const isDesktopPointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // -----------------------------------------------------------------
  // 1️⃣ Micro-interaction: 120fps SVG Circular Progress Ring & Tabular Countdown
  // -----------------------------------------------------------------
  const TOTAL_DEAL_SECONDS = 24 * 3600; // 24-hour cycle
  let secondsRemaining = (4 * 3600) + (32 * 60) + 15;
  const CIRCUMFERENCE = 2 * Math.PI * 15.5; // ~97.389

  const ringProgress = document.getElementById('dealsRingProgress');
  const hoursEl = document.getElementById('dealHours');
  const minsEl = document.getElementById('dealMins');
  const secsEl = document.getElementById('dealSecs');

  function updateDealsTimer() {
    if (secondsRemaining <= 0) {
      secondsRemaining = TOTAL_DEAL_SECONDS;
    }

    const h = Math.floor(secondsRemaining / 3600);
    const m = Math.floor((secondsRemaining % 3600) / 60);
    const s = secondsRemaining % 60;

    if (hoursEl) hoursEl.textContent = String(h).padStart(2, '0');
    if (minsEl) minsEl.textContent = String(m).padStart(2, '0');
    if (secsEl) secsEl.textContent = String(s).padStart(2, '0');

    if (ringProgress) {
      const fraction = secondsRemaining / TOTAL_DEAL_SECONDS;
      const offset = CIRCUMFERENCE * (1 - fraction);
      ringProgress.style.strokeDashoffset = offset.toFixed(2);
    }

    secondsRemaining--;
  }

  updateDealsTimer();
  setInterval(updateDealsTimer, 1000);

  // -----------------------------------------------------------------
  // 1️⃣ Micro-interaction: Category Look Switcher with Sliding GPU Pill
  // -----------------------------------------------------------------
  const categoryTabs = dealsSection.querySelectorAll('.deals-category-tab');
  const sliderPill = document.getElementById('dealsNavSliderPill');
  const railCards = dealsSection.querySelectorAll('.deal-rail-card');
  const railCountEl = document.getElementById('railCount');

  function updateSliderPill(activeTab) {
    if (!sliderPill || !activeTab) return;
    sliderPill.style.width = `${activeTab.offsetWidth}px`;
    sliderPill.style.transform = `translate3d(${activeTab.offsetLeft}px, 0, 0)`;
  }

  const initialActiveTab = dealsSection.querySelector('.deals-category-tab.is-active');
  if (initialActiveTab) {
    setTimeout(() => updateSliderPill(initialActiveTab), 50);
  }

  categoryTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      e.stopPropagation();
      categoryTabs.forEach(t => {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('is-active');
      tab.setAttribute('aria-selected', 'true');
      updateSliderPill(tab);

      const cat = tab.getAttribute('data-category');
      let visibleCount = 0;

      railCards.forEach(card => {
        const cardCat = card.getAttribute('data-cat');
        if (cat === 'all' || cardCat === cat) {
          card.classList.remove('is-hidden');
          card.style.opacity = '1';
          visibleCount++;
        } else {
          card.classList.add('is-hidden');
          card.style.opacity = '0';
        }
      });

      if (railCountEl) railCountEl.textContent = String(visibleCount);
    });
  });

  // -----------------------------------------------------------------
  // 1️⃣ Micro-interaction: Spotlight Colorway Swatches Live Cross-Fade
  // -----------------------------------------------------------------
  const swatchBtns = dealsSection.querySelectorAll('.deals-swatch-btn');
  const spotlightImg = document.getElementById('spotlightMainImg');
  const spotlightTitle = document.getElementById('spotlightTitle');

  swatchBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      swatchBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');

      const newImg = btn.getAttribute('data-img');
      const newName = btn.getAttribute('data-name');

      if (spotlightImg && newImg) {
        spotlightImg.style.opacity = '0.4';
        setTimeout(() => {
          spotlightImg.src = newImg;
          spotlightImg.style.opacity = '1';
        }, 120);
      }
      if (spotlightTitle && newName) {
        spotlightTitle.textContent = newName;
      }
    });
  });

  // -----------------------------------------------------------------
  // 1️⃣ Micro-interaction: Tactile Quick-Add Ripple & Header Cart Pulse
  // -----------------------------------------------------------------
  function triggerQuickAdd(btn, e) {
    e.preventDefault();
    e.stopPropagation();

    // Spawn localized ripple
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement('span');
    ripple.className = 'deal-ripple-circle';
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);

    const id = btn.getAttribute('data-id');
    const name = btn.getAttribute('data-name');
    const price = parseInt(btn.getAttribute('data-price'), 10) || 0;
    const img = btn.getAttribute('data-img');
    const cat = btn.getAttribute('data-cat') || 'Apparel';

    if (window.nexCart && typeof window.nexCart.addItem === 'function') {
      window.nexCart.addItem({
        id: id,
        name: name,
        size: 'M',
        price: price,
        qty: 1,
        image: img,
        category: cat
      });
    }

    if (typeof window.showToast === 'function') {
      window.showToast(`Added ${name} to your bag`);
    }

    // Button feedback state
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<i data-lucide="check" style="width: 14px; height: 14px;"></i> <span>Added</span>';
    btn.style.background = '#10B981';
    btn.style.color = '#FFFFFF';
    btn.style.transform = 'scale(1.05)';
    if (window.lucide) window.lucide.createIcons();

    // Pulse header bag badge
    const bagBadge = document.getElementById('headerCartCount');
    if (bagBadge) {
      bagBadge.style.transform = 'scale(1.35)';
      setTimeout(() => { bagBadge.style.transform = 'scale(1)'; }, 250);
    }

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.style.transform = '';
      if (window.lucide) window.lucide.createIcons();
    }, 1400);
  }

  dealsSection.querySelectorAll('.deals-quick-add-btn, .deal-rail-quickadd').forEach(btn => {
    btn.addEventListener('click', (e) => triggerQuickAdd(btn, e));
  });

  // -----------------------------------------------------------------
  // 2️⃣ 3D Spatial Tilt Physics & Dynamic Specular Glare
  // -----------------------------------------------------------------
  const interactiveCards = dealsSection.querySelectorAll('.deals-spotlight-card, .deal-rail-card');

  interactiveCards.forEach(card => {
    if (!isDesktopPointer || isReducedMotion) return;

    let targetRotX = 0;
    let targetRotY = 0;
    let curRotX = 0;
    let curRotY = 0;
    let isHovered = false;
    let rafId = null;

    function renderTilt() {
      curRotX += (targetRotX - curRotX) * 0.12;
      curRotY += (targetRotY - curRotY) * 0.12;

      card.style.transform = `perspective(1000px) rotateX(${curRotX.toFixed(2)}deg) rotateY(${curRotY.toFixed(2)}deg) translateZ(0)`;

      if (isHovered || Math.abs(curRotX) > 0.05 || Math.abs(curRotY) > 0.05) {
        rafId = requestAnimationFrame(renderTilt);
      } else {
        card.style.transform = '';
      }
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;

      const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5;

      targetRotX = -y * 10; // Max 10 deg pitch
      targetRotY = x * 12;  // Max 12 deg yaw

      // Update specular glare coordinates
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--glare-x', `${glareX.toFixed(1)}%`);
      card.style.setProperty('--glare-y', `${glareY.toFixed(1)}%`);
      card.style.setProperty('--glare-opacity', '0.22');

      if (!isHovered) {
        isHovered = true;
        cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(renderTilt);
      }
    });

    card.addEventListener('mouseleave', () => {
      isHovered = false;
      targetRotX = 0;
      targetRotY = 0;
      card.style.setProperty('--glare-opacity', '0');
    });
  });

  // -----------------------------------------------------------------
  // 3️⃣ Seamless GPU Cross-Dissolve Page Transitions
  // -----------------------------------------------------------------
  const transitionCurtain = document.getElementById('pageTransitionOverlay');

  function navigateToPdp(id) {
    const targetUrl = `pages/product.html?id=${encodeURIComponent(id || 'p1')}`;
    if (transitionCurtain) {
      transitionCurtain.classList.add('is-active');
      setTimeout(() => {
        window.location.href = targetUrl;
      }, 220);
    } else {
      window.location.href = targetUrl;
    }
  }

  interactiveCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.deals-quick-add-btn') || 
          e.target.closest('.deal-rail-quickadd') || 
          e.target.closest('.deal-wishlist-btn') || 
          e.target.closest('.deals-swatch-btn')) {
        return;
      }
      const id = card.getAttribute('data-id') || 'p1';
      navigateToPdp(id);
    });

    // Keyboard support
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.deals-quick-add-btn') || 
            e.target.closest('.deal-rail-quickadd') || 
            e.target.closest('.deal-wishlist-btn') || 
            e.target.closest('.deals-swatch-btn')) {
          return;
        }
        e.preventDefault();
        const id = card.getAttribute('data-id') || 'p1';
        navigateToPdp(id);
      }
    });
  });

  // Wishlist clicks
  const WISHLIST_KEY = 'nex_curated_wishlist_ids';
  let savedWishlist = [];
  try {
    savedWishlist = JSON.parse(localStorage.getItem(WISHLIST_KEY) || '[]');
  } catch (e) {
    savedWishlist = [];
  }

  dealsSection.querySelectorAll('.deal-wishlist-btn').forEach(btn => {
    const card = btn.closest('[data-id]');
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

  // -----------------------------------------------------------------
  // 4️⃣ Scroll Parallax with Differential Column Depth
  // -----------------------------------------------------------------
  const spotlightCol = dealsSection.querySelector('.deals-spotlight-col');
  const ambientMesh = dealsSection.querySelector('.deals-ambient-mesh');
  let targetScroll = window.scrollY || 0;
  let currentScroll = targetScroll;
  let isSectionInView = true;

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      isSectionInView = entry.isIntersecting;
    });
  }, { rootMargin: '150px 0px' });

  sectionObserver.observe(dealsSection);

  window.addEventListener('scroll', () => {
    targetScroll = window.scrollY || 0;
  }, { passive: true });

  function updateDealsParallax() {
    if (!isReducedMotion && isSectionInView && spotlightCol) {
      currentScroll += (targetScroll - currentScroll) * 0.10;
      const rect = dealsSection.getBoundingClientRect();
      const relativeY = -rect.top;

      // Spotlight Column differential 0.08x lag
      const spotOffset = relativeY * 0.08;
      spotlightCol.style.transform = `translate3d(0, ${spotOffset.toFixed(1)}px, 0)`;

      // Rail Cards differential lag (staggered odd vs even)
      railCards.forEach((rc, i) => {
        const factor = (i % 2 === 0) ? 0.04 : 0.09;
        const rcOffset = relativeY * factor;
        rc.style.transform = `translate3d(0, ${rcOffset.toFixed(1)}px, 0)`;
      });

      // Ambient Mesh differential drift
      if (ambientMesh) {
        const meshOffset = relativeY * 0.18;
        ambientMesh.style.transform = `translate3d(0, ${meshOffset.toFixed(1)}px, 0)`;
      }
    }
    requestAnimationFrame(updateDealsParallax);
  }

  requestAnimationFrame(updateDealsParallax);

  // -----------------------------------------------------------------
  // Rail Carousel Navigation (Prev / Next Buttons & Drag)
  // -----------------------------------------------------------------
  const trackWrap = document.getElementById('dealsTrackWrap');
  const prevBtn = document.getElementById('dealsPrevBtn');
  const nextBtn = document.getElementById('dealsNextBtn');

  if (trackWrap && prevBtn && nextBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      trackWrap.scrollBy({ left: -280, behavior: 'smooth' });
    });
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      trackWrap.scrollBy({ left: 280, behavior: 'smooth' });
    });
  }

  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }
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
      window.location.href = `pages/discovery.html?q=${encodeURIComponent(text)}`;
    });
  });

  // Form submission handler
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const activeInput = form.querySelector('input');
      const val = activeInput ? activeInput.value.trim() : '';
      if (val) {
        window.location.href = `pages/discovery.html?q=${encodeURIComponent(val)}`;
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
      window.location.href = `pages/product.html?id=${encodeURIComponent(targetId)}`;
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
      window.location.href = `pages/product.html?id=${encodeURIComponent(id)}`;
    });

    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.target.closest('.micro-item-add-btn')) return;
        e.preventDefault();
        const id = row.getAttribute('data-id') || 'p1';
        window.location.href = `pages/product.html?id=${encodeURIComponent(id)}`;
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
      { id: 'p1', name: 'Cashmere Turtleneck Sweater', category: 'Apparel', price: 18500, formattedPrice: 'BDT 18,500', image: 'assets/images/products/hero_sweater.png' },
      { id: 'p6', name: 'Minimalist Leather Runner', category: 'Footwear', price: 11900, formattedPrice: 'BDT 11,900', image: 'assets/images/products/prod_runner.png' },
      { id: 'p4', name: 'Studio Acoustics Headphone GT', category: 'Acoustics', price: 32000, formattedPrice: 'BDT 32,000', image: 'assets/images/lifestyle/thumb_headphones.jpg' }
    ];
  }

  rail.innerHTML = recents.map(item => `
    <a href="pages/product.html?id=${encodeURIComponent(item.id)}" class="recent-card" data-id="${item.id}">
      <div class="recent-card-thumb">
        <img src="${item.image || 'assets/images/products/hero_sweater.png'}" alt="${item.name}" loading="lazy" />
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

