(function(window) {
  'use strict';

  function query(intentObj, refinementContext) {
    var catalog = (window.NexAI && window.NexAI.catalogArray) ? window.NexAI.catalogArray : [];
    if (catalog.length === 0) return { products: [], appliedFilters: [], relaxedFilters: [] };

    var intent = intentObj || {};
    var pool = catalog.slice();
    var appliedFilters = [];
    var relaxedFilters = [];

    // Hard filter: Budget
    var budget = intent.budget;
    if (budget && budget.max) {
      var before = pool.length;
      pool = pool.filter(function(p) { return (p.numericPrice || p.price || 0) <= budget.max; });
      if (pool.length < before) appliedFilters.push('Under BDT ' + budget.max.toLocaleString());
      if (pool.length === 0) {
        pool = catalog.filter(function(p) { return (p.numericPrice || p.price || 0) <= budget.max * 1.4; });
        relaxedFilters.push('Budget relaxed to BDT ' + Math.round(budget.max * 1.4).toLocaleString());
      }
    }

    // Hard filter: Category (explicit only)
    if (intent.category && intent.category.source === 'explicit') {
      var cat = intent.category.value.toLowerCase();
      var catPool = pool.filter(function(p) { return (p.category || '').toLowerCase().includes(cat); });
      if (catPool.length > 0) { pool = catPool; appliedFilters.push(intent.category.value); }
    }

    // Hard filter: Color (explicit only)
    if (intent.color && intent.color.source === 'explicit') {
      var col = intent.color.value.toLowerCase();
      var colPool = pool.filter(function(p) {
        var haystack = [(p.keywords || []).join(' '), p.desc || '', p.title || p.name || ''].join(' ').toLowerCase();
        return haystack.includes(col);
      });
      if (colPool.length > 0) { pool = colPool; appliedFilters.push(intent.color.value); }
    }

    // Soft ranking
    var scored = pool.map(function(p) {
      var score = 0.5;
      var kw = (p.keywords || []).join(' ').toLowerCase();
      var desc = (p.desc || p.reasoning || '').toLowerCase();

      if (intent.occasion) {
        var occ = intent.occasion.value.toLowerCase().split('/')[0].trim();
        if (kw.includes(occ) || desc.includes(occ)) score += intent.occasion.confidence === 'high' ? 0.3 : 0.15;
      }
      if (intent.climate) {
        var words = intent.climate.value.toLowerCase().split(' ');
        words.forEach(function(w) { if (kw.includes(w) || desc.includes(w)) score += 0.12; });
      }
      if (intent.location) {
        if (kw.includes('dhaka') || desc.includes('dhaka')) score += 0.1;
      }
      if (intent.style && intent.style.confidence !== 'low') {
        var st = intent.style.value.toLowerCase();
        if (kw.includes(st) || desc.includes(st)) score += intent.style.confidence === 'high' ? 0.2 : 0.08;
      }
      if (intent.raw) {
        var terms = intent.raw.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 2; });
        terms.forEach(function(t) {
          if (kw.includes(t) || (p.title || p.name || '').toLowerCase().includes(t)) score += 0.05;
        });
      }

      // Feature 3: AI Style Profile Soft Signals (AC-11)
      if (window.NexStyleProfile) {
        var profile = window.NexStyleProfile.getActiveProfile();
        if (profile) {
          // Rule AC-10: Current explicit intent priority. If intent has explicit color, don't let profile color override it.
          // But as soft signals, we just add minor boosts.
          if (profile.stylePreferences) {
            profile.stylePreferences.forEach(function(pst) { if (kw.includes(pst) || desc.includes(pst)) score += 0.05; });
          }
          if (profile.colorPreferences) {
            profile.colorPreferences.forEach(function(pcl) { 
              // Only boost color if not directly contradicted by explicit search (though a small boost is harmless if it's sorting below hard matches)
              if (kw.includes(pcl) || desc.includes(pcl)) score += 0.04; 
            });
          }
          if (profile.lifestylePreferences) {
            profile.lifestylePreferences.forEach(function(pls) { if (kw.includes(pls) || desc.includes(pls)) score += 0.05; });
          }
          if (profile.fitPreference) {
            if (kw.includes(profile.fitPreference) || desc.includes(profile.fitPreference)) score += 0.06;
          }
        }
      }

      return Object.assign({}, p, { _score: Math.min(0.99, score) });
    });

    scored.sort(function(a, b) { return b._score - a._score; });
    return { products: scored, appliedFilters: appliedFilters, relaxedFilters: relaxedFilters };
  }

  function keywordFallback(rawQuery) {
    var catalog = (window.NexAI && window.NexAI.catalogArray) ? window.NexAI.catalogArray : [];
    if (!rawQuery) return { products: catalog, appliedFilters: [], relaxedFilters: [], isFallback: true };
    var terms = rawQuery.toLowerCase().split(/\s+/).filter(function(t) { return t.length > 2; });
    var matched = catalog.filter(function(p) {
      var haystack = [p.title || p.name || '', p.category || '', (p.keywords || []).join(' ')].join(' ').toLowerCase();
      return terms.some(function(t) { return haystack.includes(t); });
    });
    return { products: matched.length > 0 ? matched : catalog, appliedFilters: [], relaxedFilters: [], isFallback: true };
  }

  window.NexCatalogEngine = { query: query, keywordFallback: keywordFallback };

})(window);
