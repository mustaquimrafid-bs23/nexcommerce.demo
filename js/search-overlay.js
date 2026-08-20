(function(window) {
  'use strict';

  var overlay = null;
  var input = null;
  var resultsContainer = null;
  var thinkingTrack = null;
  var thinkingBar = null;
  var isOpen = false;

  var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isTouch = window.matchMedia('(max-width: 767px)').matches || ('ontouchstart' in window);

  var IDLE_PROMPTS = [
    'Something comfortable for a long flight',
    'An outfit for a dinner in Milan',
    'Something warm but not bulky',
    'Minimal everyday sneakers'
  ];

  function renderIdleState() {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = '<div class="discovery-example-prompts" style="justify-content:center;">'
      + '<span class="discovery-prompts-label">Try asking</span>'
      + '<div class="discovery-prompts-list">'
      + IDLE_PROMPTS.map(function(p) { return '<button class="discovery-prompt-chip" data-prompt="' + escHtml(p) + '">' + escHtml(p) + '</button>'; }).join('')
      + '</div></div>';
  }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildChipList(intent) {
    var chips = [];
    if (!intent) return chips;
    if (intent.occasion) chips.push({ key: 'occasion', label: intent.occasion.value });
    if (intent.climate)  chips.push({ key: 'climate',  label: intent.climate.value  });
    if (intent.location) chips.push({ key: 'location', label: intent.location.value });
    if (intent.budget)   chips.push({ key: 'budget',   label: 'Under € ' + intent.budget.max.toLocaleString() });
    return chips;
  }

  // ── Motion Standard 1: tactile ripple (shared pointerdown pattern) ─────────
  function attachRipple(btn, e) {
    if (!btn) return;
    var rect = btn.getBoundingClientRect();
    var ripple = document.createElement('span');
    ripple.className = 'card-ripple';
    var size = Math.max(rect.width, rect.height);
    ripple.style.width = size + 'px';
    ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    setTimeout(function() { ripple.remove(); }, 450);
  }

  document.addEventListener('pointerdown', function(e) {
    if (!overlay || !overlay.classList.contains('active')) return;
    var target = e.target.closest('.btn-view-product, .discovery-prompt-chip, [data-prompt].search-prompt-btn');
    if (target) attachRipple(target, e);
  });

  // ── Motion Standard 3: GPU curtain cross-dissolve page transition ──────────
  function triggerPageTransition(href) {
    var curtain = document.getElementById('pageTransitionOverlay');
    if (!curtain || !href) {
      if (href) window.location.href = href;
      return;
    }
    curtain.style.transition = 'opacity 200ms ease';
    curtain.style.opacity = '1';
    curtain.style.pointerEvents = 'all';
    setTimeout(function() { window.location.href = href; }, 210);
  }

  // ── Motion Standard 2: 3D spring tilt + dynamic specular glare ─────────────
  function bindResultCardMotion(cards) {
    if (prefersReduced || isTouch) return;
    var MAX_TILT = 5;
    var lerp = function(a, b, t) { return a + (b - a) * t; };

    cards.forEach(function(card) {
      var curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0, rafId = null;

      function applyTilt() {
        curTX = lerp(curTX, tgtTX, 0.14);
        curTY = lerp(curTY, tgtTY, 0.14);
        card.style.transform = 'perspective(900px) rotateX(' + curTX.toFixed(2) + 'deg) rotateY(' + curTY.toFixed(2) + 'deg) translateZ(6px)';
        if (Math.abs(curTX - tgtTX) > 0.02 || Math.abs(curTY - tgtTY) > 0.02) {
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = null;
        }
      }

      card.addEventListener('mousemove', function(e) {
        var r = card.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        var dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tgtTX = -(dy * MAX_TILT);
        tgtTY = (dx * MAX_TILT);

        var gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        var gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        card.style.setProperty('--search-glare-x', gx);
        card.style.setProperty('--search-glare-y', gy);
        card.style.setProperty('--search-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', function() {
        tgtTX = 0; tgtTY = 0;
        card.style.setProperty('--search-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.18);
          curTY = lerp(curTY, 0, 0.18);
          card.style.transform = 'perspective(900px) rotateX(' + curTX.toFixed(2) + 'deg) rotateY(' + curTY.toFixed(2) + 'deg) translateZ(0px)';
          if (Math.abs(curTX) > 0.03 || Math.abs(curTY) > 0.03) {
            rafId = requestAnimationFrame(springBack);
          } else {
            card.style.transform = '';
            rafId = null;
          }
        }
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(springBack);
      });
    });
  }

  function bindResultNavigation(root) {
    root.querySelectorAll('.btn-view-product').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var pid = btn.getAttribute('data-id');
        closeOverlay();
        triggerPageTransition(_resolvePage('product.html') + '?id=' + pid);
      });
    });
    root.querySelectorAll('.see-all-results-link').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        closeOverlay();
        triggerPageTransition(link.getAttribute('href'));
      });
    });
  }

  // ── Motion Standard 1: 120fps GPU "thinking" progress line ─────────────────
  // The rAF loop only drives the cosmetic bar fill — completion is a plain
  // setTimeout so results still render on schedule even if the tab is
  // backgrounded and rAF gets throttled/paused.
  function runThinkingBar(durationMs, onDone) {
    if (thinkingTrack && thinkingBar) {
      thinkingTrack.classList.add('active');
      thinkingBar.style.transition = 'none';
      thinkingBar.style.transform = 'scaleX(0)';
      var start = null;
      var done = false;

      function step(ts) {
        if (done) return;
        if (!start) start = ts;
        var progress = Math.min((ts - start) / durationMs, 1);
        thinkingBar.style.transform = 'scaleX(' + progress.toFixed(3) + ')';
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);

      setTimeout(function() {
        done = true;
        thinkingTrack.classList.remove('active');
      }, durationMs);
    }
    setTimeout(onDone, durationMs);
  }

  function openOverlay() {
    if (!overlay) return;
    if (!input || !input.value.trim()) renderIdleState();
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    setTimeout(function() { if (input) input.focus(); }, 150);
  }

  function closeOverlay() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    isOpen = false;
  }

  function execute(rawQuery) {
    var query = (rawQuery || '').trim();
    if (!query || !resultsContainer) return;

    var intent = window.NexIntentParser ? NexIntentParser.parse(query) : { raw: query };
    var chips = buildChipList(intent);

    var chipHtml = chips.length > 0
      ? '<div style="margin-top:20px;text-align:center;">'
        + '<div style="font-family:var(--font-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:10px;">PARSING INTENT&hellip;</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + chips.map(function(c) { return '<span class="intent-chip discovery-parsing-chip">' + escHtml(c.label) + '</span>'; }).join('')
        + '</div></div>'
      : '';

    resultsContainer.innerHTML = '<div style="padding:28px 0 8px;text-align:center;">'
      + '<span style="font-family:var(--font-body);font-size:13px;color:var(--text-secondary);">Understanding your request&hellip;</span>'
      + chipHtml + '</div>';

    runThinkingBar(800, function() {
      if (window.NexSessionContext) NexSessionContext.save(intent);

      var result = window.NexCatalogEngine
        ? NexCatalogEngine.query(intent)
        : { products: [], appliedFilters: [], relaxedFilters: [] };

      if (result.products.length === 0) {
        resultsContainer.innerHTML = '<div style="padding:24px 0;text-align:center;font-family:var(--font-body);font-size:13px;color:var(--text-secondary);">'
          + 'No products found. <a href="' + _resolvePage('discovery.html') + '?q=' + encodeURIComponent(query) + '" class="see-all-results-link" style="color:var(--accent-cyan);">Search on discovery page &rarr;</a></div>';
        bindResultNavigation(resultsContainer);
        return;
      }

      var chipsHtml = chips.length > 0
        ? '<div style="margin-bottom:16px;">'
          + '<div style="font-family:var(--font-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--text-secondary);margin-bottom:8px;">UNDERSTOOD AS</div>'
          + '<div style="display:flex;flex-wrap:wrap;gap:6px;">'
          + chips.map(function(c) { return '<span class="intent-chip">' + escHtml(c.label) + '</span>'; }).join('')
          + '</div></div>'
        : '';

      var cardsHtml = result.products.slice(0, 4).map(function(p) {
        return '<div class="ai-recommendation-card">'
          + '<div class="search-card-specular" aria-hidden="true"></div>'
          + '<div class="ai-card-img-wrap"><img src="' + escHtml(p.img || p.image || '') + '" alt="' + escHtml(p.title || p.name || '') + '" loading="lazy" /></div>'
          + '<div class="ai-card-details">'
          + '<span class="match-indicator-badge">' + escHtml(p.matchBadge || 'Match') + '</span>'
          + '<h4 class="ai-card-title">' + escHtml(p.title || p.name || '') + '</h4>'
          + '<div class="ai-card-price tabular-nums">' + escHtml(p.formattedPrice || ('€ ' + Number(p.numericPrice || 0).toFixed(2))) + '</div>'
          + '</div>'
          + '<div class="ai-card-actions">'
          + '<button class="btn-primary-commerce btn-view-product" data-id="' + escHtml(p.id) + '" style="width:100%;height:40px;">VIEW PRODUCT</button>'
          + '</div></div>';
      }).join('');

      resultsContainer.innerHTML = chipsHtml
        + '<div class="search-results-grid">' + cardsHtml + '</div>'
        + '<div style="text-align:center;margin-top:16px;"><a href="' + _resolvePage('discovery.html') + '?q=' + encodeURIComponent(query) + '" class="see-all-results-link" style="font-family:var(--font-body);font-size:12px;color:var(--accent-cyan);">See all results &rarr;</a></div>';

      var cardEls = Array.from(resultsContainer.querySelectorAll('.ai-recommendation-card'));
      if (!prefersReduced && window.animate && window.stagger) {
        window.animate(cardEls,
          { opacity: [0, 1], y: [16, 0], scale: [0.97, 1] },
          { delay: window.stagger(0.06), duration: 0.5, easing: [0.16, 1, 0.3, 1] }
        );
      }
      bindResultCardMotion(cardEls);
      bindResultNavigation(resultsContainer);
    });
  }

  function init() {
    overlay          = document.getElementById('aiSearchModal');
    input            = document.querySelector('.search-ai-input');
    resultsContainer = document.getElementById('aiSearchResults') || document.getElementById('aiSearchResultsModal');
    if (!overlay || !input) return;

    // Inject a 120fps GPU "thinking" progress line beneath the search input
    var headerBar = overlay.querySelector('.search-header-bar');
    if (headerBar && !overlay.querySelector('.nex-thinking-track')) {
      thinkingTrack = document.createElement('div');
      thinkingTrack.className = 'nex-thinking-track';
      thinkingTrack.setAttribute('aria-hidden', 'true');
      thinkingBar = document.createElement('div');
      thinkingBar.className = 'nex-thinking-bar';
      thinkingTrack.appendChild(thinkingBar);
      headerBar.insertAdjacentElement('afterend', thinkingTrack);
    }

    // Open via nav search
    document.querySelectorAll('[data-open-search], #navSearchBtn, #searchTriggerBtn, .search-trigger').forEach(function(btn) {
      btn.addEventListener('click', openOverlay);
    });

    var closeBtn = overlay.querySelector('.search-close-btn');
    var backdrop = overlay.querySelector('.search-backdrop');
    if (closeBtn) closeBtn.addEventListener('click', closeOverlay);
    if (backdrop) backdrop.addEventListener('click', closeOverlay);

    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') { e.preventDefault(); execute(input.value); }
    });

    var submitBtn = overlay.querySelector('.btn-search-submit');
    if (submitBtn) submitBtn.addEventListener('click', function() { execute(input.value); });

    // Prompt chips inside overlay
    overlay.addEventListener('click', function(e) {
      var promptBtn = e.target.closest('[data-prompt]');
      if (promptBtn) { input.value = promptBtn.getAttribute('data-prompt'); execute(input.value); }
    });

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openOverlay(); }
      if (e.key === 'Escape' && isOpen) closeOverlay();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.NexSearchOverlay = { open: openOverlay, close: closeOverlay };

})(window);
