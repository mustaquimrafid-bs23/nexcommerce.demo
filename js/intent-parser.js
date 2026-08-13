(function(window) {
  'use strict';

  const OCCASION_MAP = [
    { pattern: /dinner|evening out|date|restaurant|gala|rooftop/,     value: 'Dinner / Evening',  source: 'explicit', confidence: 'high' },
    { pattern: /flight|travel|vacation|trip|journey|airport/,          value: 'Travel',            source: 'explicit', confidence: 'high' },
    { pattern: /work|office|meeting|professional|presentation/,        value: 'Work / Office',     source: 'explicit', confidence: 'high' },
    { pattern: /casual|weekend|everyday|daily|errand/,                 value: 'Everyday / Casual', source: 'explicit', confidence: 'high' },
    { pattern: /gift|present|birthday|brother|sister|friend|him|her/, value: 'Gift',              source: 'explicit', confidence: 'high' },
    { pattern: /evening|night|sunset|after dark/,                      value: 'Evening',           source: 'explicit', confidence: 'high' },
    { pattern: /wedding|ceremony|formal event/,                        value: 'Formal Event',      source: 'explicit', confidence: 'high' },
  ];

  const CLIMATE_MAP = [
    { pattern: /winter|cold|cool|18\.c|chilly|freeze/,  value: 'Cool weather', source: 'explicit', confidence: 'high' },
    { pattern: /summer|warm|hot|humid|heat/,           value: 'Warm climate', source: 'explicit', confidence: 'high' },
    { pattern: /rain|wet|drizzle|monsoon/,             value: 'Rain',         source: 'explicit', confidence: 'high' },
  ];

  const COLOR_MAP = [
    { pattern: /\bblack\b/, value: 'Black' },
    { pattern: /\bwhite\b/, value: 'White' },
    { pattern: /\bnavy\b/,  value: 'Navy'  },
    { pattern: /\bgrey\b|\bgray\b/, value: 'Grey' },
    { pattern: /\bbrown\b/, value: 'Brown' },
    { pattern: /\bbeige\b|\bcream\b/, value: 'Cream' },
    { pattern: /\bgreen\b/, value: 'Green' },
    { pattern: /\bblue\b/,  value: 'Blue'  },
  ];

  const FIT_MAP = [
    { pattern: /slim|fitted|tailored|close\.to\.body/, value: 'Slim'    },
    { pattern: /relaxed|loose|oversized|baggy/,      value: 'Relaxed' },
    { pattern: /regular|standard|classic fit/,       value: 'Regular' },
  ];

  const STYLE_MAP = [
    { pattern: /minimal|clean|simple|understated/,  value: 'Minimal',      source: 'explicit', confidence: 'high'   },
    { pattern: /casual|laid\.back|effortless/,       value: 'Casual',       source: 'explicit', confidence: 'high'   },
    { pattern: /formal|smart|structured/,           value: 'Formal',       source: 'explicit', confidence: 'high'   },
    { pattern: /evening|dinner|dinner date/,        value: 'Smart Casual', source: 'inferred', confidence: 'medium' },
  ];

  const CATEGORY_MAP = [
    { pattern: /jacket|coat|outerwear|parka|blazer/,      value: 'Outerwear'  },
    { pattern: /sweater|knitwear|jumper|pullover/,        value: 'Knitwear'   },
    { pattern: /shirt|top|blouse/,                       value: 'Tops'       },
    { pattern: /trouser|pant|chino|jeans|denim/,         value: 'Bottoms'    },
    { pattern: /shoe|sneaker|boot|footwear|runner/,      value: 'Footwear'   },
    { pattern: /bag|tote|backpack|carry/,                value: 'Bags'       },
    { pattern: /watch|timepiece|chronograph/,            value: 'Timepieces' },
    { pattern: /headphone|earphone|earbud|audio|speaker/,value: 'Acoustics'  },
  ];

  const OUT_OF_SCOPE = [
    /capital of|president of|who is|recipe for|how to cook|weather in|stock price|sports score/
  ];

  const AMBIGUOUS = [
    /^something nice\.?$/i,
    /^show me products\.?$/i,
    /^i want to buy\.?$/i,
  ];

  const BANGLISH = [
    /jonno|chai|ekta|ache|jacchi|niye|kinte|dekhao|kotha|theke/
  ];

  function matchFirst(patterns, q) {
    for (var i = 0; i < patterns.length; i++) {
      if (patterns[i].pattern.test(q)) return patterns[i];
    }
    return null;
  }

  function parseBudget(q) {
    var under = q.match(/(?:under|less\s+than|below|max|upto|up\s+to)\s*(?:bdt|tk|taka)?\s*([\d,]+k?)/i);
    var around = q.match(/(?:around|approximately|about)\s*(?:bdt|tk|taka)?\s*([\d,]+k?)/i);
    if (under) return { max: parseAmount(under[1]), currency: 'BDT', source: 'explicit' };
    if (around) return { max: Math.round(parseAmount(around[1]) * 1.2), currency: 'BDT', source: 'explicit', isApproximate: true };
    return null;
  }

  function parseAmount(val) {
    var s = val.toLowerCase().replace(/,/g, '').replace(/bdt|tk|taka/gi, '').trim();
    if (s.endsWith('k')) return parseFloat(s) * 1000;
    return parseFloat(s) || null;
  }

  function parseRecipient(q) {
    if (/\bbrother\b|\bbhai\b/.test(q)) return { value: 'Brother', source: 'explicit', confidence: 'high' };
    if (/\bsister\b|\bapu\b|\bapa\b/.test(q)) return { value: 'Sister', source: 'explicit', confidence: 'high' };
    if (/\bfriend\b|\bbondhhu\b/.test(q)) return { value: 'Friend', source: 'explicit', confidence: 'high' };
    return null;
  }

  function parse(rawQuery) {
    if (!rawQuery || rawQuery.trim() === '') return { raw: '', isAmbiguous: false, isOutOfScope: false, isBanglish: false };

    var q = rawQuery.toLowerCase().trim();
    var isOutOfScope = OUT_OF_SCOPE.some(function(p) { return p.test(q); });
    var isAmbiguous  = AMBIGUOUS.some(function(p) { return p.test(q); });
    var isBanglish   = BANGLISH.some(function(p) { return p.test(q); });

    if (isOutOfScope) return { raw: rawQuery, isOutOfScope: true, isAmbiguous: false, isBanglish: isBanglish };
    if (isAmbiguous)  return { raw: rawQuery, isAmbiguous: true, isOutOfScope: false, isBanglish: isBanglish };

    var occ = matchFirst(OCCASION_MAP, q);
    var cli = matchFirst(CLIMATE_MAP,  q);
    var sty = matchFirst(STYLE_MAP,    q);
    var col = matchFirst(COLOR_MAP,    q);
    var fit = matchFirst(FIT_MAP,      q);
    var cat = matchFirst(CATEGORY_MAP, q);
    var bud = parseBudget(q);
    var rec = parseRecipient(q);
    var loc = q.includes('dhaka') ? { value: 'Dhaka', source: 'explicit', confidence: 'high' } : null;

    return {
      raw:       rawQuery,
      occasion:  occ ? { value: occ.value, source: occ.source, confidence: occ.confidence } : null,
      climate:   cli ? { value: cli.value, source: cli.source, confidence: cli.confidence } : null,
      location:  loc,
      style:     sty ? { value: sty.value, source: sty.source, confidence: sty.confidence } : null,
      color:     col ? { value: col.value, source: 'explicit', confidence: 'high' } : null,
      fit:       fit ? { value: fit.value, source: 'explicit', confidence: 'high' } : null,
      category:  cat ? { value: cat.value, source: 'explicit', confidence: 'high' } : null,
      budget:    bud,
      recipient: rec,
      isAmbiguous:  false,
      isOutOfScope: false,
      isBanglish:   isBanglish
    };
  }

  window.NexIntentParser = { parse: parse };

})(window);
