(function(window) {
  'use strict';

  function evaluateMatch(intent, product) {
    if (!intent || !product) return null;

    var claims = [];
    var isMatch = false;

    // Budget match
    if (intent.budget && intent.budget.max) {
      var price = product.numericPrice || product.price || 0;
      if (price <= intent.budget.max) {
        claims.push('within your BDT ' + intent.budget.max.toLocaleString() + ' budget');
        isMatch = true;
      }
    }

    // Category match
    if (intent.category && intent.category.value) {
      var cat = intent.category.value.toLowerCase();
      var pCat = (product.category || '').toLowerCase();
      if (pCat.includes(cat)) {
        claims.push(intent.category.value.toLowerCase());
        isMatch = true;
      }
    }

    // Color match
    if (intent.color && intent.color.value) {
      var col = intent.color.value.toLowerCase();
      var haystack = [(product.keywords || []).join(' '), product.desc || '', product.title || product.name || ''].join(' ').toLowerCase();
      if (haystack.includes(col)) {
        claims.push(intent.color.value.toLowerCase() + ' design');
        isMatch = true;
      }
    }

    // Style/Occasion match
    var styleOccasion = [];
    if (intent.occasion && intent.occasion.value) {
      var occ = intent.occasion.value.toLowerCase().split('/')[0].trim();
      var haystack2 = [(product.keywords || []).join(' '), product.desc || ''].join(' ').toLowerCase();
      if (haystack2.includes(occ)) {
        styleOccasion.push('suitable for ' + occ + ' wear');
        isMatch = true;
      }
    }
    
    if (intent.style && intent.style.value) {
      var st = intent.style.value.toLowerCase();
      var haystack3 = [(product.keywords || []).join(' '), product.desc || ''].join(' ').toLowerCase();
      if (haystack3.includes(st)) {
        styleOccasion.push('matches your ' + st + ' preference');
        isMatch = true;
      }
    }

    if (!isMatch) return null;

    // Construct grounded explanation
    var explanation = '';
    if (claims.length > 0) {
      explanation += claims.join(', ').replace(/, ([^,]*)$/, ' and $1');
    } else {
      explanation += 'Product';
    }

    if (styleOccasion.length > 0) {
      explanation += ' which is ' + styleOccasion.join(' and ') + '.';
    } else {
      explanation += '.';
    }

    // Capitalize first letter
    explanation = explanation.charAt(0).toUpperCase() + explanation.slice(1);

    return {
      isMatch: true,
      explanation: explanation
    };
  }

  function getAlternativeRecommendations(intent, currentProductId) {
    if (!intent || !window.NexCatalogEngine) return [];
    
    var result = window.NexCatalogEngine.query(intent);
    var filtered = result.products.filter(function(p) { return p.id !== currentProductId; });
    return filtered.slice(0, 4);
  }

  window.NexContextEngine = {
    evaluateMatch: evaluateMatch,
    getAlternativeRecommendations: getAlternativeRecommendations
  };

})(window);
