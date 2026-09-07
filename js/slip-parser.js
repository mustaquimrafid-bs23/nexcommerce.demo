/**
 * nexCommerce — Intelligent Shopping Slip Parser & Catalog Matcher (Capability 4)
 * Parses raw text/OCR slip data, extracts line items, quantities, size/finish hints,
 * computes fuzzy catalog match confidence, and formats 1-click cart payloads.
 */
(function(window) {
  'use strict';

  // Levenshtein distance helper
  function levenshtein(a, b) {
    var matrix = [];
    var i, j;
    for (i = 0; i <= b.length; i++) matrix[i] = [i];
    for (j = 0; j <= a.length; j++) matrix[0][j] = j;
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  function similarity(s1, s2) {
    var longer = s1.toLowerCase().trim();
    var shorter = s2.toLowerCase().trim();
    if (longer.length < shorter.length) {
      var tmp = longer; longer = shorter; shorter = tmp;
    }
    var longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - levenshtein(longer, shorter)) / parseFloat(longerLength);
  }

  function parseRawText(rawText) {
    if (!rawText || typeof rawText !== 'string') return [];
    var lines = rawText.split(/\r?\n|;/);
    var parsed = [];

    for (var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      if (!line) continue;

      // Remove leading numbering like "1.", "1)", "-", "•"
      line = line.replace(/^[\d]+[\.\)\-\:]\s*|^[\-\•\*\+]\s*/, '').trim();
      if (!line) continue;

      // Extract quantity (e.g., "2x", "2 pcs", "qty: 2", "x2", "2 pairs")
      var quantity = 1;
      var qtyMatch = line.match(/\b(\d+)\s*(?:x|pcs|pieces|pairs?|items?|units?|pkg|pack)\b/i) ||
                     line.match(/\b(?:qty|quantity)[\:\s]*(\d+)\b/i) ||
                     line.match(/^(\d+)\s*x?\s+/i) ||
                     line.match(/\s*x\s*(\d+)$/i);

      if (qtyMatch) {
        quantity = parseInt(qtyMatch[1], 10) || 1;
        line = line.replace(qtyMatch[0], ' ').trim();
      }

      // Extract size hint (e.g., "Size M", "Size 48", "EU 42", "(M)", "Medium")
      var sizeHint = null;
      var sizeMatch = line.match(/\b(?:size|eu|uk|us)[\:\s]*([a-z0-9]+)\b/i) ||
                      line.match(/\b([x|s|m|l|xl|xxl]{1,3})\b/i) ||
                      line.match(/\b(3[6-9]|4[0-8]|5[0-4])\b/);

      if (sizeMatch) {
        sizeHint = (sizeMatch[1] || sizeMatch[0]).toUpperCase();
        line = line.replace(sizeMatch[0], ' ').trim();
      }

      // Extract finish / color hint
      var colorHint = null;
      var colorMatch = line.match(/\b(black|charcoal|navy|obsidian|ivory|slate|grey|gray|white|sand|brown)\b/i);
      if (colorMatch) {
        colorHint = colorMatch[1].toLowerCase();
        line = line.replace(colorMatch[0], ' ').trim();
      }

      // Clean query tokens
      var cleanQuery = line.replace(/[\(\)\[\]\{\}\,\.]/g, ' ').replace(/\s+/g, ' ').trim();

      parsed.push({
        rawLine: lines[i].trim(),
        cleanQuery: cleanQuery,
        quantity: Math.max(1, quantity),
        sizeHint: sizeHint,
        colorHint: colorHint
      });
    }

    return parsed;
  }

  const STOP_WORDS = new Set(['size', 'eu', 'uk', 'us', 'qty', 'pcs', 'color', 'the', 'a', 'an', 'in', 'of', 'for', 'with', 'and']);

  function matchSlipToCatalog(parsedLines, catalog) {
    var cat = Array.isArray(catalog) ? catalog : [];
    var matched = [];
    var unmatched = [];

    for (var i = 0; i < parsedLines.length; i++) {
      var item = parsedLines[i];
      var queryTerms = item.cleanQuery.toLowerCase().split(/\s+/).filter(function(t) {
        return t.length > 1 && !STOP_WORDS.has(t);
      });
      var scored = [];

      for (var c = 0; c < cat.length; c++) {
        var prod = cat[c];
        var prodName = (prod.name || prod.title || '').toLowerCase();
        var prodCategory = (prod.category || prod.categoryLabel || '').toLowerCase();
        var prodKeywords = (prod.keywords || []).join(' ').toLowerCase();
        var prodDesc = (prod.desc || prod.reason || '').toLowerCase();
        var haystack = prodName + ' ' + prodCategory + ' ' + prodKeywords + ' ' + prodDesc;

        // Token overlap score
        var overlap = 0;
        for (var t = 0; t < queryTerms.length; t++) {
          if (haystack.includes(queryTerms[t])) overlap += 1;
        }
        var tokenScore = queryTerms.length > 0 ? (overlap / queryTerms.length) : 0;

        // Direct Levenshtein similarity on product name
        var simScore = similarity(item.cleanQuery, prodName);

        // Combined confidence score
        var score = Math.max(tokenScore * 0.7 + simScore * 0.3, simScore);

        scored.push({
          product: prod,
          score: score
        });
      }

      scored.sort(function(a, b) { return b.score - a.score; });

      var best = scored[0];
      if (best && best.score >= 0.45) {
        var isAmbiguous = false;
        var alternatives = [];

        // Check if top 2 candidates are very close in score
        if (scored.length > 1 && scored[1].score >= 0.4 && (best.score - scored[1].score) < 0.15) {
          isAmbiguous = true;
          alternatives = scored.slice(0, 3).map(function(s) { return s.product; });
        }

        // Determine best variant match
        var selectedSize = item.sizeHint || 'M';
        if (best.product.variants && Array.isArray(best.product.variants.sizes)) {
          var avail = best.product.variants.sizes.find(function(s) {
            var sName = (s.name || s.id || '').toUpperCase();
            var sId = (s.id || s.name || '').toUpperCase();
            var target = (item.sizeHint || '').toUpperCase();
            return target && (sName === target || sId === target);
          });
          if (avail) selectedSize = avail.id || avail.name;
          else if (best.product.variants.sizes[0]) selectedSize = best.product.variants.sizes[0].id || best.product.variants.sizes[0].name;
        }

        matched.push({
          rawLine: item.rawLine,
          cleanQuery: item.cleanQuery,
          quantity: item.quantity,
          selectedSize: selectedSize,
          selectedFinish: item.colorHint || (best.product.selectedFinish || 'Standard'),
          confidence: parseFloat(best.score.toFixed(2)),
          product: best.product,
          isAmbiguous: isAmbiguous,
          alternatives: alternatives
        });
      } else {
        unmatched.push({
          rawLine: item.rawLine,
          cleanQuery: item.cleanQuery,
          quantity: item.quantity
        });
      }
    }

    return {
      matched: matched,
      unmatched: unmatched,
      totalLines: parsedLines.length
    };
  }

  function buildCartPayload(matchedItems) {
    if (!Array.isArray(matchedItems)) return [];
    return matchedItems.map(function(m) {
      return {
        id: m.product.id,
        name: m.product.name || m.product.title,
        price: m.product.numericPrice || m.product.price,
        image: m.product.image || m.product.img,
        category: m.product.category || m.product.categoryLabel || 'Apparel',
        quantity: m.quantity,
        variant: m.selectedSize || 'Standard',
        finish: m.selectedFinish || 'Standard'
      };
    });
  }

  window.NexSlipParser = {
    parseRawText: parseRawText,
    matchSlipToCatalog: matchSlipToCatalog,
    buildCartPayload: buildCartPayload,
    similarity: similarity
  };

})(typeof window !== 'undefined' ? window : global);
