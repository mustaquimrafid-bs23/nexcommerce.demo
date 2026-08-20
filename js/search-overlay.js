/* ─── nexCommerce: Comprehensive Luxury Search Suite Engine ────────────────────────
 * Master Search Overlay, Instant Typeahead, Fuzzy Matching, Human-First Intent Parsing,
 * 3D Motion Cards, Direct Cart Quick-Add & Keyboard Navigation.
 * ────────────────────────────────────────────────────────────────────────────────── */

(function (window, document) {
  'use strict';

  /* ─── Universal Path & Asset Resolvers ───────────────────────────────────────── */
  function _isPagesDir() {
    return window.location.pathname.includes('/pages/');
  }

  function _resolvePage(page) {
    const clean = String(page || '').replace(/^pages\//, '').replace(/^\.\.\//, '');
    return _isPagesDir() ? clean : `pages/${clean}`;
  }

  function _resolveAsset(path) {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const clean = path.replace(/^(\.\.\/)+/, '').replace(/^\//, '');
    return _isPagesDir() ? `../${clean}` : clean;
  }

  /* ─── Unified Multi-Department Storefront Catalog ────────────────────────────── */
  const CATALOG_DB = [
    {
      id: 'p1',
      name: 'Cashmere Turtleneck Sweater',
      brand: 'Arc',
      category: 'Apparel',
      subCategory: 'Knitwear',
      price: 185,
      formattedPrice: '€ 185.00',
      image: 'assets/images/products/hero_sweater.png',
      matchBadge: 'BEST MATCH',
      reasoning: 'Spun from 2-ply Grade-A Mongolian cashmere. Warm enough after sunset without feeling heavy—ideal for 15°C–20°C evenings.',
      whyExpanded: [
        { label: 'Evening Temperature', desc: 'Engineered for cool evenings (15°C–20°C) with natural thermoregulation.' },
        { label: 'Minimal Silhouette', desc: 'Clean raglan shoulder construction with subtle ribbed trims.' },
        { label: 'Comfort First', desc: 'Featherweight 420 GSM 2-ply cashmere avoids excessive bulk.' },
        { label: 'Craft & Origin', desc: 'Hand-finished in Biella, Italy with Mongolian sourced yarn.' }
      ],
      tags: ['evening', 'cool weather', 'milan', 'lightweight', 'minimal', 'apparel', 'sweater', 'cashmere', 'knitwear', 'warm'],
      inStock: true
    },
    {
      id: 'p2',
      name: 'Structured Wool Blazer',
      brand: 'Arc',
      category: 'Apparel',
      subCategory: 'Tailoring',
      price: 264,
      formattedPrice: '€ 264.00',
      image: 'assets/images/products/plp_blazer.png',
      matchBadge: 'STYLE MATCH',
      reasoning: 'Tailored from Italian virgin wool with unlined soft canvassing for effortless evening dinners and travel.',
      whyExpanded: [
        { label: 'Soft Canvassing', desc: 'Unlined construction moves naturally without stiffness.' },
        { label: 'Premium Virgin Wool', desc: '100% Italian virgin wool weave with subtle natural sheen.' },
        { label: 'Occasion Ready', desc: 'Versatile silhouette dressed up for dinner or styled down with denim.' }
      ],
      tags: ['blazer', 'wool', 'tailored', 'jacket', 'dinner', 'evening', 'formal', 'apparel', 'outerwear'],
      inStock: true
    },
    {
      id: 'p3',
      name: 'Tailored Charcoal Overcoat',
      brand: 'Arc',
      category: 'Outerwear',
      subCategory: 'Coats',
      price: 380,
      formattedPrice: '€ 380.00',
      image: 'assets/images/products/plp_overcoat.png',
      matchBadge: 'CLIMATE FIT',
      reasoning: 'Double-faced wool-cashmere overcoat featuring sharp notch lapels and a relaxed mid-calf drop for winter layers.',
      whyExpanded: [
        { label: 'Winter Warmth', desc: '90% virgin wool and 10% cashmere blend provides substantial thermal protection.' },
        { label: 'Clean Lines', desc: 'Hand-stitched lapels and deep interior welt pockets.' },
        { label: 'Layering Room', desc: 'Cut with adequate shoulder room over suits and heavy knitwear.' }
      ],
      tags: ['overcoat', 'coat', 'winter', 'outerwear', 'charcoal', 'warm', 'wool', 'cashmere'],
      inStock: true
    },
    {
      id: 'p4',
      name: 'Studio Acoustics Headphone GT',
      brand: 'Form',
      category: 'Audio',
      subCategory: 'Headphones',
      price: 320,
      formattedPrice: '€ 320.00',
      image: 'assets/images/products/prod_headphones.png',
      matchBadge: 'HIGH FIDELITY',
      reasoning: 'Active noise cancellation with 40-hour battery life and Italian lambskin memory-foam ear cushions.',
      whyExpanded: [
        { label: 'Active Isolation', desc: 'Blocks environmental city noise for focused listening.' },
        { label: 'Titanium Drivers', desc: 'Precision 40mm custom titanium drivers delivering balanced acoustic staging.' },
        { label: 'Travel Endurance', desc: '40-hour playback with fast USB-C charge (15 mins = 4 hours).' }
      ],
      tags: ['headphones', 'audio', 'acoustics', 'travel', 'flight', 'noise cancellation', 'music', 'work', 'focus'],
      inStock: true
    },
    {
      id: 'p5',
      name: 'Horizon Wireless Earbuds',
      brand: 'Form',
      category: 'Audio',
      subCategory: 'Earbuds',
      price: 165,
      formattedPrice: '€ 165.00',
      image: 'assets/images/products/search_earbuds.png',
      matchBadge: 'POPULAR CHOICE',
      reasoning: 'Compact acoustic earbuds with ergonomic comfort tips, environmental transparency, and wireless charging case.',
      whyExpanded: [
        { label: 'Everyday Carry', desc: 'Slim pocket-sized matte charging case with magnetic snap.' },
        { label: 'Crystal Audio', desc: 'Dual beamforming microphones for clear call clarity on the go.' },
        { label: 'Water Resistant', desc: 'IPX5 splash resistance for workouts and light rain.' }
      ],
      tags: ['earbuds', 'wireless', 'audio', 'acoustics', 'compact', 'travel', 'commute', 'bluetooth'],
      inStock: true
    },
    {
      id: 'p6',
      name: 'Minimalist Leather Runner',
      brand: 'Apex',
      category: 'Footwear',
      subCategory: 'Sneakers',
      price: 198,
      formattedPrice: '€ 198.00',
      image: 'assets/images/products/prod_runner.png',
      matchBadge: 'COMFORT PICK',
      reasoning: 'Hand-lasted Italian calfskin runner with cushioned Vibram ergonomic outsoles built for extended city walking.',
      whyExpanded: [
        { label: 'Travel Comfort', desc: 'Shock-absorbing EVA midsole cushion designed for 15,000+ daily steps.' },
        { label: 'Supple Calfskin', desc: 'Buttery Italian nappa leather lining that molds to your foot over time.' },
        { label: 'Minimalist Profile', desc: 'Zero external branding with tonal cotton waxed laces.' }
      ],
      tags: ['runner', 'sneakers', 'shoes', 'footwear', 'leather', 'walking', 'travel', 'flight', 'comfort', 'minimal'],
      inStock: true
    },
    {
      id: 'p7',
      name: 'Architectural Canvas Tote',
      brand: 'Forma',
      category: 'Accessories',
      subCategory: 'Bags',
      price: 285,
      formattedPrice: '€ 285.00',
      image: 'assets/images/products/prod_tote.png',
      matchBadge: 'VERSATILE ESSENTIAL',
      reasoning: 'Heavyweight waxed organic cotton canvas with vegetable-tanned Tuscan bridle leather handles and a padded 16” laptop compartment.',
      whyExpanded: [
        { label: 'Weather Resistant', desc: 'Heavyweight 18oz water-repellent paraffin waxed canvas.' },
        { label: 'Dedicated Tech Sleeve', desc: 'Padded microfiber sleeve securely fits up to 16" laptops.' },
        { label: 'Bridle Leather', desc: 'Solid brass hardware with hand-riveted full-grain leather straps.' }
      ],
      tags: ['tote', 'bag', 'canvas', 'leather', 'accessories', 'laptop', 'travel', 'work', 'commute'],
      inStock: true
    },
    {
      id: 'p8',
      name: 'Chronograph Minimalist Watch',
      brand: 'Volta',
      category: 'Accessories',
      subCategory: 'Watches',
      price: 342,
      formattedPrice: '€ 342.00',
      image: 'assets/images/products/search_watch.png',
      matchBadge: 'TIMELESS PIECE',
      reasoning: 'Swiss quartz movement encased in 316L brushed surgical stainless steel with a sapphire crystal lens and Horween leather strap.',
      whyExpanded: [
        { label: 'Swiss Movement', desc: 'Precision quartz movement with sub-second chronograph dials.' },
        { label: 'Scratch-Proof', desc: 'Anti-reflective sapphire crystal glass rated 9 on the Mohs hardness scale.' },
        { label: 'Horween Leather', desc: 'Hand-stitched genuine American Horween leather strap.' }
      ],
      tags: ['watch', 'chronograph', 'accessories', 'timepiece', 'steel', 'leather', 'gift', 'luxury'],
      inStock: true
    }
  ];

  /* ─── Suggestion Prompts & Visual Departments ────────────────────────────────── */
  const IDLE_PROMPTS = [
    { text: 'Something for a winter evening in Milan', icon: 'sparkles' },
    { text: 'Something comfortable for a long flight', icon: 'plane' },
    { text: 'A luxury gift under €200', icon: 'gift' },
    { text: 'Minimal everyday sneakers', icon: 'footprints' }
  ];

  const POPULAR_DEPARTMENTS = [
    { label: 'Clothing', query: 'apparel' },
    { label: 'Footwear', query: 'footwear' },
    { label: 'Audio', query: 'audio' },
    { label: 'Accessories', query: 'accessories' }
  ];

  const VISUAL_DEPARTMENTS = [
    { label: 'Clothing & Knitwear', query: 'apparel', subtitle: 'Cashmere & Tailoring', count: '12 Pieces', image: 'assets/images/lifestyle/thumb_sweater.jpg' },
    { label: 'Footwear & Runners', query: 'footwear', subtitle: 'Italian Calfskin & Vibram', count: '8 Styles', image: 'assets/images/lifestyle/thumb_runner.jpg' },
    { label: 'Audio & Acoustics', query: 'audio', subtitle: 'Studio & Active Isolation', count: '6 Models', image: 'assets/images/lifestyle/thumb_headphones.jpg' },
    { label: 'Horology & Leather', query: 'accessories', subtitle: 'Automatic & Waxed Canvas', count: '10 Items', image: 'assets/images/lifestyle/thumb_watch.jpg' }
  ];

  /* ─── State & Storage Management ────────────────────────────────────────────── */
  let overlay, backdrop, panel, input, closeBtn, resultsContainer, thinkingTrack, thinkingBar, clearInputBtn;
  let isOpen = false;
  let activeFocusIndex = -1;
  let typeaheadDebounceTimer = null;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function getRecentSearches() {
    try {
      const stored = localStorage.getItem('nex_recent_searches');
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        return Array.isArray(parsed) ? parsed : [];
      }
      // Initial default for first-time visitors
      return ['Winter evening in Milan', 'Leather runner sneakers', 'Studio headphones'];
    } catch (_) {
      return [];
    }
  }

  function saveRecentSearch(query) {
    if (!query || query.trim().length < 2) return;
    const clean = query.trim();
    try {
      let list = getRecentSearches().filter(q => q.toLowerCase() !== clean.toLowerCase());
      list.unshift(clean);
      if (list.length > 5) list = list.slice(0, 5);
      localStorage.setItem('nex_recent_searches', JSON.stringify(list));
    } catch (_) {}
  }

  function deleteRecentSearch(query) {
    try {
      let list = getRecentSearches().filter(q => q.toLowerCase() !== query.toLowerCase());
      localStorage.setItem('nex_recent_searches', JSON.stringify(list));
    } catch (_) {}
    renderIdleState();
  }

  function clearAllRecentSearches() {
    try {
      localStorage.setItem('nex_recent_searches', JSON.stringify([]));
    } catch (_) {}
    renderIdleState();
  }

  /* ─── Natural Language Intent & Typo Engine ─────────────────────────────────── */
  function levenshteinDistance(s1, s2) {
    const m = s1.length, n = s2.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  function extractIntent(query) {
    const q = (query || '').toLowerCase().trim();

    let occasion = null;
    if (/dinner|evening out|date|restaurant|night out/.test(q)) occasion = 'Dinner / Evening';
    else if (/flight|travel|plane|vacation|trip|airport/.test(q)) occasion = 'Travel / Flight';
    else if (/work|office|meeting|desk|business/.test(q)) occasion = 'Work / Office';
    else if (/casual|weekend|everyday|daily|relax/.test(q)) occasion = 'Everyday / Casual';
    else if (/gift|present|birthday|brother|sister|friend/.test(q)) occasion = 'Gift';
    else if (/evening|night|sunset/.test(q)) occasion = 'Evening';

    let climate = null;
    if (/winter|cold|cool|15.?c|18.?c|20.?c|chilly|autumn|fall/.test(q)) climate = 'Cool Weather (15°C–20°C)';
    else if (/summer|warm|hot|sunny|heat/.test(q)) climate = 'Warm Climate';
    else if (/rain|waterproof|wet/.test(q)) climate = 'Rain & Weather';

    let location = null;
    if (/milan|milano/.test(q)) location = 'Milan';
    else if (/paris/.test(q)) location = 'Paris';
    else if (/london/.test(q)) location = 'London';
    else if (/tokyo/.test(q)) location = 'Tokyo';
    else if (/munich|münchen/.test(q)) location = 'Munich';
    else if (/new york|nyc/.test(q)) location = 'New York';

    let budgetMax = null;
    const matchUnder = q.match(/under\s*(?:€|eur)?\s*([\d,]+k?)/i) || q.match(/less\s*than\s*(?:€|eur)?\s*([\d,]+k?)/i);
    const matchAround = q.match(/around\s*(?:€|eur)?\s*([\d,]+k?)/i);
    if (matchUnder) budgetMax = parsePriceValue(matchUnder[1]);
    else if (matchAround) budgetMax = parsePriceValue(matchAround[1]) * 1.15;

    let targetCategory = null;
    if (/sweater|turtleneck|knit|crew|blazer|clothing|apparel|shirt|trousers|jacket|coat|overcoat/.test(q)) targetCategory = 'Apparel';
    else if (/headphone|earbud|audio|acoustics|music|sound|earphones/.test(q)) targetCategory = 'Audio';
    else if (/shoe|shoes|sneaker|sneakers|runner|runners|footwear|boots/.test(q)) targetCategory = 'Footwear';
    else if (/tote|bag|watch|chronograph|accessories|belt|wallet/.test(q)) targetCategory = 'Accessories';

    return { raw: query, occasion, climate, location, budgetMax, targetCategory };
  }

  function parsePriceValue(val) {
    let str = val.toLowerCase().replace(/€|eur|euros?|bdt/gi, '').replace(',', '').trim();
    if (str.endsWith('k')) return parseFloat(str.replace('k', '')) * 1000;
    return parseFloat(str) || null;
  }

  function checkTypoCorrection(rawQuery) {
    const q = rawQuery.toLowerCase().trim();
    const commonVocabulary = ['sweater', 'cashmere', 'blazer', 'overcoat', 'headphones', 'earbuds', 'runner', 'sneakers', 'tote', 'watch', 'jacket', 'shoes', 'audio'];
    const words = q.split(/\s+/);
    let corrected = null;

    for (let word of words) {
      if (word.length >= 4) {
        for (let target of commonVocabulary) {
          if (word !== target && levenshteinDistance(word, target) <= 2) {
            corrected = q.replace(word, target);
            break;
          }
        }
      }
      if (corrected) break;
    }
    return corrected;
  }

  /* ─── Search Execution & Filtering ─────────────────────────────────────────── */
  function queryCatalog(query, intent) {
    const qLower = query.toLowerCase().trim();
    let matches = [...CATALOG_DB];

    if (intent.budgetMax) {
      matches = matches.filter(p => p.price <= intent.budgetMax);
    }

    if (intent.targetCategory) {
      matches = matches.filter(p => p.category.toLowerCase() === intent.targetCategory.toLowerCase() || p.tags.includes(intent.targetCategory.toLowerCase()));
    }

    // Direct token search if not deeply parameterized
    if (!intent.occasion && !intent.climate && !intent.budgetMax && !intent.targetCategory) {
      matches = matches.filter(p => {
        const inName = p.name.toLowerCase().includes(qLower);
        const inBrand = p.brand.toLowerCase().includes(qLower);
        const inCat = p.category.toLowerCase().includes(qLower) || p.subCategory.toLowerCase().includes(qLower);
        const inTags = p.tags.some(t => t.toLowerCase().includes(qLower) || qLower.includes(t.toLowerCase()));
        return inName || inBrand || inCat || inTags;
      });
    }

    // If zero results but specific keywords match partially, loosen filter
    if (matches.length === 0) {
      const words = qLower.split(/\s+/).filter(w => w.length > 2);
      matches = CATALOG_DB.filter(p => {
        return words.some(w => p.tags.includes(w) || p.name.toLowerCase().includes(w) || p.category.toLowerCase().includes(w));
      });
    }

    return matches;
  }

  /* ─── 120fps GPU Progress Line ──────────────────────────────────────────────── */
  function runThinkingBar(durationMs, onDone) {
    if (thinkingTrack && thinkingBar) {
      thinkingTrack.classList.add('active');
      thinkingBar.style.transform = 'scaleX(0)';
      let start = null;
      let isDone = false;

      function step(ts) {
        if (isDone) return;
        if (!start) start = ts;
        const progress = Math.min((ts - start) / durationMs, 1);
        thinkingBar.style.transform = `scaleX(${progress.toFixed(3)})`;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);

      setTimeout(() => {
        isDone = true;
        thinkingTrack.classList.remove('active');
        if (onDone) onDone();
      }, durationMs);
    } else {
      setTimeout(onDone, durationMs);
    }
  }

  /* ─── UI State Renderers ─────────────────────────────────────────────────────── */
  function renderIdleState() {
    if (!resultsContainer) return;
    const recents = getRecentSearches();

    const recentsHtml = recents.length > 0 ? `
      <div class="search-section-block">
        <div class="search-section-header">
          <span class="search-section-label">RECENT SEARCHES</span>
          <button type="button" class="btn-clear-history" id="btnClearSearchHistory">CLEAR ALL</button>
        </div>
        <div class="search-recent-rail">
          ${recents.map(r => `
            <div class="recent-search-pill" data-query="${escapeHtml(r)}">
              <span class="recent-pill-icon"><i data-lucide="clock" style="width:13px;height:13px;"></i></span>
              <span class="recent-pill-text">${escapeHtml(r)}</span>
              <button type="button" class="btn-delete-recent" data-del="${escapeHtml(r)}" aria-label="Remove search ${escapeHtml(r)}">&times;</button>
            </div>
          `).join('')}
        </div>
      </div>
    ` : '';

    const visualDeptHtml = `
      <div class="search-section-block">
        <div class="search-section-header">
          <span class="search-section-label">EXPLORE BY DEPARTMENT</span>
        </div>
        <div class="search-visual-dept-grid">
          ${VISUAL_DEPARTMENTS.map(d => `
            <button type="button" class="search-visual-dept-card" data-dept="${escapeHtml(d.query)}">
              <img src="${_resolveAsset(d.image)}" alt="${escapeHtml(d.label)}" class="visual-dept-bg" loading="lazy" />
              <div class="visual-dept-scrim"></div>
              <div class="visual-dept-content">
                <span class="visual-dept-title">${escapeHtml(d.label)}</span>
                <span class="visual-dept-sub">${escapeHtml(d.subtitle)}</span>
                <span class="visual-dept-count">${escapeHtml(d.count)} &rarr;</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    const trendingPieces = [
      CATALOG_DB[0], // p1 Cashmere Turtleneck
      CATALOG_DB[5], // p3 Minimalist Leather Runner
      CATALOG_DB[4], // p6 Horizon Earbuds
      CATALOG_DB[7]  // p8 Chronograph Watch
    ];

    const trendingHtml = `
      <div class="search-section-block">
        <div class="search-section-header">
          <span class="search-section-label">TRENDING THIS SEASON</span>
        </div>
        <div class="search-trending-grid">
          ${trendingPieces.map(p => {
            const productHref = `${_resolvePage('product.html')}?id=${p.id}`;
            return `
            <div class="search-mini-prod-card" data-id="${p.id}">
              <a href="${productHref}" class="search-mini-img-wrap" style="display:block; text-decoration:none;">
                <img src="${_resolveAsset(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />
                <span class="search-mini-badge">${escapeHtml(p.matchBadge || 'TRENDING')}</span>
              </a>
              <div class="search-mini-meta">
                <span class="search-mini-brand">${escapeHtml(p.brand)}</span>
                <a href="${productHref}" class="search-mini-title">${escapeHtml(p.name)}</a>
                <div class="search-mini-footer">
                  <span class="search-mini-price tabular-nums">${p.formattedPrice}</span>
                  <button type="button" class="btn-mini-quick-add" data-id="${p.id}" aria-label="Quick add ${escapeHtml(p.name)}">
                    <i data-lucide="shopping-bag" style="width:11px;height:11px;margin-right:3px;"></i> ADD
                  </button>
                </div>
              </div>
            </div>
          `;}).join('')}
        </div>
      </div>
    `;

    const promptsHtml = `
      <div class="search-section-block">
        <div class="search-section-header">
          <span class="search-section-label">POPULAR INTENT SEARCHES</span>
        </div>
        <div class="search-prompt-pills-rail">
          ${IDLE_PROMPTS.map(p => `
            <button type="button" class="search-prompt-pill" data-prompt="${escapeHtml(p.text)}">
              <i data-lucide="${p.icon}" style="width:13px;height:13px;color:var(--accent-cyan,#3DE0FF);"></i>
              <span>${escapeHtml(p.text)}</span>
              <span class="prompt-pill-arrow">&rarr;</span>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    resultsContainer.innerHTML = `
      <div class="search-idle-wrapper">
        ${recentsHtml}
        ${visualDeptHtml}
        ${trendingHtml}
        ${promptsHtml}
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: resultsContainer });
    }
    bindIdleEvents();
  }

  function renderTypeaheadState(query) {
    if (!resultsContainer) return;
    const qLower = query.toLowerCase().trim();
    if (qLower.length < 2) {
      renderIdleState();
      return;
    }

    const matchedCats = POPULAR_DEPARTMENTS.filter(d => d.label.toLowerCase().includes(qLower) || d.query.includes(qLower));
    const matchedProducts = CATALOG_DB.filter(p => 
      p.name.toLowerCase().includes(qLower) || 
      p.brand.toLowerCase().includes(qLower) || 
      p.tags.some(t => t.includes(qLower))
    ).slice(0, 4);

    if (matchedProducts.length === 0 && matchedCats.length === 0) {
      const typo = checkTypoCorrection(query);
      if (typo) {
        renderTypoPrompt(query, typo);
      } else {
        renderNoResultsState(query);
      }
      return;
    }

    let catsHtml = '';
    if (matchedCats.length > 0) {
      catsHtml = `
        <div class="typeahead-group">
          <div class="typeahead-group-title">DEPARTMENTS</div>
          <div class="typeahead-cats-list">
            ${matchedCats.map(c => `
              <a href="${_resolvePage('category.html')}?cat=${c.query}" class="typeahead-cat-item">
                <span>${highlightMatch(c.label, qLower)}</span>
                <span class="typeahead-item-arrow">&rarr;</span>
              </a>
            `).join('')}
          </div>
        </div>
      `;
    }

    const prodsHtml = matchedProducts.length > 0 ? `
      <div class="typeahead-group">
        <div class="typeahead-group-title">PRODUCTS</div>
        <div class="typeahead-prods-grid">
          ${matchedProducts.map(p => {
            const productHref = `${_resolvePage('product.html')}?id=${p.id}`;
            return `
            <a href="${productHref}" class="typeahead-prod-card" data-id="${p.id}">
              <img src="${_resolveAsset(p.image)}" alt="${escapeHtml(p.name)}" class="typeahead-prod-thumb" />
              <div class="typeahead-prod-info">
                <span class="typeahead-prod-brand">${escapeHtml(p.brand)}</span>
                <h4 class="typeahead-prod-title">${highlightMatch(p.name, qLower)}</h4>
                <span class="typeahead-prod-price tabular-nums">${p.formattedPrice}</span>
              </div>
              <span class="btn-typeahead-view" data-id="${p.id}" aria-label="View ${escapeHtml(p.name)}">
                View &rarr;
              </span>
            </a>
          `;}).join('')}
        </div>
      </div>
    ` : '';

    resultsContainer.innerHTML = `
      <div class="typeahead-container">
        <div class="typeahead-hint-bar">
          <span>Press <strong>Enter</strong> to explore all matches for &ldquo;${escapeHtml(query)}&rdquo;</span>
          <a href="${_resolvePage('discovery.html')}?q=${encodeURIComponent(query)}" class="typeahead-see-all-link">See all &rarr;</a>
        </div>
        ${catsHtml}
        ${prodsHtml}
        <div class="typeahead-footer-action">
          <a href="${_resolvePage('discovery.html')}?q=${encodeURIComponent(query)}" class="btn-typeahead-see-all">
            <span>Explore all results for &ldquo;${escapeHtml(query)}&rdquo; in Discovery</span>
            <span>&rarr;</span>
          </a>
        </div>
      </div>
    `;

    bindResultActions();
  }

  function renderProcessingState(intent) {
    if (!resultsContainer) return;
    const chips = buildIntentBadges(intent);

    resultsContainer.innerHTML = `
      <div class="search-processing-state">
        <div class="search-processing-icon">
          <i data-lucide="sparkles" style="width:24px;height:24px;animation:spinPulse 2s infinite linear;"></i>
        </div>
        <h3 class="search-processing-title">SEARCHING FOR YOU...</h3>
        <p class="search-processing-sub">Looking across our complete collection for the best recommendations</p>
        ${chips.length > 0 ? `
          <div class="search-intent-pills-row">
            ${chips.map(c => `<span class="intent-pill-preview">${c}</span>`).join('')}
          </div>
        ` : ''}
      </div>
      <style>
        @keyframes spinPulse { 0% { transform: scale(0.95); opacity: 0.7; } 50% { transform: scale(1.08); opacity: 1; } 100% { transform: scale(0.95); opacity: 0.7; } }
      </style>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: resultsContainer });
    }
  }

  function renderResultsState(query, intent, matchedProducts) {
    if (!resultsContainer) return;

    if (matchedProducts.length === 0) {
      renderNoResultsState(query);
      return;
    }

    const intentBadges = buildIntentBadges(intent);

    const cardsHtml = matchedProducts.map(p => {
      const productHref = `${_resolvePage('product.html')}?id=${p.id}`;
      return `
      <div class="search-product-card" data-id="${p.id}">
        <div class="search-card-specular" aria-hidden="true"></div>
        <a href="${productHref}" class="search-card-img-wrap" style="display:block; text-decoration:none;">
          <img src="${_resolveAsset(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy" />
          <span class="search-card-badge">${escapeHtml(p.matchBadge || 'RECOMMENDED')}</span>
        </a>
        <div class="search-card-content">
          <div class="search-card-header">
            <span class="search-card-brand">${escapeHtml(p.brand)}</span>
            <h4 class="search-card-title">
              <a href="${productHref}" style="color:inherit; text-decoration:none;">${escapeHtml(p.name)}</a>
            </h4>
            <div class="search-card-price tabular-nums">${p.formattedPrice}</div>
          </div>
          <div class="search-card-actions">
            <button type="button" class="btn-search-quick-add" data-id="${p.id}">
              <i data-lucide="shopping-bag" style="width:14px;height:14px;margin-right:6px;"></i> QUICK ADD
            </button>
            <a href="${productHref}" class="btn-search-view btn-view-product" data-id="${p.id}">
              VIEW
            </a>
          </div>
          <button type="button" class="link-see-why" data-id="${p.id}">
            See details &amp; specs &rarr;
          </button>
        </div>
      </div>
    `;}).join('');

    resultsContainer.innerHTML = `
      <div class="search-results-wrapper">
        <div class="search-results-top-bar">
          <div class="search-results-count-badge">
            <i data-lucide="sparkles" style="width:13px;height:13px;color:var(--accent-cyan,#3DE0FF);"></i>
            <span>${matchedProducts.length} Recommended Pieces for &ldquo;${escapeHtml(query)}&rdquo;</span>
          </div>
          ${intentBadges.length > 0 ? `
            <div class="search-preferences-pills">
              ${intentBadges.map(b => `<span class="intent-badge-pill">${b}</span>`).join('')}
            </div>
          ` : ''}
        </div>

        <div class="search-results-grid">
          ${cardsHtml}
        </div>

        <!-- See All Results in Full Discovery / Catalog -->
        <div class="search-see-all-container">
          <a href="${_resolvePage('discovery.html')}?q=${encodeURIComponent(query)}" class="btn-see-all-catalog">
            <span>SEE ALL RESULTS FOR &ldquo;${escapeHtml(query)}&rdquo; IN FULL CATALOG</span>
            <span class="see-all-arrow">&rarr;</span>
          </a>
        </div>

        <!-- Conversational Refinement Bar -->
        <div class="search-refinements-section">
          <span class="refinements-label">REFINE SEARCH</span>
          <div class="refinements-pills-rail">
            <button type="button" class="refinement-pill" data-refine="under 200">Under € 200</button>
            <button type="button" class="refinement-pill" data-refine="winter warm">Warmer</button>
            <button type="button" class="refinement-pill" data-refine="minimal clean">More Minimal</button>
            <button type="button" class="refinement-pill" data-refine="travel flight">Travel Ready</button>
            <button type="button" class="refinement-pill" data-refine="apparel">Clothing Only</button>
          </div>
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: resultsContainer });
    }

    bindResultActions();
    bind3DCardMotion();
  }

  function renderNoResultsState(query) {
    if (!resultsContainer) return;
    const typo = checkTypoCorrection(query);

    resultsContainer.innerHTML = `
      <div class="search-empty-state">
        <div class="search-empty-icon"><i data-lucide="search-x" style="width:32px;height:32px;"></i></div>
        <h3 class="search-empty-title">No exact matches found</h3>
        <p class="search-empty-desc">We couldn't find items matching &ldquo;${escapeHtml(query)}&rdquo;.</p>
        ${typo ? `
          <div class="search-typo-box">
            <span>Did you mean:</span>
            <button type="button" class="btn-typo-suggest" data-query="${escapeHtml(typo)}">
              &ldquo;${escapeHtml(typo)}&rdquo; &rarr;
            </button>
          </div>
        ` : ''}
        <div class="search-empty-suggestions">
          <span class="empty-sugg-label">TRY EXPLORING:</span>
          <div class="search-dept-rail" style="justify-content:center;">
            ${POPULAR_DEPARTMENTS.map(d => `
              <button type="button" class="search-dept-pill" data-dept="${escapeHtml(d.query)}">
                ${escapeHtml(d.label)}
              </button>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons({ root: resultsContainer });
    }
    bindIdleEvents();
  }

  function renderTypoPrompt(original, corrected) {
    if (!resultsContainer) return;
    resultsContainer.innerHTML = `
      <div class="search-typo-container">
        <div class="search-typo-box">
          <span>Showing results for &ldquo;${escapeHtml(corrected)}&rdquo; instead of &ldquo;${escapeHtml(original)}&rdquo;:</span>
          <button type="button" class="btn-typo-suggest" data-query="${escapeHtml(original)}">Search strictly for &ldquo;${escapeHtml(original)}&rdquo;</button>
        </div>
      </div>
    `;
    const intent = extractIntent(corrected);
    const matches = queryCatalog(corrected, intent);
    const subContainer = document.createElement('div');
    resultsContainer.appendChild(subContainer);
    renderResultsState(corrected, intent, matches);
  }

  function openWhyMatchesModal(productId) {
    const item = CATALOG_DB.find(p => p.id === productId) || CATALOG_DB[0];
    const existing = document.getElementById('searchWhyModal');
    if (existing) existing.remove();

    const whyHtml = item.whyExpanded.map(w => `
      <div class="evidence-row">
        <span class="evidence-bullet">&#10003;</span>
        <div class="evidence-text">
          <strong class="evidence-title">${escapeHtml(w.label)}</strong>
          <p class="evidence-desc">${escapeHtml(w.desc)}</p>
        </div>
      </div>
    `).join('');

    const modal = document.createElement('div');
    modal.className = 'search-why-overlay';
    modal.id = 'searchWhyModal';
    modal.innerHTML = `
      <div class="search-why-dialog">
        <div class="search-why-header">
          <span class="search-why-eyebrow">DESIGN &amp; FIT EVIDENCE</span>
          <button type="button" class="search-why-close" id="btnSearchWhyClose">&times;</button>
        </div>
        <h3 class="search-why-product-name">${escapeHtml(item.name)}</h3>
        <p class="search-why-reasoning">&ldquo;${escapeHtml(item.reasoning)}&rdquo;</p>
        <div class="search-why-evidence-list">
          ${whyHtml}
        </div>
        <div class="search-why-footer">
          <button type="button" class="btn-primary-commerce" id="btnWhyDone" style="height:44px;">GOT IT</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    setTimeout(() => modal.classList.add('active'), 10);

    const closeWhy = () => {
      modal.classList.remove('active');
      setTimeout(() => modal.remove(), 200);
    };

    modal.querySelector('#btnSearchWhyClose').addEventListener('click', closeWhy);
    modal.querySelector('#btnWhyDone').addEventListener('click', closeWhy);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeWhy();
    });
  }

  /* ─── Helpers & Match Highlighting ───────────────────────────────────────────── */
  function buildIntentBadges(intent) {
    const badges = [];
    if (!intent) return badges;
    if (intent.occasion) badges.push(`Occasion: ${intent.occasion}`);
    if (intent.climate) badges.push(`Climate: ${intent.climate}`);
    if (intent.location) badges.push(`Location: ${intent.location}`);
    if (intent.budgetMax) badges.push(`Max: € ${intent.budgetMax.toLocaleString()}`);
    if (intent.targetCategory) badges.push(`Department: ${intent.targetCategory}`);
    return badges;
  }

  function highlightMatch(text, query) {
    if (!query) return escapeHtml(text);
    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return escapeHtml(text).replace(regex, '<mark class="search-hl">$1</mark>');
  }

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function escapeHtml(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ─── 3D Motion Standard: Tilt & Specular Glare ──────────────────────────────── */
  function bind3DCardMotion() {
    if (prefersReduced || !resultsContainer) return;
    const cards = resultsContainer.querySelectorAll('.search-product-card');
    const MAX_TILT = 4.5;
    const lerp = (a, b, t) => a + (b - a) * t;

    cards.forEach(card => {
      let curTX = 0, curTY = 0, tgtTX = 0, tgtTY = 0, rafId = null;

      function applyTilt() {
        curTX = lerp(curTX, tgtTX, 0.16);
        curTY = lerp(curTY, tgtTY, 0.16);
        card.style.transform = `perspective(900px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(4px)`;
        if (Math.abs(curTX - tgtTX) > 0.02 || Math.abs(curTY - tgtTY) > 0.02) {
          rafId = requestAnimationFrame(applyTilt);
        } else {
          rafId = null;
        }
      }

      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const dx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
        tgtTX = -(dy * MAX_TILT);
        tgtTY = (dx * MAX_TILT);

        const gx = ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%';
        const gy = ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%';
        card.style.setProperty('--search-glare-x', gx);
        card.style.setProperty('--search-glare-y', gy);
        card.style.setProperty('--search-glare-opacity', '1');

        if (!rafId) rafId = requestAnimationFrame(applyTilt);
      });

      card.addEventListener('mouseleave', () => {
        tgtTX = 0;
        tgtTY = 0;
        card.style.setProperty('--search-glare-opacity', '0');

        function springBack() {
          curTX = lerp(curTX, 0, 0.2);
          curTY = lerp(curTY, 0, 0.2);
          card.style.transform = `perspective(900px) rotateX(${curTX.toFixed(2)}deg) rotateY(${curTY.toFixed(2)}deg) translateZ(0px)`;
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

  /* ─── Cart Quick-Add & Navigation Synchronization ────────────────────────────── */
  function handleQuickAdd(productId, btnElement) {
    const item = CATALOG_DB.find(p => p.id === productId);
    if (!item) return;

    if (window.nexCart && typeof window.nexCart.addItem === 'function') {
      window.nexCart.addItem({
        id: item.id,
        name: item.name,
        brand: item.brand,
        price: item.price,
        image: item.image,
        qty: 1,
        color: 'Default',
        size: 'M'
      });
    }

    // Visual button ripple feedback
    if (btnElement) {
      const originalHtml = btnElement.innerHTML;
      btnElement.innerHTML = `&#10003; ADDED TO BAG`;
      btnElement.style.background = 'var(--accent-cyan, #3DE0FF)';
      btnElement.style.color = '#020B18';
      setTimeout(() => {
        btnElement.innerHTML = originalHtml;
        btnElement.style.background = '';
        btnElement.style.color = '';
      }, 1400);
    }

    // Reveal mini-cart drawer
    if (window.nexCart && typeof window.nexCart.openMiniCart === 'function') {
      setTimeout(() => {
        closeSearchOverlay();
        window.nexCart.openMiniCart();
      }, 350);
    }
  }

  function handleViewProduct(productId) {
    saveSearchContext(productId);
    closeSearchOverlay();
    const targetUrl = `${_resolvePage('product.html')}?id=${productId}`;
    window.location.href = targetUrl;
  }

  function triggerPageTransition(url) {
    window.location.href = url;
  }

  function saveSearchContext(productId) {
    try {
      const data = {
        productId: productId,
        query: input ? input.value : '',
        timestamp: new Date().toISOString()
      };
      sessionStorage.setItem('nexcommerce_search_context', JSON.stringify(data));
    } catch (_) {}
  }

  /* ─── Search Execution Pipeline ─────────────────────────────────────────────── */
  function executeSearch(rawQuery) {
    const query = (rawQuery || '').trim();
    if (!query) {
      renderIdleState();
      return;
    }

    if (input && input.value !== query) {
      input.value = query;
    }
    toggleClearButton();
    saveRecentSearch(query);

    const intent = extractIntent(query);
    renderProcessingState(intent);

    runThinkingBar(500, () => {
      const matches = queryCatalog(query, intent);
      renderResultsState(query, intent, matches);
    });
  }

  /* ─── Event Bindings ─────────────────────────────────────────────────────────── */
  function bindIdleEvents() {
    if (!resultsContainer) return;

    // Visual Department Cards
    resultsContainer.querySelectorAll('.search-visual-dept-card').forEach(btn => {
      btn.addEventListener('click', () => {
        const cat = btn.getAttribute('data-dept');
        executeSearch(cat);
      });
    });

    // Trending Mini Products Quick-Add
    resultsContainer.querySelectorAll('.btn-mini-quick-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = btn.getAttribute('data-id');
        handleQuickAdd(pid, btn);
      });
    });

    // Prompt pills
    resultsContainer.querySelectorAll('.search-prompt-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-prompt');
        executeSearch(p);
      });
    });

    // Recent search pills
    resultsContainer.querySelectorAll('.recent-search-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        if (e.target.closest('.btn-delete-recent')) return;
        const q = pill.getAttribute('data-query');
        executeSearch(q);
      });
    });

    // Delete single recent item
    resultsContainer.querySelectorAll('.btn-delete-recent').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const delQ = btn.getAttribute('data-del');
        deleteRecentSearch(delQ);
      });
    });

    // Clear All button
    const clearAllBtn = resultsContainer.querySelector('#btnClearSearchHistory');
    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', clearAllRecentSearches);
    }

    // Typo suggest
    const typoBtn = resultsContainer.querySelector('.btn-typo-suggest');
    if (typoBtn) {
      typoBtn.addEventListener('click', () => {
        executeSearch(typoBtn.getAttribute('data-query'));
      });
    }
  }

  function bindResultActions() {
    if (!resultsContainer) return;

    // Quick Add
    resultsContainer.querySelectorAll('.btn-search-quick-add').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pid = btn.getAttribute('data-id');
        handleQuickAdd(pid, btn);
      });
    });

    // Typeahead product card links
    resultsContainer.querySelectorAll('.typeahead-prod-card').forEach(card => {
      card.addEventListener('click', () => {
        const pid = card.getAttribute('data-id');
        saveSearchContext(pid);
      });
    });

    // View Product
    resultsContainer.querySelectorAll('.btn-view-product').forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-id');
        saveSearchContext(pid);
      });
    });

    // See why modal
    resultsContainer.querySelectorAll('.link-see-why').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const pid = link.getAttribute('data-id');
        openWhyMatchesModal(pid);
      });
    });

    // Refinement pills
    resultsContainer.querySelectorAll('.refinement-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        const refine = pill.getAttribute('data-refine');
        pill.classList.add('active');
        executeSearch(refine);
      });
    });
  }

  function toggleClearButton() {
    if (!clearInputBtn || !input) return;
    if (input.value.trim().length > 0) {
      clearInputBtn.style.display = 'flex';
    } else {
      clearInputBtn.style.display = 'none';
    }
  }

  /* ─── Keyboard Traversal & Global Listeners ──────────────────────────────────── */
  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (isOpen) closeSearchOverlay();
      else openSearchOverlay();
      return;
    }

    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeSearchOverlay();
      return;
    }

    // Keyboard navigation through suggestions
    const interactiveItems = resultsContainer ? Array.from(resultsContainer.querySelectorAll('button, a, .recent-search-pill, .typeahead-prod-card')) : [];
    if (interactiveItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeFocusIndex = (activeFocusIndex + 1) % interactiveItems.length;
      interactiveItems[activeFocusIndex].focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeFocusIndex = (activeFocusIndex - 1 + interactiveItems.length) % interactiveItems.length;
      if (activeFocusIndex < 0) {
        if (input) input.focus();
        activeFocusIndex = -1;
      } else {
        interactiveItems[activeFocusIndex].focus();
      }
    }
  }

  /* ─── Modal Open & Close ─────────────────────────────────────────────────────── */
  function openSearchOverlay() {
    if (!overlay) return;
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    activeFocusIndex = -1;

    if (input) {
      if (!input.value.trim()) renderIdleState();
      toggleClearButton();
      setTimeout(() => input.focus(), 120);
    }
  }

  function closeSearchOverlay() {
    if (!overlay) return;
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    isOpen = false;
  }

  /* ─── Initialization ─────────────────────────────────────────────────────────── */
  function initSearchOverlay() {
    overlay = document.getElementById('aiSearchModal');
    if (!overlay) return;

    backdrop = overlay.querySelector('.search-backdrop');
    panel = overlay.querySelector('.search-panel');
    input = overlay.querySelector('.search-ai-input');
    closeBtn = overlay.querySelector('.search-close-btn');
    resultsContainer = document.getElementById('aiSearchResultsModal') || document.getElementById('aiSearchResults');

    // Create GPU Thinking Track if missing
    const headerBar = overlay.querySelector('.search-header-bar');
    if (headerBar && !overlay.querySelector('.nex-thinking-track')) {
      thinkingTrack = document.createElement('div');
      thinkingTrack.className = 'nex-thinking-track';
      thinkingTrack.setAttribute('aria-hidden', 'true');
      thinkingBar = document.createElement('div');
      thinkingBar.className = 'nex-thinking-bar';
      thinkingTrack.appendChild(thinkingBar);
      headerBar.insertAdjacentElement('afterend', thinkingTrack);
    } else {
      thinkingTrack = overlay.querySelector('.nex-thinking-track');
      thinkingBar = overlay.querySelector('.nex-thinking-bar');
    }

    // Create Clear Input Button if missing
    const inputWrapper = overlay.querySelector('.search-input-wrapper');
    if (inputWrapper && !inputWrapper.querySelector('.btn-search-clear-input')) {
      clearInputBtn = document.createElement('button');
      clearInputBtn.type = 'button';
      clearInputBtn.className = 'btn-search-clear-input';
      clearInputBtn.setAttribute('aria-label', 'Clear search text');
      clearInputBtn.innerHTML = '&times;';
      clearInputBtn.style.display = 'none';
      inputWrapper.appendChild(clearInputBtn);

      clearInputBtn.addEventListener('click', () => {
        if (input) {
          input.value = '';
          input.focus();
          toggleClearButton();
          renderIdleState();
        }
      });
    }

    // Listeners
    if (closeBtn) closeBtn.addEventListener('click', closeSearchOverlay);
    if (backdrop) backdrop.addEventListener('click', closeSearchOverlay);
    document.addEventListener('keydown', handleKeyDown);

    // Global trigger buttons
    document.querySelectorAll('[data-open-search], #navSearchBtn, #searchTriggerBtn, .nav-search-trigger, .nav-search-trigger-mobile').forEach(trig => {
      trig.addEventListener('click', (e) => {
        e.preventDefault();
        openSearchOverlay();
      });
    });

    if (input) {
      input.addEventListener('input', () => {
        toggleClearButton();
        const val = input.value.trim();
        clearTimeout(typeaheadDebounceTimer);
        if (!val) {
          renderIdleState();
          return;
        }
        typeaheadDebounceTimer = setTimeout(() => {
          renderTypeaheadState(val);
        }, 150);
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeSearch(input.value);
        }
      });
    }

    // Auto-fill on-page discovery search input if present on discovery.html without opening the popup overlay
    const params = new URLSearchParams(window.location.search);
    const qParam = params.get('q');
    if (qParam) {
      const discInput = document.getElementById('discoveryMainInput');
      if (discInput) {
        discInput.value = qParam;
      }
    }
  }

  // DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearchOverlay);
  } else {
    initSearchOverlay();
  }

  // Public API
  window.NexSearchOverlay = {
    open: openSearchOverlay,
    close: closeSearchOverlay,
    search: executeSearch,
    catalog: CATALOG_DB
  };

})(window, document);
