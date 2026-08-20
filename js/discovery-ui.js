(function(window) {
  'use strict';

  var TIMEOUT_MS = 5000;
  var DELAY_MS = 600;
  var LOOK_DURATION = 6500; // 6.5s per curated look cycle

  var activeIntent = {};
  var activeQuery = '';
  var timeoutHandle = null;
  var aiFailureMode = false;

  var activeLookIndex = 0;
  var lookStartTime = null;
  var lookElapsed = 0;
  var lookTimerRaf = null;
  var isLookPaused = false;
  var lookTransitionToken = 0;

  var DISCOVERY_CURATED_LOOKS = [
    {
      id: 'look-thermal',
      tabLabel: '01 THERMAL LAYERS',
      seasonBadge: 'SEASONAL INTENT · AW26',
      title: 'The Thermal Layering Edit',
      desc: 'Precision double-faced wool and structured cashmere layers engineered for warmth without excess volume.',
      query: 'Something warm but not bulky',
      pieceCount: '8 Matching Pieces',
      imgLandscape: '../assets/images/lifestyle/hero_sweater_landscape.jpg',
      featuredProductId: 'p2',
      featuredProductThumb: '../assets/images/lifestyle/thumb_sweater.jpg',
      featuredProductTag: 'FEATURED LOOK',
      featuredProductTitle: 'STRUCTURED WOOL BLAZER',
      featuredProductPrice: '€ 264.00'
    },
    {
      id: 'look-sneakers',
      tabLabel: '02 MINIMAL SNEAKERS',
      seasonBadge: 'ARCHITECTURAL FOOTWEAR · SS26',
      title: 'Minimalist Monochrome Runners',
      desc: 'Italian calfskin low-tops engineered with contoured Vibram soles for quiet everyday motion.',
      query: 'Minimal everyday sneakers',
      pieceCount: '4 Matching Pieces',
      imgLandscape: '../assets/images/lifestyle/hero_runner_landscape.jpg',
      featuredProductId: 'p6',
      featuredProductThumb: '../assets/images/lifestyle/thumb_runner.jpg',
      featuredProductTag: 'FEATURED SILHOUETTE',
      featuredProductTitle: 'MINIMALIST LEATHER RUNNER',
      featuredProductPrice: '€ 198.00'
    },
    {
      id: 'look-travel',
      tabLabel: '03 LONG FLIGHT',
      seasonBadge: 'TRANSIT ESSENTIALS · SS26',
      title: 'Long-Haul Transit Comfort',
      desc: 'Full-grain leather carryalls and relaxed cashmere layers tailored for effortless flight hours.',
      query: 'Comfortable for a long flight',
      pieceCount: '6 Matching Pieces',
      imgLandscape: '../assets/images/lifestyle/hero_tote_landscape.jpg',
      featuredProductId: 'p7',
      featuredProductThumb: '../assets/images/lifestyle/thumb_tote.jpg',
      featuredProductTag: 'CABIN COMFORT',
      featuredProductTitle: 'LEATHER WEEKENDER TOTE',
      featuredProductPrice: '€ 285.00'
    },
    {
      id: 'look-evening',
      tabLabel: '04 MILAN EVENING',
      seasonBadge: 'URBAN ROTATION · AW26',
      title: 'Milan Cool Evening Edit',
      desc: 'Breathable merino layers and active acoustic isolation for relaxed dinner and rooftop evenings.',
      query: 'Something warm for a cool evening in Milan',
      pieceCount: '8 Matching Pieces',
      imgLandscape: '../assets/images/lifestyle/hero_headphone_landscape.jpg',
      featuredProductId: 'p4',
      featuredProductThumb: '../assets/images/lifestyle/thumb_headphones.jpg',
      featuredProductTag: 'ACOUSTIC ATELIER',
      featuredProductTitle: 'STUDIO SPATIAL HEADPHONES',
      featuredProductPrice: '€ 320.00'
    }
  ];

  function el(id) { return document.getElementById(id); }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ── 120FPS GPU Progress Bar & Curated Look Switcher ───────────────────────

  function updateProgressBar(progress) {
    var bar = el('spotlightProgressBar');
    if (bar) {
      bar.style.transform = 'scaleX(' + Math.max(0, Math.min(1, progress)).toFixed(4) + ')';
    }
  }

  function isLookPausedNow() {
    return isLookPaused;
  }

  function tickLookTimer(now) {
    if (!lookStartTime) lookStartTime = now - lookElapsed;
    lookElapsed = now - lookStartTime;
    var progress = lookElapsed / LOOK_DURATION;

    updateProgressBar(progress);

    if (progress >= 1) {
      updateProgressBar(1);
      lookStartTime = null;
      lookElapsed = 0;
      var nextIndex = (activeLookIndex + 1) % DISCOVERY_CURATED_LOOKS.length;
      setCuratedLook(nextIndex, false);
      return;
    }

    lookTimerRaf = requestAnimationFrame(tickLookTimer);
  }

  // Starts a fresh rotation cycle (elapsed = 0). Does not run the rAF loop
  // while paused — pauseLookTimer()/resumeLookTimer() own that transition so
  // the elapsed clock never counts wall-clock time spent paused.
  function startLookTimer() {
    if (lookTimerRaf) cancelAnimationFrame(lookTimerRaf);
    lookTimerRaf = null;
    lookStartTime = null;
    lookElapsed = 0;
    updateProgressBar(0);
    if (!isLookPaused) {
      lookStartTime = performance.now();
      lookTimerRaf = requestAnimationFrame(tickLookTimer);
    }
  }

  // Stops the rAF loop entirely so no time accrues while paused.
  function pauseLookTimer() {
    if (isLookPaused) return;
    isLookPaused = true;
    if (lookTimerRaf) { cancelAnimationFrame(lookTimerRaf); lookTimerRaf = null; }
  }

  // Re-anchors lookStartTime against the current clock before resuming, so
  // the paused duration is never counted as rotation progress.
  function resumeLookTimer() {
    if (!isLookPaused) return;
    isLookPaused = false;
    lookStartTime = performance.now() - lookElapsed;
    lookTimerRaf = requestAnimationFrame(tickLookTimer);
  }

  function setCuratedLook(index, userInitiated) {
    activeLookIndex = index;
    var look = DISCOVERY_CURATED_LOOKS[index];
    if (!look) return;

    // Update Eyebrow counter
    var eyebrow = el('spotlightLookEyebrow');
    if (eyebrow) {
      eyebrow.textContent = 'CURATED INTENT · 0' + (index + 1) + ' OF 0' + DISCOVERY_CURATED_LOOKS.length;
    }

    // Update Tab states
    var tabs = document.querySelectorAll('#spotlightTabs .spotlight-tab-btn');
    tabs.forEach(function(btn, i) {
      var isActive = (i === index);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
      btn.tabIndex = isActive ? 0 : -1;
    });

    // Update Story Pane with smooth fade
    var storyPane = document.querySelector('.discovery-curation-spotlight .spotlight-story-pane');
    if (storyPane) {
      storyPane.style.opacity = '0.4';
      storyPane.style.transform = 'translateY(4px)';
      storyPane.style.transition = 'opacity 220ms ease, transform 220ms ease';
    }

    // Guarded with a transition token: if setCuratedLook() is called again
    // (rapid tab clicks, or an auto-rotation tick landing inside another
    // look's transition window) before this timeout fires, its callback is
    // stale and must no-op instead of overwriting the newer look's tab/
    // eyebrow state with this look's title/desc — the exact desync that
    // showed up in testing (eyebrow said 02, active tab said 01).
    var transitionToken = ++lookTransitionToken;
    setTimeout(function() {
      if (transitionToken !== lookTransitionToken) return;

      var seasonBadge = el('spotlightSeasonBadge');
      var title = el('spotlightCapsuleTitle');
      var desc = el('spotlightCapsuleDesc');
      var syncBtn = el('spotlightSyncFilterBtn');
      var pieceCount = el('spotlightPieceCount');

      if (seasonBadge) seasonBadge.textContent = look.seasonBadge;
      if (title) title.textContent = look.title;
      if (desc) desc.textContent = look.desc;
      if (syncBtn) {
        syncBtn.setAttribute('data-query', look.query);
        syncBtn.innerHTML = '<span>Explore Capsule Intent</span><i data-lucide="arrow-right" style="width:13px;height:13px;"></i>';
      }
      if (pieceCount) pieceCount.textContent = look.pieceCount;

      if (storyPane) {
        storyPane.style.opacity = '1';
        storyPane.style.transform = 'translateY(0)';
      }
      if (window.lucide) window.lucide.createIcons();
    }, 120);

    // Update Visual Frame & 3D Pill
    var featuredImg = el('spotlightFeaturedImg');
    var pill = el('spotlightShoppablePill');
    var pillThumb = el('spotlightPillThumb');
    var pillTag = el('spotlightPillTag');
    var pillTitle = el('spotlightPillTitle');
    var pillPrice = el('spotlightPillPrice');
    var quickAddBtn = el('spotlightQuickAddBtn');

    if (featuredImg) {
      featuredImg.style.opacity = '0.6';
      featuredImg.style.transition = 'opacity 250ms ease';
      setTimeout(function() {
        if (transitionToken !== lookTransitionToken) return;
        featuredImg.src = look.imgLandscape;
        featuredImg.alt = look.title;
        featuredImg.style.opacity = '1';
      }, 100);
    }

    if (pill) pill.setAttribute('data-id', look.featuredProductId);
    if (pillThumb) pillThumb.src = look.featuredProductThumb;
    if (pillTag) pillTag.textContent = look.featuredProductTag;
    if (pillTitle) pillTitle.textContent = look.featuredProductTitle;
    if (pillPrice) pillPrice.textContent = look.featuredProductPrice;
    if (quickAddBtn) quickAddBtn.setAttribute('data-id', look.featuredProductId);

    if (window.lucide) window.lucide.createIcons();

    startLookTimer();
  }

  function initLookSwitcher() {
    var pauseBtn = el('spotlightPauseToggleBtn');
    var pauseIcon = el('spotlightPauseIcon');

    if (pauseBtn) {
      pauseBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        if (isLookPaused) resumeLookTimer(); else pauseLookTimer();
        pauseBtn.setAttribute('aria-pressed', isLookPaused ? 'true' : 'false');
        pauseBtn.setAttribute('aria-label', isLookPaused ? 'Resume capsule rotation' : 'Pause capsule rotation');
        if (pauseIcon) {
          pauseIcon.setAttribute('data-lucide', isLookPaused ? 'play' : 'pause');
          if (window.lucide) window.lucide.createIcons();
        }
      });
    }

    // Tab button clicks
    var tabsContainer = el('spotlightTabs');
    var tabs = document.querySelectorAll('#spotlightTabs .spotlight-tab-btn');
    tabs.forEach(function(btn) {
      btn.addEventListener('click', function() {
        var idx = parseInt(btn.getAttribute('data-look'), 10);
        if (!isNaN(idx) && idx !== activeLookIndex) {
          setCuratedLook(idx, true);
        }
      });
    });

    // ARIA Tabs keyboard pattern: Arrow/Home/End move focus AND activate,
    // since inactive tabs carry tabIndex=-1 and are otherwise unreachable.
    if (tabsContainer) {
      tabsContainer.addEventListener('keydown', function(e) {
        var tabList = Array.prototype.slice.call(tabsContainer.querySelectorAll('.spotlight-tab-btn'));
        var currentIndex = tabList.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        var newIndex = null;
        if (e.key === 'ArrowRight') newIndex = (currentIndex + 1) % tabList.length;
        else if (e.key === 'ArrowLeft') newIndex = (currentIndex - 1 + tabList.length) % tabList.length;
        else if (e.key === 'Home') newIndex = 0;
        else if (e.key === 'End') newIndex = tabList.length - 1;
        else return;

        e.preventDefault();
        setCuratedLook(newIndex, true);
        tabList[newIndex].focus();
      });
    }

    // "Explore Capsule Intent" button click
    var syncBtn = el('spotlightSyncFilterBtn');
    if (syncBtn) {
      syncBtn.addEventListener('click', function() {
        var targetQuery = syncBtn.getAttribute('data-query');
        if (targetQuery) {
          var input = el('discoveryMainInput');
          if (input) input.value = targetQuery;
          execute(targetQuery);
          var resultsSec = el('discoveryResultsSection');
          if (resultsSec) {
            resultsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      });
    }

    // Floating Shoppable Look Pill Quick Add
    var pillQuickAdd = el('spotlightQuickAddBtn');
    if (pillQuickAdd) {
      pillQuickAdd.addEventListener('click', function(e) {
        e.stopPropagation();
        var prodId = pillQuickAdd.getAttribute('data-id');
        if (prodId) {
          addQuickProductToBag(prodId, pillQuickAdd);
        }
      });
    }

    // Hover pause
    var spotlightSec = el('discoverySpotlightSection');
    if (spotlightSec) {
      spotlightSec.addEventListener('mouseenter', function() { pauseLookTimer(); });
      spotlightSec.addEventListener('mouseleave', function() {
        var isExplicitlyPaused = pauseBtn && pauseBtn.getAttribute('aria-pressed') === 'true';
        if (!isExplicitlyPaused) resumeLookTimer();
      });
    }

    setCuratedLook(0, false);
  }

  // ── 120FPS GPU "Thinking Bar" ─────────────────────────────────────────────

  function runThinkingBar(durationMs) {
    var track = el('discoveryThinkingTrack');
    var bar = el('discoveryThinkingBar');
    if (!track || !bar) return;
    track.classList.add('active');
    bar.style.transition = 'none';
    bar.style.transform = 'scaleX(0)';
    var start = null;

    function step(ts) {
      if (!track.classList.contains('active')) return;
      if (!start) start = ts;
      var progress = Math.min((ts - start) / durationMs, 1);
      bar.style.transform = 'scaleX(' + progress.toFixed(3) + ')';
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        track.classList.remove('active');
      }
    }
    requestAnimationFrame(step);
  }

  // Derives a badge from the catalog engine's relevance score, since the
  // demo catalog never sets a per-product matchBadge — previously every
  // card said "AI Match" regardless of whether anything actually matched.
  function matchBadgeFor(p) {
    if (p.matchBadge) return p.matchBadge;
    var score = typeof p._score === 'number' ? p._score : 0;
    if (score >= 0.5) return 'Strong Match';
    if (score >= 0.2) return 'Good Match';
    if (score > 0)    return 'Related Piece';
    return 'Catalog Pick';
  }

  function buildChipList(intent) {
    var chips = [];
    if (!intent) return chips;
    if (intent.occasion) chips.push({ key: 'occasion', label: intent.occasion.value });
    if (intent.climate)  chips.push({ key: 'climate',  label: intent.climate.value  });
    if (intent.location) chips.push({ key: 'location', label: intent.location.value });
    if (intent.style && intent.style.source === 'explicit') chips.push({ key: 'style', label: intent.style.value });
    if (intent.color)    chips.push({ key: 'color',    label: intent.color.value    });
    if (intent.fit)      chips.push({ key: 'fit',      label: intent.fit.value      });
    if (intent.budget)   chips.push({ key: 'budget',   label: 'Under € ' + intent.budget.max.toLocaleString() });
    if (intent.recipient) chips.push({ key: 'recipient', label: 'For ' + intent.recipient.value });
    return chips;
  }

  // ── Cart Quick Add Helper ─────────────────────────────────────────────────

  function addQuickProductToBag(productId, buttonEl) {
    // Snapshot the button's original markup before the ripple span is
    // inserted, so restoring it later can't bake in an orphan ripple node.
    var origHtml = buttonEl ? buttonEl.innerHTML : null;

    if (buttonEl) {
      buttonEl.classList.add('loading');
      var ripple = document.createElement('span');
      ripple.className = 'btn-ripple-wave';
      buttonEl.appendChild(ripple);
      setTimeout(function() { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 600);
    }

    setTimeout(function() {
      var catalog = (window.NexAI && window.NexAI.catalogArray) || [];
      var product = null;
      for (var i = 0; i < catalog.length; i++) {
        if (catalog[i].id === productId) { product = catalog[i]; break; }
      }

      if (product && window.nexCart && typeof window.nexCart.addItem === 'function') {
        window.nexCart.addItem({
          id: product.id,
          name: product.title || product.name,
          price: product.numericPrice || product.price,
          image: product.img || product.image,
          category: product.category
        });
      }

      if (buttonEl) {
        buttonEl.classList.remove('loading');
        buttonEl.classList.add('added');
        // Icon-only checkmark swap (no text label) — this button is a fixed
        // 44px square, so injecting an "ADDED" label overflowed the card's
        // action row. Matches the checkmark-swap pattern used elsewhere
        // (e.g. .recent-card-quick-add in home.js).
        buttonEl.innerHTML = '<i data-lucide="check" style="width:13px;height:13px;"></i>';
        if (window.lucide) window.lucide.createIcons();
        setTimeout(function() {
          buttonEl.classList.remove('added');
          if (origHtml !== null) buttonEl.innerHTML = origHtml;
          if (window.lucide) window.lucide.createIcons();
        }, 1600);
      }

      if (window.showToast) {
        showToast('Added to your shopping bag.', 'success');
      }
    }, 280);
  }

  // ── States & Rendering ───────────────────────────────────────────────────

  function renderDefaultState() {
    var section = el('discoveryResultsSection');
    var contextBar = el('discoveryContextBar');
    var refinementBar = el('discoveryRefinementBar');
    if (section) section.style.display = 'none';
    if (contextBar) contextBar.style.display = 'none';
    if (refinementBar) refinementBar.style.display = 'none';
  }

  function renderProcessingState(intent) {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) {
      section.style.display = 'block';
    }

    var chips = buildChipList(intent);
    var chipHtml = '';
    if (chips.length > 0) {
      chipHtml = '<div style="margin-top:24px;text-align:center;">'
        + '<div style="font-family:var(--font-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:12px;">EXTRACTING SEMANTIC INTENT...</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + chips.map(function(c) { return '<span class="intent-chip discovery-parsing-chip">' + escHtml(c.label) + '</span>'; }).join('')
        + '</div></div>';
    }

    if (grid) {
      grid.innerHTML = '<div class="discovery-processing" style="grid-column:1/-1;padding:60px 0;text-align:center;">'
        + '<div class="discovery-processing-dots"><div class="discovery-processing-dot"></div><div class="discovery-processing-dot"></div><div class="discovery-processing-dot"></div></div>'
        + '<span class="discovery-processing-text">Synthesizing Catalog Intent…</span>'
        + chipHtml + '</div>';
    }
  }

  function renderResults(query, intent, catalogResult) {
    var products = catalogResult.products || [];
    var relaxedFilters = catalogResult.relaxedFilters || [];
    var isFallback = catalogResult.isFallback;
    var isWeakMatch = catalogResult.isWeakMatch;
    var section = el('discoveryResultsSection');
    var contextBar = el('discoveryContextBar');
    var contextChips = el('discoveryContextChips');
    var header = el('discoveryResultsHeader');
    var grid = el('discoveryResultsGrid');
    var refinementBar = el('discoveryRefinementBar');

    if (section) section.style.display = 'block';

    var chips = buildChipList(intent);
    if (chips.length > 0 && contextBar && contextChips) {
      contextBar.style.display = 'flex';
      contextChips.innerHTML = chips.map(function(chip) {
        return '<span class="discovery-intent-chip" data-ctx-key="' + escHtml(chip.key) + '">'
          + escHtml(chip.label)
          + '<button class="discovery-chip-remove" data-remove-key="' + escHtml(chip.key) + '" aria-label="Remove ' + escHtml(chip.label) + '">'
          + '<svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
          + '</button></span>';
      }).join('');
    } else if (contextBar) {
      contextBar.style.display = 'none';
    }

    if (header) {
      var relaxNote = relaxedFilters.length > 0 ? '<div style="font-family:var(--font-body);font-size:12px;color:var(--accent-pink);margin-top:6px;">Budget relaxed &mdash; showing closest aesthetic matches.</div>' : '';
      var fallNote  = isFallback ? '<div style="font-family:var(--font-body);font-size:12px;color:var(--text-secondary);margin-top:6px;">AI semantic engine paused &mdash; showing catalog keyword matches.</div>' : '';
      var weakNote  = (isWeakMatch && !isFallback) ? '<div style="font-family:var(--font-body);font-size:12px;color:var(--text-secondary);margin-top:6px;">No strong matches for that request &mdash; showing the full catalog instead.</div>' : '';
      header.innerHTML = products.length > 0
        ? '<span class="discovery-results-eyebrow">Results for your request</span>'
          + '<h2 class="discovery-results-query">"' + escHtml(query) + '"</h2>'
          + '<div class="discovery-results-count">' + products.length + ' piece' + (products.length !== 1 ? 's' : '') + ' curated</div>'
          + relaxNote + fallNote + weakNote
        : '';
    }

    if (!grid) return;

    if (products.length === 0) {
      renderNoResultsState(grid, intent);
      if (refinementBar) refinementBar.style.display = 'none';
      return;
    }

    // Build Product Cards with 4 Motion Standards
    grid.innerHTML = products.map(function(p, i) {
      var parallaxDepth = (i % 3 === 0) ? '0.7' : (i % 3 === 1) ? '1.3' : '0.9';
      var name = p.title || p.name || 'Atelier Silhouette';
      var category = p.category || 'Atelier Collection';
      var reasoning = p.reasoning || p.desc || '';
      var priceText = p.formattedPrice || ('€ ' + Number(p.numericPrice || p.price || 0).toFixed(2));

      return '<div class="discovery-card" data-id="' + escHtml(p.id) + '" data-parallax-depth="' + parallaxDepth + '" role="listitem" aria-label="' + escHtml(name) + '">'
        + '<div class="discovery-card-specular" aria-hidden="true"></div>'
        + '<div class="discovery-card-image">'
        + '<a href="product.html?id=' + escHtml(p.id) + '" aria-label="View ' + escHtml(name) + '">'
        + '<img src="' + escHtml(p.img || p.image || '') + '" alt="' + escHtml(name) + '" loading="lazy" />'
        + '</a>'
        + '<span class="discovery-card-match-badge">' + escHtml(matchBadgeFor(p)) + '</span>'
        + (reasoning
          ? '<button type="button" class="discovery-card-info-btn btn-ripple" data-why-name="' + escHtml(name) + '" data-why-reasoning="' + escHtml(reasoning) + '" aria-label="Why this fits">'
            + '<i data-lucide="sparkles" style="width:13px;height:13px;"></i></button>'
          : '')
        + '</div>'
        + '<div class="discovery-card-body">'
        + '<span class="discovery-card-category">' + escHtml(category) + '</span>'
        + '<h3 class="discovery-card-name"><a href="product.html?id=' + escHtml(p.id) + '">' + escHtml(name) + '</a></h3>'
        + '<div class="discovery-card-price tabular-nums">' + escHtml(priceText) + '</div>'
        + '</div>'
        + '<div class="discovery-card-actions">'
        + '<button type="button" class="btn-primary-commerce discovery-view-btn btn-ripple" data-product-id="' + escHtml(p.id) + '" aria-label="View ' + escHtml(name) + '">VIEW PIECE</button>'
        + '<button type="button" class="btn-secondary-action discovery-card-quick-add btn-ripple" data-quick-id="' + escHtml(p.id) + '" aria-label="Quick Add ' + escHtml(name) + ' to Bag"><i data-lucide="shopping-bag" style="width:13px;height:13px;"></i></button>'
        + '</div></div>';
    }).join('');

    if (window.lucide) window.lucide.createIcons();
    if (window.initDiscoveryCardsMotion) window.initDiscoveryCardsMotion();

    if (refinementBar) refinementBar.style.display = 'flex';
  }

  // "Why it fits" modal
  function openWhyMatchesModal(name, reasoning) {
    var modal = el('whyMatchesModal');
    var content = el('whyMatchesContent');
    if (!modal || !content) return;
    content.innerHTML = '<div class="why-matches-product-name">' + escHtml(name) + '</div>'
      + '<div class="why-matches-reasoning">' + escHtml(reasoning) + '</div>';
    modal.style.display = 'flex';
    requestAnimationFrame(function() { modal.classList.add('is-open'); });
  }

  function closeWhyMatchesModal() {
    var modal = el('whyMatchesModal');
    if (!modal) return;
    modal.classList.remove('is-open');
    setTimeout(function() { modal.style.display = 'none'; }, 240);
  }

  document.addEventListener('click', function(e) {
    var infoBtn = e.target.closest('.discovery-card-info-btn');
    if (infoBtn) {
      openWhyMatchesModal(infoBtn.getAttribute('data-why-name'), infoBtn.getAttribute('data-why-reasoning'));
      return;
    }
    var cardQuickAdd = e.target.closest('.discovery-card-quick-add');
    if (cardQuickAdd) {
      var qId = cardQuickAdd.getAttribute('data-quick-id');
      if (qId) addQuickProductToBag(qId, cardQuickAdd);
      return;
    }
    var modal = el('whyMatchesModal');
    if (modal && modal.style.display !== 'none' && (e.target === modal || e.target.closest('[data-close-why]'))) {
      closeWhyMatchesModal();
    }
  });

  document.addEventListener('keydown', function(e) {
    var modal = el('whyMatchesModal');
    if (e.key === 'Escape' && modal && modal.style.display !== 'none') closeWhyMatchesModal();
  });

  function renderNoResultsState(grid, intent) {
    var chips = buildChipList(intent);
    var relaxChips = chips.map(function(c) {
      return '<button class="discovery-relax-chip btn-ripple" data-remove-key="' + escHtml(c.key) + '">Remove "' + escHtml(c.label) + '"</button>';
    }).join('');
    grid.innerHTML = '<div class="discovery-no-results" style="grid-column:1/-1;">'
      + '<div class="discovery-no-results-title">No exact matches found.</div>'
      + '<p class="discovery-no-results-body">Try relaxing one of your search criteria:</p>'
      + '<div class="discovery-relax-chips">' + relaxChips + '</div></div>';
  }

  function renderAiErrorState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-ai-error" style="grid-column:1/-1;">'
        + '<div class="discovery-ai-error-label">Search temporarily unavailable</div>'
        + '<div class="discovery-ai-error-message">Our intelligent search engine is calibrating. Continue with catalog search below.</div>'
        + '<button class="btn-secondary-action btn-ripple" onclick="window.NexDiscoveryUI.enableFallbackMode()">Continue with standard search</button>'
        + '</div>';
    }
  }

  function renderTimeoutState() {
    var grid = el('discoveryResultsGrid');
    if (grid) {
      grid.innerHTML = '<div class="discovery-timeout-message" style="grid-column:1/-1;">'
        + 'Request timed out. Please try a simpler search phrase.<br><br>'
        + '<button class="btn-secondary-action btn-ripple" onclick="window.NexDiscoveryUI.enableFallbackMode()">Continue with standard search</button>'
        + '</div>';
    }
  }

  function renderEmptyQueryState() {
    var grid = el('discoveryResultsGrid');
    if (grid) {
      grid.innerHTML = '<div class="discovery-empty-prompt" style="grid-column:1/-1;">Please enter a description or select a curated intent above.</div>';
    }
  }

  function renderOutOfScopeState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-out-of-scope" style="grid-column:1/-1;">'
        + 'nexCommerce AI is tailored to discovering luxury apparel, acoustics, and timepieces.<br>Describe an occasion, climate, or aesthetic to explore.</div>';
    }
  }

  function renderAmbiguousState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-out-of-scope" style="grid-column:1/-1;">'
        + '<p style="margin-bottom:16px;">What category of piece are you seeking?</p>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + '<button class="discovery-relax-chip btn-ripple" onclick="window.NexDiscoveryUI.execute(\'Cashmere Clothing\')">Apparel</button>'
        + '<button class="discovery-relax-chip btn-ripple" onclick="window.NexDiscoveryUI.execute(\'Italian Shoes\')">Footwear</button>'
        + '<button class="discovery-relax-chip btn-ripple" onclick="window.NexDiscoveryUI.execute(\'Luxury Accessories\')">Accessories</button>'
        + '<button class="discovery-relax-chip btn-ripple" onclick="window.NexDiscoveryUI.execute(\'Studio Acoustics\')">Acoustics</button>'
        + '</div></div>';
    }
  }

  function track(eventName, payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: eventName }, payload || {}));
    } catch(e) {}
  }

  // ── Main Search Execution ─────────────────────────────────────────────────

  function execute(rawQuery, isRefinement) {
    var query = (rawQuery || '').trim();
    if (!query) { renderEmptyQueryState(); return; }

    var intent = window.NexIntentParser ? NexIntentParser.parse(query) : { raw: query };

    if (intent.isOutOfScope) { renderOutOfScopeState(); return; }
    if (intent.isAmbiguous)  { renderAmbiguousState();  return; }

    if (isRefinement && Object.keys(activeIntent).length > 0) {
      activeIntent = window.NexSessionContext
        ? NexSessionContext.mergeRefinement(activeIntent, intent)
        : Object.assign({}, activeIntent, intent);
    } else {
      activeIntent = intent;
    }
    activeQuery = query;

    if (window.NexSessionContext) NexSessionContext.save(activeIntent);

    track('ai_query_submitted', { query: query, is_refinement: !!isRefinement });
    track('ai_intent_extracted', { has_occasion: !!intent.occasion, has_budget: !!intent.budget, is_banglish: !!intent.isBanglish });

    // Sync active look switcher tab if matching query
    for (var k = 0; k < DISCOVERY_CURATED_LOOKS.length; k++) {
      if (DISCOVERY_CURATED_LOOKS[k].query.toLowerCase() === query.toLowerCase()) {
        if (k !== activeLookIndex) setCuratedLook(k, true);
        break;
      }
    }

    renderProcessingState(activeIntent);
    runThinkingBar(DELAY_MS);

    clearTimeout(timeoutHandle);
    timeoutHandle = setTimeout(function() { renderTimeoutState(); }, TIMEOUT_MS);

    setTimeout(function() {
      clearTimeout(timeoutHandle);
      try {
        var result;
        if (aiFailureMode || !window.NexCatalogEngine) {
          result = window.NexCatalogEngine ? NexCatalogEngine.keywordFallback(query) : { products: [], appliedFilters: [], relaxedFilters: [], isFallback: true };
        } else {
          result = NexCatalogEngine.query(activeIntent);
        }
        renderResults(query, activeIntent, result);
        track('ai_results_displayed', { result_count: result.products.length, is_fallback: !!result.isFallback });
      } catch(e) {
        console.error('[NexDiscoveryUI]', e);
        renderAiErrorState();
        track('ai_search_error', { error: e.message });
      }
    }, DELAY_MS);
  }

  function removeContextKey(key) {
    if (!activeIntent[key]) return;
    delete activeIntent[key];
    if (window.NexSessionContext) NexSessionContext.save(activeIntent);
    track('ai_context_removed', { key: key });
    var result = window.NexCatalogEngine
      ? NexCatalogEngine.query(activeIntent)
      : { products: [], appliedFilters: [], relaxedFilters: [] };
    renderResults(activeQuery, activeIntent, result);
  }

  function reset() {
    activeIntent = {};
    activeQuery = '';
    if (window.NexSessionContext) NexSessionContext.clear();
    track('ai_search_reset', {});
    renderDefaultState();
    var input = el('discoveryMainInput');
    if (input) { input.value = ''; input.focus(); }
    var clearBtn = el('discoveryClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'none';
  }

  function enableFallbackMode() {
    aiFailureMode = true;
    if (activeQuery) execute(activeQuery, false);
  }

  function disableAIFailure() {
    aiFailureMode = false;
    var notice = el('aiFailureNotice');
    if (notice) notice.style.display = 'none';
    if (activeQuery) execute(activeQuery, false);
  }

  function toggleAIFailure() {
    aiFailureMode = !aiFailureMode;
    var notice = el('aiFailureNotice');
    if (notice) notice.style.display = aiFailureMode ? 'flex' : 'none';
    if (activeQuery) execute(activeQuery, false);
  }

  function init() {
    initLookSwitcher();
    if (window.initDiscoverySearchPageMotion) window.initDiscoverySearchPageMotion();
  }

  window.NexDiscovery = {
    toggleAIFailure: toggleAIFailure,
    disableAIFailure: disableAIFailure
  };

  window.NexDiscoveryUI = {
    init: init,
    execute: execute,
    removeContextKey: removeContextKey,
    reset: reset,
    enableFallbackMode: enableFallbackMode,
    renderDefaultState: renderDefaultState
  };

})(window);
