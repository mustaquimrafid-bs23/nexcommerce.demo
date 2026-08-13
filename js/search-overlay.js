(function(window) {
  'use strict';

  var overlay = null;
  var input = null;
  var resultsContainer = null;
  var isOpen = false;

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function buildChipList(intent) {
    var chips = [];
    if (!intent) return chips;
    if (intent.occasion) chips.push({ key: 'occasion', label: intent.occasion.value });
    if (intent.climate)  chips.push({ key: 'climate',  label: intent.climate.value  });
    if (intent.location) chips.push({ key: 'location', label: intent.location.value });
    if (intent.budget)   chips.push({ key: 'budget',   label: 'Under BDT ' + intent.budget.max.toLocaleString() });
    return chips;
  }

  function openOverlay() {
    if (!overlay) return;
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
        + '<div style="font-family:var(--font-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:10px;">PARSING INTENT...</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + chips.map(function(c) { return '<span class="intent-chip discovery-parsing-chip">' + escHtml(c.label) + '</span>'; }).join('')
        + '</div></div>'
      : '';

    resultsContainer.innerHTML = '<div style="padding:32px 0;text-align:center;">'
      + '<span style="font-family:var(--font-body);font-size:13px;color:var(--text-secondary);">Understanding your request…</span>'
      + chipHtml + '</div>';

    setTimeout(function() {
      if (window.NexSessionContext) NexSessionContext.save(intent);

      var result = window.NexCatalogEngine
        ? NexCatalogEngine.query(intent)
        : { products: [], appliedFilters: [], relaxedFilters: [] };

      if (result.products.length === 0) {
        resultsContainer.innerHTML = '<div style="padding:24px 0;text-align:center;font-family:var(--font-body);font-size:13px;color:var(--text-secondary);">'
          + 'No products found. <a href="discovery.html?q=' + encodeURIComponent(query) + '" style="color:var(--accent-cyan);">Search on discovery page →</a></div>';
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
          + '<div class="ai-card-img-wrap"><img src="' + escHtml(p.img || p.image || '') + '" alt="' + escHtml(p.title || p.name || '') + '" /></div>'
          + '<div class="ai-card-details">'
          + '<span class="match-indicator-badge">' + escHtml(p.matchBadge || 'Match') + '</span>'
          + '<h4 style="font-family:var(--font-serif);font-size:20px;font-weight:500;margin:4px 0;">' + escHtml(p.title || p.name || '') + '</h4>'
          + '<div class="ai-card-price">' + escHtml(p.formattedPrice || 'BDT ' + (p.numericPrice || '').toLocaleString()) + '</div>'
          + '</div>'
          + '<div style="margin-top:10px;">'
          + '<button class="btn-primary-commerce btn-view-product" data-id="' + escHtml(p.id) + '" style="width:100%;height:40px;">VIEW PRODUCT</button>'
          + '</div></div>';
      }).join('');

      resultsContainer.innerHTML = chipsHtml
        + '<div class="search-results-grid">' + cardsHtml + '</div>'
        + '<div style="text-align:center;margin-top:16px;"><a href="discovery.html?q=' + encodeURIComponent(query) + '" style="font-family:var(--font-body);font-size:12px;color:var(--accent-cyan);">See all results →</a></div>';

      resultsContainer.querySelectorAll('.btn-view-product').forEach(function(btn) {
        btn.addEventListener('click', function() {
          var pid = btn.getAttribute('data-id');
          closeOverlay();
          window.location.href = 'product.html?id=' + pid;
        });
      });
    }, 800);
  }

  function init() {
    overlay          = document.getElementById('aiSearchModal');
    input            = document.querySelector('.search-ai-input');
    resultsContainer = document.getElementById('aiSearchResults');
    if (!overlay || !input) return;

    // Open via nav search
    document.querySelectorAll('[data-open-search], #navSearchBtn').forEach(function(btn) {
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
    if (resultsContainer) {
      resultsContainer.addEventListener('click', function(e) {
        var promptBtn = e.target.closest('[data-prompt]');
        if (promptBtn) { input.value = promptBtn.getAttribute('data-prompt'); execute(input.value); }
      });
    }

    document.addEventListener('keydown', function(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); openOverlay(); }
      if (e.key === 'Escape' && isOpen) closeOverlay();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
  window.NexSearchOverlay = { open: openOverlay, close: closeOverlay };

})(window);
