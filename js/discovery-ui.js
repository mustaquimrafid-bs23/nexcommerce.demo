(function(window) {
  'use strict';

  var TIMEOUT_MS = 5000;
  var DELAY_MS = 800;
  var activeIntent = {};
  var activeQuery = '';
  var timeoutHandle = null;
  var aiFailureMode = false;

  function el(id) { return document.getElementById(id); }

  function escHtml(s) {
    return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
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
    if (intent.budget)   chips.push({ key: 'budget',   label: 'Under BDT ' + intent.budget.max.toLocaleString() });
    if (intent.recipient) chips.push({ key: 'recipient', label: 'For ' + intent.recipient.value });
    return chips;
  }

  // State 1: Default
  function renderDefaultState() {
    var section = el('discoveryResultsSection');
    var contextBar = el('discoveryContextBar');
    var refinementBar = el('discoveryRefinementBar');
    if (section) section.style.display = 'none';
    if (contextBar) contextBar.style.display = 'none';
    if (refinementBar) refinementBar.style.display = 'none';
  }

  // State 5: Processing
  function renderProcessingState(intent) {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) {
      section.style.display = 'block';
      setTimeout(function() {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }

    var chips = buildChipList(intent);
    var chipHtml = '';
    if (chips.length > 0) {
      chipHtml = '<div style="margin-top:24px;text-align:center;">'
        + '<div style="font-family:var(--font-body);font-size:10px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:var(--accent-cyan);margin-bottom:12px;">PARSING INTENT...</div>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + chips.map(function(c) { return '<span class="intent-chip discovery-parsing-chip">' + escHtml(c.label) + '</span>'; }).join('')
        + '</div></div>';
    }

    if (grid) {
      grid.innerHTML = '<div class="discovery-processing" style="grid-column:1/-1;padding:40px 0;text-align:center;">'
        + '<div class="discovery-processing-dots"><div class="discovery-processing-dot"></div><div class="discovery-processing-dot"></div><div class="discovery-processing-dot"></div></div>'
        + '<span class="discovery-processing-text">Understanding your request…</span>'
        + chipHtml + '</div>';
    }
  }

  // State 6+7: Results with Context Display
  function renderResults(query, intent, catalogResult) {
    var products = catalogResult.products;
    var relaxedFilters = catalogResult.relaxedFilters || [];
    var isFallback = catalogResult.isFallback;
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
          + '<svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>'
          + '</button></span>';
      }).join('');
    } else if (contextBar) {
      contextBar.style.display = 'none';
    }

    if (header) {
      var relaxNote = relaxedFilters.length > 0 ? '<div style="font-family:var(--font-body);font-size:12px;color:var(--accent-pink);margin-top:6px;">Budget relaxed &mdash; no exact matches found.</div>' : '';
      var fallNote  = isFallback ? '<div style="font-family:var(--font-body);font-size:12px;color:var(--text-secondary);margin-top:6px;">AI unavailable &mdash; showing keyword matches.</div>' : '';
      header.innerHTML = products.length > 0
        ? '<span class="discovery-results-eyebrow">Results for your request</span>'
          + '<div class="discovery-results-query">"' + escHtml(query) + '"</div>'
          + '<div class="discovery-results-count">' + products.length + ' item' + (products.length !== 1 ? 's' : '') + ' found</div>'
          + relaxNote + fallNote
        : '';
    }

    if (!grid) return;

    if (products.length === 0) {
      renderNoResultsState(grid, intent);
      if (refinementBar) refinementBar.style.display = 'none';
      return;
    }

    grid.innerHTML = products.map(function(p, i) {
      return '<div class="discovery-card" style="animation-delay:' + (i * 60) + 'ms;">'
        + '<div class="discovery-card-image">'
        + '<img src="' + escHtml(p.img || p.image || '') + '" alt="' + escHtml(p.title || p.name || '') + '" loading="lazy" />'
        + '<span class="discovery-card-match-badge">' + escHtml(p.matchBadge || 'Match') + '</span>'
        + '</div>'
        + '<div class="discovery-card-body">'
        + '<span class="discovery-card-category">' + escHtml(p.category || '') + '</span>'
        + '<h2 class="discovery-card-name">' + escHtml(p.title || p.name || '') + '</h2>'
        + '<div class="discovery-card-price">' + escHtml(p.formattedPrice || 'BDT ' + (p.numericPrice || '').toLocaleString()) + '</div>'
        + '<div class="discovery-card-reasoning">'
        + '<div class="discovery-card-reasoning-label">Why it fits</div>'
        + '<div class="discovery-card-reasoning-text">' + escHtml(p.reasoning || p.desc || '') + '</div>'
        + '</div></div>'
        + '<div class="discovery-card-actions">'
        + '<button class="btn-primary-commerce discovery-view-btn" data-product-id="' + escHtml(p.id) + '" aria-label="View ' + escHtml(p.title || p.name || '') + '">VIEW PRODUCT</button>'
        + '</div></div>';
    }).join('');

    if (refinementBar) refinementBar.style.display = 'flex';
  }

  // State 10: No Results
  function renderNoResultsState(grid, intent) {
    var chips = buildChipList(intent);
    var relaxChips = chips.map(function(c) {
      return '<button class="discovery-relax-chip" data-remove-key="' + escHtml(c.key) + '">Remove "' + escHtml(c.label) + '"</button>';
    }).join('');
    grid.innerHTML = '<div class="discovery-no-results" style="grid-column:1/-1;">'
      + '<div class="discovery-no-results-title">No exact matches found.</div>'
      + '<p class="discovery-no-results-body">Try relaxing one of these filters:</p>'
      + '<div class="discovery-relax-chips">' + relaxChips + '</div></div>';
  }

  // State 11: AI Error
  function renderAiErrorState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-ai-error" style="grid-column:1/-1;">'
        + '<div class="discovery-ai-error-label">Search temporarily unavailable</div>'
        + '<div class="discovery-ai-error-message">Our intelligent search is taking a moment. Continue with keyword search below.</div>'
        + '<button class="btn-secondary-action" onclick="window.NexDiscoveryUI.enableFallbackMode()">Continue with standard search</button>'
        + '</div>';
    }
  }

  // State 12: Timeout
  function renderTimeoutState() {
    var grid = el('discoveryResultsGrid');
    if (grid) {
      grid.innerHTML = '<div class="discovery-timeout-message" style="grid-column:1/-1;">'
        + 'We couldn\'t process that request right now. Try a simpler search.<br><br>'
        + '<button class="btn-secondary-action" onclick="window.NexDiscoveryUI.enableFallbackMode()">Continue with standard search</button>'
        + '</div>';
    }
  }

  // State 13: Empty Query
  function renderEmptyQueryState() {
    var grid = el('discoveryResultsGrid');
    if (grid) {
      grid.innerHTML = '<div class="discovery-empty-prompt" style="grid-column:1/-1;">Please describe what you\'re looking for.</div>';
    }
  }

  // State: Out of Scope (spec §29)
  function renderOutOfScopeState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-out-of-scope" style="grid-column:1/-1;">'
        + 'I\'m here to help you discover products.<br>Describe what you\'re shopping for &mdash; occasion, style, or budget.</div>';
    }
  }

  // State: Ambiguous (spec §25)
  function renderAmbiguousState() {
    var grid = el('discoveryResultsGrid');
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'block';
    if (grid) {
      grid.innerHTML = '<div class="discovery-out-of-scope" style="grid-column:1/-1;">'
        + '<p style="margin-bottom:16px;">What are you shopping for?</p>'
        + '<div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;">'
        + '<button class="discovery-relax-chip" onclick="window.NexDiscoveryUI.execute(\'Clothing\')">Clothing</button>'
        + '<button class="discovery-relax-chip" onclick="window.NexDiscoveryUI.execute(\'Shoes\')">Shoes</button>'
        + '<button class="discovery-relax-chip" onclick="window.NexDiscoveryUI.execute(\'Accessories\')">Accessories</button>'
        + '<button class="discovery-relax-chip" onclick="window.NexDiscoveryUI.execute(\'Audio\')">Audio</button>'
        + '</div></div>';
    }
  }

  // Analytics
  function track(eventName, payload) {
    try {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(Object.assign({ event: eventName }, payload || {}));
    } catch(e) {}
  }

  // Main Execute
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

    renderProcessingState(activeIntent);

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

  // State 8: Context Editing
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

  // State 14: New Search
  function reset() {
    activeIntent = {};
    activeQuery = '';
    if (window.NexSessionContext) NexSessionContext.clear();
    track('ai_search_reset', {});
    renderDefaultState();
    var input = el('discoveryMainInput');
    if (input) { input.value = ''; input.focus(); }
    var section = el('discoveryResultsSection');
    if (section) section.style.display = 'none';
  }

  function enableFallbackMode() {
    aiFailureMode = true;
    if (activeQuery) execute(activeQuery, false);
  }

  window.NexDiscoveryUI = {
    execute: execute,
    removeContextKey: removeContextKey,
    reset: reset,
    enableFallbackMode: enableFallbackMode,
    renderDefaultState: renderDefaultState
  };

})(window);
