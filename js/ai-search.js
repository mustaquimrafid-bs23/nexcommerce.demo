/* ─── nexCommerce Part 2, 3 & 4: AI Search & Decision Support Engine ─────── */

(function () {
  'use strict';

  // Storefront Catalog Database with Part 4 & Part 18 Detailed Attributes
  const CATALOG_DB = [
    {
      id: 'p1',
      name: 'Architectural Cashmere Sweater',
      category: 'APPAREL',
      price: 18400,
      formattedPrice: 'BDT 18,400',
      image: 'hero_sweater.png',
      matchBadge: 'BEST MATCH',
      matchLabel: 'Best match for your request',
      reasoning: 'Warm enough after sunset without feeling heavy. Ideal for 18°C Dhaka evenings.',
      whyExpanded: [
        { label: '&#10003; Evening temperature', desc: 'Designed for cooler evening conditions (15°C&ndash;20°C).' },
        { label: '&#10003; Your style', desc: 'Minimal silhouette with a clean structure.' },
        { label: '&#10003; Comfort', desc: 'Lightweight construction avoids excessive warmth.' },
        { label: '&#10003; Location', desc: "Suitable for Dhaka's mild winter evenings." }
      ],
      comparison: {
        warmth: 'Ideal for 18°C',
        fit: 'Regular Minimal',
        occasion: 'Evening Out',
        material: ' Wool Blend',
        versatility: 'High'
      },
      tags: ['evening', 'cool weather', 'dhaka', 'lightweight', 'minimal', 'apparel', 'sweater', 'cashmere']
    },
    {
      id: 'p2',
      name: 'Monolith Runner GT',
      category: 'FOOTWEAR',
      price: 24500,
      formattedPrice: 'BDT 24,500',
      image: 'prod_runner.png',
      matchBadge: 'EXCELLENT FIT',
      matchLabel: 'High comfort footwear',
      reasoning: 'Cushioned carbon-sole build designed for extended city walking and travel.',
      whyExpanded: [
        { label: '&#10003; Travel comfort', desc: 'Carbon-plate shock absorption for long walks.' },
        { label: '&#10003; Breathability', desc: 'Engineered mesh allows natural airflow.' },
        { label: '&#10003; Durability', desc: 'Reinforced outsole built for urban terrain.' }
      ],
      comparison: {
        warmth: 'Breathable Thermal',
        fit: 'Adaptive Athletic',
        occasion: 'Travel / Walking',
        material: 'Carbon-Plate Mesh',
        versatility: 'High'
      },
      tags: ['footwear', 'shoes', 'running', 'comfort', 'travel', 'flight', 'sneakers']
    },
    {
      id: 'p3',
      name: 'Wireless Precision Earbuds',
      category: 'ACOUSTICS',
      price: 14200,
      formattedPrice: 'BDT 14,200',
      image: 'search_earbuds.png',
      matchBadge: 'GOOD MATCH',
      matchLabel: 'Minimalist Acoustic',
      reasoning: 'Ergonomic fit with high fidelity sound and seamless device switching.',
      whyExpanded: [
        { label: '&#10003; Everyday carry', desc: 'Sleek matte black charging case.' },
        { label: '&#10003; High fidelity', desc: 'Precision acoustics with noise isolation.' }
      ],
      comparison: {
        warmth: 'N/A',
        fit: 'Ergonomic In-Ear',
        occasion: 'Commute / Daily',
        material: 'Matte Polycarbonate',
        versatility: 'High'
      },
      tags: ['acoustics', 'earbuds', 'audio', 'music', 'work', 'commute']
    },
    {
      id: 'p4',
      name: 'Acoustic Over-Ear Headphones',
      category: 'ACOUSTICS',
      price: 32000,
      formattedPrice: 'BDT 32,000',
      image: 'prod_headphones.png',
      matchBadge: 'HIGH RATING',
      matchLabel: 'Focused listening',
      reasoning: 'Active noise cancellation with 40-hour battery life for focused working.',
      whyExpanded: [
        { label: '&#10003; Active noise cancellation', desc: 'Blocks environmental noise for focus.' },
        { label: '&#10003; Premium materials', desc: 'Lambskin ear cushions with anodized aluminum.' }
      ],
      comparison: {
        warmth: 'N/A',
        fit: 'Over-Ear Ergonomic',
        occasion: 'Focus / Travel',
        material: 'Aluminum & Leather',
        versatility: 'Medium'
      },
      tags: ['acoustics', 'headphones', 'audio', 'travel', 'focus', 'noise cancellation']
    }
  ];

  // DOM Cache
  let overlay, backdrop, panel, input, closeBtn, resultsContainer;

  function initAISearchEngine() {
    overlay = document.getElementById('aiSearchModal');
    if (!overlay) return;

    backdrop = overlay.querySelector('.search-backdrop');
    panel = overlay.querySelector('.search-panel');
    input = overlay.querySelector('.search-ai-input');
    closeBtn = overlay.querySelector('.search-close-btn');
    resultsContainer = document.getElementById('aiSearchResults') || document.getElementById('aiSearchResultsModal');

    // Keydown listeners for Cmd+K / Ctrl+K & Esc
    document.addEventListener('keydown', handleGlobalKeydown);

    if (closeBtn) closeBtn.addEventListener('click', closeSearchOverlay);
    if (backdrop) backdrop.addEventListener('click', closeSearchOverlay);

    // Triggers across pages
    const triggers = document.querySelectorAll('.nav-search-trigger, .nav-search-trigger-mobile, #searchTriggerBtn');
    triggers.forEach(trig => {
      trig.addEventListener('click', openSearchOverlay);
    });

    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          executeSearch(input.value);
        }
      });
    }

    // Global Click Delegation for Refinements & "Why Matches"
    document.addEventListener('click', function (e) {
      // Prompt buttons
      const promptBtn = e.target.closest('.search-prompt-btn');
      if (promptBtn) {
        const text = promptBtn.getAttribute('data-prompt') || promptBtn.textContent.trim();
        if (input) {
          input.value = text;
          executeSearch(text);
        }
      }

      const submitBtn = e.target.closest('.btn-search-submit');
      if (submitBtn && input) {
        executeSearch(input.value);
      }

      // "See why" modal toggle
      const whyToggle = e.target.closest('.why-this-toggle');
      if (whyToggle) {
        e.preventDefault();
        const id = whyToggle.getAttribute('data-id') || 'p1';
        openWhyThisMatchesModal(id);
      }

      // Refinement chips
      const refChip = e.target.closest('.refinement-chip');
      if (refChip) {
        const chipText = refChip.textContent.trim();
        handleRefinementChipClick(refChip, chipText);
      }

      // "VIEW PRODUCT" PDP navigation
      const viewBtn = e.target.closest('.btn-view-product');
      if (viewBtn) {
        const productId = viewBtn.getAttribute('data-id') || 'p1';
        saveSearchContext(productId);
        window.location.href = `product.html?id=${productId}`;
      }
    });

    // Parse URL query if on discovery.html
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get('q');
    if (urlQuery && resultsContainer) {
      if (input) input.value = urlQuery;
      openSearchOverlay();
      executeSearch(urlQuery);
    }
  }

  function handleGlobalKeydown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openSearchOverlay();
    } else if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closeSearchOverlay();
    }
  }

  function openSearchOverlay() {
    if (!overlay) return;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (input) setTimeout(() => input.focus(), 150);
  }

  function closeSearchOverlay() {
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ─── Recent Searches (localStorage) ───────────────────────── */
  function getRecentSearches() {
    try {
      const stored = localStorage.getItem('nex_recent_searches');
      return stored ? JSON.parse(stored) : ['something for a winter evening', 'black jacket', 'running shoes'];
    } catch (_) {
      return ['something for a winter evening', 'black jacket', 'running shoes'];
    }
  }

  function saveRecentSearch(query) {
    if (!query || query.length < 3) return;
    try {
      let list = getRecentSearches().filter(q => q.toLowerCase() !== query.toLowerCase());
      list.unshift(query);
      if (list.length > 5) list = list.slice(0, 5);
      localStorage.setItem('nex_recent_searches', JSON.stringify(list));
    } catch (_) {}
  }

  window.clearRecentSearches = function() {
    try {
      localStorage.removeItem('nex_recent_searches');
    } catch (_) {}
    renderInitialState();
  };

  /* ─── Natural Language Intent & Budget Extraction ───────────── */
  function extractIntent(query) {
    const q = query.toLowerCase();

    let occasion = null;
    if (/dinner|evening out|date|restaurant/.test(q)) occasion = 'Dinner / Evening';
    else if (/flight|travel|vacation|trip|journey/.test(q)) occasion = 'Travel / Flight';
    else if (/work|office|meeting|professional/.test(q)) occasion = 'Work / Office';
    else if (/casual|weekend|everyday|daily/.test(q)) occasion = 'Everyday / Casual';
    else if (/gift|present|birthday|brother|sister|friend/.test(q)) occasion = 'Gift';
    else if (/evening|night|sunset/.test(q)) occasion = 'Evening';

    let climate = null;
    if (/winter|cold|cool|18.c|chilly|freeze/.test(q)) climate = 'Cool weather (18°C)';
    else if (/summer|warm|hot|humid/.test(q)) climate = 'Warm climate';

    let location = null;
    if (/dhaka/.test(q)) location = 'Dhaka';

    let style = null;
    if (/minimal|minimal|clean|simple|understated/.test(q)) style = 'Minimal';
    else if (/casual|relaxed|laid.back/.test(q)) style = 'Casual';
    else if (/formal|smart|tailored/.test(q)) style = 'Formal';

    let budgetMax = null;
    const matchUnder = q.match(/under\s*(?:bdt)?\s*([\d,]+k?)/i) || q.match(/less\s*than\s*(?:bdt)?\s*([\d,]+k?)/i);
    const matchAround = q.match(/around\s*(?:bdt)?\s*([\d,]+k?)/i);
    if (matchUnder) budgetMax = parseAmount(matchUnder[1]);
    else if (matchAround) budgetMax = parseAmount(matchAround[1]) * 1.15;

    let recipient = null;
    if (/brother/.test(q)) recipient = 'Brother';
    else if (/sister/.test(q)) recipient = 'Sister';
    else if (/friend/.test(q)) recipient = 'Friend';

    return { occasion, climate, location, style, budgetMax, recipient };
  }

  function parseAmount(val) {
    let str = val.toLowerCase().replace('BDT', '').replace(',', '').trim();
    if (str.endsWith('k')) {
      return parseFloat(str.replace('k', '')) * 1000;
    }
    return parseFloat(str);
  }

  /* ─── Search Execution ───────────────────────────────────────── */
  function executeSearch(rawQuery) {
    const query = (rawQuery || '').trim();
    
    // Choose active container: modal container if modal active, otherwise page container
    const isModalActive = overlay && overlay.classList.contains('active');
    const targetContainer = isModalActive 
      ? (document.getElementById('aiSearchResultsModal') || resultsContainer) 
      : (document.getElementById('aiSearchResults') || resultsContainer);

    if (!targetContainer) return;

    if (!query) {
      renderInitialState(targetContainer);
      return;
    }

    saveRecentSearch(query);
    
    // Extract intent FIRST  show parsing state
    const intent = extractIntent(query);
    
    // Pass intent  processing state  show what AI parsed
    renderProcessingState(targetContainer, intent);

    setTimeout(() => {
      if (query.toLowerCase() === 'oile') {
        renderTypoMatchState(targetContainer, 'oil', 'oile');
        return;
      }

      if (query.toLowerCase() === 'xyz12345' || query.toLowerCase() === 'scuba') {
        renderNoMatchState(targetContainer, query);
        return;
      }

      renderSearchResultPage(targetContainer, query, intent);
    }, 800); // Increased delay slightly to let user see the parsing state
  }

  function renderInitialState(container) {
    const target = container || resultsContainer;
    if (!target) return;

    const recents = getRecentSearches();
    const recentsHtml = recents.map(r => `
      <button class="search-prompt-btn" data-prompt="${escapeHtml(r)}">🕒 ${escapeHtml(r)}</button>
    `).join('');

    target.innerHTML = `
      <div class="search-prompts-group" style="margin-bottom: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
          <span class="search-prompt-label" style="margin: 0;">RECENT SEARCHES</span>
          <button onclick="window.clearRecentSearches()" style="background: none; border: none; color: var(--accent-cyan); font-size: 11px; font-weight: 600; cursor: pointer;">CLEAR HISTORY</button>
        </div>
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          ${recentsHtml}
        </div>
      </div>

      <div class="search-prompts-group">
        <span class="search-prompt-label">TRY ASKING FOR INTENT</span>
        <button class="search-prompt-btn" data-prompt="Something for a winter evening in Dhaka">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>Something for a winter evening in Dhaka
        </button>
        <button class="search-prompt-btn" data-prompt="I need something comfortable for a long flight">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>Comfortable for a long flight
        </button>
        <button class="search-prompt-btn" data-prompt="A birthday gift for my brother under 8000">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>Birthday gift for my brother under BDT8,000
        </button>
        <button class="search-prompt-btn" data-prompt="Minimal everyday sneakers">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>Minimal everyday sneakers
        </button>
      </div>
    `;
  }

  function renderProcessingState(container, intent) {
    const target = container || resultsContainer;
    if (!target) return;

    let parsedChipsHtml = '';
    if (intent) {
      const intentChips = [];
      if (intent.occasion) intentChips.push(intent.occasion);
      if (intent.climate)  intentChips.push(intent.climate);
      if (intent.location) intentChips.push(intent.location);
      if (intent.recipient) intentChips.push('Recipient: ' + intent.recipient);
      if (intent.budgetMax) intentChips.push('Under BDT ' + intent.budgetMax.toLocaleString());
      
      if (intentChips.length > 0) {
        parsedChipsHtml = `
          <div style="margin-top: 24px; text-align: center;">
            <div style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-cyan); margin-bottom: 12px;">PARSING INTENT...</div>
            <div class="intent-chips-wrapper" style="justify-content: center;">
              ${intentChips.map(c => `<span class="intent-chip" style="opacity: 0.7; animation: pulse 1.5s infinite;">${c}</span>`).join('')}
            </div>
          </div>
          <style>@keyframes pulse { 0% { opacity: 0.4; } 50% { opacity: 0.9; } 100% { opacity: 0.4; } }</style>
        `;
      }
    }

    target.innerHTML = `
      <div class="ai-processing-state" style="padding: 40px 0; text-align: center;">
        <span class="ai-indicator"></span>
        <span style="font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); margin-top: 12px; display: block;">UNDERSTANDING YOUR REQUEST...</span>
        ${parsedChipsHtml}
      </div>
    `;
  }

  function renderSearchResultPage(container, query, preParsedIntent) {
    const target = container || resultsContainer;
    if (!target) return;

    const intent = preParsedIntent || extractIntent(query);
    let matchedProducts = [...CATALOG_DB];

    if (intent.budgetMax) {
      matchedProducts = matchedProducts.filter(p => p.price <= intent.budgetMax);
    }

    const qLower = query.toLowerCase();
    if (!intent.occasion && !intent.climate && !intent.budgetMax) {
      matchedProducts = matchedProducts.filter(p => 
        p.name.toLowerCase().includes(qLower) || 
        p.category.toLowerCase().includes(qLower) ||
        p.tags.some(t => t.includes(qLower))
      );
    }

    if (matchedProducts.length === 0) {
      renderNoMatchState(target, query);
      return;
    }

    const intentChips = [];
    if (intent.occasion) intentChips.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>${intent.occasion}`);
    if (intent.climate)  intentChips.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>${intent.climate}`);
    if (intent.location) intentChips.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>${intent.location}`);
    if (intent.recipient) intentChips.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>Recipient: ${intent.recipient}`);
    if (intent.budgetMax) intentChips.push(`<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>Under BDT ${intent.budgetMax.toLocaleString()}`);

    const chipsHtml = intentChips.length > 0 ? `
      <div class="intent-extraction-box">
        <div style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary);">UNDERSTOOD AS</div>
        <div class="intent-chips-wrapper">
          ${intentChips.map(c => `<span class="intent-chip">${c}</span>`).join('')}
        </div>
      </div>
    ` : '';

    const cardsHtml = matchedProducts.map(p => `
      <div class="ai-recommendation-card" data-id="${p.id}">
        <div class="ai-card-img-wrap">
          <img src="${p.image}" alt="${escapeHtml(p.name)}" />
        </div>

        <div class="ai-card-details">
          <span class="match-indicator-badge">${escapeHtml(p.matchBadge)}</span>
          <h4 class="type-her&#10003; style="font-size: 22px; line-height: 1.1; font-weight: 500; margin: 4px 0;">${escapeHtml(p.name)}</h4>
          <div class="ai-card-price">${p.formattedPrice}</div>
        </div>

        <div class="ai-reasoning-box" style="margin-top: 8px; padding: 12px; background: rgba(0,200,255,0.03); border: 1px solid rgba(0,200,255,0.12); border-radius: 8px;">
          <div style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--accent-cyan);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-0.125em; margin-right:4px;"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>WHY IT FITS</div>
          <div style="font-family: var(--font-body); font-size: 13px; line-height: 1.5; color: var(--text-secondary); margin-top: 4px;">"${escapeHtml(p.reasoning)}"</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 14px;">
          <button class="btn-primary-commerce btn-view-product" data-id="${p.id}" style="width: 100%; height: 44px;">VIEW PRODUCT</button>
          <button class="link-text-nav why-this-toggle" data-id="${p.id}" style="align-self: center; font-size: 12px; color: var(--accent-cyan);">See why &rarr;</button>
        </div>
      </div>
    `).join('');

    target.innerHTML = `
      ${chipsHtml}

      <div style="margin-bottom: 24px;">
        <span style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary);">RESULTS FOR YOUR REQUEST</span>
        <h3 style="font-family: var(--font-serif); font-size: 32px; font-weight: 500; color: var(--text-primary); margin-top: 4px;">"${escapeHtml(query)}"</h3>
      </div>

      <div class="search-results-grid">
        ${cardsHtml}
      </div>

      <!-- Conversational Refinement Bar -->
      <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid var(--border-subtle);">
        <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary);">REFINE YOUR SEARCH</span>
        <div class="refinement-chip-bar">
          <button class="refinement-chip">More minimal</button>
          <button class="refinement-chip">Less expensive</button>
          <button class="refinement-chip">Warmer</button>
          <button class="refinement-chip">More casual</button>
          <button class="refinement-chip">Show my size</button>
        </div>
      </div>
    `;
  }


  function handleRefinementChipClick(btn, chipText) {
    document.querySelectorAll('.refinement-chip').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');

    if (chipText.includes('Less expensive')) {
      executeSearch('under 15000');
    } else if (chipText.includes('Warmer')) {
      executeSearch('winter outerwear for Dhaka');
    } else if (chipText.includes('casual')) {
      executeSearch('casual relaxed fit');
    } else {
      executeSearch(chipText);
    }
  }

  function openWhyThisMatchesModal(productId) {
    const item = CATALOG_DB.find(p => p.id === productId) || CATALOG_DB[0];
    const whyItemsHtml = item.whyExpanded.map(w => `
      <div class="evidence-item">
        <span class="evidence-check">&#10003;</span>
        <div>
          <strong style="color: #F5F7FA;">${escapeHtml(w.label.replace('&#10003; ', ''))}</strong>
          <div style="color: var(--text-secondary); font-size: 12px; margin-top: 2px;">${escapeHtml(w.desc)}</div>
        </div>
      </div>
    `).join('');

    const modal = document.createElement('div');
    modal.className = 'why-matches-overlay';
    modal.id = 'whyMatchesModal';
    modal.innerHTML = `
      <div class="why-matches-card">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span style="font-family: var(--font-body); font-size: 10px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--accent-cyan);">WHY THIS MATCHES</span>
          <button onclick="document.getElementById('whyMatchesModal').remove()" style="background: none; border: none; color: var(--text-secondary); font-size: 20px; cursor: pointer;">&times;</button>
        </div>

        <h3 class="why-matches-title">${escapeHtml(item.name)}</h3>
        <p style="font-family: var(--font-body); font-size: 13px; line-height: 1.6; color: var(--text-secondary);">"${escapeHtml(item.reasoning)}"</p>

        <div class="evidence-list">
          ${whyItemsHtml}
        </div>

        <button class="btn-primary-commerce" style="height: 48px; margin-top: 8px;" onclick="document.getElementById('whyMatchesModal').remove()">GOT IT</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  function renderTypoMatchState(container, corrected, original) {
    const target = container || resultsContainer || document.getElementById('aiSearchResultsModal') || document.getElementById('aiSearchResults');
    if(target) target.innerHTML = `
      <div class="typo-did-you-mean">
        Showing results for <strong>"${corrected}"</strong>.
        <button onclick="executeSearch('${original}')">Search instead for "${original}"</button>
      </div>
    `;
    renderSearchResultPage(corrected);
  }

  function renderNoMatchState(container, query) {
    const target = container || resultsContainer || document.getElementById('aiSearchResultsModal') || document.getElementById('aiSearchResults');
    if(target) target.innerHTML = `
      <div style="padding: 40px 20px; text-align: center; background: #0B2147; border: 1px solid var(--border-subtle); border-radius: 14px;">
        <span style="font-family: var(--font-body); font-size: 11px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-secondary);">NOTHING FOUND</span>
        <h3 style="font-family: var(--font-serif); font-size: 32px; font-weight: 500; color: var(--text-primary); margin: 8px 0;">We couldn't find an exact match</h3>
        <p style="font-family: var(--font-body); font-size: 14px; color: var(--text-secondary); max-width: 400px; margin: 0 auto 24px; line-height: 1.6;">
          Try a different description or explore these popular categories.
        </p>

        <div style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
          <a href="category.html" class="preference-chip" style="text-decoration: none;">APPAREL</a>
          <a href="category.html" class="preference-chip" style="text-decoration: none;">FOOTWEAR</a>
          <a href="category.html" class="preference-chip" style="text-decoration: none;">ACCESSORIES</a>
        </div>
      </div>
    `;
  }

  function saveSearchContext(productId) {
    const contextData = {
      productId: productId,
      query: input ? input.value : 'winter evening in dhaka',
      timestamp: new Date().toISOString()
    };
    try {
      sessionStorage.setItem('nexcommerce_search_context', JSON.stringify(contextData));
    } catch (e) {}
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  //  Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAISearchEngine);
  } else {
    initAISearchEngine();
  }
})();

