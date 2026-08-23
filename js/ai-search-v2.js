/* ==========================================================================
   nexCommerce &mdash; AI Search Engine v2
   Feature 1: Intelligent Discovery (Level 1 UI Prototype)
   
   Spec compliance:
   - FR-1  Natural-language input
   - FR-2  Intent extraction (occasion, climate, location, budget, recipient)
   - FR-3  Missing info handled gracefully ( forced fields)
   - FR-4  Removable context chips (AC-3 compliance)
   - FR-5  Only real catalog products shown
   - FR-6  "Why it fits" per card
   - FR-7  Refinement preserves prior context
   - FR-8  Reset/clear search
   - AC-7  AI failure fallback  keyword search
   <!-- TODO: Wire to real AI API (Level 2) -->
   ========================================================================== */

(function (window) {
  'use strict';

  /* ── Catalog (source of truth &mdash; AI never invents products) ── */
  const CATALOG = [
    {
      id: 'p1',
      name: 'Architectural Cashmere Sweater',
      category: 'Apparel',
      price: 184.00,
      formattedPrice: '€ 184.00',
      image: 'assets/images/products/hero_sweater.png',
      matchBadge: 'Best Match',
      reasoning: 'Warm enough after sunset without feeling heavy. Ideal for 18°C Milan evenings.',
      whyExpanded: [
        { label: 'Evening temperature', desc: 'Designed for cooler evening conditions (15&ndash;20°C).' },
        { label: 'Your style', desc: 'Minimal silhouette with a clean, relaxed structure.' },
        { label: 'Comfort', desc: 'Lightweight construction avoids excessive warmth.' },
        { label: 'Location', desc: "Suitable for European mild winter evenings." }
      ],
      tags: ['evening', 'cool', 'milan', 'minimal', 'warm', 'sweater', 'cashmere', 'apparel', 'winter', 'layer']
    },
    {
      id: 'p2',
      name: 'Monolith Runner GT',
      category: 'Footwear',
      price: 245.00,
      formattedPrice: '€ 245.00',
      image: 'assets/images/products/prod_runner.png',
      matchBadge: 'Excellent Fit',
      reasoning: 'Cushioned carbon-sole build designed for extended city walking and travel comfort.',
      whyExpanded: [
        { label: 'Travel comfort', desc: 'Carbon-plate shock absorption for long walks.' },
        { label: 'Breathability', desc: 'Engineered mesh allows natural airflow.' },
        { label: 'Durability', desc: 'Reinforced outsole built for urban terrain.' }
      ],
      tags: ['footwear', 'shoe', 'sneaker', 'run', 'travel', 'flight', 'comfort', 'casual', 'minimal', 'everyday']
    },
    {
      id: 'p3',
      name: 'Wireless Precision Earbuds',
      category: 'Acoustics',
      price: 142.00,
      formattedPrice: '€ 142.00',
      image: 'assets/images/products/search_earbuds.png',
      matchBadge: 'Good Match',
      reasoning: 'Ergonomic in-ear fit with high-fidelity sound and seamless device switching for travel.',
      whyExpanded: [
        { label: 'Everyday carry', desc: 'Sleek matte-black case fits any pocket.' },
        { label: 'High fidelity', desc: 'Precision acoustics with active noise isolation.' }
      ],
      tags: ['acoustics', 'audio', 'music', 'earbuds', 'work', 'office', 'travel', 'flight', 'commute', 'gift']
    },
    {
      id: 'p4',
      name: 'Acoustic Over-Ear Headphones',
      category: 'Acoustics',
      price: 320.00,
      formattedPrice: '€ 320.00',
      image: 'assets/images/products/prod_headphones.png',
      matchBadge: 'Highly Rated',
      reasoning: 'Active noise cancellation with a 40-hour battery life &mdash; ideal for focused work or long journeys.',
      whyExpanded: [
        { label: 'Noise cancellation', desc: 'Blocks environmental noise for complete focus.' },
        { label: 'Premium materials', desc: 'Lambskin ear cushions with anodized aluminum.' }
      ],
      tags: ['acoustics', 'headphones', 'audio', 'travel', 'focus', 'work', 'office', 'gift', 'noise cancellation']
    }
  ];

  /* ── Intent extraction from natural language ── */
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
    if (/winter|cold|cool|18.c|chilly|freeze/.test(q)) climate = 'Cool weather';
    else if (/summer|warm|hot|humid/.test(q)) climate = 'Warm climate';

    let location = null;
    if (/milan|milano/.test(q)) location = 'Milan';
    else if (/munich|münchen/.test(q)) location = 'Munich';
    else if (/paris/.test(q)) location = 'Paris';
    else if (/berlin/.test(q)) location = 'Berlin';
    else if (/dhaka/.test(q)) location = 'Dhaka';

    let style = null;
    if (/minimal|minimal|clean|simple|understated/.test(q)) style = 'Minimal';
    else if (/casual|relaxed|laid.back/.test(q)) style = 'Casual';
    else if (/formal|smart|tailored/.test(q)) style = 'Formal';

    let budgetMax = null;
    const matchUnder = q.match(/under\s*(?:€|eur|euros?|bdt)?\s*([\d,]+k?)/i) || q.match(/less\s*than\s*(?:€|eur|euros?|bdt)?\s*([\d,]+k?)/i);
    const matchAround = q.match(/around\s*(?:€|eur|euros?|bdt)?\s*([\d,]+k?)/i);
    if (matchUnder) budgetMax = parseAmount(matchUnder[1]);
    else if (matchAround) budgetMax = parseAmount(matchAround[1]) * 1.15;

    let recipient = null;
    if (/brother/.test(q)) recipient = 'Brother';
    else if (/sister/.test(q)) recipient = 'Sister';
    else if (/friend/.test(q)) recipient = 'Friend';

    return { occasion, climate, location, style, budgetMax, recipient };
  }

  function parseAmount(val) {
    const s = val.toLowerCase().replace(/,/g, '').replace('bdt', '').trim();
    if (s.endsWith('k')) return parseFloat(s) * 1000;
    return parseFloat(s);
  }

  /* ── Active Context State ── */
  // Tracks current intent dimensions &mdash; removable by customer (AC-3)
  let activeContext = {};
  let activeQuery = '';

  function buildContextFromIntent(intent) {
    const ctx = {};
    if (intent.occasion) ctx.occasion = intent.occasion;
    if (intent.climate)  ctx.climate  = intent.climate;
    if (intent.location) ctx.location = intent.location;
    if (intent.style)    ctx.style    = intent.style;
    if (intent.budgetMax) ctx.budget  = 'Under € ' + Math.round(intent.budgetMax).toLocaleString();
    if (intent.recipient) ctx.recipient = 'For ' + intent.recipient;
    return ctx;
  }

  function mergeRefinementContext(refinementText, currentCtx) {
    // Preserve existing context and layer the refinement on top (FR-7)
    const q = refinementText.toLowerCase();
    const merged = { ...currentCtx };

    if (/less expensive|cheaper|budget/.test(q)) {
      // Reduce budget cap by roughly 30%
      const currentBudget = Object.values(CATALOG).reduce((max, p) => Math.max(max, p.price), 0);
      merged.budget = 'Under € ' + Math.round(currentBudget * 0.6).toLocaleString();
    }
    if (/more casual|casual/.test(q)) merged.style = 'Casual';
    if (/more minimal|minimal/.test(q)) merged.style = 'Minimal';
    if (/warmer|warm/.test(q)) merged.climate = 'Warm climate';
    if (/cooler|cool/.test(q)) merged.climate = 'Cool weather';

    return merged;
  }

  /* ── Product matching ── */
  function matchProducts(query, ctx) {
    let results = [...CATALOG];

    // Budget filter (spec: must not exceed budget unless labeled alternative)
    if (ctx.budget) {
      const limitMatch = ctx.budget.match(/[\d,]+/);
      if (limitMatch) {
        const limit = parseInt(limitMatch[0].replace(/,/g, ''));
        results = results.filter(p => p.price <= limit);
      }
    }

    // If  intent context was extracted, use keyword fallback
    const hasContext = ctx.occasion || ctx.climate || ctx.location || ctx.style;
    if (!hasContext && query) {
      const qL = query.toLowerCase();
      const filtered = results.filter(p =>
        p.name.toLowerCase().includes(qL) ||
        p.category.toLowerCase().includes(qL) ||
        p.tags.some(t => t.includes(qL) || qL.includes(t))
      );
      if (filtered.length > 0) results = filtered;
    }

    return results;
  }

  /* ── Render Functions ── */

  function renderProcessingState() {
    const grid = document.getElementById('discoveryResultsGrid');
    const header = document.getElementById('discoveryResultsHeader');
    const section = document.getElementById('discoveryResultsSection');
    const heroSection = document.getElementById('discoveryHeroSection');

    if (heroSection) heroSection.style.paddingBottom = '32px';
    if (section) section.style.display = 'block';
    if (header) header.innerHTML = '';
    if (grid) {
      grid.innerHTML = `
        <div class="discovery-processing" style="grid-column: 1 / -1;">
          <div class="discovery-processing-dots">
            <div class="discovery-processing-dot"></div>
            <div class="discovery-processing-dot"></div>
            <div class="discovery-processing-dot"></div>
          </div>
          <span class="discovery-processing-text">Understanding your request…</span>
        </div>
      `;
    }
    const _ctxBar = document.getElementById('discoveryContextBar');
    const _refBar = document.getElementById('discoveryRefinementBar');
    if (_ctxBar) _ctxBar.style.display = 'none';
    if (_refBar) _refBar.style.display = 'none';
  }

  function renderResults(query, ctx, products) {
    const section = document.getElementById('discoveryResultsSection');
    const contextBar = document.getElementById('discoveryContextBar');
    const contextChips = document.getElementById('discoveryContextChips');
    const header = document.getElementById('discoveryResultsHeader');
    const grid = document.getElementById('discoveryResultsGrid');
    const refinementBar = document.getElementById('discoveryRefinementBar');

    if (section) section.style.display = 'block';

    // ── Context chips ──
    const ctxKeys = Object.keys(ctx);
    if (ctxKeys.length > 0 && contextBar && contextChips) {
      contextBar.style.display = 'flex';
      contextChips.innerHTML = ctxKeys.map(key => {
        const label = ctx[key];
        return `
          <span class="discovery-intent-chip" data-ctx-key="${escHtml(key)}">
            ${escHtml(label)}
            <button class="discovery-chip-remove" data-remove-key="${escHtml(key)}" aria-label="Remove ${escHtml(label)} from search context">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </span>
        `;
      }).join('');
    } else if (contextBar) {
      contextBar.style.display = 'none';
    }

    // ── Results header ──
    if (header) {
      header.innerHTML = products.length > 0 ? `
        <span class="discovery-results-eyebrow">Pieces curated for you</span>
        <div class="discovery-results-query">"${escHtml(query)}"</div>
        <div class="discovery-results-count">${products.length} item${products.length !== 1 ? 's' : ''} found</div>
      ` : '';
    }

    // ── Product cards ──
    if (!grid) return;

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="discovery-no-results" style="grid-column: 1 / -1;">
          <p style="font-size:28px;margin-bottom:12px;">🔍</p>
          <h2 class="discovery-no-results-title">Nothing found for that request</h2>
          <p class="discovery-no-results-body">Try a different description, or explore our categories below.</p>
          <div style="display:flex;justify-content:center;gap:12px;flex-wrap:wrap;">
            <a href="category.html?cat=apparel" class="discovery-prompt-chip">Apparel</a>
            <a href="category.html?cat=footwear" class="discovery-prompt-chip">Footwear</a>
            <a href="category.html?cat=audio" class="discovery-prompt-chip">Acoustics</a>
          </div>
        </div>
      `;
      if (refinementBar) refinementBar.style.display = 'none';
      return;
    }

    grid.innerHTML = products.map((p, i) => `
      <div class="discovery-card" style="animation-delay:${i * 60}ms;">
        <div class="discovery-card-image">
          <img src="${escHtml(p.image)}" alt="${escHtml(p.name)}" loading="lazy" />
          <span class="discovery-card-match-badge">${escHtml(p.matchBadge)}</span>
        </div>
        <div class="discovery-card-body">
          <span class="discovery-card-category">${escHtml(p.category)}</span>
          <h2 class="discovery-card-name">${escHtml(p.name)}</h2>
          <div class="discovery-card-price">${escHtml(p.formattedPrice)}</div>
          <div class="discovery-card-reasoning">
            <div class="discovery-card-reasoning-label">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M3 5h4"/></svg>
              Why it fits
            </div>
            <div class="discovery-card-reasoning-text">${escHtml(p.reasoning)}</div>
          </div>
        </div>
        <div class="discovery-card-actions">
          <button class="btn-primary-commerce discovery-view-btn" data-product-id="${escHtml(p.id)}" aria-label="View ${escHtml(p.name)}">
            VIEW PRODUCT
          </button>
          <button class="discovery-why-btn" data-why-id="${escHtml(p.id)}" aria-label="See detailed reasoning for ${escHtml(p.name)}">
            See why this fits &rarr;
          </button>
        </div>
      </div>
    `).join('');

    if (refinementBar) refinementBar.style.display = 'flex';
  }

  function renderKeywordFallback(query) {
    // AC-7: AI unavailable &mdash; keyword search only
    const qL = query.toLowerCase();
    const results = CATALOG.filter(p =>
      p.name.toLowerCase().includes(qL) ||
      p.category.toLowerCase().includes(qL) ||
      p.tags.some(t => t.includes(qL))
    );
    renderResults(query, {}, results.length ? results : CATALOG.slice(0, 2));
  }

  /* ── Why it fits modal ── */
  function openWhyModal(productId) {
    const p = CATALOG.find(x => x.id === productId);
    if (!p) return;

    const modal = document.getElementById('whyMatchesModal');
    const content = document.getElementById('whyMatchesContent');
    if (!modal || !content) return;

    content.innerHTML = `
      <div class="why-matches-product-name">${escHtml(p.name)}</div>
      <div class="why-matches-reasoning">"${escHtml(p.reasoning)}"</div>
      <div class="why-evidence-list">
        ${p.whyExpanded.map(w => `
          <div class="why-evidence-item">
            <div class="why-evidence-check">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <div class="why-evidence-label">${escHtml(w.label)}</div>
              <div class="why-evidence-desc">${escHtml(w.desc)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    modal.style.display = 'flex';
  }

  /* ── Save context to sessionStorage for AI Context Retention (Feature 2) ── */
  function saveSearchContext(productId, query, ctx) {
    try {
      sessionStorage.setItem('nexcommerce_search_context', JSON.stringify({
        productId,
        query,
        context: ctx,
        timestamp: new Date().toISOString()
      }));
    } catch (_) {}
  }

  /* ── Main search execution ── */
  let aiFailureMode = false;

  function executeSearch(query, isRefinement) {
    const raw = (query || '').trim();
    if (!raw) return;

    activeQuery = raw;

    // Show input clear button
    const clearBtn = document.getElementById('discoveryClearBtn');
    if (clearBtn) clearBtn.style.display = 'flex';

    // Collapse hero section
    const hero = document.getElementById('discoveryHeroSection');
    if (hero) hero.style.paddingBottom = '24px';

    // Hide example prompts when results are showing
    const prompts = document.getElementById('discoveryPrompts');
    if (prompts) prompts.style.opacity = '0.5';

    renderProcessingState();

    // Simulated AI processing delay (CF-7: immediate feedback, then result)
    setTimeout(() => {
      if (aiFailureMode) {
        // AC-7: graceful degradation  keyword search
        renderKeywordFallback(raw);
        return;
      }

      const intent = extractIntent(raw);

      if (isRefinement) {
        // FR-7: merge refinement into existing context, don't discard it
        activeContext = mergeRefinementContext(raw, activeContext);
      } else {
        activeContext = buildContextFromIntent(intent);
      }

      const products = matchProducts(raw, activeContext);
      renderResults(raw, activeContext, products);
    }, 600);
  }

  function resetSearch() {
    activeContext = {};
    activeQuery = '';

    const clearBtn = document.getElementById('discoveryClearBtn');
    if (clearBtn) clearBtn.style.display = 'none';

    const mainInput = document.getElementById('discoveryMainInput');
    if (mainInput) { mainInput.value = ''; mainInput.focus(); }

    const section = document.getElementById('discoveryResultsSection');
    if (section) section.style.display = 'none';

    const hero = document.getElementById('discoveryHeroSection');
    if (hero) hero.style.paddingBottom = '64px';

    const prompts = document.getElementById('discoveryPrompts');
    if (prompts) prompts.style.opacity = '1';
  }

  /* ── Chip removal (AC-3: editable intent) ── */
  function removeContextKey(key) {
    delete activeContext[key];

    // Re-run search with updated context
    const products = matchProducts(activeQuery, activeContext);
    renderResults(activeQuery, activeContext, products);
  }

  /* ── Event wiring ── */
  function init() {
    // Main input submit
    const mainInput = document.getElementById('discoveryMainInput');
    const submitBtn = document.getElementById('discoverySubmitBtn');
    const clearBtn  = document.getElementById('discoveryClearBtn');
    const resetBtn  = document.getElementById('discoveryResetBtn');

    if (mainInput) {
      mainInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') { e.preventDefault(); executeSearch(mainInput.value); }
      });
      mainInput.addEventListener('input', () => {
        if (clearBtn) clearBtn.style.display = mainInput.value ? 'flex' : 'none';
      });
    }

    if (submitBtn) submitBtn.addEventListener('click', () => executeSearch(mainInput?.value));

    if (clearBtn) clearBtn.addEventListener('click', () => {
      if (mainInput) mainInput.value = '';
      clearBtn.style.display = 'none';
    });

    if (resetBtn) resetBtn.addEventListener('click', resetSearch);

    // Example prompt chips
    document.querySelectorAll('.discovery-prompt-chip[data-prompt]').forEach(chip => {
      chip.addEventListener('click', () => {
        const prompt = chip.getAttribute('data-prompt');
        if (mainInput) mainInput.value = prompt;
        executeSearch(prompt);
      });
    });

    // Refinement chips (preserve context &mdash; FR-7)
    document.addEventListener('click', e => {
      const refChip = e.target.closest('.discovery-refinement-chip[data-refine]');
      if (refChip) {
        document.querySelectorAll('.discovery-refinement-chip').forEach(c => c.classList.remove('active'));
        refChip.classList.add('active');
        executeSearch(refChip.getAttribute('data-refine'), true);
        return;
      }

      // Context chip remove button (AC-3)
      const removeBtn = e.target.closest('.discovery-chip-remove[data-remove-key]');
      if (removeBtn) {
        removeContextKey(removeBtn.getAttribute('data-remove-key'));
        return;
      }

      // View product
      const viewBtn = e.target.closest('.discovery-view-btn[data-product-id]');
      if (viewBtn) {
        const id = viewBtn.getAttribute('data-product-id');
        saveSearchContext(id, activeQuery, activeContext);
        window.location.href = `product.html?id=${id}`;
        return;
      }

      // Why button
      const whyBtn = e.target.closest('.discovery-why-btn[data-why-id]');
      if (whyBtn) {
        openWhyModal(whyBtn.getAttribute('data-why-id'));
        return;
      }
    });

    // Why modal close on backdrop click
    const whyModal = document.getElementById('whyMatchesModal');
    if (whyModal) {
      whyModal.addEventListener('click', e => {
        if (e.target === whyModal) whyModal.style.display = 'none';
      });
    }

    // Keyboard shortcut: Esc closes why modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        const modal = document.getElementById('whyMatchesModal');
        if (modal && modal.style.display !== 'none') {
          modal.style.display = 'none';
        }
      }
    });

    // Parse URL param if arriving from another page
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get('q');
    if (urlQuery) {
      if (mainInput) mainInput.value = urlQuery;
      executeSearch(urlQuery);
    }

    // Wire legacy search overlay (CMD+K)
    initSearchOverlay();
  }

  /* ── Global search overlay (CMD+K) &mdash; unchanged behavior ── */
  function initSearchOverlay() {
    const overlay = document.getElementById('aiSearchModal');
    if (!overlay) return;

    const backdrop = overlay.querySelector('.search-backdrop');
    const input    = overlay.querySelector('.search-ai-input');
    const closeBtn = overlay.querySelector('.search-close-btn');

    const open  = () => { overlay.classList.add('active'); document.body.style.overflow = 'hidden'; setTimeout(() => input && input.focus(), 150); };
    const close = () => { overlay.classList.remove('active'); document.body.style.overflow = ''; };

    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
      if (e.key === 'Escape' && overlay.classList.contains('active')) close();
    });

    document.querySelectorAll('#searchTriggerBtn, .nav-search-trigger').forEach(t => t.addEventListener('click', open));
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (backdrop) backdrop.addEventListener('click', close);
    if (input) {
      input.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          const val = input.value.trim();
          if (!val) return;
          close();
          if (window.location.pathname.includes('discovery')) {
            const mainInput = document.getElementById('discoveryMainInput');
            if (mainInput) mainInput.value = val;
            executeSearch(val);
          } else {
            window.location.href = `discovery.html?q=${encodeURIComponent(val)}`;
          }
        }
      });
    }
  }

  /* ── AI failure simulation (AC-7 demo) ── */
  window.NexDiscovery = {
    toggleAIFailure() {
      aiFailureMode = !aiFailureMode;
      const notice   = document.getElementById('aiFailureNotice');
      const devBtn   = document.getElementById('toggleAIFailureBtn');
      if (notice) notice.style.display = aiFailureMode ? 'flex' : 'none';
      if (devBtn) devBtn.textContent = aiFailureMode ? 'Restore AI' : 'Simulate AI failure';
      if (aiFailureMode && activeQuery) executeSearch(activeQuery);
    },
    disableAIFailure() {
      aiFailureMode = false;
      const notice = document.getElementById('aiFailureNotice');
      const devBtn = document.getElementById('toggleAIFailureBtn');
      if (notice) notice.style.display = 'none';
      if (devBtn) devBtn.textContent = 'Simulate AI failure';
    }
  };

  /* ── Utility ── */
  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ── Boot ── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})(window);
